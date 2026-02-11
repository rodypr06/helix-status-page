import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Plugin to copy docs folder to dist
function copyDocsPlugin() {
  return {
    name: 'copy-docs',
    closeBundle() {
      const srcDir = join(__dirname, 'docs')
      const destDir = join(__dirname, 'dist', 'docs')
      
      function copyRecursive(src: string, dest: string) {
        const stat = statSync(src)
        if (stat.isDirectory()) {
          mkdirSync(dest, { recursive: true })
          const files = readdirSync(src)
          files.forEach(file => {
            copyRecursive(join(src, file), join(dest, file))
          })
        } else {
          copyFileSync(src, dest)
        }
      }
      
      try {
        copyRecursive(srcDir, destDir)
        console.log('✅ Documentation copied to dist/docs')
      } catch (err) {
        console.error('❌ Failed to copy docs:', err)
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), copyDocsPlugin()],
})
