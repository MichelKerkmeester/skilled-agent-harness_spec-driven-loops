---
title: "Verification Checklist: sk-prompt Per-Hub Canary"
description: "Level-2 evidence for the two-mode sk-prompt compiled-router canary, bounded default, ordered bundle, real scorer, and rollback."
trigger_phrases:
  - "sk-prompt canary verification"
  - "prompt-improve default evidence"
  - "sk-prompt rollback evidence"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/005-sk-prompt"
    last_updated_at: "2026-07-19T23:59:59Z"
    last_updated_by: "codex"
    recent_action: "Verified every P0 and P1 checklist item with concrete evidence"
    next_safe_action: "Keep the candidate shadow-only"
    blockers: []
    key_files:
      - "harness/validate-canary.cjs"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-prompt-rollout-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-prompt Per-Hub Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| **[P0]** | Hard blocker | Cannot claim REAL-GREEN until verified |
| **[P1]** | Required | Must verify or identify an external boundary |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Required source, sibling, design, shared-contract, and scorer files were read [EVIDENCE: `002-system-deep-loop` plus five authored and three scorer inputs]
  before writing.
  - **Evidence**: The intake covered every primary sibling file, the Level-2 spec archetype, all
    five live authored inputs, the three shared libraries, synthesis §§2, 9, 10, and scorer hashes.
- [x] CHK-002 [P0] The target child was absent and all writes remained inside it.
  - **Evidence**: Initial probe returned `TARGET_ABSENT`; final scope diff lists only this child.
- [x] CHK-003 [P1] Baseline and rollback were recorded. [EVIDENCE: `activation/manifest.prior.json` and eight baseline hashes]
  - **Evidence**: Protected and authored digests were pinned before implementation; rollback is
    deletion of the isolated child and the canary retains a byte-exact prior manifest.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every CommonJS file passes `node --check`.
  - **Evidence**: Seven files were checked with exit code `0`.
- [x] CHK-011 [P0] The shared compiler and projector are reused.
  - **Evidence**: The compiler adapter calls shared `compile()`; build and canary call shared
    `projectToRouteGold()`.
- [x] CHK-012 [P0] Generated artifacts are deterministic.
  - **Evidence**: No `Date.now`, `new Date`, or `Math.random` occurs; two complete builds produce
    identical child artifact hashes.
- [x] CHK-013 [P1] Comment hygiene passes. [EVIDENCE: `validate-canary` reports commentHygieneViolations=0]
  - **Evidence**: Static scan reports zero ephemeral artifact labels or spec paths in code comments.
- [x] CHK-014 [P1] Runtime code introduces no external dependency.
  - **Evidence**: Static scan reports `externalDependencies: 0`.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Identical source bytes compile identically. [EVIDENCE: `node harness/build-artifacts.cjs` reports status=built on byte-identical recompile]
  - **Evidence**: Independent policy recompilation is byte-identical and source-object drift is
    rejected.
- [x] CHK-021 [P0] Both authored modes compile without invention or collapse.
  - **Evidence**: Destination count is `2`; resources are the two authored packet `SKILL.md` paths.
- [x] CHK-022 [P0] Authored weights and tie-break survive compilation.
  - **Evidence**: Validator reports weights `4` and `6`, tie-break
    `[prompt-improve,prompt-models]`, and one ordered composition rule.
- [x] CHK-023 [P0] The non-null default is exact.
  - **Evidence**: `zero-signal-default` is
    `route(single,[prompt-improve])` with `bounded-default` basis and the expected resource.
- [x] CHK-024 [P0] Explicit dual-mode routing is exact.
  - **Evidence**: The ordered bundle targets `prompt-improve` then `prompt-models`; reversed order
    fails `BUNDLE_NOT_IN_POLICY`.
- [x] CHK-025 [P0] Ambiguity emits one clarify.
  - **Evidence**: Exactly one row clarifies with two workflow alternatives plus `none_of_these`.
- [x] CHK-026 [P0] Real route-gold is fully green.
  - **Evidence**: In-memory and delivered scoring each report `8` real-green rows, `0`
    shadow-partial rows, and no write-back.
- [x] CHK-027 [P0] The scorer falsifier is effective.
  - **Evidence**: Coherently corrupted resource observation returns `pass: false` and
    `resourceOk: false`.
