# Research Synthesis: Jev Spec-Track Narrowing

## 1. Executive Summary

Jev beats ripgrep at choosing the exact spec track on the recorded 256-row benchmark: 97/256 (37.9%) versus 68/256 (26.6%), a paired net gain of 29 rows and a one-sided sign-test p-value of 0.006330. The preregistered keep gates pass. That is evidence of a relative improvement on this benchmark, not evidence that Jev is safe to use for hard narrowing: it still misses the exact track on 159/256 rows (62.1%), and the secondary paraphrase probes favor ripgrep, 8/14 to Jev’s 2/14. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:120-163] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:19-34]

The experiment is a useful screening result. It uses balanced, capped packet-description proxies and three option orders, while the current product question is how real Gate 1 requests route. The next decision should be an independently labeled live-request holdout, followed by calibrated abstention and a one-call serving experiment. Do not ship hard narrowing from the present keep verdict alone. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:83-95]

## 2. Research Questions and Scope

This synthesis addresses the five requested questions:

| Question | Answer |
|---|---|
| What drove the measured result? | The balanced packet-description corpus, the paired comparison against a weak lexical baseline, and a keep rule that tests relative lift but has no minimum absolute accuracy threshold. The run does not identify a causal model-internal reason for individual errors. |
| How can accuracy improve and cost fall? | Classify errors by track and abstention, improve contrastive track profiles and aliases where those errors show gaps, calibrate a selective Jev path, and test one serving choice instead of three evaluation orders. |
| How can measurement improve? | Use representative, independently adjudicated Gate 1 requests in a frozen holdout; record privacy-safe prompt and option hashes; report per-track, weighted, calibration, abstention, latency, and cost metrics. |
| Where else could judging help? | The system-skill-advisor near-tie skill-hub route is the strongest adjacent candidate; its evaluator already has a 70-item holdout and an opt-in Jev arm. |
| What does default-on need, cost, and risk? | A safe release gate, calibrated confidence, broad-search fallback, per-runtime latency budget, kill switch, privacy and provider checks, and a live holdout. Call and token totals are known for the benchmark; production volume and dollar pricing are not. |

Scope was read-only research over the recorded Jev run and repository sources. Feature 017 describes this scorer as choosing a spec track before lookup and ripgrep search; serving that choice in Gate 1 is explicitly deferred. No scorer rerun, live Jev call, code edit, or change to the parent packet was made. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:69-74,92-103]

## 3. Method

Three inline iterations read the feature 017 spec and plan, the scorer and trigger-index lookup, the recorded report/stdout/call log, and the skill-advisor evaluator and hook contract. They covered result drivers; accuracy, cost, and measurement; then adjacent routing and serving risks. No live model call or benchmark rerun was made. The final resource map was generated from the three lineage deltas and lists 11 cited source files. [SOURCE: iterations/iteration-001.md:1-42] [SOURCE: iterations/iteration-002.md:1-40] [SOURCE: iterations/iteration-003.md:1-38] [SOURCE: resource-map.md:13-39]

## 4. Measured Result

| Measure | Recorded result |
|---|---:|
| Test questions / coverage | K=256, M=256 |
| Jev exact-track answers | A=97/256 (37.9%) |
| Best baseline, ripgrep | B=68/256 (26.6%) |
| Jev wins / baseline-only wins | W=78 / L=49 |
| Paired net gain | 29 rows, or 11.3 percentage points |
| Order disagreement | F=47 nonmodal votes; 3 rows lack a two-vote mode |
| Jev none answers | 57 |
| One-sided sign test | p=0.006330 |
| Overall call latency | p50=330 ms; p95=391 ms |

All four frozen keep conditions pass: full coverage; the 29-row margin clears the pre-registered ten-point threshold; p is below 0.05; and F is below its flip bound. Those checks establish the rule’s “keep” result on this sample. They do not require a minimum absolute accuracy, so they can pass while Jev is wrong on most rows. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:67-72] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:19-33] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:880-886,927-977]

## 5. What Drove the Result

**The test set measures breadth over packet prose, not request traffic.** Each packet description becomes a question and the packet’s spec-track path becomes its gold answer. The builder caps each track at 20 questions selected by a deterministic path hash. Large tracks therefore contribute the same number as small tracks: the recorded build had 1,009 usable system-speckit packets and 261 system-deep-loop packets, but both were capped at 20; cli-orca supplied one and mcp-tooling six. This gives track coverage but cannot estimate the real frequency or mix of Gate 1 prompts. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:83] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:64] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:298-357] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:2-18]

