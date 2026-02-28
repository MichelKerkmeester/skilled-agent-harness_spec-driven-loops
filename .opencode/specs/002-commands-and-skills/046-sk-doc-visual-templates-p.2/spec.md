# Feature Specification: 046 - sk-doc-visual Templates Phase 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Expand sk-doc-visual with 7 new HTML visual templates that convert markdown document types into styled, self-contained HTML pages. Templates follow the existing design system (dark theme, Tailwind CDN, JetBrains Mono, Iconify, Mermaid) and provide visual representations for: deployment guides, troubleshooting guides, decision records, specifications, plans, task trackers, and checklists.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 046 |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-doc-visual currently has only 3 HTML templates (api-reference, implementation-summary, readme-guide). Many common document types lack visual HTML templates, forcing users to read plain markdown for complex deployment guides, troubleshooting docs, decision records, and SpecKit planning artifacts.

### Purpose

Provide 7 new visual HTML templates that transform markdown documents into rich, styled HTML pages with interactive elements, proper information hierarchy, and the established design system.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

7 new HTML templates in `.opencode/skill/sk-doc-visual/assets/templates/`:

| Template | Based On | Key Visual Elements |
|----------|----------|-------------------|
| `deployment-guide.html` | WEBFLOW_DEPLOYMENT_GUIDE.md | Step wizard, interactive checklists, file reference cards, rollback section |
| `troubleshooting-guide.html` | webflow-fix-guide.md | Priority-colored fix cards, visual step guides, decision trees |
| `decision-record.html` | decision-record.md | ADR cards, alternatives comparison table, five checks scorecard |
| `spec.html` | spec.md | Metadata header, requirements table, risk matrix, scope visualization |
| `plan.html` | plan.md | Phase timeline, dependency graph, architecture diagram, quality gates |
| `tasks.html` | tasks.md | Phase-grouped task board, status indicators, progress bars |
| `checklist.html` | checklist.md | Priority badges (P0/P1/P2), evidence links, interactive checkboxes, completion summary |

### Out of Scope

- Modifying existing templates
- Changes to SKILL.md routing logic
- New reference documents
- Runtime server-side features
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 templates use README Ledger design tokens | `--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border` present |
| REQ-002 | Templates are self-contained HTML | No external file dependencies beyond CDN |
| REQ-003 | Dark/light theme support | `prefers-color-scheme` media query present |
| REQ-004 | Responsive design | Works at 320px-2560px without overflow |
| REQ-005 | Reduced motion support | `prefers-reduced-motion` media query present |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each template has sidebar TOC navigation | `.toc-link` with active state tracking |
| REQ-007 | Templates include placeholder content | Realistic example data matching document type |
| REQ-008 | SpecKit metadata tags present | `ve-artifact-type`, `ve-source-doc`, `ve-speckit-level`, `ve-view-mode` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: All 7 HTML files exist in `assets/templates/`
- SC-002: Each file opens cleanly on `file://` with no console errors
- SC-003: Design consistency with existing implementation-summary.html template
- SC-004: Each template accurately represents its document type's information hierarchy
<!-- /ANCHOR:success-criteria -->
