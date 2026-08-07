# Iteration 001: Devin CLI MCP host surface

## Focus

Confirm Devin CLI's current MCP commands, configuration schema, transport modes, and configuration scopes from the official CLI documentation, then compare that contract with the three local MCP servers shipped by this repository.

## Actions Taken

- Read the research state, strategy, configuration, findings registry, parent scope, Phase 001 contract summary, and the archived deprecation context.
- Fetched the current official [MCP overview](https://docs.devin.ai/cli/extensibility/mcp/overview) and [MCP configuration](https://docs.devin.ai/cli/extensibility/mcp/configuration) pages, plus the current [CLI configuration](https://docs.devin.ai/cli/extensibility/configuration) reference.
- Verified the installed binary with `devin --version` and inspected `devin mcp --help`, `devin mcp add --help`, and the current user config.
- Inspected `opencode.json`, the three checked-in launchers, and each MCP server entrypoint and package manifest. No implementation or researched-surface files were modified.

## Findings

### 1. Devin has the required MCP host surface

The official CLI contract is concrete, not a marketplace-only abstraction:

| Area | Confirmed Devin contract | Evidence |
|---|---|---|
| Add | `devin mcp add <name> -- <command> [args...]` for stdio; URL or `--url` for HTTP | Official MCP configuration, “Via Command Line” |
| Inspect/manage | `list`, `get`, `remove`, `login`, `logout`, `enable`, `disable` | Official MCP configuration; live `devin mcp --help` |
| Stdio schema | `command`, optional `args`, optional `env`, optional `disabled` | Official MCP configuration, “Local Command (stdio)” |
| HTTP schema | `url`, optional `transport: http|sse`, `headers`, OAuth fields, optional `disabled` | Official MCP configuration, “Remote Server” |
| Scope | Local default: `.devin/config.local.json`; project: `.devin/config.json`; user: `~/.config/devin/config.json` | Official MCP configuration, `--scope`; Phase 001 summary |
| Transport inference | URL implies HTTP; trailing command arguments or `--command` imply stdio | Official MCP configuration and live `devin mcp add --help` |
| Permissions | MCP tools use namespaced matchers such as `mcp__server__tool` | Official MCP overview/configuration |
| OAuth | `mcp login/logout` is for remote OAuth servers; each MCP client keeps its own OAuth session | Official MCP overview/configuration |

Devin's current CLI version is `3000.2.17 (2c489dfc)`, matching Phase 001. The installed user config already contains a `mcpServers` entry for `sequential_thinking`, proving the expected JSON shape is active locally. The project has no `.devin` directory yet.

One live check was environment-limited: `devin mcp list` panicked while creating its rolling log file with `PermissionDenied` in this managed shell. That is a local logging-permission failure, not evidence that the MCP command is absent; the binary's help surface and current user config remain readable.

### 2. All three repository servers are stdio-only at the MCP boundary

| Server | Transport evidence | Runtime and state requirements |
|---|---|---|
| `mk-spec-memory` | `context-server.ts:16,2553-2554` imports and connects `StdioServerTransport`; no HTTP/SSE server transport exists in the package source | Node `>=20.11.0`; SQLite/native dependencies; repo-local DB; optional embeddings cascade. Launcher builds `dist/context-server.js` and spawns it with repo root as `cwd` (`mk-spec-memory-launcher.cjs:1228-1230,1518-1528`). |
| `mk_code_index` | `index.ts:15,136-139` uses `StdioServerTransport`; the secondary Unix/TCP bridge also wraps connections in stdio transports | Node/npm; TypeScript build; SQLite and tree-sitter/WASM dependencies; repo-local graph DB. Launcher builds on demand and spawns with repo root as `cwd` (`mk-code-index-launcher.cjs:1357-1361,1611-1615`). |
| `mk_skill_advisor` | `advisor-server.ts:10,311-312` uses `StdioServerTransport`; caller context is explicitly tagged `transport: 'stdio'` at `:221-229` | Node/npm; package-local SQLite; the sibling `system-spec-kit/shared` package; startup scan/watcher; optional shared embedder. Launcher builds the package and starts it with repo root as `cwd` (`mk-skill-advisor-launcher.cjs:1173-1176,1275-1280`). |

The checked-in runtime registration confirms the intended command mapping: `node .opencode/bin/mk-spec-memory-launcher.cjs`, `node .opencode/bin/mk-code-index-launcher.cjs`, and `node .opencode/bin/mk-skill-advisor-launcher.cjs` (`opencode.json:18-23,47-52,69-74`). The Devin translation is therefore a field rename from OpenCode's `environment` to Devin's `env`; no HTTP wrapper or remote endpoint is required.

### 3. Protocol match is strong; four operational gaps remain

The Devin stdio schema can represent the three launch commands and their environment variables directly. A project-level configuration can safely commit non-secret runtime settings, while `.devin/config.local.json` is the correct place for personal embedding or reformulation keys. A minimal project config would use the three launcher commands and the operational values already present in `opencode.json`; `_NOTE_*` documentation keys should not be copied into the process environment.

The gaps are operational rather than protocol-level:

1. **Working-directory assumption (P1).** Devin's MCP config has no `cwd` field. The install guides list the repository root as a prerequisite (`system-code-graph/INSTALL-GUIDE.md:70-77`, `system-skill-advisor/INSTALL-GUIDE.md:48-55`), and the launcher commands are relative paths. The launchers themselves force their child server to the repository root, but Devin must still invoke `node .opencode/bin/...` from the checked-out repository root. A phase must smoke-test this in a real Devin project session and document the root requirement.
2. **Cold bootstrap and native modules (P1).** The launchers may run `npm install`/`npm ci` and TypeScript builds on first start. `better-sqlite3`, `sqlite-vec`, and tree-sitter/WASM dependencies must build or resolve on Devin's Linux environment. This is feasible but unverified here; a prebuilt artifact assumption would be unsafe.
3. **Memory embeddings/network (P1).** `mk-spec-memory` defaults to a local-first cascade: Ollama, supervised hf-local, then OpenAI or Voyage (`mcp-server/README.md:41-52`; `INSTALL-GUIDE.md:103-114`). A Devin environment may not have Ollama. The hf-local fallback can download a roughly 250–600 MB model on first use (`INSTALL-GUIDE.md:105-112`), and cloud tiers require `OPENAI_API_KEY` or `VOYAGE_API_KEY`. The new phase must choose and verify a Devin-compatible embedding tier, including network allowlisting and cache behavior.
4. **Advisor trust boundary (P1).** The checked-in registration sets `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` (`opencode.json:56-65`), which allows transport-absent callers to use advisor mutation tools. Devin's stdio client will fit that transport, but the phase must explicitly test whether Devin permissions and the server's trust default should remain shared with OpenCode or be tightened for Devin. MCP permission matchers can allow/deny/ask by tool namespace, but they do not replace the server-side trust decision.

Authentication is otherwise a match: the three servers do not require Devin OAuth or `devin mcp login`. Optional memory-provider credentials are ordinary server environment variables, not MCP-host authentication. The Devin CLI's HTTP/SSE OAuth machinery is irrelevant unless a future phase exposes these servers remotely.

### 4. Scope recommendation

Bringing Devin-as-MCP-host into the revival is worthwhile as an additive integration, but it should remain out of the core executor and hook phases. The surface is real, the protocol fit is direct, and it would give Devin access to the repository's memory, code-graph, and advisor tools. It is not yet safe to advertise as turnkey because the Linux cold-start, embedding, root-directory, and advisor-trust paths are unverified.

Recommended phase: `008-devin-mcp-host-integration`, after the current revival phases establish the Devin packet and manual-testing conventions. It should cover:

- `.devin/config.json` project-level entries for all three launchers, with `.devin/config.local.json` guidance for secrets and optional provider overrides.
- A clean Devin-session smoke test for `devin mcp add/list/get/remove/enable/disable`, tool discovery, and at least one read-only call per server.
- Linux/Node `>=20.11.0` dependency bootstrap, native module loading, database path containment, and cold-start timing/evidence.
- A deliberate embedding profile: local Ollama, hf-local, or an explicitly configured cloud provider; no silent dependency on a developer laptop daemon.
- Permission tests for `mcp__mk_spec_memory__*`, `mcp__mk_code_index__*`, and `mcp__mk_skill_advisor__*`, including advisor mutation denial/approval behavior.
- A manual rollback path: disable or remove the three project entries without deleting repository databases or source files.

## Questions Answered

- **Real Devin CLI MCP surface:** answered. The command set, config schema, transport inference, scopes, and OAuth boundary are confirmed.
- **Three server requirements:** answered at the boundary level. All three are stdio-only; their local dependencies, environment, databases, and root assumptions are identified.
- **Surface fit and gaps:** answered. Devin directly matches the stdio command/env contract; the remaining gaps are bootstrap, working directory, embedding/network, and advisor trust.
- **Worthwhile and phase shape:** answered provisionally. It is worth a separate integration phase, but it should not block restoration of the core `cli-devin` executor or hook adapter.

## Questions Remaining

- Has a clean Devin Linux session successfully bootstrapped all three launchers and completed MCP `tools/list` discovery?
- Which embedding tier is reliable and acceptable in Devin's sandbox, especially on first start without Ollama?
- Does Devin invoke project-scoped relative commands from the repository root in all supported session modes?
- What is the least-privilege Devin permission/trust policy for advisor mutation tools and memory writes?
- Can the live `devin mcp list/get/enable/disable` commands be exercised outside this shell's rolling-log permission failure?

## Next Focus

Iteration 2 should audit the exact launcher bootstrap and environment-forwarding paths, then define a non-destructive live verification matrix for project-scoped Devin MCP registration, tool discovery, embedding readiness, and advisor trust/permission behavior. Do not implement the `.devin` configuration until that matrix is accepted by the parent packet.
