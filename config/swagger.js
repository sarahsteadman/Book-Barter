const swaggerAutogen = require('swagger-autogen')();

const outputFile = './config/swagger_output.json';
const endpointsFiles = ['./routes/index.js']; 
/**
 * Automatically generate Swagger documentation based on route files.
 */
swaggerAutogen(outputFile, endpointsFiles, {
    host: 'localhost:9000',
});