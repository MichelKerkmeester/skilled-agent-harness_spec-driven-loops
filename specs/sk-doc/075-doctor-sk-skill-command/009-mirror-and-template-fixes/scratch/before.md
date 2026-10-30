# Baselines recorded before the change

Recorded in the worktree on the run that started this phase, before any edit.

## Hermes checkers (the two this phase adds to the route)

```text
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
PASS: 65 Hermes skill copies in sync
exit 0

$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check
[hermes-prompt-sync] PASS: 38 prompts are in sync.
exit 0

```

## Route and doctor suite

```text
$ bash .skilled/commands/doctor/scripts/route-validate.sh
PASS: J1: targets are in parity with their router and presentation across 8 commands
PASS: K1/K2: no read-only route declares a write or grants a mutating advisor command
PASS: L1: all 44 route script invocations are invoked by their workflow YAML

─────────────────────────────────────────────────────────────────
OK: route-validate — 18 routes validated, 3 warnings
exit 0

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
   Start at  06:49:06
   Duration  630ms (transform 16ms, setup 12ms, import 12ms, tests 547ms, environment 0ms)

[run-all] PASS: skill-graph freshness panel (vitest)

[run-all] 7 suite(s) passed, 0 failed
exit 0

```

## The presence of each checker line, before the change

```text
$ rg -c "sync-skills-hermes" .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml
exit 1

$ rg -n "in-SKILL.md router" .skilled/skills
.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json:2:  "_template": "Standalone-skill leaf-manifest.config.json scaffold — the single authored declaration a class-S root needs beyond identity (init_skill.py writes an equivalent one automatically; use this when authoring or repairing by hand). workflowMode MUST equal the folder name. leafRoots may only name references, assets, feature-catalog, manual-testing-playbook — keep only the ones whose docs the skill's in-SKILL.md router actually routes into. After authoring, run ci-skill-root-metadata.cjs --fix to generate leaf-manifest.json and the derived leaf-aliases.json; never hand-edit those two. Replace every [bracketed] placeholder and keep the _note for future maintainers, adapting the exclusion sentence to this skill.",
exit 0
```
