import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: './src/index.js',
            output: {
                entryFileNames: 'bundle.js', // відповідність Webpack
            },
        },
        emptyOutDir: true,
    },
    plugins: [
        legacy({
            targets: ['defaults'], // підтримка старих браузерів, якщо треба
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/assets',
                    dest: 'assets',
                },
            ],
        }),
    ],
    server: {
        open: false,
        hot: true,
    },
})
