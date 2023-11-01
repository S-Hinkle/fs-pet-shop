// Import the necessary modules
import http from 'http';
//const fs = require('fs').promises
import url from 'url';
import { promises as fs } from 'fs'


// Path to the JSON data
const PET_FILE_PATH = '../pets.json';


// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Function to respond with status code and JSON data
    function responseJSON(statusCode, dataObj) {
        res.writeHead(statusCode, {'Content-Type':'application/json'});
        res.end(JSON.stringify(dataObj));
    }


    // Function to respond with status code and text data
    function responseText(statusCode, message) {
        res.writeHead(statusCode, {'Content-Type':'text/plain'});
        res.end(message);
    }


    const getPetObj = async () => {
        const petData = await fs.readFile(PET_FILE_PATH, 'utf8');
        return JSON.parse(petData);
    }


    


    // Parse url and format it
    const urlParsed = url.parse(req.url, true);
    console.log(urlParsed)
    const sanatizedPath = urlParsed.path.replace(/^\/+|\/+$/g, '');
    const urlParts = sanatizedPath.split('/');
    console.log(urlParts)


    if (req.method === 'GET') {
        switch (urlParts[0]) {
            case 'pets':
                console.log('working')
                res.writeHead(200, {'Content-Type':'text/plain'});
                res.end('Working!')
        }
    }
})






const PORT = 3000;
server.listen(PORT, () => {
    console.log('Server Running')
});



// import { createServer } from 'http';

// const server = createServer((req, res) => {
//   // req.url contains the path and query string of the request (if any)
//   if (req.url === '/') {
//     // Use res to write the HTTP response
//     res.writeHead(200, { 'Content-Type': 'text/plain' }); // Set the status code and headers
//     res.end('Hello, World!'); // Send the response body and close the connection
//   } else {
//     // Handle other paths or send a 404 Not Found response
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Not Found');
//   }
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });