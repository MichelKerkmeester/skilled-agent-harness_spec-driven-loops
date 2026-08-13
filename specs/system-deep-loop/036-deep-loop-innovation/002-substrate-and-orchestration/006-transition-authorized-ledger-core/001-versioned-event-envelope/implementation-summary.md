---
title: "Implementation Summary: Versioned Event Envelope"
description: "Canonical fourteen-field event envelope, deterministic type/version registry, current-only write preflight, and fail-closed adjacent-upcaster read boundary."
trigger_phrases:
  - "versioned event envelope implementation"
  - "event type registry implementation"
  - "adjacent upcaster verification"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
    last_updated_at: "2026-07-20T23:57:37Z"
    last_updated_by: "codex"
    recent_action: "Hardened registry digest ordering against host locale drift"
    next_safe_action: "Let the typed-ledger and authorization siblings consume the frozen preflight contracts"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The ratified policy's non-null correlation identity is enforced over the leaf's looser nullable wording"
---
# Implementation Summary: Versioned Event Envelope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-versioned-event-envelope |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Pinned BASE / branch tip** | `576a7401b1d2f8b328b7713ead428599894a03d4` |
| **Transition-policy SHA-256** | `329ad7ad1c4f8eaedb531887b00ed29c3413fef00e7c8532941ad07f033b634d` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Future spine events now have one strict wire shape and one compatibility boundary. The new runtime surface validates and canonicalizes current writes without appending them, then reads stored bytes once and exposes a current effective event only after every historical payload and adjacent upcast hop passes fail-closed validation. No legacy writer imports or calls this code.

### Module List

| Module | Purpose |
|--------|---------|
| `canonical-json.ts` | Bounded JSON validation, sorted-key serialization, immutable byte arrays, UTF-8 checks, and SHA-256 digests |
| `event-envelope-errors.ts` | Stable typed error hierarchy and machine-readable error vocabulary |
| `event-envelope.ts` | Closed fourteen-field envelope, producer contract, namespace grammar, timestamp and scalar validation |
| `event-type-registry.ts` | Deep-frozen event-type registry, validator-bound per-version schema digests, startup graph/behavior validation, immutable inspection clones, and internal-only upcaster chains |
| `event-envelope-boundary.ts` | Current-only write preflight and parse-once read/upcast boundary with stored/effective separation |
| `index.ts` | Sole public import surface for later gateway, ledger, replay, and mode consumers |
| `event-envelope-producers.ts` | Five dark producer-family fixtures copied from the pinned census shapes |
| `event-envelope.vitest.ts` | Executable positive, negative, registry, upcast, security, and sibling-handoff contract suite |

### Frozen Namespace Grammar

`event_type` is exactly `<domain>.<aggregate>.<event>`. Each of the three segments starts with a lowercase ASCII letter and continues with lowercase letters, digits, or single hyphen-delimited words. Lookup is exact and case-sensitive. Aliases are forbidden.

The executable pattern is:

```text
^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*$
```

### Frozen Error-Code Vocabulary

