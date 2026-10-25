# Deep Review Report: 054 Weak-Model Spec Authoring

**Review target**: `specs/system-speckit/054-weak-model-spec-authoring` (spec-folder), the parent, phases 001 to 009 and every implementation surface they changed, as merged to `main` at `10e8df7d25`.
**Run shape**: fan-out, four lineages, 10 iterations each, stop policy `max-iterations`, all four dimensions.
**Lineages**: `luna` (cli-codex `gpt-6-luna`, effort `max`, tier `fast`), `deepseek` (cli-devin `deepseek-v4-1-flash-max`), `pi-deepseek-1` and `pi-deepseek-2` (cli-pi `llmgateway/deepseek-v4.1-flash-1017`, thinking `max`).
**Synthesized**: 2026-10-25, after the conductor re-checked every P1 against source and a second pass reproduced or independently re-read each one.

---

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- Active P0: 0
- Active P1: 9 (after adjudication, where the merge reported 16)
- Active P2: 60 entries, several of them the same defect reported by two lineages
- `hasAdvisories`: false, because the verdict is CONDITIONAL, not PASS

The packet's own claims hold. Every lineage confirmed that the nine phases closed with their acceptance rows met, that the benchmark numbers reproduce from their artifacts and that the version carriers agree. The nine P1 findings sit in the surfaces the packet built or relied on: the placeholder scanners, the scaffold command the authoring card prescribes, the strict gate's anchor check, the guidance a weak model reads and one playbook scenario.

Adjudication moved seven of the merge's sixteen P1 entries. One was a duplicate (two lineages found the `--track` traversal independently). Six were downgraded to P2 because they are record staleness or need a broken environment: the `rg` preflight, criterion 7 against the operator-directed push, the stale `/spec_kit:` prefix, the parent's `swe-2-max` precondition, the phase 009 gate pointer and the phase 008 removal procedure. The last one moved after the second pass. The procedure as written skips the branch-tip guard, but the recorded run deleted a branch whose tip was the base commit.

