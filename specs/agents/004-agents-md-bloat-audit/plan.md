---
title: "Implementation Plan: AGENTS.md Bloat Audit (read-only deep research)"
description: "Run a 5-iteration read-only deep-research loop over the root AGENTS.md to produce a ranked bloat-reduction findings report."
trigger_phrases:
  - "agents.md bloat audit plan"
  - "deep research bloat"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/004-agents-md-bloat-audit"
    last_updated_at: "2026-08-08T08:58:31Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the read-only audit approach"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "specs/agents/004-agents-md-bloat-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-004-bloat-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: AGENTS.md Bloat Audit (read-only deep research)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Read-only documentation audit (no code) |
| **Workflow** | `/deep:research` loop, single-lane `pi` fan-out |
| **Executor** | cli-pi · `deepseek-v4-flash` → opencode-go |
| **Testing** | Convergence report + `validate.sh --strict` |

### Overview
Run a 5-iteration, read-only deep-research loop over the root `AGENTS.md` and synthesize a ranked bloat-reduction findings report (`research/research.md`). No edits to `AGENTS.md` during the loop — implementation is out of scope for this packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target file identified (`AGENTS.md`) and executor confirmed (cli-pi / deepseek-v4-flash)
- [x] Stop policy set (max-iterations = 5, forced depth)

### Definition of Done
- [x] `research/research.md` synthesized with ranked findings + preserve set
- [x] Convergence report emitted
- [x] Packet validates `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized deep-research state under `research/`: per-iteration `iterations/`, `deltas/`, a findings registry, and a merged `research.md`. A single `pi` lineage runs the leaf iterations; the loop reduces state and checks convergence between them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Seed spec.md, resolve artifact dir, acquire lock

### Phase 2: Loop
- [x] Run 5 read-only research iterations over AGENTS.md

### Phase 3: Synthesis
- [x] Merge findings → `research/research.md`; reconcile packet docs and close
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | new-info ratio decline across iterations | `convergence.cjs` telemetry |
| Contract | packet validity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode-go provider (cli-pi) | External | Green | Loop cannot dispatch (confirmed working) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A — read-only research produces artifacts only.
- **Procedure**: Remove the `research/` artifacts; no source or runtime state is mutated by the audit.
<!-- /ANCHOR:rollback -->
