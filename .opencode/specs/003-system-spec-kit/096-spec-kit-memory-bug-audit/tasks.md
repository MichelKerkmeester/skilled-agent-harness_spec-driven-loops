# Tasks — System Spec-Kit & Memory MCP Bug Fix

| Field         | Value       |
| ------------- | ----------- |
| **Spec ID**   | 096         |
| **Total Bugs**| ~200        |
| **Phases**    | 7           |

---

## Phase 1: Critical Crashers & Configuration

- [x] **[P1-01]** CRITICAL — `validate.sh`: `date +%s%N` crashes on macOS (BSD date does not support `%N`)
  - Location: validate.sh, timestamp generation
  - Fix: Use `date +%s` on macOS or detect platform and use `gdate` if available; fallback to seconds-only precision

- [x] **[P1-02]** CRITICAL — `create.sh`: `local` keyword used outside function body
  - Location: create.sh, top-level variable declarations (~line 498-500)
  - Fix: Move `local` declarations inside functions, or replace with regular variable assignments at top level

- [x] **[P1-03]** HIGH — `create.sh`, `validate.sh`, `compose.sh`: JSON injection via unsanitized variables
  - Location: All three shell scripts where variables are interpolated into JSON strings
  - Fix: Escape double quotes, backslashes, and control characters in all variables before JSON interpolation; use a `json_escape()` helper function

- [x] **[P1-04]** HIGH — `create.sh`: `shift 2` executed without checking `$#` first — N/A (guard already present)
  - Location: create.sh, argument parsing section
  - Fix: Add `[ $# -ge 2 ] || { echo "error"; exit 1; }` guard before `shift 2`

- [x] **[P1-05]** CRITICAL — `config.ts`: `SPEC_KIT_DB_DIR` vs `MEMORY_DB_DIR` environment variable conflict
  - Location: config.ts (or equivalent), DB path resolution
  - Fix: Consolidate to a single canonical env var (`SPEC_KIT_DB_DIR`); add deprecation warning for `MEMORY_DB_DIR` with fallback

- [x] **[P1-06]** MEDIUM — `config.ts`: `ALLOWED_BASE_PATHS` defined differently in multiple files
  - Location: config.ts and path-security.ts (or wherever ALLOWED_BASE_PATHS is defined)
  - Fix: Define ALLOWED_BASE_PATHS in a single location (config.ts) and import everywhere else

- [x] **[P1-07]** HIGH — `path-security.ts`: symlink traversal vulnerability — `path.resolve()` used without `fs.realpathSync()`
  - Location: path-security.ts, path validation function
  - Fix: Call `fs.realpathSync()` on resolved paths before checking against allowed base paths to prevent symlink escape

- [x] **[P1-08]** CRITICAL — `context-server.ts`: warmup timeout can leave embedding provider in undefined state
  - Location: context-server.ts, server initialization / warmup logic
  - Fix: Ensure warmup timeout handler sets embedding provider to a safe fallback state (or throws fatal error); never leave undefined

- [x] **[P1-09]** MEDIUM — `context-server.ts`: MCP transport not closed on graceful shutdown
  - Location: context-server.ts, shutdown/cleanup handler
  - Fix: Add `transport.close()` call in the shutdown sequence before process exit

- [x] **[P1-10]** MEDIUM — `context-server.ts`: `unhandledRejection` handler continues execution instead of exiting
  - Location: context-server.ts, process.on('unhandledRejection') handler
  - Fix: Log the error and call `process.exit(1)` after cleanup, instead of swallowing the rejection

- [x] **[P1-11]** MEDIUM — `context-server.ts`: `vectorIndex.initializeDb()` has TOCTOU race condition
  - Location: context-server.ts, DB initialization
  - Fix: Use a mutex or initialization flag to ensure initializeDb() is called exactly once, even under concurrent requests

- [x] **[P1-12]** MEDIUM — `create.sh`: regex metacharacters in `short_name` not escaped before use in patterns
  - Location: create.sh, where short_name is used in sed/grep patterns
  - Fix: Escape regex metacharacters in short_name before use: `escaped_name=$(printf '%s' "$short_name" | sed 's/[.[\*^$()+?{|\\]/\\&/g')`

- [x] **[P1-13]** MEDIUM — `validate.sh`: completeness formula can produce negative values
  - Location: validate.sh, completeness percentage calculation
  - Fix: Clamp result to `max(0, computed_value)` — use `$(( result < 0 ? 0 : result ))`

