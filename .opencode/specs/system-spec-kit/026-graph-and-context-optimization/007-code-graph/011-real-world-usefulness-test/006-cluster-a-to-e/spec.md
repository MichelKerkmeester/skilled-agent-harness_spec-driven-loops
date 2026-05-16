---
title: "Feature Specification: Code Graph + Advisor + Hooks Polish"
description: "Implement remaining P1 clusters A-E from the Phase 012 deep research across code graph readiness, hook docs, advisor staleness, CocoIndex interop, and glob-aware scan fingerprints."
trigger_phrases:
  - "026/007/012/006"
  - "cluster a to e"
  - "code graph advisor hooks polish"
  - "F-007 F-018 F-019"
  - "F-014 F-015 F-016 F-017"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/006-cluster-a-to-e"
    last_updated_at: "2026-05-06T11:34:49Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Aligned spec with Level 2 contract"
    next_safe_action: "Review verification blockers"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code Graph + Advisor + Hooks Polish

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Blocked on global verification |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Source Research** | `../003-deep-research-issues/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Phase 012 deep research identified 12 remaining P1 findings after the P0 remediation packets. These findings affect read-path operator diagnostics, guarded freshness recovery, verify scope evidence, hook documentation parity, advisor staleness repair, CocoIndex seed interop, and scope fingerprints for scan glob arguments.

### Purpose
Land the five remaining P1 clusters in one bounded packet, with tests for each behavioral fix and documentation corrections for the doc-only findings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cluster A: improve code graph read-path diagnostics, guarded auto-rescan, and verify scope preflight.
- Cluster B: update Copilot and Gemini hook README docs to match implementation behavior.
- Cluster C: harden advisor rebuild and startup skill-graph live publication predicates.
- Cluster D: normalize raw CocoIndex MCP seed fields and update CocoIndex tool docs.
- Cluster E: include `includeGlobs` and `excludeGlobs` in scope fingerprints with legacy compatibility.
- Add regression tests for all code changes and update dist output via `npm run build`.

### Out of Scope
- Changing hook runtime behavior for Cluster B.
- Touching `sk-code`, unrelated hooks, memory search telemetry, or P2 findings.
- Adding new code graph DB tables or changing persisted schema beyond fingerprint string format.
- Enabling unguarded read-path full scans.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Modify | Add readiness diagnostics fields and reason detail for blocked read payloads. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Modify | Use shared guarded auto-rescan policy and richer blocked payloads. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modify | Use shared guarded auto-rescan policy and normalize CocoIndex seed shapes. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` | Modify | Add scope-aware verify preflight/result field. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts` | Modify | Add glob arrays to fingerprint v3 and legacy parsing compatibility. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md` | Modify | Correct session-prime smoke output docs. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md` | Modify | Add SessionStart, compact, SessionEnd registration and smoke examples. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts` | Modify | Rebuild when freshness or trust state is bad. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Assert post-index artifacts before publishing startup advisor live state. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Modify | Document live snake_case MCP result contract and interop note. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/*.vitest.ts` | Modify | Add code graph regression tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modify | Add advisor/startup regression tests. |
| `specs/.../006-cluster-a-to-e/*` | Create | Level 2 packet docs and implementation summary. |
| `specs/.../011-real-world-usefulness-test/graph-metadata.json` | Modify | Add `006-cluster-a-to-e` child ID. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F-007 blocked-read diagnostics are exposed. | Blocked readiness payloads include `activeScope`, `storedScope`, `manifestCount`, `manifestDigest`, and `reason`. |
| REQ-002 | F-018 guarded auto-rescan is enabled only when safe. | Query/context read paths auto-rescan only when stored scope matches active runtime scope and parse-error backlog is below threshold. |
| REQ-003 | F-019 verify reports scope preflight evidence. | `code_graph_verify` includes a scope preflight result and blocks or reports mismatch clearly. |
| REQ-004 | F-014 advisor rebuild repairs mixed bad state. | `advisor_rebuild` skips only when `freshness === "live"` and trust state is not `absent`. |
| REQ-005 | F-015 startup advisor live publication is asserted. | Startup skill-graph indexing publishes `stale/post-index-assertion-failed` if expected artifacts are missing. |
| REQ-006 | F-016 CocoIndex snake_case seeds are accepted. | `code_graph_context` accepts raw `file_path`, `start_line`, `end_line`, and `content` fields. |
| REQ-007 | Cluster E globs affect scan scope fingerprint. | Scope-mismatched scans with only glob argument differences block over populated graphs. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | F-012 Copilot docs match implementation. | README no longer claims session-prime prints status JSON. |
| REQ-009 | F-013 Gemini docs cover non-advisor hook registration. | README includes SessionStart, compact, SessionEnd examples and smoke commands. |
| REQ-010 | F-017 CocoIndex docs match live MCP protocol. | Tool reference documents canonical `file_path`, `start_line`, `end_line`, and `content` fields plus interop normalization. |
| REQ-011 | Legacy fingerprint data degrades gracefully. | Stored v2 fingerprints parse and do not cause first-scan hard blocks solely due to missing glob terms. |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Verification evidence is captured in packet docs. | Checklist and implementation summary record commands and outcomes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:nfr -->
## 5. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| Safety | No automatic full scan may run when scope mismatch or parse backlog makes replacement unsafe. |
| Compatibility | Legacy persisted fingerprints without glob dimensions must not crash or hard-block first repair scans. |
| Maintainability | Shared readiness policy should avoid divergent query/context decisions. |
| Documentation | Doc-only findings remain doc-only. |
| Testing | Add at least eight regression tests across code graph, advisor, and startup surfaces. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

| Case | Expected Handling |
|------|-------------------|
| Stored fingerprint predates glob dimensions. | Treat as legacy-compatible on first comparison and do not crash. |
| Stored scope differs from active runtime scope. | Keep reads blocked and surface active/stored scope diagnostics. |
| Parse diagnostics backlog is above threshold. | Block guarded auto-rescan and report the backlog reason. |
| Raw CocoIndex seed omits nested `lines`. | Accept `start_line` and `end_line` directly. |
| Startup index writes generation but SQLite is absent. | Publish stale state with `post-index-assertion-failed`. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 7. COMPLEXITY

This is a Level 2 packet because it touches several runtime surfaces but avoids schema migrations, new storage tables, and broad architecture changes. The risk is mostly behavioral correctness around readiness gates and startup publication, so focused regression coverage plus existing full-suite gates are sufficient.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:success-criteria -->
## 8. SUCCESS CRITERIA

- All five clusters are fixed or explicitly reported as failed with evidence.
- New tests cover F-007, F-018, F-019, F-014, F-015, F-016, and glob fingerprint behavior.
- `npx vitest run code_graph/tests/`, `npx vitest run skill_advisor/tests/` or equivalent advisor suite, and `npx vitest run tests/` pass or failures are reported verbatim.
- `npm run build` completes and dist output is synchronized.
- Child and parent strict spec validation pass before completion claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Risk | Dependency or Mitigation |
|------|--------------------------|
| Guarded read-path scans could still replace data incorrectly. | Depends on Phase 005 scope-change guard; this packet adds scope and parse-backlog preflight. |
| Legacy fingerprints lack glob terms. | v2 parser remains compatible and v3 is emitted when globs are present. |
| Build and broad tests fail in dirty workspace. | Completion status remains blocked until unrelated deleted files and failing suites are repaired. |
| Hook docs drift into runtime changes. | Cluster B remains markdown-only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

1. Should the missing pre-existing `matrix_runners/adapter-cli-copilot.ts` and deleted Copilot hook tree be restored in this packet or handled as a separate cleanup packet?
2. Should the broad parity/python compat failures in `skill_advisor/tests/` be triaged separately after this cluster packet?
<!-- /ANCHOR:questions -->
