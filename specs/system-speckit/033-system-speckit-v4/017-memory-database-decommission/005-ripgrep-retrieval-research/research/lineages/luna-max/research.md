---
title: "Ripgrep-first retrieval replacement research"
description: "Evidence-backed design and amendment recommendations for the memory decommission trigger index and grep convention."
trigger_phrases:
  - "ripgrep-first retrieval"
  - "trigger index parity"
  - "grep convention retrofit"
importance_tier: important
contextType: research
version: 1.0.0
---

# Ripgrep-first retrieval replacement research

## 1. Overview

This research packet optimizes the replacement of the system-spec-memory MCP database with a committed trigger index and ripgrep. It is an amendment brief for phase `001-trigger-index-replacement` and phase `004-grep-convention-doc-retrofit`, with an explicit handoff to phase `002-memory-consumer-rewire`.

The work is research-only. Parent and phase specifications were read but not changed; no generator, validator, MCP save, network, or git write was run. All lifecycle artifacts in this run are under this lineage directory.

## 2. Executive summary

The replacement is viable if it preserves two separate contracts:

1. A generated frontmatter trigger index must match the current `exactTriggerSearch` lexical lane, including normalization, three-character token gating, eight-token truncation, `%token%` substring candidates, scope/lifecycle filters, and deterministic ordering. The index should add sorted phrase/token/path data plus three-character postings, with no stop-word removal or stemming in v1. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-867]`
2. Ripgrep is a read-only evidence producer, not a relevance engine or state store. Its recipes must use explicit flags, exclude `z_archive` and `node_modules`, parse exit status, and apply a caller-side field/match/path rank. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:23-26,150-219,249-279; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,6207-6240,7436-7473]`

The highest-risk gap is not the basic index shape; it is the underspecified proof. Phase 001 should replace its one-way `missing: 0` check with a three-arm, two-way parity harness over one frozen corpus manifest, separate lexical gates from semantic-boundary probes, and measure fresh-process p95/max latency rather than one warm run. Phase 004 should define canonical frontmatter, markers, trigger allowlists, and byte-preservation rules before touching the active corpus. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-203; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-201]`

## 3. Research questions and answer status

| Question | Evidence-backed answer |
|---|---|
| Trigger index shape and SQL parity | Versioned deterministic JSON; lower/ASCII-separator normalization; no stemming/stop-word expansion; phrase plus token/trigram postings; two-way parity against the SQL lane. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-837]` |
| Ripgrep recipes | Separate JSONL, path-only, and count recipes; explicit `--no-config`, literal/case flags, Markdown globs, exclusions, and caller-side ranking. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:150-219,249-279,478-552; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]` |
| Corpus precision | Canonical managed frontmatter, author-controlled triggers, exact anchor pairs, stable packet names, and one-fact-per-line for new structured evidence; no legacy prose reflow. `[SOURCE: .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:139-160,222-345; .opencode/skills/system-spec-kit/references/structure/folder-structure.md:54-84; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]` |
| MCP capability boundary | Trigger/keyword lookup can move; continuity writing, causal traversal, resource maps, semantic recall, decay, and session dedup require named replacements or explicit loss declarations. `[SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:38-48,91-142; specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-145]` |
| Parity and frozen prompts | Use a same-snapshot legacy/index/rg harness with lexical gates, semantic boundary probes, diagnostics, and deterministic output. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-63; .opencode/skills/system-spec-kit/mcp-server/tests/hybrid-search.vitest.ts:952-980]` |
| Failure and acceptance gates | Fail closed on malformed input or partial publication; report path/line/reason; enforce deterministic bytes and fresh-process latency statistics. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:385-469,1378-1432; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:57-66]` |

## 4. Scope and method

The parent `spec.md`, `goal.md`, and phase 001–004 specifications were read before research. Repository sources included the live search lane, parser/editor/anchor helpers, memory handlers, save workflow, fixtures, tests, and phase plans/tasks/acceptance files. Official ripgrep guide and source documentation was used for flag semantics. `[SOURCE: specs/system-speckit/049-memory-decommission/spec.md:77-197; specs/system-speckit/049-memory-decommission/goal.md:43-95]`

Five forced iterations ran in this detached lineage with ratios `0.92 -> 0.84 -> 0.78 -> 0.72 -> 0.68`. The configured `stopPolicy: max-iterations` was honored; convergence signals were telemetry and did not trigger early synthesis. Iteration records and gateway receipts are in `iterations/`, `deltas/`, `events/`, and the lineage state ledger.

## 5. Confirmed current baseline

`exactTriggerSearch` normalizes by lowercasing, replacing non-ASCII-alphanumeric runs with spaces, collapsing whitespace, and trimming. It deduplicates query tokens; the entry point keeps tokens of length at least three and at most eight. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747,795-802]`

