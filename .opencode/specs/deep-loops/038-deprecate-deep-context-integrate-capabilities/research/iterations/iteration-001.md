# Iteration 1: Active `deep-context` Entrypoint Inventory

## Focus
This iteration investigated the prioritized command, YAML, agent, nested skill, mode-registry, command-contract, and configuration surfaces that still expose or run standalone `deep-context`. The selected interpretation was the narrowest active-entrypoint inventory requested by the workflow manager; broader advisor, test, generated metadata, archive, and documentation sweeps are deferred.

## Findings
1. `/deep:context` remains a live public command: its frontmatter advertises the codebase-context loop, exposes `:auto` and `:confirm` modes, allows `Task`, and delegates runtime body rendering through `render-command-contract.cjs --command deep/context`. [SOURCE: .opencode/commands/deep/context.md:1] [SOURCE: .opencode/commands/deep/context.md:4] [SOURCE: .opencode/commands/deep/context.md:9]
2. The command-contract runtime still treats `deep/context` as an active compiled command: `render-command-contract.cjs` maps it to slug `deep_context` and the compiled contract path, while `compile-command-contracts.cjs` maps `/deep:context` to the command file, presentation file, auto/confirm YAML, mode skill, agent, references, templates, and shared mode registry. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:20] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:33] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:40]
3. The presentation contract is an active routing/UX surface for standalone `deep-context`: it says the command router owns mode selection and asset loading, `:auto` loads `deep_context_auto.yaml` after setup bindings, the default pool is two `@deep-context` seats, and the output contract is a `{spec_folder}/context/` packet with context reports and state files. [SOURCE: .opencode/commands/deep/assets/deep_context_presentation.txt:3] [SOURCE: .opencode/commands/deep/assets/deep_context_presentation.txt:19] [SOURCE: .opencode/commands/deep/assets/deep_context_presentation.txt:60] [SOURCE: .opencode/commands/deep/assets/deep_context_presentation.txt:226]
4. Both workflow YAML assets are active standalone loop managers. The auto YAML declares an autonomous iterative loop and binds state paths such as `deep-context-config.json`, `deep-context-state.jsonl`, dashboard, lock, iteration, seats, deltas, and context-report outputs; the confirm YAML declares the same loop with interactive approval gates and the same agent/state path family. [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:26] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:112] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:131] [SOURCE: .opencode/commands/deep/assets/deep_context_confirm.yaml:21] [SOURCE: .opencode/commands/deep/assets/deep_context_confirm.yaml:106]
5. The native analyzer seat exists in two active runtime surfaces: `.opencode/agents/deep-context.md` is the OpenCode canonical subagent with read/write/edit/bash/task denied where appropriate, and `.claude/agents/deep-context.md` mirrors the same read-only seat for Claude Code. [SOURCE: .opencode/agents/deep-context.md:1] [SOURCE: .opencode/agents/deep-context.md:35] [SOURCE: .claude/agents/deep-context.md:1] [SOURCE: .claude/agents/deep-context.md:17]
6. The nested `deep-context` skill package is an active standalone mode packet, not only documentation: its frontmatter names `deep-context`, its triggers include `/deep:context`, its routing model loads mode-specific references/assets, and its process says native seats are dispatched as `@deep-context` Task subagents before host merge, convergence, and Context Report synthesis. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:1] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:28] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:74] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:249]
7. `mode-registry.json` keeps `deep-context` as a first-class workflow mode: `workflowMode` and `runtimeLoopType` are both `context`, the packet is `deep-context`, the command is `/deep:context`, the agent is `deep-context`, the artifact root is `context/`, and aliases still include `deep-context`, `context loop`, and `gather codebase context`. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:20] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:23] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:24] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:27]
8. The standalone config/template surface is active and mode-specific: `deep_context_config.json` hard-codes `loopType: "context"`, default convergence/stuck/relevance thresholds, a by-model shared-scope fanout with two native executors, and `context/context-report.*`, `context/findings-registry.json`, and `context/deep-context-dashboard.md` outputs. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json:4] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json:7] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json:17] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json:25]

## Ruled Out
- A whole-repo `deep-context` reference sweep was not attempted in this iteration because the dispatcher provided exact priority files and the iteration budget was reserved for cited entrypoint classification.
- Generated compiled contracts under `.opencode/commands/deep/assets/compiled/` were not read because the active source mapping is already established by `render-command-contract.cjs` and `compile-command-contracts.cjs` in this focused pass. [INFERENCE: based on .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17 and .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:46]

## Dead Ends
- No dead-end evidence source was exhausted. Candidate for later reducer consideration: treat “manual whole-repo search before source-mapped entrypoints are classified” as low-yield for this focus.

## Edge Cases
- Ambiguous input: The phrase `deep-context/**` could mean every file under the nested skill tree, including feature catalog, benchmarks, manuals, references, scripts, and changelog. This iteration selected active entrypoint files first and deferred non-entrypoint docs/tests/catalogs.
- Contradictory evidence: none found.
- Missing dependencies: none required for this focused entrypoint inventory; code graph and memory were not required because exact paths were supplied.
- Partial success: The priority entrypoint surfaces were classified, but broader advisor, runtime call graph, tests/fixtures, generated metadata, mirrors beyond `.claude/agents`, archives, and non-entrypoint docs remain unclassified.

## Sources Consulted
- .opencode/commands/deep/context.md:1
- .opencode/commands/deep/assets/deep_context_auto.yaml:1
- .opencode/commands/deep/assets/deep_context_confirm.yaml:1
- .opencode/commands/deep/assets/deep_context_presentation.txt:1
- .opencode/agents/deep-context.md:1
- .claude/agents/deep-context.md:1
- .opencode/skills/deep-loop-workflows/mode-registry.json:20
- .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:1
- .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json:1
- .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17
- .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:33

## Assessment
- New information ratio: 1.00
- Questions addressed: Which live command, YAML, agent, nested skill, registry, advisor, runtime, test, and docs surfaces still expose or depend on standalone `deep-context`?
- Questions answered: Priority command/YAML/agent/nested-skill/mode-registry/command-contract/config entrypoints are inventoried and classified as active standalone `deep-context` surfaces.

## Reflection
- What worked and why: Exact-path reads and narrow grep over command/runtime assets worked because the dispatcher supplied the primary surface list, enabling line-cited classification without noisy broad search.
- What did not work and why: This pass did not classify every file under the nested skill subtree because that would dilute the active-entrypoint inventory and exceed a single-iteration evidence budget.
- What I would do differently: In the next pass, run scoped exact-token searches for `workflowMode: context`, `/deep:context`, `deep_context`, `deep-context`, and `loop_type='context'` across advisor, runtime, tests, generated metadata, and docs, then classify each hit by active/runtime versus generated/test/archive.

## Recommended Next Focus
Inventory non-entrypoint connected surfaces: advisor projection/drift guards, runtime fanout/convergence/upsert paths, generated compiled command artifacts, tests/fixtures, documentation mirrors, graph metadata, and historical/archive false positives; classify each as active runtime, generated metadata, test fixture, documentation, mirror, archive, or false positive.
