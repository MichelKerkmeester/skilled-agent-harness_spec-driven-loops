---
name: sk-visual-explainer
description: "Converts complex terminal output and technical concepts into styled, self-contained HTML pages with diagrams, tables, and visualizations through a 4-phase Think-Structure-Style-Deliver workflow."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.1.0
---

<!-- Keywords: visual, diagram, HTML, generate, architecture, flowchart, sequence, chart, mermaid, review, diff, plan, recap, fact-check, table, render, visualization, timeline, dashboard, metrics, data-table, aesthetic, css, typography -->

# sk-visual-explainer — Styled HTML Diagram Generator

Converts complex terminal output and technical concepts into styled, self-contained HTML pages with diagrams, tables, and visualizations. Uses a 4-phase **Think > Structure > Style > Deliver** workflow. Supports 11 diagram types, 9 aesthetic directions, and 5 slash commands.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Commands

| Command | Purpose | Example Trigger |
|---------|---------|----------------|
| `/visual-explainer:generate` | Generate a visual diagram or styled page from any topic | "generate an architecture diagram for this service" |
| `/visual-explainer:diff-review` | Visual review of git diffs, PRs, or commit ranges | "visual diff review of this PR" |
| `/visual-explainer:plan-review` | Visual analysis of a plan document | "visually review specs/007-auth/plan.md" |
| `/visual-explainer:recap` | Visual recap of recent work or progress | "generate a visual recap of the last 2 weeks" |
| `/visual-explainer:fact-check` | Verify accuracy of an existing HTML output | "fact-check this visual output against the spec" |

### Keyword Triggers (Auto-Activate)

Activate this skill when the user's message contains: `visual`, `diagram`, `HTML page`, `generate HTML`, `flowchart`, `architecture diagram`, `mermaid`, `chart`, `sequence diagram`, `timeline`, `dashboard`, `render`, `visualization`, `styled page`, `table render`, `data table`.

### Proactive Trigger

Auto-render a styled HTML table **without being asked** when responding with data that has:
- 4 or more rows, OR
- 3 or more columns

Announce: "I'm rendering this as a styled HTML page for readability."

### When NOT to Use

- Plain text is sufficient (< 4-row tables, simple lists, short explanations)
- Output must be a React, Vue, or Svelte component — outside skill scope
- Server-side rendering required (live data, authentication, database queries)
- User explicitly requests plain Markdown output

<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Primary Detection Signal

Activate on **any** of these triggers:
- **Slash commands:** `/visual-explainer:generate`, `/visual-explainer:diff-review`, `/visual-explainer:plan-review`, `/visual-explainer:recap`, `/visual-explainer:fact-check`
- **Keywords:** `visual`, `diagram`, `HTML page`, `generate HTML`, `flowchart`, `architecture diagram`, `mermaid`, `chart`, `sequence diagram`, `timeline`, `dashboard`, `render`, `visualization`, `styled page`, `table render`, `data table`
- **Proactive:** Data response with 4+ rows OR 3+ columns triggers auto-render

### Phase Detection

```text
┌──────────┐    ┌───────────┐    ┌─────────┐    ┌──────────┐
│ 1. THINK │───▶│2. STRUCTURE│───▶│ 3. STYLE │───▶│4. DELIVER │
│ Audience  │    │ Template   │    │ Typography│    │ Quality   │
│ Type      │    │ HTML build │    │ CSS vars  │    │ 9 checks  │
│ Aesthetic │    │ Rendering  │    │ Depth/BG  │    │ Save/open │
└──────────┘    └───────────┘    └─────────┘    └──────────┘
```


### Resource Domains

| Folder | Contents | Count |
|--------|----------|-------|
| `references/` | Quick ref, CSS patterns, library guide, nav patterns, quality checklist | 5 files |
| `assets/templates/` | Architecture, Mermaid flowchart, data table HTML templates | 3 files |
| `scripts/` | `validate-html-output.sh`, `cleanup-output.sh` | 2 files |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_MODEL = {
    "GENERATE": {
        "keywords": [
            ("generate", 4), ("diagram", 3), ("visual", 3),
            ("architecture", 3), ("flowchart", 3), ("mermaid", 3),
            ("chart", 3), ("table", 2), ("timeline", 2), ("dashboard", 2),
        ]
    },
    "DIFF_REVIEW": {
        "keywords": [
            ("diff", 4), ("review diff", 5), ("pr review", 4),
            ("changes", 2), ("commit", 2),
        ]
    },
    "PLAN_REVIEW": {
        "keywords": [
            ("plan review", 5), ("plan analysis", 4), ("analyze plan", 4),
        ]
    },
    "RECAP": {
        "keywords": [
            ("recap", 5), ("summary", 3), ("progress", 3), ("what happened", 3),
        ]
    },
    "FACT_CHECK": {
        "keywords": [
            ("fact check", 5), ("verify", 3), ("accuracy", 3), ("correct", 2),
        ]
    },
    "AESTHETIC": {
        "keywords": [
            ("style", 3), ("aesthetic", 4), ("theme", 3), ("design", 2),
        ]
    },
    "DIAGRAM_TYPE": {
        "keywords": [
            ("type", 2), ("which diagram", 4), ("er diagram", 4),
            ("state machine", 4), ("mind map", 4),
        ]
    },
}

