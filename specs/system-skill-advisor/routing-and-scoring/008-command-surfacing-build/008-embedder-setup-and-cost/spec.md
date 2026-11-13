---
title: "Feature Specification: Phase 8: embedder-setup-and-cost"
description: "Meaning matching needs a local Ollama server with nomic-embed-text, yet no install document, doctor route or brief tells a user who installs Skilled into their own repository that it exists, what it costs or that it is off. This phase makes the state visible, adds one doctor route that plans the setup and waits for a yes, writes the cost into the install documents from a committed measurement script and defines the absent, cold and slow cases with tests."
trigger_phrases:
  - "embedder setup and cost"
  - "phase 8 embedder setup and cost"
  - "ollama setup for external repositories"
  - "meaning matching memory cost"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: embedder-setup-and-cost

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-per-runtime-behaviour-proof |
| **Successor** | None |
| **Handoff Criteria** | `/doctor:setup` names the embedder state, `/doctor:skill-advisor embedder` plans the setup and writes nothing without a yes, the install documents state the measured cost and the absent, model-missing, cold and slow tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy and brings a chat-only request onto a proper workflow (`../spec.md`).

**Scope Boundary**: What a person who installs Skilled into their own repository sees and does about the embedder that meaning matching needs. The state, one doctor route, the install documents, a committed measurement script and the behaviour when the embedder is absent, missing its model, cold or slow. Scoring, the meaning bar, the lane weight and the embedder choice stay as they are.

**Dependencies**:
- Phase 004 shipped command vectors in `vec_cmd_<dim>` and the meaning anchor (`ADV/lib/scorer/fusion.ts`, `COMMAND_MEANING_MIN_COSINE` and `COMMAND_MEANING_MARGIN`).
- Phase 005 edits `ADV/handlers/advisor-recommend.ts` and `ADV/scripts/command-bridges/scoring-compatibility.json`. This phase edits both after it.
- The operator's requirement of 2026-11-12, verbatim: "We need to really harden the ux and ease of install and setup for external repo users if we add this running dependancy, also measure memory usage performance impact".

**Deliverables**:
- The embedder state in `advisor_status`, in `/doctor:setup` and as a warning on a recommendation that ran without it.
- `/doctor:skill-advisor embedder`, a route that probes, prints a plan with the cost, waits for a yes and then writes the vectors.
- `ADV/scripts/measure-embedder-cost.mjs`, a read-only script that records memory and latency, and its numbers in `INSTALL-SKILLED.md` and the advisor's `INSTALL-GUIDE.md`.
- A deadline on the prompt embedding and tests for the absent, model-missing, cold and slow cases.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Meaning matching only works with a local Ollama server serving `nomic-embed-text:v1.5` and with vectors written by a skill graph scan. A person who installs Skilled into their own repository is told neither. `INSTALL-SKILLED.md` and every `/doctor` command name no embedder. The advisor database that holds the vectors is gitignored. When the server is absent the advisor falls back to phrase-only matching and says nothing in its output. A hung server also costs more than meaning matching, because the prompt embedding may wait 5,000 ms while the Claude hook gives up at 2,500 ms.

### Purpose
A user who installs Skilled can see whether meaning matching is on, set it up through one doctor route that shows its cost before it acts, read that cost in the install documents and keep a working advisor when the embedder is absent, cold or slow.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
`ADV` is `.skilled/skills/system-skill-advisor/runtime`. Every command ran from the repository root of this worktree on 2026-11-12 between 21:19 and 21:31, with Ollama 0.40.15 already running and `nomic-embed-text:v1.5` loaded. Another session was running `vitest` in the same worktree, so the load average was near 7 to 8. The full output is `scratch/measured-2026-11-12.txt`. The first `ps` row is the shell that ran the command. `scratch/embed-probe.mjs` and `scratch/cli-timing.cjs` are the two throwaway probes, both read-only.

