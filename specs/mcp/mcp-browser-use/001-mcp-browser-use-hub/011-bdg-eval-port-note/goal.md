---
title: "Goal: Phase 11: bdg-eval-port-note"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "bdg eval port note goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/011-bdg-eval-port-note"
    last_updated_at: "2026-11-23T15:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Added the bdg dom eval port entry to the Chrome DevTools troubleshooting guide"
    next_safe_action: "Commit and push once the operator says so"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-23-bdg-eval-port-note"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: bdg-eval-port-note

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** An agent that gets `Session target not found` from `bdg dom eval` finds the cause and a working fix in the Chrome DevTools mode's troubleshooting guide.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The note goes in one place, `references/troubleshooting.md` §6, beside the other session errors. |
| D2 | The note states only what a repro or bdg's source confirms. The theory about where `-p` goes stays out. |
| D3 | bdg itself is not patched, and other entries in the guide are not edited. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `rg -c 'Session target not found|returnByValue'` on the guide prints 3
- [x] `parent-skill-check.cjs .skilled/skills/mcp-browser-use` prints `OK` with 0 warnings and exits 0
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
| Defect confirmed in bdg's source | Done | `dom/index.js:478` defaults the port to 9222, and line 480 looks up the tab on that port |
| Troubleshooting entry | Done | `rg -c` on the guide: no match at HEAD, 3 on the working tree |
| Mode changelog 1.0.27.0 | Done | Hub check: `13d-packet-version: 3 mode packet(s) match their newest changelog entry` |
| Browser hub check | Done | `OK: parent-skill-check — all hard invariants passed, 0 warnings` |

### Deviations and findings

| Item | Note |
|------|------|
| Worktree provisioning | sk-git's provisioning failed four builds because `system-spec-kit` had no `node_modules`. `npm ci` there, the runtime and CLI builds, and a second `provision` run fixed it, with 0 failures |
| Two daemons started by accident | `bdg --version` and `bdg cleanup` each started a bdg daemon with no browser. Both were stopped by pid. No further `bdg` command ran |
| Adjacent defects in the same guide | §5 suggests `CHROME_DEBUGGING_PORT`, which bdg 0.6.10 never reads. §7 passes JSON as a second positional argument, and `bdg cdp` takes `--params`. Both left unchanged for the operator |
<!-- /ANCHOR:log -->
