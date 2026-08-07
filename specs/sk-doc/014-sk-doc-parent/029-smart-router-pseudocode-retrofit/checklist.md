---
title: "Verification Checklist: Smart-router pseudocode retrofit (sk-doc mode packets)"
description: "Verification Date: 2026-07-14"
trigger_phrases:
  - "smart router retrofit checklist"
  - "014 sk-doc phase 029 checklist"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/029-smart-router-pseudocode-retrofit"
    last_updated_at: "2026-07-14T16:56:15.126Z"
    last_updated_by: "claude-opus"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Commit + push non-force to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Smart-router pseudocode retrofit (sk-doc mode packets)

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..006 in `spec.md` §4
- [x] CHK-002 [P0] Technical approach defined in plan.md — TIER FLAT/KEYED architecture in `plan.md` §3
- [x] CHK-003 [P1] Dependencies identified and available — `skill_smart_router.md`, `package_skill.py`, `parent-skill-check.cjs` (`plan.md` §6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `package_skill.py <pkt> --check --strict` = PASS for all 11 packets (sweep table)
- [x] CHK-011 [P0] No console errors or warnings — `parent-skill-check.cjs` exit 0, "all hard invariants passed, 0 warnings"
- [x] CHK-012 [P1] Error handling implemented — every router keeps a multi-tier `UNKNOWN_FALLBACK` branch (disambiguation checklist)
- [x] CHK-013 [P1] Code follows project patterns — routers mirror `create-skill/assets/skill/skill_smart_router.md`; markers verbatim
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — `REQ-001..006` all confirmed via the `package_skill.py --check --strict` sweep (see Fix Completeness below)
- [x] CHK-021 [P0] Manual testing complete — `--check --strict` sweep 11/11 PASS + `parent-skill-check.cjs` STRICT exit 0
- [x] CHK-022 [P1] Edge cases tested — create-diff (no `references/` dir) PASS; create-benchmark word-ceiling (4998 < 5000) PASS
- [x] CHK-023 [P1] Error scenarios validated — merged-heading unit test emits `SMART ROUTING must be its own H2 section`; standalone+3-markers returns `warnings: []`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded — `class-of-bug` (validator loophole) + `cross-consumer` (all 11 packets carry the router contract)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — all 12 registry modes / 11 packet dirs enumerated (`mode-registry.json`; `create-skill-parent` reuses `create-skill`); no packet missed
- [x] CHK-FIX-003 [P0] Consumer inventory for the changed validator — `validate_smart_router` is exercised by `--check` for every packet; re-ran all 11 post-fix (11/11 PASS)
- [x] CHK-FIX-004 [P0] Adversarial test for the parser fix — merged heading (`## 1. When To Use + Smart Routing`) flagged; standalone heading with 3 markers clean; strict-promoted token present in `STRICT_PROMOTED_MARKERS`
- [x] CHK-FIX-005 [P1] Matrix listed — 11 packets × {3 markers, standalone heading, route_ fn} audited via `grep -c` (matrix table)
- [x] CHK-FIX-006 [P1] Hostile-state variant — `validate_smart_router` run from worktree cwd and via `importlib` module import; consistent results
- [x] CHK-FIX-007 [P1] Evidence pinned — pinned to the worktree change set (10 files, `git diff --stat`: 670+/118−) prior to commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — documentation + `package_skill.py` validator only; `git diff --stat` shows no secret material
- [x] CHK-031 [P0] Input validation implemented — every router retains the `_guard_in_skill` sandbox marker (loads confined to the skill dir)
- [x] CHK-032 [P1] Auth/authz working correctly — no auth surface in scope; the 10 touched files (`git diff --stat`) are SKILL.md docs + `package_skill.py`, none on an auth/session path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` §3 file list, `plan.md` affected-surfaces, `tasks.md` T004-T012 all name the same 10 files; Status Complete consistent across docs
- [x] CHK-041 [P1] Code comments adequate — router blocks carry `# Tier 1/2/3` step comments; no ephemeral artifact labels embedded (comment-hygiene respected)
- [x] CHK-042 [P2] README updated (if applicable) — N/A (no packet README affected; router lives in each SKILL.md)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — router template kept in `scratchpad/router-template.md`; not committed
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratchpad/router-template.md` kept out of the tree; no scratch artifacts under the packet or skill dirs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-14
<!-- /ANCHOR:summary -->
