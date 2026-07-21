---
title: "Implementation Summary: Upcasters & Dual-Read/Single-Write Adapters"
description: "Runtime evidence for deterministic event and state upcasting, legacy-authoritative dual reads, and dark-only shadow mirroring."
trigger_phrases:
  - "upcaster dual read adapter implementation"
  - "compatibility shadow runtime evidence"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
    last_updated_at: "2026-07-21T04:40:33Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive compatibility seam"
    next_safe_action: "Consume the public API from successor projection and parity leaves"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Legacy remains the only operational authority; the adapter has no legacy-write capability."
      - "Unversioned or unresolvable records remain ineligible for an effective model."
---
# Implementation Summary: Upcasters & Dual-Read/Single-Write Adapters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-upcasters-and-dual-read-adapters |
| **Implemented** | 2026-07-21 |
| **Status** | Complete |
| **Level** | 2 |
| **Candidate base** | `012652b479dee08455de574574c5e7a8971a8b0b` plus the source digests below |
| **Immutable census base** | `fe6ca3030917073f3b478bc044e10034dcc4394b` |
| **Authority posture** | Additive dark; legacy remains canonical and no authority state changes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Frozen Inputs

| Input | SHA-256 |
|-------|---------|
| Event-schema census: 22 event surfaces | `ba865f9286ddfabf8a9c9a1eddf96d47365f7e5dd3fab5ee3018ff68ab2d5755` |
| State-backend census: 46 persistence surfaces | `e35a707bc969f075e1e4fb0558a9b211f48c526a47d7d0a121e8712d54bb9441` |
| Frozen transition/versioning/rollback policy | `329ad7ad1c4f8eaedb531887b00ed29c3413fef00e7c8532941ad07f033b634d` |
| Event type registry consumed unchanged | `d66cadd11792f1a2e21ec3ddf91f25b37c8bd25aa90d1bc10e06dd564eee00b1` |
| Authorized dark-ledger adapter consumed unchanged | `0dc478f827b703c98dc9bd104a75ca2fa09177d3d18e6c6d4fc5bb164d55d2fa` |
| Replay fingerprint canonicalizer consumed unchanged | `3ce5dc322f433efaffa0495a21d699fd157fb7fb93225ab96c8d442240704790` |
| Generic atomic-state primitive consumed unchanged | `10d4de5bd466b92e2963e6cd900c66933cedb00d245546fe994719a55bda7483` |

The census remains the source of truth for stored legacy shapes, owners, fixtures, and rollback anchors. The runtime registry deliberately ships no guessed census mapping. A caller must supply at least one explicit family/type definition, canonical fixture per version, validator per version, complete adjacent chain, and explicit codec before any state record can be read through compatibility.

### Runtime Modules

| Module | Purpose | SHA-256 |
|--------|---------|---------|
| `compatibility-errors.ts` | Bounded typed fail-closed errors and diagnostic-code reduction | `fdda78d430ae190371a3172f37856ff94c7254342b72186d77c8bd60b99741c3` |
| `compatibility-types.ts` | Closed state, token, reconciliation, evidence, and gate contracts | `abc87b4a6d2ee7a5180d60be8e2f53a70866925e2c5d11283f667e979c7c4d5b` |
| `state-upcaster-registry.ts` | Fixture-backed state codecs, deterministic registry validation, complete adjacent execution, and immutable source evidence | `52374a590485ef540f3671cfb70fd096990b00a643547d24ba222a69c735104e` |
| `event-upcaster-adapter.ts` | Delegates historical events to the existing canonical envelope read boundary | `59ad2037e809efcc50a5e3c4328e602b31d84f8304d262de27f89ed9854129ad` |
| `dual-read-adapter.ts` | Legacy-authoritative dual reads, bounded reconciliation evidence, and dark-only mirroring after legacy acceptance | `07afc0280cb5cbedf39d5862bafea7ed85581f03432b9b56a76975d3b2fb4653` |
| `index.ts` | Dependency-closed public compatibility API | `b7a8cfd18c8afd6e1eeee78f78ec19da93a8affb7409a14ce3f7ca3af32817b2` |
| `compatibility-shadow-adapters.vitest.ts` | Focused adversarial contract suite | `1fd7f9432215ff6890951ac6d9a4528504b5a6f6e8043c5588083758918df5be` |

