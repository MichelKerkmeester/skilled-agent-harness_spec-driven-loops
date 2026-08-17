---
title: "Implementation Summary: Combo Test Matrix + Ambient-Config Isolation"
description: "All three executor-parity leaves are built: read-only pi disables ambient extensions, the combo matrix covers 117 combinations, and cursor uses a fail-closed neutral workspace. Strict closeout and operator sign-off remain."
trigger_phrases:
  - "combo matrix ambient isolation progress"
  - "pi no-extensions read-only builder"
  - "read-only leaf hermetic ambient config"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/005-combo-test-matrix"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/005-combo-test-matrix"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Fixed the two SOL P1s on the cursor isolation leaf"
    next_safe_action: "Pass strict validation and obtain operator sign-off."
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts"
    completion_pct: 90
    open_questions: []
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
| **Delivery status** | All three leaves built; strict closeout and operator sign-off remain |
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

**Leaf 3 — cursor neutral-workspace isolation (built).** The read-only cursor builder now emits `--workspace <tmp>/deep-loop-cursor-neutral-workspace --add-dir <working-dir>` in addition to `--mode plan --trust`. Live testing established that `--workspace` controls where cursor loads `.cursor/` hooks and MCP config from — even when cwd is the repo — so an empty neutral workspace loads no repo hooks and exposes no repo MCP servers (closing both the hook-write and MCP-approval-hang vectors for cursor), while `--add-dir` preserves read access to the working directory and `--mode plan` keeps it read-only. The neutral path is stable (not per-invocation) so the invocation fingerprint stays deterministic, and read-only leaves never write to it, so it is safe to share across concurrent leaves. Together with leaf 1 (pi extensions) and the already-verified devin config, the ambient-config isolation boundary is now closed for every read-only executor.

| File | Action | Purpose |
|---|---|---|
| `runtime/scripts/fanout-run.cjs` | Modified | Read-only cursor builder adds `--workspace <neutral> --add-dir <cwd>`; fail-closed neutral-dir validation; env-injectable neutral path |
| `model-benchmark/dispatch-model.cjs` + `deep-ai-council/scripts/orchestrate-session.cjs` | Modified | Pass the spawn cwd into the builder so `--add-dir` tracks the actual run dir (SOL P1-1) |
| `runtime/tests/unit/fanout-run.vitest.ts` + `combo-matrix.vitest.ts` | Modified | Lock the new read-only cursor argv; add the fail-closed squat-rejection test |
| model-benchmark `remediation.vitest.ts` + ai-council `orchestrate-session-cli.vitest.ts` | Modified | Lock the new read-only cursor argv incl. `--add-dir` = the spawn dir |
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
| Leaf 2 combo-matrix Vitest | PASS — 2 tests, 117 combinations asserted |
| Leaf 3 all four suites | PASS — fan-out 93, combo-matrix 2, model-benchmark 35, ai-council 106; tsc 0 |
| Leaf 3 end-to-end isolation probe | PASS — with the exact builder args in a repo carrying a sessionStart hook: the hook did NOT fire, the repo read succeeded via `--add-dir`, the neutral workspace stayed empty of `.cursor/` |
| Leaf 3 SOL cross-verify (cli-opencode GPT-5.6-SOL, high) | REQUESTED_CHANGES, 0 P0 / 2 P1 — both fixed + tested (see below); re-gate fan-out 94, combo 2, model-benchmark 35, ai-council 106, tsc 0 |
| `validate.sh --strict` | Errors 0 (tolerated warnings, sibling-phase baseline) |

### SOL review disposition (leaf 3)

SOL found two real P1s (0 P0), both consequences of the isolation change; each is fixed and covered by a test:

- **P1-1 (`--add-dir` mismatched the actual spawn cwd) — FIXED.** The builder used `process.cwd()` for `--add-dir`, but model-benchmark and ai-council spawn cursor in their OWN cwd (an isolated per-cell dir / a custom seat cwd) while passing only `env`. So a benchmark cell would fail to read its own dir and the repo would be unintentionally exposed. Both consumers now pass their spawn `cwd` into `buildLineageCommand`; the model-benchmark test asserts `--add-dir` equals the resolved spawn dir (`/work`), not the repo.
- **P1-2 (the predictable neutral workspace was squattable) — FIXED.** The neutral path is well-known, so a stale process or another local user could pre-plant `.cursor/hooks.json` there and cursor would load it under `--trust`. The builder now fails closed unless the neutral directory is a real, current-user-owned, non-symlink directory with no `.cursor/` inside; the path is env-injectable (`DEEP_LOOP_CURSOR_NEUTRAL_WORKSPACE`) so a unit test verifies both the squat-rejection and the clean-acceptance. Live-reproduced: a planted `.cursor/` throws; a clean path is accepted.

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

Live provider/model dispatch remains credentials-gated, so the 117-cell matrix proves command construction and records explicit live skips rather than claiming every provider was contacted. Strict packet validation and operator sign-off remain open closeout gates.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

None. Leaf 1 closes the one live-substantive residual (pi) of the ambient-config boundary that phases 003-004 verified non-reproducing and tracked here.
<!-- /ANCHOR:deviations -->
