---
title: "Goal: Phase 1: fix-agent-contract-contradictions"
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
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/001-fix-agent-contract-contradictions"
    last_updated_at: "2026-11-14T12:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-audit-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: fix-agent-contract-contradictions

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every agent file states one contract that its own permissions allow, so an agent that follows the file can finish its workflow and a caller can parse what comes back.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The calling workflow runs the council's gateway and helper scripts. The council gains no Bash permission. |
| D2 | `code` returns `PASS`, `FAIL` or `BLOCKED`. `DONE` is retired. |
| D3 | The orchestrator dispatches an agent by its own name. The general wrapper stays only for a runtime with no named agents. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -n 'Persist .ai-council/\*\*. artifacts directly via' .skilled/agents/ai-council.md` prints no line, and `rg -c 'calling workflow' .skilled/agents/ai-council.md` prints 2 or more
- [ ] `rg -n 'all custom agents use the general subagent type' .skilled/agents/orchestrate.md` prints no line, and `rg -c '"general"' .skilled/agents/orchestrate.md` prints no line
- [ ] `scratch/dispatch-probe.md` records the dispatch and the refusal, and `ls scratch/probe.txt` reports no such file
- [ ] `rg -n 'RETURN is .DONE.' .skilled/agents/code.md` prints no line, and `rg -c 'RETURN: <PASS' .skilled/agents/code.md` prints 1
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `rg -c '^### Step 9' .skilled/agents/deep-research.md` prints 1, and `scratch/step-order.md` shows the two lists side by side with no difference
- [ ] `rg -n -i -e 'memory tools' -e 'copilot profile' .skilled/agents` prints no line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | |
<!-- /ANCHOR:log -->
