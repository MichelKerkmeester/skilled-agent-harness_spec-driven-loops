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
- Topic: How to fully deprecate and remove the skill advisor Ollama and embedding semantic lane with zero remnants: code, tests, docs, doctor routes, env vars, launcher, database tables, the shared embeddings package, changelog and playbook references, and leftovers on repo users machines (pulled model, vectors, background server). Delete, never back up. Produce a complete file:line inventory, a safe removal order with gates, a user-machine cleanup design and a residue check that proves nothing is left.
- Started: 2026-11-20T18:51:25Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: 2026-11-20T18:51:25Z
- Parent Session: 2026-11-20T18:48:42Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Inventory the advisor runtime (code, tests, launcher, database schema) that exists only for Ollama, embeddings or the semantic_shadow lane, with file:line, and how fusion, lane registry and status depend on it | runtime-inventory | 0.75 | 8 | complete |
| 2 | Trace the consumers of system-spec-kit/shared/embeddings and of the HF model server (hf-model-server.cjs, model-server-supervision.cjs, providers/hf-local.ts, the auto-select cascade, spec-kit memory, the sk-doc validator and the spec-kit embedder test suites), to settle whether the package, the model server and the launcher supervision block are deleted whole or in part | shared-package-consumers | 0.85 | 10 | complete |
| 3 | Inventory the doctor surface: .skilled/commands/doctor/_routes.yaml, the embedder workflow asset, the setup, install, update-apply, overlay and symlink YAML and presentation files, the doctor scripts and their tests, with file:line and the required post-removal wording or behavior for each; settle the three small open checks from iteration 2 | doctor-surface | 0.71 | 14 | complete |
| 4 | Sweep the documentation and generated surface outside the doctor folder: the advisor's INSTALL-GUIDE, README, SKILL.md, references, feature catalog and manual testing playbook, INSTALL-SKILLED.md, .env.example and the ENV references, the changelog files, graph-metadata trigger phrases, and the generated routing artifacts | docs-and-generated | 0.87 | 15 | complete |
| 5 | Build the three deliverables from the four inventories: the removal order with a gate after each step, the user-machine cleanup design (vector tables, backup copies, model server, HuggingFace cache, pulled Ollama model, env keys, build output) and the residue check with repo and machine modes; settle the carried-forward open checks and state the operator decisions as options | removal-plan | 0.79 | 14 | complete |

- iterationsCompleted: 5
- keyFindings: 240
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which advisor runtime files, functions, tests, launcher lines and database schema objects (tables, migrations, columns) exist only for Ollama, embeddings or the semantic_shadow lane, with file:line?
- [x] Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder (install, setup, update apply, overlay apply and repin, symlink link, skill-advisor embedder), and what must each say or do after removal?
- [x] Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?
- [x] Who else consumes system-spec-kit/shared/embeddings (auto-select cascade, hf-local model server, spec-kit memory, sk-doc validators), and can the package and its tests be deleted entirely or only in part?
- [x] What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▃▄▅▆▆▇▆▄▃▂▂▃▅▆█▇▇▆▅▅
- score sparkline: ▃▄▅▆▆▇▆▄▃▂▂▃▅▆█▇▇▆▅▅
- Last 3 ratios: 0.71 -> 0.87 -> 0.79
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.79
- coverageBySources: {"code":80,"docs.ollama.com":1,"huggingface.co":1,"other":93}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reading `dist/` as an inventory source: it is untracked build output, so it tells the residue check where stale files live but is not a file to edit. (iteration 1)
- Treating every "embedding" grep hit as a remnant: `routing-parity-deep-skills.vitest.ts` 55 and 71 and `skill_advisor.py` 1793 are prompt or keyword text. (iteration 1)
- `sk-design` as a consumer: it has its own vector store and does not import the package. (iteration 2)
- Keeping part of the package for the cloud providers (OpenAI, Voyage): they have no caller outside the factory, and the factory has no caller outside the lane. (iteration 2)
- Spec-kit memory as a surviving consumer: the memory MCP surface is retired and no spec-kit runtime source imports the package. (iteration 2)
- `release-update.cjs` has one match on the loose pattern (semantic, vector, ollama or embed). The line was not read. It is most likely the word "embed", but that is a guess until the line is read. (iteration 3)
- Hand-editing `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `command-bridges.generated.json` for the embedder bridge: `derive-command-bridges.cjs` regenerates them from `_routes.yaml`. (iteration 3)
- Hand-editing the runtime mirrors: the `.claude`, `.cursor` and `.opencode` doctor entries are symlinks into `.skilled`, and the `.codex`, `.pi` and `.vibe` prompt files carry no lane text. (iteration 3)
- Looking for a contract test that pins the informational vector coverage lines: the update, overlay, symlink and setup contract tests assert none of them. (iteration 3)
- The wide first pattern included "coverage", "embedding" and "vector", which matched 53 doctor files. Most are unrelated: test coverage, the deep-loop coverage graph, `/doctor:agents-md embed`. Files with only those matches are not remnants: `doctor-deep-loop.yaml`, `doctor-skill-advisor-tune.yaml`, `sk-skill-check.cjs` (zero matches on the strict pattern), `doctor-speckit-retrieval.yaml` 48 (describes the retired continuity database, not the advisor lane). (iteration 3)
- Grepping the raw `trigger-index.json` as a residue signal: 981 of its 989 matching paths are under `specs/`, so the file matches for as long as historical packets exist. (iteration 4)
- Looking for other skills' `graph-metadata.json` trigger phrases: only the advisor's own file matches. (iteration 4)
- Runtime mirror folders as a separate doc surface: the tracked-file sweep found no match outside `.skilled/`, `.github/`, `README.md`, `INSTALL-SKILLED.md` and `.env.example`. (iteration 4)
- The files in F14 are not remnants and should not be revisited as inventory: cli-codex `--oss`, mcp-figma, sk-design's vector store, the deep-loop `semantic_shadow_only` namesake, sk-create-benchmark case studies, cite-drift redirects, sk-code `sqlite-vec` examples. (iteration 4)
- Treating the strict pattern as sufficient: 66 files, including the advisor's `SKILL.md`, `ROUTER.md` and `graph-metadata.json`, match only the second vocabulary. (iteration 4)
- A build-tool clean for the shared package's stale output: it works from sources that still exist, and the package has no clean script. (iteration 5)
- Directory-prefix allowlist rows. Counting sk-design and sk-code as whole folders gave 22 candidates and would hide a real remnant placed in those folders later. Rows are exact paths. (iteration 5)
- Persisting a "keep the model" answer: it writes new lane state onto the user's machine. (iteration 5)
- Reading `.env` with a shell command: a hook refuses it. The sanctioned route returns key names only. (iteration 5)
- Routing the database cleanup through `/doctor:skill-advisor rebuild`: it backs the old database up and keeps the copy, which carries the vectors forward. (iteration 5)

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
