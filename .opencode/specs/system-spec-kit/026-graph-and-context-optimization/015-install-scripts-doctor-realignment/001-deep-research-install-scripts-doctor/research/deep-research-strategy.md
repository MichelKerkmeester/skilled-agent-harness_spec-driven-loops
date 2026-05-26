---
title: Deep Research Strategy - Install guides / scripts / doctor realignment
description: Session tracking for the cli-codex gpt-5.5 deep-research audit of install guides, scripts, and /doctor commands post-CocoIndex-deprecation + 116 deep-skill-evolution impact.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Persistent brain for the deep-research deep-dive on the OPERATOR-FACING infrastructure surfaces (install guides, setup/launcher/hook scripts, /doctor diagnostic commands) — checking whether they still reflect a removed CocoIndex/ccc/rerank-sidecar world, and whether the 116 deep-skill-evolution arc (sk->deep renames, council, deep-loop-runtime relocation, hooks/skills-index) left stale references there.

---

## 2. TOPIC
Are the install guides, setup/launcher scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality? And did 116 deep-skill-evolution (renames + relocations) leave stale skill names / moved script paths / renamed commands in those surfaces? Research/audit only — findings feed the rework phases (015/002+).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Do INSTALL_GUIDE.md files (system-spec-kit, system-code-graph, others) still tell operators to install/configure the removed CocoIndex / `ccc` CLI / `.venv` / coco daemon, or carry embedder/reranker chooser tables that reference removed models (cross-encoder, CodeRankEmbed-as-default)?
- [ ] Q2: Do setup/launcher/hook/copy scripts (`.opencode/scripts/`, skill `scripts/`, install-git-hooks.sh, launcher scripts, copy-skill-advisor) still reference / set up / health-check the removed coco daemon, `ccc`, rerank sidecar, or `.cocoindex_code`?
- [ ] Q3: Do `/doctor` + `/doctor:*` commands still health-check / repair / route to a removed cocoindex daemon (a `doctor:cocoindex` route, coco/ccc reindex steps, rerank-sidecar checks)? Is the doctor route manifest internally consistent post-coco?
- [ ] Q4: Did 116 deep-skill-evolution (sk->deep skill renames, ai-council/deep-ai-council, deep-loop-runtime relocation from 003, hooks + skills-index rework) leave STALE references in the install/scripts/doctor surfaces — old skill names, moved script paths, renamed commands, dead skills-index entries?
- [ ] Q5: Cross-surface + 4-runtime consistency — are the install/scripts/doctor surfaces internally consistent and mirror-consistent across the 4 runtimes (.opencode/.claude/.codex/.gemini) for tool counts, skill names, and command routing post-coco + post-116?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-litigating the CocoIndex / LLM-reranker deprecation decisions (settled).
- Implementing fixes — research/audit only; findings feed the 015/002+ rework phases.
- Re-covering the rerank-residue surfaces already audited by 017's deep-research (code/docs/configs/types/command-prompts) UNLESS they intersect install/scripts/doctor.
- Frozen/historical records (benchmarks, z_archive, changelogs).

---

## 5. STOP CONDITIONS
- Composite convergence (newInfoRatio < 0.05 across rolling/MAD/entropy, graph-assisted), OR
- All 5 key questions answered with evidence, OR
- maxIterations (10) reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **[INFO / ALREADY-REPORTED]** `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:78` and `.opencode/commands/doctor/assets/doctor_update.yaml:106` — stale `mcp_server/database/deep-loop-graph.sqlite` allow-list entries remain valid, but iteration 003 already reported them; this pass only adds the newly discovered `deep-loop-runtime/storage` to `deep-loop-runtime/database` drift. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **[INFO / ALREADY-REPORTED]** `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:78` and `.opencode/commands/doctor/assets/doctor_update.yaml:106` — stale `mcp_server/database/deep-loop-graph.sqlite` allow-list entries remain valid, but iteration 003 already reported them; this pass only adds the newly discovered `deep-loop-runtime/storage` to `deep-loop-runtime/database` drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **[INFO / ALREADY-REPORTED]** `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:78` and `.opencode/commands/doctor/assets/doctor_update.yaml:106` — stale `mcp_server/database/deep-loop-graph.sqlite` allow-list entries remain valid, but iteration 003 already reported them; this pass only adds the newly discovered `deep-loop-runtime/storage` to `deep-loop-runtime/database` drift.

### **[INFO / ALREADY-REPORTED]** `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh:14` — the `sk-ai-council` script casualty remains valid, but iteration 002 already reported it as a Q4 note, so this pass does not count it as new. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **[INFO / ALREADY-REPORTED]** `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh:14` — the `sk-ai-council` script casualty remains valid, but iteration 002 already reported it as a Q4 note, so this pass does not count it as new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **[INFO / ALREADY-REPORTED]** `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh:14` — the `sk-ai-council` script casualty remains valid, but iteration 002 already reported it as a Q4 note, so this pass does not count it as new.

### **[INFO / CORRECT]** `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:87` — the advisor skill graph itself uses current `deep-agent-improvement`, `deep-ai-council`, `deep-loop-runtime`, `deep-research`, and `deep-review` ids, so the stale `sk-deep-*` issue is in fixtures/corpora, not the live graph file. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **[INFO / CORRECT]** `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:87` — the advisor skill graph itself uses current `deep-agent-improvement`, `deep-ai-council`, `deep-loop-runtime`, `deep-research`, and `deep-review` ids, so the stale `sk-deep-*` issue is in fixtures/corpora, not the live graph file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **[INFO / CORRECT]** `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:87` — the advisor skill graph itself uses current `deep-agent-improvement`, `deep-ai-council`, `deep-loop-runtime`, `deep-research`, and `deep-review` ids, so the stale `sk-deep-*` issue is in fixtures/corpora, not the live graph file.

### **[INFO / HISTORICAL]** `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl:164` — old `labelSkill` and `advisorTopSkill` rows are measurement output records with generated timestamps, not live routing configuration; keep as historical evidence unless a script treats them as an input corpus. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **[INFO / HISTORICAL]** `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl:164` — old `labelSkill` and `advisorTopSkill` rows are measurement output records with generated timestamps, not live routing configuration; keep as historical evidence unless a script treats them as an input corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **[INFO / HISTORICAL]** `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl:164` — old `labelSkill` and `advisorTopSkill` rows are measurement output records with generated timestamps, not live routing configuration; keep as historical evidence unless a script treats them as an input corpus.

### `.codex/agents/ai-council.toml:20` matched `sk-ai-council` only as a substring inside the valid command `/deep:ask-ai-council`. Classification: CORRECT. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `.codex/agents/ai-council.toml:20` matched `sk-ai-council` only as a substring inside the valid command `/deep:ask-ai-council`. Classification: CORRECT.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.codex/agents/ai-council.toml:20` matched `sk-ai-council` only as a substring inside the valid command `/deep:ask-ai-council`. Classification: CORRECT.

### `.opencode/scripts/copy-skill-advisor-dist-data.sh:25-44` copies JSON data from `system-skill-advisor/mcp_server/data` into the compiled dist data directory; it does not copy or build removed embedder, reranker, sidecar, CocoIndex, or `ccc` artifacts. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `.opencode/scripts/copy-skill-advisor-dist-data.sh:25-44` copies JSON data from `system-skill-advisor/mcp_server/data` into the compiled dist data directory; it does not copy or build removed embedder, reranker, sidecar, CocoIndex, or `ccc` artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/scripts/copy-skill-advisor-dist-data.sh:25-44` copies JSON data from `system-skill-advisor/mcp_server/data` into the compiled dist data directory; it does not copy or build removed embedder, reranker, sidecar, CocoIndex, or `ccc` artifacts.

### `.opencode/scripts/install-git-hooks.sh:21-50` installs only files from `.opencode/scripts/git-hooks`, and the current hook templates at `.opencode/scripts/git-hooks/pre-commit:22` and `.opencode/scripts/git-hooks/post-commit:43-65` reference the doc-model validator and structural code-graph DB invalidation, not CocoIndex/`ccc`/rerank sidecar paths. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `.opencode/scripts/install-git-hooks.sh:21-50` installs only files from `.opencode/scripts/git-hooks`, and the current hook templates at `.opencode/scripts/git-hooks/pre-commit:22` and `.opencode/scripts/git-hooks/post-commit:43-65` reference the doc-model validator and structural code-graph DB invalidation, not CocoIndex/`ccc`/rerank sidecar paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/scripts/install-git-hooks.sh:21-50` installs only files from `.opencode/scripts/git-hooks`, and the current hook templates at `.opencode/scripts/git-hooks/pre-commit:22` and `.opencode/scripts/git-hooks/post-commit:43-65` reference the doc-model validator and structural code-graph DB invalidation, not CocoIndex/`ccc`/rerank sidecar paths.

