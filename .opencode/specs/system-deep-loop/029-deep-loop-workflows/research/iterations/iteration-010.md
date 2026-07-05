# Deep-Research Iteration 010: Governance consolidation

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

Low-blast, read-only research. I’ll first surface existing spec memory and skill routing, then read the provided context report before inspecting the five skill governance trees.
SKILL ROUTING: prompt-specific advisor returned no skill above the 0.8 invocation threshold; I’m proceeding with a general read-only architecture review. Spec memory trigger lookup timed out, so I’ll rely on the explicit context report and direct file evidence.
The context report confirms this angle is explicitly open: governance roots exist in all five workflow skills, runtime ownership was unconfirmed, and the known hazard set is ID collisions, count guards, source-path rewrites, casing, and sandbox duplication. Next I’m checking the actual governance trees and runtime convention.
The runtime does have its own lowercase `feature_catalog/feature_catalog.md` and `manual_testing_playbook/manual_testing_playbook.md`, with `DLR-` IDs and category folders. That convention is backend-specific and should be kept as the peer precedent, not merged into the workflow tree.
The root indexes show the key difference: only `deep-improvement` has a literal hard count `COVERED_FEATURES == TOTAL_FEATURES == 48`; `deep-ai-council` has a machine-style equality check without a numeric literal. Context/review use prose coverage rules, research has stale prose claiming no catalog despite one existing.
The three `setup-cp-sandbox.sh` files share the same argument parsing, path guard, and copy helpers, but their payloads differ by mode. That supports extracting one shared setup helper while keeping mode-specific required paths and fixture payloads as data.
There is one automated test explicitly pinned to the council playbook root path. That means the migration must either move/update that test or add an equivalent merged-root anchor check; otherwise the old `deep-ai-council/manual_testing_playbook` path remains a stale enforced surface.
The reusable playbook runner is scoped to `system-spec-kit`, not the five deep-loop skills. The only confirmed machine-enforced governance check in this slice is the council playbook anchor-integrity test pinned to `.opencode/skills/deep-ai-council/manual_testing_playbook`; the `COVERED_FEATURES == TOTAL_FEATURES` strings are prose contract literals unless another angle finds a skill-specific validator.
A broad governance scan found more old-root references than the context report’s scenario-level estimate: 277 markdown files in the five governance packages contain old `.opencode/skills/deep-*` path roots, with 1,109 total old-root hits. This is a mechanical rewrite surface broader than just the per-scenario count.
One additional drift surfaced: `deep-improvement` has 49 per-scenario playbook markdown files on disk, while its root release rule hardcodes 48. The extra file is `manual_testing_playbook/11--non-dev-ai-system/synthetic-deficit-and-gauntlet.md`, and the root index does not summarize that category after the skill-benchmark section.
Runtime also shows a count drift in its own playbook: overview says 29 scenarios, but release readiness says 17. I would inherit its lowercase root/index convention, not its count prose.
**Recommendation**
Use **one unified governance tree** in `deep-loop-workflows`, but make it **mode-partitioned**, not category-flattened.

Target shape:

```text
.opencode/skills/deep-loop-workflows/feature_catalog/feature_catalog.md
.opencode/skills/deep-loop-workflows/feature_catalog/modes/{context,research,review,improvement,council}/...
.opencode/skills/deep-loop-workflows/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-loop-workflows/manual_testing_playbook/modes/{context,research,review,improvement,council}/...
```

Keep each mode’s existing category subtree and local IDs. Do **not** renumber `CP-*` to `CTX-/RES-/REV-/IMP-/COU-*` in this migration. Resolve collisions by qualifying IDs at the merged-root level, e.g. `research/CP-046`, `review/CP-052`, `improvement/CP-032`, while preserving the local files and cross-refs.

**Why**
The five sources do not share a category model:

- `deep-context` is sweep/frontier/agreement/convergence/report/runtime-robustness oriented, with 25 scenarios across 7 categories: `.opencode/skills/deep-context/manual_testing_playbook/manual_testing_playbook.md:14-29`.
- `deep-research` is lifecycle/state/convergence/output oriented, with 44 scenarios and known stale catalog prose: `.opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md:27-30`, `.opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md:680-682`.
- `deep-review` is lifecycle/state/dimensions/severity oriented, with 49 scenarios: `.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md:28-30`.
- `deep-improvement` is four-lane, with Lane A/B/C/D categories: `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:16-35`.
- `deep-ai-council` has its own council taxonomy and `DAC-*` IDs: `.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md:12-28`.

A flat merged category list would be artificial and would violate the “preserve per-mode behavior” constraint. Five separate governance roots would preserve behavior but would leave the new skill without a normal single `feature_catalog/` and `manual_testing_playbook/` surface.

**Rejected Options**
- Reject **five separate roots** because `deep-loop-workflows` is one skill, advisor `skill_id` is folder-bound, and the existing skill convention is one root catalog/playbook per skill. Runtime already follows that convention with lowercase `feature_catalog/feature_catalog.md` and `manual_testing_playbook/manual_testing_playbook.md`: `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md:16-30`, `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md:14-30`.
- Reject **flat unified categories** because lifecycle/sweep/lane/council taxonomies are incompatible.
- Reject **global renumbering to CTX-/RES-/REV-/IMP-/COU-** for this migration because bidirectional catalog/playbook links make it high-churn and unnecessary for byte-identical behavior. Mode-scoped subtrees solve `CP-*` collisions without touching every scenario ID.

