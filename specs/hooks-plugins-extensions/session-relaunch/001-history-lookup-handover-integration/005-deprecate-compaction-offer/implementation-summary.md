---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "deprecate compaction offer implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/005-deprecate-compaction-offer"
    last_updated_at: "2026-11-15T06:24:28Z"
    last_updated_by: "template-author"
    recent_action: "Phase built and verified"
    next_safe_action: "Build phase 006"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-deprecate-compaction-offer"
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
| **Spec Folder** | 005-deprecate-compaction-offer |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No compaction hook mints a history locator or prints the lookup section any more. The lookup is offered in one place, the handover claim, and the compaction summaries and `/speckit:resume` pointers are unchanged.

### Phase 5: deprecate-compaction-offer

After a compaction you now get the summary and the recovery pointer and no lookup command. The Claude, Pi, DSH, Devin and Vibe producers lost their mint and their offer, and the OpenCode plugin that only carried the offer is deleted. The lookup CLI, the locator schema and the handover's own mint and offer are untouched, so a claimed handoff still prints the section.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `runtime/hooks/claude/compact-inject.ts`, `session-prime.ts` | Modified | PreCompact mint and SessionStart section removed |
| `runtime/hooks/pi/session-compact-context.ts`, `dsh/session-compact-context.mjs`, `devin/post-compaction.cjs`, `devin/user-prompt-submit.ts` | Modified | Mint, persist call, marker and offer removed. Summary and recovery pointer kept |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` and its test | Modified | Vibe mint and section removed |
| `.opencode/plugins/session-history-lookup.js` and its test | Deleted | The OpenCode compaction offer |
| `runtime/tests/_support/history-fixtures.ts` | Modified | Adds `buildLocator`, the one locator builder the suites share |
| `runtime/tests/history-lookup-cli.vitest.ts`, `history-locator.vitest.ts`, `history-vocabulary-drift.vitest.ts`, `hook-precompact.vitest.ts`, `hook-session-start.vitest.ts` | Modified | Producer cases dropped and locators built from the shared builder |
| Four suites: `history-locator-adapters`, `history-lookup-adapters-e2e`, `history-lookup-after-session-start`, `history-lookup-devin-prompt-offer` | Deleted | They tested only the removed producers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three DeepSeek V4.1 Flash workers ran in parallel on disjoint file lists. The orchestrating session then rebuilt the runtime and ran every suite from the final state, including the whole runtime suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|---|---|
| Vibe was added to the removal | The Vibe compaction hook gained a mint and an offer after this packet was planned, so leaving it would have kept one compaction producer alive. |
| Phase 5 started only after the claim offer was seen in live hops | Receivers ran the lookup in 3 of 3 counted hops, against 0 of 6 before, which is the proof the parent packet asks for before the compaction offer goes. |
| No plugin registration was edited | No index, manifest or config lists the deleted OpenCode plugin. Only docs name it, and phase 006 owns those. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| `npx vitest run` (whole runtime suite, `AI_SESSION_CHILD` unset) | Exit 0. `Test Files 119 passed | 3 skipped (122)`, `Tests 1610 passed | 13 skipped (1623)` |
| `npx tsc --noEmit -p tsconfig.json` | Exit 0 |
| `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/*.test.cjs` | 984 tests, 984 pass, 0 fail |
| `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/` | 591 tests, 591 pass, 0 fail |
| `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs` | 29 tests, 29 pass, 0 fail |
| `rg` for the mint and the section over every producer file | No output |
| `rg -c "/speckit:resume"` over the Pi, DSH and Devin post-compaction files | 1, 3 and 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A session that compacts without a handover has no lookup offer.** That is the intended trade. The transcript is still on disk, and a handover prepared afterwards still offers the lookup to the next session.
2. **The docs still describe the compaction offer.** READMEs, the feature catalog and the playbooks are corrected in phase 006.
<!-- /ANCHOR:limitations -->

---


