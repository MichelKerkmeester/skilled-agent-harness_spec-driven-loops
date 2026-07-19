# Deep-Research Iteration 5 — K1.4 deep-dive: incremental chunked embeddings + stable identity

## BINDING CONTRACT (pre-answered — do NOT re-ask)

- **Gate 3 answer**: **A) Use existing spec folder** = `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/`. Do NOT ask which spec folder.
- **Skill routing**: Do NOT invoke other skills via slash commands. You ARE the deep-research iteration.
- **Sub-agent dispatch**: FORBIDDEN. LEAF agent.
- **Mode**: Execute directly. No clarification questions, no setup prompts.

## STATE

Iteration: 5 of 10
Answered: K2.4 (166 callsites), K1.1 (YES-WITH-ADAPTATION DAG memoization), K1.2 (YES-WITH-ADAPTATION causal lifecycle), K1.3 (YES-WITH-ADAPTATION statediff)
Remaining: **K1.4** (this iter), K1.5, K1.6, K2.1, K2.2, K2.3, K2.5
Last 3 ratios: 0.76 -> 0.62 -> ? | Stuck: 0

## FOCUS

**K1.4 — Should spec-doc embeddings be chunked (by frontmatter / H2 sections) with per-chunk fingerprint so editing one section of a long spec doesn't re-embed the whole doc?**

PLUS: address the **stable-identity blocker** flagged in iter-4's next-focus — how do chunk identities survive heading renames, section reorders, and split/merge operations without invalidating unchanged chunks?

Verdict: YES / YES-WITH-ADAPTATION / NO + concrete chunking + identity scheme.

## PRIOR EVIDENCE

- iter-1: our `memory-index.ts` re-embeds whole docs on any content change (single-pass, no chunk-level skip).
- iter-2/K1.1: SQLite memo tables can hold `(input_fingerprint, code_hash) → output_blob` per node; works for chunks too.
- Cocoindex reference: `external/cocoindex-main/examples/code_embedding/` is the canonical "only changed chunks re-embed" example.
- iter-4: stable identity is a hard precondition — without it, "changed chunk" is undecidable.

## INVESTIGATION TARGETS

**Cocoindex side — chunked embedding example:**
1. Read `external/cocoindex-main/examples/code_embedding/main.py` (or equivalent) in full. How are files chunked? Per-chunk fingerprint computed how? How are chunks identified across runs (positional? content-hash? AST path?)?
2. Look for `chunk_id`, `chunk_key`, `start_line`, `end_line`, or similar identity carriers. Is identity content-derived or position-derived?
3. Check `external/cocoindex-main/python/cocoindex/ops/` for any `split_text` / `chunk_by_lines` / `chunk_by_ast` ops. Which strategies ship by default?

**Our side — current embedding plumbing:**
4. Read `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` or wherever spec docs get parsed into indexable units. What's the current granularity (whole doc / paragraph / section)?
5. Read `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` — does `memory_index` schema support multiple rows per doc (chunks), or one row per doc only?
6. Read `handlers/memory-save.ts` and `handlers/memory-index.ts` to find where `generateEmbedding()` is invoked per content unit. Could the loop body shift from doc-level to chunk-level cheaply?

**Cross-cutting — stable identity for chunks:**
7. Survey how spec docs are typically structured (look at `27 children of 027` for shape diversity). Are H2/H3 boundaries stable enough to use as chunk identity? Or do frontmatter `_memory.continuity` blocks + `<!-- ANCHOR:name -->` markers give us stable identity?

## ANALYSIS DELIVERABLE

**Chunking strategy decision:**

| Strategy | Identity | Re-embed cost on minor edit | Pros | Cons |
|----------|----------|----------------------------|------|------|
| Whole-doc (current) | path | Full doc | Simple | Wasteful for long docs |
| Per-H2-section, identity=heading-slug | section heading | Only changed section | Author-friendly | Heading renames break identity |
| Per-H2-section, identity=anchor-id | `<!-- ANCHOR:* -->` | Only changed section | Stable across renames | Requires authoring discipline |
| Per-fixed-token-window | start/end token offsets | Affected windows | Mechanical | Brittle on edits before window |
| Per-frontmatter-block + per-section | mixed | Block + affected sections | Captures metadata separately | More schema work |

**Verdict on K1.4**: YES / YES-WITH-ADAPTATION / NO + one-paragraph justification.

If YES or YES-WITH-ADAPTATION, sketch:
- SQLite schema: new column on `memory_index` (`chunk_id`, `chunk_seq`, `chunk_fingerprint`, `parent_doc_id`) OR a new `memory_chunks` table joined to `memory_index`.
- Identity scheme: anchor-id-based (preferred) vs heading-slug (fallback) vs positional (last resort).
- Migration: how to chunk existing docs without re-embedding them all on day-1.
- Effect on retrieval: do we return chunks (more granular results) or aggregate back to docs (current UX)?

## CONSTRAINTS

- LEAF. Max 12 tool calls. Cite file:line.
- No special regex chars in JSONL `focus` field.

## OUTPUT CONTRACT

1. `research/iterations/iteration-005.md` — Focus, Actions Taken, Findings, Chunking Strategy Decision Matrix, Verdict on K1.4 + schema/identity sketch, Questions Answered, Questions Remaining, Next Focus.

2. JSONL appended with `{"type":"iteration","iteration":5,...,"focus":"k1-4-chunked-embeddings-stable-identity",...}`.

3. `research/deltas/iter-005.jsonl`.

Stop: 10 min wall, ≤12 tool calls.

Go.
