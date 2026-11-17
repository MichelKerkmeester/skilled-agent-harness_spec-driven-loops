# Review Iteration 002 - traceability and maintainability

Lineage: `vibe-hooks-doctor-confirm-5b`. Iteration 2 of 3. Mode: review.
Executor: this session, `cli-opencode` model `opencode-go/deepseek-v4.1-flash`.

## Dispatcher

- Second iteration of the confirming round for the `vibe-hooks-doctor` area. State read first:
  `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`,
  `deep-review-findings-registry.json`, and `review/review-scope-5b.txt` for the area mapping.
- `steer.md` does not exist in this lineage directory at this iteration.
- The operator focus's doctor item ("the doctor hooks-file reading") and its docs item ("docs
  agree with code") are addressed here. The five `accuracy-runner` checks stay out of scope by
  `review-scope-5b.txt` and are not graded.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:40-77,110-200,227-273,367-393`
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:39-63,238-310`
- `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:60-90,119-160,203-209`
- `.skilled/commands/doctor/scripts/README.markdown:104-115,228-236`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/vibe-command-documents.md:16-36,126-143`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/spec.md:250,343` and `acceptance-criteria.md:62`
- `git -c core.fsmonitor=false diff 2a1a42263cc d21dbc1cafe -- <the doctor script and its two tests>`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The doctor README's Vibe sentence is false after the selector fix** -- `.skilled/commands/doctor/scripts/README.markdown:235` -- The row says "a value with a trailing comment or a single-quoted string reads `hook-missing`". Since `tomlCommands` now parses a `match` value as a basic or a literal string with an optional trailing comment (`hook-wiring-check.cjs:235-245,268-269`), a `match` value written in either shape reads `ok vibe`. The same row at `README.markdown:112` describes the Vibe reading without the new selector rule, so an operator whose `pre_agent` entry carries any other selector sees `hook-missing` and no describing doc explains it.
   Case: a `.vibe/hooks.toml` turn-start block written `match = 'main'`, or `match = "main"  # main agent only`, reads `ok vibe` with exit 0, while `README.markdown:235` says that shape reads `hook-missing`.
   Finding class: documentation_contract
   Scope proof: the README is the describing doc for the in-scope script; no other file states this sentence, and the script's own comments state the opposite rule.
   Affected surface hints: the doctor scripts README rows 112 and 235, and the operator repair path for a `hook-missing vibe` line.
