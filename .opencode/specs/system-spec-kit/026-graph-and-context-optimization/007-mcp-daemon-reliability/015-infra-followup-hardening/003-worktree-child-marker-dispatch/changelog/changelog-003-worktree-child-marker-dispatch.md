# Changelog — 003: Worktree child-marker dispatch documentation

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/skills/cli-codex/SKILL.md` to add ALWAYS rule 13: set AI_SESSION_CHILD=1 on codex exec dispatch
- Modified `.opencode/skills/cli-opencode/SKILL.md` to add ALWAYS rule 15: set AI_SESSION_CHILD=1 on opencode run dispatch
- Each rule states the why (dispatched child is sub-session, must share parent worktree), notes it is harmless when wrapper not in use, and cross-refs bin/README.md

## Why
Packet 035 built worktree-session.sh which isolates each top-level AI session in its own git worktree but exec's in place for orchestrated children detected by AI_SESSION_CHILD=1. The dispatch recipes had no instruction to set the marker, so an orchestrated codex exec / opencode run would wrongly allocate its own nested worktree.

## Verification
- cli-codex AI_SESSION_CHILD rule: PASS — rule 13 present, codex exec pattern, bin/README cross-ref; diff +2/-1 one hunk
- cli-opencode AI_SESSION_CHILD rule: PASS — rule 15 present, opencode run pattern, bin/README cross-ref; diff +2/-1 one hunk
- Comment-hygiene (both skills): PASS — 0 ephemeral-pointer violations
- Packet strict-validate: PASS