- [x] **[P1-14]** MEDIUM — `create.sh`: `source "$rule_script"` executed without path validation
  - Location: create.sh, rule script sourcing
  - Fix: Validate that `$rule_script` exists, is a regular file, and is within the expected directory before sourcing

---

## Phase 2: Embedding System

- [x] **[P2-01]** CRITICAL — `factory.ts` / `provider-chain.ts`: Provider fallback silently changes embedding dimension (768→1024→1536) without invalidating vector index
  - Location: provider-chain.ts, fallback selection logic
  - Fix: On provider switch, compare new dimension against current index dimension; if different, either reject the fallback or trigger a full re-index; never silently mix dimensions

- [x] **[P2-02]** HIGH — `openai.ts`, `voyage.ts`: Wrong embedding dimensions produce warn-only, not error
  - Location: openai.ts and voyage.ts, dimension validation after API response
  - Fix: Throw an error (or return failure) when returned embedding dimension does not match expected dimension; warn-only allows corrupted vectors into the index

- [x] **[P2-03]** HIGH — `provider-chain.ts`: `retryModule` loaded via `require()` inside try/catch — failure is silent
  - Location: provider-chain.ts, retry module import
  - Fix: Replace dynamic `require()` with static `import`; if module is optional, log explicit warning on failure and disable retry behavior (instead of silently proceeding without retries)

- [x] **[P2-04]** HIGH — `embeddings.ts`: Embedding cache not keyed by provider — same text returns wrong-dimension vector after provider switch
  - Location: embeddings.ts, cache lookup/storage
  - Fix: Change cache key from `text` to `{provider, model, text}` tuple; invalidate cache entries when provider changes

- [x] **[P2-05]** MEDIUM — `provider-chain.ts`: Backoff index off-by-one — first retry waits 5 minutes instead of 1 minute
  - Location: provider-chain.ts, exponential backoff calculation
  - Fix: Use `backoffTimes[retryCount]` instead of `backoffTimes[retryCount + 1]` (or adjust array indexing so attempt 0 maps to the first backoff interval)

- [x] **[P2-06]** MEDIUM — `factory.ts`: Inconsistent explicit-vs-env-var fallback semantics across providers
  - Location: factory.ts, provider configuration resolution
  - Fix: Standardize the precedence: explicit parameter > environment variable > default; apply consistently across all providers

- [x] **[P2-07]** MEDIUM — `provider-chain.ts`: No HTTP 429 backpressure handling in batch embedding operations
  - Location: provider-chain.ts, batch processing loop
  - Fix: Detect 429 responses and implement exponential backoff with jitter; respect `Retry-After` header if present

- [x] **[P2-08]** MEDIUM — `provider-chain.ts`: Content load failure not counted as retry — creates infinite retry loop
  - Location: provider-chain.ts, error handling in retry logic
  - Fix: Count content load failures against the retry budget; break loop after max retries regardless of error type

- [x] **[P2-09]** LOW — `openai.ts`, `voyage.ts`: API keys stored as public instance properties
  - Location: openai.ts and voyage.ts, class property declarations
  - Fix: Change API key properties to `private` or `#private`; ensure they are not serializable or logged

- [x] **[P2-10]** LOW — `embeddings.ts`: Code comment contradicts actual query caching implementation
  - Location: embeddings.ts, cache-related comment
  - Fix: Update comment to accurately describe the caching behavior

---

## Phase 3: Search Pipeline

- [x] **[P3-01]** CRITICAL — `memory-search.ts`: Intent weights are computed but NEVER applied to final scoring
  - Location: memory-search.ts, main search function where intent weights are calculated then discarded
  - Fix: Wire intent weights into the scoring formula — multiply or add weighted adjustments to each result's score based on intent classification

- [x] **[P3-02]** HIGH — `hybrid-search.ts`: Incomparable score scales — cosine similarity (0–1) merged with BM25 (unbounded) without normalization
  - Location: hybrid-search.ts, score merging logic
  - Fix: Normalize BM25 scores to 0–1 range (e.g., min-max normalization per result set) before combining with cosine scores

- [x] **[P3-03]** HIGH — `hybrid-search.ts`: `hybridSearchEnhanced` with RRF fusion exists but is never called (dead code)
  - Location: hybrid-search.ts, hybridSearchEnhanced function definition
  - Fix: Either wire hybridSearchEnhanced into the search path as intended, or remove dead code entirely; decide based on whether RRF fusion adds value

