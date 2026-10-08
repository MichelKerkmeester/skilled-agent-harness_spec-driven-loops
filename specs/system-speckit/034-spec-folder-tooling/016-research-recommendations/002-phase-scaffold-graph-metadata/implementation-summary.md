---
title: "Implementation Summary: Phase 2: phase-scaffold-graph-metadata"
description: "Status and summary of phase implementation: create.sh --phase now derives graph metadata for the parent and every child before it exits."
trigger_phrases:
  - "phase scaffold graph metadata implementation summary"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-phase-scaffold-graph-metadata |
| **Status** | Complete |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## Status: Complete

This phase is **complete**. Built in wave 1, reviewed once by the other model family, and verified by the orchestrator.

## What Was Built

A phase scaffold now passes the gate it ships with. `create.sh --phase` used to exit before the graph-metadata derivation that root scaffolds reach, so a fresh phase parent and its children carried stub metadata and failed `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` the moment they existed.

- The derivation is one helper, `backfill_graph_metadata`, that takes a list of folders. It warns and returns when the tsx loader or the backfill script is missing, and it prints a warning that names the folder when a derivation fails. The scaffold completes in each case.
- The phase block calls the helper once, with the parent followed by the `_child_paths` list, before the opt-in post-create check and the exit. The parent's `children_ids` comes from the on-disk directories, so no separate writer was needed.
- The root path calls the same helper for its one folder. The old child loop in the root path never ran for `--phase`, because the phase block exits first, so it was removed.
- `scaffold-passes-its-own-gate.vitest.ts` has a phase case. It scaffolds a parent with two children and runs `validate.sh --strict` on all three.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Add `backfill_graph_metadata`, call it from the phase block and the root path, drop the unreachable child loop |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` | Modified | Add a `scaffoldPhase` helper and the phase case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase was built in wave 1 and checked by running the phase case, a throwaway `create.sh --phase` scaffold and the full CLI suite. With HEAD `create.sh` the new phase case fails ("001-scaffold-gate-phase-probe did not report a clean gate"), so the case catches the bug it was written for.

### Review

Luna max fast reviewed read-only for one round and raised two P2 findings. Neither was applied.

| Finding | Why it was not applied |
|---------|------------------------|
| F1: the derivation warning now names the folder | Intended. The root path used to print one unnamed "skipped" line; the helper names the folder for every call. |
| F2: cleanup in the `scaffoldPhase` helper | The helper mirrors the cleanup pattern of the existing `scaffold()` helper, and the case it leaves open arises only on a run that is already failing. |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One helper takes a folder list, and the phase block calls it once | Both paths share one derivation, and the parent and children go through the same code the root scaffold already uses |
| The helper warns and returns on a missing tool or a failed derivation | Derivation failures stay warnings, as NFR-R01 asks, so the scaffold still completes; the missing-tool warning names the recovery command |
| The old child loop was removed instead of reached | It sat after the phase exit, so it never ran for `--phase`; the helper takes the children as arguments, which is the done-differently note on T005 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest run` on `scaffold-passes-its-own-gate` (cli project) | 6 passed, in the wave 1 evidence and in a rerun for this closeout |
| The same file against HEAD `create.sh` | The phase case fails |
| Throwaway `create.sh --phase` with two children, `validate.sh --strict` on the parent, `001-first` and `002-second` | `RESULT: PASSED` each; `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` pass; parent `children_ids` lists both children; folders removed afterwards |
| `bash -n create.sh` (run for this closeout) | Exit 0 |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` (wave 1 final gate) | rc 0; vitest 162 files passed and 3 skipped, 1648 tests passed and 19 skipped, 0 failed; legacy 12/0 and 2/0, validation 12/0; baseline at c85ec7f8803 was 161 files and 1639 passed |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | rc 0 |
| CLI typecheck and build | rc 0 each |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, Errors 0, Warnings 0 |
| `check-goal.cjs` on this folder | `RESULT: PASSED (5/5 checks)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase scaffolds made before this change keep their stubs.** Repairing them is out of scope here; `repair-derived.cjs` handles the corpus.
2. **The failure path has no test.** The guards for a missing tsx loader, a missing backfill script and a failed derivation were confirmed by reading the helper; the vitest file covers only a successful derivation.
3. **The suite numbers cover the whole wave.** The full-suite run includes the other wave 1 phases, so the delta against the baseline is not this phase alone.
4. **No changelog refresh.** The phase context asks for one, but no `changelog/` folder exists under the parent or the track, so there was nothing to refresh.
<!-- /ANCHOR:limitations -->

---
