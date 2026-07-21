# Iteration 1: Shipped Command Anatomy and Literal-Prompt Gap

## Focus

Forensically baseline the five shipped `/interface:*` command bodies, their presentation assets, and the shared creation contract, then separate the working route/intake/lifecycle architecture from the missing literal, self-contained creation-prompt experience. The narrow interpretation used here is command-visible prompt content; complete replacement bodies, runtime include support, and implementation sequencing remain later questions.

## Actions Taken

1. Read the detached-lineage config, state log, strategy, and registry before selecting the strategy's stated next focus.
2. Inspected all five command routers for their literal job, prerequisites, stable mode, presentation source, output artifact, and authority boundary.
3. Inspected all five presentation assets for progressive intake, visible output blocks, proof fields, and typed statuses.
4. Inspected the shared creation-contract anchors and continuity evidence from the 002 synthesis and parent gap analysis. A broad prior-art grep produced mostly unrelated packet matches; exact packet anchors already captured in strategy were retained instead of broad rereading.

## Findings

1. **The five command bodies are substantial routers, but not self-contained creation prompts.** Each opens with the same imperative to read the external creation contract, select an execution asset, and apply a stable mode. Their literal jobs and products are: `design` → distinctive interface direction / `workflowMode=interface` / Interface Direction Spec; `foundations` → static visual system / `foundations` / Visual System Foundations Plan; `motion` → temporal behavior / `motion` / Motion Design Spec; `audit` → evidence-first design QA / `audit` / Design Quality Audit Report plus remediation brief; and `design-reference` → source-faithful CSS extraction / `md-generator` / Style Reference DESIGN.md. [SOURCE: .opencode/commands/interface/design.md:9-15] [SOURCE: .opencode/commands/interface/design.md:42-71] [SOURCE: .opencode/commands/interface/foundations.md:9-15] [SOURCE: .opencode/commands/interface/foundations.md:42-65] [SOURCE: .opencode/commands/interface/motion.md:9-15] [SOURCE: .opencode/commands/interface/motion.md:42-65] [SOURCE: .opencode/commands/interface/audit.md:9-15] [SOURCE: .opencode/commands/interface/audit.md:42-65] [SOURCE: .opencode/commands/interface/design-reference.md:9-15] [SOURCE: .opencode/commands/interface/design-reference.md:42-65]
2. **The literal command text already preserves a useful, command-specific intake and routing skeleton.** Every router names required inputs, a cannot-run condition, sibling deferrals, a stable mode load, and a typed artifact. The differences are domain-real rather than cosmetic: interface target/audience/job/system/content; static axis/tokens/accessibility/viewports; transition intent/states/interruption/runtime/reduced motion; target journeys/baseline/severity/mutation boundary; or URL/origin/routes/access/overwrite/coverage. [SOURCE: .opencode/commands/interface/design.md:20-35] [SOURCE: .opencode/commands/interface/foundations.md:20-35] [SOURCE: .opencode/commands/interface/motion.md:20-35] [SOURCE: .opencode/commands/interface/audit.md:20-35] [SOURCE: .opencode/commands/interface/design-reference.md:20-35]
3. **Presentation assets implement the 002 lifecycle indirectly, but they fragment the user-facing prompt across files.** The assets own progressive intake, the common visible blocks (`Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, artifact, critique, evidence, handoff), typed `OK/ASK/FAIL/DEFER` statuses, next-command recommendations, and proof keys. The design asset additionally identifies a consolidated prompt. This realizes intake and output choreography, but an agent reading only the command body does not receive that wording as one literal brief. [SOURCE: .opencode/commands/interface/assets/interface-design-presentation.txt:5-41] [SOURCE: .opencode/commands/interface/assets/interface-foundations-presentation.txt:3-31] [SOURCE: .opencode/commands/interface/assets/interface-motion-presentation.txt:3-31] [SOURCE: .opencode/commands/interface/assets/interface-audit-presentation.txt:3-31] [SOURCE: .opencode/commands/interface/assets/interface-design-reference-presentation.txt:3-31]
4. **The shared contract correctly centralizes choreography and authority, not design taste.** It explicitly says commands own intake/lifecycle, the selected `sk-design` mode owns judgment and proof definition, transports own retrieval/rendering/extraction, and `sk-code` owns application mutation. It also centralizes the shared visible sequence. The actual canonical path is `.opencode/skills/sk-design/shared/creation-contract.md`, matching all five routers; it is not command-local. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:16] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:44] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:134-140] [SOURCE: .opencode/commands/interface/design.md:9]
5. **The exact gap is experiential, not architectural:** stable namespace/mode mapping, progressive intake, evidence choreography, authority boundaries, statuses, proof, and handoff are already present, largely as the indirect implementation of the 002 templates. What remains absent from each command's visible body is one evocative and actionable creation brief that tells the agent what to make, the desired experiential outcome and quality bar, the anti-generic constraints, how to use real context/content, and what a strong mode-specific artifact must demonstrate—without copying palettes, typography recipes, style menus, or mode-owned judgment. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/004-commands/research/lineages/sol-high-fast/deep-research-strategy.md:79-80] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/research/research.md:67-178] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:109-147] [INFERENCE: based on the external-read imperative in each router, the presentation split, and the contract's explicit authority boundary]

## Questions Answered

- What exactly do the shipped command routers, presentation assets, and shared creation contract contain, and which literal-prompt qualities are absent?

## Questions Remaining

- What complete literal body should each of the five commands contain?
- What include/shared-fragment mechanism does the runtime support?
- Which content stays literal, shared, or mode-owned?
- What file/change/test sequence can ship the rewrite safely?

## Ruled Out

- **Replacing the routers wholesale:** ruled out because their command-specific prerequisites, sibling discrimination, stable mappings, proof outputs, and mutation boundaries are already useful architecture. [SOURCE: .opencode/commands/interface/design.md:20-82] [SOURCE: .opencode/commands/interface/audit.md:20-80]
- **Copying taste doctrine into commands:** ruled out by the explicit authority contract and each router's anti-duplication instruction. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:16] [SOURCE: .opencode/commands/interface/foundations.md:15]
- **Treating presentation assets or the shared contract alone as the deliverable:** ruled out because every command still instructs the agent to read/load external files rather than presenting one literal creation brief. [SOURCE: .opencode/commands/interface/design-reference.md:9] [SOURCE: .opencode/commands/interface/design-reference.md:76]

## Dead Ends

- A repository-wide grep over generic terms such as `template`, `include`, and `literal prompt` was too broad and surfaced unrelated research packets. Future iterations should use exact target directories and runtime renderer symbols rather than repeat this search shape.

## Sources Consulted

- `.opencode/commands/interface/design.md:9-82`
- `.opencode/commands/interface/foundations.md:9-76`
- `.opencode/commands/interface/motion.md:9-76`
- `.opencode/commands/interface/audit.md:9-80`
- `.opencode/commands/interface/design-reference.md:9-76`
- `.opencode/commands/interface/assets/interface-design-presentation.txt:5-41`
- `.opencode/commands/interface/assets/interface-foundations-presentation.txt:3-31`
- `.opencode/commands/interface/assets/interface-motion-presentation.txt:3-31`
- `.opencode/commands/interface/assets/interface-audit-presentation.txt:3-31`
- `.opencode/commands/interface/assets/interface-design-reference-presentation.txt:3-31`
- `.opencode/skills/sk-design/shared/creation-contract.md:16-140`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/research/research.md:67-178,291-300`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:109-147`

## Assessment

- New information ratio: 0.90 (3 fully new findings + 2 partially new findings = 0.80; +0.10 simplicity bonus for resolving the baseline question)
- Questions addressed: shipped command/presentation/creation-contract anatomy and literal-prompt gap
- Questions answered: 1 of 5
- Edge case: partial success—the broad prior-art grep was noisy, but narrow shipped-file evidence and packet-captured exact anchors were sufficient to answer the baseline question.

## Reflection

- **What worked and why:** comparing the same anchors across all five routers and presentation files exposed a consistent architecture while preserving the meaningful domain-specific intake differences.
- **What did not work and why:** the broad repository grep used common vocabulary and crossed many unrelated research trees, so its signal-to-noise ratio was poor.
- **What I would do differently:** constrain the next search to command rendering, frontmatter parsing, `$ARGUMENTS` expansion, and known include/template symbols before reading any generic prompt literature.

## Recommended Next Focus

Determine the runtime-supported include/shared-fragment mechanism with direct command-loader and renderer evidence. This is narrower than drafting all five bodies immediately and decides whether the eventual literal prompts can reference one injected lifecycle fragment or must be fully expanded/generated into each command.