### `.spec-kit/code-graph/database` net-new matches were ruled CORRECT because `.opencode/bin/mk-code-index-launcher.cjs:97-99` sets that directory as the current standalone shared default. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `.spec-kit/code-graph/database` net-new matches were ruled CORRECT because `.opencode/bin/mk-code-index-launcher.cjs:97-99` sets that directory as the current standalone shared default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.spec-kit/code-graph/database` net-new matches were ruled CORRECT because `.opencode/bin/mk-code-index-launcher.cjs:97-99` sets that directory as the current standalone shared default.

### `cocoindex` net-new matches were generated inventories or fixtures only: `.no-frontmatter-list.txt`, `.unscanned.txt`, `.folder-list.txt`, and memory-quality fixture expected trigger strings. Classification: HISTORICAL/CORRECT, not fix targets. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `cocoindex` net-new matches were generated inventories or fixtures only: `.no-frontmatter-list.txt`, `.unscanned.txt`, `.folder-list.txt`, and memory-quality fixture expected trigger strings. Classification: HISTORICAL/CORRECT, not fix targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cocoindex` net-new matches were generated inventories or fixtures only: `.no-frontmatter-list.txt`, `.unscanned.txt`, `.folder-list.txt`, and memory-quality fixture expected trigger strings. Classification: HISTORICAL/CORRECT, not fix targets.

### `rerank` net-new matches outside cataloged cross-encoder lines were MMR references, legacy model-name detectors, migration owner-map keys, generated folder inventories, or kept historical measurement outputs. Classification: CORRECT/HISTORICAL. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `rerank` net-new matches outside cataloged cross-encoder lines were MMR references, legacy model-name detectors, migration owner-map keys, generated folder inventories, or kept historical measurement outputs. Classification: CORRECT/HISTORICAL.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rerank` net-new matches outside cataloged cross-encoder lines were MMR references, legacy model-name detectors, migration owner-map keys, generated folder inventories, or kept historical measurement outputs. Classification: CORRECT/HISTORICAL.

### `route-validate.sh` confirmed schema version, duplicate-target checks, YAML asset existence, mutation-class validity, and trigger phrases for the six core routes; the remaining validator problem is the skipped frontmatter subset check, not missing route YAML assets. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `route-validate.sh` confirmed schema version, duplicate-target checks, YAML asset existence, mutation-class validity, and trigger phrases for the six core routes; the remaining validator problem is the skipped frontmatter subset check, not missing route YAML assets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `route-validate.sh` confirmed schema version, duplicate-target checks, YAML asset existence, mutation-class validity, and trigger phrases for the six core routes; the remaining validator problem is the skipped frontmatter subset check, not missing route YAML assets.

### `sidecar` net-new matches referenced the active embedder sidecar (`sidecar-client.ts`) or skill-advisor Python fallback behavior, not the deleted rerank sidecar. Classification: CORRECT. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `sidecar` net-new matches referenced the active embedder sidecar (`sidecar-client.ts`) or skill-advisor Python fallback behavior, not the deleted rerank sidecar. Classification: CORRECT.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sidecar` net-new matches referenced the active embedder sidecar (`sidecar-client.ts`) or skill-advisor Python fallback behavior, not the deleted rerank sidecar. Classification: CORRECT.

