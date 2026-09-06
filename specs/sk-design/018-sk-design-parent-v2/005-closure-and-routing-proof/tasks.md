---
title: "Tasks: closure and routing proof"
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
# Tasks: closure and routing proof

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T###` is a stable task id. `[P]` marks a task that may run in parallel with its neighbours; tasks
without it are ordered. A task is `[x]` only when its stated evidence was observed, never because it
looked done.

All tasks below are complete. Evidence is named per task rather than summarised at the end.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Read `scratch/routing-baseline.txt`, the only record of the fleet before anything moved
- [x] **T002** Confirm phases 002, 003, 004 and 001 are complete and their commits are on the branch
- [x] **T003** Record the current daemon generation before doing anything to it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Rebuild the advisor daemon explicitly; read `generationBefore` and `generationAfter` back (632 to 633)
- [x] **T005** Replay all sixteen baseline phrases and write `scratch/routing-after-005.txt` in the baseline's format
- [x] **T006** Diff the replay against the baseline line by line, separating owner changes from score deltas
- [x] **T007** Read the rebuild's own warning stream; find `rejectedEdges: 4`
- [x] **T008** Retarget `mcp-tooling` and `sk-communication` sibling edges from the dead standalone name to `sk-design`
- [x] **T009** Remove `sk-design`'s dangling sibling edge and its self-loop, both left by the identity merge
- [x] **T010** Regenerate the two stale derived blocks with `--write`; the default is a dry run that reports without writing
- [x] **T011** Rebuild again (637 to 638) and re-measure
- [x] **T012** [P] Correct the fleet class table against the live audit output
- [x] **T013** [P] Correct the four-hubs extension matrix row that said the hub was decommissioned
- [x] **T014** Record `016`'s partial supersession in its own spec, without rewriting the reasoning it holds
- [x] **T015** Append the closing measurements and the edge finding to `scratch/routing-regressions.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T016** Fleet metadata audit: 13 of 13, `sk-design` and `sk-doc` both class H
- [x] **T017** `ci-leaf-manifest-freshness`: 13 fresh, 0 failed
- [x] **T018** `ci-skill-derived-freshness`: 13 fresh, 0 stale, exit 0
- [x] **T019** `skill_graph_validate`: 0 errors — recorded together with the rebuild's `rejectedEdges`, because the validator cannot see that class of defect
- [x] **T020** `check-corpus.cjs --render` from the chart skill's new location: `RESULT: PASSED`
- [x] **T021** `validate.sh --strict` on the parent, all five children, and `016`
- [x] **T022** `validate-playbook-topology --strict`: FAILS on `sk-doc`. Cause identified, options written, handed to the corpus owner rather than fixed
- [x] **T023** `validate-compiled-routing-scenarios --strict`: `SD-CR-001` fails on missing criteria. Confirmed pre-existing since 2026-09-02, before this packet's first commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Daemon rebuilt and its generation observed to move, twice
- [x] Sixteen phrases replayed; zero reach nobody, against four at the baseline
- [x] Chart and diagram name `sk-design`; the three `sk-doc` controls byte-identical to baseline
- [x] `rejectedEdges` 4 to 0; indexed edges 50 to 52
- [x] Derived blocks 13 fresh, 0 stale
- [x] Three canon documents reconciled against the live audit
- [ ] `validate-playbook-topology --strict` on `sk-doc`: still FAILS, out of scope, named with its owner
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`: the frozen scope and the REQ ids these tasks satisfy
- `plan.md`: the architecture, the rollback, and the decision records
- `acceptance-criteria.md`: the rows that decide whether this packet may close
- `implementation-summary.md`: what actually shipped, with the commit
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

