# Deep Research Strategy: sk-prompt Routing

## 1. Overview

This file is the externalized strategy for a five-iteration autonomous investigation. Reducer-owned sections are refreshed after each iteration.

## 2. Topic

Diagnose sk-prompt routing and derive typed-pair optimizations for the `prompt-improve` and `prompt-models` modes, including resource-map coverage, benchmark scoring, scenario eligibility, and concrete routing changes.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] How do `prompt-improve` and `prompt-models` currently route, and what `(workflowMode, leafResourceId)` pairs do they imply?
- [ ] What resources must a `prompt-models` `RESOURCE_MAP` expose, and do all proposed leaves resolve?
- [ ] Why does the baseline report 100 while routing dimensions remain null, and what score appears once typed routing is measured?
- [x] Which of the 32 playbook scenarios are genuine routing decisions eligible for independently authored typed gold?
- [x] What dependency-ordered changes produce a hub-level surface router and improve routing without weakening fallback behavior?

<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- Do not implement source, benchmark, or routing fixes in this research packet.
- Do not research skills outside sk-prompt except as evidence for the established sk-doc typed-pair recipe.
- Do not infer typed gold from current router output or filenames alone.

## 5. Stop Conditions

- Run all five iterations because convergence mode is off, unless a pause, hard state failure, or unrecoverable recovery halt occurs.
- Answer every key question with file-and-line evidence or retain it explicitly as unresolved.
- Produce a dependency-ordered fix plan and deterministic resource map.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which of the 32 playbook scenarios are genuine routing decisions eligible for independently authored typed gold?
- What dependency-ordered changes produce a hub-level surface router and improve routing without weakening fallback behavior?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading registry, hub router, and both packet routers together separated first-layer packet addresses from second-layer leaf ids. (iteration 1)
- joining the hub contract, packet fallback branches, manifest generator, and topology validator exposed a strict authoring and verification order rather than a file checklist. (iteration 2)
- Joining the executable router's load branches with the exact packet inventory separated semantic selection from mere file discoverability. (iteration 3)
- joining target identity, scenario-loader parsing, scorer null-handling, aggregate logic, and Git history separated artifact provenance from metric semantics. (iteration 4)
- Joining loader admission rules, both target-local indexes, and each hub scenario's authored behavior resolved the denominator and prevented router-output-derived gold. (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the phrase “surface router” was overloaded; resolving it required checking the authoritative typed-pair path contract rather than relying on the registry's `surface` term. (iteration 1)
- broad repository searches returned unrelated packet benchmarks; narrowing to the typed-pair scripts and current sk-prompt reports produced actionable dependencies. (iteration 2)
- The strategy's machine-owned `Next Focus` lagged one iteration and still named the dependency plan; the explicit prompt and carried-forward question provided the narrower authoritative focus. (iteration 3)
- searching only the hub benchmark directory could not locate the D5=16 claim because that report lives under the child packet. (iteration 4)
- A hub-only file inventory exposed only four files and could not account for the stated 32 until the separate child playbook was read; the root's stale “27” note also required reconciliation against the current 28-row index. (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding lexical carve-outs before measuring typed-pair behavior: the current hub itself requires benchmark evidence before such a carve-out. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:124] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adding lexical carve-outs before measuring typed-pair behavior: the current hub itself requires benchmark evidence before such a carve-out. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:124]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding lexical carve-outs before measuring typed-pair behavior: the current hub itself requires benchmark evidence before such a carve-out. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:124]

### Adding one `RESOURCE_MAP` entry per alias: aliases normalize to canonical ids before profile construction, so duplicate alias leaves would misrepresent the router and create duplicate typed pairs. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:150] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Adding one `RESOURCE_MAP` entry per alias: aliases normalize to canonical ids before profile construction, so duplicate alias leaves would misrepresent the router and create duplicate typed pairs. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:150]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding one `RESOURCE_MAP` entry per alias: aliases normalize to canonical ids before profile construction, so duplicate alias leaves would misrepresent the router and create duplicate typed pairs. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:150]

### Counting untyped scenarios as typed failures or passes; absent typed gold intentionally does not engage the taxonomy scorer. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Counting untyped scenarios as typed failures or passes; absent typed gold intentionally does not engage the taxonomy scorer. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting untyped scenarios as typed failures or passes; absent typed gold intentionally does not engage the taxonomy scorer. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121]

