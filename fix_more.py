import os
import glob
import re

def process(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace('style="background: var(--text)"', 'class="bg-text"')
    content = content.replace('style="background: var(--accent);"', 'class="bg-[#3b82f6]"')
    content = content.replace('style="color: var(--border);"', 'class="text-[rgba(255,255,255,0.08)]"')
    content = content.replace('style="font-weight: 600"', 'class="font-semibold"')
    
    with open(filepath, 'w') as f:
        f.write(content)

for f in glob.glob('.opencode/skill/sk-doc-visual/assets/templates/*.html'):
    if 'main_style_reference' not in f and 'implementation-summary' not in f and 'readme-guide' not in f:
        process(f)
