---
title: Ripgrep Retrieval Conventions
description: The ripgrep invocation contract, scoping rules, exit-status mapping and caller-side ranking tuple that replace the three memory retrieval tools, plus the zvec concept lane that sits beside them.
trigger_phrases:
  - "ripgrep retrieval conventions"
  - "ripgrep recipe contract"
  - "caller-side ranking tuple"
  - "retrieval exit status mapping"
  - "trigger index lookup path"
  - "zvec concept lane"
  - "concept versus exact retrieval"
  - "lane merge rule"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Ripgrep Retrieval Conventions

The invocation contract for free-text retrieval over spec docs and skill docs, replacing `memory_search`, `memory_context` and `memory_quick_search`.

---

## 1. OVERVIEW

### Core Principle

Ripgrep is an evidence producer, never the relevance ranker. It returns matches, paths and lines. The caller decides what any of it is worth.

### The Three Lanes

Retrieval splits into a keyed lane, a free-text lane and a concept lane, and no two of them share a mechanism.

| Lane | Mechanism | Used for |
|------|-----------|----------|
| **Gate 1 trigger lookup** | The generated index at `.opencode/skills/system-spec-kit/data/trigger-index.json`, read by `node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs "<prompt>"` | Matching a prompt against author-declared `trigger_phrases` |
| **Free-text evidence** | The ripgrep recipes in Section 2 | Finding a phrase anywhere in the corpus, with no index at all |
| **Concept evidence** | The zvec lane in Section 9, `node .opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs search "<query>"` | Finding a passage when the wording is unknown: concept, paraphrase, fuzzy recall and relationship questions |

The three answer different questions. Prompt-to-declared-phrase matching is a keyed lookup over an author-controlled field. Grepping prose is a scan. Concept search is a ranked retrieval over an embedded index, and it returns a passage that no literal query would have reached.

**An exact identifier always goes to ripgrep first.** A symbol, a path, a flag, an error code, a config key or any string the caller can already spell is a literal-match problem, and the scan answers it exhaustively while the concept lane answers it with a ranked sample. Reaching for the concept lane on a known string trades completeness for nothing. The concept lane earns its place only where the caller cannot spell the target.

> **Availability note.** Both index artifacts are produced by phase `001-trigger-index-replacement`. In a checkout that predates the generator, the ripgrep lane in Section 2 works immediately and the Gate 1 lane does not.

### What This Replaces

| Retired tool | Replacement |
|--------------|-------------|
| `memory_search` | The structured JSONL recipe, Section 2.1 |
| `memory_quick_search` | The path-only recipe, Section 2.2 |
| `memory_context` | The context and anchor recipe, Section 2.4, plus the caller-side ranker in Section 5 |

### What This Does Not Replace

The retired memory surface carried stateful capabilities that a read-only scan cannot provide. Each row below is either a named owner or a declared loss. None of them is a ripgrep recipe.

| Capability | Boundary |
|------------|----------|
| Resume and context assembly | Read `handover.md`, then `_memory.continuity`, then packet-first spec docs and bounded anchors. No session inference. Owned by phase `002-memory-consumer-rewire` |
| Continuity frontmatter writing | A named packet-local writer keeping atomic same-directory update and lock semantics. Ripgrep cannot write. Owned by phase 002 |
| Causal graph and drift analysis | Explicit Markdown links, typed evidence or a named unsupported capability. Grep cannot traverse or statefully update graph edges |
| Resource maps | A static generated path catalog. It is not a dynamic graph |
| Semantic paraphrase, vector and BM25 fusion | Recovered by the zvec lane in Section 9, on different terms: an on-disk index that must be built and rebuilt, a ranked sample rather than an exhaustive answer, and an external tool as the ranker |
| Decay, access tracking and session dedup | Deliberate loss with no owner. All three were properties of a stateful store that observed its own reads. Every lane here is stateless, so a caller must behave explicitly on a no-hit rather than degrading to a guess |

Nothing in this document may be read as a claim that the two index lanes plus grep cover the rows above.

---

## 2. THE RECIPES

Every recipe below is literal. Copy the flags rather than paraphrasing them, because `--no-config`, the two exclusion globs and the `--` separator each close a specific failure.

- `--no-config` is mandatory. Without it `RIPGREP_CONFIG_PATH` can inject arguments the caller never wrote.
- `--hidden` is mandatory. The `.opencode` root holds dotted directories with live documentation, and without the flag ripgrep skips them without a word, so a miss there reads as a clean no-match. The `.git` exclusion glob keeps the flag from reaching repository internals.
- `--glob '!**/z_archive/**'` and `--glob '!**/node_modules/**'` keep archived packets and vendored trees out of the result set.
- `-- 'phrase'` separates the pattern from the flags, so a phrase beginning with a hyphen is a pattern and not a parse error.
- `--fixed-strings` treats the phrase literally. `--ignore-case` applies Unicode simple case folding.

