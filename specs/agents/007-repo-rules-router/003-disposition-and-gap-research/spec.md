---
title: "Feature Specification: Phase 3: Disposition and Rule-Set Gap Research"
description: "The rule set was written in one pass from one reading of AGENTS.md, so nothing has yet tested it against a second lens — and one deliberate deletion is still unaccounted for: the per-turn Fable governor directive was retired in August 2026 as a disposition re-asserted every turn at context cost, with the case for its content never disputed. This phase runs a five-iteration deep-research loop, no early convergence, on a DeepSeek V4 Flash max-thinking executor, to produce a ranked, decidable recommendation list for phase 4."
trigger_phrases:
  - "repo rules gap research"
  - "fable governor disposition"
  - "governor directive retirement"
  - "agents md rule expansion"
  - "deep research five iterations"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: Disposition and Rule-Set Gap Research

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
| **Phase** | 3 of 4 |
| **Predecessor** | 002-delegation-orchestration-rule |
| **Successor** | 004-research-adoption |
| **Handoff Criteria** | Five iterations recorded in the state log, and a ranked recommendation list where every item names the file it would change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the repo-rules router packet.

**Scope Boundary**: Research only. This phase writes into `research/` inside this folder and changes nothing under `repo-rules/`, `REPO RULES.md`, or `AGENTS.md`. Every recommendation it produces is a proposal that phase 4 accepts, declines, or defers.

**Dependencies**:
- Phases 1 and 2 land first, so the research reads the rule set in its final shape and can judge the delegation rule as shipped rather than as planned.

**Deliverables**:
- `research/research.md` - findings with citations, and a ranked recommendation list.
- `research/deep-research-state.jsonl` - five iteration records.
- A per-recommendation disposition column that phase 4 fills in.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three things are unverified about the rule set. First, it was derived in a single pass by one reader of `AGENTS.md`, so its claim to cover every compressed operating-discipline row has never been checked by anything but its own author - the exact single-lens failure the delegation rule from phase 2 exists to prevent, left standing in the packet that defines it. Second, `AGENTS.md` was deliberately barely touched, on the reasoning that the always-loaded document must not grow; whether some of its rows should now *move* down into `repo-rules/` and shrink it was never asked. Third, commit `4477a9f1` retired the per-turn Fable governor directive, and its own message is careful about what it was killing: the directive was removed because a disposition re-asserted on every turn spends context on something never in dispute, not because the disposition was wrong. The content - reason about the problem rather than yourself, lead with the result, act rather than narrate, treat reversible decisions as cheap, qualify only when it changes what the reader should do - was never disputed and now has no home. A per-turn injection was the wrong container; a triggered rule file might be the right one.

### Purpose
Produce a ranked, decidable list of changes to the rule set, to `AGENTS.md`, and to the rule inventory - including whether the retired governor disposition earns a rule file - each one specific enough that phase 4 can accept, decline, or defer it without re-deriving the reasoning.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **RQ1 - Coverage**: does the shipped rule set actually expand every thinking-and-acting row in `AGENTS.md` sections 2, 3, 4, and 7, and where is a row still compressed with nowhere to expand?
- **RQ2 - Direction of travel**: which `AGENTS.md` rows should move down into a rule file, shrinking the always-loaded surface, and which must stay because they are hard blockers or gates?
- **RQ3 - The governor disposition**: what exactly did the retired directive bind, why was retiring the *container* right, and does the content justify a rule file, a section in an existing file, or nothing at all?
- **RQ4 - Inventory**: are further rules warranted, and just as importantly, which plausible-sounding rules are not - restraint applies to the rule set itself.
- **RQ5 - The new rule under test**: does the phase-2 delegation rule hold up against a second lens, and what does it get wrong or leave uncovered?
- A ranked recommendation list, each item naming the target file, the change, and the failure it prevents.

