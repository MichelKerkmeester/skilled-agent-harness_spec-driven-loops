# Iteration 3: Where the judgment applies and what serving requires

## Focus

Locate adjacent untrusted-content surfaces in .skilled, then map the runtime seam, requirements, measured cost, and risks for a default-on fetched-text screen.

## Findings

1. **Deep research already names the same trust boundary, but its current protection is an agent instruction.** The deep-research skill says WebFetch/WebSearch content is data to analyze and cite, never instructions, and says fetched content must not directly trigger tools. It also records that WebFetch has no URL/domain allowlist. The cli-classifier skill says no hook screens fetched content and no verdict is wired to a runtime. A screen could add a second signal at retrieval time, while provenance and instruction hierarchy remain necessary even when the score is low. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:347,360] [SOURCE: .skilled/skills/cli-classifier/SKILL.md:114]

2. **Council graph query is a concrete neighboring prompt sink, and it already uses the right kind of structural guard.** Council artifacts can contain user-influenced seat output and critiques; graph metadata that flows into later synthesis prompts is allowlisted and length-bounded. This makes graph ingestion/query a good place to preserve provenance and reject arbitrary free-form metadata. The existing allowlist is a better fit than applying a general fetched-page classifier to structured graph fields. [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-query-hostile-metadata-redaction.md:15-20,27-33]

3. **Code review already asks for source-to-sink evidence, which complements content screening.** The sk-code review playbook traces untrusted input into SQL, command, path, SSRF, and HTML sinks and rejects generic advice without a concrete source and sink. The same provenance habit pays off when a review consumes issue text, documentation, or fetched references, but an injection score cannot replace the code review's sink analysis. [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/security-and-correctness-minimums/input-validation-injection.md:19,47-49]

4. **Feature 035 has no serving seam to turn on today.** Its frozen scope adds an offline scorer only: no hook, settings matcher, or fetch wrapper, so fetch behavior is unchanged. The runtime dispatch-hook catalog describes hooks around Bash or exec and other audit/preflight tools; that is not evidence of a WebFetch result-replacement contract. A serving phase must first prove, per host, that it can inspect the complete converted result before it rejoins model context. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:43] [SOURCE: .skilled/hooks/dispatch/README.md:64-74] [SOURCE: .skilled/skills/cli-classifier/SKILL.md:114]

5. **A default-on path needs a fetch-boundary adapter and a stable content envelope.** Place the check after HTML/search-result conversion and before returned text enters the model context. Carry the tool, URL or source identity, content hash, conversion/chunking version, classifier prompt/model version, and score with the text. For long results, define bounded chunks with overlap and a rule for instructions that straddle boundaries; mark truncated or unscored content explicitly. If a host cannot replace or annotate a WebFetch result at that boundary, put the adapter in its fetch/MCP wrapper rather than treating a generic post-tool audit as enforcement. [INFERENCE: feature 035 excludes this serving wrapper, and the dispatch catalog documents different per-runtime event payloads; the exact replacement capability still needs a per-host proof.] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:43,88-100] [SOURCE: .skilled/hooks/dispatch/README.md:64-74]

6. **Keep score policy separate from tool authority.** The benchmark emits review, flag, and block counts at 0.25, 0.50, and 0.75. Use a score to annotate, quarantine, or request review; independently enforce user-intent checks and runtime permissions before consequential actions. OWASP recommends input screening alongside deterministic controls and action screening, notes that a guardrail can itself be attacked, and describes risk-based heavier checks. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:53-59] [SOURCE: https://cheatsheet.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html]

7. **The live cost baseline is call latency, not end-to-end serving cost.** The Jev benchmark planned 271 calls for 90 rows: three fresh judgments per row plus auth. The recorded call latency is p50 324 ms and p95 388 ms, while each request estimates tokens from text length. A serving design could start with one call per fetched payload or bounded chunk, but its actual added p50/p95, token volume, retries, timeouts, cache rate, and monetary cost remain unmeasured. Repeated calls belong in offline stability evaluation, not automatically on every fetch. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:1015-1052] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113] [INFERENCE: one call per payload/chunk is a serving proposal, not a measured delta.]

