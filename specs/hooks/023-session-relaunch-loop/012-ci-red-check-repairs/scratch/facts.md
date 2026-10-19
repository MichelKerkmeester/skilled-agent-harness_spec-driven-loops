# Facts for phase 012 (every claim cites its evidence)

## Problem
- CI "Rule Canary Sync" fails on main: `AGENTS.md: "#### Blast-Radius Management" ends at byte 16626, past the 16384-byte delivery prefix` (`scratch/before/canary.txt`). Devin delivers only the first 16,384 bytes of AGENTS.md, so the end of that clause would not reach it.
- Cause: commit `b3655ed3de` (phase 007, handoff gate exemptions) added the `.skilled/skills/.state/` runtime-state exemption to Gate 2 and Gate 3, moving the section end from byte 16377 to 16626. The commit before it, `b830fd0276`, had already left a 7-byte margin.
- CI "sk-doc Script Tests" fails on main: `test_validation_switch.py::test_every_example_line_works_once_uncommented` reports `['SESSION_RELAUNCH_REPO_ROOT']` (`scratch/before/validation-switch.txt`).
- Cause: commit `d001d69fee` added `# SESSION_RELAUNCH_REPO_ROOT=/absolute/path/to/repo` to `.skilled/hooks/hook-flags.env.example` in the switch-line form, though its own heading says the file is never read for it and the value must be exported in the shell. The test reads every `# NAME=value` line as a switch that must take effect once uncommented.

## Fix
- `AGENTS.md`: 11 wording tightenings, no rule removed or weakened. Ten restate the same rule in fewer words. One makes Gate 2 refer to "the gitignored runtime state Gate 3 exempts" instead of repeating the path. Section end now byte 16323, a 61-byte margin; file 27505 -> 27202 bytes (`scratch/after/canary.txt`).
- `.skilled/hooks/hook-flags.env.example`: the line now reads `#   export SESSION_RELAUNCH_REPO_ROOT=/absolute/path/to/repo   # repo root for planned handoff notes`, the export its heading describes, which the switch-line test no longer reads as a switch.

## Verification
- Rule canary `check-rule-copies.js`: exit 1 before, exit 0 after.
- `test_validation_switch.py`: 1 failed, 7 passed before; 8 passed after.
- The full sk-doc script suite (`run-script-tests.sh`): result recorded in `scratch/after/sk-doc-script-tests.txt`.

## Out of scope
- `~/.claude/CLAUDE.md` mirrors AGENTS.md outside the repository; it is not edited here and now differs from AGENTS.md by these 11 tightenings.
- The canary checks only the repository's AGENTS.md for the delivery prefix.
