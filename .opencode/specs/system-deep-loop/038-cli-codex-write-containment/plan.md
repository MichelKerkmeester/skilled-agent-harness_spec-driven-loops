---
title: "Implementation Plan: codex Write-Containment Guard"
description: "Plan for the shared post-dispatch containment helper and its wiring into the four codex dispatch sites."
trigger_phrases:
  - "implementation"
  - "plan"
  - "codex write containment"
  - "dispatch guard"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: codex Write-Containment Guard

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + YAML-embedded Node (`.cjs` worker) |
| **Surface** | OpenCode system code (`.opencode/` tree) |
| **Testing** | Vitest over a real temp git repo |

### Overview
Introduce a pure, git-backed helper that treats the artifact directory as the only legal write surface for a codex leaf. Snapshot dirty paths outside it before dispatch; after dispatch, diff for NEW out-of-scope changes; revert exactly those paths and fail the iteration. Wire it into the three command YAML `if_cli_codex` branches and the `fanout-run.cjs` codex lineage worker.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem and scope documented (spec.md)
- [x] Four dispatch sites located and read
- [x] Part B viability probed empirically

### Definition of Done
- [x] All acceptance criteria met
- [x] Affected vitest suites + new regression tests pass
- [x] `node --check` on the modified worker
- [x] `spec validate --strict` Errors:0

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Helper API (`write-containment.ts`)
- `snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir })` → `string[]` of repo-relative dirty paths outside the artifact dir (tracked modified/deleted + untracked). Fail-open: `[]` on git error or when `artifactDir` is outside the git worktree.
- `detectNewOutOfScopeViolations({ repoRoot, artifactDir, preDispatchDirtyPaths })` → `ContainmentViolation[]` (current out-of-scope minus the pre-dispatch set).
- `revertOutOfScopeViolations({ repoRoot, violations })` → tracked restored from HEAD via `git checkout HEAD -- <path>`; untracked (not in HEAD) removed by scoped `fs.rmSync` on the specific path only.
- `enforceWriteContainment({ repoRoot, artifactDir, preDispatchDirtyPaths, stateLogPath?, iteration?, label? })` → detects, reverts, emits a `containment_violation` JSONL event (when `stateLogPath` given), returns `{ violations, revertResult, event }`.

### Integration
- **YAML `if_cli_codex` branches**: snapshot before `runAuditedExecutorCommand`; call `enforceWriteContainment` after; `process.exit(1)` on any violation (fail-closed). The `enforce` call appends the event to the per-iteration state log.
- **`fanout-run.cjs` codex worker**: snapshot before `runLineageProcess`; after saving stdout, call the helper; on violation, append the event to the orchestration ledger and throw a failure that carries `containmentViolation` so the pool counts it failed and applies redispatch policy. Gated on `lineage.kind === 'cli-codex'`.

### Safety invariants
- Never a blanket `git clean`; only the specific violating paths are touched.
- Pre-existing out-of-scope dirty paths are never reverted (set subtraction).
- Auto-skip when `artifactDir` is outside the git worktree (hermetic tests) or git is unavailable.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Helper
- [x] Create `write-containment.ts` with snapshot/detect/revert/enforce + event builder.

### Phase 2: Integration
- [x] Wire guard into `fanout-run.cjs` codex worker.
- [x] Wire guard into the three YAML `if_cli_codex` branches.

### Phase 3: Verification
- [x] Add `write-containment.vitest.ts` regression suite (cases a/b/c).
- [x] Run affected vitest suites; run `node --check`; run `spec validate --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (pure helper) | snapshot/detect/revert/event over a real temp git repo | Vitest |
| Regression | cases (a) in-artifact pass, (b) out-of-artifact revert+fail, (c) pre-existing dirty untouched | Vitest |
| Existing suite compatibility | fanout cli-codex adapter tests unchanged (auto-skip) | Vitest |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git CLI | External | Green | Guard degrades to fail-open no-op; containment relies on Part A only |
| codex `workspace-write` posture | External | Green | Leaf must keep write access to its artifact dir |
| tsx / `--experimental-strip-types` | Internal | Green | Heredocs + `.cjs` dynamic-import of the `.ts` helper |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Guard produces false positives that block legitimate codex iterations, or revert touches wrong paths.
- **Procedure**: Revert the changes to the four dispatch sites and delete the helper + test file. The guard is additive; removing it restores the prior prompt-only boundary. The orchestrator owns git, so rollback is a revert of these files only.

<!-- /ANCHOR:rollback -->
