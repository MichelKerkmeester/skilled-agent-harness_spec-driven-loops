# Iteration 2: Brief cost at HEAD, and whether any byte can go without losing information

## Focus

KQ2, carried question (f): what do the brief and the cold path cost per prompt after phases 011, 012 and 013, and is there a cut to the brief that leaves the same command, policy and skill reaching the model? Run `measure-brief-cost.mjs` as specified, and `measure-embedder-cost.mjs` against the already-running Ollama server.

## Focus Selection Check

Strategy next focus named KQ2. Exhausted approaches from segment two that this iteration must not retry: trimming the comment-hygiene directive (eliminated, `research-segment-2.md:68`), warm-the-embedder and `keep_alive` (ranks 18 and 16, declined). Neither was retried; the cut search was run inside the head, not the directive block.

## Actions Taken

1. Ran `measure-brief-cost.mjs` at HEAD with `TMPDIR` inside this lineage, and summarised its 44 rows.
2. Ran the same four typed rows through the hook twice, once with the script's fresh socket directory and once against the checkout's own daemon, and compared the emitted heads.
3. Measured the live brief for all 44 typed rows against the checkout daemon (`scratch/live-brief-cost.mjs`), including the head/directive split.
4. Computed the exact constant-block size from the renderer's own strings.
5. Ran `measure-embedder-cost.mjs` against the running Ollama server (version 0.40.15).

## Findings

1. **`measure-brief-cost.mjs` now reports a failure message as the brief cost.** At HEAD it prints 44 rows, median 361 bytes, min 361, max 408, total 16,072. Every row's emitted text begins `Advisor: outage (fail_open); route by hand: …`, so the number describes the fail-open directive, not a brief; the four 408-byte rows carry exactly the 47-byte setup hint on top. [COMMAND: `TMPDIR=<lineage>/scratch/tmp-brief node .skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs` → `{"rows":44,"totalBytes":16072,"medianBytes":361,"maxBytes":408}`] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/brief-cost-head.json]

2. **The script's fresh socket directory is the cause, and the daemon decides the result.** The script gives the hook a `mkdtemp` socket (`SANDBOX_PREFIX = 'ssa-cost-'`) so it "never reaches the operator's warm daemon"; with a workspace daemon running, no second daemon starts and the hook fails open. Four typed rows measured both ways: sandboxed 361 bytes and an outage head on every row; live 286 to 308 bytes, each carrying its command and policy. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:37-38] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:241-251] [COMMAND: `node scratch/brief-ab.mjs` → sandboxed 361 `Advisor: outage (fail_open)`; live 286 `Advisor: live; use sk-doc → /create:readme (start) 0.94/0.12 pass.`]

3. **The live brief has not grown since phase 011.** All 44 typed rows, live daemon: 44 of 44 carry their command and a policy, total 13,173 bytes, median 296, min 284, max 336. Phase 011's committed file read 12,771 total and 299 median, so the brief moved -3 bytes at the median while the script's number moved +62. The +21% is the measurement path changing, not the brief. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/live-brief-cost.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/brief-cost.json]

4. **The first-message brief is 74% constant, and steady state is the head alone.** The constant block is 218 bytes: 12 for `\nDirectives:` and 206 for the comment-hygiene line. The head is 78 bytes at the median and 118 at the maximum. A session's first prompt therefore pays 296 bytes (74 estimated tokens) and every later prompt pays the head only (20 tokens), because the dedup path returns `reducedContext = parts.head`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127-133] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:148-150] [COMMAND: node byte count of the two renderer strings → hygiene 206, label 12, constant 218]

5. **The head's six fields are each load-bearing, and the cuts are 6 to 10 bytes.** Measured heads carry provenance (`Advisor: `, 10 bytes), freshness (`live; `, 6), skill, command, policy (` (start)`, 8) and the score pair (`0.94/0.12`, 10) plus ` pass.` (6). Dropping freshness, the score pair and ` pass.` would save 22 bytes, 7.4% of the live brief, and each removal deletes a distinction the renderer and the hook guide rely on: live versus stale, certainty, and whether the entry passed the threshold. No subset is information-free. The one truly redundant token is the 12-byte `Directives:` label, and it is paid once per session. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:594-600]

6. **The cost that dominates a prompt is the started command's document, not the brief.** Segment one measured the 44 command documents at a median 4,524 bytes (about 1,131 tokens) and p95 12,573 bytes. At 78 bytes steady state the brief is 1.7% of that median, and at 296 bytes on a first prompt it is 6.5%. A brief cut of 22 bytes cannot change a start decision that a 4.5 KB document does not. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:83]

