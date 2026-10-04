---
title: "Implementation Summary: Rule delivery instrumentation"
description: "An offline analyzer now reports rule delivery, Gate 5 and reply-rule misses, and prohibition rates by rule version for Claude Code and Codex, with a committed baseline."
trigger_phrases:
  - "rule delivery instrumentation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation"
    last_updated_at: "2026-10-04T20:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the analyzer, its tests and the baseline"
    next_safe_action: "Phase 005 trigger coverage check, then 006"
    blockers: []
    key_files:
      - "baselines/2026-10-04-baseline.txt"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Rule delivery instrumentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-rule-delivery-instrumentation |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One command now tells you, for Claude Code and Codex, how often a session needed a repo rule and did not have it. Before this, the only numbers came from an untested script that counted `Read` calls in Claude Code alone.

### Phase 4: rule-delivery-instrumentation

The analyzer reads local transcripts and prints counts and rates only. It reports delivery receipts by channel and by compaction window, the Gate 5 miss rate, the reply-rule miss rate, and each reply prohibition split by delivery, by the rule's git blob version and, for tables, by whether a table was asked for. Every rate carries its denominator and a Wilson 95% interval.

The baseline (`baselines/2026-10-04-baseline.txt`) covers 44 Claude Code and 200 Codex sessions:

- **Gate 5, first write of a session:** missed in 23.5% of 17 Claude Code sessions and 7.9% of 63 Codex sessions.
- **Reply rules, first reply of a window:** missed in about 89% of Claude Code windows and 44% of Codex windows.
- **Semicolons after delivery:** 30.7% of Claude Code replies against 88.3% of Codex replies.

The pack's semicolon finding did not hold. Before 13:13 on 2026-10-04 the after-delivery rate was 17.0%. On the rule version committed 2026-10-02 it is now 52.8% of 545 replies, mostly real prose semicolons and concentrated in a few sessions. Phase 007 should treat that rule as unsettled.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py` | Created | The analyzer, promoted from the 002 prep copy |
| `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py` | Created | Nine pytest cases over synthetic transcripts |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modified | Points the Revise path at the analyzer |
| `baselines/` | Created | Aggregates-only baseline, text and JSON |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The record shapes came from local samples. Codex marks compaction with `compacted` and a final reply with phase `final_answer`. Claude Code marks compaction with `compact_boundary` and hook context with `hook_additional_context`. A probe found that Devin, Cursor, Pi and OpenCode all keep readable transcripts, so no runtime needed a hook. The reproduction check found the original run's time in this session's transcript and reran it with `--until`, which matched the pack exactly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Count an injection only when it carries the rule's heading | About 11,000 hook injections mention rule paths and none deliver rule text, so a path mention would invent receipts |
| Scope Gate 5 to the compaction window, and report first write and every write | Compaction drops the earlier read. Every write is the unit that gives AC-002 its denominator of 2 |
| Mirror `isExemptTargetPath` lexically | Transcripts outlive the files they name, so symlinks cannot be resolved offline |
| Add `--until` | The transcript set keeps growing, so a past window can only be rerun with a cutoff |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| pytest | 9 of 9 pass, directly and through `run-script-tests.sh` |
| Full sk-doc suite | `run-script-tests.sh` printed "all sk-doc script tests passed", exit 0 |
| Evidence pack rerun | Exact match on every before, after and never count in §3 |
| Comment hygiene | `check-comment-hygiene.sh` exit 0 on both new files |
| `SKILL.md` | `validate_document.py` VALID, 0 issues, and `check-repo-rules.cjs` 9 of 9 PASSED |
| Privacy | No marker, user path, `jsonl` name or session id in either baseline file |
| Speed | 244 sessions in 45 seconds wall time |
| Strict validation | See the parent's recursive `validate.sh --strict` run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Replies cluster by session.** The intervals treat replies as independent, so they understate between-session uncertainty.
2. **Shell writes are invisible.** A Codex write through `sed -i` or a redirect is not counted, only `apply_patch`.
3. **Pattern detection.** Requested tables are a keyword heuristic, and the document bucket rarely fires.
4. **Two runtimes.** Devin, Cursor, Pi and OpenCode have no adapter yet.
<!-- /ANCHOR:limitations -->

---
