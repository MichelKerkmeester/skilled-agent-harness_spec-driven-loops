# Research Angles, Round 3

Forty-five angles for five lineages: `grok`, `deepseek`, `mimo` and `swe` run ten iterations each, and `glm` runs five. Round 3 asks where a classifier model, Jev hosted or Deem local, cuts the main AI's context and manual review work. It builds on rounds 1 and 2. It does not repeat them.

Path prefixes used below:
- `PHASE/` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/`
- `DEEM/` = `PHASE/context/deem-main/`, the vendored Deem repository
- `LOCAL` = `PHASE/context/deem-local.md`, the orchestrator's install record and measurements of Deem 0.8B on this Mac. Read it in every iteration
- `BASE2` = `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md`, the round-2 final synthesis. Its ids R1 to R22, What Not To Build rows 44 to 72 and open questions 1 to 38 are its own
- `BASE1` = `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md`, the round-1 re-synthesis. What Not To Build rows 1 to 43 are in it
- `ROUND1/` = `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/`. The fitness checklist Q1 to Q15 and the red flags are sections 3 and 4 of `ROUND1/context/repo-rules-digest.md`
- `CTX/` = `specs/cli-jev/003-cli-jev-workflow-integration/context/`, and `R/` = `CTX/external repo's/`
- `JEV/` = `.skilled/skills/cli-jev/`, the transport skill
- `JEVSRC` = `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`, the vendored source of the Python `jev-cli` 0.6.2
- `ADV/` = `.skilled/skills/system-skill-advisor/runtime/`, `SSK/` = `.skilled/skills/system-spec-kit/` and `DOC/` = `.skilled/skills/sk-doc/`
- `TX/` = this project's local Claude Code transcripts, `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`
- `STEER` = your own lineage's `steer.md`, at `PHASE/research/lineages/<label>/steer.md`

---

## 1. Where round 3 starts

**The round-2 result (BASE2 section 1 and section 11).** R1 and R19 are build-now as zero-call censuses in phases 002 and 005. R2, R20 and R21 are next, in phases 003, 006 and 002. R3 to R18 without R11 and R14, plus R22, are later. R14 is dropped and R11 is folded into R19. Every Jev call stays dormant without a key.

**What changes in round 3.**
- **A second backend.** The parent's D1 makes every feature run on Jev or Deem and stay dormant unless one is available. With neither, behavior is exactly today's.
- **A served local model.** The parent's D3 now reads: Deem 0.8B bf16 is served on this Mac after the operator's yes to a plan naming its rollback, and kept current with Deem's releases. The 9B stays a documented option that nobody serves.
- **A new hub.** The parent's D2 puts `cli-jev` (moved) and `cli-deem` (new) under a `cli-classifier` hub, and the research decides its shape.
- **New questions.** Context reduction, validator judgment calls, sk-prompt and sk-design were outside rounds 1 and 2.

**Facts the orchestrator confirmed on 2026-09-27.** Cite them as orchestrator-confirmed or by their `LOCAL` line. Do not re-derive them.
- No Deem CLI exists. The PyPI name `deem` and the npm name `deem` belong to unrelated projects, and `deem-cli` and `libertai-deem` exist on neither registry.
- Deem's server serves the System One API shape (`DEEM/serve/deem_server.py:2-6`), and the vendor says the official `typesafe-sdk` works against it through `TYPESAFE_BASE_URL` (`DEEM/serve/README.md:173-184`).
- **The served model** is `LibertAIDAI/deem-0.8-v1` at Hugging Face commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`, in bf16, on Deem's Python server with `DEEM_DEVICE=mps`, at `http://127.0.0.1:8300` with model id `deem-0.8-v1` (`LOCAL:20-26`). Setting `mps` by hand worked without a code change (`LOCAL:24`).
- **Its measurements** (`LOCAL:34-44`), on synthetic inputs with one question per request: p50 about 60 ms for `choice`, `score` and `noul`, p95 from 62.8 to 78.5 ms, a physical footprint of 3,368 MB with MPS memory included, 814 MB resident and about 10 s from start to healthy.
- **It is uncalibrated.** No calibration file is loaded, so every answer reports temperature 1.0 (`LOCAL:27`), and its quality on this repository is unmeasured (`LOCAL:52`).
- **Its install** lives under `~/.local/share/deem/`, outside every repository, with its own venv, model, Hugging Face home, log and pid file (`LOCAL:28`). Stop and removal commands are at `LOCAL:55-61`.
- **Releases** appear as new commits on the Hugging Face model repository. Deem publishes no GitHub releases or tags. The operator wants the local model to update when a new commit lands.
- **The 9B** is `LibertAIDAI/deem-9b-v1`: one 17.9 GB `model.safetensors`, not gated, architecture `Qwen3_5ForCausalLM`. It is a documented option compared from its published numbers only.
- The Rust server has x86 SIMD kernels and a non-x86 fallback (`DEEM/rust/deem-runtime/src/kernels.rs:145`), and it is not what serves here.
- This Mac is an Apple M5 Max with 64 GB of RAM.

**What the served model reopens.** A local call of about 60 ms sits inside the 2,500 ms advisor hook deadline and the 3 s PreCompact command-hook timeout that ruled out live forms in rounds 1 and 2 (BASE1 rows 1 and 5). The cost of a process spawn or connection plus that call inside a hook is unmeasured (`LOCAL:50`). Treat every reopened drop as a question with a number to find, not as settled.

---

## 2. The five lenses

**`grok`: outside patterns and the vendored material.** It runs on cli-cursor with `grok-4.7-xhigh-fast`. It owns `DEEM/` and `R/`. For each vendored pattern, say what to adopt under the two-backend gate and what is an anti-pattern here, with the vendored `file:line`. Every vendor figure stays labeled a vendor claim. Every idea you keep gets a kill criterion, written as the measured result that would drop it.

**`deepseek`: seams, gating and failure paths.** It runs on cli-pi with `deepseek-v4.1-flash` at max. It owns the two-backend gate. Find the exact call site, the hook contract and its deadline, the process boundary a call crosses and every failure path on both backends. Name the callers and frozen contracts each idea touches, found by search.

**`mimo`: UX and measurement.** It runs on cli-pi with `mimo-v2.6-pro` at high. For each idea, say what the operator sees, types or decides differently, and what the default is. Then produce the baseline: context tokens, AI passes and minutes, counted, with the method stated. Where a count answers a question, produce the count.

**`swe`: code-level slice design.** It runs on cli-devin with `swe-2-max`. Turn ideas into first slices: exact files, function names and signatures, test cases with their fixtures, rough LOC per function and the keep or kill rule as checkable logic. It owns the validator and template-alignment maps in code terms.

**`glm`: the contrarian.** It runs on cli-pi with `glm-5.3-flash` at max, five iterations. It argues what not to build and where the other lineages overengineer, grounded in `.skilled/repo-rules/prevent-overengineering.md` and the fitness checklist. A contrarian verdict without code, a count or a rule citation earns nothing.

---

## 3. Waves

| Wave | Iterations | glm | Rule |
|---|---|---|---|
| W1 | 1 to 3 | 1 | **Independent.** Read no file under `PHASE/research/lineages/<other>/`, including other lineages' `steer.md`. You may read both baselines, your own lineage's earlier iterations, your own `STEER`, `LOCAL` and any code. Only agreement found in W1 counts as corroboration in the synthesis |
| W2 | 4 to 6 | 2 and 3 | **Cross-read, then push past.** First read the newest existing iteration file of each other lineage at `PHASE/research/lineages/<other>/iterations/`. Push past it, contest it with code or say plainly that you agree and why. An agreement counts only when you cite code or a count you opened yourself. If a sibling has no file yet, say so and go on |
| W3 | 7 and 8 | 4 | **New skills and workflows with measured value.** Read the newest iteration of each other lineage first. Every new skill, command, hook or workflow you propose carries a metric, a counted baseline and a harness, or it is recorded as unmeasured |
| W4 | 9 and 10 | 5 | **Cost, order and kill criteria from your lens.** Read all your own iterations and the newest iteration of each other lineage first |

Lineages run concurrently, so a sibling's newest file may be older than your own iteration. Name every sibling file you read by path and iteration number in a **Sibling check** section. A W1 iteration writes one line instead: `Independent: no round-3 sibling file read.`

---

## 4. The per-iteration contract

Every iteration follows this contract, in addition to the workflow's own iteration shape.

