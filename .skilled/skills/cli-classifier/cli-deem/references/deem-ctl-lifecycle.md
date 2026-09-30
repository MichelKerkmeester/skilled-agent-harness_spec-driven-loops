---
title: "Deem Server Lifecycle with deem-ctl"
description: "How the local Deem server is installed, started, stopped, checked, updated and rolled back with deem-ctl, which cli-deem documents and never reimplements."
trigger_phrases:
  - "deem-ctl lifecycle"
  - "start the deem server"
  - "update deem"
  - "roll back deem"
  - "deem update schedule"
importance_tier: "normal"
contextType: "general"
version: 0.1.0.0
---

# Deem Server Lifecycle with deem-ctl

How the local Deem server is installed, started, stopped, checked, updated and rolled back with `deem-ctl`, which `cli-deem` documents and never reimplements.

---

## 1. OVERVIEW

### Purpose

`cli-deem` only reads the server. Starting it, stopping it and moving it between releases belongs to `deem-ctl`, a shell script the operator runs. This reference lists what each `deem-ctl` action does so a reader can recover an unavailable server without guessing. No feature and no hook calls `deem-ctl`.

### Location

Everything lives under `~/.local/share/deem/`: the server source in `src/`, a `uv` virtual environment in `venv/`, the checkpoints in `models/<commit>/` with a `models/current` link, the Hugging Face cache in `hf-home/`, the logs and `server.pid`. The script is `~/.local/share/deem/bin/deem-ctl`. Nothing sits in a repository or on `PATH`, so call it by its full path or define a shell alias for it.

---

## 2. INSTALL

The operator installed Deem once by hand. `deem-ctl` keeps it current from then on. The install serves `LibertAIDAI/deem-0.8-v1` in bf16 on the `mps` device from Deem's own Python server, bound to `127.0.0.1:8300` with the model id `deem-0.8-v1`. It needs about 814 MB resident and about 3.4 GB of physical footprint while running. Removing everything is `rm -rf ~/.local/share/deem`.

---

## 3. ACTIONS

| Action | Command | What it does | Exit |
|---|---|---|---|
| Start | `deem-ctl start` | Launches the server on the `models/current` checkpoint with the pinned model id and offline Hugging Face access. It waits up to 120 s for a health check that refuses the stub | 0. 4 when the server never gets healthy |
| Stop | `deem-ctl stop` | Kills the recorded process and removes the pid file. It does not wait for the process to exit | 0 |
| Status | `deem-ctl status` | The health body, then the short model and source commits. It prints `stopped` when the server is down | 0 |
| Check | `deem-ctl update --check` | Compares the Hugging Face and GitHub heads with the local ones and reports whether a release is waiting | 0. 2 when the release check fails |
| Update | `deem-ctl update` | Downloads the new release beside the live one, switches `models/current` and proves the new version with one real `choice` decision | 0, 2, 3 or 4 |
| Roll back | `deem-ctl rollback` | Returns to the version before the last update and holds the rejected release | 0, 2 or 4 |

A stop followed at once by a start can race on the port, because `stop` does not wait for the old process to exit. Leave a second between the two.

---

## 4. UPDATES AND ROLLBACK

### What a Release Is

Deem publishes no GitHub releases or tags. A release is a new commit on the Hugging Face model repository or on the GitHub `main` branch for the server source. `deem-ctl update` treats a change in either one as a release.

### How an Update Proves Itself

An update always proves the new version with one real `choice` decision. It starts the server for that check when the server was stopped. It stops it again afterwards. On success it records the previous version, clears any hold and keeps only the live and previous models. On failure it restores the previous version and exits 3. It exits 4 when the restored version does not start either, which means the server is down.

### Rolling Back a Release That Answers Worse

A release can pass the decision check and still answer worse on a feature's own labels. `deem-ctl rollback` handles that case. It needs a previous version on disk, switches back to it and holds the rejected release so the schedule skips it until a newer one is published. It rolls back one step only and exits 2 when no previous version exists.

### The Schedule

The launchd job `com.skilled.deem-update` runs `deem-ctl update` every 6 hours and at login. It is loaded from `~/Library/LaunchAgents/com.skilled.deem-update.plist`. Stopping it takes `launchctl bootout gui/$(id -u)/com.skilled.deem-update` and deleting the plist.

---

## 5. WHAT AN UPDATE MEANS FOR A MEASURED RESULT

An update keeps the model id `deem-0.8-v1` and changes the commit pair. A result a feature measured and kept holds only for the pair it was measured on. After an update the feature reruns its keep rule on the new pair before any further use. A change of pair is a reason to requalify, not a reason to drop the feature. [`model-pin.md`](./model-pin.md) gives the full rule.

---

## 6. RELATED RESOURCES

- [`model-pin.md`](./model-pin.md): the model id, the commit pair and requalification.
- [`wire-contract.md`](./wire-contract.md): what the client sends and reads.
- [`../SKILL.md`](../SKILL.md): the exit table, including exit 4 for a stopped server.
