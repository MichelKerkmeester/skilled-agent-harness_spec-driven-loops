---
title: "Inventory: advisor MCP surfaces, callers and preserve set"
description: "Classified inventory of every MCP surface, every advisor caller, every flag and every retired-id document reference, each row assigned to a phase or to the preserve set."
trigger_phrases:
  - "advisor mcp inventory"
  - "advisor caller inventory"
  - "advisor preserve set"
  - "advisor behavior table"
importance_tier: "important"
contextType: "reference"
---
# Inventory: advisor MCP surfaces, callers and preserve set

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Taken at `6012ec5c7d` on `skilled/v4.0.0.0`. Enumeration is by string sweep over the
> working tree, excluding `node_modules`, `dist` and `specs/`, with the spec corpus swept
> separately for document references. Nothing here was acted on.

---

## 1. METHOD AND FREEZE

| Field | Value |
|-------|-------|
| Freeze commit | `6012ec5c7d` |
| Branch | `skilled/v4.0.0.0` |
| Enumeration | String sweep by transport and by symbol, the two lists reconciled against each other |
| Classification | Every row is rewire, delete, preserve or historical. Unclassified rows: 0 |

---

## 2. MCP SDK IMPORT SITES

Five sites inside the package. Nothing outside the package imports the SDK on the advisor's
behalf; the other importers belong to `mcp-code-mode` and `sk-vision`, which keep their servers.

| Site | Nature | Disposition | Phase |
|------|--------|-------------|-------|
| `mcp-server/advisor-server.ts` | Server, StdioServerTransport, tool schemas | Delete | 005 |
| `mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs` | Client, StdioClientTransport | Delete | 005 |
| `mcp-server/tests/compiled-routing-consumption.vitest.ts` | Two `vi.mock` calls for the bridge | Delete with the bridge | 005 |
| `scripts/doctor.sh` | Requires the SDK to `require()` cleanly | Drop from the dependency check | 005 |
| `scripts/README.md` | Documents that check | Rewrite | 007 |

---

## 3. RUNTIME DECLARATIONS

All five roots declare the server and carry the same env block. The Codex file counts twice
because the server and its env table are separate TOML sections.

| Root | Key | Disposition | Phase |
|------|-----|-------------|-------|
| `opencode.json` | `mcp.system_skill_advisor` | Delete declaration, relocate surviving env | 005 |
| `.claude/mcp.json` | `mcpServers.system_skill_advisor` | Delete declaration, relocate surviving env | 005 |
| `.codex/config.toml` | `[mcp_servers.system_skill_advisor]` and its `.env` | Delete both sections, relocate surviving env | 005 |
| `.cursor/mcp.json` | `mcpServers.system_skill_advisor` | Delete declaration, relocate surviving env | 005 |
| `.pi/mcp.json` | `mcpServers.system_skill_advisor` | Delete declaration, relocate surviving env | 005 |

The env block is not disposable with the declaration. It sets the database directory, the
socket directory, the doc-trigger flag and the trust default, and the daemon still needs those
once no MCP client starts it. Phase 005 must name their new home before deleting the blocks.

---

## 4. EXECUTABLE CALLERS

Thirteen executable callers, excluding tests, benchmarks and fixtures.

| Caller | Reaches the advisor by | Disposition | Phase |
|--------|------------------------|-------------|-------|
| `.opencode/plugins/system-skill-advisor.js` | Plugin bridge, plus the Python scorer | Rewire to the CLI | 004 |
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | CLI shim | Promote from fallback to primary | 004 |
| `.opencode/commands/doctor/scripts/route-validate.py` | MCP tool ids | Rewire to CLI commands | 004 |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Launcher | Rewire to the daemon supervisor | 004 |
| `.opencode/scripts/session-cleanup.sh` | Launcher process names | Update process identity | 005 |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Launcher process names | Update process identity | 005 |
| `.opencode/bin/cli-exit-taxonomy-smoke.cjs` | CLI shim | Extend for the frozen taxonomy | 003 |
| `.opencode/bin/cli-offline-smoke.cjs` | CLI shim | Extend for the frozen contract | 003 |
| `mcp-server/skill-advisor-cli.ts` | Launcher plus MCP-framed JSON-RPC | Reframe onto the phase 002 protocol | 003 |
| `mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs` | SDK client | Delete | 005 |
| `mcp-server/scripts/init-skill-graph.sh` | CLI shim | Path update only | 006 |
| `system-spec-kit/runtime/cli/observability/smart-router-measurement.ts` | Advisor library import | Path update only | 006 |
| `system-spec-kit/shared/embeddings/providers/hf-local.ts` | Launcher, for the shared model server | Preserve; path update only | 006 |

