---
title: "Iteration 5: Default-On Integration Needs, Cost And Risk"
trigger_phrases: []
---
# Iteration 5: Default-On Integration Needs, Cost And Risk

## Focus

Bound what turning the track pick on by default would require: serving caller, policy, cost, availability, requalification, privacy and failure semantics — using the recorded run, the sibling serving measurement and the parent goal's own decisions.

## Findings

1. Serving is an operator decision by construction, and this packet cannot make it. The 017 record is explicit: "This keep serves nothing, because serving a pick needs a later phase, and opening one is the operator's call." [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/implementation-summary.md:66] This phase's spec puts changing any live workflow and re-measuring out of scope. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/spec.md:77] Default-on is therefore a proposal for a later build phase, and the deliverable here is a ranked, evidence-cited brief.

2. The fleet policy a default-on arm must obey already exists at the parent: D1 is "Jev only, dormant unless `jev auth status` passes. Jev gets no secret", amended in spirit to "Jev first, else Deem, dormant unless one is available". [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/goal.md:47] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/goal.md:238] The scorer's own gate already implements the same shape for measurement: PATH check, exact version `jev 0.6.2`, `auth status` exit 0, and one skip line for each failure. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1146]

3. The serving substrate is built and measured; what is missing is a caller and a policy. The `cli-classifier` hub exposes `mode cli-jev` as a read/bash-only transport that never fails over silently. [SOURCE: file:.skilled/skills/cli-classifier/SKILL.md:22] [SOURCE: file:.skilled/skills/cli-classifier/SKILL.md:24] The Pi route behind `JEV_TRANSPORT` measured `adopt K=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100`, latency p95 340/387 ms and cost 0.0022 per 100 calls, for `choice` questions only. [SOURCE: file:.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:79] A track pick would reuse this path; the integration work is policy (when to call, what to do with `none`, how to fall back), telemetry and requalification.

4. The headline cost is latency on the prompt critical path. One call is p50 330 ms / p95 391 ms, against the 200 ms p95-and-max budget the cold lookup lane already holds itself to — so a call roughly doubles the entire current Gate 1 lexical budget, not just an incremental slice. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:43] Mitigations that keep the budget: call only when the lexical lanes return nothing or tie (Gate 1 treats no rows as a clean no-hit today), or run advisory/off-path first.

5. Token cost is small per call but concentrated in the options: about 1,118 input tokens per call, 96.8 percent of it the 17-option block. The full measurement run was 811 calls / 905,891 input tokens / 1339.6 s wall. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt] The sibling transport reports 0.0022 cost per 100 calls, which makes money cost a secondary concern; the two-stage shortlist from iteration 2 is the lever that cuts this payload if volume ever matters.

6. The accuracy risk is the dominant product risk: the pick would be wrong more often than right. Row accuracy is 37.9 percent (97/256); on decided rows it is 48.7 percent; a row-level binomial 95 percent interval on 97/256 is roughly [32 percent, 44 percent], and the clustered structure from iteration 3 makes the effective uncertainty wider, not narrower. Default-on converts Gate 1's current fail-open no-hit into a wrong-answer mode; the mitigation is to serve only where the lexical lanes are empty and to define `none` as a first-class outcome.

7. Abstention is high and concentrated: 57 of 256 rows (22 percent) voted `none`, 32 of those in three tracks (sk-design 16). A default-on arm must define the abstain behavior — ask the user, or fall back to lexical — and it must not count abstention as a pick. The mean `noneProb` on those rows is 0.475, so the model is often not ambivalent when it abstains.

8. The verdict's validity window is exactly as wide as the artifacts it names and no wider. The column is bound to `jev 0.6.2`, provider `official`, model `jev-1.13.0`; the option set is hashed (`optionSetSha256`) and changes whenever any track description changes, because the hash is over the description pairs. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:585] Requalification is print-only and provider/model-scoped, and the row set itself is unpinned (iteration 3). A serving rollout therefore needs a requalification trigger — model, version, or option-set hash changed — before it can rely on the measured margin.

