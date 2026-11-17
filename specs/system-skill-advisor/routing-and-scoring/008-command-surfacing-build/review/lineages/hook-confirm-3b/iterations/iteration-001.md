# Review Iteration 001 - hook-confirm-3b

## Dispatcher

- Lineage: `hook-confirm-3b` (detached fan-out), session `fanout-hook-confirm-3b-1794595021404-69frey`, generation 1, mode `new`.
- Executor: `cli-opencode` model `opencode-go/deepseek-v4.1-flash`, reasoning effort max.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.
- Operator review focus (binding): confirm the pass-three fixes in commit `860610d783`; the doctor hook check fix is reviewed first and deepest; every finding P0/P1/P2 with file:line and a concrete input run; no code changes; no holdout prompt access.
- How this iteration addressed the focus: this is the deepest pass over the hook-check half of the commit. It reads the whole driver of `DR3-P1-001` (`readWords`, `simpleCommands`, `commandWords`, `nodeFlagSkipsScript`, `runsNodeOnMarker`, `scriptWord`, `runsMarker`), runs eleven `--root` settings probes through the CLI, and states whether the fix holds and whether it introduced a defect. The no-edit half is deferred to iteration 2 as the focus directs.

## Dimension

Correctness.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:119-308` — `readWords`, `simpleCommands`, `commandWords`, `nodeFlagSkipsScript`, `runsNodeOnMarker`, `scriptWord`, `runsMarker`.
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:310-355` — `inspect`, `main`, exit-code contract.
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:220-262` — the wired/not-wired tables the commit extended.
- Commit `860610d783` diff for `.skilled` (both changed files read in full).

## Findings by Severity

### P0 Findings

None. No blocker-level defect was found in the hook-check fix.

### P1 Findings

None. The fix driver holds for every plausible hook command probed; no working hook command is now reported `hook-missing`. See Confirmed-Clean Surfaces for the eleven probes.

### P2 Findings

1. **A node argument that node itself rejects still lets the next word read as the script** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:273-279` -- `runsNodeOnMarker` skips any `-`-leading word as if it were a benign node option (`index += NODE_FLAGS_WITH_ARGUMENT.has(flag) ? 2 : 1`). Two words are not benign options: `-` makes node read the script from stdin, and a bad short cluster such as `-rc` makes node exit with `bad option`. In both cases the marker word that follows is never the script, yet the check reports `ok`.
   Finding class: correctness (false-negative diagnostic; pre-existing, not introduced by `860610d783`).
   Scope proof: the declared scope is the two files changed by `860610d783`; this line is inside `hook-wiring-check.cjs` and the two inputs are hook commands of the same shape the file's tests already cover.
   Affected surface hints: `/doctor` hook-wiring report, `--json` consumer of `hook-wiring-check.cjs`, `.claude/settings.json` repair guidance.
   Case: a settings file whose hook command is `node - .claude/hooks/claude/user-prompt-submit.js` (or `node -rc .claude/hooks/claude/user-prompt-submit.js`) is accepted as wired even though node runs no script from the project.

   Concrete inputs run (settings root under this lineage's `probes/`, CLI `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root <probe>`):

   ```
   probe dash-only        cmd="node - .claude/hooks/claude/user-prompt-submit.js"      -> "ok claude"        (exit 0)
   probe cluster-rc-bad   cmd="node -rc .claude/hooks/claude/user-prompt-submit.js"   -> "ok claude"        (exit 0)
   proof: printf '' | node - probes/ran.js      -> no output   (script never ran)
   proof: node probes/ran.js                    -> "RAN"       (script runs when it is the script word)
   proof: node -rc /dev/null                    -> "node: bad option: -rc"
   ```

   Why P2 and not P1: both spellings are exotic shell constructs; the operator severity guide reserves P1 for a hook command a person would plausibly write being misread. `node .claude/hooks/.../user-prompt-submit.js`, `node -r ./preload.cjs ...`, `node --require=... ...`, `node --no-warnings ...` and `node -i ...` all report `ok` correctly (probes below). The pre-existing status is recorded in the finding: the pre-fix `NODE_FLAGS_WITHOUT_RUN.has(flag)` branch also fell through on both words, so this is not a regression introduced by the commit.

## Traceability Checks

- `spec_code` — **pass** (hook half). The commit message claims: "It now reads the flag name first, so those commands report a missing hook." Probe evidence: `node -e1 <marker>`, `node --eval=1 <marker>`, `node --print=1 <marker>` each return `hook-missing claude .claude/settings.json` and exit 1, where the pass-three finding `DR3-P1-001` said they were read as a launch. The implementation at `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:231-237` is the stated mechanism (name read first, then the set lookup).
- `checklist_evidence` — **not applicable this iteration**. The spec folder has no `checklist.md`; the review target is the commit diff, not a packet checklist row. Recorded rather than silently passed.
- `skill_agent` — deferred to iteration 3 (the doctor command surface is not the reviewed file itself).
- `feature_catalog_code` — deferred to iteration 3.

## Integration Evidence

- Exact surface exercised: the `hook-wiring-check.cjs` CLI contract (`--root`, `--json`, exit 0 wired / 1 hook-missing / 2 bad argument) at `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:327-355`. It was run as the operator instructions require: `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root <probe-folder>`.
- Not exercised this iteration: the `/doctor` route that spawns this script, and the `.claude/settings.json` writer that repairs it. Those are named here so the omission is visible and are deferred to iteration 3.

## Confirmed-Clean Surfaces

Fix-positive probes (the intended new behaviour, all `hook-missing`, exit 1):

| Command | Result |
|---|---|
| `node -e1 <marker>` | `hook-missing claude` |
| `node --eval=1 <marker>` | `hook-missing claude` |
| `node --print=1 <marker>` | `hook-missing claude` |
| `node -pe 1 <marker>` (cluster) | `hook-missing claude` |
| `node -ci <marker>` (cluster) | `hook-missing claude` |

No-regression probes (working launch still `ok`, exit 0):

| Command | Result |
|---|---|
| `node <marker>` | `ok claude` |
| `node -r./preload.cjs <marker>` | `ok claude` (the commit's new test case) |
| `node -r ./preload.cjs <marker>` | `ok claude` |
| `node -i <marker>` | `ok claude` (`printf '' \| node -i probes/ran.js` prints `RAN`, so `-i` really does run the script) |
| `node -C development <marker>` | `ok claude` |
| `node -- <marker>` | `ok claude` |
| `node --inspect-brk <marker>` | `ok claude` |
| `node --no-warnings <marker>` | `ok claude` (`node --no-warnings probes/ran.js` prints `RAN`) |

Mechanism read: the long-flag branch splits on `=` before the set lookup, so `--eval=1`/`--print=1`/`--check=1` are recognised by name while `--require=`/`--import=`/`--loader=`/`--experimental-loader=` stay launch-shaped because their value is attached; the `/^-[rC]/` early return keeps an attached preload or conditions value from being read as a short cluster (`node -rc` is a bad option in node 26.13.0, so the early return cannot hide a real no-run flag).

## Edge Cases

- Settings roots for the probes were written under `probes/` inside this lineage instead of the operator-suggested `mktemp` folder: the dispatch forbids any write outside the lineage, and the CLI's behaviour depends only on the root contents, not its path. Conflict recorded rather than silently resolved. The probe roots are retained in the lineage for audit.
- No `steer.md` existed at iteration start.
- The commit's suite claim ("184 files, 1798 passed") was not re-run; the dispatch permits only the two named single test files.
- `node -rc` was checked against the installed node (`v26.13.0`) rather than assumed from documentation.

## Ruled Out

- "The fix reports a plausible working hook command as hook-missing": ruled out by the eight no-regression probes above, including the attached-preload case the commit added a test for.
- "The `/^-[rC]/` early return swallows a real no-run short flag": ruled out by reading node's option grammar — `-r`/`-C` consume the rest of the word as their value, so any later letter is a value, not a flag. `node -rc /dev/null` exits with `bad option: -rc`, which is the false-`ok` case folded into P2 finding 1.
- "The attached-value branch breaks a spaced value": ruled out — `--require ./preload.cjs` and `-r ./preload.cjs` still advance two words and report `ok`.

## Next Focus

- Dimension: correctness.
- Focus area: the other half of commit `860610d783` — `NO_EDIT_REQUEST` and `isNoEditRequest` in `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289-295`, plus its callers in `runtime/lib/scorer/fusion.ts:677,881` and `runtime/lib/scorer/text.ts:150`.
- Reason: the lineage must check the no-edit fix once; iteration 1 covered the hook half only.
- Rotation status: none.
- Blocked/productive carry-forward: the hook half is productive but saturated at the depth the operator asked for; do not re-enter it except to re-confirm the P2.
- Required evidence: concrete predicate outputs for real no-edit and scope-limited change prompts, and the downstream gate each output changes.

## Verdict

The doctor hook-check fix holds for every construct a person would plausibly write in a hook command, and it introduced no regression in the eight working-launch probes. One pre-existing false-`ok` for `node -` and bad short clusters is recorded as P2 advisory.

Review verdict: PASS
