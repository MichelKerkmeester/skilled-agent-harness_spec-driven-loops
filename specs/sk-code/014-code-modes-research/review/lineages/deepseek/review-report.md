# Review Report — specs/sk-code/014-code-modes-research

**Run:** `fanout-deepseek-1792944728998-jpqv4b` · lineage `deepseek` · generation 1 · lineage mode `new`
**Iterations:** 5 of 5 (stop policy `max-iterations`) · dimensions covered 4/4
**Target type:** spec-folder (Level 2 phase parent, two Level 2 children)

---

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- `hasAdvisories`: false. The verdict is not PASS, so the advisory flag does not apply.
- Active findings: **P0 0 · P1 3 · P2 11** (14 total, 0 resolved, 0 contested).
- Review scope: the packet's own documents and the loop state each child carries — 22 declared scope files plus the per-iteration records, deltas and research syntheses they point at. `.skilled/skills/sk-code/` was read as reference evidence for `spec_code` claims, never as a subject.
- Stop reason: `maxIterationsReached`. Convergence was telemetry only under the configured stop policy; the final convergence score was 0.846 with all four dimensions covered.

The packet's deliverable inventory is accurate and its research content is evidence-labelled and largely checkable. What does not hold up is the layer that declares the packet closed: three acceptance rows close against commands weaker than the criteria they answer, and the problem statement of the review child asserts an absence that a file inside the tree it quantifies over contradicts.

## 2. Planning Trigger

