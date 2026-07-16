---
title: "Implementation Summary: /deep:command-benchmark launcher"
description: "The two-axis launcher, owned assets, alignment alias, generated Codex mirror, and hermetic smoke are complete and G009-verified."
status: complete
trigger_phrases:
  - "command benchmark launcher implementation"
  - "deep command-benchmark smoke"
  - "command benchmark instrument validity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/009-command-benchmark-command"
    last_updated_at: "2026-07-15T13:01:42Z"
    last_updated_by: "claude"
    recent_action: "Generated Codex mirror (37/37) and verified all G009 gates"
    next_safe_action: "Proceed to phase 010 scorecard and closeout"
    blockers: []
    key_files:
      - ".opencode/commands/deep/command-benchmark.md"
      - ".opencode/commands/deep/assets/deep_command-benchmark_auto.yaml"
      - ".opencode/commands/deep/assets/deep_command-benchmark_confirm.yaml"
      - ".opencode/commands/scripts/smoke-command-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/mode-registry.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The launcher is an alignment alias, not a workflow mode."
      - "Subject failure remains publishable under INSTRUMENT=VALID."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-command-benchmark-command |
| **Status** | Complete |
| **Completed** | 7 of 7 tasks; launcher, assets, alias, generated Codex mirror, and hermetic smoke all G009-verified |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The command surface now has one workflow-YAML router that binds an explicit spec folder, immutable run ID, mode, and axis, then composes the two existing benchmark engines. The router has the canonical six numbered sections and keeps every visible setup, checkpoint, terminal, error, and next-step string in its presentation asset.

The conformance target loads the existing alignment workflow asset with the command-surface lane config, parsed lanes, and executing spec folder already bound. It never shells through a nested command and does not copy the alignment loop. The behavioral target invokes the shipped matrix scheduler through its frozen `--matrix` and `--out-dir` interface.

The terminal envelope treats instrumentation as orthogonal to subject results. `STATUS=FAIL` is reserved for invalid or failed instrumentation; a valid subject failure remains `STATUS=OK INSTRUMENT=VALID`. The two subject axes are copied from their owners and never averaged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/command-benchmark.md` | Created | Six-section router and blocking spec-folder gate |
| `.opencode/commands/deep/assets/deep_command-benchmark_auto.yaml` | Created | Autonomous two-axis dispatch and evidence pointers |
| `.opencode/commands/deep/assets/deep_command-benchmark_confirm.yaml` | Created | Confirmed two-axis dispatch and evidence pointers |
| `.opencode/commands/deep/assets/deep_command-benchmark_presentation.txt` | Created | Setup, checkpoint, terminal, and evidence presentation |
| `.opencode/commands/scripts/smoke-command-benchmark.cjs` | Created | Hermetic conformance, behavior, all-axis, and defect smoke |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Modified | Add the launcher to alignment aliases without adding a mode |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Modified | Permit the specialized pre-bound workflow composition |
| Phase documentation | Modified | Record implementation, verification, and the remaining sandbox blocker |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The smoke creates a temporary repo-external evidence tree. For conformance it resolves instrument validity through the real `scoping.cjs` lane-config parser — exercising both a healthy lane-config (INSTRUMENT=VALID) and a broken one (INSTRUMENT=INVALID, STATUS=FAIL, no subject verdict); only the conformance subject verdict itself is a deferred-live stand-in driven by the injected-defect switch. For behavior it derives four predeclared-skip cells from the frozen matrix, one for each command topology, and executes the real scheduler. The runner spawn seam is bound to a harmless local Node process as a second safety fence. No Claude, Codex, OpenCode, or other model process is invoked, and the temporary tree is removed at exit.

The launcher is deliberately absent from the behavioral scenario matrix. It is benchmark instrumentation, so adding a scenario that invokes the launcher would recursively run the benchmark from inside itself; the separate hermetic smoke covers the launcher contract instead.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse alignment workflow assets directly | Pre-bound lane and spec-folder inputs preserve one alignment state machine and avoid nested command dispatch |
| Call the matrix scheduler through its CLI | The scheduler and shared runner retain fixture, cell, and behavioral evidence ownership |
| Keep instrumentation outside subject axes | A valid failing subject remains publishable instead of being mislabeled as a broken benchmark |
| Exclude the launcher from behavioral scenarios | Separate hermetic smoke covers instrument infrastructure without recursive self-execution |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Command document validation | PASS: `validate_document.py --type command` exits 0 with 0 issues |
| Command structure extraction | PASS: six canonical numbered sections; frontmatter issues empty |
| YAML and JavaScript syntax | PASS: both YAML assets parse; smoke `node --check` exits 0 |
| Command references | PASS: 46 asset files scanned, 0 unresolved references |
| Hermetic launcher smoke | PASS: conformance, behavior, all, injected-defect, and instrument-failure paths; `node --check` and the direct smoke run exit 0 |
| Instrument/subject separation | PASS: instrument resolved via the real `scoping.cjs` parser — subject defect → `INSTRUMENT=VALID CONFORMANCE=FAIL`; broken lane-config → `STATUS=FAIL INSTRUMENT=INVALID CONFORMANCE=NOT_EVALUATED` |
| Mode registry | PASS: mode count remains 7; launcher appears only as an alignment alias |
| Codex prompt sync | PASS: `sync-prompts.cjs` generated `.codex/prompts/deep-command-benchmark.md` and `--check` reports `37 prompts are in sync` |
| Strict packet validation | PASS: `validate.sh --strict` Errors:0 Warnings:0 after graph metadata was regenerated |
| Live model execution | NOT RUN by design; smoke reports `live-model-spawns=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No deferred work.** The launcher is a dispatch-only router: unlike the capture phases, its behavioral axis is exercised hermetically through the matrix scheduler's predeclared skips, so no live model run is owed. The Codex mirror was generated by `sync-prompts.cjs` (the headless authoring session lacked `.codex/prompts` write access, so mirror generation ran from the main tree); its content is byte-identical to the generator's staging output.
2. **Follow-up: behavior-axis instrument symmetry.** The conformance leg resolves instrument validity through a real `scoping.cjs` probe (with an explicit INVALID path). The behavior leg has no lane-config to probe, so its instrument health is enforced by the scheduler's reconciliation assertion — a behavior instrumentation failure aborts the smoke rather than emitting `INSTRUMENT=INVALID`. This is sound but asymmetric; a future refinement could derive the behavior instrument explicitly from the reconciliation status for a uniform envelope.
<!-- /ANCHOR:limitations -->
