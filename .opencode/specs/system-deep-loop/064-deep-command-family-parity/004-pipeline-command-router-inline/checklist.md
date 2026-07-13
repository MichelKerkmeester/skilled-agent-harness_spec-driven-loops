---
title: "Verification Checklist: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands"
description: "Level 2 checklist mapping the promote-and-drop-bang work items to drift, render, conformance, vitest, and live-smoke evidence."
trigger_phrases:
  - "deep command router inline"
  - "promote deep command body drop bang"
  - "render pipeline stub to router triad"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/004-pipeline-command-router-inline"
    last_updated_at: "2026-07-13T22:20:00Z"
    last_updated_by: "claude"
    recent_action: "Live :auto smoke of research + review passed; all P0 verified"
    next_safe_action: "Commit pending operator approval; then memory reindex"
    completion_pct: 100
---
# Verification Checklist: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
  - **Evidence**: `spec.md` REQ-001 through REQ-010 define the promote + drop-bang + recompile + doc-correction requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` architecture + phases describe the promote/fold/recompile flow and the maintained-but-dormant pipeline.
- [x] CHK-003 [P0] Architectural reversal recorded in decision-record.md [EVIDENCE: decision-record.md]
  - **Evidence**: `decision-record.md` ADR-001 (PATH A) + ADR-002 (accepted reversal of 064's blessed-stub stance for these 4).

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each of the 4 commands has a full inline `## 1..## 6` router body, no bang [EVIDENCE: research/review/ai-council/alignment .md]
  - **Evidence**: research.md (185 lines), review.md (151), ai-council.md (151), alignment.md (~152) are each frontmatter + H1 + promoted `## 1..## 6` router (ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY); the `!render-command-contract.cjs` bang line is removed from all 4.
- [x] CHK-011 [P0] Each promoted body folds in the command's `autonomousExecutionDirective` [EVIDENCE: AUTONOMOUS EXECUTION DIRECTIVE subsection]
  - **Evidence**: each body carries a folded `### AUTONOMOUS EXECUTION DIRECTIVE (:auto)` subsection inside `## 1 ROUTER CONTRACT`, extracted faithfully from each command's compiled `autonomousExecutionDirective`.
- [x] CHK-012 [P0] Frontmatter `allowed-tools` preserved byte-for-byte on all 4 [EVIDENCE: frontmatter unchanged]
  - **Evidence**: `allowed-tools` preserved byte-for-byte on all 4 during promotion; `checkToolAllowlist` reports no change, no `TOOL_ALLOWLIST_OVERFLOW`.
- [x] CHK-013 [P1] The 4 compiled contracts recompiled and fresh [EVIDENCE: compile-command-contracts.cjs --write]
  - **Evidence**: `compile-command-contracts.cjs --command deep/<name> --write` recompiled all 4 compiled contracts against the promoted sources.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Drift clean across registered commands after recompile [EVIDENCE: check-contract-drift.cjs]
  - **Evidence**: `check-contract-drift.cjs` → `[CONTRACT DRIFT] OK commands=4` (exit 0).
- [x] CHK-021 [P0] Render smoke COMPARE OK in `mode=fix` for all 4 [EVIDENCE: render-command-contract.cjs --compare]
  - **Evidence**: `render-command-contract.cjs --compare` → COMPARE OK for all 4 (research 11036B, review 8283B, ai-council 7641B, alignment 8575B); the dormant compiled+legacy path is still byte-consistent.
- [x] CHK-022 [P0] All 8 deep commands pass `validate_document.py --type command` [EVIDENCE: validate_document.py]
  - **Evidence**: `validate_document.py --type command` → exit 0 each; the 4 promoted commands now pass full section checks (no more `render-command-contract` marker early-return).
