// Import the necessary modules
import express from 'express';
import { promises as fs } from 'fs';

// Define the path to the pets.json file, which stores our pet data
const PET_FILE_PATH = './pets.json';

// Create an Express application
const app = express();

// Function to retrieve and parse the pets data from the JSON file
const getPetsObj = async () => {
  const petData = await fs.readFile(PET_FILE_PATH, 'utf8');
  return JSON.parse(petData);
};

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
