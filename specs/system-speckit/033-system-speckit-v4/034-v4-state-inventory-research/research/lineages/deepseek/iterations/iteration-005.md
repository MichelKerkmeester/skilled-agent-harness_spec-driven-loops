# Iteration 5: Angle 5 — SK-DOC

## Focus
Inventory sk-doc's shipped surface: the sk-create-* leaves and registry modes, the /create:* command set, the naming-convention (kebab-case) guard, templates, and the DQI / quality gate; verify the draft's sk-doc claims (renames, quality-control alias, diagram/diff commands).

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| sk-doc leaves | 13: sk-create-agent, sk-create-benchmark, sk-create-changelog, sk-create-command, sk-create-diff, sk-create-feature-catalog, sk-create-frontmatter, sk-create-manual-testing-playbook, sk-create-quality-control, sk-create-readme, sk-create-repo-rule, sk-create-skill, sk-create-with-human-voice | sk-doc/ ls |
| Registry modes | 14 incl. sk-create-skill-parent (no leaf dir — parent-skill tooling lives inside sk-create-skill/references/parent-skill/) and sk-create-frontmatter | mode-registry.json:19-567; sk-create-skill/ ls |
| /create:* commands | 12 files: agent, benchmark, changelog, command, diff, feature-catalog, manual-testing-playbook, readme, repo-rule, skill-parent, skill, with-human-voice | .opencode/commands/create/ ls |
| Missing commands vs draft | No create/quality-control.md (no /doc:quality alias found anywhere), no create/diagram.md (diagram is /design:diagram), no create/frontmatter.md | find .opencode/commands |
| Kebab-case guard | Strict validation hard-fails non-kebab-case generated package paths; Python files/packages and tool-mandated names exempt | sk-create-skill/references/skill/creation-workflow.md:304,334 |
| Naming convention refs | parent-skills-nested-packets.md, creation-workflow.md (5-field frontmatter + version, kebab-case filenames) | sk-create-skill/references/ |
| DQI / quality gate | ROUTER.md:44 routes "DQI / document audit / review the docs" intent; manual-testing-playbook/intent-detection/doc-quality.md; shared/references/validation.md | ROUTER.md:44 |
| run-skill-benchmark.cjs home | Moved: system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs (not under sk-doc) | find .opencode |
| Benchmark command | /create:benchmark exists (create/benchmark.md) | create/ ls |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "the quality packet is sk-create-quality-control (with /doc:quality kept as an alias)" | /doc:quality alias exists | FALSE | Leaf sk-create-quality-control exists but no quality-control.md command and no /doc:* command family; only doctor/ (unrelated) | P1 | Mode exists; the /doc:quality alias is gone | find .opencode/commands -name "*quality*" |
| "reachable through the new /create:diagram command" | /create:diagram exists | FALSE | Command is /design:diagram (design/diagram.md); create/ has no diagram file | P0 | Draft names a command that does not run; diagram is under /design:* | find .opencode/commands -name "diagram*" |
| "four /create commands were renamed to match their packet (sk-skill → skill, folder_readme → readme, and so on)" | Renames landed | TRUE | create/skill.md and create/readme.md exist; no sk-skill.md or folder_readme.md | — | Confirmed | create/ ls |
| "the authoring agent is now @markdown (was @create)" | @markdown agent | TRUE | agents/markdown.md exists; no create.md agent | — | Confirmed | agents/ ls |
| "sk-create-diff compares a before-and-after document without git" | /create:diff ships | TRUE | create/diff.md + sk-create-diff leaf | — | Confirmed | create/ ls |
| "Kebab-case is now the one name ... a guard refuses new snake_case names" | Kebab guard ships | TRUE | Strict validation hard-fails non-kebab paths; Python exempt | — | Confirmed | creation-workflow.md:304 |
| "run-skill-benchmark.cjs now exits with code 3 on structural or registry blocks instead of 0" | Exit code 3 | UNVERIFIED | Script moved to system-deep-loop/deep-improvement/scripts/skill-benchmark/; visible exits are 1 (error), 2 (usage), or propagated code — no literal exit(3) in this file | P2 | Script moved; exit-3 behavior not visible in the current file | run-skill-benchmark.cjs:796-806 |
| "a mode does not need its own command to exist" | Modes can lack commands | TRUE | sk-create-frontmatter and sk-create-quality-control modes exist with no matching /create:* command | — | Confirmed | mode-registry.json; create/ ls |

## Sources Consulted
- sk-doc/ ls + mode-registry.json; .opencode/commands/create/ + design/ ls; find for quality/diagram/diff
- sk-create-skill/references/skill/creation-workflow.md; ROUTER.md; run-skill-benchmark.cjs

## Assessment
- **newInfoRatio**: 0.95 — leaf roster, command set and guards new; benchmark exit code partially known from draft.
- **Confidence**: Confirmed for all rows except the benchmark exit-3 claim (UNVERIFIED).

## Reflection
- Worked: `find` for command names settles command-existence claims in one call.
- Failed: exit-3 semantics not visible statically.
- Ruled out: reading sk-create-* leaf internals — registry + command surface suffices for this angle.

## Recommended Next Focus
Angle 6: CLI-EXTERNAL-ORCHESTRATION — the six executor packets' model rosters, auth model, sandbox/permission flags, child-dispatch preamble, self-invocation rules, pi native bridges, fan-out reachability.
