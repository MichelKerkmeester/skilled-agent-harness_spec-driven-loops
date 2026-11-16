---
title: "Implementation Summary"
description: "The docs now place the history lookup at the handover claim, and a live hop rerun showed receivers moving from never running the lookup to running it every time and answering correctly."
trigger_phrases:
  - "docs and live hop proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/006-docs-and-live-hop-proof"
    last_updated_at: "2026-11-15T06:24:31Z"
    last_updated_by: "template-author"
    recent_action: "Phase built and verified"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-docs-and-live-hop-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-docs-and-live-hop-proof |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The docs now describe the lookup where it lives: offered when a handoff note is claimed, and not after a compaction. A live hop and a rerun of the first measurement show the change works: receivers went from never running the lookup to running it every time and answering correctly.

### Phase 6: docs-and-live-hop-proof

You can read the feature catalog, the playbook pages, the hook READMEs and the root README and find the same behaviour the code has. The two playbook pages about recall after a compaction are deleted, because the hop-recall pair covers the hop and now carries the before and after rows. The unreleased v4.0.2.2 release note gained one section about the move. The measurement also exposed a defect in the shared Claude transcript reader, which is fixed and recorded here.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `README.md`, `.skilled/hooks/session-handover/README.md`, `runtime/hooks/lib/history/README.md` | Modified | Describe the claim-time offer, the entry command and the word-part search rule |
| Hook READMEs for Claude, Codex, Pi, Devin, DSH and Vibe, `session-lifecycle/README.md`, `injection-contract.md`, `SKILL.md` | Modified | Compaction-time lookup sentences removed or corrected |
| `.opencode/plugins/README.md`, `ARCHITECTURE.md` | Modified | Deleted plugin removed, count now 20 |
| Feature catalog: `compaction-history-lookup.md`, `feature-catalog.md`, `session-recovery-spec-kit-resume.md`, `packet-purpose-carry.md` | Modified | Entry rewritten for the claim-time offer |
| Playbook: `compaction-history-lookup.md`, both `hop-recall` pages, `packet-purpose-pi-compaction.md`, the playbook index | Modified | Claim-time scenario, before and after rows, corrected harness path |
| Playbook: two `compaction-history-recall` pages | Deleted | They described an offer that no longer exists |
| `.skilled/changelog/skilled/v4.0.2.2.md` | Modified | One section on the move |
| `.skilled/hooks/shared/session-readers/claude.mjs` and its test | Modified | Reads one message written as several lines as one turn |
| `runtime/tests/compaction-adapters.vitest.ts` | Created | Restores the kept Pi, Devin and DSH cases that a deleted suite had carried |
| `scratch/live-hop.md`, `scratch/measurement.md` | Created | The live hop record and the before and after table |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two DeepSeek V4.1 Flash workers corrected the docs on disjoint file lists, and a third restored the kept adapter tests. The orchestrating session fixed the reader, corrected the spots the workers reported as outside their lists, ran the hop-recall harness seven times and reran every gate from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|---|---|
| Delete the two compaction-recall playbook pages | Rewriting them as hop pages would have duplicated the hop-recall pair written in phase 1. |
| Fix the Claude reader in this packet | The lookup refused two of three live senders. The cause was in the shared reader, and a claim-time offer that cannot be redeemed would have failed the packet's purpose. |
| Restore the kept adapter cases in a new suite | The deleted adapter suite also covered the summary, the purpose line and the recovery pointer, which stay. Twelve cases came back in `compaction-adapters.vitest.ts`. |
| Add the release note section to the unreleased v4.0.2.2 note | That note is still open, so a new version file was not needed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Hop-recall harness, lookup arm, after the claim offer | 7 runs, 6 counted, all 6 with `lookup_attempted=1`. Before the reader fix 1 of 3 answered `correct` and 2 `missing`. After it 3 of 3 answered `correct`. `lookup-after-r1` was not counted because its note held the code. Before the claim offer: 0 of 6 attempted, 0 correct |
| `npx vitest run` (whole runtime suite) | Exit 0 |
| `node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs` | 102 tests, 102 pass, 0 fail |
| `validate-playbook-package.cjs --package system-spec-kit` | `PASS`, 124 scenarios, 0 violations |
| `rg -n "Offers one bounded, read-only history lookup after a compaction"` over the docs | No output |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The measurement is small.** Six counted runs per side on one runtime, one model and one kind of detail. On the after side only the last three ran with the fixed reader. It shows the direction, not a rate.
2. **Codex senders are covered by unit tests only.** No live Codex hop was run.
3. **A sender can still copy the detail into the note.** Two runs were not counted for that reason, which is a fine outcome for the receiver but hides the lookup from the measurement.
<!-- /ANCHOR:limitations -->

---


