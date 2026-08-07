---
title: "Implementation Plan: Phase 2: matrix-execute"
description: "Bash dispatcher with 3-CLIs-in-parallel-per-scenario; 15 scenarios sequential; 120s timeout; per-cell logs + delta JSONL."
trigger_phrases: ["071/002 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/008-sk-doc-router-stress-test/002-matrix-execute"
    last_updated_at: "2026-05-05T15:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 2 plan authored"
    next_safe_action: "(Phase 2 complete)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase2-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: matrix-execute

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash dispatcher; 3 CLI subprocess invocations per scenario |
| **Framework** | Per-CLI delta JSONL + per-cell logs |
| **Storage** | logs/, deltas/, scripts/ subdirs |
| **Testing** | Side-effect scan (find -newer); residual rg |

### Overview
run-matrix.sh extracts the prompt from each scenario's Setup ``` block, dispatches 3 CLIs in parallel, captures stdout/stderr/exit/duration to logs and deltas. Methodology bug discovered + fixed mid-run via reflective framing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 15 scenarios from Phase 1 with reflective framing
- [x] 3 CLIs available + authenticated

### Definition of Done
- [x] All 45 cells executed
- [x] Zero unintended side-effects
- [x] One commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single bash script. Outer loop sequential (per scenario); inner block parallel (3 CLIs `&` + `wait`).

### Data Flow
```
extract prompt from Setup ``` block
 -> 3 CLI dispatches in parallel (codex via stdin, copilot inline, opencode via --format json)
   -> capture stdout/stderr/exit/duration
     -> append delta JSONL + write per-cell log
       -> next scenario
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] mkdir logs/, deltas/, scripts/
- [x] Author run-matrix.sh

### Phase 2: Core Implementation
- [x] Initial dispatch (with imperative prompts) — surfaced methodology bug
- [x] Patch all 15 scenarios with reflective framing
- [x] Reset deltas + logs
- [x] Re-dispatch — completed cleanly

### Phase 3: Verification
- [x] 45/45 cells captured
- [x] Side-effect scan clean
- [x] Commit on main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cell-level | Each dispatch exit code | timeout, &, wait |
| Aggregate | 45/45 deltas + logs | wc -l, find |
| Side-effect | Active-scope dir scan | find -newer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| codex/copilot/opencode CLIs | External | Green | Cannot dispatch matrix |
| Phase 1 scenarios | Internal | Green | Cannot extract prompts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: methodology bug, side-effects detected mid-run
- **Procedure**: stop dispatcher, reset deltas/logs, fix scenarios, re-run
- **Granularity**: full re-dispatch from scenario 1 (cheap; ~24 min wall-clock)
<!-- /ANCHOR:rollback -->
