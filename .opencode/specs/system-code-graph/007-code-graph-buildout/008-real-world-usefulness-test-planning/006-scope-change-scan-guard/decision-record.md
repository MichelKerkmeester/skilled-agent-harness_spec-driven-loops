---
title: "Decision Record: Scope-Change Guard"
description: "ADR-001 documents why Phase 005 uses scope-fingerprint guarding instead of ratio-based shrink detection."
trigger_phrases:
  - "026/007/012/005 ADR"
  - "Option B scope fingerprint"
  - "scope-change guard decision"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/006-scope-change-scan-guard"
    last_updated_at: "2026-05-06T07:44:35Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Recorded Option B scope-fingerprint decision"
    next_safe_action: "Keep implementation aligned with ADR-001"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:5555555555555555555555555555555555555555555555555555555555555555"
      session_id: "026-007-012-006-scope-change-scan-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Scope-Change Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:context -->
## 1. CONTEXT

The Phase 012/004 remediation added a zero-node guard for F-002, but live MCP verification found that the original wipe mode still survives. A default-scope scan can produce a small nonzero candidate graph, then promote over a populated skill-inclusive graph because the existing predicate only checks `candidatePersistableNodeCount === 0`.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decisions -->
## 2. DECISIONS

### ADR-001: Use Scope-Fingerprint Guarding for F-002

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decision** | Use Option B: block populated full-scan promotion when the stored code graph scope fingerprint differs from the candidate scope fingerprint unless `forceScopeChange: true` is passed. |
| **Rationale** | The root cause is scope mismatch, not graph size. The existing `getStoredCodeGraphScope()` and `setCodeGraphScope()` metadata infrastructure already records the live fingerprint, so the fix needs no new table, column, or migration. |
| **Operator Path** | `forceScopeChange: true` explicitly authorizes replacing a populated graph with a different nonzero scope. |
| **Backward Compatibility** | Missing stored scope metadata does not block promotion; successful scans continue to establish metadata through `setCodeGraphScope()`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:alternatives -->
## 3. ALTERNATIVES CONSIDERED

| Option | Outcome | Reason |
|--------|---------|--------|
| Option A: ratio-based shrink guard | Rejected | It would false-positive on legitimate large deletions, repository moves, or intentionally smaller same-scope scans. Any threshold would be arbitrary. |
| Option B: scope-fingerprint guard | Accepted | It addresses the actual failure, reuses existing metadata, avoids schema changes, and keeps legitimate same-scope shrink behavior intact. |
| Option C: combine scope fingerprint and ratio checks | Rejected | It adds maintenance burden and false-positive risk without proportional value because the fingerprint guard already catches the reported failure mode. |
<!-- /ANCHOR:alternatives -->

---

<!-- ANCHOR:consequences -->
## 4. CONSEQUENCES

- Scope-mismatched scans over populated graphs fail closed before destructive reconciliation.
- Operators get a separate override for intentional scope replacement.
- Same-scope dramatic shrinks remain allowed, proving the fix is not ratio-based.
- The guard inherits the known fingerprint limitation that `includeGlobs` and `excludeGlobs` are not currently encoded.
<!-- /ANCHOR:consequences -->
