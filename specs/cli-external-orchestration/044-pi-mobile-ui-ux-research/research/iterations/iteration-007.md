# Iteration 7: Accept-Edits Inclusion and Revocation

## Focus

Q4 accept-edits semantics: define how a reusable future-edit grant is scoped, confirmed, kept visible, revoked, expired, and reconciled with exact-action denial across Review, Session, and Attention surfaces.

## Actions Taken

1. Re-read the prior exact-action review and descriptor findings to isolate the unresolved grant contract.
2. Traced grant creation from the Review button through the web request, protocol DTO, HTTP endpoint, and approval service.
3. Traced grant consumption, exact-denial precedence, exhaustion, expiry, epoch invalidation, principal revocation, and service-close behavior through source and tests.
4. Compared the implemented controls with OWASP least-privilege, deny-by-default, and per-request authorization guidance.
5. Used RFC 7009 only as an analogous revocation contract for immediate server invalidation and failure semantics, not as a claim that the Pi grant is an OAuth token.

## Findings

### F-023: Grant creation must be future-only and leave the visible approval pending

The current grant request contains the session, epoch, allowed tool list, remaining-action count, and TTL. It does not contain the visible approval ID, revision, or digest, and the Review handler does not call the exact-action decision endpoint after grant creation. The server later spends the grant only when a new exact action is presented through `requestFromGrant`; it then creates and approves a separate one-action lease. Therefore, the truthful contract is: creating a grant does not settle, include, retry, or pre-authorize the approval currently on screen. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:89-131] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:572-603] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:378-432]

Keep `Deny` and `Approve this action` on the exact card. Put `Allow a short edit run...` behind the secondary sheet recommended in iteration 2. The sheet must say `This pending action is not included` before confirmation. After creation, return to the unchanged pending card so the operator still makes its digest-bound decision. Do not offer an `include this action` toggle: it would combine two authorization products and make count semantics harder to verify.

### F-024: Scope is a server-owned conjunction, not a descriptive label

The implemented grant is bound to the authenticated principal, one session, one epoch, an explicit non-wildcard tool allowlist, a positive bounded action count, and a bounded expiry. Each use rechecks grant status, time, principal, session, epoch, current mutation policy, exact tool membership, and exact-denial history before atomically decrementing the count. This matches OWASP's least-privilege, deny-by-default, and per-request validation principles. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:323-432] [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html]

The confirmation sheet should expose only choices the server can enforce: tool family (`edit` or `write`, never `*`), count, duration, and the current session. Use bounded presets instead of free-form values. A suitable compact summary is `Future edit requests in this session · next 3 · 10 minutes`. Do not claim path, file, repository, or argument-similarity scope because the grant contract does not enforce those dimensions. The operator must confirm the fully resolved scope, and the response DTO remains the authoritative receipt.

### F-025: Exact denial has precedence, but only before grant consumption

The service rejects grant use when the same session, epoch, tool, and exact action digest has already been denied. The approval test explicitly proves this precedence. That rule prevents a reusable grant from bypassing an operator's prior exact denial. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:383-397] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/tests/approval.test.ts:242-301]

The UI must not overstate this guarantee. Denying the visible pending action blocks that exact digest from later grant use. Revoking a grant blocks future consumption after host acknowledgement. Neither action should be described as undoing an edit whose one-action lease was already consumed or whose execution already started. If a revoke races with consumption, the host result determines which occurred first; the client should show `Revoked` plus any already-started action receipt rather than optimistic cancellation copy.

### F-026: One-tap revocation requires new authenticated list/status and revoke APIs

The service can revoke grants during epoch invalidation, principal revocation, policy shutdown, restart, or service close, and the DTO already models `active`, `expired`, `revoked`, `restart-invalidated`, and `exhausted`. However, the HTTP server exposes only grant creation. The web client discards the returned `grantId`, stores only count and expiry in component-local state, and provides no revoke action. Navigation, reload, or another enrolled device therefore loses visibility while authority can remain active. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:375-383] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/http/server.ts:526-557] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:464-529]

