You are the deep-research LEAF agent, iteration 5 of 5 (FINAL), for an adversarial validation investigation. RESEARCH ONLY — never modify source code, never touch git, never run memory-DB writes. You MAY run read-only shell and read files. Cite every claim as file:line.

REPO ROOT: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

## RESEARCH TOPIC
Validate the behavioral claims of the "skip-not-fail on live owner" fix to the substrate stress harness.
Primary sources:
- `.opencode/bin/mk-code-index-launcher.cjs` (maintainer-mode + INDEX scan + lease/exit logic)
- `.env.local` (the SPECKIT_CODE_GRAPH_MAINTAINER_MODE setting)
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` (child env construction; buildDaemonEnv)

## PRIOR ITERATIONS (build on; do not repeat)
- Q1: crashes still FAIL except PID recycling (F-005).
- Q2: false-green guard fires; only PID recycling bypasses.
- Q3: TSV structure reproducible; pid values session-dependent; EPERM-locked TSV stale-pid hazard.
- Q4: harness never writes graph-metadata; child exits before scan (cjs:864 before buildIfNeeded cjs:944); operator maintainer-mode daemon is the writer.

## THIS ITERATION'S FOCUS (Q5) — the decisive nuance
Claim: the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` leak from `.env.local` is "latent — only matters on a clean-env run where the child actually starts and would do a forced INDEX scan." Is the skip-not-fail fix truly SIDESTEPPING the leak, or MERELY HIDING it?

Investigate with file:line evidence:
1. Confirm `.env.local` sets `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true`, and that the launcher loads `.env.local` (loadEnvFile loop) and forces all 5 INDEX_* flags to "true" when it is set (cjs lines for the maintainer-mode block).
2. Does the harness's `buildDaemonEnv` scrub or override `SPECKIT_CODE_GRAPH_MAINTAINER_MODE`? Or does the launcher re-load it from `.env.local` regardless of the child env? (Existing-process.env-wins dotenv semantics — confirm.)
3. INTERACTIVE session (operator daemon live): child exits before scan (Q4) → leak NEVER fires → effectively sidestepped IN THIS CASE.
4. CLEAN env (no operator daemon, e.g. CI): the harness child ACQUIRES the lease, proceeds past cjs:864, reaches buildIfNeeded (cjs:944) WITH maintainer mode true → forced full INDEX scan → writes graph-metadata.json across the tree. So the leak is LIVE in clean env.
5. VERDICT framing: is skip-not-fail a fix for the leak, or orthogonal? (It changes FAIL→SKIP on lease contention; it does nothing to the maintainer-mode env leak. The leak is sidestepped only because interactive sessions never start the child — "merely hidden", not fixed.)
6. Quantify the clean-env blast radius: which directories a forced INDEX_* scan rewrites graph-metadata in (the operator daemon scans .opencode/{skills,specs,agents,commands,plugins}); ~1437 files is the observed magnitude. State the blast radius precisely.

## KEY QUESTIONS (full set; lead on Q5 — this closes the set)
- Q1 DONE. Q2 DONE. Q3 DONE. Q4 DONE. Q5 (focus): maintainer-mode leak sidestepped vs hidden.

Also: write a brief CROSS-CUTTING closing note summarizing the overall verdict across all 5 claims (PROVEN / PROVEN-WITH-CAVEAT / NOT-PROVEN), since this is the final iteration.

## STATE FILES (relative to REPO ROOT)
- Config: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-findings-registry.json

## CONSTRAINTS
- LEAF agent: no sub-agents. 3-5 actions, max 12 tool calls. Findings to files. Report only.

## OUTPUT CONTRACT — THREE artifacts (all REQUIRED)
1. Narrative at: .../research/iterations/iteration-005.md (headings: Focus, Actions Taken, Findings w/ file:line, Questions Answered, Questions Remaining, Next Focus, plus a Cross-Cutting Verdict section).
2. APPEND single-line canonical record to State Log (newline-terminated), EXACT type:
   {"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<insight|thought|error>","focus":"Q5 maintainer-mode leak","graphEvents":[]}
3. Delta file at: .../research/deltas/iter-005.jsonl — iteration record then per-finding/ruled_out records.

Begin now.
