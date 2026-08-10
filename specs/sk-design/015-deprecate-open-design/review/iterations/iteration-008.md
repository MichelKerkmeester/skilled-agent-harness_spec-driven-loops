# Deep Review Iteration 008

## Dispatcher
- Session: `rvw-2026-08-10-deprecate-open-design`; generation `1`; lineage `new`.
- Declared target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus every live referencing surface and `specs/sk-design/015-deprecate-open-design`.
- Mode: review; focus dimension: completeness/correctness of benchmark-corpus and generated-artifact exclusion classifications.
- Budget profile: `scan`.
- Review target remained read-only. Packet boundary and the absent `iteration-008.md`/`iter-008.jsonl` write-once paths were validated before review.

## Files Reviewed
- Benchmark loader and fixtures: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/{run-skill-benchmark.cjs,score-skill-benchmark.cjs,compiled-routing-parity.cjs,README.md}`, `assets/skill-benchmark/fixtures/sk-design/*.private.json`, `assets/skill-benchmark/fixtures/sk-design-dispatch/*.private.json`, and representative public dispatch fixture.
- Benchmark routing surfaces: `.opencode/commands/deep/skill-benchmark.md`, `.opencode/commands/deep/assets/deep-skill-benchmark-auto.yaml`, and `deep-improvement/scripts/shared/loop-host.cjs`.
- Historical report surfaces: `.opencode/skills/{sk-design,sk-prompt,sk-code,mcp-tooling,system-deep-loop,cli-external-orchestration,sk-doc}/benchmark/README.md` and the dated `benchmark/reports/compiled-routing/2026-07-21--*/` trees (directory inventory plus archive-contract evidence).
- Advisor corpus and source contract: `.opencode/skills/system-skill-advisor/mcp-server/scripts/{skill_advisor.py,skill-graph.json,skill_graph_compiler.py}`, `.opencode/skills/system-skill-advisor/{README.md,references/graph/skill-graph-drift.md}`, `.opencode/skills/sk-design/{description.json,graph-metadata.json}`.
- Runtime archives and indexes: `.opencode/hooks/goal/lib/goal-core.cjs`, `.opencode/skills/system-deep-loop/runtime/{database/README.md,scripts/README.md,scripts/upsert.cjs,references/integration-points.md}`, `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md`, `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md`, and `.opencode/skills/system-spec-kit/{mcp-server/README.md,references/cli/memory-handback.md}`.

## Findings - New

### P0 Findings
- None. No exploitable security, authorization, or destructive-data-loss condition was established.

### P1 Findings
1. **Live Lane-C fixture gold is omitted from the deprecation inventory and retains retired transport identifiers** -- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:34` and `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-alias-foundations-001.private.json:12` -- The Lane-C loader reads public/private pairs when `--fixtures-dir` is supplied (`run-skill-benchmark.cjs:270-300,310-312,496-498`), and the benchmark command/workflow exposes the fixture corpus as an input (`.opencode/commands/deep/skill-benchmark.md:81-83`; `deep-skill-benchmark-auto.yaml:33-45`). The executed loader check found 43 `sk_design_*` rows with zero load errors; 42 private-gold rows still contain `sk-design-mcp-open-design`/related retired labels. Public prompts are generic design prompts, but the dispatch payload still carries `openDesignLineageDigest` and private gold uses the removed mode as a forbidden route label. The route scorer compares that forbidden list against actual router intents (`score-skill-benchmark.cjs:92-100,977-980`) rather than dereferencing the deleted skill, so deletion should not crash this path, but stale gold and payload fields can preserve an invalid contract and the plan's broad benchmark exclusion leaves the live corpus unclassified.
   - Finding class: `matrix/evidence`
   - Scope proof: `loadFixtures()` recursively discovers `.public.json` files and joins matching `.private.json` files; the whole central corpus was loaded with `sk_design_rows=43` and `loadErrors=0`, and the variant sweep found the retired mode in dispatch and alias gold rather than only in one fixture.
   - Affected surface hints: `["deep-improvement Lane-C fixture loader", "sk-design private gold", "sk-design-dispatch public payloads", "plan live-surface allowlist", "post-removal benchmark rerun"]`
   - Recommendation: Classify these undated central fixtures as live inputs, not dated historical reports. After implementation, regenerate/update the `sk-design` and `sk-design-dispatch` fixture pairs: remove the retired mode from negative gold and remove or replace transport-specific dispatch-payload fields while preserving generic prompts; then run the explicit fixture benchmark and record the result. If the owner intentionally freezes them, list the exact paths as historical and prove no gate invokes them instead of relying on the generic `**/benchmark/**` exclusion.
   - Claim-adjudication:
