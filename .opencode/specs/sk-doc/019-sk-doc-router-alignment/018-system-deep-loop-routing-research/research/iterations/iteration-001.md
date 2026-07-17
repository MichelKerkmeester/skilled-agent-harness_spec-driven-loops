# Iteration 1: Workflow Modes, Owning Packets, and Typed-Pair Surface

## Focus

Map all seven `workflowMode` values to their five owning child packets, identify the current child-relative leaf-resource coordinates, and derive the packet-qualified typed-pair surface. This follows the strategy's explicit next focus and addresses the first remaining key question.

## Actions Taken

1. Verified that the required iteration narrative and delta did not already exist, then enumerated the hub and five child packets.
2. Read the hub registry and hub routing contract to establish the authoritative seven-mode/five-packet mapping.
3. Searched all child `SKILL.md` routers for defaults, intent maps, and child-relative resource coordinates.
4. Compared exact resource IDs across child packets to identify collisions and shared-packet ambiguity.
5. Read the focused router sections in all five child packets to verify the resource families and line-level anchors.

## Findings

1. The authoritative mode-to-packet map is: `research → deep-research`, `review → deep-review`, `ai-council → deep-ai-council`, `agent-improvement → deep-improvement`, `model-benchmark → deep-improvement`, `skill-benchmark → deep-improvement`, and `alignment → deep-alignment`. The registry also establishes that the first three plus alignment use the runtime-loop backend, while all three improvement modes use the improvement host. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:29-197] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:46-49]
2. Each child router currently emits leaf IDs relative to its own `SKILL_ROOT`, such as `references/guides/quick_reference.md` for research, `references/protocol/quick_reference.md` for review, `references/integration/quick_reference.md` for AI Council, `references/shared/quick_reference.md` for improvement, and `references/scoping_protocol.md` for alignment. These are valid locally but omit the owning packet when compared at hub scope. [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:102-112] [SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:98-104] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:136-143] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:97-103] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:85-90]
3. Exact child-relative collisions already exist: research and review both route `references/protocol/loop_protocol.md`, `references/state/state_outputs.md`, and `references/convergence/convergence_signals.md`. Therefore a hub-level gold label containing only the leaf ID cannot identify the owner. [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:124-132] [SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:119-148]
4. The three improvement workflow modes create a second ambiguity dimension because they share one packet. Their lane-specific surfaces separate only inside the child resource maps: agent-oriented resources occupy `references/agent_improvement/**`, model benchmarking uses `references/model_benchmark/**`, and skill benchmarking uses `references/skill_benchmark/**` plus corresponding packet-local assets. Packet qualification alone identifies `deep-improvement` but does not preserve which public workflow mode selected it. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:102-172] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:104-131]
5. The implied typed-gold coordinate is a pair of the public mode and a packet-qualified leaf: `(workflowMode, <packet>/<child-relative-resource>)`. Examples are `(research, deep-research/references/protocol/loop_protocol.md)`, `(review, deep-review/references/protocol/loop_protocol.md)`, and `(skill-benchmark, deep-improvement/references/skill_benchmark/scoring_contract.md)`. This preserves both collision-free resource identity and the three improvement lanes, while retaining the registry as the source of packet ownership. [INFERENCE: based on .opencode/skills/system-deep-loop/mode-registry.json:29-197 and the child router coordinates at .opencode/skills/system-deep-loop/deep-research/SKILL.md:124-132, .opencode/skills/system-deep-loop/deep-review/SKILL.md:119-148, and .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:116-131]

### Seven-Mode Typed-Pair Surface

