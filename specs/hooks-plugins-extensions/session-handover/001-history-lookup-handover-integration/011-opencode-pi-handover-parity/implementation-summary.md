---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "opencode pi handover parity implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity"
    last_updated_at: "2026-11-16T06:31:00Z"
    last_updated_by: "generate-context"
    recent_action: "Proved six live hops on Pi and OpenCode"
    next_safe_action: "Run the sk-git commit and merge of worktree 422 once approved"
    packet_purpose: "Purpose: A hand-over hop on OpenCode or Pi finishes the sender's task, and the new session recovers any detail the note left out through the History Lookup."
    blockers: []
    key_files:
      - ".skilled/hooks/session-handover/lib/nudge.cjs"
      - ".skilled/hooks/session-handover/history/lib/core.ts"
    session_dedup:
      fingerprint: "sha256:2de52b565ab08359d1089bfb1501982c2446d5640606d356743cdb6f916afaf0"
      session_id: "scaffold-011-opencode-pi-handover-parity"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "87e90d42-7a99-4147-b5e1-353501784430"
      workspace: "/Users/michelkerkmeester/worktrees/public/422-opencode-pi-handover-parity"
      savedAt: "2026-11-16T06:31:00Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 011-opencode-pi-handover-parity |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A hand-over hop on Pi or OpenCode now recovers a detail the note left out. Six live hops in a row, three per runtime, scored 5/5 with the receiver stating the side word it could only get from the sender's turns. Before the change, a Pi receiver on DeepSeek trusted a note that called that detail lost and asked the operator instead.

### Phase 11: opencode-pi-handover-parity

Nothing told the sender that the next session can read its turns, so a sender that kept a detail out of the note could write it off as lost. The receiver saw the lookup offer only after the note, with an instruction that covered guessing but not asking you. Now the sender's prepare text names the History Lookup and forbids writing a detail off, the receiver's seed steps run the lookup before it asks you, and the claim's closing line says the same.

Two smaller gaps closed with it. A credential under a header name such as `x-api-key`, a camel-case name or a plural key, or inside an array under one, is now redacted. A browse preview cut at 160 characters ends with `…`, so you can tell the turn goes on.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/lib/nudge.cjs` | Modified | The prepare text names the lookup; a seed step runs it before asking the operator |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modified | The claim's closing line covers asking the operator and a note that calls a detail lost |
| `.skilled/commands/speckit/handoff.md` | Modified | Step 3 and Receiving step 3 say the same |
| `.skilled/hooks/session-handover/history/lib/core.ts` | Modified | Credential names matched on their last words; the name travels into arrays |
| `.skilled/hooks/session-handover/history/lib/navigator.ts` | Modified | A cut browse preview ends with an ellipsis |
| `history/tests/history-secret-redaction.vitest.ts`, `history/tests/history-search-browse.vitest.ts` | Modified | One case each for the two engine changes |
| `tests/nudge.test.cjs`, `tests/session-handover-cli.test.cjs` | Modified | Pinned step numbers and the closing sentence |
| `scratch/harness/live-hop.sh`, `scratch/harness/score.cjs` | Created | The live proof: a planted URL password, and recall scored from the receiver's own transcript |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Two live baseline hops found the Pi miss. A two-lineage `/deep:research` run (Vibe and OpenCode Go, both on DeepSeek Flash) traced it to the instruction text, and the orchestrator checked the load-bearing claims in source. The harness scorer was fixed first, because it had counted the sender's echoed prompt as recall. The fixes then landed in worktree 422 with suite baselines taken before the first edit, and six live hops ran from the worktree's own code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Fix the text both models read, not the hop machinery | Prepare, relaunch, claim and lookup all worked on both runtimes; only the instructions failed |
| Put the text in the shared builders | Every runtime reads `handoffText`, `seedText` and the claim output, so one change reaches all of them |
| Score recall from the receiver's transcript | The pane can hold only the sender's echoed prompt, which made a failed recall read as a pass |
| Plant a URL password, not a vendor token | The lookup redacts it with its own pattern, and a committed run folder stays clear of push protection |
| Defer OpenCode 2 model carry | Its root command takes no model flag, so carrying the model needs a design choice beyond this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| History engine `npm --prefix .skilled/hooks/session-handover/history test` | PASS, 148/148 (baseline 146), typecheck and build exit 0 |
| Hooks vitest `npx vitest run --config .skilled/hooks/vitest.config.ts` | PASS, 503/503 (baseline 503) |
| Session readers `node --test .skilled/hooks/shared/tests/session-readers/` | PASS, 103 pass, 0 fail (baseline 103) |
| Hand-over and OpenCode plugin `node --test` | PASS, 1115 pass, 0 fail (baseline 1115) |
| Negative control, array fix reverted | `1 failed | 4 passed (5)`; restored `5 passed (5)` |
| `/speckit:handoff` `validate_document.py --type command` | VALID, 0 issues; mirrors 257 in sync |
| Live Pi hops `fix1` to `fix3` (DeepSeek, max) | 5/5 each; side word stated, not in the note; 3, 6 and 5 lookup calls; password redacted, never leaked |
| Live OpenCode hops `fix1` to `fix3` | 5/5 each; side word stated, not in the note; 2, 1 and 5 lookup calls; never leaked. `fix2` used one search whose preview did not reach the URL, so no marker was needed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **OpenCode 2 does not carry model or effort across a relaunch.** Its root command takes no model flag, so the receiver starts on the model OpenCode picks. Deferred.
2. **The fix is instruction text.** Six passes on DeepSeek Flash at max make it reliable there; a weaker receiver may still skip the lookup.
3. **Deferred from the research:** string tool-call arguments projected as `{}`, no reason printed when the lookup offer is withheld, no expiry for a claimed note, Pi held-nudge loss on reload, an OpenCode store without a `directory` column, and `AI_SESSION_CHILD` inside `skilled-loop`.
<!-- /ANCHOR:limitations -->

---


