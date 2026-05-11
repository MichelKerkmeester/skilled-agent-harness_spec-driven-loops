---
title: "Tasks: deep-review :auto non-interactive setup bypass"
description: "Task list for fixing /spec_kit:deep-review:auto setup-phase stdin hang."
trigger_phrases:
  - "deep-review setup hang"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-deep-review-noninteractive-setup-bypass"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Begin Phase 1 audit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-deep-review-noninteractive-setup-bypass"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: deep-review :auto non-interactive setup bypass

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

- [ ] T001 Read `.opencode/commands/spec_kit/deep-review.md` §0 UNIFIED SETUP PHASE; map every Q0..Q-Exec input to its source (flag, default, ask).
- [ ] T002 Read `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` setup steps; note which fields it reads from `deep-review-config.json`.
- [ ] T003 Decide pre-binding marker block name and field syntax.
- [ ] T004 Pick a small test target spec folder for verification dispatches (Level 1 or 2; cheap to deep-review).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Add non-interactive branch to deep-review.md §0 — when AUTONOMOUS + resolvable, skip question block.
- [ ] T011 Document the pre-binding marker schema in deep-review.md (new subsection under §0).
- [ ] T012 Add fail-fast error emitter for AUTONOMOUS + unresolved case.
- [ ] T013 If YAML init step needs adjustment to read from the new branch's config shape, update it.
- [ ] T014 Update command argument-hint comment to reference the new bypass path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Author verification scenario (file + non-interactive Setup block).
- [ ] T021 Dispatch verification scenario via `codex exec` — must load YAML + run iteration loop without setup question.
- [ ] T022 Dispatch verification scenario via `opencode run --pure` — same.
- [ ] T023 Dispatch `/spec_kit:deep-review:auto ""` (empty args) via `codex exec </dev/null` — must exit non-zero within 10s with named-missing-inputs error.
- [ ] T024 Manual `:confirm` dispatch — must still emit the question block (regression check).
- [ ] T025 Run `validate.sh --strict` against this folder; exit 0.
- [ ] T026 Populate `implementation-summary.md` with audit notes, design decisions, dispatch evidence pointers.
- [ ] T027 Update `_memory.continuity` blocks to `completion_pct: 100`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 4 verification dispatches produced expected outcomes
- [ ] Strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Origin**: F-Stage-E-001 — `.opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/implementation-summary.md` §Known Limitations
- **Related memory**: `feedback_codex_spawnagent_allowlist.md` (different bug, similar inline-contract pattern), `feedback_gate3_no_tmp_exemption.md` (related Gate 3 gotcha that this fix may also need to handle in the bypass branch)
<!-- /ANCHOR:cross-refs -->
