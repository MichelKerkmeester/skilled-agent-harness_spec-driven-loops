# T004 — what each root feeds (producer → consumer, with `file:line`)

Paths are relative to the Skilled checkout. Line numbers are from the pre-change tree.

## Producers

| Producer | Line | Selects the root by |
|---|---|---|
| `sk-skill-surface.cjs:84` | `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs:84` | `.git` walk, then `git rev-parse` fallback |
| `skill-graph-freshness.cjs:46` | `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:46` | `.git` walk, else the start path |
| `parent-skill-check.cjs:74` | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:74` | `.opencode` walk, else `path.resolve(start, '../../../..')` |

## `sk-skill-surface.cjs` consumers

| Consumer | Line | Read joined onto `context.repoRoot` |
|---|---|---|
| `sk-skill-surface.cjs:105` | `createContext` assigns it | `repoRoot = options.repoRoot \|\| findRepoRoot(startDir \|\| __dirname)` |
| `sk-skill-surface.cjs:750` | `resolveHubTarget` | `context.skillsDir`, `context.cwd`, `context.repoRoot` in that order |
| `sk-skill-surface.cjs:1323` | export surface | `findRepoRoot` stays the exported name for two commands and two suites |

## `sk-skill-check.cjs` consumers of the surface root

| Consumer | Line | Read |
|---|---|---|
| `sk-skill-check.cjs:402` | runtime mirrors | `context.repoRoot/.claude/skills` |
| `sk-skill-check.cjs:403` | runtime mirrors | `context.repoRoot/.opencode/skills` |
| `sk-skill-check.cjs:404` | runtime mirrors | `context.repoRoot/.pi/skills` |
| `sk-skill-check.cjs:405` | runtime mirrors | `context.repoRoot/.devin/skills` |
| `sk-skill-check.cjs:463` | description contract | `context.repoRoot/.skilled/skills/sk-doc/shared/assets/skill-contract.json` |
| `sk-skill-check.cjs:483` | description audit | `audit_descriptions.py --repo-root context.repoRoot` |
| `sk-skill-check.cjs:593` | changelog index | `changelogStatus(..., context.repoRoot, ...)` |
| `sk-skill-check.cjs:743` | evidence display | `path.relative(context.repoRoot, target)` |

## `sk-skill-convert.cjs` consumer

| Consumer | Line | Read |
|---|---|---|
| `sk-skill-convert.cjs:108` | context build | `path.resolve(options.repoRoot \|\| surface.findRepoRoot(SCRIPT_DIR))` |

## `skill-graph-freshness.cjs` consumers

| Consumer | Line | Read joined onto `REPO` |
|---|---|---|
| `skill-graph-freshness.cjs:55` | `REPO` assignment | `SKILL_GRAPH_FRESHNESS_ROOT` keeps precedence over the resolver |
| `skill-graph-freshness.cjs:58` | `rel()` | every repository-relative read below |
| `skill-graph-freshness.cjs:76` | compiled graph | `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` |
| `skill-graph-freshness.cjs:112` | SQLite graph | `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` |
| `skill-graph-freshness.cjs:145` | disk scan | `.skilled/skills` |

## `parent-skill-check.cjs` consumers

| Consumer | Line | Read joined onto `REPO_ROOT` |
|---|---|---|
| `parent-skill-check.cjs:82` | `REPO_ROOT` assignment | `findRepoRoot(__dirname)` |
| `parent-skill-check.cjs:133` | advisor script | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` |
| `parent-skill-check.cjs:149` | shared contract libraries | `.skilled/skills/sk-doc/sk-create-skill/scripts` |
| `parent-skill-check.cjs:153` | canary fixture | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout` |
| `parent-skill-check.cjs:163` | commands directory | `.skilled/commands` (unless `PARENT_HUB_CHECK_COMMANDS_DIR`) |
| `parent-skill-check.cjs:1923` | routing-shape skills root | `.skilled/skills` (unless `ROUTING_SHAPE_SKILLS_ROOT`) |
| `parent-skill-check.cjs:2480` | default target | `.skilled/skills/system-deep-loop` |

## Startup load path

`parent-skill-check.cjs:158` requires `routing-shape-debt.cjs` from
`REPO_ROOT/.skilled/skills/sk-doc/sk-create-skill/scripts/lib/` at module scope, so a wrong
root fails before `main()` runs and prints `Cannot find module` instead of a `Resolved:` line.

## Count

`rg -c 'sk-skill-surface\.cjs:|skill-graph-freshness\.cjs:|parent-skill-check\.cjs:'` over this
file reports 19 matching lines, above the 11 the task requires.
