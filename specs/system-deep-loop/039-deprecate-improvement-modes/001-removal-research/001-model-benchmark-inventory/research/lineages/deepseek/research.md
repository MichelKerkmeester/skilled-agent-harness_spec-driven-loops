# Model-Benchmark Mode Deletion Inventory — Consolidated Research

**Packet:** `specs/system-deep-loop/039-deprecate-improvement-modes/001-removal-research/001-model-benchmark-inventory`
**Lineage:** `deepseek` (fan-out detached lineage, session `fanout-deepseek-1791657286793-xs8psf`)
**Mode under inventory:** deep-loop `workflowMode: model-benchmark` (`/deep:model-benchmark`, Lane B of the shared `deep-improvement` packet, `loopHostMode: model-benchmark`)
**Iterations:** 10 / 10 · **Stop reason:** `maxIterationsReached` (stopPolicy `max-iterations`; convergence was telemetry only)
**Questions answered:** 5 / 5
**Run scope:** read-only outside this lineage; no repository file was edited, moved, deleted, or staged.

---

## 1. Executive Summary

The model-benchmark mode is a fully wired second lane of the `deep-improvement` packet. It has its own command family (`/deep:model-benchmark`), its own command assets, its own reference/asset/script trees, its own runtime ledger schema/reducers/sealed-artifact packages, its own advisor bridge alias and routing boosts, its own authoring family in `sk-create-benchmark`, its own playbook scenarios and feature-catalog pages, and its own canary coverage in compiled routing. Deletion is therefore a multi-surface change with four distinct work classes:

1. **DELETE** — files and blocks that exist only for this mode (command family, packet Lane B trees, runtime schema packages, sk-create-benchmark family files, playbook/catalog pages, canary case).
2. **EDIT** — shared files where only the mode's rows/blocks/arms are removed (hub registries and routers, `SKILL.md` files, advisor scorer sources, shared scripts, tests, env comments, READMEs, chunked manifests).
3. **SHARED-WITH-AGENT-IMPROVEMENT** — files used by both lanes that must survive (notably `scripts/model-benchmark/run-benchmark.cjs`, `benchmark-profiles/default.json` with its three legacy fixtures, `materialize-benchmark-fixtures.cjs`, `scripts/lib/profile-resolve.cjs`, `scripts/shared/model-family.cjs`, `scripts/shared/extract-deliverable.cjs`, `scripts/shared/loop-host.cjs`, `promote-candidate.cjs`, `reduce-state.cjs`, `deep-improvement-common-*`).
4. **KEEP-AS-HISTORY** — changelogs, historical benchmark reports, anchor-repair parser fixtures, spec-tree redirects.

The highest-risk seam is the Lane A/B carve-out inside `deep-improvement/scripts/`: Lane A invokes the Lane B-named `run-benchmark.cjs` and `benchmark-profiles/default.json` directly, so a naive directory deletion breaks Lane A.

A final gap sweep corrected the record twice: the first sweep missed `BARTER.md` (root), and the dot-wildcard pattern produced one false positive (`cite-drift-redirects.json:366`); the strict dual-mode re-scan (default vs `--no-ignore --hidden`) reconciled every residual file.

---

## 2. Scope, Method, Classification Legend

**Method.** Iteration 1 produced the master file partition with `rg -l -e "model[-_ ]?benchmark"` (specs and node_modules excluded). Iterations 2-9 walked surface families; iteration 10 re-scanned with the strict pattern under both ignore modes and reconciled residuals. Every finding cites `[SOURCE: path:line]` in its iteration file and delta row.

**Classification legend.**
- **DELETE** — the file/block exists only for the model-benchmark mode.
- **EDIT** — shared file; remove the mention/row/arm only.
- **SHARED-WITH-AGENT-IMPROVEMENT** — used by Lane A (agent-improvement) too; must survive.
- **KEEP-AS-HISTORY** — changelogs, archives, historical reports and parser fixtures.

