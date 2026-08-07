# Iteration 011 — MCP surface design + API surface governance

**Status:** insight · **Findings:** 5 · **newInfoRatio:** 0.78 · **tokens:** 93128 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Mechanism
MemClaw defines three callable surfaces and explicitly says they are “not symmetric”: REST, MCP, and OpenClaw plugin serve different audiences and trust models rather than mirroring every operation everywhere (`docs/api-surfaces.md:3`, `docs/api-surfaces.md:14-18`). The MCP audience is AI agents with tenant inferred from auth and description-driven discoverability; REST is broader admin/UI/script vocabulary; the plugin owns local runtime concerns (`docs/api-surfaces.md:16-18`).

Approximate count: full MCP surface is 12 top-level tools; the OpenClaw plugin exposes 11, excluding the MCP-only keystone authoring tool (`README.md:818-835`, `static/docs/integration-guide.md:52-53`). The plugin contract lists 11 names (`plugin/openclaw.plugin.json:16-29`), while `memclaw_keystones_set` is present in tool metadata but marked `plugin_exposed=false` (`plugin/tools.json:297-385`). The MCP server itself frames the agent-facing instruction surface as “these 12 tools” (`core-api/src/core_api/mcp_server.py:390-404`).

Inventory/grouping/naming: names are consistently prefixed `memclaw_`, enforced by `ToolSpec.__post_init__` and tests (`core-api/src/core_api/tools/_types.py:78-85`, `tests/test_tools_registry.py:57-62`). The top-level tools are domain/task buckets: memory write/recall/manage/list/stats, structured docs, entity lookup, tuning, insights/evolve, and keystones (`README.md:824-835`). Several are op-dispatched to avoid tool proliferation: `memclaw_manage` handles `read|update|transition|delete|bulk_delete|lineage` (`core-api/src/core_api/mcp_server.py:735-762`), `memclaw_doc` handles `write|read|query|delete|list_collections|search` (`core-api/src/core_api/tools/memclaw_doc.py:13-24`, `core-api/src/core_api/tools/memclaw_doc.py:26-88`), and `memclaw_keystones_set` combines `set|delete` “so the write surface lives in a single, clearly admin-flavoured place” (`core-api/src/core_api/tools/memclaw_keystones_set.py:15-17`).

They avoid surface bloat with an explicit admission test: before adding an MCP tool that mirrors REST, require a concrete current agent workflow or a read-only aggregation/introspection case; otherwise prefer adding an `op=...` to an existing tool (`docs/api-surfaces.md:43-60`). Skill sharing is the clearest example: dedicated `memclaw_share_skill`/`memclaw_unshare_skill` tools were removed and folded into `memclaw_doc collection=skills` (`docs/api-surfaces.md:34`, `README.md:351`). `memclaw_doc` itself documents that it “replaces the 4 prior `memclaw_doc_*` tools” (`core-api/src/core_api/tools/memclaw_doc.py:1-4`).

The surface-ownership charter defines what belongs on which surface, including REST-only admin/analytics concerns, MCP+REST universal operations, and plugin-only runtime operations (`docs/api-surfaces.md:20-41`). It also declares asymmetry intentional, not a bug (`docs/api-surfaces.md:66-72`).

Stable-vs-internal split: README declares stable MCP tool names, parameter names, and documented op-dispatch values (`README.md:814-820`), then lists internal, non-SemVer areas such as Python module layout, DB schema, gateway headers, most admin/testing routes, core-storage API, and plugin module structure (`README.md:893-903`). Plugin environment variables and published plugin name are stable, but TypeScript module structure is internal (`README.md:859-862`).

Deprecation/stability discipline: tool metadata has `impl_status` values `live`, `reserved`, and `deprecated`; deprecated means “kept for one release; will be removed” (`core-api/src/core_api/tools/_types.py:30-35`). Breaking stable-surface changes require `BREAKING CHANGE:` and PR label `kind/breaking`, and reviewers block unmarked stable-surface breaks (`README.md:905-912`). Contributing docs tie breaking public API changes to SemVer bump mechanics (`CONTRIBUTING.md:111-114`).

