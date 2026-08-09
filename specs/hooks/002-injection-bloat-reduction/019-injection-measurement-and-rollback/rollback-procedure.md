# Injection rollback procedure

Rollback is scoped to one runtime and one candidate. Preserve the failing receipt, disable only the affected control, clear only its delivery state, then prove that the full source baseline is emitted again before returning the activation cell to `emit`.

## Controls by migration phase

| Phase | Disable control | State to clear | Full-baseline confirmation |
|---|---|---|---|
| Pi headless fallback de-duplication | Set `SPECKIT_PI_DIRECTIVE_DEDUP=0`. The accepted false spellings are `0`, `false`, `off`, and `no`. | Call `resetPiDirectiveDedupForSession(sessionId)` for the affected session. Use `resetPiDirectiveDedupState()` only when the affected session cannot be isolated. A resume, fork, startup, new session, or compaction also clears that session's record. | `SPECKIT_PI_DIRECTIVE_DEDUP=0 .opencode/node_modules/.bin/vitest run .opencode/hooks/dispatch/pi/directive-dedup.test.ts` |
| OpenCode directive single-source | No phase-local flag or delivery state exists. This is a source-parity correction, so rollback means reverting the shared-source/bridge change as one unit. Do not use `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`; that disables the advisor instead of restoring baseline emission. | None. Restart the OpenCode plugin process after restoring the prior source and compiled artifact so no loaded module remains cached. | `.opencode/skills/system-skill-advisor/mcp-server/node_modules/.bin/vitest run .opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts .opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge-smoke.vitest.ts .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts` |
| Route-only activation on system runtimes | Disable the affected runtime's candidate `004` activation by changing only that activation-matrix cell from `activated` to `emit`. Current source defines no environment flag for candidate `004`; the cell verdict is the activation control. | Clear the affected session/block record through `DeliveryStateMachine.clear()` or replace that runtime's state-machine instance. Clear the bounded route-only shadow log with `clearShadowRouteOnlyLog()` only when a clean measurement ledger is also required. | `node specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/guardrail-negative-controls.test.mjs && node specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` |
| Pi epoch directive delivery | Set `SPECKIT_PI_DIRECTIVE_DEDUP=0`; also leave `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` unset or set it to `0` so the full dispatch directive remains selected. | Call `resetPiDirectiveDedupForSession(sessionId)` for advisor directives and `resetPiDispatchShadowState()` for the compact-dispatch shadow state. Affected lifecycle boundaries must then start with a fresh full delivery. | `SPECKIT_PI_DIRECTIVE_DEDUP=0 SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE=0 .opencode/node_modules/.bin/vitest run .opencode/hooks/dispatch/pi/directive-dedup.test.ts .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` |

## Per-cell sequence

1. Record the runtime, candidate, block identity and content hash, session and lifecycle epoch, trigger, prior verdict, and failing receipt.
2. Apply the phase-specific disable control above without changing unrelated cells or defaults.
3. Clear the smallest state scope listed above. Preserve the failing receipt outside the cleared suppression store.
4. Run the listed confirmation command and `node specs/hooks/002-injection-bloat-reduction/019-injection-measurement-and-rollback/scripts/measure-injection-footprint.cjs`. Confirm that first delivery uses the full three-directive block and full Pi dispatch directive where applicable.
5. Set the affected activation cell to `emit`. Reactivation requires fresh behavioral and observed-delivery evidence for that exact cell.
