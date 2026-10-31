# Iteration 1: grok-01: The served 0.8B against the documented 9B, from their published numbers

## Focus

Question A. Compare the served `deem-0.8-v1` with the documented 9B using only published numbers, the Tare leaderboard, the vendored calibration files, and the orchestrator's measurements. No sibling file was read.

Independent: no round-3 sibling file read.

Prefix `P` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`. Prefix `G` = `specs/cli-jev/003-cli-jev-workflow-integration/goal.md`.

## Findings

### Claim table

Every latency, memory, and accuracy figure below is labeled with the model, checkpoint, runtime, precision, and device the vendored file states, or with `LOCAL` when the figure is the orchestrator's measurement. Vendor rows are vendor claims. `LOCAL` rows measure speed and memory on synthetic inputs, not quality.

| Figure | Model as the file names it | Checkpoint | Runtime, precision, device | Source |
|---|---|---|---|---|
| JevBench public hard 65.8; easy 100.0; original 91.7; extended-reasoning hard 68.9; 231/231 | Deem 9B | card names `LibertAIDAI/deem-9b-v1` only as a link, not as the measurement commit | latency line says low-power edge GPU, ~100 ms P50; the score table does not name a device | `P/context/deem-main/docs/MODEL_CARD_9B.md:22-34`, `:75-76`; `P/context/deem-main/README.md:11` |
| Long-state 3,200+ token policies, P50 788 ms | Deem 9B | same card | vendor claim; device not named on that sentence | `P/context/deem-main/docs/MODEL_CARD_9B.md:35-36` |
| Adaptive compute: 58% single pass, +7 hard points | Deem 9B | same card | vendor claim | `P/context/deem-main/docs/MODEL_CARD_9B.md:39-41`; `P/context/deem-main/README.md:56-62` |
| Policy hold-out 96.3% (trap/adversarial 91.8%); counting 0.976, grid 0.984, zero-count 1.000 | Deem 0.8B | card title `Deem 0.8B (v1)`; quickstart checkpoint `LibertAIDAI/deem-0.8-v1` | accuracy lines do not name hardware | `P/context/deem-main/docs/MODEL_CARD_08B.md:24-29`, `:45` |
| 362 ms short-form; 0.9 GB resident int8; 1.6 GB bf16-exact | Deem 0.8B | same card | Rust CPU runtime, int8 path for the 362 ms and 0.9 GB (ALL-5). Busy desktop CPU. Not the Python MPS server | `P/context/deem-main/docs/MODEL_CARD_08B.md:18-27`, `:42-46`; `P/context/deem-main/README.md:12`, `:46-54` |
| ~100 ms short-form P50 | Deem 9B | README table | low-power edge GPU in the card; README does not repeat the device | `P/context/deem-main/README.md:11`; `P/context/deem-main/docs/MODEL_CARD_9B.md:22-23` |
| HTTP p50 0.2 ms stub; 11.3 ms / p99 12.9 ms one question; 12.5 ms three questions | v5 checkpoint, Qwen3-1.7B, bf16 | `scripts/sft/checkpoints/v5_17b` | TorchBackend, RTX 5090, measured 2026-09-21, 100 requests after 10 warmup | `P/context/deem-main/serve/README.md:128-143` |
| p50 137 ms / p99 155 ms one question; 259 ms three questions | v4 checkpoint, Qwen3-1.7B, bf16 | README says v4 checkpoint | CPU, same date and protocol | `P/context/deem-main/serve/README.md:142-143` |
| Tare macro acc 0.7718 down to 0.7623, ECE, flip, negation, exact Brier | deem-v6, v3, v4, v5, deem-rlcd-v1 | frozen v5 checkpoint `v5_17b` for v5/v6 | backbone Qwen3-1.7B-Base. Not a release card | `P/context/deem-main/eval/tare/leaderboard.md:12-16`, `:21-36` |
| Tare macro acc 0.6788, ECE pre 0.0532, flip 0.9680, no post-scaling ECE | deem-v2 | `scripts/sft/results_v2_qwen35_08b.json` | backbone Qwen3.5-0.8B. Note: first 8-anchor SFT, flip rates 0.92-0.99. Not the release card | `P/context/deem-main/eval/tare/leaderboard.md:16`, `:97-109` |
| choice p50 60.3 ms p95 78.5 ms; score p50 60.2 p95 64.5; noul p50 60.5 p95 62.8 | served `deem-0.8-v1` | Hugging Face commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21` | Python `deem_server.py`, bf16, `DEEM_DEVICE=mps`, Apple M5 Max. Synthetic inputs. Orchestrator measurement | `P/context/deem-local.md:20-26`, `:32-38` |
| RSS 814 MB; physical footprint 3,368 MB; startup about 10 s | same served model | same commit | same runtime. Includes MPS memory in the footprint | `P/context/deem-local.md:40-44` |
| every answer `temperature` 1.0 | same served model | no calibration file loaded | Python server default | `P/context/deem-local.md:27`; `P/context/deem-main/serve/deem_server.py:486-489`; `P/context/deem-main/serve/README.md:249` |

