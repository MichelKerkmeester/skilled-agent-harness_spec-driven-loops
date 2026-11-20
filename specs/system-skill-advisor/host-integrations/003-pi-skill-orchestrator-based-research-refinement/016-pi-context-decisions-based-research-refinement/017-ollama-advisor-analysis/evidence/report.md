## 1. Bugs

Paths: `ADV` = `.skilled/skills/system-skill-advisor/runtime`, `SHARED` = `.skilled/skills/system-spec-kit/shared/embeddings`, `LAUNCHER` = `.skilled/bin/system-skill-advisor-launcher.cjs`.

**B1. Nothing refreshes embeddings except a manual scan, so vector coverage rots. CONFIRMED.**
- Where: `refreshSkillEmbeddings` has one caller, `ADV/handlers/skill-graph/scan.ts:54`. The daemon's startup scan (`ADV/advisor-server.ts:146-182`) only calls `indexSkillMetadata`, and `ADV/lib/daemon/*.ts` contains no embedding call at all.
- The comment at `ADV/advisor-server.ts:376-378` and INSTALL-GUIDE §12.4 step 4 ("the first scan or watcher tick populates `vec_<dim>`") are both false.
- Scenario: add or edit a skill; the watcher reindexes metadata but its vector stays missing or stale until someone runs `skill_graph_scan --trusted` with Ollama up.
- Live state of the main checkout's DB (read-only query):

| Measure | Value |
| --- | --- |
| Skills with a vector | 8 of 15 |
| Newest skill vector | 2026-10-16 |
| Command vectors (`vec_cmd_768`) | 0 |
| Skills with no vector | `cli-external-orchestration`, `local-webflow`, `mcp-tooling`, `sk-design`, `sk-prompt`, `system-deep-loop`, `system-skilled-doctor` |

- Impact: the lane only gates on zero vectors (`ADV/lib/scorer/lanes/semantic-shadow.ts:360-362`). With partial coverage, covered skills can earn up to `0.05 × cosine` that uncovered skills and all commands cannot. That is a ranking bias, not a neutral degrade. `advisor_status` still reports `laneEnabled: true` when `embedded > 0` (`ADV/handlers/advisor-status.ts:222`).

**B2. An Ollama outage does not mark the lane degraded, so confidence shifts with Ollama's state. CONFIRMED.**
- Where: `runtimeLaneHealthForStatus` only ever flags `graph_causal` (`ADV/handlers/advisor-recommend.ts:91-101`). Fusion marks `semantic_shadow` degraded only for stale projection vectors (`ADV/lib/scorer/fusion.ts:299-313`).
- Scenario: Ollama is down or times out. The lane returns `[]`, but its 0.05 stays in `liveTotal` (`fusion.ts:1311-1313`). Every skill's `liveNormalized` loses the semantic term while the denominator is unchanged.
- Impact: a prompt near the confidence threshold can pass with Ollama up and abstain with it down. The mechanism that drops a degraded lane from normalization exists but is not wired to the commonest outage.

**B3. `OLLAMA_BASE_URL` and `OLLAMA_REQUEST_TIMEOUT_MS` never reach the daemon. CONFIRMED.**
- Where: `CHILD_ENV_ALLOWLIST` (`LAUNCHER:131-193`) omits both, and `createChildEnv` (`LAUNCHER:316-320`) filters strictly. The adapter reads them from `process.env` (`SHARED/adapters/ollama.ts:118,124`).
- Scenario: an operator runs Ollama on another port. The doctor route and `measure-embedder-cost.mjs` honor the variable and probe the right server; the daemon embeds against `127.0.0.1:11434`.
- Impact: the scan fails and the lane stays off, with a misleading "unreachable" diagnosis.

**B4. A degraded result is cached for 5 minutes. CONFIRMED.**
- Where: `advisorPromptCache.set` at `ADV/handlers/advisor-recommend.ts:637` runs regardless of `semanticLaneOffReason`; TTL is 5 min (`ADV/lib/prompt-cache.ts:16`).
- Scenario: the first prompt after a model unload misses the 750 ms deadline. The lane-off answer is then served for that prompt until the TTL expires, even though the model is warm 200 ms later.
- Impact: small, because the lane is small.

**B5. The 750 ms race abandons the request without aborting it, and there is no circuit breaker. CONFIRMED.**
- Where: `Promise.race` at `ADV/lib/scorer/lanes/semantic-shadow.ts:186-201`. The fetch keeps its own 5 s deadline (`SHARED/adapters/ollama.ts:110`), and `embed()` accepts no signal.
- Scenario: Ollama is wedged or slow. Every prompt waits the full 750 ms, and each leaves a request in flight for up to 5 s.
- Impact: a fixed 750 ms penalty per uncached prompt for the whole outage. Connection refused fails fast, so this only bites slow or wedged servers.

