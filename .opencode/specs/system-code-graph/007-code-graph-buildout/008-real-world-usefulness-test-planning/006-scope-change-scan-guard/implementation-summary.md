---
title: "Implementation Summary: Scope-Change Guard"
description: "Completion record for the Phase 005 F-002 scope-change scan promotion guard."
trigger_phrases:
  - "026/007/012/005 summary"
  - "scope-change guard implementation"
  - "scope_change_scan_rejected"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/006-scope-change-scan-guard"
    last_updated_at: "2026-05-06T07:44:35Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Recorded final evidence"
    next_safe_action: "Review and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:4444444444444444444444444444444444444444444444444444444444444444"
      session_id: "026-007-012-006-scope-change-scan-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-scope-change-scan-guard |
| **Completed** | 2026-05-06 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 005 broadens the F-002 safety guard from "candidate scan has zero nodes" to "candidate scan comes from a different scope fingerprint." That closes the live failure where a default-scope scan with a handful of fixture nodes could replace a populated skill-inclusive graph.

### Scope-Change Promotion Guard

The handler now compares the stored live scope fingerprint with the current candidate fingerprint before full-scan reconciliation. A mismatch over a populated graph returns `scope_change_scan_rejected`, preserves the prior graph totals, and tells the operator to rerun with `forceScopeChange: true` when replacement is intentional.

### Schema Override

The schema change adds `forceScopeChange` beside `forceZeroNodeReset` in the public MCP schema, internal Zod schema, and allowed-key list.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modified | Add scope-change guard and blocked response. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Expose `forceScopeChange`. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Validate and allow `forceScopeChange`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Modified | Add scope guard regression tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Add schema acceptance coverage. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/006-scope-change-scan-guard/*` | Created | Add Phase 005 planning, ADR, checklist, and summary docs. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The new test was run before the handler change and failed with `expected 'ok' to be 'blocked'`, proving the old predicate missed the nonzero mismatch. After implementation, source build, targeted code graph vitest, full code graph vitest directory, tool-input schema vitest, alignment drift check, and strict child/parent spec validation passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use scope fingerprint comparison. | It targets the actual failure mode without arbitrary shrink thresholds. |
| Add explicit `forceScopeChange`. | Operators need a clear intentional replacement path separate from zero-node resets. |
| Leave DB schema unchanged. | Existing `code_graph_metadata` scope helpers already provide the needed stored fingerprint. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-change failing test run | PASS: new mismatch test failed before implementation with received `ok`. |
| `npm run build` | PASS: exit 0. |
| `npx vitest run code_graph/tests/code-graph-scan.vitest.ts` | PASS: 1 file, 36 tests. |
| `npx vitest run code_graph/tests/` | PASS: 20 files, 265 tests. |
| `npx vitest run tests/tool-input-schema.vitest.ts` | PASS: 1 file, 86 tests. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server` | PASS with 6 warnings outside changed files. |
| Child strict validation | PASS: exit 0. |
| Parent strict validation | PASS: exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Glob narrowing remains separate.** The reused scope fingerprint does not include `includeGlobs` or `excludeGlobs`; that matches the council plan and can be hardened separately.
2. **Legacy DB first scan is allowed.** Missing stored fingerprints do not block so existing databases can establish metadata on their next successful scan.
<!-- /ANCHOR:limitations -->
