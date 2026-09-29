# 009 baselines, taken by the session at clean HEAD 3dde18cb54 before any move (2026-09-29)

Tree state: `git status` showed only untracked 017 run files. `.skilled/skills/cli-jev` held 81 tracked files. The fleet had 7 hubs and `cli-classifier` was not in it.

| Check | Command | Exit | Result |
|---|---|---|---|
| Guard | `node .skilled/bin/compiled-route-guard.cjs` | 0 | 7 hubs fresh (cli-external-orchestration, cli-jev, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop) |
| Sync check | `node .skilled/bin/compiled-route-sync.cjs --check` | 0 | all 7 hubs resolve |
| Status | `node .skilled/bin/compiled-route-status.cjs --all` | 0 | 7 fleet hubs compiled-serving, plus 2 legacy test-artifact rows (manifest-race-308, manifest-test-308) that predate this phase |
| Admission | `node .skilled/bin/compiled-route-admission.cjs --all` | 0 | every hub passes, cli-jev 3 pass 0 drift 0 stale 0 n/a |
| parent-skill-check cli-classifier | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | 0 | OK, 1 manifest mode, version 1.0.0.0 |
| parent-skill-check cli-jev | same, cli-jev | 0 | OK, 1 manifest mode, version 0.2.0.0 |
| parent-skill-check cli-external-orchestration | same | 0 | OK, 7 manifest modes, version 1.7.0.0 |
| Foundation vitest | `cd .skilled && npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` | 0 | 1 file passed, 37 tests passed, 0 failed |
| Manifest test | `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` | 1 | 42 tests, 28 pass, 14 fail. Failing names in `manifest-test.failnames`. One asserts a cohort of 6 hubs against today's 7 |
| Dispatch audit test | `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` | 0 | 75 passed |
| Dispatch rule-checks test | `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | 0 | 20 tests, 20 pass, 0 fail (it is a node:test file, vitest reports "No test suite found") |

Raw outputs: `base/*.out` and `base/*.exit` in the session scratchpad, copied into this folder as `baseline-raw/`.
Route replay before the move: `route-baseline.txt` (17 prompts through `--hub cli-jev`).
