---
title: "Implementation Summary: Phase 1: pi-opencode-history-lookup"
description: "A note claimed from a Pi or OpenCode sender now prints the History Lookup section, so the receiver can read the sender's earlier turns as it can from Claude Code, Codex and Vibe."
trigger_phrases:
  - "pi opencode history lookup implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/001-pi-opencode-history-lookup"
    last_updated_at: "2026-11-15T19:49:21Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-pi-opencode-history-lookup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 1: pi-opencode-history-lookup

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-pi-opencode-history-lookup |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A receiver that claims a note from a Pi or OpenCode sender now gets the `## History Lookup` section, with a command that reads the sender's earlier turns. Before, only Claude Code, Codex and Vibe senders got one, so a Pi or OpenCode receiver could only guess at a detail the note left out.

### Phase 1: pi-opencode-history-lookup

Pi and OpenCode keep no transcript file a handle could name, so the claim could not mint a locator for them. The claim now asks the same shared session reader the lookup uses, with the folder the note names, and mints only when that reader finds the session there. The mint and the lookup ask the same question, so a printed command always redeems. A session the store records for another folder, or a session the store does not hold, gets no section, and the claim prints what it printed before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modified | `readerFindsSession` and the Pi and OpenCode branch of `mintHandoverLocator` |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modified | Redeem and refusal tests on each runtime |
| `.skilled/hooks/session-handover/README.md`, `.skilled/hooks/injection-contract.md`, `README.md` | Modified | List Pi and OpenCode senders |
| `.skilled/skills/system-spec-kit/feature-catalog/` (two files), `manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | Modified | Same runtime list and the command prefix |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Vibe CLI on deepseek-flash built the mint and the tests from two one-change briefs in worktree 420. Each diff was read before the next brief went out. The added missing-session test was written by hand after the review. Mutation checks then forced the branch off and dropped the reader check, and the matching tests failed each time. A fresh Opus medium review read the whole diff. Two live hops ran the real runtimes under `skilled-loop`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ask the lookup's own reader at mint time | The lookup redeems by session identity alone for these runtimes, so the mint must find the session the same way or it would print a command that fails |
| Use the session folder when placement has one, else the checkout root | That is the folder the lookup passes to the reader, so both sides see the same answer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Handover suite | PASS: `tests 1039`, `fail 0`, against a baseline of 1026 |
| Mutation: branch forced off | the two redeem tests fail |
| Mutation: reader check dropped | the four refusal tests fail |
| Live hop `../scratch/runs/live1-pi` | PASS 5/5. The claim printed `## History Lookup` with `SPECKIT_RUNTIME=pi`, and that command returned the sender's turns |
| Live hop `../scratch/runs/live1-opencode` | PASS 5/5. The side word was absent from the note, and the receiver loaded it through the lookup |
| Drift guards | PASS: `all 4 guards PASSED` |
| Opus medium review | no P0 or P1. One P2 led to a corrected comment |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An OpenCode store without a `directory` column cannot prove the folder.** The reader then accepts the session by id alone. The mint and the lookup still agree, so nothing fails, but a note naming a session from another project in the same database would get a locator. Current OpenCode stores carry the column.
<!-- /ANCHOR:limitations -->
