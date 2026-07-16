---
title: "Implementation Plan: Provenance-Balanced Reduction"
description: "Implementation plan for a deterministic provenance-balanced fan-in reducer with canonical deduplication, source-family fairness, retained lineage, and blinded contested-merge handling."
trigger_phrases:
  - "provenance-balanced reduction implementation plan"
  - "source-balanced fan-in implementation plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the deterministic reducer architecture and test strategy"
    next_safe_action: "Implement the versioned reducer and permutation-invariance fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Provenance-Balanced Reduction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop durable fan-out / fan-in |
| **Change class** | Reducer contract, typed provenance evidence, and deterministic replay |
| **Execution** | Additive-dark implementation in an isolated worktree pinned to the approved BASE |

### Overview
Generalize the run-2 prototype's SOL + LUNA + GLM round-robin dedup into a versioned fan-in reducer. The implementation
will validate provenance-complete leaf items, canonicalize type-specific identities, retain full contributor sets,
schedule output with hierarchical weighted fairness across source/model-family strata, and persist a receipt that
replays independently of completion order. Exact conflicts and uncertain equivalence remain explicit unless the
phase-007 blinded adjudication service returns a stable merge verdict.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The canonical result-envelope and logical-branch provenance fields are identified at their sibling contract boundaries
- [ ] The normalization, source-bucket, rational-weight, quota, and output-cap policies have explicit versions and schemas
- [ ] Exact duplicate, conflicting duplicate, uncertain equivalence, and invalid-provenance behaviors have typed outcomes
- [ ] The blinded-adjudication request/response boundary is mapped without exposing producer identity to judges
- [ ] Permutation, duplicate-flood, cloned-source, partial-survivor, resume, and salvage fixtures are specified
- [ ] Legacy fan-in authority and the additive-dark shadow boundary are identified

### Definition of Done
- [ ] Provenance-complete surviving inputs reduce into one canonical, source-balanced output with no silent loss
- [ ] One prolific or cloned source cannot consume another eligible source bucket's share or inflate effective support
- [ ] Replay over any non-semantic input ordering produces byte-identical output and receipt digests
- [ ] Contested merges fail closed and every selected, merged, deferred, conflicted, invalid, or excluded item remains traceable
- [ ] Shadow execution emits complete ledger evidence without changing legacy authority
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Input validator**: accepts only admitted result-envelope items carrying executor/model/model-family provenance, invocation fingerprint, logical branch lineage, leaf rank, evidence locators, and partial-failure disposition.
- **Canonicalizer registry**: maps each supported item type to a pinned normalizer and canonical serializer; unsupported types, missing identities, and ambiguous empty keys fail closed.
- **Dedup/conflict grouper**: groups exact canonical keys, merges compatible payloads into full contributor sets, and emits conflict sets when payloads disagree.
- **Provenance-strata builder**: assigns inputs to versioned executor/model-family balance buckets and collapses retry or cloned-branch support to the configured effective-source unit.
- **Hierarchical weighted-fair scheduler**: visits source buckets by normalized ID under rational policy weights, branches by stable logical identity, and items by leaf rank plus digest; arrival time is never consulted.
- **Contested-merge adapter**: submits content-only candidates to the blinded adjudication service and accepts only stable verdicts bound to the pinned policy and replay fingerprint.
- **Evidence emitter**: records input validation, bucket assignment, dedup groups, contributor sets, conflicts, adjudication, scheduling decisions, dispositions, and the final reduction receipt in the typed ledger.
- **Shadow adapter**: runs the reducer alongside legacy fan-in, compares observable output without granting authority, and exposes mismatch evidence for later migration phases.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the approved BASE, reducer contract version, normalization registry, balance policy, and canonical fixture corpus.
- Confirm the sibling result-envelope, branch-identity, fan-in-readiness, and partial-failure boundaries without converting adjacency into a hard planning dependency.
- Record the prototype, blinded-adjudication spec, and phase manifest as immutable design inputs.

