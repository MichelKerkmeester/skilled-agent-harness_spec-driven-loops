# Implementation Plan: 046 - sk-doc-visual Templates Phase 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | HTML, CSS, JavaScript (self-contained) |
| **Framework** | Tailwind CSS CDN, Mermaid.js, Iconify |
| **Target** | `.opencode/skill/sk-doc-visual/assets/templates/` |

### Overview

Create 7 new HTML visual templates following the established README Ledger design system. Each template converts a specific markdown document type into a rich, styled HTML page with sidebar navigation, interactive elements, and responsive design.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

### Design System (from existing templates)

- **Theme**: Dark default with light mode override
- **Tokens**: `--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border`
- **Typography**: Helvetica body + JetBrains Mono code
- **Layout**: 260px sidebar + fluid content, responsive collapse at 1024px
- **Components**: glass-card, toc-link, flow-step, viz-bar, status badges, data-table

### Template Architecture

Each template follows this structure:
1. HTML head with meta tags, fonts, Tailwind, Iconify, pinned CDN libs
2. Inline CSS with design tokens, responsive type scale, component styles
3. Sidebar TOC with active state tracking
4. Main content with semantic sections
5. JS for scroll-spy navigation and interactive elements
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION PHASES

### Phase 1: Template Creation (Parallel)

All 7 templates can be created independently in parallel:

| Template | Accent Color | Key Components |
|----------|-------------|----------------|
| deployment-guide | `#f59e0b` (amber) | Step wizard, checklists, file cards, rollback |
| troubleshooting-guide | `#ef4444` (red) | Priority cards, fix steps, decision tree |
| decision-record | `#8b5cf6` (purple) | ADR cards, comparison table, five checks |
| spec | `#3b82f6` (blue) | Metadata, requirements, risk matrix, scope |
| plan | `#10b981` (green) | Timeline, dependency graph, quality gates |
| tasks | `#f97316` (orange) | Task board, phase groups, progress bars |
| checklist | `#06b6d4` (cyan) | Priority badges, evidence, interactive checks |

### Phase 2: SKILL.md Integration

Update LOADING_LEVELS ON_DEMAND list and template references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Visual | Each template | Open in browser, verify layout |
| Responsive | All templates | Check at 320px, 768px, 1024px, 1440px, 2560px |
| Theme | All templates | Verify dark and light modes |
| Accessibility | All templates | Contrast ratios, reduced motion |
<!-- /ANCHOR:testing -->
