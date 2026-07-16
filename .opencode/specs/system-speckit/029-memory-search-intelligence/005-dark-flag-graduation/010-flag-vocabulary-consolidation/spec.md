---
title: "Feature Specification: Flag Vocabulary Consolidation [template:level_2/spec.md]"
description: "Hand-rolled boolean env-flag parsing across capability-flags.ts and consuming modules accepts inconsistent vocabulary between flags. SPECKIT_MEMORY_GRAPH_UNIFIED=off is silently ignored (stays on) and SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on silently stays off, with no error either way. A shared parseFlagTristate() helper replaces the hand-rolled comparisons so every migrated flag accepts the same vocabulary."
trigger_phrases:
  - "flag vocabulary consolidation"
  - "parseFlagTristate shared helper"
  - "SPECKIT_MEMORY_GRAPH_UNIFIED off ignored"
  - "STATUS_COMPLETION_CONSISTENCY_GATE on ignored"
  - "hand-rolled env flag parsing"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-dark-flag-graduation/010-flag-vocabulary-consolidation"
    last_updated_at: "2026-07-09T23:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Migrated all 18 sites onto parseFlagTristate, fixed both confirmed bugs, verified clean"
    next_safe_action: "None — packet complete. See implementation-summary.md for the follow-up candidates"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether the five identified duplicate-of-isFeatureEnabled sites (Out of Scope) should be resolved by a follow-up packet that touches rollout-policy.ts, or by collapsing each duplicate onto its search-flags.ts canonical getter"
    answered_questions:
      - "Whether rollout-policy.ts's isFeatureEnabled() is in scope: NO, its ~50-flag blast radius and rollout-percent bucketing semantics make it a separate packet's concern (see Out of Scope)"
