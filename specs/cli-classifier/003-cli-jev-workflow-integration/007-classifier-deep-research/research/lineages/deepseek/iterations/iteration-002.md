---
title: "Iteration 2 — deepseek-02: The `cli-deem` lifecycle: install, start, health, update and rollback"
trigger_phrases: []
---

# Iteration 2 — deepseek-02: The `cli-deem` lifecycle

## Focus

Angle **deepseek-02** (W1): *The `cli-deem` lifecycle: install, start, health, update and rollback.* Maps to questions A and G; answers angle questions 1 to 5. The angle's refinement binds: audit `deem-ctl` and the launchd agent as built rather than redesigning them, and treat ALL-3 as the question of which callers can reach the server. All claims were opened this iteration; nothing is carried from BASE without saying so. No round-3 sibling file was read (W1).

## Actions Taken

1. Read `~/.local/share/deem/bin/deem-ctl` in full (208 lines) — the one citation allowed outside the repository by ALL-1, by path and line. Nothing was executed.
2. Read `context/deem-main/serve/README.md:210-243` (the vendor's systemd deployment example) and re-read `:238-255` (endpoint examples, env table).
3. Read `.skilled/bin/hf-model-server.cjs:1-80` (constants: socket name, timeouts, drain, bind/auth rule) and the supervision library `.skilled/bin/lib/model-server-supervision.cjs` — idle config `:224-234`, crash-loop guard `:241-301`, respawn lock names and acquisition `:28`, `:44`, `:559`, `:739-801`, RSS watchdog start `:401`.
4. Read `system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:122-210` — the idle-eviction contract as tested.
5. Read `context/deem-local.md:15-28`, `:55-72` (install layout, operate table, launchd schedule, exposure).
6. Re-opened `deem_server.py:171-190` (weight load in constructor), `:907-911` (bind), `:1000-1005` (main), `:772-777` (health) from iteration 1's read for the stop/restart window analysis.
7. No process was started, stopped or updated; no network call was made; the launchd plist was not opened (ALL-1).

## Findings

**F1 (new; answers angle question 1's "what exists" half). `deem-ctl` is 208 lines and already implements the whole lifecycle the angle asked to design: start, stop, status, update `[--check]`, with a five-code exit taxonomy.** Commands and codes at `deem-ctl:9-16`, dispatch at `:190-206`. All state lives under `DEEM_HOME` (`:24`): `models/`, `src/`, `venv/`, `server.pid`, `server.log`, `update.log` (`:30-36`). The angle's "design the lifecycle" is therefore an audit: this iteration records what is built, what it leaves open, and what the hub should wrap. [SOURCE: ~/.local/share/deem/bin/deem-ctl:9-16, :24-36, :190-206]

**F2 (new; answers angle question 1's health half). Its health rule is stricter than a status read and weaker than iteration 1's probe: it parses `backend` but does not pin the model id.** `health_ok` does `curl -sf -m 2 /health` and exits 0 only for `backend == "torch"` or an `ensemble:` name without `stub` (`deem-ctl:58-66`). `wait_healthy` retries once a second up to 120 times and aborts early if the PID is gone (`:68-77`); `smoke_decision` posts one real `choice` question and greps for `"choice"` in the answer (`:79-85`). The stub refusal matches ALL-4; the model-id pin of N-deepseek-01-1 is this lineage's addition, not deem-ctl's. A server started with `--model-id anything` and a torch backend passes `deem-ctl` today. [SOURCE: ~/.local/share/deem/bin/deem-ctl:58-85]

**F3 (new). Start is offline and pinned by construction; the served configuration is fixed at the control script, not at the server.** `start_server` resolves `models/current` to a real path, then runs the server with `DEEM_CHECKPOINT=<realpath> DEEM_DEVICE=mps DEEM_HOST=127.0.0.1 DEEM_PORT DEEM_MODEL_ID=deem-0.8-v1 HF_HOME=<deem>/hf-home HF_HUB_OFFLINE=1`, detached with `nohup`, writing `server.pid` (`deem-ctl:105-121`). The `HF_HUB_OFFLINE=1` flag means a start never downloads; only `update` does. The model id `deem-0.8-v1` is a constant in the script (`:26`), which is why iteration 1's pin matches the served instance. [SOURCE: ~/.local/share/deem/bin/deem-ctl:25-28, :105-121, :114-116]

**F4 (new; answers angle question 2). The update flow as built, step by step, with each step's failure.** `update()`: reads the HF model sha (`curl` model revision API, `:87-90`) and the GitHub source sha (`:92-95`); compares with the live symlink (`:97-99`) and the checked-out source (`:140`); if both match, logs `current:` and exits 0 (`:142-145`). Otherwise it logs the available pair (`:146`), returns early on `--check` (`:147`), downloads the model into `<sha>.partial` and renames it into place (`:149-155`, failure → exit 2), fetches the source commit without checkout (`:156-158`, failure → exit 2), stops the running server if any (`:160-162`), switches `models/current` and checks out the source (`:163-164`), and — **only if it was running** — starts it and runs one real `smoke_decision`, restoring both the previous symlink and the previous checkout and restarting the old version on any failure (exit 3, `:166-173`). On success it prunes every model dir except the live and the previous one (`:177-183`). "What keeps serving meanwhile" is only the old process until `stop_server`; during the restart window (load ~10 s plus smoke) callers get connection refused and the gate skips. [SOURCE: ~/.local/share/deem/bin/deem-ctl:87-99, :134-183]

**F5 (new; answers angle question 3). Rollback is built into `update`; removal is one directory; the un-journalled window is between stop and the symlink switch.** Restoring the previous version after a failed smoke is `:167-172` (symlink back, checkout back, restart, exit 3). Removing everything is `rm -rf ~/.local/share/deem` (`LOCAL:66`), complete because all state is under `DEEM_HOME` (`deem-ctl:24`; `LOCAL:28`). A host crash or a kill of `deem-ctl` between `stop_server` (`:162`) and the restart leaves `models/current` pointing at the new commit with the server down; the next `deem-ctl start` would serve the new model without a smoke test (see F6). The next `update` repairs the source/model pair because it compares both shas each run (`:137-146`). No caller caches a handle: every caller reaches the server per request through the gate, so a restart's only caller-visible effect is a refused connection. [SOURCE: ~/.local/share/deem/bin/deem-ctl:24, :137-146, :160-183; context/deem-local.md:28, :66]

**F6 (new; a gap, stated as a design note). Neither `start` nor a `was_running=0` update proves the model can decide.** `start_server` validates only `wait_healthy` (`:119`), and `update` runs `smoke_decision` only when the server was running (`:166-167`). So an update performed while the server is stopped — exactly what a 6-hourly launchd run (`LOCAL:70`) will usually be, if the operator stops the server between sessions — can switch to a checkpoint that passes the backend check but cannot answer, and `start` will report success without a decision. The smallest fix is to run one `smoke_decision` at the end of `start_server` (~1 line plus the call at `:79-85`); it costs one 60 ms-class `choice` call at startup (LOCAL measured 60.3 ms p50, `LOCAL:36`). Recorded as a propose-to-operator change to a tested script, not a repo change. [SOURCE: ~/.local/share/deem/bin/deem-ctl:79-85, :105-121, :160-173; context/deem-local.md:36, :70]

**F7 (new; answers angle question 1's "which supervision behaviors" half). The repository's own local model server already answers the supervision questions, and Deem needs almost none of them because the repo must never own the Deem process.** The embedding server is a UDS server at `/tmp/system-hf-embed/hf-embed.sock` with a 120 s model-load timeout, 30 s inference timeout, a 5 s inference drain on shutdown and a 1.5 s idle failsafe (`hf-model-server.cjs:29-40`); it refuses non-loopback binds without a token (`:55-66`); supervision adds a respawn lock file (`model-server-supervision.cjs:44`, acquired with `wx` at `:739-760`), a crash-loop guard with exponential backoff and give-up (`:241-301`), an idle-eviction config disabled by default and fractional-minute opt-in (`:224-234`; tested at `launcher-model-server-idle-eviction.vitest.ts:139-145`, eviction "only after a successful idle embed" `:148-152`), an RSS watchdog (`:401`) and a demand-driven lazy listener. A Deem *repo-side* feature needs none of these: the server is operator-owned, per request, and a hook that cannot reach it must skip (iteration 1's gate). What the comparison does surface is the one operational difference worth recording: the repo's embedder can evict an idle server, Deem has no eviction and holds a 3,368 MB physical footprint (LOCAL, `:43`) for as long as it runs. [SOURCE: .skilled/bin/hf-model-server.cjs:29-40, :55-66; .skilled/bin/lib/model-server-supervision.cjs:44, :224-234, :241-301, :401, :739-760; .skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:139-152; context/deem-local.md:43]

**F8 (new; a race worth one defensive line, marked inferred). `stop_server` does not wait for the process to exit, and `wait_healthy` proves "something healthy serves the port", not "the new PID serves it".** `stop_server` sends one `kill` and removes the pid file (`deem-ctl:123-128`); `start_server` spawns the new process and then polls health (`:112-119`). The server installs no SIGTERM handler (only `KeyboardInterrupt`, `deem_server.py:1003-1005`), so a normal kill terminates it promptly and the window is small — but if the old process were slow to die (a hung thread at signal time), `wait_healthy` could read the old server as the new one and the smoke test would attest the old model. Inferred from code, not observed. The one-line hardening is to wait for PID exit (or for the port to refuse) before `start_server` binds. Low probability, cheap fix; recorded, not alarmed. [SOURCE: ~/.local/share/deem/bin/deem-ctl:123-128, :105-121; context/deem-main/serve/deem_server.py:1003-1005]

**F9 (new; answers angle question 4). Nothing in the server exposes the served commit; the commit lives in the control script's symlink and status line.** `/health` returns `model` only (`deem_server.py:772-777`; model id, not commit). `deem-ctl current_model_sha` reads the symlink basename (`:97-99`), and `status` prints the health body plus `model <7-char> source <7-char>` (`:195-202`). The measured facts are keyed to commits elsewhere: `LOCAL:20` records model commit `8cbabbb…` and source `6755b30…` (`LOCAL:22`, `:70`). Rule this iteration sets: every number a Deem arm measures (latency, agreement, keep rules) is stored with the `deem-ctl status` commit pair beside it; the probe cannot supply it and the server should not be patched for it. [SOURCE: context/deem-main/serve/deem_server.py:772-777; ~/.local/share/deem/bin/deem-ctl:97-99, :195-202; context/deem-local.md:20-22, :70]

**F10 (new; answers angle question 5's caller half; confirms ALL-3 with the bind line). Which callers can reach the server: any process on this Mac, and any web page in the operator's browser.** The served instance binds `127.0.0.1` (`deem-ctl:114`) on port 8300 (`:28`), and the vendor deployment example binds `0.0.0.0` (`README.md:222`) — ours is the loopback one. With `Access-Control-Allow-Origin: *` and no auth (iteration 1 F4: `deem_server.py:809-811`, `:837-839`), reachability is machine-local but not operator-gated. Who starts and stops it: the operator through `deem-ctl start|stop` and the launchd schedule `com.skilled.deem-update` (`LOCAL:70-72`); no repo code starts it, and under parent D3 only the orchestrator calls it. The smallest lifecycle that keeps "with neither backend, exactly today" true is therefore: leave the process operator-owned, keep every repo-side call behind the iteration-1 probe, and never add a repo-side spawn, respawn or auto-start. [SOURCE: ~/.local/share/deem/bin/deem-ctl:28, :114; context/deem-main/serve/README.md:222; context/deem-local.md:70-72; context/deem-main/serve/deem_server.py:809-811, :837-839]

**F11 (new; recorded for the update record). "Keeps only live and previous" bounds disk at two checkpoints, and the vendor's `v1.0/` copy is excluded from download.** Prune loop at `deem-ctl:177-183`; download excludes `v[0-9]*/*` (`:152`), matching `LOCAL:20` ("the `v1.0/` copy was skipped", root `model.safetensors` only, 1.4 GB on disk). So the update path is bounded to ~2.8 GB of checkpoints plus the venv (~2.1 GB total per `LOCAL:28`), and a rollback target always exists as the retained previous commit. [SOURCE: ~/.local/share/deem/bin/deem-ctl:149-155, :177-183; context/deem-local.md:20, :28]

## Per-Idea Records

### N-deepseek-02-1: Adopt the built lifecycle; do not rebuild it inside the hub

- **Idea:** `cli-deem`'s lifecycle commands are documentation over the existing, tested `deem-ctl`, not new code: `status` (health + commit pair), `start`/`stop` (operator), `update --check`/`update` (release-following, with rollback). The hub adds nothing that spawns, respawns or schedules.
- **Question:** A, G.
- **Builds on:** Angle question 1; `deem-ctl` as built (F1-F5, F11); `LOCAL:55-70`.
- **Value:** The operator gets one documented surface for the server it already runs, and the research does not pay for a redesign of a script already tested against a staged broken release (`LOCAL:68`).
- **Seam:** `~/.local/share/deem/bin/deem-ctl:9-16` (commands), `:190-206` (dispatch); wrapper text would live in the hub's `cli-deem` docs.
- **Metric, baseline, harness:** Metric: zero new lifecycle code; each documented command is one line of the existing script. Baseline: the script exists and was tested (`LOCAL:68`). Harness: the orchestrator's recorded start/update/rollback run (`LOCAL:68-70`) — no new harness.
- **Savings:** Avoids ~150-250 LOC of a re-implemented lifecycle; 0 calls.
- **Cost, latency, privacy:** None; the script sends state nowhere, and its release check reads public APIs only.
- **Two-backend gate:** The lifecycle is operator tooling, not a repo feature; it needs no switch. Repo-side features detect it exclusively through N-deepseek-01-1; with no server, nothing changes.
- **Rough LOC:** 0 new; ~10 lines of docs.
- **Verdict:** **build-now as documentation** (the lifecycle section of `cli-deem`), keeping `deem-ctl` operator-owned.
- **Confidence:** Confirmed from the script and LOCAL's test record.

### N-deepseek-02-2: The probe takes deem-ctl's backend rule and adds the model pin

- **Idea:** Amend N-deepseek-01-1's pass condition to reuse `deem-ctl`'s accepted backend vocabulary (`torch`, `ensemble:` without `stub`) **plus** the `model == deem-0.8-v1` pin; a backend-only check (deem-ctl's) accepts a correctly-shaped but wrong checkpoint.
- **Question:** A.
- **Builds on:** F2; iteration 1 F2-F3; ALL-4.
- **Value:** One availability definition that is at least as strict as the script that starts the server, and stricter where it matters (which weights are live).
- **Seam:** Probe pass condition (N-deepseek-01-1); rule source `deem-ctl:58-66`.
- **Metric, baseline, harness:** Metric: a torch-backend stub-less server with `model: other` is refused by the probe; baseline `deem-ctl` would accept it. Harness: add the "wrong model, real backend" fixture to the four of iteration 1 F11.
- **Savings:** 0 calls; prevents measuring one checkpoint's numbers under another's name.
- **Cost, latency, privacy:** None beyond the probe.
- **Two-backend gate:** The Deem half only; skip line `deem arm skipped: unexpected model <found>`.
- **Rough LOC:** 1 condition in the probe + 1 fixture.
- **Verdict:** **build-now as gate text.**
- **Confidence:** Confirmed from both code sides.

### N-deepseek-02-3: Every Deem measurement records the commit pair

- **Idea:** Any record produced by a Deem arm carries `model <sha7> source <sha7>` copied from `deem-ctl status` output at measurement time; a report missing the pair cannot feed a keep rule.
- **Question:** A, H.
- **Builds on:** F9; the parent's "kept current with Deem's releases" (goal D1, `goal.md:48`); `LOCAL:20-22`.
- **Value:** An update changes answers under every measured keep rule; this keeps a number measured on one commit from being read as another's.
- **Seam:** Record header of each future arm; source line `deem-ctl:195-202`.
- **Metric, baseline, harness:** Metric: 100% of measurement rows carry the pair. Baseline: no record format exists. Harness: a lint over the arm's output header (greppable).
- **Savings:** 0 calls; prevents a re-measurement of everything after a silent update.
- **Cost, latency, privacy:** None; the pair is local and public (commits, not content).
- **Two-backend gate:** Applies to Deem arms only; Jev arms record their model/provider as BASE2 already requires.
- **Rough LOC:** ~5 lines per arm; no shared helper before the third caller.
- **Verdict:** **build-now as a contract line** for every Deem arm.
- **Confidence:** Confirmed from code.

### N-deepseek-02-4: Idle footprint is an operator decision with three priced options

- **Idea:** With no idle eviction, the served Deem holds ~3,368 MB physical while idle (LOCAL `:43`). Options: (a) accept it and keep the server warm (best latency, zero new code); (b) add an idle-stop to `deem-ctl` mirroring the repo's opt-in eviction (`model-server-supervision.cjs:224-234`), paying a ~10 s cold start per session (`LOCAL:44`); (c) start/stop per use (rejected: hooks must not spawn servers, and 10 s cold breaks hook budgets). The recommendation is (a) for now, with (b) recorded for the operator.
- **Question:** A, H.
- **Builds on:** F7; `LOCAL:42-44`; repo eviction contract.
- **Value:** Prices the one real operational cost difference against the pattern the repository already runs.
- **Seam:** `deem-ctl` start/stop; comparison `model-server-supervision.cjs:224-234`.
- **Metric, baseline, harness:** Metric: idle RSS/footprint while unused, sampled once; baseline 3,368 MB (`LOCAL:43`). Harness: `ps`/`footprint` sample — the operator runs it; no repo harness.
- **Savings:** Memory only; no token or pass saving.
- **Cost, latency, privacy:** (b) buys memory with a 10 s cold start and a new script path; (a) buys latency with memory.
- **Two-backend gate:** Orthogonal; if the server is stopped, the probe skips and features behave as today.
- **Rough LOC:** 0 now; ~20 lines in `deem-ctl` for (b), operator-owned.
- **Verdict:** **later (operator decision); option (a) recorded as the default.**
- **Confidence:** Confirmed: the footprint and start numbers are LOCAL's; the comparison is from code. Inferred: that the operator prefers warm.

### N-deepseek-02-5: One smoking decision on `start`, and after a stopped-server update

- **Idea:** Add `smoke_decision` to `start_server` so every start proves the loaded weights can answer, and run it after an update even when the server was previously stopped; costs one `choice` (~60 ms) and closes F6.
- **Question:** A.
- **Builds on:** F6; smoke exists at `deem-ctl:79-85`.
- **Value:** A bad checkpoint cannot silently become the served one through the stopped-server path the launchd schedule will usually take.
- **Seam:** `deem-ctl:105-121` (start) and `:166-167` (smoke condition).
- **Metric, baseline, harness:** Metric: a checkpoint that loads but fails a decision is rejected at start; baseline today passes it. Harness: start against a checkpoint with corrupt weights — operator test only (the lineage never runs Deem).
- **Savings:** Prevents one class of silent wrong-model measurements; no direct saving.
- **Cost, latency, privacy:** One local `choice` per start; no egress.
- **Two-backend gate:** Operator tooling; no repo switch.
- **Rough LOC:** ~3 lines in `deem-ctl` (propose to operator; `shellcheck` clean, tested).
- **Verdict:** **next as a propose-to-operator change**; not a repo deliverable.
- **Confidence:** Confirmed from code (the gap); inferred: that corrupt-checkpoint-loads-but-cannot-decide is reachable.

### Dropped: repo-side spawn, respawn or idle eviction of Deem

- **Idea:** Have the repo supervise Deem the way `hf-model-server.cjs` supervises the embedder (respawn lock, crash-loop guard, idle eviction).
- **Reason:** The server is operator-owned (parent D3); a repo-side supervisor would break "with neither, exactly today" and add a daemon for no measured saving. Dropped. The comparison stays useful as evidence, not as a build.
- **Confidence:** Confirmed by scope (`spec.md:84-88`, `goal.md:48`).

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| `deem-ctl` exists at 208 lines with start/stop/status/update and a 0-4 exit taxonomy | **new** (round 2 had no Deem) | `deem-ctl:9-16`, `:190-206` |
| Its health rule refuses `stub` but does not pin the model id | new | `deem-ctl:58-66` |
| Start pins `DEEM_MODEL_ID=deem-0.8-v1`, `DEEM_DEVICE=mps`, loopback, `HF_HUB_OFFLINE=1` | new | `deem-ctl:105-121` |
| Update: download-partial→rename, checkout, restart, smoke, rollback (exit 3), prune to live+previous | new | `deem-ctl:137-183` |
| A stopped-server update skips the smoke decision | new (gap) | `deem-ctl:160-173` |
| `stop_server` does not wait for exit; health is not tied to the new PID | new (inferred race) | `deem-ctl:123-128`, `:105-121` |
| Repo embedder supervision: respawn lock, crash-loop backoff, opt-in idle eviction, drain | new (comparison) | `model-server-supervision.cjs:44, :224-234, :241-301, :739-760`; `hf-model-server.cjs:29-40` |
| Commit pair exists only in `deem-ctl status`, not in `/health` | new | `deem-ctl:97-99`, `:195-202`; `deem_server.py:772-777` |
| Loopback bind in our instance; vendor deploy example binds `0.0.0.0` | confirms ALL-3 with the bind line | `deem-ctl:114`; `README.md:222` |
| Jev lifecycle and gate | restated (not reopened here) | BASE2 sections 11 |

## Sibling check

Independent: no round-3 sibling file read.

## Hand-off

- deepseek-06: the `custom` provider's Deem path must not be described as this lifecycle; the wrapper question is about the client, not the server.
- deepseek-08: the warm/cold live-seam design uses F4's restart window and N-deepseek-02-4's options; do not propose a hook that starts the server.
- deepseek-09: F6/F8 are the Deem-side failure lines the survivor table must print.
- deepseek-10: `cli-deem`'s phase amendment cites `deem-ctl` commands as documentation, not as new code (N-deepseek-02-1).
- Later waves: re-read `LOCAL` after the run settles if the served commit changed; every measurement record needs the pair (N-deepseek-02-3).
