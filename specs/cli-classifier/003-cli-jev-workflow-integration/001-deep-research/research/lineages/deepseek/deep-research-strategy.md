---
title: "Deep Research Strategy: Jev typed judgments in .skilled (deepseek lineage)"
trigger_phrases: []
---
# Deep Research Strategy: Jev typed judgments in .skilled (deepseek lineage)

## Research Topic

Where do Jev typed judgments earn a measured, opt-in, UX-first place in this repository's skills, workflows and logic? This lineage answers with the integration-engineer lens: exact call sites, hook contracts and deadlines, process boundaries a `jev` subprocess crosses, env flag shapes the neighbouring code already uses, degrade paths, lines of code, callers and frozen contracts (Q8).

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save, and git staging are out of scope.
- Gate 3 is pre-resolved to the existing packet `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research`.
- The Jev contract under study is the Python `jev-cli` 0.6.2 wrapped by `.skilled/skills/cli-jev/cli-usage/` (judgment types `noul`, `choice`, `score`, `run`; exits 0/1/2/3/4/130; 60 s client timeout). The vendored npm `jevctl` 0.2.3 is research material only and is named apart in every claim.
- Seams `S01`-`S26` and harnesses `H1`-`H15` come from the phase digests; citations to code are reopened per iteration.
- No live `jev` call may be made, and no `.env` file may be opened.

## Key Questions

- [x] deepseek-01 Grading AI responses: where does a Jev grade get called, and what does each candidate site expect back?
- [x] deepseek-02 Advisor recommendations: can a Jev tie-break live inside the 2500 ms advisor child, or only shadow/offline?
- [x] deepseek-03 Goal hook and compaction: what plugs into which runtime surface, inside whose deadline?
- [x] deepseek-04 Deep-loop stop: which stop-path seam has a shadow slot, and what would the reducer carry?
- [x] deepseek-05 Finding triage and dispatch guards: which seams can take a call inside their deadlines?
- [x] deepseek-06 Validation, routing clarify/defer, verdicts: which contracts permit an advisory field?
- [x] deepseek-07 The smallest new surface: helper, command or skill over direct transport calls?
- [x] deepseek-08 The measurement harness as code: smallest runnable proof for the top ideas.
- [x] deepseek-09 Failure modes and prompt caching: exits 3/4, malformed answers, deadline misses, cache risk.
- [x] deepseek-10 Smallest-first build order: ordered slices with LOC, files, callers and rollback.

## What Worked

- Iteration 10: reading the siblings' finished synthesis before ordering caught a rank the siblings contested (goal mode) and a too-strict sibling claim (nothing else until the arm's delta); the order became dependence-based rather than rank-based.
- Iteration 10: every slice's rollback reduced to file deletion or flag removal because no survivor touches a frozen contract or default.

## What Failed

- Iteration 10: the order is a recommendation, not a measurement; only slice 1's census and delta can discipline it downstream.
- Iteration 10: parallel capacity is an operator decision; the dependence graph permits slices 2-4 to run beside or after slice 1, but only slice 1 gates the `choice` family.

## Exhausted Approaches

- (none yet)

## Ruled-Out Directions

- Live Jev call inside the 2200 ms advisor child (SIGKILL turns a slow call into total advisory loss).
- Jev as a fused live lane (`passes_threshold` is code-owned; an out-of-domain answer must not become a routing verdict).
- Live Jev keep-or-drop inside Claude PreCompact (1800 ms internal cap).
- Jev verifier on Cursor or Devin (no verifier surface).
- Jev inside `shouldBlock` as the stop corroborator (a model answer must not become the blocking authority).
- Live Jev in the dispatch guard or linter (5 s deadline, repository-fact evidence, determinism).
- Jev as the live fan-out merge decision (deterministic merge, no gold, no reproducibility story).
- Live Jev in the compiled-routing front door (stdout contract, synchronous path, 13-row gold).
- Jev retrievability score (no retrieval gold).
- Jev playbook verdict second opinion (no FAIL rows; human wins by contract).
- New `cli-jev` skill mode or command for script judgments (transport posture covers it).
- Shared helper in slice 1 (zero callers; forwarding wrapper).
- Standalone latency probe as first harness (duplicates the arm's calls).
- Writing the Jev arm into the ratchet baseline (network arm in a pinned deterministic ratchet).
- Blanket retry policy across exit codes (3 must not retry).
- Client-side answer cache inside stability measurements (nullifies the measure).
- `score 0.0` as the grader's not-measured representation.
- Building the goal mode before its labeled set (safety property unmeasured; siblings contest the rank).
- Creating the shared client helper now (zero callers until slices 3-4).

## Next Focus

None. Ten angles complete; synthesis follows.
