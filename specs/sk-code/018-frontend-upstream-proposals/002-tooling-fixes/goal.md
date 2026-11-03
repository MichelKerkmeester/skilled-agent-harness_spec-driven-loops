---
title: "Goal: Phase 2: tooling-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "tooling fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/002-tooling-fixes"
    last_updated_at: "2026-11-03T08:33:54Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: tooling-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the intent-signal generator report and prune router phrases that no router declares any longer, and make a default router-reach run report reach failures rather than advisor load.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A signal carrying the keep marker is never reported or removed. |
| D2 | No live hub's `graph-metadata.json` is pruned in this phase; each hub's first pruning `--write` is reviewed by its owner. |
| D3 | The reach fix is chosen from a measured run, not from preference. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] On a fixture hub with one undeclared signal, `generate-router-intent-signals.cjs --check` names it, counts it and exits 1
- [ ] On that fixture, `--write` removes the orphan and keeps the other signals in order, and a keep-marked signal survives
- [ ] A reach run with no `--concurrency` flag uses the safer default, pinned by a test
- [ ] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` exits 0 after the last edit
- [ ] This phase's `scratch/orphans.txt` holds the live orphan report and no hub `graph-metadata.json` changed
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
| Phase planned | Pending | Planning docs authored 2026-11-03; nothing built |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
