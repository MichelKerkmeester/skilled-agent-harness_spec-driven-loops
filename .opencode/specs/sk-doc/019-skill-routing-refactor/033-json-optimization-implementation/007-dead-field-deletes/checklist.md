---
title: "Checklist: Remove Routing-Neutral Dead Fields"
description: "QA checklist for deleting confirmed-orphan skill-metadata fields and reconciling the tieBreak/packetSkillName duplicate authorities."
trigger_phrases:
  - "dead field deletes checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/007-dead-field-deletes"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "causal_summary disposition gated on phase 003's canonical-derived-owner decision"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-dead-field-deletes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Remove Routing-Neutral Dead Fields

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until implementation executes (this packet is Planned).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] Requirements documented in `spec.md` with `file:line` evidence for every field's reader status [evidence: `spec.md` §4 REQ-001..REQ-007]
- [ ] CHK-002 [P0] Technical approach and rollback defined in `plan.md` [evidence: `plan.md` §3, §7]
- [ ] CHK-003 [P1] Phase 003's canonical-derived-owner decision read and REQ-004's branch resolved before any `causal_summary` edit [evidence: phase 003 decision artifact reference]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-004 [P0] Every edited JSON file remains valid JSON after deletion (`JSON.parse` or `python -m json.tool` clean) [evidence: per-file parse check output]
- [ ] CHK-005 [P0] No field deleted without a fresh (implementation-time, not research-time) repo-wide grep proving zero non-JSON readers [evidence: T-01/T-02/T-03 grep output]
- [ ] CHK-006 [P1] `sk-doc/hub-router.json`'s `tieBreak` reorder matches `scoreTieBreakOrder()`'s output exactly, with the exception comment added [evidence: diff of `hub-router.json` vs `registry-compiler.cjs` derived order]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-007 [P0] `node ci-skill-root-metadata.cjs` exit 0 fleet-wide after every deletion batch [evidence: gate output, pre/post comparison]
- [ ] CHK-008 [P0] `node parent-skill-check.cjs` clean for `sk-code` and `sk-doc` [evidence: per-hub doctor output]
- [ ] CHK-009 [P0] `python3 skill_graph_compiler.py` validate mode exit 0 fleet-wide, proving `derived` block edits do not trip required-field checks [evidence: compiler validation output]
- [ ] CHK-010 [P1] `npx vitest run routing-registry-drift-guard.vitest.ts` green under whichever REQ-006 branch was chosen [evidence: vitest run output]
- [ ] CHK-011 [P2] Routing-accuracy corpus spot check shows no regression, compared only against the same pinned corpus hash (no single global percentage quoted, per research §4's baseline-sensitivity warning) [evidence: pre/post corpus run, matching hash]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-012 [P0] REQ-001/002/003 deletions land in all confirmed carrying files, not a subset [evidence: file list matches `spec.md` §3 exactly]
- [ ] CHK-013 [P0] REQ-004's `causal_summary` disposition is recorded against phase 003's actual decision, not assumed at spec-authoring time [evidence: `implementation-summary.md` decision citation]
- [ ] CHK-014 [P1] REQ-006's chosen branch is fully applied, including dependent scaffold (`init_skill.py`) and test (`routing-registry-drift-guard.vitest.ts`) edits if the deletion branch is chosen [evidence: diff covering all three files together, not just `mode-registry.json`]
- [ ] CHK-015 [P1] REQ-007's doc note is adjacent to and consistent with the existing schema-separation note in `skill-root-metadata-contract.md` [evidence: diff of the contract file]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-016 [P1] No credentials, tokens, or proprietary data present in any edited JSON before or after this change [evidence: diff inspection]
- [ ] CHK-017 [P2] No field deletion removes a value some other tool reads for an access-control or permission decision [evidence: grep scope in T-01/T-02/T-03 explicitly includes permission/allowlist consumers]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-018 [P1] `spec.md`/`plan.md`/`tasks.md` stay synchronized with the actual REQ-004/REQ-006 branch chosen at implementation time [evidence: no contradicting status across the three docs]
- [ ] CHK-019 [P2] `skill-root-metadata-contract.md`'s new note (REQ-007) is legible to a reader who has not seen this spec [evidence: note reads standalone, no dangling packet-id reference]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-020 [P1] `git diff --stat` at completion lists only files named in `spec.md` §3, nothing else [evidence: diff stat output]
- [ ] CHK-021 [P2] No temp/scratch file left behind from grep or gate runs [evidence: `git status` clean outside the declared diff]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 8 | 0/8 |
| P2 Items | 4 | 0/4 |

**Verification Date**: Planned — not yet executed
<!-- /ANCHOR:summary -->
