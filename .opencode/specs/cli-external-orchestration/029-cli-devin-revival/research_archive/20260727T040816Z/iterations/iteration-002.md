# Iteration 002: Least-privilege Devin MCP policy

## Focus

Define the least-privilege Devin policy for advisor mutation tools and spec-kit memory writes, including the server-side trust boundary that Devin's host permissions cannot replace.

## Actions Taken

- Read the previous iteration, current research strategy, Phase 001 contract evidence, and the three MCP server dispatch surfaces.
- Fetched the current official Devin permissions, configuration-file, and MCP-configuration references.
- Audited Devin's allow/ask/deny matcher semantics against the current advisor trust gate, spec-kit memory save path, and code-graph maintenance tools.
- Checked the committed MCP environment defaults for trust propagation. No researched source files or implementation files were modified.

## Findings

### 1. Devin provides the host-side control needed for a narrow MCP allowlist

The current Devin contract supports exact MCP tool matchers, server wildcards, and a global MCP wildcard. MCP calls default to prompting; permission rules are evaluated deny, then ask, then allow, then default. Project permissions belong in .devin/config.json, while personal overrides and secrets belong in .devin/config.local.json. Evidence: [Devin permissions](https://docs.devin.ai/cli/reference/permissions) and [Devin MCP configuration](https://docs.devin.ai/cli/extensibility/mcp/configuration).

The least-privilege default is therefore:

- Keep Devin in normal mode. Do not use Bypass for this integration.
- Do not grant mcp__* or mcp__server__*; those convert a useful read-only integration into blanket access.
- Allow only confirmed read-only tools by exact server/tool name after a clean tools/list discovery.
- Deny high-impact mutation tools explicitly and leave unlisted tools at the default prompt or an explicit ask rule.
- Never persist a broad “allow all tools on this server” approval during initial rollout.

The server names shown to Devin must be confirmed because the repository registrations use hyphenated names while the previous phase recorded underscore-normalized matcher examples. The policy must be tested against Devin's actual tools/list names, not inferred from the config key.

### 2. Advisor mutations have a real second-line trust gate, but the committed default is too broad for Devin

The advisor CLI requires trusted authority for advisor_rebuild, skill_graph_scan, and apply-mode skill_graph_propagate_enhances; without --trusted or the trusted environment flag it rejects the mutation with a usage error (system-skill-advisor/mcp-server/skill-advisor-cli.ts:691-701). The MCP handlers apply the same trusted-caller requirement to the mutating graph paths (system-skill-advisor/mcp-server/handlers/skill-graph/propagate-enhances.ts:40-46).

The native MCP server's transport-absent trust is controlled by MK_SKILL_ADVISOR_TRUST_DEFAULT in the daemon environment. The checked-in OpenCode registrations set that value to trusted (opencode.json:47-66; .mcp.json:37-55), specifically so native clients that omit metadata continue to work. Devin's stdio calls are the same transport class, so copying that environment entry into a shared .devin/config.json would grant every project Devin session the server-side mutation trust that the host permission layer is supposed to mediate.

The least-privilege Devin configuration must omit MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted. That leaves read-only advisor calls usable while transport-absent mutation calls fail closed at the server. A maintainer who deliberately needs advisor maintenance can opt in through a gitignored local config, then still require an exact Devin MCP permission approval for the specific mutation tool.

One caveat: the advisor performs a daemon-owned startup scan and starts a watcher (system-skill-advisor/mcp-server/advisor-server.ts:131-165). Omitting the trust default protects explicit caller-invoked mutation tools; it does not make the advisor's own package-local freshness/index maintenance read-only.

### 3. Memory writes are more exposed than advisor mutations

memory_save is not a read-only index call. Its schema explicitly permits indexing and routed continuity saves into canonical spec documents (system-spec-kit/mcp-server/tool-schemas.ts:413-415), and the handler contains direct canonical file-write paths (system-spec-kit/mcp-server/handlers/memory-save.ts:606-662, 1713-1799).

The spec-kit server currently treats a local stdio caller as trusted when the transport metadata does not explicitly opt out (system-spec-kit/mcp-server/context-server.ts:807-825). The memory-tools dispatcher routes memory_save and the other CRUD/lifecycle tools without an advisor-style caller trust gate (system-spec-kit/mcp-server/tools/memory-tools.ts:96-107; system-spec-kit/mcp-server/tools/lifecycle-tools.ts:44-80). I found no independent server-side permission boundary that would make Devin memory writes safe after a host-level allow.

For the first Devin integration, deny or force-ask at minimum:

- mcp__mk-spec-memory__memory_save
- mcp__mk-spec-memory__memory_update
- mcp__mk-spec-memory__memory_delete
- mcp__mk-spec-memory__memory_bulk_delete
- mcp__mk-spec-memory__memory_retention_sweep
- mcp__mk-spec-memory__memory_learned_expire
- mcp__mk-spec-memory__memory_learned_clear
- mcp__mk-spec-memory__memory_embedding_reconcile
- mcp__mk-spec-memory__memory_index_scan
- mcp__mk-spec-memory__memory_ingest_start
- mcp__mk-spec-memory__embedder_set
- checkpoint_create, checkpoint_restore, and checkpoint_delete

The exact namespace spelling remains a clean-session verification item. The safe read set can include memory_context, memory_search, memory_quick_search, memory_match_triggers, memory_list, memory_stats, memory_health, memory_validate, memory_index_scan_status, memory_ingest_status, embedder_list, and embedder_status once Devin reports their actual names. Do not allow a server-wide wildcard and assume that the list is harmless.

The same host policy should deny code_graph_scan and code_graph_apply, and should not auto-allow code_graph_verify when persistBaseline is requested. Query, context, status, classify, detect_changes, and verification with persistence disabled are the safer read/diagnostic subset (system-code-graph/mcp-server/tool-schemas.ts:14-183).

### 4. Recommended policy and phase acceptance criteria

The additive MCP phase should ship two policy tiers:

1. Shared project config: three stdio server entries, no advisor trust-default environment variable, exact read-only MCP allows, explicit denies for memory and graph mutations, and default prompting for everything else.
2. Maintainer-local override: optional provider secrets in .devin/config.local.json plus an explicit advisor trust-default opt-in only for a maintainer who has accepted the mutation risk. This override must not be committed or silently inherited by other sessions.

Memory writes should remain interactive even for maintainers until the server has a dedicated caller-trust gate or a read-only facade. Devin's MCP permission rules can reduce accidental calls; they do not repair the absence of a server-side memory-write authorization boundary.

The phase's live acceptance test must prove all of the following in a clean Devin session: actual namespaced tool names, read-only discovery and calls, denial or prompting for memory_save, denial of advisor mutations when the trust default is omitted, explicit maintainer opt-in behavior, and no effect from a broad server-level grant on the intended deny rules.

## Questions Answered

- **Least-privilege Devin host policy:** answered. Use normal mode, exact read-only MCP allows, explicit mutation denies or asks, no server-wide wildcard grants, and no Bypass.
- **Advisor mutation trust:** answered. Do not copy MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted into shared Devin config; keep it absent by default and make any maintainer opt-in local.
- **Memory-write trust:** answered. memory_save and related lifecycle/CRUD tools have no equivalent independent caller-trust gate; Devin must keep them denied or interactive, and a future read-only facade/server gate is the durable fix.
- **Code-graph implication:** answered enough for policy. Deny scan/apply and persistence-enabled verification while allowing structural reads.

## Questions Remaining

- Does Devin normalize the three hyphenated server names to underscores in actual MCP tool names, and do deny rules match that normalized form?
- Does a project-level deny survive or get overridden by a session-level “allow all tools on this server” grant?
- Does Devin invoke all three relative launcher commands from the repository root in a clean Linux session?
- Which embedding tier and network allowlist are reliable on Devin's first cold start?

## Next Focus

Run the clean-session verification matrix: register the three project-scoped stdio servers, capture tools/list names, test read-only calls, and exercise advisor trust omission versus maintainer-local opt-in without changing repository implementation files.
