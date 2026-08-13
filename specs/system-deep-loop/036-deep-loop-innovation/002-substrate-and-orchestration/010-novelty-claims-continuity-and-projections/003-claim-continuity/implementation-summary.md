---
title: "Implementation Summary: claim continuity"
description: "Delivered and verified the additive dark claim identity, matching, lifecycle fold, replay, and resume frontier."
trigger_phrases:
  - "claim continuity implementation"
  - "claim continuity verification"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
    last_updated_at: "2026-07-21T09:49:31Z"
    last_updated_by: "codex"
    recent_action: "Added pre-append domain simulation and adversarial continuity regressions"
    next_safe_action: "Keep legacy authority until a separately scoped cutover is approved"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/claim-continuity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Claim Continuity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-claim-continuity |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Delivery mode** | Additive dark runtime; legacy remains authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Claims now keep one phase-007 typed identity while wording, sources, evidence, lifecycle, relationships, replay, and handover
change around them. The leaf records deterministic match decisions before mint or attachment, recomputes both lifecycle and
epistemic status from the verified event prefix, and refuses ambiguous work in both unsafe directions.

### Identity and matching

The runtime delegates every mint to the frozen `ContinuityIdentityService` with `ContinuityIdentityKinds.CLAIM`. Exact
namespaced aliases and fingerprints precede a canonical sibling-001 candidate set. Each decision content-addresses the policy
version, thresholds, candidates, provenance, outcome, and resolved identity. An earlier equivalent mint decision owns its
fingerprint, so concurrent discovery yields one accepted identity or an explicit conflict.

### Append-only fold and sibling relationships

The reducer retains a complete event journal and recomputes disposable state after every verified append. Before policy
authorization or append, the service folds each prepared candidate event through that same reducer against the current verified
projection; a domain rejection therefore cannot become irreversible ledger history. Corrections void an event's effect without
removing it. Evidence provenance, duplicate-source metadata, active and historical relationships, and the last epistemic result
remain visible even when lifecycle presentation becomes superseded or retracted. The registry reads the sibling-002
contradiction and supersession shapes, but this leaf adds no sibling writer.

### Replay, resume, and shadow authority

