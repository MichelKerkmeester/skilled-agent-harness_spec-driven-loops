---
title: "Implementation Summary: 020 MCP Namespace Operational Sweep"
description: "Closure manifest for the 3-file operational sweep of stale mcp__system_code_graph__* references."
trigger_phrases:
  - "020 implementation summary"
  - "mcp namespace operational sweep results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-034-mcp-namespace-operational-sweep"
    last_updated_at: "2026-05-14T21:55:00Z"
    last_updated_by: "orchestrator-mcp-sweep"
    recent_action: "Closed 13 stale namespace refs across 3 files"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "020-mcp-namespace-operational-sweep-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 020 MCP Namespace Operational Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `020-mcp-namespace-operational-sweep` |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
| **Operational stale refs found** | 13 across 3 files |
| **After sweep** | 0 operational stale refs remain |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Replacement Manifest

| File | Before | After | Lines Affected |
|------|--------|-------|----------------|
| `.opencode/commands/doctor/_routes.yaml` | 9 `mcp__system_code_graph__*` refs | 9 `mcp__mk_code_index__*` refs | 73-78 (code_graph_* + detect_changes), 111-113 (ccc_*) |
| `.opencode/commands/doctor/update.md` | 7 frontmatter `mcp__system_code_graph__*` refs | 7 `mcp__mk_code_index__*` refs | line 4 (allowed-tools array) |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | 3 `mcp__system_code_graph__*` refs | 3 `mcp__mk_code_index__*` refs | lines 43 + 50 (memory_context + memory_search routing-hint descriptions), line 558 (historical comment) |

### Method
Single `sed -i 's|mcp__system_code_graph__|mcp__mk_code_index__|g'` invocation per file. Pure text replacement, no logic changes. Defensive: only operational files swept; historical packet markdown documents (007 / 010 / 011 / 014 packet handover etc.) retained as documentation of the rename's pre-state.

### Final State
- `_routes.yaml`: 9 `mk_code_index` refs, 0 stale
- `update.md`: 1+ `mk_code_index` refs in the frontmatter list, 0 stale
- `tool-schemas.ts`: 3 `mk_code_index` refs, 0 stale
- Cross-tree grep for operational stale refs: 0 hits
- Historical packet docs: preserved as-is
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Direct main-agent Bash + sed. The user's prompt "Fix all remaining findings if relevant" prompted an audit beyond the 017 review's scope; the audit surfaced 3 operational files still emitting the legacy namespace despite packet 010's rename. These were missed-spot bugs from 010's sweep — the doctor router allowlist, doctor update command frontmatter, and tool-schema description routing hints. None affected runtime correctness yet (the MCP server itself was correctly renamed), but they would have surfaced as broken tool invocations the next time `/doctor code-graph` or `/doctor update` ran.

The historical packet docs (010's own spec, 007's MCP topology pivot, 014's handover, etc.) intentionally retain `mcp__system_code_graph__*` references as documentation of the rename's pre-state. Sweeping those would erase the audit trail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Sweep operational source only, leave historical packet docs | Historical docs serve as evidence of the rename; they SHOULD mention both names to document the migration. Operational source (yaml routes, command frontmatter, live tool descriptions) needs to match the live MCP namespace. |
| Single sed pattern, no regex complexity | The replacement is unambiguous: `mcp__system_code_graph__` is only ever the MCP namespace prefix; there's no other context where this string appears. A simple global replace is safe. |
| File-by-file rather than tree-wide sweep | Targeted at the 3 specific operational hits. Avoids accidentally touching historical packet docs that intentionally retain the old name. |
| No `.bak` files committed | sed left `.bak` artifacts (macOS BSD sed requires `-i ""` or a backup extension); I cleaned them up post-replacement. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `_routes.yaml` mk_code_index refs | 9 |
| `_routes.yaml` system_code_graph refs | 0 |
| `update.md` mk_code_index refs | ≥1 (in `allowed-tools:` array) |
| `update.md` system_code_graph refs | 0 |
| `tool-schemas.ts` mk_code_index refs | 3 |
| `tool-schemas.ts` system_code_graph refs | 0 |
| Cross-tree grep for operational stale refs | 0 hits (only historical .md docs remain) |
| Launcher startup smoke | PASS — `[mk-code-index-launcher]` prefix |
| validate.sh --strict on 020 | (run before commit, target exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Cached deferred-tool lists**: client MCP sessions may continue showing `mcp__system_code_graph__*` namespace entries in their cached tool lists until `/mcp` reconnects refresh them. This packet fixes the source files; the live cache refreshes on next reconnect.
2. **Historical packet docs retain the old name**: this is intentional. Searching for "mcp__system_code_graph__" in spec packet documents will still return hits in the 007 (MCP topology pivot), 010 (rename packet itself), and 014 (extraction handover) packet markdown. Those references document the rename's history and should not be sweepable.
3. **No regression test added**: a unit test for the doctor router that verifies the allowlist uses the live MCP namespace would catch future drift. Future packet could add this. For now, manual verification via the cross-tree grep is the gate.
<!-- /ANCHOR:limitations -->