`/speckit:plan` **is required**. The three P1 findings are all documentation-repair work with no code change, so the plan can be small, but the closure-gate defects must be recorded before a later packet treats this research as a settled basis for implementation.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": {
      "P0": 0,
      "P1": 3,
      "P2": 11,
      "ids": [
        "R2-P1-001",
        "R3-P1-001",
        "R3-P1-002",
        "R1-P2-001",
        "R1-P2-002",
        "R1-P2-003",
        "R2-P2-001",
        "R3-P2-001",
        "R4-P2-001",
        "R4-P2-002",
        "R5-P2-001",
        "R5-P2-002",
        "R5-P2-003",
        "R5-P2-004"
      ]
    },
    "remediationWorkstreams": [
      "W1 — record the boundary-gate narrowing (R3-P1-001)",
      "W2 — reconcile AC-011 with ADR-001 (R3-P1-002)",
      "W3 — narrow the review spec's absence claim to its own finding (R2-P1-001)",
      "W4 — parent-level document refresh (R5-P2-001, R5-P2-002, R5-P2-003, R1-P2-003)",
      "W5 — acceptance-row and metadata refresh (R3-P2-001, R1-P2-001)",
      "W6 — evidence and citation upkeep (R2-P2-001, R1-P2-002, R4-P2-002)",
      "W7 — executor and containment hygiene (R4-P2-001, R5-P2-004)"
    ],
    "specSeed": [
      "Amend goal.md completion criterion 3 and acceptance-criteria AC-009 so the boundary gate names the same command in both documents, and record the two-folder scope in an ADR.",
      "Amend ADR-001 (or add ADR-003) so the recorded AC-011 rule matches the executed command, including the skip clause.",
      "Narrow 002-review-mode-research/spec.md:71 to the claim its own run established: the review packet names no reader for the quality envelope.",
      "Refresh the parent Files to Change table and the phase-handoff verification to match what the children actually changed and decided."
    ],
    "planSeed": [
      "Add ADR-003 to both children recording the boundary-gate scope and the AC-011 skip clause; update AC-009 and AC-011 verification cells to cite it.",
      "Re-anchor the ten drifted ROUTER.md citations, or state in the References section that line anchors are read against the recorded baseline commit.",
      "Update goal.md D3/D4 or move the amendment into the directive so the durable directive matches the executed contract.",
      "Set both acceptance-criteria metadata blocks to Complete and reconcile completion_pct across spec.md, goal.md and the child summaries.",
      "Remove or commit the three untracked scratch commit drafts and record scratch/ in the change list."
    ],
    "findingClasses": [
      "closure-gate-integrity",
      "gate-command-drift",
      "spec-mismatch",
      "criterion-staleness",
      "citation-drift",
      "documentation-state-drift",
      "metadata-inconsistency",
      "stale-record",
      "control-gap",
      "evidence-retention",
      "authority-drift",
      "stale-change-list",
      "duplicated-rule-drift",
      "workspace-hygiene"
    ],
    "affectedSurfacesSeed": [
      "specs/sk-code/014-code-modes-research/goal.md",
      "specs/sk-code/014-code-modes-research/spec.md",
      "specs/sk-code/014-code-modes-research/001-quality-mode-research/acceptance-criteria.md",
      "specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md",
      "specs/sk-code/014-code-modes-research/001-quality-mode-research/decision-record.md",
      "specs/sk-code/014-code-modes-research/002-review-mode-research/decision-record.md",
      "specs/sk-code/014-code-modes-research/001-quality-mode-research/implementation-summary.md",
      "specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md",
      "specs/sk-code/014-code-modes-research/00{1,2}-*/research/research.md",
      "specs/sk-code/014-code-modes-research/scratch/"
    ],
    "fixCompletenessRequired": false
  }
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Impact | Disposition |
|----|----------|-----------|-------|----------|--------|-------------|
| R2-P1-001 | P1 | traceability | The review spec asserts an absence that the hub playbook contradicts | `002-review-mode-research/spec.md:71` vs `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:153,155` | The problem statement behind integration rank 6 overstates the gap; a later packet may build a reader that already exists as documented behaviour | Fix by narrowing the sentence to the child's own I-3 |
| R3-P1-001 | P1 | traceability | The `.skilled` boundary gate was narrowed in the acceptance criteria and left unmet in the goal, with no decision record | `goal.md:100` vs `002-.../acceptance-criteria.md:65`; `git diff --stat f8671e07c2 -- ':/.skilled'` prints 131 files | A closed packet's boundary gate is neither met nor recorded; the parent handoff criterion repeats the same clause | Add an ADR and align both documents |
| R3-P1-002 | P1 | traceability | AC-011 was closed against a weaker command than its own ADR records | `002-.../decision-record.md:69` vs `002-.../acceptance-criteria.md:67` | The executed check excludes the two lines that would fail it; the ADR still states the stricter rule | Record the skip clause in the ADR |
| R1-P2-001 | P2 | correctness | Acceptance-criteria metadata still reads In Progress on a closed packet | `002-.../acceptance-criteria.md:42`, `001-.../acceptance-criteria.md:42` | Closure-gate metadata contradicts the closure statement in the same file | Set both to Complete |
| R1-P2-002 | P2 | correctness | A known limitation names a stray file that is not in the tree | `002-.../implementation-summary.md:128` | The operator is told to act on a file that does not exist | Drop or correct limitation 4 |
| R1-P2-003 | P2 | correctness | Three documents report three different completion percentages for one closed packet | `spec.md:30` (95), `goal.md:26` (0), `002-.../implementation-summary.md:25` (100) | Resume surfaces cannot tell whether work remains | Reconcile to one value |
| R2-P2-001 | P2 | traceability | Ten source citations no longer land on their quoted text | `001-.../research/research.md:213` and nine further `ROUTER.md` anchors | Line anchors rotted after commit `5b33a8089b`; quoted text survives, so evidence is recoverable by search | Re-anchor or pin the baseline commit |
| R3-P2-001 | P2 | traceability | Three acceptance rows still assert ten iterations after the count became fifteen | `002-.../acceptance-criteria.md:59-61`, `goal.md:99` | Criterion text no longer matches its own evidence | Amend AC-003 to AC-005 and goal criterion 2 |
| R4-P2-001 | P2 | security | The second pass ran an executor with sandboxing disabled while the control that bounded it had already failed | `002-.../implementation-summary.md:86,127` | A privileged executor paired with a guard known to misplace sibling files; no unauthorized write observed | Add a preflight that fails closed when the guard is known defective |
| R4-P2-002 | P2 | security | The only artifact of the containment failure was deleted, leaving the write-authority claim verifiable only by prose | `002-.../implementation-summary.md:69` | NFR-S01 cannot be re-tested against the observed case | Record a manifest of removed paths before deletion |
| R5-P2-001 | P2 | maintainability | The durable directive still states the contract the packet did not execute, and the deviation lives only in the volatile log | `goal.md:52-53`, `goal.md:113` | A reader of the directive alone gets ten iterations and odd/even alternation | Move the amendment into the directive |
| R5-P2-002 | P2 | maintainability | The parent change list does not describe the change | `spec.md:119` vs `002-.../implementation-summary.md:70-73` | Scope derived from the parent table is short by seven documents | Refresh the table |
| R5-P2-003 | P2 | maintainability | A rule duplicated from a child was updated in the child and not in the parent | `spec.md:151` vs child ADR-001 and AC-011 | The parent publishes a verification that fails today | Point the parent row at the amended check |
| R5-P2-004 | P2 | maintainability | Four commit-message drafts sit untracked in the packet and none is in its change list | `scratch/commit-message-001.txt:1` | The operator inherits orphan files with no record | Commit, remove or list them |

