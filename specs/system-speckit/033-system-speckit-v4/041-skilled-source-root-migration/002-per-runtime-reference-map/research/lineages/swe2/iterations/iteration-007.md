# Iteration 7 — Map C: `system-skill-advisor` (306) + `sk-code` (282) + `sk-doc` (280)

**Run:** 7 | **Focus:** Map C for three skill areas — advisor (heaviest code surface after spec-kit), sk-code (doc hub + four surface packets), sk-doc (doc-authoring hub + python lib). Full tables in `working/map-c--skill_{system-skill-advisor,sk-code,sk-doc}--*.md`; reproduced below.

## Reconciliation

| area | files | seed | classes |
|---|---|---|---|
| skill:system-skill-advisor | 306 | 306 ✓ | mech ~290 / freeze ~15 / manual 1 |
| skill:sk-code | 282 | 282 ✓ | mech ~246 / freeze ~36 |
| skill:sk-doc | 280 | 280 ✓ | mech ~215 / freeze ~65 |
| **iter total** | **868** | **868** ✓ | mechanical 751 · freeze 116 · manual 1 |

Cumulative Map C: **3140 / 4258**.

## Key findings

1. **`runtime/lib/utils/workspace-root.ts`** is the advisor's repo-root discovery — same sentinel family as spec-kit's `folder-detector.ts`. `manual`. Its twin test (`tests/utils/workspace-root.vitest.ts`) follows the emitted path → `mechanical`.
2. **Advisor hooks** (`hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`) carry `.opencode/bin/skill-advisor.cjs` invocation constants — `mechanical` path rewrites; the hook *registrations* that call them were already mapped in B.
3. **~120 advisor code files** (runtime lib/handlers/schemas/tools, hooks, stress-test) are constant-carriers — `mechanical`. Notable: `runtime/tests/migration-lineage-identity.vitest.ts` and `rename-invariants.vitest.ts` assert migration/rename invariants — mechanical but worth a look at cutover.
4. **sk-code is ~95% docs**: 6 surface packets (`sk-code-opencode` 47, `sk-code-webflow` 46, `sk-code-obsidian` 34, `sk-code-mobile-cli` 30, `sk-code-review` 27, `sk-code-quality` 12) + playbook 27 + catalog — all `mechanical`; 36 benchmark files `freeze`.
5. **sk-doc**: 15 `sk-create-*` leaf docs (`mechanical`); python lib (`shared py` 10, `tests py` 13) constant-carriers `mechanical`; `sk-create-skill` (42) incl. `generate-leaf-manifest.cjs` — the leaf-manifest generator's own `.opencode` refs are source constants `mechanical`.
6. No `blocker`, no `none`-only rows needing special handling; `regenerate` zero in this iteration.

## Ruled out

- Advisor `hooks/` md files (9) — hook docs, `mechanical` (registrations are in Map B already).
- `scorer/` test files — mechanical assertions, not the frozen cache (that's deep-loop's scorer, iter-6).

## Full tables — skill:system-skill-advisor