**Scope exclusions.** `specs/**` and `.opencode/specs/**` (spec trees), `.worktrees/**` and `barter/**` (duplicate checkouts), and the lineage-local `containment/**` (this run's artifacts). Ignored-tree coverage was restored with `--no-ignore --hidden` in the gap sweep.

---

## 3. Findings by Surface

### 3.1 Hub registries, routers, metadata (iteration 1)
- `mode-registry.json:130-151` mode block — **DELETE**. `hub-router.json:7,41-45,60-62` (tieBreak entry, intent, alias class) — **DELETE blocks, EDIT array**. `ROUTER.md:46-50,76,100-103` — **EDIT**. `SKILL.md:8,29,49,60,67,163` — **EDIT**. `command-metadata.json:182-225` command entry — **DELETE**; `:176-178` sibling pointer — **EDIT**. `leaf-manifest.json:58-110` leaf set — **DELETE**. `leaf-scopes.json:10-17` — **DELETE**. `graph-metadata.json:112,125` — **EDIT**. `description.json:3,25-26` — **EDIT**. `ARCHITECTURE.md:71,115` — **EDIT**.

### 3.2 Command family (iteration 2)
- `commands/deep/model-benchmark.md` (145 lines) — **DELETE**.
- `commands/deep/assets/deep-model-benchmark-auto.yaml` (246) — **DELETE**.
- `commands/deep/assets/deep-model-benchmark-confirm.yaml` (276) — **DELETE**.
- `commands/deep/assets/deep-model-benchmark-presentation.txt` (489) — **DELETE**.
- Lane B cross-references inside Lane A surfaces: `agent-improvement.md:66,85-86,103,123` — **EDIT**; `deep-agent-improvement-presentation.txt:35,50,74-94,151-155,473-486,491` — **EDIT** (note the underscore filename drift at `:92,154`); `assets/compiled/README.md:23` and `assets/legacy/README.md:23` — **EDIT**; `commands/README.txt:100,181` — **EDIT**.
- Lane B YAMLs gate through the append gateway with `--mode model-benchmark` (auto `:117`, confirm `:122`) and invoke shared scripts: `loop-host.cjs --mode=model-benchmark`, `reviewer-scorer.cjs`, `promote-candidate.cjs`, `improvement-journal.cjs`, shared `reduce-state.cjs`.

### 3.3 deep-improvement packet (iteration 3)
- **DELETE (Lane B-only):** `references/model-benchmark/{benchmark-operator-guide,evaluator-contract,lane-b-mechanics,mixed-executor-methodology}.md`; `assets/model-benchmark/README.md`, `benchmark-profiles/README.md`, `benchmark-fixtures/README.md`; nine Lane B profiles; the tiered/oracle fixture packs (`hard-*`, `harder-*`, `t1-*`, `t3-*`, `t4-*`, `validate-*`, `reviewer-*`, `reviewer-schema.md`); `scripts/model-benchmark/{dispatch-model.cjs,sweep-benchmark.cjs,lib/reviewer-scorer.cjs,lib/score-verdict-fallback.cjs,scorer/**,MODES.md,SWEEP.md,README.md,tests/**}` (16 vitest files); `feature-catalog/model-benchmark-mode/**` (6 pages); `manual-testing-playbook/model-benchmark-mode/**` (8 pages); `manual-testing-playbook/intra-routing-recall/model-benchmark.md`; `behavior-benchmark/scenarios/IMB-007-model-benchmark-bare-command-halt.md`.
- **SHARED-WITH-AGENT-IMPROVEMENT:** `scripts/model-benchmark/run-benchmark.cjs` (Lane A YAML step `agent-improvement-auto.yaml:258,265`), `assets/model-benchmark/benchmark-profiles/default.json` + `fixture-baseline/improved/edge.json`, `scripts/shared/materialize-benchmark-fixtures.cjs`, `scripts/lib/profile-resolve.cjs`, `scripts/shared/{model-family,extract-deliverable}.cjs`. The 5dim branch of `run-benchmark.cjs` requires Lane B-only `scorer/score-model-variant.cjs` (`:684`) — verify the pattern path is self-contained before deletion.
- **EDIT:** `SKILL.md` (§4 removal + lane rows), `README.md:9,24-25,38,105-108`, `routing-allowlist.json:3-5`, `benchmark/README.md`, `feature-catalog/feature-catalog.md` (rows + §5 `:294-392`) and `evaluation-loop/{promotion-gates.md:49,scoring-dispatch.md:42,53}`, `manual-testing-playbook.md` (index + §15), `scripts/shared/{loop-host.cjs:42,59-62,101-102,137-140; promote-candidate.cjs:666-667,1017-1019; reduce-state.cjs:640-641,755-757,794-799,984+}`, `scripts/vitest.config.mjs:5`, six shared test files + `tests/fixtures/low-sample-benchmark/**` + tests READMEs.
- **KEEP-AS-HISTORY:** `benchmark/reports/**` (two historical skill-benchmark report folders), packet changelogs v1.9.0.0-v1.19.1.0.
- **Cross-hub:** `shared/behavior-benchmark/framework.md:36` — **EDIT**; `shared/rollout/command-injection-rollout.json:7` (`"deep/model-benchmark": "fallback"`) — **EDIT**.

### 3.4 system-skill-advisor (iteration 4)
- **DELETE:** `aliases.ts:16-21` manual alias group; `explicit.ts:122,140-157` phrase boosts; `projection.ts:152-165` manual bridge entry + `:256-270` generated-block entry; `command-bridges.generated.json:341-374`; `scoring-compatibility.json:122-146`; `skill_advisor.py:2510-2517` legacy bridge entry.
- **EDIT:** `shadow-diff.md:21,33` (regenerate counts after removing the bridge).
- Generated-region note: the deep-routing alias projection in `aliases.ts` does not contain the benchmark group, so its embedded hash is unaffected.
- Regeneration owners: `skill_advisor.py` projection sync; command-bridge JSON generators; skill-graph via `skill_graph_compiler.py` (after sk-doc edits).
- Dist rebuild: `system-skill-advisor/runtime/dist/runtime/lib/scorer/{aliases,explicit,projection}.js` are compiled copies — **REBUILD**.

### 3.5 sk-doc and sk-create-benchmark (iteration 5)
- `sk-create-benchmark` is a four-family skill; the model-benchmark family is mode-coupled (inputs live in `deep-improvement/assets/model-benchmark/`).
- **DELETE:** `assets/model-benchmark/*` (3 templates), `references/model-benchmark/model-benchmark-fixture-guide.md`, `manual-testing-playbook/benchmark-families/match-lane-b-fixture.md`.
- **EDIT:** `SKILL.md` (family rows, keywords, RESOURCE_MAP, §10 section `:472-530`, §11/§12 links), `README.md:7,22,36,44,78,151`, `references/shared/README.md:41,44,59-61`, `manual-testing-playbook.md:3,9,94-96,102,118`; sk-doc hub rows (`SKILL.md:33`, `ROUTER.md:107-108,168,289-291,296`, `hub-router.json:312`, `mode-registry.json:306`, `graph-metadata.json:222`, `leaf-manifest.json:19-21,26`); `scripts/tests/code-folder/durable-directory-manifest.json:532-533,543-549,600-602`; `commands/create/assets/create-benchmark-presentation.txt:86`; `manual-testing-playbook/token-cost-baseline/max-load.md:16-18,23,152-156,166`; `sk-create-command/assets/command-contract.json:304`.
- **KEEP-AS-HISTORY:** sk-create-benchmark changelogs v1.2.0.0/v1.3.0.0, sk-doc benchmark reports.

### 3.6 Other skills and compiled routing (iteration 6)
- **EDIT:** `.skilled/agents/deep-improvement.md:58`; `cli-external-orchestration/benchmark/README.md:46`; `cli-claude-code/benchmark/README.md:44`; `sk-code/benchmark/README.md:116`; `cli-classifier/README.md:72-73`; `cli-classifier/feature-catalog/measurements/pi-transport-integration.md:95-96,114-116`; `deep-ai-council/README.md:134`; `deep-review/README.md:176`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/{registry-compiler.cjs:32-33,canary-router.cjs:19-21}` and `fixtures/canary-cases.v1.json:82-96,180-181`.
- **KEEP-AS-HISTORY:** cli-external-orchestration changelog v1.5.0.0, cli-hermes changelog v1.0.0.0, system-deep-loop benchmark reports, sk-prompt verify report.
- Compiled-routing recheck (iteration 9): stages 003-014 anchor the mode only in 009.

### 3.7 Runtime mirrors (iteration 7)
- `.opencode` is a **symlink mirror** (agents/commands/hooks/bin/skills/scripts/repo-rules → `.skilled/`); only `.opencode/plugins` is real, and its guard plugin reads `mode-registry.json` at runtime — no plugin source edit.
- **EDIT:** `.opencode/plugins/tests/{claude-task-dispatch-guard,system-deep-loop-guard}.test.cjs` (hardcoded mode sets).
- **Regenerate (generated copies):** `.claude/agents/deep-improvement.md`, `.claude/commands/deep/model-benchmark.md`, `.codex/agents/deep-improvement.toml`, `.codex/prompts/deep-model-benchmark.md` (generator `sync-prompts.cjs`), `.hermes/prompts/deep-model-benchmark.md` + `.hermes/skills/{system-deep-loop,deep-improvement,sk-doc,sk-create-benchmark,agent-deep-improvement}/SKILL.md` (generator `sync-prompts-hermes.cjs`), `.pi/agents/deep-improvement.md` + `.pi/prompts/deep-model-benchmark.md` (generator `sync-prompts-pi.cjs`) — generators live under `.skilled/skills/system-spec-kit/runtime/cli/{codex,pi,hermes}/`.
- **Symlinks (no independent edit):** `.devin/agents/deep-improvement/AGENT.md`, `.cursor/agents/deep-improvement.md`, `.devin/skills/**`, `.opencode/**`.
- Clean: `.cursor/commands/**`, all runtime `SYNC.md`, all hook configs.

### 3.8 Repo-level surfaces (iteration 8)
- **EDIT:** `.skilled/hooks/hook-flags.env.example:54-55`; `.env.example:451-452`; root `README.md:555-556,649-651,867-869,1242-1243,1431-1433`; `BARTER.md:497`.
- **KEEP-AS-HISTORY:** global changelogs (`v3.5.0.0.md:37,129-131`, `v4.0.0.0.md:111`, `v4.0.0.3.md:244,255,353`), hub changelogs (`v1.5.0.0.md:36`, `v1.5.1.0.md:20`), packet changelogs.
- External consumers: none found (no publish manifest references; identifiers are internal routing keys).

### 3.9 Indirect wiring (iteration 9)
- **EDIT:** `runtime/scripts/append-mode-event.cjs:97,143-146` (mode normalization + schema import); `runtime/lib/legacy-projections/legacy-projection-manifest.ts:147-148,170-172,186-189`; `runtime/lib/per-mode-authority-flip/types.ts:26,135`; `runtime/lib/write-set-conflict-graph/{types.ts:17;shipped-census.ts:118-121,471-500}`; `runtime/lib/blinded-adjudication/{contracts.ts:17,58;mode-adapters.ts:100-104,163-165,181-190;event-registry.ts:123}`; `runtime/lib/deep-improvement-common-*` (shared mode rows); runtime unit tests (`verify-authority-cli.vitest.ts:37,169,173`, `host-driven-improvement.vitest.ts:46`, five more shared suites, `tests/unit/README.md:92-94`); `system-spec-kit/references/structure/folder-structure.md:239,243`; `system-spec-kit/runtime/ENV-REFERENCE.md:439-440`; retrieval fixtures (`phrase-variants.json` rows incl. `:35757,51396,52044,54759,63679-63683`; `semantic-probes.json:1134`; `generation-diagnostics.json` stale paths; `corpus-manifest.json:6125-6127,6144,6915-6916,6925,6977+`); `system-spec-kit/runtime/tests/continuity-freshness.vitest.ts:21`.
- **DELETE:** `runtime/lib/model-benchmark-ledger-schema/**` (4 files), `runtime/lib/model-benchmark-reducers/**` (5), `runtime/lib/model-benchmark-sealed-artifacts/**` (5); three mode-exclusive runtime vitest suites.
- **KEEP-AS-HISTORY:** three `anchor-repair-sample/*.md` parser fixtures; `cite-drift-redirects.json:1788-1789,3786-3787,3804-3805` (`.opencode/specs` redirect history).

### 3.10 Validators, doctor, gap sweep (iteration 10)
- Doctor commands contain no mode reference; runtime validators (`check-contract-drift`, `check-documentation-drift`, `check-ledger-stem-producers`, `check-projection-coverage`, `check-protocol-append-sites`, `verify-authority`, `compile-command-contracts`) are generic and registry-driven — **no edits**, but they are the post-deletion gates.
- Residuals: 123 transient sandbox files under `.skilled/bin/tests/.sandboxes/**`; advisor compiled dist (3 files); `BARTER.md` (missed by the first sweep); all reconciled in the dual-mode scan (A=282 default-visible, B=420 no-ignore+hidden, A-only empty).

---

## 4. Consolidated Work Classes

**DELETE (major clusters).** Command family (4 files); packet Lane B trees (references, profiles, fixtures, scripts, tests, catalogs, playbooks, behavior scenario); sk-create-benchmark family files (5); runtime schema packages (14 files across 3 packages + 3 test suites); command-metadata/hub-registry blocks; advisor alias/boost entries and generated bridge records; canary fixture case; playbook IL-002 page.

**EDIT (major clusters).** 10 hub-root files; 5 command-Lane-A files; packet `SKILL.md`/README/allowlist/catalog/playbook + 3 shared scripts + 6 shared tests; advisor scorer sources + Python catalog + shadow doc; sk-doc hub (7 files) + sk-create-benchmark shared docs; 4 sibling READMEs; `.opencode` guard tests; root README + BARTER.md; env examples; runtime gateway + 5 runtime libs + 8 runtime tests; spec-kit folder/native docs + 4 fixture files; compiled-routing 009 compiler + fixtures.

**SHARED-WITH-AGENT-IMPROVEMENT.** `run-benchmark.cjs`, `default.json` + 3 legacy fixtures, `materialize-benchmark-fixtures.cjs`, `profile-resolve.cjs`, `model-family.cjs`, `extract-deliverable.cjs`, `loop-host.cjs`, `promote-candidate.cjs`, `reduce-state.cjs`, `improvement-journal.cjs`, `deep-improvement-common-*`, shared reference docs, `benchmark-integration/` playbook pages, five-d-scorer pages' shared parts.

**KEEP-AS-HISTORY.** All changelogs, historical benchmark reports (system-deep-loop, sk-doc, sk-prompt, cli-*), anchor-repair parser fixtures, `.opencode/specs` redirect entries, `benchmark/reports/**`.

**GENERATED (rebuild/regenerate, never hand-edit).** Advisor compiled dist (3 files); runtime prompt mirrors (`.codex`/`.hermes`/`.pi`/`.claude` copies); Hermes skill mirrors (5 files); command-bridges/JSON projections; skill-graph; trigger index; retrieval fixtures; durable-directory manifest; token-cost baseline; `.sandboxes/**` transient artifacts.

---

## 5. Deletion Plan Implications (suggested ordering)

1. **Source first:** remove the mode from `mode-registry.json` (the single authority every generated surface derives from), then the command family and packet Lane B trees with the Lane A carve-out.
2. **Regenerate:** advisor projections and bridges, skill-graph, trigger index, retrieval fixtures, runtime mirrors (prompt-sync generators), compiled dist rebuild.
3. **Shared edits:** hub rows, packet `SKILL.md`, runtime gateway/lib/tests, sk-doc hub rows and sk-create-benchmark family, READMEs/env/BARTER.md.
4. **Gates:** run the runtime validators, doctor deep-loop check, sk-doc validator on touched docs, and the advisor shadow-diff after regeneration.
5. **Verify the carve-out:** confirm Lane A's fixture step still passes with `run-benchmark.cjs` retained and the Lane B scorer untouched.

## 6. Tests, Validators, and Doctor Checks Covering Touched Surfaces

- **Runtime checks:** `check-contract-drift.cjs`, `check-documentation-drift.cjs`, `check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs`, `check-protocol-append-sites.cjs`, `check-direct-append.cjs`, `verify-authority.cjs`, `compile-command-contracts.cjs`, `verify-iteration.cjs` (research loop gate), `post-dispatch-validate`.
- **Skill-level tests:** sk-doc `durable-directory-manifest.json` + `baseline-readme-verdicts.json` folder tests; `sk-doc/scripts/tests/**`; `.opencode/plugins/tests/{system-deep-loop-guard,claude-task-dispatch-guard,mcp-route-guard}.test.cjs`; runtime `tests/unit/**` suites; deep-improvement `scripts/**/tests/**` suites (Lane B ones delete with their subjects).
- **Doctor:** `doctor-deep-loop.yaml` (generic loop readiness); run post-deletion.
- **Compiled routing:** canary fixtures (009) after the compiler edit.

## 7. Open Questions and Residual Risks

1. **run-benchmark carve-out decision** — whether Lane A keeps the 5dim-free pattern path in place or the shared file moves out of `scripts/model-benchmark/` during the deletion (a plan decision, not a research gap).
2. **sk-create-benchmark family scope** — this inventory classifies the family as mode-coupled and DELETE; if the owner wants fixture authoring kept for generic model benchmarks, the family becomes EDIT instead. Sibling lineage scope note: Lane A's authoring guide is unaffected.
3. **`.worktrees/**` and `barter/**`** are duplicate checkouts excluded here; the deletion plan should regenerate or leave them untouched by policy.
4. **Telemetry deviations recorded:** the three test-loop heartbeat steps and the append-gateway `bookkeeping_log` rows were skipped by design in this lineage; they have no lossy-free research-event target and are not research semantics.
5. **Spec-folder mutations deferred:** late-INIT spec anchoring, post-synthesis fence write-back, and the continuity save (`generate-context.js`) are outside this lineage's write surface and were not executed.

## 8. References

- Iteration files: `iterations/iteration-001.md` … `iterations/iteration-010.md` (this lineage).
- Deltas: `deltas/iter-001.jsonl` … `iter-010.jsonl`.
- State: `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, `deep-research-strategy.md`.
- Ledgers: `deep-research-ledger/`, `deep-research-audit-ledger/`, `deep-research-effect-ledger/`.
- Resource map: `resource-map.md` (emitted from converged deltas).

---

## Convergence Report

- Stop reason: `maxIterationsReached` (stopPolicy `max-iterations`; convergence signals were telemetry only)
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0 (open plan decisions recorded in §7, not research gaps)
- Last 3 iteration summaries: run 8: repo-level surfaces (1.0); run 9: indirect wiring (1.0); run 10: validators + gap sweep (0.85)
- Convergence threshold: 0.05 (not applied as a stop condition this run)
- Divergence summary: no divergent pivots recorded; no saturated directions
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted
