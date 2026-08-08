---
title: "Checklist: Manual Testing Playbook FAIL Remediation"
description: "Evidence-bearing acceptance checks for the 30-row remediation design, follow-on fixes, operator actions, documented SKIPs, and zero-FAIL rerun."
status: "remediation planned; implementation pending"
completion_pct: 25
trigger_phrases:
  - "manual playbook remediation checklist"
  - "zero FAIL acceptance checklist"
  - "runtime remediation evidence"
  - "operator action verification"
importance_tier: "critical"
contextType: "checklist"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/012-playbook-fails-remediation"
    last_updated_at: "2026-08-08T16:27:56Z"
    last_updated_by: "claude"
    recent_action: "Authored five-doc remediation design from verified 30-fail reconciliation"
    next_safe_action: "Implement repo fixes and operator actions before rerunning suites"
    blockers: []
    key_files:
      - ".opencode/specs/hooks/002-injection-bloat-reduction/012-playbook-fails-remediation/plan.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs"
      - ".opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs"
      - ".opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs"
      - ".opencode/skills/sk-git/scripts/tests/git-preflight-advisory.test.mjs"
    session_dedup:
      fingerprint: "sha256:5fc31cc6df7cebb5994697b79f624dc3edec2a7036f929655cadc5218bd22528"
      session_id: "2026-08-08-hooks-002-012"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Checklist: Manual Testing Playbook FAIL Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

