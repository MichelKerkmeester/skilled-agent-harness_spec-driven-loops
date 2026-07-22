---
title: "Feature Specification: codex Write-Containment Guard for Deep-Loop Dispatches"
description: "Structural post-dispatch guard that reverts and fails any codex leaf write outside its artifact directory, closing the asymmetry with the cli-opencode dispatch branch."
trigger_phrases:
  - "codex write containment"
  - "deep-loop dispatch guard"
  - "out-of-scope revert"
  - "containment_violation"
  - "codex sandbox"
  - "workspace-write"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: codex Write-Containment Guard for Deep-Loop Dispatches

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Track** | system-deep-loop |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop runtime dispatches `codex exec` review/research/alignment iterations with `--sandbox workspace-write` and NO structural write-containment. The only thing keeping a codex leaf from editing files outside its artifact directory is prose in the prompt. This is asymmetric with the cli-opencode dispatch branch, which carries structural guards (isolated-worktree check, clean-primary check, "changes confined to artifact_dir" check, recovery-baseline commit). Because of this gap, a real deep-review run let a codex leaf DELETE 351 lines from a file that was not in the review scope.

### Purpose
Add a structural post-dispatch containment guard so a codex leaf can NEVER leave durable edits outside its artifact directory undetected. After each codex iteration, compute the git working-tree changes outside the artifact dir, subtract paths that were already dirty before dispatch, and for any NEW out-of-scope change: revert exactly those paths, record a `containment_violation` event, and fail the iteration fail-closed.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shared, unit-tested helper under `runtime/lib/deep-loop/` that snapshots out-of-artifact dirty paths, detects NEW out-of-scope violations, and reverts exactly those paths (tracked restored from HEAD; untracked removed).
- Wiring the guard into all four codex dispatch sites: the three command YAML `if_cli_codex` branches (deep-review/research/alignment) and the `fanout-run.cjs` codex lineage worker.
- Failing a violating iteration fail-closed through the existing per-iteration failure/redispatch path and appending a `containment_violation` event to the loop state log.
- Regression tests covering: (a) in-artifact write passes; (b) out-of-artifact tracked modification is detected, reverted, and fails; (c) a pre-existing out-of-scope dirty file is NOT touched.

### Out of Scope
- Sandbox write-scoping via codex flags (`-C/--add-dir`) — empirically NOT viable (see §6 Risks); documented here as a deliberate non-application.
- Native / cli-opencode / cli-claude-code lineage enforcement in `fanout-run.cjs` — the helper is reusable, but the fanout worker gates enforcement on `kind === 'cli-codex'` to avoid risk to lineage kinds that may legitimately write outside their artifact dir.
- Changing the leaf's `workspace-write` sandbox posture (the leaf must still write its iteration artifacts).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/deep-loop/write-containment.ts` | Create | Shared containment helper (snapshot/detect/revert/enforce). |
| `runtime/scripts/fanout-run.cjs` | Modify | Codex worker: snapshot before dispatch, enforce after, fail-closed. |
| `commands/deep/assets/deep-review-auto.yaml` | Modify | Wrap `if_cli_codex` dispatch with snapshot/enforce. |
| `commands/deep/assets/deep-research-auto.yaml` | Modify | Wrap `if_cli_codex` dispatch with snapshot/enforce. |
| `commands/deep/assets/deep-alignment-auto.yaml` | Modify | Wrap `if_cli_codex` dispatch with snapshot/enforce. |
| `runtime/tests/unit/write-containment.vitest.ts` | Create | Regression tests (cases a/b/c) over a real temp git repo. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared helper snapshots out-of-artifact dirty paths before dispatch | `snapshotOutOfScopeDirtyPaths` returns tracked+untracked dirty paths outside `artifactDir`, [] on git failure |
| REQ-002 | Helper detects only NEW out-of-scope violations post-dispatch | Pre-existing dirty paths are subtracted; only paths dirtied by the leaf are returned |
| REQ-003 | Helper reverts exactly the violating paths | Tracked files restored from HEAD; untracked files removed; never a blanket `git clean` |
| REQ-004 | Guard applied at all four codex dispatch sites | 3 YAML `if_cli_codex` branches + `fanout-run.cjs` codex worker call the helper |
| REQ-005 | Violating iteration fails fail-closed | Revert + `containment_violation` event + iteration counted as failure (no success) |
| REQ-006 | In-artifact writes never flagged | Writes inside `artifactDir` (iteration file / delta / state record) are always excluded |
| REQ-007 | Guard fails open when it cannot reason about git | Non-git cwd, missing git binary, or artifact dir outside the worktree → no-op, never breaks the loop |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Existing fanout/test suites still pass | The guard auto-skips in hermetic tests (artifact dir outside the repo) — no regressions |
| REQ-009 | Comment hygiene | No spec paths / packet ids / task ids embedded in code comments |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A codex leaf that writes only inside its artifact dir completes normally (no false violation).
- **SC-002**: A codex leaf that modifies/deletes a tracked file outside its artifact dir is detected, that file is restored to HEAD, the iteration fails, and a `containment_violation` event is logged.
- **SC-003**: A pre-existing out-of-scope dirty file present before dispatch is never reverted.
- **SC-004**: All affected vitest suites pass; `spec validate --strict` reports Errors:0.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sandbox scoping (`-C/--add-dir`) assumed to contain writes | False sense of containment | Empirically probed: `-C <artifactDir>` + `workspace-write` still allowed outside writes (README overwritten, new file created outside). Part B NOT applied; Part A is the sole defense. |
| Risk | Guard breaks non-codex lineage kinds | Native loop may write outside artifact dir legitimately | Fanout worker gates enforcement on `kind === 'cli-codex'`; helper reusable for future parity |
| Risk | Guard breaks hermetic tests that spawn the worker | Test flakiness / file reverts in repo | Auto-skip when artifact dir is outside the git worktree; fail-open on git errors |
| Dependency | git CLI present at dispatch time | Cannot snapshot/revert | Fail-open no-op when git unavailable; logged to stderr |

### Part B Probe Evidence (NOT applied)
A bounded live probe against `codex exec` (codex-cli 0.144.6) confirmed:
1. `-C <artifactDir>` + `workspace-write`: a read of `../README_ROOT.md` (outside artifact dir) SUCCEEDED, and a write to `./probe-out.txt` (inside) SUCCEEDED.
2. `-C <artifactDir>` + `workspace-write`: an outside write `printf ... > ../README_ROOT.md` SUCCEEDED (original content lost) and `../evil-new-file.txt` was CREATED outside the artifact dir.

Conclusion: codex's `workspace-write` sandbox covers the whole workspace, NOT the `-C` dir, so `-C` provides zero write-containment. There is no flag combination achieving read-anywhere + write-only-artifactDir. Part B is deliberately not applied; the post-dispatch guard (Part A) is the real and sufficient defense.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the guard extend to cli-opencode / cli-claude-code fan-out lineages for parity? **RESOLVED: Deferred** — the fanout worker gates on `kind === 'cli-codex'` (the unguarded path) to avoid risk to lineage kinds that may legitimately write outside their artifact dir; the helper is reusable when that is validated.
- Could codex sandbox flags contain writes as defense-in-depth? **RESOLVED: No** — the live probe (§6) proved `-C` does not contain writes in `workspace-write`.

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
