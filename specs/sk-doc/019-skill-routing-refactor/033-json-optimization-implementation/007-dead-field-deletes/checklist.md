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
- [x] CHK-001 [P0] Requirements documented with reader-status evidence [evidence: `spec.md` §4 + implementation-time re-greps recorded in tasks T-01..T-03]
- [x] CHK-002 [P0] Approach + rollback defined [evidence: `plan.md` §3, §7 — data-only edits, `git revert` restores fully]
- [x] CHK-003 [P1] 003's decision read before any causal_summary edit [evidence: 003 decision record — Python-compiler shape canonical → annotate-not-remove branch]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-004 [P0] All edited JSON valid [evidence: `python3 -m json.tool` 16/16 parse clean]
- [x] CHK-005 [P0] Fresh zero-reader greps before every deletion [evidence: implementation-time rg over ts/js/cjs/mjs/py — only tolerated hit is init_skill's trigger_examples scaffold literal; LUNA re-verified independently (angle 2)]
- [x] CHK-006 [P1] tieBreak matches the derived order exactly [evidence: LUNA angle 4 — exact `Object.keys(routerSignals)` 12-entry match; derive-not-copy exception documented in the contract doc (JSON cannot carry comments; unknown routerPolicy keys risk the doctor)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-007 [P0] Fleet gate post-change [evidence: checked=11 passed=11 failed=0, matches pre-change baseline]
- [x] CHK-008 [P0] Doctors clean [evidence: sk-code, sk-doc, and system-deep-loop (modes gained top-level keys) all exit 0]
- [x] CHK-009 [P0] Compiler validate green fleet-wide [evidence: "VALIDATION PASSED: all metadata files are valid"]
- [x] CHK-010 [P1] Drift-guard green under the DELETE branch [evidence: 4-file vitest set 31/31 including the rewritten assertion]
- [x] CHK-011 [P2] Corpus spot check: byte-identical pre/post in BOTH regimes against the same pinned corpus [evidence: warm 0.5692/0.9843/108-3-1 and no-sqlite 0.5333/0.9843/101-3-1, both unchanged]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-012 [P0] All carrying files edited, none skipped [evidence: 7+2 description, sk-code graph-metadata, 7 mode-registry — LUNA angle 1 confirmed exactly the in-scope set]
- [x] CHK-013 [P0] causal_summary disposition recorded against 003's actual decision [evidence: implementation-summary Key Decisions cites the Python-canonical merged-shape choice]
- [x] CHK-014 [P1] DELETE branch fully applied across registry + scaffold + test [evidence: one diff covering all 7 mode-registry.json + init_skill.py + drift-guard vitest; LUNA angles 3/5/7]
- [x] CHK-015 [P1] Contract-doc note consistent with the existing schema-separation note [evidence: appended section covers causal_summary prose status, tieBreak derive-not-copy, and the spec-folder-vs-skill-root regenerator collision]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-016 [P1] No credentials/tokens in edited JSON [evidence: diffs are key deletions + one array reorder + one key addition, all routing metadata]
- [x] CHK-017 [P2] No permission/access-control reader affected [evidence: zero-reader greps spanned all ts/js/cjs/mjs/py including permission surfaces; deleted fields are advisory metadata only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-018 [P1] Docs synchronized on the chosen branches [evidence: spec.md amendment section + tasks T-09/T-11 + implementation-summary all record Python-canonical (REQ-004) and DELETE-with-deep-loop-uniformity (REQ-006)]
- [x] CHK-019 [P2] Contract note reads standalone [evidence: appended section explains behavior in durable terms, no packet ids]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-020 [P1] Diff scoped to the spec's file set [evidence: LUNA angle 1 — exactly the 20 in-scope files; the 2 extra dirty files are a different live session's WIP, excluded from this phase's commit]
- [x] CHK-021 [P2] No temp/scratch left behind [evidence: DB-mask trap-restores verified; dispatch artifacts live in the session scratchpad, not the repo]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