Candidate SQL is an OR over `LOWER(m.trigger_phrases) LIKE '%token%'`, with non-empty trigger storage, active/archive, expiry, and optional spec-folder filters. This deliberately admits partial-token substrings; a phrase-only index is not a parity implementation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-837]`

The lane promotes complete normalized phrase matches, then phrase containment, token overlap, recency/importance, and stable database tie-breaks; trigger results are fused at a weight of `1.4` and expose `triggerScore`/`exactTriggerMatch` metadata. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:750-765,826-867,1670-1677,1938-1967]`

The existing test only queries `exact recall phrase`, expects `[202, 101]`, and checks the `trigger` source. It is a useful smoke test but not a parity harness. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/hybrid-search.vitest.ts:952-980]`

## 6. Recommended generated trigger-index contract

### 6.1 JSON shape

Use one versioned deterministic object unless measured size forces sharding:

```json
{
  "schemaVersion": 1,
  "normalization": {
    "case": "lower",
    "separators": "non-ascii-alnum-to-space",
    "minQueryTokenLength": 3,
    "maxQueryTokens": 8,
    "stopWords": [],
    "stemming": "none"
  },
  "phrases": {
    "normalized phrase": {
      "raw": ["Original Phrase"],
      "tokens": ["normalized", "phrase"],
      "paths": ["specs/example/doc.md"]
    }
  },
  "tokenTrigrams": {
    "phr": ["normalized phrase"]
  }
}
```

Sort phrase keys, raw variants, tokens, paths, and trigram postings. Do not include generation timestamps. Keep raw values for diagnostics, normalized values for matching, tokens for overlap, and trigram postings for the current SQL substring behavior. `[INFERENCE: This shape is derived from the observed SQL contract; no such generator or artifact exists in the current checkout. The planned files are listed at specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:72-79 and tasks.md:46-50.]`

### 6.2 Matching and lookup

The lookup should normalize the prompt exactly once, deduplicate, retain the first eight eligible tokens, retrieve phrase candidates through exact/containment/token postings, and use trigram postings for three-or-more-character partial candidates. It should apply scope, active/archive, and expiry metadata before ranking. Query output should include normalized query, effective tokens, discarded tokens, candidate paths, match class, and index/schema hash.

Do not remove ordinary stop words or add stemming in v1. The baseline does not expand stems and only filters tokens shorter than three at the SQL entry point. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764,795-819]` This keeps the “superset” relationship testable and avoids introducing a semantic contract the replacement cannot support.

### 6.3 Malformed input and idempotence

Distinguish missing frontmatter, malformed/unclosed frontmatter, non-YAML frontmatter, wrong trigger-list type, non-string members, valid empty list, duplicate phrase, and oversized phrase. The parser/editor already distinguishes malformed forms and refuses unsafe rewrites; valid empty input is not the same as malformed input. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:385-469,606-665,1378-1432; .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:139-160,265-270]`

Emit a diagnostic row for every skipped or warned path with `path`, one-based line, `category`, `reason`, and raw key when safe. Default generation must not replace the last known-good committed index if any non-ignored malformed document is found. Generate to a same-directory temporary file and atomically rename only after validation. Run twice against one manifest and require byte-identical output and the same SHA-256.

The current vector metadata parser turns invalid JSON, wrong types, null, and empty input into `[]`; that fail-soft behavior is evidence of a parser gap, not a safe generator policy. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-types.ts:212-226]`

### 6.4 Cold-start budget

