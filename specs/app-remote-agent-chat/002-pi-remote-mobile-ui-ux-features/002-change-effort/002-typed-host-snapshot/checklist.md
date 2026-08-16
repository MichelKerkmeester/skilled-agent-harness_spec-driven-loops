# Checklist — Typed host snapshot, reconciliation, and redacted outcomes

- [ ] A valid three-level snapshot passes the protocol guard.
- [ ] A valid five-level snapshot passes the protocol guard.
- [ ] A valid seven-level snapshot passes the protocol guard and preserves host order/subset.
- [ ] Unknown thinking IDs remain internal and do not become visible labels or reasons.
- [ ] Unknown issue codes, extra keys, unbounded strings, invalid revisions, invalid levels, and mismatched session IDs are rejected.
- [ ] Reconcile returns one redacted snapshot with confirmed value, advertised levels, model catalog, streaming, mode, and revision.
- [ ] Reconcile performs no ticket request, ticket consumption, intent forwarding, or `set_thinking_level` call.
- [ ] Host rejection, unsupported capability, and ambiguous transport failures map to bounded issue codes.
- [ ] Raw host reasons, HTTP bodies, and RPC text are absent from browser-visible responses.
- [ ] Stale revisions fail closed.
- [ ] Duplicate control IDs do not send a second Pi command.
- [ ] Foreground authority remains required.
- [ ] Build/Plan behavior is unchanged and no Plan-mode side effect occurs.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm test` exits 0.
- [ ] `npm run test:web` exits 0.
- [ ] The fixture relay session view is captured at exactly 390 CSS px in light and dark themes through CDP.
- [ ] The 390px captures show no new overflow, no raw runtime issue text, and no changed Build/Plan behavior.
