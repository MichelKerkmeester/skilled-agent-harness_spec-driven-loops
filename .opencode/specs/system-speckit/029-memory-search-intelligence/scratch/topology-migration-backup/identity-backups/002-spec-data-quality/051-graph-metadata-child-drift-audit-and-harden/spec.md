---
title: "Feature Specification: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk"
description: "Phase-parent graph-metadata.json only refreshes children_ids when someone re-runs backfill on the parent, so adding a child folder leaves children_ids stale and nothing flags it. This phase audits and backfills every drifted parent repo-wide and adds a validator drift check so the gap can never accumulate silently again."
trigger_phrases:
  - "graph-metadata child drift"
  - "children_ids stale"
  - "phase parent metadata"
  - "backfill graph metadata"
  - "child-count drift check"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/051-graph-metadata-child-drift-audit-and-harden"
    last_updated_at: "2026-07-06T12:51:15.752Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 3 spec for graph-metadata child-drift audit + harden"
    next_safe_action: "Implement audit script, backfill drifted parents, add drift check + RED/GREEN test"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh"
      - ".opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/051-graph-metadata-child-drift-audit-and-harden"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the drift check be a hard error or a warning under --strict?"
      - "Flag-only, or offer auto-regen of children_ids?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

A phase parent's `graph-metadata.json` records its phase children in `children_ids`, but that array is only rewritten when `backfill-graph-metadata.js` is re-run on the parent. Adding a child folder never updates it, so `children_ids` silently lags what is on disk, and no validator catches the gap. This phase audits every phase parent repo-wide, backfills the drifted ones, and adds a drift check to the validation pipeline with a RED/GREEN test so the gap can never accumulate unnoticed again.

**Key Decisions**: Drift check severity (error vs warning under `--strict`); flag-only vs auto-regen of `children_ids`.

**Critical Dependencies**: `backfill-graph-metadata.js` (children discovery via readdir), `is-phase-parent.ts` (`countPhaseChildren`), `validate.sh`/`progressive-validate.sh` pipeline.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A phase parent's `graph-metadata.json` `children_ids` array is populated only when `backfill-graph-metadata.js` is explicitly re-run against that parent. Creating a new child phase folder does not update the parent, so `children_ids` silently falls behind the on-disk `^[0-9]{3}-` phase children, and no validator flags the mismatch. Confirmed live: `sk-design` lists 8 `children_ids` but has 9 child folders (missing `009-sk-design-claude-parity`), and `003-spec-data-quality` lists 13 but has ~17. Stale `children_ids` degrades graph traversal, memory-search parent→child navigation, and `last_active_child_id` resume selection.

### Purpose
Eliminate silent child-drift: reconcile every drifted phase parent repo-wide, and add a validation check that surfaces any future disagreement between a parent's `children_ids` and its on-disk phase children, proven by a RED/GREEN test.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repo-wide audit that, for every phase parent, compares `children_ids` against the on-disk `^[0-9]{3}-` child folders holding `spec.md` or `description.json`, and reports the drift set.
- Backfill (reconcile `children_ids`) for every drifted parent, including `sk-design` and `003-spec-data-quality`.
- A drift check added to the validation pipeline (`check-graph-metadata.sh` and/or `progressive-validate.sh`), surfaced under `validate.sh --strict`, with a RED/GREEN test fixture.
- A decision-record fixing the guard semantics (severity; flag vs auto-regen).

