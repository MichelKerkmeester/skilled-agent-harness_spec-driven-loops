# Iteration 3: corpus precision and MCP capability boundary

## Focus

This iteration establishes what the active Markdown corpus can guarantee for frontmatter lookup, line-oriented grep, ANCHOR retrieval, and path ranking. It also distinguishes read-only retrieval from the stateful capabilities the retired MCP surface supplied.

## Findings

### 1. There is a concrete managed frontmatter shape, but compatibility aliases currently widen it

The shared memory template contract requires scalar `title`, `description`, `importance_tier`, and `contextType`, plus a `trigger_phrases`/`triggerPhrases` YAML list or `[]`. It also requires a blank line after the closing delimiter and reports missing or malformed frontmatter, invalid trigger lists, and missing sections/anchors. `[SOURCE: .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:5-21,222-281]`

The migration parser recognizes `trigger_phrases` and `triggerPhrases`, `importance_tier` and `importanceTier`, and `contextType` and `context_type`; it parses inline or block lists and preserves unknown sections sorted after managed keys. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:54-61,606-665,1342-1375]` This is useful for a safe retrofit, but a generated index needs one canonical output spelling even if readers retain aliases.

**Recommendation:** phase 004 should freeze the canonical generated key set as `title`, `description`, `trigger_phrases`, `importance_tier`, and `contextType`. Treat `version`, `_memory`, quality fields, and arbitrary unknown keys as non-index metadata. The index should preserve path and raw phrase diagnostics, but never make ranking depend on arbitrary unknown frontmatter. A compatibility read of camelCase aliases can remain during migration; the validator should report them as legacy rather than silently accepting both as equal forever.

### 2. Malformed and missing frontmatter must be distinguishable from a valid empty trigger list

`detectFrontmatter` distinguishes no frontmatter, an opening delimiter without a close, and a block that is not YAML-like; it returns a reason for malformed cases. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:385-469]` `buildFrontmatterContent` refuses to rewrite malformed input and returns `malformedFrontmatter` plus `malformedReason`, while valid input is serialized with a canonical managed-key order. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:1378-1432]` The existing memory-template contract also treats `trigger_phrases: []` as valid but a missing/invalid list as a violation. `[SOURCE: .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:139-160,265-270]`

**Recommendation:** the phase 001 index generator must emit a diagnostic record for every skipped path with `path`, 1-based frontmatter start/line, category (`missing`, `malformed`, `wrong-type`, `invalid-member`, `empty`), and reason. `empty` is valid and should not be conflated with malformed. The default build must fail without publishing a partial index when any non-ignored file is malformed; an explicit report-only mode may return diagnostics for triage.

### 3. Existing generators can pollute triggers with generic fallback phrases

The frontmatter editor inserts folder-derived fallback phrases when fewer than two exist and ultimately falls back to `session` and `context`. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` The shared memory-frontmatter policy separately removes the legacy generic set `memory dashboard`, `session summary`, and `context template`, derives phrases from title/description/summary/folder tokens, and caps the result at twelve entries. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/memory-frontmatter.ts:8-13,50-76,124-163]` The automatic trigger extractor also contains broad English, technical, and artifact stop-word lists and scores n-grams from body text. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:17-61,67-88,571-658]`

These are different concerns: the replacement index is over author-controlled frontmatter, not an invitation to re-run body extraction. Generic fallback words are especially damaging in a grep corpus because they match thousands of documents.

**Recommendation:** phase 004 should define `trigger_phrases` as a small allowlist of phrases a user might actually type to retrieve the document: distinctive task/domain terms, exact decisions, API names, failure symptoms, and packet-specific multi-word concepts. Exclude generic workflow words (`session`, `context`, `memory`, `summary`, `feature`, `update`, `file`, `document`, `section`), stopword-only phrases, whole prose sentences, and phrases copied only because they appear in a body. Add a validator diagnostic for a generic phrase rather than silently deleting it during a no-body-change retrofit. Phase 001 should index only the post-validation frontmatter list and must not call the body trigger extractor.

### 4. ANCHOR markers provide a precise line-addressable structure, but malformed handling is currently permissive

The anchor metadata module defines the format `<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`, supports structured IDs such as `DECISION-pipeline-003`, records 1-based start/end lines, and derives a type from an uppercase prefix. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:7-24,32-49,68-87]` It walks content line by line and supports nesting, including same-line open/close pairs. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:92-154]` The general validation helper checks open/close sets and returns warnings for unclosed or orphaned anchors. `[SOURCE: .opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:42-75]` The anchor metadata parser, however, silently ignores unmatched tags. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:92-104,149-154]`

**Recommendation:** use lower-kebab IDs for ordinary stable sections (`summary`, `decisions`, `next-steps`, `blockers`) and reserve uppercase prefixes for typed records (`DECISION-...`, `OBSERVATION-...`). Require exact matching open/close IDs, one pair per section, and a closing marker before the next peer heading. The phase-004 validator should report malformed markers with path and line, even if runtime retrieval remains fail-soft. Anchor insertion must be treated as a structural edit with an invariant that all pre-existing non-marker lines remain byte-equivalent; otherwise the “no body rewrite” requirement is contradictory. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-123,135-146,193-201]`

