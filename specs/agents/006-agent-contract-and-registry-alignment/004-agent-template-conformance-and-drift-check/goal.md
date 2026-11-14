---
title: "Goal: Phase 4: agent-template-conformance-and-drift-check"
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
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/004-agent-template-conformance-and-drift-check"
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
# Goal: Phase 4: agent-template-conformance-and-drift-check

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every agent file follows the template's current outline or carries a named exception, and CI fails the day one drifts.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The check reads the required section list from the agent template and holds no copy of it. |
| D2 | A deliberate deviation is a registry exception with a reason. It is never forced into the outline. |
| D3 | A moved block keeps its wording. Only its heading changes. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] The vitest cases `flags a missing section`, `flags a renamed section` and `flags an out-of-order section` pass, and `node .skilled/bin/sync-agent-roster.cjs --check` exits 0
- [ ] `scratch/move-parity.md` lists each moved block with the result `identical apart from heading`
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `rg -l -i '^## [0-9]+\. ROUTING SCAN' .skilled/agents` prints no path, and `rg -l '^## [0-9]+\. CAPABILITY SCAN' .skilled/agents` prints 11 paths
- [ ] `rg -l '^## [0-9]+\. HOOK-INJECTED CONTEXT ROUTING' .skilled/agents` prints 11 paths
- [ ] `scratch/section-refs.md` lists every reference with the result `resolves`
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
