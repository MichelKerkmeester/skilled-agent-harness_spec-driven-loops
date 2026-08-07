---
title: Hallmark to sk-design Research Strategy
description: Detached lineage strategy for evidence-grounded Hallmark reuse and capability analysis.
importance_tier: important
contextType: planning
---

# Deep Research Strategy — Hallmark and sk-design

## 1. OVERVIEW

This lineage inventories every Hallmark asset, maps it to the shipped sk-design hub, separates license-safe reuse from learn-only analysis, and produces concrete file-level recommendations.

## 2. TOPIC

Study Hallmark's verbs, references, schemas, themes, checks, and roadmap against sk-design's five modes, interface commands, audit/slop controls, design-reference pipeline, and styles corpus.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does Hallmark's license permit copying, adaptation, and redistribution to require?
- [x] How does every Hallmark verb and reference asset map to an existing sk-design mode, command, or reference, and what verdict applies?
- [x] Which Hallmark audit gates and pre-emit critique heuristics are absent or weaker in sk-design's audit and polish contracts?
- [x] Which design.md extraction fields, motion/theme ideas, and curated-theme mechanics improve sk-design's existing MD-generator, styles pipeline, foundations, and motion modes?
- [x] Which roadmap ideas justify new commands or capabilities, especially redesign/variant, and what phased adoption order has the best value-to-effort ratio?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement changes to Hallmark or sk-design.
- Do not replace sk-design wholesale or weaken its canon-conformant hub contracts.
- Do not copy license-restricted text without the required attribution and notices.
- Do not write outside this detached lineage packet.

## 5. STOP CONDITIONS

- Run exactly 10 iterations; convergence before iteration 10 is telemetry only.
- Stop early only for unrecoverable state corruption, an external write requirement, or a security concern.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does Hallmark's license permit copying, adaptation, and redistribution to require?
- How does every Hallmark verb and reference asset map to an existing sk-design mode, command, or reference, and what verdict applies?
- Which Hallmark audit gates and pre-emit critique heuristics are absent or weaker in sk-design's audit and polish contracts?
- Which design.md extraction fields, motion/theme ideas, and curated-theme mechanics improve sk-design's existing MD-generator, styles pipeline, foundations, and motion modes?
- Which roadmap ideas justify new commands or capabilities, especially redesign/variant, and what phased adoption order has the best value-to-effort ratio?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct recursive inventories plus line-numbered reads exposed both the legal contract and two source-of-truth mismatches early, preventing the rest of the loop from comparing against stale counts. (iteration 1)
- Comparing Hallmark's numbered gates against sk-design's procedure/reference layers separated named presentation tells from release-critical checks and exposed concrete insertion points without flattening the hub. (iteration 2)
- Comparing human format, extraction, provenance database, retrieval, and a real bundle prevented document/schema conflation. (iteration 3)
- Comparing the behavior contracts by dimension, then checking the actual procedure and card outputs, exposed a state-coverage gap that a high-level mode comparison would miss. (iteration 4)
- Comparing owner references and visible handoff contracts, rather than only mode summaries, separated real schema gaps from taste rules sk-design intentionally does not universalize. (iteration 5)
- Comparing output schemas and proof ownership before comparing recipe content separated transferable decision logic from Hallmark-specific code and taste doctrine. Sampling packets from multiple families verified that the load-on-demand architecture, not any single archetype, is the scalable contribution. (iteration 6)
- Comparing the theme router to the actual generic facet/retrieval schema converted a vague “curated complement” idea into a no-new-table implementation seam. (iteration 7)
- Exact command/reference comparison separated true gaps from Hallmark-only gaps. (iteration 8)
- Normalizing by owning sk-design file exposed duplicate public-surface proposals and kept the recommendations surgical. (iteration 9)
- Exact inventory and citation-range checks separated coverage defects from implementation duplication; current owner files exposed repeated shipped contracts. (iteration 10)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The initial shallow inventory hid nested verb, macrostructure, and component directories; a targeted recursive check corrected that interpretation. (iteration 1)
- The first jq registry query assumed an object property named tells; the checked-in registry uses another top-level shape. The prose catalog still established the registry/fixture parity contract, so the research question remained answerable. (iteration 2)
- Broad corpus grep produced generated-content noise; focused schema and representative artifacts were better. (iteration 3)
- Broad grep across all design modes produced generated corpus noise; exact reads of the owning motion and shared files were more reliable. (iteration 4)
- A broad file listing pulled thousands of extracted style bundles into the candidate set; restricting reads to non-style owning references produced higher-signal comparisons. (iteration 5)
- Broad heading inventories hid internal contradictions and could not distinguish a deliberate custom asset from a fallback. Narrow line reads against sk-design's exact preflight and content gates exposed the actionable contract changes. (iteration 6)
- Sampling canonical JSON with a guessed `.tokens` shape failed because representative bundles do not share that guessed top-level key. The database schema and index/retrieval contracts were the safer canonical surfaces for this question. (iteration 7)
- Filename search alone overstated novelty because several capabilities use different names. (iteration 8)
- Broad repository grep produced generated/manual-playbook noise; direct asset inventory, prior cited passes, and narrow source anchors were more reliable. (iteration 9)
- Broad grep over the 1,290-style corpus produced noisy generated content, so targeted schema/retrieval references and the corpus README were more reliable. (iteration 10)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Adding a new `redesign` mode or standalone command solely for parity:** rejected because `interface` already owns reshaping/restyling, `/interface:design` has a `redesign` lane, and a dedicated redesign intake protects existing constraints. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:26] [SOURCE: .opencode/commands/interface/design.md:57] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:85] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Adding a new `redesign` mode or standalone command solely for parity:** rejected because `interface` already owns reshaping/restyling, `/interface:design` has a `redesign` lane, and a dedicated redesign intake protects existing constraints. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:26] [SOURCE: .opencode/commands/interface/design.md:57] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:85]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a new `redesign` mode or standalone command solely for parity:** rejected because `interface` already owns reshaping/restyling, `/interface:design` has a `redesign` lane, and a dedicated redesign intake protects existing constraints. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:26] [SOURCE: .opencode/commands/interface/design.md:57] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:85]

