---
title: "Feature Specification: Phase 2: Delegation and Orchestration Rule"
description: "The repo-rules set governs how the AI thinks and acts alone, but the highest-leverage act in this repository is handing work to another runtime — six CLI executors, subagents, fan-out lineages, deep loops — and nothing in the six rule files covers the posture that requires. This phase adds a seventh rule: when you delegate, you are the orchestrator, you brief with evidence rather than opinion, and no single model's verdict, including your own, closes a question."
trigger_phrases:
  - "delegation rule"
  - "orchestrate persona"
  - "cli runtime dispatch"
  - "single model opinion"
  - "fan-out briefing"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: Delegation and Orchestration Rule

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-header-format-and-dividers |
| **Successor** | 003-disposition-and-gap-research |
| **Handoff Criteria** | `repo-rules/delegation-and-orchestration.md` exists in the phase-1 format, and both router tables link to it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the repo-rules router packet.

**Scope Boundary**: One new rule file plus the two router rows that reach it. No change to any existing rule file's content, and no change to `AGENTS.md`.

**Dependencies**:
- Phase 1 sets the heading convention the new file must be born in, so this phase runs after it rather than reformatting a file it just wrote.

**Deliverables**:
- `repo-rules/delegation-and-orchestration.md`, written in the established rule shape.
- One trigger-table row and one index row in `REPO RULES.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The six shipped rule files govern the AI working alone: what to build, what to touch, what counts as proof, what can break, how to diagnose, what to admit. None of them governs the act this repository leans on hardest — handing work to something else. Six CLI executors, a subagent roster, fan-out lineages, and four deep-loop modes all exist precisely so work can be delegated, and the failure modes are already documented in this repository's own history: a dispatch composed without reading the executor's `SKILL.md` (`cli-opencode` Rule 17, rediscovered the hard way), a lineage briefed so loosely it returned an opinion instead of a finding, and a sub-agent "COMPLETE" taken at face value. `AGENTS.md` carries the mechanical half of this — read `cli-X/SKILL.md` before composing a prompt, treat a finding as a hypothesis — but not the posture that makes those mechanics fire: that delegating changes your role, and that one model's judgment, including your own, is one opinion rather than an answer.

### Purpose
Give the rule set a seventh file that binds the delegating posture: orchestrate rather than author, brief with evidence rather than preference, and never let a single model's verdict close a question that the repository could answer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `repo-rules/delegation-and-orchestration.md` - the posture switch, pre-dispatch obligations, what a brief must carry, the one-model-is-one-opinion rule, verification of returns, and the self-check.
- The `REPO RULES.md` trigger-table row that fires on a delegation action.
- The `REPO RULES.md` index row summarizing the rule in one line.

### Out of Scope
- **Executor mechanics** (which flags, which model uid, which env vars) - owned by `.opencode/skills/cli-external-orchestration/cli-X/SKILL.md`; the rule points there rather than copying, because a copy goes stale and a stale dispatch flag is exactly the failure this repository already paid for.
- **Agent routing and workflow selection** - owned by `AGENTS.md` sections 2, 5, and 9, and excluded from `repo-rules/` by the router's own scope statement.
- **`AGENTS.md` edits** - if the research phase finds one is warranted, phase 4 makes it; this phase does not touch the always-loaded document.
- **Enforcement tooling** - no hook, validator, or CI check; consistent with the parent packet's stated exclusion.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/delegation-and-orchestration.md` | Create | The seventh rule, in the established shape |
| `REPO RULES.md` | Modify | One trigger row, one index row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A rule file states, as its single binding sentence, that delegating work makes the delegator an orchestrator rather than an author. |
| REQ-002 | The rule states that no single model's verdict - the delegate's or the delegator's own - closes a question on its own, and names what to do instead. |
| REQ-003 | The rule is reachable from the router's trigger table by a link that resolves, and the trigger is written on the action (about to dispatch), not on the topic. |
| REQ-004 | The rule contains no executor mechanics, model roster, flag, or env var; it points at the owning `cli-X/SKILL.md` instead. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The file follows the established rule shape: `Fires when`, one binding rule sentence, numbered body in the phase-1 casing and divider format, closing self-check. |
| REQ-006 | The rule cross-references `evidence-and-proof.md` for finding-as-hypothesis and `scope-discipline.md` for scope travelling with delegated work, rather than restating either. |
| REQ-007 | The rule names the specific failure each obligation prevents, so no clause reads as an abstract best practice. |
| REQ-008 | The rule states what it is not, so "orchestrate it" cannot be read as licence to delegate work the delegator should simply do. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent about to run `cli-devin -p ...`, dispatch a subagent, or start a fan-out matches a trigger row in `REPO RULES.md` and lands on exactly one file.
- **SC-002**: The rule file is independently readable: a reader who opens it mid-dispatch needs no other file to act on it.
- **SC-003**: Adding the seventh rule required exactly two router edits and no change to any existing rule file, which is the parent packet's SC-003 tested for real.
- **SC-004**: Every obligation in the file names a concrete failure it prevents; a reader can point at the sentence for any clause and say what breaks without it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The rule drifts into executor mechanics and goes stale the next time a CLI changes a flag | High - a stale dispatch instruction is worse than none, and this repository has already lost a session to exactly that | REQ-004 forbids mechanics; the rule points at `cli-X/SKILL.md`, which is the surface that gets updated when a CLI changes |
| Risk | "Take the orchestrate persona" is read as "delegate more", inflating cost and latency for work the delegator should just do | Med - fan-out is expensive and this repository runs large ones | REQ-008 requires a "what this is not" section that says delegation is a tool, not a default |
| Risk | The rule duplicates `AGENTS.md` dispatch rules and the two diverge | Med - two contradictory sources | The rule expands *how* to hold the posture; the router's precedence ladder keeps `AGENTS.md` authoritative on conflict |
| Risk | The rule set itself over-engineers - a seventh file the repository has not earned | Low - the failure modes are documented in this repository's own history, not hypothetical | Cited failures are real prior sessions; the file replaces no existing row, it covers an uncovered action |
| Dependency | Phase 1's heading convention | The new file would need reformatting immediately | Phase ordering: 002 runs after 001 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Context Cost
- **NFR-C01**: The always-loaded surface grows by zero lines; the new rule loads only when a delegation trigger fires.
- **NFR-C02**: The file stays under the ~160-line ceiling the parent packet set, so a triggered load costs one file.