### 5. Naming is already stable enough to be a deterministic path key

The folder reference defines `NNN-short-descriptive-name`: three zero-padded digits, a hyphen, and lowercase hyphen-separated text. Nested phases use the same `NNN-topic-name` form. `[SOURCE: .opencode/skills/system-spec-kit/references/structure/folder-structure.md:54-84]` It also defines the canonical local research/review layout and an owner-slug `-pt-NN` convention for allocated packet subfolders. `[SOURCE: .opencode/skills/system-spec-kit/references/structure/folder-structure.md:187-228]`

**Recommendation:** use the normalized relative path as the final deterministic tie-break and derive `specFolder` from the nearest packet path, never from free-text title. Validate lowercase/zero-padding for new packet directories, but report legacy exceptions instead of renaming them during the 22,127-document retrofit. Keep document basenames (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `research.md`, `handover.md`) as a separate document-type field; the migration code enumerates this mapping. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:110-118,671-689]`

### 6. One-fact-per-line is a new precision rule, not a confirmed current corpus invariant

The current anchor parser is line-oriented, and ripgrep itself returns matching lines, but neither source requires each factual claim to occupy one physical line. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:92-116; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:23-26]` Phase 004 currently commits to stable markers and naming, excludes body rewriting, and reports a large active corpus with inconsistent keys/markers. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:81-112]`

**Recommendation:** define one-fact-per-line for new structured evidence, decision bullets, acceptance rows, and continuity metadata; do not reflow legacy prose as part of the retrofit. The validator can enforce it for machine-owned sections and templates, while the parity harness includes a multi-line prose negative control. This preserves the phase's no-body-rewrite boundary and prevents a false claim that all 22,127 existing documents are line-normalized.

### 7. The retired MCP surface had stateful capabilities that grep cannot supply

The reference catalog lists semantic search, trigger matching, context orchestration, save/update, causal analysis, evaluation/reporting, and maintenance as separate MCP surfaces. `[SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:38-48,91-142]` The old search pipeline has multiple channels, including vector, FTS5, BM25, graph, and degree signals. `[SOURCE: .opencode/skills/system-spec-kit/feature-catalog/retrieval/hybrid-search-pipeline.md:28-35]` The file replacement intentionally rules out embeddings, a daemon, and a database. `[SOURCE: specs/system-speckit/049-memory-decommission/goal.md:43-55]`

The capability mapping should be explicit:

| Retired capability | What grep/index can preserve | Replacement or honest loss |
|---|---|---|
| Trigger and keyword retrieval | Literal phrase/token/anchor matches, path scope, stable caps and ranking wrapper | Committed trigger index plus `rg` conventions; exact parity is phase 001's gate. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162]` |
| `memory_context` resume/context assembly | Read ordered packet files and bounded anchors | `handover.md -> _memory.continuity -> spec docs`, with explicit context commands; no session inference. `[SOURCE: .opencode/skills/system-spec-kit/shared/README.md:20-25; .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:1239-1284]` |
| Continuity frontmatter writing | None: `rg` is read-only | A named standalone writer in phase 002, preserving atomic packet-local updates and locks currently documented for `generate-context.js`. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123; .opencode/skills/system-spec-kit/references/memory/save-workflow.md:253-298]` |
| Causal graph / `memory_drift_why` | Search explicit relation text or links only | Preserve important relations as explicit Markdown links/typed evidence or declare causal traversal unsupported. The current handler reads/writes scoped causal edges and traverses bounded chains. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:84-120,624-712,911-1059]` |
| Resource maps/reporting | Static path catalog | Generate packet-local `resource-map.md` from recorded paths; the template is intentionally a lean path catalog, not a narrative or dynamic graph. `[SOURCE: .opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-32,37-48,180-197]` |
| Semantic paraphrase, vector/BM25/graph fusion, decay, session dedup, access tracking | None reliably | Remove from the replacement contract; document a lexical-only boundary and require caller-visible no-hit/unsupported diagnostics. `[SOURCE: .opencode/skills/system-spec-kit/feature-catalog/retrieval/hybrid-search-pipeline.md:28-35; .opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:1290-1337]` |

