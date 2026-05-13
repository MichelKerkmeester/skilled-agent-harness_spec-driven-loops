# Deep-Research Iteration 3 — K1.2 deep-dive: causal-graph lifecycle port (ChildExistence + ChildComponentTombstone → causal_edges)

You are operating as the `@deep-research` LEAF agent via cli-codex (gpt-5.5, reasoning=high, service_tier=fast).

## STATE

Segment: 1 | Iteration: 3 of 10
Questions: 2/11 answered (K2.4=166 callsites; K1.1=YES-WITH-ADAPTATION) | Last focus: K1.1 memoization DAG transfer
Last 2 ratios: 0.86 -> 0.76 | Stuck count: 0
Next focus: K1.2 — causal-graph lifecycle port; decide whether to adopt ChildExistence/ChildComponentTombstone-style tombstones for our flat causal_edges.

Research Topic: cocoindex-main → spec_kit_memory MCP port + namespace shortening.

## FOCUS

**K1.2 — Can the `ChildExistence` + `ChildComponentTombstone` lifecycle model from `rust/core/src/state/db_schema.rs` be ported into our flat `causal_edges` table at `lib/search/vector-index-schema.ts` to give causal edges automatic lifecycle/cleanup when source/target memories are deleted or renamed?**

Verdict needed: YES / YES-WITH-ADAPTATION / NO + concrete schema/handler sketch.

## PRIOR EVIDENCE (iter 1-2)

- `db_schema.rs:35`: `StablePathEntryKey` defines `ChildExistencePrefix`, `ChildExistence(StableKey)`, `ChildComponentTombstonePrefix`, `ChildComponentTombstone(StablePath)`.
- `db_schema.rs:55`/`:60`: encoding 0xa0 (existence) / 0xb0 (tombstone).
- `db_schema.rs:311`: `ChildExistenceInfo` carries `node_type`.
- `execution.rs:1483`: writes tombstone via `ChildComponentTombstone(relative_path.into())`.
- `execution.rs:1501`: writes existence via `ensure_path_node_type`.
- Our `causal_edges` (`vector-index-schema.ts:607-638`): flat relational; columns = `source_id`, `target_id`, optional anchors, `relation` (constrained: caused/supports/contradicts/supersedes/produced/cited_by), `strength`, `evidence`, `created_by`, `last_accessed`; indexes on source/target/relation/strength. NO tombstone, NO generation, NO cleanup on parent deletion.
- K1.1 produced SQLite memoization schema additions; lifecycle question is now: can the same DB host causal-edge lifecycle without breaking existing queries?

## INVESTIGATION TARGETS

**Cocoindex side — lifecycle mechanics:**
1. Read `external/cocoindex-main/rust/core/src/engine/execution.rs` around lines 1450-1550 (full context for ChildExistence + ChildComponentTombstone writes). What triggers a tombstone? What invalidates it? Is there a sweep/GC?
2. Search for any "cleanup", "compact", "sweep", or "vacuum" code paths in `external/cocoindex-main/rust/core/src/` that process tombstones.
3. Read `external/cocoindex-main/rust/core/src/state/db_schema.rs:300-350` to understand `ChildExistenceInfo` payload and any related lifecycle records.

**Our side — causal-edge consumers:**
4. Read `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` — how are edges created, queried, deleted? Are there sweep handlers?
5. Read `.opencode/skills/system-spec-kit/mcp_server/lib/causal/` directory listing + any relation-coverage or sweep logic.
6. Search for "memory_delete" handler — does deleting a memory cascade to causal edges? Or are orphan edges left behind?
7. Read the full `causal_edges` schema region in `lib/search/vector-index-schema.ts:600-650` (broader window than iter-1).

## ANALYSIS DELIVERABLE

**Tombstone vs. cascade-delete vs. soft-delete decision matrix:**

| Approach | Pros | Cons | Fits our stack? |
|----------|------|------|-----------------|
| Hard cascade (FK ON DELETE CASCADE) | Simple, atomic | No audit trail | ? |
| Soft tombstone column (`deleted_at`, `tombstone_reason`) | Audit trail, recoverable | Query filters everywhere | ? |
| Separate tombstone table (cocoindex pattern, adapted) | Decoupled, sweep-friendly | More tables, joins | ? |
| Generation counters | Cheap invalidation | Conceptually complex | ? |

**Verdict on K1.2**: YES / YES-WITH-ADAPTATION / NO + one-paragraph justification.

If YES or YES-WITH-ADAPTATION, sketch:
- SQLite schema additions (new column on `causal_edges`? new `causal_edge_tombstones` table?)
- Trigger mechanism (DELETE trigger on `memory_index`? Application-level sweep?)
- Migration plan for existing edges (default `deleted_at = NULL`)
- Sweep/GC handler (new MCP tool? existing retention sweep extended?)

## CONSTRAINTS

- LEAF. Max 12 tool calls. Target 5-7.
- Cite verbatim file:line.
- Do NOT use special regex chars (dollar, caret, backslash) in JSONL `focus` field — write words instead.
- Write findings to files only.

## OUTPUT CONTRACT

1. **`research/iterations/iteration-003.md`** — sections: Focus, Actions Taken, Findings, Decision Matrix, Verdict on K1.2 + schema sketch, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL appended to state.jsonl**:
```json
{"type":"iteration","iteration":3,"newInfoRatio":<0.4-0.7>,"status":"insight","focus":"k1-2-causal-edge-lifecycle-port","keyQuestions":[...],"answeredQuestions":[...],"durationMs":<n>,"timestamp":"<iso>","sessionId":"027-013-cocoindex-port-2026-05-13","generation":1,"graphEvents":[...]}
```

3. **`research/deltas/iter-003.jsonl`** — iteration record + findings + edges.

Stop conditions: 10 min wall, ≤12 tool calls, target ≤30K tokens out.

Go.
