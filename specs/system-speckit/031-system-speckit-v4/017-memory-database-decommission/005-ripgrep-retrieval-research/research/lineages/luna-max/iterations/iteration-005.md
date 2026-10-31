---
title: "Iteration 5: final cross-check and ranked amendment map"
trigger_phrases: []
---
# Iteration 5: final cross-check and ranked amendment map

## Focus

This final forced iteration reconciles all six requested research axes against the parent directive and all four phase contracts. It freezes what phase 001 must build, what phase 004 must retrofit, what phase 002 must own, and what the lexical replacement must explicitly decline. The convergence threshold is telemetry only; `max-iterations: 5` is the stop condition.

## Cross-check conclusions

### 1. The replacement has two deliberately different contracts

The parent decision is a committed generated trigger index plus ripgrep, with no embedding path, and the order is build, rewire, delete, retrofit. `[SOURCE: specs/system-speckit/049-memory-decommission/goal.md:43-55]` The parent packet describes the current exact lane as `LOWER(trigger_phrases) LIKE` and records the recursive-grep baseline, while phase 001 requires a generated index, committed artifact, parity, and a 200ms lookup budget. `[SOURCE: specs/system-speckit/049-memory-decommission/spec.md:77-105,115-180; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162]`

The design therefore needs:

- **Trigger-index contract:** a structured, committed lookup for frontmatter `trigger_phrases` that preserves the old lane's normalized-token, partial-substring, lifecycle-filter, scope, and stable-order behavior. Normalize by lowercasing, replacing non-ASCII-alphanumeric runs with spaces, collapsing whitespace, trimming, deduplicating, requiring query tokens of length at least three, and considering the first eight tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747,795-837]` Store sorted normalized phrases, raw variants, tokens, paths, and three-character postings so a phrase-only index cannot lose SQL's `%token%` partial candidates. `[INFERENCE: The postings structure is an amendment-ready implementation shape derived from the SQL substring contract, not an existing artifact in this checkout.]`
- **Grep convention contract:** read-only, explicit `rg` recipes over Markdown, with caller-side ranking and explicit exit/error mapping. `rg` provides matching lines or paths; it does not replace the old database's semantic, graph, recency, decay, or session-state behavior. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:23-26; .opencode/skills/system-spec-kit/feature-catalog/retrieval/hybrid-search-pipeline.md:28-35]`

Do not combine these contracts into an assertion that `rg` itself returns the index's relevance order. Index lookup can provide trigger-specific candidates; the `rg` wrapper ranks evidence lines after parsing them.

### 2. Exact parity must be stronger than the current “missing: 0” wording

The current test asserts only one trigger-only phrase and two IDs in order. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/hybrid-search.vitest.ts:952-980]` Phase 001 currently says the index returns a superset of live paths and success is zero missing paths. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:135-162; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:57-66]`

Amend the gate to record two-way differences. For every frozen query, compare `legacyOnly`, `indexOnly`, eligible candidate set, score class, source, scope, archive/expiry eligibility, and stable rank. Require zero unexplained `legacyOnly` **and** `indexOnly` entries for the exact trigger arm. A deliberate semantic or tokenizer divergence belongs in a separately labeled boundary arm, never in the lexical pass/fail denominator. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/trigger-goldens.json:18-58; .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/golden-queries.json:16-32]`

Use one frozen corpus manifest containing included paths, excluded paths, content hash, parser/index schema versions, and prompt-set hash. Run legacy SQL, generated index, and `rg` adapters over that same snapshot. If the daemon is unavailable, preserve the captured baseline and mark live availability; do not convert an absent live comparison into a green result. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-38]`

### 3. Freeze lexical gates separately from semantic boundary probes

The minimum frozen set is 18 stable cases: exact phrase, uppercase case fold, punctuation separators, three-character partial token, multi-word subset, short-token behavior, nine-token truncation, no-hit, scope collision, archive exclusion, expiry, malformed frontmatter, duplicate phrase/path, accented/CJK text, anchor marker, body-only match, generic phrase negative, and nested/path punctuation. Each row needs `id`, `class`, `query`, expected behavior, and `allowedDivergence`.

The existing trigger goldens' paraphrase rows are explicitly semantic-trigger-shadow, so they validate the documented lexical-only boundary rather than count as a missing lexical hit. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/trigger-goldens.json:18-58]` Existing stemming/tokenization rows are useful to prove that no unannounced stemmer or synonym expansion was introduced. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/golden-queries.json:16-27]` `[INFERENCE: The exact number 18 is a proposed minimum; phase 001 should pin the concrete JSON and its hash.]`

### 4. Freeze the `rg` recipes and their limits

The structured recipe should use `--no-config --json --fixed-strings --ignore-case`, explicit `--glob '*.md'`, and explicit exclusions for `**/z_archive/**` and `**/node_modules/**`. The path-only quick recipe should use `--files-with-matches --max-count 1`; the count recipe should use `--count`; these cannot be combined with `--json`, `-l`, or one another indiscriminately. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,4002-4034]` `-F`, `-i`, and `-w` have literal, Unicode case-fold, and word-boundary meanings; `-w` is not a replacement for SQL substring matching. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:2224-2251,3037-3090,7436-7473; .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]`

