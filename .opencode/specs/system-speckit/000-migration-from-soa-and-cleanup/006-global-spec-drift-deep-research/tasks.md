---
title: "Tasks: Global spec-drift and prior-context-optimization deep-research sweep"
description: "Task breakdown for launching the /deep:research :auto 3-executor (GLM/SOL/LUNA) normal-convergence fan-out over ALL of .opencode/specs/*, and verifying the committed research/research.md before phase 007."
trigger_phrases:
  - "global spec drift research tasks"
  - "deep research fan-out tasks"
  - "006 task breakdown"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded task breakdown across 3 phases"
    next_safe_action: "Execute T001-T004 (Setup) before launching the fan-out in T005"
    blockers:
      - "Ordering gate from parent spec.md: this phase MUST NOT begin until all five numbering/reconstruction phases (001-005) are complete; at scaffold time all five show Draft status in the parent's Phase Documentation Map"
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Worktree vs current-branch execution target (T003) is not yet resolved."
      - "Exact --executors JSON payload (T004) is not yet assembled."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Global spec-drift and prior-context-optimization deep-research sweep

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

- [ ] T001 Confirm phases 001-005 each independently pass `validate.sh --recursive --strict` and have clean `git status`, per the parent's Phase Handoff Criteria (`../spec.md`)
- [ ] T002 [P] Verify GLM/SOL/LUNA executor slugs, effort levels, and the SOL `--service-tier` prohibition against `plan.md` §3 FIX ADDENDUM
- [ ] T003 [P] Resolve worktree vs. current-branch execution via sk-git's ask-first A/B gate (per CLAUDE.md Git Workspace Safety)
- [ ] T004 Assemble the exact `--executors` JSON payload (3 objects: GLM, SOL, LUNA) per `plan.md` §3 FIX ADDENDUM
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Launch `opencode run --command deep/research :auto ...` bound to this spec folder with `--max-iterations=10`, the assembled `--executors` JSON, and `--concurrency=3` (forced-depth flags omitted — unsupported on research fan-out; `plan.md` §4 Phase 2)
- [ ] T006 Monitor the GLM lineage (`research/lineages/glm/`) up to 10 iterations (fewer if converged early)
- [ ] T007 [P] Monitor the SOL lineage (`research/lineages/sol/`) up to 10 iterations (fewer if converged early)
- [ ] T008 [P] Monitor the LUNA lineage (`research/lineages/luna/`) up to 10 iterations (fewer if converged early)
- [ ] T009 Confirm `fanout-merge.cjs` consolidates all 3 lineage `findings-registry.json` files into one merged registry
- [ ] T010 Confirm `step_compile_research` synthesizes `research/research.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify `research/research.md` exists, is non-empty, and is committed to git before any phase 007 action
- [ ] T012 Triage findings: remediate trivial in-scope items inline with evidence, or explicitly defer with a recorded reason
- [ ] T013 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research --strict`
- [ ] T014 Update `implementation-summary.md` with iteration counts, per-lineage completion evidence, and the findings triage table
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` with evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] `research/research.md` committed before any phase 007 action
- [ ] Strict packet validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: Optional for this packet — not authored in this scaffolding pass.
<!-- /ANCHOR:cross-refs -->