```text
$ curl -s localhost:11434/api/version
{"version":"0.40.15"}
$ curl -s localhost:11434/api/tags | jq -c '[.models[] | {name, size}]'
[{"name":"nomic-embed-text:v1.5","size":274302450},{"name":"jina/jina-embeddings-v3:latest","size":410413681}]
$ curl -s localhost:11434/api/ps | jq -c '[.models[] | {name, size, size_vram}]'
[{"name":"nomic-embed-text:v1.5","size":335733063,"size_vram":335733063}]
$ ps -axo rss,command | rg "ollama serve|llama-server" | rg -v "rg " | cut -c1-60
  1328 /bin/zsh -c source /Users/michelkerkmeester/.claude/s
 46256 ollama serve
352144 /opt/homebrew/Cellar/ollama/0.40.15/libexec/lib/ollam
$ node <this folder>/scratch/embed-probe.mjs "$PWD"
{"case":"warm","n":30,"medianMs":6.57,"p95Ms":10.99,"maxMs":29.14}
{"case":"server_absent","ok":false,"ms":0.21,"error":"OllamaBackendUnreachableError","message":"Ollama backend unreachable at http://127.0.0.1:9: fetch failed"}
{"case":"model_not_pulled","ok":false,"ms":1.25,"error":"OllamaModelNotLoadedError","message":"Ollama model is not loaded: not-a-pulled-model:v0"}
{"case":"model_not_pulled_probe","available":false,"reason":"Ollama model is not loaded: not-a-pulled-model:v0"}
{"case":"deadline_1ms","ok":false,"ms":2.53,"error":"OllamaRequestTimeoutError","message":"Ollama backend unreachable at http://127.0.0.1:11434: request to /api/embed timed out after 1ms"}
$ node <this folder>/scratch/cli-timing.cjs
[{"ms":71.3,"exit":0,"warnings":null},{"ms":65,"exit":0,"warnings":null},{"ms":62.7,"exit":0,"warnings":null},{"ms":64.3,"exit":0,"warnings":null},{"ms":63.9,"exit":0,"warnings":null}]
$ node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --include-semantic-health true --format json --warm-only | jq -c '.data.semanticLaneHealth | del(.checkedAt)'
{"activeEmbedder":{"name":"nomic-embed-text-v1.5","dim":768,"adapterDim":768},"vectorCoverage":{"embedded":14,"total":14,"ratio":1},"dimMismatch":false,"lastRefresh":"2026-11-12 18:52:52","disabledReason":null,"laneEnabled":true}
$ node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --include-embeddings-health true --format json --warm-only | jq -c '.data.embeddingsHealth | del(.checkedAt)'
{"provider":{"state":"resolved","requestedProvider":"hf-local","effectiveProvider":"hf-local","fallbackReason":null,"dimensionChanged":false,"reason":"Local fallback provider"},"modelServer":{"state":"unavailable","target":"/tmp/system-skill-advisor/hf-embed.sock","errorClass":"unreachable","error":"connect ENOENT /tmp/system-skill-advisor/hf-embed.sock"}}
$ sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite 'select count(*) from vec_768; select count(*) from vec_cmd_768;'
14
45
$ git check-ignore -v .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite
.skilled/skills/system-skill-advisor/runtime/database/.gitignore:2:*.sqlite	.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite
$ rg -n "OLLAMA_QUERY_TIMEOUT_MS =|DEFAULT_CLAUDE_HOOK_TIMEOUT_MS =|DEFAULT_CLI_FALLBACK_TIMEOUT_MS =" .skilled/skills --glob '*.ts' --glob '!**/node_modules/**' --glob '!**/dist/**'
.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110:const OLLAMA_QUERY_TIMEOUT_MS = 5_000;
.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:88:const DEFAULT_CLI_FALLBACK_TIMEOUT_MS = 250;
.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:143:export const DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500;
$ rg -n -i "ollama|nomic|embedder" INSTALL-SKILLED.md .skilled/commands/doctor --glob '!**/tests/**' -c; echo "exit=$?"
exit=1
$ date +%H:%M:%S; curl -s localhost:11434/api/ps | jq -r '.models[] | .name + " " + .expires_at'
21:25:08
nomic-embed-text:v1.5 2026-11-12T21:29:57.207757+01:00
$ for f in 004-command-meaning-matching/scratch/hook-latency-*.json; do echo "$f $(jq -c '[.n,.medianMs,.p95Ms]' $f)"; done
004-command-meaning-matching/scratch/hook-latency-after-1.json [44,206.23,269.27]
004-command-meaning-matching/scratch/hook-latency-after-2.json [44,194.83,259.04]
004-command-meaning-matching/scratch/hook-latency-after-3.json [44,205.09,261.92]
004-command-meaning-matching/scratch/hook-latency-before-1.json [44,199.16,231.35]
004-command-meaning-matching/scratch/hook-latency-before-2.json [44,199.26,234.76]
004-command-meaning-matching/scratch/hook-latency-before-3.json [44,199.01,224.33]
$ node ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer'
{"correct":24,"total":44}
{"tune":{"own":2,"attached":7,"combined":9,"total":45},"holdout":{"own":0,"attached":0,"combined":0,"total":44}}
{"count":0,"total":35}
$ node ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs --real-embedding | jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer'
{"correct":24,"total":44}
{"tune":{"own":7,"attached":7,"combined":14,"total":45},"holdout":{"own":2,"attached":0,"combined":2,"total":44}}
{"count":0,"total":35}
$ node ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[159,50,20,5]
$ jq -c '<phase 002 rollup query>' ADV/scripts/command-bridges/command-bridges.generated.json
{"ask":17,"run":7,"start":20}
```

