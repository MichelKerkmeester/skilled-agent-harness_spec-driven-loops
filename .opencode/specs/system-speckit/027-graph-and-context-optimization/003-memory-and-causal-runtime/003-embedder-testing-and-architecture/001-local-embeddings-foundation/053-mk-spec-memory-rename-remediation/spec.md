---
title: "Remediate 052 Deep-Review Findings"
description: "Close the conditional 052 deep-review findings for the mk-spec-memory rename: namespace ownership corrections, shipped packet metadata, runtime config parity, and review registry resolution."
trigger_phrases:
  - "053 mk-spec-memory rename remediation"
  - "052 deep-review remediation"
  - "close 052 findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/053-mk-spec-memory-rename-remediation"
    last_updated_at: "2026-05-15T05:59:52Z"
    last_updated_by: "main_agent"
    recent_action: "Created remediation packet and applied all 052 review fixes"
    next_safe_action: "Run strict validation on 052 and 053, then commit scoped files"
    blockers: []
    key_files:
      - ".opencode/commands/doctor.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/memory/manage.md"
      - ".vscode/mcp.json"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename/plan.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename/resource-map.md"
    session_dedup:
      fingerprint: "sha256:ecb569346fa88eb2bb4b8b1912650ab82f3f0facf86ca7c3c4689dba1551a96e"
      session_id: "main-2026-05-15-053-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "SpawnAgent was not used"
      - "Gate 3 points to this 053 packet"
---
# Remediate 052 Deep-Review Findings

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 052-mk-spec-memory-rename |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 052 rename shipped functionally, but deep review found command-layer namespace regressions and stale packet documentation. Extracted code-graph, CCC, and advisor tools were over-renamed under `mk-spec-memory`, and the packet metadata still described a draft scaffold instead of the shipped state.

### Purpose

Close the 052 review findings without broadening the rename: correct tool ownership, align VS Code launcher config, refresh shipped packet docs, and mark findings resolved with a back-pointer to this remediation packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct `/doctor` and `/memory:manage` command tool namespaces.
- Refresh 052 plan, spec status, graph metadata, resource-map counts, and validation evidence.
- Align `.vscode/mcp.json` to the `mk-spec-memory` launcher.
- Mark the 052 review findings registry as resolved.
- Create this Level 1 remediation packet.

### Out of Scope
- Editing historical `.opencode/specs/**/*.md` audit-trail references outside the 052 packet docs listed above.
- Renaming raw MCP tool names.
- Changing unrelated MCP server names or runtime configs.
- Touching parallel-session worktree changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor.md` | Modify | Route code_graph, detect_changes, ccc, and advisor allowlist entries to their owning MCP namespaces. |
| `.opencode/commands/doctor/_routes.yaml` | Modify | Route `skill-advisor` advisor tools to `mk-skill-advisor` and clarify ownership comments. |
| `.opencode/commands/memory/manage.md` | Modify | Route CCC examples and allowlist entries to `mk-code-index`. |
| `.vscode/mcp.json` | Modify | Use `.opencode/bin/mk-spec-memory-launcher.cjs`. |
| `../052-mk-spec-memory-rename/plan.md` | Modify | Replace scaffold with actual rename plan. |
| `../052-mk-spec-memory-rename/spec.md` | Modify | Mark shipped, completion 100, correct packet pointer, and fix old-prefix criteria. |
| `../052-mk-spec-memory-rename/graph-metadata.json` | Modify | Mark derived status complete and refresh key files. |
| `../052-mk-spec-memory-rename/resource-map.md` | Modify | Add `.mcp.json` and `.vscode/mcp.json`; reconcile counts. |
| `../052-mk-spec-memory-rename/implementation-summary.md` | Modify | Record strict validation PASS. |
| `../052-mk-spec-memory-rename/review/deep-review-findings-registry.json` | Modify | Mark findings resolved in this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command allowlists use owning MCP namespaces. | Grep for `mcp__mk_spec_memory__(code_graph|ccc|advisor|detect_changes)` in the three command files returns zero. |
| REQ-002 | 052 packet metadata reflects shipped state. | `spec.md` status is shipped, completion is 100, and graph metadata status is complete. |
| REQ-003 | 052 and 053 validate strictly. | `validate.sh --strict` exits 0 for both folders. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Runtime config parity includes VS Code. | `.vscode/mcp.json` launches `mk-spec-memory` through `.opencode/bin/mk-spec-memory-launcher.cjs`. |
| REQ-005 | Review registry records resolution. | Findings registry entries include `status: resolved`, `resolved_in`, and `resolved_at`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 P1 and 5 P2 target findings are fixed.
- **SC-002**: No namespace leaks remain in command-layer allowed tools or examples.
- **SC-003**: Both 052 and 053 strict spec validation commands exit 0.
- **SC-004**: Commit contains only the allowed remediation files and this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parallel sessions have unrelated worktree edits. | Accidental staging could include unrelated files. | Stage explicit pathspecs only. |
| Risk | Findings registry currently differs from the review-report contract. | Registry could lose newer worktree details. | Preserve current registry entries and annotate them resolved rather than reverting. |
| Dependency | `validate.sh` behavior for Level 1 packets. | Completion claim depends on strict validation. | Run validation on both packets before commit. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
