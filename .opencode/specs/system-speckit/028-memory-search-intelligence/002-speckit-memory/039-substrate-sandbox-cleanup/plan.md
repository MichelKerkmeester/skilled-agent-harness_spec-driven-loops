---
title: "Implementation Plan: Substrate Stress Harness Sandbox Cleanup [template:level_2/plan.md]"
description: "Add a sandbox cleanup to the substrate stress harness without breaking the vitest runner that reads the summary TSV after the subprocess exits. Always remove the throwaway hermetic code-graph DB, add a --clean flag for standalone runs that removes the whole run dir and the empty parent, and move the common-path auto-clean into the test afterAll so it reaps only after the TSV is consumed. All cleanup is best-effort and fails closed on a shared parent."
trigger_phrases:
  - "substrate sandbox cleanup"
  - "substrate stress harness"
  - "hermetic code graph db cleanup"
  - "sandbox clean flag"
  - "vitest afterall sandbox reap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/039-substrate-sandbox-cleanup"
    last_updated_at: "2026-07-04T17:50:58.595Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented the cleanupSandbox helper, the --clean flag, and the test afterAll reap"
    next_safe_action: "Revert the two files if a future run needs the persisted sandbox evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Substrate Stress Harness Sandbox Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM harness (`.mjs`), TypeScript vitest test (`.vitest.ts`) |
| **Framework** | spec-kit substrate stress harness and its vitest runner |
| **Storage** | Filesystem sandbox under `_sandbox/24--local-llm-query-intelligence/` at the repo root, no schema |
| **Testing** | `node --check`, comment-hygiene, a standalone `--clean` run, and `npm run stress:substrate` |

### Overview
The substrate stress harness writes its evidence and scratch into `_sandbox/24--local-llm-query-intelligence/` at the repository root and nothing removes it, so every run leaves a clutter folder. The hermetic code-graph DB must stay inside the repo root because the launcher path guard rejects an out-of-repo DB directory, so the write location is fixed and only cleanup can be added. The naive in-harness `finally` delete is wrong because the vitest runner reads the summary TSV after the subprocess exits, so deleting the run dir inside the run would remove the TSV before the test reads it. This plan adds a `cleanupSandbox({ clean })` helper called in the `main()` `finally` block that always removes the throwaway hermetic code-graph DB, a `--clean` flag (default false) that also removes the whole run dir and the now-empty `_sandbox/` parent for standalone manual runs, and a test `afterAll` that reaps the sandbox only after the suite has read the TSV. Every cleanup is best-effort so it never fails a run, and the `_sandbox/` parent removal fails closed when the parent is shared or non-empty.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-005)
- [x] Tests passing (`npm run stress:substrate`: Test Files 1 passed (1), Tests 1 passed (1); `node --check` OK; comment-hygiene exit 0 on both files)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Best-effort cleanup at the end of a run plus a test-driven reap. The harness always removes the throwaway hermetic code-graph DB and, under `--clean`, the whole sandbox run dir and the empty parent. The common-path auto-clean lives in the test `afterAll`, which runs only after the suite has consumed the summary TSV, so the usual runner leaves no sandbox while the TSV stays present during the run. The write location is unchanged, so the hermetic DB still resolves inside `REPO_ROOT` for the launcher path guard.

### Key Components
- **`run-substrate-stress-harness.mjs` cleanup**: the `SANDBOX_RUN_DIR` constant naming the run dir once, the `cleanupSandbox({ clean })` helper that always removes `.tmp-cg-db/` and optionally the run dir and the empty `_sandbox/` parent, and the `main()` `finally` call.
- **`run-substrate-stress-harness.mjs` CLI**: the new `--clean` flag parsed in `parseArgs`, defaulting to false, for standalone manual runs.
- **`substrate-runner-harness.vitest.ts` reap**: the `afterAll` import and the `afterAll` cleanup that removes the run dir and the empty parent after the suite reads the TSV.

