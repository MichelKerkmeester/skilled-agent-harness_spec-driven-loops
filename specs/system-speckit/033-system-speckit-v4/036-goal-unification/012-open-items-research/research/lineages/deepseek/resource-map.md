---
title: "Resource Map: the goal items left open (deepseek lineage)"
description: "Evidence-derived inventory of the surfaces this lineage read, with the ring that touched each one."
trigger_phrases:
  - "goal open items resources"
  - "goal doc contract surfaces"
importance_tier: normal
contextType: research
---

# Resource Map: the goal items left open (deepseek lineage)

Derived from the iteration sources-read lists. Paths are repository-relative; historical records
(read as evidence, never as live assertions) are grouped at the end.

## Live goal-document surfaces

| Path | Ring | Role |
|---|---|---|
| `README.md:859-866` | 3, 4 | The root README goal section — the ring 3 subject |
| `.opencode/hooks/goal/README.md` | 1, 2, 4 | Engine contract; carries the naming-hazard note (19-22) and the runtime matrix (78-84) |
| `.opencode/hooks/goal/goal-plugin.md` | 1, 2, 5 | Plugin contract and env table |
| `.opencode/hooks/README.md` | 1, 2, 3 | Hook hub; declared coverage authority (224, 234) |
| `.opencode/hooks/coverage-rationale.md` | 2 | The why behind the support story |
| `.opencode/hooks/injection-contract.md` | 1, 2, 3 | Cadence half of the support story |
| `.opencode/skills/.state/goal/README.md` | 1, 2 | State-directory README describing two engines' key schemes |
| `.opencode/plugins/README.md` | 1, 2 | Plugin roster; goal kill-switch exception |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | 1 | Operator playbook |
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | 1 | Goal template (budget banner) |
| `specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md` | 1 | Parent durable directive |

## Flag and environment surfaces

| Path | Ring | Role |
|---|---|---|
| `.opencode/hooks/shared/hook-flags.cjs:51-52` | 2, 5 | Canonical name and alias authority |
| `.opencode/hooks/shared/hook-flags.test.cjs` | 2, 5 | Pins the concern's canonical name |
| `.opencode/hooks/hook-flags.env.example`, `.env.example:224,291-292,305-306` | 2, 5 | Roster copies; RUNTIME_LABEL's only home |
| `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | 2 | Roster copy |
| `.opencode/hooks/goal/bin/goal.cjs:391` | 2 | The only RUNTIME_LABEL reader |
| `.opencode/plugins/opencode-goal.js:36-37,49-51,78-80,245-247` | 2, 5 | Plugin state dir; three undocumented env names |

## Contract tests and runners

| Path | Ring | Role |
|---|---|---|
| `.opencode/plugins/tests/goal-doc-contract.test.cjs` | 3, 5 | The contract test ring 3 extends |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | 2 | The offer contract test |
| `.opencode/plugins/tests/README.md:40` | 2 | Its documented owner line |
| `.opencode/scripts/run-node-tests.mjs:20-23` | 2, 5 | Discovery roots; advisory-lane runner |
| `.github/workflows/spec-kit-check.yml` | 5 | The blocking lane ring 5 recommends |
| `.github/workflows/advisory-checks.yml`, `.github/workflows/markdown-link-integrity.yml` | 3, 5 | Advisory node tests; link integrity |

## Retrieval surfaces

| Path | Ring | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:14-31` | 3 | Roots and the deliberate root-README exclusion |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:282` | 3 | The written reason for the exclusion |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` | 3 | Checked: 14,809 paths, zero root README entries |

## The manifest machinery

| Path | Ring | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep-review-auto.yaml:373-375` | 2, 4, 5 | The full-validation parser |
| `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` | 2, 4, 5 | The trackedness checker, packet-resident |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:14-17` | 2, 4 | Spawns the checker three times |
| 6 × `specs/**/goal-file-manifest.txt` | 2, 4 | The manifests (sk-design 012, sk-doc 016 and 019, deep-loop 036, speckit 003 and 004) |
| `specs/system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/001-completion-evidence-reconcile/{spec,plan,tasks}.md` | 4 | Active prose that names the checker |
| `specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/goal-file-manifest.txt` | 2 | Records hand-reconciled drift (10 MOVED, 16 deleted) |

## Runtime surfaces

| Path | Ring | Role |
|---|---|---|
| `.opencode/commands/goal-opencode.md:7` | 3 | OpenCode goal command |
| `.opencode/hooks/goal/pi/goal-context.ts:181` | 3 | `registerCommand("goal-pi")` |
| `.cursor/hooks.json` | 3 | Cursor cadence (sessionStart only) |
| `.devin/hooks.v1.json:2,39` | 3 | Devin cadence (SessionStart + UserPromptSubmit) |
| `.opencode/skills/mcp-tooling/mcp-click-up/feature-catalog/mcp-medium-priority/manage-goals.md:19` | 4 | ClickUp goals card, self-declared UNSUPPORTED |

## Style and measurement references

| Path | Ring | Role |
|---|---|---|
| `.opencode/skills/sk-code/sk-code-opencode/references/typescript/style-guide/formatting-imports-and-coexistence.md:77` | 1 | Code 100-character maximum |
| `.opencode/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md:278` | 1 | Code 100-character maximum |
| `.opencode/skills/sk-code/sk-code-opencode/references/python/style-guide.md:447` | 1 | Code target 88-100 |
| `.opencode/plugins/*.js`, `.opencode/hooks/goal/**` | 1, 5 | Measured line-length distribution; env-name reads |

## Historical records (read as evidence; never rewritten or checked)

- `specs/**/review/lineages/**`, `specs/**/research/lineages/**` — prior review and research state
- `specs/sk-doc/020-hyphen-naming-convention/.../census/symlink-mode-manifest.json` — recorded citation
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.md` — cites two paths that have moved
- `specs/system-speckit/033-system-speckit-v4/032-recorded-findings-closure/016-cross-session-operator-items/*` — cross-session operator item records
- `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/012-pre-existing-test-repair/tasks.md` — repair record
