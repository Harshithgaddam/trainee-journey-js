import 'dotenv/config';
import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 3000);
const appName = process.env.APP_NAME ?? 'my-node-project';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Invalid PORT');
}

const server = createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  res.end(
    JSON.stringify({
      app: appName,
      status: 'ok',
      path: req.url,
    }),
  );
});

server.listen(port, () => {
  console.log(`${appName} running on port ${port}`);
});
