---
title: "Deep Research Strategy: Jev typed judgments, UX and measurement lens (mimo lineage)"
trigger_phrases: []
---
# Deep Research Strategy: Jev typed judgments, UX and measurement lens (mimo lineage)

## Research Topic

Where do Jev typed judgments earn a measured, opt-in, UX-first place in this repository's skills, workflows and logic? This lineage answers as the UX and measurement lens: for every candidate integration, what the operator sees, decides or types differently, its default, and the proof design (metric, recorded baseline, harness, shadow or A/B arm) that would show it helped before any Jev answer is served.

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` is skipped by the runner's instruction.
- All writes are bounded to this lineage directory. Spec writeback, continuity saves, validation runs and git operations are out of scope.
- The four digests under `PHASE/context/` are the grounding. A digest citation this lineage did not reopen is quoted as the digest's claim, never as its own.
- Jev means the Python `jev-cli` 0.6.2 wrapped by `.skilled/skills/cli-jev/cli-usage/`. The vendored npm `jevctl` 0.2.3 is research material only and its exit codes disagree with the Python contract (exit 2: usage error vs tripped gate).
- No live `jev` call is permitted in this research. Every judgment is billed and state leaves the machine.
- Operator UX values (repo-rules-digest §5): a Jev integration serves UX when it removes a decision or check from the operator, and hurts it when it adds a flag, a prompt or a report to parse. Surface a probability or score only when it changes the operator's next action.
- Measurement doctrine (repo-rules-digest §2 items 6-8): every usefulness claim needs a metric, a baseline and a harness, and the proof plan is written before the build.

## Key Questions

- [x] RQ1: Which grading use changes something the operator sees or decides, and what gold set plus agreement metric proves it? (mimo-01 — answered: the D4 grader arm; drops named; gold is 8 single-class cases needing expansion)
- [x] RQ2: Is there measurable headroom on the advisor corpus for a Jev tie-break, and what shadow design proves it without touching the ratchet? (mimo-02 — answered: bounded headroom, offline arm design, never-served rule)
- [x] RQ3/RQ4: Would a Jev goal verdict or compaction pass reduce operator nudges, lost context or repeated work, and what labeled set measures it? (mimo-03 — answered: both later, labeled sets sized and assigned, in-hook shape dropped)
- [x] RQ5a: Would a Jev stop signal save iterations at equal cited-finding count? (mimo-04 — answered: replay design over 181 lineages with free derived gold)
- [x] RQ5b: Would a Jev severity call agree with adjudicated gold often enough to save a human pass? (mimo-05 — answered: transitions-derived gold, thresholds 0.9 recall and 30% reduction)
- [x] RQ5c: Which validation, routing clarify and defer seams show operator friction a Jev suggestion could pre-answer? (mimo-06 — answered: friction ranked, gold census done, Gate 3 drops as product)
- [x] RQ6: Which new commands or workflows remove a decision from the operator rather than adding one? (mimo-07 — answered: none new; three workflow-step surfaces named with defaults)
- [x] RQ6/RQ7: What is the pre-build proof plan per surviving surface? (mimo-08 — answered: six proof plans with keep-thresholds and boundary cases)
- [x] RQ7a: What does a day of use cost, what latency is felt, what leaves the machine? (mimo-09 — answered: cents at vendor claims, latency unmeasured and leveraged, payload classes classified)
- [x] RQ7b: Which slice produces a usable number soonest, and what waits on a gold set? (mimo-10 — answered: free-first order; eight ideas parked on named gaps)

## Exhausted Approaches

- Live `jev` probing: forbidden by the per-iteration contract (rule 8) and unnecessary for UX and measurement design.
- Treating digest baselines as this lineage's own measurements: they are quoted with their digest attribution unless reopened.

## What Worked

- Opening the cited code instead of trusting the digests: every one of the lineage's own corrections (silent-0.0 grader path, tau mismatch, fixture census, transitions gold, runner-path disowning) came from reopening a file the digests had summarized.
- Derived gold from existing artifacts (delta first-appearance sources, registry transitions) instead of waiting for labels.
- Sibling cross-reading from wave 2 on: it produced two real contests and several cross-lens marks instead of repeated findings.

## What Failed

- The first canary-census parse guessed the fixture schema and returned all `?`; reading one case's shape first would have saved a call.
- newInfoRatio stayed flat at 0.7 for seven iterations; per the reducer's own doctrine that makes the signal near-inert, and the honest spread (0.5 for synthesis-heavy iterations) was only adopted from iteration 7.

## Next Focus

Loop complete at the cap (10/10). Terminal record carries `stopReason: maxIterationsReached`. The lineage synthesis is `research.md`; the merged cross-lineage synthesis is the orchestrator's next step.
