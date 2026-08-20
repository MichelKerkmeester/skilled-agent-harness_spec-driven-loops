---
title: "Implementation Summary: Whole-System Gate"
description: "The gate is built and was run against the real system; the verdict is FAIL because all eight modes still read legacy authority, and the gate's ability to fail was proven twice against checks that were passing."
trigger_phrases:
  - "whole system gate summary"
  - "gate verdict fail"
  - "enablement receipt"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
    last_updated_at: "2026-08-20T04:13:38Z"
    last_updated_by: "claude"
    recent_action: "Ran a real fan-out; gate now verifies its artifacts"
    next_safe_action: "Recapture the suite at the current candidate and regenerate the receipt"
    blockers:
      - "8 of 8 modes read legacy_authoritative, so the gate cannot pass"
      - "Predecessor 004 unbuilt; retiring legacy writers now would stop writes"
    key_files:
      - "specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch/run-gate.mjs"
    completion_pct: 70
    open_questions:
      - "Who builds the legacy-to-cutover-ready edges, and under what evidence?"
    answered_questions:
      - "The frozen authority order contains eight modes, not the seven this phase assumed"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Whole-System Gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate |
| **Status** | Blocked |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build` |
| **Completed** | Partial — the gate is built and ran; it reports FAIL, which is a real result |
| **Lines** | 1 gate script, 2 receipts |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A gate that measures a frozen commit and writes a receipt. It resolves both SHAs by executing git rather
than accepting them as arguments, runs six enumerated checks, and writes `receipt.json` and `receipt.md`
whether it passes or fails. It changed no runtime code, no protocol document, and no authority record.

A `--break <check>` flag forces one named check to fail by making its evaluation genuinely impossible
rather than by faking its output, and stamps `forcedBreak` into the receipt so a deliberately broken run
can never be mistaken for a clean one.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Written by a dispatched executor against an inlined brief, then run and corrected by the orchestrator.
The predecessor phase's roster no longer applied: the paid models had hit a daily quota, so the free
GLM-5.2 High tier carried both dispatches. Its subagent dispatch also hit a quota and it wrote the file
directly, which changed nothing about the result.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

**The gate was run despite its predecessor being unbuilt.** Its own contract requires a receipt whether
it passes or fails and forbids an advisory tier, so a truthful failing receipt is a conforming outcome
rather than a violation — and it is the evidence the blocked decision actually needs. Running it proves
more than deferring it would.

**The fan-out was not run, and is recorded as not-run rather than skipped.** A real fan-out dispatches
external CLI subprocesses and costs model budget. The authority check had already failed, so the verdict
was determined. Recording it as `not-run` keeps the narrowing visible; the verdict logic refuses to
return PASS while any check is unrun, so this can never be read as a quiet success.

**The falsifiability runs target checks that were passing.** Breaking a check that already failed proves
nothing about the gate. Both controls were aimed at green checks.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

**Verdict: FAIL, exit 1.** Candidate `81949212b7`, baseline `8c9f0b6944`.

| Check | Status | What it found |
|-------|--------|---------------|
| `tree-clean` | pass | clean apart from the gate's own artifacts, which are named in the detail |
| `candidate-frozen` | pass | runtime tree byte-identical to the tree the suite measured |
| `authority-state` | **fail** | 8 of 8 modes read `legacy_authoritative` |
| `runtime-suite` | pass | failed 15 vs 15, passed 4188 vs 4111, skipped 39 vs 39, total 4242 vs 4165, files 188 vs 182; the 21 failure lines are byte-identical between runs |
| `reader-contracts` | pass | all 7 consumer scripts spawned; reachability only, stated as such |
| `fanout-real-run` | not-run | recorded with its reason, never counted as a pass |

**The gate can fail, and was seen to.** `--break tree-clean` and `--break candidate-frozen` each turned a
passing check red, kept exit 1, stamped `forcedBreak`, and still wrote the receipt. A clean re-run
afterwards reports `forcedBreak: null`. A gate whose failure path has never been exercised is an oracle
that cannot fail; this one is not.

**No advisory tier exists.** `computeVerdict` returns FAIL when any check failed, INCOMPLETE when any did
not run, and PASS only when neither holds — read directly rather than inferred from behaviour.

**One defect was found in the gate itself.** Its first run failed `tree-clean` because it counted its own
untracked output as tree dirt: it was reporting the instrument, not the system, and could never have
detected a genuinely dirty tree. Fixed by excluding its own output directory by repository-relative path
and saying so in the detail, so a bare "clean" is not read as stronger than it is.

**Nothing outside the gate's own output changed.** `git status --porcelain` filtered of that directory is
empty, `.opencode/` shows zero changes, and the authority root still holds only its `README.md`.
**One of the gate's own greens could not fail.** The check named `reader-contracts` reported `pass`
whenever every listed consumer spawned with a numeric exit status. Node returns a numeric status even
for a script that does not exist — measured at exit 1 for a nonexistent path — so its only declared
failure mode never occurred. It was a green for a property nothing could falsify, sitting inside a
receipt whose own contract forbids an advisory tier.

It is now `consumer-reachability`, which is all it ever proved: it fails when a listed script is
missing from disk or cannot be started, and reports those two counts separately so an operator can
tell them apart. The end-to-end contract it was named for is recorded as its own `not-run` check
beside the fan-out, so the receipt no longer implies a verification that never ran.

| Stage | `consumer-reachability` |
|-------|-------------------------|
| Real manifest of consumers | pass |
| One consumer hidden from disk | fail — `1 script(s) missing on disk; 0 script(s) could not be spawned` |
| Consumer restored, hash-identical | pass |

The gate's exclusion of its own output directory was checked rather than assumed while doing this:
`tree-clean` reported clean with the gate script modified, which is correct and deliberate — the
script lives inside the directory it measures, and the exclusion is by exact repo-relative path with
a forced-break lever proving the check can still turn red.
**The gate found real residue, which is how its cleanliness check earned its pass.** Re-run after
the suite was re-measured, `tree-clean` failed on three tracked artifacts the suite itself had
written: two graph databases and 51 appended observability events from the convergence producer.
None had ever been part of a commit. That is a genuine side effect of running the suite, not of
running the gate — confirmed by re-running the gate afterwards and finding the databases untouched.

The residue was discarded and the gate re-run from a genuinely clean tree. The distinction matters:
this check had previously passed because the artifacts happened to be clean at the time, and it has
now been shown to fail on a real event rather than only under a forced break.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**The gate cannot pass until the flip exists.** Every mode reads `legacy_authoritative` because no code
path reaches `cutover_ready` from it. This is the same blocker that stops the two preceding phases.

**The real fan-out was never exercised.** The check set is therefore narrower than the phase specifies,
which is why it is enumerated in the receipt rather than omitted from it.

**Reader contracts prove reachability, not correctness.** Spawning a consumer without its arguments shows
it can be started, nothing more. A real contract needs files projected by an enabled mode.

**The phase says seven modes; the frozen order contains eight.** The gate records the count it actually
read. The discrepancy is in the specification, not the measurement.
<!-- /ANCHOR:limitations -->
