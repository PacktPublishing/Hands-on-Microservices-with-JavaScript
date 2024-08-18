// test/global-teardown.js
const { execSync } = require('child_process');

module.exports = async () => {
    console.log('Stopping Docker Compose...');
    execSync('docker-compose -f docker-compose.tests.yml down', { stdio: 'inherit' });
};