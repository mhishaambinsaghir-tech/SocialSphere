import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/SocialSphere/', // MUST BE CORRECT!
    build: {
        outDir: 'docs', // MUST BE 'docs'!
    },
    plugins: [
        tailwindcss(),
    ],
})