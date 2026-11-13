# Review Iteration 002

## Dispatcher

- Run: `fanout-noedit-close-3c-1794596804847-827gze` (lineage `noedit-close-3c`, pass three closing round, area `noedit`)
- Mode: review; executor: this process (in-process, no nested dispatch)
- Dimension: correctness
- Review focus addressed: the dispatch orders this lineage to review the doctor hook check once, after the no-edit gate. This iteration reads the final state of `readWords`, `simpleCommands`, `commandWords`, `nodeFlagSkipsScript`, `runsNodeOnMarker`, `scriptWord` and `runsMarker`, then runs the shipped check as a process against throwaway checkouts built under `mktemp`, one per candidate command. The two settled decisions are honoured: the phrase cost from decision 1 is not revisited, and shell-construct gaps that decision 2 puts out of scope are recorded as edge cases rather than findings.
- Budget profile: `verify` (11-13 calls), used 11.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:1-357` (whole file; the changed functions are `readWords:119-191`, `simpleCommands:193-206`, `commandWords:256-268`, `nodeFlagSkipsScript:231-237`, `runsNodeOnMarker:270-280`, `scriptWord:284-297`, `runsMarker:301-308`)
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:1-267` (whole file, read not re-run: the fixture cases pin the same launch shapes the probe exercised)
- Commit `860610d783` diff for `nodeFlagSkipsScript`
- Executed: `bash .../probes/hook-probe.sh` — each case writes `{hooks:{UserPromptSubmit:[{hooks:[{type:"command",command}]}]}}` under a fresh `mktemp -d` folder with a `.claude` directory, runs `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root <folder>`, quotes stdout and the exit code, then removes the folder. Output is quoted in the finding.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A valid node flag whose value stands in the next word is read as the hook script, so a wired hook reports `hook-missing`** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:222` -- `NODE_FLAGS_WITH_ARGUMENT` lists the flags whose next word is their own argument: `-r`, `--require`, `--import`, `--loader`, `--experimental-loader`, `-C`, `--conditions`. A node flag outside that list is skipped by one word (`runsNodeOnMarker:277`), so its value becomes the candidate script word and the marker check at `:279` fails. `--env-file` and `--title` are both accepted by node in the separated form — verified by running `node --env-file /dev/null -e '…'` and `node --title hook -e '…'`, both of which print `ran`. A wired hook written as `node --env-file .env <marker>` therefore prints `hook-missing claude .claude/settings.json` exit 1, while the same flag written attached — `node --env-file=.env <marker>` — prints `ok claude` exit 0. The attached form already works, so the gap is exactly the flag set, not the shell reading.
   Finding class: class-of-bug
   Scope proof: the skip is on the reviewed line (`hook-wiring-check.cjs:222` set, consumed at `:277`) and the probe command is a valid node invocation that runs the hook script named in the settings file; no shell construct is involved.
   Affected surface hints: `/doctor` hook wiring diagnosis; every runtime row that launches node (claude, codex, cursor, devin); the `doctor-setup`/`doctor-symlink-check` delivery legs that print this verdict.
   Case: settings command `node --env-file .env .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` → `hook-missing claude .claude/settings.json`, exit 1; the attached control `node --env-file=.env <marker>` → `ok claude`, exit 0.

## Traceability Checks

- `spec_code` — partial. The file's contract line "Exit 0 when every installed runtime carries its entry, 1 when one is missing" holds for the four runtimes it models, and the four model rows (`.claude`, `.codex`, `.cursor`, `.devin`) match the checkout. The finding shows one valid launch shape inside that stated contract is misclassified; no packet acceptance row was read this iteration.
- `checklist_evidence` — pending (synthesis iteration).
- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` — pending.
- `playbook_capability` — notApplicable: the check is a CLI script with no playbook surface.