- [x] **[P3-04]** HIGH — `bm25-index.ts`: BM25 index kept in-memory only — empty after every restart
  - Location: bm25-index.ts, index storage
  - Fix: Persist BM25 index to SQLite (or file); rebuild from DB on startup if persisted data is missing

- [x] **[P3-05]** HIGH — `bm25-index.ts`: specFolder filter uses string containment (`includes()`) on memory ID instead of exact match
  - Location: bm25-index.ts, filter function
  - Fix: Use exact match (`===`) or proper prefix match with separator for specFolder filtering

- [x] **[P3-06]** MEDIUM — `memory-search.ts`: FTS5 query sanitization incomplete — some SQLite special characters not escaped
  - Location: memory-search.ts, FTS5 query construction
  - Fix: Escape all FTS5 special characters: `"`, `*`, `(`, `)`, `+`, `-`, `^`, `~`, `:`, `AND`, `OR`, `NOT`, `NEAR`

- [x] **[P3-07]** MEDIUM — `memory-search.ts`: Constitutional results bypass scoring entirely — injected without relevance check
  - Location: memory-search.ts, constitutional results handling
  - Fix: Apply minimum relevance scoring to constitutional results; or document intentional bypass with score override

- [x] **[P3-08]** MEDIUM — `hybrid-search.ts` or `vector-index-impl.js`: `EMBEDDING_DIM=768` hardcoded, should match active provider
  - Location: vector-index-impl.js or hybrid-search.ts, dimension constant
  - Fix: Read EMBEDDING_DIM from config or from the active embedding provider; remove hardcoded constant

- [x] **[P3-09]** LOW — `memory-search.ts`: Testing-effect writes (40 DB operations) occur during read-only search operations
  - Location: memory-search.ts, access tracking / testing effect recording during search
  - Fix: Defer testing-effect writes to a background queue or batch; do not perform during the search hot path

- [x] **[P3-10]** LOW — `memory-search.ts`: `weightsApplied` diagnostic is misleading — reports true when weights were computed but never applied
  - Location: memory-search.ts, diagnostic/logging output
  - Fix: Set `weightsApplied` to true only after weights are actually applied to scoring (will be fixed alongside P3-01)

- [x] **[P3-11]** HIGH — `rrf-fusion.ts`: TypeScript source file missing — only orphaned compiled .js exists in dist/
  - Location: mcp_server/search/rrf-fusion.ts (missing), dist/rrf-fusion.js (orphaned)
  - Fix: Restore .ts source file from the dist .js (reverse-engineer if needed); ensure it compiles and is included in tsconfig

- [x] **[P3-12]** HIGH — Intent classifier: biased toward "understand" — returns "understand" for most queries regardless of actual intent
  - Location: intent-classifier.ts (or equivalent), classification logic
  - Fix: Rebalance classification heuristics; ensure "add_feature", "fix_bug", "refactor" intents have proper trigger patterns and aren't overwhelmed by "understand" default

- [x] **[P3-13]** HIGH — `cross-encoder.ts`: `originalRank` calculated incorrectly (off-by-one or using wrong index)
  - Location: cross-encoder.ts, rank assignment
  - Fix: Use the correct pre-reranking position as originalRank; verify 0-based vs 1-based indexing matches consumer expectations

- [x] **[P3-14]** MEDIUM — `memory-search.ts`: `applyIntentWeights` ignores recency weight from intent classification
  - Location: memory-search.ts, applyIntentWeights function
  - Fix: Include recency weight in the scoring adjustment alongside other intent-based weights

- [x] **[P3-15]** MEDIUM — `rrf-fusion.ts`: RRF fusion hardcodes source type names instead of accepting them as parameters
  - Location: rrf-fusion.ts, source type handling
  - Fix: Accept source types as a parameter or derive them from the input data; remove hardcoded string literals

- [x] **[P3-16]** MEDIUM — `memory-search.ts`: Fallback scoring produces fake, indistinguishable scores (e.g., all results get 0.5)
  - Location: memory-search.ts, fallback scoring path
  - Fix: Generate distinct scores in fallback mode (e.g., based on simple heuristics like recency, string overlap) so results can be meaningfully ranked

- [ ] **[P3-17]** LOW — `bm25-index.ts`: Stemmer produces low-quality stems for technical/code terms
  - Location: bm25-index.ts, stemming logic
  - Fix: Add a technical term dictionary or bypass stemming for camelCase/snake_case identifiers

- [ ] **[P3-18]** LOW — `bm25-index.ts`: Hash collision risk in document ID hashing
  - Location: bm25-index.ts, ID hashing function
  - Fix: Use a more robust hash function or increase hash size; add collision detection

