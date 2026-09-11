---
title: "Tasks: Phase 3: hub-routing-and-validation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: hub-routing-and-validation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->

## Phase 1: Setup

- [x] T001 Confirm phases 1 and 2 are complete; a gate over a half-reconciled tree is not evidence
- [x] T002 Capture the negative control: leaf paths under removed directories currently fail to resolve
- [x] T003 List the retained vocabulary that must survive: Iconic, Health.md and theme terms
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->

## Phase 2: Implementation

- [x] T004 Prune the mcp-obsidian leaves under removed directories from `leaf-manifest.json`
- [x] T005 Remove removed-plugin alias phrases from `mode-registry.json`
- [x] T006 Remove removed-plugin vocabulary and signals from `hub-router.json`
- [x] T007 Assert the retained vocabulary is still present in both routing files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->

## Phase 3: Verification

- [x] T008 Resolve every remaining mcp-obsidian leaf path against disk
- [x] T009 Run the per-hub check with the hub path passed explicitly; read the subject line before the verdict
- [x] T010 Run `validate.sh --strict` on each of the four packet folders; require a literal `RESULT: PASSED` each time
- [x] T011 Replay an Iconic request through compiled routing; confirm it still reaches this mode
- [x] T012 Replay a Dataview request; confirm this mode no longer claims it
- [x] T013 Run the repository-wide residue scan for removed doc-set paths
- [x] T014 Paste every gate's output into `implementation-summary.md` verbatim
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->

## Completion Criteria

- All four gates ran from the final state and their output was read, not assumed.
- `implementation-summary.md` carries the output rather than a summary of it.
- `acceptance-criteria.md` has every row at `Met`.
- The closeout states plainly whether the work is edited, committed or pushed, and on which branch.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->

## Cross-References

- Gate commands and their failure modes: `plan.md` §2 and §5
- Two-stage routing model: `plan.md` §3
- Decisions: `plan.md` L3 Architecture Decision Record, ADR-005 and ADR-006
- Predecessors: `../001-plugin-doc-removal/`, `../002-skill-surface-reconciliation/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->

## Verification Protocol

Every gate here can report green about something else, so each one is run with its counter:

| Gate | How it lies | Counter |
|------|-------------|---------|
| Per-hub check | Reports on a default hub when the path is omitted | Pass the path; read the subject line |
| `validate.sh` | A stale build exits 3 with no rule output | Require the literal `RESULT: PASSED` |
| Phase-parent validation | The output tail describes the last child | Take the first `RESULT:` line per folder |
| Route replay | A registry entry looks like a route | Replay a real request through both stages |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->

## Pre-Implementation

- [ ] Phases 1 and 2 are complete
- [x] The retained vocabulary list is written down before any term is removed
- [x] The negative control is captured, so a passing gate afterwards means something
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->

## Code Quality

Three JSON files:

- [ ] Each stays valid JSON after the edit, parsed rather than eyeballed
- [ ] Only the mcp-obsidian entries change; the other modes' entries are byte-identical
- [ ] `hub-router.json` signal keys stay bidirectionally aligned with `mode-registry.json` modes
- [ ] Formatting and key order match the surrounding file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->

## Testing Checklist

- [ ] Every remaining mcp-obsidian leaf path resolves
- [ ] No removed vocabulary survives in either routing file
- [ ] Retained vocabulary present and asserted
- [ ] Per-hub check passes, with mcp-tooling named in its subject line
- [ ] Four `RESULT: PASSED` lines, one per packet folder
- [ ] Both route replays behave as expected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->

## Fix Completeness

Three files, three surfaces, and the one most often missed is the leaf manifest, because nothing
routes through it and nothing fails when it is stale:

- [ ] `leaf-manifest.json` pruned and every remaining path resolved
- [ ] `mode-registry.json` alias phrases pruned
- [ ] `hub-router.json` vocabulary and signals pruned
- [ ] `graph-metadata.json` deliberately untouched, per ADR-005
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->

## Security

- [ ] No credential or environment value was added to a routing file
- [ ] No file outside the hub directory was modified in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->

## Documentation

`implementation-summary.md` is the deliverable of this phase as much as the edits are. It carries
the gate output verbatim, so a later reader can tell a gate that passed from one that never ran.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->

## File Organization

- [ ] Exactly three hub files modified
- [ ] No new file created outside this packet
- [ ] No scratch or temporary file left in the diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->

## Verification Summary

| Check | Command | Result |
|-------|---------|--------|
| Leaf resolution | `test -f` per remaining leaf | done |
| Vocabulary residue | `grep` removed terms in both routing files | done |
| Per-hub check | `parent-skill-check.cjs .opencode/skills/mcp-tooling` | done |
| Spec validation, 4 folders | `validate.sh <folder> --strict` | done |
| Route replay, retained | `compiled-route.cjs --hub mcp-tooling --prompt "iconic icon rules"` | done |
| Route replay, removed | `compiled-route.cjs --hub mcp-tooling --prompt "dataview query"` | done |

Paste what each command printed. "Pass" is not a result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->

## L3+: Architecture Verification

- [ ] Stage one was checked and deliberately left alone, per ADR-005
- [ ] Stage two was changed and replayed, not inferred from the registry entry
- [x] The compiled-routing artifact was inspected rather than rebuilt on assumption, per ADR-006
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->

## L3+: Performance Verification

Not applicable. Entries are removed and none added, so no route does more work than before.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->

## L3+: Deployment Readiness

- [x] The four gates passed from the final state
- [x] The closeout names the state: edited, committed or pushed, and the branch
- [ ] No push to a remote branch happened; that decision is the operator's
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->

## L3+: Compliance Verification

- [ ] Only the three named hub files changed
- [ ] Other modes' vocabulary is untouched
- [ ] Anything noticed outside scope was recorded rather than fixed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->

## L3+: Documentation Verification

- [ ] `implementation-summary.md` carries verbatim gate output
- [x] The summary distinguishes what was observed from what was inferred
- [ ] Any gate that could not be run is named, with the reason, rather than omitted
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->

## L3+: Sign-Off

| Role | Confirms | Status |
|------|----------|--------|
| Implementer | Three hub files pruned; retained vocabulary asserted | done |
| Verifier | Four gates run from the final state with output recorded | done |
<!-- /ANCHOR:sign-off -->


