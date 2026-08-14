# Iteration 15: P5 Temporal Facts and Prefer-Newer Containment

## Focus
Challenge GEM's graph-memory conflict heuristic.

## Actions Taken
Compared GEM's loop with bitemporal and prospective truth doctrine.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** Incremental memory reuses the same ontology, extraction, fusion, and bounded GraphRAG serving, with periodic fusion and confidence hygiene. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:72-86]
2. **[TEXT-CLAIMED][REFINE/CONTAIN]** GEM says keep conflicting facts with time/provenance and prefer newer at retrieval. The corpus provides a richer model: close the old validity interval while retaining when the system learned each fact. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:82-85] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:145-158]
3. **[TEXT-CLAIMED][CONTRADICT as universal rule]** Study 2 orders semantic successors by `(observed_at, authorized_sequence)`, rejects non-increasing/cyclic/competing successors before append, and forbids last-write-wins repair. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-293]
4. **[INFERENCE: “newer” is at most a purpose-specific retrieval policy]** Valid-time, observation-time, source authority, uncertainty, scope, contradiction, and required-answer fitness must participate in settlement. Receipt time cannot silently stand in for observation time.

## Questions Answered
- GEM memory is safe only behind a richer belief adapter; provenance retention is adopted, prefer-newer is contained.

## Questions Remaining
- P6 task-graph missing failures and P7 rollout.

## Ruled Out
- Last-write-wins truth; deleting stale facts; receipt-time supersession.

## Edge Cases
- Late-arriving older evidence remains valuable audit evidence but must not displace a valid terminal successor.

## Sources Consulted
- GEM memory loop, temporal blog, study 2.

## Assessment
- New information ratio: 0.27
- Status: insight

## Reflection
P5 is the only real doctrinal contradiction, and it is contained at the retrieval/belief boundary.

## Recommended Next Focus
P6 task-graph failure-mode audit.
