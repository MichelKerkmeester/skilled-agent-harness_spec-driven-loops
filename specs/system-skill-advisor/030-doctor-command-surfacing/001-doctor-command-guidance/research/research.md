---
title: "Advisor guidance to doctor commands: merged deep-research synthesis"
description: "Merged two-lineage synthesis on how the skill advisor should point plain-word setup and health prompts at the /doctor:* commands."
trigger_phrases:
  - "doctor command guidance research"
  - "advisor doctor routing"
importance_tier: "normal"
contextType: "research"
---
# Advisor Guidance to Doctor Commands: Merged Research

**Packet:** `specs/system-skill-advisor/034-doctor-command-guidance`
**Run:** fan-out, two lineages, concurrency 2, `convergence` stop policy, threshold 0.05
**Lineages:** `deepseek-flash-max` (cli-pi, deepseek-v4.1-flash, thinking max, 10 iterations, stopped at the cap) and `swe-2-max` (cli-devin, swe-2-max, 5 iterations, converged)
**Lineage syntheses:** `research/lineages/deepseek-flash-max/research.md`, `research/lineages/swe-2-max/research.md`
**Attribution:** `research/fanout-attribution.md`; **resource map:** `research/resource-map.md`

---

## 1. Executive Summary

Plain-word setup and health prompts have no owner in the skill advisor today, and no prompt in either lineage's measurements, or in the orchestrator's own re-probe, ever surfaced a `/doctor:*` command. The generic onboarding prompts (`help me set up skilled`, `is my repo set up right`, `why is this rule not enforced`, `is everything configured correctly`) return zero recommendations; domain-specific health prompts route to the owning skill (`check my git hooks` goes to sk-git at 0.8316) rather than to the diagnostic that would answer them. [SOURCE: research/lineages/deepseek-flash-max/events/measure-iter2-index.json] [SOURCE: research/lineages/swe-2-max/iterations/iteration-002.md]

The root cause is structural, not vocabulary. `_routes.yaml` already carries close paraphrases of what users type, but its own header records that neither advisor harvester reads it, so the field is "inert today". [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21] Commands reach the advisor only as `kind: 'command'` bridges generated from per-skill `command-metadata.json` or `allow-list.json`; the generator reports 27 bridges, 5 TypeScript-active, and `projection.ts` contains zero doctor references. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-123]

The answer both lineages converge on: generate doctor command bridges from `_routes.yaml` through the existing bridge pipeline (no scorer-logic change), add one read-only `/doctor:setup` umbrella so generic onboarding prompts have a destination, prevent theft through phrase ownership and staged admission rather than weight tuning, and gate everything on a doctor slice added to the existing routing-accuracy corpus. The one design disagreement, one bridge per command versus one per route, resolves to per-route ids (section 10).

---

## 2. Scope and Boundary

Research only. Both lineages wrote under their own `research/lineages/<label>/` roots; the orchestrator wrote only under `research/`. No advisor, command, hook, test or skill file was modified. The two other deep loops running in `specs/sk-git/033-git-setup-customization/` were not touched; the fan-out runner's `shared_checkout_detected` warnings during the run reflect their concurrent writes, and `git status` after the run showed no change outside this packet beyond the two pre-existing `033` modifications.

---

## 3. Research Questions

1. How does the advisor resolve a prompt today, and which files own scoring, graph and trigger data?
2. What does it return today for plain-word setup and health prompts?
3. How is the doctor family structured, and what trigger phrases does `_routes.yaml` declare?
4. How are commands surfaced to the advisor compared with skills?
5. Should `_routes.yaml` trigger phrases feed the advisor, and through which mechanism?
6. Should there be a dedicated onboarding or "set up skilled" entry point?
7. How can doctor routing avoid stealing prompts from skills?
8. How should routing accuracy be tested?
9. Which ideas should be rejected, and why?
10. What are the ranked recommendations and implementation phases?

All ten are answered below. Both lineages reported zero open strategy questions at stop.

---

## 4. Method and Source Quality

Fifteen iterations across two independent model lineages. `deepseek-flash-max` read source seams in iterations 1-5 and 8, measured 36 live advisor envelopes in iterations 2 and 6 (12 onboarding prompts, 10 skill-shaped controls, 14 candidate doctor phrases), and spent iterations 5, 7, 9 and 10 on design and rejection analysis. `swe-2-max` covered mechanics, a 17-probe baseline, the doctor inventory, command-surface mechanics and design consolidation. Evidence is first-party repository code cited `path:line` plus measured envelopes stored under `research/lineages/deepseek-flash-max/events/`.

