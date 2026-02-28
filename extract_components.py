import os
import re

source_path = ".opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html"
sections_dir = ".opencode/skill/sk-doc-visual/assets/sections"
components_dir = ".opencode/skill/sk-doc-visual/assets/components"

os.makedirs(sections_dir, exist_ok=True)
os.makedirs(components_dir, exist_ok=True)

with open(source_path, "r", encoding="utf-8") as f:
    source_html = f.read()

def get_scaffold(content, extra_style="", extra_head="", extra_script=""):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>Preview</title>
  <link rel="stylesheet" href="../variables/fluid-typography.css">
  <link rel="stylesheet" href="../variables/colors.css">
  <link rel="stylesheet" href="../variables/typography.css">
  <link rel="stylesheet" href="../variables/layout.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
  <script src="../variables/template-defaults.js" defer></script>{extra_head}
  <style>
    html {{
      scroll-behavior: smooth;
      background-color: var(--bg);
      color: var(--text);
    }}
    body {{
      font-family: var(--font-sans);
      line-height: var(--lh-base);
      font-weight: var(--weight-medium);
      -webkit-font-smoothing: antialiased;
      margin: 0;
    }}
    .mono {{
      font-family: var(--font-mono);
    }}
    ::-webkit-scrollbar {{
      width: 4px;
      height: 4px;
    }}
    ::-webkit-scrollbar-track {{
      background: var(--bg);
    }}
    ::-webkit-scrollbar-thumb {{
      background: var(--border);
      border-radius: 10px;
    }}
    ::-webkit-scrollbar-thumb:hover {{
      background: var(--accent);
    }}
    .page-container {{
      width: 100%;
      max-width: var(--container-max);
      margin: 0 auto;
    }}
    .reveal {{
      opacity: 0;
      transform: translateY(20px);
      transition: var(--transition-reveal);
    }}
    .reveal.active {{
      opacity: 1;
      transform: translateY(0);
    }}
    .glass-card {{
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      transition: var(--transition-card);
    }}
    .glass-card:hover {{
      border-color: var(--accent-hover);
      box-shadow: var(--glass-shadow);
      transform: translateY(-2px);
    }}
    .text-balance {{
      text-wrap: balance;
    }}{extra_style}
  </style>
</head>
<body>
<div class="selection:bg-[var(--accent-muted)] min-h-screen relative w-full">

<div class="page-container px-6 lg:px-12 py-12">
{content}
</div>

</div>{extra_script}
</body>
</html>
"""

sections_to_extract = [
    ("spec-kit-documentation-section.html", "spec-kit-documentation", "03 // SPEC KIT DOCUMENTATION"),
    ("memory-engine-section.html", "memory-engine", "04 // MEMORY ENGINE"),
    ("agent-network-section.html", "agent-network", "05 // AGENT NETWORK"),
    ("command-architecture-section.html", "command-architecture", "06 // COMMAND ARCHITECTURE"),
    ("skills-library-section.html", "skills-library", "07 // SKILLS LIBRARY"),
    ("gate-system-section.html", "gate-system", "08 // GATE SYSTEM"),
    ("code-mode-mcp-section.html", "code-mode-mcp", "09 // CODE MODE MCP"),
    ("extensibility-section.html", "extensibility", "10 // EXTENSIBILITY"),
    ("configuration-section.html", "configuration", "11 // CONFIGURATION"),
    ("usage-examples-section.html", "usage-examples", "12 // USAGE EXAMPLES"),
    ("troubleshooting-section.html", "troubleshooting", "13 // TROUBLESHOOTING"),
    ("related-documents-section.html", "related-documents", "15 // RELATED DOCUMENTS"),
]

for filename, section_id, title_default in sections_to_extract:
    # regex to find <section id="XYZ" ...> ... </section>
    pattern = rf'(<section id="{section_id}"[^>]*>.*?</section>)'
    match = re.search(pattern, source_html, re.DOTALL)
    if match:
        content = match.group(1)
        # Template the title block as an example
        content = re.sub(r'(<span class="w\.1\.5.*?</span>)\s*' + re.escape(title_default), 
                         rf'\1 {{{{section_title|default("{title_default}")}}}}', content)
        
        # force active class on reveal so it shows up in preview without JS
        content = content.replace('class="space-y-10 reveal pt-4"', 'class="space-y-10 reveal active pt-4"')
        content = content.replace('class="space-y-10 reveal"', 'class="space-y-10 reveal active"')

        full_html = get_scaffold(content)
        with open(os.path.join(sections_dir, filename), "w", encoding="utf-8") as f:
            f.write(full_html)
        print(f"Created section: {filename}")
    else:
        print(f"Warning: Section {section_id} not found in source.")

components = {
    "toc-link.html": {
        "style": """
    .toc-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      padding: 0.4rem 0;
      transition: var(--transition-main);
      letter-spacing: 0.05em;
    }
    .toc-link:hover, .toc-link:focus-visible {
      color: var(--text);
      outline: none;
    }
    .toc-link.active {
      color: var(--accent);
    }
    .toc-link.active::before {
      content: '';
      width: 4px;
      height: 4px;
      background: var(--accent);
      border-radius: 50%;
    }""",
        "content": """<div class="space-y-2 p-6 border border-[var(--border)] bg-[var(--surface)] rounded-xl w-64">
  <a href="#" class="toc-link">{{link1|default("1. Overview")}}</a>
  <a href="#" class="toc-link active">{{link2|default("2. Quick Start")}}</a>
  <a href="#" class="toc-link">{{link3|default("3. Configuration")}}</a>
