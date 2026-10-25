# Iteration 2: Receiver binding and manual claims

## Focus

Trace the packet from consume into receiver adapters, then compare automatic wrapper hops with the printed manual command for runtimes that do not have an arm hook.

## Findings

1. **P2 — Manual Cursor and Devin claims do not bind the handoff goal packet.** The wrapper removes inherited goal and claim variables when a runtime starts, and exports SESSION_RELAUNCH_GOAL_PACKET only after it consumes an armed record for an automatic hop. The manual command builder receives a handoff path and an optional spec-folder answer, then puts those into the seed; it has no goal_packet input. The handoff guide confirms that Cursor and Devin manual commands start a first launch without exporting the packet, so the new receiver cannot bind the sender's goal. **Test coverage:** automatic packet export/clear behavior is covered; command-only manual tests assert the printed seed and replayed argv, but do not use a note carrying goal_packet or assert receiver binding. This is a documented runtime gap, not a hidden mismatch in the automatic path. [SOURCE: .skilled/bin/skilled-loop:471-474,755-762; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1186-1202; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2414-2434; .skilled/commands/speckit/handoff.md:97]

## Coverage checked

The automatic wrapper path clears inherited packet state on entry and sets or unsets SESSION_RELAUNCH_GOAL_PACKET from the consumed note. Hermes separately exports HERMES_SPEC_FOLDER and restores the operator's original value when the next note has no goal; those automatic paths have focused tests. Cursor and Devin are command-only: their manual command tests cover command shape and seed replay, while the guide explicitly records the missing goal handoff.

## Sources

- .skilled/bin/skilled-loop:471-474,755-762
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1186-1202
- .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2414-2434
- .skilled/commands/speckit/handoff.md:97

## Iteration outcome

One receiver-path limitation confirmed; continue to model, provider, and effort capture/replay across runtimes.
