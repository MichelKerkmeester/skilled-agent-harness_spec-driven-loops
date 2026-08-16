# Plan — Phase 4 — Plan-ready card, review sheet, and atomic execution

## Approach

Treat the structured artifact as a live capability-bound object, not as transcript text. Build the read-only card and review sheet with safe focus and invalidation first, then connect an explicit `executePlan` call whose relay and host validators perform one atomic handoff. Publish executing state only after success and restore Plan restrictions on every terminal path, with negative controls proving no prompt fallback or sensitive leakage.

## Steps

1. Add `PlanReadyCard` to render only the newest valid live artifact and keep cached, superseded, stale, and unconfirmed artifacts non-executable.
2. Add the full-height React Aria `PlanReviewSheet` with redacted content, inert background, safe initial focus, four actions, focus restoration, and all safe dismissal paths.
3. Extend `LeavePlanSheet` for Plan-ready `Leave without running` and make the retained artifact non-executable after confirmed exit.
4. Extend web runtime/state/app models for artifact hydration/events, feedback invalidation, review state, execute-pending, executing, and restored Plan; keep the token in memory only.
5. Add `executePlan` to the relay client, obtaining a fresh one-use ticket immediately before dispatch and validating the response; never call `submitPrompt` or use `setMode(build)` as fallback.
6. Complete relay/HTTP atomic validation for all ticket, principal, session, revision, artifact, mode, idle, and post-run bindings before host handoff.
7. Complete host execution hooks so `executing-plan` follows successful handoff and Plan restrictions return after success, cancellation, or failure.
8. Add component, relay, extension, integration, and end-to-end negative coverage, then run the complete fixture and exact `390px` light/dark screenshots for card, review, and executing states.
9. Obtain the required security review before enabling Execute for real sessions.

## Files to change

- `apps/pi-remote-web/src/PlanReadyCard.tsx`
- `apps/pi-remote-web/src/PlanReviewSheet.tsx`
- `apps/pi-remote-web/src/LeavePlanSheet.tsx`
- `apps/pi-remote-web/src/runtime.ts`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `extensions/pi-remote-plan/src/index.ts`
- the plan-artifact adapter used by the host extension
- `apps/pi-remote-web/tests/PlanReadyCard.test.tsx`
- `apps/pi-remote-web/tests/PlanReviewSheet.test.tsx`
- `apps/pi-remote-web/tests/LeavePlanSheet.test.tsx`
- relay integration tests under `apps/pi-remote-relay/tests/`
- extension handoff tests under `extensions/pi-remote-plan/tests/`
- end-to-end negative controls for stale/replayed/mismatched plan bindings

## Verification gate

- `npm run typecheck`
- `npm test -- packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests extensions/pi-remote-plan/tests`
- `npm run test:web -- apps/pi-remote-web/tests/PlanReadyCard.test.tsx apps/pi-remote-web/tests/PlanReviewSheet.test.tsx apps/pi-remote-web/tests/LeavePlanSheet.test.tsx apps/pi-remote-web/tests/runtime.test.tsx`
- Run the full web/relay fixture through plan-ready, review, execute-pending, executing-plan, failure, and restored-Plan states; capture true `390px` CDP screenshots in light and dark mode for card, review sheet, and executing state.

