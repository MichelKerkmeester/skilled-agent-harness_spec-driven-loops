---
title: "Implementation Summary: Fix test failures surfaced by post-sync verification"
description: "5 test failures found while verifying a large sync commit, each root-caused and fixed individually."
trigger_phrases:
  - "implementation"
  - "summary"
  - "post-sync verification fixes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-post-sync-verification-fixes"
    last_updated_at: "2026-07-12T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Packet completed: 5 test failures root-caused and fixed"
    next_safe_action: "None - packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "post-sync-verification-fixes/033"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-post-sync-verification-fixes |
| **Status** | Complete |
| **Completed** | 2026-07-12 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

While independently verifying a large operator-directed sync commit (3,801 files from concurrent sessions), a mechanical parse/syntax sweep came back 100% clean, but running the touched vitest suites surfaced 5 real assertion failures across 3 test files. Each was root-caused individually against real source/registry files (not guessed), producing 3 distinct, unrelated fixes: 2 stale test expectations corrected, 1 test fixture completed to match a real reducer contract, and 1 genuine input-validation gap closed in production code.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modified | Dropped a dead `.opencode/agents/deep-review.toml` mirror-path expectation and fixed a hardcoded 3-entry (with a duplicate) runtime-ID list down to the real 2-entry list |
| `.opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts` | Modified | Added `gateClass: 'hard'`, `applicable: true` to the LG-0006 fixture's result objects |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | Modified | Added a `main()`-level guard rejecting `executor.model` values that collide with the shared `EXECUTOR_KINDS` list; later this same file gained the `execution_provenance`/`route_fields` wiring below |
| `.opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs` | Created | Wires the skill's `.vitest.ts` suite into a real, checked-in config (self-contained pattern matching `deep-improvement/scripts/vitest.config.mjs`) |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs` | Modified | `buildProgressRecord`/`persistSeatStepwise` now carry `execution_provenance` into the persisted `completed` record instead of silently dropping it |

### Follow-up round: wiring deep-ai-council into a real vitest config surfaced 2 more pre-existing bugs

