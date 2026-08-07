---
title: "Tasks: Phase 026 - MR-004 Fix and Doc Symmetry"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 026 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/026-mr004-fix-and-doc-symmetry"
    last_updated_at: "2026-07-08T03:36:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mr004-fix-doc-symmetry-026"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 026 - MR-004 Fix and Doc Symmetry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Review phase 025's Known Limitations as the authoritative deferred-items list
- [x] T002 Re-confirm `MR-004`'s failure and `AI-004`'s bug both still reproduce before designing fixes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Doc Symmetry and Version Alignment

- [x] T003 [P] `mode-registry.json`: add `taskProjections`-vs-`excludedAliases` layering note to `transformVerbRouting.note`
- [x] T004 [P] `SKILL.md`: add `harden`/`polish` transform-verb-precedence exception to the `audit` guardrail bullet
- [x] T005 Version bumps: `SKILL.md` 1.4.2.0→1.4.3.0, `description.json` 1.4.2.0→1.4.3.0, `mode-registry.json` 1.4.0.0→1.4.3.0, `hub-router.json` 1.4.0.0→1.4.3.0
- [x] T006 Author `changelog/v1.4.3.0.md` covering the net cumulative change since v1.2.0.0

### AI-004 Fix

- [x] T007 Locate the offending bare `design-review` keyword in `SKILL.md`'s Keywords comment
- [x] T008 Confirm 4 more specific existing keywords already cover the legitimate intent (no coverage loss)
- [x] T009 Remove the keyword; re-test AI-004 (must resolve `sk-code`) and a legitimate design-review prompt (must stay `sk-design`)

### MR-004 Fix

- [x] T010 Re-test MR-004's exact prompt against the current live daemon path — confirm still failing
- [x] T011 `graph-metadata.json`: add `"design slop"`, `"anti-slop UI audit"` — re-test, margin too thin (0.0016)
- [x] T012 `graph-metadata.json`: add `"contrast and keyboard focus"` — re-test, decisive stable margin (0.032, 3 repeats)
- [x] T013 [P] Regression: AI-002, AI-004, PB-002, and one mode-routing-unrelated prompt — all clean
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Live re-dispatch of MR-004: confirm correct downstream mode/packet/resources/report
- [x] T015 Document the advisor-tool-call confound (dispatch-recipe addendum bled into the live dispatch's own query) as a testing artifact, not a fix defect
- [x] T016 Surface the newly-found `audit`-mode `Bash`-usage tool-surface deviation, not silently absorbed
- [x] T017 Confirm `~/.config/opencode/opencode.json` clean and `git status --porcelain` shows no stray files
- [x] T018 Update `verdict-matrix.md`'s fresh-audit section to close out every item except the new finding
- [x] T019 Write this phase's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] MR-004 and AI-004 both confirmed fixed; both declined doc-symmetry findings applied; versions aligned
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../025-pb002-advisor-and-audit-bundle-fix/`
<!-- /ANCHOR:cross-refs -->