1. **Find your angle.** Your label is the last path segment of `config.fanout_lineage_artifact_dir` (`grok`, `deepseek`, `mimo`, `swe` or `glm`). Iteration N takes angle `<label>-NN`, two digits: iteration 3 of the SWE lineage takes `swe-03`, and iteration 10 of the Grok lineage takes `grok-10`. Set Focus Area to that angle's id and title.
2. **Read first.** Read `STEER` if it exists, then `LOCAL`. `STEER` is your lead's review of your earlier iterations. It names gaps and drifted citations and never supplies conclusions. If a steer conflicts with your angle, follow the angle and say so in one line.
3. **One bounded angle.** Stay on it. If its questions are answered early, go deeper on them, not wider.
4. **Budget.** About 15 tool calls. Spend them on opening code and counting, not on rereading the baselines.
5. **Cite.** Every claim carries a repo-relative `file:line` that you opened in this iteration. A claim you take from BASE1, BASE2, `STEER` or `LOCAL` without reopening its source is quoted as theirs: "BASE2 says", not "the code says".
6. **Read-only outside your lineage directory.**
   - Write only inside `PHASE/research/lineages/<label>/`. Your iteration lands at `PHASE/research/lineages/<label>/iterations/iteration-0NN.md`, and any scratch file stays inside your lineage directory.
   - Never write `STEER`. It belongs to your lead.
   - Read-only commands such as `rg`, `find`, `jq`, `wc` and node or python one-liners that read data files are allowed.
   - Do not run any repository module, test suite, `validate.sh`, `generate-context.js`, eval script or install. Do not run any Deem code, including its stub server and its tests. Make no network call and no git write.
7. **No backend call.** Make no live `jev` call of either package: no judgment, no `jev auth test` and no `jev auth status`. Never call, start or download the Deem server or its weights. Only the orchestrator calls the local Deem server. Reason from code, docs, recorded reports and `LOCAL`.
8. **Name things apart.**
   - The Python `jev-cli` 0.6.2 is what `JEV/cli-usage/` wraps. The npm `jevctl` 0.2.3 is vendored research material at `R/jev-cli-main`. Both install a `jev` command, and their exit codes disagree.
   - For Deem, name the part: the served 0.8B (`deem-0.8-v1` on the Python server `DEEM/serve/deem_server.py`), the MCP server `DEEM/serve/deem_mcp.py`, the Rust `deem-server` under `DEEM/rust/` or the 9B, which is documented and not served. No Deem CLI exists, so never describe one as if it did.
9. **Never open a `.env` file**, vendored or not.
10. **Private data gives numbers and names only.** Transcripts under `TX/` and goal state records are the operator's. Report counts, lengths, field names and record types. Never copy prompt, reply or tool text into an iteration.
11. **Vendor claims stay labeled.** Every Deem latency, memory or accuracy figure from `DEEM/` is a vendor claim, and every 9B figure stays one. Jev prices and latencies are vendor claims too. A `LOCAL` figure is the orchestrator's measurement of the served 0.8B on synthetic inputs and is cited by its line. It measures speed and memory, never quality on this repository's judgments.
12. **New information only.**
    - An iteration that restates a BASE1 or BASE2 finding without new evidence counts as no new information.
    - Every iteration ends its findings with a **New against baseline** table: `| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |`.
    - Be honest in that table: a restated row is allowed but earns nothing.
13. **Ids.** Never mint an `R` id. Refer to baseline items by their ids and rows. Name a new idea `N-<angle id>-<k>`, for example `N-swe-03-1`, so the synthesis can trace it.
14. **The two-backend gate on every idea (parent D1).**
    - Jev is available only when `command -v jev` succeeds, `jev --version` prints `jev 0.6.2` and `jev auth status --provider <p>` exits 0 for the provider the feature will call.
    - Deem is available only when the local server passes a health check. Name the check exactly: the request, the fields read and the pass condition. Angle deepseek-01 owns its definition, and later iterations use or contest it.
    - Say which backend the idea prefers when both are available, and why.
    - With neither available, the idea behaves exactly as today and says so in one line.
    - Each feature keeps its own switch. No global switch (row 42), and no path returns a default score or verdict (row 9).
15. **Hand-off.** End with a **Hand-off** section: the open threads the next iteration of your lineage must pick up, one line each.

### The per-idea record

Fill one block for every idea the iteration assesses, including ideas it drops.

| Field | What goes in it |
|---|---|
| **Idea** | Its id (a BASE `R` id or `N-<angle>-<k>`), one line on what the classifier judges, and the type: `noul`, `choice`, `score` or `run` |
| **Question** | Which of A to H it answers |
| **Builds on** | The baseline item, row or open question it starts from, or "new" |
| **Value** | The decision or read that gets cheaper, faster or more accurate, and for whom |
| **Seam** | `file:line` where the call or script sits, opened in this iteration |
| **Metric, baseline, harness** | The number that moves, today's value with its citation or UNKNOWN, and the harness or the smallest missing harness |
| **Savings** | Context tokens, AI passes and minutes per use and per week, each from a count or marked estimate |
| **Cost, latency, privacy** | Per backend: calls per use, the deadline it must meet and what leaves the machine. Jev sends state off the machine. Deem keeps it local |
| **Two-backend gate** | Its own switch, how each backend is detected, which it prefers and exactly what prints and happens when each check fails, on a malformed answer and on a slow answer |
| **Rough LOC** | Lines of code and the files touched |
| **Verdict** | build-now, next, later or drop, with one sentence of reason |
| **Confidence** | Confirmed from code or a count, or inferred plus what would confirm it |

---

## 5. The angles

### W1: independent grounding (iterations 1 to 3, glm iteration 1)

#### grok-01: The served 0.8B against the documented 9B, from their published numbers
- **Wave:** W1
- **Maps to:** A
- **Open first:**
  - `LOCAL` whole
  - `DEEM/README.md:9-12`, `:43`, `:56-62`, `DEEM/docs/MODEL_CARD_9B.md:19-41`, `:58-65`, `DEEM/docs/MODEL_CARD_08B.md:18-29`, `:51-55`
  - `DEEM/serve/README.md:128-153` (the latency table), `:244-255`
  - `DEEM/serve/deem_server.py:156-243` (`TorchBackend`), `:180-181`, `:214`
  - `DEEM/serve/calibration/` file names and the first lines of `calibration_v13.json`
  - `DEEM/eval/tare/leaderboard.md`, `DEEM/eval/tare/entries/`
- **Questions:**
  1. Build a claim table: every latency, memory and accuracy figure the README, both model cards and the Tare leaderboard give, with the model, checkpoint and hardware each was measured on, as the vendored files state it. Put `LOCAL`'s measured 0.8B figures in their own column.
  2. Compare the 0.8B and the 9B on the same judgments from their published numbers only: which benchmarks report both, and which report one? Where the cards give no shared benchmark, say so rather than bridge the gap.
  3. The 0.8B card claims 362 ms on a busy desktop CPU, and `LOCAL` measures about 60 ms on MPS. Which parts of the server path explain the gap, from code? Label the explanation inferred.
  4. Calibration: which checkpoint does each vendored calibration file name, and does any belong to `deem-0.8-v1`? What does `LOCAL:27` mean for thresholds a feature would set on raw probabilities?
  5. Under what published or measured result would the 9B be worth serving instead, given `LOCAL`'s memory figures and the parent's D3?
- **New information:** a claim table that separates the 0.8B, the 9B and development checkpoints, a shared-benchmark gap, or a calibration finding for the served checkpoint. Restating `LOCAL` is not new.

#### grok-02: Wire compatibility, field by field: Deem's `/v1/systemone` against both `jev` packages
- **Wave:** W1
- **Maps to:** A, G
- **Open first:**
  - `DEEM/serve/deem_server.py:2-6`, `:519-551`, `:553-590`, `:594-620`, `:867-905`, `DEEM/serve/README.md:36-98`, `:173-184`
  - `JEVSRC:20-40`, `:226`, `:238-250`, `:253-265`, `:274-300`, `:364-393`, `:438`
  - `JEV/cli-usage/references/cli-reference.md:61-71`, `:102-130`, `:146-159`
  - The npm `jevctl` request builder under `R/jev-cli-main/src/`
