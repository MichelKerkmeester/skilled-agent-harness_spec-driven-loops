---
title: "Retrieval Lib: Shared Retrieval Primitives"
description: "Pure, filesystem-free modules shared by the trigger-index generator, lookup, parity harness, ripgrep lane and grep-convention retrofit."
trigger_phrases:
  - "retrieval lib primitives"
  - "trigger text normalization"
  - "grep convention primitives"
  - "ripgrep retrieval lane"
---

# Retrieval Lib: Shared Retrieval Primitives

---

## 1. OVERVIEW

`retrieval/lib/` holds the shared logic behind every CLI tool one directory up in `retrieval/`. Each module is deliberately narrow: text normalization, corpus walking, frontmatter reading, deterministic serialization, the ripgrep recipe lane, the legacy substring-search replica and the grep-convention rule primitives. Nothing here reads a spec-kit config file or writes anything other than what a caller passes it, so every function is directly unit-testable.

Current state:

- All seven modules are `.mjs` ESM, imported with relative `./lib/<name>.mjs` specifiers from the sibling `retrieval/` scripts and from `rules/check-grep-convention-helper.mjs`.
- `normalize.mjs` and the ripgrep-facing functions in `rg-lane.mjs` intentionally mirror logic in `runtime/lib/search/hybrid-search.ts` so the generated index, the substring trigger lane and the ripgrep lane cannot silently diverge on what counts as a match.
- `grep-convention.mjs` is the largest module: it is the pure, testable half of the document retrofit in `../retrofit-convention.mjs`, covering variant classification, the anchor grammar, the trigger allowlist and the diff classifier.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `artifact.mjs` | Deterministic JSON serialization (`stableStringify`), `sha256`, atomic `publishJson` writes and the trigger-index shape assertion. |
| `corpus.mjs` | Sorted, deduped, real-path-aware markdown discovery over `specs/` and `.opencode/skills/`. |
| `frontmatter.mjs` | Strict single-key YAML frontmatter reader scoped to `trigger_phrases`, with a closed set of malformed-document categories. |
| `grep-convention.mjs` | Pure primitives for the greppable-corpus convention: anchor grammar, frontmatter block extents, variant classification, the trigger allowlist judge, naming grammar and the diff classifier used by dry-run and rescan. |
| `legacy-lane.mjs` | Replays the substring trigger lane from `runtime/lib/search/hybrid-search.ts` directly against the sqlite index, with no daemon and no MCP transport in the path. |
| `normalize.mjs` | Trigger-text normalization, tokenization and match-class scoring, mirroring the substring trigger lane so the generated index and the live lane score phrases identically. |
| `rg-lane.mjs` | The three ripgrep recipes (structured, path-only, count) exactly as `references/retrieval/retrieval-conventions.md` documents them, plus recipe execution, JSON-lines parsing and caller-side match ranking. |

---

## 3. CONSUMERS

| Module | Imported by |
|---|---|
| `artifact.mjs` | Every script in `retrieval/`: `generate-trigger-index.mjs`, `lookup-trigger-index.mjs`, `measure-cold-lookup.mjs`, `parity-check.mjs`, `retrofit-convention.mjs`, `rg-wrapper.mjs`, `sweep-memory-residue.mjs`. |
| `normalize.mjs` | `generate-trigger-index.mjs`, `lookup-trigger-index.mjs`, `parity-check.mjs`, `retrofit-convention.mjs`, `rg-wrapper.mjs`, `sweep-memory-residue.mjs`. |
| `rg-lane.mjs` | `parity-check.mjs`, `retrofit-convention.mjs`, `rg-wrapper.mjs`, `sweep-memory-residue.mjs`. |
| `corpus.mjs` | `generate-trigger-index.mjs`, `retrofit-convention.mjs`. |
| `frontmatter.mjs` | `generate-trigger-index.mjs` only. |
| `legacy-lane.mjs` | `parity-check.mjs` only (the legacy arm of the three-arm parity harness). |
| `grep-convention.mjs` | `retrofit-convention.mjs` (the pipeline that applies the convention) and `../../rules/check-grep-convention-helper.mjs` (the validation rule that enforces it). |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Filesystem | Only `artifact.mjs` (`publishJson`), `corpus.mjs` (`walkCorpus`) and `rg-lane.mjs` (`runRecipe`, which spawns ripgrep) touch disk or a subprocess. The other modules are pure functions over their arguments. |
| Duplication with the runtime | `normalize.mjs` and the matching logic in `rg-lane.mjs` deliberately re-implement, rather than import, the equivalent TypeScript in `runtime/lib/search/hybrid-search.ts` — this tree runs as plain ESM `.mjs` with no build step, so it cannot import compiled runtime output without reintroducing the daemon/MCP path these tools exist to bypass. Keep the two in sync by hand when the runtime lane's scoring changes. |
| Ownership | A function that needs filesystem or subprocess access belongs in one of the three modules above, not scattered into a sibling script. |

---

## 5. VALIDATION

Run from the skill root (`.opencode/skills/system-spec-kit`):

```bash
npx --prefix scripts vitest run --config runtime/vitest.config.ts \
  scripts/tests/trigger-index.vitest.ts \
  scripts/tests/parity-check.vitest.ts \
  scripts/tests/rg-wrapper-recipes.vitest.ts \
  scripts/tests/grep-convention.vitest.ts \
  scripts/tests/grep-convention-rule.vitest.ts \
  scripts/tests/sweep-memory-residue.vitest.ts \
  scripts/tests/retrofit-convention-pipeline.vitest.ts
```

Expected result: all suites pass. These vitest files exercise every module in this folder, either directly or through the CLI script that imports it.

```bash
node --check retrieval/lib/artifact.mjs
```

Expected result: exits `0`. Run for any module edited directly, since there is no build step between this source and what Node executes.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../../rules/README.md`](../../rules/README.md)
