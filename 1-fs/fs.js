import fs from 'fs';

async function readJsonFile(pathToFile) {
  const data = await fs.promises.readFile(pathToFile, 'utf8');
  return JSON.parse(data);
}

async function writeJsonFile(pathToFile, jsonData) {
  const stringOfData = JSON.stringify(jsonData, null, 2);
  await fs.promises.writeFile(pathToFile, stringOfData, 'utf8');
}

async function main() {
  try {
    if (process.argv.length <= 2) {
      console.log('Usage: node fs.js [read | create | update | destroy]');
      process.exit(1);
    }

    const jsonData = await readJsonFile('../pets.json');
    const argIndex = process.argv[3] ? Number(process.argv[3]) : undefined;

    switch (process.argv[2]) {
      case "read":
        if (argIndex !== undefined && !isNaN(argIndex) && argIndex >= 0 && argIndex < jsonData.length) {
          console.log(jsonData[argIndex]);
        } else if (argIndex === undefined) {
          console.log(jsonData);
        } else {
          console.log("Usage: node fs.js read INDEX");
        }
        break;
      
      case "create":
        if (process.argv.length < 6 || isNaN(argIndex)) {
          console.log('Usage: node fs.js create AGE KIND NAME');
          process.exit(1);
        }
        const newEntry = {
          Age: argIndex,
          Kind: process.argv[4],
          Name: process.argv[5]
        };
        jsonData.push(newEntry);
        await writeJsonFile('../pets.json', jsonData);
        console.log('New entry created:', newEntry);
        break;

      case "update":
        if (process.argv.length < 7 || isNaN(argIndex) || argIndex < 0 || argIndex >= jsonData.length) {
          console.log('Usage: node fs.js update INDEX AGE KIND NAME');
          process.exit(1);
        }
        jsonData[argIndex] = {
          Age: Number(process.argv[4]),
          Kind: process.argv[5],
          Name: process.argv[6]
        };
        await writeJsonFile('../pets.json', jsonData);
        console.log('Entry updated:', jsonData[argIndex]);
        break;

      case "destroy":
        if (isNaN(argIndex) || argIndex < 0 || argIndex >= jsonData.length) {
          console.log('Usage: node fs.js destroy INDEX');
          process.exit(1);
        }
        const destroyedEntry = jsonData.splice(argIndex, 1);
        await writeJsonFile('../pets.json', jsonData);
        console.log('Entry deleted:', destroyedEntry);
        break;
      
      default:
        console.log('Usage: node fs.js [read | create | update | destroy]');
        process.exit(1);
    }
  } catch (err) {
    console.error('Error processing file:', err);
    process.exit(1);
  }
}

main();



// async function readJsonFile(pathToFile) {
//     return new Promise((resolve, reject) => {
//       fs.readFile(pathToFile, 'utf8', (err, data) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         try {
//           const jsonData = JSON.parse(data);
//           resolve(jsonData);
//         } catch (parseErr) {
//           reject(parseErr);
//         }
//       });
//     });
//   }
  
// async function writeJsonFile(pathToFile, jsonData) {
//     return new Promise((resolve, reject) => {
//       const stringOfData = JSON.stringify(jsonData, null, 2);
//       fs.writeFile(pathToFile, stringOfData, 'utf8', (err) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve();
//       });
//     });
//   }
  


//   // Check for the minimum required arguments first
//   if (process.argv.length <= 2) {
//         console.log('Usage: node fs.js [read | create | update | destroy]');
//         process.exit(0);
//   } else if (process.argv[2] === "read") {
//         // Read functionality
//         readJsonFile('../pets.json')
//         .then(jsonData => {
//             const argIndex = process.argv[3];
//             if (argIndex !== undefined) {
//             const index = Number(argIndex);
//             if (!isNaN(index) && index >= 0 && index < jsonData.length) {
//                 console.log(jsonData[index]);
//             } else {
//                 console.log("Usage: node fs.js read INDEX");
//             }
//             } else {
//             console.log(jsonData);
//             }
//         })
//         .catch(err => {
//             console.error('Error reading file:', err);
//             process.exit(1);
//         });
//   } else if (process.argv[2] === "create") {
//         // Create functionality
//         if (process.argv.length < 6 || isNaN(Number(process.argv[3]))) {
//         console.log('Usage: node fs.js create AGE KIND NAME');
//         process.exit(1);
//         }
    
//         const newEntry = {
//         Age: Number(process.argv[3]),
//         Kind: process.argv[4],
//         Name: process.argv[5]
//         };
    
//         readJsonFile('../pets.json')
//         .then(jsonData => {
//             jsonData.push(newEntry);
//             return writeJsonFile('../pets.json', jsonData);
//         })
//         .then(() => {
//             console.log('New entry created:', newEntry);
//         })
//         .catch(err => {
//             console.error('Error processing file:', err);
//             process.exit(1);
//         });
//   } else {
//         // Fallback for unrecognized commands
//         console.log('Usage: node fs.js read [index] | create [age] [kind] [name] | update [index] [age] [kind] [name] | destroy [index]');
//         process.exit(1);
//   }