RESOURCE_MAP = {
    "GENERATE":     ["references/css_patterns.md", "references/library_guide.md"],
    "DIFF_REVIEW":  ["references/css_patterns.md", "references/library_guide.md"],
    "PLAN_REVIEW":  ["references/css_patterns.md"],
    "RECAP":        ["references/css_patterns.md"],
    "FACT_CHECK":   ["references/quality_checklist.md"],
    "AESTHETIC":    ["references/css_patterns.md"],
    "DIAGRAM_TYPE": ["references/library_guide.md"],
}

def classify_intent(prompt: str) -> tuple[str, list[str]]:
    prompt_lower = prompt.lower()
    scores = {}
    for intent, config in INTENT_MODEL.items():
        score = sum(
            weight for kw, weight in config["keywords"]
            if kw in prompt_lower
        )
        if score > 0:
            scores[intent] = score
    if not scores:
        return "GENERATE", [DEFAULT_RESOURCE]
    top_intent = max(scores, key=scores.get)
    resources = [DEFAULT_RESOURCE] + RESOURCE_MAP.get(top_intent, [])
    return top_intent, resources
```

### Resource Loading Levels

| Level | When | Resources |
|-------|------|-----------|
| **ALWAYS** | Every activation | `references/quick_reference.md` |
| **CONDITIONAL** | GENERATE, DIFF_REVIEW, PLAN_REVIEW, RECAP | `references/css_patterns.md`, `references/library_guide.md` |
| **CONDITIONAL** | FACT_CHECK | `references/quality_checklist.md` |
| **ON_DEMAND** | Explicit navigation or multi-section pages | `references/navigation_patterns.md` |
| **ON_DEMAND** | Reference implementation needed | `assets/templates/*` |

<!-- /ANCHOR:smart-routing -->

---

<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

The skill executes a strict 4-phase workflow. Do not skip phases.

### Phase 1 — Think
- **Audience analysis:** Who reads this? Developer, stakeholder, or technical reviewer?
- If unsure of diagram type, present 2–3 options and ask the user to confirm.

### Phase 2 — Structure
- Read templates FRESH from `assets/templates/` — never rely on memory for template structure.
- Start from the closest template skeleton and adapt it. Do not start from blank HTML unless no template applies.
- Select rendering approach: Mermaid (flowcharts, sequences, ER, state, mindmap) | Chart.js (dashboards, metrics) | CSS Grid (architecture cards) | HTML `<table>` (tabular data) | CSS timeline (temporal).
- Build semantic HTML: `<header>`, `<main>`, `<section>` blocks, sticky nav if 4+ sections.

### Phase 3 — Style
- **Typography is the diagram** — font pairing IS the visual identity. Never use Inter, Roboto, or Arial as the primary display font.
- **CSS custom properties:** Use `--ve-*` namespace for all theme values (`--ve-bg`, `--ve-surface`, `--ve-border`, `--ve-text`, `--ve-text-dim`, `--ve-accent`).
- **Depth tiers:** Elevated (shadow + border) | Default (border only) | Recessed (inset bg). Use 2–4% lightness shifts between tiers.
- **Background atmosphere:** Radial gradients, dot grids, diagonal lines, or gradient mesh — match to aesthetic profile.
- **Animation:** Staggered `fadeUp` entrance via `--i` CSS variable. Always include `prefers-reduced-motion` fallback.
- **Both themes:** Light AND dark via `prefers-color-scheme` media query. Both must look intentional.

### Phase 4 — Deliver
- Save output to: `.opencode/output/visual/{command}-{description}-{timestamp}.html` using the `Write` tool.
- Validate the saved file with `scripts/validate-html-output.sh` and fix any failures before delivery.
- Open in browser for visual verification.
- Report: file path, file size, validator result, and any quality check failures.
- Never stop at markdown-only output when HTML was requested. If HTML cannot be produced, escalate clearly instead of returning markdown as a fallback.

<!-- /ANCHOR:how-it-works -->

---

<!-- ANCHOR:rules -->
## 4. RULES


### ✅ ALWAYS
- Self-contained HTML — all CSS inline, no external stylesheets linked
- `--ve-*` CSS custom property namespace for all theme colors
- `prefers-reduced-motion` media query on all animations
- `prefers-color-scheme` for light AND dark themes
- Overflow protection: `min-width: 0` on flex/grid children, `overflow-wrap: break-word`
- Mermaid `theme: 'base'` only — never use built-in named themes
- Google Fonts with `display=swap` — never block rendering
- Mermaid zoom controls (+/-/reset, Ctrl+scroll, drag-to-pan) on every `.mermaid-wrap`
- Output to `.opencode/output/visual/` directory

### ❌ NEVER
- Build-step frameworks (React, Vue, Svelte) — output must open directly in browser
- Hardcoded pixel dimensions for layout — use relative units and `max-width`
- `color:` in Mermaid `classDef` — causes parser errors
- Opaque light fills in Mermaid `classDef` — use 8-digit hex with alpha
- Inter, Roboto, or Arial as the primary display font
- Auto-running background scripts: no `setInterval`, no `fetch`, no `localStorage`
- External assets at render time — must be self-contained or CDN

### ⚠️ ESCALATE IF
- Content exceeds single-page capacity (> 15 sections) — suggest splitting
- Output must be a React/Vue component — outside scope
- Server-side data required — cannot fetch dynamically
- Confidence < 80% on diagram type selection — present options to user

<!-- /ANCHOR:rules -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA


1. **Squint test** — hierarchy visible when page is blurred
2. **Swap test** — page is NOT generic; wrong theme would look wrong
3. **Both themes** — light AND dark look intentional
4. **Information completeness** — all source data represented
5. **No overflow** — all widths tested with overflow protection
6. **Mermaid zoom controls** — every diagram has +/-/reset + Ctrl+scroll + drag-to-pan
7. **File opens cleanly** — no console errors, no layout shifts
8. **Accessibility** — color contrast >= 4.5:1, no color-only encoding
9. **Reduced motion** — works with `prefers-reduced-motion: reduce`

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

### CDN Libraries

| Library | Version | Use Case |
|---------|---------|---------|
| Mermaid.js | v11 (ESM) | Flowcharts, sequences, ER, state, mindmap |
| Chart.js | v4 | Dashboards, metrics, bar/line/pie |
| anime.js | v3.2.2 | Staggered reveals, SVG path drawing |
| Google Fonts | Latest | Typography — 13 curated pairings only |


### Output Convention

```text
.opencode/output/visual/{command}-{description}-{timestamp}.html
```

Examples:
- `generate-auth-architecture-20260220-143022.html`
- `diff-review-pr-47-20260220-143022.html`
- `recap-2w-progress-20260220-143022.html`

### Delivery Contract

- Artifact-first: always create the `.html` file with the `Write` tool before replying.
- Verification-first: run `scripts/validate-html-output.sh` on the generated file.
- Reply format: provide absolute path, file size, and validator outcome.
- Do not return markdown tables or prose as a substitute for a requested HTML visual.

### Cross-Skill Integration

| Skill | When to Call |
|-------|-------------|
| `system-spec-kit` memory | `/recap` and `/plan-review` — load prior session context |
| `sk-git` | `/diff-review` — gather git diff and PR data |
| `mcp-chrome-devtools` | Post-delivery — validate HTML, check console errors |

### Resources

| Resource | Description | Loading |
|----------|-------------|---------|
| `references/quick_reference.md` | Command cheat sheet, CDN snippets, font pairings | ALWAYS |
| `references/css_patterns.md` | Full CSS pattern library for all 9 aesthetics | CONDITIONAL |
| `references/library_guide.md` | Mermaid, Chart.js, anime.js deep dive | CONDITIONAL |
| `references/navigation_patterns.md` | Sticky TOC, scroll spy, mobile nav | ON_DEMAND |
| `references/quality_checklist.md` | Detailed 9-check verification procedure | ON_DEMAND |
| `assets/templates/architecture.html` | Terracotta/sage reference template | ON_DEMAND |
| `assets/templates/mermaid-flowchart.html` | Teal/cyan Mermaid+ELK template | ON_DEMAND |
| `assets/templates/data-table.html` | Rose/cranberry data table template | ON_DEMAND |

<!-- /ANCHOR:integration-points -->
