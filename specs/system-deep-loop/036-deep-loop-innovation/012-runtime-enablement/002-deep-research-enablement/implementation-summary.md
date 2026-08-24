---
title: "Implementation Summary: Deep-Research Enablement"
description: "The pilot's write path resolves authority from a durable record, and the flip now executes end to end on observed classification evidence; a real post-flip fan-out writes through the gateway and the guard confirms the legacy file is a pure projection."
trigger_phrases:
  - "deep-research enablement summary"
  - "pilot flip blocked"
  - "authority flip edge missing"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
    last_updated_at: "2026-08-22T19:14:28Z"
    last_updated_by: "claude"
    recent_action: "Proved the pilot flip and post-flip fan-out; reconciled the packet"
    next_safe_action: "Proceed to 003-fleet-enablement (the other seven modes)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-cutover-evidence/research-state-migrate-evidence.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-pilot-flip.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The composition seam exists and had zero callers; the gateway is now its first"
      - "The missing edge is built: prepareCutover persists the readiness verdict as state"
      - "The flip executes on classification evidence (restart facts plus a round-trip drill), never a live effect ledger"
      - "Directive rows that carry no lossless canonical form are pinned by design, not translated"
      - "Post-flip fan-out leaves write through the gateway; the legacy file is a pure projection the guard verifies"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Deep-Research Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement |
