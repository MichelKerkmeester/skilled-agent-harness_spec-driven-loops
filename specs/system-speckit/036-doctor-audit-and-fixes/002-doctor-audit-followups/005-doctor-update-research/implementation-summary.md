---
title: "Implementation Summary"
description: "Six iterations of deep research found that /doctor:update is not yet perfected: 26 findings, 0 P0, 5 P1 and 21 P2, ranked with a proposed fix and a proving test for each."
trigger_phrases:
  - "doctor update research summary"
  - "doctor update perfection findings"
  - "release-update engine defects"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/005-doctor-update-research"
    last_updated_at: "2026-10-03T20:45:00Z"
    last_updated_by: "doctor-update-research"
    recent_action: "Synthesized six research iterations into research/research.md"
    next_safe_action: "Plan a fix phase from research/research.md Section 11, starting with DU-01 and DU-02"
    blockers: []
    key_files:
      - "specs/system-speckit/049-doctor-audit-followups/005-doctor-update-research/research/research.md"
      - ".skilled/commands/doctor/scripts/release-update.cjs"
    session_dedup:
      fingerprint: "sha256:87df9319ca8151ffc1b6a191d3c740835961bb6d8a6ba161c90515030ba36604"
      session_id: "doctor-update-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Prefill consent policy for partly decided units, needed before DU-01 is coded"
      - "Whether copied or vendored trees are a supported install shape"
    answered_questions:
      - "Is /doctor:update perfected: no, five P1 hand-off defects remain"
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
| **Spec Folder** | 005-doctor-update-research |
| **Completed** | 2026-10-03 |
| **Level** | research |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:update` is not perfected yet. Its core invariants hold and its 56 engine tests pass. Five P1 defects remain, and each sits in a hand-off between two actions or between the engine and the operator, which is why tests of one action at a time miss them.

### Phase 5: doctor-update research

`research/research.md` ranks 26 deduplicated findings with file and line evidence, a proposed fix and the test that would prove it. The five P1s:

- **DU-01.** A partly decided conflict unit drops the release change of every undecided file and records the release as the unit's base, so the next check reports it current.
- **DU-02.** An interrupted apply strands `.skilled/release/.apply.lock`, which then blocks rollback, re-apply and dry-run.
- **DU-03.** A copied or vendored tree cannot name the upstream, because no routed action passes `--remote`.
- **DU-04.** `record-base` accepts any named release, so a tree a release behind can report current.
- **DU-05.** The startup approval is not bound to the plan apply runs, so a newer tag can be applied unseen.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Config, ledgers, state log, strategy, registry, dashboard, six iterations, deltas, receipts, resource map, `research.md` |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | Packet docs, including the generated findings block in `spec.md` |
| `../spec.md` | Modified | Phase map row and handoff row for this phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The run followed `/deep:research:auto`. Iterations 1 to 5 ran in parallel at the operator's request, on cli-codex `gpt-6-luna` at max reasoning on the fast tier, one key question each. Iteration 6 ran last as a fresh Claude Opus 5.5 at xhigh and cross-checked the other five. A separate fresh Opus 5.5 agent wrote the synthesis and reproduced all five P1s against the real engine in throwaway repositories. The parent session then re-read the code behind DU-01 and DU-02 before closing out.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run iterations 1 to 5 in parallel, one question each | The operator asked for more parallelism. Iteration 6 ran last over all five to make up for their isolation |
| Run iteration 6 on the native branch | The workflow's cli-claude-code branch refused to nest `claude` inside a Claude session, and its guard names the native branch as the answer |
| Leave the config's cli-codex executor unchanged | The workflow marks the config immutable. Each delta file and dispatch receipt carries the real executor |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `verify-iteration.cjs` for iterations 1 to 6 | Exit 0 for each |
| `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` | 56 of 56 pass, run by iteration 6 and by the synthesis |
| P1 reproduction | All five reproduced by driving the real engine in throwaway repositories |
| Parent re-read of DU-01 and DU-02 | Confirmed at `release-update.cjs:1692-1731` and `1775-1794` |
| Writes outside the packet | None. `git status` shows changes only in this phase and the parent spec |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The state log keeps no executor stamp.** The workflow stamps the executor by rewriting the state log, and the gateway rebuilds that log from the ledger on every append, so the stamp is lost. Provenance lives in `research/deltas/` and `research/dispatch-receipts/`. This is a deep-loop defect, outside this topic.
2. **The refused cli-claude-code attempt left no durable record.** Its `dispatch_failure` row was written straight to the state log and dropped by the next rebuild, the same defect as item 1.
3. **The nested-dispatch guard matches bare words.** It refused the first Codex launch because the driver's own command line carried the argument `codex`. A deep-loop defect, outside this topic.
<!-- /ANCHOR:limitations -->

---