### **Copying the hosted imagery kit into sk-design in this phase:** rejected pending asset-by-asset provenance and redistribution verification; the repository-wide MIT license is permissive, but hosted third-party assets may carry separate source terms. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/assets.md:1] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Copying the hosted imagery kit into sk-design in this phase:** rejected pending asset-by-asset provenance and redistribution verification; the repository-wide MIT license is permissive, but hosted third-party assets may carry separate source terms. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/assets.md:1]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Copying the hosted imagery kit into sk-design in this phase:** rejected pending asset-by-asset provenance and redistribution verification; the repository-wide MIT license is permissive, but hosted third-party assets may carry separate source terms. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/assets.md:1]

### **Treating the README counts as canonical:** rejected due to the 57-versus-58 contradiction and the distinction between 24 top-level references and the deeper load-on-demand catalogs. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating the README counts as canonical:** rejected due to the 57-versus-58 contradiction and the distinction between 24 top-level references and the deeper load-on-demand catalogs. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the README counts as canonical:** rejected due to the 57-versus-58 contradiction and the distinction between 24 top-level references and the deeper load-on-demand catalogs. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1]

### **Wholesale replacement of sk-design with Hallmark:** rejected because sk-design's shipped hub has broader responsibilities, registry-driven routing, evidence contracts, accessibility/performance audit coverage, and a measured extraction backend. Hallmark is a source of surgical patterns, not a replacement architecture. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:80] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Wholesale replacement of sk-design with Hallmark:** rejected because sk-design's shipped hub has broader responsibilities, registry-driven routing, evidence contracts, accessibility/performance audit coverage, and a measured extraction backend. Hallmark is a source of surgical patterns, not a replacement architecture. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:80]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Wholesale replacement of sk-design with Hallmark:** rejected because sk-design's shipped hub has broader responsibilities, registry-driven routing, evidence contracts, accessibility/performance audit coverage, and a measured extraction backend. Hallmark is a source of surgical patterns, not a replacement architecture. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:80]

### A `variant` alias does not earn a public-surface change because directions and variation triggers cover it. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A `variant` alias does not earn a public-surface change because directions and variation triggers cover it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `variant` alias does not earn a public-surface change because directions and variation triggers cover it.

### A Nanobanana-specific integration inside sk-design. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A Nanobanana-specific integration inside sk-design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Nanobanana-specific integration inside sk-design.

### A Nanobanana-specific integration, `Plate` preset, or dedicated live-preview MCP inside sk-design. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A Nanobanana-specific integration, `Plate` preset, or dedicated live-preview MCP inside sk-design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Nanobanana-specific integration, `Plate` preset, or dedicated live-preview MCP inside sk-design.

### A new live-preview MCP without observed transport failures. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A new live-preview MCP without observed transport failures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new live-preview MCP without observed transport failures.

### A one-to-one Hallmark theme mapping is not useful for Foundations. The transferable artifact is the authoring-route decision and semantic handoff, not Hallmark's named axes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A one-to-one Hallmark theme mapping is not useful for Foundations. The transferable artifact is the authoring-route decision and semantic handoff, not Hallmark's named axes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A one-to-one Hallmark theme mapping is not useful for Foundations. The transferable artifact is the authoring-route decision and semantic handoff, not Hallmark's named axes.

### Adding a new public motion or redesign command: `/interface:motion` and the existing redesign lane already own those jobs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Adding a new public motion or redesign command: `/interface:motion` and the existing redesign lane already own those jobs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new public motion or redesign command: `/interface:motion` and the existing redesign lane already own those jobs.

### Adding a public study command when design-reference owns extraction. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Adding a public study command when design-reference owns extraction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a public study command when design-reference owns extraction.

### Adding a separate curated-theme database: the existing generic facet, token-axis, FTS and vector schema already has the required extension points. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Adding a separate curated-theme database: the existing generic facet, token-axis, FTS and vector schema already has the required extension points.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a separate curated-theme database: the existing generic facet, token-axis, FTS and vector schema already has the required extension points.

### Adding Hallmark CSS stamps or .hallmark/log.json to the audit workflow: audit is read-only and sk-design already has evidence/source surfaces. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adding Hallmark CSS stamps or .hallmark/log.json to the audit workflow: audit is read-only and sk-design already has evidence/source surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding Hallmark CSS stamps or .hallmark/log.json to the audit workflow: audit is read-only and sk-design already has evidence/source surfaces.

