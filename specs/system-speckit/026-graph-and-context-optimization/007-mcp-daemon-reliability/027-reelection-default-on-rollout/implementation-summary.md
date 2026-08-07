---
title: "Implementation Summary: Re-election default-on rollout"
description: "Daemon re-election is now on by default for all users across the three aligned runtime configs, the machine-local opt-in is gone, and the docs plus the v3.5.0.4 changelog record the posture and the residual adoption-validation risk."
trigger_phrases:
  - "re-election default-on done"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/027-reelection-default-on-rollout"
    last_updated_at: "2026-06-07T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Re-election enabled for all users; docs + changelog reconciled"
    next_safe_action: "Commit, push, write release notes"
    blockers: []
    key_files:
      - ".claude/mcp.json"
      - "opencode.json"
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-027-reelection-default-on-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-reelection-default-on-rollout |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Daemon re-election is now on by default for every user, not just on the one machine that had it in a gitignored file. A disposing session releases the shared daemon for another live session to adopt instead of killing it, so concurrent sessions keep their MCP transport.

### Aligned across the three runtimes

`SPECKIT_DAEMON_REELECTION=1` is now set in the mk-spec-memory env of all three committed runtime configs, with a matching discoverability note in each: `.claude/mcp.json` (the real target behind the `.mcp.json` symlink), `opencode.json`, and `.codex/config.toml`. The configs were already aligned on socket directories; this keeps them aligned on the flag. The machine-local `SPECKIT_DAEMON_REELECTION` line was removed from `.env.local` since the committed configs now carry it.

### Docs reconciled, with the honest status

ENV_REFERENCE now describes re-election as enabled by default in the runtime configs, names the off-value revert, and states that the launcher's code default stays off so the configs are the single on-switch. The root README reliability line moved from "experimental default-off" to on-by-default. The v3.5.0.4 changelog records why it is on, why it is safe, and the honest status that full multi-session secondary adoption is still under live observation rather than proven by a CI test.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.claude/mcp.json` | Modified | Re-election flag + note in mk-spec-memory env |
| `opencode.json` | Modified | Same flag + note |
| `.codex/config.toml` | Modified | Same flag + note (TOML) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Re-election row to config-default-on |
| `README.md` | Modified | Reliability line to on-by-default |
| `.opencode/skills/system-spec-kit/changelog/v3.5.0.4.md` | Created | Release entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The alignment check came first: a grep across the three configs confirmed they shared socket directories but none set the re-election flag, so re-election was off for everyone except the local opt-in. The flag was added to all three, each config was parse-checked (JSON for two, a structural check for the TOML), and a grep confirmed the flag in all three. The machine-local line was removed. The chosen mechanism is config-level rather than a code-default flip, so the launcher's documented default stays off and the runtime configs are a one-character revert. The decision to ship an experimental path on by default was made with a bounded-downside rationale: an unadopted released daemon self-exits at the idle timeout, so the worst case matches the prior kill-on-disposal behavior, and the release-vs-kill decision is covered by the integration test added in the previous packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enable via the runtime configs, not a code-default flip | The configs are the single, reviewable on-switch and revert is one character; the documented code default stays off |
| Enable re-election but keep orphan-sweep opt-in | The idle timeout already bounds an unadopted daemon, so re-election does not require the bolder process-killing Stop-hook default |
| Ship on by default despite the open adoption validation | The downside is bounded to prior behavior, and the user directed default-on for all users |
| Record the residual risk in the changelog and ENV_REFERENCE | The adoption path is under live observation, not CI-proven; readers should know |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.claude/mcp.json` and `opencode.json` parse | PASS |
| `.codex/config.toml` structure | PASS |
| Flag present in all three configs | PASS, 1 each |
| `.env.local` flag removed | PASS |
| Changelog HVR (semicolons, em-dashes) | PASS, 0/0 |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Multi-session secondary adoption is still under live observation.** The release-vs-kill decision and OS semantics are tested; a real owner-disposal-then-adoption across two live sessions is not a CI test, because a real launcher cannot be spawned without touching the shared lease and DB.
2. **Activation needs a fresh session.** A launcher reads the config flag at startup, so a daemon already running keeps the old behavior until the next session spawns it.
3. **Orphan-sweep stays opt-in.** Faster cleanup of an unadopted daemon needs `SPECKIT_STOP_HOOK_ORPHAN_SWEEP`; the idle timeout is the default bound.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