Measure generation time separately from lookup time. Start a fresh Node process for at least 30 single-prompt lookups and report p50, p95, p99, max, corpus bytes, index bytes, runtime, platform, and query ID. A recommended release gate is p95 < 200ms and max < 200ms for the exact single-prompt arm; the target machine and sample count remain decisions for phase 001. `[INFERENCE: The p95-plus-max rule is a proposed observable gate, not a measurement from this research run.]` Existing repository benchmarks demonstrate repeated-run percentile reporting. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/stress-test/session/gate-d-benchmark-session-resume.vitest.ts:96-107,145-183]`

## 7. Ripgrep conventions replacing the three retrieval shapes

### 7.1 Structured search

Use an explicit JSONL recipe for line-addressable evidence:

```text
rg --no-config --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

`--json` emits JSON Lines but is incompatible with `--files`, `-l`, `-c`, and `--count-matches`; parse match records in the wrapper rather than combining output modes. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]`

### 7.2 Quick/path search

Use a separate path-only recipe such as:

```text
rg --no-config --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

Use `--count` in a separate count recipe. Treat exit 0 as match, exit 1 as no match, and exit 2+ as an execution or configuration error. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:1252-1288,2080-2152,4002-4034]`

### 7.3 Context/anchor search

Use the structured recipe with a bounded context option in the wrapper when a caller needs surrounding lines, and label the result as anchor/body evidence. Keep `--multiline` opt-in: ripgrep documents that it can increase memory/time and is unnecessary for one-fact-per-line structured evidence. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294]` Use exact anchor IDs and line numbers from the anchor parser; unmatched markers must be diagnostics. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:7-24,32-49,92-154; .opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:42-75]`

### 7.4 Flags and ambient configuration

`-F` treats input literally, `-i` uses Unicode simple case folding, and `-w` adds word boundaries; `-w` is not equivalent to SQL `%token%`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:2224-2251,3037-3090,7436-7473; .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]`

`.gitignore`, `.ignore`, and `.rgignore` participate in automatic filtering, and `RIPGREP_CONFIG_PATH` can inject arguments. Use `--no-config` for parity and explicit positive/negative globs so a caller is not dependent on ambient configuration. Glob order and later overrides must be documented. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:150-219,249-279,478-552]`

`--type-add` is a command/config definition, not a persistent index; `--sort=path` is path ordering and single-threaded, not relevance; `--pre` invokes a command per file and should not be a default Markdown path. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:333-372,784-870; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:5489-5527,5603-5646,6207-6240,6289-6340,6892-6924]`

### 7.5 Ranking from `rg` output

Ripgrep supplies matches, paths, and lines; the wrapper must rank them. Recommended stable tuple:

1. Evidence field: `trigger_phrases`, title/description, anchor marker, body line.
2. Normalized match: exact phrase, phrase containment, token coverage.
3. Relative path and one-based line.

Include document type and packet path in the result. `[INFERENCE: This is a proposed consumer contract because ripgrep does not provide field-aware relevance ranking.]`

## 8. Corpus convention for grep precision

The managed contract has scalar `title`, `description`, `importance_tier`, and `contextType`, with `trigger_phrases`/`triggerPhrases` list compatibility. Canonical output should use one spelling while the migration reader can recognize aliases and report them. `[SOURCE: .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:5-21,222-345; .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:54-61,606-665,1342-1375]`

`trigger_phrases` should contain distinctive user-searchable domain terms, exact decisions, API names, failure symptoms, and packet-specific multi-word concepts. Warn on generic workflow words (`session`, `context`, `memory`, `summary`, `feature`, `update`, `file`, `document`, `section`), stopword-only phrases, whole prose sentences, and body-derived fallbacks. The editor currently inserts folder tokens and ultimately `session`/`context` fallbacks; the body extractor has a separate stop-word/n-gram policy. Neither should silently define index input. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166; .opencode/skills/system-spec-kit/scripts/lib/memory-frontmatter.ts:8-13,50-76,124-163; .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:17-88,571-658]`

Use exact `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` pairs, stable IDs, and one-based line addresses. Typed IDs such as `DECISION-pipeline-003` may carry a type prefix; ordinary section IDs should stay lower-kebab. Report unmatched or orphan markers even if runtime retrieval remains fail-soft. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts:7-24,32-49,68-87,92-154; .opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:42-75]`

