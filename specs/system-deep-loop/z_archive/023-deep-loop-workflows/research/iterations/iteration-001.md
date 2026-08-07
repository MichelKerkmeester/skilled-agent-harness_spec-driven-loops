# Deep-Research Iteration 001: Skill structure and internal layout

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

Memory trigger lookup is unavailable (`Not connected`). Skill advisor is live; it surfaced `sk-code` and deep-loop research skills, but this is a read-only architecture pass, so I’ll use that only as routing context and inspect the required source files directly before recommending.
Low-blast, read-only architecture decision: I’m going to anchor on the provided context report first, then verify only the specific router/layout evidence needed to choose between hub/reference packets and single SKILL.md.
The baseline confirms the key scoping fact: this is not a backend merge. The workflow skill must preserve five distinct mode contracts while leaving `deep-loop-runtime` and every `.opencode/skills/deep-loop-runtime/...` command path untouched.
The inspected routers all use the same pattern: front SKILL content chooses intent and then loads mode-owned `references/` and `assets/` resources; they do not require flattening resources into a shared taxonomy. Next I’m checking the remaining mode surfaces and top-level subtree shapes so the layout recommendation is concrete.
The remaining mode files confirm two important constraints: each mode already has a distinct router vocabulary and resource topology, and the command YAML embeds old skill roots in multiple nested fields (`skill_md`, references, templates, script invocations), so path choice directly affects migration safety.
I’m checking first-level `references/`, `assets/`, and `scripts/` directories for each mode now; that determines whether a `modes/<mode>/` reorg would be a cosmetic cleanup or a behavior-risking rewrite.
The subtree check favors preserving mode-local shapes: context/research/review share similar `references/{protocol,state,convergence}` families, council uses different `integration/patterns/scoring/structure`, and improvement already has lane subtrees. A forced `modes/<mode>/` cleanup would rewrite those distinct schemas rather than preserve them.
I’m doing one targeted grep pass for live path references, not to re-count the whole baseline, but to confirm the concrete edit classes the recommendation depends on.
The grep pass confirms the migration class: command YAMLs have both shallow `skill`/`skill_md` keys and deep executable/template paths, while feature catalogs embed old roots in SOURCE FILE tables. That makes single-segment path rewrites materially safer than a directory taxonomy rewrite.
The decision is now clear: recommend a thin root hub plus preserved per-mode packets, not a giant merged SKILL.md and not a `modes/` rewrite. I’m preparing the final with cited evidence and the required minified JSON block.
**Recommendation**

Use a thin, authoritative root `.opencode/skills/deep-loop-workflows/SKILL.md` with a command-first, mode-first smart router, and preserve each old workflow skill as a mode packet directly under `.opencode/skills/deep-loop-workflows/<mode>/`.

Do not build one giant multi-mode `SKILL.md`. Do not reorganize into `modes/<mode>/`.

Target layout:

```text
.opencode/skills/deep-loop-workflows/
  SKILL.md
  README.md
  graph-metadata.json
  context/
    SKILL.md
    README.md
    references/
    assets/
    scripts/
    feature_catalog/
    manual_testing_playbook/
    changelog/
  research/
    SKILL.md
    README.md
    references/
    assets/
    scripts/
    feature_catalog/
    manual_testing_playbook/
    changelog/
  review/
    SKILL.md
    README.md
    references/
    assets/
    scripts/
    feature_catalog/
    manual_testing_playbook/
    changelog/
  ai-council/
    SKILL.md
    README.md
    references/
    assets/
    scripts/
    feature_catalog/
    manual_testing_playbook/
    changelog/
  improvement/
    SKILL.md
    README.md
    references/
    assets/
    scripts/
    feature_catalog/
    manual_testing_playbook/
    changelog/
```

The actual advisor-visible skill is only `deep-loop-workflows`; nested mode packets are reference packets, not skill graph nodes. The old per-skill `graph-metadata.json` files should be merged into the new root metadata, not left as live nested metadata with stale `skill_id` values.

**Why This Is The Right Choice**

