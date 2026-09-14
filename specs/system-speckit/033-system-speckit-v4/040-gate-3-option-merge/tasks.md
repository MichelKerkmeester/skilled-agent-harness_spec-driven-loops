---
title: "Tasks: Phase 1: gate-3-option-merge"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: gate-3-option-merge

<!-- SPECKIT_LEVEL: 2 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-run the inventory grep, `rg -ln "Update related|Extend phased packet|E\) Skip" --glob '!specs/**' --glob '!node_modules/**' --glob '!.worktrees/**' --glob '!**/dist/**' --glob '!**/z_archive/**' .`, to catch drift since planning
- [ ] T002 Read `spec-gate-core.test.mjs` in full, both `POSITIVE_ANSWER_CORPUS` and `NEGATIVE_PROMPT_CORPUS`, to scope the fixture rewrite
- [ ] T003 Confirm whether a generator produces `.opencode/commands/deep/assets/compiled/*.contract.md`, by searching beyond the paths already checked (`.opencode/commands/deep/`, `.opencode/bin/`) if the earlier search left any directory unchecked
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Edit `AGENTS.md`: replace the C and D option lines with one C "Related" line merging both wordings, relabel Skip from E to D, remove the old fifth line (`AGENTS.md`)
- [ ] T005 Edit `spec-gate-core.mjs`: `GATE_3_QUESTION` text to match the new four-option wording (`.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T006 Edit `spec-gate-core.mjs`: move the skip letter from E to D across `STANDALONE_LETTER_E_REGEX` (or its renamed equivalent), `ANSWER_LETTER_PREFIX_REGEX`, `NATURAL_LEAD_IN_LETTER_REGEX`, `ANSWER_LETTER_ATTEMPT_REGEX`, `ANSWER_LETTER_VOCAB_REGEX`, keeping the accepted letter range unless narrowing is separately justified (`.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T007 Edit `spec-gate-core.test.mjs`: rewrite `POSITIVE_ANSWER_CORPUS` and `NEGATIVE_PROMPT_CORPUS` rows that assert the old D-as-folder or E-as-skip meaning to the new D-as-skip and merged-C wording (`.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T008 [P] Edit the 9 command asset files under `.opencode/commands/create/assets/`, `.opencode/commands/deep/assets/`, `.opencode/commands/speckit/assets/` to the new four-option wording
- [ ] T009 [P] Edit the 3 compiled contracts under `.opencode/commands/deep/assets/compiled/` (`deep-research.contract.md`, `deep-review.contract.md`, `deep-ai-council.contract.md`) to the new four-option wording, by direct edit unless T003 found a generator
- [ ] T010 [P] Edit `.opencode/skills/system-spec-kit/references/workflows/worked-examples.md` and `.opencode/skills/system-spec-kit/references/memory/trigger-config.md` to align their short-form lists to the new canonical wording
- [ ] T011 [P] Edit `README.md`'s Gate 3 pipeline-diagram box to the new four-option wording
- [ ] T012 [P] Edit `.opencode/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` to the new four-option wording
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` and confirm it passes
- [ ] T014 Run the classifier's own existing test suite for `gate-3-classifier.ts` unmodified and confirm it passes
- [ ] T015 Re-run the inventory grep from T001 and confirm zero hits outside spec folders and archives
- [ ] T016 Confirm `CLAUDE.md` is still a symlink resolving to `AGENTS.md`
- [ ] T017 Update documentation cross-references touched by the change (this task list stands as the record)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-14
<!-- /ANCHOR:summary -->

---
