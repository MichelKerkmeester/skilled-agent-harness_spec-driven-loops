---
title: "Implementation Summary: Replay Fingerprints"
description: "Implementation and verification receipts for deterministic replay fingerprints over closed authorized-ledger ranges."
trigger_phrases:
  - "replay fingerprints implementation summary"
  - "replay fingerprint verification receipts"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
    last_updated_at: "2026-07-20T23:57:37Z"
    last_updated_by: "codex"
    recent_action: "Hardened replay-input provenance and platform-neutral fingerprints"
    next_safe_action: "Integrate the verified-result API only when downstream dark consumers are implemented"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/replay-fingerprint.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Implementation Summary: Replay Fingerprints

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|---|---|
| Packet | `system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints` |
| Status | Complete |
| Runtime surface | Shipped OpenCode/Node deep-loop TypeScript runtime |
| Delivery mode | Additive and dark; no authority transfer |
| Verified worktree base | `e2776ed165df938892840edefaab9ed301aa1392` |
| Covered test fixture | Ledger `ledger-main`, inclusive sequence range `1..3`, attestation at sequence `4` |
| Fingerprint contract | Current version `1`, SHA-256, `deep-loop.replay-fingerprint.canonical.v1` |
| Replay contract | Registered envelope/upcaster/reducer/projection identities exercised by the unit matrix |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. What Was Built

The new `runtime/lib/replay-fingerprint/` boundary contains eight additive modules:

| Module | Ownership |
|---|---|
| `replay-fingerprint-types.ts` | Descriptor, attestation, consumer result, and typed failure contracts |
| `canonical-descriptor.ts` | Explicit binary canonical serializer, validation, parsing, and SHA-256 final commitment |
| `fingerprint-version-registry.ts` | Independent positive version registry, derived serializer implementation identity, determinism/field-coverage self-probe, current writer selection, and retained historical resolution |
| `replay-component-registry.ts` | Registered reducer, projection schema, immutable content/ledger replay-input sources, and controlled reducer binding contract |
| `derive-replay-fingerprint.ts` | Streaming derivation from the authorized ledger's verified ascending reader, including source resolution and digest recomputation before reduction |
| `replay-fingerprint-attestation.ts` | Typed after-range attestation preparation, lookup, idempotency, conflict refusal, and separate bytes/metadata/digest binding diagnostics |
| `verify-replay-fingerprint.ts` | One fail-closed API shared by shadow parity and whole-system replay consumers, with component-specific authorization-linkage reporting |
| `index.ts` | Public replay-fingerprint boundary |

The descriptor commits these canonical components:

- Identity: independent `fingerprint_version`, hash/canonicalization algorithms, ledger/run IDs, inclusive range, and event count.
- Stored sequence: predecessor genesis hash, terminal head hash, ordered record hashes, streaming stored-bytes digest, and authorization-linkage digest.
- Effective sequence: envelope-registry digest, normalized observed `event_type@event_version` set, upcaster-registry digest, ordered chain/hop identities, and streaming effective-event digest.
- Replay result: reducer ID/version, projection schema version, canonical ledger-addressed configuration/artifact digests including the initial state, and projection digest.
- Final commitment: SHA-256 of the canonical descriptor with `final_digest` omitted.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. How It Was Delivered

Derivation accepts the real `AppendOnlyLedger`, calls its `readVerifiedEvents()` boundary, and folds the returned events in ascending sequence order. The existing ledger therefore remains responsible for frame hashes, chain continuity, envelope checks, and authorization linkage; the fingerprint boundary does not duplicate or weaken those checks. The existing event reader supplies preserved stored bytes plus effective events and registered chain identities.

Every non-initial replay input now has one controlled registration entry: immutable inline content or an exact event type, sequence, and payload field inside the verified range. Derivation resolves the actual value, computes its canonical digest, rejects any unequal caller claim, and passes the deep-frozen resolved values into the registered reducer binding. Reducers are contractually pure functions of verified events plus those provided values. JavaScript cannot inspect closures, so a reducer that ignores the provided values and captures other configuration is outside the controlled-registration and code-review trust boundary.

The typed `deep-loop.replay.fingerprint-recorded` attestation is appended through the existing authorized append gateway only after the closed range. Lookup keys include ledger ID, run ID, range, and fingerprint version. An identical stored descriptor is an idempotent success; any different descriptor at the same key is a typed conflict and does not append or replace data.

`verifyReplayFingerprint()` is the sole consumer seam. Its input names either `shadow-parity` or `whole-system-replay`, requires an explicit fingerprint version, reads an existing attestation, recomputes through the registered historical implementation, and returns trusted projection data only on complete equality. Failure returns exit code `1` and a bounded typed diagnostic; there is no API that mints, rewrites, or promotes an expected value while comparing.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. Key Decisions

The serializer uses a fixed root field order and four-byte big-endian length prefixes. Safe integers use an ASCII representation; strings use UTF-8; ledger and declared-registry arrays retain semantic order; replay-input maps sort by Unicode code point. The digest folds include sequence numbers and length-delimited values, preventing concatenation ambiguity. Native JSON ordering, locale comparison, filesystem discovery, host paths, PIDs, wall-clock values, random values, and mutable environment state are absent or rejected as replay inputs. The envelope registry now also orders event names by explicit code units, and child-process fixtures reverse `localeCompare` under hostile locale settings while reproducing the same envelope digest and complete fingerprint.