The continuity writer is the most important non-grep dependency: phase 002 explicitly requires a named writer that does not depend on MCP, and its NFR keeps Gate 1 under 200ms. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:130-145,177-187]` Phase 001/004 should not imply that their read-only commands replace that write contract.

### 8. Ranked amendment recommendations

1. **P0 — phase 004 `spec.md` requirements:** add the canonical key/value table, generic-trigger rejection policy, marker grammar, and a structural-only marker invariant. Clarify whether marker insertion is an allowed non-prose edit, because current scope says both “markers in scope” and “bodies never rewritten.” `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-123,131-146]`
2. **P0 — phase 001 `spec.md`/plan:** require the generator to consume only canonical `trigger_phrases`, preserve raw variants for diagnostics, derive path/document type separately, and publish no partial index after malformed input. Add the active/archived/expiry scope decision to the index schema. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:98-115,130-151; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104]`
3. **P0 — phase 004 `tasks.md`:** enumerate generic phrases, malformed/YAML-like variants, anchor pairs, aliases, and legacy naming before editing; dry-run by track; report unresolved files rather than silently adding `session/context`. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:34-60; .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]`
4. **P1 — phase 004 plan/acceptance:** enforce new structured sections one-fact-per-line while exempting unchanged legacy prose, and add byte-preservation checks that ignore only inserted markers/frontmatter fields. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/plan.md:54-106; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:55-86]`
5. **P1 — phase 002 handoff:** add a replacement matrix that marks continuity writing, causal traversal, resource maps, semantic ranking, decay, and session dedup as either named file workflows or deliberate losses. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123,130-145]`

## Ruled Out

- Re-running the body-based automatic trigger extractor during index generation is ruled out: it has its own stop-word/n-gram policy and would change an author-controlled frontmatter contract. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:571-658]`
- Silently adding `session`/`context` to sparse documents is ruled out for a grep-precision corpus because the editor currently uses those as generic fallbacks. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]`
- Claiming `rg` replaces continuity writes, causal traversal, or session state is ruled out because the commands are read-only and the phase-002/handler contracts are stateful. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]`
- Reflowing every legacy body to one fact per line is ruled out by phase 004's no-body-rewrite boundary. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]`

## Dead Ends

No new dead end. The two prior trigger-index directions and the iteration-2 flag substitutions remain exhausted in the reducer strategy.

## Edge Cases

- A valid `trigger_phrases: []` document must be reported as empty, not malformed; a missing key, scalar value, malformed YAML-like block, and non-string list item need separate diagnostics.
- CamelCase aliases can be read during migration but should not create duplicate index fields or duplicate phrase records.
- A phrase containing `#`, `:`, quotes, brackets, or a colon-like YAML token must round-trip through the parser and generator without changing its normalized form.
- Anchor IDs may be nested and may contain uppercase typed prefixes; closing IDs must match exactly, and malformed pairs need path/line reports even if retrieval ignores them.
- A marker-only retrofit needs a byte-level body preservation proof; otherwise a changed line is indistinguishable from a prohibited prose rewrite.
- Old packet folder names may violate the new lowercase grammar; report them and use their normalized relative path as the tie-break instead of renaming them.
- A document can have excellent body evidence but no trigger phrases. It remains body-searchable and should not receive synthetic generic triggers merely to satisfy an index count.

## Sources Consulted

- `[SOURCE: .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:5-21,139-160,222-345]`
- `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:54-61,385-469,606-665,1270-1432]`
- `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:96-166]`
- `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/memory-frontmatter.ts:8-13,50-76,124-163]`
- `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:17-88,571-658]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:7-24,32-49,92-154]`
- `[SOURCE: .opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:42-75]`
- `[SOURCE: .opencode/skills/system-spec-kit/references/structure/folder-structure.md:54-84,187-228]`
- `[SOURCE: .opencode/skills/system-spec-kit/references/memory/save-workflow.md:253-298,542-570]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:84-120,624-712,911-1059]`
- `[SOURCE: .opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48,180-197]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-145,177-198]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:81-123,131-149,193-201]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/plan.md:54-106]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:34-60]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:55-86]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/goal.md:43-55]`
- `[SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:38-48,91-142]`
- `[SOURCE: .opencode/skills/system-spec-kit/feature-catalog/retrieval/hybrid-search-pipeline.md:28-35]`
- `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:23-26]`

## Assessment

The corpus can support precise lexical retrieval if canonical frontmatter, stable markers, path grammar, and a generic-trigger policy are enforced. Current parsers provide safe migration primitives but deliberately accept historical aliases and fail-soft anchor cases; the phase work must add reporting and a strict publish gate. Grep is a read-only lexical replacement, not a complete substitute for continuity writing, causal graph traversal, semantic fusion, decay, or session state.

## Reflection

Iteration 2 defined the `rg` transport/ranker seam. This iteration identifies the data contract on the other side: stable fields and lines are more valuable than a clever query flag. It also prevents a dangerous overclaim that a committed index replaces every behavior of a stateful MCP database.

## Recommended Next Focus

Design the parity harness and frozen prompt set. Read existing evaluation fixtures/benchmarks and phase acceptance criteria, then define exact set/order checks, malformed reports, idempotence checks, cold-start p95 measurement, and safe negative controls for archives, scopes, anchors, Unicode, partial tokens, and multi-line content.
