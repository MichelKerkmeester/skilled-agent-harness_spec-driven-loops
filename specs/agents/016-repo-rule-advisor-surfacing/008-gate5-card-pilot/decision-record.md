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
