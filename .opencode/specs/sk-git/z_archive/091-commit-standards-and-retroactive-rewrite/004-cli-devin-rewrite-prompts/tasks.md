---
title: "Phase 004 Tasks: cli-devin Rewrite Prompts"
description: "Checkbox tasks for authoring deep-skill-style cli-devin commit-rewrite scaffolding."
trigger_phrases:
  - "112-cli-devin-rewrite-prompts tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/091-commit-standards-and-retroactive-rewrite/004-cli-devin-rewrite-prompts"
    last_updated_at: "2026-07-14T21:12:36Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 004 tasks"
    next_safe_action: "Read deep-research and cli-devin pattern references"
    blockers:
      - "Phase 002 must close first"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-tasks-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 004 — cli-devin Rewrite Prompts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P0/P1/P2] Description` — P0 = blocker, P1 = required, P2 = optional. Mark `[x]` with brief evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-001 [P0] Confirm Phase 002 closed (commit-standards + derivation-heuristics + 7 ADRs)
- [ ] T-002 [P1] Phase 003 status check (can run in parallel if 002 is locked)
- [ ] T-003 [P1] Read deep-research state_format, loop_protocol, convergence references
- [ ] T-004 [P1] Read cli-devin deep-loop-iter-template and agent-config-deep-research-iter
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### State schema
- [ ] T-010 [P0] Create `templates/commit-rewrite-config.json`
- [ ] T-011 [P0] Create `templates/commit-rewrite-state.jsonl-schema.md`
- [ ] T-012 [P0] Create `templates/commit-rewrite-strategy.md`
- [ ] T-013 [P0] Create `templates/iteration-NNN.md`
- [ ] T-014 [P0] Create `templates/output-contract.md`

### Agent-config
- [ ] T-020 [P0] Create `templates/agent-config-commit-rewrite-iter.json`
- [ ] T-021 [P0] `mcp_servers: [sequential_thinking]` with ≥5-thought instruction
- [ ] T-022 [P0] Scoped tool allowlist (Read + Exec git log/show + Write rewrites/JSONL only)
- [ ] T-023 [P0] `permission_mode: auto`
- [ ] T-024 [P0] Structural diff vs deep-research recipe; document intentional deltas

### Prompts
- [ ] T-030 [P0] Create `templates/iter-prompt-template.md`
- [ ] T-031 [P0] Create `templates/synthesis-prompt.md`
- [ ] T-032 [P0] sk-prompt CLEAR 5-check on iter-prompt-template

### ADRs
- [ ] T-040 [P0] ADR-001 state-schema choices
- [ ] T-041 [P0] ADR-002 batch-size rationale
- [ ] T-042 [P0] ADR-003 convergence criteria
- [ ] T-043 [P0] ADR-004 tool-allowlist scoping
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-050 [P0] `git clone --no-local . /tmp/112-throwaway`
- [ ] T-051 [P0] Hand-author 5-row `mapping.jsonl` for throwaway
- [ ] T-052 [P0] Create `templates/callbacks/apply-mapping.py` callback
- [ ] T-053 [P0] Run `git filter-repo --message-callback` against throwaway
- [ ] T-054 [P0] Verify 5 messages updated, others unchanged
- [ ] T-055 [P0] Copy `templates/agent-config-commit-rewrite-iter.json` to `.opencode/skills/cli-devin/assets/`
- [ ] T-056 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./004-cli-devin-rewrite-prompts --strict` exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- Agent-config promoted to cli-devin/assets/
- Dry-run on 5-row mapping succeeded
- `implementation-summary.md` updated with completion_pct=100
- Parent `graph-metadata.json` `derived.last_active_child_id` advanced to `005-…`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessor: `../003-sk-git-skill-update/`
- Successor: `../005-retroactive-rewrite-execution/`
- Pattern refs: `.opencode/skills/deep-research/`, `.opencode/skills/cli-devin/`
<!-- /ANCHOR:cross-refs -->
