---
title: "Verification Checklist: Fleet Legacy-Read Cleanup"
description: "Level-2 evidence for external readiness, ordered deletion, real route-gold, fenced rollback, hot-card vocabulary removal, final drift, and no over-emission."
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist

<!-- ANCHOR:protocol -->
## Protocol

- [x] CHK-001 [P1] Cleanup changes resolver authority only after external fleet readiness.
  - **Evidence**: `assertFleetReady()` consumes normalized receipts derived by executing the committed singleton, execution-plane, and three parent-hub harnesses; a planted false canary result throws `PREFLIGHT_BLOCKED`.
- [x] CHK-002 [P1] The cleanup packet models deletion without mutating any live router surface.
  - **Evidence**: all created artifacts and every write target are inside this phase folder or an OS temporary directory; external harnesses and scorer files are called read-only.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P1] The authoritative specification, plan, tasks, synthesis sections, and committed upstream bindings were read before writes.
  - **Evidence**: implementation binds the frozen canonical serializer, singleton compiler, fence-state format, compatibility projector, and per-hub canary reports named by the task.
- [x] CHK-004 [P1] The real upstream baselines were captured before implementation.
  - **Evidence**: singleton compiler, execution-plane, `sk-code`, `system-deep-loop`, and `mcp-tooling` harnesses exited 0; the three scorer SHA-256 values matched the protected constants.
- [x] CHK-005 [P1] The modeled blast radius and rollback were recorded before deletion.
  - **Evidence**: `cleanup-contract.md` fixes the increasing activation order and states that rollback restores routing bytes only, while destination recovery owns post-COMMIT effects.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] The deletion driver is data-parameterized and contains no skill-name branch.
  - **Evidence**: all four records report `driver:"deleteLegacySkill"`; source scanning reports `nameConditionalBranches:0`, and the singleton has one destination, zero composition rules, and zero rank calls.
- [x] CHK-011 [P1] Runtime dependencies are Node built-ins plus frozen local libraries.
  - **Evidence**: require scanning reports `externalDependencies:0`; both CommonJS files pass `node --check`.
- [x] CHK-012 [P1] Code comments carry durable rationale only.
  - **Evidence**: the project comment-hygiene checker exits 0 for both CommonJS files; the validator's direct source scan reports `commentViolations:0`.
- [x] CHK-013 [P1] JSON artifacts are canonical and syntactically valid.
  - **Evidence**: `python3 -m json.tool` exits 0 for the fixture and frozen final manifest; the final manifest is byte-compared against frozen canonical serialization.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] External readiness is a load-bearing precondition.
  - **Evidence**: changing the committed-gate projection for the first hub to `canaryGreen:false` throws `PREFLIGHT_BLOCKED`; deletion with no issued token throws `PREFLIGHT_REQUIRED`; removing that guard lets the same deletion proceed.
- [x] CHK-021 [P1] Every skill deletes through one ordered driver and replays route-gold afterward.
  - **Evidence**: generations 5–8 retire `mcp-code-mode`, `sk-code`, `system-deep-loop`, and `mcp-tooling` in order; 2, 5, 11, and 8 rows respectively pass the real scorer after their swaps.
- [x] CHK-022 [P1] The N=1 case follows the identical compiler and deletion path.
  - **Evidence**: the committed compiler produces generation 1 hash `3ade42a8...`; deletion records the same `deleteLegacySkill` driver as every parent hub, with zero composition rules and zero rank calls.
- [x] CHK-023 [P1] Route-gold uses the committed compatibility projector and real read-only scorer.
  - **Evidence**: N=1 decisions pass `projectToRouteGold()` directly; parent rows come from committed canary projectors; all verdicts run through phase-002's write-denying `scoreRouteGoldReadOnly()` wrapper over the real `evaluateRouteGold`, with zero write attempts.
- [x] CHK-024 [P1] A corrupted observation rejects deletion and restores the retained preimage.
  - **Evidence**: the planted `corrupted-intent` observation returns `pass:false`; deletion throws `ROUTE_GOLD_RED`, performs a fenced rollback, and restores hash `c25a6322...` byte-exactly.
- [x] CHK-025 [P1] Every swap checks the complete frozen manifest preimage.
  - **Evidence**: adding a planted compatibility value while preserving the policy tuple throws `PREIMAGE_DRIFT` before rename; the atomic path repeats the byte comparison while holding the token lock.