**B6. A scan during an outage deletes vectors. CONFIRMED.**
- Where: `ADV/lib/skill-graph/skill-graph-db.ts:1429` and `:1445` call `deleteEmbedding.run(row.id)` on outage or failure.
- Scenario: a scan runs while Ollama is down. Every skill whose description changed loses its old vector, feeding the partial-coverage bias in B1.
- Impact: also slow, because each attempt is one row with a 30 s document timeout, so a wedged server costs about 90 s before the three-failure streak trips.

**B7. The cascade can persist a pointer the advisor cannot use. INFERRED.**
- Where: `SHARED/auto-select.ts:491-496` falls through to hf-local, OpenAI, Voyage. `getAdapter` knows one manifest (`SHARED/registry.ts:29-40`).
- Scenario: Ollama is absent on first start and another tier answers. The persisted name (for example `nomic-ai/nomic-embed-text-v1.5`) fails `getManifest`, so the lane reports `adapter_unavailable` permanently and `pointerNeedsResolution` (`ADV/lib/embedders/schema.ts:261-266`) reruns the cascade on every daemon start.
- Confirm by: starting a daemon with an `auto` pointer and Ollama stopped, then reading `vec_metadata`. The cloud tiers are unreachable from the daemon anyway, since the API keys are also outside the allowlist.

**B8. Minor.**
- `loadSkillEmbeddings` does not filter by `model_id` (`skill-graph-db.ts:1715-1726`), and `cosineSimilarity` truncates to the shorter vector (`semantic-shadow.ts:73`). Both are harmless with one manifest. CONFIRMED.
- The lane-off reason is read after an extra `await` (`advisor-recommend.ts:585`), so two concurrent prompts can swap warnings. INFERRED; confirm with two interleaved calls where one fails.
- INSTALL-GUIDE lines 300-306 list seven manifests; the registry has one. CONFIRMED.

## 2. Effectiveness

- **Live, not shadow.** `ADV/lib/scorer/lane-registry.ts:13` gives weight 0.05 with `live: true`. It is the smallest of five lanes (0.42 / 0.28 / 0.13 / 0.12 / 0.05), and the name "shadow" is a leftover.
- **The one recorded measurement says it does not help.** `specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46,79` records a 193-prompt paired ablation with real nomic embeddings:

| Arm | Top-1 correct |
| --- | --- |
| With the lane | 149 / 193 |
| Lane disabled | 150 / 193 |

  Six prompts flipped: 2 helped (`memory:save`), 3 hurt (correct abstains turned into `mcp-chrome-devtools`), 1 neutral. The stated reason for keeping it was the cost of re-baselining, not benefit.
- **That ablation overstates the live lane.** It seeded a vector for every described skill; the live DB has 8 of 15 and no command vectors, and the two helped prompts were for a command.
- **CI never measures the real lane.** The ablation is opt-in behind `SPECKIT_ADVISOR_SEMANTIC_ABLATION` (`ADV/tests/scorer/semantic-shadow-ablation.vitest.ts:40`). Under Vitest the lane substitutes token overlap times 0.8 (`semantic-shadow.ts:309-326`) or a 32-bucket hash vector (`:96-107`), so every default test, including `semantic-lane-promotion`, exercises a lexical stand-in.
- **`measure-embedder-cost.mjs` measures cost only**: disk, RSS, warm and cold latency, CLI wall time. It says nothing about routing. When the model starts cold it reads runner memory before the model loads (`:227-231`), so that run's loaded-memory figure is null.
- **Today the lane is off.** No Ollama process is running (`curl` to 11434 refused; no `ollama` in `ps`), so every prompt takes the lexical-only path.
- **Verdict: not worth its cost at 0.05.** It needs a 262 MiB model, 273 MiB resident when loaded and a daemon the operator must keep running, for a measured −1 on 193 prompts. Either set the weight to 0 (keeping it as true shadow telemetry) or remove it. Re-prove it only if a new ablation on the real coverage shows a gain.

## 3. Overengineering

