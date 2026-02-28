import os

components_dir = ".opencode/skill/sk-doc-visual/assets/components"
sections_dir = ".opencode/skill/sk-doc-visual/assets/sections"

base_head = """<!DOCTYPE html>
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
  <style>
    html {
      scroll-behavior: smooth;
      background-color: var(--bg);
      color: var(--text);
    }
    body {
      font-family: var(--font-sans);
      line-height: var(--lh-base);
      font-weight: var(--weight-medium);
      -webkit-font-smoothing: antialiased;
      margin: 0;
    }
    .mono {
      font-family: var(--font-mono);
    }
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--accent);
    }
    .page-container {
      width: 100%;
      max-width: var(--container-max);
      margin: 0 auto;
    }
  </style>
</head>
<body>
<div class="selection:bg-[var(--accent-muted)] min-h-screen relative w-full">
"""

base_foot = """
</div>
</body>
</html>"""

components = {
    "terminal-header.html": """<style>
.terminal-header {
  border-bottom: 1px solid var(--border);
  background: var(--bg-alpha);
  backdrop-filter: blur(var(--blur));
  z-index: var(--z-sticky);
}
.mono { font-family: var(--font-mono); }
</style>
<header class="terminal-header sticky top-0 px-6 py-3 flex items-center justify-between text-[10px] font-semibold tracking-widest text-[var(--text-muted)] mono">
  <div class="flex items-center gap-6">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse shadow-[0_0_8px_var(--success-alpha)]"></span>
      <span class="text-[var(--text)]">{{status_text|default("Live")}}</span>
    </div>
    <div class="hidden md:block">Region: {{region|default("Amsterdam, The Netherlands")}}</div>
  </div>
  <div class="flex items-center gap-6">
    <div id="clock">{{time|default("00:00:00 CET")}}</div>
  </div>
</header>""",
    
    "section-heading.html": """<div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
  <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{number|default("01")}} // {{title|default("SECTION TITLE")}}
</div>""",
    
    "code-window.html": """<style>
.mono { font-family: var(--font-mono); }
.code-window pre::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.code-window pre::-webkit-scrollbar-track {
  background: var(--bg);
}
.code-window pre::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
.code-window pre::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}
</style>
<div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl mb-6">
  <div class="absolute top-0 left-0 w-full h-9 bg-[var(--surface-l3-alpha)] backdrop-blur border-b border-[var(--border-light)] flex items-center justify-between px-4 z-10">
    <div class="flex items-center gap-3">
      <span class="text-[9px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">{{language|default("bash")}}</span>
    </div>
    <button class="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text)] flex items-center p-1 rounded hover:bg-[var(--surface-l3)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] outline-none" aria-label="Copy code">
      <iconify-icon icon="lucide:copy" class="text-xs"></iconify-icon>
    </button>
  </div>
  <pre class="p-5 pt-14 text-[11px] text-[var(--zinc-300)] mono overflow-x-auto leading-relaxed"><code>{{code_content|default("# Code example\\nconsole.log('Hello World');")}}</code></pre>
</div>""",
    
    "glass-card.html": """<style>
.glass-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  transition: var(--transition-card);
}
.glass-card:hover {
  border-color: var(--accent-hover);
  box-shadow: var(--glass-shadow);
  transform: translateY(-2px);
}
</style>
<div class="glass-card p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
  <p class="text-sm font-semibold mb-2 text-[var(--zinc-200)]">{{title|default("Card Title")}}</p>
  <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{content|default("Card content description goes here.")}}</p>
</div>""",
    
    "bento-card.html": """<div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {{extra_classes}}">
  <iconify-icon icon="{{icon|default('lucide:layers')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
  <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{title|default("Feature Title")}}</p>
  <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{content|default("Feature detailed description goes here.")}}</p>
</div>""",
    
    "data-table.html": """<style>
.mono { font-family: var(--font-mono); }
</style>
<div class="overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-lg">
  <div class="overflow-x-auto">
    <table class="w-full text-left text-[11px] mono whitespace-nowrap">
      <thead>
        <tr class="border-b border-[var(--border)] bg-[var(--surface-l2)]">
          <th class="py-2.5 px-5 text-[var(--text-muted)] font-semibold tracking-widest">{{header1|default("Column 1")}}</th>
          <th class="py-2.5 px-5 text-[var(--text-muted)] font-semibold tracking-widest">{{header2|default("Column 2")}}</th>
          <th class="py-2.5 px-5 text-[var(--text-muted)] font-semibold tracking-widest">{{header3|default("Column 3")}}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[rgba(255,255,255,0.05)]">
        <tr class="hover:bg-[var(--border-faint)] transition-colors">
          <td class="py-4 px-5 text-[var(--zinc-200)] font-semibold">{{row1_col1|default("Data A")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{row1_col2|default("Data B")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{row1_col3|default("Data C")}}</td>
        </tr>
        <tr class="hover:bg-[var(--border-faint)] transition-colors">
          <td class="py-4 px-5 text-[var(--zinc-200)] font-semibold">{{row2_col1|default("Data X")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{row2_col2|default("Data Y")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{row2_col3|default("Data Z")}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>""",
    
    "footer.html": """<style>
.mono { font-family: var(--font-mono); }
</style>
<footer class="pt-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-20 relative">
  <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[var(--border)] via-[var(--border-light)] to-transparent"></div>
  <div class="space-y-1">
    <p class="text-[10px] font-semibold tracking-widest text-[var(--zinc-400)] uppercase flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
      {{system_name|default("System Protocol Control")}}
    </p>
    <p class="text-[9px] mono text-[var(--text-muted)] opacity-70">{{integrity_hash|default("Integrity_Hash: 0x82f63b_System_Ref_v2.4_Final")}}</p>
  </div>
  <div class="text-left md:text-right space-y-1">
    <p class="text-[10px] font-semibold tracking-widest text-[var(--zinc-400)] uppercase">{{copyright|default("© 2026 OpenCode Infrastructure")}}</p>
    <p class="text-[9px] mono text-[var(--text-muted)] opacity-70">{{footer_note|default("End of Transmission Ledger")}}</p>
  </div>
</footer>"""
}

