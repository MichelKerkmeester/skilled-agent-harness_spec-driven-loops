---
title: "Implementation Plan: Dashboard Sparkline and Trend Rendering"
description: "Documents the completed reduce-state dashboard sparkline and trend section work."
trigger_phrases:
  - "dashboard sparkline"
  - "sparkline trend"
  - "newInfoRatio trend"
  - "reduce-state trend section"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/006-ux-observability-automation/001-dashboard-sparkline-trend"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Dashboard Sparkline and Trend Rendering

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS reducer script for deep-research dashboard markdown |
| **Framework** | Deep-loop workflow reducer output via `reduce-state.cjs` |
| **Storage** | Iteration history already present in reducer input |
| **Testing** | Sparkline unit fixtures, dashboard-section fixture, strict spec validation |

### Overview
This completed work added a pure sparkline renderer to the deep-research reducer so novelty and score history are visible without manually comparing iteration rows. The dashboard now includes a `## 5. TREND` section and emits a flatline advisory when repeated flat values indicate stalled progress.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: dashboard output exposed raw numbers but no trend visualization.
- [x] Success criteria measurable: sparkline output is non-empty for history arrays of length at least 2.
- [x] Dependencies identified: this leaf is scoped to `reduce-state.cjs` only.

### Definition of Done
- [x] `renderSparkline()` renders bounded history arrays into a compact line.
- [x] Dashboard output includes a `## 5. TREND` block for `newInfoRatio` and score history.
- [x] Flat repeated trend values emit a `trend_flatline` advisory.
- [x] Sparkline and dashboard fixture checks cover decay, growth, and flat histories.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure reducer enhancement: a deterministic formatter transforms existing numeric history into display strings without changing deep-loop runtime state or YAML step sequencing.

### Key Components
- **`renderSparkline(history, opts)`**: Converts score or novelty history into a fixed-width visual trend string.
- **`reduce-state.cjs` dashboard renderer**: Appends the `## 5. TREND` section when at least two data points exist.
- **Flatline advisory gate**: Detects consecutive flat values and emits `trend_flatline` for terminal status readers.

### Data Flow
The reducer reads existing iteration summaries, extracts score and `newInfoRatio` values, renders each series through `renderSparkline()`, and appends the trend lines to the dashboard markdown. The same history scan detects flatline sequences and records the advisory event.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduce-state.cjs` history reader | Collects iteration summaries | Reuse existing score and novelty values | Fixture with 3 iterations produces trend section |
| `renderSparkline()` | New formatter | Render decay, growth, and flat histories | Unit fixtures assert non-empty bounded output |
| Dashboard markdown | Operator status surface | Append `## 5. TREND` | Markdown output contains two sparkline rows |
| Terminal advisory events | Signals stalled loops | Emit `trend_flatline` on flat sequences | Flat-history fixture records advisory |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm the reducer-only scope.
- [x] Identify score and `newInfoRatio` history as the only required inputs.
- [x] Keep running-iteration banners and YAML changes out of scope.

### Phase 2: Core Implementation
- [x] Add `renderSparkline()` to `reduce-state.cjs` with a safe default width.
- [x] Add dashboard rendering for `## 5. TREND` using novelty and score histories.
- [x] Add flatline detection that emits `trend_flatline` on repeated flat values.

### Phase 3: Verification
- [x] Verify decay, growth, and flat sparkline fixtures.
- [x] Verify a 3-iteration reducer fixture includes the trend section.
- [x] Verify the leaf spec folder validates under strict mode.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `renderSparkline()` for decay, growth, and flat histories | Reducer fixture test |
| Integration | Dashboard markdown with at least 3 iterations | `reduce-state.cjs` fixture run |
| Advisory | Flatline terminal gate | Flat history fixture |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing iteration score and novelty history | Internal | Complete | Sparkline output needs at least two historical values |
| Running-iteration lifecycle event | Out of scope | Not required | The static trend section works without live in-progress telemetry |
| Other phase 006 leaves | Internal | Not required | This reducer-only leaf can stand alone |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Sparkline rendering breaks dashboard output, advisory events misfire, or terminals cannot render the selected characters.
- **Procedure**: Revert the `reduce-state.cjs` sparkline formatter, trend-section append, and flatline advisory code, restoring the previous raw-number dashboard output.
<!-- /ANCHOR:rollback -->