### Adding Hallmark's 20-theme catalog, diversification stamp, or log to sk-design: the extracted styles corpus and evidence ledger already serve broader provenance and retrieval jobs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Adding Hallmark's 20-theme catalog, diversification stamp, or log to sk-design: the extracted styles corpus and evidence ledger already serve broader provenance and retrieval jobs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding Hallmark's 20-theme catalog, diversification stamp, or log to sk-design: the extracted styles corpus and evidence ledger already serve broader provenance and retrieval jobs.

### Adopting Hallmark's global `150ms` reduced-motion override: it conflicts with Hallmark's own `0.01s` path and is weaker than sk-design's instant/static semantic-parity contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Adopting Hallmark's global `150ms` reduced-motion override: it conflicts with Hallmark's own `0.01s` path and is weaker than sk-design's instant/static semantic-parity contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting Hallmark's global `150ms` reduced-motion override: it conflicts with Hallmark's own `0.01s` path and is weaker than sk-design's instant/static semantic-parity contract.

### Broad state, microinteraction, and data-viz additions would duplicate shipped guidance. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Broad state, microinteraction, and data-viz additions would duplicate shipped guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad state, microinteraction, and data-viz additions would duplicate shipped guidance.

### Composition DNA cannot be attributed to `design-md.md`; its structured source is `study.md`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Composition DNA cannot be attributed to `design-md.md`; its structured source is `study.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Composition DNA cannot be attributed to `design-md.md`; its structured source is `study.md`.

### Copying all 21 macrostructures and roughly 50 component packets as a second component library. The durable value is the packet schema and selection distinctions; the raw catalogue would create parallel doctrine and implementation ownership. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Copying all 21 macrostructures and roughly 50 component packets as a second component library. The durable value is the packet schema and selection distinctions; the raw catalogue would create parallel doctrine and implementation ownership.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying all 21 macrostructures and roughly 50 component packets as a second component library. The durable value is the packet schema and selection distinctions; the raw catalogue would create parallel doctrine and implementation ownership.

### Copying exact duration multipliers or theme-specific CSS/token values: the portable idea is semantic motion character; close textual/code reuse would also require Hallmark's MIT notice. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Copying exact duration multipliers or theme-specific CSS/token values: the portable idea is semantic motion character; close textual/code reuse would also require Hallmark's MIT notice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying exact duration multipliers or theme-specific CSS/token values: the portable idea is semantic motion character; close textual/code reuse would also require Hallmark's MIT notice.

### Copying Hallmark's exact English headline character buckets or loading-second thresholds as laws: localization, font metrics, container width, and measured latency change the correct boundary. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying Hallmark's exact English headline character buckets or loading-second thresholds as laws: localization, font metrics, container width, and measured latency change the correct boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Hallmark's exact English headline character buckets or loading-second thresholds as laws: localization, font metrics, container width, and measured latency change the correct boundary.

### Copying Hallmark's exact responsive widths as universal breakpoints: they are useful verification samples, not content-driven breakpoint decisions. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying Hallmark's exact responsive widths as universal breakpoints: they are useful verification samples, not content-driven breakpoint decisions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Hallmark's exact responsive widths as universal breakpoints: they are useful verification samples, not content-driven breakpoint decisions.

### Copying Hallmark's named-theme multiplier table into sk-design: it would turn a useful semantic concept into preset coupling and would require MIT notice retention for close reuse. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Copying Hallmark's named-theme multiplier table into sk-design: it would turn a useful semantic concept into preset coupling and would require MIT notice retention for close reuse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Hallmark's named-theme multiplier table into sk-design: it would turn a useful semantic concept into preset coupling and would require MIT notice retention for close reuse.

### Copying named themes, `Plate`, motion multipliers, or cookbook HTML/CSS sketches. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Copying named themes, `Plate`, motion multipliers, or cookbook HTML/CSS sketches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying named themes, `Plate`, motion multipliers, or cookbook HTML/CSS sketches.

### Copying or hotlinking hosted imagery, attributed quotations, vendor claims, prices, or other third-party material whose rights are not established by Hallmark's MIT file. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Copying or hotlinking hosted imagery, attributed quotations, vendor claims, prices, or other third-party material whose rights are not established by Hallmark's MIT file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying or hotlinking hosted imagery, attributed quotations, vendor claims, prices, or other third-party material whose rights are not established by Hallmark's MIT file.

### Copying sample HTML/CSS/JS as Interface output. The shipped mode is advisory; implementation belongs to an accepted `sk-code` handoff. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Copying sample HTML/CSS/JS as Interface output. The shipped mode is advisory; implementation belongs to an accepted `sk-code` handoff.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying sample HTML/CSS/JS as Interface output. The shipped mode is advisory; implementation belongs to an accepted `sk-code` handoff.

### Copying the attributed voice-sample text from `copy.md`: repository licensing does not prove Hallmark can relicense third-party quotations. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying the attributed voice-sample text from `copy.md`: repository licensing does not prove Hallmark can relicense third-party quotations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying the attributed voice-sample text from `copy.md`: repository licensing does not prove Hallmark can relicense third-party quotations.

### Copying the complete 58-gate document into sk-design: it duplicates broader checks, imports brittle style doctrine, and would require preserving Hallmark's MIT notice for copied or substantial text. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Copying the complete 58-gate document into sk-design: it duplicates broader checks, imports brittle style doctrine, and would require preserving Hallmark's MIT notice for copied or substantial text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying the complete 58-gate document into sk-design: it duplicates broader checks, imports brittle style doctrine, and would require preserving Hallmark's MIT notice for copied or substantial text.

