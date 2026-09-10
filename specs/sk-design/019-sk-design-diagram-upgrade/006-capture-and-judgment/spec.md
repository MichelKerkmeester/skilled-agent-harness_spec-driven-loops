---
title: "Feature Specification: Phase 6: capture-and-judgment"
description: "The permanent human half: a formalized capture review for what no check can hold, with a one-way graduation path into the checker."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: capture-and-judgment

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 6 gives the diagram skill the standing discipline 005's checker cannot: a plain-English,
yes/no read for the six things no static check can hold — connector overlap, fan, visible gap,
behind-box, focal balance, and type fit — persisted every release through
`run-manual-playbook-scenario.cjs` into a dated `benchmark/reports/` directory, with no
hand-authored report Markdown and every skip carrying its reason. It also settles the corpus's
capture convention (the double-capture per file, plus a third skin-pinned capture that must read
as a visibly different picture) and installs the one-way door a judged item takes into the checker
the day it becomes computable. Unlike phases 002-005, this phase does not close: it is the
permanent complement to whatever the code has adopted.

**Key Decisions**: the eye runs last and permanently, never as a substitute for a family 005 could
have built (D4); the third capture is pinned to a non-default skin so "different picture" tests
the one-skin-per-file contract by eye (D1); nothing here re-derives 002's signed type-scoped role,
only whether a label still fits it under a substituted font (D9).

**Critical Dependencies**: 005's `check-diagram-corpus.cjs` and its judged-boundary block must
exist on disk before this node's graduation door has anything to point at; 002's reconciled
`findings-ledger.md` is the fact base every judged read cites rather than re-derives; the existing
`manual-testing-playbook.md` and its `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker are the
surface this phase extends, not replaces; `run-manual-playbook-scenario.cjs` is the only writer of
a dated report, confirmed on disk at its real path outside the `sk-design` tree.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-checker-mutations-and-ci |
| **Successor** | None |
| **Handoff Criteria** | None in the phase-sequence sense — "None" here means permanent, not finished. Every future release runs the capture-review discipline this phase installs: the extended persistence contract, the six-read judged column, and the one-way graduation door. Verified by: a dated report per release through `run-manual-playbook-scenario.cjs`, no hand-authored report Markdown, every skip carrying its reason. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams specification, and its last phase.

**Scope Boundary**: the judged column's six checkable reads and its two named non-blocking taste
notes, the graduation threshold for pairwise connector geometry, the font-substitution risk
correctly scoped as fixed-width label-mask overflow plus the headless-browser measurement plan
that settles it, the skin-pinned third capture and the settled double-capture convention, the
extended persistence contract, and the one-way graduation record — nothing that builds a new
checker family (005's job, already shipped), nothing that repaints a pixel or re-shoots a capture
(004's job, already done), and nothing that signs a new contract decision (002's job, already
signed).

**Dependencies**:
- 005's `check-diagram-corpus.cjs` and its judged-boundary block — the enforceable half this node's
  graduation door reads against; this node's own gate cannot be proven closed without it.
- 002's `findings-ledger.md` — the reconciled fact base F1.6, F1.10 and F3.3 cite rather than
  re-derive.
- `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md`
  — the existing playbook this phase extends with a fourth scenario category and a graduation log,
  read-modified in place rather than replaced.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs`
  — the shared runner, confirmed on disk at this exact path, outside the `sk-design` tree.
- The nine existing dated directories under `benchmark/reports/` — the naming convention and
  report shape this phase's tenth directory follows rather than reinvents.

**Deliverables**:
- An extended `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` scope covering the capture-review
  scenario, inside `manual-testing-playbook.md`.
- A fourth scenario category (`CAPTURE REVIEW`, `CAP-001`) defining the judged column, the
  skin-pinned third capture, and the settled double-capture convention.
