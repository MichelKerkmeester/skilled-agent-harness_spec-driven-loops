---
title: "Iteration 1 — Cohort enumeration + parser site location + version pins"
description: "Exploratory pass. Enumerates the 121-row parse_diagnostics cohort, locates the WASM parse() call site, captures exact version pins of the WASM stack, and surfaces the 5-file qualitative sample. Reframes the hypothesis space: native-binding hypothesis (A) is RULED OUT (no native binding installed). Two-error-class signal: bash files crash with a different upstream error than .ts/.py/.js files."
trigger_phrases:
  - "iteration 1"
  - "parser cohort enumeration"
importance_tier: "important"
contextType: "research-iteration"
---

# Iteration 1 — Cohort enumeration + parser site location + version pins

## Findings

### F-1.1 [P0] Hypothesis A (native binding mismatch) is RULED OUT — pure WASM stack

The runtime has **no native `tree-sitter` Node binding installed**. The parser path is exclusively `web-tree-sitter` (WASM) loading prebuilt grammars from `tree-sitter-wasms`. There is no native `tree-sitter` or `tree-sitter-typescript` Node addon in the dependency tree to bisect; native-version-mismatch as the root cause is empirically impossible.

- `mcp_server/package.json:49-62` — only `tree-sitter-wasms@^0.1.13` and `web-tree-sitter@^0.24.7` declared. No `tree-sitter` (native) or `tree-sitter-typescript` (native) listed.
- `mcp_server/code_graph/lib/tree-sitter-parser.ts:84` — `const mod = await import('web-tree-sitter')` is the sole grammar runtime; `parserInstance = new ParserClass()` (line 87) constructs a WASM parser, not a native binding.

**Consequence for Q1:** version pinning work pivots from "native binding × native grammar" matrix to "web-tree-sitter × tree-sitter-wasms × prebuilt-grammar" matrix. Vendored versions captured in F-1.4.

### F-1.2 [P0] Two-error-class signal — error_message correlates strongly with file extension

The 121-row cohort splits into two distinct upstream failure modes:

| error_message | .sh | .ts | .py | .js | total |
|---|---|---|---|---|---|
| `resolved is not a function` | 70 | 0 | 0 | 0 | **70** |
| `memory access out of bounds` | 33 | 10 | 6 | 2 | **51** |

- 100% of "resolved is not a function" failures are `.sh` files (70/70). 100% of non-.sh failures are "memory access out of bounds" (18/18 across .ts/.py/.js). The .sh extension itself splits 70/33 across the two classes.
- The `resolved is not a function` string is **not produced by application code** — `rg 'resolved is not a function' .opencode/skills/system-spec-kit/mcp_server/code_graph/` returns zero hits. It originates from the WASM glue layer:
  - `mcp_server/node_modules/web-tree-sitter/tree-sitter.js:1163` — `return resolved(...args);` inside a Proxy stub for unresolved WASM symbols.
- This is consistent with a **stale-symbol-table failure inside the WASM dynamic-linker proxy**: the `resolved` closure captured at proxy construction is itself uninitialized when invoked, so calling it as a function throws TypeError. The fact that this tracks .sh files suggests the bash grammar's WASM exports a symbol set that triggers the proxy fallback path differently from typescript/python/javascript grammars.

**Consequence:** the cohort is heterogeneous. Hypothesis B (WASM grammar bug) actually splits into B1 (bash-grammar-specific dynamic-linker fault) and B2 (memory access OOB across multiple grammars). Iterations 2-3 must discriminate B1 vs B2 separately.

### F-1.3 [P0] Parse() call site located — fail-soft try/catch wraps every per-file parse

The WASM parse call lives in **two layers**, both inside a try/catch:

- `mcp_server/code_graph/lib/tree-sitter-parser.ts:714` — `const tree = parserInstance.parse(content);` (innermost WASM call).
- `mcp_server/code_graph/lib/tree-sitter-parser.ts:741-756` — `catch (err: unknown)` returns `parseHealth: 'error'` with `parseErrors: [err.message]` instead of throwing. This is why F-003 parse-error-preservation already surfaces these as `parse_diagnostics` rows rather than aborting the scan.
- `mcp_server/code_graph/lib/structural-indexer.ts:1244-1257` — outer-layer `parser.parse(content, language, edgeWeights)` is also wrapped in try/catch.
- `mcp_server/code_graph/handlers/scan.ts:162-170` — `recordParseDiagnosticsForResults()` writes to SQLite via `graphDb.recordParseDiagnostic(result.filePath, formatParseDiagnosticMessage(result))`.
- `mcp_server/code_graph/lib/code-graph-db.ts:561-578` — `recordParseDiagnostic()` UPSERT increments `error_count`. `last_seen_at` per row in the cohort is `2026-05-06T13:18:46Z` to `13:19:32Z`, suggesting the diagnostics were captured during a recent live scan today.