### 2.1 Structured JSONL, replacing `memory_search`

Line-addressable evidence, one JSON object per line.

```text
rg --no-config --hidden --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

### 2.2 Path-only, replacing `memory_quick_search`

One path per matching file, at most one match read per file.

```text
rg --no-config --hidden --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

### 2.3 Count

A separate recipe, because counting is its own output mode.

```text
rg --no-config --hidden --fixed-strings --ignore-case --count \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

### 2.4 Context and anchor, replacing `memory_context`

The structured recipe from Section 2.1 plus a bounded context option. Keep the bound small and explicit, because context lines multiply the JSONL the caller parses.

```text
rg --no-config --hidden --json --fixed-strings --ignore-case -C 2 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

Label every returned line as anchor evidence or body evidence. Anchor evidence is a line inside an anchor block, and the caller establishes that by searching for the marker itself.

```text
rg --no-config --hidden --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- '<!-- ANCHOR:summary -->' specs
```

The grammar is an exact pair. An opening `<!-- ANCHOR:id -->` and a closing `<!-- /ANCHOR:id -->` with the same `id`, addressed by one-based line numbers. Ordinary section IDs are lower-kebab. Typed IDs may carry a type prefix, as in `DECISION-pipeline-003`. Report an unmatched or orphan marker as a diagnostic rather than silently dropping it.

### 2.5 One output mode per invocation

`--json` cannot be combined with the path-only mode (`-l` or `--files-with-matches`), the count mode (`-c` or `--count`) or `--count-matches`. Each output mode is its own recipe, and the wrapper parses one shape at a time.

> **Observed hazard at ripgrep 14.1.1.** Combining them is not rejected. The last output-mode flag on the command line wins silently. `rg --json --count` returned count lines and `rg --count --json` returned JSONL, both at exit `0`. A wrapper that sets both flags therefore gets whichever it happened to write last, and a JSONL parser handed count output sees an empty result rather than an error. Do not rely on ripgrep to catch this.

---

## 3. SCOPING BY TRACK AND PACKET

Narrow by positional path, not by pattern. The trailing positional arguments are the search roots, so replacing `specs .opencode` with a deeper path is the whole mechanism.

| Scope | Positional argument |
|-------|---------------------|
| Everything | `specs .opencode` |
| One track | `specs/<track>` |
| One packet | `specs/<track>/<NNN-name>` |
| One phase child | `specs/<track>/<NNN-name>/<NNN-child-name>` |

Worked example, the packet scope:

```text
rg --no-config --hidden --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 --glob '*.md' \
  -- 'trigger index generator' specs/system-speckit/049-memory-decommission/001-trigger-index-replacement
```

Packet directories are `NNN-short-descriptive-name`, lowercase and hyphen-separated, which is what makes them usable as deterministic path inputs. Keep the document basename as a separate document-type field rather than folding it into the path scope.

This maps one to one onto the SQL lane it replaces. The retired `exactTriggerSearch` query took an optional spec-folder filter and applied it as a prefix match on the stored `spec_folder` column. The positional path here is that same prefix. A caller comparing the two lanes passes `specs/<track>/<NNN-name>` to ripgrep and the identical string to the SQL `spec_folder` prefix filter, and any difference in the result set is a real parity finding rather than a scoping artifact.

---

## 4. EXIT STATUS

Three outcomes, and a wrapper must branch on all three. Treating a non-zero exit as one failure class conflates a clean no-hit with a broken command.

| Exit | Meaning | Wrapper behavior |
|------|---------|------------------|
| `0` | At least one match | Parse the output for the requested mode |
| `1` | No match | An empty result, not an error. Return it as such |
| `2` or higher | Execution or configuration error | Fail loudly with stderr attached. Never report it as no-hit |

### Worked Example

Run against this repository at ripgrep 14.1.1, with the phrase `trigger index generator` and the roots `specs .opencode`.

| Recipe | Observed exit | Observed output |
|--------|---------------|-----------------|
| Structured JSONL, Section 2.1 | `0` | 10 JSONL records |
| Path-only, Section 2.2 | `0` | 3 paths |
| Count, Section 2.3 | `0` | 3 lines, one match each |
| Context and anchor, Section 2.4 | `0` | 22 JSONL records at `-C 2` |
| Path-only with the phrase `zzq-no-such-phrase-here` | `1` | Empty |
| Any recipe with a search root that does not exist | `2` | `rg: <path>: IO error ... (os error 2)` on stderr |
| A malformed `--regexp` pattern | `2` | `rg: regex parse error` on stderr |

The two exit `2` rows are the reason the mapping matters. Both produced no stdout, which is exactly what an exit `1` produces, so a wrapper reading stdout alone cannot tell a clean miss from a broken invocation.