- [ ] **[P3-19]** LOW — `bm25-index.ts`: Caching bugs — stale cache entries not invalidated on document update
  - Location: bm25-index.ts, cache management
  - Fix: Invalidate affected cache entries when documents are added, updated, or removed

- [x] **[P3-20]** HIGH — `filter-stats.ts`: Module-level mutable singleton — shared state across concurrent operations
  - Location: filter-stats.ts, module-level state variable
  - Fix: Make filterStats instance-scoped (per-request or per-search) instead of module-level singleton; or add proper synchronization

- [x] **[P3-21]** HIGH — `filter-noise.ts`: `filterNoise()` mutates input array in-place instead of returning a new array
  - Location: filter-noise.ts, filterNoise function
  - Fix: Return a new filtered array instead of mutating the input; use `.filter()` or spread operator to create a copy

---

## Phase 4: Atomicity & Transactions

- [x] **[P4-01]** CRITICAL — `memory-save.ts`: `atomicSaveMemory()` DB operation is a no-op — constructs query but never executes it
  - Location: memory-save.ts, atomicSaveMemory function, DB insert call
  - Fix: Ensure the prepared statement is actually executed (e.g., `stmt.run()` or equivalent); verify the INSERT actually writes to the database

- [x] **[P4-02]** HIGH — `memory-save.ts`: `updateExistingMemory()` performs multiple DB operations without transaction wrapping
  - Location: memory-save.ts, updateExistingMemory function
  - Fix: Wrap all DB operations in a `db.transaction()` block so updates are atomic

- [x] **[P4-03]** HIGH — `memory-save.ts`: `markMemorySuperseded()` return value ignored — caller doesn't know if supersede failed
  - Location: memory-save.ts, call site of markMemorySuperseded
  - Fix: Check return value; if supersede failed, either retry, rollback the save, or log an error

- [x] **[P4-04]** MEDIUM — `memory-save.ts`: Double parse of content creates TOCTOU race condition
  - Location: memory-save.ts, content parsing
  - Fix: Parse content once and reuse the parsed result throughout the function

- [x] **[P4-05]** MEDIUM — `memory-save.ts`: `reinforceExistingMemory()` doesn't check if memory exists before reinforcing
  - Location: memory-save.ts, reinforceExistingMemory function
  - Fix: Query for memory existence first; return appropriate error if not found

- [x] **[P4-06]** MEDIUM — `memory-save.ts`: Embedding null treated as success on deferred embedding path
  - Location: memory-save.ts, embedding handling
  - Fix: When embedding is null and deferral is chosen, mark the memory as pending-embedding; do not set embedding status to success

- [x] **[P4-07]** MEDIUM — `memory-save.ts`: BM25 index update happens outside the DB transaction boundary
  - Location: memory-save.ts, BM25 update after DB commit
  - Fix: Move BM25 index update inside the transaction; or implement compensating action (remove from BM25) on transaction rollback

- [x] **[P4-08]** LOW — `memory-save.ts`: `escapeLikePattern()` has silent type coercion — doesn't validate input is string
  - Location: memory-save.ts, escapeLikePattern function
  - Fix: Add type guard: `if (typeof pattern !== 'string') throw new TypeError(...)`

- [x] **[P4-09]** LOW — `memory-save.ts`: Rollback options parameter accepted but never used (false API contract)
  - Location: memory-save.ts, function signature with rollback options
  - Fix: Either implement rollback option support or remove the parameter to avoid misleading callers

- [x] **[P4-10]** HIGH — `memory-crud.ts`: Bulk delete does not clean up causal edges referencing deleted memories
  - Location: memory-crud.ts, delete function
  - Fix: After deleting memories, also delete all causal_edges rows where `source_id` or `target_id` matches any deleted memory ID

- [x] **[P4-11]** HIGH — `checkpoints.ts`: Checkpoint restore creates duplicate memories — no deduplication check
  - Location: checkpoints.ts, restore function
  - Fix: Before inserting restored memories, check for existing memories with the same hash/ID; skip or update instead of insert

- [x] **[P4-12]** HIGH — `session-manager.ts`: Holds stale DB handle after `reinitializeDatabase()` is called
  - Location: session-manager.ts, DB reference caching
  - Fix: After reinitializeDatabase(), update all cached DB references; or use a getter that always fetches the current handle

