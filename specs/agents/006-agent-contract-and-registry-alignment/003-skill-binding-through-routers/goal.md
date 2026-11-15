---
title: "Goal: Phase 3: skill-binding-through-routers"
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
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/003-skill-binding-through-routers"
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
# Goal: Phase 3: skill-binding-through-routers

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every agent reaches a skill through that skill's entry point and router, and CI fails when an agent cites a skill path that is not on disk.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The parity table is written before any path is removed. A path the router cannot select stays in the agent file. |
| D2 | The path check is a branch of the existing check mode. No new script is added. |
| D3 | `code.md` and `review.md` are not edited in this phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] The vitest case `flags a missing skill path` passes, and `node .skilled/bin/sync-agent-roster.cjs --check` exits 0
- [ ] `scratch/route-parity.md` has one row per removed path, each ending `reachable` or `kept, router cannot select it`
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `rg -n 'sk-doc/sk-create-[a-z-]+/assets/' .skilled/agents/markdown.md` prints no line
- [ ] `rg -n 'sk-code-review/references/review-core.md' .skilled/agents/deep-review.md` prints no line, and `rg -c 'sk-code-review/SKILL.md' .skilled/agents/deep-review.md` prints 1 or more
- [ ] `rg -c 'SKILL.md' .skilled/agents/debug.md .skilled/agents/context.md .skilled/agents/prompt-improver.md` prints 1 or more for each file
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
