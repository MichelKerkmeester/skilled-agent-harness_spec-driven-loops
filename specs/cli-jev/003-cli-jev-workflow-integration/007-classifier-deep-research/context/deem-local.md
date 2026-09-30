---
title: "Deem 0.8B served locally: install and measurements"
description: "How Deem 0.8B bf16 is installed and served on this MacBook, what it measured, and how to stop or remove it. Measured by the orchestrator on 2026-09-27."
trigger_phrases:
  - "deem local measurements"
  - "deem 0.8b latency memory"
  - "deem local server"
importance_tier: "important"
contextType: "research"
---
# Deem 0.8B Served Locally: Install and Measurements

Measured by the orchestrator on 2026-09-27. Lineages read this file and never call the server themselves.

## Install

| Item | Value |
|------|-------|
| Machine | Apple M5 Max, 64 GB RAM, macOS |
| Model | `LibertAIDAI/deem-0.8-v1`, Hugging Face commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21` (last modified 2026-09-25), root `model.safetensors` only (the `v1.0/` copy was skipped), 1.4 GB on disk |
| Precision | bf16 (`dtype=torch.bfloat16` in `serve/deem_server.py`) |
| Server | Deem's Python server `serve/deem_server.py`, source commit `6755b30bf6bbd9a81f8db6ba42cc0fd62c9f4719` |
| Runtime | `uv` venv on Python 3.12: torch 2.14.0 (MPS available), transformers 5.17.0 |
| Device | `DEEM_DEVICE=mps` (the server's `auto` picks only `cuda` or `cpu`, so `mps` was set by hand and worked without a code change) |
| Endpoint | `http://127.0.0.1:8300`, localhost only: `POST /v1/systemone`, `GET /health`, `GET /v1/models` |
| Model id | `deem-0.8-v1` |
| Calibration | None loaded, so every answer reports `temperature` 1.0. No calibration file in the repo is published for this checkpoint |
| Location | Everything under `~/.local/share/deem/` (2.1 GB): `src/`, `venv/`, `models/<commit>/` with a `models/current` link, `hf-home/`, `bin/deem-ctl`, logs and `server.pid`. Nothing in any repository, Homebrew, system Python, `PATH` or shell config, and nothing in the shared Hugging Face cache |

## Measurements

Synthetic inputs only, never repository content. One question per request, a single client, after 10 warm-up requests, 50 timed requests per primitive.

| Primitive | p50 | p95 | Min | Max | Sample answer |
|-----------|-----|-----|-----|-----|---------------|
| `choice` (2 options) | 60.3 ms | 78.5 ms | 56.5 ms | 88.4 ms | Failed nightly build with failed retries: `hold` at 0.91 |
| `score` (3 levels) | 60.2 ms | 64.5 ms | 57.0 ms | 150.7 ms | Reset link sent to the wrong address: `high` at 0.80 |
| `noul` | 60.5 ms | 62.8 ms | 56.9 ms | 142.5 ms | A true, plainly stated proposition: 0.71 |

| Memory | Value |
|--------|-------|
| Resident set (`ps` RSS) | 814 MB |
| Physical footprint (`footprint`, includes MPS GPU memory) | 3,368 MB, peak 3,369 MB |
| Startup to healthy | About 10 s |

Latency is wall time from a local Python `urllib` client, request to parsed response. The server was the only Deem process, and five research lineages were not yet running.

## What this changes for the research

- **Speed.** A local decision costs about 60 ms, inside the 2,500 ms advisor hook deadline and the 3 s PreCompact command-hook timeout that ruled out live forms in rounds 1 and 2. Whether a caller can afford a process spawn plus 60 ms per prompt is a separate, unmeasured question.
- **Cost and egress.** No key, no quota and no data leaves the machine.
- **Quality is unmeasured here.** The two sanity answers above are not an accuracy figure. Deem's own card reports 96.3% long-policy hold-out accuracy for the 0.8B and gives no JevBench score for it, and nothing here compares it with the 9B or with Jev on this repository's judgments.
- **Uncalibrated.** With temperature 1.0, probabilities and confidence are raw. A threshold chosen on them should be checked on labeled rows first.

## Operate and update

`~/.local/share/deem/bin/deem-ctl` runs the server and keeps it current. Deem publishes no GitHub releases or tags, so a release is a new commit on the Hugging Face model repo, plus a new commit on the GitHub `main` branch for the server source.

| Action | Command |
|--------|---------|
| Start | `deem-ctl start` (waits for `/health`) |
| Stop | `deem-ctl stop` |
| Status | `deem-ctl status` (health plus the model and source commits) |
| Check for a release | `deem-ctl update --check` |
| Update | `deem-ctl update`: downloads the new model beside the live one, switches `models/current`, and requires one real `choice` decision to pass, starting the server just for that check if it was stopped. On failure it restores the previous version (exit 3), or exits 4 if the restored version does not start. It keeps only the live and previous model |
| Roll back | `deem-ctl rollback`: returns to the version before the last update and holds the rejected release, so the schedule skips it until a newer one is published. One step only (exit 2 with no previous version) |
| Remove everything | `rm -rf ~/.local/share/deem` |

