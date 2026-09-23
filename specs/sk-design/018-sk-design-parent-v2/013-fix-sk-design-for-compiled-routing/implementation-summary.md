---
title: "Implementation Summary"
description: "The compiled sk-design rollout is finished. The seventh hub serves compiled, the proof receipts are recorded, and the packet is closed."
trigger_phrases:
  - "sk-design compiled implementation summary"
  - "compiled routing evidence"
  - "sk-design rollout status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/013-fix-sk-design-for-compiled-routing"
    last_updated_at: "2026-09-22T15:26:03Z"
    last_updated_by: "pi"
    recent_action: "Recorded the finished seventh-hub rollout and the closure evidence"
    next_safe_action: "Operator review, then push the rollout and closure commits"
    blockers: []
    key_files:
      - ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"
      - ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts"
      - ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-21-sk-design-compiled-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Playbook cross-canvas gold: answered, SD-007 is stale because its prompt scores one intent under the current ROUTER.md, so the five-leaf pairing predates the mode migration"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-fix-sk-design-for-compiled-routing |
| **Status** | Complete |
| **Level** | 3 |
| **Started** | 2026-09-21 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The live sk-design hub now serves as the seventh member of the compiled-routing cohort. The packet rebuilt the rollout from the current four-mode registry instead of resurrecting the retired historical generation, and the compiled authority stayed behind the existing flag, manifest, policy-hash, and generation gates.

### The compiled child

009-sk-design under the 009-parent-hub-rollout carries a registry compiler, a two-stage canary router, a policy card, a build harness, and an 8-case typed gold fixture. The harness asserts every gold expectation at build time and generates the policy, the advisor projection, the policy card, the typed route gold, and an inert shadow activation. Only the route-time files are promoted; the compiled artifacts stay authored-side.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 009-sk-design child | Created | Compile and route the current hub under the 009-parent-hub-rollout |
| Runtime and cohort wiring | Edited | Engine hub map, resolver cohort, advisor flag source, guard, sync, foundation cohort counts, admission corpus constant |
| 013 activation currents | Created and reminted | The sk-design seven-record genesis, the sk-doc freshness remint, tracked and promoted sides identical |
| Serving closure | Regenerated | 62 closure files published, promoted, verified, and finalized |
| Live sk-design SKILL.md | Edited | The compiled front door, the legacy sentinel, the kill flag, the readiness markers |
| Packet documents and receipts | Written | Scope, decisions, criteria, tasks, and the evidence receipts under scratch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The prerequisite came first. The source-sync migration had emptied the tracked 015 program's 014 runtime, so the authored resolver and engine twins were restored from the promoted runtime, the archived alternative being stale at five hubs. The 46-test foundation then went green at six hubs, the reproduced symptom turning green as the negative control.

The child was built and replayed as a shadow. Two consecutive builds exited 0 with status `built` and byte-identical outputs, and all eight gold expectations were asserted inside the build. The cohort flip then went out in one servable pass. Promotion published 62 closure files, the post-publish gates read 7 of 7 compiled-serving with 0 stale and 0 flag-off, the sk-code front door stayed byte-identical, the kill flag returned the legacy sentinel, and the publication was finalized. The proof battery captured every remaining output and exit into this packet's scratch.

The source-sync blocker recorded at scaffold time was resolved by the prerequisite restoration, so that third scaffold decision no longer describes an open blocker. The two rollout commits are the servable change and this closure, and the push remains with the operator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compile current source, not retired historical artifacts | The live hub has four modes and a root router that differ from the deleted generation-6 rollout. |
| Keep activation fail-safe | A compiled child must never become authoritative without matching flag, manifest, policy hash, and generation. |
| Restore the authored prerequisite from the promoted runtime | The archived alternative was stale at five hubs, so the promoted copy was the only faithful source. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline front door | PASS: legacy sentinel observed for `sk-design` |
| Baseline status | PASS: `missing-manifest` observed |
| Baseline admission | PASS: correctly reports no engine registered before implementation |
| Source-sync prerequisite | PASS: the authored 014 twins restored, the foundation 46 of 46 green at six hubs before the flip |
| Final implementation gates | PASS: promotion published 62 files, 7 of 7 compiled-serving, 0 stale, 0 flag-off, kill-switch legacy, both stages replayed, admission admitted with the stale-gold finding classified, foundation 46 of 46, all receipted under scratch |
| Strict validation | PASS: RESULT: PASSED with Errors 0, captured to scratch/T014-strict-validation.txt |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Admission coverage follows the playbook, not the rollout plan's stronger floor.** The live design playbook holds 4 gold scenarios, so the stronger four-mode-plus-negative admission floor is unmet as written: uncovered fundamentals and md-generator, 0 negatives, enforcement warn-only. Admission passes under the permitted-hub-gaps model.
2. **One stale playbook gold, answered.** SD-007 expects the chart-plus-diagram five-leaf union while its prompt scores a single intent under the current ROUTER.md, so the pairing predates the mode migration. Classified stale, recorded, not repaired. This answers the packet's open question.
3. **The package validator's REFERENCES failure predates the packet.** The skill-package validator exits 1 under strict mode on a missing REFERENCES section, and the SKILL.md never carried one. The readiness marker and the parent check both pass. Recorded, not repaired.
4. **The pinned admission corpus constant was an estimate.** The 77 never validated against the live corpus. Measured 80, corrected by one constant, 29 of 29 green after.
5. **The documented T005 path differs from the actual module.** The tasks recorded `009-sk-design/lib/router.cjs`, while the shipped module is `lib/canary-router.cjs`. The engine accepts either. Recorded, not repaired.
6. **The sk-doc current moved once mid-closure.** Its route-time derivation moved with generation 5 unchanged and no input byte change found. Three consecutive reads settled, both 013 copies were reminted, and the soak held 7 of 7 across 75 seconds. The one-time mechanism remains unexplained.
7. **The seven-hub engine dissolved the four-source freshness question.** The pre-flip six-hub engine probed freshness through the three-source canonical fallback, while the seven-hub engine derives through the four-source 009-sk-design path and reads the recorded policy hash, fresh true.
8. **The full revert command path stayed unexercised.** The flag rollback and the authority-state chain were observed, and the publication state was consumed at finalize, so the sync revert command was not. The 013-current reversal mechanism itself is proven by the authority-state probes.
<!-- /ANCHOR:limitations -->
