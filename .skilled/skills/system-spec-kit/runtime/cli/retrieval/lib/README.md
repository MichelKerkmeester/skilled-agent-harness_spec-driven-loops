---
title: "Retrieval Lib: Shared Retrieval Primitives"
description: "Pure, filesystem-free modules shared by the trigger-index generator, lookup, ripgrep lane and grep-convention retrofit."
trigger_phrases:
  - "retrieval lib primitives"
  - "trigger text normalization"
  - "grep convention primitives"
  - "ripgrep retrieval lane"
---

# Retrieval Lib: Shared Retrieval Primitives

---

## 1. OVERVIEW

`retrieval/lib/` holds the shared logic behind every CLI tool one directory up in `retrieval/`. Each module is deliberately narrow: text normalization, corpus walking, frontmatter reading, deterministic serialization, the ripgrep recipe lane and the grep-convention rule primitives. Nothing here reads a spec-kit config file or writes anything other than what a caller passes it, so every function is directly unit-testable.

Current state:

- All nine modules are `.mjs` ESM with no build step. Callers import them by relative path: `./lib/<name>.mjs` from the sibling `retrieval/` scripts, and `../retrieval/lib/<name>.mjs` from elsewhere in the runtime. `phrase-judge.mjs` is also a package export, with a `.d.mts` declaration file beside it.
- `normalize.mjs` and the ripgrep-facing functions in `rg-lane.mjs` intentionally mirror the logic of the retired substring trigger lane so the generated index, its recorded fixtures and the ripgrep lane cannot silently diverge on what counts as a match.
- `grep-convention.mjs` is the largest module: it is the pure, testable half of the document retrofit in `../../ops/retrofit-convention.mjs`, covering variant classification, the anchor grammar, the trigger allowlist and the diff classifier.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `artifact.mjs` | Deterministic JSON serialization (`stableStringify`), `sha256`, atomic `publishJson` writes and the trigger-index shape assertion. |
| `corpus.mjs` | Sorted, deduped, real-path-aware markdown discovery over `specs/`, `.skilled/skills/`, `.skilled/hooks/` and `.skilled/changelog/skilled/`. |
| `freshness.mjs` | Trigger-index staleness. `compareDocumentPhrases` returns the phrases a document added or dropped relative to the index, and `indexedPhrasesFor` lists the phrases the index attributes to a path. |
| `frontmatter.mjs` | Strict single-key YAML frontmatter reader scoped to `trigger_phrases`, with a closed set of malformed-document categories. |
| `grep-convention.mjs` | Pure primitives for the greppable-corpus convention: anchor grammar, frontmatter block extents, variant classification, the trigger allowlist judge, naming grammar and the diff classifier used by dry-run and rescan. |
| `host-index.mjs` | Host repository detection and index location. `callerRepoRoot` asks git for the checkout root and returns `null` on any failure. `isHostRepository` reports a root that keeps its own index folder, or whose `.skilled` resolves to a folder outside itself. `hostIndexDir` reads the folder from the `indexDir` in the root's `.skilled-host.json` (`HOST_SETTINGS_FILE`), falls back to `.speckit-index` (`DEFAULT_HOST_INDEX_DIR`), and throws on a malformed file, on a folder outside the root or inside `.skilled/`, `specs/`, `.git/` or `node_modules/`, and on a path that is not a folder. It follows links and letter case before it decides, so a link or a differently cased name cannot reach a refused folder. `isHostRepository`, `hostIndexPath` and `owningHostRoot` call it and throw the same error. `hostIndexPath` names `trigger-index.json` inside that folder. `disownedDefaultIndex` names an index left in `.speckit-index/` when the setting points elsewhere and the named folder holds none. `HOST_INDEX_RELATIVE` is the default location, `.speckit-index/trigger-index.json`. |
| `normalize.mjs` | Trigger-text normalization, tokenization and match-class scoring, mirroring the substring trigger lane so the generated index and the live lane score phrases identically. |
| `phrase-judge.mjs` | Trigger-phrase admissibility. `judgeTriggerPhrase` returns the negative class and reason for a phrase the convention rejects, or `null` for an admissible phrase. It also holds the generic-word, template-default and stop-word lists. |
| `rg-lane.mjs` | The three ripgrep recipes (structured, path-only, count) exactly as `references/retrieval/retrieval-conventions.md` documents them, plus recipe execution, JSON-lines parsing and caller-side match ranking. `DEFAULT_LIMIT` is 20. `shapeRankedMatches` keeps each file's first-ranked row and adds `moreInFile`. The wrapper applies `--limit` after ranking. A limit of 0 is uncapped. Shaping returns `matchCount`, `fileCount` and `hidden: { files, matches }`. The wrapper JSON uses `schemaVersion: 2` and includes `limit` and `truncated`. |

