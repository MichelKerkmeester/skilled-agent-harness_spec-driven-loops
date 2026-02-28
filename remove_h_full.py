import re

html_path = ".opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html"
with open(html_path, "r") as f:
    html_content = f.read()

# Replace flex flex-col h-full gap-6 back to space-y-6
html_content = html_content.replace('class="flex flex-col h-full gap-6"', 'class="space-y-6"')

# Remove h-full and flex-1 from the code windows
html_content = html_content.replace('shadow-2xl flex flex-col flex-1', 'shadow-2xl flex flex-col')
html_content = html_content.replace('shadow-2xl h-full flex flex-col flex-1', 'shadow-2xl flex flex-col')
html_content = html_content.replace('shadow-2xl h-full flex flex-col', 'shadow-2xl flex flex-col')

# Remove flex-1 from <pre> if it has it, we just want it to size naturally
html_content = html_content.replace('mono overflow-x-auto leading-relaxed flex-1"', 'mono overflow-x-auto leading-relaxed"')

# Also remove h-full flex flex-col space-y-6 from column wrappers if any still exist
html_content = html_content.replace('class="h-full flex flex-col space-y-6"', 'class="space-y-6"')

with open(html_path, "w") as f:
    f.write(html_content)

print("Removed h-full layout contortions")