- **Four-tier cascade for one usable backend.** `auto-select.ts` (559 lines), its tmpdir lock, the provider column and `backendToProvider` (`schema.ts:282-292`) all exist to choose among Ollama, hf-local, OpenAI and Voyage. Only Ollama has an adapter. Replace `ensureActiveEmbedder` with "pointer = `MANIFESTS[0]` if `/api/tags` lists it". What breaks: nothing in the advisor; the cascade tests in `tests/embedders/ensure-active-embedder.vitest.ts` go with it.
- **hf model-server supervision, default on.** `LAUNCHER:1111-1120,1694-1698` arms a demand listener in every launcher, with pid file, respawn lock and RSS watchdog (the 1660-line `bin/lib/model-server-supervision.cjs`). The advisor's prompt path cannot use hf-local vectors, because `getAdapter` rejects that pointer. Default it off for the advisor. What breaks: the `embeddings-health` status probe reports unreachable, which is the truth.
- **Legacy embedding path.** `refreshSkillEmbeddingsLegacy` (`skill-graph-db.ts:1588-1679`) writes `skill_nodes.embedding` when no pointer exists. In that state the prompt side calls `getAdapter('auto')`, gets `undefined` (`semantic-shadow.ts:165-175`) and never scores, so those vectors are written but never read. Delete it and the legacy branch of `loadSkillEmbeddings`. The legacy column currently holds 0 vectors.
- **Five re-export shims** (`adapter.ts`, `registry.ts`, `types.ts`, `adapters/ollama.ts`, part of `index.ts`), two READMEs and a parity test asserting that a re-export equals its source (`shared-factory-parity.vitest.ts`). Import from `@spec-kit/shared` directly.
- **Flag-gated scorer paths the daemon can never enable.** `SPECKIT_ADVISOR_RRF_FUSION`, `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK` and `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING` (`fusion.ts:75-77`) are not in the allowlist. That makes `scoreSemanticShadowExactSubset`, `buildExactSemanticRerankIndex` and the per-class multipliers dead under the daemon. Delete them or add the keys.
- **Five lock and lease mechanisms for one daemon**: owner-lease JSON, launcher pid file, daemon-lease SQLite with a 5 s heartbeat, bootstrap lockdir, auto-select lock. The owner lease and the SQLite lease answer the same question. Folding them is a larger change and I would not start there.
- **Leftovers**: an empty `vec_1024` table, and the `contentType` parameter that `schema.ts:303` itself documents as "currently informational".

## 4. Load

**Per prompt (uncached)**
- One `/api/embed` call with one input, no batching and no embedding cache beyond the 5-minute result cache.
- Warm: 4.8 ms median, 8.9 ms p95 (INSTALL-GUIDE §12.7, measured 2026-11-13).
- Cold: 538 ms. The request body sends no `keep_alive` (`SHARED/adapters/ollama.ts:343`), so Ollama unloads after its 5-minute default. Any prompt more than 5 minutes after the last one pays the cold load, which is most interactive prompts.
- Worst case: 750 ms, the deadline.
- Also per prompt: a new `OllamaAdapter` and a SQLite read plus decode of all skill vectors (`semantic-shadow.ts:346-350`). Both are negligible at 15 skills.

**Idle**
- Ollama: 25 MiB for `ollama serve`, 273 MiB while the model is loaded.
- Advisor, observed now with `ps`:

| Checkout | Launcher RSS | Server RSS |
| --- | --- | --- |
| main | 68.8 MB | 121.1 MB |
| `barter/` copy | 61.4 MB | 109.4 MB |
| worktree | 62.0 MB | 99.2 MB |

  That is about 520 MB for three checkouts, all at 0.0% CPU. Each daemon writes a SQLite heartbeat every 5 s (`ADV/lib/daemon/lease.ts:65`) and rewrites its lease file every 30 s (`LAUNCHER:737-739`).

**Cheap cuts**
1. Set the lane weight to 0. This removes the embed call, the cold-load wait and the Ollama dependency from the prompt path.
2. If the lane stays, skip the embed for about 60 s after any timeout or unreachable error, and pass an `AbortSignal` so the abandoned request dies at 750 ms.
3. If the lane stays, send `keep_alive: "30m"` on query embeds. This trades 273 MiB resident for no cold loads.
4. Batch the scan: one `/api/embed` call with all changed descriptions instead of one per row.
5. Stop arming the hf demand listener by default.

## 5. Zombie daemons

**How they start and stop. CONFIRMED.**
- Start: the CLI spawns the launcher detached and unref'd (`ADV/skill-advisor-cli.ts:1116-1122`), so parent pid 1 is normal. The launcher spawns `advisor-server.js` as an ordinary child (`LAUNCHER:1554`).
- Scope: one pair per checkout, keyed by that checkout's database directory. There is no global registry or cap.
- Idle exit: the server has a 30-minute idle monitor (`ADV/lib/ipc/launcher-idle-timeout.ts:3`, wired at `advisor-server.ts:400-408`). IPC activity or any connected client resets it. On idle the server exits 0, and the launcher's exit handler clears the leases and exits (`LAUNCHER:1560-1570`).
- Signals: SIGINT, SIGTERM, SIGHUP and SIGQUIT are relayed, with SIGKILL after 5 s (`LAUNCHER:1590-1604`).
- Stale state: a dead owner pid or a heartbeat older than twice the 60 s TTL makes the lease reclaimable (`LAUNCHER:615-627`). A stale launcher lease with a live child pid is reaped before respawn, with a pid-reuse guard (`LAUNCHER:565-606,1650-1655`).

