# Iteration 19: When-Not-to-Use and Contradiction Audit

## Focus
Prefer current simple mechanisms unless measured failure justifies each addition.

## Actions Taken
Applied the skill's non-use rules, blog restraint, paper sandbox limitation, and studies' authority boundaries to every proposal.

## Findings
1. **[CONFIRM current runtime]** Do not use deep loop/harness extensions for a simple one-shot question, known solution, implementation task, or research needing fewer than three sources. [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:43-49]
2. **[CONTRADICT wholesale NOOA]** Do not adopt in-process model code, live mutable objects, unrestricted imports, or model-side spawning across trust boundaries; the paper itself requires external sandboxing. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448]
3. **[REFINE P1]** Do not add typed local repair to trivial deterministic calls or semantic failures; use ordinary validation or return to evidence gathering. [INFERENCE: local repair pays only when candidate shape is model-produced and repairable without new evidence]
4. **[REFINE P2]** Do not use curated memory as an authoritative database, retention-policy bypass, credential store, or substitute for source retrieval. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:90-104]
5. **[REFINE P3]** Do not add a context facade when the bounded prompt already contains stable, small evidence; API calls add latency, cursor state, and another attack surface. [INFERENCE: complexity must answer measured context pressure]
6. **[REFINE P4]** Do not use model-programmable loops for deterministic transforms, protected effects, or work needing new agents/capabilities; use code or graph scheduling. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:56-66]
7. **[REFINE P5]** Do not rely on same-model judging for high-impact truth or authority, and do not collapse per-gate evidence into a scalar. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:14-32]
8. **[REFINE P6]** Do not replace small inline immutable values with handles; indirection is justified only by measured context, privacy, reuse, or replay needs. [INFERENCE: handle overhead is needless for bounded values]
9. **[CONFIRM studies]** Do not fan out or graph work without real independence; truly sequential work remains a loop, and topology cannot compensate for unreliable tools or ground truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:196-229] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:163-191]

## Questions Answered
- Explicit when-not-to-use boundaries for P1-P7 and the overall extraction.

## Questions Remaining
- Terminal adopt/defer/reject verdict and prerequisites.

## Ruled Out
- Complexity without measured failure, wholesale NOOA, memory truth, and graph-first narrow work.

## Edge Cases
- A mechanism can become justified later if traces show a specific failure and the mutant corpus proves the proposed fix.

## Sources Consulted
- Skill, paper limitations, restraint/eval/graph-boundary blogs.

## Assessment
- New information ratio: 0.07.
- Status: complete.

## Reflection
The default remains the smallest deterministic harness that proves its result.

## Recommended Next Focus
Terminal falsification and decision register.
