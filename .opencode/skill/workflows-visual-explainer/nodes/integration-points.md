---
description: "CDN libraries, cross-skill integration, output conventions, and Google Fonts pairings for visual-explainer"
---
# Integration Points

This node covers every external dependency and cross-skill integration the skill relies on. Use it as a reference when configuring library code in Phase 2/3.

---

## CDN Libraries

### Mermaid.js v11

**CDN URL (ESM):**
```html
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
</script>
```

**Non-ESM fallback (for broader browser compatibility):**
```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
```

**Initialization pattern:**
```javascript
mermaid.initialize({
  startOnLoad: false,          // Always false — render manually after DOM ready
  theme: 'base',               // Always 'base' — never 'default', 'dark', 'forest', 'neutral'
  themeVariables: {
    primaryColor: '#58a6ff33', // 8-digit hex with alpha for fills
    primaryBorderColor: '#58a6ff',
    primaryTextColor: '#e6edf3',
    lineColor: '#8b949e',
    background: '#0d1117',
    mainBkg: '#161b22',
    nodeBorder: '#30363d',
    clusterBkg: '#21262d',
    titleColor: '#e6edf3',
    edgeLabelBackground: '#161b22',
    fontFamily: 'JetBrains Mono, monospace',
  },
  flowchart: { useMaxWidth: true, htmlLabels: true },
  sequence: { useMaxWidth: true },
});
```

**Manual rendering (required — `startOnLoad: false`):**
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  const elements = document.querySelectorAll('.mermaid');
  for (const el of elements) {
    const { svg } = await mermaid.render(`diagram-${Math.random().toString(36).slice(2)}`, el.textContent);
    el.innerHTML = svg;
  }
});
```

**ELK layout engine (for complex graphs):**
```javascript
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  layout: 'elk',
  elk: { mergeEdges: true, nodePlacementStrategy: 'BRANDES_KOEPF' }
});
```

ELK is bundled with Mermaid v11 — no separate CDN needed.

**handDrawn mode:**
```javascript
mermaid.initialize({ startOnLoad: false, look: 'handDrawn', theme: 'base' });
```

**classDef rules (critical constraints):**
```
%% ALWAYS: 8-digit hex with alpha for fill (never opaque)
classDef myNode fill:#58a6ff33,stroke:#58a6ff,stroke-width:1.5px

%% NEVER: color: property (causes parser error)
%% NEVER: fill:#58a6ff (opaque — text becomes invisible)
%% NEVER: fill:transparent (renders incorrectly in some browsers)
```

**Maximum nodes per diagram:** 15–20 nodes. Beyond this, Mermaid's auto-layout produces crossed edges and overlapping labels. Use CSS Grid cards (Type 1) or split into sub-diagrams for larger graphs.

---

### Chart.js v4

**CDN URL:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
```

**Responsive initialization:**
```javascript
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',  // bar, line, pie, doughnut, radar, polarArea, bubble, scatter
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Dataset 1',
      data: [12, 19, 8],
      backgroundColor: [
        'rgba(88, 166, 255, 0.6)',
        'rgba(86, 212, 144, 0.6)',
        'rgba(255, 123, 114, 0.6)',
      ],
      borderColor: [
        '#58a6ff',
        '#56d490',
        '#ff7b72',
      ],
      borderWidth: 1,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(48, 54, 61, 0.8)' },
        ticks: { color: '#8b949e' },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(48, 54, 61, 0.8)' },
        ticks: { color: '#8b949e' },
      },
    },
  },
});
```

**Light/dark mode switching for Chart.js:**
```javascript
function updateChartColors(chart, isDark) {
  const gridColor = isDark ? 'rgba(48,54,61,0.8)' : 'rgba(200,192,184,0.8)';
  const tickColor = isDark ? '#8b949e' : '#6b5f52';
  chart.options.scales.x.grid.color = gridColor;
  chart.options.scales.x.ticks.color = tickColor;
  chart.options.scales.y.grid.color = gridColor;
  chart.options.scales.y.ticks.color = tickColor;
  chart.update();
}

const mq = window.matchMedia('(prefers-color-scheme: light)');
mq.addEventListener('change', (e) => updateChartColors(chart, !e.matches));
updateChartColors(chart, !mq.matches); // initial state
```

