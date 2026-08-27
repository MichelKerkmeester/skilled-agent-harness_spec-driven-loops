---
title: "Feature Specification: better-sqlite3 Version + Node-ABI Alignment"
description: "Resolve the dependency-seams failure: the runtime pins better-sqlite3 12.10.0 while system-spec-kit ships 12.11.1, an ABI hazard when both skills load native bindings in one process — and the Node runtime itself shifted 25.x to 26.x mid-session, so a one-shot rebuild goes stale. Decide the canonical version and a Node-ABI strategy that survives bumps."
trigger_phrases:
  - "better-sqlite3 version alignment"
  - "dependency-seams abi safety"
  - "node abi rebuild strategy"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T12:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Realpath'd dependency-seams base; passes 6/6"
    next_safe_action: "Commit 001; push both 019 children to v4 + main"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root cause is a git-worktree symlink artifact, not version drift; fixed by realpath-ing the comparison base."
      - "better-sqlite3 12.10.0/12.11.1 drift is deferred as a separately-scoped main-checkout-wide native change."
---
# Feature Specification: better-sqlite3 Version + Node-ABI Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-26 |
| **Decision** | Root cause is a git-worktree symlink artifact, not version drift; fix = realpath the comparison base (no dependency change) |
| **Failing test** | `tests/unit/dependency-seams.vitest.ts` — now passes 6/6 |
| **Parent Spec** | ../spec.md |
| **Successor** | 002-command-rollout-mode-resolution |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`dependency-seams` had two assertions failing — that `better-sqlite3`/`zod`/`tsx` resolve from the runtime's own `node_modules`, and that the `tsx` loader bare-resolves there. The original hypothesis (packet 018 triage) was a native-dependency version drift: the runtime resolves `better-sqlite3@12.10.0` while system-spec-kit ships `12.11.1`, an ABI hazard when both load in one process. Investigation falsified that hypothesis. The failing assertions compare `require.resolve()` output (which **follows symlinks** and returns a realpath) against a raw path built from `import.meta.url`. When the tree is a **git worktree**, `runtime/node_modules` is a symlink to the main checkout, so the resolved realpath (main checkout) never starts with the raw worktree path — the assertion fails *only inside a worktree* and passes in the main checkout. The version-parity assertion (test #3) passes throughout, because `PINNED` (12.10.0) equals the runtime's installed version. The `12.10.0` vs `12.11.1` drift is real but is **not** what this test measures, and — because `node_modules` is a symlink — bumping it here would mutate the main checkout's tree for every worktree and the live MCP-adjacent runtime. That change is deliberately out of scope; it is tracked separately.

### Purpose

Make `dependency-seams` correct under git worktrees by comparing realpath against realpath, so it passes in both a worktree and the main checkout while still catching a genuine sibling-skill reach-in. No dependency or native-binding change.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Diagnose the actual `dependency-seams` failure (done: git-worktree symlink artifact, not version drift).
- Harden the two failing assertions to realpath the runtime-`node_modules` comparison base, so the prefix check is apples-to-apples with the symlink-followed `require.resolve()` output.
- Verify `dependency-seams` passes 6/6 with no production or dependency change.

### Out of Scope

- The rollout-mode failure (child 002).
- Bumping `better-sqlite3` 12.10.0 → 12.11.1 / `PINNED` — the real but separately-scoped ABI-drift item. Not done here because the symlinked `node_modules` makes it a main-checkout-wide native change, not a worktree-local one.
- Any Node-ABI auto-rebuild guard — unneeded, since there is no version change to keep in sync.
- The pre-existing quirk that the sibling-reach-in assertion targets a non-existent path (`system-deep-loop/system-spec-kit`); left untouched under scope lock.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `tests/unit/dependency-seams.vitest.ts` | Modify | Realpath the runtime-`node_modules` base in the two failing assertions; import `realpathSync` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `dependency-seams` passes in a git worktree | All 6 assertions green when the suite runs from a worktree (the environment that exposed the failure). |
| REQ-002 | The self-containment intent is preserved | The realpath'd prefix check still fails a genuine sibling-skill reach-in; it only tolerates the runtime's own symlinked `node_modules`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No production or dependency change | The scoped diff is confined to `tests/unit/dependency-seams.vitest.ts`; no lib, script, `package.json`, or lockfile change. |
| REQ-004 | No whole-suite regression | The runtime suite vs the 017 baseline shows no new code-caused failures. |
| REQ-005 | The real version drift is recorded, not silently dropped | The `12.10.0` vs `12.11.1` drift is documented as a separately-scoped item with its blast-radius rationale. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `dependency-seams.vitest.ts` passes 6/6 in the worktree.
- **SC-002**: The change touches only the one test file (no dependency/native change).
- **SC-003**: Whole-suite delta vs the 017 baseline shows no new code-caused failures.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Realpath masks a genuine reach-in | A sibling-skill reach-in slips past | Realpath only the runtime's own `node_modules` base; the negative sibling assertion is unchanged |
| Risk (deferred) | `better-sqlite3` 12.10.0 vs 12.11.1 drift | ABI hazard if both load in one process | Tracked as a separate item; not fixed here because the symlink makes it a main-checkout-wide native change |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Root cause — **RESOLVED**: not a version drift but a git-worktree symlink artifact in the test's prefix check. Fixed by realpath-ing the comparison base.
- The `12.10.0`/`12.11.1` drift — **DEFERRED** to a separately-scoped item; the symlinked `node_modules` makes a bump a main-checkout-wide native change, not a worktree-local one.

<!-- /ANCHOR:questions -->
