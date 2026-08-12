# Iteration 1: Template weight after renderInlineGates + Reducer Engineering prior art

## Focus

Measure raw vs level-rendered `templates/manifest/*.tmpl` weight; map Reducer Engineering cleanup (validate → dedup → contradiction surface) onto existing scaffold/render and deep-loop reducers — classify already-exists vs gap on the **templates** surface. Do not reinvent deep-loop reducers.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor: `{"kind":"cli-cursor","model":"cursor-grok-4.5-high"}`. Write authority: lineage `artifact_dir` only.

## Actions Taken

1. Counted raw LOC across `templates/manifest/*.tmpl` (5541 total).
2. Ran `renderInlineGates` for core docs at Levels 1–3+.
3. Confirmed `create.sh` / SKILL.md mandate scaffold via `inline-gate-renderer` (not raw tmpl read).
4. Inventoried deep-loop reducer family + contradiction-supersession as prior art for Reducer Engineering.

## Findings

1. **Raw 5541 LOC is a source-maintainability figure, not the scaffolded agent context.** Confirmed `wc -l` sum across 13 `*.tmpl` files = 5541. [SOURCE: shell inventory of `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl`]
   - **Classification:** `already-exists` (weight problem is partially solved by gated render) / axis: **context-reduction** / surface: **templates**

2. **Level gating collapses core authoring docs dramatically.** Measured with `renderInlineGates`:
   - `spec.md.tmpl` raw 875 → L1 144 / L2 198 / L3 246 / L3+ 282 lines
   - `plan.md.tmpl` raw 1080 → L1 171 / L2 227 / L3 304 / L3+ 373 lines
   - `tasks.md.tmpl` raw 432 → ~107 lines at all levels
   - `checklist.md.tmpl` raw 594 → L1 **0** lines (correctly absent); L2 149; L3 221
   [SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182`] [SOURCE: measured render of `templates/manifest/spec.md.tmpl` IF blocks at lines 1/146/345/592]
   - **Classification:** `already-exists` (deterministic level reducer for templates) / axis: **context-reduction** / surface: **templates**

3. **Scaffold path already enforces gated render.** `create.sh` binds `INLINE_GATE_RENDERER=.../inline-gate-renderer.sh`; SKILL.md ALWAYS #2: “Use `create.sh` or `inline-gate-renderer`, NEVER create from scratch”. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:981`] [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:452`]
   - **Classification:** `already-exists` / axis: **plan-adherence** + **context-reduction** / surface: **templates** + **doc-logic**

4. **Genuine gap: ungated optional templates still dump near-full weight at every level.** `research.md.tmpl` raw 947 → L1/L2/L3 all **945 lines / ~21.8k chars** (essentially no level reduction). Same pattern: `handover.md.tmpl` ~153 lines all levels; `resource-map.md.tmpl` ~203 lines all levels. [SOURCE: measured `renderInlineGates` on those files; IF-gate count for `research.md.tmpl` is 1]
   - **Classification:** `genuine-gap` / axis: **context-reduction** / surface: **templates**
   - **Implementable idea:** Add level IF gates (or lean L1 stubs) for `research.md.tmpl` / optional docs so L1 packets do not inherit a 21k-char research scaffold when unused.

5. **Genuine gap: no machine gate stops an agent from `Read`ing raw multi-level `.tmpl`.** Policy is prompt-only (SKILL.md NEVER #1). Accidental raw reads reintroduce the 5541 LOC problem. [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:475`]
   - **Classification:** `genuine-gap` / axis: **plan-adherence** + **context-reduction** / surface: **templates** + **doc-logic**
   - **Implementable idea:** Authoring checklist / tooling helper that returns only `--level N` rendered view; optionally warn in docs that raw `.tmpl` is maintainer-only.

6. **Reducer Engineering’s deterministic validate→dedup→contradiction pipeline already ships in deep-loop — do not reinvent.** Evidence:
   - Per-mode reducers under `runtime/lib/deep-research-reducers/` etc.
   - `reduce-state.cjs` owns registry/dashboard/strategy sync [SOURCE: `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2902-2920`]
   - `contradiction-supersession` exports claim relationship reduce/replay APIs [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/index.ts:1-40`]
   - Fresh-context LEAF iterations [SOURCE: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:313`]
   - **Classification:** `already-exists` (as deep-loop prior art) / `not-applicable` to “add a new synthesis reducer for deep-research” / axis: **general-opt** / surface: **context-system** (deep-loop) — **refute** copying the Twitter reducer function into speckit.

7. **Template IF-gating is the closest in-repo analogue of a “model-free reducer” on the templates surface.** It strips non-applicable level sections before any model reads the scaffold. [SOURCE: `inline-gate-renderer.ts:182` + `orchestrator.js:309-339`]
   - **Classification:** `already-exists` / axis: **context-reduction** / surface: **templates**

## Ruled Out

- Treating “cut 5541 LOC by rewriting all templates” as the primary win — most authoring context already collapses via `renderInlineGates`.
- Porting Reducer Engineering’s Python `reduce_findings` into system-speckit — would duplicate deep-loop findings-registry / contradiction-supersession.
- Splitting every template into four physical files as first move — gating already provides level slices; split is optional hardening against raw reads.

## Dead Ends

- Searching for a missing “template LOC bomb” in scaffolded L1 packets: core L1 set (spec+plan+tasks+impl-summary) is ~558 rendered lines combined, not 5541.

## Edge Cases

- `checklist.md.tmpl` L1 renders empty (0 chars) — correct for Level 1 (no checklist required).
- `phase-parent.spec.md.tmpl` renders empty for numeric levels (phase-only gate) — expected.
- Agents editing templates as maintainers still need raw multi-level files; gap is authoring-time reads, not maintainer workflow.

## Sources Consulted

- `templates/manifest/*.tmpl` LOC inventory
- `scripts/templates/inline-gate-renderer.ts:182`
- `scripts/spec/create.sh:981`
- `SKILL.md:452,475`
- `deep-research/SKILL.md:313`
- `reduce-state.cjs:2902+`
- `contradiction-supersession/index.ts`
- Measured render sizes for research/handover/resource-map tmpl

## Assessment

- New information ratio: 1.0
- Novelty justification: First pass; all template-weight measurements and prior-art classifications are new to this lineage.
- Questions addressed: Q1 (partial+strong), Q2 (templates/deep-loop prior art).
- Questions answered: Q1 primary answer — raw LOC ≠ agent context after gated render; remaining gaps are ungated optional tmpls + raw-read discipline.

## Reflection

- What worked: Measuring rendered line counts falsified the naïve “5541 LOC must be read” framing.
- What failed: None material.
- Ruled out: Blind template-deletion programs and reinventing deep-loop reducers.

## Recommended Next Focus

Map Agent Engineering harness patterns (Default-FAIL, fresh evaluator, self-authored handoff, complexity-matches-task) onto Gate 3 / Levels / validate.sh / Iron Law / handover — classify plan-adherence gaps on the **doc-logic** surface.
