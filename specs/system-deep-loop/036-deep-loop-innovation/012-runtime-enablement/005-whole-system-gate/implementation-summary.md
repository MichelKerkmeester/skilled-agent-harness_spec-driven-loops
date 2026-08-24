---
title: "Implementation Summary: Whole-System Gate"
description: "The gate is built and was run against the real finalized system, and it returns a literal PASS: all seven checks pass with none not-run — authority-state reads eight modes on new_authoritative_final from stored records, the reader-contracts check reads all eight cleanly through their real consumers, and the earlier forward-fix items (a pre-deletion tree pin, tree-clean DB residue, a malformed delta) are all resolved by re-measuring the suite on the finalized tree and re-pinning the gate to it."
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
    last_updated_at: "2026-08-24T08:22:20Z"
    last_updated_by: "claude"
    recent_action: "Re-measured the gate on the finalized tree; it returns a literal PASS, all forward-fixes closed"
    next_safe_action: "None; gate passes and the epic is reconciled, pending the operator ff-merge gate"
    blockers: []
    key_files:
      - "specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch/run-gate.mjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The frozen authority order contains eight modes, not the seven this phase assumed"
      - "All eight modes read new_authoritative_final from stored records; the gate authority-state check passes on the finalized tree"
      - "The fan-out did run and passed; the receipt records a real lineage with an artifact on disk"
      - "The gate turns red on demand: tree-clean, candidate-frozen, runtime-suite and reader-contracts were each proven"
      - "The stale pin, tree-clean residue and malformed delta were forward-fixes, all closed by re-measuring on the finalized tree and re-pinning the gate"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Whole-System Gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate |
| **Status** | Complete |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build` |
| **Completed** | The gate is built and returns a literal PASS on the finalized tree — all seven checks pass, none not-run; the earlier forward-fix items are all closed |
| **Lines** | 1 gate script, 2 receipts, 2 co-located suite logs |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A gate that measures a frozen commit and writes a receipt. It resolves both SHAs by executing git rather
than accepting them as arguments, runs seven enumerated checks, and writes `receipt.json` and `receipt.md`
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
reports all 8 modes on `new_authoritative_final`, epoch 3, `source: stored`, `allOnLedger: true`, exit 0 —
each read from a stored record, not the absent-record default. This is the decisive check for a gate ordered to
run after authority has moved, and it holds at the terminal tier.

The gate's most recent full receipt (`scratch/receipt.md`) records the check set at candidate `07c1bd5f22`,
the finalized tree carrying the direct-append guard forward-fix and the closeout doc corrections:

| Check | Status | What it found |
|-------|--------|---------------|
| `authority-state` | pass | 8 modes on `new_authoritative_final`; 8 from a stored record, 0 from the absent-record default |
| `candidate-frozen` | pass | runtime tree identical to the measured tree |
| `runtime-suite` | pass | failed 13 vs 19; all failures pre-existing/env by name, zero `MODULE_NOT_FOUND` |
| `consumer-reachability` | pass | all 7 scripts exist and spawned |
| `reader-contracts` | pass | all 8 modes read cleanly via their real consumers |
| `fanout-real-run` | pass | a real lineage; 1 total, 1 succeeded, artifact on disk |
| `tree-clean` | pass | clean apart from the gate's own excluded output directory |

**Verdict: PASS — all seven checks pass and none is not-run.** The three forward-fix items the earlier receipt
carried are closed: the suite was re-measured on the finalized tree and `SUITE_TREE_REF` re-pointed to it, the
test-dirtied database files were restored so `tree-clean` measures the system rather than the run's residue, and
the `reader-contracts` check now reads all eight modes cleanly (the earlier `delta_file_malformed` was in the
stale reader-contract materialization and is gone once the check runs against the finalized ledger).

**The gate script was re-pinned to the finalized tree by re-measuring, not by repointing.** `SUITE_TREE_REF` now
names the finalized candidate; the frozen ref moved only because the full suite was actually re-run on that tree
and a fresh candidate log captured, so `candidate-frozen` and `runtime-suite` describe the tree that ships. The
baseline and candidate logs were co-located into the gate's own directory so they travel with the receipt.

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
tell them apart. The end-to-end reader contract it was named for is now a real per-mode check that
reads all eight modes cleanly in the latest PASS receipt — fold → materialize → real consumer → clean
read — proven load-bearing by the `READER_CONTRACT_CORRUPT_INJECT` negative control. An earlier
`delta_file_malformed` on deep-research came from a stale materialization and is gone once the check
runs against the finalized ledger.

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

**The authority precondition is met.** All eight modes read `new_authoritative_final` from stored records, so
the ordering premise of this gate — that it runs after authority has moved — holds at the terminal tier. The
original blocker, modes reading legacy authority, is resolved.

**The check set is enumerated in the receipt rather than implied.** Every check, including the real fan-out
(now `pass`), is named in the receipt with its status, so the breadth of what ran is visible rather than assumed.

**Reader contracts prove reachability, not correctness.** Spawning a consumer without its arguments shows
it can be started, nothing more. A real contract needs files projected by an enabled mode.

**The phase says seven modes; the frozen order contains eight.** The gate records the count it actually
read. The discrepancy is in the specification, not the measurement.

**A clean whole-system PASS was reached.** The earlier receipt's FAIL came from `tree-clean` (runtime-DB suite
residue), `reader-contracts` (a stale malformed delta), and the gate being pinned to a pre-deletion tree (see
§5). All three were closed by re-measuring the suite on the finalized tree, restoring the dirtied databases, and
re-pinning the gate to the shipped candidate; the latest receipt is verdict PASS.

**Four of the gate's checks have now been shown to turn red.** `tree-clean` and `candidate-frozen`
were forced through the harness's own `--break`, which had never been used before — the field
recorded `null` on every prior receipt. `runtime-suite` was proven separately by pointing it at a
candidate log carrying more failures than its baseline: it reported `fail` at Δ+16 and returned to
`pass` at Δ-9 when the real log was restored. `consumer-reachability` was proven earlier by hiding a
consumer script. `authority-state` reads the live authority store directly and is confirmed independently by
`verify-authority.cjs` at the current HEAD.

**The gate now reads its suite numbers from logs co-located in its own directory.** The earlier receipt
depended on two hardcoded paths under a session-scoped temporary directory that did not survive the session that
produced them — a later run reported `fail: baseline log missing`. The baseline and candidate logs are now
placed beside the gate script (`join(SCRIPT_DIR, ...)`) so they travel with the receipt; a future run on a
changed tree must still re-capture the candidate log, which `candidate-frozen` exists to force.
<!-- /ANCHOR:limitations -->
