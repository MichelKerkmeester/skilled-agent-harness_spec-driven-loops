---
title: "Implementation Summary: Phase 2: baseline-and-decisions"
description: "Frozen census at commit 5285608745, the call-site answer, the sk-doc addendum, D1 to D4 drafted and a two-family labeled sample; operator approval of D1 to D4 is the one open item."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions"
    last_updated_at: "2026-10-04T08:04:51Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase closed: decisions approved with the UX condition"
    next_safe_action: "Start phases 003 and 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-baseline-and-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-baseline-and-decisions |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The numbers are now frozen at one commit, and four decisions are approved, with your condition on UX and command surfaces written into them. Every count reproduces byte for byte from git objects at `5285608745`. The two `contextType` code lists turned out to describe sessions, not documents. A citation sample labeled by two model families shows that line drift into markdown is common. Anchor markers are rare where it happens, though, so the phase 006 threshold as written points to not building it.

### Phase 2: baseline-and-decisions

`baseline.md` gives each later phase its starting numbers. Spec docs carry 33 distinct `contextType` values and 842 `importance_tier` values outside the six-value list. Only 18% of `[SOURCE:]` tags in spec docs resolve directly and in range, which is why the R1 check covers new packets only. `decision-record.md` holds D1 to D4, each with context, evidence, an owner and alternatives. The D3 threshold was fixed at 08:33:14Z, before any label existed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `baseline.md` | Created | Frozen counts, call-site answer, sk-doc addendum, labeled sample |
| `decision-record.md` | Created | D1 to D4 as ADR-001 to ADR-004 |
| `scratch/census.py`, `scratch/sample_draw.py`, `scratch/agreement.py` | Created | Reproducible census, seeded draw and agreement figures |
| `scratch/census-5285608745.json`, `scratch/sample-rows.jsonl`, `scratch/labels-claude.jsonl`, `scratch/labels-deepseek.jsonl`, `scratch/agreement.json` | Created | Raw output the records cite |
| `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Modified | Plan, task state and closure evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This session ran the census and wrote the records. Two read-only Opus subagents traced the `contextType` call sites and inventoried the sk-doc frontmatter checks. I opened the cited lines behind both reports before using them. The labels came from a Claude subagent and from DeepSeek V4.1 Flash at max through `cli-pi` with read-only tools, both blind to each other. I hand-checked five rows.

The scripts read git objects, never the working tree. A first working-tree count disagreed with the census by 27 docs: 30 tracked skill docs are symlinks, and reading the working tree counts their targets twice. Reading blobs counts each file once.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pin every number to commit `5285608745` and read git objects | The branch head moved during the session through commits from outside it, and a working-tree read double-counts symlinks |
| Write D3 before drawing labels | The spec requires the threshold to come before the data |
| Keep D3 as written though its anchor condition fails | Counting headings instead of anchor markers would change the rule after reading the data, so it goes to the operator as an option |
| Two named `contextType` lists in one file (D1) | The code lists classify sessions, and collapsing them would change project phases and memory types |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Census reproducibility | PASS: two runs, SHA-256 prefix `44f685b3d0a25cc2` both times |
| Sample draw reproducibility | PASS: two draws, prefix `ad22a0ad75009e8c` both times |
| Call-site and addendum citations | PASS: the lists, `CONTEXT_TO_PHASE`, the advisor checker lines and the contract lines opened and matched |
| Labelers | PASS: 40 of 40 rows from each, 37 of 40 agree on miss or support |
| Research-only scope | PASS: `git status --short .skilled/skills` printed nothing |
| Operator approval of D1 to D4 | PASS: approved with the UX and command-surface condition, carried into ADR-001, ADR-002, ADR-004 and phases 003 to 007; D3 condition 3 deferred to phase 006 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Bare short names resolve badly.** Citations such as `README.md:80` are resolved to the citing folder or the repo root, which picked the wrong file in two sample rows and inflates the gone and ambiguous counts. Phase 004 should resolve them against the citing packet.
2. **The call-site answer is about 85% sure.** A writer that copies the session value into a doc may exist and was not found. Whether `post-save-review.ts` reads a real doc is UNKNOWN.
3. **One branch-head move.** The worktree head was `f4485249ed` at session start and `5285608745` at census time. Every number names the second commit.
<!-- /ANCHOR:limitations -->

---
