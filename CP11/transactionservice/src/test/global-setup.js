// test/global-setup.js
const { execSync } = require('child_process');

module.exports = async () => {
    console.log('Starting Docker Compose...');
    execSync('docker-compose -f docker-compose.tests.yml up --build -d', { stdio: 'inherit' });
    // You might need to add a delay here to give services time to initialize
    await new Promise(resolve => setTimeout(resolve, 15000));
};