### Compatibility Manifest

The existing authorized-ledger inventory supplies eleven concrete dark boundaries without being modified or duplicated. The new API maps them by behavior rather than hard-coding inferred schemas.

| Existing boundary group | Compatibility path | Authority behavior |
|-------------------------|--------------------|--------------------|
| Research, review, alignment, and improvement JSONL | Explicit `StateRecordCodec` plus `StateUpcasterRegistry`, then `DualReadAdapter` | Existing JSONL readers/writers remain operational and authoritative |
| Atomic checkpoints and wait checkpoints | Explicit snapshot codec plus state registry | Generic serialization is never treated as a version discriminator |
| JSONL repair consumers and council round state | Explicit fixture-backed codec or canonical event reader | Reads preserve stored bytes; no repair or writeback is exposed |
| Fan-out status, observability, and verification evidence | Canonical event reader where enveloped; explicit codec otherwise | Dark results are evidence only and never replace process outcomes |

The focused corpus admits two complete compatibility families: `deep-loop.compatibility.status-recorded@1..3` through the canonical event registry and `legacy.review/iteration-state@1..3` through the state registry. Both current versions are `3`, both historical ranges have exact `1 -> 2 -> 3` chains, and repeated reads produce identical effective digests and ordered traces. Production owners remain those recorded by the census. A definition must be retained while any stored record references its range; retirement remains gated by final authority and archival-read evidence.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Pin and hash the census, transition policy, event registry, authorized ledger adapter, replay canonicalizer, and atomic-state primitive before implementation.
2. Add a dependency-closed compatibility directory and focused contract suite without changing a production barrel, existing writer, or consumed substrate/service module.
3. Delegate event reads to the existing canonical registry; require explicit fixture-backed codecs for state records; preserve legacy operational results across every dual-read outcome.
4. Accept only an already finalized legacy transition at the mirror boundary and expose only the existing authorized dark recorder, making a legacy mutation impossible through the adapter API.
5. Run the focused adversarial suite, runtime typecheck, alignment scan, comment-hygiene scan, source-hash comparison, and strict packet validator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Require owner-supplied, fixture-backed state codecs | The census contains heterogeneous and unversioned shapes; inferring a discriminator would violate the frozen fail-closed policy |
| Delegate event compatibility to the existing event-envelope registry | This preserves one canonical event upcast implementation and consumes the phase-006 contract unchanged |
| Accept an already finalized legacy transition at the mirror boundary | The user-frozen shadow contract gives this adapter zero legacy-write capability; existing writers remain outside and canonical |
| Treat dark reads, receipts, and failures as evidence only | Shadow data cannot select an operational value, authorize a side effect, or move authority |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Adversarial Property Proofs

| Property | Runtime enforcement | Focused evidence |
|----------|---------------------|------------------|
| Pure and deterministic upcasting | Frozen inputs, canonical repeated execution, mutation comparison, synchronous transforms, function digests, and target validation | Mutating and nondeterministic codecs/upcasters fail with typed errors |
| Total over admitted inputs | Every version requires a canonical fixture and validator; every historical version requires exactly one adjacent edge | Current, one-hop, and multi-hop fixtures pass; throwing fixture transforms fail startup |
| Unknown, future, gap, fork, cycle, and non-adjacent closure | Registry construction and read resolution reject incomplete graphs and unsupported versions | All malformed graph and version cases fail before an effective model exists |
| Lossless conversion and immutable identity | Every source payload field maps once to an equal output value; additions require durable provenance; family/type/identity are immutable | Lossy maps, ambiguous additions, invalid outputs, and identity changes fail closed |
| Source immutability | Exact stored bytes and digest are retained separately from frozen effective canonical bytes | Whitespace-preserving source fixture remains byte-identical after multi-hop reads |
| Legacy-authoritative reconciliation | The adapter returns the exact legacy value or rethrows the exact legacy error; dark models are never an operational return candidate | Parity, divergence, lag, miss, invalid, failure, and non-comparable rows all preserve legacy behavior |
| No read repair or reverse projection | Dual-read dependencies expose reads and normalization only; evidence contains codes and digests, not models or payloads | Gate-off performs no dark read; evidence inspection contains no secret fixture payload |
| Dark-only single write | The mirror accepts proof of an already accepted legacy result and a `Pick` of the existing authorized dark adapter; no legacy writer exists on the API | One call produces at most one recorder invocation; failures and throwing gates produce no retry and preserve object identity |
| No dark authority | Mirror preconditions accept only legacy-authoritative states and matching epochs; the function never returns a dark receipt or dark value | New-authority and epoch-mismatch fixtures perform zero dark calls; legacy result remains exact |

