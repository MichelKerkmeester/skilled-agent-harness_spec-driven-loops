---
title: "Tasks: 115/001 — preflight scope-map"
description: "Task breakdown for the recon phase that gates parallel entry to 002-005."
trigger_phrases:
  - "115 preflight tasks"
  - "rename plan tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/001-rename-preflight-and-plan"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/001 tasks.md"
    next_safe_action: "Author 115/001 checklist.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115001"
      session_id: "115-001-tasks-init"
      parent_session_id: "115-001-spec-init"
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 115/001 — preflight scope-map

---

<!-- ANCHOR:notation -->
## Task Notation
- `T###` task ID; `[P]` parallel-safe; `[seq]` sequential; `[D:T###]` depends on
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author 001/spec.md
- [x] T002 Author 001/plan.md
- [x] T003 Author 001/tasks.md
- [ ] T004 Author 001/checklist.md
- [x] T005 Capture rg baseline (`scratch/rg/rg-baseline-before-files.txt` — 415 lines)
- [x] T006 Author `scratch/resource-map.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 [P] Author `scratch/cli-devin/job-1-prompt.md` — live skill body + 4 sibling skill graph metadata files
- [ ] T011 [P] Author `scratch/cli-devin/job-2-prompt.md` — root docs (AGENTS/CLAUDE/README) + .github/hooks/scripts/pre-push-council.sh + 4 runtime agent files + 4 agent README.txt + skills index README
- [ ] T012 [P] Author `scratch/cli-devin/job-3-prompt.md` — TypeScript code (explicit.ts + multi-ai-council-runtime-parity.vitest.ts)
- [ ] T013 [D:T010..T012] Dispatch 3 cli-devin SWE-1.6 jobs in parallel (capped at 3 concurrent — note iter-1 of 007 deep-review may also be running; coordinate to stay ≤ 3 total)
- [ ] T014 [D:T013] Bundle-gate verification (grep + smoke-run) per [[feedback_cli_devin_bundle_verification]] + [[feedback_bundle_gate_smoke_run]]
- [ ] T015 [D:T014] Aggregate bundles → `scratch/rename-plan.json`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 [D:T015] jq intersection check on rename-plan.json phase scopes (must be empty)
- [ ] T021 [D:T015] Author `scratch/rg-classification.json` covering every baseline hit
- [ ] T022 [D:T020,T021] `bash validate.sh --strict 001/` exit 0
- [ ] T023 [D:T022] Mark all P0/P1 checklist items with EVIDENCE
- [ ] T024 [D:T023] Author 001/implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 CHK items marked [x] with EVIDENCE
- [ ] rename-plan.json emitted + disjoint-scope invariant verified
- [ ] validate.sh --strict exit 0
- [ ] Handoff to 002-005 (parallel) unblocked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent: `../spec.md`
- Memory rules: [[feedback_cli_devin_bundle_verification]], [[feedback_bundle_gate_smoke_run]], [[feedback_cli_dispatch_unreliability]], [[feedback_rename_grep_case_insensitive]]
<!-- /ANCHOR:cross-refs -->