### Out of Scope
- The global `.opencode/specs/descriptions.json` reindex - it is a generated index regenerated via `memory_index_scan` once the daemon settles (daemon-side, non-blocking).
- `z_archive` metadata coverage gaps - owned by phase `052`.
- `description.json` staleness beyond what `backfill`/`generate-description` already reconcile - out of this phase's drift class.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts` | Modify | Expose the on-disk phase-child set (reuse `countPhaseChildren` logic) for the drift comparison |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh` | Modify | Add the `children_ids` vs on-disk-children drift check |
| `.opencode/skills/system-spec-kit/scripts/tests/` (new test) | Create | RED/GREEN test: unlisted child folder → drift; after backfill → clean |
| `.opencode/specs/**/graph-metadata.json` (drifted parents) | Modify | Backfilled `children_ids` for each drifted parent (e.g. `sk-design`, `003-spec-data-quality`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit identifies every phase parent whose `children_ids` disagrees with its on-disk `^[0-9]{3}-` child folders (with `spec.md`/`description.json`) | Audit output lists `sk-design` (8→9) and `003-spec-data-quality` (13→~17) plus any others, with before/after counts |
| REQ-002 | Backfill reconciles `children_ids` for every drifted parent without mutating unrelated fields (`status`, `packet_id`, `parent_id`) | For each parent, post-backfill `children_ids` equals the sorted on-disk child set; `git diff` shows only `children_ids`/fingerprint changes |
| REQ-003 | A validation check flags a parent whose `children_ids` disagrees with its on-disk children, surfaced by `validate.sh --strict` | RED: a drifted fixture reports the check; GREEN: a reconciled fixture is clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The drift check has an ungameable RED/GREEN test (add a child folder without updating `children_ids` → RED; backfill → GREEN) | Test file passes both directions in isolation |
| REQ-005 | A decision-record documents severity (error vs warning) and flag-vs-auto-regen with rationale | `decision-record.md` carries the ADR |
| REQ-006 | `sk-design` and `003-spec-data-quality` are reconciled and validate clean | `validate.sh --strict` clean on both; `sk-design` `children_ids` includes `009-sk-design-claude-parity` |
| REQ-007 | The check is bounded and daemon-free (no full recursive re-embed) | Check completes on the specs tree without a daemon dependency |
| REQ-008 | No false positives on non-phase-parent folders (folders with no `^[0-9]{3}-` children) | Leaf spec folders and non-parents are not flagged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this phase, a repo-wide audit shows zero drift - every phase parent's `children_ids` equals its on-disk phase-child set.
- **SC-002**: `validate.sh --strict` surfaces the drift (per the decided severity) when a parent's `children_ids` lags its children, and a RED/GREEN test proves both directions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `backfill-graph-metadata.js` children discovery (readdir) | Backfill is the reconcile mechanism | Reuse as-is; only add a comparison, do not change discovery |
| Risk | Backfilling parents that a concurrent session is editing | Could clobber in-flight work | Overlap-check each parent vs origin/dirty set; skip hot parents, note them |
| Risk | `countPhaseChildren` counts a different child set than `children_ids` semantics (e.g. `research/`, `review/`) | False drift signal | Define the child set precisely: `^[0-9]{3}-` folders with `spec.md`/`description.json` |
| Risk | Auto-regen would mask an intentional exclusion | Silent behavior change | Decision-record leans flag-first so a human stays in the loop |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The drift check runs over the full `.opencode/specs` tree in a single validate pass without a daemon or embedding dependency (filesystem reads only).

### Security
- **NFR-S01**: The check and backfill read and write only spec-folder metadata; no secrets, no network, no execution of spec-declared content.

### Reliability
- **NFR-R01**: The check is deterministic - the same tree yields the same drift verdict across runs and across source vs dist execution.

---

## 8. EDGE CASES

### Data Boundaries
- Empty parent (zero `^[0-9]{3}-` children): treated as a leaf, not a phase parent - not flagged.
- Non-numbered support folders (`research/`, `review/`, `scratch/`): excluded from the child set, never counted as drift.

### Error Scenarios
- Malformed `graph-metadata.json` (missing/!array `children_ids`): the check reports it as a distinct integrity failure, not silent drift.
- Child folder present on disk but with neither `spec.md` nor `description.json`: excluded from the expected set (not yet a real phase).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~4 code + N metadata; Systems: validation pipeline + repo-wide metadata |
| Risk | 12/25 | Auth: N; API: N; Breaking: shared validator behavior change |
| Research | 8/20 | Investigation: which parents drift, child-set definition |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: concurrent-session overlap on shared parents |
| **Total** | **45/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Drift check false-positives on non-parents or support folders | M | M | Precise child-set definition + REQ-008 test |
| R-002 | Backfill collides with concurrent-session edits to a shared parent | H | M | Overlap-check, skip hot parents, explicit-path writes only |
| R-003 | Severity set to hard error blocks unrelated completions on pre-existing drift | M | M | Reconcile all drift first, then enable; decision-record picks severity deliberately |

---

## 11. USER STORIES

### US-001: Drift is caught before it corrupts traversal (Priority: P0)

**As a** memory-system maintainer, **I want** a parent's `children_ids` to always match its on-disk phase children, **so that** graph traversal and resume never silently miss a phase.

**Acceptance Criteria**:
1. Given a parent with a child folder absent from `children_ids`, When `validate.sh --strict` runs, Then the drift check reports the mismatch.
2. Given a fully reconciled parent, When `validate.sh --strict` runs, Then the drift check is clean.

---

### US-002: One command reconciles a drifted parent (Priority: P1)

**As a** spec author, **I want** to reconcile a drifted parent in one step, **so that** I can fix drift as soon as the check flags it.

**Acceptance Criteria**:
1. Given a drifted parent, When I run `backfill-graph-metadata.js` on it, Then `children_ids` matches the on-disk child set and only `children_ids`/fingerprint change.
2. Given `sk-design` after backfill, When I inspect `children_ids`, Then it includes `009-sk-design-claude-parity`.

---

### US-003: The audit is trustworthy and bounded (Priority: P1)

**As a** reviewer, **I want** the repo-wide audit to be filesystem-only and precise, **so that** I can trust its drift set without standing up a daemon.

**Acceptance Criteria**:
1. Given the full specs tree, When the audit runs, Then it completes without a daemon and lists every drifted parent with counts.
2. Given a non-phase-parent folder, When the audit runs, Then that folder is not reported as drift.

---

## 12. OPEN QUESTIONS

- Should the drift check be a hard error (blocks completion under `--strict`) or a warning that must be documented?
- Should the check offer an auto-regen path, or stay flag-only so a human confirms every `children_ids` change?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