**Recommendation for Q7:** the skip-list lookup belongs immediately above `tree-sitter-parser.ts:714` (early-return without attempting `parserInstance.parse`), and the skip-list write belongs in the existing `catch` at line 741-756 (record-and-continue). Both surfaces are already isolated single-file modules with no callers outside `structural-indexer.ts`, so the change is local.

### F-1.4 [P1] Exact version pins of WASM stack

Vendored versions in `mcp_server/node_modules/`:

| Component | Declared | Vendored exact | Notes |
|---|---|---|---|
| `web-tree-sitter` | `^0.24.7` (`mcp_server/package.json:60`) | **0.24.7** (`tree-sitter.js:1163` shows the failing line) | 1 minor behind likely upstream as of 2026-05; check WebFetch in iter-2. |
| `tree-sitter-wasms` | `^0.1.13` (`mcp_server/package.json:59`) | **0.1.13** | Bundled grammars built March 31 2026 19:23 (mtime on `out/*.wasm`). |
| `tree-sitter-bash` (inside `tree-sitter-wasms`) | `^0.20.5` (`tree-sitter-wasms/package.json`) | n/a — built at 0.20.5+ | Bash-grammar-specific bug landing area. |
| `tree-sitter-typescript` | `^0.20.5` | n/a — built at 0.20.5+ | |
| `tree-sitter-python` | `^0.21.0` | n/a — built at 0.21.0+ | |
| `tree-sitter-javascript` | `^0.20.3` | n/a — built at 0.20.3+ | |

The TS dependency in `mcp_server/package.json` does NOT declare `tree-sitter-typescript` directly; it pulls the grammar transitively through `tree-sitter-wasms` only. That means a "version bisect" (Hypothesis A pivoted) means swapping `tree-sitter-wasms` to a different release whose underlying grammar pins differ — not a simpler binding swap.

The WASM grammar artifacts themselves: `tree-sitter-bash.wasm` is **1.4 MB** (largest among the language family), `tree-sitter-typescript.wasm` is included alongside `tree-sitter-tsx.wasm`. The `tsx` variant exists but the parser site never selects it — all `.tsx` and `.ts` files route to `'typescript'` (`mcp_server/code_graph/lib/indexer-types.ts:128-129`) which loads `tree-sitter-typescript.wasm` only. This is a separate latent issue (TSX-specific syntax may parse degraded against the non-tsx grammar), but is NOT load-bearing for this packet — there are zero `.tsx` rows in `parse_diagnostics` (verified: `SELECT COUNT(*) ... WHERE file_path LIKE '%.tsx' = 0`).

### F-1.5 [P1] Cohort distribution shape — 121 unique files, dominated by spec-kit scripts and recent specs

Total: **121 unique files** (not the 1,640 figure from the strategy doc; that figure represents *parse-error events* during the broad-scope scan, not unique files persisted). Persistence is keyed on `file_path PRIMARY KEY` so the diagnostics table dedupes per-file across scan rounds (`error_count` accumulates).

Top extension breakdown:
- `.sh` — 103 (85%)
- `.ts` — 10 (8%)
- `.py` — 6 (5%)
- `.js` — 2 (2%)

All 121 paths are absolute (start with `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`). Sample top-level directory pulls (paths trimmed):
- `.opencode/skills/system-spec-kit/scripts/` — bulk of the .sh "resolved is not a function" cohort (validate.sh, create.sh, archive.sh, calculate-completeness.sh, etc.)
- `.opencode/install_guides/install_scripts/` — install-sequential-thinking.sh, install-all.sh, _utils.sh
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/...` — 5 of the 10 .ts crashes (stress test files, all >300 lines, all using `import { ... } from '/Users/michelkerkmeester/...'` absolute imports of length 100-180 chars)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/030-hook-plugin-per-runtime-testing/runners/` — the other 5 .ts crashes (common.ts, run-all-runtime-hooks.ts, test-claude-hooks.ts, test-codex-hooks.ts, test-copilot-hooks.ts, test-gemini-hooks.ts, test-opencode-plugins.ts) — same absolute-import pattern.
- `.opencode/specs/skilled-agent-orchestration/07[126]-sk-doc-router-*/` — 3 of the 6 .py crashes (extract_metrics.py / extract_metrics_v2.py / extract_metrics_v3.py — generated metrics extractors)

The 2 `.js` failures are in `.opencode/plugins/spec-kit-compact-code-graph.js` and `.opencode/plugins/spec-kit-skill-advisor.js` — both >500 lines, both Claude Code hook plugins.

