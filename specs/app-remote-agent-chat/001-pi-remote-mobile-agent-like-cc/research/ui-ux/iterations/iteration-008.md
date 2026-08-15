# Iteration 8: Accept-Edits Grant Presets, Status, and Revocation

## Focus

Q4 accept-edits grant UX specifics: choose bounded count-duration presets, define at-a-glance active-authority status across Session and Attention, and specify the host-confirmed revoke protocol and HTTP contract.

## Actions Taken

1. Re-read the externalized strategy, state log, configuration, and iteration 7 contract to preserve the future-only, server-scoped, globally visible grant model.
2. Traced the grant DTO, server validation bounds, creation endpoint, client request, and Review-local banner to identify the currently enforceable preset envelope and missing status fields.
3. Traced grant consumption, lease creation, lease consumption, terminal transitions, and authority-loop tests to resolve the revoke-versus-consume race and derived-lease cascade.
4. Rechecked OWASP authorization guidance and RFC 7009's analogous immediate-revocation and 503 behavior against the proposed list/status and revoke endpoints.

## Findings

### F-028: Use three bundled presets and default to 3 edits / 5 minutes

The relay already enforces a conjunction of a positive integer action count no greater than 10 and a positive TTL no greater than 10 minutes. The current web client chooses 3 actions but always submits the maximum 10-minute TTL, without showing a confirmation sheet. This makes `3 edits / 10 min` enforceable, but it is not the least-authority default because the time bound remains fully open after a quick three-edit run stalls. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:63-66] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:323-355] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:113-131]

Use three bundled radio presets rather than independent count and duration selectors:

| Label | Bound | Role |
|---|---:|---|
| One edit | 1 edit / 2 min | Smallest authority for a known follow-up |
| Short run | 3 edits / 5 min | Default; enough for a compact edit sequence without using either server maximum |
| Longer run | 5 edits / 10 min | Deliberate high-authority option, still half the server count ceiling |

Do not expose free-form input or a 10-edit preset in the first UI. The server hard cap remains defense in depth, not a target the interface must advertise. The `Allow a short edit run` sheet should show the current session and exact allowed tool, state `The pending action is not included`, and resolve the selected conjunction as `Up to 3 future edit requests for 5 minutes, whichever comes first`. The primary button should repeat the commitment: `Allow 3 edits for 5 min`. This is a design recommendation derived from least privilege, not an empirically validated optimum; physical-device usability testing should verify comprehension and whether 5 minutes causes avoidable expiry. [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html]

### F-029: Status needs host time, not client arithmetic

`AcceptEditsGrantDto` contains the opaque grant ID, session, epoch, allowed tools, remaining count, absolute expiry, and status. That is sufficient for the compact primary line `Edit run active · 2 left · 4m`, but the list response also needs `serverNow` so the PWA can anchor its countdown without trusting device clock skew. The current component drops `grantId`, keeps only count and expiry in Review-local state, and never refreshes either from the host. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:375-383] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:464-529]

Session should show the current session's grant beside connection/compose authority controls. If other sessions also have authority, add a secondary `1 other edit run active` link to Attention. Attention should render an `Active authority` utility section above attention items, with one row per grant and no unread badge or push hint. Each row shows the compact primary line, a redacted session label, exact expiry in its details, and `Revoke`. Review uses the same shared server-derived model rather than component-local state. Revalidate on foreground entry, after grant creation or revocation, and on a bounded foreground interval; at local countdown zero show `Checking status...` and fetch again rather than declaring `Expired` optimistically.

### F-030: Add principal-scoped list/status and idempotent revoke HTTP contracts

The current server exposes only `POST /api/accept-edits` for creation. It has no authenticated discovery or operator-revoke route even though the service can read one grant and mark grants terminal internally. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/http/server.ts:526-557] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:435-450] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:719-757]

Planning should add these contracts:

```ts
interface AcceptEditsGrantListResponse {
  readonly serverNow: string;
  readonly grants: readonly AcceptEditsGrantDto[];
}

interface AcceptEditsGrantRevokeRequest {
  readonly idempotencyKey: string;
}

interface AcceptEditsGrantRevokeResponse {
  readonly serverNow: string;
  readonly grant: AcceptEditsGrantDto;
  readonly revokedUnconsumedLeases: number;
  readonly alreadyTerminal: boolean;
}
```

