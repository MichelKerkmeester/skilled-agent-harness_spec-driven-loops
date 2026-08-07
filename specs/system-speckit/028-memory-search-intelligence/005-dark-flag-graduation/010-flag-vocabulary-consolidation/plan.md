---
title: "Implementation Plan: Flag Vocabulary Consolidation"
description: "Add a shared parseFlagTristate() helper to search-flags.ts (opt-in {true,1,yes,on,enabled} / opt-out {false,0,no,off,disabled}), migrate the 18 audited standalone hand-rolled sites onto it preserving each site's current default, fix the two confirmed silent-failure bugs, and fix one reuse-duplication in graph-lifecycle.ts. PREREQUISITE for packets 019-023 in this batch."
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
    recent_action: "Executed all 3 phases: helper added, 18 sites migrated, verified"
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
# Implementation Plan: Flag Vocabulary Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, the spec-kit MCP server |
| **Framework** | Env-var flag parsing scattered across `lib/config`, `lib/search`, `lib/graph`, `lib/governance`, `lib/storage`, `lib/cognitive` |
| **Storage** | None, this is a pure parsing/behavior fix, no persisted state |
| **Testing** | Vitest: a new direct test for `parseFlagTristate()`, per-site regression tests for the 18 migrated sites, two targeted tests for the confirmed bugs |

### Overview

This phase adds one shared `parseFlagTristate(envVarName, defaultValue)` helper to `lib/search/search-flags.ts`, next to the existing `isOptInEnabled()` and its `TRUTHY_OPT_IN` set, and mirrors it with a new `FALSY_OPT_OUT` set covering `{false, 0, no, off, disabled}`. It then migrates the 18 audited standalone hand-rolled sites (§3 Scope Refinement Note in spec.md) — spanning `capability-flags.ts` and 9 sibling files — onto the shared helper, each site keeping its exact current default so only the accepted vocabulary widens. Two of those migrations are the confirmed silent-failure bugs named in the spec (`SPECKIT_MEMORY_GRAPH_UNIFIED=off`, `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on`); one (`graph-lifecycle.ts`) is a reuse-fix that calls the existing `isEntityLinkingEnabled()` getter instead of re-parsing; two are duplicate pairs migrated together so they cannot diverge again. `isFeatureEnabled()` and the five sites that duplicate its getters stay untouched, reasoned and recorded in spec.md §3 Out of Scope, because widening its vocabulary touches ~50 flags in one diff and is a separate blast-radius decision.

### Sequencing dependency

This packet is a **named prerequisite** for packets `019-023` in the same 028 batch (per the task framing that opened this packet): those packets plan to flip flag defaults, and a flipped default is only meaningful if the flag's parser actually recognizes the value an operator or a follow-up packet sets. `019-023` MUST NOT start their default-flip work until this packet's `validate.sh --strict` and vitest gates are green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met — see checklist.md CHK-020
- [x] Tests passing (if applicable) — 22 test files, 530/534 passed, 3 pre-existing failures confirmed unrelated (checklist.md CHK-026)
- [x] Docs updated (spec/plan/tasks) — spec.md Status→Complete, tasks.md T001-T028 marked [x], checklist.md and implementation-summary.md finalized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared-helper extraction plus call-site migration. No new module boundary beyond the one function added to the existing flag-helper file; no change to any flag's default polarity.

### Key Components

- **`search-flags.ts` `parseFlagTristate()` (new)**: the single vocabulary authority — `TRUTHY_OPT_IN` (existing, `:33`) for the opt-in set, a new `FALSY_OPT_OUT` set for the opt-out set, `defaultValue` for everything else including unset.
- **`search-flags.ts` `isOptInEnabled()` (`:43-46`, modified)**: re-expressed as `parseFlagTristate(name, false)` — zero behavior change, single source of truth for the opt-in-only shape.
- **`capability-flags.ts` (8 sites, modified)**: `isIdentityMergeSafetyEnabled` (`:71-74`), `isGeneratedMetadataGrandfatherEnabled` (`:100-103`), `isGeneratedMetadataDriftGateEnabled` (`:130-133`), `isGeneratorHardeningEnabled` (`:159-162`), `isIdempotentDescriptionWritesEnabled` (`:189-192`), `isStatusCompletionConsistencyGateEnabled` (`:219-222`, confirmed bug), `hasExplicitDisableFlag` + the paired true/1 check inside `isMemoryRoadmapCapabilityEnabled` (`:266-275`, `:285-308`, confirmed bug for `graphUnified`).
- **9 sibling consuming files (10 sites, modified)**: `lib/graph/bfs-traversal.ts:112-115`, `lib/search/causal-boost.ts:103-106` (duplicate pair, migrated together), `lib/governance/memory-retention-sweep.ts:165-167`, `lib/storage/idempotency-receipts.ts:54-57`, `lib/cognitive/adaptive-ranking.ts:189-198` (also feeds the `SPECKIT_MEMORY_ADAPTIVE_RANKING` duplicate pair with `capability-flags.ts`), `lib/search/rerank/retrieval-rescue.ts:95-97`, `lib/search/folder-discovery.ts:101-104,417-420` (2 sites), `lib/search/pipeline/stage2-fusion.ts:170-172`, `lib/search/graph-lifecycle.ts:600-604` (reuse-fix, calls `isEntityLinkingEnabled()` instead of migrating to `parseFlagTristate` directly).

