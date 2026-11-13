# Iteration 2: Intent-signal enrichment and re-embedding of the skill graph

## Focus

Question (b): intent-signal enrichment and re-embedding of the skill graph, declined in segment two at rank 15 ("It moves no row of the chat set today, needs its own real-embedding capture and carries the highest floor risk"). Measure which tune rows it would move, its risk to the floors, and the cost of keeping the vectors in step with the metadata, without writing outside this lineage.

## Actions Taken

1. Read the segment-two disposition at `research-segment-2.md:56` (rank 15) and the phase 012 and 013 summaries for the built state.
2. Ran `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs --real-embedding` (no `--write`) against the already-running Ollama server (`nomic-embed-text:v1.5`) and saved the JSON to `prompts/real-embed-capture.json`.
3. Diffed that capture's tune rows against the committed fixture capture on `top` and `top1`, and cross-read the 17 no-command rows from iteration 1.
4. Read the embedding path: `skill-graph-db.ts` (`skillDescriptionForEmbedding`, `computeContentHash`, `refreshSkillEmbeddingsViaAdapter`), `lanes/semantic-shadow.ts` (fixture vector text and the exact-vector path), `scorer/projection.ts` (`buildEmbeddingStalenessVerdict`).
5. Read the vector store read-only: `sqlite3 -readonly` reports 14 rows in `vec_768` and 46 in `vec_cmd_768`; `skill-graph.sqlite` is 561,152 bytes; `find .skilled/skills -maxdepth 2 -name SKILL.md | wc -l` prints 14.
6. Ran `node .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs` against the running server and saved `prompts/embedder-cost.json`.
7. Read `command-bridges.generated.json` entries: each command already carries `ownedSignals`, `intentSignals` and a composed `embeddingText` (`"I want to <description>. <signal>. <signal>"`).

## Findings

1. The real-embedding capture reads plain tune combined 28 of 45 (own 13, attached 15) and holdout 3 of 44, against the committed fixture capture's 23 and 1. Typed stays 44 of 44 (24 own, 20 attached) and false offers stay 0 of 35. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json]

2. That 28 is the same total iteration 1 measured at the brief (27 head commands plus 1 `Also:` line), so the live measurement regime is the real-embedding regime and the committed fixture baseline's 23 is a regime gap, not a regression. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl]

3. Exactly five tune rows move under the real embedder and all five already carried a command in the brief: `cmd-doctor-env`, `cmd-doctor-git`, `cmd-doctor-symlink`, `cmd-speckit-handoff` and `cmd-speckit-plan` each go from `top1: false` to `top1: true` with no loss. The gain is top-1 exactness on rows that already offer a command, not reach. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json]

4. None of the 17 no-command rows gains a command from re-embedding. Five of them already have the expected owner inside the top three, and each is blocked by a non-semantic cause (duplicate suppression, a needs-mode defer, or a mode with no command); the other twelve have the owner absent from the top three or no recommendation at all. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl]

5. The real semantic lane embeds less text than the fixture lane. The stored skill vector is the `SKILL.md` frontmatter description alone, while the fixture vector is composed from the skill's name, description, domains, `intentSignals` and `derivedTriggers`, so intent signals reach the cosine lane only under the fixture regime. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:737] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:258]

6. Keeping vectors in step is incremental by construction. Skill refresh compares the stored `vec_content_hash` and `vec_model_id` and skips a row whose text and model are unchanged; only an edited description or a changed model causes an embedding call. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1413]

7. The measured cost is small at this corpus size: 60 vectors (14 skill + 46 command) at 768 dimensions in a 561 KB SQLite file. `measure-embedder-cost.mjs` reads a warm median of 5.95 ms and p95 of 8.97 ms per embed with the model resident (runner RSS 265,792 KB); re-embedding all 14 skill descriptions is about 83 ms and all 60 vectors about 357 ms, before loop overhead. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/embedder-cost.json]

8. Drift is already detectable without a new mechanism: per-row `vec_content_hash` catches text drift at refresh, and `readAdvisorEmbeddingStaleness` compares the active embedder pointer's model and dimension against the stored vector summary and returns `stale` with a reason. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1621]

9. Verdict for rank 15: the measured brief-level gain of enrichment and re-embedding is zero commands on the tune split, because the five rows the vector change moves already offer their command. The floor risk is real but bounded: the real-embedding regime itself holds 0 of 35 false offers and typed 44 of 44, yet rewriting all 14 embedded texts reranks every skill globally and cannot be measured without writing the vectors. Rank 15 stays declined. [INFERENCE: based on findings 1 to 8]

## Ruled Out

- Reopening rank 15 on the real-embedder numbers alone. The +5 tune rows are top-1 exactness on rows that already carried a command; they do not move a single no-command row, so the disposition does not change.
- Treating the fixture capture's 23 and the real capture's 28 as a before/after pair. They are two scoring regimes at one commit.
- Adding intent text to the 14 `SKILL.md` descriptions. That is an operator-facing document change in `sk-doc` scope, not a routing fix, and it changes bytes the model reads.

## Dead Ends

- Measuring an enriched re-embedding without writing vectors. No read-only switch composes the enrichment, so the only honest statement is the bounded projection in finding 9.
- Using the holdout delta (1 to 3 of 44) as evidence for enrichment: it is the same real-embedder effect, and holdout prompt text was not read.

## Edge Cases

- Ambiguous input: "re-embedding of the skill graph" could mean rebuilding the 14 skill vectors or the 46 command vectors. Both are priced in finding 7; the skill vectors are the ones whose text the code composes from metadata.
- Contradictory evidence: the committed baseline says 23, the real capture says 28, and both are correct for their regime. Finding 2 records the resolution.
- Missing dependencies: cold-start cost could not be re-measured because the model was already resident (`coldReason: "model already loaded"`); the warm path is what a refresh pays in practice.
- Partial success: none; every planned measurement ran.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md:56`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/embedder-cost.json`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:737`, `:1413`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:258`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1621`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`
- `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` (read-only counts)

## Assessment

- New information ratio: 0.8
- Questions addressed: whether intent-signal enrichment and re-embedding would move the remaining plain tune rows; its risk to the floors; the cost of keeping vectors in step with metadata
- Questions answered: Would intent-signal enrichment and re-embedding of the skill graph move the remaining plain tune rows, and at what risk to the floors? What does keeping the embedding vectors in step with the metadata cost, and how is drift detected?

## Reflection

- What worked and why: running the real-embedding capture against the already-running server turned a declined hypothesis into a bounded measurement, and diffing `top1` per row showed that the five moved rows were already reachable.
- What did not work and why: the first pass compared `top` ids across the two captures and read one loss that was not there; `top1` is the field that matches the metric, and the id strings differ by mapping table.
- What I would do differently: start from the brief-level row table and ask which rows could possibly move, before pricing an embedder change.

## Recommended Next Focus

Question (g), unassigned to a lane: the degraded fallback path when the advisor daemon is unreachable. Read `012-plain-offer-reach/scratch/live-heads.txt`, then the fallback writer and the freshness reader, to name which runtimes reach that path, how often, and the smallest change that makes the fallback answer carry the same command as the live answer.
