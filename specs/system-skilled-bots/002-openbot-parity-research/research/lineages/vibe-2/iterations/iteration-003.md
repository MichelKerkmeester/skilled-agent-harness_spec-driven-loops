# Iteration 3: Frontier node F-2-006 — how the connection registry authorizes an app

## Focus

Frontier node F-2-006 (depth 2, scope `OpenBot-main/api/openapi.yaml`, `OpenBot-main/app/src/components/connections`): how does OpenBot's app/connection registry authorize an app (OAuth client, account mode, refresh, scopes), and what would Skilled need to match it?

## Actions Taken

1. Read the apps collection endpoint and its description.
2. Read the account-mode switch, the OAuth-client endpoint and the app-setup endpoint.
3. Read the connect, confirm, recheck, disconnect-preview and authorizations endpoints.
4. Read the bot-grant permission surface.

## Findings

1. Apps are **per organization** and come from three sources: "the ones from OpenBot's catalogue, the ones added from the app directory, and servers added by their address." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5203]
2. Each app carries **the actions it offers and the bots that may use each one**, so the grant is per app action per bot, not per app. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5203]
3. Account mode is a **per-app switch** with two values: `personal` (each person's own account) or `shared` (one account OpenBot holds for everybody in the organization). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5556]
4. Switching to shared is **itself an approval change**: it "gives each Bot that uses the app an approval, the one in approvals or its default, and makes the app ask before every action that changes something." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5556]
5. The switch is **transactional**: "Every account the switch leaves behind is ended at the app's service first. Nothing changes unless all of them ended, and the problem's problems then names each account that didn't." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5556]
6. Connecting returns **one of three next steps**: `consent` answers the address of the app's own sign-in page, `form` answers the boxes an app that takes a key asks for, and `connected` means the account is already connected. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5892]
7. Coming back from a sign-in page **proves nothing**: `confirmConnection` asks the app whether the account is really connected and records its answer, "because a connection can be ended at the app itself." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5963]
8. A key connection is verified by **one safe read-only call, on demand**: "The call counts against the person's own limits at the app, so make it when the person asks, never on page load." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:6012]
9. Authorizations are **per action, in one answer**: authorized, waiting for the person's consent, waiting for an administrator to set something up, or unknown. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:6157]
10. An OAuth client is only needed for a **catalogue app whose vendor won't let OpenBot register one itself**; the client secret "is kept in the vault and never answered." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5626]

## Ruled Out

- Looking for a refresh-token endpoint: there is none. Refresh is implicit in the connection record plus `confirmConnection` and `recheck`, which re-ask the app rather than rotating a token the client holds.
- Treating the OAuth client as the normal path: it is the exception for vendors that refuse dynamic registration, so a parity build should not start there.

## Dead Ends

- `app/src/components/connections` is a UI surface over the same endpoints; it added no new contract facts beyond the three connect outcomes already in the API description.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: the app directory service is external (`AppDirectoryUnavailable` is a documented 503), so "how an app is discovered" is answered from the API contract, not from a directory implementation in this checkout.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5195-5320
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5546-5575
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5617-5640
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5728
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5882-5915
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5953-5970
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:6002-6020
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:6100-6175

## Assessment

- New information ratio: 0.95
- Questions addressed: How does OpenBot's app/connection registry authorize an app (OAuth client, account mode, refresh, scopes) and what would Skilled need to match it?
- Questions answered: How does OpenBot's app/connection registry authorize an app (OAuth client, account mode, refresh, scopes) and what would Skilled need to match it?

## Reflection

- What worked and why: reading the *write* endpoints (account-mode, oauth-client, connect) rather than the read ones. The write descriptions carry the invariants — transactional switch, approval granted on switch, secret never answered — that the read endpoints only imply.
- What did not work and why: searching for a refresh-token endpoint assumed a client-held token model; OpenBot re-asks the app instead, so there is nothing to rotate.
- What I would do differently: for a connection model, read `connect` first. Its three outcomes (`consent`, `form`, `connected`) are the whole state machine, and every other endpoint is a transition on it.

## Recommended Next Focus

How is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token), and what is the smallest equivalent for a small team?
