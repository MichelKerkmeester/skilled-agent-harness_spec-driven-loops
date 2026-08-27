---
title: "Implementation Summary: tsx Boot + Containment-Root Hardening"
description: "Final state and verification for stripping NODE_PRESERVE_SYMLINKS from the deep-loop tsx re-exec across 10 entrypoints and adding a DEEP_LOOP_REPO_ROOT containment override, ending the loop-lock.js ERR_MODULE_NOT_FOUND crash on spaced-path checkouts."
trigger_phrases:
  - "tsx boot spaced path hardening summary"
  - "runtime-bootstrap tsxChildEnv"
  - "DEEP_LOOP_REPO_ROOT override"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/020-tsx-boot-spaced-path-hardening"
    last_updated_at: "2026-08-26T16:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Stripped the tsx-child flag across 10 entrypoints; added repo-root override"
    next_safe_action: "Commit; push per operator go-ahead"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/tests/runtime-bootstrap.test.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The tsx re-exec now strips NODE_PRESERVE_SYMLINKS; the runtime never needed it."
      - "DEEP_LOOP_REPO_ROOT pins the containment root when the loop runs from a mirror."
---
# Implementation Summary: tsx Boot + Containment-Root Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-tsx-boot-spaced-path-hardening |
| **Completed** | 2026-08-26 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~3 hours (diagnosis-heavy) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Ended the deep-loop crash where a checkout at a path with a space, run under `NODE_PRESERVE_SYMLINKS=1`, killed the tsx loader and produced `ERR_MODULE_NOT_FOUND` on `atomic-state.ts`'s `import './loop-lock.js'` — stalling every executor at iteration 1. The runtime never needs that flag (write containment resolves paths through `fs.realpath`, and the repo root is the working directory), so the fix strips it from the tsx re-exec child. A single shared `runtime-bootstrap.cjs` owns the tsx child env and a new `DEEP_LOOP_REPO_ROOT` containment-root override, and all 10 tsx re-exec entrypoints route through it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/runtime-bootstrap.cjs` | Created | `tsxChildEnv` (strips the flag) + `resolveContainmentRepoRoot` (honors `DEEP_LOOP_REPO_ROOT`) |
| `runtime/scripts/{append-mode-event, check-direct-append, convergence, fanout-merge, fanout-run, loop-lock, query, status, upsert, verify-authority}.cjs` | Modified | tsx child env built via `tsxChildEnv` |
| `runtime/scripts/fanout-run.cjs` | Modified | Both write-containment sites resolve the repo root via the helper |
| `runtime/scripts/tests/runtime-bootstrap.test.cjs` | Created | node:test: both helpers + the 10-entrypoint guard |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failure class was reproduced deterministically: importing `atomic-state.ts` under `--import <tsx loader at a spaced path>` fails with `ERR_MODULE_NOT_FOUND` when `NODE_PRESERVE_SYMLINKS=1` and loads cleanly without it. The flag was confirmed absent from the entire `.opencode` tree and irrelevant to containment (`realpathSafe` is `fs.realpathSync`, `repoRoot` is `process.cwd()`), so stripping it in the tsx child is safe. The fix was centralized in one helper and rolled out to all 10 entrypoints with a source-guard test so it cannot drift. The exact `loop-lock.js` remap variant needs a real standalone tsx install at a spaced path (impractical to mirror here), so the regression is deterministic-by-construction: it asserts the child env carries no flag and every entrypoint routes through the helper, rather than depending on an environment-specific crash. Verified on BOTH gates.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strip the flag in the tsx child (not upgrade tsx / ship .js) | The flag is the sole trigger and the runtime never needs it. Cheapest fix, no build step, no dependency change. |
| One shared helper, not 10 inline edits | Puts the rationale and the fix at a single source; the guard test stops any future entrypoint re-leaking the flag. |
| Add `DEEP_LOOP_REPO_ROOT` anyway | I found no code path by which the flag affects containment, so the operator's catch-22 likely has another cause; an explicit override is the honest escape hatch regardless. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `runtime-bootstrap.test.cjs` (node:test) | PASS — 5/5 |
| Entrypoint boots under `NODE_PRESERVE_SYMLINKS=1` | PASS — `loop-lock.cjs status` reaches the TS |
| `run-node-tests.mjs` (full node:test gate) | 84 files, 763 pass, 17 fail — all pre-existing (`compiled-route-manifest`, `command-topology-pilot`); +5 from this packet, 0 new failures |
| Runtime vitest whole suite | Delta clean vs baseline — no new code-caused failures |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Operator-side guidance is not enforced.** Not setting the flag, running from the space-free checkout, or symlinking the mirror's `node_modules` to the canonical one all avoid the problem too, but those are the operator's environment, not repo code.
2. **The containment catch-22 is not root-caused.** The `DEEP_LOOP_REPO_ROOT` override addresses it pragmatically, but the exact reason the operator saw containment reject the spec-folder when dropping the flag is unconfirmed (the flag does not touch `fs.realpath`). Closing it needs the other session's exact invocation.

<!-- /ANCHOR:limitations -->
