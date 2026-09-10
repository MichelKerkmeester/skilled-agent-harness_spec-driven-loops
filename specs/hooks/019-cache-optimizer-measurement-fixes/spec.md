---
title: "Feature Specification: cache optimizer measurement and pricing fixes"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cache optimizer measurement and pricing fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-09 |
| **Branch** | `scaffold/hooks/019-cache-optimizer-measurement-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An eight-iteration, three-model research loop found that the cache extension cannot tell a real
cache miss from an absent cache signal, and that two distinct defects were hiding under that one
description:

- **Omitted fields.** A response with input tokens but no cache fields is synthesized to zero and
  counted as a miss (`index.ts:2495`, and the raw readers at `:2541`, `:2567`, `:2610`).
- **Defined all-zero usage.** Flagged at `index.ts:9483` but still counted at `:4188`.
  `hasMissingUsageFields` returns `false` whenever `input > 0` (`:4280-4282`), so a fix aimed at
  the second case never reaches the first.

Everything downstream inherits the ambiguity: hit rate, denominator, and the savings figure the
extension exists to produce. Separately, a genuinely free cached-read rate is rejected as unpriced
because the predicate tests `<= 0` rather than `< 0` (`index.ts:4129`), so no economics ever runs.

### Purpose

The numbers the extension reports mean what they say: a miss is a measured miss, an unreported
signal is visible as unmeasured, and a zero price is a price.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Five work items, executed in the order below. Each is independently shippable and gated.

| # | Item | Why this position |
|---|------|-------------------|
| W1 | Unreported cache signal is not a miss | Defines the vocabulary the rest are measured against |
| W2 | Accept an explicit `cacheRead: 0` | One predicate; unblocks economics once W1 makes aggregates trustworthy |
| W3 | `reportsCacheUsage` flag on `CacheCompat` | W1's only signal source if Pi synthesizes zeros upstream |
| W4 | Cross-turn stability before prefix lifting | Changes shipped prompt bytes; needs W1's measurement to evaluate |
| W5 | Persist the learned `prompt_cache_key` rejection | Independent; last because it is the smallest win |

### Out of Scope

- **Request-scoped router hints.** Mechanism confirmed, severity unreproduced. Gated on an operator
  answer about concurrency; not built on a guessed model.
- **The retry guard.** Two independent inspections found it correct after its earlier fix. Closed.
- **Any rewrite.** Changes fit the existing structure.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Classifier, counters, migration, compat flag, stability gate, persist path |
| `.pi/extensions/pi-cache-optimizer/tests/*.test.ts` | Modify/Create | A failing-first test and a negative control per item |
| `.pi/extensions/pi-cache-optimizer/README.md` | Modify | What the reported numbers now mean |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A response with input tokens and no cache fields records cost and tokens, and is excluded from the hit ratio rather than counted as a miss |
| REQ-002 | Defined all-zero usage is treated by the same rule, so both sub-cases are covered by one change |
| REQ-003 | An explicit zero cached-read rate prices as free; missing and negative stay unpriced |
| REQ-004 | An existing persisted record loads without loss and without a crash |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A model declaring it does not report cache usage routes to unmeasured, never to miss |
| REQ-006 | ~~A candidate prefix is lifted only after being observed unchanged across turns~~ — **withdrawn**: measurement showed the prefix is already stable from turn one, so the gate prevented nothing and cost a break per session |
| REQ-007 | A learned key rejection survives a process restart |

> Acceptance criteria live in `acceptance-criteria.md`, which decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each item has a test that fails before its change and passes after, plus a negative control.
- **SC-002**: `npm --prefix .pi/extensions/pi-cache-optimizer run check` exits 0 at every gate.
- **SC-003**: A pre-change stats record still loads after the migration.
- **SC-004**: The reported hit rate changes only where the signal was genuinely unreported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The naive W1 fix drops cost too | High — understates Baseline and Savings, worse than the bug | Two counters on one path: cost always records, only the ratio excludes. Asserted by test |
| Risk | Pi synthesizes zeros before the extension sees them | High — W1 cannot then distinguish at all | W3 supplies the declaration; the open question below decides how much of W1 is reachable |
| Risk | W4 alters shipped prompt bytes | Medium/high — first turn becomes conservative | Land after W1 so the effect is measurable; A/A/B/B sequence test with session isolation |
| Risk | Migration drops existing counters | Medium | A pre-change record is loaded in test and its counters asserted |
| Dependency | W2 meaning of a zero rate | Blocks W2 | Operator question below |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1 (gates how much of W1 is achievable).** Can Pi expose raw provenance distinguishing an
  omitted cache field from an explicit zero? If it cannot, W1 depends entirely on W3's declaration.
- **Q2 (gates W2).** Does the model registry mean `cacheRead: 0` as *free*, or as *unknown*?
- **Q3 (gates the deferred router-hint item).** Is `requestId` stable across `before_agent_start`,
  provider requests, retries, and multi-request turns?
<!-- /ANCHOR:questions -->

---


