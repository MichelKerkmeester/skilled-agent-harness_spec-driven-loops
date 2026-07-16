---
title: "Tasks: Deep-Loop Router Agent Deprecation"
description: "Task breakdown for phase 002 of packet 036 — deprecate the dead deep-loop primary router agent."
trigger_phrases:
  - "036 phase 002 tasks"
  - "deep-loop router deprecation tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/007-compiled-contract-compiler/002-deep-loop-router-deprecation"
    last_updated_at: "2026-07-04T12:55:17Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "None -- phase complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-002-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-Loop Router Agent Deprecation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete · `[ ]` pending. Each task cites its verification evidence inline.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Map the router's dependency surface (definition, dispatchers, registry, command wiring, doc refs) via a read-only investigation — verdict: off every live path.
- [x] **T002** Independently sweep for live dispatch shapes (`@deep-loop`, `subagent_type`/`agentType`, `Task(...deep-loop)`) — only the two orchestrate prohibition lines matched.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T003** `git rm` `.opencode/agents/deep-loop.md` + `.claude/agents/deep-loop.md` (same commit); `rm` the untracked `.codex/agents/deep-loop.md` local mirror.
- [x] **T004** Remove the `@deep-loop` illegal-chain example and reword the prohibition paragraph in all three `orchestrate.md` mirrors, preserving the positive "dispatch the leaf directly at depth 1" rule and a generalized no-intermediary guardrail.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T005** Direct `.opencode`↔`.claude` basename-parity diff — identical agent sets, `deep-loop.md` absent from both.
- [x] **T006** Re-run the agent-mirror-sync checker on the changed paths — `2 agent(s) checked — all mirrors in sync — OK`, exit 0.
- [x] **T007** Repo-wide reference sweep — router fully dereferenced outside historical spec artifacts.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All three mirror files deleted, orchestrate mirrors reworded, parity + mirror-sync + reference-sweep green. Complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements REQ-001..REQ-004
- `plan.md` — implementation phases
- `implementation-summary.md` — evidence
<!-- /ANCHOR:cross-refs -->