The serve README latency table is a development checkpoint (Qwen3-1.7B v4/v5), not `deem-0.8-v1` and not `deem-9b-v1`. Using 11.3 ms as the 0.8B's speed would mix three models.

### Shared benchmarks

No published table reports the release 0.8B and the release 9B on the same judgment.

- JevBench public hard is on the 9B card only (`MODEL_CARD_9B.md:27-34`). The 0.8B card does not mention JevBench (`MODEL_CARD_08B.md:22-29`). `LOCAL:52` says the same and was reopened here against the cards.
- Policy hold-out 96.3% and the counting/grid/zero-count lines are on the 0.8B card only. The 9B card's only 0.8B numbers are the 362 ms and 0.9 GB restatement (`MODEL_CARD_9B.md:67-71`).
- Tare's leaderboard has no 9B row. Its only 0.8B-class backbone is `deem-v2`, an early SFT run with flip rate 0.9680 (`leaderboard.md:97-106`). That row is not the release card's 96.3% and is not the served commit. Rows 1-5 are Qwen3-1.7B-Base.

The gap is not bridged.

### Why 362 ms and about 60 ms can both be true

Inferred, from code, not from a paired benchmark.

1. The 362 ms line is the Rust CPU runtime on the int8 path (`MODEL_CARD_08B.md:18-27`, `:42-46`). The process that serves here is the Python server (`deem-local.md:22-24`).
2. `TorchBackend` `auto` selects `cuda` or `cpu` only (`deem_server.py:180-181`). MPS was set by hand (`deem-local.md:24`). The card's CPU number and the MPS number are different devices.
3. The card's 362 ms sits next to "0.9 GB resident (int8 path; 1.6 GB bf16-exact)" (`MODEL_CARD_08B.md:27`). The served weights are bf16 (`deem-local.md:21`). Precision does not match.
4. Autocast bf16 is enabled only when the device string starts with `cuda` (`deem_server.py:213-215`). The MPS path loads bf16 weights (`:184-187`) and does not take that autocast branch.
5. The Rust non-x86 fallback begins at `kernels.rs:145` (`#[cfg(not(target_arch = "x86_64"))]`). This Mac would not take the x86 AVX-512 kernels. That does not explain the 60 ms, because the Rust server is not the process `LOCAL` measured.
6. The serve README's "~0.2 ms" HTTP overhead (`serve/README.md:131-132`) was measured on the v5 1.7B checkpoint, not on this server. It is not a term in the 362-to-60 gap.

What would confirm the split: a paired timing of the same prompts on the Rust int8 CPU binary and on this Python MPS process. Not run. No Deem code was executed.

### Calibration

Fifteen files sit in `P/context/deem-main/serve/calibration/`. Every file whose JSON has a `checkpoint` field names `scripts/sft/checkpoints/v5_17b`, including `calibration_v13.json:5`. The v13 protocol string says "fit for the v13 checkpoint (deem-9 release)" (`calibration_v13.json:3`) while the checkpoint field is still `v5_17b`. None of the files name `LibertAIDAI/deem-0.8-v1` or `deem-0.8-v1`. The four `*_long.json` files have no checkpoint field; `calibration_v13_long.json:1-11` is a per-primitive scalar fit (choice temperature 3.6, noul 1.75) with no model id.

