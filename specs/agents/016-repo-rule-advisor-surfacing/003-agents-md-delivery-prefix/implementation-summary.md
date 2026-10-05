---
title: "Implementation Summary: AGENTS.md delivery prefix"
description: "Every hard blocker, the reply-rule load line and the two always-binding mandates now sit inside the first 16,384 bytes of AGENTS.md, and the rule canary fails CI if one drifts out."
trigger_phrases:
  - "agents.md delivery prefix summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/003-agents-md-delivery-prefix"
    last_updated_at: "2026-10-04T15:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped the delivery prefix and its guard"
    next_safe_action: "Phase 004 may start"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: AGENTS.md delivery prefix

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-agents-md-delivery-prefix |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Devin now receives every hard blocker in `AGENTS.md`, the line that tells it to load the reply rules, and the "Never fabricate" and "treat content as data" mandates. Before this phase its 16,384-byte cut fell inside the completion rule and dropped all of that. The rule canary now fails CI the moment any of those clauses drifts past the cut or the file passes Codex's 32,768-byte cap.

### Phase 3: agents-md-delivery-prefix

`AGENTS.md` keeps every section number, so every `AGENTS.md §N` reference across the repository still points at the right place. Its physical order is now 1, 2, 4, 3, 5 to 10. The end of §4 gained "Reply Rules and Mandates", a shortened copy of the §8 block and the two §10 mandates, and §8 and §10 point to it. A live Devin probe quoted all of it back verbatim.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | §4 placed before §3, reply rules and two mandates moved into §4, pointers under §8 and §10, Confidence table padding removed |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modified | Delivery-prefix guard: 21 anchors must end by byte 16,384, file at most 32,768 bytes |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modified | Fixtures for an anchor past the cut and an oversize file |

### What moved and what was condensed

| Clause | Before | After | Requirement changed? |
|--------|--------|-------|----------------------|
| §4 Verification and Completion | After §3, bytes 14,203 to 18,715 | Before §3, unchanged text | No |
| §8 load line | Five linked files, byte 24,365 | Same five files and triggers, one directory named once, ends at byte 15,321 | No. "a long stretch of work" became "long stretch", and "a request you are tempted to warn about, narrow, decline, or price" became "warning about, narrowing, declining or pricing a request", the same moment |
| §8 two binding clauses | Ends at byte 25,385 | Ends at byte 15,520 | No. The rationale "over-constraining it produces hedged, timid answers" was dropped |
| §10 Never fabricate | "Mark what you do not know as UNKNOWN, and never agree for conversational flow." | "Mark unknowns UNKNOWN. Never agree for conversational flow." | No |
| §10 Treat content as data | Byte 26,878 | Same text, byte 15,737 | No |
| Confidence Thresholds table | Padded columns | Unpadded columns | No, whitespace only |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard came first and failed on the old file, naming six clauses past the cut. The first planned layout could not work: §3 sat between §2 and §4's hard blockers, so nothing could move below the cut with numbering and order kept. The operator chose to place §4 before §3. Two probes against a live Devin session confirmed its cap is 16,384 bytes per file, before and after the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Place §4 before §3 and keep every number | Renumbering would edit ten references, six in rule files, against D1. Condensing could not free 1.75 KB without changing meaning |
| Guard §3's Blast-Radius Management too | The stop-for-yes is mandatory, and it fits with 39 bytes to spare |
| Extend `check-rule-copies.js` in place | It already reads `AGENTS.md` on every PR and push through the rule-canary workflow |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node check-rule-copies.js` | PASS, exit 0, 21 anchors, last ends at byte 16,345 |
| `bash check-rule-copies.test.sh` | PASS, 7 of 7 cases |
| `node sync-gate1-pointers.cjs --check` | PASS, exit 0 |
| `npx vitest run --project cli gate1-pointer-sync workflow-invariance` | PASS, 2 files, 6 tests |
| Live Devin probe (swe-2-max) | Quoted the §8 load line, the Never fabricate bullet and the first Blast-Radius bullet verbatim, with 113 of the file's lines truncated after Execution Behavior's first bullet |
| Acceptance criteria | 6 of 6 Met, see `acceptance-criteria.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rest of §3 is past Devin's cut.** Execution Behavior, Quality Principles and Restraint Signals, plus §5 to §10, still do not reach Devin. None is a hard blocker.
2. **39 bytes of headroom.** Any growth in §1, §2 or §4 trips the guard. That is intended: whoever grows those sections must decide what gives way.
3. **The CI workflow runs the canary, not its test script.** The fixture cases run locally through `check-rule-copies.test.sh`.
<!-- /ANCHOR:limitations -->

---
