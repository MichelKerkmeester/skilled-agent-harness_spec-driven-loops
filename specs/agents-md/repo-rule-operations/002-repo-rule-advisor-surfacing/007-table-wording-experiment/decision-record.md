---
title: "Decision Record: Table wording experiment"
description: "Records the operator's waiver of the pre-registered sample size after the schedule was cut to a top-up."
trigger_phrases:
  - "table wording experiment sample waiver"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Table wording experiment

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Waive the pre-registered sample size

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-05 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-001-context -->
### Context

The pre-registration targets about 190 long replies per arm whose run read `communication.md` before replying. Executor quotas and rate limits stopped the schedule, and the operator chose a short top-up and a decision (`results/deviations.md` section 3). The pooled data holds 108 such replies per arm, with 0 tables in each, across 625 scored runs.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: waive the sample-size target and keep the decision made by pre-registered rule 2 on the 108 replies per arm collected.

**How it works**: The goal criterion on sample size names this record. `results/decision.md` stays the measured result, and the interval it reports, -3.4 to +3.4 points, is already below the rule's +5 margin at this sample.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive with this record** | The decision stands on the data collected, and the shortfall stays recorded | The planned power is not reached | 8/10 |
| Finish the full schedule | Reaches the planned sample | Most of a day under executor rate limits, and it drained the Codex and Devin allowances twice | 4/10 |
| Leave the criterion Unmet | No waiver needed | The phase can never close | 2/10 |

**Why this one**: the operator chose the short top-up knowing it cut the schedule, and the result is decided by the rule as written.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

| Risk | Impact | Mitigation |
|------|--------|------------|
| A smaller true effect goes undetected | M | The live window after adoption measures the same metrics on real sessions |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**How to roll back**: remove this record and set the sample-size criterion back to unmet. The decision then waits on further runs.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Commit the wording without the 006 window

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-05 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-002-context -->
### Context

REQ-004 commits the chosen wording after the 006 post-change window is measured. On 2026-10-05 the operator ended further test rounds for the parent packet and approved applying the final recommendations, before that window could close.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: commit the short wording on 2026-10-05 with its ledger entry, and drop REQ-004's timing condition.

**How it works**: `results/adoption-ledger.md` records the replaced block and the two dropped sentences. The wording lands with Gate 6 and the 010 phrases.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Commit now** | The decided wording goes live, 154 bytes smaller | The 006 window and this change overlap | 8/10 |
| Wait for the 006 window | Keeps the 006 measurement clean | The operator ended the test rounds, so nothing would follow the wait | 3/10 |

**Why this one**: the wording tested no worse, so nothing in the data argues for holding it back.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later 006 measurement mixes the rewrites with this change | L | `measure-rule-compliance.py` splits replies by the rule's blob version, so the 006 version and this one stay apart |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**How to roll back**: restore the current arm's block in `communication.md` §2 from `results/adoption-ledger.md` and bump `version`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
