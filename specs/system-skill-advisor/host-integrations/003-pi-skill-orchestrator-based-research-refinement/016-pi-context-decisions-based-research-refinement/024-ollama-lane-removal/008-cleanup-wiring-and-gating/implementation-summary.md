---
title: "Implementation Summary"
description: "/doctor:update apply now cleans what the retired lane left on the machine it runs on, asks about the pulled shared model on every run and remembers no answer, and a lane term that returns to any tracked file outside specs/ fails a blocking CI job and the doctor tests."
trigger_phrases:
  - "cleanup wiring and gating implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating"
    last_updated_at: "2026-11-21T07:50:22Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified phase 008"
    next_safe_action: "Run /local-doc-alignment and /local-skilled-alignment on the lane removal"
    packet_purpose: "Purpose: Every update removes what the lane left on the machine it runs on, asks about the pulled shared model each time, and any lane term that comes back fails CI and the doctor tests."
    blockers: []
    key_files:
      - "008-cleanup-wiring-and-gating/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:21afa2aa3e6ffb1fe5855e1f11a614de70855d4e3eee97ddac56eaecba1453b2"
      session_id: "scaffold-008-cleanup-wiring-and-gating"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/497-ollama-lane-removal"
      savedAt: "2026-11-21T07:50:22Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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

The lane cannot come back quietly, and an upgrade removes what it left behind. A lane term in any tracked file outside `specs/` now fails the blocking `lane-residue` job in `advisory-checks.yml` and the doctor test `lane-residue-gate.test.cjs`, and `/doctor:update apply` runs the cleanup after its rebuild step.

### Phase 8: cleanup-wiring-and-gating

The apply workflow runs the residue tool in apply mode on the machine it runs on. When the tool reports the pulled shared model in `askFirst`, the workflow asks the operator and passes `--shared-model delete` or `keep` to that one run; no answer is written to state, so the next run asks again. Repo mode now reads the four trigger index outputs by structure and fails when a lane path, phrase or spelling resolves outside `specs/` and the allowlist, which replaced the four whole-file rows phase 007 added. A malformed output makes it exit 2 rather than pass. The four hardening items from the first phase's review landed, and a backup copy of the advisor database counts as residue only when it still holds a lane object.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` | Modified | Structural index check, fail-closed shape checks, backup inspection, hardening |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Modified | 39 new cases, including two runs that each ask about the model |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Modified | The four index-output rows removed |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modified | Documents the index check and the gate |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml`, `doctor-update-presentation.txt` | Modified | The cleanup step and its per-run model question |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Modified | Pins the step order and that no answer reaches state |
| `.skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` | Created | Fails when repo mode finds a live lane term |
| `.github/workflows/advisory-checks.yml`, `.github/workflows/README.md` | Modified | The blocking `lane-residue` job |
| Two `/doctor:update apply` playbook pages | Modified | The cleanup step, with the scripted run pointed at scratch locations |
| `.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md` | Modified | The upgrade step names the wired cleanup |
| The four trigger index outputs | Regenerated | Follow the spec doc edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus worker reran the measurements at `e758041df47`, wired the workflow, built the index check, made the repo check gating only after repo mode printed `live : 0`, and proved apply on fixture roots only. The review returned REQUESTED_CHANGES: the index check defaulted a missing or renamed phrase-variants map to empty, so a lane spelling could pass the blocking job. The worker made every malformed shape exit 2 with three new cases, made the backup copy check inspect the file, and isolated the scripted playbook run. The worker stalled during its final reruns, so the conductor stopped it, read both fixes, reran the suites, repo mode and the planted fixture, regenerated the index as the last write and committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The workflow asks and passes `--shared-model` for one run | An agent-run update has no terminal for the tool to ask on, and decision D5 forbids remembering the answer |
| A structural index check replaces the four whole-file rows | Whole-file rows would hide any future lane term in those outputs |
| Malformed index outputs exit 2 | A check that defaults a missing map to empty reports clean when it checked nothing |
| Inspect backup copies instead of flagging all of them (conductor amendment to ADR-002) | Otherwise any normal rebuild after the removal leaves machine mode unable to read clean |
| Keep the advisory job's existing `name:` | Renaming a check others may depend on is the operator's call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sweep-lane-residue.mjs repo` | exit 0: 46 rows, 46 matched; index read by structure, 1069 lane paths, 389 lane phrases, 0 outside; live 0 |
| Planted lane term in a fixture repo with an empty allowlist | exit 1, `live : 1` |
| Machine mode on a fixture after apply | exit 0, nothing left (the worker's run) |
| Machine mode on the operator's machine, read only | exit 1: M2 (4), M6 (model server did not answer), M8 (27 worktrees) |
| `sweep-lane-residue.vitest.ts` | 90 passed, rerun by the conductor |
| `lane-residue-gate.test.cjs` and `doctor-update-contract.test.cjs` | 22 passed, 0 failed, rerun by the conductor |
| Doctor `run-all.sh` | 7 suites passed |
| Mirror check, link check | 260 mirrors in sync; 0 broken |
| actionlint, `check-gate-inputs.sh` | exit 0; `RESULT: PASSED` |
| `generate-trigger-index.mjs --check` | exit 0 after the last regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Machine mode still exits 1 on the operator's machine.** It clears once the operator runs `npm ci`, answers yes to the model question in a real `/doctor:update apply`, and retires the older worktrees that still hold the lane.
2. **The tool fails when it inherits `GIT_DIR`.** That was already true at `S`; a git hook that runs it would need to unset the variable first.
3. **Whether the `lane-residue` job is a required status check** depends on branch protection, which this run did not change.
4. **The advisory job's name** still describes its older purpose; renaming it is the operator's call.
<!-- /ANCHOR:limitations -->
