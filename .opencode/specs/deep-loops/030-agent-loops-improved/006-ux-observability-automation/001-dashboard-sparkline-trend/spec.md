---
title: "Dashboard Sparkline and Trend Rendering"
description: "The deep-research dashboard has no visual trend indicator for novelty decay or score trajectory: operators cannot tell at a glance whether the loop is making progress, flatlining, or recovering — they must parse raw numbers across iteration summaries."
trigger_phrases:
  - "dashboard sparkline"
  - "sparkline trend"
  - "newInfoRatio trend"
  - "001 dashboard sparkline"
  - "reduce-state trend section"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/006-ux-observability-automation/001-dashboard-sparkline-trend"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 001-dashboard-sparkline-trend"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Dashboard Sparkline and Trend Rendering

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-single-loop-telemetry-heartbeat |
| **Handoff Criteria** | `validate.sh --strict` passes; sparkline renders in reduce-state.cjs output without errors; plan.md and checklist.md present |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 1 of 6 within `006-ux-observability-automation`. It can run in parallel with 002-single-loop-telemetry-heartbeat (no shared target files).

**Scope Boundary**: `reduce-state.cjs` only — pure reducer change. No YAML step sequence changes, no runtime changes, no other scripts.

**Dependencies**:
- No blocking dependency. Can start immediately.
- Per research §6 dependency order: sparkline can proceed in parallel with integrity helpers.

**Deliverables**:
- `renderSparkline()` function in `reduce-state.cjs`
- `## 5. TREND` section in dashboard output showing newInfoRatio/score history as ASCII sparkline
- Terminal gate check emitting `trend_flatline` warning on consecutive flat iterations

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-ux-observability-001`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research dashboard reports iteration scores and newInfoRatio as raw numbers but provides no visual trend summary. Operators reading mid-run state cannot determine whether novelty is decaying, the score is improving, or the loop has flatlined without comparing multiple iteration summaries manually. This slows the detect-and-act feedback loop and makes convergence timing opaque.

### Purpose
Add a pure `renderSparkline()` function to `reduce-state.cjs` that renders newInfoRatio and score history as a single-line sparkline in a `## 5. TREND` dashboard section, making "novelty decaying / flatlining / recovery spike" visible at a glance and enabling a terminal gate for flatline detection.

> **Reference**: `external/kasper/src/utils.ts:172-184`; `handlers.ts:262-270` — `renderSparkline()` takes a history array and returns a Unicode block-character string; handlers inject it into the dashboard header at each status render. (Research: research.md §5.5, iters 34, 42)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `renderSparkline(history: number[], opts?: {width?: number}): string` utility in `reduce-state.cjs`
- `## 5. TREND` section in dashboard markdown: one sparkline line for newInfoRatio history, one for score history
- Terminal gate: if sparkline is flat for N consecutive iterations, emit `trend_flatline` advisory event
- Unit tests covering sparkline output for known history arrays (decay, growth, flat)

### Out of Scope
- Running-iteration banner ("iteration N running for Ts") — requires a canonical `iteration_started` lifecycle event that does not yet exist; tagged as deep variant in research §5.5
- Changes to `deep_research_auto.yaml`, `deep_research_confirm.yaml`, or any other file outside `reduce-state.cjs`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify | Add `renderSparkline()` + `## 5. TREND` section in dashboard output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `renderSparkline()` renders a non-empty string for any history array of length ≥ 2 | Unit test: `renderSparkline([0.1, 0.4, 0.2, 0.7])` returns a string of the correct width (default 20) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `## 5. TREND` section appears in dashboard output when history has ≥ 2 data points | Integration test with a 3-iteration fixture → assert `## 5. TREND` block is present |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `renderSparkline([0.8, 0.5, 0.3, 0.2, 0.2])` returns a string with a visually descending right-side trend
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New `## 5. TREND` section breaks downstream consumers parsing dashboard markdown | Low — additive new section; existing sections unchanged | Section appended at end; prior sections intact |
| Risk | Unicode block characters render as boxes in some terminal environments | Low — cosmetic only | Use ASCII fallback characters when Unicode detection fails, or make configurable |

> **Deep-variant note**: The in-progress banner is the deep variant (requires canonical lifecycle event). This leaf only implements the static sparkline over completed iteration history. (Research: research.md §5.5, iter 34)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the sparkline use Unicode block characters (▁▂▃▄▅▆▇█) or require an ASCII-only fallback option?
- What is the default window width for the sparkline — full history or last N iterations (e.g., last 20)?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