```json
{
  "type": "correctness",
  "claim": "The deprecation plan can skip central Lane-C fixture pairs as historical even though explicit benchmark runs consume them as public/private gold, and 42 of 43 loaded sk-design rows retain a retired transport label or payload field.",
  "evidenceRefs": [
    ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:270-300",
    ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:310-312",
    ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:496-498",
    ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:92-100",
    ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:977-980",
    ".opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:34",
    ".opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-alias-foundations-001.private.json:12",
    "specs/sk-design/015-deprecate-open-design/plan.md:53-58"
  ],
  "counterevidenceSought": "Read the loader, command/workflow binding, loop-host forwarding, scorer route-gold logic, representative public payload, and private gold; verified the corpus is explicitly consumable, prompts themselves are generic, and the scorer treats the retired mode as a negative label rather than a dereferenced route.",
  "alternativeExplanation": "The corpus may be intended as a frozen historical baseline, but it is undated, tracked under deep-improvement assets, enumerated by the live skill manifest, and the command presents fixture-dir as a benchmark input. A historical decision therefore needs exact-path documentation and a no-consumer proof.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Either regenerate the fixture pairs and prove the explicit post-removal benchmark, or document every exact fixture path as historical and prove no live command/workflow loads it."
}
```

### P2 Findings
- None.

### Carried Active Findings
- `P1-001..P1-014` remain active without severity change. This iteration specifically refined `P1-010`: the six Open Design intent boosters in `skill_advisor.py:2122-2135` are live scorer policy and require removal/genericization; `skill-graph.json` has no direct retired-child node, and its source is `graph-metadata.json`, not `description.json`.

## Traceability Checks

| Protocol | Level | Verdict | Evidence / disposition |
|---|---|---|---|
| `spec_code` | core | partial | The plan names dated benchmark corpora/sqlite as exclusions (`plan.md:53-58`) but does not classify the undated central fixture roots or prescribe their post-removal regeneration; advisor source-vs-derived semantics are now pinned by `system-skill-advisor/README.md:181` and `skill_graph_compiler.py:10-16`. |
| `checklist_evidence` | core | partial | Carried `P1-004`; this iteration did not modify the checklist and no new checklist evidence was claimed. |
| `skill_agent` | overlay | partial | Carried `P1-010`; advisor scorer boosters remain live at `skill_advisor.py:2122-2135`, while graph JSON has no direct child route (`skill-graph.json:1-28`). |
| `agent_cross_runtime` | overlay | pass | No new cross-runtime surface was implicated; prior eight-path parity evidence remains valid. |
| `feature_catalog_code` | overlay | partial | Carried `P1-008`; compiled parity reads the promoted closure/manifest, not dated report folders (`compiled-routing-parity.cjs:78-89`). |
| `playbook_capability` | overlay | partial | Carried `P1-008`/`P1-013`; benchmark reports are archived outputs and runtime graph/index steps are named below. |

### Per-class adjudication

| Class | Verdict | Evidence-backed action |
|---|---|---|
| Central `sk-design/*.private.json` and `sk-design-dispatch/*.private.json` | **LIVE-UPDATE** | Explicit Lane-C runs load public/private pairs. Keep generic prompts, regenerate stale private gold and transport-specific dispatch payload fields after deletion, and rerun with an explicit `--fixtures-dir`. |
| `benchmark/reports/compiled-routing/2026-07-21--*/` reports | **LEAVE-HISTORICAL** | Each skill benchmark README defines `compiled-routing/` as a durable archive (`sk-design/benchmark/README.md:59-63`); the live parity harness reads the promoted closure manifest/runtime engine (`compiled-routing-parity.cjs:78-89`), not report directories. Do not rewrite dated records. |
| `skill-graph.json` + `skill_advisor.py` corpus | **REGENERATE-AFTER** | Remove/genericize the six live boosters. `skill_graph_compiler.py --export-json` compiles from `graph-metadata.json` (usage `skill_graph_compiler.py:10-16`); the advisor explicitly says identity input is `graph-metadata.json`, not `description.json` (`README.md:181`). A `description.json`-only edit does not require graph JSON regeneration; a graph-metadata/tree change does. Then run trusted `advisor_rebuild --force true` or `skill_graph_scan`. |
| `.opencode/skills/.goal-state/.archive/*.json` | **LEAVE-HISTORICAL** | `goal-core.cjs:listArchivedGoals()` only enumerates archive JSONs for history/doctor stats (`goal-core.cjs:625-655`); no routing or benchmark consumer loads them. Leave archive contents intact. |
| SQLite indexes (`context-index`, `deep-loop-graph`, `council-graph`, advisor `skill-graph`) | **REGENERATE-AFTER** | They are derived runtime state. Re-scan context with `memory_index_scan({ specFolder })` (`memory-handback.md:34-37`); rebuild advisor with `advisor_rebuild --trusted --force true` or `skill_graph_scan --trusted` (`skill-graph-drift.md:85-99`); replay review/research `graphEvents` through runtime `upsert.cjs --loop-type review|research` and verify with `status.cjs`/`convergence.cjs` (`state-jsonl.md:121`, `runtime/scripts/upsert.cjs:1-10`, `integration-points.md:67`); replay council artifacts with `replay-graph-from-artifacts.cjs --spec-folder <path> --session-id <id>` and then council `status.cjs`/`convergence.cjs` (`graph-support.md:101-104`). No DB mutation was run in this read-only iteration. |

