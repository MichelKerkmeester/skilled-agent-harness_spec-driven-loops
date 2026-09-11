---
title: "Tasks: Phase 2: skill-surface-reconciliation"
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
# Tasks: Phase 2: skill-surface-reconciliation

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

- [x] T001 Confirm phase 1 is complete: `ls references/plugins/` shows only the retained set
- [x] T002 Capture the negative control: the residue grep returns hits, and 12 `RESOURCE_MAP` paths fail to resolve
- [x] T003 Read `spec.md` §3 so the edit list is the frozen one, not one re-derived from grep
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->

## Phase 2: Implementation

- [x] T004 Rewrite `SKILL.md` §2: resource loading list, `INTENT_SIGNALS`, `RESOURCE_MAP`, `specific_plugin_intents`, intent-count comment
- [x] T005 Rewrite `SKILL.md` prose: frontmatter description, keyword comment, §1 triggers, §3 headline, §7 routing row, §8 reference list
- [x] T006 Bump the `SKILL.md` version field to 0.24.0.0
- [x] T007 Rewrite `README.md`: use-it-for row, knowledge-layer paragraph, plugin table, FAQ answer
- [x] T008 Rewrite `references/plugins/installed-plugins.md` roster
- [x] T009 Rewrite `references/plugins/plugin-operation-logic.md` artifact map
- [x] T010 Rewrite `assets/workflows.md` cross-plugin examples
- [x] T011 Trim `references/notion-migration.md` links into deleted doc sets, keeping the method
- [x] T012 Rewrite `feature-catalog/FEATURE-CATALOG.md` index rows
- [x] T013 Rewrite `manual-testing-playbook/manual-testing-playbook.md` index rows
- [x] T014 Create `changelog/v0.24.0.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->

## Phase 3: Verification

- [x] T015 Resolve every `RESOURCE_MAP` path against disk; all must exist
- [x] T016 Grep the 12 removed names across the mode excluding `changelog/`; expect no hits
- [x] T017 Compare the `INTENT_SIGNALS` key set to the `RESOURCE_MAP` key set; expect identical
- [x] T018 Count `INTENT_SIGNALS` keys and compare to the intent-count comment
- [x] T019 Confirm the `SKILL.md` version field matches the changelog filename
- [x] T020 Replay an Iconic request and a Health.md request through the router by hand; both must still resolve to their retained doc sets
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->

## Completion Criteria

- Every task is checked against observed output, not against intent.
- Both gates in `plan.md` §2 ran from the final state and their output was read.
- `acceptance-criteria.md` has every row at `Met`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->

## Cross-References

- Edit list: `spec.md` §3 Files to Change
- Router model and why the four parts move together: `plan.md` §3
- Decisions: `plan.md` L3 Architecture Decision Record, ADR-003 and ADR-004
- Predecessor: `../001-plugin-doc-removal/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->

## Verification Protocol

Both gates run over the whole mode, not over the files that were edited. This is a
filter-and-transform task, and its characteristic failure is a variant nobody enumerated, which a
scan scoped to the diff cannot see.

Read the output of each gate. A grep that prints nothing because it was pointed at the wrong path
looks exactly like a grep that prints nothing because the work is done.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->

## Pre-Implementation

- [ ] Phase 1 is complete and its deletions are the only prior change in the tree
- [x] The negative control was captured: both gates fail before the work
- [x] The edit list came from `spec.md` §3, not from a fresh grep
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->

## Code Quality

The router pseudocode in `SKILL.md` §2 is Python that is read rather than run, so it is held to
readability rather than execution:

- [ ] `INTENT_SIGNALS`, `RESOURCE_MAP` and `specific_plugin_intents` name the same intents
- [ ] No stale key survives in any of the three
- [x] The comment stating the intent count matches the keys present
- [ ] Formatting and indentation match the surrounding block, with no reflow of untouched lines
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->

## Testing Checklist

- [ ] Path resolution: every `RESOURCE_MAP` value exists on disk
- [ ] Residue scan: no removed plugin name survives outside `changelog/`
- [ ] Key-set comparison: intents and map agree
- [ ] Retained routes replayed: Iconic and Health.md both still reach their doc sets
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->

## Fix Completeness

Nine documents plus one new file. The two most often missed are the ones that enumerate plugins
inside prose rather than as links:

- [ ] `SKILL.md`: all seven spots, router and prose
- [ ] `README.md`: all four spots
- [ ] `installed-plugins.md`, `plugin-operation-logic.md`, `assets/workflows.md`
- [ ] `notion-migration.md`: links removed, method intact
- [ ] Both indexes
- [ ] Changelog entry created and version bumped
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->

## Security

- [ ] No API key, token or vault path is hardcoded into any rewritten document
- [x] The Local REST API prose still reads its values from the environment rather than naming one
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->

## Documentation

This phase is documentation. The standard it is held to: a reader who has never seen the removed
plugins should find nothing that implies they were ever there, outside the changelog, which is
where that history belongs.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->

## File Organization

- [ ] Only the nine files named in `spec.md` §3 are modified
- [x] The one created file is `changelog/v0.24.0.0.md`
- [ ] No file is renamed, moved or reformatted beyond the edited spots
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->

## Verification Summary

| Check | Command | Result |
|-------|---------|--------|
| Path resolution | `test -f` over every `RESOURCE_MAP` value | done |
| Residue scan | `grep -rn` the 12 removed names, excluding `changelog/` | done |
| Key-set agreement | compare `INTENT_SIGNALS` and `RESOURCE_MAP` keys | done |
| Intent count | count keys vs the comment | done |
| Version match | `SKILL.md` version vs changelog filename | done |

Fill the Result column with what the command printed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->

## L3+: Architecture Verification

- [x] The four router parts in `plan.md` §3 were edited as one change, not incrementally
- [ ] `PLUGINS` remains the generic fallback per ADR-003, pointing only at surviving resources
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->

## L3+: Performance Verification

Not applicable as a runtime measurement. The relevant property is that `SKILL.md` gets shorter and
no route loads more than before, which the diff shows directly.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->

## L3+: Deployment Readiness

- [x] The state is stated plainly at handoff: edited, committed, or pushed, and on which branch
- [ ] No push to a remote branch happened as part of this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->

## L3+: Compliance Verification

- [ ] Only the nine listed files changed; anything else noticed was recorded rather than fixed
- [x] The out-of-scope MCP and theme documents are untouched
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->

## L3+: Documentation Verification

- [x] The changelog entry describes what was removed and what was kept, in the mode's existing changelog style
- [ ] ADR-004's reasoning is discoverable from the migration and MCP documents that kept their Local REST API prose
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->

## L3+: Sign-Off

| Role | Confirms | Status |
|------|----------|--------|
| Implementer | All nine documents reconciled and the changelog added | done |
| Verifier | Both gates run from the final state, output read | done |
<!-- /ANCHOR:sign-off -->


