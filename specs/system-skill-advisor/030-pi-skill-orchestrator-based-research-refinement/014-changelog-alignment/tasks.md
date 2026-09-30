---
title: "Tasks: Changelog Alignment for the Skill Advisor Work"
description: "Task Format: T### [P?] Description (file path). One task per entry or artifact group, each closed by its own check from the final state."
trigger_phrases:
  - "changelog alignment tasks"
  - "advisor changelog rename tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Changelog Alignment for the Skill Advisor Work

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

- [x] T001 Scaffold this phase with `create.sh`, write its docs and goal, and bind it in the parent goal within 4,000 characters (`../goal.md`)
- [x] T002 Record the baselines: each component's newest entry and `SKILL.md` version, the advisor file names and their links, `validate_document.py` on every advisor entry, the route guard and the Hermes check (`evidence/baselines.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rename the ten three-part advisor entries with `git mv` (`system-skill-advisor/changelog/`)
- [x] T004 Fix the renamed entries' titles and identity phrases, the v0.11.0.0 and v0.11.1.0 titles and phrase order, the v0.5.0.0 H1 and topic phrase and the in-body advisor version names
- [x] T005 Write advisor v0.11.2.0 for the fixes after the source-root move (`system-skill-advisor/changelog/v0.11.2.0.md`)
- [x] T006 Write advisor v0.12.0.0 for the packet 030 hook work (`system-skill-advisor/changelog/v0.12.0.0.md`)
- [x] T007 [P] Write system-spec-kit v4.1.4.0 (`system-spec-kit/changelog/v4.1.4.0.md`)
- [x] T008 [P] Write deep-loop runtime v1.5.1.0, deep-review v1.11.1.0 and deep-research v1.15.1.0 (`system-deep-loop/*/changelog/`)
- [x] T009 [P] Write cli-codex v1.9.5.0 and cli-external-orchestration v1.7.1.0 (`cli-external-orchestration/**/changelog/`)
- [x] T010 [P] Write sk-code-opencode v1.0.1.0 (`sk-code/sk-code-opencode/changelog/v1.0.1.0.md`)
- [x] T011 Set each bumped `SKILL.md` to its anchor and the hub artifacts to the hub version, re-mint the stale hub manifest and rebuild the bumped Hermes copies. Only cli-external-orchestration went stale, and its authored copy took the same bytes
- [x] T012 Add the skill advisor work to the release notes (`.skilled/changelog/skilled/v4.0.0.2.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `validate_document.py` and `hvr_scan.py` on every new or edited entry and on `v4.0.0.2.md` (`evidence/entry-checks.txt`)
- [x] T014 Two fresh Opus reviews of every new entry against the commits it records, each finding confirmed before it is acted on (`evidence/review/`). 35 findings, 32 confirmed as stated, one partly, two judgment calls kept with their reasons in `evidence/review/verification.md`
- [x] T015 The route guard, the Hermes check, the frontmatter gate and `parent-skill-check.cjs` on each changed hub (`evidence/final-gates.txt`)
- [x] T016 `repair-derived` on this phase and the parent, `validate.sh --strict --recursive` on packet 030, `check-goal.cjs` and `goal.cjs packet` at `packet_budget=ok` (`evidence/strict-validate.txt`)
- [x] T017 Recheck `git status` and stage only this phase's paths with `--pathspec-from-file`, leaving every other session's file unstaged. The commit, the trigger index rebuild and the push follow, and goal criterion 6 covers them
- [x] T018 Prove the parent goal's six criteria again from the final state, with all 45 scenario runs rerun in the five CLIs (`evidence/goal-reverify/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Entry Quality

- [x] CHK-010 [P0] Every new or edited entry passes `validate_document.py`
- [x] CHK-011 [P0] Every new or edited entry has zero hard HVR findings
- [x] CHK-012 [P1] Each entry uses the compact or expanded shape its change count calls for
- [x] CHK-013 [P1] Each entry follows the omission rules: no file inventories, test counts or review-pass counts
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every claim in a new entry checked against the commit it records
- [x] CHK-022 [P1] Each new version is strictly greater than its folder's previous newest
- [x] CHK-023 [P1] The route guard and the Hermes check pass from the final state
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: the three-part names are `class-of-bug` across the advisor folder, and the missing entries are `cross-consumer` across seven components.
- [x] CHK-FIX-002 [P0] Same-class inventory done: a scan of every `changelog/` folder under `.skilled/skills` for three-part names.
- [x] CHK-FIX-003 [P0] Consumer inventory done for the renamed files: every link to an old name, sorted into live and historical.
- [x] CHK-FIX-004 [P0] Not applicable: no security, path, parser or redaction code changes.
- [x] CHK-FIX-005 [P1] Component matrix listed before completion: nine entries across eight changelog folders.
- [x] CHK-FIX-006 [P1] Not applicable: no test or code reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence pinned to the phase commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any entry
- [x] CHK-031 [P0] No entry names a private path outside the repository
- [x] CHK-032 [P1] No other session's file is staged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The release notes and the component entries tell the same story
- [x] CHK-042 [P2] Out-of-scope drift reported, not fixed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-28
<!-- /ANCHOR:summary -->

---
