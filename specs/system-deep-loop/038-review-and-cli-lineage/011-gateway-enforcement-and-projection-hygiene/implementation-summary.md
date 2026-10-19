---
title: "Implementation Summary"
description: "The append gateway now refuses a hand-written state log before touching the ledger, stores a retried event once, and keeps topics, reducer rows and idea rows through every projection."
trigger_phrases:
  - "gateway enforcement implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/011-gateway-enforcement-and-projection-hygiene"
    last_updated_at: "2026-10-19T23:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the gateway enforcement and projection hygiene phase"
    next_safe_action: "Merge worktree 156 to main"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-gateway-enforcement-and-projection-hygiene |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A CLI lineage that writes its own state log now fails at once with a clear class instead of after a string of refused, duplicated appends. The rows a run legitimately writes no longer vanish at the next projection.

### Phase 11: gateway-enforcement-and-projection-hygiene

The gateway checks provenance before it authorizes an event: a config row in the state log with no `run_initialized` in the ledger is refused with `STATE_LOG_UNATTRIBUTED`. An identical retried event is replayed from its stored receipt rather than stored again. The runner fails a lineage whose state log the ledger never produced with the non-retried class `unattributed_state_log`. The CLI brief runs the reducer after each append. Research and review config rows carry the run's topic. The reducer's conflict and promotion rows and the agent's idea rows are registered events that go through the gateway, and the upcaster translates old rows of those kinds instead of pinning them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/mode-append-gateway/append-mode-event.ts`, `runtime/scripts/append-mode-event.cjs`, gateway README | Modified | Provenance, idempotency, refusal records |
| `runtime/scripts/fanout-run.cjs`, `scripts/lib/cli-guards.cjs`, `fanout-pool.cjs` | Modified | Failure class, reducer step in the brief |
| Research and review ledger schemas and types, the research reducer, both projection contracts, `legacy-compatibility.ts` | Modified | Topic and lossless rows |
| `deep-research/scripts/reduce-state.cjs` | Modified | Rows through the gateway |
| Research and review workflow YAMLs, compiled contracts | Modified | Send the topic |
| Runtime tests and `tests/helpers/gateway-backed-lineage.ts` | Created and modified | Failing-first tests, gateway-backed stubs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One worker built it in three rounds in worktree 156, each round closing the gaps the previous one exposed, each test written first. The orchestrator reran the related sweep, census and typecheck from the final state and swapped HEAD's gateway and runner in to see the tests fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Provenance check on the config row and `run_initialized` only | The projector builds that row from that event alone, so the pair proves a direct write; a broader prefix rule would refuse legitimate reducer rows |
| Idempotency key from the event as handed over | Event id, timestamps and chain position change on every call; the caller's input is what a retry reproduces |
| Stop after three rounds | The remaining items belong to the wider legacy-row migration, recorded below |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Related deep-loop sweep | PASS: 68 files, 1331 passed, 2 skipped |
| `npm run typecheck` | PASS |
| Stem census | PASS: 75 registered, 23 spoken, 0 violations |
| `runtime-bootstrap.test.cjs` | PASS: 9/9 |
| Red swap of the gateway and runner | FAIL as intended: 4 tests; restored, `cmp` clean |
| Luna replay (worker's run) | Refused with `STATE_LOG_UNATTRIBUTED`, 0 ledger frames |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other legacy rows are still pinned.** Pivots, `stuckRecovery`, `userPaused`, `novelty_signal_inert`, `trend_flatline`, `migration` and `min_iterations_guard_pass` would still be lost on a projection replace in a ledger-backed run.
2. **Other upcast arms record the append time.** Only the idea and conflict rows keep their own timestamp.
3. **A wrongly typed value is refused generically.** For example `run: "4"` gets the schema's error, not a named upcaster reason.
4. **Operators have no written path for rejection rows in a ledger-backed run.** The halt message still says only to remove or reset the rejected pattern.
5. **Doc naming differs.** `state-jsonl.md` uses camelCase for the removal and reset rows, the feature catalog snake_case.
<!-- /ANCHOR:limitations -->

---
