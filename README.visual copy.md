<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>README Visual — OpenCode Dev Environment</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-body: 'Space Grotesk', system-ui, sans-serif;
      --font-mono: 'IBM Plex Mono', 'SF Mono', Consolas, monospace;

      --ve-bg: #f7f6f2;
      --ve-surface: #ffffff;
      --ve-surface2: #f1efe8;
      --ve-surface-elevated: #fffefb;
      --ve-border: rgba(17, 24, 39, 0.09);
      --ve-border-bright: rgba(17, 24, 39, 0.18);
      --ve-text: #1f2937;
      --ve-text-dim: #6b7280;
      --ve-accent: #0369a1;
      --ve-accent-dim: rgba(3, 105, 161, 0.09);
      --ve-success: #15803d;
      --ve-success-dim: rgba(21, 128, 61, 0.12);
      --ve-warning: #b45309;
      --ve-warning-dim: rgba(180, 83, 9, 0.12);
      --ve-danger: #b91c1c;
      --ve-danger-dim: rgba(185, 28, 28, 0.12);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --ve-bg: #09131f;
        --ve-surface: #102033;
        --ve-surface2: #14283f;
        --ve-surface-elevated: #19324f;
        --ve-border: rgba(255, 255, 255, 0.09);
        --ve-border-bright: rgba(255, 255, 255, 0.16);
        --ve-text: #e5edf8;
        --ve-text-dim: #9bb2cc;
        --ve-accent: #38bdf8;
        --ve-accent-dim: rgba(56, 189, 248, 0.16);
        --ve-success: #4ade80;
        --ve-success-dim: rgba(74, 222, 128, 0.16);
        --ve-warning: #fbbf24;
        --ve-warning-dim: rgba(251, 191, 36, 0.16);
        --ve-danger: #f87171;
        --ve-danger-dim: rgba(248, 113, 113, 0.16);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: var(--ve-bg);
      background-image:
        radial-gradient(ellipse at 0% 0%, var(--ve-accent-dim), transparent 42%),
        radial-gradient(ellipse at 100% 100%, var(--ve-success-dim), transparent 40%);
      color: var(--ve-text);
      font-family: var(--font-body);
      line-height: 1.65;
      min-height: 100vh;
      overflow-wrap: break-word;
      word-break: break-word;
      padding: clamp(16px, 2vw, 28px);
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate {
      animation: fadeUp 0.45s ease-out both;
      animation-delay: calc(var(--i, 0) * 0.05s);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0.01ms !important;
      }
      html {
        scroll-behavior: auto;
      }
    }

    .page {
      margin: 0 auto;
      max-width: 1480px;
      min-width: 0;
    }

    .hero {
      background: var(--ve-surface-elevated);
      border: 1px solid color-mix(in srgb, var(--ve-border) 60%, var(--ve-accent) 40%);
      border-radius: 18px;
      box-shadow: 0 16px 44px rgba(0, 0, 0, 0.08);
      margin-bottom: 18px;
      min-width: 0;
      overflow: hidden;
      padding: clamp(20px, 3vw, 34px);
      position: relative;
    }

    .hero::after {
      background: linear-gradient(120deg, transparent, var(--ve-accent-dim), transparent);
      content: "";
      inset: 0;
      pointer-events: none;
      position: absolute;
    }

    .hero h1 {
      font-size: clamp(1.55rem, 2.8vw, 2.55rem);
      letter-spacing: -0.03em;
      line-height: 1.14;
      margin-bottom: 8px;
      max-width: 24ch;
      position: relative;
      z-index: 1;
    }

    .hero p {
      color: var(--ve-text-dim);
      font-family: var(--font-mono);
      font-size: 0.83rem;
      position: relative;
      z-index: 1;
    }

    .stats {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      margin-top: 18px;
      min-width: 0;
      position: relative;
      z-index: 1;
    }

    .stat-card {
      background: var(--ve-surface2);
      border: 1px solid var(--ve-border);
      border-radius: 12px;
      min-width: 0;
      padding: 10px 12px;
    }

    .stat-label {
      color: var(--ve-text-dim);
      font-family: var(--font-mono);
      font-size: 0.64rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stat-value {
      color: var(--ve-text);
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1.2;
      margin-top: 5px;
    }

    .workspace {
      display: grid;
      gap: 18px;
      grid-template-columns: minmax(210px, 280px) minmax(0, 1fr);
      min-width: 0;
    }

    .workspace > * {
      min-width: 0;
    }

    .toc-panel,
    .doc-panel {
      background: var(--ve-surface);
      border: 1px solid var(--ve-border);
      border-radius: 16px;
      min-width: 0;
      overflow: hidden;
    }

    .toc-panel {
      align-self: start;
      max-height: calc(100vh - 42px);
      position: sticky;
      top: 14px;
    }

    .panel-head {
      background: var(--ve-surface2);
      border-bottom: 1px solid var(--ve-border);
      color: var(--ve-text-dim);
      font-family: var(--font-mono);
      font-size: 0.67rem;
      letter-spacing: 0.12em;
      padding: 11px 14px;
      text-transform: uppercase;
    }

    #auto-toc {
      display: grid;
      gap: 2px;
      max-height: calc(100vh - 94px);
      min-width: 0;
      overflow-y: auto;
      padding: 10px;
      scrollbar-width: thin;
      scrollbar-color: var(--ve-border-bright) transparent;
    }

    #auto-toc a {
      border: 1px solid transparent;
      border-radius: 10px;
      color: var(--ve-text-dim);
      display: block;
      font-size: 0.82rem;
      min-width: 0;
      overflow-wrap: anywhere;
      padding: 8px 10px;
      text-decoration: none;
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    #auto-toc a.depth-h3 {
      margin-left: 12px;
      font-size: 0.77rem;
    }

    #auto-toc a:hover,
    #auto-toc a:focus-visible {
      background: var(--ve-accent-dim);
      border-color: var(--ve-border-bright);
      color: var(--ve-text);
      outline: none;
    }

    .doc-panel {
      min-width: 0;
      padding: clamp(16px, 2.6vw, 34px);
    }

    .markdown-body {
      min-width: 0;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .markdown-body > :first-child {
      margin-top: 0;
    }

    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4 {
      line-height: 1.25;
      margin-top: 1.8em;
      scroll-margin-top: 18px;
    }

    .markdown-body h1 {
      font-size: clamp(1.8rem, 3.2vw, 2.45rem);
      letter-spacing: -0.02em;
      margin-bottom: 0.65rem;
    }

    .markdown-body h2 {
      border-bottom: 1px solid var(--ve-border);
      font-size: clamp(1.3rem, 2vw, 1.7rem);
      padding-bottom: 0.46rem;
    }

    .markdown-body h3 {
      color: var(--ve-text);
      font-size: clamp(1.03rem, 1.45vw, 1.24rem);
    }

    .markdown-body p,
    .markdown-body ul,
    .markdown-body ol,
    .markdown-body blockquote,
    .markdown-body pre,
    .markdown-body table,
    .markdown-body details {
      margin-top: 1rem;
    }

    .markdown-body ul,
    .markdown-body ol {
      padding-left: 1.35rem;
    }

    .markdown-body li + li {
      margin-top: 0.28rem;
    }

    .markdown-body a {
      color: var(--ve-accent);
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }

    .markdown-body a:hover {
      text-decoration-thickness: 2px;
    }

    .markdown-body blockquote {
      background: var(--ve-surface2);
      border-left: 3px solid var(--ve-accent);
      border-radius: 0 12px 12px 0;
      color: var(--ve-text-dim);
      margin-left: 0;
      padding: 10px 13px;
    }

    .markdown-body hr {
      border: 0;
      border-top: 1px solid var(--ve-border);
      margin: 1.7rem 0;
    }

    .markdown-body code {
      background: var(--ve-accent-dim);
      border: 1px solid var(--ve-border);
      border-radius: 7px;
      color: var(--ve-text);
      font-family: var(--font-mono);
      font-size: 0.86em;
      padding: 0.12em 0.34em;
    }

    .markdown-body pre {
      background: color-mix(in srgb, var(--ve-surface2) 75%, var(--ve-accent-dim) 25%);
      border: 1px solid var(--ve-border);
      border-radius: 14px;
      overflow-x: auto;
      padding: 0.88rem 0.94rem;
      scrollbar-width: thin;
      scrollbar-color: var(--ve-border-bright) transparent;
    }

    .markdown-body pre code {
      background: transparent;
      border: 0;
      color: inherit;
      font-size: 0.81rem;
      padding: 0;
    }

    .markdown-body table {
      border-collapse: collapse;
      display: block;
      max-width: 100%;
      overflow-x: auto;
      width: 100%;
    }

    .markdown-body th,
    .markdown-body td {
      border: 1px solid var(--ve-border);
      min-width: 0;
      padding: 0.55rem 0.62rem;
      text-align: left;
      vertical-align: top;
    }

    .markdown-body th {
      background: var(--ve-surface2);
      font-family: var(--font-mono);
      font-size: 0.76rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .markdown-body tr:nth-child(even) {
      background: color-mix(in srgb, var(--ve-accent-dim) 52%, transparent 48%);
    }

    .markdown-body img {
      border: 1px solid var(--ve-border);
      border-radius: 12px;
      display: block;
      height: auto;
      max-width: 100%;
    }

    .markdown-body .anchor-note {
      color: var(--ve-text-dim);
      font-family: var(--font-mono);
      font-size: 0.72rem;
      margin-top: 0.2rem;
    }

    @media (max-width: 1060px) {
      .workspace {
        grid-template-columns: minmax(0, 1fr);
      }

      .toc-panel {
        max-height: none;
        position: relative;
        top: 0;
      }

      #auto-toc {
        max-height: 260px;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="hero animate" style="--i:0">
      <h1 id="readme-visual-companion">README Visual Companion</h1>
      <p>Source: <code>README.md</code> · Generated as a standalone visual HTML artifact.</p>
      <div class="stats">
        <article class="stat-card">
          <div class="stat-label">Sections</div>
          <div class="stat-value" id="stat-sections">0</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Tables</div>
          <div class="stat-value" id="stat-tables">0</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Code Blocks</div>
          <div class="stat-value" id="stat-code">0</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Links</div>
          <div class="stat-value" id="stat-links">0</div>
        </article>
      </div>
    </header>

    <div class="workspace">
      <aside class="toc-panel animate" style="--i:1" aria-label="Section navigation">
        <div class="panel-head">Contents</div>
        <nav id="auto-toc"></nav>
      </aside>

      <main class="doc-panel animate" style="--i:2">
        <article id="doc" class="markdown-body">
<div align="left">

<h1 id="opencode-dev-environment--spec-kit-w-cognitive-memory">OpenCode Dev Environment + Spec Kit w/ Cognitive Memory</h1>
<p><a href="https://github.com/MichelKerkmeester/opencode-spec-kit-framework/stargazers"><img src="https://img.shields.io/github/stars/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&logo=github&color=fce566&labelColor=222222" alt="GitHub Stars"></a>
<a href="LICENSE"><img src="https://img.shields.io/github/license/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=7bd88f&labelColor=222222" alt="License"></a>
<a href="https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases"><img src="https://img.shields.io/github/v/release/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=5ad4e6&labelColor=222222" alt="Latest Release"></a></p>
<blockquote>
<ul>
<li>99.999% of people won&#39;t try this system. Beat the odds?</li>
<li>Don&#39;t reward me with unwanted coffee: <a href="https://buymeacoffee.com/michelkerkmeester">https://buymeacoffee.com/michelkerkmeester</a></li>
</ul>
</blockquote>
</div>

<hr>
<h2 id="table-of-contents">📑 TABLE OF CONTENTS</h2>
<ul>
<li><a href="#1--overview">🔭 1. OVERVIEW</a></li>
<li><a href="#2--quick-start">🚀 2. QUICK START</a></li>
<li><a href="#3--spec-kit-documentation">📝 3. SPEC KIT DOCUMENTATION</a></li>
<li><a href="#4--memory-engine">🧠 4. MEMORY ENGINE</a></li>
<li><a href="#5--agent-network">🤖 5. AGENT NETWORK</a></li>
<li><a href="#6--command-architecture">⌨️ 6. COMMAND ARCHITECTURE</a></li>
<li><a href="#7--skills-library">🧩 7. SKILLS LIBRARY</a></li>
<li><a href="#8--gate-system">🚧 8. GATE SYSTEM</a></li>
<li><a href="#9--code-mode-mcp">💻 9. CODE MODE MCP</a></li>
<li><a href="#10--extensibility">🔌 10. EXTENSIBILITY</a></li>
<li><a href="#11--configuration">⚙️ 11. CONFIGURATION</a></li>
<li><a href="#12--usage-examples">💡 12. USAGE EXAMPLES</a></li>
<li><a href="#13--troubleshooting">🔧 13. TROUBLESHOOTING</a></li>
<li><a href="#14--faq">❓ 14. FAQ</a></li>
<li><a href="#15--related-documents">📚 15. RELATED DOCUMENTS</a></li>
</ul>
<hr>
<h2 id="1--overview">1. 🔭 OVERVIEW</h2>
<!-- ANCHOR:overview -->

<h3 id="what-is-this">What is This?</h3>
<p>AI coding assistants are powerful, but they have amnesia. Every session starts from zero. You explain your auth system Monday. By Wednesday, it&#39;s a blank slate. Architectural decisions? Lost in chat history. Documentation? &quot;I&#39;ll do it later&quot; (you won&#39;t).</p>
<p>Two custom-built systems fix this: a <strong>spec-kit documentation framework</strong> and a <strong>cognitive memory MCP server</strong> that turn stateless AI sessions into a continuous, searchable development history. Purpose-built for AI-assisted development, not a wrapper around existing tools.</p>
<p><strong>Who it&#39;s for:</strong> Developers using AI assistants who are tired of re-explaining context every session and losing decisions to chat history while hoping documentation happens &quot;later.&quot;</p>
<h3 id="how-it-all-connects">How It All Connects</h3>
<pre><code>┌──────────────────────────────────────────────────────────────┐
│                      YOUR REQUEST                            │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  GATE SYSTEM (3 mandatory gates)                             │
│  Gate 1: Understanding ─► Gate 2: Skill Routing ─► Gate 3:   │
│  Context surfacing        Auto-load expertise      Spec      │
│  Dual-threshold           skill_advisor.py         folder    │
│  validation               confidence &gt;= 0.8        HARD BLOCK │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
         ┌─────────────┴──────────────┐
         ▼                            ▼
┌─────────────────┐        ┌─────────────────────┐
│  AGENT NETWORK  │        │  SKILLS LIBRARY     │
│  10 specialized │        │  10 domain skills   │
│  agents with    │◄──────►│  auto-loaded by     │
│  routing logic  │        │  task keywords      │
└────────┬────────┘        └──────────┬──────────┘
         │                            │
         ▼                            ▼
┌──────────────────────────────────────────────────────────────┐
│  MEMORY ENGINE (32 MCP tools: 25 memory + 7 code mode)       │
│  Cognitive tiers ─ Causal graphs ─ Unified Context Engine    │
│  3-channel hybrid: Vector + BM25 + FTS5 (RRF)                │
│  MMR diversity ─ TRM confidence gating ─ query expansion     │
│  Sources: spec memory + constitutional + spec documents      │
│  Embeddings: Voyage | OpenAI | HuggingFace Local (free)      │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  SPEC KIT (documentation framework)                          │
│  specs/###-feature/  ─  memory/  ─  scratch/                 │
│  4 levels ─ 81 templates ─ 13 validation rules               │
└──────────────────────────────────────────────────────────────┘
</code></pre>
<p>Everything connects. Memory files live <em>inside</em> spec folders. Gates enforce documentation before any file change. Skills auto-load based on your task. Agents coordinate and delegate. The result: every AI-assisted session is documented, searchable, recoverable and auditable.</p>
<p><strong>Local-first</strong>: The Memory Engine runs on your local system with no cloud dependency. See <a href="#embedding-providers">Embedding Providers</a> for optional cloud upgrades.</p>
<h3 id="recent-platform-highlights">Recent Platform Highlights</h3>
<ul>
<li><strong>Hybrid RAG Fusion (spec 138)</strong>: The memory engine activates three retrieval channels simultaneously (Vector, BM25, FTS5) and fuses results via Reciprocal Rank Fusion. MMR diversity pruning, Transparent Reasoning Module confidence gating, multi-query expansion and AST-based section extraction complete the Unified Context Engine.</li>
<li><strong>Gemini CLI is the 4th runtime</strong>: 8 agents, 19 TOML command wrappers, 10 skill symlinks and 3 MCP servers. Agents optimized for gemini-3.1-pro within a 400K effective token window.</li>
<li><strong>Spec documents are indexed and searchable</strong>: spec folder docs (<code>spec.md</code>, <code>plan.md</code>, <code>tasks.md</code>, <code>checklist.md</code>, <code>decision-record.md</code>, <code>implementation-summary.md</code>, <code>research.md</code>, <code>handover.md</code>) surface via <code>find_spec</code> and <code>find_decision</code> intents.</li>
<li><strong>473 anchor tags across 74 READMEs</strong>: section-level retrieval with ~93% token savings over loading full files.</li>
<li><strong>Runtime DB path standardized</strong>: <code>MEMORY_DB_PATH</code> aligned to <code>mcp_server/dist/database/context-index.sqlite</code> across all runtime configurations.</li>
</ul>
<h3 id="requirements">Requirements</h3>
<table>
<thead>
<tr>
<th>Requirement</th>
<th>Minimum</th>
<th>Recommended</th>
</tr>
</thead>
<tbody><tr>
<td><a href="https://github.com/sst/opencode">OpenCode</a></td>
<td>v1.0.190+</td>
<td>Latest</td>
</tr>
<tr>
<td>Node.js</td>
<td>v18+</td>
<td>v20+</td>
</tr>
<tr>
<td>npm</td>
<td>v9+</td>
<td>v10+</td>
</tr>
</tbody></table>
<!-- /ANCHOR:overview -->

<hr>
<h2 id="2--quick-start">2. 🚀 QUICK START</h2>
<!-- ANCHOR:quick-start -->

<h3 id="prerequisites">Prerequisites</h3>
<ul>
<li><a href="https://github.com/sst/opencode">OpenCode</a> v1.0.190+ (<code>opencode --version</code>)</li>
<li>Node.js 18+ (<code>node --version</code>)</li>
<li>npm 9+ (<code>npm --version</code>)</li>
</ul>
<h3 id="30-second-setup">30-Second Setup</h3>
<pre><code class="language-bash"># 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode-spec-kit-framework.git
cd opencode-spec-kit-framework

# 2. Install and build the Memory Engine
cd .opencode/skill/system-spec-kit &amp;&amp; npm install &amp;&amp; npm run build &amp;&amp; cd ../../..

# 3. Launch OpenCode
opencode
</code></pre>
<h3 id="verify-installation">Verify Installation</h3>
<pre><code class="language-bash"># Inside OpenCode, test the memory system
/memory:manage health
# Expected: &quot;Status: healthy&quot; with database stats

# Test skill routing
# Ask: &quot;What skills are available?&quot;
# Expected: 10 skills listed
</code></pre>
<!-- /ANCHOR:quick-start -->

<hr>
<h2 id="3--spec-kit-documentation">3. 📝 SPEC KIT DOCUMENTATION</h2>
<!-- ANCHOR:spec-kit-documentation -->

<p>4 levels, 81 templates, 13 validation rules.</p>
<p>Every feature leaves a trail. Not for bureaucracy. For your future self, your team and the AI that picks up where you left off.</p>
<h3 id="four-documentation-levels">Four Documentation Levels</h3>
<table>
<thead>
<tr>
<th>Level</th>
<th>LOC</th>
<th>Required Files</th>
<th>Use When</th>
</tr>
</thead>
<tbody><tr>
<td><strong>1</strong></td>
<td>&lt;100</td>
<td>spec.md, plan.md, tasks.md, implementation-summary.md</td>
<td>All features (minimum)</td>
</tr>
<tr>
<td><strong>2</strong></td>
<td>100-499</td>
<td>Level 1 + checklist.md</td>
<td>QA validation needed</td>
</tr>
<tr>
<td><strong>3</strong></td>
<td>&gt;=500</td>
<td>Level 2 + decision-record.md (+ optional research.md)</td>
<td>Complex/architecture changes</td>
</tr>
<tr>
<td><strong>3+</strong></td>
<td>Complexity 80+</td>
<td>Level 3 + AI protocols, extended checklist, sign-offs</td>
<td>Multi-agent, enterprise governance</td>
</tr>
</tbody></table>
<h3 id="core--addendum-template-architecture">CORE + ADDENDUM Template Architecture</h3>
<p><strong>81 templates</strong> across the v2.2 composition model. CORE templates are shared across levels. ADDENDUM templates extend them. Update CORE once and all levels inherit. Zero duplication.</p>
<pre><code>Level 1:  [CORE templates]                    -&gt; 4 files
Level 2:  [CORE] + [L2-VERIFY addendum]       -&gt; 5 files
Level 3:  [CORE] + [L2] + [L3-ARCH addendum]  -&gt; 6 files
Level 3+: [CORE] + [all addendums]             -&gt; 6+ files
</code></pre>
<table>
<thead>
<tr>
<th>Template</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><code>spec.md</code></td>
<td>Feature scope, requirements, constraints (frozen)</td>
</tr>
<tr>
<td><code>plan.md</code></td>
<td>Implementation approach and design decisions</td>
</tr>
<tr>
<td><code>tasks.md</code></td>
<td>Ordered task breakdown with status tracking</td>
</tr>
<tr>
<td><code>checklist.md</code></td>
<td>QA validation items (P0/P1/P2 priority)</td>
</tr>
<tr>
<td><code>decision-record.md</code></td>
<td>Architectural decisions with rationale and trade-offs</td>
</tr>
<tr>
<td><code>research.md</code></td>
<td>Technical investigation findings (optional, L3+)</td>
</tr>
<tr>
<td><code>implementation-summary.md</code></td>
<td>Post-implementation record of what was built</td>
</tr>
</tbody></table>
<h3 id="validation-and-automation">Validation and Automation</h3>
<p><strong>13 pluggable validation rules</strong> run before you can mark any spec folder complete:</p>
<table>
<thead>
<tr>
<th>Rule</th>
<th>Validates</th>
</tr>
</thead>
<tbody><tr>
<td><code>check-anchors</code></td>
<td>Reference integrity</td>
</tr>
<tr>
<td><code>check-placeholders</code></td>
<td>No <code>[PLACEHOLDER]</code> text remaining</td>
</tr>
<tr>
<td><code>check-frontmatter</code></td>
<td>YAML metadata present and valid</td>
</tr>
<tr>
<td><code>check-sections</code></td>
<td>Required sections exist with content</td>
</tr>
<tr>
<td><code>check-complexity</code></td>
<td>Complexity score matches documentation level</td>
</tr>
<tr>
<td><code>check-evidence</code></td>
<td>Evidence citations present</td>
</tr>
<tr>
<td><code>check-priority-tags</code></td>
<td>P0/P1/P2 tags applied correctly</td>
</tr>
<tr>
<td><code>check-files</code></td>
<td>Required files exist for declared level</td>
</tr>
<tr>
<td><code>check-folder-naming</code></td>
<td><code>###-kebab-case</code> naming convention</td>
</tr>
<tr>
<td><code>check-level-match</code></td>
<td>Declared level matches actual complexity</td>
</tr>
<tr>
<td><code>check-level</code></td>
<td>Level detection from folder contents</td>
</tr>
<tr>
<td><code>check-section-counts</code></td>
<td>Minimum section counts met</td>
</tr>
<tr>
<td><code>check-ai-protocols</code></td>
<td>AI interaction rules validated</td>
</tr>
</tbody></table>
<p>Exit code 0 = pass. Exit code 2 = must fix.</p>
<!-- /ANCHOR:spec-kit-documentation -->

<hr>
<h2 id="4--memory-engine">4. 🧠 MEMORY ENGINE</h2>
<!-- ANCHOR:memory-engine -->

<p>25 MCP tools across 7 cognitive layers.</p>
<blockquote>
<p><em>Remember everything. Surface what matters. Keep it private.</em></p>
</blockquote>
<p>Your AI assistant forgets everything between sessions. The Memory Engine fixes this with 23 MCP tools across 7 architectural layers: 3-source indexing, 7-intent retrieval routing, schema v15 metadata (<code>document_type</code>, <code>spec_level</code>) and document-type scoring. The Unified Context Engine (spec 138) adds a 3-channel hybrid retrieval pipeline with RRF fusion, MMR diversity pruning, confidence gating and causal graph enrichment.</p>
<h3 id="3-source-discovery-pipeline">3-Source Discovery Pipeline</h3>
<p>The memory index builds from 5 distinct source types, each with its own discovery path and importance weight:</p>
<table>
<thead>
<tr>
<th>#</th>
<th>Source</th>
<th>Discovery Path</th>
<th>Weight</th>
<th>What Gets Indexed</th>
</tr>
</thead>
<tbody><tr>
<td>1</td>
<td><strong>Constitutional docs</strong></td>
<td><code>constitutional.md</code> files</td>
<td>1.0</td>
<td>System rules (never decay, always surface)</td>
</tr>
<tr>
<td>2</td>
<td><strong>Spec folder documents</strong></td>
<td><code>.opencode/specs/**/*.md</code></td>
<td>0.6-0.8</td>
<td>Specs, plans, tasks, decisions, summaries</td>
</tr>
<tr>
<td>3</td>
<td><strong>Memory files</strong></td>
<td><code>specs/###-feature/memory/*.{md,txt}</code></td>
<td>0.5</td>
<td>Session context, decisions, progress</td>
</tr>
</tbody></table>
<p>Source 2 was added in spec 126 — prior to that, spec folder documents (the most authoritative project knowledge) were invisible to memory search. Controlled via <code>includeSpecDocs</code> parameter on <code>memory_index_scan</code> and <code>SPECKIT_INDEX_SPEC_DOCS</code> environment variable.</p>
<h3 id="mcp-tool-layers">MCP Tool Layers</h3>
<p>Each layer has enforced token budgets to prevent context bloat:</p>
<table>
<thead>
<tr>
<th>Layer</th>
<th>Tools</th>
<th>Purpose</th>
<th>Token Budget</th>
</tr>
</thead>
<tbody><tr>
<td><strong>L1</strong> Orchestration</td>
<td><code>memory_context</code></td>
<td>Unified entry with intent-aware routing</td>
<td>2,000</td>
</tr>
<tr>
<td><strong>L2</strong> Core</td>
<td><code>memory_search</code>, <code>memory_match_triggers</code>, <code>memory_save</code></td>
<td>Semantic search, fast keyword matching (&lt;50ms), file indexing</td>
<td>1,500</td>
</tr>
<tr>
<td><strong>L3</strong> Discovery</td>
<td><code>memory_list</code>, <code>memory_stats</code>, <code>memory_health</code></td>
<td>Browse, statistics, health checks</td>
<td>800</td>
</tr>
<tr>
<td><strong>L4</strong> Mutation</td>
<td><code>memory_update</code>, <code>memory_delete</code>, <code>memory_validate</code></td>
<td>Update metadata, delete, record feedback</td>
<td>500</td>
</tr>
<tr>
<td><strong>L5</strong> Checkpoints</td>
<td><code>checkpoint_create</code>, <code>checkpoint_list</code>, <code>checkpoint_restore</code>, <code>checkpoint_delete</code></td>
<td>Save/restore memory state (undo button for your index)</td>
<td>600</td>
</tr>
<tr>
<td><strong>L6</strong> Analysis</td>
<td><code>task_preflight</code>, <code>task_postflight</code>, <code>memory_drift_why</code>, <code>memory_causal_link</code>, <code>memory_causal_stats</code>, <code>memory_causal_unlink</code></td>
<td>Epistemic tracking, causal graphs</td>
<td>1,200</td>
</tr>
<tr>
<td><strong>L7</strong> Maintenance</td>
<td><code>memory_index_scan</code>, <code>memory_get_learning_history</code></td>
<td>Bulk indexing, learning trends</td>
<td>1,000</td>
</tr>
</tbody></table>
<p>Most agents interact only with L1-L2. Mutation (L4) and lifecycle (L5) are reserved for explicit user actions. Analysis (L6) is invoked at task boundaries for learning measurement.</p>
<h3 id="cognitive-features">Cognitive Features</h3>
<p>Not basic vector storage. Inspired by biological working memory with cognitive subsystems:</p>
<p><strong>Attention-Based Decay</strong>: memory relevance decays using <code>recency x frequency x importance</code> scoring.</p>
<pre><code>new_score = current_score x (decay_rate ^ turns_elapsed)
</code></pre>
<table>
<thead>
<tr>
<th>Tier</th>
<th>Decay Rate</th>
<th>Behavior</th>
</tr>
</thead>
<tbody><tr>
<td>Constitutional</td>
<td>1.00</td>
<td>Never decays, always surfaces</td>
</tr>
<tr>
<td>Normal</td>
<td>0.80</td>
<td>Gradual fade over conversation turns</td>
</tr>
<tr>
<td>Temporary</td>
<td>0.60</td>
<td>Fast fade, session-scoped</td>
</tr>
</tbody></table>
<p><strong>Tiered Content Injection</strong>: content delivery adapts to memory state.</p>
<table>
<thead>
<tr>
<th>Memory State</th>
<th>Score Range</th>
<th>Injection Behavior</th>
</tr>
</thead>
<tbody><tr>
<td><code>HOT</code></td>
<td>&gt;= 0.8</td>
<td>Full content injected into context</td>
</tr>
<tr>
<td><code>WARM</code></td>
<td>0.25 - 0.79</td>
<td>Summary only</td>
</tr>
<tr>
<td><code>COLD</code></td>
<td>&lt; 0.25</td>
<td>Trigger phrases only (suppressed)</td>
</tr>
</tbody></table>
<p><strong>Co-Activation (Spreading Activation)</strong>: when a primary memory is activated, semantically related memories receive a 0.35 score boost. Search for &quot;authentication&quot; and the system co-activates memories about JWT tokens and OAuth setup along with session management.</p>
<p>Two additional subsystems: <strong>FSRS Scheduler</strong> (spaced repetition for review intervals) and <strong>Prediction Error Gating</strong> (novel discoveries amplified, expected content deprioritized).</p>
<h3 id="hybrid-search-architecture">Hybrid Search Architecture</h3>
<p>Three retrieval channels fuse via Reciprocal Rank Fusion (RRF) in the Unified Context Engine (spec 138):</p>
<table>
<thead>
<tr>
<th>Channel</th>
<th>Method</th>
<th>Strength</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Vector</strong></td>
<td>Semantic similarity (embeddings)</td>
<td>Conceptual matching, paraphrase detection</td>
</tr>
<tr>
<td><strong>BM25 Keyword</strong></td>
<td>Term frequency / inverse document</td>
<td>Technical terms, code identifiers, exact phrases</td>
</tr>
<tr>
<td><strong>FTS5 Full-Text</strong></td>
<td>SQLite full-text search</td>
<td>Exact substring matching, structured queries</td>
</tr>
</tbody></table>
<p><strong>Post-fusion processing</strong>: MMR diversity pruning (reduces redundant results by &gt;= 30%), Transparent Reasoning Module confidence gating (blocks results below <code>confidence_threshold=0.65</code>, never returns empty set), multi-query expansion (&gt;= 3 query variants for vocabulary mismatch resolution) and AST-based document section extraction.</p>
<p><strong>Latency target</strong>: p95 &lt;= 120ms with all three channels active on the v15 SQLite schema. Zero schema migrations required.</p>
<p><strong>4 embedding providers</strong>: Voyage AI, OpenAI, HuggingFace Local (free, default), auto-detection.</p>
<p><strong>Spec126 Hardening</strong>: import-path fixes, <code>specFolder</code> filtering, metadata preservation, vector metadata plumbing and stable causal edge semantics.</p>
<p><strong>Intent-Aware Scoring</strong>: weights adjust for 7 task types.</p>
<table>
<thead>
<tr>
<th>Task Intent</th>
<th>Weight Adjustment</th>
</tr>
</thead>
<tbody><tr>
<td><code>fix_bug</code></td>
<td>Boosts error history, debugging context</td>
</tr>
<tr>
<td><code>add_feature</code></td>
<td>Boosts implementation patterns, existing architecture</td>
</tr>
<tr>
<td><code>understand</code></td>
<td>Balanced weights across all memory types</td>
</tr>
<tr>
<td><code>refactor</code></td>
<td>Boosts code structure, dependency information</td>
</tr>
<tr>
<td><code>security_audit</code></td>
<td>Boosts security decisions, vulnerability context</td>
</tr>
<tr>
<td><code>find_spec</code></td>
<td>Boosts spec documents, plans, decision records</td>
</tr>
<tr>
<td><code>find_decision</code></td>
<td>Boosts decision records, architectural context</td>
</tr>
</tbody></table>
<p><strong>Document-Type Scoring</strong>: search results are multiplied by document type to prioritize authoritative sources. Schema v15 tracks <code>document_type</code> and <code>spec_level</code> per indexed entry.</p>
<table>
<thead>
<tr>
<th>Document Type</th>
<th>Multiplier</th>
<th>Rationale</th>
</tr>
</thead>
<tbody><tr>
<td><code>constitutional</code></td>
<td>2.0x</td>
<td>System rules — always highest priority</td>
</tr>
<tr>
<td><code>spec</code></td>
<td>1.4x</td>
<td>Authoritative requirements and scope</td>
</tr>
<tr>
<td><code>decision_record</code></td>
<td>1.4x</td>
<td>Architectural decisions with rationale</td>
</tr>
<tr>
<td><code>plan</code></td>
<td>1.3x</td>
<td>Implementation approach and design</td>
</tr>
<tr>
<td><code>tasks</code></td>
<td>1.1x</td>
<td>Ordered task breakdowns</td>
</tr>
<tr>
<td><code>implementation_summary</code></td>
<td>1.1x</td>
<td>Post-implementation records</td>
</tr>
<tr>
<td><code>research</code></td>
<td>1.0x</td>
<td>Investigation findings</td>
</tr>
<tr>
<td><code>checklist</code></td>
<td>1.0x</td>
<td>QA validation items</td>
</tr>
<tr>
<td><code>handover</code></td>
<td>1.0x</td>
<td>Session continuation context</td>
</tr>
<tr>
<td><code>memory</code></td>
<td>1.0x</td>
<td>Baseline — session context and decisions</td>
</tr>
<tr>
<td><code>readme</code></td>
<td>0.8x</td>
<td>Documentation (informational, not decisions)</td>
</tr>
<tr>
<td><code>scratch</code></td>
<td>0.6x</td>
<td>Temporary workspace (lowest priority)</td>
</tr>
</tbody></table>
<h3 id="anchor-format">ANCHOR Format</h3>
<p>Structured content markers enabling selective retrieval with ~93% token savings:</p>
<pre><code class="language-markdown">&lt;!-- ANCHOR:decisions --&gt;
Key architectural decisions for this spec...
&lt;!-- /ANCHOR:decisions --&gt;
</code></pre>
<p>Instead of loading entire memory files (~2,000 tokens), the system retrieves only the relevant anchor section (~150 tokens). ~473 anchor tags across 74 READMEs enable section-level extraction throughout the project.</p>
<h3 id="causal-memory-graph">Causal Memory Graph</h3>
<p>Every decision has a lineage. The causal graph tracks 6 relationship types:</p>
<table>
<thead>
<tr>
<th>Relationship</th>
<th>Direction</th>
<th>Example</th>
</tr>
</thead>
<tbody><tr>
<td><code>caused</code></td>
<td>A -&gt; B</td>
<td>&quot;JWT decision&quot; -&gt; caused -&gt; &quot;token refresh implementation&quot;</td>
</tr>
<tr>
<td><code>derived_from</code></td>
<td>A &lt;- B</td>
<td>&quot;rate limiter config&quot; -&gt; derived from -&gt; &quot;load testing results&quot;</td>
</tr>
<tr>
<td><code>supports</code></td>
<td>A -&gt; B</td>
<td>&quot;performance benchmarks&quot; -&gt; supports -&gt; &quot;caching decision&quot;</td>
</tr>
<tr>
<td><code>supersedes</code></td>
<td>A -&gt; B</td>
<td>&quot;v2 auth flow&quot; -&gt; supersedes -&gt; &quot;v1 auth flow&quot;</td>
</tr>
<tr>
<td><code>enabled</code></td>
<td>A -&gt; B</td>
<td>&quot;OAuth2 setup&quot; -&gt; enabled -&gt; &quot;social login feature&quot;</td>
</tr>
<tr>
<td><code>contradicts</code></td>
<td>A &lt;-&gt; B</td>
<td>&quot;stateless approach&quot; -&gt; contradicts -&gt; &quot;session storage proposal&quot;</td>
</tr>
</tbody></table>
<p>Use <code>memory_drift_why</code> to trace the causal chain up to N hops. <code>memory_causal_stats</code> reports coverage percentage (target: 60% of memories linked).</p>
<p><strong>Spec Document Chains</strong>: when spec folder documents are indexed, <code>createSpecDocumentChain()</code> automatically establishes relationship edges between related documents within the same spec folder:</p>
<pre><code>spec.md ──caused──► plan.md ──caused──► tasks.md ──caused──► implementation-summary.md
                       ▲
  decision-record.md ──supports──┘   research.md ──supports──► spec.md
  checklist.md ──supports──► spec.md
</code></pre>
<p>This enables traversal from high-level specs down to implementation details (and back) via <code>memory_drift_why</code>.</p>
<blockquote>
<p>Full reference: <a href=".opencode/skill/system-spec-kit/mcp_server/README.md">MCP Server Documentation</a> | <a href=".opencode/skill/system-spec-kit/README.md">Memory System Guide</a></p>
</blockquote>
<!-- /ANCHOR:memory-engine -->

<hr>
<h2 id="5--agent-network">5. 🤖 AGENT NETWORK</h2>
<!-- ANCHOR:agent-network -->

<p>10 specialized agents with role-based routing.</p>
<p>Ten specialized agents prevent AI assistants from making assumptions, skipping documentation, creating technical debt and drifting from scope. Two are built into OpenCode. Eight are custom agents in <code>.opencode/agent/</code>.</p>
<p>10 specialized agents across 4 runtime platforms (OpenCode, Claude Code, ChatGPT, Gemini CLI) with aligned role definitions.</p>
<h3 id="all-agents">All Agents</h3>
<table>
<thead>
<tr>
<th>Agent</th>
<th>Type</th>
<th>Model</th>
<th>Role</th>
</tr>
</thead>
<tbody><tr>
<td><code>@general</code></td>
<td>Built-in</td>
<td></td>
<td>Implementation, complex coding tasks</td>
</tr>
<tr>
<td><code>@explore</code></td>
<td>Built-in</td>
<td></td>
<td>Quick codebase exploration, file discovery</td>
</tr>
<tr>
<td><code>@orchestrate</code></td>
<td>Custom</td>
<td>Primary</td>
<td>Multi-agent coordination with enterprise patterns</td>
</tr>
<tr>
<td><code>@context</code></td>
<td>Custom</td>
<td>claude-haiku</td>
<td>Context retrieval and synthesis for other agents</td>
</tr>
<tr>
<td><code>@speckit</code></td>
<td>Custom</td>
<td>claude-sonnet</td>
<td>Spec folder creation (exclusive: only agent that writes spec docs)</td>
</tr>
<tr>
<td><code>@debug</code></td>
<td>Custom</td>
<td>claude-opus</td>
<td>Fresh-perspective debugging, root cause analysis</td>
</tr>
<tr>
<td><code>@research</code></td>
<td>Custom</td>
<td>claude-opus</td>
<td>Evidence gathering, technical investigation</td>
</tr>
<tr>
<td><code>@review</code></td>
<td>Custom</td>
<td>inherited</td>
<td>Code review with pattern validation (READ-ONLY)</td>
</tr>
<tr>
<td><code>@write</code></td>
<td>Custom</td>
<td>claude-sonnet</td>
<td>Documentation generation (READMEs, skills, guides)</td>
</tr>
<tr>
<td><code>@handover</code></td>
<td>Custom</td>
<td>claude-haiku</td>
<td>Session continuation, context preservation</td>
</tr>
</tbody></table>
<h3 id="enterprise-orchestration">Enterprise Orchestration</h3>
<p>The <code>@orchestrate</code> agent implements distributed-systems patterns:</p>
<ul>
<li><strong>Context Window Budget (CWB)</strong>: tracks context consumption across delegated tasks. Wave-based dispatching enables 10+ parallel agents without overflow.</li>
<li><strong>Circuit Breaker</strong>: isolates failing agents (3 failures -&gt; OPEN state, 60s cooldown)</li>
<li><strong>Saga Compensation</strong>: reverse-order rollback when multi-task workflows fail</li>
<li><strong>Quality Gates</strong>: pre/mid/post execution scoring with 70-point threshold</li>
<li><strong>Resource Budgeting</strong>: token budget management (50K default, 80% warning, 100% halt)</li>
<li><strong>Checkpointing</strong>: recovery snapshots every 5 tasks or 10 tool calls</li>
<li><strong>Conditional Branching</strong>: IF/THEN/ELSE logic with 3-level nesting</li>
<li><strong>Sub-Orchestrator Pattern</strong>: delegates complex sub-workflows to nested orchestrators</li>
</ul>
<h3 id="runtime-platforms">Runtime Platforms</h3>
<p>Each runtime gets its own agent adapter directory. Agent bodies share the same OpenCode source content. Frontmatter adapts to what each platform expects.</p>
<table>
<thead>
<tr>
<th>Runtime</th>
<th>Agent Directory</th>
<th>Config File</th>
<th>Model</th>
</tr>
</thead>
<tbody><tr>
<td><strong>OpenCode</strong></td>
<td><code>.opencode/agent/</code></td>
<td><code>opencode.json</code></td>
<td>Provider default</td>
</tr>
<tr>
<td><strong>Claude Code</strong></td>
<td><code>.claude/agents/</code></td>
<td><code>.claude/mcp.json</code></td>
<td>claude-sonnet/opus/haiku</td>
</tr>
<tr>
<td><strong>ChatGPT</strong></td>
<td><code>.opencode/agent/chatgpt/</code></td>
<td>n/a</td>
<td>gpt-4.1</td>
</tr>
<tr>
<td><strong>Gemini CLI</strong></td>
<td><code>.gemini/agents/</code></td>
<td><code>.gemini/settings.json</code></td>
<td>gemini-3.1-pro</td>
</tr>
</tbody></table>
<p>OpenCode is the source of truth. Claude, ChatGPT and Gemini directories are runtime adapters that reference or mirror the same agent definitions. Edit <code>.opencode/agent/</code> and all runtimes stay in sync.</p>
<h3 id="how-agents-get-chosen">How Agents Get Chosen</h3>
<p><code>@research</code> for investigation. <code>@speckit</code> for spec documentation (exclusively). <code>@debug</code> when stuck 3+ attempts. <code>@review</code> for code quality. <code>@orchestrate</code> for multi-agent coordination.</p>
<h3 id="fresh-perspective-debugging">Fresh-Perspective Debugging</h3>
<p>The <code>@debug</code> agent uses a 4-phase methodology: Observe, Analyze, Hypothesize, Fix. It starts with no prior context on purpose. Trigger with <code>/spec_kit:debug</code>, select your preferred model and get a fresh perspective.</p>
<!-- /ANCHOR:agent-network -->

<hr>
<h2 id="6--command-architecture">6. ⌨️ COMMAND ARCHITECTURE</h2>
<!-- ANCHOR:command-architecture -->

<p>20 commands across 4 namespaces with 25 YAML assets.</p>
<p>Commands are user-triggered workflows built on a two-layer architecture. Markdown entry points route to YAML execution engines.</p>
<p><strong>Layer 1: Entry Point (.md)</strong>: user-facing interface for input collection, setup and routing.
<strong>Layer 2: Execution Engine (.yaml)</strong>: behavioral spec with step enumeration, validation gates, agent prompts and circuit breakers.</p>
<p><strong>Why commands beat free-form prompts</strong>: One prompt. Twelve steps. Zero manual overhead.</p>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>Free-Form Prompts</th>
<th>Commands</th>
</tr>
</thead>
<tbody><tr>
<td>Step Memory</td>
<td>You remember each</td>
<td>Workflow baked in</td>
</tr>
<tr>
<td>Interaction Count</td>
<td>12 prompts for 12</td>
<td>1 prompt, 12 steps</td>
</tr>
<tr>
<td>Enforcement</td>
<td>No enforcement</td>
<td>Gates prevent skipping</td>
</tr>
<tr>
<td>Skill Loading</td>
<td>Manual skill loading</td>
<td>Auto-loads what&#39;s needed</td>
</tr>
</tbody></table>
<h3 id="spec_kit-8-commands">spec_kit/ (8 commands)</h3>
<p>All support <code>:auto</code> and <code>:confirm</code> mode suffixes.</p>
<table>
<thead>
<tr>
<th>Command</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><code>/spec_kit:complete</code></td>
<td>Full workflow: spec -&gt; plan -&gt; implement -&gt; verify</td>
</tr>
<tr>
<td><code>/spec_kit:plan</code></td>
<td>Planning only, no implementation</td>
</tr>
<tr>
<td><code>/spec_kit:implement</code></td>
<td>Execute an existing plan</td>
</tr>
<tr>
<td><code>/spec_kit:phase</code></td>
<td>Decompose a spec into phased child folders</td>
</tr>
<tr>
<td><code>/spec_kit:research</code></td>
<td>Technical investigation with evidence gathering</td>
</tr>
<tr>
<td><code>/spec_kit:debug</code></td>
<td>Delegate debugging to a fresh-perspective sub-agent</td>
</tr>
<tr>
<td><code>/spec_kit:resume</code></td>
<td>Continue a previous session (auto-loads memory)</td>
</tr>
<tr>
<td><code>/spec_kit:handover</code></td>
<td>Create session handover (<code>:quick</code> or <code>:full</code> variants)</td>
</tr>
</tbody></table>
<h3 id="memory-5-commands">memory/ (5 commands)</h3>
<table>
<thead>
<tr>
<th>Command</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><code>/memory:save</code></td>
<td>Save context via <code>generate-context.js</code></td>
</tr>
<tr>
<td><code>/memory:continue</code></td>
<td>Session recovery from crash or compaction</td>
</tr>
<tr>
<td><code>/memory:context</code></td>
<td>Unified retrieval with intent-aware routing</td>
</tr>
<tr>
<td><code>/memory:learn</code></td>
<td>Explicit learning capture (<code>correct</code> subcommand for mistakes)</td>
</tr>
<tr>
<td><code>/memory:manage</code></td>
<td>Database ops: stats, health, cleanup, checkpoints</td>
</tr>
</tbody></table>
<h3 id="create-6-commands">create/ (6 commands)</h3>
<table>
<thead>
<tr>
<th>Command</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><code>/create:skill</code></td>
<td>Scaffold a new skill with structure</td>
</tr>
<tr>
<td><code>/create:agent</code></td>
<td>Scaffold a new agent definition</td>
</tr>
<tr>
<td><code>/create:folder_readme</code></td>
<td>AI-optimized README.md with proper structure</td>
</tr>
<tr>
<td><code>/create:skill_asset</code></td>
<td>Create a skill asset file</td>
</tr>
<tr>
<td><code>/create:skill_reference</code></td>
<td>Create a skill reference file</td>
</tr>
<tr>
<td><code>/create:install_guide</code></td>
<td>Generate a 5-phase install guide</td>
</tr>
</tbody></table>
<h3 id="utility-1-command">Utility (1 command)</h3>
<table>
<thead>
<tr>
<th>Command</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><code>/agent_router</code></td>
<td>Route requests to AI Systems with full System Prompt identity adoption</td>
</tr>
</tbody></table>
<!-- /ANCHOR:command-architecture -->

<hr>
<h2 id="7--skills-library">7. 🧩 SKILLS LIBRARY</h2>
<!-- ANCHOR:skills-library -->

<p>10 domain skills, auto-loaded by task keywords.</p>
<p>Skills are domain expertise on demand. The AI loads the right skill and already knows your conventions.</p>
<h3 id="all-skills">All Skills</h3>
<table>
<thead>
<tr>
<th>Skill</th>
<th>Domain</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><code>mcp-code-mode</code></td>
<td>Integrations</td>
<td>External tools via Code Mode (Figma, GitHub, ClickUp)</td>
</tr>
<tr>
<td><code>mcp-figma</code></td>
<td>Design</td>
<td>Figma file access, components, styles, comments</td>
</tr>
<tr>
<td><code>system-spec-kit</code></td>
<td>Documentation</td>
<td>Spec folders, templates, memory integration, context preservation and memory workflows</td>
</tr>
<tr>
<td><code>mcp-chrome-devtools</code></td>
<td>Browser</td>
<td>DevTools automation, screenshots, debugging</td>
</tr>
<tr>
<td><code>sk-code--full-stack</code></td>
<td>Multi-Stack</td>
<td>Go, Node.js, React, React Native, Swift, auto-detected via marker files</td>
</tr>
<tr>
<td><code>sk-code--opencode</code></td>
<td>System Code</td>
<td>TypeScript, Python, Shell for MCP servers and scripts</td>
</tr>
<tr>
<td><code>sk-code--web</code></td>
<td>Web Dev</td>
<td>Webflow, vanilla JS: implementation, debugging, verification</td>
</tr>
<tr>
<td><code>sk-documentation</code></td>
<td>Docs</td>
<td>Document quality scoring, skill creation and install guides</td>
</tr>
<tr>
<td><code>sk-git</code></td>
<td>Git</td>
<td>Commits, branches, PRs, worktrees</td>
</tr>
</tbody></table>
<h3 id="auto-detection">Auto-Detection</h3>
<p><code>skill_advisor.py</code> analyzes your request keywords. Confidence &gt;= 0.8 = skill auto-loads.</p>
<p><strong>Multi-Stack Auto-Detection</strong> (<code>sk-code--full-stack</code>):</p>
<table>
<thead>
<tr>
<th>Stack</th>
<th>Category</th>
<th>Detection Marker</th>
<th>Example Patterns</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Go</strong></td>
<td>backend</td>
<td><code>go.mod</code></td>
<td>Domain layers, table-driven tests</td>
</tr>
<tr>
<td><strong>Node.js</strong></td>
<td>backend</td>
<td><code>package.json</code> with &quot;express&quot;</td>
<td>Express routes, async/await</td>
</tr>
<tr>
<td><strong>React</strong></td>
<td>frontend</td>
<td><code>next.config.js</code> or <code>package.json</code> with &quot;react&quot;</td>
<td>Server/Client components, hooks</td>
</tr>
<tr>
<td><strong>React Native</strong></td>
<td>mobile</td>
<td><code>app.json</code> with &quot;expo&quot;</td>
<td>Navigation, hooks, platform APIs</td>
</tr>
<tr>
<td><strong>Swift</strong></td>
<td>mobile</td>
<td><code>Package.swift</code></td>
<td>SwiftUI, Combine, async/await</td>
</tr>
</tbody></table>
<h3 id="skill-content-structure">Skill Content Structure</h3>
<p>Each skill is organized for progressive disclosure:</p>
<ul>
<li><code>SKILL.md</code> as the entrypoint and routing surface</li>
<li><code>references/</code> for deeper documentation and standards</li>
<li><code>assets/</code> for reusable templates and examples</li>
<li>Optional <code>scripts/</code> for deterministic automation and validation</li>
</ul>
<p>See <a href=".opencode/skill/README.md#5-skill-structure">Skills Library README</a> for directory conventions and authoring guidance.</p>
<!-- /ANCHOR:skills-library -->

<hr>
<h2 id="8--gate-system">8. 🚧 GATE SYSTEM</h2>
<!-- ANCHOR:gate-system -->

<p>3 mandatory gates before any file change.</p>
<p>Every request passes through mandatory gates before the AI touches a single file. <em>Enforced</em>, not suggested. No exceptions.</p>
<pre><code>Request ──► Gate 1 (SOFT) ──► Gate 2 (REQUIRED) ──► Gate 3 (HARD) ──► Execute
            Understanding      Skill Routing         Spec Folder
</code></pre>
<p><strong>Gate 1: Understanding + Context Surfacing</strong> (SOFT BLOCK)
Dual-threshold validation: <code>READINESS = (confidence &gt;= 0.70) AND (uncertainty &lt;= 0.35)</code>. Both must pass. If either fails, the AI investigates (max 3 iterations) before escalating with options. Surfaces relevant memories via trigger matching before you even ask.</p>
<p><strong>Gate 2: Skill Routing</strong> (REQUIRED)
Runs <code>skill_advisor.py</code> against your request. Confidence &gt;= 0.8 means the skill <em>must</em> be loaded. This ensures the right domain expertise is always in context.</p>
<p><strong>Gate 3: Spec Folder</strong> (HARD BLOCK)
If the request involves <em>any</em> file modification, the AI must ask: A) Use existing? B) Create new? C) Update related? D) Skip? E) Phase folder — target a specific phase child (e.g., <code>specs/NNN-name/001-phase/</code>)? No file changes without an answer.</p>
<p><strong>Post-Execution Rules:</strong></p>
<ul>
<li><strong>Memory Save</strong>: <code>generate-context.js</code> is mandatory (no manual memory file creation)</li>
<li><strong>Completion Verification</strong>: AI loads <code>checklist.md</code> and verifies every item with evidence</li>
</ul>
<h3 id="analysis-lenses">Analysis Lenses</h3>
<p>Six lenses applied silently to catch problems:</p>
<table>
<thead>
<tr>
<th>Lens</th>
<th>Catches</th>
</tr>
</thead>
<tbody><tr>
<td><strong>SYSTEMS</strong></td>
<td>Missed dependencies, side effects</td>
</tr>
<tr>
<td><strong>BIAS</strong></td>
<td>Solving symptoms instead of root causes</td>
</tr>
<tr>
<td><strong>SCOPE</strong></td>
<td>Solution complexity exceeding problem size</td>
</tr>
<tr>
<td><strong>CLARITY</strong></td>
<td>Over-abstraction, unearned complexity</td>
</tr>
<tr>
<td><strong>VALUE</strong></td>
<td>Cosmetic changes disguised as improvements</td>
</tr>
<tr>
<td><strong>SUSTAINABILITY</strong></td>
<td>Future maintenance nightmares</td>
</tr>
</tbody></table>
<h3 id="auto-detected-anti-patterns">Auto-Detected Anti-Patterns</h3>
<p>24 pre-indexed anti-patterns with automatic detection. Six core patterns:</p>
<table>
<thead>
<tr>
<th>Pattern</th>
<th>Trigger</th>
<th>Response</th>
</tr>
</thead>
<tbody><tr>
<td>Scope creep</td>
<td>&quot;also add&quot;, &quot;bonus feature&quot;</td>
<td>&quot;That&#39;s a separate change.&quot;</td>
</tr>
<tr>
<td>Over-engineering</td>
<td>&quot;future-proof&quot;, &quot;might need&quot;</td>
<td>&quot;Is this solving a current problem or a hypothetical one?&quot;</td>
</tr>
<tr>
<td>Gold-plating</td>
<td>&quot;while we&#39;re here&quot;</td>
<td>&quot;That&#39;s outside current scope. Track separately?&quot;</td>
</tr>
<tr>
<td>Premature optimization</td>
<td>&quot;could be slow&quot;</td>
<td>&quot;Has this been measured?&quot;</td>
</tr>
<tr>
<td>Cargo culting</td>
<td>&quot;best practice&quot;, &quot;always should&quot;</td>
<td>&quot;Does this pattern fit this specific case?&quot;</td>
</tr>
<tr>
<td>Wrong abstraction</td>
<td>&quot;DRY this up&quot; (2 instances)</td>
<td>&quot;Similar code isn&#39;t always the same concept.&quot;</td>
</tr>
</tbody></table>
<!-- /ANCHOR:gate-system -->

