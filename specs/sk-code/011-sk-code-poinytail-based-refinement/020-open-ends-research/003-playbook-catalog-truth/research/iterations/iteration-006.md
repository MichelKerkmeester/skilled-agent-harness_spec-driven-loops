# Iteration 006 — Widening: proposed checks replayed over the full corpus; one live wrong-line drift found; attribution measured as the option check's cost center

- Run: `2026-10-11T16:24:27.869Z` | Iteration 6 of 10 | Mode: research | Route: @deep-research (native)
- Focus reconciliation: all five strategy key questions remain answered; no box is re-ticked. This iteration executes the dispatch's widening mandate — verify earlier claims, sample further skills' playbooks and catalogs, and replay the proposed checks against real cases. It closes no key question; it adds corpus-scale evidence and one live drift instance.

## Focus

1. Verify earlier iterations' load-bearing claims at their exact current lines (the validator gate, the anchor sample).
2. Sample beyond `system-spec-kit`: all 14 skills' `manual-testing-playbook` trees and all 6 anchor-bearing `feature-catalog` files.
3. Replay both proposed checks — scenario options and catalog anchors — against the live corpus to find real drift and false-positive classes.

## Actions Taken

1. Corpus-wide catalog anchor scan: every `path:line` / `path:line-range` reference in `feature-catalog/**/*.md`, resolved against three base candidates (as-is, skill-relative, skill+runtime) and bounds-checked against the target file's length.
2. Scenario-option check prototyped in three attribution variants over all playbook trees: nearest-mention window (±400 chars), strict same-line, and naive fenced-block scoping.
3. Direct reads to pin the catalog validator's current gate — prefix list, line-range suffix strip, existence-only classification — at exact line numbers.
4. Live adjudication of the two unresolved anchors and of one live-file citation: `spec-folder-mutex.ts` lines 1–25 read against the catalog claim at `code-standards-alignment.md:76`.

## Findings

### F1 — Live drift found, first observed instance of the in-range content-drift class: wrong line behind a resolvable path

`code-standards-alignment.md:76` claims `runtime/handlers/save/spec-folder-mutex.ts:10` "defines `const SPEC_FOLDER_LOCKS = ...`". The file resolves and line 10 is in bounds, but line 10 is `import { createHash, randomUUID } from 'node:crypto';` [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/save/spec-folder-mutex.ts:10]; the definition sits at line 22 [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/save/spec-folder-mutex.ts:22]. Every check the proposal's lightest tier runs — path existence and, if added, line-range bounds — passes this cell silently. Only a token-at-line check (the cited line must contain the claimed token, here `SPEC_FOLDER_LOCKS`) fails it. This upgrades iteration 3's "in-range content drift behind a resolvable anchor" from a theoretical class to an observed one, and it is also outside the proposed extension's reach twice over: the cell is a bare-relative citation (skipped by the four-prefix gate below) and it sits in a prose bullet, not a File-column table row, so an extension inside `check_source_file_paths` would never scan it.

### F2 — The proposed anchor check replayed over the corpus: 36 anchors, 34 resolve in bounds, 0 out-of-bounds, 2 annotated historical deletions

Six catalog files carry 36 `path:line` anchors (the same 6 files iteration 5 identified; the count of anchors is now complete: `canonical-first-spec-root-resolution.md` 19, `code-standards-alignment.md` 3, `advisor-rebuild.md` 6, `advisor-status.md` 1, `advisor-recommend.md` 6, `skill-advisor-cli.md` 1). Of these, 34 resolve and are within bounds; 0 are out-of-bounds; the 2 unresolved are `runtime/handlers/memory-save.ts:6-21` [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:66] and `runtime/lib/search/graph-search-fn.ts:6-10` [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:69] — both annotated "(removed with the memory server)" and part of a deliberate historical-evidence list [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:48], [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:52]. Verdict for the proposal: retaining the parsed range and bounds-checking it at the strip site is corpus-safe today (0 fires), while any existence check that started resolving bare-relative paths would fire twice on deliberately deleted-file history unless it honors the "(removed…)" annotation. The corpus therefore needs a deleted-content convention before the check's scope is widened past repo-relative prefixes.

### F3 — The current gate, pinned by direct read (iteration 4 claim verified)

`REPO_RELATIVE_PREFIXES = ('.skilled/', '.opencode/', '.claude/', '.codex/')` [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:547]; `LINE_RANGE_SUFFIX_RE` [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:552]; `_extract_checkable_path` accepts only those prefixes or doc-relative markdown links [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:561]; the only consumer is `check_source_file_paths`, whose strip site discards the suffix [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593] and then classifies existence only [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:595]. Iteration 4's placement and the "existence-only, suffix discarded" characterization are confirmed at the exact lines they named.

### F4 — The option check's cost center is attribution, measured across all 57 playbook trees

Three extraction variants over the same corpus bracket the problem. Nearest-mention attribution (±400-char window) yields 1,085 script/flag pairs, of which 273 are "flag absent from attributed script" across 55 distinct flags and 92 files. The sampled head of those 273 is entirely provenance artifacts, not drift: `--prompt` bound to `.skilled/bin/skill-advisor.cjs` where it belongs to the CLI tool invoked in the same block [SOURCE: .skilled/skills/cli-orca/manual-testing-playbook/routing/orca-positive-route.md:40]; `--config`/`--project` bound to `lookup-trigger-index.mjs` in a command block whose other tool owns them [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/nested-changelog-generator.md:48]; `--force` counted against a script in a scenario whose whole point is refusal. The strict same-line variant collapses to 1 pair, itself prose text ("with `--read-only`") [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md:57], and a naive fenced-block scoping extracts 0 pairs before finding any real one. Consequence for the proposal: a light extractor either over-attributes (false positives dominate) or barely extracts (recall collapses), so command-grammar-aware line parsing — not the flag-vs-script comparison — is the load-bearing cost. A flag like the historical `--phase-count` is caught only when attribution is right, so attribution precision sets the check's true-positive ceiling.

## Questions Answered

- No new strategy key question. All five remain answered with earlier evidence. This iteration discharges the widening mandate with corpus-scale replay: earlier claims verified (F3, F2 sample), further skills sampled (F2, F4), and both proposed checks tested against real cases (F1–F4). Residue for synthesis is unchanged and now fixture-rich.

## Questions Remaining

- None open. The synthesis residue now has a second live fixture: the wrong-line citation at `code-standards-alignment.md:76` (F1) joins the literal-naming Expected/Evidence truncation case, alongside the `--phase-count` replay, for the implementation-ready spec to use.

## Next Focus

- Synthesis (iterations 7+): assemble the implementation-ready spec — check codes, insertion points, reused resolver, and fixtures now including the live wrong-line citation. State explicitly, as coverage boundaries rather than absorbed scope: the four-prefix gate leaves bare-relative and prose citations unscanned (F1, F2), the catalog validator's CI wiring remains a separate decision, and the option check's attribution grammar is its cost center (F4).

## SCOPE VIOLATIONS

None — all researched files were read-only; writes were confined to this iteration's narrative, its delta file, and the gateway event temp file.
