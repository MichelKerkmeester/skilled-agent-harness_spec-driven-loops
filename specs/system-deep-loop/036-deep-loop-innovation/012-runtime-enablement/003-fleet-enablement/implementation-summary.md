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
    last_updated_at: "2026-08-19T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built the driver, the CLI and both test suites; proved every guard with a negative control"
    next_safe_action: "Operator decision on the missing flip transitions, which block this phase and 004 through 006"
    blockers:
      - "No mode can reach cutover_ready, so no mode can be enabled"
      - "deep-improvement-common has no working name on the append CLI; the fix crosses into the gateway and the projection manifest"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/mode-surface-map.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
    completion_pct: 65
    open_questions:
      - "Who builds the legacy-to-cutover-ready edges, and under what evidence?"
      - "Does the improvement-mode rename return to 001, given it touches the gateway and the manifest?"
    answered_questions:
      - "Every fleet mode has at least one manifest surface; skill-benchmark's projectable set is empty and is reported as such"
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