### F-1.6 [P1] Qualitative sample of 5 failing files — common-syntax pattern emerges

Sampled 5 failing files distributed across error class × extension:

| File | Ext | Lines | Error | Notable syntactic feature |
|---|---|---|---|---|
| `.opencode/install_guides/install_scripts/install-sequential-thinking.sh` | .sh | 206 | resolved-not-fn | `set -euo pipefail` + heredoc-style box-drawing comments + `local` variable expansion; standard bash, NO unusual constructs (e.g., `${str//\\/\\\\}` style nested parameter expansion). |
| `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh` | .sh | 95 | resolved-not-fn | Heavy use of nested parameter expansion `${str//\\/\\\\}`, `${str//\"/\\\"}` (4 sequential transformations on lines 33-36), function definitions with nested `[[ ]]` conditionals, `set -euo pipefail` only when invoked directly. |
| `phase-h-stress.test.ts` (021-stress-test) | .ts | 352 | OOB | 14,805 chars; ~15 imports each using **absolute path strings 100-180 chars long** (e.g., `from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/.../search-decision-envelope.ts'`); type imports interleaved with value imports; large describe/it block. |
| `refresh_metadata.py` (scratch/reorg-2026-04-25) | .py | 200 | OOB | Generated-style script; multiple regex literals, `subprocess.run` w/ list-of-strs, large dict literals for metadata mapping. |
| `spec-kit-compact-code-graph.js` (.opencode/plugins) | .js | 507 | OOB | Hook plugin with deeply nested object literals, regex character classes, `module.exports = { ... }` w/ 5+ nested handler closures. |

**Pattern hypothesis (Q3 partial):** The two `.sh` cohort failures both share **nested bash parameter expansion** (`${str//pattern/replacement}`-style) — well-formed bash but historically a stress point for the upstream `tree-sitter-bash@0.20.5` grammar. The `.ts` failures share **very long absolute-path string-literal imports**. The `.py`/`.js` failures share **size + nested object/dict literals**. These three sub-patterns are different enough that Hypothesis C ("one syntactic pattern in ≥80% of failing files") is **unlikely as a single feature** — but a "stresses upstream grammar somewhere" superset hypothesis is plausible. Iterations 4-6 should reduce one .sh + one .ts file to <50-line repros separately.

## Evidence

### Cohort table (full SQL output)

```text
=== TOTAL ROWS ===
121
=== ERROR_MESSAGE × EXTENSION CROSSTAB ===
.sh    resolved is not a function   70
.sh    memory access out of bounds  33
.ts    memory access out of bounds  10
.py    memory access out of bounds   6
.js    memory access out of bounds   2
```

Schema: `parse_diagnostics(file_path TEXT PRIMARY KEY, error_message TEXT, error_count INTEGER DEFAULT 1, last_seen_at TEXT)` — `mcp_server/code_graph/lib/code-graph-db.ts:157-174`.

Most-recent-30 rows: timestamps span `2026-05-06T13:18:46Z` to `13:19:32Z` (a single ~50-second scan window today). `error_count` ranges 6-9, indicating each file has crashed multiple times across recent rescans (consistent with re-attempting the same files on every broad-scope scan).

### Parser site code excerpt

`mcp_server/code_graph/lib/tree-sitter-parser.ts:697-756` — the try/catch around the WASM `parserInstance.parse(content)` call:

```ts
// 697  try {
// 698    const lang = grammarCache.get(language);
// 699    if (!lang) { return /* parseHealth: 'error', "Grammar not loaded" */ }
// 713    parserInstance.setLanguage(lang);
// 714    const tree = parserInstance.parse(content);   // ← throw site
// 715    const lines = content.split('\n');
// 717    const captures = walkAST(tree.rootNode as TSNode, language, lines);
// ...
// 741  } catch (err: unknown) {
// 745    return {
// 746      filePath: '', language, nodes: [], edges: [],
// 750      parseHealth: 'error',
// 753      parseErrors: [err instanceof Error ? err.message : String(err)],
// 754      parseDurationMs: Date.now() - startTime,
// 755    };
// 756  }
```

The error string we see in `parse_diagnostics` is `err.message` from web-tree-sitter's WASM glue — captured here, propagated up through `attachFilePath()` (`structural-indexer.ts:1245`), then written to SQLite by `recordParseDiagnosticsForResults()` (`scan.ts:162-170`).

### Upstream error origin (web-tree-sitter)

`mcp_server/node_modules/web-tree-sitter/tree-sitter.js:1158-1166`:

