# Review Iteration 001

## Dispatcher

- Lineage: `doctor-docs-3`, session `fanout-doctor-docs-3-1794593402980-zhrui5`, generation 1, lineage mode `new`.
- Mode: review, dimension `correctness`, budget profile `verify`.
- Operator review focus: pass-three narrow review of the doctor-docs files whose area equals the label without `-3`; read `git diff ec1869dae8..HEAD` per file, judge each change against its pass-two task line and its callers, report only P0/P1/P2 findings with a concrete input, never open the sealed holdout prompt file. This iteration addresses the focus by reading the complete diff of both changed doctor scripts and their two test files, then running those four single-file suites and the check binaries on the final tree.
- Sources read: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/tasks.md` (T034, T035, T044, T045); the scope file for this pass; `git diff ec1869dae8..HEAD` for `hook-wiring-check.cjs`, `agents-md-check.cjs`, `tests/hook-wiring-check.test.cjs`, `tests/agents-md-check.test.cjs`; the current reader and check sources; `sk-code/sk-code-review/references/review-core.md` §2 for severity and reach.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:115-298` (new word reader, simple-command splitter, env/node/shell resolution, marker test)
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:300-347` (unchanged `inspect`, `main`, exports)
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:640-657` (A10 expected/reported count and detail)
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:135-262` (new launch and non-launch cases)
- `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:580-596` (A10 exact-detail case)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **An attached node evaluation flag still reports the hook as wired** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:266` -- `NODE_FLAGS_WITHOUT_RUN` is matched with exact set membership, so the attached spellings of the flags that make node skip its script word do not match. A command that node never uses to run the marker is printed as `ok`.
   Finding class: class-of-bug
   Scope proof: `rg -n "NODE_FLAGS_WITHOUT_RUN|startsWith\\('-'\\)" .skilled/commands/doctor/scripts/hook-wiring-check.cjs` shows the only membership test is line 266 and the flag advance is line 267; `git diff ec1869dae8..HEAD -- .skilled/commands/doctor/scripts/hook-wiring-check.cjs` shows the set and the exact-match test are new in this change, and the removed `startsCommand` reader returned `hook-missing` for the same command.
   Affected surface hints: [".claude/settings.json UserPromptSubmit command", "doctor hook-wiring check", "doctor setup status"]
   Case: a runtime's `.claude/settings.json` holds `{"UserPromptSubmit":[{"hooks":[{"type":"command","command":"node --eval=0 .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js"}]}]}`. `readWords` yields `node`, `--eval=0`, the marker path. `runsNodeOnMarker` advances past `--eval=0` because only the exact string `--eval` is in `NODE_FLAGS_WITHOUT_RUN`, then matches the marker path and returns true, so `node hook-wiring-check.cjs --root .` prints `ok claude` and exits 0 although node evaluates `0` and never runs the marker script. `node -e"1" <marker>` and `node -p"1" <marker>` take the same path.
   Claim adjudication: `{"type":"claim","claim":"the reader treats every node spelling that suppresses script execution as a flag with an attached argument it can skip, so a stale marker path after --eval=, -e or -p is approved as a wired hook","evidenceRefs":[".skilled/commands/doctor/scripts/hook-wiring-check.cjs:226-228", ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:260-270", ".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:246-250"],"counterevidenceSought":"checked whether readWords splits an attached flag value into a separate word, whether any later guard re-tests the marker as a script argument, and whether the existing non-launch case covers the attached spelling; it does not","alternativeExplanation":"the team may consider only space-separated node flags as supported launch shapes, in which case this is a documented limit rather than a defect","finalSeverity":"P1","confidence":0.68,"downgradeTrigger":"downgrade to P2 if the check's stated contract is narrowed to space-separated node flags, because the input then falls outside the class the reader promises to read"}`
   Recommendation: match the flag name before `=` (`flag.split('=')[0]`) against `NODE_FLAGS_WITHOUT_RUN`, or add a test for `node --eval=0 <marker>` and the combined short forms, so an attached evaluation flag stays a non-launch.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | T034's reader and T035's count are present at `hook-wiring-check.cjs:115-298` and `agents-md-check.cjs:648-657`; `node --test` on both suites reports `fail 0` (28 and 44 tests). |
| `checklist_evidence` | pass | The remediation checklist CHK-FIX-005 claims the `node`, `env`, `bash -lc`, `zsh -c`, flag, stuck-separator and quoted-`echo` matrix rows; the test file holds all of them at `tests/hook-wiring-check.test.cjs:135-262`. |
| `feature_catalog_code` | notApplicable | This iteration reviewed no catalog page. |
| `playbook_capability` | notApplicable | This iteration reviewed no playbook page. |

## Integration Evidence

- `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root .` printed `ok claude`, `ok codex`, `ok cursor`, `ok devin` and exited 0.
- `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root . --json` reports A10 as `3/6 copies as expected, 2 reported only, 1 pointer missing`, which equals the case T035 added at `tests/agents-md-check.test.cjs:592`.

## Edge Cases

- The task's non-launch list names `node -e "1" <marker>` (space form) but not the attached spellings, so the failure is inside the class the new reader claims and outside the exact cases the tests pin. Recorded as the downgrade trigger on finding 1.
- The prior reader reported `hook-missing` for the attached form, so this is an introduced regression rather than a pre-existing blind spot.
- The `A10` detail now omits a count for entries in `FINDING` or `UNKNOWN`; the row's state still carries those classes and `copyVerdict` emits only `PASS`, `INFO`, `UNKNOWN` and `FINDING`, so no entry can vanish from the total.

## Confirmed-Clean Surfaces

- Quoted scripts stay mentions: `echo "x && node <marker>"` is tested and returns `hook-missing` (`tests/hook-wiring-check.test.cjs:204-213`).
- Unclosed quotes, `node --check`, `node -e "1"`, a comment launch and a shell script with its own `-c` are tested as non-launches and stay `hook-missing`.
- The A10 detail equals the fixture's pass and reported counts, and the row-state rule is unchanged.

## Ruled Out

- `--eval` in the space-separated form is ruled out: `NODE_FLAGS_WITHOUT_RUN.has('--eval')` returns true and the reader stops.
- A bare `node <marker>` after `env -u NAME`, `env`, `/usr/bin/env`, `node -r`, a subshell, a brace group, `exec`, a background command and a backslash continuation is ruled out as a defect; all seven are tested and pass.
- `bash -o pipefail -c <script>` is ruled out as introduced: the removed `startsCommand` also failed it, so it is a pre-existing limit outside this pass.

## Next Focus

- Dimension: traceability.
- Focus area: the doctor embed route, embed workflow, setup router and their contract tests (T031, T032, T033), against `agents-md-embed.cjs` and `doctor-setup.yaml`.
- Reason: iteration 1 closed the two changed checks; the route and workflow text is the remaining doctor-docs surface those commits changed.
- Rotation status: correctness complete, traceability next.
- Blocked/productive carry-forward: the launch-reader class is productive; keep reading shell shapes through the same parse path.
- Required evidence: engine backup naming and restore-failure lines, route YAML parse through the contract test, workflow sentence equality, and single-file test runs.

Review verdict: CONDITIONAL