- [x] CHK-026 [P1] Prior generations survive the complete bake window.
  - **Evidence**: four retained files remain present after all four green deletions; every retained file hash equals its prior-manifest hash, and the final rollback drill restores `34eb9f60...` byte-exactly.
- [x] CHK-027 [P1] The final manifest is frozen and drift-checked.
  - **Evidence**: generated bytes equal `compiled/final-manifest.json` at SHA-256 `062261a3...`; incrementing the generation throws `FINAL_STATE_DRIFT`.
- [x] CHK-028 [P1] The regenerated hot card carries no compatibility vocabulary array.
  - **Evidence**: `compiled/PolicyCardV1.md` byte-matches generator output and reports `postCleanupAliases:0`; planting an `aliases` property throws `HOT_CARD_ALIASES_REMAIN`.
- [x] CHK-029 [P1] Removing compatibility vocabulary does not open default-union emission.
  - **Evidence**: the final card encodes `union:[]`; zero signal produces exactly typed `defer(no-match)` with withheld authority and no targets; planting a default union throws `DEFAULT_UNION_FORBIDDEN`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Every anti-hollow guard is driven red at its real boundary.
  - **Evidence**: external-preflight failure, missing-token deletion, corrupted real-scorer observation, complete-preimage drift, final-serialization drift, retained-card vocabulary, and default-union mutations each fail with a named code.
- [x] CHK-031 [P1] The terminal state has no remaining legacy input surface.
  - **Evidence**: the frozen manifest has empty `dualReadSkillIds` and `legacyInputs`, all four skill IDs in `retiredSkillIds`, `resolver:"EffectivePolicy"`, and `soleResolver:true`.
- [x] CHK-032 [P1] Rollback is fenced and byte-exact rather than regeneration-based.
  - **Evidence**: prior bytes are fsynced before the candidate swap; rollback performs another preimage-checked fenced temp/fsync/rename and compares restored bytes directly.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] Authority stays destination-local throughout cleanup.
  - **Evidence**: the final selector names the compiled resolver, route decisions retain `WithheldUntilVerify`, negative decisions use `Withheld`, and the contract explicitly excludes reversal of committed external effects.
- [x] CHK-041 [P1] File replacement is token-locked, epoch-fenced, and preimage-checked immediately before rename.
  - **Evidence**: `atomicFleetSwap()` creates an exclusive lock, fsyncs manifest and fence temporaries, rechecks exact prior bytes under lock, advances the monotonic epoch, and renames atomically.
- [x] CHK-042 [P1] The shared scorer family remains immutable.
  - **Evidence**: before/after hashes exactly match `b039b8dd...`, `d5a9cc72...`, and `249be7c1...`; the scorer subprocess reports zero write attempts.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Cleanup decisions cite the approved synthesis rather than inventing semantics.
  - **Evidence**: `cleanup-contract.md` and `implementation-summary.md` cite §5.2, §5.3, §8.3, §9, and §10 for singleton behavior, card removal, migration, rollback, and no over-emission.
- [x] CHK-051 [P1] Known limitations state the operational boundary honestly.
  - **Evidence**: the implementation summary says this packet authors and validates the cleanup contract but deletes no live artifacts, and that routing rollback cannot undo post-COMMIT effects.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Every created or edited artifact is rooted in the designated phase folder.
  - **Evidence**: the phase contains one library, one validator, one fixture, one contract note, two compiled artifacts, Level-2 docs, and status/evidence updates to the three pre-existing contract documents.
- [x] CHK-061 [P1] No live registry, activation manifest, skill, routing config, or scorer was edited.
  - **Evidence**: the executable harness reads all upstream surfaces and writes modeled swaps only under temporary directories; protected hashes remain unchanged.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary

- [x] CHK-070 [P1] Targeted verification covers the complete requested cleanup contract.
  - **Evidence**: `node harness/validate-cleanup.cjs` exits 0 with `status:"GREEN"`, four ordered green deletions, exact rollback, final drift equality, hot-card removal, no over-emission, external preflight receipts, and protected hashes.
- [ ] CHK-071 [P1] Repository strict spec validation is green.
  - Explicit user instruction forbids `validate.sh`; this check remains intentionally unsatisfied.
<!-- /ANCHOR:summary -->