<hr>
<h2 id="9--code-mode-mcp">9. 💻 CODE MODE MCP</h2>
<!-- ANCHOR:code-mode-mcp -->

<p>7 tools for external integrations with 98.7% context savings.</p>
<p>External tool integration via TypeScript execution. Instead of loading all tool definitions into context upfront, Code Mode uses <strong>progressive disclosure</strong>: search for tools, load only what&#39;s needed, execute in TypeScript.</p>
<h3 id="code-mode-tools-7">Code Mode Tools (7)</h3>
<table>
<thead>
<tr>
<th>Tool</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><code>search_tools</code></td>
<td>Discover relevant tools by task description</td>
</tr>
<tr>
<td><code>tool_info</code></td>
<td>Get complete tool parameters and TypeScript interface</td>
</tr>
<tr>
<td><code>call_tool_chain</code></td>
<td>Execute TypeScript code with access to all registered tools</td>
</tr>
<tr>
<td><code>list_tools</code></td>
<td>List all currently registered tool names</td>
</tr>
<tr>
<td><code>register_manual</code></td>
<td>Register a new tool provider</td>
</tr>
<tr>
<td><code>deregister_manual</code></td>
<td>Remove a tool provider</td>
</tr>
<tr>
<td><code>get_required_keys_for_tool</code></td>
<td>Check required environment variables for a tool</td>
</tr>
</tbody></table>
<h3 id="progressive-tool-disclosure">Progressive Tool Disclosure</h3>
<pre><code class="language-typescript">// 1. Discover relevant tools
search_tools({ task_description: &quot;webflow site management&quot; })

