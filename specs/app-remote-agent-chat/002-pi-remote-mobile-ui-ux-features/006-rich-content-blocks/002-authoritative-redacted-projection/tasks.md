# Tasks — Authoritative rich-block contract and redacted projection

- [ ] Update `packages/pi-rpc-protocol/src/types.ts` with bounded `callId`, shell genre, lifecycle/checkpoint, output completeness, block identity/revision, and relay-authored `TextArtifactBlock` fields while keeping legacy shapes valid but non-rich-eligible.
- [ ] Update `packages/pi-rpc-protocol/src/guards.ts` with strict guards for every new field and discriminant, including identity, lifecycle/checkpoint, completeness, source-size, revision, and redaction metadata validation.
- [ ] Export the new types and guards from `packages/pi-rpc-protocol/src/index.ts` without bypassing the public guard boundary.
- [ ] Extend `packages/pi-rpc-protocol/tests/guards.test.ts` with valid shell and artifact fixtures, legacy compatibility, unknown-key/discriminant rejection, bounds, wrong types, duplicate identity, and redaction metadata cases.
- [ ] Update `apps/pi-remote-relay/src/store/transcript-projector.ts` so all specified tool-call/result event families carry one stable `callId` through revisions and authoritative metadata is taken from event/protocol data.
- [ ] Preserve result-before-call evidence and emit a safe unmatched result when identity cannot be proven; do not attach it to an adjacent call.
- [ ] Add explicit text-artifact projection only for trusted relay metadata; do not classify streaming paragraphs or optimistic prompts in the relay.
- [ ] Update `apps/pi-remote-relay/src/store/redaction.ts` so command input, output, artifact source, tool names, and metadata are redacted before store persistence and replay/broadcast, with bounded provenance retained.
- [ ] Verify `apps/pi-remote-relay/src/store/relay-store.ts` and `apps/pi-remote-relay/src/replay/sync.ts` preserve guarded redacted fields only, while the existing transcript and sync transport add no endpoint, auth action, ticket, or filesystem lookup.
- [ ] Extend relay and security tests with concurrent calls, out-of-order results, replay revisions, redaction markers, result-before-call, terminal-without-result, truncation, log/error safety, and no-new-route assertions.
- [ ] Add deterministic redacted protocol and event fixtures under `apps/pi-remote-relay/src/fixtures/` for shell states, non-shell tools, explicit artifacts, sensitive sentinel categories, malformed payloads, and old cached shapes.
- [ ] Extend `apps/pi-remote-web/src/relay.ts`, `src/state.ts`, and `src/cache.ts` only as needed to accept guarded fields and preserve provenance; incomplete cache entries must remain legacy-safe.
- [ ] Add `scripts/rich-content-cdp.mjs` baseline fixture support with exact CSS-pixel width, light/dark selection, screenshot output, and overflow assertions proving the pre-rich Activity/prose layout is unchanged.
