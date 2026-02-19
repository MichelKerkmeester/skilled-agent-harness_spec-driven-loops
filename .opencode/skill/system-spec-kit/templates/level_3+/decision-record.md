# Decision Record: [NAME]

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/workflows-documentation/assets/documentation/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: [Decision Title]

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | [Proposed/Accepted/Deprecated/Superseded] |
| **Date** | [YYYY-MM-DD] |
| **Deciders** | [Names] |

---

### Context

<!-- Voice guide: State the problem directly. "We needed to choose between X and Y because Z"
     not "A decision was required regarding the selection of an appropriate approach."
     Write 2-4 sentences that a new team member could understand without prior context. -->

[What problem or situation required this decision? What was at stake?
Write in direct, active voice. State the forces that made this decision necessary.]

### Constraints

<!-- Voice guide: Be specific. "API rate limit of 100 req/s" not "Performance considerations." -->

- [Technical constraint with specifics]
- [Business constraint with specifics]
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

<!-- Voice guide: State the decision with certainty. "We chose X" not "It was decided that X would be selected."
     The details should explain how it works, not justify why (that comes in Alternatives). -->

**We chose**: [One-sentence description of the decision, in active voice]

**How it works**: [Implementation approach in 2-3 direct sentences]
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen]** | [Advantages] | [Disadvantages] | [X/10] |
| [Alternative A] | [Advantages] | [Disadvantages] | [Y/10] |

<!-- Voice guide: Write the rationale like you're convincing a skeptical colleague.
     "X scored highest because it solves our rate-limit constraint without adding latency"
     not "X was determined to be the optimal solution based on evaluation criteria." -->

**Why this one**: [Rationale in 1-2 sentences, direct and specific]
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

<!-- Voice guide: Be honest about trade-offs. Every decision has costs.
     "This adds ~50ms latency to cold starts" not "There may be minor performance implications." -->

**What improves**:
- [Specific benefit with measurable impact where possible]
- [Specific benefit]

**What it costs**:
- [Specific drawback] . Mitigation: [How to handle it]

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk with specifics] | [H/M/L] | [Concrete strategy] |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | [PASS/FAIL] | [Is this solving an actual need now?] |
| 2 | **Beyond Local Maxima?** | [PASS/FAIL] | [Were alternatives explored?] |
| 3 | **Sufficient?** | [PASS/FAIL] | [Is this the simplest approach?] |
| 4 | **Fits Goal?** | [PASS/FAIL] | [Is this on the critical path?] |
| 5 | **Open Horizons?** | [PASS/FAIL] | [Is this long-term aligned?] |

**Checks Summary**: [X/5 PASS]
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- [System/Component with specific change]
- [System/Component with specific change]

**How to roll back**: [Concrete revert steps, not "revert if needed"]
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3+ Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
State decisions with certainty. Be honest about trade-offs.
HVR rules: .opencode/skill/workflows-documentation/assets/documentation/hvr_rules.md
-->
