---
title: "Verification Checklist: system-code-graph Non-Hub Router Rollout"
description: "P0/P1 evidence gate for deterministic compilation, real-scorer compatibility, zero-authority shadow parity, and byte-exact fenced rollback."
trigger_phrases:
  - "system code graph rollout checklist"
  - "system code graph real scorer verification"
  - "system code graph rollback evidence"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/002-system-code-graph"
    last_updated_at: "2026-07-19T12:10:00.000Z"
    last_updated_by: "codex"
    recent_action: "Closed target, scorer, parity, rollback, syntax, and strict gates"
    next_safe_action: "Keep live activation deferred until the program promotion gate"
    blockers: []
    key_files:
      - "harness/validate.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: system-code-graph Non-Hub Router Rollout

<!-- ANCHOR:protocol -->
## Verification Protocol

- Run the target-local harness after every authored or metadata edit.
- Run syntax and JSON checks independently of the harness output.
- Recheck all three protected scorer digests after validation.
- Mark strict validation complete only from a fresh exit 0.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope and source bytes were frozen before writing.
  - Evidence: `shasum -a 256` captured the live skill, manifest, aliases, and shared module entry points.
- [x] CHK-002 [P0] The requested parent lean trio already existed.
  - Evidence: parent `spec.md`, `description.json`, and `graph-metadata.json` were read and left unchanged.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared compiler, canonical, parity, activation, and scorer modules are imported rather than copied.
  - Evidence: `harness/*.cjs`, `parity/run-shadow.cjs`, and `activation/run-drill.cjs` resolve repository-local shared modules.
- [x] CHK-011 [P0] Compiled singleton shape is closed and skill-agnostic.
  - Evidence: `node harness/validate.cjs` reports candidate 1, selectors 37, leaves 53, no overlay, no name literals, and no skill branches.
- [x] CHK-012 [P1] Policy provenance contains only target-authored bytes.
  - Evidence: `harness/validate.cjs` asserts source IDs `SKILL.md` and `leaf-manifest.json`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Deterministic build produces byte-identical checked artifacts.
  - Evidence: `node harness/validate.cjs` reports 13 artifacts, 2 processes, and body `de55cf0b63df31b27ceb1cc1078d6e3c09b41b3ee14ae2bb76144ec1e7e1443f`.
- [x] CHK-021 [P0] Closed algebra covers positive, zero-signal, ambiguity, and forbidden cases.
  - Evidence: fixtures `exact-single-route`, `zero-signal-defer`, `one-turn-clarify`, and `forbidden-reject` pass.
- [x] CHK-022 [P0] Typed projections pass the real frozen scorer.
  - Evidence: `node harness/validate.cjs` reports 5 rows and 2 rejected falsifiers in a protected subprocess.
- [x] CHK-023 [P0] Shadow parity retains zero live authority.
  - Evidence: `node harness/validate.cjs` reports legacy authoritative, effects 0, one match, three classified mismatches, and no gold mutation.
- [x] CHK-024 [P0] Fenced rollback restores exact prior bytes.
  - Evidence: `activation/run-drill.cjs` restores `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23` at fence 2.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Fallback-only defaults do not leak into scored routes.
  - Evidence: `harness/validate.cjs` reads 2 defaults while `zero-signal-defer.json` has no observed resources.
- [x] CHK-031 [P1] All projections share one effective policy hash.
  - Evidence: policy, advisor, card, and 5 fixtures validate at `ceadd464648a46488ca3781bcb37b72782221352fb191b78f0d7a92d0a487a40`.
- [x] CHK-032 [P1] Validation is read-only over the child.
  - Evidence: `node harness/validate.cjs` reports `target_bytes_unchanged=true`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Protected scorer files remain unchanged.
  - Evidence: `harness/validate.cjs` rechecks 3 trusted SHA-256 values before and after the target gate.
- [x] CHK-041 [P0] No network, install, live route mutation, or effect-bearing call occurs.
  - Evidence: `node harness/validate.cjs` reports effects 0 and live authority 0.
- [x] CHK-042 [P1] Non-route decisions carry no usable authority or target.
  - Evidence: `harness/validate.cjs` rejects `WithheldUntilVerify` and target IDs on defer, clarify, and reject.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Canonical docs describe the same shadow-only scope.
  - Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` name zero live authority.
- [x] CHK-051 [P1] Document-only policy card stays honest.
  - Evidence: generated `policy-card.md` emits `PREPARED_DRAFT` and terminates `DOCUMENT_ONLY_UNATTESTED`.
- [x] CHK-052 [P1] Strict packet validation exits 0 after metadata synchronization.
  - Evidence: `validate.sh <child-folder> --strict` exited 0 with 0 errors and 0 warnings.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] All rollout writes are confined to this child.
  - Evidence: `git status --short -- <child-folder>` lists only this delivery path.
- [x] CHK-061 [P1] Every target CommonJS and JSON file validates.
  - Evidence: 6 explicit `node --check` passes and 14 explicit JSON parse passes.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-19
<!-- /ANCHOR:summary -->
