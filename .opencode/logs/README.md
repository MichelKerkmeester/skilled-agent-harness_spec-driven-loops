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

`.opencode/logs/` holds append-only log files written by git hooks, the CLI dispatch auditor, and a few OpenCode plugins. Every file here is a runtime artifact, not checked-in evidence: writers create the file and its parent directory on first write, none of them prune or rotate content unless noted below, and none of them ever read stdin/stdout back from these files at prompt time.

Current state:

- 4 log files, each owned by exactly one writer.
- All writers fail open: a write failure to this folder never blocks the git hook, CLI dispatch, or plugin turn that produced the log line.
- No shared writer contract. Each file has its own line format, chosen by its writer.

---

## 2. KEY FILES

| File | Format | Writer |
|---|---|---|
| `autostash-orphan-alerts.log` | Tab-separated: `<UTC timestamp>\tHEAD=<short-sha>\t<stash-ref>\t<stash-commit-sha>` | `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` |
| `cli-dispatch-audit.log` | JSON Lines, one redacted record per completed `opencode run` / `claude -p` dispatch (`schema_version`, `ts`, `runtime`, `sessionID`, `callID`, `skill`, `command`, `model`, `target`, `durationMs`, `exitCode`, `outputBytes`) | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.mjs`, paired with the `mk-cli-dispatch-audit.js` plugin |
| `completion-sentinel-advisories.log` | Plain text: `<UTC timestamp> [completion-evidence-sentinel] <advisory message>` | `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs`, via the `mk-completion-sentinel.js` plugin |
| `dist-freshness-guard.log` | Plain text: `<UTC timestamp> [mk-dist-freshness-guard] <event>: <message>` | `.opencode/plugins/mk-dist-freshness-guard.js` |

`autostash-orphan-alerts.log` records only entries the pre-checkout/pre-rebase guard could not confirm were re-applied; each also gets a durable `refs/autostash-rescue/<sha12>` ref so the underlying stash survives a `git stash clear`.

`cli-dispatch-audit.log` is observe-only telemetry: it never blocks a dispatch and truncates long `command` values (`commandTruncated: true`) rather than storing arbitrarily large payloads.

---

## 3. VALIDATION

Tail any log live while its writer is active:

```bash
tail -f .opencode/logs/dist-freshness-guard.log
```

Confirm a JSONL file stays parseable:

```bash
tail -n 1 .opencode/logs/cli-dispatch-audit.log | python3 -m json.tool
```

Expected result: valid JSON output for the most recent line.

---

## 4. RELATED

- [`../plugins/README.md`](../plugins/README.md) — the plugins that back `cli-dispatch-audit.log`, `completion-sentinel-advisories.log`, and `dist-freshness-guard.log`
- [`../scripts/git-hooks/README.md`](../scripts/git-hooks/README.md) — the git hook family that writes `autostash-orphan-alerts.log`