- A graduation log section inside the same document: the schema a future graduation event fills.
- A headless-browser measurement plan for the fixed-width label-mask overflow risk (F3.3).
- The permanent discipline itself: a dated report per release, going forward.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The playbook scenario formalized: a skin-pinned third capture that must differ from the first, the settled double-capture, and the judged checklist — type fit, the remove test, taste, the visible 6–10px label gap, the deserved focal element, the unavoidable-box exception. Judgments that become computable (connector overlap, the 12px fan) graduate into the checker, logged, one way.

> **Checked against the reconciled fact base** (`002-skin-contract/findings-ledger.md`'s F1.10 and
> F3.3 rows) before this pass: no number or claim in the paragraph above contradicts it. This
> phase's own `goal.md` LOG records the check rather than silently skipping it, since two sibling
> phases' scaffolds carried a genuine number or claim error at this exact anchor and this one did
> not. The fan and gap figures above (12px, 6-10px) are the reviewer's current piloted thresholds,
> not a validated measurement — they graduate into a real number only once the 2D pass F1.6 names
> exists.

### Purpose
**Gate this phase ends on:** A dated report per release through `run-manual-playbook-scenario.cjs`; no hand-authored report; every skipped check carries its reason.

Named by phase 1's synthesis (`../001-upgrade-research/research/research.md`); the order is forced by the standard's own doctrines and is not a preference.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The judged column's six checkable reads (connector overlap, fan, visible gap, behind-box, focal
  balance, type fit), each specified as a yes/no question a reader answers while looking at a
  capture, plus the two named non-blocking taste notes the column deliberately leaves out (the
  remove test, taste) (F1.10 judged half).
- The graduation threshold for pairwise connector geometry: what a working 2D pass must compute
  for connector overlap and fan to leave the judged column (F1.6 judged half).
- The font-substitution risk, correctly scoped as fixed-width label-mask overflow rather than a
  4px grid violation, plus the headless-browser measurement plan that settles it against the 7
  named arrow-label mask rects among `example-high-level.html`'s 36 raw `<rect>` elements (F3.3).
- The skin-pinned third capture requirement and its "different picture" reader test against the
  unpinned capture.
- The settled double-capture convention: what the two captures are, when each is taken, and what a
  reader compares between them.
- The extended `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` scope, naming the capture-review
  scenario and the reason-required rule for every `SKIP` verdict.
- The one-way graduation record: what graduated, which family now holds it, the date, and the
  evidence that it is now computable — and the standing rule that nothing travels the other way.

### Out of Scope
- Building a new checker family, or editing `check-diagram-corpus.cjs`'s assertion logic — 005's
  job; this phase only reads its judged-boundary block and, on a future graduation event, removes
  one line from it as the other half of the same atomic edit this phase's graduation log records.
- Repainting a pixel, re-shooting a capture, or authoring `references/catalog.md`'s content — 004's
  job, already done; this phase reviews the corpus 004 produced, it does not reproduce it.
- Signing any new contract decision (skin values, gate thresholds, marker vocabulary, font
  allowlist, node-tagging convention) — 002's job, already signed; every judged read here asserts a
  boundary 002/005 already drew.
- Actually running the capture-review scenario, the headless-browser measurement, or writing a
  dated report — this document is a planning artifact; `tasks.md` names the future execution steps,
  it does not perform them.
