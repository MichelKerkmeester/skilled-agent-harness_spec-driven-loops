# Deep Review Report - 054-weak-model-spec-authoring (deepseek lineage)

**Session**: `fanout-deepseek-1792949481267-fym7sk` | **Generation**: 1 | **Lineage mode**: new
**Review target**: `specs/system-speckit/054-weak-model-spec-authoring` (spec-folder)
**Iterations**: 10 of 10 | **Stop reason**: `maxIterationsReached`
**Executor**: cli-devin `deepseek-v4-1-flash-max`

---

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

| Severity | Active |
|----------|-------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 4 |
| P2 (Suggestions) | 18 |

`hasAdvisories`: false (the verdict is CONDITIONAL, not PASS).

The packet's core deliverables hold up under a line-by-line audit. All nine child phases read Complete, all 84 acceptance rows read Met with artifacts that still exist, both drift guards exit 0 on the final tree, the version carriers agree at 2.9.0.0, and the benchmark report keeps its three failed sets on record beside the passing fourth set. Four P1 findings keep the verdict conditional:

1. The scaffold command the authoring card prescribes accepts a traversing `--track` and creates the directory outside the repository.
2. The examples the card tells a weak model to imitate use a task format that contradicts the card's own `Verify:` rule.
3. Both placeholder implementations inspect only the first token position on a line, so an inline-code example token hides a later unfilled token.
4. The implement workflow describes spec-doc authoring but names neither the authoring card nor the v2.3 token rule that the phase 006 handoff criterion requires.

The 18 P2 findings cluster into parity and test-coverage gaps around the placeholder gate, stale parent and generated metadata, documentation claims that outrun their code, and one report whose set count is stale.

**Review scope**: the parent `spec.md`/`goal.md`, nine child phase folders (spec, plan, tasks, acceptance criteria, implementation summary), the parent and child generated metadata, the four core templates, the ten addon templates, the four catalog leaves, eight playbook scenarios, both benchmark reports, the changelog and version carriers, and the command and agent surfaces phase 006 edited.

---

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL and four P1 findings need remediation. `/create:changelog` is not the next step until the P1 set is fixed or accepted.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": [],
    "P1": ["R2-P1-001", "R5-P1-001", "R8-P1-001", "R9-P1-001"],
    "P2": ["R1-P2-001", "R1-P2-002", "R1-P2-003", "R2-P2-001", "R3-P2-001", "R3-P2-002", "R3-P2-003", "R4-P2-001", "R4-P2-002", "R5-P2-001", "R6-P2-001", "R7-P2-001", "R7-P2-002", "R8-P2-001", "R9-P2-001", "R9-P2-002", "R10-P2-001", "R10-P2-002"]
  },
  "remediationWorkstreams": [
    { "order": 1, "name": "Gate correctness", "findings": ["R8-P1-001", "R8-P2-001", "R1-P2-001", "R1-P2-002", "R2-P2-001"] },
    { "order": 2, "name": "Authoring path safety", "findings": ["R2-P1-001"] },
    { "order": 3, "name": "Card followability", "findings": ["R5-P1-001", "R5-P2-001", "R1-P2-003", "R4-P2-002"] },
    { "order": 4, "name": "Command and agent alignment", "findings": ["R9-P1-001", "R9-P2-001", "R9-P2-002"] },
    { "order": 5, "name": "Record and metadata hygiene", "findings": ["R3-P2-001", "R3-P2-002", "R3-P2-003", "R6-P2-001", "R10-P2-001", "R10-P2-002", "R4-P2-001", "R7-P2-001", "R7-P2-002"] }
  ],
  "specSeed": [
    "Add a track-slug and containment rule to create.sh's --track argument, with a traversal regression test.",
    "Amend the authoring card's step 4 to say the examples are for section shape, and update the four example Task Format lines to the Verify: form.",
    "Make both placeholder implementations iterate every token on a line, and add the divergent shapes to the parity test.",
    "Add the v2.3 placeholder rule and the authoring card to speckit-implement.yaml and implement.md.",
    "Refresh the parent continuity blocks and generated metadata at closeout, and correct the two stale parent spec rows."
  ],
  "planSeed": [
    "T001 create.sh: validate --track with the same containment rule as --path; add a traversal test.",
    "T002 examples: replace the four Task Format lines with the Verify: form, or narrow the card's step 4 wording.",
    "T003 orchestrator and shell: iterate matches per line; extend placeholder-token-gate.vitest.ts with the doc-set, angle, template-token, indented-fence and mixed-line shapes.",
    "T004 implement.yaml/implement.md: add the placeholder-upgrade rule and the card reference.",
    "T005 docs: correct the catalog leaf parity and first-disagreement claims, the scenario tool lists, and the benchmark report set count.",
    "T006 metadata: regenerate parent graph-metadata after the status flip and refresh both continuity blocks."
  ],
  "findingClasses": ["path-traversal", "followability-contradiction", "gate-false-negative", "incomplete-alignment", "documentation-contract-drift", "test-coverage-gap", "derived-metadata-drift", "continuity-metadata-drift", "stale-closure-record", "stale-scope-table", "record-overstatement", "acceptance-command-error", "precondition-drift", "status-ambiguity", "report-count-drift", "followability-gap", "gate-coverage-gap"],
  "affectedSurfacesSeed": ["create.sh argument parsing", "authoring card", "four example task files", "orchestrator placeholder rule", "shell mirror", "placeholder parity test", "speckit-implement.yaml", "parent spec and goal continuity", "parent graph metadata", "catalog leaves", "playbook scenarios 479 and 482", "benchmark report README"],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

