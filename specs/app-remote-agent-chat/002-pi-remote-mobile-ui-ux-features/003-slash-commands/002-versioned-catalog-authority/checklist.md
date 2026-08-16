# Checklist — Versioned catalog authority and fail-closed submission

- [ ] A real Pi `get_commands` response is projected into one bounded, path-free, relay-filtered catalog with host epoch, session identity, session revision, and catalog revision.
- [ ] Malformed, incompatible, cross-session, and stale catalogs are rejected as whole responses with no partial rows rendered.
- [ ] Existing `+` insertion and ordinary prompt submission tests remain green.
- [ ] A changed host/session/catalog revision prevents slash-aware forwarding before any Pi RPC and does not retry automatically.
- [ ] A valid explicit slash submission consumes exactly one fresh one-use ticket and forwards exactly one revision-checked prompt.
- [ ] Redaction removes paths, filenames, prompt bodies, source locations, secrets, raw host errors, unsafe names, and unknown fields.
- [ ] Catalog reads and prompt submits remain separately authorized, with no new mutation action and host/extension plan enforcement intact.
- [ ] Security review signs off on protocol data, redaction, ticket consumption, prompt forwarding, and policy changes.
- [ ] `npm run typecheck` passes.
- [ ] `npx vitest run packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests` passes.
- [ ] `npm run test:web` passes.
- [ ] CDP captures the unchanged composer and `+` browser at exactly 390 CSS pixels in light and dark.
- [ ] The final baseline shows no layout regression, no new persistence, and no exposed privileged rows.