### Clean after subtracting cataloged hits: `\b11 (graph )?tools\b`, `\b39 tools\b`, `\b64 tools\b`, `\bccc\b`, `coco.?daemon`, `\b8765\b`, `semantic search daemon`, `sk-research`, `sk-review`, `sk-agent-improvement`, and `mcp__mk_spec_memory__advisor`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Clean after subtracting cataloged hits: `\b11 (graph )?tools\b`, `\b39 tools\b`, `\b64 tools\b`, `\bccc\b`, `coco.?daemon`, `\b8765\b`, `semantic search daemon`, `sk-research`, `sk-review`, `sk-agent-improvement`, and `mcp__mk_spec_memory__advisor`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Clean after subtracting cataloged hits: `\b11 (graph )?tools\b`, `\b39 tools\b`, `\b64 tools\b`, `\bccc\b`, `coco.?daemon`, `\b8765\b`, `semantic search daemon`, `sk-research`, `sk-review`, `sk-agent-improvement`, and `mcp__mk_spec_memory__advisor`.

### CocoIndex/ccc strings found under `.opencode/skills/system-code-graph/changelog/` are historical changelog content, not live `/doctor` execution paths. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: CocoIndex/ccc strings found under `.opencode/skills/system-code-graph/changelog/` are historical changelog content, not live `/doctor` execution paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CocoIndex/ccc strings found under `.opencode/skills/system-code-graph/changelog/` are historical changelog content, not live `/doctor` execution paths.

### CORRECT/IN-SYNC | `.opencode/commands/doctor` and `.claude/commands/doctor` had no `diff -qr` output, so every doctor drift observed in those two trees is shared-stale mirror parity, not `.claude`-only divergence. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: CORRECT/IN-SYNC | `.opencode/commands/doctor` and `.claude/commands/doctor` had no `diff -qr` output, so every doctor drift observed in those two trees is shared-stale mirror parity, not `.claude`-only divergence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CORRECT/IN-SYNC | `.opencode/commands/doctor` and `.claude/commands/doctor` had no `diff -qr` output, so every doctor drift observed in those two trees is shared-stale mirror parity, not `.claude`-only divergence.

### CORRECT/IN-SYNC | The full `/doctor` tree is expected only in `.opencode` and `.claude`; discovery found `.gemini/commands/doctor/{mcp,speckit,update}.toml` as thin wrappers and no `.codex/commands/doctor` directory, so Codex does not have a doctor command mirror to compare. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: CORRECT/IN-SYNC | The full `/doctor` tree is expected only in `.opencode` and `.claude`; discovery found `.gemini/commands/doctor/{mcp,speckit,update}.toml` as thin wrappers and no `.codex/commands/doctor` directory, so Codex does not have a doctor command mirror to compare.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CORRECT/IN-SYNC | The full `/doctor` tree is expected only in `.opencode` and `.claude`; discovery found `.gemini/commands/doctor/{mcp,speckit,update}.toml` as thin wrappers and no `.codex/commands/doctor` directory, so Codex does not have a doctor command mirror to compare.

### CORRECT/IN-SYNC | The requested doctor/install scoped skill-name grep found no `sk-deep-*`, `sk-ai-council`, `sk-research`, or `sk-review` hits under `.claude`, `.codex`, or `.gemini` doctor/install surfaces; the stale `sk-deep-research` hit is in the Gemini deep command mirror, not in `/doctor`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: CORRECT/IN-SYNC | The requested doctor/install scoped skill-name grep found no `sk-deep-*`, `sk-ai-council`, `sk-research`, or `sk-review` hits under `.claude`, `.codex`, or `.gemini` doctor/install surfaces; the stale `sk-deep-research` hit is in the Gemini deep command mirror, not in `/doctor`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CORRECT/IN-SYNC | The requested doctor/install scoped skill-name grep found no `sk-deep-*`, `sk-ai-council`, `sk-research`, or `sk-review` hits under `.claude`, `.codex`, or `.gemini` doctor/install surfaces; the stale `sk-deep-research` hit is in the Gemini deep command mirror, not in `/doctor`.

### CORRECT/IN-SYNC | The scoped grep found no `39 tools` or `64 tools` claims in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or `.codex`; the live stale count in this pass is the shared `11 graph tools` claim in `mcp-doctor.sh`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: CORRECT/IN-SYNC | The scoped grep found no `39 tools` or `64 tools` claims in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or `.codex`; the live stale count in this pass is the shared `11 graph tools` claim in `mcp-doctor.sh`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CORRECT/IN-SYNC | The scoped grep found no `39 tools` or `64 tools` claims in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or `.codex`; the live stale count in this pass is the shared `11 graph tools` claim in `mcp-doctor.sh`.

