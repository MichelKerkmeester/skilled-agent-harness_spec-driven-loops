# Iteration 1: Fleet template weight + Reducer Engineering prior art on templates surface

## Focus

Measure fleet-wide raw vs level-rendered `templates/manifest/*.tmpl` weight; map Reducer Engineering validate→dedup→contradiction onto existing `renderInlineGates` and deep-loop machinery. Classify every recommendation on the **templates** surface. Do not propose new deep-loop reducers.

Executor: `cli-cursor` / `composer-2.5`. Write authority: lineage `artifact_dir` only.

## Findings

1. **Raw 5,541 LOC is maintainer inventory, not typical agent scaffold context.** Confirmed `wc -l` across 13 `*.tmpl` files = 5,541 total lines. [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl` inventory]
   - **Classification:** `already-exists` (problem partially solved by gated render) / **axis:** context-reduction / **surface:** templates

2. **Fleet-level `renderInlineGates` collapses weight materially at L1.** Measured all 13 templates at Level 1: 2,162 lines / 58,464 chars (~14,616 est. tokens) vs raw 5,554 lines. L2: 2,419 lines; L3: 2,758; L3+: 2,865. Core authoring docs (`spec`, `plan`, `tasks`) drop 80–85% at L1 via `<!-- IF level:... -->` gates. [SOURCE: `.opencode/skills/system-spec-kit/scripts/mcp-server/lib/validation/orchestrator.js:309-339`] [SOURCE: measured render across `templates/manifest/*.tmpl`]
   - **Classification:** `already-exists` / **axis:** context-reduction / **surface:** templates

3. **Scaffold path mandates gated render — agents should not read raw `.tmpl`.** `create.sh` binds `INLINE_GATE_RENDERER` to `inline-gate-renderer.sh`; SKILL.md ALWAYS #2: scaffold via `create.sh` or `inline-gate-renderer`, NEVER create from scratch; NEVER #1 forbids creating documentation from scratch. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:981`] [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:452,475`]
   - **Classification:** `already-exists` / **axis:** plan-adherence + context-reduction / **surface:** templates + doc-logic

4. **Genuine gap: `research.md.tmpl` is effectively ungated across levels.** Opening gate is `<!-- IF level:1,2,3,3+,phase -->` (line 1), so all numeric levels receive ~945 rendered lines / ~21.8k chars. Same class of problem for `handover.md.tmpl` (~153 lines) and `resource-map.md.tmpl` (~203 lines) with single broad gates. [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:1`] [SOURCE: measured `renderInlineGates` output]
   - **Classification:** `genuine-gap` / **axis:** context-reduction / **surface:** templates
   - **Implementable:** Add level-specific IF sections (or L1 lean stub) inside `research.md.tmpl` so Level 1 packets that never author `research/research.md` do not carry a 21k-char scaffold in maintainer previews or accidental raw reads.

5. **Genuine gap: no machine enforcement against raw `.tmpl` reads.** Policy is prompt-time only (SKILL.md). An agent that `Read`s `spec.md.tmpl` directly gets all four level bodies (~875 lines for spec alone). [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:452`]
   - **Classification:** `genuine-gap` / **axis:** plan-adherence + context-reduction / **surface:** templates + doc-logic
   - **Implementable:** Doc-workflow helper or authoring checklist item: "for agent consumption, render `--level N` output only."

6. **Reducer Engineering's synthesis-time reducer already exists in deep-loop — refute duplication.** `reduce-state.cjs` owns registry/dashboard/strategy sync; `contradiction-supersession` exports claim relationship reduce/replay APIs; deep-research mandates fresh-context LEAF iterations. [SOURCE: `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2902-2910`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/index.ts:1-40`] [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:311-313`]
   - **Classification:** `already-exists` (deep-loop) / `not-applicable` (new speckit reducer) / **axis:** general-opt / **surface:** context-system (deep-loop)

7. **`renderInlineGates` is the in-repo "model-free reducer" for templates.** Strips inactive level sections deterministically before any model sees scaffold output — same separation-of-concerns as Reducer Engineering's code-vs-model split. [SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182-239`] [SOURCE: `orchestrator.js:309-339`]
   - **Classification:** `already-exists` / **axis:** context-reduction / **surface:** templates

## Ruled Out

- Fleet-wide template rewrite to cut 5,541 LOC — IF gating already provides level slices; problem is ungated optional templates + raw-read discipline.
- Porting Twitter `reduce_findings()` into system-speckit — duplicates findings-registry + contradiction-supersession.

## Dead Ends

- Hunting a "missing template reducer" separate from `inline-gate-renderer` — it is the reducer.

## Sources Consulted

- `templates/manifest/*.tmpl` (13 files, 5,541 LOC)
- `scripts/mcp-server/lib/validation/orchestrator.js:309-339`
- `scripts/templates/inline-gate-renderer.ts`
- `scripts/spec/create.sh:981`
- `SKILL.md:452,475`
- `deep-research/scripts/reduce-state.cjs:2902+`
- `runtime/lib/contradiction-supersession/index.ts`

## Assessment

- **newInfoRatio:** 0.9
- **Novelty justification:** Fleet-wide render metrics and ungated-optional-template gap are new evidence for this lineage.
- **Questions addressed:** Q1 (complete), Q2 (templates + deep-loop prior art, partial).

## Reflection

- What worked: Numeric render measurement separated maintainer LOC from agent-facing scaffold weight.
- What failed: Initial hypothesis that all 5,541 lines land in context.
- Ruled out: New synthesis reducer in speckit.

## Recommended Next Focus

Map Agent Engineering harness (Default-FAIL, fresh evaluator, handoff, complexity-matches-task) onto Gate 3 / validate.sh / Iron Law / memory handlers — classify plan-adherence and memory gaps.
