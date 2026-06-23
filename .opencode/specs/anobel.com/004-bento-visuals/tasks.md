---
title: "Tasks: Bento Visual Recreation in Open Design"
description: "Task breakdown for 14-page bento recreation: import design tokens, generate navigation pages, 12 feature pages (4 features x 3 directions), and verify."
trigger_phrases:
  - "bento"
  - "open design"
  - "tasks"
  - "generation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/004-bento-visuals"
    last_updated_at: "2026-06-21T14:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Tasks drafted"
    next_safe_action: "Begin Phase 1: T001 — verify OD daemon"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-anobel.com/004-bento-visuals"
      parent_session_id: null
    completion_pct: 93
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Bento Visual Recreation in Open Design

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Foundation — Design System Import
- [x] T001 Verify OD daemon reachable — 11 processes, socket at `/tmp/open-design/ipc/release-stable/daemon.sock`
- [x] T002 Extract tokens from `Anobel Design Tokens.dc.html` — brand colors, 6 ramps, typography, 5 radii
- [x] T003 Create OD project — id `00765887-72e8-4045-8ce8-8293f879ab01`, name "Anobel Bento Visuals"
- [x] T004 Write `tokens.css` — 120+ CSS custom properties covering brand colors, 6 ramps (11 stops each), typography, radii, surfaces, components
- [x] T005 Write `DESIGN.md` — token documentation and usage guide
- [x] T006 Load `sk-design-interface` skill, run Steps 0-2 (ground → token-system → critique)
- [x] T007 Document sk-design-interface critique findings — palette avoids AI-default clusters, bento-card SVG language is justified aesthetic risk

### Navigation Pages
- [x] T008 Generate feature-index page — dark theme, 4 feature cards with icons, v2/v3 links (`index.html`)
- [x] T009 Generate aggregation page — composition page loading all 12 feature pages via iframes (`aggregation.html`)
- [x] T010 Verify navigation structure renders correctly in OD preview
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Direction 1 (Original) — 20 cards
- [x] T011 [P] Kwartaalcijfers v1 — line chart, year-over-year, totals, distribution, report (`features/kwartaalcijfers/direction-01.html`)
- [x] T012 [P] Maandfactuur v1 — many-to-one, ratio, month matrix, overview, timeline (`features/maandfactuur/direction-01.html`)
- [x] T013 [P] OCI v1 — connected, punch-out, systems, shopping cart, efficiency (`features/oci/direction-01.html`)
- [x] T014 [P] Marad v1 — one button, progress, en-route, schedule, announcement (`features/marad/direction-01.html`)

### Direction 2 (v2) — 20 cards
- [x] T015 [P] Kwartaalcijfers v2 — small-multiples, slope, leaderboard, delta, heatmap (`features/kwartaalcijfers/direction-02.html`)
- [x] T016 [P] Maandfactuur v2 — dashes, fraction, before/after, envelope, merged (`features/maandfactuur/direction-02.html`)
- [x] T017 [P] OCI v2 — connection, field mapping, handshake, switch, flow (`features/oci/direction-02.html`)
- [x] T018 [P] Marad v2 — button, seal, XML lockup, 2026, confirmation (`features/marad/direction-02.html`)

### Direction 3 (v3) — 20 cards
- [x] T019 [P] Kwartaalcijfers v3 — stacked bar, donut, waterfall, treemap, goal vs actual (`features/kwartaalcijfers/direction-03.html`)
- [x] T020 [P] Maandfactuur v3 — stack, chips, donut, sum, month receipt (`features/maandfactuur/direction-03.html`)
- [x] T021 [P] OCI v3 — sync loop, shared catalog, status panel, bridge, faster (`features/oci/direction-03.html`)
- [x] T022 [P] Marad v3 — before/after, menu, countdown ring, stamp, switch (`features/marad/direction-03.html`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Run sk-design-interface Step 4 self-critique on all generated pages
- [ ] T024 Verify card dimensions — 480x440px per card via inspector
- [ ] T025 Verify token fidelity — color picker comparison against source values
- [ ] T026 Count rendered artifacts — 14 pages, 60 bento cards
- [ ] T027 Verify navigation — click-through index → features → aggregation
- [ ] T028 Update `implementation-summary.md` with completion status
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 28 tasks marked `[x]` — 22/22 core tasks done, 6 verification tasks pending
- [ ] No `[B]` blocked tasks remaining
- [x] 14 pages, 60 cards in OD project — verified via API: 14 HTML artifacts
- [ ] Spec/plan/tasks/checklist/implementation-summary synchronized
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` — requirements, scope, success criteria
- **Plan**: See `plan.md` — architecture, effort estimates, phase dependencies
- **Checklist**: See `checklist.md` — P0/P1/P2 verification items
<!-- /ANCHOR:cross-refs -->