### No `*.sh` or `*.cjs` script in `.opencode/scripts`, `.github/hooks`, skill `scripts`, or skill `mcp_server/scripts` contains `cocoindex`, `ccc`, `ccc search/index/mcp/status/reindex`, `coco-daemon`-style text, `.venv`, or `.cocoindex_code`; Q2 removed CocoIndex/`ccc` runtime setup residue is ruled out for this script set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No `*.sh` or `*.cjs` script in `.opencode/scripts`, `.github/hooks`, skill `scripts`, or skill `mcp_server/scripts` contains `cocoindex`, `ccc`, `ccc search/index/mcp/status/reindex`, `coco-daemon`-style text, `.venv`, or `.cocoindex_code`; Q2 removed CocoIndex/`ccc` runtime setup residue is ruled out for this script set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `*.sh` or `*.cjs` script in `.opencode/scripts`, `.github/hooks`, skill `scripts`, or skill `mcp_server/scripts` contains `cocoindex`, `ccc`, `ccc search/index/mcp/status/reindex`, `coco-daemon`-style text, `.venv`, or `.cocoindex_code`; Q2 removed CocoIndex/`ccc` runtime setup residue is ruled out for this script set.

### No `doctor:cocoindex`, `doctor-cocoindex-daemon`, or `cocoindex-daemon` route/playbook survived in the doctor command inventories. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No `doctor:cocoindex`, `doctor-cocoindex-daemon`, or `cocoindex-daemon` route/playbook survived in the doctor command inventories.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `doctor:cocoindex`, `doctor-cocoindex-daemon`, or `cocoindex-daemon` route/playbook survived in the doctor command inventories.

### No `INSTALL_GUIDE.md` across the 5 swept guides tells operators to install or run CocoIndex, the `ccc` CLI, a coco-daemon, `.venv`, or `.cocoindex_code` — install-guide CocoIndex/ccc install residue is ruled out for this surface. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No `INSTALL_GUIDE.md` across the 5 swept guides tells operators to install or run CocoIndex, the `ccc` CLI, a coco-daemon, `.venv`, or `.cocoindex_code` — install-guide CocoIndex/ccc install residue is ruled out for this surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `INSTALL_GUIDE.md` across the 5 swept guides tells operators to install or run CocoIndex, the `ccc` CLI, a coco-daemon, `.venv`, or `.cocoindex_code` — install-guide CocoIndex/ccc install residue is ruled out for this surface.

### No further DB-path variants beyond the three code-graph claims (`mcp_server/database`, `system-code-graph/database`, `.spec-kit/code-graph/database`) and three deep-loop claims (`mcp_server/database`, `storage`, `database`) — the path space is fully enumerated and each is now classified. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No further DB-path variants beyond the three code-graph claims (`mcp_server/database`, `system-code-graph/database`, `.spec-kit/code-graph/database`) and three deep-loop claims (`mcp_server/database`, `storage`, `database`) — the path space is fully enumerated and each is now classified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No further DB-path variants beyond the three code-graph claims (`mcp_server/database`, `system-code-graph/database`, `.spec-kit/code-graph/database`) and three deep-loop claims (`mcp_server/database`, `storage`, `database`) — the path space is fully enumerated and each is now classified.

### No live `cocoindex`, `CocoIndex`, `ccc`, `coco.?daemon`, `doctor:cocoindex`, `cocoindex-daemon`, `rerank`, `sidecar`, `8765`, `cross-encoder`, or `cocoIndexAvailable` hits were found in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or the checked doctor scripts, except a correct read-only `reindex` prohibition in `doctor_skill-budget.yaml`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No live `cocoindex`, `CocoIndex`, `ccc`, `coco.?daemon`, `doctor:cocoindex`, `cocoindex-daemon`, `rerank`, `sidecar`, `8765`, `cross-encoder`, or `cocoIndexAvailable` hits were found in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or the checked doctor scripts, except a correct read-only `reindex` prohibition in `doctor_skill-budget.yaml`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No live `cocoindex`, `CocoIndex`, `ccc`, `coco.?daemon`, `doctor:cocoindex`, `cocoindex-daemon`, `rerank`, `sidecar`, `8765`, `cross-encoder`, or `cocoIndexAvailable` hits were found in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or the checked doctor scripts, except a correct read-only `reindex` prohibition in `doctor_skill-budget.yaml`.

