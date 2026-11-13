# Deep Research Strategy - performance lineage

## 2. TOPIC
Performance and cost of command surfacing after the planned phases 005 to 008: where Claude hook wall time goes, what the brief and a started command cost in tokens, which cold-start path can exceed a runtime hook budget, and which caching or precompute change pays for itself across claude, codex, opencode, pi, devin and dsh.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Where does the ~205 ms Claude hook wall time go, and which part can be removed without changing the recommendation?
- [x] What does command surfacing cost in tokens per prompt, per session and per started command, and where is the largest avoidable cost?
- [x] Which cold-start paths (daemon, embedder, first prompt of a session) can exceed the runtime's hook budget, and what removes the stall?
- [x] Which caching or precompute change pays for itself across the six CLIs, and which does not?
- [x] Which per-runtime architecture spends the least per prompt, and what should the other runtimes copy?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing skill scoring, thresholds or the meaning bar. Those are frozen by phase 004 and the parent decision record.
- Re-recommending anything phases 005 to 008 already plan: recommendation fields and brief head, Gate 2 binding and pointers, per-runtime behaviour proof, embedder visibility, the 750 ms prompt deadline, the doctor routes and the install guide text.
- Running any runtime CLI, pi, ollama lifecycle control, process kills, the full vitest suite, or a git write.
- Reading holdout rows of command-prompts.jsonl or any corpus file with a holdout split.

---

## 5. STOP CONDITIONS
- Five iterations, or legal convergence after the three-iteration floor.
- Every recommendation names the exact file it changes, a measured baseline and a verification command.
- A measurement that the hard rules forbid is recorded as a gap, never guessed.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Where does the ~205 ms Claude hook wall time go, and which part can be removed without changing the recommendation?
- What does command surfacing cost in tokens per prompt, per session and per started command, and where is the largest avoidable cost?
- Which cold-start paths (daemon, embedder, first prompt of a session) can exceed the runtime's hook budget, and what removes the stall?
- Which caching or precompute change pays for itself across the six CLIs, and which does not?
- Which per-runtime architecture spends the least per prompt, and what should the other runtimes copy?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- measuring a bare Node start on the same machine turned a plausible "startup is slow" story into a quantified share of the measured median. Reading both sides of the shim boundary found a concrete cap mismatch that no phase plan mentions. (iteration 1)
- pricing the cold call against the deadline, rather than against zero, separated a latency tax from a failure. Reading the adapter's abort path turned 008's deadline from a policy into a mechanism with a concrete injection point. (iteration 2)
- rendering the real brief instead of estimating it produced exact numbers and killed a plausible but false optimization axis. Measuring the command documents turned "a command read" into a distribution with a p95 and a top five. (iteration 3)
- counting processes from the registrations rather than from documentation found that Codex, Devin and Cursor share the Claude three-process chain, which widens one fix from one runtime to four. (iteration 4)
- auditing the four plans line by line turned "probably not planned" into a citable overlap result, including the one place where 008 explicitly leaves the model cold. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the per-segment split cannot be closed without running the live hook, which would write diagnostics outside this lineage. The honest ceiling is "three measured starts plus one measured CLI call", not a profiler trace. (iteration 1)
- the tail could not be attributed to a single cause without a profiler, and the honest result is that it is too small to chase. Saying so is more useful than inventing a cause. (iteration 2)
- no tokenizer exists, so the numbers carry the renderer's own estimate. That is acceptable for a 4x decision but not for a billing claim, and it is stated. (iteration 3)
- the cache hit-rate question cannot be answered because both telemetry surfaces are off by default. Reporting that as the finding is more useful than an assumed hit rate. (iteration 4)
- the aggregate gain cannot be stated as a measured end-to-end number without the very code changes it proposes. It is stated as a sum of measured parts, which is the honest ceiling. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A per-prompt token budget mechanism. The 80-token cap already binds and the measured brief is 64 tokens. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A per-prompt token budget mechanism. The 80-token cap already binds and the measured brief is 64 tokens.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-prompt token budget mechanism. The 80-token cap already binds and the measured brief is 64 tokens.

