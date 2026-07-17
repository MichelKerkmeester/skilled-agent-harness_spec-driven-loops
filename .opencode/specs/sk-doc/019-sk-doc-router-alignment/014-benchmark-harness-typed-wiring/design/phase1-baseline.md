# Phase 1 — Regression Baseline (skill-benchmark vitest)

Captured on the isolated worktree `skilled/0063-router-collapse`, before any runtime change, so the build's "no new failures" gate is a **delta** against this floor, not an absolute.

## Invocation

The vitest config resolves its `include` globs relative to **cwd**, so the suite must be run from the scripts directory:

```
cd .opencode/skills/system-deep-loop/deep-improvement/scripts
npx vitest run skill-benchmark
```

## Baseline result (frozen)

```
Test Files  4 failed | 11 passed (15)
     Tests  19 failed | 145 passed (164)
```

## The 19 pre-existing failures (4 files) — all sk-code / sk-design, none in the sk-doc router path

| File | Failing tests | Area |
|------|---------------|------|
| `surface-slice-sync.vitest.ts` | 7 | sk-code rust language-slice trios |
| `design-dispatch-boundary-proof.vitest.ts` | 5 | sk-design boundary envelope lint |
| `design-token-lint.vitest.ts` | 4 | sk-design proof-token lint / route-gold guard |
| `playbook-mode.vitest.ts` | 3 | sk-code playbook parser (29 scenarios; 22+7 split; coverage) |

These are unrelated to this packet's scope (sk-doc router collapse). The build must not increase this count and should not touch these files.

## Gate definition

- **PASS:** after each phase, `npx vitest run skill-benchmark` shows **≤ 19 failed**, and every failing test is one of the 19 above (same set). No new failing test may appear.
- A test that flips from pass→fail that is NOT in this set is a **regression** and blocks the phase.

## Note for Phases 4–5

`sk-doc-leaf-routing-contract.vitest.ts` currently **passes** but asserts the refuted "advertised modes == the hub set" invariant (lines ~127–128) and passes only by insertion-order luck. The collapse changes the semantics of `workflowModes` (it becomes the surface-derived set). That test must be **rewritten** to assert the coherence invariant, not deleted — else it will mask a future regression.
