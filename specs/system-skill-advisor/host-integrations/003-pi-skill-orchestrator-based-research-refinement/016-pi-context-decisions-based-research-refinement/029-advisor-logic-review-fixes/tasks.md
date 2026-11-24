---
title: "Tasks: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor logic review fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`. Each implementation task is one work unit from `plan.md` section 4 and names its executor and the files it owns.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the gate baseline at `52f0bcb9a98` (`run-gates-532.sh baseline`). Verify: all 17 gates exit 0, advisor `2738 passed | 4 skipped`.
- [x] T002 Measure the one-skill scan on a database copy (`spec.md` Measured Behavior). Verify: `afterOneSkillRoot` prints nodes 1, edges 0.
- [x] T003 Design every fix area read-only and correct each design (`/private/tmp/plan029/designs/`, the Luna skeptic and critic). Verify: the critic maps all 19 findings.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Wave 1:
- [x] T010 [P] U1 owned-dir helper, Luna (`runtime/lib/owned-private-dir.ts`, `hooks/lib/route-receipt.ts`). Verify: `npx vitest run tests/hooks/route-receipt.vitest.ts` prints `42 passed`.
- [x] T011 [P] U2 socket check and session-proxy reattach, Luna (`.skilled/bin/lib/launcher-ipc-bridge.cjs`, spec-kit launcher tests). Verify: the spec-kit `launcher-ipc-bridge-probe` and `launcher-session-proxy` suites pass with the new ownership cases.
- [x] T012 [P] U3 stage-order characterization test, Luna (`runtime/tests/scorer/score-stage-order.vitest.ts`). Verify: it passes at HEAD and fails under each of its mutation proofs.

Wave 2 (after wave 1 is checked):
- [x] T020 [P] U4 scan scope, Luna (`skill-graph-db.ts`, `tools/skill-graph-tools.ts`, skill-graph tests). Verify: the narrow-scan cases pass and the database-copy probe prints 15 nodes and 59 edges after a one-skill scan.
- [x] T021 [P] U5 CLI socket check and `deletedNodes` text, Luna (`runtime/skill-advisor-cli.ts`, its new ownership test, the job-semantics test). Verify: `skill-advisor-cli-socket-ownership.vitest.ts` passes.
- [x] T022 [P] U6 metrics store, Luna (`runtime/lib/metrics.ts`, `tests/metrics-file-permissions.vitest.ts`). Verify: the planted-symlink case leaves the target unchanged.
- [x] T023 [P] U7 shadow sink, Luna (`runtime/lib/shadow/shadow-sink.ts`, `tests/shadow-sink.vitest.ts`). Verify: the symlink and foreign-owner cases pass.
- [x] T024 [P] U8 calibration store, Luna (`runtime/lib/scorer/feedback-calibration.ts`, its test). Verify: a refused folder skips the write and `advisor_validate` does not throw.
- [x] T025 [P] U9 scorer predicates in both languages, Luna (`fusion.ts`, `ambiguity.ts`, `types.ts`, `skill_advisor.py`, the shared fixture and its tests). Verify: the fixture passes in vitest and Python, and the four ratchets keep their baseline counts.
- [x] T026 [P] U10 cap, floors and Pi budget, Luna (parity tests, `hooks/pi/prompt-advisor.ts`). Verify: `python-ts-constant-parity.vitest.ts` passes and fails when either value is changed.
- [x] T027 [P] U11 Gate-3 lookup diagnostic and lock reclaim, Luna (`lib/policy-plan.ts`, `lib/freshness/generation.ts`, their tests). Verify: both new cases pass.
- [x] T028 [P] U12 lifecycle code deletion, Luna (`lib/lifecycle/`, the two trimmed tests). Verify: `rg` for the four symbols outside `specs/` and changelogs finds nothing.
- [x] T029 [P] U13 comments and docs, Luna for the trust wording and DeepSeek Flash for the lifecycle docs, after the Codex quota ran out (every doc and comment-only file in `plan.md` U13). Verify: the path-scoped residue grep prints zero hits, after a baseline run that printed hits.

Wave 3:
- [x] T030 Regenerate `leaf-aliases.json` and `leaf-manifest.json`, bump changed doc versions, then regenerate the trigger index once. Verify: each `--check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Run `run-gates-532.sh after` and compare with the baseline. Verify: every gate exits 0, and every count change is explained by an added or removed test.
- [x] T041 Run the database-copy probe again. Verify: 15 nodes and 59 edges after the one-skill scan.
- [x] T042 Extend the review by cli-pi DeepSeek Flash passes (operator choice, native Opus ruled out) and run `review-verdict.cjs`. Verify: the verdict is not `FAIL`.
- [x] T043 Run `validate.sh --strict` on this packet. Verify: `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every row of `acceptance-criteria.md` is `Met`.
- [x] The scoped diff touches only the files the units own, plus the regenerated indexes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Review**: See `../review/review-report.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P1] Gate baseline captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Advisor and spec-kit typecheck exit 0
- [x] CHK-011 [P0] No code comment carries a packet, finding or task id
- [x] CHK-012 [P1] Each worker's diff stays inside its unit's file list
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every new test failed before its fix (negative control recorded)
- [x] CHK-021 [P0] The full gate set passes against the baseline
- [x] CHK-022 [P1] The four routing ratchets keep their baseline counts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-030 [P0] Every same-class temp-folder store calls the owner check (metrics, shadow, calibration, route receipt)
- [x] CHK-031 [P0] Every socket client checks ownership before connect, including the session-proxy reattach
- [x] CHK-032 [P1] Each predicate fix has its Python twin and a shared fixture case
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-035 [P0] A foreign-owned folder, an open-mode folder and a planted symlink are each refused, by test
- [x] CHK-036 [P1] A refusal skips the write or falls back and never throws into a hook
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The trust default reads the same in the server comment, the catalog, SKILL.md and the references
- [x] CHK-041 [P1] No catalog or playbook entry names a deleted lifecycle function
- [x] CHK-042 [P2] Changed docs carry a bumped frontmatter version
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probes and worker logs live under `/private/tmp/plan029/`, never in the repository
- [x] CHK-051 [P1] `scratch/` holds no task residue at completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->
