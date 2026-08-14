# Iteration 16: P7 Loop/Harness and Concurrency Mutants

## Focus
Complete the corpus beyond memory correctness.

## Actions Taken
Mapped loop evidence doctrine, clean-context rules, graph failure modes, fanout isolation, and lock semantics into negative controls.

## Findings
1. **[TEXT-CLAIMED][CONFIRM runtime]** Runaway mutant retries with no new evidence; expected detection is unchanged evidence handles plus hard iteration/time/cost ceilings. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:32-50]
2. **[TEXT-CLAIMED][CONFIRM runtime]** Context-pollution mutant gives verifier the worker's conversation; expected result is failed independence metadata, not a valid judge vote. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:132-155]
3. **[INFERENCE][EXTEND runtime]** Partial-fan-in mutant drops one failed lineage and synthesizes a complete-looking report; fan-in must carry expected/received/failed lineage identities and refuse completeness. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:180-188]
4. **[INFERENCE][CONFIRM runtime]** Cross-write mutant makes two supposedly independent workers modify one file; containment/write-set checks must expose the hidden edge. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:166-179]
5. **[INFERENCE][CONFIRM runtime]** Lineage-isolation mutant shares executor state or artifact directories; fanout must prove distinct sub-packets and state dirs. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:21-35]
6. **[INFERENCE][CONFIRM runtime]** Lock mutants cover live-holder double acquire, dead-holder reclaim, stale TTL, wrong owner/nonce refresh, and wrong owner release. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/loop-lock.md:21-47]
7. **[TEXT-CLAIMED][REFINE runtime]** Context-collapse mutant fans out widely then dumps all raw outputs into synthesis; layered summaries with source handles must bound fan-in. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:212-215]
8. **[INFERENCE][CONFIRM 036]** Capability-escalation mutant asks a context or local-action API to widen permission or perform an effect; the call must refuse before any action and cannot be repaired into authority by the model. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20]

## Questions Answered
- P7 loop, context, fanout, lock, and scope mutant families.

## Questions Remaining
- Audit all twelve blogs and the live-runtime gap set.

## Ruled Out
- Retry without evidence, shared judge context, partial fan-in as complete, and model-managed lock recovery.

## Edge Cases
- A failed optional lineage can be omitted only when the research charter marks it optional before execution.

## Sources Consulted
- Four blog posts plus fanout, lock, and study-3 sources.

## Assessment
- New information ratio: 0.21.
- Status: complete.

## Reflection
Harness mutants must attack ownership and omission, not just model answer quality.

## Recommended Next Focus
Complete the twelve-post corpus audit.
