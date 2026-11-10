---
title: "Iteration 2: ripgrep invocation and replacement contract"
trigger_phrases: []
---
# Iteration 2: ripgrep invocation and replacement contract

## Focus

Map the three retired retrieval shapes to reproducible ripgrep commands and identify the thin parser/ranker required around ripgrep output. This targets phase 001 `retrieval-conventions.md` and the phase 004 corpus validation contract.

## Findings

### 1. The three MCP names represent different retrieval shapes

`memory_context` is an orchestration layer. Quick mode calls trigger matching with a default limit of five; deep and focused modes call `memory_search` with defaults of ten and eight. Those calls forward `specFolder`, `includeContent`, `anchors`, session/dedup settings, and a response profile. Resume mode reads the folder-local handover/continuity/spec-document ladder directly. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:1102-1140,1161-1200,1209-1284]`

`memory_search` accepts a query or 2–5 concepts, optional exact scope, anchors, content inclusion, limit, archive policy, and ranking/session controls; it validates that at least one search input exists. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:667-706,1290-1338,1379-1395]` The reference catalog calls `memory_quick_search` a simplified fast keyword wrapper and `memory_match_triggers` the fast keyword path. `[SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:91-108]`

**Recommendation:** phase 001 must freeze a three-row compatibility table: broad body search, frontmatter-trigger lookup, and context/anchor assembly. An `rg` command can preserve file selection, literal matching, anchors, caps, and deterministic post-processing; it cannot reproduce MCP session state, decay, semantic expansion, or database governance.

### 2. `--json` is the structured match stream, but cannot be combined with path/count projections

The official source defines `--json` as JSON Lines and states that it is incompatible with `--files`, `-l/--files-with-matches`, `-c/--count`, and `--count-matches`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]` The guide documents `-c`, `--files`, `-a`, `-U/--multiline`, and `--sort path` as separate modes. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:897-912]`

**Recommended recipes (the convention document must provide safe shell quoting):**

```text
# memory_search: structured match events for a caller-side ranker
rg --no-config --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- '<literal query>' .opencode/specs

# memory_quick_search: paths only, bounded to one matching line per file
rg --no-config --files-with-matches --max-count 1 --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- '<literal token or phrase>' .opencode/specs

# context/anchor lookup: structured lines in one packet, bounded context window
rg --no-config --json --fixed-strings --ignore-case -C 3 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -e '<query>' -e 'ANCHOR:<anchor-id>' -- '<packet path>'
```

The first command is parsed as JSONL; the second intentionally is not JSON; the third is a bounded anchor/context projection. The convention must state that these are separate projections, not interchangeable flags.

### 3. Literal, case, and word matching are distinct contracts

`-F/--fixed-strings` treats the pattern literally. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:2224-2251]` `-i/--ignore-case` applies Unicode simple case folding. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3037-3090]` `-w/--word-regexp` adds word boundaries. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473]`

The old trigger lane lowercases and replaces non-ASCII-alphanumeric characters with spaces before tokenizing. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747]` Therefore `-F -i` is the default for body/phrase matching, while `-w` is only for a separately normalized single-token query. It must not be advertised as SQL `LIKE '%token%'` parity, because word boundaries reject embedded substrings admitted by the old lane. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]`

### 4. Globs and ignore files need an explicit, testable exclusion policy

Ripgrep recursively filters using `.gitignore`, `.ignore`, and `.rgignore`, with documented precedence and hidden/binary/symlink defaults. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:150-219]` Globs include/exclude files, `!` creates a blacklist, and later globs have precedence. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:249-279]`

**Recommendation:** use repository ignore rules as defense in depth, but put explicit negative globs in every pasted command. Every parity fixture must add `--no-config` so `RIPGREP_CONFIG_PATH`, aliases, or local ignore rules cannot silently change the expected set. A config recipe may be documented separately; the guide says config lines are prepended, CLI options override them, and `--no-config` disables configuration. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:478-552]` Phase 004 must test nested files under both `z_archive` and `node_modules`, not just top-level names.

### 5. Type, sorting, and max-count flags have bounded roles and costs

`--type-add` adds a glob for the current command and is not persistent without configuration. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6892-6924]` `--sort=path` is deterministic path ordering but single-threaded and disables normal parallelism. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]` `-m/--max-count` caps matching lines per file and has multiline-specific behavior. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4002-4034]`

**Recommendation:** leave `rg` unsorted for throughput, parse events, and stable-sort candidates by `(score desc, exactness desc, path depth asc, path lexicographic asc, line asc)`. Use `--sort=path` only for a path-list/debug recipe. Use `--max-count` as an output-flood guard, not as a relevance score; parity runs must omit it or set and record a cap above expected matched lines.

### 6. Multiline and preprocessing are opt-in exceptions

`-U/--multiline` can require contiguous file loading and be slower/more memory intensive. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294]` `--pre` runs a command once per file and can be expensive; `--pre-glob` restricts which files are preprocessed. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:5489-5527,5603-5646]`

**Recommendation:** forbid both in default Markdown recipes. Permit multiline only for a named, packet-scoped anchor-block diagnostic; permit preprocessors only for an explicitly named non-Markdown source and require `--pre-glob`. One-fact-per-line and explicit ANCHOR delimiters should make the normal path line-oriented.

### 7. Ripgrep does not rank relevance

The official guide describes ripgrep as line-oriented matching that prints matching lines, not a relevance-ranking engine. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:23-26]` A deterministic wrapper should parse JSON matches, classify fields (`trigger_phrases` > `title`/`description` > `ANCHOR` heading > body), score exact normalized phrase above phrase containment above token coverage, add a bounded same-file line-proximity bonus, deduplicate per file/phrase, and sort with path/line ties. Do not use raw match count as relevance because boilerplate can dominate. This ranking is an inference from the baseline score cases and ripgrep's line output, not a built-in rg behavior. `[INFERENCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:750-765,841-867; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:23-26]`

### 8. Ranked amendment recommendations

1. **P0 — phase 001 `spec.md` REQ-005/success:** require a three-row table containing exact commands, `--no-config`, roots, exclusions, output formats, caps, and caller-side ranking. Amend `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-151,157-162]`.
2. **P0 — phase 001 `plan.md`:** add the parser/ranker boundary; state that `--json` is structured search, `-l` and `-c` are separate projections, and path sorting is not relevance ranking. Amend `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104,119-130]`.
3. **P0 — phase 001 `tasks.md`/acceptance:** split T007 into commands, ignore fixtures, JSON parser, deterministic tie-breaks, and `--no-config` replay; extend T008/T011 across JSON, path-only, and anchor projections. Amend `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]` and `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:57-66]`.
4. **P1 — phase 004 `spec.md`:** validate active roots and negative globs, and reject conventions that require multiline search for one-fact lines. Amend `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-149]`.
5. **P1 — phase 004 plan/tasks/acceptance:** add command replay after retrofit, nested archive/node_modules controls, and line-oriented anchor probes. Amend `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/plan.md:24-65]`, `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:34-60]`, and `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:55-57]`.

## Ruled Out

- `--sort=path` as relevance ranking: it is path ordering, single-threaded, and cannot express field/phrase priority. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]`
- Combining `--json` with `-l` or `-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]`
- `-w` as trigger substring parity. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473]`
- Default `--multiline` or `--pre` for Markdown. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]`

## Dead Ends

No new dead end. Iteration 1's phrase-only index and stop-word/stemming directions remain exhausted.

## Edge Cases

- Query values beginning with `-` need `--`/`-e` handling and safe quoting.
- `--json` includes non-match events; the parser must ignore or validate them and fail closed on malformed JSON.
- `-l` loses line/field information and is for quick candidate discovery only.
- `-c` counts matching lines, not unique facts/files, and multiline changes its meaning. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:1252-1288]`
- Unicode `-i` folding may differ from baseline ASCII normalization; frozen prompts need accented/non-Latin cases.
- Ambient configuration must not affect parity because `--no-config` is explicit. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:478-552]`
- Missing anchors must return structured no-hit rather than silently returning a whole file.

## Sources Consulted

- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:1102-1284,1638-1685]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:667-706,1290-1395]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-triggers.ts:327-378,432-455,709-763]`
- `[SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:91-108,159-180,287-300]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104,119-130]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-149]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/plan.md:24-65]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:34-60]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:55-57]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747,804-819]`
- `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md]`
- `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs]`

## Assessment

The ripgrep replacement is implementable without embeddings only if phase 001 specifies a deterministic parser/ranker after `rg`. Ripgrep supplies literal matching, filtering, and structured transport; it does not supply field-aware relevance, semantic expansion, or MCP session behavior. `--no-config` plus explicit globs is the minimum reproducibility boundary.

## Reflection

Iteration 1 established why trigger lookup needs substring-aware postings. This iteration establishes a different seam for body retrieval: a command/output protocol plus post-processor, not a single flag. The remaining review should establish corpus guarantees and explicit replacements for retired persistence and graph capabilities.

## Recommended Next Focus

Inspect active frontmatter, templates, ANCHOR/naming conventions, save/continuity code, causal graph, and resource-map artifacts. Determine what the corpus can guarantee for field-aware ranking and which MCP capabilities need file-based replacements.
