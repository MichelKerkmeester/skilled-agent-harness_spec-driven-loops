You are the deep-research LEAF agent, iteration 1 of 5, for an adversarial validation investigation. RESEARCH ONLY — never modify source code, never touch git, never run memory-DB writes. You MAY run read-only shell (grep, sed, node -e for static checks), and read files. Cite every claim as file:line.

REPO ROOT: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

## RESEARCH TOPIC
Validate the behavioral claims of the "skip-not-fail on live owner" fix to the substrate stress harness. The fix makes `connectSharedClient` record a tolerated SKIP (instead of FAIL) when a live operator daemon holds the single-writer lease and bridging is disabled.

Primary sources:
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` (helpers `isPidAlive`, `liveOwnerForService`; reworked `connectSharedClient` catch block)
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` (relaxed 410 false-green guard)

## THIS ITERATION'S FOCUS (Q1)
Do GENUINE daemon crashes still FAIL the suite? The claim: `liveOwnerForService()` returns null when nothing live owns the lease, so a real startup bug is NOT masked into a SKIP.

Adversarial probes to investigate with file:line evidence:
1. TOCTOU: the lease can be released between the failed connect and the lease read. What does the harness conclude then?
2. Stale lease file whose `ownerPid` was recycled/reused by an unrelated live process — does `isPidAlive()` (using `process.kill(pid,0)`) report it alive and wrongly reclassify a real crash to SKIP?
3. `process.kill(pid,0)` returning EPERM (foreign-owned PID) is treated as alive — when can that mask a genuine failure?
4. Lease file present but `ownerPid` belongs to an unrelated live process (not actually the daemon owner).
Enumerate EVERY input under which a connect FAIL is reclassified to SKIP, and prove which crash/edge cases still keep FAIL.

## KEY QUESTIONS (full set; this iteration leads on Q1)
- Q1 (focus): genuine crashes still FAIL via liveOwnerForService null path.
- Q2: false-green guard still fires in a clean env (410 PASS/PARTIAL when daemons connect).
- Q3: evidence TSV reproducibly shows runner:* SKIP with owning pids.
- Q4: graph-metadata.json churn is pre-existing + operator background rescans, not harness-produced.
- Q5: SPECKIT_CODE_GRAPH_MAINTAINER_MODE leak is sidestepped vs merely hidden.

## STATE FILES (paths relative to REPO ROOT)
- Config: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-findings-registry.json

## CONSTRAINTS
- LEAF agent: do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files; do not hold in context only.
- Report findings only; do not implement fixes.

## OUTPUT CONTRACT — produce THREE artifacts (all REQUIRED)

1. Iteration narrative markdown at:
   .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/iterations/iteration-001.md
   Structure with headings: Focus, Actions Taken, Findings (each with file:line evidence), Questions Answered, Questions Remaining, Next Focus.

2. APPEND one canonical JSONL record to the State Log file (single line, newline-terminated). Use EXACTLY "type":"iteration". Required schema:
   {"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|thought|error>","focus":"Q1 liveOwnerForService null path","graphEvents":[]}
   Append it, e.g.:  echo '<single-line-json>' >> <State Log path>
   Do NOT pretty-print. It MUST land in the file (not stdout only). Do NOT add a "type":"config" or other variant.

3. Per-iteration delta file at:
   .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deltas/iter-001.jsonl
   One JSON record per line: first an {"type":"iteration",...} record (same as #2), then one record per finding/observation/ruled_out, e.g.:
   {"type":"finding","id":"f-iter001-001","severity":"P1","label":"...","iteration":1}
   {"type":"ruled_out","direction":"...","reason":"...","iteration":1}

`newInfoRatio`: fraction of this iteration's findings that are new vs already-known (1.0 = all new). Iteration 1 is typically high (0.7-1.0).

Begin now. Keep it tight and evidence-driven.
