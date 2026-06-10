---
title: "Verification Checklist: Phase 4: Release and Program Cleanup [system-spec-kit/028-mcp-to-cli-tool-transition/004-release-and-program-cleanup/checklist]"
description: "Verification Date: pending"
trigger_phrases:
  - "028 release cleanup checklist"
  - "004 release-and-program-cleanup checklist"
  - "cli transition doc cleanup verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/004-release-and-program-cleanup"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Scaffolded Level 2 verification checklist"
    next_safe_action: "Mark items with evidence as task groups close"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 4: Release and Program Cleanup

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified (workstreams 001-003 shipped; in-flight agents on groups a/g)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code changes made by this phase (doc-only scope honored; defects routed to owning workstreams)
- [ ] CHK-011 [P1] Doc patches are surgical (drift-only edits; no style rewrites of accurate content)
- [ ] CHK-012 [P1] No machine-local absolute paths or account identifiers leaked into docs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] SC-001 stale-claim grep run per group; hit-free evidence attached (no doc claims MCP-only access for the three systems)
- [ ] CHK-021 [P0] SC-002 bidirectional ENV_REFERENCE-vs-code env var diff clean (all 11 shipped vars documented; no phantom vars)
- [ ] CHK-022 [P1] Playbook file-count self-checks and catalog indexes re-verified against directory listings
- [ ] CHK-023 [P1] IN-FLIGHT rows (groups a/g) reconciled against the concurrent agents' final output, not duplicated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each drift finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (a stale MCP-only claim found in one README triggers the same grep across all in-scope READMEs).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed docs (cross-references from commands, SKILL.md routers, and playbook indexes to edited surfaces re-verified).
- [ ] CHK-FIX-004 [P1] Matrix axes listed before completion: 3 systems x doc groups (a)-(h), with per-cell verified/patched/no-drift state.
- [ ] CHK-FIX-005 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or env var VALUES in any doc edit (names/defaults/semantics only)
- [ ] CHK-031 [P1] Changelog entries reviewed for sensitive operational detail before publishing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Groups (a)-(c): skill, code, and top-level READMEs aligned or "no drift" recorded with evidence (REQ-001)
- [ ] CHK-041 [P0] ENV_REFERENCE.md rows added for all new CLI env vars (REQ-002)
- [ ] CHK-042 [P0] Release changelog entries published in all three tracks via skill-local paths (REQ-003)
- [ ] CHK-043 [P1] Group (d): doctor routes verified; memory/code-graph probe gap dispositioned; memory:*/speckit:* CLI-fallback references added where warranted (REQ-004)
- [ ] CHK-044 [P1] Group (e): agent rosters swept across 3 runtimes; updates only where CLI-relevant (REQ-005)
- [ ] CHK-045 [P1] Group (g): catalogs + playbooks reconciled incl. 028 CLI stress scenarios (REQ-006)
- [ ] CHK-046 [P1] Spec/plan/tasks synchronized; implementation-summary.md authored at close
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] Commits scoped via `git commit --only -- <paths>`; `git show --stat HEAD` verified (shared index)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 2/11 |
| P1 Items | 13 | 1/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending (phase in progress)
<!-- /ANCHOR:summary -->
