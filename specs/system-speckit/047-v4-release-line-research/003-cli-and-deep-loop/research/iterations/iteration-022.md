# Iteration 022 — The auto/confirm YAML twins, read as pairs

## Focus

Unread ground named by the previous iteration: treat the four paired assets under
`.skilled/commands/deep/assets/` as *pairs* and diff them, then hold the review twin's own
synthesis and verdict steps against `deep-review/references`. Explicitly out of scope:
registry findings already recorded (executor.type gates, `--pure`, `{generation}`,
the copilot branch, lock TTL). Read-only throughout.

## Actions Taken

1. Listed the asset directory and got exact line counts for all four twins:
   `deep-review-auto.yaml` 2645, `deep-review-confirm.yaml` 2149,
   `deep-ai-council-auto.yaml` 221, `deep-ai-council-confirm.yaml` 232. The review pair
   differs by 496 lines; the council pair by 11 — two very different kinds of drift in one
   directory.
2. `diff -u deep-review-confirm.yaml deep-review-auto.yaml`, then step-inventory both sides
   (`step_`/`phase_`/`gate_` greps) to separate "removed because interactive" from
   "differently implemented".
3. `diff -u deep-ai-council-confirm.yaml deep-ai-council-auto.yaml` in full (the whole
   11-line delta is legible in one hunk set).
4. Grepped both review twins for the five approval gates and both council twins for
   `post_dispatch_validate|resolved_route|progress_liveness`, then grepped every occurrence
   of `releaseReadinessState` in the review pair and read `step_update_config_status` on both
   sides.
5. Read `step_derive_verdict`, `step_compile_review_report`, `step_generate_state_summary` on
   the auto side and `step_derive_verdict`/`gate_pre_synthesis` on the confirm side, then
   grepped `deep-review/references` for the verdict and release-readiness contract.

## Findings

**f-iter022-001 — P1, drift: `releaseReadinessState` is frozen at `in-progress` for the life
of every run.** A whole-file grep for the field name returns exactly two hits across both
twins — the initializers [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:541]
and [SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:522]. The step that
closes a run writes only `status: "complete"`
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2508]. The reference declares a
three-member enum and requires the report to name which member applies
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:150],
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:74],
and calls the field canonical for readiness tracking
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:132].
Two of the three members are therefore unreachable. This is the release-readiness half of
the focus, and it is a real gap rather than a documentation nit: a converged, PASS review
ships a config that still says `in-progress`.

**f-iter022-002 — P1, drift (twin asymmetry, council): the *auto* twin is the better-guarded
one.** `deep-ai-council-auto.yaml` validates its own loop step
[SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:175] — a validator entry
[SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:176], a `round_completed`
record assertion, a route proof
[SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:183], typed failure reasons
[SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:184] — plus a
`progress_liveness` per-seat persistence contract
[SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:168]. The confirm twin has
**zero** hits for `post_dispatch_validate`, `resolved_route`, `progress_liveness` or
`step_map_topic_state`. The mode with a human watching is the mode with no shape assertion.
Confidence high on the absence; the *consequence* (that confirm sessions can emit a
session-state file auto would have rejected) is the strong reading, and the cheap
disproof is a confirm-mode dry run inspected for `round_completed` rows.

**f-iter022-003 — P2, drift: one step, two contradictory route identities.**
[SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:159] declares
`Resolved route: mode=ai-council; target_agent=@ai-council; execution=…; state_source=…;
depth_aware=true; do_not_switch_mode=true`; [SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:183]
declares `Resolved route: mode=ai-council target_agent=ai-council` — different separators, no
`@`, four fields dropped. `route_proof_mismatch` is a declared failure reason
[SOURCE: .skilled/commands/deep/assets/deep-ai-council-auto.yaml:184], so exact comparison
fails one side and normalisation makes two identities acceptable. Verify:
`grep -n "Resolved route: mode=ai-council" .skilled/commands/deep/assets/deep-ai-council-auto.yaml`.

