---
title: "Implementation Summary: Runtime backend promotions"
description: "Phase 002: promoted the capability resolver, artifact-root seam, loop-lock CLI, lifecycle taxonomy into deep-loop-runtime and emitResourceMap into workflows-shared, keeping old scripts byte-compatible shims. Verified byte-identical parity + 32/32 new tests in the dlw-build worktree."
trigger_phrases:
  - "deep-loop-workflows phase 002 summary"
  - "runtime backend promotions complete"
  - "byte-compatible shims verified"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/002-runtime-backend-promotions"
    last_updated_at: "2026-06-15T06:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Promoted runtime backend contracts in worktree; verified byte-parity + 32/32 tests"
    next_safe_action: "Execute phase 003 build hub + 5 mode packets"
    blockers: []
    key_files:
      - "deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs"
      - "deep-loop-runtime/lib/deep-loop/artifact-root.cjs"
      - "deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs"
      - "deep-loop-runtime/scripts/loop-lock.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-002-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "T4/T5 used re-export seams (single impl stays in system-spec-kit/shared); a physical code move into the runtime is an optional fuller-self-containment follow-up"
    answered_questions: []
---
# Implementation Summary: Runtime backend promotions

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 002 of 009 |
| **Status** | Complete (in `dlw-build` worktree; merges to `027` after the deep-review gate) |
| **Date** | 2026-06-15 |
| **Depends on** | phase 001 |
| **Worktree** | `dlw-build` (off `a39e618f2e`) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Promoted generic plumbing into `deep-loop-runtime` while keeping every old public entrypoint a byte-compatible shim:

- **`lib/deep-loop/runtime-capabilities.cjs`** — parameterized `createRuntimeCapabilities({label, defaultCapabilityPath})` factory; `deep-research` and `deep-review` scripts became thin shims binding their label.
- **`lib/deep-loop/artifact-root.cjs`** — runtime seam re-exporting `resolveArtifactRoot`/`allocateShortSubfolder`/`normalizeSpecFolderReference` (same function objects → zero drift). The three graph-backed reducers import from here.
- **`lib/deep-loop/lifecycle-taxonomy.cjs`** — the 6 `stopReason` + 4 `sessionOutcome` terminal taxonomy; `deep-improvement/improvement-journal.cjs` imports these (exact values + error strings preserved).
- **`scripts/loop-lock.cjs`** — CLI adapter over `loop-lock.ts` (acquire/status/refresh/release).
- **`deep-loop-workflows/shared/synthesis/resource-map.cjs`** — `emitResourceMap` seam in the NON-discoverable workflows-shared layer (no `graph-metadata.json`/`SKILL.md`).
- **5 vitest suites** in `deep-loop-runtime/tests/unit/` (32 tests).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single opus seat (via `claude2`, bypassPermissions, tightly scoped to an enumerated allowed-write set) executed the 12 tasks inside the `dlw-build` worktree. The read-only loop-lock contract and disjoint module work were the parallelizable parts; the shared-reducer edits were kept single-owner to avoid conflict. The orchestrator independently verified all claims.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Re-export seams (T4/T5)** rather than physically copying `resolveArtifactRoot`/`emitResourceMap` bodies into the runtime — `system-spec-kit/shared` is out of scope, and re-export gives true byte-parity with zero drift. A physical move is an optional fuller-self-containment follow-up (open question).
- `emitResourceMap` lives in workflows-shared, not the backend (it renders a deliverable).
- No `improvement` loopType added; `convergence.cjs` byte-unchanged.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

Independently re-run by the orchestrator (not just the seat's self-report):

- **Byte-parity: IDENTICAL** — `diff` of the 4 shimmed-script outputs (worktree post vs the phase-001 before-snapshot) matched exactly.
- **New tests: 32/32 passed** (5 suites, re-run from `system-spec-kit/mcp_server`).
- **Regression: 327 passed, 1 failed** — the 1 failure (`loop-lock` cross-process acquire) is a confirmed pre-existing flake: it failed 1/4 runs on the *unmodified* main tree; `loop-lock.ts` is untouched.
- **Scope:** 9 modified + 10 new files, all in the allowed-write set, **zero deletions**; `deep-loop-runtime` MCP-free; `deep-loop-workflows/` holds only `shared/synthesis/` (non-discoverable).

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The promotions live in the `dlw-build` worktree, not yet merged to `027` — merge happens after the 10-iteration deep review and the operator's go-ahead.
- The loop-lock cross-process test remains a pre-existing flake (not introduced here; a separate hardening item if desired).
- T4/T5 self-containment is partial (re-export seams); a physical move out of `system-spec-kit/shared` is deferred.

<!-- /ANCHOR:limitations -->
