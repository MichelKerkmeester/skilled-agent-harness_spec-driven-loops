# Iteration 4: The assets-scoring seam — is the D3 gain real or artifact?

## Focus

I chose **assets-scoring seam** because it is the highest-value unresolved measurement question: current routing explicitly defers `assets/*`, but the playbook gold still authoritatively expects assets for several scenarios. That means reported D3 gains may mix real reference-slice efficiency with a benchmark artifact: assets can be useful for D4 but invisible or punitive in D2/D3 scoring.

## Actions Taken

- Read prior synthesis: `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/research/research.md:19-34`, `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/research/research.md:81-85`.
- Read router contract: `.opencode/skills/sk-code/references/smart_routing.md:289-307`, `.opencode/skills/sk-code/references/smart_routing.md:326-459`.
- Read deterministic router: `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs:210-255`.
- Read scenario parser: `.opencode/skills/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-154`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:231-262`.
- Read scorer: `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:22-118`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:244-277`.
- Read live parser: `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs:149-168`.
- Read D4 ablation harness: `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:4-16`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:39-52`.
- Read current router report: `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:18-35`, `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.md:12-23`.
- Read live reports: `.opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.json:18-39`, `.opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.json:317-389`, `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:18-39`, `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:306-370`.
- Read D4 artifact: `.opencode/skills/sk-code/benchmark/live-final/d4-ablation.json:1-28`.
- Read asset-bearing gold examples: `.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/webflow-detection.md:29-51`, `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/webflow-plus-motion-dev.md:34-58`, `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/opencode-typescript.md:27-38`.

## Findings

1. `expectedAssets` is parsed but not scored. The playbook parser extracts `expectedResources` and `expectedAssets` separately (`load-playbook-scenarios.cjs:125-154`), but the scorer normalizes expected gold to `resources: scenario.expectedResources || []` and drops `scenario.expectedAssets` (`score-skill-benchmark.cjs:52-60`). Build implication: a benchmark-only patch can add `assets` without changing router behavior.

2. Current deterministic router intentionally returns no assets. `router-replay.cjs` filters every `assets/` path out of the first routed slice (`router-replay.cjs:241-243`), and the prose contract says route-time loading defers `assets/*` on demand (`smart_routing.md:452-459`). Computed over current parsed non-negative text scenarios: `routedAssets=0` and `assetsHit=0` for every asset-bearing row. This means folding assets into current gold cannot improve current D3.

3. Folding `expectedAssets` into current deterministic gold changes D2 honesty, not D3. Computed over 12 non-negative, non-browser current rows: resource-only D2 average = `0.5423`; refs+assets D2 average = `0.4468`; resource-only D3 average = `0.3869`; refs+assets D3 average = `0.3869`. The D3 equality follows directly from the current router’s `assets/` filter (`router-replay.cjs:241-243`) and D3’s formula, which only checks actual routed paths against expected paths (`score-skill-benchmark.cjs:102-118`).

4. The asset omission is still a real usefulness blind spot. SD-001 expects `assets/webflow/patterns/interaction_gate_patterns.js` and says the desired user-visible outcome should cite that gate pattern (`webflow-detection.md:43-51`). CS-001 expects `assets/motion_dev/snippets/in_view_reveal.js` and `assets/motion_dev/snippets/cdn_bootstrap.js`, and its pass rule explicitly requires `assets/motion_dev/snippets/in_view_reveal.js` (`webflow-plus-motion-dev.md:47-58`). Those are not decorative checklists; they are task-output affordances.

5. Live scoring can penalize useful stated assets as D3 waste. `live-executor.cjs` unions `stated.resources` and `stated.assets` into `observedResources` (`live-executor.cjs:149-162`), while the scorer still compares against expected references only (`score-skill-benchmark.cjs:52-60`, `score-skill-benchmark.cjs:102-118`). Therefore, if the model states an actually useful asset path, current D3 treats it as waste unless the same path is also in `expectedResources`. That is a measurement artifact.

6. The exact live D3 artifact magnitude is UNKNOWN from the checked-in report alone. The live report preserves only trimmed `responseHead` plus observed reads (`score-skill-benchmark.cjs:152-160`), not the full stated `assets` array. Pre-remediation CS-001 did read expected asset paths such as `assets/motion_dev/install_card.md`, `assets/motion_dev/snippets/cdn_bootstrap.js`, and `assets/motion_dev/snippets/in_view_reveal.js` (`live-final/skill-benchmark-report.json:374-386`), but observed reads are not the same as scored `stated.assets` (`live-executor.cjs:160-168`).

7. Current D3 improvement is partly real, but the asset-deferral component is not independently proven real. Current router D3 is `33/100` (`router-final/skill-benchmark-report.json:31-35`) and live-remediated D3 is `50/100` (`live-remediated/skill-benchmark-report.json:31-34`). Because folding assets into current deterministic gold leaves D3 unchanged, the remaining current D3 signal is real reference-slice efficiency. But any historical gain from no longer routing assets as first-slice paths is a measurement artifact unless D4 proves those assets were unnecessary.

8. D4 is too weak to settle the usefulness question. The D4 harness labels itself approximate because skill-off is simulated with hook suppression and contamination checks (`d4-ablation.cjs:4-16`). It computes usefulness as `0.5 + (onScore - offScore) / 2` (`d4-ablation.cjs:35-52`). The checked-in D4 artifact has only 2 scored rows: LS-001 hurts (`0.435`, on `0.82`, off `0.95`) and CS-001 helps (`0.55`, on `0.88`, off `0.78`) (`d4-ablation.json:1-28`). That supports “task-dependent,” not a stable D4 estimate.

9. Concrete build lever: split asset gold into a deferred-assets lane instead of merging it into D3. Keep D3 as first-slice reference efficiency because the router contract explicitly defers assets (`smart_routing.md:452-459`). Add `expectedAssets` to report rows as `deferredAssetGold`, score it separately as `assetRecall` or `D4_asset_support`, and feed it into D4 rubrics for scenarios whose pass criteria require snippets/checklists. This distinguishes real D3 gains from “we stopped counting useful assets as waste.”

10. Concrete D4 lever: add an asset-sensitive routine scenario before generalizing. Existing LS-001/LS-002/LS-003 gold already expects language checklist assets alongside exact language refs (`opencode-typescript.md:27-38`, `opencode-python.md:27-38`, `opencode-shell.md:25-36`). A useful third routine D4 scenario should grade what the model does with the checklist constraints, not whether it merely recalls the checklist path.

## Implications for D3/D4

For D3: the next real D3 work is not “fold assets into gold.” Current deterministic D3 remains unchanged when assets are folded because no assets are routed. The real D3 headroom is residual reference over-routing and gold-map mismatch. The measurement fix is to stop reporting asset deferral as a pure D3 win.

For D4: assets are likely a real lever, but only when they affect output quality. CS-001’s gold requires concrete Motion snippet assets, while LS-001’s current D4 result says skill-on can still hurt a routine task. The benchmark needs an asset-aware usefulness instrument: score whether the final answer applies the relevant checklist/snippet constraints, not whether the router lists asset paths.

Expected magnitude: deterministic current folded-assets D3 delta is `0.0000`; deterministic current folded-assets D2 delta is about `-9.55` points on the non-negative text rows. Live D3 artifact magnitude is UNKNOWN from stored report fields; upper-bound risk is non-trivial for asset-heavy scenarios such as CS-001, but exact scored asset waste requires full `stated.assets`.

Real versus artifact: H1 surface/language slicing remains a real D3 gain for references. Asset deferral is a benchmark artifact unless D4 or an explicit deferred-asset lane shows that omitting assets from the first slice does not reduce task usefulness.

## What's still unexplored

Gold-map reconciliation remains the highest-value next iteration: SD-001 and CS-001 still have low D2/resource recall, and this iteration shows assets are not the reason current D3 remains low.

D4 instrumentation remains unresolved: the loop still needs a third routine scenario and a rubric that grades task outcome quality, checklist application, and snippet correctness rather than route recall.

Concern-level or phase-gated slicing remains untested after the asset seam: current evidence says assets are a measurement boundary, not the primary remaining router lever.
