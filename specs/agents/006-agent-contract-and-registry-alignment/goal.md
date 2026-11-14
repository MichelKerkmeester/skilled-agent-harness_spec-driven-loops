---
title: "Goal: Agent contract and registry alignment"
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
    packet_pointer: "agents/006-agent-contract-and-registry-alignment"
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
# Goal: Agent contract and registry alignment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the eleven agent definition files in `.skilled/agents/` state consistent contracts, reach skills through their entry points, follow the agent template and say each rule once, with CI failing when a roster, a cited skill path or an outline drifts.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The canonical files are `.skilled/agents/*.md`. Runtime copies are regenerated, never hand-edited, and the mirror check passes at the end of every phase. |
| D2 | Phases 001 to 005 run in order. Phase 006 may run at any point. |
| D3 | The roster fix is a registry, `.skilled/agents/agent-registry.json`, with generated rosters. Operator answer, 2026-11-14. |
| D4 | Every check lives in the `--check` mode of `.skilled/bin/sync-agent-roster.cjs`. No second check script is added. |
| D5 | No rule is removed, moved or reworded without a parity or removal row written before the edit. |
| D6 | No skill router, registry or reference file is edited. An unreachable route is reported to the skill's owner. |
| D7 | The eight closing summaries are removed and three agents are tested before and after. Operator answer, 2026-11-14. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-fix-agent-contract-contradictions | `001-fix-agent-contract-contradictions/goal.md` |
| 002-agent-registry-and-generated-rosters | `002-agent-registry-and-generated-rosters/goal.md` |
| 003-skill-binding-through-routers | `003-skill-binding-through-routers/goal.md` |
| 004-agent-template-conformance-and-drift-check | `004-agent-template-conformance-and-drift-check/goal.md` |
| 005-trim-duplicated-and-dead-agent-text | `005-trim-duplicated-and-dead-agent-text/goal.md` |
| 006-codex-persona-tool-mapping | `006-codex-persona-tool-mapping/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -n -e 'RETURN is .DONE.' -e 'Skip steps 3-5' -e 'all custom agents use the general subagent type' .skilled/agents` prints no line
- [ ] `rg -n -i -e 'memory tools' -e 'copilot profile' .skilled/agents` prints no line
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0, and `rg -c '@design' .skilled/agents/orchestrate.md` prints 3 or more
- [ ] `rg -l -i '^## [0-9]+\. ROUTING SCAN' .skilled/agents` prints no path
- [ ] `wc -w .skilled/agents/*.md` prints a total of 50000 or lower
- [ ] `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints 1 or more
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0, and `validate.sh specs/agents/006-agent-contract-and-registry-alignment --recursive --strict` prints only `RESULT: PASSED` result lines
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
| Phase 001 contract contradictions | Complete | 10 of 10 acceptance rows Met, mirror check exit 0 |
| Phase 002 registry and generated rosters | Complete | 8 of 8 acceptance rows Met, roster check exit 0, 4 tests passed |
| Phase 003 skill binding through routers | Complete | 7 of 7 acceptance rows Met, roster check exit 0 with the path check on, 7 tests passed |
| Phase 004 template conformance and drift check | Complete | 7 of 7 acceptance rows Met, roster check exit 0 with the outline check on, 12 tests passed |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | |
<!-- /ANCHOR:log -->
