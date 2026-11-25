# Iteration 12: The small-team model

## Focus
The small-team model: who can talk to, approve for and change a bot, whether memory is shared or per-person, and the smallest sign-in and roles model that works for a few people on one machine or a shared host.

## Actions Taken
1. Read OpenBot's `PersonRole` and `PersonRoleAnswer` schemas and their descriptions.
2. Read the organization model: the shared `default` organization and the not-a-member answer.
3. Read the single-person install rules for sign-in, OAuth and API keys.
4. Read the OAuth client list for the CLI client.
5. Re-read the runtime's state root, folder mode and identity key to see what a second person would hit.

## Findings
1. OpenBot's role model has three values, `owner | admin | member`: "An owner or an admin governs it: its people, its sign-in and its policy. A member uses it. The owner is whoever created the organization; `default` has admins and no owner." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:893]
2. The role answer is extensible, and "a client reads a role it doesn't know as a member". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:901]
3. A self-hosted install puts everybody who signs in into one shared organization, `default`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:29]
4. An organization the caller is not in "answers exactly as one that does not exist, `default` included". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:37]
5. A single-person install has no sign-in at all: "It signs nobody in, so it has neither OAuth nor API keys, and the operations that manage keys and sessions answer 503 with the code SIGN_IN_UNAVAILABLE." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:57]
6. It also has no OAuth, "because there is nobody to authorize an app as". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:589]
7. API keys act as the person who made them, start `obk_`, and only a person signed in to the web app can make or delete one. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:42]
8. There is an `openbot-cli` OAuth public client beside the desktop and mobile ones, using PKCE S256 with a loopback redirect only. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:534]
9. Skilled has no sign-in, no roles and no organization: state is keyed by repository identity `owner/name`, and the only identity dimension is the checkout. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:118]
10. The state root is per-OS-user by default (`$HOME/.local/state`), so on a shared host each person gets their own state root and therefore their own memory and their own needs-you items. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102]
11. Every state folder is created mode `0o700`, so a state root shared between two people would be unreadable by the second one. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46]
12. `bots answer` has no role check, so whoever can run the CLI can approve. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:73]
13. The smallest model is OpenBot's single-person install: no sign-in, no OAuth, no API keys, and the OS user is the identity. [INFERENCE: based on findings 5, 6 and 9]
14. Two roles suffice, not three: `owner` for whoever installed the jobs, and `member` for everyone else. `admin` exists in OpenBot to govern people, sign-in and policy, and a machine with no sign-in has none of those to govern. [INFERENCE: based on findings 1, 5 and 13]
15. The role should be a file, not a session: one `operators.json` under the state root listing who may approve, read by `bots answer` before it writes. [INFERENCE: based on findings 9 and 12]
16. Shared versus per-person memory is a state-root choice, not a code change: a per-user root gives per-person memory and a shared root gives shared memory. [INFERENCE: based on findings 10 and 11]
17. The one change a shared host needs is the folder mode: `0o700` becomes `0o770` with a group, so a second person can read the shared root. [INFERENCE: based on finding 11]
18. So the smallest sign-in and roles model for a few people is three decisions and no new service: no sign-in, two roles in one file, and a state root that is either per-user or shared by group. [INFERENCE: based on findings 13 through 17]

## Ruled Out
- Building sign-in. OpenBot's own single-person install has none, and a few people on one machine already have an OS identity that a session would only duplicate.
- Three roles. `admin` governs people, sign-in and policy; with no sign-in there is nothing for it to govern, so it collapses into `owner`.
- A session token or cookie. The state root's owner and mode already decide who can read and write, and a token would be a second authority that can disagree with the filesystem.
- Per-bot memory ownership. OpenBot scopes memory to the person and the organization, and a per-bot store would make a person's facts disappear when the bot is renamed.

## Dead Ends
- Looking for a role or permission check anywhere in the runtime. There is none: `bots answer` writes the answer after a secret check and nothing else.

## Edge Cases
- Ambiguous input: none. The node names the three questions.
- Contradictory evidence: none. OpenBot's three roles and its no-sign-in single-person install are two modes of one model, not a conflict.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:28-62
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:517-600
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:893-908
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:118
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:73

## Assessment
- New information ratio: 0.83
- Questions addressed: Who can talk to, approve for and change a bot; is memory shared or per-person; what is the smallest sign-in and roles model for a few people on one machine or a shared host?
- Questions answered: Who can talk to, approve for and change a bot; is memory shared or per-person; what is the smallest sign-in and roles model for a few people on one machine or a shared host?

## Reflection
- What worked and why: reading OpenBot's single-person install rules before its role model. They show that the largest product in the set ships a no-sign-in mode as a first-class case, which turns the small-team question from "what auth do we build" into "which of OpenBot's two modes do we already match".
- What did not work and why: looking for a permission check in the runtime. There is none, so the roles model has to be added at one call site rather than extended from an existing gate.
- What I would do differently: read the folder mode first. `0o700` is the single line that decides whether a shared host works at all, and it is easier to find than the role descriptions.

## Recommended Next Focus
The skip list and the reuse inventory: which enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts to leave out with a reason each, and which code is liftable with repo, path and license.
