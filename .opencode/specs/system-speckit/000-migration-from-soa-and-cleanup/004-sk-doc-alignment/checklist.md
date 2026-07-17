---
title: "Verification Checklist: Align sk-doc numbering by coordinating with the live concurrent migration"
description: "Verification checklist for the sk-doc numbering-alignment coordination packet. Carries the hard-gate P0 item (sk-doc working tree clean) that blocks this packet's own completion until the concurrent migration session commits."
trigger_phrases:
  - "sk-doc numbering alignment checklist"
  - "sk-doc working tree clean gate"
  - "sk-doc concurrent migration verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored checklist with hard-gate CHK-004 item"
    next_safe_action: "Mark CHK-004/CHK-020 only after sk-doc tree is clean"
    blockers:
      - "sk-doc tree dirty from concurrent migration (929 paths: 926 D + 3 untracked, mtime to 07:52); no git-mv/rm until clean."
    key_files:
      - ".opencode/specs/sk-doc/z_archive/"
      - ".opencode/specs/sk-doc/015-sk-doc-parent/"
      - ".opencode/specs/sk-doc/016-hub-doc-conformance-fixes/"
      - ".opencode/specs/sk-doc/030-benchmark-authoring-centralization/"
      - ".opencode/specs/sk-doc/019-sk-doc-router-alignment/"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/"
      - ".opencode/specs/sk-doc/033-create-diff-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Close 014 gap via archive renumber, or leave intentionally open?"
      - "Is 016->030 a reserved range, or should it renumber contiguously?"
    answered_questions: []
---
# Verification Checklist: Align sk-doc numbering by coordinating with the live concurrent migration

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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md; evidence: `spec.md` sections 2-5 define the problem, scope, requirements (REQ-001..005), and success criteria.
- [x] CHK-002 [P0] Technical approach defined in plan.md; evidence: `plan.md` sections 1-4 define the gate-then-verify coordination approach and phases.
- [x] CHK-003 [P1] Dependencies identified and available; evidence: `plan.md` section 6 names the concurrent sk-doc migration session as the sole blocking dependency.
- [ ] CHK-004 [P0] **HARD GATE - sk-doc working tree clean**: `git status --porcelain -- .opencode/specs/sk-doc` returns zero lines. Evidence as of 2026-07-16: it returned 929 lines (926 `D` + 3 `??`). This item cannot be marked `[x]` until the concurrent session commits and the check is re-run with a clean result. No git-mv/rm against sk-doc may be proposed while this item is unchecked.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] N/A - no code changed in this phase; evidence: this packet's diff is limited to `spec.md`, `plan.md`, `tasks.md`, `checklist.md` under its own folder; no source files were touched.
- [x] CHK-011 [P0] N/A - no command YAML/JSON metadata authored in this phase; `description.json`/`graph-metadata.json` are explicitly deferred to downstream generation per this scaffold's own instructions.
- [x] CHK-012 [P1] N/A - no runtime error handling applies to documentation-only output.
- [x] CHK-013 [P1] Docs follow project template patterns; evidence: `spec.md`/`plan.md`/`tasks.md`/`checklist.md` mirror `.opencode/skills/system-spec-kit/templates/manifest/*.md.tmpl` Level 2 sections and the real Level 2 reference packet `.opencode/specs/cli-external-orchestration/025-cli-codex-deprecation/`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met; pending - SC-003 in `spec.md` (clean-tree re-check) is not yet satisfied.
- [x] CHK-021 [P0] Manual testing complete for the documentation-only scaffold; evidence: every repo-state claim in `spec.md`/`plan.md` was produced by the `git status`/`git ls-files`/`ls`/`find`/`git log` commands run in this session, not assumed.
- [ ] CHK-022 [P1] Edge cases tested; deferred - the edge cases in `spec.md` "L2: EDGE CASES" describe re-check-before-acting behavior that can only be exercised once the concurrent session commits.
- [ ] CHK-023 [P1] Error scenarios validated; deferred to the future verification pass in `plan.md` Phase 3.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `matrix/evidence` (numbering-gap + concurrent dirty-tree coordination), not a code bug; evidence: `spec.md` section 2.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed via `git status --porcelain -- .opencode/specs/sk-doc`; evidence: 929 lines (926 `D`, 3 `??`) captured verbatim in `spec.md`/`plan.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory: none - this phase changes no code, so no downstream consumer of sk-doc numbering (skill-advisor graph, `generate-context.js`, spec-kit graph traversal) is touched; evidence: `spec.md` scope explicitly excludes any sk-doc mutation.
- [x] CHK-FIX-004 [P0] N/A - no security/path/parser/redaction fix in this phase; documentation-only coordination.
- [x] CHK-FIX-005 [P1] Matrix axes listed: archived-vs-active, tracked-vs-untracked, contiguous-vs-gapped; evidence: `spec.md` section 2 and "L2: EDGE CASES".
- [x] CHK-FIX-006 [P1] N/A - no test or code in this phase reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commands run in this session (`git status --porcelain -- .opencode/specs/sk-doc`, `ls`, `find`, `git ls-files`, `git log -1`), not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; evidence: all four authored files are planning/verification markdown only.
- [x] CHK-031 [P0] N/A - no input validation surface; documentation-only.
- [x] CHK-032 [P1] N/A - no auth/authz surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized; evidence: all four cite the same hard gate, the same REQ IDs, and the same concurrent-session dirty-tree numbers (929 paths, 926 `D`, 3 `??`).
- [x] CHK-041 [P1] N/A - no code comments authored; markdown prose only, so comment-hygiene (no spec-paths/packet-ids embedded in code comments) does not apply.
- [ ] CHK-042 [P2] README not applicable; deferred - no README references this coordination packet.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside this packet's four files; evidence: only `spec.md`/`plan.md`/`tasks.md`/`checklist.md` were written under the output directory.
- [x] CHK-051 [P1] N/A - no `scratch/` directory used by this phase.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 11/13 (CHK-004, CHK-020 pending clean-tree re-check) |
| P1 Items | 13 | 11/13 (CHK-022, CHK-023 deferred) |
| P2 Items | 1 | 0/1 (CHK-042 deferred) |

**Verification Date**: 2026-07-16 (scaffold date; final verification date is UNKNOWN pending the concurrent session's commit)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