7. **Embedder cost at HEAD: warm median 7.89 ms.** 30 samples, p95 9.85 ms, model loaded at 335.7 MB VRAM against 274.3 MB on disk, `ollama serve` 26.6 MB RSS and its runner 257.8 MB. The cold number is unavailable because the model was already loaded (`coldReason: "model already loaded"`) and unloading it would be an ollama control action this run may not take. The five end-to-end `advisor_recommend` calls read 90.15, 145.96, 159.06, 193.39 and 322.84 ms. [COMMAND: `node .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs` → `{"warm":{"n":30,"medianMs":7.89,"p95Ms":9.85},"cold":null,"coldReason":"model already loaded"}`]

8. **True cold start is not measurable under this run's rules, and the committed bounds stand.** The hook costs 333.95 ms median and 547.86 ms p95 on 44 distinct typed prompts with a cold prompt cache, all inside the 2,500 ms hook budget. The cold figures on record are the embedder's 538.53 ms first call and the 611 to 844 ms true first prompt from phase 010; both are below the 750 ms embedder deadline and both failed open 0 of 5. A fresh cold number needs a daemon start, which this run may not perform, so it is recorded as a gap rather than replaced by inference. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/live-brief-cost.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:123]

## Questions Answered

- KQ2 (cost half): the live brief costs 296 bytes (74 tokens) on a session's first prompt and 78 bytes (20 tokens) after it; the embedder lane is 7.89 ms warm and its cold call is unmeasurable without controlling ollama.
- KQ2 (cut half): no cut leaves the same information. The head is six fields at 78 bytes and the only redundant token is a 12-byte label paid once per session.

## Questions Remaining

- KQ3: the ranking, the floor risk, and the verification each change needs.

## Ruled Out

- **Trimming the comment-hygiene directive.** Re-confirmed as eliminated, not reopened: it is 206 of the 218 constant bytes, it is suppressed after a session's first message, and it is the only carrier of the repo hard block in a brief-only session. The new measurement (218 not 233 bytes) does not change that disposition because the cost is once per session.
- **Dropping the score pair or the freshness word to save 22 bytes.** Rejected as a recommendation: 22 bytes is 7.4% of a first-message brief and 28% of a steady-state one, but each field carries a distinction the model or the guide uses, so it fails the "loses no information" test the question sets.
- **Reporting the script's 361 as the brief cost.** Rejected: it is the outage line. Any brief-cost figure from this script must be labelled with the arm that produced it.

## Dead Ends

- Asking the cost script for a live number by unsetting `SPECKIT_IPC_SOCKET_DIR` inside it is not possible without editing the script; the script sets the variable per row. A live measurement needs a second entry point, which is what `scratch/live-brief-cost.mjs` is.
- Comparing 011's 299 to today's 296 as "the brief shrank" is not supportable: both are within one renderer revision of each other and neither run pinned the same daemon state. The supportable claim is that the live brief is 284 to 336 bytes at HEAD.

## Edge Cases

- Ambiguous input: none. The question names both scripts and both were run.
- Contradictory evidence: the script says 361, the live measurement says 296, and the committed 011 file says 299. Resolved by measuring both arms on the same four rows: the 361 is the outage head, the 296 is the brief. Both numbers are now attributed to their arm.
- Missing dependencies: the embedder cold sample is unavailable because the model was loaded and this run may not unload it. Fallback: the committed 538.53 ms from phase 008, named as prior evidence, not remeasured.
- Partial success: the run answered both halves of KQ2 with one gap (cold embedder) recorded above.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:37-38, 241-251`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:127-133, 594-600`
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:148-150`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs`
- `scratch/brief-cost-head.json`, `scratch/brief-ab.mjs`, `scratch/live-brief-cost.json`, `scratch/embedder-cost-head.json`
- `specs/.../011-typed-command-delivery-and-guards/scratch/brief-cost.json`
- `specs/.../009-ux-performance-cross-cli-research/research/research.md:83`
- `specs/.../008-command-surfacing-build/goal.md:123`

## Assessment

- New information ratio: 0.82
- Questions addressed: KQ2
- Questions answered: KQ2

## Reflection

- What worked and why: running the sanctioned script and then the same rows live turned a number into a defect. The script's sandbox is not a neutral choice — it decides which arm is measured — and only the A/B made that visible.
- What did not work and why: the first read of the 361 median looked like brief growth of 21%. Comparing min, median and max showed all rows identical, which is the signature of a single canned string, not of 44 different heads.
- What I would do differently: check the distribution shape before comparing two runs. 44 rows with one byte count is a failure message every time.

## Recommended Next Focus

KQ3: rank the two changes the lane can defend (a health-only default record and a brief-cost script that refuses a degraded arm), give each its file, gain, verification and floor risk, and check whether either touches the measured floors.
