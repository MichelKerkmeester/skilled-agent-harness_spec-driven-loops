# Tasks — Versioned catalog authority and fail-closed submission

- [ ] Update `packages/pi-rpc-protocol/src/types.ts` with versioned catalog identity, selected binding, slash-aware expected-revision submission fields, and authoritative/optional field documentation.
- [ ] Update `packages/pi-rpc-protocol/src/guards.ts` to validate identity, bounded descriptor strings, optional metadata, canonical names, slash submission fields, and incompatible or unknown shapes.
- [ ] Export the new protocol types and guards from `packages/pi-rpc-protocol/src/index.ts` without widening unrelated RPC commands.
- [ ] Add valid, malformed, cross-session, unknown-field, control-character, bidi-override, oversized, and stale-shape fixtures in `packages/pi-rpc-protocol/tests/guards.test.ts`.
- [ ] Extend `apps/pi-remote-relay/src/store/redaction.ts` with the explicit bounded command projector, safe-name rejection, and approved-field allowlist.
- [ ] Update `apps/pi-remote-relay/src/commands/command-service.ts` to track host epoch/session/catalog revisions, replace complete snapshots, expose effective availability, and provide fail-closed Send revalidation without a fallback catalog.
- [ ] Keep `apps/pi-remote-relay/src/http/server.ts` authenticated as `commands:list` for catalog reads, validate slash-submit envelopes, consume tickets once, and map stale/denied/incompatible outcomes without host-detail leakage.
- [ ] Update `apps/pi-remote-relay/src/prompt/prompt-service.ts` to check expected identity/revision values before `supervisor.send` and never implicitly map slash commands to `steer` or `followUp`.
- [ ] Verify separate catalog-read and prompt-submit authorization in `apps/pi-remote-relay/src/auth/policy.ts` without introducing a mutation action.
- [ ] Wire real host epoch/session state and `agent_start`/settled availability transitions in `apps/pi-remote-relay/src/index.ts`.
- [ ] Add relay command, prompt, security negative-control, HTTP, and integration coverage for redaction, privileged filtering, revision races, one-use tickets, ordinary prompt compatibility, and zero-Pi-call stale/denied paths.
- [ ] Update `apps/pi-remote-web/src/relay.ts` to parse guarded versioned catalog and slash-submit responses while retaining the ordinary `submitPrompt` API.
- [ ] Complete the required security review before merge.