### A performance explanation for the uneven start rates across runtimes. The same hook cost applies to every runtime and the spread is behavioural. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A performance explanation for the uneven start rates across runtimes. The same hook cost applies to every runtime and the spread is behavioural.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A performance explanation for the uneven start rates across runtimes. The same hook cost applies to every runtime and the spread is behavioural.

### A semantic or near-duplicate prompt cache. It pays one embedding to decide a hit and risks a wrong recommendation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A semantic or near-duplicate prompt cache. It pays one embedding to decide a hit and risks a wrong recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A semantic or near-duplicate prompt cache. It pays one embedding to decide a hit and risks a wrong recommendation.

### Any further cache or precompute project. The evidence does not support a payoff and the telemetry needed to justify one is off by default. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Any further cache or precompute project. The evidence does not support a payoff and the telemetry needed to justify one is off by default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any further cache or precompute project. The evidence does not support a payoff and the telemetry needed to justify one is off by default.

### Any new precompute of command or skill vectors. Both are already built and the brief's constant block is already deduped. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Any new precompute of command or skill vectors. Both are already built and the brief's constant block is already deduped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any new precompute of command or skill vectors. Both are already built and the brief's constant block is already deduped.

### Caching rendered briefs to save tokens. Rendering costs well under a millisecond and tokens are charged for context, not render time. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Caching rendered briefs to save tokens. Rendering costs well under a millisecond and tokens are charged for context, not render time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Caching rendered briefs to save tokens. Rendering costs well under a millisecond and tokens are charged for context, not render time.

### Cold daemon start remains unmeasured inside the hard rules. Starting or stopping the live daemon is out of scope, and no existing packet records the number. The procedure is named instead of guessed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Cold daemon start remains unmeasured inside the hard rules. Starting or stopping the live daemon is out of scope, and no existing packet records the number. The procedure is named instead of guessed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cold daemon start remains unmeasured inside the hard rules. Starting or stopping the live daemon is out of scope, and no existing packet records the number. The procedure is named instead of guessed.

### Following the reducer's p95-tail pointer again. Iteration 2 answered it with a bounded variance claim; re-investigating it would repeat exhausted work. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Following the reducer's p95-tail pointer again. Iteration 2 answered it with a bounded variance claim; re-investigating it would repeat exhausted work.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Following the reducer's p95-tail pointer again. Iteration 2 answered it with a bounded variance claim; re-investigating it would repeat exhausted work.

### No field cache hit rate exists to report. The diagnostics and metrics surfaces are opt-in and this checkout has no persisted diagnostics file, so the hit-rate question is closed as unmeasured rather than answered with a guess. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No field cache hit rate exists to report. The diagnostics and metrics surfaces are opt-in and this checkout has no persisted diagnostics file, so the hit-rate question is closed as unmeasured rather than answered with a guess.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No field cache hit rate exists to report. The diagnostics and metrics surfaces are opt-in and this checkout has no persisted diagnostics file, so the hit-rate question is closed as unmeasured rather than answered with a guess.

### No live cold-daemon measurement was taken. Starting or stopping the advisor daemon writes outside this lineage and the hard rules forbid process control. The cap mismatch in finding 3 is read from source and corroborated by an existing sandbox record, and the missing number is recorded as a gap with its verification path: a sandbox socket and DB, as the launcher tests already do, then `hook-latency.mjs` once cold. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No live cold-daemon measurement was taken. Starting or stopping the advisor daemon writes outside this lineage and the hard rules forbid process control. The cap mismatch in finding 3 is read from source and corroborated by an existing sandbox record, and the missing number is recorded as a gap with its verification path: a sandbox socket and DB, as the launcher tests already do, then `hook-latency.mjs` once cold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No live cold-daemon measurement was taken. Starting or stopping the advisor daemon writes outside this lineage and the hard rules forbid process control. The cap mismatch in finding 3 is read from source and corroborated by an existing sandbox record, and the missing number is recorded as a gap with its verification path: a sandbox socket and DB, as the launcher tests already do, then `hook-latency.mjs` once cold.

