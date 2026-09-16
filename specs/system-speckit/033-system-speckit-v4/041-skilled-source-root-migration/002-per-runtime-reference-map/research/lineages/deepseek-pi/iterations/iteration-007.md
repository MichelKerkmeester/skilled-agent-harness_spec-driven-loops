# Iteration 7: Map C — the seven smaller skills and the `.opencode/skills` root files

## Focus

Map C: `mcp-tooling` (185), `sk-design` (108), `sk-vision` (68), `sk-git` (60), `sk-prompt` (55), `mcp-code-mode` (43), `sk-communication` (33), plus the `opencode:skills` area (3 files at the skills root: `README.txt`, `.state/advisor/README.md`, `.state/smart-router-telemetry/README.md`).

## Findings

- **Finding 1 — the seven smaller skills total 552 files and 1,252 matching lines; only 74 of the files are non-markdown.** Their code surfaces are thin and mostly scripts: `sk-vision` 2 TypeScript hooks, `sk-git` 6 scripts/hooks, `mcp-tooling` 7 shell installers, `mcp-code-mode` 3 shell scripts, `sk-design` 5 mixed, and 63 frozen benchmark JSON spread across `sk-vision` (11), `sk-design` (13), `mcp-tooling` (8), `sk-prompt` (6), `sk-git` (2), `sk-communication` (2). **Classification:** `mechanical` 25, `freeze` 41, `regenerate` 7, `manual` 1. **Consequence:** most of the smaller skills can migrate with their docs; the load-bearing exceptions are the `sk-git` hooks and the `sk-vision` hooks, which five runtimes execute.

- **Finding 2 — `sk-git`'s hook scripts are consumed by every runtime through the mirror trees.** `git-preflight-advisory.mjs` (and its Pi/Devin variants) appears as targets of `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/` and `.pi/extensions/` links from iterations 1-2. **Classification:** `mechanical` (script paths) + `regenerate` for the mirrors. **Consequence:** the source of these hooks and the five mirror rows must move in the same change, or every runtime's git advisory silently stops resolving.

- **Finding 3 — `sk-vision`'s runnable surface is referenced from runtime files that are not symlinks.** `.cursor/rules/sk-vision.md:12` runs `.opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js`; `.opencode/plugins/sk-vision.js` (Map A, currently dangling) links its dist plugin. **Classification:** `mechanical` for the rule, `regenerate` for the plugin link (build output), `manual` for the already-broken dist symlink until the build runs. **Consequence:** this skill already demonstrates the build-artifact class: its links are correct only on a machine that has built the vision runtime.

- **Finding 4 — `mcp-tooling` and `mcp-code-mode` contribute install scripts, not runtime code.** The 7 + 3 shell scripts install MCP servers; `.opencode/install-guides/` (Map A) indexes them and `mcp-code-mode-launcher.cjs` lives under `.opencode/bin/` (next iteration). **Classification:** `mechanical` for the scripts, `freeze` for their benchmark reports, `regenerate` for graph metadata. **Consequence:** the launcher row is the chokepoint; these scripts are downstream of it.

- **Finding 5 — 82 of the 168 markdown files in this set are historical (benchmark or changelog) and must not be rewritten.** `sk-vision` 23/54, `sk-design` 19/87, `mcp-tooling` 25/169, `sk-prompt` 16/48, `sk-git` 9/51, `mcp-code-mode` 9/39, `sk-communication` 2/30. **Classification:** `freeze`. **Consequence:** the exclusion list keeps growing across iterations; by the end of Map C it covers roughly 700 files, which is the single strongest argument against a blanket rewrite.

- **Finding 6 — `sk-design` contains the only HTML file in the seed and a hand-authored `.state` path.** Its 5 mechanical code files include a `.cjs` generator and `.ts` scripts; the HTML is a reference artifact. **Classification:** `mechanical`/`manual` per row. **Consequence:** no special handling beyond the general rewrite.

