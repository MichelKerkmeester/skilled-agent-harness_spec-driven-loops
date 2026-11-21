---
title: "Goal: cleanup wiring and gating"
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
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating"
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
# Goal: cleanup wiring and gating

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Wire the cleanup tool into `/doctor:update apply` and make the residue check gate, so the removal stays proven.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The cleanup runs after the rebuild prompt in `/doctor:update apply`, so it deletes the `.bak` copy that the rebuild made. |
| D2 | The residue check flips from report-only to gating in CI and in the doctor tests. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The residue check in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/` exits 0 in repo mode.
- [ ] The same residue check exits 0 in machine mode.
- [ ] The same residue check's planted-term fixture makes it exit 1.
- [ ] `.skilled/commands/doctor/assets/doctor-update-apply.yaml` calls the cleanup tool after the rebuild prompt.
- [ ] On each of two consecutive fixture runs, the cleanup asks about the pulled Ollama model and remembers no answer.
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
| Phase 008 | Pending | Parent phase map row 8 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Nothing has diverged from this directive. |
<!-- /ANCHOR:log -->