The verified baseline says the current system is already a two-layer architecture: `deep-loop-runtime` is the backend, and the five merge candidates are workflow/persona surfaces (`context-report.md:5-28`). It also says the runtime boundary is frozen and already owns shared libs, coverage graph, council primitives, fanout scripts, databases, and tests (`context-report.md:7-16`, `.opencode/skills/deep-loop-runtime/SKILL.md:10-16`, `.opencode/skills/deep-loop-runtime/SKILL.md:111-172`).

The hard non-flattening requirement is real. The baseline lists five different convergence and artifact contracts: context agreement/reuse gates, research `newInfoRatio` plus graph authorization, review P0/P1/P2 verdict locks, council two-of-three council graph semantics, and improvement plateau/trajectory scoring outside the runtime loop type (`context-report.md:120-138`). A monolithic `SKILL.md` would pressure these into one shared lifecycle vocabulary.

`deep-improvement` proves a multi-lane router can work, but only within a family that already shares candidate, dispatcher, and scorer seams (`.opencode/skills/deep-improvement/SKILL.md:30-42`). Its router already has generic `benchmark` signals that fan into model, skill, and non-dev packaging lanes (`.opencode/skills/deep-improvement/SKILL.md:128-159`). Expanding that pattern across research/review/context/council would multiply collisions without adding behavior safety.

The existing routers are already per-mode and structurally similar enough to delegate, not merge. Deep-context routes codebase context resources under `references/{guides,protocol,convergence,state}` and context assets (`.opencode/skills/deep-context/SKILL.md:43-83`, `.opencode/skills/deep-context/SKILL.md:104-122`). Deep-research routes research lifecycle, spec anchoring, state, convergence, and runtime parity resources (`.opencode/skills/deep-research/SKILL.md:75-144`). Deep-review routes review setup, iteration, convergence, report, and phase-specific resources (`.opencode/skills/deep-review/SKILL.md:81-170`). Council routes planning, persistence, recovery, convergence, scoring, depth dispatch, failure handling, and graph support (`.opencode/skills/deep-ai-council/SKILL.md:87-169`).

The command YAMLs make path stability decisive. The review confirm YAML has shallow `skill`/`skill_md` keys plus nested mode references and templates (`.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:55-64`), runtime script calls that must remain under `deep-loop-runtime` (`.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:148-152`), and artifact root resolution outside the workflow skill (`.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:127`). The grep pass confirmed the same pattern across all deep command YAMLs.

**Router Design**

The root hub should do only first-hop routing and invariant enforcement.

Use this precedence:

| Priority | Signal | Result |
|---|---|---|
| 1 | Exact `/deep:*` command name | Select that mode immediately |
| 2 | Old skill id or agent name, such as `deep-research`, `deep-review`, `deep-context`, `deep-ai-council`, `deep-improvement`, `ai-council` | Select mapped mode |
| 3 | Artifact vocabulary, such as `context-report`, `research/research.md`, `review-report`, `ai-council/**`, `improvement-journal` | Select mapped mode |
| 4 | Strong domain terms, such as `newInfoRatio`, `P0/P1/P2`, `reuse catalog`, `two-of-three`, `guarded promotion` | Select mapped mode |
| 5 | Weak shared terms, such as `convergence`, `benchmark`, `audit`, `review`, `state` | Require mode qualifier or return disambiguation |

Do not union the five routers as raw `INTENT_SIGNALS`. Namespace them:

```text
context.LOOP_SETUP
context.CONVERGENCE
research.LOOP_SETUP
research.SPEC_ANCHORING
review.REVIEW_CONVERGENCE
council.CONVERGENCE_CHECK
improvement.MODEL_BENCHMARK
improvement.SKILL_BENCHMARK
```

Resolve `benchmark` this way:

| Prompt Signal | Mode |
|---|---|
| `benchmark a model`, `prompt framework`, `model-benchmark` | `improvement`, lane `model-benchmark` |
| `benchmark a skill`, `skill routing`, `unprompted discovery`, `skill-benchmark` | `improvement`, lane `skill-benchmark` |
| `agent candidate`, `promotion`, `rollback`, `score candidate` | `improvement`, lane `agent-improvement` |
| Bare `benchmark` | Disambiguate instead of loading three lanes |

