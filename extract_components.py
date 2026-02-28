import os

components_dir = ".opencode/skill/sk-doc-visual/assets/components"
sections_dir = ".opencode/skill/sk-doc-visual/assets/sections"

os.makedirs(components_dir, exist_ok=True)
os.makedirs(sections_dir, exist_ok=True)

components = {
    "terminal-header.html": """<header class="terminal-header sticky top-0 px-6 py-3 flex items-center justify-between text-[10px] font-semibold tracking-widest text-[var(--text-muted)] mono">
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
  <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span> {{number}} // {{title}}
</div>""",
    "code-window.html": """<div class="relative group code-window rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl mb-6">
  <div class="absolute top-0 left-0 w-full h-9 bg-[var(--surface-l3-alpha)] backdrop-blur border-b border-[var(--border-light)] flex items-center justify-between px-4 z-10">
    <div class="flex items-center gap-3">
      <span class="text-[9px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">{{language}}</span>
    </div>
    <button class="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text)] flex items-center p-1 rounded hover:bg-[var(--surface-l3)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] outline-none" aria-label="Copy code">
      <iconify-icon icon="lucide:copy" class="text-xs"></iconify-icon>
    </button>
  </div>
  <pre class="p-5 pt-14 text-[11px] text-[var(--zinc-300)] mono overflow-x-auto leading-relaxed"><code>{{code_content}}</code></pre>
</div>""",
    "glass-card.html": """<div class="glass-card p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
  <p class="text-sm font-semibold mb-2 text-[var(--zinc-200)]">{{title}}</p>
  <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{content}}</p>
</div>""",
    "bento-card.html": """<div class="p-6 border border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {{extra_classes}}">
  <iconify-icon icon="{{icon|default('lucide:layers')}}" class="text-xl text-[var(--zinc-400)] mb-4"></iconify-icon>
  <p class="text-sm font-semibold text-[var(--zinc-200)] mb-2 tracking-tight">{{title}}</p>
  <p class="text-xs text-[var(--zinc-500)] leading-relaxed">{{content}}</p>
</div>""",
    "data-table.html": """<div class="overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-lg">
  <div class="overflow-x-auto">
    <table class="w-full text-left text-[11px] mono whitespace-nowrap">
      <thead>
        <tr class="border-b border-[var(--border)] bg-[var(--surface-l2)]">
          {{#each headers}}
          <th class="py-2.5 px-5 text-[var(--text-muted)] font-semibold tracking-widest">{{this}}</th>
          {{/each}}
        </tr>
      </thead>
      <tbody class="divide-y divide-[rgba(255,255,255,0.05)]">
        {{#each rows}}
        <tr class="hover:bg-[var(--border-faint)] transition-colors">
          {{#each this}}
          <td class="py-4 px-5 text-[var(--zinc-300)]">{{this}}</td>
          {{/each}}
        </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
</div>""",
    "footer.html": """<footer class="pt-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-20 relative">
  <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[var(--border)] via-[var(--border-light)] to-transparent"></div>
  <div class="space-y-1">
    <p class="text-[10px] font-semibold tracking-widest text-[var(--zinc-400)] uppercase flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
      {{system_name}}
    </p>
    <p class="text-[9px] mono text-[var(--text-muted)] opacity-70">{{integrity_hash}}</p>
  </div>
  <div class="text-left md:text-right space-y-1">
    <p class="text-[10px] font-semibold tracking-widest text-[var(--zinc-400)] uppercase">{{copyright}}</p>
    <p class="text-[9px] mono text-[var(--text-muted)] opacity-70">{{footer_note}}</p>
  </div>
</footer>"""
}

sections = {
    "hero-section.html": """<section class="mb-24 reveal" id="top">
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
    <div class="space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent)] text-[10px] font-semibold tracking-widest rounded-full backdrop-blur-sm shadow-[0_0_15px_var(--accent-muted)]">
        <iconify-icon icon="{{badge_icon|default('lucide:cpu')}}"></iconify-icon> {{badge_text}}
      </div>
      <h1 class="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-none text-balance">
        {{title_first}}<span class="text-[var(--accent)]">{{title_accent}}</span>
      </h1>
    </div>
    <div class="lg:text-right space-y-6">
      <div class="space-y-1">
        <p class="text-[10px] text-[var(--text-muted)] font-semibold tracking-widest">{{version_label}}</p>
        <p class="text-3xl font-semibold mono text-[var(--zinc-200)]">{{version_value}}</p>
      </div>
      <div class="flex lg:justify-end gap-3">
        {{#each tags}}
        <div class="px-4 py-2 border border-[var(--border)] text-[10px] font-semibold tracking-widest rounded bg-[var(--surface)] text-[var(--zinc-300)]">
          {{this}}
        </div>
        {{/each}}
      </div>
    </div>
  </div>
  <div class="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mt-16 mb-0"></div>
</section>""",
    "quick-start-section.html": """<section id="{{section_id}}" class="space-y-10 reveal pt-4">
  {{> section-heading number=section_number title=section_title}}
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <div class="space-y-6">
      <div class="glass-card p-6 space-y-4 shadow-lg hover:-translate-y-1 transition-transform duration-300">
        <p class="text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase">Prerequisites</p>
        <ul class="space-y-3 text-xs text-[var(--zinc-300)] mono">
          {{#each prerequisites}}
          <li class="flex items-center gap-3"><iconify-icon icon="lucide:check-circle" class="text-[var(--success)] text-base"></iconify-icon> {{name}} <span class="text-[var(--zinc-600)] text-[10px] ml-auto">{{command}}</span></li>
          {{/each}}
        </ul>
      </div>
    </div>
    <div class="space-y-6">
      <h3 class="text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">Installation</h3>
      {{> code-window language="bash" code_content=install_script}}
    </div>
  </div>
</section>""",
    "feature-grid-section.html": """<section id="{{section_id}}" class="space-y-10 reveal pt-4">
  {{> section-heading number=section_number title=section_title}}
  <div class="space-y-8">
    <p class="text-3xl font-semibold tracking-tighter text-[var(--zinc-200)] text-balance">{{headline}}</p>
    <p class="text-[var(--zinc-400)] text-sm leading-relaxed max-w-3xl">{{description}}</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
    {{#each features}}
    {{> bento-card title=title content=description icon=icon extra_classes=extra_classes}}
    {{/each}}
  </div>
</section>""",
    "faq-section.html": """<section id="{{section_id}}" class="space-y-10 reveal pt-4">
  {{> section-heading number=section_number title=section_title}}
  <div class="space-y-6 pt-4">
    {{#each faqs}}
    {{> glass-card title=question content=answer}}
    {{/each}}
  </div>
</section>"""
}

for name, content in components.items():
    with open(os.path.join(components_dir, name), "w") as f:
        f.write(content)

for name, content in sections.items():
    with open(os.path.join(sections_dir, name), "w") as f:
        f.write(content)

print("Extraction complete.")