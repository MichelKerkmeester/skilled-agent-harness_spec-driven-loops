---
description: "ALWAYS/NEVER/ESCALATE IF behavioral rules for sk-visual-explainer outputs"
---
# Rules

These rules are non-negotiable constraints on every output this skill produces. They exist to ensure outputs are accessible, self-contained, maintainable, and visually correct across all environments. Check each rule before delivering any file.

## ALWAYS

### 1. Self-Contained HTML
All CSS must be inline in a `<style>` block. All JavaScript must be in `<script>` blocks. No external `.css` or `.js` files linked. The file must open correctly by double-clicking it in Finder/Explorer — no build step, no local server.

**Why:** The output must be portable. Anyone receiving the file should be able to open it without setup.

### 2. CSS Custom Properties with `--ve-*` Namespace
Every theme color, spacing token, and visual variable must be declared as a CSS custom property with the `--ve-` prefix. No hardcoded color values scattered through the stylesheet.

```css
:root {
  --ve-bg: #0d1117;
  --ve-surface: #161b22;
  --ve-border: #30363d;
  --ve-text: #e6edf3;
  --ve-text-dim: #8b949e;
  --ve-accent: #58a6ff;
}
```

**Why:** Enables clean light/dark theming, easy aesthetic swaps, and consistent visual identity.

### 3. `prefers-reduced-motion` Media Query
Every animation rule must have a corresponding `prefers-reduced-motion: reduce` override that either disables the animation entirely or reduces it to an instant transition.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Why:** Users with vestibular disorders, epilepsy, or motion sensitivity must never be harmed by decorative animations.

### 4. Overflow Protection
Every flex and grid container must include `min-width: 0` on direct children to prevent overflow blowout. Every text container must include `overflow-wrap: break-word`. Long URLs, code strings, and technical identifiers must be wrapped or truncated with `overflow: hidden; text-overflow: ellipsis`.

```css
.grid-child { min-width: 0; }
p, td, li { overflow-wrap: break-word; }
```

**Why:** Content with long strings (file paths, URLs, package names) will break layouts if overflow is not protected.

### 5. Mermaid `theme: 'base'` Only
Always initialize Mermaid with `theme: 'base'` and override via `themeVariables`. Never use named themes (`default`, `dark`, `forest`, `neutral`, `base` alone without variables).

```javascript
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: 'var(--ve-accent)',
    // ...
  }
});
```

**Why:** Named themes override custom CSS and fight with the `--ve-*` system, producing unpredictable results.

### 6. Run All 9 Quality Checks Before Delivery
Never claim a file is complete without running every check in [[success-criteria]]. Check the squint test, swap test, both themes, information completeness, overflow, Mermaid zoom controls, clean file open, accessibility contrast, and reduced motion behavior.

### 7. Google Fonts with `display=swap`
Always include `display=swap` in the Google Fonts URL to prevent render-blocking.

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```

**Why:** Without `display=swap`, the browser blocks rendering until the font loads, causing a flash of invisible text (FOIT).

### 8. Light AND Dark Theme via `prefers-color-scheme`
Every output must include both a light and a dark theme. Use the `prefers-color-scheme` media query to switch `--ve-*` variable values. Both themes must be intentional — dark mode cannot be an afterthought with poor contrast.

```css
@media (prefers-color-scheme: light) {
  :root {
    --ve-bg: #f8f6f1;
    --ve-surface: #ffffff;
    --ve-text: #1a1a2e;
  }
}
```

### 9. Output to `.opencode/output/visual/` Directory
Always save files to this path. Create the directory if it doesn't exist (`mkdir -p .opencode/output/visual/`). Use the naming convention: `{command}-{description}-{timestamp}.html`.

---

## NEVER

### 1. Build-Step Frameworks
Never generate React, Vue, Svelte, or any JSX/TSX output. The file must open by double-clicking. No `npm install`, no `vite dev`, no `next start`.

### 2. Hardcoded Pixel Dimensions for Layout
Never set `width: 800px` on a container element. Use `max-width: 800px; width: 100%` or `min(800px, 100%)`. Layout must be responsive.

**Exception:** Fixed pixel values are acceptable for icon sizes, avatar dimensions, and other intrinsically sized elements.

### 3. `color:` Property in Mermaid `classDef`
The `color:` property in Mermaid `classDef` causes parser errors in v11. Use only `fill:` and `stroke:`.

```
%% WRONG — causes parser error:
classDef myClass fill:#58a6ff,stroke:#388bfd,color:#0d1117

