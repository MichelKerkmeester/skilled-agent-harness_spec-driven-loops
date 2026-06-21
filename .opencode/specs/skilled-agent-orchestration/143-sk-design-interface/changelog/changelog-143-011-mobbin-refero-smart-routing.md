---
title: "Changelog: Mobbin and Refero smart routing [143-sk-design-interface/011-mobbin-refero-smart-routing]"
description: "Chronological changelog for the Mobbin and Refero smart routing phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/011-mobbin-refero-smart-routing` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/143-sk-design-interface`

### Summary

Status: DONE. The Mobbin and Refero integration started as passive, ON_DEMAND and user-driven. The skill now decides whether a real-world reference would sharpen the default it plans to deviate from, then acts with initiative when it clearly helps and a subscription is connected, asks when the case is borderline and falls back otherwise.

### Added

- Added the "Deciding whether to consult (initiative or ask)" gate to `design_references_mcp.md` section 3.
- Added category taxonomy, initiative or ask behavior, fall-back behavior and source pick.
- Added the section 1 pointer to the gate.
- Added `SKILL.md` section 4 ALWAYS rule 7, which decides at the critique step by initiative or ask.

### Changed

- Reframed the `SKILL.md` section 2 resource row from ON_DEMAND to INITIATIVE/ASK with the source split.
- Bumped version to `v1.5.0.0` and added the changelog.
- Confirmed existing guardrails remain intact: one reference, no chooser, read live, never copied and grounding upstream.
- Strict-validated this phase.
- Reconciled the parent map and `children_ids`.
- Marked all tasks complete.
- Confirmed no blocked tasks remain.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Section 3 gate | PASS: initiative, ask and fall-back gate present with category list. |
| Source-pick heuristic | PASS: Mobbin for app and iOS, Refero for web and styles. |
| `SKILL.md` surface | PASS: resource row and ALWAYS rule 7 surface the gate. |
| Existing guardrails | PASS: one reference, no chooser and read-live rules unchanged in section 4 hard rules. |
| `validate.sh <this phase> --strict` | PASS: exit 0. |
| Tasks complete | PASS: 10 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `references/design-grounding/design_references_mcp.md` | Modified | Section 3 hybrid gate, taxonomy and source pick, plus section 1 pointer. |
| `SKILL.md` | Modified | Section 2 INITIATIVE/ASK row and section 4 ALWAYS rule 7. |
| `changelog/v1.5.0.0.md` | Created | Changelog and `SKILL` version to `1.5.0.0`. |

### Follow-Ups

- Subscription-connected detection is a judgment, not a probe. The gate says "when a subscription is connected". The skill infers this from whether the Mobbin and Refero Code Mode manuals resolve, and asks when unsure rather than blindly calling.
- The category taxonomy is a guide, not exhaustive. It names common convention-heavy categories. The underlying test remains whether the real-world default is strong enough to be worth naming.
