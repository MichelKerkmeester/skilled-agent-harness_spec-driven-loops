import os

components_dir = ".opencode/skill/sk-doc-visual/assets/components"
sections_dir = ".opencode/skill/sk-doc-visual/assets/sections"

base_head = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <link rel="stylesheet" href="../variables/colors.css">
  <link rel="stylesheet" href="../variables/typography.css">
  <link rel="stylesheet" href="../variables/layout.css">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
  <style>
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      padding: 2rem;
    }
  </style>
</head>
<body>
"""

base_foot = """
</body>
</html>"""

components = {
    "terminal-header.html": """<style>
.terminal-header { border-bottom: 1px solid var(--border); background: var(--bg-alpha); backdrop-filter: blur(var(--blur)); z-index: var(--z-sticky); }
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
    
    "section-heading.html": """<style>
.inline-flex { display: inline-flex; }
.items-center { align-items: center; }
.gap-3 { gap: 0.75rem; }
.border { border-width: 1px; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.rounded-full { border-radius: 9999px; }
.text-\\[10px\\] { font-size: 10px; }
.font-semibold { font-weight: 600; }
.tracking-widest { letter-spacing: 0.1em; }
.mb-2 { margin-bottom: 0.5rem; }
.w-1\\.5 { width: 0.375rem; }
.h-1\\.5 { height: 0.375rem; }
</style>
<div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
  <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{number|default("01")}} // {{title|default("SECTION TITLE")}}
</div>""",
    
    "code-window.html": """<style>
.mono { font-family: var(--font-mono); }
.code-window pre::-webkit-scrollbar { width: 4px; height: 4px; }
.code-window pre::-webkit-scrollbar-track { background: var(--bg); }
.code-window pre::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
.code-window pre::-webkit-scrollbar-thumb:hover { background: var(--accent); }
.relative { position: relative; }
.overflow-hidden { overflow: hidden; }
.border { border-width: 1px; }
.rounded-xl { border-radius: 0.75rem; }
.shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
.mb-6 { margin-bottom: 1.5rem; }
.absolute { position: absolute; }
.top-0 { top: 0; }
.left-0 { left: 0; }
.w-full { width: 100%; }
.h-9 { height: 2.25rem; }
.backdrop-blur { backdrop-filter: blur(8px); }
.border-b { border-bottom-width: 1px; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.z-10 { z-index: 10; }
.gap-3 { gap: 0.75rem; }
.text-\\[9px\\] { font-size: 9px; }
.font-semibold { font-weight: 600; }
.tracking-widest { letter-spacing: 0.1em; }
.uppercase { text-transform: uppercase; }
.opacity-0 { opacity: 0; }
.transition-opacity { transition-property: opacity; }
.p-1 { padding: 0.25rem; }
.rounded { border-radius: 0.25rem; }
.outline-none { outline: 2px solid transparent; outline-offset: 2px; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.p-5 { padding: 1.25rem; }
.pt-14 { padding-top: 3.5rem; }
.text-\\[11px\\] { font-size: 11px; }
.overflow-x-auto { overflow-x: auto; }
.leading-relaxed { line-height: 1.625; }
</style>
<div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl mb-6">
  <div class="absolute top-0 left-0 w-full h-9 bg-[var(--surface-l3-alpha)] backdrop-blur border-b border-[var(--border-light)] flex items-center justify-between px-4 z-10">
    <div class="flex items-center gap-3">
      <span class="text-[9px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">{{language|default("typescript")}}</span>
    </div>
    <button class="opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text)] flex items-center p-1 rounded hover:bg-[var(--surface-l3)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] outline-none" aria-label="Copy code">
      <iconify-icon icon="lucide:copy" class="text-xs"></iconify-icon>
    </button>
  </div>
  <pre class="p-5 pt-14 text-[11px] text-[var(--zinc-300)] mono overflow-x-auto leading-relaxed"><code>{{code_content|default("const hello = 'world';\nconsole.log(hello);")}}</code></pre>
</div>""",
    
    "glass-card.html": """<style>
.glass-card { background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card); transition: var(--transition-card); }
.glass-card:hover { border-color: var(--accent-hover); box-shadow: var(--glass-shadow); transform: translateY(-2px); }
.p-6 { padding: 1.5rem; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
.transition-transform { transition-property: transform; }
.duration-300 { transition-duration: 300ms; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-semibold { font-weight: 600; }
.mb-2 { margin-bottom: 0.5rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.leading-relaxed { line-height: 1.625; }
</style>
<div class="glass-card p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
  <p class="text-sm font-semibold mb-2 text-[var(--zinc-200)]">{{title|default("Card Title")}}</p>
  <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{content|default("This is an example of the glass card component content. It has an elegant hover state.")}}</p>
</div>""",
    
    "bento-card.html": """<style>
.p-6 { padding: 1.5rem; }
.border { border-width: 1px; }
.rounded-2xl { border-radius: 1rem; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.duration-300 { transition-duration: 300ms; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.mb-4 { margin-bottom: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-semibold { font-weight: 600; }
.mb-2 { margin-bottom: 0.5rem; }
.tracking-tight { letter-spacing: -0.025em; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.leading-relaxed { line-height: 1.625; }
</style>
<div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {{extra_classes}}">
  <iconify-icon icon="{{icon|default('lucide:layers')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
  <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{title|default("Bento Feature")}}</p>
  <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{content|default("Detailed description of this feature goes here. It uses a nice icon and hover effect.")}}</p>
</div>""",
    
    "data-table.html": """<style>
.mono { font-family: var(--font-mono); }
.overflow-hidden { overflow: hidden; }
.border { border-width: 1px; }
.rounded-xl { border-radius: 0.75rem; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
.overflow-x-auto { overflow-x: auto; }
.w-full { width: 100%; }
.text-left { text-align: left; }
.text-\\[11px\\] { font-size: 11px; }
.whitespace-nowrap { white-space: nowrap; }
.border-b { border-bottom-width: 1px; }
.py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.font-semibold { font-weight: 600; }
.tracking-widest { letter-spacing: 0.1em; }
.divide-y > :not([hidden]) ~ :not([hidden]) { border-top-width: calc(1px * calc(1 - 0)); border-bottom-width: calc(1px * 0); }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
</style>
<div class="overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-lg">
  <div class="overflow-x-auto">
    <table class="w-full text-left text-[11px] mono whitespace-nowrap">
      <thead>
        <tr class="border-b border-[var(--border)] bg-[var(--surface-l2)]">
          <th class="py-2.5 px-5 text-[var(--text-muted)] font-semibold tracking-widest">{{header1|default("Property")}}</th>
          <th class="py-2.5 px-5 text-[var(--text-muted)] font-semibold tracking-widest">{{header2|default("Value")}}</th>
          <th class="py-2.5 px-5 text-[var(--text-muted)] font-semibold tracking-widest">{{header3|default("Description")}}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[rgba(255,255,255,0.05)]">
        <tr class="hover:bg-[var(--border-faint)] transition-colors">
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{col11|default("color")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{col12|default("blue")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{col13|default("Primary brand color")}}</td>
        </tr>
        <tr class="hover:bg-[var(--border-faint)] transition-colors">
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{col21|default("font")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{col22|default("Inter")}}</td>
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{col23|default("Main sans-serif stack")}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>""",
    
    "footer.html": """<style>
.mono { font-family: var(--font-mono); }
.pt-20 { padding-top: 5rem; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.justify-between { justify-content: space-between; }
.items-start { align-items: flex-start; }
.gap-8 { gap: 2rem; }
.mt-20 { margin-top: 5rem; }
.relative { position: relative; }
.absolute { position: absolute; }
.top-0 { top: 0; }
.left-0 { left: 0; }
.w-full { width: 100%; }
.h-px { height: 1px; }
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
.space-y-1 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.25rem * var(--tw-space-y-reverse)); }
.text-\\[10px\\] { font-size: 10px; }
.font-semibold { font-weight: 600; }
.tracking-widest { letter-spacing: 0.1em; }
.uppercase { text-transform: uppercase; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.w-1\\.5 { width: 0.375rem; }
.h-1\\.5 { height: 0.375rem; }
.rounded-full { border-radius: 9999px; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.text-\\[9px\\] { font-size: 9px; }
.opacity-70 { opacity: 0.7; }
.text-left { text-align: left; }
</style>
<footer class="pt-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-20 relative">
  <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[var(--border)] via-[var(--border-light)] to-transparent"></div>
  <div class="space-y-1">
    <p class="text-[10px] font-semibold tracking-widest text-[var(--zinc-400)] uppercase flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
      {{system_name|default("System Infrastructure")}}
    </p>
    <p class="text-[9px] mono text-[var(--text-muted)] opacity-70">{{integrity_hash|default("Hash: 0x932fa_Stable")}}</p>
  </div>
  <div class="text-left md:text-right space-y-1">
    <p class="text-[10px] font-semibold tracking-widest text-[var(--zinc-400)] uppercase">{{copyright|default("© 2026 Company Name")}}</p>
    <p class="text-[9px] mono text-[var(--text-muted)] opacity-70">{{footer_note|default("All rights reserved.")}}</p>
  </div>
</footer>"""
}

