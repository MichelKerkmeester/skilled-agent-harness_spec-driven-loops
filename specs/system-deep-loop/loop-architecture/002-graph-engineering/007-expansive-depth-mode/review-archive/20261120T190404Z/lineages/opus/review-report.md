# Deep Review Report - opus lineage

Range `21c4b325b5a..de32abbb74d`, frontier nodes F-1-002 (frontier-admit engine), F-1-004 (/deep:review and /deep:research command surface) and F-1-006 (skill docs, playbooks, catalogs, agent mirrors), plus the depth-2 child F-2-007 admitted from F-1-002.

## 1. Executive Summary

- **Overall verdict: CONDITIONAL** (from `review-verdict.cjs` over this lineage's registry and state log)
- **hasAdvisories:** false (the verdict is CONDITIONAL; twelve P2 advisories are also open)
- **Active counts the verdict used:** P0 = 0, P1 = 2, P2 = 12; search debt 0; failed terminal gates none
- **Self-check outcomes:** the final Hunter/Skeptic/Referee pass re-read both active P1 findings and confirmed them at P1. No finding was downgraded or called a false positive, so no adjudication rows were appended at synthesis.
- **Stop:** `converged` (`composite_converged`) at the stop check after iteration 14. Before that, a `frontier_drained` candidate was blocked once by `graphlessFallbackGate` (see OPUS-REC-P2-002). Terminal gates evidence, scope and coverage all passed.
- **Review scope:** 14 iterations over 4 frontier nodes and all 4 canonical dimensions. Frontier outcome: F-1-002 and F-1-006 were answered. F-1-004 and F-2-007 were closed `exhausted` by stuck recovery (see OPUS-F004-P1-002).
- **Operator review focus:** Every iteration also covers three angles, read through the range diff (git diff 21c4b325b5a..de32abbb74d -- <file>). 1) Overengineering, per .skilled/repo-rules/prevent-overengineering.md: abstractions, options, flags, layers, fallbacks or files no current requirement earns, and duplicated logic or prose (one rule restated across YAML, presentation, review.md, references and playbooks); name what to delete or collapse. 2) Operator UX: flag ergonomics, error and warning text, setup prompts, dashboard and report clarity, and the cost of discovering how to use --extend, --depth-mode=expansive and the --frontier-max-depth/--frontier-max-nodes flags. 3) Cross-CLI runtime parity: the same behavior across the claude, opencode, codex, pi, devin, cursor, dsh and vibe executors and their agent and command mirrors (.claude .codex .pi .dsh .vibe against .skilled), plus Node and OS portability of the scripts (paths, shells, BSD vs GNU tools). Cite file:line for every finding.

## 2. Planning Trigger

`/speckit:plan` is required: two active P1 findings remain.

