# Verified findings for phase 006-skilled-loop-command

Source: `../scratch/verify-1.md` in the parent packet, written by the verifying reviewer on 2026-11-12. This file is the brief for this phase. The work package comes first, then each finding it covers.

## Work package

6. **WP6. `skilled-loop` as a shell command** (F12)
   - Files: `.skilled/bin/skilled-loop-shell.sh`, `tests/skilled-loop-shell.test.cjs`.
   - Must fail first: the function is defined after sourcing.

## Findings

### F12. `skilled-loop` is not a command
- **Evidence.** `skilled-loop:684` and `relaunch-core.cjs:1344` print `skilled-loop <runtime>`. The shim defines only the runtime functions (`skilled-loop-shell.sh:312-317`). `zsh -i -c 'command -v skilled-loop'` printed nothing, while `type claude` printed "shell function from .../skilled-loop-shell.sh".
- **Verdict.** CONFIRMED, P3. The report says falling back loses the goal, but with the shim sourced, `claude "<seed>"` goes through the wrapper.
- **The fix.** Add a `skilled-loop` function to the shim that calls the wrapper with `bash`. That avoids churn in the tests that pin the printed text (`skilled-loop-wrapper-claim-goal.test.cjs:160-170`).
- **Tests.** `skilled-loop-shell.test.cjs`: `skilled-loop` is defined after sourcing (fails today).
