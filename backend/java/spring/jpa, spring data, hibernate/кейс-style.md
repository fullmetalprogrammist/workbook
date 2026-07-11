







- Как через ORM описать связь между двумя сущностями?
  - Например, есть product [status_id] и product_status[id], как выразить эту связь через ORM?
  - Какие известные проблемы, тонкости связаны с описанием этих связей?



















# asdf



```java
package com.ths.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "brand_id", nullable = false)
    private Long brandId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private ProductStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
```

```java
package com.ths.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "brand_id", nullable = false)
    private Long brandId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private ProductStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
```

```java
package com.ths.product.service;

import com.ths.product.entity.Product;
import com.ths.product.producers.ProductEventProducer;
import com.ths.product.repository.ProductRepository;
import com.ths.product.repository.ProductStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductStatusRepository productStatusRepository;
    private final ProductEventProducer productEventProducer;

    public boolean productExists(Long id) {
        return productRepository.existsById(id);
    }

    public List<Product> getProductsByIds(List<Long> productIds) {
        return productRepository.findAllById(productIds);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // TODO: Посмотреть как это делать по-человечески
    @Transactional
    public void discontinueProduct(Long productId) {
        var status = productStatusRepository.findByCode("discontinued")  // TODO: возможно заменить на enum или даже есть более цивильные подходы?
                .orElseThrow();

        var product = productRepository.findById(productId)
                .orElseThrow();

        product.setStatus(status);
        productEventProducer.sendProductChangedEvent(productId);  // TODO: как эти два шага сделать транзакционно?
    }
}
```

```java
package com.ths.product.service;

import com.ths.product.grpc.v1.*;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.List;
import java.util.stream.Collectors;

@GrpcService
public class ProductGrpcService extends ProductServiceGrpc.ProductServiceImplBase {

    private final ProductService productService;

    public ProductGrpcService(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public void checkExists(
            ProductIdRequest request,
            StreamObserver<ExistsResponse> responseObserver
    ) {
        boolean exists = productService.productExists(request.getProductId());
        responseObserver.onNext(ExistsResponse.newBuilder().setExists(exists).build());
        responseObserver.onCompleted();
    }

    @Override
    public void getFavoriteProducts(
            FavoriteProductsRequest request,
            StreamObserver<FavoriteProductsResponse> responseObserver
    ) {
        List<Long> productIds = request.getProductIdsList();
        List<FavoriteProduct> products = productService.getProductsByIds(productIds).stream()
                .map(product -> FavoriteProduct.newBuilder()
                        .setProductId(product.getId())
                        .setTitle(product.getName())
                        .setPrice(product.getPrice().doubleValue())
                        .setStatus(product.getStatus().getTitle())  // !!! Тут как раз эта проблема - нет сессии
                        .build())
                .collect(Collectors.toList());

        responseObserver.onNext(FavoriteProductsResponse.newBuilder().addAllProducts(products).build());
        responseObserver.onCompleted();
    }

}
```

```
org.hibernate.LazyInitializationException: Could not initialize proxy [com.ths.product.entity.ProductStatus#1] - no session
```

