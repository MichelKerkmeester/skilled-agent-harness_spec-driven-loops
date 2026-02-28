import re
import os
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dictionary mapping style strings to classes
    style_to_class = {
        r'color:\s*var\(--muted\)': 'text-muted',
        r'color:\s*var\(--accent\)': 'text-accent',
        r'color:\s*var\(--text\)': 'text-text',
        r'color:\s*var\(--bg\)': 'text-bg',
        r'background:\s*var\(--surface\)': 'bg-[#1c1c1e]',
        r'background-color:\s*var\(--surface\)': 'bg-[#1c1c1e]',
        r'background:\s*var\(--bg\)': 'bg-[#131314]',
        r'background-color:\s*var\(--bg\)': 'bg-[#131314]',
        r'border-color:\s*var\(--border\)': 'border-[rgba(255,255,255,0.08)]',
        r'border-bottom:\s*1px\s+solid\s+var\(--border\)': 'border-b border-[rgba(255,255,255,0.08)]',
        r'border-top:\s*1px\s+solid\s+var\(--border\)': 'border-t border-[rgba(255,255,255,0.08)]',
        r'border-left:\s*1px\s+solid\s+var\(--border\)': 'border-l border-[rgba(255,255,255,0.08)]',
        r'border-right:\s*1px\s+solid\s+var\(--border\)': 'border-r border-[rgba(255,255,255,0.08)]',
        r'border:\s*1px\s+solid\s+var\(--border\)': 'border border-[rgba(255,255,255,0.08)]',
        r'color:\s*var\(--success\)': 'text-green-500',
        r'color:\s*var\(--warning\)': 'text-amber-500',
        r'color:\s*var\(--danger\)': 'text-red-500',
        r'background:\s*var\(--success\)': 'bg-green-500',
        r'background:\s*var\(--warning\)': 'bg-amber-500',
        r'background:\s*var\(--danger\)': 'bg-red-500',
        r'border-top:\s*3px\s+solid\s+var\(--success\)': 'border-t-[3px] border-green-500',
        r'border-top:\s*3px\s+solid\s+var\(--warning\)': 'border-t-[3px] border-amber-500',
        r'border-top:\s*3px\s+solid\s+var\(--danger\)': 'border-t-[3px] border-red-500',
        r'border-top:\s*3px\s+solid\s+var\(--accent\)': 'border-t-[3px] border-accent',
        r'border-left:\s*3px\s+solid\s+var\(--accent\)': 'border-l-[3px] border-accent',
        r'border-left:\s*4px\s+solid\s+var\(--accent\)': 'border-l-[4px] border-accent',
        r'color:\s*#f87171': 'text-[#f87171]',
        r'color:\s*#60a5fa': 'text-[#60a5fa]',
        r'color:\s*#fbbf24': 'text-[#fbbf24]'
    }

    def replace_style(match):
        class_attr = match.group(1) if match.group(1) else ''
        style_content = match.group(2)
        
        classes_to_add = []
        for pattern, tailwind_class in style_to_class.items():
            if re.search(pattern, style_content):
                classes_to_add.append(tailwind_class)
                style_content = re.sub(pattern, '', style_content)
        
        # Clean up style content
        style_content = re.sub(r';\s*;', ';', style_content)
        style_content = style_content.strip(' ;')
        
        new_class_attr = class_attr
        if classes_to_add:
            if new_class_attr:
                new_class_attr += ' ' + ' '.join(classes_to_add)
            else:
                new_class_attr = ' '.join(classes_to_add)
        
        res = ''
        if new_class_attr:
            res += f'class="{new_class_attr}"'
            
        if style_content:
            if res:
                res += ' '
            res += f'style="{style_content}"'
            
        if not res:
            return '' # This shouldn't happen usually but just in case
            
        return res

    # Match an element that has both class="..." and style="..."
    # Note: Regex parsing HTML is tricky, we'll try a simpler approach
    # We will find all elements with style="..."
    def style_replacer(m):
        tag_content = m.group(0)
        
        style_match = re.search(r'style="([^"]+)"', tag_content)
        if not style_match:
            return tag_content
            
        style_content = style_match.group(1)
        classes_to_add = []
        for pattern, tailwind_class in style_to_class.items():
            if re.search(pattern, style_content):
                classes_to_add.append(tailwind_class)
                style_content = re.sub(pattern, '', style_content)
        
        style_content = re.sub(r';\s*;', ';', style_content).strip(' ;')
        
        if not classes_to_add:
            return tag_content
            
        # We have classes to add
        # Check if there is a class attribute
        class_match = re.search(r'class="([^"]+)"', tag_content)
        if class_match:
            existing_classes = class_match.group(1)
            new_classes = existing_classes + ' ' + ' '.join(classes_to_add)
            # Remove old class, add new class
            tag_content = tag_content.replace(class_match.group(0), f'class="{new_classes}"')
        else:
            # Insert class attribute right before style
            tag_content = tag_content.replace(style_match.group(0), f'class="{" ".join(classes_to_add)}" {style_match.group(0)}')
            
        # Update or remove style
        if style_content:
            tag_content = re.sub(r'style="[^"]+"', f'style="{style_content}"', tag_content)
        else:
            tag_content = re.sub(r'\s*style="[^"]+"', '', tag_content)
            
        return tag_content

    # Match opening tags
    new_content = re.sub(r'<[a-zA-Z0-9]+[^>]*style="[^"]+"[^>]*>', style_replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")

# Also need to remove the extra variables from :root
def clean_root(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove --success, --warning, --danger
    content = re.sub(r'\s*--success:[^;]+;', '', content)
    content = re.sub(r'\s*--warning:[^;]+;', '', content)
    content = re.sub(r'\s*--danger:[^;]+;', '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = '.opencode/skill/sk-doc-visual/assets/templates'
for f in glob.glob(f'{base_dir}/*.html'):
    if 'main_style_reference' not in f and 'implementation-summary' not in f and 'readme-guide' not in f:
        clean_root(f)
        process_file(f)