### Data Flow

Each migrated function keeps its existing name, signature, and export surface — only the function body changes from an inline comparison to a `parseFlagTristate(ENV_VAR_NAME, currentDefault)` call (or, for `graph-lifecycle.ts`, a call to the already-exported `isEntityLinkingEnabled()`). No caller of any migrated function changes; the fix is entirely inside the parsing layer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `search-flags.ts` (no `parseFlagTristate` today) | Houses `isOptInEnabled()` and `TRUTHY_OPT_IN`, the only existing shared vocabulary helper | add `FALSY_OPT_OUT` set and `parseFlagTristate(envVarName, defaultValue)` | direct unit test feeds all 10 vocabulary values + unset + garbage against both default polarities |
| `capability-flags.ts` `isMemoryRoadmapCapabilityEnabled` disable path (`:266-275`) | Recognizes only `false`/`0` as disable, so `SPECKIT_MEMORY_GRAPH_UNIFIED=off` is silently ignored | delegate to `parseFlagTristate` | `SPECKIT_MEMORY_GRAPH_UNIFIED=off` now returns `graphUnified: false` |
| `capability-flags.ts` `isStatusCompletionConsistencyGateEnabled` (`:219-222`) | Recognizes only `true`/`1` as opt-in, so `=on` is silently ignored | delegate to `parseFlagTristate` | `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` now returns `true` |
| `capability-flags.ts` 6 remaining standalone functions | Each hand-rolls its own subset of true/false/0/1/off vocabulary | delegate to `parseFlagTristate` with each function's existing default | per-function test: unset behavior unchanged, previously-missing vocabulary member now recognized |
| `bfs-traversal.ts` + `causal-boost.ts` (`SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES`) | Two independent hand-rolled parses of the same env var, true/1 only | both delegate to `parseFlagTristate('SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES', false)` | grep confirms identical call in both files; a test sets the env var once and asserts both imports agree |
| `memory-retention-sweep.ts` (`SPECKIT_SOFT_DELETE_TOMBSTONES`) | Recognizes only the literal string `'true'`, not even `'1'` | delegate to `parseFlagTristate` | `'1'`, `'yes'`, `'on'`, `'enabled'` now all enable it; unset still defaults false |
| `idempotency-receipts.ts` (`SPECKIT_MEMORY_IDEMPOTENCY`) | Recognizes `1`/`true`/`yes`/`on` but not `enabled` | delegate to `parseFlagTristate` | `enabled` now recognized; unset still defaults false |
| `adaptive-ranking.ts` `isAdaptiveFlagEnabled` (`:189-198`) | Recognizes only `false`/`0` disable, `true`/`1` enable; also independently re-parses `SPECKIT_MEMORY_ADAPTIVE_RANKING` already parsed in `capability-flags.ts` | delegate to `parseFlagTristate('SPECKIT_MEMORY_ADAPTIVE_RANKING', false)`, matching the `capability-flags.ts` call | both call sites agree for the same env var across the full vocabulary |
| `retrieval-rescue.ts` `envFlagExplicitFalse` (`:95-97`) | Recognizes only the literal `'false'`, not even `'0'` | reshape to call `!parseFlagTristate(name, true)` so it inherits the full opt-out vocabulary | `'0'`, `'off'`, `'no'`, `'disabled'` now all trigger the explicit-false path |
| `folder-discovery.ts` (2 sites: `DESCRIPTION_REPAIR_MERGE_SAFE`, `isGeneratedMetadataZExclusionEnabled`) | Both recognize only `false`/`0` opt-out | delegate to `parseFlagTristate` | `off`/`no`/`disabled` now also opt out; unset still defaults true |
| `stage2-fusion.ts` `isShadowLearningModelLoadEnabled` (`:170-172`) | Recognizes only the literal `'true'`, not even `'1'` | delegate to `parseFlagTristate('SPECKIT_SHADOW_LEARNING', false)` | `'1'`, `'yes'`, `'on'`, `'enabled'` now all enable it |
| `graph-lifecycle.ts` inline `SPECKIT_ENTITY_LINKING` guard (`:600-604`) | Duplicates the already-exported `isEntityLinkingEnabled()` getter instead of calling it | import and call `isEntityLinkingEnabled()` from `search-flags.ts` | grep shows no remaining literal `process.env.SPECKIT_ENTITY_LINKING` outside `search-flags.ts`; behavior now matches the canonical getter for every vocabulary value |
| `isFeatureEnabled()` (`rollout-policy.ts:59-73`) and its 5 hand-rolled duplicate sites | Backs ~50 default-ON flags; recognizes only `false`/`0` | **not touched** | out of scope, reasoned in spec.md §3 |

