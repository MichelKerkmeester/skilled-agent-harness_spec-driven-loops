# Deep-Research Synthesis: sk-design Foundations Improvement

> Session: `fanout-gpt55fast-1782532104407-9dwd00`
> Executor: `cli-opencode model=openai/gpt-5.5-fast`
> Artifact dir: `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast`
> Stop reason: converged after 6 iterations

## 1. Executive Summary

Foundations is no longer missing the big 009 corpus additions. The data-visualization reference, context adaptation matrix, and token starter asset all exist and were wired in phase 012. The best next improvements are therefore not more foundational theory. They are routing, cross-axis resource loading, handoff UX, and validation visibility.

Priority order:

1. Expand parent `mode-registry.json` foundations aliases for the terms the child already owns.
2. Fix token-system routing so `TOKENS` loads cross-axis context, not only the token scaffold.
3. Add a foundations intake and handoff card that makes the shared register and final `sk-code` handoff explicit.
4. Add annotated worked examples, clearly marked as examples rather than presets.
5. Turn the six manual scenarios into a results and benchmark fixture matrix.

Evidence caveat: the prompt referenced an external corpus under `154-sk-design-parent/external` and a routing benchmark under `154-sk-design-parent/014-routing-benchmark`. Neither path was present locally in this workspace. The Mode A score of 83/100 is treated as operator-provided context, while file-cited evidence comes from the live skill tree, 001 corpus synthesis, 009 research, 012 implementation records, and foundations references/playbooks.

## 2. Method

This lineage followed the deep-research lifecycle with artifact-dir binding supplied by the prompt. It skipped the `resolveArtifactRoot` node by direct override and wrote only under the lineage directory. It ran six evidence iterations, then synthesized after question coverage reached 6/6 and the latest `newInfoRatio` fell to 0.04.

Inputs read:

- Parent hub and registry: `sk-design/SKILL.md`, `mode-registry.json`.
- Target mode: `design-foundations/SKILL.md`, README, references, asset, manual playbook.
- Shared base: `shared/register.md`, `shared/design_token_vocabulary.md`.
- Prior research: 001 corpus synthesis, 001 gap analysis, 009 reference/asset expansion research.
- Implementation evidence: 012 foundations-motion-audit summary and tasks.
- Workflow contract: deep-research skill, command router, auto YAML, state references.

## 3. Current State

The actual target packet is `.opencode/skills/sk-design/design-foundations/`, not `.opencode/skills/sk-design/foundations/`. The public workflow mode is `foundations`, and the parent registry maps that mode to packet `design-foundations`. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:23-29], [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:27-37]

Foundations owns static visual-system decisions: color, type, spacing, layout, hierarchy, responsive adaptation, data visualization, and token handoff. It explicitly does not own interface direction, motion, audit, md-generator extraction, or implementation-only work. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:23-40]

The 009 research recommended three foundations additions: `data_viz.md`, `adaptation_matrix.md`, and `token_starter.md`. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:70-82]

Phase 012 implemented all three and wired them into the foundations router. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:57-76]

## 4. Prioritized Improvements

### P1-1: Expand Parent Foundations Aliases

Problem: the child owns more static-system vocabulary than the parent registry exposes. Parent foundations aliases cover color system, OKLCH palette, dark-mode palette, typography scale, font pairing, spacing system, responsive layout, and design tokens. The child trigger vocabulary also covers layout rhythm, grid, container queries, adaptation matrix, data visualization, chart type, data tables, and token starter. [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:27-37], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:31-32]

Recommendation: add parent aliases for:

- `layout rhythm`
- `grid system`
- `container queries`
- `adaptation matrix`
- `context adaptation`
- `data visualization`
- `chart type`
- `data table`
- `color-for-data`
- `token starter`
- `sk-code handoff`

Rationale: the hub is registry-driven and says `mode-registry.json` is the single source of truth. This is a small, direct way to improve foundations routing without adding content or changing mode boundaries. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:39-58]

