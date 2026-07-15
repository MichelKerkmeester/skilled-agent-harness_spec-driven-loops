---
title: "128/001 sk-git wt/{NNNN}-{name} Worktree Convention + Skill-Advisor Routing Optimization"
description: "Adopt a single numbered worktree convention (branch wt/{NNNN}-{name}, dir .worktrees/{NNNN}-{name}) across sk-git docs, sharpen sk-git advisor routing so git/worktree/branch/commit/PR/merge intent reliably lands on sk-git, and restructure all existing worktrees to the scheme."
trigger_phrases:
  - "sk-git worktree convention changelog"
  - "wt numbered worktree branch"
  - "skill-advisor routing sk-git"
  - "worktree restructure scheme"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/103-sk-git-worktree-convention-and-advisor-routing` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration` (track)

### Summary

Adopted one named-feature-worktree convention for sk-git — branch `wt/{NNNN}-{name}` (groups under `wt/` in Git UIs, mirroring `system-speckit/`) and directory `<repo>/.worktrees/{NNNN}-{name}` (gitignored), with a 4-digit global `max+1` counter. Sharpened sk-git's skill-advisor routing so git/worktree/branch/commit/PR/merge/finish intent reliably lands on sk-git (and not system-spec-kit or sk-code), and restructured all existing worktrees into the scheme. The ephemeral per-session wrapper (`worktree-session.sh`) keeps its auto-managed `work/{runtime}/{slug}` lane — documented as a distinct lane, intentionally not renumbered (the reaper keys on the `.worktrees/` dir, and the wrapper is live shared infra). Committed `fb6b3b132f`.

### Added

- New sk-git changelog `changelog/v1.1.2.0.md`; the Gate-3 packet `128-sk-git-worktree-convention-and-advisor-routing` (Level 2, `validate.sh --strict` clean).
- A "Naming Convention" subsection + the 4-digit global-counter compute (`max(existing NNNN under .worktrees/) + 1`) in the canonical `worktree_workflows.md`.
- Restructured worktrees (all in the scheme): `.worktrees/0001-mcp-front-proxy`, `0002-followups`, `0003-followup-sentinel`, `0004-followup-memorysave`; pruned two stale detached cp-v2 worktrees.

### Changed

- sk-git docs migrated to `wt/{NNNN}-{name}` + `.worktrees/{NNNN}-{name}` consistently: `references/worktree_workflows.md`, `README.md`, `SKILL.md`, `assets/worktree_checklist.md`, and the peripheral `finish_workflows.md` / `quick_reference.md` / `shared_patterns.md` / `large_reorg_playbook.md` (replacing the prior `temp/`/`feature/` + unnumbered examples).
- sk-git advisor metadata: sharpened the `SKILL.md` `description`/Keywords and refreshed `graph-metadata.json` `derived.trigger_phrases`, `key_topics`, and `intent_signals` (the explicit_author lane reads `intent_signals`) with whole-word plural/sibling tokens (`worktrees`, `branches`); ceded spec-folder/memory intent to system-spec-kit and code/tests intent to sk-code. Advisor index rebuilt.

### Fixed

- sk-git advisor routing for the new vocabulary: the "restructure the worktrees with a numbered wt prefix" prompt rose from **0.17 → 0.83** (explicit_author lane raw 0 → 1.0); "create a git worktree" 0.80 → 0.86. No over-claim — code prompts still route to sk-code and memory/spec prompts to system-spec-kit (verified).

### Verification

- Advisor before/after measured via `advisor_recommend` (with lane attribution) and two negative-control prompts; `advisor_rebuild` + `skill_graph_scan` applied.
- Packet `validate.sh --strict`: 0 errors / 0 warnings.
- All worktrees confirmed in the scheme; `.worktrees/` confirmed gitignored (not in main status); node_modules symlinks intact; the live implementation worktrees' uncommitted code preserved across the moves.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Modify — canonical convention + naming subsection |
| `.opencode/skills/sk-git/README.md` · `SKILL.md` · `assets/worktree_checklist.md` | Modify — convention + advisor description/Keywords |
| `.opencode/skills/sk-git/references/{finish_workflows,quick_reference,shared_patterns,large_reorg_playbook}.md` | Modify — example migration |
| `.opencode/skills/sk-git/graph-metadata.json` | Modify — trigger_phrases/key_topics/intent_signals for explicit_author routing |
| `.opencode/skills/sk-git/changelog/v1.1.2.0.md` | Create — skill changelog |
| `.opencode/specs/skilled-agent-orchestration/128-*/` | Create — Gate-3 packet (Level 2) |

### Follow-Ups

- Optional: align the ephemeral per-session wrapper (`worktree-session.sh`) branch namespace to `wt/` too — deferred (live shared infra; reaper is dir-keyed so it's reconnect-safe but not numbered). Stale feature worktrees (`0001`–`0005`) are merged and prunable on request.
