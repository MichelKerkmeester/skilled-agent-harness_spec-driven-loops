---
title: "Iteration 1 — deepseek-01: The two-backend gate as code: what \"Deem is available\" means"
trigger_phrases: []
---

# Iteration 1 — deepseek-01: The two-backend gate as code

## Focus

Angle **deepseek-01** (W1): *The two-backend gate as code: what "Deem is available" means.* Maps to questions A and H; answers angle questions 1 to 5. All claims below were opened this iteration; BASE2's Jev half is quoted as BASE2's. No round-3 sibling file was read (W1).

## Actions Taken

1. Read the Deem server: `context/deem-main/serve/deem_server.py` — defaults (`:107-109`), `RequestError`/`BackendError` (`:120-129`), `StubBackend` (`:137-154`), `TorchBackend` init and option cap (`:165-190`, `:222-231`), request parsing (`:511-563`), answer serialization (`:594-620`), `DeemCore.health` (`:772-777`), `_send_json`/`_read_body`/`do_OPTIONS`/`do_GET`/`do_POST` (`:804-842`, `:843-861`, `:867-905`), `make_server` and `main` (`:907-911`, `:962-1005`).
2. Read the Deem MCP server: `context/deem-main/serve/deem_mcp.py` — tool schemas (`:96-123`), `tools/call` handling (`:164-210`), `make_core` stub fallback (`:215-238`), stdio `serve`/`main --stub` (`:240-284`).
3. Read `context/deem-main/serve/README.md`: stub note (`:30-32`), error taxonomy (`:100-110`), `/v1/models` and `/health` examples (`:238-246`), env table (`:244-255`).
4. Read the parent gate text: `goal.md:49` (D1) and `spec.md:121` (two-backend gate).
5. Read BASE2's shared gate contract: `../004-deep-research-expansion/research/research.md:607-627` (quoted as BASE2's).
6. Read `context/deem-local.md` whole (LOCAL): served id `:26`, measured p50/p95 and footprint `:34-46`, spawn-cost gap `:50`, health rule and update paths `:55-70`.
7. Read the hook deadlines this probe must fit: `.claude/settings.json:103-116` (UserPromptSubmit, 3 s each) and `:215-222` (PreCompact, 3 s); BASE1 row 1's 2,500 ms advisor child kill is quoted as BASE1's.
8. Nothing was executed: no `jev` call, no Deem server call.

## Findings

**F1 (new; answers the shape half of angle question 1). `/health` is a pure dict read, not a model call.** The route is `if path == "/health": self._send_json(200, self.core.health())` (`deem_server.py:845-846`), and `DeemCore.health` returns exactly `{"status": "ok", "model": self.model_id, "backend": self.backend_name}` (`:772-777`). `backend_name` is the backend object's `name` (`:646-648`). No forward pass, no weight load and no state read happen on this path — a probe is free. `/v1/models` (`:847-857`) echoes the same `model_id` and is a redundant second source. [SOURCE: context/deem-main/serve/deem_server.py:646-648, :772-777, :845-846, :847-857]

