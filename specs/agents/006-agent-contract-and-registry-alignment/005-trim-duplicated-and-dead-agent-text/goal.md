---
title: "Goal: Phase 5: trim-duplicated-and-dead-agent-text"
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
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/005-trim-duplicated-and-dead-agent-text"
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
# Goal: Phase 5: trim-duplicated-and-dead-agent-text

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Each agent file states each rule once, the one block all files share is identical everywhere and checked, and no rule is lost in the cut.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The removal map is written before any text is cut. |
| D2 | The shared advisor block stays in every file, byte-identical to the template's copy. |
| D3 | No rule is reworded to make it shorter. |
| D4 | 50,000 words is a ceiling. No rule is cut to reach it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `scratch/removal-map.md` has one row per removed block, and no row's last cell is empty
- [ ] `scratch/code-dispatch-after.md` holds the return, and each field named in `code.md` section 8 appears in it
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `rg -l '^│  AUTHORITY' .skilled/agents` prints no path
- [ ] The vitest case `flags a drifted shared block` passes, and `node .skilled/bin/sync-agent-roster.cjs --check` exits 0
- [ ] `scratch/after.txt` records the word count of each section, taken with the awk command in T002
- [ ] `wc -w .skilled/agents/*.md` prints a total of 50000 or lower
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