### No live idle-and-reload measurement was taken. Forcing the model to unload needs a 5-minute wait with no prompt or an ollama lifecycle action, and the steer forbids touching ollama. The measured `expires_at` plus the adapter's missing `keep_alive` is the evidence; the live check is named in the recommendation's verification. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No live idle-and-reload measurement was taken. Forcing the model to unload needs a 5-minute wait with no prompt or an ollama lifecycle action, and the steer forbids touching ollama. The measured `expires_at` plus the adapter's missing `keep_alive` is the evidence; the live check is named in the recommendation's verification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No live idle-and-reload measurement was taken. Forcing the model to unload needs a 5-minute wait with no prompt or an ollama lifecycle action, and the steer forbids touching ollama. The measured `expires_at` plus the adapter's missing `keep_alive` is the evidence; the live check is named in the recommendation's verification.

### No per-start token measurement exists in any phase packet. Phase 007 measures whether a command starts, never what the start costs. The doc-size measurement here stands in for it; a live token count from a started session would need a runtime run, which the steer forbids. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No per-start token measurement exists in any phase packet. Phase 007 measures whether a command starts, never what the start costs. The doc-size measurement here stands in for it; a live token count from a started session would need a runtime run, which the steer forbids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No per-start token measurement exists in any phase packet. Phase 007 measures whether a command starts, never what the start costs. The doc-size measurement here stands in for it; a live token count from a started session would need a runtime run, which the steer forbids.

### Persisting the exact cache across daemon restarts. The daemon recycles on build staleness, not per prompt, so the saving is rare. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Persisting the exact cache across daemon restarts. The daemon recycles on build staleness, not per prompt, so the saving is rare.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Persisting the exact cache across daemon restarts. The daemon recycles on build staleness, not per prompt, so the saving is rare.

### Preloading the model once at daemon start *instead of* a keep-alive. A preload is itself a cold call, and the server still unloads after five idle minutes, so a session that pauses mid-way pays the tax anyway. Keep-alive plus a session-start warm covers both. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Preloading the model once at daemon start *instead of* a keep-alive. A preload is itself a cold call, and the server still unloads after five idle minutes, so a session that pauses mid-way pays the tax anyway. Keep-alive plus a session-start warm covers both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Preloading the model once at daemon start *instead of* a keep-alive. A preload is itself a cold call, and the server still unloads after five idle minutes, so a session that pauses mid-way pays the tax anyway. Keep-alive plus a session-start warm covers both.

### Raising the shim timeout to the CLI's 5000 ms cold wait. It would trade a fast fail-open for a 5 s stall on the first prompt, which is worse for the person than a brief that arrives on the second prompt. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Raising the shim timeout to the CLI's 5000 ms cold wait. It would trade a fast fail-open for a 5 s stall on the first prompt, which is worse for the person than a brief that arrives on the second prompt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising the shim timeout to the CLI's 5000 ms cold wait. It would trade a fast fail-open for a 5 s stall on the first prompt, which is worse for the person than a brief that arrives on the second prompt.

### Re-opening the brief's token budget. The measured brief is below the cap and the constant block is already suppressed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-opening the brief's token budget. The measured brief is below the cap and the constant block is already suppressed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening the brief's token budget. The measured brief is below the cap and the constant block is already suppressed.

### Recommending a blanket longer deadline to absorb a cold load. It would spend the hook budget on a call that already fits inside 750 ms. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Recommending a blanket longer deadline to absorb a cold load. It would spend the hook budget on a call that already fits inside 750 ms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending a blanket longer deadline to absorb a cold load. It would spend the hook budget on a call that already fits inside 750 ms.