**Concrete Changes**
- Move governance docs into `.opencode/skills/deep-loop-workflows/feature_catalog/modes/context/` from `.opencode/skills/deep-context/feature_catalog/`.
- Move governance docs into `.opencode/skills/deep-loop-workflows/feature_catalog/modes/research/` from `.opencode/skills/deep-research/feature_catalog/`.
- Move governance docs into `.opencode/skills/deep-loop-workflows/feature_catalog/modes/review/` from `.opencode/skills/deep-review/feature_catalog/`.
- Move governance docs into `.opencode/skills/deep-loop-workflows/feature_catalog/modes/improvement/` from `.opencode/skills/deep-improvement/feature_catalog/`.
- Move governance docs into `.opencode/skills/deep-loop-workflows/feature_catalog/modes/council/` from `.opencode/skills/deep-ai-council/feature_catalog/`.
- Do the parallel move for `manual_testing_playbook/modes/{context,research,review,improvement,council}/`.
- Normalize council’s uppercase root `FEATURE_CATALOG.md` to lowercase `feature_catalog.md`; current uppercase references appear in `.opencode/skills/deep-ai-council/README.md:210` and all council per-feature back-links, e.g. `.opencode/skills/deep-ai-council/feature_catalog/03--artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md:56`.
- Update the council anchor-integrity test currently pinned to the old root: `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:10`, `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:83-124`.

**Counts And Drift**
- Confirmed runtime already has governance roots. It should be treated as the peer convention source, not merged into workflows.
- Runtime’s own playbook has count drift: overview says 29 scenarios, release readiness says 17: `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md:28-30`, `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md:98`.
- `deep-improvement` root hardcodes `COVERED_FEATURES == TOTAL_FEATURES == 48`: `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:104-112`.
- Disk has an additional Lane D scenario file, `PR-001`: `.opencode/skills/deep-improvement/manual_testing_playbook/11--non-dev-ai-system/synthetic-deficit-and-gauntlet.md:1-6`. Treat this as real and update the merged count model to include it unless another decision explicitly demotes it.
- `deep-ai-council` has the equality-style prose without a numeric literal: `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:121-128`.
- `deep-context` and `deep-review` use prose coverage rules, not numeric literals: `.opencode/skills/deep-context/manual_testing_playbook/manual_testing_playbook.md:108-115`, `.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md:102-110`.
- I found no general machine validator enforcing `COVERED_FEATURES == TOTAL_FEATURES` for the five deep-loop skills. The confirmed machine-enforced item is the council playbook anchor-integrity test path.

**Path Rewrite Plan**
- A broad scan found 277 governance markdown files containing old `.opencode/skills/deep-*` roots and 1,109 old-root hits across the five governance packages.
- Rewrite workflow-owned source paths to `.opencode/skills/deep-loop-workflows/...`.
- Preserve `.opencode/skills/deep-loop-runtime/...` paths because the runtime boundary is frozen.
- Preserve `.opencode/agents/<mode>.md`, `.claude/agents/<mode>.md`, and `.codex/agents/<mode>.toml` until the agent-surface angle decides whether agent names change.
- Exclude `changelog/` and archives from mechanical rewrites unless an explicit migration policy says otherwise.
- Rewrite absolute setup-script references in CP scenario files after the setup helper location is chosen; current setup-script references are mode-local, e.g. `.opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md:574-576`, `.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md:671-673`.

**Setup Sandbox Dedupe**
The three `setup-cp-sandbox.sh` files share the same shell skeleton but differ in payload:

- Shared safety/parser/helper body exists in research: `.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh:8-85`.
- Review adds `sk-code-review` and target fixture creation: `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh:87-124`.
- Improvement uses fixture roots and a different sandbox payload: `.opencode/skills/deep-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/setup-cp-sandbox.sh:6-7`, `.opencode/skills/deep-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/setup-cp-sandbox.sh:88-106`.

Recommendation: extract one shared helper under the merged workflow playbook support area, with mode-specific manifests for required paths and fixture copies. Do not force one universal shell body with mode branches embedded everywhere.

**Risks**
- Biggest risk is accidental behavior flattening through “helpful” global IDs or global categories.
- Second risk is stale path rewriting into runtime-owned paths, especially council graph/runtime references.
- Third risk is count drift: `deep-improvement` is already inconsistent, and runtime has count drift too.
- Fourth risk is the council anchor-integrity test silently staying pinned to the deleted old path.
- Fifth risk is breaking local relative links when adding `modes/<mode>/`; migration should include link-checking for every moved root and per-feature file.

**Dependencies**
- Q-ARCH must decide final internal mode layout, but this recommendation assumes `modes/<mode>/`.
- Q-AGENT must decide whether native agent names stay stable.
- Q-CMD must decide whether `/deep:*` commands stay stable.
- Q-ADVISOR must decide alias handling for old skill names pointing at one `deep-loop-workflows` skill.
- Q-BACKEND must decide exact ownership of moved scripts/assets/references so source paths can be rewritten correctly.
