# Iteration 8: Apps and computer — connectors, vault, MCP and worktrees

## Focus
Apps and computer: OpenBot's connectors and vault against MCP and Code Mode, and a bot's computer against skilled bots' worktree isolation. Third of the eight-part frame; the reducer had no open frontier node left, so this is a coverage-driven iteration.

## Actions Taken
- Read OpenBot's MCP and skills grant model, its action-policy ordering for MCP calls, and its app-access states.
- Read OpenBot's vault description and its credential-at-rest rules.
- Read the computer description and the personal edition's folder-access rules.
- Read skilled bots' worktree isolation, posture matrix and secret handling.
- Read the Code Mode skill's role for external MCP calls.

## Findings
1. OpenBot governs app access at the administrator level because apps reach external systems with stored credentials: an administrator adds and switches on every app, and a bot's owner may give an app to a bot they own only where an administrator opened it to owners. A grant always uses the asking person's own account, not the owner's. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:325-335]
2. Every MCP call checks the grant first, then evaluates the same action policy engine with MCP context, then audits the result. The policy engine is shared with ordinary actions, so an approval rule does not need a second implementation for MCP. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:341]
3. Connector credentials are stored through a credential vault and referenced by id, never inline in YAML; the encryption key must be a base64 32-byte value, and a vault read or decryption fault stops an OAuth client lookup without registering a replacement client. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:414] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:428]
4. The vault belongs to the person, not to a bot: it holds saved logins and keys, apps and the computer both draw on it, and neither keeps secrets of its own, so there is one place to look for a secret, change it or remove it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105-111]
5. OpenBot's computer is a browser, a command line and files that stay between tasks, plus folders on the person's own machine. It signs in with a login from the vault that fills the page without the bot reading it, and a step that needs the person (a passkey, a phone code) is taken over by the person and handed back. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:78-84]
6. A folder on the person's machine is read-only by default and the desktop asks before every edit or command in it; access ends when OpenBot stops, the desktop goes offline, or the person revokes it, and the token is minted on every Start. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:129-142]
7. Skilled bots' computer is a worktree: a bot declaring `isolation: worktree` edits in a tree of its own, so an unattended run never writes into the operator's working tree. The tree comes from sk-git's numbering script under a lock, sits outside the checkout and outside the Skilled tree, and links shared paths instead of installing them. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-21]
8. Worktree removal is conservative: links are recorded and unlinked as links, never followed, and a tree is removed only when it is clean (gitignored files included), still at its base commit and has no stash; anything else is kept and reported. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:23-30]
9. The posture matrix refuses before dispatch any isolation and sandbox pair the chosen executor kind cannot honor. A kind whose sandbox is only an approval or tool gate is admitted for a read-only posture alone; the native kind is never admitted because its child inherits the full parent environment. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14]
10. Secret handling is a literal scanner plus an environment allowlist: dispatch collects known secrets from the environment and the repository's dotenv files (minimum length eight), refuses a prompt that contains one, and filters the child environment to the keys the executor kind admits; a needs-you answer is checked the same way before storage. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:54-57] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:244-252]
11. Code Mode is the house path for external MCP tools: TypeScript execution with on-demand tool loading, used for every external MCP call rather than native tool calls. [SOURCE: .devin/skills/mcp-code-mode/SKILL.md:1-20]
12. Mapping and smallest change: apps map to MCP servers reached through Code Mode, but there is no grant table and no vault. The smallest change is one `bots vault` surface backed by the OS keychain (or an age-encrypted file), a per-bot allowlist of secret names, and a vault reference syntax in BOT.md; folder access is already a worktree plus a path allowlist, and the executor sandbox already provides the read-only posture. [INFERENCE: based on findings 1-11]

## Ruled Out
- Building an administrator grant table for apps. With one operator group and a file-defined bot, the bot's own secret allowlist is the grant.
- Copying OpenBot's browser computer (live screen, take-the-wheel, recorder). It is the largest surface in OpenBot and the least needed by a team whose bots work in repositories.
- Replacing the worktree with a container per bot. The worktree is cheaper, already audited, and the posture matrix already refuses unsafe combinations.

## Dead Ends
- Looking for a vault in skilled bots' runtime: secrets come from the process environment and dotenv files, with literal scanning, not from a store.
- Looking for an app catalogue in skilled bots: MCP servers are configured outside the bot runtime, in Code Mode's own configuration.

## Edge Cases
- Ambiguous input: "connectors" could mean OAuth apps (Google, Notion) or MCP servers. The evidence supports MCP as the mechanism and OAuth as a credential type; the smallest change covers both through the same allowlist.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md
- specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts
- .skilled/skills/system-skilled-bots/runtime/lib/posture.ts
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts
- .devin/skills/mcp-code-mode/SKILL.md

## Assessment
- New information ratio: 0.95
- Questions addressed: apps and computer (fifth of the nine additional questions)
- Questions answered: apps/connectors/vault and computer/worktree mapping

## Reflection
- What worked and why: the grant-then-policy-then-audit ordering in OpenBot is three words and maps directly onto skilled bots' missing piece, which is the grant. The worktree module's header comment supplied the security rationale without reading its implementation.
- What did not work and why: the vault appears in docs as a user-facing promise, not as a schema; the encryption rules in the architecture page are the only concrete contract.
- What I would do differently: read the Code Mode configuration file to see how MCP servers are registered, since that is where a per-bot allowlist would attach.

## Recommended Next Focus
Memory and skills mapping onto Skilled skills and the spec-kit: how a bot's learned skill becomes a reviewed SKILL.md and where a spec packet owns it.