### P1-2: Reconcile Token-System Resource Loading

Problem: the loading table says cross-axis token-system work should load all three axis folders plus the parent `design_token_vocabulary.md`, but the pseudocode maps `TOKENS` only to `references/corpus_map.md` and `assets/token_starter.md`. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:92-93], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:115-122]

Recommendation: make `TOKENS` load:

- `references/corpus_map.md`
- `assets/token_starter.md`
- `references/color/oklch_workflow.md`
- `references/color/palette_theming.md`
- `references/type/typography_system.md`
- `references/layout/layout_responsive.md`
- parent `../shared/register.md`
- parent `../shared/design_token_vocabulary.md`

Rationale: token-system prompts are inherently cross-axis. The token starter itself says channel mechanics, contrast repair, and semantic role rules live in color and type references, so loading only the scaffold makes the workflow easier to misuse. [SOURCE: file:.opencode/skills/sk-design/design-foundations/assets/token_starter.md:14-17]

### P2-1: Add A Foundations Intake And Handoff Card

Problem: the shared register is supposed to be read before foundations work, but the resource discovery pseudocode only scans resources under the foundations packet. The skill does point to `../shared/register.md`, but a task-level operator can still miss the register and start choosing token values too early. [SOURCE: file:.opencode/skills/sk-design/shared/register.md:16-29], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:81-94]

Recommendation: add `assets/foundations_handoff_card.md` or extend `assets/token_starter.md` with a compact final card containing:

- Register: Brand or Product, with the inherited color strategy and density.
- Surface role: brand, product, data, marketing, or platform adaptation.
- Source evidence: brand hue, existing tokens, target platforms, contrast target.
- Output schema: semantic color table, type role table, spacing scale, responsive rules, data-viz scale rules.
- Implementation handoff: CSS variable names or theme-token names, breakpoint intent, accessibility checks, unresolved risks.
- `sk-code` instruction: implement these tokens, do not invent roles or breakpoints.

Rationale: foundations already defines the success criterion: final handoff must be implementable by `sk-code` without guessing token roles or breakpoint intent. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:309-317]

### P2-2: Add Annotated Worked Examples, Not Presets

Problem: the README tells operators to read the register and fill `token_starter.md`, but there is no completed example showing what a good answer looks like. [SOURCE: file:.opencode/skills/sk-design/design-foundations/README.md:52-68]

Recommendation: add one small examples asset, such as `assets/foundations_examples.md`, with two annotated examples:

- Restrained product dashboard: teal brand hue, dense Product register, dark mode, data-viz layer.
- Brand landing surface: more generous Brand register, committed palette, larger type scale, lighter data needs.

Each example should state why it is not a reusable preset and should mark values as illustrative. The point is output quality calibration, not a pick-a-style menu.

Rationale: prior research explicitly rejected bulk corpus import and style-preset expansion as the wrong leverage. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:16-18], [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:158-176]

### P2-3: Convert Manual Scenarios Into A Benchmark Fixture Matrix

Problem: the manual playbook is well structured, but current verification checks packaging and scenario existence more than executed behavior. [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md:11-38], [SOURCE: file:.opencode/skills/sk-design/design-foundations/README.md:124-130]

Recommendation: add `manual_testing_playbook/results.md` or `manual_testing_playbook/routing-fixtures.md` with:

- Scenario ID.
- Exact prompt.
- Expected parent mode: `foundations`.
- Expected internal intent: COLOR, TYPE, LAYOUT, ADAPTATION, DATA_VIZ, or TOKENS.
- Expected resources.
- Last verdict: PASS, PARTIAL, FAIL, or SKIP.
- Benchmark inclusion: yes/no and benchmark run ID/path.

Rationale: each scenario already has `expected_intent` and `expected_resources` metadata. That should feed the Mode A routing benchmark and make future score changes explainable. [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/01--color/001-oklch-palette-and-dark-mode.md:10-14], [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/04--data-viz/001-chart-encoding-and-color.md:10-14]