### No new exhausted approach category. The prior ruled-out conversions of `prompt-models` to a surface packet and packet `SKILL.md` pointers to leaf gold remain excluded. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new exhausted approach category. The prior ruled-out conversions of `prompt-models` to a surface packet and packet `SKILL.md` pointers to leaf gold remain excluded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new exhausted approach category. The prior ruled-out conversions of `prompt-models` to a surface packet and packet `SKILL.md` pointers to leaf gold remain excluded.

### No new exhausted category. A read-only benchmark rerun was unnecessary because the checked-in machine reports, producer code, rendered reports, and clean targeted Git status already established provenance and denominator semantics. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new exhausted category. A read-only benchmark rerun was unnecessary because the checked-in machine reports, producer code, rendered reports, and clean targeted Git status already established provenance and denominator semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new exhausted category. A read-only benchmark rerun was unnecessary because the checked-in machine reports, producer code, rendered reports, and clean targeted Git status already established provenance and denominator semantics.

### Promoting every discovered Markdown file to typed gold: discovery establishes availability, not selection; the actual router loads only the index, one profile, and the pattern index. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:143] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Promoting every discovered Markdown file to typed gold: discovery establishes availability, not selection; the actual router loads only the index, one profile, and the pattern index. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:143] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promoting every discovered Markdown file to typed gold: discovery establishes availability, not selection; the actual router loads only the index, one profile, and the pattern index. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:143] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168]

### Replacing `hub-router.json` resources with leaf paths: this conflates `hubLoadAddress` with `leafResourceId`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Replacing `hub-router.json` resources with leaf paths: this conflates `hubLoadAddress` with `leafResourceId`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `hub-router.json` resources with leaf paths: this conflates `hubLoadAddress` with `leafResourceId`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298]

### Starting with ambiguous, full-inventory, or bundled cases: they cannot establish a minimal cross-mode atomic baseline and would conflate contract enablement with fallback or breadth semantics. [SOURCE: .opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/ambiguous_default.md:19] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:271] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Starting with ambiguous, full-inventory, or bundled cases: they cannot establish a minimal cross-mode atomic baseline and would conflate contract enablement with fallback or breadth semantics. [SOURCE: .opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/ambiguous_default.md:19] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:271]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with ambiguous, full-inventory, or bundled cases: they cannot establish a minimal cross-mode atomic baseline and would conflate contract enablement with fallback or breadth semantics. [SOURCE: .opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/ambiguous_default.md:19] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:271]

### Treating aggregate 100 as full D1-D5 coverage; three routing/usefulness dimensions remain null. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.md:12] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating aggregate 100 as full D1-D5 coverage; three routing/usefulness dimensions remain null. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.md:12]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating aggregate 100 as full D1-D5 coverage; three routing/usefulness dimensions remain null. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.md:12]

### Treating JSON registry/budget assets as leaves: `_guard_in_skill` rejects non-Markdown resources. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:136] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating JSON registry/budget assets as leaves: `_guard_in_skill` rejects non-Markdown resources. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:136]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating JSON registry/budget assets as leaves: `_guard_in_skill` rejects non-Markdown resources. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:136]

### Treating the child `prompt-improve` D5=16 report as the hub baseline; its target and scenario denominator differ. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the child `prompt-improve` D5=16 report as the hub baseline; its target and scenario denominator differ. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the child `prompt-improve` D5=16 report as the hub baseline; its target and scenario denominator differ. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7]

### Treating UNKNOWN as the default mode's normal leaf set: the second-layer scaffold requires no resource load on a no-keyword match. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:46] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating UNKNOWN as the default mode's normal leaf set: the second-layer scaffold requires no resource load on a no-keyword match. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:46]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating UNKNOWN as the default mode's normal leaf set: the second-layer scaffold requires no resource load on a no-keyword match. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:46]

### Typing all 32 scenarios: 25 scenarios assert command, behavior, scoring, contract, guard, or recovery outcomes rather than a positive leaf-selection oracle. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:175] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Typing all 32 scenarios: 25 scenarios assert command, behavior, scoring, contract, guard, or recovery outcomes rather than a positive leaf-selection oracle. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:175]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Typing all 32 scenarios: 25 scenarios assert command, behavior, scoring, contract, guard, or recovery outcomes rather than a positive leaf-selection oracle. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:175]

