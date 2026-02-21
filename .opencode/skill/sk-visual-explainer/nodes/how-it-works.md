---
description: "4-phase Think > Structure > Style > Deliver workflow with sub-steps and decision points"
---
# How It Works

The skill executes a strict 4-phase workflow. Each phase has a defined input, process, and output. Do not compress phases or skip steps — the quality checks in Phase 4 catch errors introduced by cutting corners in earlier phases.

---

## Phase 1 — Think

**Input:** User request + source material (topic, file, diff, or time window)
**Output:** Confirmed diagram type, confirmed aesthetic, confirmed section outline

### 1a. Audience Analysis

Ask: who reads this output?

| Audience | Implications |
|----------|-------------|
| Developer / technical reviewer | Dense information, code-adjacent aesthetics (Blueprint, IDE-inspired, Monochrome terminal), technical terminology preserved |
| Engineering manager / team lead | Summary-first, visual hierarchy strong, progress signals prominent (Data-dense, Editorial) |
| External stakeholder / client | Clean, polished, minimal jargon (Editorial, Gradient mesh) |
| Self (personal reference) | Any style, optimize for information retrieval speed |

If audience is ambiguous, ask before proceeding.

### 1b. Diagram Type Selection

Use the decision tree in [[diagram-types]] to select the primary rendering approach. Key questions:

1. What is the primary relationship between elements?
2. Is time or sequence the dominant axis?
3. Is data tabular (discrete rows and columns) or continuous?
4. Are there 15+ entities? (If yes, consider splitting or using architecture cards instead of a single Mermaid diagram)

If the correct type is unclear, present 2–3 options with brief rationale and ask the user. Do not guess.

### 1c. Aesthetic Selection

Use the compatibility matrix in [[aesthetics]] to select a profile that fits both the content type and diagram type. Key signals:

- **Technical content + developer audience** → Blueprint, IDE-inspired, or Monochrome terminal
- **Plan/review content** → Editorial
- **Progress/metrics** → Data-dense or Neon dashboard
- **Creative/exploratory** → Gradient mesh, Paper/ink
- **Quick exploration** → Hand-drawn

If user specified an aesthetic (e.g., "make it look like a blueprint"), use that.

### 1d. Confirm Section Outline

Before writing HTML, mentally map the sections:
- What is the page title?
- What are the H2 section headings?
- Is navigation needed? (Yes if 4+ sections)
- What is the primary diagram? What are supporting elements (tables, callouts, metrics)?

If the source material has a clear structure (plan.md headings, diff sections, git log format), mirror that structure in the HTML.

---

## Phase 2 — Structure

**Input:** Confirmed diagram type + aesthetic + section outline
**Output:** Semantic HTML skeleton with correct rendering approach

### 2a. Read Templates Fresh

Always read from `assets/templates/` using the Read tool. Never reconstruct templates from memory — template code drifts and introduces bugs. Load the relevant template:

| Diagram type | Template |
|-------------|---------|
| Architecture (cards) | `assets/templates/architecture.html` |
| Flowchart / Mermaid | `assets/templates/mermaid-flowchart.html` |
| Data table | `assets/templates/data-table.html` |

If no template matches exactly, use the closest one as a structural reference and adapt.

### 2b. Rendering Approach Decision

Select the right rendering technology per diagram type:

| Content Type | Rendering Approach | When to Use |
|-------------|-------------------|------------|
| Flowcharts, pipelines | Mermaid `flowchart` | Sequential steps with branches |
| Sequence diagrams | Mermaid `sequenceDiagram` | Actor-to-actor message flows |
| ER / schema | Mermaid `erDiagram` | Database tables and relationships |
| State machines | Mermaid `stateDiagram-v2` | States and transitions |
| Mind maps | Mermaid `mindmap` | Hierarchical topic trees |
| Architecture (topology) | Mermaid `graph` | System component relationships |
| Dashboards, metrics | Chart.js | Bar, line, pie, doughnut charts |
| Architecture (text-heavy) | CSS Grid cards | Many components with descriptions |
| Tabular data | Semantic HTML `<table>` | Rows and columns with clear headers |
| Timelines / roadmaps | CSS central line + cards | Temporal data with dates |

**Rule:** Prefer simpler rendering when both options are valid. A CSS table beats a Mermaid pie chart for tabular data. An HTML list beats a Mermaid mindmap for 3-item hierarchies.

