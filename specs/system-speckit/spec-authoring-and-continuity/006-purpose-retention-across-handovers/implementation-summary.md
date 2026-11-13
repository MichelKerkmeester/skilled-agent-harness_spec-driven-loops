---
title: "Implementation Summary"
description: "The research has not run yet and nothing was built. This file records the packet state before the two /deep:research lineages start."
trigger_phrases:
  - "purpose retention across handovers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers"
    last_updated_at: "2026-11-13T21:18:47Z"
    last_updated_by: "generate-context"
    recent_action: "Compiled the merged research report from two DeepSeek lineages"
    next_safe_action: "Plan a build packet for the read-side purpose carry and the create.sh fix"
    blockers: []
    key_files:
      - "specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/research.md"
      - "specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md"
    session_dedup:
      fingerprint: "sha256:a9e090cc0814231b3d53fff7965df883b1cf4deb229defddd01a4611f2bc8af6"
      session_id: "scaffold-006-purpose-retention-across-handovers"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45"
      workspace: "/Users/michelkerkmeester/worktrees/public/371-purpose-retention-research"
      savedAt: "2026-11-13T21:18:47Z"
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
| **Spec Folder** | 006-purpose-retention-across-handovers |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

No code was built. This is a research packet. The run found that the purpose of a packet is written once, in the Problem & Purpose section of `spec.md`, and that no hop carries it: the compaction brief, the resume brief, the save record and the relaunch note all leave it out.

### Keep a packet's core purpose across handovers and compactions

The recommended change is to quote the purpose on the read side, in the resume brief, the compaction brief and the relaunch note, and to make an unfilled purpose in a new phase parent fail a check. The first version of this summary said to stop `create.sh` writing a generic purpose. Planning showed that text is dead code, and `research/research.md` section 9 records the correction. You get `research/research.md`, which says where a packet's problem, purpose and user need drop on each hop and names one change that keeps them. A later packet plans and builds that change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Fills the problem, scope, requirements and the five research questions |
| `plan.md` | Modified | Fills the executor settings and the three phases |
| `tasks.md` | Modified | Mirrors the five research questions as tasks |
| `implementation-summary.md` | Modified | Records what the research found |
| `research/research.md` | Created | The merged synthesis of both lineages, with the citation checks and the adjudication |
| `research/resource-map.md` | Created | The files both lineages read |
| `decision-record.md` | Created | The two setup decisions the operator made |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Two `cli-deepseek-harness` lineages on `deepseek-v4.1-flash-1017` at max ran 5 iterations each in worktree 371, about 8 minutes each. The orchestrating session merged the registries, opened the key citations itself and had the merged report compiled from both lineage syntheses. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Leave the recommendation open in `spec.md` | The research must test the operator's candidates, not assume one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Fan-out run | PASS, exit 0, 2 of 2 lineages completed with 5 iterations each |
| Citations in `research/research.md` | PASS, 68 of 68 `[SOURCE:]` tags resolve to an existing path and line |
| Citations opened by the orchestrating session | 9 confirmed, 2 of them with a corrected line number. 2 corpus counts not reproduced exactly |
| `validate.sh --strict` | `RESULT: PASSED`, Errors 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Same-model lineages.** Both lineages ran the same model, so their agreement is not corroboration. The orchestrating session opened the key citations itself.
2. **The hop where the loss happens was not measured.** Behavior after a compaction is not observable from the repository, so the choice between the two recommended fixes rests on judgment.
3. **Several corpus figures are lineage-reported.** The parent and child overlap figures and the corpus totals were not rechecked.
4. **One lineage wrote unreliable timestamps.** `deepseek-2` stamped 4 of 7 state rows after the run ended.
5. **Two lineage citations do not resolve.** The validator warns that 2 of 223 `[SOURCE:]` tags under `research/lineages/` point past the end of a file. The merged report does not reuse them.
<!-- /ANCHOR:limitations -->

---