The repeated-derivation fixture constructs equivalent replay-input maps with different insertion order and proves equal descriptor bytes, core bytes, stored/effective/projection digests, and final digest. A separate fixture proves `final_digest` is excluded from its own commitment: changing that field changes full descriptor bytes while leaving commitment bytes unchanged. Version registration derives an implementation identity and probes repeatability, every committed core field, replay-input map ordering, and final-digest isolation; incomplete serializers fail registration. Environment/I/O purity remains a controlled extension-point review contract because runtime probes cannot prove closure capability absence.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. Verification

### Fail-closed component matrix

| Fault class | Surfaced component | Result |
|---|---|---|
| Frame mutation, deletion, insertion, reorder, gap, fork, or torn chain | `stored` | Non-zero typed failure; no reducer or trusted result |
| Authorization-linkage digest mutation | `authorization_linkage` | Non-zero typed failure at the responsible component |
| Requested range differs from attested range | `range` | Non-zero typed failure; no alternate attestation selected |
| Missing, future, or unavailable historical fingerprint version | `fingerprint_version` | Non-zero typed failure; no inference from envelope version |
| Canonicalization or final commitment drift | `canonicalization` or `final_digest` | Non-zero typed failure |
| Envelope validator/registry drift | `envelope_registry` | Non-zero typed failure |
| Observed stored type/version-set drift | `observed_event_versions` | Non-zero typed failure |
| Upcaster registry or ordered hop drift | `upcaster_registry` or `upcaster_chain` | Non-zero typed failure |
| Effective-event bytes differ | `effective` | Non-zero typed failure |
| Reducer identity/version drift | `reducer` | Non-zero typed failure |
| Projection schema drift | `projection_schema` | Non-zero typed failure |
| Missing, unaddressed, or source-mismatched replay input | `replay_input` | Derivation recomputes actual source bytes and fails before reduction or trust |
| Canonical projection bytes differ | `projection` | Non-zero typed failure |
| Missing or conflicting attestation | `attestation` | Non-zero typed failure; ledger remains unchanged |

Every failure result carries ledger ID, range, fingerprint version, responsible component, bounded expected/actual values, and the earliest deterministic sequence, hop, or stage available. Descriptor-byte, duplicated metadata, and duplicated final-digest failures use separate branches with unequal expected/actual evidence. The failure variant cannot contain a verified projection, parity result, cutover result, or whole-system gate result.

### Attestation proof

The fixture fingerprints records `1..3`, then appends the attestation at sequence `4`; its ordered record-hash list has three entries and cannot include sequence `4`. Repeating the same record operation returns idempotently with the head still at `4`. A conflicting descriptor for the same ledger/run/range/version fails, and the head remains `4`. The no-rebaseline fixture records the attestation bytes and ledger head before two mismatches and proves both remain byte-identical afterward.

### Commands and receipts

| Check | Receipt |
|---|---|
| Fingerprint unit suite | Runtime Vitest: `1` file, `38` tests passed, exit `0` |
| New adversarial coverage | `15` tests: hostile-locale process parity, provenance mismatch/unaddressed rejection, six-field ownership matrix, three attestation-binding branches, serializer self-probe identity, and legacy-authority preservation |
| Envelope + ledger + fingerprint matrix | Runtime Vitest: `3` files, `115` tests passed, exit `0` |
| TypeScript | Runtime `tsconfig.json`, `tsc --noEmit`, exit `0` |
| Alignment drift | `14` scoped envelope/fingerprint source and test files scanned, `0` findings, exit `0` |
| Comment hygiene | All `10` modified TypeScript source/test files passed, exit `0` |
| Mutation ownership | Authorization linkage, observed versions, chain identities, replay-input drift, canonicalization, and final commitment each surface their named component |
| Strict packet validation | `Errors: 0`, `Warnings: 0`, exit `0` |

Exact primary commands:

```text
(cd .opencode/skills/system-spec-kit/mcp-server && node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts ../../system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts ../../system-deep-loop/runtime/tests/unit/replay-fingerprint.vitest.ts)
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint --root .opencode/skills/system-deep-loop/runtime/tests/unit/replay-fingerprint.vitest.ts
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints --strict
```
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. Known Limitations

This leaf supplies derivation, attestation storage, and verification only. The locale-order correction is confined to the envelope registry; the ledger, authorization gateway, and shipped writers remain unchanged and runtime authority does not move. The current evidence crosses a real child process and hostile collation/locale settings on the supported OpenCode/Node runtime, but does not claim a second operating-system run. Reducer factories and fingerprint serializers remain controlled-registration extension points whose lack of hidden I/O or closure state is enforced by review in addition to runtime probes. Phase 008 and phase 016 can consume the shared API, but their policy and orchestration remain outside this leaf.

Rollback is deletion or disablement of the new replay-fingerprint boundary and its dark consumers. Existing ledger bytes and attestations remain immutable and are never rewritten during rollback or verification.
<!-- /ANCHOR:limitations -->
