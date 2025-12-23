# Research Spike: [YOUR_VALUE_HERE: research-question] - Exploration & Findings

Time-boxed research and experimentation to answer a technical question or validate an approach.

<!-- SPECKIT_TEMPLATE_SOURCE: research-spike | v1.0 -->

---

## 1. METADATA

- **Spike ID**: SPIKE-[FORMAT: ###]
- **Status**: [NEEDS CLARIFICATION: What is the spike status? (a) Proposed - not yet started (b) In Progress - actively investigating (c) Completed - findings documented, hypothesis tested (d) Abandoned - stopped early, explain why in notes]
- **Date Started**: [FORMAT: YYYY-MM-DD]
- **Date Completed**: [FORMAT: YYYY-MM-DD] [OPTIONAL: empty if in progress]
- **Time Box**: [YOUR_VALUE_HERE: X hours/days]
- **Actual Time**: [YOUR_VALUE_HERE: Y hours/days] [OPTIONAL: fill after completion]
- **Researcher(s)**: [YOUR_VALUE_HERE: names]
- **Related Feature**: [OPTIONAL: link to spec.md if applicable]

---

## FILE ORGANIZATION

**During spike research, organize files as:**
- Research findings → This file (research-spike.md)
- Proof-of-concept code → `scratch/poc/`
- Experiments/prototypes → `scratch/experiments/`
- Benchmark results → `scratch/benchmarks/`
- Debug/logs → `scratch/logs/`

**After spike completion:**
- Move valuable code to permanent location (if proceeding)
- Summarize key findings in this document
- Delete scratch/ contents

> **OpenCode Users:** Clean up scratch/ manually before claiming completion.

---

## 2. RESEARCH QUESTION

### Primary Question
[YOUR_VALUE_HERE: what is the main question this spike aims to answer? Be specific - example: Can we use WebSockets for real-time notifications without blocking the main thread?]

### Secondary Questions
- [YOUR_VALUE_HERE: related question 1]
- [YOUR_VALUE_HERE: related question 2]
- [YOUR_VALUE_HERE: related question 3] [OPTIONAL: add more as needed]

### Success Criteria
[YOUR_VALUE_HERE: how will we know if this spike was successful? What answers/outcomes are we looking for? Example: Successfully implement proof-of-concept WebSocket connection that handles 1000 messages/sec without UI lag]

---

## 3. HYPOTHESIS

### Initial Hypothesis
[YOUR_VALUE_HERE: what do we think the answer will be? What's our best guess going into this research? Example: WebSocket API with Web Workers should handle 1000+ messages/sec without blocking UI]

### Expected Outcome
[YOUR_VALUE_HERE: what outcome do we expect from this research?]

### If Hypothesis Confirmed
[YOUR_VALUE_HERE: what will we do if the hypothesis is correct? Example: Proceed with WebSocket implementation in main feature]

### If Hypothesis Rejected
[YOUR_VALUE_HERE: what will we do if the hypothesis is wrong? Example: Investigate Server-Sent Events or long polling alternatives]

---

## 4. APPROACH

### Research Method
- [ ] Code prototyping/experimentation
- [ ] Literature review (docs, articles, papers)
- [ ] Comparative analysis (tool/library comparison)
- [ ] Performance benchmarking
- [ ] User interviews/feedback
- [ ] Technical proof of concept
- [ ] Other: [Specify]

### Scope
**In Scope**:
- [YOUR_VALUE_HERE: what will be researched]
- [YOUR_VALUE_HERE: what experiments will be run]
- [YOUR_VALUE_HERE: what will be analyzed]

**Out of Scope**:
- [YOUR_VALUE_HERE: what will NOT be researched]
- [YOUR_VALUE_HERE: what is explicitly excluded]

### Environment
- **Platform**: [YOUR_VALUE_HERE: where will research be conducted - example: Node.js v18, Chrome browser, local dev environment]
- **Tools**: [YOUR_VALUE_HERE: tools/libraries to be used - example: socket.io, benchmark.js, Chrome DevTools]
- **Dataset**: [OPTIONAL: what data will be used if applicable]
- **Resources**: [Links to documentation, tutorials, etc.]

---

## 5. RESEARCH PROCESS

### Day 1 / Phase 1: [YOUR_VALUE_HERE: activity-name]
**Goal**: [YOUR_VALUE_HERE: what to accomplish]

**Activities**:
- [Activity 1]
- [Activity 2]
- [Activity 3]

**Findings**:
- [Finding 1]
- [Finding 2]

**Time Spent**: [X hours]

---

### Day 2 / Phase 2: [YOUR_VALUE_HERE: activity-name]
**Goal**: [YOUR_VALUE_HERE: what to accomplish]

**Activities**:
- [Activity 1]
- [Activity 2]

**Findings**:
- [Finding 1]
- [Finding 2]

**Time Spent**: [X hours]

---

[Add more phases as needed, but respect the time box!]

---

## 6. EXPERIMENTS CONDUCTED

### Experiment 1: [YOUR_VALUE_HERE: title]

**Objective**: [What this experiment tests]

**Setup**:
```[language]
[Code or configuration used]
```

**Procedure**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Results**:
- [Result 1]
- [Result 2]
- [Result 3]

**Conclusion**: [What this experiment proved or disproved]

---

### Experiment 2: [YOUR_VALUE_HERE: title]

**Objective**: [What this experiment tests]

**Setup**:
```[language]
[Code or configuration used]
```

**Procedure**:
1. [Step 1]
2. [Step 2]

**Results**:
- [Result 1]
- [Result 2]

**Conclusion**: [What this experiment proved or disproved]

---

## 7. FINDINGS

### Key Discoveries
1. **[YOUR_VALUE_HERE: discovery-1]**: [Description and significance]
2. **[YOUR_VALUE_HERE: discovery-2]**: [Description and significance]
3. **[YOUR_VALUE_HERE: discovery-3]**: [Description and significance]

### Evidence

| Finding | Evidence Type | Source | Confidence |
|---------|--------------|--------|------------|
| [Finding 1] | [Benchmark/Test/Documentation] | [Link] | High/Med/Low |
| [Finding 2] | [Benchmark/Test/Documentation] | [Link] | High/Med/Low |
| [Finding 3] | [Benchmark/Test/Documentation] | [Link] | High/Med/Low |

### Surprises
[YOUR_VALUE_HERE: what unexpected things did we learn?]

### Limitations
[YOUR_VALUE_HERE: what limitations exist in this research? What questions remain unanswered?]

---

## 8. RECOMMENDATION

### Primary Recommendation
[YOUR_VALUE_HERE: based on the research, what do we recommend doing? Example: Proceed with WebSocket implementation using Web Workers for message processing]

### Rationale
[YOUR_VALUE_HERE: why are we recommending this approach? Example: Experiments show WebSocket + Web Workers handles 2000+ messages/sec with <10ms UI lag, meeting performance targets]

### Confidence Level
- **Overall Confidence**: [NEEDS CLARIFICATION: How confident are you in these findings? (a) High - strong evidence, repeatable results (b) Medium - reasonable evidence, some uncertainty (c) Low - preliminary findings, needs more investigation]
- **Reasoning**: [Why this confidence level]

### Alternative Approaches
[YOUR_VALUE_HERE: if the primary recommendation doesn't work, what else could we try? Example: Server-Sent Events if WebSocket proxy issues arise, long polling as fallback]

---

## 9. NEXT STEPS

### Immediate Actions

| Action | Owner | Priority | Due Date |
|--------|-------|----------|----------|
| [Action 1] | [Name] | [P0/P1/P2] | [Date] |
| [Action 2] | [Name] | [P0/P1/P2] | [Date] |

### Follow-up Research Needed
- [ ] [Additional spike needed on X] [OPTIONAL: if more research required]
- [ ] [More investigation needed on Y] [OPTIONAL: if more research required]
- [ ] [Validation required for Z] [OPTIONAL: if more research required]

### Implementation Path
[YOUR_VALUE_HERE: if we move forward with this approach, what's the rough implementation plan?]

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## 10. DETAILED NOTES

### Observations
[Free-form notes on observations made during research]

### Code Snippets
```[language]
[Useful code snippets discovered or created]
```

### Resources Consulted
- [Resource 1 - with link]
- [Resource 2 - with link]
- [Resource 3 - with link]

### Dead Ends
[YOUR_VALUE_HERE: approaches that were tried but didn't work out - important to document so others don't repeat - example: Tried SharedArrayBuffer for message passing but browser support too limited]

---

## 11. REFERENCES

### Documentation
- [Link to official documentation]
- [Link to tutorials]
- [Link to API references]

### Related Work
- **Similar Spikes**: [OPTIONAL: links to related research]
- **Feature Specs**: [OPTIONAL: links to related features]
- **Decision Records**: [OPTIONAL: links to related ADRs]

### External References
- [Blog post]
- [Research paper]
- [Stack Overflow discussion]
- [GitHub repository]

---

## 12. CONCLUSION

### Hypothesis Status
- **Original Hypothesis**: [Restate hypothesis]
- **Result**: Confirmed | Partially Confirmed | Rejected
- **Explanation**: [Why]

### Answer to Research Question
[YOUR_VALUE_HERE: clear, concise answer to the original research question]

### Impact on Project
[YOUR_VALUE_HERE: how does this research impact the project/feature/decision?]

### Learnings for Next Time
[YOUR_VALUE_HERE: what would we do differently in future spikes?]

---

**Time Box Status**: [On time | X hours over] - [Notes on time management]

**Follow-up Date**: [OPTIONAL: when to revisit these findings - if applicable]

---

## WHEN TO USE THIS TEMPLATE

**Use spike-*.md when:**
- Need to answer specific technical question through time-boxed experimentation
- Validating approach or technology choice before committing
- Proof-of-concept required to assess feasibility
- Uncertain about performance characteristics requiring measurement
- Exploring new library/framework/technology
- Investigating solution to specific technical problem

**Do NOT use when:**
- Comprehensive research across multiple domains (use research.md)
- Simple question answerable by reading documentation
- No experimentation needed (just documentation review)
- Unlimited time for investigation (spikes should be time-boxed)

**Key characteristics of spikes:**
- **Time-boxed**: Fixed duration (hours to days, not weeks)
- **Focused**: Single specific question or hypothesis
- **Experimental**: Hands-on prototyping/testing required
- **Disposable**: Code created during spike may be thrown away
- **Decisive**: Should result in clear recommendation

**Related templates:**
- Use research.md for comprehensive multi-domain investigation
- Create decision-record-*.md if spike results in architectural decision
- Reference from spec.md or plan.md when spike informs feature work

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
