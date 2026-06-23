---
title: "Implementation Plan: Bento Visual Recreation in Open Design"
description: "Import Anobel design tokens into Open Design as a design system, then recreate 14 bento pages (60 cards) across 5 phases. All generation gated behind sk-design-interface critique."
trigger_phrases:
  - "bento"
  - "open design"
  - "design system"
  - "generation"
  - "anobel"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/004-bento-visuals"
    last_updated_at: "2026-06-21T14:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planning phase complete"
    next_safe_action: "Phase 0: verify OD daemon, import design tokens"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/SKILL.md"
      - ".opencode/skills/mcp-open-design/SKILL.md"
      - "Websites/anobel.com/src/4_prototyping/Anobel Design Tokens.dc.html"
      - "Websites/anobel.com/src/4_prototyping/Bento-OCI-v3.dc.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-anobel.com/004-bento-visuals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Bento Visual Recreation in Open Design

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Open Design (od CLI + MCP), CSS design tokens, SVG visuals |
| **Design Judgment** | `sk-design-interface` (5-step process: ground → token-system → critique → build → self-critique) |
| **Transport** | `mcp-open-design` (READ for design systems, RUN for generation) |
| **Testing** | Manual visual review — color picker, inspector, preview URL |

### Overview
Import Anobel's design tokens from the prototyping source into an Open Design design system. Then generate 14 bento pages (1 index + 1 aggregation + 4 features x 3 directions) through OD's `start_run` pipeline, with every generation run gated behind sk-design-interface critique. Each feature page contains 5 data-visualization bento cards at 480x440px. Total output: 60 cards across 12 feature pages.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] OD daemon reachable and responsive
- [ ] sk-design-interface Steps 0-2 completed

### Definition of Done
- [ ] All 6 P0 requirements met
- [ ] All 14 pages rendering in OD preview
- [ ] 60 bento cards at 480x440px dimensions
- [ ] sk-design-interface Step 4 self-critique passed
- [ ] Spec/plan/tasks/checklist synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Design Token Hierarchy

```
design-system/
  tokens.css         ← Brand colors (5), ramps (6x11), typography, radii (5), spacing
  components.html    ← Buttons (3 variants), badges, input spinners
  DESIGN.md          ← Token documentation and usage guidance
```

### Page Structure

```
project/
  index.html                    ← Dark theme navigator (4 feature cards)
  aggregation.html              ← dc-import composition (12 feature pages)
  features/
    kwartaalcijfers/
      direction-01.html         ← v1: line chart, YoY, totals, distribution, report
      direction-02.html         ← v2: small-multiples, slope, leaderboard, delta, heatmap
      direction-03.html         ← v3: stacked bar, donut, waterfall, treemap, goal vs actual
    maandfactuur/
      direction-01.html         ← v1: many-to-one, ratio, matrix, overview, timeline
      direction-02.html         ← v2: dashes, fraction, before/after, envelope, merged
      direction-03.html         ← v3: stack, chips, donut, sum, month receipt
    oci/
      direction-01.html         ← v1: connected, punch-out, systems, cart, efficiency
      direction-02.html         ← v2: connection, field mapping, handshake, switch, flow
      direction-03.html         ← v3: sync loop, shared catalog, status, bridge, faster
    marad/
      direction-01.html         ← v1: button, progress, en-route, schedule, announcement
      direction-02.html         ← v2: button, seal, XML lockup, 2026, confirmation
      direction-03.html         ← v3: before/after, menu, countdown ring, stamp, switch
```

### Bentogrid Card Specification

| Property | Value |
|----------|-------|
| Dimensions | 480 x 440px |
| Surface | White `#fff`, border `#ececec`, radius 16px |
| Content | SVG-driven data visualization, minimal labels only |
| Typography | Hanken Grotesk, weights 400-800 |
| Accent | Orange `#FD4F19` for highlights, brand blue `#06458C` for structure |
| Animations | CSS keyframes where present in prototype (blink, spin, fly) |

### Key Components

- **Design System**: Token source of truth extracted from `Anobel Design Tokens.dc.html`
- **Feature Pages**: 12 pages, each with 5 bento cards — generated via OD `start_run`
- **Index Page**: Navigation hub linking to all feature variants
- **Aggregation Page**: Composition page collecting all 12 feature pages
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Foundation — Design System Import
- [-] T001 Verify OD daemon reachable (`od status`)
- [-] T002 Extract tokens from `Anobel Design Tokens.dc.html`
- [-] T003 Write `tokens.css` and `DESIGN.md` into OD project
- [-] T004 Load `sk-design-interface`, run Steps 0-2 (ground, token-system, critique)
- [-] T005 Document sk-design-interface critique findings as generation constraints

### Phase 1: Navigation Pages
- [-] T006 Generate index page (`od start_run`) — dark theme, 4 feature cards
- [-] T007 Generate aggregation page — composition importing all 12 feature pages
- [-] T008 Verify navigation structure in OD preview

