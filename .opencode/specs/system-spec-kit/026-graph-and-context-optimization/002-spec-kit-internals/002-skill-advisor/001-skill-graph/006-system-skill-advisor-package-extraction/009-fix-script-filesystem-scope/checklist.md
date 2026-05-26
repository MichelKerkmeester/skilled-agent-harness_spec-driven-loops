---
title: "Verification Checklist: Fix advisor-script filesystem-scope resolution bugs"
description: "Level 2 verification checklist for the two advisor-script path fixes."
trigger_phrases:
  - "013/009/009 checklist"
  - "fix script fs scope verification"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/009-fix-script-filesystem-scope"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Production fixes verified"
    next_safe_action: "013/009 line ready for close-out"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Fix advisor-script filesystem-scope resolution bugs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get operator approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: `spec.md` includes REQ-001 through REQ-006.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
  - **Evidence**: `plan.md` includes `ARCHITECTURE`, `IMPLEMENTATION PHASES`, and `ROLLBACK PLAN`.
- [x] CHK-003 [P1] Dependencies identified and available.
  - **Evidence**: Existing advisor package tests run from `.opencode/skills/system-skill-advisor/mcp_server`.
- [x] CHK-004 [P1] Before-state path proofs captured.
  - **Evidence**: Bug 1 before path `.opencode`; Bug 2 before path `system-skill-advisor/database/skill-graph.sqlite`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `skill_graph_compiler.py` path fix is one-line surgery.
  - **Evidence**: `SKILLS_DIR` changed from four `..` segments to three.
- [x] CHK-011 [P0] `skill_advisor.py` DB path fix is one-line surgery.
  - **Evidence**: `SKILL_GRAPH_SQLITE_PATH` changed from two `..` segments to one before `database`.
- [x] CHK-012 [P1] No scoring math, tool ids, or helper APIs changed.
  - **Evidence**: Diff is limited to the two path lines plus packet docs and metadata.
- [x] CHK-013 [P2] Similar deep `..` chains checked without collateral fixes.
  - **Evidence**: Note-only grep performed in advisor scripts during verification.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Bug 1 path smoke passes after fix.
  - **Evidence**: Python smoke asserts `SKILLS_DIR` ends with `/.opencode/skills`.
- [x] CHK-021 [P0] Bug 2 path smoke passes after fix.
  - **Evidence**: Python smoke asserts `SKILL_GRAPH_SQLITE_PATH` ends with `/mcp_server/database/skill-graph.sqlite`.
- [x] CHK-022 [P0] Vitest pass count does not regress from baseline.
  - **Evidence**: Baseline `279/287`; after `280/287`.
- [x] CHK-023 [P1] Fixture edits were not needed.
  - **Evidence**: Production fixes improved pass count by one; no test files were modified.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] REQ-001 is verified.
  - **Evidence**: `SKILLS_DIR` resolves to `.opencode/skills`.
- [x] CHK-025 [P0] REQ-002 is verified.
  - **Evidence**: `SKILL_GRAPH_SQLITE_PATH` resolves to `mcp_server/database/skill-graph.sqlite`.
- [x] CHK-026 [P1] REQ-005 has no blocked fixture follow-up.
  - **Evidence**: Post-fix Vitest result improved to `280/287`; optional fixture edit path not triggered.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, tokens, or credentials were introduced.
  - **Evidence**: Edits are path constants and packet docs only.
- [x] CHK-031 [P1] Database path stays package-local.
  - **Evidence**: Corrected path is under `system-skill-advisor/mcp_server/database/`.
- [x] CHK-032 [P1] Compiler scan scope is narrowed, not widened.
  - **Evidence**: Corrected path is `.opencode/skills`, not `.opencode`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Level 2 docs authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` created.
- [x] CHK-041 [P1] Metadata files authored and parse as JSON.
  - **Evidence**: `description.json` and `graph-metadata.json` parse with Node.
- [x] CHK-042 [P1] No `decision-record.md` authored.
  - **Evidence**: Packet contains Level 2 docs only.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Scope stayed within the whitelist.
  - **Evidence**: Files touched by this dispatch are the seven packet files plus the two production scripts.
- [x] CHK-051 [P1] No temporary archives or backup files created.
  - **Evidence**: No `.bak`, `.old`, or `_deprecated` files created by this dispatch.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:validation -->
## Validation

- [x] CHK-060 [P1] Packet 009 strict validation passes.
  - **Evidence**: `validate.sh .../009-fix-script-filesystem-scope --strict` exits 0.
- [x] CHK-061 [P1] Parent 013/009 strict validation passes.
  - **Evidence**: `validate.sh .../009-system-skill-advisor-extraction --strict` exits 0.
- [x] CHK-062 [P1] Grandparent 013 strict validation passes.
  - **Evidence**: `validate.sh .../002-semantic-routing-lane --strict` exits 0.
<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-14
**Verified By**: Codex
<!-- /ANCHOR:summary -->
