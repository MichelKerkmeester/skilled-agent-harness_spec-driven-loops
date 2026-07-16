---
title: "Verification Checklist: generation and cleanup"
description: "Verification plan for the G1-G4 + A-W4/A-G2 generation-and-cleanup phase. Nothing is built yet; every item is pending with its acceptance target, to be marked [x] with evidence as the phase lands."
trigger_phrases:
  - "verification checklist generation cleanup"
  - "command router generator checklist"
  - "argument-hint budget checklist"
  - "deep router slimming checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-3 doc set for the generation-and-cleanup phase"
    next_safe_action: "Standardize the OWNED ASSETS and EXECUTION TARGETS tables (A-W4) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 0
    open_questions:
      - "G3/G4 heuristics are validator-WARN and may need allowlist tuning once noise is measured."
    answered_questions: []
---
# Verification Checklist: generation and cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
  - **Target**: `spec.md` carries REQ-001..REQ-006 (G1, A-W4, G2, A-G2, G3, G4) with acceptance criteria and the phase-004 `routing_source` deferral.
- [ ] CHK-002 [P0] Technical approach defined in plan.md
  - **Target**: `plan.md` sequences A-W4 tables → generator + `--check` → G2 fixes → A-G2 slimming → G3/G4 canon → full gate.
- [ ] CHK-003 [P1] Phase-001 contract and template grammar available as source and parse target
  - **Target**: `command_contract.json` and `command_router_template.md` (`| Purpose | Asset |`, `| Mode | Target |`) exist and are read by the generator.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `generate-command-routers.cjs` passes `node --check` syntax
  - **Target**: `node --check .opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs` reports OK.
- [ ] CHK-011 [P0] Generation is section-scoped, not whole-file
  - **Target**: only the five spans (argument-hint, OWNED ASSETS, EXECUTION TARGETS, MODE ROUTING, PRESENTATION BOUNDARY) are written; the hand-authored behavioral prose is untouched.
- [ ] CHK-012 [P1] Generator is contract-driven, not re-hard-coding family behavior
  - **Target**: family behavior is read from `command_contract.json`; no family names or per-family table shapes are hard-coded in the render path.
- [ ] CHK-013 [P1] Comment hygiene: no artifact ids in code comments
  - **Target**: added comments state durable WHY only; the comment-hygiene gate passes on commit.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001 `--check` clean on the conformant tree; staled span fails
  - **Target**: `generate-command-routers.cjs --check` reports clean on `.opencode/commands/`; a deliberately staled committed span fails with the offending span diffed.
- [ ] CHK-021 [P0] REQ-002 tables uniform; generator parses all families
  - **Target**: every family's OWNED ASSETS / EXECUTION TARGETS tables match `command_router_template.md`; a single uniform parser reads `create, deep, design, doctor, memory, speckit`.
- [ ] CHK-022 [P0] REQ-003 three command-local fixes pass the phase-003 checks and the span-diff
  - **Target**: `deep/research.md`, `memory/save.md`, and the create-family `*_presentation.txt` labels pass gate-obligation, mode-completeness, and reference-coverage with no exceptions.
- [ ] CHK-023 [P1] REQ-004 deep-router slimming is behavior-preserving
  - **Target**: the slimmed `deep/*` routers match the pre-slimming dispatch snapshot and keep gates, binding, mode-selection, and summary.
- [ ] CHK-024 [P1] REQ-005 hint budget warns over-budget, silent on conformant
  - **Target**: `validate_document.py` emits a WARN for over-budget hints (`speckit/plan` at 511 chars) and stays silent on conformant hints; never a hard-fail.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The contract is the single source for the router's structural spans
  - **Target**: the generator reads `command_contract.json` for the five contract-derivable spans instead of prose hand-copied across families.
- [ ] CHK-FIX-002 [P0] Producer inventory: A-W4 tables land before G1 as the generator's parse target
  - **Target**: the OWNED ASSETS `| Purpose | Asset |` and EXECUTION TARGETS `| Mode | Target |` schemas are standardized before the generator parses them.
- [ ] CHK-FIX-003 [P0] Consumer inventory covers the generator, the routers, the deep assets, and the validators
  - **Target**: `generate-command-routers.cjs`, `.opencode/commands/**`, the deep asset files, `validate_document.py`, `validate-command-references.cjs`, and `sk-doc-command.cjs` are all accounted for.
- [ ] CHK-FIX-004 [P0] Drift adversarial case: a staled committed span fails `--check`
  - **Target**: a hand-edited span that no longer matches the contract fails `generate-command-routers.cjs --check`.
- [ ] CHK-FIX-005 [P1] All new checks extend existing validators — no parallel lint engine
  - **Target**: G3/G4 checks live in `validate_document.py` / `validate-command-references.cjs` / the `sk-doc-command.cjs` adapter, not a new engine.
- [ ] CHK-FIX-006 [P1] G3/G4 checks are validator-WARN, never hard-fail
  - **Target**: the `argument-hint` budget and ergonomics checks emit WARN only, pending allowlist tuning (ADR-004).
- [ ] CHK-FIX-007 [P1] Scope boundary: `routing_source` naming recorded as deferred to phase 004
  - **Target**: the subaction-router `routing_source` sub-item is recorded as deferred (field undefined for all families); it is not enforced here (ADR-005).

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] The generator writes only the five named spans; it never touches other regions
  - **Target**: a diff of a generated router shows changes confined to the five contract-derivable spans.
