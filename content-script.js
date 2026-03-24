const fs = require('fs');
const path = require('path');

const targetFilename = 'toc.md';
let rootDir;  // Нужно, чтобы отгрызть корень от итогового пути и получить т.о. относительный путь

/**
 * Проверяет, является ли файл .md файлом
 */
function isMarkdownFile(filename) {
  return filename.toLowerCase().endsWith('.md');
}

/**
 * Извлекает заголовки из .md файла
 */
function extractHeadersFromMarkdown(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const headers = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Ищем строки, начинающиеся с 1-6 символов # и пробела
      const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (headerMatch) {
        const level = headerMatch[1].length; // Количество # определяет уровень
        const title = headerMatch[2].trim();
        headers.push({ level, title });
      }
    }

    return headers;
  } catch (error) {
    console.error(`Ошибка при чтении файла ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Рекурсивно обходит директорию и собирает структуру
 */
function scanDirectory(dirPath, depth = 0) {
  let structure = [];

  try {
    const items = fs.readdirSync(dirPath);

    // Сортируем: сначала папки, потом файлы
    const sortedItems = items.sort((a, b) => {
      const aPath = path.join(dirPath, a);
      const bPath = path.join(dirPath, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();

      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    for (const item of sortedItems) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory() && !item.startsWith('.') && !item.startsWith('img')) {
        // Добавляем директорию
        structure.push({
          type: 'directory',
          name: item,
		  path: itemPath,
          depth,
          children: scanDirectory(itemPath, depth + 1)
        });
      } else if (stat.isFile() && isMarkdownFile(item) && !(item === targetFilename)) {
        // Добавляем .md файл
        const headers = extractHeadersFromMarkdown(itemPath);
        structure.push({
          type: 'file',
          name: item,
		  path: itemPath,
          depth,
          headers: headers
        });
      }
      // Игнорируем другие файлы
    }
  } catch (error) {
    console.error(`Ошибка при сканировании директории ${dirPath}:`, error.message);
  }

  return structure;
}

/**
 * Преобразует структуру в Markdown список
 */
function structureToMarkdown(structure) {
  let markdown = '';

  function addItem(item) {
    // Добавляем отступы согласно уровню вложенности
    const indent = '#'.repeat(item.depth + 1);

    // Добавляем элемент списка
    if (item.type === 'directory') {
      // markdown += `${indent} 📁 [${item.name}](${item.path})\n`;
	  markdown += `${indent} 📁 ${item.name}\n`;

      // Рекурсивно добавляем содержимое директории
      for (const child of item.children) {
        addItem(child);
      }
    } else if (item.type === 'file') {
      const link = customUriEncode(path.relative(rootDir, item.path));
	  const neatName = formatFileName(item.name);
      markdown += `${indent} 📄 [${neatName}](${link})\n`;

      // Добавляем заголовки из .md файла как подсписки
      if (item.headers && item.headers.length > 0) {
        for (const header of item.headers) {
          const headerIndent = '  '.repeat(item.depth + 1);
          const headerPrefix = '  '.repeat(header.level);
		  markdown += `${headerPrefix}- ${header.title}\n`;
        }
      }
    }
  }

  for (const item of structure) {
    addItem(item);
  }

  return markdown;
}

/**
 * Основная функция
 */
function main() {
  // Получаем путь из аргументов командной строки
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Пожалуйста, укажите путь к директории:');
    console.error('  node script.js <путь_к_директории>');
    process.exit(1);
  }
  
  rootDir = args[0];

  const targetDir = path.resolve(args[0]);

  // Проверяем, существует ли директория
  if (!fs.existsSync(targetDir)) {
    console.error(`Директория не существует: ${targetDir}`);
    process.exit(1);
  }

  if (!fs.statSync(targetDir).isDirectory()) {
    console.error(`Указанный путь не является директорией: ${targetDir}`);
    process.exit(1);
  }

  console.log(`Сканирование директории: ${targetDir}`);

  const structure = scanDirectory(targetDir);
  const markdownContent = structureToMarkdown(structure);
  const outputPath = path.join(targetDir, targetFilename);
  fs.writeFileSync(outputPath, markdownContent, 'utf8');

  console.log(`Файл content.md успешно создан: ${outputPath}`);
}

// Запускаем программу
if (require.main === module) {
  main();
}


// Ссылки в гите должны быть с /, а node-функции дают \, потому надо менять.
// На файловой системе ссылки с пробелами работают, в гите - нет. Поэтому надо пробелы менять на %20.
// Кириллицу гит понимает нормально, можно не менять.
function customUriEncode(path) {
  return path.replace(/ /g, '%20').replace(/\\/g, '/');
}

function formatFileName(filename) {
    // Убираем расширение .md
    const withoutExt = filename.replace(/\.md$/i, '');
    // Убираем "число - " в начале
    const withoutNumber = withoutExt.replace(/^\d+\s*-\s*/, '');
    
    return withoutNumber;
}