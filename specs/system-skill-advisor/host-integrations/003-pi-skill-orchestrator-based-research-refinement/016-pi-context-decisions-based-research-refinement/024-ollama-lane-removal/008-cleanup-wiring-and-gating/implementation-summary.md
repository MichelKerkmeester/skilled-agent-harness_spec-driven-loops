---
title: "Implementation Summary"
description: "Planned, not built: once this phase lands, /doctor:update apply cleans what the retired lane left on the machine it runs on, asks about the pulled shared model on every run and remembers no answer, and a lane term that returns to any tracked file outside specs/ fails CI and the doctor tests."
trigger_phrases:
  - "cleanup wiring and gating implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating"
    last_updated_at: "2026-11-21T00:00:00Z"
    last_updated_by: "plan-author"
    recent_action: "Planned the phase: spec, plan, tasks and acceptance criteria"
    next_safe_action: "Run /speckit:implement after phase 007 lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-cleanup-wiring-and-gating"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-cleanup-wiring-and-gating |
| **Completed** | 2026-11-21 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is planned: `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` describe the change, and this summary records what changes once `/speckit:implement` runs.

### Phase 8: cleanup-wiring-and-gating

When this phase lands, `/doctor:update apply` finishes with a lane cleanup right after the advisor rebuild prompt. You approve the update once, and the plan tells you the cleanup will delete what the retired embedding lane left in this checkout: the old database and its backup copies, compiled lane files, the model server's files and the 132 MB model cache inside the package folder. If a local model server lists the pulled shared model, you are asked about it on that run, every run, and your answer is used once and never written down. What only you can remove, the module folders that `npm ci` clears and the other worktrees, is listed with the command to run.

The residue check also starts guarding the repository. A new job in `advisory-checks.yml` and a doctor test run its repo mode, so a lane term that comes back in any tracked file outside `specs/` fails the build. The four outputs of the trigger index generator are read by where their lane entries point, so no whole-file allowlist row hides them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Pending | The planned list is `spec.md` Files to Change; this table records what actually changed after implementation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The plan is one commit on `worktrees/497-ollama-lane-removal` after phase 007's, checked by tasks T028 to T038 in `tasks.md`. The tool changes and their cases come first, then the doctor workflow, presentation and contract test, then the READMEs, playbooks and the changelog check. The CI job and the doctor gate are written last, only after a repo-mode run on that same tree prints `live        : 0` (T025). No apply runs against the operator's machine at any step (parent decision D6). The new CI job first runs when the operator pushes, which this phase does not do (parent decision D2).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The doctor workflow asks the shared-model question and passes `--shared-model` for that run only | An agent's shell has no terminal, so without it the update would keep the model silently, the "Only print the command" option decision Q006 rejected (`plan.md` ADR-001, Proposed) |
| Owned deletes run under the one startup approval, disclosed in the plan | Each rebuild writes a new backup copy, so a separate cleanup prompt would fire on every update (`plan.md` ADR-002) |
| M5 checks the package-local model cache and deletes it without asking | The lane's model library cached inside its own package folder, and the hub cache holds no lane copy (`plan.md` ADR-003) |
| Apply changes nothing in a checkout that still holds a lane source | All 24 other worktrees here still run lane code that needs those files (`plan.md` ADR-004) |
| Ownership follows the first script argument through the folder's real path | A later argument naming the script no longer counts, and a server whose script was deleted is still recognized (`plan.md` ADR-005) |
| Gate in an `advisory-checks.yml` job and a doctor test, not pre-commit | Repo mode needs no install, the file runs on every push and pull request, and 8.15 s per commit is the cost the hook header sends to CI (`plan.md` ADR-006) |
| Read the four index outputs by structure and drop phase 007's four rows | Phase 007 proposed it, and a whole-file row would hide a lane phrase that resolves to a live doc (`plan.md` ADR-007) |
| Keep every residue term inside the tool | The question reaches the workflow through `askFirst`, so the update workflow needs no allowlist row (`plan.md` ADR-008) |
| Prove goal criterion 2 on fixtures | Parent decision D6 forbids apply on the operator's machine (`plan.md` ADR-010, Proposed) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation gates, tasks T028 to T038 | Not run: nothing is built yet |
| Planning measurements, `spec.md` Measured Behavior at `1f85a9dd6dd` with phase 006 in flight | Recorded: repo mode exit 1 with 5 live paths, all generated outputs phase 007 owns, and 46 allowlist rows; machine mode on the operator's Mac exit 1 with M2, M6 and M8 found, M3 having cleared that day; machine mode on a clean fixture exit 0; no workflow or doctor command names the tool; sweep suite 51 of 51; run-all 55 files and 7 suites passed; route-validate, the link check, the mirror check, actionlint and the gate-input check green; a pseudo-terminal driver answered `n` twice with `isTTY=true` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` on the planned docs | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The operator's machine stays at machine-mode exit 1.** M2 clears with `npm ci` in both packages; M6 clears with a yes while the local model server is running, or with `ollama rm`; M8 clears only as each of the 24 other worktrees takes the removal and runs the cleanup, or is removed. M3 was found too until 2026-11-21, when this worktree's database was rewritten after phase 005's commit. Goal criterion 2 is evidenced on fixtures until the conductor answers `spec.md` open question 2.
2. **The shared-model question appears only while the local model server answers.** With it down, as on the operator's Mac now, the tool finds the model through its store, asks nothing, and the cleanup shows the command to remove it. Start the server and run the update again to be asked.
3. **The new CI job has not run on GitHub.** Its run block, actionlint and the gate-input check run locally; the first real run happens when the operator pushes.
4. **The advisory job's name still mentions doc-model references.** This phase adds a job and leaves the old name until the operator answers `spec.md` open question 3.
5. **Reading D5 as "the workflow asks for the tool" is Proposed.** If the conductor reads D5 another way, ADR-001 changes before T009 and T017 are built.
<!-- /ANCHOR:limitations -->

---
