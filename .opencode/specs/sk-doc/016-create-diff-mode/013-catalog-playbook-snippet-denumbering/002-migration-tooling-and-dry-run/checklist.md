---
title: "Verification Checklist: Migration Tooling & Dry-Run [133/002/checklist]"
description: "Verification Date: 2026-06-06"
trigger_phrases:
  - "133 phase 002 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 002 checklist during 133 scaffold"
    next_safe_action: "Verify items as the tool is built"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Migration Tooling & Dry-Run

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

- [x] CHK-001 [P0] Requirements + tool contract documented (spec §3-4, plan §3)
- [x] CHK-002 [P0] D1=script and D4 collision policy confirmed
- [x] CHK-003 [P1] Phase 001 convention shipped (target shape known)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Strips only leading `^[0-9]+-` from basename; category dir untouched (REQ-001)
- [x] CHK-011 [P0] Hard-aborts on collision with non-zero exit + report, zero writes (REQ-002)
- [x] CHK-012 [P0] `--dry-run` is default; writes nothing to target trees (REQ-004)
- [x] CHK-013 [P0] Reference rewrite never matches Feature IDs (`M-219`) — `.md`-anchored (REQ-003)
- [x] CHK-014 [P1] Uses `git mv`; scoped staging; never `git add -A` (REQ-007)
- [x] CHK-015 [P1] Idempotent on re-apply (NFR-R01)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Dry-run on a real tree produces a complete, correct manifest (SC-001)
- [x] CHK-021 [P0] Collision abort demonstrated on `16--tooling-and-scripts` (SC-002)
- [x] CHK-022 [P1] Edge-case fixtures pass: `./`/`../`, `#anchor`, code-fence, substring slug (REQ-006)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `algorithmic` (path/string rewrite) + `matrix/evidence`
- [x] CHK-FIX-004 [P0] Adversarial table for the rewrite: delimiter (`#anchor`), joined-input (`../`), no-op (already de-numbered), fallback (missing referrer), Feature-ID-not-matched
- [x] CHK-FIX-005 [P1] Reference-class matrix (self/neighbor/root/external) enumerated before apply
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Tool writes only inside `--tree` + supplied referrers; never outside repo (NFR-S01)
- [x] CHK-031 [P1] DeepSeek brief carries ALLOWED WRITE PATHS = `scratch/**` only (RM-8)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [x] CHK-041 [P1] Collision resolution decision recorded (slug names or merge)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] All tooling + manifests live under `133-.../scratch/` only
- [x] CHK-051 [P1] No target-tree files modified in this phase
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-06-06 (planned)
<!-- /ANCHOR:summary -->
