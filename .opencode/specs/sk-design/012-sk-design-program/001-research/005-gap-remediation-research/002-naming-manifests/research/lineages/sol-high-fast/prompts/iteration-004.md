DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 4 Prompt Pack

Read `.opencode/agents/deep-research.md` first. Execute exactly one LEAF iteration. The spec folder is pre-approved; write only the three detached-lineage outputs listed below.

## STATE

Iteration 4 of 5 | Questions answered 3/5 | Ratios 1.00, 0.94, 1.00 | Stuck 0
Stop policy: max-iterations; convergence remains telemetry.

Established decisions:
- Exact kebab map: `_db -> database`, `_engine -> engine`, `_harness -> harness`, `_manifest.json -> manifest.json`, `_retrieval-manifest.json -> retrieval-manifest.json` for the name-only bridge.
- Final design: one harness-owned `manifest.json` v2 for acquisition state; artifacts own enriched content; a shared pure projector serves engine and DB; no permanent committed retrieval manifest.
- Source identity becomes semantic canonical hash; byte hash is diagnostic only; engine and DB retain purpose-specific versioned generation identities.

Focus: executable cutover validation, rollback, and indirect/runtime-computed consumers. Discover actual package scripts/test commands and dynamic path construction. Produce a phased implementation sequence with baseline evidence, name-only parity gate, v1-to-v2 normalization gate, projection/DB parity, stale-cache handling, bridge deletion criteria, rollback checkpoints, and exact reference-update ordering. Distinguish mutable current docs from frozen history.

Open questions:
- Which imports, runtime paths, scripts, tests, docs, generated references, and indirect consumers change, and in what exact sequence?
- What validation, rollback, and cutover plan proves no retrieval/generation breakage?

Do not retry eliminated architecture designs or combine naming and schema changes into one cutover.

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json
- State: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/findings-registry.json
- Prior narratives: lineage `iterations/iteration-001.md` through `iteration-003.md`
- Write narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-004.md
- Write delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deltas/iter-004.jsonl

## CONTRACT

- Use 3-5 focused research actions, max 12 tool calls. Read target files only; do not execute implementation or mutating tests.
- Write only narrative, one canonical iteration-4 append, and delta.
- Required narrative headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out, Dead Ends, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- Cite every finding. Name exact commands only when confirmed from package/script files; label inferred commands as inferred.
- Canonical record includes route proof, `iteration=4`, `run=4`, status, focus, findingsCount, newInfoRatio/justification, key/answered questions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs.
- Delta first line matches canonical record. Verify one state append, artifacts, citations, and boundary.
- Iteration 5 must be a critical consistency/adversarial pass over all prior findings, not early synthesis.
