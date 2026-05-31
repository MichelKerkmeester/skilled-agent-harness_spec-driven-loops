# Changelog — 004: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/skills/cli-claude-code/SKILL.md` to add ALWAYS rule 11: set AI_SESSION_CHILD=1 on claude -p dispatch
- Modified `.opencode/skills/cli-gemini/SKILL.md` to add ALWAYS rule 11: set AI_SESSION_CHILD=1 on gemini dispatch
- Modified `.opencode/skills/cli-devin/SKILL.md` to add ALWAYS rule 16: set AI_SESSION_CHILD=1 on devin dispatch
- Each rule states the why (dispatched child is sub-session, must share parent worktree), notes it is harmless when wrapper not in use, and cross-refs bin/README.md

## Why
036/003 added the AI_SESSION_CHILD=1 dispatch rule to cli-codex and cli-opencode but deferred the other three cli-* dispatchers. With the worktree wrapper now the intended default isolation mechanism, every dispatcher that can spawn a child runtime should tell the caller to set the marker.

## Verification
- cli-claude-code rule 11: PASS — claude -p pattern, bin/README cross-ref; diff +1/-0
- cli-gemini rule 11: PASS — gemini pattern, bin/README cross-ref; diff +1/-0
- cli-devin rule 16: PASS — devin pattern, bin/README cross-ref; diff +1/-0
- Comment-hygiene (3 skills): PASS — 0 ephemeral-pointer violations
- Worker scope: PASS — only the 4 dispatch files dirtied, no out-of-scope writes
- Packet strict-validate: PASS