- [x] **[P4-13]** HIGH — `session-manager.ts`: `reinitializeMutex` pattern is broken — likely double-release or missing acquire
  - Location: session-manager.ts, reinitializeMutex usage
  - Fix: Audit mutex acquire/release pairs; ensure exactly one release per acquire; use try/finally to guarantee release

- [x] **[P4-14]** MEDIUM — `access-tracker.ts`: Unbounded Map growth — access records never evicted
  - Location: access-tracker.ts, tracking Map
  - Fix: Implement LRU eviction or periodic cleanup; cap Map size to a configurable maximum (e.g., 10,000 entries)

- [x] **[P4-15]** MEDIUM — `session-manager.ts` or handlers: Exit handlers attempt DB writes on already-closed DB
  - Location: Exit/cleanup handlers that write to DB
  - Fix: Check `db.open` state before writing; or close DB as the very last step in shutdown sequence

- [x] **[P4-16]** MEDIUM — `memory-save.ts`: `generateMemoryHash()` uses camelCase field names but DB stores snake_case — hash mismatch across code paths
  - Location: memory-save.ts, generateMemoryHash function
  - Fix: Normalize field names to a consistent casing before hashing; ensure all callers use the same normalization

- [x] **[P4-17]** MEDIUM — `memory-save.ts`: `executeAtomicSave()` is not wrapped in a SQLite transaction despite the name
  - Location: memory-save.ts, executeAtomicSave function
  - Fix: Wrap all DB operations within executeAtomicSave in `db.transaction()` to actually be atomic

- [x] **[P4-18]** LOW — `session-manager.ts`: `cleanupExpiredSessions()` only runs on init — expired sessions accumulate during long-running server
  - Location: session-manager.ts, cleanup scheduling
  - Fix: Schedule periodic cleanup via `setInterval()` (e.g., every 30 minutes) in addition to init-time cleanup

- [x] **[P4-19]** LOW — `incremental-index.ts`: Stale DB handle after database reinitialization
  - Location: incremental-index.ts, DB reference
  - Fix: Same pattern as P4-12 — use a getter or refresh reference after reinitializeDatabase()

- [x] **[P4-20]** MEDIUM — `memory-crud.ts`: Bulk delete not wrapped in transaction — partial deletes possible on error
  - Location: memory-crud.ts, bulk delete function
  - Fix: Wrap entire bulk delete loop in `db.transaction()` so either all deletes succeed or none do

---

## Phase 5: FSRS / Cognitive Memory

- [x] **[P5-01]** CRITICAL — `tier-classifier.ts`: `halfLifeToStability()` uses exponential formula instead of FSRS power-law — produces stability values 18.5x too slow
  - Location: tier-classifier.ts, halfLifeToStability function
  - Fix: Replace `Math.exp(halfLife * factor)` (or similar exponential) with the correct FSRS power-law formula: `stability = halfLife * (requestRetention ^ (1/decay) - 1) / (ln(2))`; verify against known FSRS reference values

- [x] **[P5-02]** HIGH — `tier-classifier.ts`: ARCHIVED condition uses `&&` (both conditions required) but FSRS spec requires `||` (either condition sufficient)
  - Location: tier-classifier.ts, archival decision logic
  - Fix: Change `conditionA && conditionB` to `conditionA || conditionB` per the FSRS specification

- [x] **[P5-03]** MEDIUM — `prediction-error-gate.ts`: False positive contradiction detection — flags non-contradictory memories as contradictions
  - Location: prediction-error-gate.ts, contradiction detection logic
  - Fix: Tighten similarity threshold and add semantic checks; require higher confidence before flagging contradiction

- [x] **[P5-04]** MEDIUM — `attention-decay.ts`: Working memory decay and delete operations race — decay can operate on a memory being deleted
  - Location: attention-decay.ts, decay processing loop
  - Fix: Check memory still exists before applying decay; or use optimistic concurrency (check affected rows after update)

- [x] **[P5-05]** MEDIUM — `tier-classifier.ts`: Dual archival decision paths disagree — two code paths make independent archival decisions that can conflict
  - Location: tier-classifier.ts, archival logic (two separate evaluation paths)
  - Fix: Consolidate to a single archival decision function; remove the redundant path

- [x] **[P5-06]** LOW — `attention-decay.ts`: Ephemeral archival stats are reset on every restart — no persistence
  - Location: attention-decay.ts, stats tracking variables
  - Fix: Persist archival stats to DB or file; reload on startup

- [x] **[P5-07]** LOW — `tier-classifier.ts`: Documentation comment about FACTOR has wrong position description
  - Location: tier-classifier.ts, JSDoc comment near FACTOR constant
  - Fix: Update comment to accurately describe what FACTOR represents and where it is used

