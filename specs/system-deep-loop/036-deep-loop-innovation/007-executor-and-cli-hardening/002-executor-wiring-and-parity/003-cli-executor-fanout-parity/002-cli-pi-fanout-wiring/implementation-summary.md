---
title: "Implementation Summary: cli-pi Fan-out Lineage Wiring"
description: "Implemented the real cli-pi fan-out lineage builder (offline, provider-prefixed model, --thinking reasoning, read-only tool allowlist), mapped every allowlisted pi model to its provider, and added reasoningEffort to the cli-pi flag table. Verified by command-construction unit tests and a live end-to-end dispatch of the builder's own output."
trigger_phrases:
  - "cli-pi fanout wiring implementation"
  - "buildPiLineageCommand done"
  - "pi provider map thinking flag"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "claude"
    recent_action: "Implemented and end-to-end verified the cli-pi fan-out builder"
    next_safe_action: "Land the cli-pi wiring then harden devin and cursor exec"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "cli-pi now dispatches through the fan-out for every allowlisted model"
      - "reasoningEffort forwards as --thinking and an invalid level fails closed"
      - "the builder's own output dispatches successfully against real pi"
---
# Implementation Summary: cli-pi Fan-out Lineage Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 002-cli-pi-fanout-wiring |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive builder wiring; no behavior change to other executor kinds |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The cli-pi fan-out lineage builder is now real. `buildPiLineageCommand` constructs `pi -p --offline --model <provider>/<id>`,
appends `--thinking <effort>` when reasoning is set, and restricts the tool allowlist to reads for a read-only leaf. Each
allowlisted pi model is mapped to its provider (openai-codex for the GPT-5.6 tunes; deepseek, minimax, and xiaomi for their
families), captured from `pi --list-models`. The cli-pi entry of the flag-support table gains `reasoningEffort` so the runtime
forwards `--thinking`; pi still exposes no OS sandbox or service tier.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `runtime/scripts/fanout-run.cjs` | Modified | Replaced the throwing stub with the real builder + a per-model provider map + `--thinking` levels |
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Added `reasoningEffort` to the cli-pi flag-support entry |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | Command-construction tests for all models + `--thinking` + read-only + invalid-level rejection |
| `runtime/tests/unit/executor-config.vitest.ts` | Modified | Updated the cli-pi flag-set assertion to include `reasoningEffort` |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The builder mirrors the opencode builder's shape and calls the shared `finalizeLineageCommand`, but omits `--dir` and any
service-tier flag because pi runs in the spawned working directory and exposes neither. `--offline` is always emitted because a
non-interactive pi dispatch can otherwise hang for minutes on startup network probes, and the builder documents that pi's exit code
is not a reliable success or auth signal. The provider map and the `--thinking` level set are hand-duplicated plain literals so
command construction stays synchronous and unit-testable, matching this file's existing per-kind convention.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Emit `--model <provider>/<id>` | Without the provider prefix pi falls back to its default provider and dispatches the wrong model |
| Always emit `--offline` | A non-interactive pi dispatch without it can hang for minutes on network probes |
| Reasoning via `--thinking`, validated | Pi's reasoning is a first-class flag independent of the model id; an invalid level must fail closed |
| Read-only leaf restricts `--tools` | Pi has no OS sandbox, so a read-only boundary is a tool allowlist restriction |
| Hand-duplicate the provider map | Keeps the builder synchronous and directly unit-testable, matching the file's convention |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| fanout-run Vitest | PASS with 92 tests |
| executor-config Vitest | PASS with 86 tests |
| executor-audit Vitest | PASS with 27 tests |
| Whole-runtime TypeScript | PASS with zero diagnostics |
| Live end-to-end dispatch | PASS — the builder's own args spawned against real pi returned the expected token |

Live command shape produced by the builder:

`pi -p --offline --model openai-codex/gpt-5.6-luna --thinking xhigh <prompt>`

An independent cross-verify (cli-opencode GPT-5.6-SOL, high) returned REQUESTED_CHANGES with two P1 findings, both fixed with
driven tests and re-verified green: the shared `reasoningEffort` levels `none` and `ultra` had no pi `--thinking` mapping (now
`none` maps to `off` and `ultra` caps at `max`), and the generic worker treated pi's contractually-unreliable non-zero exit code as
a failure (now cli-pi tolerates a non-zero exit and is gated by artifact validation instead). Final suites: fanout-run 93,
executor-config 86, executor-audit 27; whole-runtime tsc 0.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|---|---|---|
| No regression to other executor kinds | The change touches only the cli-pi builder and flag entry | Pass |
| Fail-closed on bad input | Out-of-roster model and invalid `--thinking` level throw typed errors | Pass |
| Deterministic construction | The builder is synchronous and unit-tested over the full model set | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

cli-pi is now reachable through the fan-out, but no deep mode's auto-YAML exposes it yet; that per-mode wiring is phase 004. The
provider map is a static duplicate of `pi --list-models` and must be re-checked if the allowlist changes.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

None. The wiring follows the audit's disposition for the cli-pi stub gap.
<!-- /ANCHOR:deviations -->
