---
title: "Tasks: Combo Test Matrix and Ambient-Config Isolation"
description: "Track the three isolation and executor-coverage leaves through strict closeout."
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/005-combo-test-matrix"
    last_updated_at: "2026-08-11T14:03:33Z"
    last_updated_by: "codex"
    recent_action: "Reconciled all three built leaves with the strict-validation contract"
    next_safe_action: "Pass strict validation and obtain operator sign-off."
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Combo Test Matrix + Ambient-Config Isolation

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: In Progress — leaf 1 (pi extension isolation) built and gated; leaves 2-3 pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Confirm read-only pi never invokes skills (its tool allowlist is read-only file ops), so disabling extensions/skills/templates is behavior-preserving.
- [x] Confirm pi supports `--no-extensions`/`--no-skills`/`--no-prompt-templates` (from `pi --help`).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Leaf 1 — add `--no-extensions --no-skills --no-prompt-templates` to the read-only branch of the shared pi builder.
- [x] Leaf 1 — update the exact-arg pi read-only assertions in the fan-out, model-benchmark, and ai-council suites.
- [x] Leaf 2 — combo coverage matrix (`combo-matrix.vitest.ts`): 117 (kind × model × sandbox) combinations constructed via the real `buildLineageCommand`, exact-argv proven per kind, full allowlist coverage asserted, every live credentialed dispatch logged as an explicit skip; out-of-roster models fail closed.
- [x] Leaf 3 — read-only cursor runs against a neutral empty workspace (`--workspace <tmp>/deep-loop-cursor-neutral-workspace`) + re-adds the working dir (`--add-dir`); this loads no repo hooks/MCP while preserving reads. devin is already config-safe; pi's extension vector was closed in leaf 1, so the ambient-config boundary is closed for all read-only executors.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Leaf 1: fan-out 93/93, model-benchmark 35/35, ai-council 106/106; whole-runtime tsc 0.
- [x] Leaf 1: live pi accepts the new flags (no rejection) and writes nothing (git status unchanged).
- [x] Leaf 2: combo-matrix vitest 2/2 (117 combos asserted), whole-runtime tsc 0; additive test file, no source touched (zero regression risk).
- [x] Leaf 3: fan-out 93/93, combo-matrix 2/2, model-benchmark 35/35, ai-council 106/106, tsc 0; end-to-end probe with the exact builder args — repo hook did NOT fire (isolated), repo read worked, neutral workspace stayed empty.
- [x] Leaf 3 SOL cross-verify: 0 P0 / 2 P1 — both fixed + tested. P1-1: model-benchmark + ai-council now pass their spawn cwd so `--add-dir` tracks it (not the repo). P1-2: neutral workspace fails closed against a squatted/planted `.cursor/` (env-injectable path + unit test). Re-gate fan-out 94, combo 2, model-benchmark 35, ai-council 106, tsc 0.
- [x] `validate.sh --strict` passes for this phase (Errors 0).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Read-only pi is hermetic against auto-loaded extensions/skills/templates.
- [x] The combo matrix logs every combination and skip; ambient-config isolation is verified for all read-only executors.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity`
- Predecessor: `004-per-mode-executor-parity`; successor: `006-docs-and-closeout`
- Code: `runtime/scripts/fanout-run.cjs` (pi read-only builder) + the three exact-arg suites
<!-- /ANCHOR:cross-refs -->