The operator's own first reading on the same Mac, reported in the dispatch brief and not rerun here because it needs the model unloaded: `ollama serve` idle at 46 MB resident, 421 MB in total with the model loaded, cold embedding calls of 271 to 277 ms over 3 calls and one advisor CLI call of 413 ms with the model cold. The phase replaces this reading with the output of the committed script (REQ-001).

What the block shows:
- The model is 274,302,450 bytes on disk (274 MB). Loaded, Ollama reports 335,733,063 bytes on the GPU, `ollama serve` holds 46,256 KB resident and its model runner 352,144 KB, 398,400 KB together. The model was due to unload 4 minutes 49 seconds after the last call, which matches Ollama's default keep-alive of 5 minutes. No code in the repository sets `keep_alive` (`rg -n "keep_alive|keepAlive"` over the advisor runtime and the shared embeddings prints nothing).
- A warm query embedding takes a median of 6.57 ms and a p95 of 10.99 ms over 30 calls. One advisor CLI call takes 62.7 to 71.3 ms warm. The phase 004 hook timing moved from a middle median of 199.16 ms to 205.09 ms and a middle p95 of 231.35 ms to 261.92 ms.
- An absent server fails in 0.21 ms and a model that is not pulled fails in 1.25 ms, each with its own error class. A request past its deadline is reported as unreachable. These are the shared adapter's answers, read directly. The advisor turns all of them into one `prompt_embedding_failed` (below).
- `includeSemanticHealth` counts skill vectors only (14 of 14) and never counts the 45 command vectors. `includeEmbeddingsHealth` reports the hf-local socket as unreachable while the active embedder is Ollama and the lane is on, so the two health views disagree.
- No install document and no doctor file outside the tests names Ollama, `nomic` or an embedder (exit 1, no match).
- With the embedder running, the command capture reads tune combined 14 of 45, holdout 2 of 44 and false offers 0 of 35, and the default capture and the scorer floor match phase 004's recorded numbers.

What a user who installs Skilled gets today, read on 2026-11-12:

| Surface | Mentions the embedder | Checks it | Helps install it |
|---------|-----------------------|-----------|------------------|
| `/doctor:install` (`.skilled/commands/doctor/assets/doctor-install.yaml:60`) | No. Its five printed steps are symlink, agents-md, mcp install, git setup and setup | No | No |
| `/doctor:setup` (`doctor-setup.yaml:57`) | No. The advisor leg runs `advisor_status` without `--include-semantic-health` and reads only `freshness` | No | No |
| `/doctor:skill-advisor rebuild` (`doctor-skill-advisor-rebuild.yaml:98`) | No, but it runs `skill_graph_scan`, which writes vectors as a side effect when the embedder answers | No | No |
| `/doctor:skill-advisor tune`, `skill-budget`, `parent-skill`, `skill-graph-freshness`, `router-reach` | No | No | No |
| `/doctor:symlink` (`link`, `check`, `unlink`) | No | No | No |
| `INSTALL-SKILLED.md` (`:27-29` prerequisites) | No. Node.js 24, `npm`, `git` and a POSIX shell | No | No |
| Root `README.md` (`:681`) | Yes, "When the local embedder runs, a command row can also pass on meaning" | No | No |
| Advisor `README.md` (`:176`) | Yes, "Without the local embedder (Ollama serving `nomic-embed-text`) no cosine exists" | No | No |
| Advisor `INSTALL-GUIDE.md` | Yes, section 12 explains the cascade and the registry. Section 2 lists no embedder and section 3 ends "That is the whole install" (`:72`) | No | No setup steps. `system-spec-kit/README.md:63` is the only file that says `ollama pull nomic-embed-text:v1.5` |

