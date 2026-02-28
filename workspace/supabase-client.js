// DEPRECATED - Use convex via webhook instead
// POST http://localhost:3003
// {"agent": "name", "action": "type", "message": "content"}
const { ConvexHttpClient } = require('convex/browser');
const client = new ConvexHttpClient('https://graceful-clownfish-349.convex.cloud');
module.exports = client;
