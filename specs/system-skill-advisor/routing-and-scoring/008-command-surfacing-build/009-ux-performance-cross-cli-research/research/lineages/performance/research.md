# Performance and cost of command surfacing — performance lineage synthesis

Detached research lineage `performance`, session `fanout-performance-1794523629654-v541y3`. Topic: what to improve in command surfacing after the planned phases 005 to 008, on the performance and cost angle: hook wall time cold and warm, daemon versus no-daemon paths, embedder cost and cold start, brief and command-read token cost, and caching or precompute. Every recommendation names the file it changes, the measured baseline and the check that proves it. Phases 005 to 008 are planned, not built; nothing below repeats them.

**Method and limits.** All numbers come from committed scratch files, source reads or a read-only local measurement. No runtime CLI was run, no process was started or killed, ollama was not touched, no holdout row was read. A number that could not be measured inside those rules is listed in §9 as a gap, not guessed. Tokens use the repository's own 4-characters-per-token estimate, the same one the renderer's cap uses.

---

## 1. Executive verdict

The command-surfacing design is cheap in tokens and expensive in process starts. The whole brief is 64 to 71 tokens; one started command's document is about 1,131 tokens at the median. Neither is the problem. The problem is that the Claude prompt path starts three Node processes before any scoring, and a measured bare Node start is 36.85 ms, so roughly 100 to 110 ms of the 205.09 ms median is process startup. Two of those three starts are removable without touching scoring: the delegated advisor-hook spawn in the four host-hook adapters, and the CLI spawn in the hook.

The one correctness risk this lineage found is cold start. The Claude shim gives the advisor child 2200 ms and Codex's adapter passes 2800 ms, while the CLI may wait 5000 ms for a cold daemon, so a cold start between those bounds fails open even though the CLI is still working. A session-start warm call removes it. The embedder has a milder cold tax: the model unloads after five minutes because the adapter sends no `keep_alive`, and the next prompt pays 271 to 277 ms instead of 6.57 ms. That fits phase 008's 750 ms deadline, so it is latency, not failure.

Caching and precompute are declined. The exact cache is a unique-prompt miss by construction, its field hit rate is unmeasurable because both telemetry surfaces are off by default, and a semantic cache would pay one embedding to decide a hit. Both vector sets are already precomputed. The only token guard worth building is a report of each command document's read cost.

## 2. Answers to key questions

- **KQ1 Where the ~205 ms goes and what can be removed:** answered. Three Node starts are about 100 to 110 ms of the median; the adapter spawn and the CLI spawn are each removable, taking Claude to about 131 ms (-36%).
- **KQ2 Token cost per prompt, session and started command:** answered. The brief is 64 to 71 tokens; a 40-prompt session is 466 to 734 tokens; one started command is about 1,131 tokens at the median and 3,143 at p95; the `ask` turn is the only material per-start cost. Token cost is not a constraint.
- **KQ3 Cold paths that exceed a hook budget and what removes the stall:** answered. A cold daemon start between 2.2 s (Claude) or 2.8 s (Codex) and 5 s fails open; a detached session-start warm call removes it. The cold embed at 271 to 277 ms fits the planned 750 ms deadline.
- **KQ4 Which cache or precompute pays:** answered. None of the proposed ones. The exact cache cannot be shown to hit, a semantic cache pays an embedding to decide, and both vector sets already exist.
- **KQ5 Which runtime architecture is cheapest:** answered. The three plugin runtimes (OpenCode, Pi, DSH) already run the advisor in the host process and pay one extra process; the four host-hook runtimes (Claude, Codex, Devin, Cursor) pay two, and both can be collapsed.

## 3. Baseline cost model

| Item | Measured | Source |
|---|---|---|
| Claude hook median / p95 | 205.09 ms / 261.92 ms (middle of three runs, 44 prompts) | `004-command-meaning-matching/scratch/hook-latency-after-3.json` |
| Bare `node -e 0` start | 36.85 ms median, 22.90 min, 47.31 max (n=15) | local read-only measurement |
| Advisor CLI call, warm | 62.7 to 71.3 ms (5 calls) | `008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:18` |
| Warm query embedding | 6.57 ms median, 10.99 ms p95 (30 calls) | same file, line 12 |
| Cold query embedding | 271 to 277 ms (operator reading), one CLI call 413 ms cold | `008-embedder-setup-and-cost/spec.md:130` |
| Model unload | 5-minute default, measured expiry 4 m 49 s later | same file, lines 36-38 |
| Model memory | 335,733,063 B loaded, 46,256 KB server, 352,144 KB runner | same file, lines 5-10 |
| Full brief | 257 chars = 64 tokens, 84% constant directive block | renderer run + `runtime/lib/render.ts:100` |
| Brief with phase 005 command head | 284 chars = 71 tokens | `005.../plan.md:71` |
| Command documents (44) | median 4,524 B (~1,131 t), p95 12,573 B (~3,143 t), max 13,682 B | `git ls-files` + stat |
| Policy mix | 20 start, 17 ask, 7 run | `006.../spec.md:94` |

## 4. Findings