P0 items are hard blockers for the follow-on implementation. P1 items require completion or an approved deferral. P2 items are optional. A design-authoring check may be marked [x] with evidence from this packet; every remediation or rerun check remains [ ] until the follow-on produces its evidence token.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The Level-2 packet contains spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md with the requested continuity frontmatter. Evidence: spec.md:1-48; plan.md:1-47; tasks.md:1-43; checklist.md:1-41; implementation-summary.md:1-43 (EV-PACKET-5DOCS).
- [x] CHK-002 [P0] The packet records predecessor 011, successor None, priority P1, and pending implementation status. Evidence: spec.md:52-65 (EV-METADATA-011).
- [x] CHK-003 [P0] All 30 verified IDs are present once in the matrix with final class and track. Evidence: plan.md:118-195 (EV-MATRIX-30).
- [x] CHK-004 [P1] The scoring and results authorities are linked without formula duplication. Evidence: spec.md:95-116 (EV-CONTRACT-LINKS).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Codex group covers CX-012, CX-013, CX-014, CX-016, CX-017, CX-018, CX-021, CX-022, CX-023, CX-026, CX-028, CX-003, CX-006, and CX-008 with the matrix's exact scenario edits, shared guidance, operator prerequisites, or SKIP branch. Evidence: PENDING-EV-GROUP-CODEX.
- [ ] CHK-011 [P0] OpenCode group covers CO-004 and CO-024 with prompt/file ordering and canonical CLEAR pointer validation. Evidence: PENDING-EV-GROUP-OPENCODE.
- [ ] CHK-012 [P0] Pi group covers PI-009, PI-011, PI-012, PI-001, and PI-020 with mirror sync, current package semantics, cite-only/SKIP handling, and paired-event identity. Evidence: PENDING-EV-GROUP-PI.
- [ ] CHK-013 [P0] Cursor group covers CU-011, CU-024, CU-026, and CU-004 with operator trust handling, derived roster membership, Shell payload support, and supported plan output evidence. Evidence: PENDING-EV-GROUP-CURSOR.
- [ ] CHK-014 [P0] Devin group covers DV-012, DV-014, DV-015, DV-007, and DV-008 with native skill discovery, current lifecycle behavior, and documented headless-event SKIP. Evidence: PENDING-EV-GROUP-DEVIN.
- [ ] CHK-015 [P0] The three TOOL-BUG seams are fixed and checked: PI-009 mirror generation, PI-020 identity/paired handlers, and CU-026 shared-hook payload delivery. Evidence: PENDING-EV-TOOLBUG-3.
- [ ] CHK-016 [P1] Shared Codex/OpenCode/Pi/Cursor/Devin guidance is updated at its owning file rather than only in a single scenario. Evidence: PENDING-EV-SHARED-OWNERS.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The six OPERATOR-ACTION rows are applied or their permitted fallback is recorded: CX-012, CX-013, CX-014, CX-016, CX-026, and CU-011. Evidence: PENDING-EV-OPERATOR-6.
- [ ] CHK-021 [P0] The four no-becomes-SKIP rows produce documented SKIP: CX-023, PI-011, PI-012, and DV-008. Evidence: PENDING-EV-SKIP-4.
- [ ] CHK-022 [P0] Affected Codex, OpenCode, Pi, Cursor, and Devin suites run through the 011 wrapper after the prerequisites are satisfied. Evidence: PENDING-EV-011-RERUN.
- [ ] CHK-023 [P0] The affected results.csv set contains zero FAIL rows; every remaining row is PASS or documented SKIP. Evidence: PENDING-EV-ZERO-FAIL.
- [ ] CHK-024 [P1] CX-003, CX-017, CU-004, DV-007, and DV-008 rerun evidence retains the raw stdout/stderr or stream events needed to support output-channel and lifecycle claims. Evidence: PENDING-EV-RAW-OUTPUT.
- [ ] CHK-025 [P1] Every SKIP reason names the unavailable TTY, optional host/evidence, trust state, or upstream event capability and does not imply a repository defect. Evidence: PENDING-EV-SKIP-REASONS.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The matrix records all 30 manifest IDs once and reconciles the 25/3/2 class counts plus 20/6/4 fixability counts. Evidence: plan.md:118-195 (EV-RECONCILIATION-COUNTS).
- [ ] CHK-FIX-002 [P0] All 20 IN-REPO FIX rows have a changed scenario file and an owning shared seam when the matrix names one. Evidence: PENDING-EV-REPO-20.
- [ ] CHK-FIX-003 [P0] No operator machine file appears in the repository diff, including Codex profile files, Codex hooks, and Cursor trust state. Evidence: PENDING-EV-NO-MACHINE-DIFF.
- [ ] CHK-FIX-004 [P1] The old Codex flags/profile sections, literal Cursor roster count, unsupported Devin command mirror, old Cursor proxy claim, and duplicate Pi IDs are absent from affected surfaces. Evidence: PENDING-EV-STALE-ORACLE-SWEEP.
- [ ] CHK-FIX-005 [P1] The playbook validator and compiler/report path reject duplicate scenario identity before a result can be associated with the wrong file. Evidence: PENDING-EV-ID-GUARD.
- [ ] CHK-FIX-006 [P1] Pi and runtime mirror checks are run from the final repository state and report no stale generated mirror. Evidence: PENDING-EV-MIRROR-CLEAN.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No scenario installs the optional Pi MCP host, approves Cursor trust, or migrates Codex profiles implicitly. Evidence: PENDING-EV-NO-IMPLICIT-MUTATION.
- [ ] CHK-031 [P0] Codex profile and hook actions have a recoverable local backup and a read-only verification before legacy state is removed. Evidence: PENDING-EV-OPERATOR-ROLLBACK.
- [ ] CHK-032 [P1] The 011 run destination is not baseline/ and historical report records are retained. Evidence: PENDING-EV-REPORT-SAFETY.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Every doc has the requested packet pointer, timestamp, author, session dedup block, completion_pct below 100, and pending status. Evidence: spec.md:1-42; plan.md:1-40; tasks.md:1-36; checklist.md:1-34; implementation-summary.md:1-36 (EV-CONTINUITY-5DOCS).
- [x] CHK-041 [P1] The five docs use the Level-2 anchor structure and contain no unresolved scaffold placeholders. Evidence: spec.md:44-47; plan.md:44-47; tasks.md:40-43; checklist.md:38-41; implementation-summary.md:40-43 (EV-TEMPLATE-5DOCS).
- [ ] CHK-042 [P1] Scenario SKIP wording, operator checklist wording, and shared-tool guidance match the final implementation and rerun evidence. Evidence: PENDING-EV-DOC-SYNC.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The authored scope is limited to the five packet docs plus generated packet metadata; unrelated pre-existing untracked review artifacts are preserved. Evidence: spec.md:85-118; plan.md:118-195 (EV-SCOPE-PACKET).
- [ ] CHK-051 [P1] The final scoped diff contains no generated benchmark reports, scratch artifacts, or machine-local configuration. Evidence: PENDING-EV-NO-STRAY-FILES.
- [ ] CHK-052 [P2] The parent packet's strict validation and whole workspace gate are rerun after implementation. Evidence: PENDING-EV-PARENT-GATE.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Pending |
|----------|-------|----------|---------|
| Design authoring P0/P1 | 7 | 7 | 0 |
| Runtime and shared fixes | 7 | 0 | 7 |
| Operator and SKIP outcomes | 2 | 0 | 2 |
| Wrapper/rerun proof | 6 | 0 | 6 |
| File and safety checks | 5 | 2 | 3 |

**Verification Date**: 2026-08-08. This packet proves design coverage only; remediation implementation and the zero-FAIL rerun remain pending.
<!-- /ANCHOR:summary -->
