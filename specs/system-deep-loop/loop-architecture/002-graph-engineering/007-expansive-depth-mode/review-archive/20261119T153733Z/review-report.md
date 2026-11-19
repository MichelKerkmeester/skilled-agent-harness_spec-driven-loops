# Deep Review Report: expansive-depth program (21c4b325b5a..1d2b49e4306)

## 1. Executive Summary

- **Verdict: FAIL.** There is no P0. The FAIL comes from the terminal coverage gate: `terminal-gates.cjs` records `coverage` as failed with reasonCode `traceability-incomplete`, because the two core traceability protocols (`spec_code`, `checklist_evidence`) closed as `partial`. They stayed partial because of the open findings, not for lack of passes. `review-verdict.cjs` printed `verdict: FAIL, failed_required_gate_ids: ["coverage"]`.
- **hasAdvisories:** false (the verdict is not PASS).
- **Active counts the verdict used:** P0 0, P1 2, P2 14, search debt 2.
- **Self-check outcomes:** the adversarial self-check re-read both P1s and confirmed each at P1, with no downgrade and no false positive.
  - R1-P1-001 was reproduced directly: `scopeInsideReviewTarget` returns false for the prose-wrapped target `commit range 21c4b325b5a..1d2b49e4306 (x)` and true for the bare range.
  - R2-P1-001 was confirmed by reading `deep-research.yaml:1653`: leaf-derived focus text is interpolated inside a double-quoted shell argument.
  - No adjudication rows were appended, because the Referee changed nothing.
- **Scope:**
  - 278 paths in total: 51 changed code and config files, 54 tests, 125 docs (playbooks, feature catalogs, references, changelogs), plus the packet's canonical docs and each child phase's `spec.md`, `tasks.md` and `implementation-summary.md`.
  - The roughly 1,700 generated run artifacts under the packet's `research/`, `research_archive/` and `scratch/` trees were excluded as loop output.
- **Run shape:**
  - 10 iterations, stop reason `maxIterationsReached`, native executor (`deep-review` agent, opus, effort medium).
  - Dimensions: correctness ×3 (1, 7, 9), security (2), traceability ×2 (3, 10), maintainability (4), overengineering ×2 (5, 8), sk-code-alignment (6).
- **Operator review focus:** Target is commit range 21c4b325b5a..1d2b49e4306 (the expansive-depth program, phases 001-014). Code and runtime files first, docs second. When the dimension is overengineering, apply the Review Charter rubric in the strategy: abstractions, options, layers, files or fallbacks no current requirement earns, per .skilled/repo-rules/prevent-overengineering.md and the CLAUDE.md section 3 restraint signals; name what to delete or collapse. When the dimension is sk-code-alignment, apply the Charter rubric: the sk-code review floor, the JS/CJS/TS/test surface rules, quality tiers, test-what-changed, and comment hygiene (no spec paths, phase numbers or REQ/ADR/finding ids in code comments). Only cite files listed in Review Scope Files.