## 4. Remediation Workstreams

**W1 — record the boundary-gate narrowing (P1).** Add an ADR in each child that names the two-folder scope for the `.skilled` boundary check, then make `goal.md` completion criterion 3 and AC-009 cite the same command. One decision, two documents, no code change.

**W2 — reconcile AC-011 with ADR-001 (P1).** Either extend ADR-001 to record the skip clause or revert the row to the ADR's rule. The two must not disagree on the two lines that decide pass from fail.

**W3 — narrow the review spec's absence claim (P1).** Replace the universal negative at `002-review-mode-research/spec.md:71` with the claim the run actually established, and name the playbook that documents the handoff.

**W4 — parent-level document refresh (P2).** `goal.md` directive (D3/D4), the parent Files to Change table, and the duplicated phase-handoff verification, plus the completion-percentage spread.

**W5 — acceptance-row and metadata refresh (P2).** AC-003 to AC-005 criterion text, and both acceptance-criteria metadata status blocks.

**W6 — evidence and citation upkeep (P2).** Re-anchor the ten drifted citations, correct or drop limitation 4, and record a removal manifest for the containment copies.

**W7 — executor and containment hygiene (P2).** Fail closed when a privileged executor is paired with a guard recorded as defective, and settle the three untracked scratch drafts.

## 5. Spec Seed

- The `.skilled` boundary gate needs one command and one recorded scope, not one command in the goal and another in the acceptance row.
- A criterion whose verification is amended must say where the amendment is recorded; the acceptance-criteria contract currently has no cell for that.
- An absolute negative ("no other file …") should be scoped to what the run actually read, or the run should list the tree it quantified over.
- The durable directive and the volatile log must not be the only two places a reader can learn what was executed.

## 6. Plan Seed

1. Write ADR-003 in both children: boundary-gate scope plus AC-011 skip clause; update AC-009 and AC-011 verification cells to cite it.
2. Update `goal.md` D3/D4 (or move the operator amendment into the directive) and tick or amend completion criteria 2 and 3.
3. Rewrite `002-review-mode-research/spec.md:71` against the playbook evidence and add the playbook to that child's dependency list.
4. Re-anchor the ten `ROUTER.md` citations or add a "read against baseline `f8671e07c2`" note to both References sections.
5. Set both acceptance-criteria metadata blocks to Complete; reconcile `completion_pct` across the three documents that carry it.
6. Refresh the parent Files to Change table from the two child change tables; point the phase-handoff row at the amended AC-011 check.
7. Decide the three untracked scratch commit drafts and list `scratch/` in the change table.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | 291 of 301 `[SOURCE: path:line]` tags resolve to their quoted text; no cited file is missing. One absolute-absence claim is contradicted (`002/spec.md:71`). Child 002's five line-numbered claims and child 001's token-level claim all resolve. |
| `checklist_evidence` | fail | AC-009 closes against a command that is not the criterion's command, with no ADR; AC-011 closes against a command that excludes the lines ADR-001 would count; AC-003 to AC-005 still assert a superseded iteration count. |

**AC_COVERAGE:** exempt. Neither child carries `checklist.md`, so the Level 2 acceptance-coverage lifecycle predicate is not active for this target. The closure gate is `acceptance-criteria.md`, and it is covered by `checklist_evidence` above.

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | `mode-registry.json` carries `sk-code-quality`, `sk-code-review`, `sk-code-skilled`, `sk-code-ci` as workflow modes; both subject modes are live entries. |
| `agent_cross_runtime` | pass | `.skilled/agents/review.md` exists and its `.claude/agents/review.md` mirror exists; the packet names only the canonical path, which is the required convention. |
| `feature_catalog_code` | pass | `feature-catalog.md:15` names both workflow modes and the registry-driven resolution; nothing in the packet contradicts it. The packet does not cite the catalog — a references gap, not a contradiction. |
| `playbook_capability` | partial | The hub-level playbook documents the quality-to-review envelope handoff that `002/spec.md:71` says does not exist (R2-P1-001); neither child lists that playbook among its sources. |

## 8. Deferred Items