### Replacing the exact prompt cache with a longer TTL as a first fix. The cache is process-local and keyed on the exact prompt, so unique prompts miss regardless of TTL; the lever is process count, not TTL. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Replacing the exact prompt cache with a longer TTL as a first fix. The cache is process-local and keyed on the exact prompt, so unique prompts miss regardless of TTL; the lever is process count, not TTL.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing the exact prompt cache with a longer TTL as a first fix. The cache is process-local and keyed on the exact prompt, so unique prompts miss regardless of TTL; the lever is process count, not TTL.

### Treating all six runtimes as one cold-start risk. Only Claude and Codex have a budget tighter than the CLI's cold wait. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating all six runtimes as one cold-start risk. Only Claude and Codex have a budget tighter than the CLI's cold wait.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all six runtimes as one cold-start risk. Only Claude and Codex have a budget tighter than the CLI's cold wait.

### Treating the brief length as the first performance lever. The measured full brief is about 85 tokens and a reduced head about 17 tokens, while one command document read costs about 1,131 tokens at the median. Trimming the brief is noise beside the document read; that comparison moves to iteration 2. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the brief length as the first performance lever. The measured full brief is about 85 tokens and a reduced head about 17 tokens, while one command document read costs about 1,131 tokens at the median. Trimming the brief is noise beside the document read; that comparison moves to iteration 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the brief length as the first performance lever. The measured full brief is about 85 tokens and a reduced head about 17 tokens, while one command document read costs about 1,131 tokens at the median. Trimming the brief is noise beside the document read; that comparison moves to iteration 2.

### Treating the p95 tail as an embedding-lane regression to be engineered away. Its absolute size is tens of milliseconds and its cause is variance, not a cold branch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the p95 tail as an embedding-lane regression to be engineered away. Its absolute size is tens of milliseconds and its cause is variance, not a cold branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the p95 tail as an embedding-lane regression to be engineered away. Its absolute size is tens of milliseconds and its cause is variance, not a cold branch.

