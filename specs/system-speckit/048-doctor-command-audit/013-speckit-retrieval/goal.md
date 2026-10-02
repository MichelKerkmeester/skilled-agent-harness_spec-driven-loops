---
title: "Goal: Phase 13: speckit-retrieval"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/013-speckit-retrieval"
    last_updated_at: "2026-10-02T16:10:28Z"
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
# Goal: Phase 13: speckit-retrieval

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit speckit-retrieval` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

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

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-speckit-retrieval.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit speckit-retrieval` on this checkout
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
| Phase opened | Done | Route block, workflow asset, presentation and router read in full; scope fixed on `/doctor:speckit speckit-retrieval` |
| Inventory | Done | `scratch/reality-check.md` scores every named path, script, command, flag and environment variable with the command that showed it |
| Read-only run | Done | `scratch/doctor-run.log`: 23 prompt-set lookups exit 0 or 1; a missing index exits 2; the recipe returns 15 paths; cold-lookup p95 104.256 ms of 200 ms |
| Verdict | Done | `scratch/proposal.md`: **fix** — every dependency exists and the central lane works, six claims no longer match the system |
| Fixes applied | Done | Batch-edited manifest, asset, presentation and router; `route-validate.sh` exits 0 with 9 routes validated, 2 warnings |
| Verification | Done | `validate.sh --strict` reports `RESULT: PASSED`; AC-001 through AC-004 are Met |
| Phase closed | Done | `spec.md` status Complete, acceptance closure written, findings recorded in the summary |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation | The fixes were applied as one batch across the `/doctor:speckit` targets because they share `_routes.yaml`, `speckit.md` and the presentation; the review command is the batch diff, not a per-phase one |
| Deviation | The optional evidence-backed staleness probe in `scratch/proposal.md` was not applied; it is an addition, not a mismatch repair |
| Deviation | `doctor-update.yaml` still carries the dead `doctor_*.yaml` pattern; the release-aware update redesign owns that file |
| Finding | The committed trigger index is stale: 86 documents differ and the corpus hash moved on (`generate-trigger-index.mjs --check --json`, exit 1) |
| Finding | `folder-token-fallback` is unreachable at generation, so one phrase gets two labels depending on the reader (`generate-trigger-index.mjs:260` against `check-grep-convention-helper.mjs:187`) |
| Finding | Staleness detection can only be mtime-based; the index stores paths without per-path content hashes |
| Finding | `retrieval-conventions.md` §9 names an `.opencode/specs` symlink that does not exist |
| Finding | `runtime/cli/retrieval/README.md:94` still repeats the deleted CLAUDE.md symlink claim |
| Finding | The acceptance packet the doctor names as its bar points at paths that moved to `runtime/cli/retrieval/` and `runtime/data/` |
| Finding | Informational: the conventions pin ripgrep 14.1.1 while this host runs 15.2.0; the §2.5 hazard was re-tested and still holds |
<!-- /ANCHOR:log -->
