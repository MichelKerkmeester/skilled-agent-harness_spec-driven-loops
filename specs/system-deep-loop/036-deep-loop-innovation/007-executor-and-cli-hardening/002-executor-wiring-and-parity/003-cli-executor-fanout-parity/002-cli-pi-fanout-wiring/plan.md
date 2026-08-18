---
title: "Implementation Plan: cli-pi Fan-out Lineage Wiring"
description: "Replace the throwing buildPiLineageCommand stub with a real headless pi command builder, map each allowlisted pi model to its provider, and add reasoningEffort to the cli-pi flag table, verified by command-construction unit tests plus a live end-to-end dispatch."
trigger_phrases:
  - "cli-pi fanout wiring plan"
  - "buildPiLineageCommand plan"
  - "pi provider model mapping plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled cli-pi fanout packet docs to Complete"
    next_safe_action: "Commit the reconciled cli-pi packet docs"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: cli-pi Fan-out Lineage Wiring

<!-- ANCHOR:summary -->
## 1. SUMMARY
Replace the throwing `buildPiLineageCommand` stub with a real headless pi command builder, map each allowlisted pi model to its
provider, and add `reasoningEffort` to the cli-pi flag table. Verify by command-construction unit tests plus a live end-to-end dispatch.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- fanout-run, executor-config, and executor-audit vitest suites pass (full output, never through `tail`).
- Whole-runtime tsc is 0.
- The builder's own output dispatches successfully against real pi.
- `validate.sh --strict` passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`fanout-run.cjs` maps each executor kind to a lineage builder. The pi builder mirrors the opencode builder shape, calling
`finalizeLineageCommand`, but emits `pi -p --offline --model <provider>/<id>` because pi has no `--dir` or service-tier surface and
its exit code is not an auth signal. The provider map is a hand-duplicated literal (kept in sync with `pi --list-models`) so command
construction stays synchronous and unit-testable, matching the file's per-kind convention. `EXECUTOR_KIND_FLAG_SUPPORT` gains
`reasoningEffort` for cli-pi so the runtime forwards `--thinking`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Capture the provider map
Capture the per-model provider map from `pi --list-models`.

### Phase 2: Build the lineage command
Implement `buildPiLineageCommand` (offline, provider-prefixed model, `--thinking`, read-only tool allowlist) and add the cli-pi `reasoningEffort` flag.

### Phase 3: Test and dispatch
Update the stub-behavior tests to command-construction tests, add `--thinking`/read-only/invalid-level coverage, and run a live end-to-end dispatch.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Unit tests over the constructed command for all seven models, the `--thinking` mapping, the read-only tool allowlist, and the
invalid-level rejection; plus a live dispatch that spawns pi with the builder's own args and asserts real model output.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `pi` on PATH (0.82.1) and a reachable openai-codex provider for the live check.
- The audit phase's gap register (`001-executor-matrix-audit`).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
The change is additive to a single builder plus one flag entry and its tests; rollback is reverting those hunks. The full fanout
vitest suite is the tripwire for any regression.
<!-- /ANCHOR:rollback -->
