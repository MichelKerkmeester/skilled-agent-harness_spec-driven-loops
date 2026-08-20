---
title: "Implementation Summary: Deep-Research Enablement"
description: "The pilot's write path resolves authority from a durable record and the missing cutover-ready edge is now built; the flip is blocked on evidence rather than state, because the certificate's attestations have no production producer."
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
    last_updated_at: "2026-08-20T18:58:08Z"
    last_updated_by: "claude"
    recent_action: "Recorded the four built pieces and the two independent reasons the flip stays blocked"
    next_safe_action: "Wire reader to derivation to classification manifest to drill adapter"
    blockers:
      - "No production code constructs an effect ledger, so pendingEffects and receipts are unobservable"
      - "Deep-research cannot produce a passing certificate until effects are wired; the reader refuses rather than reporting a vacuous pass"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/inflight-state-classification/restart-classification-evidence.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/restart-observation/restart-facts-reader.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/rollback-drills/classification-drill-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/restart-classification-evidence-characterization.vitest.ts"
    completion_pct: 82
    open_questions: []
    answered_questions:
      - "The composition seam exists and had zero callers; the gateway is now its first"
      - "The missing edge is built: prepareCutover persists the readiness verdict as state"
      - "The drill never consumed classifier output; an adapter translates between them"
      - "The three missing attestations were one derivation, not three producers"
      - "An empty pending-effect list reads as a clean bill of health, so absence must refuse rather than report"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Deep-Research Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement |
| **Status** | Blocked |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build`, not pushed |
| **Completed** | Partial — the authority move is not executed |
| **Lines** | 10 files changed |
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

What was NOT built: the authority move. See KNOWN LIMITATIONS.
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

**Targeted suite.** `19/19`, vitest exit `0`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**The authority move still cannot execute, but the reason has moved twice.** It was originally a
missing state: no producer of `cutover_ready` existed outside a fixture. That edge is now built.
The blocker is now evidence, and there are two independent reasons, either of which alone is
sufficient.

*First, the evidence cannot be observed.* Effects and receipts come from an effect ledger, and no
production code constructs one — only `append-mode-event.cjs` builds ledgers, and it builds the
mode ledger and its audit ledger. The machinery ships in `receipts-and-effect-recovery` and is
unwired, so no production run has ever written an effect or a receipt. The reader refuses rather
than reporting that absence as an idle system.

*Second, and this survives fixing the first:* nothing read the manifest's verdict. That is now
fixed in the certificate builder, but it is worth recording that wiring effects would have made the
evidence truthful without making anything check it.

**The effect producer does not belong to this phase.** An effect intent carries `operation`,
`target_identity`, `adapter`, `recovery_policy` and `secret_references` — it models an external
side effect that must survive a crash without being performed twice. A ledger append is the record,
not the acted-upon world. Wrapping the append CLI would emit effect records corresponding to no
external action, each confirmed immediately, producing `receiptCoverage: true` from records
attesting to nothing. That is strictly worse than the current absence: an absence can be refused,
a fabrication cannot be told from evidence downstream. The producer belongs in whatever executes a
run and performs real external actions.

Consequently the post-flip work is also not done: the transition event, the fan-out proof, and the
non-pilot byte diff all presuppose a flip that cannot happen.

**Manifest reach is declared, not executed.** Both variants now name the gateway in one block, and
the gateway's path to the seam is proven by running it. The manifest-to-gateway link itself is
proven by declaration only, because a YAML workflow is executed by an agent, not by a test.

**A mode name denies in the next phase, and used to lie about why.** `normalizeMode` maps to
`deep-improvement`; `AUTHORITY_FLIP_MODE_ORDER` contains `deep-improvement-common`. Confirmed by
running the CLI: the mismatch surfaced as `RECORD_MALFORMED`, which would send an operator hunting
a corrupt file that never existed. The CLI now names the frozen order instead. The underlying
name mismatch is real and still belongs to the fleet phase.

**One refusal branch is untested.** The `outcome === 'denied'` path needs a record that is valid
but denied on state — `rollback_pending` is the reachable case.
<!-- /ANCHOR:limitations -->
