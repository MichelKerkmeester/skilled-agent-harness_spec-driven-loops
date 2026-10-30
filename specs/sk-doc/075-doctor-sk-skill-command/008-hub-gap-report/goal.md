---
title: "Goal: Phase 8: hub-gap-report"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub gap report goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/008-hub-gap-report"
    last_updated_at: "2026-10-30T10:14:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Executed every completion criterion again after the review fixes"
    next_safe_action: "Start phase 009, or add the option to command-contract.json when a phase owns that file"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/sk-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs"
      - ".skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-285-doctor-hub-gap-report"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: hub-gap-report

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give `/doctor:sk-skill check` a read-only report of which of the 11 mode-integration surfaces a skill would still need under a given hub.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The report writes nothing; mode-into-hub conversion stays refused. |
| D2 | A row with no probe that ran prints UNKNOWN, never present. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `sk-skill-check.cjs check <mode> --into-hub <hub>` on a mode shipped in that hub prints 11 rows, none missing, and exits 0 — observed: `cli-jev` into `cli-classifier`, 9 pass and 2 n/a, exit 0
- [x] The same command on the fixture hub whose mode lacks `routerSignals` prints row 2 missing and exits 1 — observed in the unit test and in a CLI run against `hub-gap`
- [x] `git status --porcelain` is identical before and after an `--into-hub` run — observed: 8 entries each, no diff
- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0 — observed: 53 of 53
- [x] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with `--into-hub` in the check route's `allowed_flags` — observed: 19 routes validated, exit 0
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
| Phase planned | Done | Spec docs authored 2026-10-30 |
| Eleven-row report | Done | `sk-skill-check.cjs --into-hub`, text and JSON, both fixture hubs and a shipped hub |
| Command surfaces | Done | Route `allowed_flags`, workflow input and steps, router table, presentation template |
| Verification | Done | 53 node tests, 14 contract tests, route-validate exit 0, run-all 7 suites, `validate.sh --strict` `RESULT: PASSED` |
| Review fixes | Done | Rows stop passing by absence, the requested mode is reported, and the text names an unfinished table; every P0 and P1 landed with a test that failed first |

### Deviations and findings

| Item | Note |
|------|------|
| Frontmatter `argument-hint` unchanged | `command-contract.json` pins the exact hint and the contract test asserts containment; that file is outside this phase's file list, so the flag lives in the router's argument table, the route, the workflow input and the presentation |
| Fixture hubs do not pass the whole hub contract | They carry the routing surfaces the report reads, so the unit tests stub `parent-skill-check.cjs`; a CLI run against them prints the hub-contract findings they deliberately have |
| No agent-runtime manual run | Delivered from a non-interactive worker, so the interactive render is covered by renderer assertions and CLI output instead |
| A row passed by absence | `parent-skill-check.cjs` stops before printing 5b, 5e and 5i when the hub has no router, so H2 and H3 had no failure line to read. They now also count `5a` as their failure and need their confirming PASS line; the copied-hub case runs the real checker to keep it fixed |
| `FULL_INVENTORY` counted as a mode's intent | The full-toolkit block loads every leaf, so it cannot prove a mode's own stage-two intent. It is excluded from both the text map and the parsed router map |
| One packet, two modes | `sk-create-skill-parent` shares `sk-create-skill`'s packet, so the report described the base mode. It now reads the registry entry's `workflowMode` and prefers an exact match over the packet fallback |
<!-- /ANCHOR:log -->
