# Iteration 3: Doctor family inventory — _routes.yaml and the harvester boundary

## Focus
What the doctor command family covers: `.skilled/commands/doctor/*.md` routers, `_routes.yaml` structure and trigger_phrases per route, whether that file is machine-readable enough to feed the advisor, and the harvest boundary that keeps it out today.

## Actions Taken
- Read `.skilled/commands/doctor/_routes.yaml` end-to-end (354 lines): header contract, routes, mcp_subroutes, standalone.
- Verified the harvester claim in both scorers: `skill_advisor.py` env gate and subdirs; `doc-frontmatter.ts` env gate and HARVEST_SUBDIRS.
- Checked `/doctor:env`, `/doctor:mcp`, `/doctor:update` coverage (the routes the manifest does not own), `skill_agent` owner tags, and the `router-reach` harness.
- Enumerated the command tree: no umbrella `/doctor` router exists.

## Findings
1. `_routes.yaml` (schema_version 1) is the canonical doctor route manifest: a `routes` list where each entry carries `command`, `target`, `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `gate3_location`, `mcp_tools`, `script_invocations`/`cli_commands`, and `trigger_phrases` — machine-readable YAML, validated by `.skilled/commands/doctor/scripts/route-validate.sh` [SOURCE: .skilled/commands/doctor/_routes.yaml:24-45].
2. The file's own header states the gap: "Consumed by: NOT currently harvested by either Skill Advisor implementation... The trigger_phrases field below is retained for a possible future doctor-routes harvester but is inert today" — the vocabulary was authored in anticipation of exactly this feature [SOURCE: .skilled/commands/doctor/_routes.yaml:26-33,44-45].
3. Route inventory: `/doctor:speckit`→speckit-retrieval; `/doctor:deep-loop`→deep-loop; `/doctor:skill-advisor`→6 targets (tune, rebuild, skill-budget, parent-skill, skill-graph-freshness, router-reach); `/doctor:runtime-mirrors`→runtime-mirrors; `/doctor:sk-code`→setup; `/doctor:git`→3 targets (hooks, standards, setup); `mcp_subroutes` (install, debug); standalone `/doctor:update` (check/align/apply/rollback/record-base/compat). 18 `trigger_phrases:` blocks in total [SOURCE: .skilled/commands/doctor/_routes.yaml:42-354].
4. Harvest boundary verified in both scorers: Python `skill_advisor.py:988` (`SPECKIT_ADVISOR_DOC_TRIGGERS` env gate, default off) + `:991` `_DOC_HARVEST_SUBDIRS = ("references","assets")` rooted at SKILLS_DIR; TS `doc-frontmatter.ts:36` (same env gate) + `:170` `HARVEST_SUBDIRS = ['references','assets']`. A `.yaml` under `.skilled/commands/doctor/` is excluded by file root AND type. (The _routes.yaml comment cites py lines 810-871; the live code is ~988-1051 — comment line drift, substance correct.) [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:988-1051; .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:36,170].
5. `/doctor:env` is NOT in `_routes.yaml` and declares no trigger_phrases anywhere — it is a standalone thin router for environment switches (`hook-flags.env`, `.claude/settings.local.json`). There is no generic "is my repo set up right" doctor route: the family has per-domain health checks but no umbrella onboarding/health target [SOURCE: .skilled/commands/doctor/env.md:1-30; .skilled/commands/doctor/assets/doctor-env.yaml:1-25; .skilled/commands/doctor/_routes.yaml].
6. Every doctor command already carries a machine-readable owner tag `<!-- skill_agent: <skill-id> -->` (git→sk-git, sk-code→sk-code, skill-advisor→system-skill-advisor, deep-loop→system-deep-loop, env/mcp/runtime-mirrors/speckit/update→system-spec-kit) — the exact `skillId`/`ownerMode` pair a command bridge requires [SOURCE: .skilled/commands/doctor/*.md skill_agent lines].
7. A routing-accuracy harness already exists: `/doctor:skill-advisor router-reach` wraps `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`, which probes the live advisor with every declared multi-word phrase (concurrency 8) and reports phrases that fail to reach their declaring hub — the same shape a doctor-route accuracy test needs [SOURCE: .skilled/commands/doctor/_routes.yaml:179-207; .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-40].
8. Doctor dispatch is argv/presentation-menu driven per command router (e.g. skill-advisor.md MANDATORY INPUT GATE binds `target` before loading assets); there is no umbrella `/doctor` entry command that could serve as a generic "set up skilled" front door [SOURCE: .skilled/commands/doctor/skill-advisor.md:1-30; .skilled/commands tree listing].

## Questions Answered
- Q4 (doctor family coverage + _routes.yaml triggers) — answered: manifest structure, per-route triggers, owner tags, coverage gaps (env, umbrella entry).

## Questions Remaining
- Design: how should doctor guidance be surfaced (bridge entries from _routes.yaml? phrase boosts? new surface?), dedicated onboarding entry, anti-steal rules, test approach. Which ideas to reject and why.
- Parity check on the Python scorer is folded into the design question (both scorers consume the same generated table).

## Ruled Out
- Hypothesis "_routes.yaml triggers are already machine-consumed": falsified by its own header plus both harvesters' scope.
- Hypothesis "/doctor:env participates in the route manifest": falsified — standalone, no triggers.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: the _routes.yaml header's cited Python line numbers (810-871) are stale relative to the live code (~988-1051); the substance is accurate — recorded as comment drift worth fixing when the harvester lands.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/commands/doctor/_routes.yaml:1-354
- .skilled/commands/doctor/{env,skill-advisor}.md
- .skilled/commands/doctor/assets/doctor-env.yaml:1-25
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:988-1051
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:15-40,170-210
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-40
- .skilled/commands tree listing
- steer.md: absent this iteration

## Assessment
- New information ratio: 0.9 — the manifest structure, owner tags, env coverage hole, and harvest boundary are all new; the "doctor invisible" theme corroborates rather than repeats iteration 1-2.
- Questions addressed: Q4.
- Questions answered: "What does the doctor command family cover: .skilled/commands/doctor/*.md routes and _routes.yaml trigger_phrases per route?"

## Reflection
- What worked: reading `_routes.yaml`'s own header gave the design intent ("retained for a possible future doctor-routes harvester") — the file was built for this feature.
- What did not work: the header's line citations were stale — a reminder to verify every cited line against the live file before repeating it.
- What I would do differently: none.

## Recommended Next Focus
Design: candidate mechanisms for surfacing doctor commands (generated bridges fed by _routes.yaml + skill_agent tags, explicit-lane phrase boosts for literal `/doctor:*` names, a possible umbrella/onboarding entry), anti-steal rules versus the measured skill captures, routing-accuracy testing via router-reach, and ideas to reject.
