# Plan — Phase 2 — Host enforcement and structured plan lifecycle

## Approach

Close the privilege boundary at the host first, using explicit read-only classifications and a narrow shell allowlist. Then add a host-side artifact adapter and lifecycle publisher whose redacted events are consumed by the relay. Finally block control commands at the prompt/catalog boundary and verify malformed, stale, superseded, and restoration-failure paths with negative tests and a fixture host.

## Steps

1. Refactor the extension tool classifier to default-deny every unclassified mutation-capable built-in, shell, extension, and MCP tool.
2. Add the host-side plan-artifact adapter with bounded projection fields, stable ID/revision, opaque token, validity, and optional approaches; never derive the token from plan text.
3. Publish authoritative Build/Plan hydration and transition events, structured `plan.ready`, `plan.superseded` invalidation, and post-handoff `executing-plan` events.
4. Add bounded execution-lease hooks and restore Plan restrictions after success, cancellation, and failure; keep restrictions active on handoff/restoration failure.
5. Extend relay mode/artifact ingestion and malformed/unhealthy mapping, then reject `/plan` prompt variants and remove the Plan control command from the phone catalog.
6. Add negative host, relay, prompt, command, authority-loop, and redaction coverage; run the fixture through required lifecycle/error states and capture both themes at exactly `390px`.
7. Obtain the required host/relay security review before Phase 4 can expose Execute.

## Files to change

- `extensions/pi-remote-plan/src/index.ts`
- `extensions/pi-remote-plan/src/plan-artifact.ts` (or the equivalent host-side adapter)
- `extensions/pi-remote-plan/tests/plan-mode.test.ts`
- `apps/pi-remote-relay/src/runtime/plan-status.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `apps/pi-remote-relay/src/prompt/prompt-service.ts`
- `apps/pi-remote-relay/src/commands/command-service.ts`
- `apps/pi-remote-relay/tests/prompt.test.ts`
- `apps/pi-remote-relay/tests/commands.test.ts`
- `apps/pi-remote-relay/tests/authority-loop.test.ts`
- plan-control and redaction tests under `apps/pi-remote-relay/tests/`

## Verification gate

- `npm run typecheck`
- `npm test -- extensions/pi-remote-plan/tests apps/pi-remote-relay/tests packages/pi-rpc-protocol/tests`
- Run the web shell against a fixture host that emits Build, Plan, plan-ready, executing-plan, superseded, and extension-error events; capture true `390px` CDP screenshots in light and dark mode for Plan and extension-error states.