### Phase 2: Implementation
- Implement typed provenance validation and canonical type-specific identity/serialization.
- Implement exact-key dedup with full contributor retention and explicit contradiction/conflict sets.
- Implement versioned provenance bucket assignment, per-source support caps, and hierarchical rational weighted-fair scheduling.
- Implement the blinded contested-merge adapter with stable/unstable/inconclusive outcomes and fail-closed identity-leak checks.
- Emit typed reduction events, per-item dispositions, the partial-survivor manifest, output digest, and replay-bound receipt.
- Integrate an additive-dark shadow path that cannot change legacy fan-in authority.

### Phase 3: Verification
- Prove exact dedup retains all contributor records and conflicting duplicates remain explicit.
- Prove duplicate floods and cloned branches cannot steal another source bucket's share or inflate effective support.
- Shuffle completion, input enumeration, worker, resume, and salvage order and compare canonical bytes plus receipt digests.
- Exercise stable, unstable, inconclusive, missing, and identity-leaking adjudication cases.
- Verify every selected, merged, conflicted, deferred, invalid, and excluded item has a provenance-linked disposition.
- Verify partial-fleet receipts cannot be read as full-fleet consensus and shadow execution leaves authority unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Schema and negative fixtures accept complete provenance and reject missing, malformed, unsupported, or mismatched envelope fields |
| REQ-002 | Golden canonicalization vectors cover URL/name, case, path, serialization, empty-key, and unsupported-type behavior under a pinned normalizer version |
| REQ-003 | Duplicate fixtures compare canonical output with the complete ordered contributor/support set and all original evidence locators |
| REQ-004 | Conflicting exact-key and uncertain-equivalence fixtures remain separate unless a stable blinded verdict is present |
| REQ-005 | Unequal-volume fleets show each eligible source bucket receives its weighted share before a bucket receives an extra slot |
| REQ-006 | Duplicate-flood, retry, same-model multi-branch, and cloned-source fixtures cap occupancy and effective support at the configured source unit |
| REQ-007 | A disposition completeness check accounts for every input item exactly once and links it to source provenance |
| REQ-008 | Property tests permute completion, enumeration, worker, resume, and salvage order and require identical canonical bytes and receipt digests |
| REQ-009 | Minority-source and unique-item fixtures retain valid evidence or record a quota/capacity deferral without deletion |
| REQ-010 | Partial-survivor matrices verify expected, admitted, failed, timed-out, cancelled, invalid, and excluded counts and source identities |
| REQ-011 | Ledger replay reconstructs bucket assignments, groups, conflicts, schedule, dispositions, output, and receipt without consulting wall-clock order |
| REQ-012 | Canary identity fields, self-source cases, missing probes, and unstable/inconclusive adjudication all block contested merges |
| REQ-013 | Shadow-versus-legacy integration proves reducer events are non-authoritative and rollback disables the shadow path without data migration |
| REQ-014 | Contract inspection confirms citations to the prototype, blinded-adjudication phase, and phase manifest remain present |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The planning node declares `depends_on: []` in the phase tree. Its future implementation integrates with the phase-006
typed ledger and replay fingerprint, phase-007 blinded adjudication, phase-008 compatibility/shadow bridge, and sibling
phase-009 result-envelope, logical-branch, fan-in, and partial-failure contracts. The design references
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs`,
the phase-007 blinded-adjudication spec, and
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The reducer lands additive and dark behind a versioned shadow switch. Rollback disables new reduction requests, leaves
already-emitted immutable evidence readable by reducer version, and restores the legacy fan-in path as the sole
authority. Path-scoped commits can be reverted without rewriting ledger history; no receipt is deleted or reinterpreted.
If a normalization or balance policy is defective, mint a new version and replay into a new receipt rather than mutating
the original output.
<!-- /ANCHOR:rollback -->