// 2. Get parameter details
tool_info({ tool_name: &quot;webflow.webflow_sites_list&quot; })

// 3. Execute with TypeScript
call_tool_chain({ code: &quot;await webflow.webflow_sites_list({})&quot; })
</code></pre>
<h3 id="performance">Performance</h3>
<table>
<thead>
<tr>
<th>Metric</th>
<th>Without Code Mode</th>
<th>With Code Mode</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Context tokens</strong></td>
<td>141k (47 tools loaded)</td>
<td>1.6k (on-demand)</td>
</tr>
<tr>
<td><strong>Round trips</strong></td>
<td>15+ for chained ops</td>
<td>1 (TypeScript chain)</td>
</tr>
<tr>
<td><strong>Type safety</strong></td>
<td>None</td>
<td>Full TypeScript support</td>
</tr>
</tbody></table>
<p><strong>Supported Integrations</strong>: GitHub (issues, PRs, commits), Figma (design files, components), Webflow (sites, CMS), ClickUp (tasks, workspaces), Chrome DevTools (browser automation).</p>
<p><strong>Configuration</strong>: <code>.utcp_config.json</code> defines available MCP servers. Tool naming: <code>{manual}.{manual}_{tool}()</code>.</p>
<!-- /ANCHOR:code-mode-mcp -->