---

## 5. RANKING CONTRACT

Ripgrep supplies matches, paths and lines. It never ranks relevance, and no document, plan or wrapper comment may imply that it does. Ordering is the caller's job, applied after parsing, using this stable tuple.

1. **Evidence field**, most specific first: `trigger_phrases`, then title or description, then anchor marker, then body line.
2. **Normalized match class**: exact phrase, then phrase containment, then token coverage.
3. **Relative path**, then one-based line number.

Each result carries its document type and its packet path alongside the ranked position, so a caller can filter or group without a second scan.

The tuple is deterministic by construction. Every component is derived from the parsed match, none of it from ripgrep's own output order, and the final path and line pair breaks every remaining tie. Two runs over an unchanged corpus therefore produce the same ordering.

---

## 6. FLAGS THAT ARE NOT SUBSTITUTES

Each of these looks like it does the job and does something else.

| Flag | What it actually does | Why it is not a substitute |
|------|----------------------|----------------------------|
| `-w` or `--word-regexp` | Adds word boundaries around the pattern | Narrower than the SQL `%token%` behavior it appears to replicate. The retired lane deliberately admitted partial-token substrings, so word boundaries drop candidates the baseline returned |
| `--sort=path` | Sorts results by path | Path order is not relevance order. It also forces single-threaded execution, so it costs throughput to buy an ordering the ranker in Section 5 does not use |
| `--multiline` | Lets a pattern span line breaks | Opt-in only. It raises memory and time cost, and one-fact-per-line structured evidence does not need it |
| `--pre` | Runs a preprocessing command per file | Opt-in only. A command invocation per file is not a default Markdown path |
| `--type-add` | Defines a file type for the current command or config | A per-invocation or per-config definition, not a persistent index. It does not survive to the next call |

---

## 7. AMBIENT CONFIGURATION

Ripgrep reads state the caller did not pass on the command line. For a reproducible recipe, every one of these has to be neutralized or made explicit.

| Source | Effect | Handling |
|--------|--------|----------|
| `RIPGREP_CONFIG_PATH` | Injects arbitrary arguments into every invocation | `--no-config`, mandatory in all recipes |
| `.gitignore` | Filters files automatically and silently | Pass explicit positive and negative globs so the result set does not depend on it |
| `.ignore` | Same, ripgrep-and-friends specific | Same |
| `.rgignore` | Same, ripgrep specific | Same |

**Glob order matters.** Later globs override earlier ones. `--glob '*.md'` selects Markdown, and the two exclusion globs that follow it remove `z_archive` and `node_modules` from that selection. Reversing the order re-admits what the exclusions were there to remove. When a recipe is edited, keep the positive glob first and the exclusions last, and document any override a caller adds.

---

## 8. WHAT BELONGS IN `trigger_phrases`

The index is only as good as the corpus it reads. `trigger_phrases` is an author-controlled field, and the value of the Gate 1 lane depends entirely on authors putting distinctive things in it.

### Include

- Distinctive user-searchable domain terms
- Exact decisions
- API and symbol names
- Failure symptoms
- Packet-specific multi-word concepts

### Warn On

- Generic workflow words: `session`, `context`, `memory`, `summary`, `feature`, `update`, `file`, `document` and `section`
- Stopword-only phrases
- Whole prose sentences
- Body-derived fallbacks

The last one is not hypothetical. The frontmatter editor inserts folder tokens and ultimately falls back to `session` and `context`, and the body extractor applies its own separate stop-word and n-gram policy. Neither should silently define index input. A phrase that arrived by fallback rather than by an author's choice is corpus pollution, and it costs precision on every query that touches it.

Use one canonical spelling in emitted frontmatter. A reader may recognize the `triggerPhrases` alias for compatibility and report it, but canonical output stays `trigger_phrases`.

---

## 9. THE ZVEC CONCEPT LANE

Hybrid BM25 and local vector retrieval over an on-disk index, behind the wrapper at `.opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs`. It answers the query the other two lanes cannot: one where the caller knows the idea and not the wording.

The tool is the harness's own fork of zvec-grep, vendored at `.opencode/skills/system-plugins/zvec-grep/` as a git subtree and built in place; see that folder's README for the build and update steps. The wrapper resolves an entry point in a fixed order: the `SPECKIT_ZVEC_GREP_BIN` override, then the vendored build, then a `zg` on PATH, then a fork checkout outside the harness. The vendored copy outranks PATH deliberately, because the global package is upstream and lacks the fork's Ollama embedder and its scan-free direct query; an unbuilt vendored copy is reported by `/doctor zvec`, never silently replaced.

### When It Is The Right Lane

