---
title: "Feature Specification: Present synthesized recommendations in chat across the six deep-loop modes"
description: "Give each deep-loop mode a required content field in its completion message, so a finished run reports what it found instead of a path and a count."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Present synthesized recommendations in chat across the six deep-loop modes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `scaffold/046-synthesis-chat-presentation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A run could spend twenty minutes producing a ranked set of findings and then report an iteration count, four file paths and a status token. Every mode's Results Display section stopped at counts and artifacts, and none had a field for what the run actually found. Deep review came closest with severity tallies and a verdict token, and still named no finding.

Observed rather than inferred: a four-iteration research run completed, wrote a 265-line synthesis, and the contract offered no way to say what it concluded. The reader had to open the file.

### Purpose
Put the answer in the message and the path after it, with the content shaped by what each mode actually produces, because a benchmark reporting a score and a review reporting defects do not owe the reader the same thing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A required content block in the Results Display section of five presentation contracts
- Per-mode content, derived from what that mode's synthesized artifact contains
- A pointer to the voice half of the human voice standard, without restating the repo's communication rules

### Out of Scope
- `deep-skill-benchmark`. That mode is being deprecated in its own packet, so giving it a content field would be work thrown away
- The YAML workflows. The presentation contracts own what the completion message says
- Changing what any mode computes. This changes reporting, not behaviour

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep-research-presentation.txt` | Modify | Answer, headline findings, uncertainty, ruled-out direction |
| `.opencode/commands/deep/assets/deep-review-presentation.txt` | Modify | Verdict, every P0 with `file:line`, P1 summarised, fix-first pointer |
| `.opencode/commands/deep/assets/deep-ai-council-presentation.txt` | Modify | Direction and reason, agreement level, dissent by name |
| `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt` | Modify | What changed, score delta, promote or rollback call |
| `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt` | Modify | Aggregate against threshold, failing fixtures, eligibility call |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the five contracts carries a required content block in its Results Display section |
| REQ-002 | No two modes carry the same generic wording; the content follows what the mode produces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The block names what to leave out, not only what to carry |
| REQ-004 | The block points at the voice standard rather than restating the communication rules |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five contracts changed, `deep-skill-benchmark` deliberately untouched
- **SC-002**: A reader of a completion message can act without opening the artifact
- **SC-003**: Nothing in the five blocks duplicates a repo rule; each links instead
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The block duplicates the repo's communication rules and drifts from them | High | It specifies content only, and points at the rules for ordering, concision and voice |
| Risk | One generic block applied to six different modes | High | Per-mode content, written from each mode's own artifact shape |
| Risk | `deep-skill-benchmark` diverges from the other five | Low | Excluded on purpose; that mode is being deprecated |
| Dependency | The deprecation packet for `deep-skill-benchmark` | Low | Independent. Neither packet blocks the other |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- `deep-skill-benchmark` is excluded because it is being deprecated. If that deprecation is abandoned, this packet owes it a sixth block, and its own presentation boundary forbids the router from emitting verdicts or bottlenecks, so its content would have to come from the loop host instead.
<!-- /ANCHOR:questions -->

---


