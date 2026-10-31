<!-- dispatch: cursor 457; ledger: 2026-09-27T14:02:33Z 2026-09-27T14:04:41Z 0 128 -->

RESULT: PASS | scenario=457 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | cd advisor runtime && npm run build; cd spec-kit runtime && npm run build | skipped | not run | both runtime owners built | deviation |
| 2 | cd system-skill-advisor/runtime && npx vitest run directive-lifecycle, boundary, claude hook, plugin --seed=18018 | 0 | Test Files 4 passed (4); Tests 129 passed (129) | exit 0 with nonzero test counts | yes |
| 3 | cd system-spec-kit/runtime && npx vitest run boundary-bridge, adapter-parity, user-prompt-submit-shim --seed=18018 | 0 | Test Files 3 passed (3); Tests 30 passed (30) | exit 0 with nonzero test counts | yes |
| 4 | cd .skilled && npx --no-install vitest run --config hooks/vitest.config.ts --dir hooks/dispatch/pi | 0 | Test Files 2 passed (2); Tests 50 passed (50) | exit 0 with nonzero test counts | yes |
| 5 | node run-registered-adapter-cadence.mjs <packet evidence dir> | 0 | summary.json passed=true; claude=true, codex=true, cursor=true, devin=true | summary.json passed true for Claude, Codex, Cursor, and Devin | yes |
| 6 | hand-record dated benchmark report | skipped | not written | verdict, reason, evidence path, byte counts, SHA-256 | deviation |
DEVIATIONS: Step 1 both builds skipped: prebuilt by orchestrator. Step 5 output directory changed to specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/runtime/cursor-registered-adapter (dispatch evidence root; harness created it). Step 6 hand-recorded report owned by the orchestrator.
NOTES: Native-host-delivered is a separate evidence class from the adapter tests and is SKIP: STEP 0 showed no Advisor: line in this prompt's model-visible context, so no native-host receipt was observed. summary.json hostDeliveryStatus for cursor is adapter-pass-host-dormant-unconfirmed. Pi suite stdout included one JSON line with runtime=pi, status=skipped, errorDetails=below_prompt_policy_threshold; the suite still exited 0 with 50 tests passed.