1. **Three process starts per Claude prompt.** `bash -c` → spec-kit shim → advisor hook → CLI. Three measured starts are about 100 to 110 ms of the 205.09 ms median. [SOURCE: .claude/settings.json:149] [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:143] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:253]
2. **The CLI spawn is removable.** The hook could speak the existing JSON-RPC to the daemon in-process; the CLI stays for cold start and local fallback. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1326]
3. **Four host-hook runtimes share a three-process chain.** Codex, Devin and Cursor adapters `spawnSync` the same Claude advisor hook; only OpenCode, Pi and DSH import it in-process. [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/shared.js:54] [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:269]
4. **The cold-start caps disagree.** Claude's child budget is 2200 ms and its kill is 2500 ms; Codex's adapter passes 2800 ms under a 3 s host; the CLI waits up to 5000 ms. Devin and Cursor pass 10 s, so only Claude and Codex can fail open. A sandbox record already shows a 2508 ms fail-open. [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:137] [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js:12] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:34]
5. **SessionStart is the right warm point.** Claude's SessionStart group already runs eight adapters and none warms the advisor. [SOURCE: .claude/settings.json:143]
6. **The embedder never keeps the model loaded.** The adapter's request body has no `keep_alive`, so the five-minute default unload applies; the measured expiry confirms it. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:343] [SOURCE: 008.../scratch/measured-2026-11-12.txt:36]
7. **The 750 ms deadline should be an adapter timeout.** The adapter has an `AbortController` and an instance `timeoutMs`, but `getAdapter(name)` takes no options, so a wrapper race would abandon a live 5 s request. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:129] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/registry.ts:83]
8. **The p95 tail is not a cold model.** A cold call would push p95 toward 470 ms; the observed move was 30.6 ms, so it is bounded variance. [SOURCE: 008.../scratch/measured-2026-11-12.txt:12] [SOURCE: 008.../scratch/measured-2026-11-12.txt:45]
9. **The brief is not the token cost.** 257 chars, 64 tokens, 84% a constant block already suppressed after the first message. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:162] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:373]
10. **The command read is the token cost.** Median 4,524 B, p95 12,573 B; three starts cost 4.6 times a session's whole brief. [SOURCE: .skilled/commands/deep/research.md:1] [SOURCE: .skilled/commands/speckit/handoff.md:1]
11. **The `ask` turn is the per-start wall-time cost.** 17 of 44 rows are `ask`, and phase 007 counts states but not turns. [SOURCE: 006.../spec.md:94] [SOURCE: 007.../plan.md:68]
12. **No cache or precompute pays.** Exact cache is unique-prompt keyed with no field hit rate; a semantic cache pays an embedding; vectors are already built. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319]
13. **Performance does not explain the start-rate spread.** claude 3/12, codex 0/12, pi 0/12, devin 2/12, opencode 4/9, dsh 3/8 with one `COMMAND:` line, on hook paths of the same order. [SOURCE: 007.../scratch/runs-pre.jsonl:1]

## 5. Recommendations

Ordered by risk removed per unit of work. All are post-008 unless marked.

| # | Recommendation | Exact file(s) | Measurable gain | Verify |
|---|---|---|---|---|
| P1 | Warm the daemon at session start with one detached `advisor_status --warm-only` call | `.claude/settings.json` SessionStart group; `.codex/hooks.json` SessionStart; same surface for Devin/Cursor where a session event exists; document the pattern in `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` §2 | removes the only fail-open path: first-prompt p95 from the 2500 ms ceiling to the ~205 ms warm median on Claude, 2800 ms on Codex | measure a cold start first (§9), then a fresh-session `node 004-command-meaning-matching/scratch/hook-latency.mjs`; diagnostic `fail_open` count on first prompts = 0 |
| P2 | Import the advisor hook in-process in the four host adapters instead of `spawnSync` | `.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` (`runClaudeHookAdapter`), its Devin and Cursor siblings, and `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` (the shim) | one 36.85 ms start per prompt on Claude, Codex, Devin and Cursor; Pi's in-process path is the reference | each adapter's registration check plus the hook-latency probe; Claude median ≤168 ms |
| P3 | Speak the daemon JSON-RPC in-process from the hook and keep the CLI for cold start and fallback | `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` (new direct path), `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` unchanged as the entry | one 36.85 ms start per prompt on all six runtimes; with P2, Claude 205 → ~131 ms (-36%) | hook-latency probe median ≤135 ms, p95 ≤195 ms; the CLI fallback tests still pass |
| P4 | Add `keep_alive` to the query embed and warm the model once per session | `.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:343` (`/api/embed` and `/api/embeddings` bodies) plus an option on the factory in `shared/embeddings/registry.ts:83` | cold first call 271–277 ms → ~7 ms; one prompt per idle gap saves ~265 ms; holds ~335 MB while warm | `node .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs` after a 10-minute idle: `cold.firstCallMs` null and `/api/ps` lists the model |
| P5 | Thread the planned 750 ms prompt deadline into the adapter as a real timeout | `.skilled/skills/system-spec-kit/shared/embeddings/registry.ts:83` (options), `.skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts` (pass-through), `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:128` | the request aborts at 750 ms instead of 5 s, freeing the socket for the next prompt and reporting the right `disabledReason` | `tests/semantic-prompt-embedding-degrade.vitest.ts` 7 cases plus an abort-vs-race assertion |
| P6 | Report each command document's read cost and flag a `start` row above 8 KB | new `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/measure-command-read-cost.mjs`, wired into `capture-command-routing-baseline.mjs` | makes a future three-times-p95 document visible before it ships; today 5 of 44 exceed 8 KB and need a stated reason | run the script: 44 rows, median 4,524 B, p95 12,573 B, 5 over cap |

