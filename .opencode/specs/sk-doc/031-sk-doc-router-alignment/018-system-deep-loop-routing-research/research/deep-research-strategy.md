# Deep Research Strategy: system-deep-loop Routing

## 1. Overview

This file is the externalized research strategy for a ten-iteration autonomous investigation. Reducer-owned sections are refreshed after each iteration.

## 2. Topic

Diagnose system-deep-loop skill routing and derive packet-qualified typed-pair optimizations for its seven workflow modes across five child packets, including benchmark scoring, scenario classification, and concrete routing-config changes.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How do the seven workflow modes currently route across the five child packets, and what typed pairs do they imply?
- [x] Which flat child-relative leaf IDs collide, and what packet-qualified coordinate scheme removes ambiguity?
- [x] How does the skill-benchmark discover, validate, and score routing gold and typed pairs?
- [x] Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring?
- [x] What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?

<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- Do not implement source or routing fixes during this research packet.
- Do not redesign the seven-mode or five-child topology beyond the qualification needed for unique typed pairs.
- Do not research unrelated skills.

## 5. Stop Conditions

- Run all ten iterations because convergence mode is off, unless a pause, hard state failure, or unrecoverable recovery halt occurs.
- Every key question must have file-and-line evidence or be explicitly retained as unresolved.
- Produce a dependency-ordered fix plan and deterministic resource map.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How do the seven workflow modes currently route across the five child packets, and what typed pairs do they imply?
- Which flat child-relative leaf IDs collide, and what packet-qualified coordinate scheme removes ambiguity?
- How does the skill-benchmark discover, validate, and score routing gold and typed pairs?
- Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring?
- What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- following the data flow in dependency order—manifest generator, scenario loader, router replay, scorer, then report—made producer/consumer boundaries and dormant gates explicit. (iteration 3)
- invoking the production loader per owning packet exposed the decisive difference between authored Markdown inventory and normalized benchmark rows. (iteration 4)
- tracing producer/consumer prerequisites from loader addressing through manifest, oracle, router, and scorer exposed an order that prevents one layer's defect from contaminating the next layer's measurement. (iteration 5)
- joining the documented test entrypoint to the benchmark's actual run order and emitted fields produced gates that distinguish structural, oracle, routing, and scoring failures. (iteration 6)
- reading direct scenario contracts established authored intent without relying on filenames, while the loader's dominant-mode rule prevented an invalid multi-mode compression. (iteration 7)
- Joining the alignment router's deterministic scope path to the loader's exact YAML parser produced an oracle whose prompt, mode, and leaves are independently checkable. (iteration 8)
- following each row through corpus discovery, gold parsing, manifest validation, replay, and scoring exposed a blocker that a mode-only table would miss. (iteration 9)
- joining the dependency plan, verification matrix, and oracle blockers by producer/consumer state exposed the earliest gate at which each validity claim becomes true. (iteration 10)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- broad keyword searches returned unrelated benchmark and manifest surfaces; narrowing to the Lane C scripts and committed report removed that noise. (iteration 3)
- filename/keyword discovery mixed behavior benchmarks, root indexes, and scenario files, so it could not provide loader-semantic counts. (iteration 4)
- broad benchmark search returned many scenario docs; narrowing to the hub contract, manifest generator, typed-pair boundary, and Lane-C test index supplied the required implementation gates. (iteration 5)
- the frozen benchmark README cannot be used as a current corpus-count oracle because it conflicts with the loader-semantic census. (iteration 6)
- searching the existing eligible corpus cannot produce alignment coverage because no eligible alignment routing row exists. (iteration 7)
- Existing alignment documents cannot answer the authoring question because they are outside the loader contract and are explicitly saturated as inferred gold. (iteration 8)
- router maps can propose candidate leaves but cannot independently authorize fixture gold; the six scenario contracts currently stop at mode-level intent. (iteration 9)
- treating the prompt's resource list as an unordered checklist would allow gold, routing, or benchmark work to run before its oracle prerequisites. (iteration 10)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### “319 Markdown artifacts” means 319 normalized benchmark scenarios; the loader produces 21 today. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: “319 Markdown artifacts” means 319 normalized benchmark scenarios; the loader produces 21 today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: “319 Markdown artifacts” means 319 normalized benchmark scenarios; the loader produces 21 today.

