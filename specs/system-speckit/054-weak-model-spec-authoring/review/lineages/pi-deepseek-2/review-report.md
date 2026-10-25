# Deep Review Report - 054-weak-model-spec-authoring (fan-out lineage pi-deepseek-2)

## 1. Executive Summary

**Verdict: CONDITIONAL**

- `hasAdvisories`: true (18 active P2 findings accompany the P1 set)
- Active findings: **P0 0 · P1 6 · P2 18** (24 total)
- Review scope: `specs/system-speckit/054-weak-model-spec-authoring`, a phase parent with nine Level 3 children, its goal binding, its evidence artefacts and the `.skilled` surfaces the packet changed (four core templates plus one addon, the versioned placeholder gate in both implementations, the two new guard scripts, the authoring card and its registry entries, the playbook, catalog and README, and the phase 009 benchmark evidence)
- Iterations: 10 of 10 under `stopPolicy: max-iterations`; dimensions covered correctness, security, traceability and maintainability; convergence score 0.9583 is telemetry only for this lineage
- Reviewed with: `cli-pi deepseek-v4.1-flash-1017`, detached fan-out lineage `pi-deepseek-2`, session `fanout-pi-deepseek-2-1792950661620-vss1cp`

The packet's central claim survives the sweep. The versioned placeholder gate implements its four contract cells and pins them with a test that drives both implementations; every core template section carries a fill instruction with a good and a weak example; the example drift guard really detects a removed anchor; the playbook has eight scenarios with eight run transcripts; and the deciding benchmark set reproduces arithmetically, used one frozen brief on both sides, and measured a tree whose template and runtime surface is identical to the one the packet closed on.

What does not survive is the packet's own remediation discipline. Six P1 findings, and five of them share one shape: a defect the packet recorded was repaired at the site where it was observed and not where it lives. The census recorded an obsolete `/spec_kit:` command prefix in three files and no ledger row ever owned it; the phase 003 decision left the post-edit scanner blind to the new token form and no later phase fixed it; the label fix for `## L3+:` reached `tasks.md` and not `plan.md`; the phase 003 follow-up named `assets/template-mapping.md` and phase 007's acceptance rows covered only the README. The sixth is the mirror image: the same post-edit scanner now blocks a strict-validated packet 55 times, so the authoring guard is wrong in both directions at once.

The benchmark is sound but its evidence is awkwardly presented: the deciding data has no acceptance row, two run-set files are named `baseline.json` while holding treatment runs, and the report's subject line still names the executor the operator removed.

## 2. Planning Trigger

