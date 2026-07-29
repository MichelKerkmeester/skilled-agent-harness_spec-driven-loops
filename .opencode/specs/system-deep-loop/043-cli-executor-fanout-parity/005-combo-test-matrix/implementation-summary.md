---
title: "Implementation Summary: Combo Test Matrix + Ambient-Config Isolation"
description: "Closing the fan-out parity packet: the combo coverage matrix (log every skip) and the cross-cutting ambient-config isolation tracked from phases 003-004. Leaf 1 (read-only pi disables auto-loaded extensions/skills/templates) is built and gated; the combo matrix and cursor/devin/MCP isolation remain."
trigger_phrases:
  - "combo matrix ambient isolation progress"
  - "pi no-extensions read-only builder"
  - "read-only leaf hermetic ambient config"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/043-cli-executor-fanout-parity/005-combo-test-matrix"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/043-cli-executor-fanout-parity/005-combo-test-matrix"
    last_updated_at: "2026-07-29T15:45:00Z"
    last_updated_by: "claude"
    recent_action: "Built the combo coverage matrix over the shared builder"
    next_safe_action: "Build the cursor/devin/MCP ambient-config isolation"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts"
    completion_pct: 60
    open_questions:
      - "Least-invasive mechanism to isolate cursor hooks + MCP for a read-only leaf while keeping repo read access"
    answered_questions:
      - "read-only pi is text-analysis-only, so --no-extensions/--no-skills/--no-prompt-templates is behavior-preserving"
      - "the pi flags are valid and accepted live; the read-only pi invocation writes nothing"
---
# Implementation Summary: Combo Test Matrix + Ambient-Config Isolation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 005-combo-test-matrix |
| **Completed** | In progress (leaf 1 of 3 built) |
| **Level** | 2 |
| **Status** | In Progress |
| **Posture** | Layered read-only containment: tool allowlist + disable write-capable ambient lifecycle |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

**Leaf 1 — pi extension isolation (built).** The SOL reviews of phases 003-004 surfaced that read-only flags bound the model's own tools but not the executor's ambient config. For pi, that ambient config is auto-loaded `.pi/` extensions, skills, and prompt templates, whose lifecycle code runs at load independent of the tool allowlist and could write. The shared read-only pi builder now emits `--no-extensions --no-skills --no-prompt-templates` alongside the read-only tool allowlist, so both fan-out leaves and ai-council seats inherit a pi read-only invocation that cannot load a write-capable extension. A read-only pi leaf does text analysis with read-only file tools and never invokes a skill, so this is behavior-preserving.

### Files Changed (leaf 1)

| File | Action | Purpose |
|---|---|---|
| `runtime/scripts/fanout-run.cjs` | Modified | Read-only pi builder adds `--no-extensions --no-skills --no-prompt-templates` |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | Lock the new read-only pi arg vector |
| `model-benchmark/tests/remediation.vitest.ts` | Modified | Lock the new read-only pi arg vector (both read-only cases) |
| `deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts` | Modified | Lock the new read-only pi seat arg vector |

**Leaf 2 — combo coverage matrix (built).** A new additive test (`runtime/tests/unit/combo-matrix.vitest.ts`) iterates every executor kind × its model allowlist (`PI`/`CURSOR`/`DEVIN_SUPPORTED_MODELS` imported, representatives for the pass-through kinds) × the three sandbox modes, calling the REAL `buildLineageCommand` and asserting each constructs a non-empty command + args with the right kind — 117 combinations. It proves the exact argv for a representative combo per kind (anti-vacuous), asserts coverage completeness (exercised kinds equal `EXECUTOR_KINDS`; exercised cursor/devin/pi model sets equal the full allowlists), logs every live credentialed dispatch as an explicit skip (never silent), and asserts out-of-roster models fail closed. It touches no source, so it carries zero regression risk.

| File | Action | Purpose |
|---|---|---|
| `runtime/tests/unit/combo-matrix.vitest.ts` | Added | Full construction-coverage matrix over the shared builder; logs every live skip |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is confined to the read-only branch of `buildPiLineageCommand`; workspace-write and full-access pi (where writes are allowed anyway) are unchanged. The three exact-arg suites that assert the pi read-only command were updated uniformly by inserting the `--no-*` flags immediately after the tool allowlist. A live pi invocation with the new flags confirmed pi accepts them (no flag-rejection) and left git status byte-identical.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Disable extensions/skills/templates only for read-only pi | Their lifecycle can write independent of the tool allowlist; workspace-write can write anyway, so it needs no such disable |
| Add the flags in the shared builder | A single source hardens both fan-out leaves and ai-council seats; no fork |
| Behavior-preserving | Read-only pi does text analysis with read-only file tools and never invokes a skill |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| fan-out Vitest | PASS — 93 tests |
| model-benchmark remediation Vitest | PASS — 35 tests |
| ai-council Vitest | PASS — 106 tests (10 files) |
| Whole-runtime TypeScript | PASS — zero diagnostics |
| Live pi with the new flags | PASS — flags accepted (no rejection), git status byte-identical (no write) |
| `validate.sh --strict` | Errors 0 (tolerated warnings, sibling-phase baseline) |

Leaf 1 is a small, exact-arg-test-guarded shared-builder change, verified inline (gates + live probe); a full cross-model SOL run was not spent on a three-flag addition already locked by three exact-arg suites.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|---|---|---|
| No regression to other kinds / write paths | Change is in the read-only pi branch only; three suites green | Pass |
| Behavior-preserving for read-only pi | Read-only pi never invokes skills; live invocation still runs | Pass |
| Single source, no fork | Hardening is in the shared builder, inherited by fan-out + seats | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

The combo coverage matrix (leaf 2) and the cursor/devin/MCP ambient-config isolation (leaf 3) are not yet built. Cursor hooks and MCP, and devin config, need a config/workspace-level isolation because those CLIs read ambient config from the working directory with no per-invocation disable flag; the mechanism (neutral workspace + add-dir, isolated config dir, or a hooks-disable env) is an open question to resolve in leaf 3, validated not to break legitimate read access.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

None. Leaf 1 closes the one live-substantive residual (pi) of the ambient-config boundary that phases 003-004 verified non-reproducing and tracked here.
<!-- /ANCHOR:deviations -->