Ignore-file precedence, ambient `RIPGREP_CONFIG_PATH`, glob ordering, `--type-add`, path sorting, multiline, and preprocessing are operational inputs. Use `--no-config` for parity; use `--type-add` only in a command or checked-in config whose scope is named; do not use `--sort=path` as relevance; keep `--multiline` and `--pre` opt-in. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:150-219,249-279,333-372,478-552,897-912; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527,6207-6240,6289-6340,6892-6924]`

The wrapper's rank tuple should be explicit and deterministic: field (`trigger_phrases`, title/description, anchor, body), normalized match class (exact, containment, token coverage), then relative path and one-based line. `[INFERENCE: This rank tuple is a proposed consumer contract because ripgrep's documented output does not provide field-aware relevance ranking.]`

### 5. The corpus contract must be author-controlled and migration-safe

The managed parser recognizes canonical and compatibility spellings for title, description, importance, context type, and trigger lists, and distinguishes malformed frontmatter from valid empty input. `[SOURCE: .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:5-21,139-160,222-345; .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:54-61,385-469,606-665,1270-1432]` The index generator should consume canonical `trigger_phrases`, retain aliases only for migration reads, report legacy aliases, and emit one diagnostic per malformed/non-string/oversized entry. It must not silently turn malformed metadata into `[]`, even though the current vector parser does. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-types.ts:212-226]`

Use distinctive user-searchable domain terms, exact decisions, API identifiers, failure symptoms, and packet concepts in `trigger_phrases`. Warn on generic workflow words, stopword-only phrases, copied prose, and body-derived fallback phrases. The editor currently adds folder tokens and ultimately `session`/`context` fallbacks when lists are sparse, while the body extractor has a separate stop-word/n-gram policy; neither should silently define index triggers. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166; .opencode/skills/system-spec-kit/scripts/lib/memory-frontmatter.ts:8-13,50-76,124-163; .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:17-88,571-658]`

Use stable `ANCHOR` open/close pairs with exact IDs and line-addressable sections; report unmatched markers even if runtime parsing remains fail-soft. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:7-24,32-49,92-154; .opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:42-75]` Enforce one-fact-per-line for new machine-owned evidence and templates, not by reflowing legacy prose. Preserve lower-kebab naming and three-digit packet prefixes as path tie-break inputs while reporting legacy exceptions instead of renaming them. `[SOURCE: .opencode/skills/system-spec-kit/references/structure/folder-structure.md:54-84,187-228; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]`

### 6. Capability replacement boundaries belong in phase 002

The retired catalog and pipeline provided separate semantic, trigger, context, save/update, causal, reporting, and maintenance surfaces, including vector/FTS/BM25/graph/degree channels. `[SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:38-48,91-142; .opencode/skills/system-spec-kit/feature-catalog/retrieval/hybrid-search-pipeline.md:28-35]`

| Retired capability | Replacement decision |
|---|---|
| Trigger/keyword lookup | Phase 001 index plus phase 004 `rg` conventions; exact lexical parity is a P0 gate. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162]` |
| Resume/context assembly | Phase 002 reads `handover.md`, `_memory.continuity`, then packet-first spec docs and bounded anchors; no automatic session inference. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:1239-1284; .opencode/skills/system-spec-kit/shared/README.md:20-25]` |
| Continuity frontmatter writer | Named packet-local writer in phase 002, retaining atomic same-directory update/lock semantics; `rg` is not a writer. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-145; .opencode/skills/system-spec-kit/references/memory/save-workflow.md:253-298,542-570]` |
| Causal graph / drift analysis | Explicit Markdown links or typed evidence plus a named limitation, unless phase 002 supplies a separate graph replacement; `rg` cannot traverse/statefully update the old graph. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:84-120,624-712,911-1059]` |
| Resource maps | Static generated path catalog; retain the lean template shape and do not imply dynamic graph semantics. `[SOURCE: .opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48,180-197]` |
| Semantic paraphrase, decay, dedup, access tracking, vector/BM25 fusion | Deliberate lexical-only loss documented in the phase-002/003 handoff and user-facing no-hit/unsupported behavior. `[SOURCE: specs/system-speckit/049-memory-decommission/goal.md:43-55; specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/spec.md:131-150]` |

Phase 002 already makes the continuity writer and daemon-free Gate 1 behavior blockers. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:130-145,177-198]` Phase 001/004 should link to that handoff rather than inventing a second persistence system.

## Ranked amendment map

### P0 — amend phase 001 before implementation

