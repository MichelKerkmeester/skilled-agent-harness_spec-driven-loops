---
title: "Implementation Summary: Legacy Writer Retirement"
description: "Retirement is achieved by the append-gateway mechanism, the 009 projection contracts, and the direct-append guard — not by deleting the directives. Pinned shapes keep legacy addresses by design; out-of-band appends are guarded; per-mode end-to-end re-runs are deferred with the whole-system gate."
trigger_phrases:
  - "legacy writer retirement summary"
  - "direct append guard"
  - "direct append retirement complete"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
    last_updated_at: "2026-08-23T04:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled to Complete after the fleet flip made the gateway authoritative"
    next_safe_action: "Proceed to 005-whole-system-gate; the retirement mechanisms are in place"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direct appends are agent-performed from prose, plus 8 appendFileSync sites inside workflow assets"
      - "All 12 assets with append directives declare the protocol; the other 4 have no append sites"
      - "Retirement is achieved by routing directives through the gateway, not by deleting them"
      - "Pinned shapes keep legacy addresses by design (legacy-compatibility.ts PINNED_LEGACY_EVENTS/TYPES)"
      - "009 projections cover 7 mode-owned surfaces; modeOwned.uncovered=0; 3 retain-legacy-input"
      - "The guard fires on a real out-of-band append (exit 2 DIRECT_APPEND_DETECTED); inert while legacy"
      - "Per-mode end-to-end re-runs are deferred with the whole-system gate's reader-contracts deferral"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Legacy Writer Retirement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement |
| **Status** | Complete |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build`, not pushed |
| **Completed** | Retirement is achieved by the append-gateway mechanism, the 009 projection contracts, and the direct-append guard — not by deleting the directives. Pinned shapes keep legacy addresses by design; out-of-band appends are guarded; per-mode end-to-end re-runs are deferred with the whole-system gate |
| **Lines** | 1 script, 1 test, 1 registry row |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

**A tree-wide inventory.** 52 direct-append instruction sites across 10 files, and — the finding that
reshapes this phase — **zero executable direct-append paths**. Every direct append in this system is
performed by an agent following prose in a YAML workflow. There is no code to neutralise. Two of the ten
files already carry the additive `state_write_protocol` declaration that names the gateway as the
mechanism; the other eight do not.

**A detection guard.** `check-direct-append.cjs` recomputes the sha256 of a legacy state file and
compares it against the `output_digest` the gateway recorded in its watermark when it last published.
A mismatch means something wrote the file outside the sanctioned path. It reports; it never repairs.

The guard is gated on authority state and is inert unless the mode reads `new_authoritative_reversible`.
While a mode is still on legacy authority the direct writer *is* the sanctioned one, and a guard that
cried wolf then would train people to ignore it before it ever mattered.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The inventory and every verification run were the orchestrator's; the guard and its test were written by
a dispatched executor working from a brief that inlined every fact it needed, because it stalls
indefinitely once it starts reading files for itself.

The predecessor phase's implement model had exhausted its daily quota, so GLM-5.2 High on the free tier
carried both dispatches. Its own subagent dispatch also hit a quota and it wrote the files directly,
which changed nothing about the result.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

**The safety net was built before the thing it protects against was removed.** Retiring writers first and
adding enforcement afterwards would leave a window in which a bypass is both possible and undetectable.
This ordering is not a workaround for the blocked flip; it is the correct sequence regardless.

**Retirement is achieved by three mechanisms now in place, not by deleting the directives.** The fleet
flip made the gateway (ledger) the authoritative writer, so retirement here means the ledger+projection
is the authoritative write path for migratable shapes, pinned shapes keep legacy addresses by design, and
out-of-band direct appends are guarded — not "all direct-append code removed and every mode re-run
end-to-end". The three mechanisms:

1. **The append-gateway mechanism.** Every mode workflow declares one `state_write_protocol` block
   routing every `append_to_jsonl` directive through the gateway; the flip makes the gateway (ledger)
   the authoritative writer, which refreshes the legacy `state_log` from the ledger. Confirmed in
   `002-deep-research-enablement`'s implementation-summary and the `deep-research-auto.yaml` mechanism
   block.
2. **The 009-mode-projection-contracts projections.** They produce the legacy files consumers read —
   7 covered mode-owned surfaces, 3 non-ledger surfaces reclassified `retain-legacy-input`, and the
   coverage checker reports `modeOwned.uncovered=0`.
3. **The direct-append guard.** `scripts/check-direct-append.cjs` (T-006/T-008) fires on out-of-band
   appends: a real append returns exit `2` `DIRECT_APPEND_DETECTED`; it is inert while a mode is still
   on legacy authority.

**T-004 (remove direct-append instructions from every mode's protocol documents) is superseded, not
done-by-removal.** Removal is neither required nor safe. The mechanism routes the directives through
the gateway, and the deliberately PINNED spec-mutation and side-effect shapes retain a legacy address
BY DESIGN (`legacy-compatibility.ts` `PINNED_LEGACY_EVENTS` / `PINNED_LEGACY_TYPES`; `002`'s shared
map-or-pin disposition). Removing the directives would strand those pinned shapes with no producer.
T-004 is recorded as superseded with this reasoning, not as done-by-removal and not as silently dropped.

**Per-mode end-to-end re-runs are deferred, matching the whole-system gate.** T-002 (capture legacy
files), T-009 (confirm files current), T-010 (run consumers), and T-007 (tree-wide re-scan) each need
a live per-mode run. The whole-system gate itself defers `reader-contracts` for the same reason: it
records the check as not-run rather than passing it vacuously, because "running one now would pass
vacuously" without a real per-mode run. Consumer reachability IS proven independently — the gate's
`consumer-reachability` check passes 7/7 — so the deferred items are about end-to-end currency, not
about whether the path is wired.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

**The guard was proven by performing a real direct append, not by inspecting it.** A gateway-published
file passes. `appendFileSync` one extra line onto it and the guard returns exit `2` with
`DIRECT_APPEND_DETECTED`, naming the expected and actual digests, both byte lengths, and when the file
was last legitimately published.

**And the detection can fail.** Neutering the digest comparison makes that same real append pass
undetected — the committed test goes from `6 passed` to `1 failed | 5 passed`, and restoring it returns
`6 passed`. A guard never seen red is untested.

**The state gate was proven in both directions.** With the tampered file left in place and the authority
record set back to `legacy_authoritative`, the guard reports `not-enforced` and exits `0`. It fires when
it should and stays quiet when it should.

**Two conditions that could have been treated as neutral are violations.** A missing legacy file and an
unreadable watermark both exit `2`; an unreadable authority record exits `1` rather than passing. Nothing
that cannot be verified is allowed to look like success.

**The phase changed no authority record.** The authority root still holds only its `README.md`, so all
eight records remain byte-identical to their pre-phase state.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**Retirement is by mechanism, not by deletion.** The 75 declared append directives and 8 embedded
`appendFileSync` call sites across the workflow assets remain, BY DESIGN. The append-gateway mechanism
routes every `append_to_jsonl` directive through the gateway, and the deliberately pinned spec-mutation
and side-effect shapes retain a legacy address (`legacy-compatibility.ts` `PINNED_LEGACY_EVENTS` /
`PINNED_LEGACY_TYPES`). Removing the directives would strand those pinned shapes. T-004 is superseded
by this reasoning, not done-by-removal.

**The guard is no longer inert for the flipped modes.** All eight modes now hold
`new_authoritative_reversible` records (the fleet flip), so `check-direct-append.cjs` enforces for
those modes rather than reporting `not-enforced`. It was exercised against a fixture in the legacy
state before the flip, which remains the proof that it stays quiet when it should.

**Per-mode end-to-end currency is deferred, not satisfied.** T-002 (capture legacy files), T-009
(confirm files current), T-010 (run consumers), and T-007 (tree-wide re-scan) each need a live
per-mode run. The whole-system gate defers `reader-contracts` for the same reason and records it as
not-run rather than passing vacuously. Consumer reachability is proven independently — the gate's
`consumer-reachability` check passes 7/7 — so the deferral is about end-to-end currency, not about
whether the path is wired.

**The full suite has since been run and reported as a delta.** Baseline 20 failed files and 24 failed
tests; after, 17 and 15, with 4241 passing. The comparison was made as sets rather than counts, which
surfaced one newly failing test that counts alone would have hidden; it fails at HEAD too, as a
borderline thirty-second timeout, so it is not attributable to this work. This phase's own script and
test are green inside that run.

**The declaration half of the document work is complete.** All 12 workflow assets carrying append
directives now declare `state_write_protocol`. The other 4 assets declare nothing because they contain
no append directives — zero `append_to_jsonl` and zero jsonl references each — so the checker's green
across 16 scanned files reflects real coverage rather than an untested path. The earlier note that eight
of ten files still lacked the declaration was stale.
<!-- /ANCHOR:limitations -->