2. **The new "names the main agent" case duplicates the default case, so it cannot fail for a reason of its own** -- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:249-255` -- `vibeBlock`'s third parameter defaults to `match = "main"` (`:54`), so the new case writes byte-identical TOML to the case at `:241-247` and asserts the same exit code and line. The explicit-selector branch is already exercised by the default, so the added case can only fail when the older case fails too.
   Case: change `vibeBlock`'s default to `match = "agents_spawn"` and the two cases fail together; the new test never distinguishes an explicit selector from the default one.
   Finding class: test_hygiene
   Scope proof: both cases and the helper are in the in-scope test file; the sibling cases at `:257-271` and `:273-303` cover the absent and non-`main` branches.
   Affected surface hints: the doctor wiring suite's case list and the "names the main agent" title.

## Traceability Checks

- **`spec_code` (core): partial.** Phase `032` REQ-007's doctor item is "`hook-wiring-check.cjs`
  prints `hook-missing vibe` for `match = "agents_spawn"`". A fixture with that selector printed
  `hook-missing vibe .vibe/hooks.toml` and exit 1, and the repository's own file printed
  `ok vibe` and exit 0, so the requirement holds. The same row's doc item covers
  `skill-advisor-hook.md`, not the doctor README, so finding 1 is a describing-doc gap rather
  than a contradicted requirement.
- **`checklist_evidence` (core): partial.** Phase `032` AC-007 names the same cases and all of
  them pass at this commit, including the contract-test rename and the `agents_spawn` refusal.
  The packet's AC row still reads `Unmet`; that is the phase's own close-out state and is
  recorded under Edge Cases, not graded here.
- **`skill_agent` (overlay): notApplicable.** No agent definition changed in this area.
- **`agent_cross_runtime` (overlay): pass.** The check covers five runtime files and the fix
  touches only the Vibe row; the other four readings are unchanged (`hook-wiring-check.cjs:40-77`)
  and the repository run prints `ok` for all five.
- **`feature_catalog_code` (overlay): notApplicable here.** Feature-catalog text is the
  `docs-metadata` area by `review-scope-5b.txt`.
- **`playbook_capability` (overlay): pass.** `CL-010` claims the document line after the head and
  an empty child-session result; iteration 1's probe printed exactly those, and no playbook
  covers the doctor check.

## Integration Evidence

- The doctor script reads the same `.vibe/hooks.toml` the runtime loads: the repository file's
  turn-start block carries `match = "main"` and the check prints `ok vibe`, so the selector rule
  is exercised against the shipped wiring rather than a fixture alone.
- The contract test's renamed case walks `MIRROR_CHECKS = [...DSH_CHECKS, ...VIBE_CHECKS]` and
  asserts `node <script> --check` for each (`doctor-runtime-mirrors-contract.test.cjs:88,119-137,203-205`),
  so its new title names exactly what it proves.

## Edge Cases

- Phase `032`'s `acceptance-criteria.md:62` (AC-007) still reads `Unmet` while every item it names
  passes at this commit. The confirm round is not the phase close-out, so this is recorded as
  bookkeeping for the coordinator and not raised as a finding.
- The doctor README also describes the `--json` form; the fixture runs used the line form. Both
  forms share `inspect`, so the selector rule is the same, and the JSON form was not separately
  exercised.
- `re:` selectors read `hook-missing` by design (plan D9, pinned by the case at
  `hook-wiring-check.test.cjs:273-280`). Not re-reported.

## Confirmed-Clean Surfaces

- The selector rule matches plan D9 exactly: absent → `ok vibe`; `main` as a basic or literal
  string, with or without a trailing comment → `ok vibe`; any other value → `hook-missing vibe`
  (four fixtures, plus the repository's own file).
- An unparsable `match` line becomes a selector naming no agent, so a line the reader cannot
  parse narrows the match instead of widening it (`hook-wiring-check.cjs:238-245,268-269`).
- The block filter still requires the block's `type` to be the runtime's event and its `command`
  to be a string, so a `match` line cannot lend an entry to another event
  (`hook-wiring-check.cjs:271-272`).
- `node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` printed
  `tests 50`, `pass 50`, `fail 0`, exit 0.
- The renamed contract test is accurate: `routeGaps` iterates both runtime check lists and
  enforces `node` plus `--check`, which is what "every DSH and Vibe check in its check-only form"
  means (`doctor-runtime-mirrors-contract.test.cjs:88,119-137`).
- `hook-wiring-check.cjs --root .` still prints `ok claude`, `ok codex`, `ok cursor`, `ok devin`,
  `ok vibe` and exits 0, so the fix did not break the shipped wiring.

## Ruled Out

- **A `re:` selector that includes `main` is falsely reported.** Not raised: plan D9 decides that
  any value other than absent or exactly `main` reads `hook-missing`, "`re:` selectors
  included", and the case at `:273-280` pins the decision. Re-reporting it would need a new
  input that D9 does not already answer.
- **The three added cases after T023 make the suite count wrong.** T023's evidence says 47 tests
  and the suite now prints 50; T023a added three `match` cases, so the count is consistent with
  the task record and no case is unaccounted for.
- **A trailing-comment `type` or `command` line is now accepted.** Still refused: the entry regex
  anchors on the closing quote with no comment (`hook-wiring-check.cjs:263`), and the README's
  sentence stays true for those two keys. Only `match` gained comment tolerance.

## Next Focus

- Dimension: maintainability and traceability
- Focus area: `skill-advisor-hook.md` and the docs that describe the Vibe and doctor code
- Reason: the doctor code and its tests are confirmed; the hook contract's alias and Vibe claims
  are the last surfaces to check against code
- Rotation status: correctness, security, traceability and maintainability all exercised;
  traceability and maintainability close in the next iteration
- Blocked/productive carry-forward: no blocked approach
- Required evidence: the alias table against `hook-flags.cjs`, the Vibe rows against the adapter,
  and a holdout-name sweep of the docs

Review verdict: PASS
