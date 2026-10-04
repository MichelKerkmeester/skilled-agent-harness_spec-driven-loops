---
title: "Implementation Summary: Gate 5 card pilot"
description: "In progress. The card generator, check 11 and the two-arm config are committed, and the pilot runs in isolated test environments."
trigger_phrases:
  - "gate 5 card pilot summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot"
    last_updated_at: "2026-10-04T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Committed the generator, check 11 and the arms config, and dropped arm C under REQ-005"
    next_safe_action: "Commit preregistration.md (tasks.md T003), then run both arms (T008)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Gate 5 card pilot

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-gate5-card-pilot |
| **Completed** | In progress |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The tooling is built. `build-rule-cards.cjs` writes a card per rule, check 11 fails when a card drifts from its rule, and `experiment/arms.json` defines the two arms. The pilot itself runs next, in isolated test environments, so no live `cards/` directory exists.

### Phase 8: gate5-card-pilot

The plan comes from the verdict in `../002-rule-concision-and-loading/research/research.md`. Arm C, the resident reply-rule cards, did not fit: `AGENTS.md` at 26,778 bytes plus 7,677 bytes of cards is 34,455 bytes, above the 32,768-byte cap.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created, then amended | Planning documents, amended for two arms in isolated environments |
| `build-rule-cards.cjs`, `check-repo-rules.cjs`, `test_build_rule_cards.py` | Created, modified | Generator, check 11 and its tests, committed in `edba53daeb` |
| `experiment/arms.json`, `experiment/prompts.json` | Created | Arm edits, the arm C drop record and 15 write-task prompts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. Planned with `/speckit:plan` in auto mode after a four-agent codebase exploration shared across phases 003 to 008. The generator and check 11 landed with their pytest suite before any scored run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Phase order 003 to 008 | Measurement and gates land before any rule or loading change |
| Arm C dropped | REQ-005: the resident cards would push `AGENTS.md` past 32,768 bytes |
| Isolated environments instead of live blocks | Same as 007: the live rule files stay unchanged, and a winner goes live only after 007 decides |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Planning docs | `validate.sh specs/agents/016-repo-rule-advisor-surfacing --strict --recursive` returned RESULT: PASSED on 2026-10-04 |
| Generator and check 11 | `test_build_rule_cards.py` 4 passed on 2026-10-04 |
| Card router against the checker | On a scratch copy with the arm `cards` edits, check 2 failed and check 10 reported bullets=0, as expected |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pilot not run.** REQ-002 to REQ-004 and REQ-006 are open.
2. **Adoption needs checker work.** If arm `cards` wins, checks 2 and 10 must resolve card links to their rules first, since check 2 fails on the card router by design.
<!-- /ANCHOR:limitations -->

---
