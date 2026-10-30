---
title: "Goal: manifest and template block"
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
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "Waits on /doctor:sk-skill (packet sk-doc/075-doctor-sk-skill-command) landing on main"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: manifest and template block

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Put the shipped template's surface in one checked manifest and give the template the one sentence and the empty block that point a repository at where its own content belongs.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One manifest holds the authored keys and a generated `derived` key; the generated half is never hand-edited. |
| D2 | Both root-file edits and the regenerated derived key land in one commit, because the freshness check compares them. |
| D3 | The block markers are lowercase and namespaced, and the block sits after the last shipped section. |
| D4 | The pin list names the consumer of each pin, so a pin that no longer exists in its consumer fails the suite. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0 and its `PASS` line names 46 sections, the pin count and a fresh derived key
- [ ] `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` reports `fail 0`
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints `OK: all rule invariants present` with the last delivery anchor at or before byte 16374
- [ ] `grep -c 'skilled:repo-local:start' AGENTS.md` prints `1` and `wc -c < AGENTS.md` prints at most `27899`
- [ ] `grep -c "'AGENTS.md'" .github/workflows/spec-kit-check.yml` prints `2`
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
| Specification, plan, tasks and criteria authored | Done | This packet's four documents |
| Baseline recorded | Done | `spec.md` section 2 quotes the two commands this child moves |
| Implementation | Pending | Waits on the doctor sk-skill command landing on main |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No work has run |
<!-- /ANCHOR:log -->
