// Import the necessary modules
import express from 'express';
import { promises as fs } from 'fs';
import pkg from 'pg';
const { Pool } = pkg;


// Create a new pool instance to manage multiple database connections.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT, 10),
});

// Create an Express application
const app = express();

// Use middleware to parse JSON bodies
app.use(express.json());



// Function to retrieve and parse the pets data from the JSON file
const getPetsObj = async () => {
  const petData = await fs.readFile(PET_FILE_PATH, 'utf8');
  return JSON.parse(petData);
};

// Function to save the pets data to the JSON file
const savePetsObj = async (pets) => {
  const petData = JSON.stringify(pets, null, 2);
  await fs.writeFile(PET_FILE_PATH, petData, 'utf8');
};



// POST endpoint to add a new pet
app.post('/pets', async (req, res) => {
  try {
    // Get the new pet data from the request body
    const newPet = req.body;
    console.log(req)
    // Simple validation
    if (!newPet.age || !newPet.kind || !newPet.name) {
      return res.status(400).send('Bad Request: Missing pet name or type');
    }

    const pets = await getPetsObj();
    // Add the new pet to the existing array
    pets.push(newPet);
    // Save the updated array back to the file
    await savePetsObj(pets);

    // Send back the added pet data with a 201 Created status code
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});



  // Define a route to handle GET requests for the list of all pets
  app.get('/pets', async (req, res) => {
      try {
        const pets = await getPetsObj();
        res.status(200).json(pets);
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
  });



  // Define a route to handle GET requests for a single pet by index
  app.get('/pets/:id', async (req, res) => {
    try {
      const index = parseInt(req.params.id, 10);
      if (isNaN(index)) {
        return res.status(400).send('Bad Request: Invalid pet index');
      }
  
      const pets = await getPetsObj();
      if (index >= pets.length || index < 0) {
        res.status(404).send('Not Found');
      } else {
        res.status(200).json(pets[index]);
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
  


  // PUT endpoint to update an existing pet
  app.put('/pets/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        //const petUpdate = req.body;
        const { age, kind, name } = req.body;

        // Check if 'age' is an integer
        if (age !== undefined && (!Number.isInteger(age) || age < 0)) {
          return res.status(400).send('Bad Request: Age must be a positive integer');
        }
        // Check if 'kind' and 'name' are not missing and are non-empty strings
        if (!kind || typeof kind !== 'string' || !kind.trim() ||
            !name || typeof name !== 'string' || !name.trim()) {
          return res.status(400).send('Bad Request: Kind and Name must be provided and cannot be empty');
        }

        const pets = await getPetsObj();
        if (id < 0 || id >= pets.length) {
            return res.status(404).send('Not Found: Pet does not exist');
        }

        // Update the pet at the specified index
        const petUpdate = req.body;
        console.log(petUpdate)
        pets[id] = { ...pets[id], ...petUpdate };
        await savePetsObj(pets);

        res.status(200).json(pets[id]);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
  });
  


  // DELETE endpoint to delete an existing pet
  app.delete('/pets/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
  
      const pets = await getPetsObj();
      if (id < 0 || id >= pets.length) {
        return res.status(404).send('Not Found: Pet does not exist');
      }
      
      // Capture the pet that is about to be removed
      const removedPet = pets[id];
      
      // Remove the pet from the array
      pets.splice(id, 1);
      await savePetsObj(pets);
  
      res.status(200).json(removedPet); // No content to send back
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });


  
  // Handle 404 for any other routes
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });


// Define the port number on which the server will listen for requests
const PORT = 3000;
// Start the server and have it listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//=======================================ORIGINAL VERSION USING PETS.JSON=====================================================//
/*

// Import the necessary modules
import express from 'express';
import { promises as fs } from 'fs';

// Define the path to the pets.json file, which stores our pet data
const PET_FILE_PATH = './pets.json';

// Create an Express application
const app = express();

// Use middleware to parse JSON bodies
app.use(express.json());



// Function to retrieve and parse the pets data from the JSON file
const getPetsObj = async () => {
  const petData = await fs.readFile(PET_FILE_PATH, 'utf8');
  return JSON.parse(petData);
};

// Function to save the pets data to the JSON file
const savePetsObj = async (pets) => {
  const petData = JSON.stringify(pets, null, 2);
  await fs.writeFile(PET_FILE_PATH, petData, 'utf8');
};



// POST endpoint to add a new pet
app.post('/pets', async (req, res) => {
  try {
    // Get the new pet data from the request body
    const newPet = req.body;
    console.log(req)
    // Simple validation
    if (!newPet.age || !newPet.kind || !newPet.name) {
      return res.status(400).send('Bad Request: Missing pet name or type');
    }

    const pets = await getPetsObj();
    // Add the new pet to the existing array
    pets.push(newPet);
    // Save the updated array back to the file
    await savePetsObj(pets);

    // Send back the added pet data with a 201 Created status code
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});



  // Define a route to handle GET requests for the list of all pets
  app.get('/pets', async (req, res) => {
      try {
        const pets = await getPetsObj();
        res.status(200).json(pets);
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
  });



  // Define a route to handle GET requests for a single pet by index
  app.get('/pets/:id', async (req, res) => {
    try {
      const index = parseInt(req.params.id, 10);
      if (isNaN(index)) {
        return res.status(400).send('Bad Request: Invalid pet index');
      }
  
      const pets = await getPetsObj();
      if (index >= pets.length || index < 0) {
        res.status(404).send('Not Found');
      } else {
        res.status(200).json(pets[index]);
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
  


  // PUT endpoint to update an existing pet
  app.put('/pets/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        //const petUpdate = req.body;
        const { age, kind, name } = req.body;

        // Check if 'age' is an integer
        if (age !== undefined && (!Number.isInteger(age) || age < 0)) {
          return res.status(400).send('Bad Request: Age must be a positive integer');
        }
        // Check if 'kind' and 'name' are not missing and are non-empty strings
        if (!kind || typeof kind !== 'string' || !kind.trim() ||
            !name || typeof name !== 'string' || !name.trim()) {
          return res.status(400).send('Bad Request: Kind and Name must be provided and cannot be empty');
        }

        const pets = await getPetsObj();
        if (id < 0 || id >= pets.length) {
            return res.status(404).send('Not Found: Pet does not exist');
        }

        // Update the pet at the specified index
        const petUpdate = req.body;
        console.log(petUpdate)
        pets[id] = { ...pets[id], ...petUpdate };
        await savePetsObj(pets);

        res.status(200).json(pets[id]);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
  });
  


  // DELETE endpoint to delete an existing pet
  app.delete('/pets/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
  
      const pets = await getPetsObj();
      if (id < 0 || id >= pets.length) {
        return res.status(404).send('Not Found: Pet does not exist');
      }
      
      // Capture the pet that is about to be removed
      const removedPet = pets[id];
      
      // Remove the pet from the array
      pets.splice(id, 1);
      await savePetsObj(pets);
  
      res.status(200).json(removedPet); // No content to send back
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });


  
  // Handle 404 for any other routes
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });


// Define the port number on which the server will listen for requests
const PORT = 3000;
// Start the server and have it listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

*/