Both update paths were tested on 2026-09-27: a staged broken release rolled back to the working version with exit 3 and the server healthy, and a real download switched over, restarted and passed the decision check. `shellcheck` reports nothing.

On the operator's yes, the launchd schedule `com.skilled.deem-update` (every 6 hours and at login) was loaded on 2026-09-27 from `~/Library/LaunchAgents/com.skilled.deem-update.plist`. Its first run exited 0 and logged `current: model 8cbabbb, source 6755b30`. The health check parses the `backend` field and refuses `stub`, because Deem's stub backend also answers `ok` with no model loaded; a stub on a spare port was confirmed to fail it.

**Exposure.** The server sends `Access-Control-Allow-Origin: *` with no authentication (`serve/deem_server.py:809`, `:837`), confirmed live with an `Origin` header on 2026-09-27. It listens on localhost only, but any web page open in the operator's browser can send it requests and read the answers. That exposes compute, not data: the server sees only what is sent to it. Closing it needs a patch to Deem's code or a proxy, which is the operator's call. To stop the schedule: `launchctl bootout gui/$(id -u)/com.skilled.deem-update`, then delete the plist.

**Decisions of 2026-09-28.** The operator accepted this exposure until a hook calls Deem live, turned the server's access log on through `deem-ctl` (one line per request, appended to `server.log` across restarts), held `DEEM_N_ORDERS` at 1 and keeps a reviewed copy of `deem-ctl` beside this file. The options, rollbacks and revisit triggers are in `../../016-deem-local-hardening/spec.md` section 10.

## Measured after the run

Measured by the orchestrator on 2026-09-27 after the round-3 fan-out ended, still on model `8cbabbb` and source `6755b30`, since no release landed during the run. Synthetic inputs only, one server, nothing else calling it.

| Measurement | p50 | p95 | Note |
|-------------|-----|-----|------|
| `GET /health` and parse, inside a running process | 0.4 ms | 0.9 ms | 50 calls |
| Fresh `node` process, spawn only | 26.0 ms | 30.8 ms | The cost every hook already pays |
| Fresh `node` process, spawn plus `fetch` of `/health` | 46.0 ms | 47.4 ms | So a health check adds about 20 ms to a hook that makes it on every prompt |
| `curl` plus Python parse, as `deem-ctl` checks | 28.3 ms | 30.7 ms | 20 calls |
| `choice`, 1 client | 65.6 ms | 80.0 ms | 14.9 requests per second |
| `choice`, 2 concurrent clients | 119.9 ms | 144.2 ms | 16.1 requests per second |
| `choice`, 4 concurrent clients | 245.5 ms | 281.3 ms | 15.8 requests per second |

- **One request at a time.** Throughput stays flat as clients are added, because the server holds one lock around inference (`serve/deem_server.py:201`, `:236`). Two callers at once each wait for the other.
- **Deterministic.** The same request returned the same answer in 40 of 40 repeats at every setting below. A flip test has to change the input, the option order or the model commit, because rerunning one input changes nothing.
- **Option-order averaging.** The server can read each `choice` question under several option orders and average them, set by `DEEM_N_ORDERS` (`serve/deem_server.py:985`, default 1). `deem-ctl` leaves it at 1. On a temporary second instance, stopped afterwards:

| `DEEM_N_ORDERS` | 2 options, p50 | 4 options, p50 |
|-----------------|----------------|----------------|
| 1 (served) | 60.2 ms | 62.4 ms |
| 2 | 94.3 ms | 100.4 ms |
| 4 | 166.5 ms | 168.1 ms |

The top answer did not change on these two synthetic questions. Whether averaging improves answers on this repository's judgments is unmeasured, so serving stays at 1 unless the operator chooses otherwise.

## Lifecycle changes after the run

The research leads found three gaps in `deem-ctl`, fixed on 2026-09-27. Lineage citations of `deem-ctl` line numbers refer to the version before these changes.

- An update now always proves the new version with one real decision. Before, an update run while the server was stopped switched versions unchecked.
- A restore that fails to start now says the server is down and exits 4. Before, it still claimed the old version was restored.
- `deem-ctl rollback` is new, for a release that passes the decision check but answers worse. It holds the rejected release so the six-hourly schedule does not reinstall it.

Each path was tested with staged fake releases, removed afterwards: a good and a broken release with the server stopped and with it running, a rollback both ways, the hold skipping the rejected release, a newer release clearing the hold, a second rollback refused, and a failed restore reported as exit 4. `shellcheck` reports nothing. `update.log` marks the test entries between `TEST BEGIN` and `TEST END` lines.
