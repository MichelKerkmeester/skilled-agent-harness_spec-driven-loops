---
title: "Goal: Phase 10: skill-advisor"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/010-skill-advisor"
    last_updated_at: "2026-10-02T16:10:24Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: skill-advisor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit skill-advisor` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The verdict rests on what this checkout does, shown by command output or file:line, never on what a doc says. |
| D2 | A defect found in the subsystem the doctor inspects is recorded as a finding, not fixed in this phase. |
| D3 | Retiring a target removes its route and its workflow asset and changes nothing else. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-skill-advisor.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit skill-advisor` on this checkout
- [ ] `implementation-summary.md` states one verdict, keep, fix or retire, and the evidence behind it
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 after the verdict is applied
- [ ] `acceptance-criteria.md` shows every row as Met, Waived or Superseded
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
| Phase opened | Done | Packet scaffolded on 2026-10-02 with the goal, spec and criteria authored |
| Inventory complete | Done | `scratch/reality-check.md` marks every named item present, moved or missing with the command that showed it |
| Read-only run recorded | Done | `scratch/doctor-run.log` holds one pass that stops at every write and lists the skipped steps with their reasons |
| Verdict decided | Done | `scratch/proposal.md` — verdict fix, with the evidence for keeping and the three drift groups |
| Repairs applied | Done | Workflow, route and presentation updated; no `system_skill_advisor.` reference remains in the edited doctor files |
| Verification rerun | Done | `route-validate.sh` exit 0; YAML_OK; catalog mirror STATUS=OK; mutation-class guard PASS; no regression in the doctor script tests |
| Acceptance criteria | Done | Every row Met with the observed evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation | The shared batch was applied by GPT-6 Luna (cli-codex) because the doctor targets share their route manifest, router and presentation; the orchestrator reviewed the diff and reran the gates |
| Deviation | The recorded run was read-only and stopped at every write, so the mutating path and the advisor test suite were not executed; the command lines were checked individually instead |
| Deviation | The phrase-boost range `[-1.0, 2.0]` is a deliberate envelope around the observed -0.6 to 1.8, recorded as an operator judgment call rather than a measured bound |
| Finding (recorded, not fixed) | The skill graph reads as live while every one of its 14 tracked skills is stale: `staleness` compares content hashes and `freshness` compares mtimes |
| Finding (recorded, not fixed) | `advisor_status.skillCount` reports 20 by counting metadata files recursively, while the checkout has 14 skill folders |
| Finding (recorded, not fixed) | Changes made outside the CLI process do not move the freshness verdict, so a database indexed later than its sources reads as live |
| Finding (recorded, not fixed) | `PHRASE_BOOSTS` amounts are unbounded and undeclared, running from -0.6 to 1.8 with no constant, schema or doc stating a range |
| Finding (recorded, not fixed) | The advisor scorer reference cites moved line ranges for `explicit.ts` (`:8-90` and `:92-186` against the actual `:27-107` and `:109-240`) |
| Finding (recorded, not fixed) | `advisor_rebuild` and `skill_graph_scan` require `--trusted`, which the subsystem docs never state at CLI level |
| Finding (recorded, not fixed) | Frontmatter trigger phrases exist for 1 of 14 skills; the rest live in `graph-metadata.json` and body `Keywords:` comments |
<!-- /ANCHOR:log -->
