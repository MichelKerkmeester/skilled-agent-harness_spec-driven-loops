---
title: "Implementation Summary: fan-out live-tools unblock"
description: "The shipped fan-out scheduler now resolves live-tool policy per executor, rejects unproven combinations before dispatch, fingerprints resolved invocations without secrets, and compiles deterministic Cartesian manifests without changing canonical persistence."
trigger_phrases:
  - "fan-out live-tools implementation"
  - "fanout live search shipped"
  - "fanout manifest compiler complete"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock"
    last_updated_at: "2026-07-20T19:48:41Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the dispatch-only live-tools and Cartesian manifest runtime change"
    next_safe_action: "Use adapter outputs in later durable-receipt work"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Fan-out Live-Tools Unblock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-fanout-live-tools-unblock |
| **Completed** | 2026-07-20 |
| **Level** | 2 |
| **Prompt Base** | `fe6ca3030917073f3b478bc044e10034dcc4394b` |
| **Execution Base** | `952060126baa2758ac6048049af2828985b9a8f8` |
| **Dependency** | Phase 004 child contracts complete at `2429f4c`, `64eb3a9`, and `9520601` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fan-out dispatch can now request proven live web search without replacing the scheduler. The config boundary normalizes omitted policy to `inherit`, exposes all four typed values, and rejects unsupported kind-policy cells before the pool, subprocess spawn, or persistence writes. Every executor kind resolves through a named adapter that returns the legacy command/input contract plus an effective config and a deterministic invocation fingerprint.

The manifest form accepts explicit models, branches, and replicas. It expands in model, branch, replica order into the existing single-lineage shape, preserves the legacy 256-lineage ceiling, rejects unsafe or colliding IDs, and then enters the unchanged budget, retry, lineage-directory, artifact-validation, and `runCappedPool` path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Added live-tool schema, exhaustive matrix, capability preflight, mutually exclusive manifest schemas, and deterministic compiler |
| `runtime/scripts/fanout-run.cjs` | Modified | Added per-kind adapters, top-level Codex search argv, executable-aware fingerprints, and pre-pool validation |
| `runtime/tests/unit/executor-config.vitest.ts` | Modified | Added enum, matrix, manifest, ceiling, collision, and legacy expansion coverage |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added argv, pooled live leaf, fingerprint, pre-spawn rejection, manifest pool, and legacy command coverage |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Reconciled completion state and linked verification evidence |
| `implementation-summary.md` | Created | Recorded implementation, compatibility, persistence, and verification receipts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The existing scheduler stayed authoritative. Both legacy executor lists and compiled manifests normalize to `LineageExecutor[]`; capability preflight runs immediately after expansion, before aggregate-budget work, waits, directory creation, `runCappedPool`, or any lineage spawn. Adapter-only metadata is destructured away by the worker and is not added to orchestration events, summaries, checkpoints, ledgers, lineage state, or fan-in artifacts.

The prompt pinned `fe6ca303...` as HEAD, while the worktree had advanced to `95206012...` for the completed phase-004 dependency. `fe6ca303...` is an ancestor, and the four runtime targets had no intervening changes, so the implementation used the later dependency-complete execution base without overwriting unrelated phase-003 worktree changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `cached` typed but unsupported for every kind | No stable shipped CLI contract proves cached-only search, so preflight fails closed instead of degrading silently |
| Support `live` for Codex and OpenCode only | Codex has the proven top-level `--search` form; OpenCode exposes its native live WebFetch runtime; other mappings remain unproven |
| Hash executable content when no explicit version is supplied | Fingerprints remain version-sensitive without spawning a second CLI process or including environment maps |
| Compile manifests into legacy lineages | This preserves pool, retries, budgets, lineage directories, salvage, summaries, and artifact validation |
| Return but do not persist the fingerprint | Durable dispatch receipts belong to the later persistence phase; this leaf changes dispatch only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline targeted suites | PASS, exit 0: 2 files and 126 tests before implementation |
| Final targeted suites | PASS, exit 0: 2 files and 141 tests; net 15 focused tests, with all 126 baseline tests still green |
| Focused behavioral proofs | PASS, exit 0: 6 selected proofs passed, 135 unrelated tests skipped |
| JavaScript syntax | PASS, exit 0 |
| TypeScript typecheck | PASS, exit 0 |
| OpenCode alignment verifier | PASS, exit 0: 138 files scanned, 0 findings |
| Comment hygiene | PASS, exit 0 for all four runtime targets |
| Whitespace/error diff check | PASS, exit 0 |
| Persistence-shape diff | PASS: zero added canonical event assignments, persistence writer calls, checkpoint/status-ledger fields, or fan-in artifacts |
| Strict spec validation | PASS, exit 0: Errors 0, Warnings 0 |