The root `allowed-tools` may need to be the union, but the mode router must enforce per-mode permission profiles. Research has `Task`, `WebFetch`, and memory tools (`.opencode/skills/deep-research/SKILL.md:4`). Review has `Task`, memory, and code graph but no `WebFetch` (`.opencode/skills/deep-review/SKILL.md:4`). Context/council/improvement have different surfaces. The root hub must say that mode-specific tool constraints override the root union.

**Internal Layout Decision**

Preserve old subtree shapes under direct mode directories:

| Old Root | New Mode Packet |
|---|---|
| `.opencode/skills/deep-context/` | `.opencode/skills/deep-loop-workflows/context/` |
| `.opencode/skills/deep-research/` | `.opencode/skills/deep-loop-workflows/research/` |
| `.opencode/skills/deep-review/` | `.opencode/skills/deep-loop-workflows/review/` |
| `.opencode/skills/deep-ai-council/` | `.opencode/skills/deep-loop-workflows/ai-council/` |
| `.opencode/skills/deep-improvement/` | `.opencode/skills/deep-loop-workflows/improvement/` |

This keeps the existing `references/`, `assets/`, `scripts/`, `feature_catalog/`, and `manual_testing_playbook/` shapes intact. Directory listings confirmed the mode trees are not uniform: context/research/review have loop-style reference families, council has `integration/patterns/scoring/structure`, and improvement has lane subtrees for `agent_improvement`, `model_benchmark`, and `skill_benchmark`.

This also keeps path edits mechanical:

| Current Path | Recommended Path |
|---|---|
| `.opencode/skills/deep-review/references/convergence/convergence.md` | `.opencode/skills/deep-loop-workflows/review/references/convergence/convergence.md` |
| `.opencode/skills/deep-research/assets/deep_research_config.json` | `.opencode/skills/deep-loop-workflows/research/assets/deep_research_config.json` |
| `.opencode/skills/deep-context/scripts/reduce-state.cjs` | `.opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` |
| `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs` | `.opencode/skills/deep-loop-workflows/ai-council/scripts/persist-artifacts.cjs` |
| `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs` | `.opencode/skills/deep-loop-workflows/improvement/scripts/shared/loop-host.cjs` |

For command YAMLs, set `skill: deep-loop-workflows` and `skill_md: .opencode/skills/deep-loop-workflows/SKILL.md`, but rewrite nested `references`, `templates`, and script paths to the mode packet paths. Keep every `.opencode/skills/deep-loop-runtime/...` path unchanged.

**Rejected Alternatives**

Rejected: one giant multi-mode `SKILL.md`.

Reason: it would combine at least five routers plus three improvement lanes into one high-collision text surface. The current `deep-improvement` router works because its three lanes share one improvement host and scoring family (`.opencode/skills/deep-improvement/SKILL.md:298-306`). The merged skill would span inward code context, outward research, code review, planning council, and mutation loops, which the baseline explicitly marks as non-flattenable (`context-report.md:120-138`).

Rejected: `deep-loop-workflows/modes/<mode>/`.

Reason: it adds no behavior preservation value and turns known mechanical rewrites into full path rewrites. The baseline already identifies roughly 270 command YAML path occurrences and about 198 SOURCE-FILES path tables (`context-report.md:68-75`, `context-report.md:107-116`). The grep pass confirmed SOURCE FILE tables embed old rooted paths across feature catalogs. Adding `modes/` is pure cosmetic churn against a byte-identical artifact acceptance bar.

Rejected: leaving old skill roots as wrapper aliases.

Reason: advisor `skill_id` is hard-bound to folder name, and the baseline says migration is delete five nodes and create one `deep-loop-workflows` node (`context-report.md:100-105`). Wrapper skill folders would preserve the exact ambiguity this migration is trying to remove.

**Concrete Impacted Paths**

The root skill files change or are created at `.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/README.md`, and `.opencode/skills/deep-loop-workflows/graph-metadata.json`.

The five old skill roots move into mode packets: `.opencode/skills/deep-context/**`, `.opencode/skills/deep-research/**`, `.opencode/skills/deep-review/**`, `.opencode/skills/deep-ai-council/**`, and `.opencode/skills/deep-improvement/**`.

