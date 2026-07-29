---
title: "Checklist: Complete the Scaffold-to-Route Journey"
description: "QA checklist for auto-running the H/S class gate --fix from init_skill.py, the compiler-valid derived block, single-sourced S-class config defaults, and the joined scaffold-to-route test."
trigger_phrases:
  - "scaffold to route journey checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/004-scaffold-journey"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/004-scaffold-journey"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Complete the Scaffold-to-Route Journey

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until implementation lands (this packet is Planned).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] Every cited `file:line` re-confirmed against the checked-out tree before code changes begin [evidence: T-01 output]
- [ ] CHK-002 [P1] Pre-fix baseline captured: unmodified `init_skill.py` scaffold fails `skill_graph_compiler.py` validation, and `create-journey-proof.test.cjs`'s current pass line recorded [evidence: T-04 output]
- [ ] CHK-003 [P1] Config single-sourcing direction and joined-test authoring shape decided and recorded before implementation [evidence: T-02, T-03]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-004 [P0] Only the files named in `spec.md` §3 SCOPE are modified — no unrelated cleanup in `init_skill.py`, `generate-leaf-manifest.cjs`, or elsewhere [evidence: `git status`/`git diff` scoped to this phase's touch points]
- [ ] CHK-005 [P1] The class-gate helper mirrors `_run_manifest_command`'s subprocess-and-JSON-parse pattern rather than trusting a bare exit code [evidence: diff of the new helper vs `init_skill.py:354-393`]
- [ ] CHK-006 [P1] `derived` block composition happens after every referenced file is written to disk, in both `init_skill()` and `init_parent_skill()` [evidence: code read + T-13 proof]
- [ ] CHK-007 [P2] The S-class config template (`skill-leaf-manifest-config-template.json`) documented defaults match the single-sourced values after the change [evidence: template diff]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-008 [P0] `create-journey-proof.test.cjs`, `skill-root-metadata-contract.test.cjs`, `leaf-resource-contract.test.cjs` all pass unmodified in behavior after the change [evidence: T-12 output]
- [ ] CHK-009 [P0] New joined test (scaffold -> gate -> ingest -> selection -> compiled route) passes for one S-class and one H-class scaffold [evidence: T-11/T-12 output, test pass line]
- [ ] CHK-010 [P0] `skill_graph_compiler.py`'s `validate_derived_metadata` returns zero errors against a fresh scaffold's `derived` block, standalone and hub, with no hand-editing [evidence: T-13 output — REQ-003]
- [ ] CHK-011 [P1] A plain (no `--fix`) re-check of a fresh scaffold reports `fixed=0` — idempotency [evidence: T-14 output — REQ-001/REQ-002]
- [ ] CHK-012 [P1] A scaffold run against a `--skills-dir` containing one deliberately non-conforming sibling root still succeeds [evidence: T-15 output — REQ-007]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-013 [P0] All seven `spec.md` requirements (REQ-001 through REQ-007) individually verified against real command output, not assumed [evidence: tasks.md T-12 through T-15 cross-referenced to each REQ]
- [ ] CHK-014 [P1] This phase's own suite is confirmed green before Phase 6 (CI compiler/accuracy gate turn-on) begins, per the MUST-precede ordering in `spec.md` §6 [evidence: this checklist's completion date precedes Phase 6's start]
- [ ] CHK-015 [P2] The `--compiled-routing legacy|ready` mint/freshness flow `init_parent_skill()` already ran is unchanged in behavior by the new class-gate call placed alongside it [evidence: diff shows the existing `_run_manifest_command` calls untouched]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-016 [P1] The new joined test only ever writes under `mkdtempSync`-scoped temp directories, never the real `.opencode/skills/` tree [evidence: test source — `try/finally` cleanup, no hardcoded repo-root writes]
- [ ] CHK-017 [P2] The class-gate subprocess call in `init_skill.py` passes an explicit `--skills-dir` rather than relying on an ambient default, so it never accidentally scans or writes outside the intended parent directory [evidence: helper source]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-018 [P1] `tests/README.md`'s file table is updated to list the new joined test, matching whichever authoring shape T-03 chose [evidence: README diff]
- [ ] CHK-019 [P2] Packet continuity (`spec.md`/`implementation-summary.md`) updated to Complete only once all CHK items above are verified [evidence: final continuity block]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-020 [P1] All new/modified files stay within `sk-doc/create-skill/scripts/`, `sk-doc/create-skill/assets/skill/`, and this phase's own spec folder — no file written outside those trees [evidence: `git status` scoped to this phase]
- [ ] CHK-021 [P2] No node_modules symlink or unrelated dependency bump committed alongside this phase's changes [evidence: `git status`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-implementation checks | 3 | 0/3 |
| Code quality | 4 | 0/4 |
| Testing | 5 | 0/5 |
| Fix completeness | 3 | 0/3 |
| Security | 2 | 0/2 |
| Documentation | 2 | 0/2 |
| File organization | 2 | 0/2 |

**Verification Date**: Not yet started (Planned)
<!-- /ANCHOR:summary -->
