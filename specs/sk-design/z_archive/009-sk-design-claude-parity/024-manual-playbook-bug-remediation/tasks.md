---
title: "Tasks: Phase 024 - Manual Playbook Bug Remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 024 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/024-manual-playbook-bug-remediation"
    last_updated_at: "2026-07-07T19:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All remediation tasks completed across 3 rounds"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-playbook-remediation-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 024 - Manual Playbook Bug Remediation

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

- [x] T001 Read `023-full-manual-playbook-execution/verdict-matrix.md`'s full "Real bugs found" section (all 8 bugs, source-of-truth for this phase)
- [x] T002 Re-confirm each bug's root cause against the real source files, not the verdict-matrix summary alone
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Round 1 Fixes (all 8 bugs)

- [x] T003 [P] `skill_advisor.py`: add 6 `PHRASE_INTENT_BOOSTERS` entries for Open Design routing (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`)
- [x] T004 [P] `sk-design/SKILL.md`: mode-vocabulary-guardrail exception (foundations/interface transform-verb precedence) + intake-ordering-enforcement paragraph
- [x] T005 [P] `design-interface/SKILL.md`: mirrored transform-verb exception + ALWAYS rules renumbered with new `context_loading_contract.md` DEFAULT_RESOURCE rule
- [x] T006 [P] `design-md-generator/SKILL.md`: router-precedence brief-only-exclusion narrowing
- [x] T007 [P] `sk-design/graph-metadata.json` + `description.json`: `intent_signals`/`trigger_phrases`/`keywords` sync additions
- [x] T008 Version bumps: `sk-design/SKILL.md` 1.4.0.0->1.4.1.0, `design-interface/SKILL.md` 1.0.0.2->1.0.1.0, `design-md-generator/SKILL.md` 1.0.0.3->1.0.1.0

### Round 2 Fixes (4 remaining: `TV-002-V4`, `SR-001`, `HM-001`, `MG-004`)

- [x] T022 [P] `skill_advisor.py`: add 6 more `PHRASE_INTENT_BOOSTERS` entries for weak-signal transform-verb prompts
- [x] T023 [P] `design-interface/SKILL.md`: citation-required clause on `context_loading_contract.md`'s Resource Loading Levels row
- [x] T024 [P] `sk-design/SKILL.md`: "No hedge-everything bundling" paragraph + ordering-enforcement strengthening
- [x] T025 [P] `design-md-generator/SKILL.md`: NEW ALWAYS rule #10 (ask-URL-or-declare-out-of-scope, no third option) + NEW NEVER rule #6 (no unlabeled brief values in Tokens tables), first version

### Round 3 Fix (`MG-004` only, corrected root cause)

- [x] T031 Re-read `MG-004`'s own Pass/Fail Criteria and `authoring_boundary.md` Section 5 + Quick Boundary Check in full
- [x] T032 `design-md-generator/SKILL.md`: rewrite ALWAYS #10 and NEVER #6 — forbid ANY Tokens-table/artifact output on a brief-only no-URL request; require both boundary docs cited by path in the visible response text
- [x] T033 `design-md-generator/references/authoring_boundary.md`: rewrite Section 5 closing paragraph + Quick Boundary Check item 5 to match
- [x] T034 Version bumps: `design-md-generator/SKILL.md` 1.0.1.0->1.0.2.0, `authoring_boundary.md` 1.0.0.0->1.0.1.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Round 1 Re-Verification (all 12 constituent dispatches)

- [x] T009 [P] Live re-dispatch + grade: `MR-007` — PASS
- [x] T010 [P] Live re-dispatch + grade: `AI-001-P6` — PASS
- [x] T011 [P] Live re-dispatch + grade: `TV-001-V1` — PASS
- [x] T012 [P] Live re-dispatch + grade: `TV-001-V3` — PASS
- [x] T013 [P] Live re-dispatch + grade: `TV-003` — PASS
- [x] T014 [P] Live re-dispatch + grade: `TV-004` — PASS
- [x] T015 [P] Live re-dispatch + grade: `MG-002` — PASS
- [x] T016 [P] Live re-dispatch + grade: `MG-003` — PASS
- [x] T017 [P] Live re-dispatch + grade: `TV-002-V4` — FAIL (no skill routing at all)
- [x] T018 [P] Live re-dispatch + grade: `SR-001` — FAIL (`context_loading_contract.md` not loaded)
- [x] T019 [P] Live re-dispatch + grade: `HM-001` — FAIL (hedge-bundling, no real intake)
- [x] T020 [P] Live re-dispatch + grade: `MG-004` — PARTIAL (unlabeled brief values)
- [x] T021 Check `~/.config/opencode/opencode.json` for the known `open-design` mutation — clean

### Round 2 Re-Verification

- [x] T026 [P] Live re-dispatch + grade: `TV-002-V4` — PASS (advisor confidence 0.68->0.95)
- [x] T027 [P] Live re-dispatch + grade: `SR-001` — PASS on literal criteria (tool-call load confirmed; specific citation phrasing still imperfect, accepted)
- [x] T028 [P] Live re-dispatch + grade: `HM-001` — PASS (genuine 5-field intake, one focused question, no bundle declared)
- [x] T029 [P] Live re-dispatch + grade: `MG-004` — FAIL (worse: 3 of 4 tables now fully unlabeled, no URL-ask/refusal, neither boundary doc cited)
- [x] T030 Check `~/.config/opencode/opencode.json` — clean, no recurrence

### Round 3 Re-Verification and Close-Out

- [x] T035 Live re-dispatch + grade: `MG-004` — PASS (zero Tokens-table content, both docs cited by path, explicit out-of-scope + URL-ask, no fabrication tool calls)
- [x] T036 Check `~/.config/opencode/opencode.json` — clean
- [x] T037 Confirm `git status --porcelain` shows no stray files from this round's dispatch
- [x] T038 Update `023-full-manual-playbook-execution/verdict-matrix.md` with final per-bug verdicts
- [x] T039 Write this phase's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 12 constituent dispatches confirmed PASS via live re-dispatch
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../023-full-manual-playbook-execution/`
<!-- /ANCHOR:cross-refs -->
