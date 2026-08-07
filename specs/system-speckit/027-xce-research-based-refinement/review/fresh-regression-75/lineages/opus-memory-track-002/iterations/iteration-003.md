# Seat opus-memory-track-002 — iteration 3 (global #32)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-memory-track-002
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I have traced the full causal-write surface. My angle's guard holds. Writing up the verdict.

## Review: Feedback causal reducer — does the co-occurrence→causal guard hold?

**Slice traced (real behavior, not names):**
- `lib/feedback/session-trace-causal-reducer.ts` — the one module that could turn session co-occurrence into causal edges.
- `lib/storage/causal-edges.ts` `insertEdge` — the write-safety layer it calls.
- `lib/cognitive/co-activation.ts` — confirmed read-only over `causal_edges`.
- `lib/causal/relation-backfill.ts` — the other `auto` edge writer.
- `constitutional/entity-cooccurrence-is-not-causal.md` — the invariant under test.

**What the reducer actually does:** for each `result_cited` event it pairs the cited memory (target) with prior same-session `search_shown` memories (sources) and inserts `source —enabled→ target` at strength 0.3, `created_by='auto-session'`. That is, by construction, inferring a weak causal edge from session co-occurrence.

**Why this is NOT a constitutional violation — the guard is layered and real:**
1. **Flag-gated OFF + dormant.** `isSessionTraceCausalInferenceEnabled()` reads `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` (default false, documented OFF in `ENV_REFERENCE.md:374`). Grep confirms **no live caller** of `runSessionTraceCausalReducer` anywhere outside the module + tests — the header comment "No live feedback logging path imports or invokes this module" is accurate. This is the shadow/observe-only, default-OFF class the review brief explicitly excludes from findings.
2. **Manual-overwrite protection at two independent layers.** Reducer-level `readExistingEdge` → `manual_protected` skip (line 255-258), AND storage-level `insertEdge` line 364: `existing && isAutoEdgeCreator(createdBy) && !isAutoEdgeCreator(existing.created_by)` skips the write. `'auto-session'` matches `startsWith('auto-')`, so a curated/manual edge can never be clobbered. This is exactly the invariant's "must never overwrite a causal edge authored from explicit lineage or manual evidence."
3. **Bounded & traceable.** Auto strength capped at `MAX_AUTO_STRENGTH=0.5` (0.3 passes un-clamped), `MAX_EDGES_PER_NODE=20`, relation window cap, self-loop excluded (`event.memory_id === citation.memory_id` filtered at line 112), evidence string `session_trace session=… query=…`, sweepable via `created_by`.
4. **Adjacent writers are legitimate.** `relation-backfill` derives edges from spec-document chains and `memory_lineage` pointers (governed structural signals — allowed) plus an **opt-in, default-off** similarity→`supports` collector (neutral relation, bounded). `co-activation` only reads. No path promotes raw entity overlap to causal truth in a live, default-on path.

**The guard the seat asked me to verify exists and works.** Verdict: PASS.

**One honest P2 (within the guard logic itself):** `enabledRelation()` (lines 89-92) returns `RELATION_TYPES.ENABLED` only "if it's in `Object.values(RELATION_TYPES)`" — but `ENABLED` is a member of that frozen object by definition, so the check is tautological and always returns `'enabled'`. The `if (!relation) return …'insert_rejected'` branch at line 198-200 is therefore unreachable dead code. Harmless, but it reads as a real guard when it can never trip — mild maintenance trap. Not a correctness defect (the feature is dormant and the relation is always valid anyway).

```json
{"seat":"opus-memory-track-002","model":"claude-opus-4-8","angle":"Feedback causal reducer: entity co-occurrence must NOT be treated as causal; verify the guard.","verdict":"PASS","summary":"Co-occurrence->causal guard holds: reducer is flag-OFF+dormant (no live caller), manual edges protected at reducer+storage layers, auto strength/edge caps enforced. One trivial dead-guard P2.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/feedback/session-trace-causal-reducer.ts",".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts",".opencode/skills/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts",".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts",".opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md"],"findings":[{"severity":"P2","dimension":"maintainability","title":"Tautological relation guard makes insert_rejected branch dead code","file":".opencode/skills/system-spec-kit/mcp_server/lib/feedback/session-trace-causal-reducer.ts:89","evidence":"enabledRelation() returns RELATION_TYPES.ENABLED only if Object.values(RELATION_TYPES) includes it; ENABLED is always a member, so it never returns null and the `if (!relation)` -> 'insert_rejected' branch at line 197-200 can never execute.","why":"A guard that reads as a validation gate but can never trip is a maintenance trap; a future reader may assume the relation is validated against runtime data when it is a compile-time constant.","recommendation":"Drop the tautological check and return RELATION_TYPES.ENABLED directly, or replace it with a real validation against the live schema/enabled-relation set if dynamic validation was the intent."}]}
```