### Copying the twenty named themes, exact token values, motion multipliers, 21 macrostructure recipes, 50 component packets, CSS stamps, or persistent Hallmark novelty log. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Copying the twenty named themes, exact token values, motion multipliers, 21 macrostructure recipes, 50 component packets, CSS stamps, or persistent Hallmark novelty log.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying the twenty named themes, exact token values, motion multipliers, 21 macrostructure recipes, 50 component packets, CSS stamps, or persistent Hallmark novelty log.

### Counting README's “57 gates” as canonical is eliminated: `slop-test.md` and the operative build contract use 58; the set is gates 1–57 plus 38a. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Counting README's “57 gates” as canonical is eliminated: `slop-test.md` and the operative build contract use 58; the set is gates 1–57 plus 38a. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting README's “57 gates” as canonical is eliminated: `slop-test.md` and the operative build contract use 58; the set is gates 1–57 plus 38a. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1]

### Embedding four export formats inline. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Embedding four export formats inline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Embedding four export formats inline.

### Exact named-theme values are not a portable source of truth for sk-design's extracted corpus. The transferable concept is a semantic motion-character record, not Hallmark's ten theme rows. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Exact named-theme values are not a portable source of truth for sk-design's extracted corpus. The transferable concept is a semantic motion-character record, not Hallmark's ten theme rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Exact named-theme values are not a portable source of truth for sk-design's extracted corpus. The transferable concept is a semantic motion-character record, not Hallmark's ten theme rows.

### Fixed taste percentages do not survive sk-design's Brand-versus-Product register. Role evidence and rendered proof are the durable abstraction. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Fixed taste percentages do not survive sk-design's Brand-versus-Product register. Role evidence and rendered proof are the durable abstraction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixed taste percentages do not survive sk-design's Brand-versus-Product register. Role evidence and rendered proof are the durable abstraction.

### Hallmark archetype identifiers are cookbook-specific; transfer the region-plus-knobs idea, not the codes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hallmark archetype identifiers are cookbook-specific; transfer the region-plus-knobs idea, not the codes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hallmark archetype identifiers are cookbook-specific; transfer the region-plus-knobs idea, not the codes.

### Hallmark's assumption that an attached screenshot is safe for portable emission is weaker than sk-design's rights-known reuse gate. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hallmark's assumption that an attached screenshot is safe for portable emission is weaker than sk-design's rights-known reuse gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hallmark's assumption that an attached screenshot is safe for portable emission is weaker than sk-design's rights-known reuse gate.

### Hotlinking or redistributing the Hallmark imagery kit. The manifest is a placeholder and the hosted binaries are not covered by the checked-in source alone. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Hotlinking or redistributing the Hallmark imagery kit. The manifest is a placeholder and the hosted binaries are not covered by the checked-in source alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hotlinking or redistributing the Hallmark imagery kit. The manifest is a placeholder and the hosted binaries are not covered by the checked-in source alone.

### Importing exact vendor recommendations, price claims, fixed tilt/icon/file-size numbers, or universal medium priority. These are volatile or brief-dependent. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Importing exact vendor recommendations, price claims, fixed tilt/icon/file-size numbers, or universal medium priority. These are volatile or brief-dependent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Importing exact vendor recommendations, price claims, fixed tilt/icon/file-size numbers, or universal medium priority. These are volatile or brief-dependent.

### Importing Hallmark's twenty theme definitions or exact axis memberships as sk-design presets: this would create a chooser menu and parallel doctrine, conflicting with Interface's evidence-anchor contract. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Importing Hallmark's twenty theme definitions or exact axis memberships as sk-design presets: this would create a chooser menu and parallel doctrine, conflicting with Interface's evidence-anchor contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Importing Hallmark's twenty theme definitions or exact axis memberships as sk-design presets: this would create a chooser menu and parallel doctrine, conflicting with Interface's evidence-anchor contract.

### Importing Hallmark's universal `3-5%` accent cap, pure-extreme bans, gradient bans, or OKLCH-only rule: sk-design's register and source evidence legitimately permit achromatic, drenched, legacy, and source-faithful systems. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Importing Hallmark's universal `3-5%` accent cap, pure-extreme bans, gradient bans, or OKLCH-only rule: sk-design's register and source evidence legitimately permit achromatic, drenched, legacy, and source-faithful systems.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Importing Hallmark's universal `3-5%` accent cap, pure-extreme bans, gradient bans, or OKLCH-only rule: sk-design's register and source evidence legitimately permit achromatic, drenched, legacy, and source-faithful systems.

### Inflating novelty by proposing another public capability category. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Inflating novelty by proposing another public capability category.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inflating novelty by proposing another public capability category.

### Multi-page coherence does not require a new extraction relationship type; `DesignBoundary` already models it. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Multi-page coherence does not require a new extraction relationship type; `DesignBoundary` already models it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Multi-page coherence does not require a new extraction relationship type; `DesignBoundary` already models it.

### New standalone `redesign`, `study`, `variant`, or `explain` commands. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: New standalone `redesign`, `study`, `variant`, or `explain` commands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New standalone `redesign`, `study`, `variant`, or `explain` commands.

### New standalone redesign, variant, study, or explain commands. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: New standalone redesign, variant, study, or explain commands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New standalone redesign, variant, study, or explain commands.