The orchestrator spot-checked the load-bearing citations before merging: the `_routes.yaml` "inert today" header (lines 14-21), the zero doctor references in `projection.ts`, the command-derived `bridgeId` regex (`derive-command-bridges.cjs:56-61`), the free-form allow-list `id` (`derive-command-bridges.cjs:100-123`), the 0.08 command demotion (`fusion.ts:776-777`), the fallback renderer (`render.ts:476-490`), the bridge counts, the corpus sizes (195/66/24), the `skill_agent` tags on every doctor router, the trigger-index `CORPUS_ROOTS` and the reach probe's hub filter. All matched.

Known run defects, reported rather than hidden: both lineages' iteration state records lack the route-proof fields (`target_agent`, `resolved_route`, `agent_definition_loaded`, `mode`), and the `deepseek-flash-max` state log carries duplicate records for iterations 2 and 6. The runner collapses duplicates and tolerates missing route proof (`fanout-run.cjs:753-766`), but the command contract treats missing route proof as incomplete delegation.

---

## 5. Source Inventory

- `.skilled/bin/skill-advisor.cjs`: CLI shim in front of the compiled daemon CLI.
- `.skilled/skills/system-skill-advisor/`: `SKILL.md`, `ARCHITECTURE.md`, `hooks/skill-advisor-hook.md`, `runtime/lib/scorer/` (`fusion.ts`, `projection.ts`, `lanes/explicit.ts`, `text.ts`), `runtime/lib/render.ts`, `runtime/lib/skill-graph/doc-frontmatter.ts`, `runtime/scripts/skill_advisor.py`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/`: `derive-command-bridges.cjs`, `allow-list.json`, `scoring-compatibility.json`, `command-bridges.generated.json`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`: `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`, `scorer-eval-baseline.json`.
- `.skilled/commands/doctor/`: `_routes.yaml`, the nine routers, `assets/doctor-skill-advisor-tune.yaml`, `scripts/route-validate.sh`, `scripts/command-catalog-mirror-check.cjs`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`.
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`.
- Full per-file inventory: `research/resource-map.md` (67 references).

---

## 6. How the Advisor Routes Today

- The CLI shim spawns the compiled daemon CLI; the daemon scores against a projection built from `skill-graph.sqlite` or the filesystem. [SOURCE: .skilled/bin/skill-advisor.cjs:22-23] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1103-1144]
- Skill vocabulary lives in each skill's `graph-metadata.json`; reference and asset frontmatter feeds routing only when `SPECKIT_ADVISOR_DOC_TRIGGERS=true`, and the Python harvester walks only `references` and `assets` under the skills root. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:338] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:986-993]
- Scoring fuses five lanes; the explicit-author lane scores hand-authored `PHRASE_BOOSTS` plus each projection's `intentSignals`/`keywords` by phrase specificity. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:169-177] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:358-376]
- The confidence gate is 0.8 with uncertainty 0.35, observed in every live envelope. [SOURCE: research/lineages/deepseek-flash-max/events/measure-iter2-01.json]
- The hook brief is advisory only and never blocks or replaces explicit loading; with no match it renders `Advisor: no skill matched.` plus the directive block. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-490]

---

## 7. Command Surfacing Compared with Skills

- Commands are `kind: 'command'` projections appended to the skill list; the renderer already maps `kind: 'command'`, so a bridged doctor command can appear as the top pick or in the two-candidate ambiguous form without renderer changes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:168-170]
- Bridge inputs are per-skill `command-metadata.json` (only system-deep-loop, sk-design and sk-doc carry one) or `allow-list.json`; 27 bridges, 5 TypeScript-active, 15 Python-active. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10]
- Derived bridge ids come from the command string through `bridgeId()`, so derivation alone yields one id per command; allow-list ids are free-form and only checked for uniqueness. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:56-61] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-135]
- Commands are demoted 0.08 during ordering when the prompt has no slash, which is a uniform handicap rather than a theft guard. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777]
- No doctor command is bridged: `projection.ts` has zero doctor references and `.skilled/commands/doctor/` has no `command-metadata.json`.
- Commands are also outside the Gate 1 trigger index: `CORPUS_ROOTS` lists `specs`, `.skilled/skills`, `.skilled/hooks` and the changelog, not `.skilled/commands`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:31]

