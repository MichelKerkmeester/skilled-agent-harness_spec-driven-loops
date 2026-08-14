# Iteration 10: P4 Closed Local Action Set

## Focus
Turn the P4 boundary into an executable policy vocabulary.

## Actions Taken
Compared CodeAct operations with loop doctrine, fanout isolation, lock ownership, and LEAF budgets.

## Findings
1. **[INFERENCE][CONFIRM studies; EXTEND runtime]** Closed local actions: `read_handle`, `query_events`, `preview_artifact`, `call_declared_tool`, `run_pure_helper`, `transform_local`, `validate_candidate`, `record_observation`, `propose_memory_op`, `propose_next_focus`, and `return_candidate`. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:185-203]
2. **[INFERENCE][CONFIRM runtime]** Every action is charged to tool/time/token/bytes-read budgets and yields a typed observation; actions cannot create new capabilities at runtime. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:32-50]
3. **[INFERENCE][CONFIRM studies; EXTEND runtime]** Escalations are data: `need_parallel_work`, `need_new_source_scope`, `need_human`, `need_protected_effect`, and `budget_exhausted`. The workflow decides whether any becomes an edge or dispatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:56-66]
4. **[CONFIRM runtime; CONTRADICT model ownership]** Fanout remains lineage-isolated and command-owned; a local action cannot create or join a lineage. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:21-35]
5. **[CONFIRM runtime; CONTRADICT model ownership]** The loop lock remains harness-owned single-writer state with stale detection and owner-scoped release; model tactics cannot refresh, steal, or reinterpret it. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/loop-lock.md:21-47]
6. **[INFERENCE][CONFIRM 036]** Any helper with durable side effects must issue an effect intent for external authorization and receipts; otherwise it is excluded from the local set. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:5-9]

## Questions Answered
- P4 closed action set, budgets, and escalation points.

## Questions Remaining
- Full P5 evaluator architecture and mutant proofs.

## Ruled Out
- Capability acquisition, loop-control mutation, lineage creation, and unreceipted durable effects.

## Edge Cases
- A read-only tool can still leak sensitive content; capability scope includes field-level redaction.

## Sources Consulted
- Paper, harness blog, fanout and lock catalogs, study 4.

## Assessment
- New information ratio: 0.50.
- Status: complete.

## Reflection
The closed set makes inner programmability auditable without importing the paper's in-process trust model.

## Recommended Next Focus
Formalize the three evaluator layers.
