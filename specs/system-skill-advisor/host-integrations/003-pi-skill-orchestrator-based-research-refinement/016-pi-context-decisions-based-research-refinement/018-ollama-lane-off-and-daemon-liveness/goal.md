---
title: "Goal: Phase 18: ollama-lane-off-and-daemon-liveness"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ollama lane off and daemon liveness goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/018-ollama-lane-off-and-daemon-liveness"
    last_updated_at: "2026-11-19T14:42:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-ollama-lane-off-and-daemon-liveness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: ollama-lane-off-and-daemon-liveness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** No advisor prompt waits on Ollama, and no advisor server outlives its launcher or stays wedged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Guard plus default weight 0, with `live: true` kept; the shadow weight stays 0.05 |
| D2 | Fall back to the guard alone if weight 0 adds a none-gold fire |
| D3 | Liveness is a parent-pid check in the server and a heartbeat-file watchdog in the launcher, never a socket ping |
| D4 | `system-spec-kit/shared/embeddings` is not changed |
| D5 | Version 1.2.0.0; commit, merge to main and push are approved |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `npx vitest run` exits 0 from `.skilled/skills/system-skill-advisor/runtime`, and from `.skilled` with `--config vitest.config.bin.ts`
- [ ] `rg -n "id: .semantic_shadow." .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` shows `defaultWeight: 0`, or `implementation-summary.md` records the none-gold fire that kept 0.05
- [ ] `rg -c ppid .skilled/skills/system-skill-advisor/runtime/advisor-server.ts` prints at least 1
- [ ] `git merge-base --is-ancestor worktrees/479-ollama-lane-off-and-daemon-liveness origin/main` exits 0
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
| Spec docs | Done | spec, plan, tasks and acceptance criteria written 2026-11-19 |

### Deviations and findings

| Item | Note |
|------|------|
| Liveness mechanism | The operator picked a launcher liveness ping. A ping marks IPC activity and would reset the 30-minute idle timer, so the operator approved a heartbeat-file watchdog instead on 2026-11-19 |
<!-- /ANCHOR:log -->