8. **Default-on should be earned through shadow measurement and explicit failure states.** The current positives are planted sentences in bounded sections of public vendored Markdown; the implementation record says actual fetched pages are longer, HTML-converted, and agent-selected. Begin with real fetch captures and a source-held-out, hard-benign set in shadow mode; separately measure false positives on legitimate instructions and security documentation. Log only the minimum needed for drift analysis, define retention and provider handling for fetched text, and label timeouts or skipped chunks as unscanned rather than clean. Only promote thresholds after per-host tests show the result is attached before model continuation; preserve deterministic permission checks if the classifier is unavailable. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/implementation-summary.md:170-173] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:140-146] [SOURCE: https://cheatsheet.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html] [INFERENCE: shadow rollout and the proposed failure-state policy are recommendations, not measured feature-035 behavior.]

## Ruled Out

- Treat the deep-research instruction to regard fetched pages as data as equivalent to an enforced fetch-result screen; the same skill says no WebFetch URL/domain allowlist exists, and cli-classifier says no hook is wired. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:347] [SOURCE: .skilled/skills/cli-classifier/SKILL.md:114]
- Reuse the existing Bash/exec dispatch audit as a WebFetch filter without proving the host event and payload contract. [SOURCE: .skilled/hooks/dispatch/README.md:64-74]
- Use Jev's detector verdict as permission to invoke tools or as a substitute for structural metadata controls and code sink review. [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-query-hostile-metadata-redaction.md:15-20] [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/security-and-correctness-minimums/input-validation-injection.md:19] [SOURCE: https://cheatsheet.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html]

## Edge Cases

- A legitimate skill page may contain imperative instructions, quoted hostile examples, or security guidance. The benchmark's current binary label does not fully distinguish those cases, so a false positive can hide useful content or disrupt research. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:52] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90]
- The source materials establish that the current project has no wired fetch verdict; they do not establish the event-replacement capabilities of every runtime version. Verify those host contracts before selecting a fail-open, quarantine, or annotation behavior. [INFERENCE: current per-runtime hook descriptions are not a WebFetch integration test.] [SOURCE: .skilled/hooks/dispatch/README.md:64-74]

## Sources Consulted

- deep-research-config.json, deep-research-strategy.md, research.md, and iterations/iteration-002.md (read before iteration 3)
- steer.md (checked before iteration 3; absent)
- .skilled/skills/system-deep-loop/deep-research/SKILL.md:347,360
- .skilled/skills/cli-classifier/SKILL.md:114
- .skilled/hooks/dispatch/README.md:64-74
- .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-query-hostile-metadata-redaction.md:15-20,27-33
- .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/security-and-correctness-minimums/input-validation-injection.md:19,47-49
- .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:52-59,1015-1052
- .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:43,88-100,140-146
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/implementation-summary.md:170-173
- OWASP LLM Prompt Injection Prevention Cheat Sheet: https://cheatsheet.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

## Assessment

- New information ratio: 0.75
- Novelty: Six findings add adjacent prompt-sink evidence and host, provenance, rollout, and privacy requirements; two reinforce the earlier policy-versus-enforcement and measurement limits.
- Questions addressed: Where else in .skilled would the same judgment pay off? What would default-on integration need, cost, and risk?
- Questions answered: Both questions, with host-specific hook support and serving cost explicitly left as unmeasured.
- Confidence: High for current local policies, hook descriptions, and feature-035 boundaries; medium for the proposed cross-runtime serving design and cost until per-host integration measurements exist.

## Reflection

- What worked and why: Comparing the deep-research and council-graph prompt boundaries with the hook catalog separated existing protections from an actual fetched-result enforcement seam.
- What did not work and why: Repository documentation cannot prove that every installed runtime can replace its WebFetch result before model continuation, and the offline benchmark has no live-page cost data.
- What I would do differently: Build a fixture-backed adapter for one runtime, prove its event timing and failure handling, then evaluate real fetch captures and benign adversarial slices before copying the pattern to other hosts.

## Recommended Next Focus

All five research questions now have findings. The next step belongs to a separately scoped serving phase: validate one runtime's fetch-result boundary and measurement plan before broad default-on rollout.

