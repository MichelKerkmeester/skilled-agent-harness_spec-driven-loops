# Iteration 003: Devin MCP namespace spelling

## Focus

Determine whether Devin converts hyphenated MCP server IDs to underscore-separated tool namespaces, and whether permission deny rules must use the converted spelling.

## Actions Taken

- Read the prior iteration, strategy, registry, current OpenCode MCP registrations, and the Phase 001 Devin contract evidence.
- Re-checked the current official [MCP overview](https://docs.devin.ai/cli/extensibility/mcp/overview) and [MCP configuration](https://docs.devin.ai/cli/extensibility/mcp/configuration) pages, focusing on server-name syntax and permission matcher semantics.
- Verified the installed Devin CLI reports `3000.2.17 (2c489dfc)` and exposes `mcp add/list/get/remove/login/logout/enable/disable`.
- Attempted the live `devin mcp list` check. It failed before reading configuration because the CLI could not create its rolling log file in the current shell environment. No target source or configuration files were modified.

## Findings

### 1. Devin's published contract does not state hyphen-to-underscore normalization

The official overview defines MCP tool names as `mcp__<server>__<tool>` and shows permissions such as `mcp__github__*`. The configuration reference uses hyphenated server keys (`server-name`, `my-server`) and hyphenated command arguments (`devin mcp get <name>`, `devin mcp disable <name>`), but never says that the server component is normalized before entering the namespace.

That leaves the transformation rule UNKNOWN. The prior iteration's underscore spellings (`mcp__mk_spec_memory__*`, `mcp__mk_code_index__*`, and `mcp__mk_skill_advisor__*`) are not confirmed Devin behavior; they were a portability assumption based on other MCP hosts.

Evidence: [MCP Overview, Permission Control](https://docs.devin.ai/cli/extensibility/mcp/overview#permission-control) and [MCP Configuration, MCP Permissions](https://docs.devin.ai/cli/extensibility/mcp/configuration#mcp-permissions).

### 2. Permission matching is exact against the emitted tool name

Devin documents three matcher shapes: `mcp__server__tool`, `mcp__server__*`, and `mcp__*`. Therefore a deny written with a hyphenated server component cannot be assumed to match an underscore component, or vice versa. The safe policy is to capture the actual names from a clean Devin `tools/list`/MCP-tool listing and generate exact allow/deny rules from that output.

For the validation window, high-impact deny rules may conservatively include both candidate spellings. Any broad allow rule must remain absent: an inactive deny spelling is harmless under default prompting, while a guessed allow spelling can create a false sense of coverage.

### 3. The repository does not currently provide Devin evidence that resolves the ambiguity

The checked-in OpenCode registration uses mixed identifiers: `mk-spec-memory`, `mk_skill_advisor`, and `mk_code_index` (`opencode.json`). A future Devin configuration that chooses three hyphenated IDs would therefore be a new host-side naming decision, not a direct copy of the current OpenCode keys. The Devin CLI help confirms the MCP command surface, but `devin mcp list` cannot run in this environment because the binary aborts while initializing its rolling logger.

The result is a bounded research gap, not evidence of a Devin defect. A clean Linux Devin session must register the intended IDs, obtain the server tool list, and test one harmless read-only call plus a denied mutation against the exact emitted namespace.

## Questions Answered

- **Does Devin's documentation confirm hyphen-to-underscore normalization?** No. It documents the namespace shape but not a normalization step.
- **Do deny rules match the normalized form?** They match the exact namespaced string supplied to the permission matcher. Which server spelling is emitted remains unverified.
- **Can the current shell verify the live names?** No. `devin --version` and `devin mcp --help` work, but `devin mcp list` aborts on rolling-log initialization before discovery.

## Questions Remaining

- Does a clean Devin Linux session preserve hyphens, normalize them to underscores, or reject one of the candidate server IDs?
- Does a project-level deny remain effective when a session-level server-wide allow is granted?
- Does Devin invoke all three relative launcher commands from the repository root?
- Which embedding tier and network allowlist are reliable on Devin's first cold start?

## Next Focus

Run the clean-session verification matrix with the intended server IDs: capture the exact namespaced `tools/list` output, test read-only discovery, and prove that mutation denies use the emitted spelling and survive any broader server-level grant.
