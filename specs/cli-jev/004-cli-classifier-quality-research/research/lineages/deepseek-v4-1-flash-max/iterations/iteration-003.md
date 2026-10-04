# Iteration 003 — sk-code-opencode compliance and bugs in the scripts and tests

- **Focus:** Axes 2 + 6. Syntax-check every hub script; validate headers/constants/comments against the sk-code-opencode JavaScript style guide and checklist; run all four test suites containment-safe; read `scorer-report.mjs` and the benchmark scorers' entry points for latent bugs.
- **Read first:** no `steer.md` exists in this lineage (checked at iteration start, absent).
- **Method:** `node --check` on all 9 scripts; checklist + style-guide comparison; `node --test` on all four suites with `TMPDIR` redirected inside the lineage and a `git status` containment check; targeted reads of entry points and error paths.

## Findings

### F-005 — Pi-transport test README claims 41 cases; the suite holds 46 (axis 5, P2)

`benchmark/pi-transport/tests/README.md:26` says `score-pi-transport.test.mjs` holds "41 cases". The file declares 46 `test(...)` cases (`grep -c "^test("` = 46) and `node --test` runs 46. The count is stale.

- **Confirmed by:** counting test declarations in the file and reading the runner's own tally (`tests 46 / pass 46`).
- **Impact:** a reader sizing the suite (or checking it against a claim) sees the wrong number. One-line fix.

## Verified clean (evidence recorded)

### Tests all pass — 153 cases, 0 failures

| Suite | Result |
|---|---|
| `shared/scripts/tests/jev-transport.test.mjs` | 42 pass / 0 fail |
| `shared/scripts/tests/scorer-report.test.mjs` | 8 pass / 0 fail |
| `benchmark/injection-screen/tests/score-injection-screen.test.mjs` | 57 pass / 0 fail |
| `benchmark/pi-transport/tests/score-pi-transport.test.mjs` | 46 pass / 0 fail |

Run with `TMPDIR` pointed inside this lineage; a `git status --porcelain` before/after diff showed no repo writes. Both suites' hermetic claims hold (stub CLI + stub classifier runtime; no socket; no key read).

### Syntax and header compliance

- All 9 scripts pass `node --check` (exit 0): the two shared modules, their two test suites, the two benchmark scorers, `replay-helpers.mjs` and both benchmark test suites.
- Headers: all five hub scripts carry the style guide's canonical header — `// ───` divider (measured 67 box-drawing characters, the required width) + `// MODULE: [Module Name]` + divider (`sk-code-opencode/references/javascript/style-guide.md:36-63`). The three `.cjs` callers use the older `╔═╗` box; the same style guide accepts the older box "where it already exists" (`:62-63`), so the callers are grandfathered, not in violation.
- No commented-out code found in the shared modules or benchmark scorers; module constants are UPPER_SNAKE_CASE (`PI_CLASSIFIERS`, `BOOTSTRAP_REPLICATES`, `DEFAULT_TIMEOUT_MS`); public functions carry JSDoc; functions use guard clauses and early returns; no `console.*` calls anywhere in the hub scripts (output goes through explicit report sinks), so the bracketed-logging rule has no surface to apply to.
- Numbered ALL-CAPS section dividers are present and consistent (`// 1. IMPORTS` … `// 8. REPORT LINES`).

### Latent-bug reads

- `scorer-report.mjs` read end to end: digest pinning, probability-aware pick, decided subset, margin slack and the seeded cluster bootstrap all behave as documented; the deterministic generator is seeded from a SHA-256 of the caller's seed text (`:202-207`); ties keep the first key (`:121-128`). One robustness observation, not a finding: `pinRowSet` spreads `extras` over the computed fields, so a caller passing a reserved key (`rowSetSha256`, `rowCount`, `rows`) would shadow the computed value; no current caller passes one.
- `jev-transport.mjs` auto-route, budget-sharing and fallback paths re-read at the decision points; no divergence from the documented behavior beyond the already-recorded F-001/F-002 doc issues.
- Both benchmark scorers export `main(argv, deps)` and guard their entry with a realpath comparison (`score-injection-screen.mjs:1769-1770`, `score-pi-transport.mjs:1550-1551`), so tests drive the real entry point; argument guards print actionable errors (`--jev needs --out <dir> …`, `--out is only legal with --pi or --cli`).

## Ruled-out directions

- Reporting the `.cjs` callers' `╔═╗` box headers as violations — explicitly grandfathered by the JS style guide.
- Reporting the missing `'use strict'` in `.mjs` files — module semantics; the alignment verifier skips `.mjs` enforcement by design.

## Key-question progress

- Q2 (axes 2+6): addressed this iteration; no functional bugs in the shared scripts, one stale doc count (F-005).
- Q1/Q5: ongoing. Q3, Q4: next.

## Next focus

Iteration 4 — system-skill-advisor integration and UX (axes 3+4): routing vocabulary equality across `mode-registry.json` / `hub-router.json` / `ROUTER.md` / `graph-metadata.json` / `description.json`; how a prompt reaches the hub (advisor graph + compiled route); external-repository UX without Jev; benchmark-operator UX.
