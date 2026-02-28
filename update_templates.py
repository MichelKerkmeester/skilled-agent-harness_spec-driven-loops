import os
import re

template_dir = '.opencode/skill/sk-doc-visual/assets/templates'
css_snippet_path = '.opencode/skill/sk-doc-visual/assets/snippets/fluid-typography.css'

with open(css_snippet_path, 'r') as f:
    snippet_content = f.read()

# Extract just the root variables and media queries
root_vars = re.search(r':root\s*\{([^}]+)\}', snippet_content).group(1)
html_font = re.search(r'html\s*\{[^}]+\}', snippet_content).group(0)
media_queries = "\n".join(re.findall(r'@media[^{]+\{[^}]+\}', snippet_content))

new_css_block = f""":root {{{root_vars}}}

        {html_font}

        {media_queries}"""

for filename in os.listdir(template_dir):
    if not filename.endswith('.html'):
        continue
    filepath = os.path.join(template_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace :root to media queries block
    pattern = r':root\s*\{.*?--font-size-4:\s*[^;]+;\s*\}\s*html\s*\{.*?\}\s*@media[^}]+(?:\}[^@]*)*?991px\)\s*\{\s*html\s*\{\s*font-size:[^}]+\}\s*\}'
    
    # Let's find if it matches
    if re.search(pattern, content, flags=re.DOTALL):
        content = re.sub(pattern, new_css_block.replace('\\', '\\\\'), content, flags=re.DOTALL)
    else:
        print(f"Pattern not found in {filename}")
        
    # Also add some modern styling if not present
    if 'background-image: linear-gradient' not in content and '.glass-card' in content:
        # Add background grid
        content = content.replace('background-color: var(--bg);', 'background-color: var(--bg);\n            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);\n            background-size: 30px 30px;')
        
        # Improve glass card hover
        content = content.replace('.glass-card:hover { border-color:var(--accent); }', '.glass-card:hover { border-color:var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }')
        
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Updated {filename}")

# Also update main_style_reference/implementation-summary.html
ref_path = os.path.join(template_dir, 'main_style_reference/implementation-summary.html')
if os.path.exists(ref_path):
    with open(ref_path, 'r') as f:
        content = f.read()
    if re.search(pattern, content, flags=re.DOTALL):
        content = re.sub(pattern, new_css_block.replace('\\', '\\\\'), content, flags=re.DOTALL)
        content = content.replace('background-color: var(--bg);', 'background-color: var(--bg);\n            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);\n            background-size: 30px 30px;')
        content = content.replace('.glass-card:hover { border-color: var(--accent); }', '.glass-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }')
        with open(ref_path, 'w') as f:
            f.write(content)
        print(f"Updated main_style_reference/implementation-summary.html")