`Calibration.temperature_for` returns `1.0` when no dataset or primitive entry matches (`deem_server.py:486-489`). With `DEEM_CALIBRATION` unset, the README default is T=1 (`serve/README.md:249`). That is what `LOCAL:27` records. A threshold on `confidence` or on a noul `value` from this server is a threshold on raw probabilities. `calibration_v6.json:35` shows a boolq noul temperature of about 5.01, but that file's checkpoint is `v5_17b` (`calibration_v6.json:5`), so loading it onto the served 0.8B would scale the wrong model.

### Whether the 9B is worth serving

Parent D3 says the 0.8B bf16 is what is served and kept current, and "Nothing else is built" (`G:51`). The operator chose the 0.8B after comparing RAM of about 1.6 GB against 18 to 20 GB (`G:131`). The 1.6 GB figure matches the card's bf16-exact resident line (`MODEL_CARD_08B.md:27`), which is a vendor Rust figure. The served Python process measured 3,368 MB physical footprint (`deem-local.md:43`), still an order below the 18 to 20 GB side of that comparison. The orchestrator-confirmed 9B size is one 17.9 GB `model.safetensors` (research-angles.md section 1; not re-derived from a vendored file in this iteration).

No shared published judgment shows the 9B beating the 0.8B on a number this repository uses. Serving the 9B stays dropped under D3.

### Idea N-grok-01-1