What the advisor does today, read from the code by symbol:
- **Server absent.** `withSemanticShadowPromptEmbedding` (`ADV/lib/scorer/lanes/semantic-shadow.ts:110`) catches the error, sets `disabledReason` to `prompt_embedding_failed` only when no reason is set yet, prints `console.warn` to the daemon's stderr (`:160`) and scores with no prompt vector, so every command passes on its phrases alone. `outputWarnings` (`ADV/handlers/advisor-recommend.ts:509`) adds a warning only for a stale graph or a lane in `degradedLanes`, and `runtimeLaneHealthForStatus` (`:115`) marks only `graph_causal`, so the output carries no warning. The CLI run above shows `"warnings":null`.
- **Model not pulled.** The adapter throws `OllamaModelNotLoadedError` and the advisor takes the same path as an absent server, with the same reason.
- **Model cold.** Nothing preloads the model. The first prompt after 5 idle minutes pays the load inside the 5,000 ms query deadline.
- **Slow call.** The query deadline is `OLLAMA_QUERY_TIMEOUT_MS = 5_000` (`system-spec-kit/shared/embeddings/adapters/ollama.ts:110`), overridden only by `OLLAMA_REQUEST_TIMEOUT_MS` (`:124`). The Claude hook passes a budget of `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` (`hooks/claude/user-prompt-submit.ts:143`) and `.claude/settings.json:150` gives the hook 3 seconds. When the CLI child runs past its budget, `buildSkillAdvisorBriefFromCli` returns its fail-open result with reason `timeout` (`hooks/lib/skill-advisor-cli-fallback.ts:559`). So a server that accepts the connection and never answers costs the whole brief, not only meaning matching. This is read from the code and not reproduced, because reproducing it needs a hung server.
- **Status.** `readSemanticLaneHealth` (`ADV/handlers/advisor-status.ts:157`) reads the active pointer, the `vec_<dim>` count and the last runtime reason. It never calls the server, so a server that went away since the last prompt still reads `laneEnabled: true`.

Whether anything starts the server or pulls the model today: nothing does. `rg -n -i "ollama serve|ollama pull|/api/pull|brew install ollama"` over `.skilled` finds only documentation lines and the process sweeper's rule that preserves a running `ollama serve` (`.skilled/scripts/orphan-mcp-sweeper.sh:476`). The daemon picks the embedder once at start through `ensureActiveEmbedder` (`ADV/advisor-server.ts:380`), and when every probe fails it only logs a warning (`:387`). The startup scan indexes metadata only (`advisor-server.ts:154`), and `refreshSkillEmbeddings` is called from `skill_graph_scan` alone (`ADV/handlers/skill-graph/scan.ts:54`). A fresh clone or a copied project therefore has no vectors until someone runs that scan.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Commit `ADV/scripts/measure-embedder-cost.mjs`, which records the model size, the resident memory of the server and its model runner, the loaded size, the keep-alive expiry, warm and cold embedding latency and advisor CLI latency as one JSON object. Without it no number in an install document can be reproduced.
- Add the embedder's reachability and the command vector count to `advisor_status --include-semantic-health`, and add an `embedder` leg to `/doctor:setup` that reads them. Without them nothing a user runs shows that meaning matching is off.
- Add the route `/doctor:skill-advisor embedder`. It probes, prints a plan with the cost of each step, waits for a yes, runs only the approved steps, runs `skill_graph_scan` and checks the result. Without it the setup has no guided path.
- Make the route one of the normal `/doctor:install` steps, printed as step 5 before `/doctor:setup`, and write its cost into `INSTALL-SKILLED.md` and the advisor's `INSTALL-GUIDE.md`. The step still shows its cost and waits for a yes. A user who says no keeps a working install that matches commands on phrases only.
- Bound the prompt embedding with its own deadline of 750 ms, give a missing model and a timeout their own `disabledReason`, add a `semantic_lane_off:<reason>` warning to a recommendation that ran without a prompt vector and test the absent, model-missing, cold and slow cases.

