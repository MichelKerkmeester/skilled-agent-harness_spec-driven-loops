---
title: "Implementation Summary: codex Write-Containment Guard"
description: "What was built for the codex post-dispatch write-containment guard, with verification evidence and the Part B finding."
trigger_phrases:
  - "implementation summary"
  - "codex write containment"
  - "containment guard"
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: codex Write-Containment Guard

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 038-cli-codex-write-containment |
| **Completed** | 2026-07-22 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A structural post-dispatch containment guard that closes the asymmetry between the codex and cli-opencode deep-loop dispatch branches. After a codex leaf runs, the guard diffs the git working tree for NEW changes outside the leaf's artifact directory, reverts exactly those paths, logs a `containment_violation` event, and fails the iteration fail-closed. The leaf's legitimate writes inside its artifact directory (iteration file, delta, state record) are never touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/write-containment.ts` | Created | Shared helper: snapshot / detect / revert / enforce + event builder |
| `runtime/scripts/fanout-run.cjs` | Modified | Codex worker: snapshot before dispatch, enforce after, fail-closed throw |
| `commands/deep/assets/deep-review-auto.yaml` | Modified | `if_cli_codex`: snapshot/enforce around `runAuditedExecutorCommand` |
| `commands/deep/assets/deep-research-auto.yaml` | Modified | `if_cli_codex`: snapshot/enforce around `runAuditedExecutorCommand` |
| `commands/deep/assets/deep-alignment-auto.yaml` | Modified | `if_cli_codex`: snapshot/enforce around `runAuditedExecutorCommand` |
| `runtime/tests/unit/write-containment.vitest.ts` | Created | Regression suite (cases a/b/c) over a real temp git repo |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard is a single pure helper (`write-containment.ts`) called from two integration shapes:

- **YAML `if_cli_codex` branches**: each heredoc snapshots the out-of-artifact dirty paths before `runAuditedExecutorCommand`, then calls `enforceWriteContainment` after; any violation reverts the paths, appends a `containment_violation` event to the per-iteration state log, and `process.exit(1)`s the iteration fail-closed.
- **`fanout-run.cjs` codex worker**: snapshots before `runLineageProcess`; after saving stdout it calls the helper; on a violation it appends the event to the orchestration ledger and throws a failure carrying `containmentViolation`, so the pool counts the lineage failed and applies its existing redispatch policy.

The helper fails open (returns `[]`) when git is unavailable, `repoRoot` is not a worktree, or `artifactDir` is outside the worktree — so hermetic tests (temp artifact dirs) and non-git environments are untouched.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Post-dispatch guard is the sole defense (Part A only) | Empirically, codex `workspace-write` covers the whole workspace; `-C` does not contain writes (Part B probe). A prompt-only boundary already failed once (351-line deletion); a structural revert is required. |
| Helper is pure and fail-open | The loop must never break because the guard could not run; git errors / non-worktree artifact dirs degrade to a no-op |
| Fanout enforcement gated on `kind === 'cli-codex'` | Native loops may legitimately write outside their lineage dir; the helper stays reusable for future cli-opencode parity |
| Scoped revert, never blanket clean | Tracked paths restored from HEAD; untracked paths removed individually; pre-existing dirty paths preserved via set subtraction |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Unit (helper) | Pass | snapshot/detect/revert/event over a real temp git repo (12/12) |
| Regression (a/b/c) | Pass | in-artifact pass; out-of-artifact revert+fail (modify + delete + untracked); pre-existing dirty untouched |
| Existing fanout suite compatibility | Pass | fanout-run.vitest.ts 72/72; 6 affected suites 196/196 |
| `node --check` worker | Pass | exit 0 |
| Heredoc syntax (3 YAMLs) | Pass | `node --check --input-type=module` on each extracted codex heredoc |
| `spec validate --strict` | Pass | Errors:0 |

### Part B Probe Result (NOT applied)
Bounded live probe against `codex exec` (codex-cli 0.144.6):
- `-C <artifactDir>` + `workspace-write`: outside READ succeeded; inside WRITE succeeded.
- `-C <artifactDir>` + `workspace-write`: outside WRITE succeeded (parent file overwritten, new file created outside artifact dir).

Conclusion: `-C` provides zero write-containment in `workspace-write`; there is no flag combination achieving read-anywhere + write-only-artifactDir. Part B deliberately not applied.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Detection is post-dispatch, not preventive** — a violating leaf still runs to completion; the guard reverts after. This is unavoidable because codex's sandbox cannot scope writes (Part B), and the structural fix is the revert-and-fail contract.
2. **Fanout guard is codex-only** — native / cli-opencode / cli-claude-code fan-out lineages are not enforced; extending the kind gate is a one-line change once those dispatch models are confirmed to stay within their artifact dir.
3. **Fail-open on git unavailability** — if git is absent or the cwd is not a worktree, the guard no-ops; containment then relies on the prompt boundary. This trade-off keeps the guard from ever breaking a loop it cannot reason about.

<!-- /ANCHOR:limitations -->
---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Consider sandbox scoping (Part B) as defense-in-depth | Not applied | Empirical probe showed `-C` does not contain writes; would be misleading defense-in-depth |
