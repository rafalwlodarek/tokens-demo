const fs = require('fs');

// Flatten the object function
function flattenObject(obj, prefix = '') {
  let items = [];

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      // If the value is an object, recurse into it
      items = items.concat(flattenObject(value, newKey));
    } else {
      items.push({ name: newKey, value });
    }
  }

  return items;
}

// Remove `$` from value and type (if exists)
function removeDollarSign(tokens) {
  return tokens.map(token => {
    // Remove $ from the token name and value
    const newName = token.name.replace(/\$/g, '');
    let newValue = token.value;

    if (typeof newValue === 'string') {
      newValue = newValue.replace(/\$/g, ''); // Remove $ from the value
    }

    return { name: newName, value: newValue };
  });
}

// Load the input JSON file (assumes the input file is `tokens.json`)
const inputFile = './tokens.json';
const outputFile = './flattened-tokens.json';

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    return;
  }

  const inputJson = JSON.parse(data);

  // Flatten the JSON structure
  const flattenedTokens = flattenObject(inputJson);

  // Remove dollar signs from values and types
  const cleanedTokens = removeDollarSign(flattenedTokens);

  // Write the processed tokens back to a new JSON file
  fs.writeFile(outputFile, JSON.stringify({ tokens: cleanedTokens }, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error writing output file:', err);
    } else {
      console.log('Flattened and cleaned tokens written to', outputFile);
    }
  });
});