### Phase 2: Direction 1 (Original) — 4 pages, 20 cards
- [-] T009 [P] Kwartaalcijfers v1 — line chart, YoY, totals, distribution, report
- [-] T010 [P] Maandfactuur v1 — many-to-one, ratio, matrix, overview, timeline
- [-] T011 [P] OCI v1 — connected, punch-out, systems, cart, efficiency
- [-] T012 [P] Marad v1 — button, progress, en-route, schedule, announcement

### Phase 3: Direction 2 (v2) — 4 pages, 20 cards
- [-] T013 [P] Kwartaalcijfers v2 — small-multiples, slope, leaderboard, delta, heatmap
- [-] T014 [P] Maandfactuur v2 — dashes, fraction, before/after, envelope, merged
- [-] T015 [P] OCI v2 — connection, field mapping, handshake, switch, flow
- [-] T016 [P] Marad v2 — button, seal, XML lockup, 2026, confirmation

### Phase 4: Direction 3 (v3) — 4 pages, 20 cards
- [-] T017 [P] Kwartaalcijfers v3 — stacked bar, donut, waterfall, treemap, goal vs actual
- [-] T018 [P] Maandfactuur v3 — stack, chips, donut, sum, month receipt
- [-] T019 [P] OCI v3 — sync loop, shared catalog, status, bridge, faster
- [-] T020 [P] Marad v3 — before/after, menu, countdown ring, stamp, switch

### Phase 5: Verification
- [-] T021 sk-design-interface Step 4 self-critique on all pages
- [-] T022 Verify card dimensions (480x440px) via inspector
- [-] T023 Verify token fidelity (color picker comparison)
- [-] T024 Count rendered artifacts (14 pages, 60 cards)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No automated tests — design output is visual. All verification is manual.

| Test Type | Scope | Method |
|-----------|-------|--------|
| Token fidelity | All brand colors, ramps, radii | Color picker comparison against `Anobel Design Tokens.dc.html` values |
| Card dimensions | All 60 bento cards | Inspector: 480x440px per card |
| Page count | Full project | Count OD artifacts: 14 pages, 60 cards |
| Design quality | All feature pages | `sk-design-interface` Step 4: screenshot review, remove one accessory, check quality floor |
| Navigation | Index → feature pages → back | Click-through in OD preview |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Open Design desktop app (v0.9.0+) | External tool | Must verify | BLOCKED — cannot run without OD daemon |
| `sk-design-interface` skill | Internal skill | Available | BLOCKED — cannot generate without design judgment |
| `mcp-open-design` skill | Internal skill | Available | BLOCKED — cannot interact with OD without transport |
| `Anobel Design Tokens.dc.html` | Source file | Read | BLOCKED — token source |
| `Bento-OCI-v3.dc.html` | Reference file | Read | SOFT — quality benchmark for card design |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

OD artifacts are self-contained in a single project. Rollback is trivial:
1. Delete the OD project via `od project delete`
2. Re-run from Phase 0 with corrected tokens/prompts

No database, no deployment, no external consumers. Safe to recreate at any time.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Foundation) ──► Phase 1 (Navigation) ──► Phase 2 (Dir 1)
                                                   Phase 3 (Dir 2)
                                                   Phase 4 (Dir 3)
                                                         │
                                                         └──► Phase 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 0: Foundation | None | 1, 2, 3, 4 |
| 1: Navigation | 0 | 5 |
| 2: Direction 1 | 0 | 5 |
| 3: Direction 2 | 0 | 5 |
| 4: Direction 3 | 0 | 5 |
| 5: Verification | 1, 2, 3, 4 | None |

Phases 2, 3, 4 can run in parallel — each is independent (generates different pages with same token source).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0: Foundation | Med | 1-2 hours (token extraction + setup + critique) |
| Phase 1: Navigation | Low | 30-60 min (2 simple pages) |
| Phase 2: Direction 1 | Med | 2-3 hours (4 pages, 20 cards) |
| Phase 3: Direction 2 | Med | 2-3 hours (4 pages, 20 cards) |
| Phase 4: Direction 3 | Med | 2-3 hours (4 pages, 20 cards) |
| Phase 5: Verification | Low | 1 hour (visual review) |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-generation Checklist
- [ ] OD daemon verified running
- [ ] Design system tokens extracted and validated
- [ ] sk-design-interface critique documented

### Rollback Procedure
1. If OD generation produces unsatisfactory output: discard the run, refine the prompt, regenerate
2. If design system tokens are incorrect: update `tokens.css` and re-run affected phases
3. If OD daemon crashes: restart the desktop app, resume from last completed batch

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — OD projects are idempotent, no persisted state beyond generated files
<!-- /ANCHOR:enhanced-rollback -->
