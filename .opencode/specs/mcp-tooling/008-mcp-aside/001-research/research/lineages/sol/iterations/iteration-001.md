# Iteration 1: Standalone CLI, Installation, and Session Surface

## Focus

Establish whether the CLI-primary premise is real, then separate the high-level task CLI from the MCP server and deterministic REPL. The narrow interpretation for this pass is the public, documented command surface; undocumented flags and binary internals are deferred.

## Actions Taken

1. Read the lineage config, state log, and strategy before research.
2. Opened Aside's developer documentation and inspected the documentation index.
3. Inspected the official installation script without executing it.
4. Searched the public web for separate package/repository evidence and exact command references.

## Findings

1. Aside does ship a standalone `aside` executable. The official developer page explicitly distinguishes CLI, MCP, and REPL, and shows a task launched directly as `aside "Open localhost:3000 and run a smoke test"`. This confirms the CLI-primary premise at the product level. [SOURCE: https://docs.aside.com/help/developers]

2. The public CLI is primarily an agent-task interface, not a documented collection of low-level DOM/network subcommands. The direct invocation accepts a natural-language task; `--session <session-id>` continues an existing agent session. Phase 2 should not invent commands such as `aside navigate` or `aside screenshot` unless later evidence exposes them. [SOURCE: https://docs.aside.com/help/developers]

3. The documented top-level surface includes direct task invocation, `exec`, `account`, `mcp`, and `repl`. Account operations are `aside account list`, `aside account status [id]`, and `aside account use <id>`; `--account <id>` applies to both direct tasks and `aside exec`. [SOURCE: https://docs.aside.com/help/developers]

4. Installation is a signed-product-style app bundle delivery rather than an npm package. The installer downloads `AsideCLI-<darwin-platform>-<version>.zip`, installs `Aside CLI.app`, and links its executable to `~/.local/bin/aside` by default. The installer accepts `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, and `ASIDE_CLI_BIN_DIR`. [SOURCE: https://releases.aside.com/install.sh]

5. The official installer currently accepts only macOS arm64/aarch64 and x64. Linux and Windows are rejected by its platform switch, so a portable skill must gate availability and provide an MCP/unsupported-platform path rather than assuming `aside` can be bootstrapped everywhere. [SOURCE: https://releases.aside.com/install.sh]

6. `aside repl` is the documented deterministic automation escape hatch. The docs position it for direct page inspection, screenshots, downloads, and deterministic steps, with an example calling `openTab(...)`. This is likely the appropriate CLI-level low-level surface when a natural-language agent task is too opaque. [SOURCE: https://docs.aside.com/help/developers]

## Ruled Out

- npm/GitHub search as proof of an official Aside package: results were dominated by unrelated browser MCP projects and supplied no authoritative Aside package. The official installer is the stronger distribution source.
- Treating `aside mcp` as evidence that no standalone CLI exists: the same primary page documents direct task and REPL modes, so that interpretation is false.

## Dead Ends

- Exact `aside --help` output is not published on the indexed documentation page. Installing or reverse-engineering the binary is outside this research packet's non-goals; future authoring must limit itself to documented commands or add a runtime `--help` probe.

## Edge Cases

- Ambiguous input: “CLI command surface” could mean every internal flag or the supported public workflow. This iteration covers the public workflow and explicitly defers undocumented flags.
- Contradictory evidence: none in primary sources.
- Missing dependencies: no local Aside installation was assumed.
- Partial success: exact help text remains unavailable, but CLI existence and core commands are established.

## Sources Consulted

- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/llms.txt]
- [SOURCE: https://releases.aside.com/install.sh]
- [SOURCE: https://aside.com/]

## Assessment

- New information ratio: 1.00
- Questions addressed: Q1, with early evidence for Q2 and Q3
- Questions answered: Q1 at the supported public-surface level

## Reflection

- What worked and why: opening the primary page directly exposed commands that search indexing missed; inspecting the official installer resolved platform and filesystem behavior.
- What did not work and why: broad web search confused Aside with unrelated browser MCP products because “aside” is a weak product-name search token.
- What I would do differently: pivot directly to Aside's documentation index and changelog for product-specific follow-up queries.

## Recommended Next Focus

Q2 — Treat `aside mcp` as a local stdio server launched by the client, then verify its authentication dependency, browser/app lifecycle, transport behavior, configuration, and discoverable tool contract.

## Scope Violations

- The YAML's spec write-back, memory save, root reducer, graph upsert, and git staging steps were not executed because they would write outside the operator-authorized lineage root.