**The result is relative to the stronger of two weak baselines.** Jev’s 97 correct answers exceed ripgrep’s 68, and the paired 78-versus-49 split supports a relative lift. But 159 Jev answers miss the exact gold track. The significance test does not answer whether that error rate is acceptable when the selected track scopes subsequent retrieval. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:120-126,140-163] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:927-977]

**Order and abstention are material.** The scorer asks each test and scored probe three times in different option orders. F=47 counts nonmodal votes, not 47 distinct rows that changed answer. Jev returned none on 57 rows, but none does not count as an exact-track match. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:68-72] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:843-858,927-976]

**The small paraphrase line weakens the transfer case.** Six of 20 Latin probes have no gold label; among the 14 scored probes Jev is correct twice while ripgrep is correct eight times. This secondary line does not decide keep, but it is a direct warning that packet-description performance may not transfer to natural paraphrases. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:88] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:34] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:131-138]

The sources do not explain which wording or track confusions caused individual Jev errors, or isolate a model choice as the cause of the aggregate result. A confusion analysis and a fixed, versioned request holdout are needed to answer that.

## 6. Accuracy and Cost Improvements

1. **Diagnose errors before rewriting the prompt.** Report per-track confusion, candidate-set recall, exact top-1, none/abstention, and true multi-track cases separately. Then revise short, contrastive track descriptions and add aliases only where errors expose missing distinctions. The present data do not prove that any one prompt edit will improve accuracy. Jev chooses among track options; it does not retrieve missing documents. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:585-631] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:69-71,86]

2. **Use a calibrated selective path.** Keep a validated high-confidence lexical decision when it is safe; spend a Jev call only on ambiguous requests; and use broad retrieval when the model returns none, confidence is low, or the prompt is out of domain. Thresholds must come from held-out real requests. The existing run does not establish a safe threshold or show that confidence is calibrated. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:456-465,585-631]

3. **Test one serving choice against three evaluation choices.** Three orders are useful for measuring order sensitivity; they are not proven necessary for each user request. One choice instead of three would reduce choice-call count by two thirds per ambiguous request compared with the test protocol. Measure answer changes and abstention on the frozen holdout before taking that saving. Shorter candidate descriptions, fewer candidates, and caching may reduce input work, but each has unmeasured recall, accuracy, freshness, or privacy tradeoffs. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1234-1248,1324-1393] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:67-69]

## 7. Trustworthy Measurement

Build a test set from real Gate 1 routing prompts and their intended destination, with consent and redaction controls. Record true “none” requests and cross-track requests instead of forcing every prompt into one track. Have two independent reviewers label ambiguous examples and adjudicate disagreements. Keep a time- or source-separated holdout that is not used to tune track wording; report both traffic-weighted accuracy and macro/per-track recall so frequent tracks do not conceal failures on smaller ones. The current packet-description proxy, track cap, and paraphrase probe provide the evidence for this design. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:83,88] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:234-270,298-357]

Freeze and identify the corpus snapshot, prompt template, option set, scorer commit, Jev CLI/provider/model version, retry policy, and percentile method. Keep raw prompt text out of ordinary telemetry. Add a keyed prompt digest and option-set hash so a run can be tied to its inputs without storing requests verbatim; a plain unsalted hash may reveal common prompts. Report paired confidence intervals, per-track precision/recall, calibration, abstention, candidate recall, failure rate, and cold/warm end-to-end latency. The current JSONL logs row, order, attempt, pick/probabilities, status, version/provider/model, and per-call time, but not submitted text or a prompt digest. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1098-1119,1301-1321] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl:1-811]

## 8. Other .skilled Judgments

The strongest adjacent opportunity is the system-skill-advisor route among skill hubs, specifically its near-tie cluster. The documented offline holdout top-1 is 53/70, and an existing Jev tie-break evaluator performs a zero-call census by default. It only invokes Jev when --jev is passed and backend checks pass; an arm that calls Jev must receive --out for its records. This makes the advisor a bounded next evaluation target, not evidence that Jev already improves that router. [SOURCE: .skilled/skills/system-skill-advisor/README.md:229-230] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:6-8,23-35]

