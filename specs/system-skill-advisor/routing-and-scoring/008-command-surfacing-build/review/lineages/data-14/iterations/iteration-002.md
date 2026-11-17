# Review Iteration 002

## Dispatcher

- Mode: review, lineage `data-14`, iteration 2 of 8.
- Declared target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Area: `data`; scope files are the advisor graph metadata and ADR-001 in the 040 decision record.
- Dimensions this iteration: security and maintainability.
- Operator review focus binding: `review-brief-14.txt` asks the data area to check that no remaining advisor intent signal pulls an ordinary prompt to the advisor, and that ADR-001's decline of P05, P08 and P09 stays consistent. Iteration 1 established the residual leak (F001); this iteration checks the security surface of both files and whether the decision record and its regression surface would let the finding recur unnoticed.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/graph-metadata.json:1-160` (re-read for the security pass: signals, edges, domains, derived block)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:1-38` (re-read whole, ADR-001 at line 37)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:49,58` (T006/T008 evidence cells, re-read for the record check)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt:1-25` (the cited leak-check transcript)
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:1-200` (the declared-phrase fixture contract)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report.md:18,29`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14/deep-review-findings-registry.json` (reduced state)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14/deep-review-strategy.md` (reduced state)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 from iteration 1 remains active: four ordinary prompts top the advisor through the remaining generic signals.

### P2 Findings

1. **ADR-001 records the pass-thirteen fix but not the residual leak it leaves open** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37` -- The decision record says the arena, clean, arm and briefs words pulled ordinary prompts and were removed, and that P07 is fixed with "vibe prompt hook" alone. It does not record that `which skill`, `route request`, `not offering a skill` and `workflow measure` still do the same on ordinary prompts (F001), and its verified citation `scratch/after-pass-13.txt:16-20` checks only the five prompts the removed phrases hit. `declared-phrase-specificity.vitest.ts` pins fixture phrases only, so no test would catch the residual or a later generic addition. A reader of the ADR would conclude the ordinary-prompt concern is closed.
   Finding class: matrix/evidence
   Scope proof: Read ADR-001's full row and the transcript it cites; scored the four ordinary prompts with the committed projection and dropped each matching signal to prove causation. The test file's cases name no real advisor signal, so the residual is unpinned.
   Case: an operator reads ADR-001 to decide whether extending the advisor's intent signals is safe.
   Recommendation: add one row or sentence to the decision record naming the remaining generic signals and the four reproducing prompts, and pin them as ordinary-sense fixtures so the next phrase addition cannot silently regress.

No P0 candidates. F002 is a documentation and test-surface gap, so it needed no Hunter/Skeptic/Referee pass.

## Traceability Checks

- `feature_catalog_code` -- not applicable (`applicable: false`). This area changes no feature catalog row; `graph-metadata.json` is skill metadata and ADR-001 is a packet decision record.
- `playbook_capability` -- not applicable (`applicable: false`). No manual-testing playbook source is in this area; the pass-thirteen playbook row belongs to the prior data area pass and is unchanged here.

## Integration Evidence

- Security: neither scope file contains a credential, token, host, environment variable or executable path. `graph-metadata.json`'s 33 signals are unique, ASCII-only plain text; none contains a backtick, `$`, backslash, brace, bracket, pipe, semicolon or angle bracket, so the list cannot break the JSON or build a regex. The only structured reference in ADR-001 is a command name and two scratch file paths.
- Holdout: neither scope file names `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`. `scratch/after-pass-13.txt` records five ordinary leak-check prompts, not holdout rows, and the ADR cites it as evidence rather than reading a corpus.
- Regression surface: `declared-phrase-specificity.vitest.ts` builds its own fixture projection (`GENERIC_SURFACE`, `AUTOMATION_HUB`, `DESIGN_HUB`, `NOTES_HUB`) and never asserts against the real advisor signal list; the only real-signal leak check is the scratch transcript.

## Edge Cases

- F001's signals pre-date pass thirteen. F002 is therefore a record of a residual limit, not a request to revert the pass-thirteen change; the ADR's six-phrase decision stays correct.
- `vibe prompt hook` is advisor-specific and passes the ordinary-prompt check, so the one kept phrase does not need a record entry.
- T006's evidence cell still describes the seven-phrase build. It is historical and superseded by T008 and ADR-001, so it is recorded here rather than raised separately.

## Confirmed-Clean Surfaces

- Security: static metadata and markdown only; no trust boundary, no secret, no injection surface, no holdout access.
- Maintainability: ADR-001 and AC-004 agree on the three declined probes and the P07 fix; the carried-by list names files that exist.
- The test file is internally consistent for the fixture surface it defines; the gap is that it never reads the real signal list.

## Ruled Out

- A secret or environment exposure in either scope file: both are plain author text and markdown, with no value that looks like a credential or host.
- A holdout leak through the ADR's citation: the cited transcript holds five ordinary prompts and no corpus row.
- An AC-004/ADR contradiction: both say P05, P08 and P09 are declined and P07 is fixed.

## Next Focus

- Dimension: all four re-verified (convergence pass).
- Focus area: re-run the F001 cases and the pass-thirteen transcript from the final tree, confirm the registry and strategy agree with the iteration records, and take the stop decision.
- Reason: correctness, traceability, security and maintainability all have evidence; the only open question is whether the run may stop with one active P1 and one active P2.
- Rotation status: security and maintainability complete; no new dimension remains.
- Blocked/productive carry-forward: F001 is the only active P1 and stays open; F002 is a recorded P2.
- Required evidence: a reproduction run and a convergence decision naming any blocker.

Review verdict: CONDITIONAL
