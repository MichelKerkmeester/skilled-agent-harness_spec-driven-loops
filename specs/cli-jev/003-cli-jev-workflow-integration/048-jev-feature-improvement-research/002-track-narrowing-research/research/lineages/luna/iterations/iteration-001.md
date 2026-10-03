# Iteration 1: Explain the measured result

## Focus
Explain the measured result through corpus construction, scoring, model-call shape, and the gap between relative improvement and absolute accuracy.

## Findings
- **F1 — The 256-row test set is a capped packet-description proxy** Feature 017 turns each packet description into a question and uses its track as the gold label. The 20-row per-track cap is selected by a deterministic hash of the packet path. This intentionally balances the option set but cannot represent real Gate 1 request frequency: system-speckit had 1,009 usable rows and system-deep-loop 261, yet each contributes 20; cli-orca contributes one and mcp-tooling six. The run tests broad track coverage on repository prose, not measured traffic prevalence. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:83] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:64] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:298-357] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:2-18]
- **F2 — The keep verdict is a paired gain over a weak baseline, not a high-accuracy result** Jev is correct on 97/256 (37.9%) versus ripgrep on 68/256 (26.6%), a derived net gain of 29 rows or 11.3 percentage points; 78 rows favor Jev and 49 favor ripgrep. The exact one-sided sign test is p=0.006330, so the relative lift is supported on this sample while 159/256 Jev picks still miss the gold track. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:19-23,33] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:120-126,140-163] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:927-977]
- **F3 — All four preregistered keep gates pass at full measurement coverage** M=K=256 gives 100% coverage. A-B=29 clears the required ten-point margin because 10 times 29 equals 290, which is at least 256; p=0.006330 clears 0.05; and F=47 clears the flip bound because 10 times 47 equals 470, which is at most 3 times 256. The verdict is internally consistent with its frozen rule, but the rule is relative and does not require a minimum absolute accuracy. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:22-23,32-33] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:69] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:880-886,927-975]
- **F4 — F=47 is a vote-level disagreement count, while unstable and abstained are separate row counts** Each question is asked in three option orders and reduced to its modal answer. F adds three minus the modal vote count per measured row; it is not 47 distinct rows that changed answer. The reported 47 nonmodal votes yield a 6.12% vote flip rate, only three rows have no two-vote mode, and 57 rows choose none. Those 57 abstentions are not correct track predictions under the exact-match metric. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:68-72] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:843-858,927-976] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:25-26,32-33]
- **F5 — The secondary paraphrase result points in the opposite direction and is excluded from keep** Of 20 Latin probes, six have no gold label; on the 14 scored probes Jev gets two right while ripgrep gets eight. The spec explicitly makes this line secondary and non-verdict-bearing. It is a concrete warning that success on repository packet descriptions may not transfer to paraphrased Gate 1 requests. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:88] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:34] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json:131-138]
- **F6 — The measured arm repeats a large option payload three times per row** Every test row and scored probe receives three choice calls over the 16 track descriptions plus none, with no answer cache. The 811 total planned Jev invocations include 810 choices plus one auth test; estimated input is 905,891 tokens. The report contains token estimates and timing, not a dollar charge. A one-call production path or shorter candidate profiles could lower work, but must be remeasured because the three orders currently provide the reported stability check. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:67-69] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1234-1248,1261-1290,1324-1393] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:25-33] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md:103]
- **F7 — The call log records choices but not the question payload itself** Each JSONL call row keeps rowId, option order, attempt, pick and probabilities, status, version, provider, model, and wall time. It does not keep submitted question text or a digest of that text, so exact prompt reconstruction depends on the source descriptions still matching the measured snapshot. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1098-1119,1301-1321]

## Sources Consulted
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md: lines 83, 88, 103.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md: lines 64-72.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs: lines 298-357, 843-858, 880-886, 927-977, 1098-1119, 1234-1248, 1261-1290, 1301-1321, 1324-1393.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt: lines 1-34.
- specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json: lines 120-163.
- steer.md: checked before iteration 1; absent.

## Assessment
- newInfoRatio: 1.0
- Novelty justification: First iteration; it decomposes the supplied headline result into corpus selection, paired lift, keep-gate arithmetic, abstention and stability semantics, probe disagreement, and call-cost evidence.
- Confidence: High for the recorded run and scorer behavior; medium for the inference that this proxy differs from real request distribution, because no live Gate 1 request corpus is measured here.

## Questions Answered
- What drove the benchmark result, and which data, model, or metric choices explain it?

## Questions Remaining
- Which changes can raise accuracy or lower cost without weakening the route?
- How can a new measurement better represent real Gate 1 requests and produce trustworthy estimates?
- Which other .skilled routing or classification decisions could benefit from measured judging?
- What controls, cost, fallback, and risks would default-on integration require?

## Reflection
- What worked and why: Reading the scoring functions beside the exact recorded report made the relative keep rule and the absolute-error gap auditable.
- What did not work and why: The current run cannot show whether live prompts resemble packet descriptions; the call log does not archive the submitted text.
- What I would do differently: Build an independently labeled, frozen request holdout and keep a privacy-safe prompt hash plus option-set hash in each call record.

## Recommended Next Focus
Design the better measurement and cost controls from the corpus, prompt, and runtime evidence; distinguish evaluation-only repetitions from a production request path.
