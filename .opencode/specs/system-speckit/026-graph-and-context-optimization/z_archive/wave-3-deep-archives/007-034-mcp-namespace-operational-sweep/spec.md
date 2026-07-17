---
title: "Feature Specification: 020 MCP Namespace Operational Sweep"
description: "Closes three missed rename spots from packet 010 where MCP namespace references remained as the legacy mcp__system_code_graph__* in operational files (doctor router, doctor update command frontmatter, system-spec-kit tool-schemas descriptions)."
trigger_phrases:
  - "020 mcp namespace operational sweep"
  - "mcp system code graph stale rename"
  - "doctor routes mk code index"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-034-mcp-namespace-operational-sweep"
    last_updated_at: "2026-05-14T21:55:00Z"
    last_updated_by: "orchestrator-mcp-sweep"
    recent_action: "Renamed 13 stale mcp__system_code_graph__* refs across 3 operational files"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "020-mcp-namespace-operational-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 020 MCP Namespace Operational Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 010 renamed the MCP server `system_code_graph` → `mk-code-index` with the tool namespace becoming `mcp__mk_code_index__*`. Audit after 019 found 3 operational files still emitting the legacy `mcp__system_code_graph__*` namespace:

1. `.opencode/commands/doctor/_routes.yaml` — 9 stale tool-name allowlist entries under the doctor router's code-graph route (`mcp__system_code_graph__code_graph_*` + `mcp__system_code_graph__ccc_*` + `mcp__system_code_graph__detect_changes`). When `/doctor code-graph` runs, it would attempt to invoke tools that don't exist under that namespace anymore (server now serves `mcp__mk_code_index__*`).
2. `.opencode/commands/doctor/update.md` — 7 stale `allowed-tools:` frontmatter entries. Same broken-invocation risk.
3. `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` — 3 stale descriptions in `memory_context` + `memory_search` tool definitions (lines 43 and 50 routing hints) + a historical comment on line 558.

These are operational source-tree references missed by 010's rename sweep, surfaced when the deferred-tool disconnect notification listed 10 `mcp__system_code_graph__*` entries (cached from pre-rename state) and a fresh grep showed live references still present.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace all `mcp__system_code_graph__` with `mcp__mk_code_index__` in the 3 operational files
- Verify launcher startup is unchanged
- Verify no operational references remain (historical packet `.md` docs preserved as documented history)

### Out of Scope
- Historical packet markdown (007, 010, 011, 014, etc.) intentionally retain the old namespace as documentation of the rename's pre-state
- Force-push / history rewrite on prior commits
- Re-running 010's full rename audit (this packet completes 010's sweep, doesn't reopen it)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| REQ-001 | P1 | `.opencode/commands/doctor/_routes.yaml` uses `mcp__mk_code_index__*` | grep returns 9 mk_code_index refs, 0 system_code_graph |
| REQ-002 | P1 | `.opencode/commands/doctor/update.md` frontmatter uses new namespace | grep returns mk_code_index refs, 0 system_code_graph |
| REQ-003 | P1 | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` descriptions use new namespace | grep verifies 3 mk_code_index refs, 0 system_code_graph |
| REQ-004 | P0 | Launcher startup unchanged | `[mk-code-index-launcher]` prefix |
| REQ-005 | P0 | Final cross-tree grep for operational `mcp__system_code_graph__` refs returns zero | `grep -rln` confirms |
| REQ-006 | P0 | Strict validate passes | `validate.sh --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 3 operational files updated; 13 total replacements applied
- 0 operational `mcp__system_code_graph__*` references remain
- Historical packet docs retain their references as documentation
- Launcher startup smoke PASSES
- validate.sh --strict on 020 exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies
- Packets 010, 018, 019 shipped
- 010's rename established `mk-code-index` as the canonical MCP server namespace

### Risks
- The doctor router edits could break the doctor command if a test consumer expected the old namespace. Mitigation: doctor's command handler resolves tools by name at dispatch; the new names match the live MCP server, so the route is now MORE correct than before.
- tool-schemas.ts edits change user-facing routing hint text in `memory_context` and `memory_search` tool descriptions. Tool dispatch behavior is unchanged; only the textual routing hints update.

### Out of Scope (Won't Address)
- Historical packet docs (preserved as documentation)
- Investigating whether other parallel repos / forks have similar drift
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Sweep closes the loop on packet 010's rename.
<!-- /ANCHOR:questions -->
