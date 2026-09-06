---
title: "Feature Specification: Bring the lieflat-charts skill into this repository as sk-create-chart"
description: "An external data-visualization skill is worth having here, but it arrives with its primary documentation in Chinese, its own conventions, and no manual testing playbook. It has to become one of ours without losing what makes it good."
trigger_phrases:
  - "sk-create-chart"
  - "lieflat charts adoption"
  - "import an external skill"
  - "chart template skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "phase-6-closeout"
    recent_action: "Reconciled the phase map, handoff criteria and open questions against phases 009 through 011"
    next_safe_action: "Review the two recorded open questions before scheduling new phase work"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019ahF7gmhZy3Bo2bKRKK2i7"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A bare two-word chart form name still scores below the mandatory-invoke bar, confirmed unchanged by phase 011's own scope"
      - "Whether the packet changelog still matches the corpus after phases 010 and 011 is not settled by either phase's own documents"
    answered_questions:
      - "Placement is a workflow mode under sk-doc, recorded as ADR-001"
      - "Nothing is copied from the reference, recorded as ADR-002"
      - "The corpus carries twenty-one chart forms across six question families, after phase 009 added the composed form"
      - "Report mode is cut, recorded as ADR-007"
      - "No charting library is adopted, decided in phase 007"
      - "Phase 007's twelve fidelity recommendations are closed: seven applied, three partial by decision, two refused in writing"
      - "Phase 008's adjudicated recommendation set is built, across all seven of phase 009's own child phases"
      - "Phase 010 closed all five checker holes it recorded on arrival"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md. These belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Bring the lieflat-charts skill into this repository as sk-create-chart

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/001-sk-create-chart |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`lieflat-charts` is a data-visualization skill built elsewhere: 51 chart and report templates
in three families, a colour system, two validation scripts, and 26,500 lines of content. It is
already shaped like a skill, with its own `SKILL.md`, and it is good at something this
repository has no answer for.

It also cannot come here. It is PolyForm Noncommercial and this repository is MIT and public,
and those two grants contradict each other for the same bytes. The operator ruled on 2026-09-02
that nothing is copied. So the packet builds `sk-create-chart` natively, using the reference for
what to build rather than for what to move.

That leaves the original problems intact and adds one. The reference's documentation is Chinese,
so understanding it takes a translation pass. It follows its own conventions rather than the
create-skill templates. It has no manual testing playbook. And now the corpus that made it worth
studying has to be written here instead of moved.

### Purpose

A chart skill that was written here, informed by a good reference and carrying none of it.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `sk-create-chart` packet built to the create-skill templates, with its own chart corpus,
  colour system and validator.
- English throughout, as the primary and only language of the authored documents.
- A manual testing playbook, to the operator-scenario contract.
- Full routing integration, so the skill is reachable rather than merely present.

### Out of Scope

- Copying anything from the reference. Not a template, not a fragment, not a snippet. This is
  the operator's ruling and it is the constraint the whole packet is shaped around.
- Matching the reference's chart count as a target. The corpus is sized by what is worth
  having here.
