# Baseline: routing gates before any edit

Recorded 2026-10-28 on `worktrees/254-skill-routing-and-clarity` at `bd8f7e946d`, after the rebase onto `origin/main` and before the first edit. Every gate was run from the worktree root. The exit status is the process exit code, read together with the last line of output.

This file is the "before" record that `tasks.md` T002 and T004 name. `after.md` holds the rerun.

## 1. Gates

| Gate | Command | Exit | Result line |
|------|---------|------|-------------|
| parent-skill-check, cli-classifier | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, cli-external-orchestration | same, that hub | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, mcp-tooling | same, that hub | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, sk-code | same, that hub | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, sk-design | same, that hub | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, sk-doc | same, that hub | 0 | all hard invariants passed, 0 warnings |
| parent-skill-check, system-deep-loop | same, that hub | 0 | all hard invariants passed, 0 warnings |
| verify-router-sync | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | 0 | `router-sync: 5/5 checks passed` |
| compiled-route-guard | `node .skilled/bin/compiled-route-guard.cjs --json` | 0 | 7 hubs `fresh`, `"failures": 0` |
| package_skill --strict, all 14 roots | `/usr/bin/python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/<root> --check --strict` | 0 x 14 | `Result: PASS` x 14 |
| check-rule-copies | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | 0 | `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s))` |
| router reach (the doctor router-reach workflow's script) | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | 0 | `checked=7 hub(s), wrong-hub=0, outranked=0, no-reach=0, allowed=3, probe-error=0, operator-local=0`, `RESULT: PASSED` |
| Hermes mirror | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | 0 | `PASS: 67 Hermes skill copies in sync` |
| sk-code setup battery | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | 0 | `STATUS=OK legs=9` |
| skill-root metadata | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | 0 | `checked=14 passed=14 failed=0 fixed=0` |
| leaf-manifest freshness | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | 0 | `checked=14 fresh=14 failed=0` |
| router-sync and router-replay tests | `node --test` over the eight files below | 0 | `tests 40, pass 40, fail 0` |
| capture-scorer-eval-baseline.mjs | `capture-scorer-eval-baseline.mjs` | Not recorded | Full corpus 155/195, holdout 49/66, ambiguity 19/24 |
| spec validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity --recursive --strict` | 0 | `RESULT: PASSED` for all 12 folders, `Errors: 0 Warnings: 0` each |

The router-sync and router-replay test set, named here so the rerun uses the same files:

- `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`
- `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs`
- `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs`
- `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs`

Router reach per hub (declared multi-word phrases probed against the live advisor): cli-classifier 27, cli-external-orchestration 58, mcp-tooling 75, sk-code 70, sk-design 76, sk-doc 184 (2 allowed), system-deep-loop 20 (1 allowed). This answers research open question 3: every probed phrase reaches its hub today.

## 2. Drift recounts

These were **unconfirmed** in the research. Both are now counted by script and recorded as fixtures for phase 004.

### Stage-one terms with no stage-two intent

Method: for each mode, the union of its `hub-router.json` `vocabularyClasses` keywords, minus the union of the `ROUTER.md` `INTENT_SIGNALS` keywords whose `RESOURCE_MAP` paths sit in that mode's packet. Exact, case-folded string match.

| Hub | Mode | Stage-one terms | Stage-two terms | Stage-one terms missing from stage two |
|-----|------|-----------------|-----------------|----------------------------------------|
| mcp-tooling | mcp-chrome-devtools | 15 | 11 | 5 |
| mcp-tooling | mcp-click-up | 22 | 11 | 11 |
| mcp-tooling | mcp-obsidian | 41 | 13 | 29 |
| mcp-tooling | mcp-aside-devtools | 15 | 11 | 4 |
| mcp-tooling | mcp-notion | 15 | 14 | 1 |
| mcp-tooling | mcp-figma | 15 | 11 | 4 |
| mcp-tooling | mcp-refero | 13 | 8 | 5 |
| mcp-tooling | mcp-mobbin | 14 | 9 | 5 |
| mcp-tooling | mcp-magicpath | 6 | 6 | 0 |
| mcp-tooling | **total** | | | **64** |
| cli-external-orchestration | cli-opencode | 16 | 10 | 8 |
| cli-external-orchestration | cli-claude-code | 12 | 11 | 2 |
| cli-external-orchestration | cli-codex | 11 | 11 | 1 |
| cli-external-orchestration | cli-cursor | 11 | 10 | 5 |
| cli-external-orchestration | cli-devin | 13 | 11 | 7 |
| cli-external-orchestration | cli-pi | 12 | 9 | 8 |
| cli-external-orchestration | cli-hermes | 15 | 10 | 5 |
| cli-external-orchestration | **total** | | | **36** |

The mcp-obsidian gap of 29 includes the two terms the research confirmed (`health`, `health-md`). The rest are the Health.md, Iconic, Excalidraw and theme sub-surface terms (for example `apple health`, `iconic rulebook`, `excalidraw`, `minimal theme`). Many of the other gaps are packet-name aliases such as `mcp-click-up` and `cli codex`. Folding these into one vocabulary is phase 004's work.

### sk-doc `Keyword triggers:` terms missing from `hub-router.json`

Method: every backticked term on a packet's `Keyword triggers:` line, against all `hub-router.json` `vocabularyClasses` keywords, case-folded. 11 of the 14 packets carry such a line.

Result: **17 terms**, which confirms the lineage's count of 17. They are 11 slash commands (`/create:agent`, `/create:changelog`, `/create:command`, `/create:feature-catalog`, `/create:goal`, `/create:manual-testing-playbook`, `/doc:quality`, `/create:readme`, `/create:repo-rule`, `/create:skill`, `/create:skill-parent`), the five sk-create-diff terms (`document before/after review`, `before/after document diff`, `review document edits`, `docx diff`, `pdf diff`) and `behavior_benchmark` from sk-create-benchmark. Against `mode-registry.json` aliases instead, 36 terms are missing.
