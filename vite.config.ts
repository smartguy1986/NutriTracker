import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/foods')) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const query = (url.searchParams.get('query') || '').toLowerCase();
            try {
              const foodsData = JSON.parse(fs.readFileSync('./src/data/foods.json', 'utf-8'));
              let results = foodsData;
              if (query) {
                 results = foodsData.filter((f: any) => f.name.toLowerCase().includes(query));
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(results.slice(0, 50)));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Could not read local foods.json" }));
            }
            return;
          }
          next();
        })
      }
    }
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://food-calorie-track.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
