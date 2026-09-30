---
title: Deep Research Strategy — Jev Round 2, DeepSeek Lineage
description: Detached five-iteration research strategy for the DeepSeek lineage (seams, the key gate and failure paths) on the council-revised Jev recommendations.
trigger_phrases: []
---

# Deep Research Strategy — Jev Round 2, DeepSeek Lineage

## 1. Overview

This is the persistent state for detached lineage `deepseek` (cli-pi, `deepseek-v4.1-flash`, max) in `004-deep-research-expansion`. The loop is forced to five iterations by `stopPolicy: max-iterations`; convergence before iteration five is telemetry only. The lens is **seams, the key gate and failure paths**, per `context/research-angles.md` section 2.

## 2. Topic

Deepen and widen the council-revised Jev recommendations for this repository's skills, workflows and logic, measured, opt-in and dormant without a Jev key. Baseline is `001-deep-research/research/research.md`, the round-1 re-synthesis; round 2 starts from its build-now and next items and its section 12 questions and never restates a finding without new evidence.

## 3. Angle Assignments (deepseek, 5 forced iterations)

- `deepseek-01` (W1): The key gate as code: probes, the package collision and every failure path — RQ1, RQ5, RQ7.
- `deepseek-02` (W1): The compaction seams: the function-hook budget and the transcript after a compact boundary (questions 18 and 25) — RQ2.
- `deepseek-03` (W2): Goal seams across runtimes: Pi `turn_end`, the clamp path and where a lint plugs in (question 28) — RQ3.
- `deepseek-04` (W2): Missed seams: the round-1 DeepSeek registry loss and hook surfaces outside the seam map (question 26, RQ6) — RQ6.
- `deepseek-05` (W3): Failure modes and kill criteria for the survivors, engineering view — RQ7.

<!-- ANCHOR:key-questions -->
## 4. Key Questions (remaining)

- [x] For each of the three D5 checks: spawn cost, network and quota side effects, and what each package prints on failure, for the Python `jev-cli` 0.6.2 and for the npm `jevctl` 0.2.3 when it sits first on PATH? (iteration 1)
- [x] Is an exact match on `jev 0.6.2` enough to refuse `jevctl`, or can a wrapper or a future version slip through? (iteration 1; wrapper gap recorded)
- [x] The exit-code matrix for both packages, and what R1, the R19 arm, the R20 arm and the R2 arm each do on every code? (iteration 1; R19/R20 doc-time table)
- [x] Where does `jev auth status` read its key from, and can a key in a settings `env` satisfy it by accident? (iteration 1; yes)
- [x] Does Claude Code bound a `session.compact` function hook in production, at what, and what does the transcript record after a compact boundary? (iteration 2; record shapes resolved, budget still UNKNOWN)
- [x] Does Pi await async `turn_end` handlers, and where does an R20 lint plug in so every runtime's goal is linted before it is set? (iteration 3; yes, and callers listed with bypass paths)
- [x] Did the round-1 DeepSeek registry loss drop a decisive finding, and which hook surfaces outside the seam map host a typed judgment Jev could make? (iteration 4; no verdict change; HVR gap found)
- [x] For each survivor: on exit 3, exit 4, a malformed answer, a slow call, the wrong package on PATH and a key rejected mid-run, what prints and what state persists? (iteration 5)
- [x] Which survivors touch a frozen contract, and what is the rollback sentence of each build step? (iteration 5)
<!-- /ANCHOR:key-questions -->

## 5. Non-Goals

- No build of any recommendation; research only.
- No live `jev` call of either package, no `jev auth test`, no `jev auth status`, nothing sent to a Jev endpoint.
- No `.env` file opened, vendored or not.
- No write outside `research/lineages/deepseek/`; no spec, continuity, memory, git, parent or shared telemetry write.
- No repository module, test suite, `validate.sh`, `generate-context.js`, ratchet, eval script or install run.
- No transcript or reply text copied into any artifact; counts, lengths and field names only.
- The two `jev` packages stay apart in every sentence: Python `jev-cli` 0.6.2 vs npm `jevctl` 0.2.3.

## 6. Stop Conditions

- Complete exactly five evidence iterations under `stopPolicy: max-iterations`.
- Treat convergence before iteration five as telemetry and continue; never synthesize early.
- Stop at iteration five with `maxIterationsReached`, retaining explicit unknowns.

<!-- ANCHOR:answered-questions -->
## 7. Answered Questions

- Binding and init complete; angle assignments fixed above. (init)
- Angle deepseek-01 answered: the D5 gate's three checks are sound in order and cost zero network/quota; the Python version string is a hardcoded literal, the Python `auth status` cannot report an env-var key source, the npm docs recommend the row-43 settings placement, and R19/R20 have no per-code table. The Python package is the one every arm must use. (iteration 1)
- Question 25 answered: the transcript records the injected brief in the `attachment/hook_success` `SessionStart:compact` record's `stdout`; the boundary is `system/compact_boundary`; the summary is `user/isCompactSummary`. Question 18 remains UNKNOWN: no production budget text for `session.compact` is readable, the vendored types describe 2.1.274, and the installed host is 2.1.283. (iteration 2)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 8. What Worked

- Reading both packages' source side by side: the print-format split, the env-first resolution and the exit-taxonomy disagreements all surfaced from code, not docs. (iteration 1)
- A read-only Node census over one transcript answered the brief-column UNKNOWN with record types and field names only; the attachment vocabulary makes the whole census possible. (iteration 2)
- Comparing the vendored types' stated host version against `claude --version` took one command and bounds every budget claim. (iteration 2)
- Searching the installed Pi bundle with bounded context found `emitBoundary`'s await in minutes; the type file confirmed `TurnEndEventResult`. (iteration 3)
- A structured scan of all ten round-1 iterations plus line-level reopening resolved question 26 without rereading every file in full. (iteration 4)
- Verifying a sibling's contested claim in the vendored staged-state code settled the fit-column dispute with a citation. (iteration 5)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 9. What Failed

- No way to distinguish an env-var key from a stored key on the Python `auth status` surface; the `store` field is static, so the drop of the parse idea stands. (iteration 1)
- The installed binary would not give up a budget context string: the 225 MB Mach-O timed out a context grep, so the ten-second figure stays test-clock prose. (iteration 2)
- No PreCompact hook record exists in the transcript; the cache write is unobservable and only the SessionStart injection is recorded. (iteration 2)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 10. Exhausted Approaches

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 11. Ruled-Out Directions

- Parsing the Python `auth status` `store` field to learn the key origin: the field always names the credentials file. (iteration 1)
- Reading npm `jevctl` exit codes as the package discriminator: the version check must fire first; npm exit 2 is a judgment result. (iteration 1)
- Reading a PreCompact record as the brief source: no such record exists; the injection record is the artifact. (iteration 2)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 12. Saturated Directions and Divergence Frontier

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
<!-- /ANCHOR:divergence-frontier -->
<!-- MACHINE-OWNED: END -->