- **`validate.sh --strict` claims (AC-010) were not re-verified.** The validator writes derived artifacts outside this lineage's write surface, so re-running it would violate the containment boundary this review runs under. The claim is recorded as not re-verified, not as pass or fail. Owner: the operator, at the next validation pass.
- **Attribution of `.skilled/` working-tree changes.** 131 files differ from the recorded baseline under `.skilled/`. The packet attributes them to concurrent CI wiring; this review confirms the diff but not the attribution, and R3-P1-001 asks for the record rather than the attribution.
- **Research substance.** Which of the 26 ranked recommendations is worth building is out of scope. This review checked whether the recommendations' evidence is checkable, not whether the recommendations are wise.

## Dimension Expansion Map

| Field | Value |
|-------|-------|
| Saturated directions | none — no direction was swept or declared exhausted in five iterations |
| Completed pivots | 0 |
| Failed pivots | 0 |
| Audited overrides | 0 |
| Council artifact references | none |
| Selected review directions | correctness (deliverable inventory) → traceability `spec_code` (citation resolution) → traceability `checklist_evidence` (closure gates) → security (write authority and executor control) → maintainability plus overlays |
| Remaining frontier | the packet's `plan.md` and `tasks.md` verification checklists were read but not audited row by row; the per-iteration research narratives (30 files) were sampled through their state records and deltas, not read in full |

This section records breadth only. It does not alter the Executive Summary verdict, the finding registry or the adversarial self-check results.

## 9. Search Ledger

| Field | Value |
|-------|-------|
| `searchCoverage.requiredBugClasses` | deliverable-absence, citation-drift, closure-gate-substitution, control-gap, duplicated-rule-drift, metadata-drift |
| `covered` | deliverable-absence, citation-drift, closure-gate-substitution, control-gap, duplicated-rule-drift, metadata-drift |
| `ruledOut` | missing-deliverable (15/15/15 counts confirmed present); credential exposure (secret scan clean); unflagged floor relaxation (monotonicity rule stated); instruction-injection obedience (quoted lines cited as evidence only) |
| `deferred` | `validate.sh` re-run (write surface); full read of 30 iteration narratives |
| `blocked` | none |
| `graphCoverageMode` | `graphless_fallback` — no coverage graph was seeded, because `upsert.cjs` writes graph state outside this lineage's write surface |
| `candidateCoverage` | 6 of 6 required bug classes covered |
| `searchDebt` | empty |
| `cleanSearchProof` | every ruled-out class carries a command or a read that would have shown the defect: directory inventory, a 301-tag citation match, a read-only run of the published greps, a secret-pattern scan, and the ranked-table readiness cells |

## Audit Appendix

**Convergence summary.** Five iterations under `max-iterations`. `newFindingsRatio` by iteration: 1.0, 0.667, 0.55, 0.09, 0.154. The final convergence score was 0.846 with 4/4 dimensions covered. No iteration was stuck; no recovery path was needed.

**Coverage summary.** correctness 1 iteration · traceability 2 iterations · security 1 iteration · maintainability 1 iteration. All four dimensions carry at least one full pass, and both core protocols were executed.

**Ruled-out claims (with the check that ruled them out).**

- *Iterations 1 to 15 missing* — ruled out by listing `research/iterations/` and `research/deltas/` directly (15 files each in both children).
- *Secrets in the packet* — ruled out by a pattern scan over every `.md`, `.json` and `.jsonl` outside the review lineage.
- *A recommendation that relaxes a floor silently* — ruled out by reading the readiness cells; child 002 states the monotonicity rule at `research/research.md:19`, and child 001 marks its floor change `Needs decision`.
- *An obeyed instruction embedded in a reviewed file* — ruled out by checking that quoted imperative lines are cited as evidence and that no recommendation depends on them as commands.

**Sources reviewed.** 5 iteration narratives, 5 delta files, 5 state-log records, 22 declared scope files, 2 research syntheses (301 tags), 2 acceptance-criteria files (11 rows each), 2 decision records (2 ADRs each), 2 implementation summaries, 2 goal files, `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/sk-code/ROUTER.md`, `.skilled/skills/sk-code/mode-registry.json`, `.skilled/skills/sk-code/feature-catalog/feature-catalog.md`, `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, `.skilled/agents/review.md`, `.claude/agents/review.md`.

**Cross-reference appendix — Core Protocols.** `spec_code` partial; `checklist_evidence` fail. See section 7.

**Cross-reference appendix — Overlay Protocols.** `skill_agent` pass; `agent_cross_runtime` pass; `feature_catalog_code` pass; `playbook_capability` partial. See section 7.

**Method notes.** Every finding carries a `file:line` citation read at review time. Two P1 findings carry typed claim-adjudication packets in their iteration narratives. Where a claim could not be re-run inside the write surface, it is recorded as not re-verified rather than as a pass.
