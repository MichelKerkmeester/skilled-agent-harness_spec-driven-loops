# Iteration 4: Live Mode B leaf-load telemetry and evidence boundaries

## Focus
This iteration traced how live Mode B records sk-code routing and leaf reads, specifically whether `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` have observable live effects beyond the already-established deterministic replay. The narrow interpretation was telemetry and causal attribution in the current live harness; deterministic assembly and prefix-only contract remedies were deliberately excluded.

## Findings
1. Mode B does not evaluate `INTENT_SIGNALS`, `RESOURCE_MAP`, or `DEFAULT_RESOURCE` in the executor. It dispatches the scenario to a model in the repository context, then derives routing from the model's response and tool events; therefore these router inputs can influence a live run only through what the model reads and applies, not through a second machine replay inside the live branch. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:124-170] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:350-380]
2. The primary resource signal scored in live mode is the model's **stated** `resources` array. Actual `read`/`glob`/`grep`/`bash` events are captured separately as best-effort `raw.observedReads` corroboration and do not populate `observedResources`; on the Codex transport, activation is explicitly unobservable and read extraction is only a weak raw-log scan. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs:57-112]
3. The current canonical live report contains real activation, tool-call, and read-pattern evidence, but its D2/D3 rows still identify their measurements as router-replay/overload proxies. The captured reads include glob patterns as well as exact-looking paths and provide neither read order nor a mapping from each read to the router input that caused it, so the artifact cannot calculate actual leaf Hit@k, Recall@k, MRR, or time/calls-to-first-expected despite the report notes describing those as the intended live replacements. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:71-146] [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:149-214] [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:317-390]
4. `DEFAULT_RESOURCE` is visibly present in live stated-routing heads and several corresponding resource-shaped reads appear in the live evidence, but that is correlation rather than causal attribution: the report records no provenance field identifying `DEFAULT_RESOURCE`, a matched `INTENT_SIGNALS` key, or a contributing `RESOURCE_MAP` row. A causal live answer therefore requires intervention or explicit provenance telemetry, not another static trace. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:132-145] [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:202-213] [INFERENCE: the live artifact exposes stated resources and best-effort reads but no router-input provenance channel]

## Ruled Out
- Treating live D2/D3 labels as proof that exact observed file loads currently drive those scores; the canonical rows still declare proxy measurements. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:76-100]
- Treating `raw.observedReads` as proof that a particular router input caused a read; this channel is path extraction from tool inputs and is diagnostic rather than scored provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:286-326]

## Dead Ends
No new direction is exhausted. Static and existing live-artifact inspection has reached its causal boundary; repeating it cannot distinguish defaults from intent-map effects without a controlled live comparison or new provenance fields.

## Edge Cases
- Ambiguous input: The phrase "actual live leaf reading" could mean model-declared routing or physical read events. This iteration preserved both channels and treated physical reads as the stronger but currently diagnostic-only evidence.
- Contradictory evidence: Report notes say live mode replaces D2/D3 proxies with observed-load metrics, while the canonical live rows still label those dimensions as proxies. The implementation and emitted row fields support the narrower conclusion that stated routing is scored and reads are corroborative, so true load metrics remain absent. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:311-327] [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:82-100]
- Missing dependencies: No missing required state. Cross-transport exact-read telemetry is unavailable by design for Codex, and the OpenCode evidence lacks causal provenance; both are recorded as measurement gaps rather than inferred facts.
- Partial success: Existing Mode B artifacts resolve what is observable, but they cannot establish causal influence among the three router inputs. Status is `complete` because the telemetry-boundary subquestion is answered with cited evidence while the causal question remains open.

## Sources Consulted
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:220-380`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs:40-174`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:95-194`
- `.opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:1-401`
- `.opencode/skills/sk-code/benchmark/README.md:20-132`

## Assessment
- New information ratio: 0.88
- Novelty calculation: 3 of 4 findings were fully new and 1 was partially new, yielding `(3 + 0.5 * 1) / 4 = 0.875`, rounded to 0.88.
- Questions addressed: How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` affect actual live leaf reading or observable Mode B behavior, and what telemetry is present versus absent?
- Questions answered: What live Mode B telemetry exists, which channel is scored, and which causal/load measurements are absent?
- Questions still open: Which of the three router inputs causally changes exact live leaf reads and recall under controlled, otherwise-identical runs?

## Reflection
- What worked and why: Following the live executor's normalized result into the canonical live report separated model declarations, tool-event read evidence, and scored dimensions instead of treating “live” as a single evidence tier.
- What did not work and why: Existing live artifacts cannot attribute reads to individual router inputs because they contain no provenance or intervention pair; more static inspection would repeat the same boundary.
- What I would do differently: Run a minimal controlled Mode B matrix with fixed model, prompt, CWD, and targets while changing one router input at a time, and retain ordered exact read events separately from glob/search patterns.

## Recommended Next Focus
Specify the smallest controlled Mode B validation matrix and telemetry schema that can isolate `DEFAULT_RESOURCE`, intent-key matching, and `RESOURCE_MAP` contribution without conflating stated routing with exact file reads; include an OpenCode-only exact-read lane and mark Codex read/activation fields unavailable rather than zero.
