# Review Iteration 012

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: none active; all three nodes (`F-1-003`, `F-1-005`, `F-1-007`) are `answered` on all four dimensions, so `frontier-admit.cjs block` printed nothing and this iteration proposes no sub-targets
- Dimension: traceability (consolidation pass)
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its traceability clause: it executed the two completion criteria that iteration 11 could only read about, and closed the `checklist_evidence` protocol on evidence rather than on form.
- Sources read this iteration: `steer.md` (absent from the lineage directory), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `iterations/iteration-011.md`, `logs/iter-011.json`

## Files Reviewed

- `barter/ai-speckit/skilled/.skilled-overlays.json`
- `barter/ai-speckit/skilled/barter-overlays` (absence)
- `barter/ai-speckit/skilled/.skilled/skills/sk-git/sk-git-skilled/SKILL.md` (absence)
- `barter/ai-speckit/overlays/overlay-manifest.json` (`sk-git-root` entry)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4385-4388` (`managedPathTest`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556` (`strictWriteRefusal`)
- `.skilled/skills/system-skilled-doctor/SKILL.md:5`
- `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `barter/ai-speckit/skilled/.skilled-overlays.json`; `barter/ai-speckit/skilled/barter-overlays`; `.skilled/skills/system-skilled-doctor/SKILL.md:5`; `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md` | Criteria 2, 3 and 5 hold on the tree as it stands; criterion 5 was executed this iteration rather than inferred. |
| `checklist_evidence` | pass | `.skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556`; `barter/ai-speckit/overlays/overlay-manifest.json`; `barter/ai-speckit/skilled/.skilled-overlays.json` | Criterion 5 was executed: `--guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`. Criterion 4 was executed: `status --json` reports `"result": "PASSED"` with `"offLayout": []`. The remedy wording on that line is still wrong, and it is carried as the open P2 `R11-P2-001`, not as a gap in this protocol's evidence. |

## Integration Evidence

- Criterion 4 executed: `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` in `barter/ai-speckit/skilled` prints `"result": "PASSED"`, `"overlayFolder": "../overlays"`, `"offLayout": []`, `"staleRootFiles": []`, and `check: { checked: 135, ok: 135, miss: 0, problems: [] }`, exit 0.
- Criterion 5 executed: `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` prints `refuse: .skilled/skills/sk-git/sk-git-skilled/SKILL.md is a new file inside overlay sk-git-root; create it as ../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply`, exit 1. The named source is under `../overlays/framework/`, which is what the criterion requires.
- Criterion 3 re-confirmed: `barter/ai-speckit/skilled/.skilled-overlays.json` holds exactly `{ "overlayDir": "../overlays" }`, and `barter/ai-speckit/skilled/barter-overlays` does not exist.
- Criterion 2 re-confirmed: `.skilled/skills/system-skilled-doctor/SKILL.md:5` is `version: 1.2.0.0`, and `changelog/v1.2.0.0.md` names `apply --relayout`.
- The `sk-git-root` manifest entry lists `sk-git-skilled` under `remove` and not under `replace`, which is the evidence `R11-P2-001` rests on: the remedy the guard prints cannot be satisfied by `apply`.
- Criteria 1 and 6 remain unverified: the engine suite writes to OS temp directories outside this lineage's write surface, and `validate.sh --recursive --strict` is forbidden by the dispatch.

## Edge Cases

- **A prior iteration's `partial` is reversed here, deliberately.** Iteration 11 recorded `checklist_evidence` as `partial` because the guard's remedy is unusable. That conflated two things: the criterion's stated check, which passes, and a separate defect in the text the check prints, which is `R11-P2-001`. This pass separates them and records `pass` with the defect carried as an open P2. The reducer only reverses `partial` to `pass` when the later result carries a `path:line` reference, and this result does, so the reversal is durable rather than silently dropped.
- **The coverage graph was empty, so `hotspotSaturationGate` could not evaluate.** The lineage had never run the workflow's `step_graph_upsert`, so `convergence.cjs` read `nodeCount: 0`, passed `trace: []` into the stop decision, and `graphHotspotSaturation` returned `null` — a gate that can never pass. This iteration runs `upsert.cjs` with the canonical dimension and file nodes so the graph carries a `hotspotSaturation` trace entry. Recorded because a graphless review run otherwise reaches its iteration cap with every legal-stop gate permanently blocked.
- **`stale_setting_file` was not in the fallback-covered set.** Its only ledger row used `filesystem_probe`, which `reviewFallbackCoveredBugClasses` does not count as an evidence method, so `graphlessFallbackGate` failed on it. This iteration records the same check with `direct_read` and a `path:line` reference.
- **Tests were not re-run** for the containment reason recorded in iteration 1: the suite writes to OS temp directories, outside the lineage write surface.
- **The frontier is drained.** No node is open or active, so this pass could not spend a node and worked the protocol set instead. Recorded so the strategy's rotation notes stay accurate.

## Confirmed-Clean Surfaces

- `status --json` reports `PASSED` with an empty `offLayout` and an empty `staleRootFiles`, and its `check` block is 135/135 with no problems.
- The guard fails closed: it refuses the write and names a source under `../overlays/framework/`.
- The setting file holds exactly the value decision D4 requires, with no extra keys.
- The old `barter-overlays` folder is gone from the vendored tree.
- The doctor skill's version line and its release entry agree, and the entry names the migration command.

## Ruled Out

- **Criterion 4 fails on the tree as it stands.** Checked and ruled out: `status --json` reports `PASSED` with `offLayout: []`.
- **Criterion 5 fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.
- **The setting file names a folder other than `../overlays`.** Checked and ruled out: it prints `{ "overlayDir": "../overlays" }`.
- **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: the path does not exist.
- **The doctor skill version and its changelog disagree.** Checked and ruled out: both are `1.2.0.0`.

## Next Focus

- Dimension: cross-reference
- Focus area: synthesis -- group the seven open findings by root cause and state the verdict the registry supports
- Reason: the frontier is drained, all four dimensions are covered, and both core traceability protocols now pass on executed evidence, so no review work remains inside the loop
- Rotation status: all three nodes answered on all four dimensions; consolidation pass complete
- Blocked/productive carry-forward: productive -- executing the criteria rather than reading about them is what closed `checklist_evidence`, and it is the same move that found `R11-P2-001` in iteration 11
- Required evidence: the findings registry, the seven open findings, and the strategy's exhausted-approach list

Review verdict: CONDITIONAL