- `GET /api/accept-edits?status=active` returns only grants owned by the authenticated principal. An optional `sessionId` filter must remain conjoined with that principal; the client never supplies a principal.
- `POST /api/accept-edits/{grantId}/revoke` authenticates the principal, applies the idempotency key, performs the terminal transition and lease cascade in one host transaction, and returns `200` only with authoritative status.
- Repeating revoke for the same principal-owned terminal grant returns `200` with `alreadyTerminal: true`. Unknown and foreign-principal IDs return the same non-revealing `404` response.
- A timeout, network failure, or `5xx` leaves the UI at `Active · revoke not confirmed` with Retry. RFC 7009 is an analogy, not the Pi protocol: it supports immediate host invalidation and explicitly requires a client to assume authority still exists after `503`. [SOURCE: https://www.rfc-editor.org/rfc/rfc7009#section-2.1] [SOURCE: https://www.rfc-editor.org/rfc/rfc7009#section-2.2.1]

### F-031: Revoke must cancel grant-derived leases that are approved but not consumed

Grant consumption decrements the grant and creates an `accept-edits` lease that is immediately approved inside the same database transaction. The lease can then remain approved until the final gate consumes it. Revoking only the grant therefore leaves previously derived, unconsumed authority alive. The current lease row records only `source: 'accept-edits'`; it does not carry a typed grant foreign key, although the grant ID is currently passed through the generic `decidedByDevice` field. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:26-44] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:378-432]

Add a dedicated nullable `authorityGrantId`/`grant_id` link to grant-derived leases. The revoke transaction must mark the grant `revoked` and mark all linked `pending` or `approved` leases `revoked` with reason `grant-revoked`. It must not abort a lease already `consumed` or an in-flight execution; stopping execution remains a separate operator action. The database transaction defines the race: revoke-first makes later consume fail; consume-first leaves the already-started action receipt intact. The response count lets the UI say `Revoked · 1 queued edit cancelled` without claiming that an executing edit was undone. Existing device revocation proves the stronger global drain pattern for pending, approved, grant, and in-flight authority, but a grant-level revoke should use the narrower cascade above. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:169-243] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/tests/authority-loop.test.ts:176-210]

## Questions Answered

- Q4 preset choice is answered for planning: `1 / 2 min`, `3 / 5 min` default, and `5 / 10 min`, with no free-form or 10-edit UI.
- Q4 at-a-glance status is answered: `Edit run active · N left · Xm`, host-time anchored, shared across Review, Session, and Attention.
- Q4 revoke protocol is answered: one-tap submit, `Revoking...` until host `200`, retain active state on ambiguous failure, and support safe retry.
- Q4 derived-authority behavior is answered: revoke linked pending/approved leases transactionally, but do not claim cancellation after final-gate consumption.

## Questions Remaining

- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error and usage prominence.
- Q6: Define foreground suppression, unread state, stale hints, and notification preference behavior.
- Implementation planning must choose a status refresh transport and retention window for recently terminal grant receipts; the required authority semantics do not depend on polling versus a sync event.
- Physical iPhone testing must validate the sheet copy, radio-card density, countdown legibility, and the proposed 3-edit / 5-minute default.
- Product-coverage caveat: Termius and Vercel or Netlify remain unvalidated as named comparators.

## Ruled-Out Directions

- `3 edits / 10 min` as the default was ruled out because it always uses the server's maximum duration.
- Independent count-duration selectors and free-form inputs were ruled out because they increase choice and allow odd high-authority combinations without adding a current requirement.
- Optimistic count decrement, expiry, or revoke status was ruled out because the host owns consumption and race ordering.
- Revoking all in-flight execution was ruled out for grant-level revoke because future-authority removal is not execution cancellation.
- Using Attention unread badges or push hints for active grants was ruled out because durable authority status is not an attention event.

## Assessment

- `newInfoRatio`: 0.61
- Novelty justification: iteration 7 established global visibility and host-confirmed revoke; this iteration adds concrete presets and copy, a server-time list response, exact revoke request/response semantics, and the missing derived-lease cascade rule.
- Confidence: high for current bounds, gaps, and race mechanics from source; medium-high for the UX preset recommendation pending physical-device validation.

## Next Focus

Q6 foreground authority and notification lifecycle: define suppression windows, server-owned unread and settled state, stale-hint behavior, badges, and privacy-safe notification defaults while preserving the separate active-authority utility section.