- [x] CHK-028 [P1] Advisor drift cannot rewrite decisions. [EVIDENCE: `validate-canary` reports only live identity match contributes]
  - **Evidence**: Only the live identity match contributes; stale, absent, unavailable, and
    projection drift return non-contributing dispositions.
- [x] CHK-029 [P1] Document replay matches machine behavior. [EVIDENCE: `documentParity` reports 8/8 and planted divergence rejected]
  - **Evidence**: All eight cases match and a planted default-mode divergence is rejected.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Closed-algebra guards are driven. [EVIDENCE: `closedAlgebra` reports 4 named guards]
  - **Evidence**: Negative target, negative authority, route recovery artifact, and reversed bundle
    order fail with named codes.
- [x] CHK-031 [P0] Destination COMMIT requires VERIFY.
  - **Evidence**: Direct COMMIT fails `COMMIT_WITHOUT_READY`; the legal path is exactly
    `PREPARE → VERIFY → COMMIT` with one effect.
- [x] CHK-032 [P0] Aggregate activation hard blocks are driven. [EVIDENCE: `hardBlocks` reports all activation refusal codes]
  - **Evidence**: Default loss, bundle drift, negative authority, tuple mismatch, mixed generation,
    route recovery, COMMIT without VERIFY, and scorer edit each block eligibility.
- [x] CHK-033 [P0] Fenced rollback is byte-exact. [EVIDENCE: `rollback.byteExact=true` and fenceEpoch=2]
  - **Evidence**: Ship and rollback advance the fence to epoch `2`; prior and restored SHA-256
    values are identical.
- [x] CHK-034 [P1] Legacy remains serving-authoritative.
  - **Evidence**: Candidate and acceptance artifacts report `servingAuthority: legacy` and
    `shadowOnly: true`.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Non-route decisions cannot carry capability or target data. [EVIDENCE: `closedAlgebra` negative target and authority guards pass]
  - **Evidence**: Parser guards reject smuggled targets and non-withheld negative authority.
- [x] CHK-041 [P0] One request cannot observe mixed generations.
  - **Evidence**: Candidate pin matches; prior plus candidate pins fail
    `MIXED_GENERATION_OBSERVED`.
- [x] CHK-042 [P1] No network, package install, credential, or live mutation was introduced. [EVIDENCE: `git status --short` lists only the isolated child]
  - **Evidence**: All commands were offline local Node/shell checks; only this child was written.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on final state.
  - **Evidence**: All report 8/8 real-green, bounded default, ordered bundle, legacy authority, and
    byte-exact rollback.
- [x] CHK-051 [P0] Completion metadata has no pending or contradictory state. [EVIDENCE: `validate.sh --strict` status consistency passes]
  - **Evidence**: Tasks and checklist are fully checked; summary status is REAL-GREEN shadow-only.
- [x] CHK-052 [P1] Required anchors are balanced and ordered. [EVIDENCE: `validate.sh --strict` ANCHORS_VALID passes]
  - **Evidence**: Strict packet validation confirms checklist and implementation-summary structure.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Source, fixtures, generated projections, activation artifacts, and docs remain
  child-local.
  - **Evidence**: Final tree has only `lib/`, `harness/`, `fixtures/`, `compiled/`, `activation/`,
    and Level-2 root documents.
- [x] CHK-061 [P0] Protected scorer files remain byte-unchanged. [EVIDENCE: `sha256sum` matches all 3 captured scorer hashes]
  - **Evidence**: Final hashes equal all three pinned baseline hashes.
- [x] CHK-062 [P1] Current authored inputs match the canary's pinned provenance hashes. [EVIDENCE: `validate-canary` reports all 5 authored source digests]
  - **Evidence**: The intentional hub `SKILL.md` change was re-pinned; all five current hashes match
    the canary and the other four authored inputs remain unchanged.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 23 | 23/23 |
| P1 Items | 10 | 10/10 |

**Verification Date**: 2026-07-19  
**Verification Scope**: Shared compile, bounded default, ordered bundle, real delivered route-gold,
closed algebra, document parity, execution fence, source pins, shadow eligibility, and rollback.  
**External Boundary**: No live activation, git commit, push, network access, or package installation.

<!-- /ANCHOR:summary -->
