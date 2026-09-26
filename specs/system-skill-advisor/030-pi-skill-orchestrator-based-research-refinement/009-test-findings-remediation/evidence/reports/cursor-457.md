<!-- dispatch: cursor 457; ledger: 2026-09-26T22:50:07Z 2026-09-26T22:52:59Z 0 172 -->

RESULT: PASS | scenario=457 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm run build (advisor runtime, then spec-kit runtime) | skipped | not run | both runtime owners built | deviation |
| 2 | npx vitest run directive-lifecycle + boundary + claude hook + plugin (advisor runtime, seed 18018) | 0 | 4 files, 128 tests passed | exit 0 with a nonzero test count | yes |
| 3 | npx vitest run boundary-bridge + adapter-parity + user-prompt-submit-shim (spec-kit runtime, seed 18018) | 0 | 3 files, 29 tests passed | exit 0 with a nonzero test count | yes |
| 4 | npx --no-install vitest run --config hooks/vitest.config.ts --dir hooks/dispatch/pi | 0 | 2 files, 50 tests passed | exit 0 with a nonzero test count | yes |
| 5 | run-registered-adapter-cadence.mjs …/evidence/runtime/cursor-registered-adapter | 0 | summary.json passed true; per runtime claude true, codex true, cursor true, devin true | summary.json passed true for Claude, Codex, Cursor, and Devin | yes |
| 6 | hand-recorded dated report under benchmark/reports | skipped | not written | verdict, reason, repo-relative evidence path, byte counts, and SHA-256 | deviation |
DEVIATIONS: step 1 both `npm run build` commands skipped: prebuilt by orchestrator; step 5 output directory changed to `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/runtime/cursor-registered-adapter` because the task named that packet evidence root; step 6 hand-recorded report owned by the orchestrator
NOTES: Native-host-delivered is a separate evidence class from the adapter tests and is SKIP: this prompt's model-visible context has no `Advisor:` line, so no native-host receipt was observed. Registered-adapter evidence stays PASS on its own. A first sandboxed attempt of steps 2–4 did not see local `node_modules` (advisor and spec-kit fetched vitest 5.0.2 and found no files; Pi `--no-install` refused). The same commands were rerun unsandboxed and those exits are the ones in the table. The Pi suite printed one advisor JSON line with `"status":"skipped"` and `"errorDetails":"below_prompt_policy_threshold"` while still reporting 50 passed. OpenCode is only the plugin file inside step 2 (test-seam); no OpenCode host receipt was captured.
