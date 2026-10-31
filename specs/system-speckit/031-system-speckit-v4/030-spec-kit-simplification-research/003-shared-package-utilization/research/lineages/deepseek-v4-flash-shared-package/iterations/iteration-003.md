# Iteration 3: L3/L9 verification — VOYAGE spelling, dtype home, error class, shard method, README config table

## Focus

Verify the confirmed-findings L3 (env-var ledger/Voyage spelling) and L9 (dead types, diverged contracts, stale exports) fixes landed; then grade the rewritten README §5 configuration table against a fresh env-var census of the current tree.

## Findings

| # | path:line | Claimed (fix) | Observed | Severity | Recommendation |
|---|-----------|---------------|----------|----------|----------------|
| R3-01 | `shared/README.md:185-197` (§5 config table) | "Every variable this package reads, grouped by the code that reads it" | Variables: complete (28 vs the previous 7-of-24). Readers: **incomplete/wrong in three groups** — (a) Ollama group: `OLLAMA_REQUEST_TIMEOUT_MS` and `OLLAMA_BASE_URL` are read by `embeddings/adapters/ollama.ts` (per-file census), which the table does not name; it names providers/ollama.ts + profile.ts. (b) HF group: `HF_EMBEDDINGS_MODEL`/`HF_EMBEDDINGS_DTYPE` are also read by `factory.ts` and `profile.ts`; the table names only hf-local.ts. (c) OpenAI group: `OPENAI_API_KEY` is read by `profile.ts` (hasUsableApiKey) too; omitted. | **P2** | fix: correct the three "Read by" cells (or say "representative readers") |
| R3-02 | `embeddings/types.ts:21`, `embeddings/providers/hf-local.ts:122-123`, `shared/types.ts:5` | HfLocalDtype moved to the embedding types | Landed: defined in `embeddings/types.ts:21`, provider re-exports it (`hf-local.ts:123`), `types.ts:5` imports from the types module. The inversion (types importing from a provider implementation) is gone. | P2 (verified-positive) | (none) |
| R3-03 | `embeddings/registry.ts:113` + no checked-in export + checked-in `registry.test.ts` (no import) | EmbedderNotConfiguredError made internal | Landed: class defined without `export`; only stale-worktree `dist/` references it; the checked-in test no longer imports it. | P2 (verified-positive) | (none) |
| R3-04 | sweep: `VOYAGE_API_URL`, `getVectorShardPath` | 2-spelling bug family and shard method removed | Both = 0 hits in checked-in source. `VOYAGE_BASE_URL` is read consistently by profile.ts:243, voyage.ts:25-26, auto-select.ts:148 (via the injected env param — same spelling). | P2 (verified-positive) | (none) |
| R3-05 | `algorithms/rrf-fusion.ts:59,262,277,348,744,755` | README lists `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS` as read by rrf-fusion | Correct: read via `RETRIEVAL_PROFILE_FLAG` constant + `isRetrievalProfileWeightsEnabled(env)`; the other four RRF flags are direct `process.env` reads. README row matches code. | P2 (verified-positive) | (none) |

## Ruled out this iteration

- Round-one L9 rows where the fix is verified complete (R3-02..R3-05 controls) — no re-listing.
- The env-var *count* (28) vs round one's 24: the delta is the re-derived census (VOYAGE_BASE_URL/auto-select etc.), not new surface — no count reuse, no claim beyond this table.

## Sources Consulted

- Per-variable per-file census over `shared/**/*.ts` (checked-in, tests excluded) — 28 distinct env vars
- Bracket-notation env-read sweep (`process.env[...]`), `hf-local.ts:100`, `rrf-fusion.ts:59,277`
- README §5 table rows vs census; `shared/README.md` §2 verify-installation list vs `ls` (all rows exist)
- `registry.ts` class export status; `registry.test.ts` import block
- `auto-select.ts:148`, `voyage.ts:19-26`, `profile.ts:243` (VOYAGE_BASE_URL)

## Assessment

- newInfoRatio: 0.7 — largely verification; the new evidence is R3-01 (the README's own "by the module that reads it" claim fails for 3 of 9 groups) plus four verified-positive controls.
- Confidence: high (direct census + read of each site).

## Reflection

- Worked: running the census per-variable per-file instead of trusting the README's grouping — the drift surfaced only in the reader columns, not in the variable list.
- Failed: slight cost — the first "all env reads" pass used dot-notation only and missed `env.VOYAGE_BASE_URL` param reads; corrected with a per-file grep before writing the row.
- Ruled out: dist as evidence; the stale registry.test.js import.

## Recommended Next Focus

Iteration 4: L8 verification — the model-server-constants parity test: does it read both declaration sites (shared client vs bin scripts), and do the declarations still match; then the L7 recorded decision (advisor half-isolation) with fresh eyes: is the unicode duplication + its CI still present, and is the isolation boundary still drawn mid-package.
