# Iteration 004: Devin MCP namespace normalization

## Focus

Determine whether Devin converts hyphenated MCP server IDs to underscore-separated tool namespaces, and whether deny rules must use the converted spelling.

## Actions Taken

- Re-read the prior namespace investigation, the research strategy, the findings registry, and the current repository MCP registrations.
- Re-checked Devin's official [MCP overview](https://docs.devin.ai/cli/extensibility/mcp/overview) and [MCP configuration reference](https://docs.devin.ai/cli/extensibility/mcp/configuration), including server-name examples and permission matcher patterns.
- Inspected the installed Devin CLI `3000.2.17 (2c489dfc)` help for `mcp add`, `mcp get`, and `mcp list`. The help exposes `<NAME>` as an unconstrained server-name argument but documents no normalization rule.
- Re-read the repository registrations and MCP entrypoints. The repository uses mixed server IDs (`mk-spec-memory`, `mk_skill_advisor`, and `mk_code_index`) and all three relevant local MCP servers use stdio transport.
- Did not rerun `devin mcp list`: the previous live probe already established that this shell's CLI invocation aborts during rolling-log initialization before configuration or tool discovery. No target files were modified.

## Findings

### 1. Devin documents the namespace shape, not a normalization algorithm

The official overview says MCP tools appear as `mcp__<server>__<tool>` and gives examples such as `mcp__github__create_issue`. The configuration reference accepts hyphenated server keys such as `server-name`, `my-server`, and `my-tools`, while its permission examples only show the generic `mcp__server__tool` pattern. Neither page states that hyphens are converted to underscores, rejected, or preserved.

Therefore hyphen-to-underscore normalization remains UNKNOWN. The underscore spellings used in earlier policy drafts are not confirmed Devin behavior.

### 2. The installed CLI does not expose a stronger name contract

`devin mcp add --help` describes the server identifier only as `<NAME>` and offers no character restrictions or transformed-name output. The binary contains the generic `mcp__` matcher vocabulary, but that is evidence of namespaced matching, not evidence of a hyphen conversion step.

This narrows the gap but does not resolve it. A clean Devin session must still be the source of truth for the emitted tool names.

### 3. The repository's current IDs do not answer the Devin question

`opencode.json:18-85` registers `mk-spec-memory`, `mk_skill_advisor`, and `mk_code_index`; these are host-specific IDs, not proof that a future Devin configuration must reuse them. The server implementations expose stdio MCP transports in `context-server.ts:16,1785,2553`, `advisor-server.ts:10,169,311`, and `system-code-graph/mcp-server/index.ts:15,136`, so Devin can launch them through its documented stdio shape, but the host-side namespace is still chosen by the Devin registration name.

### 4. Deny rules must be generated from the emitted spelling

Devin's documented permission patterns distinguish a specific tool (`mcp__server__tool`) from all tools on a server (`mcp__server__*`) and all MCP tools (`mcp__*`). The safe interpretation is exact string matching against the namespace Devin emits; there is no documented aliasing between `-` and `_`.

For the validation phase, do not pre-approve a guessed underscore namespace. Register the intended server IDs, capture the names from a successful `tools/list` discovery, and then generate exact read-only allows and mutation denies from those names. If a temporary deny safety net is needed before discovery, both candidate spellings can be denied, but broad server-wide allows should remain absent until the spelling is proven.

## Questions Answered

- **Does Devin's documentation confirm hyphen-to-underscore normalization?** No. It documents the `mcp__<server>__<tool>` shape and accepts hyphenated server-name examples, but specifies no normalization.
- **Do deny rules match the normalized form?** They match the namespaced tool string used by the permission matcher; which server spelling Devin emits remains unverified.
- **Does the installed CLI expose a hidden name restriction through help?** No. `mcp add --help` exposes `<NAME>` without a character or normalization contract.

## Questions Remaining

- Does a clean Linux Devin session preserve hyphens, normalize them to underscores, or reject one of the candidate IDs?
- Does a project-level deny remain effective when a session-level server-wide allow is granted?
- Does Devin invoke all three relative launcher commands from the repository root in a clean session?
- Which embedding tier and network allowlist are reliable on Devin's first cold start?

## Next Focus

Run the clean-session verification matrix: register one harmless instance of each intended server ID, capture the exact `tools/list` namespace, test read-only discovery, and prove mutation denies against the emitted names.

