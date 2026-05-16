---
title: "Feature Specification: Scope-Change Guard"
description: "Broaden the F-002 scan-promotion guard so scope-mismatched full scans cannot replace a populated code graph unless explicitly forced."
trigger_phrases:
  - "026/007/012/005"
  - "scope-change guard"
  - "scope_change_scan_rejected"
  - "forceScopeChange"
  - "F-002 scope fingerprint"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/005-scope-guard"
    last_updated_at: "2026-05-06T07:44:35Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Implemented Phase 005 scope guard"
    next_safe_action: "Review and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0260070120050260070120050260070120050260070120050260070120050000"
      session_id: "026-007-012-005-scope-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved by user for this exact spec folder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Scope-Change Guard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Source Plan** | `../004-remediation/scratch/f002-council-r1-cli-copilot.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Phase 012/004 F-002 fix blocks only the literal zero-node full-scan edge case. Live MCP verification showed the original data-loss mode still exists when a scope-mismatched default scan returns a small nonzero graph and promotes over a populated broad-scope graph.

### Purpose
Protect populated code graphs from accidental scope replacement by blocking full-scan promotion when the stored scope fingerprint differs from the candidate scope fingerprint, unless the operator explicitly passes `forceScopeChange: true`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a scope-fingerprint promotion guard before the existing zero-node guard in `code_graph/handlers/scan.ts`.
- Add `forceScopeChange` to public tool schemas and internal Zod input validation.
- Add regression tests for mismatched nonzero scans, forced scope replacement, and same-scope dramatic shrink behavior.
- Preserve backward compatibility for legacy DBs without stored scope metadata.
- Update Phase 005 documentation and parent child metadata.

### Out of Scope
- Adding a new DB table or column, because `code_graph_metadata` already stores scope metadata.
- Implementing ratio-based shrink detection, because legitimate large same-scope deletes must remain allowed.
- Adding glob fingerprinting for `includeGlobs` or `excludeGlobs`; the council marked that as a separate hardening item.
- Touching unrelated memory, hook, skill advisor, or code graph query behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modify | Add `scopeChangePromotionBlocked` and blocked response before the zero-node guard. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Expose `forceScopeChange` on `code_graph_scan`. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Validate and allow `forceScopeChange`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Modify | Add F-002 scope-change guard regression tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Modify | Add schema acceptance coverage for `forceScopeChange`. |
| `specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/005-scope-guard/*` | Create | Level 2 packet docs, metadata, ADR, and implementation summary. |
| `specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/graph-metadata.json` | Modify | Add `005-scope-guard` to `children_ids`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Block scope-mismatched full scans over populated graphs. | A full scan with prior nodes, stored fingerprint, different candidate fingerprint, and no `forceScopeChange` returns `status: "blocked"` and `reason: "scope_change_scan_rejected"`. |
| REQ-002 | Preserve the existing graph when scope promotion is blocked. | Blocked scope-change scans do not call `removeFile`, `persistIndexedFileResult`, `setLastGitHead`, `setCodeGraphScope`, or `recordCandidateManifest`, and response `totalNodes` remains the prior count. |
| REQ-003 | Keep the more informative guard order. | A scope-mismatched scan that also returns zero candidate nodes reports `scope_change_scan_rejected`, not `zero_node_scan_rejected`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Allow intentional scope replacement. | Passing `forceScopeChange: true` allows a nonzero mismatched full scan to promote and update stored scope metadata. |
| REQ-005 | Allow legitimate same-scope shrink. | A full scan with the same stored fingerprint may shrink from a large prior graph to a small nonzero graph without being blocked. |
| REQ-006 | Maintain legacy DB compatibility. | Missing stored scope metadata or missing stored fingerprint does not block promotion; the next successful scan establishes metadata through `setCodeGraphScope()`. |
| REQ-007 | Expose the new operator override consistently. | Public JSON schema, Zod input schema, and allowed-key list all accept `forceScopeChange`. |

