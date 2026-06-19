---
title: "Verification Checklist: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)"
description: "Verification Date: PENDING (both candidates planned, not implemented)"
trigger_phrases:
  - "code graph doc symbol lane checklist"
  - "q5-c1 doc symbol extractor verification"
  - "lease classification telemetry checklist"
  - "symbolkind heading key render tolerance verify"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/008-008-doc-symbol-lane"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level-2 verification checklist (pre-impl done; impl/testing PENDING)"
    next_safe_action: "Implement Track A then check off code-quality + testing items with evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-008-doc-symbol-lane"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Both candidates PENDING — only pre-implementation items are verifiable now"
---
# Verification Checklist: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Phase status:** both candidates are PENDING (absent from 030 §14; only Q4-C1 shipped for Code Graph, `e21caf5de6`). Pre-implementation items are verifiable now; all code-quality, testing, and security items stay unchecked until Track A / Track B are built.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..008 cover deterministic heading/key extraction, SymbolKind extension, render tolerance, additive-off-boundary, glob decision, and the Q7 classifier + no-op emit
- [x] CHK-002 [P0] Technical approach defined in plan.md — two independent tracks (A: SymbolKind + render + extractor slot-in; B: lease classifier + no-op emit), no shared schema migration
- [x] CHK-003 [P1] Dependencies identified and available — SymbolKind union (`indexer-types.ts:13`), `code-graph-context` render path, default globs (`:156-177`), and the absent launcher metrics sink (Red) are all inventoried in plan.md §6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — PENDING (no code written; `node --check` / `tsc` to run at build)
- [ ] CHK-011 [P0] No console errors or warnings — PENDING
- [ ] CHK-012 [P1] Error handling implemented — PENDING (malformed json/yaml/toml degrades to zero keys, not a throw; fenced-code headings skipped)
- [ ] CHK-013 [P1] Code follows project patterns — PENDING (extractor mirrors existing indexer node/edge shapes; `emitLeaseMetric` follows the launcher's pluggable-sink convention)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met — PENDING (REQ-001..008 not yet satisfied)
- [ ] CHK-021 [P0] Manual testing complete — PENDING (`code_graph_scan` over markdown + a config file; query a heading/key node; observe lease classes)
- [ ] CHK-022 [P1] Edge cases tested — PENDING (empty doc, prose-only markdown, empty `{}`, deeply nested keys, malformed config, `#` in fenced block)
- [ ] CHK-023 [P1] Error scenarios validated — PENDING (Q7 sink unavailable → `emitLeaseMetric` no-ops and changes no lease decision)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class — PENDING (Q5-C1 = `class-of-bug`/capability-add on the doc lane; Q7-lease = `cross-consumer` observability on the launcher)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only proven by grep — PENDING (the `=== 'doc'` early-return is the single doc seam, `structural-indexer.ts:1237`; confirm no other doc-return path)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers/schema/response fields — PENDING (every `SymbolKind`-keyed map/switch in `mcp_server/lib` must tolerate `'heading' | 'key'`; the `code-graph-context` formatter is the render consumer)
- [ ] CHK-FIX-004 [P0] Parser/redaction fixes include adversarial table tests — PENDING (heading scanner: fenced-block `#`, Setext vs ATX, value-looks-like-key; config walk: malformed input → 0 nodes)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion — PENDING (axes: {markdown ATX, markdown Setext, json, yaml, toml} × {empty, nested, malformed})
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed — N/A planned (extractor is pure; the launcher classifier reads existing lease state read-only and emits a pure side-effect)
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range — PENDING (no commit yet; Q4-C1 reference SHA `e21caf5de6` is the sibling shipped candidate, not this one)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed by design: the lane handles file content and internal lease classes only; no credentials introduced (NFR-S01/S02)
- [ ] CHK-031 [P0] Input validation implemented — PENDING (config keys extracted by shallow walk, never `eval`/`require`; markdown regex-scanned; no code execution — NFR-S01)
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: no auth surface change; the doc lane and lease telemetry add no new external input path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec.md (REQ-001..008), plan.md (Track A/B sequencing), tasks.md (T001..T017), and implementation-summary.md all carry the same PENDING candidate status and seam citations
- [ ] CHK-041 [P1] Code comments adequate — PENDING (durable WHY only; no spec/packet ids in code comments per comment-hygiene)
- [ ] CHK-042 [P2] README updated (if applicable) — N/A (no folder README; the system-code-graph SKILL.md is out of scope for this sub-phase)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files; this sub-phase holds only spec-doc artifacts
- [x] CHK-051 [P1] scratch/ cleaned before completion — N/A (no scratch/ created)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 2/11 |
| P1 Items | 12 | 5/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: PENDING (planning only — both candidates absent from 030 §14)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
