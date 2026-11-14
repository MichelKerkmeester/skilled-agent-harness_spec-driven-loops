---
title: "Goal: Phase 2: agent-registry-and-generated-rosters"
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
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/002-agent-registry-and-generated-rosters"
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
# Goal: Phase 2: agent-registry-and-generated-rosters

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** One registry names every agent, its tier, who may dispatch it and which skill it binds to, and every roster is generated from it and checked in CI.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The registry holds only name, tier, dispatchers, bound skills and task type. Permissions stay in each agent's frontmatter. |
| D2 | The `/design:*` commands are not changed. `design` is dispatched by the operator and the orchestrator. |
| D3 | Generated blocks are bounded by HTML comment markers, and a hand edit inside one fails the check. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0, and the vitest case that removes one record exits 1 naming the agent
- [ ] `rg -c '@design' .skilled/agents/orchestrate.md` prints 3 or more, and `rg -c '@prompt-improver' .skilled/agents/orchestrate.md` prints 3 or more
- [ ] The vitest case `rejects a hand-edited block` passes
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `rg -c 'sync-agent-roster.cjs --check' .github/workflows/agent-mirror-sync.yml` prints 1
- [ ] `node -e "const r=require('./.skilled/agents/agent-registry.json');process.exit(r.agents.every(a=>a.dispatchers.length)?0:1)"` exits 0
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