The trigger-index lookup is a different problem boundary. It needs query tokens to admit candidates and returns no candidates when the token floor is empty. Jev’s track choice cannot fix a missing phrase candidate or a wrong document inside the chosen track. Improve and evaluate index/candidate recall for those failures rather than routing them through a track selector. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:132-169,197-210] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:69-71,94,98]

## 9. Default-On Integration Contract

Before enabling hard narrowing by default:

- Establish a frozen, independently labeled, real-request holdout and define minimum absolute accuracy and per-track recall requirements based on the cost of hiding relevant results. The current relative keep rule is not that release gate.
- Calibrate a confidence/abstention policy and handle multi-track or out-of-domain requests. None, low confidence, invalid output, missing Jev binary/auth, or timeout must preserve broad retrieval.
- Start in shadow comparison, then use a staged canary with an immediate kill switch. Compare the selected track and downstream search usefulness against the current route before changing the default.
- Preserve the current downstream lookup and ripgrep behavior after a track is selected; Jev’s measured job is track choice, not document retrieval or reranking.
- Pin and report the option set and Jev/model version. Keep privacy-safe, bounded telemetry and avoid raw prompt persistence.
- Fit the Jev call inside each runtime’s existing prompt-hook budget. The advisor’s current hook budget is 2,500 ms by default with a 10,000-character request head; its adapters have different outer runtime limits. Measure full cold and warm hook-to-search time, not only Jev subprocess time. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:25,33-43,53-58] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:139-141]

Feature 017 explicitly leaves hooks and served narrowing to a later phase and sends Jev the question text plus a fixed instruction and track option keys/descriptions, not repository files or paths unless they are present in the question itself. The configured Jev backend’s retention and network boundary are not established by these sources; verify both before rollout. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:92-103]

## 10. Cost and Risk

The call log contains 811 invocations: 768 test choices, 42 scored-probe choices, and one auth test. The recorded input estimate is 905,891 tokens. A nearest-rank recomputation gives test-choice p50/p95 of 330/390 ms, probe-choice p50/p95 of 315/370 ms, and 438 ms for the single auth check. The report’s aggregate p95 is 391 ms. These are per-call timings, not end-to-end hook-to-search latency. Feature 017 explicitly excludes a dollar figure. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl:1-811] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:120-163] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:103]

A serving path with one Jev choice for each ambiguous prompt would use one third the test arm’s choice calls per question, but the production request count, fraction of ambiguous prompts, prompt-token distribution, provider price, and cold-start behavior are unknown. So are actual production end-to-end latency and the backend’s retention policy. No dollar or monthly cost estimate is supportable from this evidence.

The primary correctness risk is false narrowing: selecting the wrong track can hide relevant specs from the later scoped search. Other risks are poor transfer from packet prose to real prompts, overconfident out-of-domain answers, model/provider or option drift, Jev/auth availability, hook timeouts, prompt disclosure, and cost growth. Broad-search fallback, versioned evaluation, and a kill switch address the operational risks; only a new holdout can establish whether accuracy is sufficient.

## 11. Recommendations

| Priority | Recommendation | Evidence and gate |
|---|---|---|
| 1 | Keep Jev offline for hard narrowing until the real-request holdout passes. | Current exact accuracy is 37.9%, the paraphrase probe favors ripgrep, and serving is out of scope for Feature 017. |
| 2 | Build and freeze an independently labeled Gate 1 request set; measure both traffic-weighted and per-track recall. | Current benchmark is capped packet-description proxy data and the call log cannot reconstruct prompt text. |
| 3 | Publish a confusion and abstention analysis before editing track profiles. | Current report gives aggregate counts; Jev answers none on 57 rows and exact errors are not attributed by track. |
| 4 | Compare one-choice and selective Jev serving against the three-order measurement protocol. | The three-call order rotation is a stability measure; the current evidence does not establish it as a user-path requirement. |
| 5 | Only after those gates, stage a default-on integration with confidence fallback, broad retrieval, per-runtime timeout, privacy-safe telemetry, and a kill switch. | Reuse the skill-advisor fail-open pattern, but verify Jev backend data and billing terms first. |

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Rerank trigger-index candidates with Jev | Not pursued in this track-narrowing research: earlier work dropped candidate reranking for no counted misrank, and Feature 017 explicitly excludes reopening it. This lineage did not rerun that comparison. | specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:71,93 | Prior research; 1-3 |

No implementation variants or new measurement designs were run and eliminated in this lineage.

## Divergence Map

