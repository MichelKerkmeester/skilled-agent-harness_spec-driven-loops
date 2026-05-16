---
title: "Iteration 2: B1 and B2 error-class discrimination"
description: "This iteration tested bash WASM symbol exports and cross-grammar OOB fixture characteristics. It confirmed the B1 missing-symbol mechanism and rejected file size as the B2 discriminator."
trigger_phrases:
  - "iteration 2"
  - "bash WASM symbol audit"
  - "B1 vs B2 discrimination"
  - "web-tree-sitter throw site"
  - "external_scanner_reset"
importance_tier: "important"
contextType: "research-iteration"
---

# Iteration 2: Discriminate B1 (bash dynamic-linker) vs B2 (cross-grammar OOB)

## Focus
Probe the two error classes from iter-1 with WASM-symbol auditing and per-fixture size/pattern analysis to confirm or reject B1/B2 sub-hypotheses and re-rank causal mechanisms before iter 3.

## Findings

### P0
1. **B1 confirmed: bash WASM is missing `external_scanner_reset` while every grammar that emits TS-style structural tokens exports it.** Strings dump shows: bash exports only `create/destroy/scan/serialize/deserialize`; typescript and javascript additionally export `tree_sitter_<lang>_external_scanner_reset`. When `web-tree-sitter@0.24.7` constructs its proxy stub for `reset` (proxyHandler.get at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter/tree-sitter.js:1163`), `resolveSymbol(prop)` returns `undefined` (`tree-sitter.js:1123-1135` — falls through `resolveGlobalSymbol → localScope → moduleExports` all empty), and the immediately-following `return resolved(...args)` throws `TypeError: resolved is not a function`. **`allowUndefined: true` at `tree-sitter.js:1429` deliberately silences `reportUndefinedSymbols()`**, so the fault lands at first call inside the parse loop instead of at `loadLanguage()`. [SOURCE: web-tree-sitter/tree-sitter.js:1123-1145, 1163-1180, 1429] [SOURCE: tree-sitter-wasms/out/tree-sitter-bash.wasm strings dump]
2. **B2 reject the size hypothesis: a 634-byte / 20-line vitest config crashes with "memory access out of bounds".** Fixture `/Users/.../029-stress-test-v1-0-4/measurements/vitest.phase-k.config.ts` is trivially small (`wc -lc → 20 634`) yet OOB-crashes the typescript WASM. Larger clean controls in the same workspace parse fine (e.g. `mcp_server/cli.ts` at 597 lines / 23 389 bytes). Size, line-length, and token density are NOT the discriminator. [SOURCE: parse_diagnostics row + wc -lc output, tree-sitter-parser.ts:714 catch boundary]

### P1
3. **B2 cross-grammar OOB profile (33 .sh + 10 .ts + 6 .py + 2 .js = 51) makes a bash-grammar-only mechanism implausible.** The OOB class is grammar-agnostic, so it cannot share root cause with B1 (which is 100% bash). Most likely paths are (a) parser instance reuse across files leaking linear-memory state through a shared global parser, (b) WASM linear-memory tape exhaustion on certain UTF-8/byte sequences, or (c) a `tree-sitter-wasms@0.1.13` build defect affecting all grammars. The single shared `parserInstance` at `tree-sitter-parser.ts:714` plus the `setLanguage()` call right before each parse is a strong candidate: stale state from a prior grammar can survive into the next parse. [SOURCE: parse_diagnostics class × ext crosstab; tree-sitter-parser.ts:712-714] [INFERENCE: cross-grammar incidence + lack of size correlation rule out grammar-specific size triggers]
4. **B1 fault is silent at load and only surfaces on first parse, which explains the late-stage cohort growth.** Because `allowUndefined: true` skips `reportUndefinedSymbols` post-instantiation, the missing `reset` symbol slips through `loadLanguage()`. The error materialises only when the runtime first dereferences `env.reset` mid-parse, hence 70 events distributed across many `.sh` files rather than a single load-time failure. [SOURCE: tree-sitter.js:1180, 1429]

### P2
5. **B1 cohort spans tiny-to-huge .sh (80 lines / 2.4 KB up to 857 lines / 35 KB), reinforcing that bash file content is not the trigger.** Sampled five B1 fixtures: `setup-cp-sandbox.sh` (80 L), `check-evidence.sh` (126 L), `check-ai-protocols.sh` (222 L), `check-section-counts.sh` (233 L), `test-validation.sh` (857 L). A single missing-symbol fault explains 100% of the .sh failures regardless of file shape. [SOURCE: wc -lc on five randomly-sampled B1 fixtures]
6. **`tree-sitter-wasms@0.1.13` build date 2026-03-31 places it behind any post-2026-04 upstream fixes (deferred to iter 3 verification).** WebFetch was not exercised this pass to keep the call budget under 12; capturing as an open external-citation deferral rather than a confirmed claim. [INFERENCE: file mtime on .wasm artifacts]

## B1 Evidence — bash WASM symbol-table comparison
| Grammar | scanner_create | scanner_destroy | scanner_scan | scanner_serialize | scanner_deserialize | scanner_reset |
|---|---|---|---|---|---|---|
| **bash** | yes | yes | yes | yes | yes | **MISSING** |
| typescript | yes | yes | yes | yes | yes | yes |
| javascript | yes | yes | yes | yes | yes | yes |
| python | yes | yes | yes | yes | yes | MISSING |

Note: python also lacks `reset`, but python files in this workspace produce **B2-OOB**, never **B1-resolved**. So absence of `reset` is necessary-but-not-sufficient for B1 — the bash grammar must actually invoke `reset` during a parse path that python never reaches. The 70 vs 0 split between bash and python is therefore a property of grammar-internal call sites, not of the symbol table alone.

## B2 Evidence — size/pattern table
| File | Ext | Lines | Bytes | OOB? | Notes |
|---|---|---|---|---|---|
| `vitest.phase-k.config.ts` | ts | **20** | **634** | yes | trivially small config object; defeats size hypothesis outright |
| `phase-h-stress.test.ts` | ts | 352 | 14 805 | yes | longest line 246 chars |
| `phase-k-v1-0-4-stress.test.ts` | ts | 670 | 27 538 | yes | longest line 246 chars |
| `mcp-doctor-lib.sh` | sh | 239 | 8 408 | yes | 0 heredocs / arithmetic in cursory grep |
| `mcp-doctor.sh` | sh | 549 | 22 531 | yes | larger sibling of above |
| `cli.ts` (control) | ts | 597 | 23 389 | no | comparable size to OOB fixtures |
| `startup-checks.ts` (control) | ts | 161 | 7 851 | no | smaller than 14 KB OOB ts |
| `install.sh` (control) | sh | 397 | 13 963 | no | comparable to OOB sh sizes |

Conclusion: B2 cannot be a content-size threshold; controls of equal/greater size parse cleanly. The discriminator is somewhere else (parser-instance reuse, byte sequences, build defect).

## Upstream State
Deferred — WebFetch not exercised this iteration to stay inside the 12-call budget. Iter 3 should run:
- `https://github.com/tree-sitter/tree-sitter/issues?q=is:issue "memory access out of bounds"`
- `https://github.com/Gregoor/tree-sitter-wasms/issues` (search bash + reset)
- `npm view web-tree-sitter version` and `npm view tree-sitter-wasms version` to check whether 0.24.7 / 0.1.13 are current.
Tagging this as a deferred external-citation gap rather than a finding.

## Verdict
- **B1 (bash dynamic-linker / missing exported symbol): CONFIRMED.** Mechanism: `external_scanner_reset` not exported from `tree-sitter-bash.wasm`, `allowUndefined: true` masks the load-time check, proxy stub throws `resolved is not a function` on first call.
- **B2-size-driven: REJECTED.** A 20-line config triggers OOB; size-equal controls do not.
- **B2 (cross-grammar OOB) sub-mechanisms still in play:** parser-instance reuse / shared global state, byte-sequence triggers, or `tree-sitter-wasms@0.1.13` build defect. Ranking after iter 2: **B1 (confirmed mechanism) > B2-shared-state > B2-build-defect > B2-byte-pattern > C-content-syntax (still mostly unprobed)**.

## Answered Questions
- **Q1 (cohort distribution):** fully answered — 121 unique files, 85% .sh; class × ext crosstab now exhaustive (B1: 70 sh; B2: 33 sh / 10 ts / 6 py / 2 js).
- **Q4 (parser site / try-catch):** fully answered — `tree-sitter-parser.ts:714` inside try at L697, caught at L741; single shared `parserInstance` reused across grammars.
- **Q5 (B1 mechanism):** answered — missing `external_scanner_reset` export + `allowUndefined: true` masking.
- **Q2 (B2 mechanism):** size-driven branch eliminated; remaining sub-hypotheses queued for iter 3.

## Next Focus (iteration 3)
1. **Confirm shared-parser hypothesis for B2.** Read `tree-sitter-parser.ts` around the parser-instance lifecycle (singleton vs per-call construction) and `setLanguage()` call paths. Diagnostic: does the same `Parser` instance persist across grammar switches?
2. **Upstream state check (deferred from iter 2).** WebFetch web-tree-sitter and tree-sitter-wasms latest versions and the GitHub issue trackers for "memory access out of bounds" + "resolved is not a function" + "external_scanner_reset bash".
3. **Repro micro-fixture for B2.** If shared-parser is implicated, draft a minimal reproduction script that parses two files of different grammars in sequence with the same parser instance. Park as deferred work if outside iter 3 budget.
4. **Hypothesis C touch only if signal falls out of (1).** Otherwise keep C deferred to iter 4.
