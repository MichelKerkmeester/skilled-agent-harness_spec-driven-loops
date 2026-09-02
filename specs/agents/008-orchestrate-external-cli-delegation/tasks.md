---
title: "Tasks: Orchestrator external CLI delegation, opt-in by explicit user request"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "orchestrate rule 7 tasks"
  - "agent mirror verification"
  - "external cli delegation tasks"
  - "six surface grep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Orchestrator external CLI delegation, opt-in by explicit user request

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

- [x] T001 Read gates, REPO RULES router, and the four named rule files (`repo-rules/`)
- [x] T002 Read the `sk-doc/sk-create-agent` skill contract (`.opencode/skills/sk-doc/sk-create-agent/SKILL.md`)
- [x] T003 [P] Verify all seven rule semantics against their own sources before writing any of them
- [x] T004 Scaffold this Level 2 packet with `create.sh --level 2 --skip-branch` (branch creation is sk-git's)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the priority 9 row to §2 Agent Selection (`.opencode/agents/orchestrate.md`)
- [x] T006 Add `### Rule 7: External CLI Delegation — Explicit User Request Only` to §4, points 1-7
- [x] T007 Add the §9 anti-pattern row and the two §10 related-resource entries
- [x] T007b Add the hub persona-injection clause to Rule 7 point 3 in both `.md` twins
- [x] T008 Apply the identical body edit to the `.claude` fork, leaving its `tools:` frontmatter untouched
- [x] T009 Regenerate the `.codex` and `.pi` mirrors with their sync scripts; never hand-edit either
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run four mirror gates (codex `--check`, pi `--check`, mirror-sync `--all`, roster) - all exit 0
- [x] T011 Grep `Rule 7` across all six runtime surfaces - 3 occurrences each
- [x] T012 Run the three `sk-doc` validators on both hand-edited files - all exit 0
- [x] T013 Confirm no frontmatter line appears in the diff of either hand-edited `.md`, and record the generated codex TOML header change
- [x] T014 Backfill graph metadata and run `validate.sh --strict` on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - every claim above carries a command and an exit code
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008)
- [x] CHK-002 [P0] Technical approach defined in plan.md (§1, §3)
- [x] CHK-003 [P1] Dependencies identified and available (plan.md §6; both sync scripts ran exit 0)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py --type agent` exit 0 on both hand-edited files
- [x] CHK-011 [P0] No errors; one pre-existing `non_sequential_numbering` warning about `## 0.`, which predates this change
- [ ] CHK-012 [P1] N/A - documentation change, no executable error handling added
- [x] CHK-013 [P1] Rule 7 uses the same Trigger/Action/Logic shape as Rules 1-6
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - see `acceptance-criteria.md`, every row carries a command and exit code
- [x] CHK-021 [P0] Manual testing complete - six-surface grep plus four mirror gates
- [x] CHK-022 [P1] Edge case tested: reverting the stale `debug.toml` makes codex `--check` exit 1, proving the gate reads content
- [ ] CHK-023 [P1] N/A - no runtime error scenarios; the rule is agent-definition text
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

> Not applicable: this packet adds a documented capability rather than fixing a defect, so every
> CHK-FIX row stays unticked with that reason rather than being ticked without evidence.

- [ ] N/A (not a bug fix) CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] N/A (not a bug fix) CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] N/A (not a bug fix) CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] N/A (not a bug fix) CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] N/A (not a bug fix) CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] N/A (not a bug fix) CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] N/A (not a bug fix) CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added; the diff is prose plus one table row per file
- [x] CHK-031 [P0] Rule 7 itself is the input gate: an executor runs only on an explicit user request
- [x] CHK-032 [P1] The two hand-edited `.md` frontmatters are unchanged - `git diff` shows no frontmatter
  line in either, so the `permission:`/`tools:` split is intact. The generated `.codex` TOML header is
  unchanged as well: the pre-existing drift that flipped `sandbox_mode` on regeneration was resolved by
  the operator on 2026-09-02 in favour of `workspace-write`, and the generator table now says it - see
  `implementation-summary.md` Known Limitations 4.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria/implementation-summary synchronized
- [x] CHK-041 [P1] Comment hygiene held - no spec paths or REQ/CHK ids written into any agent file
- [ ] CHK-042 [P2] N/A - no README claims changed by this packet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Command output went to `/tmp`, not into the repository
- [x] CHK-051 [P1] `scratch/` holds only the scaffolded `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 8 verified, 4 N/A (CHK-FIX-001..004, not a bug fix) |
| P1 Items | 12 | 8 verified, 4 N/A (CHK-012, CHK-023, CHK-FIX-005..007) |
| P2 Items | 1 | 0 verified, 1 N/A (CHK-042) |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---



