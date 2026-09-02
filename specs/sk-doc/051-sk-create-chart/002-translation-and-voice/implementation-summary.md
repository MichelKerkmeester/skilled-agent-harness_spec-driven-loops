---
title: "Implementation Summary [template:level-3/implementation-summary.md]"
description: "Seven authored lieflat-charts documents became English with zero Chinese left, the voice scanner clean and every divergence between literal and natural recorded."
trigger_phrases:
  - "implementation"
  - "summary"
  - "translation complete"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/002-translation-and-voice"
    last_updated_at: "2026-09-02T10:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Translated all seven authored documents and wrote the divergence log"
    next_safe_action: "Phase 4 picks up the 39-file non-prose remainder inventoried in the translation log"
    blockers:
      - "Licence conflict between the source PolyForm Noncommercial 1.0.0 and this MIT repository is escalated to the operator and gates adoption, not this phase"
    key_files:
      - "specs/sk-doc/051-sk-create-chart/002-translation-and-voice/scratch/translated/SKILL.md"
      - "specs/sk-doc/051-sk-create-chart/002-translation-and-voice/research/translation-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-translation-and-voice"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Are the README chart counts 15/13/18 a deliberate primary-tier count or stale numbers"
      - "Does the adopted skill keep the bilingual report pair"
    answered_questions:
      - "User-visible template strings count as authored text, and phase 4 translates them"
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
| **Spec Folder** | 002-translation-and-voice |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The seven authored documents of the `lieflat-charts` source are now English. That is 15,775
Han characters gone from `scratch/translated/SKILL.md` and its six siblings, with the
voice scanner exiting 0 on all of them and every place where a literal rendering and a
natural one pulled apart written down in `research/translation-log.md`.

The log is the part that matters most. A rewrite dressed as a translation leaves no
evidence unless something records it, so 37 divergences, 7 source defects, 9 disagreements
with the upstream English README and 7 accepted voice exceptions each carry a row with the
choice and the reason.

### English primary text

Every authored word now reads as English while still claiming what the Chinese claimed.
Section order, emphasis and heading depth are untouched, because those are part of what is
being adopted rather than something to improve during a translation. A structural
comparison confirms it: heading level sequence, table row count, bullet count, numbered
item count and code fence count are identical between each source file and its
translation, in all seven files.

Where the source says something that looks wrong, it was translated faithfully and logged
as a finding. The README's chart counts of 15, 13 and 18 disagree with `catalog.md`, and
they survive into the translation unchanged, with the derivation and the open question
recorded.

### A validator collision that phase 4 has to fix

`scripts/validate.mjs` in the source asserts Chinese string literals against `SKILL.md`
and `catalog.md`. Running its 40 document-level assertions against the translated files
gives 38 passes and 2 failures, and both failures are structural rather than accidental:
any faithful translation breaks an assertion written in Chinese. The parent packet makes
"the source's `validate.mjs` runs green from the new path" a handoff criterion, so this
was found before it could surface as a mystery at phase 5.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/translated/SKILL.md` | Created | The workflow and rules document, 8,304 Han translated |
| `scratch/translated/README.md` | Created | The project guide, 3,180 Han translated |
| `scratch/translated/catalog.md` | Created | The 64-chart data-contract index, 1,986 Han translated |
| `scratch/translated/report-catalog.md` | Created | The 12-template report index, 1,010 Han translated |
| `scratch/translated/templates/color/README.md` | Created | Colour restyle guidance, 652 Han translated |
| `scratch/translated/examples/README.md` | Created | Worked-example notes, 515 Han translated |
| `scratch/translated/THIRD_PARTY_NOTICES.md` | Created | Third-party licence notice, 128 Han translated, not in the original brief |
| `research/translation-log.md` | Created | Divergences, source defects, README disagreements, voice exceptions, licence chain and the whole-tree census |
| `acceptance-criteria.md` | Modified | Criteria rows for the five requirements, each with observed evidence |
| `implementation-summary.md` | Modified | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Chinese was read first and treated as the source of truth. The upstream `README.en.md`
was opened only afterwards and only as a cross-check, which is what let 9 disagreements
between the two surface instead of being absorbed. Reading it first would have turned the
job into copy-editing someone else's summary.

Four checks ran against the finished set. A Unicode scan over Han plus CJK punctuation
returned 0 characters across all seven files. `hvr_scan.py` exited 0 with no hard blockers
in any file. A structural profile matched every source against its translation on five
independent counts. The source validator's own document assertions were replayed against
the translated files to find what translation breaks.

One correction arrived mid-task. The brief's file list was a subset, so the whole tree was
swept rather than the list, which found `THIRD_PARTY_NOTICES.md` as an eighth authored
document and produced a census of all 45,778 Han characters across 60 files. That census
is the work list phase 4 inherits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Localized asset paths and locale URL segments stay exactly as the Chinese has them | Re-pointing an image is a content decision, not a translation. The upstream English variants exist on disk, so phase 4 can swap them with full information |
| The broken language switcher is rendered literally and flagged | Deleting it would drop a section, which is the same failure as a rewrite. The defect is now visible rather than tidied away |
| Template strings are authored text, and phase 4 translates them | Editing those files needs the render proof that is phase 4's handoff criterion. Doing the edit here would move the work without moving the check that makes it safe |
| The `.zh.html` report templates stay Chinese | They are the Chinese half of a bilingual feature. Translating them deletes the feature rather than adopting it |
| Empty-cell em dashes in the catalog tables became the word None | Em dash is a hard blocker and the cell meant "no sister chart", which None says outright |
| Source defects are logged, never fixed inside the translation | A fix folded into a migration is a fix nobody can review separately |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Chinese residue, Han plus CJK punctuation, 7 files | PASS. 0 characters |
| `hvr_scan.py` over the 7 translated files | PASS. Exit 0, hard blockers 0 in every file |
| `hvr_scan.py` over `research/translation-log.md` | PASS. Exit 0, 86 out of 100 |
| Structure match against source, 5 counts per file | PASS. Identical in all 7 files |
| Source `validate.mjs` document assertions | 38 of 40 pass. The 2 failures are Chinese literals that any translation breaks, recorded for phase 4 |
| Character census reconciliation | PASS. The brief's 6 files sum to 15,647, plus 128 for the notices file, giving the 15,775 measured |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The non-prose remainder is inventoried, not translated.** 17,463 Han characters across
   39 files hold gallery chrome, colour sample chrome, build comments in the shared JS and
   the two scripts, the report index and the comment blocks inside the misleadingly named
   `.en.html` templates. Every one of those files has to still render after editing, which
   is proved by the source's own scripts at phase 4.
2. **A further 12,538 Han across 13 files is Chinese by design.** The 12 `.zh.html` report
   templates and the Chinese worked example are the Chinese half of a bilingual feature.
   Whether the adopted skill keeps them is a placement decision.
3. **The English README is not an independent check on the chart counts.** It repeats the
   same 15, 13, 18 and 49 figures that disagree with `catalog.md`, so agreement between
   the two English sources proves nothing there.
4. **The source has no per-file licence headers.** The whole notice chain is `LICENSE`, the
   README licence section and `THIRD_PARTY_NOTICES.md`. Two of those three are documents
   this phase rewrote, and both kept their notices intact, verified by grep.
5. **Four questions stay open.** They are listed with what would settle each one in section
   10 of the translation log. Git cannot settle the chart-count question, because the clone
   holds a single squashed commit with no before state.
<!-- /ANCHOR:limitations -->

---