### Legibility
- **NFR-L01**: The binding statement is one sentence, set apart under `## THE RULE`.
- **NFR-L02**: A reader who has never dispatched a CLI executor can follow the file without opening a skill document first.

### Maintainability
- **NFR-M01**: The file names no model, no flag, and no version, so a CLI roster change never invalidates it.
- **NFR-M02**: Adding an eighth rule later still touches exactly two router rows.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Trigger Boundaries
- **A read-only delegate** (search, retrieval, a context sweep): the posture applies to the brief and to what comes back; the scope obligations are lighter because nothing is written.
- **A delegate inside an approved workflow** (a deep-loop leaf, a skill-owned dispatch): the workflow owns the mechanics; this rule still binds the briefing and the acceptance of returns.
- **Delegating to a human**: out of the file's frame; it addresses machine delegation, and says so rather than pretending to generality it does not have.

### Conflict Scenarios
- **The delegate disagrees with the delegator**: neither wins by seniority; the repository decides, and if it cannot, the disagreement is reported rather than resolved by preference.
- **Two delegates disagree**: that is a signal the question was underspecified, not a vote to tally.
- **The rule versus an `AGENTS.md` dispatch rule**: `AGENTS.md` wins, and the file says so in its header line like every sibling.

### Degenerate Uses
- **Delegating to avoid deciding**: named as a misuse in the "what this is not" section - the orchestrator still owns the verdict.
- **Delegating trivia**: a dispatch that costs more than doing the work is a restraint failure, and routes to `overengineering.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 1 new file (~150 lines), 2 router rows |
| Risk | 8/25 | No executable change; risk is doctrine drift and over-delegation |
| Research | 8/20 | Required reading this repository's own dispatch failures to ground each clause |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the rule prescribe a minimum number of independent lenses for a judgment call, or leave the count to the orchestrator? **Leaning: leave it, and bind the principle instead - a fixed number is the kind of unearned specificity `overengineering.md` exists to stop. Revisit in phase 4 if the research says otherwise.**
- Does the delegation rule belong beside evidence, or should `evidence-and-proof.md` simply grow a section? **Answer: a separate file, because the trigger is different - evidence fires when you report, this fires before you dispatch, and the router matches on the action.**
<!-- /ANCHOR:questions -->

---
