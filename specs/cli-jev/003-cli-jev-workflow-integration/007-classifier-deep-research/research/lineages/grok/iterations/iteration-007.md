# Iteration 7: grok-07: One interface, two shapes

## Focus

Questions G and A. How a hosted client and a local server select an endpoint, which packaging fits shapes that differ, and what a caller should name. `steer.md` was read. The open thread it names for this angle is whether a client can see the loaded calibration.

## Sibling check

- `research/lineages/deepseek/iterations/iteration-002.md` (iteration 2, newest). N-deepseek-02-2 is the health rule this switch uses: backend `torch` or `ensemble:` without `stub`, and `model` `deem-0.8-v1`. Quoted as deepseek's. ALL-4 is the stub half of that rule.
- `research/lineages/swe/iterations/iteration-001.md` (iteration 1, newest). Read. It drops a patch of `jev-cli` and a proxy, and proposes a stdlib client. Contested below on verdict, agreed on packaging. Their LOC and exit map are theirs; the field names I cite were opened in iteration 2 and reopened here only where noted.
- `research/lineages/mimo/iterations/`: no iteration file.
- `research/lineages/glm/iterations/`: no iteration file. glm-02 was not on disk.

Prefix `P` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`. Prefix `JEVSRC` = `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`.

## Findings

### How the vendored clients switch

| Client | Mechanism | Same request shape? |
|---|---|---|
| Python `jev-cli` provider table | `PROVIDERS` maps `official`, `vercel`, `openrouter`, and `custom` to an endpoint, a key variable, and a model (`JEVSRC:18-39`). `custom` has `endpoint: None` until the caller passes one | No for Deem. The body is still `criteria` (iteration 2) |
| Python `jev-cli` Vercel branch | `provider_request` renames `noul` to `boolean` only when `provider == "vercel"` (`JEVSRC:221-235`) | A translation layer, for one hosted gateway, not for Deem |
| npm `jevctl` | `TYPESAFE_BASE_URL` points `TypeSafeClient` at a base URL (`specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/provider.ts:193-196`) | A base URL. The SDK body is UNKNOWN (iteration 2) |
| Deem's own claim | `TYPESAFE_BASE_URL=http://127.0.0.1:8300` (`P/context/deem-main/serve/README.md:173-184`) | Vendor claim that the SDK body matches. Not shown in this repo |
| Deem MCP | stdio tools `classify`, `score`, `check` (`P/context/deem-main/serve/deem_mcp.py:9-11`, `:94-119`). The example pins a v4 checkpoint (`serve/README.md:186-201`) | A third shape. Tool names, not `noul`/`choice`/`score` |

`do_POST` reads `state`, `questions`, and `dataset` (`deem_server.py:880-888`). It does not read `model`. That is a code reading, not a live request.

A base URL fits two transports that already share a body. A provider table fits several hosted endpoints that share a body and differ by URL and key. A translation layer fits two bodies. Deem and the Python `jev-cli` are the third case. `cli-external-orchestration` names seven executor modes and holds no per-mode logic (`SKILL.md:3`, `:15`). It fails closed when no executor scores (`hub-router.json:30`). A classifier caller should name a transport the same way: `cli-jev` or `cli-deem`, not a capability with a hidden URL. The judgment type (`noul`, `choice`, `score`) is the capability. The transport is who speaks it.

### What the model sees

`ChoiceQuestion.criteria` "never appears in the rendered prompt" (`P/context/deem-main/src/deem/primitives.py:98-99`). `render_prompt` writes `question.instructions` and then each option label as `(A) {label}` (`format.py:298-303`). A translator that puts `jev-cli`'s `KEY=DESCRIPTION` keys into `options` shows the keys. One that puts the descriptions into `options` shows the descriptions, and the returned `choice` is that string, which the caller must map back. An exit 0 does not mean the descriptions survived. Inferred from those two functions. No prompt was rendered here.