## skill:system-skill-advisor / ARCHITECTURE.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | :21,44,103,121,133 | documentation (1 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / INSTALL-GUIDE.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/INSTALL-GUIDE.md` | :10,19,25,43,54,63,64,70 (+49) | documentation (39 fenced (runnable); 18 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/README.md` | :42,61,69,77,89,90,123,193 (+4) | documentation (5 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/SKILL.md` | :86,297,301,310,338,342,351,423 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / changelog — 10 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/changelog/v0.1.0.md` | :8,65,66,67,68,69,70,71 (+7) | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.10.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.2.0.md` | :98 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.3.0.md` | :3,46,47 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.4.0.md` | :21,22,23,24,39 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.5.0.md` | :15,26,45 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.6.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.7.0.md` | :1,3,31,35,40 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.8.0.md` | :3,36 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/system-skill-advisor/changelog/v0.9.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
## skill:system-skill-advisor / feature-catalog — 39 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/anti-stuffing.md` | :40,46 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/derived-extraction.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/df-idf-corpus.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/doc-frontmatter-harvest.md` | :34,35,36,37,38,39,40,41 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/provenance-and-trust-lanes.md` | :48,49,50,51,52,53,59,60 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/sanitizer.md` | :41,42,43,49,50 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/sync.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md` | :26,38,39,40,41,42,43,49 (+3) | documentation (11 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | :33,43,44,45,46,47,53,54 (+2) | documentation (10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` | :39,40,41,42,43,49 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-validate.md` | :72,73,74,75,81,82,83 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/compat-entrypoint.md` | :46,47,53,54 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md` | :18,30,44,48 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/skill-graph-scan.md` | :21 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/cache-invalidation.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/generation.md` | :34,35,36,42 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lease.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lifecycle.md` | :36,37,38,44,45,46 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/rebuild-from-source.md` | :24,34,35,41 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/trust-state.md` | :43,44,50 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/watcher.md` | :24,34,35,41 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/feature-catalog.md` | :16 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md` | :36,37,44 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md` | :29,57,58,59,60,66,67,68 (+6) | documentation (14 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md` | :24,34,35,36,42,43 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/age-haircut.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/archive-handling.md` | :38,39,45 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/rollback.md` | :34,35,36,42 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/schema-migration.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/supersession.md` | :34,35,41,42 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/python-compat/bench-runner.md` | :34,35 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/python-compat/cli-shim.md` | :43,44,45,51,52,53 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/python-compat/regression-suite.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md` | :34,35,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/ambiguity.md` | :40,41,47 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/attribution.md` | :37,38,39,40,46,47 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/five-lane-fusion.md` | :52,53,54,55,56,57,58,59 (+2) | documentation (10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/projection.md` | :42,43,44,45,46,47,48,54 (+2) | documentation (10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md` | :34,35,36,37,43,44 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | :104,105,106,107,108,109,110,111 (+5) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:system-skill-advisor / hooks — 9 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/hooks/claude/README.md` | :3,19,39,44,87 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` | :18 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | :47 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/lib/README.md` | :12,26,32 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | :173 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/pi/README.md` | :23 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | :48 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md` | :42,43,50,51,52,53,54,55 (+20) | documentation (15 fenced (runnable); 13 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | :23,27,53,58,60,68,88,98 (+11) | documentation (10 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / manual-testing-playbook — 48 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/anti-stuffing.md` | :49,76 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md` | :48,49,50,107,108,109,110,111 (+29) | documentation (35 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/derived-extraction.md` | :48,49,55,62,63,90 | documentation (5 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/doc-frontmatter-harvest.md` | :36,47,53,56,57,82,111,114 (+7) | documentation (10 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md` | :50,77,151,152,153,154,155,156 (+13) | documentation (17 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/sanitizer-boundaries.md` | :48,141,156 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md` | :51,132,133 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/generation-publication.md` | :48,54,61,116,122,127,136 | documentation (5 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/lease-single-writer.md` | :50,95 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/rebuild-from-source.md` | :55,61,67,93,99,102,123 | documentation (5 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md` | :30,37,51,54,57,63,69,96 | documentation (4 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md` | :49,55,64,85 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | :36,37,48,49,55,56,57,58 (+29) | documentation (24 fenced (runnable); 13 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md` | :37,38,47,48,54,61,69,84 (+9) | documentation (10 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/skill-advisor-cli-fallback.md` | :21,47,50,51,52,94 | documentation (4 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md` | :44,50,77,78,96 | documentation (3 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/force-local-force-native.md` | :45,51,57,78,98,125,144 | documentation (6 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | :48,56,62,68,90,91,92 | documentation (4 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/python-shim-stdin.md` | :45,51,73,74,92,136 | documentation (4 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/age-haircut.md` | :48,49,77,95,96,97,98,99 (+14) | documentation (19 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/archive-handling.md` | :46,49,75 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md` | :67,72,87,117 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/schema-migration.md` | :47,53,81 | documentation (2 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/supersession.md` | :48,76,95,105,109,113,117,121 (+15) | documentation (22 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | :63,88,294,298,299,300,301 | documentation (1 fenced (runnable); 6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/advisor-status-rebuild-separation.md` | :55,56,62,63,69,75,81,82 | documentation (8 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/ambiguous-brief-rendering.md` | :49,55,64,85,86 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/lifecycle-redirect-metadata.md` | :47,53,77,78 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-recommend-happy-path.md` | :39,49,92,93 | documentation (1 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md` | :47,50,73,74 | documentation (1 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-validate-slices.md` | :47,55,91,92,93,123,298 | documentation (4 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/shadow-delta-sink.md` | :46,54,62,84,85,116,122,128 (+3) | documentation (9 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/skill-graph-query.md` | :113,114,115,116 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/skill-graph-status.md` | :78,79,80 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/skill-graph-validate.md` | :75,76,77,78 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md` | :46,54,55,76,77,121,124,127 (+9) | documentation (10 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/quarantined-daemon.md` | :49,75,76,119 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/unavailable-daemon.md` | :47,54,55,59,80,81,129 | documentation (4 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/bench-runner.md` | :45,46,81,99,100,110,164 | documentation (6 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/force-native-force-local.md` | :45,51,57,82,100,116,160 | documentation (6 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/regression-suite.md` | :45,46,75,96,98,100,101,107 (+2) | documentation (9 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/stdin-mode.md` | :45,73,146,190 | documentation (3 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/threshold-flag.md` | :45,51,57,84,102,138,174 | documentation (6 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md` | :49,99 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ambiguity.md` | :49,78 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md` | :49,55,83 | documentation (2 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md` | :49,206,207 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/projection.md` | :50,58,64,95,96,97,98 | documentation (3 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / references — 10 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/references/config/db-path-policy.md` | :47,53,92 | documentation (2 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/decisions/deferred-decisions.md` | :54,55,57,67,69,70,100,104 (+6) | documentation (1 fenced (runnable); 13 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/graph/skill-graph-drift.md` | :3,15,47,51,60,74,88,100 (+5) | documentation (8 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md` | :47 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md` | :15,25 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md` | :60,111 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/runtime/freshness-contract.md` | :97,117,132,154 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/runtime/tool-ids-reference.md` | :59,82,87,88,89 | documentation (1 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md` | :69,70,78,79,115,141,142,143 | documentation (7 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/references/scoring/validation-baselines.md` | :68,74 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:system-skill-advisor / runtime — 78 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/runtime/README.md` | :23,208,289,308,309 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/advisor-server.ts` | :50,51,65,68,72,91,92 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/bench/README.md` | :94 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/bench/scorer-bench.ts` | :26 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts` | :70,77 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/bench/watcher-benchmark.ts` | :44 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/compat/README.md` | :77 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/data/README.md` | :53,80 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/database/README.md` | :19,48,49 | documentation (2 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/README.md` | :101 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts` | :88 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | :337 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | :33 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts` | :214,218,239,267,294,342,391 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/README.md` | :44 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/propagate-enhances.ts` | :53 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts` | :44 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/README.md` | :186 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/auth/README.md` | :77 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/compat/README.md` | :87 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | :25 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/context/README.md` | :3,19,39,44,87 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/corpus/README.md` | :78 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/corpus/df-idf.ts` | :79 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/cross-skill-edges/README.md` | :68,69 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/daemon/README.md` | :90 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/daemon/lease.ts` | :56,91 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | :129,132,295 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/derived/README.md` | :92 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/embedders/README.md` | :70,71 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/embedders/adapter.ts` | :7 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/embedders/adapters/README.md` | :64,65 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/freshness.ts` | :85 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/freshness/README.md` | :91 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/freshness/generation.ts` | :13,34 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/ipc/README.md` | :68,69 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/lifecycle/README.md` | :92 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/policy-plan.ts` | :125,126,127 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/scorer/README.md` | :109 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | :75,77,219 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/scorer/lanes/README.md` | :3,19,39,44,92 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | :61,1143 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/shadow/README.md` | :80 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts` | :42 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/shared/README.md` | :66,67 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | :248,251 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/skill-graph/README.md` | :42 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/skill-graph/metadata-sanitizer.ts` | :17 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | :277,281 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/subprocess.ts` | :273 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/test-helpers/README.md` | :26 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/utils/README.md` | :90 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts` | :20,21,26,30,31,32,36,37 (+8) | code constructing/matching `.opencode` as a contract (sentinel, gate, installer) | authored code | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/skills/system-skill-advisor/runtime/schemas/README.md` | :89 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | :21,27,28,29,38,39,47,49 (+1) | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/README.md` | :104 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | :19,20,54,55,56,57,58,59 (+3) | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | :147 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh` | :9 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md` | :60 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | :17,64,79,102,117,132,155,202 (+12) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | :12 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh` | :16,17,18,19,57,64,69,70 (+2) | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | :3,19,39,44,88 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | :30,82 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` | :52 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs` | :59 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` | :18 | jsonl content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py` | :21,23,28 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | :42,51,62,73,2104,2121,3582,3584 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py` | :8 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh` | :13,14,63,68 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` | :103,108,149 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | :193,213 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/search-quality/README.md` | :3,19,39,44,87 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/README.md` | :144 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tools/README.md` | :108 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts` | :23,28,73 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:system-skill-advisor / scripts — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/scripts/README.md` | :29 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/system-skill-advisor/scripts/doctor.sh` | :10 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:system-skill-advisor / tests — 105 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/system-skill-advisor/runtime/lib/scorer/lanes/__tests__/README.md` | :3,19,39,44,87 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/advisor-recommend-handler-stress.vitest.ts` | :89 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts` | :54,164,165,175,178,179,185,186 (+4) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts` | :27,35,49,57,58,66,67 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/daemon-lifecycle-stress.vitest.ts` | :32,40,151,159,231,234,243,301 (+1) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/df-idf-corpus-stress.vitest.ts` | :27,51,56 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/hooks-parity-stress.vitest.ts` | :11,33 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts` | :44,132,136,140,145,146,186 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts` | :15,24,35,87 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-bench-runner-stress.vitest.ts` | :27 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-compat-stress.vitest.ts` | :22,26,30 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/skill-projection-stress.vitest.ts` | :44 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/trust-state-stress.vitest.ts` | :65,73 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/README.md` | :194 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/__fixtures__/README.md` | :26 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/advisor-rebuild.vitest.ts` | :87,90,150,185,188 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/affordance-normalizer.test.ts` | :53 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/cache/README.md` | :78 | cached run artifact (content-addressed) | generated history | none — frozen cache of a past run; cache invalidates on path change | freeze |
| `.opencode/skills/system-skill-advisor/runtime/tests/cache/df-idf-cache.vitest.ts` | :30,31,48,62,65 | cached run artifact (content-addressed) | generated history | none — frozen cache of a past run; cache invalidates on path change | freeze |
| `.opencode/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts` | :4 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/command-binding-existence.vitest.ts` | :5,9,30,34,50,55,89 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts` | :6,29,32,69,99 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts` | :40,65 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts` | :30,43,68 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/compat/README.md` | :58 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts` | :15 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts` | :13 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/daemon-freshness-foundation.vitest.ts` | :52,425 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | :60,147,201 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/daemon-watcher-resource-leaks-049-005.vitest.ts` | :55 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/discovery-pipeline-parity.vitest.ts` | :28 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/embedders/README.md` | :54,64,65 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/fixtures/lifecycle/README.md` | :51 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/fixtures/lifecycle/index.ts` | :22,27 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/handlers/README.md` | :58 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | :16,26,27,28,29,34,169,173 (+4) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/handlers/skill-graph-corrupt-honesty.vitest.ts` | :22,65,66,67,68,69 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/handlers/skill-graph-dispatch.vitest.ts` | :50 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/handlers/skill-graph-scan-auth.vitest.ts` | :60,90 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/hooks/README.md` | :52 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts` | :53,198,230 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/lane-attribution.test.ts` | :24 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts` | :494 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/launcher-lease.vitest.ts` | :25,45,50,193,194,385 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts` | :117 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/legacy/README.md` | :58 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | :51,64 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-fixtures/README.md` | :66,67 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-freshness.vitest.ts` | :31,47,55,78,174,175,194,256 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-evidence-calibration.vitest.ts` | :15 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-health.vitest.ts` | :15,19 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts` | :59,92,163,234,237,246,249,407 (+5) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | :15 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/metadata-sanitizer-entities-guard.vitest.ts` | :18 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/migration-lineage-identity.vitest.ts` | :11,76,136 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/parent-skill-check-fixtures.vitest.ts` | :27,28 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/parity/README.md` | :50 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | :43 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | :82,93,97,160 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts` | :72,81,99 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | :75 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/policy-plan.vitest.ts` | :63,64 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/python/README.md` | :50 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | :8 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/rename-invariants.vitest.ts` | :31,59,84 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/route-exclusions.vitest.ts` | :65,66,67 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/routing-fixtures.affordance.test.ts` | :24 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts` | :30,47 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/routing-parity-deep-council.vitest.ts` | :22 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/routing-parity-deep-skills.vitest.ts` | :24 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts` | :24,26 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/schemas/README.md` | :50 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts` | :36 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/README.md` | :84 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/advisor-feedback-calibration.vitest.ts` | :53 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/advisor-quality-049-003.vitest.ts` | :37 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` | :41 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/ambiguity-slice.vitest.ts` | :41 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/bm25-lexical-shadow.vitest.ts` | :34 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts` | :40 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation-cache.vitest.ts` | :26 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | :47,90,154 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/fixtures/README.md` | :61 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/graph-causal-visited-order.vitest.ts` | :26 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts` | :34,46,57 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts` | :41,428,457,461 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/projection-embedding-staleness.vitest.ts` | :18,52,167 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/projection-fallback-049-005.vitest.ts` | :20,28,44,132,213 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/projection-freshness.vitest.ts` | :37,65 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/provenance-self-boost-guard.vitest.ts` | :20 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/rrf-determinism-spine.vitest.ts` | :59 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/runtime-lane-health.vitest.ts` | :24 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts` | :64,72 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-job-semantics.vitest.ts` | :117 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts` | :35,140 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts` | :33,36,38 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | :110,147,148,149,151,152,158,159 (+1) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts` | :305,351 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-graph-handlers.vitest.ts` | :92 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-graph/README.md` | :51,61,62 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-roundtrip.vitest.ts` | :87,136,158,171,187,204 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/state-containment.vitest.ts` | :21,29,49,58 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/tri-daemon-drill.vitest.ts` | :55,56,100,128,136,138,150,165 (+1) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts` | :5,6,22,45,46,52,54,55 (+11) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/tests/vocabulary-agreement.vitest.ts` | :20,21,68,69,70,71,72,73 (+4) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |

## Full tables — skill:sk-code

## skill:sk-code / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/README.md` | :119 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / ROUTER.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/ROUTER.md` | :82,96,111,250,251,260,265,303 (+2) | documentation (10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/SKILL.md` | :58,198,199 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / benchmark — 36 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--after--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--after--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--full--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--full--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live-final--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live-final--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live-remediated--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live-remediated--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--router-final--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-01--router-final--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-02--d4r-live--live/README.md` | :32,35 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-02--d4r-live--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-06-02--d4r-live--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-07-10--live-mode-b--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-07-10--router-baseline--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/2026-07-10--router-baseline--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/baseline/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/baseline/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.json` | :4,29,54,85,88,89 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.md` | :34,36,37 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json` | :7,67,111,135,159,209,485,605 (+3) | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md` | :15,38,96,108,114,120,132,204 (+5) | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json` | :4,29,55,86,89,90 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json` | :4,29,54,85,88,89 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
## skill:sk-code / changelog — 6 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/changelog/v3.1.0.0.md` | :32,33,34,35,36,37,38,39 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/changelog/v3.2.0.0.md` | :34,35,36,37,38,39,40,41 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/changelog/v3.2.1.0.md` | :8,17,18,24,25,26,27,28 (+1) | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/changelog/v3.3.1.0.md` | :8 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/changelog/v3.4.0.0.md` | :8,42,43,44,45,46,47,53 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/changelog/v3.5.0.0.md` | :8,36,37,38,39,45 | historical changelog record | authored history | none — frozen history | freeze |
## skill:sk-code / feature-catalog — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md` | :28,40,50,51,52,53,54,60 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/feature-catalog/feature-catalog.md` | :53 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | :42,43,44,45,51 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/graph-metadata.json` | :254,255,256,257,258,259,260,261 (+19) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-code / manual-testing-playbook — 27 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md` | :54,55 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/cwv-gates-animation-heavy.md` | :35,100,101,102 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/decision-matrix-routing.md` | :29,90,91,92 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/non-webflow-plus-motion-dev.md` | :24,29,97,98,99,100 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/opencode-plus-motion-dev.md` | :11,19,25,30,67,100,101,102 (+1) | documentation (2 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/prefers-reduced-motion.md` | :35,100,101,102,103 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/snippet-reuse-cross-stack.md` | :29,90,91,92 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/webflow-plus-motion-dev.md` | :35,102,103,104,105 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/design-restraint/ceiling-comment-convention.md` | :23,26,29,46,47,48,56,88 (+1) | documentation (2 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md` | :25,28,31,55,56,57,64,98 (+2) | documentation (2 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/design-restraint/implementer-anti-stall.md` | :25,28,31,47,48,55,89,90 | documentation (2 fenced (runnable); 6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md` | :11,45,52,57,61,66,80,96 (+1) | documentation (4 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/language-sub-detection/opencode-config.md` | :47,77,78 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/language-sub-detection/opencode-python.md` | :23,26,49,79,80 | documentation (1 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/language-sub-detection/opencode-shell.md` | :21,24,47,77,78 | documentation (1 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/language-sub-detection/opencode-typescript.md` | :23,26,49,50,79,80,81 | documentation (1 fenced (runnable); 6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | :43,78,79,92,93,102,105,194 (+14) | documentation (22 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/cdn-bundle-version-pin.md` | :23,39 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/plugins-and-hooks/post-edit-quality-router.md` | :49,50,51,53,94,104,110,125 (+33) | documentation (24 fenced (runnable); 17 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md` | :11,24,28,31,35,41,85,86 | documentation (1 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/routing-disambiguation/skcode-vs-skdoc.md` | :11,13,57,84,85,86 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md` | :13,27,37,74,104,121,122,123 (+1) | documentation (1 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/surface-detection/opencode-detection.md` | :3,11,25,28,31,49,51,59 (+11) | documentation (2 fenced (runnable); 17 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md` | :11,52,59,88,95,96 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md` | :34,60,61,63,69,103,110,111 (+3) | documentation (1 fenced (runnable); 10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md` | :11,13,23,26,32,43,44,45 (+13) | documentation (7 fenced (runnable); 14 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` | :11,44,45,46,65,70,83,105 (+5) | documentation (4 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / mode-registry.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/mode-registry.json` | :50 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-code / shared — 8 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/shared/assets/patterns/README.md` | :3,20,40,45,89 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/shared/references/stack-detection.md` | :28,29,30,31,40,44,70,73 (+15) | documentation (1 fenced (runnable); 22 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/shared/references/universal-debugging-checklist.md` | :69,70,88,89,90,91,92 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/shared/references/universal-verification-checklist.md` | :51,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/shared/references/universal/code-quality-standards.md` | :129,135 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/shared/references/universal/code-style-guide.md` | :136,140 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/shared/references/universal/error-recovery.md` | :43,44,108,109,129,130,131,132 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/shared/references/workflow-verify.md` | :83 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / sk-code-mobile-cli — 30 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/sk-code-mobile-cli/README.md` | :29,90,100,135 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/cross-cli-dispatch/large-prompt-stress.md` | :83,88 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/cross-cli-dispatch/multi-step-dispatch.md` | :88,94 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/cross-cli-dispatch/short-prompt-baseline.md` | :77,82 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/accessibility-natural.md` | :77,78,79 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/debugging-natural.md` | :76,77,78 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/implementation-natural.md` | :79,80,81 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/ind-code-quality.md` | :77,78 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/ind-language-standards.md` | :78,79 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/ind-verification.md` | :74,75 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/accessibility-routing.md` | :73,74,75 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/comment-convention-routing.md` | :78,79,80 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/debugging-routing.md` | :71,72,73 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/guardrail-routing.md` | :70,71,72 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/language-standards-routing.md` | :74,75,76 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/token-edit-routing.md` | :80,81,82 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/verification-routing.md` | :73,74,75 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/manual-testing-playbook.md` | :139 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/resource-loading/mixed-load.md` | :81,82,83 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/resource-loading/references-only-load.md` | :82,83,84,85 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/surface-detection/negative-control-non-mobile-cli.md` | :74,75,77 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/surface-detection/pi-remote-positive-detection.md` | :76,77 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md` | :101,102,103 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/token-cost-baseline/floor-single-resource.md` | :73,74,75 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/token-cost-baseline/median-load.md` | :74,75,76 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | :83,84,85,86 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/unknown-fallback/disambiguation-required.md` | :88,89,90,91 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md` | :75,76,77,78 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/references/quality/doc-quality-gate.md` | :32,37,47,97,110,111,112 | documentation (3 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/scripts/run-source-gates.sh` | :26,37 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-code / sk-code-obsidian — 34 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/sk-code-obsidian/README.md` | :30,65,67,98,109,149 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/SKILL.md` | :281 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/changelog/v0.1.0.0.md` | :53 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/cross-cli-dispatch/large-prompt-stress.md` | :78,79,80,81 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/cross-cli-dispatch/multi-step-dispatch.md` | :84,85,86 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/cross-cli-dispatch/short-prompt-baseline.md` | :73,74,75 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md` | :80,81,82 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/code-quality-natural.md` | :76,77 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/debugging-natural.md` | :76,77 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/implementation-natural.md` | :79,80 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/stack-standards-natural.md` | :78,79 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/verification-natural.md` | :76,77 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/db-class-rename-routing.md` | :79,80,81 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md` | :77,78,79 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/folder-docs-routing.md` | :80,81,82 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/modal-screenshot-routing.md` | :77,78,79 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md` | :79,80,81 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md` | :80,81,82 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/verification-routing.md` | :79,80,81 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` | :99,102,104 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/assets-only-isolation.md` | :76,77,78,79 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/mixed-load-isolation.md` | :80,81,82,83 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/references-only-isolation.md` | :78,79,80,81 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/negative-control-non-obsidian.md` | :76,77,78 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/obsidian-surface-resolution.md` | :74,75,76 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md` | :89,90,91 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/floor-single-resource.md` | :72,73,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/median-load.md` | :77,78,79 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | :83,84,85 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/disambiguation-required.md` | :87,88,89 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md` | :76,77,78 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/references/folder-docs.md` | :41 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/references/quality/doc-quality-gate.md` | :37,38,46,47,49,92 | documentation (6 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh` | :27,41 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-code / sk-code-opencode — 47 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/sk-code-opencode/README.md` | :3,13,21,32,36,54,61,72 (+4) | documentation (1 fenced (runnable); 11 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/SKILL.md` | :16,18,22,30,175 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/agent-authoring.md` | :35,36,37,41,42,55,61,62 (+7) | documentation (15 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/command-authoring.md` | :26,35,36,39,40,43,58,65 (+8) | documentation (16 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/javascript-checklist.md` | :150 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md` | :37,66,77,78 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/skill-authoring.md` | :26,36,37,40,66,67,71,77 (+3) | documentation (11 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/universal-checklist.md` | :89,114,266 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/README.md` | :3,23,43,48,93 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | :106 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-opencode/benchmark/reports/2026-07-10--live-mode-b--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-opencode/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-opencode/benchmark/reports/2026-07-10--router-mode-a--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-opencode/changelog/v1.0.0.5.md` | :10 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/code-quality-gate.md` | :54,74,75,76,77 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/implementation-authoring.md` | :54,74,75,76,77 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/verification-alignment.md` | :47,67,68,69,70 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/config-hooks/config-schema.md` | :49,69,70,71,72 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/config-hooks/hooks-wiring.md` | :46,66,67,68,69 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/python-standards.md` | :48,68,69,70,71 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/rust-standards.md` | :62,82,83,84,85 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/shell-standards.md` | :51,71,72,73,74 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/typescript-standards.md` | :52,72,73,74,75 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/manual-testing-playbook.md` | :5,36 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/config/quality-standards.md` | :101 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/config/quick-reference.md` | :157,172,304 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/config/style-guide.md` | :33,40,41,42,43,65,89,114 (+13) | documentation (2 fenced (runnable); 19 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/javascript/quality-standards/overview-modules-and-docs.md` | :45,134,152,182,211,253 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/javascript/quality-standards/security-testing-and-exemptions.md` | :256,283 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/javascript/quick-reference.md` | :161 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md` | :63,64,107,146,163 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/python/quality-standards.md` | :55,69,88,104,152,175,220,327 (+2) | documentation (10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/python/style-guide.md` | :33,34,41,42,56,78,97,119 (+9) | documentation (1 fenced (runnable); 16 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | :36,82,88,94,112,113,127 | documentation (3 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` | :40,242,243 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/imports-and-exports.md` | :157 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/overview-and-module-organization.md` | :41,42,43 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/hooks.md` | :42,43,46,47,48,62,83,84 (+32) | documentation (4 fenced (runnable); 36 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md` | :41,42,43,44,243,244,246 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/organization-security-and-examples.md` | :164 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shell/quality-standards/overview-and-priority-blockers.md` | :54,70,248 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md` | :166 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md` | :35,36,43,44,45,59,91,107 (+6) | documentation (14 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/shell/style-guide/variables-functions-and-output.md` | :196 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/typescript/quality-standards/tsconfig-and-modules.md` | :41,101 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/scripts/README.md` | :29 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / sk-code-quality — 12 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/sk-code-quality/README.md` | :59,64,115,116,117 | documentation (1 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-quality/SKILL.md` | :27,103,104,105,106,116,117,118 (+4) | documentation (12 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--router-mode-a--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | :72,73,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-quality/scripts/README.md` | :33 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | :14 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | :32,69,74 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-code/sk-code-quality/scripts/hooks/README.md` | :3,17 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh` | :6,17,20,28,29,109 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-code / sk-code-review — 27 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/sk-code-review/README.md` | :62,65,111,134,197,198,199 | documentation (2 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/SKILL.md` | :224,452,464,482 | documentation (1 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--router-mode-a--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/changelog/v1.1.0.0.md` | :20,21,22,23,24,25,26 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/changelog/v1.2.0.0.md` | :20,21,22 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/changelog/v1.3.0.0.md` | :8,36,63,64 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/changelog/v1.4.0.0.md` | :8,48,49,50,51,52,53 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/changelog/v1.5.0.0.md` | :8,36,37,38,39,40,41,47 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/changelog/v1.6.0.0.md` | :8,28,29 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/cross-cli-orchestration/cli-opencode-delegation.md` | :33,49 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/cross-cli-orchestration/native-claude-code-invocation.md` | :33,49 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/rule-invariant-canary.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/dry.md` | :69,70,71,72 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/kiss.md` | :69,70,71,72 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/quality.md` | :69,70,71,72 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/removal.md` | :70,71,72,73 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/security.md` | :69,70,71,72 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/solid.md` | :70,71,72,73 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/testing.md` | :70,71,72,73 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` | :39,61,62,752 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/manual-testing-playbook/re-review-and-stale-context/stale-architecture-fresh-pass.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/references/pr-state-dedup.md` | :41,78 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/scripts/README.md` | :30,38 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | :35,43,51,55,66 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-code / sk-code-webflow — 46 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/sk-code-webflow/README.md` | :36,94,108,116 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/animation/playbook-entries.md` | :22,144,145 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/animation/snippets/README.md` | :3,21,41,46,98 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/integrations/README.md` | :3,21,41,46,90 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/patterns/README.md` | :3,21,41,46,92 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/scripts/README.md` | :3,21,41,46,91 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs` | :7,8 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` | :7 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/scripts/verify-minification.mjs` | :7 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/assets/templates/README.md` | :3,21,41,46,93 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-webflow/benchmark/reports/2026-07-10--live-mode-b--live/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-webflow/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-webflow/benchmark/reports/2026-07-10--router-mode-a--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/deployment-forms-video/deployment-routing.md` | :68,69,70 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/deployment-forms-video/forms-routing.md` | :67,68,69 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/deployment-forms-video/video-routing.md` | :66,67,68 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/code-quality-routing.md` | :64,65,66 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/debugging-routing.md` | :70,71,72 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/implementation-routing.md` | :84,85,86 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/testing-routing.md` | :63,64,65 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/verification-routing.md` | :65,66,67 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/language-standards/language-standards-routing.md` | :83,84,85 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/accessibility-routing.md` | :69,70,71 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/animation-routing.md` | :69,70,71 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/motion-dev-routing.md` | :72,73,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/performance-routing.md` | :71,72,73 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/animation/decision-matrix.md` | :42,64,140 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/animation/integration-patterns.md` | :83,84,85,140 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/animation/performance-and-pitfalls.md` | :43,55,61,112,152 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/animation/quick-start.md` | :107 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/performance-debugging.md` | :410 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/sub-agent-verification.md` | :230 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md` | :120,258,409 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/debugging/error-recovery.md` | :64,73,74 | documentation (2 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md` | :200,201,228,229,320,321,322 | documentation (4 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md` | :38,41,44,60,63,112,113,114 | documentation (5 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/workflow-verification-and-debugging.md` | :46,52,83,131,143,153,171,180 (+2) | documentation (7 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/deployment/webflow-staging-production.md` | :162,163 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/testing-and-common-issues.md` | :304 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md` | :249,252 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md` | :197 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/overview-limits-and-collection-lists.md` | :243 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/automation-errors-and-compat.md` | :185 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md` | :206 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md` | :350 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-code / tests — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | :8,23,24,25,26,27,70 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |

## Full tables — skill:sk-doc

## skill:sk-doc / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/README.md` | :75,83,91,180,190,191,192,193 | documentation (3 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/SKILL.md` | :56 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / benchmark — 24 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/benchmark/README.md` | :46,48 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.json` | :4,33,57,60,61 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.md` | :33,35,36 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/cli-external-orchestration.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/mcp-tooling.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-code.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-design.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-doc.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-prompt.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/system-deep-loop.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/report.json` | :27,45,58,67,77,81,86,122 (+16) | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json` | :9,10,12,57,79,137,195,263 (+30) | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md` | :3,11,14,51 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json` | :4,29,54,84,87,88 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json` | :4,29,54,84,87,88 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
## skill:sk-doc / changelog — 5 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/changelog/v1.5.0.0.md` | :5,13,25,73,91 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/changelog/v1.6.0.0.md` | :60 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/changelog/v1.7.0.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/changelog/v1.8.0.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/changelog/v1.8.1.0.md` | :3,27 | historical changelog record | authored history | none — frozen history | freeze |
## skill:sk-doc / command-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/command-metadata.json` | :19,25,31,62,68,74,105,111 (+28) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-doc / feature-catalog — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md` | :28,40,50,51,52,53,54,60 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/feature-catalog/feature-catalog.md` | :53 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md` | :42,43,44,50 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/graph-metadata.json` | :344,345,346,347,348,349,350,351 (+17) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-doc / manual-testing-playbook — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-claude-code.md` | :51,56,81,90,91,103 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-opencode.md` | :51,56,100,102,103,115 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` | :13,98,100,103 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / scripts — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/scripts/README.md` | :3,19,39,44,97,108 | documentation (2 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` | :338,341,348,349 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / shared — 18 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/shared/README.md` | :29 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/shared/assets/template-rules.json` | :139,429,522 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/shared/references/core-standards.md` | :69,70,292,293 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/shared/references/quick-reference.md` | :43,49,168 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/shared/references/validation.md` | :497,503 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/README.md` | :52,53,54,55 | documentation (4 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` | :5,8 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/check_install_entries.py` | :91,92 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py` | :52 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py` | :188,288 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/check_no_numbered_categories.py` | :13,50 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/check_no_numbered_snippet_files.py` | :11,51 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | :8,385,392 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/quick_validate.py` | :26,62,93 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/reference_checker_core.py` | :77,203 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/reference_checker_extractors.py` | :84 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/resolve_skill_markdown_links.py` | :65,137 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | :238,1100,1222,1231,1288,1295 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / sk-create-agent — 14 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-agent/README.md` | :22,41,54,62,71,104,136,137 (+1) | documentation (2 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/SKILL.md` | :72,77,157,159,176,182,186,227 (+6) | documentation (6 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md` | :31,88,98,153,478,479,480,550 (+6) | documentation (8 fenced (runnable); 6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/changelog/v1.0.0.0.md` | :14 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-agent/manual-testing-playbook/body-validation/leaf-denies-delegation.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/manual-testing-playbook/body-validation/required-agent-sections.md` | :45,51,52 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/manual-testing-playbook/component-choice/named-runtime-persona.md` | :30,45,52 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/manual-testing-playbook/component-choice/reusable-knowledge-stays-a-skill.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/manual-testing-playbook/manual-testing-playbook.md` | :49,184 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/manual-testing-playbook/runtime-contract/claude-tools-allow-list.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/manual-testing-playbook/runtime-contract/opencode-permission-object.md` | :15,30,45,50,52 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/references/README.md` | :45 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/references/common-pitfalls.md` | :34 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-agent/references/permission-design.md` | :62,63 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / sk-create-benchmark — 22 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-benchmark/README.md` | :68,141,143 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md` | :241,253 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md` | :26,27,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md` | :26,27,42 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md` | :27,28,43 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md` | :32,42,43 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md` | :23,40,41 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md` | :26,27,37,38,39,63,165 | documentation (1 fenced (runnable); 6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/shared/benchmark-report-template.md` | :25,26,30,31,34,333 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/shared/source-template.md` | :23,24,28 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md` | :31,32,45,46,52,133,143,177 (+4) | documentation (2 fenced (runnable); 10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/benchmark-families/author-lane-c-index.md` | :43,49 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/evidence-and-boundaries/archive-compiled-routing-safely.md` | :43,48,50 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/family-routing/promote-mcp-result.md` | :43,49 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md` | :194,226 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md` | :288,289,299 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/references/shared/README.md` | :67 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/references/shared/case-studies.md` | :43 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/references/skill-benchmark/serving-snapshot-schema.md` | :38,85,119,123,162 | documentation (4 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/scripts/README.md` | :30,31 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/scripts/archive-compiled-routing.cjs` | :36,40,224 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-benchmark/scripts/render-serving-snapshot.cjs` | :28,32,36,40,49,385 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / sk-create-changelog — 15 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-changelog/README.md` | :42,56,64,73,103,136 | documentation (2 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/SKILL.md` | :12,24,58,167,187,229,232,410 (+15) | documentation (7 fenced (runnable); 16 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | :3,24,175,207,248,252,253,266 (+3) | documentation (2 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/changelog/v1.0.0.0.md` | :6,8,16,29,30,31,32 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-changelog/changelog/v1.0.0.1.md` | :22,23 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-changelog/changelog/v1.0.1.0.md` | :22,23 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md` | :43,48 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/prepare-release-notes.md` | :54 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/manual-testing-playbook/topology/route-global-component.md` | :17,29,43,48,49,54 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/manual-testing-playbook/topology/route-phase-child-nested.md` | :43,49 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/manual-testing-playbook/version-and-format/avoid-version-collision.md` | :43,48,50 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/manual-testing-playbook/version-and-format/select-canonical-format.md` | :43,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/references/README.md` | :55,56,57,58,61,62,63,66 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md` | :33,47,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | :34,53,54,55,56,91,92,100 (+1) | documentation (7 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / sk-create-command — 13 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-command/README.md` | :20,47,58,66,75,136,144,145 (+2) | documentation (2 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/SKILL.md` | :12,119,120,127,152,161,167,173 (+5) | documentation (9 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json` | :15,22,23,30,31,32,52,59 (+39) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md` | :70,71,72,147,150,151,155,156 (+1) | documentation (9 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-template.md` | :35,54,68,687,863,1105,1115,1272 (+1) | documentation (7 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/changelog/v1.0.0.0.md` | :3,5 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-command/manual-testing-playbook/component-and-path/reference-guidance-stays-a-skill.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/manual-testing-playbook/component-and-path/repeatable-slash-command.md` | :30,45,52,56 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/manual-testing-playbook/input-and-modes/complete-auto-and-confirm-modes.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/manual-testing-playbook/input-and-modes/required-argument-gate.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/manual-testing-playbook/router-contract/direct-dispatch-without-yaml.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/manual-testing-playbook/router-contract/thin-router-presentation-boundary.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-command/references/worked-example.md` | :32,33,39,40,41,42,58,73 (+1) | documentation (7 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / sk-create-diff — 5 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-diff/SKILL.md` | :273,285 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-diff/assets/fixtures/README.md` | :28 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-diff/changelog/v1.1.0.0.md` | :29 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-diff/manual-testing-playbook/comparison/markdown-before-after-review.md` | :64 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-diff/manual-testing-playbook/manual-testing-playbook.md` | :55 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / sk-create-feature-catalog — 13 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-feature-catalog/README.md` | :59,67,132,134 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/SKILL.md` | :331,334,335,338,341,355 | documentation (4 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | :52 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/catalog-structure/create-root-catalog-package.md` | :43,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/scope-and-validation/validate-leaf-from-repository-root.md` | :43,48,49,50 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/source-traceability/anchor-feature-in-source-and-tests.md` | :43,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/references/README.md` | :67 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/references/examples.md` | :23,31,66,119,141,155 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/README.md` | :31,34 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/fixtures/prose-path/negative/leaf.md` | :3 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/fixtures/prose-path/positive/leaf.md` | :3 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/fixtures/shipped-label/positive/leaf.md` | :14 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | :107,488,903,904,913 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / sk-create-frontmatter — 16 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-frontmatter/README.md` | :67,75,170,171,172,173,174 | documentation (2 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md` | :231,233 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | :132,149,165,440,471,588,626,627 (+4) | documentation (4 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/description-budget/silent-discovery-drop.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/description-budget/trim-an-over-budget-description.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/description-budget/trim-that-loses-routing-tokens.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/field-and-class-resolution/author-a-reference-block.md` | :47,54 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/field-and-class-resolution/class-row-before-field-row.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/field-and-class-resolution/out-of-scope-class.md` | :19,29,30,31,41,45,52,56 (+2) | documentation (10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md` | :74,107,243,245 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/changelog-anchored-derivation.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/idempotent-rerun.md` | :45,50,51,52 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/no-frontmatter-is-skipped.md` | :45,50,52 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/numstat-gate.md` | :45,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/skip-on-differ.md` | :45,50,52 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | :25,38,92,110,112 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / sk-create-manual-testing-playbook — 11 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md` | :67,76,150 | documentation (2 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | :285,434,439,441,442,445,459,460 (+1) | documentation (6 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | :53 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/operator-contract/keep-operator-scenarios-in-scope.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/package-authoring/create-a-reusable-package.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/package-authoring/keep-policy-in-root.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/scenario-design/design-a-deterministic-scenario.md` | :45,49 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json` | :6,7,8,9,10,11,12 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | :15,16,17,18,19,20,21,22 (+36) | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/references/examples.md` | :33 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | :44,80 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / sk-create-quality-control — 11 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-quality-control/README.md` | :48,56,129,130,131 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/SKILL.md` | :12,24,157,184,190,198,339,345 (+9) | documentation (7 fenced (runnable); 10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/changelog/v1.0.2.0.md` | :17,18 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/audit-and-validation/assess-batch-snapshot.md` | :45,49,50,51,53 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/audit-and-validation/run-a-report-only-audit.md` | :45,49,50,52 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/audit-and-validation/validate-structure-before-readiness.md` | :45,50,51 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/optimization-and-voice/optimize-only-when-asked.md` | :45,49,52,53,54 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/optimization-and-voice/require-evidence-for-dqi.md` | :45,51 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md` | :34,41,44,48,56,60,64,82 | documentation (4 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md` | :35,38,41,50,63,80,87,89 | documentation (8 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-quality-control/references/workflows.md` | :49,50,51,52 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / sk-create-readme — 14 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-readme/README.md` | :23,54,65,73,74,151,152,153 | documentation (4 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/SKILL.md` | :51,383,384,392,393,399 | documentation (5 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/assets/install-guide-template.md` | :30,475 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/changelog/v1.1.0.0.md` | :26 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-readme/manual-testing-playbook/artifact-routing/self-explanatory-folder-stays-unchanged.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/manual-testing-playbook/artifact-routing/skill-readme.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/manual-testing-playbook/evidence-and-shape/code-folder-navigation-shape.md` | :45,50,52 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/manual-testing-playbook/evidence-and-shape/evidence-first-current-state.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/manual-testing-playbook/install-guide/five-phase-install-flow.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/manual-testing-playbook/install-guide/one-line-install-stays-inline.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/references/readme/types-and-voice.md` | :41 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/scripts/README.md` | :12,29 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | :16,46,78,97,171,272,426,429 (+8) | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | :7,49,103 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / sk-create-repo-rule — 5 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-repo-rule/README.md` | :78,180 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` | :170 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/manual-testing-playbook.md` | :61,92 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-authoring/trigger-phrase-collision.md` | :76 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | :22 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-doc / sk-create-skill — 42 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-skill/README.md` | :3,20,54,62,70,144 | documentation (3 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/SKILL.md` | :21,77,243,245,329 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-command-metadata-template.json` | :2,21,27 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json` | :88,89,90,91,92,93,94,100 (+1) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | :165 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` | :42,46,106,217,232,253 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | :28 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` | :22,916 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-graph-metadata-template.json` | :31,37 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | :587,607,610,1157,1166,1168 | documentation (4 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md` | :230 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` | :16,34,142,317 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` | :24,745,953,956 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md` | :3,16,45,50 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/changelog/v1.0.0.0.md` | :8 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | :149 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/author-a-two-axis-parent-hub.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/keep-one-parent-identity.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/keep-ready-separate-from-compiled-serving.md` | :45,50,51 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/classify-standalone-root-metadata.md` | :45,52,53 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/leave-quality-audits-alone.md` | :45,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/scaffold-a-standalone-skill.md` | :28,29,41,45,50,52,53 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | :34,44,55,58,92 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json` | :11,12,13,14,15,16,17,18 (+7) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | :30 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | :143,245,255,256 | documentation (3 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md` | :57,60,66,67,113 | documentation (4 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md` | :67 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | :32,83,112,115,118 | documentation (3 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md` | :73,74,111,140 | documentation (3 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | :136,137,140,201,203 | documentation (3 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` | :44,46,72,77,107,114,117,170 (+7) | documentation (6 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/README.md` | :50 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | :23,24 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | :29,30,325 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | :27 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | :130,339,344,679,680,681,687,693 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/README.md` | :43,44 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/command-metadata-schema.cjs` | :118 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | :20,21,22 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | :33,35 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | :18,25,27,266 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / sk-create-with-human-voice — 16 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/README.md` | :68 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | :166 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/changelog/v1.0.0.0.md` | :25 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md` | :71,117 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scope-gate/accuracy-outranks-the-standard.md` | :48,53 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scope-gate/code-and-quotations-untouched.md` | :48,53,54,56 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scope-gate/document-about-the-standard.md` | :48,53,55 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scope-gate/exempt-spans-are-named.md` | :48,55 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scoring-and-rescan/rescan-after-rewrite.md` | :48,52,53,55 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scoring-and-rescan/score-does-not-edit.md` | :48,53,55 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/hard-blocker-terms.md` | :46,51,52,53 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/judgment-pass-not-covered-by-the-scanner.md` | :48,53 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/word-sense-is-a-candidate.md` | :48,53,54,56 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md` | :142,143,144,145 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md` | :164 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` | :9 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-doc / tests — 24 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-doc/scripts/tests/README.md` | :3,19,39,44,95,106 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | :59,69,79,89,99,109,119,129 (+852) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | :10,11,12,13,14,15,16,17 (+788) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/code-folder/negative/durability-leak/README.md` | :7 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs` | :11,12,13,14,15,16 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_category_classification_denumbered.py` | :23 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_changelog_validator.py` | :18,19,27 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_code_folder_readme.py` | :14 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py` | :44 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_naming_root_resolver.py` | :46 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py` | :115,116,126 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_quick_validate_086.py` | :6 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_readme_manifest.py` | :13,26 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` | :19 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_root_name_consumer_matrix.py` | :15,79,80,91 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_structure_validation.py` | :11 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/scripts/tests/test_validate_catalog_package.py` | :4,30,40,99,105,121,132,138 (+3) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py` | :36,46,74,75,119,123,130,132 (+2) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | :45 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | :43 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/advisor-index-handoff-contract.test.cjs` | :18,20,21,22,24,25,26,28 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/compiled-routing-lockstep-parity.test.cjs` | :124 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs` | :18,19,20,21,22,23,24,25 (+3) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs` | :36,47,49,82 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
