---
title: "Implementation Summary"
description: "The communication rules now state each norm once, no longer contradict each other and follow their own punctuation rules. Four reviews shaped the change and withdrew the original delivery-first headline."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/018-communication-rules-consolidation"
    last_updated_at: "2026-10-07T11:22:14Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Edited six rule files and the router after four reviews"
    next_safe_action: "Re-measure compliance once more sessions run under the new versions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-communication-rules-consolidation"
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
| **Spec Folder** | 018-communication-rules-consolidation |
| **Completed** | 2026-10-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each communication norm now has one home. "Lead with the answer" is one section instead of five, the writing registers sit in the rule that loads before every reply, and the complex-request opening no longer asks for a restatement the filler rule bans. The rules also stopped breaking their own punctuation bans.

### Consolidate the communication repo rules

The first analysis blamed delivery and proposed a reply card. Four reviewers, the repository's own earlier research and a new measurement overturned that: semicolon rates barely change with delivery, and the three sessions since Gate 6 miss the reply rules far less often. The card was dropped. So were three proposals that reversed recorded decisions or misread deliberate layering.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/repo-rules/communication.md` | Modified | Registers, one answer-first section, reader-impact and say-once guidance, shorter re-render |
| `.skilled/repo-rules/communication-prose.md` | Modified | Identifiers, numbers, the semicolon join |
| `.skilled/repo-rules/communication-decisions.md` | Modified | Answer-first opening for ambiguous requests |
| `.skilled/repo-rules/communication-handoff.md` | Modified | Receipts after the outcome |
| `.skilled/repo-rules/answer-the-actual-request.md` | Modified | House-style fixes |
| `.skilled/repo-rules/uncertainty-and-honesty.md` | Modified | Registers moved out, house-style fixes |
| `REPO RULES.md` | Modified | Router and index rows matched |

### Follow-ups

The measurement script now credits an injected rule only when the rule's own text arrives, and a card counts as well as the full rule. A compaction ends delivery until the rule arrives again, so a reply in a later window no longer counts as "after". Time estimates must rest on a named earlier run or say they are an assumption. The question-tool table names Codex's `request_user_input`, read from the Codex 0.160.1 binary. The cli-devin skill no longer claims Devin loads root `CLAUDE.md`.

| File | Action | Purpose |
|------|--------|---------|
| `sk-create-repo-rule/scripts/measure-rule-compliance.py` | Modified | Content-based injection credit, delivery ends at compaction |
| `sk-doc/scripts/tests/test_measure_rule_compliance.py` | Modified | Two new tests, one updated |
| `.skilled/repo-rules/communication-decisions.md` | Modified | Grounded time estimates |
| `.skilled/repo-rules/communication-handoff.md` | Modified | Codex question tool |
| `cli-devin/SKILL.md` and `.hermes/skills/` | Modified | Current rule loading, Hermes copies regenerated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each rule was revised in place under the sk-create-repo-rule revise workflow, with its version bumped. The guards, the voice scan and the measurement tests ran afterwards. The consolidation and the follow-ups are committed separately.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No reply card | Earlier research found binding, not delivery, is the bottleneck, and a card does not fit Devin's prefix |
| Keep the re-render procedure in communication.md | The human-voice skill's triggers do not catch "say that more plainly" |
| Keep the question-tool table and the answer-the-actual-request name | Both reversals were refused, one by a recorded operator decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-repo-rules.cjs` | PASS 11/11 |
| `check-rule-copies.js` | OK, prefix unchanged |
| `hvr_scan.py` on six rules | 0 hard blockers, apart from 3 quoted banned words in communication.md |
| Rule measurement tests | 18 passed, 20 after the follow-ups, and the 3 changed tests fail on the old script |
| Hermes copies | `sync-skills-hermes.cjs --check` PASS, 70 in sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No behavior evidence yet.** The baseline is recorded, and only a later measurement can show whether the edits changed replies.
2. **Delivery is unresolved.** Only three sessions ran under Gate 6, too few to judge.
<!-- /ANCHOR:limitations -->

---


