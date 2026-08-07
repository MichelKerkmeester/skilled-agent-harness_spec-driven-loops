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
- Topic: Are the install guides, setup/launcher scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality, and did the 116 deep-skill-evolution work (sk->deep renames, council, deep-loop-runtime relocation) leave stale references in those surfaces?
- Started: 2026-05-26T05:50:03.683Z
- Status: INITIALIZED
- Iteration: 7 of 10
- Session ID: 70859d71-f191-429c-96cd-6b73bb9745d8
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Q1 install-guide sweep | - | 0.72 | 0 | insight |
| undefined | Q2 scripts sweep | - | 0.66 | 0 | insight |
| undefined | Q3 doctor route surface | - | 0.61 | 0 | insight |
| undefined | Q4 systematic 116 rename/relocation sweep | - | 0.68 | 0 | insight |
| undefined | Q5 4-runtime mirror consistency | - | 0.74 | 0 | insight |
| undefined | long-tail sweep closeout | - | 0.31 | 0 | insight |
| undefined | source-of-truth DB-path resolution (logic-sync) | - | 0.10 | 0 | insight |

- iterationsCompleted: 7
- keyFindings: 45
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: Do INSTALL_GUIDE.md files (system-spec-kit, system-code-graph, others) still tell operators to install/configure the removed CocoIndex / `ccc` CLI / `.venv` / coco daemon, or carry embedder/reranker chooser tables that reference removed models (cross-encoder, CodeRankEmbed-as-default)?
- [ ] Q2: Do setup/launcher/hook/copy scripts (`.opencode/scripts/`, skill `scripts/`, install-git-hooks.sh, launcher scripts, copy-skill-advisor) still reference / set up / health-check the removed coco daemon, `ccc`, rerank sidecar, or `.cocoindex_code`?
- [ ] Q3: Do `/doctor` + `/doctor:*` commands still health-check / repair / route to a removed cocoindex daemon (a `doctor:cocoindex` route, coco/ccc reindex steps, rerank-sidecar checks)? Is the doctor route manifest internally consistent post-coco?
- [ ] Q4: Did 116 deep-skill-evolution (sk->deep skill renames, ai-council/deep-ai-council, deep-loop-runtime relocation from 003, hooks + skills-index rework) leave STALE references in the install/scripts/doctor surfaces — old skill names, moved script paths, renamed commands, dead skills-index entries?
- [ ] Q5: Cross-surface + 4-runtime consistency — are the install/scripts/doctor surfaces internally consistent and mirror-consistent across the 4 runtimes (.opencode/.claude/.codex/.gemini) for tool counts, skill names, and command routing post-coco + post-116?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Q1: Do INSTALL_GUIDE.md files (system-spec-kit, system-code-graph, others) still tell operators to install/configure the removed CocoIndex / `ccc` CLI / `.venv` / coco daemon, or carry embedder/reranker chooser tables that reference removed models (cross-encoder, CodeRankEmbed-as-default)?
- [ ] Q2: Do setup/launcher/hook/copy scripts (`.opencode/scripts/`, skill `scripts/`, install-git-hooks.sh, launcher scripts, copy-skill-advisor) still reference / set up / health-check the removed coco daemon, `ccc`, rerank sidecar, or `.cocoindex_code`?
- [ ] Q3: Do `/doctor` + `/doctor:*` commands still health-check / repair / route to a removed cocoindex daemon (a `doctor:cocoindex` route, coco/ccc reindex steps, rerank-sidecar checks)? Is the doctor route manifest internally consistent post-coco?
- [ ] Q4: Did 116 deep-skill-evolution (sk->deep skill renames, ai-council/deep-ai-council, deep-loop-runtime relocation from 003, hooks + skills-index rework) leave STALE references in the install/scripts/doctor surfaces — old skill names, moved script paths, renamed commands, dead skills-index entries?
- [ ] Q5: Cross-surface + 4-runtime consistency — are the install/scripts/doctor surfaces internally consistent and mirror-consistent across the 4 runtimes (.opencode/.claude/.codex/.gemini) for tool counts, skill names, and command routing post-coco + post-116?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.74 -> 0.31 -> 0.10
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.10
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- No `INSTALL_GUIDE.md` across the 5 swept guides tells operators to install or run CocoIndex, the `ccc` CLI, a coco-daemon, `.venv`, or `.cocoindex_code` — install-guide CocoIndex/ccc install residue is ruled out for this surface. (iteration 1)
- `.opencode/scripts/copy-skill-advisor-dist-data.sh:25-44` copies JSON data from `system-skill-advisor/mcp_server/data` into the compiled dist data directory; it does not copy or build removed embedder, reranker, sidecar, CocoIndex, or `ccc` artifacts. (iteration 2)
- `.opencode/scripts/install-git-hooks.sh:21-50` installs only files from `.opencode/scripts/git-hooks`, and the current hook templates at `.opencode/scripts/git-hooks/pre-commit:22` and `.opencode/scripts/git-hooks/post-commit:43-65` reference the doc-model validator and structural code-graph DB invalidation, not CocoIndex/`ccc`/rerank sidecar paths. (iteration 2)
- No `*.sh` or `*.cjs` script in `.opencode/scripts`, `.github/hooks`, skill `scripts`, or skill `mcp_server/scripts` contains `cocoindex`, `ccc`, `ccc search/index/mcp/status/reindex`, `coco-daemon`-style text, `.venv`, or `.cocoindex_code`; Q2 removed CocoIndex/`ccc` runtime setup residue is ruled out for this script set. (iteration 2)
- No requested script contains rerank-sidecar runtime wiring: no `sidecar`, `8765`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, or `rerank_sidecar` hits were present in the targeted `*.sh`/`*.cjs` sweep. (iteration 2)
- No targeted script references the deleted `pre-push-council.sh`; both `.opencode/scripts/git-hooks/pre-push-council.sh` and `.github/hooks/scripts/pre-push-council.sh` are absent, so the prior council pre-push hook deletion has no installer residue in the swept script surfaces. (iteration 2)
- `route-validate.sh` confirmed schema version, duplicate-target checks, YAML asset existence, mutation-class validity, and trigger phrases for the six core routes; the remaining validator problem is the skipped frontmatter subset check, not missing route YAML assets. (iteration 3)
- CocoIndex/ccc strings found under `.opencode/skills/system-code-graph/changelog/` are historical changelog content, not live `/doctor` execution paths. (iteration 3)
- No `doctor:cocoindex`, `doctor-cocoindex-daemon`, or `cocoindex-daemon` route/playbook survived in the doctor command inventories. (iteration 3)
- No live `cocoindex`, `CocoIndex`, `ccc`, `coco.?daemon`, `doctor:cocoindex`, `cocoindex-daemon`, `rerank`, `sidecar`, `8765`, `cross-encoder`, or `cocoIndexAvailable` hits were found in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or the checked doctor scripts, except a correct read-only `reindex` prohibition in `doctor_skill-budget.yaml`. (iteration 3)
- The canonical `.opencode/commands/doctor/_routes.yaml` core route list is post-Coco: it contains exactly six subsystem routes and no semantic-daemon/CocoIndex route. (iteration 3)
- **[INFO / ALREADY-REPORTED]** `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:78` and `.opencode/commands/doctor/assets/doctor_update.yaml:106` — stale `mcp_server/database/deep-loop-graph.sqlite` allow-list entries remain valid, but iteration 003 already reported them; this pass only adds the newly discovered `deep-loop-runtime/storage` to `deep-loop-runtime/database` drift. (iteration 4)
- **[INFO / ALREADY-REPORTED]** `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh:14` — the `sk-ai-council` script casualty remains valid, but iteration 002 already reported it as a Q4 note, so this pass does not count it as new. (iteration 4)
- **[INFO / CORRECT]** `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:87` — the advisor skill graph itself uses current `deep-agent-improvement`, `deep-ai-council`, `deep-loop-runtime`, `deep-research`, and `deep-review` ids, so the stale `sk-deep-*` issue is in fixtures/corpora, not the live graph file. (iteration 4)
- **[INFO / HISTORICAL]** `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl:164` — old `labelSkill` and `advisorTopSkill` rows are measurement output records with generated timestamps, not live routing configuration; keep as historical evidence unless a script treats them as an input corpus. (iteration 4)
- CORRECT/IN-SYNC | `.opencode/commands/doctor` and `.claude/commands/doctor` had no `diff -qr` output, so every doctor drift observed in those two trees is shared-stale mirror parity, not `.claude`-only divergence. (iteration 5)
- CORRECT/IN-SYNC | The full `/doctor` tree is expected only in `.opencode` and `.claude`; discovery found `.gemini/commands/doctor/{mcp,speckit,update}.toml` as thin wrappers and no `.codex/commands/doctor` directory, so Codex does not have a doctor command mirror to compare. (iteration 5)
- CORRECT/IN-SYNC | The requested doctor/install scoped skill-name grep found no `sk-deep-*`, `sk-ai-council`, `sk-research`, or `sk-review` hits under `.claude`, `.codex`, or `.gemini` doctor/install surfaces; the stale `sk-deep-research` hit is in the Gemini deep command mirror, not in `/doctor`. (iteration 5)
- CORRECT/IN-SYNC | The scoped grep found no `39 tools` or `64 tools` claims in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or `.codex`; the live stale count in this pass is the shared `11 graph tools` claim in `mcp-doctor.sh`. (iteration 5)
- `.codex/agents/ai-council.toml:20` matched `sk-ai-council` only as a substring inside the valid command `/deep:ask-ai-council`. Classification: CORRECT. (iteration 6)
- `.spec-kit/code-graph/database` net-new matches were ruled CORRECT because `.opencode/bin/mk-code-index-launcher.cjs:97-99` sets that directory as the current standalone shared default. (iteration 6)
- `cocoindex` net-new matches were generated inventories or fixtures only: `.no-frontmatter-list.txt`, `.unscanned.txt`, `.folder-list.txt`, and memory-quality fixture expected trigger strings. Classification: HISTORICAL/CORRECT, not fix targets. (iteration 6)
- `rerank` net-new matches outside cataloged cross-encoder lines were MMR references, legacy model-name detectors, migration owner-map keys, generated folder inventories, or kept historical measurement outputs. Classification: CORRECT/HISTORICAL. (iteration 6)
- `sidecar` net-new matches referenced the active embedder sidecar (`sidecar-client.ts`) or skill-advisor Python fallback behavior, not the deleted rerank sidecar. Classification: CORRECT. (iteration 6)
- Clean after subtracting cataloged hits: `\b11 (graph )?tools\b`, `\b39 tools\b`, `\b64 tools\b`, `\bccc\b`, `coco.?daemon`, `\b8765\b`, `semantic search daemon`, `sk-research`, `sk-review`, `sk-agent-improvement`, and `mcp__mk_spec_memory__advisor`. (iteration 6)
- No further DB-path variants beyond the three code-graph claims (`mcp_server/database`, `system-code-graph/database`, `.spec-kit/code-graph/database`) and three deep-loop claims (`mcp_server/database`, `storage`, `database`) — the path space is fully enumerated and each is now classified. (iteration 7)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1: Do INSTALL_GUIDE.md files (system-spec-kit, system-code-graph, others) still tell operators to install/configure the removed CocoIndex / `ccc` CLI / `.venv` / coco daemon, or carry embedder/reranker chooser tables that reference removed models (cross-encoder, CodeRankEmbed-as-default)?

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
