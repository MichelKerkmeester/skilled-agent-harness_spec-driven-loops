---
title: "Tasks: Phase 025 - PB-002 Advisor and Audit-Bundle Fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 025 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/025-pb002-advisor-and-audit-bundle-fix"
    last_updated_at: "2026-07-07T21:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb002-advisor-fix-025"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 025 - PB-002 Advisor and Audit-Bundle Fix

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

- [x] T001 Review the fresh-audit findings + verify results with the operator; confirm 3 dispositions (apply fix-now items, scope PB-002 as phase 025, accept the Open Design RUN risk)
- [x] T002 Read PB-002's full scenario file and its own Pass/Fail Criteria before designing any fix
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Fix-Now Findings

- [x] T003 [P] `design-foundations/SKILL.md`: `family: sk-code` → `family: sk-design`
- [x] T004 [P] `design-motion/SKILL.md`: `family: sk-code` → `family: sk-design`
- [x] T005 [P] `design-audit/SKILL.md`: `family: sk-code` → `family: sk-design`
- [x] T006 `command-metadata.json`: reword all 5 `preferSiblingWhen` sibling strings referencing the nonexistent `/design:design-mcp-open-design` command; confirm JSON validity
- [x] T007 `manual_testing_playbook.md`: sync `FR-001`'s index prompt to the (authoritative) feature-file text
- [x] T008 `design-mcp-open-design/SKILL.md`: extend ALWAYS #4 with the operator's accepted-risk decision on live `start_run` side effects
- [x] T009 `verdict-matrix.md`: update the HM-004 side-effect note with the operator decision

### PB-002 Fix, Attempt 1

- [x] T010 Empirically re-test PB-002's exact prompt against the current live daemon path before assuming either defect still holds
- [x] T011 `skill_advisor.py`: add `"spacing rhythm"`/`"hierarchy and spacing"` `PHRASE_INTENT_BOOSTERS` entries
- [x] T012 `sk-design/SKILL.md`: add "single-axis static review" exception to the `audit` Mode Vocabulary Guardrails bullet; version bump 1.4.1.0→1.4.2.0
- [x] T013 Live re-dispatch PB-002; confirm mode-resolution half fixed, advisor half unchanged

### PB-002 Fix, Attempt 2

- [x] T014 Investigate why attempt 1's advisor fix didn't reach the live dispatch path — find and confirm (via direct source grep) the native daemon's actual data source
- [x] T015 `sk-design/graph-metadata.json`: add design-scoped `intent_signals`/`derived.trigger_phrases`
- [x] T016 `sk-design/description.json`: sync `keywords`; confirm via source grep it is inert for daemon-scorer routing (kept for catalog consistency only); version bump 1.4.1.0→1.4.2.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Live daemon re-test: `sk-design` top-1 confirmed at confidence 0.9095 (was 0.82, #2)
- [x] T018 [P] Regression: `AI-002` live daemon check — `sk-code` top-1, 0.913, clean
- [x] T019 [P] Regression: `AI-004` live daemon check — `sk-code` top-1, 0.8993, unchanged
- [x] T020 [P] Regression: `MR-004` live daemon check — discovered FAIL (`sk-code` 0.8719 top-1), conflicting with the fresh audit's REFUTED verdict for the same prompt tested against a different (down-at-the-time) backend; documented as an unresolved logic-sync item, not fixed
- [x] T021 Confirm `~/.config/opencode/opencode.json` clean (no `mcp` key) after every dispatch round in this phase
- [x] T022 Confirm `git status --porcelain` shows no stray files from any dispatch round
- [x] T023 `verdict-matrix.md`: add the PB-002 fix section, the fresh-audit findings section, and the MR-004/AI-004 flags
- [x] T024 Write this phase's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] PB-002 confirmed PASS via the live daemon path across both halves; zero regression on AI-002/AI-004; MR-004 conflict documented, not silently absorbed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../024-manual-playbook-bug-remediation/`
<!-- /ANCHOR:cross-refs -->
