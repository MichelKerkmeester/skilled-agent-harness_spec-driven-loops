---
title: "Implementation Summary"
description: "CLI fan-out lineages are now told to send every state record through the append gateway, so a hand-written config row no longer blocks every later projection and fails the lineage."
trigger_phrases:
  - "config row projection refusal implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/010-config-row-projection-refusal"
    last_updated_at: "2026-10-19T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Fixed the CLI lineage brief and closed the phase"
    next_safe_action: "Merge worktree 154 to main"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts"
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
| **Spec Folder** | 010-config-row-projection-refusal |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A CLI fan-out lineage no longer gets an instruction to write its state log by hand. That instruction is what let one cli-codex lineage finish five iterations and still be rejected.

### Phase 10: config-row-projection-refusal

The in-process brief now tells every CLI lineage to hand each state record, from the opening config row to synthesis, to `append-mode-event.cjs`, and never to create, append to or rewrite the state log. The `findingsCount` and timestamp lines point at the record handed to the gateway. Both auto workflows' pre-dispatch notes say the same.

### Root Cause

Confirmed from the codex session log of the failed lineage: the session wrote a 12-key config row into `deep-research-state.jsonl` with `cat >` and appended iteration 1 with `cat >>`. The lineage's ledger held no `run_initialized`. Every later gateway append would have projected a thin config row, so the attribution guard in `shadow-projection-store.ts` refused each one. Replaying Luna's config, state log and iteration event through the gateway reproduced the refusal; the same events on a gateway-opened log exited 0.

The brief was the only text that said to write "the state record ... directly into the lineage directory", and it asked for a `findingsCount` the projected row never carries. That the wording caused the write is inferred: the DeepSeek lineage read the same brief and used the gateway.

The earlier research also said the dispatcher requires `findingsCount`. It does not: `verify-iteration.cjs`, `fanout-merge.cjs` and `synthesis-closeout.cjs` all skip a missing count.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Brief sends every state record through the gateway |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts` | Modified | Test that fails on the old brief |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml` | Modified | Pre-dispatch note names the gateway |
| `.skilled/command-support/deep/assets/compiled/deep-research.contract.md`, `deep-review.contract.md` | Regenerated | Fresh source digests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The test came first and failed on the HEAD runner. The fix went into worktree 154, the compiled contracts were rebuilt after the workflow edit, and the related suites ran from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the brief, keep the guard | The guard refused exactly what it exists to refuse: a projection that would drop keys from a row it did not write |
| Leave mechanical enforcement for later | Rejecting a lineage without `run_initialized`, or refusing before the ledger write, changes gateway behavior every mode shares |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New prompt test, HEAD runner | FAIL as intended: 1 failed, 6 passed |
| New prompt test, fixed runner | PASS: 7 passed |
| 41 related deep-loop suites | PASS: 834 passed, 2 skipped, exit 0 |
| `node --check fanout-run.cjs` | PASS |
| Drift guards | PASS: 4/4, 10 non-blocking warnings |
| Runtime mirrors | PASS: 192 in sync |
| `validate.sh --strict` on this folder | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A prompt cannot enforce the rule.** A lineage can still write the log; the guard then refuses and the fan-out records `projection_refusal` as before.
2. **A retried refused append duplicates its ledger record.** The gateway keeps the event before refusing the projection.
3. **The projected config row's `topic` holds the run id.** The `run_initialized` payload carries no topic to project.
<!-- /ANCHOR:limitations -->

---