### 2c. Build Semantic HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title]</title>
  <!-- Google Fonts with display=swap -->
  <!-- Mermaid/Chart.js/anime.js CDN (only what's needed) -->
  <style>/* All CSS here */</style>
</head>
<body>
  <header><!-- Title, subtitle, metadata --></header>
  <nav><!-- Sticky navigation if 4+ sections --></nav>
  <main>
    <section id="section-1"><!-- H2 heading + content --></section>
    <section id="section-2"><!-- ... --></section>
  </main>
  <script>/* All JS here */</script>
</body>
</html>
```

Navigation rule: include sticky TOC when there are 4 or more `<section>` elements. Use scroll-spy to highlight the active section. Reference `references/navigation_patterns.md` for implementation.

---

## Phase 3 — Style

**Input:** Semantic HTML skeleton + selected aesthetic profile
**Output:** Fully styled HTML with complete CSS system

### 3a. Typography as Visual Identity

Font choice IS the first aesthetic decision. Select from the 13 curated pairings in `references/quick_reference.md`. The primary display font defines the page's character — it must not be Inter, Roboto, or Arial.

Apply fonts to the semantic hierarchy:
- `h1`, `h2` — display/serif font, large size, tight tracking
- `h3`, `h4` — same family, reduced weight, normal tracking
- `body`, `p`, `td` — companion sans-serif or monospace
- `code`, `pre` — monospace

### 3b. CSS Custom Properties System

Define all visual tokens as `--ve-*` properties. Declare twice: once in `:root` (dark mode default), once in `@media (prefers-color-scheme: light)`.

```css
:root {
  /* Color */
  --ve-bg: #0d1117;
  --ve-surface: #161b22;
  --ve-surface-elevated: #21262d;
  --ve-border: #30363d;
  --ve-text: #e6edf3;
  --ve-text-dim: #8b949e;
  --ve-accent: #58a6ff;
  --ve-accent-muted: #1f3a5f;

  /* Typography */
  --ve-font-display: 'DM Serif Display', Georgia, serif;
  --ve-font-body: 'DM Sans', system-ui, sans-serif;
  --ve-font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --ve-space-xs: 0.25rem;
  --ve-space-sm: 0.5rem;
  --ve-space-md: 1rem;
  --ve-space-lg: 2rem;
  --ve-space-xl: 4rem;
}

@media (prefers-color-scheme: light) {
  :root {
    --ve-bg: #f8f6f1;
    --ve-surface: #ffffff;
    --ve-surface-elevated: #f0ece4;
    --ve-border: #d0c8b8;
    --ve-text: #1a1a2e;
    --ve-text-dim: #5a5a7a;
    --ve-accent: #2563eb;
    --ve-accent-muted: #dbeafe;
  }
}
```

### 3c. Depth Tiers

Use 3 elevation levels to create visual hierarchy without heavy shadows:

```css
/* Recessed — inset, lower than background */
.recessed {
  background: color-mix(in srgb, var(--ve-bg) 95%, black);
  border: 1px solid var(--ve-border);
}

/* Default — at surface level */
.surface {
  background: var(--ve-surface);
  border: 1px solid var(--ve-border);
}

/* Elevated — raised above surface */
.elevated {
  background: var(--ve-surface-elevated);
  border: 1px solid var(--ve-border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
```

Limit to 2–4% lightness shifts between tiers. Heavy contrast between tiers creates visual noise.

### 3d. Background Atmosphere

Add background texture to the `body` or `main` to give the page depth. Match to aesthetic:

| Aesthetic | Atmosphere |
|-----------|-----------|
| Blueprint | Grid lines: `repeating-linear-gradient(...)` |
| Monochrome terminal | Scanline effect: subtle horizontal stripe repeat |
| Editorial | Warm radial gradient: cream center fading to parchment |
| Neon dashboard | Subtle radial glow from accent color at top |
| Paper/ink | Noise texture via CSS `filter: url(#noise)` or light gradient |
| Data-dense | None — maximize information density |
| Gradient mesh | Multi-point gradient mesh via multiple radial gradients |

### 3e. Animation System

Use staggered `fadeUp` entrance animations for card and list elements. Control stagger delay via the `--i` CSS custom property set inline on each element.

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeUp 0.4s ease both;
  animation-delay: calc(var(--i, 0) * 80ms);
}
```

```html
<div class="card" style="--i:0">First card</div>
<div class="card" style="--i:1">Second card</div>
<div class="card" style="--i:2">Third card</div>
```

Always include `prefers-reduced-motion` override (see [[rules]], ALWAYS rule 3).

---

## Phase 4 — Deliver

**Input:** Fully styled HTML file
**Output:** Saved file, opened in browser, quality report

### 4a. Run All 9 Quality Checks

Execute every check from [[success-criteria]] in order. If any check fails, return to the relevant phase to fix before proceeding.

### 4b. Save the File

```bash
mkdir -p .opencode/output/visual
# filename pattern:
# {command}-{description}-{timestamp}.html
# examples:
# generate-auth-architecture-20260220-143022.html
# diff-review-pr-47-20260220-143022.html
```

### 4c. Open in Browser

```bash
open .opencode/output/visual/{filename}.html
# or on Linux:
xdg-open .opencode/output/visual/{filename}.html
```

### 4d. Report

Provide the user with:
1. File path (absolute)
2. File size in KB
3. Quality check results (all 9 passed, or list failures)
4. Any content that was intentionally truncated or summarized

---

## Cross References
- [[diagram-types]] — Phase 1 diagram type decision tree
- [[aesthetics]] — Phase 1 aesthetic selection and compatibility matrix
- [[rules]] — Constraints applied throughout all phases
- [[success-criteria]] — Phase 4 quality checks, all 9 detailed
- [[integration-points]] — Phase 2/3 CDN library usage
