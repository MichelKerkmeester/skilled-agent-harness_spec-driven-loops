---
title: "Verification Checklist: Code Graph Gold-Query Battery Repair"
description: "Verification checklist for the battery repair that must prove Code Graph gold queries pass and structural read tools unlock."
trigger_phrases:
  - "gold query battery checklist"
  - "code graph verify checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/014-gold-query-battery-repair"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "openai-gpt-5-5"
    recent_action: "Completed verification checklist with final evidence"
    next_safe_action: "Restart the mk-code-index MCP server so patched runtime code is loaded"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code Graph Gold-Query Battery Repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase folder created under the Code Graph parent. Evidence: `014-gold-query-battery-repair/` contains Level 2 docs and metadata.
- [x] CHK-002 [P0] Scope and stable tool-ID constraints documented in `spec.md`. Evidence: `spec.md` preserves `code_graph_query`, `code_graph_context`, `code_graph_scan`, `code_graph_verify`, and `detect_changes`.
- [x] CHK-003 [P1] Current battery and companion fixture read before editing. Evidence: `code-graph-gold-queries.json` and `exclude-rule-confidence.json` were inspected before patching.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `code-graph-gold-queries.json` uses current `system-code-graph` paths for Code Graph anchors. Evidence: full 28-query battery passed with current `system-code-graph` source files.
- [x] CHK-011 [P0] `code-graph-gold-queries.json` uses current `system-skill-advisor` paths for advisor anchors. Evidence: advisor handler/lib queries passed in the battery.
- [x] CHK-012 [P1] Outdated Spec Kit ownership regression rewritten to current extraction boundary. Evidence: `GQ-REG-003` now targets `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` and expects `CODE_GRAPH_TOOL_SCHEMAS`, `TOOL_DEFINITIONS`, and `validateToolArgs`.
- [x] CHK-013 [P1] `exclude-rule-confidence.json` has no stale extraction path evidence if it references moved code. Evidence: stale extraction path grep returned no asset hits.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `code_graph_scan` completes for the required workspace scope. Evidence: broad incremental scan completed with the established all-`.opencode` scope; known shell parse warnings remained non-blocking.
- [x] CHK-021 [P0] `code_graph_verify` passes against the repaired battery. Evidence: full built verifier run passed 28/28 with `overall_pass_rate: 1`, `edge_focus_pass_rate: 1`, `missingSymbols: []`, and `unexpectedErrors: []`.
- [x] CHK-022 [P0] Representative `code_graph_query` answers instead of blocking on `verificationGate: "fail"`. Evidence: normal outline query returned `status: "ok"` after the verified pass.
- [x] CHK-023 [P1] Grep confirms no stale `system-spec-kit/mcp_server/code_graph` or `system-spec-kit/mcp_server/skill_advisor` expectations remain in repaired assets. Evidence: asset grep for stale Code Graph and Advisor extraction paths returned no files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified: stale verification assets plus verifier self-blocking on failed persisted baseline.
- [x] CHK-FIX-002 [P0] Producer inventory complete: battery asset, confidence fixture, verifier probes, query readiness gate, persisted verification metadata.
- [x] CHK-FIX-003 [P1] Consumer inventory complete: public `code_graph_query` remains fail-closed; verifier-only probes can recover and persist a real passing baseline.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced.
- [x] CHK-031 [P0] Public read path still refuses stale or failed verification states.
- [x] CHK-032 [P1] Internal bypass value is narrow and typed as `gold-query-verifier` only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Parent timeline updated after verification evidence exists. Evidence: timeline regeneration was deferred until after scan, verify, and read smoke evidence existed.
- [x] CHK-034 [P1] `implementation-summary.md` records changed files, verification, and limitations. Evidence: summary records asset edits, runtime verifier recovery, tests, and restart limitation.
- [x] CHK-035 [P1] `tasks.md` and this checklist are synchronized before completion. Evidence: both files mark all repair and verification items complete.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-040 [P1] New phase files stay under `014-gold-query-battery-repair/`.
- [x] CHK-041 [P1] Repaired assets stay in their original resilience research asset folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |

**Verification Date**: 2026-06-07.
<!-- /ANCHOR:summary -->
