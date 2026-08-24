---
title: "Implementation Summary: Fleet Enablement"
description: "The serial enablement driver, its CLI, and their tests are built and independently verified; the fleet flip was executed via the operator-chosen registry-direct path, and all eight authority modes now hold durable new_authoritative_reversible records on disk."
trigger_phrases:
  - "fleet enablement summary"
  - "enablement driver built"
  - "fleet flip complete"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
    last_updated_at: "2026-08-24T08:00:07Z"
    last_updated_by: "claude"
    recent_action: "Reconciled to Complete after the registry-direct fleet flip"
    next_safe_action: "Proceed to 005-whole-system-gate; the fleet flip is done"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/mode-surface-map.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/restart-observation/restart-facts-reader.ts"
      - "scratch/false-completion-proven.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The legacy-to-cutover-ready edge is built, as prepareCutover on the registry"
      - "The gap in the step is unwritten code, not a blocked precondition"
      - "A gate that cannot go green is as untested as one that cannot go red"
      - "The fleet flip used the registry-direct path (flip-authority.cjs --commit), not the coordinator"
      - "All 8 modes hold new_authoritative_reversible records at epoch 2, selectedWriter dark"
      - "deep-improvement-common's authority record exists and flipped"
      - "T-005 superseded by the registry-direct path; coordinator stays the proven pilot in 002"
      - "T-011/T-012 deferred, matching the whole-system gate's reader-contracts deferral"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Fleet Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement |
| **Status** | Complete |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build`, not pushed |
| **Completed** | The driver, CLI and tests are built and proven; the fleet flip was executed via the operator-chosen registry-direct path and all eight authority modes hold durable `new_authoritative_reversible` records on disk |
| **Lines** | 6 files added or changed |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

**A mode-to-surface derivation.** The projection manifest is shared across every flip mode and
carries no mode field, so attribution runs through a prefix-ownership table kept in one place next
to the frozen mode order. It reports two couplings that would otherwise be invisible:
`skill-benchmark`'s only surface is retain-legacy-input, so its projectable set is empty and a
reader contract over it would pass without checking anything; and the two improvement modes share
the `improvement-` prefix, so a per-mode contract cannot separate their surfaces.

**A serial driver with external state.** It walks the frozen order, awaits one mode at a time,
rewrites its state file after every success, stops at the first failure naming both the mode and
the failing check, and never invokes a later mode. A prior state file's completed modes become
skipped modes. A corrupt or mis-shaped state file throws rather than reading as "nothing done" —
resetting to zero would re-run modes whose authority had already moved.

**A CLI.** `--dry-run` reports the plan and every mode's derived surfaces without constructing the
registry at all. A real run performs the checks the runtime can actually perform and refuses the
flip on the read path, so a failed step reaches no compare-and-swap. Resuming is an explicit
`--resume`: a state file that already exists means an earlier run stopped part-way, and continuing
by default would let an operator miss that a failure ever happened.

**An evidence gate in front of the flip check.** The step now observes classification evidence
before it looks at authority state, and fails closed on four distinct conditions. The order matters:
reporting a state mismatch first was misleading once a promotion path existed, because it named a
condition that might not even be the obstacle.

Three of the four are refusals raised by the reader. A ledger directory that does not exist refuses,
because an absent producer read as an empty one makes `every()` over an empty list report full
coverage. A directory that exists but holds no effect events refuses, because directory existence is
not evidence — that guard was passed with `mkdir`, and a mode was recorded enabled on two empty
directories with its authority record byte-identical either side. A confirmation whose effect id
never appeared in an intent refuses, because a receipt for an unrecorded effect leaves the pending
list empty and produces a verified verdict from a history that is missing its own beginning.

The fourth is enforcement rather than refusal. The classification manifest was previously built and
discarded, so the gate collapsed to whether reading threw: a run whose derived verdict was
`verified: false` still passed. The manifest's verdict is now read per row, and any row whose order,
identity or receipt coverage is not true, or whose lease state is null or uncertain, fails the step
naming the row and the field. A null field fails, because an unasserted verdict must not read as a
passing one.

The ledger ports are constructed lazily, after both existence checks. Constructing an
`AppendOnlyLedger` creates its storage directory — including on a construction that throws part-way
— so an eagerly built port would answer the question by changing the answer.

**The gate that could not go green.** Enforcing the verdict introduced the mirror image of the
defect it was built to close. The observation passed a hardcoded `null` continuity id, and identity
coverage is derived as `continuityId !== null`, so every row failed identity coverage before any
evidence was consulted. Every refusal above was therefore unreachable: no input could get past the
first field, and a gate that no input can pass proves nothing about the inputs it claims to
discriminate. The run's continuity identity is now an operator-supplied argument, required for a
non-dry run and refused up front when absent, because a fabricated lineage id would assert a
continuity nobody established — the same class of defect as a receipt with no intent. A test now
drives matched intent-and-confirmation evidence with a supplied identity all the way past the gate,
so the passing direction is exercised and not merely assumed.

**An empty row set asserts nothing.** The per-row loop shared the weakness that motivated the
reader's refusals: with no rows, every row's verdict passes. An empty classification row set is now
rejected by name, so an empty census cannot satisfy a step that would go on to move authority
without having looked at evidence at all.

The census is an explicit argument rather than a path resolved from the script's own location. The
previous resolution reached the file only through a symlink, and embedded folder numbers that this
repository does renumber.

What was NOT built into the driver: the flip call itself. The per-mode step runs the reader-contract
and flip checks and refuses with the on-disk state named, but it contains no write path. The fleet
flip was instead executed out-of-band via the operator-chosen registry-direct path (see §4 and §6),
not by composing the per-mode coordinator step inside this driver.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Every code file was written by a dispatched executor, never by hand. The executor stalls
indefinitely once a multi-round file-read loop starts, so each brief inlines every fact it needs
and forbids the read tools outright. Four dispatches, four clean returns, no stalls: the surface
map, the driver, the CLI with its barrel and a state-validation fix, then the argument-shape fix,
then the two test files.

The division held because the orchestrator did the reading and the proving. Both defects below
were found by running the delivered code, not by reviewing it.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

**The per-mode step refuses rather than pretends.** The pilot's procedure ends in a flip that no
mode can perform. Writing the flip call anyway would add a branch no test could reach — code
claiming a capability the system does not have. The step instead reports the state on disk and the
state the compare-and-swap requires, which turns the blocker into a fact an operator can act on.

**A dry run constructs nothing.** The registry constructor creates its directory, so a dry run that
built one would leave a trace. The dry-run path returns before any of that, and a test asserts the
directory still does not exist afterwards.

**Assertions are against the filesystem, not the report.** The CLI's whole safety story is that a
dry run changes nothing and a failed step leaves authority as it found it. Tests that only read the
CLI's own JSON would be trusting the thing under test, so they assert the absence of the state file
and the absence of any authority record.

**The fleet flip took the registry-direct path, not the coordinator path.** When the flip decision
was escalated, the operator was offered two paths: call the registry directly through
`scripts/flip-authority.cjs --commit`, or compose `AuthorityFlipCoordinator.requestCutover` with a
deny-capable policy and a flip event. The operator chose registry-direct. That path calls
`registry.prepareCutover` (moving `legacy_authoritative` to `cutover_ready` at the same epoch) and
then writes `new_authoritative_reversible` at epoch+1 with `selectedWriter` `dark`, verifying the
post-flip record. It does not route through `AuthorityFlipCoordinator.requestCutover`. This is
recorded as the decision that closed the phase, not as a gap: the coordinator mechanism remains the
PROVEN PILOT mechanism in `002-deep-research-enablement`, and was not the path taken for the fleet.
The per-mode coordinator step inside this driver (T-005) is therefore superseded by this path
choice, not done-by-composition and not silently dropped.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

**Two defects were proven before they were fixed.** As delivered, `--state --dry-run` parsed the
missing value as the boolean `true` and used it as a filesystem path — Node's own
`DeprecationWarning: Passing invalid argument types to fs.existsSync` is the receipt — and exited
`0` reporting a successful dry run. Worse, `--dry-run <path> --state <path>` let the flag swallow
the following token, so the string compared unequal to `true` and a request that said "change
nothing" executed a real run and wrote its state file. Both now exit `1` before any work. The
recorded before-and-after is the negative control for this pair.

**An adversarial review found what the tests could not.** With 38 tests green and twelve guards
already proven, a second executor was given the complete code and one instruction: refute. It found
that a resumed run erased the earlier run's progress — `save` persisted only the current call's
completions, and the prior run's sat in `skippedModes`, never written back. Reproduced against the
driver's own API before the fix: run A wrote `["deep-review"]`, run B resumed and the file read
`["deep-ai-council"]`, and a third run re-planned `deep-review` — a mode whose authority had
already moved, queued to move again, with no rollback window. Both the test suite and the
orchestrator's own probe had missed it for the same reason: each asserted the in-memory result of a
resumed run and never read back what that run wrote. Two further defects came out of the same pass:
one unreadable authority record aborted the whole run instead of stopping cleanly at that mode, and
the state file was overwritten in place, so a torn write left it unresumable. All three are fixed,
and the first two now have tests that go red when the fix is reverted.

**Fourteen guards, fourteen reds.** Each guard was removed, the suite re-run, and the guard restored;
all three control scripts are kept in `scratch/` and assert that their own edit applied, so a stale
pattern fails loudly rather than reporting an unperturbed green. In twelve of the fourteen the blast
radius was one to three tests, which is the second half of the evidence: the suite discriminates
between guards rather than collapsing whenever anything is disturbed. Details in
`scratch/negative-controls.md`.

**Dry run over the whole fleet.** All 7 modes planned in the frozen order, no state file written,
and the authority root byte-identical to the pre-run capture — one file, `README.md`, unchanged
sha256 `3728804f`.

**Real run stops where it must.** Exit `2` at `deep-review` on check `flip`, with the six later
modes reported untouched and no `authority-*.json` written for any mode.

**Full suite, as a delta.** Baseline before any edit: `17 failed / 4111 passed / 39 skipped (4165)`, 7894s. After: `17 failed / 4152 passed / 39 skipped (4206)`, 7486s. The gain is exactly this phase's 2 files and 41 tests. The failing-file sets from the two runs diff identical, which is the part that matters — an unchanged failure count can hide a swap, and this one does not.

**Two more guards, two more reds.** Restoring the hardcoded `null` continuity id turns exactly one
test red — the one that drives matched evidence past the gate — and nothing else, which is the
discriminating half: the perturbation is visible only where the passing direction is asserted.
Disabling the empty-row-set rejection by its condition alone, leaving every declaration in place so
the failure cannot be a compile error, turns exactly its own test red. Both restored green at
`28 passed (28)`.

**Targeted suites.** 71 tests across `enable-modes-cli.vitest.ts` (28), `fleet-enablement.vitest.ts`
(25), `restart-facts-reader.vitest.ts` (14) and `observed-classification.vitest.ts` (4), vitest exit
`0` on each, re-run green from the restored tree after every control pass. `--help` exits `0`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**Superseded by the finalize.** The reversible records this phase established were
subsequently advanced to `new_authoritative_final` (epoch 3) by
`010-full-enablement-finalize`, so the whole-system gate now reads all eight modes on
`new_authoritative_final`. The per-mode reader-contract items deferred below (T-011,
T-012) are discharged by the gate's real `reader-contracts` check, which reads all eight
modes cleanly through their real consumers. The `new_authoritative_reversible`/epoch-2
readings quoted below are the state this phase left the system in, retained as the
historical record rather than the current live state.

**The fleet flip is done, via the registry-direct path.** All eight modes of
`AUTHORITY_FLIP_MODE_ORDER` (deep-research, deep-review, deep-ai-council, deep-improvement-common,
agent-improvement, model-benchmark, skill-benchmark, deep-alignment) now hold on-disk durable
authority records at `.opencode/skills/.authority-state/authority-<mode>.json`, each in state
`new_authoritative_reversible`, epoch 2, `selectedWriter` `dark`, the same `candidateSha`, and
`policyVersion` 1. This was verified two independent ways: reading all eight JSON records, and the
whole-system gate's `authority-state` check, which reports "8 modes; 8 on new_authoritative_reversible;
8 from a stored record, 0 from the absent-record default", status pass. The flip was executed through
`scripts/flip-authority.cjs --commit` (registry-direct), the operator-selected path, not through
`AuthorityFlipCoordinator.requestCutover`.

**The per-mode coordinator step (T-005) is superseded, not done.** The fleet flip did not compose the
per-mode coordinator step inside this driver. The coordinator mechanism (`AuthorityFlipCoordinator.
requestCutover` with a deny-capable policy and a flip event) remains the PROVEN PILOT mechanism in
`002-deep-research-enablement`; it was not the path taken for the fleet. T-005 is recorded as
superseded by the registry-direct path choice, not as done-by-composition and not as silently
dropped. The driver's per-mode step still contains no flip write path by design — the flip was
performed out-of-band — so CHK-008's original framing ("the step is the pilot's procedure
parameterised") is superseded by the same decision.

**The deep-improvement-common mode-name mismatch is resolved.** The recorded blocker — `--mode
improvement` denied by the frozen authority order while `--mode deep-improvement-common` is refused
by the adapter resolver — no longer blocks the fleet flip. Its authority record exists and flipped
(`authority-deep-improvement-common.json` at `new_authoritative_reversible`). The CLI-adapter
spelling tension documented in `scratch/finding-improvement-mode-unroutable.md` remains a
load-bearing naming question routed back to `001`, but it did not prevent the flip, which takes mode
names from the authority order directly.

**Per-mode reader contracts over projected files (T-011, T-012) are deferred.** Running a reader
contract against a mode's own projected files needs a live per-mode run that produces those files.
The whole-system gate itself defers `reader-contracts` for the same reason: it records the check as
not-run rather than passing it vacuously, because "running one now would pass vacuously" without a
real per-mode run. This phase makes the same deferral. T-013 (read all authority records
independently; confirm ledger authority) is done: 8/8 records read `new_authoritative_reversible`
and the gate's `authority-state` check passes with "8 from a stored record".

**Eight manifest surfaces belong to no mode.** Every one is `disposition: project`, so each is meant
to be projected from the ledger, yet no mode's enablement covers it — their writers are runtime-wide
rather than mode-scoped. Enabling all seven modes would still leave them unowned. The risk table
anticipates a mode with no manifest entry; it does not anticipate the reverse. Whether these flip
with the runtime rather than with a mode is a design question this phase cannot settle on its own,
so it is recorded in `scratch/adversarial-review.md` rather than decided.

**Atomicity of the state write is reviewed, not tested.** The only assertion available — that no
temporary file is left behind — would stay green with the rename removed, which would make it an
assertion that cannot fail. None was written.

**The shared-prefix check compares prefixes by equality.** Two modes are reported as sharing a
surface only when they declare an identical prefix, so a hypothetical pair where one prefix
contained the other would go unreported. No such pair exists in the current table.
<!-- /ANCHOR:limitations -->