Apply one-fact-per-line to new structured evidence, decision bullets, acceptance rows, and continuity metadata. Do not reflow legacy prose: phase 004 explicitly excludes body rewrites and reports inconsistent current corpus conventions. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:81-123,128-149]`

Use `NNN-short-descriptive-name`, lowercase hyphen-separated packet directories as deterministic path inputs, and retain document basenames as a separate document-type field. Report legacy naming exceptions rather than renaming them during the large retrofit. `[SOURCE: .opencode/skills/system-spec-kit/references/structure/folder-structure.md:54-84,187-228; .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:671-689]`

## 9. Capability boundary and replacements

The retired memory surface separated semantic search, trigger matching, context orchestration, save/update, causal analysis, evaluation/reporting, and maintenance. The hybrid pipeline also had vector, FTS5, BM25, graph, and degree channels. `[SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:38-48,91-142; .opencode/skills/system-spec-kit/feature-catalog/retrieval/hybrid-search-pipeline.md:28-35]`

| Capability | Replacement / honest boundary | Owner |
|---|---|---|
| Trigger and keyword retrieval | Generated trigger index plus explicit `rg` recipes; lexical parity is a P0 gate. | Phases 001 and 004. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162]` |
| Resume/context assembly | Read `handover.md`, `_memory.continuity`, then packet-first spec docs and bounded anchors; no session inference. | Phase 002. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:1239-1284; .opencode/skills/system-spec-kit/shared/README.md:20-25]` |
| Continuity frontmatter writing | Named standalone packet-local writer retaining atomic same-directory update/lock semantics. `rg` cannot write. | Phase 002. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-145; .opencode/skills/system-spec-kit/references/memory/save-workflow.md:253-298,542-570]` |
| Causal graph / drift analysis | Explicit Markdown links or typed evidence, or a named unsupported capability; grep cannot traverse/statefully update graph edges. | Phase 002/003 handoff. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:84-120,624-712,911-1059]` |
| Resource maps | Static generated path catalog; it is not a dynamic graph. | Synthesis/packet tooling. `[SOURCE: .opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48,180-197]` |
| Semantic paraphrase, vector/BM25 fusion, decay, access tracking, session dedup | Deliberate lexical-only loss with explicit no-hit/unsupported behavior. | Parent/phase 002/003 contract. `[SOURCE: specs/system-speckit/049-memory-decommission/goal.md:43-55; specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/spec.md:131-150]` |

Phase 002's continuity writer and daemon-free 200ms Gate 1 behavior are blockers, so phase 001/004 must not imply that a read-only index/grep path replaces them. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:130-145,177-198]`

## 10. Parity harness and frozen prompt set

### Harness

Freeze one manifest containing included relative paths, exclusions, repository/content hash, parser version, index schema version, and prompt-set hash. Run three adapters against the same snapshot:

| Adapter | Input | Compare |
|---|---|---|
| Legacy | Old `exactTriggerSearch` lane or a captured baseline made while the daemon is reachable | Candidate paths, eligibility, score class, order |
| Index | Generated JSON loaded once, with documented normalization/postings/filters | Same tuple plus index/schema hash and diagnostics |
| `rg` | Explicit command recipe, parsed JSONL/path/count output, caller ranker | Field, path, line, match class, deterministic order |

Compare both `legacyOnly` and `indexOnly`, not only missing results. Require zero unexplained differences for lexical cases. Preserve a captured baseline and its availability/corpus metadata when the daemon is flapping; an unavailable live arm is not a green parity result. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-38,46-63]`

### Frozen cases

Freeze at least these 18 stable IDs/classes: exact phrase; uppercase case fold; punctuation separator; three-character partial token; multi-word subset; short-token rule; nine-token truncation; no-hit; scope collision; archived path; expired row; malformed frontmatter; duplicate phrase/path; accented/CJK; anchor marker; body-only match; generic phrase negative; nested/path punctuation. Each case needs `id`, `class`, `query`, expected behavior, and `allowedDivergence`.

Use the existing `trigger-goldens.json` semantic paraphrase rows as boundary probes only: they are labeled `semantic-trigger-shadow`, not lexical parity. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/trigger-goldens.json:18-58]` Use stemming/tokenization rows to detect accidental expansion, not to demand stem recall from a lexical replacement. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/golden-queries.json:16-27]`

### Metrics

- Two-way candidate-set equality for lexical prompts; no scope/archive/expiry leakage.
- Exact score-class/order parity where the old lane exposes it; document intentional lifecycle-order differences.
- Top-K recall/precision for the frozen lexical cases, with semantic boundary cases reported separately.
- Diagnostic count and path/line/category/reason equality for malformed fixtures.
- Byte/hash equality for two generation runs and two parity runs after removing only a documented duration field.
- Fresh-process p50/p95/p99/max lookup time, with p95/max against the 200ms gate.
- `rg` exit mapping: 0 match, 1 no match, 2+ error; no ambient config dependence.

## 11. Ranked amendments to phase 001

### P0 — specification

Amend `spec.md` requirements, success criteria, and edge cases so REQ-001 means two-way candidate-set parity with the current SQL lane, including first-eight token handling, partial substrings, active/archive/expiry/scope filters, score classes, and tie behavior. Add manifest/prompt hashes, semantic-boundary separation, diagnostic schema, fail-closed atomic publication, and fresh-process p95/max latency. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162,181-203]`