Replay content-addresses the full phase-007 identity projection as an external input. Resume revalidates the live identity
frontier, claim ledger cursor, active claim references, unresolved match IDs, registry digest, replay fingerprint, and claim
projection digest before returning state. The shadow observer always returns the original legacy object and labels comparisons
with `authority: legacy`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/claim-continuity/claim-continuity-types.ts` | Created | Closed claim, match, lifecycle, status, error, and frontier types |
| `runtime/lib/claim-continuity/claim-continuity-events.ts` | Created | Versioned event manifest and isolated dark authorization policy |
| `runtime/lib/claim-continuity/claim-matching.ts` | Created | Exact and semantic deterministic match gate |
| `runtime/lib/claim-continuity/claim-reducer.ts` | Created | Append-only lifecycle, epistemic, correction, and relationship fold |
| `runtime/lib/claim-continuity/claim-service.ts` | Created | Idempotent mint, match, observation, evidence, lifecycle, adjudication, and correction writes |
| `runtime/lib/claim-continuity/claim-replay.ts` | Created | Replay fingerprint binding to the identity projection |
| `runtime/lib/claim-continuity/claim-frontier.ts` | Created | Fail-closed resume and handover extension |
| `runtime/lib/claim-continuity/claim-shadow.ts` | Created | Non-authoritative legacy comparison |
| `runtime/lib/claim-continuity/index.ts` | Created | Public leaf API |
| `runtime/tests/unit/claim-continuity.vitest.ts` | Created | Eighteen adversarial contract fixtures |
| `003-claim-continuity/*.md` | Updated/created | Completion state, frozen values, checklist, and verifier evidence |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation landed only as new leaf runtime modules, one unit suite, and this packet's documentation. Verification ran
against the real phase-006 ledger/replay and phase-007 identity services. The path remains dark: no existing runtime import,
legacy reader, legacy writer, convergence rule, or authority transition was changed.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegate minting instead of defining a claim ID | The phase-007 service is the sole durable identity authority and already provides token idempotency and collision handling |
| Persist match decisions before mint or attach | A replay can audit the candidate set and ambiguity gate; unresolved work has no writable branch |
| Fold prepared events before authorization and append | The append-only ledger cannot recover from a domain-invalid event, so the shared service boundary rejects any candidate the replay reducer cannot accept |
| Recompute from a retained journal | Compensating corrections and incremental/full replay share one deterministic implementation |
| Keep lifecycle and epistemic status as separate fields | Terminal presentation states must not erase the evidence conclusion or its contributing events |
| Bind replay to the full identity projection | A forged, wrong-kind, missing, or newly advanced identity registry changes replay identity and blocks resume |
| Register sibling relationship read shapes without a service method | Claim continuity consumes contradiction/supersession while sibling 002 retains writer ownership |
| Return legacy results by object identity | Shadow comparison cannot accidentally become a reader or convergence authority |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline leaf Vitest | Expected FAIL, exit 1: the requested test file did not exist before implementation |
| Development Vitest | Initial 4/15 pass exposed lifecycle post-state resolution; fixed before closeout |
| Adversarial correction falsifier | Expected FAIL, 17/18 passed, exit 1: the rejected second correction advanced the ledger head from sequence 6 to 7 |
| Final leaf Vitest | PASS, 18/18 tests, exit 0 |
| Runtime TypeScript | PASS, repository TypeScript 5.9.3, `tsc --noEmit -p runtime/tsconfig.json`, exit 0 |
| Strict packet validation | PASS, errors 0, warnings 0, exit 0 |
| Comment hygiene | PASS across the changed service and test TypeScript files, exit 0 |
| OpenCode alignment drift | PASS, 9 module files, findings 0, exit 0 |

### Requirement evidence

| Requirement | Fixture evidence |
|-------------|------------------|
| REQ-001 | wrong-kind plus index/path/timestamp/hash/community substitutes reject; every stored claim ref is phase-007 `claim` |
| REQ-002 | exact retry, concurrent exact mint, competing equivalent mint, and crash-after-identity-mint fixtures |
| REQ-003 | a repeated same-namespace exact fingerprint with no semantic candidates returns `reuse`/`exact_fingerprint`, resolves the original ref, and leaves identity count at one; paraphrase replay remains deterministic |
| REQ-004 | multiple, weak, cross-namespace, and community-disagreement cases reject both remint and attachment |
| REQ-005 | transition-table and contradiction/refutation/retraction fixtures assert both axes independently |
| REQ-006 | every service candidate is reducer-simulated before append; the second correction raises typed `EVENT_CONFLICT`, leaves the head at the first correction, preserves `readState()`, and permits a new unrelated mint |
| REQ-007 | paraphrase and duplicate-source evidence stay on one claim ID with provenance |
| REQ-008 | contradiction preserves both records; supersession keeps predecessor text and gives the successor a new ID |
| REQ-009 | handover round-trip plus stale claim/identity cursor, missing, wrong-kind, and duplicate-ref failures |
| REQ-010 | relationship-bearing incremental state equals full replay byte-for-byte and by projection digest |
| REQ-011 | comparison reports divergence, returns the exact legacy object, and runtime authority remains `legacy` |

### Exact SHA-256 evidence

| Artifact | SHA-256 |
|----------|---------|
| Event contracts | `25f565421c72aaa56f81f1ffc54c2e604b4772f5de185b5d2fba1481c4885dfc` |
| Types | `9132caee972c2cf2511ce8ae5250d4d554db9f685f5566ea79c42eb79c73c7a7` |
| Frontier | `26dcef2025f5e2c472428d1159a84d51c4fd35f2c78fc18ded5bf632fbbbcd31` |
| Matching | `994db9c670252a7afe58778ddb0c876c045571e43631d18b4da91d677e8700ff` |
| Reducer | `0584b790e9e533a1fe13505dccc202e8c623a440777ad3e0d1567d4051203150` |
| Replay | `09f6e0ba1a1453cc7f90a6c4b1ea911b61c929cf25ade1c2da44e97764b28146` |
| Service | `959fa21d0636e969f04050d49c58841f9d640504ca957fa64d119261a0c1b861` |
| Shadow | `fca5ffa350117c0619571d260c6d52f57720276c630b35ac47dee129ad3f6e69` |
| Public API | `60bdbe34c88eaae99f052fe566601c2d4601be1d07477afac29b965395cf32ed` |
| Fixture corpus | `2c0d488586c9b1d10358e3437dc0dca815e0e5afcaa5fdcc32b17adfdce765f4` |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Initial event version only.** The event and reducer contract starts at v1. The registry rejects unknown versions; there is no historical claim-continuity version to upcast yet.
2. **No ambiguity resolution event.** Unresolved match records persist for audit. A future separately scoped event may resolve them, but this leaf never guesses.
3. **No authority cutover.** The runtime intentionally exposes no legacy writer replacement, convergence integration, or migration path.
4. **Shared worktree baseline is dirty.** Unrelated sibling work was already present. Verification therefore uses an explicit before/after and allowed-path status instead of claiming a repository-wide clean tree.
5. **Malformed semantic candidate recovery remains a hard error.** Converting an unregistered or malformed candidate ref into a persisted unresolved decision needs an event/reducer schema that preserves the rejected candidate evidence; filtering it would erase audit provenance, so this remains separately scoped.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Bounded incremental recomputation | Full journal recomputation after each append | One pure path makes compensating correction and incremental/full replay equivalence mechanically identical; the leaf remains a dark bounded test surface |
| Mixed historical event-version fixture | Initial v1 boundary with unknown-version rejection | No earlier claim-continuity event version exists, so manufacturing an upcast would invent a false compatibility contract |
<!-- /ANCHOR:deviations -->
