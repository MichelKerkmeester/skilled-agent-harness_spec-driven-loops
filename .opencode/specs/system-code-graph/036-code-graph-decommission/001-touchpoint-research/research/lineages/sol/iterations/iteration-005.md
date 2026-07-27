# Iteration 5: Agent grants and command workflows

## Focus

Enumerated canonical agent permissions, runtime mirrors, command allowlists, doctor routes, workflow assets, and generated command contracts that expose structural graph tools.

## Actions Taken

1. Re-read config, state, and strategy.
2. Swept canonical and runtime agent definitions with `rg --hidden --no-ignore`.
3. Compared inode/symlink identity across OpenCode, Claude, Codex, and Cursor agent surfaces.
4. Swept command Markdown, YAML, presentation, doctor, memory, create, deep-loop, and Spec Kit command assets.

## Findings

1. Four canonical OpenCode agents grant graph tools directly: `context` grants query/context/status; `deep-research`, `deep-review`, and `deep-alignment` grant query/context. Remove these permissions and rewrite their routing sequences around exact search, file discovery, and direct reads. [SOURCE: .opencode/agents/context.md:15] [SOURCE: .opencode/agents/deep-research.md:15] [SOURCE: .opencode/agents/deep-review.md:15] [SOURCE: .opencode/agents/deep-alignment.md:15]
2. All eight canonical agents mention `mk-code-index`, `mcp__mk_code_index__*`, or the CLI fallback in operational prose, including agents without direct grants. The affected canonical set is `ai-council`, `context`, `debug`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`, and `review`. [SOURCE: .opencode/agents/ai-council.md:134] [SOURCE: .opencode/agents/debug.md:357] [SOURCE: .opencode/agents/deep-improvement.md:72] [SOURCE: .opencode/agents/review.md:103]
3. Runtime agent surfaces are not one physical file set. `.opencode/agents/*`, `.claude/agents/*`, and `.codex/agents/*.toml` are regular-file mirrors; `.cursor/agents/*` are symlinks. Update the canonical definitions, run the agent-mirror generator, and verify all three regular-file projections; editing Cursor aliases separately is redundant. [SOURCE: .claude/SYNC.md:1] [SOURCE: .opencode/agents/context.md:1] [SOURCE: .codex/agents/context.toml:1]
4. Direct command allowlists expose graph MCP tools in at least these command entrypoints: `deep/research.md`, `deep/review.md`, `deep/alignment.md`, `deep/ai-council.md`, `deep/command-benchmark.md`, `speckit/plan.md`, `memory/search.md`, and `doctor/update.md`. Each must remove nonexistent tool IDs before the MCP registration disappears. [SOURCE: .opencode/commands/deep/research.md:4] [SOURCE: .opencode/commands/deep/review.md:4] [SOURCE: .opencode/commands/deep/alignment.md:4] [SOURCE: .opencode/commands/deep/ai-council.md:5] [SOURCE: .opencode/commands/deep/command-benchmark.md:4] [SOURCE: .opencode/commands/speckit/plan.md:4] [SOURCE: .opencode/commands/memory/search.md:4] [SOURCE: .opencode/commands/doctor/update.md:4]
5. The doctor surface has a dedicated route and workflow (`doctor-code-graph.yaml`) plus graph branches in `_routes.yaml`, `speckit.md`, `doctor-update.yaml`, update presentation, MCP install/debug YAMLs, MCP presentation, and `mcp-doctor.sh`. Remove the dedicated route, prune mixed routers, and retain non-graph doctor services. [SOURCE: .opencode/commands/doctor/assets/doctor-code-graph.yaml:7] [SOURCE: .opencode/commands/doctor/assets/doctor-mcp-install.yaml:143] [SOURCE: .opencode/commands/doctor/assets/doctor-mcp-debug.yaml:145] [SOURCE: .opencode/commands/doctor/scripts/mcp-doctor.sh:368]
6. Create-command auto/confirm YAMLs repeat the same graph-first `code_search_note` across agent, benchmark, changelog, feature-catalog, manual-playbook, README, skill, and skill-parent generation. Replace the shared doctrine in every paired asset or, preferably, update the source/template that generates them and regenerate. [SOURCE: .opencode/commands/create/assets/create-changelog-auto.yaml:79] [SOURCE: .opencode/commands/create/assets/create-feature-catalog-auto.yaml:68] [SOURCE: .opencode/commands/create/assets/create-skill-confirm.yaml:71]
7. Deep-research/review presentations and command docs tell operators to use graph queries; deep-review’s `graphlessFallbackGate` already defines a direct-read/exact-grep fallback and can become the default, while its internal coverage-graph convergence remains intact. [SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:255] [SOURCE: .opencode/commands/deep/assets/deep-review-presentation.txt:317] [SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:624]
8. Memory command documentation counts four graph tools and `/memory:search` grants query/context. Remove those counts/grants and update the search routing contract; memory tools themselves remain. [SOURCE: .opencode/commands/memory/README.txt:231] [SOURCE: .opencode/commands/memory/README.txt:276] [SOURCE: .opencode/commands/memory/search.md:4]
9. Compiled deep-command contracts and legacy projections repeat these declarations. They are generated artifacts: regenerate or remove stale projections after editing authorities, then verify no `mcp__mk_code_index` remains in compiled contracts. [SOURCE: .opencode/commands/deep/assets/compiled/deep-research.contract.md:1] [SOURCE: .opencode/commands/deep/assets/compiled/deep-review.contract.md:1]

## Questions Answered

- Identified direct graph grants and operational prose across all canonical agents.
- Identified command allowlists, doctor routes, create/deep/memory workflows, and generated mirrors.

## Questions Remaining

- Live doctrine and install/reference documentation.
- Archival inventory boundary.
- Ordered execution, validation, and rollback.

## Ruled Out

- Editing only one runtime’s agent files.
- Deleting doctor/update or Git/CI shared workflows wholesale.
- Removing deep-loop coverage-graph convergence because agent structural search is retired.
- Leaving compiled command contracts stale after source edits.

## Dead Ends

- File-counting runtime mirrors without checking identity would overcount Cursor symlinks and undercount regular Claude/Codex projections.

## Edge Cases

- Ambiguous input: generated command/agent mirrors versus their authoring sources.
- Contradictory evidence: none.
- Missing dependencies: exact mirror-generation command still needs confirmation during implementation.
- Partial success: the affected surfaces are complete by exact-token sweep, but generator ownership must be verified before edits.

## Sources Consulted

- `.opencode/agents/context.md:15`
- `.opencode/agents/deep-research.md:15`
- `.opencode/agents/deep-review.md:15`
- `.opencode/agents/deep-alignment.md:15`
- `.opencode/commands/deep/research.md:4`
- `.opencode/commands/speckit/plan.md:4`
- `.opencode/commands/memory/search.md:4`
- `.opencode/commands/doctor/update.md:4`
- `.opencode/commands/doctor/assets/doctor-code-graph.yaml:7`
- `.opencode/commands/create/assets/create-changelog-auto.yaml:79`

## Assessment

- New information ratio: 0.86
- Novelty: eight findings were new; one refined generated-mirror handling.
- Questions addressed: agent grants, command workflows, generated projections.
- Questions answered: agent and command exposure inventory.

## Reflection

- What worked and why: inode/type comparison distinguished true edits from symlink aliases.
- What did not work and why: exact mirror-generation ownership was not explicit in the files sampled.
- What I would do differently: make generator discovery a validation step in the implementation plan rather than guessing.

## Recommended Next Focus

Inventory live doctrine, README/install-guide claims, skill catalogs, environment references, and operator guidance outside archival records.