---
# Feature Specification: Flag Vocabulary Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `017-flag-vocabulary-consolidation` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../009-cross-package-flag-governance/spec.md |
| **Successor** | ../011-graph-preservation-quality-benchmark/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` and a set of consuming modules each hand-roll their own `process.env[...]?.trim().toLowerCase()` comparison instead of delegating to a shared parser, and the accepted vocabulary differs flag-to-flag with no operator-visible signal when a value falls outside it. Two confirmed silent-failure bugs prove the pattern is not cosmetic:

1. **`SPECKIT_MEMORY_GRAPH_UNIFIED=off` is silently ignored, the capability stays ON.** `hasExplicitDisableFlag()` (`capability-flags.ts:266-275`) recognizes only `'false'` and `'0'` as a disable signal. `isMemoryRoadmapCapabilityEnabled()` (`capability-flags.ts:285-308`), which backs `CAPABILITY_ENV.graphUnified = 'SPECKIT_MEMORY_GRAPH_UNIFIED'` (`capability-flags.ts:260`, wired at `capability-flags.ts:326-329`), calls `hasExplicitDisableFlag` first; when it returns `false` for `'off'`, the function falls through its true/1 check (also `'off'` does not match) and lands on `isFeatureEnabled(canonicalFlag, ...)` (`capability-flags.ts:307`), which itself only recognizes `'false'`/`'0'` as disable (`rollout-policy.ts:59-62`). The operator sets `off`, gets no error, and the capability stays enabled. The existing test suite proves the gap is real: `tests/memory-roadmap-flags.vitest.ts:70-78` exercises only the `'false'` value against this flag, never `'off'`.
2. **`SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` is silently ignored, the gate stays OFF.** `isStatusCompletionConsistencyGateEnabled()` (`capability-flags.ts:219-222`) recognizes only `rawValue === 'true' || rawValue === '1'` as an opt-in signal. `'on'` matches neither, so the function returns `false` (its default-off report mode) even though the operator explicitly asked to enable enforcement. No error surfaces either.

Both bugs share one root cause: every hand-rolled site invents its own subset of an opt-in/opt-out vocabulary instead of calling a single shared parser. The repo already has the correct shared helper — `isOptInEnabled()` in `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:43-46` — which accepts the full opt-in set `{true, 1, yes, on, enabled}` via `TRUTHY_OPT_IN` (`search-flags.ts:33`). Exactly one existing flag, `isQueryTimeExistenceFilterEnabled()` (`capability-flags.ts:251-253`), already delegates to it; that migration shipped as packet `028/016-cross-package-flag-governance` (COMPLETE) and is the direct precedent this packet generalizes. `isOptInEnabled()` has no opt-out-side counterpart today (nothing recognizes `no`/`disabled` as a falsy synonym for `false`/`0`/`off`), so a new `parseFlagTristate()` helper is needed to cover both directions and the default-ON flags that need an opt-OUT vocabulary rather than opt-in.

A pre-authoring audit of `.opencode/skills/system-spec-kit/mcp_server/lib/` (grep for `process.env[...]` fed through inline `.trim().toLowerCase()` comparisons, evidence in §3 Scope Refinement Note) found the hand-rolled pattern in far more files than the two confirmed bugs alone, several with even narrower vocabulary gaps than the two named above (e.g. `lib/search/rerank/retrieval-rescue.ts:96-97` recognizes only `'false'`, not even `'0'`; `lib/governance/memory-retention-sweep.ts:166` recognizes only the literal string `'true'`, not `'1'`).

### Purpose

Every SPECKIT_* boolean flag in the audited set accepts the same opt-in vocabulary (`true`/`1`/`yes`/`on`/`enabled`) and the same opt-out vocabulary (`false`/`0`/`no`/`off`/`disabled`), case-insensitively and whitespace-tolerant, through one shared helper — so an operator who sets a flag to a value inside that vocabulary gets the behavior they asked for, every time, with no flag-specific guessing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a shared `parseFlagTristate(envVarName, defaultValue)` helper to `lib/search/search-flags.ts` (alongside the existing `isOptInEnabled()` and its `TRUTHY_OPT_IN` set), accepting the full opt-in vocabulary `{true, 1, yes, on, enabled}` and a new mirrored opt-out vocabulary `{false, 0, no, off, disabled}`; unset or unrecognized values resolve to the caller-supplied `defaultValue`.
- Fix the two confirmed silent-failure bugs (`isMemoryRoadmapCapabilityEnabled`'s disable path for `graphUnified`, `isStatusCompletionConsistencyGateEnabled`) by migrating them onto the shared helper.
- Migrate every other **standalone** hand-rolled boolean site found in the audit (§ Scope Refinement Note) — one with no independent `isFeatureEnabled()`-backed twin reading the same env var elsewhere — onto `parseFlagTristate()`, preserving each site's current default (true or false) exactly; only the accepted vocabulary widens, no flag's default polarity changes.
- Fix `lib/search/graph-lifecycle.ts:601-602`, an inline duplicate re-parse of `SPECKIT_ENTITY_LINKING` that already has a canonical getter (`isEntityLinkingEnabled()`, `search-flags.ts:364-366`), by calling the existing getter instead of hand-rolling a second parse (reuse, not a new vocabulary site).
- Migrate the two identified hand-rolled **duplicate pairs** (same env var, two independent parses, neither backed by `isFeatureEnabled()`) to identical `parseFlagTristate()` calls so the pair can no longer diverge: `SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES` (`lib/graph/bfs-traversal.ts:112-115` and `lib/search/causal-boost.ts:103-106`) and `SPECKIT_MEMORY_ADAPTIVE_RANKING` (`capability-flags.ts` roadmap path and `lib/cognitive/adaptive-ranking.ts:189-198,344`).
- Add test coverage proving the full 10-value vocabulary (5 opt-in, 5 opt-out) round-trips through `parseFlagTristate()` directly, plus targeted regression tests for the two confirmed bugs (`SPECKIT_MEMORY_GRAPH_UNIFIED=off` now disables; `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` now enables).

### Out of Scope

- **`isFeatureEnabled()` itself** (`lib/cognitive/rollout-policy.ts:59-73`), the shared default-ON helper backing roughly 50 flags exported from `search-flags.ts`. It only recognizes `'false'`/`'0'` as disable and has no `'off'` support either, but it also performs rollout-percentage bucketing that a naive vocabulary widening must not silently break. Its blast radius (every default-ON graduated flag in the search pipeline) puts it outside this P0's reviewable diff size; it is a follow-up packet candidate, referenced in Risks & Dependencies.
- **Five hand-rolled sites that duplicate an `isFeatureEnabled()`-backed canonical getter for the same env var**: `lib/validation/save-quality-gate.ts:322-326` (twin: `search-flags.ts:513-515`), `lib/search/progressive-disclosure.ts:270-272` (twin: `search-flags.ts:618-620`), `lib/feedback/feedback-ledger.ts:128-130` (twin: `search-flags.ts:477-479`), `lib/cognitive/fsrs-scheduler.ts:414-416` (twin: `search-flags.ts:503-505`), `lib/feedback/shadow-scoring.ts:156-158` (twin: `search-flags.ts:605-607`). Migrating only the duplicate copy while leaving its `isFeatureEnabled()`-backed twin untouched would create a **new** cross-path vocabulary asymmetry for the same env var — the exact class of bug this packet exists to remove — so these five wait on the `isFeatureEnabled()` decision above.
- Any change to a flag's **default** enabled/disabled state. This packet only widens accepted vocabulary; it makes no promotion or graduation claim for any flag.
- `SPECKIT_GRAPH_WALK_ROLLOUT`, `SPECKIT_SAVE_PLANNER_MODE`, `SPECKIT_GRAPH_REFRESH_MODE`, `SPECKIT_CALIBRATION_PROFILE_NAME` and other **non-boolean, multi-value enum** env vars (`search-flags.ts:143-151,290-303,550-552`; `graph-calibration.ts:406`). These resolve to a named mode string, not a boolean, and are a different parsing shape entirely.
- Packets 019-023 and any default-flip work that depends on this packet landing first.

### Scope Refinement Note (audit vs. initial estimate)

The task framing that opened this packet estimated "~25 hand-rolled boolean sites across 6 files." The pre-authoring grep audit (`rg -n "process\.env\[.*\]\?\.(trim\(\)\.toLowerCase\(\)|toLowerCase\(\)\.trim\(\))" lib --type ts`, plus the equivalent `process.env.SPECKIT_*?...` literal form) found the pattern in more files than that, with two buckets:

- **10 files carrying standalone hand-rolled sites safe to migrate now** (no `isFeatureEnabled()` twin for the same env var): `capability-flags.ts` (8 sites: `isIdentityMergeSafetyEnabled`, `isGeneratedMetadataGrandfatherEnabled`, `isGeneratedMetadataDriftGateEnabled`, `isGeneratorHardeningEnabled`, `isIdempotentDescriptionWritesEnabled`, `isStatusCompletionConsistencyGateEnabled`, plus `hasExplicitDisableFlag` and its paired true/1 check inside `isMemoryRoadmapCapabilityEnabled`), `lib/graph/bfs-traversal.ts` (1), `lib/search/causal-boost.ts` (1), `lib/governance/memory-retention-sweep.ts` (1), `lib/storage/idempotency-receipts.ts` (1), `lib/cognitive/adaptive-ranking.ts` (1), `lib/search/rerank/retrieval-rescue.ts` (1), `lib/search/folder-discovery.ts` (2), `lib/search/pipeline/stage2-fusion.ts` (1), `lib/search/graph-lifecycle.ts` (1, reuse-fix not a new vocabulary site) — 18 sites total.
- **5 files excluded** because their hand-rolled parse duplicates an `isFeatureEnabled()`-backed canonical getter for the same env var (see Out of Scope).

This spec documents the audited reality (11 files touched: the 10 above plus `search-flags.ts` gaining the new helper) rather than forcing the original 6-file estimate; the delta is new information surfaced during spec authoring, not a contradiction of an already-approved plan.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The system SHALL expose a `parseFlagTristate(envVarName: string, defaultValue: boolean): boolean` helper in `lib/search/search-flags.ts` that recognizes `{true, 1, yes, on, enabled}` (case-insensitive, trimmed) as `true`, `{false, 0, no, off, disabled}` as `false`, and returns `defaultValue` for anything else including unset. | A direct unit test feeds all 10 recognized values plus unset, empty-string, and one garbage value against both a `defaultValue: true` and a `defaultValue: false` call and asserts every result. |
| REQ-002 | WHEN `SPECKIT_MEMORY_GRAPH_UNIFIED` is set to `off` (or any recognized opt-out value), `getMemoryRoadmapCapabilityFlags().graphUnified` SHALL be `false`. | `tests/memory-roadmap-flags.vitest.ts` gains a case setting the env var to `'off'` and asserts `graphUnified === false`; the existing `'false'` case in the same file continues to pass unchanged. |
| REQ-003 | WHEN `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` is set to `on` (or any recognized opt-in value), `isStatusCompletionConsistencyGateEnabled()` SHALL return `true`. | A test sets the env var to `'on'` and asserts `true`; unset continues to resolve to `false` (report mode), preserving the documented default-off backlog-safety behavior. |
| REQ-004 | Every standalone hand-rolled site listed in the Scope Refinement Note SHALL delegate to `parseFlagTristate()` with a `defaultValue` matching that site's current documented default; no site's default polarity SHALL change as a result of this migration. | For each migrated function, a test asserts the unset-env-var result is unchanged from its pre-migration behavior, and a new test asserts the previously-unrecognized vocabulary member (e.g. `off` for a true/1-only opt-in flag, or `yes`/`enabled` for a false/0-only opt-out flag) now parses correctly. |
| REQ-005 | The two hand-rolled duplicate pairs (`SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES`, `SPECKIT_MEMORY_ADAPTIVE_RANKING`) SHALL each have both copies call `parseFlagTristate()` with the identical env var name and default value. | Grep confirms both files for each pair call `parseFlagTristate('<SAME_ENV_VAR>', <SAME_DEFAULT>)`; a test sets the env var once and asserts both call sites (imported independently) agree. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `lib/search/graph-lifecycle.ts`'s inline `SPECKIT_ENTITY_LINKING` guard SHALL call the existing `isEntityLinkingEnabled()` export from `search-flags.ts` instead of re-parsing the env var independently. | Grep shows no remaining `process.env.SPECKIT_ENTITY_LINKING` literal outside `search-flags.ts`; a test with `SPECKIT_ENTITY_LINKING` set to a value the old inline check misparsed (e.g. `off`) now agrees with `isEntityLinkingEnabled()`. |
| REQ-007 | `isOptInEnabled()` (`search-flags.ts:43-46`) SHALL be re-expressed as a thin wrapper over `parseFlagTristate(name, false)` with zero behavior change, so the opt-in-only and opt-out-only helpers share one implementation. | The existing `isOptInEnabled` test suite (`tests/search-flags.vitest.ts`) passes unchanged after the refactor; no new test failures. |
| REQ-008 | The five duplicate-of-`isFeatureEnabled()` sites and `isFeatureEnabled()` itself SHALL remain untouched by this packet, with the exclusion reasoning recorded so a follow-up packet can pick it up without re-deriving the analysis. | This spec's Out of Scope section (§3) stands as the recorded reasoning; no code change touches `rollout-policy.ts` or the five listed files. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_MEMORY_GRAPH_UNIFIED=off` disables the graph-unified capability and `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` enables the consistency gate — both proven by a passing test, not just a code read.
- **SC-002**: Every migrated flag (18 sites across 10 consuming files, plus the new helper in `search-flags.ts`) accepts the full 10-value vocabulary with no default-polarity change, proven by the per-site tests in REQ-004.
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and the full `vitest` suite for the touched files both pass with zero regressions against the pre-change baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packets `019-023` (this batch) | Those packets flip flag defaults; if this packet has not landed, a flipped default may still be unreachable through an inconsistent parser. | This packet is the named prerequisite (see plan.md sequencing); 019-023 do not start until this validates clean. |
| Precedent | `028/016-cross-package-flag-governance` (COMPLETE) | Already proved the `isOptInEnabled()` migration pattern for one flag (`isQueryTimeExistenceFilterEnabled`); this packet generalizes it. | Follow the same helper-delegation shape, extended to the opt-out direction. |
| Risk | Migrating `isFeatureEnabled()` itself would touch ~50 flags in one diff. | High if attempted here; would make this P0 unreviewable and risk a rollout-percentage regression. | Explicitly out of scope (§3); flagged as a follow-up packet in REQ-008. |
| Risk | A migrated site's `defaultValue` is transcribed backwards (true swapped for false), silently flipping a flag's default. | High — would be the exact class of regression this packet must not introduce. | REQ-004's unset-env-var regression test on every migrated site is a P0 acceptance gate, not optional. |
| Risk | The five duplicate-of-`isFeatureEnabled()` sites get "fixed" by a future contributor without reading this spec's Out of Scope reasoning, reintroducing the cross-path asymmetry this packet avoids. | Medium | The reasoning is recorded in §3 Out of Scope and REQ-008 so it is discoverable via `memory_search` / this spec file. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `parseFlagTristate()` performs one `process.env` read and one `Set.has()` lookup per call, matching the cost profile of the hand-rolled comparisons it replaces — no new I/O, no caching layer needed.

