---
title: "Implementation Summary"
description: "Every runtime's sweep now offers a chat question from any paragraph of a message through one shared detector, capped at 3 per message and 20 per sweep, with stable per-question keys."
trigger_phrases:
  - "chat question detection implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/005-chat-question-detection"
    last_updated_at: "2026-11-02T14:05:55Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 005: suite 93/93, chat row recorded live on Pi, OpenCode and Devin"
    next_safe_action: "Verify CHK-FIX-007 against the commit SHA once the operator approves"
    blockers: []
    key_files:
      - ".skilled/hooks/decision-capture/lib/chat-questions.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-pi.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-opencode.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-devin.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-codex.mjs"
    session_dedup:
      fingerprint: "sha256:9dcf70080e05a5a6e5e8ffe7270e2437385900195b5cc1aff32c6987ef7f0129"
      session_id: "scaffold-005-chat-question-detection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-chat-question-detection |
| **Status** | Complete |
| **Completed** | 2026-11-02, after the live re-proof in `../006-live-conversation-test/` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The save step now sees a chat question you answered even when it sat above the last paragraph of the message, on every runtime, not only Claude Code. Closing-paragraph candidates keep their exact keys, so nothing you already recorded is offered again.

### Phase 5: chat-question-detection

The Claude transcript sweep scans every paragraph of the assistant message that closed a turn. An earlier paragraph counts when its prose asks something once code, quotes, table rows and headings are removed, and a paragraph of `A)` to `D)` options directly after it joins the candidate. Each earlier candidate gets a key ending in `:p` plus 12 hex digits of the SHA-256 of its text, with `-2` and up for a repeat in one message. The sweep keeps 3 candidates per message, ranked closing first, then those with options, then later before earlier. It keeps the newest 20 per sweep and reports the cut as `chat_candidates_dropped`. A turn or a reply without its own id yields no candidate, because it cannot carry a stable key.

### Every runtime (ADR-001)

The paragraph detector moved out of the Claude sweep into `lib/chat-questions.mjs`, as `chatCandidatesFromTurns`. Each sweep now maps its own store into assistant, tool-call and typed-prompt turns and hands them to it: Pi reads its session file's `message` entries, OpenCode reads `session_message` rows only, Devin reads `transcript.steps` and Codex reads rollout `response_item` lines. A chat answer on Pi, OpenCode, Devin or Codex now gets a key and lands in the decision record like a Claude one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Modify | `chatSourceKey` takes an optional fifth key segment. |
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Modify | One case for the four- and five-argument key forms. |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` | Modify | Paragraph-wide detection, keys, process filter per candidate, both caps and the missing-id guard. |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` | Modify | 13 new cases; the ten existing bodies are unchanged. |
| `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl` | Create | The 7 baseline `earlier` pairs, redacted. |
| `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json` | Create | One label per pair: 3 `process`, 1 `answers_earlier`. |
| `.skilled/commands/speckit/save.md` | Modify | The "share one reply" sentence, and every sweep line now says it prints chat candidates. The `.opencode` path links to this folder. |
| `.skilled/hooks/decision-capture/lib/chat-questions.mjs` | Create | The shared detector, moved out of the Claude sweep. |
| `.skilled/hooks/decision-capture/lib/chat-questions.test.mjs` | Create | The detector's own cases. |
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs`, `sweep-opencode.mjs`, `sweep-devin.mjs`, `sweep-codex.mjs` | Modify | Map the store into turns and print `chat_candidates`. |
| The four matching `*.test.mjs` files | Modify | One chat case each on a redacted fixture. |
| `bin/fixtures/pi-chat-session.jsonl`, `opencode-chat-session.json`, `devin-chat-session.json`, `codex-chat-rollout.jsonl` | Create | Redacted store samples; each names its stand-in text. |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | Modify | Names the shared detector and its source row. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

A codex worker built the key segment, detection, caps and tests from the brief. The orchestrator then reran every check itself and swapped the HEAD sweep back in under the new tests, where 5 cases failed. It probed the edge inputs the checklist names and found that a turn without an id still produced a candidate, in the old sweep as well as the new one. It fixed that at the source and added the missing table-row, heading, blank-line, torn-line, inline-options and malformed-turn cases. Without the id guard, the malformed-turn case fails. Last came the fixture CLI, the ten baseline transcripts and the timing. After the operator chose chat detection on every runtime (Q001), workers moved the detector into `lib/` and added one store reader per runtime: Luna for the move, Pi and OpenCode, then DeepSeek through cli-pi for Devin and Codex once Luna's quota ran out. The orchestrator reran every suite and the live scenario on Pi, OpenCode and Devin.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Hash the question text for the earlier-paragraph key | A position index would shift whenever the detection rule changes, and the consumed log needs a key that stays put. |
| Leave the closing-paragraph candidate untouched | Its keys are already in consumed logs, and a changed key would re-offer recorded answers. |
| Cap 3 per message and 20 per sweep | The baseline peaks at 1 candidate per message and 7 per session, so neither cap cuts real data. They bound what the save step must read. |
| Drop a turn or reply that has no id | Its key would carry `undefined` or an empty segment, and two such turns answered by one reply would collide. |
| Freeze the ten baseline transcripts as copies | The live list moved after 2026-11-01. Fixed copies let the old and new sweep and the measurement read identical bytes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Baseline: `node --test` on `sweep-transcript.test.mjs` before any edit | PASS, 10 of 10, exit 0 |
| `node --test` on the sweep and capture-core tests | PASS, 43 of 43, nothing on stderr; numstat `282 0` for the sweep test |
| Decision-capture lib and bin suite | PASS, 78 of 78, exit 0 |
| Negative controls | The HEAD sweep fails 5 new cases; the sweep without the id guard fails 1 |
| Fixture CLI in a temporary project | 4 candidates, from pairs 1, 3, 6 and 7; none from the 3 `process` pairs |
| Ten baseline transcripts, frozen copies, one temporary project each | Total 25, equal to the same-run measurement's 25 units and matching per file; the 20 closing keys equal the HEAD sweep's 20; at most 1 per message and 7 per session |
| Timing on `dc90f89a` (255 MB) | 0.55 to 0.57 s, against 0.53 to 0.54 s for HEAD on the same day: at most 5.6 percent slower |
| Decision-capture lib and bin suite after ADR-001 | PASS, 93 of 93, exit 0 |
| Per-reader suites | sweep-transcript 23, sweep-pi 11, sweep-opencode 10, sweep-devin 8, sweep-codex 12, each 0 fail |
| Live re-proof in the 006 harness | Claude sibling S5b: `count_candidates=1 mid_message=1 max_per_message=1`. S11 on Pi, OpenCode and Devin: `record_rows=7 repeat=identical`, one consumed chat key each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **One reply, several candidates.** When a message yields more than one candidate, they share one reply, and only the save-step model can tell which question it answers. `save.md` asks it to write an entry only for a question the reply answers.
2. **Codex chat is proven on a fixture only.** The Codex live run waits on its quota and the hook-trust rule, so its chat path has the unit case but no live row yet.
<!-- /ANCHOR:limitations -->

---


