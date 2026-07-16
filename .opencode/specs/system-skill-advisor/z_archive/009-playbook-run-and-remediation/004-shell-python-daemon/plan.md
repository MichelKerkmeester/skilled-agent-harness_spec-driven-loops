---
title: "Implementation Plan: Shell/Python/Daemon Waves (Playbook Run Phase 004)"
description: "Assign waves to CLI executors (devin PC/CP/AU, opencode SC/AI/LC), run OP locally, isolate Devin in a git worktree under dangerous mode, and verify all CLI evidence including re-running PC-004/005 in the main environment."
trigger_phrases:
  - "playbook shell python daemon plan"
  - "028 phase 004 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/004-shell-python-daemon"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Documented delegation + verification plan"
    next_safe_action: "Rollup"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Shell/Python/Daemon Waves (Playbook Run Phase 004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (shim/regression/bench), Node (daemon), MCP tools |
| **Framework** | cli-devin (SWE-1.6), cli-opencode (DeepSeek), local operator |
| **Storage** | SQLite skill-graph, JSONL fixtures |
| **Testing** | regression suite, bench runner, advisor_validate slices |

### Overview
Dispatch two CLI executors concurrently (one per quota pool, operator-authorized): Devin runs the python/compat/daemon waves inside an isolated worktree under dangerous mode; OpenCode runs the MCP-backed scorer/indexing/lifecycle waves. Operator-H5 runs locally. All CLI evidence is verified, and the two FAIL findings are reproduced in the main environment.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] CLI evidence verified (PC-004/005 re-run in main)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Delegate-verify: CLI executors run waves; operator verifies evidence and reproduces failures.

### Key Components
- **cli-devin worktree dispatch**: SWE-1.6, `--permission-mode dangerous`, `--dir /tmp/devin-wt`
- **cli-opencode dispatch**: `deepseek/deepseek-v4-pro`, full MCP runtime
- **local operator**: OP-001..003 + verification re-runs

### Data Flow
CLI agents read scenario files, run documented commands, write evidence + RESULTS.md to `/tmp`; operator reads RESULTS.md, spot-verifies, and reproduces FAILs in main.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Findings recorded, not remediated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill_advisor_regression.py` | P0 regression harness | observed only | PC-004 main env: 54/96, P0 50%, all gates fail |
| `skill_advisor_bench.py` | latency bench | observed only | PC-005: warm_p95 + cold_p95 gates fail; `--dataset` undocumented in scenario |
| scorer lane weights | semantic_shadow weight | observed only | live weight 0.05 vs SC-004/005 scenario assumption of shadow-only/0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Assign waves per operator direction (maximize delegation)
- [x] Read SK skills (cli-devin, cli-opencode, sk-prompt-models) per CLI-dispatch mandate
- [x] Compose RCAF + pre-planned prompt files per executor

### Phase 2: Core Implementation
- [x] Dispatch OpenCode (DeepSeek) for SC/AI/LC — full MCP runtime
- [x] First Devin auto-mode dispatch BLOCKED (non-interactive needs dangerous)
- [x] Create isolated worktree + symlink node_modules/dist; re-dispatch Devin dangerous mode (operator-approved)
- [x] Run OP-001..003 locally

### Phase 3: Verification
- [x] Read both RESULTS.md; verify worktree git status clean (no tracked mutation)
- [x] Reproduce PC-004 + PC-005 FAIL in main environment
- [x] Cross-check SC-005 accuracy vs NC-003 (corroborated)
- [x] Record 32 verdicts + findings
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Delegated | PC/CP/AU (devin), SC/AI/LC (opencode) | cli-devin, cli-opencode |
| Local | OP-001..003 | advisor_status (healthy path) |
| Verification | PC-004/005 reproduction | python regression + bench in main |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| devin auth (SWE-1.6 free tier) | External | Green | PC/CP/AU delegation |
| opencode DeepSeek provider | External | Green | SC/AI/LC delegation |
| git worktree | Internal | Green | Devin isolation |
| disposable+daemon harness | Internal | Red | 13 SKIP scenarios |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Devin mutates the main checkout, or evidence is unusable.
- **Procedure**: Worktree isolates writes; `git worktree remove /tmp/devin-wt` discards them. Re-run any wave locally if CLI evidence is suspect.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Dispatch (devin ‖ opencode) + OP local ──► Verify (reproduce FAILs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001-003 | Dispatch |
| Dispatch | Setup | Verify |
| Verify | Dispatch | Rollup |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 15 min |
| Dispatch | Med | 20 min (concurrent CLI + worktree) |
| Verification | Med | 15 min |
| **Total** | | **~50 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Devin confined to isolated worktree
- [x] /tmp-only write guard in prompts
- [x] No `--dangerously-skip-permissions` for opencode

### Rollback Procedure
1. `git worktree remove /tmp/devin-wt` (discards any worktree writes)
2. Confirm main `git status` shows only daemon-churned graph-metadata.json (no source edits)
3. Re-run any suspect wave locally

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