### Reliability
- **NFR-R01**: Every migrated site is read fresh on each call (no memoization), preserving the existing "a test can flip the behavior per-case" property documented on the sites in `capability-flags.ts`.
- **NFR-R02**: No migrated flag's default (unset-env-var) behavior changes; this is enforced per-site by REQ-004's regression test, not asserted only in prose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Mixed case and surrounding whitespace (`" On "`, `"FALSE"`) resolve the same as their trimmed-lowercase form, matching every hand-rolled site's existing `.trim().toLowerCase()` behavior.
- An env var set to an empty string (`SPECKIT_FOO=`) is unrecognized and resolves to `defaultValue`, matching current behavior (`process.env.FOO` is `''`, `''.trim()` is `''`, which matches neither vocabulary set).
- A value outside both vocabularies (e.g. `SPECKIT_FOO=maybe`) resolves to `defaultValue`, never throws.

### Error Scenarios
- `process.env[envVarName]` is `undefined` (the common case): resolves to `defaultValue`, identical to every migrated site's current unset behavior.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One new shared helper, 18 call-site migrations across 10 consuming files, two confirmed-bug regression tests, one reuse-fix. |
| Risk | 10/25 | Every migrated site preserves its current default (REQ-004 gate); the highest-blast-radius surface (`isFeatureEnabled()`) is explicitly excluded. |
| Research | 10/20 | Confirmed via direct file reads and a repo-wide grep audit, not inferred; both named bugs traced to exact file:line and reproduced by hand-tracing the call chain. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the five identified duplicate-of-`isFeatureEnabled()` sites should be resolved by a future packet that widens `isFeatureEnabled()`'s own vocabulary (touching all ~50 of its flags at once) or by collapsing each duplicate onto its `search-flags.ts` canonical getter (a smaller, per-flag dedup) — deferred, not blocking this packet.

### Verdict
GO. Two confirmed, reproducible silent-failure bugs plus a real, evidence-backed vocabulary inconsistency across a well-scoped set of standalone sites, with a precedent migration (016) already proving the pattern. The highest-blast-radius surface is explicitly and reasoned-ly excluded rather than papered over.
<!-- /ANCHOR:questions -->
