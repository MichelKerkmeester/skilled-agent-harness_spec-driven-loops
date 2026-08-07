---
title: "Worktree child-marker dispatch documentation"
description: "The cli-codex and cli-opencode dispatcher skills now instruct callers to set AI_SESSION_CHILD=1 so orchestrated sub-sessions share the parent worktree, closing the in-repository documentation portion of packet 035 T006."
trigger_phrases:
  - "AI_SESSION_CHILD cli dispatch rule"
  - "worktree child-marker cli dispatchers"
  - "cli-codex child session marker"
  - "cli-opencode child session marker"
  - "orchestrated sub-session worktree sharing"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/003-worktree-child-marker-dispatch` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening`

### Summary

The worktree-session wrapper (packet 035) detects orchestrated children by the `AI_SESSION_CHILD=1` environment variable, but the dispatcher skills that spawn those children never told callers to set it. Both the cli-codex and cli-opencode skills now include an ALWAYS rule requiring the marker to be set on dispatch. This ensures orchestrated sub-sessions share the parent worktree instead of wrongly allocating their own.

### Added

- ALWAYS rule 13 in cli-codex instructing dispatchers to set `AI_SESSION_CHILD=1` when running `codex exec`
- ALWAYS rule 15 in cli-opencode instructing dispatchers to set `AI_SESSION_CHILD=1` when running `opencode run`

### Changed

- None.

### Fixed

- None.

### Verification

- cli-codex AI_SESSION_CHILD rule: PASS (rule 13 present with `codex exec` pattern and bin/README cross-reference, single additive diff hunk)
- cli-opencode AI_SESSION_CHILD rule: PASS (rule 15 present with `opencode run` pattern and bin/README cross-reference, single additive diff hunk)
- Comment-hygiene audit on both skills: PASS (zero ephemeral-pointer violations)
- Packet strict-validate: PASS (exit 0)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/cli-codex/SKILL.md` | Modified | Added ALWAYS rule 13 for AI_SESSION_CHILD on codex exec dispatch |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Added ALWAYS rule 15 for AI_SESSION_CHILD on opencode run dispatch |

### Follow-Ups

- Three remaining cli-* skills (cli-claude-code, cli-gemini, cli-devin) do not yet carry the dispatch rule. They are lower-traffic paths for this workflow. Propagate the rule to them if they become primary dispatchers.
- The rule is advisory only. The wrapper structural backstop (`git --git-common-dir`) serves as a safety net when a dispatcher omits the variable. This closes the documentation gap but not the enforcement gap.
- Operator-machine wiring (launch aliases, SessionStart guard-hook entries) remains out of scope as an environment-specific operator step.
