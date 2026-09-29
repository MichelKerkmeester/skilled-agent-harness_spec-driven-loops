---
title: "Implementation Summary: HVR Reader-Needed Lens (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one offline Python script beside the unchanged HVR scanner that tests whether a Jev or Deem noul flags three reader-needed voice tells. It was released on 2026-09-29."
trigger_phrases:
  - "hvr reader-needed lens summary"
  - "hvr reader lens status"
  - "hvr_reader_lens planned"
  - "reader-needed lens verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens"
    last_updated_at: "2026-09-29T16:00:00Z"
    last_updated_by: "spec-author-leaf"
    recent_action: "Authored the Planned phase for R22"
    next_safe_action: "Build to the label gate in number order, released 2026-09-29 (parent goal D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-034-hvr-reader-needed-lens"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which decision a candidate list would change for an author"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: HVR Reader-Needed Lens (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-hvr-reader-needed-lens |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no script, test, labels file or skill doc exists for it.

### Phase 34: hvr-reader-needed-lens

The plan builds `hvr_reader_lens.py` (proposed) beside `hvr_scan.py`, which stays unchanged. Its default run counts flagged skill-doc sections through the scanner and the sections two lexical rules catch, with zero calls. A draw writes 150 rows for the operator to label, 50 each for synonym cycling, significance inflation and false ranges. Once labeled, a Jev arm and a Deem arm, each behind its own switch and gate, ask one `noul` per row, and each column ends in `keep`, `kill (precision)` or `stop (<reason>)` under the keep rule in `spec.md`. See `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-29 from R22's record in `../004-deep-research-expansion/research/research.md:711-729` and C13 in `../007-classifier-deep-research/research/research.md:97`. The scanner seam was reopened at the worktree HEAD: `hvr_scan.py:17-21`, `:26` and `:531-535`. A scratch count over the scanner's own functions gave the rough census in `goal.md`'s log, and `test_hvr_scan.py` printed 11 PASS and `ALL PASS`. The operator's "Bind and release" amended parent goal D3 on 2026-09-29 and released the phase, which builds in number order. Its verdict waits on the operator's 150 labels.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A sibling script, never an edit to `hvr_scan.py` | The research keeps the scanner's output byte-identical, and its floor stays the baseline |
| Three categories only | They are the research's named examples, and each has a clear question in the standard's own words |
| Candidate halves for two categories | The rough census found 2 significance-phrase sections and 786 false-range candidates among 40,946, so a random draw would carry almost no positives |
| Committed docs only | Drafts are the operator's private text and would need a D9-style gate, which belongs to a later served form |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and runs | Not run. Nothing is built |
| Planning documents | `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built yet.** The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
2. **The verdict waits on 150 labels.** The time a voice label takes is UNKNOWN.
3. **Two categories can end underpowered.** The tells are rare in committed docs, so the likeliest first result is `stop: fewer than 2 categories can pass`, which the phase records as its answer.
<!-- /ANCHOR:limitations -->

---