### Trimming the brief head or the directive block as a token saving. The head is 41 characters and the block is already suppressed on repeats; the ceiling is 54 tokens per session. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Trimming the brief head or the directive block as a token saving. The head is 41 characters and the block is already suppressed on repeats; the ceiling is 54 tokens per session.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trimming the brief head or the directive block as a token saving. The head is 41 characters and the block is already suppressed on repeats; the ceiling is 54 tokens per session.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- No live cold-daemon measurement was taken. Starting or stopping the advisor daemon writes outside this lineage and the hard rules forbid process control. The cap mismatch in finding 3 is read from source and corroborated by an existing sandbox record, and the missing number is recorded as a gap with its verification path: a sandbox socket and DB, as the launcher tests already do, then `hook-latency.mjs` once cold. (iteration 1)
- Raising the shim timeout to the CLI's 5000 ms cold wait. It would trade a fast fail-open for a 5 s stall on the first prompt, which is worse for the person than a brief that arrives on the second prompt. (iteration 1)
- Replacing the exact prompt cache with a longer TTL as a first fix. The cache is process-local and keyed on the exact prompt, so unique prompts miss regardless of TTL; the lever is process count, not TTL. (iteration 1)
- Treating the brief length as the first performance lever. The measured full brief is about 85 tokens and a reduced head about 17 tokens, while one command document read costs about 1,131 tokens at the median. Trimming the brief is noise beside the document read; that comparison moves to iteration 2. (iteration 1)
- No live idle-and-reload measurement was taken. Forcing the model to unload needs a 5-minute wait with no prompt or an ollama lifecycle action, and the steer forbids touching ollama. The measured `expires_at` plus the adapter's missing `keep_alive` is the evidence; the live check is named in the recommendation's verification. (iteration 2)
- Preloading the model once at daemon start *instead of* a keep-alive. A preload is itself a cold call, and the server still unloads after five idle minutes, so a session that pauses mid-way pays the tax anyway. Keep-alive plus a session-start warm covers both. (iteration 2)
- Recommending a blanket longer deadline to absorb a cold load. It would spend the hook budget on a call that already fits inside 750 ms. (iteration 2)
- Treating the p95 tail as an embedding-lane regression to be engineered away. Its absolute size is tens of milliseconds and its cause is variance, not a cold branch. (iteration 2)
- A per-prompt token budget mechanism. The 80-token cap already binds and the measured brief is 64 tokens. (iteration 3)
- Caching rendered briefs to save tokens. Rendering costs well under a millisecond and tokens are charged for context, not render time. (iteration 3)
- Following the reducer's p95-tail pointer again. Iteration 2 answered it with a bounded variance claim; re-investigating it would repeat exhausted work. (iteration 3)
- No per-start token measurement exists in any phase packet. Phase 007 measures whether a command starts, never what the start costs. The doc-size measurement here stands in for it; a live token count from a started session would need a runtime run, which the steer forbids. (iteration 3)
- Trimming the brief head or the directive block as a token saving. The head is 41 characters and the block is already suppressed on repeats; the ceiling is 54 tokens per session. (iteration 3)
- A semantic or near-duplicate prompt cache. It pays one embedding to decide a hit and risks a wrong recommendation. (iteration 4)
- Any new precompute of command or skill vectors. Both are already built and the brief's constant block is already deduped. (iteration 4)
- No field cache hit rate exists to report. The diagnostics and metrics surfaces are opt-in and this checkout has no persisted diagnostics file, so the hit-rate question is closed as unmeasured rather than answered with a guess. (iteration 4)
- Persisting the exact cache across daemon restarts. The daemon recycles on build staleness, not per prompt, so the saving is rare. (iteration 4)
- Treating all six runtimes as one cold-start risk. Only Claude and Codex have a budget tighter than the CLI's cold wait. (iteration 4)
- A performance explanation for the uneven start rates across runtimes. The same hook cost applies to every runtime and the spread is behavioural. (iteration 5)
- Any further cache or precompute project. The evidence does not support a payoff and the telemetry needed to justify one is off by default. (iteration 5)
- Cold daemon start remains unmeasured inside the hard rules. Starting or stopping the live daemon is out of scope, and no existing packet records the number. The procedure is named instead of guessed. (iteration 5)
- Re-opening the brief's token budget. The measured brief is below the cap and the constant block is already suppressed. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Evidence already read before iteration 1:
- Hook latency, 44 tune prompts, pre and post the phase 004 meaning lane: before median 199.16/199.26/199.01 ms, p95 231.35/234.76/224.33; after median 206.23/194.83/205.09, p95 269.27/259.04/261.92 (`004-command-meaning-matching/scratch/hook-latency-*.json`).
- Warm query embedding 6.57 ms median, 10.99 ms p95 over 30 calls; advisor CLI call 62.7 to 71.3 ms over 5 calls; operator cold reading 271 to 277 ms per cold embed and 413 ms for one advisor CLI call with the model cold (`008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt`).
- Claude per-prompt chain: `bash -c` -> spec-kit shim `node` (2500 ms child timeout) -> advisor hook `node` -> `node .skilled/bin/skill-advisor.cjs` -> daemon.
- Hook budgets: Claude shim 2500 ms and CLI fallback default 250 ms; Pi 2500 ms in-process; DSH in-process; OpenCode plugin in-process with its own 5-minute exact-prompt cache.
- Phase 008 plans a 750 ms prompt-embedding deadline and does not preload the model or keep it loaded.
- Phase 005 adds `use <owner> -> <command> (<policy>)` to the brief head; phase 006 adds one Gate 2 bullet and may grow the delivery prefix by at most 463 bytes.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `research/inbox.jsonl` (not used in this lineage)
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-12T23:50:00.000Z