`/health` returns status, model, and backend (`deem_server.py:845-846`, health at `:772-777` as deepseek-01 quoted). `/v1/models` returns that same model id and nothing else (`:847-860`). The startup line prints model, backend, and the listen URL (`:1001-1004`). None of the three names a calibration file. A client cannot tell which calibration is loaded. `deem-ctl update` compares remote SHAs and switches (`~/.local/share/deem/bin/deem-ctl:134-164`). `--check` returns before the switch (`:147`). There is no pin and no hold. A 6-hourly update can change the commit under a threshold. A keep rule that needs a calibration file has to store the commit pair from `deem-ctl status` (deepseek-02's N-deepseek-02-3, quoted) and refuse to threshold when that pair has no calibration file. Iteration 1 found no file that names the served commit.

The server applies no input-length cap in `_forward` beyond padding to the longest row (`deem_server.py:203-211`). LOCAL's p95 is for short synthetic inputs (`P/context/deem-local.md:32-38`). A transcript-sized state is latency UNKNOWN. Carried to grok-09. Not re-derived further here.

### Three routes

| Route | What it is | LOC | Risk | Kill, as a result |
|---|---|---|---|---|
| (a) Patch `jev-cli` | Edit `question_request` and `primary_value`. N-grok-02-1 called this "not a fork". The file is the pip package (`JEVSRC`). A local edit is a fork unless it is upstreamed | 40-70 in that file (iteration 2's estimate) plus the key requirement at `JEVSRC:90-108` | The installed wheel and the vendored tree diverge. `call` still times out at 60 s (`JEVSRC:288`) | A build of the installed `jev` whose `choice --value` against a stub prints the option, and `pip show` says the file was not edited. That result means the patch is not how this repo ships it |
| (b) `jev run --endpoint` with a Deem-shaped body | Passthrough (`JEVSRC:372-376`). Needs a key. `--value` raises because `kind` is None (`JEVSRC:390-391`) | About 0 in the CLI, plus a placeholder key | The key is a secret-shaped value for a server that does not check Authorization (ALL-8). `--value` is unusable | A caller whose only need is the raw JSON, measured by a stub returning that JSON and the caller parsing `answers` without `--value`. If the caller needs a single printed value, this route fails that run |
| (c) A small client that posts Deem's body and sends no bearer token | swe-01's N-swe-01-1. Translates `value` to `noul` and `level` to `score` on the way out | swe-01's estimate, ~170 plus tests. Theirs, not recounted | A second binary. Spawn cost UNKNOWN (`deem-local.md:50`) | A stub run where `choice` prints the option the prompt rendered, and a second case where a `KEY=DESCRIPTION` input prints the key while the rendered line shows only the key. The second case means fidelity failed |

Agree with swe-01 that (c) is the route that does not fork `jev-cli` and does not send a bearer token. Disagree with "build-now". Savings are unmeasured: a grep of `.skilled` for `deem_mcp`, `TYPESAFE_BASE_URL`, and `DEEM_ENDPOINT` hit this research packet and no hook. Caller count outside the packet: 0 in that grep. Accuracy on this repo's labels is unmeasured (`deem-local.md:52`). A new transport with no caller and no accuracy set does not enter the hub yet.

Privacy prefers Deem for transcript, goal, and prompt text, once (c) exists and the health check passes. Measured accuracy does not yet prefer either backend. "Needs no field rewrite" is not a preference. Jev stays the transport when the feature's labels were collected against Jev and have not been rerun on the served commit.

Before the hub holds a third transport (MCP or `jevctl`), it needs a counted caller that (c) cannot serve. That count is 0 in the grep above. MCP as a context-reduction seam stays ruled out (iteration 3). Not a new idea.

### Idea N-grok-07-1

- **Idea:** `N-grok-07-1`. The Deem transport is its own client, route (c), named `cli-deem` beside `cli-jev`. It posts `options` and `levels`, sends no bearer token, translates answer keys on the way out, and refuses `backend` `stub`. It stores the `deem-ctl status` commit pair on every measurement and does not threshold. Type: `noul`, `choice`, `score`.
- **Question:** G, A
- **Builds on:** iteration 2's field table. swe-01's N-swe-01-1 for the client shape. deepseek-02's health rule and commit pair, quoted. Contests N-grok-02-1's home (inside `jev-cli`) and swe-01's build-now.
- **Value:** typed subcommands reach Deem without a fork and without a placeholder key.
- **Seam:** new file, not `JEVSRC`. swe-07 picks the directory. Not created here.
- **Metric, baseline, harness:** stub `choice` prints the rendered option. Baseline: Python `jev-cli` `choice` against Deem is exit 1 on HTTP 400, inferred from `JEVSRC:296` and `deem_server.py:535-537` (iteration 2, not a live call). Harness: a stub HTTP server, not run. Savings unmeasured (0 runtime callers in the grep). Spawn unmeasured.
- **Savings:** unmeasured.
- **Cost, latency, privacy:** one POST. State stays on the machine. Warm p95 does not apply to a long state (`deem-local.md:32-38`). No auth on the server. CORS `*` remains the operator's exposure (deepseek-01, quoted).
- **Two-backend gate:** its own switch, default off. Deem passes only when status is ok, backend is `torch` or `ensemble:` without `stub`, and model is `deem-0.8-v1` (N-deepseek-02-2, which includes ALL-4). Jev passes when `jev auth status --provider <p>` exits 0. Prefer Deem for repository text only after this client exists. Prefer Jev when the labels were not rerun on the served commit. Neither: the feature does not call and behaves as today. Malformed JSON: exit 1, no score. Slow: the client's own cap, not 60 s.
- **Rough LOC:** swe-01's ~170. Not resized.
- **Verdict:** later.
- **Confidence:** confirmed that the three endpoints omit calibration, that `criteria` is not rendered, and that `deem-ctl` has no pin. Inferred that route (c) is smaller than a fork. A stub run would confirm the kill line.
- **Kill criterion:** the stub's second case, where the printed choice is a key and the rendered option line dropped the description. Or a caller count that stays 0 after the phases that would call it. Either result drops the client as a hub mode and leaves Deem as a manual `curl` against the README examples.

## Sources Consulted

- `steer.md` (this lineage), the grok-07 thread and the three-route note
- `JEVSRC:18-39`, `:221-235`, `:288`, `:372-376`, `:390-391`
- `P/context/deem-main/serve/README.md:173-208`
- `P/context/deem-main/serve/deem_mcp.py:9-11`, `:94-119`
- `P/context/deem-main/serve/deem_server.py:203-211`, `:772-777`, `:845-860`, `:880-888`, `:1001-1004`
- `P/context/deem-main/src/deem/primitives.py:94-104`
- `P/context/deem-main/src/deem/format.py:270-305`
- `~/.local/share/deem/bin/deem-ctl:1-16`, `:134-183` (read, not executed)
- `.skilled/skills/cli-external-orchestration/SKILL.md:1-16`
- `.skilled/skills/cli-external-orchestration/hub-router.json:16-30`
- `.skilled/skills/cli-external-orchestration/mode-registry.json:1-9`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/provider.ts:193-196`
- `research/lineages/swe/iterations/iteration-001.md` N-swe-01-1, N-swe-01-2, N-swe-01-3
- `research/lineages/deepseek/iterations/iteration-002.md` N-deepseek-02-2, N-deepseek-02-3
- `P/context/deem-local.md:32-38`, `:50-52`
- Grep of `.skilled` for `deem_mcp`, `TYPESAFE_BASE_URL`, `DEEM_ENDPOINT`

## Assessment

newInfoRatio: 0.80

Novelty: calibration is invisible on `/health`, `/v1/models`, and the startup line. `deem-ctl` has no pin. `criteria` is not rendered, so a translator can exit 0 and still drop descriptions. The three-route table contests both N-grok-02-1's home and swe-01's build-now.

Confidence: those code facts are confirmed. The 0-caller grep is a search result, not a proof that no caller exists outside `.skilled`.

Convergence telemetry: last three ratios 0.85, 0.75, 0.80. Mean 0.80, above 0.05. Mode is off. Continue.

## Reflection

What worked: reading `render_prompt` instead of treating a successful HTTP status as fidelity. Reading `deem-ctl update` for a pin and not finding one.

What failed: the SDK body is still UNKNOWN, so the vendor base-URL claim stays a claim.

Ruled out: MCP or `jevctl` as a third hub transport while the caller count is 0. Ruled out: patching `jev-cli` as "not a fork". Ruled out: preferring a backend because it needs no rewrite.

## Recommended Next Focus

grok-08. Tare's flip gate against R1's aggregate flip rate. A calibration check cannot see which file is loaded (this iteration), so any local calibration workflow has to pin the commit pair from outside the server.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| `/health`, `/v1/models`, and the startup line omit calibration | new | `deem_server.py:845-860`, `:1001-1004` |
| `deem-ctl update` has no pin or hold | new | `deem-ctl:134-164` |
| `criteria` is not rendered; options are the labels the model sees | new | `primitives.py:98-99`, `format.py:298-303` |
| A base URL is the wrong pattern when bodies differ | confirms iteration 2, mapped onto the hub | `JEVSRC:18-39`, `hub-router.json:30` |
| Route (c) agrees with swe-01; build-now does not | contest | swe-01 N-swe-01-1; `deem-local.md:52` |
| 0 runtime callers of Deem in the `.skilled` grep | new count, search-bounded | grep in Sources |

## Hand-off

- grok-09 records the compact fail-open, the missing length cap, and this calibration gap in the claim table. Do not re-derive them.
- A threshold does not survive `deem-ctl update` unless the measurement stores the commit pair and refuses a pair with no calibration file.
- swe-07 can take route (c). This lineage does not mark it build-now.
