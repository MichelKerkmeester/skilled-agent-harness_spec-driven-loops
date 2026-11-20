# Deep Review Report: expansive-depth program, fan-out opus + deepseek

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**. hasAdvisories: false.
- Counts the verdict used, from the fan-out merge: P0 0, P1 4, P2 18.
- Search debt: 0. Failed required gates: none.
- Review scope: the commit range `21c4b325b5a..de32abbb74d`, narrowed by pathspec to:
  - `.skilled/skills/system-deep-loop`
  - `.skilled/commands/deep`
  - `.skilled/agents`, with the `.claude`, `.codex`, `.pi`, `.dsh` and `.vibe` agent mirrors.

  Spec-packet evidence under `specs/` was left out.
- Expansive depth: 6 depth-1 seeds were admitted and 1 was pruned as `generated-artifact`. They were
  dealt round-robin: opus took F-1-002, F-1-004 and F-1-006; deepseek took F-1-003, F-1-005 and
  F-1-007.
- Lineages:

  | Lineage | Executor and model | Iterations | Stop | Deviation |
  |---------|--------------------|------------|------|-----------|
  | `opus` | cli-claude-code `claude-opus-5-5`, effort medium | 14 | converged | none |
  | `deepseek` | cli-opencode `llmgateway/deepseek-v4.1-flash-1017#max` | 12 | converged | see below |

  The deepseek lineage was resumed in place after its first attempt on
  `opencode-go/deepseek-v4.1-flash` died on a provider quota (HTTP 429) after one iteration.
- Operator review focus: Every iteration also covers three angles, read through the range diff (git diff 21c4b325b5a..de32abbb74d -- <file>). 1) Overengineering, per .skilled/repo-rules/prevent-overengineering.md: abstractions, options, flags, layers, fallbacks or files no current requirement earns, and duplicated logic or prose (one rule restated across YAML, presentation, review.md, references and playbooks); name what to delete or collapse. 2) Operator UX: flag ergonomics, error and warning text, setup prompts, dashboard and report clarity, and the cost of discovering how to use --extend, --depth-mode=expansive and the --frontier-max-depth/--frontier-max-nodes flags. 3) Cross-CLI runtime parity: the same behavior across the claude, opencode, codex, pi, devin, cursor, dsh and vibe executors and their agent and command mirrors (.claude .codex .pi .dsh .vibe against .skilled), plus Node and OS portability of the scripts (paths, shells, BSD vs GNU tools). Cite file:line for every finding.

### Self-check outcomes

The conductor re-read the cited code at `de32abbb74d`. On a fan-out root these calls are for
reference only; they do not change the merged counts above.

- `OPUS-F004-P1-002` is confirmed at P1. It absorbs `OPUS-REC-P1-003` as a refinement.
  - `convergence.cjs:1383-1389` counts any review iteration with a ratio at or below
    `0.5 x convergenceThreshold` toward a lineage-wide stuck counter.
  - The workflow then closes the active node as `exhausted/stuck` (`deep-review.yaml:1610-1617`).
  - In this run, opus closed F-1-004 after three of its four dimensions and F-2-007 after one.
    Both closes came from clean passes on other nodes.
- `OPUS-F002-P2-002` (now P1) is confirmed as a gap; the Referee downgrades it to P2.
  - The gap is real: `step_scope_discovery` has no commit-range branch (`deep-review.yaml:815-820`),
    and `scopeInsideTouchedFiles` admits every scope when the list is empty
    (`frontier-admit.cjs:613-618`).
  - "Never engages" is overstated: both lineages recorded a list in this run. Opus recorded 232
    files; deepseek recorded the 8 pathspec directories.
- `R2-P1-001` is confirmed at P1.
  - `FAILED_VISIT_STATUSES` holds `error`, `failed`, `failure` and `timeout`, but not `thought`
    (`frontier-admit.cjs:90`).
  - `buildReviewFrontier` therefore credits a thought iteration's dimensions to its node and
    counts it as spent depth (`reduce-state.cjs:1969-1980`). `convergence.cjs:1372` skips the same
    rows as non-evidence.