### Exact Commands

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/executor-config.vitest.ts ../../system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts
```

Baseline result: `Test Files 2 passed (2); Tests 126 passed (126)`. Final result: `Test Files 2 passed (2); Tests 141 passed (141)`.

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/executor-config.vitest.ts ../../system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts -t 'places the live-search flag before the exec subcommand|completes a hermetic live cli-codex leaf with top-level search argv|rejects an unsupported policy before the pool or executor spawn is touched|feeds a deterministic 2-model by 3-branch by 2-replica manifest into the existing pool|expands models by branches by replicas in stable model-first order|fingerprints only the effective allowlist and prompt digest'
```

Result: `Test Files 2 passed (2); Tests 6 passed | 135 skipped (141)`.

```bash
node --check .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
```

Result: exit 0.

```bash
cd .opencode/skills/system-deep-loop/runtime
../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json
```

Result: exit 0.

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-deep-loop/runtime
```

Result: exit 0; 138 files scanned; 0 errors and 0 warnings.

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock --strict
```

Result: exit 0; Errors 0; Warnings 0.

### Legacy-Parity Evidence

- The pre-change suites passed 126 tests; the final suites passed those same paths plus 15 focused additions.
- Omitted `liveTools` and explicit `inherit` resolve identical `command`, `args`, `input`, and invocation fingerprint fixtures.
- Legacy `executors[]` plus `count` retains `glm-1`, `glm-2`, `native` label order and `count: 1` scheduler items.
- Existing concurrency, retry, budget, timeout, salvage, heartbeat, command-prompt, summary, and artifact tests remained green.
- `runCappedPool`, `fanout-pool.cjs`, retry classification, budget helpers, lineage directory creation, summary writes, and artifact validation were not changed.

### Dispatch Proofs

- The direct Codex adapter fixture resolves argv index 0 to `--search` and index 1 to `exec`.
- A hermetic pooled Codex leaf captured the same first two argv entries, consumed the prompt on stdin, produced expected artifacts, and completed with summary `{ total: 1, succeeded: 1, failed: 0 }`.
- The unsupported `cli-opencode` plus `cached` fixture exited 3 and produced no spawn marker, lineage directory, orchestration ledger, or summary.
- Two models by three branches by two replicas produced exactly 12 stable, unique IDs and completed through the existing pool in deterministic order.

### Persistence-Shape Diff

No canonical persistence changed. The production diff adds no event name, `appendFanoutStatusLedger` call, `writeOrchestrationSummary` field, checkpoint field, status-ledger shape, lineage-state field, result envelope, or fan-in artifact. `effectiveConfig` and `invocationFingerprint` remain adapter return values only.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cached search remains unavailable.** The value is accepted by the typed schema but rejected by capability preflight for every executor kind until a stable CLI contract exists.
2. **Fingerprints are not durable receipts.** The adapter returns them to callers, but this leaf deliberately does not persist them.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None in runtime scope. The actual execution base was the dependency-complete descendant `95206012...`, not the prompt-stated HEAD `fe6ca303...`; scoped runtime files were identical across that range.
<!-- /ANCHOR:deviations -->
