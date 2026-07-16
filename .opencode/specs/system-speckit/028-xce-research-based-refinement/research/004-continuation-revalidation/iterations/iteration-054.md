# Iteration 054: Deep-Research Reducer/State Hygiene

## Focus
Investigated stale registry and research-synthesis risks and proposed an official reducer/state repair model that preserves history instead of rewriting it.

## Findings
1. Deep-research state has split ownership: the agent writes iteration markdown and one structured record, while the workflow reducer owns strategy machine sections, findings registry, and dashboard; manual repair should respect that boundary. [SOURCE: .opencode/skills/deep-research/references/state/state_format.md:34-44] [SOURCE: .opencode/skills/deep-research/references/state/state_format.md:68-78]
2. The JSONL log is explicitly append-only and is the richest machine-readable packet surface; malformed lines are skipped by readers, and reconstruction from iteration files is an explicit recovery path when the log is damaged. [SOURCE: .opencode/skills/deep-research/feature_catalog/state-management/008-jsonl-state-log.md:18-29]
3. Reducer state refresh is designed to be idempotent: `reduceResearchState` reads config, state log, strategy, iteration files, and deltas, then rebuilds registry, strategy, dashboard, and optionally resource-map output. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:886-925] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:938-988]
4. The reducer already has a fail-closed corruption mode: detailed JSONL parsing records corrupt lines, throws `STATE_CORRUPTION` unless lenient mode is requested, and exposes corruption warnings in the registry. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:84-119] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:141-153] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:944-956]
5. Progressive synthesis is intentionally provisional: agents may update `research.md` only under config control, but final workflow synthesis reads all iterations and strategy, deduplicates, fills empty sections, and preserves machine-owned markers. [SOURCE: .opencode/skills/deep-research/feature_catalog/research-output/015-progressive-synthesis.md:24-41] [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1006-1024]
6. Negative knowledge is a first-class repair input: iteration files and JSONL records carry `Ruled Out`/`Dead Ends`, and the reducer promotes them into strategy/registry so stale synthesis should be repaired by replaying raw artifacts, not by editing only `research.md`. [SOURCE: .opencode/skills/deep-research/feature_catalog/research-output/016-negative-knowledge.md:24-41]

## Proposed Official Repair Model
- Freeze raw history: never rewrite existing JSONL, deltas, or iteration files during repair.
- Run a reducer dry/read phase that parses state and deltas, enumerates corruption warnings, missing iteration/delta pairs, duplicate runs, and synthesis freshness.
- If raw JSONL has corruption, append a repair event or use a reducer-owned sidecar report; do not delete the corrupt line unless an explicit archival migration is approved.
- Rebuild derived files from raw artifacts: registry, strategy anchors, dashboard, resource-map, and final `research.md`.
- Mark stale synthesis when generated output predates later iteration/delta records or omits cited sources that appear in deltas.

## Ruled Out
- Directly editing `findings-registry.json`, strategy, or dashboard was ruled out because those surfaces are reducer-owned and regenerated from raw iteration/state inputs. [SOURCE: .opencode/skills/deep-research/references/state/state_format.md:68-78]
- Repairing staleness by rewriting `research.md` alone was ruled out because final synthesis must read all iterations and strategy and preserve machine-owned markers. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1006-1024]

## Dead Ends
- Treating malformed JSONL as harmless by default is unsafe: reducer code throws unless `--lenient` is passed, so the official repair path should make leniency explicit and auditable. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:84-90] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:954-956]

## Edge Cases
- Ambiguous input: "state hygiene" could target shared state logs or per-iteration deltas. I focused on official reducer repair for derived stale surfaces and raw-history preservation.
- Contradictory evidence: feature docs say malformed lines are skipped with defaults, while reducer code throws unless lenient. Resolution: readers may tolerate damage, but official reducer repair should fail closed unless explicitly lenient. [SOURCE: .opencode/skills/deep-research/feature_catalog/state-management/008-jsonl-state-log.md:26-29] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:84-90]
- Missing dependencies: no shared state append was allowed in this parallel fallback, so only per-iteration deltas were written.
- Partial success: complete repair design; no reducer-owned files were modified.

## Sources Consulted
- .opencode/skills/deep-research/references/state/state_format.md:34-44
- .opencode/skills/deep-research/references/state/state_format.md:68-78
- .opencode/skills/deep-research/feature_catalog/state-management/008-jsonl-state-log.md:18-29
- .opencode/skills/deep-research/scripts/reduce-state.cjs:84-153
- .opencode/skills/deep-research/scripts/reduce-state.cjs:886-988
- .opencode/skills/deep-research/feature_catalog/research-output/015-progressive-synthesis.md:24-41
- .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1006-1024
- .opencode/skills/deep-research/feature_catalog/research-output/016-negative-knowledge.md:24-41

## Assessment
- New information ratio: 0.88
- Questions addressed: 054 reducer/state hygiene
- Questions answered: official repair should replay immutable raw artifacts into derived outputs and append/report repair metadata rather than corrupting history.

## Reflection
- What worked and why: Comparing state docs with reducer code surfaced the exact fail-closed versus lenient distinction.
- What did not work and why: This fallback could not run the shared reducer because the write boundary forbids reducer-owned files.
- What I would do differently: In a reducer-owned phase, run `reduce-state.cjs --lenient` on a fixture with corrupt JSONL and verify derived outputs plus warnings.

## Recommended Next Focus
Define a reducer-owned `repair-state` mode that validates raw artifacts, emits an audit report, rebuilds derived files idempotently, and never rewrites historical JSONL/delta/iteration records.
