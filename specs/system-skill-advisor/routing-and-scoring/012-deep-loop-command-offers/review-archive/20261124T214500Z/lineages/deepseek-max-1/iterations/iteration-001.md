# Iteration 1 - correctness

## Dispatcher

- Lineage: `deepseek-max-1`, generation 9, run `fanout-deepseek-max-1-1795552859377-13gxwk`
- Dimension: correctness
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: the correctness pass reads the newest code the focus names first — the twelfth fix round (REQ-050 to REQ-053) — and the reducer projections those requirements claim, before the traceability passes map REQ to code.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197` (the one `DEEP_LOOP_DOCTOR_COMMAND` export)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:900` (`NO_EDIT_REQUEST`, `RUN_REFUSED`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1510` (`commandOnlyMentioned` doc-path guard)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1590` (stuck-run doctor branch in `attachCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1060` (`DOCTOR_NAMING_LED` built from the exported constant)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1075` (`withholdDeepLoopDoctorWithoutRun`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:481` (prompt head cap before routing)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:217` (`extractSection`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` (`stripReviewVerdict`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1011` (`refinesSameLocation`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2378` (`MIN_BLOCKED_ATTEMPTS`, ruled-out vs blocked)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2419` (`replaceAnchorSection` numbering)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5098` (`_fold_quotes`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5214` (`_RUN_ASK_REFUSAL_CANCELLED_RE`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` — partial. The twelfth-round slice was traced end to end: REQ-050 (negation cancels a refusal) at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1510` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5214`; REQ-051 (every gate pattern compared or listed) at `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571`, where `PATTERNS_NOT_COMPARED` holds 38 named entries; REQ-052 (Next Focus ends before the verdict, keeps its lines) at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` and `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2896`; REQ-053 (one doctor command name) at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197` and the import in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27`. The REQ-001 to REQ-049 slice is not mapped yet, so the protocol stays partial.
- `checklist_evidence` — partial. The acceptance file's citation set was checked mechanically in this pass: all 61 `AC-0NN` rows' `` `path:line` `` citations resolve, and each cited line sits within ±3 lines of the phrase its parenthetical names. The task checklist (`T001` to `T114`, `CHK-001` to `CHK-051`) is not checked yet, so the protocol stays partial.

## Integration Evidence

- Command surface: `/deep:review` (`.skilled/commands/deep/review.md`) is the only caller of the workflow this lineage runs; no command file was changed or needs a change for the code reviewed.
- Reducer surface: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` owns the registry, dashboard and strategy refresh this iteration's record feeds, and its `stripReviewVerdict` / `replaceAnchorSection` / `refinesSameLocation` were read here rather than assumed.
- Scorer surface: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` reads the doctor command name through the export from `command-attach.ts`, so a rename in one file would fail the build rather than silently drift.

## Edge Cases

- A stuck-run complaint that rules out a change ("my deep review run is stuck, don't change anything") reaches the doctor decision from two layers. `attachCommand` withholds on `isNoEditRequest` (`command-attach.ts:1600`), and the scorer withholds on `isRunRefused` (`fusion.ts:1082`), because `RUN_REFUSED` counts `don't change anything` through its `change` + `anything` branch. The two layers agree on that prompt, so the apparent divergence is ruled out below rather than reported.
- A Next Focus section that is not the file's last section carries no verdict inside its span; `stripReviewVerdict` is then a no-op and the section keeps every line. Only a section that runs into the final verdict line is cut, which is the case REQ-052 names.
- A refinement that names a different file keeps its own entry (`refinesSameLocation` returns false), and a same-file refinement still folds; the reducer's `MIN_BLOCKED_ATTEMPTS = 2` means one ruling is written `RULED OUT` with a reopen condition rather than `BLOCKED`.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197` — `export const DEEP_LOOP_DOCTOR_COMMAND = '/doctor:deep-loop';` is the only declaration in `lib`; `rg "const DEEP_LOOP_DOCTOR_COMMAND" lib` returns that one line, which is what AC-061 claims.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1064` — the doctor naming pattern is assembled from the imported constant plus the shared decline/ask lead lists, so the two layers cannot spell the command differently.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5099` — both copies collapse whitespace runs (`\s+`) and fold curly apostrophes before any gate pattern reads the prompt, so a tab, a double space or an NBSP inside a loop phrase keeps the phrase.
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:480` — the brief routes on a prompt cut to `ADVISOR_PROMPT_MAX_CHARS` after dropping a pasted reply, so a long paste cannot hide the task line and the native path reads the same head the Python gate reads.
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` — `trackedCommandForOwner` refuses a command the tracked table does not name for the row's own skill, so the degraded path cannot print a command it cannot vouch for.

## Ruled Out

- Doctor-gate disagreement on a no-edit stuck complaint: ruled out. Both layers withhold it, through `isNoEditRequest` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1600` and `isRunRefused` at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1082`, because `RUN_REFUSED` reads "don't change anything" as a refused fix.
- Unescaped command name in `DOCTOR_NAMING_LED`: ruled out as a live defect. The value is a fixed export (`/doctor:deep-loop`), whose characters are literal in a `RegExp` string, and the pattern is rebuilt from the export on every load; no prompt text reaches the pattern's source.
- Next Focus line-flattening in the dashboard: ruled out. The dashboard pushes the multi-line focus string as one array element (`reduce-state.cjs:2896`), so its line breaks survive; the strategy writes it through `replaceAnchorSection`, which joins with `\n`.
- `AC-028`'s evidence cell (the eighth-round row) versus its 186 files / 3,518 passed count: recorded as a traceability item for a later pass, not a correctness defect in code.

## Next Focus

- Dimension: security
- Focus area: the gate's trust boundary — the 10,000-character prompt cap on both transports, the bounded lead windows, and the degraded renderer's command validation.
- Reason: the packet changes how untrusted prompt text selects a command; correctness of the new rules is traced, and the next strongest risk is whether crafted prompt text can force work, forge a command, or evade a refusal.
- Rotation status: correctness done; security, traceability and maintainability remain.
- Blocked/productive carry-forward: productive — direct reads of both gate copies plus the shared fixture resolved every clause without a blocked direction.
- Required evidence: file:line for each bound (`LEAD_WINDOW`, `ADVISOR_PROMPT_MAX_CHARS`, `_advisor_prompt_head`) and for the tracked-command check.
- No recovery note: this pass was not a recovery iteration.

Review verdict: PASS