## Integration Evidence
- `.opencode/commands/deep/skill-benchmark.md:81-83,110-120` and `.opencode/commands/deep/assets/deep-skill-benchmark-auto.yaml:33-45,90-96` expose fixture-dir as a benchmark input; `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:73-78,190-214` forwards it only when explicitly present.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:270-300,310-312,496-498` is the public/private loader and branch; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:92-100,977-980` consumes forbidden route labels as negative gold.
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:10-16,244-246` names the tracked graph compiler/output; `.opencode/skills/system-skill-advisor/README.md:123-142,160-181` names the SQLite scan/rebuild and graph-metadata source contract.
- `.opencode/skills/system-skill-advisor/references/graph/skill-graph-drift.md:35-99` defines detection, `advisor_rebuild`, `skill_graph_scan`, and hard-reset ownership; `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135` confirms P1-010 booster residue.
- `.opencode/skills/sk-design/benchmark/README.md:59-63` and sibling benchmark README archive sections classify dated compiled-routing reports as outputs; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs:78-89` names the live runtime inputs instead.
- `.opencode/hooks/goal/lib/goal-core.cjs:625-655`, `.opencode/skills/system-deep-loop/runtime/database/README.md:12-24`, `.opencode/skills/system-deep-loop/runtime/references/integration-points.md:67-73`, `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md:101-104`, and `.opencode/skills/system-spec-kit/references/cli/memory-handback.md:34-37` establish archive/index ownership and recovery commands.

## Edge Cases
- The command/workflow prose says fixture-dir defaults to a skill-local path, while `loop-host.cjs` forwards `--fixtures-dir` only when supplied and `run-skill-benchmark.cjs` runs the playbook branch when the flag is absent. This does not make the central corpus historical; it means the post-removal verification must pass the canonical central fixture root explicitly and the plan should not claim an unverified default.
- Public prompts in the inspected corpus do not name the retired transport; the transport residue is in dispatch-payload proof fields and private negative gold. The harness reads only `public.prompt` for contamination/router replay, but score gold still carries `forbiddenWorkflowModes`.
- `skill-graph.json` has no direct `sk-design-mcp-open-design` node/route. Its stale risk is source/derived freshness, not direct graph routing; `description.json` is not the graph compiler input.
- Dated reports and goal archives contain runtime/history payloads by design. Their old strings do not establish a live gate consumer.
- Memory/code graph tools were unavailable; direct repository evidence and one local compiler/fixture-loader verification command were used.

## Confirmed-Clean Surfaces
- `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py --validate-only` passed: 11 graph-metadata files discovered; all metadata valid.
- The fixture loader parsed the central corpus with `skDesignRows=43` and `loadErrors=0`; the result is deterministic and confirms the pairs are syntactically consumable.
- No new P0 condition, no direct retired child route in `skill-graph.json`, no live report-folder input path, and no archive-to-routing consumer were found.
- Review target, benchmark reports, fixture files, JSON databases, advisor sources, and runtime code were not modified.

## Ruled Out
- No claim that dated benchmark reports should be rewritten; archive README contracts and live parity source paths support leaving them intact.
- No claim that `.goal-state/.archive` JSONs are loaded by advisor or benchmark routing; goal-core history enumeration is the only observed consumer.
- No claim that editing `sk-design/description.json` alone requires regenerating `skill-graph.json`; the advisor contract names `graph-metadata.json` as the identity source.
- No P0 exploit, auth bypass, secret disclosure, or destructive DB condition established.

## Next Focus
- dimension: traceability
- focus area: final P1-001..P1-015 action matrix, exact plan classification, and implementation-ready post-removal fixture/graph/index verification
- reason: completeness adjudication found one new gate-relevant live-corpus inventory gap; all five requested classes now have explicit verdicts and regeneration/leave actions
- rotation status: completeness sweep C completed conditionally in iteration 008
- blocked/productive carry-forward: productive — preserve P1-001..P1-015; do not retry ruled-out report/archive or description-only graph hypotheses
- required evidence: explicit fixture-path classification or regenerated gold, exact advisor booster cleanup plus graph export/re-scan decision, runtime index regeneration transcripts, and final residue-gate proof

Review verdict: CONDITIONAL