---
title: "Implementation Plan: 020 MCP Namespace Operational Sweep"
description: "sed-based replacement of stale mcp__system_code_graph__* in 3 operational files."
trigger_phrases:
  - "020 plan"
  - "mcp namespace operational sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/034-mcp-namespace-operational-sweep"
    last_updated_at: "2026-05-14T21:55:00Z"
    last_updated_by: "orchestrator-mcp-sweep"
    recent_action: "Authored plan"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "020-mcp-namespace-operational-sweep-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 020 MCP Namespace Operational Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Apply `sed -i 's|mcp__system_code_graph__|mcp__mk_code_index__|g'` across 3 operational files. Verify no operational stale refs remain. Launcher startup unchanged. Scoped to operational tree only; historical packet docs preserved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All 13 replacements applied
- Launcher startup smoke PASSES
- Final cross-tree grep for operational `mcp__system_code_graph__` returns zero hits
- validate.sh --strict on 020 exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three target files; three sed invocations (one per file, same pattern). No logic changes — purely text replacement. Verification via grep counts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| File | Replacements |
|------|--------------|
| `.opencode/commands/doctor/_routes.yaml` | 9 (lines 73-78, 111-113) |
| `.opencode/commands/doctor/update.md` | 7 (frontmatter `allowed-tools:`) |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | 3 (description strings on lines 43, 50, plus line 558 historical comment) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Apply sweep
- `sed -i 's|mcp__system_code_graph__|mcp__mk_code_index__|g'` on each of 3 files

### Phase 2: Verify
- grep counts per-file
- Cross-tree grep for any operational stale ref
- Launcher startup smoke

### Phase 3: Commit
- Stage 020 packet + 3 modified files
- Commit on main under correct identity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- Per-file grep verifies replacement count + zero stale refs
- Cross-tree grep verifies operational tree is fully clean
- Launcher smoke verifies no runtime regression
- validate.sh --strict on packet
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- 010 packet (the original rename whose sweep this completes)
- 018, 019 packets (deep-review remediation context)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

`git revert <020-commit-sha>` restores the prior text. No state to roll back beyond the file contents — sweep is purely textual.
<!-- /ANCHOR:rollback -->