### **A scenario without typed gold should count as a typed zero.** The typed path is deliberately dormant unless the scenario declares typed gold and the target has a manifest. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1146-1168] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A scenario without typed gold should count as a typed zero.** The typed path is deliberately dormant unless the scenario declares typed gold and the target has a manifest. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1146-1168]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A scenario without typed gold should count as a typed zero.** The typed path is deliberately dormant unless the scenario declares typed gold and the target has a manifest. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1146-1168]

### **Malformed or stale typed gold is a router miss.** It is an oracle fault excluded from score denominators. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1300,1499-1507] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Malformed or stale typed gold is a router miss.** It is an oracle fault excluded from score denominators. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1300,1499-1507]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Malformed or stale typed gold is a router miss.** It is an oracle fault excluded from score denominators. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1300,1499-1507]

### **Typed-pair recall is an additional headline weight.** It is instead the canonical resource measure feeding the existing D1-intra, D2, and D3 lanes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1357] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Typed-pair recall is an additional headline weight.** It is instead the canonical resource measure feeding the existing D1-intra, D2, and D3 lanes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1357]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Typed-pair recall is an additional headline weight.** It is instead the canonical resource measure feeding the existing D1-intra, D2, and D3 lanes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1357]

### `<packet>/<leaf>` alone is a complete routing identity; three public modes share `deep-improvement`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `<packet>/<leaf>` alone is a complete routing identity; three public modes share `deep-improvement`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `<packet>/<leaf>` alone is a complete routing identity; three public modes share `deep-improvement`.

### `AI-002` as one row covering three independently scored modes: the index-table derivation retains one dominant mode. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `AI-002` as one row covering three independently scored modes: the index-table derivation retains one dominant mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `AI-002` as one row covering three independently scored modes: the index-table derivation retains one dominant mode.

### `full_inventory_intent` was excluded because this is a selected scope route, not a request to enumerate the complete alignment packet. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375-403] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `full_inventory_intent` was excluded because this is a selected scope route, not a request to enumerate the complete alignment packet. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375-403]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `full_inventory_intent` was excluded because this is a selected scope route, not a request to enumerate the complete alignment packet. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375-403]

### A packet prefix belongs inside canonical `leafResourceId`; the existing contract requires that field to begin with `references/` or `assets/` and treats packet-qualified values as legacy input. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A packet prefix belongs inside canonical `leafResourceId`; the existing contract requires that field to begin with `references/` or `assets/` and treats packet-qualified values as legacy input.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A packet prefix belongs inside canonical `leafResourceId`; the existing contract requires that field to begin with `references/` or `assets/` and treats packet-qualified values as legacy input.

### Accepting aggregate-score movement without the same trace mode, corpus count, D5 result, and oracle-fault count. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Accepting aggregate-score movement without the same trace mode, corpus count, D5 result, and oracle-fault count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Accepting aggregate-score movement without the same trace mode, corpus count, D5 result, and oracle-fault count.

### Adapter-specific leaves were excluded from the minimal gold because the proposed prompt supplies neither an authority nor adapter dispatch-context field; expecting adapter resources would make the oracle depend on context it did not author. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:117-126,172-181,227-228] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Adapter-specific leaves were excluded from the minimal gold because the proposed prompt supplies neither an authority nor adapter dispatch-context field; expecting adapter resources would make the oracle depend on context it did not author. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:117-126,172-181,227-228]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adapter-specific leaves were excluded from the minimal gold because the proposed prompt supplies neither an authority nor adapter dispatch-context field; expecting adapter resources would make the oracle depend on context it did not author. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:117-126,172-181,227-228]

### Adding only `DA-R01` YAML frontmatter under the indexed hub playbook: the index branch ignores off-index files and does not parse typed frontmatter on indexed files. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Adding only `DA-R01` YAML frontmatter under the indexed hub playbook: the index branch ignores off-index files and does not parse typed frontmatter on indexed files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding only `DA-R01` YAML frontmatter under the indexed hub playbook: the index branch ignores off-index files and does not parse typed frontmatter on indexed files.

