---
title: "Implementation Summary: Repo rule surfacing through the advisor"
description: "Two Devin lineages refused both an advisor pointer and a trigger-index root for repo rules; the only admissible surface, an action-keyed advisory, waits on a miss rate nobody has measured."
trigger_phrases:
  - "repo rule advisor verdict"
  - "advisor should not suggest repo rules"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing"
    last_updated_at: "2026-10-04T12:55:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Synthesized the two-lineage deep-research run and checked its citations"
    next_safe_action: "Operator decides whether to open a build packet for the logging-only Gate 5 observer"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:54ee183654f31f92302412e642f2f37477043515e93ca377b5f035ccdcbe4edf"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "What is the real Gate 5 miss rate in sessions that write?"
    answered_questions:
      - "Should the skill advisor suggest repo rules? No."
      - "Should .skilled/repo-rules join the trigger index? No, already a recorded decision."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Repo rule surfacing through the advisor

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-advisor-surfacing |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor should not suggest repo rules, and the trigger index should not index them. Two independent model families reached that in four iterations each, and the repository had already recorded the second half as a decision.

### Repo rule surfacing through the advisor

You now have a verdict on every candidate surface. An advisor pointer restates what the always-loaded document carries and no gate enforces it, the profile an earlier research round refused eighteen times. A trigger-index root reverses a test-enforced exclusion in `retrieval-conventions.md` §9 and matches prompt topic where the router matches action. The one admissible family is an action-keyed PreToolUse advisory, and even that waits on a number: how often a session that writes skips the rule it needed. Nobody has measured it, so the recommended next step is a logging-only observer that measures it at zero context cost.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Question, scope, and the generated findings block |
| `plan.md`, `tasks.md` | Created | Run plan and task record |
| `research/` | Created | Two lineages, merged registry, resource map, synthesis |
| `specs/agents/graph-metadata.json` | Modified | Track root lists the new packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`/deep:research:auto` fanned out to two `cli-devin` lineages, `swe-2-max` and `deepseek-v4-1-flash-max`, four forced iterations each, run concurrently in about 17 minutes. The operator approved `dangerous` permission mode for the task. Both lineages wrote only inside their own directories. The orchestrator merged them, opened the citations the verdict rests on, and corrected one lineage claim about the corpus checker.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Report the lineages' split on the PreToolUse advisory instead of averaging it | They disagree on whether to measure before building; the repository's recorded measurement rule decides that, not a tally |
| Withdraw the orchestrator's pre-run recommendation to index repo rules | It missed the recorded exclusion in `retrieval-conventions.md` §9, which both lineages found |
| Recommend a logging-only observer as the next step | It supplies the miss rate both lineages lacked, without spending any model context |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iterations on disk | PASS: 4 iteration files and 4 iteration records per lineage, each with `target_agent: deep-research` |
| Containment | PASS: no containment advisory; `git status` shows changes only inside the packet and the track root |
| Citations | PASS with one correction; see `research/research.md` §9 |
| Strict validation | See the final validate run in the session close-out |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No miss-rate data.** Every recommendation about the PreToolUse advisory depends on a frequency nobody has logged.
2. **Lineage measurements unchecked.** The byte costs, index-growth estimate and scorer simulation were measured by the lineages and not re-run by the orchestrator.
3. **`swe-2-max` registry not reduced.** Its own findings registry is empty; the merge reconstructed its 43 findings from the lineage state log, beside 34 from `deepseek-v4-1-flash-max`.
<!-- /ANCHOR:limitations -->

---