---

### anime.js v3.2.2

**CDN URL:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js"></script>
```

**Staggered card reveal:**
```javascript
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  if (!reducedMotion) {
    anime({
      targets: '.card, .section-item',
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 400,
      delay: anime.stagger(80, { start: 100 }),
      easing: 'easeOutCubic',
    });
  } else {
    // Instant reveal for reduced-motion users
    document.querySelectorAll('.card, .section-item').forEach(el => {
      el.style.opacity = 1;
    });
  }
});
```

**SVG path drawing animation:**
```javascript
if (!reducedMotion) {
  anime({
    targets: '.diagram-path',
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 1200,
    delay: anime.stagger(200),
    easing: 'easeInOutSine',
  });
}
```

**Hover glow (Neon Dashboard aesthetic):**
```javascript
document.querySelectorAll('.metric-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (reducedMotion) return;
    anime({ targets: card, boxShadow: ['0 0 0px transparent', '0 0 20px var(--ve-accent)'], duration: 200 });
  });
  card.addEventListener('mouseleave', () => {
    if (reducedMotion) return;
    anime({ targets: card, boxShadow: ['0 0 20px var(--ve-accent)', '0 0 0px transparent'], duration: 400 });
  });
});
```

---

## Google Fonts — 13 Curated Pairings

Never use Inter, Roboto, or Arial as the primary display font. These 13 pairings are the approved set. Each includes display + body fonts.

| # | Display | Body | Character | Best for |
|---|---------|------|-----------|----------|
| 1 | Playfair Display | DM Sans | Classic editorial | Plan reviews, docs |
| 2 | DM Serif Display | DM Sans | Modern editorial | Reports, summaries |
| 3 | Space Grotesk | IBM Plex Sans | Technical grotesque | Blueprint, architecture |
| 4 | Clash Display | Plus Jakarta Sans | Premium modern | Gradient mesh, executive |
| 5 | Fraunces | Source Serif 4 | Literary warmth | Paper/ink, editorial |
| 6 | Lora | Lora | Cohesive serif | Documentation, readable |
| 7 | JetBrains Mono | JetBrains Mono | Developer monospace | Terminal, IDE |
| 8 | Fira Code | Fira Code | Developer monospace | Code-heavy, IDE |
| 9 | Rajdhani | Barlow | Futuristic sans | Neon dashboard |
| 10 | Orbitron | Exo 2 | Sci-fi tech | Neon dashboard (heavy) |
| 11 | Caveat | Caveat | Handwritten | Hand-drawn aesthetic |
| 12 | IBM Plex Mono | IBM Plex Sans | IBM design system | Data-dense, technical |
| 13 | Plus Jakarta Sans | Plus Jakarta Sans | Clean geometric | General purpose, neutral |

**Google Fonts URL template (always include `display=swap`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## Image Generation

### Original Approach: surf-cli (External Dependency)

The upstream `visual-explainer` skill supported optional AI image generation via `surf-cli`:

```bash
# Check availability
which surf

# Generate to temp file
surf gemini "descriptive prompt" --generate-image /tmp/ve-img.png --aspect-ratio 16:9

# Base64 encode for self-containment (macOS)
IMG=$(base64 -i /tmp/ve-img.png)
# Linux: IMG=$(base64 -w 0 /tmp/ve-img.png)

# Embed in HTML (clean up temp file after)
# <img src="data:image/png;base64,${IMG}" alt="descriptive alt text">
rm /tmp/ve-img.png
```

**When the original used it:** Hero banners that establish visual tone. Conceptual illustrations for abstract systems Mermaid can't express. Educational diagrams that benefit from photorealistic rendering.

**When the original skipped it:** Any topic Mermaid or CSS handles well. Generic decoration without meaning. Data-heavy pages where images would distract. Pages where surf is unavailable (always degrade gracefully).

### Our Approach: CSS-First Image Alternatives

**Design decision:** This skill's implementation replaces the `surf-cli` external dependency with CSS-first patterns. This ensures:
- No external tool dependencies beyond CDN libraries
- Fully reproducible outputs across any environment
- No API cost or rate limiting
- Self-contained files that work without internet (except CDN fonts/libraries)

**CSS placeholder patterns (use in place of generated images):**

```css
/* Hero banner — gradient mesh */
.hero-banner {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg,
    var(--ve-accent) 0%,
    color-mix(in srgb, var(--ve-accent) 40%, var(--ve-bg)) 50%,
    var(--ve-bg) 100%
  );
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

