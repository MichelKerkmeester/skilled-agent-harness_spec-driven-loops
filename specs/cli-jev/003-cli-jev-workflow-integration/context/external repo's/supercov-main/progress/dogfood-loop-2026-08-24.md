# Supercov-on-Supercov dogfood loop — 2026-08-24

Agentic coverage campaign following the v0.0.9 handoff: query MC/DC gaps, add one
focused test, rerun, prove the exact improvement with `diff`. Five verified
iterations, no source changes, no publish.

## Results

Baseline run `2026-08-24T11-14-16-565Z` → final run `2026-08-24T11-30-59-347Z`:

| metric | baseline | final |
| --- | --- | --- |
| lines | 55.78% (2763/4953) | 56.13% (2780/4953) |
| branches | 36.38% (1343/3692) | 37.00% (1366/3692) |
| MC/DC | 20.90% (303/1450) | 24.55% (356/1450) |
| assertion-linked MC/DC conditions | 78 | 96 |

Every iteration was verified with `supercov diff <prev> <next>`; each diff showed
exactly the predicted conditions gained and nothing lost.

1. `instrumenter.test.ts` — nullish coalescing stays an atomic MC/DC condition
   (lone, compound, negated, negated-compound forms). +2 conditions at
   `instrumenter.ts:71`.
2. `instrumenter.test.ts` — table-driven classification of every
   source-coercion ancestor context in `isSourceSensitiveFunction` (coerced →
   semantic-safety limitation + untouched body; consumed → instrumented).
   +18 then +10 conditions across `instrumenter.ts:255–302`.
3. `transport.test.ts` — rejects each malformed coverage scope/carrier field
   independently (`decodeCoverageScope`/`decodeCoverageCarrier`). +15
   conditions; transport validation MC/DC is now essentially closed.
4. `workspace.test.ts` — reuse-path sandbox guard rejects `../outside`, the
   workspace root, and missing/symlink entries; `removeIsolatedWorkspace`
   refuses escaping run IDs; `copyFile` reuse hook proven. +8 conditions.

`npm run check` (150 native tests + tsc) green after each change.

## CLI friction observed while acting as the agent

1. **Silent fallback on malformed query commands.** `supercov runs latest file
   src/x.ts --metric mcdc` (missing the `coverage` word) silently prints the
   runs listing instead of erroring with usage. First query of the session was
   wasted; an agent may not notice it queried nothing.
2. **Structurally unsatisfiable MC/DC conditions sit in the denominator with no
   marking.** Examples found: `instrumenter.ts:265` C5/C6 — when the parent is a
   `LogicalExpression`, the child is by construction `left` or `right`, so the
   false-false vector cannot exist; `instrumenter.ts:255` C1
   (`isParenthesizedExpression`) is unreachable because the parser is not run
   with `createParenthesizedExpressions`; `transport.ts:12` / `workspace.ts:495`
   (`typeof process === "undefined"`, `platform === "win32"`) are unreachable in
   Node-on-macOS test processes. An agent cannot distinguish "needs a test" from
   "impossible" without reading the code; the loop wastes effort. Candidate
   product work: detect and label conditions with no satisfiable independence
   pair, and/or a reviewed waiver mechanism that keeps the denominator honest.
3. **Flat condition lists in `coverage file --metric mcdc`.** 139 obligations
   arrive as a flat 20-per-page list; had to fall back to `--json` plus a script
   to group by decision/line and find clusters. A per-decision grouping with
   missing-condition counts would make gap selection one query.
4. **Positives.** `diff` against `latest` with exact gained/lost obligations is
   the backbone of the loop and worked perfectly; stale-run warnings were honest
   and never wrong; ~21 s per self-run keeps the loop tight; `decision`
   `<file:line>` addressing is exactly what an agent wants.

## Remaining high-value gaps (next loop)

- `src/query.ts` — 197 missing MC/DC conditions, the largest pool, and it is the
  agent-facing query engine.
- `src/runtime.ts` — 101 missing, but most need process-level fixtures: the
  injected runtime patches `fetch`/`child_process`/worker bootstrap, which unit
  tests cannot safely exercise in-process. Consider a small fixture harness that
  launches a scratch Node process with the runtime preloaded.
- `src/cli.ts` (87) and `src/launchSupervisor.ts` (87) — CLI parsing gaps pair
  naturally with fixing friction item 1.
- `src/playwright.ts` (109) — needs Playwright fixture work, not unit tests.

## Still open from the handoff

- Seven untracked docs drafts (`docs/*.md`) remain unreconciled; `docs/evidence.md`
  still contradicts the lazy query index.
- Cross-repo zero-config validation matrix (Playwright/Vitest/Jest/node:test +
  one honest-degradation runner) not started.
- Verification-profile output (multi-line confidence summary instead of one
  percentage) not started; friction item 2 above feeds its design.