- [ ] CHK-031 [P1] Deep-router slimming preserves router-owned gates and binding
  - **Target**: gates, binding, mode-selection, and summary remain in the router after `deep/*` slimming.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] REQ-006 ergonomics canon present in create-command Steps 6/9/11 and the quality-control gate
  - **Target**: `create-command/SKILL.md` Steps 6/9/11 carry the loader-gating, agent-existence, raw-echo deprecation, and self-sufficiency canon, wired into create-quality-control.
- [ ] CHK-041 [P1] REQ-005 hint principle documented in Step 6 and `command_template.md`
  - **Target**: "hint summarizes, EXECUTION TARGETS enumerates" is written into `create-command/SKILL.md` Step 6 and `command_template.md`.
- [ ] CHK-042 [P1] spec/plan/tasks/decision-record/implementation-summary synchronized to final state
  - **Target**: all five authored docs reconciled to the built-and-verified state at completion.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files left outside the scratchpad
  - **Target**: any `--check` scratch trees are removed; no temp files remain outside `scratch/`.
- [ ] CHK-051 [P1] Change scope limited to the intended files
  - **Target**: `git diff` at completion touches only the generator, `.opencode/commands/**`, the validators, and `create-command` canon.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
  - **Target**: ADR-001..ADR-005 documented with context, alternatives, and consequences.
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
  - **Target**: ADR-001..ADR-005 reach status: Accepted before completion.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Target**: whole-file rendering and extending `render-command-contract.cjs` are documented as rejected alternatives.
- [ ] CHK-103 [P2] Component diagram accurate
  - **Target**: the `plan.md` component diagram matches the final generator/validator wiring.

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: Correctness & Behavior Verification

- [ ] CHK-110 [P0] Determinism (NFR-C01)
  - **Target**: repeated `generate-command-routers.cjs --check` runs on the same contract and tree yield the same clean/dirty verdict.
- [ ] CHK-111 [P0] Byte-match (NFR-C02)
  - **Target**: regenerated spans byte-match the committed conformant spans; a single stale byte fails `--check`.
- [ ] CHK-112 [P1] Behavior-preserving slimming (NFR-C03)
  - **Target**: the `deep/*` dispatch snapshot before and after slimming is identical.
- [ ] CHK-113 [P1] WARN-tier safety (NFR-S01)
  - **Target**: the G3/G4 checks never raise the validation exit code; they are WARN-only.

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: Rollout Readiness

- [ ] CHK-120 [P0] Rollback procedure documented
  - **Target**: `plan.md` L2 Enhanced Rollback documents reverting the generator, tables, and slimmed routers.
- [ ] CHK-121 [P1] Deep-router dispatch snapshot captured before slimming
  - **Target**: the pre-slimming snapshot exists as the behavior-preserving baseline.
- [ ] CHK-122 [P1] No runtime dispatch behavior change from the generator or validators
  - **Target**: the generator and the WARN checks add validation/authoring only; command dispatch is unchanged.
- [ ] CHK-123 [P2] Allowlist-tuning follow-up recorded
  - **Target**: the G3/G4 noise-measurement and allowlist-tuning follow-up is recorded in implementation-summary.md.

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] New checks extend existing validators — no parallel lint engine introduced
  - **Target**: G3/G4 checks live in `validate_document.py` / `validate-command-references.cjs` / the `sk-doc-command.cjs` adapter (ADR-003).
- [ ] CHK-131 [P1] The generator introduces no new runtime dependency
  - **Target**: `generate-command-routers.cjs` reuses the `sync-prompts.cjs` Node toolchain; no new package is added.
- [ ] CHK-132 [P2] No destructive command policy is weakened by the router changes
  - **Target**: destructive-policy contract fields are untouched; the slimming is behavior-preserving.
- [ ] CHK-133 [P2] G3/G4 WARN tiers cannot escalate a validation run to failure
  - **Target**: the WARN checks never raise the exit code (ADR-004).
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized to the built state at completion
  - **Target**: `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, and `implementation-summary.md` reconciled to final state.
- [ ] CHK-141 [P1] `create-command/SKILL.md` Steps 6/9/11 and `command_template.md` carry the canon
  - **Target**: the hint-budget principle and ergonomics canon are documented before the checks enforce them.
- [ ] CHK-142 [P2] The `routing_source` phase-004 deferral is documented, not silent
  - **Target**: the deferral is recorded in spec scope, tasks (T023), and ADR-005.
- [ ] CHK-143 [P2] Generator usage and `--check` gate are documented for future authors
  - **Target**: `generate-command-routers.cjs` usage and the drift-gate contract are noted alongside `sync-prompts.cjs`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pending | Command-canon remediation lead | [ ] Approved | |
| Pending | Phase-004 owner (routing_source handoff) | [ ] Approved | |
| Pending | Validation gate (`validate.sh --strict`) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 25 | 0/25 |
| P2 Items | 6 | 0/6 |

**Verification Date**: Pending (phase in progress)
**Verified By**: Pending
**ADRs**: 5 documented, 0 accepted (pending build)

<!-- /ANCHOR:summary -->
