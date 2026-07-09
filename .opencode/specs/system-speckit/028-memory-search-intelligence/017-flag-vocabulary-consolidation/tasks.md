---
title: "Tasks: Flag Vocabulary Consolidation"
description: "Task Format: T### [P?] Description (file path)"
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/017-flag-vocabulary-consolidation"
    last_updated_at: "2026-07-09T23:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed all 28 tasks (T001-T028), verified with real evidence"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Flag Vocabulary Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-run the audit grep (`rg -n "process\.env\[.*\]\?\.(trim\(\)\.toLowerCase\(\)|toLowerCase\(\)\.trim\(\))|process\.env\.[A-Z_]+\?\.(trim\(\)\.toLowerCase\(\)|toLowerCase\(\)\.trim\(\))" lib --type ts`) to confirm the 18-site / 10-file inventory has not drifted (`.opencode/skills/system-spec-kit/mcp_server`). Result: the 18-site inventory matched exactly, no drift. Flagged 9 additional sites outside the audited set (`lib/search/hyde.ts` x2, `search-flags.ts` x7) — left out of scope, documented in implementation-summary.md.
- [x] T002 [P] Capture the pre-migration unset-env-var baseline for all 6 standalone `capability-flags.ts` functions plus `hasExplicitDisableFlag`/`isMemoryRoadmapCapabilityEnabled` (`.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`). Baseline captured via direct source read before editing; regression-proven post-migration by `tests/flag-vocabulary-consolidation.vitest.ts` (unset baseline unchanged) and existing suites (`identity-resolver-merge-safety.vitest.ts`, `generator-hardening.vitest.ts`, `generated-metadata-integrity.vitest.ts`).
- [x] T003 [P] Capture the pre-migration unset-env-var baseline for the 10 sibling-file sites (`bfs-traversal.ts`, `causal-boost.ts`, `memory-retention-sweep.ts`, `idempotency-receipts.ts`, `adaptive-ranking.ts`, `retrieval-rescue.ts`, `folder-discovery.ts` x2, `stage2-fusion.ts`, `graph-lifecycle.ts`). Baseline captured via direct source read; existing test suites for each site (causal-boost, memory-retention-sweep, retrieval-rescue, memory-idempotency, folder-discovery, adaptive-ranking, graph-lifecycle) continue to pass unchanged post-migration.
- [x] T004 Confirm no import-cycle risk between `lib/search/search-flags.ts` and the sibling directories (`lib/governance/`, `lib/storage/`, `lib/graph/`, `lib/cognitive/`) that will import `parseFlagTristate`. Confirmed: `search-flags.ts` imports only from `lib/cognitive/rollout-policy.ts`; every sibling directory already imports FROM `search-flags.ts` in one direction (e.g. `capability-flags.ts:9`, `memory-retention-sweep.ts:19`), so adding `parseFlagTristate` imports in `bfs-traversal.ts`, `idempotency-receipts.ts`, `adaptive-ranking.ts`, `retrieval-rescue.ts`, `folder-discovery.ts`, `stage2-fusion.ts` creates no cycle. `tsc --build` confirms clean.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `FALSY_OPT_OUT` set (`{false, 0, no, off, disabled}`) and `parseFlagTristate(envVarName, defaultValue)` to `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`, next to `isOptInEnabled()` and `TRUTHY_OPT_IN`
- [x] T006 Re-express `isOptInEnabled()` as `parseFlagTristate(name, false)` with zero behavior change (`lib/search/search-flags.ts:43-46`)
- [x] T007 Migrate `isIdentityMergeSafetyEnabled` to `parseFlagTristate('SPECKIT_IDENTITY_MERGE_SAFETY', true)` (`capability-flags.ts:71-74`)
- [x] T008 Migrate `isGeneratedMetadataGrandfatherEnabled` to `parseFlagTristate('SPECKIT_GENERATED_METADATA_GRANDFATHER', false)` (`capability-flags.ts:100-103`)
- [x] T009 Migrate `isGeneratedMetadataDriftGateEnabled` to `parseFlagTristate('SPECKIT_GENERATED_METADATA_DRIFT_GATE', true)` (`capability-flags.ts:130-133`)
- [x] T010 Migrate `isGeneratorHardeningEnabled` to `parseFlagTristate('SPECKIT_GENERATOR_HARDENING', true)` (`capability-flags.ts:159-162`)
- [x] T011 Migrate `isIdempotentDescriptionWritesEnabled` to `parseFlagTristate('SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES', true)` (`capability-flags.ts:189-192`)
- [x] T012 Migrate `isStatusCompletionConsistencyGateEnabled` to `parseFlagTristate('SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE', false)` — fixes the confirmed `=on` silent-ignore bug (`capability-flags.ts:219-222`)
- [x] T013 Migrate `hasExplicitDisableFlag` and the paired true/1 check inside `isMemoryRoadmapCapabilityEnabled` to `parseFlagTristate` per candidate flag name — fixes the confirmed `SPECKIT_MEMORY_GRAPH_UNIFIED=off` silent-ignore bug (`capability-flags.ts:266-308`)
- [x] T014 [P] Migrate `includeEntityLinkerEdges` and `includeEntityLinkerCausalEdges` to identical `parseFlagTristate('SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES', false)` calls (`lib/graph/bfs-traversal.ts:112-115`, `lib/search/causal-boost.ts:103-106`)
- [x] T015 [P] Migrate `isSoftDeleteTombstonesEnabled` to `parseFlagTristate('SPECKIT_SOFT_DELETE_TOMBSTONES', false)` (`lib/governance/memory-retention-sweep.ts:165-167`)
- [x] T016 [P] Migrate `isMemoryIdempotencyEnabled` to `parseFlagTristate('SPECKIT_MEMORY_IDEMPOTENCY', false)` (`lib/storage/idempotency-receipts.ts:54-57`)
- [x] T017 [P] Migrate `isAdaptiveFlagEnabled`'s `SPECKIT_MEMORY_ADAPTIVE_RANKING` call to `parseFlagTristate('SPECKIT_MEMORY_ADAPTIVE_RANKING', false)`, matching the `capability-flags.ts` roadmap-path default from T013 (`lib/cognitive/adaptive-ranking.ts:189-198,344`)
- [x] T018 [P] Reshape `envFlagExplicitFalse` to `!parseFlagTristate(name, true)` so it inherits the full opt-out vocabulary (`lib/search/rerank/retrieval-rescue.ts:95-97`)
- [x] T019 [P] Migrate `DESCRIPTION_REPAIR_MERGE_SAFE` and `isGeneratedMetadataZExclusionEnabled` to `parseFlagTristate` (`lib/search/folder-discovery.ts:101-104,417-420`)
- [x] T020 [P] Migrate `isShadowLearningModelLoadEnabled` to `parseFlagTristate('SPECKIT_SHADOW_LEARNING', false)` (`lib/search/pipeline/stage2-fusion.ts:170-172`)
- [x] T021 Replace `graph-lifecycle.ts`'s inline `SPECKIT_ENTITY_LINKING` re-parse with a call to the existing `isEntityLinkingEnabled()` export (`lib/search/graph-lifecycle.ts:600-604`, import from `lib/search/search-flags.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Add the `parseFlagTristate()` direct unit test: full 10-value vocabulary + unset + empty + garbage, both default polarities (`tests/search-flags.vitest.ts` or a new test file). Added 4 tests in `tests/search-flags.vitest.ts`'s new `parseFlagTristate() vocabulary matrix` describe block, all passing.
- [x] T023 Add the `SPECKIT_MEMORY_GRAPH_UNIFIED=off` regression test to `tests/memory-roadmap-flags.vitest.ts`, confirming `graphUnified === false`. Added, passing for all 5 opt-out values.
- [x] T024 Add the `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` regression test, confirming `isStatusCompletionConsistencyGateEnabled() === true`. Added to `tests/generated-metadata-integrity.vitest.ts`, passing for all 5 opt-in values.
- [x] T025 Add per-site regression tests for the remaining 16 migrated sites: pre-migration unset baseline (T002/T003) still holds, previously-missing vocabulary member now recognized. 15 of 16 directly tested (distributed across existing site test files plus new `tests/flag-vocabulary-consolidation.vitest.ts`); `isShadowLearningModelLoadEnabled` proven only by composition (source read + matrix test), documented in implementation-summary.md Known Limitations.
- [x] T026 Add the duplicate-pair agreement tests for `SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES` and `SPECKIT_MEMORY_ADAPTIVE_RANKING`. Both added in `tests/flag-vocabulary-consolidation.vitest.ts`, passing across the full vocabulary + unset + garbage.
- [x] T027 Run the full vitest suite for every touched file and confirm zero regressions against the Phase 1 baseline. 22 test files run, 530/534 passed, 3 pre-existing failures confirmed unrelated via scoped `git stash` isolation (see implementation-summary.md Verification).
- [x] T028 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/017-flag-vocabulary-consolidation --strict` and confirm exit 0. `RESULT: PASSED`, `Errors: 0  Warnings: 0`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (see implementation-summary.md Verification table)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
