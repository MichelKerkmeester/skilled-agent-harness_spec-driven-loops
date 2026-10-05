---
title: "Decision Record: Gate 5 card pilot"
description: "Records the operator's waiver of the pre-registered sample size after the schedule was cut to a top-up."
trigger_phrases:
  - "gate 5 card pilot sample waiver"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Gate 5 card pilot

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Waive the pre-registered sample size

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-05 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-002-context -->
### Context

The pre-registration targets 180 runs per arm per executor. Executor quotas and rate limits stopped the schedule, and the operator chose a short top-up and a decision (`results/deviations.md` section 3). The pooled data holds 162 cards and 156 full runs, with 132 and 138 long replies, across four executor strata.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: waive AC-003 and keep the decision made by pre-registered rule 1 on the runs collected.

**How it works**: AC-003 is marked `Waived` against this record. Both rule-1 intervals already clear the +15-point margin at this sample: -15.5 to +7.6 on the primary and -3.3 to +7.9 on Gate 5 misses.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive with this record** | The decision stands on the data collected, and the shortfall stays recorded | The planned power is not reached | 8/10 |
| Finish the full schedule | Reaches the planned sample | Most of a day under executor rate limits, and it drained the Codex and Devin allowances twice | 4/10 |
| Leave the criterion Unmet | No waiver needed | The phase can never close | 2/10 |

**Why this one**: the operator chose the short top-up knowing it cut the schedule, and the result is decided by the rule as written.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

| Risk | Impact | Mitigation |
|------|--------|------------|
| A smaller true effect goes undetected | M | The live window after adoption measures the same metrics on real sessions |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**How to roll back**: set AC-003 back to Unmet. The decision then waits on further runs.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Hold the cards back from the live router

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-05 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-003-context -->
### Context

Pre-registered rule 1 permits cards (`results/decision.md`). On 2026-10-05 the operator ended further test rounds for the parent packet and asked for the final recommendations to be applied. Without live windows, cards would land together with Gate 6, the 007 wording and the 010 phrases, and nothing would measure them separately.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: keep the full rule files as the Gate 5 load and do not commit the 13 cards or switch the router.

**How it works**: the generator `build-rule-cards.cjs`, check 11 and the `ruleLinkDir` card credit stay in place, so the cards router can be built and checked again in minutes. Check 11 reports "no cards directory" and passes. REQ-006 removal does not apply, because the pre-registered rule did not reject cards.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hold the cards** | No unmeasured change to the Gate 5 load. Gate 6 lands without a second change to the reply-rule path | Keeps reading 29% more rule text per run | 7/10 |
| Adopt the cards now | Follows the permitted decision | The full rule was reopened after the card in 55.9% of runs, and reply-rule misses leaned +6.5 points (-4.3 to +17.2) against cards, the path Gate 6 fixes | 4/10 |
| Remove the pilot artifacts | Smaller checker | Throws away a working generator the rule did not reject | 3/10 |

**Why this one**: the saving is modest once fallback is counted, and the one signal against cards concerns the reply rules Gate 6 now carries.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rule bytes per Gate 5 load stay at the full-file size | L | Revisit with `build-rule-cards.cjs` if a later measurement shows rule size costs compliance |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**How to roll back**: run `build-rule-cards.cjs`, point the 13 trigger-table links into `.skilled/repo-rules/cards/` and run `check-repo-rules.cjs`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