**F2 (new; answers angle question 1's stub half; confirms ALL-4 in code). A stub server passes `status` alone and refuses only on `backend`.** When `--checkpoint`/`DEEM_CHECKPOINT` is unset, `main` prints a stub notice and builds `StubBackend` anyway (`:972-977`); the stub's `slot_logits` are uniform zeros (`:149-154`) and its `name = "stub"` (`:145`). The server then binds and serves; `/health` returns `{status: "ok", model: <whatever --model-id says>, backend: "stub"}`. A check reading `status == "ok"` alone therefore passes a server with no model loaded; the check must read `backend` and refuse the literal `stub`. This is ALL-4's finding confirmed at the code that produces it: `:137-154`, `:972-977`, `:772-777`. [SOURCE: context/deem-main/serve/deem_server.py:137-154, :145, :149-154, :772-777, :972-977]

**F3 (new; answers angle question 1's model-id half). The model id needs a pin, because nothing in the server ties it to the served weights.** `DEFAULT_MODEL_ID = "deem-1.5"` (`:107`), overridable by `--model-id` or `DEEM_MODEL_ID` (`:929-931`), and `health()` reports it back verbatim (`:775`). The orchestrator served `deem-0.8-v1` (`LOCAL:26`), not the default. So a bare `status ok` + `backend != stub` can be answered by any Deem-shaped process on port 8300 started with any id; the pass condition needs `model == "deem-0.8-v1"` (or the id a later iteration pins per feature) to prove which checkpoint is live. The README's own env table lists `DEEM_MODEL_ID` default `deem-1.5` (`README.md:244-255`), so the pin is also the defence against the documented default. [SOURCE: context/deem-main/serve/deem_server.py:107, :775, :929-931; context/deem-main/serve/README.md:244-255; context/deem-local.md:26]

**F4 (new; confirms ALL-3 with the producing lines). The server has no authentication and sends `Access-Control-Allow-Origin: *` on every JSON answer and every preflight.** `_send_json` sets the header on all responses (`:809-811`), and `do_OPTIONS` repeats it (`:837-839`). No handler reads an `Authorization` header anywhere in `do_GET`/`do_POST` (`:843-905`); the allowlist only *offers* Authorization as an allowed request header. Consequence for the gate: any process or open web page that can reach `127.0.0.1:8300` can answer the probe. The model-id pin of F3 plus the stub refusal of F2 are what keep a foreign or stub server from being read as "Deem available"; neither is authentication. The exposure itself is the operator's call (proxy or bind change), not a lineage deliverable. [SOURCE: context/deem-main/serve/deem_server.py:804-811, :837-839, :843-905; context/deem-local.md:72]

**F5 (new; answers angle question 2). The exact failure taxonomy a caller meets, with statuses.** Validation failures raise `RequestError`, default status 400 (`:120-125`): non-object question (`:519-521`), invalid type (`:522-526`), `choice` without an options list (`:535-537`), `score` without levels (`:545-547`), missing `/v1/systemone` `state` (`:882-884`). The body cap is 8 MiB (`MAX_BODY_BYTES`, `:109`) and returns 413 `body_too_large` (`:821-831`). More options than the torch backend reads (26 letters) returns 400 `unsupported_option_count` (`:222-231`). Wrong method/endpoint returns 405/404 (`:858-861`, `:868-870`). A model-side error returns 500 `backend_error` and anything else 500 `internal_error` (`:900-904`). A 400 whose message names `unsupported_option_count` is the only one that depends on the loaded backend; the rest are client or transport classes. All error bodies share the shape `{"error": {"message", "type", "code"}}` (`README.md:100-110`). [SOURCE: context/deem-main/serve/deem_server.py:109, :120-125, :222-231, :519-547, :821-831, :858-870, :882-884, :900-904; context/deem-main/serve/README.md:100-110]

**F6 (new; answers angle question 2's "still loading" and "other process" cases). A loading server is indistinguishable from an absent one, by construction.** `main` builds the backend (torch loads weights in `TorchBackend.__init__`, `:171-190`) *before* `make_server` binds the port (`:1000`) and `serve_forever` runs (`:1003-1005`). While weights load, the port is unbound, so a caller gets connection refused — the same signal as "not started". A second process on port 8300 makes `ThreadingHTTPServer((host, port))` raise `OSError` inside `make_server` (`:907-911`), so `deem-ctl start`'s health wait fails rather than silently serving something else; the probe may still reach the foreign process, which is why F3's pin matters. `deem-ctl`'s health rule already encodes the stub refusal (`LOCAL:70`: "parses the `backend` field and refuses `stub`"), quoted as LOCAL's measurement, not derived here. [SOURCE: context/deem-main/serve/deem_server.py:171-190, :907-911, :1000-1005; context/deem-local.md:70]

**F7 (new; scope note, not a gate path). The MCP server is stdio JSON-RPC with no health route and builds its own core.** `deem_mcp.py` exposes `classify`/`score`/`check` tools (`:96-123`), handles them in a stdio loop (`:240-263`), and `make_core` repeats the env-driven backend choice with the same StubBackend fallback (`:215-238`); `main --stub` forces the stub (`:266-284`). It has no HTTP surface, so the two-backend check for a live HTTP Deem never reaches it. If a future feature calls Deem through MCP, its own availability question is "does this stdio process start", which is a different contract; recorded here so later iterations do not conflate the two. [SOURCE: context/deem-main/serve/deem_mcp.py:96-123, :215-238, :240-263, :266-284]

**F8 (new; answers angle question 5). Check cost: the probe is zero-call and zero-model; a real judgment spends one forward pass.** `/health` builds a dict and `/v1/models` a list — neither touches the model (`:772-777`, `:847-857`; F1). The first real cost appears at `/v1/systemone`, where `core.decide` runs the batch (`:888-896` response, `:649` decide). LOCAL measured the primitives at p50 60.2 to 60.5 ms and p95 62.8 to 78.5 ms on warm synthetic inputs (`LOCAL:34-38`), and a physical footprint of 3,368 MB with a ~10 s start to healthy (`LOCAL:42-44`). The cost of a client spawn or connection *inside a hook* is explicitly unmeasured (`LOCAL:50`) — this iteration keeps it apart from the warm p95 and marks the fit inferred. [SOURCE: context/deem-main/serve/deem_server.py:649, :772-777, :847-857, :888-896; context/deem-local.md:34-44, :50]

**F9 (new; answers angle question 4's deadline half, code-open). The hook deadlines that bound any probe, from the installed settings file.** `PreCompact` runs `compact-inject.js` with `"timeout": 3` (`settings.json:215-222`); `UserPromptSubmit` runs `user-prompt-submit.js` and `spec-gate-classify.mjs` each with `"timeout": 3` (`:103-116`); `SessionStart` hooks use 3 s and 5 s (`:120-157`). BASE1 row 1's `2,500 ms` advisor child kill is BASE1's number, not reopened here. A probe's own timeout must fit inside these, and the feature's own judgment call must fit after the probe — so the probe budget is the hook budget minus the feature's reserved budget, not the full 3 s. [SOURCE: .claude/settings.json:103-116, :215-222; BASE1 row 1]

**F10 (new; answers angle question 3's decision half). Preference rule and skip-table can be written without a call tonight.** The parent leaves backend preference to the feature (`spec.md:121`; `goal.md:49`); both available is a real state because `jev auth status` and Deem health are independent. The lens's answer: prefer Deem when the payload is repository text or the judgment is cheap and error-tolerant (local, free, no key); prefer Jev when the feature needs the provider's typed semantics or a gold-calibrated decision. Each feature keeps its own switch (BASE2 row 42, quoted). The Deem skip lines are new material (F1-F6 supply them); the Jev skip lines stay BASE2 section 11's. [SOURCE: spec.md:121; goal.md:49; ../004-deep-research-expansion/research/research.md:607-627]

**F11 (new; a recorded gap). Nothing in the repository implements a Deem check today, so the gate's harness is the smallest missing artifact.** The only health logic on record is inside `deem-ctl` (`LOCAL:70`) and the orchestrator's install probe (`LOCAL:20-28`); no script or hook in `.skilled/` reads `/health`. The harness this gate needs is a fixture set, not a live server: three stub HTTP servers returning (a) `{status ok, backend stub}`, (b) `{status ok, backend torch, model deem-1.5}`, (c) a malformed body, plus a refused port — each producing its own skip line with the zero-call output byte-identical. That is testable with no weights and no network beyond loopback. [SOURCE: context/deem-local.md:20-28, :70; search of `.skilled/` for `/health` and `deem-0.8-v1` in this iteration]

**F12 (confirms BASE2 with new evidence; answers angle question 3). The Jev half unchanged, and the two halves stay apart.** BASE2 section 11 fixes the three Jev checks in order (`command -v jev`, version `jev 0.6.2`, `jev auth status` exit 0) and their skip lines; this iteration adds the Deem half below it and changes none of it. Critically, the Jev half's check 3 (`auth status`) is *not* a Deem check: for a `custom`-provider Deem setup it reports on a stored Jev key, not on a live server (deepseek-06 settles the failure side). The gate therefore composes as two independent probes feeding one per-feature switch, never as one probe with two readings. [SOURCE: ../004-deep-research-expansion/research/research.md:607-627]

## Per-Idea Records

### N-deepseek-01-1: The Deem availability check, exact

- **Idea:** One `deem_available()` probe every Deem arm calls: HTTP `GET http://127.0.0.1:8300/health` with a bounded timeout, parse JSON, pass only when `status == "ok"` **and** `backend` is present and `!= "stub"` **and** `model == "deem-0.8-v1"` (per-feature override for a deliberately different served id). Any failure prints one skip line and leaves the feature's output byte-identical. Type: process contract (no judgment).
- **Question:** A, H.
- **Builds on:** Angle question 1; ALL-4; LOCAL:70; `goal.md:49` / `spec.md:121`; BASE2 section 11 (Jev half, unchanged).
- **Value:** Every later Deem feature in this research can assume one identical availability definition; the stub, a foreign server and a wrong checkpoint are all refused before any judgment is attempted.
- **Seam:** `context/deem-main/serve/deem_server.py:772-777` (health), `:845-846` (route), `:137-154`/`:972-977` (stub); the future probe call site is each feature's own script, none exists today (F11).
- **Metric, baseline, harness:** Metric: four refusal cases print their own line and zero calls are made. Baseline: no Deem check exists anywhere (F11). Harness: the four-fixture stub-server test of F11; the `deem-ctl` rule (`LOCAL:70`) is the behavioral reference.
- **Savings:** No direct saving; it is the permit that lets every other saving exist with no key/no server behavior change. 0 calls, ~1 loopback round trip.
- **Cost, latency, privacy:** One loopback GET with no model pass (F8). Offline: nothing leaves the machine. The server itself is unauthenticated with CORS `*` (F4) — anything on the machine can answer; the pin is the only discriminator.
- **Two-backend gate:** This IS the Deem half. Its own switch stays per-feature (no global switch). Jev probes as BASE2 section 11; Deem probes as above; when both pass, the feature's preference rule (F10) decides. With neither: zero-call output byte-identical, exit 0.
- **Rough LOC:** ~25-40 lines for the probe plus 4 fixture tests; ~15 lines if inlined into the first arm.
- **Verdict:** **build-now as gate text** (an amendment to the phase docs that write the gate), next as code (the first Deem arm carries it).
- **Confidence:** Confirmed from code: health shape, stub, id default, routes, statuses (F1-F6). Inferred: that a client spawn fits the hook budgets (F9), because spawn cost is unmeasured (`LOCAL:50`).

### N-deepseek-01-2: Probe timeout budget: 2,000 ms offline, 500 ms in hooks, and never start the server from a hook

- **Idea:** Offline scripts give the probe a 2,000 ms ceiling; live hooks give it 500 ms, leaving at least 2 s of their 3 s budget for the feature's own call (or the 2,500 ms advisor kill, BASE1 row 1); a cold server (~10 s to healthy, `LOCAL:44`) simply fails the probe and is skipped — no hook starts or restarts the server.
- **Question:** H (cost and order), A.
- **Builds on:** Angle refinement "fit the probe timeout into a hook budget"; LOCAL:34-50; settings deadlines F9.
- **Value:** A cold or stopped server degrades to today's behavior in bounded time instead of stalling a hook; the operator restarts `deem-ctl` deliberately (`LOCAL:55-70`).
- **Seam:** The probe call site (F11); deadlines at `.claude/settings.json:110`, `:115`, `:222`; BASE1 row 1.
- **Metric, baseline, harness:** Metric: worst-case probe time ≤ 500 ms in hooks, ≤ 2,000 ms offline, measured with a stub server that sleeps. Baseline: UNKNOWN — no probe exists; a hook today pays nothing. Harness: the F11 fixtures plus a sleeping-stub case.
- **Savings:** Bounds a failure's cost; no token saving itself.
- **Cost, latency, privacy:** Worst case is the timeout; loopback only; cold start cost (~10 s, `LOCAL:44`) is paid by the operator's `deem-ctl start`, never by a hook.
- **Two-backend gate:** Timeout is part of the probe's pass condition; with a cold/absent server the Deem half fails its own switch and the feature behaves as today. No global fallback.
- **Rough LOC:** 3-5 lines of timeout constants plus one sleeping fixture.
- **Verdict:** **build-now as gate text**; ships with N-deepseek-01-1.
- **Confidence:** Confirmed: deadlines, cold-start number. Inferred: 500 ms headroom is enough for spawn + 78.5 ms p95, because spawn cost is unmeasured (`LOCAL:50`) — the fixture measures it.

### N-deepseek-01-3: Skip-line table and both-backends preference, written once

- **Idea:** Freeze the Deem skip lines — `deem arm skipped: server not reachable` (refused/timeout/non-200/JSON parse), `deem arm skipped: stub backend`, `deem arm skipped: unexpected model <found>`, `deem arm skipped: health response malformed` — and the preference rule: Deem first for payload-bearing or high-volume cheap judgments, Jev first for typed-semantics or gold-calibrated judgments; each feature's switch decides whether either probe runs.
- **Question:** A, H.
- **Builds on:** F1-F6, F10; BASE2 section 11 skip lines (Jev, unchanged).
- **Value:** The operator reads one vocabulary across every Deem feature; the synthesis can map lineage findings onto stable printed lines.
- **Seam:** Same as N-deepseek-01-1; the Jev lines at `../004-deep-research-expansion/research/research.md:607-627`.
- **Metric, baseline, harness:** Metric: each refusal path prints exactly its line; with neither backend, per-feature output is byte-identical (diff test). Baseline: no lines exist. Harness: the F11 fixtures.
- **Savings:** Zero; it is the consent surface the savings ride on.
- **Cost, latency, privacy:** None beyond the probe.
- **Two-backend gate:** The table itself; every line is a skip, never an error, and no path returns a default score or verdict (BASE2 row 9 rule, quoted).
- **Rough LOC:** ~6 lines of constants plus doc text.
- **Verdict:** **build-now as gate text.**
- **Confidence:** Confirmed from code (F1-F6) for each line's trigger.

### Dropped: a global `DEEM_ENABLED` switch

- **Idea:** One environment flag that turns every Deem feature on or off.
- **Reason:** BASE2 row 42 forbids a global switch and requires per-feature switches; a global flag also cannot express "this feature prefers Jev". Dropped.
- **Confidence:** Confirmed from BASE2 row 42 (quoted).

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| The exact Deem availability check (`/health`, `status ok`, `backend != stub`, `model == deem-0.8-v1`) | **new** | `deem_server.py:772-777`, `:845-846`, `:107`, `:775`; `LOCAL:26` |
| A stub server passes `status` alone; `backend` must be read | new (ALL-4's code confirmation) | `deem_server.py:137-154`, `:972-977` |
| Server is unauthenticated with CORS `*` on every answer | confirms ALL-3 with producing lines | `deem_server.py:809-811`, `:837-839` |
| Failure taxonomy: 400 / 413 / 400 unsupported_option_count / 404 / 405 / 500 | new | `deem_server.py:120-125`, `:830`, `:226-231`, `:858-870`, `:900-904` |
| Loading weights = connection refused (bind after load) | new | `deem_server.py:171-190`, `:1000-1005` |
| MCP has no HTTP health surface | new | `deem_mcp.py:96-123`, `:215-238`, `:240-284` |
| Probe cost is zero model passes; warm call p50 60.2-60.5 ms | restated from LOCAL, kept apart from spawn cost | `LOCAL:34-38`, `:50` |
| Hook deadlines 3 s (PreCompact, UserPromptSubmit) | new (code-open) | `.claude/settings.json:110`, `:115`, `:222` |
| Jev three-check gate and skip lines | restated (BASE2 section 11) | `../004-deep-research-expansion/research/research.md:607-627` |

## Sibling check

Independent: no round-3 sibling file read.

## Hand-off

- deepseek-02: audit the built `deem-ctl` and `com.skilled.deem-update` against this probe; name who starts/stops the server and whether the launchd agent restarts a stopped server.
- deepseek-04: open the skill-advisor hook and PreCompact sources for the real budgets; this iteration only read `settings.json` timeouts.
- deepseek-06: settle whether the `custom` provider's check can be confused with the Deem probe (F12); the `auth status` half is Jev-only.
- deepseek-09: reuse this failure taxonomy for the two-backend failure table and kill lines.
- deepseek-10: this probe's four skip lines and the preference rule (N-deepseek-01-3) are the Deem half every phase amendment needs.
