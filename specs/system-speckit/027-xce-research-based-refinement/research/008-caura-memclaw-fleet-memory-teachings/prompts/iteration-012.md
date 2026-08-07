ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code + docs): caura-memclaw ("MemClaw"), production fleet-memory system benchmarked on LoCoMo (77.6%) and LongMemEval (72.5%) with an LLM-judge methodology, and explicit "what these benchmarks can't measure" honesty. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. It ALREADY has eval tooling: eval_run_ablation, eval_reporting_dashboard, memory_health, drift diagnostics. So MemClaw's benchmark/eval METHODOLOGY is the comparable surface — how to measure memory quality honestly, what to measure, and what a metric can/can't capture.

CRITICAL JUDGMENT RULE: MemClaw's headline benchmarks (LoCoMo/LongMemEval) are conversation-shaped and fleet-shaped; Spec Kit's "corpus" is a developer's spec/continuity memory. The benchmark NUMBERS don't transfer, but the METHODOLOGY (LLM-judge over end-task, token-efficiency ratio, "what the metric can't measure", regression discipline) might. The actual scoring harness lives in a SEPARATE repo (keystone-benchmark, not vendored) — focus on what's IN this repo: docs/performance.md methodology + any in-repo eval/test scaffolding. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 012): BENCHMARK / EVAL METHODOLOGY. How MemClaw frames "is the memory good?": metrics chosen (accuracy via LLM-judge, token-efficiency ratio, latency), what it deliberately does NOT claim, and any in-repo eval/regression scaffolding (tests, fixtures) that demonstrate the methodology.
Read these entry points first, follow imports/tests WITHIN caura-memclaw only (cap ~15 files). Grep for: "benchmark", "eval", "locomo", "longmemeval", "judge", "accuracy", "recall", "regression", "golden", "fixture".
- docs/performance.md
- README.md  (section "Performance")
- tests/  (look for eval/benchmark/regression test structure — list what categories exist)
- core-operations/src/core_operations  (any scheduled quality/health checks)
- any */conftest.py or fixtures relevant to memory-quality testing

DELIVERABLE — markdown with EXACTLY these sections (cite file:line / path):
## Mechanism
MemClaw's eval philosophy: metrics, LLM-judge approach, honesty about limits, and in-repo test/regression scaffolding. file:line / path evidence.
## Teachings for Spec Kit Memory (eval / ablation / health)
2-5 items. For EACH: **Claim** · **Evidence** (file:line/path) · **Maps-to** (027 child or "new sub-packet"; relate to Spec Kit's eval_run_ablation / dashboards / memory_health) · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local.
## Negative knowledge
Fleet-benchmark/external-leaderboard machinery with little payoff for local memory-quality measurement.
## Open questions
For a deeper pass.

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"012","focus":"benchmark / eval methodology","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ..."],"sources":["path:line"]}