### Out of Scope
- Installing Ollama, pulling a model or starting the server during the build. For a user the route may pull the model and start the server after a yes. It never installs Ollama and prints the install command instead.
- Changing the embedder cascade, the active model, the meaning bar of 0.72 and 0.02 or the `semantic_shadow` weight of 0.05. Phase 004 and packet `../../001-semantic-lane-enablement` own them.
- A line in the hook brief. The operator chose the doctor, status and JSON warning surfaces, and phase 005 owns the brief head.
- `AGENTS.md`. Nothing in this phase needs Gate 2 wording, and its size budget is checked by `/doctor:agents-md check`.
- Fixing `includeEmbeddingsHealth`, which probes the hf-local socket. The guide is corrected to say so, and the new fields live in `includeSemanticHealth`.
- Setting Ollama's `keep_alive`. The 5 minute unload is what keeps memory at the idle figure.

### Relation to `001-semantic-lane-enablement`
That packet is Draft and owns skill-level embedding: the lane weight, skill vector coverage and its population pass. This phase owns the command-level setup a user sees. Three planned items touch the same ground and are recorded here so neither packet repeats the other.
- Its phase 001 plans "A read-only report of lane state, coverage and `disabledReason` on the advisor status surface". `readSemanticLaneHealth` already ships it. This phase adds `backend` and `commandVectorCoverage` to the same object.
- Its phase 001 also plans "Recording daemon latency and cost per recommendation". The script here measures the embedder's memory and latency and can serve as that record.
- Its phase 002 plans the failure policy when the backend is unreachable during a scan. This phase covers the prompt-time query embedding only and leaves the scan's outage streak alone.
Its file paths still name `mcp-server/`, which is now `runtime/`.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `DOC` is `.skilled/commands/doctor`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/scripts/measure-embedder-cost.mjs` | Create | The read-only measurement script |
| `ADV/scripts/README.md` | Modify | One entry for the script |
| `ADV/lib/scorer/lanes/semantic-shadow.ts` | Modify | Prompt embedding deadline and distinct reasons |
| `ADV/handlers/advisor-status.ts`, `ADV/schemas/advisor-tool-schemas.ts` | Modify | `backend` and `commandVectorCoverage` in the semantic lane health |
| `ADV/handlers/advisor-recommend.ts` | Modify | The `semantic_lane_off:<reason>` warning |
| `DOC/_routes.yaml`, `DOC/skill-advisor.md` | Modify | The `embedder` route and its router row |
| `DOC/assets/doctor-skill-advisor-embedder.yaml` | Create | The route workflow |
| `DOC/assets/doctor-skill-advisor-presentation.txt` | Modify | The route's plan, approval and result wording |
| `DOC/assets/doctor-setup.yaml`, `DOC/assets/doctor-setup-presentation.txt` | Modify | The `embedder` leg and the target list row |
| `DOC/assets/doctor-install.yaml`, `DOC/assets/doctor-install-presentation.txt` | Modify | The embedder step as step 5, before `/doctor:setup` as step 6 |
| `ADV/scripts/command-bridges/scoring-compatibility.json` and the files `derive-command-bridges.cjs` regenerates | Modify | Activate the route's bridge like its six siblings |
| `INSTALL-SKILLED.md`, `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` | Modify | The dependency, its cost and its setup |
| `ADV/tests/semantic-prompt-embedding-degrade.vitest.ts` | Create | Absent, model-missing, cold, slow and warning cases |
| `ADV/tests/handlers/advisor-status.vitest.ts`, `DOC/scripts/tests/skill-advisor-route-contract.test.cjs`, `DOC/scripts/tests/doctor-install-contract.test.cjs` | Modify | Status fields, the route contract and the six install steps |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node ADV/scripts/measure-embedder-cost.mjs` prints one JSON object with the Ollama version, the model's size on disk, the resident memory of `ollama serve` and of its model runner, the loaded size and expiry from `/api/ps`, the median and p95 of 30 warm query embeddings, the median of 5 advisor CLI calls with distinct prompts and a cold sample taken only when `/api/ps` lists no loaded model. It writes, starts and unloads nothing. It exits 2 with a message naming the server when the server does not answer. |
| REQ-002 | `advisor_status --include-semantic-health true` returns `backend` with `state` one of `reachable`, `unreachable` or `model_missing`, probed with one bounded `/api/tags` call of at most 500 ms, and `commandVectorCoverage` with `embedded` read from `vec_cmd_<dim>` and `total` the count of command entries that carry `embeddingText`. `laneEnabled` is false when `backend.state` is not `reachable`. |
| REQ-003 | `/doctor:setup` runs a sixth leg, `embedder`, that reads REQ-002. It passes when `laneEnabled` is true and `commandVectorCoverage.embedded` is above 0, and otherwise reports DEGRADED with the repair `/doctor:skill-advisor embedder`, never FAIL. Planner's reading, not the operator's words: the operator chose "Set up by default, behind a yes" and not "Required", so an absent embedder degrades the install and does not fail it. The route stays read-only. |
| REQ-004 | `/doctor:skill-advisor embedder` probes read-only, prints a plan whose every step names its cost from REQ-001 and its undo, stops at an approval prompt and runs only approved steps. After the yes it may run `ollama pull nomic-embed-text:v1.5` and start `ollama serve`. It never installs Ollama and prints the install command for the user instead. With `--dry-run` it stops after the plan. After the steps it runs `skill_graph_scan --trusted` and shows REQ-002. |
| REQ-005 | The prompt embedding gives up after `PROMPT_EMBEDDING_DEADLINE_MS`, set to 750 ms. For an absent server, a missing model and a call past the deadline the recommendation equals the recommendation with no embedder, no error reaches the caller and `disabledReason` reads `prompt_embedding_unreachable`, `prompt_embedding_model_missing` or `prompt_embedding_timeout`. A cold call that answers inside the deadline is scored with its cosine. One test covers each of the four cases. |
| REQ-006 | The `/doctor:install` checklist prints `/doctor:skill-advisor embedder` as step 5, one of its normal steps, before `/doctor:setup` as step 6. `INSTALL-SKILLED.md` and the advisor's `INSTALL-GUIDE.md` state that the install sets up meaning matching by default and asks before it pulls the model or starts the server, what it costs with the REQ-001 numbers and the date they were taken and that a user who says no keeps a working install that matches commands on phrases only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | A recommendation scored without a prompt vector carries the warning `semantic_lane_off:<disabledReason>` in `warnings`. The hook brief is unchanged. |
| REQ-008 | Nothing else moves. The default capture prints typed 24 of 44, tune combined 9 of 45, holdout 0 of 44 and false offers 0 of 35. The scorer floor prints `[159,50,20,5]`. The policy rollup prints `{"ask":17,"run":7,"start":20}`. `npm test` in `ADV` and `bash DOC/scripts/tests/run-all.sh` report 0 failed. |
| REQ-009 | With the embedder running and the new route's bridge active, the real-embedding capture still prints tune combined 14 of 45, holdout 2 of 44, typed 24 of 44 and false offers 0 of 35, and `vec_cmd_768` holds one row per command entry with `embeddingText`. `node DOC/scripts/doctor-phrase-reach.cjs` exits 0. |
| REQ-010 | The Claude hook over the 44 tune prompts stays inside the phase 004 budget of +25 ms median and +40 ms p95 against a same-session baseline, each the middle of three runs. |
| REQ-011 | `INSTALL-GUIDE.md` says that `includeEmbeddingsHealth` probes the hf-local server only and points at `includeSemanticHealth` for the active embedder. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a machine with no Ollama, `/doctor:setup` reports the `embedder` leg as DEGRADED and names `/doctor:skill-advisor embedder`, and a recommendation carries `semantic_lane_off:prompt_embedding_unreachable`.
- **SC-002**: The install documents state the cost from a run of the committed script, and a second run of that script reproduces each number within its own spread.
- **SC-003**: A hung or absent embedder never costs the brief. The four degrade tests pass and the default capture is unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 edits `advisor-recommend.ts` and `scoring-compatibility.json` | A merge conflict or a lost change | Build this phase after phase 005 is merged, and read both files at the start |
| Dependency | Ollama with `nomic-embed-text:v1.5` on the build machine | No warm, cold or real-embedding numbers | The script exits 2 and names the server. The degrade tests inject the adapter and need no server |
| Risk | The new route's active bridge steals a prompt from another command | High: a false offer or a lost typed row | REQ-008 and REQ-009 rerun both captures and the phrase-reach probe. Drop the activation if either moves |
| Risk | A deadline too short drops a cold load on a slow machine | Med: one prompt per idle period loses meaning matching | The cold case test and the 750 ms the operator chose. The load continues on the server, which is not confirmed and is checked in T003 |
| Risk | A status probe adds a network call | Low: `advisor_status` is not on the hook path | Only with `includeSemanticHealth`, bounded at 500 ms |
| Risk | A step the route runs for the user touches the user's machine outside the repository | High: an install or a long download nobody expected | The plan names each step, its cost and its undo, and nothing runs before the yes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The hook path gains no network call. The deadline wraps the existing prompt embedding and the warning is read from state the call already set.
- **NFR-P02**: The status probe is one `/api/tags` call of at most 500 ms, made only when `includeSemanticHealth` is set.

