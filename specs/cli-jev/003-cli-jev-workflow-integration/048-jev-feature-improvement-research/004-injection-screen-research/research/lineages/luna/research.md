# Progressive Research Synthesis

## Scope

This lineage analyzes the existing Jev fetched-text injection-screen benchmark and default-on integration path. It does not rerun Jev or modify product code.

## Answered Questions

### 1. What drove the measured Jev result?

Jev scored 81 of 90 rows correctly against a 56-row best baseline, satisfying the predeclared coverage, precision, margin, sign-test, and flip gates. Its three-call majority probability is evaluated per row. The comparator is four fixed lexical patterns chosen only when they beat flag-nothing. The dataset contains 55 natural clean rows, 5 natural instructions, and 30 planted instructions, all based on bounded sections of vendored Markdown. The score is strong evidence on that fixed mixture; the benchmark has not yet measured real WebFetch/WebSearch payloads. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:43-60] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:642-655] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:754-830] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:43,88-100]

### 2. How can accuracy improve or cost fall?

Refine the target labels so hostile attempts to redirect agent authority are distinct from legitimate instructions and quoted attacks. Do not use lexical misses to bypass the semantic screen. For live use, budget one classifier call per exposed payload or bounded chunk, and measure calls, tokens, end-to-end latency, retries, timeouts, and cache behavior; keep three reruns for offline stability measurement. Treat score bands as advisory/quarantine signals and apply separate deterministic permission checks to actions. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:48-59] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:1015-1052] [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html]

### 3. How can the measurement become more trustworthy?

Blindly double-label natural and hard-benign cases, preserve disagreements and label provenance, freeze thresholds before evaluation, and add source/domain holdouts with hard benign, obfuscated, multilingual, structural, and real-fetch output slices. Report error rates and calibration per slice with source-cluster bootstrap intervals; the current 90-row point estimates have wide naive intervals and three repeated calls measure same-row stability only. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:791-830] [SOURCE: https://arxiv.org/abs/2609.15017]

## Open Questions

4. Where else in .skilled would the same judgment pay off?
5. What would default-on integration need, cost, and risk?

## Stop Policy

max-iterations; run all three iterations even if convergence appears early.


## 4. Where else in .skilled would the same judgment pay off?

Deep research already tells the agent to treat WebFetch/WebSearch pages as untrusted data and never let page text trigger tools, but this is an instruction-level rule and the skill notes there is no URL/domain allowlist. A fetch-boundary verdict could reinforce that rule before retrieved text reaches later synthesis. Council graph query is another direct prompt sink: its test material records that user-influenced seat output and critiques can bleed into synthesis prompts, so it already uses an allowlist and string bounds for metadata. Keep that structural protection; a general classifier is not a replacement for schema checks. The sk-code review playbook's source-to-sink review of untrusted values in SQL, command, path, SSRF, and HTML sinks is an adjacent use of the same provenance discipline, though the fetched-text detector cannot replace sink analysis. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:347,360] [SOURCE: .skilled/skills/cli-classifier/SKILL.md:114] [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-query-hostile-metadata-redaction.md:15-20,27-33] [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/security-and-correctness-minimums/input-validation-injection.md:19,47-49]

## 5. What would default-on integration need, cost, and risk?

Feature 035 explicitly has no hook, matcher, or fetch wrapper. The existing dispatch catalog covers Bash/exec and documents different payloads by host, so serving needs a tested adapter at each WebFetch/WebSearch result boundary, after HTML conversion and before the result rejoins model context. Carry source identity, content hash, transform/chunk version, classifier version, and score with the returned content. If a runtime cannot rewrite or annotate the result there, implement the adapter in its fetch/MCP wrapper; a generic post-tool audit is not an enforcement mechanism. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:43] [SOURCE: .skilled/hooks/dispatch/README.md:64-74] [INFERENCE: the exact result-replacement contract must be verified per host.]

Keep thresholds advisory until a real-page holdout supports an action policy. The benchmark's .25/.50/.75 bands can route annotation or review; independent user-intent and runtime-permission checks must still authorize tools. The Jev run used 271 calls for 90 rows, with call p50 324 ms and p95 388 ms; one classifier call per full payload or bounded chunk is a reasonable serving starting point, while live end-to-end latency, retry/timeout behavior, cache rate, token totals, and monetary spend remain unknown. Estimate production cost from those measured units after testing real converted pages, and require an exact versioned content/policy key for any cache. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:53-59,1015-1052] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113] [SOURCE: https://cheatsheet.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html]

Start in shadow mode on real fetch captures, with held-out sources and hard-benign instructions, quoted attacks, multilingual and obfuscated examples. The current result is on 5-60-line sections of public vendored Markdown, while actual fetched pages are longer, HTML-converted, and agent-selected. Define explicit outcomes for timeout, truncation, and unsupported hosts; report those as unscanned, preserve permission gates, and promote enforcement only after per-host boundary tests and false-positive review. Because the current corpus is public but production fetches may contain private content, decide provider handling and retention before forwarding live text to a hosted classifier. The false-positive, latency, privacy, and drift costs have no measured production estimates yet. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/implementation-summary.md:170-173] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:140-146] [SOURCE: https://cheatsheet.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html] [INFERENCE: privacy exposure and rollout costs depend on production payloads and provider policy.]

## Final Status

Questions 1-3 are answered in the earlier sections; questions 4-5 are answered above. The result is promising for the fixed benchmark mixture and not yet a production safety guarantee. The next research or implementation packet should first prove one host's pre-context fetch boundary and quantify real-payload false positives and latency.

## Convergence Report

- Stop reason: maxIterationsReached
- Iterations completed: 3 of 3
- Convergence threshold: 0.05
- Iteration novelty telemetry: 0.90, 0.83, 0.75
- Synthesis: all five questions answered; production hook support, end-to-end cost, and real-page error rates remain to be measured.

