# Pre-phase baseline (observed 2026-10-25, before any command or surface edit)

Run from the worktree root after the toolchain record in `toolchain.md`.

| Command | Exit | Last or key output line |
|---------|------|-------------------------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | 0 | `OK: route-validate` line ending `14 routes validated, 2 warnings` |
| `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` | 0 | `"status": "fresh"` with `"changed": []`, doctorRoutes 18, typescriptActive 23, pythonActive 33 |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | 0 | `STATUS=OK phrases=96 bridges=18` |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` | 0 | `ℹ pass 27` and `ℹ fail 0` |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | 0 | `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)` |

The two route-validate warnings are the existing informational flag-collision notes between targets of one command.