Planning must add an authenticated principal-scoped active-grant list/status read and an idempotent revoke command keyed by opaque `grantId`. Revocation must transition the server record before success is returned. RFC 7009 provides a useful analogous property: invalidate authority immediately, minimize propagation delay, and treat service failure as authority still existing. Thus, one tap may submit revoke immediately, but the UI must show `Revoking...` until host acknowledgement; on timeout or 5xx it must retain `Active - revoke not confirmed` and offer retry. [SOURCE: https://www.rfc-editor.org/rfc/rfc7009#section-2.1] [SOURCE: https://www.rfc-editor.org/rfc/rfc7009#section-2.2]

### F-027: Active authority must be globally visible without becoming an approval shortcut

An active grant is durable host authority, not a Review-page toast. Render one compact authority status from server state on every authoritative foreground surface: `Edit run active · 2 left · 7m` with a one-tap `Revoke` action and a link to details. Review may use a sticky banner above the queue. Session should place the status near the connection or compose authority controls, not inside transcript content. Attention should show a separate `Active authority` utility row above attention items, not create a `needs_input` item, increment the attention badge, or send a push hint. This keeps content-free attention semantics intact and prevents reusable authority from being mistaken for an exact approval. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:524-529] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:100-106]

Host time and status are authoritative. On local countdown expiry, disable any client affordance that assumes the grant is active and request fresh status. Render terminal receipts as `Expired`, `Used up`, `Revoked`, or `Invalidated after restart`; do not silently remove the banner until the current view has acknowledged the transition. Count changes should arrive from the host after each atomic decrement, not from optimistic client arithmetic.

## Questions Answered

- Q4 accept-edits inclusion is answered: the grant applies only to future exact actions and never settles the visible pending approval.
- Q4 grant scope is answered: authenticated principal plus session, epoch, explicit tool family, count, and duration; no path or argument-similarity claim is currently supportable.
- Q4 denial precedence is answered: an exact prior denial blocks the matching digest before grant consumption; it is not retroactive cancellation.
- Q4 revocation interaction is answered: persistent server-derived status, one-tap idempotent revoke, host acknowledgement before `Revoked`, and explicit race/failure receipts.
- Q2 surface integration is refined: show active authority on Review and Session and as a separate utility row in Attention, never as a push hint or exact-approval substitute.

## Questions Remaining

- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error and usage prominence.
- Q6: Define foreground suppression, unread state, stale hints, and notification preference behavior.
- Planning must choose bounded count and duration presets and add active-grant list/status plus revoke protocol and HTTP contracts.
- Planning must define whether revocation also aborts grant-derived one-action leases that are approved but not yet consumed; the current grant terminal transition alone does not establish that cascade.
- Product-coverage caveat: Termius and Vercel or Netlify remain unvalidated as named comparators.

## Sources Consulted

- Pi Remote web Review and relay client: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:455-620` and `src/relay.ts:89-131`.
- Pi Remote approval service and tests: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:240-455` and `tests/approval.test.ts:231-305`.
- Pi Remote HTTP and protocol contracts: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/http/server.ts:526-557` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:349-383`.
- OWASP Authorization Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- RFC 7009 token revocation, used as a revocation-semantics analogy: https://www.rfc-editor.org/rfc/rfc7009

## Assessment

- `newInfoRatio`: 0.66
- Novelty justification: prior work separated reusable authority from exact approval; this iteration proves future-only inclusion, identifies implemented scope and deny precedence, exposes the missing discovery/revoke boundary, and defines cross-surface visibility plus host-acknowledged expiry and revocation behavior.
- Confidence: high for current inclusion, scope, denial, and API gaps from source and tests; medium-high for the proposed interaction contract pending implementation-level race and cascade decisions.

## Reflection

What worked:

- Following the grant ID from creation through atomic consumption separated actual authority from the current button copy.
- Comparing DTO terminal states with exposed HTTP routes revealed that internal revocability is not operator revocability.
- Treating visibility as an authority invariant, rather than a Review-only banner treatment, resolved the Session and Attention integration question without weakening exact-action review.

What failed or was ruled out:

- Including the visible action in the grant was ruled out because the current request does not bind its approval ID, revision, or digest.
- Path, repository, and argument-similarity grant labels were ruled out because the server does not enforce those scopes.
- Optimistically declaring revocation or decrementing counts in the client was ruled out because host races and failures decide authority state.
- Using attention items, badges, or push hints for active grants was ruled out because active authority is persistent status, not a new attention event.

## Next Focus

Q6 foreground authority and notification lifecycle: define suppression windows, server-owned unread and settled state, stale-hint handling, badge behavior, and privacy-safe preference defaults while keeping active-grant status separate from attention events.