`/speckit:plan` **is required**. The verdict is CONDITIONAL: no P0 blocks a release decision, but six P1 findings cross three shipped surfaces (the post-edit hook, the guard scripts, the authoring references) and one of them is a repair the packet promised and did not make.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 6,
    "P2": 18,
    "ids": [
      "R1-P1-001", "R1-P1-002", "R4-P1-001", "R4-P1-002", "R5-P1-001", "R7-P1-001",
      "R1-P2-001", "R1-P2-002", "R1-P2-003", "R2-P2-001", "R2-P2-002", "R3-P2-001",
      "R3-P2-002", "R4-P2-001", "R5-P2-001", "R5-P2-002", "R6-P2-001", "R6-P2-002",
      "R7-P2-001", "R7-P2-002", "R8-P2-001", "R8-P2-002", "R9-P2-001", "R10-P2-001"
    ]
  },
  "remediationWorkstreams": [
    {
      "id": "W1",
      "name": "Make the authoring-time guard see what the templates emit",
      "findings": ["R4-P1-001", "R4-P1-002", "R4-P2-001"],
      "surface": ".skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh",
      "blocking": true
    },
    {
      "id": "W2",
      "name": "Close the repairs the census and the phase follow-ups recorded but never owned",
      "findings": ["R1-P1-001", "R7-P1-001", "R7-P2-001"],
      "surface": "templates/packet-types, references/workflows, assets/template-mapping.md",
      "blocking": true
    },
    {
      "id": "W3",
      "name": "Make the guards fail closed and assert positively",
      "findings": ["R5-P1-001", "R5-P2-001", "R5-P2-002"],
      "surface": "runtime/cli/spec/check-example-drift.sh, check-card-sync.sh",
      "blocking": true
    },
    {
      "id": "W4",
      "name": "Reconcile the packet's claims with what the phases did",
      "findings": ["R1-P1-002", "R6-P2-001", "R6-P2-002", "R2-P2-002", "R10-P2-001"],
      "surface": "parent spec.md and goal.md, phase 006 and 010 summaries, benchmark report",
      "blocking": false
    },
    {
      "id": "W5",
      "name": "Make the benchmark evidence self-describing",
      "findings": ["R2-P2-001", "R8-P2-001", "R8-P2-002", "R7-P2-002"],
      "surface": "009 acceptance rows and scratch/amend3 evidence files, feature catalog",
      "blocking": false
    },
    {
      "id": "W6",
      "name": "Finish the parity and label work across sibling templates",
      "findings": ["R3-P2-001", "R3-P2-002", "R9-P2-001", "R1-P2-001", "R1-P2-002", "R1-P2-003"],
      "surface": "orchestrator versus shell rule, plan.md.tmpl, graph-metadata.json",
      "blocking": false
    }
  ],
  "specSeed": [
    "Phase 010: make the post-edit placeholder scan detect [YOUR_VALUE_HERE: ...] and stop flagging bracketed shell variables, regex classes and uppercase labels.",
    "Phase 011: construct the ledger rows the phase 001 census left in prose (NEW-12, NEW-13, NEW-14, L-C-019, L-C-021) and repair the four locators, including the phase-parent template and the packet's own spec.md.",
    "Phase 012: rewrite assets/template-mapping.md to the v2.3 token form and to the optional decision-record contract.",
    "Phase 013: add rg preflight or drop rg from both guard scripts; make card-sync assert the checklist pointer positively."
  ],
  "planSeed": [
    "Reproduce the probe: run spec/check-placeholders.sh on a phase folder and confirm it exits 1 on [SPEC_FOLDER] and 0 on a template token line.",
    "Write the failing-first test for each workstream before the fix, in the same shape the packet used for the placeholder gate.",
    "Re-run the eight playbook scenarios after W1 and W3, and record the results in a new report folder rather than editing the closed one.",
    "Refresh parent and phase continuity blocks in the same pass that closes the remediation packet."
  ],
  "findingClasses": [
    "unowned-repair",
    "guard-false-negative",
    "guard-false-positive",
    "guard-fail-open",
    "parity-drift",
    "overstated-claim",
    "stale-guidance",
    "evidence-provenance"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh",
    ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts",
    ".skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh",
    ".skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl",
    ".skilled/skills/system-spec-kit/templates/core/plan.md.tmpl",
    ".skilled/skills/system-spec-kit/assets/template-mapping.md",
    ".skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md",
    "specs/system-speckit/054-weak-model-spec-authoring/spec.md",
    "specs/system-speckit/054-weak-model-spec-authoring/graph-metadata.json"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Full evidence, counterevidence, alternative explanation and downgrade trigger for every P0/P1 are recorded in the iteration file that raised it.

| ID | Sev | Dimension | Title | File:line | Disposition |
|----|-----|-----------|-------|-----------|-------------|
| R1-P1-001 | P1 | traceability | Obsolete `/spec_kit:` prefix survives in the phase-parent template and five reference docs; no ledger row owned it | `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:108` | active |
| R1-P1-002 | P1 | traceability | Parent launch precondition names `swe-2-max` as the benchmark subject, contradicting its own Out of Scope and D8 | `specs/.../spec.md:117` | active |
| R4-P1-001 | P1 | security | The post-edit scan cannot see the colon token form the v2.3 templates emit | `.skilled/.../runtime/cli/spec/check-placeholders.sh:99` | active |
| R4-P1-002 | P1 | security | The same scan exits 1 on 55 legitimate bracketed matches in this strict-passing packet | `.skilled/.../runtime/cli/spec/check-placeholders.sh:149` | active |
| R5-P1-001 | P1 | correctness | Both guards depend on `rg` with no preflight; the drift guard prints `EXAMPLE_DRIFT_OK` on a drifted tree without it | `.skilled/.../runtime/cli/spec/check-example-drift.sh:31` | active |
| R7-P1-001 | P1 | maintainability | `template-mapping.md` still teaches `[PLACEHOLDER]`, which no validator detects | `.skilled/.../assets/template-mapping.md:233` | active |
| R1-P2-001 | P2 | maintainability | `graph-metadata.json` reads `in_progress` and points at phase 004 while the parent reads Complete | `specs/.../graph-metadata.json:47` | active |
| R1-P2-002 | P2 | traceability | Parent `Branch` reads `main` while the work ran on the worktree branch | `specs/.../spec.md:52` | active |
| R1-P2-003 | P2 | traceability | Two parent pointers dangle: `../spec.md` and the phase 003 decision record | `specs/.../spec.md:53` | active |
| R2-P2-001 | P2 | traceability | Phase 009 acceptance rows carry the benchmark on the superseded first set | `specs/.../009.../acceptance-criteria.md:55` | active |
| R2-P2-002 | P2 | maintainability | Benchmark report subject line still names `swe-2-max` | `.skilled/.../2026-10-25--model-eval--authoring-baseline/README.md:3` | active |
| R3-P2-001 | P2 | correctness | Marker sets diverge: the orchestrator flags `<YOUR_VALUE_HERE:`, the mirror never sees it | `.skilled/.../lib/validation/orchestrator.ts:665` | active |
| R3-P2-002 | P2 | correctness | Fence detection differs across the two implementations and within one file | `.skilled/.../lib/validation/orchestrator.ts:729` | active |
| R4-P2-001 | P2 | security | The code-block exclusion skips only fence delimiter lines | `.skilled/.../runtime/cli/spec/check-placeholders.sh:137` | active |
| R5-P2-001 | P2 | correctness | Card sync checks its fourth surface only negatively | `.skilled/.../runtime/cli/spec/check-card-sync.sh:113` | active |
| R5-P2-002 | P2 | maintainability | The drift guard has no coverage floor; an empty level directory fails misleadingly | `.skilled/.../runtime/cli/spec/check-example-drift.sh:18` | active |
| R6-P2-001 | P2 | traceability | Phase 006 summary attributes the card to four agents; three carry neither card nor example | `specs/.../006.../implementation-summary.md:68` | active |
| R6-P2-002 | P2 | traceability | The plan asset describes authoring and names one of the three required surfaces | `.skilled/.../commands/speckit/assets/speckit-plan.yaml:313` | active |
| R7-P2-001 | P2 | maintainability | `template-mapping.md` states `decision-record.md` is required; the contract makes it optional | `.skilled/.../assets/template-mapping.md:283` | active |
| R7-P2-002 | P2 | maintainability | The two new catalog sections carry no verification marker | `.skilled/.../feature-catalog/feature-catalog.md:218` | active |
| R8-P2-001 | P2 | correctness | Two run-set files are named `baseline.json` while neither holds a baseline | `specs/.../scratch/amend3/fresh2/baseline.json:1` | active |
| R8-P2-002 | P2 | correctness | The deciding `delta.json` carries arithmetic with no experiment identity | `specs/.../scratch/amend3/fresh2/delta.json:1` | active |
| R9-P2-001 | P2 | maintainability | The `L3+` clarifier reaches six `tasks.md` sections and none of the three `plan.md` sections | `.skilled/.../templates/core/plan.md.tmpl:330` | active |
| R10-P2-001 | P2 | traceability | Continuity frontmatter was never refreshed for seven closed phase documents | `specs/.../001.../acceptance-criteria.md:22` | active |

### The six P1 findings in detail

**R1-P1-001 — unowned repair.** `phase-parent.spec.md.tmpl:108` still reads `/spec_kit:resume`, a namespace that does not exist (`.skilled/commands/speckit/resume.md` exists; `.skilled/commands/spec_kit` does not). The phase 001 census recorded this and two sibling locators as `NEW-12/13/14`, each with "Not added because the exact locator and evidence row must be constructed by the owner phase"; `ledger.jsonl` has 72 rows and none of them names the file. `auto-mode-contract.md:191`, `nested-changelog.md:30` and the packet's own `spec.md:143` still carry the prefix. Impact: the template that generates phase-parent packets teaches a command a weak model cannot run.

**R1-P1-002 — contradicting scope.** `spec.md:117` ends with "The benchmark subject is cli-devin `swe-2-max`", while `spec.md:92` puts any subject other than `deepseek-v4-1-flash-1017-max` out of scope, `spec.md:165` records the supersession, and `goal.md:54` (D8) freezes the DeepSeek subject. Impact: an operator reading only the launch preconditions measures the wrong executor.

**R4-P1-001 — guard blind to the emitted token.** `PLACEHOLDER_BODY="[A-Za-z0-9 /,._<>+%'-]"` has no colon, so `\[[A-Z]BODY+\]` cannot match `[YOUR_VALUE_HERE: ...]`, the spelling every core template now emits. Probed: the template line returns `SCANNER_BLIND` against the scanner's class and `RULE_MATCHES` against the canonical pattern. Phase 003 recorded it as OP-2 and deferred; no phase took it. Impact: the only in-loop authoring guard is silent for exactly the case the packet created.

**R4-P1-002 — guard loud on legitimate content.** The same scan exits 1 with 55 matches on this packet, which recursive strict validation passes: `[SPEC_FOLDER]` inside a documented command (`006.../tasks.md:79`), `[A-Za-z]` as a regex fragment (`005.../tasks.md:77`), `[CONTRACT DRIFT]` as a label. A single phase folder trips it. Impact: every edit to a phase document blocks on content the validator accepts.

**R5-P1-001 — guard fails open.** Both guards report through `rg` pipelines with no `command -v rg` preflight, and no `package.json` declares ripgrep. With `node` on `PATH` and `rg` absent, the mutated copy that fails with `FAIL ... missing_anchor metadata` prints `EXAMPLE_DRIFT_OK`. Three criteria in this packet read that string.

**R7-P1-001 — stale marker guidance.** `assets/template-mapping.md:233,281,344` teach `[PLACEHOLDER]` as the marker to replace. No validator flags it, so a packet that follows this asset ships unfilled content that validates clean. Phase 003's OP-4 named this file; phase 007's AC-005 asserted only `README.md`.

## 4. Remediation Workstreams

**P0 — none.**

**P1, ordered by blast radius.**

1. **W1 · authoring-time guard (`check-placeholders.sh`)** — decide the guard's contract first: it should detect the v2.3 token and should not fire on documented shell variables, regex classes or uppercase labels. One change makes W1's three findings go away: a token-aware pattern, an exclusion set for `[A-Z_]+` and `[A-Za-z-]`, and fence state tracked with an `in_code` flag. Then re-run the eight playbook scenarios that touch the hook.
2. **W2 · recorded-but-unowned repairs (template prefix, `template-mapping.md`)** — construct the ledger rows the census left in prose, apply the four exact-text replacements, and rewrite the three `[PLACEHOLDER]` lines. Regenerate or hand-fix `spec.md:143`, which inherited the defect.
3. **W3 · guard fail-closed (`rg` preflight, positive card check)** — add `command -v rg || { echo ...; exit 2; }` to both scripts, or replace `rg` with `grep`. Add a positive assertion that the checklist names the card and one filled example.
4. **W4 · claim reconciliation (parent spec, phase summaries, report subject)** — correct `spec.md:117` to the DeepSeek subject, split phase 006's four-agent row, add the card to `speckit-plan.yaml`, and refresh continuity blocks for the parent and the seven closed phase documents.

**P2 advisories, separated.** Parity and label work (R3-P2-001, R3-P2-002, R9-P2-001) can be one pass over `orchestrator.ts` and `plan.md.tmpl`. Evidence self-description (R2-P2-001, R8-P2-001, R8-P2-002, R7-P2-002) needs no code change: rename two run-set files, add identity fields to `delta.json`, re-anchor three acceptance rows, and add a verification marker to the two catalog sections. Metadata drift (R1-P2-001, R1-P2-002, R1-P2-003) is four edits in `spec.md` and `graph-metadata.json`.

## 5. Spec Seed

- A follow-on phase must own "guards see what the templates emit" as one contract, not three separate repairs: the validator, the sourced rule and the hook scan have drifted apart twice in this packet (R3-P2-001, R3-P2-002, R4-P1-001).
- The census-to-ledger handoff needs a rule: a defect recorded in a goal log without a ledger row does not have an owner. Two P1 findings in this review are that gap (R1-P1-001, R7-P1-001).
- Authoring references are part of the authoring surface. `assets/template-mapping.md` teaches a marker the validator ignores, and no acceptance row covered it.
- A follow-up note should name the file it owes, not the phase that owes it, or the phase's acceptance rows will silently exclude it (R7-P1-001).
- Benchmark evidence should be self-describing at the file level, so a reviewer can recompute a deciding delta without knowing the directory layout (R8-P2-001, R8-P2-002).

## 6. Plan Seed

1. Reproduce both guard defects with the two probes recorded in iterations 4 and 5 before changing anything.
2. Fix `spec/check-placeholders.sh`; add a test that asserts one token line matches and one `[SPEC_FOLDER]` line does not.
3. Construct and apply the six census rows; add a guard that fails when `rg 'spec_kit:'` finds anything under `templates/` and `references/`.
4. Rewrite `assets/template-mapping.md`; add it to an acceptance row explicitly.
5. Add the `rg` preflight to both guards; run both with `rg` removed from `PATH` to prove the failure is loud.
6. Correct `spec.md:117`, split the phase 006 row, add the card pointer to `speckit-plan.yaml`.
7. Refresh continuity for the parent and the seven stale phase documents; re-check `completion_pct` consumers.
8. Re-run the eight playbook scenarios and record a new report folder; do not edit the closed one.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Every parent claim about the shipped surface was checked against the file it names: gate contract cells (iteration 3), both guards (iteration 5), command and agent alignment (iteration 6), playbook and catalog (iteration 7), template contract (iteration 9) |
| `checklist_evidence` | pass | Seven parent criteria and fifteen phase 009 rows audited against their artefacts; census parity re-derived from `b-final.tsv` (4688 rows, 192 FAIL, 4496 PASS, cuts byte-identical), C6 re-derived from `results.csv` (8 rows, all PASS), C5 arithmetic re-derived |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | partial | The `spec-doc` route in `markdown.md:208` is correct; the plan asset names one of the three required surfaces (R6-P2-002) |
| `agent_cross_runtime` | pass | `.skilled`, `.claude` and `.opencode` copies of `markdown.md` differ only in frontmatter and the canonical path line; Hermes mirrors are generated |
| `feature_catalog_code` | partial | All catalog links resolve and the two new entries exist; neither carries a verification marker (R7-P2-002) |
| `playbook_capability` | pass | Eight scenarios indexed with file and catalog links; eight transcripts with command, stderr and check files; eight PASS rows |

**`AC_COVERAGE`**: exempt. The target's `implementation-summary.md` is present but this review did not run the validation rule; the advisory signal is not asserted here.

## 8. Deferred Items

- **Re-running the benchmark** under a fixed template: out of scope for a read-only review, and the packet's own history shows a rerun costs a full cycle of three dispatches.
- **Re-running `validate.sh --recursive`**: the lineage may not write outside its artifact directory, and the packet's own criterion already records `RESULT: PASSED`; the claim was checked against recorded evidence instead (iteration 2).
- **The post-edit scanner's two remaining recorded defects** beyond the token blindness: the colon-less bracket class is finding R4-P1-002; the `[NEEDS CLARIFICATION]`-without-colon gap is latent and unrecorded in this report because no live occurrence exists.
- **Era report and `upgrade-level.sh`**: phase 003's OP-1 and OP-3 are outside this packet's scope decisions and were not reviewed.
- **Deprecated `memory/` handling**: not reviewed; no packet document writes there.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Review directions swept, in order: parent self-consistency, criterion-to-evidence traceability, gate contract and parity, hook trust boundary, guard sensitivity, command/agent alignment, documentation and playbook evidence, benchmark methodology, template contract, residuals.
- Saturating directions: the "does criterion X have evidence" direction saturated by iteration 8; every remaining claim of that shape was already resolved.
- Remaining frontier, not swept: `upgrade-level.sh` token copy (out of scope), the era report script (out of scope), `templates/examples/level-3+` prose quality beyond anchors, and the `.hermes` generated mirrors beyond their regeneration claim.
- Breadth note: this map records coverage only and does not alter the verdict, the registry or the adversarial self-check.

## Search Ledger

| Class | Covered | Ruled out | Deferred |
|-------|---------|-----------|----------|
| contradiction | yes | — | — |
| unowned-repair | yes | — | — |
| dangling-reference | yes | — | — |
| stale-metadata | yes | — | — |
| contract-violation | yes | gate contract cells | — |
| implementation-divergence | yes | status classifier | — |
| test-gap | yes | four-cell parity test | — |
| false-negative / false-positive | yes | — | — |
| injection / path-traversal / verdict-steering | — | all three | — |
| fail-open | yes | vacuous empty-tree pass | — |
| arithmetic-mismatch | — | census counts, benchmark means | — |
| brief-drift / tree-mismatch | — | both | — |
| missing-evidence | — | playbook transcripts, index coverage | — |
| comment-hygiene | — | added code clean | — |
| label-inconsistency | yes | — | — |

`hasSearchDebt`: false. Every class the target's surfaces admit was either covered or ruled out with a cited artifact; the four deferred classes belong to surfaces outside the packet's scope decisions.

## 10. Audit Appendix

**Convergence summary.** 10 iterations, `maxIterations` reached, `stopReason: maxIterationsReached`. Convergence score 0.9583 by iteration 10 is telemetry: the run was configured to exhaust its ceiling rather than stop early, and the last three iterations deliberately broadened the angle instead of re-walking a saturated one. Finding discovery per iteration: 5, 2, 2, 3, 3, 2, 3, 2, 1, 1 — a falling curve consistent with real saturation by iteration 9.

**Coverage summary.** All four mandated dimensions appear in at least one iteration record (correctness in 1, 3, 5, 8; security in 4 and 10; traceability in 2, 6 and 10; maintainability in 7 and 9). Every overlay protocol reached a status: two pass, two partial.

**Ruled-out claims, with the reason each was rejected.**

- The census parity claim (192 FAIL / 4496 PASS over 4688 folders) reproduces exactly from `b-final.tsv`, and the before/after cut columns are byte-identical — not a defect, despite the shard history the goal log discloses.
- The report's FAIL sentences in section 1 and its aggregate table are correctly scoped to the historical first set by adjacent labels — not a verdict contradiction.
- The `Waived`/`Superseded` ADR clause is vacuous for this packet; no row is waived and `decision-record.md` is optional per `folder-structure.md:140`.
- An empty example tree does not pass the drift guard silently; it fails, albeit with a misleading message.
- The `markdown` agent's three runtime copies contain no semantic drift.
- No `checklist.md` (retired template) survives in commands or agents; every earlier grep hit was a different file whose name ends in `checklist.md`.
- The gate's status classifier agrees between the orchestrator and the shell rule on normalization and row selection.
- Shell injection and path traversal are both absent from the hook-to-scanner path.

**Sources reviewed.** 42 distinct files across the packet and the `.skilled` surface it changed, listed per iteration in `iterations/iteration-001.md`..`iteration-010.md`. Every finding carries a `path:line` citation resolvable in this worktree.

**Adversarial self-check (P0/P1 replay).** For each of the six P1 findings the hunter step re-read the cited line before recording, the skeptic step asked whether the impact is real given the packet's declared scope, and the referee confirmed severity. Two downgrades were taken in the field: the `decision-record.md` contradiction and the template-label inconsistency were held at P2 on the ground that neither changes a shipped verdict, and the mid-review re-read of `check-placeholder.sh`'s fence handling moved a candidate P1 to P2 once the defect class was shown to be already recorded in ADR-003. No P0 was ever raised, so no P0 replay was required.

**Comment hygiene.** The code this packet added carries no spec path, packet number, task id or acceptance id in any comment; the additions state the durable reason instead.

**Lineage.** Session `fanout-pi-deepseek-2-1792950661620-vss1cp`, generation 1, `lineageMode: new`, artifact directory `specs/system-speckit/054-weak-model-spec-authoring/review/wave2/lineages/pi-deepseek-2`. All state was recorded through the append gateway; the state log is the gateway's projection of the ledger.

Review verdict: CONDITIONAL