1. **`spec.md` requirements/success/edge cases:** replace “index is a superset” with two-way candidate-set parity against the SQL lane, freezing normalization, minimum token length, first-eight token limit, substring candidates, scope/archive/expiry filters, score classes, and tie order. Add manifest/prompt hashes, semantic-boundary separation, malformed diagnostic schema, fail-closed atomic publication, and p95/max cold-start gates. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162,181-203]`
2. **`plan.md` architecture/testing:** define the JSON schema with sorted phrase/raw/token/path arrays and substring postings; define `parity-check.mjs` as legacy/index/rg adapters over one corpus snapshot; define caller-side rank fields and exit mapping. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104,119-130]`
3. **`tasks.md`:** make T001 freeze the 18-case prompt JSON/hash; T002 capture baseline plus corpus/runtime availability; T004/T005 report every malformed and excluded variant; T006 publish atomically; T008/T011 compare both set-difference directions; T010 compare bytes/hash; T012 run at least 30 fresh processes and report p50/p95/p99/max; T013 prove daemon-off behavior; T014 record actual size/latency decisions. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-63]`
4. **`acceptance-criteria.md`:** expand AC-001 to zero unexplained missing/extras and no lifecycle/scope leakage; AC-002 to byte/hash equality and no partial replacement; AC-004/005 to no-daemon/no-network and executed commands with exit mapping; AC-006 to path/line/category/reason diagnostics; AC-007 to fresh-process p95 and max under 200ms with corpus/index sizes recorded. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:57-66]`

### P0 — amend phase 004 before the retrofit

1. **`spec.md` scope/requirements:** freeze canonical frontmatter keys, alias policy, trigger allowlist/negative rules, anchor grammar, one-fact-per-line rule for new structured sections, path naming, explicit `rg` recipes, and body-preservation invariant. Replace ambiguous marker-retrofit wording with byte-preservation and exact marker-diff rules. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-149,154-160,193-201]`
2. **`plan.md` architecture/testing:** replace placeholders with the validator, dry-run/enumerate/process/rescan pipeline, `rg` wrapper ranking/exit contract, archive/node_modules exclusions, and replayable negative controls. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/plan.md:54-106]`
3. **`tasks.md`:** make setup enumerate every variant and capture a preimage/hash manifest; make implementation distinguish missing/malformed/empty/alias/generic/duplicate/oversized frontmatter; make verification replay frontmatter-only, anchor, body-only, generic, archive, malformed, and idempotence cases. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:34-60]`
4. **`acceptance-criteria.md`:** replace placeholder AC-001 with stable criteria for zero residue, no `z_archive` processing, no body change, exact marker pairing, deterministic second pass, index phrase-count comparison, explicit diagnostics, and scoped `rg` command replay. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:53-75]`

### P1 — cross-phase handoff

- Amend phase 002's replacement matrix to name the continuity writer, resume read order, resource-map emitter, causal-link limitation, and lexical-only losses before rewiring the ~167 consumers. Its current requirements already make the writer and daemon-free Gate 1 blockers. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-145,162-198]`
- Keep phase 003's deletion gate after the P0 parity, corpus, and consumer handoffs; it explicitly deletes the server/config surface and requires validation/scaffolding to survive. `[SOURCE: specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/spec.md:95-126,131-150]`

## Final proof checklist for implementation

1. Snapshot/hash the active corpus and freeze prompt JSON/hash; record archive/node_modules exclusions.
2. Generate twice; compare canonical bytes/hash and verify atomic replacement leaves the prior index intact on diagnostics.
3. Compare legacy/index/rg arms for every lexical prompt; assert two-way sets, scope/lifecycle isolation, rank tuple, and exit mapping.
4. Run fresh-process cold measurements and report p50/p95/p99/max, index bytes, corpus bytes, platform, and runtime; enforce the chosen 200ms gate.
5. Stop the daemon and disable network at the harness boundary; prove Gate 1 and the continuity writer follow phase-002 contracts.
6. Run the phase-004 validator/retrofit dry run, rescan, second pass, body preimage comparison, anchor diagnostics, and trigger-index regeneration.

## Remaining decisions

- Whether the emitted index remains one JSON file or shards after the real size measurement; phase 001 records the risk but leaves the decision open. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:169-174,211-214; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:36-38]`
- Whether Unicode non-ASCII tokenization stays compatible with the current ASCII-only SQL normalization or receives an explicit tested extension; do not call it parity until the fixture says which behavior is intended. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3037-3090]`
- The exact p95/max sample size and target machine for the 200ms gate; the proposed 30-run protocol is an amendment recommendation, not a measurement from this research run. `[INFERENCE: A target-environment benchmark must settle this before AC-007 is marked Met.]`
- The named continuity writer and whether causal links are preserved as Markdown or accepted as an explicit loss; phase 002 owns the decision. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:103-104,137-145; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]`

## Ruled out

- Embeddings, stemming, stop-word expansion, or semantic paraphrase recovery in lexical v1. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764; specs/system-speckit/049-memory-decommission/goal.md:43-55]`
- A phrase-only index without substring postings. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]`
- `rg --sort=path` as relevance ranking, default multiline/preprocessing, and `--json` combined with `-l`/`-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,4238-4294,5489-5527,6207-6240,6289-6340]`
- Reflowing legacy bodies or silently injecting generic `session`/`context` triggers. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123; .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]`

## Iteration status

All six research axes have amendment-ready evidence. The five ratios are `0.92 -> 0.84 -> 0.78 -> 0.72 -> 0.68`; the downward trend is expected for a forced maximum-iteration run and is not treated as an early stop. No implementation or parent/phase writeback was performed in this lineage.
