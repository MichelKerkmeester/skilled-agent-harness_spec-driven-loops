# Iteration 12: `/interface:design-reference` Creation Template

## Focus
Specialize the scaffold for evidence-backed `DESIGN.md` extraction from a live website.

## Findings
1. **Brief intake:** canonical URL, allowed origin/scope, representative routes/states/viewports/themes, access/auth constraints, dynamic-loading behavior, output target, overwrite policy, desired coverage, and validation bar. Require explicit confirmation before overwrite because extraction is a generated artifact operation. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:28-40]
2. **Grounding/provenance:** the source website is the primary exemplar and must remain attributable. Record URL, retrieval time, routes/states/viewports observed, stylesheet origins, inaccessible surfaces, and source-vs-inferred status for every extracted category. External inspiration has no role in faithful extraction.
3. **Scaffolded flow:** `Source Manifest -> access/preflight -> md-generator mode -> embedded extract-write-validate pipeline -> route/state capture -> CSS/token/type/layout/component evidence normalization -> v3 DESIGN.md assembly -> schema validator -> representative visual spot-check -> coverage/limitations report`. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:44-66]
4. **Creative build boundary:** this command reconstructs a reusable style reference; it does not redesign the source, fabricate missing values, or normalize intentional exceptions away. Derived semantic names must be labeled inferred and tied to raw evidence. If extraction fails, preserve diagnostics rather than emit a plausible generic design system.
5. **Visible output:** `Source Manifest`, `Capture Matrix`, `Stylesheet Evidence`, `Extracted System`, `Inferences and Exceptions`, `Validation Results`, `Coverage/Limitations`, and `Artifact Path`. The artifact is accepted only when schema validation passes; visual fidelity remains qualified by sampled routes/states.

## Prompt Template
```text
Create a reusable design reference from {canonicalUrl}. Resolve {allowedOrigin, routesStates, viewportsThemes, access, dynamicLoading, outputTarget, overwritePolicy, coverage, validationBar}; obtain confirmation before overwrite. Load sk-design mode md-generator and use its embedded extraction pipeline rather than hand-authoring a substitute. Treat the live site as the sole primary exemplar. Capture a provenance-rich source manifest, extract raw CSS and rendered evidence across the agreed matrix, normalize it into the v3 DESIGN.md schema, and label inferred semantics and unobserved states. Never fabricate around failed capture. Run the schema validator and representative spot checks. Return the eight output blocks with evidence-qualified coverage and the validated artifact path.
```

## Ruled Out
- Adding unrelated inspiration during faithful extraction.
- Emitting a generic system when source capture is incomplete or fails.

## Assessment
- New information ratio: 0.58
- Novelty justification: Adds source manifest, capture matrix, inference labels, overwrite guard, extraction failure behavior, and coverage semantics.

## Recommended Next Focus
Test exemplar acquisition and evidence records across all five commands, including `no-fit`, provenance, and prompt-injection boundaries.
