---
title: "Verification Checklist: Shadow Compiler + mcp-code-mode N=1 Compile"
description: "Level-2 verification checklist for Phase 1 of the unified router refactor: proves the shadow compiler is pure/deterministic/fail-closed, that mcp-code-mode compiles as the degenerate N=1 case with no special-casing, that the scorer is untouched and route-gold stays green, and that fenced activation + byte-exact rollback hold at zero live authority."
trigger_phrases:
  - "shadow compiler n1 checklist"
  - "mcp-code-mode compile verification"
  - "route-gold parity rollback checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/001-compiler-n1-shadow"
    last_updated_at: "2026-07-18T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the second-review compiler, projection, activation, parity, and harness findings"
    next_safe_action: "Run strict validation and metadata regeneration outside this scoped review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

# Verification Checklist: Shadow Compiler + mcp-code-mode N=1 Compile

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..010)
  - **Evidence**: `spec.md` retains all ten requirements and seven success criteria.
- [x] CHK-002 [P0] Technical approach defined in plan.md (compiler → projections → parity → activation)
  - **Evidence**: `plan.md` defines the pure compiler, three projections, read-only parity lane, and fenced activation sequence.
- [x] CHK-003 [P0] Phase 0 schemas + deterministic serialization frozen and importable; else fail closed (spec REQ-002)
  - **Evidence**: Phase 0 harness passed 11/11 groups; the compiler imports `../000-contract-schemas/lib/canonical.cjs`, and the missing-schema test returns `ENOENT` with no artifact.
- [x] CHK-004 [P1] `mcp-code-mode` authored sources confirmed against synthesis §5 line refs
  - **Evidence**: Source ingestion confirms seven leaves, six selector classes, near-tie and zero-signal clauses, and the advisory guard behavior described in synthesis §5.1–§5.2.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `compile()` is a total, side-effect-free function (no writes/network beyond declared source reads)
  - **Evidence**: `compiler/compiler.cjs` canonical-clones the input, rejects unknown/unsupported authored fields, validates the complete candidate against the frozen policy schema before hashing and again with real digests, and contains no filesystem, process, network, timer, or randomness API. Checked-in writes exist only behind `harness/run-phase.cjs --write`.
- [x] CHK-011 [P0] No `skillId == "mcp-code-mode"` (or equivalent name) branch anywhere in the compiler/evaluator path (SC-002)
  - **Evidence**: Three metamorphic compiles under `mcp-code-mode`, `router-zeta`, and `röuter-älpha` produce identical identity-normalized policies, evaluations, advisor bytes, policy-card bytes, and all typed-route-gold bytes. The secondary lexical scan reports `name_literals=0 conditional_hits=0`; it is not represented as an AST-complete proof.
- [x] CHK-012 [P0] Fail-closed guards raise a typed `CompileError` and write no partial artifact (REQ-002)
  - **Evidence**: In-memory negative tests assert exact codes/elements for missing modes, unresolved leaves, authority contradictions, duplicate destinations, invalid detector input, an unexpected nested destination path, an unsupported overlay, and an N=1 bundle. Every row returns `noArtifact=true`; caller-owned invalid detector objects remain mutable.
- [x] CHK-013 [P1] N=1 empties emerge by partial evaluation, not by special-casing (synthesis §5.1)
  - **Evidence**: The derived degeneracy view reports one destination, `selectionKinds=[single]`, empty cross-target/bundle/handoff collections, `overlay=null`, and `P=static`. A one-candidate authored bundle now fails with `N1_BUNDLE_FORBIDDEN` instead of producing a bundle artifact.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All shadow-local acceptance scenarios exercised (REQ-001..008)
  - **Evidence**: `node harness/run-phase.cjs` reports PASS for SC-001 through SC-007 and the standalone document-only replay. An in-process strict write-denial shim also exits 0; per-hub activation is explicitly outside this evidence.
- [x] CHK-021 [P0] Determinism proven: ≥3× recompile → byte-identical body + identical `effectivePolicyHash` (SC-001)
  - **Evidence**: Three in-process and two isolated-process compiles produced body SHA-256 `25051d39c2d75bdbf5bb0ed5e072aff6221192c3c4b9fe46f7b497e4c8b18fbf` and effective hash `663c356a3dc72455a25f391a1d97767ace28de911c91b3b70ab4ef91bb37ce9f`; synthetic `z`/`ä` child fingerprints also match under `en_US.UTF-8` and `sv_SE.UTF-8`.
- [x] CHK-022 [P0] Three fail-closed negatives pass: missing mode, unresolved leaf, authority contradiction (SC-003)
  - **Evidence**: The driver asserted the exact error code and element for all three required faults, plus duplicate destination closure, and verified no output file existed after each failure.
- [x] CHK-023 [P0] Route-gold stays green via the compatibility projector; scorer diff empty (SC-004)
  - **Evidence**: A read-only subprocess invokes the protected scorer for five intent-derived fixture-gold rows. Both extra-resource and fabricated `WRONG` observations fail. The scorer and router replay match trusted constants `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` and `b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf`.
- [x] CHK-024 [P0] Shadow parity derives checked-manifest authority and observes zero emitted effects (SC-005)
  - **Evidence**: The parity runner validates and pins the checked manifest, derives legacy authority from `servingAuthority=legacy` plus `shadowOnly=true`, and totals emitted effect arrays. It reports `effects=0 gold_mutation=observed-none status=shadow-partial activation_deferred=true`; live per-hub authority remains unproven here.
