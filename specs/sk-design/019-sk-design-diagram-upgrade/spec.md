---
title: "Feature Specification: upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams"
description: "[One-line description]"
trigger_phrases:
  - "[Trigger phrase 1]"
  - "[Trigger phrase 2]"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/019-sk-design-diagram-upgrade |
| **Predecessor** | `018-sk-design-parent-v2/001-sk-create-chart` (the chart standard this packet ports) |
| **Successor** | None |
| **Handoff Criteria** | Every child validates `--strict`; the diagram checker, its mutation suite and CI gate are green; every capture re-read by a fresh reader |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-design-diagram` is where `sk-design-chart` stood before its v1.9.0.0: a good editorial design
system described in prose, with nothing that holds it. Its own style guide admits the 34 examples
"were built under an earlier skin" and defers regenerating them; 32 of them type hex inside the
SVG against a "single source of truth" rule; one breaks the skill's own accessible-SVG contract;
the accent budget is unmeasurable; three files disagree on the version; and the command that
routes to it names YAML files that do not exist. There is no HTML/SVG checker and no test suite.
The chart skill solved each of these in nine packets, and most of it transfers.

### Purpose
Bring the diagram skill to the chart skill's standard — a binding corpus checker with a mutation
suite and CI, a palette source the files are generated from, one version and one changelog per
round, captures re-read by someone who did not make the change — adapted where diagrams differ: a
skin chosen per deliverable rather than a scheme that follows the reader, 27 types with SVG
connectors rather than 29 forms with a data block. Phase 1 decides what transfers and what does
not, by evidence; the phases after it build in the order the evidence sets.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A five-iteration deep-research pass over the diagram skill against the chart standard.
- Whatever that pass sorts as enforceable: a diagram corpus checker, its mutation suite and CI gate.
- A token source the diagram files are generated from, and the repaint that follows.
- The corpus shape (templates, examples, catalog, screenshots), the command, and versioning.

### Out of Scope
- The 27 type references' layout rules themselves; this packet holds them, it does not rewrite them.
- The ASCII flowchart format and its validator.
- The draw.io and Mermaid extractors.

### Files to Change
[Summary table of files touched across all phases — for audit trail only; per-phase detail lives in each child's plan.md]

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/**` | Create | 001-upgrade-research | Five iterations of findings and the synthesis |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/**` | Create / Modify | 003, 005 | The checker, its tests, the CI gate |
| `.opencode/skills/sk-design/sk-design-diagram/assets/**`, `references/foundations/style-guide.md` | Modify | 002, 004 | The token source and the generated blocks |
| `.opencode/commands/design/diagram.md`, `assets/diagram-*.yaml` | Modify | 002 | Names that exist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-upgrade-research/` | Five-iteration deep research: 29 cited findings, the sort into enforceable and judged, and the phases below | Complete |
| 2 | `002-skin-contract/` | The seven contract decisions, the derivation record, one locus per contract, the command names | Complete |
| 3 | `003-applicator-and-sentinels/` | A sentinel palette block per file; the applicator that reproduces the stock bytes with `--default` | Complete |
| 4 | `004-corpus-and-catalog/` | The derivation-driven repaint, fresh captures, the question-keyed catalog read both ways, the one-locus pass over `SKILL.md` | Complete |
| 5 | `005-checker-mutations-and-ci/` | The diagram corpus checker, the mutation suite with the four refusals and the completeness triple, the blocking CI gate | Complete |
| 6 | `006-capture-and-judgment/` | The permanent human half: the formalized capture review and the one-way graduation into the checker | Complete |

> The order is forced, not preferred: the mutation suite refuses a case whose base already
> fails and the corpus fails its own rules today; the CI doctrine is green with no backlog; the
> derivation record gates the applicator, which gates the repaint, which gates the assertions.

| 7 | 007-manual-review-remediation/ | [Phase 7 scope] | Pending |
| 8 | 008-doctrine-reconciliation/ | [Phase 8 scope] | Pending |
| 9 | 009-one-form-library/ | [Phase 9 scope] | Pending |
| 10 | 010-design-md-style-reference/ | [Phase 10 scope] | Pending |
| 11 | 011-full-page-capture/ | [Phase 11 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `research/research.md` holds the conductor's synthesis over five iterations, the sort, and the phase table | Five iteration files; the synthesis read by hand; the runner's protocol shortfall recorded |
| 002 | 003 | Every value and both accent spellings trace to a primary and a rule; one locus per contract | grep-verified traces; the loci counted |
| 003 | 004 | `--default` reproduces the stock bytes over the four templates | byte diff empty |
| 004 | 005 | The repainted corpus passes every family to come | a dress run of the phase-5 checker |
| 005 | 006 | Every family has a case or a reasoned exemption; CI green with no backlog | the suite's own completeness tests; the workflow run | `check-corpus` `RESULT: PASSED`; suite green; CI workflow present |
| 006-capture-and-judgment | 007-manual-review-remediation | [Criteria TBD] | [Verification TBD] |
| 007-manual-review-remediation | 008-doctrine-reconciliation | [Criteria TBD] | [Verification TBD] |
| 008-doctrine-reconciliation | 009-one-form-library | [Criteria TBD] | [Verification TBD] |
| 009-one-form-library | 010-design-md-style-reference | [Criteria TBD] | [Verification TBD] |
| 010-design-md-style-reference | 011-full-page-capture | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Settled by phase 1, by evidence: one skin per file with all skins in one source; keep the fonts link and add fallback chains; keep onboarding and add an applicator with no second carried reference.
- Left for phase 2 to sign: whether connectors are marks (gated at 3.0) or structure (ungated); whether the accent at 2.86:1 departs or re-derives; the 4px exemption list.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