### Acceptance Scenarios

- **Given** a populated graph stored from `includeSkills: true`, **When** a default-scope full scan returns five clean nodes without `forceScopeChange`, **Then** promotion is blocked with `scope_change_scan_rejected`.
- **Given** the same populated broad graph, **When** the default-scope full scan passes `forceScopeChange: true`, **Then** promotion succeeds and scope metadata changes to the default fingerprint.
- **Given** a populated graph and unchanged stored scope fingerprint, **When** a full scan returns a dramatically smaller nonzero graph, **Then** promotion succeeds because the guard is not ratio-based.
- **Given** a legacy DB with no stored fingerprint, **When** a full scan runs, **Then** promotion is not blocked by the scope guard.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Scope-mismatched nonzero full scans over populated graphs return `status: "blocked"` and `reason: "scope_change_scan_rejected"`.
- **SC-002**: Blocked scope-change scans preserve prior graph totals and avoid destructive promotion side effects.
- **SC-003**: `forceScopeChange: true` bypasses only the scope-change guard, while `forceZeroNodeReset` continues to own same-scope zero-node behavior.
- **SC-004**: Same-scope dramatic nonzero shrink remains allowed.
- **SC-005**: Public schema validation accepts `forceScopeChange`.
- **SC-006**: `npm run build`, targeted vitest suites, code graph vitest directory, alignment verification, and strict spec validation pass or failures are reported with exact evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Guard order changes blocked response reason. | Existing zero-node tests could fail if stored scope setup differs. | Keep default test stored scope equal to default scan scope and add explicit guard-order coverage through the new tests. |
| Risk | Ratio-based expectations may creep into tests. | Legitimate large deletes could become blocked. | Add same-scope dramatic shrink test to prove Option B behavior. |
| Risk | Legacy DBs may not have scope metadata. | First post-upgrade scan could otherwise be blocked incorrectly. | Require `storedScope?.fingerprint` before blocking. |
| Dependency | Existing `getStoredCodeGraphScope()` and `setCodeGraphScope()` metadata helpers. | Guard correctness depends on stable fingerprint semantics. | Reuse `scopePolicy.fingerprint` and stored metadata without schema changes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The user provided the council decision, target spec folder, implementation plan, and verification commands.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Scope-mismatched full scans must fail closed before any live graph mutation.
- **NFR-R02**: Existing same-scope scan safety behavior must remain unchanged.

### Maintainability
- **NFR-M01**: The new predicate must be explicit and readable beside the zero-node predicate.
- **NFR-M02**: Tests must document why the guard is scope-based rather than ratio-based.

### Operator Safety
- **NFR-S01**: The blocked response warning must tell operators to pass `forceScopeChange: true` when replacement is intentional.
- **NFR-S02**: Backward-compatible metadata behavior must avoid blocking legacy DBs without stored fingerprints.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scan Promotion
- Scope mismatch with nonzero candidate nodes: block unless `forceScopeChange: true`.
- Scope mismatch with zero candidate nodes: block with `scope_change_scan_rejected` because scope mismatch is the more informative root cause.
- Same-scope zero-node scan: existing `zero_node_scan_rejected` guard still applies unless `forceZeroNodeReset: true`.
- Same-scope nonzero shrink: promote normally.

### Metadata Compatibility
- `getStoredCodeGraphScope()` returns `null`: do not block.
- `getStoredCodeGraphScope().fingerprint` is `null`: do not block.
- First successful scan after legacy metadata creates stored scope through existing `setCodeGraphScope()`.

### Schema Boundaries
- Unknown scan keys remain rejected by the allowed-key list.
- `forceScopeChange` accepts only boolean values.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Handler, schema, tests, dist rebuild, and packet docs. |
| Risk | 20/25 | Prevents graph data loss and changes scan promotion behavior. |
| Research | 10/20 | Council plan and live verification already identify root cause. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