---

## 5. THE AUTOMATIC BEHAVIOR THAT MUST SURVIVE

This is the table phase 008 proves against. The Claude chain was traced end to end and does
not touch MCP at any hop.

| Runtime | Trigger | Chain | Observable output |
|---------|---------|-------|-------------------|
| Claude Code | `UserPromptSubmit` in `.claude/settings.json` | spec-kit runtime shim spawns the advisor's compiled hook, which imports the advisor library and falls back to the CLI shim | The `Advisor:` route line plus the directive block, prepended to the prompt |
| OpenCode | Plugin `system-skill-advisor.js` per prompt | Plugin spawns the bridge, and separately the Python scorer | The same brief injected into model context |
| Codex | `hooks = true` with the advisor hook-disabled flag set to `0` | Codex hook mirror | The same brief |
| Pi | `hooks/pi/prompt-advisor.ts` | Pi hook adapter | The same brief |

**Cross-package coupling worth naming.** The registered Claude hook is a spec-kit file that
hardcodes `skills/system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js`.
The phase 006 rename must carry that string, and it lives in a different package from the one
being renamed.

---

## 6. FLAGS

Sixty-three distinct advisor flags. Only two are transport-coupled.

| Flag | Nature | Disposition | Phase |
|------|--------|-------------|-------|
| `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` | Plugin bridge only | Delete with the bridge | 005 |
| `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT` | Grants trust to callers whose MCP `_meta` omits transport markers | Re-specify for CLI callers before the transport goes, or mutation tools fail closed | 005 |
| The remaining 61 | Scorer, daemon, cache, policy, thresholds, IPC | Preserve | none |

`SPECKIT_IPC_SOCKET_DIR` and `SPECKIT_MAX_SECONDARY_CLIENTS` belong to the shared socket
bridge, not to MCP, and are preserve-set items despite sitting in the MCP env blocks.

---

## 7. PRESERVE SET

| Item | Owner | Checked after removal by |
|------|-------|--------------------------|
| Scorer, its five lanes, weights and thresholds | advisor package | A scored recommendation through the CLI |
| Skill graph SQLite and its schema | advisor package | `skill_graph_status` through the CLI |
| Resident daemon, lease and watcher | advisor package, subject to phase 002 | Daemon status after a cold start |
| Shared HF model server and its socket | spec-kit shared embeddings | Embedder resolution after the removal |
| Shared IPC socket bridge | `@spec-kit/shared` | A CLI round trip |
| Python scorer and its callers | advisor package | The plugin and doctor paths that call it |
| Every non-advisor MCP server | their own packages | Their declarations still present |

---

## 8. FINDINGS

Three things the parent spec assumed are wrong, and one is load-bearing.

**F1. The Python shim is not a legacy fallback, and it is not MCP-coupled.** The parent spec
asked whether it still has a reason to exist once there is no native MCP path. The premise is
wrong. It is called in production by the OpenCode plugin, by the doctor parent-skill check, by
the deep-loop skill-benchmark probe, by two create-skill command assets and by four modules
inside the advisor package itself. It never had anything to do with the transport. **Verdict:
preserve, unchanged, and drop the question from the parent spec.**

**F2. The architecture document misplaces the shim.** It describes `compat/skill_advisor.py`.
The file is at `mcp-server/scripts/skill_advisor.py`, and the `compat/` directory holds a
TypeScript entrypoint instead. Phase 007 fixes this.

**F3. The env blocks outlive the declarations they sit in.** Deleting the five server blocks
also deletes the database directory, socket directory, doc-trigger and trust-default settings
the daemon reads. Phase 005 has to rehome them first, and the trust default specifically
decides whether mutation commands keep working.

---

## 9. COMPLETENESS

| Class | Rows | Unclassified |
|-------|------|--------------|
| SDK import sites | 5 | 0 |
| Runtime declarations | 5 | 0 |
| Executable callers | 13 | 0 |
| Automatic behaviors | 4 | 0 |
| Flags | 63 | 0 |
| Preserve-set items | 7 | 0 |

Document references to retired tool ids: 35 files, 17 outside the spec corpus and 18 under it.
Of the 17, one is a changelog. The live-versus-historical split inside those 17 is not decided
here; phase 007 owns it along with the exemption list.
