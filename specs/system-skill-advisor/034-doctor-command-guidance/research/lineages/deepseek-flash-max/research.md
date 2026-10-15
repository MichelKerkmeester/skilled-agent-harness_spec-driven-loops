---
title: "Advisor guidance to doctor commands — detached research synthesis"
trigger_phrases: []
---
# Advisor guidance to doctor commands — detached research synthesis

**Lineage:** `deepseek-flash-max`
**Session:** `fanout-deepseek-flash-max-1792072037811-has9cy`
**Loop:** `research`, 10 iterations, `convergence` policy stopped at the iteration cap
**Artifact root:** `specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max`

## 1. Executive Summary

Plain-word setup and health prompts have no owner in the skill advisor today. Of twelve measured prompts, ten return zero recommendations - including `help me set up skilled`, `is my repo set up right` and `why is this rule not enforced`; only `check my git hooks` routes (to sk-git) and `help me get started with this repo` routes (to sk-doc on a weak lexical score). The hook then renders `Advisor: no skill matched.` with no doctor guidance at all. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487]

The doctor command family already carries exactly the routing vocabulary the user types - "check my git hooks setup", "is my sk-git setup working", "pre-commit gate keeps blocking", "verify my sk-code surface" - but `_routes.yaml`'s own header records that neither advisor harvester reads it: both walk `.skilled/skills/*/{references,assets}/*.md` frontmatter only, so a YAML under `.skilled/commands/doctor/` is out of scope by file type and root, and the field is "inert today". [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:991]

Commands do have a supported advisor surface: `kind: 'command'` bridge projections. Five are TypeScript-active (spec-kit, memory save x2, create agent, create testing playbook); doctor commands are not among them and `_routes.yaml` has no route-level bridge. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10]

The recommended path: (1) capture a doctor routing-accuracy slice on the existing corpus first, (2) ship one single-route `/doctor:setup` onboarding umbrella composed from existing read-only batteries, (3) admit doctor routes as generated per-route command bridges from `_routes.yaml`, staged empty-phrases-first, with phrase ownership instead of duplicate phrases, (4) add one bounded fallback sentence, (5) refresh the stale docs. All four rejected-idea families and their reasons are listed below.

## 2. Scope and Boundary

This detached lineage researched advisor-to-doctor routing only. It wrote solely under its bound artifact root and did not modify the advisor, the doctor commands, `_routes.yaml`, hooks, tests, spec docs, continuity state or git state. The `resolveArtifactRoot` node was skipped because the fan-out override bound `artifact_dir` directly. Findings report and design; implementation is a separate follow-up.

## 3. Research Questions

1. How does the skill advisor resolve a prompt to a recommendation today, and which files own scoring, graph, and trigger data?
2. What does the advisor return today for the required plain-word setup and health prompts, measured live?
3. How is the doctor command family structured, and what `trigger_phrases` does `.skilled/commands/doctor/_routes.yaml` declare per route?
4. How are commands surfaced to the advisor relative to skills, and do doctor commands participate in that surface at all?
5. Should `_routes.yaml` trigger phrases feed the advisor, and through which mechanism would that work?
6. Should there be a dedicated onboarding or 'set up skilled' entry point, and how should it relate to the `/doctor:*` family?
7. How can doctor routing avoid stealing prompts that legitimately belong to skills?
8. How should routing accuracy be tested, and which existing test seams should the harness reuse?
9. Which candidate ideas should be rejected, and for which measured reason?
10. What is the ranked recommendation set and the implementation phase plan?

All ten are answered; evidence for each appears in the sections below and in the iteration files.

## 4. Method and Source Quality

Ten iterations, each with a single focus, externalized to `iterations/iteration-NNN.md` plus `deltas/iter-NNN.jsonl`, with one canonical record per iteration through the append gateway. Iterations 1-5 and 8 read source seams (shim, skill contract, hook reference, scorer lanes, projection, bridge generator, harvesters, renderer, accuracy corpus). Iterations 2 and 6 measured the live advisor: 12 onboarding/health prompts, 10 skill-shaped controls, 14 candidate doctor phrases - 36 envelopes total, all exit 0 against a live graph (trustState generation 1033, confidence threshold 0.8, uncertainty 0.35). Iterations 5, 7, 9 and 10 are design and rejection analysis over that evidence.