### None. The initial inventory found a productive comparison structure. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. The initial inventory found a productive comparison structure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The initial inventory found a productive comparison structure.

### Persisting a `.hallmark/log.json` analogue solely for novelty: sk-design's variation contract needs diversity inside the requested option set, while cross-run memory can override a pinned brief or owned system. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Persisting a `.hallmark/log.json` analogue solely for novelty: sk-design's variation contract needs diversity inside the requested option set, while cross-run memory can override a pinned brief or owned system.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Persisting a `.hallmark/log.json` analogue solely for novelty: sk-design's variation contract needs diversity inside the requested option set, while cross-run memory can override a pinned brief or owned system.

### Persisting remote-fetch safety mechanics in DESIGN.md. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Persisting remote-fetch safety mechanics in DESIGN.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Persisting remote-fetch safety mechanics in DESIGN.md.

### Preserving the Hallmark stylesheet stamp or diversification log. sk-design already carries accepted decisions and evidence in typed envelopes; source comments should explain durable implementation reasons, not workflow history. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Preserving the Hallmark stylesheet stamp or diversification log. sk-design already carries accepted decisions and evidence in typed envelopes; source comments should explain durable implementation reasons, not workflow history.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Preserving the Hallmark stylesheet stamp or diversification log. sk-design already carries accepted decisions and evidence in typed envelopes; source comments should explain durable implementation reasons, not workflow history.

### Promoting font lists, zero-chroma neutrals, 5% accent area, 1.3× hero padding, or fixed family-count ceilings to universal blockers: they are useful prompts only when tied to the brief and rendered evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Promoting font lists, zero-chroma neutrals, 5% accent area, 1.3× hero padding, or fixed family-count ceilings to universal blockers: they are useful prompts only when tied to the brief and rendered evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promoting font lists, zero-chroma neutrals, 5% accent area, 1.3× hero padding, or fixed family-count ceilings to universal blockers: they are useful prompts only when tied to the brief and rendered evidence.

### Replacing P0-P3 with critical/major/minor: the two systems measure different things. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Replacing P0-P3 with critical/major/minor: the two systems measure different things.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing P0-P3 with critical/major/minor: the two systems measure different things.

### Replacing sk-design's rendering-cost hierarchy with a universal transform/opacity-only ban: Hallmark's own recipes contradict that absolute rule, while sk-design already handles bounded paint and layout-like transitions more accurately. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Replacing sk-design's rendering-cost hierarchy with a universal transform/opacity-only ban: Hallmark's own recipes contradict that absolute rule, while sk-design already handles bounded paint and layout-like transitions more accurately.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing sk-design's rendering-cost hierarchy with a universal transform/opacity-only ban: Hallmark's own recipes contradict that absolute rule, while sk-design already handles bounded paint and layout-like transitions more accurately.

### Replacing v3 `DESIGN.md`, canonical JSON, sidecars, and validators with Hallmark's compact portable file. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Replacing v3 `DESIGN.md`, canonical JSON, sidecars, and validators with Hallmark's compact portable file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing v3 `DESIGN.md`, canonical JSON, sidecars, and validators with Hallmark's compact portable file.

### Replacing v3 DESIGN.md with Hallmark's compact file. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Replacing v3 DESIGN.md with Hallmark's compact file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing v3 DESIGN.md with Hallmark's compact file.

### Requiring all eight Hallmark states on every element: states must be applicable; explicit N/A is more accurate than synthetic success/error states on controls that cannot enter them. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Requiring all eight Hallmark states on every element: states must be applicable; explicit N/A is more accurate than synthetic success/error states on controls that cannot enter them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Requiring all eight Hallmark states on every element: states must be applicable; explicit N/A is more accurate than synthetic success/error states on controls that cannot enter them.

### Requiring imagery on every hero or forbidding typography-only interfaces. This creates the same generic-media pressure the anti-slop workflow is meant to remove. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Requiring imagery on every hero or forbidding typography-only interfaces. This creates the same generic-media pressure the anti-slop workflow is meant to remove.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Requiring imagery on every hero or forbidding typography-only interfaces. This creates the same generic-media pressure the anti-slop workflow is meant to remove.

### Retrying blocked directions: wholesale hub replacement, a sixth mode, standalone redesign/study/variant/explain commands, a named theme database, copied catalogs, Hallmark stamps/logs, or provider-specific Nanobanana wiring. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Retrying blocked directions: wholesale hub replacement, a sixth mode, standalone redesign/study/variant/explain commands, a named theme database, copied catalogs, Hallmark stamps/logs, or provider-specific Nanobanana wiring.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying blocked directions: wholesale hub replacement, a sixth mode, standalone redesign/study/variant/explain commands, a named theme database, copied catalogs, Hallmark stamps/logs, or provider-specific Nanobanana wiring.

### Sound/haptic guidance without a platform contract. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Sound/haptic guidance without a platform contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sound/haptic guidance without a platform contract.

### Sound/haptic policy without a concrete platform and accessibility need. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Sound/haptic policy without a concrete platform and accessibility need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sound/haptic policy without a concrete platform and accessibility need.