**f-iter022-004 — P2, drift: documentation notation compiled into a runtime prompt.**
`step_generate_state_summary` emits `Provisional Verdict: {PASS|CONDITIONAL|FAIL|PENDING}
hasAdvisories={has_advisories}` [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1148]
into every iteration's dispatch context. That pipe-enum inside braces is the *reference's*
diagram notation for the field [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:243],
repeated at [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:403].
Nothing binds a token of that name; verdict exists only after `step_derive_verdict` in
`phase_synthesis` [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2333]. The step
is auto-only — the confirm twin has no `step_generate_state_summary` — so this is a defect the
confirm twin avoids only by having less telemetry. This is a *concrete* instance feeding the
long-carried unknown-token question rather than a restatement of it.

**f-iter022-005 — P1, drift: two restart implementations, and the one that actually fires
loses the lineage fields.** Auto inserts `step_apply_lifecycle_request` before fan-out
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:186], with outputs limited to
`archived_path` and `lineage_mode: "restart"` — no `parent_session_id`, no `generation`. The
`on_restart` branch inside `step_classify_session`
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:338] *does* set
`parent_session_id` and `generation: "{prior_generation + 1}"`, but the lifecycle step has
already emptied and recreated the packet directory, so classification sees a fresh session and
`on_restart` cannot fire. The contract requires the config's lineage block to match the run and
names `parentSessionId`, `generation`, `continuedFromRun` explicitly
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:57],
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:123].
Confirm mode implements restart only at its resume gate and sets both fields, so the auto twin
introduces the gap. Line numbers for the sub-blocks are derived from diff hunk offsets rather
than a direct numbered read; verify with
`grep -n "step_apply_lifecycle_request\|on_restart:\|parent_session_id" .skilled/commands/deep/assets/deep-review-auto.yaml`.

### Falsified this iteration

- **Auto-resume counter loss** — appeared to be a defect (confirm's `on_A` restores
  `current_iteration`/`p0_count`/`p1_count`/`p2_count`/`stuck_count`; auto jumps straight to
  `phase_loop`) and is not: `step_read_state` derives `current_iteration` as
  `iteration_count + 1` and recounts P0/P1/P2 from all iteration records on both sides.
- **"The auto twin deleted the gates, so it must have deleted work."** The gates are
  re-expressed as `log`/`set`/`proceed_to` steps; the genuinely stranded behaviours are the
  ones in f-iter022-002 and f-iter022-005, not the gate removal itself.
- `step_derive_verdict` is **identical** in both twins (same three-branch algorithm, same
  `has_advisories` rule, same final-line contract) and matches
  [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:544].
  The verdict/synthesis *logic* is clean; the damage is around it, in readiness state and
  restart bookkeeping.

## Questions Answered

None of the strategy's three open key questions was closed. All five findings are new ground
against the pairing/verdict sub-question the previous iteration named.

## Questions Remaining

- Does `validateSessionStateHierarchy` in `runtime/lib/council/session-state-hierarchy.cjs`
  compare the route proof exactly, or normalise it? That decides whether f-iter022-003 is a
  failing gate or a silent double identity.
- Why do the review twins differ by 496 lines while the council twins differ by 11? The council
  pair looks like one generation of edits; the review pair looks like two divergent forks.
- `divergence.overrides` is still summarised by `step_read_state` on both sides, but the auto
  twin deletes the only branch that could ever write an override
  (`if_failed_recoverable`). Is that field now dead in auto?
- Carried: hub canon `package_skill.py --strict`; mid-run executor failure (devin
  `resource_exhausted`, builder throw); `--pure` validity; unknown-token `{...}` render policy;
  two of three `*-presentation.txt` assets.

## Next Focus

The one asset class in this directory still untouched by the pairing method: the three
`*-presentation.txt` files, read against the twins they belong to — do they name steps, gates
or options that the auto twin no longer has (the review presentation against the *confirm*
gates and the auto `step_init_complete`)? That is the direct test of whether the 496-line fork
leaks into operator-facing text.

## SCOPE VIOLATIONS

None. Nothing under `.skilled/` was written; the only writes are this narrative, the delta file
and the append-gateway record.
