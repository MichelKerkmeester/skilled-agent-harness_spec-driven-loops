---
title: "Iteration 6 — deepseek-06: `cli-deem` through the `custom` provider: the failure side"
trigger_phrases: []
---

# Iteration 6 — deepseek-06: `cli-deem` through the `custom` provider: the failure side

## Focus

Angle **deepseek-06** (W2): *`cli-deem` through the `custom` provider: the failure side.* Maps to question A; answers angle questions 1 to 5. The refinement binds: settle the field gap from code on both sides, marked inferred where a live call would confirm it. Wave 2: siblings read first.

## Actions Taken

1. Read the Python `jev-cli` 0.6.2 source: `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py` — providers and credentials (`:18-39`, `:85-109`), `provider_request`/`normalize_response` (`:221-250`), `provider_endpoint`/`provider_model` (`:253-271`), `call` and its exit mapping (`:274-302`), the parser including hidden `--endpoint` (`:305-345`), `question_request`/`request_for`/`primary_value` (`:364-393`), `auth` handling (`:399-421`), `main`'s catch arms (`:425-443`).
2. Read the transport skill: `.skilled/skills/cli-jev/cli-usage/SKILL.md:1-45` (hard rules, including `jev-custom-endpoint-required`), `:180-235` (notes, ALWAYS/NEVER, escalate).
3. Read the dispatch guard's check: `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:276-284`.
4. Read the recorded probe matrix: `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.txt:60-80`, `:140-160`.
5. Re-opened Deem's request/answer shape from iteration 1's read: `deem_server.py:511-547`, `:594-620`, `:867-904` (the exact keys).
6. Read sibling `grok/iterations/iteration-002.md` (wire compatibility) for the Sibling check.
7. No `jev` command was run, no endpoint was contacted; the probe matrix is a recorded artifact quoted as such.

## Sibling check

- `grok/iterations/iteration-002.md` (its iteration 2, W1): its field-level wire tables. **Agreement with my own code:** the request gap (`criteria` vs `options`/`levels`), the `noul`-only 200 path, the `--value` `KeyError` exits and the `run` passthrough — I reopened every cited line and they hold. **Push-past (new, not contested):** the recorded live probe evidence (its table is inferred; the matrix is recorded), the guard that decides endpoint acceptance, the `auth status` confusion, and the 400/413/500 exit mapping it did not tabulate.
- `swe/iterations/iteration-001.md` (read at iteration 4): its N-swe-01-1 separate-client shape; this iteration's verdict independently reaches the same conclusion from the failure side and records the agreement as grounded (both opened `__init__.py`).
- `mimo/`, `glm/`: no iteration file yet.

## Findings

**F1 (new; answers angle question 1). No guard refuses a loopback or plain-HTTP endpoint; the only mechanical check is that an endpoint exists, and the HTTPS instruction is advisory prose.** The dispatch check `jev-custom-endpoint-required` (`dispatch-rule-checks.mjs:280-283`) returns true when `--provider custom` is absent, and otherwise requires `--endpoint <value>` or `JEV_ENDPOINT=` in the command text — it never parses the URL scheme or host. The CLI itself (`provider_endpoint`, `__init__.py:253-268`) accepts any non-empty override and returns it verbatim; nothing in `call` (`:274-302`) inspects the URL before `urllib` opens it. The skill text says "use a trusted HTTPS origin only" (`SKILL.md:27-30`) and repeats it in the notes (`:185`), but that is prose, not a check. The recorded probe matrix proves the acceptance: `http://127.0.0.1:9/...` with a sentinel key was sent and returned `connection refused` exit 4 (`probe-matrix.txt:148-153`); no layer refused the scheme or the loopback host. So `--endpoint http://127.0.0.1:8300` reaches the socket layer. [SOURCE: `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:276-284`; `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:253-268`, `:274-302`; `.skilled/skills/cli-jev/cli-usage/SKILL.md:27-30`, `:185`; `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.txt:148-153`]

