---
title: Deep Research Strategy - sk-code Router Alignment
description: Runtime strategy for diagnosing sk-code leaf-routing recall and typed-pair contract faults.
trigger_phrases:
  - "sk-code leaf routing research"
  - "sk-code typed-pair routing"
importance_tier: important
contextType: research
version: 1.0.0
---

# Deep Research Strategy - sk-code Router Alignment

## 1. OVERVIEW

### Purpose

Diagnose why sk-code has perfect surface selection but weak leaf-file recall, determine whether the shared preamble violates the typed-pair contract, and produce evidence-backed optimization recommendations without implementing them.

## 2. TOPIC

Diagnose sk-code skill-routing faults and optimize them using the sk-doc typed-pair routing standard, focusing on the fenced smart-router configuration, benchmark scoring, shared packet qualification, and concrete leaf-recall improvements.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` actually influence leaf selection and recall?
- [x] How does the skill-benchmark compute router replay, D1-D5, typed-pair recall, and fitted-versus-holdout results?
- [ ] Does packet-qualifying the universal preamble as a shared manifest mode clear `routing_contract_error` without degrading surface routing?
- [x] Which routing template, scoring logic, and JSON artifact changes are most likely to lift leaf-file recall?
- [x] What validation matrix can distinguish fitted gains from holdout generalization and prevent metric gaming?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement router, benchmark, template, or JSON changes during research.
- Do not revisit the already-verified 18/18 surface-routing result without contradictory evidence.
- Do not expand the investigation to sibling skills except for the sk-doc typed-pair standard and shared benchmark machinery needed as authorities.
- Do not derive gold from current router output.

## 5. STOP CONDITIONS

- Complete eight iterations because convergence mode is disabled, unless the workflow encounters a terminal failure or pause.
- Produce cited findings that answer the five key questions or explicitly preserve unresolved gaps.
- Produce a deterministic resource map and concrete, testable recommendations suitable for a later planning phase.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How does the skill-benchmark compute router replay, D1-D5, typed-pair recall, and fitted-versus-holdout results?
- Which routing template, scoring logic, and JSON artifact changes are most likely to lift leaf-file recall?
- What validation matrix can distinguish fitted gains from holdout generalization and prevent metric gaming?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Following the raw resource string from the router source through replay assembly and fail-closed dual-read exposed the exact contract boundary and separated unresolved preamble entries from missed expected leaves. (iteration 1)
- following the actual call chain separated execution order, row scoring, hard gates, advisory lanes, and rendering, preventing unlike metrics from being collapsed into one number. (iteration 2)
- Separating the hub's packet-entrypoint route from the parent and packet-local machine projections exposed which claims are executable hub behavior, benchmark behavior, and authored contract. (iteration 3)
- Following the live executor's normalized result into the canonical live report separated model declarations, tool-event read evidence, and scored dimensions instead of treating “live” as a single evidence tier. (iteration 4)
- Comparing the resolver, manifest generator, and hub-router conformance authority exposed the difference between a technically resolvable packet prefix and a semantically non-routable shared tier. (iteration 5)
- Comparing authored pass criteria with loader and scorer mechanics exposed that low D3 is partly a gold-semantics problem, then current-source replay localized true candidate-set expansion to monolithic leaf-map unioning without reopening surface selection. (iteration 6)
- Following the loader, scorer, runner, live parser, and current report in sequence exposed which anti-gaming properties already have executable fields and which require new preregistered evidence. (iteration 7)
- Separating identity ownership, route-decision provenance, and successful-read evidence prevented a contract fix from being mislabeled as recall improvement and turned the remaining live ambiguity into a falsifiable instrumentation requirement. (iteration 8)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The packet's older aggregate figure could not be reconciled because it lacks an artifact pointer in the current prompt/state; the current baseline is authoritative only for its own committed run. (iteration 1)
- the current corpus cannot yield holdout performance because no holdout scenarios are declared; this is an evidence absence, not a scoring failure. (iteration 2)
- Static sources could not prove actual executor leaf reads; the available fixture expressly defers that observation to live Mode B. (iteration 3)
- Existing live artifacts cannot attribute reads to individual router inputs because they contain no provenance or intervention pair; more static inspection would repeat the same boundary. (iteration 4)
- Static inspection cannot prove post-change benchmark invariance because the no-implementation constraint prevents the required controlled mutation and replay. (iteration 5)
- Exact routed counts in the committed report did not reproduce against current source, so the report cannot support quantitative projected gains without a fresh same-revision baseline. (iteration 6)
- The current corpus cannot instantiate the holdout gate, and current live telemetry cannot establish ordered actual-load metrics; both are evidence absences rather than reasons to weaken the matrix. (iteration 7)
- Existing live telemetry cannot establish read order, read success, canonical typed identity, or causal router origin because it stores deduplicated regex matches from tool inputs. (iteration 8)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Simple path-prefix rewrite only:** replacing `references/...` with `shared/references/...` cannot resolve typed identity because `shared` is neither a declared packet/mode nor an authored alias. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Simple path-prefix rewrite only:** replacing `references/...` with `shared/references/...` cannot resolve typed identity because `shared` is neither a declared packet/mode nor an authored alias. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Simple path-prefix rewrite only:** replacing `references/...` with `shared/references/...` cannot resolve typed identity because `shared` is neither a declared packet/mode nor an authored alias. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99]

### **Treating `routing_contract_error` as the cause of low recall:** unresolved preamble entries explain the error class, but baseline hit/expected counts independently show missed expected leaves. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:431-440] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1620-1629] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating `routing_contract_error` as the cause of low recall:** unresolved preamble entries explain the error class, but baseline hit/expected counts independently show missed expected leaves. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:431-440] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1620-1629]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `routing_contract_error` as the cause of low recall:** unresolved preamble entries explain the error class, but baseline hit/expected counts independently show missed expected leaves. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:431-440] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1620-1629]

### A holdout created or edited after candidate inspection is contaminated and must be regenerated independently rather than relabeled. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A holdout created or edited after candidate inspection is contaminated and must be regenerated independently rather than relabeled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A holdout created or edited after candidate inspection is contaminated and must be regenerated independently rather than relabeled.

### A manifest-only hidden `shared` entry: the generator derives modes from the registry, and the hub authority requires every registry mode in router signals and tie-break policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-129] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:317-329] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A manifest-only hidden `shared` entry: the generator derives modes from the registry, and the hub authority requires every registry mode in router signals and tie-break policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-129] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:317-329]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A manifest-only hidden `shared` entry: the generator derives modes from the registry, and the hub authority requires every registry mode in router signals and tie-break policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-129] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:317-329]

### Accepting fitted-score improvement without a non-empty sealed holdout partition; the current null holdout cannot prove generalization. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:13-20] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Accepting fitted-score improvement without a non-empty sealed holdout partition; the current null holdout cannot prove generalization. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:13-20]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Accepting fitted-score improvement without a non-empty sealed holdout partition; the current null holdout cannot prove generalization. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:13-20]

### Aggregate-only acceptance is definitively invalid: conjunctive surface, topology, suppression, and contract invariants can be averaged away. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Aggregate-only acceptance is definitively invalid: conjunctive surface, topology, suppression, and contract invariants can be averaged away.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Aggregate-only acceptance is definitively invalid: conjunctive surface, topology, suppression, and contract invariants can be averaged away.

### An ordinary `shared` registry mode as an identity-only fix: it changes hub topology and therefore cannot inherit the raw-route/surface-invariance claim. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:463-488] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: An ordinary `shared` registry mode as an identity-only fix: it changes hub topology and therefore cannot inherit the raw-route/surface-invariance claim. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:463-488]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An ordinary `shared` registry mode as an identity-only fix: it changes hub topology and therefore cannot inherit the raw-route/surface-invariance claim. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:463-488]

### Assuming the parent machine-readable router directly drives hub mode/surface packet selection; the hub's documented route function uses registry and hub-router decisions instead. [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-120] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming the parent machine-readable router directly drives hub mode/surface packet selection; the hub's documented route function uses registry and hub-router decisions instead. [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-120]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the parent machine-readable router directly drives hub mode/surface packet selection; the hub's documented route function uses registry and hub-router decisions instead. [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-120]

### Broadly adding keywords to `INTENT_SIGNALS` before resource-map tiering: under unit weights and near-tie unioning this can only activate more monolithic rows, so it has an uncontrolled D3 cost. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:411-459] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Broadly adding keywords to `INTENT_SIGNALS` before resource-map tiering: under unit weights and near-tie unioning this can only activate more monolithic rows, so it has an uncontrolled D3 cost. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:411-459]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broadly adding keywords to `INTENT_SIGNALS` before resource-map tiering: under unit weights and near-tie unioning this can only activate more monolithic rows, so it has an uncontrolled D3 cost. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:411-459]

### Current `raw.observedReads` as ordered actual-load or causal evidence: it regex-extracts tool inputs and deduplicates paths without success, order metrics, or router-input provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Current `raw.observedReads` as ordered actual-load or causal evidence: it regex-extracts tool inputs and deduplicates paths without success, order metrics, or router-input provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Current `raw.observedReads` as ordered actual-load or causal evidence: it regex-extracts tool inputs and deduplicates paths without success, order metrics, or router-input provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327]

### Editing `leaf-manifest.json` or generated benchmark report JSON as a way to claim leaf recall: these alter identity/measurement artifacts after raw routing and do not select missing raw resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Editing `leaf-manifest.json` or generated benchmark report JSON as a way to claim leaf recall: these alter identity/measurement artifacts after raw routing and do not select missing raw resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing `leaf-manifest.json` or generated benchmark report JSON as a way to claim leaf recall: these alter identity/measurement artifacts after raw routing and do not select missing raw resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475]

### Generated-report editing is definitively invalid as an optimization path because it changes neither the router nor independent gold. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Generated-report editing is definitively invalid as an optimization path because it changes neither the router nor independent gold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generated-report editing is definitively invalid as an optimization path because it changes neither the router nor independent gold.

### Manifest-only recall optimization is definitively exhausted; retain manifest work only as typed-contract remediation. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Manifest-only recall optimization is definitively exhausted; retain manifest work only as typed-contract remediation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Manifest-only recall optimization is definitively exhausted; retain manifest work only as typed-contract remediation.

### Multiple aliases for one shared disk path: the resolver returns the first match, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Multiple aliases for one shared disk path: the resolver returns the first match, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Multiple aliases for one shared disk path: the resolver returns the first match, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236]

### Multiple aliases with the same shared disk path to simulate mode-neutral ownership: shared resolution returns the first matching alias, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Multiple aliases with the same shared disk path to simulate mode-neutral ownership: shared resolution returns the first matching alias, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Multiple aliases with the same shared disk path to simulate mode-neutral ownership: shared resolution returns the first matching alias, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236]

### Prefix-only rewriting and silent exclusion: the former is already blocked, and the latter is fail-open behavior absent from the authority. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:239-275] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Prefix-only rewriting and silent exclusion: the former is already blocked, and the latter is fail-open behavior absent from the authority. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:239-275]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prefix-only rewriting and silent exclusion: the former is already blocked, and the latter is fail-open behavior absent from the authority. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:239-275]

### Re-running deterministic traces or editing generated manifest/report JSON to claim recall; both directions are already exhausted and do not measure live use or select a missing raw leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:117-135] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Re-running deterministic traces or editing generated manifest/report JSON to claim recall; both directions are already exhausted and do not measure live use or select a missing raw leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:117-135]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running deterministic traces or editing generated manifest/report JSON to claim recall; both directions are already exhausted and do not measure live use or select a missing raw leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:117-135]

### Selecting thresholds after seeing candidate output; this turns acceptance criteria into fixture fitting. [INFERENCE: a post-hoc threshold is conditional on the candidate result and therefore is not independent evidence] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Selecting thresholds after seeing candidate output; this turns acceptance criteria into fixture fitting. [INFERENCE: a post-hoc threshold is conditional on the candidate result and therefore is not independent evidence]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Selecting thresholds after seeing candidate output; this turns acceptance criteria into fixture fitting. [INFERENCE: a post-hoc threshold is conditional on the candidate result and therefore is not independent evidence]

### Silent exclusion of the preamble from the typed contract remains fail-open and unsupported; only an explicit validated category can represent a non-leaf/shared owner. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Silent exclusion of the preamble from the typed contract remains fail-open and unsupported; only an explicit validated category can represent a non-leaf/shared owner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Silent exclusion of the preamble from the typed contract remains fail-open and unsupported; only an explicit validated category can represent a non-leaf/shared owner.

### Static source inspection cannot prove actual live leaf recall, read order, or post-change 18/18 invariance. Those require instrumented, same-revision experiments. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Static source inspection cannot prove actual live leaf recall, read order, or post-change 18/18 invariance. Those require instrumented, same-revision experiments.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static source inspection cannot prove actual live leaf recall, read order, or post-change 18/18 invariance. Those require instrumented, same-revision experiments.

### Treating `raw.observedReads` as proof that a particular router input caused a read; this channel is path extraction from tool inputs and is diagnostic rather than scored provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:286-326] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating `raw.observedReads` as proof that a particular router input caused a read; this channel is path extraction from tool inputs and is diagnostic rather than scored provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:286-326]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `raw.observedReads` as proof that a particular router input caused a read; this channel is path extraction from tool inputs and is diagnostic rather than scored provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:286-326]

### Treating `shared` as a manifest-only non-routable mode under the current registry schema. It cannot simultaneously be an ordinary declared mode for leaf identity and remain absent from hub-router conformance. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating `shared` as a manifest-only non-routable mode under the current registry schema. It cannot simultaneously be an ordinary declared mode for leaf identity and remain absent from hub-router conformance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `shared` as a manifest-only non-routable mode under the current registry schema. It cannot simultaneously be an ordinary declared mode for leaf identity and remain absent from hub-router conformance.

### Treating a Mode A aggregate as if all D1-D5 weights were always present: unavailable dimensions are excluded and measured weights are renormalized. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating a Mode A aggregate as if all D1-D5 weights were always present: unavailable dimensions are excluded and measured weights are renormalized. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a Mode A aggregate as if all D1-D5 weights were always present: unavailable dimensions are excluded and measured weights are renormalized. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078]

### Treating generated report JSON, manifest edits, or typed-error removal as raw recall gain; those artifacts can change without selecting a missing expected leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:15-17] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating generated report JSON, manifest edits, or typed-error removal as raw recall gain; those artifacts can change without selecting a missing expected leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:15-17]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating generated report JSON, manifest edits, or typed-error removal as raw recall gain; those artifacts can change without selecting a missing expected leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:15-17]

### Treating live D2/D3 labels as proof that exact observed file loads currently drive those scores; the canonical rows still declare proxy measurements. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:76-100] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating live D2/D3 labels as proof that exact observed file loads currently drive those scores; the canonical rows still declare proxy measurements. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:76-100]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating live D2/D3 labels as proof that exact observed file loads currently drive those scores; the canonical rows still declare proxy measurements. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:76-100]

### Treating prompt-only Mode A misses as proof of live leaf-file misses when CWD/target-path evidence is intentionally absent. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:18] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating prompt-only Mode A misses as proof of live leaf-file misses when CWD/target-path evidence is intentionally absent. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:18]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating prompt-only Mode A misses as proof of live leaf-file misses when CWD/target-path evidence is intentionally absent. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:18]

### Treating the committed D3 values as an exhaustive waste oracle: authored sk-code scenarios use minimum pass criteria but the scorer assumes complete equality gold. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:84-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:241-291] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the committed D3 values as an exhaustive waste oracle: authored sk-code scenarios use minimum pass criteria but the scorer assumes complete equality gold. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:84-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:241-291]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the committed D3 values as an exhaustive waste oracle: authored sk-code scenarios use minimum pass criteria but the scorer assumes complete equality gold. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:84-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:241-291]

### Treating universal preamble resources as outside the typed contract without adding an explicit, validated exclusion category. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating universal preamble resources as outside the typed contract without adding an explicit, validated exclusion category.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating universal preamble resources as outside the typed contract without adding an explicit, validated exclusion category.

### Using current `raw.observedReads` as actual ordered-load evidence; it is a deduplicated extraction from tool inputs without causal provenance or order metrics. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Using current `raw.observedReads` as actual ordered-load evidence; it is a deduplicated extraction from tool inputs without causal provenance or order metrics. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using current `raw.observedReads` as actual ordered-load evidence; it is a deduplicated extraction from tool inputs without causal provenance or order metrics. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327]

### Using the current baseline's fitted score as evidence of holdout generalization: its holdout partition is empty. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using the current baseline's fitted score as evidence of holdout generalization: its holdout partition is empty. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the current baseline's fitted score as evidence of holdout generalization: its holdout partition is empty. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Simple path-prefix rewrite only:** replacing `references/...` with `shared/references/...` cannot resolve typed identity because `shared` is neither a declared packet/mode nor an authored alias. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99] (iteration 1)
- **Treating `routing_contract_error` as the cause of low recall:** unresolved preamble entries explain the error class, but baseline hit/expected counts independently show missed expected leaves. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:431-440] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1620-1629] (iteration 1)
- Treating a Mode A aggregate as if all D1-D5 weights were always present: unavailable dimensions are excluded and measured weights are renormalized. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078] (iteration 2)
- Using the current baseline's fitted score as evidence of holdout generalization: its holdout partition is empty. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65] (iteration 2)
- Assuming the parent machine-readable router directly drives hub mode/surface packet selection; the hub's documented route function uses registry and hub-router decisions instead. [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-120] (iteration 3)
- Treating prompt-only Mode A misses as proof of live leaf-file misses when CWD/target-path evidence is intentionally absent. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:18] (iteration 3)
- Treating `raw.observedReads` as proof that a particular router input caused a read; this channel is path extraction from tool inputs and is diagnostic rather than scored provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:286-326] (iteration 4)
- Treating live D2/D3 labels as proof that exact observed file loads currently drive those scores; the canonical rows still declare proxy measurements. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:76-100] (iteration 4)
- A manifest-only hidden `shared` entry: the generator derives modes from the registry, and the hub authority requires every registry mode in router signals and tie-break policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-129] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:317-329] (iteration 5)
- Multiple aliases with the same shared disk path to simulate mode-neutral ownership: shared resolution returns the first matching alias, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236] (iteration 5)
- Prefix-only rewriting and silent exclusion: the former is already blocked, and the latter is fail-open behavior absent from the authority. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:239-275] (iteration 5)
- Treating `shared` as a manifest-only non-routable mode under the current registry schema. It cannot simultaneously be an ordinary declared mode for leaf identity and remain absent from hub-router conformance. (iteration 5)
- Treating universal preamble resources as outside the typed contract without adding an explicit, validated exclusion category. (iteration 5)
- Broadly adding keywords to `INTENT_SIGNALS` before resource-map tiering: under unit weights and near-tie unioning this can only activate more monolithic rows, so it has an uncontrolled D3 cost. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:411-459] (iteration 6)
- Editing `leaf-manifest.json` or generated benchmark report JSON as a way to claim leaf recall: these alter identity/measurement artifacts after raw routing and do not select missing raw resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475] (iteration 6)
- Generated-report editing is definitively invalid as an optimization path because it changes neither the router nor independent gold. (iteration 6)
- Manifest-only recall optimization is definitively exhausted; retain manifest work only as typed-contract remediation. (iteration 6)
- Treating the committed D3 values as an exhaustive waste oracle: authored sk-code scenarios use minimum pass criteria but the scorer assumes complete equality gold. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:84-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:241-291] (iteration 6)
- A holdout created or edited after candidate inspection is contaminated and must be regenerated independently rather than relabeled. (iteration 7)
- Accepting fitted-score improvement without a non-empty sealed holdout partition; the current null holdout cannot prove generalization. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:13-20] (iteration 7)
- Aggregate-only acceptance is definitively invalid: conjunctive surface, topology, suppression, and contract invariants can be averaged away. (iteration 7)
- Selecting thresholds after seeing candidate output; this turns acceptance criteria into fixture fitting. [INFERENCE: a post-hoc threshold is conditional on the candidate result and therefore is not independent evidence] (iteration 7)
- Treating generated report JSON, manifest edits, or typed-error removal as raw recall gain; those artifacts can change without selecting a missing expected leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:15-17] (iteration 7)
- Using current `raw.observedReads` as actual ordered-load evidence; it is a deduplicated extraction from tool inputs without causal provenance or order metrics. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] (iteration 7)
- An ordinary `shared` registry mode as an identity-only fix: it changes hub topology and therefore cannot inherit the raw-route/surface-invariance claim. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:463-488] (iteration 8)
- Current `raw.observedReads` as ordered actual-load or causal evidence: it regex-extracts tool inputs and deduplicates paths without success, order metrics, or router-input provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] (iteration 8)
- Multiple aliases for one shared disk path: the resolver returns the first match, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236] (iteration 8)
- Re-running deterministic traces or editing generated manifest/report JSON to claim recall; both directions are already exhausted and do not measure live use or select a missing raw leaf. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:117-135] (iteration 8)
- Silent exclusion of the preamble from the typed contract remains fail-open and unsupported; only an explicit validated category can represent a non-leaf/shared owner. (iteration 8)
- Static source inspection cannot prove actual live leaf recall, read order, or post-change 18/18 invariance. Those require instrumented, same-revision experiments. (iteration 8)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which keyword, weighting, ambiguity, and resource-map changes improve missed expected leaves without increasing D3 waste? (iteration 1)
- What holdout and negative validation matrix prevents fitted metric gaming? (iteration 1)
- Should the universal preamble become a real shared manifest mode or be excluded from typed leaf recall, and what invariants distinguish those contracts? (iteration 1)
- How does the full benchmark pipeline combine router replay, D1-D5, typed-pair recall, and fitted-versus-holdout scoring? (iteration 1)
- What concrete fitted, holdout, negative, and topology-mutation matrix prevents metric gaming? (iteration 2)
- Which routing-template, scoring-logic, and JSON-artifact changes best improve leaf recall without increasing D3 waste? (iteration 2)
- How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` influence recall outside the already-confirmed deterministic assembly path? (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` influence recall outside the already-confirmed deterministic assembly path?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Verified starting evidence: about 65/100 aggregate, 18/18 surface routing, about 50% leaf-file recall, and mean typedPairRecall 0.729 over 14 manifest-gated scenarios.
- The conditional verdict is reported to be driven by the untyped always-loaded `DEFAULT_RESOURCE` preamble, classified as `routing_contract_error`.
- Memory bootstrap was unavailable because the local compiled Spec Memory output could not resolve `@spec-kit/shared`; no memory claims are treated as loaded.
- Packet resource map was absent at initialization; the workflow will emit one from iteration deltas.

### Bounded Context Snapshot

- Source pointers: `.opencode/skills/sk-code/shared/references/smart_routing.md`, `.opencode/skills/sk-code/leaf-manifest.json`, `.opencode/skills/system-deep-loop/skill-benchmark/`, and this packet's canonical spec documents.
- Reuse candidates: sk-doc typed-pair routing standard, manifest-gated gold derivation, router-replay scoring, and fitted/holdout benchmark partitions.
- Integration points: fenced router config, routing templates, benchmark loaders/scorers, leaf manifest, typed-gold scenario metadata, and baseline report JSON.
- Constraints and risks: research is read-only outside this packet; recommendations must preserve surface routing and avoid gold-output equivalence.

## 13. RESEARCH BOUNDARIES

- Max iterations: 8
- Convergence threshold: 0.05
- Convergence mode: off
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current generation: 1
- Started: 2026-07-17T03:38:47Z
