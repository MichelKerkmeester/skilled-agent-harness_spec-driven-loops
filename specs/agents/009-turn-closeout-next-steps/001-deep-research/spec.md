---
title: "Feature Specification: Phase 1: deep-research"
description: "Four read-only research iterations establishing whether a close-out next-steps behaviour may exist as a repo rule, what already carries it, and what fails today without it."
trigger_phrases:
  - "close-out next steps research"
  - "decision tests evidence"
  - "existing home for close-out"
  - "structured question tool"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: deep-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-decision-and-design |
| **Handoff Criteria** | `research/research.md` holds four iterations, every citation resolves, and each of the four decision tests has an evidenced answer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the turn close-out next steps specification.

**Scope Boundary**: Read-only. This phase writes nothing outside `001-deep-research/`. It does not draft the rule, edit `REPO RULES.md`, or touch `AGENTS.md`.

**Dependencies**:
- `cli-pi` on PATH, dispatching `deepseek-v4.1-flash` through the DevPass gateway at `max` effort
- The nine files under `repo-rules/`, the router, and `AGENTS.md` as the corpus being studied

**Deliverables**:
- `research/research.md` with four iterations, each carrying `file:line` citations
- An evidenced answer to each of the four decision tests
- A named failure that happens today, or the finding that there is none

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator wants every turn to end with what they have to do next, and wants a structured question used where a choice is needed. Whether that may become a repo rule is undecided, and deciding it from one reading is exactly the single-lens failure the delegation rule names. Two existing rules already cover adjacent ground, so the live risk is authoring a tenth rule that duplicates the ninth.

### Purpose
Produce the evidence that lets phase 002 run the four decision tests against something other than an opinion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four research iterations over the repo rules corpus, the router, and `AGENTS.md`
- Evidence for each of the four decision tests, cited to `file:line`
- An inventory of what already carries close-out and question-asking behaviour
- Whether naming a runtime's question tool can sit inside the router's current scope statement

### Out of Scope
- Drafting the rule text, which is phase 003
- Editing `REPO RULES.md` or `AGENTS.md`, which is phase 004
- Deciding the shape, which is phase 002 acting on this evidence

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Four-iteration research output |
| `research/resource-map.md` | Create | Sources consulted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Answer the always-loaded test: on a turn where no trigger fires, must this behaviour still hold? |
| REQ-002 | Answer the four-part refusal test, including whether `communication.md` or `evidence-and-proof.md` already carries the content |
| REQ-003 | Answer the restraint test by naming a failure that happens today, or reporting that none was found |
| REQ-004 | Every claim carries a `file:line` citation that resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Answer the scope boundary test for the question-tool half, quoting the router's section 4 rather than paraphrasing it |
| REQ-006 | Report which `AGENTS.md` sections would anchor the content, since a rule nothing points at never loads |
| REQ-007 | Check the four-part test still refuses the ten candidates the set already declined |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four iterations recorded in `research/research.md`, none of them a restatement of this brief
- **SC-002**: Each of the four decision tests has an answer with evidence attached, including an answer of "refuse"
- **SC-003**: One citation sampled per iteration resolves to the path and line claimed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass gateway credential | No dispatch reaches the model | Check output text for a missing-key message, never the exit code |
| Risk | The brief leaks a preferred conclusion and the run corroborates it | High | The brief states the question, never the expected answer; a refusal verdict is an acceptable success |
| Risk | Four iterations of one model is one opinion repeated | Medium | Phase 002 grounds the judgment in the repository rather than accepting the verdict |
| Risk | Non-interactive dispatch hangs silently | Medium | Redirect stdin and pass the offline flag, per the cli-pi contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The run completes in one unattended session, no iteration exceeding the executor timeout
- **NFR-P02**: Exactly four iterations, no early convergence stop

### Security
- **NFR-S01**: No provider key appears in any prompt or artifact
- **NFR-S02**: Write authority is bound to `001-deep-research/` and nothing outside it

### Reliability
- **NFR-R01**: Each iteration writes its state record before the next begins
- **NFR-R02**: A failed iteration is recorded rather than dropped
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty finding: an iteration that finds nothing new records that, and it counts as a result
- Maximum length: a finding longer than its evidence is trimmed to the evidence
- Invalid citation: a `file:line` that does not resolve invalidates the claim, not just the line

### Error Scenarios
- Provider refuses the model id: stop and report, never substitute another model
- Gateway returns an auth error: surface the provider requirement, do not retry blindly
- Concurrent access: the loop holds its own lock under `research/`

### State Transitions
- Partial completion: iterations already written stay, the run resumes from the last state record
- Session expiry: state is externalized, so a fresh context resumes from the JSONL
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Read-only, two artifacts, one corpus |
| Risk | 4/25 | No shared contract touched, no runtime change |
| Research | 18/20 | The whole phase is investigation |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Is the observed failure the operator describes reproducible in the repository's own history, or is it a preference? The restraint test turns on this.
- Can the question-tool half be phrased so it sits inside the router's current scope statement, or does it require the fourth widening?
<!-- /ANCHOR:questions -->

---