<hr>
<h2 id="10--extensibility">10. 🔌 EXTENSIBILITY</h2>
<!-- ANCHOR:extensibility -->

<p>Custom skills, agents, commands and templates.</p>
<p>Every component follows standardized patterns for customization:</p>
<p><strong>Custom Skills</strong>: <code>/create:skill my-skill</code> or <code>init_skill.py</code>. Auto-detected by <code>skill_advisor.py</code>. Structure: SKILL.md + references/ + assets/ + scripts/.</p>
<p><strong>Custom Agents</strong>: <code>/create:agent my-agent</code>. Define constraints, tool access, delegation rules. Integrate with gate system and orchestration.</p>
<p><strong>Custom Commands</strong>: two-layer (.md + .yaml). Optimize to &lt;=600 lines.</p>
<p><strong>Template System</strong>: 81 templates across CORE + ADDENDUM v2.2. Update once, inherit everywhere. 13 validation rules ensure compliance.</p>
<p><strong>Philosophy</strong>: Convention over configuration. Templates provide structure. You own the content. The framework adapts to your project.</p>
<!-- /ANCHOR:extensibility -->

<hr>
<h2 id="11--configuration">11. ⚙️ CONFIGURATION</h2>
<!-- ANCHOR:configuration -->

<h3 id="configuration-file">Configuration File</h3>
<p><strong>Location</strong>: <code>opencode.json</code> (project root)</p>
<p>The configuration file defines 3 MCP servers and their settings:</p>
<pre><code class="language-json">{
  &quot;mcpServers&quot;: {
    &quot;sequential-thinking&quot;: { &quot;...&quot; },
    &quot;spec_kit_memory&quot;: { &quot;...&quot; },
    &quot;code-mode&quot;: { &quot;...&quot; }
  }
}
</code></pre>
<h3 id="embedding-providers">Embedding Providers</h3>
<p>The memory system auto-detects available API keys and selects the best provider. Your code never leaves your machine unless you explicitly choose a cloud provider.</p>
<table>
<thead>
<tr>
<th>Provider</th>
<th>Dimensions</th>
<th>Requirements</th>
<th>Best For</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Voyage AI</strong></td>
<td>1024</td>
<td><code>VOYAGE_API_KEY</code></td>
<td>Recommended: best retrieval quality</td>
</tr>
<tr>
<td><strong>OpenAI</strong></td>
<td>1536/3072</td>
<td><code>OPENAI_API_KEY</code></td>
<td>Cloud-based alternative</td>
</tr>
<tr>
<td><strong>HF Local</strong></td>
<td>768</td>
<td>Node.js only</td>
<td>Privacy, offline, free (default)</td>
</tr>
</tbody></table>
<pre><code class="language-bash"># Voyage provider (recommended)
export VOYAGE_API_KEY=pa-...