### Aggregate-score-only acceptance remains invalid because it cannot distinguish oracle faults, routing defects, corpus drift, and fallback regression. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Aggregate-score-only acceptance remains invalid because it cannot distinguish oracle faults, routing defects, corpus drift, and fallback regression.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Aggregate-score-only acceptance remains invalid because it cannot distinguish oracle faults, routing defects, corpus drift, and fallback regression.

### Broad behavior-benchmark scenario discovery does not answer this question: those fixtures are a different corpus from `manual_testing_playbook/` and do not pass through this loader. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Broad behavior-benchmark scenario discovery does not answer this question: those fixtures are a different corpus from `manual_testing_playbook/` and do not pass through this loader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad behavior-benchmark scenario discovery does not answer this question: those fixtures are a different corpus from `manual_testing_playbook/` and do not pass through this loader.

### Calling the seven rows oracle-valid merely because they cover seven modes: loader reachability and authored typed gold are independent gates. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Calling the seven rows oracle-valid merely because they cover seven modes: loader reachability and authored typed gold are independent gates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling the seven rows oracle-valid merely because they cover seven modes: loader reachability and authored typed gold are independent gates.

### Calling the six-row seed “mode-complete”: it omits the registered alignment mode. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Calling the six-row seed “mode-complete”: it omits the registered alignment mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling the six-row seed “mode-complete”: it omits the registered alignment mode.

### Embedding packet prefixes in canonical `leafResourceId` or inferring the three improvement modes from their shared packet. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Embedding packet prefixes in canonical `leafResourceId` or inferring the three improvement modes from their shared packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Embedding packet prefixes in canonical `leafResourceId` or inferring the three improvement modes from their shared packet.

### Encoding packet prefixes inside canonical `leaf_resource_id`: the canonical pair remains `{workflowMode, child-local leafResourceId}`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Encoding packet prefixes inside canonical `leaf_resource_id`: the canonical pair remains `{workflowMode, child-local leafResourceId}`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Encoding packet prefixes inside canonical `leaf_resource_id`: the canonical pair remains `{workflowMode, child-local leafResourceId}`.

### Encoding packet prefixes inside canonical `leafResourceId`: the contract requires packet-local `references/` or `assets/` IDs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Encoding packet prefixes inside canonical `leafResourceId`: the contract requires packet-local `references/` or `assets/` IDs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Encoding packet prefixes inside canonical `leafResourceId`: the contract requires packet-local `references/` or `assets/` IDs.

### Existing `DAL-*` documents remain unapproved for promotion. This iteration closed the coverage gap by specifying a new authored fixture and did not retry filename-based inference. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Existing `DAL-*` documents remain unapproved for promotion. This iteration closed the coverage gap by specifying a new authored fixture and did not retry filename-based inference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing `DAL-*` documents remain unapproved for promotion. This iteration closed the coverage gap by specifying a new authored fixture and did not retry filename-based inference.

### Flat child-relative leaf IDs are globally unique; the eight-entry collision inventory disproves this. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Flat child-relative leaf IDs are globally unique; the eight-entry collision inventory disproves this.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Flat child-relative leaf IDs are globally unique; the eight-entry collision inventory disproves this.

### Further corpus-wide filename inference remains saturated and cannot authorize typed gold or loader-ineligible promotion. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Further corpus-wide filename inference remains saturated and cannot authorize typed gold or loader-ineligible promotion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Further corpus-wide filename inference remains saturated and cannot authorize typed gold or loader-ineligible promotion.

### Further inspection of existing loader-ineligible `DAL-*` files cannot repair the hub loader-shape mismatch and was not retried. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Further inspection of existing loader-ineligible `DAL-*` files cannot repair the hub loader-shape mismatch and was not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Further inspection of existing loader-ineligible `DAL-*` files cannot repair the hub loader-shape mismatch and was not retried.

### Generating typed gold before repairing hub index paths: unreadable rows cannot be safely authored or validated. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Generating typed gold before repairing hub index paths: unreadable rows cannot be safely authored or validated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generating typed gold before repairing hub index paths: unreadable rows cannot be safely authored or validated.

