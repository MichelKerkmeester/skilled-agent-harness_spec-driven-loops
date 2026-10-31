# Touched skills, phases 1 to 6

Read with `git -c core.fsmonitor=false show --name-only --pretty=format: <commit> | grep "^\.skilled/skills/"` for each landed phase commit, then grouped by the skill folder the path sits under. A commit that touched no skill root is listed so the absence is on the record.

| Commit | Phase it landed | Skill folders touched | Changelog entry it earns |
|--------|-----------------|-----------------------|--------------------------|
| `5cbf9bbf26` | 001-check-engine | none: only `.skilled/commands/doctor/scripts/` and its fixtures | none |
| `73e41db98b` | 002-check-plumbing | `sk-doc` (`sk-create-command/assets/command-contract.json`), `system-skill-advisor` (`runtime/lib/render.ts`, `runtime/lib/scorer/projection.ts`, `runtime/scripts/skill_advisor.py`, `runtime/scripts/command-bridges/command-bridges.generated.json`) | `sk-create-command`, `system-skill-advisor` |
| `4295a10855` | 001-check-engine review fix | none: doctor scripts and tests only | none |
| `492ece39e8` | 003-convert-legacy-skilled | none: doctor scripts, its transforms library and fixtures | none |
| working tree (uncommitted, this phase) | 007-docs-and-changelogs | `sk-doc` (`sk-create-skill/SKILL.md`, `sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`, four new playbook scenarios and the playbook root, the feature catalog root and one new entry) | `sk-create-skill`, `sk-doc` parent |

`sk-code` qualifies only when a file under `sk-code-skilled/assets/scripts/` changed. Phases 1 to 6 changed none: the router resolver and the router parser are used in place from that surface, not edited. No entry.

`sk-create-command` and `system-skill-advisor` earned their entries in phase 2. This phase changes neither, so it adds no second entry for them.
