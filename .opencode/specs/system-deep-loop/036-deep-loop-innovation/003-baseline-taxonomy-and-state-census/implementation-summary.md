---
title: "Implementation Summary: baseline taxonomy and state census"
description: "Immutable BASE evidence for deep-loop taxonomy, runtime subsystems, event and persistence ownership, behavior contracts, and temporary-copy recovery."
trigger_phrases:
  - "baseline taxonomy state census implementation"
  - "deep-loop baseline evidence bundle"
  - "phase 004 census handoff"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
    last_updated_at: "2026-07-20T20:33:41Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rebuilt census from independently discovered BASE runtime evidence"
    next_safe_action: "Consume the hashed architecture handoff"
    blockers: []
    key_files:
      - "base-manifest.json"
      - "taxonomy-census.json"
      - "subsystem-census.json"
      - "event-schema-census.json"
      - "state-backend-census.json"
      - "behavior-baseline.json"
      - "phase-004-handoff-manifest.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Baseline taxonomy and state census

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-baseline-taxonomy-and-state-census |
| **Completed** | 2026-07-20 |
| **Status** | Complete |
| **Level** | 2 |
| **Immutable BASE** | `fe6ca3030917073f3b478bc044e10034dcc4394b` |
| **Declared Ref** | `origin/skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The migration now has a reproducible evidence boundary pinned to one immutable Git object. It records the 5/7/8 taxonomy, exactly eight runtime subsystem lenses, 22 event surfaces, 46 persisted-state surfaces, a 9 protected-contract / 9 known-defect ledger, the existing 53-scenario semantic corpus, and three executed additive improvement scenarios.

The recovery bundle uses 22 sanitized, serializer-shaped event fixtures plus SQLite, lock, pause, directory, loop-guard, and output fixtures. Static validation invokes shipped pure reducers and validators without creating a temporary directory. The explicit execution mode materializes the ledgers in a temporary root, exercises the shipped council round-state reader, restores two SQLite snapshots, rebuilds both databases, and recreates control surfaces without touching tracked runtime state.

### Files Changed

| File or group | Action | Purpose |
|---------------|--------|---------|
| `base-manifest.json` and `pre-existing-kebab-renames.json` | Corrected | Pin provenance, explicit `EMPTY` submodule state, source/artifact digests, router commits, and all 869 pre-existing rename rows |
| `event-schema-census.json` and `state-backend-census.json` | Rebuilt | Census 22 real event shapes and 46 persistence surfaces from BASE source; record one justified producer-only manifest and mutability on every backend |
| `contract-defect-ledger.json` and `behavior-baseline.json` | Rebuilt | Recompute the 9/9 contract-defect split, resolve every fixture reference, bind 53 semantic oracles to BASE result evidence, and capture 3 additive executions |
| `fixtures/`, `replay-rollback-manifest.json`, `validate-evidence.cjs` | Rebuilt | Provide per-stream schema/source digests, shipped reducer oracles, independent discovery, read-only static checks, and explicit temp-backed recovery checks |
| `phase-004-handoff-manifest.json` | Regenerated | Hash 24 downstream evidence artifacts with zero unresolved discovery counters |
| `IMB-006`, `IMB-007`, `IMB-008` scenario files | Corrected | Use the real archived fixture path and the shipped scenario contract vocabulary |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every source assertion is derived from the immutable BASE Git object. This includes the two runtime files concurrently edited in the working tree. The validator enumerates BASE source files itself, detects event producers, consumers, and persistence operations, then compares those discovered sets with the census. It does not accept a stored zero count as proof.

### Runtime-Faithfulness Defects Corrected

| Defect | BASE runtime evidence | Correction |
|--------|-----------------------|------------|
| Council round fields used camel case | `runtime/lib/council/round-state-jsonl.cjs` serializes `schema_version`, `event_id`, `written_at_iso`, then caller `round_id` and `topic_id` | Census and fixture now use the serialized snake-case envelope |
| Observability used mode/timestamp | `runtime/lib/deep-loop/observability-events.cjs` emits the nine-field normalized envelope | Census and fixture now require all nine real fields |
| Fan-out used lineage | `runtime/scripts/fanout-pool.cjs` emits `event`, `label`, `index`, `attempt`, and `at` | Census and fixture now use `label` |
| Three event surfaces were absent | BASE writers/readers define compiled `manifest.jsonl`, `dispatch_failure`, and `progress_record` | Added all three, bringing the event census to 19 |
| Orphan closure trusted stored counters | BASE scan found 24 producer sources, 26 reader/reducer/validator sources, and 53 persistence sources | Static validator independently discovers both sides; producer, consumer, and backend orphans are 0, as are all census-only counts |
| Discovery inferred ownership from broad directories | `compile-command-contracts.cjs` writes compiled contract files but never reads or writes `manifest.jsonl`; unrelated mode scripts likewise do not own every mode backend | Discovery now uses concrete BASE path, discriminator, persistence-operation, and read/reduce/validate signatures; source coverage no longer stores inferred per-surface ownership |
| Compiled manifest claimed nonexistent BASE readers | `render-command-contract.cjs` only appends the manifest, while `compile-command-contracts.cjs` never references it | The surface is explicitly `producer-only`, with the renderer as its sole writer and no invented reader |
| Producer-only closure lacked a factual exception rule | The command router reads generated contract Markdown directly; the manifest has no shipped BASE reader | Added an explicit provenance-only justification and a recomputed zero-unjustified-producer-only gate; the actual producer-only count remains one |
| Dispatch receipt-write failure was absent | `executor-audit.ts` appends the distinct `dispatch_receipt_write_failed` event with receipt phase and iteration | Added the schema, BASE writer/read semantics, fixture, and replay projection |
| Loop-guard persistence was absent | `dispatch-guard.cjs` owns per-session JSON, rotating warning logs, retained archives, and the `.sweep.lock` directory | Added four backend rows with lifecycle, recovery, archival reader, authority, fixtures, and mutability |
| Exhaustive event/backend scan stopped at the prior hard-coded ID set | BASE also persists `verification_degraded`, divergent-pivot lifecycle/config/artifacts, and compiled command contracts | Added two event schemas and fixtures plus divergent-pivot and compiled-contract backend rows; compiler persistence is no longer excluded from discovery |
| Council backend paths used non-runtime names | `persist-artifacts.cjs` writes `ai-council-config.json`; rollback archives below `ai-council/failed/` | Corrected both resolved backend paths |
| Fixtures used synthetic envelopes and projection | BASE serializers and exported reducers/validators define the actual shapes and projections | Rebuilt 22 fixtures with schema/source digests and shipped or source-backed semantic oracles |
| Behavior rows lacked execution evidence | Archived result artifacts exist for 26 scenarios; the alignment baseline has 27 structured BASE rows | All 53 rows now carry a semantic oracle and BASE result reference; 3 additive cells have captured runner commands, exits, results, and transcripts |
| Ledger/backend/manifest metadata was stale | BASE has no gitlinks; `render-command-contract.cjs` owns manifest append; ledger contract is binary | Recorded `EMPTY`, corrected ownership, changed the enum, and resolved every fixture reference |
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat router unification and kebab renames as pre-existing BASE | All four commits are ancestors of BASE, so calling them migration deltas would falsify the boundary |
| Use five families, seven registered modes, and eight research workstreams | The registry and research decomposition describe different layers; the improvement family maps three registered variants to one common parent |
| Freeze existing behavior by full file and parsed-contract digests | IDs alone cannot detect weakened prompts, expectations, markers, or oracle semantics |
| Add three improvement scenarios only | Existing agent-improvement evidence already covers that variant; the missing independent assertions were the common parent, model lane, and skill lane |
| Model SQLite recovery with sanitized SQL fixtures | Copying or opening live tracked databases would violate the evidence-only and temporary-copy boundaries |
| Preserve defects for later owners | This leaf classifies evidence; it does not change persistence, authority, locks, convergence, fanout, or readers and writers |
| Keep additive execution failures as evidence | The shipped harness completed with exit 0, but each OpenCode child returned a real server error and scenario exit 1; rewriting those outcomes as passes would falsify the capture |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Evidence validator, static | PASS, exit 0: 22 event surfaces; 25/27/54 discovered producer/consumer/persistence sources; all source-discovery differences 0; one justified producer-only surface and zero unjustified; 46/46 valid backend mutability values; static writes 0 |
| Fixture replay | PASS: 22 real-shape streams, 22 shipped/source-backed projections, corrupt-tail repair 1/1, crash resume 2 rows, mixed reader 2 rows |
| Rollback on temporary copies | PASS: two SQLite integrity checks, two snapshot restores, two recreates, three control-surface recreates, tracked mutations 0 |
| Additive behavior executions | CAPTURED: 3 harness exits 0; child exits 1; classifications `partial` after server errors; result/transcript digests retained without claiming semantic pass |
| Syntax and JSON validation | PASS: `node --check` and JSON parse across the evidence bundle |
| Strict packet validation | PASS, exit 0: Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

### Captured Additive Results

| Scenario | Harness exit | Scenario exit | Classification | Terminal |
|----------|--------------|---------------|----------------|----------|
| `IMB-006` | 0 | 1 | `partial` | 1,810 ms |
| `IMB-007` | 0 | 1 | `partial` | 33,818 ms |
| `IMB-008` | 0 | 1 | `partial` | 33,498 ms |

### Regenerated Artifact Hashes

| Artifact | SHA-256 |
|----------|---------|
| `event-schema-census.json` | `ba865f9286ddfabf8a9c9a1eddf96d47365f7e5dd3fab5ee3018ff68ab2d5755` |
| `state-backend-census.json` | `e35a707bc969f075e1e4fb0558a9b211f48c526a47d7d0a121e8712d54bb9441` |
| `contract-defect-ledger.json` | `a5c668ef86866237827ca0a4ac5bb7a49b83d6c58e2b2d60f7e42fc6ac3b998e` |
| `behavior-baseline.json` | `f934f5a689b9a72df63f37480381824c29761085c33ffe1771558d11cd4802c2` |
| `fixtures/event-streams.json` | `2187aca49c5ef8f50d2d5115aec98adda3451930f62391d125cb94b088a19b9d` |
| `fixtures/expected-projections.json` | `3ec6cc6ba99fbd3ed3db0e3ddc2a42f846b55f4244e2bad463303f2cf7a61531` |
| `validate-evidence.cjs` | `ec2097378f887c619d3568164ba668bfbd59184b7701b1a59f42f9e641d1950f` |
| `IMB-006` result / transcript | `5bed3a931b6e872d4a6c6229b85e64d0daa5150a2d9cf5fd05bde4a46f66b549` / `aaa90f557e989e77dcb24e1deb26d9a6c61b15660768e655be0feffc3502e55b` |
| `IMB-007` result / transcript | `9af16f3aaab0f1dfcc4d628c6c9288c0c3e137c4eb5cdd7c5e1555f20b64fe5d` / `bde4af31bb767e0eca46919fd2c10726922553c71167cd10f374fa899b573ac2` |
| `IMB-008` result / transcript | `ae0c08cadc27b931c027a788d1a66f1e4cfe6ab11f4892dcc15219104bd14fdf` / `ac84de8b621ef114b15dcd3b4be582e9d44f78cd879583454dce6ef996288f5f` |

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The three additive cells did not reach their semantic oracle.** The real child processes returned server errors. The packet records those failures literally; it does not convert environmental failure into a passing baseline.
2. **Twenty-seven existing alignment results have structured BASE table rows rather than retained result JSON.** The validator binds and hashes each exact BASE row, including the 16 explicitly deferred cells, instead of inventing artifact paths.
3. **The shipped compiled-command freshness gate has a filename mismatch.** It requests `deep_review.contract.md` while BASE stores `deep-review.contract.md`. The fixture uses the shipped manifest serializer with BASE buffers and records the mismatch as evidence; runtime code remains untouched.
4. **A documented standalone runtime test command is invalid at BASE.** `runtime/integration-points.md` names `npm test --prefix .../runtime`, but that directory has no `package.json`; the ledger preserves this as a known defect.
<!-- /ANCHOR:limitations -->