### P1 - Required

| ID | Dimension | Title | File:line | Evidence | Fix | Class | Disposition |
|----|-----------|-------|-----------|----------|-----|-------|-------------|
| R2-P1-001 | security | Scaffold command accepts a traversing track and creates it outside the repository | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1291` | `SPECS_DIR="$SPECS_DIR/$TRACK"` then `mkdir -p` runs before validation; `--path` has a containment validator at 1223 | Validate `--track` with the same rule and add a traversal test | path-traversal | active |
| R5-P1-001 | correctness | Example task format contradicts the card's Verify rule | `.skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md:32` | All four examples declare `T### ... [effort]` and carry no `Verify:`; the card step 4 says they are safe to imitate and step 7 requires `Verify:` | Narrow step 4 to section shape and update the example format lines | followability-contradiction | active |
| R8-P1-001 | correctness | First token position only; an inline-code token hides a later real token | `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:734` | `exec` once per line and `return` on a backticked first match; shell `grep -v` drops the whole line | Iterate every match and skip only backticked ones | gate-false-negative | active |
| R9-P1-001 | traceability | Implement workflow describes authoring but omits the card and token rule | `.skilled/commands/speckit/assets/speckit-implement.yaml:288` | The asset writes tasks.md/implementation-summary.md from an inline scaffold; `v2.3`, `placeholder` and `spec-authoring-card` return 0 matches | Add the rule and card pointer to the asset and entry point | incomplete-alignment | active |

### P2 - Suggestions

