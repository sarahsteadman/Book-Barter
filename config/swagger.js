const swaggerAutogen = require('swagger-autogen')();

const outputFile = './config/swagger_output.json';
const endpointsFiles = ['./routes/index.js']; // Adjust this to include all relevant route files

swaggerAutogen(outputFile, endpointsFiles);