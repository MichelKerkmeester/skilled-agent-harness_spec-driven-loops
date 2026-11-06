---
title: "Tasks: Phase 1: skill-and-tag-move"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skill and tag move tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: skill-and-tag-move

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`D` is `.skilled/commands/doctor`, `K` is `.skilled/skills/system-skilled-doctor`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline (`D/scripts/tests/`). Verify: `node --test D/scripts/tests/*.test.cjs` prints `pass 1005` and `fail 0`; the drift guard prints `Tests 5 passed (5)`.
- [x] T002 Capture advisor routing on 12 integration prompts (scratch only). Verify: "put Skilled into my project repo" printed `command-doctor-helper:0.80`, and four prompts printed no recommendation.
- [x] T003 Scaffold the skill (`K/`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py system-skilled-doctor --path .skilled/skills` printed `initialized successfully`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fill `K/SKILL.md`, `K/ROUTER.md`, `K/README.md` and `K/graph-metadata.json`. Verify: `rg -n "TODO" K/SKILL.md K/ROUTER.md` prints nothing.
- [x] T005 Move ten `skill_agent` tags (`D/{install,symlink,update,setup,helper,runtime-mirrors,env,speckit,mcp,agents-md}.md`). Verify: `grep -m1 -H skill_agent D/*.md` shows `system-skilled-doctor` for those ten.
- [x] T006 Update the four pinned contract tests (`D/scripts/tests/doctor-{install,helper,symlink,agents-md}-contract.test.cjs`). Verify: before the update they printed `fail 4`, after it `pass 107` and `fail 0`.
- [x] T007 Regenerate the bridges (`derive-command-bridges.cjs`). Verify: every doctor bridge for the ten commands reads `skillId: system-skilled-doctor`.
- [x] T008 Move the README doctor table (`.skilled/skills/system-spec-kit/README.md` to `K/README.md`). Verify: `rg -n "Seven doctor commands" .skilled/skills/system-spec-kit/README.md` prints nothing.
- [x] T009 Write `K/changelog/v1.0.0.0.md` and the playbook (`K/manual-testing-playbook/`). Verify: `check_changelog_shape.py` prints `pass=1 fail=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun the whole doctor gate. Verify: `node --test D/scripts/tests/*.test.cjs` prints `pass 1005` and `fail 0`, the baseline count.
- [x] T011 Rerun the drift guard and the graph validator. Verify: `Tests 5 passed (5)` and `VALIDATION PASSED`.
- [x] T012 Rerun advisor routing on the same 12 prompts. Verify: `system-skilled-doctor` ranks first on 8 of 12, including "put Skilled into my project repo" at 0.95.
- [x] T013 Check the package and the mirrors. Verify: `validate_skill_package.py K --strict` prints `PASS`, and the Hermes and runtime-mirror checks print `PASS`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. The only code changes are one string in each of four tests.
- [x] CHK-011 [P0] No console errors or warnings. The doctor suite printed `fail 0`.
- [x] CHK-012 [P1] Error handling implemented. N/A: no runtime code changed.
- [x] CHK-013 [P1] Code follows project patterns. The skill was scaffolded by `init_skill.py` and passes `validate_skill_package.py --strict`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. The 12-prompt advisor run, T012.
- [x] CHK-022 [P1] Edge cases tested. The four pinned tests failed on the moved tag before their update.
- [x] CHK-023 [P1] Error scenarios validated. An asymmetric sibling edge failed nine `sk-skill` converter tests, and replacing it with `enhances` edges cleared them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The tag credit is `cross-consumer`: one tag feeds the bridges and the tests.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. `rg -n "skill_agent: (system-spec-kit|sk-doc)" D/scripts/tests` listed five pins, four moved and the `sk-skill` one stays.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. The deriver's outputs, the contract tests, the Hermes copy and the README table.
- [x] CHK-FIX-004 [P0] Adversarial table tests. N/A: no path, parser or security code changed.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Ten moved commands by two checks: the contract test and the bridge owner.
- [x] CHK-FIX-006 [P1] Hostile env variant. N/A: no change reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. N/A: no input handling changed.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. No new code comments.
- [x] CHK-042 [P2] README updated. The new skill's README holds the owned-command table.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The baseline outputs are in the session scratchpad, outside the repo.
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 22 | 22/22 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-11-06
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
- [x] CHK-101 [P1] All ADRs have status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented. Nothing migrates: each command name runs what it ran before.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met. N/A: no runtime path changed.
- [x] CHK-111 [P1] Throughput targets met. N/A.
- [x] CHK-112 [P2] Load testing completed. N/A.
- [x] CHK-113 [P2] Performance benchmarks documented. N/A.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md` §7: revert this phase's commit.
- [x] CHK-123 [P1] Runbook created. N/A: no deployment.
- [x] CHK-124 [P2] Deployment runbook reviewed. N/A.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. No command gained a write.
- [x] CHK-131 [P1] Dependency licenses compatible. No dependency added.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed. N/A.
- [x] CHK-133 [P2] Data handling compliant. N/A.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation complete. N/A.
- [x] CHK-142 [P2] User-facing documentation updated. The skill README and changelog.
- [x] CHK-143 [P2] Knowledge transfer documented in `implementation-summary.md`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Plan approver | [x] Approved the build plan | 2026-11-06 |
<!-- /ANCHOR:sign-off -->