### P0 — plan

Amend `plan.md` to specify sorted JSON keys/arrays, phrase/token/trigram postings, no timestamps, the three-arm `parity-check.mjs`, caller-side rank fields, and exit mapping. Do not describe `rg` as the relevance ranker. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104,119-130]`

### P0 — tasks

Amend `tasks.md`: T001 freezes the 18-case JSON/hash; T002 records corpus hash and daemon availability; T004/T005 report malformed, empty, alias, generic, duplicate, oversized, and excluded variants; T006 writes atomically; T008/T011 compare both difference directions and lifecycle leakage; T010 compares bytes/hash; T012 runs fresh-process percentiles; T013 proves daemon-off operation; T014 records actual size/latency decisions. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-63]`

### P0 — acceptance

Amend `acceptance-criteria.md`: AC-001 requires zero unexplained missing/extras; AC-002 requires byte/hash equality and no partial replacement; AC-004/005 require no daemon/network and executed commands with exit mapping; AC-006 requires path/line/category/reason diagnostics; AC-007 requires the recorded fresh-process p95/max gate under 200ms with sizes/runtime; AC-008 keeps daemon-off Gate 1 proof. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:57-66]`

## 12. Ranked amendments to phase 004

### P0 — specification

Amend `spec.md` to freeze canonical frontmatter keys and aliases, an author-controlled trigger allowlist and generic negatives, exact anchor grammar, one-fact-per-line for new structured sections, naming/path rules, explicit `rg` recipes, and the body-preservation invariant. Resolve the current tension between “marker retrofit” and “no body rewrite” with an exact preimage/diff rule. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-149,154-160,193-201]`

### P0 — plan

Replace the placeholder architecture/testing sections in `plan.md` with enumerate → dry-run → process → rescan, scoped glob/ignore behavior, validator diagnostics, wrapper ranking/exit mapping, and replayable negative controls. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/plan.md:54-106]`

### P0 — tasks

Amend `tasks.md` so setup inventories every variant and captures a preimage/hash manifest; implementation distinguishes missing/malformed/empty/alias/generic/duplicate/oversized frontmatter; verification replays frontmatter-only, anchor, body-only, generic, archive, malformed, and idempotence cases. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:34-60]`

### P0 — acceptance

Replace the placeholder `AC-001` in `acceptance-criteria.md` with stable criteria for zero residue, no `z_archive` processing, no body change, exact marker pairing, deterministic second pass, index phrase-count comparison, explicit diagnostics, and scoped `rg` command replay. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:53-75]`

## 13. Eliminated Alternatives

| Alternative | Evidence and decision |
|---|---|
| Phrase-only index with no substring postings | Rejected because SQL uses `%token%` candidates and intentionally admits partial tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]` |
| Stop-word removal or stemming in lexical v1 | Rejected because neither exists in the baseline trigger lane and either changes the parity relation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764]` |
| Semantic paraphrase fixtures as lexical pass criteria | Rejected because existing fixture rows label paraphrase behavior `semantic-trigger-shadow`. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/trigger-goldens.json:18-58]` |
| `--sort=path` as relevance | Rejected because ripgrep defines it as path sorting and implements it single-threaded. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]` |
| `-w` as SQL substring parity | Rejected because word boundaries are narrower than `%token%`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473; .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]` |
| `--json` combined with `-l`/`-c` | Rejected by ripgrep's incompatible output-mode contract. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]` |
| Default multiline or preprocessing | Rejected because multiline has cost and preprocessing runs a command per file; one-line structured evidence needs neither. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]` |
| Body trigger extraction during index generation | Rejected because the body extractor has a separate n-gram/stop-word policy and would change an author-controlled frontmatter contract. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:571-658]` |
| Reflowing all legacy prose to one fact per line | Rejected by phase 004's no-body-rewrite boundary. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]` |
| Claiming grep replaces continuity writes, causal traversal, or session state | Rejected because those are stateful phase-002/handler capabilities. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-145; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]` |
| Silent generic `session`/`context` trigger injection | Rejected because the editor's fallbacks pollute a precision corpus. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` |

