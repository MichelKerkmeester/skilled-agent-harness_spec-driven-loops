# Iteration 2: Improve accuracy, cost, and measurement

## Focus
Specify accuracy and cost improvements, and design a more trustworthy, reproducible measurement of real Gate 1 requests.

## Findings
- **F8 — Improve accuracy by separating candidate recall, track choice, and abstention** The Jev arm currently chooses among 16 track descriptions plus none; the keep statistic scores only the final exact track match, while the secondary paraphrase probe scored Jev 2/14 against ripgrep 8/14. A useful next experiment should first report whether the correct track is present in any candidate set, then judge top-1 accuracy, per-track confusion, and none/multi-track handling separately. Add short, contrastive track profiles and real aliases only where error analysis identifies missing distinctions. These are proposed changes; the recorded run does not yet establish which will improve accuracy. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:585-631] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:131-138]
- **F9 — Put a calibrated selective path between the lexical baseline and Jev** The current experiment asks Jev for every row, with three order variants. A production experiment could keep a high-confidence lexical route, invoke Jev only on ambiguous requests, and preserve broad retrieval when neither path clears a validated threshold. This can reduce calls while limiting the cost of an incorrect narrowing decision; thresholds and fallback conditions must be measured on held-out requests, because the current data do not establish safe lexical confidence cutoffs. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:456-465,585-631,1324-1393]
- **F10 — The current three-order protocol is evaluation repetition, not a proven production requirement** The log has 768 test calls (256 rows × 3), 42 scored-probe calls (14 × 3), and one auth check: 811 total. The scored test arm therefore uses three choice calls per question to measure order sensitivity. A one-choice serving path would use roughly one third as many choice calls per question, and shorter descriptions or fewer candidates may reduce input tokens; neither saving nor the effect on accuracy was measured here. The existing run estimates 905,891 input tokens, and Feature 017 explicitly excludes dollar-cost accounting. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1234-1248,1261-1290,1324-1393] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl:1-811] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:25-33] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:103]
- **F11 — Build a request holdout with independently adjudicated labels** Packet descriptions are convenient proxy questions, but the opposite paraphrase result shows that proxy accuracy may not transfer to Gate 1 traffic. Collect a consented, redacted sample of actual routing requests and final intended destinations; label none and genuinely cross-track requests explicitly; double-label ambiguous rows and adjudicate disagreements. Freeze the corpus and split by source/packet or time before prompt/model tuning, then report per-track precision/recall, coverage, abstention, confusion, and paired confidence intervals against ripgrep. This would address representativeness and label leakage risks without using the evaluation set to tune the prompt. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:83,88] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:234-270,298-357]
- **F12 — Keep prompts private while making the run reproducible** The call records include option order, attempt, outcome and probabilities, model/provider/version, and wall time, but do not capture the submitted question or a prompt digest. Preserve no raw prompt by default; add a keyed or salted prompt digest, corpus snapshot identifier, prompt-template and option-set hashes, scorer commit, CLI/model version, and explicit retry/timeout outcome. That would let reviewers tie results to the tested inputs and exact configuration while lowering exposure of user text. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1098-1119,1301-1321]
- **F13 — Report latency by path, because the aggregate is not live-request latency** A nearest-rank recomputation from calls.jsonl gives test-choice p50/p95 of 330/390 ms, probe-choice 315/370 ms, and the single auth check 438 ms; the report's aggregate p95 is 391 ms. The aggregate mixes tests, probes, and auth, and the measurement is per jev subprocess call rather than full hook-to-search time. Track cold and warm end-to-end request latency, including hook startup, lookup, Jev invocation and fallback, with per-class sample counts and percentile method. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl:1-811] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:120-163] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1059-1096,1258-1265,1324-1393]

## Sources Consulted
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs: lines 38-61, 234-270, 456-465, 585-631, 1059-1119, 1234-1248, 1258-1265, 1301-1321, 1324-1393.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs: lines 132-210.
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md: lines 25-45.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md: lines 83, 88, 103.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl: lines 1-811.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json: lines 120-163.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt: lines 25-34.
- steer.md: checked before iteration 2; absent.

## Assessment
- newInfoRatio: 0.88
- Novelty justification: This iteration turns the prior result decomposition into accuracy diagnostics, a selectively gated serving experiment, a real-request evaluation design, prompt-safe reproducibility fields, and per-path latency evidence.
- Confidence: High for scorer shape, call counts, and logged per-call timings; medium for recommended improvements, which need a new frozen holdout to establish their effect.

## Questions Answered
- Which changes can raise accuracy or lower cost without weakening the route?
- How can a new measurement better represent real Gate 1 requests and produce trustworthy estimates?

## Questions Remaining
- Which other .skilled routing or classification decisions could benefit from measured judging?
- What controls, cost, fallback, and risks would default-on integration require?

## Reflection
- What worked and why: Recomputing timings from the existing call log separated the actual choice-call distributions from the aggregate report without rerunning the scorer.
- What did not work and why: The run has no live Gate 1 request corpus, no prompt digest, and no dollar price evidence, so accuracy transfer and financial savings remain unmeasured.
- What I would do differently: Freeze an independently labeled live-request holdout before changing the candidate profiles or serving threshold.

## Recommended Next Focus
Map adjacent measured routing judgments in .skilled, then derive the default-on contract, costs, fallback behavior, and privacy and availability risks from the existing hook architecture.