- The upstream repository. This is a repository we learn from, not one we fork or track.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/**` | Create | 3, 4, 6 | The mode, its authored corpus and its playbook |
| `.opencode/skills/sk-doc/sk-create-chart/**` | Modify | 9, 10 | The corpus chrome, motion, interaction and dark theme, then the catalog and contract reconciliation, then the review-found rendering defects and checker gaps |
| Hub registry, router, vocabulary and leaf manifest | Modify | 5, 11 | Registration and stage-two routing, then the command binding and its derived advisor projection |
| Canary fixtures and pinned digests | Modify | 5, 6, 11 | Single-route coverage for the new surface, then the re-pin the command router forces |
| `.opencode/commands/create/chart.md` and its runtime mirrors | Create | 11 | The thin command router, its owned assets and its reach across every runtime |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-source-inventory-and-placement/ | Read only. Inventory every source file, and decide with evidence whether this is an sk-doc mode or a standalone skill | Complete |
| 2 | 002-translation-and-voice/ | Read the Chinese documents into English so the reference can be understood, and describe what it does | Complete |
| 3 | 003-packet-scaffold/ | Build the packet shape from the create-skill templates | Complete |
| 4 | 004-native-chart-build/ | Author the colour system and the chart corpus here, and prove each template renders | Complete |
| 5 | 005-routing-integration/ | Registration and both routing stages, plus canary coverage | Complete |
| 6 | 006-playbook-and-closeout/ | The manual testing playbook, then the whole-fleet gates | Complete |
| 7 | 007-fidelity-and-library-research/ | Renumber the reference overviews from one, measure the shipped corpus against six open-source charting libraries, and apply what the research proves | Complete |
| 8 | 008-evilcharts-reference-research/ | Reverse-engineer the vendored evilcharts source, and rank what it does that the corpus does not into concrete template and contract changes | Complete |
| 9 | 009-chart-visual-overhaul/ | Rebuild the chart corpus to the look two research lineages proved, in dependency order, decomposed into seven child phases of its own | Complete |
| 10 | 010-chart-review-remediation/ | Close the rendering defects and checker holes a fresh review found, and reconcile the documents that disagreed with the packet | Complete |
| 11 | 011-chart-command-surface/ | Build `/create:chart` and land it on every runtime surface a command has to reach | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Every source file is classified as port, translate, adapt or drop, with a reason per drop | The inventory count matches a fresh scan of the clone, and nothing is unclassified |
| 002 | 003 | The reference is described well enough to build from without opening it | A capability description exists per chart family, and the voice scanner is clean |
| 003 | 004 | The empty packet passes the packaging gate | `package_skill.py --check --strict` reports PASS |
| 004 | 005 | Every authored template renders, and nothing from the reference is present | The corpus validator exits 0 after being shown it can fail, and a scan for reference strings returns nothing |
| 005 | 006 | The skill is reachable in both routing stages, not merely registered | The advisor selects it, the router resolves it, and its leaves resolve on disk |
| 006 | 007 | The playbook validates under the operator-scenario contract with a nonzero operator count, and the fleet gates pass from the final state | The playbook is in place and `check-corpus.cjs --render` passes from the shipped tree |
| 007 | 008 | The corpus is correct against upstream convention, and the remaining complaint is how it looks | Phase 7 is closed, and its own goal document records every item as applied or refused in writing |
| 008 | 009 | Both research lineages complete their five iterations each, and their findings are adjudicated into one recommendation set with a verdict per item | `research/research.md` ranks every recommendation with an evilcharts `file:line` behind it, and no file under the chart skill changed yet |
| 009 | 010 | Every one of the seven child phases closes against its own goal document | `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the final state |
| 010 | 011 | Every defect the review found carries a before and after measurement, and every checker hole left open carries the mutation that proves it | `check-corpus.cjs --render` prints `RESULT: PASSED`, and each new assertion was watched failing on a mutated copy with the rule unwired as the control |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Both of the packet's original questions are answered. Placement is a workflow mode under the
documentation hub, recorded as ADR-001, decided on tie-break machinery rather than on size.
Licensing is settled by ADR-002: nothing is copied, and the skill is built from the ideas.

The size question is answered too, and the count moved. The first corpus carried twenty chart
forms across six question families, sized by data-shape coverage rather than against the
reference count. Phase 009 added a twenty-first, the composed bar and line form, for the one
question the index had no row for. Phase 010 holds that count as a boundary rather than a
target: its own scope excludes any new chart form. Phase 011 corrects the packet's own
hub-facing count from twenty to twenty-one, in the hub mode table and the hub README.

Two items closed as recorded unknowns in `006-playbook-and-closeout/implementation-summary.md`,
and the two have since diverged. The packet changelog complaint is answered: phase 007 rewrote
it into a versioned set and moved the version forward, recorded in
`007-fidelity-and-library-research/goal.md`. Neither phase 010 nor phase 011 records a further
changelog edit in its own documents, so whether the changelog still matches the corpus after
those two phases is not settled by what either one wrote. The bare two-word chart form name
still scores below the mandatory-invoke bar. Phase 011 confirms it is unchanged: its own scope
names two plausible chart prompts that still abstain and calls that a property of the scorer
rather than a wiring gap.

Phase 007's twelve open fidelity recommendations are answered now, not open. Seven are applied:
the number formatter, null and NaN filtering, the minimum-size guard, the budget comments, the
display-ready time labels, the computed-value exception and the in-figure notice. Three close
partial by a recorded decision: the series-mapping descriptions on three forms that state a data
fact no edit to the block would update, the gradient-ramp legend that shipped as discrete
swatches rather than a continuous ramp under ADR-006 and the narrow-viewport assertion that
proves the affordance is declared rather than that a phone-width browser has stopped squashing
it. Two are refused in writing: pattern fills, because every form already satisfies the colour
rule another way, and the diverging colour system, because no catalog form consumes a midpoint
ramp. All twelve dispositions are recorded in `007-fidelity-and-library-research/goal.md`.

Phase 008 turned a second research pass, over a vendored MIT charting library, into one
adjudicated recommendation set: nine changes both lineages agreed on, four they contradicted and
four left to the operator. Phase 009 built that set across seven of its own child phases, and
its own Phase Documentation Map records all seven as Complete, including the phase that renders
the weight and glow fork and the phase that ships the dark theme and the composed form. Phase
009's own frontmatter and its own section 4 still list those four operator calls as open, which
reads as staleness inside that document rather than as a fact about the corpus, since a phase
cannot close while the decision its own deliverable depends on stays unmade.

Phase 010 was a fresh review that found rendering defects a green corpus check had certified,
and eight places where the packet's documents disagreed with the packet. Every one of its
success criteria reports Met. The packet's own account of its checker holes closed too: the
five holes phase 010 recorded on arrival are shut, per its own
`010-chart-review-remediation/implementation-summary.md`, each by a narrower parser rather than
a wider pattern, and none of the twenty-one shipped forms started failing under the wider rule.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
