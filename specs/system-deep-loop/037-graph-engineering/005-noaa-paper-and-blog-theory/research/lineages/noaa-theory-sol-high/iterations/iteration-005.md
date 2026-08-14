# Iteration 5: P2 Observed NOOA Memory Mechanics

## Focus
Separate the paper's memory mechanisms from proposed repository policy.

## Actions Taken
Read the paper memory section and appendix summary, then compared study-2 belief and study-4 evidence maintenance.

## Findings
1. **[OBSERVED-IN-PAPER][EXTEND studies; EXTEND runtime]** NOOA gives the model deliberate `remember`, `recall`, `search`, `update_memory`, `forget`, `associate`, and `deref` operations. Current iteration state has no equivalent proposal vocabulary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:209-215]
2. **[OBSERVED-IN-PAPER][REFINE studies; EXTEND runtime]** A before-turn hook injects associated memories without reinforcing them; retrieval combines embedding, keywords, activation, and a typed graph. Non-self-reinforcement is an important defense against harness-created popularity loops. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:215-215]
3. **[OBSERVED-IN-PAPER][EXTEND studies; EXTEND runtime]** Reflection merges near duplicates, may reconcile conflicting values into a current record while archiving predecessors, links related memories, distills episodes, re-scores importance, and prunes decayed records with protected exceptions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:217-219]
4. **[OBSERVED-IN-PAPER][CONFIRM study 4; REFINE runtime]** One inspectable SQLite source of truth backs derived indexes, owner scopes, live references, access recording, and a viewer. This confirms derived-index/replay principles but does not prove its truth semantics fit this repository. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:219-231] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:93-101]
5. **[INFERENCE][CONTRADICT over-adoption; CONFIRM studies]** Memory is a retrieval projection, not belief settlement. Reconciliation can designate a current retrieval preference only while contradictory and superseded evidence stays reconstructable under study-2 rules. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43]
6. **[TEXT-CLAIMED][ORTHOGONAL acceptance]** The paper reports a +11.8 RHAE improvement against file notes, but the result is author-reported and cannot set local promotion thresholds. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:219-219]

## Questions Answered
- P2 observed mechanisms and claim strength.

## Questions Remaining
- What may never be forgotten, and who accepts memory proposals?

## Ruled Out
- Memory curation as truth admission.
- Reflection as authority.

## Edge Cases
- Live-reference resolution prevents stale copies only when the referenced source is available and correctly scoped.

## Sources Consulted
- Paper memory sections, studies 2 and 4.

## Assessment
- New information ratio: 0.72.
- Status: complete.

## Reflection
The strongest transferable idea is controlled curation over an inspectable append-preserving store, not deletion.

## Recommended Next Focus
Specify memory proposal ownership and never-forget classes.
