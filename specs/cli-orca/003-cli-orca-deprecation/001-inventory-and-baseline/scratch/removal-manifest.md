# cli-orca removal manifest

Built 2026-11-24 in worktree `worktrees/534-deprecate-cli-orca` from:

```bash
rg -n -i "cli-orca|\borca\b" --hidden -g '!specs/**' -g '!.git/**' -g '!node_modules/**' \
  -g '!.skilled/skills/cli-orca/**' -g '!.skilled/changelog/cli-orca/**' \
  -g '!.claude/skills/**' -g '!.opencode/skills/**' .
```

`.claude/skills` and `.opencode/skills` are symlinks to `.skilled/skills`, so they are excluded to avoid double counting. A bare substring search (`orca` with no word boundary) adds about 30 more files. Every one of those is a false positive such as `priorCandidates`, `advisorCache` or `snapshotForCard`.

## 1. Delete (phase 003)

| Path | Tracked | Note |
|------|---------|------|
| `.skilled/skills/cli-orca/` | 59 files, 12 of them in `changelog/` | The skill itself |
| `.skilled/changelog/cli-orca` | yes, symlink to `../skills/cli-orca/changelog` | Per-skill changelog link, removed by operator decision |
| `.vibe/skills/cli-orca` | yes, symlink | Runtime mirror |
| `.dsh/skills/cli-orca` | yes, symlink | Runtime mirror |

## 2. Edit, runtime code and tests (phase 002)

| Path | Change |
|------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:321-322` | Comment uses cli-orca as the example of a cli skill named by its tool. Replace the example with a surviving cli skill |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts:60-67` | Synthetic `cli-orca` projection. Replace with a surviving cli skill and its tool name |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts:53` | Name list includes `cli-orca`. Drop it |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:45` | Class map entry. Drop it |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerate with `test_readme_manifest.py --write` |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Regenerate with `test_readme_verdict_parity.py --write` |

## 3. Edit, docs and registries (phase 003)

| Path | Change |
|------|--------|
| `README.md:31` | Skill count and "and Orca" |
| `README.md:311` | cli-orca entry |
| `.skilled/skills/README.txt:47` | cli-orca row |
| `.skilled/skills/sk-git/graph-metadata.json:21-23` | Edge to cli-orca |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json:38-40` | Edge to cli-orca |
| `.skilled/skills/mcp-tooling/graph-metadata.json:28-30` | Edge to cli-orca |
| `.skilled/skills/mcp-tooling/SKILL.md:41` | Boundary sentence |
| `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md:28` | Boundary sentence |
| `.skilled/skills/mcp-tooling/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:44-46` | Former Orca boundary section |
| `.skilled/skills/mcp-tooling/feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md:36` | Orca mention |
| `.skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:62,71,82` | Orca boundary lines |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:56` | Class S list, 6 becomes 5 |

## 4. Regenerate (phase 004)

| Artifact | Tool |
|----------|------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | `skill_graph_compiler.py --export-json` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | `generate-trigger-index.mjs` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/*.json` | Their own refresh path, only if a fixture test fails after the index rebuild |

## 5. Keep, with reason

| Path | Reason |
|------|--------|
| `.skilled/changelog/skilled/v4.0.0.0.md`, `v4.0.1.0.md` | Released global changelog |
| `.skilled/skills/mcp-tooling/changelog/v1.7.0.0.md`, `v1.8.0.0.md` | Released skill changelog |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.23.0.md` | Released skill changelog |
| `.pi/extensions/pi-cache-optimizer/index.ts`, `README.md` | `openorca` is a model family name, not the skill |
| `.skilled/bin/tests/sync-claude-user-hooks.test.cjs:39` | Third-party hook path fixture, `/opt/orca/notify.js` |
| `.skilled/hooks/decision-capture/**` fixtures and tests | Recorded transcript labels |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md:246` | A captured process list showing the Orca app |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/question-screens/*.txt` | Captured screens that show the operator's Orca app hooks, not the skill |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` rows live-02, live-09, live-16 | A labelled evaluation set. Each row carries a `commit` and is read at that commit through `git show`, so deleting the working-tree files does not break it |
| `specs/**` | History, including `specs/cli-orca/001` and `002` |

Out of git: the Orca desktop app and `~/.orca/` stay. Removing the skill does not touch the app.