**F2 (new; answers angle question 2). The bearer must exist before any byte is sent, and Deem ignores it.** `call` always sets `Authorization: Bearer {api_key(provider)}` (`__init__.py:274-282`); `api_key("custom")` resolves `JEV_API_KEY` from the environment first, then `providers.custom` in `~/.config/jev-cli/credentials.json`, and raises exit 3 when neither exists (`:90-108`). Deem never reads an Authorization header (`deem_server.py:867-904`; the header is CORS-allowed at `:809-811`, not checked). The recorded matrix shows the gate order: no endpoint → exit 2 before any request (`probe-matrix.txt:65-68`); endpoint present but no key → exit 3 (`:70-74`). A placeholder `JEV_API_KEY` in the spawned environment satisfies the CLI without writing a stored secret; ALL-8's "Jev gets no secret" holds only if the placeholder is never a real credential. [SOURCE: `jev_cli/__init__.py:90-108`, `:274-282`; `deem_server.py:809-811`, `:867-904`; `probe-matrix.txt:60-74`]

**F3 (new; answers angle question 3). The exit-code map against Deem, per failure, with no default-value path.**

| Failure | Where it is produced | Exit | Evidence |
|---|---|---|---|
| No endpoint, `--provider custom` | `provider_endpoint` raises `CliError(..., 2)` | 2 | `__init__.py:256-259`; matrix `:65-68` |
| No `JEV_API_KEY` and none stored | `api_key` raises exit 3 before the socket | 3 | `:90-108`; matrix `:70-74` |
| Nothing listening / connection refused | `URLError` → `CliError(..., 4)` | 4 | `:298-300`; matrix `:148-153` |
| HTTP 400 (Deem validation: `needs an options list`, `needs a levels list`, missing state) | HTTPError branch: not 401/403, not 429/5xx | 1 | `:290-297`; `deem_server.py:535-547`, `:882-884` |
| HTTP 413 body cap | same branch | 1 | `__init__.py:290-297`; `deem_server.py:830` |
| HTTP 500 backend/internal | 500 is in the retryable set | 4 | `__init__.py:295-296`; `deem_server.py:900-904` |
| Stub-backend answer, `noul` without `--value` | request parses; raw JSON printed | 0 | `deem_server.py:972-984`; `__init__.py:432-434` |
| Stub or real answer, `noul`/`score` with `--value` | `primary_value` reads `answer["noul"]`/`answer["score"]`; Deem returns `value`/`level`; KeyError | 1 | `__init__.py:389-393`, `:438-440`; `deem_server.py:604-620` |
| `choice` with `--value` (request translated) | both sides use the key `choice` | 0 | `__init__.py:393`; `deem_server.py:595-601` |
| `run` with `--value` | `kind` is None → `CliError` **after** a successful billed call | 2 | `__init__.py:389-391`, `:430-431` |
| A missing `answers` key without `--value` | raw JSON printed; the caller parses nothing | 0, silently wrong-shaped | `__init__.py:432-434` |
| KeyboardInterrupt | top-level catch | 130 | `:441-443` |

No path returns a default score or verdict: every failure is an exception with an exit code, and the one silent path (raw JSON with no `--value`) carries no judgment the caller can misread as one. The malformed-answer case is exit 1, not a default. [SOURCE: `jev_cli/__init__.py:90-108`, `:253-302`, `:389-393`, `:425-443`; `deem_server.py:535-547`, `:595-620`, `:830`, `:882-884`, `:900-904`, `:972-984`]

**F4 (new; answers angle question 4). `jev auth status --provider custom` exits 0 with a key and says nothing about the server — it must never be the Deem check.** The `auth status` branch calls `api_key(provider)` and prints `{"ok": true, "stored": true, "store": <path>}` (`__init__.py:419-421`); an environment `JEV_API_KEY` satisfies it while the store file may not exist, and nothing in it opens a socket. So a feature that used `auth status --provider custom` as its "Deem available" test would report available with the server stopped, with the stub serving, or with a foreign process on 8300. The gate's Deem half is the iteration-1 `/health` probe (corrected to the allowlist + pin at iteration 4 F10); `auth status` is Jev's check 3 only, and its `custom` provider is not a Deem provider. [SOURCE: `jev_cli/__init__.py:419-421`; iteration 1 F1-F6; iteration 4 F10]

