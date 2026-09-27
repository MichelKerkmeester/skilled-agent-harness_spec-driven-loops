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

- [x] T001 Confirm the parent's release message and phase 001's commit, then check each released path is clean with `git status --porcelain` (S0)
- [x] T002 Record the operator's answers to spec.md section 12 in ADR-005 and in the lane plan (`decision-record.md`)
- [x] T003 Retake every baseline in plan.md section 5 on the post-001 tree (scratch folder only) (S1)
- [x] T004 [P] Carry the measured identity rule, frontmatter completion and checker into the Stage 2 toolkit (scratch folder only)
- [x] T005 [P] Preflight the transports: `command -v devin`, `devin auth status`, `command -v pi` (scratch log)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Replace the three template defaults with `"{{CHANGELOG_IDENTITY_PHRASE}}"`, dry run then apply (`.skilled/skills/system-spec-kit/templates/changelog/phase.md`, `root.md`) (S2)
- [x] T007 Lane E1: derive and render the identity phrase (`.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts`) (S3)
- [x] T008 Lane E2: add the phase, root and ten-token cases (`.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts`) (S4)
- [x] T009 Rebuild `dist/` and render this folder without `--write` (`.skilled/skills/system-spec-kit/runtime/cli/dist/`, gitignored) (S5)
- [x] T010 [P] Lane E3: document the identity phrase (`.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md`) (S6)
- [x] T011 [P] Lane E4: frontmatter in the format contract, step 4 and the validation list (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`) (S7)
- [x] T012 [P] Lane E5: the block, the identity rule and the description rule (`.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`) (S7)
- [x] T013 [P] Lane E6: the exemplar note and example blocks (`.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md`) (S7)
- [x] T014 Lane E7: step 4 generates the block, step 5 checks it (`.skilled/commands/create/assets/create-changelog-auto.yaml`) (S7)
- [x] T015 Lane E8: the same two steps (`.skilled/commands/create/assets/create-changelog-confirm.yaml`) (S7)
- [x] T016 Lanes E9a to E9c: CHG-011, CHG-012 and the playbook index section (`.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/`) (S8)
- [x] T017 [P] Judgment lanes T01 to T17, D01, R01 and D02: topic phrases for the skill and release entries with no editorial title, descriptions for the 12 residue entries (scratch folder only) (S9)
- [x] T018 Run the checker on every judgment record and merge the admitted ones into the retrofit plan (scratch folder only) (S9)
- [x] T019 Retrofit dry run over all 1,959 entries (scratch plan and diff sample) (S10)
- [x] T020 Retrofit apply to the packet-local entries (`specs/**/changelog/**/changelog-*.md`) (S11)
- [x] T021 Retrofit apply to the skill entries (`.skilled/skills/**/changelog/**/v*.md`) (S11)
- [x] T022 Retrofit apply to the release entries (`.skilled/changelog/skilled/**/v*.md`) (S11)
- [x] T023 Remove the five template defaults from the 468 carriers, with the operator's approval (S12)
- [x] T024 Add the changelog frontmatter fields (`.skilled/skills/sk-doc/shared/assets/template-rules.json`) (S13)
- [x] T025 Lane E10: the changelog frontmatter check (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`) (S13)
- [x] T026 Lane E11: tests for the check (`.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py`) (S13)
- [x] T027 Lanes E12 to E14: the three component entries, then their `version:` lines by script (`sk-create-changelog/changelog/v1.3.0.0.md`, `system-spec-kit/changelog/v4.1.2.0.md`, `sk-doc/changelog/v2.2.1.0.md`, three `SKILL.md` files) (S14)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T028 Rerun every baseline and report each delta (scratch folder only)
- [x] T029 Build a scratch index from the final tree: publish status, bytes, phrase counts, negative classes, three latency runs
- [x] T030 Run the findability probes: miss before and hit after for an identity and a topic phrase of each kind, plus two negative controls
- [x] T031 Run `rg-wrapper.mjs structured` for an identity phrase of each kind and read the evidence field
- [x] T032 Sweep `validate_document.py` over every entry and list the dirty files the retrofit skipped
- [x] T033 Check scope: the diff holds only the planned write set, and nothing under retrieval, the committed index, its fixtures or `.hermes/**` changed
- [x] T034 Mark every acceptance row with evidence and write implementation-summary.md
- [x] T035 Run `validate.sh --strict` on this folder and read `RESULT: PASSED`
- [x] T036 Report the skills that need the Hermes sync, and leave the continuity save and the commit to the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