Required inventories:
- Same-class producers: `rg -n "process\.env\[.*\]\?\.(trim\(\)\.toLowerCase\(\)|toLowerCase\(\)\.trim\(\))|process\.env\.[A-Z_]+\?\.(trim\(\)\.toLowerCase\(\)|toLowerCase\(\)\.trim\(\))" .opencode/skills/system-spec-kit/mcp_server/lib --type ts`.
- Consumers of changed symbols: `rg -n "isOptInEnabled|parseFlagTristate" .opencode/skills/system-spec-kit/mcp_server` (confirm no caller assumed the old opt-in-only shape of `isOptInEnabled`).
- Matrix axes: 5 opt-in values x 2 case/whitespace variants, 5 opt-out values x 2 case/whitespace variants, unset, empty string, one garbage value — run against both `defaultValue: true` and `defaultValue: false`.
- Algorithm invariant: for every migrated site, the unset-env-var result after migration equals the unset-env-var result before migration (REQ-004's regression gate); only previously-unrecognized vocabulary members change behavior.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-run the audit grep from spec.md §3 against the current tree to confirm the 18-site / 10-file inventory has not drifted since spec authoring
- [ ] Capture each migrated site's CURRENT default (unset-env-var) behavior as a baseline, one assertion per site, before any code changes
- [ ] Confirm `search-flags.ts` has no import cycle risk from the sibling files that will need to import `parseFlagTristate` (e.g. `lib/governance/`, `lib/storage/`, `lib/graph/` importing from `lib/search/`)

### Phase 2: Core Implementation
- [ ] Add `FALSY_OPT_OUT` set and `parseFlagTristate(envVarName, defaultValue)` to `search-flags.ts`, next to `isOptInEnabled()`
- [ ] Re-express `isOptInEnabled()` as `parseFlagTristate(name, false)`
- [ ] Migrate the 8 `capability-flags.ts` sites, including the two confirmed bugs
- [ ] Migrate the 10 sibling-file sites (including the two duplicate pairs migrated together with identical env var + default)
- [ ] Fix `graph-lifecycle.ts` to call `isEntityLinkingEnabled()` instead of re-parsing `SPECKIT_ENTITY_LINKING`

### Phase 3: Verification
- [ ] `parseFlagTristate()` direct test proves the full 10-value vocabulary plus unset/empty/garbage against both default polarities
- [ ] `SPECKIT_MEMORY_GRAPH_UNIFIED=off` now disables `graphUnified`; `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` now enables the gate
- [ ] Every migrated site's Phase 1 baseline (unset behavior) still holds after migration
- [ ] The two duplicate pairs agree across the full vocabulary
- [ ] Full vitest run for every touched file, zero regressions against the pre-change baseline
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseFlagTristate()` direct: full vocabulary matrix, both default polarities | new test file or a section in `tests/search-flags.vitest.ts` |
| Regression | Per migrated site: unset-behavior unchanged, previously-missing vocabulary member now recognized | additions to the site's existing test file (`tests/memory-roadmap-flags.vitest.ts`, `tests/search-flags.vitest.ts`, and new/existing suites for the sibling files) |
| Integration | The two confirmed bugs, exercised through the public getter, not the internal helper | `tests/memory-roadmap-flags.vitest.ts` (`graphUnified`), a new or existing capability-flags suite (`isStatusCompletionConsistencyGateEnabled`) |
| Duplicate-pair | Both copies of a duplicate pair agree for the same env var across the vocabulary | new test importing both call sites |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `isOptInEnabled()` / `TRUTHY_OPT_IN` (`search-flags.ts:33-46`) | Internal | Green | None, `parseFlagTristate` extends the existing pattern in the same file |
| `028/016-cross-package-flag-governance` precedent migration | Internal | Green (COMPLETE) | None, proves the delegation shape works for one flag already |
| Packets `019-023` (this batch) | Downstream | Blocked on this packet | Those packets' default-flip work has no reliable parser to flip against until this lands |
| `isFeatureEnabled()` / `rollout-policy.ts` | Internal, out of scope | Untouched | None for this packet; a future packet inherits the reasoning recorded in spec.md §3 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A migrated site's default (unset-env-var) behavior changes, or a duplicate pair disagrees after migration.
- **Procedure**: Revert the specific site's function body to its pre-migration inline comparison (each migration is a self-contained, single-function diff), leaving `parseFlagTristate()` and any already-correct sites in place. Because every migrated function keeps its name and signature, no caller needs to change during a partial rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 5-8 hours |
| Verification | Med | 3-5 hours |
| **Total** | | **9-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline unset-behavior captured for all 18 migrated sites before any change
- [ ] The two confirmed-bug regression tests staged and failing against the pre-migration code (proving they exercise the real bug, not a tautology)
- [ ] Duplicate-pair agreement test staged

### Rollback Procedure
1. Identify the specific migrated site whose behavior regressed
2. Revert that single function's body to its pre-migration inline comparison
3. Leave `parseFlagTristate()` and every other already-migrated site in place
4. Re-run the full vitest suite to confirm the partial rollback restores the prior behavior for the reverted site only

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, this is a parsing-layer fix with no persisted state
<!-- /ANCHOR:enhanced-rollback -->

---
