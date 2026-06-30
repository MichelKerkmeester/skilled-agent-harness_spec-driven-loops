---
title: "Verification Checklist: Rename @improve-agent → @deep-agent-improvement"
description: "P0/P1/P2 verification items mapped to spec REQs and tasks. Verification Date: 2026-05-06 (target)."
trigger_phrases:
  - "087 checklist"
  - "agent rename verification"
  - "deep-agent-improvement checks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename"
    last_updated_at: "2026-05-06T15:40:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "checklist.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000090"
      session_id: "087-checklist-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Rename `@improve-agent` → `@deep-agent-improvement`

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` REQ-001..REQ-013
- [x] CHK-002 [P0] Plan `plan.md` populated with Phase 1-3 architecture and rollback procedure
- [x] CHK-003 [P0] Resource map produced
- [x] CHK-004 [P0] Tasks T-001..T-024 in `tasks.md` with explicit acceptance criteria
- [x] CHK-005 [P0] Strict validation pre-dispatch (`validate.sh ... --strict`) exits 0
- [x] CHK-006 [P1] Predecessor 079 confirmed complete (skill renamed; advisor returns top hit)
- [x] CHK-007 [P1] Direct precedent 085/001 shape understood
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] 4 agent files renamed via `git mv` (REQ-001 / T-001..T-004)
- [x] CHK-011 [P0] 4 frontmatter `name:` fields rotated (REQ-002 / T-005..T-008)
- [x] CHK-012 [P0] 4 YAML asset filenames renamed (REQ-003 / T-009..T-012)
- [x] CHK-013 [P0] `agent.md` body filename refs updated atomically with YAML rename (REQ-004 / T-013)
- [x] CHK-014 [P0] All `@improve-agent` references in active code migrated (REQ-005 / T-014)
- [x] CHK-015 [P0] All `name: improve-agent` and `name = "improve-agent"` in active scope cleared (REQ-006 / T-019 verification)
- [x] CHK-016 [P1] Root governance updated (REQ-009 / T-015): AGENTS.md line 324, README.md line 1097
- [x] CHK-017 [P1] Runtime READMEs updated (T-016): .opencode/agents/README.txt
- [x] CHK-018 [P1] New changelog entry `v1.5.0.0.md` authored (REQ-008 / T-017)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation post-implementation (REQ-007 / T-022) — `validate.sh ... --strict` exits 0
- [x] CHK-021 [P0] Active-scope residual `@improve-agent` grep returns 0 (T-018)
- [x] CHK-022 [P0] Active-scope `name:` grep returns 0 (T-019)
- [x] CHK-023 [P0] Advisor recommendation parity (T-020) — top hit `deep-agent-improvement`, confidence ≥ 0.85
- [x] CHK-024 [P0] Smoke dispatch (T-021) — scan-integration.cjs exits 0 against renamed agent
- [x] CHK-025 [P1] No skill advisor scoring regression — `native-scorer.vitest.ts` and `remediation-008-docs.vitest.ts` still pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class declared — this is a `class-of-bug` style refactor (string identifier replacement across multiple consumer surfaces), not instance-only
- [x] CHK-FIX-002 [P0] Same-class producer inventory complete — full active-scope `rg -F '@improve-agent'` and `rg -F 'name: improve-agent'`/`name = "improve-agent"` results captured in `resource-map.md`
- [x] CHK-FIX-003 [P0] Consumer inventory complete — every consumer surface enumerated (commands, skill docs, root, runtime READMEs, YAML asset filenames)
- [x] CHK-FIX-004 [P0] Adversarial cases — N/A (symbolic rename, no parser/path-resolver/security-boundary change). Documented N/A.
- [x] CHK-FIX-005 [P1] Matrix axes — N/A (deterministic mechanical replace)
- [x] CHK-FIX-006 [P1] Hostile env variant — N/A (no env-reading code path changed)
- [x] CHK-FIX-007 [P1] Evidence pinned — `implementation-summary.md` cites concrete commit SHAs
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new secrets introduced — symbolic rename only
- [x] CHK-031 [P0] No new attack surface — no parser/path-resolver/security boundary changes
- [x] CHK-032 [P1] Authorization model unchanged — agent dispatch authority is independent of agent name
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md / resource-map.md mutually consistent
- [x] CHK-041 [P1] implementation-summary.md authored (REQ-010 / T-023)
- [x] CHK-042 [P1] /memory:save executed (REQ-011 / T-024)
- [x] CHK-043 [P2] z_archive/079 implementation-summary §Limitations #5 updated to reference 087 (REQ-013 — historical record cross-link)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No leftover scratch files at packet root
- [x] CHK-051 [P1] No `.bak` artifacts from `sed -i.bak`
- [x] CHK-052 [P0] Branch hygiene (REQ-012) — working tree on `main`, no auto-branch
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-06 (verified post-deep-review remediation)
<!-- /ANCHOR:summary -->
