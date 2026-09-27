---
title: "Tasks: Phase 2: changelog-findability"
description: "Ordered Stage 2 tasks for changelog findability: baselines, born-findable writers, DeepSeek judgment lanes, the deterministic retrofit of 1,959 entries, validator enforcement and the whole-gate verification."
trigger_phrases:
  - "changelog findability tasks"
  - "changelog retrofit checklist"
  - "changelog metadata verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: changelog-findability

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

**Task Format**: `T### [P?] Description (file path)`

Step numbers S0 to S15 refer to plan.md section 4.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm the parent's release message and phase 001's commit, then check each released path is clean with `git status --porcelain` (S0)
- [ ] T002 [B] Record the operator's answers to spec.md section 12 in ADR-005 and in the lane plan (`decision-record.md`)
- [ ] T003 Retake every baseline in plan.md section 5 on the post-001 tree (scratch folder only) (S1)
- [ ] T004 [P] Carry the measured identity rule, frontmatter completion and checker into the Stage 2 toolkit (scratch folder only)
- [ ] T005 [P] Preflight the transports: `command -v devin`, `devin auth status`, `command -v pi` (scratch log)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Replace the three template defaults with `"{{TRIGGER_PHRASE}}"`, dry run then apply (`.skilled/skills/system-spec-kit/templates/changelog/phase.md`, `root.md`) (S2)
- [ ] T007 Lane E1: derive and render the identity phrase (`.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts`) (S3)
- [ ] T008 Lane E2: add the phase, root and ten-token cases (`.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts`) (S4)
- [ ] T009 Rebuild `dist/` and render this folder without `--write` (`.skilled/skills/system-spec-kit/runtime/cli/dist/`, gitignored) (S5)
- [ ] T010 [P] Lane E3: document the identity phrase (`.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md`) (S6)
- [ ] T011 [P] Lane E4: frontmatter in the format contract, step 4 and the validation list (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`) (S7)
- [ ] T012 [P] Lane E5: the block, the identity rule and the description rule (`.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`) (S7)
- [ ] T013 [P] Lane E6: the exemplar note and example blocks (`.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md`) (S7)
- [ ] T014 Lane E7: step 4 generates the block, step 5 checks it (`.skilled/commands/create/assets/create-changelog-auto.yaml`) (S7)
- [ ] T015 Lane E8: the same two steps (`.skilled/commands/create/assets/create-changelog-confirm.yaml`) (S7)
- [ ] T016 Lane E9: CHG-011, CHG-012 and the playbook index section (`.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/`) (S8)
- [ ] T017 [P] Judgment lanes J1 to J17: topic phrases for the skill and release entries with no editorial title, descriptions for the 15 residue entries (scratch folder only) (S9)
- [ ] T018 Run the checker on every judgment record and merge the admitted ones into the retrofit plan (scratch folder only) (S9)
- [ ] T019 Retrofit dry run over all 1,959 entries (scratch plan and diff sample) (S10)
- [ ] T020 Retrofit apply to the packet-local entries (`specs/**/changelog/**/changelog-*.md`) (S11)
- [ ] T021 Retrofit apply to the skill entries (`.skilled/skills/**/changelog/**/v*.md`) (S11)
- [ ] T022 Retrofit apply to the release entries (`.skilled/changelog/skilled/**/v*.md`) (S11)
- [ ] T023 [B] Remove the five template defaults from the 468 carriers, only with the operator's approval (S12)
- [ ] T024 Add the changelog frontmatter fields (`.skilled/skills/sk-doc/shared/assets/template-rules.json`) (S13)
- [ ] T025 Lane E10: the changelog frontmatter check (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`) (S13)
- [ ] T026 Lane E11: tests for the check (`.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py`) (S13)
- [ ] T027 Lane E12: the mode's own entry and its version line (`.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.3.0.0.md`, `SKILL.md`) (S14)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T028 Rerun every baseline and report each delta (scratch folder only)
- [ ] T029 Build a scratch index from the final tree: publish status, bytes, phrase counts, negative classes, three latency runs
- [ ] T030 Run the findability probes: miss before and hit after for an identity and a topic phrase of each kind, plus two negative controls
- [ ] T031 Run `rg-wrapper.mjs structured` for an identity phrase of each kind and read the evidence field
- [ ] T032 Sweep `validate_document.py` over every entry and list the dirty files the retrofit skipped
- [ ] T033 Check scope: the diff holds only the planned write set, and nothing under retrieval, the committed index, its fixtures or `.hermes/**` changed
- [ ] T034 Mark every acceptance row with evidence and write implementation-summary.md
- [ ] T035 Run `validate.sh --strict` on this folder and read `RESULT: PASSED`
- [ ] T036 Report the skills that need the Hermes sync, and leave the continuity save and the commit to the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed

**Blocked now**: T001 and T002 wait for the parent's release message and the operator's answers. T023 waits for the operator's approval of the generic phrase removal.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md (sections 4 and 5, Stage 1)
- [x] CHK-002 [P0] Technical approach defined in plan.md (sections 3 and 4, Stage 1)
- [ ] CHK-003 [P1] Dependencies available: the release message, phase 001's commit and the operator's answers
- [ ] CHK-004 [P0] Baselines retaken on the post-001 tree before the first write
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npm run typecheck` in `runtime/cli` exits 0
- [ ] CHK-011 [P0] The vitest and pytest runs print no warning from the changed code
- [ ] CHK-012 [P1] The retrofit refuses an unclosed block and a dirty file, and lists both
- [ ] CHK-013 [P1] Code comments carry the durable why, with no spec path, packet number or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met, or waived by an ADR
- [ ] CHK-021 [P0] The findability probes ran on a scratch index built from the final tree
- [ ] CHK-022 [P1] Edge cases covered: leading blank lines, valid-empty lists, three-part versions, the runtime folder with no `SKILL.md`, ten-token trims
- [ ] CHK-023 [P1] An invalid lane record is rejected, and its entries keep their identity phrases only
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug`, since missing metadata is a property of every changelog writer rather than of one file (spec.md section 2)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the global writer, the nested generator and hand-written entries (plan.md affected surfaces)
- [x] CHK-FIX-003 [P0] Consumer inventory completed: trigger index, ripgrep lane, `validate_document.py`, frontmatter versions and the release strip step (plan.md affected surfaces)
- [ ] CHK-FIX-004 [P0] Parser cases tested: the rendered block parses for a root and a phase entry, and the template placeholder stays inside quotes. The generator's unescaped title, which breaks on a double quote, is reported as an adjacent defect rather than fixed here
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion: 3 kinds by 4 block states by 3 writers (plan.md affected surfaces)
- [ ] CHK-FIX-006 [P1] Hostile shared-tree variant executed: the retrofit runs while other sessions hold dirty files and skips each one
- [ ] CHK-FIX-007 [P1] Evidence pinned to the phase commit or an explicit diff range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief carries a secret, and no lane opened a `.env` file
- [ ] CHK-031 [P0] Judgment lanes had no write tools, and git status was unchanged after each one
- [ ] CHK-032 [P1] `--permission-mode dangerous` ran only with the operator's explicit approval
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] sk-create-changelog's README checked for a stale format statement
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Briefs, logs and trial output stayed in the session scratch folder outside the repository
- [ ] CHK-051 [P1] scratch/ holds only `.gitkeep` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 6/16 |
| P1 Items | 23 | 3/23 |
| P2 Items | 9 | 1/9 |

**Verification Date**: 2026-09-27 (Stage 1 planning only)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 to ADR-005)
- [x] CHK-101 [P1] All ADRs have status (Proposed, awaiting the parent's review)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented: the retrofit steps S10 to S12 in plan.md
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Cold lookups under 200 ms at p95 and max on the final tree (NFR-P01)
- [ ] CHK-111 [P1] Index growth within 10 percent of the same-day baseline (NFR-P02)
- [ ] CHK-112 [P2] Three latency runs on each side of the change
- [ ] CHK-113 [P2] Benchmarks recorded in implementation-summary.md
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and the dry-run plan saved
- [ ] CHK-121 [P0] Feature flag: not applicable, the change is file content only
- [ ] CHK-122 [P1] Monitoring: not applicable, the scratch probes stand in for alerts
- [ ] CHK-123 [P1] Runbook: plan.md section 4 followed step by step
- [ ] CHK-124 [P2] The parent reviewed the runbook before releasing Stage 2
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed for lanes, tools and write sets
- [ ] CHK-131 [P1] Dependency licenses compatible: no new dependency is added
- [ ] CHK-132 [P2] OWASP Top 10: not applicable, no network surface changes
- [ ] CHK-133 [P2] Data handling: only committed repository text goes to the model provider
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] The nested-changelog reference documents the identity phrase
- [ ] CHK-142 [P2] sk-create-changelog's SKILL.md and template state the contract
- [ ] CHK-143 [P2] The report names the Hermes sync and the parent's index rebuild
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decisions in spec.md section 12 | [ ] Approved | |
| Parent orchestrator | Stage 2 release and commit | [ ] Approved | |
| Phase orchestrator | Verification evidence | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

