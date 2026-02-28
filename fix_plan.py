import re

filepath = '.opencode/skill/sk-doc-visual/assets/templates/plan.html'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace('style="background: var(--accent);"', 'class="bg-[#3b82f6]"')
content = content.replace('style="color: var(--accent);"', 'class="text-accent"')
content = content.replace('style="color: var(--muted);"', 'class="text-muted"')
content = content.replace('style="background: var(--surface);"', 'class="bg-[#1c1c1e]"')
content = content.replace('style="border-color: var(--border);"', 'class="border-[rgba(255,255,255,0.08)]"')
content = content.replace('style="color: var(--text);"', 'class="text-text"')
content = content.replace('style="color: var(--danger);"', 'class="text-red-500"')
content = content.replace('style="color: var(--warning);"', 'class="text-amber-500"')
content = content.replace('style="color: var(--success);"', 'class="text-green-500"')

# Clean root
content = re.sub(r'\s*--success:[^;]+;', '', content)
content = re.sub(r'\s*--warning:[^;]+;', '', content)
content = re.sub(r'\s*--danger:[^;]+;', '', content)

with open(filepath, 'w') as f:
    f.write(content)