- Any change to `sk-design-chart/` — D12 is a hard block; no chart-skill judged-review file exists
  to read or port, so this phase authors its discipline fresh rather than porting one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md` | Modify | Extend the persistence-contract scope note; add the `CAPTURE REVIEW` (`CAP-001`) category with the judged column, the third-capture and double-capture conventions; add the graduation log section; renumber trailing sections |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/` | Create (future, per release) | A new dated directory per release, following the existing `<dated-run-label>` convention, generated only through `run-manual-playbook-scenario.cjs` |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` | Modify (future, on graduation only) | 005's judged-boundary block loses one line the day an item graduates; not touched by this phase's own authoring or first execution pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The extended `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` scope MUST cover a capture-review scenario: its `PASS`/`FAIL`/`SKIP` outcome and reason persist only through `run-manual-playbook-scenario.cjs` into a dated `<skill>/benchmark/reports/<dated-run-label>/` directory, with generated report Markdown renderer-owned and never hand-authored (the playbook persistence contract item; D12). |
| REQ-002 | `manual-testing-playbook.md` MUST define the judged column's six checkable reads — connector overlap, fan, visible gap, behind-box, focal balance, type fit — each as a yes/no question a reader can answer while looking at a capture, and MUST name the two non-blocking taste notes (the remove test, taste) the column deliberately does not reduce to a pass/fail read (F1.10 judged half). |
| REQ-003 | The document MUST state the graduation threshold for pairwise connector geometry: what a working 2D geometry pass would have to compute, for connector overlap and fan specifically, before either may leave the judged column and enter a named checker family (F1.6 judged half). |
| REQ-004 | The document MUST scope the font-substitution risk correctly — not a 4px grid violation, since the grid constrains authored coordinates that font substitution never touches, but fixed-width label-mask overflow — and MUST specify a headless-browser measurement (what page loads, which font stack is disabled, what is compared, what counts as a fail) naming the 7 arrow-label mask rects among `example-high-level.html`'s 36 raw `<rect>` elements as the concrete instance (F3.3). |
| REQ-005 | The one-way graduation record MUST specify its own schema — the item that graduated, the checker family that now holds it, the date, and the evidence that it is now computable — and MUST state plainly that nothing travels from the checker back into the judged column. |
| REQ-006 | The `manual-testing-playbook.md` category addition and the graduation log MUST both live inside the existing single-reference document rather than a new sibling file, matching the playbook's own stated split-document philosophy (root document as directory and review surface). |
| REQ-007 | No task, no code snippet, and no marker comment this phase's deliverables carry may embed a task id, finding id, ADR id, or REQ id inside a comment — the comment-hygiene hard block (D12). The existing `<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->` marker is a durable contract surface, not an ephemeral label, and quoting it verbatim is correct. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The document MUST require a third, skin-pinned capture beyond the standard pair, and MUST specify the "different picture" test a reader applies against the unpinned capture of the same source — a skin pin that produces an identical picture proves nothing and MUST be treated as a failed capture, not a passed one. |
| REQ-009 | The document MUST settle the double-capture convention: name the two captures (the light/default-ground capture and the alternate-ground capture, since headless Chrome follows the host machine's theme rather than a flag), when each is taken, and what a reader compares between them. |
| REQ-010 | Every `SKIP` verdict persisted through the extended contract MUST carry a non-empty, human-readable reason; a `SKIP` with no reason is a failure of the process itself, recorded as such, never as a neutral outcome. |
| REQ-011 | The METADATA and Phase Context sections MUST state plainly that `Successor: None` means this phase is permanent, not finished — the discipline runs on every future release, not once, and closure in the sense `acceptance-criteria.md` defines never applies to the standing process itself, only to this authoring pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -n "MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT"` against `manual-testing-playbook.md` still returns exactly one marker line, and the scope note beside it names the capture-review scenario.
- **SC-002**: The `CAPTURE REVIEW` category and its `CAP-001` entry appear in `manual-testing-playbook.md`'s cross-reference index, alongside the existing `DIA-*`, `IMP-*`, `CMD-*` entries.
- **SC-003**: A dated directory under `benchmark/reports/` whose slug names the capture-review scenario exists, generated only through `run-manual-playbook-scenario.cjs`, with a `results.csv` carrying zero rows where the verdict is `SKIP` and the reason column is empty.
- **SC-004**: The headless-browser measurement plan, once run, produces a recorded pass/fail read against the 7 named arrow-label mask rects in `example-high-level.html`.
- **SC-005**: `check-diagram-corpus.cjs`'s judged-boundary block and this phase's graduation log never list the same item at the same time, confirmed by direct read.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 005's `check-diagram-corpus.cjs` and its judged-boundary block | Without it, the graduation door has nothing on the checker side to point at, and this phase's own gate cannot be proven closed (D4) | T001 reads the judged-boundary block directly on disk before any judged-column task is written |
| Dependency | 002's `findings-ledger.md` | Without it, a judged read would have to invent a scope 002 or 005 already drew | Every judged-column item cites the exact F1.6/F1.10/F3.3 row it resolves |
| Dependency | `run-manual-playbook-scenario.cjs` at its real path outside the `sk-design` tree | A wrong or guessed path breaks every future dated report this phase's gate depends on | T003 confirms the path and its CLI contract by direct read before any scenario is authored against it |
| Risk | A judged read is defined loosely enough that two different reviewers reach different verdicts on the same capture | Undermines the entire point of formalizing a checklist that was previously informal | REQ-002 requires each read be a yes/no question answerable while looking at the capture, not a feeling |
| Risk | A skip is persisted with no reason, or a reason field is left as boilerplate | Silently erodes the "every skip carries its reason" gate this phase exists to enforce | REQ-010 makes the reason mandatory, and T015/T016 check it by direct read of `results.csv` |
| Risk | A judgment graduates into the checker but the judged-boundary block is not updated, leaving the same item listed in both places | Breaks the one-way door's own invariant and confuses a future reviewer about what still needs an eye | REQ-005's schema ties the graduation log entry and the judged-boundary block edit into one atomic change; SC-005 checks both never agree on the same item |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies to the discipline itself. The one bounded cost
  is the headless-browser measurement (F3.3), which runs against a single file
  (`example-high-level.html`) and its 7 named mask rects, not the full 39-file corpus.

