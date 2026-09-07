---
title: "Implementation Summary: Phase 13: shadcn-reference-research"
description: "Six cited research angles against a frozen shadcn corpus: keep the corpus's question-first forms and role palette, adopt token indirection, local tooltip knobs and explicit curve variants; four items wait on policy."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research"
    last_updated_at: "2026-09-07T12:45:40Z"
    last_updated_by: "template-author"
    recent_action: "Closed the research packet and opened its successor"
    next_safe_action: "Implement 014-shadcn-adoptions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:fbcd5f76b7049b740a03d8c454d8e91f52d6bd8ee83203ec22344058e8ff160f"
      session_id: "scaffold-013-shadcn-reference-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-shadcn-reference-research |
| **Completed** | 2026-09-07 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A frozen copy of shadcn's chart machinery and its 70 registry charts was read six ways against the shipped 26-form corpus, and every decision was judged with a citation. The verdict is mostly that the corpus is already better where it differs: question-first cataloging instead of 70 files, the deliberate radar and pie omissions, the role-split palette whose light categorical minimums measure 92.9 degrees of hue gap and 3.37:1 contrast against shadcn's 16.0 degrees and 1.72:1, direct paths with explicit gaps, and a corpus-wide table fallback where shadcn's accessibility layer covers 38 of 70 files. Three shadcn ideas are worth carrying: semantic token indirection with per-key colours, local tooltip formatter and key-alias knobs, and explicit linear, step, monotone and normalized-stack variants when the data means it. Four items need a policy before a checker can enforce them: a browser-backed keyboard and pointer gate, a colour-vision-deficiency and hue threshold, metadata-driven data-accuracy checks and a retargetability manifest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/lineages/luna/research.md` | Created by the loop | Six angle sections and the final synthesis, every claim cited |
| `research/lineages/luna/iterations/` | Created by the loop | Six iteration records |
| `scratch/shadcn/` | Created, gitignored | The frozen upstream corpus, read never vendored |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` | Modified | Filled from the findings when the packet closed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One deep-research lineage on GPT-5.6 Luna ran six bounded iterations, one per angle, with the two non-negotiable facts stated up front: seventy files are not seventy forms, and nothing ports because the checker errors on any external reference. The lineage landed on 2026-09-07 with its metadata refreshed, but the packet's own planning documents were left as scaffolds and no successor existed, so nothing consumed the findings. This closure filled the documents from the lineage record and scaffolded `014-shadcn-adoptions` as the phase that implements the three adoptable ideas and holds the four policy questions for the operator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare reader questions, not file counts | Eight of the ten area entries restyle one form; radar's fourteen entries are one omitted form |
| Keep radar and pie out | The catalog rejects radial normalisation and arc reading with reasons; `parallel-axes` and the unit forms answer the same questions |
| Adopt ideas, never code | The checker forbids any external reference; React, Recharts and Tailwind cannot enter a standalone file |
| Report runtime behaviour as unknown | The browser inventory was empty; source handlers prove presence, not focus order or hit testing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lineage completeness | six iterations, six angle sections, a final synthesis with ranked recommendations |
| Citation discipline | every claim names a file and line in the frozen corpus or the shipped corpus |
| Chart skill untouched | no commit under `.opencode/skills/sk-design/sk-design-chart` from this phase; `check-corpus.cjs` RESULT: PASSED, 35 files, 26 forms |
| Measured colour comparison | hue gap, contrast on both grounds and CVD separation tabulated for both palettes |
| `validate.sh <this packet> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No browser ran.** Keyboard order, focus visibility, pointer reach and rendered curve overshoot are unverified and reported as such.
2. **One lineage, one model.** The sibling 008 research used two lineages; this one used one, so its verdicts carry one reading rather than an adjudication.
<!-- /ANCHOR:limitations -->

---


