---
title: "Goal: Phase 14: fix-deep-review-findings"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix deep review findings goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings"
    last_updated_at: "2026-11-24T06:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive from spec.md and acceptance-criteria.md"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2a13155f-ba79-49ab-9967-8fdff087389a"
      parent_session_id: "587eb5dd-b522-4898-9ee2-a03a0563e3ad"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: fix-deep-review-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every finding from the 2026-11-24 deep review of the browser-use hub epic at its source, so the installer parity test passes and a follow-up review can record the checklist evidence as pass.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every open finding in `../review/deep-review-findings-registry.json` is fixed or closed by a recorded decision. None is dropped. |
| D2 | No package is installed, fetched or launched to fix a finding. An install stays an operator stop-for-yes. |
| D3 | The ClickUp evidence finding is closed by disclosure, not by a live rerun. |
| D4 | Fix lanes own disjoint files and never commit. The operator decides the commit and any re-review. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] node --test .skilled/bin/tests/mcp-installers.test.cjs prints pass 5 and fail 0
- [x] rg for npx -y bladebro in the mcp-bladebro packet prints only lines that name an operator yes and bladebro@4.8.2
- [x] rg for browser-debugger-cli@alpha in the mcp-chrome-devtools packet, changelog and benchmark reports excluded, prints no match
- [x] parent-skill-check.cjs on the mcp-browser-use hub prints OK with 0 warnings, and the Aside playbook validator prints warnings=0
- [x] The 2026-11-24 two-stage replay under the hub's compiled-routing reports passes every original, paraphrase and out-of-domain row
- [x] validate.sh --strict --recursive on the hub packet prints RESULT: PASSED for every folder
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
| Packet planned | Done | spec, plan, tasks and acceptance criteria name one requirement per distinct defect, 20 in all |
| Parity failure reproduced | Done | `node --test .skilled/bin/tests/mcp-installers.test.cjs` printed pass 4, fail 1, exit 1 |
| Fix lanes A to E | Done | Each lane's check reruns from the final tree, see `tasks.md` T004 to T021 |
| Advisor scorer (Q001, Q003, Q004) | Done | Advisor 2.0.2.0. Ratchet held except unknown 13 to 14, full suite back to its one known failure |
| Two-stage replay | Done | 48 of 49 pass. MBU-PB-04 fails at stage one only |
| Leftovers, re-mint, gates; scorer widen chosen | In Progress | parity 5/5, hub check OK 0 warnings, route guard failures 0, browser playbooks warnings=0 |

### Deviations and findings

| Item | Note |
|------|------|
| Fix lanes ran as native subagents in this session | The parent's D4 names a second Claude account. The operator asked for an opus-medium swarm of native agents, and this session checks each lane's diff instead |
<!-- /ANCHOR:log -->