---

## 8. Doctor Family Anatomy

- `_routes.yaml` holds 13 routed targets under `routes` (`/doctor:speckit`, `/doctor:deep-loop`, six `/doctor:skill-advisor` targets, `/doctor:runtime-mirrors`, `/doctor:sk-code` setup, `/doctor:git` hooks, standards and setup), plus `/doctor:update` as a standalone entry and the MCP subroutes; 18 `trigger_phrases` blocks in total. [SOURCE: .skilled/commands/doctor/_routes.yaml:42-275] [SOURCE: .skilled/commands/doctor/_routes.yaml:324]
- `/doctor:env` is a standalone router with no manifest entry and no trigger phrases. [SOURCE: .skilled/commands/doctor/env.md:6-32]
- A command that owns one route needs no positional target; multi-route routers refuse inferred targets ("Do not infer it from conversation history, open files, earlier runs or repository state"). [SOURCE: .skilled/commands/doctor/_routes.yaml:12] [SOURCE: .skilled/commands/doctor/git.md:13-18]
- Bare `/doctor:update` runs the read-only `check` action; bare `/doctor:env` shows a menu. [SOURCE: .skilled/commands/doctor/update.md:16] [SOURCE: .skilled/commands/doctor/env.md:32]
- Every router carries a `<!-- skill_agent: <id> -->` tag, a ready-made `skillId` for a bridge. [SOURCE: .skilled/commands/doctor/git.md:6] [SOURCE: .skilled/commands/doctor/sk-code.md:6]
- The tune workflow's stated principle is "Tune the routing surface, never the routing logic". [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml:45]
- The `_routes.yaml` header cites `skill_advisor.py:810-871` for the harvest scope; the scope now sits near line 990, so the header comment is stale. [SOURCE: .skilled/commands/doctor/_routes.yaml:15] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:986-993]

---

## 9. Measured Baseline

Orchestrator re-probe on 2026-10-15 (live daemon, generation 1033), all exit 0:

| Prompt | Advisor returned | Doctor command that should answer |
|---|---|---|
| help me set up skilled | nothing | none exists; proposed `/doctor:setup` |
| is my repo set up right | nothing | proposed `/doctor:setup` |
| check my git hooks | sk-git 0.8316 (explicit_author lane) | `/doctor:git setup` |
| why is this rule not enforced | nothing | `/doctor:git setup` or `/doctor:git hooks` |
| my commit hook is not running | sk-git 0.9402 | `/doctor:git setup` |
| set up sk-code for this repo | sk-code 0.9208, sk-doc 0.82 | `/doctor:sk-code setup` |
| the skill advisor recommends the wrong skill | system-skill-advisor 0.8844 | `/doctor:skill-advisor tune` |
| is code mode installed correctly | mcp-code-mode 0.8484, sk-code 0.8259 | `/doctor:mcp` |
| check my environment variables | nothing | `/doctor:env` |
| update skilled to the latest release | sk-code, system-deep-loop, sk-git, each 0.82 | `/doctor:update` |
| the trigger index lookup returns nothing | system-spec-kit 0.8376 | `/doctor:speckit` |
| is everything configured correctly | nothing | proposed `/doctor:setup` |

Lineage measurements agree. `deepseek-flash-max` found ten of twelve onboarding prompts empty; all ten skill-shaped controls kept their incumbents; of 14 candidate doctor phrases, eight already route to the owning skill, three are empty (`disable comment hygiene gate`, `runtime mirror drift`, `skill budget audit`), two mis-route (`new skill not appearing in advisor results` to sk-doc; `Code Mode broken` to mcp-code-mode and sk-code) and one is borderline. [SOURCE: research/lineages/deepseek-flash-max/events/measure-iter6-index.json] `swe-2-max` found 17 of 17 probes surfaced no doctor command, including the literal `/doctor:git` (to sk-git) and `/doctor:env` (empty), and `run the doctor for my repo` came back ambiguous with sk-doc on top. [SOURCE: research/lineages/swe-2-max/iterations/iteration-002.md]

Reading: the skill captures are defensible (right domain, wrong artifact kind), so they mark the anti-theft boundary. The gap is that no doctor candidate exists to compete, not that the math is wrong.

---

## 10. Feed Mechanism: Options and Verdict

