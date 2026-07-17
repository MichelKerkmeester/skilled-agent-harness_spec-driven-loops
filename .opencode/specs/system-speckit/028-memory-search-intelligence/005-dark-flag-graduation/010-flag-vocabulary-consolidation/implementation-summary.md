---
title: "Implementation Summary: Flag Vocabulary Consolidation"
description: "Shipped a shared parseFlagTristate() helper and migrated 18 hand-rolled boolean env-flag sites across 10 files onto it, fixing two confirmed silent-failure bugs (SPECKIT_MEMORY_GRAPH_UNIFIED=off ignored, SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on ignored). Build+typecheck clean; 530/534 tests passed (3 pre-existing failures confirmed unrelated)."
trigger_phrases:
  - "flag vocabulary consolidation"
  - "parseFlagTristate shared helper"
  - "SPECKIT_MEMORY_GRAPH_UNIFIED off ignored"
  - "STATUS_COMPLETION_CONSISTENCY_GATE on ignored"
  - "hand-rolled env flag parsing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/010-flag-vocabulary-consolidation"
    last_updated_at: "2026-07-09T23:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Migrated 18 sites onto parseFlagTristate, fixed both confirmed bugs, verified"
    next_safe_action: "None — packet complete. Follow-up candidate: isFeatureEnabled() vocabulary (out of scope here)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether the five identified duplicate-of-isFeatureEnabled() sites and the 9-site audit-drift finding (hyde.ts, search-flags.ts) should be resolved by a follow-up packet"
    answered_questions:
      - "Whether this packet's own 18-site scope needed widening to cover the 9 audit-drift sites found during T001: NO, they are not named in spec.md's frozen Scope section; left untouched per SCOPE LOCK and flagged for a follow-up packet"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-flag-vocabulary-consolidation |
| **Completed** | 2026-07-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Shared tristate parser

Added `parseFlagTristate(envVarName, defaultValue)` to `lib/search/search-flags.ts` (`:46-56`), next to the existing `isOptInEnabled()` and its `TRUTHY_OPT_IN` set. It recognizes `{true, 1, yes, on, enabled}` as opt-in and a new mirrored `FALSY_OPT_OUT` set `{false, 0, no, off, disabled}` as opt-out, case-insensitively and whitespace-tolerant, returning the caller's `defaultValue` for unset or unrecognized input. `isOptInEnabled()` is re-expressed as `parseFlagTristate(variableName, false)` — zero behavior change, confirmed by its existing test suite passing unchanged.

### Two confirmed silent-failure bugs fixed

Before this change, `SPECKIT_MEMORY_GRAPH_UNIFIED=off` was silently ignored — `hasExplicitDisableFlag()` (`capability-flags.ts`, pre-migration `:266-275`) recognized only `false`/`0`, so the capability stayed enabled with no error. And `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` was silently ignored — `isStatusCompletionConsistencyGateEnabled()` (pre-migration `:219-222`) recognized only `true`/`1`, so the gate stayed off with no error. Both now delegate to `parseFlagTristate`, closing both gaps — see Verification below for the direct before/after proof.

### 16 additional hand-rolled sites migrated

The pre-authoring audit (re-confirmed via a fresh `rg` re-run at T001, no drift) found the hand-rolled pattern in 10 files beyond the two confirmed bugs — 6 more standalone `capability-flags.ts` functions, and one site each in `bfs-traversal.ts`, `causal-boost.ts`, `memory-retention-sweep.ts`, `idempotency-receipts.ts`, `adaptive-ranking.ts`, `retrieval-rescue.ts`, `stage2-fusion.ts`, and two sites in `folder-discovery.ts`. Every one of these now migrates to `parseFlagTristate` with its exact current default preserved, so only the accepted vocabulary widens. Two of these sites form duplicate pairs reading the same env var independently (`SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES` in `bfs-traversal.ts`/`causal-boost.ts`; `SPECKIT_MEMORY_ADAPTIVE_RANKING` in `capability-flags.ts`/`adaptive-ranking.ts`); both copies in each pair now call `parseFlagTristate` with an identical env var name and default value, proven to agree by a dedicated test.

### One reuse-fix

`graph-lifecycle.ts` (pre-migration `:600-604`) independently re-parsed `SPECKIT_ENTITY_LINKING` even though `search-flags.ts` already exports a canonical `isEntityLinkingEnabled()` getter for it. The inline duplicate is replaced with a call to the existing getter (imported into the existing `search-flags.ts` import block at `:104-108`). This is a dedup fix, not a vocabulary widening — `isEntityLinkingEnabled()` delegates to the out-of-scope `isFeatureEnabled()`, which still recognizes only `false`/`0`. The one behavior delta this introduces: the guard now also honors `SPECKIT_ROLLOUT_PERCENT<=0` (previously never consulted by the inline check), inherited from the canonical getter.

