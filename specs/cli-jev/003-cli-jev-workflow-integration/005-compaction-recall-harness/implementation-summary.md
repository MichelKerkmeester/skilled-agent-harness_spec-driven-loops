---
title: "Implementation Summary: Compaction Recall Census (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one read-only census that scores what host compactions keep and prints a stop line for a deletion arm on either backend, Jev or Deem, and no result exists."
trigger_phrases:
  - "compaction recall census summary"
  - "score-compaction-recall status"
  - "compaction census planned"
  - "compaction census results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness"
    last_updated_at: "2026-09-27T09:25:00Z"
    last_updated_by: "phase-amendment-leaf"
    recent_action: "Amended the later-arm text for two backends, Jev and Deem"
    next_safe_action: "The operator names 10 to 20 session files, then write the parser and the fit column"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Can a deletion pass on either backend fit these sessions at all"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Compaction Recall Census (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-compaction-recall-harness |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no code, fixture, report or measurement exists for it.

### Phase 5: compaction-recall-harness

The plan is one read-only census, `score-compaction-recall.mjs`, under system-spec-kit's runtime scripts. It streams the session files the operator names, finds every compaction boundary and prints, per boundary, what the stock summary and the recorded brief keep under five must-survive rules and whether the vendored staged fit can hold the history. One stop line then says whether an offline deletion arm on either backend is worth specifying. It makes zero model calls, spawns neither `jev` nor `cli-deem` (proposed, phase 008), needs no key and prints counts and scores, never transcript text. See `spec.md` for the requirements and the stop line and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Authored, then amended for two backends | Planning documents for this phase. No code file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written from recommendation R19, with R11 folded in, and proposed phase 005 in `../004-deep-research-expansion/research/research.md`, under the parent goal's decision D5. The later-arm text was then amended for two backends per `../007-classifier-deep-research/research/research.md` section 14, R19 and C9, under parent goal D1 and D5. The census and its stop line did not change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The census has no model code path | The fit column can end the idea with a number before any key is needed, and a later arm keeps its own `--deem` or `--jev` switch and its own preconditions. A Deem arm is preferred for the operator's sessions because nothing leaves the machine |
| The report holds counts and scores only | Paths, identifiers, the summary and the brief all come from transcript text. The operator opens a transcript locally by basename and line number |
| Boundaries are counted from parsed fields with the method printed | A substring match counts 270 lines where parsed records give 226, and earlier counts said 210 and 222 |
| The test goes under `runtime/tests/` | The vitest include glob only finds tests there, and the scripts README keeps that folder to scripts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build and measurement | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder at authoring time. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No numbers exist yet.** The fit throws, the reduction bound, the kept-token ratio and both recall columns are UNKNOWN until the census runs.
2. **The census needs an operator step.** The operator names 10 to 20 session files. The script never picks transcripts on its own.
3. **Recall is rule-derived.** Whether it agrees with a reader's judgment waits on the operator's 3-session read after the census.
<!-- /ANCHOR:limitations -->

---