sections = {
    "hero-section.html": """<style>
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition-reveal);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.text-balance {
  text-wrap: balance;
}
.mono { font-family: var(--font-mono); }
</style>
<section class="mb-24 reveal active" id="top">
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
    <div class="space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent)] text-[10px] font-semibold tracking-widest rounded-full backdrop-blur-sm shadow-[0_0_15px_var(--accent-muted)]">
        <iconify-icon icon="{{badge_icon|default('lucide:cpu')}}"></iconify-icon> {{badge_text|default("Cognitive Infrastructure")}}
      </div>
      <h1 class="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-none text-balance">
        {{title_first|default("Open")}}<span class="text-[var(--accent)]">{{title_accent|default("Code.")}}</span>
      </h1>
    </div>
    <div class="lg:text-right space-y-6">
      <div class="space-y-1">
        <p class="text-[10px] text-[var(--text-muted)] font-semibold tracking-widest">{{version_label|default("Master Version")}}</p>
        <p class="text-3xl font-semibold mono text-[var(--zinc-200)]">{{version_value|default("v1.2.190-STABLE")}}</p>
      </div>
      <div class="flex lg:justify-end gap-3">
        <div class="px-4 py-2 border border-[var(--border)] text-[10px] font-semibold tracking-widest rounded bg-[var(--surface)] text-[var(--zinc-300)]">
          {{tag1|default("Hybrid RAG Fusion")}}
        </div>
        <div class="px-4 py-2 bg-[var(--text)] text-[var(--bg)] text-[10px] font-semibold tracking-widest rounded">
          {{tag2|default("SpecKit v2.4")}}
        </div>
      </div>
    </div>
  </div>
  <div class="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mt-16 mb-0"></div>
</section>""",
    
    "quick-start-section.html": """<style>
section[id] {
  scroll-margin-top: 6rem;
}
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition-reveal);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.glass-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  transition: var(--transition-card);
}
.glass-card:hover {
  border-color: var(--accent-hover);
  box-shadow: var(--glass-shadow);
  transform: translateY(-2px);
}
.mono { font-family: var(--font-mono); }
</style>
<section id="{{section_id|default('quickstart')}}" class="space-y-10 reveal pt-4 active">
  <div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{section_number|default("02")}} // {{section_title|default("QUICK START")}}
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <div class="space-y-6">
      <div class="glass-card p-6 space-y-4 shadow-lg hover:-translate-y-1 transition-transform duration-300">
        <p class="text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase">Prerequisites Checklist</p>
        <ul class="space-y-3 text-xs text-[var(--zinc-300)] mono">
          <li class="flex items-center gap-3"><iconify-icon icon="lucide:check-circle" class="text-[var(--success)] text-base"></iconify-icon> {{prereq1_name|default("OpenCode v1.0.190+")}} <span class="text-[var(--zinc-600)] text-[10px] ml-auto">{{prereq1_cmd|default("opencode --version")}}</span></li>
          <li class="flex items-center gap-3"><iconify-icon icon="lucide:check-circle" class="text-[var(--success)] text-base"></iconify-icon> {{prereq2_name|default("Node.js 18+")}} <span class="text-[var(--zinc-600)] text-[10px] ml-auto">{{prereq2_cmd|default("node --version")}}</span></li>
        </ul>
      </div>
    </div>

    <div class="space-y-6">
      <h3 class="text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">Installation</h3>
      <div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col">
        <div class="absolute top-0 left-0 w-full h-9 bg-[var(--surface-l3-alpha)] backdrop-blur border-b border-[var(--border-light)] flex items-center justify-between px-4 z-10">
          <div class="flex items-center gap-3">
            <span class="text-[9px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">bash</span>
          </div>
          <button class="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text)] flex items-center p-1 rounded hover:bg-[var(--surface-l3)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] outline-none" aria-label="Copy code">
            <iconify-icon icon="lucide:copy" class="text-xs"></iconify-icon>
          </button>
        </div>
        <pre class="p-5 pt-14 text-[11px] text-[var(--zinc-300)] mono overflow-x-auto leading-relaxed"><code>{{install_script|default("# Clone repository\\ngit clone https://github.com/example/repo.git\\n\\n# Install dependencies\\nnpm install")}}</code></pre>
      </div>
    </div>
  </div>
</section>""",
    
    "feature-grid-section.html": """<style>
section[id] {
  scroll-margin-top: 6rem;
}
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition-reveal);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.text-balance {
  text-wrap: balance;
}
</style>
<section id="{{section_id|default('features')}}" class="space-y-10 reveal pt-4 active">
  <div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{section_number|default("03")}} // {{section_title|default("FEATURES")}}
  </div>

  <div class="space-y-8">
    <p class="text-3xl font-semibold tracking-tighter text-[var(--zinc-200)] text-balance">{{headline|default("Powerful new tools for your workflow.")}}</p>
    <p class="text-[var(--zinc-400)] text-sm leading-relaxed max-w-3xl">{{description|default("Every feature is designed to reduce friction and improve your productivity.")}}</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
    <div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <iconify-icon icon="{{icon1|default('lucide:zap')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
      <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{feature1_title|default("Blazing Fast")}}</p>
      <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{feature1_desc|default("Zero latency execution using our proprietary engine.")}}</p>
    </div>
    <div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <iconify-icon icon="{{icon2|default('lucide:shield-check')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
      <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{feature2_title|default("Secure by Default")}}</p>
      <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{feature2_desc|default("All data is encrypted end-to-end and stored locally.")}}</p>
    </div>
    <div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <iconify-icon icon="{{icon3|default('lucide:layers')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
      <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{feature3_title|default("Fully Extensible")}}</p>
      <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{feature3_desc|default("Build custom plugins using our comprehensive API.")}}</p>
    </div>
  </div>
</section>""",
    
    "faq-section.html": """<style>
section[id] {
  scroll-margin-top: 6rem;
}
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition-reveal);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.glass-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  transition: var(--transition-card);
}
.glass-card:hover {
  border-color: var(--accent-hover);
  box-shadow: var(--glass-shadow);
  transform: translateY(-2px);
}
</style>
<section id="{{section_id|default('faq')}}" class="space-y-10 reveal pt-4 active">
  <div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{section_number|default("04")}} // {{section_title|default("FAQ")}}
  </div>
  
  <div class="space-y-6 pt-4">
    <div class="glass-card p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
      <p class="text-sm font-semibold mb-2 text-[var(--zinc-200)]">{{question1|default("Q: How does this compare to alternatives?")}}</p>
      <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{answer1|default("A: It is significantly faster and uses local first execution.")}}</p>
    </div>
    <div class="glass-card p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
      <p class="text-sm font-semibold mb-2 text-[var(--zinc-200)]">{{question2|default("Q: Do I need an API key?")}}</p>
      <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{answer2|default("A: No, everything runs locally on your machine.")}}</p>
    </div>
  </div>
</section>"""
}

# Add the page-container wrapper around sections for proper rendering
section_wrap_start = '<div class="page-container px-6 lg:px-12 py-12">\n'
section_wrap_end = '\n</div>'

for name, content in components.items():
    with open(os.path.join(components_dir, name), "w") as f:
        # For small components, we can just center them or pad them
        comp_wrap = '<div class="p-12 w-full max-w-4xl mx-auto">\n' + content + '\n</div>'
        full_html = f"{base_head}\n{comp_wrap}\n{base_foot}"
        f.write(full_html)

for name, content in sections.items():
    with open(os.path.join(sections_dir, name), "w") as f:
        full_html = f"{base_head}\n{section_wrap_start}{content}{section_wrap_end}\n{base_foot}"
        f.write(full_html)

print("Generated pixel-perfect previews with exact original HTML/CSS structure.")
