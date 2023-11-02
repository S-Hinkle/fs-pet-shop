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



// Define the port number on which the server will listen for requests
const PORT = 3000;
// Start the server and have it listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
