Finish 036/012-runtime-enablement. You ORCHESTRATE; executors write code, you verify.

Build until all 8 modes read ledger authority, legacy writers are retired, and the gate passes.
Worktree .worktrees/022-012-runtime-enablement-build. READ handover.md at the packet root FIRST — phase table, traps,
cold-read order. Docs are authored: build, don't re-plan. 001 is complete; coverage restoration is done (20bcddfb3d).

RECURRING DEFECT: a check placed where it cannot observe what it names — 9+ found, each by running
code, not reading it. Treat every green as guilty until a perturbation turns it red, and check WHY:
failing at the first assertion proves nothing about later ones. Recorded notes decay; re-measure.

CHAIN — each link blocks the next:

1. NINE STEMS, not eleven: migration, min_iterations_guard_pass, spec_check_result, spec_mutation,
spec_mutation_conflict, spec_preinit_context_added, spec_preinit_context_deduped, spec_seed_created,
and the `type: spec_mutation` row. Do NOT register paused or stuck_recovery —
step_normalize_pause_events rewrites them to userPaused/stuckRecovery before emission, so they can
never reach the ledger. Three more rows are refused BY DESIGN; the pin protects information.

2. EFFECT PRODUCER. Nothing writes effect intent/confirmation records, so the certificate's coverage
check passes over an empty list. Build it where real external actions happen. TRAP: wrapping the
append CLI emits records for no external action, each confirmed instantly — perfect coverage
attesting to nothing, and fabrication cannot be refused the way absence can.

3. COORDINATOR. AuthorityFlipCoordinator has zero production callers; its only assembly is a test.
THE POLICY MUST DENY: both policies are evaluate: () => ({verdict:'allow'}) and AUTHORIZATION_DENIED
appears zero times in flip tests. Prove a denial leaves the record whole.

4. STEP PERFORMS FLIP. It reports success while containing no flip code, and that false completion
persists because resume skips completed modes. Assert on the record on disk, not the step's report.

5. FLIP. AUTHORITY_FLIP_MODE_ORDER has 8 and the constant wins. Fix deep-improvement-common first —
CLI, gateway and manifest each refuse the others' spelling, and it is third in the order. Capture
records byte-for-byte, flip the pilot, then the frozen order one at a time, stopping at the first
failure.

6. RETIRE LEGACY WRITERS only after an independent read confirms all 8 on ledger authority, then
proceed unattended. If any mode is not, STOP — early removal strands every agent. Then the gate,
then closeout written from observed behaviour. Never adjust the gate to pass it.

EXECUTOR: devin -p --model glm-5-2 --permission-mode dangerous -- "<prompt>". Unsuffixed glm-5-2 IS
GLM-5.2 High free; -max is paid. No substitutes — if the model is unavailable, HALT. run_subagent is
QUOTA-EXHAUSTED: tell it to work directly and pre-authorize it, or it stops to ask and writes
nothing. Briefs forbid git stash/checkout/restore/reset/clean and STOP on a failed premise.

VERIFY: read diffs, not reports — an executor claimed 110 passed exit 0 where my re-run gave 109 and
exit 1. Re-run named checks and validate.sh <folder> --strict at Errors:0 and Warnings:0; the parent
summary prints FIRST, so never judge by the tail. Negative-control every guard: disable only its
condition, watch it go red, restore, record both counts and the failure reason.

The "append every stem" tests straddle the 30s wall family-wide: an untouched
sibling failed at 32.6s in one full run and passed in the next. Do not chase or widen it. The full
suite takes ~2h and its failing set moves with desktop load — compare sets by name and repeat a
condition before accusing any change. Baseline: 16/192 files, 14/4302 tests.

REPORT per boundary: what ran and its exit status, baseline->delta as sets, executor claim versus
what you confirmed, commit SHA. Separate confirmed from inferred, declare
deviations, HALT on red.
