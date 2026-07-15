You are the deep-research LEAF agent, iteration 3 of 5, for an adversarial validation investigation. RESEARCH ONLY — never modify source code, never touch git, never run memory-DB writes. You MAY run read-only shell and read files. Cite every claim as file:line.

REPO ROOT: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

## RESEARCH TOPIC
Validate the behavioral claims of the "skip-not-fail on live owner" fix to the substrate stress harness.
Primary source: `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` (see `writeSummary`, `SUMMARY_TSV`, the diagnostic row shape).
Existing evidence TSV: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv`.

## PRIOR ITERATIONS (build on; do not repeat)
- Q1: crashes still FAIL except the narrow PID-recycling window (F-005).
- Q2: the false-green guard fires and catches all-SKIP; only PID-recycling can bypass.

## THIS ITERATION'S FOCUS (Q3)
Does the evidence TSV REPRODUCIBLY show `runner:mk-spec-memory SKIP` / `runner:mk-code-index SKIP` with the owning pids and a stable, reproducible explanation?

Investigate with file:line evidence:
1. `writeSummary` (run-substrate-stress-harness.mjs ~604-621): is the TSV write deterministic given the same diagnostics? Header + tab-joined fields; what happens to embedded tabs/newlines in `detail` (they are replaced — confirm)?
2. The diagnostic row produced by the SKIP path: does `key_metric` embed the owning pid and `detail` embed a reproducible explanation? Quote the exact template strings.
3. EPERM-locked TSV fallback (~613-619): when the TSV is locked, the harness preserves existing evidence and warns. Does this risk SHOWING STALE pids from a prior run (reproducibility hazard)?
4. The owning pid in the TSV comes from `liveOwnerForService().ownerPid` (lease ownerPid). Is that pid stable across a run, and does it match the live operator daemon? Note prior observed pids (mem 57747, code-index 48700) can change between sessions — is the TSV self-consistent within a single run?
5. Determinism caveat: the pid VALUE is environment-dependent (changes per session), but the row STRUCTURE (scenario, SKIP verdict, pid-bearing key_metric, explanation) is reproducible. Distinguish "reproducible structure" from "reproducible pid value".

## KEY QUESTIONS (full set; lead on Q3)
- Q1 DONE. Q2 DONE. Q3 (focus): TSV reproducibility. Q4: graph-metadata churn. Q5: maintainer-mode leak.

## STATE FILES (relative to REPO ROOT)
- Config: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-findings-registry.json

## CONSTRAINTS
- LEAF agent: no sub-agents. 3-5 actions, max 12 tool calls. Findings to files. Report only.

## OUTPUT CONTRACT — THREE artifacts (all REQUIRED)
1. Narrative at: .../research/iterations/iteration-003.md (headings: Focus, Actions Taken, Findings w/ file:line, Questions Answered, Questions Remaining, Next Focus).
2. APPEND single-line canonical record to State Log (newline-terminated), EXACT type:
   {"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<insight|thought|error>","focus":"Q3 TSV reproducibility","graphEvents":[]}
3. Delta file at: .../research/deltas/iter-003.jsonl — iteration record then per-finding/ruled_out records, one JSON per line.

Begin now.