**F5 (new; the field gap, settled from code on both sides and marked inferred).** The request gap is now confirmed at both producers: `request_for` puts choice data under `criteria` as a `KEY=DESCRIPTION` dict and score data under `criteria` as a level list (`__init__.py:377-385`), while Deem's `parse_question` reads `options` (a list) for choice and `levels` (a list) for score and never reads `criteria` (`deem_server.py:535-547`); a missing list is a 400 (F3). The shape gap is wider than a field rename: jev choice answers return a key while Deem returns the option string. The response gap: Deem returns `value` (noul) and `level` (score) while `primary_value` reads `noul`/`score` (`:389-393`; `deem_server.py:594-620`). Marked **inferred** because no request was sent; a live call would confirm the 400 body text and the `value`/`level` fields. [SOURCE: `jev_cli/__init__.py:364-393`; `deem_server.py:511-547`, `:594-620`]

**F6 (new; answers angle question 5). Verdict: not a thin wrapper. The honest shapes are a separate client or a translator, and the failure side prefers the client.** The `custom` provider is not a Deem transport: it transforms nothing in either direction (`provider_request` acts only on `vercel`, `__init__.py:223-235`), it insists on a bearer Deem ignores (F2), and the typed subcommands cannot express Deem's request shape (F5). Only `run` passes with a caller-shaped payload, which is a raw client, not a wrapper, and refuses `--value` after the call (F3). A translator inside the vendored CLI would need the request rewrite, the response rewrite and a placeholder secret in the credential store — a vendored-dependency edit for a server that needs no auth. The separate client (swe-01's N-swe-01-1: a small Node stdlib `fetch` to `/v1/systemone`, translating the answer fields and mapping Deem failures onto a deliberate exit taxonomy) is the shape that carries no fake secret, needs no dependency, and fits the Node-in-hook path of iteration 4 F5. [SOURCE: `jev_cli/__init__.py:221-250`, `:364-393`, `:430-431`; F1-F5; `swe/iterations/iteration-001.md` (N-swe-01-1)]

**F7 (new; a scope note). The dispatch guard should stay as it is; a Deem client never uses `--provider custom`.** Widening `jev-custom-endpoint-required` to refuse loopback would break the legitimate local-proxy testing the probe matrix already exercises, and it would not protect a Deem client that posts directly. If a future operator path does point `custom` at the local server, the guard's presence check plus the skill's advisory line are what exist; the client design removes the path instead. [SOURCE: `dispatch-rule-checks.mjs:280-283`; `probe-matrix.txt:148-153`; F6]

## Per-Idea Records

### N-deepseek-06-1: `cli-deem` as a separate client, with the failure map as its contract

