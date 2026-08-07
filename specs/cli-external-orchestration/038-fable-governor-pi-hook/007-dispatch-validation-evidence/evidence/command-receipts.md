# Phase 007 Command Receipts

This append-only receipt records observed command output by evidence class. Each command is retained with its exact working directory, timing, environment facts, output, and exit code.

## Focused Pi suite — current baseline

- Evidence class: registered Pi factory plus named pure-helper rows
- Command: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot`
- CWD/root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
- Start (UTC): `2026-08-04T23:08:36Z`
- End (UTC): `2026-08-04T23:09:10Z`
- Environment: Vitest `v4.1.10`; Node/npm not printed by this command; macOS host
- Raw output path: `/tmp/phase007-pi-suite-current.log`
- Observed stdout/stderr:

```text
 RUN  v4.1.10 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

································

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  01:09:10
   Duration  158ms (transform 29ms, setup 0ms, import 36ms, tests 12ms, environment 0ms)
```

- Exit code: `0`
