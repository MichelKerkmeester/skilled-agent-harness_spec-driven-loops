---
title: "Feature Specification: Phase 1: reclaim the DeepSeek-direct models"
description: "pi-cache-optimizer carries a predicate whose only job is to make it decline two models, plus a fixture, a helper and two cross-extension tests that exist to prove a duplicated allowlist has not drifted. Deleting the carve-out and unloading the other extension in the same change hands those two models to one owner without a window where both act or neither does."
trigger_phrases:
  - "reclaim deepseek direct ownership"
  - "remove isdeeppiowned carve-out"
  - "shared ownership fixture removal"
  - "atomic ownership flip"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/001-reclaim-deepseek-direct-ownership"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped and independently verified"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - ".pi/extensions/shared/deepseek-ownership.json"
      - ".pi/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-001-reclaim-deepseek-direct-ownership"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Only the two ownership-composition tests import the shared fixture and helper, so both can go with the split"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: reclaim the DeepSeek-direct models

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

`pi-cache-optimizer` declines two models — `deepseek/deepseek-v4-flash` and `deepseek-v4-pro` —
through a predicate that exists only to keep them for a sibling extension. This phase deletes that
predicate and, in the same change, stops loading the sibling, so the two models move from one owner
to the other with no window in which both act or neither does.

**Key Decisions**: the flip is atomic; the shared fixture and composition helper go with the split they policed.

**Critical Dependencies**: none — this is the first phase.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | None |
| **Successor** | 002-port-cache-economics |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the parent decomposition.

**Scope Boundary**: the ownership boundary itself — the predicate, its call sites, the machinery
that policed the duplicated allowlist, and the enabled-package entry that keeps the sibling loaded.
No cache behavior is added or changed here; that is phases 002-004.

**Dependencies**: none.

**Deliverables**:
- One extension acting on every model Pi can reach.
- No fixture, helper or test whose only purpose is to police a two-extension split.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`isDeepPiOwned` (`index.ts:1462`) returns true for exactly `provider === 'deepseek'` with id
`deepseek-v4-flash` or `deepseek-v4-pro`, and is the first statement in six hooks — `session_start`,
`model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response` and
`message_end` — where it forces an early return. The same allowlist is written again inside the
sibling extension, and three artefacts exist purely to prove the two copies agree: a shared fixture,
a one-owner composition helper, and a composition test in each extension that loads both at once.

Removing the predicate alone would leave both extensions acting on those two models. Unloading the
sibling alone would leave them acted on by neither, because the carve-out is unconditional. The two
changes are one change.

### Purpose

The two DeepSeek-direct models are handled by `pi-cache-optimizer` like every other model, and
nothing in the tree exists to police an ownership split.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The `isDeepPiOwned` definition, its six early-return call sites, and its export.
- The tests that assert the split: both `ownership-composition.test.ts` files, the guard-ordering tests in `hook-guards.test.ts`, and the boundary test in `review-findings.test.ts`.
- The shared fixture and composition helper, now unimported.
- The `extensions/deep-pi` entry in `.pi/settings.json`, removed so the sibling stops loading.
- The fork provenance record, which currently describes the carve-out as the reason the fork exists.

### Out of Scope

- **The `deep-pi` directory itself** — phase 005 removes it. This phase only stops it loading.
- **`isDeepSeekLikeModel`** — a different, broader predicate that drives proxy compat warnings. It stays exactly as it is.
- **Any cache behavior change.** After this phase the two models get the same treatment every other model already gets, no more.
- **Historical records** naming the carve-out.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Delete `isDeepPiOwned` (:1462), its export (:7172) and six early returns (:8008, :8026, :8038, :8162, :8225, :8293) |
| `.pi/extensions/pi-cache-optimizer/tests/ownership-composition.test.ts` | Delete | Exists only to prove the split holds |
| `.pi/extensions/deep-pi/tests/ownership-composition.test.ts` | Delete | The sibling half of the same proof |
| `.pi/extensions/pi-cache-optimizer/tests/hook-guards.test.ts` | Modify | Drop the six guard-ordering tests; keep any test not about the carve-out |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | Modify | Drop the single boundary test for the predicate |
| `.pi/extensions/shared/deepseek-ownership.json` | Delete | Unimported once both composition tests are gone |
| `.pi/extensions/shared/composition/one-owner.ts` | Delete | Same |
| `.pi/extensions/shared/**/README.md` | Modify/Delete | Only where a README documents the removed helper |
| `.pi/settings.json` | Modify | Remove `extensions/deep-pi` from `packages` |
| `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` | Modify | Record that the guard patch is reverted and why; a provenance checker reads this file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The six hooks execute for `deepseek/deepseek-v4-flash` and `deepseek/deepseek-v4-pro` |
| REQ-002 | `isDeepPiOwned` has no definition, call site or export anywhere in the extension |
| REQ-003 | Exactly one extension acts on those two models at every point in the change, never two and never none |
| REQ-004 | Behavior for every other provider and model is unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | No fixture, helper or test remains whose only purpose is policing the split |
| REQ-006 | The fork provenance record describes the fork as it now is |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm --prefix .pi/extensions/pi-cache-optimizer run check` exits 0.
- **SC-002**: A live Pi session loads every enabled extension with no load failure.
- **SC-003**: `grep -rn "isDeepPiOwned"` over the extension returns nothing outside historical records.
- **SC-004**: The provenance checker passes against the updated record.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Predicate removed while the sibling still loads | High — both extensions act on the same request, double-counting stats and rewriting a prompt twice | The settings entry and the predicate are removed in the same change; a live session check confirms only one extension reacts |
| Risk | Sibling unloaded while the carve-out stands | High — the two models get no cache handling at all | Same atomicity; SC-002 checks a real session rather than the diff |
| Risk | Deleting a guard test reads as deleting coverage | Medium | The tests assert an ownership split that no longer exists; behavior coverage for the six hooks stays |
| Risk | `isDeepSeekLikeModel` removed by mistake alongside the similarly named predicate | Medium | Named explicitly as out of scope; it drives compat warnings for proxy routes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `.pi/extensions/shared/` retains any purpose once the composition helper is gone. Read its remaining contents before deleting the directory itself.
<!-- /ANCHOR:questions -->
