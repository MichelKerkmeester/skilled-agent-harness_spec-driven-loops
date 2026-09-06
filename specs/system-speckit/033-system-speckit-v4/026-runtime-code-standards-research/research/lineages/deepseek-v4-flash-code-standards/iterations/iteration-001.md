# Iteration 1: Header / Section-Banner Conformance

## Focus
Angle 1 — verify module-header and numbered-section-banner conformance across `runtime/cli` and `runtime/lib` TypeScript source, and `shared/` TypeScript source. Checked the documented TS header contract (67-char box, `// MODULE: [name]`, imports immediately after) and the shell file-header contract (`# COMPONENT:` / `# SPECKIT:`).

## Findings

### F1.1 [P1] Shell file-header tag diverges from the documented template in 27 scripts
- **Code:** `runtime/cli/rules/*.sh` (e.g., `runtime/cli/rules/check-files.sh:3`, `runtime/cli/rules/check-links.sh:3`, `runtime/cli/rules/check-comment-hygiene.sh:3`)
- **Standard:** `sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md` §2 "File Header" — the header is `# COMPONENT: [COMPONENT NAME]` (or the `# SPECKIT: ...` alternative). No `RULE:` tag is documented.
- **What is present:** The `runtime/cli/rules/` family uses `# RULE: CHECK-FILES` instead of `# COMPONENT:`. Across scope, header tags are split: 33 `COMPONENT`, 27 `RULE`, 6 `SPECKIT`, 3 `SPEC-KIT`, 2 `TEST`, 1 `SCRIPT`, and 6 with no tag at all. Only 39/78 scripts use a documented template tag.
- **Severity:** P1 — systematic authoring-contract divergence with a maintenance cost (a reader cannot assume the standard header tag; header parsing/logging that keys on `COMPONENT:`/`SPECKIT:` will miss the `RULE:` family). Mechanical fix would be a mechanical rename; a small conformance decision is needed on whether `RULE:` is an accepted extension.
- **One-line fix:** **judgment-required** — either adopt `# COMPONENT:` uniformly (mechanical) or document `RULE:` as a sanctioned rule-family tag and extend the style guide.

### F1.2 [P2] `SPEC-KIT:` header tag variant (hyphen) vs documented `SPECKIT:`
- **Code:** `runtime/cli/spec/recommend-level.sh:3` (`# SPEC-KIT: RECOMMEND LEVEL`); `runtime/cli/spec/calculate-completeness.sh:3`
- **Standard:** same §2 — the documented alternative is `# SPECKIT:` (no hyphen).
- **What is present:** Since the standard's box-drawing header is a convention, the hyphen variant is a cosmetic spelling divergence. Low risk; reader-recognition only.
- **Severity:** P2.
- **One-line fix:** **mechanical** — normalize to `# SPECKIT:`.

### F1.3 [Conforming] TypeScript module-header coverage is clean
- **Code:** sampled `shared/frontmatter/parse-frontmatter.ts:1-3`, `runtime/lib/utils/index-scope.ts:1-3`, `runtime/lib/validation/orchestrator.ts` (all open with `// MODULE:`), and a full scan of `shared/`, `runtime/lib/`, `runtime/cli/` `.ts` files excluding dist/tests/fixtures.
- **Standard:** `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §2 "FILE HEADER FORMAT".
- **What is present:** Every source `.ts` file scanned carries the `// MODULE:` header; the only exception is `shared/js-yaml.d.ts`, which is an ambient type declaration shim (not a source module). Section dividers are numbered from the first divider present (`parse-frontmatter.ts` uses `1. TYPES`, `2. PARSING`, `3. SERIALIZATION`), and the first numbered divider scan found zero files starting at a number other than `1`.
- **Severity:** Reported as a baseline (no finding).

## Sources Consulted
- `runtime/cli/rules/check-files.sh:3`
- `runtime/cli/spec/recommend-level.sh:3`
- `shared/frontmatter/parse-frontmatter.ts`
- `runtime/lib/validation/orchestrator.ts`
- `sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md` §2
- `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §2

## Assessment
- **newInfoRatio:** 1.0
- **Novelty justification:** First pass over the whole banner/header surface; the `RULE:`-tag divergence and the `SPEC-KIT:` spelling variant are new to this packet and not previously inventoried.
- **Confidence:** High for the shell tag distribution (78 scripts counted directly) and for the TS banner scan (full `shared/`+`runtime/` `.ts` walk). Inferred for "no numbering gaps" because the scan derives from a divider-line heuristic, not a full parse.

## Reflection
- What worked: A distribution scan over all in-scope `.sh` files gave an exact header-tag census rather than anecdote.
- What failed: TS header and section-numbering scans found nothing to report — the surface is already conforming, so this angle is largely exhausted for TS.
- Ruled out: Treating `RULE:` as a P0 — it is an authoring-contract/style deviation, not a correctness or contract break.

## Recommended Next Focus
Angle 2 — determine whether `runtime/cli` and `runtime/lib` reimplement functionality that `@spec-kit/shared` already exports (frontmatter parsing, path containment, repo-root resolution).
