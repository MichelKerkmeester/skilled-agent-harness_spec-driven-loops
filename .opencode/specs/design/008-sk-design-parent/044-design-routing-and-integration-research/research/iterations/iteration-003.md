# Focus

[D1-3 / D1] impeccable `distill`, `clarify`, `bolder`, `quieter`, and `delight` flows vs `design-interface`: residual transformation craft.

# Actions Taken

1. Re-read the deep-loop and deep-research contracts, then treated this as a leaf research iteration: write only the requested research artifacts and do not edit live `sk-design`, commands, MCP, or CLI content.
2. Reviewed the current strategy and the prior D1 iterations to avoid re-covering `harden`, `optimize`, `polish`, or provider-specific AI tell work.
3. Read the real impeccable source flow files under `external/impeccable-main/.opencode/skills/impeccable/reference/`: `distill.md`, `clarify.md`, `bolder.md`, `quieter.md`, and `delight.md`.
4. Compared those flow shapes against `sk-design/design-interface` routing, process, pre-flight, copy, register, and motion references, plus the current audit-side transform remediation map.

# Findings

## F1 - Transform verbs are mostly audit-side routing, not interface-side authoring workflows

Evidence:
- Impeccable carries first-class flow files for the task verbs in scope. `bolder.md` starts by rejecting the AI default tricks for "bold" and then separates Brand vs Product meanings (`bolder.md:1-9`). `quieter.md` likewise has Brand vs Product semantics and warns that quiet means precision, not generic absence (`quieter.md:5-9`, `quieter.md:33-44`). `distill.md` frames simplification as removing obstacles rather than features (`distill.md:18-27`).
- The `sk-design` parent routes generic visual-direction work to `interface` and keeps per-mode logic out of the hub (`sk-design/SKILL.md:23-29`, `sk-design/SKILL.md:39-62`, `sk-design/SKILL.md:85-99`), but the interface registry aliases do not name `bolder`, `quieter`, `distill`, `clarify`, or `delight` (`mode-registry.json:14-26`).
- `design-interface` triggers generic design, redesign, variation, hero, landing, templated, and AI-generated prompts (`design-interface/SKILL.md:24-32`). Its parseable intent model names design principles, register dials, variation, quality, real UI, mechanical pre-flight, copy/mock data, redesign intake, grounding, references, and aesthetics, but not these transform verbs (`design-interface/SKILL.md:98-126`).
- The strongest current transform mapping lives in `design-audit`: audit explicitly triggers on `bolder`, `quieter`, and `distill` (`design-audit/SKILL.md:23-31`), and `transform_remediation.md` maps bolder, quieter, distill, and redesign to findings, owners, and accepted paths (`transform_remediation.md:24-31`, `transform_remediation.md:50-76`).

Buildable recommendation:
- Add a `design-interface/references/design-process/transform_application.md` reference, or equivalent asset card, that owns authoring-side transform workflows for `bolder`, `quieter`, `distill`, `clarify`, and `delight`.
- Add transform aliases to `sk-design/mode-registry.json` for `interface` or define a deterministic parent tie-breaker: audit owns "tell me whether this should be bolder/quieter/distilled"; interface owns "make this bolder/quieter/distilled" and "clarify/delight this UI"; motion co-loads only when the chosen transform includes motion.
- Add router-replay gold prompts later: "make this hero bolder", "quiet this dashboard down", "distill this settings page", "clarify these errors", "add delight to checkout success". Expected: hub routes to `interface` plus specific sibling co-loads where needed, not audit-only.

Enforceability:
- ENFORCEABLE for routing: registry aliases, intent keywords, and router-replay expected modes are deterministic on a gold corpus.
- ENFORCEABLE for utilization proof if the later card requires filled fields for transform verb, register, before problem, after direction, sibling owners, and verification.
- ADVISORY for the creative quality of the actual transform; the card can prove reasoning was applied, not that the aesthetic decision is inherently excellent.

## F2 - `distill` needs an essence-and-preservation card, not just the current "one bold move" heuristic

Evidence:
- Impeccable `distill` asks for the primary user goal, necessary vs nice-to-have, what can be removed/hidden/combined, and the "20% that delivers 80%" before it cuts anything (`distill.md:18-24`).
- Its transformation dimensions cover information architecture, visual simplification, layout simplification, interaction simplification, content simplification, and even code simplification (`distill.md:43-84`), with hard negatives against removing necessary functionality or information users need (`distill.md:86-92`).
- Its verification is explicitly outcome-shaped: faster task completion, reduced cognitive load, still complete, clearer hierarchy, and better performance (`distill.md:94-103`), followed by documentation of removed complexity and alternative access points (`distill.md:104-109`).
- `design-interface` has the relevant taste-level rule that the signature element is the one memorable thing and surrounding material stays quiet (`design_principles.md:76-79`), plus pre-flight checks for mechanical layout and content (`interface_preflight_card.md:14-18`, `interface_preflight_card.md:22-32`). It does not currently require an essence inventory, a keep/remove/hide/combine ledger, or "still complete" proof.

Buildable recommendation:
- In the proposed transform card, add a `Distill` section with required rows: one primary user goal, essential elements, removed elements, hidden/progressive-disclosure elements, combined elements, preserved user-critical function, and post-transform completion proof.
- Add a static markdown validator later that fails the card if a `distill` transform lacks any preservation field or if it lists removals without an alternative access or "not needed" rationale.
- Add one benchmark fixture where a model incorrectly deletes a useful dashboard filter, and expected output flags the missing preservation proof.

Enforceability:
- ENFORCEABLE for artifact shape: required distill rows and preservation proof can be validated.
- PARTLY ENFORCEABLE in code/source review when removed controls or routes are diff-visible.
- ADVISORY for whether the chosen "essence" is right without user or product evidence.

