# Doctor gates (observed 2026-10-25, after the command, routes and bridges landed)

| Command | Exit | Last or key output line |
|---------|------|-------------------------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | 0 | `OK: route-validate`, then `17 routes validated, 2 warnings` |
| `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` | 0 | `"status": "fresh"` with `"changed": []` (doctorRoutes 21, typescriptActive 26, pythonActive 36) |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | 0 | `STATUS=OK phrases=109 bridges=21` |

The two route-validate warnings are the existing flag-collision notes between targets of one command, unchanged from the pre-phase baseline.