### Using current `expected_resources: */SKILL.md` as leaf gold: the loader's path extractor does not recognize packet `SKILL.md` paths as leaf resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Using current `expected_resources: */SKILL.md` as leaf gold: the loader's path extractor does not recognize packet `SKILL.md` paths as leaf resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using current `expected_resources: */SKILL.md` as leaf gold: the loader's path extractor does not recognize packet `SKILL.md` paths as leaf resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Adding lexical carve-outs before measuring typed-pair behavior: the current hub itself requires benchmark evidence before such a carve-out. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:124] (iteration 2)
- No new exhausted approach category. The prior ruled-out conversions of `prompt-models` to a surface packet and packet `SKILL.md` pointers to leaf gold remain excluded. (iteration 2)
- Replacing `hub-router.json` resources with leaf paths: this conflates `hubLoadAddress` with `leafResourceId`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298] (iteration 2)
- Treating UNKNOWN as the default mode's normal leaf set: the second-layer scaffold requires no resource load on a no-keyword match. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:46] (iteration 2)
- Adding one `RESOURCE_MAP` entry per alias: aliases normalize to canonical ids before profile construction, so duplicate alias leaves would misrepresent the router and create duplicate typed pairs. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:150] (iteration 3)
- Promoting every discovered Markdown file to typed gold: discovery establishes availability, not selection; the actual router loads only the index, one profile, and the pattern index. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:143] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168] (iteration 3)
- Treating JSON registry/budget assets as leaves: `_guard_in_skill` rejects non-Markdown resources. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:136] (iteration 3)
- Counting untyped scenarios as typed failures or passes; absent typed gold intentionally does not engage the taxonomy scorer. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121] (iteration 4)
- No new exhausted category. A read-only benchmark rerun was unnecessary because the checked-in machine reports, producer code, rendered reports, and clean targeted Git status already established provenance and denominator semantics. (iteration 4)
- Treating aggregate 100 as full D1-D5 coverage; three routing/usefulness dimensions remain null. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.md:12] (iteration 4)
- Treating the child `prompt-improve` D5=16 report as the hub baseline; its target and scenario denominator differ. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7] (iteration 4)
- Starting with ambiguous, full-inventory, or bundled cases: they cannot establish a minimal cross-mode atomic baseline and would conflate contract enablement with fallback or breadth semantics. [SOURCE: .opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/ambiguous_default.md:19] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:271] (iteration 5)
- Typing all 32 scenarios: 25 scenarios assert command, behavior, scoring, contract, guard, or recovery outcomes rather than a positive leaf-selection oracle. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:175] (iteration 5)
- Using current `expected_resources: */SKILL.md` as leaf gold: the loader's path extractor does not recognize packet `SKILL.md` paths as leaf resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168] (iteration 5)

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
- Reconcile the stated baseline score of 100 with the checked report, which currently records `aggregateScore: null`, D1-D4 null, and D5 16. (iteration 1)
- Classify the 32 playbook scenarios for independently authored typed gold. (iteration 1)
- Define the complete `prompt-models` `RESOURCE_MAP`, including whether shared supporting references/assets beyond the seven minimum routing leaves belong in typed gold, then recheck every proposed address. (iteration 1)
- Produce the dependency-ordered change plan without weakening unknown/ambiguous fallback behavior. (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Produce the dependency-ordered change plan without weakening unknown/ambiguous fallback behavior.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Packet charter: `spec.md` defines five research questions and delegates implementation to a sibling packet.
- `prompt-improve` has a six-entry flat root-relative `RESOURCE_MAP`; `prompt-models` has none.
- Baseline claims requiring verification: aggregate 100, only D5 measured, routing dimensions null, and zero typed gold over 32 scenarios.
- Reuse candidate: the sk-doc manifest-gated typed-pair benchmark recipe.
- Context gap: Spec Memory is unavailable because the local compiled package cannot resolve `@spec-kit/shared`; use direct local evidence.
- Resource map: no packet-root `resource-map.md` existed at initialization; the workflow will emit `research/resource-map.md` from iteration deltas.

## 13. Research Boundaries

- Max iterations: 5
- Convergence threshold: 0.05
- Convergence mode: off
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: enabled
- Canonical synthesis: `research/research.md`
- Lifecycle mode: new, generation 1