### No requested script contains rerank-sidecar runtime wiring: no `sidecar`, `8765`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, or `rerank_sidecar` hits were present in the targeted `*.sh`/`*.cjs` sweep. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No requested script contains rerank-sidecar runtime wiring: no `sidecar`, `8765`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, or `rerank_sidecar` hits were present in the targeted `*.sh`/`*.cjs` sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No requested script contains rerank-sidecar runtime wiring: no `sidecar`, `8765`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, or `rerank_sidecar` hits were present in the targeted `*.sh`/`*.cjs` sweep.

### No targeted script references the deleted `pre-push-council.sh`; both `.opencode/scripts/git-hooks/pre-push-council.sh` and `.github/hooks/scripts/pre-push-council.sh` are absent, so the prior council pre-push hook deletion has no installer residue in the swept script surfaces. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No targeted script references the deleted `pre-push-council.sh`; both `.opencode/scripts/git-hooks/pre-push-council.sh` and `.github/hooks/scripts/pre-push-council.sh` are absent, so the prior council pre-push hook deletion has no installer residue in the swept script surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No targeted script references the deleted `pre-push-council.sh`; both `.opencode/scripts/git-hooks/pre-push-council.sh` and `.github/hooks/scripts/pre-push-council.sh` are absent, so the prior council pre-push hook deletion has no installer residue in the swept script surfaces.

### The canonical `.opencode/commands/doctor/_routes.yaml` core route list is post-Coco: it contains exactly six subsystem routes and no semantic-daemon/CocoIndex route. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The canonical `.opencode/commands/doctor/_routes.yaml` core route list is post-Coco: it contains exactly six subsystem routes and no semantic-daemon/CocoIndex route.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The canonical `.opencode/commands/doctor/_routes.yaml` core route list is post-Coco: it contains exactly six subsystem routes and no semantic-daemon/CocoIndex route.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: Do INSTALL_GUIDE.md files (system-spec-kit, system-code-graph, others) still tell operators to install/configure the removed CocoIndex / `ccc` CLI / `.venv` / coco daemon, or carry embedder/reranker chooser tables that reference removed models (cross-encoder, CodeRankEmbed-as-default)?

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
- CocoIndex (mcp-coco-index skill) + `ccc` CLI + `.venv`/`.cocoindex_code` + rerank sidecar were DELETED in the 014 arc. system-code-graph is now tree-sitter STRUCTURAL (no embeddings), identity `mk_code_index`, 8 MCP tools. mk-spec-memory default embedder = nomic-embed-text-v1.5. mk-spec-memory = 35 MCP tools.
- 017's deep-research already audited the rerank/coco residue in CODE/DOCS/CONFIGS/TYPES/command-prompts (4 P1 + 8 P2 + 1 P3, remediated). This packet targets a DIFFERENT surface set: operator install guides + scripts + /doctor diagnostics — NOT yet audited.
- 116 deep-skill-evolution: renamed sk-* deep skills to deep-* (sk-ai-council->deep-ai-council, etc.), reworked council, relocated deep-loop-runtime out of 003, reworked root docs + hooks + skills-index (115/005). These renames/relocations may have left stale skill-name/script-path references in install/scripts/doctor.
- `/doctor` is an argv-positional router (memory/causal-graph/code-graph/deep-loop/skill-advisor/skill-budget); `/doctor:mcp`, `/doctor:update`. The colon-form `/doctor:<name>` legacy routes were removed. A historical `/doctor:cocoindex` reference exists in a changelog (historical, OK).
- KEPT exceptions (NOT misses): frozen benchmarks, z_archive, changelogs, the RM-8/proactive-cleanup `pkill ccc search` was just removed from cli-* skills in the 017 remediation (so should be GONE now — flag if any cli-* still has it).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 | Convergence: 0.05 | Per-iteration: 12 tool calls, 10 min | Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Executor: cli-codex / gpt-5.5 / reasoningEffort=high / serviceTier=fast, one-at-a-time with kill+RSS between dispatches
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1 | Started: 2026-05-26T05:50:03.683Z
