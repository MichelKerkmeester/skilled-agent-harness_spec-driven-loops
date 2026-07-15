# Iteration 010 - Pre-Synthesis Consolidation

## Focus (pre-synthesis consolidation)

This iteration consolidates all findings from iterations 001-009 into a resource-map skeleton for the final synthesis. It verifies RQ acceptance, finalizes open uncertainties for the deepseek adversarial closers (iterations 11-12), and confirms the phase count and ordering.

## Resource-map skeleton

### (a) Executive summary (3 targets, 3 end-states)

**Targets:**
1. `mcp-coco-index` skill (DELETE) [SOURCE: iteration-001.md]
2. `system-rerank-sidecar` skill (DELETE) [SOURCE: iteration-001.md]
3. `system-code-graph` skill (EDIT-decouple) [SOURCE: iteration-001.md]

**End-states:**
1. `mcp-coco-index` → Entire skill folder deleted, all MCP registrations removed, all semantic-search routing repointed to HYBRID policy
2. `system-rerank-sidecar` → Entire skill folder deleted, mk-spec-memory decoupled from local cross-encoder provider, falls back to positional scoring
3. `system-code-graph` → CCC bridge coupling severed (ccc_* tools removed, semantic routing neutralized), 8 structural tools remain green

### (b) Classified touchpoint inventory grouped BY PHASE

**Phase 002-decouple-code-graph (~22 files)** [SOURCE: iteration-003.md, iteration-008.md]
- Tool schemas: ccc_status, ccc_reindex, ccc_feedback definitions removed
- Handlers: ccc-status.ts, ccc-reindex.ts, ccc-feedback.ts deleted
- Query-intent-classifier.ts: semantic routing neutralized
- SKILL.md: CCC glossary, intent signals, resource map entries removed
- ARCHITECTURE.md, README.md: CocoIndex bridge references removed
- Tests: CCC-specific tests removed
- graph-metadata.json: system-code-graph enhances/related_to edges to coco removed

**Phase 003-remove-memory-rerank-path (~5 files)** [SOURCE: iteration-002.md]
- cross-encoder.ts: local provider endpoint removed, RERANKER_LOCAL logic removed
- search-flags.ts: SPECKIT_CROSS_ENCODER/RERANKER_LOCAL flags removed
- mk-spec-memory-launcher.cjs: ensureRerankSidecar import removed
- ensure-rerank-sidecar.cjs: deleted
- ENV_REFERENCE.md: rerank-sidecar documentation removed

**Phase 004-remove-rerank-sidecar-skill (~30 files)** [SOURCE: iteration-006.md]
- Entire skill folder deleted: scripts/, tests/, pyproject.toml, SKILL.md
- .venv/ directory cleaned (runtime artifact)

**Phase 005-remove-coco-index-skill (~40 files)** [SOURCE: iteration-006.md]
- Entire skill folder deleted: mcp_server/, scripts/, SKILL.md, CCC CLI
- .venv/ directory cleaned (runtime artifact)

