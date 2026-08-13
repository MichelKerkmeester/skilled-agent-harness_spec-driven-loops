---
title: "Implementation Plan: Non-DeepSeek Optimization Research (read-only deep research)"
description: "Run a 10-iteration forced-depth read-only deep-research loop over pi-cache-optimizer's non-DeepSeek code path to produce a ranked optimization findings report."
trigger_phrases:
  - "non-deepseek optimization research plan"
  - "deep research pi-cache-optimizer"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/011-research-non-deepseek-optimization"
    last_updated_at: "2026-08-09T08:39:07Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Recorded the single-lineage fan-out research approach"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - "research/lineages/deepseek-flash/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-011-non-deepseek-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Non-DeepSeek Optimization Research (read-only deep research)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Read-only code research (no source edits) |
| **Workflow** | `/deep:research` `:auto`, single-lineage fan-out (`fanout-run.cjs`) |
| **Executor** | `cli-opencode` · `deepseek/deepseek-v4-flash` |
| **Testing** | Convergence report + `validate.sh --strict` |

### Overview
Run a 10-iteration, forced-depth (`--stop-policy max-iterations`) read-only deep-research loop over `pi-cache-optimizer/index.ts` and synthesize a ranked optimization findings report (`research/lineages/deepseek-flash/research.md`). Dispatched through the packet's own single-lineage fan-out runtime rather than the native per-iteration path, since the executor is a CLI model (not `native`/Opus). No edits to source during the loop — implementation is a separate follow-up decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target file identified (`pi-cache-optimizer/index.ts`) and executor confirmed (`cli-opencode` / `deepseek/deepseek-v4-flash`, DeepSeek provider authenticated)
- [x] Stop policy set (max-iterations = 10, forced depth, no early convergence stop)

### Definition of Done
- [x] `research/lineages/deepseek-flash/research.md` synthesized with ranked findings, provider matrix, and convergence report
- [x] At least 2 P0 findings spot-checked against real source
- [x] Packet validates `--strict`; whole `039` packet still validates `--recursive --strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage fan-out: one `lineageExecutor` entry (`kind: cli-opencode`, `count: 1`, `iterations: 10`) run through `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, which owns per-iteration CLI subprocess dispatch, state-log/delta writes, and per-lineage `research.md` synthesis. Every dispatch runs under a uniform write-containment guard: a not-in-HEAD out-of-scope path is preserved on disk, an in-HEAD breach is reverted (git-recoverable), applied identically regardless of executor kind.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Resolve artifact root, construct single-executor fan-out config, confirm DeepSeek provider auth

### Phase 2: Loop
- [x] Run 10 forced-depth research iterations over `pi-cache-optimizer/index.ts`

### Phase 3: Synthesis and Recovery
- [x] Merge findings → lineage `research.md`
- [x] Diagnose and recover a write-containment false-positive revert of unrelated concurrent-agent edits (`AGENTS.md` + 004 packet metadata) — root-caused, restored, documented
- [x] Author packet-root closure docs (this loop's own runtime path does not auto-seed them); reconcile and close
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | new-info ratio trend across 10 forced iterations | `deep-research-state.jsonl` telemetry |
| Evidence spot-check | 2 P0 findings' exact `index.ts` line citations | Direct `sed`/`grep` read against real source |
| Contract | packet validity | `validate.sh --strict` (this folder), `validate.sh --recursive --strict` (whole `039` packet) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode` CLI + DeepSeek direct provider auth | External | Green (confirmed via `opencode providers list`) | Loop cannot dispatch |
| `fanout-run.cjs` write-containment guard | Internal | Green, but coarse-grained (repo-wide git-dirty snapshot) | False-positive revert of unrelated concurrent edits (realized once; recovered) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A for the research artifacts — read-only research produces artifacts only, no source or runtime state mutated by the loop itself.
- **Procedure**: Remove the `research/` tree to fully retract this packet's output; no other cleanup needed. (The one real mutation incident — the containment guard's revert of `AGENTS.md`/004-packet files — was an unrelated concurrent dispatch's collision, already recovered; see `implementation-summary.md`.)
<!-- /ANCHOR:rollback -->
