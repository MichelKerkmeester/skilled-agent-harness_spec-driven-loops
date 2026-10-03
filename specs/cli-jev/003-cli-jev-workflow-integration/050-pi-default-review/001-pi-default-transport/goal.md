---
title: "Goal: Phase 1: Make Pi the default Jev transport when it is available"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review/001-pi-default-transport"
    last_updated_at: "2026-10-03T17:39:27Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-050"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: Make Pi the default Jev transport when it is available

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer Jev calls through Pi by default whenever Pi can answer them, and through the jev CLI otherwise.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | With no transport named, Pi answers when its preflight passes and the CLI answers otherwise, with no skip line |
| D2 | `JEV_TRANSPORT=jev` forces the CLI and `JEV_TRANSPORT=pi` keeps its skip line. Both stay as they are |
| D3 | The module never reads a credential. Pi uses its own store or the caller's environment |
| D4 | No feature turns on by default. Each scorer still calls Jev only behind `--jev` and its auth gate |
| D5 | Workers per 003 D5. The session verifies and commits, path-scoped |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The transport suite passes with cases for the automatic route on `choice` and `noul`, each failing gate, and both `JEV_TRANSPORT` values
- [ ] All eight scorers call Jev through `spawnClassifierCall`, each with a routing test, and each suite passes at or above its baseline with the key set and unset
- [ ] A live smoke answers one `noul` and one `choice` call through Pi with the key, and through the CLI without it
- [ ] `validate_document.py` exits 0 on each changed doc, and the cross-family review leaves no open P0 or P1
- [ ] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from the operator's request |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
