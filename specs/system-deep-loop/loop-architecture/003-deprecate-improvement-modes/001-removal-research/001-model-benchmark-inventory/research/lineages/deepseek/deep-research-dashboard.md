---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Inventory every reference to the model-benchmark deep-loop mode (workflowMode model-benchmark, command /deep:model-benchmark, assets deep-model-benchmark-*.yaml and deep-model-benchmark-presentation.txt, loopHostMode model-benchmark in the shared deep-improvement packet) across this whole repository outside specs/, so its full deletion can be planned.
- Started: 2026-10-10T18:39:43Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: fanout-deepseek-1791657286793-xs8psf
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Core hub registries, routers, and metadata (mode-registry, hub-router, ROUTER.md, SKILL.md, command-metadata, leaf-manifest, leaf-scopes, graph-metadata, description, ARCHITECTURE) | - | 1.00 | 12 | complete |
| 2 | The /deep:model-benchmark command family under .skilled/commands/deep/ plus Lane B cross-references in shared command surfaces and the commands README/compiled/legacy manifolds | - | 1.00 | 13 | complete |
| 3 | The deep-improvement packet Lane B wiring: SKILL.md, references/assets/scripts model-benchmark trees, shared script mode branches, catalogs, playbooks, rollout JSON, routing allowlist | - | 0.90 | 14 | complete |
| 4 | system-skill-advisor model-benchmark wiring: aliases, phrase boosts, projections, generated command bridges, Python advisor catalog, shadow diff, skill graph | - | 1.00 | 10 | complete |
| 5 | sk-doc surfaces incl. sk-create-benchmark family, sk-doc hub registries, create:benchmark command, sk-create-command contract, test manifests, token baseline | - | 1.00 | 12 | complete |
| 6 | cli-external-orchestration, cli-classifier, sk-code/sk-prompt benchmark surfaces, agents/deep-improvement.md, .skilled/bin compiled-routing rollout files | - | 1.00 | 10 | complete |
| 7 | Runtime mirrors .claude .opencode .codex .cursor .pi .devin .hermes: symlink vs generated copy vs hand-written; guard tests; sync generators; .opencode/bin gap resolution | - | 0.95 | 14 | complete |
| 8 | Repo-level surfaces: hook trees, env examples, root README, changelogs, sibling mode READMEs, external-consumer probe | - | 1.00 | 8 | complete |
| 9 | Indirect wiring: gateway mode branch, runtime schema/reducer/sealed packages, authority-flip + write-set-conflict declarations, blinded adjudication, deep-improvement-common, runtime tests, spec-kit references and retrieval fixtures, compiled-routing recheck | - | 1.00 | 14 | complete |
| 10 | Validators and doctor checks, hub playbook/feature-catalog residual pages, corpus-manifest capture, strict dual-mode gap sweep with residual reconciliation | - | 0.85 | 10 | complete |

