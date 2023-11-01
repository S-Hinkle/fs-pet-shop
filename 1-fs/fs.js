
import fs from 'fs';


if (process.argv.length <= 2) {
    console.log('Usage: node fs.js [read | create | update | destroy]');
    process.exit(0);
  }


  if (process.argv[2] === "read") {
    fs.readFile('../pets.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            process.exit(1);
        }
        const jsonData = JSON.parse(data);


        const argIndex = process.argv[3];
        if (argIndex !== undefined) {
            const index = Number(argIndex);
            if (!isNaN(index) && index >= 0 && index < jsonData.length) {
                console.log(jsonData[index]);
            } else {
                console.log("Usage: node fs.js read INDEX");
            }
        } else {
            console.log(jsonData);
        }
    });
} else if(process.argv[2] === "create") {
    if (process.argv.length < 6 || isNaN(Number(process.argv[3]))) {
        console.log('Usage: node fs.js create AGE KIND NAME');
        process.exit(1);
      }
    
      const newEntry = {
        Age: Number(process.argv[3]),
        Kind: process.argv[4],
        Name: process.argv[5]
      };
    
      fs.readFile('../pets.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          process.exit(1);
        }
    
        const jsonData = JSON.parse(data);
        jsonData.push(newEntry);
    
        fs.writeFile('../pets.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Error writing file:', err);
            process.exit(1);
          }
          console.log('New entry created:', newEntry);
        });
      });
} else {
    console.log('Usage: node file.js read [index]');
    process.exit(1);
}





