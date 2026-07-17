---
title: "Verification Checklist: generation and cleanup"
description: "Verification record for the G1-G4 + A-W4/A-G2 generation-and-cleanup phase. Every item is verified [x] with evidence: G1/A-W4/G3/G4 shipped; G2 and A-G2 resolved by evidence; strict gates green."
trigger_phrases:
  - "verification checklist generation cleanup"
  - "command router generator checklist"
  - "argument-hint budget checklist"
  - "deep router slimming checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T18:23:19Z"
    last_updated_by: "claude"
    recent_action: "Shipped G1-G4 + resolved G2/A-G2 by evidence; gates green"
    next_safe_action: "Merge the worktree and FF-push to origin"
    completion_pct: 100
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    open_questions:
      - "G3/G4 heuristics are validator-WARN and may need allowlist tuning once noise is measured."
    answered_questions:
      - "G2 was a confirmed no-op and A-G2 was resolved by evidence; neither required a router mutation."
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

- [x] CHK-001 [P0] Requirements documented in spec.md — `spec.md` carries REQ-001..REQ-006 with acceptance criteria and the `routing_source` deferral
  - **Target**: `spec.md` carries REQ-001..REQ-006 (G1, A-W4, G2, A-G2, G3, G4) with acceptance criteria and the phase-004 `routing_source` deferral.
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` sequences A-W4 → generator → G2 → A-G2 → G3/G4 → full gate
  - **Target**: `plan.md` sequences A-W4 tables → generator + `--check` → G2 fixes → A-G2 slimming → G3/G4 canon → full gate.
- [x] CHK-003 [P1] Phase-001 contract and template grammar available as source and parse target — `command_contract.json` + `command_router_template.md` present and read by the generator
  - **Target**: `command_contract.json` and `command_router_template.md` (`| Purpose | Asset |`, `| Mode | Target |`) exist and are read by the generator.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `generate-command-routers.cjs` passes `node --check` syntax — `node --check` reports OK (`2e21f4eb77`)
  - **Target**: `node --check .opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs` reports OK.
- [x] CHK-011 [P0] Generation is section-scoped, not whole-file — `--write` normalizes table shape + asset-path cells only; behavioral prose untouched (`164b06a571`)
  - **Target**: only the five spans (argument-hint, OWNED ASSETS, EXECUTION TARGETS, MODE ROUTING, PRESENTATION BOUNDARY) are written; the hand-authored behavioral prose is untouched.
- [x] CHK-012 [P1] Generator is contract-driven, not re-hard-coding family behavior — reads `command_contract.json`; no family names hard-coded in the render path
  - **Target**: family behavior is read from `command_contract.json`; no family names or per-family table shapes are hard-coded in the render path.
- [x] CHK-013 [P1] Comment hygiene: no artifact ids in code comments — comment-hygiene gate passed on commit `2e21f4eb77`
  - **Target**: added comments state durable WHY only; the comment-hygiene gate passes on commit.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 `--check` clean on the conformant tree; staled span fails — `35/35 routers clean, 0 path-drift, 0 shape-drift`; staled path → `PATH-DRIFT`
  - **Target**: `generate-command-routers.cjs --check` reports clean on `.opencode/commands/`; a deliberately staled committed span fails with the offending span diffed.
- [x] CHK-021 [P0] REQ-002 tables uniform; generator parses all families — `validate_document.py --type command` exit 0; create×11 + memory×4 collapsed (`5fbf223ec8`)
  - **Target**: every family's OWNED ASSETS / EXECUTION TARGETS tables match `command_router_template.md`; a single uniform parser reads `create, deep, design, doctor, memory, speckit`.
- [x] CHK-022 [P0] REQ-003 three command-local fixes pass the phase-003 checks and the span-diff — G2 no-op: `sk-doc-command.cjs check .opencode/commands` returns `[]`; path-drift=0
  - **Target**: `deep/research.md`, `memory/save.md`, and the create-family `*_presentation.txt` labels pass gate-obligation, mode-completeness, and reference-coverage with no exceptions.
- [x] CHK-023 [P1] REQ-004 deep-router slimming is behavior-preserving — A-G2 evidence-satisfied: display already externalized to `deep_*_presentation.txt`; no router mutation
  - **Target**: the slimmed `deep/*` routers match the pre-slimming dispatch snapshot and keep gates, binding, mode-selection, and summary.
- [x] CHK-024 [P1] REQ-005 hint budget warns over-budget, silent on conformant — 22 over-budget WARN (`speckit/plan` 508); conformant silent; exit 0 (`801c636d7f`)
  - **Target**: `validate_document.py` emits a WARN for over-budget hints (`speckit/plan` at ~500 chars) and stays silent on conformant hints; never a hard-fail.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The contract is the single source for the router's structural spans — generator reads `command_contract.json` for the five spans (`2e21f4eb77`)
  - **Target**: the generator reads `command_contract.json` for the five contract-derivable spans instead of prose hand-copied across families.
- [x] CHK-FIX-002 [P0] Producer inventory: A-W4 tables land before G1 as the generator's parse target — `| Purpose | Asset |` + `| Mode | Target |` standardized (`164b06a571`)
  - **Target**: the OWNED ASSETS `| Purpose | Asset |` and EXECUTION TARGETS `| Mode | Target |` schemas are standardized before the generator parses them.
- [x] CHK-FIX-003 [P0] Consumer inventory covers the generator, the routers, the deep assets, and the validators — `generate-command-routers.cjs`, `.opencode/commands/**`, and the validators all accounted for
  - **Target**: `generate-command-routers.cjs`, `.opencode/commands/**`, the deep asset files, `validate_document.py`, `validate-command-references.cjs`, and `sk-doc-command.cjs` are all accounted for.
- [x] CHK-FIX-004 [P0] Drift adversarial case: a staled committed span fails `--check` — negative test: staled asset path → `PATH-DRIFT` on `--check`
  - **Target**: a hand-edited span that no longer matches the contract fails `generate-command-routers.cjs --check`.
- [x] CHK-FIX-005 [P1] All new checks extend existing validators — no parallel lint engine — WARNs live in `validate_document.py` (`801c636d7f`, `71ed27a8e9`)
  - **Target**: G3/G4 checks live in `validate_document.py` / `validate-command-references.cjs` / the `sk-doc-command.cjs` adapter, not a new engine.
- [x] CHK-FIX-006 [P1] G3/G4 checks are validator-WARN, never hard-fail — hint WARN + raw-echo WARN emit `severity=warning`; exit 0 (`801c636d7f`)
  - **Target**: the `argument-hint` budget and ergonomics checks emit WARN only, pending allowlist tuning (ADR-004).
- [x] CHK-FIX-007 [P1] Scope boundary: `routing_source` naming recorded as deferred to phase 004 — `routing_source` undefined for all families; recorded in ADR-005 + T023
  - **Target**: the subaction-router `routing_source` sub-item is recorded as deferred (field undefined for all families); it is not enforced here (ADR-005).

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] The generator writes only the five named spans; it never touches other regions — `--write` diff confined to table-shape + asset-path cells (`164b06a571`)
  - **Target**: a diff of a generated router shows changes confined to the five contract-derivable spans.
- [x] CHK-031 [P1] Deep-router slimming preserves router-owned gates and binding — A-G2 no mutation; `PHASE 0` gate, INPUT GATE, AUTONOMOUS DIRECTIVE intact
  - **Target**: gates, binding, mode-selection, and summary remain in the router after `deep/*` slimming.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] REQ-006 ergonomics canon present in create-command Steps 6/9/11 and the quality-control gate — Step 9 loader-gating + raw-echo, Step 11 self-sufficiency (`71ed27a8e9`)
  - **Target**: `create-command/SKILL.md` Steps 6/9/11 carry the loader-gating, agent-existence, raw-echo deprecation, and self-sufficiency canon, wired into create-quality-control.
- [x] CHK-041 [P1] REQ-005 hint principle documented in Step 6 and `command_template.md` — "hint summarizes, EXECUTION TARGETS enumerates" in Step 6 + `command_template.md` (`801c636d7f`)
  - **Target**: "hint summarizes, EXECUTION TARGETS enumerates" is written into `create-command/SKILL.md` Step 6 and `command_template.md`.
- [x] CHK-042 [P1] spec/plan/tasks/decision-record/implementation-summary synchronized to final state — all five docs reconciled; `validate.sh --strict` Errors:0
  - **Target**: all five authored docs reconciled to the built-and-verified state at completion.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left outside the scratchpad — no scratch trees; `--check` runs against the in-repo `.opencode/commands/` tree
  - **Target**: any `--check` scratch trees are removed; no temp files remain outside `scratch/`.
- [x] CHK-051 [P1] Change scope limited to the intended files — `git diff` touches only the generator, `.opencode/commands/**`, the validators, and `create-command` canon
  - **Target**: `git diff` at completion touches only the generator, `.opencode/commands/**`, the validators, and `create-command` canon.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — ADR-001..ADR-005 with context, alternatives, consequences in `decision-record.md`
  - **Target**: ADR-001..ADR-005 documented with context, alternatives, and consequences.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001..ADR-005 all `status: Accepted`
  - **Target**: ADR-001..ADR-005 reach status: Accepted before completion.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — whole-file rendering and `render-command-contract.cjs` documented as rejected
  - **Target**: whole-file rendering and extending `render-command-contract.cjs` are documented as rejected alternatives.
- [x] CHK-103 [P2] Component diagram accurate — `plan.md` component diagram matches generator/validator wiring
  - **Target**: the `plan.md` component diagram matches the final generator/validator wiring.

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: Correctness & Behavior Verification

- [x] CHK-110 [P0] Determinism (NFR-C01) — repeated `--check` yields the same verdict `35/35 routers clean`
  - **Target**: repeated `generate-command-routers.cjs --check` runs on the same contract and tree yield the same clean/dirty verdict.
- [x] CHK-111 [P0] Shape + asset-path drift (NFR-C02, refined) — generator owns table SHAPE + contract-derived asset-path cells; `--check` `0 shape-drift, 0 path-drift`; staled path → `PATH-DRIFT`
  - **Target**: the generator diffs table SHAPE and contract-derived asset-path cells (not humanized Purpose/Mode label text, which is not in the contract); a staled asset path fails `--check`. See decision-record.md ADR-002 NFR-C02 refinement.
- [x] CHK-112 [P1] Behavior-preserving slimming (NFR-C03) — A-G2 no mutation; `deep/*` dispatch unchanged, trivially preserved
  - **Target**: the `deep/*` dispatch is identical (A-G2 resolved by evidence — no router mutation).
- [x] CHK-113 [P1] WARN-tier safety (NFR-S01) — hint + raw-echo checks emit `severity=warning`; never raise exit code (exit 0)
  - **Target**: the G3/G4 checks never raise the validation exit code; they are WARN-only.

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: Rollout Readiness

- [x] CHK-120 [P0] Rollback procedure documented — `plan.md` L2 Enhanced Rollback covers reverting the generator, tables, and routers
  - **Target**: `plan.md` L2 Enhanced Rollback documents reverting the generator, tables, and slimmed routers.
- [x] CHK-121 [P1] Deep-router dispatch snapshot captured before slimming — N/A: A-G2 evidence-satisfied, no slimming; display already externalized to `deep_*_presentation.txt`
  - **Target**: not required — A-G2 was resolved by evidence with no router mutation, so no pre-slimming snapshot was owed.
- [x] CHK-122 [P1] No runtime dispatch behavior change from the generator or validators — generator + WARN checks add authoring/validation only; `deep/*` dispatch unchanged
  - **Target**: the generator and the WARN checks add validation/authoring only; command dispatch is unchanged.
- [x] CHK-123 [P2] Allowlist-tuning follow-up recorded — recorded in `implementation-summary.md` Follow-Up Items
  - **Target**: the G3/G4 noise-measurement and allowlist-tuning follow-up is recorded in implementation-summary.md.

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] New checks extend existing validators — no parallel lint engine introduced — G3/G4 WARNs live in `validate_document.py` (ADR-003)
  - **Target**: G3/G4 checks live in `validate_document.py` / `validate-command-references.cjs` / the `sk-doc-command.cjs` adapter (ADR-003).
- [x] CHK-131 [P1] The generator introduces no new runtime dependency — `generate-command-routers.cjs` reuses the Node toolchain; no new package added
  - **Target**: `generate-command-routers.cjs` reuses the `sync-prompts.cjs` Node toolchain; no new package is added.
- [x] CHK-132 [P2] No destructive command policy is weakened by the router changes — destructive-policy contract fields untouched; A-G2 no mutation
  - **Target**: destructive-policy contract fields are untouched; the slimming is behavior-preserving.
- [x] CHK-133 [P2] G3/G4 WARN tiers cannot escalate a validation run to failure — WARN checks emit `severity=warning`, never raise exit (exit 0, ADR-004)
  - **Target**: the WARN checks never raise the exit code (ADR-004).
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized to the built state at completion — `spec.md`/`plan.md`/`tasks.md`/`decision-record.md`/`implementation-summary.md` reconciled
  - **Target**: `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, and `implementation-summary.md` reconciled to final state.
- [x] CHK-141 [P1] `create-command/SKILL.md` Steps 6/9/11 and `command_template.md` carry the canon — Steps 6/9/11 + `command_template.md` (`801c636d7f`, `71ed27a8e9`)
  - **Target**: the hint-budget principle and ergonomics canon are documented before the checks enforce them.
- [x] CHK-142 [P2] The `routing_source` phase-004 deferral is documented, not silent — recorded in spec §3 scope, T023, and ADR-005
  - **Target**: the deferral is recorded in spec scope, tasks (T023), and ADR-005.
- [x] CHK-143 [P2] Generator usage and `--check` gate are documented for future authors — `generate-command-routers.cjs` sits beside `sync-prompts.cjs` under `scripts/codex/`
  - **Target**: `generate-command-routers.cjs` usage and the drift-gate contract are noted alongside `sync-prompts.cjs`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Claude | Command-canon remediation lead | [x] Approved | 2026-07-16 |
| Deferred | Phase-004 owner (routing_source handoff) | [x] Recorded (ADR-005) | 2026-07-16 |
| `validate.sh --strict` | Validation gate | [x] Approved (Errors:0) | 2026-07-16 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 25 | 25/25 |
| P2 Items | 6 | 6/6 |

**Verification Date**: 2026-07-16
**Verified By**: Claude (AI Assistant) via `validate.sh --strict` (Errors:0)
**ADRs**: 5 documented, 5 accepted

<!-- /ANCHOR:summary -->