- iterationsCompleted: 10
- keyFindings: 117
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which deep-loop hub registries and metadata files reference the model-benchmark mode, and how is each reference classified (DELETE vs EDIT)?
- [x] Which .skilled/commands/deep surfaces and deep-improvement packet files implement the model-benchmark mode?
- [x] How is model-benchmark wired into system-skill-advisor and sk-doc surfaces (projections, aliases, drift guards, sk-create-benchmark)?
- [x] Which runtime mirrors (.claude .opencode .codex .cursor .pi .devin .hermes) and repo-level surfaces (hooks, bin/, scripts, READMEs, changelogs, env examples) reference the mode, and is each a symlink, a generated copy, or a hand-written file?
- [x] Which indirect wiring (compiled contracts, generated mirrors, drift guards, tests, fixtures, validators, doctor checks) covers the mode's surfaces, and does anything outside the repository consume the mode?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▆▄▅▇█████▆▆▇███▄▁
- score sparkline: ███▆▄▅▇█████▆▆▇███▄▁
- Last 3 ratios: 1.00 -> 1.00 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"other":120}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Assuming `routing-allowlist.json` exists at hub root: it does not; only the deep-improvement packet has one (iteration 3 scope). (iteration 1)
- None yet. The master sweep file list is now the authoritative work partition. (iteration 1)
- Searching only `model-benchmark` as an exact string: misses "model benchmark" prose and `benchmark-harness` alias; used the `model[-_ ]?benchmark` alternation instead (recovered both). (iteration 1)
- `assets/compiled/manifest.jsonl` and `assets/legacy/` bodies: confirmed no model-benchmark pairs exist; only the README sentences mention it. (iteration 2)
- Searching for model-benchmark inside `research.md`, `review.md`, `ai-council.md`: no matches; the three sibling command files do not reference Lane B. (iteration 2)
- Treating `run-benchmark.cjs` / `benchmark-profiles/default.json` as Lane B-only: Lane A YAMLs call them directly (finding 11), so they are shared. (iteration 2)
- Treating all `deep-agent-improvement-*` mentions as DELETE: the Lane A surfaces survive; only their Lane B paragraphs are edits. (iteration 2)
- Classifying `benchmark/reports/**` as mode-owned: they are historical reports about the skill (info rows only) and carry no Lane B run outputs ("Recorded Lane B runs: none yet"). (iteration 3)
- Classifying the `benchmark-integration/` playbook pages as Lane B-only: the playbook's own lane map puts that category in the shared set. (iteration 3)
- Grepping for a committed `benchmark/model-benchmark/{run_label}` outputs tree: none exists; only the two historical report folders are present. (iteration 3)
- Treating `scripts/model-benchmark/` as one DELETE directory: Lane A consumes `run-benchmark.cjs` from it, so the directory is a carve-out, not a whole-tree delete. (iteration 3)
- `routing-accuracy/` and `fixtures/` (no matches); `command-bridges/README.md` does not exist. (iteration 4)
- Regenerating the deep routing alias projection in `aliases.ts`: the generated group set does not include `deep-model-benchmark`; only the manual group needs deletion and the embedded hash stays valid. (iteration 4)
- Treating the skill-graph `model benchmark` fragment as a deep-loop routing signal: it belongs to sk-doc's harvested trigger set. (iteration 4)
- `benchmark/reports/compiled-routing/**` under sk-doc: historical benchmark reports, KEEP-AS-HISTORY, no edit needed. (iteration 5)
- Treating `cite-drift-redirects.json` as an in-scope reference: verified false positive from the dot wildcard. (iteration 5)
- Treating the whole `sk-create-benchmark` skill as DELETE: it is a four-family skill; only the model-benchmark family is removed and the shared/other families stay. (iteration 5)
- `cli-classifier/README.md` beyond the JEV table has no other mode references. (iteration 6)
- Editing the JEV feature implementations for this deletion: only documentation caller references change. (iteration 6)
- Treating the sk-prompt/system-deep-loop benchmark reports as editable: they are historical measurements; no edit, KEEP-AS-HISTORY. (iteration 6)
- Covering `.worktrees/**`/`barter/**` in this inventory: duplicate checkouts; recorded as an explicit scope assumption. (iteration 7)
- Editing `.cursor`, `.devin`, `.opencode` file copies directly: they are symlinks or generated mirrors. (iteration 7)
- Editing the guard plugin source: it resolves modes from `mode-registry.json` at runtime. (iteration 7)
- Runtime `SYNC.md` files: no mode mentions. (iteration 7)
- `.pi/extensions` and runtime hook JSONs: no matches. (iteration 8)
- Claiming external consumers exist: the probe found none; statement recorded as inference with its basis. (iteration 8)
- Editing any changelog: all historical mentions are KEEP-AS-HISTORY. (iteration 8)
- Hunting for hook-level registrations: hooks never reference the mode (verified across all seven runtimes). (iteration 8)
- `mode-contracts` under runtime/lib: no mode string present (per master sweep absence). (iteration 9)
- Any compiled-routing stage outside 009: verified clean with a full-tree `--no-ignore` sweep. (iteration 9)
- Editing the anchor-repair spec fixtures: parser-test corpus, historical; edits would invalidate test expectations. (iteration 9)
- Regenerating `generation-diagnostics.json` by hand: it is a generated diagnostic dump; regen or bulk edit after deletion. (iteration 9)
- `.skilled/commands/doctor/**`: clean; no further surface there. (iteration 10)
- Doctor or validator edits: no mode references exist in them. (iteration 10)
- Escalating `cite-drift-redirects.json`: resolved as spec-tree history. (iteration 10)
- Hand-editing compiled dist or sandbox artifacts: both are generated; rebuild/regenerate. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
