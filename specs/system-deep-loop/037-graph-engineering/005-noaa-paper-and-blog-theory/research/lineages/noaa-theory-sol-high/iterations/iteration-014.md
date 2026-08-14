# Iteration 14: P6 Handle Failure Modes and Measurements

## Focus
Define how a handle system fails and how value is measured.

## Actions Taken
Compared paper efficiency claims with prompt rendering, replay, and sealing contracts.

## Findings
1. **[INFERENCE][REFINE runtime]** Stale-reference mutant changes bytes behind a stable path; digest-bound dereference must fail rather than return new content. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:43-53]
2. **[INFERENCE][REFINE runtime]** Preview-trust mutant places the decisive contradiction in the omitted middle; evidence acceptance must require a bounded query/full scan result, not a head/tail preview. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:169-181]
3. **[INFERENCE][EXTEND runtime]** Cursor mutant changes snapshot head between pages; the next request returns `snapshot_mismatch` and starts a new pinned traversal only by explicit choice. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34]
4. **[INFERENCE][CONFIRM studies]** Scope mutant presents a valid handle outside its capability/owner scope; dereference refuses before content access and records the attempt. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:47-53]
5. **[INFERENCE][EXTEND runtime]** Measure prompt tokens, bytes fetched, query count, p50/p95 latency, task correctness, citation resolution, stale detections, replay success, unauthorized dereference refusal, and cost per accepted iteration against the current prompt-pack baseline. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/prompt-pack.md:41-47]
6. **[TEXT-CLAIMED][ORTHOGONAL acceptance]** Paper benchmark efficiency/results motivate measurement but do not establish repository benefit; promotion requires paired local traces and mutants. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:301-307]

## Questions Answered
- P6 failure and measurement plan.

## Questions Remaining
- Broader memory/context harness corpus.

## Ruled Out
- Token reduction as sufficient proof and implicit latest-version resolution.

## Edge Cases
- Large encrypted artifacts may support server-side predicates without content disclosure; correctness still binds query and result digests.

## Sources Consulted
- Paper, prompt-pack catalog, JSONL, study 3.

## Assessment
- New information ratio: 0.31.
- Status: complete.

## Reflection
Efficiency matters only when correctness, replay, and refusal remain at least as strong.

## Recommended Next Focus
Build memory/context mutant families.
