---
title: "Changelog: Re-election default-on rollout [007-mcp-daemon-reliability/027-reelection-default-on-rollout]"
description: "Chronological changelog for the Re-election default-on rollout phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/027-reelection-default-on-rollout` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

Daemon re-election is now on by default for every user, not just on the one machine that had it in a gitignored file. A disposing session releases the shared daemon for another live session to adopt instead of killing it, so concurrent sessions keep their MCP transport.

### Added

- SPECKIT_DAEMON_REELECTION=1 and a discoverability note in the mk-spec-memory env of .claude/mcp.json, opencode.json, and .codex/config.toml
- v3.5.0.4 changelog entry recording the default-on posture, the bounded-downside rationale, and the honest adoption-validation status

### Changed

- Surveyed all three runtime configs for alignment; confirmed they shared socket directories but none set the re-election flag, so re-election was off for everyone except the local opt-in
- Removed the redundant machine-local SPECKIT_DAEMON_REELECTION line from .env.local since the committed configs now carry it
- Updated ENV_REFERENCE to describe re-election as enabled by default with a one-character revert path; moved the root README reliability line from experimental default-off to on-by-default

### Fixed

- Daemon re-election was only active on one machine via a gitignored opt-in; now enabled by default for all users across all three aligned runtime configs

### Verification

- .claude/mcp.json and opencode.json parse - PASS
- .codex/config.toml structure - PASS
- Flag present in all three configs - PASS, 1 each
- .env.local flag removed - PASS
- Changelog HVR (semicolons, em-dashes) - PASS, 0/0
- validate.sh --strict on this packet - PASS
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.claude/mcp.json` | Modified | Re-election flag + note in mk-spec-memory env |
| `opencode.json` | Modified | Same flag + note |
| `.codex/config.toml` | Modified | Same flag + note (TOML) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Re-election row to config-default-on |
| `README.md` | Modified | Reliability line to on-by-default |
| `.opencode/skills/system-spec-kit/changelog/v3.5.0.4.md` | Created | Release entry |

### Follow-Ups

- Multi-session secondary adoption is still under live observation. The release-vs-kill decision and OS semantics are tested; a real owner-disposal-then-adoption across two live sessions is not a CI test, because a real launcher cannot be spawned without touching the shared lease and DB.
- Activation needs a fresh session. A launcher reads the config flag at startup, so a daemon already running keeps the old behavior until the next session spawns it.
- Orphan-sweep stays opt-in. Faster cleanup of an unadopted daemon needs SPECKIT_STOP_HOOK_ORPHAN_SWEEP; the idle timeout is the default bound.
