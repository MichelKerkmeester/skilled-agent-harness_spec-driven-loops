DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 3 Prompt Pack

Read `.opencode/agents/deep-research.md` first. Execute exactly one LEAF iteration with lineage-only writes. The spec folder is pre-approved.

## STATE

Iteration 3 of 5 | Questions answered 2/5 | Ratios 1.00 -> 0.94 | Stuck 0
Next focus: design the target single-source architecture and migration consequences from the proven split field ownership.
Stop policy: max-iterations; do not synthesize before iteration 5.

Prior evidence:
- Iteration 1 fixed the five-path kebab rename and 46-file live reference closure.
- Iteration 2 proved crawl JSON is mutable acquisition state, retrieval JSON is a closed deterministic projection, artifact files own enriched content, and the DB indexer independently consumes crawl plus artifacts.
- Both files have identical 1,290-slug membership. Current `crawlManifestHash` is exact-byte sensitive; retrieval generation and publication are deterministic and guarded.

Focus this pass on a concrete consolidation design: canonical input ownership, whether one physical manifest can support separate writers, derived projection boundaries, schema versioning, semantic versus byte hashes, provenance, stale detection, deterministic regeneration, and engine/database compatibility. Compare at least two viable designs and eliminate weaker ones with repository evidence.

Remaining key questions:
- Which imports/references and migration sequence are required?
- Which manifest should be canonical, which data derived, and how should hashes/provenance/regeneration work?
- What validation, rollback, and cutover proof is required?

Do not retry: literal schema union; retrieval JSON as current DB source; crawl row order as semantic; retrieval canonicality based only on richness; combined naming/schema cutover.

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json
- State: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/findings-registry.json
- Prior iterations: same lineage `iterations/iteration-001.md` and `iteration-002.md`
- Write narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-003.md
- Write delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deltas/iter-003.jsonl

## CONTRACT

- Research 3-5 focused actions, max 12 calls. Target files are read-only; implement nothing.
- Write only the iteration narrative, one canonical iteration-3 state append, and the delta.
- Use required narrative headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out, Dead Ends, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- Cite every finding. Include an exact recommended schema/ownership model rather than generic advice.
- State/delta first record fields: canonical iteration route proof; `iteration=3`, `run=3`; status, focus, findingsCount, newInfoRatio and justification, key/answered questions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs.
- Delta first line matches canonical record. Verify exactly one state append, all artifacts, citations, and write boundary.
- Recommend a broader fourth-pass focus on executable cutover validation, rollback, and hidden/indirect consumers.
