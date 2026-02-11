#!/bin/bash
# Build documentation from markdown files in project

PROJECT_DIR="/Users/rrabelo/.openclaw/workspace/helix-status-page"

echo "📄 Building documentation..."

# Find all markdown files in project (excluding node_modules and dist)
find "$PROJECT_DIR" -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" | while read -r file; do
    echo "  Copying: $(basename "$file")"
    cp "$file" "$PROJECT_DIR/dist/docs/"
done

echo "  Markdown files copied: $(find "$PROJECT_DIR" -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" | wc -l)"

# Run vite build from project root (not from subdirectories)
echo "  Running vite build from project root..."
cd "$PROJECT_DIR"
npm run build

echo "✅ Documentation build complete!"