- [x] CHK-023 [P1] All four vitest suites green [EVIDENCE: vitest + node --test]
  - **Evidence**: vitest (runtime/vitest.config.ts) render-command-contract + check-contract-drift + compile-command-contracts = 3 files / 30 tests PASSED; `resolve-injection-mode.test.cjs` (node --test) → 1/1 PASS.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Live `:auto` smoke of research + review preserves prior autonomous behaviour [EVIDENCE: bounded `opencode run --dry-run` smoke, both commands]
  - **Evidence**: bounded `opencode run --command deep/{research,review} ":auto ... --dry-run --max-iterations=1"` (deepseek-v4-pro high, no `--dangerously-skip-permissions`, closed stdin, 160s timeout). BOTH promoted bang-less routers loaded and drove their workflow: research reached `PHASE 0 → general_agent_verified=TRUE`, `execution_mode=AUTONOMOUS`, `Setup resolved (Tier 1)`; review reached `Phase 0 PASSED → general_agent_verified=TRUE`, resolving AUTONOMOUS setup. Neither halted on the Gate-3 documentation prompt — prior autonomous behaviour preserved. `dry_run` honoured: research emitted `step_create_directories → SKIPPED_DRY_RUN` with zero writes; review halted before any content write (its model created 3 empty `review/` scaffold dirs pre-halt, since removed with `rmdir` — 0 files). No disk side-effects: the phase folder remains exactly its 8 authored docs.
- [x] CHK-025 [P1] The 4 stay `fix` in the rollout; render vitest `mode==='fix'` assertions stay green [EVIDENCE: command-injection-rollout.json]
  - **Evidence**: the 4 stay `fix` in `command-injection-rollout.json` (unchanged); the render vitest `mode==='fix'` assertions passed.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in changed files [EVIDENCE: `deep/*.md` + `assets/compiled/*.contract.md` diff]
  - **Evidence**: the changed files are the promoted `deep/{research,review,ai-council,alignment}.md` router bodies plus the regenerated `assets/compiled/*.contract.md` and three `create-command` doc corrections; no credential-shaped values.
- [x] CHK-031 [P0] Promotion advertises no tool surface beyond existing `allowed-tools` [EVIDENCE: frontmatter preserved]
  - **Evidence**: `allowed-tools` preserved byte-for-byte; the read-only/native contracts (`alignment`, `review`) keep their existing surfaces.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/decision-record synchronized [EVIDENCE: spec-plan-task-adr sync]
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` all describe the same promote + drop-bang + recompile + doc-correction scope and the PATH A choice.
- [x] CHK-041 [P1] create-command standard docs no longer cite these 4 as compiled-stub examples [EVIDENCE: create-command doc reconciliation]
  - **Evidence**: removed the stale research/review/ai-council compiled-stub examples in `create-command/SKILL.md`, `command_router_template.md`, and `command_template.md` (the variant is kept documented generically; machinery retained). `package_skill.py --check create-command` → PASS (4 warnings, all pre-existing/unrelated).
- [x] CHK-042 [P1] 064 parent Phase Documentation Map rolled up to include phase 004 [EVIDENCE: generate-context.js parent rollup]
  - **Evidence**: `generate-context.js` rolled up the 064 parent — `children_ids` now includes `004` and `derived.last_active_child_id` points at the `004` path; `validate.sh --recursive --strict` on the parent PASSED (Errors 0 / Warnings 0).
- [x] CHK-043 [P2] Command comment hygiene preserved [EVIDENCE: docs/router-body/data only]
  - **Evidence**: no ephemeral artifact ids were added to any code comment; changes are router-body/docs/data only.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files committed [EVIDENCE: manifest clean]
  - **Evidence**: render smoke used `--compare` (no manifest write); `manifest.jsonl` stayed clean.
- [x] CHK-051 [P1] Router bodies + contracts live in the canonical deep command locations [EVIDENCE: assets path]
  - **Evidence**: the promoted routers live at `.opencode/commands/deep/*.md` and the recompiled contracts at `.opencode/commands/deep/assets/compiled/*`.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-13
**Verified By**: Claude (pipeline gates) with coordinator-supplied verified evidence

> All P0 items verified, including CHK-024 (live `:auto` dry-run smoke of research + review — both routers load and preserve autonomous behaviour, zero disk side-effects). CHK-042 (064 parent map rollup) is complete via `generate-context.js`.

<!-- /ANCHOR:summary -->
