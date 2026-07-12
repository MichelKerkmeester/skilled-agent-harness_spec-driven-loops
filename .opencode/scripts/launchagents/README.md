---
title: "launchagents: Orphan-sweeper scheduling template"
description: "A macOS LaunchAgent template that schedules dry-run orphan MCP sweeps every 600 seconds."
trigger_phrases:
  - "orphan sweeper launchagent"
  - "launchd MCP cleanup"
  - "periodic orphan sweep"
version: 1.0.0.0
---

# launchagents: Orphan-sweeper scheduling template

---

## 1. OVERVIEW

`launchagents/` contains a reviewable macOS LaunchAgent template for the orphan MCP sweeper. The template is not installed or loaded by default.

The agent labeled `com.michelkerkmeester.orphan-sweep` runs [`orphan-mcp-sweeper.sh`](../orphan-mcp-sweeper.sh) every 600 seconds. It passes `--dry-run`, `--verbose` and an explicit log path, so the template reports candidate actions without killing processes or removing temporary files.

`RunAtLoad` is false. Loading the agent does not run an immediate sweep.

---

## 2. STRUCTURE

| File | Purpose |
|---|---|
| [`com.michelkerkmeester.orphan-sweep.plist`](com.michelkerkmeester.orphan-sweep.plist) | Defines the `com.michelkerkmeester.orphan-sweep` background LaunchAgent, its 600-second interval, dry-run sweeper arguments and output paths. |

---

## 3. SCHEDULE AND COMMAND

| Setting | Value |
|---|---|
| Label | `com.michelkerkmeester.orphan-sweep` |
| Interval | `600` seconds |
| Run at load | `false` |
| Program | `/bin/bash` |
| Script | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/orphan-mcp-sweeper.sh` |
| Arguments | `--dry-run --verbose --log-path /Users/michelkerkmeester/.local/share/orphan-sweeper.log` |
| Process type | `Background` |
| Priority | `Nice` value `5` with low-priority I/O |

launchd requires absolute paths. Review and update every repository, working-directory and log path before installing the template on another machine.

---

## 4. INSTALLATION

Copy the reviewed template into the user LaunchAgents directory:

```bash
cp .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist \
  ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist
```

Load the installed agent:

```bash
launchctl load ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist
```

Unload the installed agent:

```bash
launchctl unload ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist
```

The repository template keeps `--dry-run`. Remove that argument only from the installed copy after reviewing dry-run output across multiple intervals.

---

## 5. VALIDATION

Validate the repository template from the repository root:

```bash
plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist
```

Review the scheduled command without mutation:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

Expected result: `plutil` reports `OK` and the sweeper logs preserve and candidate decisions without killing PIDs or deleting files.

---

## 6. RELATED

- [Repository scripts runbook](../README.md)
- [Orphan MCP sweeper](../orphan-mcp-sweeper.sh)
