# Iteration 6: P2 Memory Ownership and Never-Forget Rules

## Focus
Constrain curation so memory improves recall without corrupting evidence or authority.

## Actions Taken
Compared paper memory operations with append-only JSONL, belief settlement, knowledge-plane provenance, and negative knowledge.

## Findings
1. **[INFERENCE][EXTEND studies; EXTEND runtime]** A LEAF may propose `remember`, `revise_projection`, `associate`, `abstract`, `suppress_from_working_set`, and `restore`; the reducer validates references and owns acceptance. This mirrors the live rule that leaves observe ideas while reducers promote them. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:247-268] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:213-217]
2. **[INFERENCE][CONFIRM study 2; REFINE paper extraction]** Merge creates a new derived record referencing all inputs; it never rewrites source assertions. Abstract creates a lossy summary with an explicit coverage list and retained source handles. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43]
3. **[INFERENCE][CONFIRM studies; EXTEND runtime]** `forget` means retrieval suppression, activation decay, or derived-index removal. It must not physically delete canonical JSONL, citations, iteration artifacts, or source records. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34]
4. **[INFERENCE][CONFIRM studies; REFINE runtime]** Never-forget classes are source assertions and provenance; contradictions and supersession chains; authoritative requests, decisions, refusals, receipts, fences, effects, and budgets; policy/schema/version digests; rejected approaches and negative knowledge; memory access/reflection decision logs; open todos and unresolved blockers. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:5-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:217-221]
5. **[OBSERVED-IN-PAPER][REFINE runtime]** Non-reinforcing spontaneous injection should be retained: harness-selected recall must not increment utility merely because the harness displayed it. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:215-215]
6. **[INFERENCE][CONTRADICT overreach; CONFIRM 036]** A memory acceptance decision can change retrieval ranking but cannot settle belief, close a key question, authorize STOP, or admit a transition. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:81-91]

## Questions Answered
- Proposal/acceptance ownership, decay semantics, and never-forget classes.

## Questions Remaining
- Context/event facade design.

## Ruled Out
- Physical deletion of provenance, contradictions, authority events, or negative knowledge.
- Model-owned merge acceptance.

## Edge Cases
- Sensitive payloads may be cryptographically erased under a separate retention authority while immutable tombstone/digest metadata remains; that policy is outside this study.

## Sources Consulted
- Paper memory section, JSONL contract, studies 2 and 4.

## Assessment
- New information ratio: 0.68.
- Status: complete.

## Reflection
Safe forgetting is a projection operation, not historical erasure.

## Recommended Next Focus
Map context regions and event history.
