---
title: "Verification Checklist: Phase 4: Release and Program Cleanup [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup/checklist]"
description: "Verification Date: pending"
trigger_phrases:
  - "028 release cleanup checklist"
  - "004 release-and-program-cleanup checklist"
  - "cli transition doc cleanup verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All P0/P1 verified with evidence; SC-001/SC-002 green"
    next_safe_action: "Phase closed; parent map + continuity reconciled"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
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

- [x] CHK-010 [P0] No code changes made by this phase (doc-only scope honored; defects routed to owning workstreams) — diff confined to commands/ + references/ docs; 3 code/config defects FOUND were reported, not fixed (doctor parity gap; .claude mcp grant naming; code-graph launcher_lease doc)
- [x] CHK-011 [P1] Doc patches are surgical (drift-only edits; no style rewrites of accurate content) — 26 files, +53/-19; Lane E made 0 edits (verified-no-change)
- [x] CHK-012 [P1] No machine-local absolute paths or account identifiers leaked into docs — grep of added lines clean (no /Users, /home, account ids, secret-like tokens)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] SC-001 stale-claim grep run per group; hit-free evidence attached (no doc claims MCP-only access for the three systems) — zero sole-path MCP assertions, zero live Gemini/Devin refs across commands/agents/references
- [x] CHK-021 [P0] SC-002 bidirectional ENV_REFERENCE-vs-code env var diff clean (all 11 shipped vars documented; no phantom vars) — 11/11 matched, 0 missing, 0 phantom
- [x] CHK-022 [P1] Playbook file-count self-checks and catalog indexes re-verified against directory listings — self-check methodology count = 399 = expected
- [x] CHK-023 [P1] IN-FLIGHT rows (groups a/g) reconciled against the concurrent agents' final output, not duplicated — T010-T012, T070-T072 closed in waves 1-2; verified not re-edited
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each drift finding has a finding class — class = `cross-consumer` (MCP-only doc claim recurring across command/reference surfaces); doctor warm-only-probe drift = `class-of-bug` (all 4 probe occurrences fixed)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — SC-001 grep run across ALL in-scope surfaces (commands/agents/references); residual hits = zero
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed docs — memory/speckit consumers swept; resume.md (the doc the global CLI-fallback policy pairs with) covered; route-validate confirms doctor cross-refs
- [x] CHK-FIX-004 [P1] Matrix axes listed before completion: 3 systems x doc groups (a)-(h) — per-cell state recorded in implementation-summary.md
- [x] CHK-FIX-005 [P1] Evidence pinned to a fix SHA or explicit diff range — pinned to the wave-3 release-cleanup commit (recorded in implementation-summary.md at close)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or env var VALUES in any doc edit (names/defaults/semantics only) — grep of added lines for `=<value>` patterns clean
- [x] CHK-031 [P1] Changelog entries reviewed for sensitive operational detail before publishing — published wave 2 (3 tracks); no machine-local detail
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Groups (a)-(c): skill, code, and top-level READMEs aligned or "no drift" recorded with evidence (REQ-001) — completed waves 1-2 (T010-T012, T020-T024, T030-T031)
- [x] CHK-041 [P0] ENV_REFERENCE.md rows added for all new CLI env vars (REQ-002) — T060 done; SC-002 confirms 11/11
- [x] CHK-042 [P0] Release changelog entries published in all three tracks via skill-local paths (REQ-003) — wave 2 (v3.5.0.5 / v1.2.0.0 / v0.7.0)
- [x] CHK-043 [P1] Group (d): doctor routes verified; memory/code-graph probe gap dispositioned; memory:*/speckit:* CLI-fallback references added where warranted (REQ-004) — 14 files patched; parity gap now FIXED (operator sign-off 2026-06-10): warm-only CLI probes added to both doctor yamls + _routes.yaml, route-validate.sh passes
- [x] CHK-044 [P1] Group (e): agent rosters swept across 3 runtimes; updates only where CLI-relevant (REQ-005) — verified-no-change (correctly conservative)
- [x] CHK-045 [P1] Group (g): catalogs + playbooks reconciled incl. 028 CLI stress scenarios (REQ-006) — waves 1-2; stress scenarios 434-438 authored AND executed (triple-verified PASS)
- [x] CHK-046 [P1] Spec/plan/tasks synchronized; implementation-summary.md authored at close — this reconciliation pass
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — N/A: no scratch/ used; stress sandboxes confined to `/tmp` mktemp dirs (removed)
- [x] CHK-051 [P1] scratch/ cleaned before completion — N/A (none created); /tmp sandboxes cleaned
- [x] CHK-052 [P1] Commits scoped via `git commit --only -- <paths>`; `git show --stat HEAD` verified (shared index) — wave-3 commit scoped to commands/ + references/ + 004 docs; verified post-commit
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-10 (all P0/P1 verified; T041 dispositioned-deferred per REQ-004)
<!-- /ANCHOR:summary -->
