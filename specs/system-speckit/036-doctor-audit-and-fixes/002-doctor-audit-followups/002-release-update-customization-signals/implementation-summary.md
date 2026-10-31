---
title: "Implementation Summary: Phase 2: release-update-customization-signals"
description: "The release updater now tells generated files from authored ones, records a base for copied trees, has an explicit prerelease opt-in, and applies update-only units without an alignment run."
trigger_phrases:
  - "release update customization signals implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/002-release-update-customization-signals"
    last_updated_at: "2026-10-03T05:27:41Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Built and verified the phase"
    next_safe_action: "Parent session reviews and commits"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/release-update.cjs"
      - ".skilled/commands/doctor/scripts/tests/release-update.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-release-update-customization-signals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-release-update-customization-signals |
| **Completed** | 2026-10-03 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The release updater stops mistaking generator output for customization. A locally regenerated leaf manifest, trigger index or graph-metadata `derived` block no longer turns a unit customized; apply leaves those bytes alone and names the generator to rerun. A copied `.skilled/` tree can now record its base in one step, the prerelease rule is explicit, and an update-only apply no longer needs an alignment run.

### Phase 2: release-update-customization-signals

`release-update.cjs` gains a `generated` file class backed by an inventory walked from the writers, with one content rule for the hybrid `graph-metadata.json`: only a change confined to `derived` counts as generated. A new `record-base` subcommand writes `.skilled/release/base.json` for every unit of a named release, and `check` reports `baseRecording` so a first run names that step. `--include-prerelease` admits prerelease tags into latest-upstream resolution, which otherwise stays stable-only, and both orders compare version segments as numbers. With no alignment run, `apply` plans from the current check, writes only update and new units, re-reads each file under the lock, and records `plan.json` and `rollback.json` in a new run directory so rollback still works. A decisions file with no alignment run beside it is refused. The `provenance_fingerprint` pre-filter was evaluated and rejected (ADR-003).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modified | Generated class, `record-base`, `baseRecording`, `--include-prerelease`, apply without a run, `followUps.regenerate` |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modified | Six new cases and a stronger help case; 22 in all |
| `.skilled/commands/doctor/update.md` | Modified | Flag lists, release policy, first-run base recording |
| `.skilled/commands/doctor/assets/doctor-update-check.yaml` | Modified | Prerelease flag, new report fields, base-recording next step |
| `.skilled/commands/doctor/assets/doctor-update-align.yaml` | Modified | Prerelease flag |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Modified | No-run apply path, prerelease flag, `regenerate` follow-up |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modified | Flag table, release policy, generated-class and base-recording text, no-run apply note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The findings were re-checked against the engine first (`scratch/findings-recheck.md`) and the 16 existing cases passed before any edit. Each behaviour got a disposable-repository case, and the new cases were run against the unchanged engine to confirm they fail there (15 pass, 7 fail). The engine was never run with `align`, `apply` or `record-base` against this repository; only the read-only `check --json` ran here, before and after the change. The build orchestrator wrote the changes directly instead of dispatching CLI executors, because it runs as a leaf worker that may not dispatch other agents. Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Path list plus one content rule for generated files | No generator writes `mode-registry.json`, `hub-router.json` or skill `description.json`, so they stay authored; `graph-metadata.json` is the one hybrid file, and only its `derived` block is generated |
| A release authored edit to a regenerated graph metadata becomes take-release with `regenerate` | The release bytes carry the authored change and the derived block is rebuilt afterwards; nothing authored is lost |
| `record-base` asks for `--release` on a tag-less tree | Guessing the installed release would record a wrong base silently |
| `record-base` refuses while `base.json` is uncommitted | Recording writes a tracked file, so it follows the same discipline as apply |
| Apply without a run writes a run directory | Rollback reads `rollback.json` from a run; the no-run path must stay recoverable |
| Reject the fingerprint pre-filter | The structural rule answers the question directly and the fingerprint cannot be recomputed without the advisor's TypeScript extraction |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` | PASS, tests 22, pass 22, fail 0, exit 0 (`scratch/engine-tests.log`) |
| New cases against the unchanged engine | FAIL as expected: 15 pass, 7 fail |
| `node .skilled/commands/doctor/scripts/release-update.cjs --help` | PASS, lists `record-base` and `--include-prerelease` |
| `yaml.safe_load` on the three update workflows | PASS |
| `scratch/fixture-demo.sh` on disposable repositories | PASS: prerelease default v1.10.0.0, opted in v1.11.0.0-beta.1; copied tree inferred, then recorded |
| Read-only `release-update.cjs check --json` on this checkout | PASS, exit 0, status current, local 54 and current 30, 8 files classed generated |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No local unit here is generated-only.** The classifier is correct on this checkout but changes no unit's status, because every local unit also carries authored work since v4.0.0.2 (`scratch/measurement.md`).
2. **Inventory gaps are deliberate.** `leaf-aliases.json`, `intent_signals` and the compiled-routing activation manifests stay authored until a writer is proven to own them whole (`scratch/generated-inventory.md`).
3. **Regeneration is named, not run.** `followUps.regenerate` lists each generator; the apply workflow's post-apply battery already runs the leaf-manifest and derived-block checks, and the trigger index is `/doctor:rebuild`'s.
4. **`record-base` records units from the release tree.** A unit that exists only locally gets no record and stays inferred, which `baseRecording` reports.
<!-- /ANCHOR:limitations -->

---
