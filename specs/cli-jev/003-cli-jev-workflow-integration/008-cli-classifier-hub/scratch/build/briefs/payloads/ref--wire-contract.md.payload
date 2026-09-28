---
title: "Deem Wire Contract"
description: "The request and answer fields cli-deem sends to and reads from the local Deem server, with the caps, the timeouts, the one-request lock and the no-key rule."
trigger_phrases:
  - "deem wire contract"
  - "deem request fields"
  - "deem answer fields"
  - "deem option cap"
  - "deem question cap"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Deem Wire Contract

The request and answer fields `cli-deem` sends to and reads from the local Deem server, with the caps, the timeouts, the one-request lock and the no-key rule.

---

## 1. OVERVIEW

### Purpose

Deem's server speaks the System One protocol but names some fields differently from the `jev` CLI. This reference is the field-by-field record of what `cli-deem` sends, what Deem answers and what the client prints. `scripts/cli-deem.mjs` implements every row. Its tests pin them against a fake server.

### Endpoints

| Endpoint | Method | Used by |
|---|---|---|
| `http://127.0.0.1:8300/health` | GET | `health` |
| `http://127.0.0.1:8300/v1/systemone` | POST | `noul`, `choice`, `score` and `run` |

The base URL defaults to `http://127.0.0.1:8300`. `CLI_DEEM_URL` overrides it, which the test suite uses to reach an in-process fake server on another port. `CLI_DEEM_URL` must be an `http://` URL on `127.0.0.1`, `localhost` or `[::1]`. Anything else exits 2 before any request, a malformed URL included, so the client never talks to another machine.

---

## 2. REQUEST FIELDS

Every judgment posts one JSON object with a `state` string and a `questions` object keyed by question id. A single-question subcommand uses the id `answer`.

| Subcommand | Question sent | Built from |
|---|---|---|
| `noul` | `{"type":"noul","instructions":Q}` | `-q` |
| `choice` | `{"type":"choice","instructions":Q,"options":[D1,D2]}` | `-q` plus each `-o KEY=DESCRIPTION`, split at the first `=`, descriptions in flag order |
| `score` | `{"type":"score","instructions":Q,"levels":[L1,L2]}` | `-q` plus each `-l DESCRIPTION`, lowest level first |
| `run` | the request file's own `questions` object, unchanged | a file or stdin written in Deem's shape |

The `jev` CLI sends `choice` options and `score` levels as `criteria`, which Deem answers with HTTP 400. That mismatch is the reason this client exists.

---

## 3. ANSWER FIELDS

Deem wraps every answer in an envelope of `id`, `object`, `created`, `model`, `answers` and `usage`. The client keeps the envelope and rewrites each answer in `answers`.

| Type | Deem answers | The client prints |
|---|---|---|
| `noul` | `value` (a probability), `confidence`, `temperature` | `noul` in place of `value`. The other fields pass through |
| `choice` | `choice` as the option text, `probabilities` keyed by option text, `confidence`, `temperature` | `choice` as the submitted key. `probabilities` is keyed by key |
| `score` | `level` as the level text, `probabilities` keyed by level text, `expected`, `confidence`, `temperature` | `score` as the zero-based position of `level`. `probabilities` is keyed by position (`"0"`, `"1"`). `level` is dropped. `expected` passes through |

- **`run` keeps option text.** A request written in Deem's shape lists options without keys, so a `choice` answer in a batch keeps Deem's option text. `noul` and `score` answers are rewritten as above.
- **`--value`** prints the primary value alone: the `noul` number, the `choice` key or the `score` position. `run` refuses it, because a batch has no single primary value.
- **Model check.** An answer envelope whose `model` is not `deem-0.8-v1` exits 3, the same refusal `health` applies.

### Health Body

`GET /health` answers `{"status":"ok","model":M,"backend":B}`. The client passes it only when `status` is `ok`, `backend` is `torch` or starts with `ensemble:` without `stub` and `model` is `deem-0.8-v1`. The stub backend also answers `ok`, with uniform logits and a `noul` of 0.5 for every question. The backend clause keeps that 0.5 from reading as a judgment.

---

## 4. CAPS AND TIMEOUTS

### Caps

The server enforces the option and question caps with HTTP 400. The client counts first and exits 2 with a named message, so an oversized request costs no round trip.

| Cap | Server limit | Client message |
|---|---|---|
| Options per `choice` | 26 on the torch backend | `choice exceeds the 26-option cap (got N)` |
| Questions per request | 64 | `run exceeds the 64-question cap (got N)` |
| Duplicate descriptions | refused with HTTP 400 | `duplicate option description: D` |
| Duplicate keys | not visible to the server | `duplicate option key: K` |
| Request body | 8 MiB, refused with HTTP 413 | not checked by the client. The client exits 1 on the 413 |

The client also refuses a duplicate description before sending, because the chosen text would map back to two keys. It refuses a duplicate key for the mirror reason: two descriptions would map back to one key, so the printed key could not say which option won.

### Timeouts

| Call | Budget | On expiry |
|---|---|---|
| `health` | 2,000 ms | exit 4 |
| Any subcommand with `--hook` | 500 ms | exit 4, with `timed out after 500 ms` on stderr |
| `noul`, `choice`, `score` and `run` | 60,000 ms | exit 4 |

---

## 5. SERVER BEHAVIOR THE CLIENT RELIES ON

- **One request at a time.** The server holds one lock around inference. Throughput stays near 15 requests per second from one to four clients, so a live call waits behind any batch already running. A caller a user is waiting on passes `--hook` and treats exit 4 as a skip.
- **No key.** The server takes no authentication. The client sends no `Authorization` header and reads no key from the environment. The server answers any local caller with `Access-Control-Allow-Origin: *`, which exposes compute but not data. Closing that exposure is the operator's decision.
- **Cold start.** The server binds its port only after the weights load, about 10 s after a start. Until then a request sees a refused connection and exits 4.
- **Deterministic.** The same request returns the same answer. A test that wants a different answer changes the input, the option order or the model commit.
- **No option-order averaging.** The served instance reads each `choice` in one option order. A caller that wants averaging sends its own permuted requests.

---

## 6. RELATED RESOURCES

- [`model-pin.md`](./model-pin.md): what the model id and the commit pair name.
- [`deem-ctl-lifecycle.md`](./deem-ctl-lifecycle.md): starting, updating and rolling back the server.
- [`../SKILL.md`](../SKILL.md): the exit table and the rules.