### Security
- **NFR-S01**: No auth surface. The capture-review scenario reads only local files and the already
  Google-Fonts-allowlisted font stack; the headless-browser measurement disables a font stack
  locally and does not fetch a new remote resource.

### Reliability
- **NFR-R01**: No uptime target applies. The determinism target is process-level: given the same
  corpus and the same judged-column definitions, two independent readers should reach the same
  yes/no verdict on the same capture for at least the five geometric/compositional reads (connector
  overlap, fan, visible gap, behind-box, focal balance); type fit is the one read a headless-browser
  measurement can additionally corroborate.

---

## 8. EDGE CASES

### Data Boundaries
- A `SKIP` verdict persisted with an empty or boilerplate reason — REQ-010 treats this as a process
  failure, not a neutral outcome, and the phase gate (SC-003) checks for it directly.
- A skin-pinned third capture that reads as visually identical to the unpinned capture of the same
  source — REQ-008 requires this be recorded as a failed capture, since an unchanged picture proves
  the skin pin did nothing.
- A source file that changed on disk but whose committed capture did not — the double-capture
  convention (REQ-009) exists specifically so a stale capture is caught by comparing the two
  grounds against each other, not assumed current because a file with that name exists.

### Error Scenarios
- A judgment graduates into the checker, and the family that received it is later deleted or
  renamed — the graduation log's evidence field (REQ-005) is the standing record that the judgment
  once existed and where it went, so a deleted family does not silently return the item to
  unjudged, undocumented limbo.
- A reader who authored the change under review also performs its capture-review read — the
  discipline does not build an automated conflict check for this (it is a process question, not a
  computable one), so this phase names it here rather than pretending the six-read checklist alone
  prevents self-review bias.
- A report someone hand-edits after `run-manual-playbook-scenario.cjs` already generated it — the
  persistence contract's "renderer-owned, never hand-authored" clause (REQ-001) is the standing
  rule a hand-edit violates; this phase does not build a hash-check against it, since the nine
  existing reports already rely on the same unenforced convention.
- A new dated run-label collides with an existing directory name under `benchmark/reports/` — the
  existing `<dated-run-label>` convention (date plus scenario slug) makes a same-day collision
  possible only if the same scenario runs twice in one day; this phase's own first run is the
  tenth directory, distinct from all nine existing slugs by construction.