</div>"""
    },
    "site-nav-link.html": {
        "style": """
    .site-nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      padding: 0.4rem 0.5rem;
      border-radius: var(--radius-interactive);
      transition: var(--transition-main);
    }
    .site-nav-link:hover, .site-nav-link:focus-visible {
      background: var(--border-faint);
      color: var(--text);
      outline: none;
    }
    .site-nav-link.active {
      background: var(--accent-muted);
      color: var(--accent);
    }""",
        "content": """<div class="space-y-1 p-6 border border-[var(--border)] bg-[var(--surface)] rounded-xl w-64">
  <a href="#" class="site-nav-link active"><span>{{link1|default("Platform Overview")}}</span> <iconify-icon icon="{{icon1|default('lucide:chevron-right')}}" class="text-[10px] opacity-50"></iconify-icon></a>
  <a href="#" class="site-nav-link"><span>{{link2|default("Architecture")}}</span></a>
  <a href="#" class="site-nav-link"><span>{{link3|default("GitHub Repo")}}</span> <iconify-icon icon="{{icon3|default('lucide:github')}}" class="text-[10px] opacity-50"></iconify-icon></a>
</div>"""
    },
    "main-grid-shell.html": {
        "style": """
    .main-grid {
      display: grid;
      grid-template-columns: var(--sidebar-w) minmax(0, 1fr) var(--right-sidebar-w);
      gap: var(--gap-xl);
    }
    .sidebar, .right-sidebar {
      height: 100%;
      min-height: 400px;
    }
    .sidebar {
      border-right: 1px solid var(--border);
      padding-right: 2rem;
    }
    .right-sidebar {
      border-left: 1px solid var(--border);
      padding-left: 2rem;
    }
    @media (max-width: 1280px) {
      .main-grid {
        grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
        gap: var(--gap-lg);
      }
      .right-sidebar {
        display: none;
      }
    }
    @media (max-width: 1024px) {
      .main-grid {
        grid-template-columns: 1fr;
      }
      .sidebar {
        display: none;
      }
    }""",
        "content": """<div class="main-grid w-full h-full border border-[var(--border)] rounded-xl bg-[var(--surface-l2)] overflow-hidden">
  <aside class="sidebar bg-[var(--surface)] p-4 pt-6"><div class="text-[10px] font-mono text-[var(--text-muted)]">{{sidebar_text|default("Left Sidebar (Navigation)")}}</div></aside>
  <main class="p-8 pt-6"><div class="text-sm font-semibold">{{main_text|default("Main Content Area")}}</div><div class="mt-4 text-xs text-[var(--text-muted)]">Resize window to see responsive behavior breakpoints (1280px, 1024px).</div></main>
  <aside class="right-sidebar bg-[var(--surface)] p-4 pt-6"><div class="text-[10px] font-mono text-[var(--text-muted)]">{{right_sidebar_text|default("Right Sidebar (On this page)")}}</div></aside>
</div>"""
    },
    "scroll-progress.html": {
        "style": """
    #scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: var(--accent);
      z-index: var(--z-progress, 50);
      width: 0;
      transition: width 0.1s ease;
    }""",
        "content": """<div id="scroll-progress"></div>
<div class="h-[200vh] w-full p-8 border border-[var(--border)] rounded-xl bg-[var(--surface)] text-sm text-[var(--zinc-400)] flex flex-col items-center">
  <div class="sticky top-12 font-mono text-xs">{{text|default("Scroll down to see the progress bar at the top of the window expand.")}}</div>
</div>""",
        "script": """
<script>
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const progress = document.getElementById('scroll-progress');
  if (progress) progress.style.width = scrolled + "%";
});
</script>"""
    },
    "copy-code-interaction.html": {
        "content": """<div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col max-w-2xl mx-auto mt-12">
  <div class="absolute top-0 left-0 w-full h-9 bg-[var(--surface-l3-alpha)] backdrop-blur border-b border-[var(--border-light)] flex items-center justify-between px-4 z-10">
      <div class="flex items-center gap-3">
        <span class="text-[9px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">{{lang|default("bash")}}</span>
      </div>
      <button class="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text)] flex items-center p-1 rounded hover:bg-[var(--surface-l3)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] outline-none" aria-label="Copy code">
        <iconify-icon icon="lucide:copy" class="text-xs"></iconify-icon>
      </button>
  </div>
  <pre class="p-5 pt-14 text-[11px] text-[var(--zinc-300)] mono overflow-x-auto leading-relaxed"><code><span class="text-[var(--zinc-500)]">{{comment|default("# Install the framework")}}</span>
<span class="text-[var(--zinc-200)]">{{command|default("npm install opencode-spec-kit")}}</span></code></pre>
</div>""",
        "script": """
<script>
document.querySelectorAll('.code-window').forEach(window => {
  const copyBtn = window.querySelector('button[aria-label="Copy code"]');
  const code = window.querySelector('code');
  if(copyBtn && code) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(code.innerText).then(() => {
        const icon = copyBtn.querySelector('iconify-icon');
        const originalIcon = icon.getAttribute('icon');
        icon.setAttribute('icon', 'lucide:check');
        copyBtn.classList.add('text-[var(--success)]');
        setTimeout(() => {
          icon.setAttribute('icon', originalIcon);
          copyBtn.classList.remove('text-[var(--success)]');
        }, 2000);
      }).catch(err => { console.error('Failed to copy text: ', err); });
    });
  }
});
</script>"""
    }
}

for filename, data in components.items():
    full_html = get_scaffold(
        content=data["content"], 
        extra_style=data.get("style", ""),
        extra_script=data.get("script", "")
    )
    with open(os.path.join(components_dir, filename), "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"Created component: {filename}")