- **Idea:** A Node stdlib client to `/v1/systemone` (health + `noul`/`choice`/`score`/`run`), translating `value`→`noul`, `level`→`score` and passing `choice` unchanged; its failure contract is F3's map minus the auth/`--value` rows, plus the iteration-1 skip lines. Never uses `--provider custom`, never stores a key, never shells out in a hook.
- **Question:** A, G.
- **Builds on:** F1-F6; swe-01 N-swe-01-1; iteration 4 F5.
- **Value:** One local transport for every Deem arm; no fake secret; no vendored edit; failures are explicit.
- **Seam:** New file under the future `cli-classifier/cli-deem/`; server contract `deem_server.py:843-904`.
- **Metric, baseline, harness:** p50/p95 of connect+call from Node; baseline LOCAL 60.2-60.5 / 62.8-78.5 ms (`LOCAL:34-38`), connect UNKNOWN; harness: the stub-server fixtures (iteration 1 F11) plus one 400, one 500, one refused and one wrong-model case.
- **Savings:** Enables the Deem arms; no token saving itself.
- **Cost, latency, privacy:** Loopback only; nothing leaves the machine; the server is unauthenticated (iteration 1 F4).
- **Two-backend gate:** The client is Deem-only and calls the iteration-1/4 probe before work; with neither backend the caller behaves as today. It never calls `auth status`.
- **Rough LOC:** 120-180 (swe-01's estimate) plus fixtures.
- **Verdict:** **build-now as the `cli-deem` shape** (phase-authored later).
- **Confidence:** Confirmed from both code sides; the 400 body text and the answer fields are inferred pending one recorded live probe.

### N-deepseek-06-2: The gate keeps two probes, never one — `custom` is not a Deem check

- **Idea:** Freeze in the gate text: Deem availability = the `/health` probe; Jev availability = the three checks with the feature's provider; `auth status --provider custom` is not evidence of anything local, and no feature may reuse it as such.
- **Question:** A, H.
- **Builds on:** F4; iteration 4 F10; BASE2 section 11.
- **Value:** Removes the one confusion that would report a dead server as available.
- **Seam:** Gate text in 002/003/005/006; `jev_cli/__init__.py:419-421`.
- **Metric, baseline, harness:** Metric: zero features call `auth status` to detect Deem; test: with `JEV_API_KEY` set and no server, every gate prints the Deem skip line, not a pass.
- **Savings:** Prevents wrong-backend runs.
- **Cost, latency, privacy:** None.
- **Two-backend gate:** This is the clarification of it.
- **Rough LOC:** 0 (text).
- **Verdict:** **build-now as gate text.**
- **Confidence:** Confirmed from code.

### Dropped: a thin `--provider custom` wrapper

- **Idea:** `cli-deem` as a mode that shells the Python `jev-cli` with `--provider custom --endpoint`.
- **Reason:** F1-F6: no traversal rewrite, mandatory bearer for a server that ignores it, and `choice`/`score` cannot pass at all. Dropped.
- **Confidence:** Confirmed from code and the recorded matrix.

### Dropped: a translator inside the vendored `jev-cli`

- **Idea:** Add a `deem` provider branch beside the `vercel` translation in `provider_request`/`normalize_response`.
- **Reason:** It edits a vendored dependency's contract, still needs the placeholder-secret dance (F2), and buys nothing over a separate client that the hub owns. Dropped; the `vercel` branch size (grok-02's 40-70 LOC estimate) is recorded, not adopted.
- **Confidence:** Confirmed from `__init__.py:221-250`.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| No guard refuses loopback/plain-HTTP; only endpoint presence is checked | **new** (recorded evidence) | `dispatch-rule-checks.mjs:280-283`; `probe-matrix.txt:148-153`; `SKILL.md:27-30` |
| Bearer must exist pre-socket; Deem ignores it | confirms grok-02 with the recorded probe order | `__init__.py:90-108`, `:274-282`; matrix `:65-74` |
| The full exit map against Deem, 400→1 / 413→1 / 500→4 / refused→4 / `--value` KeyError→1; no default path | new (grok-02 covered wire, not the full map) | F3 table |
| `auth status --provider custom` exits 0 with a key and no server | **new** | `__init__.py:419-421` |
| Field gap confirmed both sides; marked inferred | confirms grok-02 with reopened lines | `__init__.py:364-393`; `deem_server.py:511-547`, `:594-620` |
| Verdict: separate client, not a wrapper | new from the failure side; agrees with swe-01 | F6 |
| Dispatch guard stays as it is | new | F7 |
| Jev gate | restated (BASE2 §11) | BASE2 section 11 |

## Hand-off

- deepseek-07: the hub move's blast radius must count the `cli-deem` client's new home; the guard file is one of the surfaces if it ever changes.
- deepseek-08: a live Deem seam uses this client's connect path; the precompute design inherits its exit map.
- deepseek-09: F3 is the Deem half of the failure table.
- deepseek-10: N-deepseek-06-2's two-probe rule goes into every phase amendment; the `run`-only fallback is recorded as not the design.