/* Geometric accent shape */
.hero-banner::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  top: -100px;
  right: -100px;
}

/* Inline illustration frame — placeholder for conceptual art */
.illustration-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  background:
    radial-gradient(circle at 30% 40%, color-mix(in srgb, var(--ve-accent) 20%, transparent) 0%, transparent 60%),
    radial-gradient(circle at 70% 60%, color-mix(in srgb, var(--ve-accent) 10%, transparent) 0%, transparent 50%),
    var(--ve-surface);
  border: 1px solid var(--ve-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Caption below illustration frame */
.illustration-caption {
  font-size: 12px;
  color: var(--ve-text-dim);
  text-align: center;
  margin-top: 8px;
  font-style: italic;
}

/* Decorative grid pattern (blueprint aesthetic) */
.blueprint-bg {
  background-image:
    linear-gradient(var(--ve-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--ve-border) 1px, transparent 1px);
  background-size: 24px 24px;
  background-color: var(--ve-surface);
}
```

---

## Cross-Skill Integration

### system-spec-kit Memory

**When called:** `/visual-explainer:recap` and `/visual-explainer:plan-review` commands.

**Purpose:** Load prior session context — decisions made, blockers encountered, next steps — from the spec folder's memory files.

**Integration pattern:**
```
// In recap: load all memory entries from the time window
// In plan-review: load most recent memory entry for the spec folder
// Memory files live at: .opencode/specs/{folder}/memory/*.md
// Do not write to memory — visual-explainer is read-only for spec-kit memory
```

**NEVER:** Write to or modify `system-spec-kit` memory files. Read only.

### workflows-git

**When called:** `/visual-explainer:diff-review` and `/visual-explainer:recap --include-git`.

**Purpose:** Gather git diff data, commit history, changed file lists, PR metadata.

**Data collected:**
```bash
# Changed files with line counts
git diff --stat {target}

# Full diff
git diff {target}

# Commit messages in range
git log --oneline {range}

# PR metadata (if using gh CLI)
gh pr view {number} --json title,body,author,baseRefName,headRefName,files
```

**NEVER:** Push, commit, or modify the git repository. Read only.

### workflows-chrome-devtools

**When called:** After delivery, for post-delivery validation.

**Purpose:** Validate the output HTML file, check for console errors, verify accessibility and rendering.

**Usage:** Optional — called only when the user requests validation or when quality check 7 (File Opens Cleanly) needs debugging.

---

## Output Convention

All files saved to: `.opencode/output/visual/`

Directory creation (if it doesn't exist):
```bash
mkdir -p .opencode/output/visual
```

Filename pattern:
```
{command}-{description}-{YYYYMMDD}-{HHMMSS}.html
```

| Command | Example filename |
|---------|----------------|
| generate | `generate-auth-architecture-20260220-143022.html` |
| diff-review | `diff-review-pr-47-20260220-143022.html` |
| plan-review | `plan-review-138-skill-graph-20260220-143022.html` |
| recap | `recap-2w-progress-20260220-143022.html` |
| fact-check | `fact-check-corrected-generate-auth-20260220-143022.html` |

Open immediately after saving:
```bash
# macOS
open .opencode/output/visual/{filename}.html

# Linux
xdg-open .opencode/output/visual/{filename}.html

# Windows
start .opencode/output/visual/{filename}.html
```

---

## Cross References
- [[rules]] — NEVER rules for CDN and external dependencies
- [[diagram-types]] — Which types use Mermaid vs Chart.js vs CSS
- [[aesthetics]] — Font pairings reference this node's 13-pairing table
- [[success-criteria]] — Check 7 (File Opens Cleanly) depends on correct CDN URLs here
