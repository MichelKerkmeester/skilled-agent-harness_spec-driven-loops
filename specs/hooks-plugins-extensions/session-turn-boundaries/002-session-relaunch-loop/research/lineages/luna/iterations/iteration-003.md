# Iteration 3: Live model and provider precedence

## Focus

Review launch-flag capture/replay and the later-hop setting merge, with emphasis on how a live model and its provider are carried together.

## Findings

1. **P2 — A live model can be replayed under the provider from the first launch when the live provider is absent.** The launcher captures the initial provider into SKILLED_LOOP_PROVIDER. Prepare records model and effort, while arm merges only non-empty live settings into the pending record. Pi and Hermes adapters populate model and provider independently, so a host payload can supply the model without the provider. On consume, the wrapper accepts a valid live model, but it updates the provider only when the record also contains a non-empty valid provider; otherwise the initial launch provider remains active. That can pair a newer model with a stale provider, despite the code comment that they move together. **Test coverage:** the Pi and Hermes precedence tests replace both values together. The broad flag replay matrix checks launch arguments, and there is no model-only or invalid-provider case with a valid live model. [SOURCE: .skilled/bin/skilled-loop:515-568,801-812; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:524-535; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:734-760,807-820; .skilled/hooks/session-relaunch/pi/session-relaunch.ts:401-417; .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:102-113; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1315-1349]

## Coverage checked

The launch-argument matrix captures and replays model flags for all seven runtimes, provider flags for Pi and Hermes, and effort for Claude, Codex, Pi, and Hermes. Effort parsing and invalid-value fallback also have focused cases. The gap is the paired model/provider fallback when only one live value is available.

## Sources

- .skilled/bin/skilled-loop:515-568,801-812
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:524-535
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:734-760,807-820
- .skilled/hooks/session-relaunch/pi/session-relaunch.ts:401-417
- .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:102-113
- .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1315-1349

## Iteration outcome

One setting-precedence gap confirmed; the next review separates each runtime's live-value source from its replay representation.