# OpenAI provider (alternative)
export OPENAI_API_KEY=sk-proj-...

# Force HF local (even with API keys set)
export EMBEDDINGS_PROVIDER=hf-local
</code></pre>
<p><strong>Privacy note:</strong> HF Local runs embeddings on your machine. No external API calls. Works fully offline. This is the default if no API keys are set.</p>
<h3 id="mcp-servers">MCP Servers</h3>
<table>
<thead>
<tr>
<th>Server</th>
<th>Tools</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Spec Kit Memory</strong></td>
<td>25</td>
<td>Cognitive memory system (the memory engine)</td>
</tr>
<tr>
<td><strong>Code Mode</strong></td>
<td>7</td>
<td>External tool orchestration (Figma, GitHub, ClickUp, Chrome DevTools)</td>
</tr>
<tr>
<td><strong>Sequential Thinking</strong></td>
<td></td>
<td>Structured multi-step reasoning for complex problems</td>
</tr>
</tbody></table>
<p>See individual install guides in <a href=".opencode/install_guides/"><code>.opencode/install_guides/</code></a> for setup details and install scripts.</p>
<!-- /ANCHOR:configuration -->

<hr>
<h2 id="12--usage-examples">12. 💡 USAGE EXAMPLES</h2>
<!-- ANCHOR:usage-examples -->