9. Privacy and credential semantics are already written down for measurement and must be inherited by a serving path. The measurement payload is "committed packet descriptions, fixture probe text and track descriptions", and the script "holds and reads no credential"; jev resolves its own. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1247] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:7] A default-on arm would send the user's prompt text to the provider, which is a new data-flow fact for the operator to accept explicitly, consistent with D1's "Jev gets no secret".

10. Failure semantics exist for the offline arm and need serving equivalents: exit 2 stops on usage error, exit 3 on a rejected key, exit 130 on interrupt, a timeout kills the child, and exit 4 retries once after a 2 s backoff. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1335] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1365] A serving caller needs a short timeout, a fail-open policy to the lexical result, and no silent substitution (the hub's own rule: transports never fail over silently).

## What A Default-On Integration Would Need

1. **A caller and a policy**, not new plumbing: reuse the `cli-jev` transport; decide the trigger (recommended: only when the trigger-index lookup yields no scoring rows, or the two lexical methods disagree), the `none` outcome (ask the user or fall back), and the fallback (today's lexical lanes).
2. **A budget**: one call per prompt at ~330 ms p50 and ~1.1k input tokens, gated to stay inside the prompt-hook latency budget the advisor eval treats as 2,200 ms; a short per-call timeout with fail-open.
3. **A requalification trigger**: re-run the measurement when `jev` version, provider, model or `optionSetSha256` changes; treat the printed keep as valid only for the pinned tuple.
4. **Telemetry**: log `pick`, `pickProb`, `noneProb` and outcome per served call, so calibration and drift are observable; the fields already exist in the call records.
5. **Measurement upgrades first** (from iteration 3): pin the row set, repeat the run, report cluster-aware slack — otherwise the 10-point margin is asserted on a row-level p over clustered data.
6. **An operator decision** to open the serving phase, per D1 and the 017 record.

## Ranked Risk Register

| # | Risk | Evidence | Mitigation |
|---|------|----------|------------|
| R1 | Wrong routing more often than right (37.9 percent row / 48.7 percent decided) | recorded verdict; iteration 3 clustering | serve only on lexical no-hit/tie; treat none as outcome |
| R2 | Validity window silently exceeded (model/version/option-set drift) | `JEV_VERSION`, `optionSetSha256`, print-only requalify | requalification trigger; pin tuple in telemetry |
| R3 | Latency on the prompt path (p50 330 ms vs 200 ms lookup budget) | recorded latency; `measure-cold-lookup.mjs:43` | no-hit-only trigger; fail-open timeout |
| R4 | Measured margin is thin (3.4 rows) and row-level p ignores clustering | iteration 3 | repeat runs, cluster-aware slack before rollout |
| R5 | Availability dormancy (no `jev`, version miss, no credential) | gate skip lines | matches D1; treat as sleeping, never as failure |
| R6 | Privacy (user prompts leave the machine) | payload description; D1 no-secret | operator acceptance; no credential in caller |
| R7 | Abstention misread as pick (22 percent none) | recorded column | define none explicitly; log it |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/implementation-summary.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt`
- `specs/cli-jev/003-cli-jev-workflow-integration/goal.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/spec.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs`
- `.skilled/skills/cli-classifier/SKILL.md`
- `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/lineages/deepseek/steer.md` (absent)

## Assessment

- newInfoRatio: 0.55
- Novelty justification: the iteration tied the measured column's validity window to the exact artifacts it is bound to (model tuple, option-set hash, unpinned rows), and reframed the integration cost as a critical-path latency multiplier rather than a token problem.
- Confidence: high for the recorded facts; the trigger recommendation (no-hit/tie only) is judgment grounded in the Gate 1 fail-open semantics and the latency facts.
- Code graph note: none used.

## Reflection

- Worked: the parent goal's D1 gave a ready-made fleet policy, which turned the availability/credential questions from open risks into compliance items.
- Failed: there is no recorded no-hit rate for Gate 1, so the fraction of prompts a no-hit-only trigger would serve is unknown; that is a required integration datum and is flagged, not estimated.
- Ruled out: full default-on pick replacement — accuracy and latency facts both argue for assistive, gated serving.

## Recommended Next Focus

Synthesis: rank the recommendations across Q1-Q5 into `research.md`, with the trust upgrades and measurement evidence producing a single ordered build list.