Source quality: repository code and data are first-party evidence cited as `path:line`; measured envelopes are first-party live outputs stored in `events/`; no web sources were needed. Where a claim rests on this lineage's own measurement, the raw envelope is named.

## 5. Source Inventory

- `.skilled/bin/skill-advisor.cjs` - CLI shim, freshness gate, socket setup.
- `.skilled/skills/system-skill-advisor/SKILL.md`, `ARCHITECTURE.md`, `graph-metadata.json` - routing contract and package topology.
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` - prompt-time brief contract.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/` - lanes (`explicit.ts`, `derived.ts`), `projection.ts`, `fusion.ts`, `text.ts`, `weights-config.ts`.
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` - brief and fallback rendering.
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/` - `derive-command-bridges.cjs`, `allow-list.json`, `scoring-compatibility.json`, `command-bridges.generated.json`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` - `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`, `scorer-eval-baseline.json`, capture scripts.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `runtime/lib/skill-graph/doc-frontmatter.ts`, `skill-graph-db.ts` - harvester scope.
- `.skilled/commands/doctor/_routes.yaml`, `*.md` routers, `assets/*.yaml`, `scripts/route-validate.sh`.
- `.skilled/commands/README.txt` - command catalog.
- `specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-*.json`, `measure-iter6-*.json` - measured envelopes.

## 6. How the Advisor Routes Today

The advisor is a resident daemon behind one CLI front door. `.skilled/bin/skill-advisor.cjs` resolves `runtime/dist/runtime/skill-advisor-cli.js`, refuses a stale or missing dist with exit 69 (75 warm-only), and spawns the compiled CLI with the caller's arguments; nine stable command ids are callable, with exit taxonomy 0/1/64/69/75 and a degraded local Python fallback when the daemon is unreachable. [SOURCE: .skilled/bin/skill-advisor.cjs:22-23] [SOURCE: .skilled/bin/skill-advisor.cjs:70-83] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:318-336]

Skill routing vocabulary lives in each skill's `graph-metadata.json` (`intent_signals` plus `derived.trigger_phrases`); `SKILL.md` frontmatter `trigger_phrases` are not read by runtime routing, and reference/asset doc frontmatter feeds routing only when `SPECKIT_ADVISOR_DOC_TRIGGERS=true`. Doc triggers land in the `skill_docs` table and reach scoring through the derived lane with a bounded top-3-doc, 0.45-capped contribution. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:338] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:36] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:855-945]

Scoring fuses five lanes (explicit_author, lexical, graph_causal, derived_generated, semantic_shadow) with per-variant weight multipliers around 0.95-1.04. The explicit-author lane consumes a hand-authored `PHRASE_BOOSTS` table (exact command strings and phrases) and, for every projection entry, each matching `intentSignals`/`keywords` phrase with `phraseSpecificity` weight - one token 0.7, +0.18 per extra token, capped at 1.0. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:169-177] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:358-376] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:71-74]

The prompt-time hook scores each user prompt once and injects an advisory brief (`Advisor: <freshness>; use <label> <confidence>/<uncertainty> pass.`); when nothing clears the gate it renders `Advisor: no skill matched.` plus the directives block. The brief is advisory-only, never blocks the prompt and never persists raw prompt text. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:33-43] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:439-447]

## 7. Command Surfacing and Admission Pipeline

Commands are first-class `kind: 'command'` projections. `projection.ts` defines five hand-authored command bridges plus a generated block, and both the SQLite and filesystem projection loaders append the routing-enabled bridges to the skill list. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1127] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1205]

Admission has exactly two inputs: a per-skill `command-metadata.json` or a hand-maintained `allow-list.json` entry. Only three skills carry metadata (`system-deep-loop`, `sk-design`, `sk-doc`), and the generator reports 19 metadata entries, 8 allow-list entries, 27 bridges, with 5 TypeScript-active and 15 Python-active. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:71-99] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10]

Constraints discovered in the generator: bridge ids are command-derived and must match `^/[a-z][a-z0-9-]*:[a-z0-9-]+$` with explicit uniqueness, so `/doctor:git`'s three targets would collide at `command-doctor-git` under a naive one-bridge-per-route design; allow-list ids are free-form, so distinct per-route ids are the supported workaround. `routingEnabled` is per-platform from `scoring-compatibility.json`, and regeneration writes both TypeScript and Python projections. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:56-60] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-130] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:240-290]

Command recommendations are demoted 0.08 during fusion ordering when the prompt contains no slash - a uniform handicap, not a theft guard. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777]

No doctor command participates in the surface today: `projection.ts` has zero doctor references, `.skilled/commands/doctor/` carries no `command-metadata.json`, and the only doctor mention in the advisor runtime is the comment describing the tune validator's phrase-boost range. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-112]

## 8. Doctor Family Anatomy

`_routes.yaml` is the canonical route manifest for the routed doctor commands: 13 routed targets across `/doctor:speckit` (speckit-retrieval), `/doctor:deep-loop`, six `/doctor:skill-advisor` targets (tune, rebuild, skill-budget, parent-skill, skill-graph-freshness, router-reach), `/doctor:runtime-mirrors`, `/doctor:sk-code` setup, and `/doctor:git` (hooks, standards, setup). Each route carries command, target, yaml, setup_vars, allowed_flags, mutating class, gate3_location, mcp_tools, script_invocations and trigger_phrases. [SOURCE: .skilled/commands/doctor/_routes.yaml:23-33] [SOURCE: .skilled/commands/doctor/_routes.yaml:41-289]

The manifest documents its own advisor status: the trigger phrases are not harvested by either advisor implementation, and the field is "inert today" pending a possible future harvester. `/doctor:env` is a standalone router absent from the manifest, `/doctor:update` is tracked under `standalone`, and `/doctor:mcp` under `mcp_subroutes`, so the manifest is not a complete family inventory. [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21] [SOURCE: .skilled/commands/doctor/env.md:1-40] [SOURCE: .skilled/commands/doctor/_routes.yaml:291-355]

Router conventions: a command owning one route needs no positional target; every multi-route command has a mandatory input gate that refuses inferred targets ("Do not infer it from conversation history, open files, earlier runs or repository state"); `execution_mode` is always INTERACTIVE; bare `/doctor:update` runs the read-only `check` action; bare `/doctor:env` shows a menu. [SOURCE: .skilled/commands/doctor/_routes.yaml:12] [SOURCE: .skilled/commands/doctor/skill-advisor.md:13-19] [SOURCE: .skilled/commands/doctor/git.md:13-18] [SOURCE: .skilled/commands/doctor/update.md:6-13]

Mutation classes matter for design: `/doctor:git hooks` writes git config keys, `/doctor:git standards` writes `.sk-git/`, `/doctor:skill-advisor tune` writes scorer lane files and rebuild writes the skill-graph database; `sk-code setup`, `git setup`, `skill-budget`, `parent-skill`, `skill-graph-freshness` and `router-reach` are read-only. [SOURCE: .skilled/commands/doctor/_routes.yaml:81-194] [SOURCE: .skilled/commands/doctor/_routes.yaml:220-289]

The family already contains an accuracy harness: `router-reach` probes the live advisor for every declared phrase via `ci-router-vocabulary-reach.cjs`. [SOURCE: .skilled/commands/doctor/_routes.yaml:179-194]

## 9. Measured Baseline

Onboarding set (12 prompts, all exit 0, live): ten returned zero recommendations - `help me set up skilled`, `is my repo set up right`, `why is this rule not enforced`, `set up my repo correctly`, `verify my repository health`, `is the skill setup working`, `my hooks are not running`, `check if my environment is configured properly`, `something is wrong with my setup`, `are my rules being enforced`. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json]

Non-empty onboarding outcomes: `check my git hooks` -> sk-git at confidence 0.8316, score 0.579682, dominant lane explicit_author (the `git` token boost, not hooks vocabulary); `help me get started with this repo` -> sk-doc at confidence 0.82, score 0.229089, dominant lane lexical, with a `compiledRoute` defer action. The gate is confidence (0.8), not raw score, so calibration is part of any accuracy work. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-11.json]

Collision set (24 prompts): all ten skill-shaped controls keep their incumbent skills (sk-git x3, sk-doc x2, system-spec-kit, sk-prompt, sk-code, memory:save trio). `run a deep review of this spec` is a pre-existing ambiguity (system-deep-loop 0.8209 vs sk-code 0.8227, both 0.95). Eight candidate doctor phrases already route to their owning skill (four git-family phrases -> sk-git 0.83-0.89; two sk-code surface phrases -> sk-code 0.95; advisor wrong-skill -> system-skill-advisor 0.8843; trigger index drift -> system-spec-kit 0.8862); three are empty (`disable comment hygiene gate`, `runtime mirror drift`, `skill budget audit`); two mis-route (`new skill not appearing in advisor results` -> sk-doc; `Code Mode broken` -> mcp-code-mode + sk-code); one stays borderline (`skill graph freshness` -> system-skill-advisor). [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-07.json]

Reading: the vocabulary gap is an arbitration gap. The manifest's phrases closely paraphrase what users type; the work is deciding which owner wins each phrase and proving the choice, not writing new trigger sentences.

## 10. Feed Mechanism: Options and Verdict

Four mechanisms were weighed:

- Harvester extension to parse `_routes.yaml` - rejected. Both harvesters are hard-scoped to skill roots and `references`/`assets` subdirs; adding a new root, a new file type and YAML parsing in two languages rebuilds the boundary the manifest documents. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:44] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:170]
- Hand-written `PHRASE_BOOSTS` entries - rejected as primary; bypasses the bridge inventory, generated projections, Python parity and the drift guard. Retained only for bounded negative disambiguation inside the tune flow. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-200]
- Allow-list + `scoring-compatibility.json` admission - supported today; free-form allow-list ids give per-route granularity for multi-target commands, and target phrases enter `keywords`/`intentSignals`, which the explicit lane scores by phrase specificity. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-130]
- Generate those inputs from `_routes.yaml` at build time - recommended long-term so the manifest stays canonical; `route-validate.sh` can assert the generated set and the drift guard keeps both projections byte-stable. [SOURCE: .skilled/commands/doctor/_routes.yaml:36-38] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:399-420]

Arbitration rules that follow from the measurements: phrase ownership rather than verbatim duplication; 3+ token diagnostic phrases rather than bare generic tokens; empty phrases first; a post-admission control re-run; zero new ambiguous pairs. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json]

## 11. Recommendations

R1. Build the doctor golden slice first, on the existing routing-accuracy corpus: onboarding (9 measured prompts), diagnostics (14 candidate phrases), control (10 skill-shaped prompts), ambiguity cases with expected winners and margins; capture a baseline with the pinned environment and the bounded-delta gate. This makes every later phase measurable and reuses `capture-scorer-eval-baseline.mjs`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-16] [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:33]

R2. Ship one onboarding umbrella command - a single-route, read-only `/doctor:setup` composed from the existing batteries (`sk-code-setup-check.cjs`, `git-setup-check.cjs`, advisor status probe, runtime-mirror `--check`, trigger-index `--check`) - so the measured empty onboarding phrases have one unambiguous destination. A single-route command needs no positional target under the manifest rule, matching the bare `/doctor:update check` precedent. [SOURCE: .skilled/commands/doctor/_routes.yaml:12] [SOURCE: .skilled/commands/doctor/_routes.yaml:228-247] [SOURCE: .skilled/commands/doctor/update.md:6-13]

R3. Admit doctor routes through the supported bridge pipeline, generated from `_routes.yaml`: per-route allow-list entries with distinct ids (`command-doctor-git-setup`, `command-doctor-skill-advisor-tune`, ...) and target phrases in `scoring-compatibility.json`; regenerate both projections; keep `route-validate.sh` and the drift guard green. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-130] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:1-40]

R4. Stage phrase admission. Wave A: the measured empty phrases with zero theft risk - `disable comment hygiene gate` -> `/doctor:git hooks`, `runtime mirror drift` -> `/doctor:runtime-mirrors`, `skill budget audit` -> `/doctor:skill-advisor skill-budget`. Wave B: contested phrases where the doctor diagnostic is the deliberate winner (git setup family, sk-code surface, advisor wrong-skill, trigger-index drift, mis-routes), admitted one route at a time with the ownership pin. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-05.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-09.json]

R5. Render fully qualified names. Each admitted bridge's rendered `name` must be the runnable `/doctor:<command> <target>` string, because the brief label is what the model and user see and the routers refuse inferred targets. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:439-447] [SOURCE: .skilled/commands/doctor/git.md:13-18]

R6. Add one bounded fallback sentence naming the doctor entry surface when no skill matched, deployed after the umbrella exists; keep the directives and hygiene block intact and the sentence static and short. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487]

R7. Refresh stale documentation in the same change set: the `validation-baselines.md` dated numbers (its snapshot trails the current JSON baseline) and the `_routes.yaml` "Consumed by" comment once a generator consumes it. [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:45-59] [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21]

## Eliminated Alternatives

| Idea | Rejected because |
|---|---|
| Auto-dispatching doctor commands from the advisor | Hook is advisory-only and never replaces explicit loading; doctor routes are INTERACTIVE. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21] [SOURCE: .skilled/commands/doctor/skill-advisor.md:42] |
| Fake skill ids per doctor route | Commands already have `kind: 'command'` projections; fake skills pollute skill lifecycle state. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151] |
| Special lower confidence threshold for doctor commands | Thresholds are uniform and calibrated (0.8/0.35); phrase specificity plus slice gates carry the signal. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json] |
| Advisor inspects repo state before recommending | The advisor scores a prompt against a projection; state inspection is the doctor battery's job. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1103-1144] |
| Live `_routes.yaml` read per advisor request | Scoring reads the pinned SQLite/filesystem projection; a live read would drift from it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1226-1242] |
| Stuffing doctor phrases into skill `graph-metadata.json` | That routes to the skills, the wrong destination, and pollutes curated signals. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:338] |
| Relaxing the doctor input gate to guess targets | Several targets mutate real state; inference is what the gate exists to prevent. [SOURCE: .skilled/commands/doctor/git.md:13-18] [SOURCE: .skilled/commands/doctor/_routes.yaml:236-273] |
| An MCP server for doctor diagnostics | No MCP transport ships by design; a server multiplies surface with no routing benefit. [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:22] |
| Always-on onboarding text on every brief | Spends the injection budget and undermines the honest no-match status. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:43] |
| A routing table in the hook fallback | Fallback injects on every unmatched prompt; it stays one status line plus directives. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487] |
| Onboarding as a new skill instead of a command | The deliverable is a diagnostic run; the command family already owns routes, presentation and validation. [SOURCE: .skilled/commands/doctor/_routes.yaml:23-33] |
| Big-bang admission of all thirteen routes | Contested phrases tie when duplicated; stage empty phrases first, contested routes one at a time. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json] |
| Harvester extension to parse `_routes.yaml` | New root and file type in two implementations for a documented boundary. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:991] |
| Hand-written `PHRASE_BOOSTS` as primary admission | Bypasses inventory, Python parity and drift guard. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-200] |
| One bridge per doctor command | Target granularity is required by the input gate; per-route ids are supported via allow-list. [SOURCE: .skilled/commands/doctor/git.md:13-18] |
| Verbatim duplication of `_routes.yaml` phrases | Measured ties and ambiguity, not handoffs. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-02.json] |
| Relying on the 0.08 command demotion | Too small and applies only without a slash. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777] |
| Onboarding as a `/doctor:skill-advisor` target | Ownership mismatch and the input gate still requires a target. [SOURCE: .skilled/commands/doctor/skill-advisor.md:13-19] |
| Per-route bridges alone as the onboarding answer | Generic onboarding phrases have no single route. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-06.json] |
| New accuracy harness from scratch | The corpus, capture script, gate policy and reach probe already exist. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-16] |
| Reusing the reach probe unchanged | Its hub filter excludes doctor commands. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:71-90] |
| Shipping the umbrella before the harness | Without the slice, admission cannot be distinguished from theft or a tie. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json] |
| Deferring the harness to the end | The harness gates every other phase. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-16] |

## Divergence Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none; the loop ran a single non-divergent lineage and hit the iteration cap.
- Pivot lineage: none.
- Remaining frontier: none recorded by the registry; the ten strategy questions are all answered, and the registry holds 0 open questions.

## 12. Open Questions

None of the ten strategy questions remains open. Two explicitly bounded unknowns carry into implementation rather than research: (a) the exact doctor slice thresholds should be set from the first captured baseline rather than guessed here; (b) the contested-phrase Wave B handoffs need owner sign-off per route (which diagnostic is the intended winner) before admission, because the measurement can show the tie but not the ownership preference.

## 13. Onboarding Entry Point Design

Recommended: a new single-route `/doctor:setup` umbrella. Rationale: single-route commands need no positional target; the family already defaults bare invocations to safe read-only actions; the batteries exist; and the measured onboarding phrases currently have no destination at all. It composes, it does not duplicate: `sk-code-setup-check.cjs`, `git-setup-check.cjs`, `advisor_status`, mirror `--check` scripts and the trigger-index `--check` per leg, printing repair commands. [SOURCE: .skilled/commands/doctor/_routes.yaml:12] [SOURCE: .skilled/commands/doctor/update.md:6-13]

Relationship: a two-layer map. The umbrella owns generic onboarding intent (`help me set up skilled`, `is my repo set up right`, `set up my repo correctly`, `verify my repository health`, `something is wrong with my setup`, `are my rules being enforced`); per-route bridges own specific diagnostics (`check my git hooks` family -> `/doctor:git setup`, `skill budget audit` -> `/doctor:skill-advisor skill-budget`, `runtime mirror drift` -> `/doctor:runtime-mirrors`). Maintenance cost is known: catalog group count and row in `.skilled/commands/README.txt`, `_routes.yaml` plus `route-validate.sh`, and the bridge admission must move together. [SOURCE: .skilled/commands/README.txt:46] [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1-30]

Fallback complement: once the umbrella exists, one bounded sentence in the no-match fallback naming the doctor entry surface. Not before, so the sentence points at something real. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487]

## 14. Routing-Accuracy Test Design

Reuse, do not rebuild. The corpus infrastructure exists: `labeled-prompts.jsonl` (195), `holdout-prompts.jsonl` (66), `ambiguity-prompts.jsonl` (24), `capture-scorer-eval-baseline.mjs`, `score-routing-corpus.py`, and a baseline JSON pinning top-1 0.7949 full corpus, 0.7424 holdout, UNKNOWN 13, gold-none false-fire 5, with a documented bounded-delta gate (minus 0.02 / minus 0.01 / plus 2 UNKNOWN) that the docs call the promotion gate for routing changes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-58] [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:33] [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:59]

Doctor slice: mirror the existing record schema (`id`, `bucket`, `source_type`, `prompt`, expected `skill_top_1`, `notes`, plus margin/tau for ambiguity cases) with expected `command-doctor-*` ids. Seed it from this lineage's measured envelopes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1-3]

Gates: onboarding top-1 9/9; diagnostics >= 12/14 with margin >= 0.05 over the runner-up; controls 10/10 unchanged; zero new ambiguous pairs against the measured baseline; doctor empty-rate 0; and the existing bounded-delta rows recomputed against the current JSON baseline. Structural gates stay `route-validate.sh` and the command-bridges drift guard; the outcome gate is the captured doctor slice, and `advisor_validate --confirm-heavy-run true` remains the release-scale check. [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:63-75] [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1-30]

Reach probe: `ci-router-vocabulary-reach.cjs` probes declared multi-word phrases with a winner-sensitive allowlist (`declaredBy` + `phrase` + `wonBy`), but filters to mode-registry hubs, so doctor commands need either a doctor probe mode or a sibling script that reads `_routes.yaml` and asserts each admitted phrase reaches its declared command id. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-90]

## 15. Implementation Phases

Phase 1 - Measurement harness (no runtime change). Author the doctor slice files, capture the baseline with the pinned environment, record control behavior. Gate: reproducible capture. Rollback: remove the slice.

Phase 2 - Onboarding umbrella. Author `/doctor:setup` (router markdown, presentation asset, workflow battery, route entry, catalog row/count), then admit `command-doctor-setup` through the bridge pipeline and regenerate. Gates: route-validate green, drift guard green, onboarding slice 9/9, controls unchanged, bounded-delta honored. Rollback: remove route and bridge entries, regenerate. [SOURCE: .skilled/commands/README.txt:46] [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1-30]

Phase 3 - Per-route diagnostics in two waves. Wave A: empty phrases. Wave B: contested phrases, one route at a time with owner sign-off and the reach pin. Gates per wave: diagnostics slice, reach pins, control preservation. Rollback: per-route allow-list removal plus regeneration. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-05.json] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:24-70]

Phase 4 - Guidance surface and docs. Fallback sentence after the umbrella exists; fully qualified bridge names; refresh `validation-baselines.md` numbers and the `_routes.yaml` consumption comment. Gates: hook smoke tests, brief text budget, route-validate. [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:45-59] [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21]

## 16. References

- .skilled/bin/skill-advisor.cjs
- .skilled/skills/system-skill-advisor/SKILL.md
- .skilled/skills/system-skill-advisor/ARCHITECTURE.md
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/{fusion.ts,projection.ts,text.ts,weights-config.ts}
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/{explicit.ts,derived.ts}
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/*
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/*
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/{doc-frontmatter.ts,skill-graph-db.ts}
- .skilled/commands/doctor/_routes.yaml, doctor routers and assets
- .skilled/commands/doctor/scripts/{route-validate.sh,command-catalog-mirror-check.cjs}
- .skilled/commands/README.txt
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs
- specs/system-skill-advisor/034-doctor-command-guidance/resource-map.md (emitted by this lineage)

## 17. Evidence Artifact Index

- `iterations/iteration-001.md` … `iteration-010.md` - per-iteration narratives with Focus, Findings, Ruled Out, Edge Cases, Sources, Assessment, Reflection, Next Focus.
- `deltas/iter-001.jsonl` … `iter-010.jsonl` - structured delta streams (iteration row + finding rows with sources).
- `events/run-open.json`, `events/iter-001.json` … `iter-010.json` - single-record gateway payloads.
- `events/measure-iter2-01.json` … `measure-iter2-12.json`, `measure-iter2-index.json` - onboarding baseline envelopes.
- `events/measure-iter6-control-01.json` … `-10.json`, `measure-iter6-doctor-01.json` … `-14.json`, `measure-iter6-index.json` - collision envelopes.
- `prompts/*.cjs` - record generators and measurement runners (reproducible).
- `findings-registry.json`, `deep-research-dashboard.md`, `deep-research-strategy.md`, `resource-map.md` - reducer state surfaces.
- `deep-research-state.jsonl` - gateway-owned projection; `deep-research-audit-ledger/`, `deep-research-effect-ledger/`, `locks-and-fencing-v1/` - gateway ledgers.

Correction note: the projection holds 12 iteration rows - the ten iterations plus two corrected attempts (iterations 2 and 6, appended after a recount of persisted envelopes). The workflow machinery collapses repeated iteration numbers for validation and the terminal synthesis event reports the true count (10 iterations, 10/10 questions answered); only the reducer's coarse `metrics.iterationsCompleted` counter still reads 12, and it is a known artifact of the correction appends, not a policy violation.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 10 / 10
- Remaining questions: 0
- Last 3 iteration summaries: run 8: existing accuracy corpus and gate design (0.85); run 9: consolidated reject list (0.6); run 10: ranked recommendations and phases (0.65)
- Convergence threshold: 0.05 (loop reached the cap; convergence telemetry only)
- Divergence summary: no divergent pivots recorded; single non-divergent lineage
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