| Query shape | Lane |
|-------------|------|
| A symbol, path, flag, error code, config key, or any string the caller can spell | Ripgrep, Section 2. Exhaustive, and the concept lane only samples |
| A prompt matched against author-declared `trigger_phrases` | The Gate 1 index |
| "Why does X refuse Y", "where is Z handled", "what stops A from doing B" | This lane |
| A paraphrase of wording the corpus may never use | This lane |

The rule that keeps the boundary honest is one-directional: an exact identifier goes to ripgrep first, always. Going the other way is fine — a concept query that surfaces a filename is a good reason to run a literal scan next.

### The Recipe

```text
node .opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs \
  search 'why does the retrofit refuse partial frontmatter blocks' --limit 7 --json
```

Two companion subcommands share the wrapper. `index` builds or updates the workspace index from the committed scope at `.zvec-grep-lane.json`; `status` reports presence, readiness, coverage, freshness and the embedding schema read from the generated manifest.

Four flags are load-bearing and the wrapper never drops them.

- `--mode direct` is forced on every spawn. The lane runs no daemon, and an ambient `ZVEC_GREP_MODE` of `server` or `auto` would otherwise reroute the call and change both the refresh policy and the failure surface.
- `--trace` is what makes scores appear. Without it every hit prints the same nothing, and a hit with no score cannot be weighed against a ripgrep hit.
- `--hidden` is required at index time. Without it the scanner skips every dotted directory, so the whole `.opencode` tree is dropped while its globs are still accepted, the build still reports success, and status still reports full coverage of what it did scan.
- `--preview none` keeps source excerpts out of the parsed output, which the caller does not read and which cost context.

### Exit Mapping

The same three classes as the ripgrep lane, so a caller branches once across both.

| Exit | Meaning | Caller behavior |
|------|---------|-----------------|
| `0` | At least one hit, or a ready index | Parse the results |
| `1` | No hits, or no index yet | A valid empty result, never an error |
| `2` or higher | Execution or configuration error | Fail loudly with stderr attached |

**These three classes are computed by the wrapper, not reported by the tool.** zvec-grep exits `0` or `1` and nothing else. A query that finds nothing still exits `0`, so the no-hit class comes from the parsed hit count; `status --check-ready` exits `1` both for an index that is not ready and for a genuine engine fault, separated only by the `Error:` line one of them prints to stderr. A caller that reads the tool's own status instead of the wrapper's gets a miss reported as a match.

### The Merge Rule

Results arrive in the Section 5 rank tuple, so hits from both lanes sit in one list without a per-lane branch.

| Field | Zvec value |
|-------|-----------|
| Evidence field | `frontmatter`, `body`, or `unlocated` for a hit with no line |
| Match class | `lexical-and-semantic`, `lexical`, `semantic`, or `unclassified` |
| Relative path, one-based line | As parsed; `line` is null for a byte, page or whole-file locator |
| `score` | The semantic score, which ripgrep has no analogue for |
| `lane` | `zvec`, so a merged list stays attributable |

The match classes are lane labels, not the lexical scorer's. Nothing here was matched by literal containment, so reusing `exact` or `phrase-containment` would claim a precision the vector lane never establishes.

Merging is by rank within lane, and the lane order is the boundary rule above: for a query carrying an exact identifier, ripgrep's hits lead; for a concept query, zvec's do. **Within the zvec lane the wrapper preserves the tool's own order rather than re-deriving it**, which is the one place this document defers to an external ranker. It has to: the fusion score behind that rank is not reconstructible from the printed output, and re-sorting on a tuple that cannot see it would discard the only relevance signal the lane has. Section 5's guarantee — that ordering is the caller's, derived from the parsed match — holds for ripgrep and does not extend here. A merged list must not be described as deterministically ranked end to end.

### What This Lane Costs

The index is generated state under `.zvec-grep/`, git-ignored and rebuildable, and it is stale the moment the corpus moves. zvec-grep reuses its stored file selection until an explicit `--rebuild` or `--reset-paths`, so editing the committed scope changes nothing until someone rebuilds. Building embeds the whole corpus through the local Ollama server, about 270 files a minute on this corpus, which is expensive enough to be an operator action rather than a background one; `/doctor zvec` reports on the lane and never builds it.

---

## 10. RELATED RESOURCES

### Research

- [research.md](../../../../../specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md) - Evidence and source citations behind every rule in this document

### Reference Files

- [folder-structure.md](../structure/folder-structure.md) - Packet naming and placement, the input to Section 3 scoping
- [SKILL.md](../../SKILL.md) - Spec-folder workflow and validation entry point

### Scripts

- `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs` - Gate 1 trigger lookup over the generated index
- `.opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs` - The Section 2 recipes behind one front door, with the Section 5 rank applied
- `.opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs` - The Section 9 concept lane: `index`, `status` and `search`

---