## 5. Reference-Specific Notes

Color is already strong. OKLCH covers contrast repair and gamut. Palette/theming covers semantic token layers, canonical roles, dark mode, dosage, and verification. Do not add another color-basics file. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:58-70], [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:50-113]

Type is concise but adequate. It covers display, heading, body, caption, utility, and data roles, readable measure, localization expansion, and verification. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/type/typography_system.md:35-95]

Layout is adequate for static systems. It covers spacing scale, hierarchy, grid/flex choice, container queries, responsive adaptation, input method, safe areas, and verification. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:35-140]

Adaptation and data-viz are now present. Keep them as references and route to them better instead of re-authoring them. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md:20-130], [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/data_viz.md:20-134]

## 6. Tooling And UX Improvements

- Keep foundations as read-guidance oriented. Its allowed tools are Read, Grep, Glob, and Task, so do not add runtime Bash or Write requirements to the skill surface. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:1-5]
- If automation is desired, keep it outside the skill runtime as benchmark or package validation, not as foundations execution behavior.
- Prefer a small handoff card over a large new workflow. The skill already has the theory; operators need a shorter path from brief to implementation-ready output.

## 7. Do-Not List

1. Do not add another OKLCH, contrast, or dark-mode basics guide. The current color references already cover those topics. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:58-70]
2. Do not split foundations into color/type/layout child skills in this pass. Prior research keeps foundations as the static-system child, and 009 explicitly lists splitting foundations as a do-not. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/research.md:84-88], [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:82]
3. Do not bulk-import the external corpus. Prior research says the leverage is operational references, cards, and the register, not volume. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:16-18]
4. Do not make worked examples into aesthetic presets or default recipes. They should teach output shape, not replace role-first design decisions.
5. Do not route pure implementation to foundations once static decisions are complete. The skill says implementation-only work hands off to `sk-code`. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:39-40]
6. Do not create a separate `focus` color role. Foundations states focus is an accent state, not a separate role. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:255-257], [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:60-63]
7. Do not hide core functionality on mobile or rely on hover for touch. This is already a hard foundations rule. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:270-272], [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md:109-117]
8. Do not use the absent local benchmark or external corpus paths as cited evidence. Treat them as missing inputs unless supplied.

## 8. Suggested Implementation Sequence

1. Patch `mode-registry.json` aliases for foundations and rerun the routing benchmark.
2. Patch `design-foundations/SKILL.md` `RESOURCE_MAP["TOKENS"]` and the surrounding prose so token work loads cross-axis resources.
3. Add or extend an asset for foundations intake and handoff.
4. Add annotated examples only after the handoff schema is settled.
5. Add manual scenario results/fixture matrix and attach it to the next routing-benchmark run.

## 9. Convergence Report

- Stop reason: converged.
- Total iterations: 6.
- Questions answered: 6 / 6.
- Remaining questions: 0.
- newInfoRatio trend: `[1.00, 0.78, 0.58, 0.32, 0.16, 0.04]`.
- Last 3 rolling average: 0.173.
- Composite stop score: 0.7.
- Legal-stop gates: pass.
- Graph gates: not applicable.
- Memory save: skipped because the user constrained writes to this artifact directory only.
- Spec writeback: skipped because the user constrained writes to this artifact directory only.

## 10. References

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/README.md`
- `.opencode/skills/sk-design/design-foundations/references/corpus_map.md`
- `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md`
- `.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md`
- `.opencode/skills/sk-design/design-foundations/references/type/typography_system.md`
- `.opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md`
- `.opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md`
- `.opencode/skills/sk-design/design-foundations/references/data_viz.md`
- `.opencode/skills/sk-design/design-foundations/assets/token_starter.md`
- `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/`
- `.opencode/skills/sk-design/shared/register.md`
- `.opencode/skills/sk-design/shared/design_token_vocabulary.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit/implementation-summary.md`
