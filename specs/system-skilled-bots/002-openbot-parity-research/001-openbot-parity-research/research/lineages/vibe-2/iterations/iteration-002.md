# Iteration 2: Frontier node F-2-005 — how the vault stores and injects a secret

## Focus

Frontier node F-2-005 (depth 2, scope `OpenBot-main/app/src/components/vault`, `OpenBot-main/app/src/components/manage`, `OpenBot-main/api/openapi.yaml`): how does OpenBot's vault actually store and inject a secret — what is encrypted, what a bot can see, and when a person must approve a use?

## Actions Taken

1. Read the vault's Logins section component for what the list may show.
2. Read the OpenAPI credential endpoints and their permission descriptions.
3. Read the saved-login endpoints, including the "sign in with a saved login" operation.
4. Read the computer's secret-request path: `shared/computer-control.ts`, `shared/bot-prompt.ts`, `app/src/lib/computers/secret.ts`.

## Findings

1. A credential is **encrypted and write-only**: "Encrypt a secret and keep it in the organization's vault under one key: a kind, a provider and a key id. A key holds one live credential, so adding one for a key that already has one replaces it, and the one it replaces is revoked in the same write … The secret is write-only: no answer includes it, now or later." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:4416]
2. The list endpoint **cannot leak**: "A credential says what it is for and whether it is live, and never holds its secret: nothing in the API reads a secret back out." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:4375]
3. The vault is **per organization**, not per bot and not global: "Each organization has its own vault, and another organization's credentials are never listed." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:4375]
4. A saved login is **per person, per site**, and using it *is* the approval: "Sign in with one of the person's saved logins for exactly this site, which is the person's confirmation to use it this once. Refused while the password manager is off, and for a login saved for any other site." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:18104]
5. The saved-login list shows **site and username only**: "a password is write-only, and this list can delete one but never show it. A saved login is used only when you confirm it in a sign-in form." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/saved-logins.tsx:27]
6. Injection into a page is a **masked box, not a value**: the bot calls `computer_request_secret` with a field ref and a short label, a person types into a masked box that goes straight into the field, and "you never see it". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/bot-prompt.ts:125]
7. The bot is told the **outcome, never the value**, and only a typed value counts as an answer: "only `secretEnded` naming this request as supplied is an answer; anything else is said as nothing typed, with the reason the computer gave, and the Bot is told not to submit the form." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/computers/secret.ts:20]
8. The request must **not click the field first**, because a click on a password field is itself a credential typed on a website and hands that step to the person: "Do not click or type into the field first: the value goes into the field that ref names, and clicking a password field hands that step to the person instead." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:92]
9. Permissions are split so a reader sees **what exists but never a secret**: `credentials:read` is "Read which credentials the vault keeps … never a secret", and `saved-logins:read` is "Read which logins the signed-in person saved, never a password." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:21979]
10. The two stores have **different owners**: logins belong to the person in both editions, keys belong to the organization's admin in the team edition and to the person in the personal edition. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/vault-page.tsx:13]

## Ruled Out

- Looking for a client-side decryption path: every read endpoint returns metadata only, so there is nothing to decrypt in the app. The secret never leaves the server except into a page field.
- Treating "saved login" and "credential" as one store: they have different owners, different permissions and different use paths, so a parity build needs both or an explicit decision to ship one.

## Dead Ends

- `app/src/components/manage/credentials-page.tsx` is the admin view of the same credential list, not a second store; reading it added the noun split ("key" in the personal edition, "credential" in the team edition) and nothing else.

## Edge Cases

- Ambiguous input: none; the node's scope covered every source read.
- Contradictory evidence: none.
- Missing dependencies: the server-side encryption implementation is not in this checkout (the API description is the contract), so "what is encrypted" is answered from the contract, not from code. Recorded as a confidence limit rather than a gap.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:4367-4532
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:18104-18110
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:18285-18350
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:21979-22028
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/saved-logins.tsx:1-50
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/vault-page.tsx:10-60
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/computers/secret.ts:1-45
- specs/system-skilled-bots/context/OpenBot-main/shared/bot-prompt.ts:118-132
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:88-110

## Assessment

- New information ratio: 0.9
- Questions addressed: How does OpenBot's vault actually store and inject a secret: what is encrypted, what a bot can see, and when a person must approve a use?
- Questions answered: How does OpenBot's vault actually store and inject a secret: what is encrypted, what a bot can see, and when a person must approve a use?

## Reflection

- What worked and why: reading the OpenAPI *descriptions* rather than the schemas. OpenBot writes its operation descriptions in the same plain language as the frame document, and those sentences state the invariants ("write-only", "never a password", "the person's confirmation to use it this once") that a schema cannot express.
- What did not work and why: looking for a client-side decryption path assumed the app holds the secret; it never does, so the search was wasted.
- What I would do differently: for any primitive, read the permission list at the end of the OpenAPI file first. It is a one-screen summary of what each role may see, and it names the read/write split that the endpoints then confirm.

## Recommended Next Focus

What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?
