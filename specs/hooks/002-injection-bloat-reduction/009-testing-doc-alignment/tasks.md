---
title: "Tasks: Testing-Doc and Feature-Catalog Alignment Sweep"
description: "Task breakdown for the dual-lineage playbook and catalog alignment sweep and the verified must-fix implementation (stale playbook count plus two adapter-catalog omission notes)."
trigger_phrases:
  - "testing doc alignment tasks"
  - "feature catalog sweep tasks"
importance_tier: "supporting"
contextType: "tasks"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/009-testing-doc-alignment"
    last_updated_at: "2026-08-07T06:30:00Z"
    last_updated_by: "claude"
    recent_action: "Completed sweep and must-fix implementation tasks"
    next_safe_action: "Optionally schedule the deferred feature-flag-reference env-row task"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md"
    session_dedup:
      fingerprint: "sha256:a7b2fa6bf06d71e72737ffdcb84af871042e4452c2d344de03f3d3290a7fdf24"
      session_id: "2026-08-07-hooks-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Testing-Doc and Feature-Catalog Alignment Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[~]` deferred with rationale.
- `T-NNN` task ids are stable within this packet only.
- Each verification task names the command and its observed result.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Seed the packet `spec.md` and generate `description.json` / `graph-metadata.json`
- [x] T-002 Launch the two-executor deep-loop fan-out (`gpt-5.6-luna` + `opencode-go/deepseek-v4-flash`, 10 iterations each, `--stop-policy max-iterations`, concurrency 2)
- [x] T-003 Collect both lineages' synthesized findings from `research/lineages/<label>/research.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Reconcile the two models' findings and verify each must-fix against the real file
- [x] T-005 Correct the stale `# tests 67` expected output to `87/87/0/0` in `spec-mutation-gate-enforce.md` and add the env-neutralization prefix to step 2
- [x] T-006 Add the post-emission Gate-3 delivery-observation note to the cursor spec-gate catalog row
- [x] T-007 Add the post-emission advisor-policy-observation note to `claude-hook.md`
- [~] T-008 (won't-fix by design) The feature-flag-reference catalog deliberately delegates to `ENV-REFERENCE.md` — 8/12 themed files state "no longer enumerate flags" to avoid drift; adding rows would reintroduce exactly that drift. The envs are covered via `ENV-REFERENCE.md`, and the gate has a dedicated playbook (`spec-mutation-gate-enforce.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-009 Re-run the corrected playbook command; output `87/87/0/0` matches the documented expected
- [x] T-010 Confirm the catalog notes cite real symbols (`grep observeGate3QuestionDelivery`, `grep observeEmittedAdvisorPolicy`)
- [x] T-011 Scope + collateral sweep: only the three intended docs changed; 0 description.json churn outside the packet tree
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every must-fix finding implemented and verified against the real file
- [x] The corrected playbook command's documented output matches its actual output
- [x] The deferred optional item recorded with rationale
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — sweep scope and requirements
- `plan.md` — dual-model audit-then-fix architecture
- `research/lineages/luna/research.md` and `research/lineages/deepseek-go/research.md` — the two syntheses
- `implementation-summary.md` — final state and verification evidence
<!-- /ANCHOR:cross-refs -->