## Integration Evidence

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:348-355` is the process entry; `main` returns 1 when any row is `hook-missing`, so the misread reaches the operator as a failed diagnostic, not just a log line.
- The four model rows at `hook-wiring-check.cjs:39-68` name the settings files this check reads; the claude fixture used `.claude/settings.json` and the `hooks.UserPromptSubmit[].hooks[]` shape that `.claude/settings.json` in this checkout carries.
- No consumer of the check was edited; the probe wrote only under `mktemp` and removed each folder.

## Edge Cases

- `bash -o pipefail -c 'node <marker>'` and `command node <marker>` also print `hook-missing`. Both are valid shell forms that run the hook, but they are shell-grammar gaps, and settled decision 2 puts the check's standing as a non-parser out of scope for this review. Recorded here, not reported as findings.
- `node --max-old-space-size 4096 <marker>` also prints `hook-missing`, but node itself rejects that separated form (`Error: illegal value for flag --max-old-space-size`), so the check's verdict matches the runtime's and the case is not a defect.
- `--title` is a weaker real-world case than `--env-file`; it is included only to show the gap is the flag set rather than one flag's spelling.
- The quoted-value case `node --eval"1" <marker>` (pass-three `NE3-P2-003`) is still open as a settled sub-case: decision 2 says a command node would reject it, so it is not re-reported.
- Prior hook finding `DR2-P2-005` (env/node/bash -lc wrappers) is closed: those forms print `ok claude` in the probe and in the suite.

## Confirmed-Clean Surfaces

- Quoted scripts, env prefixes, `bash -lc`/`zsh -c` wrappers, brace groups, subshells, `exec`, separators stuck to the previous word, semicolons, background `&`, and the backslash-newline continuation all print `ok claude` in the probe and in `hook-wiring-check.test.cjs:56-245`.
- `node -e`, `node -e1`, `node --eval=1`, `node --print=1` and `node --check` are all rejected as non-launches, so the pass-three attached-value fix holds.
- `--conditions development` (separated) prints `ok claude` because `--conditions` is in the argument-taking set; this is the control that proves the set, not the reading of the next word, is what decides the verdict.
- Unreadable or absent settings JSON degrades to `hook-missing` without throwing; the check never writes the inspected file (the suite asserts the file is unchanged at `hook-wiring-check.test.cjs:49-53`).
- A marker that only appears in a description or an echo is not counted, because `collectCommands` reads only `type: "command"` entries and `runsNodeOnMarker` requires node to stand at a command start.

## Ruled Out

- **A crash or hang.** The probe ran twelve fixtures; `readWords` advances on every branch, the unterminated-quote branch returns early, and `runsMarker` caps recursion at depth 2. `main` catches a thrown error and exits 2.
- **A stateful matcher or a `lastIndex` bug.** `readWords` builds fresh arrays per call; the check is a one-shot process.
- **A false positive from `endsWith(marker)`.** The probe's `node ./<marker>` and `node <marker>` forms both end at the marker; no tested non-launch ends with the marker without running it.
- **The four test loops being vacuous.** Each launch case fails today if the shell reading regresses (e.g. removing `&` as a separator breaks `cd /tmp & node <marker>`), and each `hook-missing` case has a positive control in the suite.
- **The `--env-file` gap being the settled quoted-value case.** The separated form is a clean word boundary, and node accepts it as written; it is neither an attached value nor an unknown flag.

## Next Focus

- Dimension: traceability and maintainability
- Focus area: the two changed modules against their pinning tests and the packet's spec/report claims; comment accuracy on the changed lines; and a re-read of `NC3-P1-001` for any contradicting evidence
- Reason: correctness coverage for both review areas is complete; the remaining dimensions are the synthesis obligations
- Rotation status: D1 complete for the no-edit gate and the hook check; D3 and D4 not started
- Blocked/productive carry-forward: nothing blocked; the probe-fixture method stays available for a re-check if a finding is disputed
- Required evidence: the findings registry totals, the iteration verdicts, and the exact spec/report lines the changed code implements
- Recovery note: the `Review verdict` line stays CONDITIONAL while `NC3-P1-001` is active

Review verdict: CONDITIONAL
