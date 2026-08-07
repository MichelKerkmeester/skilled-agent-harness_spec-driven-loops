---
title: "Changelog: Documentation Truth Audit [010-documentation-truth-audit/root]"
description: "Chronological changelog for the Documentation Truth Audit spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/010-documentation-truth-audit` (Level 2)

### Summary

Phase 010 dispatched a genuine 10-iteration deep-review to `openai/gpt-5.5-fast` checking whether the public root README and the project's agent-instruction files had drifted from everything packet 030 shipped across phases 001 through 009. The review found 0 P0, 4 P1 and 1 P2 finding. All five were fixed.

### Before vs After

**Before**

The public README still called the Spec Kit section "Documentation" after the framework had already been renamed elsewhere in the same file. The Goal plugin sat as a 3-line bullet under Commands rather than getting its own feature section like every comparable capability. The public Deep Loop section described autonomous execution without disclosing that fan-out can run with elevated CLI permissions, or naming the stall watchdog, cost cap and lag-ceiling guardrails phase 009 shipped. This phase's own draft graph metadata still carried the retired Spec Kit label as a live entity, and one of the review's own iteration narratives had a verdict/final-line self-contradiction.

**After**

The README's Spec Kit section now reads "Framework" everywhere, TOC, heading and anchor alike. The Goal plugin has its own FEATURES subsection, preserving the accurate wording a separate concurrent session had already corrected mid-review, with the old Commands bullet trimmed to a cross-reference. The Deep Loop section now names the permission boundary and the shipped guardrails directly. This phase's own metadata was regenerated after its task wording was corrected, confirmed clean by grep, and the review's own iteration-5 artifact was corrected to match its body text.

**Impact**

The public-facing documentation now matches what the packet actually shipped. `AGENTS.md` and `AGENTS_Barter.md` were independently re-checked and confirmed to need no changes, since both operate at policy level rather than restating implementation detail.

### Added

- A new `### 🎯 Goal Plugin` FEATURES subsection in `/README.md`, with a matching table-of-contents entry.
- A "Bounded autonomy" bullet in the Deep Loop Runtime section of `/README.md`, naming the permission boundary and shipped guardrails.

### Changed

- `/README.md`'s Spec Kit section (TOC, heading, anchor) renamed from "Documentation" to "Framework".
- `/README.md`'s Commands > Utility Goal bullet trimmed to a cross-reference.
- This phase's own `tasks.md` task wording, `description.json` and `graph-metadata.json`.

### Fixed

- A stale retired-label entity in this phase's own derived graph metadata.
- A verdict/final-line self-contradiction in the review's own `iteration-5.md`.

### Verification

- 10/10 review iterations independently verified (3 required artifacts checked per iteration before the next was dispatched).
- Whole-repo grep confirmed no remaining reference to the old Spec Kit anchor or label after the rename.
- `review/review-report.md` verdict: PASS (`hasAdvisories=true`), all 5 findings resolved with cited evidence.

### Files Changed

| File | Change |
|------|--------|
| `/README.md` | Spec Kit Framework rename, Goal Plugin FEATURES subsection, Deep Loop safety-posture disclosure |
| `010-documentation-truth-audit/tasks.md` | Task wording corrected to avoid restating the retired label |
| `010-documentation-truth-audit/description.json`, `graph-metadata.json` | Regenerated |
| `review/iterations/iteration-5.md` | Verdict/final-line mismatch corrected |

### Follow-Ups

- None. All findings this phase surfaced were in-scope and resolved.
