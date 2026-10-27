# Deep Review Report - 054-weak-model-spec-authoring (pi-deepseek-1 lineage, wave 2)

**Session**: `fanout-pi-deepseek-1-1792950661620-vss1cp` | **Generation**: 1 | **Lineage mode**: new
**Review target**: `specs/system-speckit/054-weak-model-spec-authoring` (spec-folder)
**Iterations**: 10 of 10 | **Stop reason**: `maxIterationsReached`
**Executor**: cli-pi `deepseek-v4.1-flash-1017` (max effort)

---

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

| Severity | Active |
|----------|-------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 4 |
| P2 (Suggestions) | 14 |

`hasAdvisories`: false (the verdict is CONDITIONAL, not PASS).

This lineage opened where wave 1 closed: it read the two shipped guards as programs, the packet's own destructive runbooks, the run files its completion gate names, the scripts that produce the deciding benchmark numbers, and the release-facing carriers. Nothing in the shipped templates or the benchmark evidence contradicts the packet's central claim - a weak model can author from these templates, and the decided benchmark set reproduces from its files. Four P1 findings keep the verdict conditional:

1. Phase 008's removal block deletes the worktree branch with `branch -D` and never checks the branch tip against `BASE_REF`, one of the four conditions its operator attached to the pre-approval.
2. The packet's only dangerous-mode dispatch (scenario 483) runs with the framework gate off and defines PASS without any containment check.
3. Phase 009's handoff criterion, artifact list, REQ-002 and AC-002 all bind `scratch/baseline/baseline.json`, which holds the first, failing run set; no requirement or acceptance row names the deciding set.
4. Criterion 7 ("never pushes") no longer reproduces: every packet commit, including both recorded close commits, is contained in `origin/main`.

The 14 P2 findings cluster into four groups: guard logic that ignores a drift class or a missing binary (iteration 1), evidence hygiene in the removal and card scenarios (iterations 2 and 4), measure definitions that do not match their carriers (iteration 6), and documentation claims that outrun the tree (iteration 8's example pair, iteration 9's agent row).

**Review scope**: both guard scripts and the comparison library; the card, checklist and sync guard; the catalog's tooling leaves; phase 008's runbook and records; phase 009's requirements, acceptance rows and harness scripts; the benchmark report and its run files; the release changelog; the doc-authoring agent across five runtime mirrors; the parent/goal pair and the closure file.

**Dimensions covered**: correctness (iterations 1, 6), security (2), traceability (3, 5, 7, 9, 10), maintainability (4, 8).