### Inferring typed gold for the 273 loader-ineligible behavior files remains blocked; no new evidence invalidated the saturated direction. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Inferring typed gold for the 273 loader-ineligible behavior files remains blocked; no new evidence invalidated the saturated direction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring typed gold for the 273 loader-ineligible behavior files remains blocked; no new evidence invalidated the saturated direction.

### Loader-ineligible files remain outside this matrix. No filename-based promotion or typed-gold inference was retried. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Loader-ineligible files remain outside this matrix. No filename-based promotion or typed-gold inference was retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Loader-ineligible files remain outside this matrix. No filename-based promotion or typed-gold inference was retried.

### Metadata-ineligible behavior files can safely receive inferred typed gold; typed gold is opt-in and must remain authored. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Metadata-ineligible behavior files can safely receive inferred typed gold; typed gold is opt-in and must remain authored.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Metadata-ineligible behavior files can safely receive inferred typed gold; typed gold is opt-in and must remain authored.

### No existing loader-eligible scenario supplies authored alignment-route intent. This is a corpus gap, not a search gap; further filename inspection cannot close it. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No existing loader-eligible scenario supplies authored alignment-route intent. This is a corpus gap, not a search gap; further filename inspection cannot close it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No existing loader-eligible scenario supplies authored alignment-route intent. This is a corpus gap, not a search gap; further filename inspection cannot close it.

### Packet-qualified values such as `deep-alignment/references/scoping_protocol.md` were excluded from `leaf_resource_id`; the typed parser and alignment router both operate on child-local paths. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:143-155] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Packet-qualified values such as `deep-alignment/references/scoping_protocol.md` were excluded from `leaf_resource_id`; the typed parser and alignment router both operate on child-local paths. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:143-155]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet-qualified values such as `deep-alignment/references/scoping_protocol.md` were excluded from `leaf_resource_id`; the typed parser and alignment router both operate on child-local paths. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:143-155]

### Promoting loader-ineligible files to make the first slice appear broader. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Promoting loader-ineligible files to make the first slice appear broader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promoting loader-ineligible files to make the first slice appear broader.

### Removing or weakening fallback branches to make typed recall appear higher. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Removing or weakening fallback branches to make typed recall appear higher.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing or weakening fallback branches to make typed recall appear higher.

### Requiring all 35 routing candidates to receive typed gold in the first slice without scenario-intent review. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Requiring all 35 routing candidates to receive typed gold in the first slice without scenario-intent review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Requiring all 35 routing candidates to receive typed gold in the first slice without scenario-intent review.

### Resolving `deep-improvement` mode from packet name or declaration order: three public modes share that packet. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Resolving `deep-improvement` mode from packet name or declaration order: three public modes share that packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resolving `deep-improvement` mode from packet name or declaration order: three public modes share that packet.

### Running the scored benchmark before loader, manifest, topology, and fallback gates pass. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Running the scored benchmark before loader, manifest, topology, and fallback gates pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the scored benchmark before loader, manifest, topology, and fallback gates pass.

### The benchmark README's 20-scenario statement is the current source of truth; the authored index and machine report both support 18. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The benchmark README's 20-scenario statement is the current source of truth; the authored index and machine report both support 18.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The benchmark README's 20-scenario statement is the current source of truth; the authored index and machine report both support 18.

### Treating any `DAL-*` feature filename or narrative as alignment typed gold: those files are loader-ineligible under the current corpus contract. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating any `DAL-*` feature filename or narrative as alignment typed gold: those files are loader-ineligible under the current corpus contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating any `DAL-*` feature filename or narrative as alignment typed gold: those files are loader-ineligible under the current corpus contract.

### Treating fallback removal as a score optimization: UNKNOWN and missing-path behavior are acceptance invariants. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating fallback removal as a score optimization: UNKNOWN and missing-path behavior are acceptance invariants.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating fallback removal as a score optimization: UNKNOWN and missing-path behavior are acceptance invariants.

### Treating router-derived candidate leaves as author-approved fixture gold without review. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating router-derived candidate leaves as author-approved fixture gold without review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating router-derived candidate leaves as author-approved fixture gold without review.

### Treating the cap as a leaf-count limit: it is a simultaneous-workflow-mode cap of two. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating the cap as a leaf-count limit: it is a simultaneous-workflow-mode cap of two.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the cap as a leaf-count limit: it is a simultaneous-workflow-mode cap of two.

