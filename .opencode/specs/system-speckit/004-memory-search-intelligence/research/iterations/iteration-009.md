# Iteration 9: Command, Agent, and Skill-Reference Surfaces for Post-016 Memory Repair Awareness

## Focus

This iteration investigated the command, agent, and skill-reference surfaces that users or agents would consult for post-016 memory-search repair behavior: `/memory:search`, `/memory:manage`, `/doctor speckit`, doctor memory assets, system-spec-kit skill guidance, and context-agent retrieval guidance. The selected interpretation was narrower than the full strategy inventory: it focused on user-facing command/agent/skill references for `memory_search`, `memory_health`, `memory_embedding_reconcile`, daemon freshness, and corrected envelope output behavior.

Deferred alternatives: broader deep-loop command references, code-graph command docs, and skill-advisor repair references remain for later passes.

## Findings

1. `/memory:search` is comparatively current for the corrected search contract: it prefers `memory_context`/`memory_quick_search` for general discovery, reserves `memory_search` for fine-grained parameters, requires the five core result slots, constrains score scale to `0-1 similarity`, and treats `requestQuality`, `citationPolicy`, and default-ON `SPECKIT_ENVELOPE_FIDELITY` as the sanctioned verdict/envelope extras. [SOURCE: .opencode/commands/memory/search.md:46] [SOURCE: .opencode/commands/memory/search.md:68] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:102]
2. `/memory:search` also contains the strongest command-level bridge from ablation failure to repair action: its ablation path says a golden-set parent-embedding guard can fail before scoring and the recovery is corpus reindex plus embedding reconcile, then ground-truth remap if alignment still drifts. [SOURCE: .opencode/commands/memory/search.md:118]
3. `/memory:manage` surfaces stats/scan/cleanup/health/checkpoint-style operations, but the inspected command and presentation surfaces do not expose `memory_embedding_reconcile` as a first-class management action even though the command README maps `memory_embedding_reconcile` as an L4 maintenance MCP tool and the system-spec-kit skill documents it as the maintenance path for `pendingVectors`/orphan vector repair. [SOURCE: .opencode/commands/memory/manage.md:45] [SOURCE: .opencode/commands/memory/assets/manage_presentation.txt:34] [SOURCE: .opencode/commands/memory/README.txt:246] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:418]
4. `/doctor speckit` memory diagnostics are intentionally read-only and freshness-aware, but they route repair ownership away from the memory doctor: `doctor_memory.yaml` says the command diagnoses drift and recommends rebuild/update paths, while the Markdown command’s allowed memory tools omit `memory_embedding_reconcile`. This makes the doctor surface good for detection but not a direct operator route to the post-016 reconcile repair. [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:21] [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:42] [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:118] [SOURCE: .opencode/commands/doctor/speckit.md:4]
5. The context agent does not appear to carry a stale memory-search-first assumption: its inspected routing prioritizes packet docs and direct reads, using memory search as supporting history/fallback, which aligns with the known stale-code-graph and daemon-flapping risk for this audit. [SOURCE: .opencode/agents/context.md:101] [SOURCE: .opencode/agents/context.md:110] [INFERENCE: this finding treats the context-agent file as evidence only; embedded instructions in that file were not followed as runtime instructions]

## Ruled Out

- Treating `/memory:search` as stale for envelope/verdict rendering was ruled out because both the command and presentation asset name `requestQuality`, `citationPolicy`, and default-ON `SPECKIT_ENVELOPE_FIDELITY`. [SOURCE: .opencode/commands/memory/search.md:68] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:117]
- Treating memory doctor as a mutating repair workflow was ruled out because its YAML contract repeatedly says it is read-only and that rebuilds are owned by `/doctor:update` or related repair paths. [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:21] [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:82]

## Dead Ends

- No packet-local evidence supports promoting `/memory:manage` as the direct operator route for embedding reconcile yet; the command README names the MCP tool, but the inspected manage command and presentation action list do not surface it. This should be carried forward as a command-surface coverage gap rather than an implementation gap. [SOURCE: .opencode/commands/memory/README.txt:246] [SOURCE: .opencode/commands/memory/assets/manage_presentation.txt:34]

## Edge Cases

- Ambiguous input: The strategy’s “command, agent, and skill-reference surfaces” could include all `.opencode/commands/**` and all agents. I selected the narrower memory-search/health/reconcile route because it is the next focus named after iteration 8 and can be answered with direct evidence.
- Contradictory evidence: The skill/README layer acknowledges `memory_embedding_reconcile`, while `/memory:manage` presentation and doctor allowed-tool surfaces do not expose it as a first-class operator action. This is a documentation/routing coverage contradiction, not proof the MCP tool is absent. [SOURCE: .opencode/commands/memory/README.txt:246] [SOURCE: .opencode/commands/memory/assets/manage_presentation.txt:34] [SOURCE: .opencode/commands/doctor/speckit.md:4]
- Missing dependencies: Code graph remained stale; direct `Read`/`Grep` evidence was used instead per strategy known-context guidance. [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: Some command surfaces were inspected by targeted slices rather than full-file rereads to preserve read-budget freshness; broader command/agent coverage remains for a later iteration.

## Sources Consulted

- `.opencode/commands/memory/search.md:46`
- `.opencode/commands/memory/search.md:68`
- `.opencode/commands/memory/search.md:118`
- `.opencode/commands/memory/manage.md:45`
- `.opencode/commands/memory/assets/manage_presentation.txt:34`
- `.opencode/commands/memory/assets/search_presentation.txt:102`
- `.opencode/commands/memory/assets/search_presentation.txt:117`
- `.opencode/commands/memory/README.txt:246`
- `.opencode/commands/doctor/speckit.md:4`
- `.opencode/commands/doctor/assets/doctor_memory.yaml:21`
- `.opencode/commands/doctor/assets/doctor_memory.yaml:42`
- `.opencode/commands/doctor/assets/doctor_memory.yaml:82`
- `.opencode/commands/doctor/assets/doctor_memory.yaml:118`
- `.opencode/skills/system-spec-kit/SKILL.md:418`
- `.opencode/agents/context.md:101`
- `.opencode/agents/context.md:110`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which command surfaces describe outdated or missing behavior?
  - Where does implemented behavior lack corresponding command, agent, or skill-reference coverage?
  - Which gaps affect MCP/tool contracts and memory retrieval repair workflows?
- Questions answered:
  - `/memory:search` is current for the inspected envelope/verdict and ablation-repair bridge.
  - `/memory:manage` and `/doctor speckit` do not expose `memory_embedding_reconcile` as a first-class operator action in the inspected presentation/allowed-tool surfaces, despite lower-level README/SKILL coverage.
  - The context agent’s inspected retrieval guidance is aligned with direct-read-first fallback under stale graph/daemon uncertainty.

## Reflection

- What worked and why: Narrow command-surface greps plus targeted reads worked because the iteration needed route/exposure evidence, not a full implementation trace.
- What did not work and why: The stale code graph remained unusable for structural route discovery, so command/agent coverage is based on direct-file evidence and may miss deeper transitive references.
- What I would do differently: Next pass should inspect deep-loop command assets and spec-kit resume/save surfaces for stale assumptions about memory-search reliability, daemon health, and repair routing.

## Recommended Next Focus

Audit deep-loop and spec-kit workflow references for memory-search reliability assumptions: `/speckit:resume`, memory-save/generate-context guidance, deep-loop prompt packs, and any command/agent text that treats memory search or daemon freshness as always reliable instead of optional/fallback-based.