---

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL and four P1 findings need remediation. `/create:changelog` is not the next step until the P1 set is fixed or explicitly accepted.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": [],
    "P1": ["R2-P1-001", "R2-P1-002", "R3-P1-001", "R10-P1-001"],
    "P2": ["R1-P2-001", "R1-P2-002", "R1-P2-003", "R1-P2-004", "R2-P2-001", "R3-P2-001", "R4-P2-001", "R4-P2-002", "R5-P2-001", "R6-P2-001", "R6-P2-002", "R7-P2-001", "R8-P2-001", "R9-P2-001"]
  },
  "remediationWorkstreams": [
    { "order": 1, "name": "Destructive authority", "findings": ["R2-P1-001", "R2-P2-001"] },
    { "order": 2, "name": "Closure binding", "findings": ["R3-P1-001", "R10-P1-001"] },
    { "order": 3, "name": "Gate integrity", "findings": ["R1-P2-001", "R1-P2-002", "R1-P2-003", "R1-P2-004", "R5-P2-001"] },
    { "order": 4, "name": "Scenario containment and hygiene", "findings": ["R2-P1-002", "R4-P2-002"] },
    { "order": 5, "name": "Measure definitions", "findings": ["R6-P2-001", "R6-P2-002"] },
    { "order": 6, "name": "Carrier accuracy", "findings": ["R4-P2-001", "R7-P2-001", "R8-P2-001", "R9-P2-001", "R3-P2-001"] }
  ],
  "specSeed": [
    "Bind phase 009's requirement, artifact row, handoff criterion and AC-002/AC-004 to the deciding run set, or cite the report and name the set inside it.",
    "Add a BASE_REF tip comparison and a refusal path to the phase 008 removal block, and switch branch -D to branch -d so git enforces the same condition.",
    "Add an out-of-scope check against the run boundary to scenario 483's step 3 and to its PASS criteria, reusing the benchmark's out_of_scope_writes measure.",
    "Re-state criterion 7 as a time-bound observation with the checkpoint commit, or record the merge that moved the branch.",
    "Make each guard's suite wrapper exercise a failure case in a scratch copy, and widen the drift guard's pattern set to the third drift class."
  ],
  "planSeed": [
    "T001 tasks.md T016: add a `git rev-list BASE_REF..$WT_BRANCH` guard that prints REMOVAL_REFUSED; use branch -d.",
    "T002 scenario 483: add `git status --porcelain | rg -v '^.. specs/zz-pb-card/'` to step 3 and require an empty result in PASS.",
    "T003 009 spec: rebind REQ-002/REQ-004, the artifact row, the handoff criterion and AC-002/AC-004 to scratch/amend3/fresh2.",
    "T004 criteria.txt / goal.md: add the checkpoint commit and the merge record beside the C7 line.",
    "T005 check-example-drift.sh: include out_of_order_anchor and fail when rg is absent; example-drift.vitest.ts and card-sync.vitest.ts: add one drift-injection case each.",
    "T006 carriers: add the metadata/continuity steps to the card or point at the checklist; add GOOD/WEAK to the two short fill lines and assert them in the test; add the token rule and guards to the markdown agent's spec-doc row.",
    "T007 005 AC-008: use the repo-relative packet path instead of $PHASE; 008/009 description.json: correct the phase ordinals."
  ],
  "findingClasses": ["gate-false-negative", "gate-coverage-gap", "unguarded-destructive-operation", "unverified-containment", "hand-assembled-evidence", "gate-evidence-misbinding", "derived-metadata-drift", "followability-gap", "non-hermetic-test-procedure", "test-coverage-gap", "metric-implementation-gap", "measure-definition-drift", "evidence-command-not-self-contained", "unenforced-release-claim", "incomplete-alignment", "non-reproducible-closure-evidence"],
  "affectedSurfacesSeed": ["phase 008 T016 removal block", "playbook scenario 483", "phase 009 requirements and acceptance rows", "closure criteria file", "check-example-drift.sh", "check-card-sync.sh", "both guard test wrappers", "authoring card and checklist", "justified-anchors.sh", "run-fresh2.sh against run-amend3.sh", "templates/core spec.md.tmpl and tasks.md.tmpl", "markdown agent definition", "child description.json files"],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

### P1 findings

| ID | Title | Dimension | File:line | Finding class |
|----|-------|-----------|-----------|---------------|
| R2-P1-001 | The removal block deletes the branch without the branch-tip condition its operator approved | security | `008-playbook-run-in-worktree/tasks.md:868` | unguarded-destructive-operation |
| R2-P1-002 | Scenario 483 runs a gate-disabled writer in dangerous mode and never checks containment | security | `manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:92` | unverified-containment |
| R3-P1-001 | Phase 009's completion gate names the run set that failed, not the one that decided it | traceability | `009-authoring-benchmark-and-closeout/spec.md:43` | gate-evidence-misbinding |
| R10-P1-001 | Criterion 7's evidence no longer reproduces: every packet commit is contained in `origin/main` | traceability | `goal.md:96` | non-reproducible-closure-evidence |

Evidence, impact and fix recommendation for each are in the iteration files named below; claim adjudication packets are recorded in the iteration JSONL for every P1.

### P2 findings

| ID | Title | Iteration |
|----|-------|-----------|
| R1-P2-001 | The drift guard discards `out_of_order_anchor`, so a reordered example passes | 1 |
| R1-P2-002 | `check-card-sync.sh` asks `jq -e` a per-mode question and reads only the last answer | 1 |
| R1-P2-003 | The drift guard reports success when `rg` is not installed | 1 |
| R1-P2-004 | The checklist check proves only that the old sentence is gone | 1 |
| R2-P2-001 | The acceptance evidence for the removal row was assembled by hand | 2 |
| R3-P2-001 | Two child descriptions carry the previous child's phase number | 3 |
| R4-P2-001 | The card and the checklist describe different authoring surfaces, and the guard compares one sentence | 4 |
| R4-P2-002 | The end-to-end card scenario leaves its own state behind and still reports cleanup | 4 |
| R5-P2-001 | Both guard wrappers in the suite assert only that today's tree passes | 5 |
| R6-P2-001 | The anchor rule script counts anchors instead of identifying them | 6 |
| R6-P2-002 | The baseline and the final set compute `out_of_scope_writes` with different exclusion lists | 6 |
| R7-P2-001 | One acceptance row's command needs a variable the row never defines | 7 |
| R8-P2-001 | The release notes promise a good and a weak example in every core section, and two sections carry neither | 8 |
| R9-P2-001 | The only agent that names the card names neither the token rule nor the guards | 9 |

---

## 4. Remediation Workstreams

