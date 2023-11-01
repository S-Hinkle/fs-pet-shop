// Import the necessary modules from the standard Node.js library
import http from 'http';
import url from 'url';
import { promises as fs } from 'fs';

// Define the path to the pets.json file, which stores our pet data
const PET_FILE_PATH = './pets.json';

// Create an HTTP server that will respond to requests
const server = http.createServer(async (req, res) => {
    // Helper function to send a JSON response with a status code and data object
    function responseJSON(statusCode, dataObj) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dataObj));
    }

    // Helper function to send a plain text response with a status code and message
    function responseText(statusCode, message) {
        res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        res.end(message);
    }

    // Function to handle the 404 Not Found response
    const notFound = () => responseText(404, 'Not Found');

    // Function to handle the 405 Method Not Allowed response
    const unknownMethod = () => responseText(405, 'Method not allowed');

    // Function to retrieve and parse the pets data from the JSON file
    const getPetsObj = async () => {
        const petData = await fs.readFile(PET_FILE_PATH, 'utf8');
        return JSON.parse(petData);
    };

    // Function to handle GET requests for the list of all pets
    const processGetPets = async () => {
        const pets = await getPetsObj();
        responseJSON(200, pets);
    };

    // Function to handle GET requests for a single pet by index
    const getPetByIndex = async (index) => {
        const pets = await getPetsObj();
        if (index >= pets.length || index < 0) {
            notFound();
        } else {
            responseJSON(200, pets[index]);
        }
    };

    // Parse the request URL to determine the path and actions
    const urlParsed = url.parse(req.url, true);
    const sanatizedPath = urlParsed.path.replace(/^\/+|\/+$/g, '');
    const urlParts = sanatizedPath.split('/');

    // Determine the action based on the HTTP method and the URL path
    if (req.method === 'GET') {
        switch (urlParts[0]) {
            case 'pets':
                if (urlParts.length === 1) {
                    await processGetPets();
                } else if (urlParts.length === 2 && !isNaN(parseInt(urlParts[1], 10))) {
                    await getPetByIndex(parseInt(urlParts[1], 10));
                } else {
                    notFound();
                }
                break;
            default:
                // Handle any other paths that are not defined
                notFound();
                break;
        }
    } else {
        // Handle any HTTP methods other than GET
        unknownMethod();
    }
});

// Define the port number on which the server will listen for requests
const PORT = 3000;
// Start the server and have it listen on the specified port
server.listen(PORT, () => {
    console.log('Server running on port', PORT);
});