<p>Real workflows, not toy examples.</p>
<h3 id="common-workflow-patterns">Common Workflow Patterns</h3>
<table>
<thead>
<tr>
<th>Task</th>
<th>Command / Action</th>
<th>What Happens</th>
</tr>
</thead>
<tbody><tr>
<td>Resume previous work</td>
<td><code>/spec_kit:resume</code></td>
<td>Loads memory context, shows where you left off</td>
</tr>
<tr>
<td>Save session context</td>
<td><code>/memory:save</code></td>
<td>Extracts context via <code>generate-context.js</code>, indexes it</td>
</tr>
<tr>
<td>Start a documented feature</td>
<td><code>/spec_kit:complete &quot;add auth&quot;</code></td>
<td>Creates spec folder, templates, implements, verifies</td>
</tr>
<tr>
<td>Search past decisions</td>
<td><code>/memory:context &quot;auth approach&quot;</code></td>
<td>Semantic search across all saved memories</td>
</tr>
<tr>
<td>Debug a stuck issue</td>
<td><code>/spec_kit:debug</code></td>
<td>Spawns fresh-perspective sub-agent with model selection</td>
</tr>
<tr>
<td>Plan without implementing</td>
<td><code>/spec_kit:plan &quot;refactor API&quot;</code></td>
<td>Creates spec + plan, stops before code changes</td>
</tr>
<tr>
<td>Hand off to next session</td>
<td><code>/spec_kit:handover</code></td>
<td>Creates continuation doc (<code>:quick</code> = 15 lines, <code>:full</code> = 150)</td>
</tr>
<tr>
<td>Create a new skill</td>
<td><code>/create:skill my-skill</code></td>
<td>Scaffolds complete skill structure with templates</td>
</tr>
</tbody></table>
<h3 id="end-to-end-example-feature-development">End-to-End Example: Feature Development</h3>
<pre><code class="language-bash"># 1. Start with a plan
/spec_kit:plan &quot;add rate limiting to API&quot;
# -&gt; Creates specs/043-rate-limiting/ with spec.md and plan.md

