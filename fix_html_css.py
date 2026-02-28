import re

html_path = ".opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html"
with open(html_path, "r") as f:
    html_content = f.read()

# Fix color property var(--text-[var(--text-muted)]) -> var(--text-muted)
html_content = html_content.replace('color: var(--text-[var(--text-muted)]);', 'color: var(--text-muted);')

# Replace inline transitions in CSS with variables
html_content = html_content.replace('transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);', 'transition: var(--transition-reveal);')
html_content = html_content.replace('transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;', 'transition: var(--transition-card);')

# Fix h-full on code windows and their parents
# We want the parents to use flex-col and gap-6 instead of space-y-6 if they are h-full
html_content = html_content.replace('class="h-full flex flex-col space-y-6"', 'class="flex flex-col h-full gap-6"')
# For space-y-6 inside grid cols that should be flex columns stretching properly
# Specifically for "Feature Development" and "Debugging" wrappers
# Let's just remove 'h-full' from code windows altogether to prevent overflow
html_content = html_content.replace('shadow-2xl h-full flex flex-col', 'shadow-2xl flex flex-col')
html_content = html_content.replace('shadow-2xl mb-6 h-full flex flex-col', 'shadow-2xl mb-6 flex flex-col')
# And make sure wrappers use flex flex-col if they want to stretch
# Actually if we just remove h-full from the code windows, they'll shrink to fit content
# Let's see if we should add h-full back but securely
html_content = re.sub(r'<div class="space-y-6">\s*<h3 class="text-\[10px\] font-semibold tracking-widest text-\[var\(--text-muted\)\] uppercase">(Feature Development|Debugging|Quick Fixes|Diagnostic Commands|Embedding Providers)</h3>', r'<div class="flex flex-col h-full gap-6">\n                <h3 class="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">\1</h3>', html_content)

# And for those, ensure code window has flex-1 to fill the remaining space instead of h-full
html_content = html_content.replace('<div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col">', '<div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col flex-1">')

with open(html_path, "w") as f:
    f.write(html_content)

# Now Layout CSS
layout_path = ".opencode/skill/sk-doc-visual/assets/snippets/layout.css"
with open(layout_path, "r") as f:
    layout_css = f.read()

if "--transition-main" not in layout_css:
    layout_css = layout_css.replace('  --duration-reveal: 0.6s;', '  --duration-reveal: 0.6s;\n  \n  --transition-main: all var(--duration) var(--ease);\n  --transition-reveal: opacity var(--duration-reveal) var(--ease), transform var(--duration-reveal) var(--ease);\n  --transition-card: border-color var(--duration) ease, transform var(--duration) ease, box-shadow var(--duration) ease;')
    
with open(layout_path, "w") as f:
    f.write(layout_css)

print("HTML and CSS fixed")