- **Questions:**
  1. Compare, key by key, the request each client sends for `noul`, `choice` and `score` with what `parse_question` accepts. Name every key one side sends that the other ignores or rejects, and the HTTP status Deem returns for it.
  2. Compare Deem's answer object with what `primary_value` and `normalize_response` read. For each subcommand, with and without `--value`, which exit code would the Python `jev-cli` give against Deem? Cite its exit mapping.
  3. `jev run` sends the caller's object unchanged (`cli-reference.md:116-118`). Does a `run` request written in Deem's shape pass both sides, and what does that leave for the typed subcommands?
  4. Which request shape does the vendor's `typesafe-sdk` claim imply, and does it match the Python `jev-cli`, the npm `jevctl` or neither? Keep it labeled a vendor claim.
  5. The Python `jev-cli` already translates the `vercel` provider. Would a Deem translation be the same size, and where would it sit?
- **New information:** a field-level compatibility table with exit codes, or evidence that the thin-wrapper route works or fails. Neither baseline covers it.

#### grok-03: Outside patterns for context reduction with a local classifier
- **Wave:** W1
- **Maps to:** C, B
- **Open first:**
  - `R/pi-jev-context-main/README.md`, `R/pi-jev-context-main/src/index.ts:264-270`
  - `R/jev-cli-main/docs/route.md`, `rerank.md`, `compact.md`, `src/core/route.ts`, `rerank.ts`
  - `R/claude-jev-main/src/infrastructure/fs-source-reader.ts`
  - `DEEM/docs/MODEL_CARD_9B.md:35-36` (the long-state claim), `DEEM/serve/deem_mcp.py:1-22`, `:96-113`
  - BASE2 section 7 and rows 44 and 47
- **Questions:**
  1. Which vendored pattern reduces what the main AI reads: resource routing, file relevance, tool-output pruning, history hiding or compaction? For each, the vendored `file:line` and the judgment type it uses.
  2. Which of these did rounds 1 and 2 drop because the call left the machine or took too long, and which for another reason such as no gold, authority or no seam? Cite the row.
  3. Deem ships an MCP server with `classify`, `score` and `check`. Is an MCP tool the right shape for a context-reduction judgment here, or does the call belong in a hook or a script? Argue from what the main AI would load to call it.
  4. The strongest outside case against local context reduction: which vendor or user claim, if true, makes it pointless here, and which local count would test it?
  5. Adopt or anti-pattern for each pattern, with a kill criterion.
- **New information:** a vendored reduction mechanism BASE2 section 7 did not use, or a row shown to rest on latency or egress alone.

#### deepseek-01: The two-backend gate as code: what "Deem is available" means
- **Wave:** W1
- **Maps to:** A, H
- **Open first:**
  - `DEEM/serve/deem_server.py:108-109`, `:137-154`, `:772-777`, `:843-865`, `:920-1015`
  - `DEEM/serve/deem_mcp.py:214-238`, `:265-280`, `DEEM/serve/README.md:30-32`, `:100-110`, `:244-255`
  - BASE2 section 11, "The shared gate contract"
  - The parent goal's D1 in `specs/cli-jev/003-cli-jev-workflow-integration/goal.md`, and `JEV/cli-usage/SKILL.md:1-45`
  - `LOCAL:20-28` (the served model id, device and endpoint) and `LOCAL:55-61` (the health command)
- **Questions:**
  1. Define the Deem check exactly: the request, the fields read, the timeout and the pass condition. What does `/health` return when no checkpoint is configured, and would a check on `status` alone pass that server? What must the check read to refuse it, and should it also pin the model id `LOCAL` records?
  2. List every Deem failure a caller can meet and its exact signal: nothing listening, the stub backend, a body over the size cap, more options than the backend can read, a validation error, a backend error, a server still loading weights and another process on port 8300. What prints for each, and what state persists?
  3. With both backends available, which does a feature use, and who decides? With one, which skip line prints for the other? Write the skip-line table for both backends.
  4. Where does the Deem check run for an offline script and for a live hook, and how often? What does a cached result do when the server stops mid-session?
  5. Which checks cost a network call or load weights, and which are free?
- **New information:** an exact Deem availability check with its failure table. BASE2 defines only the Jev half.

#### deepseek-02: The `cli-deem` lifecycle: install, start, health, update and rollback
- **Wave:** W1
- **Maps to:** A, G
- **Open first:**
  - `LOCAL:15-28` (the install) and `LOCAL:55-61` (operate)
  - `DEEM/serve/deem_server.py:168-200`, `:785-842`, `:907-1015`, `DEEM/serve/README.md:210-255`
  - `.skilled/bin/hf-model-server.cjs:26-40` and `.skilled/bin/lib/model-server-supervision.cjs`
  - `SSK/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts`
- **Questions:**
  1. This repository already runs a local model server for embeddings. Which of its supervision behaviors (spawn, socket, timeouts, idle eviction, single writer) does a Deem server need, and which does `deem_server.py` lack? Cite both sides.
  2. Deem publishes releases only as new commits on its Hugging Face repository, and the operator wants the local model to follow them. Design the update: how a new commit is detected, where it downloads, what must pass before it serves (health, a fixed smoke set, the model id) and how the previous commit stays available. Name each step's failure and what keeps serving meanwhile.
  3. Rollback: from `LOCAL`'s layout, what does returning to the previous commit take, and what does removing Deem entirely take? Can either leave a caller pointing at a half-updated model?
  4. An update changes answers under every measured keep rule. Which records must carry the served commit so a number measured on one commit is never read as another's?
  5. Read the handler's response headers and bind defaults. Which callers on this Mac could reach the server, and does that matter for a server with no auth? Then name who starts and stops it, and the smallest lifecycle that keeps "with neither backend, exactly today" true.
- **New information:** a lifecycle contract covering update and rollback on Hugging Face commits, grounded in the repository's own model server, or an exposure finding with its code line.

#### deepseek-03: Validators as gates: spec-kit's rules and `check-goal.cjs`
- **Wave:** W1
- **Maps to:** D
- **Open first:**
  - `SSK/runtime/cli/spec/validate.sh` and every rule script under `SSK/runtime/cli/rules/`
  - `SSK/references/validation/validation-rules.md`
  - `DOC/sk-create-goal/scripts/check-goal.cjs:44-49`, `:236-360`
  - BASE1 rows 12, 21 and 24, BASE2 rows 61 and 62
- **Questions:**
  1. Map every rule: what it reads, what it checks and whether the check is a repository fact or leaves a judgment for a reader. One row per rule with its `file:line`.
  2. Which rules check template alignment (sections, anchors, template source, placeholders, level, frontmatter, status consistency) and which approach content meaning? Name any rule that approximates a meaning check with a pattern.
  3. Where, if anywhere, could a classifier stand beside a rule as a separate advisory, without changing its verdict or exit code? Where must it never stand (Q11, "never let a judgment stand in for a repository fact")?
  4. `check-goal.cjs` runs four checks. Which judgment does each leave to the author after it passes?
  5. For each candidate, what does it print with neither backend?
- **New information:** a complete spec-kit rule map with the judgment residue marked per rule. Neither baseline mapped these validators.

#### mimo-01: The main AI's context spend: a counted baseline
- **Wave:** W1
- **Maps to:** C, H
- **Open first:**
  - `TX/*.jsonl`: usage fields, tool names and record types only, never content
  - `.claude/settings.json` hook blocks
  - The six `ROUTER.md` files with `router_state: active`, under `.skilled/skills/` in `sk-code`, `sk-doc`, `sk-design`, `mcp-tooling`, `system-deep-loop` and `cli-external-orchestration`
  - BASE2's Changes section, K16, for its counting method
- **Questions:**
  1. Per assistant turn, the p50 and p95 of input tokens, cache-read tokens and cache-creation tokens from the usage fields. State the method, the file count and the date range.
  2. Per user turn, how many Read, Grep, Glob and Bash calls follow, and how many Reads open a `SKILL.md`, a `references/` file or a `ROUTER.md` leaf? Numbers only.
  3. Which surfaces cost the most context: skill and reference loads, tool outputs, hook-injected context or compaction briefs? Estimate each share from counts, and say how.
  4. How many turns re-read a file already read in the same session? That count caps file-relevance savings.
  5. Which one baseline number should every context-reduction claim in round 3 be measured against?
- **New information:** a counted context baseline. Neither baseline measured context spend per turn.

#### mimo-02: The judgment calls an AI still makes after validators pass
- **Wave:** W1
- **Maps to:** D
- **Open first:**
  - `TX/*.jsonl`: tool names, command names and exit status only
  - Review iteration files under `specs/**/review/` and `specs/**/ai-council/`
  - `DOC/sk-create-with-human-voice/scripts/hvr_scan.py:15-21`
  - BASE2 R22 and row 70
