import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { app } = require('./dist/orlando-photo-web/server/main.js');

const port = process.env['PORT'] || 4000;

app().listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Node Express server listening on http://localhost:${port}`);
});
