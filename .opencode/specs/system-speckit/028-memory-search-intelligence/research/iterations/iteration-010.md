# Iteration 10: Deep-Loop and SpecKit Workflow References for Memory Reliability Assumptions

## Focus

This iteration broadened from iteration 9's command/agent/skill-reference audit into deep-loop and SpecKit workflow references for memory-search reliability assumptions. It inspected `/speckit:resume`, `/memory:save`, and `/deep:research` command assets for whether they treat memory retrieval, daemon freshness, and indexing as reliable, advisory, deferred, or fallback-based.

Ambiguity note: the focus could include every deep-loop mode. I selected the narrower evidence-backed interpretation requested by iteration 9: `/speckit:resume`, memory-save/generate-context guidance, and deep-research prompt/state assets. Deep-review and AI-council references remain deferred.

## Findings

1. `/speckit:resume` is strongly aligned with post-016 reliability lessons: its context priority is handover, `_memory.continuity`, supporting spec docs, graph metadata hints, then `session_bootstrap()`/`memory_context()`, and finally anchored `memory_search()`; it explicitly says MCP enrichment is only for thin canonical packets. [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:87] [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:151]
2. `/speckit:resume` also has explicit transport and failure fallback semantics: the warm-only CLI is a retryable backend fallback, the file ladder needs no MCP, failed memory search proceeds only with essentials already recovered, and the visible presentation says to prefer the canonical file ladder before supplemental memory enrichment. [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:105] [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:212] [SOURCE: .opencode/commands/speckit/assets/speckit_resume_presentation.txt:57]
3. `/memory:save` is current for durability-vs-retrieval freshness separation: the router says `generate-context.js` handles metadata/description/graph refresh, immediate visibility may use `memory_index_scan`, and the presentation explicitly labels deferred indexing honestly instead of claiming retrieval freshness. [SOURCE: .opencode/commands/memory/save.md:28] [SOURCE: .opencode/commands/memory/save.md:38] [SOURCE: .opencode/commands/memory/assets/save_presentation.txt:84]
4. `/deep:research` has an asymmetry: startup context loading calls `memory_context` and defines `if_context_found`/`if_no_context`, but the inspected startup block lacks the later loop's explicit MCP error/timeout fallback. The same auto asset later makes `step_refresh_memory_context` non-fatal on MCP error/timeout, and the manual playbook expects per-iteration MCP errors to be advisory. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:51] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:59] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1154] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/manual_testing_playbook.md:683]
5. Deep-research delta path references are internally risky: the auto YAML declares `delta_pattern: {artifact_dir}/deltas/iter-{NNN}.jsonl` and validates that path, while this packet's orchestrator/user contract and existing artifacts use `deltas/iteration-009.jsonl` and now `deltas/iteration-010.jsonl`. This is a command-asset vs packet-runner naming mismatch that can produce false `delta_file_missing` failures if the verifier follows the YAML literally. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:111] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1039] [INFERENCE: based on the current dispatch requirement for `research/deltas/iteration-010.jsonl` and existing packet-local `research/deltas/iteration-009.jsonl`]

## Ruled Out

- Treating `/speckit:resume` as memory-first was ruled out; both execution and presentation assets prefer canonical file recovery before supplemental memory enrichment. [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:89] [SOURCE: .opencode/commands/speckit/assets/speckit_resume_presentation.txt:57]
- Treating `/memory:save` as claiming immediate retrieval freshness was ruled out; it separates durable save output from deferred/failed indexing and immediate refresh paths. [SOURCE: .opencode/commands/memory/save.md:29] [SOURCE: .opencode/commands/memory/assets/save_presentation.txt:88]

## Dead Ends

- Deep-review graphless fallback surfaces were discovered but not investigated in this iteration because they are review-specific, not memory-save/resume/deep-research reliability references. They remain a possible later audit path for cross-mode fallback consistency. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md:13]

## Edge Cases

- Ambiguous input: “deep-loop and spec-kit workflow references” could include every deep-loop mode. I selected the narrower `/speckit:resume`, `/memory:save`, and `/deep:research` slice and deferred deep-review/AI-council.
- Contradictory evidence: `/deep:research` later memory refresh is explicitly advisory, while startup memory_context lacks an equivalent inspected failure policy. This is an intra-asset asymmetry rather than proof startup currently blocks in all runtimes.
- Missing dependencies: Code graph remained stale/untrusted; direct `Read`, `Glob`, and `Grep` evidence was used instead. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: This iteration inspected representative workflow references, not every command or deep-loop sibling.

## Sources Consulted

- `.opencode/commands/speckit/assets/speckit_resume_auto.yaml:87`
- `.opencode/commands/speckit/assets/speckit_resume_auto.yaml:105`
- `.opencode/commands/speckit/assets/speckit_resume_auto.yaml:151`
- `.opencode/commands/speckit/assets/speckit_resume_auto.yaml:212`
- `.opencode/commands/speckit/assets/speckit_resume_presentation.txt:57`
- `.opencode/commands/memory/save.md:28`
- `.opencode/commands/memory/save.md:38`
- `.opencode/commands/memory/assets/save_presentation.txt:84`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:51`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:59`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:111`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:1039`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:1154`
- `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/manual_testing_playbook.md:683`
- `.opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md:13`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which command/workflow references describe outdated or missing behavior?
  - Where does implemented or expected behavior lack corresponding workflow-reference coverage?
  - Which misalignments affect command routing, MCP/tool contracts, memory retrieval, or deep-loop workflows?
- Questions answered:
  - `/speckit:resume` and `/memory:save` are mostly aligned with fallback/deferred-freshness semantics.
  - `/deep:research` has a startup-vs-iteration fallback asymmetry for `memory_context` failures.
  - Deep-research delta naming in command assets is misaligned with this packet's `iteration-NNN.jsonl` delta artifacts.

## Reflection

- What worked and why: Grep-to-targeted-read worked because the key issue was workflow-reference semantics rather than implementation behavior.
- What did not work and why: Broad deep-loop grep produced many review/council fallback hits; only a subset was in-scope for this memory reliability pass.
- What I would do differently: Next pass should audit deep-review and AI-council sibling fallback contracts for whether they learned from memory/code-graph unreliability or still allow false-safe success.

## Recommended Next Focus

Audit deep-review and AI-council fallback/staleness contracts for cross-mode consistency: graphless fallback gates, memory_context startup failure behavior, stale graph/status recovery payloads, and whether command assets prevent false-safe success when MCP sources are unavailable.
