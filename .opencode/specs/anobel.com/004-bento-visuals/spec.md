---
title: "Feature Specification: Bento Visual Recreation in Open Design"
description: "Import Anobel design tokens into Open Design, then recreate and improve 14 bento feature-visual pages (index, aggregation, and 4 features x 3 directions = 60 bento cards) using sk-design-interface for judgment and mcp-open-design for transport."
trigger_phrases:
  - "bento visuals"
  - "design tokens"
  - "open design"
  - "prototyping"
  - "feature-visuals"
  - "anobel"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/004-bento-visuals"
    last_updated_at: "2026-06-21T14:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planning phase complete — spec, plan, tasks, and checklist drafted"
    next_safe_action: "Run /speckit:implement to begin Phase 0 (OD daemon check + design system import)"
    blockers: []
    key_files:
      - "Websites/anobel.com/src/4_prototyping/Anobel Design Tokens.dc.html"
      - "Websites/anobel.com/src/4_prototyping/Anobel Visuals.dc.html"
      - "Websites/anobel.com/src/4_prototyping/Bento-Alle-Visuals.dc.html"
      - "Websites/anobel.com/src/4_prototyping/Bento-OCI-v3.dc.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-anobel.com/004-bento-visuals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "3 directions per feature (12 pages, 60 cards)"
      - "Include index + aggregation pages (14 pages total)"
      - "Level 2 documentation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Bento Visual Recreation in Open Design

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planning |
| **Created** | 2026-06-21 |
| **Source Files** | `4_prototyping/Anobel Design Tokens.dc.html`, `Anobel Visuals.dc.html`, `Bento-Alle-Visuals.dc.html`, `Bento-OCI-v3.dc.html` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four Anobel bento feature-visual prototypes exist as Design Component `.dc.html` files with inline styles and `<sc-for>` templating loops. They currently live outside Open Design and cannot benefit from its design-system reuse, generation pipeline, or sk-design-interface critique workflow. The prototypes span 14 pages (1 index, 1 aggregation, 12 feature pages) with 60 total bento card variations.

### Purpose
Import the Anobel design tokens into Open Design as a design system, then recreate all 14 bento pages with `sk-design-interface` design judgment and `mcp-open-design` generation transport — producing improved, token-grounded visual output that is critiqued against AI-template defaults.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Import Anobel design tokens (brand colors, ramps, typography, radii, spacing, components) into an Open Design design system
- Recreate the Bento feature-index page (dark theme, 4+2 feature card links)
- Recreate the Bento aggregation page (dc-import-style composition of all feature pages)
- Recreate 4 features x 3 directions = 12 feature pages (60 bento cards total):
  - Kwartaalcijfers (v1, v2, v3) — financial quarter/annual visuals
  - Maandfactuur (v1, v2, v3) — single monthly invoice visuals
  - OCI-koppeling (v1, v2, v3) — OCI integration visuals
  - Marad-koppeling (v1, v2, v3) — Marad integration visuals
- Apply `sk-design-interface` ground → token-system → critique → build → self-critique process
- Use `mcp-open-design` for transport (read design systems, commission generation runs)

#### Expansion (2026-06-22) — extra directions and a new category
Built beyond the faithful prototype set, to the OCI-v3 quality bar, grounded in live Mobbin/Refero
references (read live, never copied) and the seed-of-thought diversity debias:
- **Direction v4 — 4 features × 5 cards (20 cards)**, each with a distinct, seed-assigned signature:
  - Kwartaalcijfers v4 — motion-led (one reduced-motion-guarded animation per card)
  - Maandfactuur v4 — instrument panel (monospaced figures, gauges, tickers)
  - OCI-koppeling v4 — editorial hero number (one oversized figure per card)
  - Marad-koppeling v4 — layered-depth stack (inset borders, hairline rings, translucent planes)