%% CORRECT:
classDef myClass fill:#58a6ff88,stroke:#388bfd
```

### 4. Opaque Light Fills in Mermaid `classDef`
Fully opaque fills (`fill:#58a6ff`) cause node labels to be invisible against the fill color. Always use 8-digit hex with alpha transparency.

```
classDef myClass fill:#58a6ff33,stroke:#388bfd
```

The last two hex digits are the alpha channel: `33` = 20% opacity, `66` = 40%, `88` = 53%, `aa` = 67%.

### 5. Inter, Roboto, or Arial as Primary Font
These fonts are overused and generic. Never use them as the primary display or heading font. Use the 13 curated pairings in `references/quick_reference.md`. Body text may use system-ui or similar for code-dense sections.

### 6. Auto-Running Background Scripts
Never include `setInterval()`, `setInterval()`, background `fetch()` calls, `localStorage` access, or any code that runs automatically after page load beyond initial rendering. The page must be inert after the initial render completes.

**Exception:** Mermaid initialization, Chart.js rendering, and anime.js entrance animations on DOMContentLoaded are permitted — these are one-shot operations.

### 7. External Asset Dependencies at Render Time
Never link to local file paths (`src="../../assets/logo.png"`). Never require a local file server. CDN resources (Mermaid, Chart.js, anime.js, Google Fonts) are permitted as they are publicly available and reliably cached.

### 8. ASCII Art Diagrams
Never produce ASCII art diagrams. Use Mermaid for graph/flow structures, CSS Grid for layout-based visuals, or HTML tables for structured data instead.

```
%% WRONG — ASCII art:
+-------+    +-------+
| Auth  |--->| API   |
+-------+    +-------+

%% CORRECT — Mermaid:
graph LR
  Auth --> API
```

**Why:** ASCII art is not accessible (screen readers read every character), breaks on resize, cannot be zoomed, and is visually inferior to every alternative.

### 9. Emoji as Status Indicators
Never use emoji as status indicators (e.g., ✅ ❌ ⚠️ 🔴 🟢). Use CSS badges with text labels and color-coded backgrounds instead.

```html
<!-- WRONG — emoji status: -->
<td>✅ Passing</td>
<td>❌ Failed</td>

<!-- CORRECT — CSS badge: -->
<td><span class="badge badge--pass">Pass</span></td>
<td><span class="badge badge--fail">Fail</span></td>
```

```css
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
}
.badge--pass  { background: rgba(34, 197, 94, 0.15); color: #16a34a; }
.badge--fail  { background: rgba(239, 68, 68, 0.15);  color: #dc2626; }
.badge--warn  { background: rgba(234, 179, 8, 0.15);  color: #ca8a04; }
.badge--info  { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
```

**Why:** Emoji rendering varies across OS and browser, is inaccessible to screen readers without explicit `aria-label`, and cannot be styled. CSS badges provide consistent rendering, accessibility, and visual alignment with the `--ve-*` color system.

---

## ESCALATE IF

These conditions require stopping and presenting options to the user before proceeding.

### 1. Content Exceeds Single-Page Capacity
If the source content would produce more than 15 distinct sections, the page becomes unnavigable. Stop and suggest: "This content is large enough to benefit from splitting into multiple pages. Should I: A) Create one long-scroll page with sticky navigation, B) Split into linked separate pages, or C) Focus on the most critical sections only?"

### 2. React/Vue Component Required
If the user's downstream use case requires a component file (e.g., "I need to drop this into my React app"), this skill cannot fulfill the requirement. State clearly: "This skill produces standalone HTML only. For a React/Vue component, I'd need to use a different approach outside this skill's scope."

### 3. Server-Side Data Required
If the content must be fetched from an API, database, or authenticated endpoint at render time, the self-contained HTML constraint cannot be satisfied. Ask: "This visualization requires live data. Should I: A) Use a snapshot of the current data (static), B) Include a placeholder that explains where live data would appear, or C) Explore a different output format?"

### 4. Confidence < 80% on Diagram Type
If multiple diagram types could reasonably apply and the decision is unclear, do not guess. Present 2–3 concrete options with brief rationale and ask the user to choose. Example: "I can see this working as A) a flowchart (steps in sequence), B) an ER diagram (entity relationships), or C) a state machine (states and transitions). Which feels right?"

---

## Cross References
- [[success-criteria]] — The 9 quality checks referenced in ALWAYS rule 6
- [[when-to-use]] — Includes escalation cases for command selection
- [[diagram-types]] — ESCALATE IF rule 4 directs here for decision tree
- [[integration-points]] — CDN library constraints referenced in NEVER rules