The Known Limitations note below (deep-ai-council's 2 CLI test files never running in any checked-in config) was itself fixed: added `.opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs` (same self-contained pattern as `deep-improvement/scripts/vitest.config.mjs`). That immediately expanded discovery from 2 known test files to the skill's full 10-file, 94-test suite - which had *never* run automatically before, ever. 2 more real, pre-existing failures surfaced:

- **`persist-artifacts.vitest.ts`**: `dispatchSeat()` in `orchestrate-session.cjs` already computed a full `execution_provenance` object (`requested`/`effective` identity, including the anti-forgery guarantee that `effective` values are never parsed out of a seat's freeform output content) but never attached it to the `persistedSeat` object it handed to `persistSeatStepwise` - the field was silently dropped on the way to disk. Added `execution_provenance: executionProvenance` to `persistedSeat`, and taught `persist-artifacts.cjs`'s `buildProgressRecord`/`persistSeatStepwise` to actually carry it into the persisted `completed` record (previously had zero references to the field at all).
- **`orchestrate-session.vitest.ts`**: the topic-level `route_fields` object (built by `withCouncilRouteConfig()` from the canonical `COUNCIL_ROUTE_FIELDS` constant) was flat-only, with no `requested`/`effective` identity split - even though the seat-level equivalent already existed in `dispatchSeat`. Added `requested: { mode, target_agent }` (mirrors the canonical route) and `effective: { primary_agent: null, model: null }` (correctly unobserved at route-resolution time, before any seat has run) to `route_fields`, additive alongside the existing flat fields so the already-passing sibling test (which checks the flat shape) stays unaffected.

Both fixes are additive completions of wiring that clearly already existed in intent (the `requested`/`effective` shape and the anti-forgery pattern were already fully designed and implemented at the seat-dispatch level) - not new design decisions.
<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each of the 5 failures was root-caused against real source/registry files before touching anything — no guessing, no blind pattern-matching against the failure messages. The `.toml` mirror and duplicate-runtime-ID expectations were traced via `git log --all --follow` (confirming the exact path never existed) and the canonical `runtime_capabilities.json` registry (confirming exactly 2 real runtimes). The `gatingFailures` mismatch was traced by reading `buildTraceabilityRollup`'s actual recomputation logic and cross-checking it against a sibling, already-passing test's fixture convention (`reduce-state-summary-fallback.test.cjs`), which settled test-fixture-bug vs. reducer-bug definitively. The CLI validation gap was closed by finding and reusing the repo's own existing `EXECUTOR_KINDS` constant rather than inventing a new list, following the exact dynamic-`import()`-from-`.cjs` pattern `fanout-run.cjs` already uses for the same file. All fixes applied, then each affected test file re-run individually, then the full previously-passing regression suites re-run to confirm zero side effects.
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Deleted the `.toml` mirror expectation instead of creating `.opencode/agents/deep-review.toml` | `git log --all --follow` shows this exact path has **zero history anywhere** — it never existed. Changelog history *does* show a real, once-live Codex mirror, but at a different path (`.codex/agents/deep-review.toml`), and that directory doesn't exist in the repo today, nor does any current deep-review doc mention Codex. The canonical `runtime_capabilities.json` registry (source of truth for `listRuntimeCapabilityIds()`) declares exactly 2 runtimes. Recreating a 3rd-runtime mirror would be resurrecting a dropped feature, not fixing a test — out of scope for a bug-fix packet, flagged in Known Limitations below instead of silently decided either way |
| Fixed the LG-0006 test fixture rather than changing `buildTraceabilityRollup`'s logic | A sibling passing test (`reduce-state-summary-fallback.test.cjs`) already stamps `gateClass: 'hard'`/`'soft'` directly onto its result objects — confirming the reducer's `result.gateClass === 'hard'` check is the intended, already-correct contract. The LG-0006 fixture was simply incomplete relative to that established convention |
| Reused the existing `EXECUTOR_KINDS` constant from `executor-config.ts` instead of hardcoding a new list in `orchestrate-session.cjs` | Avoids a second source of truth for valid executor kinds; `fanout-run.cjs` already does the identical dynamic `import()` of the same `.ts` file from a `.cjs` context, so this follows an established, working pattern rather than inventing a new import mechanism |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| `deep-review-contract-parity.vitest.ts` | Pass | Re-run individually after fix |
| `reducer-backlog-remediation.vitest.ts` | Pass | Re-run individually after fix |
| `orchestrate-session-cli.vitest.ts` | Pass | 12/12 tests, including the previously-failing 2 rejection cases |
| `orchestrate-topic.vitest.ts` | Pass | Unaffected sibling, re-run as a sanity check |
| Combined `system-spec-kit` 5-file batch | Pass | 35/35 tests |
| `system-deep-loop/runtime` regression check | Pass | 161/161 tests, zero regressions from the `orchestrate-session.cjs` change |
| `system-deep-loop/deep-improvement` regression check | Pass | 48/48 tests, zero regressions |
| `deep-ai-council` full suite (post config-wiring) | Pass | 10/10 files, 94/94 tests - up from the 2 files/12 tests originally checked, since wiring a real config expanded discovery to the whole skill |
| system-spec-kit combined batch, re-confirmed after the deep-ai-council round | Pass | 35/35 tests, unaffected by the deep-ai-council changes |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex CLI runtime support for deep-review stays dropped**, not restored. If Codex support is actually still wanted, that's a real feature-restoration task (new registry entry + new `.codex/agents/deep-review.toml` mirror + doc updates), not something this packet did.
2. **`deep-ai-council` has no `package.json` of its own** (matching `deep-improvement`'s existing convention) — its new `vitest.config.mjs` relies on `npx vitest` resolving the repo-root-cached binary. This works today but is worth revisiting if that convention ever changes.
<!-- /ANCHOR:limitations -->

---
