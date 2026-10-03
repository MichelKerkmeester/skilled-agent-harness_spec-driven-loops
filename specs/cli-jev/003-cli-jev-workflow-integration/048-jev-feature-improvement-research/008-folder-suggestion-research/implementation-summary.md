---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research"
    last_updated_at: "2026-10-02T21:59:49Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Both lineages ran and the merged research.md was written"
    next_safe_action: "Read research/research.md for the ranked recommendations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-folder-suggestion-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-folder-suggestion-research |
| **Completed** | 2026-10-03 |
| **Level** | research |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Done. `research/research.md` ranks eight ways to improve, refine and expand the Jev spec-folder suggestion. The headline: the keep is sound against the top alternative on a fixture whose target is always wrong, so a real-save corpus with final destinations, a description fix and a candidate-recall measure come before any integration.

### Phase 8: folder-suggestion-research

When this phase closes you can read ranked ways to improve, refine and expand the Jev spec-folder suggestion in `research/research.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | The research question and scope, plus the generated findings block |
| `research/research.md` | Created | Merged ranked research from both lineages |
| `research/lineages/` | Created | DeepSeek and Luna lineage state, iterations and reports |
| `research/findings-registry.json` | Created | Merged findings registry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/deep:research` fan-out ran DeepSeek V4.1 Flash (max, cli-pi, 5 iterations) and GPT-6 Luna (max, fast, cli-codex, 3 iterations) side by side through `fanout-run.cjs`. The session then ran the command's synthesis phase: `fanout-merge.cjs`, the resource map, the merged `research.md`, `synthesis-closeout.cjs` and the spec findings writeback.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two lineages from two model families | The operator asked for DeepSeek and Luna on every feature |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records | deepseek 5, luna 3 |
| Synthesis closeout | `synthesis_complete`, exit 0 |
| Session spot-checks | target right 0/40, label at alternatives[0] on 30, 81 of 120 calls at 1.0, confidence gating at 70 calls, f022-001 picks at 0.52/0.58/0.48, 9 copies of 001-deep-research/description.json, chooseBaseline counting on the labeled rows, and the three-candidate cap |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Research only.** Nothing here changes a scorer or a live workflow.
2. **DeepSeek's delta rows were normalized.** Its 40 findings used `claim` where the delta contract names `label`, so the first closeout failed its reconstruction invariant. The session copied `claim` into `label` without changing any text, and the merged ledger still holds the two `synthesis_incomplete` events from before the fix.
<!-- /ANCHOR:limitations -->

---


