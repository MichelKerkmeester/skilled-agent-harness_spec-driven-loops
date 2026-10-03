# Iteration 3: Adjacent judgments and default-on contract

## Focus
Identify adjacent routing judgments and define the evidence, serving, cost, fallback, and privacy requirements for default-on track narrowing.

## Findings
- **F14 — The skill advisor’s near-tie route is the strongest adjacent candidate** The skill advisor already chooses among skill hubs and has an offline near-tie Jev evaluator. Its documented holdout top-1 is 53/70; the evaluator’s default is a zero-call census, and its Jev arm only runs behind --jev after backend checks, with --out required for call records. This is a high-value next place to test measured judging because its present routing result and holdout are concrete; the 53/70 figure alone does not show that Jev improves it. [SOURCE: .skilled/skills/system-skill-advisor/README.md:229-230] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:6-8,23-35]
- **F15 — Jev can choose a spec track, but it cannot repair a retrieval miss inside that track** Feature 017 says Jev chooses among the 16 spec tracks plus none; lookup and ripgrep then search within the selected track, and reranking is explicitly out of scope. The trigger-index lookup returns an empty result when no query token clears its candidate floor. Therefore, invest in measured track choice only for track-selection errors; for paraphrases that produce no useful index candidate or for a wrong within-track document, improve retrieval/index recall separately. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:69-71,86,94,98] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:132-169,197-210]
- **F16 — A default-on hook needs a fail-open contract and a bounded request path** Existing skill-advisor hooks keep prompts moving on timeouts, failures, and no route; they expose a kill switch, send bounded prompt text over stdin, never persist raw prompts in diagnostics, and fall back when routing fails. The default Jev integration should preserve those properties, use a per-runtime latency budget rather than add a second full hook timeout, and return to broad retrieval for none, low confidence, unsupported input, missing binary/auth, timeout, or invalid output. This is a recommendation based on the current hook contract; Jev’s production hook behavior is not implemented or measured. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-25,33-43,53-58] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:139-141]
- **F17 — Keep the current arm offline until an independent request holdout supports safe narrowing** Feature 017 explicitly leaves hooks, Gate 1 changes, and served narrowing for a later phase. Its measured Jev arm gets 97/256 exact tracks (37.9%), versus ripgrep’s 68/256 (26.6%); relative improvement does not establish that 159 Jev misses are safe to hide behind a narrower search. Before enabling hard narrowing by default, require a frozen real-request holdout, minimum absolute accuracy and per-track recall criteria, calibrated abstention, shadow comparison, staged canary, and a fast kill switch. Set actual release thresholds from product loss tolerance rather than inferring them from p=0.006330. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:92-95] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:120-126,140-163] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:25,35-40]
- **F18 — The current evidence prices benchmark work in calls, tokens, and subprocess time, not dollars or serving volume** The recorded evaluation has 811 Jev invocations: 810 choices from three orders over 256 test rows and 14 scored probes, plus one auth test; estimated input was 905,891 tokens. Per-call nearest-rank p50/p95 was 330/390 ms for test choices and 315/370 ms for probes, while auth took 438 ms; this is not end-to-end hook latency. A one-choice serving arm would use one third the choices per ambiguous request versus the three-order test arm, but production request volume, the eligible ambiguity rate, token mix, pricing, and cold-start cost are unknown. Feature 017 excludes dollar accounting. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl:1-811] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:120-163] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1234-1248,1258-1265,1324-1393] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:103]
- **F19 — Minimize prompt disclosure and version drift at the Jev boundary** The evaluator sends the question text, one fixed instruction, and the track option keys/descriptions; it does not send files or paths unless the question itself contains them. Keep raw prompts out of durable telemetry, minimize or redact prompt content where possible, use a protected digest for reproducibility, and pin and report Jev/model and option-set versions. The configured backend’s data retention and network boundary are not established by these sources and must be verified before a default-on rollout. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:96,101] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1098-1119,1234-1248,1301-1321]

## Sources Consulted
- .skilled/skills/system-skill-advisor/README.md: lines 229-230.
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs: lines 6-8, 23-35.
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md: lines 21-25, 33-43, 53-58.
- .skilled/skills/system-skill-advisor/ARCHITECTURE.md: lines 139-141.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs: lines 132-169, 197-210.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs: lines 1098-1119, 1234-1248, 1258-1265, 1301-1321, 1324-1393.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md: lines 69-71, 86, 92-103.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json: lines 120-163.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl: lines 1-811.
- steer.md: checked before iteration 3; absent.

## Assessment
- newInfoRatio: 0.84
- Novelty justification: This iteration moves from scorer changes and evaluation design to adjacent skill-hub routing, retrieval boundaries, actual hook constraints, release controls, and what cost and privacy evidence is missing.
- Confidence: High for existing offline evaluation behavior, hook limits, and recorded call/timing data; medium for release recommendations; UNKNOWN for Jev backend retention, production traffic volume, dollar pricing, and end-to-end latency.

## Questions Answered
- Which other .skilled routing or classification decisions could benefit from measured judging?
- What controls, cost, fallback, and risks would default-on integration require?

## Questions Remaining
- No research question remains; synthesis should consolidate the five requested answers and name the unknown release inputs.

## Reflection
- What worked and why: Comparing the Jev experiment to the advisor’s existing holdout and hook contract exposed an adjacent route with a concrete evaluation and a practical fail-open model.
- What did not work and why: The repository evidence cannot establish backend data retention, request volume, dollar pricing, or production end-to-end latency.
- What I would do differently: Verify backend privacy and billing terms and collect the real request holdout before proposing any default-on threshold.

## Recommended Next Focus
Synthesize the measured result, accuracy and cost proposals, trustworthy measurement plan, adjacent advisor opportunity, and gated default-on contract; record maxIterationsReached as the terminal stop reason.