**The three pairs you see are not zombies.** Their ages are 2.5, 7.7 and 44 minutes. Each is a working daemon, though the 44-minute pair has outlived the 30-minute idle timeout, so a client contact or an open connection is keeping it alive. One pair per checkout is the design.

**Gaps**
- **No cross-checkout cap.** N worktrees means N pairs at about 170 MB each, for 30 minutes after each one's last prompt. CONFIRMED.
- **The server has no parent-death check.** No `ppid` reference exists in `advisor-server.ts`, `lib/daemon` or `lib/ipc`. If the launcher is SIGKILLed, the server keeps serving. If it then idles out, nobody clears the lease files; they are only reclaimed when another launcher starts in that checkout. CONFIRMED by grep; the orphan-reaping tests cover the next-launcher reap, not self-exit.
- **A wedged server with a healthy launcher is immortal.** A blocked event loop never fires the idle timer, the launcher keeps heartbeating, and a reap only happens when a client probes the dead socket (`LAUNCHER:850-915`). An abandoned worktree never sends one. INFERRED; confirm by SIGSTOPping a server and waiting past the timeout.
- **`SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0` disables the only reaper** (`launcher-idle-timeout.ts:42-44`). CONFIRMED.
- **Socket directories accumulate.** `/tmp/system-skill-advisor` holds 117 per-database directories; the ones I listed are almost all empty, and at most three can be live. Nothing prunes them. CONFIRMED by listing.
- **Ollama is never started, stopped or reaped by the advisor.** Only `/doctor:skill-advisor embedder` starts `ollama serve` in the background (`doctor-skill-advisor-embedder.yaml` phase 4), and no step stops it. It lives until reboot or a manual kill. The model runner unloads itself after 5 minutes. CONFIRMED from the YAML; no Ollama process is running now.

**Reaping fixes**
1. In the server, check every 30 s that the launcher is alive: `process.ppid === 1` or `kill(launcherPid, 0)` failing means run `shutdownAdvisor` and exit.
2. In the launcher, ping the server's socket every 60 s; after three misses, SIGTERM then SIGKILL the child and exit.
3. Drop the default idle timeout from 30 to 10 minutes. Measure the cold-start cost first; I did not time it.
4. Add a `skill-advisor daemons --reap` command. It would walk `/tmp/system-skill-advisor/*`, kill owners whose database directory no longer exists and remove empty directories. Run the directory prune once at each launcher start.
5. Have the doctor route record the `ollama serve` pid it started and print the stop command in its final result.

## Ranked changes

1. **Set the semantic lane weight to 0**, in `ADV/lib/scorer/lane-registry.ts:13`. Use `live: false`, renormalize the other four weights, and re-baseline the parity fixtures. This removes Ollama from the prompt path and resolves B2, B4, B5 and the cold-load cost.
2. **Add a parent-death check to the server and a liveness ping to the launcher**, in `ADV/advisor-server.ts` (near line 400) and `LAUNCHER` (near line 1554). One interval timer each closes both orphan cases.
3. **If the lane stays, refresh embeddings from the daemon and gate on coverage**, in `ADV/advisor-server.ts:146` and `ADV/lib/scorer/lanes/semantic-shadow.ts:360`. Call `refreshSkillEmbeddings` after the startup scan and the watcher reindex, and disable the lane when coverage is below 100%.
4. **Fix the child environment**, in `LAUNCHER:131`. Add `OLLAMA_BASE_URL` and `OLLAMA_REQUEST_TIMEOUT_MS`, and either add the three scorer flags or delete the code behind them.
5. **Default the hf model-server spawner off and delete the cascade and legacy paths**, in `LAUNCHER:1111-1116`, `ADV/lib/embedders/schema.ts:307-369` and `ADV/lib/skill-graph/skill-graph-db.ts:1588-1679`. Resolve the pointer straight to the one Ollama manifest.

## Not checked

- No test, ablation or `measure-embedder-cost.mjs` run was executed: Ollama is down and the session is read-only. All measurements quoted are the repository's recorded ones.
- Daemon cold-start latency, the prompt hook's time budget, and whether 750 ms fits inside it.
- `model-server-supervision.cjs` beyond its idle and demand-listener entry points, so B7's hf-local step is inferred.
- The `barter/` copy's and the worktree's databases and launcher versions; only the main checkout was read.
- Whether `local-webflow` or other skills lack a description, which would legitimately leave them without a vector.
- Internals of the watcher and session-proxy bridge, and whether a long-lived MCP client connection is what keeps the 44-minute worktree daemon alive.
- The `sk-code` review-mode standards and the two report checkers were not loaded or run, because the dispatch asked for an analysis report in its own format and not a gated review verdict.
