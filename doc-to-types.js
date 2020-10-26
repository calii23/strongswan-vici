// Just a short script to convert the type definitions in the docs into a TypeScript interface

readFromStdin(data => process.stdout.write(toInterface(data)));

function readFromStdin(callback) {
  let data = '';
  process.stdin.on('data', chunk => data += chunk);
  process.stdin.once('end', () => callback(data));
}

/**
 * @param {string} key
 * @return {string}
 */
function toTsKey(key) {
  if (key.startsWith('<') && key.endsWith('>')) {
    return `[${key.substring(1, key.length - 1).replace(/[ -/]./g, substring => substring.charAt(1).toUpperCase())}: string]`;
  }

  if (key.includes('-') || key.includes(' ')) {
    return `'${key}'`;
  }

  return key;
}

/**
 * @param {string[]} data
 * @param {number} from
 * @return {[string, number]}
 */
function parseSection(data, from) {
  let i = from;
  let result = '{';

  for (; i < data.length; i++) {
    const currentLine = data[i];
    if (currentLine === '}') break;
    const [key, value] = currentLine.split(/\s*=\s*/, 2);

    if (!value) {
      throw new Error(`Invalid line in section: ${currentLine} (line: ${i + 2})`);
    }

    let valueType;
    let docs;

    if (value.startsWith('[')) {
      valueType = 'string[]';
      docs = data[++i];
      docs = docs.substring(1, docs.length - 1);
      i++;
    } else if (value.startsWith('{')) {
      const [section, end] = parseSection(data, i + 1);
      i = end;
      valueType = section;
      docs = value.includes('#') ? value.substring(value.indexOf('#') + 2) : null;
    } else {
      valueType = 'string';
      docs = value.substring(1, value.length - 1);
    }

    if (docs) {
      result += `\n/**\n * ${docs}\n */`;
    }
    result += `\n${toTsKey(key)}: ${valueType};`;
  }

  result += '\n}';

  return [result, i];
}

/**
 * @param {string} data
 * @return {string}
 */
function toInterface(data) {
  const lines = data.split('\n')
      .map(value => value.trim());

  lines.shift();
  lines.pop();

  return 'interface Data ' + parseSection(lines, 0)[0];
}