Governance is partly executable: `ToolSpec` is the declarative source for MCP registration, `/tool-descriptions`, plugin `tools.json`, and trust gating (`core-api/src/core_api/tools/_types.py:1-10`, `core-api/src/core_api/tools/_types.py:48-76`). Registration and descriptor JSON are derived from that spec (`core-api/src/core_api/tools/_builders.py:22-41`, `core-api/src/core_api/tools/_builders.py:124-143`). Tests lock prefix naming, trust ranges, no collisions, plugin-exposed vs MCP-only sets, registry size, and expected op-dispatched sets (`tests/test_tools_registry.py:1-13`, `tests/test_tools_registry.py:24-47`, `tests/test_tools_registry.py:119-123`, `tests/test_tools_registry.py:180-200`).

One caution: governance is not perfect. `memclaw_manage` handler and README include `bulk_delete|lineage` (`core-api/src/core_api/mcp_server.py:735-762`, `README.md:826`), while its `ToolSpec` ops and registry test only assert four ops (`core-api/src/core_api/tools/memclaw_manage.py:26-40`, `tests/test_tools_registry.py:135-141`). That is useful negative evidence for Spec Kit: generated/baseline governance must cover the actual handler contract, not just a parallel descriptor.

## Teachings for Spec Kit Memory (37-tool MCP surface)
1. **Claim** · Create a Spec Kit Memory MCP surface ownership charter before adding more tools.
**Evidence** · MemClaw’s charter separates audience/trust per surface (`docs/api-surfaces.md:14-18`) and requires concrete workflow or read-only aggregation before adding MCP tools (`docs/api-surfaces.md:43-60`).
**Maps-to** · 027/008-caura-memclaw-fleet-memory-teachings, plus likely new sub-packet: `spec-kit-memory-mcp-surface-charter`.
**Verdict** · ADOPT.
**Risk** · A charter can become stale if not tied to tests or review checks.
**Confidence** · High.
**Why it transfers (or not)** · API-surface governance is architecture-neutral. Spec Kit is single-user/internal, so the “trust model” column should become “mutation risk / user intent / recovery risk,” but the add-operation gate transfers directly to a 37-tool MCP.

2. **Claim** · Consolidate related Spec Kit Memory tools into domain tools with explicit `op` values where the caller intent is one concept.
**Evidence** · MemClaw prefers extending existing tools over new top-level tools (`docs/api-surfaces.md:55-57`), folded skill sharing into `memclaw_doc` (`README.md:351`), and documents `memclaw_doc` as replacing four prior tools (`core-api/src/core_api/tools/memclaw_doc.py:1-4`).
**Maps-to** · New sub-packet: `spec-kit-memory-tool-count-discipline`.
**Verdict** · ADAPT.
**Risk** · Overusing `op` can hurt MCP discoverability and schema clarity; MemClaw also shows descriptor drift around `memclaw_manage` ops (`core-api/src/core_api/mcp_server.py:735-762`, `tests/test_tools_registry.py:135-141`).
**Confidence** · High.
**Why it transfers (or not)** · Tool-count pressure transfers strongly from 12/11 to 37. Adapt by consolidating only tightly related operations, not by hiding unrelated workflows behind a mega-tool.

3. **Claim** · Define stable vs internal MCP contracts for Spec Kit Memory even without public SemVer.
**Evidence** · MemClaw states stable MCP tool names, parameter names, and documented op values (`README.md:818-820`), and marks everything else internal by omission (`README.md:893-903`).
**Maps-to** · 027/008 or new sub-packet: `spec-kit-memory-stable-tool-contract`.
**Verdict** · ADAPT.
**Risk** · Full public SemVer process is too heavy for a local single-user store.
**Confidence** · High.
**Why it transfers (or not)** · Spec Kit does not need public major/minor promises, but it does need a “safe to depend on” contract because agents, prompts, and saved workflows can depend on MCP names.