```js
// 1158                if (!(prop in stubs)) {
// 1159                  var resolved;
// 1160                  stubs[prop] = (...args) => {
// 1161                    resolved ||= resolveSymbol(prop);
// 1162                    return resolved(...args);   // ← `resolved is not a function`
// 1163                  };
// 1164                }
```

When `resolveSymbol(prop)` returns `undefined` (symbol not exported by the loaded grammar's WASM module), the cached `resolved` value is `undefined`, and the next call throws `TypeError: resolved is not a function`. This is a **WASM dynamic-linker resolution failure**, NOT a parse-state corruption — meaning the bash grammar's WASM module is missing one or more symbols that web-tree-sitter@0.24.7 expects.

### Version pin table

(See F-1.4 above — declared vs vendored.)

### Sample-file head excerpts

(See F-1.6 — full first-50/60 line snippets captured during sampling; not reproduced here for brevity. Available in raw bash output of iter 1.)

## Answered Questions

- **Q1 (Hypothesis A — version pin): PARTIALLY ANSWERED.** Native-binding-version-mismatch is empirically ruled out (F-1.1). The version-pin question pivots to: does pinning `web-tree-sitter` to ≥0.25.x (newer) or ≤0.23.x (older) than 0.24.7 change the cohort? Does pinning `tree-sitter-wasms` to ≤0.1.12 or ≥0.1.14 change it? Iteration 2 should run a controlled-version A/B/C bisect.
- **Q2 (Hypothesis B — WASM): ELEVATED.** Two-error-class signal (F-1.2) shows the WASM path is producing distinct upstream faults: bash-grammar dynamic-linker fault vs memory access OOB. Hypothesis B is the leading candidate, split into B1 (bash-specific) and B2 (cross-grammar OOB).
- **Q3 (Hypothesis C — content): WEAKENED but NOT REJECTED.** Sample of 5 (F-1.6) shows three distinct sub-patterns; "single shared syntactic feature in ≥80%" is unlikely. The weaker claim "each file class shares a class-internal stressor" remains plausible.
- **Q4 (cohort enumeration): ANSWERED.** 121 unique files, distribution captured in F-1.5. Note the strategy doc's "1,640 of 9,349" figure was *event count from broad-scope scan*, not unique-file count; persistence keyed on `file_path PRIMARY KEY` collapses repeats.
- **Q5 (minimum failing fixtures): NOT YET — qualitative survey done; reduction deferred to iter 4-5.**
- **Q6 (skip-list parameters): UNTOUCHED — pending iter 5-6.**
- **Q7 (remediation backlog): PARTIALLY — parser site located (F-1.3). Schema migration target: `code-graph-db.ts:209-216` (existing `parse_diagnostics` create-table block; new `parser_skip_list` table lands beside it). Status/scan response surfaces deferred to iter 7.**

## Next Focus

**Iteration 2 priorities (Hypothesis B discrimination — version bisect dispatch):**

1. **Reframe Hypothesis A as WASM-stack version bisect.** Use `WebFetch` to fetch the npm registry for `web-tree-sitter` (`https://registry.npmjs.org/web-tree-sitter`) and `tree-sitter-wasms` (`https://registry.npmjs.org/tree-sitter-wasms`) — capture latest stable, the version closest to 2026-04 build date, and any release notes mentioning bash-grammar fixes or WASM dynamic-linker fixes between 0.24.x and 0.25.x.
2. **Audit upstream `tree-sitter-bash` issues.** Search `https://github.com/tree-sitter/tree-sitter-bash/issues` for "resolved is not a function", "memory access out of bounds", "WASM" between 2025-12 and 2026-05. The line `web-tree-sitter/tree-sitter.js:1163` is a very specific known-issue surface.
3. **Spot-check the bash WASM symbol export table.** If feasible without re-building, dump `tree-sitter-bash.wasm` exported-symbol names (`xxd | grep` or `wabt`'s `wasm-objdump -x`) and look for the symbol web-tree-sitter@0.24.7 expects. This is THE discriminating evidence for B1.
4. **Discriminate B2 by quick-test.** Read 3 of the OOB-class .sh files and compare to 3 of the OOB-class .ts files — is there a size threshold (>10 KB) that triggers the OOB? If yes, B2 is "WASM linear memory exhaustion on large inputs"; if no, B2 is content-syntactic.
5. **Document tradeoffs for skip-list parameters (Q6 pre-work).** Given 121 stable failures across 9k+ candidates, a skip-list with eviction at N=2048 entries (~17× the current cohort) and self-heal threshold at 5 consecutive successes after a version bump is reasonable. Use evidence from iter 2 bisect to calibrate.

Recommended hypothesis ranking after iter 1: **B (WASM grammar) > C (content-stresses-grammar) > A (RULED OUT)**.
