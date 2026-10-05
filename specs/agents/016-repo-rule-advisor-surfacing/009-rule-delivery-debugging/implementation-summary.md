---
title: "Implementation Summary: Rule delivery debugging"
description: "Found why executors skip the reply-rule load and adopted Gate 6, which cut reply-rule misses by 37.8 points with no Gate 5 cost."
trigger_phrases:
  - "rule delivery debugging summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/009-rule-delivery-debugging"
    last_updated_at: "2026-10-05T13:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Adopted Gate 6 in AGENTS.md with the prefix guard updated"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "results/decision-2.md"
      - "results/adoption-ledger.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Rule delivery debugging

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-rule-delivery-debugging |
| **Completed** | 2026-10-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every session now meets the reply-rule mandate as its own numbered gate. `AGENTS.md` §2 carries GATE 6: REPLY RULES LOAD, and §4 points to it. In two pre-registered runs the gate cut reply-rule misses by 22.6 and then 37.8 points, and no run in either arm wrote a file before loading the repo rules.

### Phase 9: rule-delivery-debugging

The trace found two causes. Executors without a project `AGENTS.md` never received either mandate and found the rules only by listing the directory, 136 of 197 reply-rule misses. Devin, which did receive them, skipped the reply rules in 61. With the project `AGENTS.md` present, Luna already followed the bullet, but DeepSeek skipped it in half its replies, which is what Gate 6 fixes (`results/decision-2.md`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | GATE 6 added, §4 bullet replaced by a pointer, §8 pointer updated, two sentences cut to keep Devin's prefix |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modified | Prefix anchor for `#### GATE 6:` replaces the removed bullet's line |
| `experiment/`, `preregistration.md`, `preregistration-2.md` | Created | Arms, prompts and both decision rules, fixed before their runs |
| `results/` | Created | Delivery trace, control-arm miss rates, both decisions, scores, run records and the adoption ledger |
| `decision-record.md` | Created | ADR-001, adoption without the live windows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The arms ran in isolated test environments built by `rule-experiment.py`, each with a project copy of `AGENTS.md`. The first run kept the bullet because about 30 write runs per arm could not bound the Gate 5 guard. A write-only replication, pre-registered before its runs, resolved it and adopted Gate 6. Quotas changed the executors twice, recorded in `results/deviations.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No fix touches user prompts | The operator wants the mandate followed without asking for it |
| Arms vary a project copy of `AGENTS.md` | The live global reaches every Claude session through a symlink |
| Adopt Gate 6 without the live windows | The operator ended further test rounds on 2026-10-05 (ADR-001) |
| Cut two sentences rather than Gate 6 text | The arm landed as tested, and the cuts were a restatement and a rationale |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-rule-copies.js` | OK, 21 prefix anchors; Blast-Radius Management ends at byte 16,359 of 16,384 |
| `check-rule-copies.test.sh` | All rule-canary test cases passed |
| `check-repo-rules.cjs` | RESULT: PASSED (11/11 checks) |
| Harness and checker pytest | 26 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model in the replication.** Both replication lanes ran DeepSeek V4.1 Flash. Luna's result comes from the first run only.
2. **No live window.** Gate 6 landed with the 007 wording and the 010 phrases, so a live measurement cannot isolate it.
3. **Codex reads the root file twice here.** `.codex/AGENTS.md` is now a symlink to the root `AGENTS.md`, so every Codex session gets Gate 6 through `~/.codex/AGENTS.md`. Inside this repository Codex also loads the root file as project instructions, so it likely reads the same text twice.
4. **Cline still misses.** DeepSeek through Cline missed the reply rules in 34.9% of long replies under Gate 6.
<!-- /ANCHOR:limitations -->