## 14. Divergence Map

No divergent convergence pivots were required. The research widened from trigger semantics to ripgrep flags, corpus/parser behavior, capability boundaries, and parity gates because the max-iterations policy required all five iterations; it did not synthesize early when ratios approached the threshold. The remaining frontier is operational measurement: real emitted size/sharding, target-environment latency, Unicode policy, continuity-writer choice, and causal-link preservation. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:169-174,181-191; specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:103-104,137-145]`

## 15. Open questions

- Does the measured emitted index exceed the one-file budget and require sharding? Phase 001 explicitly leaves this open. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:169-174,211-214; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:36-38]`
- Should Unicode handling remain exactly compatible with the current ASCII-only normalization, or receive an explicitly versioned extension? `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3037-3090]`
- What target machine, runtime, and sample count will make the 200ms p95/max gate reproducible? The proposed 30-run protocol is not yet a measurement.
- What named phase-002 continuity writer replaces metadata refresh, and are causal relationships retained as Markdown links or accepted as a documented loss? `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:103-104,137-145; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]`
- Which active documents actually contain valid, empty, malformed, aliased, generic, or duplicate trigger lists? The phase spec records counts, but this research run did not execute an inventory or mutate the corpus. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:81-112]`

## 16. Failure modes and implementation proof checklist

Test stale/missing/invalid index; partial temp output; concurrent generation; duplicate phrase/path; symlink/path traversal; CRLF; invalid UTF-8; huge frontmatter; query beginning with `-`; missing `rg`; exit 1 versus exit 2+; ambient config; hidden files; archive/node_modules leakage; max-count truncation; multiline JSONL records; malformed YAML; generic triggers; and Unicode/CJK. Preserve the last known-good index on failed generation and include manifest/index hashes in reports.

Before phase closure, prove: frozen corpus/prompt hashes; two byte-identical generations; atomic no-partial replacement; two-way legacy/index/rg parity; no scope/lifecycle leakage; diagnostics with path/line/reason; fresh-process percentile latency; daemon-off and network-independent execution; phase-004 dry-run/rescan/idempotence; body preimage preservation; and phase-002 continuity-writer behavior. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:57-66; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:128-149; .opencode/skills/system-spec-kit/mcp-server/stress-test/session/gate-d-benchmark-session-resume.vitest.ts:96-107,145-183]`

## 17. Convergence report

- Stop reason: `maxIterationsReached` (forced five-iteration policy).
- Total iterations: 5.
- Ratios: `0.92 -> 0.84 -> 0.78 -> 0.72 -> 0.68`.
- Telemetry: final rolling average `0.788`, MAD `0.06`, entropy coverage `1.0`, composite stop score `0.08`.
- Questions: all six requested research axes have evidence-backed synthesis; the reducer's legacy-import question rows remain mechanically open because no inbox promotion was used.
- Divergence: no pivots, failures, or audited overrides.

## 18. Limitations and scope receipt

The planned implementation files (`generate-trigger-index.mjs`, `parity-check.mjs`, and `prompt-set.json`) are described by phase 001 but were not present in the checkout and were not created in this research-only lineage. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]`

No live daemon baseline, corpus inventory, generator timing, or implementation parity run was claimed here. Parent/phase docs remain unchanged. No `generate-context.js`, `validate.sh`, recursive validator, git write, nested agent, or nested CLI executor was run.

## 19. References

Key repository evidence is cited inline. Official ripgrep references used for flag behavior are:

- `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md]`
- `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs]`

The workflow-generated coverage artifact is lineage-local at `resource-map.md`; it was emitted from the five deltas without changing the parent packet. The full iteration trail is in `iterations/iteration-001.md` through `iteration-005.md`, with structured evidence in `deltas/iter-001.jsonl` through `iter-005.jsonl` and gateway receipts in `events/`.