- [x] CHK-025 [P0] In-memory fenced activation + byte-exact rollback drill passes; one generation pinned per request (SC-006)
  - **Evidence**: Copied manifest objects are exercised entirely in memory. Rollback restored SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`; the fence advanced to 2, stale/pre-rollback epochs and generation/hash CAS mismatches were rejected, and requests pinned generations 0 and 1 separately.
- [x] CHK-026 [P1] Edge cases tested: zero-signal `defer(no-match)`, ambiguous `clarify`, forbidden `reject`, concurrent activation loses on stale token (synthesis §5.2, §9)
  - **Evidence**: Typed fixtures and specific-error assertions cover `defer`, one-turn `clarify`, `reject`, zero rank calls, stale epochs, malformed and authority-bearing manifests, missing schema, complete duplicate identity, recursive advisor omission, and two same-name runtime-discriminated destinations that retain distinct qualified IDs. Receipt idempotency remains explicitly `false`.
- [x] CHK-027 [P1] Three projections carry the same `effectivePolicyHash` (SC-007); document-only card route reaches `PREPARED_DRAFT`/`DOCUMENT_ONLY_UNATTESTED` (REQ-010)
  - **Evidence**: All nine checked-in policy/projection/fixture artifacts are regenerated in memory and byte-compared, including the full card body. A re-hashed `publicMode="definitely-wrong"` mutation raises `ARTIFACT_DRIFT`; all projections carry effective hash `663c356a3dc72455a25f391a1d97767ace28de911c91b3b70ab4ef91bb37ce9f`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: The nine findings were closed as `class-of-bug` (ordering, identity, validation, deferred receipt claim), `algorithmic` (metamorphic identity and artifact regeneration), `matrix/evidence` (real scorer gold), and `test-isolation` (temp-only negative/rollback drills).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the legacy router is the only serving authority during shadow (synthesis §9).
  - **Evidence**: The harness calls the legacy replay as the serving decision, while the compiled evaluator result is observation-only and cannot select or commit a live destination.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: only the three projections + parity harness read the compiled artifact; nothing commits.
  - **Evidence**: Exact require/import inventory confines compiled-policy consumers to `compiler/projections.cjs`, `compiler/evaluator.cjs`, `parity/shadow-parity.cjs`, and the verification driver; emitted authority is empty.
- [x] CHK-FIX-004 [P0] Adversarial cases covered for the fail-closed + fence paths: unmapped leaf, authority contradiction, stale fencing token, missing schema.
  - **Evidence**: The negative matrix also covers duplicate destination, stale epoch, concurrent lock ownership, dangling selector/composition/authority references, and exact no-artifact behavior.
- [x] CHK-FIX-005 [P1] Fixture-family matrix listed before completion (single route, idle defer, clarify, reject, singular-omission + zero-rank-call) (synthesis §8.2).
  - **Evidence**: `route-gold.typed.json` and `compiled/mcp-code-mode/fixtures/` contain all five named rows, each schema-validated and replayed.
- [x] CHK-FIX-006 [P1] Determinism variant executed across two processes/machines, not one run (SC-001).
  - **Evidence**: `harness/fingerprint.cjs` ran in fresh Node processes under two contrasting locales in addition to repeated in-process compiles. Cross-machine execution was not available and is not claimed.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: Git use was prohibited; evidence is pinned to immutable body/effective hashes above, while both protected replay digests are trusted constants in `harness/run-phase.cjs`, separate from the packet-local baseline JSON.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in shadow artifacts or fixtures
  - **Evidence**: Source/config review found no credential material, environment access, network endpoint, or secret-bearing field.
- [x] CHK-031 [P0] Authority stays destination-local — a proof/recommendation is never a capability; negatives withhold authority (synthesis §2.3, §10)
  - **Evidence**: Positive routes remain `WithheldUntilVerify`; negative paths return `Withheld` through typed `defer`, `clarify`, or `reject`, and parity asserts zero effects.
- [x] CHK-032 [P1] `mcp-route-guard.cjs` stays advisory (fails open) and is never wired as destination VERIFY (synthesis §5.2)
  - **Evidence**: The guard contributes only a source hash and advisory metadata; no destination verify/commit field references it, and its protected checksum remains `63a3dbbc3f0a1a89f99c561d1764132973a6f427aedb766e9104847d1d4d1a5f`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized
  - **Evidence**: Phase-local `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` record the same shadow-only implementation and verification state.
- [x] CHK-041 [P1] Migration Stage-1 gate (spec §6) documented and satisfied before Phase 2 activation
  - **Evidence**: Canonical regeneration, typed fixtures, compatibility replay, protected scorer checksums, and fail-closed source resolution all pass in `harness/run-phase.cjs`.
- [ ] CHK-042 [P2] Master-plan phase map (`../spec.md`) reflects Phase 1 status
  - **Deferred**: The master plan is outside the user-authorized phase-folder write boundary.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Shadow artifacts confined to the isolated `<shadow-root>/`; no live routing path written
  - **Evidence**: Every created or modified file is under this phase folder; protected live sources, scorer files, schemas, and playbooks remain checksum-identical.
- [x] CHK-051 [P1] Temp/scratch files cleaned before completion; new route-gold fixtures are append-only
  - **Evidence**: Negative, drift, activation, and rollback drills copy objects and buffers in process and perform no temporary-directory operation. The default harness hashes the full phase tree before/after and asserts byte identity; checked-in generation requires explicit `--write`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 0/1 (phase-external status update deferred) |

**Verification Date**: 2026-07-18
<!-- /ANCHOR:summary -->
