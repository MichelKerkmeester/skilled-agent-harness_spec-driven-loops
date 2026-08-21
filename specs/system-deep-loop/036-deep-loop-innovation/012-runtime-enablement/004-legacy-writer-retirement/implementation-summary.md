---
title: "Implementation Summary: Legacy Writer Retirement"
description: "The retirement itself is deferred because legacy is still the only authority, but its safety net is built: a tree-wide inventory found zero executable direct-append paths, and a detection guard now fires on a real append while staying inert until authority moves."
trigger_phrases:
  - "legacy writer retirement summary"
  - "direct append guard"
  - "direct append inventory"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
    last_updated_at: "2026-08-21T00:36:20Z"
    last_updated_by: "claude"
    recent_action: "Closed the owed full-suite delta and the declaration half of the document work"
    next_safe_action: "Operator decision on the missing flip transitions"
    blockers:
      - "Removing the write instruction now would leave agents no sanctioned path"
      - "No mode is on ledger authority, so the guard stays inert"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs"
    completion_pct: 60
    open_questions:
      - "May the append directives be retired before any mode holds ledger authority?"
    answered_questions:
      - "Direct appends are agent-performed from prose, plus 8 appendFileSync sites inside workflow assets"
      - "prepareCutover builds the legacy-to-cutover-ready edge; evidence comes from the reader gate"
      - "All 12 assets with append directives declare the protocol; the other 4 have no append sites"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Legacy Writer Retirement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement |
| **Status** | Blocked |
| **Completed** | Partial — the safety net is built and proven; the retirement is not performed |
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

**Nothing was removed, and that is recorded rather than quietly skipped.** The executable half of the
retirement is vacuous — there was never any code. The document half is deferred, because deleting the
only sanctioned write instruction while the gateway is not yet authoritative would stop writes entirely.
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

**The retirement did not happen.** 52 instruction sites remain by design. They can be removed once the
gateway is authoritative, and not before.

**The guard is inert in this repository today.** No mode reads `new_authoritative_reversible`, so it will
report `not-enforced` for every mode until the flip exists. It has been exercised against a fixture in
that state, which is the only way to exercise it at all right now.

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