| ID | Dimension | Title | File:line | Fix | Class |
|----|-----------|-------|-----------|-----|-------|
| R1-P2-001 | correctness | Catalog leaf asserts a parity the code does not have | `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md:36` | Qualify the leaf or align the mirror's doc set and markers | documentation-contract-drift |
| R1-P2-002 | correctness | Parity test pins four cells and none of the divergent shapes | `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:91` | Add a table-driven parity test over the five divergent shapes | test-coverage-gap |
| R1-P2-003 | correctness | Card token count covers three documents, the gate covers six | `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:133` | Extend the count command or name the validator as authoritative | followability-gap |
| R2-P2-001 | security | `[template:...]` title token in spec.md is invisible to the production scaffold-marker rule | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh:34` | Add spec.md to the scanned list or move the check into the placeholder rule | gate-coverage-gap |
| R3-P2-001 | traceability | Parent spec still names swe-2-max as the benchmark subject | `specs/system-speckit/054-weak-model-spec-authoring/spec.md:117` | Rewrite precondition 4 or point to goal D8 | documentation-contract-drift |
| R3-P2-002 | traceability | Parent graph metadata still reports in progress | `specs/system-speckit/054-weak-model-spec-authoring/graph-metadata.json:47` | Regenerate after the status flip | derived-metadata-drift |
| R3-P2-003 | traceability | Last-active pointer still names phase 004 | `specs/system-speckit/054-weak-model-spec-authoring/graph-metadata.json:183` | Update the pointer at closeout | derived-metadata-drift |
| R4-P2-001 | maintainability | The 61 addon fill lines have no regression guard | `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts:49` | Render the addon templates in the fill test or extend the drift guard | test-coverage-gap |
| R4-P2-002 | maintainability | Card points at a long guide it never sends the reader to | `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:18` | Name the routing condition or drop the sentence | followability-gap |
| R5-P2-001 | correctness | Card task acceptance command fails a completed packet | `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:122` | Count all task lines, not pending only | acceptance-command-error |
| R6-P2-001 | traceability | Phase 005 closure still reports two findings as open | `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md:89` | Record the amendment as applied | stale-closure-record |
| R7-P2-001 | maintainability | Card-sync guard described as failing on the first disagreement | `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md:30` | Say it reports every failed check | documentation-contract-drift |
| R7-P2-002 | maintainability | Scenarios 479 and 482 omit awk and rg from their tool lists | `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md:28` | Add both tools to both precondition lines | precondition-drift |
| R8-P2-001 | correctness | First Status row decides Draft; a later Complete claim is invisible | `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:68` | Fail on contradictory Status rows | status-ambiguity |
| R9-P2-001 | traceability | Phase 006 summary says four agents changed for the card; only one names it | `specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment/implementation-summary.md:68` | Split the row by actual change | record-overstatement |
| R9-P2-002 | traceability | Parent spec still lists doctor entries as modified by phase 006 | `specs/system-speckit/054-weak-model-spec-authoring/spec.md:104` | Mark the row audited-no-change | stale-scope-table |
| R10-P2-001 | traceability | Parent spec and goal continuity blocks point at pre-execution actions | `specs/system-speckit/054-weak-model-spec-authoring/spec.md:16` | Refresh both blocks at close | continuity-metadata-drift |
| R10-P2-002 | traceability | Benchmark report says three final sets while documenting four | `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:11` | Update both counts | report-count-drift |

---

## 4. Remediation Workstreams

### Workstream 1 - Gate correctness (P1 first)

- **R8-P1-001**: make both implementations scan every token on a line, skipping only the backticked match. Add the mixed-line case to the parity test.
- **R8-P2-001**: reject a document with contradictory Status rows, or read the metadata table by position.
- **R1-P2-001**: align the shell mirror's document set and marker set with the orchestrator, or qualify the catalog leaf to name the orchestrator as authoritative.
- **R1-P2-002**: extend `placeholder-token-gate.vitest.ts` to the doc-set, angle-bracket, `[template:`, indented-fence and mixed-line shapes.
- **R2-P2-001**: include `spec.md` in the scaffold-marker rule or move the title-token check into the placeholder rule.

### Workstream 2 - Authoring path safety

- **R2-P1-001**: validate `--track` with the same containment rule as `--path`; add a traversal regression test. This is the only security-sensitive finding, so `fixCompletenessRequired` is true and the fix needs a closed-gate replay.

### Workstream 3 - Card followability

- **R5-P1-001**: narrow the card's step 4 to section shape, then update the four example Task Format lines to the `Verify:` form.
- **R5-P2-001**: change the step 7 acceptance command to compare `Verify:` lines with all `T###` lines, not pending ones.
- **R1-P2-003**: extend the step 8 token count to all six scanned documents.
- **R4-P2-002**: name the condition that sends a reader to the long guide, or drop the sentence.

### Workstream 4 - Command and agent alignment

- **R9-P1-001**: add the v2.3 placeholder rule and the card reference to `speckit-implement.yaml` and `implement.md`.
- **R9-P2-001**: split the phase 006 agent row into the card change and the checklist removals.
- **R9-P2-002**: mark the parent's doctor row as audited-no-change.

### Workstream 5 - Record and metadata hygiene

- **R3-P2-001**, **R3-P2-002**, **R3-P2-003**, **R10-P2-001**: correct the parent spec's benchmark subject, refresh the generated status and last-active pointer, and refresh both continuity blocks.
- **R6-P2-001**: update phase 005's closure statement to record the applied amendment.
- **R4-P2-001**: guard the addon fill lines.
- **R7-P2-001**, **R7-P2-002**: correct the catalog leaf and the two scenario tool lists.
- **R10-P2-002**: update the benchmark report's set count.

### P2 advisories (no blocking order)

The 18 P2 findings are advisory. Fix them in the same pass where they sit, or record a reason for deferral; none blocks the verdict on its own.

---

## 5. Spec Seed

- Add a `--track` containment requirement to the spec's scaffold contract, mirroring the existing `--path` rule.
- State that examples are imitated for section shape only, and that the `Verify:` task format is the v2.3 contract.
- State that the placeholder gate is line-complete: every token on a line is evaluated.
- State that every command whose workflow writes a spec doc must name the card and the v2.3 token rule.
- State that the closeout refreshes continuity blocks and generated metadata before the parent reads Complete.

---

## 6. Plan Seed

- T001: `create.sh` track validation plus a traversal test.
- T002: example task-format repair and card step 4 wording.
- T003: per-line token iteration in both implementations, with the parity matrix expanded.
- T004: implement command/asset alignment.
- T005: catalog, scenario and report text corrections.
- T006: parent metadata and continuity refresh at closeout.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `spec.md:117`; `graph-metadata.json:47,183`; `spec-authoring-card.md:30`; `speckit-implement.yaml:288` | Parent and command claims are partly stale; the four lifecycle cells and the guard behavior are correct. |
| `checklist_evidence` | partial | hard | 84 AC rows across nine children; `criteria.txt` C1-C7 | 84 of 84 rows read Met; one phase 005 closure note is stale. |

`AC_COVERAGE`: **exempt**. The parent is a Level 2 phase parent with no `acceptance-criteria.md` and no `implementation-summary.md`, so the lifecycle predicate is not active.

### Overlay Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `skill_agent` | partial | advisory | `SKILL.md:173-290`; `spec-authoring-card.md:18` | Four authoring intents load the card; the guide pointer is dangling. |
| `agent_cross_runtime` | partial | advisory | `006.../implementation-summary.md:68`; four agent files | The summary overstates the change; `.claude` mirrors match. |
| `feature_catalog_code` | fail | advisory | `spec-authoring-card.md:30,50`; `versioned-placeholder-gate.md:36` | Two leaves misstate their code. |
| `playbook_capability` | fail | advisory | `authoring-card-sync-guard.md:12,28`; `example-drift-guard-catches-leak.md:28` | Two scenarios carry a wrong tool list or a wrong guard behavior. |

---

## 8. Deferred Items

- The coverage graph is empty for this lineage: `upsert.cjs` and `convergence.cjs` write to the shared graph database outside the lineage write authority, so graph convergence was recorded as read-only telemetry rather than a persisted snapshot.
- `step_fanout_merge` is owned by the parent fan-out runner, not this lineage; no merge was attempted here.
- Phase continuity was not saved through `generate-context.js`; the dispatched lineage is forbidden to write outside its directory, and the parent runner owns the canonical save.
- The resource-map coverage gate is skipped: `resource_map_present` was false at init. `resource-map.md` was still emitted by the reducer's `--emit-resource-map` pass for the merge to read.
- Phase 009's open follow-up (strict validation does not enforce required anchors) stays with the packet; this review did not re-open it.

---

## 9. Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

The ten iterations covered all four dimensions plus both traceability protocols: correctness (1, 5, 8), security (2), traceability (3, 6, 9), maintainability (4, 7), and a synthesis pass (10).

---

## 10. Search Ledger

`searchCoverage`: correctness, security, traceability, maintainability, spec_code, checklist_evidence, feature_catalog_code, playbook_capability all covered; no deferred or blocked classes.

`candidateCoverage`: the parent and nine child folders, the four core and ten addon templates, the four catalog leaves, eight scenarios, both benchmark reports, the changelog and version carriers, the three speckit workflow assets and entry points, four agents, and the placeholder, status, drift and card-sync rules.

`searchDebt`: none.

`ruledOutCandidates`:
- A blanket-error reading of the v2.3 gate (the census keeps existing packets fixed).
- Mustache `{{...}}` as a placeholder source (neither implementation matches it).
- A stamp-window bypass (a stamp past line 70 is stricter, not weaker).
- A CRLF bypass (both readers handle CRLF).
- A lowercase-token bypass (not a marker by design).
- A missing `041-006` child (it exists and reads Complete).
- A wrong README `references/` count (42 matches the tree).

`cleanSearchProof`: every claim above was read in the cited file; the two guards were executed read-only on the final tree (`EXAMPLE_DRIFT_OK`, `CARD SYNC OK`, exit 0 both).

---

## 11. Audit Appendix

### Convergence summary

| Iteration | Focus | Ratio | P0/P1/P2 (active) |
|-----------|-------|-------|-------------------|
| 1 | correctness | 1.00 | 0/0/3 |
| 2 | security | 0.67 | 0/1/4 |
| 3 | traceability | 0.25 | 0/1/7 |
| 4 | maintainability | 0.14 | 0/1/9 |
| 5 | correctness | 0.30 | 0/2/10 |
| 6 | traceability | 0.05 | 0/2/11 |
| 7 | maintainability | 0.09 | 0/2/13 |
| 8 | correctness | 0.19 | 0/3/14 |
| 9 | traceability | 0.18 | 0/4/16 |
| 10 | synthesis | 0.05 | 0/4/18 |

Stop reason: `maxIterationsReached`. Convergence was treated as telemetry under `stopPolicy: max-iterations`; the ratio fell to the no-progress threshold twice, and each time the next iteration broadened its angle instead of stopping.

### Adversarial self-check on P1

- **R2-P1-001**: re-read the assignment and `mkdir`; no track validator exists. The `--path` sibling validates. Kept P1; the command runs with caller privileges but violates the card's own write bound.
- **R5-P1-001**: re-read all four example task files and the card's steps 4 and 7. Kept P1; phase 005's own review rated it P2, and that rating is recorded rather than silently overridden.
- **R8-P1-001**: re-read both line loops. Kept P1; no other rule owns the marker.
- **R9-P1-001**: re-read the implement asset and the plan/complete assets. Kept P1; the asset explicitly writes spec docs.

No P1 was downgraded and no new P0 was found.

### Coverage summary

- Dimensions: 4 of 4.
- Core protocols: 2 of 2 executed.
- Overlay protocols: 4 of 4 assessed.
- Iteration files: 10.
- Delta files: 10.
- Findings: 22 active (4 P1, 18 P2), 0 resolved.

### Sources reviewed

Parent `spec.md`, `goal.md`, `graph-metadata.json`, `description.json`; nine child `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` (as cited per iteration); four core and ten addon templates; four catalog leaves; eight playbook scenarios; both benchmark reports; `criteria.txt`; the global and nested changelogs; `SKILL.md` and the Hermes mirror; the placeholder orchestrator and shell rule; the status classifier and cross-doc rule; the scaffold-marker rule; `create.sh`; the card-sync and example-drift guards; the three speckit workflow assets and entry points; four agent definitions.

### Resource Map Coverage Gate

Skipped: `resource_map_present` was false at init, so the three-bullet coverage gate is not emitted. The reducer's `--emit-resource-map` pass still wrote `resource-map.md` for the merge.

---

*Compiled by the deepseek lineage at iteration 10. This report is the lineage's synthesis; the cross-lineage merge remains the authoritative rollup.*