| Option | Verdict |
|---|---|
| Extend the doc harvesters to parse `_routes.yaml` | Rejected: new root, new file type and YAML parsing in two implementations, behind a flag that is off by default. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:986-993] |
| Hand-written `PHRASE_BOOSTS` as the primary path | Rejected as primary: bypasses the bridge inventory, generated projections, Python parity and the drift guard. Kept only for literal `/doctor:x` strings, lowest priority. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-200] |
| Hand-maintained allow-list entries | Works today, but duplicates `_routes.yaml` and drifts. |
| Teach `derive-command-bridges.cjs` a `_routes.yaml` source | **Chosen.** The manifest stays canonical, both projections regenerate together, and no scorer logic changes, consistent with the tune principle. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml:45] |

Granularity, the one place the lineages disagreed: `swe-2-max` proposed one bridge per command because `bridgeId()` admits one id per `/cmd:sub`; `deepseek-flash-max` proposed one per route. Per-route ids win, because the multi-route routers refuse to infer a target, so a brief naming only `/doctor:git` leaves the user at a menu, while `/doctor:git setup` is runnable. The generator already accepts free-form ids from the allow-list path, so the new source can emit ids such as `command-doctor-git-setup` without changing `bridgeId()`. [SOURCE: .skilled/commands/doctor/git.md:13-18] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-123]

Arbitration rules: one owner per phrase rather than verbatim duplication (duplicated phrases tied in measurement), diagnostic phrases of three or more tokens, no bare work verbs, and empty phrases admitted first. [SOURCE: research/lineages/deepseek-flash-max/events/measure-iter6-doctor-02.json]

---

## 11. Ranked Recommendations

1. **Add a doctor slice to the existing routing-accuracy corpus before any runtime change.** Onboarding prompts, diagnostic phrases, skill-shaped controls and ambiguity cases with expected winners and margins, captured against `scorer-eval-baseline.json` (top-1 155/195 = 0.7949 today). Every later phase is measured against it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-20] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1-3]
2. **Add a read-only, single-route `/doctor:setup` umbrella** that composes the existing batteries (sk-code setup check, git setup check, advisor status, runtime-mirror check, trigger-index check) and prints the repair command per failing leg. It gives the empty generic onboarding prompts one destination and needs no positional target. [SOURCE: .skilled/commands/doctor/_routes.yaml:12] [SOURCE: .skilled/commands/doctor/_routes.yaml:228-235] [SOURCE: .skilled/commands/doctor/update.md:16]
3. **Generate doctor bridges from `_routes.yaml` in `derive-command-bridges.cjs`**, one per route with distinct ids, `skillId` from each router's `skill_agent` tag, trigger phrases into `keywords`/`intentSignals`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:56-135] [SOURCE: .skilled/commands/doctor/git.md:6]
4. **Activate on both scorers together through `scoring-compatibility.json`**, so TypeScript and Python agree (today 5 of 27 bridges are TypeScript-active, 15 Python-active). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:3-9]
5. **Stage admission.** Wave A: the measured empty phrases with no theft risk (`disable comment hygiene gate` to `/doctor:git hooks`, `runtime mirror drift` to `/doctor:runtime-mirrors`, `skill budget audit` to `/doctor:skill-advisor skill-budget`). Wave B: contested phrases one route at a time, each with the owning skill's sign-off on which side should win. [SOURCE: research/lineages/deepseek-flash-max/events/measure-iter6-index.json]
6. **Prevent theft through vocabulary, not weights.** Diagnostic-flavored phrases ("is my git hooks setup working", "why is this rule not enforced"), no bare work verbs, and the existing two-candidate ambiguous render when a skill competes. No lane-weight or threshold changes. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml:45] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777]
7. **Render the runnable `/doctor:<command> <target>` string as the bridge name**, because the brief label is what the user sees and the routers refuse inferred targets. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:168-170] [SOURCE: .skilled/commands/doctor/git.md:13-18]
8. **Extend the router-reach probe to doctor routes.** `ci-router-vocabulary-reach.cjs` only enumerates skill hubs that have `mode-registry.json` and `ROUTER.md`, so it never sees doctor phrases; add a doctor mode or sibling script that reads `_routes.yaml` and asserts each admitted phrase reaches its declared bridge id. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:75-82]
9. **Add one bounded fallback sentence** naming `/doctor:setup` when no skill matched, and only after the umbrella exists; the directive block stays unchanged. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-490]
10. **Close the coverage and doc gaps in the same change set:** give `/doctor:env` and `/doctor:update` trigger phrases (neither has any today), and update the `_routes.yaml` header (drop "inert today", fix the stale `skill_advisor.py:810-871` cite) once the generator consumes it. [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21] [SOURCE: .skilled/commands/doctor/env.md:6-32]