### Treating the frozen 20-row README statement as the post-repair loader count; direct loader output is the count authority. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the frozen 20-row README statement as the post-repair loader count; direct loader output is the count authority.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the frozen 20-row README statement as the post-repair loader count; direct loader output is the count authority.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `<packet>/<leaf>` alone is a complete routing identity; three public modes share `deep-improvement`. (iteration 2)
- A packet prefix belongs inside canonical `leafResourceId`; the existing contract requires that field to begin with `references/` or `assets/` and treats packet-qualified values as legacy input. (iteration 2)
- Flat child-relative leaf IDs are globally unique; the eight-entry collision inventory disproves this. (iteration 2)
- **A scenario without typed gold should count as a typed zero.** The typed path is deliberately dormant unless the scenario declares typed gold and the target has a manifest. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1146-1168] (iteration 3)
- **Malformed or stale typed gold is a router miss.** It is an oracle fault excluded from score denominators. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1300,1499-1507] (iteration 3)
- **Typed-pair recall is an additional headline weight.** It is instead the canonical resource measure feeding the existing D1-intra, D2, and D3 lanes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1357] (iteration 3)
- “319 Markdown artifacts” means 319 normalized benchmark scenarios; the loader produces 21 today. (iteration 4)
- Broad behavior-benchmark scenario discovery does not answer this question: those fixtures are a different corpus from `manual_testing_playbook/` and do not pass through this loader. (iteration 4)
- Metadata-ineligible behavior files can safely receive inferred typed gold; typed gold is opt-in and must remain authored. (iteration 4)
- The benchmark README's 20-scenario statement is the current source of truth; the authored index and machine report both support 18. (iteration 4)
- Encoding packet prefixes inside canonical `leafResourceId`: the contract requires packet-local `references/` or `assets/` IDs. (iteration 5)
- Generating typed gold before repairing hub index paths: unreadable rows cannot be safely authored or validated. (iteration 5)
- Inferring typed gold for the 273 loader-ineligible behavior files remains blocked; no new evidence invalidated the saturated direction. (iteration 5)
- Resolving `deep-improvement` mode from packet name or declaration order: three public modes share that packet. (iteration 5)
- Treating fallback removal as a score optimization: UNKNOWN and missing-path behavior are acceptance invariants. (iteration 5)
- Accepting aggregate-score movement without the same trace mode, corpus count, D5 result, and oracle-fault count. (iteration 6)
- Loader-ineligible files remain outside this matrix. No filename-based promotion or typed-gold inference was retried. (iteration 6)
- Removing or weakening fallback branches to make typed recall appear higher. (iteration 6)
- Requiring all 35 routing candidates to receive typed gold in the first slice without scenario-intent review. (iteration 6)
- Treating the frozen 20-row README statement as the post-repair loader count; direct loader output is the count authority. (iteration 6)
- `AI-002` as one row covering three independently scored modes: the index-table derivation retains one dominant mode. (iteration 7)
- Calling the six-row seed “mode-complete”: it omits the registered alignment mode. (iteration 7)
- No existing loader-eligible scenario supplies authored alignment-route intent. This is a corpus gap, not a search gap; further filename inspection cannot close it. (iteration 7)
- Treating any `DAL-*` feature filename or narrative as alignment typed gold: those files are loader-ineligible under the current corpus contract. (iteration 7)
- `full_inventory_intent` was excluded because this is a selected scope route, not a request to enumerate the complete alignment packet. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375-403] (iteration 8)
- Adapter-specific leaves were excluded from the minimal gold because the proposed prompt supplies neither an authority nor adapter dispatch-context field; expecting adapter resources would make the oracle depend on context it did not author. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:117-126,172-181,227-228] (iteration 8)
- Existing `DAL-*` documents remain unapproved for promotion. This iteration closed the coverage gap by specifying a new authored fixture and did not retry filename-based inference. (iteration 8)
- Packet-qualified values such as `deep-alignment/references/scoping_protocol.md` were excluded from `leaf_resource_id`; the typed parser and alignment router both operate on child-local paths. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:143-155] (iteration 8)
- Adding only `DA-R01` YAML frontmatter under the indexed hub playbook: the index branch ignores off-index files and does not parse typed frontmatter on indexed files. (iteration 9)
- Calling the seven rows oracle-valid merely because they cover seven modes: loader reachability and authored typed gold are independent gates. (iteration 9)
- Encoding packet prefixes inside canonical `leaf_resource_id`: the canonical pair remains `{workflowMode, child-local leafResourceId}`. (iteration 9)
- Further inspection of existing loader-ineligible `DAL-*` files cannot repair the hub loader-shape mismatch and was not retried. (iteration 9)
- Treating the cap as a leaf-count limit: it is a simultaneous-workflow-mode cap of two. (iteration 9)
- Aggregate-score-only acceptance remains invalid because it cannot distinguish oracle faults, routing defects, corpus drift, and fallback regression. (iteration 10)
- Embedding packet prefixes in canonical `leafResourceId` or inferring the three improvement modes from their shared packet. (iteration 10)
- Further corpus-wide filename inference remains saturated and cannot authorize typed gold or loader-ineligible promotion. (iteration 10)
- Promoting loader-ineligible files to make the first slice appear broader. (iteration 10)
- Running the scored benchmark before loader, manifest, topology, and fallback gates pass. (iteration 10)
- Treating router-derived candidate leaves as author-approved fixture gold without review. (iteration 10)

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
- Which complete set of flat child-relative leaf IDs collide, beyond the verified examples? (iteration 1)
- How does the skill-benchmark discover, validate, and score routing gold and typed pairs? (iteration 1)
- Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring? (iteration 1)
- What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior? (iteration 1)
- Which of the 273 loader-ineligible files should be deliberately promoted into authored routing scenarios, if any? This is not inferable from filenames alone. (iteration 4)
- What dependency-ordered configuration and router changes can raise routing quality without weakening fallback behavior? (iteration 4)
- Which exact subset of the 35 evidence-backed routing candidates should receive typed gold in the first implementation slice should be confirmed against scenario intent, not filenames. (iteration 5)
- Which, if any, of the 273 loader-ineligible files should be deliberately promoted into authored scenarios? This remains outside inference and requires an explicit corpus-authoring decision. (iteration 5)
- Which exact scenario IDs form the smallest mode-complete first typed-gold slice among the 35 routing candidates? (iteration 6)
- Should any loader-ineligible file be deliberately promoted through authored corpus governance? No promotion can be inferred here. (iteration 6)
- Should any existing loader-ineligible file be deliberately promoted through corpus governance? No promotion is inferred here. (iteration 7)
- Should a new alignment routing scenario be authored into the loader-eligible corpus, and which explicit child-local leaf pairs should its author declare? (iteration 7)
- Should any existing loader-ineligible file be deliberately promoted through corpus governance? No promotion is inferred or required by this new-fixture contract. (iteration 8)
- Governance-only: should any existing loader-ineligible file be promoted? No promotion is required by this seven-row plan. (iteration 9)
- Implementation-only: which loader-compatible authoring shape will be adopted for the indexed hub corpus? Research establishes constraints but does not modify the loader. (iteration 9)
- Governance decision: approve or adjust the 43 proposed seed pairs; no loader-ineligible promotion is required. (iteration 10)
- Implementation decision: choose the loader-compatible indexed-corpus representation and lock it with gate-1 tests. (iteration 10)
- Research questions: none. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Packet charter: `spec.md` defines five evidence-backed research questions and delegates implementation to a sibling packet.
- Existing hypothesis: child-local `references/...` coordinates collide when interpreted at the hub level.
- Baseline claims requiring re-verification: aggregate score near 71 and zero typed gold over roughly 319 scenarios.
- Reuse candidate: the sk-doc typed-pair and manifest-gated benchmark recipe named by the packet charter.
- Context gap: Spec Memory and Code Graph accelerators were unavailable at initialization; use direct local Grep/Glob/Read evidence.
- Resource map: no packet-root `resource-map.md` existed at initialization; the workflow will emit `research/resource-map.md` from iteration deltas.

## 13. Research Boundaries

- Max iterations: 10
- Convergence threshold: 0.05
- Convergence mode: off
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: enabled
- Canonical synthesis: `research/research.md`
- Lifecycle mode: new, generation 1
