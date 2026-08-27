---
title: "Implementation Summary: dependency-seams Worktree-Symlink Fix"
description: "Final state, corrected diagnosis, and verification for making dependency-seams pass under a git worktree's symlinked node_modules by realpath-ing the comparison base."
trigger_phrases:
  - "dependency seams worktree symlink fix"
  - "realpath node_modules resolution test"
  - "better-sqlite3 drift deferred"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T12:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Realpath'd the dependency-seams comparison base; test passes 6/6; version drift deferred"
    next_safe_action: "Commit 001; push both 019 children to v4 + main"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/dependency-seams.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root cause is a git-worktree symlink artifact, fixed by realpath; version bump deferred as separately scoped."
---
# Implementation Summary: dependency-seams Worktree-Symlink Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-dependency-and-node-abi-alignment |
| **Completed** | 2026-08-26 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~1.5 hours (mostly diagnosis) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Made `dependency-seams` pass under a git worktree by realpath-ing the path it compares against. The original triage hypothesis — a `better-sqlite3` version drift (runtime 12.10.0 vs system-spec-kit 12.11.1) — was falsified during investigation. The two failing assertions compare `require.resolve()` output, which follows symlinks and returns a realpath, against a raw path built from `import.meta.url`. Inside a git worktree the runtime's `node_modules` is a symlink to the main checkout, so the resolved realpath (main checkout) never starts with the raw worktree path, and the prefix check fails — only in a worktree. The version-parity assertion passed throughout. The fix realpaths the runtime-`node_modules` base so both sides are the same realpath.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/dependency-seams.vitest.ts` | Modified | Import `realpathSync`; realpath the runtime-`node_modules` base in the own-resolution and tsx-loader assertions |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failing assertion messages (`expected false to be true` at lines 42 and 63) were pulled from the whole-suite JSON, then the divergence was reproduced with a small `node` script: `require.resolve('better-sqlite3/package.json')` returned the main-checkout path while the test's base was the worktree path, and `ls -ld` confirmed `runtime/node_modules` is a symlink between them. The same script proved that realpath-ing the base flips all three specifiers from `false` to `true`. Because this reframed the fix from a risky native-dependency bump to a two-line test change, the direction was taken back to the operator, who chose the realpath fix and deferred the version bump. The edit was made inline and verified: `dependency-seams` passes 6/6, and the change is confined to the one test file. Rollback is a single `git checkout` of that file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Realpath the comparison base | `require.resolve()` already returns a realpath; comparing it to a raw path is the bug. Realpath-ing the base makes it worktree-robust while still catching a genuine sibling reach-in. |
| Do NOT bump better-sqlite3 here | The symlinked `node_modules` means a bump mutates the main checkout for every worktree and the live MCP-adjacent runtime — far bigger blast radius than a worktree-local fix. Deferred as separately scoped (operator decision). |
| Leave the sibling assertion + PINNED untouched | Scope lock. The sibling check targets a non-existent path (a pre-existing quirk); realpath-ing it throws. Neither is this fix's job. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `dependency-seams.vitest.ts` | PASS — 6/6 |
| Negative control | Watched the raw-base assertions return `false` before the fix (node repro) |
| Scoped diff | One file: `dependency-seams.vitest.ts` |
| Whole-suite delta vs 017 baseline | No new code-caused failures |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **better-sqlite3 12.10.0 vs 12.11.1 drift is unfixed.** Real ABI hazard if both skills load in one process, but not what this test catches and not worktree-local to fix. Tracked as a separately-scoped item.
2. **The version-parity assertion is weak.** `PINNED` says 12.10.0 while system-spec-kit ships 12.11.1, so test #3 does not actually enforce cross-skill parity today. Tightening it belongs with the deferred version work.
3. **The sibling-reach-in assertion targets a non-existent path** (`system-deep-loop/system-spec-kit`), so it never fs-checks a real sibling. Pre-existing; left under scope lock.

<!-- /ANCHOR:limitations -->