P4 and P5 are the two places where phase 008's plan is thinner than its intent: 008 keeps the model cold by design and aims to put the deadline in the wrapper. P2, P3 and P6 are untouched by 005 to 008.

## 6. Declined directions

| Direction | Why declined |
|---|---|
| Semantic or near-duplicate prompt cache | Pays one 6.57 ms embedding to decide a hit, then saves only the scorer work, and a wrong hit changes the route. |
| Persist the exact cache across daemon restarts | The daemon recycles on build staleness, not per prompt; the saving is rare. |
| Any new command or skill vector precompute | 45 command and 14 skill vectors already exist; the brief's constant block is already deduped. |
| Trim the brief head or directive block | At most 54 tokens per session; the block is suppressed after the first message. |
| A per-prompt token budget | The 80-token cap binds and the measured brief is 64 tokens. |
| A longer cold timeout | Trades a fast fail-open for a 5 s first-prompt stall. |
| A performance fix for the uneven start rates | The hook cost is the same order on every runtime; the spread is behavioural and belongs to the cross-CLI lineage. |

## 7. Per-runtime cost table

| Runtime | Processes per prompt | Host / adapter budget | Removable starts | Cold-daemon fail-open risk |
|---|---|---|---|---|
| Claude Code | 3 (shim, advisor hook, CLI) | 2500 ms shim, 3 s host | 2 | Yes, 2.2 s to 5 s |
| Codex | 3 (adapter, advisor hook, CLI) | 2800 ms adapter, 3 s host | 2 | Yes, 2.8 s to 5 s |
| Devin | 3 (adapter, advisor hook, CLI) | 10 s | 2 | No, 5 s fits |
| Cursor | 3 (adapter, advisor hook, CLI) | 10 s | 2 | No; delivery version-dependent |
| OpenCode | 2 (host plugin, CLI) | 2500 ms bridge default | 1 | No |
| Pi | 2 (host extension, CLI) | 2500 ms + margin | 1 | No |
| DSH | 2 (host plugin, CLI) | in-process | 1 | No |

## 8. What this means for the build

None of the six recommendations blocks phases 005 to 008, and none changes the recommendation content, the policy or the meaning lane. If the build wants one performance item before the behaviour proof, P1 is the one: it removes the only path where a person sees no brief at all. If it wants one after, P2+P3 is the largest single win at about 74 ms per Claude prompt, and it is the same change in four adapters plus one shim.

## 9. Measurement gaps

- **Cold daemon start time is unmeasured.** Procedure: a sandbox socket directory and a sandbox database, as the launcher tests already use, five timed starts to socket-ready, then a `hook-latency.mjs` run against a cold socket. Never the live daemon. This number bounds P1's gain and is the first task of any phase that takes P1.
- **No field cache hit rate.** Diagnostic persistence needs `SKILL_ADVISOR_DEBUG` and the cache counters need the metrics flag; this checkout has no persisted diagnostics file. If a future phase wants to revisit caching, enabling the counters for one week is the prerequisite, not a code change.
- **No tokenizer.** Tokens use the renderer's own 4-characters-per-token estimate; good enough for a 4x decision, not for billing.
- **No cold-model hook run.** The operator reading (271 to 277 ms) stands in; phase 008's T033 script run after a 5-minute unload replaces it.

## 10. Convergence report

- Stop reason: `max_iterations` (5 of 5; the last ratio 0.45 stayed above the 0.05 threshold, so convergence did not fire)
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio trend: 0.90, 0.85, 0.90, 0.85, 0.45 (average 0.79)
- Sources: 35 code references, 9 other; no single-weak-source finding
- Divergence: none; the lineage stayed on the performance angle and noted cross-angle facts only briefly

## 11. References

Iteration narratives: `iterations/iteration-001.md` to `iterations/iteration-005.md`. Deltas: `deltas/iter-001.jsonl` to `deltas/iter-005.jsonl`. Reducer-owned dashboard and registry: `deep-research-dashboard.md`, `findings-registry.json`. Steer rulings: `steer.md`.

Primary evidence: `.claude/settings.json:143-160`; `.skilled/skills/system-spec-kit/runtime/dist/hooks/{claude,codex}/user-prompt-submit.js` and `codex/shared.js`; `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`; `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`; `.skilled/skills/system-skill-advisor/runtime/lib/{render,prompt-cache,metrics}.ts`; `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`; `.skilled/skills/system-spec-kit/shared/embeddings/{adapters/ollama.ts,registry.ts}`; `004-command-meaning-matching/scratch/hook-latency-*.json`; `008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt`; `007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`.
