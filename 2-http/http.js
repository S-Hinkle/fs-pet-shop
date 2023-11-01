// Import the necessary modules
import http from 'http';
//const fs = require('fs').promises
import url from 'url';
import { promises as fs } from 'fs'


// Path to the JSON data
const PET_FILE_PATH = './pets.json';


// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Function to respond with status code and JSON data
    function responseJSON(statusCode, dataObj) {
        res.writeHead(statusCode, {'Content-Type':'application/json'});
        res.end(JSON.stringify(dataObj));
    };


    // Function to respond with status code and text data
    function responseText(statusCode, message) {
        res.writeHead(statusCode, {'Content-Type':'text/plain'});
        res.end(message);
    };


    const notFound = () => {
        responseText(404, 'Not Found')
    };


    const unknownMethod = () => {
        responseText(405, 'Method not allowed')
    }


    const getPetsObj = async () => {
        const petData = await fs.readFile(PET_FILE_PATH, 'utf8');
        return JSON.parse(petData);
    };


    const processGetPets = async () => {
        const pets = await getPetsObj();
        responseJSON(200, pets);
    };


    const getPetByIndex = async (index) => {
        console.log(index);
        const pets = await getPetsObj();
        if (index >= pets.length || index < 0) {
            notFound();
        } else {
            responseJSON(200, pets[index])
        }
    }


    // Parse url and format it
    const urlParsed = url.parse(req.url, true);
    const sanatizedPath = urlParsed.path.replace(/^\/+|\/+$/g, '');
    const urlParts = sanatizedPath.split('/');    


    if (req.method === 'GET') {
        switch (urlParts[0]) {
            case 'pets':
                if (urlParts.length === 1) {
                    await processGetPets();
                } else if (urlParts.length === 2 && !isNaN(parseInt(urlParts[1],10))) {
                    getPetByIndex(parseInt(urlParts[1],10));
                } else {
                    notFound();
                }
                break;
            default:
                notFound();
                break;
        }
    } else {
        unknownMethod();
    }
})


const PORT = 3000;
server.listen(PORT, () => {
    console.log('Server Running')
});
