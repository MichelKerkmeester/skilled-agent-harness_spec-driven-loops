---
title: "Feature Specification: Phase 2: synthesis-and-decisions"
description: "Turn the research findings into one adopt-or-reject verdict per recommendation, each adopted one assigned to exactly one owning document."
trigger_phrases:
  - "adoption decisions"
  - "allocation table"
  - "one owning document"
  - "rule contradiction resolution"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: synthesis-and-decisions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-research-communication-context |
| **Successor** | 003-root-doc-and-repo-rules |
| **Handoff Criteria** | Every recommendation carries a verdict, and every adopted one names exactly one owning document |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-communication clarity program.

**Scope Boundary**: Decisions only. This phase writes a decision record and an allocation table
inside this folder. It edits no rule, no skill and no root doc, because a decision and its
execution are different phases and conflating them is how an unreviewed change ships.

**Dependencies**:
- Phase 001's lineage artifacts, verified rather than trusted.
- The current stack: `AGENTS.md`, `REPO RULES.md`, `repo-rules/*.md`, `sk-communication`, the Human Voice Rules.

**Deliverables**:
- `decision-record.md`: one ADR per contested recommendation, and one for each contradiction resolved.
- An allocation table: recommendation, verdict, owning document, and the failure it prevents.
- A rejection list with reasons, because an unrecorded rejection reads as an oversight later.
- The three open rule conflicts settled: the colon, the banned framework word, and the
  error-reporting ordering, the last of which already has a drafted qualifier to accept or reject.
- The five engine decisions settled: the content-loss floor, whether an unchanged candidate is
  rejected as not-a-projection, which thinking mode both lanes use, where detectors may live, and
  whether the engine should ever cut and reorder rather than only smooth.
- Two plan corrections ratified: the wording standard becomes a base plus a supplement rather than
  two halves, and the reader-profile contract splits into seven unconditional rules and three that
  need an operator-selected mode.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two model families will return overlapping and sometimes conflicting recommendation sets, and a
tally across them is not a finding. Separately, the stack already carries three documents that
govern how a reply reads, so a recommendation placed in two of them grows a second copy that drifts
the moment either is edited. One source also contradicts a rule the repository already has: the
reply-shape rule offers a colon as the em-dash replacement, and the response-style source forbids
exactly the colon-plus-clause that produces.

### Purpose

Produce one verdict per recommendation and one owning document per adopted recommendation, with the
contradictions resolved in writing rather than left for whoever edits next.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reading every lineage's findings and reconciling their disagreements by cause, not by count.
- An adopt or reject verdict for every recommendation, with the failure each adopted one prevents.
- Assigning each adopted recommendation to exactly one owning document.
- Deciding which recommendations need a new repo rule, and whether a reader-profile rule is a rule at all.
- Resolving the em-dash-to-colon contradiction and any other mark two documents treat differently.

### Out of Scope
- Editing any rule, skill or root doc - that is phases 003 and 004.
- Re-running research to settle a disagreement, unless a disagreement proves the question was underspecified.
- Rewriting the document-scoring half of the Human Voice Rules, which stays `sk-doc`'s.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create | One ADR per contested recommendation and per resolved contradiction |
| `spec.md` | Modify | Record the allocation table once decided |
| `tasks.md` | Modify | Tick each decision as it is recorded |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every recommendation from every lineage carries exactly one verdict: adopt, reject, or already-covered |
| REQ-002 | Every adopted recommendation names exactly one owning document, and no recommendation is assigned to two |
| REQ-003 | Every adopted recommendation names the specific failure it prevents, because a rule that cites no failure is an appeal to authority |
| REQ-004 | Every contradiction between a source and an existing rule is resolved by an ADR that says which wins and why |
| REQ-005 | Where two lineages disagree, the record says whether the question was underspecified or the evidence was thin, and never averages them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A new repo rule is proposed only when no existing document owns the recommendation, and the proposal names why the existing files cannot carry it |
| REQ-007 | The reader-profile question is answered explicitly: a repo rule that binds always, or an operator-selected mode that stays off by default |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The allocation table's row count equals the union of the lineages' recommendation counts, with no row missing a verdict.
- **SC-002**: No recommendation appears under two owning documents.
- **SC-003**: The colon contradiction is resolved in an ADR naming which document changes and which stands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 artifacts | Nothing to synthesize | Verify artifacts and citations before opening this phase |
| Risk | Adopting a recommendation the stack already covers | The rule set grows without changing behavior | Classify against the current stack first, and record already-covered as a verdict |
| Risk | Placing one recommendation in two documents | Two copies that drift on the next edit | The allocation table is the single assignment, and a duplicate assignment fails the closure gate |
| Risk | Adopting everything because each item reads reasonable | A rule set nobody can hold in mind, which is the failure the sources themselves describe | Require the prevented failure per adoption, and reject items that cannot name one |
| Risk | A new rule file created for a recommendation an existing file owns | The router's trigger table grows an entry that competes with another | REQ-006 requires naming why the existing files cannot carry it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable, this phase produces a decision record and runs no timed path.
- **NFR-P02**: Not applicable, there is no throughput dimension to a decision.

### Security
- **NFR-S01**: No credential or key value enters the decision record.
- **NFR-S02**: Findings from a delegate are treated as claims to check, never as facts to transcribe.

### Reliability
- **NFR-R01**: Each verdict is traceable to the lineage finding it came from.
- **NFR-R02**: A verdict changed later supersedes its ADR rather than editing it in place.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a lineage that found nothing contributes no rows, and the record says so rather than leaving a gap.
- Maximum length: a source with dozens of recommendations is grouped by owning document, so the table stays readable.
- Invalid format: a finding with no resolvable citation is recorded as unverified and cannot carry an adoption.

### Error Scenarios
- External service failure: not applicable, this phase runs no dispatch.
- Network timeout: not applicable.
- Concurrent access: this phase runs alone, because a live lineage would freeze the repository against it.

### State Transitions
- Partial completion: the allocation table is append-safe, so a stopped session resumes from the last recorded row.
- Session expiry: not applicable, no external session is held.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Writes stay inside this folder, two documents |
| Risk | 14/25 | No code risk, but every downstream phase inherits these decisions |
| Research | 10/20 | Reading and reconciling, not new investigation |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the colon-clause ban survive contact with this repository's own prose, or does it reject sentences the reply-shape rule currently recommends?
- Is the reader-profile contract a repo rule that binds always, or an operator-selected mode that stays off by default?
- Should the wording standard split into a document half and a reply half, or stay one document read by two consumers with stated exclusions?
<!-- /ANCHOR:questions -->

---