| Direction | Recorded state |
|---|---|
| Completed pivots | 0 |
| Failed pivots | 0 |
| Audited overrides | 0 |
| Saturated directions | None recorded |
| Remaining frontier | None recorded in the reducer registry |

The three iterations broadened from benchmark mechanics, to accuracy and measurement, to adjacent routing and rollout controls. The registry still shows five imported questions open and zero resolved. Each iteration delta records its assigned questions as answered, but the projected iteration rows carry no answer lists; the reducer did not reconcile the answers. I left reducer-owned registry and strategy files untouched. [SOURCE: findings-registry.json:455-458] [SOURCE: deep-research-state.jsonl:2-4] [SOURCE: deltas/iter-001.jsonl:1] [SOURCE: deltas/iter-002.jsonl:1] [SOURCE: deltas/iter-003.jsonl:1]

## 12. Open Questions

The five requested research questions are addressed above. Inputs still needed before release are:

- A representative, permissioned Gate 1 request corpus and independent labels, including cross-track and no-track cases.
- Product-approved absolute accuracy and per-track recall floors, confidence threshold, and the failure cost of hiding relevant specs.
- Jev provider/model price, request volume, ambiguity rate, token mix, backend retention, and network/data-residency behavior.
- Cold and warm end-to-end latency across the actual prompt-hook runtimes and a verified failure/fallback path.
- Whether one serving choice preserves acceptable accuracy and abstention versus the three-order test arm.

## 13. Confidence

- **High:** The recorded run’s counts, keep-rule arithmetic, query construction, option-order rotations, call log fields, and secondary probe result. These are directly supported by the scorer, frozen plan/spec, and run artifacts.
- **Medium:** The conclusion that the benchmark does not represent real prompt traffic follows from its packet-description construction and per-track cap; the production distribution was not measured.
- **Medium:** Selective invocation, better descriptions, caching, and shadow/canary rollout are design recommendations, not measured improvements.
- **Unknown:** Production accuracy, dollar cost, request volume, Jev backend retention/network policy, cold-start latency, and per-track failure impact.

## 14. Evidence Limits

The evaluation has one recorded Jev run, one capped proxy corpus, and a small secondary probe set. It compares Jev with ripgrep’s stronger baseline under an exact-track metric; the committed trigger-index lookup is also measured at the Gate 1 boundary, but the supplied summary’s keep verdict reports the best baseline. The available evidence does not show a live request distribution, per-track error matrix, end-to-end timing, billing, or backend data policy. No causal claim about why Jev chose an incorrect track is made.

## 15. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Requested questions addressed in the synthesis: 5 / 5
- Iteration novelty ratios: 1.00, 0.88, 0.84
- Convergence threshold: 0.05
- Stop policy: max-iterations; earlier convergence was telemetry only.
- Divergence summary: no pivots, failures, overrides, or saturated directions recorded.
- Reducer registry status: 5 open / 0 resolved questions, despite the five answers in the deltas and synthesis; this state-projection mismatch remains visible and was not bypassed.

## 16. Boundaries and Artifacts

This lineage remained a research-only investigation. It did not rerun Feature 017, contact Jev, edit scorer code, modify the parent packet, invoke generate-context.js, run validate.sh, or use git write commands. Iteration narratives, deltas, prompts, reducer outputs, resource map, and this synthesis are contained in the luna lineage directory. The resource map was emitted from the three deltas and reports 11 references with none missing.

## 17. References

- Feature 017: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md: lines 69-103.
- Feature 017 plan: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md: lines 64-72.
- Track-narrowing scorer: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs: lines 234-270, 298-357, 456-465, 585-631, 843-858, 880-886, 927-977, 1059-1119, 1234-1248, 1258-1265, 1301-1321, 1324-1393.
- Trigger-index lookup: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs: lines 132-210.
- Recorded run report: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json: lines 120-163.
- Recorded call log: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl: lines 1-811.
- Recorded standard output: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt: lines 1-34.
- Skill-advisor hook: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md: lines 21-25, 33-43, 53-58.
- Skill-advisor architecture: .skilled/skills/system-skill-advisor/ARCHITECTURE.md: lines 125-141.
- Skill-advisor Jev tie-break evaluator: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs: lines 6-8, 23-35.
- Skill-advisor README evaluation: .skilled/skills/system-skill-advisor/README.md: lines 229-230.
- Lineage resource map: resource-map.md: lines 13-39.
