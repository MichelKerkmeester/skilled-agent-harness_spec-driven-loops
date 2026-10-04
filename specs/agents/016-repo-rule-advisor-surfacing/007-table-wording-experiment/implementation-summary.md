---
title: "Implementation Summary: Table wording experiment"
description: "In progress. The pre-registered test of the table block in communication.md is running in isolated test environments."
trigger_phrases:
  - "table wording experiment summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment"
    last_updated_at: "2026-10-04T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Committed the pre-registration and started the isolated-environment run"
    next_safe_action: "Finish the 600 runs, then score them and apply the decision rule (tasks.md T008 and T009)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "preregistration.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Table wording experiment

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-table-wording-experiment |
| **Completed** | In progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The pre-registration is committed and the experiment is running. It compares the current table block in `communication.md` with a 152-byte imperative in isolated test environments, so the live rule files stay unchanged and the 006 window stays clean.

### Phase 7: table-wording-experiment

The plan comes from the verdict in `../002-rule-concision-and-loading/research/research.md`. At the operator's request to run now, the live ABAB time blocks gave way to two arms built by `rule-experiment.py` from commit `edba53daeb`, with 600 runs across DeepSeek and Luna interleaved in a seed-16 order.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created, then amended | Planning documents, amended for isolated environments |
| `preregistration.md` | Created | Metric, sample, schedule and decision rule, committed in `edba53daeb` |
| `experiment/arms.json`, `experiment/prompts.json` | Created | The two arms and the 30 prompts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. Planned with `/speckit:plan` in auto mode after a four-agent codebase exploration shared across phases 003 to 008. The pre-registration landed before any scored run, and a 16-run pilot, excluded from the result, set the run counts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Phase order 003 to 008 | Measurement and gates land before any rule or loading change |
| Isolated environments instead of live blocks | The operator asked to run now. Environments leave the live rule files unchanged, so the 006 window and the experiment no longer compete |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Planning docs | `validate.sh specs/agents/016-repo-rule-advisor-surfacing --strict --recursive` returned RESULT: PASSED on 2026-10-04 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Run in progress.** REQ-002 to REQ-004 are open until the run finishes and is scored.
2. **Fixture, not live use.** The result covers two executors on a fixture project. Phase 009 measures live delivery.
<!-- /ANCHOR:limitations -->

---