### Out of Scope
- **Any edit to `repo-rules/`, `REPO RULES.md`, or `AGENTS.md`** - this phase proposes; phase 4 disposes. Keeping the write out of the research phase is what makes the recommendations reviewable rather than already-applied.
- **Re-litigating the governor retirement itself** - the commit stands. The question is whether its content deserves a different container, not whether the removal was wrong.
- **Skill routing, workflow selection, spec-folder mechanics, agent dispatch, MCP routing** - excluded from `repo-rules/` by the router's own scope statement, so a recommendation to add them there is out of bounds by construction.
- **Enforcement tooling** - still excluded, consistent with the parent packet.
- **Re-running the parent packet's `AGENTS.md` bloat audit** - `../../004-agents-md-bloat-audit/` already measured it; this phase cites it rather than repeating it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Findings with citations, plus the ranked recommendation list |
| `research/deep-research-state.jsonl` | Create | Five iteration records with route-proof fields |
| `research/deep-research-strategy.md` | Create | The research questions and per-iteration focus |
| `implementation-summary.md` | Modify | Final state, iteration evidence, handoff to phase 4 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Exactly five iterations run, with convergence treated as telemetry rather than a stop, so a converged loop does not shorten the requested depth. |
| REQ-002 | The executor is DeepSeek V4 Flash at its maximum thinking tier, and the recorded executor configuration proves it. |
| REQ-003 | Every finding cites a file and line, a commit, or a command output; a claim with no citation is recorded as UNKNOWN rather than asserted. |
| REQ-004 | RQ3 is answered with a verdict - rule file, section, or nothing - and the reasoning names what the container change buys that the per-turn injection did not. |
| REQ-005 | The output is a ranked list where every item names its target file and the failure it prevents, so phase 4 decides rather than re-derives. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Each of RQ1 through RQ5 has an explicit answer, including "no change warranted" where that is the finding. |
| REQ-007 | Recommendations that would violate the router's scope statement are identified as out of bounds rather than ranked. |
| REQ-008 | The research names at least one thing the rule set does that it should stop doing, or states plainly that it found none - a review that only adds is not a review. |
| REQ-009 | The delegation rule from phase 2 is critiqued by the research rather than assumed correct, since this packet wrote it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/deep-research-state.jsonl` contains five iteration records carrying the route-proof fields the deep-research contract requires.
- **SC-002**: The recommendation list is decidable: a reader can accept or decline each item without opening another document to work out what it means.
- **SC-003**: Every RQ has an answer, and at least one answer is a refusal to change something.
- **SC-004**: Nothing under `repo-rules/`, `REPO RULES.md`, or `AGENTS.md` differs after this phase, provable by `git diff --stat`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The loop converges early and returns fewer than five iterations | High - the operator asked for five, and depth is the point | Force the max-iterations stop policy so convergence is telemetry, then verify the iteration count from the state log rather than from the run's summary |
| Risk | A research agent writes into `repo-rules/` or `AGENTS.md` | High - it would silently pre-apply unreviewed doctrine | Write authority bound to this folder; SC-004 checks the working tree afterwards |
| Risk | The loop produces agreeable expansion - more rules because more rules sound thorough | High - it would over-engineer the very thing `overengineering.md` guards | REQ-008 requires a subtraction candidate or an explicit statement that none was found |
| Risk | A dispatched child stalls, which this repository has seen on long lineages | Med - a hung lineage looks identical to a slow one | Read the executor's `SKILL.md` before composing the dispatch, per `AGENTS.md` Dispatch Rules; salvage partial output rather than discarding the run |
| Risk | The research treats the governor retirement as a mistake to reverse | Med - it would relitigate a settled decision | The RQ is framed as container-versus-content, and the out-of-scope list says so |
| Dependency | Phases 1 and 2 landed | Research would judge a stale rule set | Phase ordering enforced by the parent's handoff criteria |
| Dependency | `cli-devin` present and authenticated | No executor, no loop | Verified before dispatch; a missing executor is a blocker to report, not a reason to substitute silently |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The iteration count is read from the state log, not from a run summary, because a summary is the run describing itself.
- **NFR-D02**: The executor configuration is persisted with the run, so the model and thinking tier are recoverable after the fact.

### Containment
- **NFR-C01**: Write authority is bound to this phase folder; a write outside it is a failed run regardless of the quality of the findings.
- **NFR-C02**: Working files stay in `scratch/`; only `research/` artifacts and the summary are durable.

### Usability
- **NFR-U01**: A recommendation is one row: target file, change, failure prevented, rank.
- **NFR-U02**: The ranked list is readable without the iteration transcripts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Loop Boundaries
- **Convergence declared at iteration 2**: recorded as telemetry; the loop continues to five.
- **An iteration returns nothing new**: recorded as a null iteration rather than retried into a different question, so the depth claim stays honest.
- **The lineage stalls**: partial artifacts are salvaged and the shortfall is reported as a shortfall, not smoothed over.

### Finding Quality
- **A finding with no citation**: recorded as UNKNOWN, per `uncertainty-and-honesty.md`.
- **Two iterations contradict each other**: both recorded, and the contradiction is itself the finding.
- **A recommendation that only restates an `AGENTS.md` row**: dropped, since expansion is the point and duplication is the named risk.

### Scope Boundaries
- **A recommendation touching skill routing or dispatch mechanics**: marked out of bounds by the router's scope statement rather than ranked.
- **A recommendation to edit a hard blocker**: escalated to the operator, never absorbed - `AGENTS.md` section 1 cannot be overridden by a rule file.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Research artifacts only; no runtime or doctrine file changes |
| Risk | 9/25 | Containment and honest-depth risks dominate; no breakage risk |
| Research | 18/20 | Five iterations across four documents, a retired directive's history, and this repository's dispatch record |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should a second executor family run alongside DeepSeek to give the findings two lenses? **DEFERRED: the operator specified one executor and five iterations. Recorded here because the delegation rule this packet is writing would suggest two, and the tension is worth naming rather than quietly resolving.**
- Should the governor verdict be decided by the research or reserved for the operator? **The research recommends; the operator decides in phase 4. Retiring it was an operator-level call, so restoring its content in another form is one too.**
<!-- /ANCHOR:questions -->

---
