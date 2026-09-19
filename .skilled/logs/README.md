---
title: "Logs: Runtime Hook and Plugin Telemetry"
description: "Append-only log files written by git hooks, CLI dispatch audit, and OpenCode plugins."
trigger_phrases:
  - "opencode logs folder"
  - "dist freshness log"
  - "cli dispatch audit log"
---

# Logs: Runtime Hook and Plugin Telemetry

---

## 1. OVERVIEW

`.skilled/logs/` holds append-only log files written by git hooks, toolchain hook libraries, and a few OpenCode plugins. Every file here is a runtime artifact, not checked-in evidence: writers create the file and its parent directory on first write, each one except the autostash guard caps its file at a byte ceiling as the table notes, and none of them ever read stdin/stdout back from these files at prompt time.

Current state:

- 6 log files on disk, each owned by exactly one writer. A seventh, `mcp-route-guard.log`, appears on that guard's first recorded warning.
- Six writers cap their file at a byte ceiling and rotate or truncate it, as the table notes. `autostash-orphan-alerts.log` only appends.
- All writers fail open: a write failure to this folder never blocks the git hook, CLI dispatch, or plugin turn that produced the log line.
- No shared writer contract. Each file has its own line format, chosen by its writer.

---

## 2. KEY FILES

| File | Format | Writer | Rotation |
|---|---|---|---|
| `autostash-orphan-alerts.log` | Tab-separated: `<UTC timestamp>\tHEAD=<short-sha>\t<stash-ref>\t<stash-commit-sha>` | `.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh` | None, append only |
| `cli-dispatch-audit.log` | JSON Lines, one redacted record per completed `opencode run` / `claude -p` dispatch (`schema_version`, `ts`, `runtime`, `sessionID`, `callID`, `skill`, `command`, `model`, `target`, `durationMs`, `exitCode`, `outputBytes`) | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, via the pi, codex, claude and devin dispatch hooks and the `cli-dispatch-audit.js` OpenCode adapter | `.1` at 512 KB |
| `codex-hooks-watchdog.log` | Plain text: `<UTC timestamp> <message>` | `.opencode/plugins/codex-hooks-watchdog.js` | Truncated in place at 256 KB, no backup |
| `completion-sentinel-advisories.log` | Plain text: `<UTC timestamp> [completion-evidence-sentinel] <advisory message>` | `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`, via the `system-completion-sentinel.js` plugin | `.1` at 256 KB by default, backup pruned after 30 days |
| `dist-freshness-guard.log` | Plain text: `<UTC timestamp> [system-dist-freshness-guard] <event>: <message>` | `.opencode/plugins/system-dist-freshness-guard.js` | `.1` at 256 KB |
| `mcp-route-guard.log` | Plain text: `<UTC timestamp> [mcp-route-guard] <detail>` | `.opencode/plugins/mcp-route-guard.js` | `.1` at 256 KB, not created yet |
| `post-edit-quality.log` | Plain text: `<UTC timestamp> [sk-code-post-edit-quality] <line>` | `.opencode/plugins/sk-code-post-edit-quality.js` | `.1` at 256 KB |

`autostash-orphan-alerts.log` records only entries the pre-checkout/pre-rebase guard could not confirm were re-applied; each also gets a durable `refs/autostash-rescue/<sha12>` ref so the underlying stash survives a `git stash clear`.

`cli-dispatch-audit.log` is observe-only telemetry: it never blocks a dispatch and truncates long `command` values (`commandTruncated: true`) rather than storing arbitrarily large payloads.

`completion-sentinel-advisories.log` reads its ceiling from `SPECKIT_COMPLETION_SENTINEL_LOG_MAX_BYTES` and its backup retention from `SYSTEM_COMPLETION_SENTINEL_RETENTION_DAYS`, both optional.

---

## 3. VALIDATION

Tail any log live while its writer is active:

```bash
tail -f .skilled/logs/dist-freshness-guard.log
```

Confirm a JSONL file stays parseable:

```bash
tail -n 1 .skilled/logs/cli-dispatch-audit.log | python3 -m json.tool
```

Expected result: valid JSON output for the most recent line.

---

## 4. RELATED

- [`../plugins/README.md`](../plugins/README.md): the plugin adapters and native plugins behind `cli-dispatch-audit.log`, `completion-sentinel-advisories.log`, and `dist-freshness-guard.log`
- [`../scripts/git-hooks/README.md`](../scripts/git-hooks/README.md): the git hook family that writes `autostash-orphan-alerts.log`