| `workflowMode` | Owning packet | Current child-relative surface | Packet-qualified typed-pair form |
| --- | --- | --- | --- |
| `research` | `deep-research` | `references/guides/**`, `references/protocol/**`, `references/state/**`, `references/convergence/**`, `assets/**` | `(research, deep-research/<leaf>)` |
| `review` | `deep-review` | `references/protocol/**`, `references/state/**`, `references/convergence/**`, `assets/**` | `(review, deep-review/<leaf>)` |
| `ai-council` | `deep-ai-council` | `references/integration/**`, `references/patterns/**`, `references/convergence/**`, `references/structure/**`, `references/scoring/**`, `assets/**`, `manual_testing_playbook/**` | `(ai-council, deep-ai-council/<leaf>)` |
| `agent-improvement` | `deep-improvement` | `references/shared/**`, `references/agent_improvement/**`, `assets/agent_improvement/**` | `(agent-improvement, deep-improvement/<leaf>)` |
| `model-benchmark` | `deep-improvement` | `references/model_benchmark/**`, shared references, `assets/model_benchmark/**` | `(model-benchmark, deep-improvement/<leaf>)` |
| `skill-benchmark` | `deep-improvement` | `references/skill_benchmark/**`, shared references, `assets/skill_benchmark/**` | `(skill-benchmark, deep-improvement/<leaf>)` |
| `alignment` | `deep-alignment` | top-level `references/*.md`, `references/adapters/**` | `(alignment, deep-alignment/<leaf>)` |

The surface summary is grounded in each child resource map. [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:109-151] [SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:101-168] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:141-169] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:100-131] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:88-134]

## Questions Answered

- **Answered:** How do the seven workflow modes currently route across the five child packets, and what typed pairs do they imply?

## Questions Remaining

- Which complete set of flat child-relative leaf IDs collide, beyond the verified examples?
- How does the skill-benchmark discover, validate, and score routing gold and typed pairs?
- Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring?
- What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?

## Ruled Out / Dead Ends

- **Ruled out:** Treating a child-relative leaf ID alone as globally unique; exact research/review collisions disprove this.
- **Ruled out:** Using only `<packet>/<leaf>` as the complete typed identity; it still collapses the three public improvement modes onto `deep-improvement`.
- **Dead ends:** None. Direct local file evidence was sufficient despite unavailable memory and code-graph accelerators.

## Edge Cases

- **Ambiguous input:** None; the strategy and rendered prompt specified the same narrow focus.
- **Contradictory evidence:** None. The registry and hub prose agree on all seven mode-to-packet mappings.
- **Missing dependencies:** Spec Memory and Code Graph were unavailable at initialization; the prompt explicitly directed local packet and repository evidence, which fully covered this focus. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-state.jsonl:2]
- **Partial success:** None. The mapping and implied coordinate model were established, while exhaustive collision enumeration remains intentionally deferred.

## Sources Consulted

- `.opencode/skills/system-deep-loop/mode-registry.json:29-197`
- `.opencode/skills/system-deep-loop/SKILL.md:22-28,36-72,78-88`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:95-184`
- `.opencode/skills/system-deep-loop/deep-review/SKILL.md:95-209`
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:110-284`
- `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:95-219`
- `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md:82-221`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-state.jsonl:2`

## Assessment

- **New information ratio:** 1.00
- **Novelty calculation:** 5 of 5 findings were fully new relative to the empty findings registry; no simplicity bonus was needed.
- **Questions addressed:** 1
- **Questions answered:** 1

## Reflection

- **What worked and why:** Reading the registry before child routers fixed mode ownership first, then exact line-level comparison exposed both cross-packet leaf collisions and the shared improvement-packet ambiguity.
- **What did not work and why:** The initial broad resource search was truncated because AI Council alone contains many resource references; packet-scoped searches and focused reads recovered precise evidence without repeating the broad scan.
- **What I would do differently:** For collision enumeration, generate a deterministic inventory keyed by child packet and normalized leaf ID rather than relying on prose-map comparison.

## Next Focus

Enumerate all child-relative leaf-ID collisions across the five packets and test the proposed `(workflowMode, packet-qualified leaf)` coordinate against every router resource map, explicitly separating true collisions from intentional shared-packet aliases.