- **Finding 7 — the three `.opencode/skills` root files are documentation with runnable commands.** `.opencode/skills/README.txt` carries 7 matching lines including `python3 .opencode/skills/sk-doc/scripts/...` invocations; `.state/advisor/README.md:21` names `.opencode/bin/skill-advisor.cjs`; `.state/smart-router-telemetry/README.md:75,88` names the telemetry path and documents an existing bug (`resolved as .opencode/skill rather than .opencode/skills`). **Classification:** `mechanical` (path rewrite in docs), `none` for the bug description (it describes a defect, not a path to maintain) — flagged rather than fixed. **Consequence:** the `.state` READMEs are the only place where a rewrite must preserve a deliberately wrong path as evidence.

- **Finding 8 — the counts reconcile exactly with the seed.** 552 skill files + 3 root files = 555; matching lines 1,252 + 11 = 1,263. Cumulative Map C: 3,695 of 4,258 files.

## Row tables

### Map C code rows: skill:mcp-tooling (16 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--live/skill-benchmark-report.json` | `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--live/skill-benchmark-report.json:9` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-tooling"` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--router/skill-benchmark-report.json` | `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--router/skill-benchmark-report.json:9` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-tooling"` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/baseline/skill-benchmark-report.json` | `.opencode/skills/mcp-tooling/benchmark/reports/baseline/skill-benchmark-report.json:9` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-tooling"` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--unspecified/report.json` | `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--unspecified/report.json:4` | 2 | `"compiledEngine": ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs",` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json` | `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` | 1 | `"engineResolverPath": ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs",` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json` | `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` | 6 | `"rootRel": ".opencode/skills/mcp-tooling"` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json` | `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` | 1 | `"engineResolverPath": ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs",` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json` | `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` | 6 | `"rootRel": ".opencode/skills/mcp-tooling"` | historical record: benchmark report data | freeze |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | `.opencode/skills/mcp-tooling/graph-metadata.json:351` | 24 | `".opencode/skills/mcp-tooling/SKILL.md",` | generated: regenerate-skill-derived.cjs | regenerate |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh` | `.opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh:394` | 1 | `echo "  .opencode/install-guides/MCP - Chrome Dev Tools.md"` | source code (authored) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/examples/task-queue-workflow.sh` | `.opencode/skills/mcp-tooling/mcp-click-up/examples/task-queue-workflow.sh:41` | 1 | `error "Install cupt: bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh"` | source code (authored) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/examples/time-tracking-workflow.sh` | `.opencode/skills/mcp-tooling/mcp-click-up/examples/time-tracking-workflow.sh:44` | 1 | `error "cupt not found. Install: bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh"` | source code (authored) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh` | `.opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh:222` | 2 | `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md` | source code (authored) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/examples/safe-connect-daemon-health.sh` | `.opencode/skills/mcp-tooling/mcp-figma/examples/safe-connect-daemon-health.sh:43` | 1 | `log "  bash .opencode/skills/mcp-tooling/mcp-figma/scripts/install.sh"` | source code (authored) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-notion/scripts/install.sh` | `.opencode/skills/mcp-tooling/mcp-notion/scripts/install.sh:183` | 2 | `.opencode/skills/mcp-tooling/mcp-notion/SKILL.md` | source code (authored) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh` | `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh:237` | 2 | `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | source code (authored) | mechanical |
### Map C documentation classes: skill:mcp-tooling (169 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 97 | 0 | 242 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md`; `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/direct-task.md`; `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md` |
| top-level skill doc | 25 | 25 | 37 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/mcp-tooling/README.md`; `.opencode/skills/mcp-tooling/SKILL.md`; `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` |
| historical record (changelog) | 13 | 0 | 37 | freeze | may keep historical paths | `.opencode/skills/mcp-tooling/changelog/v1.0.0.0.md`; `.opencode/skills/mcp-tooling/changelog/v1.5.0.0.md`; `.opencode/skills/mcp-tooling/changelog/v1.6.1.0.md` |
| benchmark material | 12 | 2 | 19 | freeze | recorded measurements from past runs | `.opencode/skills/mcp-tooling/benchmark/README.md`; `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--live/source.md`; `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--router/source.md` |
| other documentation | 12 | 19 | 23 | manual | classify by hand | `.opencode/skills/mcp-tooling/mcp-aside-devtools/INSTALL-GUIDE.md`; `.opencode/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md`; `.opencode/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md` |
| references | 5 | 1 | 5 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md`; `.opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md`; `.opencode/skills/mcp-tooling/mcp-magicpath/references/credential-setup.md` |
| feature catalog | 4 | 0 | 15 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/mcp-tooling/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`; `.opencode/skills/mcp-tooling/feature-catalog/feature-catalog.md`; `.opencode/skills/mcp-tooling/feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md` |
| assets | 1 | 1 | 2 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/mcp-tooling/mcp-magicpath/assets/utcp-magicpath-manual.md` |
### Map C code rows: skill:sk-design (21 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/sk-design/command-metadata.json` | `.opencode/skills/sk-design/command-metadata.json:24` | 9 | `"resource": ".opencode/skills/sk-design/SKILL.md",` | generated: skill metadata build | regenerate |
| `.opencode/skills/sk-design/graph-metadata.json` | `.opencode/skills/sk-design/graph-metadata.json:340` | 2 | `".opencode/skills/sk-design/SKILL.md"` | generated: regenerate-skill-derived.cjs | regenerate |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--create-diagram-command/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--create-diagram-command/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--drawio-import/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--drawio-import/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--editorial-style-and-connectors/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--editorial-style-and-connectors/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--export-guidance/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--export-guidance/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--hub-registration/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--hub-registration/skill-benchmark-report.json:7` | 4 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--mermaid-import/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--mermaid-import/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--onboarding-flow/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--onboarding-flow/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--primitive-variants/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--primitive-variants/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--type-selection-and-routing/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--type-selection-and-routing/skill-benchmark-report.json:7` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0145-sk-doc-sk-create...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-design/sk-design-diagram"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-3/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-3/skill-benchmark-report.json:7` | 2 | `"rootRel": ".opencode/skills/sk-design/sk-design-diagram"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-4/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-4/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-design/sk-design-diagram"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review/skill-benchmark-report.json` | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-design/sk-design-diagram"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/design-md-sample.html` | `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/design-md-sample.html:10` | 1 | `/* DESIGN.md provenance: path=.opencode/skills/sk-design/sk-design-diagram/assets/style-reference/harness-d...` | test fixture (hand-authored data) | manual |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs` | `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs:46` | 1 | `from: '      /* DESIGN.md provenance: path=.opencode/skills/sk-design/sk-design-diagram/assets/style-refere...` | test code | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/cli.ts` | `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/cli.ts:15` | 3 | `*   npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts <url> --output <spec-fol...` | source code (authored) | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts` | `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts:213` | 4 | `npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts <url1> [url2] ...` | source code (authored) | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/output-policy.ts` | `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/output-policy.ts:30` | 1 | `const SPECS_ROOT = path.join(REPO_ROOT, '.opencode', 'specs');` | source code (authored) | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/tests/guided-run.test.ts` | `.opencode/skills/sk-design/sk-design-md-generator/backend/tests/guided-run.test.ts:10` | 6 | `const options = parseGuidedRunArgs(['node', 'guided-run', 'https://example.com', '--output', '.opencode/spe...` | test code | mechanical |
### Map C documentation classes: skill:sk-design (87 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 46 | 2 | 158 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-design/manual-testing-playbook/holdout/flowchart-natural.md`; `.opencode/skills/sk-design/manual-testing-playbook/holdout/ind-flowchart.md`; `.opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md` |
| benchmark material | 18 | 1 | 17 | freeze | recorded measurements from past runs | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--create-diagram-command/source.md`; `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--drawio-import/source.md`; `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--editorial-style-and-connectors/source.md` |
| top-level skill doc | 10 | 34 | 13 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-design/SKILL.md`; `.opencode/skills/sk-design/sk-design-chart/README.md`; `.opencode/skills/sk-design/sk-design-chart/scripts/README.md` |
| references | 7 | 6 | 6 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md`; `.opencode/skills/sk-design/sk-design-diagram/references/design-md-theming.md`; `.opencode/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md` |
| feature catalog | 4 | 0 | 13 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/command-and-hub-integration/design-diagram-command.md`; `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/command-and-hub-integration/hub-registration.md`; `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md` |
| historical record (changelog) | 1 | 0 | 1 | freeze | may keep historical paths | `.opencode/skills/sk-design/sk-design-chart/changelog/v0.23.0.0.md` |
| other documentation | 1 | 5 | 0 | manual | classify by hand | `.opencode/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md` |
### Map C code rows: skill:sk-vision (14 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/skill-benchmark-report.json:7` | 2 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--status-live-run/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--status-live-run/skill-benchmark-report.json:7` | 2 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-017-standalone/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-017-standalone/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-018-cursor-status/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-018-cursor-status/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/skill-benchmark-report.json:7` | 3 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/skill-benchmark-report.json:7` | 3 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/skill-benchmark-report.json:7` | 3 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/skill-benchmark-report.json` | `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/skill-benchmark-report.json:7` | 1 | `"rootRel": ".opencode/skills/sk-vision"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/supersession-manifest.json` | `.opencode/skills/sk-vision/benchmark/reports/supersession-manifest.json:5` | 3 | `"superseded": ".opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-de...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-vision/graph-metadata.json` | `.opencode/skills/sk-vision/graph-metadata.json:57` | 2 | `".opencode/skills/sk-vision/SKILL.md"` | generated: regenerate-skill-derived.cjs | regenerate |
| `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts` | `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts:20` | 5 | `import { RuntimeClient, SkVisionError } from "../../.opencode/skills/sk-vision/vision-runtime/src/runtime/c...` | source code (authored) | mechanical |
| `.opencode/skills/sk-vision/vision-runtime/scripts/build.ts` | `.opencode/skills/sk-vision/vision-runtime/scripts/build.ts:55` | 1 | `// .opencode/plugins/sk-vision.js can symlink into the skill's hooks/ dir,` | source code (authored) | mechanical |
### Map C documentation classes: skill:sk-vision (54 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 23 | 1 | 51 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-vision/manual-testing-playbook/guaranteed-vision/auto-inspect-guarantee.md`; `.opencode/skills/sk-vision/manual-testing-playbook/guaranteed-vision/classifier-and-env.md`; `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/devin-hook.md` |
| benchmark material | 21 | 3 | 21 | freeze | recorded measurements from past runs | `.opencode/skills/sk-vision/benchmark/README.md`; `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/skill-benchmark-report.md`; `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/source.md` |
| top-level skill doc | 3 | 3 | 11 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-vision/README.md`; `.opencode/skills/sk-vision/SKILL.md`; `.opencode/skills/sk-vision/hooks/README.md` |
| feature catalog | 3 | 0 | 4 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-vision/feature-catalog/feature-catalog.md`; `.opencode/skills/sk-vision/feature-catalog/host-adapters/devin-hook.md`; `.opencode/skills/sk-vision/feature-catalog/host-adapters/opencode-plugin.md` |
| historical record (changelog) | 2 | 0 | 31 | freeze | may keep historical paths | `.opencode/skills/sk-vision/changelog/v0.2.0.0.md`; `.opencode/skills/sk-vision/changelog/v0.3.0.0.md` |
| other documentation | 2 | 1 | 1 | manual | classify by hand | `.opencode/skills/sk-vision/hooks/cursor/vision-rule.md`; `.opencode/skills/sk-vision/hooks/devin/vision-rule.md` |
### Map C code rows: skill:sk-git (9 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--glm-5-2-high/skill-benchmark-report.json` | `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--glm-5-2-high/skill-benchmark-report.json:9` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--kimi-2-7/skill-benchmark-report.json` | `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--kimi-2-7/skill-benchmark-report.json:9` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-git/graph-metadata.json` | `.opencode/skills/sk-git/graph-metadata.json:156` | 18 | `".opencode/skills/sk-git/SKILL.md",` | generated: regenerate-skill-derived.cjs | regenerate |
| `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:112` | 1 | `const rules = readHardRules(path.join(projectDir, '.opencode', 'skills', 'sk-git', 'SKILL.md'))` | source code (authored) | mechanical |
| `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs` | `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs:83` | 1 | `const skillDir = path.join(dir, '.opencode', 'skills', 'sk-git');` | test code | mechanical |
| `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts:7` | 5 | `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";` | source code (authored) | mechanical |
| `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs` | `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs:105` | 1 | `const rules = readHardRules(path.join(repo, '.opencode', 'skills', 'sk-git', 'SKILL.md'))` | source code (authored) | mechanical |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | `.opencode/skills/sk-git/scripts/worktree-naming.sh:145` | 2 | `echo "$top/.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt"` | source code (authored) | mechanical |
| `.opencode/skills/sk-git/scripts/worktree-provision-paths.txt` | `.opencode/skills/sk-git/scripts/worktree-provision-paths.txt:16` | 8 | `.opencode` | source code (authored) | mechanical |
### Map C documentation classes: skill:sk-git (51 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 14 | 0 | 22 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md`; `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/scope-inference-skill-folder.md`; `.opencode/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` |
| feature catalog | 11 | 0 | 44 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-git/feature-catalog/feature-catalog.md`; `.opencode/skills/sk-git/feature-catalog/remote-platform-integration/github-mcp-integration.md`; `.opencode/skills/sk-git/feature-catalog/remote-platform-integration/gitkraken-mcp-integration.md` |
| references | 8 | 40 | 13 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/sk-git/references/continuous-integration.md`; `.opencode/skills/sk-git/references/finish-workflows.md`; `.opencode/skills/sk-git/references/large-reorg-playbook.md` |
| historical record (changelog) | 7 | 0 | 16 | freeze | may keep historical paths | `.opencode/skills/sk-git/changelog/v1.0.2.1.md`; `.opencode/skills/sk-git/changelog/v1.0.8.0.md`; `.opencode/skills/sk-git/changelog/v1.0.9.0.md` |
| top-level skill doc | 6 | 21 | 22 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-git/README.md`; `.opencode/skills/sk-git/SKILL.md`; `.opencode/skills/sk-git/scripts/README.md` |
| assets | 2 | 6 | 0 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/sk-git/assets/commit-message-template.md`; `.opencode/skills/sk-git/assets/worktree-checklist.md` |
| benchmark material | 2 | 0 | 2 | freeze | recorded measurements from past runs | `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--glm-5-2-high/source.md`; `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--kimi-2-7/source.md` |
| test documentation/fixtures | 1 | 1 | 0 | mechanical | test-owned content; rewrite or regenerate | `.opencode/skills/sk-git/scripts/tests/README.md` |
### Map C code rows: skill:sk-prompt (7 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json` | `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:9` | 1 | `"root": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/promp...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json` | `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json:7` | 4 | `"method": "Enumerated every scenario under .opencode/skills/sk-prompt/manual-testing-playbook/ (root manual...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json` | `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` | 1 | `"engineResolverPath": ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs",` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json` | `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` | 6 | `"rootRel": ".opencode/skills/sk-prompt"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json` | `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` | 1 | `"engineResolverPath": ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs",` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json` | `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` | 6 | `"rootRel": ".opencode/skills/sk-prompt"` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-prompt/graph-metadata.json` | `.opencode/skills/sk-prompt/graph-metadata.json:102` | 10 | `".opencode/skills/sk-prompt/SKILL.md",` | generated: regenerate-skill-derived.cjs | regenerate |
### Map C documentation classes: skill:sk-prompt (48 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 29 | 0 | 33 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/clear-five-dimensions.md`; `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/dimension-drilldown-rationale.md`; `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/dimension-floors-block.md` |
| historical record (changelog) | 9 | 0 | 22 | freeze | may keep historical paths | `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md`; `.opencode/skills/sk-prompt/changelog/v1.2.0.0.md`; `.opencode/skills/sk-prompt/changelog/v1.4.0.0.md` |
| benchmark material | 7 | 0 | 11 | freeze | recorded measurements from past runs | `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-mode-a--router/source.md`; `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md`; `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md` |
| top-level skill doc | 2 | 1 | 2 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-prompt/README.md`; `.opencode/skills/sk-prompt/SKILL.md` |
| assets | 1 | 1 | 1 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md` |
### Map C code rows: skill:mcp-code-mode (4 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/mcp-code-mode/graph-metadata.json` | `.opencode/skills/mcp-code-mode/graph-metadata.json:76` | 12 | `".opencode/skills/mcp-code-mode/SKILL.md",` | generated: regenerate-skill-derived.cjs | regenerate |
| `.opencode/skills/mcp-code-mode/scripts/doctor.sh` | `.opencode/skills/mcp-code-mode/scripts/doctor.sh:9` | 1 | `# Usage: bash .opencode/skills/mcp-code-mode/scripts/doctor.sh [--strict]` | source code (authored) | mechanical |
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | `.opencode/skills/mcp-code-mode/scripts/install.sh:58` | 8 | `5. Verifies the embedded MCP server at .opencode/skills/mcp-code-mode/` | source code (authored) | mechanical |
| `.opencode/skills/mcp-code-mode/scripts/update.sh` | `.opencode/skills/mcp-code-mode/scripts/update.sh:110` | 1 | `echo "  .opencode/skills/mcp-code-mode/assets/config-template.md" >&2` | source code (authored) | mechanical |
### Map C documentation classes: skill:mcp-code-mode (39 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 25 | 12 | 41 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/chrome-navigate-screenshot.md`; `.opencode/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/sibling-pair-handover.md`; `.opencode/skills/mcp-code-mode/manual-testing-playbook/core-tools/call-tool-chain-execution.md` |
| historical record (changelog) | 9 | 0 | 31 | freeze | may keep historical paths | `.opencode/skills/mcp-code-mode/changelog/v1.0.0.0.md`; `.opencode/skills/mcp-code-mode/changelog/v1.0.0.31.md`; `.opencode/skills/mcp-code-mode/changelog/v1.0.1.0.md` |
| top-level skill doc | 3 | 2 | 7 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/mcp-code-mode/README.md`; `.opencode/skills/mcp-code-mode/SKILL.md`; `.opencode/skills/mcp-code-mode/scripts/README.md` |
| other documentation | 1 | 2 | 2 | manual | classify by hand | `.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md` |
| references | 1 | 2 | 0 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/mcp-code-mode/references/tool-catalog.md` |
### Map C code rows: skill:sk-communication (3 non-markdown files)