### State Transitions
- The judged column ships before the extended persistence contract is confirmed working — `tasks.md`
  sequences the contract extension and the column definition before the first scenario execution,
  so neither ships proven against a runner that was never actually confirmed.
- A future graduation event edits `check-diagram-corpus.cjs` (005's file) without a corresponding
  graduation-log entry, or vice versa — SC-005 is the standing guard that catches either half
  happening alone.

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One existing document extended (`manual-testing-playbook.md`) plus one new dated report directory per release — a smaller file surface than the corpus or checker phases, but each judged read is its own definitional surface, not a mechanical port |
| Risk | 18/25 | No auth, no API — but this is the phase every future diagram release is judged against by eye; a loosely defined read here produces disagreeing reviewers, and the entire point of formalizing the checklist is lost |
| Research | 10/20 | Most research is already reconciled in `findings-ledger.md` (F1.6, F1.10, F3.3); this node specifies and reads rather than investigates fresh |
| Multi-Agent | 10/15 | The heaviest human-review share of any phase in this packet — reading captures against the judged column is the deliverable, not a mechanical build GLM can complete alone |
| Coordination | 14/15 | Depends on 005's checker and judged-boundary block landing first (D4 order); is itself the packet's last phase, so it blocks nothing downstream, but it installs the standing process every future release depends on |
| **Total** | **66/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The judged column's six reads are defined loosely enough that two reviewers reach different verdicts on the same capture | H | M | REQ-002 requires each read be a yes/no question answerable while looking at the capture; T004 is the task that must produce exactly that shape |
| R-002 | A skip is persisted with no reason, silently breaking the phase's own literal gate | M | M | REQ-010 and T015's direct read of `results.csv` are the countermeasure |
| R-003 | The skin-pinned third capture reads as identical to the unpinned one, proving nothing about the skin contract | M | L | REQ-008's "different picture" test is checked by T014's direct comparison before the first report is accepted |
| R-004 | A future graduation event updates only one of the two required files (005's judged-boundary block, this node's graduation log), leaving them disagreeing | M | L | REQ-005's atomic-edit requirement and SC-005's standing check are the direct countermeasures |

---

## 11. USER STORIES

### US-001: A future reviewer inherits a checklist, not a feeling (Priority: P0)

**As** the person who runs the capture-review scenario for a future release, **I want** the six
judged reads specified as yes/no questions with a stated graduation threshold, **so that** my
verdict does not depend on how the corpus struck me that day, and a disagreement with a prior
reviewer can be traced to a specific read rather than argued from scratch.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-002 through AC-005).

---

### US-002: A release is accountable for what it shipped by eye, not just what it shipped by check (Priority: P0)

**As** the operator releasing a diagram-skill update, **I want** a dated report proving the
capture-review discipline actually ran, with every skip carrying its reason, **so that** "we looked
at it" is a verifiable claim, not an assertion nobody can check six months later.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-012).

---

## 12. OPEN QUESTIONS

- Whether the fan and gap thresholds this document carries as piloted values (12px fan spacing,
  6-10px visible gap) should be formalized as a named constant before or only after the 2D pass
  that would make connector overlap and fan computable — left to whichever future task builds that
  pass, since this phase's own gate only requires the threshold be stated, not pre-committed to an
  exact pixel value.
- Whether the `CAPTURE REVIEW` category should eventually split into a per-file scenario (one
  `CAP-NNN` per corpus file) or stay a single corpus-wide scenario (`CAP-001`) as this phase
  specifies it — left to the first execution pass to decide against the real time cost of reading
  39 captures in one sitting versus staged runs, since either shape satisfies REQ-001's
  discoverability requirement.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md`'s `L3: ARCHITECTURE DECISION RECORD` section — this packet carries no separate `decision-record.md` file

---
