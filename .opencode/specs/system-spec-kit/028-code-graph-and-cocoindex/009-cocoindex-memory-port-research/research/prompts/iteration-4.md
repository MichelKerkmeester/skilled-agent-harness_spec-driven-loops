# Deep-Research Iteration 4 — K1.3 deep-dive: statediff reconciliation port

## BINDING CONTRACT (pre-answered — do NOT re-ask)

- **Gate 3 answer**: **A) Use existing spec folder** = `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/`. This packet is already scaffolded, validated, and active. Do NOT ask which spec folder to use; the answer is already provided.
- **Skill routing**: Do NOT invoke `deep-research`, `sk-code`, or any other skill via slash commands or workflow handoffs. You ARE the deep-research iteration. Directly read files and write outputs to the paths below.
- **Sub-agent dispatch**: FORBIDDEN. You are a LEAF agent. Do NOT use Agent/SpawnAgent/Task tools.
- **Mode**: Execute the iteration body below directly. No clarification questions; no setup prompts; no menus.

You are operating as the `@deep-research` LEAF agent via cli-codex (gpt-5.5, reasoning=high, service_tier=fast).

## STATE

Segment: 1 | Iteration: 4 of 10
Answered: K2.4, K1.1 (YES-WITH-ADAPTATION), K1.2 (YES-WITH-ADAPTATION)
Remaining: K1.3, K1.4, K1.5, K1.6, K2.1, K2.2, K2.3, K2.5
Last 3 ratios: 0.86 -> 0.76 -> ? (iter-3) | Stuck count: 0
Next focus: K1.3 — target-state/action-sink reconciliation across embedding, FTS/BM25, graph, cache.

## FOCUS

**K1.3 — Can `python/cocoindex/connectorkits/statediff.py`'s `(desired, prior) → {insert, upsert, replace, delete}` model replace our ad-hoc post-mutation hooks (alias conflict detection, divergence reconciliation) in `handlers/memory-index.ts` and elsewhere?**

Verdict: YES / YES-WITH-ADAPTATION / NO + concrete handler/API sketch.

## PRIOR EVIDENCE

- `statediff.py:1` describes the (desired, prior, prev_may_be_missing) → action model.
- `statediff.py:52`: `DiffAction = Literal["insert", "upsert", "replace", "delete"]`.
- `statediff.py:85`: `TrackingRecordTransition` bundles desired + prev collection + prev_may_be_missing flag.
- `statediff.py:149`: `diff()` decision tree (NON_EXISTENCE → delete, differing prev → replace, missing prev → insert, matching-incomplete → upsert, converged-complete → None).
- `statediff.py:189`: `diff_composite()` extends to main record + keyed substates.
- Our `memory-index.ts:26`: imports `runPostMutationHooks`.
- Our `memory-index.ts:351`: wraps scan invalidation hooks.
- Our `memory-index.ts:369`: invokes hooks after stale deletes.
- Our `memory-index.ts:567`: defers stale cleanup on replacement-indexing failures.

## INVESTIGATION TARGETS

**Cocoindex side — desired/prior plumbing:**
1. Read `external/cocoindex-main/python/cocoindex/connectorkits/statediff.py` in full (we saw header + signatures; need the actual diff logic body and any helpers).
2. Search for `CompositeTrackingRecord` / `TrackingRecord` / `prev_may_be_missing` usage across `external/cocoindex-main/python/cocoindex/connectorkits/` and `connectors/` — how are connectors expected to produce these inputs?
3. Read one connector that uses statediff (e.g., a postgres `_target.py` or similar) to see how `diff()` results drive actual SQL.

**Our side — current reconciliation paths:**
4. Find `runPostMutationHooks` definition. List all callers via `rg -l 'runPostMutationHooks'`. Each callsite represents an ad-hoc reconciliation that statediff would replace.
5. Find `alias` / `divergence` / `conflict` reconciliation handlers in `.opencode/skills/system-spec-kit/mcp_server/`. How many separate handlers? Are they consistent in shape?
6. Read `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` (the bulk-mutation handler) — what's the desired/prior comparison shape there, if any?
7. Read causal-graph mutation paths (memory_causal_link, memory_causal_unlink): is there a (desired, prior) → action reconciliation, or only direct inserts/deletes?

## ANALYSIS DELIVERABLE

**Coverage map**: which mutation paths in spec_kit_memory benefit from statediff, and which don't?

| Mutation Path | Current Approach | Would benefit from statediff? | Why? |
|--------------|------------------|------------------------------|------|
| `memory_index_scan` discovery | Ad-hoc `runPostMutationHooks` | ? | ? |
| `memory_save` single-doc | Direct upsert | ? | ? |
| `memory_bulk_delete` | Direct deletes + sweep | ? | ? |
| Causal edge upserts | Direct insert/replace | ? | ? |
| Alias/divergence reconciliation | Separate handlers | ? | ? |
| Embedding re-index (K1.1 DAG) | (Planned) | ? | ? |

**Verdict on K1.3**: YES / YES-WITH-ADAPTATION / NO + one-paragraph justification.

If YES or YES-WITH-ADAPTATION, sketch:
- Unified TS interface for `(desiredRows, priorRows) → DiffAction[]`.
- TS literal type analogous to `DiffAction` (`"insert" | "upsert" | "replace" | "delete"`).
- Helper module location (e.g., `mcp_server/lib/storage/statediff.ts`).
- 2-3 concrete refactor targets (which ad-hoc hooks become statediff-driven first?).

## CONSTRAINTS

- LEAF. Max 12 tool calls.
- Cite verbatim file:line.
- No special regex chars in JSONL `focus`.

## OUTPUT CONTRACT

1. `research/iterations/iteration-004.md` — sections: Focus, Actions Taken, Findings, Coverage Map, Verdict on K1.3 + handler sketch, Questions Answered, Questions Remaining, Next Focus.

2. JSONL appended to state.jsonl with `{"type":"iteration","iteration":4,...,"focus":"k1-3-statediff-reconciliation-port",...}`.

3. `research/deltas/iter-004.jsonl`.

Stop: 10 min wall, ≤12 tool calls.

Go.
