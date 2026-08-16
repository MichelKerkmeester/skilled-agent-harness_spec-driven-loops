# Checklist — Phase 1 — Protocol and relay authority contract

- [ ] Protocol guards reject extra keys, invalid IDs/tokens, mismatched revisions, and `execute_plan` without `postRunMode: "plan"`.
- [ ] Two clients using one runtime revision produce exactly one accepted mutation and one stale outcome.
- [ ] Ten repeated submissions with one control ID produce one host mutation and one replayed response.
- [ ] Expired, consumed, replayed, wrong-session, non-foreground, and unavailable-host requests produce no host mutation.
- [ ] A lost response is reported as delivery-unknown and is never retried automatically.
- [ ] Serialized plan DTOs and sync envelopes contain no raw token, secret, principal, host identifier, absolute path, or unredacted plan field.
- [ ] Existing model and thinking controls remain compatible while the plan-specific operations are introduced.
- [ ] `npm run typecheck` passes.
- [ ] `npm test -- packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests` passes.
- [ ] The running web smoke route is checked at exactly `390px` in light and dark mode with a true CDP screenshot, including hydration/unavailable state when the harness supports it.
- [ ] The scoped phase diff contains only the intended protocol, relay, storage, auth, and test changes.

