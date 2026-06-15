---
title: "Changelog: Phase 17: sk-git Frontmatter Alignment [009-skill-frontmatter-alignment/017-sk-git]"
description: "Chronological changelog for the Phase 17: sk-git Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

sk-git's 10 reference and asset docs now carry exactly the canonical frontmatter contract, so the advisor doc harvest can route git-workflow intent ("rename-heavy merge verification", "scoped staging discipline") straight to the owning skill. Unlike the 008 pilot, nothing here was normalization: every doc started with title+description only, making this the campaign's first all-net-new authoring phase.

### Added

- None.

### Changed

- Authored trigger_phrases, importance_tier, and contextType for all 10 sk-git reference and asset docs, making this the first all-net-new authoring phase in the campaign. Every doc started with title and description only.
- Phrase authoring used each doc's own incident-derived vocabulary: worktree docs carry the numbered-worktree vocabulary ("numbered worktree branches", "global worktree counter"); commit docs carry scoped-staging incident vocabulary ("scoped staging discipline", "staged deny pattern assertion"); the reorg playbook carries failure-mode vocabulary ("mass git mv renames", "leftover ignored cruft cleanup").
- worktree_workflows.md was tiered important as the home of the formal two-lane worktree naming contract (numbered wt/{NNNN}-{name} feature worktrees vs. auto-reaped session worktrees). quick_reference.md and shared_patterns.md received contextType general as cross-workflow lookup docs; everything else received contextType implementation.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill sk-git --coverage - PASS — docs=10, carrying-detailed-block=10, violations=0
- Python local-mode smoke ("rename-heavy merge verification", flag on) - PASS — sk-git first at 0.95 with !rename-heavy merge verification(signal); sk-code second at 0.88 on the generic "verification" token
- Diff hygiene - PASS — git diff -U0 shows insertion-only hunks at frontmatter line 4 in all 10 files (86 insertions, 0 deletions)
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Modified | Full contract block; tier important (naming contract) |
| `.opencode/skills/sk-git/references/commit_workflows.md` | Modified | Full contract block; implementation |
| `.opencode/skills/sk-git/references/finish_workflows.md` | Modified | Full contract block; implementation |
| `.opencode/skills/sk-git/references/github_mcp_integration.md` | Modified | Full contract block; implementation |
| `.opencode/skills/sk-git/references/large_reorg_playbook.md` | Modified | Full contract block; implementation |
| `.opencode/skills/sk-git/references/quick_reference.md` | Modified | Full contract block; general (cheat sheet) |
| `.opencode/skills/sk-git/references/shared_patterns.md` | Modified | Full contract block; general (cross-workflow) |
| `.opencode/skills/sk-git/assets/commit_message_template.md` | Modified | Full contract block; implementation |
| `.opencode/skills/sk-git/assets/pr_template.md` | Modified | Full contract block; implementation |
| `.opencode/skills/sk-git/assets/worktree_checklist.md` | Modified | Full contract block; implementation |

### Follow-Ups

- Live-daemon matchedDocs verification is deferred until every advisor-attached session ends and a fresh session respawns the daemon with the doc-trigger flag enabled.
- Generic tokens inside authored phrases (e.g. "verification") co-surface sk-code at lower confidence alongside sk-git. sk-git ranks first, so routing remains correct, but later phases should avoid generic tail words where possible.