Lowest priority, optional: literal `/doctor:x` entries in `PHRASE_BOOSTS`, mirroring the existing `/deep:research` pattern within `PHRASE_BOOST_BOUND`. Typed slash commands are the smallest miss once bridges exist. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-112]

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Advisor auto-dispatches doctor commands | The hook is advisory only and never replaces explicit loading; doctor routes are interactive | `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21` | deepseek 9 |
| Fake skill nodes per doctor route | `kind: 'command'` exists so commands are not fake skills; pollutes skill lifecycle state | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151` | deepseek 9, swe 5 |
| Lower confidence threshold for doctor commands | Thresholds are uniform and calibrated; specificity and the slice gate carry the signal | `research/lineages/deepseek-flash-max/events/measure-iter2-01.json` | deepseek 9 |
| Advisor inspects repo state before recommending | The advisor scores a prompt against a projection; state inspection is the battery's job | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1103-1144` | deepseek 9 |
| Live `_routes.yaml` read per request | Scoring reads the pinned projection; a live read drifts from it | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1226-1242` | deepseek 9 |
| Doctor phrases in skills' `graph-metadata.json` | Routes to the skill, the wrong destination | `.skilled/skills/system-skill-advisor/SKILL.md:338` | deepseek 9 |
| Copy doctor phrases into owning skills' `command-metadata.json` | Duplicates `_routes.yaml`; the mirror-check script exists because copies drift | `.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | swe 5 |
| Relax the doctor input gate to guess targets | Several targets mutate state; the gate exists to prevent inference | `.skilled/commands/doctor/git.md:13-18` | deepseek 9 |
| Hardcoded "try /doctor:x" text on every brief | Constant, unmatched to the prompt, spends the injection budget; refused for repo rules by a prior packet | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-490` | deepseek 9, swe 5 |
| Routing table in the hook fallback | The fallback fires on every unmatched prompt; it stays one status line plus directives | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-490` | deepseek 9 |
| Harvest `.skilled/commands/**/*.md` through the doc harvester | Flag off by default, wrong root and file type, command prose would flood the lexical lane | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:986-993` | swe 5 |
| Scoring-logic or weight changes | The failure is missing candidates, not wrong math; violates the tune principle | `.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml:45` | swe 5 |
| Relying on the 0.08 command demotion as the theft guard | Too small and only applies without a slash | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777` | deepseek 9 |
| One bridge per doctor command | Leaves the user at the target menu; per-route ids are supported | `.skilled/commands/doctor/git.md:13-18` | deepseek 9 |
| Verbatim duplication of `_routes.yaml` phrases | Measured as ties and ambiguity, not handoffs | `research/lineages/deepseek-flash-max/events/measure-iter6-doctor-02.json` | deepseek 6 |
| Big-bang admission of all routes | Contested phrases tie; stage empty phrases first | `research/lineages/deepseek-flash-max/events/measure-iter6-index.json` | deepseek 7 |
| Onboarding as a `/doctor:skill-advisor` target or a new skill | Ownership mismatch; the deliverable is a diagnostic run the command family already owns | `.skilled/commands/doctor/skill-advisor.md:13-19` | deepseek 9 |
| Per-route bridges alone as the onboarding answer | Generic onboarding phrases have no single route | `research/lineages/deepseek-flash-max/events/measure-iter2-06.json` | deepseek 7 |
| An MCP server for doctor diagnostics | No MCP transport ships by design; more surface, no routing gain | `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:22` | deepseek 9 |
| A new accuracy harness from scratch, or the reach probe unchanged | The corpus, capture script and baseline exist; the probe's hub filter excludes doctor commands | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:75-82` | deepseek 8 |

---

## Divergence Map

- Saturated directions: none; neither lineage ran divergent mode.
- Pivots taken: 0. Pivot failures and audited overrides: 0.
- Council artifacts: none.
- Cross-lineage divergence: one design disagreement (bridge granularity), resolved in section 10; the lineages otherwise agree on mechanism, umbrella entry, anti-theft approach and test harness.
- Remaining frontier: the Wave B ownership decisions and the slice thresholds (section 12).