**Fix first: R2-P1-001.** It is a command-injection path. Text a leaf writes, and that reviewed content can steer, reaches a shell. R1-P1-001 comes next: it silently turns an expansive commit-range review into a default one.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL and it carries two active P1 findings.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:494", "findingClass": "cross-consumer"},
    {"id": "R2-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/commands/deep/assets/deep-research.yaml:1653", "findingClass": "cross-consumer"},
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1983", "findingClass": "algorithmic"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:520", "findingClass": "instance-only"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/spec.md:162", "findingClass": "doc_state_drift"},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/tasks.md:177", "findingClass": "checklist_evidence_drift"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/commands/deep/assets/deep-review.yaml:343", "findingClass": "duplicated_workflow_text_drift"},
    {"id": "R4-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/commands/deep/assets/deep-review.yaml:944", "findingClass": "logic_in_workflow_text_duplication"},
    {"id": "R4-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/commands/deep/review.md:3", "findingClass": "doc_surface_drift"},
    {"id": "R5-P2-001", "severity": "P2", "dimension": "overengineering", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:558", "findingClass": "option-without-consumer"},
    {"id": "R5-P2-002", "severity": "P2", "dimension": "overengineering", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:720", "findingClass": "duplicate-derivation-path"},
    {"id": "R6-P2-001", "severity": "P2", "dimension": "sk-code-alignment", "file": ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:258", "findingClass": "silent-failure"},
    {"id": "R8-P2-001", "severity": "P2", "dimension": "overengineering", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:293", "findingClass": "dead-config-option"},
    {"id": "R8-P2-002", "severity": "P2", "dimension": "overengineering", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:759", "findingClass": "vestigial-option"},
    {"id": "R8-P2-003", "severity": "P2", "dimension": "overengineering", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1000", "findingClass": "consumerless-layer"},
    {"id": "R8-P2-004", "severity": "P2", "dimension": "overengineering", "file": ".skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:490", "findingClass": "duplicated-logic"}
  ],
  "remediationWorkstreams": ["WS1 frontier input safety and relevance (R2-P1-001, R1-P1-001, R2-P2-001)", "WS2 expansive budget and seed path (R1-P2-001, R5-P2-002, R4-P2-001, R4-P2-002)", "WS3 delete unearned options and layers (R5-P2-001, R8-P2-001, R8-P2-002, R8-P2-003, R8-P2-004, R6-P2-001)", "WS4 packet and doc truth (R3-P2-001, R3-P2-002, R4-P2-003)"],
  "specSeed": ["Remediation packet as a child of 007-expansive-depth-mode covering WS1-WS4"],
  "planSeed": ["Quote-safe frontier block invocation in deep-research.yaml", "Commit-range detection that tolerates surrounding prose", "Collapse the duplicate seed budget path"],
  "findingClasses": ["cross-consumer", "algorithmic", "instance-only", "doc_state_drift", "checklist_evidence_drift", "duplicated_workflow_text_drift", "logic_in_workflow_text_duplication", "doc_surface_drift", "option-without-consumer", "duplicate-derivation-path", "silent-failure", "dead-config-option", "vestigial-option", "consumerless-layer", "duplicated-logic"],
  "affectedSurfacesSeed": [".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs", ".skilled/commands/deep/assets/deep-research.yaml", ".skilled/commands/deep/assets/deep-review.yaml", ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs", ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts", ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs", ".skilled/commands/deep/review.md", ".skilled/commands/deep/research.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1

**R1-P1-001**: commit-range target written with surrounding text prunes every expansive node. Dimension: correctness. Location: `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:494` (helper `isCommitRange` at `:452`).
- Evidence: `isCommitRange` requires `splitTargetPaths(value).length === 1`, and `splitTargetPaths` splits on commas and whitespace (`:434-440`). A target such as `commit range <base>..<tip> (<label>)` therefore takes the path branch instead. Its words become path bases, so every seed and proposal fails relevance. Reproduced: false for the prose-wrapped target, true for the bare range.
- Impact: an expansive commit-range review quietly runs as a default one, and nothing reports the change.
- Fix: find a range token anywhere in the target, or bind the range in its own config field. If relevance prunes every seed, fail the seed step loudly.
- findingClass: cross-consumer. scopeProof: this run's own target has the failing shape. affectedSurfaceHints: seed and admit relevance check, the feature catalog entry for frontier-admit.

**R2-P1-001**: research frontier block step interpolates leaf-written text into a double-quoted shell argument. Dimension: security. Location: `.skilled/commands/deep/assets/deep-research.yaml:1653`.
- Evidence: `frontier_block` runs `frontier-admit.cjs block ... --focus "{next_focus}"`. `next_focus` comes from the strategy's Next Focus, which the leaf writes and which can carry an admitted proposal question. The only screen is the empty-string check at `frontier-admit.cjs:520`. In a bash test, a backtick `date` inside the focus text executed. The review workflow's version passes a script-generated node id and is safe.
- Impact: reviewed content can steer a leaf's text, and that text reaches a shell at a trust boundary.
- Fix: pass the active node id, as the review workflow does, or pass the focus through a file, stdin or an environment variable, never inside an interpolated argument.
- findingClass: cross-consumer. affectedSurfaceHints: `deep-research.yaml` block step, `frontier-admit.cjs` block subcommand.

### P2

| ID | Dimension | file:line | Finding | Fix |
|----|-----------|-----------|---------|-----|
| R1-P2-001 | correctness | `runtime/scripts/reduce-state.cjs:1983` | A defaulted expansive review budget (capped at 24) gives the depth-1 band half of it. With four or more depth-1 nodes, that half cannot cover them | Size the band share from the seed, or document the split rule the presentation already gives |
| R2-P2-001 | security | `runtime/scripts/frontier-admit.cjs:520` | A proposal's question and scope have no length or character limit, and both are copied verbatim into later prompts and the inbox | Cap the length and strip control characters at admission |
| R3-P2-001 | traceability | `007-expansive-depth-mode/spec.md:162` | The parent docs still describe an unstarted program: every phase `draft`, tasks open, completion 0. Every child says Complete | Update the phase map, tasks and continuity |
| R3-P2-002 | traceability | `010-research-frontier-mode/tasks.md:177` | Refined in iteration 10. Phases 010 and 011 are marked Complete with P0 checklist rows unticked. Research admission never checks a proposal's scope against the root scope (`frontier-admit.cjs:525`), so 010 CHK-032 is unmet in code | Add the scope check, or reopen the phase |
| R4-P2-001 | correctness (registry) | `.skilled/commands/deep/assets/deep-review.yaml:343` | The frontier seed step is written twice in each workflow, and the copies disagree. The fan-out copy drops `--max-iterations-source`, and the contract test checks only the other copy | Keep one step definition and test both paths |
| R4-P2-002 | correctness (registry) | `deep-review.yaml:944` (copy at `deep-research.yaml:789`) | The budget config writer is an inline `node -e` program, duplicated in both workflows, and no test runs it | Move it into a tested `frontier-admit.cjs` subcommand |
| R4-P2-003 | correctness (registry) | `.skilled/commands/deep/review.md:3` | Both command `argument-hint` lines leave out `--depth-mode` | Add the flag |
| R5-P2-001 | overengineering | `runtime/scripts/frontier-admit.cjs:558` | Proposals carry a per-proposal `budget` field. Only admission check 5 and the stored row use it; nothing spends against it | Delete check 5, the field on the stored row, and the field in both agent proposal schemas |
| R5-P2-002 | overengineering | `runtime/scripts/frontier-admit.cjs:720` | The seed command computes and prints the budget, the workflow never reads that output, and `step_frontier_budget` computes it again | Delete the `seedBudget` call in `seedNodes`, the `--max-iterations-source` flag, and the flag in both seed commands |
| R6-P2-001 | sk-code-alignment | `runtime/scripts/frontier-admit.cjs:258` | `readNodeStore` silently drops a torn row, so that node vanishes. The proposal reader in the same file warns on the same condition (`:1017-1029`) | Warn the same way |
| R8-P2-001 | overengineering | `runtime/lib/deep-loop/divergent-pivot.ts:293` | `minRemainingIterations` is defaulted, validated, persisted and required on replay, but nothing reads it | Delete the option |
| R8-P2-002 | overengineering | `runtime/lib/deep-loop/divergent-pivot.ts:759` | The `maxCouncilSeatOutputs` check compares the constant 3 with the config value, so setting it can only disable every pivot | Delete the config key and keep the constant |
| R8-P2-003 | overengineering | `runtime/scripts/fanout-merge.cjs:1000` | Four of the six merged review coverage surfaces are written and nothing reads them. Iteration 9 confirmed synthesis reads only `p0_count` and `failed_required_gate_ids` (`deep-review.yaml:2168-2171`) | Stop merging the four unread surfaces |
| R8-P2-004 | overengineering | `runtime/scripts/upsert.cjs:490` | `canonicalEdgeEndpoint` re-implements `resolveReviewFindingId` inline | Call the existing function |

In the table, paths under `runtime/` are relative to `.skilled/skills/system-deep-loop/`, and paths starting `007-expansive-depth-mode/` or `010-research-frontier-mode/` are relative to `specs/system-deep-loop/loop-architecture/002-graph-engineering/` (the second sits inside the first). Disposition for every finding: active.

## 4. Remediation Workstreams

1. **WS1, frontier input safety and relevance (P1 first):** R2-P1-001, then R1-P1-001, then R2-P2-001.
2. **WS2, expansive budget and seed path:** R5-P2-002, R4-P2-001 and R4-P2-002 collapse into one tested budget path; R1-P2-001 then rides on that path.
3. **WS3, delete unearned options and layers (P2 advisories):** R5-P2-001, R8-P2-001, R8-P2-002, R8-P2-003 and R8-P2-004, plus R6-P2-001.
4. **WS4, packet and doc truth (P2 advisories):** R3-P2-001, R3-P2-002 and R4-P2-003.

## 5. Spec Seed

- Open a remediation child under `007-expansive-depth-mode` for WS1-WS4. In its scope, state that the defect fixes change default-path research behavior: the block step invocation changes.
- Record that a commit-range review target may carry surrounding text, or that the range binds in its own field.
- Reconcile the parent `spec.md` Phase Documentation Map, `tasks.md` and the `implementation-summary.md` continuity with the child phases' Complete status.

## 6. Plan Seed

- T1: Replace `--focus "{next_focus}"` in the research frontier block step with a node-id or file-based handoff, and add a test that passes a focus containing shell metacharacters.
- T2: Make range detection tolerate surrounding prose, and fail the seed step when relevance prunes every seed. Test both target shapes.
- T3: Add a length cap and control-character stripping for proposal question and scope.
- T4: Keep one seed step definition and move the budget writer into a tested subcommand. Delete the duplicate seed budget computation and `--max-iterations-source`.
- T5: Delete the per-proposal `budget` field and check 5, `minRemainingIterations`, the `maxCouncilSeatOutputs` config key, and the four unread merged surfaces. Reuse `resolveReviewFindingId`.
- T6: Warn on a torn node-store row.
- T7: Fix the parent packet docs and the 010/011 checklists, and add `--depth-mode` to both argument hints.

## 7. Traceability Status

Core protocols:

- `spec_code`: **partial** (iteration 10, evidence `frontier-admit.cjs:452`, `deep-review.yaml:550`). The `run_extended` identity holds across the YAML extend step, the schema check and the reducer. R1-P1-001 keeps the commit-range relevance claim unmet.
- `checklist_evidence`: **partial** (iteration 10). The ticked rows that were spot-checked match the files they cite. Phases 010 and 011 still have open P0 rows while marked Complete (`010-research-frontier-mode/tasks.md:177`, `:188`), and parent tasks T004-T010 are open.

Overlay protocols:

- `agent_cross_runtime`: pass (iteration 10).
- `feature_catalog_code`: partial (iteration 3). The frontier-admit catalog entry becomes true once R1-P1-001 is fixed (search debt SL-304).
- `playbook_capability`: partial (iteration 3). The scenario files exist; their content was not executed.
- `skill_agent`: partial.

Reducer summary: 6 required, 6 executed, 1 pass, 5 partial, 2 gating failures.

- `AC_COVERAGE`: exempt. The parent packet is at the research level and carries no `acceptance-criteria.md`.
- Resource map: `resource-map.md` was not present at init, so the coverage gate was skipped. A run resource map was emitted at `review/resource-map.md`.

## 8. Deferred Items

- The overengineering pass over playbook and feature-catalog duplication, planned for iteration 10, did not run: the forced traceability pass spent the budget on `checklist_evidence`.
- Search debt SL7-005 (`mergeSearchCoverage` listing a bug class as both covered and deferred) is still recorded as deferred in the registry. Iteration 9 found no reader that treats the merged deferred list as open work and withdrew the concern.
- The `playbook_capability` content was not executed.

## Dimension Expansion Map

- No divergent pivots: convergence mode `default`, 0 completed, 0 failed, 0 audited overrides.
- Stuck recovery fired once, before iteration 8, after two low-yield passes (iterations 6 and 7). It switched the next pass to function-level granularity on the overengineering dimension, which then produced four new P2s.
- Remaining frontier: none (default depth mode).

## 9. Search Ledger

- `searchCoverage`: required bug classes are `checklist_evidence_drift`, `spec_code_drift` and `mirror_drift`.
  - covered: `checklist_evidence_drift`
  - ruled out: `mirror_drift`
  - graph coverage mode: `graphless_fallback`
- **hasSearchDebt: true.** There are two deferred rows: SL-304 (catalog_drift, tracked under R1-P1-001) and SL7-005 (merge_semantics, withdrawn on substance in iteration 9). The verdict counts both.
- Ruled out across the run:
  - a lineage's own node id masking a lost node in the fan-out partition check
  - a lineage dealt no nodes reseeding the target
  - the dropped remaining-iterations check, which is intentional per the pivot-hygiene phase
  - `inboxId` versus `nodeId` mismatch
  - retry reuse of first-attempt seat events
  - mismatch between the extend-ceiling rule and the schema
  - defects in the continuity thread, legacy upcast and coverage signals
  - ephemeral labels in comments: no spec, phase, REQ, ADR or finding ids across the 26 changed code files and their tests

## 10. Audit Appendix

**Convergence:**
- newFindingsRatio by iteration: 1.0, 0.5, 0.143, 0.176, 0.105, 0.05, 0, 0.167, 0, 0.02.
- `stopPolicy` max-iterations kept every convergence decision as telemetry until the cap: CONTINUE with `stopPolicyMaxIterations` for iterations 1-7 and 9-10, and STUCK_RECOVERY before 8.
- The terminal decision was STOP with `maxIterationsReached`. Legal-stop gates still failing at that stop: dimensionCoverageGate, candidateCoverageGate and graphlessFallbackGate.
- Terminal gates: evidence pass, scope pass, coverage fail (`traceability-incomplete`).

**Coverage:** all six configured dimensions are covered. Claim adjudication passed after every iteration.

**Ruled-out claims:** see the Search Ledger.

**Sources reviewed:**
- Code and config: `frontier-admit.cjs`, `reduce-state.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `fanout-run.cjs`, `fanout-merge.cjs`, `dispatch-iteration.cjs`, `upsert.cjs`, `divergent-pivot.ts`, `divergent-review-pivot.ts`, `deep-research/scripts/reduce-state.cjs`, the ledger schemas and types, `legacy-compatibility.ts`, `continuity-thread.cjs`, coverage-graph query and signals, both workflow YAMLs, both presentation assets, and both command docs.
- Tests: the changed runtime tests.
- Docs: the deep-review and deep-research references, feature catalogs and playbooks (existence only), plus the parent and child packet docs.

### Core Protocols

`spec_code` partial, `checklist_evidence` partial. See section 7.

### Overlay Protocols

`agent_cross_runtime` pass. `feature_catalog_code`, `playbook_capability` and `skill_agent` partial.

### Workflow deviations recorded by the conductor

1. **The duration budget was raised.** `maxDurationMinutes` was set to 360 instead of the workflow's 120 at config creation, so the duration stop could not end a 10-iteration run early. The run used about 45 minutes.
2. **The minimum-iterations floor was raised.** `antiConvergence.minIterations` was set to 10 and `stopPolicy` to max-iterations, so the run had exactly 10 iterations, as the operator asked.
3. **The native executor config holds no model or effort.** The native kind accepts no `model` or `reasoningEffort` field, so opus and medium effort were passed on each Agent dispatch instead.
4. **The target type is `files` and the scope was hand-built.** The commit range was expanded into a 278-path ordered scope with generated run artifacts excluded, because the workflow has no commit-range target type.
5. **The conductor fixed the dimension order.** The workflow's `next_dimension` has no rule once every dimension is covered, so a 10-slot plan lives in the strategy. Iteration 8 followed stuck recovery, using the least-covered tie on overengineering. Iteration 10 was forced to traceability by the workflow's last-iteration core-protocol rule, which replaced a planned third overengineering pass.
6. **Prompt delivery was by reference.** Each dispatch carried the route header and the path to the rendered prompt pack (`review/prompts/iteration-N.md`, rendered by the real `renderPromptPack`), not the 20 KB body pasted inline.
7. **The conductor rebuilt several steps as scripts.** The convergence-event, claim-adjudication, reducer and graph-upsert steps ran through small conductor scripts that call the workflow's own runtime scripts with the YAML-specified arguments and record every row through the append gateway.
8. **`phase_save` was skipped.** `generate-context.js` would write continuity into the packet's canonical docs, and the operator's constraints limit writes to review artifacts. The stage step was folded into the operator-requested local commit.

Coverage graph state lives in the gitignored shared database at `.skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite`.

**Closeout note.** `synthesis-closeout.cjs` exited 0. It recorded a warning-severity `synthesis_incomplete` event with invariant `structured_state_findings_partially_reflected_in_registry`: 17 iteration findings against 16 registry findings. The gap is R10-P2-001. It carries `refines: R3-P2-002`, so the reducer folded it into R3-P2-002, whose title now carries the refined claim. No finding is missing.

**Dimension attribution note.** The iteration 4 state record tags R4-P2-001, R4-P2-002 and R4-P2-003 as `maintainability`; that pass was the maintainability pass. The reducer-owned registry tags all three `correctness`, and this report follows the registry, as the synthesis contract requires. The likely cause, inferred and not confirmed: the delta finding rows carry no `dimension` field. When the reducer cannot read a dimension from the iteration it falls back to `correctness` (`deriveDimension`, `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1237-1245`). Registry counts by dimension: correctness 4 P2 + 1 P1 (R1-P1-001, R1-P2-001, R4-P2-001..003), security 1 P1 + 1 P2, traceability 2 P2, maintainability 0, overengineering 6 P2, sk-code-alignment 1 P2.
