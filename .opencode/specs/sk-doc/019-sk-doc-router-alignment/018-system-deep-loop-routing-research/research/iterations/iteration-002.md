# Iteration 2: Flat Leaf-ID Collisions and Canonical Typed Coordinates

## Focus

Enumerate the complete set of child-relative Markdown leaf IDs emitted by the five child routers, test packet qualification across the full inventory, and reconcile that result with the existing sk-doc typed-pair contract.

## Actions Taken

1. Read the required config, state log, strategy, registry, prior iteration, rendered prompt, and canonical `.opencode/agents/deep-research.md` definition before selecting the strategy's next focus.
2. Extracted quoted `references/**/*.md` and `assets/**/*.md` IDs from all five child-router definitions and grouped equal IDs by owning packet.
3. Produced a deterministic collision inventory with packet and line anchors, then checked all packet-qualified coordinates for uniqueness.
4. Mapped the seven public workflow modes through `mode-registry.json` and checked the expanded typed coordinates, including the three modes sharing `deep-improvement`.
5. Compared the proposed packet-qualified form with sk-doc's leaf-resource contract and probed its declared-mode legacy resolver against the shared improvement packet.

## Findings

1. The five routers contain 88 distinct packet-local Markdown coordinates but only 79 distinct flat leaf IDs. Exactly eight flat IDs collide; seven repeat across `deep-research` and `deep-review`, while `references/convergence/convergence_signals.md` repeats across those two packets plus `deep-ai-council`. [INFERENCE: deterministic extraction of quoted Markdown resource IDs from `.opencode/skills/system-deep-loop/deep-research/SKILL.md:111-150`, `.opencode/skills/system-deep-loop/deep-review/SKILL.md:103-167`, `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:143-168`, `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:102-125`, and `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md:90-133`]
2. The complete collision set is:
   - `references/convergence/convergence.md` — research and review. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:127,141`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:131,135,156,165-166`]
   - `references/convergence/convergence_recovery.md` — research and review. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:128,143`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:140`]
   - `references/convergence/convergence_signals.md` — research, review, and AI Council. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:126-127,142`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:132,136,157,165-166`] [SOURCE: `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:159,163`]
   - `references/protocol/loop_protocol.md` — research and review. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:125-126,132,139`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:122,130,154,164-166`]
   - `references/state/state_format.md` — research and review. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:125,129,146`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:123,143,155,164,167`]
   - `references/state/state_jsonl.md` — research and review. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:125,129,147`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:127`]
   - `references/state/state_outputs.md` — research and review. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:126,129-130,132,148`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:124,137,144,158,164,167`]
   - `references/state/state_reducer_registry.md` — research and review. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:128-129,149`] [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:125,145,159,166-167`]
3. Prefixing every local ID with its packet yields 88 packet-qualified coordinates and 88 unique values, so `<packet>/<leaf>` completely removes cross-packet flat-ID collisions. Across all seven modes, the fully expanded `(workflowMode, <packet>/<leaf>)` inventory likewise has 142 coordinates and 142 unique values. [INFERENCE: exhaustive uniqueness checks over the five router inventories and the seven mode-to-packet declarations at `.opencode/skills/system-deep-loop/mode-registry.json:29-197`]
4. Packet qualification is not itself the canonical sk-doc typed-pair shape. That contract deliberately defines `{workflowMode, leafResourceId}` with `leafResourceId` remaining packet-root-relative, stores `packet` separately in each manifest mode entry, and enforces uniqueness on the two-field composite. Packet-qualified strings are only a guarded legacy-read form. [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:10-30`] [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:114-183`] [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-215`] [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:318-338`]
5. `<packet>/<leaf>` alone is still ambiguous for `deep-improvement`, because `agent-improvement`, `model-benchmark`, and `skill-benchmark` declare the same packet. The legacy resolver returns the first declared matching mode, whereas explicit `{workflowMode, leafResourceId}` pairs remain distinct. The collision-free, contract-compatible identity is therefore `(workflowMode, leafResourceId)` plus the registry/manifest's `workflowMode → packet` ownership; its equivalent expanded coordinate is `(workflowMode, packet, leaf)`. This refines iteration 1's redundant `(workflowMode, packet-qualified leaf)` proposal without changing its uniqueness result. [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:102-172`] [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:133-183`] [INFERENCE: applying `resolvePacketQualified` from `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-215` to the registry's three `deep-improvement` declarations resolves the first declaration, while `makeTypedPair` preserves all three explicit modes]

## Questions Answered

- **Answered:** Which flat child-relative leaf IDs collide, and what packet-qualified coordinate scheme removes ambiguity?
- **Answer:** The eight IDs listed above are the complete collision set. `<packet>/<leaf>` removes flat cross-packet collisions, but routing gold must retain `workflowMode`; the canonical identity is `{workflowMode, leafResourceId}` with packet ownership in the registry/manifest, equivalently `(workflowMode, packet, leaf)` when fully expanded.

## Questions Remaining

- How does the skill-benchmark discover, validate, and score routing gold and typed pairs?
- Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring?
- What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?

## Ruled Out

- Flat child-relative leaf IDs are globally unique; the eight-entry collision inventory disproves this.
- `<packet>/<leaf>` alone is a complete routing identity; three public modes share `deep-improvement`.
- A packet prefix belongs inside canonical `leafResourceId`; the existing contract requires that field to begin with `references/` or `assets/` and treats packet-qualified values as legacy input.

## Dead Ends

None. Direct local extraction and the existing sk-doc contract fully resolved the focus.

## Edge Cases

- **Ambiguous input:** The phrase “packet-qualified coordinate scheme” could mean a display/disk coordinate or the canonical typed-gold identity. Both were tested and distinguished.
- **Contradictory evidence:** Iteration 1 proposed `(workflowMode, packet-qualified leaf)`, while the reusable sk-doc contract canonically pairs `workflowMode` with a packet-local leaf and stores packet ownership separately. The latter is the implemented authority; the prior proposal is collision-free but redundant and not byte-compatible. [SOURCE: `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-001.md:21`] [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:10-30,114-126,318-338`]
- **Missing dependencies:** Memory and code-graph accelerators remained unavailable from initialization, but deterministic local evidence covered the question. [SOURCE: `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-state.jsonl:2`]
- **Partial success:** None; the collision inventory and coordinate model were both resolved.

## Sources Consulted

- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:111-150`
- `.opencode/skills/system-deep-loop/deep-review/SKILL.md:103-167`
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:143-168`
- `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:102-125`
- `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md:90-133`
- `.opencode/skills/system-deep-loop/mode-registry.json:29-197`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:10-30,114-215,318-338`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-001.md:21`

## Assessment

- **New information ratio:** 1.00
- **Novelty calculation:** Four of five findings were fully new and one was partially new: `(4 + 0.5) / 5 = 0.90`; a `+0.10` simplicity bonus applies because the implemented contract resolved the coordinate-model contradiction.
- **Questions addressed:** 1
- **Questions answered:** 1

## Reflection

- **What worked and why:** Deterministic extraction converted a few known examples into a complete eight-ID inventory, while the reusable contract separated collision-free disk coordinates from canonical routing identity.
- **What did not work and why:** Treating packet qualification as synonymous with typed identity obscured the three-mode `deep-improvement` case; registry order demonstrated why packet alone cannot recover mode.
- **What I would do differently:** Start the next pass from the benchmark's manifest and scoring consumers, preserving their exact field names before classifying scenarios.

## Next Focus

Trace how the skill-benchmark discovers the resource manifest, validates `{workflowMode, leafResourceId}` gold, and computes routing scores, with exact producer-to-consumer anchors.
