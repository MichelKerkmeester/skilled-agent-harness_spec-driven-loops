---
title: "Verification Checklist: Deep-context native agent runtime mirror parity"
description: "Verification Date: 2026-06-07"
trigger_phrases:
  - "deep-context mirror checklist"
  - "runtime mirror verification"
  - "deep-context parity checklist"
  - "agent mirror verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/005-runtime-mirror-parity"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked verification items with evidence"
    next_safe_action: "Reconcile parent completion metadata"
    blockers: []
    key_files:
      - ".claude/agents/deep-context.md"
      - ".codex/agents/deep-context.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-005-runtime-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deep-context native agent runtime mirror parity

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..006 + Given/When/Then acceptance criteria
- [x] CHK-002 [P0] Technical approach defined in plan.md — canonical-source + runtime-mirror pattern
- [x] CHK-003 [P1] Dependencies identified and available — canonical agent + sibling mirror conventions confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Codex TOML parses; Claude `.md` frontmatter valid YAML
- [x] CHK-011 [P0] No console errors or warnings — N/A runtime; static agent defs; TOML parser ran clean
- [x] CHK-012 [P1] Error handling implemented — N/A; read-only agent bodies inherit canonical behavior
- [x] CHK-013 [P1] Code follows project patterns — mirrors match `context.md`/`context.toml`/`deep-research` conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — parity ✓✓✓, body diff identical, TOML valid, read-only confirmed
- [x] CHK-021 [P0] Manual testing complete — `agent: deep-context` resolves to a per-runtime file in all three dirs
- [x] CHK-022 [P1] Edge cases tested — TOML `'''` safety verified; wildcard code-graph grant avoided
- [x] CHK-023 [P1] Error scenarios validated — missing-mirror condition documented as the resolved gap
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified — `cross-consumer` (per-runtime agent dirs consume the canonical agent by name)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — three-way parity matrix: deep-context was the only agent missing mirrors
- [x] CHK-FIX-003 [P0] Consumer inventory completed — both loop YAMLs dispatch `agent: deep-context`; command names the native pool; SKILLs document it
- [x] CHK-FIX-004 [P0] Security/path/parser cases — N/A no path/redaction/parser logic; TOML body-escaping case verified (no `'''`)
- [x] CHK-FIX-005 [P1] Matrix axes listed — axis = runtime {OpenCode, Claude, Codex}; rows = 3; all present
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant — N/A; no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence pinned — evidence is file existence + body diff + TOML parse against working-tree files
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — bodies identical to audited canonical; no credentials
- [x] CHK-031 [P0] Input validation implemented — N/A no input surface; read-only analyzer
- [x] CHK-032 [P1] Auth/authz working correctly — read-only contract preserved (no Write/Edit/Bash/Task; Codex read-only sandbox)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the same five-file change set and verification
- [x] CHK-041 [P1] Code comments adequate — Codex header carries `# Converted from:` provenance + MCP note
- [x] CHK-042 [P2] README updated (if applicable) — N/A; convention captured in two SKILL.md files instead
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no stray temp files; assembly done inline
- [x] CHK-051 [P1] scratch/ cleaned before completion — scratch/ holds only .gitkeep
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-07
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