### Execution Results

| Check | Command | Result |
|-------|---------|--------|
| Focused Vitest | From `.opencode/skills/system-spec-kit/mcp-server`: `node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/compatibility-shadow-adapters.vitest.ts` | PASS, exit 0: 1 file, 31 tests passed |
| Runtime TypeScript | `node .opencode/skills/system-spec-kit/node_modules/typescript/bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json` | PASS, exit 0 |
| OpenCode alignment | `verify_alignment_drift.py` on the new library and focused test with `--fail-on-warn` | PASS, exit 0: 6 scanned source files, 0 findings, 0 warnings |
| Comment hygiene | Shared checker on all six runtime modules and the focused test | PASS, exit 0 for every file |
| Strict packet validation | `validate.sh <this leaf> --strict` | PASS, exit 0: 0 errors, 0 warnings |

The full runtime suite was intentionally not run. Its known baseline is approximately one hundred unrelated failures caused by unavailable `better-sqlite3` and pre-existing kebab-case fixture mismatches. The passing focused suite and typecheck support this leaf's narrow compatibility claim; they do not support a broad full-runtime no-regressions claim.

### NFR Verification

| Property | Actual | Status |
|----------|--------|--------|
| Determinism | Repeated fixture decoding and every hop must produce identical canonical bytes and traces | Pass |
| Fail-closed compatibility | Unknown, future, gap, fork, cycle, lossy, invalid, and nondeterministic cases expose no effective model | Pass |
| Authority isolation | Public adapter dependencies expose no legacy writer and dark results never become operational | Pass |
| Reversibility | Gate-off bypasses dark access; source records and existing writers remain unchanged | Pass |
| Diagnostic containment | Evidence contains bounded codes, identities, positions, and digests rather than payload copies | Pass |

### Additive-Dark and Rollback Proof

The worktree was clean at the captured baseline. This leaf adds six files under `runtime/lib/compatibility-shadow/`, one focused test, and changes only this leaf's documentation. The event-envelope, authorized-ledger, replay-fingerprint, atomic-state, existing writers, authority records, and all prior substrate/service modules remain byte-identical to the pinned hashes above. No production barrel or legacy call site changed, so the code is dark until a successor explicitly imports it.

Concurrent untracked `legacy-projections` files appeared after the clean baseline. They belong to a sibling leaf, are excluded from every command and hash in this summary, and were not read, edited, moved, or deleted by this execution.

Rollback removes the six new compatibility modules and focused test, then restores these leaf documents. Existing legacy and dark records require no conversion because no authority moved, no source record was rewritten, and no existing writer was replaced.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Concrete production codecs remain owner-supplied. This is deliberate: the frozen census includes heterogeneous and sometimes unversioned shapes, so pre-registering inferred mappings would violate the fail-closed policy.
2. Live call-site adoption belongs to successor projection/parity work. This leaf creates the dark compatibility seam without changing existing writers or making shadow output operational.
3. The full runtime-suite baseline remains outside this leaf's claim, as recorded above.
<!-- /ANCHOR:limitations -->

---

## Deviations from Plan

| Planned wording | Implemented contract | Reason |
|------------------|----------------------|--------|
| A write wrapper invokes the legacy writer and then mirrors dark | The mirror accepts proof of an already accepted legacy transition and can invoke only the existing authorized dark recorder | The execution brief explicitly forbids this adapter from writing legacy; legacy writers must remain canonical and untouched until the later authority phase |
| Attach codecs at existing persistence call sites | Ship explicit codec and registry contracts without modifying live call sites | This leaf is additive and dark; successor projection/parity work owns adoption while existing writers remain untouched |

---