| file | line | matching lines | first matching construct (truncated) | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/sk-communication/benchmark/reply-harness/cases.json` | `.opencode/skills/sk-communication/benchmark/reply-harness/cases.json:18` | 3 | `"operatorPrompt": "Review the function parseDescription in .opencode/skills/sk-doc/sk-create-repo-rule/scri...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-communication/benchmark/reports/advisor-routing-smoke-2026-08-12.json` | `.opencode/skills/sk-communication/benchmark/reports/advisor-routing-smoke-2026-08-12.json:5` | 1 | `"reproduce": "python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py \"make CLI ...` | historical record: benchmark report data | freeze |
| `.opencode/skills/sk-communication/graph-metadata.json` | `.opencode/skills/sk-communication/graph-metadata.json:92` | 2 | `".opencode/skills/sk-communication/SKILL.md"` | generated: regenerate-skill-derived.cjs | regenerate |
### Map C documentation classes: skill:sk-communication (30 markdown files)

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| feature catalog | 13 | 0 | 89 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-communication/feature-catalog/assembly-and-context/bounded-context-selection.md`; `.opencode/skills/sk-communication/feature-catalog/assembly-and-context/generation-keyed-message-assembly.md`; `.opencode/skills/sk-communication/feature-catalog/evaluation-and-observability/blind-non-inferiority-evaluation.md` |
| manual testing playbook | 11 | 0 | 57 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-communication/manual-testing-playbook/advisor-routing/advisor-routes-projection-request.md`; `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/claim-omission-and-no-op.md`; `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/exact-original-fidelity-fallback.md` |
| top-level skill doc | 2 | 4 | 9 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-communication/README.md`; `.opencode/skills/sk-communication/SKILL.md` |
| other documentation | 2 | 0 | 4 | manual | classify by hand | `.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md`; `.opencode/skills/sk-communication/cli-communication-projection/docs/rollback.md` |
| benchmark material | 1 | 1 | 1 | freeze | recorded measurements from past runs | `.opencode/skills/sk-communication/benchmark/README.md` |
| historical record (changelog) | 1 | 0 | 3 | freeze | may keep historical paths | `.opencode/skills/sk-communication/changelog/v1.0.0.0.md` |

### `.opencode/skills` root files (area `opencode:skills`, 3 files, 11 matching lines)

| file | line | matching lines | what the reference does | origin | class |
|---|---|---:|---|---|---|
| `.opencode/skills/README.txt` | `.opencode/skills/README.txt:31` | 7 | documents the skill library and gives runnable `python3 .opencode/skills/...` commands | authored catalog | mechanical |
| `.opencode/skills/.state/advisor/README.md` | `.opencode/skills/.state/advisor/README.md:21` | 1 | documents the advisor state folder and the `.opencode/bin/skill-advisor.cjs` spawn path | authored state doc | mechanical |
| `.opencode/skills/.state/smart-router-telemetry/README.md` | `.opencode/skills/.state/smart-router-telemetry/README.md:75` | 3 | documents the telemetry path (L75) and records a live bug where the matcher resolves `.opencode/skill` (L88) | authored state doc | mechanical (L75); none for the bug record (L88) |

## Reconciliation against the seed

| Area | Seed files | Seed lines | Code rows | Doc files (grouped) | Unmapped |
|---|---:|---:|---:|---:|---|
| `mcp-tooling` | 185 | 481 | 16 | 169 | none |
| `sk-design` | 108 | 300 | 21 | 87 | none |
| `sk-vision` | 68 | 156 | 14 | 54 | none |
| `sk-git` | 60 | 225 | 9 | 51 | none |
| `sk-prompt` | 55 | 100 | 7 | 48 | none |
| `mcp-code-mode` | 43 | 121 | 4 | 39 | none |
| `sk-communication` | 33 | 174 | 3 | 30 | none |
| `opencode:skills` | 3 | 11 | 3 | 0 | none |
| **Subtotal** | **555** | **1,568** | **77** | **478** | **none** |

Cumulative Map C: 3,695 of 4,258 files. Remaining: `.opencode` runtime areas — commands 148, agents 13, hooks 54, plugins 30, bin 29, scripts 25, install-guides 2, logs 1, package-lock 1 — plus `root` 8 and `ci` 21 = 332 files.

## What worked

- The same per-file code extraction scaled down to the small skills without adjustment.
- Cross-referencing the `sk-git` rows against the Map A hook mirrors found the same files from two directions, which is the cross-check the reconciliation wants.

## What failed

- Nothing material; the doc-class rules needed no changes for this set.

## UNKNOWNs opened

- Whether `.opencode/skills/.state/**` files are tracked state or examples. The seed lists only their READMEs as tracked, and the folder is a runtime state home; the two READMEs are documentation, so the rewrite is safe, but the answer would matter if more of `.state` is tracked later. UNKNOWN.

## Assessment