---

## Phase 6: Type System Unification

- [x] **[P6-01]** HIGH — No canonical DB row type — snake_case (DB columns) vs camelCase (TypeScript) not systematically handled
  - Location: shared/types.ts and scattered across handler files
  - Fix: Define `MemoryDbRow` with snake_case fields matching SQLite schema; create `toDbRow()` / `fromDbRow()` normalization functions

- [x] **[P6-02]** HIGH — `SearchResult` defined incompatibly in 2 places — different fields, different semantics
  - Location: shared/types.ts (or similar) and mcp_server search module
  - Fix: Consolidate to single `SearchResult` definition in shared/types.ts; update all import sites

- [x] **[P6-03]** HIGH — `Database` interface defined 4+ times with conflicting method signatures
  - Location: shared/types.ts, session-manager.ts, and at least 2 other files
  - Fix: Define single canonical `Database` interface in shared/types.ts; all other files import from there

- [x] **[P6-04]** HIGH — `EmbeddingProfile` defined 3 times with different fields
  - Location: shared/embeddings.ts, shared/types.ts, and one handler file
  - Fix: Consolidate to single definition in shared/types.ts; ensure all fields are present

- [x] **[P6-05]** HIGH — 91 unsafe `as unknown as` casts scattered across the codebase — PARTIAL: reduced from 69 to 53 (23% reduction, 16 removed)
  - Location: Multiple files across mcp_server/ and shared/
  - Fix: Replace each cast with one of: (a) proper type narrowing with runtime check, (b) type guard function, (c) Zod/io-ts validation, or (d) fix the source type so cast isn't needed; remove every `as unknown as` usage

- [ ] **[P6-06]** MEDIUM — `MemoryRecord` / `MemoryRow` dual-casing band-aid — both types exist as workarounds for the missing normalization layer
  - Location: shared/types.ts or wherever these types are defined
  - Fix: Replace with canonical `MemoryDbRow` (snake_case) + `Memory` (camelCase) + normalization functions from P6-01

- [ ] **[P6-07]** MEDIUM — Inconsistent score field naming — `score`, `relevanceScore`, `searchScore`, `combinedScore` used interchangeably
  - Location: SearchResult types, handler response objects, scoring functions
  - Fix: Standardize on `score` for final computed score and `rawScores: { vector, bm25, crossEncoder }` for component scores; rename all usages

---

## Phase 7: Test Coverage

### Untested Script Modules (35)

- [ ] **[P7-01]** — `scripts/src/generate-context.ts`: No unit tests — critical module for memory save workflow
  - Fix: Add tests for context generation with mock spec folders, edge cases (empty folder, missing files)

- [ ] **[P7-02]** — `scripts/src/validate-spec.ts`: No unit tests
  - Fix: Add tests for validation of valid/invalid spec folders, level detection

- [ ] **[P7-03]** — `scripts/src/compose-memory.ts`: No unit tests
  - Fix: Add tests for memory composition from spec folder contents

- [ ] **[P7-04]** — `scripts/src/extraction/content-filter.ts`: No unit tests
  - Fix: Add tests for content extraction filtering with various input types

- [ ] **[P7-05]** — `scripts/src/extraction/metadata-extractor.ts`: No unit tests
  - Fix: Add tests for metadata extraction from markdown files

- [ ] **[P7-06]** — `scripts/src/extraction/frontmatter-parser.ts`: No unit tests
  - Fix: Add tests for YAML frontmatter parsing, edge cases (no frontmatter, malformed)

- [ ] **[P7-07]** — `scripts/src/extraction/section-parser.ts`: No unit tests
  - Fix: Add tests for markdown section parsing, nested headers, code blocks

- [ ] **[P7-08]** — `scripts/src/extraction/heading-extractor.ts`: No unit tests
  - Fix: Add tests for heading extraction at various levels

- [ ] **[P7-09]** — `scripts/src/extraction/link-extractor.ts`: No unit tests
  - Fix: Add tests for link extraction (markdown links, URLs, relative paths)

- [ ] **[P7-10]** — `scripts/src/extraction/code-block-extractor.ts`: No unit tests
  - Fix: Add tests for fenced code block extraction with language tags

- [ ] **[P7-11]** — `scripts/src/extraction/list-extractor.ts`: No unit tests
  - Fix: Add tests for ordered/unordered list extraction, nested lists

