---
title: "Implementation Plan: Effect Enablement"
description: "Plan for wiring a fail-closed effect intent/confirmation pair around the real executor dispatch, proving fail-closed by negative control, and showing the certificate coverage check reads real records."
trigger_phrases:
  - "effect enablement plan"
  - "fail-closed producer plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
    last_updated_at: "2026-08-21T15:30:00Z"
    last_updated_by: "claude"
    recent_action: "Planned setup, wiring, and the fail-closed negative control"
    next_safe_action: "Capture the runtime baseline and read the effect-gateway contract at the seam"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Fail-closed over vacuity; the intent write gates the spawn"
---
# Implementation Plan: Effect Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | The audited executor dispatch seam, its effect-ledger construction, and effect-recording tests |
| **Change class** | New durable side-record on a hot path, gating a real external action |
| **Authority** | No authority moves; this phase produces the evidence a later flip consumes |
| **Blast radius** | High: the seam runs on every deep-loop dispatch, and it is owned by another packet |

This is the phase that makes the certificate's coverage check mean something. Before it, the check passes over nothing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Blocking |
|------|---------|----------|
| Suite baseline and delta | `npx vitest run` before and after, compared by name | Yes |
| Intent-before-spawn | A real dispatch writes an intent whose sequence precedes the spawn | Yes |
| Fail-closed, negative control | Forcing the intent write to fail spawns zero children | Yes — a fail-closed path never seen refuse is not evidence |
| Coverage reads records | The restart-facts reader returns non-empty effect coverage over a populated ledger | Yes |
| Receipt pair intact | The existing best-effort receipt behavior is unchanged | Yes |
| Spec validation | `validate.sh <this folder> --strict` Errors: 0 | Yes |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The real external action is one line: `spawn(input.command, ...)` in `runAuditedExecutorCommandAsync`. Everything this
phase adds brackets that line.

**Before the spawn**, resolve and durably append an effect-intent record to a per-run effect ledger. The intent carries
the identity of the action about to happen. The append is fail-closed: if it does not durably land, the function
returns a dispatch failure and never reaches `spawn`. This is the whole safety property — a spawn that is not preceded
by a durable intent cannot occur, so a confirmed effect can always be traced to a recorded intention.

**After the dispatch settles**, append an effect-confirmation record carrying the observed outcome (exit, signal), keyed
to the same effect id. The confirmation is what closes the intent; a resumed run that finds a confirmation for an effect
id does not repeat the action, through the gateway's existing recovery path.

**Why not the append CLI.** Wrapping a ledger append would emit an effect record for every append — actions that are
themselves just records, each confirmed instantly. That produces perfect coverage attesting to nothing, and a
fabrication cannot be told from evidence downstream, where an absence can be refused. The producer must sit at the real
action, which is the process spawn, not a record write.

**The existing receipt pair stays.** `beginReceipt`/`completeReceipt` write MAC-signed receipt files for launch
recognition; they are best-effort and orthogonal. The effect records are durable and gating. Both bracket the same
spawn without interfering.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Capture the runtime suite baseline before any edit.
- Read the effect gateway, event contracts, and the restart-facts reader at the seam; record the effect-ledger id the
  reader expects and the intent payload shape the gateway requires.
- Confirm by execution that a bare dispatch today writes zero effect records and the reader refuses over the absent
  ledger.

### Phase 2: Implementation
- Construct the per-run effect ledger in the dispatch path, keyed to the id the reader reads.
- Append a fail-closed effect intent before the spawn; on a failed durable append, return a dispatch failure and do not
  spawn.
- Append an effect confirmation after the dispatch settles, keyed to the intent's effect id.
- Leave the best-effort receipt pair untouched in behavior.

### Phase 3: Verification
- Prove intent-before-spawn by sequence on a real dispatch.
- Run the fail-closed negative control: perturb only the durable append, assert zero spawns, restore, assert a spawn.
- Run the restart-facts reader over the populated ledger and confirm non-empty coverage.
- Re-run the full suite and report the delta; run strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The load-bearing test is the fail-closed negative control. The safety property this phase exists to establish is that a
spawn cannot happen without a preceding durable intent. A test that asserts fail-closed but where the recording could
never actually fail proves nothing — so the control perturbs only the durable append step, requires zero spawns, then
restores and requires a spawn, so the refusal is attributable to that one step.

The second load-bearing check is that the certificate's coverage stops being vacuous. Running the restart-facts reader
over a ledger populated by a real dispatch, and getting non-empty coverage, is the direct measurement that the empty-list
pass is gone.

Unit coverage follows the epic's pattern: the fail-closed refusal proven by negative control, suite results reported as
a delta against a captured baseline, and the seam's records read from disk rather than asserted from the code.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | State | Note |
|------------|-------|------|
| Effect gateway and event contracts | Landed, unwired | `EffectRecoveryGateway`, the intent/confirmation event types; used only by rollback drills today |
| Restart-facts reader | Landed | Refuses over an absent effect ledger; reads the per-run effect ledger id |
| The audited executor dispatch | Landed, 007-owned | The real spawn seam; edit authorized for this phase |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase adds a side-record and a gate; it moves no authority, so it is reversible in the ordinary sense — the effect
records can be removed and the seam returns to its prior behavior. The one irreversible-adjacent property is the
fail-closed gate on a hot path: once merged, a durable-append fault stops dispatch rather than degrading silently. That
is the ratified trade — vacuity is worse than a loud halt — and the mitigation is that the intent write is the cheapest
possible durable step, so its failure indicates a real ledger fault rather than routine load.

If the gate proves too aggressive in practice, the forward fix is a scoped change to the refusal condition in a new
phase, not a reversal of the evidence model.
<!-- /ANCHOR:rollback -->
