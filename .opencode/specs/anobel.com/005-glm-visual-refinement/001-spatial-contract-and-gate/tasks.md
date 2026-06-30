---
title: "Tasks: spatial-contract-and-gate"
description: "Ordered implementation tasks for the SAFE_LINEAR_560 contract, preflight rubric, deterministic gate, and one failure-only repair pass. All unchecked - executed later."
trigger_phrases:
  - "spatial contract and gate"
  - "tasks"
  - "SAFE_LINEAR_560"
  - "deterministic gate"
  - "failure-only repair"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/001-spatial-contract-and-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 task breakdown for phase 001 (all unchecked)"
    next_safe_action: "Execute T001 when implementation begins"
    blockers: []
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: spatial-contract-and-gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

> All tasks are unchecked - this is a planning artifact; implementation happens in a later code phase.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Estimated effort: 1-2 hours._


- [ ] T001 Pin one headless-render engine (Playwright or Puppeteer) and add it to the harness deps (`research/inputs/`) [30m]
- [ ] T002 Add `A1_ARM` (`control`/`a1_prompt`/`a1_gate_repair`) + `A1_RUN_ID` env scaffolding and per-arm output paths to `gen-tile.mjs` (REQ-008) [30m]
- [ ] T003 Define and document the per-tile failure-JSON schema - tile id, six check results, offending bboxes, contrast pairs, overflow summary (REQ-009) [30m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Estimated effort: 6-11 hours._


### Contract + Preflight (angles A1 + A2; pipeline steps 1, 2)
- [ ] T004 Implement `a1Block(t)` geometry contract: 560x480 CSS vars, visual box `x=30..530`/`y=30..328`, reserved title band `x=30..530`/`y=356..456`, `data-a1-role` attrs (`gen-tile.mjs`, REQ-001) [45m]
- [ ] T005 Add primitive caps to the contract: matrix header+3 rows+`+N more`, branch max 3 cards, integration max 3 nodes, legend max 2, CTA max 2, min gap 10px (`gen-tile.mjs`, REQ-002) [30m]
- [ ] T006 Add pre-cased eyebrow literal + ban `text-transform:uppercase` (`gen-tile.mjs`, REQ-003) [15m]
- [ ] T007 Add on-dark neutral tokens (body `#E7ECF7`, muted `#B8C2D6`) + banned readable-gray list (`gen-tile.mjs`, REQ-004) [15m]
- [ ] T008 Implement the required preflight metadata block (reason-then-build) and parse + store + strip it from the rendered HTML (`gen-tile.mjs`, REQ-005) [1h]

### Deterministic Gate (angles A1 + A5; pipeline step 5)
- [ ] T009 Implement `contrast.mjs` - computed-CSS contrast (WCAG AA) with as-text vs as-fill/stroke distinction (`research/inputs/contrast.mjs`, REQ-006) [1.5h]
- [ ] T010 Implement `a1-gate.mjs` headless render + DOM bbox extraction (`research/inputs/a1-gate.mjs`) [1.5h]
- [ ] T011 Implement the six gate checks: title-band intrusion, visual-panel overflow (bottom>328), bbox overlap, banned-gray/low-contrast text, `text-transform:uppercase`, clipping (`a1-gate.mjs`, REQ-006) [1.5h]
- [ ] T012 Emit one per-tile failure JSON per the frozen schema (`a1-gate.mjs`, REQ-009) [30m]

### Failure-only Repair (angles A3 + A4; pipeline step 6)
- [ ] T013 Implement `a1-repair.mjs` - one GLM repair call per failing tile with failure JSON + screenshot; lock copy/palette/title/glyph/casing; no second repair (`research/inputs/a1-repair.mjs`, REQ-007) [1h]
- [ ] T014 Wire the loop: gate -> repair (failures only) -> re-run gate once -> final scoring uses repaired HTML when repair fired (`gen-tile.mjs` / `a1-repair.mjs`, REQ-007) [45m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Estimated effort: 2-4 hours._


### Gate Self-Test
- [ ] T015 Assert the gate FAILS the known-bad tiles: accountbeheer-4, oci-4, goedkeuringssysteem-4 (`a1-gate.mjs`) [30m]
- [ ] T016 Assert the gate PASSES the known-good tiles: accountbeheer-5, kwartaalcijfers-2 (`a1-gate.mjs`) [20m]
- [ ] T017 Unit-test contrast: `#4e4e4e` on `#043367` -> fail; `#8591b3` as a stroke -> pass (`contrast.mjs`) [20m]

### 45-Tile Pilot
- [ ] T018 Run C0 (control) across all 45 cells to re-establish the paired baseline [20m]
- [ ] T019 Run T1 (a1_prompt) across all 45 cells [20m]
- [ ] T020 Run T2 (a1_prompt + gate + one repair) across all 45 cells [40m]

### Measure vs Targets
- [ ] T021 Compute SHIP rate per arm; verify T2 lifts +7-16pp to ~30-34/45 = 67-76% (SC-001) [15m]
- [ ] T022 Compute diagram-vs-linear delta; report the post-conversion delta with its measurement basis, not as pure 2D gain (SC-002) [15m]
- [ ] T023 Compute contrast exit-0 rate; verify 95-100% on accepted tiles (SC-003) [10m]
- [ ] T024 Confirm linear-flow slice mean does not regress more than 3 pts (SC-005) [10m]
- [ ] T025 Confirm per-tile failure JSON exists for all 45 tiles - the measurement surface for phases 002-006 (SC-006) [10m]

### Documentation
- [ ] T026 Author `implementation-summary.md` with measured deltas vs baseline and adoption verdict [20m]
- [ ] T027 Mark every `checklist.md` item with evidence [15m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Gate self-test passes (known-bad fail, known-good pass)
- [ ] 45-tile pilot run for C0 / T1 / T2
- [ ] SC-001..SC-006 measured and met (or deferral approved)
- [ ] `checklist.md` fully verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- All unchecked - planning only; executed in a later code phase
- Tasks map to REQ-001..REQ-009 and SC-001..SC-006
-->