The command YAMLs need mode-path rewrites under `.opencode/commands/deep/assets/deep_start-context-loop_{auto,confirm}.yaml`, `.opencode/commands/deep/assets/deep_start-research-loop_{auto,confirm}.yaml`, `.opencode/commands/deep/assets/deep_start-review-loop_{auto,confirm}.yaml`, `.opencode/commands/deep/assets/deep_ask-ai-council_{auto,confirm}.yaml`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_{auto,confirm}.yaml`, `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_{auto,confirm}.yaml`, and `.opencode/commands/deep/assets/deep_start-skill-benchmark-loop_{auto,confirm}.yaml`.

The command markdown/presentation layer needs the existing limited skill-id edits identified by the baseline: `.opencode/commands/deep/start-research-loop.md` and `.opencode/commands/deep/start-skill-benchmark-loop.md`, plus the presentation `.txt` assets (`context-report.md:68-75`).

Feature catalogs and manual testing playbooks under each moved mode packet need SOURCE-FILES root rewrites, but should keep their mode-local category structures. The baseline says there is no common category schema and recommends per-mode top-level sections rather than a unified category list (`context-report.md:107-116`).

The native agents should not be renamed by this decision. Runtime docs confirm the agents are real mirrors across `.opencode/agents`, `.claude/agents`, and `.codex/agents`, while command/skill dirs are shared/symlinked and use canonical `.opencode` paths (`.opencode/skills/deep-loop-runtime/SKILL.md:253-261`). Agent consolidation is a separate Q-AGENT decision.

**Risks**

The main routing risk is precision loss after advisor metadata collapses five nodes into one. Mitigation: keep old skill ids and command names as aliases to one root skill, but make mode selection internal and test prompt-to-mode routing.

The main permission risk is that a root skill frontmatter union can accidentally imply `WebFetch` or mutation rights for modes that never had them. Mitigation: root hub must declare per-mode permission profiles and the command YAML/agent allowlists must remain mode-specific.

The main migration risk is stale identity metadata. Old `graph-metadata.json` files contain old `skill_id` values such as `deep-improvement`, `deep-context`, `deep-research`, `deep-review`, and `deep-ai-council` (`.opencode/skills/deep-improvement/graph-metadata.json:1-18`, `.opencode/skills/deep-context/graph-metadata.json:1-33`, `.opencode/skills/deep-research/graph-metadata.json:1-33`, `.opencode/skills/deep-review/graph-metadata.json:1-34`, `.opencode/skills/deep-ai-council/graph-metadata.json:1-29`). These must be merged into the single root metadata instead of preserved as live metadata.

The main path risk is missing executable script references in command YAMLs. Review confirm alone has nested mode paths and runtime invocations (`.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:55-64`, `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:148-152`). Similar patterns exist in the other YAMLs.

**Depends On**

This decision depends on Q-AGENT for whether the five native agent names stay stable. My recommendation assumes they stay stable.

This decision depends on Q-CMD for whether the seven `/deep:*` commands stay stable. My recommendation assumes they stay stable and only repoint their skill references.

This decision depends on Q-ADVISOR for alias and routing-fixture updates. The root `deep-loop-workflows` metadata must preserve old entry points as aliases without resurrecting old skill ids.

This decision depends on Q-GOV for feature catalog/playbook migration. My recommendation assumes per-mode catalog/playbook subtrees stay separate.

This decision depends on Q-BACKEND for helper promotions such as `runtime-capabilities.cjs`, `loop-lock.cjs`, and shared reducer plumbing. That does not change the layout recommendation; it only decides whether a few scripts move to `deep-loop-runtime`.

**Open Questions**

I am uncertain whether checked-in `node_modules/` under `deep-ai-council` and `deep-improvement` are intended source artifacts or generated caches. `git ls-files` on those paths would resolve whether they move with the mode packets or are regenerated/excluded.

I am uncertain whether any validator treats nested `SKILL.md` filenames under a skill as discoverable skills. The baseline says advisor skill ids are bound to direct skill folder metadata, but confirming the skill graph scan glob would decide whether nested mode packet entrypoints can remain named `SKILL.md` or should be renamed to `mode.md`.
