# Iteration 7: P3 Context and Event Decomposition

## Focus
Map NOOA context construction onto a file-backed, replayable harness.

## Actions Taken
Read paper context sections, prompt-pack contracts, JSONL state rules, and blog context-isolation guidance.

## Findings
1. **[OBSERVED-IN-PAPER][CONFIRM studies; EXTEND runtime]** NOOA separates cacheable static blocks, append-only typed event history, and re-evaluated dynamic blocks. This is a stronger internal model than one fully rendered prompt. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:132-165]
2. **[OBSERVED-IN-PAPER][CONFIRM study replay; REFINE runtime]** Event ranges may be collapsed for visibility while full history remains searchable. The safe analogue is a summary event pointing to immutable source offsets, never transcript replacement. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:138-140] [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34]
3. **[INFERENCE][CONFIRM runtime; EXTEND runtime]** Keep static invariants and tool contracts in the deterministic prompt prefix; expose event queries and volatile projections through typed calls; bind every response to state-log offsets/digests. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/prompt-pack.md:21-47]
4. **[TEXT-CLAIMED][CONFIRM studies; CONFIRM runtime]** The blog argues that workers start with clean context and return a designed small result rather than inheriting the parent's polluted window. This supports current fresh-iteration isolation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:116-149]
5. **[INFERENCE][CONTRADICT collapse; REFINE runtime]** Dynamic blocks must not contain mutable authority or unpinned summaries; cache efficiency is subordinate to correct freshness and replay. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:163-169]

## Questions Answered
- Static/events/dynamic region mapping.

## Questions Remaining
- Minimal model-callable API and its forbidden operations.

## Ruled Out
- Flat ever-growing transcripts.
- Summary replacing original events.

## Edge Cases
- Static policy changes require a new prompt-pack/version digest, not silent cache reuse.

## Sources Consulted
- Paper context section, prompt-pack, JSONL, context-isolation blog.

## Assessment
- New information ratio: 0.63.
- Status: complete.

## Reflection
The paper's caching layout transfers only after replacing live objects with pinned file-backed projections.

## Recommended Next Focus
Specify the read-only facade.
