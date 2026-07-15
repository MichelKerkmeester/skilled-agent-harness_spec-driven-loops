---
title: "Feature Specification: deterministic fixtures and reference oracle — an independent, non-circular defect corpus"
description: "Builds and verifies the independent public and held-out fixture corpus plus a reference oracle, authored before any adapter code so the deterministic adapter cannot validate itself."
status: complete
trigger_phrases:
  - "command benchmark fixtures"
  - "reference oracle"
  - "held-out fixtures"
  - "defect calibration corpus"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle"
    last_updated_at: "2026-07-15T06:49:12Z"
    last_updated_by: "codex"
    recent_action: "Completed the independent oracle, deterministic fixture corpus, and frozen expectations"
    next_safe_action: "Refresh generated metadata, then let phase 003 consume expectations without oracle imports"
    blockers: []
    key_files:
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: deterministic fixtures and reference oracle — an independent, non-circular defect corpus

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A deterministic adapter that generates its own expected results would validate itself. This phase builds an independent reference oracle and a defect fixture corpus with public calibration fixtures and held-out fixtures, so the production adapter is measured against expectations it did not produce.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Author a mutation manifest and a reference oracle independent of the production adapter.
- Build eight public calibration fixtures spanning the core defect classes plus a clean control.
- Build four held-out fixtures including an orphan mirror, a wrong subaction mapping, a destructive-boundary contradiction, and a compound defect.
- Freeze expected defect codes and locations from the verified reference oracle.
- Instantiate `fixture-manifest.json` from the create-benchmark `conformance_benchmark` fixture-manifest template; keep the reference oracle lane- and spec-owned, with only provenance and expected outcomes entering the authored package.

**Out of scope:**
- Implementing the production adapter (next phase).
- Behavioral scenarios or model-matrix runs.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Author fixtures and expectations from an independent reference oracle that the production adapter must not import or invoke.
- **REQ-002 (P0):** The clean control fixture yields exactly zero findings.
- **REQ-003 (P1):** Provide eight public calibration fixtures covering the core defect classes and four held-out fixtures not used during adapter implementation.
- **REQ-004 (P1):** Freeze each fixture expected defect code and location from the verified oracle.
- **REQ-005 (P2):** Document the mutation manifest so fixtures can be regenerated deterministically.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The reference oracle verifier passes at exit 0.
- The clean fixture yields exactly zero findings.
- Every public and held-out fixture matches its independent expected defect set.
- Held-out fixtures are demonstrably unused during later adapter implementation.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Oracle circularity if the adapter reuses oracle logic, mitigated by an import boundary and held-out fixtures.
- Fixture staleness as command shapes evolve, mitigated by a regenerable mutation manifest.
- Dependencies: the frozen census and taxonomy from the contract phase.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The compound held-out fixture freezes three independent defects across S1, S2, and S5.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 001-create-benchmark-conformance-family. Successor: 003-command-contract-adapter.
