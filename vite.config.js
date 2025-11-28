import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    // 1. CRITICAL: Set the base path to your repo name (e.g., /my-project/)
    base: '/your-repository-name/',

    // 2. IMPORTANT: Tell Vite to use the 'docs' folder for output
    build: {
        outDir: 'docs',
    },

    plugins: [
        tailwindcss(),
    ],
})