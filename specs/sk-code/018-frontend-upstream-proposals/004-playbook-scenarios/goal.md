---
title: "Goal: Phase 4: playbook-scenarios"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook scenarios goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/004-playbook-scenarios"
    last_updated_at: "2026-11-03T08:33:56Z"
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
# Goal: Phase 4: playbook-scenarios

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Give operators runnable scenarios for the Figma-to-code check and the project-profile slot, in both playbook packages, without duplicating what Skilled already tests.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A scenario is added only when no existing scenario already tests it; SKD-010 is checked first. |
| D2 | No scenario carries a Barter value or a Barter repository profile. |
| D3 | The phase starts only after phases 001 and 003 close. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `validate-playbook-package.cjs --package .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook` exits 0 and reports 20 scenarios across 7 categories
- [ ] `validate-playbook-package.cjs --package .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook` prints `PASS` with 13 or 14 scenarios
- [ ] A run of the check-a-built-screen scenario with one pass unavailable returns `INCOMPLETE`, saved in this phase's `scratch/check-run.txt`
- [ ] `rg -n -i "barter"` on every new scenario file prints nothing
- [ ] This phase's `scratch/skd-010-overlap.md` records whether the token-or-scale scenario was added and why
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