4. **Claim** · Add an executable registry/baseline gate for the 37-tool surface.
**Evidence** · MemClaw’s `ToolSpec` drives registration, descriptors, plugin metadata, and trust fields (`core-api/src/core_api/tools/_types.py:48-76`), while tests lock expected exposed/MCP-only sets and registry size (`tests/test_tools_registry.py:24-47`, `tests/test_tools_registry.py:180-200`).
**Maps-to** · New sub-packet: `spec-kit-memory-tool-registry-baseline`.
**Verdict** · ADOPT.
**Risk** · If the registry is not generated from the actual MCP handlers, it can encode stale expectations.
**Confidence** · Medium-high.
**Why it transfers (or not)** · Strong transfer. Single-user/internal tools still need drift prevention because accidental renames or silent additions break agent behavior.

5. **Claim** · Separate high-risk governance/mutation tools from ordinary read tools, but do not copy MemClaw’s fleet trust tiers wholesale.
**Evidence** · MemClaw keeps `memclaw_keystones` readable and plugin-exposed, while `memclaw_keystones_set` is MCP-only/admin-governance and dynamically gated (`core-api/src/core_api/mcp_server.py:2088-2101`, `core-api/src/core_api/tools/memclaw_keystones_set.py:1-17`, `plugin/tools.json:263-287`, `plugin/tools.json:290-385`).
**Maps-to** · New sub-packet: `spec-kit-memory-dangerous-tool-governance`.
**Verdict** · ADAPT.
**Risk** · Extra separation can increase tool count if applied mechanically.
**Confidence** · Medium.
**Why it transfers (or not)** · The fleet trust ladder does not transfer to a local single-user system, but the distinction between read/introspection, normal write, destructive mutation, and governance mutation does.

## Negative knowledge
Public SemVer machinery has limited payoff for Spec Kit Memory as a local single-user MCP. MemClaw’s `BREAKING CHANGE:` trailers, PR labels, reviewer blocking, and major-bump process are designed for external consumers (`README.md:905-912`, `CONTRIBUTING.md:111-114`). Spec Kit should keep lightweight deprecation metadata and migration notes, not full release governance.

Fleet/tenant trust tiers should not be copied literally. MemClaw’s surfaces are shaped by tenant IDs, agent IDs, cross-fleet reads, and trust levels (`docs/api-surfaces.md:14-18`, `core-api/src/core_api/tools/memclaw_keystones_set.py:3-13`). Spec Kit’s equivalent is local safety classification, not multi-tenant authorization.

REST/MCP/plugin asymmetry is instructive, but Spec Kit may only need one public MCP surface plus internal implementation APIs. MemClaw’s plugin-exposed split matters because it has an OpenClaw runtime and external plugin contract (`static/docs/integration-guide.md:52-53`, `README.md:859-862`).

Do not assume op-dispatch automatically solves bloat. MemClaw’s `memclaw_manage` shows actual handler ops can drift from registry/test expectations (`core-api/src/core_api/mcp_server.py:735-762`, `core-api/src/core_api/tools/memclaw_manage.py:26-40`, `tests/test_tools_registry.py:135-141`). Spec Kit should make handler, docs, and descriptor generation share one source.

## Open questions
Which of Spec Kit Memory’s 37 tools are truly top-level concepts versus CRUD/action variants that could become `op` values?

Which tools are stable agent-facing contracts, and which are internal/admin/debug surfaces that should be hidden, renamed, or grouped?

Does the current Spec Kit MCP descriptor generation have a single source of truth for tool names, parameter names, op values, deprecation status, and danger class?

What deprecation window is appropriate for a single-user local MCP: one release, one spec packet, or “until prompts and saved memories are migrated”?

Can tool descriptions be shortened or usage moved into skills/docs without reducing agent success?

Should destructive memory operations require an explicit “dangerous mutation” naming convention or separate confirmation-like tool group?

Is there any existing saved memory, prompt, or automation that depends on all 37 tool names, making consolidation a migration rather than a simple refactor?

DELTA_JSON: {"iteration":"011","focus":"MCP surface design + API surface governance","findingsCount":5,"newInfoRatio":0.78,"topVerdicts":["ADOPT: Create a Spec Kit Memory MCP surface ownership charter","ADAPT: Consolidate related 37-tool operations via op-dispatch with handler-derived tests"],"sources":["docs/api-surfaces.md:43","README.md:818","core-api/src/core_api/tools/_types.py:48","tests/test_tools_registry.py:180","core-api/src/core_api/mcp_server.py:735"]}
