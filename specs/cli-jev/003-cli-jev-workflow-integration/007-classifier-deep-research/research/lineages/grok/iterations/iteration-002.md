# Iteration 2: grok-02: Wire compatibility, field by field

## Focus

Questions A and G. Compare the request the Python `jev-cli` 0.6.2 sends for `noul`, `choice`, and `score` with what Deem's `parse_question` accepts, then the answer object with what `primary_value` reads. The npm package is `jevctl` 0.2.3, vendored under `R/jev-cli-main`. The two packages stay apart. No live call.

Independent: no round-3 sibling file read.

Prefix `P` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`. Prefix `JEVSRC` = `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`. Prefix `R` = `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main`. Prefix `REF` = `.skilled/skills/cli-jev/cli-usage/references/cli-reference.md`.

## Findings

### Request keys

Deem's documented body uses `options` for choice and `levels` for score (`P/context/deem-main/serve/README.md:41-54`, `:85-87`). `parse_question` reads those keys and no others (`P/context/deem-main/serve/deem_server.py:519-550`). A missing `options` list is HTTP 400, message `needs an options list` (`:535-537`). A missing `levels` list is HTTP 400, `needs a levels list` (`:541-543`). Unknown keys on the question object are not read. Top-level keys other than `state`, `questions`, and `dataset` are not read (`:880-889`). `model` is ignored. There is no Authorization check. CORS allows the header and still does not read it (`:809-811`, `:835-839`).

The Python `jev-cli` builds one question id, `answer`, and puts option or level data under `criteria` (`JEVSRC:364-369`). `choice` sets `criteria` to a dict of `KEY=DESCRIPTION` pairs; `score` sets `criteria` to the list of level strings; `noul` sends no criteria (`JEVSRC:377-385`). The body also carries top-level `model` (`:369`). `REF:104-118` documents that shape and was reopened against the function.

| Key the Python `jev-cli` sends | Deem | HTTP |
|---|---|---|
| `state` | required (`deem_server.py:880-882`) | 200 if the rest parses |
| `model` | ignored | does not by itself fail |
| `questions.answer.type` = `noul` | accepted (`:523-528`, `:546-547`) | 200 when `instructions` is valid |
| `questions.answer.instructions` | read for all three types | 400 if the question constructor rejects it (`:548-549`) |
| `questions.answer.criteria` (choice dict) | not read; `options` missing | 400 |
| `questions.answer.criteria` (score list) | not read; `levels` missing | 400 |
| `options` | required for choice | the Python CLI never sends it |
| `levels` | required for score | the Python CLI never sends it |
| `Authorization: Bearer …` | not checked; header is CORS-allowed | the Python CLI always sends it (`JEVSRC:274-280`) and exits 3 when no key exists (`:90-108`) |

Exit codes are the Python `jev-cli`'s, from `call` (`JEVSRC:290-299`) and `main` (`:429-440`). They are not `jevctl`'s. `REF:146-155` matches this mapping and was reopened against those lines.

| Call, Python `jev-cli` against Deem | Exit | Why, from code |
|---|---|---|
| any subcommand, `--provider custom`, no endpoint | 2 | `provider_endpoint` (`JEVSRC:256-259`) |
| endpoint set, no `JEV_API_KEY` and no stored custom key | 3 | `api_key` (`:90-108`) before the socket opens (`:274-280`) |
| `choice`, with or without `--value` | 1 | HTTP 400 is not 401/403 and not 429/500/502/503/504, so `call` uses exit 1 (`:296`) |
| `score`, with or without `--value` | 1 | same 400 path |
| `noul` without `--value` | 0 | request parses; full JSON is printed (`:432-434`). The printed answer has `value`, not `noul` |
| `noul` with `--value` | 1 | `primary_value` reads `answer["noul"]` (`:389-393`); Deem returns `value` (`deem_server.py:616-620`); `KeyError` returns 1 (`JEVSRC:438-440`) |
| `score` if the request were translated to `levels`, then `--value` | 1 | Deem returns `level` (`:604-610`); `primary_value` reads `score` |
| `choice` if the request were translated to `options`, then `--value` | 0 | both sides use the key `choice` (`deem_server.py:595-601`, `JEVSRC:393`) |
| connection refused | 4 | `URLError` (`JEVSRC:298-299`) |
| HTTP 500 | 4 | `exc.code in (429, 500, 502, 503, 504)` (`:296`) |
| HTTP 401/403 | 3 | same line. Deem does not emit these; a proxy in front might |

Inferred. No request was sent. A live call would confirm the 400 body text.

### `run`

`jev run` sends the caller's object unchanged and sets `model` only when absent (`JEVSRC:372-376`; `REF:116-118`). A body written in Deem's shape (`options`, `levels`, no `criteria`) passes `parse_question`. Without `--value`, `run` prints the JSON and returns 0. With `--value`, `primary_value` raises `CliError` exit 2 because `kind` is None (`JEVSRC:390-391`), and that check runs only after a successful response (`:430-431`). So `run` is the one Python subcommand that can carry a Deem-shaped question, and `--value` on that success is exit 2, not a judgment.

That leaves the typed subcommands unable to reach Deem until something rewrites `criteria` into `options` or `levels` and rewrites `value`/`level` back into `noul`/`score`.

### npm `jevctl` 0.2.3

`jevctl` is a different package. Its ask schema requires `criteria`, not `options` (`R/src/core/ask.ts:11-26`). Flag parsing builds a criteria map or a level list and passes it to `choice()`, `noul()`, and `score()` imported from `@typesafe-ai/sdk` (`R/src/core/ask.ts:3`, `:99-114`). The transport then calls `client.systemOne` with that questions object (`R/src/provider.ts:192-209`). The SDK's serialized JSON is not in this repository. What is in the repository is that `jevctl`'s own schema rejects a Deem-shaped question (`options`/`levels`) before the SDK runs, and that its exit 2 means a tripped `--fail-on` gate (package contract in `R/CLAUDE.md:23`), which is not the Python CLI's usage exit.

Do not describe a `jevctl` exit as a Python `jev-cli` exit.

### `typesafe-sdk` vendor claim

Deem's module docstring says the official `typesafe-sdk` works drop-in via `TYPESAFE_BASE_URL` (`deem_server.py:2-6`). The serve README repeats it (`serve/README.md:173-184`) and says no auth is required. Both are vendor claims. The Python `jev-cli` is not that SDK: it sends `criteria` and always sends a bearer key. `jevctl` does call `TypeSafeClient.systemOne` and honors `TYPESAFE_BASE_URL` (`provider.ts:193-196`). Whether the SDK emits `options` or `criteria` is not visible in this repo, so the vendor claim matches neither client until the SDK source is opened. The curl examples Deem ships use `options` and `levels` (`serve/README.md:47-51`; `P/context/deem-main/README.md:28-33`). Those examples match `parse_question`. They do not match `question_request`.

### Would a Deem translation be the size of the Vercel one?

The Vercel translation is `provider_request` plus `normalize_response` (`JEVSRC:221-250`): it renames `noul` to `boolean` on the way out and `probability` back to `noul` on the way in, and it adds four headers. About thirty lines, and it runs only when `provider == "vercel"`.

A Deem translation is the same kind of hook, not a fork. It is larger because both directions rename different fields, and choice `criteria` is a dict while Deem `options` is a list of strings (`serve/README.md:85`). Mapping dict keys to the option list, and mapping `value` to `noul` and `level` to `score` on the way back, does not fit the Vercel branch unchanged. Rough size: one request function and one response function beside `:221-250`, on the order of 40 to 70 lines, plus tests. It still has to satisfy `api_key` (`:90-108`): the Python CLI will not send until a custom key exists, and Deem will ignore that key. ALL-8. A placeholder key in the credential store is a secret-shaped value for a server with no auth. That is the part a thin `--endpoint` wrapper does not solve.

### Idea N-grok-02-1

- **Idea:** `N-grok-02-1`. A translator in the Python `jev-cli`, in front of `call`, that rewrites `criteria` to `options`/`levels` and rewrites Deem's `value`/`level` to `noul`/`score` when the endpoint is the local Deem server. Type: `noul`, `choice`, and `score`. `run` stays a passthrough.
- **Question:** A, G
- **Builds on:** new. The spec's open question on the field gap. Not a BASE R id.
- **Value:** lets the typed subcommands the skill already wraps reach Deem without a second CLI binary.
- **Seam:** `JEVSRC:221-250` for the existing translation pattern; `JEVSRC:364-393` for the fields that must change; `deem_server.py:534-550` and `:594-620` for the other side.
- **Metric, baseline, harness:** exit code of `noul`/`choice`/`score` `--value` against a stub Deem. Baseline from this reading: choice and score exit 1 on HTTP 400; noul `--value` exits 1 on `KeyError`; noul without `--value` exits 0 while hiding the probability under `value`. Harness: Deem's stub backend, no weights (`serve/README.md:30-32`). Not run.
- **Savings:** none on context. It is the transport for later features.
- **Cost, latency, privacy:** one HTTP call per use. Deadline is the feature's, not this translator's. Jev (hosted) sends state off the machine. Deem keeps state on the machine. The Python CLI still attaches a bearer token (`JEVSRC:280`).
- **Two-backend gate:** its own switch is "endpoint is the local Deem health target", not a global switch. Prefer Jev when `jev auth status --provider <p>` exits 0 for the provider the feature names, because that path needs no field rewrite. Prefer this translator only when the feature's switch selects Deem and the health check passes. When the Deem check fails, the typed command is not rewritten and is not sent; the feature prints its skip line and behaves as today. Malformed Deem JSON: Python exit 1 (`JEVSRC:300-301`, `:438-440`). Slow answer: `call` timeout is 60 s (`:288`), which is not a hook budget. A hook must not use this `call` unchanged.
- **Rough LOC:** 40-70 in `jev_cli/__init__.py` plus tests.
- **Verdict:** next. The thin-wrapper route fails on the field names. A fork of the CLI is larger than the gap.
- **Confidence:** confirmed from both sources for the field names and the exit mapping. Inferred for the HTTP 400 text reaching stderr as exit 1. The SDK wire format is UNKNOWN.
- **Kill criterion:** a stub-server test where Python `jev-cli` `choice` and `score` with only `--endpoint` and no translator already exit 0 and `--value` prints the option or the level. That result would drop the translator.

### Idea N-grok-02-2

- **Idea:** `N-grok-02-2`. Point `jevctl`'s `TypeSafeClient` at Deem with `TYPESAFE_BASE_URL` and treat that as `cli-deem`. Drop it.
- **Question:** G
- **Builds on:** vendor claim at `deem_server.py:2-6`.
- **Value:** none until the SDK body is shown to be Deem's body.
- **Seam:** `R/src/provider.ts:192-209`. The questions object is validated as `criteria` first (`R/src/core/ask.ts:11-26`).
- **Metric, baseline, harness:** UNKNOWN. The SDK source is not in the repo.
- **Savings:** none.
- **Cost, latency, privacy:** `jevctl` still requires `TYPESAFE_API_KEY` for the typesafe provider (`provider.ts:65-70`). Deem has no auth.
- **Two-backend gate:** with neither backend, behavior is exactly today's. This idea does not get a switch.
- **Rough LOC:** 0 if dropped.
- **Verdict:** drop. `jevctl` is research material, its exit 2 is a different meaning, and its schema requires `criteria` before the SDK sees the question.
- **Confidence:** confirmed that the schema requires `criteria`. Inferred that the SDK might still emit `options`.
- **Kill criterion:** not kept. A later finding that the SDK emits `options`/`levels` and reads `value`/`level` would reopen a `jevctl` transport as a separate idea, still not as a rename of the Python CLI.

## Sources Consulted

- `JEVSRC:20-40`, `:90-108`, `:221-250`, `:253-265`, `:274-300`, `:364-393`, `:429-443`
- `REF:61-71`, `:102-130`, `:146-159`, `:182-184`
- `P/context/deem-main/serve/deem_server.py:2-6`, `:519-550`, `:553-586`, `:594-620`, `:809-811`, `:835-839`, `:867-905`
- `P/context/deem-main/serve/README.md:36-98`, `:173-184`
- `P/context/deem-main/README.md:28-43`
- `R/src/core/ask.ts:1-26`, `:89-116`
- `R/src/provider.ts:57-70`, `:184-220`
- `R/CLAUDE.md:1-2`, `:23`
- `P/context/deem-local.md:25-27`
- No `steer.md`.

## Assessment

newInfoRatio: 0.95

Novelty: the field table and the exit column are not in either baseline. This iteration did not reopen BASE1 or BASE2 to restate them.

Confidence: field names and the Python exit mapping are confirmed from code. The 400-to-exit-1 path is inferred from the status map. The SDK body is UNKNOWN.

Convergence telemetry: last two ratios 0.90, 0.95. Average 0.925, above 0.05. Mode is off. Continue.

## Reflection

What worked: reading `primary_value`'s key map against `_serialize_answer` instead of the word "wire-compatible" in the docstring.

What failed: `@typesafe-ai/sdk` is imported and not vendored, so the SDK body stays UNKNOWN.

Ruled out: a thin `--provider custom --endpoint` wrapper as `cli-deem`. Ruled out: treating `jevctl` exit codes as the Python CLI's. Ruled out: storing a real Jev secret to satisfy `api_key` for a server that ignores Authorization.

## Recommended Next Focus

grok-03: outside patterns for context reduction, and whether Deem's MCP tool schemas are the wrong shape because of what the main AI would load.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Python `jev-cli` sends `criteria`; Deem requires `options` and `levels` | new | `JEVSRC:364-369`, `deem_server.py:535-543` |
| `--value` reads `noul`/`choice`/`score`; Deem returns `value`/`choice`/`level` | new | `JEVSRC:389-393`, `deem_server.py:594-620` |
| `choice` and `score` against Deem exit 1 on HTTP 400; `noul --value` exits 1 on KeyError; `noul` without `--value` exits 0 | new, inferred | `JEVSRC:296`, `:432-440` |
| `run` can carry a Deem-shaped body; typed subcommands cannot | new | `JEVSRC:372-376` |
| `jevctl` schema requires `criteria` and is a different exit taxonomy | new | `R/src/core/ask.ts:11-26`, `R/CLAUDE.md:23` |
| `typesafe-sdk` drop-in is a vendor claim; SDK JSON is not in the repo | new | `deem_server.py:2-6` |
| Python CLI exits 3 without a bearer key; Deem does not check Authorization | confirms ALL-8 with both files opened | `JEVSRC:90-108`, `:280`; `deem_server.py:809-811` |

## Hand-off

- The translator's placeholder-key problem is open for deepseek-06 and swe-01. This iteration does not design the credential.
- `call`'s 60 s timeout (`JEVSRC:288`) must not be reused inside a hook.
- SDK serialization remains UNKNOWN. Do not cite the vendor drop-in as a test result.
