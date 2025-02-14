const fs = require('fs');
const path = require('path');

const tokensDirectory = './tokens'; // Directory containing your token files

// Function to flatten JSON and remove the $ prefix from keys
function flattenAndRemoveDollar(jsonObject) {
  const flattened = {};

  function recurse(current, prop) {
    if (Object(current) !== current) {
      flattened[prop] = current;
    } else {
      for (const p in current) {
        if (current.hasOwnProperty(p)) {
          recurse(current[p], prop ? `${prop}.${p}` : p);
        }
      }
    }
  }

  recurse(jsonObject, '');
  return flattened;
}

// Get all .json files in the 'tokens' directory
fs.readdir(tokensDirectory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.filter(file => file.endsWith('.json')).forEach(file => {
    const filePath = path.join(tokensDirectory, file);

    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      // Parse JSON data
      const jsonData = JSON.parse(data);

      // Flatten and remove $ prefix from type and value keys
      const flattenedData = flattenAndRemoveDollar(jsonData);

      // Remove the "$" prefix from keys
      const finalData = Object.fromEntries(
        Object.entries(flattenedData).map(([key, value]) => [
          key.replace(/^(\$)/, ''), value
        ])
      );

      // Write the flattened JSON back to a file
      const outputFilePath = path.join(tokensDirectory, `flattened-${file}`);
      fs.writeFile(outputFilePath, JSON.stringify(finalData, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log(`Successfully processed and saved: ${outputFilePath}`);
        }
      });
    });
  });
});
