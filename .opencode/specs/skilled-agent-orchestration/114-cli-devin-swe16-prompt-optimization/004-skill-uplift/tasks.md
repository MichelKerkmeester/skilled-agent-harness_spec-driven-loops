---
title: "Tasks: Skill Uplift"
description: "Numbered tasks for applying 003 synthesis winners to cli-devin"
trigger_phrases:
  - "114/004 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/004-skill-uplift"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks.md"
    next_safe_action: "Read 003 synthesis when ratified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114042"
      session_id: "114-004-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Uplift

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [B] T001 BLOCKED on 003 synthesis.md operator-ratification
- [ ] T002 Read `../003-eval-loop/synthesis.md`; extract ranked winners + insights + confidence bands
- [ ] T003 Build winner→target mapping table (Markdown table in this packet's plan.md or scratch)
- [ ] T004 Identify which winners are BREAKING (change existing dispatch behavior) vs additive
- [ ] T005 Operator review of mapping table; approve OR revise
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Edit `.opencode/skills/cli-devin/SKILL.md` § 2 SMART ROUTING (intent-signal weight tuning IF synthesis warrants)
- [ ] T011 sk-doc validate cli-devin/SKILL.md → exit 0 (REQ-001 gate)
- [ ] T012 Edit `.opencode/skills/cli-devin/SKILL.md` § 4 RULES (#12 SWE-1.6 Prompt-Quality Contract, #14 sequential_thinking threshold) per winners
- [ ] T013 sk-doc validate → exit 0
- [ ] T014 Edit `.opencode/skills/cli-devin/assets/prompt_templates.md` — replace specific template variants with winners; preserve framework labels
- [ ] T015 sk-doc validate → exit 0
- [ ] T016 Edit `.opencode/skills/cli-devin/assets/prompt_quality_card.md` — refine CLEAR cutoffs IF synthesis warrants
- [ ] T017 sk-doc validate → exit 0
- [ ] T018 Author `.opencode/skills/cli-devin/changelog/v1.0.5.0.md` — date, summary, before/after table, synthesis.md citation, BREAKING flags
- [ ] T019 Optional: update version line in SKILL.md if convention requires
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Smoke test: re-run `manual_testing_playbook/03--model-presets/swe-1.6/*.md` entries; capture output diffs
- [ ] T031 Verify no regression in non-SWE-1.6 entries if shared scaffolding changed (rerun deepseek-v4, glm-5.1, kimi-k2.6 model preset entries)
- [ ] T032 Verify REQ-001: every authored doc write was followed by strict-validate / sk-doc
- [ ] T033 Verify REQ-002: each diff hunk cites synthesis.md (commit message or inline comment)
- [ ] T034 Verify REQ-003: changelog/v1.0.5.0.md exists + has required sections
- [ ] T035 Verify REQ-004: `git status --short` shows changes only in `.opencode/skills/cli-devin/` + this packet's spec docs
- [ ] T036 Verify REQ-005: BREAKING flags present in v1.0.5.0.md if any breaking changes
- [ ] T037 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 004-skill-uplift --strict` — exit 0
- [ ] T038 Operator final approval of full diff
- [ ] T039 Commit on main (Conventional Commit: `feat(cli-devin): apply SWE 1.6 optimization winners (v1.0.5.0)`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 verification tasks pass (T032..T036)
- [ ] strict-validate exit 0 (T037)
- [ ] Operator final approval (T038)
- [ ] Commit landed on main (T039)
- [ ] Smoke test confirms no regression (T030..T031)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `../spec.md`
- **Upstream**: `../003-eval-loop/synthesis.md`
- **Target skill**: `.opencode/skills/cli-devin/`
<!-- /ANCHOR:cross-refs -->
