---
title: "Tasks: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-phased-spec-preference"
    last_updated_at: "2026-07-11T15:51:28.214Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-phased-spec-preference"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy

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

- [x] T001 Scaffold spec folder `032-phased-spec-preference` (Level 2, `--track system-speckit --skip-branch`)
- [x] T002 Read `cli-external/SKILL.md` + `cli-opencode/SKILL.md` (constitutional dispatch-skill-preload rule)
- [x] T003 Read `phase_system.md`, `phase_definitions.md`, `folder_routing.md`, `level_decision_matrix.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch `@prompt-improver` to build a CRAFT-framework, CLEAR-validated dispatch prompt (Tier-3 escalation trigger: policy/governance sensitivity)
- [x] T005 Run provider auth pre-flight for `openai` (cli-opencode §3)
- [x] T006 Dispatch `opencode run --model openai/gpt-5.6-sol-fast --variant xhigh --format json --dir <repo-root>` with the enhanced prompt, `</dev/null`, single-dispatch PID discipline
- [x] T007 Save raw output to `scratch/gpt-5.6-sol-analysis.json`; cross-check the proposal's claims against the actual reference docs (do not trust blindly — Finding = hypothesis)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Write synthesized recommendation to `implementation-summary.md` (verified vs. inferred claims distinguished)
- [x] T009 Present proposal to operator for approval before any framework doc edits - [evidence: `AskUserQuestion` response "Apply now, all fixes"]
- [x] T011 Dispatch Opus 4.8 adversarial review (operator-requested second opinion) before applying anything - [evidence: `scratch/opus-review.md`, 16 tool uses, 393s duration]
- [x] T012 Apply the 8-file edit set using Opus's corrected wording (operator approved "all fixes") - [evidence: `git diff --stat` shows 8 files changed, 79 insertions(+), 30 deletions(-)]
- [x] T013 Code-dependency sweep before applying: grep for exact changed strings across `scripts/`/`mcp_server/`, confirm `gate-3-classifier.ts` untouched
- [x] T010 `bash validate.sh 032-phased-spec-preference --strict` clean - [evidence: `validate.sh` output "Summary: Errors: 0  Warnings: 0 / RESULT: PASSED"]
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

