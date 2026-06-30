---
title: "Changelog: Phase 15: sk-code-review Frontmatter Alignment [009-skill-frontmatter-alignment/015-sk-code-review]"
description: "Chronological changelog for the Phase 15: sk-code-review Frontmatter Alignment phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

sk-code-review's 10 reference docs now carry exactly the canonical frontmatter contract, turning the stack-agnostic review baseline into valid routing signal for the advisor doc harvest. Unlike the pilot, every detailed block here is net-new: 9 docs carried title+description only and pr_state_dedup.md carried no frontmatter at all, so trigger phrases, tiers, and contextTypes were authored fresh from each doc's body.

### Added

- None.

### Changed

- Authored trigger_phrases, importance_tier, and contextType for all 10 sk-code-review reference docs, turning the stack-agnostic review baseline into valid routing signal for the advisor doc harvest. This was net-new authoring: 9 docs carried only title and description, and pr_state_dedup.md carried no frontmatter at all.
- Prepended a full 5-field canonical block (including authored title and description) above the H1 of pr_state_dedup.md, which previously had no frontmatter fence.
- Appended trigger_phrases, importance_tier, and contextType inside the existing fences of the 9 docs that carried title and description only. Phrases were derived from each doc's actual sections ("findings first severity ordering" from review_core.md, "security review minimums" from the security checklist) and deliberately avoid deep-review loop vocabulary to keep the baseline skill distinctive.
- review_core.md and pr_state_dedup.md were tiered important because review_core defines the severity contract and evidence requirements consumed by review agents, and pr_state_dedup specifies a formal gate mechanism. quick_reference.md received contextType general as an index doc; removal_plan.md received contextType planning as a planning template; the remaining docs received contextType implementation.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill sk-code-review --coverage - PASS — docs=10, carrying-detailed-block=10, violations=0 (baseline was violations=10)
- Python local-mode smoke ("findings first severity ordering", flag on) - PASS — sk-code-review first at 0.95 with !findings first severity ordering(signal) in the match reason
- Diff hygiene - PASS — git diff shows insertion-only frontmatter hunks in the 10 files (83 lines added, 0 removed)
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 12 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/sk-code-review/references/code_quality_checklist.md` | Modified | Detailed block authored; normal / implementation |
| `.opencode/skills/sk-code-review/references/fix-completeness-checklist.md` | Modified | Detailed block authored; normal / implementation |
| `.opencode/skills/sk-code-review/references/pr_state_dedup.md` | Modified | Full block authored above H1; important / implementation |
| `.opencode/skills/sk-code-review/references/quick_reference.md` | Modified | Detailed block authored; normal / general (index doc) |
| `.opencode/skills/sk-code-review/references/removal_plan.md` | Modified | Detailed block authored; normal / planning (planning template) |
| `.opencode/skills/sk-code-review/references/review_core.md` | Modified | Detailed block authored; important / implementation |
| `.opencode/skills/sk-code-review/references/review_ux_single_pass.md` | Modified | Detailed block authored; normal / implementation |
| `.opencode/skills/sk-code-review/references/security_checklist.md` | Modified | Detailed block authored; normal / implementation |
| `.opencode/skills/sk-code-review/references/solid_checklist.md` | Modified | Detailed block authored; normal / implementation |
| `.opencode/skills/sk-code-review/references/test_quality_checklist.md` | Modified | Detailed block authored; normal / implementation |

### Follow-Ups

- Live-daemon matchedDocs verification is deferred until every advisor-attached session ends and a fresh session respawns the daemon with the doc-trigger flag enabled.