### Explicitly excluded

`isFeatureEnabled()` (`rollout-policy.ts:59-73`), the shared default-ON helper backing roughly 50 flags, and five sites that duplicate its getters for the same env var (`save-quality-gate.ts`, `progressive-disclosure.ts`, `feedback-ledger.ts`, `fsrs-scheduler.ts`, `shadow-scoring.ts`), remain untouched — reasoned in spec.md §3 — because widening `isFeatureEnabled()`'s vocabulary touches ~50 flags in one diff and is a separate blast-radius decision. Confirmed untouched: `git diff --stat` on `rollout-policy.ts` and all five files returns empty.

### Audit-drift finding beyond this packet's frozen scope

Re-running the audit grep at T001 confirmed the spec's 18-site inventory has not drifted, but surfaced 9 additional hand-rolled boolean sites the original audit did not catch, none named in spec.md's Scope section:

- `lib/search/hyde.ts:113` (`isHyDEActive`) — opt-out `false`/`0` only, default-ON.
- `lib/search/hyde.ts:417` — a debug-log gate, literal `'true'` only.
- 7 sites inside `search-flags.ts` itself: `isFileWatcherEnabled` (`:391`), `isLexicalGroundingEnabled` (`:703`), `isEnvelopeFidelityEnabled` (`:724`), `isNoiseFloorSubtractionEnabled` (`:747`), `isCiteWithCaveatEnabled` (`:766`), `isEvidenceGapVerdictEnabled` (`:784`), `isRelevanceAwareGapEnabled` (`:1058`) — these already recognize `false`/`0`/`off` (a narrower gap than the original 18: missing only `no`/`disabled`, not the wider 2-3 value gaps the audited sites had).

