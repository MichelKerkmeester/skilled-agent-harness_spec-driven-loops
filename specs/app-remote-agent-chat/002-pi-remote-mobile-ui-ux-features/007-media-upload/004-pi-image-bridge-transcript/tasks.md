# Tasks — Normalized Pi Image Bridge and Redacted Transcript

- [ ] Add `apps/pi-remote-relay/src/attachments/pi-image-bridge.ts` to load normalized JPEG/PNG bytes only after final ownership, readiness, expiry, model capability, plan-policy, and revision checks; keep base64 construction local to the host-to-Pi request.
- [ ] Extend `apps/pi-remote-relay/src/prompt/prompt-service.ts` to accept attachment references, bind `expectedPromptRevision`, submit ordered images for `prompt`, `steer`, and `follow_up`, and maintain submission idempotency; use an empty message for image-only turns.
- [ ] Add a prompt revision coordinator under `apps/pi-remote-relay/src/prompt/` or the existing session authority seam; advance it on accepted user/runtime mutations, not streaming token events, and reject stale sets before Pi invocation.
- [ ] Add `apps/pi-remote-relay/src/attachments/attachment-transcript-projector.ts` for the fixed redacted card fields.
- [ ] Update `apps/pi-remote-relay/src/store/transcript-projector.ts`, `apps/pi-remote-relay/src/store/redaction.ts`, and `apps/pi-remote-relay/src/store/relay-store.ts` so pixels and arbitrary attachment metadata cannot enter durable envelopes.
- [ ] Update `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, and `index.ts` for the redacted transcript kind and strict normalized `ImageContent` constraints without expanding browser submission DTOs with image data.
- [ ] Extend prompt, transcript-projector, redaction, and security negative-control tests for ordered delivery, image-only captions, stale revisions, model mismatch, plan mode, duplicate submission, confirmed rejection, dropped acknowledgement, export/push redaction, and workspace immutability.
- [ ] Add a pinned-Pi integration fixture/probe under `apps/pi-remote-relay/tests/integration/` that submits a real supported image through the configured supervisor and verifies no image payload enters session JSONL or stdout events; keep host capability disabled if it fails.
- [ ] Verify Pi RPC framing and the 1 MiB event-record limit before allowing image-bearing prompts; perform echo suppression before the framed relay path.
- [ ] Complete the required security review of image retention, JSONL/session behavior, event echo suppression, model/provider disclosure, prompt injection treatment, plan-mode enforcement, and ambiguous acknowledgement before real-image end-to-end testing.

