# Iteration 005: Devin MCP launcher working-directory feasibility

## Focus

Determine whether Devin invokes all three repository MCP launcher commands from the repository root in a clean session.

## Actions Taken

- Read the Phase 001 Devin contract evidence, the research strategy, the parent scope/open-question record, the current `opencode.json`, and all three launcher entrypoints.
- Verified the installed Devin CLI (`3000.2.17 (2c489dfc)`) with `devin version`, `devin mcp --help`, and `devin mcp add --help`.
- Re-fetched the current official Devin MCP overview and configuration references, including the stdio schema, project scope, lifecycle commands, and permission matcher syntax.
- Traced root and child-process working-directory resolution in `mk-spec-memory-launcher.cjs`, `mk-code-index-launcher.cjs`, and `mk-skill-advisor-launcher.cjs` without executing a bootstrap that could mutate runtime databases or install dependencies.
- No researched source files or implementation files were modified.

## Findings

### 1. Devin supports the required transport and lifecycle, but exposes no MCP working-directory field

Devin's current MCP configuration supports local stdio servers with `command`, `args`, `env`, and `disabled`; the CLI form is `devin mcp add <name> -- <command> [args...]`. The documented lifecycle is `add`, `list`, `get`, `remove`, `login`, `logout`, `enable`, and `disable`. The configuration reference does not define `cwd` or another per-server working-directory property. Evidence: [MCP Configuration](https://docs.devin.ai/cli/extensibility/mcp/configuration) and [Configuration File](https://docs.devin.ai/cli/reference/configuration/config-file).

### 2. The repository's three command strings are root-relative

The committed OpenCode registration uses:

- `node .opencode/bin/mk-spec-memory-launcher.cjs`
- `node .opencode/bin/mk-skill-advisor-launcher.cjs`
- `node .opencode/bin/mk-code-index-launcher.cjs`

Those paths are valid only when the host resolves the command from the repository root, or when a future Devin config replaces them with an absolute path. Devin's documented project-scoped config makes repository-root startup the intended operating assumption, but the MCP configuration contract does not explicitly promise the subprocess CWD. Evidence: `opencode.json:18-85`; [MCP Overview](https://docs.devin.ai/cli/extensibility/mcp/overview); [Configuration File](https://docs.devin.ai/cli/reference/configuration/config-file).

### 3. Once the launcher is resolved, all three launchers normalize execution back to the repository root

Each launcher computes `root` from its own location with `path.resolve(__dirname, '..', '..')`. Each child daemon is then spawned with `cwd: root`. Cold bootstrap also uses that root for dependency installation and build commands:

- Spec Kit Memory builds the MCP and script workspaces with `cwd: root` as the default and spawns `context-server.js` with `cwd: root` (`mk-spec-memory-launcher.cjs:55,1189-1262,1522-1525`).
- Code Graph builds from the skill-local package and spawns `index.js` with `cwd: root` (`mk-code-index-launcher.cjs:24,1279-1284,1611-1615`).
- Skill Advisor builds its package and spawns `advisor-server.js` with `cwd: root` (`mk-skill-advisor-launcher.cjs:23,1090-1179,1275-1279`).

This removes CWD ambiguity inside the daemon, but not at the first step: Devin must still resolve `node .opencode/bin/...` from the repository root. The relative `MK_SKILL_ADVISOR_DB_DIR` and `SPECKIT_CODE_GRAPH_DB_DIR` values in the OpenCode config also assume root-relative evaluation; they should not be copied blindly into a host configuration until a clean Devin session confirms its CWD behavior.

### 4. A clean Linux Devin invocation remains unverified

The local shell cannot prove the host-side subprocess CWD, and the prior `devin mcp list` probe was blocked by Devin's rolling-log initialization before configuration discovery. The official docs say Devin launches configured servers when needed and recommend verifying the command outside Devin, but they do not state a per-MCP CWD guarantee. Therefore the answer is conditional: the three servers are structurally compatible with Devin stdio, and they should work when the project-scoped MCP process starts at the repository root; a clean Linux session is still required to prove all three commands resolve and complete `tools/list` discovery.

### 5. The MCP-host surface is worth a separate additive phase, not an implicit part of CLI revival

The integration is technically plausible, but its acceptance boundary is operational rather than a simple config translation. A dedicated phase should provide a minimal Devin-specific `.devin/config.json` with the three stdio entries, avoid copying OpenCode's broad trust/default environment, verify Node/dependency/dist readiness in the Devin snapshot, validate root-relative launch and `tools/list` for all servers, capture actual Devin tool namespaces before writing permission rules, and test cold-start embeddings/IPC behavior on Linux. Secrets and any maintainer-only trust opt-in belong in `.devin/config.local.json`.

## Questions Answered

- **Can Devin host the three servers over MCP?** Yes in transport shape: Devin supports local stdio `command`/`args`/`env`, and all three repository entries are local Node launchers.
- **Does Devin's documented MCP config set a working directory?** No. There is no documented `cwd` field, so the host's project-root startup behavior is a prerequisite for the current relative command strings.
- **Do the launchers themselves depend on the caller's CWD after startup?** Mostly no. They derive the repository root from `__dirname`, build from root-derived paths, and spawn their daemon children with `cwd: root`.
- **Has a clean Linux Devin session proven all three commands and `tools/list`?** No. This remains an explicit acceptance test, not a confirmed fact.
- **Should Devin-as-MCP-host enter the revival?** Yes, but as a new additive phase with a clean Linux acceptance matrix; it should not silently expand the current CLI mode phases.

## Questions Remaining

- Does Devin's stdio subprocess launcher always use the repository root for project-scoped servers across fresh, resumed, sandboxed, and handed-off sessions?
- Do the three commands complete a clean Linux `initialize` plus `tools/list` discovery with dependencies already present in the Devin snapshot?
- Which exact namespace spelling does Devin emit for the mixed server IDs, and do permission denies match that spelling?
- Which embedding tier and network/socket allowlist are reliable on a first cold start without Ollama?
- Does a project-level deny remain effective when a session-level server-wide allow is granted?

## Next Focus

No further research iteration remains under the five-iteration cap. Follow-up work should run the clean Linux Devin acceptance matrix and, if it passes, open a separate MCP-host integration phase with explicit rollback and permission/trust criteria.