### Security
- **NFR-S01**: The route runs no step outside the plan the user approved, and the measurement script writes nothing.
- **NFR-S02**: The script and the probe call only the configured `OLLAMA_BASE_URL` or `http://127.0.0.1:11434`.

### Reliability
- **NFR-R01**: An absent server, a missing model, a dimension mismatch and a timeout each yield the phrase-only result, never an error and never an empty brief.
- **NFR-R02**: `/doctor:setup` stays read-only with the new leg.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty prompt gets no embedding, so no deadline runs and the result equals today's.
- Maximum input: the prompt is embedded once whatever its length, and the adapter cuts it at the manifest's 5,000 characters.
- Failure path: a server that accepts the connection and never answers hits the deadline, the call scores on phrases and the warning names `prompt_embedding_timeout`.
- Active embedder not Ollama: `backend.state` reads `reachable` only after a probe of that backend. A non-Ollama backend gets the reason `probe_not_implemented` and `laneEnabled` keeps today's rule.
- No active pointer: on a fresh install with no embedder, the pointer stays `auto` until the daemon restarts after the setup. The route says so and names the restart.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 18 files and 700 lines across the script, the lane, status, one handler, five doctor assets, two install guides and three tests |
| Risk | 14/25 | A route that can act on the user's machine, and a new active bridge |
| Research | 8/20 | The timeouts, the reasons and the doctor surfaces are read. The cold-load behaviour after a deadline is not |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

The operator's requirement of 2026-11-12 sets the goal. The operator answered the four planning questions on 2026-11-12 through the question dialog.

- For an external repository, is meaning matching optional or set up by default? Decision: "Set up by default, behind a yes", with the option text "It is one of the normal /doctor:install steps. The installer still asks before it does anything." The planned recommendation was optional, so the route is now step 5 of `/doctor:install` and the install guides describe it as a normal step.
- May Skilled start the server or pull the model itself after a yes? Decision: "Pull and start, never install (Recommended)". After a yes the route pulls the model and starts the server, and it prints the Ollama install command for the user.
- Where does the user see that meaning matching is off? Decision: "Doctor, status and JSON warning (Recommended)". `/doctor:setup`, `advisor_status` and a `semantic_lane_off:<reason>` warning in the recommendation JSON, with no hook brief line.
- What deadline does the prompt embedding get? Decision: "750 ms (Recommended)". It holds a cold call of 271 to 277 ms and stays inside the 2,500 ms hook budget.

### Open

None.
<!-- /ANCHOR:questions -->

---