```json
{
  "title": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "OPUS-F002-P2-002", "severity": "P1", "file": ".skilled/commands/deep/assets/deep-review.yaml:815", "title": "No workflow step records a commit-range target's touched files, so documented relevance narrowing never engages"},
    {"id": "OPUS-F004-P1-002", "severity": "P1", "file": ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1389", "title": "Expansive stuck recovery counts only global finding novelty and exhausts nodes mid-coverage"},
    {"id": "OPUS-F002-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:248"},
    {"id": "OPUS-F002-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:620"},
    {"id": "OPUS-F002-P2-004", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:706"},
    {"id": "OPUS-F004-P2-001", "severity": "P2", "file": ".skilled/commands/deep/assets/deep-review-presentation.txt:83"},
    {"id": "OPUS-F004-P2-002", "severity": "P2", "file": ".skilled/commands/deep/assets/deep-review.yaml:599"},
    {"id": "OPUS-F004-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1505"},
    {"id": "OPUS-F004-P2-004", "severity": "P2", "file": ".skilled/commands/deep/review.md:100"},
    {"id": "OPUS-F006-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:30"},
    {"id": "OPUS-F006-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/live-expansive-review-two-node-frontier.md:49"},
    {"id": "OPUS-F007-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:592"},
    {"id": "OPUS-REC-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:227"},
    {"id": "OPUS-REC-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1581"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "severity": "P1", "findings": ["OPUS-F004-P1-002", "OPUS-REC-P2-001"], "goal": "Make expansive stuck accounting respect per-node dimension progress"},
    {"id": "WS-2", "severity": "P1", "findings": ["OPUS-F002-P2-002", "OPUS-F007-P2-001"], "goal": "Give commit-range targets a touched-file producer and accept open-ended ranges"},
    {"id": "WS-3", "severity": "P2", "findings": ["OPUS-F002-P2-003", "OPUS-F002-P2-004", "OPUS-F002-P2-001"], "goal": "Harden proposal admission: path-shaped scope, positive integer budget, Unicode-aware dedupe"},
    {"id": "WS-4", "severity": "P2", "findings": ["OPUS-F006-P2-001", "OPUS-F004-P2-001", "OPUS-F004-P2-003", "OPUS-F004-P2-004"], "goal": "State the node universe once and link to it; fix the nine stale copies"},
    {"id": "WS-5", "severity": "P2", "findings": ["OPUS-REC-P2-002"], "goal": "Align the ledger producer contract with the graphless fallback gate"},
    {"id": "WS-6", "severity": "P2", "findings": ["OPUS-F004-P2-002", "OPUS-F006-P2-002"], "goal": "Operator text: extension warning cause and the live playbook pause"}
  ],
  "specSeed": ["Expansive review: a node visit that covers a new dimension counts as progress for stuck accounting", "Commit-range review targets: scope discovery records git diff --name-only output in reviewScopeFiles"],
  "planSeed": ["Change loopCounters under depthMode expansive", "Add a commit-range branch to step_scope_discovery", "Harden checkProposal scope and budget", "Collapse universe prose to one owner"],
  "findingClasses": ["cross-consumer", "instance-only", "algorithm"],
  "affectedSurfacesSeed": [".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs", ".skilled/commands/deep/assets/deep-review.yaml", ".skilled/commands/deep/assets/deep-review-presentation.txt", ".skilled/commands/deep/review.md", ".skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl", ".skilled/skills/system-deep-loop/deep-review/references", ".skilled/skills/system-deep-loop/deep-review/feature-catalog", ".skilled/skills/system-deep-loop/deep-review/manual-testing-playbook"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Note for the merge: the reducer folds a refinement into the id it refines. `OPUS-F002-P2-002` is therefore P1 in the registry: iteration 7's `OPUS-F004-P1-001` folded into it. It keeps its original `frontier-admit.cjs` location and correctness tag, while the root cause it now records sits at `deep-review.yaml:815`. Likewise, `OPUS-F006-P2-001` carries iteration 9's nine-site consolidation and `OPUS-F004-P1-002` carries iteration 13's second occurrence.

| ID | Sev | Dimension | file:line | Finding | Fix | Class |
|---|---|---|---|---|---|---|
| OPUS-F002-P2-002 | P1 | traceability | `.skilled/commands/deep/assets/deep-review.yaml:815` | The catalog says commit-range relevance narrows to the touched files in `reviewScopeFiles`, but no step records them, so `scopeInsideTouchedFiles` admits every scope (`frontier-admit.cjs:618`). Raised at iteration 1 as P2, raised to P1 at iteration 7. | Add a commit-range rule to `step_scope_discovery` (`git diff --name-only base..tip -- <pathspec>`), or document the admit-all fallback. | cross-consumer |
| OPUS-F004-P1-002 | P1 | correctness | `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1389` | Stuck counts only global novelty, measured against the accumulated total and inclusive at 0.05. Under expansive depth, two clean or barely productive passes close the active node `exhausted` (`deep-review.yaml:1612`). Seen live twice: F-1-004 at 3 of 4 dimensions, F-2-007 at 1 of 4. | Under expansive depth, treat an iteration that covered a new node dimension as progress, or skip the node close while the node has uncovered dimensions. | cross-consumer |
| OPUS-F002-P2-001 | P2 | correctness | `frontier-admit.cjs:248` | ASCII-only `dedupeKey`: a non-Latin question is pruned as `dedupe`, and accented questions collide. | Use a Unicode letter class (`\p{L}\p{N}`). | instance-only |
| OPUS-F002-P2-003 | P2 | security | `frontier-admit.cjs:620` | Scope is only prefix-checked, so free text after an in-target path passes and is rendered into later FRONTIER blocks, outside the untrusted-content guard. | Require path-shaped scope entries (no whitespace) or mark the block as untrusted text. | cross-consumer |
| OPUS-F002-P2-004 | P2 | security | `frontier-admit.cjs:706` | A negative or fractional `budget` is admitted and stored, so every later child that names a positive budget is pruned. | Accept positive integers only. | instance-only |
| OPUS-F004-P2-001 | P2 | correctness | `deep-review-presentation.txt:83` | The presentation `:83` and `:444` still count the four canonical dimensions plus custom ones. | Fold into WS-4. | cross-consumer |
| OPUS-F004-P2-002 | P2 | correctness | `deep-review.yaml:599` | The extension warning names only `all_dimensions_clean`. A drained expansive frontier re-stops on `frontier_drained`. | Name both candidates. | instance-only |
| OPUS-F004-P2-003 | P2 | maintainability | `convergence.cjs:1505` | The comment says a node is never held open for a dimension the stop does not owe. That is false for a canonical subset, and excluded dimensions are dispatched per node. | Reword the comment and surface the rule in the flag docs. | instance-only |
| OPUS-F004-P2-004 | P2 | maintainability | `review.md:100` | The `--depth-mode` cell is 486 words, and the seed step is written out twice in the YAML. | Cut the cell to one sentence plus a link, and keep one seed step body. | algorithm |
| OPUS-F006-P2-001 | P2 | traceability | `expansive-depth-mode.md:30` | Nine live surfaces state the un-narrowed node universe, consolidated from three single-site findings. | Fix the listed sites, or state the rule once and link. | cross-consumer |
| OPUS-F006-P2-002 | P2 | correctness | `live-expansive-review-two-node-frontier.md:49` | The review and research live playbooks wait for a confirm-mode stop before seeding. The workflow has none. | Rewrite the step, or add a confirm gate before the seed. | cross-consumer |
| OPUS-F007-P2-001 | P2 | correctness | `frontier-admit.cjs:592` | Open-ended ranges (`main..`, `..HEAD`) read as paths, so a single run's seed is pruned entirely as `relevance`. | Accept a range operator with a ref on one side. | instance-only |
| OPUS-REC-P2-001 | P2 | traceability | `convergence.md:227` | The doc uses strict `<` and the code uses inclusive `<=`. The 0.05 boundary decided F-2-007's close. This predates the range. | Pick one rule. | instance-only |
| OPUS-REC-P2-002 | P2 | correctness | `convergence.cjs:1581` | The graphless fallback gate needs row-level `evidenceRefs` and `exact_grep`. The prompt-pack contract and example give neither, so the gate blocked this lineage's drained stop. This predates the range. | Align the contract with the gate. | cross-consumer |

## 4. Remediation Workstreams

1. **WS-1 (P1):** expansive stuck accounting: OPUS-F004-P1-002, with OPUS-REC-P2-001 settling the boundary.
2. **WS-2 (P1):** commit-range scope producer: OPUS-F002-P2-002, plus OPUS-F007-P2-001 for open-ended ranges.
3. **P2 advisories:** WS-3 admission hardening, WS-4 one owner for the node universe rule, WS-5 ledger contract alignment, WS-6 operator text.

## 5. Spec Seed

- Expansive review: an iteration that covers a node's next uncovered dimension is progress for `stuckCount`. Alternatively, stuck recovery does not exhaust a node that still has uncovered dimensions.
- Commit-range review targets: `step_scope_discovery` records the range's touched files in `reviewScopeFiles` before the seed.
- The node universe rule (four canonical dimensions less unconfigured traceability, plus custom ones) has exactly one prose owner.

## 6. Plan Seed

- T1: give `convergence.cjs loopCounters` a frontier-progress reset under `depthMode: expansive`, with a test using two clean dimension passes on one node.
- T2: add a commit-range branch to `deep-review.yaml step_scope_discovery`, with a test that admission prunes an out-of-range scope.
- T3: in `frontier-admit.cjs`, add a path-shaped scope check, a positive integer budget and a Unicode dedupe key, with tests.
- T4: fix the nine stale universe statements and make the `review.md:100` cell one sentence plus a link.
- T5: align the ledger rows in the prompt pack and state-format example with `reviewFallbackCoveredBugClasses`.

## 7. Traceability Status

**Core protocols**
- `spec_code`: partial at iteration 7 (F-1-004), pass at iteration 8 (F-1-002). REQ-002, 008, 011, 013, 014 (as amended by decision-record Q011) and 019 match the code. The commit-range relevance input has no producer.
- `checklist_evidence`: pass at iterations 7 and 8. The sampled T036/T037 done claims and the loop-protocol admission paragraph are backed by code lines.

**Overlay protocols**
- `agent_cross_runtime`: pass (iteration 3). New agent sentences appear once in `.claude`, `.codex`, `.pi`, `.dsh` and `.vibe`.
- `feature_catalog_code`: pass for frontier-admit-script (iteration 3); partial for expansive-depth-mode (iteration 9).
- `playbook_capability`: partial (iteration 6). The live frontier scenarios rely on a pause the workflow does not have.
- `skill_agent`: pass (iteration 9).
- AC_COVERAGE: exempt (files target, not a spec-folder target).

resource-map.md not present in the spec folder; coverage gate skipped. This lineage emitted its own `resource-map.md` from its deltas.

## 8. Deferred Items

- The review YAML never runs `frontier-admit.cjs graph` (only research does), so review frontier nodes are not projected into the coverage graph as QUESTION/CLAIM nodes. Not investigated further; check whether this is intended.
- `applyBandBudget` falls back to a cap of 10 (`frontier-admit.cjs:94,346`), the research default, where the review default is 7. No caller reaches it today.
- Seven new playbooks depend on `jq`. That matches an existing convention, and no prerequisite line is stated.
- Observed at closeout, not raised as an iteration finding because synthesis had already started: `synthesis-closeout.cjs` recorded `deep_review.synthesis_incomplete` (warning) with `structured_state_findings_partially_reflected_in_registry`. It counted 17 identifiable findings in the state records against 14 in the registry. The 3 extra are refinement rows (`OPUS-F004-P1-001`, `OPUS-F006-P2-003`, `OPUS-REC-P1-003`). Each carries its own id plus `refines`, as the prompt pack's delta contract describes. The reducer folds each one into the finding it refines, but the closeout counts it as a separate finding (`synthesis-closeout.cjs:346-378`), so a run that uses `refines` as documented closes as `synthesis_incomplete`. The fix candidate: make the closeout fold `refines` the way the reducer does. No finding is missing from the registry (`missingStructuredFindingCount` 0).

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0. No Council artifacts.
- Frontier: F-1-002 answered (4/4 dimensions); F-1-006 answered (4/4); F-1-004 exhausted at iteration 10, reason `stuck` (3 of 4 dimensions reviewed as a node; its maintainability surface was reviewed under iteration 10's operator-focus angle); F-2-007 (depth 2, child of F-1-002) exhausted at iteration 13, reason `stuck` (1 of 4).
- Remaining frontier: none open.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback` on every iteration. Semantic search was unavailable.
- `candidateCoverage` covered classes include `input_validation`, `boundary_condition`, `prompt_injection`, `contract_drift`, `state_transition`, `spec_code_alignment` and `duplication`, plus the answered frontier nodes.
- `searchDebt`: empty at stop. hasSearchDebt: false.
- Cited fallback rows: iterations 1-13 put evidence only inside `searchActions`, and the gate ignores those rows (OPUS-REC-P2-002). Iteration 14 recorded row-level cited rows for `state_transition` and `contract_drift`, which cleared the gate.