Left untouched under SCOPE LOCK — the spec's frozen Scope section names exactly 18 sites across 10 files, not these 9. Flagged here as a follow-up-packet candidate rather than silently absorbed into this diff or silently dropped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified | Added `FALSY_OPT_OUT` set and `parseFlagTristate()`; re-expressed `isOptInEnabled()` as a thin wrapper over it |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modified | Migrated 8 sites onto `parseFlagTristate`, including the two confirmed bugs |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` | Modified | Migrated `includeEntityLinkerEdges` (duplicate pair with `causal-boost.ts`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Modified | Migrated `includeEntityLinkerCausalEdges` (duplicate pair with `bfs-traversal.ts`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Migrated `isSoftDeleteTombstonesEnabled` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | Modified | Migrated `isMemoryIdempotencyEnabled` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts` | Modified | Migrated `isAdaptiveFlagEnabled`'s `SPECKIT_MEMORY_ADAPTIVE_RANKING` call (duplicate pair with `capability-flags.ts`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` | Modified | Reshaped `envFlagExplicitFalse` onto `parseFlagTristate` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modified | Migrated `DESCRIPTION_REPAIR_MERGE_SAFE` and `isGeneratedMetadataZExclusionEnabled` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | Migrated `isShadowLearningModelLoadEnabled` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts` | Modified | Replaced inline `SPECKIT_ENTITY_LINKING` re-parse with the existing `isEntityLinkingEnabled()` getter |
| `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts` | Modified | Added the exhaustive `parseFlagTristate()` vocabulary matrix test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts` | Modified | Added the confirmed-bug-1 regression test (`SPECKIT_MEMORY_GRAPH_UNIFIED=off`) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts` | Modified | Added the confirmed-bug-2 regression test (`=on`) and the widened grandfather-flag vocabulary test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-rescue.vitest.ts` | Modified | Added the widened opt-out vocabulary test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts` | Modified | Added the widened opt-in vocabulary test for the entity-linker-edges duplicate pair |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | Added the widened `isSoftDeleteTombstonesEnabled` vocabulary test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts` | Modified | Added the widened `DESCRIPTION_REPAIR_MERGE_SAFE` vocabulary tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts` | Modified | Added the widened `isMemoryIdempotencyEnabled` vocabulary test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/flag-vocabulary-consolidation.vitest.ts` | New | Regression coverage for the remaining migrated sites: capability-flags.ts's 4 direct-tested standalone functions, `isGeneratedMetadataZExclusionEnabled`, the graph-lifecycle.ts reuse-fix, and both duplicate-pair agreement tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every migrated function kept its name, signature, and export surface — only the function body changed from an inline comparison to a `parseFlagTristate(ENV_VAR_NAME, currentDefault)` call, or for `graph-lifecycle.ts`, a call to the already-exported `isEntityLinkingEnabled()`. No caller of any migrated function needed to change. `hasExplicitDisableFlag()` and the paired opt-in loop inside `isMemoryRoadmapCapabilityEnabled` were re-expressed as per-candidate `parseFlagTristate(flagName, true)`/`parseFlagTristate(flagName, false)` calls: passing the opposite polarity as `defaultValue` and checking whether the result differs from that default cleanly recovers the "was this value explicitly recognized" signal the original hand-rolled checks needed, without adding a new API surface to `parseFlagTristate` itself.

Verified in this order: `tsc --noEmit` clean → `npm run build` (tsc --build + finalize-dist) clean → targeted vitest runs on every touched/extended test file (9 files, 158/158 passed + 1 skipped) → a broader impact-radius run covering every touched module's full existing test suite (22 files total, 530/534 passed, 3 pre-existing failures confirmed unrelated by scoped `git stash` isolation) → a standalone Node script exercising the two confirmed bugs directly against the compiled `dist/` output → `validate.sh --strict` against this spec folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| House `parseFlagTristate()` in `search-flags.ts`, not a new module | `search-flags.ts` already documents itself as the shared home for opt-in helpers other modules should delegate to instead of hand-rolling (`search-flags.ts:39-41`); it already shipped one migration (`isQueryTimeExistenceFilterEnabled`) into this exact file |
| Exclude `isFeatureEnabled()` and its 5 duplicate sites | Its ~50-flag blast radius and rollout-percentage bucketing semantics make a vocabulary widening there a separate, larger-blast-radius decision; migrating only the duplicates would create a new cross-path asymmetry, the exact defect class this packet removes |
| Preserve every migrated site's exact current default | The fix is scoped to vocabulary breadth only; changing a flag's default polarity as a side effect would be an undocumented, unreviewed behavior change smuggled into a parsing fix |
| Migrate duplicate pairs together, to the identical call | Two independent hand-rolled parses of the same env var can drift from each other even after each individually gains a wider vocabulary; an identical shared call removes the drift risk structurally, not just today |
| Fix `graph-lifecycle.ts` by calling the existing canonical getter, not by adding a second `parseFlagTristate` site | A canonical `isEntityLinkingEnabled()` getter already exists; reusing it is simpler and removes a duplicate rather than widening it |
| Recover the "was this explicit" signal from `parseFlagTristate` via opposite-polarity `defaultValue`, not a new API | `parseFlagTristate(flagName, true) === false` only happens when the raw value is a recognized opt-out member (unset/garbage fall through to the `true` default); this cleanly maps onto `hasExplicitDisableFlag`'s and `isAdaptiveFlagEnabled`'s existing per-candidate control flow without expanding the helper's surface area |
| Leave the 9 audit-drift sites (`hyde.ts` x2, `search-flags.ts` x7) untouched | Not named in spec.md's frozen Scope section; SCOPE LOCK forbids expanding a mid-implementation diff to absorb newly-found adjacent sites without an approved scope amendment. Flagged in checklist.md and here for a follow-up packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p .` (full mcp_server typecheck) | **CONFIRMED PASS** — clean, zero errors |
| `npm run build` (tsc --build + finalize-dist) | **CONFIRMED PASS** — clean, dist/ rebuilt and reflects every source edit (spot-checked via grep on `dist/lib/config/capability-flags.js` and `dist/lib/search/search-flags.js`) |
| `parseFlagTristate()` accepts the full 10-value vocabulary, both default polarities, case/whitespace variants, unset/empty/garbage | **CONFIRMED PASS** — `tests/search-flags.vitest.ts` matrix describe block, 4 tests, all green |
| `SPECKIT_MEMORY_GRAPH_UNIFIED=off` disables `graphUnified` (confirmed bug 1) | **CONFIRMED PASS** — before: git-history read of `capability-flags.ts` at the pre-edit commit shows `hasExplicitDisableFlag` matching only `'false'`/`'0'`; after: `tests/memory-roadmap-flags.vitest.ts` new test passes for all 5 opt-out values, AND a standalone Node script against the compiled `dist/` output shows `off` now resolves `graphUnified: false` (was `true` before the fix, confirmed by running the identical script against the pre-fix `dist/` build) |
| `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` enables the gate (confirmed bug 2) | **CONFIRMED PASS** — before: git-history read shows `rawValue === 'true' \|\| rawValue === '1'` only; after: `tests/generated-metadata-integrity.vitest.ts` new test passes for all 5 opt-in values, AND the same standalone dist-level script shows `on` now resolves `true` (was `false` before the fix) |
| Every migrated site's pre-migration unset-env-var baseline is unchanged | **CONFIRMED PASS** — every pre-existing test file covering a migrated site (14 files) continues to pass unchanged post-migration; no default-polarity flip detected |
| The two duplicate pairs agree across the full vocabulary | **CONFIRMED PASS** — `tests/flag-vocabulary-consolidation.vitest.ts` duplicate-pair describe blocks, both green, tested across the full 10-value vocabulary + unset + garbage |
| 17 of 18 migrated sites' previously-unrecognized vocabulary member now parses correctly | **CONFIRMED PASS** — direct, behavioral tests for capability-flags.ts x8, `bfs-traversal.ts`, `causal-boost.ts`, `memory-retention-sweep.ts`, `idempotency-receipts.ts`, `adaptive-ranking.ts`, `retrieval-rescue.ts`, `folder-discovery.ts` x2, `graph-lifecycle.ts` |
| `isShadowLearningModelLoadEnabled` (`stage2-fusion.ts`) widened vocabulary | **INFERRED, not directly tested** — its only reachable exported entry point (`loadPersistedLearnedStage2Model`) does async file I/O and in-memory caching with no existing test fixture; proven only by source read (a 1-line `parseFlagTristate('SPECKIT_SHADOW_LEARNING', false)` call) composed with the exhaustive `parseFlagTristate` matrix test. What would confirm it: a dedicated fixture that mocks the learned-model file path and asserts the load fires for the newly-recognized vocabulary members |
| Broader test suite, zero regressions | **CONFIRMED PASS with a documented environmental gap** — ran 22 test files spanning every touched module's full existing test suite: 530 passed, 3 failed, 1 skipped (534 total). All 3 failures (`causal-edge-tombstones.vitest.ts` x2, `adaptive-ranking-e2e.vitest.ts` x1) were confirmed pre-existing and unrelated to this diff by scoped `git stash` isolation — reverting only this packet's `.ts` source files reproduces the identical 3 failures. A full repo-wide `vitest run` (the entire `system-spec-kit` monorepo suite: `mcp_server/tests` + `system-deep-loop/runtime/tests` + `scripts/tests`) was attempted twice in this session but could not complete: a concurrent, unrelated process (PID 92609) held 94-99% CPU continuously for 2h51m+ during this session, confirmed via `ps`, starving the vitest workers to 0% CPU. This is a live shared-environment constraint outside this packet's control, not evidence of a regression — reported honestly rather than claimed as a completed full-suite pass |
| `validate.sh --strict` against this spec folder | **CONFIRMED PASS** — `RESULT: PASSED`, `Errors: 0  Warnings: 0`, exit code 0 (after regenerating `description.json`/`graph-metadata.json` post-doc-edit and resolving the `EVIDENCE_CITED` warning) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`isShadowLearningModelLoadEnabled` (`stage2-fusion.ts`) has no dedicated behavioral test.** Proven only by composition (source read + the shared helper's exhaustive matrix test), not exercised end-to-end. See Verification table for what would confirm it.
2. **`isFeatureEnabled()` stays untouched.** The ~50 default-ON flags it backs, and the 5 sites duplicating its getters, keep their current `false`/`0`-only vocabulary; a future packet inherits the recorded reasoning in spec.md §3.
3. **9-site audit-drift finding is out of this packet's scope.** `lib/search/hyde.ts` (2 sites) and 7 sites inside `search-flags.ts` itself carry a narrower version of the same hand-rolled pattern (missing only `no`/`disabled`, not the wider gaps the audited 18 had). Not named in spec.md's frozen Scope section, left untouched, flagged for a follow-up packet.
4. **`graph-lifecycle.ts`'s reuse-fix changes one edge-case behavior.** The entity-linking guard now also honors `SPECKIT_ROLLOUT_PERCENT<=0` (previously never consulted by the inline check), inherited from the canonical `isEntityLinkingEnabled()` getter. This is the intended effect of REQ-006 (removing the duplicate parse so the two paths cannot diverge), not an unintended regression, but it is a real behavior delta beyond pure vocabulary widening — documented here for visibility.
5. **Full repo-wide vitest run not completed this session** due to sustained CPU contention from an unrelated concurrent process; the 22-file/534-test targeted run covering every touched module's full test suite is the strongest evidence gathered, with the 3 failures independently confirmed pre-existing and unrelated.
<!-- /ANCHOR:limitations -->

---
