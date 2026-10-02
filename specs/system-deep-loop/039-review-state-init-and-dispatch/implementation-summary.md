---
title: "Implementation Summary"
description: "Deep-review runs now open through the append gateway, so iterations record with exit 0, and dispatched CLI children retry a failed edit instead of halting."
trigger_phrases:
  - "review run open summary"
  - "dispatch retry summary"
  - "attribution collapse fixed"
  - "run initialized shipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-review-state-init-and-dispatch"
    last_updated_at: "2026-10-02T16:37:15Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Review fix rebased onto packet 038 and verified; preamble retry line shipped earlier"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-deep-loop-039-review-state-init-and-dispatch"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 039-review-state-init-and-dispatch |
| **Completed** | 2026-10-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-review run opened by the workflow can now record its iterations. Before this, every append in such a run committed to the ledger and then failed, so the state log never moved past its first row.

### Deep-review state-log init through the gateway, and the child-dispatch retry rule

Both review workflows now open a run by recording `deep_review.run_initialized` through the append gateway. The gateway writes the state log's config row as a projection, so each later append rebuilds a row with the same keys and the attribution guard has nothing to refuse. Your full run config still lives in `deep-review-config.json`, where the reducer reads it.

Dispatched CLI children get one more line in their preamble: a failed edit match means a stale anchor, so re-read and retry, and halt only after three failures on one file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modified | Open the run through the gateway |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modified | Same for the confirm variant |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modified | `run_initialized` declared spoken |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-run-open.vitest.ts` | Created | End-to-end test of the shipped init step |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-policy-yaml-parity.vitest.ts`, `render-command-contract.vitest.ts`, `check-ledger-stem-producers.vitest.ts` | Modified | Follow the new init step and the spoken census row |
| `.skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md` | Modified | Retry line and its reason |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The preamble change shipped from worktree 080. The review fix was built in worktree 081 and merged after packet 038 landed, because both edit the review stem census. The one conflict, in the census test's counts, combined both sides.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the producer, not the projection guard | The guard protects operator context on purpose; the workflow was the writer bypassing the ledger |
| Build the event inline in the YAML | The migration step already does this, and the census scans the workflows, so no new producer file is needed |
| Hold the merge for packet 038 | 038 is live in the same census table; merging first would hand it the conflict |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `deep-review-run-open.vitest.ts` | PASS 3/3: both shipped init steps, then the worker's iteration record, exit 0 and the row equals the record; control case still exits 2 |
| Deep-loop runtime suite after the rebase | 2855 passed, 5 failed; the 5 are check-contract-drift and render-command-contract, which fail identically on main |
| Runtime typecheck | exit 0 |
| Stale compiled contracts recompiled | Only recorded source digests changed in the three compiled contracts; `check-contract-drift.cjs` reports OK for 3 commands; the deep-loop suite then runs 2872 passed, 0 failed, so the `deep-loop-runtime.yml` CI workflow that failed on main can pass |
| Updated tests | The stop-policy and confirm-parity checks read the config file and the run-open event instead of the removed flat row; the census test counts 69 registered, 14 spoken, 55 reserved |
| `check-ledger-stem-producers.cjs` | exit 0, `run_initialized` spoken by both workflows |
| `validate_document.py` on the preamble | Same single pre-existing error as main (no overview section) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runs opened before this change.** Their directly written config row still blocks projection. Restart such a run to open it through the gateway.
2. **Research workflow.** It opens its run the same way and likely has the same failure; it is not checked or changed here.
<!-- /ANCHOR:limitations -->

---