---

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is CONDITIONAL with nine active P1 findings, one of them security-class.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "P1-01", "severity": "P1", "title": "create.sh --track accepts a traversing value and creates the folder outside the repository", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1291", "lineages": ["luna", "deepseek"]},
    {"id": "P1-02", "severity": "P1", "title": "A backticked first token hides a later unfilled token from PLACEHOLDER_FILLED", "file": ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:734", "lineages": ["deepseek"]},
    {"id": "P1-03", "severity": "P1", "title": "The post-edit placeholder scan cannot match the v2.3 colon token", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:99", "lineages": ["pi-deepseek-2"]},
    {"id": "P1-04", "severity": "P1", "title": "The post-edit placeholder scan reports 55 false hits on a strict-passing packet", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:149", "lineages": ["pi-deepseek-2"]},
    {"id": "P1-05", "severity": "P1", "title": "Strict validation passes a packet missing a required template anchor", "file": ".skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:100", "lineages": ["luna"]},
    {"id": "P1-06", "severity": "P1", "title": "The plan and implement workflows never name the authoring card or the v2.3 token rule", "file": ".skilled/commands/speckit/assets/speckit-implement.yaml:288", "lineages": ["deepseek", "pi-deepseek-2"]},
    {"id": "P1-07", "severity": "P1", "title": "The Level 2 examples the card calls safe to imitate use the task format the card forbids", "file": ".skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md:32", "lineages": ["deepseek"]},
    {"id": "P1-08", "severity": "P1", "title": "template-mapping.md teaches [PLACEHOLDER], a marker strict validation does not detect", "file": ".skilled/skills/system-spec-kit/assets/template-mapping.md:233", "lineages": ["pi-deepseek-2"]},
    {"id": "P1-09", "severity": "P1", "title": "Scenario 483 runs a dangerous-mode writer with the spec gate off and never checks where it wrote", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:92", "lineages": ["pi-deepseek-1"]}
  ],
  "remediationWorkstreams": [
    {"order": 1, "name": "Scaffold path safety", "findings": ["P1-01"]},
    {"order": 2, "name": "Placeholder scanner correctness and parity", "findings": ["P1-02", "P1-03", "P1-04"]},
    {"order": 3, "name": "Strict gate completeness", "findings": ["P1-05"]},
    {"order": 4, "name": "Weak-model guidance alignment", "findings": ["P1-06", "P1-07", "P1-08"]},
    {"order": 5, "name": "Playbook and operation safety", "findings": ["P1-09"]}
  ],
  "specSeed": [
    "Validate --track with the same containment rule --path already uses, before any mkdir.",
    "Make both placeholder implementations and the post-edit scan agree on one marker set, one fence rule and every match on a line.",
    "Add required-anchor presence to strict validation.",
    "Name the authoring card and the v2.3 token rule in every speckit command that writes spec docs."
  ],
  "planSeed": [
    "Reuse resolve_and_validate_create_target for --track and add a traversal regression test.",
    "Iterate every placeholder match per line, skipping only the backticked ones, in orchestrator.ts and rules/check-placeholders.sh, and extend the parity test with the divergent shapes.",
    "Rebuild spec/check-placeholders.sh on the shared marker set so it matches [YOUR_VALUE_HERE: ...] and stops flagging ordinary bracketed text.",
    "Add a required-anchor check fed by the template contract and prove strict fails when a required section is removed.",
    "Align the Level 2 example task lines, template-mapping.md and the plan and implement assets with the card.",
    "Add a git status containment check to scenario 483."
  ],
  "findingClasses": [
    {"id": "P1-01", "class": "path-traversal"},
    {"id": "P1-02", "class": "gate-false-negative"},
    {"id": "P1-03", "class": "gate-false-negative"},
    {"id": "P1-04", "class": "gate-false-positive"},
    {"id": "P1-05", "class": "gate-false-negative"},
    {"id": "P1-06", "class": "incomplete-alignment"},
    {"id": "P1-07", "class": "followability-contradiction"},
    {"id": "P1-08", "class": "stale-guidance"},
    {"id": "P1-09", "class": "unverified-containment"}
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh",
    ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts",
    ".skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json",
    ".skilled/commands/speckit/assets/speckit-plan.yaml",
    ".skilled/commands/speckit/assets/speckit-implement.yaml",
    ".skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md",
    ".skilled/skills/system-spec-kit/assets/template-mapping.md",
    ".skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

### P1 (Required)

| ID | Dimension | Title | File:line | Conductor evidence | Fix |
|----|-----------|-------|-----------|--------------------|-----|
| P1-01 | security | `--track` accepts `..` and creates the folder outside the repository | `runtime/cli/spec/create.sh:1291-1294` | `SPECS_DIR="$SPECS_DIR/$TRACK"` is followed by `mkdir -p` with no check. `--path` has a containment validator at line 1223. Run on a sandbox copy of the repository, `--track ../../escaped-track` exited 0 and created the folder two levels above `specs/`. An absolute track stays inside. The code predates the packet, but the card the packet ships templates `--track <track>` at `spec-authoring-card.md:54`, so a weak model supplies the value. | Run the `--path` validator over the track segment before `mkdir`, add a traversal test |
| P1-02 | correctness | A backticked first token hides a later unfilled token | `runtime/lib/validation/orchestrator.ts:734`, `runtime/cli/rules/check-placeholders.sh` | `PLACEHOLDER_MARKER_RE` has no `g` flag, so `exec` sees only the first match and the backtick check returns. Behavior test: a line holding a backticked example token and then a real one reported "No unfilled template placeholders found". The real token alone was caught. | Iterate every match, skip only backticked ones, in both implementations |
| P1-03 | correctness | The post-edit scan cannot see the v2.3 token | `runtime/cli/spec/check-placeholders.sh:99` | `PLACEHOLDER_BODY` allows no colon. Run on a folder holding only `Owner: [YOUR_VALUE_HERE: owner name]`, it returned `"status":"PASS","placeholders":0`. Control folders holding `[Owner name]` or `[YOUR_VALUE_HERE]` each returned 1, so the scan does read the file. The post-edit hook routes every spec-doc edit to this script. | Build the scan from the shared marker set |
| P1-04 | correctness | The post-edit scan flags 55 false hits | `runtime/cli/spec/check-placeholders.sh:149` | Run on this packet, which passes recursive strict validation, it returned `"status":"FAIL","placeholders":55`. The hook exits 1 on these. | Same rebuild as P1-03 |
| P1-05 | correctness | Strict validation passes a packet missing a required anchor | `runtime/cli/lib/validator-registry.json:100-109` | `ANCHORS_VALID` checks only the structure of anchors present (`runtime/lib/validation/orchestrator.ts:857-891`). Copies of phase 005 with the required `requirements` or `fix-completeness` section deleted raised nothing beyond a control edit. One rule checks presence (`runtime/lib/validation/spec-doc-structure.ts:1184-1194`), but only for `before-after.md`, `timeline.md`, `roadmap.md` and `goal.md`. Each level's required sections are already listed under `sectionGates` in `templates/spec-kit-docs.json`. Phase 009 recorded the gap as an open follow-up, so it is not a regression. | Add a required-anchor rule fed by `sectionGates` |
| P1-06 | traceability | The plan and implement workflows never name the card | `.skilled/commands/speckit/assets/speckit-implement.yaml:288`, `speckit-plan.yaml` | `rg spec-authoring-card .skilled/commands/speckit/` matches only `speckit-complete.yaml`, which names the card under a condition at line 472. Phase 006 SC-001 promises the card in any speckit command, and phase 006's `implementation-summary.md:54` says it landed. The `markdown` agent names the card for spec docs, but `speckit-implement.yaml:217` routes to that agent only for `/create:*` commands. | Name the card and the v2.3 token rule in both assets and their entry points |
| P1-07 | correctness | The examples contradict the card's `Verify:` rule | `templates/examples/level-2/tasks.md:32` | The card calls the examples "safe to imitate for shape" at line 66 and requires `Verify:` at line 117. The example's task format line and task rows carry no `Verify:`. Phase 005's own review rated this P2. | Narrow the card's line 66 or update the four example task files |
| P1-08 | correctness | `template-mapping.md` teaches a marker strict validation misses | `assets/template-mapping.md:233` | It lists `[PLACEHOLDER]` as the marker to replace. `rg 'PLACEHOLDER]'` over the orchestrator and the shell rule returns 0 matches each. A phase 005 copy with `Owner: [PLACEHOLDER]` added kept `PLACEHOLDER_FILLED` passing. The post-edit scan does flag it, but that scan also flags ordinary bracketed text (P1-04). | Replace the convention block with the v2.3 token form |
| P1-09 | security | Scenario 483 never checks containment | `manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:92,129` | The dispatch runs `devin --permission-mode dangerous` with `SYSTEM_SPEC_GATE_ENFORCE=0`. The Pass rule checks the packet, strict, the token count and cleanup, with no `git status` or diff. The only containment is an instruction in the worker's brief (lines 71-74). The cleanup step deletes the scratch packet, so a containment check has to run before it. | Add a scoped `git status` check to the Pass rule, ahead of cleanup |

### P2 (Suggestions), grouped

**Placeholder gate parity** (the same gate as P1-02 to P1-04):
- Fence detection differs between the orchestrator and the shell mirror, including indented fences (`rules/check-placeholders.sh:115-119`), found by `luna` and `pi-deepseek-2`.
- The legacy `<YOUR_VALUE_HERE:` form is flagged by the orchestrator only.
- The shell-only `[template:...]` title check has no orchestrator twin, and the scaffold-marker rule misses it too.
- The code-block exclusion in the post-edit scan skips only the fence lines.
- The parity test pins four cells and none of the divergent shapes, and the catalog leaf claims a parity the code lacks.

**Guards and their tests**:
- The drift guard reports success when `rg` is missing (downgraded from P1) and discards `out_of_order_anchor`.
- The drift guard has no floor over the example tree.
- The card-sync guard checks its fourth surface only negatively, and reads only the last `jq -e` answer.
- Both guard test wrappers assert only that today's tree passes, and the 61 add-on fill lines have no regression guard.

**Authoring card and guidance**:
- The card's token count covers three documents while the gate covers six.
- The card's task acceptance command fails a correctly completed packet.
- The card omits the tracked scaffold metadata write, and points at a long guide it never sends the reader to.
- The card and checklist describe different surfaces, and the only agent that names the card names neither the token rule nor the guards.
- The release note at `changelog/v2.9.0.0.md:24` promises good and weak examples in every core section, and two sections carry neither. The L3+ clarifier reaches `tasks.md` but not `plan.md`. `template-mapping.md` calls `decision-record.md` required.

**Playbook and benchmark procedure**:
- Scenario 483 leaves its scratch pointer behind and still reports cleanup.
- The phase 008 removal block (`008-playbook-run-in-worktree/tasks.md:868-869`) and its `plan.md` force the removal and run `branch -D` with no check that the branch holds no commit beyond BASE_REF, which `goal.md:166` made a condition of the approval. The recorded run met it anyway: the deleted branch's tip was BASE_REF `95abd302c8`, and the run's log shows a different removal script from the documented one, which tried a non-force removal first (downgraded from P1). Fix: refuse unless `git rev-list --count BASE_REF..$WT_BRANCH` is 0.
- The S8 playbook overrides the card's current scaffold command, and two scenarios omit `awk` and `rg` from their tool lists.
- The deciding anchor-score rule is missing from the benchmark recipe, and the anchor script counts rather than identifies anchors.
- The baseline and final sets use different `out_of_scope_writes` exclusion lists, `delta.json` carries no experiment identity and two run-set files are named `baseline.json`.

**Packet record hygiene**:
- Parent `graph-metadata.json` reads in progress, with `last_active_child` on phase 004.
- `008` and `009` descriptions carry the previous phase number, the parent Branch row reads `main` and two parent-spec pointers dangle.
- Continuity blocks still point at pre-execution next actions, phase 005's closure lists two applied findings as open and phase 006's summary credits four agents with the card while one names it.
- Phase 009's gate and acceptance rows point at the superseded first set (downgraded from P1), and the benchmark report subtitle names `swe-2-max` and says three sets while documenting four.
- Criterion 7 in `goal.md:96` says the build never pushes, with no note of the operator-directed push to `main` on 2026-10-25 (downgraded from P1).
- The phase-parent template and five reference docs use the retired `/spec_kit:` prefix (downgraded from P1), the parent spec still names `swe-2-max` in precondition 4 (downgraded from P1) and still lists doctor speckit entries as modified.
- `status-classifier.sh` decides Draft from the first Status row only.

---

## 4. Remediation Workstreams

### Workstream 1: Scaffold path safety (fix first)
- **P1-01**: validate `--track` with the containment rule `--path` already uses. It is the only security-class finding in a code path, two models found it independently, and the fix reuses an existing function.

### Workstream 2: Placeholder scanner correctness and parity
- **P1-02, P1-03, P1-04** plus the parity P2s. One marker set, one fence rule, every match on a line, in the orchestrator, the shell rule and the post-edit scan. Extend the parity test with each divergent shape found here.

### Workstream 3: Strict gate completeness
- **P1-05**: required-anchor presence. Includes the `status-classifier.sh` first-row P2.

### Workstream 4: Weak-model guidance alignment
- **P1-06, P1-07, P1-08** plus the card and guidance P2s.

### Workstream 5: Playbook and operation safety
- **P1-09** plus the playbook P2s, including the phase 008 branch-tip guard.

### P2 only, no blocking order
- Guards and their tests, benchmark procedure and packet record hygiene.

---

## 5. Spec Seed

- `create.sh` rejects a `--track` that resolves outside `specs/`.
- `PLACEHOLDER_FILLED`, `rules/check-placeholders.sh` and `spec/check-placeholders.sh` report the same verdict for every shape in the parity matrix.
- Strict validation fails when a template-required anchor is absent.
- Every speckit command that writes a spec doc names the authoring card first and the v2.3 token rule.
- Every playbook scenario that runs a dangerous-mode writer proves containment in its Pass rule.

---

## 6. Plan Seed

1. Reuse `resolve_and_validate_create_target` for the track segment and add traversal and valid-track tests.
2. Change the placeholder loop to scan all matches in both implementations, then add the mixed-line case to `placeholder-token-gate.vitest.ts`.
3. Rebuild `spec/check-placeholders.sh` on the shared marker set and prove it reports 0 on this packet and 1 on a file with a real token.
4. Add a required-anchor rule and a strict-mode regression that removes the fix-completeness section.
5. Align the Level 2 example task lines, `template-mapping.md` and the plan and implement assets with the card, then rerun both guards.
6. Add a `git status --porcelain` containment check to scenario 483 and, as a P2, a `rev-list` tip guard to the phase 008 removal procedure.

---

## 7. Traceability Status

### Core Protocols
- **spec_code**: CONDITIONAL. The packet's implementation matches its specs except phase 006 SC-001 (P1-06).
- **checklist_evidence**: PASS with advisories. Acceptance rows across nine phases reproduce. Phase 009's rows cite a superseded run set (P2).
- **AC_COVERAGE**: exempt at the parent, which is a phase parent with no `acceptance-criteria.md`. Each child carries its own rows.

### Overlay Protocols
- **skill_agent**: CONDITIONAL. One agent names the card, and the plan and implement assets do not (P1-06).
- **agent_cross_runtime**: PASS. `luna` iteration 6 traced the authoring route through the generated runtime mirrors.
- **feature_catalog_code**: CONDITIONAL. The versioned placeholder gate leaf claims a parity the code lacks (P2).
- **playbook_capability**: CONDITIONAL. Scenario 483 has no containment check (P1-09).

---

## 8. Deferred Items

- Required-anchor enforcement (P1-05) was out of scope for phase 009 by design. It belongs to a validator packet, not to a 054 follow-up phase.
- The `rg` dependency of both guards is a P2 until the repo supports machines without ripgrep.

---

## Dimension Expansion Map

Each lineage covered all four dimensions (`dimensionCoverage` 1.0 in every state log). The stop policy was `max-iterations`, so no lineage stopped on convergence and no pivot or Council referral ran. Selected directions included the parent and phase 009 completion claims, the placeholder gate contract, scaffold destination construction, phase 005 acceptance evidence, the authoring card against the frozen copy, runtime mirrors, strict anchor enforcement and the authoring intents through the router.

---

## 9. Search Ledger

*No search-depth state captured at the merged root.* The fan-out root carries no reducer state log, so `searchCoverage`, `candidateCoverage` and `searchDebt` exist only inside each lineage's own state. `hasSearchDebt` is UNKNOWN at the root.

---

## 10. Audit Appendix

### Convergence summary
- 40 iterations, 10 per lineage, stop reason `maxIterationsReached` for all four.
- Lineage verdicts: CONDITIONAL in all four. The merge's strongest-restriction rule found no P0.

### Adjudication of the merged P1 set
- Confirmed by running the code: P1-01 (a sandbox copy of the repository), P1-02, P1-03 (rerun on folders with two controls), P1-04, P1-05 and P1-08 (edited copies of phase 005, judged against a control edit).
- Confirmed by a second, independent reader: P1-06, P1-07 and P1-09.
- Merged as duplicate: the `deepseek` and `luna` `--track` entries.
- Downgraded to P2: the `rg` preflight (needs a machine without ripgrep), criterion 7 (the push was operator-directed after the build), `/spec_kit:` (stale command name), the parent `swe-2-max` precondition (record), the phase 009 gate pointer (the prose records the deciding set correctly) and the phase 008 removal procedure (the recorded run met the branch-tip condition).
- Narrowed after the second pass: P1-05, because one rule checks presence for four doc types, and P1-08, because the post-edit scan flags the marker among its false hits.
- A copy outside the repository fails `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` after any content edit, because its generated metadata cannot be refreshed there. The P1-05 and P1-08 copies were therefore judged by the rules that differed from a harmless control edit, not by the RESULT line.

### Run integrity
- Both runners exited 0, with no retries, timeouts or salvage.
- One stall warning per lineage for `luna` and `pi-deepseek-1`. The `pi` process for `pi-deepseek-1` idled for about 20 minutes after its synthesis and then exited on its own.
- Containment: one advisory per wave, each on the other wave's `observability-events.jsonl` in the shared `review/` tree, preserved and not reverted. `luna` reported 11 newly dirty paths at 17:51 UTC, which were the cli-pi wave's lineage folders created beside it.
- Timestamps: `pi-deepseek-1` wrote five state records with timestamps up to 30 minutes after the run ended, and `luna` wrote one unparseable timestamp. The finding content is unaffected, but those record times are model-written and not trustworthy.
- The cli-pi wave ran under `review/wave2/` and its lineages were moved into `review/lineages/` before the merge. `review/wave2/` keeps that wave's orchestration log and summary.

### Workflow gaps found while running this review
- `step_emit_resource_map` in `deep-review-auto.yaml` runs the reducer against `review/deep-review-state.jsonl`, which a fan-out root does not have before closeout. The reducer exits with `ENOENT` and no root resource map is written. Proposed amendment: when `config.fanout` is present, skip the root reducer and point the report at the per-lineage resource maps, `lineages/deepseek/resource-map.md` and `lineages/luna/resource-map.md`. `step_convergence_report` works at the fan-out root: the gateway created the root ledger and recorded `synthesis_complete` at sequence 1.
- `fanout-run.cjs` takes one fan-out config per run, so adding lineages mid-run needs a second base directory under `review/` and a manual move before the merge.
- The fan-out runner's post-run metadata refresh (`fanout-run.cjs:3184`) regenerates the packet's `description.json` from `spec.md`. The synopsis extractor caps the description at 150 characters at a word boundary (`runtime/lib/description/packet-synopsis.ts:33`), so the title-derived description became the problem statement's first sentence cut off after "that". The conductor restored the file from `HEAD`. Proposed fix: end the cut at a sentence or clause boundary.

### Sources reviewed
- The parent `spec.md` and `goal.md`, nine phase folders, the core and add-on templates, the filled examples, the validation orchestrator and shell rules, the post-edit scan, `create.sh`, both guard scripts and their tests, the authoring card, the speckit command assets, the agent definitions, the feature catalog and playbook leaves, the benchmark reports, and the changelogs and version carriers.
