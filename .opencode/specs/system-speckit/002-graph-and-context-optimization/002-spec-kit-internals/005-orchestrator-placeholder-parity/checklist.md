---
title: "Verification Checklist: Orchestrator vs shell placeholder-detection parity [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-29"
trigger_phrases:
  - "placeholder parity checklist"
  - "validatePlaceholders verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/002-spec-kit-internals/005-orchestrator-placeholder-parity"
    last_updated_at: "2026-05-29T12:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified parity, rebuilt dist, strict-validate PASSED"
    next_safe_action: "None - packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/005-orchestrator-placeholder-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Orchestrator vs Shell Placeholder-Detection Parity

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..005)
- [x] CHK-002 [P0] Technical approach defined in plan.md (parity contract + dist rebuild)
- [x] CHK-003 [P1] Dependencies identified and available (tsc build present, validate.sh prefers dist)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes build (npm run build completed with no tsc errors)
- [x] CHK-011 [P0] No console errors or warnings (build clean; only the standard SQLite experimental notice elsewhere)
- [x] CHK-012 [P1] Edge handling implemented (fence toggle + backtick-escape guard mirror shell awk/grep)
- [x] CHK-013 [P1] Code follows project patterns (single marker regex constant; comments cite shell parity)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (space variant + fence/backtick excl in dist; mustache removed from shell)
- [x] CHK-021 [P0] Manual testing complete (standalone awk/grep fixture: matched only lines 1-2, dropped escaped/fenced/mustache)
- [x] CHK-022 [P1] Edge cases tested (underscore vs space, plain vs fenced vs inline-backtick, mustache present)
- [x] CHK-023 [P1] Error scenarios validated (unclosed fence toggles identically to shell awk)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` (shared placeholder policy across orchestrator + shell paths).
- [x] CHK-FIX-002 [P0] Same-class producer inventory done: only `orchestrator.ts validatePlaceholders` and `check-placeholders.sh` implement the rule (rg of NEEDS_CLARIFICATION/YOUR_VALUE_HERE in lib + scripts/rules).
- [x] CHK-FIX-003 [P0] Consumer inventory done: `validate.sh run_node_orchestrator` selects the path; scanned-doc scope (`docsForLevel`) unchanged.
- [x] CHK-FIX-004 [P0] Adversarial cases tested: delimiter (space vs underscore), escaped (inline backtick), fenced block, no-op (mustache), fallback (shell path parity).
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan: marker variant x location x mustache-present.
- [x] CHK-FIX-006 [P1] Hostile global-state variant: N/A - rule reads only the doc string, no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence pinned to the dist diff (space-variant marker regex + `inCode` + `charAt` guard present in compiled JS).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (validator rule; no credentials)
- [x] CHK-031 [P0] Input validation: N/A - rule consumes already-read doc strings; no new external input surface
- [x] CHK-032 [P1] Auth/authz: N/A - no auth boundary touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (all reflect the parity contract and completion state)
- [x] CHK-041 [P1] Code comments adequate (orchestrator + shell rule comments cite mutual parity and mustache exclusion rationale)
- [x] CHK-042 [P2] README updated (if applicable): N/A - no user-facing README change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (fixture used /tmp, outside the packet)
- [x] CHK-051 [P1] scratch/ cleaned before completion (no working files left in packet scratch/)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-29
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
