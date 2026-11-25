# Iteration 1: Frontier node F-1-004 — apps, secrets and a bot's computer

## Focus

Frontier node F-1-004 (depth 1, scope `OpenBot-main/api`, `OpenBot-main/docs/configuration.md`, `turnstone-main`, `OpenMausBot-main`, `rakazo-main`, `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts`): how do the reference repos connect a bot to apps and secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree isolation?

This iteration establishes the baseline for the whole node: what OpenBot's *Apps* and *Computer* primitives actually are in code, and what Skilled has today in the same two places. Later iterations take the sub-questions the evidence opened.

## Actions Taken

1. Read the eight-part frame and the vault section of `OpenBot-main/docs/how-openbot-works.md`.
2. Read the vault page and the admin credentials page to see the two stores behind one page.
3. Read `shared/computer-token.ts` and `shared/computer-control.ts` for the computer's identity and handoff model.
4. Read the OpenAPI surface for apps and connections.
5. Read Skilled's `definition.ts` posture block, `posture.ts`, `isolation.ts` and `dispatch.ts` secret guard, plus the `mcp-code-mode` skill.

## Findings

1. OpenBot's **app** is a connected account, not a plugin: the API describes connections as "a person's connections to apps: the accounts they signed in with so their Bots can act there for them, and an app's one shared account when an administrator connects it for everybody". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:63]
2. The **vault** is deliberately *not* one of the eight primitives. It "sits beside the eight, in your settings", holds saved logins and keys, and "a Bot never sees what is in it"; apps and the computer "both draw on the vault, and neither keeps secrets of its own". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105]
3. The vault page is **two stores behind one page**: logins are the private sign-in form's in both editions, keys are the personal edition's own, and the team edition keeps an admin's keys under Admin while a member stores none. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/vault-page.tsx:10]
4. OpenBot's **computer** is a per-identity container with a browser, a command line and files that persist between tasks, and it is keyed by `person:<id>` or `bot:<id>`; each computer gets its own `HMAC-SHA256(COMPUTER_TOKEN, label)` so a bot that reads its own computer's token can open that computer and no other. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:6]
5. The computer has a **human handoff** built in: a durable, request-scoped browser handoff with `waiting | taken | completed | cancelled | expired | interrupted`, and a secret request where a person types a value into the page and the bot never reads it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:1]
6. Skilled bots **declares** a posture but has no store behind it: `BOT.md` frontmatter accepts `isolation`, `sandbox` and `secrets` as three declared strings on a `Posture` block. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:52]
7. Of those three, only two are acted on. `posture.ts` resolves `sandbox` against the executor matrix and refuses a kind that cannot honor it; `secrets` is carried through the definition and never resolved to any store. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:99]
8. Skilled's only secret machinery is a **leak guard, not a vault**: `collectKnownSecrets` harvests env vars and `.env*` values that look like secrets, and `findSecretLiteral` refuses text that contains one before it reaches a prompt, a question/answer or a delivery message. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249]
9. Skilled's "computer" is a **git worktree, not a machine**: a bot that declares `isolation: worktree` edits in a tree of its own, placed outside the checkout, with the launcher's shared paths linked in; there is no browser, no persistent home and no command line beyond the executor's. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:5]
10. Skilled's app surface is **MCP through Code Mode**: external tools are reached by executing TypeScript against MCP servers with progressive tool loading, which gives tool access but no per-person connection record, no OAuth flow and no per-use approval. [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:1]

## Ruled Out

- Reading `OpenBot-main/docs/configuration.md` for the vault: the file is 130 KB of deployment configuration and contains no vault section, so the vault's shape had to come from the app components and the API instead.
- Treating `posture.secrets` as an existing feature: grepping the runtime for `secrets` returns only the definition field and the leak guard, so there is nothing to compare against yet.

## Dead Ends

- Searching for a `vault/` or `secret/` directory at the repo root of `OpenBot-main` returns nothing; the vault lives in `app/src/components/vault/` and `app/src/components/manage/`, and the server side is behind the API rather than a named module.

## Edge Cases

- Ambiguous input: the node's scope names `OpenBot-main/docs/configuration.md`, but the vault and computer material is not there. Selected interpretation: follow the evidence to `app/src/components/vault/`, `shared/computer-*.ts` and `api/openapi.yaml`, and record the scope mismatch here rather than skipping the question.
- Contradictory evidence: none found this iteration.
- Missing dependencies: none; every source read resolved.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:1-181
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:63
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/vault-page.tsx:1-60
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/manage/credentials-page.tsx:1-50
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1-50
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:1-70
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:1-107
- .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:1-110
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-70
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249-290
- .skilled/skills/mcp-code-mode/SKILL.md:1-45

## Assessment

- New information ratio: 1.0
- Questions addressed: How do the reference repos connect a bot to apps and secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree isolation?
- Questions answered: How do the reference repos connect a bot to apps and secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree isolation?

## Reflection

- What worked and why: starting from the frame document and then following each primitive into code gave a clean split between what OpenBot *says* a primitive is and what it *implements*. The vault's absence from the eight is the single most useful structural fact, because it means a parity build needs a ninth store that is not a bot part.
- What did not work and why: reading `docs/configuration.md` for the vault wasted a call; the file is deployment configuration, and the vault is an app surface plus an API resource.
- What I would do differently: go to `api/openapi.yaml` first for any primitive, because the OpenAPI descriptions are written in the same plain language as the frame document and name the resource paths directly.

## Recommended Next Focus

How does OpenBot's vault actually store and inject a secret — what is encrypted, what a bot can see, and when a person must approve a use — and what is the smallest equivalent store for skilled bots?
