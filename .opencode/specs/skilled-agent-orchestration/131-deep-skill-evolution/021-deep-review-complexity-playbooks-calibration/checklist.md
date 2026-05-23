---
title: "Verification Checklist: 116/008 — Playbooks and Default Calibration"
description: "Level 2 checklist for Phase H manual playbooks, SKILL.md version bump, metadata refresh, and regression verification."
trigger_phrases:
  - "deep-review playbook"
  - "review-depth manual scenario"
  - "SKILL version bump"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/008-playbooks-and-default-calibration"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Level 2 verification checklist."
    next_safe_action: "Mark verification evidence after commands pass."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1160088500000000000000000000000000000000000000000000000000000000"
      session_id: "116-008-checklist"
      parent_session_id: "116-008-playbooks-and-default-calibration"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P2 iteration default calibration is deferred."
---
# Verification Checklist: 116/008 — Playbooks and Default Calibration

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` lists Phase H scope, active files, prior-phase deliverables, and deferred defaults.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` defines four phases: spec docs, playbook scenarios, SKILL.md version bump, verification.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: Phase 002-007 implementation summaries were read; manifest names are recorded in `spec.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `SKILL.md` diff is narrowly scoped
  - **Evidence**: `git diff -- .opencode/skills/deep-review/SKILL.md` shows only `version: 1.3.2.0` to `version: 1.3.3.0`.
- [x] CHK-011 [P0] No production code modified
  - **Evidence**: Phase H scope is docs/playbooks plus `SKILL.md` frontmatter only.
- [x] CHK-012 [P1] Defaults are not changed
  - **Evidence**: `spec.md` Deferred section cites R8 P2; no config surface is in the file list.
- [x] CHK-013 [P1] Existing manual playbook categories preserved
  - **Evidence**: Only requested root `README.md` and six root `scenario-*.md` files are added.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation passes
  - **Evidence**: `validate.sh .../008-playbooks-and-default-calibration --strict` exits 0 with `RESULT: PASSED`.
- [x] CHK-021 [P0] Playbook inventory check passes
  - **Evidence**: `ls .opencode/skills/deep-review/manual_testing_playbook/` lists `README.md` plus six `scenario-*.md` files.
- [x] CHK-022 [P1] Required manifest names appear across playbook
  - **Evidence**: Grep counts are nonzero for `review-depth-validator.vitest.ts`, `DEEP_REVIEW_V2_ENFORCEMENT`, `candidateCoverageGate`, `graphlessFallbackGate`, `BUG_CLASS`, `searchLedger`, `candidateCoverage`, and `searchDebt`.
- [x] CHK-023 [P1] Full `tests/deep-loop/` Vitest command attempted
  - **Evidence**: Exact root command reports `Command "vitest" not found`; package-local strict command passes with 16 files passed, 1 skipped, 129 tests passed, and 5 todo.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No temp files required for authored docs.
- [x] CHK-051 [P1] New files are under approved Phase H surfaces
  - **Evidence**: New files are limited to Phase 008 docs and `manual_testing_playbook/` root.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced
  - **Evidence**: Phase H files are markdown docs and `SKILL.md` metadata.
- [x] CHK-031 [P1] No external network dependency introduced
  - **Evidence**: Manual scenarios use local fixtures, local env flag, and local playbook artifacts only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: All three docs use the same four-phase Phase H structure and deferred-default boundary.
- [x] CHK-041 [P1] Implementation summary updated with evidence
  - **Evidence**: `implementation-summary.md` includes validation, grep, Vitest limitation, and Commit Handoff.
- [x] CHK-042 [P2] README updated if applicable
  - **Evidence**: Root `manual_testing_playbook/README.md` is part of Phase H deliverables.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Root playbook files are in the requested directory
  - **Evidence**: `README.md` and six `scenario-*.md` files are under `.opencode/skills/deep-review/manual_testing_playbook/`.
- [x] CHK-061 [P1] Existing category folders remain in place
  - **Evidence**: Phase H does not remove or restructure existing `NN--category` directories.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-22
**Verified By**: GPT-5.5 via cli-codex
<!-- /ANCHOR:summary -->