---

## 3. CONSUMERS

Bare names are scripts in `retrieval/`, `./` names are sibling modules in this folder, and other paths are relative to this folder.

| Module | Imported by |
|---|---|
| `artifact.mjs` | Every script in `retrieval/`: `generate-trigger-index.mjs`, `lookup-trigger-index.mjs`, `measure-cold-lookup.mjs`, `../../ops/retrofit-convention.mjs`, `rg-wrapper.mjs`, `sweep-memory-residue.mjs`. |
| `normalize.mjs` | `generate-trigger-index.mjs`, `lookup-trigger-index.mjs`, `rg-wrapper.mjs`, `sweep-memory-residue.mjs`, `../../ops/retrofit-convention.mjs`, `../../spec/repo-era.mjs`, `../../spec/template-phrase-census.mjs`, `../../spec/template-phrase-cleanup.mjs`, `../../spec/template-phrase-lint.mjs`, `../../rules/check-grep-convention-helper.mjs`, `./artifact.mjs`, `./corpus.mjs`, `./frontmatter.mjs`, `./grep-convention.mjs`, `./phrase-judge.mjs` and `./rg-lane.mjs`. |
| `rg-lane.mjs` | `../../ops/retrofit-convention.mjs`, `rg-wrapper.mjs`, `sweep-memory-residue.mjs`. |
| `corpus.mjs` | `generate-trigger-index.mjs`, `sweep-memory-residue.mjs`, `../../ops/retrofit-convention.mjs`, `../../spec/repo-era.mjs` and `../../core/workflow.ts` (dynamic import). |
| `freshness.mjs` | `generate-trigger-index.mjs` and `../../core/workflow.ts` (dynamic import). |
| `frontmatter.mjs` | `generate-trigger-index.mjs`, `./grep-convention.mjs` and `../../core/workflow.ts` (dynamic import). |
| `grep-convention.mjs` | `generate-trigger-index.mjs` (`packetFolderTokens`), `../../ops/retrofit-convention.mjs` (the pipeline that applies the convention) and `../../rules/check-grep-convention-helper.mjs` (the validation rule that enforces it). |
| `phrase-judge.mjs` | `generate-trigger-index.mjs`, `../../spec/template-phrase-lint.mjs`, `./grep-convention.mjs` and `../../lib/frontmatter-migration.ts`, which reaches it through the `@spec-kit/runtime` package export. |
| `host-index.mjs` | `generate-trigger-index.mjs` (`callerRepoRoot`, `hostIndexDir`, `hostIndexPath`, `isHostRepository`, `owningHostRoot`), `lookup-trigger-index.mjs` (`callerRepoRoot`, `disownedDefaultIndex`, `hostIndexDir`, `hostIndexPath`, `isFile`, `owningHostRoot`) and `../../spec/upgrade-legacy.mjs` (`callerRepoRoot`, `isHostRepository`). |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Filesystem | Only `artifact.mjs` (`publishJson`), `corpus.mjs` (`walkCorpus`), `host-index.mjs` (which spawns git and reads the filesystem) and `rg-lane.mjs` (`runRecipe`, which spawns ripgrep) touch disk or a subprocess. The other modules are pure functions over their arguments. |
| Duplication with the runtime | `normalize.mjs` and the matching logic in `rg-lane.mjs` deliberately re-implement, rather than import, the equivalent TypeScript the retired lane carried: this tree runs as plain ESM `.mjs` with no build step, so it cannot import compiled runtime output without reintroducing the daemon/MCP path these tools exist to bypass. Keep the two in sync by hand when the runtime lane's scoring changes. |
| Ownership | A function that needs filesystem or subprocess access belongs in one of the four modules above, not scattered into a sibling script. |

---

## 5. VALIDATION

Run from the skill root (`.skilled/skills/system-spec-kit`):

```bash
npx vitest run --config vitest.config.ts --project cli \
  runtime/cli/tests/trigger-index.vitest.ts \
  runtime/cli/tests/host-trigger-index.vitest.ts \
  runtime/cli/tests/rg-wrapper-recipes.vitest.ts \
  runtime/cli/tests/grep-convention.vitest.ts \
  runtime/cli/tests/grep-convention-rule.vitest.ts \
  runtime/cli/tests/sweep-memory-residue.vitest.ts \
  runtime/cli/tests/retrofit-convention-pipeline.vitest.ts
```

Expected result: all suites pass. These vitest files exercise every module in this folder, either directly or through the CLI script that imports it.

```bash
node --check runtime/cli/retrieval/lib/artifact.mjs
```

Expected result: exits `0`. Run for any module edited directly, since there is no build step between this source and what Node executes.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../../rules/README.md`](../../rules/README.md)