- **New category — Vloot-functies (fleet functions)**, from the customer-supplied feature list (GROEP 1:
  Goedkeuringssysteem, Budgetteren, Bestellimieten, Aangepast assortiment, Accountbeheer; GROEP 2: Eigen
  assortiment, Standaardlijsten, Meerdere winkelwagens, Vrije artikelinvoer):
  - First as **2 group overview pages (9 cards, one per function)**.
  - Then **each function expanded to its own page of 5 distinct visual treatments (9 × 5 = 45 cards)**,
    designed by 9 parallel Opus 4.8 agents — each page spans 5 different forms (no form repeats per page).
  - Then a **second page of 5 more visuals per function (9 × 5 = 45 cards)** — 18 per-function pages total,
    10 distinct visuals per function (no form repeats across a function's two pages).
- Index + aggregation extended to navigate the full set (36 live links / 36 iframes, 0 degraded; verified
  against the live OD project, 36/36 content pages present in both).
- **Running total: 179 bento cards across 37 pages** (12 faithful + 4 v4 + 2 Vloot group + 9×5 + 9×5),
  all in OD project `2078899e` (39 files incl. tokens/index/aggregation).

### Out of Scope
- Webflow integration or CMS binding
- The `support.js` and `DCLogic` class logic (Open Design replaces the DC runtime)
- Design tokens that are not present in the source `Anobel Design Tokens.dc.html`

### Token Import Baseline (from Anobel Design Tokens.dc.html)

| Category | Tokens |
|----------|--------|
| Brand colors | `#06458C` (brand blue), `#FD4F19` (accent orange), `#DBAB00` (gold), `#282828` (dark board) |
| Color ramps | Primary/Orange (0-1000), Secondary/Blue (0-1000), Tertiary/Gold (0-1000), Neutral (0-1400), Positive/Green (0-1000), Negative/Red (0-1000) |
| Typography | Hanken Grotesk (400-800), headings 600/blue/120%, body 400/16px/`#4E4E4E` |
| Radii | 2px, 4px, 8px, 12px, 16px |
| Cards | White surfaces `#fff`, `#ececec` borders, 16px radius |
| Dark surfaces | `#1b1b1b` background, `#2a2a2a` borders |
| Direction variants | v1 (original: line, ratio, punch-out, button), v2 (small-multiples, dashes, handshake, seal), v3 (stacked bar, stack, sync loop, before/after) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Anobel design tokens are imported into Open Design as a design system | `tokens.css` exists in the OD project with brand colors, 6 ramps, Hanken Grotesk typography, 5 radii, and spacing extracted from `Anobel Design Tokens.dc.html` |
| REQ-002 | Feature-index page is recreated in Open Design | Dark-themed page with 4 feature cards + v2/v3 links matching `Anobel Visuals.dc.html` structure renders in OD preview |
| REQ-003 | Four feature pages for Direction 1 (original) are recreated | Each page contains 5 bento cards (480x440px), SVG-driven, no text content beyond labels |
| REQ-004 | `sk-design-interface` Steps 0-2 completed before any generation | Design critique on palette, type, structure documented — deviations from AI-template defaults justified |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Four feature pages for Direction 2 (v2) are recreated | Each page contains 5 bento cards distinct from v1, matching the v2 concepts (small-multiples, dashes, handshake, seal) |
| REQ-006 | Four feature pages for Direction 3 (v3) are recreated | Each page contains 5 bento cards distinct from v1/v2, matching the v3 concepts (stacked bars, stack, sync loop, before/after) |
| REQ-007 | Aggregation page imports all feature pages | Aggregation page renders all 12 feature pages via OD composition, matching `Bento-Alle-Visuals.dc.html` structure |
| REQ-008 | `sk-design-interface` Step 4 self-critique applied to all pages | Each feature page passes quality floor check (no generic look, justified aesthetic risk) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Open Design project contains a design system with all Anobel brand tokens from `Anobel Design Tokens.dc.html`
- **SC-002**: All 14 pages render in OD preview — 1 index + 1 aggregation + 12 feature pages
- **SC-003**: 60 bento cards across 12 feature pages each display at 480x440px dimensions
- **SC-004**: No generic/AI-templated design — sk-design-interface critique confirms distinctiveness for each direction
- **SC-005**: Navigation structure mirrors prototypes: index → feature pages, aggregation collecting all
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Open Design desktop app (v0.9.0+) must be running | High (blocker) | Verify daemon reachable via `od status` before starting |
| Risk | Token import fidelity — CSS variable mapping vs source inline styles | Medium | Validate color hex values, radius px values, font stacks match source |
| Dependency | `sk-design-interface` must be loaded before any OD generation | High (blocker) | Hard gate at Step 2 of mcp-open-design routing |
| Risk | Bento card SVG recreation complexity — hand-crafted diagrams | Medium | Start from OCI-v3 as reference; use OD SVG generation capabilities |
| Risk | 60 cards across 12 pages may exceed practical generation throughput | Medium | Batch per direction; verify each batch before proceeding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all scope questions resolved during planning.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each OD generation run completes within reasonable time (bento cards are visual-only, no data fetching)
- **NFR-P02**: Design system tokens load once and are reused across all feature pages

### Portability
- **NFR-S01**: All artifacts self-contained in a single OD project — no external service dependencies beyond OD desktop app
- **NFR-S02**: Bento card SVG code should be self-contained (no external icon libraries; Lucide-style inline SVGs are acceptable)

### Reliability
- **NFR-R01**: OD daemon remains responsive across all generation runs
- **NFR-R02**: If a single card generation fails, the rest of the batch should not be blocked
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Generation Boundaries
- Empty generation run: Verify OD error response is surfaced, not silently swallowed
- Maximum cards per run: Batch by direction (5 cards per run), do not attempt all 60 in one go

### Design Fidelity
- Missing token: If a source token is unclear, default to the nearest ramp stop from the neutral ramp
- Font fallback: If Hanken Grotesk is unavailable in OD, use the system sans-serif stack from the tokens file

### State Management
- Partial generation: If a run produces fewer than 5 cards, review the remaining card concepts with sk-design-interface before retrying
- Interrupted generation: OD project state is persistent — resume from the last completed batch
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 14 pages, 60 cards, design system import — broad but repetitive pattern |
| Risk | 10/25 | No auth, no API, no data — OD tool availability is the main risk |
| Research | 8/20 | Design token extraction is straightforward; OD generation prompts may need iteration |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