| **Status** | Complete |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build`, not pushed |
| **Completed** | The pilot flip and post-flip fan-out execute end to end on observed evidence |
| **Lines** | code and test files changed across the phase's commit chain |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The gateway no longer takes anybody's word for the mode's authority. It resolves the durable
record through `admitCanonicalWrite`, the composition root that had zero callers before this
phase, and refuses fail-closed on a denial, a malformed record, a closed admission, or an unknown
mode. The CLI resolves the same root and refuses before constructing a ledger.

`resolveAuthorityRoot` discovers the repository root rather than accepting one, because callers at
a write boundary hold per-run paths and handing one in reads as correct while giving every run its
own authority.

The protocol now names the gateway: the executor invariant, the continuity contract, the
direct-mode fallback, and the JSONL state reference. Both command manifests carry one
`state_write_protocol` block declaring the gateway as the mechanism for every `append_to_jsonl`
directive, so the mechanism is stated once instead of at forty sites where it could drift.

Since that first pass, four more pieces were added, each closing a link in the chain between
observed state and a cutover certificate.

**The promotion edge.** `prepareCutover` on the authority registry moves a record from
`legacy_authoritative` to `cutover_ready` at the same epoch, which is the one lifecycle transition
that had no writer. The epoch deliberately does not change: the flip's compare-and-swap expects
`cutover_ready` at epoch N and writes `new_authoritative_reversible` at N+1, so bumping here would
make every flip fail. The coordinator calls it best-effort before its own gate, and swallows a
compare-and-swap conflict, because a crash-resumed run may already have completed the flip.

**One home for the derivation.** The only code that builds a classification evidence record from
restart state lived in a fixtures module, reachable only from tests. It now lives in the
classification package, moved verbatim — proven by diffing both bodies after normalising four
renames, 72 lines, clean. Production and fixtures can no longer compute evidence differently while
the fixture tests stay green.

**A reader that refuses.** `observeRestartFacts` derives the five restart facts from shipped
read-only accessors, and checks each ledger's storage directory on disk before calling any read
method. A missing ledger throws rather than returning facts. This matters because
`[].every(...)` is true: an absent producer reported as an empty one yields `receiptCoverage`,
`idempotencyCoverage`, `boundedCompletion` and `verifier.verified` all true, which was confirmed by
execution. Refusing is the only answer that invents nothing — the derivation's `uncertain` state
requires a non-empty pending list, so routing absence through it would mean fabricating an effect.

**A gate that reads the manifest.** The certificate builder checked a verdict on six of its seven
evidence inputs; the classification manifest was checked only for shape and self-hash. The verdict
is not retained in the row snapshot at all, so widening it would change the manifest digest that
drills and certificates bind. It is instead reconstructed from fields the snapshot does keep —
order, identity and receipt coverage, and lease state — and a null field fails, because an
unasserted verdict must not read as a passing one.

**The flip executes.** The pilot drives a real `AuthorityFlipCoordinator.requestCutover` for
`deep-research`, assembling its classification manifest from the four real deep-research evidence
producers — config, deltas, and projections by upcast, and research-state by a MIGRATE round-trip
drill that captures a canonical checkpoint, imports it through the fenced ledger, restores the
projection, and compares original against restored per preservation flag. The flip reaches an
on-disk `new_authoritative_reversible` record at epoch N+1 with exactly one flip event. It does not
depend on a live effect ledger: the certificate's coverage is derived from restart facts and the
round-trip, so the earlier "no effect producer" blocker never gated the pilot. The preflight is
subset-scoped, so rows this mode does not fully own are deferred rather than blocking its flip.

**Directive handling is a shared map-or-pin disposition.** Legacy-shaped directive rows reach one
seam that either maps them to a canonical stem (lifecycle and research events) or pins them to the
legacy path (spec-protocol side effects that carry no lossless research-event target). Every row is
dispositioned; none falls through to an unknown-format gap. The pins are deliberate and shared by
both command variants, so no variant keeps a private write path.

**The post-flip fan-out writes through the gateway.** A real multi-leaf run on the orchestration
pool, after the flip, sends every leaf's events through the gateway into the authorized ledger, and
the legacy state file becomes a projection the direct-append guard verifies byte-for-byte against
the gateway watermark. A byte written directly to the file is caught; the guard is inert while
authority is still legacy.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The named implementation executor completed one dispatch and then its provider returned
`resource_exhausted` on a daily quota. The remaining implementation was done directly, which is a
declared deviation from the phase's dispatch plan rather than a silent substitution.

The first dispatch produced a working resolver, the fail-closed authority phase, and four tests
that passed. It was still wrong: the brief never named the CLI, so the CLI kept a hardcoded
`{ state: 'legacy_authoritative', epoch: 1 }` and fed it to both authority providers. Because the
CLI is `.cjs`, passing a removed property is silently ignored rather than erroring.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

**The authority root discovers the checkout instead of trusting a caller.** The first
implementation derived it from `runDirectory`, whose CLI alias is `--spec-folder`. That made the
mode-global root per-run — the exact forking the module's own header forbids. Discovery removes
the whole class of mistake rather than fixing one call site.

**The manifests declare the mechanism once rather than rewriting every directive.** Forty
rewritten sites cannot be verified here and would drift apart. One block cannot.

**The flip was not improvised.** Building the missing state-machine edges is designing an unbuilt
part of an irreversible transition, not fixing a defect forward.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

**The defect was proven before it was fixed.** With the repository's real authority record
deliberately corrupted, the CLI exited `0` and committed the event. After the fix the same probe
exits `2` with `{"ok":false,"phase":"authority","code":"AUTHORITY_DENIED"}` and creates `0` files
under the run directory.

**Negative controls.** Reintroducing the per-run root turns the run-root guard red (`1 failed`).
Removing the CLI refusal alone does NOT turn the malformed-record guard red, because the gateway
refuses independently; removing both layers does. That test therefore proves the outcome, not
which layer produced it, and is recorded as one property with a redundant implementation rather
than two guards.

**One guard was itself an oracle that could not fail.** The first run-root test set
`DEEP_LOOP_AUTHORITY_ROOT`, which short-circuits the default resolution it claimed to exercise; it
stayed green against a deliberately reintroduced bug. Rewritten to leave the override unset.

**Parity.** `deep-research-shadow-parity.vitest.ts` runs `49/49`, exit `0`. The clean case asserts
`exitStatus: 'green'` with empty `diffDispositions`; the same oracle with an injected `payload`
fault asserts `blocked` and `refused`. Ten fault kinds run against the ledger side and ten against
the legacy side.

**Reader contract.** Re-run against a projection regenerated by the current code: `reduce-state`,
`fanout-merge`, `fanout-salvage` and `divergent-research-pivot` exit `0`; `verify-iteration` exits
`1` with a structured `iteration_file_missing` after parsing the projection cleanly.

**The flip, end to end on real evidence.** `deep-research-pilot-flip.vitest.ts` reads the on-disk
record after a real `requestCutover`: `new_authoritative_reversible`, `epoch === fromEpoch + 1`, one
flip event appended. A denied policy leaves the record whole (`AUTHORIZATION_DENIED`, no event), and
a research-state seed perturbed to fail one MIGRATE flag makes the flip deny with the record left at
`cutover_ready` — the flip rests on observed evidence, not a fixture.

**Post-flip fan-out and the direct-append guard.** `deep-research-postflip-fanout.vitest.ts` runs
three leaves through the pool after the flip; all six events read back from the ledger in order. The
real guard returns `ok` (bytes match the gateway watermark, `cf7ce7e8…`, 780 bytes), catches a
one-byte direct append as `DIRECT_APPEND_DETECTED` (781 bytes, exit 2), accepts the trap-restored
file, and is `not-enforced` while authority is legacy.

**Authority suites, re-run from HEAD.** The six authority suites — pilot, per-mode flip, restart
characterization, MIGRATE evidence, gateway, and post-flip fan-out — pass `117/117`, vitest exit `0`.

**Targeted suite.** `19/19`, vitest exit `0`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**The pilot flip does not require a live effect ledger; the broader effect producer is a later
phase.** An effect intent carries `operation`, `target_identity`, `adapter`, `recovery_policy` and
`secret_references` — it models an external side effect that must survive a crash without being
performed twice. Wrapping the append CLI would emit effect records for no external action, each
confirmed immediately, producing `receiptCoverage: true` from records attesting to nothing — strictly
worse than absence, because an absence can be refused and a fabrication cannot. The deep-research
pilot flip sidesteps this entirely: its coverage is derived from restart facts and the research-state
round-trip, not from a live effect ledger. Wiring a real effect producer where runs perform external
actions belongs to `007-effect-enablement`, and it does not gate this phase.

**Manifest reach is declared, not executed.** Both variants name the gateway in one block, and the
gateway's path to the seam is proven by running it. The manifest-to-gateway link itself is proven by
declaration only, because a YAML workflow is executed by an agent, not by a test.

**A mode name mismatch belongs to the fleet phase.** `normalizeMode` maps to `deep-improvement`;
`AUTHORITY_FLIP_MODE_ORDER` contains `deep-improvement-common`. The CLI now names the frozen order
in its refusal instead of surfacing a misleading `RECORD_MALFORMED`. The underlying name mismatch is
real and is resolved in `003-fleet-enablement`, where that mode is flipped.

**One refusal branch is untested.** The `outcome === 'denied'` path from the authority selector
needs a record that is valid but denied on state — `rollback_pending` is the reachable case. The
pilot exercises denial through the authorization gateway (`AUTHORIZATION_DENIED`) and through a
failed MIGRATE flag, but not this selector branch.
<!-- /ANCHOR:limitations -->