**Order 1 - Destructive authority (R2-P1-001, R2-P2-001).** Add the missing tip comparison to the phase 008 removal block, switch to `branch -d`, and make the block's own output the evidence file so the acceptance row does not need a hand prepend.

**Order 2 - Closure binding (R3-P1-001, R10-P1-001).** Rebind phase 009's requirement, artifact row, handoff criterion and the two acceptance rows to the deciding set; re-state criterion 7 as a checkpoint observation with the commit it was taken at.

**Order 3 - Gate integrity (R1-P2-001 to R1-P2-004, R5-P2-001).** Widen the drift guard's pattern set, fail closed when `rg` is absent, aggregate the `jq` inventory question with `all`, assert the checklist's positive pointer, and give both wrappers a failure case.

**Order 4 - Scenario containment and hygiene (R2-P1-002, R4-P2-002).** Add a containment step to scenario 483 and remove or own the pointer file and temp directory the scenario leaves.

**Order 5 - Measure definitions (R6-P2-001, R6-P2-002).** Score anchors by identity or restate the rule as a count; extract the metric block so baseline and final sides cannot diverge.

**Order 6 - Carrier accuracy (R3-P2-001, R4-P2-001, R7-P2-001, R8-P2-001, R9-P2-001).** Correct the two `description.json` ordinals, add the missing self-containment to AC-008, add the two example pairs and assert them, align the card with the checklist, and complete the markdown agent's authoring row.

---

## 5. Spec Seed

- Phase 009's requirement set must name the artifact that decided the phase, not the artifact the phase started with.
- A destructive block must implement every condition of the authority it cites, and the safest way to do that is to let git enforce it (`branch -d`).
- A playbook scenario that runs a writer with the gates off must score containment, or it teaches the opposite of what the packet measures.
- Closure evidence that reaches outside the repository belongs in a dated observation with its commit, because it cannot be replayed from the tree.

---

## 6. Plan Seed

See `planSeed` in the Planning Packet: seven tasks, ordered so the destructive and closure items land before the carrier corrections.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `goal.md:96,166,168`; `009-.../spec.md:43,146`; `tasks.md:828-874`; `justified-anchors.sh:24-39`; `run-fresh2.sh:82` | The removal gate and the deciding-set binding do not implement their carriers (R2-P1-001, R3-P1-001); two metric definitions drift (R6-P2-001, R6-P2-002). |
| `checklist_evidence` | partial | 84 acceptance rows, all Met; `criteria.txt` seven PASS lines; both baselines replayed | AC-002 binds the superseded set (R3-P1-001); AC-009's evidence was hand-assembled (R2-P2-001); AC-008 needs an undefined variable (R7-P2-001). |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `skill_agent` | pass | `SKILL.md` loads the card for four intents; the guide stays on demand | none |
| `agent_cross_runtime` | partial | five `markdown.md` mirrors carry an identical authoring row | the row names the card only (R9-P2-001) |
| `feature_catalog_code` | partial | four leaves, one index row each, no dangling path among them | the fill-guidance leaf and the card leaf repeat claims the tree does not fully meet (R8-P2-001) |
| `playbook_capability` | partial | eight scenarios, all indexed and reported PASS | scenario 483 claims cleanup and containment it does not prove (R2-P1-002, R4-P2-002) |

### AC_COVERAGE

`exempt` - the review target is a phase parent: it carries no `acceptance-criteria.md` of its own and no `implementation-summary.md`, so the lifecycle predicate that activates the advisory signal does not fire. The nine child phases each carry both files, and their 84 rows were swept in iteration 7.

---

## 8. Deferred Items

- **`create.sh --track` path traversal** - active P1 in the wave-1 deepseek lineage; not re-reported here.
- **`speckit-implement.yaml` missing the card and the token rule** - active P1 in wave 1; the agent-side instance is reported here because it is a different carrier.
- **Placeholder parity test coverage, addon fill-line guard, parent metadata staleness, report set-count wording, catalog parity leaf** - active wave-1 P2s; not re-entered.
- **`.codex` and `.devin` ship no doc-authoring agent** - predates the packet and sits outside its change surface.
- **42 unindexed playbook scenarios outside the packet's eight** - pre-existing, outside scope.
- **Two dangling catalog paths in out-of-scope leaves** - `core-workflow-infrastructure.md`, `spec-validation-rule-engine.md`; outside the packet's change surface, recorded for the catalog owner.
- **The `L3+` heading label** - verified correct in all six notes; no work outstanding.
- **The `fix-completeness` fill note** - verified as the fixed text; no work outstanding.

---

## Dimension Expansion Map

