---
title: "Implementation Summary: A Level For Research"
description: "A research level plus the six enumerations that had to accept it, and a shell rule that never knew non-numeric levels existed."
trigger_phrases:
  - "research level summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/010-a-level-for-research"
    last_updated_at: "2026-08-30T12:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added a research level and taught every level enumeration about it"
    next_safe_action: "Consider whether review should accept per-lineage reports"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: A Level For Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-a-level-for-research |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`levels.research` in `templates/spec-kit-docs.json`: `requiredCoreDocs` is
`spec.md` alone, with `research/research.md` among the lazy addons, mirroring how
levels 1 and 2 already treat it.

Six enumerations now accept it — the `SpecKitLevel` type and `VALID_LEVELS` in
`level-contract-resolver.ts`, `VALID_LEVELS`, the `SPECKIT_LEVEL` marker regex
and `normalizeLevel` in `orchestrator.ts`, `normalizeSpecKitLevel` in
`spec-doc-structure.ts`, and `normalizeLevel` in `scripts/utils/template-structure.js`.

`scripts/rules/check-level-match.sh` had twelve patterns matching `[123]\+?`, so
it knew nothing of `phase`, `review` or `research`. All twelve now accept the
manifest's full level set.

Thirteen packets declare their real shape: eleven `research`, two `review`.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The contract was set from the corpus rather than from taste. A first draft made
`research/research.md` a required core doc, which pulled it into shape grading
and failed it on anchors. Measuring first would have prevented that: only 1 of
the 11 research files in scope carries anchors, 127 of 408 corpus-wide, and eight
packets pass today with an anchorless one. So the template was never that file's
operative contract, and it went back to being a lazy addon.

The enumerations were found by following failures rather than by grepping and
hoping. Declaring the level produced four distinct errors in sequence — an
unsupported-level throw from the orchestrator, a second throw from the spec-doc
structure module, an unresolved contract from the shell helper, and an
invalid-level report from the shell rule — each naming its own source.

That last one exposed a defect older than this work. `check-level-match.sh`
never recognised the non-numeric levels, and its invalid-declaration check only
fires when no level was extracted at all. So a packet declaring `review` beside a
numeric metadata row was silently graded at the number, and one declaring
`review` alone was reported as invalid. Both were pre-existing; the research
level only made them visible.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Add a level rather than author plan and task documents | Writing an implementation plan for work that had no implementation phase makes the gate green by making the packet lie |
| `requiredCoreDocs` is spec.md alone | Requiring research.md would grade a shape 69% of research output has never had |
| Apply only to packets already carrying research or review output | The level describes shape; using it on a bare packet would make it a way to skip plan and tasks |
| Leave the 76 spec-only leaves alone | 61 are Draft, Planned, or unstarted, and the gate is right about them |
| Leave a misnamed folder failing | `advisor-state-containment` breaks the folder-naming convention, and that is the correct finding rather than something to relabel |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Contract resolves | PASS | Helper returns `spec.md` for research, `spec.md review/review-report.md` for review |
| Research-shaped packets pass | PASS | 11 of 11 |
| Review-shaped packets pass | PASS | 2 of 2 |
| No regression | PASS | Pinned sample 277 to 281 of 300; 0 regressed, 4 newly passing |
| Gate green | PASS | `test:validation` exit 0 |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `review` level still requires a top-level `review/review-report.md`.**
   Deep-review writes per-lineage reports under `review/lineages/<name>/`, so the
   two packets fixed here happened to have a promoted report and others will not.

2. **Eight packets carry a `review/` with no top-level report and are unfixed.**
   They need either a promoted report or a looser review contract, which is the
   open question above.

3. **Nothing prevents a packet declaring `research` to avoid plan and tasks.**
   The level is an author's declaration, as every level is; it was applied here
   only where research or review output already existed.

<!-- /ANCHOR:limitations -->
