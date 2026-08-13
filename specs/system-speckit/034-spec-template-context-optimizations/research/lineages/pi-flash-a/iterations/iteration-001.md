# Iteration 1: Template Weight & Reducer Engineering Mapping

## Focus
Measure the real token load of `templates/manifest/*.tmpl` (raw vs level-gated rendered), identify where the ~5,541 raw LOC survives into agent context, and map Reducer Engineering's deterministic-reducer concepts onto the template surface.

## Findings

### F1.1 — Level-gated rendering IS the deterministic reducer for templates (already-exists, axis: context-reduction, surface: templates)
- Raw manifest total: 5,541 LOC across 13 templates (measured `wc -l templates/manifest/*.tmpl`; plan 1079, research 946, spec 874, checklist 593, implementation-summary 547, tasks 431, decision-record 289, resource-map 204, handover 154, debug-delegation 140, phase-parent 134, review.spec 100, context-index 50).
- `inline-gate-renderer.ts:182` (`renderInlineGates`) deterministically strips `<!-- IF level:N -->` blocks with no model in the loop — exactly the Reducer Engineering "code, not model" principle. Rendered sizes: spec.md.tmpl 874→143 (L1), 197 (L2), 245 (L3), 281 (L3+); plan.md.tmpl 1079→170 (L1); tasks 431→106 (L1); implementation-summary 547→135 (L1). Gating delivers ~84% reduction on the core docs at L1. The raw 5,541 figure is a red herring for authoring cost.
- [SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182], [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:1]

### F1.2 — research.md.tmpl is effectively ungated: 944 lines rendered at EVERY level (genuine-gap, axis: context-reduction, surface: templates)
- `research.md.tmpl` carries exactly one gate at line 1: `<!-- IF level:1,2,3,3+,phase -->` — an always-true passthrough. Rendered output is 944 lines at L1 and 944 at L3 (measured). It is the 2nd-heaviest template and the heaviest single document any authoring agent must read when a packet includes research.md.
- It is absent from `spec-kit-docs.json` `documents` map (only `handover.md`... `research.md` returns null), so no level contract, `absenceBehavior`, or `creationTrigger` governs it; `template-guide.md:183` and `:406` still point authors at the raw 946-line file.
- Concrete fix shape (report-only): gate the research template into level-appropriate sections like spec.md.tmpl (sections per level), or split the "workflow-owned" synthesis shape from the author-facing research brief. Estimated authoring-context saving ~700-800 lines for any packet that includes research.md.
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:1], [SOURCE: .opencode/skills/system-spec-kit/references/templates/template-guide.md:183]

### F1.3 — Ungated utility templates are constant-weight at every level (genuine-gap, axis: context-reduction, surface: templates)
- resource-map.md.tmpl 204→202 (L1), handover.md.tmpl 154→152, debug-delegation.md.tmpl 140→138, review.spec.md.tmpl 100→100 (zero gates). Their single gates are also passthroughs. An authoring agent at any level reads the full body. Lower blast radius than F1.2 because resource-map is optional (`absenceBehavior: warn`, spec-kit-docs.json) and handover is command-owned (`creationTrigger: memory-save`), but debug-delegation and review.spec have no level contract either.
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:1], [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/review.spec.md.tmpl:1]

### F1.4 — Fail-closed missing-template handling = "drop malformed, log the loss" reducer guard (already-exists, axis: general-opt, surface: templates)
- `template-utils.sh:52` "Missing required template documents fail closed" and `:108` render-status propagation: missing templates abort rather than silently producing partial docs — the Reducer Engineering guard ("malformed → dropped before grouping, logged, never silently absorbed") implemented for the template pipeline.
- [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:52]

### F1.5 — Cross-template front-matter duplication (genuine-gap, minor, axis: context-reduction, surface: templates)
- All 13 templates repeat the same front-matter skeleton (title/description/trigger_phrases/importance_tier/contextType/_memory) plus `SPECKIT_TEMPLATE_SOURCE` comment, ~12-15 lines each ≈ 170+ duplicated lines. Hoisting to a shared front-matter partial would save ~150 lines of manifest weight and end drift (template version comment is already at risk of rotting). Low value: rendered docs dominate the authoring cost.
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:1-16], [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:1-16]

### F1.6 — Rendered-path discipline is documented; raw-read risk remains for ad-hoc authoring (already-exists w/ residue, axis: context-reduction, surface: templates)
- `template-guide.md:36` mandates "Always scaffold through create.sh or render from templates/manifest/" — the harness already tells agents not to read raw templates. However `SKILL.md:99` and the `templates/` dir itself still expose raw `.tmpl` files; a model that ignores the guide reads 5,541 lines instead of ~143-281. Residual risk, not a code gap.
- [SOURCE: .opencode/skills/system-spec-kit/references/templates/template-guide.md:36]

## Sources Consulted
- `wc -l` + render measurements via `node .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts --level N`
- `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl` (13 files)
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts`
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh`
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json`
- `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts`
- `.opencode/skills/system-spec-kit/references/templates/template-guide.md`
- `.opencode/skills/system-spec-kit/SKILL.md`

## Assessment
- newInfoRatio: 0.95
- Novelty justification: first measurement pass on this lineage; raw-vs-rendered numbers and the research.md.tmpl ungated finding are new; F1.1/F1.4 confirm prior art claims with fresh measurements.
- Confidence: high for measurements (direct command output); medium for F1.2 blast-radius estimate (depends on how often research.md is authored vs workflow-owned).

## Reflection
- Worked: measuring rendered output directly (renderer CLI) instead of reading templates end-to-end — turns a LOC argument into evidence.
- Failed/ruled-out: "reduce raw 5,541 LOC" as a goal is refuted — rendered weight is what agents read, and gating already cuts it ~84% at L1 (F1.1). Porting `reduce_findings` into templates is not-applicable — no multi-worker findings flow exists on the template surface; findings reduction already lives in deep-loop reducers (to verify in iteration 3).
- Ruled-out: treating `absenceBehavior: warn` docs as required reading (they are optional by contract).

## Recommended Next Focus
Iteration 2: map Agent Engineering harness patterns (Default-FAIL, fresh-context evaluator, self-authored handoff, external memory, complexity-matches-task) onto the documentation logic: Gate 3 classifier, Documentation Levels 1-3+, validate.sh, and the doc-authoring workflow — with focus on plan-adherence gaps (machine-checked scope vs plan).
