---
title: "Feature Specification: Rebuild the chart corpus to the look the evilcharts research established"
description: "Two research lineages read the same vendored charting source and ranked what the sk-create-chart corpus does not do. This packet builds that adjudicated set in dependency order, without breaking the one-file contract or the honesty rules the corpus is built on."
trigger_phrases:
  - "chart visual overhaul"
  - "chart corpus chrome"
  - "sk-create-chart appearance"
  - "evilcharts adoption build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase parent and the first three phase children"
    next_safe_action: "Work phase 001 against its own goal document"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-chart-visual-overhaul"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "The line weight and glow fork is unanswered and it gates every later phase"
      - "A dark theme is a contract amendment because the contract allows one palette block"
      - "Whether a single series may carry a colour range needs the colour system to say when that is honest"
      - "Whether the catalog gains a composed bar and line form with a second scale"
    answered_questions:
      - "Every adoption is a re-implementation because the packet's own rule forbids copying from an outside library"
      - "Decorative plot-background patterns are rejected, which retires the only live question about the copy rule"
      - "A range window on dense series is allowed because a reader choosing to look closer is not automatic variation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X to Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md. These belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Rebuild the chart corpus to the look the evilcharts research established

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Packet Level** | 3. The parent's own document set is the lean trio, and the Level 3 depth is carried by the children |
| **Level Score** | 83 of 100, phase score 40 of 50, both thresholds met |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart |
| **Predecessor** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research |
| **Successor** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/010-chart-review-remediation |
| **Handoff Criteria** | Every phase closes against its own goal document, and the corpus check passes with `--render` from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator does not like how `sk-create-chart` looks. That complaint outlived two phases of
work: phase 007 of the previous packet measured the corpus against six charting libraries and
applied what it proved, and phase 008 read a vendored charting source with two independent
research lineages. Both lineages landed on the same nine changes, contradicted each other on
four, and left four calls to the operator. None of it is built.

The reason it is worth building carefully is that the corpus already holds properties that are
easy to lose. A delivered chart is one HTML file with no build step and no network. Two renders
of that file agree. Colour never appears outside the palette block. Those rules are what makes
the corpus reviewable, and a visual pass that quietly breaks one of them trades a real property
for a nicer picture.

### Purpose

The chart corpus reads the way the research established, built in dependency order, with the
one-file contract and the honesty rules intact at every step.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The nine changes both research lineages agreed on, re-implemented in the corpus idiom.
- The two taste forks the lineages contradicted each other on, settled by rendered comparison
  rather than by argument.
- The unique contributions each lineage kept: the empty-data notice, the catalog system
  reassignment, the bar-end radius, the round tick treatment, the scenario naming and the
  catalog gap prose.
- The four operator decisions, named as decisions with the evidence each one needs.
- Every change proven by `scripts/check-corpus.cjs`, extended where a new invariant arrives
  without a check.

### Out of Scope

- Copying a template, a fragment or a snippet from the vendored source. The packet's own rule
  at `SKILL.md:134` forbids it and carves out nothing for licence, and the research found no
  reason to amend it.
- The eleven decorative plot-background patterns. Rejected in the adjudication because
  decoration behind data biases value reading in a static deliverable.
- Adopting a charting library, a build step or a remote dependency of any kind.
- The reference implementation from the earlier packet, which is licensed in a way this
  repository cannot pass on.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | 001, 002, 003, 004, 005, 006, 007 | The chart forms, twenty at the start and twenty-one after the composed form lands |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html` | Modify | 002, 005, 007 | The six family deliveries. Phase 007 audits every headline and edits where the verdict says so |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/*.html` | Modify | 002, 005, 006 | The skeleton and the palette proof sheets. Phase 006 adds the shared geometry defaults to the skeleton |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json` | Modify | 002, 005 | Radius roles, then the dark values |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | 002, 003, 005, 006 | Chrome tokens, motion, the palette-block amendment and the contract corrections |
| `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` | Modify | 006, 007 | System reassignment, gap prose and the composed row |
| `.opencode/skills/sk-doc/sk-create-chart/references/color-system.md` | Modify | 005, 006 | Dark derivation and the multi-hue rule |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | 002, 003, 005, 007 | New invariants gain checks in the phase that introduces them |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-visual-proof-and-forks/ | Apply the agreed static chrome to one line form and one bar form, then render the weight and glow forks side by side so the operator chooses by looking | Complete |
| 2 | 002-chrome-rollout/ | Roll the settled chrome across all twenty templates, the six family deliveries and the skeleton, with a radius ladder expressed as tokens | Complete |
| 3 | 003-motion-layer/ | The first-paint reveal wipe and the bar growth, both gated on the reduce-motion preference, both settling to a deterministic final state | Complete |
| 4 | 004-interaction-layer/ | Hover tooltip, in-figure legend, hover dim and the two lines of interaction hygiene | Complete |
| 5 | 005-dark-theme/ | A media-scoped palette twin with re-chosen hues, the contrast gates re-run per theme and the checker extended | Complete |
| 6 | 006-catalog-and-contract/ | The catalog system reassignment, the gap prose, the type scale, the empty-data notice and the shared geometry defaults | Complete |
| 7 | 007-composed-form-and-closeout/ | The composed bar and line form, the scenario naming, a check per new invariant, then the version bump and close | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | The operator has answered the weight fork and the glow fork against rendered evidence, and two templates carry the settled chrome | The decision record names a chosen weight and a glow verdict, and the corpus check passes with `--render` |
| 002 | 003 | Every asset file carries the settled chrome, and the radius ladder is readable from tokens rather than from twenty hand-typed values | A grep for the old uniform radius returns nothing outside the palette block, and the corpus check passes with `--render` |
| 003 | 004 | Motion ships behind the reduce-motion preference and two renders of one file agree after it settles | The determinism proof compares two renders of the same file and reports no difference |
| 004 | 005 | Interaction is present on the forms that earn it, and no handler reads the clock or a random source | The corpus check reports zero `determinism` failures with the handlers in place |
| 005 | 006 | Both themes pass every contrast gate, and the checker asserts the dark block the same way it asserts the light one | The corpus check reports a dark section with a nonzero assertion count and zero failures |
| 006 | 007 | The catalog and the contract state what the corpus now does, and no row claims a system the colour document contradicts | The corpus check resolves the catalog in both directions with zero failures |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Four decisions belong to the operator, and only the first blocks work.

The line weight and the glow are answered by looking at renders rather than by argument. One
lineage ranks thinning the series stroke from two pixels to 0.8 as the change that buys the
most visible payoff. The other rejects it outright, citing the corpus comment that declares the
two pixel round cap a deliberate print register. Neither can settle a question of taste from
reading source, so phase 001 renders both sides and stops.

The dark theme is a contract amendment. The contract says exactly one palette block per file,
and a media-scoped twin makes two. Both lineages recommend shipping it anyway, and the counter
is that a delivered document has already picked a theme.

A multi-hue series needs the colour system document to say when one series may carry a colour
range. Right now the document says a system encodes one meaning, and a sweep along a ramp inside
a single series is a second meaning arriving without a rule.

The composed form is whether the catalog gains a bar and line form with a second scale. One
lineage proposes building it and the other proposes recording it as a catalog gap. Building it
answers more, and it is scheduled last because a new form does not fix how the existing twenty
look.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
