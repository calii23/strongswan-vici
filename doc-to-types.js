// Just a short script to convert the type definitions in the docs into a TypeScript interface

let [,,name = 'RawData', allOptional = 'false'] = process.argv;
allOptional = allOptional === 'true';

readFromStdin(data => process.stdout.write(toInterface(data, name, allOptional)));

function readFromStdin(callback) {
  let data = '';
  process.stdin.on('data', chunk => data += chunk);
  process.stdin.once('end', () => callback(data));
}

/**
 * @param {string} value
 * @return {string}
 */
function toCamelCase(value) {
  return value.replace(/[ -/<>]./g, substring => substring.charAt(1).toUpperCase());
}

/**
 * @param {string} value
 * @return {string}
 */
function toPascalCase(value) {
  return value.replace(/([ -/<>]|^)./g, substring => substring
      .charAt(substring.length - 1)
      .toUpperCase());
}

/**
 * @param {string} key
 * @return {string[]}
 */
function toTsKeys(key) {
  if (key.endsWith('*'))
    key = key.substring(0, key.length - 1);

  if (key.startsWith('<') && key.endsWith('>'))
    return [`[${toCamelCase(key.substring(1, key.length - 1))}: string]`];

  const keys = key.split(', ');

  if (key.includes('-') || key.includes(' '))
    return keys.map(key => `'${key}'`);

  return keys;
}

/**
 * @param {string[]} data
 * @param {number} from
 * @param {string[]} extraInterfaces
 * @param {boolean} allOptional
 * @return {[string, number]}
 */
function parseSection(data, from, extraInterfaces, allOptional) {
  let i = from;
  let result = '{';

  for (; i < data.length; i++) {
    const currentLine = data[i];
    if (currentLine === '}') break;
    const [key, value] = currentLine.split(/\s*=\s*/, 2);

    if (!value) {
      if (currentLine.startsWith('<') && currentLine.endsWith('>')) {
        return ['Section', i + 2];
      }

      throw new Error(`Invalid line in section: ${currentLine} (line: ${i + 2})`);
    }

    const tsKeys = toTsKeys(key);

    let valueType;
    let docs;

    if (value.startsWith('[')) {
      valueType = 'string[]';
      docs = data[++i];
      docs = docs.substring(1, docs.length - 1);
      i++;
    } else if (value.startsWith('{')) {
      const [section, end] = parseSection(data, i + 1, extraInterfaces, allOptional);
      i = end;
      if ((key.endsWith('*') && !key.includes('<')) || tsKeys.length > 1) {
        const interfaceName = 'Raw' + toPascalCase(key.split(',', 2)[0]
            .replace('*', ''));
        extraInterfaces.push(`export interface ${interfaceName} ${section}`);
        valueType = interfaceName;

        if (key.endsWith('*')) {
          valueType += ' | ' + interfaceName + '[]';
        }
      } else {
        valueType = section;
      }
      docs = value.includes('#') ? value.substring(value.indexOf('#') + 2) : null;
    } else {
      valueType = 'string';
      docs = value.substring(1, value.length - 1);

      const enumSearchResult = /\w+(?:\|\w+)+$/.exec(docs);
      if (enumSearchResult) {
        valueType = enumSearchResult[0]
            .split('|')
            .map(constant => `'${constant}'`)
            .join(' | ');
      } else if (docs.endsWith('yes or no')) {
        valueType = `'yes' | 'no'`;
      }
    }

    for (const tsKey of tsKeys) {
      if (docs) {
        result += `\n/**\n * ${docs}\n */`;
      }

      result += `\n${tsKey}${allOptional && !tsKey.includes(':') ? '?' : ''}: ${valueType};`;
    }
  }

  result += '\n}';

  return [result, i];
}

/**
 * @param {string} data
 * @param {string} name
 * @param {boolean} allOptional
 * @return {string}
 */
function toInterface(data, name, allOptional = false) {
  const lines = data
      .replace(/<[^>]*\n[^>]*>/gm, substring => substring.replace(/\n\s*/gm, ' '))
      .split('\n')
      .map(value => value.trim())
      .filter(value => value);

  lines.shift();
  lines.pop();

  const interfaces = [];
  interfaces.push(`export interface ${name} ${parseSection(lines, 0, interfaces, allOptional)[0]}`);

  return interfaces.join('\n\n');
}
