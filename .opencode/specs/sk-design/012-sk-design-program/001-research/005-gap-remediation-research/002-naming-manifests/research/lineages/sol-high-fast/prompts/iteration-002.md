DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 2 Prompt Pack

Read `.opencode/agents/deep-research.md` first. Execute exactly ONE LEAF iteration. The spec folder is pre-approved. All writes are restricted to the three listed detached-lineage artifacts.

## STATE

Segment: 1 | Iteration: 2 of 5 | Questions: 1/5 answered
Last focus: naming authority, five-path map, and 46-file direct-reference closure
Last ratios: N/A -> 1.00 | Stuck count: 0
Next focus: Map every field, invariant, and lifecycle role in both manifest schemas, including writer ownership and ordering guarantees.
Stop policy: max-iterations; convergence is telemetry only before iteration 5.

Research Topic: kebab-case migration for `_db`, `_engine`, `_harness`, `_manifest.json`, and `_retrieval-manifest.json`, plus consolidation of the two 1,290-style manifests into one source of truth.

Remaining Key Questions:
- Which imports, path literals, scripts, tests, documentation, configuration, and generated references must change, and in what safe sequence?
- What fields, invariants, and lifecycle roles differ between the crawl manifest and retrieval manifest schemas?
- Which manifest should be canonical, which data should be derived, and how should hashes, provenance, and deterministic regeneration work?
- What validation, rollback, and cutover plan proves the rename and consolidation do not break existing retrieval or generation paths?

Prior result: iteration 1 fixed the exact rename map and found 140 direct occurrences in 46 live files. It deliberately did not choose a canonical manifest because `crawlManifestHash` signals that retrieval output is currently derived.

Do not retry: treating underscore paths as exempt; rewriting frozen history; combining name-only and schema cutovers; choosing retrieval manifest merely because it is richer; broad bare-token searches.

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/findings-registry.json
- Prior narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-001.md
- Write narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-002.md
- Write delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deltas/iter-002.jsonl

## CONSTRAINTS AND OUTPUT

- Read state first; research target files are read-only; do not implement fixes.
- Perform 3-5 focused actions, max 12 tool calls. Trace both manifest writers/readers and hash/order logic, not just sample JSON.
- Write only `iteration-002.md`, append one canonical iteration-2 record to the state log, and create `iter-002.jsonl`.
- Do not modify config, strategy, registry, dashboard, research.md, specs, source files, or anything outside the lineage.
- Narrative headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out, Dead Ends, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- Every finding needs a source or inference citation.
- Canonical state/delta record must include `type=iteration`, `iteration=2`, `run=2`, `mode=research`, route proof fields, status, focus, findingsCount, newInfoRatio, noveltyJustification, keyQuestions, answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs, and optional valid graphEvents.
- The delta first line must match the canonical iteration record. Verify exactly one iteration append and all three artifacts before returning.
- Broaden the next focus after this schema/lifecycle pass; do not synthesize early.
