---
title: "Feature Specification: Phase 2: measured cache economics for every model"
description: "The extension already counts cached, written and total input tokens per provider and persists them. It cannot say what any of that cost, what it saved, or whether the prompt prefix is churning. This phase adds pricing, real input cost, estimated savings against fully uncached input, and prefix-churn detection, and reports them through the command surface that already exists."
trigger_phrases:
  - "pi cache economics reporting"
  - "cache savings estimate"
  - "prefix churn detection"
  - "cache optimizer stats cost"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/002-port-cache-economics"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped and independently verified"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-002-port-cache-economics"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Extend the existing CacheStats and stats command rather than importing a second persistence schema and command"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: measured cache economics for every model

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

`CacheStats` already records requests, hits, and cached / written / total input tokens per day,
normalized per provider by existing adapters. It carries no notion of price, so it cannot report
what a session cost or what caching saved. This phase adds pricing, cost, savings and prefix-churn
detection to that existing record and surfaces them through the existing `stats` command.

**Key Decisions**: extend the record and command that exist; never estimate from request shape; count a no-cache-fields response as a full miss.

**Critical Dependencies**: phase 001 — the extension must already act on every model.

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
| **Predecessor** | 001-reclaim-deepseek-direct-ownership |
| **Successor** | 003-port-retry-loop-guard |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the parent decomposition.

**Scope Boundary**: measurement, persistence and reporting of cache economics. No change to prompt
rewriting, cache-key injection, compat warnings or `fix`.

**Dependencies**: phase 001 landed, so the two DeepSeek-direct models reach these hooks.

**Deliverables**:
- Cost, savings and churn recorded alongside the existing token counters.
- A report that presents them, with its own uncertainty stated.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`CacheStats` (`index.ts:265`) holds `day`, `totalRequests`, `hitRequests`, `cachedInputTokens`,
`cacheWriteInputTokens` and `totalInputTokens`, persisted to `pi-cache-optimizer-stats.json` and
rendered in the footer. Those are volumes. They answer "how many tokens were read from cache" and
never "what did this cost" or "what would it have cost uncached", which is the question a person
actually asks before deciding whether cache work was worth it.

Nothing tracks prefix churn either. A prompt prefix that changes between turns silently destroys
the hit rate, and today the only symptom is a number that drifts down with no attributable cause.

### Purpose

For any model Pi reaches, the extension can report cache-read versus uncached input tokens, hit
rate, actual input cost, estimated savings against fully uncached input, and detected prefix churn
— from real usage records rather than from the shape of the request.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A per-model pricing lookup, and the cost fields it makes possible.
- Extension of `CacheStats` with cost and savings, and the migration of existing persisted records.
- Prefix-churn detection across turns, recorded as a counter.
- Extension of the existing `cache-optimizer stats` output to render the economics.

### Out of Scope

- **A second persistence file or a second command.** The record and the command surface that exist are extended; a parallel `deep-pi-stats.json` and `/deeppi` are deliberately not reproduced.
- **Prompt rewriting, cache-key injection, compat warnings, `doctor` and `fix`** — untouched.
- **Any promise of a hit rate.** Provider cache expiry can miss on a stable prefix; the report says so rather than implying a guarantee.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Pricing lookup, cost and savings fields on `CacheStats`, churn counter, extended `stats` rendering, forward migration of existing records |
| `.pi/extensions/pi-cache-optimizer/tests/*.test.ts` | Create/Modify | Cost arithmetic, miss accounting, churn detection, migration of an old record |
| `.pi/extensions/pi-cache-optimizer/README.md` | Modify | Document the economics the command now reports and its stated uncertainty |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Cost and savings are computed from provider-reported usage records, never inferred from request shape |
| REQ-002 | A response carrying no cache fields counts as a full miss in the denominator, not a dropped sample |
| REQ-003 | An existing persisted stats record migrates forward without loss and without a crash |
| REQ-004 | The report renders for a non-DeepSeek model |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Prefix churn between turns is detected and counted |
| REQ-006 | The report states that provider cache expiry can produce a miss on a stable prefix |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm --prefix .pi/extensions/pi-cache-optimizer run check` exits 0 with new tests covering cost, miss accounting, churn and migration.
- **SC-002**: A live dispatch on the DevPass route renders hit rate, cost and savings from real records.
- **SC-003**: A pre-existing stats file from before this phase still loads.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pricing hardcoded and silently wrong as prices change | High — a confidently wrong cost is worse than none | Pricing is data, not literals in the hot path; an unknown price reports "unpriced" rather than zero |
| Risk | Savings computed against an invented baseline | High — a flattering number nobody can check | Baseline is explicitly "the same input tokens billed uncached", stated in the output |
| Risk | Migration drops existing counters | Medium | A test loads a pre-phase record and asserts the counters survive |
| Risk | Churn detection fires on legitimate context growth | Medium | Churn is counted and reported, never acted on; it changes no behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether pricing lives in the existing config file or a new data block. Decide from what the config already carries rather than adding a second source.
<!-- /ANCHOR:questions -->
