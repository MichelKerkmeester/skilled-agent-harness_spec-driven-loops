---
title: "Implementation Summary"
description: "System-code-graph docs no longer disagree with the runtime. Tool count, topology, version, and continuity are all aligned in a single doc-only packet."
trigger_phrases:
  - "028 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-system-code-graph-doc-alignment"
    last_updated_at: "2026-05-16T09:01:20Z"
    last_updated_by: "main_agent"
    recent_action: "Closed packet 028 with grep + validate evidence"
    next_safe_action: "Commit on main citing packet 028"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000028"
      session_id: "028-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-system-code-graph-doc-alignment |
| **Completed** | 2026-05-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `system-code-graph` skill docs now match the runtime. Before this packet, three different tool counts circulated (10 in five files, 12 in `graph-metadata.json`), the metadata still claimed a pre-extraction `co-resident` topology with `mk-spec-memory` as host, the SKILL.md continuity pointer was 14 days stale, and the version string lagged the changelog by three releases. After this packet, every authored doc agrees on 11 tools, the metadata declares the standalone `mk-code-index` server, the continuity block points at packet 028, and the version row reads `1.0.3.1`.

### Tool count alignment

You can now grep for tool count across the skill and get one answer. `tool-schemas.ts` was already correct at 11 tools; this packet propagated that number to the five authored surfaces that disagreed and added the missing `code_graph_classify_query_intent` row to README §3.2 and ARCHITECTURE §3.

### Topology alignment

`graph-metadata.json` now declares `mcp_server_topology: standalone` and `mcp_server_host: mk-code-index`, matching `mcp_server/index.ts:28` and the v1.0.3.0 three-way isolation finalize. The depends-on edge context was rewritten to drop "co-resident" and credit the extraction-parent + shared-lib relationship instead.

### Continuity refresh

SKILL.md `_memory.continuity` points at packet 028 with current timestamp and the active `key_files` list. The next `/spec_kit:resume` invocation lands the operator on this work instead of the older 025 sk-doc-alignment packet.

### Version bump

SKILL.md frontmatter and README key-stats both read `1.0.3.1`. This is a doc-only bump tracking changelog v1.0.3.0; `package.json` runtime version stays at `1.0.0` per the existing convention there.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modified | Frontmatter version + continuity block |
| `.opencode/skills/system-code-graph/README.md` | Modified | Active MCP tools row + Skill version row + classify row |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modified | §3 heading + classify row + §8 + §9 count claims |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modified | `_NOTE_2_TOOLS` JSON + TOML stanzas |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modified | Line 38 tool count |
| `.opencode/skills/system-code-graph/graph-metadata.json` | Modified | topology, host, edges context, causal_summary, last_updated_at |
| `.opencode/specs/system-spec-kit/028-system-code-graph-doc-alignment/` | Created | This packet (6 files) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Twelve direct Edit-tool patches, one grep sweep, one strict-validate. No source-code changes, no test invalidation, no migrations. The runtime was already correct; this packet only updated authored docs to follow it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Tool count = 11 (not 10 or 12) | `mcp_server/tool-schemas.ts` is the single source of truth and registers exactly 11 names |
| Version bump = 1.0.3.1 (not 1.0.4.0) | Doc-only changes warrant a patch-level bump; runtime semver stays at v1.0.3.0 (newest changelog) |
| Topology = standalone | `mcp_server/index.ts:28` instantiates a dedicated `mk-code-index` server; co-resident claim predates packet 014 extraction |
| Doc-only scope, no `package.json` bump | `package.json` tracks runtime package version, not skill-doc version; keeping it at `1.0.0` matches existing convention |
| Single packet, not multiple sub-fixes | Four issues share a single root cause (docs trailing runtime), one packet keeps the audit trail compact |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Post-edit grep `10 (tools\|MCP tools)\|12 MCP tools` across 6 scope files | PASS (exit 1, no matches) |
| `validate.sh --strict` on packet 028 | PASS (exit 0) |
| `tool-schemas.ts` enumeration count | PASS (11 names) |
| `graph-metadata.json` topology field | PASS (`standalone`) |
| SKILL.md frontmatter version | PASS (`1.0.3.1`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No `package.json` version bump.** Runtime package semver stays at `1.0.0`. Skill-doc version diverges intentionally; if these need to converge in future, a separate packet should decide the convention.
2. **`mcp_server_topology` schema is free-form.** No enum constraint on the field means future drift back to `co-resident` would not be caught by validation; longer-term fix is a schema enum.
<!-- /ANCHOR:limitations -->
