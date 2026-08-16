# Plan — Normalized Pi Image Bridge and Redacted Transcript

## Approach

Treat the host-to-Pi bridge as a final, narrow capability boundary. Revalidate ownership, readiness, policy, model, expiry, and revision immediately before loading each normalized derivative; construct image blocks only for the existing Pi request, then make acknowledgement and transcript projection converge on deletion and fixed redaction. Use negative controls and a pinned real-image probe to validate the actual framing, session, stdout, workspace, and provider boundaries rather than relying on type-level guarantees alone.

## Steps

1. Implement the Pi image bridge with final ownership/readiness/expiry/capability/plan/revision checks and host-local image encoding.
2. Extend prompt service and the revision coordinator for ordered `prompt`, `steer`, and `follow_up` images, empty image-only captions, atomic stale rejection, and idempotent submissions.
3. Add the redacted attachment projector and tighten transcript/store/redaction paths so only the fixed allowlist can persist or leave the relay.
4. Update protocol types/guards/exports for strict normalized image content and the redacted block without adding browser pixel fields.
5. Add prompt, projector, redaction, security, and workspace-immutability tests for success, rejection, stale, duplicate, and ambiguous acknowledgement paths.
6. Add and run the pinned-Pi/provider persistence/echo probe; verify event echo suppression before framed relay handling and the 1 MiB event-record limit.
7. Run the shared verification gate with media disabled or a redacted-card fixture and complete the required security review.

## Files to change

- `apps/pi-remote-relay/src/attachments/pi-image-bridge.ts`
- `apps/pi-remote-relay/src/prompt/prompt-service.ts`
- `apps/pi-remote-relay/src/prompt/` (prompt revision coordinator seam)
- `apps/pi-remote-relay/src/attachments/attachment-transcript-projector.ts`
- `apps/pi-remote-relay/src/store/transcript-projector.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/store/relay-store.ts`
- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `apps/pi-remote-relay/tests/prompt.test.ts`
- `apps/pi-remote-relay/tests/transcript-projector.test.ts`
- `apps/pi-remote-relay/tests/redaction.test.ts`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- `apps/pi-remote-relay/tests/integration/` (pinned-Pi/provider probe)

## Verification gate

Run `npm run typecheck`, `npm run test`, and `npm run test:web`, plus relay prompt/redaction/security suites and the pinned-Pi image probe. Use CDP at exactly 390 CSS px in both light and dark themes with media disabled or a redacted-card fixture; verify no raw image is visible and no existing text layout regresses. Confirm the 1 MiB event-record/framing check, workspace immutability, and required host-to-Pi/provider security review.