# 2. Review and approve the plan, then implement
/spec_kit:implement
# -&gt; Follows plan.md, creates code, runs verification

# 3. Save context for future reference
/memory:save
# -&gt; Extracts decisions, blockers, progress into memory/

# 4. Next week, pick up where you left off
/spec_kit:resume
# -&gt; Loads memories, shows checklist status, continues
</code></pre>
<h3 id="end-to-end-example-debugging">End-to-End Example: Debugging</h3>
<pre><code class="language-bash"># After 3+ failed attempts at fixing an issue:
/spec_kit:debug
# -&gt; Prompts: &quot;Select model: Opus / Sonnet / Gemini&quot;
# -&gt; Dispatches @debug agent with 4-phase methodology
# -&gt; Observe -&gt; Analyze -&gt; Hypothesize -&gt; Fix
# -&gt; Fresh perspective, no prior assumptions
</code></pre>
<h3 id="memory-workflow-examples">Memory Workflow Examples</h3>
<p>Practical examples of the MCP memory tools in action.</p>
<p>Context retrieval at the start of a session:</p>
<pre><code>memory_context({ input: &quot;implementing dark mode toggle&quot;, mode: &quot;auto&quot; })
→ Auto-detects intent: &quot;add_feature&quot;
→ Returns: relevant prior work, decisions, patterns
</code></pre>
<p>Semantic search with full content embedding:</p>
<pre><code>memory_search({ query: &quot;authentication flow&quot;, specFolder: &quot;005-auth&quot;, includeContent: true })
→ Returns: ranked results with full content embedded
→ Constitutional memories always appear first
</code></pre>
<p>Bulk indexing with source control:</p>
<pre><code>memory_index_scan({ includeSpecDocs: true })
→ Indexes all 3 sources (memory files, constitutional, spec documents)
→ Skips unchanged files (content hash comparison)
→ Generates embeddings only for new/modified content

memory_index_scan({ specFolder: &quot;043-rate-limiting&quot;, force: true })
→ Re-indexes a single spec folder (force = regenerate all embeddings)

memory_index_scan({ includeSpecDocs: false })
→ Index without spec documents (equivalent to pre-spec-126 behavior)
</code></pre>
<!-- /ANCHOR:usage-examples -->

<hr>
<h2 id="13--troubleshooting">13. 🔧 TROUBLESHOOTING</h2>
<!-- ANCHOR:troubleshooting -->

<p>Something broken? Start here.</p>
<h3 id="common-issues">Common Issues</h3>
<h4 id="memory-mcp-server-wont-start">Memory MCP server won&#39;t start</h4>
<p><strong>Symptom</strong>: OpenCode shows &quot;MCP server failed to connect&quot; for <code>spec_kit_memory</code></p>
<p><strong>Cause</strong>: TypeScript hasn&#39;t been compiled to <code>dist/</code></p>
<p><strong>Solution</strong>:</p>
<pre><code class="language-bash">cd .opencode/skill/system-spec-kit
npm install &amp;&amp; npm run build
</code></pre>
<h4 id="memorysave-fails-with-generate-contextjs-not-found"><code>/memory:save</code> fails with &quot;generate-context.js not found&quot;</h4>
<p><strong>Symptom</strong>: Error when saving context</p>
<p><strong>Cause</strong>: Build step was skipped. <code>scripts/dist/</code> doesn&#39;t exist.</p>
<p><strong>Solution</strong>:</p>
<pre><code class="language-bash">cd .opencode/skill/system-spec-kit &amp;&amp; npm run build
</code></pre>
<h4 id="skills-not-loading-automatically">Skills not loading automatically</h4>
<p><strong>Symptom</strong>: AI doesn&#39;t load relevant skill for your task</p>
<p><strong>Cause</strong>: <code>skill_advisor.py</code> confidence below 0.8, or OpenCode version too old</p>
<p><strong>Solution</strong>:</p>
<pre><code class="language-bash"># Check OpenCode version (need v1.0.190+)
opencode --version

