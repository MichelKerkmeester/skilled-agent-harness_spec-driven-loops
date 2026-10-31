---
title: "Feature Specification: Phase 2: baseline-and-decisions"
description: "Freeze the numbers, close the sk-doc research gap and record the decisions that gate phases 003 to 006."
trigger_phrases:
  - "baseline and decisions"
  - "freeze the numbers close the sk doc research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: baseline-and-decisions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-okf-deep-research |
| **Successor** | 003-context-type-unification |
| **Handoff Criteria** | A baseline report and a decision record exist, and the operator has approved decisions D1 to D4. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: Research and decisions only. No change to spec-kit or sk-doc code, templates or docs.

**Dependencies**:
- Phase 001 closed, with its revised verdict list in `001-okf-deep-research/research/research.md` Appendix A.6.
- The `cli-pi` route and web access proven in phase 001, if an addendum research iteration is run.

**Deliverables**:
- `baseline.md`: frozen counts with the exact command and commit behind each.
- `decision-record.md`: decisions D1 to D4 with evidence.
- An `sk-doc` addendum: its frontmatter classes, validators and advisor use.
- A larger labeled citation sample, or a recorded reason it was not built.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 studied spec-packet docs only. `sk-doc` has its own frontmatter contract and a citation scanner, and the only silent-drift evidence is a 20-item labeled sample with one model as labeler. It is also unclear whether the 10-value and 11-value `contextType` lists in the spec-kit code classify documents or sessions, because the same key name is used.

### Purpose
Fix the facts and make four decisions before any product code changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-doc` addendum: frontmatter classes in `sk-create-frontmatter`, the validators (`validate_document.py`, `check-frontmatter-versions.sh`, `frontmatter-version.mjs`, `quick_validate.py`) and how the skill advisor reads the five-field block.
- Frozen baseline: `contextType` and `importance_tier` value spread, plus broken `[SOURCE:]` and `file:line` citations split into moved, gone and past-end.
- Read the call sites of the 10-value and 11-value lists and decide whether they mean document kind or session kind.
- A larger labeled citation sample with labelers from two model families.
- Decisions D1 to D4, each with an owner, in the decision record.

### Out of Scope
- Any change to spec-kit or sk-doc product files - decisions come first.
- Rewriting any citing doc - phase 004 reports only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `baseline.md` | Create | Frozen numbers and commands |
| `decision-record.md` | Create | D1 to D4; add through the lazy-addons scaffold |
| `scratch/` | Create | Raw census output kept out of the committed docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every baseline number lists the command and the commit that produced it, and a rerun gives the same number. |
| REQ-002 | The document-kind versus session-kind question is answered from the call sites, with `file:line` evidence. |
| REQ-003 | D1 to D4 are recorded: D1 the `contextType` policy for values the code branches on, D2 the shape of R1, D3 the go or no-go threshold for phase 006 stated before the data is read, D4 enforcement scope and where the shared resolver lives. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The labeled citation sample is enlarged, with two labelers from different model families, or the shortfall is recorded and D3 defaults to not building phase 006. |
| REQ-005 | The `sk-doc` addendum lists each frontmatter class with its validator. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `baseline.md` reproduces from its own commands.
- **SC-002**: Four decisions exist, each with evidence and an owner, and the operator has approved them.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Model labelers for the citation sample | Sample stays at 20 and D3 cannot be tested | Default D3 to not building phase 006 and say so |
| Risk | Labelers share a blind spot | Med | Use two families and spot-check a share by hand |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The citation census took over three minutes on a first run, so run it once and keep the output.
- **NFR-P02**: Each baseline command is recorded verbatim.

### Security
- **NFR-S01**: No credential appears in any prompt or output.
- **NFR-S02**: Model calls for labeling go only through documented routes.

### Reliability
- **NFR-R01**: A number that cannot be reproduced is marked UNKNOWN, not dropped.
- **NFR-R02**: Rerunning a command on the recorded commit gives the recorded number.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A path cited by two different moves: classify as moved and name both.
- A labeler disagrees with the other: record both, do not average.
- A doc with no frontmatter: count it separately, never as a bad value.

### Error Scenarios
- A model route hits a quota: pause and record, do not switch silently.
- A fetch times out: retry once, then record the source as unreachable.
- Another session edits the repo: the worktree isolates this run.

### State Transitions
- Partial run: resume from `baseline.md`, finished counts are not repeated.
- Session ends: `/speckit:resume` recovers from the packet docs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Docs and counts only |
| Risk | 4/25 | Read-only commands and model labeling |
| Research | 16/20 | Two doc systems and two code lists |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Do the 10-value and 11-value lists classify documents or sessions?
- Which `sk-doc` doc classes does the post-edit hook already check?
<!-- /ANCHOR:questions -->

---


