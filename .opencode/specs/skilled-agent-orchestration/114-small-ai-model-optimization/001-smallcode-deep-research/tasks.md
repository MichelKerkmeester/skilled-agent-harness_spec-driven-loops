---
title: "Tasks: deep-research mining smallcode-master for small-model patterns"
description: "Sequential task list driving Phase 0 preflight → Phase 1 strategy → Phase 2 loop (20 iters) → Phase 3 synthesis → Phase 4 hand-off. Owned by main agent + YAML workflow."
trigger_phrases:
  - "smallcode research tasks"
  - "deep-research task list"
  - "swe-1.6 dogfood tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 001 tasks.md"
    next_safe_action: "Author 001 checklist.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000003"
      session_id: "114-001-tasks-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: deep-research mining smallcode-master

<!-- SPECKIT_LEVEL: 3 -->
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
| `[L]` | Loop-owned (YAML workflow auto-executes) |

**Task Format**: `T### [P/L/B?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Spec packet bootstrap (this conversation).

- [x] T001 Delete empty 002- typo subfolder (`114/002-/`)
- [x] T002 Author 114/spec.md (phase-parent lean variant)
- [x] T003 Generate 114/description.json + graph-metadata.json via generate-context.js
- [x] T004 Strict-validate 114 as phase-parent (exit 0)
- [x] T005 Author 001/spec.md with 5 locked RQs + L3 anchors
- [x] T006 Author 001/plan.md with deep-research workflow + RQ tracking grid (this file's sibling)
- [ ] T007 Author 001/tasks.md (this file)
- [ ] T008 Author 001/checklist.md (Level 3 with all anchors + RQ-specific verification rows)
- [ ] T009 Author 001/decision-record.md (ADR-001 through ADR-005)
- [ ] T010 Author 001/implementation-summary.md (template placeholder; filled post-synthesis)
- [ ] T011 Generate 001/description.json + graph-metadata.json via generate-context.js
- [ ] T012 Strict-validate 001 (Level 3 full set) exit 0
- [ ] T013 Re-strict-validate 114 (phase-parent now sees 001 child)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Preflight SWE-1.6 dispatch (this conversation).

- [ ] T020 Read cli-devin/SKILL.md (CLI dispatch rule §1 line 39)
- [ ] T021 Compose RCAF prompt for preflight context-card per cli-devin v1.0.6.3 ALWAYS #8/#12/#14 contract
- [ ] T022 Apply CLEAR 5-check via sk-prompt/assets/cli_prompt_quality_card.md
- [ ] T023 Dispatch `devin run --model swe-1.6` with preflight prompt
- [ ] T024 Capture output to ../preflight/context-card.md
- [ ] T025 Verify context-card has sections per RQ1–5 with file:line refs
- [ ] T026 Save memory continuity (generate-context.js) marking spec packet ready
- [ ] T027 Final strict-validate of 114 + 001
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Deep-research loop (user-triggered, out of scope for main agent).

- [ ] T030 [L] User invokes `/spec_kit:deep-research:auto 001-research-smallcode --max-iterations=20`
- [ ] T031 [L] YAML workflow runs iters 1..20 (or until convergence) dispatching cli-devin SWE-1.6 per iter
- [ ] T032 [L] Synthesis pass writes research/research.md with per-RQ deltas
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1 + Phase 2 tasks marked `[x]`
- [ ] No `[B]` blocked tasks at the end of this conversation
- [ ] Strict-validate green for both 114 (lean trio) and 001 (Level 3)
- [ ] Preflight context-card exists and is non-empty
- [ ] Memory continuity points to T030 as the user-triggered next step
- [ ] Phase 3 loop-owned tasks left as `[ ] [L]` for user trigger
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md` (workflow phases, RQ tracking grid)
- **Checklist**: `checklist.md` (Level 3 quality gates)
- **Decision Record**: `decision-record.md` (ADR-001..005)
- **Implementation Summary**: `implementation-summary.md` (populated post-synthesis)
- **Preflight evidence**: `../preflight/context-card.md`
- **External corpus**: `../external/smallcode-master/`
<!-- /ANCHOR:cross-refs -->
