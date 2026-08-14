# Iteration 15: P7 Memory and Context Mutant Corpus

## Focus
Turn memory/context failure modes into permanent evaluation cases.

## Actions Taken
Mapped paper stress weaknesses, memory reflection, JSONL idea lifecycle, and harness failure doctrine.

## Findings
1. **[INFERENCE][EXTEND studies; EXTEND runtime]** Stale-recall mutant injects a superseded record while current evidence exists; expected result is contradiction-aware retrieval plus explicit source heads, never confident use. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:215-219]
2. **[INFERENCE][REFINE paper extraction; EXTEND runtime]** Reflection-blur mutant abstracts away a qualifier or source disagreement; expected result is failed coverage/provenance validation and retention of original records. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:217-221]
3. **[INFERENCE][CONFIRM runtime]** Negative-knowledge-loss mutant forgets an exhausted approach and repeats it; rejected-pattern and ruled-out state must block selection. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:286-313]
4. **[INFERENCE][EXTEND runtime]** Harness-popularity mutant repeatedly injects one memory; usage score must not rise without deliberate access, testing the paper's non-reinforcement claim. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:215-215]
5. **[INFERENCE][EXTEND runtime]** Bookkeeping mutant loses an open todo, changes a question id, or counts a thought as evidence; reducer/state invariants must detect it. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:267-283]
6. **[INFERENCE][CONFIRM studies]** Provenance-loss mutant produces a fluent correct summary with no reconstructable source chain; semantic acceptance fails despite apparent usefulness. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:93-101]
7. **[TEXT-CLAIMED][CONFIRM scope restraint]** The harness blog warns that more memory and broader permissions can increase ambiguity, context noise, and risk; corpus promotion must include pollution and permission-escalation negatives. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:90-104]

## Questions Answered
- P7 memory/context mutant family.

## Questions Remaining
- Loop-control, fanout, lock, and pollution mutants.

## Ruled Out
- Fluency-based reflection grading and average-only benchmark promotion.

## Edge Cases
- A deliberately redacted summary can omit details while preserving a verifiable tombstone and coverage declaration.

## Sources Consulted
- Paper stress/memory sections, JSONL, study 4, harness blog.

## Assessment
- New information ratio: 0.26.
- Status: complete.

## Reflection
Memory quality is visible only when the corpus attacks staleness, omission, and self-reinforcement directly.

## Recommended Next Focus
Complete P7 with loop/harness state and concurrency mutants.