# Manually invoke a skill if needed
# Ask: &quot;Load the sk-git skill&quot;
</code></pre>
<h3 id="quick-fixes">Quick Fixes</h3>
<table>
<thead>
<tr>
<th>Problem</th>
<th>Quick Fix</th>
</tr>
</thead>
<tbody><tr>
<td>MCP server won&#39;t start</td>
<td><code>cd .opencode/skill/system-spec-kit &amp;&amp; npm run build</code></td>
</tr>
<tr>
<td>Context window full</td>
<td><code>/memory:continue</code> for session recovery</td>
</tr>
<tr>
<td>Stale memory results</td>
<td><code>/memory:manage cleanup</code></td>
</tr>
<tr>
<td>Spec folder validation fails</td>
<td>Check exit code: 0=pass, 1=warning, 2=error</td>
</tr>
<tr>
<td>Embedding dimension mismatch</td>
<td>Each provider uses its own SQLite DB. Switch providers safely.</td>
</tr>
</tbody></table>
<h3 id="diagnostic-commands">Diagnostic Commands</h3>
<pre><code class="language-bash"># Check memory system health
/memory:manage health

# View memory statistics
/memory:manage stats

# Verify MCP server is running (inside OpenCode)
# Look for &quot;spec_kit_memory&quot; in the status bar

# Test build
cd .opencode/skill/system-spec-kit &amp;&amp; npm run test:cli
</code></pre>
<!-- /ANCHOR:troubleshooting -->

<hr>
<h2 id="14--faq">14. ❓ FAQ</h2>
<!-- ANCHOR:faq -->

<h3 id="general-questions">General Questions</h3>
<p><strong>Q: Do I need API keys to use the memory system?</strong></p>
<p>A: No. HuggingFace Local runs on your machine with no API keys needed. It&#39;s the default fallback. Voyage AI and OpenAI are optional upgrades for better retrieval quality.</p>
<hr>
<p><strong>Q: Can I use this with my existing project?</strong></p>
<p>A: Yes. Copy <code>.opencode/</code>, <code>opencode.json</code> and <code>AGENTS.md</code> to your project root. The system adapts to your codebase. It doesn&#39;t impose a project structure.</p>
<hr>
<p><strong>Q: How is this different from Cursor&#39;s memory or Copilot&#39;s context?</strong></p>
<p>A: Those are session-scoped. This system persists across sessions, models and even projects. It uses causal graphs to trace decision lineage and cognitive tiers to prioritize relevance. It uses ANCHOR format for 93% token savings. It&#39;s also local-first. Your code stays on your machine.</p>
<hr>
<p><strong>Q: Is this overkill for solo developers?</strong></p>
<p>A: You might think so, until you lose 3 hours re-debugging an issue you already solved last month. Solo developers benefit <em>more</em> because there&#39;s no team to ask &quot;hey, why did we do it this way?&quot; The memory system is your institutional knowledge.</p>
<hr>
<p><strong>Q: What happens if my session crashes mid-work?</strong></p>
<p>A: Run <code>/memory:continue</code>. The system auto-recovers from compaction events, timeouts and crashes by loading the most recent memory context. Your work is saved in the spec folder and memory system.</p>
<hr>
<h3 id="technical-questions">Technical Questions</h3>
<p><strong>Q: What database does the memory system use?</strong></p>
<p>A: SQLite with the <code>sqlite-vec</code> extension for vector operations. Each embedding provider+model+dimension combination gets its own database file to prevent dimension mismatches.</p>
<hr>
<p><strong>Q: Can I switch embedding providers without losing data?</strong></p>
<p>A: Each provider uses a separate database, so switching is safe. Your old embeddings remain intact. Re-index with <code>memory_index_scan</code> if you want to regenerate embeddings with a new provider.</p>
<hr>
<p><strong>Q: How do I create a custom skill?</strong></p>
<p>A: Run <code>/create:skill my-skill-name</code> or use the init script:</p>
<pre><code class="language-bash">python3 .opencode/skill/sk-documentation/scripts/init_skill.py my-skill
</code></pre>
<p>Skills are auto-discovered from <code>.opencode/skill/*/SKILL.md</code>. No plugin registration needed.</p>
<hr>
<p><strong>Q: How much disk space does the memory system use?</strong></p>
<p>A: Minimal. SQLite databases are compact. A project with 100+ memories typically uses under 50MB including embeddings. The HF Local model downloads on first use (~130MB) and is cached for subsequent runs.</p>
<!-- /ANCHOR:faq -->

<hr>
<h2 id="15--related-documents">15. 📚 RELATED DOCUMENTS</h2>
<!-- ANCHOR:related-documents -->

<h3 id="internal-documentation">Internal Documentation</h3>
<table>
<thead>
<tr>
<th>Document</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><a href=".opencode/skill/system-spec-kit/README.md">Spec Kit README</a></td>
<td>Full memory system and documentation framework reference</td>
</tr>
<tr>
<td><a href="AGENTS.md">AGENTS.md</a></td>
<td>Complete gate system, confidence framework, operational protocols</td>
</tr>
<tr>
<td><a href=".opencode/install_guides/README.md">Install Guides</a></td>
<td>MCP servers, skill creation, agent configuration</td>
</tr>
<tr>
<td><a href=".opencode/install_guides/SET-UP%20-%20AGENTS.md">SET-UP - AGENTS.md</a></td>
<td>Detailed AGENTS.md configuration guide</td>
</tr>
<tr>
<td><a href=".opencode/install_guides/SET-UP%20-%20Skill%20Creation.md">SET-UP - Skill Creation</a></td>
<td>Custom skill creation walkthrough</td>
</tr>
</tbody></table>
<h3 id="changelogs">Changelogs</h3>
<table>
<thead>
<tr>
<th>Component</th>
<th>Versions</th>
</tr>
</thead>
<tbody><tr>
<td><a href=".opencode/changelog/00--opencode-environment/">OpenCode Environment</a></td>
<td>90 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/01--system-spec-kit/">System Spec Kit</a></td>
<td>45 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/02--agents-md/">AGENTS.md</a></td>
<td>27 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/03--agent-orchestration/">Agent Orchestration</a></td>
<td>26 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/04--commands/">Commands</a></td>
<td>29 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/05--skill-advisor/">Skill Advisor</a></td>
<td>4 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/06--sk-documentation/">Workflows: Documentation</a></td>
<td>9 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/07--sk-code--opencode/">Workflows: Code (OpenCode)</a></td>
<td>9 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/08--sk-code--web/">Workflows: Code (Web Dev)</a></td>
<td>10 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/09--sk-code--full-stack/">Workflows: Code (Full Stack)</a></td>
<td>4 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/10--sk-git/">Workflows: Git</a></td>
<td>7 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/11--mcp-chrome-devtools/">Workflows: Chrome DevTools</a></td>
<td>4 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/12--mcp-code-mode/">MCP: Code Mode</a></td>
<td>7 files</td>
</tr>
<tr>
<td><a href=".opencode/changelog/13--mcp-figma/">MCP: Figma</a></td>
<td>5 files</td>
</tr>
</tbody></table>
<h3 id="external-resources">External Resources</h3>
<table>
<thead>
<tr>
<th>Resource</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr>
<td><a href="https://github.com/sst/opencode">OpenCode</a></td>
<td>The AI coding assistant that powers this environment</td>
</tr>
<tr>
<td><a href="https://github.com/MichelKerkmeester/opencode-spec-kit-framework/issues">GitHub Issues</a></td>
<td>Report bugs and request features</td>
</tr>
</tbody></table>
<!-- /ANCHOR:related-documents -->

<hr>
<p><strong>License:</strong> See <a href="LICENSE">LICENSE</a> for details.</p>

        </article>
      </main>
    </div>
  </div>

  <script>
    (() => {
      const doc = document.getElementById('doc');
      const toc = document.getElementById('auto-toc');

      const slugCounts = new Map();
      const slugify = (text) => {
        const base = text
          .toLowerCase()
          .trim()
          .normalize('NFKD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s/g, '-')
          .replace(/-+$/g, '')
          .replace(/^-+/g, '') || 'section';

        const count = slugCounts.get(base) || 0;
        slugCounts.set(base, count + 1);
        return count === 0 ? base : `${base}-${count}`;
      };

      const headings = Array.from(doc.querySelectorAll('h1, h2, h3'));
      headings.forEach((heading) => {
        if (!heading.id) {
          heading.id = slugify(heading.textContent || 'section');
        }
      });

      const tocHeadings = headings.filter((heading) => heading.tagName !== 'H1');
      tocHeadings.forEach((heading) => {
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent || heading.id;
        a.className = heading.tagName === 'H3' ? 'depth-h3' : 'depth-h2';
        toc.appendChild(a);
      });

      const setStat = (id, value) => {
        const node = document.getElementById(id);
        if (node) {
          node.textContent = String(value);
        }
      };

      setStat('stat-sections', doc.querySelectorAll('h2').length);
      setStat('stat-tables', doc.querySelectorAll('table').length);
      setStat('stat-code', doc.querySelectorAll('pre').length);
      setStat('stat-links', doc.querySelectorAll('a').length);

      Array.from(doc.querySelectorAll('a[href^="http"]')).forEach((link) => {
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            const tocLink = toc.querySelector(`a[href="#${id}"]`);
            if (!tocLink) return;
            if (entry.isIntersecting) {
              toc.querySelectorAll('a').forEach((link) => {
                link.style.background = 'transparent';
                link.style.borderColor = 'transparent';
                link.style.color = '';
              });
              tocLink.style.background = 'var(--ve-accent-dim)';
              tocLink.style.borderColor = 'var(--ve-border-bright)';
              tocLink.style.color = 'var(--ve-text)';
            }
          });
        },
        {
          rootMargin: '-12% 0px -70% 0px',
          threshold: [0.1, 0.4, 1.0]
        }
      );

      tocHeadings.forEach((heading) => observer.observe(heading));
    })();
  </script>
</body>
</html>