- **Questions:**
  1. Count sessions where `validate.sh` or a sk-doc validator passed and the AI then edited the same file within the next few turns. Give the count, the window and the method.
  2. From review iterations, count findings on documents that had passed validation, by category: template alignment, voice, factual drift, scope and placeholders in spirit. Give the search and the files.
  3. Which categories recur often enough that a classifier with precision 0.8 would save a pass? Show the arithmetic.
  4. Which categories have labels today, and how many would the operator have to write?
  5. What does the operator see today when a document passes and still needs a reread?
- **New information:** a counted residue by category with its method. BASE2's R22 names one category without a count.

#### mimo-03: Deem against Jev on the same judgments: the comparison design
- **Wave:** W1
- **Maps to:** A, H
- **Open first:**
  - `ADV/scripts/routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`
  - The Gate 3 corpus named in BASE1's harness H3
  - BASE2 sections 5 and 6 (the goal-criteria sample and R1's power)
  - `DEEM/eval/tare/README.md:14-41`, `DEEM/eval/tare/metrics.py`
  - `LOCAL:30-53`
- **Questions:**
  1. Which existing labeled sets can host a comparison of the served 0.8B with Jev, with zero new labels? Count rows per set and the judgment type each needs.
  2. The metric: agreement with gold, agreement between the backends, calibration or flip rate? Which one decides "the 0.8B is good enough here", and at what pre-registered threshold?
  3. The 0.8B is uncalibrated (`LOCAL:27`, `:53`). Does the comparison need a calibration split first, and how many labeled rows would it take?
  4. Power: how many rows does each set need to separate the backends at a plausible gap? Show the arithmetic, and name the sets that are too small. Then say what the operator reads, line by line, and which single line decides.
  5. What would make the comparison unfair: option caps, calibration, prompt wording, state length or a model update mid-comparison? Cite the code or the `LOCAL` line for each.
- **New information:** a pre-registered two-backend comparison with row counts, power and a calibration step. Neither baseline compares two backends.

#### swe-01: `cli-deem`'s smallest slice as code: wrapper, translator or client
- **Wave:** W1
- **Maps to:** A, G
- **Open first:**
  - `JEVSRC:90-110`, `:226-265`, `:274-300`, `:364-393`, `:438`
  - `DEEM/serve/deem_server.py:519-620`, `:772-777`, `DEEM/serve/tests/test_server.py`
  - `JEV/cli-usage/SKILL.md:1-45`, `JEV/cli-usage/references/cli-reference.md:146-185`
  - `LOCAL:20-28`, `:55-61`
- **Questions:**
  1. Three shapes: a mode that shells the Python `jev-cli` with `--provider custom --endpoint`, a translator in front of it, or a small stdlib client that posts to `/v1/systemone`. List each shape's functions with signatures and rough lines.
  2. Which shape keeps the Python `jev-cli` exit taxonomy (0, 1, 2, 3, 4 and 130) for Deem failures? Map each Deem failure to an exit code.
  3. The `custom` provider needs a stored key before it sends anything (`cli-reference.md:182-184`). How does each shape handle a server with no auth without writing a fake secret into a tracked file?
  4. The lifecycle commands `cli-deem` owns: install, start, health, update and rollback. Which belong in the skill as documented commands, which in a script, and which stay the operator's? Size each from `LOCAL`'s layout.
  5. Test cases with fixtures: a stub-backend server, a refused connection, a 400, a stub-backend health answer, a wrong model id and a choice with more options than the backend reads. Which tests need no weights? Then LOC per shape and a rollback sentence for each.
- **New information:** a function-level design with an exit map, lifecycle commands and tests. No baseline designed `cli-deem`.

#### swe-02: sk-doc's validators as code: every template-alignment check and its residue
- **Wave:** W1
- **Maps to:** D
- **Open first:**
  - `DOC/shared/scripts/validate_document.py:194-255` and its rule functions, `DOC/shared/assets/template-rules.json`
  - `DOC/shared/scripts/extract_structure.py:899-1127` (`calculate_dqi`), `DOC/shared/scripts/quick_validate.py`
  - `DOC/sk-create-skill/scripts/validate_skill_package.py`
  - `DOC/shared/scripts/frontmatter-version.mjs`, `DOC/shared/scripts/check-frontmatter-versions.sh`
  - `DOC/sk-create-with-human-voice/scripts/hvr_scan.py:1-60`
  - The agent docs in `.claude/agents/` and the command docs in `.skilled/commands/`
- **Questions:**
  1. Map every check: the document types it applies to (skill, reference, command, agent, readme, spec), what it asserts and its `file:line`. One row per check.
  2. DQI: which inputs make up the score, which are counts and which stand in for quality? Where could a document score well and still read badly?
  3. HVR: which rules the scanner settles and which it leaves to a reader, from its own header. Which could a `noul` or `score` judge per section?
  4. Command, skill and agent docs: which structural checks exist for each, and which conventions does the repository state that no script checks? Name each convention's source line.
  5. For each residue, the smallest sibling script that judges it without editing the validator, and its rough LOC.
- **New information:** a complete sk-doc check map with the residue per check. BASE2 examined only `hvr_scan.py`.

#### swe-03: Resource routing as code: ROUTER leaves and the compiled router
- **Wave:** W1
- **Maps to:** C
- **Open first:**
  - The six active `ROUTER.md` files named in mimo-01
  - `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-route-manifest.cjs`
  - `DOC/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs`, `ci-router-vocabulary-reach.cjs`, `router-reach-allowlist.json`
  - `SSK/runtime/cli/retrieval/lookup-trigger-index.mjs`
  - BASE1 rows 19 and 20
- **Questions:**
  1. How does a hub pick which leaf resources the main AI loads today: a pattern, weights, a manifest or the model itself? Trace one request end to end with `file:line`.
  2. Where would a classifier `choice` over leaf resources plug in so the main AI loads fewer files, and is that point inside a deadline? Name the caller and its timeout.
  3. Which harness already measures routing, and what gold does it hold for leaf selection? Count the scenarios.
  4. The smallest offline slice: a script that replays the scenarios with a classifier pick beside the current pick and makes zero calls when neither backend is available. Functions, tests and LOC.
  5. What did BASE1 rows 19 and 20 drop, and does leaf selection differ from the clarify and defer question they covered?
- **New information:** a traced leaf-selection path with a harness count and a slice. No baseline examined ROUTER leaves.

#### glm-01: Should any feature use the served Deem at all?
- **Wave:** W1 (glm iteration 1)
- **Maps to:** A, B, H
- **Open first:**
  - `.skilled/repo-rules/prevent-overengineering.md`, `ROUND1/context/repo-rules-digest.md` sections 3 and 4
  - `LOCAL` whole, `DEEM/docs/MODEL_CARD_08B.md`, `DEEM/eval/tare/leaderboard.md`
  - BASE2 sections 1 and 9, and the parent goal's D2 and D3
- **Questions:**
  1. The 0.8B is served, fast and free, but uncalibrated and unmeasured on this repository's judgments. Is speed without measured quality a reason to wire it anywhere yet? Argue from the checklist.
  2. Which reopened drops (BASE1 rows 1 and 5) are tempting only because the call is fast, and what would still make them wrong (Q1, Q8, Q11)?
  3. The operator wants automatic updates on new Hugging Face commits. What does automatic updating cost in reproducibility, and what is the least update mechanism that meets the wish?
  4. Name the single measured result that should stop all Deem work, as a printed line.
  5. Then argue the other side: the strongest case for using the 0.8B that survives your objections.
- **New information:** a decision rule for using Deem grounded in code, `LOCAL` and repo rules, or a smaller update mechanism than the siblings propose.

### W2: cross-read and push past (iterations 4 to 6, glm iterations 2 and 3)

Before starting, read the newest existing iteration of each other lineage and fill the Sibling check.

#### grok-04: The drops that flip: rounds 1 and 2 under a free, private, local model
- **Wave:** W2
- **Maps to:** B
- **Open first:**
  - BASE1 What Not To Build rows 1 to 43 and BASE1 section 9 with its privacy table
  - BASE2 rows 44 to 72, section 9 and the carried table of R3 to R18
  - The newest sibling iterations, and `LOCAL:30-53`
- **Questions:**
  1. Classify every drop and every later item by its load-bearing reason: cost, quota, latency, egress, no gold, authority (Q8, Q11), no seam or no reader. A row can carry several. Give the table.
  2. For rows whose only reasons are cost, quota, latency or egress, which reason does the served 0.8B remove and which does it keep? Use `LOCAL`'s measured p95 for latency, and keep quality as an open reason wherever the row needs an accurate answer.
  3. BASE1 section 9 says the key gate moves no deadline. With a measured p95 of 63 to 79 ms against the 2,500 ms advisor hook (row 1) and the 3 s PreCompact hook (row 5), and against the deadlines behind rows 31, 40 and 69, which drops reopen? Cite each deadline, and name the part of the budget the hook already spends.
  4. Which later items were held back by a high-sensitivity payload (R2's plugin mode, R4, R8, R10, R15 and R19's arm)? Does a local backend move any of them without also giving them gold?
  5. Contrarian: which drop looks like it flips but does not, and why?
- **New information:** a drop-by-reason table with the flip set named. It is the core of question B, and no baseline has it.

#### grok-05: sk-prompt: framework pick and CLEAR scoring against outside classifiers
- **Wave:** W2
- **Maps to:** E
- **Open first:**
  - `.skilled/skills/sk-prompt/SKILL.md:150-240`, `:290-325`, `sk-prompt/assets/framework-registry.json`, `sk-prompt/references/patterns-evaluation.md`
  - `sk-prompt/manual-testing-playbook/clear-scoring/`, `sk-prompt/benchmark/reports/`
  - `.claude/agents/prompt-improver.md`
  - `R/jev-cli-main/docs/classify.md`, `route.md`, `DEEM/serve/README.md:79-95`
  - BASE2 row 63
- **Questions:**
  1. Is the intent scorer in `SKILL.md:150-240` runnable code anywhere in the repository, or pseudocode the model follows? Search for it, because the answer decides whether a seam exists.
  2. Framework pick is a `choice` over seven frameworks. What gold exists: playbook scenarios, benchmark reports or none? Count rows.
  3. CLEAR is a 50-point score over five dimensions. Could a `score` per dimension be checked against any scored examples in the repository? Count them.
  4. Row 63 dropped `/prompt:improve` for having no labels. Does anything here change that?
  5. Adopt or anti-pattern for each outside classifier pattern, with a kill criterion.
- **New information:** whether a runnable sk-prompt seam exists, with a gold count, or new evidence on row 63.

#### grok-06: sk-design: mode routing and rubric scoring against outside patterns
- **Wave:** W2
- **Maps to:** F
- **Open first:**
  - `.skilled/skills/sk-design/hub-router.json`, `mode-registry.json`, `ROUTER.md`
  - `sk-design/sk-design-fundamentals/SKILL.md:170-220`, `references/review-checklist.md`, `references/diagnosis-table.md`
  - `sk-design/sk-design-md-generator/references/quality-checklist.md`, `sk-design/benchmark/`
  - `R/supercov-main/crates/supercov-cli/src/quality/properties.json`, `R/jev-review-main/src/review/`
- **Questions:**
  1. How does sk-design route among its four modes today, and what does its benchmark measure? Count scenarios and cite the latest routing result.
  2. Which rubric does sk-design ask the AI to score by hand, and how many items does it hold? Which items are yes or no questions a `noul` could answer from text alone?
  3. Which vendored rubric-scoring pattern fits, and which vendor data warns against it?
  4. What gold exists for rubric scoring here? Count it.
  5. Adopt or anti-pattern, with a kill criterion.
- **New information:** a counted routing baseline and a rubric item list with a gold count. No baseline looked at sk-design.

#### deepseek-04: Context-reduction seams and their deadlines
- **Wave:** W2
- **Maps to:** C, B
- **Open first:**
  - `SSK/runtime/hooks/claude/user-prompt-submit.ts`, `compact-inject.ts`, `shared.ts`
  - `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts`
  - The hook blocks in `.claude/settings.json`, with their timeouts
  - `.skilled/bin/compiled-route.cjs`, `SSK/runtime/cli/retrieval/lookup-trigger-index.mjs`
  - The newest sibling iterations, especially mimo-01 and swe-03, and `LOCAL:30-53`
- **Questions:**
  1. For each reduction seam (skill routing, leaf routing, retrieval, compaction keep or drop, tool-output pruning): the hook or script, its deadline, what it already spends of that deadline and what happens on timeout. One row each with `file:line`.
  2. For each, the headroom left for a local call. `LOCAL` measures about 60 ms per call from a warm Python client and says the cost of a spawn or connection inside a hook is unmeasured (`LOCAL:50`). Which parts of a hook's call path add to the 60 ms, from code?
  3. The advisor hook's child is killed at 2,500 ms (BASE1 row 1) and the PreCompact hook has 3 s with an 1,800 ms internal budget (BASE1 row 5). Reopen both seams: does a warm 0.8B fit with margin, and what does the hook do if the server is cold or gone?
  4. Reopen the seams behind rows 38 and 40. Does each drop rest on the deadline alone, or also on egress, gold or authority?
  5. The degrade path under the two-backend gate: what the main AI sees when neither backend answers in time.
- **New information:** a deadline-and-headroom table for every reduction seam, with rows 1 and 5 re-judged against a measured local call.

#### deepseek-05: The flip set, seam side: frozen contracts and callers
- **Wave:** W2
- **Maps to:** B
- **Open first:** grok-04 if it exists and the newest sibling iterations, the BASE1 and BASE2 rows each candidate names, and the seams those rows cite.
- **Questions:**
  1. For each drop proposed to flip, reopen its seam and name its frozen contract, its owner and its callers, found by search.
  2. Which flips need a new hook or a deadline change that the parent's decisions do not allow?
  3. Which flips replace a repository fact with a judgment (Q11) and must stay dropped whatever the backend?
  4. For each survivor, the exact failure path under Deem: a refused connection, the stub backend and a slow first call.
  5. Push past or contest the flip set with code.
- **New information:** a flip set checked against contracts and callers, or a flip refuted by code.

#### deepseek-06: `cli-deem` through the `custom` provider: the failure side
- **Wave:** W2
- **Maps to:** A
- **Open first:**
  - grok-02 and swe-01 if they exist
  - `JEVSRC:90-110`, `:253-300`, `:389-393`, `:430-445`
  - `JEV/cli-usage/SKILL.md:27-30`, `:185-190`, `:225-232`
  - `JEV/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.txt:60-80`, `:140-160`
  - `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, the `jev-custom-endpoint-required` check
- **Questions:**
  1. The skill text says to point `custom` at a trusted HTTPS origin. Does any guard refuse `http://127.0.0.1:8300`? Find the check and cite it.
  2. The `custom` provider sends a bearer token to its endpoint. What does a local Deem do with it, and which key must exist before the Python `jev-cli` sends the request at all?
  3. For each failure, the exit code the Python `jev-cli` gives against Deem: nothing listening, a 400, a 500, a stub-backend answer and a missing answer key. Does any path yield a default value?
  4. Would the Jev check (`jev auth status --provider custom`) pass for a local Deem setup, and would that confuse the two backends in the gate?
  5. Verdict from the failure side: thin wrapper, translator or separate client, with evidence.
- **New information:** guard behavior against a loopback endpoint, or a confusion between the two backends in the gate.

#### mimo-04: Savings arithmetic per reduction seam
- **Wave:** W2
- **Maps to:** C, H
- **Open first:** mimo-01, the newest sibling iterations (deepseek-04, swe-03, grok-03), `TX/*.jsonl` for any count you must redo, and `LOCAL:30-53`.
- **Questions:**
  1. For each reduction seam, tokens saved per use times uses per day, from counts. Name each count's source.
  2. AI passes: how often a reduction avoids a re-read or a second tool call, and how often a wrong judgment adds one. Give both sides.
  3. Minutes: what each saving comes to per week, at the per-turn times the transcripts record. Take the classifier's own cost per call from `LOCAL`, and mark any hook spawn or connection cost as unmeasured.
  4. Rank the seams by net saving, and say which rank flips if the classifier's precision falls to 0.7.
  5. What the operator sees when a reduction fires: the line, its default and how to turn it off.
- **New information:** a net-savings table with both error directions, built on counts.

#### mimo-05: sk-prompt measured: usage, cost and gold
- **Wave:** W2
- **Maps to:** E
- **Open first:** `TX/*.jsonl` for `/prompt:improve` and prompt-improver dispatch counts (names only), `sk-prompt/benchmark/reports/`, `sk-prompt/manual-testing-playbook/`, `.skilled/commands/prompt/` and grok-05 if it exists.
- **Questions:**
  1. How often does the operator run sk-prompt or the prompt-improver? Count invocations per week.
  2. What does a run cost the main AI in context and passes today? Count from the transcripts.
  3. Which step, framework pick or CLEAR scoring, would a classifier take over, and what would the operator still read?
  4. What gold exists, and how many labels would a precision estimate need?
  5. Is the saving large enough to rank above later? Show the arithmetic.
- **New information:** a usage count and a cost baseline for sk-prompt.

#### mimo-06: sk-design measured: routing accuracy, rubric labor and usage
- **Wave:** W2
- **Maps to:** F
- **Open first:** `TX/*.jsonl` for sk-design and `/design` command counts, the reports under `sk-design/benchmark/`, `.skilled/commands/design/` and grok-06 if it exists.
- **Questions:**
  1. Usage per week of each sk-design mode.
  2. The routing accuracy the benchmark records, with its date and scenario count.
  3. How much work rubric scoring costs the main AI per run, in turns or tool calls.
  4. What a classifier would change for the operator, and its default.
  5. Is there enough usage or gold to rank above later?
- **New information:** sk-design usage and routing baselines.

#### swe-04: The top reduction seam as a slice
- **Wave:** W2
- **Maps to:** C
- **Open first:** mimo-01, mimo-04, deepseek-04 and swe-03 if they exist, `../005-compaction-recall-harness/spec.md` and `plan.md`, and the chosen seam's code.
- **Questions:**
  1. Pick the reduction seam with the best counted saving so far, and design its offline slice: files, functions, test cases and rough LOC.
  2. How the slice detects both backends through one probe, and what it prints with neither.
  3. If the seam is compaction keep or drop, what 005's census already gives and what a Deem arm adds.
  4. The keep or kill rule as checkable logic.
  5. The rollback sentence.
- **New information:** a slice for a reduction seam, or a 005 amendment in code terms.

#### swe-05: sk-prompt and sk-design routers as code
- **Wave:** W2
- **Maps to:** E, F
- **Open first:** `sk-prompt/SKILL.md:150-240`, `sk-design/sk-design-fundamentals/SKILL.md:170-220`, `sk-design/hub-router.json`, `.skilled/bin/compiled-route.cjs`, and grok-05 and grok-06 if they exist.
- **Questions:**
  1. Where does each router run as code, if anywhere? If only the model follows the pseudocode, is there a seam at all?
  2. If a compiled router serves these hubs, where would a classifier tie-break sit, following R1's census-first design?
  3. How many scenarios tie within `AMBIGUITY_DELTA = 1`? Count them from the scenario files.
  4. Functions, tests and LOC for the smallest offline arm.
  5. What stays today's behavior with neither backend.
- **New information:** whether these routers are code, a tie count and a slice.

#### swe-06: The best validator residue as a slice
- **Wave:** W2
- **Maps to:** D
- **Open first:** swe-02, deepseek-03 and mimo-02 if they exist, the validator the residue belongs to, and BASE2's R20 and R22.
- **Questions:**
  1. Pick the residue with the best count, and design a sibling script that judges it without editing the validator.
  2. The label schema and the scorer for precision and recall.
  3. The two-backend probe, the skip lines and the output with neither backend.
  4. Test cases, LOC and placement.
  5. How it differs from R20 and R22, or which of them it should absorb.
- **New information:** a validator-residue slice with its labels, or a merge with R20 or R22 argued from code.

#### glm-02: The smallest `cli-classifier` hub
- **Wave:** W2 (glm iteration 2)
- **Maps to:** G, A
- **Open first:**
  - The newest iteration of each of the four siblings
  - `JEV/SKILL.md`, `JEV/mode-registry.json`, `JEV/hub-router.json`, `JEV/ROUTER.md`
  - `.skilled/repo-rules/skill-hub-routing.md`, `DOC/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`
  - The parent goal's D2
- **Questions:**
  1. The parent requires a `cli-classifier` hub holding `cli-jev` and `cli-deem`. What is the least it must contain to pass the parent-hub checks? Count files.
  2. Which files, modes, shared helpers or abstractions proposed by siblings go beyond that, and which current requirement does each serve?
  3. Is moving `cli-jev` under the hub worth its blast radius now, or can the hub start with `cli-deem` and move `cli-jev` later? Count the references a move touches.
  4. Which sibling proposal is a wrapper that only forwards arguments?
  5. Name the shape you would ship and its kill criterion.
- **New information:** a minimum hub shape with counts, or a sibling proposal refuted by a repo rule.

#### glm-03: Against context-reduction features
- **Wave:** W2 (glm iteration 3)
- **Maps to:** C
- **Open first:** the newest sibling iterations on question C (mimo-01, mimo-04, deepseek-04, swe-03, swe-04 and grok-03, whichever exist), `ROUND1/context/repo-rules-digest.md` sections 3 and 4, and `.skilled/repo-rules/prevent-overengineering.md`.
- **Questions:**
  1. Run every question-C proposal so far through Q1 to Q15 and the red flags. Which fail, and on which question?
  2. Which savings claims rest on estimates rather than counts?
  3. Which proposals add a daemon, a hook or a new file for a saving below a stated threshold? Propose the threshold.
  4. Which cheaper fix without a model would get most of the saving, such as a smaller doc or a better router rule?
  5. The one question-C proposal that survives your objections.
- **New information:** a checklist result per proposal, or a fix without a model with its saving.

### W3: new skills and workflows with measured value (iterations 7 and 8, glm iteration 4)

#### grok-07: One interface for a hosted and a local classifier: outside patterns
- **Wave:** W3
- **Maps to:** G, A
- **Open first:** `DEEM/serve/README.md:173-208`, `DEEM/serve/deem_mcp.py`, `R/jev-cli-main/src/provider.ts`, `JEVSRC:20-40`, the hub files of `.skilled/skills/cli-external-orchestration/`, glm-02 and the newest sibling iterations.
- **Questions:**
  1. How do the vendored clients switch between a hosted and a self-hosted endpoint: a base URL, a provider table or a translation layer? Cite each.
  2. Which pattern fits two transports that share a request shape, and which fits two whose shapes differ?
  3. What should a caller here name: a backend, a transport or a capability? Argue from how `cli-external-orchestration` names its modes.
  4. What measured value must the hub show before it holds more than its two transports?
  5. Anti-patterns, with evidence.
- **New information:** an outside packaging pattern mapped onto the hub shape, with cited code.

#### grok-08: Deem's Tare harness as a measurement pattern here
- **Wave:** W3
- **Maps to:** G, H
- **Open first:** `DEEM/eval/tare/README.md`, `metrics.py`, `probes.py`, `split.py`, BASE2's R1 keep rule and C1, and `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:22-28`, `:102-108`.
- **Questions:**
  1. How do Tare's conditioned flip gate and paired-accuracy probes compare with the aggregate flip rate this repository adopted for R1?
  2. Would a calibration check on a held-out split change any round-2 keep rule? Which, and how?
  3. Is a small local calibration workflow worth building, and what would it measure first?
  4. Which Tare metrics are specific to Deem and should not be copied?
  5. Adopt or anti-pattern, with the local number that decides.
- **New information:** a measurement pattern mapped onto an existing keep rule, with its code.

#### deepseek-07: Moving `cli-jev` under `cli-classifier`: the blast radius
- **Wave:** W3
- **Maps to:** G
- **Open first:** search results for `cli-jev` across `.skilled/`, `.claude/`, `.opencode/` and `.hermes/`, `JEV/graph-metadata.json`, `JEV/description.json`, `.skilled/repo-rules/skill-hub-routing.md` and the hub checks named in `JEV/mode-registry.json` under `enforcedBy`.
- **Questions:**
  1. Count and list every reference to `cli-jev` by kind: routing, the advisor graph, hooks and dispatch guards, docs, tests and other runtimes' skill mirrors.
  2. Which are frozen contracts, and who owns each?
  3. What breaks between the move and the regeneration: the advisor, compiled routing or the dispatch guard's rules?
  4. The order of a safe move, each step with its rollback.
  5. Is an alias from `cli-jev` to its new place enough for callers?
- **New information:** a counted blast radius for the move.

#### deepseek-08: A live Deem seam: warm or cold, and the precompute route
- **Wave:** W3
- **Maps to:** C, G
- **Open first:** `.skilled/bin/lib/model-server-supervision.cjs`, the `precompute` trigger in `R/jev-cli-main/plugin/hooks/types/claude-code.d.ts` (BASE2 C16 cites `:7278-7285`), `SSK/runtime/hooks/claude/compact-inject.ts`, deepseek-02 and deepseek-04, and `LOCAL:40-53`.
- **Questions:**
  1. If one live seam survives, does it need a warm server? `LOCAL` measures a 3,368 MB footprint and about 10 s from start to healthy. What does keeping it warm cost while idle, and what does a cold start cost a hook?
  2. Could the `precompute` trigger or a background pass move the call off the critical path even though the call is fast? Cite the trigger's contract.
  3. What happens on this Mac when the server was stopped, evicted or mid-update and a hook calls it?
  4. The exact lines the main AI sees with no backend, a cold backend and a backend on an unexpected model id.
  5. The kill criterion for any live form.
- **New information:** a lifecycle design for a live seam with its failure lines, using the measured footprint and startup time.

#### mimo-07: The operator's view of two backends, and one measured workflow
- **Wave:** W3
- **Maps to:** G, A
- **Open first:** the newest sibling iterations on the hub and the gate, `.skilled/commands/doctor/`, the ALWAYS section of `JEV/cli-usage/SKILL.md` and `LOCAL:55-61`.
- **Questions:**
  1. What does the operator type to start, check, update, roll back and stop Deem, and to see which backend and which model commit a feature used?
  2. Where should the two-backend status print: a doctor check, a session line or nowhere until asked?
  3. Pick one new workflow from the sibling proposals, and give its metric, counted baseline and harness.
  4. The operator labor to adopt it, in minutes.
  5. The default for each switch.
- **New information:** an operator-facing contract for two backends and one measured workflow.

#### mimo-08: A validator-judgment workflow, measured
- **Wave:** W3
- **Maps to:** D, G
- **Open first:** mimo-02, swe-02, swe-06 and deepseek-03 if they exist.
- **Questions:**
  1. Take the top residue and plan its labels: how many, drawn how, labeled by whom and in how many minutes.
  2. The metric: precision at the recall the author needs, against the baseline of a reader alone.
  3. The saving in AI passes per week at that precision.
  4. What the author sees and does with a flag.
  5. The pre-registered stop rule.
- **New information:** a labeled-set design with its labor and stop rule.

#### swe-07: `cli-classifier` as files
- **Wave:** W3
- **Maps to:** G, A
- **Open first:** glm-02 and deepseek-07 if they exist, the whole `JEV/` hub, the hub files of `.skilled/skills/sk-design/` and `.skilled/skills/cli-external-orchestration/`, and `DOC/sk-create-skill/scripts/ci-skill-root-metadata.cjs` and `validate_skill_package.py`.
- **Questions:**
  1. The file tree of the smallest hub with two transports, each file with its purpose, including where `cli-deem`'s install, start, health, update and rollback commands live.
  2. The `mode-registry.json` and `hub-router.json` entries for both transports, written out.
  3. What the parent-hub checks and the skill package validator require, and which proposed file they would reject.
  4. The migration as commands, `git mv` first, then the regeneration steps.
  5. File count, LOC and the rollback sentence.
- **New information:** a concrete hub tree with registry entries checked against the validators.

#### swe-08: The two-backend probe: shared or duplicated
- **Wave:** W3
- **Maps to:** A, G
- **Open first:** the `spec.md` of `../002-advisor-jev-tiebreak-arm/`, `../003-goal-verifier-jev-shadow/`, `../005-compaction-recall-harness/` and `../006-goal-criteria-lint/`, BASE1 row 27 and deepseek-01 if it exists.
- **Questions:**
  1. How many certain callers of a two-backend probe exist after round 3's survivors? Count them by phase.
  2. The probe's contract: signature, return shape, cache, timeouts and skip lines for both backends.
  3. Row 27 said to extract a shared helper at the third certain caller. Is that caller now certain, and where would the helper live?
  4. Test cases, including the stub backend and a key present for the wrong provider.
  5. LOC.
- **New information:** a caller count and a probe contract, or row 27 applied with evidence.

#### glm-04: Against validator, sk-prompt and sk-design classifiers
- **Wave:** W3 (glm iteration 4)
- **Maps to:** D, E, F
- **Open first:** the newest sibling iterations on questions D, E and F, `ROUND1/context/repo-rules-digest.md` sections 3 and 4, BASE1 rows 12, 21 and 24, and BASE2 row 63.
- **Questions:**
  1. Which proposals replace a repository fact or a validator verdict with a judgment?
  2. Which produce a report nobody reads?
  3. Which lack gold and cannot be measured before building?
  4. Which would be better solved by a docs or template fix than by a classifier?
  5. The one proposal that survives, with the result that would kill it.
- **New information:** a checklist result per question-D, E and F proposal.

### W4: cost, order and kill criteria (iterations 9 and 10, glm iteration 5)

Read all your own iterations and the newest iteration of each other lineage first.

#### grok-09: Which vendor claims the order still leans on
- **Wave:** W4
- **Maps to:** H
- **Open first:** your iterations 1 to 8, the newest sibling iterations, BASE2 sections 9 and 13, `DEEM/README.md`, both model cards and `LOCAL`.
- **Questions:**
  1. List every vendor claim the round-3 survivors depend on: the 0.8B's and the 9B's published accuracy, Jev's prices and latency and the `typesafe-sdk` compatibility claim. `LOCAL`'s speed and memory figures are measurements, not claims.
  2. For each, the local number that replaces it and who produces it.
  3. Which survivor falls if the 0.8B's accuracy on this repository's judgments lands far below its card's figure, or if an update moves its answers?
  4. Which Deem-dependent survivor should wait on a measured accuracy set rather than build on `LOCAL`'s speed alone?
  5. The contrarian kill criterion for each survivor.
- **New information:** a claim-to-local-number table for the survivors.

#### grok-10: If only one classifier phase ships
- **Wave:** W4
- **Maps to:** H
- **Open first:** your iterations, the newest sibling iterations, BASE2 section 13 and the parent goal's D2 and D3.
- **Questions:**
  1. If only one new phase ships, which one, and why, from code and counts?
  2. Which first-slice result would stop Deem entirely, and which would stop Jev's remaining arms?
  3. Where do you disagree with the sibling orders, and on what evidence?
  4. What the operator decides, and when.
  5. The order in one line.
- **New information:** an order argued from round-3 evidence.

#### deepseek-09: Failure modes and kill criteria on both backends
- **Wave:** W4
- **Maps to:** H
- **Open first:** your iterations, the newest sibling iterations and BASE2 section 11's shared gate contract.
- **Questions:**
  1. For each survivor, what prints and what persists on Jev exit 3, exit 4, a malformed answer and the wrong package on PATH, and on a refused Deem connection, the stub backend, a 400, a 500 and a slow cold start.
  2. Which failure could change today's behavior with neither backend, and which test proves it cannot?
  3. Which survivors touch a frozen contract? Name owners and callers.
  4. The kill criterion per survivor, as a printed line.
  5. What happens when the two backends disagree on the same judgment?
- **New information:** a two-backend failure table.

#### deepseek-10: The two-backend amendments to 002, 003, 005 and 006
- **Wave:** W4
- **Maps to:** H
- **Open first:** the `spec.md`, `plan.md` and `tasks.md` of `../002-advisor-jev-tiebreak-arm/`, `../003-goal-verifier-jev-shadow/`, `../005-compaction-recall-harness/` and `../006-goal-criteria-lint/`, plus deepseek-01 and swe-08.
- **Questions:**
  1. For each phase, the exact lines that gate on Jev alone today, with `file:line`.
  2. The replacement text for the two-backend gate, and its skip lines.
  3. Which phase's keep rule changes when Deem is the backend: latency, calibration or cost lines?
  4. The build order by dependency, with the rollback per step.
  5. Which phase should not take Deem at all, and why?
- **New information:** line-level amendments for all four phases.

#### mimo-09: Measurement-first order and operator labor
- **Wave:** W4
- **Maps to:** H
- **Open first:** your iterations, the newest sibling iterations and BASE2 section 9.
- **Questions:**
  1. Which slice produces a usable number soonest, and what does the operator read?
  2. Operator minutes per phase, and which phase fails if the operator gives none.
  3. Savings in context tokens, AI passes and minutes per week for each survivor, from counts.
  4. Which measurements must come first, for example `LOCAL` before any Deem arm and 002's latency record before any live form?
  5. The order.
- **New information:** labor and savings per phase from round-3 counts.

#### mimo-10: Kill criteria as printed numbers
- **Wave:** W4
- **Maps to:** H
- **Open first:** your iterations, the newest sibling iterations and `LOCAL`.
- **Questions:**
  1. Deem's own kill lines: health, p95, memory and agreement with Jev.
  2. One kill line per survivor.
  3. The one-line report each survivor prints.
  4. Which kill lines can be evaluated today with zero calls?
  5. Where a round-2 kill line changes.
- **New information:** printed kill lines for Deem and each survivor.

#### swe-09: Build order in code
- **Wave:** W4
- **Maps to:** H
- **Open first:** your iterations, the newest sibling iterations, BASE2 section 13 and the four Planned phases.
- **Questions:**
  1. The ordered phases, each with files, functions, LOC, tests, its switch and its rollback.
  2. The amendments to 002, 003, 005 and 006 in code terms.
  3. What becomes shared code, and when.
  4. The code-level failure modes and their printed lines.
  5. Total LOC and file count.
- **New information:** a size or dependency that changes the order.

#### swe-10: The first PR-sized slice
- **Wave:** W4
- **Maps to:** H
- **Open first:** your iterations and swe-09.
- **Questions:**
  1. The first PR: files, functions, tests and its observable check.
  2. Its kill rule in code.
  3. What it proves about both backends with neither available.
  4. The checklist a reviewer runs.
  5. The rollback.
- **New information:** a PR-sized slice concrete enough to start.

#### glm-05: What not to build, round 3
- **Wave:** W4 (glm iteration 5)
- **Maps to:** H, B
- **Open first:** all your iterations, the newest iteration of every sibling, and What Not To Build in BASE1 and BASE2.
- **Questions:**
  1. Consolidate every round-3 proposal you would drop, with its reason, checklist question and evidence.
  2. Which baseline drops does the flip set reopen wrongly?
  3. The smallest program that remains.
  4. The kill criterion for that program.
  5. What the operator should decline first.
- **New information:** a round-3 drop list with evidence.

---

## 6. Coverage

### Angles to questions

| Angle | Wave | A Deem | B drops | C context | D validators | E sk-prompt | F sk-design | G discovery | H order |
|---|---|---|---|---|---|---|---|---|---|
| grok-01 | W1 | x | | | | | | | |
| grok-02 | W1 | x | | | | | | x | |
| grok-03 | W1 | | x | x | | | | | |
| grok-04 | W2 | | x | | | | | | |
| grok-05 | W2 | | | | | x | | | |
| grok-06 | W2 | | | | | | x | | |
| grok-07 | W3 | x | | | | | | x | |
| grok-08 | W3 | | | | | | | x | x |
| grok-09 | W4 | | | | | | | | x |
| grok-10 | W4 | | | | | | | | x |
| deepseek-01 | W1 | x | | | | | | | x |
| deepseek-02 | W1 | x | | | | | | x | |
| deepseek-03 | W1 | | | | x | | | | |
| deepseek-04 | W2 | | x | x | | | | | |
| deepseek-05 | W2 | | x | | | | | | |
| deepseek-06 | W2 | x | | | | | | | |
| deepseek-07 | W3 | | | | | | | x | |
| deepseek-08 | W3 | | | x | | | | x | |
| deepseek-09 | W4 | | | | | | | | x |
| deepseek-10 | W4 | | | | | | | | x |
| mimo-01 | W1 | | | x | | | | | x |
| mimo-02 | W1 | | | | x | | | | |
| mimo-03 | W1 | x | | | | | | | x |
| mimo-04 | W2 | | | x | | | | | x |
| mimo-05 | W2 | | | | | x | | | |
| mimo-06 | W2 | | | | | | x | | |
| mimo-07 | W3 | x | | | | | | x | |
| mimo-08 | W3 | | | | x | | | x | |
| mimo-09 | W4 | | | | | | | | x |
| mimo-10 | W4 | | | | | | | | x |
| swe-01 | W1 | x | | | | | | x | |
| swe-02 | W1 | | | | x | | | | |
| swe-03 | W1 | | | x | | | | | |
| swe-04 | W2 | | | x | | | | | |
| swe-05 | W2 | | | | | x | x | | |
| swe-06 | W2 | | | | x | | | | |
| swe-07 | W3 | x | | | | | | x | |
| swe-08 | W3 | x | | | | | | x | |
| swe-09 | W4 | | | | | | | | x |
| swe-10 | W4 | | | | | | | | x |
| glm-01 | W1 | x | x | | | | | | x |
| glm-02 | W2 | x | | | | | | x | |
| glm-03 | W2 | | | x | | | | | |
| glm-04 | W3 | | | | x | x | x | | |
| glm-05 | W4 | | x | | | | | | x |

### Lineages per question

| Question | Lineages | Angles |
|---|---|---|
| A, Deem on this Mac and `cli-deem` | all five | grok-01, grok-02, grok-07, deepseek-01, deepseek-02, deepseek-06, mimo-03, mimo-07, swe-01, swe-07, swe-08, glm-01, glm-02 |
| B, drops that flip | grok, deepseek, glm | grok-03, grok-04, deepseek-04, deepseek-05, glm-01, glm-05 |
| C, context reduction | all five | grok-03, deepseek-04, deepseek-08, mimo-01, mimo-04, swe-03, swe-04, glm-03 |
| D, validators | deepseek, mimo, swe, glm | deepseek-03, mimo-02, mimo-08, swe-02, swe-06, glm-04 |
| E, sk-prompt | grok, mimo, swe, glm | grok-05, mimo-05, swe-05, glm-04 |
| F, sk-design | grok, mimo, swe, glm | grok-06, mimo-06, swe-05, glm-04 |
| G, open discovery | all five | grok-02, grok-07, grok-08, deepseek-02, deepseek-07, deepseek-08, mimo-07, mimo-08, swe-01, swe-07, swe-08, glm-02 |
| H, order, savings, cost and kill criteria | all five | grok-08, grok-09, grok-10, deepseek-01, deepseek-09, deepseek-10, mimo-01, mimo-03, mimo-04, mimo-09, mimo-10, swe-09, swe-10, glm-01, glm-05 |

### Validator coverage (question D)

| Validator surface | Angles |
|---|---|
| `validate.sh` and every rule under `SSK/runtime/cli/rules/` | deepseek-03, mimo-02 |
| sk-doc validators: `validate_document.py`, `template-rules.json`, `quick_validate.py`, `validate_skill_package.py` | swe-02, swe-06 |
| DQI scoring (`extract_structure.py`, `calculate_dqi`) | swe-02 |
| HVR scoring (`hvr_scan.py`) | swe-02, mimo-02 |
| `check-goal.cjs` | deepseek-03 |
| Frontmatter (`check-frontmatter.sh` among the spec-kit rules, `frontmatter-version.mjs`, `check-frontmatter-versions.sh`) | deepseek-03, swe-02 |
| Command, skill and agent doc checks (`validate_document.py` document types, `validate_skill_package.py`) | swe-02 |
| The judgment calls left after a pass, and the precision a classifier reaches on them | mimo-02, mimo-08, swe-06, glm-04 |

### Required spreads

- **Wave-1 corroboration is possible on A, C and D.** Independent W1 angles cover A in all five lineages (grok-01, grok-02, deepseek-01, deepseek-02, mimo-03, swe-01 and glm-01), C in three (grok-03, mimo-01 and swe-03) and D in three (deepseek-03, mimo-02 and swe-02).
- **The `cli-deem` lifecycle has four lenses.** Install, start, health, update on a new Hugging Face commit and rollback are designed in deepseek-02 (W1) and swe-01 (W1), operated in mimo-07, placed in files in swe-07 and challenged in glm-01.
- **The reopened deadline drops have a measured number to meet.** Rows 1 and 5 are re-judged against `LOCAL`'s p95 in grok-04 and deepseek-04, their contracts checked in deepseek-05 and a warm or cold live form designed in deepseek-08.
- **The wire question has three independent readers.** grok-02 and swe-01 read it in W1, and deepseek-06 contests both from the failure side in W2.
- **The two-backend gate has one owner and three users.** deepseek-01 defines the Deem check, swe-08 turns it into a probe contract and deepseek-10 writes it into 002, 003, 005 and 006.
- **Every lineage ends on cost, order and kill criteria.** Each has W4 angles, and glm-05 closes the contrarian drop list.
