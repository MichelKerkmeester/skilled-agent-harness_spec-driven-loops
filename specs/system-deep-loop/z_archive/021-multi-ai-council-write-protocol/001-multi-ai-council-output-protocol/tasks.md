---
title: "Tasks: Multi-AI Council Output Protocol"
description: "Task ledger for packet 080 implementation across spec, agent, references, and validator phases."
trigger_phrases:
  - "ai-council tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-multi-ai-council-write-protocol/001-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T11:30:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Refactored tasks.md to canonical template anchors"
    next_safe_action: "Mark Phase 2 tasks in progress"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:bb9a4a19915a746c803770a3240a56aece26266bfe1ad0d4800d2d7abcdd26a6"
      session_id: "tasks-080-author"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---

# Tasks: Multi-AI Council Output Protocol

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Spec authoring + design lock-in. Final verification gate is strict validation passing on the packet.

- [x] T001 Create folder + description.json
- [x] T002 Author graph-metadata.json
- [x] T003 Author spec.md (Level 3, canonical template anchors)
- [x] T004 Author plan.md (canonical template anchors)
- [x] T005 Author tasks.md (this file, canonical template anchors)
- [x] T006 Author checklist.md (canonical template anchors)
- [x] T007 Author decision-record.md (4 ADRs, canonical anchors)
- [x] T008 Author implementation-summary.md placeholder (canonical anchors)
- [x] T009 Strict validation passes on packet 080 (validate.sh --strict exit 0)
- [ ] T010 Commit + push spec packet (combined with Phase 2/3 commits)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Agent body update + 4-runtime mirror sync + 4 reference files under system-spec-kit.

- [x] T101 Update `.opencode/agents/multi-ai-council.md` body with §Output Protocol (683 LOC, under 750)
- [x] T102 Add §Invocation Contract (first-call / subsequent / resume rules)
- [x] T103 Add §State Schema (jsonl event types + examples)
- [x] T104 Add §Convergence Signal (2/3 agreement rule)
- [x] T105 [P] Mirror agent update to `.claude/agents/multi-ai-council.md` (4 sections present)
- [x] T106 [P] Mirror to `.codex/agents/multi-ai-council.toml` (4 sections present; written manually after sandbox blocked codex dispatch)
- [x] T107 [P] Mirror to `.gemini/agents/multi-ai-council.md` (4 sections present)
- [x] T108 No README.md changes required (agent count unchanged; @multi-ai-council was already documented)
- [x] T110 [P] Create `system-spec-kit/references/multi-ai-council/folder-layout.md` (38 LOC)
- [x] T111 [P] Create `references/multi-ai-council/seat-diversity-patterns.md` (35 LOC)
- [x] T112 [P] Create `references/multi-ai-council/convergence-signals.md` (27 LOC)
- [x] T113 [P] Create `references/multi-ai-council/state-format.md` (68 LOC)
- [x] T114 Strict validation on packet 080 passes after Phase 2 (validate.sh --strict exit 0)
- [ ] T115 Commit Phase 2 (combined with Phase 3 commit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Validator regression test + live smoke test on packet 080.

- [x] T201 Audit `validate.sh` for unknown-subfolder behavior (validator accepts unknown subfolders by design; Node orchestrator at mcp_server/lib/validation/orchestrator.ts confirmed)
- [x] T202 Confirm validator treats `ai-council/` as free-form (no code change required per ADR-004)
- [x] T203 Add vitest case in `system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts` (2 test cases; codex-dispatch reported targeted run passed)
- [x] T204 Smoke test: dispatched `@multi-ai-council` on packet 080 (rounds 1 + 2). Orchestrator-mediated persistence pattern used: agent stayed `write: deny`, Claude Code wrote `ai-council/` artifacts based on the agent's plan output. Round-2 produced "round-1 amended with addendum" verdict.
- [x] T205 Verified canonical files appear in `ai-council/`: `ai-council-config.json`, `ai-council-strategy.md`, `ai-council-state.jsonl` (14 events), `seats/round-001/{seat-001,seat-002,seat-003}-*.md`, `seats/round-002/{seat-001,seat-002,seat-003}-*.md`, `deliberations/round-001.md`, `deliberations/round-002.md`, `critiques/round-002-critique.md`, `council-report.md`.
- [x] T206 Verified `council-report.md` structure matches spec §4: Council Composition, Strategy Comparison table, Winning Strategy, Recommended Plan, Implementation Steps, Plan Confidence, Dropped Alternatives, Risks & Mitigations, Planning-Only Boundary, Cross-References.
- [x] T207 Verify strict validation passes after Phase 2-3 (validate.sh --strict exit 0)
- [x] T208 Verify resume-after-interrupt path documented in agent body (§14 + state-format.md)
- [ ] T209 Commit Phase 3
- [x] T210 Update implementation-summary.md with end-to-end evidence (deferred items called out)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [P0] All Phase 2 tasks (T101-T115) marked [x] with file-path or commit-SHA evidence
- [P0] Vitest regression test (T203) passes
- [P0] Strict validation exit 0 on packet 080
- [P0] All 7 success criteria from spec.md §5 evidenced in implementation-summary.md
- [P1] Smoke test (T204-T207) produces canonical `ai-council/` artifacts on packet 080
- [P1] All 4-runtime mirrors verified in lockstep (T105-T107)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md` (post-implementation)
<!-- /ANCHOR:cross-refs -->
