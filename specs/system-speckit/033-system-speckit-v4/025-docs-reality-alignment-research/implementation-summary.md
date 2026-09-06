---
title: "Implementation Summary: Docs reality alignment research"
description: "A ten-iteration DeepSeek V4 Flash lane read the spec-kit playbook, catalog and references beside the runtime and reported seventeen mismatches."
trigger_phrases:
  - "docs reality research outcome"
  - "seventeen doc mismatches found"
  - "fourteen confirmed doc findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/025-docs-reality-alignment-research"
    last_updated_at: "2026-09-06T10:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with its verification evidence"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:8cbb74ff3f328fee03136eaba620b46dab6b9f8313b246fb84c91eb3df9bc205"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-docs-reality-alignment-research |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A ten-iteration DeepSeek V4 Flash lane read the spec-kit playbook, catalog and references beside the runtime and reported seventeen mismatches; fourteen reproduced. A second, two-iteration Gemini 3.8 Flash pass over the documents the first lane never opened reported nineteen more; eighteen reproduced, including a playbook script that throws a ReferenceError. A third, five-iteration DeepSeek pass over the families still unopened reported eleven more, all reproduced, and a same-class sweep found twenty test files cited in nine documents that no longer exist. All confirmed rows were fixed in phase 027.

### The research lane

One cli-pi lineage ran the deep-research loop through the fan-out runner on OpenRouter, one angle per iteration across the seven charted angles, writing two-sided citations for every finding. The synthesized report ranks nine P1 and eight P2 rows, and the reproduction pass kept fourteen.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| research/lineages/deepseek-v4-flash-docs-reality/** | Created | Ten iteration files, state ledger, strategy, dashboard and the synthesized research.md |
| research/lineages/gemini-3-8-flash-docs-reality/** | Created | Two Gemini 3.8 Flash iterations over the documents the first lane never opened, run in a worktree |
| research/lineages/deepseek-v4-flash-docs-reality-r2/** | Created | Five DeepSeek V4 Flash iterations over the document families the first two passes never opened |
| research/confirmed-findings.md | Created | The reproduced subset with verdicts for all three passes, consumed by phase 027 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The lane launched detached through fanout-run.cjs with stop policy max-iterations and reached ten iterations in twelve minutes. Every P1 and P2 row was then opened in this session: the doc line, the runtime line or the command output. Dropped rows are recorded with the reason.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reproduce before remediating | A leaf's finding is a hypothesis; the check-completion row proved it, since the script the lane called missing exists |
| Fold F8-02 into F10-01 | One cluster of phantom rule scripts, fixed together |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration count | 10 files under iterations/, 10 iteration events in deep-research-state.jsonl |
| Angle coverage | All seven angles appear in the iteration focus lines |
| Reproduction | 14 of 17 first-pass rows reproduced; 1 dropped, 2 merged. Second pass: 18 of 19 reproduced, 1 dropped because `.opencode/specs` is a symlink. Third pass: 11 of 11 reproduced, plus a same-class sweep that found 20 phantom test citations. Verification pass: 14 residue sites confirmed and fixed, one kept as recorded output |
| Strict validation | `validate.sh <child> --strict` printed RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Containment revert** The fan-out guard treated another session's live edits under specs/sk-doc/051 as this lane's writes and reverted them from HEAD at the end of the run; that session re-applied its work within a minute. The guard's patch is kept out of git.
<!-- /ANCHOR:limitations -->

---
