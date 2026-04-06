#!/bin/bash
# Install MCP server dependencies for this project

echo "Installing MCP server dependencies..."

while IFS= read -r package; do
  # Skip empty lines and comments
  [[ -z "$package" || "$package" =~ ^# ]] && continue

  echo "Installing $package..."
  npm install -g "$package"
done < .mcp-dependencies.txt

echo "✓ MCP dependencies installed successfully"
