---
title: "Goal: Phase 3: update"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/003-update"
    last_updated_at: "2026-10-02T16:10:14Z"
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
# Goal: Phase 3: update

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:update` matched to the current system on evidence from this checkout, redesigned as a release-aware updater that updates the skills an operator never customized and proposes alignment for the ones they did, with today's database rebuild kept as `/doctor:rebuild`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The verdict rests on what this checkout does, shown by command output or file:line, never on what a doc says. |
| D2 | A defect found in the subsystem the doctor inspects is recorded as a finding, not fixed in this phase. |
| D3 | Retiring a target removes its route and its workflow asset and changes nothing else. |
| D4 | The redesign follows `research/research.md` and the settled choices in `scratch/design.md`. |
| D5 | A locally changed file is never overwritten without a recorded per-file decision; merged text is written only after an explicit `merge` or `use-proposal` decision. |
| D6 | The database rebuild keeps its behaviour under its new name, apart from the held rebuild fixes. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-update.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:update` on this checkout
- [ ] `implementation-summary.md` states one verdict, keep, fix or retire, and the evidence behind it
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 after the verdict is applied
- [ ] `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` reports zero failures
- [ ] `.skilled/commands/doctor/rebuild.md` and `.skilled/commands/doctor/update.md` both exist, and a bare `/doctor:update` routes to the read-only `doctor-update-check.yaml`
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
| Audit evidence and verdict | Done | `scratch/reality-check.md`, `scratch/doctor-run.log`, `scratch/proposal.md` — every named path, flag and variable marked present, moved or missing; verdict `fix` |
| Research | Done | `research/research.md` — 10 of 10 iterations on `cli-pi` with `opencode-go/deepseek-v4.1-flash` at max, stop reason `maxIterationsReached`; decision record DR-Q4-001 in section 9 |
| Design settled | Done | `scratch/design.md` section 1 — two commands, bare `/doctor:update` runs `check`, `.skilled/release/base.json` and `divergence.json` git-tracked, run directories gitignored, prereleases excluded unless named, merged text only after a decision |
| Rebuild moved to `/doctor:rebuild` | Done | commit `b0be233a6b` — router, workflow YAML, presentation and state files renamed; held rebuild fixes applied; six playbook scenarios, feature catalog, contract and mirrors swept |
| Release-update engine built | Done | commit `b853457597` — `release-update.cjs` with `check`, `align`, `decide`, `apply`, `rollback`; `tests/release-update.test.cjs`; `.skilled/release/runs/` gitignored |
| `/doctor:update` workflows and registration | Done | commit `8215a33a7b` — thin router, `doctor-update-check/align/apply.yaml`, presentation; `_routes.yaml` standalone entries with the actions map; contract, README and prompt mirrors updated |
| Verification | Done | tests 16 pass / 0 fail; `route-validate.sh` exit 0 (9 routes); catalog mirror `STATUS=OK`; `validate_document.py` 0 issues; four workflow YAMLs parse; prompts PASS 34 each; mirrors PASS 174 |
| Phase closure | Done | `spec.md` status Complete; `acceptance-criteria.md` five rows `Met` and AC-001 `Superseded` through ADR-001; strict validation passes |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation: `design.md` named a flag that does not exist | The first design used `regenerate-skill-derived.cjs --check`; the script has no such flag and the build halted on it. The design now uses `--all --dry-run` as its check mode and `--all --write` as its repair, and the apply workflow passes only when the JSON reports changed 0 and errored 0, because the script can exit 0 while reporting stale items. |
| Deviation: `apply` requires an existing alignment run | Even when only `update` or `new` units need writes, `apply` refuses without the run directory; the apply workflow directs the operator to align first. Accepted: the run freezes the plan the drift guard checks against. |
| Fixed defect: unit status during the first engine build | The first build reported three locally created units (cli-classifier, cli-deem, cli-jev) as removed and turned any customized unit into updates-available. Fixed with a new unit status `local` and an overall status driven only by release-side changes; four tests added. |
| Finding: `/deep:research` workflow defects during the research run | `step_create_state_log` needed the gateway; the marker scan raised a false positive on a DEEP-RESEARCH header; the lock release needs `--nonce`; bookkeeping events were refused with exit 1; the graph upsert was skipped; the strategy's key-question checkboxes were never ticked (research.md section 16); `resource-map.md` lists 0 references because the delta records carry no path fields (section 15); and its `git add` staged 93 paths including lock and lock-coordinator state, which the orchestrator unstaged. |
| Finding: research questions left open | The full customization signal set beyond git history and `provenance_fingerprint` (Q2), the exact hash input of `provenance_fingerprint` (Q3a), and the prerelease policy beyond "excluded unless named" (research.md section 12). |
| Finding: mutation-class gate manifest location | The gate's manifest lives inside `doctor-mcp-install.yaml` (recorded in phase 001), so its coverage stays coupled to that workflow. |
<!-- /ANCHOR:log -->
