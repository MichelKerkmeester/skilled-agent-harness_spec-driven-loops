---
title: "Goal: lane core"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core"
    last_updated_at: "2026-11-20T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-497-ollama-lane-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: lane core

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Delete the lane's registry row, status contract, vector schema and embedders, so the advisor has no semantic lane left.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lane lands as one atomic commit, because the lane type derives from the registry row. |
| D2 | The dead `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` flag is removed at every writer site. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In `.skilled/skills/system-skill-advisor/runtime/`, `npm run typecheck`, `npm test`, `npm run build` and `npm run test:stress` each exit 0.
- [ ] `advisor_status` reports four lane keys and refuses the semantic-health flag.
- [ ] The advisor runtime imports nothing from the embeddings package, and `lib/embedders/` no longer exists.
- [ ] The four CI routing ratchets pass with score baselines untouched.
- [ ] The phase is one commit on `worktrees/497-ollama-lane-removal`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase 004 | Pending | Parent phase map row 4 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Nothing has diverged from this directive. |
<!-- /ANCHOR:log -->
