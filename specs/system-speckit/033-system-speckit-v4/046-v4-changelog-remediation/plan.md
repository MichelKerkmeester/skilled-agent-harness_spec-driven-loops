---
title: "Implementation Plan: v4 changelog remediation (the 045 research pass)"
description: "Implements the 045 research report's deferred implementation pass: the Section 10 patch list in its own order, then the Section 7 order and the Section 9 outline, with the count record and the 045 quality gates. Sentinel-gated; corrections before structure so the report's line anchors hold."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: v4 changelog remediation (the 045 research pass)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown release notes (one 747-line document) |
| **Framework** | system-spec-kit packet lifecycle, Level 1, phase 46 of 033 |
| **Storage** | None — evidence lives in `scratch/` (before-copy, fact extraction) |
| **Testing** | 045's census script, the HVR scanner, extraction diff, `validate.sh --strict` |

### Overview

Implements the accepted 045 research report's deferred pass. The editing order is the report's own: corrections (Section 10-A/B/C) on the pinned structure, then the structural pass (10-D) toward Section 9's outline in Section 7's order, then the post-edit checks (10-E). Corrections come before structure so the report's line anchors hold; the structural pass locates by content because its own edits shift later lines. The skeleton counts are recorded as baseline-plus-delta, not amended into 045 (F-027).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (the 045 report, accepted and audited)
- [x] Success criteria measurable (census, HVR, greps, validations)
- [x] Dependencies identified (the pinned changelog, the report, the 045 gates)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..008)
- [ ] Tests passing (census 0, HVR 0 hard blockers, semicolon rule, both strict validations)
- [ ] Docs updated (spec/plan/tasks/implementation-summary + the 033 parent rows)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-ordered editing pass over one prose artifact — no code, no build.

### Key Components

- **The changelog** (`../CHANGELOG-v4.0.0.0.md`): the only prose edited; pinned at sha256 `33abcc9a…`.
- **The report** (`../045-.../research/research.md`): the frozen instruction set; Sections 7, 9, 10, 13.
- **`scratch/`**: the evidence — `changelog-before.md` + its sha, the fact extraction before/after, the count record.
- **The gates**: the 045 census script, the HVR scanner (`hvr_scan.py --rules hvr-rules.md`), the semicolon grep, `validate.sh`.

### Data Flow

Pinned changelog → sentinel check → before-copy archived → corrections (whole-line anchors) → count dispositions → structural pass (content-located) → extraction diff → gates → count record → continuity + parent rows → validations → one local commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The 045 gates, unchanged in criterion: the census (`changelog-prose-audit.py census`) must return 0 walls; the HVR scan (`hvr_scan.py --rules .../hvr-rules.md`) must report 0 hard blockers; no semicolon line may exist outside `&nbsp;` lines. The fact extraction (the same script's `extract`) diffs before against after so only the report's enumerated deltas moved. Structural success is the Section 7 order + Section 9 outline, checked by greps, not by numbers, because the 18/56/19/44 counts are recorded as a baseline-plus-delta (F-027), not maintained as an invariant.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The 045 research report (frozen; its L-numbers are valid only while the pin holds).
- The pinned changelog sha256 `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`.
- `045-.../scratch/changelog-prose-audit.py` (census/extract) and `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` + `references/hvr-rules.md`.
- `validate.sh` for 046 and the 033 parent (030's failure pre-existing, disclosed).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Pre-commit: `git checkout -- ../CHANGELOG-v4.0.0.0.md` restores the pinned blob byte-for-byte (the 045 precedent, proven when that packet's first rewrite corrupted the file). Post-commit: `git reset --soft HEAD~1` (the plan's named rollback; nothing is pushed, so no remote cleanup exists).
<!-- /ANCHOR:rollback -->
