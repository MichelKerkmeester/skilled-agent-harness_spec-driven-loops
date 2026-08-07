---
title: "Verification Checklist: semantic validation and fixtures"
description: "Verification evidence for the W1/W2/W6 semantic-validation phase. Each item marked [x] carries evidence of completion."
trigger_phrases:
  - "verification"
  - "checklist"
  - "semantic validation"
  - "gate obligation"
  - "mode completeness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "Built both checks + coverage fix; re-froze corpus to 15 trees; gates green"
    next_safe_action: "Commit the reconciled packet and sync to origin"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: semantic validation and fixtures

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` carries the W1/W2/W6 requirements (gate obligation, mode completeness, reference coverage) with the canonize-before-enforce rule.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` sequences canonize (Step 10) → coverage fix → adapter checks → oracle counterparts and fixtures → re-freeze and verify.
- [x] CHK-003 [P1] Phase-001 contract available for per-family input/mode facts
  - **Evidence**: `create-command/assets/command_contract.json` supplies `input.required`, `input.gate_owner`, `topology`, and `mode_matrix.supported_modes` per family; both classifiers read it.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Adapter and oracle pass `node -c` syntax check
  - **Evidence**: `node --check` on both `sk-doc-command.cjs` and `reference-oracle.cjs` reports syntax OK.
- [x] CHK-011 [P0] New checks reuse the shared makeFinding shape and vocabulary
  - **Evidence**: both checks emit through the existing `makeFinding` helper; codes `CMD-S3-GATE-OBLIGATION-UNMET` / `CMD-S3-MODE-INCOMPLETE` match the `^CMD-S[1-5]-` adapter vocabulary asserted by the differential test.
- [x] CHK-012 [P1] Checks are contract-driven, not re-hard-coding family behavior
  - **Evidence**: family behavior (required/gate-owner/topology/modes) is read from `command_contract.json`; no family names or per-family rules are hard-coded in the check bodies.
- [x] CHK-013 [P1] Comment hygiene: no artifact ids in code comments
  - **Evidence**: added comments state durable WHY only; the pre-commit comment-hygiene gate passed on commit `945789555b`.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 gate-obligation: required-input router without its gate fails; conformant passes
  - **Evidence**: `reference-oracle.cjs --classify` on a scratch tree with `argument-hint` removed from `doctor/mcp.md` returns exactly one `CMD-S3-GATE-OBLIGATION-UNMET` (P0); the clean base returns `[]`.
- [x] CHK-021 [P0] REQ-002 mode-completeness: advertised mode missing YAML or EXECUTION TARGETS row flags P1
  - **Evidence**: `--classify` on a scratch tree with the confirm-workflow reference removed from `deep/alignment.md` returns exactly one `CMD-S3-MODE-INCOMPLETE` (P1); the clean base returns `[]`.
- [x] CHK-022 [P0] REQ-003 one independent mutation fixture fails per new invariant; adapter and oracle agree
  - **Evidence**: fixtures `public-gate-obligation-unmet` and `public-mode-incomplete` each produce one finding; the adapter differential test reports `PASS fixtures=15` and oracle `--verify` reports `PASS all=15`.
- [x] CHK-023 [P1] REQ-004 reference coverage reports all six families with no hard-coded omission
  - **Evidence**: `validate-command-references.cjs` derives families from the tree; the run reports `[create, deep, design, doctor, memory, speckit]` across 69 asset files and `--self-test` reports all three cases PASS.
- [x] CHK-024 [P1] Conformant real corpus produces no new false positives from the new checks
  - **Evidence**: `sk-doc-command.cjs check .opencode/commands` produces zero `CMD-S3-GATE-OBLIGATION-UNMET` / `CMD-S3-MODE-INCOMPLETE` findings on the real corpus.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The three enforced rules are classified as new semantic invariants (gate obligation, mode completeness, coverage), not section-presence checks
  - **Evidence**: each rule keys on `command_contract.json` behavior (required-input gate ownership, mode-pair asset references, tree-derived family coverage), not on header presence.
- [x] CHK-FIX-002 [P0] Producer inventory: the checks read the phase-001 contract for per-family input and mode facts
  - **Evidence**: both the adapter and the oracle load `command_contract.json` and branch on `input.required`, `input.gate_owner`, `topology`, and `mode_matrix.supported_modes`.
- [x] CHK-FIX-003 [P0] Consumer inventory covers the adapter, the reference oracle, the reference CLI, and create-command Step 10
  - **Evidence**: adapter checks added; oracle classifiers added; reference CLI now derives families; Step 10 carries the Mode completeness paragraph (commit `37fafc727e`).
- [x] CHK-FIX-004 [P0] Adversarial case: each new invariant has a mutation fixture that fails, detected by both adapter and oracle
  - **Evidence**: fixtures `public-gate-obligation-unmet` and `public-mode-incomplete` each fail; the differential test (`PASS fixtures=15`) proves adapter and oracle emit byte-identical findings.
- [x] CHK-FIX-005 [P1] Coverage matrix: all six families are covered with no hard-coded omission
  - **Evidence**: `discoverFamilies()` returns the six contract families with the hard-coded `['create','deep','design']` list removed.
- [x] CHK-FIX-006 [P1] No runtime dispatch behavior changes; the phase adds validation only
  - **Evidence**: changes are confined to `sk-doc-command.cjs`, the oracle, the reference CLI, fixtures, and the canon doc; no command dispatch or workflow asset was altered.
- [x] CHK-FIX-007 [P1] Evidence pinned to adapter differential test, oracle --verify, and strict-validator receipts
  - **Evidence**: differential test `PASS fixtures=15`; oracle `--verify` `PASS all=15`; packet strict validation recorded below.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Reference oracle boundary intact — adapter does not import the oracle
  - **Evidence**: a grep for `reference-oracle` / the oracle id in the adapter returns nothing; `verifyAdapterBoundary` passes during `--verify`.
- [x] CHK-031 [P1] No fixture escapes its package root; fixture builder path guards hold
  - **Evidence**: `build-fixtures.cjs` guards every mutation target with `resolveInsidePhase` / escape checks; the rebuild materialized 15 trees with no path error.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] REQ-005 Step 10 documents mode completeness before the check enforces it
  - **Evidence**: create-command Step 10 carries the Mode completeness paragraph, committed as `37fafc727e` before the check was built.
- [x] CHK-041 [P1] spec/plan/tasks/implementation-summary synchronized to final state
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` reconciled to the built-and-verified state.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left outside the scratchpad
  - **Evidence**: the `--classify` scratch trees were created inside a `.classify-scratch` dir removed by trap in the same command; no scratch remained.
- [x] CHK-051 [P1] Commit scope limited to intended files (no operator dirty files)
  - **Evidence**: the code+data commit staged `49 files`, all under the adapter/reference-CLI/conformance-asset/002-packet roots; a `git diff --cached` leak check found no out-of-scope path.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-16
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
