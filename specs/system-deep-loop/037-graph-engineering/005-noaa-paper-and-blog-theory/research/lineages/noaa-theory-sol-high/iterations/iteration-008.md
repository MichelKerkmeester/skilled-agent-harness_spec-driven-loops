# Iteration 8: P3 Read-Only Context Capability Facade

## Focus
Define the smallest safe model-callable context/event API.

## Actions Taken
Compared NOOA manager APIs with current prompt/state ownership and the orientation's candidate facade.

## Findings
1. **[INFERENCE][CONFIRM studies; EXTEND runtime]** Minimal v1 calls: `state_summary()`, `recent_events(cursor,limit)`, `event(id)`, `open_questions(limit)`, `coverage_gaps(limit)`, `ruled_out(limit)`, `artifact_preview(handle,bounds)`, and `recall_continuity(query,limit)`. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:83-85]
2. **[INFERENCE][REFINE runtime]** Every response returns `sourceHandle`, `sourceDigest`, `snapshotHead`, `nextCursor`, `truncated`, and bounded content. This converts prompt context into verifiable evidence rather than ambient text. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:35-69]
3. **[OBSERVED-IN-PAPER][EXTEND runtime]** NOOA exposes context and event operations to both developer and model, including typed event queries. That is the primary transferable design idea. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:138-165]
4. **[INFERENCE][CONFIRM replay; EXTEND runtime]** Each call emits an append-only `context_read` audit event containing operation, normalized arguments, returned handles, state head, truncation, and cost. Reads remain replayable without embedding full sensitive payloads. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34]
5. **[INFERENCE][CONTRADICT overreach; CONFIRM runtime]** Forbidden operations: append canonical events, rewrite strategy/registry, acknowledge questions, select graph edges, change convergence, mutate executor/budget, spawn work, dereference outside capability scope, or authorize effects. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:35-48]
6. **[INFERENCE][CONFIRM runtime]** Deterministic prompt rendering remains the boot and degraded-mode path; the facade is an additive read capability, not a hidden mandatory dependency. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/prompt-pack.md:41-47]

## Questions Answered
- P3 API vocabulary, bounds, auditing, and forbidden controls.

## Questions Remaining
- Safe programmable action set inside LEAF.

## Ruled Out
- Unbounded transcript export.
- Model mutation of state or control.

## Edge Cases
- A stale cursor returns a typed `snapshot_mismatch`, never silently mixes heads.

## Sources Consulted
- Paper context manager, orientation, prompt pack, JSONL.

## Assessment
- New information ratio: 0.59.
- Status: complete.

## Reflection
A capability facade is safe when every read is bounded, pinned, and auditable.

## Recommended Next Focus
Extract CodeAct tactics under LEAF constraints.
