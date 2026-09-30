# Iteration 1 — mimo-01: Grading AI responses, what the operator gets

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-01` — Grading AI responses, what the operator gets
**Angle question:** Which grading use would change something the operator sees or decides, and which would only add a number to ignore?

## Grounding opened this iteration

- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:197-226` — D4 grader factory.
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:577,582,612-624` — grader selection and family-collision check.
- `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:20,22,59-68,74-76` — reviewer fixture oracle.
- `.skilled/skills/sk-communication/benchmark/reply-harness/README.md:3,7-13,17-23` — blinded reply comparison.
- Digest claims used with attribution: H9 dispute hook and stability formula (measurement digest H9, gap table), H13 description, hook deadlines (seam-map "Hook deadlines").

## Per-idea records

### Idea 1: `jev` grader kind on the model-benchmark D4 seam (`score` over ordered hallucination levels)

| Field | Record |
|---|---|
| **Idea** | A fourth D4 grader kind `jev` beside `llm`, `mock`, `noop`: `score` the output's hallucination level against the fixture, in the same `{score, confidence, parse_status}` shape the factory already returns (`score-model-variant.cjs:197-207`, return contract stated at `:198-200`). |
| **Value** | The operator's decision is "keep or revise this reviewer prompt or model variant", made from the Lane B report. Today D4 (hallucination, weight 0.15 per measurement digest H9) is graded `mock` by default and `noop` contributes a constant 1.0 (`score-model-variant.cjs:201,208-210`; default `noop` at `run-benchmark.cjs:577`), so the decision currently rests on a dimension nobody measured. A cheap numeric judge turns an ignored dimension into a real one. |
| **Seam** | `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:207-226` (factory body; `mode = graderKind === 'llm' ? 'real' : 'mock'` at `:211`, so an unknown kind silently becomes mock — the `jev` branch must be added explicitly). Opened this iteration. |
| **Metric, baseline, harness** | Metric: exact agreement of the Jev verdict with the fixture's hidden oracle `expectedVerdict` (`reviewer-schema.md:59`), plus expectedFindings hit rate (`reviewer-schema.md:60`), plus flip rate across three reruns. Baseline: UNKNOWN — the measurement digest gap row "Grader agreement with oracle" records none, and names exactly this experiment as the smallest harness ("One run of `reviewer-regression` with `--grader llm` and one with a Jev grader, reporting agreement with `expectedVerdict`", measurement digest §3). Gold set: the reviewer fixtures' visible plus hidden cases; hidden cases are the overfit guard (`reviewer-schema.md:66-68`). Harness: H9. |
| **Cost, latency, privacy** | One billed `jev score` call per graded output (H9's llm grader costs one or two Claude calls; measurement digest H9 cost row). Offline, no deadline. Privacy: the fixture diff and output text leave the machine verbatim (cli-usage state-forwarding rule, seam-map "The Jev contract as used here"); fixtures are synthetic repo states, so exposure is low but not zero. |
| **Opt-in and no key** | The switch already exists: `--grader noop|mock|llm` becomes `--grader noop|mock|llm|jev` (`run-benchmark.cjs:582`). Default stays `noop`, unchanged. With no key the Python `jev-cli` exits 3 (seam-map); the run must then report D4 as not graded and say so. Today's exception path returns `score 0.0, confidence 0.0, parse_status 'failed'` (`score-model-variant.cjs:222-224`), which reads as "hallucinated maximally" rather than "not measured". Confirmed from code: the swallow-into-zero on the `jev` arm must become a visible skip, never a silent 0.0 (repo-rules-digest §4 red flag, applied). |
| **Complexity** | Roughly 60-100 lines in `score-model-variant.cjs` plus one report row and one fixture-class test; files touched: the scorer, `run-benchmark.cjs` usage string (`:582`), and the vitest or node-test covering the new kind. No shared contract changes: the factory's return shape is consumed unchanged. |
| **Verdict** | **build-now.** It is the only grading use whose gold set is already written, and it fills the exact gap row the measurement digest names; the flag it needs already exists. |
| **Confidence** | Confirmed from code: factory shape, default grader, silent-mock fallthrough (`score-model-variant.cjs:207-226`, `run-benchmark.cjs:577`). Inferred: agreement numbers and cost; what would confirm: one `reviewer-regression` run per grader kind as the gap row prescribes. |

### Idea 2: Jev as the blinded judge slot in the reply harness (H13)

| Field | Record |
|---|---|
| **Idea** | Score the masked A/B replies per rubric dimension with `jev score`, as the judge the harness reserves for a human or model (`reply-harness/README.md:11`, judge "human or model"; the scripts themselves never call a model, `:3`). |
| **Value** | The decision it changes is the release one: `compare.mjs` exits non-zero when the control moved or a blocking class fired (`README.md:12`). Today the operator judges the masked replies by hand. A Jev judge removes that manual pass for the routine rows and keeps the human on a calibration subset. |
| **Seam** | `.skilled/skills/sk-communication/benchmark/reply-harness/README.md:11` (blind step produces "the bare text a judge, human or model, reads") plus `:20` (the judge scores by `rubric.json` outside the scripts). Opened this iteration. |
| **Metric, baseline, harness** | Metric: per-dimension agreement between the Jev judge and a human pass on a subset of masked pairs (exact level agreement and one-level-off tolerance). Baseline: UNKNOWN; the frozen case set and negative control exist (`README.md:7-8`) but no judge scores are recorded. Harness: H13. |
| **Cost, latency, privacy** | Seven dimensions per masked pair is expensive if asked one call per dimension; one `jev run` request batches the questions over one state at about the latency of one (measurement digest §2 "Wire API", parallel questions claim from jevctl docs). Offline. Privacy: full reply text leaves the machine; the masked files carry no provenance (`README.md:11`), which limits what leaks to the reply content itself. |
| **Opt-in and no key** | The judge step is already manual and optional (`README.md:20` "when a blinded judge reads"). No key: the operator judges by hand exactly as today. No silent default score. |
| **Complexity** | Roughly 80-120 lines: a `judge-jev.mjs` beside `blind.mjs` writing `<masked dir>/jev-scores.json`, no change to `score.mjs` or `compare.mjs`. |
| **Verdict** | **next.** It is a real decision and a real removal of manual work, but its gold (the human subset) does not exist yet, so it cannot be the first slice; it rides on the same labeled-set work as Idea 1's flip-rate check. |
| **Confidence** | Confirmed from code: harness structure and the empty judge slot (`README.md:3,11,20`). Inferred: agreement design; would confirm with a 10-pair pilot scored by the operator. |

### Idea 3: Live per-turn reply grading hook (the social post's hook shape)

| Field | Record |
|---|---|
| **Idea** | After every assistant reply, `jev noul` "was that a good answer" and surface the probability (precedent: measurement digest H13 note and jev-material digest §3 idea 1 reading, community hook at `specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md:231` — digest-attributed, not reopened). |
| **Value** | Almost none for the operator. A per-turn number changes nothing unless someone acts on it, and acting means reading a nag on turns that were fine. |
| **Seam** | Would sit on a turn-end hook; Pi goal hooks run every turn with no declared deadline (seam-map S08), Claude Stop hooks have 10 s deadlines (seam-map "Hook deadlines"), and a Jev call has a 60 s client timeout with no measured latency (seam-map preamble). |
| **Metric, baseline, harness** | No harness grades live replies; the closest gold would need labeled transcripts like the goal gap row (measurement digest §3). UNKNOWN baseline. |
| **Cost, latency, privacy** | One billed call per turn, full reply plus prompt state off the machine per turn. Latency on the hot path with an unmeasured call (seam-map preamble: seams under 10 s need shadow, cached or async). |
| **Opt-in and no key** | Could be env-gated, but the no-key path is not the problem; the always-on cost and attention tax is. |
| **Complexity** | A hook plus report surface, 150+ lines across runtimes for parity, and a standing privacy egress per turn. |
| **Verdict** | **drop.** It fails the repo's own UX test: it adds a prompt and a report to parse instead of removing a decision (repo-rules-digest §5, digest claim), and no gold set exists to prove the grades mean anything. |
| **Confidence** | Inferred from the UX doctrine plus the deadline and cost facts above. What would change it: a recorded incident where a bad reply that the operator would have caught early cost real rework, and a gold set of such turns. |

### Idea 4: Done gate at a claimed completion (send back versus accept)

| Field | Record |
|---|---|
| **Idea** | At a claimed completion, `jev noul` "does this answer actually complete the request" (the post's done gate sent a plan-only answer back at 0.16 and passed a concrete one, `specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md:1121` — digest-attributed). |
| **Value** | This one does change what the operator sees: fewer half-done "complete" claims reach them. The decision it changes is accept versus send back. |
| **Seam** | The completion-claim seam already exists as an advisory regex: `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:64,113-118` (seam-map S09), 10 s Stop deadline (`.claude/settings.json:174-175`, seam-map). Not opened this iteration; S09 citation is the seam-map's claim. |
| **Metric, baseline, harness** | Metric: false-completion rate on a labeled set of claimed completions. Baseline: UNKNOWN; the sentinel is advisory and records no accuracy (seam-map S09). Harness: none today; the smallest one is the labeled-transcript pattern from the goal gap row (measurement digest §3). |
| **Cost, latency, privacy** | One call per claimed completion only, not per turn. Deadline 10 s is under the 60 s client timeout ceiling (seam-map preamble), so it needs a shadow or async shape in-hook. |
| **Opt-in and no key** | Must stay advisory like the sentinel (never blocks, seam-map S09), behind the existing `*_DISABLED` kill-switch shape. No key: the regex sentinel alone, today's behavior. |
| **Complexity** | 80-150 lines in the sentinel adapter plus a labeled set; judgment-as-authorization is a forbidden pattern (jev-material digest anti-pattern 9), so it can only advise. |
| **Verdict** | **parked until mimo-06.** The grading question is right but the seam belongs to the completion and validation triage angle, which will rank its friction; do not build it from this angle's evidence alone. |
| **Confidence** | Inferred from S09's description; would confirm by opening the sentinel and its tests in mimo-06. |

### Idea 5: Playbook verdict grading (PASS/FAIL/SKIP second opinion, S26)

| Field | Record |
|---|---|
| **Idea** | `jev choice` over `pass`, `fail`, `skip` as a second opinion on manual playbook runs (seam-map S26). |
| **Value** | None the operator can act on: the playbook's recorded verdict is human, and the contract says a Jev call is never the recorded verdict (seam-map S26). H8 runs record PASS/FAIL/SKIP only, never a graded quality score (measurement digest "Playbooks in general"). |
| **Seam** | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/manual-testing-playbook.md:24` (seam-map S26 claim, not opened). |
| **Metric, baseline, harness** | Pass or fail per scenario (H8), no scored gold; a Jev disagreement with a human verdict has no arbiter, so agreement cannot even be scored. |
| **Cost, latency, privacy** | One billed call per scenario for a number that loses every disagreement to the human. |
| **Opt-in and no key** | Trivially gated, but gating does not make it useful. |
| **Complexity** | Small, but it is a report row nobody reads. |
| **Verdict** | **drop.** Nobody acts on the grade: the human verdict wins by contract and H8 has no quality score to correlate with. |
| **Confidence** | Confirmed from the digest's playbook and S26 records; inferred that no operator would read the row. |

## Ruled out this iteration

- Grading tool outputs (not model replies) with Jev: out of the angle's question, which is about AI responses.
- Reusing the H15 retired skill-benchmark runner as the grading harness: measurement digest H15 forbids naming it; it cannot be reproduced from the current tree.
- Any live `jev` probe of judgment quality: forbidden by the per-iteration contract rule 8.

## Hand-off

- The `jev` grader kind is the wave-1 keep: next iteration or later waves must pin its exact output contract (`{score, confidence, parse_status}` at `score-model-variant.cjs:198-200`) against what `jev score` actually returns (fractional score plus confidence plus probabilities per cli-reference, seam-map claim) and name the mapping.
- The silent-0.0 exception path (`score-model-variant.cjs:222-224`) is a shared-contract question: whoever wires any new grader kind must decide whether "not measured" is representable, and today it is not.
- mimo-06 must pick up the done-gate (Idea 4) and open the sentinel code itself.
- The gold-set inventory question stays open: how many reviewer fixtures and hidden cases exist on disk today (only "four reviewer fixtures and a reviewer-regression.json profile" per measurement digest H9, listed not opened). mimo-05 or mimo-08 should count them, because the agreement metric's denominator is that count.