Convergence was treated as telemetry only. Each iteration pivoted to a direction no earlier iteration or wave-1 lineage had entered:

| # | Focus | Why this direction |
|---|-------|--------------------|
| 1 | Guard scripts as programs | Wave 1 read the guards' documentation, not their exit paths |
| 2 | Destructive authority in the packet's own runbooks | No lineage had read the removal block's conditions |
| 3 | Which run file the completion gate binds | The deciding set question was only answered in prose |
| 4 | Card versus checklist as competing authorities | The guard between them had not been read |
| 5 | Catalog leaves against the tests they name | Overlay protocol coverage gap |
| 6 | The harness that produces the deciding numbers | The scripts had never been read as programs |
| 7 | Replaying the 84 acceptance rows and both baselines | `checklist_evidence` was pending in every earlier pass |
| 8 | Release-facing claims | The changelog is read by people who never open the packet |
| 9 | The doc-authoring agent across runtimes | Overlay protocol `agent_cross_runtime` |
| 10 | Closure criteria replayed against live repo state | The only criterion that reaches outside the tree |

Completed pivots: 10. Failed pivots: 0. Audited overrides: 0. Saturated directions: none - the run closed on the iteration ceiling, not on exhaustion.

---

## 9. Search Ledger

Aggregate of the per-iteration ledgers, which carry the full rows:

| Bug class | Coverage |
|-----------|----------|
| gate_false_negative | covered (iteration 1) |
| gate_coverage_gap | covered (1, 5) |
| environment_dependency | covered (1) |
| unguarded_destructive_operation | covered (2) |
| unverified_containment | covered (2) |
| hand_assembled_evidence | covered (2) |
| gate_evidence_misbinding | covered (3) |
| derived_metadata_drift | covered (3) |
| followability_gap | covered (4) |
| non_hermetic_test | covered (4) |
| test_coverage_gap | covered (5) |
| metric_implementation_gap | covered (6) |
| measure_definition_drift | covered (6) |
| evidence_contamination | ruled out with evidence (6) |
| evidence_command_not_self_contained | covered (7) |
| unenforced_release_claim | covered (8) |
| incomplete_alignment | covered (9) |
| mirror_divergence | ruled out (9) |
| non_reproducible_closure_evidence | covered (10) |
| missing_commit | ruled out (10) |
| scope_leak | ruled out (10) |
| path_traversal | ruled out in this lineage, active in wave 1 (1) |
| dangling_catalog_path | ruled out for in-scope leaves (5) |
| baseline_number_drift | ruled out (7) |
| version_carrier_drift | ruled out (4, 8) |
| registry_drift | ruled out (4) |
| credential_exposure | ruled out (2) |
| command_injection | ruled out (2) |

`hasSearchDebt`: false. `cleanSearchProof`: every required bug class has at least one row with a disposition and evidence refs; the three P0 candidates explored (contaminated deciding set, unmet acceptance row, stale baseline numbers) were each replayed and dismissed with cited artifacts.

---

## 10. Audit Appendix

**Convergence summary.** Ten iterations, all `complete`, dispatched under `stopPolicy: max-iterations`. Convergence stayed telemetry: the angle was broadened each pass rather than synthesized early, per the run contract. Findings per iteration: 4, 3, 2, 2, 1, 2, 1, 1, 1, 1.

**Coverage summary.** All four dimensions covered; the two required core protocols exercised (`spec_code` in iterations 1-6 and 8-10, `checklist_evidence` in iterations 2, 4, 7, 8, 9, 10). Four overlay protocols: `skill_agent` pass, `agent_cross_runtime` partial, `feature_catalog_code` partial, `playbook_capability` partial.

**Ruled-out claims (with the evidence that closed them).** Deciding-set contamination (708 audit hits, all deleted-path names from a status listing, no contents); a stalled session audit (each deciding run resolved exactly one session); a dangling acceptance path (none); baseline number drift (both baselines replay exactly); template version registry drift (all 18 stamps agree, parity test exists); a missing L3+ label fix (6 of 6 notes carry it); missing nested changelogs (nine phase files plus root); skill version drift (both carriers 2.9.0.0); a recorded commit that does not exist (all 19 SHAs resolve); a scope-table create row with no artifact (every path exists); credential exposure and command injection in the packet's artifacts (checked, absent).

**Sources reviewed.** Listed per iteration in `iterations/iteration-001.md` through `iteration-010.md`, each with `[SOURCE: path:line]` citations.

**Lineage provenance.** Every iteration record was recorded through the append gateway into the lineage ledger and reduced into the registry, dashboard and strategy. The state log is a projection of that ledger; no record was written beside it.

Review verdict: CONDITIONAL