**Phase 006-runtime-configs-4runtime-mirror (~103 files)** [SOURCE: iteration-005.md, iteration-008.md]
- Runtime configs: opencode.json, .vscode/mcp.json, .gemini/settings.json, .codex/config.toml (cocoindex_code blocks removed)
- Agent frontmatter: context.md, deep-review.md, deep-research.md, review.md, code.md, debug.md across .opencode/, .claude/, .gemini/, .codex/
- Command frontmatter: deep/*, speckit/*, create/*, memory/* across 4 runtimes
- Doctor assets: doctor_cocoindex.yaml deleted, _routes.yaml, speckit.md, update.md, mcp-doctor.sh, mcp_install.yaml
- graph-metadata.json: system-skill-advisor, mcp-code-mode, deep-research edges to coco removed
- skill-graph.json: auto-regenerated after graph-metadata edits

**Phase 007-docs-readme-search-routing (~47 files)** [SOURCE: iteration-004.md, iteration-008.md]
- Core routing docs: AGENTS.md, CLAUDE.md SEARCH ROUTING
- README.md: 14 coco references removed
- Install guides: README.md, SET-UP - AGENTS.md, install_scripts/README.md
- sk-code/sk-doc templates: MCP server authoring checklist, testing playbook template, agent template, benchmark creation guide, changelog
- Agent docs: context.md routing matrices updated

**Phase 008-runtime-artifacts-cleanup (~8 items)** [SOURCE: iteration-006.md]
- Venvs: .opencode/skills/mcp-coco-index/mcp_server/.venv/, .opencode/skills/system-rerank-sidecar/.venv/
- Daemon runtime: ~/.cocoindex_code/, .cocoindex_code/ (repo root)
- Telemetry: ~/Library/Logs/spec-kit/sidecar-reaper.jsonl
- Port binding: 8765 verification
- Git hooks: session-start.sh, orphan-mcp-sweeper.sh
- HuggingFace cache: shared-optional (Qwen3-Reranker-0.6B, CodeRankEmbed)

### (c) The 2 key decisions

**Decision 1: Memory cross-encoder loss + positional fallback** [SOURCE: iteration-002.md]
- mk-spec-memory loses cross-encoder neural reranking entirely when sidecar is removed
- Safe fallback: positional scoring with synthetic scores (0-0.5 range), marked with `scoringMethod:'fallback'`
- Memory continues to function with vector similarity, BM25, RRF, and other Stage 1-2 pipeline features
- SPECKIT_CROSS_ENCODER and RERANKER_LOCAL flags become no-ops

**Decision 2: HYBRID semantic-search policy** [SOURCE: iteration-004.md]
- Chosen over DROP (no semantic search) and REPOINT to memory_search (scope mismatch)
- Repoints concept/intent queries to Grep + code-graph structural verification
- Preserves discovery capability without semantic backend
- Uses existing tools (Grep, code-graph) — no new infrastructure
- Sets realistic expectations: concept queries become "best-effort" rather than semantic

### (d) Phase DAG with ordering rationale

**8-phase DAG** [SOURCE: iteration-007.md]
1. 002-decouple-code-graph → 003-remove-memory-rerank-path → 004-remove-rerank-sidecar-skill → 005-remove-coco-index-skill → 006-runtime-configs-4runtime-mirror → 007-docs-readme-search-routing → 008-runtime-artifacts-cleanup

**Ordering rationale:**
- DECOUPLE BEFORE DELETE: code-graph decoupled first to avoid MCP server startup failure
- Memory rerank path removed before sidecar deletion to avoid memory failure when RERANKER_LOCAL=true
- Sidecar deleted before coco-index (no remaining consumers after phase 003)
- Skills deleted before runtime configs (registrations stale before cleanup)
- Runtime configs before docs (docs reflect final system state)
- Runtime artifacts last (no processes still using deleted skills)

### (e) Risk register

**High risks:** [SOURCE: iteration-007.md]
- Memory rerank regression: mitigated by positional fallback with scoringMethod marker
- Semantic-search vacuum: mitigated by HYBRID policy (Grep + code-graph)

**Medium risks:**
- 4-runtime drift: mitigated by mirror multiplier table and verification across runtimes
- MCP-registration breakage: mitigated by JSON/TOML syntax verification
- Daemon orphan: mitigated by port binding verification and process cleanup

**Low risks:**
- Code-graph test coverage loss: mitigated by test suite filtering
- Feature catalog orphan files: need classification in iteration-011

### (f) Negative knowledge (NOT in scope)

**Explicitly OUT OF SCOPE:** [SOURCE: iteration-007.md]
- Frozen historical spec docs under `.opencode/specs/**` (~2170 files) — LEAVE-historical
- Cloud rerankers (voyage/cohere) — already removed in specs 022/013
- mk-spec-memory embeddings or non-rerank retrieval channels — only cross-encoder in scope
- Shared HuggingFace model cache — shared-optional, not repo-specific
- code-graph structural core — 8 remaining tools are KEEP
- mk-code-index MCP server — server stays, only ccc_* tool registrations removed
- system-spec-kit core — runtime, memory search, other MCP servers not deprecated

### (g) Deletion-completeness checklist

**Deletion artifacts:** [SOURCE: iteration-006.md]
- Skill folders: mcp-coco-index/, system-rerank-sidecar/ (entire folders)
- Venvs: .opencode/skills/mcp-coco-index/mcp_server/.venv/, .opencode/skills/system-rerank-sidecar/.venv/
- Scripts: install.sh, doctor.sh, ensure_ready.sh, update.sh, common.sh, rerank_sidecar.py, etc.
- Runtime: ~/.cocoindex_code/, .cocoindex_code/ (repo root), ~/Library/Logs/spec-kit/sidecar-reaper.jsonl
- Port: 8765 binding verification
- Git hooks: session-start.sh, orphan-mcp-sweeper.sh
- Dependency manifests: pyproject.toml files
- Ensure helper: .opencode/bin/lib/ensure-rerank-sidecar.cjs

**Cross-skill import check:** [SOURCE: iteration-006.md]
- No cross-skill imports found beyond already-mapped ensure-rerank-sidecar.cjs dependency
- Skills are self-contained with no hidden code dependencies

## RQ acceptance check

| RQ | Status | Answered in | Evidence |
|----|--------|-------------|----------|
| RQ1: Live-reference inventory | MET | iteration-001.md, iteration-008.md | 37 touchpoints seeded in iter-001, 16 net-new in iter-008 (graph-metadata, sk-code/sk-doc templates), reconciled total ~247 files |
| RQ2: Rerank-sidecar consumers + memory fallback | MET | iteration-002.md, iteration-009.md | Confirmed mk-spec-memory as only non-coco consumer; positional fallback decision (0-0.5 range, scoringMethod:'fallback'); coupling verification in iter-009 confirmed no hidden runtime paths |
| RQ3: Code-graph decouple edit-set | MET | iteration-003.md, iteration-009.md | Precise surgical changes mapped (tool schemas, handlers, query-intent-classifier, SKILL.md, tests); coupling verification in iter-009 confirmed CCC bridge is only coco tie |
| RQ4: Semantic-search vacuum + replacement policy | MET | iteration-004.md | All semantic-search routes to coco mapped; HYBRID policy chosen (Grep + code-graph); doc rewrite list by phase |
| RQ5: 4-runtime mirror + configs | MET | iteration-005.md | 97 files across 4 runtimes enumerated; mirror multiplier table; exact JSON/TOML key paths |
| RQ6: Deprecation phase DAG + ordering + risk | MET | iteration-007.md | 8-phase DAG with ordering rationale; risk register with mitigations; negative knowledge catalog |
| RQ7: Deletion completeness | MET | iteration-006.md | Venvs, runtime artifacts, HuggingFace cache, git hooks, dependency manifests enumerated; cross-skill import check passed |

## Open uncertainties for deepseek closers

The following uncertainties require adversarial challenge in iterations 11-12 (deepseek):

1. **Feature catalog CCC files classification:** system-code-graph SKILL.md RESOURCE_MAP references `feature_catalog/07--ccc-integration/01-ccc-reindex.md`, `02-ccc-feedback.md`, `03-ccc-status.md` [SOURCE: iteration-003.md:104]. Need to locate these files and classify (DELETE vs EDIT-decouple) for Phase 002 or 007.

2. **Install guide script references:** install_scripts/README.md references `install-cocoindex-code.sh` [SOURCE: iteration-005.md:90]. Need to verify if this script exists and classify for deletion in Phase 005 or 008.

3. **HuggingFace cache cleanup policy:** HuggingFace model caches (Qwen3-Reranker-0.6B, CodeRankEmbed) marked as shared-optional [SOURCE: iteration-006.md:32-33]. Need explicit policy: leave as shared infrastructure, or provide optional cleanup instructions.

4. **Runtime artifact verification procedures:** Need exact verification commands for runtime-cleanup items [SOURCE: iteration-006.md:62]: killing daemon processes, releasing port bindings, removing telemetry logs, verifying no orphan processes.

5. **Integration testing strategy:** Need integration test plan for end-to-end verification [SOURCE: iteration-007.md:77]: memory search with fallback scoring, code-graph structural queries, agent/command tool routing, MCP server startup across 4 runtimes.

6. **descriptions.json scope clarification:** `.opencode/specs/descriptions.json` contains ~75 historical spec references to cocoindex. Per scope charter, `.opencode/specs/**` is FROZEN (LEAVE-historical). Need to confirm this includes descriptions.json or if it's a runtime index requiring cleanup [SOURCE: iteration-008.md:79].

7. **Startup-brief.ts coco availability check:** startup-brief.ts:10 import of isCocoIndexAvailable needs removal in Phase 002. Need to verify if removing this check breaks startup contracts or readiness reporting [SOURCE: iteration-009.md:98].

8. **Health/doctor probes:** No runtime health checks probing localhost:8765 or coco daemon found in live codebase. Need to verify if external health monitoring or CI checks depend on these endpoints [SOURCE: iteration-009.md:100].

9. **DAG ordering safety:** Challenge the hard constraint "DECOUPLE BEFORE DELETE" — are there any edge cases where the ordering could fail? E.g., what if code-graph decoupling breaks existing workflows before coco is deleted?

10. **Touchpoint class mis-assignment:** Are any touchpoints mis-classified as DELETE when they should be EDIT-decouple, or vice versa? E.g., sk-code/sk-doc template files with coco examples — should they be DELETE or EDIT-decouple (remove examples only)?

11. **Positional fallback degradation:** Does positional fallback in mk-spec-memory significantly degrade default memory search quality for users who never opted into SPECKIT_CROSS_ENCODER? Need to measure impact.

12. **Missed runtime consumers:** Did we miss any runtime consumers of coco or sidecar that don't import by name but discover tools dynamically via MCP server introspection or skill-advisor graph queries?

## Phase count/ordering confirmation

**Phase count: 8 phases (CONFIRMED)** [SOURCE: iteration-007.md]
- 002-decouple-code-graph
- 003-remove-memory-rerank-path
- 004-remove-rerank-sidecar-skill
- 005-remove-coco-index-skill
- 006-runtime-configs-4runtime-mirror
- 007-docs-readme-search-routing
- 008-runtime-artifacts-cleanup

**No changes to phase count or ordering identified.** The 8-phase DAG from iteration-007 remains valid after:
- Iteration-008 added 16 net-new touchpoints (distributed across phases 002, 006, 007)
- Iteration-009 confirmed coupling isolation (memory and code-graph)
- Reconciled file counts: ~247 total touchpoints across 8 phases

**Ordering rationale remains sound:**
- Hard constraint "DECOUPLE BEFORE DELETE" prevents system breakage
- Dependency graph respected (code-graph → memory → sidecar → coco → configs → docs → artifacts)
- No new dependencies discovered that would require reordering

**Verification:** The deepseek closers (iterations 11-12) should adversarially challenge the DAG ordering safety and touchpoint classification correctness before final synthesis.