A command counts as evidence only after its output and exit status were read. A green run lies in
several ways: a stale build, a wrong path, a silent no-op and an assertion-free check all exit 0.
Every gate below was required to print its own result line, and every routing number is quoted with the daemon generation it was taken at. Two gates in this fleet
lie in different ways: `validate-playbook-topology` prints `verdict=FAIL` and exits 0 without
`--strict`, and `skill_graph_validate` reports clean while the builder drops four dangling edges on
every run.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] The baseline was read before any measurement, so the comparison target was fixed in advance
- [x] The daemon generation was recorded before the rebuild, so the move could be proven rather than assumed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] No code path changed; the edits are routing metadata and documentation
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] Fleet metadata audit: 13/13, exit 0
- [x] Leaf-manifest freshness: 13 fresh, exit 0
- [x] Derived freshness: 13 fresh, 0 stale, exit 0
- [x] Skill-graph rebuild: `rejectedEdges: 0`, 52 edges
- [x] `skill_graph_validate`: 0 errors, 19 warnings, all pre-existing or symmetry
- [x] Sixteen-phrase replay at generation 638
- [x] `check-corpus.cjs --render`: `RESULT: PASSED`
- [x] `validate.sh --strict`: parent + 5 children + `016`
- [ ] `validate-playbook-topology --strict` on `sk-doc`: `verdict=FAIL valid=28 blocked=4`, out of scope
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] All four rejected edges fixed, not the two obvious external ones
- [x] The self-loop found and removed; it was invisible to the graph validator
- [x] Both stale derived blocks regenerated, and the regenerator's dry-run default caught rather than
      trusted: the first two runs reported the changes without writing them
- [x] The canon fleet table checked against the live audit rather than hand-edited, which surfaced a
      third error nobody had reported: `sk-prompt` was listed class H and is class S
- [x] Two findings deliberately not fixed, each named with its cause and owner: the blocked FLOWCHART
      fixtures, and a compiled-routing scenario failing since before this packet began
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] No credential, token or key added, moved or logged
- [x] No new network call, and no dependency installed
- [x] File moves stay inside the repository; nothing is written outside it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] `spec.md` records what the closing measurements found, including the three claims that were true when made
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] No file moved in this phase; the repairs are in place
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| Advisor rebuild | generation 632 to 633, then 637 to 638; `rejectedEdges` 4 to 0 |
| Sixteen-phrase replay | 0 reach nobody (baseline: 4); 3 controls unchanged |
| Fleet metadata audit | 13/13, both hubs class H |
| Leaf-manifest freshness | 13 fresh |
| Derived freshness | 13 fresh, 0 stale |
| `skill_graph_validate` | 0 errors |
| `check-corpus.cjs --render` | `RESULT: PASSED` |
| `validate.sh --strict` | `RESULT: PASSED`, parent + 5 children + `016` |
| `validate-playbook-topology --strict` | **FAIL** on `sk-doc`, 4 blocked — out of scope, named |
| `validate-compiled-routing-scenarios --strict` | **FAIL** on `SD-CR-001` — pre-existing since 2026-09-02 |

Two gates are red and this phase does not claim otherwise. Neither is repairable inside this
packet's blast radius, and both are recorded with their cause and their owner.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Both hubs stay class H and every router path resolves to a leaf that exists
- [x] The class contract holds: every required file present, every forbidden file absent
- [x] Router paths resolve to leaves that exist on disk
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable in the runtime sense: this phase moves files and metadata and adds no code path on a
hot loop. The one measured quantity is advisor score, recorded per phrase in
`acceptance-criteria.md` rather than as a performance number.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] One commit, so the shared branch has no broken intermediate state
- [x] Every routing number quoted with the daemon generation it was measured at
- [x] Rollback named in `plan.md` and reachable by a single revert; the two red gates are named rather than closed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] Moves recorded as renames, so authorship and history survive
- [x] Historical records left as written; only live references rewritten
- [x] No document claims a result that was not observed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder, taking the first `RESULT:` line
- [x] Generated metadata regenerated after the last document edit
- [x] No spec document still carries template prose
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [x] Approved | 2026-09-06 |
| Claude Code | Implementer | [x] Approved | 2026-09-06 |
| `validate.sh --strict` | Automated gate | [x] Approved | 2026-09-06 |
<!-- /ANCHOR:sign-off -->
