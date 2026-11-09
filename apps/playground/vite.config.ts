// The playground, where every package is tried: the editor, the page as it is
// shared (/u/demo), and its numbers. The server's part runs in Vite's own
// server, loaded as the page's modules are (`server/dev.ts`): the profile and
// its events kept in memory while it runs.

import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5310 },
  plugins: [
    {
      name: 'reboprofiles-server',
      configureServer(server) {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (!/^\/(api|u|p)\//.test(req.url ?? '')) return next();
          const dev = await server.ssrLoadModule('/server/dev.ts');
          await dev.handle(req, res);
        });
      },
    },
  ],
});
