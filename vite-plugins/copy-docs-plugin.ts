import fs from 'fs'
import path from 'path'

export default function copyDocsToDist() {
  return {
    name: 'copy-docs-to-dist',
    writeBundle() {
      const outDir = this.meta.outDir
      
      // Copy all markdown files from project to dist/docs
      const projectRoot = path.resolve(__dirname, '../..')
      const docsDir = path.join(projectRoot, 'dist/docs')
      
      // Find all markdown files in project (excluding node_modules and dist)
      const markdownFiles = []
      
      function findMarkdownFiles(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isDirectory && !entry.name.includes('node_modules') && !entry.name.includes('dist')) {
            findMarkdownFiles(path.join(dir, entry.name))
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            markdownFiles.push(entry.name)
          }
        }
      }
      
      findMarkdownFiles(projectRoot)
      
      // Create docs directory if it doesn't exist
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true })
      }
      
      // Copy all markdown files to dist/docs
      let copiedCount = 0
      for (const file of markdownFiles) {
        const srcPath = path.join(projectRoot, file)
        const destPath = path.join(docsDir, file)
        
        // Only copy if source exists and destination doesn't exist or is newer
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath)
          copiedCount++
        }
      }
      
      console.log(`📄 Copied ${copiedCount} markdown files to dist/docs/`)
    }
  }
}