### The attempted direct registry enumeration used the wrong assumed top-level JSON shape. The catalog reference itself documents the registry mirror and parity checker, so this did not block the file-level target recommendation; exact row-schema work remains implementation-phase verification. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The attempted direct registry enumeration used the wrong assumed top-level JSON shape. The catalog reference itself documents the registry mirror and parity checker, so this did not block the file-level target recommendation; exact row-schema work remains implementation-phase verification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The attempted direct registry enumeration used the wrong assumed top-level JSON shape. The catalog reference itself documents the registry mirror and parity checker, so this did not block the file-level target recommendation; exact row-schema work remains implementation-phase verification.

### Treating “genre” as a user-facing style picker. In sk-design it is useful only as evidence-derived retrieval/audit metadata subordinate to the brief and owned system. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating “genre” as a user-facing style picker. In sk-design it is useful only as evidence-derived retrieval/audit metadata subordinate to the brief and owned system.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating “genre” as a user-facing style picker. In sk-design it is useful only as evidence-derived retrieval/audit metadata subordinate to the brief and owned system.

### Treating `design.md` as one universal contract failed: measured extraction and brief-authored invention require distinct artifacts. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating `design.md` as one universal contract failed: measured extraction and brief-authored invention require distinct artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `design.md` as one universal contract failed: measured extraction and brief-authored invention require distinct artifacts.

### Treating all twenty catalog entries as equally specified. Only four checked-in theme packets carry the richer affinity/voice/motion contract; the remaining themes are token-block entries, so the catalog cannot serve as a uniform schema without new authoring. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating all twenty catalog entries as equally specified. Only four checked-in theme packets carry the richer affinity/voice/motion contract; the remaining themes are token-block entries, so the catalog cannot serve as a uniform schema without new authoring.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all twenty catalog entries as equally specified. Only four checked-in theme packets carry the richer affinity/voice/motion contract; the remaining themes are token-block entries, so the catalog cannot serve as a uniform schema without new authoring.

### Treating authored brand invention and measured extraction as one `DESIGN.md` contract is eliminated by MD-generator's authoring boundary. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:86] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating authored brand invention and measured extraction as one `DESIGN.md` contract is eliminated by MD-generator's authoring boundary. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:86]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating authored brand invention and measured extraction as one `DESIGN.md` contract is eliminated by MD-generator's authoring boundary. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:86]

### Treating every Hallmark ROADMAP label as a sk-design gap failed: variants, charts, image-led direction, extraction, redesign, rationale artifacts, and render critique already exist under different names. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating every Hallmark ROADMAP label as a sk-design gap failed: variants, charts, image-led direction, extraction, redesign, rationale artifacts, and render critique already exist under different names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every Hallmark ROADMAP label as a sk-design gap failed: variants, charts, image-led direction, extraction, redesign, rationale artifacts, and render critique already exist under different names.

### Treating every ROADMAP label as a sk-design gap is eliminated because redesign, variants, charts, image-led direction, extraction, proof/explanation, and render critique already have owners. [SOURCE: .opencode/skills/sk-design/SKILL.md:25] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating every ROADMAP label as a sk-design gap is eliminated because redesign, variants, charts, image-led direction, extraction, proof/explanation, and render critique already have owners. [SOURCE: .opencode/skills/sk-design/SKILL.md:25]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every ROADMAP label as a sk-design gap is eliminated because redesign, variants, charts, image-led direction, extraction, proof/explanation, and render critique already have owners. [SOURCE: .opencode/skills/sk-design/SKILL.md:25]

### Treating repeated conceptual rows as separate implementation packets. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating repeated conceptual rows as separate implementation packets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating repeated conceptual rows as separate implementation packets.

### Treating screenshot guesses as measured tokens. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating screenshot guesses as measured tokens.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating screenshot guesses as measured tokens.

### Treating symmetry as an AI defect: low-variance Product and precision surfaces can earn symmetry; the defect is unreasoned default composition. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating symmetry as an AI defect: low-variance Product and precision surfaces can earn symmetry; the defect is unreasoned default composition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating symmetry as an AI defect: low-variance Product and precision surfaces can earn symmetry; the defect is unreasoned default composition.

### Universal distance values are not justified across Brand and Product surfaces. They remain examples until target evidence or a token system assigns them. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Universal distance values are not justified across Brand and Product surfaces. They remain examples until target evidence or a token system assigns them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Universal distance values are not justified across Brand and Product surfaces. They remain examples until target evidence or a token system assigns them.

### Using README's “57 gates” count; the canonical reference states 58. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Using README's “57 gates” count; the canonical reference states 58.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using README's “57 gates” count; the canonical reference states 58.