- **Idea:** `N-grok-01-1`. Do not serve `deem-9b-v1`. No judgment type; this is a serve-or-not choice, not a `noul`/`choice`/`score`/`run` call.
- **Question:** A
- **Builds on:** parent D3 (`G:51`, `G:131`). New against the cards.
- **Value:** avoids a second weight set whose published scores do not share a benchmark with the model already served.
- **Seam:** no call site. The decision is the parent's. The card that would be served is `P/context/deem-main/docs/MODEL_CARD_9B.md:19-34`.
- **Metric, baseline, harness:** shared-judgment accuracy of 9B versus served 0.8B. Baseline: no shared published benchmark (this iteration's table). Harness: none; mimo-03 owns the comparison design. UNKNOWN until that harness exists.
- **Savings:** none. Serving the 9B does not cut context.
- **Cost, latency, privacy:** 9B is not a backend. Jev is unchanged. Deem stays the served 0.8B.
- **Two-backend gate:** no new switch. With neither backend, behavior is exactly today's.
- **Rough LOC:** 0
- **Verdict:** drop. Parent D3 already chose the 0.8B, and the cards give no shared judgment that would reopen it.
- **Confidence:** confirmed from the cards and `G:131` for the RAM comparison. The 17.9 GB file size is orchestrator-confirmed, not opened in a vendored blob.
- **Kill criterion:** a labeled comparison on this repository's judgments, same prompts, where the 9B's agreement with gold exceeds the served 0.8B by a margin the operator pre-registers, and a measured resident set on this Mac that the operator accepts against the 18 to 20 GB side of `G:131`. Until both numbers exist, the drop stands.

### Idea N-grok-01-2

- **Idea:** `N-grok-01-2`. Do not set a keep threshold on the served 0.8B's raw `confidence` or noul `value` until a calibration file names that checkpoint. Type: `score` and `noul` (the fields a threshold would read).
- **Question:** A
- **Builds on:** `LOCAL:27` and `LOCAL:53`, reopened against `deem_server.py:486-489` and the calibration directory.
- **Value:** stops a feature from treating temperature 1.0 as a calibrated probability.
- **Seam:** `P/context/deem-main/serve/deem_server.py:486-489` and `:594-620` (where `temperature` is copied onto every answer).
- **Metric, baseline, harness:** ECE on a held-out split of this repository's labels. Baseline UNKNOWN (`LOCAL:52` says quality here is unmeasured). Smallest harness: a calibration JSON whose `checkpoint` field is `LibertAIDAI/deem-0.8-v1` at commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`, scored on labels this repo already has. Not built here.
- **Savings:** estimate only; a wrong threshold adds a reread. No count in this iteration.
- **Cost, latency, privacy:** zero calls. Deem stays local. Jev is not involved.
- **Two-backend gate:** any later feature that thresholds Deem must refuse to threshold when `temperature` is 1.0 and no calibration file for this checkpoint is loaded. With neither backend, behavior is exactly today's.
- **Rough LOC:** the refusal is a branch in whatever caller first reads `temperature`. Not sized here; swe owns the slice.
- **Verdict:** later. It is a gate on Deem features, not a feature of its own.
- **Confidence:** confirmed that no vendored calibration file names the served checkpoint, and that the server default is 1.0. Inferred that a threshold on raw probabilities would mis-rank; a labeled ECE would confirm it.
- **Kill criterion:** a calibration file whose checkpoint field is the served commit, loaded by this server, with held-out ECE on this repository's labels at or below a pre-registered bound. That measured line is what would allow a threshold.

## Sources Consulted

- `P/context/deem-local.md` (whole, this iteration)
- `P/context/deem-main/README.md:9-62`
- `P/context/deem-main/docs/MODEL_CARD_08B.md:18-55`
- `P/context/deem-main/docs/MODEL_CARD_9B.md:19-76`
- `P/context/deem-main/serve/README.md:128-153`, `:244-255`
- `P/context/deem-main/serve/deem_server.py:156-243`, `:486-489`, `:594-620`
- `P/context/deem-main/serve/calibration/` (15 filenames; first lines of `calibration_v13.json`, `calibration_v6.json`, `calibration_v13_long.json`)
- `P/context/deem-main/eval/tare/leaderboard.md:1-110`
- `P/context/deem-main/rust/deem-runtime/src/kernels.rs:145-156`
- `G:51`, `G:131`
- No `steer.md` in this lineage.

## Assessment

newInfoRatio: 0.90

Novelty: the claim table separates the release 0.8B, the release 9B, and the Qwen3-1.7B development checkpoints, and it records that no calibration file names `deem-0.8-v1`. Restating `LOCAL`'s 60 ms alone would have been no new information; the table's checkpoint column is the new part.

Confidence: the "no shared benchmark" and "no calibration for this checkpoint" claims are confirmed by the files opened. The 362-versus-60 explanation is inferred.

Convergence is telemetry only (`convergenceMode: off`). Rolling average is a single point, 0.90, above 0.05. Do not synthesize.

## Reflection

What worked: reading the checkpoint field inside each calibration file, not the filename. `calibration_v13.json` looks like a 9B file and still points at `v5_17b`.

What failed: a search of the vendored markdown for "17.9" found nothing. The 9B file size stays an orchestrator-confirmed fact.

Ruled out: treating Tare `deem-v2` as the served 0.8B. Treating the RTX 5090 11.3 ms row as either release model. Serving the 9B on the card's JevBench number alone.

## Recommended Next Focus

grok-02: field-by-field wire compatibility of Deem's `/v1/systemone` against the Python `jev-cli` and the npm `jevctl`.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Release 0.8B and release 9B share no published judgment | new | cards and Tare leaderboard, this iteration |
| No vendored calibration file names `deem-0.8-v1`; v13's prose says deem-9 while its checkpoint field is `v5_17b` | new | `calibration_v13.json:3-5` and the directory grep |
| 362 ms is Rust CPU int8; ~60 ms is Python MPS bf16 | confirms `LOCAL` and ALL-5 with the server lines opened | `MODEL_CARD_08B.md:27`, `deem_server.py:180-181`, `deem-local.md:21-24` |
| Serve README 11.3 ms is a 1.7B development checkpoint | new | `serve/README.md:130-141` |
| Tare deem-v2 is an early 0.8B-class SFT with flip 0.968, not the release card | new | `leaderboard.md:97-106` |
| Quality of the served model on this repository is unmeasured | restated | `deem-local.md:52` |

## Hand-off

- grok-02 must not treat the Python `jev-cli` body as Deem's `options`/`levels` body; grok-01 did not open that client.
- Any later Deem threshold inherits `N-grok-01-2`: temperature 1.0 is raw.
- The 9B stays a documented option. Do not reopen serving it without the kill line in `N-grok-01-1`.