### Data Flow
The harness writes its evidence and scratch and the throwaway hermetic code-graph DB into the sandbox under the repo root. At the end of the run the `main()` `finally` calls `cleanupSandbox({ clean })`, which always removes the hermetic DB. When `--clean` is passed it also removes the run dir and then the now-empty `_sandbox/` parent. When the test is the runner it does NOT pass `--clean`, reads the summary TSV after the subprocess exits, and only then reaps the run dir and the empty parent in `afterAll`. Every removal is best-effort and the parent removal fails closed on a shared or non-empty parent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-substrate-stress-harness.mjs` `main()` `finally` | Exits the run with no sandbox cleanup, leaving the run dir and the hermetic DB at the repo root | call `cleanupSandbox({ clean })` so the hermetic DB is always removed and the run dir is removed under `--clean` | `node --check` OK, a standalone `--clean` run exits 0 and the `_sandbox` folder is gone afterward |
| `run-substrate-stress-harness.mjs` `parseArgs` | Parses the existing CLI flags with no `--clean` | add a `--clean` flag defaulting to false for standalone manual runs that do not need the persisted evidence | the standalone `--clean` run is accepted and reaps the whole sandbox |
| `run-substrate-stress-harness.mjs` sandbox path | The run dir path is implicit in the write sites | add a `SANDBOX_RUN_DIR` constant naming `_sandbox/24--local-llm-query-intelligence/` once and reuse it in the cleanup | the cleanup removes the same path the harness wrote |
| `_sandbox/` parent removal | The parent is never removed and accumulates | remove the now-empty parent with an `rmdir` that fails closed when the parent is shared or non-empty | a shared or non-empty parent is left in place; an empty parent is removed after a `--clean` or test run |
| Hermetic code-graph DB (`.tmp-cg-db/`) under `REPO_ROOT` | Created inside the repo root for the launcher path guard and never read back | always remove it at the end of a run, best-effort | the DB is gone after a run and a missing DB is a no-op |
| `substrate-runner-harness.vitest.ts` `afterAll` | Reads the summary TSV after the subprocess exits but never reaps the sandbox | add the `afterAll` import and an `afterAll` that removes the run dir and the empty parent after the TSV is read | `npm run stress:substrate` passes and the `_sandbox` folder is gone after the run |

Required inventories:
- Same-class producers: `rg -n 'SANDBOX|_sandbox|tmp-cg-db|REPO_ROOT' .opencode/skills/system-spec-kit/mcp_server/stress_test/substrate`.
- Consumers of the sandbox path: `rg -n 'summary.tsv|24--local-llm-query-intelligence|cleanupSandbox' .opencode/skills/system-spec-kit/mcp_server/stress_test/substrate`.
- Matrix axes: a standalone run with `--clean` and without, a test run that reads the TSV before reaping, a missing hermetic DB, a shared non-empty `_sandbox/` parent, and an interrupted run.
- Algorithm invariant: the cleanup never runs before the test reads the TSV, the hermetic DB is always reaped, every removal is best-effort, and the `_sandbox/` parent removal fails closed on a shared or non-empty parent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm where the harness writes its evidence, scratch, and the hermetic code-graph DB, and that the DB must stay inside `REPO_ROOT`
- [x] Confirm the test reads the summary TSV after the subprocess exits, so the run-dir cleanup must not run inside the harness when the test is the runner
- [x] Name the run dir once with a `SANDBOX_RUN_DIR` constant

### Phase 2: Core Implementation
- [x] Add the `--clean` flag to `parseArgs`, defaulting to false
- [x] Add the `cleanupSandbox({ clean })` helper that always removes the hermetic DB and, under `clean`, removes the run dir and the now-empty `_sandbox/` parent, all best-effort
- [x] Call `cleanupSandbox` in the `main()` `finally` block
- [x] Add the `afterAll` import and the `afterAll` reap in `substrate-runner-harness.vitest.ts` so the test cleans the sandbox after reading the TSV, without passing `--clean`

### Phase 3: Verification
- [x] `node --check run-substrate-stress-harness.mjs` reports OK
- [x] Comment-hygiene passes on both files (exit 0)
- [x] A standalone `node <harness> --clean --scenarios 410 --no-stderr-log` run exits 0 and the `_sandbox` folder is fully removed afterward
- [x] `npm run stress:substrate` reports the suite passing and the `_sandbox` folder is gone after the run
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | The harness parses with no syntax errors and both files carry no artifact ids | `node --check run-substrate-stress-harness.mjs`, `check-comment-hygiene.sh` via python3 |
| Integration | A standalone `--clean` run exits 0 and removes the whole sandbox; the test reads the TSV during the run and reaps the sandbox in `afterAll` | `node <harness> --clean --scenarios 410 --no-stderr-log`, `npm run stress:substrate` over `substrate-runner-harness.vitest.ts` |
| Manual | After both the standalone and the test runs the `_sandbox` folder is gone, and a shared non-empty parent is left in place | inspect the working tree after each run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The summary TSV at the sandbox evidence path | Internal | Green | The test reads it after the subprocess exits, so the cleanup must reap only afterward |
| The hermetic code-graph DB inside `REPO_ROOT` and its launcher path guard | Internal | Green | The write location is fixed, so cleanup is the only lever and the DB cannot be relocated out of the repo root |
| The `vitest.stress.config.ts` runner for `substrate-runner-harness.vitest.ts` | Internal | Green | `npm run stress:substrate` runs the suite that proves the test still reads the TSV and reaps the sandbox |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future run needs the persisted sandbox evidence, or the cleanup interferes with a run.
- **Procedure**: Git revert the two changed files. The cleanup is best-effort and additive, so reverting restores the prior behavior where the harness leaves the sandbox in place, with no data migration to reverse.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Core Implementation | Low | 1-2 hours |
| Verification | Low | 0.5-1 hour |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The cleanup is best-effort and never fails a run
- [x] The run-dir removal is gated behind `--clean`, which the test never passes
- [x] The `_sandbox/` parent removal fails closed on a shared or non-empty parent

### Rollback Procedure
1. Git revert `run-substrate-stress-harness.mjs` and `substrate-runner-harness.vitest.ts`
2. Confirm the harness parses with `node --check`
3. Confirm `npm run stress:substrate` still passes against the reverted files

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds best-effort filesystem cleanup with no schema or persisted-data migration
<!-- /ANCHOR:enhanced-rollback -->

---
