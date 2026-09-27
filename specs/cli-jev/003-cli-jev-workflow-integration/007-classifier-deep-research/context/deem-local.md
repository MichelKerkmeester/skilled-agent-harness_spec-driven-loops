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
| Update | `deem-ctl update`: downloads the new model beside the live one, switches `models/current`, restarts a running server, requires one real `choice` decision to pass, restores the previous version on failure (exit 3), and keeps only the live and previous model |
| Remove everything | `rm -rf ~/.local/share/deem` |

Both update paths were tested on 2026-09-27: a staged broken release rolled back to the working version with exit 3 and the server healthy, and a real download switched over, restarted and passed the decision check. `shellcheck` reports nothing.

On the operator's yes, the launchd schedule `com.skilled.deem-update` (every 6 hours and at login) was loaded on 2026-09-27 from `~/Library/LaunchAgents/com.skilled.deem-update.plist`. Its first run exited 0 and logged `current: model 8cbabbb, source 6755b30`. The health check counts only a `torch` backend, because Deem's stub backend also answers `ok` with no model loaded; a stub on a spare port was confirmed to fail it. To stop the schedule: `launchctl bootout gui/$(id -u)/com.skilled.deem-update`, then delete the plist.