```text
ENVELOPE_PARSE_FAILED
ENVELOPE_UNSUPPORTED_VERSION
ENVELOPE_MISSING_FIELD
ENVELOPE_UNKNOWN_FIELD
ENVELOPE_INVALID_FIELD
PAYLOAD_MISSING_FIELD
PAYLOAD_UNKNOWN_FIELD
PAYLOAD_VALIDATION_FAILED
INPUT_LIMIT_EXCEEDED
INVALID_UNICODE
CANONICAL_SERIALIZATION_FAILED
REGISTRY_UNKNOWN_EVENT_TYPE
REGISTRY_DUPLICATE_EVENT_TYPE
REGISTRY_ALIAS_FORBIDDEN
REGISTRY_INVALID_VERSION
REGISTRY_DUPLICATE_VERSION
REGISTRY_DUPLICATE_UPCASTER
REGISTRY_UPCASTER_CYCLE
REGISTRY_UPCASTER_NON_ADJACENT
REGISTRY_UPCASTER_GAP
REGISTRY_INCOMPLETE_DEFINITION
REGISTRY_IMPURE_UPCASTER
REGISTRY_UPCASTER_MUTATES_INPUT
REGISTRY_UPCASTER_NON_DETERMINISTIC
REGISTRY_UPCASTER_PROBE_FAILED
WRITE_VERSION_NOT_CURRENT
READ_FUTURE_EVENT_VERSION
READ_UNSUPPORTED_EVENT_VERSION
UPCAST_EXECUTION_FAILED
UPCAST_NON_DETERMINISTIC
UPCAST_INVALID_OUTPUT
UPCAST_IDENTITY_MUTATION
UPCAST_LOSSY_CONVERSION
UPCAST_AMBIGUOUS_DEFAULT
```
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation remains additive and dark. The adversarial hardening replaced both registry `localeCompare` calls with an explicit code-unit total order, leaving the public envelope API, stored bytes, authorized-ledger core, legacy writers, and authority paths unchanged. A child-process fixture reverses `String.prototype.localeCompare`, sets a hostile locale environment, and still reproduces the parent registry digest and inspection order.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use sorted-key canonical JSON and immutable number-array bytes | Gateway and ledger consumers receive exact bytes without parsing producer payloads, while callers cannot mutate the returned sequence |
| Require versions `1..current` and one `N -> N+1` edge | Startup rejects every gap, cycle, duplicate, and shortcut before a reader can observe an incomplete registry |
| Require source-field maps and introduced-field provenance | Every hop proves source values survive and every derived/default field has an auditable explanation |
| Probe each upcaster at registration and retain read-time repeat checks | Registration rejects input mutation and byte-unstable output on deep-frozen inputs; the read boundary repeats execution as defense in depth |
| Keep callable upcasters outside the public registry surface | `resolve()` and `inspect()` return deep-frozen function-free clones, and the public `chain()` bypass no longer exists |
| Bind validator implementation source into schema identity | Each payload contract exposes a validator digest and schema digest, and the registry digest changes when validator semantics change |
| Order registry entries by explicit code units | Registry digest and inspection order are independent of the host's default collation and remain byte-identical when locale collation is reversed |
| Enforce non-empty `correlation_id` and nullable `causation_id` | This follows the stricter ratified transition policy when its correlation rule conflicts with the leaf's earlier nullable wording |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted runtime Vitest | PASS: 1 file, 57 tests passed, 0 failed |
| Hostile-locale child process | PASS: reversed `localeCompare` plus `LANG`/`LC_ALL=tr_TR.UTF-8` reproduced the parent inspection order and registry digest |
| Envelope + ledger + fingerprint matrix | PASS: 3 files, 115 tests passed, 0 failed |
| Runtime TypeScript typecheck | PASS: exit 0 |
| Alignment drift | PASS: 14 scoped envelope/fingerprint source and test files scanned, 0 findings, 0 warnings |
| Comment hygiene | PASS: all 10 modified TypeScript source/test files, exit 0 |
| Node syntax check | N/A: this leaf added no `.cjs` files |
| Additive-dark check | PASS: the authorized-ledger core and existing writers are unchanged; the replay-fingerprint sibling consumes the corrected digest without moving authority |
| Strict packet validation | PASS: exit 0, Errors 0, Warnings 0 |

Commands:

```bash
(cd .opencode/skills/system-spec-kit/mcp-server && node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts ../../system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts ../../system-deep-loop/runtime/tests/unit/replay-fingerprint.vitest.ts)
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-deep-loop/runtime/lib/event-envelope --root .opencode/skills/system-deep-loop/runtime/tests/fixtures/event-envelope-producers.ts --root .opencode/skills/system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope --strict
```
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark by design.** No authoritative legacy writer uses the API. The authorization gateway and typed ledger must integrate it in their own scoped leaves.
2. **Upcaster no-I/O/no-emission is a trust-boundary contract.** JavaScript cannot prove the purity of closure-captured capabilities. Registration enforces deterministic canonical output on repeated deep-frozen inputs and rejects input mutation; controlled-module review owns the remaining capability restriction.
3. **Cross-platform scope.** The determinism proof crosses a real child process and hostile collation/locale settings on the supported Node runtime; it does not claim a second operating-system execution.
<!-- /ANCHOR:limitations -->