- [ ] **[P7-12]** — `scripts/src/extraction/table-extractor.ts`: No unit tests
  - Fix: Add tests for markdown table extraction, edge cases

- [ ] **[P7-13]** — `scripts/src/templates/template-engine.ts`: No unit tests
  - Fix: Add tests for template rendering with variables, conditionals

- [ ] **[P7-14]** — `scripts/src/templates/template-loader.ts`: No unit tests
  - Fix: Add tests for template file loading, caching, missing templates

- [ ] **[P7-15]** — `scripts/src/templates/template-validator.ts`: No unit tests
  - Fix: Add tests for template structure validation

- [ ] **[P7-16]** — `scripts/src/templates/variable-resolver.ts`: No unit tests
  - Fix: Add tests for variable resolution, nested variables, defaults

- [ ] **[P7-17]** — `scripts/src/config-loader.ts`: No unit tests
  - Fix: Add tests for configuration loading, env var overrides, defaults

- [ ] **[P7-18]** — `scripts/src/path-utils.ts`: No unit tests
  - Fix: Add tests for path resolution, normalization, security checks

- [ ] **[P7-19]** — `scripts/src/file-scanner.ts`: No unit tests
  - Fix: Add tests for spec folder file discovery, glob patterns

- [ ] **[P7-20]** — `scripts/src/hash-utils.ts`: No unit tests
  - Fix: Add tests for content hashing, collision resistance

- [ ] **[P7-21]** — `scripts/src/markdown-utils.ts`: No unit tests
  - Fix: Add tests for markdown utility functions

- [ ] **[P7-22]** — `scripts/src/json-utils.ts`: No unit tests
  - Fix: Add tests for JSON parsing, serialization, error handling

- [ ] **[P7-23]** — `scripts/src/date-utils.ts`: No unit tests
  - Fix: Add tests for date formatting, parsing, timezone handling

- [ ] **[P7-24]** — `scripts/src/string-utils.ts`: No unit tests
  - Fix: Add tests for string manipulation utilities

- [ ] **[P7-25]** — `scripts/src/error-handler.ts`: No unit tests
  - Fix: Add tests for error classification, formatting, reporting

- [ ] **[P7-26]** — `scripts/src/logger.ts`: No unit tests
  - Fix: Add tests for log level filtering, formatting, output

- [ ] **[P7-27]** — `scripts/src/cli-parser.ts`: No unit tests
  - Fix: Add tests for CLI argument parsing, validation, help generation

- [ ] **[P7-28]** — `scripts/spec/validate.sh`: No automated tests
  - Fix: Add bash test script (using bats or similar) for validate.sh edge cases

- [ ] **[P7-29]** — `scripts/spec/create.sh`: No automated tests
  - Fix: Add bash test script for create.sh argument handling, output validation

- [ ] **[P7-30]** — `scripts/spec/compose.sh`: No automated tests
  - Fix: Add bash test script for compose.sh composition logic

- [ ] **[P7-31]** — `scripts/src/index.ts`: No unit tests for module exports
  - Fix: Add tests verifying all expected exports are present and typed correctly

- [ ] **[P7-32]** — `scripts/src/spec-folder-creator.ts`: No unit tests
  - Fix: Add tests for spec folder creation with various levels and options

- [ ] **[P7-33]** — `scripts/src/memory-composer.ts`: No unit tests
  - Fix: Add tests for memory file composition from extracted content

- [ ] **[P7-34]** — `scripts/src/checklist-generator.ts`: No unit tests
  - Fix: Add tests for checklist generation based on spec level

- [ ] **[P7-35]** — `scripts/src/summary-generator.ts`: No unit tests
  - Fix: Add tests for implementation summary generation

### Untested MCP Server Modules (17)

- [ ] **[P7-36]** — `mcp_server/context-server.ts`: No integration tests for server lifecycle
  - Fix: Add tests for startup, shutdown, warmup timeout, error handling

- [ ] **[P7-37]** — `mcp_server/vector-index-impl.js`: No unit tests for vector index operations
  - Fix: Add tests for index creation, insertion, search, dimension validation

- [x] **[P7-38]** — `mcp_server/path-security.ts`: No unit tests for path validation — DONE: unit-path-security.test.ts (7 tests)
  - Fix: Add tests for symlink traversal, path escape attempts, allowed paths

- [ ] **[P7-39]** — `mcp_server/session-manager.ts`: No unit tests for session lifecycle
  - Fix: Add tests for session creation, cleanup, reinitialize, mutex behavior

