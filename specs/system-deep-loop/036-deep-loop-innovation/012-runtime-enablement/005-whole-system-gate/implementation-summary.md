---
title: "Implementation Summary: Whole-System Gate"
description: "The gate is built and was run against the real system; its decisive authority-state check now passes — all eight modes read ledger authority from stored records — so the summary's earlier legacy-authority verdict is corrected. A clean whole-system PASS is still pending on forward-fix items (the gate script is pinned to a pre-deletion tree; one reader-contract flags a malformed delta), which belong to the successor closeout."
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
    last_updated_at: "2026-08-24T05:59:15Z"
    last_updated_by: "claude"
    recent_action: "Corrected the stale legacy-authority verdict; authority-state now passes on the current system"
    next_safe_action: "Re-point the stale gate to HEAD and address the reader-contract finding in the closeout"
    blockers:
      - "The gate script is pinned to a pre-deletion tree (SUITE_TREE_REF 5511e4eac2, 10 commits behind HEAD); re-pointing is a forward-fix"
      - "reader-contracts flags deep-research delta_file_malformed — a gate finding for the forward-fix closeout"
    key_files:
      - "specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch/run-gate.mjs"
    completion_pct: 80
    open_questions:
      - "Should the gate hardcode session-scoped tmp paths for the suite logs it reads?"
    answered_questions:
      - "The frozen authority order contains eight modes, not the seven this phase assumed"
      - "All eight modes now read new_authoritative_reversible from stored records — the legacy-authority verdict is stale and corrected"
      - "The fan-out did run and passed; the receipt records a real lineage with an artifact on disk"
      - "The gate turns red on demand: tree-clean, candidate-frozen and runtime-suite were each proven"
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
| **Completed** | Partial — the gate is built and ran; its authority-state check now passes (all 8 modes on ledger), and a clean whole-system PASS is pending the forward-fix items handed to the closeout |
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

**The fan-out runs for real and passes.** A real fan-out dispatches external CLI subprocesses and costs model
budget; the latest full receipt records `fanout-real-run: pass` with a real lineage (`1787198541887-w6k53d`),
one iteration, and an artifact on disk. The verdict logic refuses PASS while any check is unrun, so a `not-run`
result can never be read as a quiet success.

**The falsifiability runs target checks that were passing.** Breaking a check that already failed proves
nothing about the gate. Both controls were aimed at green checks.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

**Authority-state passes on the current system.** `node scripts/verify-authority.cjs` at the current HEAD
reports all 8 modes on `new_authoritative_reversible`, epoch 2, `source: stored`, `allOnLedger: true`, exit 0 —
each read from a stored record, not the absent-record default. This is the decisive check for a gate ordered to
run after authority has moved, and it holds.

The gate's most recent full receipt (`scratch/receipt.md`) records the check set at candidate `f2d4d01d08`:

| Check | Status | What it found |
|-------|--------|---------------|
| `authority-state` | pass | 8 modes on `new_authoritative_reversible`; 8 from a stored record, 0 from the absent-record default |
| `candidate-frozen` | pass | runtime tree identical to the measured tree |
| `runtime-suite` | pass | failed 15 vs 19 (Δ−4); passed 4437 vs 4395 (Δ+42); files 209 vs 199 |
| `consumer-reachability` | pass | all 7 scripts exist and spawned |
| `fanout-real-run` | pass | real lineage `1787198541887-w6k53d`; 1 total, 1 succeeded, artifact on disk |
| `tree-clean` | fail | runtime-DB suite residue outside the gate's own scratch — a suite side-effect, not a system defect |
| `reader-contracts` | fail | 1 of 8 modes: deep-research `verify-iteration` reports `delta_file_malformed` on iter1 |

**Verdict: FAIL, and the two failing checks are forward-fix items, not authority regressions.** `tree-clean`
fails on the graph databases and observability JSONL the suite itself writes; `reader-contracts` flags a malformed
deep-research delta. This phase's Non-Goals hand fixing what the gate finds to the successor closeout, not to the
gate run.

**The gate script is pinned to a pre-deletion tree.** `SUITE_TREE_REF` is `5511e4eac2`, 10 commits and a
303-file / 180k-line runtime-tree diff behind HEAD after the delete-overengineering waves. A fresh full run at
HEAD would fail `candidate-frozen` and read stale suite logs from that pin alone, so re-pointing the gate to the
current candidate — and regenerating its baseline/candidate suite logs — is the forward-fix a clean whole-system
PASS now depends on.

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
tell them apart. The end-to-end reader contract it was named for is now a real per-mode check; in the
latest receipt it fails on deep-research (`delta_file_malformed`), which the successor closeout carries
as a forward-fix.

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

**The authority precondition is met.** All eight modes read `new_authoritative_reversible` from stored records,
so the ordering premise of this gate — that it runs after authority has moved — now holds. The original blocker,
modes reading legacy authority, is resolved.

**The check set is enumerated in the receipt rather than implied.** Every check, including the real fan-out
(now `pass`), is named in the receipt with its status, so the breadth of what ran is visible rather than assumed.

**Reader contracts prove reachability, not correctness.** Spawning a consumer without its arguments shows
it can be started, nothing more. A real contract needs files projected by an enabled mode.

**The phase says seven modes; the frozen order contains eight.** The gate records the count it actually
read. The discrepancy is in the specification, not the measurement.

**A clean whole-system PASS is still pending, but not on authority.** The latest receipt's FAIL comes from
`tree-clean` (runtime-DB suite residue) and `reader-contracts` (a malformed deep-research delta), and from the
gate script being pinned to a pre-deletion tree (see §5). These are forward-fix items for the successor closeout,
which this phase's Non-Goals assign there rather than to the gate run.

**Four of the gate's checks have now been shown to turn red.** `tree-clean` and `candidate-frozen`
were forced through the harness's own `--break`, which had never been used before — the field
recorded `null` on every prior receipt. `runtime-suite` was proven separately by pointing it at a
candidate log carrying more failures than its baseline: it reported `fail` at Δ+16 and returned to
`pass` at Δ-9 when the real log was restored. `consumer-reachability` was proven earlier by hiding a
consumer script. `authority-state` reads the live authority store directly and is confirmed independently by
`verify-authority.cjs` at the current HEAD.

**The gate reads its suite numbers from two hardcoded absolute paths under a session-scoped
temporary directory.** Those files are not part of the repository and do not survive the session
that produced them. A later run in a fresh session reports `fail: baseline log missing` — a defect
in the harness that would read as a defect in the system. Regenerating this receipt required
placing the current logs at those exact paths.
<!-- /ANCHOR:limitations -->
