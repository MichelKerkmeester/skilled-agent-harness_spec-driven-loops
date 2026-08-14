---
title: "Implementation Summary: Deep-loop Executor / Provider / Model Matrix Audit"
description: "Frozen support matrix + gap register for the deep-loop fan-out: all seven executor kinds mapped (config, builder, model validation, caveats) and all deep modes cross-mapped for executor coverage, with a disposition for every gap (wire in 002-004, enforce-scope-out for skill-benchmark, or accept). The register is the source of truth the wiring phases and the combo matrix reference; the audit is read-only and changed no runtime code."
trigger_phrases:
  - "executor matrix audit progress"
  - "fanout executor gap register status"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/001-executor-matrix-audit"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/001-executor-matrix-audit"
    last_updated_at: "2026-07-29T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Froze the support matrix and gap register with every disposition"
    next_safe_action: "Reference the frozen register from the combo-matrix phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "cli-pi buildPiLineageCommand is a hard stub that throws"
      - "codex claude-code opencode are pass-through and pi cursor devin enforce allowlists"
---
# Implementation Summary: Deep-loop Executor / Provider / Model Matrix Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 001-executor-matrix-audit |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Read-only audit; no runtime code changed |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The config-and-builder layer of the support matrix is mapped for all seven executor kinds, with citations. The findings are seeded
into the phase spec's requirements table and drive the parent packet's phase plan.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| spec.md | Authored | Audit scope, requirements, and the seeded config/builder findings |
| (no runtime file) | — | The audit is read-only |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`EXECUTOR_KINDS`, the flag-support tables, and the model rosters were read from `executor-config.ts`; each lineage builder was
classified from `fanout-run.cjs`. The headline finding is that `buildPiLineageCommand` throws unconditionally (a stub), so cli-pi is
declared but unreachable through the fan-out, while direct `pi -p` dispatch works. codex/claude-code/opencode validate models by
pass-through; pi/cursor/devin enforce allowlists. cli-devin's default accept-edits mode auto-denies exec.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Keep the audit read-only | Freezing the matrix must not perturb the surface it measures |
| Seed the matrix in the spec, freeze in a later pass | The per-provider/model and per-mode cross-map is the larger remaining half |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| Config/builder findings cited | PASS — file:line citations for kinds, builders, rosters |
| No runtime change | PASS — read-only |
| Strict validation | In progress alongside the packet scaffold |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|---|---|---|
| Read-only | No runtime file modified | Pass |
| Evidence-cited | Config/builder rows cite source | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

The frozen register records reachability from command-construction analysis and per-mode coverage from the shipped dispatch code; live credentialed per-provider/model reachability is proven end-to-end in the combo test matrix (005), which logs every credentials-gated skip. That live proof is 005's deliverable, not this read-only audit's.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

None. The audit follows the phase plan; only its first (config/builder) layer is complete.
<!-- /ANCHOR:deviations -->
