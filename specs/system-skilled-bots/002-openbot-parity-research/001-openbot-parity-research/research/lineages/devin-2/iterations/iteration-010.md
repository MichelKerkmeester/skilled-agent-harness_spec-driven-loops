# Iteration 10: Apps and computer — connectors, vault and worktrees

## Focus

Apps and computer: how OpenBot's connectors and secret vault compare with MCP and Code Mode, and how a Bot's computer compares with the existing worktree isolation.

## Actions Taken

1. Read OpenBot's app, computer and vault sections in the eight-part overview.
2. Read the Composio connector document for the brokered-account model.
3. Read the skilled-bots posture fields and the secret-literal check.
4. Read the worktree isolation module.
5. Surveyed the provider-neutral adapter tree in Rakazo.

## Findings

1. OpenBot connects an app once on the Connections page; the Bot never sees the sign-in, and a service that takes a key gets it from the vault. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:72-76]
2. OpenBot's computer is a browser, a command line and files that persist between tasks; it signs in with a vault login that fills the page without the Bot reading it, a page that needs the person is handed over, and folders on the person's machine can be part of the computer. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:78-84]
3. OpenBot's vault holds saved logins and keys, a Bot never sees what is in it, apps and the computer both draw on it, and the secret stays out of the conversation and out of memory. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105-112]
4. OpenBot's connectors are per-person and brokered: Composio holds the accounts, an administrator enables an app and grants actions to a Bot, each person connects their own account, and a Bot reaches the app as the person asking. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/plugins/composio.md:1-20]
5. Skilled bots has posture fields for isolation, sandbox and secrets, but no connector registry and no vault; its secret check only prevents a known secret literal from entering the prompt. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:55-57] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:94-108] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249-295]
6. Worktree isolation already gives a Bot its own tree and branch, placed outside the checkout, linked to shared paths, and removed only when clean and at its base commit; it is the closest existing analogue to OpenBot's per-Bot computer. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-16]
7. Rakazo keeps a provider-neutral adapter tree with separate approvals, computers, email, integrations, MCP, memory and messaging folders, under Apache-2.0, which is a useful boundary reference for a connector registry. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/adapters/src/index.ts:1]
8. The smallest apps change is an `apps` registry in `bots/config.json` mapping a name to an MCP command or URL, plus an `apps: [name]` list in BOT.md passed to the executor as MCP servers; Code Mode already orchestrates MCP tools, so no new tool runtime is needed. Size M, risk medium because a connector can widen a Bot's reach. [INFERENCE: based on findings 1, 4 and 5]
9. The smallest vault change is a 0600 file under the user state root holding name-to-secret entries, referenced by name from BOT.md's existing `secrets` field; the runner injects only the named values into the child environment and keeps the literal check. Size S, risk low because the file never enters the prompt or the checkout. [INFERENCE: based on findings 3 and 5]
10. The smallest computer change is to expose the existing worktree path and branch in run records and `bots status`; the isolation and cleanup rules already exist, so no new computer implementation is needed for parity of the information a person needs. Size S, risk low. [INFERENCE: based on finding 6]

## Ruled Out

- Building a browser-driving computer from scratch: OpenBot's browser and handover are a large surface, and the worktree already gives a Bot a real command line and files.
- Copying Composio's broker: it is a hosted account broker with hundreds of apps, far beyond a small team's connector needs; MCP servers cover the same ground with less machinery.
- Putting secrets in BOT.md or the prompt: the existing secret-literal check exists precisely to keep them out.

## Dead Ends

- Searching BOT.md for an apps or vault key found none; the definition has posture fields but no connector surface.
- Treating the worktree as a full computer would overstate parity: it has files and commands, not a browser or a vault-filled login.

## Edge Cases

- Ambiguous input: none. The apps and computer pairing is named in the topic.
- Contradictory evidence: none. OpenBot's vault and skilled bots' secret check both aim to keep secrets out of the model, at different layers.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:72-84
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105-112
- specs/system-skilled-bots/context/OpenBot-main/docs/plugins/composio.md:1-20
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:55-57
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:94-108
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249-295
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-16
- specs/system-skilled-bots/context/rakazo-main/packages/adapters/src/index.ts:1

## Assessment

- New information ratio: 0.9
- Questions addressed: apps and computer (topic question 5)
- Questions answered: none tracked as a frontier question; this iteration broadens beyond the dealt frontier

## Reflection

- What worked and why: Reading the existing posture and worktree modules first showed that the computer half is mostly present, so the recommendation narrowed to exposing it rather than building it.
- What did not work and why: Searching BOT.md for an apps or vault key found none, which is the connector gap rather than an oversight.
- What I would do differently: Read the Composio document after the MCP/Code Mode surface, so the broker's cost is compared against the smaller option before it is described.

## Recommended Next Focus

The small-team model: who can talk to, approve for and change a Bot, shared versus per-person memory, and the smallest sign-in and roles model for a few people on one machine or a shared host.
