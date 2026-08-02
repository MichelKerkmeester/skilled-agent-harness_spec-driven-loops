---
title: "Implementation Plan: Phase 1 — Deep research: Obsidian CLI / REST API / MCP landscape"
description: "Run a no-early-convergence multi-model /deep:research loop over Obsidian's automation surfaces and synthesize a build-vs-adopt recommendation into research.md."
trigger_phrases:
  - "obsidian research plan"
  - "deep research obsidian"
  - "mcp-obsidian phase 1 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/001-deep-research"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 1 research plan"
    next_safe_action: "Read cli-codex SKILL.md, then init /deep:research state"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Deep research: Obsidian CLI / REST API / MCP landscape

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | `/deep:research` loop (system-deep-loop), no code changes |
| **Framework** | Executor cli-codex — GPT-5.6 SOL / TERRA / LUNA |
| **Storage** | `deep-research-state.jsonl` + `deltas/` + `logs/` (externalized state) |
| **Testing** | Convergence/synthesis report + `validate.sh` on `research.md` |

### Overview
Drive a deep-research loop over Obsidian's automation surfaces with the specified three-persona model matrix and convergence detection disabled, then synthesize the iterations into a single cited `research.md` that decides build-vs-adopt for the CLI and MCP surfaces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `cli-codex/SKILL.md` read; persona/effort/speed flags + fan-out env confirmed
- [ ] Seed sources listed; research questions enumerated
- [ ] Deep-research state initialized under the phase folder

### Definition of Done
- [ ] 10 productive iterations completed (SOL×4, TERRA×3, LUNA×3), no early convergence
- [ ] `research.md` answers every question with citations + a ranked build-vs-adopt recommendation
- [ ] Each named candidate's package/binary identity verified
- [ ] `validate.sh` on this phase passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Iterative evidence loop (deep-research state machine) with disabled convergence early-exit.

### Key Components
- **Init**: register the run, seed sources + questions, set `no-early-convergence`.
- **Iteration loop**: three sequential model batches; each iteration appends a delta + log; findings accrue to state.
- **Synthesis**: fold deltas into `research.md`; rank candidates; write the recommendation.

### Data Flow
Seed sources → per-iteration findings (deltas/logs) → aggregated state → synthesized `research.md` → handoff to Phase 2.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase is read-only research. It creates artifacts only inside its own phase folder and touches no shipped runtime, no shared policy, and no other packet. (Runtime-affecting surfaces begin in Phase 3/4/7 and are inventoried there.)
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `cli-codex/SKILL.md`; confirm SOL/TERRA/LUNA + effort + speed flags and fan-out env
- [ ] Initialize `/deep:research` state (no-early-convergence) under the phase folder
- [ ] Load seed sources + enumerate research questions

### Phase 2: Core Implementation
- [ ] Batch 1 — SOL high/normal ×4 iterations
- [ ] Batch 2 — TERRA max/fast ×3 iterations
- [ ] Batch 3 — LUNA max/normal ×3 iterations
- [ ] Verify each candidate package/binary identity (npm resolves / repo maintained)

### Phase 3: Verification
- [ ] Synthesize deltas into `research.md` (per-question answers + citations)
- [ ] Write ranked build-vs-adopt recommendation + auth/config pattern + feature surface + headless flag
- [ ] `validate.sh` this phase; refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | 10 iterations recorded, no early stop | deep-research state ledger |
| Identity | Candidate packages resolve / repos maintained | npm view / WebFetch |
| Doc | `research.md` structure + citations | `validate.sh`, manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (GPT-5.6 SOL/TERRA/LUNA) | External | Green | No research run without it |
| `/deep:research` loop | Internal | Green | Fall back to manual iteration only if broken |
| WebFetch / WebSearch | External | Yellow | Blocklist/rate limits → widen queries |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: research inconclusive or executor unavailable.
- **Procedure**: research artifacts are additive and phase-local — discard `research.md` + `deep-research-state.jsonl` + `deltas/` + `logs/`; no shipped state to revert.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
