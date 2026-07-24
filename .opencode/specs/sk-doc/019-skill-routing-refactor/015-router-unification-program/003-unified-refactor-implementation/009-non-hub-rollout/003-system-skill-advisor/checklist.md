---
title: "Verification Checklist: system-skill-advisor Non-Hub Rollout"
description: "Level-2 evidence checklist for deterministic compilation, real scorer compatibility, zero-authority parity, closed algebra, protected files, and fenced rollback."
trigger_phrases:
  - "system skill advisor rollout checklist"
  - "advisor real green checklist"
  - "advisor protected scorer hashes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/003-system-skill-advisor"
    last_updated_at: "2026-07-19T10:55:36Z"
    last_updated_by: "codex"
    recent_action: "Conformed the rollout verification checklist to the Level-2 contract"
    next_safe_action: "Regenerate canonical metadata and run strict validation"
    blockers: []
    key_files:
      - "harness/run-phase.cjs"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-skill-advisor-rollout-20260719"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: system-skill-advisor Non-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must pass |
| **[P1]** | Required | Must pass or have explicit deferral |
| **[P2]** | Optional | May be documented as deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Writes are confined to this child. [Evidence: scoped `git status --short` lists only this rollout child.]
  - **Evidence**: The parent lean trio already existed and was not changed; no live skill, scorer, compiler, configuration, or sibling packet was written.
- [x] CHK-002 [P0] Frozen modules are reused rather than copied or reimplemented. [Evidence: `harness/support.cjs` imports the frozen compiler and scorer modules.]
  - **Evidence**: Target code imports the compiler, schema validator, canonical contract, parity runner, and fenced-manifest implementation from their existing locations.
- [x] CHK-003 [P0] The authored router is closed before compilation. [Evidence: `harness/run-phase.cjs` reports 20 intents and 20 leaves.]
  - **Evidence**: Twenty signal keys equal 20 resource-map keys; every resource exists in the manifest, alias table, and filesystem.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Policy and artifact generation are deterministic.
  - **Evidence**: Three compile runs and two isolated process runs produced body SHA-256 `a2a7ac1899a2a6553cb207e9a531604a890bad58aba9e636693560a6f93ce15e`; two complete builds byte-matched all nine checked artifacts.
- [x] CHK-011 [P0] All projections share one effective policy hash and pass frozen schemas.
  - **Evidence**: Advisor, policy card, and five typed rows carry `3b2dfe70b132e6c0b8a7c1fdc3d7c13c2991b4266da6a0f8c258b7841c039e0d`; policy, decisions, projections, and typed gold validate.
- [x] CHK-012 [P1] Frozen shared and protected modules remain unchanged. [Evidence: `harness/run-phase.cjs` prints all three protected SHA-256 receipts.]
  - **Evidence**: The implementation imports shared modules; the harness reports all three protected scorer hashes matching their captured values.
- [x] CHK-013 [P1] Every target CommonJS file parses and comments preserve durable rationale.
  - **Evidence**: `node --check` passes 5/5 files and the harness reports `comment_hygiene=pass`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Typed rows pass the real route-gold evaluator. [Evidence: `harness/run-phase.cjs` reports five passing rows and a rejected falsifier.]
  - **Evidence**: Five of five rows pass through the protected subprocess path and an extra-resource falsifier fails.
- [x] CHK-021 [P0] Positive-route shadow parity is exact.
  - **Evidence**: All 20 authored routes report `matches=20 mismatches=0 effects=0`, `legacy_authoritative=true`, and `gold_mutation=observed-none`.
- [x] CHK-022 [P0] The decision algebra is closed.
  - **Evidence**: Zero signal defers, tied evidence clarifies once, the authored exclusion rejects, and all non-routes are target-free with `Withheld` authority and no effects.
- [x] CHK-023 [P0] N=1 partial evaluation is intact.
  - **Evidence**: Candidate count 1; selection `single`; 20 selectors; 20 leaves; empty cross-target, bundle, handoff, and authority collections; null overlay; static provenance; rank calls 0.
- [x] CHK-024 [P0] Fenced activation and rollback are byte-exact.
  - **Evidence**: Generation 1 activates, stale epoch is rejected, pins remain isolated, fence reaches 2, and pre/restored manifest SHA-256 is `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Producer and consumer boundaries are inventoried. [Evidence: `harness/run-phase.cjs` validates the router, projections, scorer, parity, and activation boundaries.]
  - **Evidence**: The harness closes the authored router producer against manifest, aliases, filesystem leaves, five compiled fixture families, the protected scorer, parity, and activation consumers.
- [x] CHK-FIX-002 [P1] Adversarial controls can turn the gate red. [Evidence: `harness/run-phase.cjs` rejects the extra-resource falsifier.]
  - **Evidence**: The extra-resource falsifier fails, and artifact drift, schema drift, parity mismatch, protected hash drift, stale-fence acceptance, and rollback mismatch are hard assertions.
- [x] CHK-FIX-003 [P1] Default validation is read-only. [Evidence: `harness/run-phase.cjs` compares the full child hash before and after validation.]
  - **Evidence**: The harness hashes the complete child before and after validation and requires byte identity.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Live authority remains zero.
  - **Evidence**: Checked and candidate manifests retain `servingAuthority="legacy"` and `shadowOnly=true`; parity observes no effects.
- [x] CHK-031 [P0] The three protected files are byte-unchanged.
  - **Evidence**: Replay `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`; scorer `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`; loader `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`.
- [x] CHK-032 [P1] No network, install, secret, commit, push, or external effect enters the rollout. [Evidence: `harness/run-phase.cjs` uses local modules and reports effects zero.]
  - **Evidence**: The gate uses local Node.js modules and built-ins, all decisions report zero effects, and no publication action was authorized.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] All five authored docs describe the same routing facts and evidence.
  - **Evidence**: Spec, plan, tasks, checklist, and implementation summary agree on 20 intents, 20 leaves, five scorer rows, 20/20 parity, zero effects, hashes, and rollback.
- [x] CHK-041 [P1] The five docs use the Level-2 template comments, headers, anchors, and continuity frontmatter.
  - **Evidence**: Each document follows the passing sibling shape and the contract returned by `template-structure.js contract 2`.
- [ ] CHK-042 [P0] Strict Level-2 packet validation exits zero.
  - **Evidence pending**: Record the final `validate.sh --strict` receipt after canonical metadata regeneration.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All authorized writes remain child-local.
  - **Evidence**: Documentation changes are confined to the five target spec docs; canonical generators may update only `description.json` and `graph-metadata.json` in the same child.
- [x] CHK-051 [P1] Routing, compiled, harness, activation, parity, scorer, validator, and sibling bytes remain outside the write set. [Evidence: final `shasum -a 256` values are compared with the captured baseline.]
  - **Evidence**: Protected artifact hashes were captured before documentation edits and are rechecked during final verification.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Verified |
|---|---:|
| P0 | 12/13 |
| P1 | 10/10 |
| P2 | 0/0 |

**Verification Date**: 2026-07-19
<!-- /ANCHOR:summary -->
