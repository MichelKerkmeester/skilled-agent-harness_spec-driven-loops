# Iteration 11: Small-team roles for apps and secrets

## Focus

Broadening pass. Decision D3 fixes the use case as a small team, so this iteration asks the question the stores raise: **who may connect an app, who may approve a use, and is memory shared or per person** — and what is the smallest sign-in and roles model that works for a few people on one machine or a shared host.

## Actions Taken

1. Read `identity.ts`'s resolution order, its refusal and its key function.
2. Read OpenBot's `PersonRoleAnswer` and `AssignableRole` schemas.
3. Checked the `team-grants` component for what a grant row shows.

## Findings

1. Skilled bots has **no sign-in**: identity is `owner/name`, resolved from four sources in precedence order — the installed job's pinned environment variable, the checkout's `bots/config.json`, the environment, then the git origin remote. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:20]
2. The pinned value **outranks the config** for a stated reason: "a run with checkout write access could edit to move every lookup under another identity's empty folders". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:20]
3. A pinned value that is not `owner/name` is **refused rather than skipped**, "so a damaged job never falls back to the checkout". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:57]
4. Identity becomes a **filesystem key** through `encodeURIComponent(identity.toLowerCase())`, so every store is already per-identity by construction. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:102]
5. OpenBot has **three roles**: `owner`, `admin` and `member`. "An owner or an admin governs it: its people, its sign-in and its policy. A member uses it." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:23491]
6. The role list is **extensible and forward-compatible**: "a client reads a role it doesn't know as a member." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:23491]
7. Only `admin` and `member` are **assignable**; `owner` is not in `AssignableRole`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:23505]
8. So the smallest roles model for a small team is **two roles, not three**: the person who owns the machine — implicit, because they own the checkout — and everyone else. [INFERENCE: from findings 5 and 7 — `owner` is not assignable in OpenBot either, so it is a property of the deployment rather than a grant]
9. **Every store is already shared, not per-person**, because identity is the *repository* rather than the person: everyone who runs a bot in one checkout resolves the same identity and therefore the same secret store, connector grants and run folders. Per-person memory would need a new key beside `identityKey`. [INFERENCE: from finding 4]
10. The smallest sign-in is **none**: the checkout's remote is the identity, and a shared host is one Unix user. Adding a sign-in would put a second identity system beside the one every path already uses. [INFERENCE: from findings 1, 3 and 4]

## The smallest model

| Question | Answer | Why |
| --- | --- | --- |
| Who may connect an app? | whoever can edit `BOT.md` and run `bots secret set` — i.e. whoever has the checkout | there is no second authority to check against |
| Who may approve a use? | whoever answers the needs-you item | the item is a file under the state root, so the filesystem is the permission |
| Shared or per-person secrets? | shared per identity (the repository) | `identityKey` is the repository, not the person |
| Shared or per-person memory? | shared, and it does not exist yet | same reason, and memory is the one part with no coupling |
| Sign-in? | none | the git remote is the identity |
| Roles? | two: the machine's owner, and everyone else | OpenBot's `owner` is not assignable either |

**The one thing a small team does need** is a way to tell *which person* answered an item or set a secret, because a shared identity erases that. The smallest form is a `by:` field on the needs-you answer and on the secret record, filled from the OS user or an explicit `--as` flag — one string, no accounts.

## Ruled Out

- A sign-in system: it would be a second identity beside the one every path already uses, and the first thing it would have to do is agree with `identityKey`.
- Three roles: OpenBot's own `owner` is not assignable, so a small team's two roles are the same shape with the deployment owner implicit.
- Per-person secret stores: they would break the shared-account case, which is the common case for a small team and is OpenBot's own `shared` account mode.

## Dead Ends

- Looking for a per-person key in the state root: there is none. `identityStatePaths` keys by identity only, and `retired` records identities rather than people.

## Edge Cases

- Ambiguous input: "roles" could mean product roles or filesystem permissions. Selected interpretation: product roles, with the filesystem noted as the thing that actually enforces them today.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:20-120
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:23491-23510
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/team-grants/team-grants-row.tsx

## Assessment

- New information ratio: 0.8
- Questions addressed: who connects, who approves, shared versus per-person, the smallest sign-in and roles model
- Questions answered: who connects, who approves, shared versus per-person, the smallest sign-in and roles model

## Reflection

- What worked and why: reading `identity.ts` before designing roles. The product has no sign-in because it has an identity, and the identity is the repository — that single fact answers four of the six questions at once.
- What did not work and why: expecting OpenBot's three roles to map onto three skilled-bots roles. `owner` is not assignable in OpenBot either, so it is a deployment property, and a small team's deployment has exactly one owner by construction.
- What I would do differently: ask "what is the identity" before "what are the roles". Every roles model is a decoration on an identity, and this product's identity is already load-bearing in every path.

## Recommended Next Focus

Reuse: the exact files and licences to lift for the apps and secrets slice, with the repo, path and licence for each, and what has to be rewritten rather than copied because the host language or the storage differs.
