---
title: "Feature Specification: Deep-Dive — Proof-Carrying Prepare/Verify/Commit"
description: "Five-iteration SOL xhigh-fast deep-research lineage on a proof-carrying route lifecycle that splits one opaque commitment into PREPARE (read-only planning that emits a short-lived RouteProofV1 binding request/policy/registry hashes, a versioned read-set, ordered targets, authority class, preconditions, expiry, and idempotency key), destination-local VERIFY (recompute digests and current authority immediately before the first side effect, returning READY/STALE_PROOF/NEEDS_INPUT/DEFER/REJECT), and a narrow COMMIT where a proof is evidence not authority, a mutating leg invalidates later prepared legs, and post-mutation recovery is destination-owned rather than a false router-level atomic rollback."
trigger_phrases:
  - "proof carrying route plan deep dive"
  - "prepare verify commit routing"
  - "route proof is not authority"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Proof-Carrying Prepare/Verify/Commit

## EXECUTIVE SUMMARY

Iteration 7 of `sol-oob` — the forced frame-break — replaced one opaque commitment with three stages borrowed from proof-carrying code, Kubernetes dry-run/optimistic-versioning, and two-phase commit. `PREPARE` emits a short-lived proof that is *evidence, not authority*; the destination `VERIFY`s it immediately before the first side effect; `COMMIT` is narrow, and a mutating leg invalidates later prepared legs. This lineage designs the machine-checkable proof and the commit boundary.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-007.md` (includes the concrete route contract) and lineage `research.md` §4.2, §11(4). Sources already gathered: Necula (proof-carrying code), Kubernetes API concepts (dry-run + 409 stale-write), PostgreSQL PREPARE TRANSACTION (the locking warning).

### Idea-specific agenda (deepen, do not survey)
1. **RouteProofV1 schema.** Finalize `{requestDigest, policyHash, registryHash, readSet[{ref,version}], targets[{modeId,role,leafResourceIds}], evidence, alternatives, authorityClass, preconditions, expiresAt, idempotencyKey}` + canonical serialization/hashing/expiry rules.
2. **Destination-local VERIFY.** Recompute digests, check policy/registry/read-set versions + target order + current scope/authority + preconditions; return `READY|STALE_PROOF|NEEDS_INPUT|DEFER|REJECT`.
3. **Commit boundary.** A proof grants no capability; the first side effect records a commit receipt and invalidates every later prepared leg; a mutating leg opens a new planning epoch. No router-owned atomic rollback across non-transactional effects.
4. **Safe speculation.** Which nominally read-only operations are safe to prepare when reads can expose sensitive context, cost money, or observe mutable external state.
5. **Concurrency edge cases.** Concurrent acceptance, time-of-check/time-of-use drift, destination disappearance, policy promotion mid-request, duplicate commit attempts; the per-hub read-set version vocabulary.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): its recommendation, scoring/fusion, mode projections, and calibration/telemetry. State what the advisor must expose or consume for the idea to work, and what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: replay determinism, typed gold, the offline oracle, and drift guards. State the new fixtures or scorer contracts it needs and whether it preserves byte-identical deterministic replay.
3. **Standalone effectiveness on documents alone** — how effective the idea is with NEITHER the advisor NOR the benchmark present: purely an AI reading the `SKILL.md` + skill docs (the INTENT_SIGNALS / RESOURCE_MAP prose, hub/mode docs) and routing by hand. Does the idea still help, degrade gracefully, or become inert at the pure-document level? This is the primary lens the operator flagged — do not skip it.

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's combined synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the proof schema, verify, commit boundary, safe speculation, and concurrency.
- Out: implementation; a shared transaction manager; re-deriving the shipped `defaultMode` answer.
