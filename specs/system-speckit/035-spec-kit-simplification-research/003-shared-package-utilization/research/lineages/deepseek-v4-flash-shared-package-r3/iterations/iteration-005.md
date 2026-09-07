# Iteration 5 — The generated README reader table (shared/README.md §5)

Angle: read shared/README.md and the generator that produces its reader table (named in the README or in shared/package.json scripts); compare the table against the barrel and against one consumer per row.

Premise check first: neither the README nor shared/package.json:17 scripts names a generator. Searched the whole tree for a script emitting the table's distinctive strings ("| Group | Variables | Read by |", the row headers, "Provider selection", "SPECKIT_RETRIEVAL_PROFILE_WEIGHTS" emitters) — no generator exists anywhere: no .ts/.cjs/.mjs/.py/.sh produces this table. This contradicts the census R3-01 disposition ("Fixed: every row is now computed from the files that read the variables"): no computation exists; the table is hand-maintained markdown.

## Findings

1. **R3-I5-01 (P1) The reader table has no generator — the census's R3-01 "every row is now computed from the files that read the variables" is not true in this tree.**
   Claim side: spec-kit census row R3-01 disposition ("Fixed: every row is now computed from the files that read the variables").
   Actual side: README.md §5 (lines 179-195) contains the table; no script in shared/, runtime/, .opencode/bin or .github emits or validates it (grep for the table's header strings and row vocabularies returns only the README itself and unrelated files). shared/package.json scripts = build/typecheck/test only. Whatever produced the rows produced them once, by hand or one-off, and nothing keeps them honest.
   Severity: P1 wrong (claimed mechanism absent). Recommendation: either write the generator (a tiny env-scanner over shared/**/*.ts emitting the table) or change the census disposition and README §5 note to "manually maintained, verified by audit" so the next auditor knows.

2. **R3-I5-02 (P1) §5 Text-helpers row attributes chunking.ts and utils/retry.ts to "the save pipeline, the hooks" — no such consumers exist.**
   Claim side: README.md:37 — `chunking.ts`, `utils/retry.ts` ... | the save pipeline, the hooks, the embedding providers.
   Actual side: the only prod importers of chunking.ts are shared-internal (embeddings/providers/ollama.ts:7, hf-local.ts:13, relative imports inside the package); the only prod importers of utils/retry.ts are shared-internal too (embeddings/providers/openai.ts:7, voyage.ts:7). Zero runtime/, runtime/cli/ or hooks/ imports of either (grep over runtime including cli/continuity and core: no hits; the one hit is a history comment in runtime/cli/evals/check-source-dist-alignment.ts:8 about a removed file). "The embedding providers" is true but they live inside the package, so neither module has an external consumer to speak of.
   Severity: P1 wrong (reader column overstates consumers for two of seven rows' modules). Recommendation: fix the row to say "embedding providers (inside package)"; drop the save pipeline / hooks claims.

3. **R3-I5-03 (P2) §5 Provider-selection row omits a real reader of EMBEDDINGS_PROVIDER.**
   Claim side: README.md:185 — `EMBEDDINGS_PROVIDER`, `EMBEDDING_DIM` | `embeddings/factory.ts`, `embeddings/profile.ts`.
   Actual side: embeddings/auto-select.ts:501 reads `context.env.EMBEDDINGS_PROVIDER` (to reorder the cascade), so auto-select is a reader of EMBEDDINGS_PROVIDER and is not in the row. The row's own convention (group by the code that reads it) is violated.
   Severity: P2 wrong. Recommendation: add `embeddings/auto-select.ts` to the row.

4. **R3-I5-04 (P2) §5 Database-directory row lists config.ts as a reader of MEMORY_DB_PATH per the grouped-rows convention, making per-row reads ambiguous.**
   Claim side: README.md:192 — `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR`, `MEMORY_DB_PATH` | `config.ts`, `embeddings/factory.ts`, `embeddings/providers/hf-local.ts`.
   Actual side: config.ts:47 reads only SPEC_KIT_DB_DIR/SPECKIT_DB_DIR; MEMORY_DB_PATH is read by factory.ts and hf-local.ts only. The row is a union (each reader reads at least one listed var), so it is not false, but the grouped convention makes a reader appear to read every var in the row — the same ambiguity the census R3-01 fix was supposed to remove.
   Severity: P2 cosmetic. Recommendation: while writing the generator, emit per-variable reader cells or an explicit "reads only" column.

5. **R3-I5-05 (P2) §3 Key Files row "gate-3-classifier.ts | for every runtime's prompt hook" overstates: the hooks consume it via dist through one shared core, and the pi plugin imports the hook core, not the classifier.**
   Claim side: README.md:142 — gate-3-classifier.ts "Decides whether a prompt will write, for every runtime's prompt hook"; §1 table row Gate 3 "the prompt hooks of every runtime, the pi plugin, the spec-root registry".
   Actual side: imports of the classifier exist only in runtime/hooks/lib/spec-gate/spec-gate-core.mjs:54 (from dist) and runtime/hooks/cursor/spec-gate-prebind.mjs:25 (from dist); the pi plugin (hooks/pi/spec-gate-classify.ts:11, spec-gate-enforce.ts:20) imports spec-gate-core.mjs, not the classifier; spec-root-registry.ts:92 references it only in a comment string (source-file citation), not an import.
   Severity: P2 cosmetic (the consumption chain is real but indirect; "the spec-root registry" as a consumer is a comment, not an import).
   Recommendation: reword to "the spec-gate hook core (cursor + pi plugin), which imports the compiled classifier".

## Verified correct (no finding)

- §5 rows that match the actual env reads, per-file (grep of process.env reads): Ollama row's 5 readers all read at least one of the listed vars (factory/base+model, profile/base+model, providers/ollama/base+model, adapters/ollama/base+timeout, auto-select/base via its own resolveOllamaBaseUrl at line 155); HF row (hf-local.ts reads all six + MEMORY_DB_PATH; factory reads 3; profile reads 2; auto-select reads HF_EMBEDDINGS_MODEL at 441); OpenAI row (auto-select reads key+base at 322-374 via resolveOpenAiBaseUrl); Voyage row (auto-select reads key+base at 329-334); Cascade row (auto-select alone, exact); IPC row (ipc/socket-server.ts reads exactly the two); Rank fusion row (rrf-fusion.ts reads all five: SPECKIT_RRF, SPECKIT_RRF_K, SPECKIT_SCORE_NORMALIZATION, SPECKIT_CALIBRATED_OVERLAP_BONUS at process.env, SPECKIT_RETRIEVAL_PROFILE_WEIGHTS via RETRIEVAL_PROFILE_FLAG env[] at line 278).
- §3 "What lives here" consumer columns for frontmatter/parsing, compaction, paths/workspace, predicate grammar, embedding providers, ranking and IPC rows are consistent with the importer evidence collected in iterations 1 and 3 (parseFrontmatter consumers, compact-inject.ts for PreCompact, repo-root.mjs by 6+ cjs scripts + CI, boolean-expr documentary contract, rrf-fusion by the advisor's fusion.ts, socket-server by the advisor).
- §3 Key Files "more than twenty importers" for parse-frontmatter was NOT re-counted in this iteration (call budget); treat the number as unverified. The structure tree matches the directory listing (no stale entries; algorithms/ has only rrf-fusion.ts, matching census L1's removal).

## Open questions

- O8: If the reader table is hand-maintained (no generator), which packet or commit last touched §5 and with what evidence? The census R3-01 says child work fixed it; the fix's shape contradicts the "computed" wording.
- O9: Does any CI job or doctor command re-check that a row's readers all exist? (None found in the workflow files read in iteration 4 — the spec-kit-check workflow runs shared tests and vitest, neither of which validates the README.)