**Blocked now**: nothing. The commit, the committed index rebuild and the Hermes sync are the parent's.
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
- [x] CHK-003 [P1] Dependencies available: the release message, phase 001's commit and the operator's answers
- [x] CHK-004 [P0] Baselines retaken on the post-001 tree before the first write (HEAD 5b4a7ffcf0)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in `runtime/cli` exits 0
- [x] CHK-011 [P0] The vitest and pytest runs print no warning from the changed code (the one Vite config warning predates this phase)
- [x] CHK-012 [P1] The retrofit refuses an unclosed block and a dirty file, and lists both (a scratch case for the block, and the strip pass's first run skipped and listed 468 dirty files)
- [x] CHK-013 [P1] Code comments carry the durable why, with no spec path, packet number or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, or waived by an ADR (17 of 17 Met)
- [x] CHK-021 [P0] The findability probes ran on a scratch index built from the final tree
- [x] CHK-022 [P1] Edge cases covered: leading blank lines, valid-empty lists, three-part versions, the runtime folder with no `SKILL.md`, ten-token trims
- [x] CHK-023 [P1] An invalid lane record is rejected, and its entries keep their identity phrases only (a scratch record was rejected, and no real record was)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug`, since missing metadata is a property of every changelog writer rather than of one file (spec.md section 2)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the global writer, the nested generator and hand-written entries (plan.md affected surfaces)
- [x] CHK-FIX-003 [P0] Consumer inventory completed: trigger index, ripgrep lane, `validate_document.py`, frontmatter versions and the release strip step (plan.md affected surfaces)
- [x] CHK-FIX-004 [P0] Parser cases tested: the rendered block parses for a root and a phase entry, and the template placeholder stays inside quotes. The generator's unescaped title, which breaks on a double quote, is reported as an adjacent defect rather than fixed here
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion: 3 kinds by 4 block states by 3 writers (plan.md affected surfaces)
- [x] CHK-FIX-006 [P1] Hostile shared-tree variant executed: the retrofit runs while other sessions hold dirty files and skips each one (no entry was dirty from another session, and every write rechecked its preimage)
- [x] CHK-FIX-007 [P1] Evidence pinned to the phase commit or an explicit diff range (the working tree against HEAD 2b5e1b2c2d, until the parent's commit)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No brief carries a secret, and no lane opened a `.env` file (a scan of every brief found no secret, and no lane output names a `.env` file)
- [x] CHK-031 [P0] Judgment lanes had no write target, and git status was unchanged after each one
- [x] CHK-032 [P1] `--permission-mode dangerous` ran only with the operator's explicit approval
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] sk-create-changelog's README checked for a stale format statement
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Briefs, logs and trial output stayed in the session scratch folder outside the repository
- [x] CHK-051 [P1] scratch/ holds only `.gitkeep` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-27 (Stage 2 complete)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 to ADR-005)
- [x] CHK-101 [P1] All ADRs have status (Accepted in the Stage 2 release)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented: the retrofit steps S10 to S12 in plan.md
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Cold lookups under 200 ms at p95 and max on the final tree (NFR-P01)
- [x] CHK-111 [P1] Index growth within 10 percent of the same-day baseline (NFR-P02)
- [x] CHK-112 [P2] Three latency runs on each side of the change
- [x] CHK-113 [P2] Benchmarks recorded in implementation-summary.md
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and the dry-run plan saved
- [x] CHK-121 [P0] Feature flag: not applicable, the change is file content only
- [x] CHK-122 [P1] Monitoring: not applicable, the scratch probes stand in for alerts
- [x] CHK-123 [P1] Runbook: plan.md section 4 followed step by step
- [x] CHK-124 [P2] The parent reviewed the runbook before releasing Stage 2
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed for lanes, tools and write sets
- [x] CHK-131 [P1] Dependency licenses compatible: no new dependency is added
- [x] CHK-132 [P2] OWASP Top 10: not applicable, no network surface changes
- [x] CHK-133 [P2] Data handling: only repository text and this phase's own new text go to the model provider
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] The nested-changelog reference documents the identity phrase
- [x] CHK-142 [P2] sk-create-changelog's SKILL.md and template state the contract
- [x] CHK-143 [P2] The report names the Hermes sync and the parent's index rebuild
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decisions in spec.md section 12 | [x] Approved | 2026-09-27 |
| Parent orchestrator | Stage 2 release and commit | [ ] Approved: release given, commit pending | |
| Phase orchestrator | Verification evidence | [x] Approved | 2026-09-27 |
<!-- /ANCHOR:sign-off -->

