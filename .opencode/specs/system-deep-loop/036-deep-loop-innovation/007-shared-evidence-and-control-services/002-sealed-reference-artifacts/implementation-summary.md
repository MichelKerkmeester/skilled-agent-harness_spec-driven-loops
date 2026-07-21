---
title: "Implementation Summary: Sealed Reference Artifacts"
description: "Delivered and verified the additive-dark, content-addressed artifact store, evidence boundary, replay binding, parity gate, and conservative retention service."
trigger_phrases:
  - "sealed reference artifacts implementation"
  - "sealed artifact verification evidence"
  - "deep-loop artifact retention implementation"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
    last_updated_at: "2026-07-21T00:32:18Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified sealed reference artifacts on the dark runtime path"
    next_safe_action: "Let later dark replay and parity consumers adopt the exported contract"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/sealed-reference-artifacts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The initial registry uses SHA-256 and deep-loop-json@1 for four JSON artifact kinds."
---
# Implementation Summary: Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-sealed-reference-artifacts |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Candidate baseline** | `d1a3f0323c3635f24c3560feaeda839522ececf0` |
| **Scoped runtime/test tree** | `sha256:6826b361ae3e9d60118e0be05709a6b576e39e7fb6f013c36c26877b6e136303` |
| **Identity versions** | descriptor `1`; reference `1`; tombstone `1`; canonicalization `deep-loop-json@1`; digest `sha256` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The dark runtime can now freeze exact JSON reference inputs behind algorithm-qualified digests, verify every byte before
release, bind the ordered verified set into replay and parity evidence, and retain or delete objects only from typed
ledger history. The service exports validation and derivation boundaries without registering itself in a legacy writer
or moving runtime authority.

### Modules

| Module | Contract |
|--------|----------|
| `sealed-artifact-types.ts` | Closed versions, four initial kinds, immutable identities, and typed fail-closed errors |
| `artifact-registries.ts` | Frozen canonicalizer and digest registries with deterministic JSON normalization and bounded output |
| `sealed-artifact-store.ts` | Streamed verified reads, staged publication, immutable paths, quarantine, tombstones, and exact restoration |
| `artifact-events.ts` | Exact event validators plus gateway-authorized creation and lifecycle ledger writes |
| `artifact-reference-set.ts` | Ordered verified-set commitments, phase-006 replay input, and parity input-equivalence gate |
| `artifact-retention.ts` | Verified-ledger lifecycle reduction, conservative mark-and-sweep, authorized deletion, and restoration |
| `index.ts` | Public exports for later dark consumers |
| `sealed-reference-artifacts.vitest.ts` | Focused executable contract with 45 tests |

### Contract Proofs

| Contract | Evidence |
|----------|----------|
| Deterministic identity | Four initial kinds normalize key order, CRLF line endings, and Unicode to identical canonical bytes and digests |
| Atomic immutability | Four injected crash boundaries publish no reference; duplicates are idempotent; a forced collision quarantines the identity |
| Exact reference and read | Mutable-only shapes and unsupported identities fail; seven corruption variants and four per-kind rows release no bytes |
| Authorized durable evidence | Creation, deletion, and restoration lifecycle events pass through `TransitionAuthorizationGateway` before ledger append |
| Replay and parity | Ordered references, descriptor commitments, verification state, and creation receipts bind the replay input; differing sets stop parity |
| Conservative retention | Incomplete discovery and all six protected-root types retain; one fully eligible object emits a receipt-bound tombstone |
| Restoration | Only canonical bytes reproducing the original reference and descriptor restore under the deleted digest |
| Additive-dark authority | The new service and test are unregistered additions; legacy paths, existing writers, and the consumed phase-006 substrate are unchanged |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation consumes the existing canonical event boundary, typed authorized ledger, single-use gateway allow,
and replay fingerprint registry directly. It does not redefine those contracts. The filesystem store owns separate
blob, descriptor, reference, quarantine, and tombstone paths under one canonical root; path escape and symbolic-link
boundaries fail before publication. Lifecycle state remains append-only ledger evidence, while immutable content and
identity metadata never become mutable state.

The focused fixture corpus contains four artifact kinds, four crash boundaries, seven named corruption cases plus four
per-kind negative/corruption/version rows, six protected-root classes, seven retained discovery outcomes, one eligible
deletion, and one byte-identical restoration path.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Register SHA-256 as `sha256` | The existing event substrate already provides deterministic SHA-256 commitments, while the qualified registry preserves algorithm agility |
| Register `deep-loop-json@1` for the initial four kinds | Current reference inputs are structured JSON; rejecting bytes, archives, and unknown profiles removes ambiguous decoding and decompression surfaces |
| Publish the reference last | Blob and descriptor remnants from a crash remain unreachable until persisted bytes verify and the exact reference appears |
| Require verified creation ledger evidence before set binding | A locally sealed object alone cannot become trusted replay, parity, receipt, or certificate evidence |
| Prefer retention on every uncertainty | Historical replay loss is irreversible; incomplete discovery, active roots, holds, or missing eligibility therefore delete nothing |
| Keep integration export-only | Phase 014 owns authority cutover, so this leaf must not register a legacy writer or redirect an existing reader |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused leaf Vitest | PASS, exit 0: 1 file and 45 tests passed |
| Consumed-substrate baseline | PASS, exit 0 before implementation: 3 files and 115 tests passed |
| Full runtime TypeScript | PASS, exit 0: `tsc --noEmit -p tsconfig.json` |
| OpenCode alignment | PASS: 7 source files scanned, 0 errors, 0 warnings, 0 violations |
| Comment hygiene | PASS: 8 new TypeScript files, 0 violations |
| Additive-dark scope | PASS: scoped status contains only new runtime files and this leaf's docs; consumed substrate paths report no changes |
| Strict packet validation | PASS, exit 0 with 0 errors and 0 warnings |

The repository-wide Vitest suite was not used as this leaf's gate. Its known baseline has roughly 100 unrelated
failures from the missing `better-sqlite3` dependency and kebab-case test-fixture filename mismatches; the phase-016
gate owns that baseline. The focused leaf suite is green and no baseline fix was attempted here.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Initial kinds are JSON-only.** Prompt sets, fixtures, prior-run outputs, and configuration ship now. Later kinds
   need explicit registered canonicalization profiles and cannot fall back to this profile implicitly.
2. **The service is intentionally dark.** No legacy reader or writer calls it yet. Later replay and parity phases must
   adopt the exported contract before it affects runtime behavior.
3. **Retention discovery is caller-declared.** Sweep accepts only a complete-scan assertion and verified lifecycle
   evidence; uncertainty retains the candidate. Later consumers own their complete root enumeration.
<!-- /ANCHOR:limitations -->
