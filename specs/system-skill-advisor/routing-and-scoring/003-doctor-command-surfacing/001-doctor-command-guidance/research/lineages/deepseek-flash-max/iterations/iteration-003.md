---
title: "Iteration 3: Doctor family anatomy and its inert trigger_phrases"
trigger_phrases: []
---
# Iteration 3: Doctor family anatomy and its inert trigger_phrases

## Focus

Read the doctor command family: the canonical route manifest `_routes.yaml` with its per-route `trigger_phrases`, how the `/doctor:*` routers bind targets, which routes exist per command, and what the manifest explicitly says about advisor consumption.

## Actions Taken

- Read `.skilled/commands/doctor/_routes.yaml` end to end (header contract, routed targets, mcp subroutes, standalone commands).
- Read `.skilled/commands/doctor/skill-advisor.md` and `.skilled/commands/doctor/git.md` routers.
- Read `.skilled/commands/doctor/env.md` and confirmed `/doctor:env` is absent from the manifest.
- Inspected `.skilled/commands/doctor/scripts/` (route validator, per-route checks) and the route-validate header.

## Findings

1. `_routes.yaml` is the canonical route manifest for the routed doctor commands: it declares `/doctor:speckit` (speckit-retrieval), `/doctor:deep-loop`, six `/doctor:skill-advisor` targets, `/doctor:runtime-mirrors`, `/doctor:sk-code` setup, and three `/doctor:git` targets (hooks, standards, setup). [SOURCE: .skilled/commands/doctor/_routes.yaml:41-289]

2. Each route carries machine-readable fields: `command`, `target`, `yaml`, `setup_vars`, `allowed_flags`, `mutating` class, `gate3_location`, `mcp_tools`, `script_invocations` and `trigger_phrases` — a ready-made structured inventory for any advisor bridge. [SOURCE: .skilled/commands/doctor/_routes.yaml:23-33]

3. The manifest states its own advisor status: the `trigger_phrases` are **not harvested by either Skill Advisor implementation**. Both harvesters only walk `.skilled/skills/*/{references,assets}/*.md` frontmatter (Python `_DOC_HARVEST_SUBDIRS = ("references","assets")` and the TS doc-frontmatter reader, which in this runtime is additionally gated by `SPECKIT_ADVISOR_DOC_TRIGGERS=true`), so a YAML file under `.skilled/commands/doctor/` is out of scope by both file type and root; doctor dispatch is presentation-menu/argv driven, and the field is retained "for a possible future doctor-routes harvester but is inert today". [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21]

4. The `/doctor:skill-advisor` family is already the advisor's own health surface: `tune` mutates the scorer lanes (`explicit.ts`, `lexical.ts`, per-skill `graph-metadata.json`), `rebuild` mutates `skill-graph.sqlite` behind a backup, and `skill-graph-freshness`, `router-reach`, `skill-budget`, `parent-skill` are read-only audits. [SOURCE: .skilled/commands/doctor/_routes.yaml:81-194]

5. `router-reach` already validates routing accuracy as a doctor workflow: it probes the live advisor for every declared phrase through `ci-router-vocabulary-reach.cjs` and reports. Any proposed routing-accuracy test can reuse this seam instead of inventing one. [SOURCE: .skilled/commands/doctor/_routes.yaml:179-194]

6. Setup-shaped routes are read-only batteries: `/doctor:sk-code setup` runs `sk-code-setup-check.cjs` (optional `--prompt=<text>`), and `/doctor:git setup` runs `git-setup-check.cjs` (optional `--tool=<name>`); mutation lives in `/doctor:git hooks` (git config keys) and `/doctor:git standards` (`.sk-git/`). [SOURCE: .skilled/commands/doctor/_routes.yaml:220-289]

7. The declared trigger phrases are already written in plain user language, e.g. git setup's `check my git hooks setup` / `is my sk-git setup working` / `which git rules are live`, git hooks' `pre-commit gate keeps blocking` / `disable comment hygiene gate`, and sk-code setup's `verify my sk-code surface` / `does my sk-code surface route`. These closely paraphrase the measured prompt set, so the vocabulary gap is about harvesting, not authoring. [SOURCE: .skilled/commands/doctor/_routes.yaml:248-289]

8. Doctor commands are thin routers with a mandatory input gate: the target must be named explicitly, and the router must not infer it "from conversation history, open files, earlier runs or repository state". A plain-word advisor brief therefore has to name both the command and its target (for example `/doctor:git setup`) rather than only the command. [SOURCE: .skilled/commands/doctor/skill-advisor.md:13-19] [SOURCE: .skilled/commands/doctor/git.md:13-18]

9. `_routes.yaml` is not a complete doctor-family inventory: `/doctor:env` exists as a standalone thin router (`env.md` with its own workflow and presentation assets) but appears nowhere in the manifest; `/doctor:update` is tracked only under a `standalone` node and `/doctor:mcp` only under `mcp_subroutes`. [SOURCE: .skilled/commands/doctor/env.md:1-40] [SOURCE: .skilled/commands/doctor/_routes.yaml:291-355]

10. The manifest has CI teeth: `route-validate.sh` asserts it against on-disk YAML assets, each owning router's frontmatter allowed-tools union, and internal consistency rules, with a documented dependency on python3 + PyYAML and exit codes 0/1/2/3. Any harvest change must keep this validator green. [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1-30]

11. Each doctor command doc carries an owner marker in an HTML comment — `<!-- skill_agent: system-skill-advisor -->`, `<!-- skill_agent: sk-git -->`, `<!-- skill_agent: system-spec-kit -->` — a latent machine-readable owner link a bridge generator could consume. [SOURCE: .skilled/commands/doctor/skill-advisor.md:5] [SOURCE: .skilled/commands/doctor/git.md:5] [SOURCE: .skilled/commands/doctor/env.md:5]

## Ruled Out

- Assuming `_routes.yaml` trigger_phrases already influence advisor routing: the manifest's own header documents them as inert, and iteration 1 found no doctor bridge in the projection.
- Treating `_routes.yaml` as the complete doctor family inventory: `/doctor:env` is absent from it.

## Dead Ends

- None; the manifest answered the consumption question directly.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/commands/doctor/_routes.yaml
- .skilled/commands/doctor/skill-advisor.md
- .skilled/commands/doctor/git.md
- .skilled/commands/doctor/env.md
- .skilled/commands/doctor/scripts/route-validate.sh

## Assessment

- New information ratio: 0.9
- Questions addressed: doctor family structure and trigger phrases (Q3)
- Questions answered: Q3

## Reflection

- What worked and why: the manifest header answered the exact "is it harvested?" question that the design phase needed, and the measured prompt set maps almost word-for-word onto declared phrases.
- What did not work and why: nothing failed.
- What I would do differently: cross-check standalone commands (env, update, mcp) against the manifest earlier, since the manifest's name implies completeness it does not have.

## Recommended Next Focus

Design the feed path: determine what the two harvester implementations actually ingest (roots, file types, frontmatter shape, environment gate), and model what a doctor-routes harvester or a command-bridges admission would need — without writing outside the lineage.