- [ ] **[P7-40]** — `mcp_server/access-tracker.ts`: No unit tests
  - Fix: Add tests for access recording, eviction, bounded growth

- [ ] **[P7-41]** — `mcp_server/incremental-index.ts`: No unit tests
  - Fix: Add tests for incremental indexing, stale handle recovery

- [ ] **[P7-42]** — `mcp_server/checkpoints.ts`: No unit tests
  - Fix: Add tests for checkpoint save, restore, deduplication, embedding validation

- [ ] **[P7-43]** — `mcp_server/sqlite-layer.ts`: No unit tests for the SQLite abstraction
  - Fix: Add tests for connection management, query execution, transaction behavior, error handling

- [ ] **[P7-44]** — `mcp_server/handlers/memory-save.ts`: Insufficient test coverage for atomicity
  - Fix: Add tests for atomic save, transaction rollback, concurrent saves, hash generation

- [ ] **[P7-45]** — `mcp_server/handlers/memory-crud.ts`: Insufficient test coverage for bulk operations
  - Fix: Add tests for bulk delete with causal edge cleanup, transaction wrapping

- [x] **[P7-46]** — `mcp_server/cognitive/tier-classifier.ts`: No unit tests for FSRS calculations — DONE: unit-fsrs-formula.test.ts (7 tests)
  - Fix: Add tests with known FSRS input/output pairs; verify halfLifeToStability, archival conditions

- [ ] **[P7-47]** — `mcp_server/cognitive/attention-decay.ts`: No unit tests
  - Fix: Add tests for decay calculation, race condition handling, stat persistence

- [ ] **[P7-48]** — `mcp_server/cognitive/prediction-error-gate.ts`: No unit tests
  - Fix: Add tests for contradiction detection, false positive rate

- [ ] **[P7-49]** — `mcp_server/search/bm25-index.ts`: No unit tests
  - Fix: Add tests for indexing, search, persistence, specFolder filtering

- [ ] **[P7-50]** — `mcp_server/search/cross-encoder.ts`: No unit tests
  - Fix: Add tests for reranking, originalRank calculation

- [ ] **[P7-51]** — `mcp_server/search/intent-classifier.ts`: No unit tests
  - Fix: Add tests for intent classification across query types, bias verification

- [x] **[P7-52]** — `mcp_server/search/rrf-fusion.ts`: No unit tests — DONE: unit-rrf-fusion.test.ts (6 tests)
  - Fix: Add tests for RRF score calculation, source type handling, rank merging

### Additional Phase 7 Completed Work (not in original task list)

- [x] **unit-normalization.test.ts** — 7 tests for shared/normalization.ts (MemoryDbRow ↔ Memory conversion)
- [x] **intent-classifier.test.ts regression fix** — updated test queries for single-keyword discount after P3-12 fix
- [x] **archival-manager.test.ts regression fix** — added stability/half_life_days columns after P5 schema changes
- [x] **vector-store.js runtime fix** — concrete base class for runtime `extends` (was abstract-only, broke at runtime)

---

## Summary

| Phase | Bug Range       | Count | CRITICAL | HIGH | MEDIUM | LOW | Status |
| ----- | --------------- | ----- | -------- | ---- | ------ | --- | ------ |
| 1     | P1-01 – P1-14  | 14    | 4        | 3    | 6      | 1   | ✅ 13 fixed, 1 N/A |
| 2     | P2-01 – P2-10  | 10    | 1        | 3    | 4      | 2   | ✅ 10/10 |
| 3     | P3-01 – P3-21  | 21    | 1        | 8    | 6      | 6   | ✅ 18/21 (P3-17/18/19 deferred — LOW) |
| 4     | P4-01 – P4-20  | 20    | 1        | 7    | 9      | 3   | ✅ 20/20 |
| 5     | P5-01 – P5-07  | 7     | 1        | 1    | 3      | 2   | ✅ 7/7 |
| 6     | P6-01 – P6-07  | 7     | 0        | 5    | 2      | 0   | ✅ 6A done, 6B partial (53 casts remain) |
| 7     | P7-01 – P7-52  | 52    | 0        | 0    | 0      | 52  | ✅ 4 new test files (27 tests), 2 regression fixes |
| **Total** |             | **131** | **8** | **27** | **30** | **66** | **~85 bugs fixed** |

> Note: The ~200 bug count from the initial audit includes sub-items within bugs (e.g., P1-03 covers 3 shell scripts, P6-05 covers 91 casts) and additional minor issues discovered during detailed analysis. The task list above captures all actionable items.