## 10. Audit Appendix

**Convergence summary.** Ratios: 1.0, 0.5, 0.2, 0.286, 0, 0.125, 0.25, 0, 0.036, then 10 to 14 as recorded in the state log. STUCK_RECOVERY fired before iterations 10 and 13. BLOCKED (graphlessFallbackGate) fired before iteration 14. STOP `composite_converged` came after iteration 14.

**Coverage summary.** Run-level dimension coverage is 4/4. Core protocols were both recorded.

**Ruled-out claims.**
- Cross-lineage node id collision: the merge qualifies ids with the lineage label (`fanout-merge.cjs:761`).
- Band roll-up.
- Prototype pollution through proposal JSON.
- Shell injection through fan-out focus, target or config, which are passed by file.
- Shell injection through `--extend`, which is digit-validated.
- Agent permission widening.
- Destructive playbook commands.
- GNU-only playbook flags.
- Twin-playbook duplication.
- REQ-014 code defect, ruled out because the code follows Q011.

**Process deviations recorded by this lineage.**
- `reviewScopeFiles` was rewritten after the `run_initialized` record hashed the config. It now holds the 232 files `git diff --name-only` lists for the range and pathspec, which is what scope discovery should have produced. No script re-verifies the hashed digest.
- `deep_review.graph_convergence_evaluated` rows were not appended. The stop decision came from `convergence.cjs --stop-decision` before every iteration, and synthesis does not read those rows.
- At iteration 10 the node F-1-004 was marked active before the stop decision. The reducer therefore credited iteration 10's maintainability pass to it as well. Activation waited for a CONTINUE decision from then on.
- `step_generate_context` in `phase_save` was skipped: the dispatch forbids `generate-context.js`.
- `step_stage_artifact_dir` was skipped, as the YAML specifies for a fan-out lineage.

**Sources reviewed (by node).**
- F-1-002: `frontier-admit.cjs`, both frontier-admit test suites.
- F-1-004: `review.md`, `research.md`, `deep-review.yaml`, `deep-research.yaml`, `deep-review-presentation.txt`.
- F-1-006: agents and the five mirrors, deep-review references, feature catalogs, 37 added playbooks, changelog v1.13.0.0.
- Context: `convergence.cjs`, `reduce-state.cjs`, `fanout-run.cjs`, `fanout-merge.cjs`, `terminal-gates.cjs`.

**Cross-reference appendix.**
- Core Protocols: spec_code (partial, then pass), checklist_evidence (pass).
- Overlay Protocols: agent_cross_runtime (pass), feature_catalog_code (pass and partial), playbook_capability (partial), skill_agent (pass).
