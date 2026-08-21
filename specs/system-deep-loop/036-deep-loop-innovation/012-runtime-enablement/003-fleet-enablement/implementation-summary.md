---
title: "Implementation Summary: Fleet Enablement"
description: "The serial enablement driver, its CLI, and their tests are built and independently verified; the fleet cannot actually be enabled because the authority flip has no reachable entry edge, and one mode has no working name on the append path."
trigger_phrases:
  - "fleet enablement summary"
  - "enablement driver built"
  - "improvement mode unroutable"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
    last_updated_at: "2026-08-21T00:32:55Z"
    last_updated_by: "claude"
    recent_action: "Built the evidence gate: three fail-closed refusals plus verdict enforcement"
    next_safe_action: "Make the step perform the flip, or refuse explicitly for the work it does not perform"
    blockers:
      - "The step still has no flip code: given matched ledger evidence a cutover_ready mode returns ok, with no authority record written"
      - "That false completion persists and resume skips completed modes, suppressing the next attempt"
      - "The pilot's procedure has never completed a flip, so nothing is proven to parameterise"
      - "deep-improvement-common has no working name on the append CLI"
      - "No production code writes an effect ledger, so every mode refuses at the evidence gate"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/mode-surface-map.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/restart-observation/restart-facts-reader.ts"
      - "scratch/false-completion-proven.md"
    completion_pct: 70
    open_questions:
      - "Does the improvement-mode rename return to 001?"
      - "Reconcile the spec's six-mode list to FLEET_MODE_ORDER's seven, or narrow it?"
    answered_questions:
      - "Who builds the legacy-to-cutover-ready edge: it is built, as prepareCutover on the authority registry"
      - "The gap in the step is unwritten code, not a blocked precondition"
      - "Directory existence is not evidence: the guard was passed with mkdir"
      - "Empty ledgers and unmatched receipts must refuse: an empty list reports full coverage"
      - "Computing a verdict is not enforcing one: the manifest was built and discarded"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Fleet Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement |
| **Status** | Blocked |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build`, not pushed |
| **Completed** | Partial — the driver is built and proven; no mode is enabled |
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

The census is an explicit argument rather than a path resolved from the script's own location. The
previous resolution reached the file only through a symlink, and embedded folder numbers that this
repository does renumber.

What was NOT built: the flip itself. See KNOWN LIMITATIONS.
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

**Targeted suites.** 41 tests across `enable-modes-cli.vitest.ts` and `fleet-enablement.vitest.ts`,
vitest exit `0`, re-run green from the restored tree after every control pass.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**No mode can be enabled.** `AuthorityCompareAndSwapInput.expectedState` is the literal type
`'cutover_ready'`, and a never-flipped mode reads back `legacy_authoritative`. Only the last edge
of the declared machine exists in code. This blocks the reader contracts against projected files,
the independent read showing ledger authority, end-to-end resume, and the parity-gate-per-mode
property — each is untested rather than satisfied. It equally blocks phases `004` through `006`,
all of which presuppose a fleet that has flipped.

**One mode has no working name on the append path.** `--mode improvement` is denied by the frozen
authority order, and `--mode deep-improvement-common` is refused by the adapter resolver — each
layer rejects the spelling the other requires. The predecessor recorded this as belonging to this
phase; running it shows the fix does not fit here, because the name is load-bearing in the gateway
and in the projection manifest, both of which this phase's scope routes back to `001`. Renaming
only the CLI would make the gateway's surface mapping miss. Full blast radius in
`scratch/finding-improvement-mode-unroutable.md`.

**The fleet driver is unaffected by that today, and will not be.** It takes mode names from the
authority order directly and never passes through the CLI's normaliser, which the dry run confirms.
But `deep-improvement-common` is third in the fleet order and its enablement requires appending
through exactly that path, so the fleet run would stop there the moment the flip exists.

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
