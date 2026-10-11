# Iteration 004 — Maintainability

Dispatcher: deep-review iteration 4 of 5, focus maintainability. Resolved route: mode=review target_agent=deep-review. Session `fanout-dsflash-llmgw-1791717087028-ifv8d2`, generation 1, lineageMode new, stopPolicy max-iterations.

## Dimension

Maintainability: comment hygiene across the range diff, prevent-overengineering tests per change, test quality (each new test fails without its fix), diagnostics and documentation quality of the changed surfaces, and the remaining regression gates named by the phase spec.

## Files Reviewed

- All added comment lines in the range diff over `*.cjs`, `*.mjs`, `*.js`, `*.ts`, `*.py` (46 lines, enumerated by diff scan).
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:588-598` — `createCorruptionError` diagnostics after the missing-config change.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:116-143` — the new test's assertions.
- `.skilled/hooks/vitest.config.ts:17-27` — the skip heuristic and its comment.
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:319-332` — the shared `shellPayload` helper (three call sites).
- `.skilled/bin/README.md` (the `--check` line) and `.skilled/bin/compiled-route-sync.cjs` usage text.
- `.skilled/skills/system-spec-kit/runtime/hooks/README.md:176-178` — the residual-risk paragraph.
- `.skilled/repo-rules/prevent-overengineering.md` §1 — the reversal-cost order applied below.

Commands run:

- `node .skilled/bin/compiled-route-guard.cjs` → `All hubs fresh or excused`, exit 0.
- Added-comment scan:
  `git diff 77f14f88d0^..d04df31790 -- '*.cjs' '*.mjs' '*.js' '*.ts' '*.py'` filtered to added comment lines → 46 lines, zero carrying spec paths, phase numbers, ADR-/REQ-/CHK-/task ids, dates or finding ids.
- Added-TODO scan over code and non-spec docs → zero `TODO|FIXME|XXX|HACK` additions.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The strict missing-config failure is headlined as state-log corruption, so the operator hint misdiagnoses the new condition** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:592` -- after this range, `createCorruptionError` is also reached when the only warning is the missing `deep-review-config.json` (the new `configWarnings.concat(logWarnings)` path at line 2225). The message still reads `[deep-review] parseJsonl detected ${n} corrupt line(s) in <stateLogPath>` and the trailing hint says `Pass --lenient ... to ignore corruption`, while the preview line correctly names `deep-review-config.json: config file is missing; reduced on default settings`. A strict-mode operator whose review folder has no config is told the state log holds corrupt lines, which is a different file and a different repair. The new test asserts only that the message contains the file name (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:138-139`), so the headline mislabel is unpinned.
   Finding class: diagnostics wording (advisory)
   Scope proof: line 592 is the headline this range's change now reaches with a config-only warning; the throwing path is `reduce-state.cjs:2215-2225`; the hint string at line 594.
   Affected surface hints: reducer CLI stderr for strict runs; operator runbooks that quote the STATE_CORRUPTION message.
   Case: reducing a review folder that has `deep-review-state.jsonl` and no `deep-review-config.json` without `--lenient` throws STATE_CORRUPTION with the headline "parseJsonl detected 1 corrupt line(s) in <state log>" and the hint "to ignore corruption", although the state log parsed clean and the cause is the absent config (probe run on `specs/hooks/002-injection-bloat-reduction/review/lineages/luna-max`).

## Traceability Checks

- `spec_code` (core) — pass, carried from iteration 3.
- `checklist_evidence` (core) — pass, carried from iteration 3.
- Overlay protocols — pass/notApplicable as recorded in iteration 3; no new overlay-relevant claim arose.

## Edge Cases

- Comment hygiene was tested against the hard-block directive's token classes (spec paths, ADR-/REQ-/CHK-/task ids) and against dates and phase numbers; zero hits across 46 added comment lines. One comment says "under specs" as a directory name in the phase probe script — it names no folder, so it is compliant.
- Comment-scan limitation: the scan covers added comment-shaped lines in code files; comments inside JSON or fixture data are not applicable, and removed lines were not re-checked (they are gone from the tree).
- `nodeTestFiles()` is the one new function whose cost is per-config-load filesystem scanning (~18 small reads); the alternative (a static exclusion list of 16 paths) would go stale on the next node:test suite, so the scan is the smallest correct move.
- The `shellPayload` helper is shared by three call sites (`inspectDispatch` and the two `resolveSegment` unwraps), meeting the "three before abstracting" bar; it exists for correctness (one unescape semantic), not tidiness.

## Confirmed-Clean Surfaces

- Prevent-overengineering: every range change is the cheapest viable move. The reducer adds an existence branch in place; `--check` extends its own loop; `shellPayload` extracts shared semantics at the third call site; the deadline tests reuse a row table instead of duplicating suites; the scaffold adds two keyword list entries; no new dependency, config option, feature flag or abstraction layer is introduced.
- Test quality: each new test fails without its fix. The reducer test reaches the old ENOENT path when the config is missing; the sync test's `assert.throws` has no counterpart in the old check (the commit records "Missing expected exception"); the dispatch cases fail against the old first-escaped-quote regex; the plugin surface table fails with no `surfaceHint` in the request; the scaffold aliases are exactly what the journey proof reads.
- Diagnostics: the corruption preview prints a file-level entry for the config warning, and the new test pins file naming; the README and usage text changes (`compiled-route-sync.cjs`, `.skilled/bin/README.md:214`) describe `--check`'s new failure behavior consistently.
- Regression gates: `compiled-route-guard.cjs` reports all hubs fresh or excused; `compiled-route-sync.cjs --check` 55/55; `check-contract-drift.cjs` OK; canaries 0 failures — all four named by the phase spec now confirmed read-only.

## Ruled Out

- "The vitest skip heuristic silently skips a vitest suite": enumerated 18 suites under `.skilled/hooks`; the 16 skipped files are node:test suites, the 2 kept files import vitest; no current file is misclassified.
- "The advisor cache is unbounded growth": bounded by distinct workspace roots per plugin process; not actionable.
- "The range adds TODOs or deferral markers": zero added TODO/FIXME/XXX/HACK lines.

## Integration Evidence

- `.skilled/bin/compiled-route-guard.cjs` — exit 0, `All hubs fresh or excused`.
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` on the rewritten hub SKILL.md — 0 hard blockers (iteration 3), supporting the phase 001 voice claim.
- `.skilled/repo-rules/prevent-overengineering.md` §1 is the rule text applied per change above.

## Next Focus

- Dimension: closure / adversarial replay (not a fifth first-pass dimension)
- Focus area: re-read every active P0/P1/P2 at its cited line, confirm no finding is a phantom, verify the run's gates hold from the final state (five iterations, route proof, delta completeness, config status), and record the max-iterations stop for synthesis.
- Reason: stopPolicy is max-iterations; the fifth pass broadens to closure rather than re-entering a swept direction.
- Rotation status: D1, D2, D3, D4 reviewed; closure pass next.
- Required evidence: direct rereads of each cited `file:line`; verification of the state log, deltas and iteration count before synthesis.

Review verdict: PASS
