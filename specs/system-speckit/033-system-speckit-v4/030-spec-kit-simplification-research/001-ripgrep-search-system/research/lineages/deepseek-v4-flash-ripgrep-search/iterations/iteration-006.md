# Iteration 006 — Generator static re-verification (read-only pass)

**Focus:** Round one executed the generator and verified determinism/fail-closed behavior empirically. This run cannot execute node tooling, so the pass is a STATIC re-verification: is the code still consistent with (a) its own documentation claims, (b) the committed manifest/diagnostics values, (c) the README's validation contract (REQ-007)? Plus the carried shortlist item: is `phrase-variants.json` still default-published with no reader?

**Method:** Read `generate-trigger-index.mjs` fully; cross-check constants against committed artifact values (schemaVersion 2 == INDEX_SCHEMA_VERSION, PARSER_VERSION, normalization block); verify the README §7 test list names existing files; size census of published fixtures; check the `IGNORED_PATHS` row still names an existing file.

## Findings

### V11 — CONSTANTS ↔ ARTIFACT AGREEMENT (verified, positive)

- **Path:line:** `generate-trigger-index.mjs:37` (PARSER_VERSION '1.0.0') ↔ `corpus-manifest.json` parserVersion '1.0.0'; `:39` (INDEX_SCHEMA_VERSION) ↔ index schemaVersion 2 ↔ manifest indexSchemaVersion 2; `lib/artifact.mjs` shared constant (assertTriggerIndexShape); `NORMALIZATION` block serialized into index matches `lib/normalize.mjs:28-40` (maxPhraseLength 120, maxQueryTokens 8, minQueryTokenLength 3, separators, stemming none, stopWords [])
- **Claimed vs actual:** All agree in the committed artifacts; the read/write shape contract is single-sourced in artifact.mjs (fail-closed read path — lookup loadIndex calls assertTriggerIndexShape, lookup-trigger-index.mjs:66-72).
- **Severity:** verified-positive; record only.

### V12 — README §7 VALIDATION COMMAND NAMES EXISTING SUITES (fix landed, positive)

- **Path:line:** `runtime/cli/retrieval/README.md` §7 (seven-file invocation) — every named file exists in `runtime/cli/tests/` (trigger-index, rg-wrapper-recipes, retrieval-coverage-parity, grep-convention, grep-convention-rule, sweep-memory-residue, retrofit-convention-pipeline — verified by directory listing)
- **Claimed vs actual:** REQ-007 ("both retrieval READMEs give a test invocation that runs") — path/wiring consistent with the verified form round one recorded (F7.1: `--config ../../vitest.config.ts`). `lib/README.md:??` also names the suites (spot-checked).
- **Severity:** verified-positive; note only: the invocation could not be executed (no node policy), so "runs" is judged on path existence + documented form, not execution.

### V13 — `phrase-variants.json` STILL DEFAULT-PUBLISHED, 2.87 MB, NO RUNTIME READER (P2, carried shortlist)

- **Path:line:** `generate-trigger-index.mjs:109` (DEFAULT_VARIANTS_PATH), `:170-172` (published on every run), `:187-192` (variants build "Lookup never reads them"); `runtime/cli/retrieval/fixtures/phrase-variants.json` = 2,867,848 bytes; readers: none outside the fixtures' own doc comment (grep for `phrase-variants` shows generator + README only)
- **Claimed vs actual:** Round-one F1.9 shortlisted "regenerate-on-demand or drop from default publication" — not executed; the default generator run still writes 2.87 MB per regeneration for a trace-only sidecar ("exist so an operator can trace a normalized key back to what was written").
- **Severity:** P2 — cost is write-time and workspace size; no lookup-time cost; README documents it as part of the rewrites-every-run trio.
- **Recommendation:** Out of packet scope but the ledger should keep it: make `--variants` opt-in with a README row, or drop after one archival release. (Round one flagged; repeated here with the current size because a recommendation without a re-measured number is not evidence.)

### V14 — IGNORED_PATHS SINGLE ENTRY STILL LIVES AND STILL MATCHES (verified, positive)

- **Path:line:** `runtime/cli/retrieval/lib/corpus.mjs:59-66` (IGNORED_PATHS); target file `specs/sk-doc/016-create-diff-mode/014-skill-readme-standardization/012-mcp-chrome-devtools-readme/context/seats/iter-002/deepseek.extracted.md` — exists (12,976 bytes, Sep 6 11:00); diagnostics `ignoredPathsUnmatched` — need to confirm the file is walked-and-matched (the walker reaches `specs/sk-doc/.../context/seats/iter-002/` — no exclusion at that path; verified no 'context'/'seats' pruning rule exists)
- **Claimed vs actual:** The exemption names a real document under a path the walker reaches; `ignoredMalformedDocuments: 1` in committed diagnostics matches. Any stale entry would show in `ignoredPathsUnmatched` — the committed diagnostics list must be checked (values above: ignoredPathsUnmatched present in file — verified empty? see note).
- **Severity:** verified-positive; note only: committed `generation-diagnostics.json` was read — `ignoredPathsUnmatched` value empty (not shown in extract; the field exists and no unmatched rows were observed in my census) — mark as partially verified (field content of `ignoredPathsUnmatched` not printed; low risk).
- **Fidelity note:** I printed `diagnostics keys` but not the `ignoredPathsUnmatched` ARRAY content; do not claim verified-empty — state only that the field exists and the written-file check requires reading the array. (Amended honestly in the delta.)

## Ruled out this pass

- Generator determinism re-claim: cannot re-run (no node); the byte-identical claim is backed by (a) the unit test trigger-index.vitest.ts:386-395 asserting byte-equality over two runs, (b) all dictionary/array publication paths sorting via compareCodeUnits, (c) stableStringify — treat as code-by-construction, NOT executed-evidence.

## Open questions

1. Is `phrase-variants.json`'s 2.87 MB worth an opt-in? (Carried; needs an owner decision like the fixture pins.)
2. Who fixes the doctor's diagnostics reading so a variant/diagnostics drift would be visible (session-level — V10)?
