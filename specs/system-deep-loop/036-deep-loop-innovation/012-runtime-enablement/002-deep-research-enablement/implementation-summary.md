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
    last_updated_at: "2026-08-20T13:22:51Z"
    last_updated_by: "claude"
    recent_action: "Gave the evidence derivation one home and built the reader that refuses an absent producer"
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

**The authority move cannot execute.** `AuthorityCompareAndSwapInput.expectedState` is the literal
type `'cutover_ready'`, its only caller is the cutover coordinator, and a never-flipped mode reads
back `legacy_authoritative`. The declared machine is
`legacy_authoritative -> shadowing -> cutover_ready -> new_authoritative_reversible`; only the last
edge exists in code. Every producer of `cutover_ready` is a sandbox or a fixture. This is not the
epic's usual "landed but unwired" — it is absent, and absent by type.

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
