

---
title: "Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills"
description: "cli-claude-code, cli-gemini, and cli-devin now instruct dispatchers to set AI_SESSION_CHILD=1 so orchestrated children share the parent worktree, completing the cli-* family propagation begun in 036/003."
trigger_phrases:
  - "cli child marker propagation"
  - "AI_SESSION_CHILD claude gemini devin"
  - "remaining cli-* worktree rule"
  - "nested session worktree isolation"
  - "cli-* family propagation complete"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/004-cli-child-marker-propagation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening`

### Summary

The three remaining cli-* dispatcher skills now tell the calling AI to set AI_SESSION_CHILD=1 when it dispatches a sub-session, completing the propagation begun in 036/003 (cli-codex + cli-opencode). Each rule cross-references bin/README.md rather than duplicating the mechanism rationale, so the whole cli-* family (five dispatchers) now carries the uniform contract for worktree child-marker dispatch.

### Added

- cli-claude-code gains ALWAYS rule 11: AI_SESSION_CHILD=1 before the claude -p invocation pattern, with a bin/README cross-ref explaining that a dispatched child shares the parent worktree.
- cli-gemini gains ALWAYS rule 11: AI_SESSION_CHILD=1 before the gemini invocation pattern, with a bin/README cross-ref explaining that a dispatched child shares the parent worktree.
- cli-devin gains ALWAYS rule 16: AI_SESSION_CHILD=1 before the devin invocation pattern, with a bin/README cross-ref explaining that a dispatched child shares the parent worktree.

### Changed

- None.

### Fixed

- None.

### Verification

- cli-claude-code rule 11 - PASS, claude -p pattern, bin/README cross-ref, diff +1/-0
- cli-gemini rule 11 - PASS, gemini pattern, bin/README cross-ref, diff +1/-0
- cli-devin rule 16 - PASS, devin pattern, bin/README cross-ref, diff +1/-0
- Comment-hygiene (3 skills) - PASS, 0 ephemeral-pointer violations
- Worker scope - PASS, only the 3 dispatch files dirtied, no out-of-scope writes
- Packet strict-validate - PASS (confirmed at commit gate)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | ALWAYS rule 11 (claude -p dispatch with AI_SESSION_CHILD=1) |
| `.opencode/skills/cli-gemini/SKILL.md` | Modified | ALWAYS rule 11 (gemini dispatch with AI_SESSION_CHILD=1) |
| `.opencode/skills/cli-devin/SKILL.md` | Modified | ALWAYS rule 16 (devin dispatch with AI_SESSION_CHILD=1) |

### Follow-Ups

- The child-marker contract is advisory, not enforced. Nothing statically prevents a dispatcher from omitting AI_SESSION_CHILD=1. The wrapper's structural git --git-common-dir backstop serves as the safety net. This closes the documentation gap across the whole cli-* family.
- Operator-machine launch aliases remain out of scope. Routing a runtime through worktree-session.sh by default (alias) is still the operator's environment-specific step. The companion SessionStart guard hook is handled by sibling child 006.
