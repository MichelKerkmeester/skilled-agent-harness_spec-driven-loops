---
title: "Implementation Summary: system-deep-loop runtime alignment (investigation)"
description: "Investigation done, build not started: the system-deep-loop runtime has 131 files without a header among other sk-code-opencode drift, and the folder-merge list is fact-checked."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode"
    last_updated_at: "2026-09-30T05:43:47Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-align-runtime-code-with-sk-code-opencode"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: system-deep-loop runtime alignment (investigation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-align-runtime-code-with-sk-code-opencode |
| **Completed** | Not complete: investigation only, 2026-09-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No runtime code has changed yet. What exists is the measured size of the drift and a fact-checked list of the folder merges, so the loop can start from numbers rather than impressions.

### Investigation

The system-deep-loop runtime has 131 files without a header, 68 in-scope files without numbered sections, 9 code folders without a README, and no ARCHITECTURE.md. The sk-code-opencode checker misses all of it in its default mode. Of the proposed folder merges, 3 of 4 DeepSeek merge proposals survive; `deep-research-authority` is rejected.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Measured drift, scope and fact-checked merge table |
| `scratch/investigation/devin-swe2max-merge-factcheck.md` | Created | SWE-2 MAX importer-level verdict on every merge proposal |
| `scratch/investigation/devin-swe2max-merge-factcheck.brief.txt` | Created | The exact brief sent, so the check can be rerun |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A census script counted headers, numbered sections, divider shapes and README coverage. DeepSeek V4.1 Flash at `high`, through cli-pi on `opencode-go`, judged the folder layout with read-only tools. SWE-2 MAX, through cli-devin in `auto` mode, then checked every merge claim against the real importers. The census script and the DeepSeek reports live in `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode/scratch/investigation/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Test files get the header but not numbered sections | Operator decision 2026-09-30; roughly halves the loop |
| No merge moves without a SWE-2 MAX CONFIRMED verdict | DeepSeek's layout claims were wrong or overstated in checked cases |
| Checker flags are the loop's done signal | The default checker reports 0 findings, so it cannot tell the loop when to stop |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `verify_alignment_drift.py` default mode | 0 findings, which shows the gap, not alignment |
| Merge claims | Fact-checked by SWE-2 MAX; the riskiest claim re-read by hand |
| Runtime tests | Not run yet; the baseline is the first build task |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The section count is a regex heuristic.** A file whose dividers use an unusual numbering shape may be counted as missing; the checker flag replaces the heuristic.
2. **One DeepSeek claim was wrong here.** DeepSeek said `cutover-binding` had one importer; it has five, one of them a dynamic `import()`.
<!-- /ANCHOR:limitations -->

---
