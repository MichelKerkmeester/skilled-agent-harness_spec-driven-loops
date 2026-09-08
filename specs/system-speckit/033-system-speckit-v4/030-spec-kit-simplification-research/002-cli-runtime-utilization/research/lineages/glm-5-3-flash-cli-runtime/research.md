---
title: "Research: the @spec-kit/cli package — purpose, logic, integration, utilization"
description: "Canonical synthesis of the glm-5-3-flash-cli-runtime detached fan-out lineage: 54 findings (0 P0 / 22 P1 / 32 P2) over 10 iterations, verdict-first, every claim traceable to a cited line."
trigger_phrases:
  - "cli runtime utilization findings"
  - "spec-kit cli audit"
---

# Research: the @spec-kit/cli package — purpose, logic, integration, utilization

<!-- ANCHOR:verdict -->
## 1. VERDICT

The package is three things wearing one name. (1) A **continuity/save core** (continuity/, core/, extractors/, loaders/, types/, config/) that is tightly wired, fully alive, and runs its documented three-layer gate — intake, router, post-save review — inside ONE process; every documented stage executes; the memory decommission stranded nothing inside the pipeline. (2) A **validation dispatch** (spec/, rules/, validation/ + the engine orchestrator) that is the only subsystem with a coherent, LIVE registry (cli/lib/validator-registry.json, 39 dispatched rules) and the heaviest EXECUTION mechanisms — but whose dispatch story its own documents each tell differently. (3) A **long margin**: retrieval (2 mandates + 4 unwired ceremonies + a silent freshness hole), cross-runtime mirrors (doctor-checked, CI-unguarded), six measurement directories (one dead, one doctor-wired, one agent-wired, one CI-wired, one output-committed, one treaty-twin'd), delivery+ops (two self-declared stubs, a superseded doctor, a 7-file residue family), and a 53k-LOC test estate + a 6-check boundary gate that NO automated mechanism anywhere executes.

54 findings: 0 P0 (nothing is broken), 22 P1 (dead, unwired, or misleading), 32 P2 (cosmetic/documentation). The systemic cause of the duplication: **wherever a seam already existed (shared/, the 2021-2023 staging shim, a barrel), the package accreted a copy anyway — then paid a test (disambiguation, parity, calibration) to patrol the difference. The tests are the fossils of un-merged pairs.**

Two-sided citation discipline: every finding below names its declared purpose AND its observed callers (or the certified none-found); finding IDs (f-iterNNN-00M) resolve in findings-registry.json; the iterations/ files carry the full evidence narratives.

<!-- /ANCHOR:verdict -->
<!-- ANCHOR:removal -->
## 2. THE REMOVAL LIST (ranked by confidence that nothing documented depends on it)

Every member was certified at FULL sweep (.opencode + .github, tests, docs, fixtures included; self-mentions counted honestly — "1" means alone). Iteration-9 certification: 19/19 claims upheld, zero overturned (f-iter009-002). Dynamic-import caveat: string-concatenated imports were not swept; no other dispatch evidence exists.

| # | Target | Evidence | Ship-with |
|---|--------|----------|-----------|
| 1 | The `.scan*` seven: .scan-one.sh, .scan-validate-all.sh, .scan-lines.txt, .scan-validate-all.txt, .scan-results.txt (0 bytes), .no-frontmatter-list.txt, .enumerate-no-frontmatter.py | 0 references of any kind; they one-off duplicate what tests/test-validation.sh + spec/validate.sh provide (f-iter006-002) | The 2 README lines they never had |
| 2 | continuity/ast-parser.ts + continuity/fix-memory-h1.mjs | fix-memory-h1: 3 refs (2 READMEs + self); its sole dependant ast-parser: imported by nothing else — dead together (f-iter003-003) | 2 continuity/README lines |
| 3 | kpi/ (README + quality-kpi.sh, 100L) | 1 reference = itself (f-iter008-002); absent from both registries | — |
| 4 | setup/_utils.sh | 0 content references; no sourcing line mentions it (indirect-variable sourcing: caller-not-fully-verified, f-iter007-004) | — |
| 5 | The 3 stranded research harnesses: evals/run-phase2-closure-metrics.mjs, evals/collect-redaction-calibration-inputs.ts, evals/run-redaction-calibration.ts | 2 refs each (one = the evals/README); not in package.json:24 check nor check:ast (f-iter008-003) | The evals/README paragraphs |
| 6 | doctor.sh | 1 reference = itself; the /doctor command implements its own machinery (commands/doctor/scripts/doctor-runtime-bootstrap.sh); absent from both registries AND the README (f-iter001-005, f-iter006-001) | Its silent-skip-deps check, MERGED into the /doctor bootstrap (or lost) |
| 7 | migrate-deep-research-paths.ts + seed-council-value-fixture.cjs | 1 + 2 references, all changelog/benchmark-archaeology (f-iter006-003) | The changelog entries already record their consumption |
| 8 | continuity/rank-memories.ts (440L) | 5 references, ALL documentation (skills/README, continuity/README, 1 sk-code conventions doc); absent from both registries; /speckit:search (the ripgrep lane, 001 packet) does not reference it (f-iter003-002) | The "ranking CLIs" phrase at cli/README.md:53 |
| 9 | retrieval/retrofit-convention.mjs + retrieval/sweep-memory-residue.mjs + retrieval/measure-cold-lookup.mjs (+ the 10 frozen-baseline fixtures as applicable) | docs + fixture-strings only; the 001-acceptance build-verify-measure residue (f-iter005-002) — REMOVE AFTER the 001-packet evidence is archived | Their retrieval/README.md lane paragraphs |
| 10 | spec/check-smart-router.sh + spec/sweep-track-roots.mjs | 2 references each (self + 1); zero wired callers, zero dispatch registration (f-iter002-003) | — |
| 11 | *(merge-first)* core/quality-scorer.ts (367L) | 0 production importers, outside the barrel, 2 tests exist to explain it (f-iter004-002) | tests/quality-scorer-disambiguation.vitest.ts + quality-scorer-calibration.vitest.ts |
| 12 | *(merge-first)* renderers/ (template-renderer.ts 231L + index.ts) | the only importer = tests/task-enrichment.vitest.ts:13,118 (which vi.mocks it); populateTemplate: 0 production citations (f-iter004-003) | — |
| 13 | *(conditional)* registry-loader.sh + scripts-registry.json | the reader: 1 conventions-doc mention (f-iter002-001); IF the remediation chooses regeneration rather than removal, this line defers | 1 sk-code conventions-doc paragraph |

Total: ~30 files + 2 directories. Each member's P1/P2 finding (f-iter002-003, f-iter003-002/003, f-iter006-001/002/003, f-iter008-002/003) carries the path:line evidence.

<!-- /ANCHOR:removal -->
<!-- ANCHOR:merge -->
## 3. THE MERGE LIST (ranked by confidence)

| # | What merges into what | Evidence | Confidence |
|---|----------------------|----------|------------|
| 1 | PLACEHOLDER_FILLED: spec/check-placeholders.sh (184L, the post-edit hook's canonical, post-edit-router.cjs:41) INTO rules/check-placeholders.sh (115L, the dispatched one, validator-registry.json:~21) — one rule, two implementations, 69 lines apart | f-iter002-004 | High: both live, one rule_id |
| 2 | coverage-graph: the two-skill twins → ONE module. cli/lib/coverage-graph/*.ts (0 production importers in its own package; 13 test suites) vs system-deep-loop/runtime/lib/coverage-graph/{signals,query}.ts (the production copy, with its own database); the treaty = cli/tests/graph-convergence-parity.vitest.ts:6-11, a CROSS-SKILL relative import; shared/ — the sanctioned seam — hosts neither; + the stray cli/lib/coverage-graph-convergence.cjs | f-iter009-001 | High: the production side is identified |
| 3 | The registries: scripts-registry.json (14 entries, unread) + registry-loader.sh (0 callers) vs the LIVE cli/lib/validator-registry.json (39 dispatched rules, read at orchestrator.ts:76) — one dispatch source, one discovery catalog, disagreeing counts (9 vs 39; 14 vs 13; 14 vs 9; 3 vs 4) | f-iter002-001, f-iter001-003 | High: the failure is proven, the direction is a choice |
| 4 | The quality scorers: core/quality-scorer.ts (367L, scoreRenderQuality) INTO extractors/quality-scorer.ts (scoreMemoryQuality, the production V2, workflow.ts:42-43); retire tests/quality-scorer-disambiguation.vitest.ts — the test that exists to manage the duplication | f-iter004-002, f-iter009-003 | High |
| 5 | COMMENT_HYGIENE: cli/rules/check-comment-hygiene.sh (gate-dispatched) vs sk-code/sk-code-quality/scripts/check-comment-hygiene.sh (hook + CI, comment-hygiene.yml:17) — two lanes, one concept | f-iter002-005 | Medium: cross-package, the lane split may be intentional — document it either way |
| 6 | The FOUR sweeps (sweep/strict-pass-freshness.ts [CI-wired, strict-pass-freshness-report.yml:56], ops/process-sweep.ts [plugin-wired, session-cleanup.js], retrieval/sweep-memory-residue.mjs [unwired], spec/sweep-track-roots.mjs [unwired]) → one sweep module + thin invokers | f-iter008-007 | Medium: the 2 wired hunks must not regress |
| 7 | The THREE template mechanisms (templates/inline-gate-renderer.sh [wired, spec/create.sh:1066 + 3 doc lanes], lib/template-utils.sh [6 source-citations], renderers/ [0 production]) → one | f-iter004-003 + the iteration-6 census | Medium |
| 8 | repo-root ×3: cli/common.sh get_repo_root() (4 sourced scripts), runtime/hooks/lib/workspace/repo-root.mjs (retrieval), shared/paths (pending) → one seam | f-iter005-003 | Medium |
| 9 | Phase-parent detection ×3: the engine TS (runtime/lib/spec/is-phase-parent.ts), the 200L save-path twin (cli/spec/is-phase-parent.ts, imported by generate-context.ts:34, 208 diff lines), the shell mirror (cli/lib/shell-common.sh:48, which speckit-implement-auto.yaml:80 mandates "must agree") — AND their documented regex (both comments, MODULE-MAP, the command contract) disagrees with the implemented one (^[0-9]{3}-[a-z0-9-]+$ documented vs /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/ enforced) | f-iter002-006, f-iter003-007 | Medium-high: drift is realized on the heaviest write AND read paths |
| 10 | resource-map: resource-map/extract-from-evidence.cjs (554L) INTO the /deep:research + /deep:review synthesis steps — the command YAML (deep-research-auto.yaml:175,252-256) specifies the artifact; NO step names the tool; every resource-map.md is hand-rolled per the playbook while the extractor waits (this lineage's own resource-map.md is the demonstration) | f-iter008-006 | Medium-high: the gap is demonstrated, the fix is one line per command |
| 11 | js-yaml: 1 production importer (rules/check-grep-convention-helper.mjs) behind the shared seam (11 lanes already take YAML via shared/frontmatter/parse-frontmatter), then the top-level dep drops | f-iter009-004 | Medium |

<!-- /ANCHOR:merge -->
<!-- ANCHOR:fix -->
## 4. THE FIX LIST (accuracy of the record, ranked by reviewer cost)

| # | The wrong sentence | The true sentence | Evidence |
|---|--------------------|-------------------|----------|
| 1 | package.json:4 "CLI tools for spec-kit context generation and continuity management" (plus cli/README.md:17 and ARCHITECTURE.md:23, each naming a different third) | The 002 packet's caller-weighted reality: continuity reminders 64 > retrieval reminders 49 (all reminders, 0 mechanisms — 49/49 in .opencode/commands) > validation executions 11; the heaviest UNSUPERVISED machinery is the tests/gate estate | f-iter001-001, f-iter010-002 |
| 2 | 002 spec.md:84 "its heaviest callers are validation and retrieval" | INVERTED — see #1; the 49 retrieval references decomposed: 49/49 reminders | f-iter010-002 |
| 3 | The registry counts (scripts-registry.json:382-386): totalScripts 13, optionalScripts 6, totalRules 14, essentialRules 3 | 14 / 7 / 9 / 4 (essentialScripts 7 correct); +1 dead-but-registered shim (lib/trigger-extractor.js, 0 importers); +11 subsystems undiscovered (retrieval, graph, observability, codex, pi, mirrors, sweep, optimizer, resource-map, kpi, metrics: 0 references) | f-iter001-002/003, f-iter009-003 |
| 4 | scripts-registry.json:37-38 generate-context.dependencies [lib/embeddings.js, lib/anchor-generator.js, lib/content-filter.js] | 3/3 indirect — embeddings via core/workflow.ts:56 (TWO CONSTANTS: EMBEDDING_DIM, MODEL_NAME), anchor via extractors/file-extractor.ts:26, content-filter via workflow.ts:48 | f-iter004-004, f-iter009-003 |
| 5 | cli/README.md:110 "validate-command-tree-parity.sh wired into spec/validate.sh as the COMMAND_TREE_PARITY rule" | Its wired caller is .github/workflows/command-tree-parity.yml; the COMMAND_TREE_PARITY rule appears in NO registry, NO orchestrator code, NO validate.sh | f-iter002-002 |
| 6 | ARCHITECTURE.md:193 "spec/validate.sh enforces 20 rules" | The dispatched registry holds 39 (20 authored_template + 13 operational_runtime + 6 structural); 6 are virtual (native:orchestrator, ts:spec-doc-structure) | f-iter002-008 |
| 7 | The /speckit:save command YAMLs' "post_save_indexing" key (speckit-plan-auto.yaml:696-701) | Nothing indexes; the note already says so — rename the key, the note is right | f-iter003-001 |
| 8 | The three-layer delegation stories (rules/README.md:12-14 vs ARCHITECTURE.md:193-194) | The truth: cli/spec/validate.sh → dist/lib/validation/orchestrator.js → cli/lib/validator-registry.json → spawnSync(bash/node, script_path) — name the engine-orchestrator hop ONCE, in one document | f-iter002-001/002-002 |
| 9 | ops/README.md's promises vs ops/ mechanics | ops/README.md:15-37 is already honest (both heal-*.sh = stubs; runbook.sh:147L dispatches to them; process-sweep.ts:251L = the ONE production-wired module, via plugins/session-cleanup.js) — the FIX is finishing or collapsing the stubs | f-iter007-002 |
| 10 | The 20/39-rule and the mirror-coverage gaps | The CI mirror guardian (agent-mirror-sync.yml:15-24, deep-loop's checker, agents×3) and the doctor guardian (5 --check surfaces, _routes.yaml:169-182) do not know each other; prompts/pi/claude drift is CI-invisible | f-iter007-001 |
| 11 | The trigger-index freshness story | The lookup validates SHAPE only (lookup-trigger-index.mjs:25); no workflow regenerates or canaries the COMMITTED index; staleness answers exit 0 | f-iter005-001 |
| 12 | ARCHITECTURE.md:100 "blocked by lint and CI" | The check gate (6 checks + import-policy-rules + allowlist + EXPIRY) is real and even scans .mjs (check-architecture-boundaries.ts:80) — but NO workflow anywhere runs package.json:24 check, vitest, or typecheck; the 53k-LOC tests/ estate is documentation until wired | f-iter007-003, f-iter008-001 |
| 13 | The worktree mechanics | dist/ and node_modules/ symlink to the ABSOLUTE main-checkout; runtime/ → ../dist — a 046-worktree source edit builds against the main checkout's state (worktree-scoped) | f-iter001-006 |

<!-- /ANCHOR:fix -->
<!-- ANCHOR:question-verdicts -->
## 5. THE SIX CHARTER QUESTIONS, ANSWERED

1. **Purpose vs callers per directory** (iterations 2-8): 35 directories, every one carries a verdict; the surprises were negatives — templates/ (create.sh:1066), metrics/ (the doctor's fable mode), the 12 extractors (all wired via the workflow.ts second hub), graph/backfill (triple-wired: repair-derived:319 + doctor ×2) are MORE wired than their docs; the documentation-invisible wiring runs through TWO import hubs (continuity/generate-context.ts:15-35 → core/workflow.ts:12-48 → everything), which defeated the single-entry liveness method until iteration 4.
2. **The save pipeline after the decommission** (iterations 3-4): the documented 3-layer gate (ARCHITECTURE.md:182: intake, router, post-save review) SURVIVES INTACT — single-process, via workflow.ts; the inert material is residue AROUND the pipeline (rank-memories 440L, fix-memory-h1+ast-parser 65L, the 1529L migration trio, the 66L shim, the uncited 367L scorer, renderers/ 231L); daemon-detect.ts:3-5 documents its own remaining justification (the workflow save lock's liveness probe). "Memory" survives as vocabulary, not machinery (ADR-001 honored: ARCHITECTURE.md:148-166's ownership table checked out).
3. **Registry vs scripts, duplicated checks** (iterations 2, 6, 9, 10): 0 dangling paths by existence; 1 dead-but-registered shim by import; 11 subsystems undiscovered; 4 wrong self-counts; 1 stale date (2025-12-31); duplication: 11 exhibits (Section 3) — the checks duplicated twice (placeholders, comment-hygiene), the registries twice, the tests-as-fossils pattern three times (disambiguation, parity, calibration).
4. **Zero-caller directories and pointers-at-nothing** (iterations 6, 9): 19 no-caller claims, ALL certified at full sweep, none overturned; the removal bill: ~30 files + 2 directories (Section 2); pointers-at-nothing: exactly one BY-IMPORT (lib/trigger-extractor.js), zero BY-EXISTENCE.
5. **The sync scripts and the evals/ check gate** (iterations 7, 8): the mirrors run via the DOCTOR route (commands/doctor/_routes.yaml:169-182 → doctor-runtime-mirrors.yaml:34-40,141: five --check lines + 2 doctor checkers + install-codex-hooks --check; 5 trigger phrases), NOT via the 3 promised workflows (which belong to deep-loop, skill-advisor, sk-code); the 6-check gate + allowlist + expiry machinery is coherent, .mjs-aware, and executed by NOBODY automated (package.json:24 `check` has no runner; the 3 research harnesses inside evals/ strand).
6. **The framing + cross-package duplication** (iterations 9, 10): three partial-truth self-descriptions; the heaviest-caller claim inverted; TEN duplication exhibits with ONE systemic cause (Section 3's last line); the crown exhibit: the coverage-graph engine, duplicated across TWO SKILLS, unified by a parity TEST via a cross-skill relative import, while the sanctioned shared/ seam hosts neither copy.

<!-- /ANCHOR:question-verdicts -->
<!-- ANCHOR:residuals -->
## 6. RESIDUALS (stated honestly: what this audit did NOT determine)

- **Dynamic imports beyond string-constants**: not swept; the 19 no-caller certifications therefore carry a bounded caveat (f-iter009-002).
- **The observability results' ultimate consumer**: the committed smart-router-measurement-report.md + results.jsonl prove the measurement RAN; who consumed them (likely the 035/001 evidence chain): caller-not-verified (f-iter008-004).
- **codex/generate-command-routers.cjs**: the one sync-family script without a doctor --check line; referenced by the commands-level checker (filename-verified), its execution: caller-not-verified (f-iter007-001).
- **setup/_utils.sh**: 0 content references; indirect-variable sourcing: caller-not-fully-verified (f-iter007-004).
- **The 046-worktree symlinks** (dist, node_modules → the absolute main checkout): worktree-scoped, ownership intent untreated (f-iter001-006).
- **Downstream of this lineage**: research/confirmed-findings.md — the reproduced subset the remediation child consumes — is a PACKET-level deliverable, written outside this lineage's write surface, from this research.md.

<!-- /ANCHOR:residuals -->
<!-- ANCHOR:provenance -->
## 7. PROVENANCE

- Lineage: glm-5-3-flash-cli-runtime, session fanout-glm-5-3-flash-cli-runtime-1788707853865-9gs9so, generation 1, detached fan-out (artifact root = THIS directory, bound via the config.fanout_lineage_artifact_dir override; the resolveArtifactRoot node skipped per the invocation contract).
- Ten iterations, each: iterations/iteration-NNN.md (narrative + findings + sources) + deltas/iter-NNN.jsonl (the machine records) + one state record appended to deep-research-state.jsonl + reducer refresh (findings-registry.json, deep-research-strategy.md, deep-research-dashboard.md).
- 54 registered findings (0 P0 / 22 P1 / 32 P2); 6/6 charter questions resolved; every rating evidence-filed; every correction applied in place with its reason (f-iter001-003, f-iter002-006, f-iter004-004, f-iter005-003 amendments).
- newInfoRatio trend: 1.00, 0.90, 0.85, 0.80, 0.80, 0.80, 0.80, 0.80, 0.75, 0.70 — convergence telemetry only; the loop rode to the configured maximum under the max-iterations stop policy (convergenceThreshold 3 on a capped-1.0 scale is unreachable, which is the intended reading of the invocation).
- Stops honored: no writes outside this lineage directory; no generate-context.js, no validate.sh, no git write/checkout/commit; the executor ran INLINE (this session — no nested CLI, agent, or Task dispatch; the workflow's per-iteration executor steps were satisfied by this process).

<!-- /ANCHOR:provenance -->
