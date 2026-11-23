---
title: "Goal: Phase 12: browser-hub-doc-topic"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "browser hub doc topic goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/012-browser-hub-doc-topic"
    last_updated_at: "2026-11-23T18:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Added the mcp-browser-use topic to /local-doc-alignment"
    next_safe_action: "Run /local-doc-alignment mcp-browser-use --lanes=devin"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-23-browser-hub-doc-topic"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: browser-hub-doc-topic

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** One `/local-doc-alignment mcp-browser-use` run checks every doc that names the browser hub or its modes against the hub's own files.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The topic's code root is the whole hub folder, `.skilled/skills/mcp-browser-use`. |
| D2 | The run uses the `devin` lane preset, as the operator asked. |
| D3 | The run's findings are reported to the operator and not fixed in this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `doc-alignment.cjs scope --topic mcp-browser-use` prints `STATUS=OK`
- [x] The `/local-doc-alignment mcp-browser-use --lanes=devin` run folder holds `report.md`
- [x] `validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub --recursive --strict` prints `RESULT: PASSED` for every folder
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
| Topic added | Done | The scope step printed `topic mcp-browser-use: 241 docs in 4 lanes, 4 checks, code roots 1` |
| Devin run | Done | `~/.local/state/local-doc-alignment/Skilled/20261123T181518Z/report.md`: 91 open findings, 28 P0, 38 P1, 25 P2, reported to the operator and not fixed |
| Save | Done | Continuity and 3 operator decisions written to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| `topics.json` is git-ignored | The topic cannot be committed. Its pre-change copy is in `~/.local/state/local-alignment-backups/20261123-devin-lane/` |
<!-- /ANCHOR:log -->
