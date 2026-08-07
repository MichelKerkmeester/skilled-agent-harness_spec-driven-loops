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
    last_updated_at: "2026-07-21T01:33:45Z"
    last_updated_by: "codex"
    recent_action: "Hardened digest authority, returned bytes, and replay resolution"
    next_safe_action: "Track ordered-digest durability in the replay-fingerprint follow-up"
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
| **Original pre-hardening baseline** | `d1a3f0323c3635f24c3560feaeda839522ececf0` |
| **Original scoped runtime/test tree** | `sha256:6826b361ae3e9d60118e0be05709a6b576e39e7fb6f013c36c26877b6e136303` |
| **Identity versions** | descriptor `1`; reference `1`; tombstone `1`; canonicalization `deep-loop-json@1`; digest `sha256` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The dark runtime now fixes SHA-256 over exact canonical JSON inputs, verifies every byte before release as a frozen
copy, resolves each ordered reference again before replay input, and retains or deletes objects only from typed
ledger history. The service exports validation and derivation boundaries without registering itself in a legacy writer
or moving runtime authority.

### Modules

| Module | Contract |
|--------|----------|
| `sealed-artifact-types.ts` | Closed versions, four initial kinds, immutable identities, and typed fail-closed errors |
| `artifact-registries.ts` | Deterministic JSON canonicalizers plus fixed SHA-256 metadata that rejects caller digest implementations |
| `sealed-artifact-store.ts` | Streamed verified reads, staged publish-once paths, frozen returned bytes, quarantine, tombstones, and exact restoration |
| `artifact-events.ts` | Exact event validators plus gateway-authorized creation and lifecycle ledger writes |
| `artifact-reference-set.ts` | Store-and-ledger resolution of ordered sets before digest-only replay input and parity gating |
| `artifact-retention.ts` | Verified-ledger lifecycle reduction, conservative mark-and-sweep, authorized deletion, and restoration |
| `index.ts` | Public exports for later dark consumers |
| `sealed-reference-artifacts.vitest.ts` | Focused executable contract with 50 tests |

### Contract Proofs

| Contract | Evidence |
|----------|----------|
| Deterministic identity | Four initial kinds normalize key order, CRLF line endings, and Unicode to identical canonical bytes and digests |
| Fixed identity and publish-once behavior | SHA-256 is computed inside seal/read, caller digest code is rejected, four crash boundaries publish no reference, and a conflicting stored object is quarantined |
| Exact reference and read | Mutable-only shapes and unsupported identities fail; corruption releases no bytes; successful reads return frozen digest-pinned copies |
| Authorized durable evidence | Creation, deletion, and restoration lifecycle events pass through `TransitionAuthorizationGateway` before ledger append |
| Replay and parity | Every reference is fetched and rehashed and every ledger field is resolved before ordered digests become replay input; missing, substituted, or forged sets fail closed |
| Conservative retention | Incomplete discovery and all six protected-root types retain; one fully eligible object emits a receipt-bound tombstone |
| Restoration | Only canonical bytes reproducing the original reference and descriptor restore under the deleted digest |
| Additive-dark authority | The new service and test are unregistered additions; legacy paths, existing writers, and the consumed phase-006 substrate are unchanged |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation consumes the existing canonical event boundary, typed authorized ledger, single-use gateway allow,
and replay fingerprint registry directly. It does not redefine those contracts. The filesystem store owns separate
blob, descriptor, reference, quarantine, and tombstone paths under one canonical root; path escape and symbolic-link
boundaries fail before publication. The service never overwrites published identities, returns frozen verified byte
copies, and detects out-of-band storage mutation before a consumer or replay adapter can trust it.

The focused fixture corpus contains four artifact kinds, four crash boundaries, seven named corruption cases plus four
per-kind negative/corruption/version rows, six protected-root classes, seven retained discovery outcomes, one eligible
deletion, and one byte-identical restoration path.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix SHA-256 as `sha256` inside seal and read | Integrity cannot depend on caller-provided executable code or claimed digest values; unsupported algorithms fail closed |
| Register `deep-loop-json@1` for the initial four kinds | Current reference inputs are structured JSON; rejecting bytes, archives, and unknown profiles removes ambiguous decoding and decompression surfaces |
| Publish the reference last | Blob and descriptor remnants from a crash remain unreachable until persisted bytes verify and the exact reference appears |
| Re-resolve set entries before replay input | A bound object can become stale or forged; replay therefore fetches bytes, recomputes SHA-256, and matches authorized ledger fields again |
| Prefer retention on every uncertainty | Historical replay loss is irreversible; incomplete discovery, active roots, holds, or missing eligibility therefore delete nothing |
| Keep integration export-only | Phase 014 owns authority cutover, so this leaf must not register a legacy writer or redirect an existing reader |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused leaf Vitest | PASS, exit 0: 1 file and 50 tests passed |
| Consumed-substrate baseline | PASS, exit 0 before implementation: 3 files and 115 tests passed |
| Full runtime TypeScript | PASS, exit 0: `tsc --noEmit -p tsconfig.json` |
| OpenCode alignment | PASS: 7 source files scanned, 0 errors, 0 warnings, 0 violations |
| Comment hygiene | PASS: 8 new TypeScript files, 0 violations |
| Additive-dark scope | PASS: path-scoped diff contains only the sealed-artifact service, focused test, and leaf docs; consumed substrate and replay-fingerprint report no changes |
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
4. **Replay-fingerprint durable evidence retains only the composite replay-input hash.** This leaf now supplies an
   ordered list of resolved content and descriptor digests to the replay source, but persisting that ordered list beside
   the composite hash belongs to the replay-fingerprint module and remains a required follow-up dependency.
<!-- /ANCHOR:limitations -->