## F3 - `clarify` has deeper UX-writing workflow than the current content gate

Evidence:
- Impeccable `clarify` starts by requiring audience technical level and the user's mental state in context (`clarify.md:1-3`), then asks who the audience is, what action is needed, and what constraints apply (`clarify.md:21-27`).
- It gives specific rewrite patterns for errors, form labels, CTAs, help text, empty states, success messages, loading states, confirmations, and navigation (`clarify.md:44-139`). It also includes the error formula "what happened, why, how to fix" (`clarify.md:200-203`) and accessibility/translation writing constraints (`clarify.md:236-255`).
- `design-interface` correctly treats copy as design material (`design_principles.md:82-92`) and its content gate catches AI-tell copy, placeholder data, fake precision, one-register violations, and state-copy formulas (`copy_and_mock_data.md:53-87`, `copy_and_mock_data.md:119-136`, `copy_and_mock_data.md:140-155`).
- But `copy_and_mock_data.md` explicitly marks selected UI-copy tells as examples rather than a wholesale validator (`copy_and_mock_data.md:76-78`), and the current interface pre-flight copy audit is a sweep for banned or broken output, not a before/after rewrite workflow (`interface_preflight_card.md:120-131`).

Buildable recommendation:
- Add a `Clarify` lane to the transform card with required fields: audience, user mental state, affected UI state, current copy, problem type, rewritten copy, actionability proof, terminology consistency, and localization/expansion check.
- Link this lane to `copy_and_mock_data.md` for pass/fail content tells, but keep the clarify lane as the authoring workflow for improving unclear UI text.
- Add fixture prompts for an ambiguous destructive confirmation, a vague permission error, a generic CTA, and a loading state over a few seconds. Expected outputs must include before/after copy and the state-specific formula used.

Enforceability:
- ENFORCEABLE for transform artifact completeness and before/after presence.
- ENFORCEABLE for some static checks: banned filler, placeholder strings, generic CTA labels, missing action names, and expansion-room checklist fields.
- ADVISORY for tone quality and whether the copy fits a subtle brand voice.

## F4 - Delight is split between interface taste and motion mechanics, but lacks an "earned moment" proof

Evidence:
- Impeccable `delight` requires domain appropriateness up front and separates Brand delight distributed across a surface from Product delight at specific moments such as completion, first-time actions, error recovery, and milestones (`delight.md:1-12`).
- It asks for natural delight moments, audience, emotional context, appropriateness, and strategy before adding anything (`delight.md:15-42`), then constrains delight so it never blocks, delays, or hides poor UX (`delight.md:48-64`, `delight.md:281-289`).
- It verifies delight against repeat exposure, opt-out/skip behavior, performance, appropriateness, accessibility, and reduced motion (`delight.md:291-300`).
- `design-motion` has a strong micro-interaction boundary: delight belongs at success, first-time action, empty state, milestone, or error recovery, must be quick/appropriate/optional, and must not delay core action or use humor in critical errors (`micro_interactions.md:124-133`). Its handoff snippet captures purpose, trigger state, timing, properties, reduced motion, and performance risk (`micro_interactions.md:149-160`).
- `design-interface` only has broad motion/taste gates: one orchestrated moment, responsive/focus/reduced-motion quality floor, and pre-flight motion motivation (`design-interface/SKILL.md:170-176`, `interface_preflight_card.md:134-143`). The mode registry motion aliases also do not surface `delight` as a routing alias (`mode-registry.json:39-50`).

Buildable recommendation:
- Add a `Delight Moment` card shared by interface and motion: moment type, register, user emotional state, why the moment earns delight, exact interaction/copy/visual treatment, repeat-exposure behavior, opt-out or skip path, reduced-motion path, performance budget, and "does not block core task" proof.
- Route "add delight" to `interface + motion` when the request changes visual/copy direction and temporal behavior; route to `motion` alone only when the visual direction is already fixed and the task is a micro-interaction.
- Add benchmark fixtures for routine save, first publish, critical error, empty state, and milestone. Expected: routine save gets restrained feedback; milestone can earn celebration; critical error cannot get playful copy.

Enforceability:
- ENFORCEABLE for card completeness and routing expectations.
- ENFORCEABLE for hard boundaries in generated artifacts: reduced-motion path, opt-out/skip field, performance-risk field, and "does not block core task" field.
- ADVISORY for whether the surprise actually delights users after repeated use.

# Questions Answered

- Q2 partially: parent-to-sub-skill routing can be made provable for transformation verbs by adding a router-replay corpus with expected modes, then requiring content-bound transform cards as utilization proof.
- Q5 partially: the buildable D1 backlog item is not more prose. It is a small transform-application contract for `interface`, plus a router/enforcement corpus that proves the transform intent loaded and was applied.

# Questions Remaining

- Should the transform card live only in `design-interface`, or should it be a shared asset with mode-owned sections for interface, foundations, motion, and audit?
- Should `clarify` become an interface transform lane, or should it be a separate command-level surface under `/design:*` while still routing through `interface`?
- Should `delight` be a routing alias for `motion`, `interface`, or a deliberate pair rule depending on whether the request changes the visual/copy direction too?
- How strict should enforcement be for "bolder" and "quieter" quality when the best outcome is mostly visual judgment?

# Next Focus

Advance the angle bank. Recommended next pass: move from D1 residual craft into D2 command granularity, using this iteration's transform verbs as test cases for whether `/design:*` commands should expose `bolder`, `quieter`, `distill`, `clarify`, and `delight` as first-class task surfaces or keep them as routed intents under `sk-design`.
