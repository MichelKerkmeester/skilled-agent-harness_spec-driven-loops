---
title: "Iteration 1: cli-deem's smallest slice as code — wrapper, translator or client"
trigger_phrases: []
---
# Iteration 1: cli-deem's smallest slice as code — wrapper, translator or client

**Angle:** swe-01 · **Lens:** code-level slice design · **Jev package under study:** Python `jev-cli` 0.6.2 (wrapped by `.skilled/skills/cli-jev/cli-usage/`); the npm `jevctl` 0.2.3 is vendored research material only

Independent: no round-3 sibling file read.

## Focus

Decide the smallest honest `cli-deem` slice in code: shell the Python `jev-cli` at `--provider custom`, put a translator in front of it, or write a small stdlib client to `/v1/systemone`. Settle the wire question from both sides' code, map Deem failures onto the `jev` exit taxonomy, square the no-auth server with the `custom` provider's mandatory key (ALL-8), and scope the lifecycle commands as a wrap-or-vendor decision about the tested `deem-ctl` (per the swe-01 refinement).

## Actions Taken (opened this iteration)

- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py` whole file (PROVIDERS `:18-39`, `api_key` `:90-109`, `provider_request` `:221-235`, `provider_endpoint` `:253-265`, `provider_model` `:268-271`, `call` `:274-302`, parsers `:305-361`, `question_request` `:364-369`, `request_for` `:372-386`, `primary_value` `:389-393`, `main` `:396-447`)
- `context/deem-main/serve/deem_server.py` (env contract `:32-44`, `DEFAULT_MODEL_ID`/`MAX_BODY_BYTES` `:107-109`, `StubBackend` `:137-145`, `parse_question` `:519-550`, `parse_questions` `:553-586`, `_serialize_answer` `:594-621`, `DeemCore.decide` `:649-770`, `health` `:772-777`, handler `:785-904`, `main` `:920-1014`)
- `context/deem-main/serve/tests/test_server.py` (grep: fixture names and the letter-cap case `:218-233`; module docstring `:1` — "stub backends only")
- `~/.local/share/deem/bin/deem-ctl` whole file (208 lines; config `:24-36`, `health_ok` `:60-66`, `smoke_decision` `:81-85`, `start_server` `:105-121`, `update` `:134-184`, exit codes `:11-16`)
- `.skilled/skills/cli-jev/cli-usage/SKILL.md:1-45` (hard rules), `references/cli-reference.md:146-185` (exit table, auth semantics)
- `context/deem-local.md` whole (install `:20-28`, measurements `:34-44`, operate `:55-70`)

## The wire question, settled field by field

**Request side.** `question_request` builds `{"state", "model", "questions": {"answer": {"type", "instructions", "criteria"?}}}` (`jev_cli/__init__.py:364-369`); `criteria` is `dict(args.option)` for `choice` and `args.level` (a list) for `score` (`:378`), and absent for `noul` (`:367-368`). Deem's `parse_question` requires `options` as a **list** for choice (`deem_server.py:535-537`) and `levels` as a **list** for score (`:542-544`); a missing `instructions` fails inside the question constructor via `DeemError` → `RequestError` (`:548-549`, exercised by `test_server.py:193`). So under `--provider custom` pointed at Deem:

- `noul` reaches Deem **unchanged** — `criteria` is never emitted.
- `choice` gets HTTP 400 `needs an options list` — jev-cli sends `criteria` (a `KEY=DESCRIPTION` dict), never `options`. The gap is not just the field name: jev options are key→description pairs and the returned answer is a key; Deem options are plain strings and `choice` returns one of them (`:598`).
- `score` gets HTTP 400 `needs a levels list` for the same reason.

**Response side.** Deem's envelope is `{"id", "object": "systemone.completion", "created", "model", "answers": {qid: {...}}, "usage"}` (`:890-897`) — the `answers.answer.<field>` path `primary_value` reads (`:389-393`) exists. The field gap: Deem `noul` answers carry `value` (`:618`) where jev-cli reads `answer["noul"]`; Deem `score` answers carry `level` (`:606`) where jev-cli reads `answer["score"]`; Deem `choice` answers carry `choice` (`:598`) — the one field `primary_value` and Deem agree on. Consequence: `jev choice --provider custom --endpoint <deem>` fails at request build (400); `jev noul`/`jev score` against Deem-shaped answers break only under `--value` (`KeyError` → exit 1, `:438-439`); without `--value` the caller gets Deem's JSON and must know its field names.

**`run` is the clean pass.** `request_for` loads the caller's payload verbatim (`:372-376`); `provider_request` transforms only `vercel` (`:224-235`), so a Deem-shaped payload (with `options`/`levels` and Deem field expectations) reaches the server unchanged, and `kind=None` means no `primary_value` field lookup. `--value` with `run` is refused only after the call returns (`:391` is checked in `primary_value` at `:430-431`; `cli-reference.md:23-25` documents this billed-call ordering).

**`model` is silently ignored by Deem.** `do_POST` reads `state`, `questions`, `dataset` only (`:880-889`); the response `model` is the server's loaded id (`:894`). `JEV_MODEL`/`--model` against Deem is decorative — a correctness note for the client shape.

**Auth.** `call` always sends `Authorization: Bearer <key>` (`:280`); `api_key("custom")` resolves `JEV_API_KEY` env first, then `credentials.json` `providers.custom`, and exits 3 without either (`:90-109`). Deem's `do_POST` has no auth check (`:867-904`) and `Access-Control-Allow-Origin: *` (`:809`, `:837`). A placeholder `JEV_API_KEY` in the spawned environment satisfies `:92` without writing anything to the credential store — "Jev gets no secret" holds because the string is never a Jev credential and never leaves the loopback call Deem ignores.

## Per-Idea Records

### N-swe-01-1 — `cli-deem` as a thin stdlib client to `/v1/systemone`

| Field | Content |
|---|---|
| **Idea** | N-swe-01-1 — `deem-call.mjs` (node, stdlib `fetch`/`http`): `noul`/`choice`/`score`/`run`/`health` subcommands posting directly to `DEEM_ENDPOINT` (default `http://127.0.0.1:8300`). Translates Deem answer fields to the jev-cli answer shape (`value`→`noul`, `level`→`score`, `choice`→`choice`) so readers written for `jev` output work unchanged. Type: all four primitives; backend: Deem only. |
| **Builds on** | New — no baseline designed `cli-deem`. Reuses the `jev` CLI contract as the output contract. |
| **Value** | The only shape covering all three typed subcommands with a controllable exit map; gives the two-backend features one local transport. |
| **Seam** | New file under the future hub (swe-07 picks `cli-classifier/cli-deem/`). No existing file edits. |
| **Metric, baseline, harness** | Baseline: Deem p50 60.3 ms / p95 78.5 ms measured (`deem-local.md:34-38`); client adds spawn+connect — UNKNOWN, measured by the slice's own timing print. Harness: stub server fixture (below). |
| **Savings** | Enables every Deem-backed idea; itself saves nothing directly (estimate). |
| **Cost, latency, privacy** | One POST per judgment plus one `/health` per probe; nothing leaves the machine. No hook deadline by itself; callers carry their own. |
| **Two-backend gate** | This *is* the Deem leg. Switch: feature-level `--deem`/`cli-deem` invocation, never auto. Detect: `GET {endpoint}/health`, require `status=="ok"`, `backend` parsed and `!= "stub"` and `!= ""`, `model` equals the expected id when pinned (default `deem-0.8-v1`); refuse otherwise. On failure: `deem unavailable: <check>` + the Deem leg of the feature exits dormant. Malformed answer (non-object, missing `answers`) → exit 1 `unexpected API response`. Slow: configurable timeout, default 5 s (60 s like jev-cli `:288` is wrong for a local hook path). |
| **Rough LOC** | ~170 LOC: `parseArgs` ~30, `probe` ~25, `request` ~30, `translateAnswer` ~20, `printResult` (jev-shape emit + `--value`) ~25, lifecycle verbs delegating to `deem-ctl` ~25, errors/exit map ~15. Plus ~140 LOC tests. |
| **Verdict** | build-now as the first slice — it is the only shape that makes choice/score work and keeps the exit taxonomy honest. |
| **Confidence** | Confirmed from code on both sides of the wire. Inferred: that callers accept a node binary as the transport (swe-07 checks the hub's language norm). |

### N-swe-01-2 — the wrapper shape (rejected as the only slice, kept as a documented fallback)

| Field | Content |
|---|---|
| **Idea** | N-swe-01-2 — `cli-deem` shells `jev --provider custom --endpoint $DEEM_ENDPOINT` with a placeholder `JEV_API_KEY` in the child env. Type: passthrough. |
| **Seam** | `jev_cli/__init__.py:253-265` (endpoint resolution), `:280` (bearer always sent). |
| **Cost, latency, privacy** | Covers `run` (Deem-shaped payloads) and `noul` only; `choice`/`score` typed subcommands 400 on the `criteria` gap (`:368` vs `deem_server.py:535,:542`). `--value` broken on `noul`/`score` (`:389-393` vs `:606/:618`). |
| **Two-backend gate** | Adds `command -v jev` + version check to a Deem feature — a Jev dependency on a Deem path, exactly what the two-backend gate exists to remove. |
| **Rough LOC** | ~70 LOC. |
| **Verdict** | drop as the transport, keep as a documented zero-code path for `run`-only callers — it cannot serve `choice`/`score` and smuggles a Jev install requirement into the Deem leg. |
| **Confidence** | Confirmed from code; the 400s are also what `test_server.py:69,:126` style validation implies for `criteria`-only payloads. |

### N-swe-01-3 — the translator shape (rejected)

| Field | Content |
|---|---|
| **Idea** | N-swe-01-3 — a local JSON-rewriting proxy (or a patched `question_request`/`primary_value`) making `criteria`↔`options`/`levels` and `value`/`level`↔`noul`/`score` transparent to unmodified `jev-cli`. |
| **Seam** | `provider_request` `:221-235` is the in-client translation precedent (`vercel` remaps `noul`→`boolean`); Deem's answer fields `:594-621`. |
| **Value** | Would make the typed subcommands work against Deem without a new binary. |
| **Two-backend gate** | A proxy is a second supervised process; a patch is a fork of vendored semantics. Both exceed the client's LOC for the same coverage. |
| **Rough LOC** | proxy ~220 + supervision; patch ~60 + vendored-diff maintenance. |
| **Verdict** | drop — a second daemon or a vendored fork for four field renames fails the least-mechanism test; the client's `translateAnswer` (~20 LOC) is the same translation without either cost. |
| **Confidence** | Confirmed from code. |

### Lifecycle: wrap `deem-ctl`, do not redesign (per the swe-01 refinement)

`~/.local/share/deem/bin/deem-ctl` already implements the whole lifecycle and was tested by the orchestrator (`deem-local.md:68`): `health_ok` refuses `stub` and non-torch/non-ensemble backends (`deem-ctl:60-66`); `wait_healthy` bounds startup at 120 s (`:68-77`); `smoke_decision` proves weights with one real `choice` (`:81-85`); `update` downloads beside live (`:150-154`), flips `models/current` and detaches the source commit (`:163-164`), restarts and smoke-tests when running (`:166-167`), restores both on failure with exit 3 (`:168-172`), and prunes to live+previous (`:178-183`). `status` prints the served `model`/`source` commits (`:195-198`) — the per-record version stamp swe-08/deepseek-02's "carry the commit" requirement needs.

`cli-deem` lifecycle verbs map to one of three placements: **documented commands** (`deem-ctl status` output shapes the probe), **script** (`cli-deem` shells `deem-ctl start|stop|status|update` verbatim, ~25 LOC with `DEEM_HOME` respected `:24`), and **operator-only** (`update` timing, `launchctl` schedule, removal — the operator's per `deem-local.md:70` and parent D3). One real gap in `deem-ctl`: `health_ok` never compares `model` — a stale checkpoint serving as an unexpected id would pass (`:60-66` vs served id pinned at `:26`); the client's probe should check it.

### Exit map for the client (Deem failure → `jev` taxonomy)

| Deem event | Evidence | Client exit |
|---|---|---|
| Connection refused / timeout / DNS | `call` URLError→4 (`:298-299`) | 4 `deem unreachable: …` |
| HTTP 400 (bad question, >255 options via letter cap `test_server.py:218-233`, missing `state`) | `_send_error` `:815-819`, RequestError `:117-123` | 1 `unexpected API response` (server-side reject; jev maps non-mapped HTTP→1 `:296`) |
| HTTP 500 `backend_error` | `:901-902` | 4 |
| Health `backend:"stub"` or non-`ok` | `:772-777`, `deem-ctl:60-66` | 3 `deem not ready: stub backend` (repurposes credential-refusal slot for backend-refusal; documented) |
| Health `model` ≠ expected id | `:775` vs `deem-ctl:26` | 3 `deem not ready: model <found> (want <expected>)` |
| Non-object response, missing `answers` | jev precedent `:300-301` | 1 |
| Bad flags / missing endpoint config | CliError default `:47` | 2 |
| SIGINT | `:441-443` | 130 |

### Tests needing no weights (fixture: a 60-line stdlib stub server, ours)

refused connection (exit 4) · `{"backend":"stub"}` health (refuse, exit 3) · `{"backend":"torch","model":"deem-9b-v1"}` (model mismatch → exit 3) · 400 `needs an options list` (exit 1) · 500 `backend_error` (exit 4) · choice with 256 options (client-side pre-check against Deem's 2-255 bound `:18`, exit 2 before the call) · `run` batch passthrough preserving qid order (`:553-586`) · `--value` emitting `noul`/`choice`/`score` fields after translation. None need torch; the fixture mimics `_serialize_answer` output verbatim.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| `custom` provider reaches Deem unchanged only for `noul`; `choice`/`score` 400 on `criteria` vs `options`/`levels` | **new** (settles spec §7 open question 1) | `jev_cli/__init__.py:364-378` vs `deem_server.py:535-544` |
| Response field gap is asymmetric: `choice` aligns, `noul`→`value` and `score`→`level` diverge; envelope path `answers.<qid>` matches | **new** | `deem_server.py:594-621,:890-897` vs `jev_cli/__init__.py:389-393` |
| `run` is the clean pass — caller-shaped payload, no field lookup, `--value` refused post-call | **new** | `jev_cli/__init__.py:372-376,:391,:430-431` |
| Deem ignores request `model`; response `model` is the loaded id | **new** | `deem_server.py:880-894` |
| Placeholder `JEV_API_KEY` in child env satisfies the `custom` key requirement without a stored or real secret | **new** | `jev_cli/__init__.py:36,:90-109,:280`; `deem_server.py:867-904` (no auth) |
| `deem-ctl` already implements install-adjacent lifecycle with tested rollback; `health_ok` lacks a `model` pin | **new** | `deem-ctl:60-66,:134-198`; `deem-local.md:68` |
| Thin stdlib client (~170 LOC) beats wrapper (can't serve choice/score) and proxy/fork (second daemon or vendored diff) | **new** | this file's records |

## Ruled out

- Proxy translator: a second supervised process for four field renames (`provider_request`'s `vercel` branch `:224-235` shows translation belongs in the client).
- Patching vendored `jev-cli`: a fork's diff must track upstream; `question_request`/`primary_value` are three functions but the vendored tree is research material, not a buildable source.
- `jev auth set --provider custom` for the placeholder: mutates `~/.config/jev-cli/credentials.json` (`CREDENTIALS_FILE` `:41`) and makes `auth status --provider custom` claim a key that never authenticates anything.

## Hand-off

- swe-07: `cli-deem` lands as `cli-classifier/cli-deem/` (or the hub shape swe-07 picks); the client file, its tests and a `deem-ctl` delegation note are its contents — verify the hub's language norm (node `.mjs` vs bash vs python) against sibling hubs before fixing `deem-call`'s extension.
- swe-08: the probe contract (`status`/`backend`/`model` fields, refuse `stub`, 5 s default timeout) is the candidate shared helper; `deem-ctl:60-66` is the second implementation — shared vs duplicated is its question.
- Any lineage: the exit-3 repurpose (backend-refusal in the credential slot) needs a cross-lineage decision before a feature prints it.
