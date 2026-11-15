---
title: "Goal: Phase 1: deep-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "mistral vibe deep research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research"
    last_updated_at: "2026-11-14T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Wrote the research brief"
    next_safe_action: "Scaffold children 004 to 012 from research/phase-plan.md"
    blockers: []
    key_files:
      - "research-angles.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: deep-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Decide how Mistral Vibe becomes a governed runtime mode, how much of cli-opencode's extension, hook and plugin surface it can carry, and in which order to build it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research is read-only: no write to `~/.vibe/` or any credential |
| D2 | cli-opencode is the parity baseline, and cli-pi the structural model for the packet |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/research.md` answers all eight angles in `research-angles.md`
- [x] The parity table rates every cli-opencode surface equivalent, partial or none
- [x] `research/phase-plan.md` lists the build phases with a handoff check each
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
| Research brief | Done | `research-angles.md` |
| Vibe install | Done | `vibe 3.1.2`, `research/evidence/vibe-help.txt` |
| Research loop | Done | Two lineages, 16 iterations, `research/research.md`, `research/phase-plan.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Root config | The runner was launched directly, so the root `deep-research-config.json` was written after the run from a lineage config |
| `~/.vibe` writes | Vibe commands created `logs/`, `vibehistory` and `trusted_folders.toml` in the operator's home; left in place |
| Staging | The workflow's `git add` step was skipped because other sessions share this checkout |
<!-- /ANCHOR:log -->
