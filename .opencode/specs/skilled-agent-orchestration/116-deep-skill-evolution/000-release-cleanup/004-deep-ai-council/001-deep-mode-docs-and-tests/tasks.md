---
title: "Tasks: deep-ai-council deep-mode docs + script tests (001)"
description: "Task ledger to close the five deferred 004 phase-5 follow-ons (F-002/003/004/006 + DAC-001)."
trigger_phrases:
  - "deep-ai-council follow-on tasks"
  - "deep-mode docs tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/001-deep-mode-docs-and-tests"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-tasks-authored"
    next_safe_action: "execute-phase-2"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011004"
      session_id: "131-000-011-followon"
      parent_session_id: "131-000-011-followon"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: deep-ai-council deep-mode docs + script tests

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` skeleton
- [x] T002 Hand-author `description.json` + `graph-metadata.json`
- [ ] T003 Strict-validate (exit 0)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Read deep-mode scripts (orchestrate-session.cjs, orchestrate-topic.cjs, lib/findings-registry.cjs) + the 5 test-target scripts
- [ ] T011 F-002: author `references/deep_mode.md` (session→topic→round, session-state/round-state jsonl, cost guards, deep-loop-runtime/lib/council dep); cite file:line; HVR ≥85
- [ ] T012 F-003: author `references/findings_registry.md` (schema, cross-topic priors, fingerprint dedup, fs-locking); cite file:line; HVR ≥85
- [ ] T013 F-004: edit `references/graph_support.md` — add a section cross-linking `replay-graph-from-artifacts.cjs` + its derivation
- [ ] T014 DAC-001: reconcile `feature_catalog/01--runtime-routing-and-rename/**` + `manual_testing_playbook/01--runtime-routing-and-rename/**` narrative with the current `ai-council.*` reality
- [ ] T015 [P] F-006: author `scripts/tests/persist-artifacts.vitest.ts`
- [ ] T016 [P] F-006: author `scripts/tests/rollback.vitest.ts`
- [ ] T017 [P] F-006: author `scripts/tests/audit-trail.vitest.ts`
- [ ] T018 [P] F-006: author `scripts/tests/advise-council-completion.vitest.ts`
- [ ] T019 [P] F-006: author `scripts/tests/replay-graph-from-artifacts.vitest.ts`
- [ ] T020 Wire `deep_mode.md` + `findings_registry.md` into SKILL §3 RESOURCE_MAP + §6 REFERENCES + README §9
- [ ] T021 Author `changelog/v2.1.1.0.md`; bump SKILL version 2.1.0.0 → 2.1.1.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 `node -c` on all 5 new test files; `vitest run` (or document skip if harness dep missing)
- [ ] T031 sk-doc package validate (skill) + HVR scan on the 2 new references
- [ ] T032 `git diff` scripts/ shows only NEW test files (no existing .cjs edits)
- [ ] T033 Advisor parity: deep-ai-council surfaces at threshold 0.8
- [ ] T034 Fill `implementation-summary.md`; final strict-validate (exit 0)
- [ ] T035 Present for commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 5 deferred items resolved (F-002/003/004/006 + DAC-001)
- [ ] Strict validate 0/0; sk-doc package valid; HVR ≥85
- [ ] Existing scripts unchanged; 5 new test files present
- [ ] `implementation-summary.md` filled
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` · **Plan**: `plan.md` · **Checklist**: `checklist.md`
- **Source**: `../004-deep-ai-council/research/convergence-summary.md`
<!-- /ANCHOR:cross-refs -->
