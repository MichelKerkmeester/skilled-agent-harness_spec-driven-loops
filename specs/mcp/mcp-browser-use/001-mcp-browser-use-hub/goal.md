---
title: "Goal: mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes"
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
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub"
    last_updated_at: "2026-11-21T12:30:00Z"
    last_updated_by: "planning-worker"
    recent_action: "Amended D2 with the operator's lane rule"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-21-browser-use-hub-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Agents reach Bladebro, Aside and Chrome DevTools through one hub, `.skilled/skills/mcp-browser-use/`, whose modes route through both advisor stages.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research first: 001 runs 10 iterations before any build; 002-006 are refined from its synthesis. |
| D2 | Each mode uses its CLI (`bladebro`, `aside`, `bdg`) when installed, and its MCP server via Code Mode when the CLI is missing or the task needs other Code Mode tools, parallel isolated sessions or an MCP-only capability (e.g. Chrome's `lighthouse_audit`, performance traces). |
| D3 | `mcp-tooling` keeps its six other modes unchanged. |
| D4 | Judgment work: Opus 5.5 medium, second Claude account. Bulk mechanical work: opencode-go/hy4-flash-free#high or Vibe deepseek-flash, Opus-reviewed. |
| D5 | Installing Bladebro needs an operator yes. Rollback: `npm uninstall -g bladebro` and remove its profile directory. |
| D6 | Mode folder names are decided by 001-research. |
| D7 | A mode is integrated only when both its routing stages pass. |
| D8 | No commits without the operator's instruction. |

D1 note: 12 ran, 2 operator-added for a setup fix. D1 stands.

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-research | `001-research/goal.md` |
| 002-hub-scaffold | `002-hub-scaffold/goal.md` |
| 003-mode-relocation | `003-mode-relocation/goal.md` |
| 004-bladebro-mode | `004-bladebro-mode/goal.md` |
| 005-routing-and-surfaces | `005-routing-and-surfaces/goal.md` |
| 006-verification | `006-verification/goal.md` |
| 007-bladebro-parity-and-changelogs | `007-bladebro-parity-and-changelogs/goal.md` |
| 008-live-runs-and-playbook-fixes | `008-live-runs-and-playbook-fixes/goal.md` |
| 009-sk-code-browser-evidence | `009-sk-code-browser-evidence/goal.md` |
| 010-mcp-tooling-browser-pointers | `010-mcp-tooling-browser-pointers/goal.md` |
| 011-bdg-eval-port-note | `011-bdg-eval-port-note/goal.md` |
| 012-browser-hub-doc-topic | `012-browser-hub-doc-topic/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] 001-research/research/deep-research-state.jsonl holds at least 10 iteration records and 001-research/research/research.md exists
- [x] .skilled/skills/mcp-browser-use/mode-registry.json lists exactly three modes and .skilled/skills/mcp-tooling/mode-registry.json lists six
- [x] rg for mcp-tooling/mcp-chrome-devtools or mcp-tooling/mcp-aside-devtools under .skilled excluding changelog and benchmark/reports folders, and for either id in .skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md}, prints no match
- [x] The parent-skill checker run with the mcp-browser-use hub path exits 0 and names that hub as its subject
- [x] One real browser request per mode returns mcp-browser-use from the advisor and that mode from the hub router
- [x] Each of the three modes has a manual testing playbook with a recorded run, a live Bladebro run on macOS included
- [x] validate.sh --strict --recursive on this packet prints RESULT: PASSED for the parent and every child
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
| Packet scaffolded with six phase children | Done | `ls` of the packet lists 001-research through 006-verification |
| Planning docs authored for parent and children | Done | validate.sh run recorded in each child's implementation-summary.md |
| 001-research loop | Done | 12 iteration records in `001-research/research/deep-research-state.jsonl` |
| D2 amended 2026-11-21 | Done | Operator answer: MCP via Code Mode also for composition with other Code Mode tools, parallel isolated sessions and MCP-only capability; objective, D1 note, D4, D7 and D8 wording tightened to stay in budget, meaning unchanged |
| Operator decisions 2026-11-21 | Done | Guard pattern edits in 003; criterion 3 narrowed to path references plus the old hub's own five files; 006 benchmark is the two-stage replay; criterion 1 reads "at least 10" |
| 005 routing and surfaces | Done, two criteria open | Both stages reach all three modes; `compiled-route.cjs` stays on the legacy sentinel for the new hub (no engine in `HUB_CHILD`), so stage two is proven through `hub-router.json`. Detail in `005-routing-and-surfaces/implementation-summary.md` |
| Plan + research session | done | 12 hy4 iterations, 002-006 refined, 10 decisions in decision-record.md, validate 7/7 PASSED |
| Session 84103bdd: engine, live runs, benchmark | Done, alignment open | compiled engine serving (6/6 route), Bladebro live incl. Aside attach 3/3, playbooks recorded, two-stage replay 6/6; alignment lanes done, critic next |
| Alignment fixes and closeout | Done | 28 findings fixed or decided (Q005-Q008 in 006 decision-record); validate --strict --recursive PASSED parent + 6 children; advisor suite 2570 pass |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal.md not produced by --with-goal | Written by hand from the sk-create-goal phase-parent template |
| Parent over the 4,000-character durable budget after the 007 and 008 binding rows | The slice measured 4165 characters. The three `FILL` template comments were removed (cut order step 3 in `budget-and-handoff.md`). It now measures 3704. No criterion and no decision changed |
| Brief estimated about 30 referencing files outside mcp-tooling | `rg -l` counted 45 on 2026-11-21, several of them generated fixtures and benchmark reports; 003 carries the measured list |
<!-- /ANCHOR:log -->