### Wholesale replacement of the canon-conformant five-mode hub or addition of a sixth mode. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Wholesale replacement of the canon-conformant five-mode hub or addition of a sixth mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Wholesale replacement of the canon-conformant five-mode hub or addition of a sixth mode.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Adding a new `redesign` mode or standalone command solely for parity:** rejected because `interface` already owns reshaping/restyling, `/interface:design` has a `redesign` lane, and a dedicated redesign intake protects existing constraints. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:26] [SOURCE: .opencode/commands/interface/design.md:57] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:85] (iteration 1)
- **Copying the hosted imagery kit into sk-design in this phase:** rejected pending asset-by-asset provenance and redistribution verification; the repository-wide MIT license is permissive, but hosted third-party assets may carry separate source terms. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/assets.md:1] (iteration 1)
- **Treating the README counts as canonical:** rejected due to the 57-versus-58 contradiction and the distinction between 24 top-level references and the deeper load-on-demand catalogs. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1] (iteration 1)
- **Wholesale replacement of sk-design with Hallmark:** rejected because sk-design's shipped hub has broader responsibilities, registry-driven routing, evidence contracts, accessibility/performance audit coverage, and a measured extraction backend. Hallmark is a source of surgical patterns, not a replacement architecture. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:80] (iteration 1)
- None. The initial inventory found a productive comparison structure. (iteration 1)
- Adding Hallmark CSS stamps or .hallmark/log.json to the audit workflow: audit is read-only and sk-design already has evidence/source surfaces. (iteration 2)
- Copying the complete 58-gate document into sk-design: it duplicates broader checks, imports brittle style doctrine, and would require preserving Hallmark's MIT notice for copied or substantial text. (iteration 2)
- Promoting font lists, zero-chroma neutrals, 5% accent area, 1.3× hero padding, or fixed family-count ceilings to universal blockers: they are useful prompts only when tied to the brief and rendered evidence. (iteration 2)
- Replacing P0-P3 with critical/major/minor: the two systems measure different things. (iteration 2)
- The attempted direct registry enumeration used the wrong assumed top-level JSON shape. The catalog reference itself documents the registry mirror and parity checker, so this did not block the file-level target recommendation; exact row-schema work remains implementation-phase verification. (iteration 2)
- Adding a public study command when design-reference owns extraction. (iteration 3)
- Embedding four export formats inline. (iteration 3)
- Hallmark archetype identifiers are cookbook-specific; transfer the region-plus-knobs idea, not the codes. (iteration 3)
- Hallmark's assumption that an attached screenshot is safe for portable emission is weaker than sk-design's rights-known reuse gate. (iteration 3)
- Persisting remote-fetch safety mechanics in DESIGN.md. (iteration 3)
- Replacing v3 DESIGN.md with Hallmark's compact file. (iteration 3)
- Treating screenshot guesses as measured tokens. (iteration 3)
- Adding a new public motion or redesign command: `/interface:motion` and the existing redesign lane already own those jobs. (iteration 4)
- Adopting Hallmark's global `150ms` reduced-motion override: it conflicts with Hallmark's own `0.01s` path and is weaker than sk-design's instant/static semantic-parity contract. (iteration 4)
- Copying Hallmark's named-theme multiplier table into sk-design: it would turn a useful semantic concept into preset coupling and would require MIT notice retention for close reuse. (iteration 4)
- Exact named-theme values are not a portable source of truth for sk-design's extracted corpus. The transferable concept is a semantic motion-character record, not Hallmark's ten theme rows. (iteration 4)
- Replacing sk-design's rendering-cost hierarchy with a universal transform/opacity-only ban: Hallmark's own recipes contradict that absolute rule, while sk-design already handles bounded paint and layout-like transitions more accurately. (iteration 4)
- Requiring all eight Hallmark states on every element: states must be applicable; explicit N/A is more accurate than synthetic success/error states on controls that cannot enter them. (iteration 4)
- Universal distance values are not justified across Brand and Product surfaces. They remain examples until target evidence or a token system assigns them. (iteration 4)
- A one-to-one Hallmark theme mapping is not useful for Foundations. The transferable artifact is the authoring-route decision and semantic handoff, not Hallmark's named axes. (iteration 5)
- Adding Hallmark's 20-theme catalog, diversification stamp, or log to sk-design: the extracted styles corpus and evidence ledger already serve broader provenance and retrieval jobs. (iteration 5)
- Copying Hallmark's exact English headline character buckets or loading-second thresholds as laws: localization, font metrics, container width, and measured latency change the correct boundary. (iteration 5)
- Copying Hallmark's exact responsive widths as universal breakpoints: they are useful verification samples, not content-driven breakpoint decisions. (iteration 5)
- Copying the attributed voice-sample text from `copy.md`: repository licensing does not prove Hallmark can relicense third-party quotations. (iteration 5)
- Fixed taste percentages do not survive sk-design's Brand-versus-Product register. Role evidence and rendered proof are the durable abstraction. (iteration 5)
- Importing Hallmark's universal `3-5%` accent cap, pure-extreme bans, gradient bans, or OKLCH-only rule: sk-design's register and source evidence legitimately permit achromatic, drenched, legacy, and source-faithful systems. (iteration 5)
- Treating symmetry as an AI defect: low-variance Product and precision surfaces can earn symmetry; the defect is unreasoned default composition. (iteration 5)
- Copying all 21 macrostructures and roughly 50 component packets as a second component library. The durable value is the packet schema and selection distinctions; the raw catalogue would create parallel doctrine and implementation ownership. (iteration 6)
- Copying sample HTML/CSS/JS as Interface output. The shipped mode is advisory; implementation belongs to an accepted `sk-code` handoff. (iteration 6)
- Hotlinking or redistributing the Hallmark imagery kit. The manifest is a placeholder and the hosted binaries are not covered by the checked-in source alone. (iteration 6)
- Importing exact vendor recommendations, price claims, fixed tilt/icon/file-size numbers, or universal medium priority. These are volatile or brief-dependent. (iteration 6)
- Preserving the Hallmark stylesheet stamp or diversification log. sk-design already carries accepted decisions and evidence in typed envelopes; source comments should explain durable implementation reasons, not workflow history. (iteration 6)
- Requiring imagery on every hero or forbidding typography-only interfaces. This creates the same generic-media pressure the anti-slop workflow is meant to remove. (iteration 6)
- Adding a separate curated-theme database: the existing generic facet, token-axis, FTS and vector schema already has the required extension points. (iteration 7)
- Copying exact duration multipliers or theme-specific CSS/token values: the portable idea is semantic motion character; close textual/code reuse would also require Hallmark's MIT notice. (iteration 7)
- Importing Hallmark's twenty theme definitions or exact axis memberships as sk-design presets: this would create a chooser menu and parallel doctrine, conflicting with Interface's evidence-anchor contract. (iteration 7)
- Persisting a `.hallmark/log.json` analogue solely for novelty: sk-design's variation contract needs diversity inside the requested option set, while cross-run memory can override a pinned brief or owned system. (iteration 7)
- Treating “genre” as a user-facing style picker. In sk-design it is useful only as evidence-derived retrieval/audit metadata subordinate to the brief and owned system. (iteration 7)
- Treating all twenty catalog entries as equally specified. Only four checked-in theme packets carry the richer affinity/voice/motion contract; the remaining themes are token-block entries, so the catalog cannot serve as a uniform schema without new authoring. (iteration 7)
- A Nanobanana-specific integration inside sk-design. (iteration 8)
- A new live-preview MCP without observed transport failures. (iteration 8)
- Copying named themes, `Plate`, motion multipliers, or cookbook HTML/CSS sketches. (iteration 8)
- New standalone redesign, variant, study, or explain commands. (iteration 8)
- Sound/haptic guidance without a platform contract. (iteration 8)
- Treating `design.md` as one universal contract failed: measured extraction and brief-authored invention require distinct artifacts. (iteration 8)
- Treating every Hallmark ROADMAP label as a sk-design gap failed: variants, charts, image-led direction, extraction, redesign, rationale artifacts, and render critique already exist under different names. (iteration 8)
- A Nanobanana-specific integration, `Plate` preset, or dedicated live-preview MCP inside sk-design. (iteration 9)
- Copying or hotlinking hosted imagery, attributed quotations, vendor claims, prices, or other third-party material whose rights are not established by Hallmark's MIT file. (iteration 9)
- Copying the twenty named themes, exact token values, motion multipliers, 21 macrostructure recipes, 50 component packets, CSS stamps, or persistent Hallmark novelty log. (iteration 9)
- Counting README's “57 gates” as canonical is eliminated: `slop-test.md` and the operative build contract use 58; the set is gates 1–57 plus 38a. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1] (iteration 9)
- New standalone `redesign`, `study`, `variant`, or `explain` commands. (iteration 9)
- Replacing v3 `DESIGN.md`, canonical JSON, sidecars, and validators with Hallmark's compact portable file. (iteration 9)
- Sound/haptic policy without a concrete platform and accessibility need. (iteration 9)
- Treating authored brand invention and measured extraction as one `DESIGN.md` contract is eliminated by MD-generator's authoring boundary. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:86] (iteration 9)
- Treating every ROADMAP label as a sk-design gap is eliminated because redesign, variants, charts, image-led direction, extraction, proof/explanation, and render critique already have owners. [SOURCE: .opencode/skills/sk-design/SKILL.md:25] (iteration 9)
- Wholesale replacement of the canon-conformant five-mode hub or addition of a sixth mode. (iteration 9)
- A `variant` alias does not earn a public-surface change because directions and variation triggers cover it. (iteration 10)
- Broad state, microinteraction, and data-viz additions would duplicate shipped guidance. (iteration 10)
- Composition DNA cannot be attributed to `design-md.md`; its structured source is `study.md`. (iteration 10)
- Inflating novelty by proposing another public capability category. (iteration 10)
- Multi-page coherence does not require a new extraction relationship type; `DesignBoundary` already models it. (iteration 10)
- Retrying blocked directions: wholesale hub replacement, a sixth mode, standalone redesign/study/variant/explain commands, a named theme database, copied catalogs, Hallmark stamps/logs, or provider-specific Nanobanana wiring. (iteration 10)
- Treating repeated conceptual rows as separate implementation packets. (iteration 10)
- Using README's “57 gates” count; the canonical reference states 58. (iteration 10)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Hallmark source root: `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/`.
- Hallmark has `SKILL.md`, `README.md`, `ROADMAP.md`, `LICENSE`, and 24 reference documents under `skills/hallmark/references/`.
- sk-design is a shipped five-mode hub: INTERFACE, FOUNDATIONS, AUDIT, MOTION, and MD-GENERATOR, with `/interface:*` commands and a large extracted styles corpus.
- `resource-map.md` is absent for the target packet; coverage must be established from direct file inventories.
- Startup memory retrieval was unavailable; local sources are authoritative.

### Bounded Context Snapshot

- Primary targets: `.opencode/skills/sk-design/SKILL.md`, its five leaf mode packets, `.opencode/commands/interface/`, shared anti-slop contracts, audit procedures/assets, MD-generator schema and backend, motion references, and style database assets.
- Required output: one matrix row per Hallmark asset plus ranked adoptions and phased plan.
- Constraint: all researched sources are read-only; all writes remain in this lineage packet.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false; final synthesis is workflow-owned
- Current generation: 1
- Session: `fanout-sol-codex-1784525177424-b0sf31`
- Started: 2026-07-20T05:28:15Z
