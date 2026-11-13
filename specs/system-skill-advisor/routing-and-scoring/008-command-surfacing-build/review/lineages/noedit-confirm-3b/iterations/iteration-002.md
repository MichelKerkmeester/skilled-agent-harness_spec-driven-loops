# Review Iteration 002

- Dimension: correctness
- Operator review focus: the doctor hook check fix of commit `860610d783` (`nodeFlagSkipsScript` and the `runsNodeOnMarker` call it replaced). This iteration runs the check as a process against fixture checkouts under the lineage directory, so every verdict below is the printed status and exit code, not a reading. The focus's "does the fix hold and did it introduce a defect" question is answered for the hook fix here; the no-edit fix was iteration 1.
- Budget profile: verify (11-13 calls)
- Base/HEAD: `860610d783cb75e496eb97cd0808355512e547a2`

## Dispatcher

`@deep-review` LEAF iteration driven by the fan-out lineage `noedit-confirm-3b`, session `fanout-noedit-confirm-3b-1794595021404-69frey`, generation 1, lineage mode `new`. Sources read this iteration: `git show 860610d783 -- .skilled/commands/doctor`, `hook-wiring-check.cjs:40-68,100-190,193-308`, `tests/hook-wiring-check.test.cjs:1-60,226-268`, `assets/doctor-setup.yaml:40,61`, `assets/doctor-symlink-check.yaml:37,60`, the pass-three finding `DR3-P1-001` (doctor-docs-3 iteration 4), and `steer.md` (absent at read).

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:218-237` (flag tables and the changed `nodeFlagSkipsScript`), `:256-308` (`commandWords`, `runsNodeOnMarker`, `scriptWord`, `runsMarker`)
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:226-268` (the added matrix rows)
- `.skilled/commands/doctor/assets/doctor-setup.yaml:40,61` (delivery leg)
- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:37,60` (symlink route)

## Findings - New

### P0 Findings

None.

### P1 Findings

None. The reported defect is closed for every attached spelling it names, and no working command among the ten forms run is misread.

### P2 Findings

1. **A long flag whose value is attached by shell quoting still reports `ok` for a command node refuses to run** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:232` -- The name split only handles `=`. `readWords` merges a quoted value into the same word, so `node --eval"1" <marker>` reaches the flag test as `--eval1`, which is not in `NODE_FLAGS_WITHOUT_RUN` and is then skipped as an unknown long flag; the marker becomes the script word and the check prints `ok claude`. Node itself refuses the same command with `bad option: --eval1` (exit 9), so the hook cannot run while the check reports it wired. The short form is caught (`node -e"1" <marker>` reaches the test as `-e1` and prints `hook-missing`), while the long form is not: `node --check"1" <marker>` also prints `ok claude` (exit 0) although node refuses `--check1`. This window predates the commit (the old set membership missed `--eval1` the same way); it is reported because the commit's own claim is that a flag carrying its value in the same word is now read by name, and the quote-merged long form is that class.
   Finding class: class-of-bug (residual window of the class the commit narrows).
   Scope proof: the name split is on the changed line `hook-wiring-check.cjs:232`; `readWords:133-147` merges a quoted value into the flag word, which is what produces `--eval1`.
   Affected surface hints: `doctor-setup.yaml:61` delivery leg (exit 0 is PASS), `doctor-symlink-check.yaml:60` (exit 0 leaves the status unchanged).
   Case: fixture `.claude/settings.json` with `node --eval"1" .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` -> `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root <fixture>` printed `ok claude` and exited 0, while `node --eval"1"` itself exits 9 with `bad option: --eval1`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The commit says the check now reads the flag name first; `hook-wiring-check.cjs:231-237` does exactly that for `=`-attached long flags and letter-attached short flags, and `runsNodeOnMarker:276` calls it in place of the old set test. |
| `checklist_evidence` | pass | `node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` reported `tests 32`, `pass 32`, `fail 0`, exit 0. The three new rows at `tests/hook-wiring-check.test.cjs:252-255` pin `-e1`, `--eval=1` and `--print=1`, and all three now print `hook-missing`. |
| `skill_agent` | notApplicable | No agent file in the two changed files. |
| `feature_catalog_code` | notApplicable | No catalog page in the two changed files. |

## Integration Evidence

- `assets/doctor-setup.yaml:61` maps a `hook-missing` line to DEGRADED and exit 0 to PASS, which is why a false `ok` matters: it turns a dead prompt hook into a passing delivery leg.
- `assets/doctor-symlink-check.yaml:60` maps exit 0 to "status unchanged" and exit 1 to WARN, so the same false `ok` leaves a broken linked project green.
- `main:329-345` builds one check per runtime from `RUNTIMES`, and `inspect:310-321` calls `runsMarker` once per command collected from the event payload; the changed function is therefore on the only path from a settings file to the printed status.

## Edge Cases

- The fixture root for the review focus was created under the lineage directory (`probe-hook/`, removed after the run) instead of a `mktemp` folder, because this lineage may not write outside its own directory. The check reads only `--root`, so the location does not affect the verdict; recorded as a deviation in the ordering instructions, not in the code.
- `node --inspect=0 <marker>` and `node --import tsx <marker>` both print `ok` in the run above: a value carried after `=` on a long flag whose name is not in the skip set still lets the loop reach the script word, which is correct for flags that continue to a script.
- `node -i <marker>` prints `ok`: the interactive flag does not stop node from evaluating the script, so `ok` is the right verdict even though a REPL follows.

## Confirmed-Clean Surfaces

- The three attached-flag spellings the pass-three finding named all print `hook-missing` with exit 1: `node -e1`, `node --eval=1`, `node --print=1`, plus `node --check=1` and `node -p1`.
- Ten working forms all print `ok claude` with exit 0: plain launch, `env -u AI_SESSION_CHILD`, `-r./preload.cjs`, `--require ./preload.cjs`, `--no-warnings`, `--experimental-loader=./x.mjs`, `--import tsx`, `bash -c '... node <marker>'`, `-i`, and `-r ./preload.cjs --no-warnings`.
- `nodeFlagSkipsScript` keeps `-r` and `-C` off the skip path (`/^-[rC]/` at line 235), so an attached preload or conditions value is still read as a preload and the following word stays the script.

## Ruled Out

- A working command newly reported `hook-missing`: ruled out for the ten forms above, including the attached preload the commit adds a test for.
- A non-launch newly reported `ok`: ruled out for the attached short forms and for the `=`-attached long forms; the one remaining window is the P2 above and predates the commit.
- A loop that consumes the script word as a flag argument: ruled out by reading `runsNodeOnMarker:273-279`; only `NODE_FLAGS_WITH_ARGUMENT` advances by two, and none of those names is in the skip set.

## Next Focus

- Dimension: security, traceability, maintainability
- Focus area: the safety consequence of the no-edit P1 across the four gates, the two fixes' test evidence, and comment/naming quality on the changed lines
- Reason: correctness is covered on both files; the remaining dimensions need one closing pass so the lineage can stop.
- Rotation status: correctness complete after this iteration; security rotates in.
- Required evidence: the gate call sites, the test files that would fail if each fix were removed, the holdout numstat proof, and the registry counts.
- Recovery note: the `Review verdict` line stays CONDITIONAL while `NE3-P1-001` is active.

Review verdict: CONDITIONAL