sections = {
    "hero-section.html": """<style>
.mb-24 { margin-bottom: 6rem; }
.reveal { opacity: 1; transform: translateY(0); transition: var(--transition-reveal); }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.justify-between { justify-content: space-between; }
.gap-12 { gap: 3rem; }
.space-y-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1.5rem * var(--tw-space-y-reverse)); }
.inline-flex { display: inline-flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.border { border-width: 1px; }
.text-\\[10px\\] { font-size: 10px; }
.font-semibold { font-weight: 600; }
.tracking-widest { letter-spacing: 0.1em; }
.rounded-full { border-radius: 9999px; }
.backdrop-blur-sm { backdrop-filter: blur(4px); }
.text-6xl { font-size: 3.75rem; line-height: 1; }
.tracking-tighter { letter-spacing: -0.05em; }
.leading-none { line-height: 1; }
.text-balance { text-wrap: balance; }
.space-y-1 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.25rem * var(--tw-space-y-reverse)); }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.mono { font-family: var(--font-mono); }
.gap-3 { gap: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.rounded { border-radius: 0.25rem; }
.h-px { height: 1px; }
.w-full { width: 100%; }
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
.mt-16 { margin-top: 4rem; }
.mb-0 { margin-bottom: 0px; }
</style>
<section class="mb-24 reveal active" id="top">
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
    <div class="space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent)] text-[10px] font-semibold tracking-widest rounded-full backdrop-blur-sm shadow-[0_0_15px_var(--accent-muted)]">
        <iconify-icon icon="{{badge_icon|default('lucide:cpu')}}"></iconify-icon> {{badge_text|default("System Ready")}}
      </div>
      <h1 class="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-none text-balance">
        {{title_first|default("Open")}}<span class="text-[var(--accent)]">{{title_accent|default("Code.")}}</span>
      </h1>
    </div>
    <div class="lg:text-right space-y-6">
      <div class="space-y-1">
        <p class="text-[10px] text-[var(--text-muted)] font-semibold tracking-widest">{{version_label|default("Version")}}</p>
        <p class="text-3xl font-semibold mono text-[var(--zinc-200)]">{{version_value|default("v1.0.0")}}</p>
      </div>
      <div class="flex lg:justify-end gap-3">
        <div class="px-4 py-2 border border-[var(--border)] text-[10px] font-semibold tracking-widest rounded bg-[var(--surface)] text-[var(--zinc-300)]">
          {{tag1|default("Tag 1")}}
        </div>
        <div class="px-4 py-2 border border-[var(--border)] text-[10px] font-semibold tracking-widest rounded bg-[var(--surface)] text-[var(--zinc-300)]">
          {{tag2|default("Tag 2")}}
        </div>
      </div>
    </div>
  </div>
  <div class="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mt-16 mb-0"></div>
</section>""",
    
    "quick-start-section.html": """<style>
section[id] { scroll-margin-top: 6rem; }
.reveal { opacity: 1; transform: translateY(0); transition: var(--transition-reveal); }
.mono { font-family: var(--font-mono); }
.space-y-10 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(2.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(2.5rem * var(--tw-space-y-reverse)); }
.pt-4 { padding-top: 1rem; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.gap-8 { gap: 2rem; }
.space-y-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1.5rem * var(--tw-space-y-reverse)); }
.p-6 { padding: 1.5rem; }
.space-y-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1rem * var(--tw-space-y-reverse)); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
.transition-transform { transition-property: transform; }
.duration-300 { transition-duration: 300ms; }
.text-\\[10px\\] { font-size: 10px; }
.font-semibold { font-weight: 600; }
.tracking-widest { letter-spacing: 0.1em; }
.uppercase { text-transform: uppercase; }
.space-y-3 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.75rem * var(--tw-space-y-reverse)); }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-3 { gap: 0.75rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.ml-auto { margin-left: auto; }
</style>
<section id="{{section_id|default('quickstart')}}" class="space-y-10 reveal pt-4 active">
  <div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{section_number|default("02")}} // {{section_title|default("QUICK START")}}
  </div>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <div class="space-y-6">
      <div class="glass-card p-6 space-y-4 shadow-lg hover:-translate-y-1 transition-transform duration-300" style="background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card);">
        <p class="text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase">Prerequisites</p>
        <ul class="space-y-3 text-xs text-[var(--zinc-300)] mono">
          <li class="flex items-center gap-3"><iconify-icon icon="lucide:check-circle" class="text-[var(--success)] text-base"></iconify-icon> {{prereq_name|default("Node.js 18+")}} <span class="text-[var(--zinc-600)] text-[10px] ml-auto">{{prereq_cmd|default("node -v")}}</span></li>
        </ul>
      </div>
    </div>
    <div class="space-y-6">
      <h3 class="text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">Installation</h3>
      <div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div class="absolute top-0 left-0 w-full h-9 bg-[var(--surface-l3-alpha)] backdrop-blur border-b border-[var(--border-light)] flex items-center justify-between px-4 z-10" style="height: 2.25rem; border-bottom: 1px solid var(--border-light);">
          <span class="text-[9px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">bash</span>
        </div>
        <pre class="p-5 pt-14 text-[11px] text-[var(--zinc-300)] mono overflow-x-auto leading-relaxed" style="padding: 1.25rem; padding-top: 3.5rem;"><code>{{install_script|default("npm install")}}\n{{install_script_2|default("npm start")}}</code></pre>
      </div>
    </div>
  </div>
</section>""",
    
    "feature-grid-section.html": """<style>
section[id] { scroll-margin-top: 6rem; }
.reveal { opacity: 1; transform: translateY(0); transition: var(--transition-reveal); }
.text-balance { text-wrap: balance; }
.space-y-10 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(2.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(2.5rem * var(--tw-space-y-reverse)); }
.pt-4 { padding-top: 1rem; }
.space-y-8 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(2rem * var(--tw-space-y-reverse)); }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.font-semibold { font-weight: 600; }
.tracking-tighter { letter-spacing: -0.05em; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.leading-relaxed { line-height: 1.625; }
.max-w-3xl { max-width: 48rem; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.pt-6 { padding-top: 1.5rem; }
</style>
<section id="{{section_id|default('features')}}" class="space-y-10 reveal pt-4 active">
  <div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{section_number|default("03")}} // {{section_title|default("FEATURES")}}
  </div>
  <div class="space-y-8">
    <p class="text-3xl font-semibold tracking-tighter text-[var(--zinc-200)] text-balance">{{headline|default("Powerful new tools for your workflow.")}}</p>
    <p class="text-[var(--zinc-400)] text-sm leading-relaxed max-w-3xl">{{description|default("This section describes the key features of the system in a readable paragraph format.")}}</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
    <div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <iconify-icon icon="{{icon1|default('lucide:zap')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
      <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{feature1_title|default("Fast Performance")}}</p>
      <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{feature1_desc|default("Incredibly fast performance across all components.")}}</p>
    </div>
    <div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <iconify-icon icon="{{icon2|default('lucide:shield-check')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
      <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{feature2_title|default("Secure by Default")}}</p>
      <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{feature2_desc|default("Built-in security that protects your application.")}}</p>
    </div>
  </div>
</section>""",
    
    "faq-section.html": """<style>
section[id] { scroll-margin-top: 6rem; }
.reveal { opacity: 1; transform: translateY(0); transition: var(--transition-reveal); }
.space-y-10 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(2.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(2.5rem * var(--tw-space-y-reverse)); }
.pt-4 { padding-top: 1rem; }
.space-y-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1.5rem * var(--tw-space-y-reverse)); }
</style>
<section id="{{section_id|default('faq')}}" class="space-y-10 reveal pt-4 active">
  <div class="inline-flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest text-[var(--zinc-200)] mb-2">
    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{section_number|default("04")}} // {{section_title|default("FAQ")}}
  </div>
  <div class="space-y-6 pt-4">
    <div class="glass-card p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300" style="background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card);">
      <p class="text-sm font-semibold mb-2 text-[var(--zinc-200)]">{{question1|default("Q: Why build this?")}}</p>
      <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{answer1|default("A: To solve the pain points of modern web development.")}}</p>
    </div>
    <div class="glass-card p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300" style="background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card);">
      <p class="text-sm font-semibold mb-2 text-[var(--zinc-200)]">{{question2|default("Q: Is it ready for production?")}}</p>
      <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{answer2|default("A: Yes, it has been tested thoroughly.")}}</p>
    </div>
  </div>
</section>"""
}

# Write fully functional HTML previews
for name, content in components.items():
    with open(os.path.join(components_dir, name), "w") as f:
        # Wrap the component in the base HTML structure with CSS includes
        full_html = f"{base_head}\n{content}\n{base_foot}"
        f.write(full_html)

for name, content in sections.items():
    with open(os.path.join(sections_dir, name), "w") as f:
        # Wrap the section in the base HTML structure with CSS includes
        full_html = f"{base_head}\n{content}\n{base_foot}"
        f.write(full_html)

print("Added full HTML wrapping and placeholder defaults to all files.")