- `R3-P1-001` is confirmed at P1, as a spec/workflow contradiction.
  - The review-frontier spec's `REQ-007` says an accepted pivot candidate is routed through
    admission.
  - `deep-review.yaml:1429` says that with the frontier terminal "the pivot adds no frontier node".

## 2. Planning Trigger

`/speckit:plan` is required: four active P1 findings.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": {"P0": 0, "P1": 4, "P2": 18},
    "remediationWorkstreams": ["WS1 frontier stop and visit accounting", "WS2 commit-range scope", "WS3 pivot contract", "WS4 docs and UX drift", "WS5 portability"],
    "specSeed": ["Make stuck closure per node, or exempt clean dimension passes from it, under --depth-mode=expansive", "Give step_scope_discovery a commit-range branch that records touched files", "Decide REQ-007: admit pivot candidates or amend the spec"],
    "planSeed": ["Exclude thought iterations from frontier visits", "Per-node stuck accounting", "Commit-range scope discovery", "Collapse the --depth-mode flag cell to a pointer"],
    "findingClasses": ["correctness", "traceability", "maintainability", "portability"],
    "affectedSurfacesSeed": [".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs", ".skilled/commands/deep/assets/deep-review.yaml", ".skilled/commands/deep/review.md"],
    "fixCompletenessRequired": true
  }
}
```

## 3. Active Finding Registry

The merged registry is `deep-review-findings-registry.json`, and per-lineage attribution is in
`fanout-attribution.md`.

### P1

| ID | File:line | Title |
|----|-----------|-------|
| OPUS-F004-P1-002 | `runtime/scripts/convergence.cjs:1389` | The novelty ratio divides by the accumulated weighted total, so late in an expansive run an iteration that finds a new issue reads as no progress and exhausts the node |
| OPUS-F002-P2-002 | `runtime/scripts/frontier-admit.cjs:618` | No workflow step records the files a commit-range target touches |
| R2-P1-001 | `runtime/scripts/reduce-state.cjs:1971` | A thought iteration covers a frontier dimension and spends node depth |
| R3-P1-001 | `commands/deep/assets/deep-review.yaml:1429` | REQ-007 and AC-008 promise pivot-candidate admission the pivot branch never performs |

### P2

| ID | Location | Title |
|----|----------|-------|
| OPUS-F002-P2-001 | `frontier-admit.cjs:248` | `dedupeKey` drops non-ASCII letters |
| OPUS-F002-P2-003 | `frontier-admit.cjs:620` | Scope prefix check lets free text through |
| OPUS-F002-P2-004 | `frontier-admit.cjs:706` | A negative or fractional proposal budget is accepted |
| OPUS-F004-P2-001 | `deep-review-presentation.txt:83` | Budget universe text not narrowed |
| OPUS-F004-P2-002 | `deep-review.yaml:599` | The `--extend` warning omits `frontier_drained` |
| OPUS-F004-P2-003 | `convergence.cjs:1505` | Comment false for a canonical subset |
| OPUS-F004-P2-004 | `review.md:100` | 486-word flag cell, and the seed step is written out twice |
| OPUS-F006-P2-001 | `state-format.md:305` | Universe wording drift on nine surfaces |
| OPUS-F006-P2-002 | live two-node playbooks `:49` | Wait for a confirm stop the workflow lacks |
| OPUS-F007-P2-001 | `frontier-admit.cjs:592` | An open-ended git range is read as a path |
| OPUS-REC-P2-001 | `convergence.md:227` | `<` in the docs where the code uses `<=` |
| OPUS-REC-P2-002 | `convergence.cjs:1581` | The graphless fallback gate demands row-level `evidenceRefs` |
| R1-P2-001 | `fanout-run.cjs:1791` | The FRONTIER block is named but never rendered for CLI prompts |
| R1-P2-002 | `fanout-run.cjs:357` | Locale collation against code-unit order |
| R1-P2-003 | `fanout-merge.cjs:1003` | One lineage omitting `graphCoverageMode` erases it |
| R1-P2-004 | `fanout-merge.cjs:982` | The merge re-implements reducer arithmetic |
| R5-P2-001 | `upsert.cjs:330` | POSIX-only separators in source classification |
| R12-P2-001 | `divergent-pivot.ts:1296` | Double config write bypasses the conflict check |

## 4. Remediation Workstreams

1. **WS1, frontier stop and visit accounting**: OPUS-F004-P1-002 and R2-P1-001.
2. **WS2, commit-range scope**: OPUS-F002-P2-002 and OPUS-F007-P2-001.
3. **WS3, pivot contract**: R3-P1-001, and R12-P2-001 as an advisory.
4. **WS4, docs and UX drift** (P2 advisories): OPUS-F004-P2-001/002/004, OPUS-F006-P2-001/002 and
   OPUS-REC-P2-001.
5. **WS5, portability and parity** (P2 advisories): R5-P2-001, R1-P2-001, R1-P2-002 and
   OPUS-F002-P2-001.

## 5. Spec Seed

- Stuck recovery under expansive depth must not close a node for another node's clean passes, and a
  clean dimension pass is not "no progress" while the node still owes dimensions.
- A commit-range review target records its touched files at scope discovery.
- REQ-007 needs a decision: either the pivot admits candidates through admission, or the spec drops
  the promise.

## 6. Plan Seed

- Add `thought` to the statuses excluded from frontier visits. Test: a thought row neither covers
  nor spends.
- Key the stuck counter per active node, or skip the stuck close while the node owes dimensions.
  Test: two clean passes on node A do not close node B.
- Add a commit-range branch to `step_scope_discovery` that runs `git diff --name-only <range> --
  <pathspec>`.
- Replace the `--depth-mode` flag cell in `review.md` with a short pointer to the presentation
  asset.

## 7. Traceability Status

- **Core `spec_code`**: drift.
  - R3-P1-001 is a spec/YAML contradiction.
  - The universe narrowing reached only some surfaces (OPUS-F006-P2-001).
- **Core `checklist_evidence`**: not assessed. The target is a commit range, not a spec folder.
- **Overlay `agent_cross_runtime`**: the deep-review and deep-research mirrors changed in step
  across `.skilled`, `.claude`, `.codex`, `.pi`, `.dsh` and `.vibe`. No lineage raised a mirror
  divergence.
- **Overlay `feature_catalog_code` and `playbook_capability`**: drift (OPUS-F006-P2-002,
  OPUS-F006-P2-001).
- AC_COVERAGE: exempt. This is not a spec-folder target.

## 8. Deferred Items

- All 18 P2 findings are advisories. None blocks the verdict on its own.
- The `synthesis_incomplete` rows both lineages wrote (`structured_state_findings_partially_reflected_in_registry`)
  are false alarms. Every delta id the check counted as missing was recorded in the registry as a
  refinement of an earlier id, under the earlier id.

## Dimension Expansion Map

- **Opus**: F-1-002 and F-1-006 answered. F-1-004 exhausted by stuck. F-2-007, depth 2 under
  F-1-002, admitted and then exhausted by stuck after one dimension.
- **Deepseek**: F-1-003, F-1-005 and F-1-007, each with all four dimensions. No growth proposals.
- No divergent pivot ran, because convergence mode was `default`.

## Search Ledger

- `searchDebt`: 0. Exhausted nodes are frontier-only and are not filed as debt.
- `candidateCoverage`: covered for the four answered depth-1 nodes, and for deepseek's nodes as its
  reducer projected them.
- `ruledOutCandidates`: F-1-001 (`generated-artifact`).
- `cleanSearchProof`: not separately captured. See the lineage registries.

## Audit Appendix

- **Convergence**:
  - Opus stopped converged at run 15, after stuck recovery at runs 10 and 13 and a blocked stop at
    run 14 (`graphlessFallbackGate`).
  - Deepseek recorded a converged `synthesis_incomplete` row with no `terminal_gates` row. Its
    iterations 4 to 12 landed 20 to 60 s apart.
- **Coverage**: dimension coverage was 1.0 in both lineages. Per-node coverage is as in the
  Dimension Expansion Map.
- **Sources reviewed**: see `lineages/opus/iterations/` and `lineages/deepseek/iterations/`.
- **Cross-reference**:
  - Core Protocols: `spec_code` drift; `checklist_evidence` not applicable.
  - Overlay Protocols: `agent_cross_runtime` no divergence found; `feature_catalog_code` drift;
    `playbook_capability` drift; `skill_agent` not assessed.
