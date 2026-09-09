---
title: "Implementation Plan: cache optimizer measurement and pricing fixes"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cache optimizer measurement and pricing fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five sequenced work items against one extension file. Not phase-decomposed: the deterministic
scorer puts this at level 2 with a phase score of 10 of 50 against a threshold of 25, and phasing
requires both thresholds independently. The sequencing below is the plan; child folders would add
ceremony without separation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 4. QUALITY GATES

Run at each item's boundary, not once at the end. An item does not land until its own gate passes.

| Gate | Threshold |
|------|-----------|
| `npm --prefix .pi/extensions/pi-cache-optimizer run check` | exit 0 |
| Failing-first evidence | the new test fails with the change reverted, passes with it applied |
| Negative control | the neighbouring behavior it must not alter is asserted unchanged |
| Migration | a pre-change stats record loads with counters intact |
| Comment hygiene | no artifact ids or spec paths in changed code |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

**W1 first, because it defines the vocabulary.** Classification moves to field presence rather than
value, so an absent signal is distinguishable from a measured zero. Two counters on one code path:
cost and token totals always record; only the hit ratio's numerator and denominator exclude an
unreported sample. A new `unmeasuredRequests` counter makes the exclusion visible instead of silent,
and `totalRequests` keeps its current meaning so no existing reader shifts under it.

**W2 is one predicate.** `<= 0` becomes a missing-or-negative test, so an authoritative zero prices
as free. The cost arithmetic already handles a zero rate.

**W3 is one flag.** `reportsCacheUsage` on `CacheCompat`. It is not a substitute for W1 and is not
merged into it: W1 handles the per-response case, W3 covers the case where the host synthesizes
zeros before the extension can see anything.

**W4 gates prefix lifting on cross-turn stability**, keeping authorization state separate from churn
state. It lands after W1 so its effect on hit rate is measurable rather than asserted.

**W5 persists the learned rejection.** Today it is an in-process set, so every restart re-learns by
spending a 400.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING

Per item: one test that fails before and passes after, and one negative control. Specifically —
W1: `{input:500}` with no cache fields increments `unmeasuredRequests` and `totalInputTokens`,
records cost, and leaves `hitRequests` and the measured denominator untouched; controls are an
explicit `{cacheRead:0,cacheWrite:0,totalInput:500}` counting as one measured miss, and
`usage === undefined` adding nothing. W2: a zero rate prices, missing and negative stay unpriced.
W3: a model declaring no cache reporting lands in unmeasured, an unset flag changes nothing.
W4: an A/A/B/B turn sequence lifts only on the second observation, with session and model isolation.
W5: after a matching 400 and a restart, the next request omits the key without a second 400.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [System/Library] | [Internal/External] | [Green/Yellow/Red] | [Impact] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 3. ROLLBACK

Each item is its own commit, so `git revert <sha>` undoes one without disturbing the others. The
only forward-migrating change is W1's added counter; a reverted binary reading a newer record sees
an unknown field and ignores it, and a newer binary reading an older record defaults it to zero,
which is asserted by test.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [e.g., 4-8 hours] |
| Verification | [Low/Med/High] | [e.g., 1-2 hours] |
| **Total** | | **[e.g., 6-12 hours]** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

