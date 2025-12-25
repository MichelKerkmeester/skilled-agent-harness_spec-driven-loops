# Spike: [YOUR_VALUE_HERE: spike-title] - Technical Investigation

Time-boxed technical investigation to answer a specific question or validate a hypothesis.

<!-- SPECKIT_TEMPLATE_SOURCE: spike | v1.0 -->

---

## 1. METADATA

- **Spike ID**: SPIKE-[FORMAT: ###]
- **Status**: [NEEDS CLARIFICATION: What is the spike status? (a) Planned - not started (b) In Progress - actively investigating (c) Completed - findings documented (d) Cancelled - no longer needed]
- **Date Started**: [FORMAT: YYYY-MM-DD]
- **Date Completed**: [FORMAT: YYYY-MM-DD] [OPTIONAL: empty if in progress]
- **Investigator(s)**: [YOUR_VALUE_HERE: names/roles]
- **Time-Box**: [YOUR_VALUE_HERE: max time to spend - example: 4 hours, 1 day, 2 days]
- **Actual Time Spent**: [YOUR_VALUE_HERE: actual time spent] [OPTIONAL: empty if in progress]

**Related Documents**:
- Spec: [OPTIONAL: link to spec.md if applicable]
- ADR: [OPTIONAL: link to decision-record-*.md if spike leads to decision]
- Research: [OPTIONAL: link to research.md if deeper investigation needed]

---

## 2. QUESTION / HYPOTHESIS

### Primary Question
[YOUR_VALUE_HERE: the specific question this spike aims to answer - example: Can we use WebSockets for real-time updates, or do we need Server-Sent Events?]

### Hypothesis
[YOUR_VALUE_HERE: what you expect to find - example: WebSockets will provide lower latency but require more infrastructure; SSE will be simpler for our read-only update use case]

### Success Criteria
How will we know the spike is complete?
- [ ] [YOUR_VALUE_HERE: criterion 1 - example: Performance benchmarks collected for both approaches]
- [ ] [YOUR_VALUE_HERE: criterion 2 - example: Infrastructure requirements documented]
- [ ] [YOUR_VALUE_HERE: criterion 3 - example: Recommendation made with supporting evidence]

### Out of Scope
What this spike explicitly will NOT investigate:
- [YOUR_VALUE_HERE: exclusion 1 - example: Production deployment configuration]
- [YOUR_VALUE_HERE: exclusion 2 - example: Load testing at scale]

---

## 3. APPROACH

### Investigation Plan
1. [YOUR_VALUE_HERE: step 1 - example: Set up minimal WebSocket prototype]
2. [YOUR_VALUE_HERE: step 2 - example: Set up minimal SSE prototype]
3. [YOUR_VALUE_HERE: step 3 - example: Measure latency and throughput for both]
4. [YOUR_VALUE_HERE: step 4 - example: Document infrastructure requirements]
5. [YOUR_VALUE_HERE: step 5 - example: Compare and recommend]

### Resources Needed
- [YOUR_VALUE_HERE: resource 1 - example: Test server environment]
- [YOUR_VALUE_HERE: resource 2 - example: Access to monitoring tools]
- [YOUR_VALUE_HERE: resource 3 - example: Sample dataset for testing]

### Risks / Blockers
- [YOUR_VALUE_HERE: risk 1 - example: May not have access to production-like environment]
- [YOUR_VALUE_HERE: risk 2 - example: Limited time may prevent thorough benchmarking]

---

## 4. FINDINGS

### Summary
[YOUR_VALUE_HERE: 2-3 sentence summary of what was discovered - fill after investigation]

### Detailed Findings

#### Finding 1: [YOUR_VALUE_HERE: finding-title]
**Observation**: [What was observed]

**Evidence**:
```[language]
[Code, logs, or data supporting this finding]
```

**Significance**: [Why this matters]

---

#### Finding 2: [YOUR_VALUE_HERE: finding-title]
**Observation**: [What was observed]

**Evidence**:
```[language]
[Code, logs, or data supporting this finding]
```

**Significance**: [Why this matters]

---

#### Finding 3: [YOUR_VALUE_HERE: finding-title]
**Observation**: [What was observed]

**Evidence**:
```[language]
[Code, logs, or data supporting this finding]
```

**Significance**: [Why this matters]

---

### Comparison Matrix (if applicable)

| Criterion | [Option A] | [Option B] | [Option C] | Winner |
|-----------|-----------|-----------|-----------|--------|
| [Criterion 1] | [Value] | [Value] | [Value] | [A/B/C] |
| [Criterion 2] | [Value] | [Value] | [Value] | [A/B/C] |
| [Criterion 3] | [Value] | [Value] | [Value] | [A/B/C] |
| **Overall** | [Score] | [Score] | [Score] | **[Winner]** |

### Unexpected Discoveries
[OPTIONAL: Document anything surprising or unexpected found during investigation]
- [Discovery 1]
- [Discovery 2]

---

## 5. RECOMMENDATION

### Primary Recommendation
[YOUR_VALUE_HERE: clear recommendation based on findings - example: Use Server-Sent Events for this use case]

### Rationale
[YOUR_VALUE_HERE: explain why this is the recommended approach based on evidence gathered]

1. **[Reason 1]**: [Evidence supporting this]
2. **[Reason 2]**: [Evidence supporting this]
3. **[Reason 3]**: [Evidence supporting this]

### Trade-offs Accepted
By choosing this approach, we accept:
- [YOUR_VALUE_HERE: trade-off 1 - example: Slightly higher latency than WebSockets]
- [YOUR_VALUE_HERE: trade-off 2 - example: One-way communication only]

### Alternatives Considered
- **[Alternative 1]**: [Why not chosen]
- **[Alternative 2]**: [Why not chosen]

### Confidence Level
[NEEDS CLARIFICATION: How confident are you in this recommendation? (a) High - clear winner with strong evidence (b) Medium - recommended approach but close call (c) Low - more investigation needed before deciding]

---

## 6. NEXT STEPS

### Immediate Actions
- [ ] [YOUR_VALUE_HERE: action 1 - example: Create ADR documenting this decision]
- [ ] [YOUR_VALUE_HERE: action 2 - example: Update plan.md with chosen approach]
- [ ] [YOUR_VALUE_HERE: action 3 - example: Create implementation tasks]

### Follow-up Investigation Needed
[OPTIONAL: If spike raised new questions requiring further investigation]
- [Question 1]: [Why it matters]
- [Question 2]: [Why it matters]

### Implementation Notes
[YOUR_VALUE_HERE: any important notes for the implementation team - example: Use library X version 2.0+, avoid deprecated API Y]

---

## 7. ARTIFACTS

### Code / Prototypes
[OPTIONAL: Links or references to any prototype code created during spike]
- Location: `scratch/experiments/[spike-name]/`
- Key files:
  - [File 1]: [Purpose]
  - [File 2]: [Purpose]

**Note**: Move valuable code to permanent location; delete experiments after spike is complete.

### Documentation Created
- [Document 1]: [Location and purpose]
- [Document 2]: [Location and purpose]

### External References
- [Reference 1]: [URL and relevance]
- [Reference 2]: [URL and relevance]

---

## WHEN TO USE THIS TEMPLATE

**Use spike.md when:**
- Need to answer a specific technical question with time-boxed investigation
- Evaluating multiple technical approaches before committing
- Validating a hypothesis before significant implementation effort
- Exploring unfamiliar technology or integration before planning
- Risk reduction through proof-of-concept or prototype

**Do NOT use when:**
- Question can be answered with quick research (<1 hour)
- Decision is already made and just needs documentation (use decision-record.md)
- Comprehensive feature research needed (use research.md)
- Simple implementation task (just do the work)

**Time-box guidelines:**
- Small spike: 2-4 hours
- Medium spike: 1 day
- Large spike: 2-3 days
- If more time needed, consider breaking into multiple spikes or using research.md

**Related templates:**
- After spike, create decision-record.md if significant decision was made
- Expand into research.md if deeper investigation is needed
- Reference spike findings in plan.md or spec.md

---

<!--
  SPIKE TEMPLATE - TIME-BOXED INVESTIGATION
  - Answer specific questions with evidence
  - Time-boxed to prevent endless research
  - Results feed into decision records or plans
  - Delete prototype code after spike (keep in scratch/ during)
-->