---

## 12. Open Questions

1. Wave B ownership: for each contested phrase (git setup family, sk-code surface, advisor wrong-skill, trigger-index drift), should the doctor diagnostic or the owning skill win? Measurement shows the tie; only the owner can choose.
2. Slice thresholds should be set from the first captured doctor baseline rather than guessed here.
3. Whether to admit the MCP subroutes and `/doctor:deep-loop` in the first waves was not measured.

---

## 13. Onboarding Entry Point Design

A new single-route `/doctor:setup`, read-only, that composes rather than duplicates: each leg calls an existing battery and prints the repair command for each failing leg. It owns generic intent ("help me set up skilled", "is my repo set up right", "is everything configured correctly", "something is wrong with my setup"); per-route bridges own specific diagnostics. Maintenance moves together: the catalog row and count in `.skilled/commands/README.txt`, the `_routes.yaml` entry and `route-validate.sh`, and the bridge regeneration. [SOURCE: .skilled/commands/README.txt:46] [SOURCE: .skilled/commands/doctor/_routes.yaml:12-13]

---

## 14. Routing-Accuracy Test Design

Reuse the existing corpus: `labeled-prompts.jsonl` (195), `holdout-prompts.jsonl` (66), `ambiguity-prompts.jsonl` (24) and `scorer-eval-baseline.json`, captured with the pinned environment (built-in semantic off, empty DB dir, filesystem projection). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-20]

Doctor slice records follow the existing schema with expected `command-doctor-*` ids. Proposed gates: onboarding top-1 on every onboarding prompt; diagnostics at least 12 of 14 with a 0.05 margin over the runner-up; skill-shaped controls 10 of 10 unchanged; no new ambiguous pairs; existing corpus within the documented bounded delta. Structural gates stay `route-validate.sh` and the command-bridges drift guard; the doctor reach probe (recommendation 8) pins phrase-to-bridge reach in CI.

---

## 15. Implementation Phases

1. **Measurement harness, no runtime change.** Author the doctor slice from this run's probes, capture the baseline. Gate: reproducible capture. Rollback: delete the slice.
2. **Onboarding umbrella.** Author `/doctor:setup` (router, presentation asset, workflow YAML, `_routes.yaml` entry, catalog row), then admit its bridge. Gates: `route-validate.sh`, drift guard, onboarding slice, controls unchanged.
3. **Bridge generation from `_routes.yaml`.** Third source in `derive-command-bridges.cjs`, per-route ids, TypeScript and Python activation together; Wave A phrases only. Gates: slice, drift guard, parity.
4. **Wave B contested phrases**, one route at a time with owner sign-off, plus the doctor reach probe in CI.
5. **Guidance surface and docs.** Fallback sentence, `/doctor:env` and `/doctor:update` phrases, `_routes.yaml` header refresh, optional literal `PHRASE_BOOSTS`. Gates: hook smoke tests, brief text budget.

---

## 16. Lineage Attribution

| Lineage | Executor | Iterations | Stop reason | Final newInfoRatio |
|---|---|---|---|---|
| deepseek-flash-max | cli-pi, deepseek-v4.1-flash, thinking max | 10 | maxIterationsReached | 0.9 |
| swe-2-max | cli-devin, swe-2-max | 5 | converged (all questions answered) | 0.8 |

Merged registry: `research/findings-registry.json` (144 key findings).

---

## 17. References

- `research/lineages/deepseek-flash-max/research.md` and `iterations/iteration-001.md` through `iteration-010.md`
- `research/lineages/swe-2-max/research.md` and `iterations/iteration-001.md` through `iteration-005.md`
- `research/lineages/deepseek-flash-max/events/` (measured advisor envelopes)
- `research/resource-map.md`
- `research/fanout-attribution.md`

---

## Convergence Report

- Stop reason: maxIterationsReached (latest lineage stop; `swe-2-max` stopped earlier on legal convergence)
- Total iterations: 15 (10 + 5)
- Questions answered: 15 / 15 (10 in `deepseek-flash-max`, 5 in `swe-2-max`)
- Remaining questions: 0
- Last 3 iteration summaries: deepseek run 8: accuracy-harness seams (0.85); deepseek run 9: rejection analysis (0.6); deepseek run 10: ranking and phases (0.65)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
