### 1. Executive verdict

001 `REVISE_SCOPE`; 002 `KEEP_AS_IS`; 003 `REVISE_SCOPE`; 004 `REVISE_SCOPE`; 005 `MERGE`; 006 `REVISE_SCOPE`; 007 `DEFER`; 008 `REVISE_SCOPE`; 009 `REVISE_SCOPE`; 010 `DEFER`; 011 `DEFER`.

The packet is still directionally right, but not implementation-ready. The codebase did not already ship the 027 XCE primitives: current `code_graph` exposes only scan/query/status/context/verify/apply/detect/ccc tools, not HLD/trace/risk tools (`.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:L21-L33`). But the last 26+ commits did change the surrounding contract: `:auto`, doctor, causal graph routing, eval, and council graph work now overlap with rollout/evaluation phases. Recommended next action: run a spec-refresh pass before implementation, repairing dependencies and narrowing 006/008-011.

### 2. Per-phase audit

**Phase 001 — CocoIndex Complete Fork** | `REVISE_SCOPE`  
Target-file existence check: `.opencode/skills/mcp-coco-index/mcp_server/**` exists as a partial soft fork; docs still say upstream forked `0.2.3`, current fork `0.2.3+spec-kit-fork.0.2.0` (`.opencode/skills/mcp-coco-index/SKILL.md:L16`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/_version.py:L31-L32`). Scope drift: overlaps 013 doctor/update work, commit `8d794afad`, because 013 includes `/doctor:cocoindex` and database/index migration coverage (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md:L66-L70`, `L102-L106`). Risk validity: still valid; current fork lacks upstream-style chunker/embedder modules present in the downloaded external tree (`external/cocoindex-code-main/src/cocoindex_code/chunking.py:L1-L29`, `embedder_params.py:L1-L20`). Dependency graph: still the right blocker for 007/010/011, as parent says CocoIndex-facing phases wait for 001 (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:L60-L66`). Recommendation: keep as foundation, but revise from “import v0.2.33” to “diff current fork against downloaded upstream snapshot, then choose flat vs `src/` layout.”

**Phase 002 — Code Graph HLD/LLD** | `KEEP_AS_IS`  
Target check: planned code-graph files exist; current context mode is only `neighborhood|outline|impact` (`code-graph-context.ts:L19-L30`) and handler parsing has no `omni` (`handlers/context.ts:L264-L266`). Scope drift: low; no shipped sibling implements deterministic HLD/LLD. Risk validity: schema-drift risk is still real because serialized handler output must change with local types (`002-code-graph-hld-lld/spec.md:L159-L160`). Dependency graph: valid; it feeds 003 and optionally 004 (`002-code-graph-hld-lld/plan.md:L138-L142`). Recommendation: proceed, but either implement `omni` end-to-end or remove it from scope as the spec already requires.

**Phase 003 — Trace Tool** | `REVISE_SCOPE`  
Target check: planned new `code_graph_trace` tool is absent from current tool registry (`code-graph-tools.ts:L21-L33`). Current DB has the needed file ownership primitives: `CodeNode.filePath` (`indexer-types.ts:L52-L67`) and edge queries (`code-graph-db.ts:L949-L987`). Scope drift: no sibling solved this. Risk validity: still valid; the spec correctly avoids fqName ownership and depends on `filePath` (`003-code-graph-trace/spec.md:L143-L148`). Dependency graph: metadata is stale: it says depends on `027/003-code-graph-hld-lld` and later “cannot start until 001 lands,” but the real hard dependency is 002 (`003-code-graph-trace/spec.md:L63`, `L147`). Recommendation: keep the feature, fix dependency labels before execution.

**Phase 004 — Risk-Scored Impact Analysis** | `REVISE_SCOPE`  
Target check: current `code_graph_context` already has a lightweight impact mode over incoming CALLS/IMPORTS (`code-graph-context.ts:L458-L491`), and `detect_changes` returns affected symbols/files/readiness, not risk scores (`detect-changes.ts:L40-L49`). Scope drift: low with 012 causal routing commit `d232da4ee`; related graph routing exists but not code impact scoring (`009-causal-graph-channel-routing/spec.md:L19-L22`). Risk validity: heuristic-weight risk remains valid (`004-code-graph-impact-analysis/spec.md:L157-L161`). Dependency graph: optional 002/003 enrichment remains right (`004-code-graph-impact-analysis/plan.md:L136-L141`). Recommendation: revise to extend existing `impact`/`detect_changes` semantics, not create a parallel concept.

**Phase 005 — Skill Advisor First Action Mandate** | `MERGE`  
Target check: `render.ts` still emits soft “use” wording (`render.ts:L155-L157`), while Phase 005 plans `MUST invoke FIRST` in the render layer (`005-skill-advisor-first-action-mandate/spec.md:L37-L44`). Scope drift: high with 103 `:auto` contract commit `add6cff39`; 103 shipped a shared three-tier noninteractive contract with 13/13 live PASS (`103.../implementation-summary.md:L36-L49`, `L93-L111`). Risk validity: still relevant; `passes_threshold === true` can bypass renderer-side uncertainty checks (`render.ts:L124-L133`, `skill-advisor-brief.ts:L148-L162`). Dependency graph: self-contained. Recommendation: merge this into the new routing/advisor contract surface; avoid a second, inconsistent “must-first” vocabulary.

**Phase 006 — Code Graph Adoption Eval** | `REVISE_SCOPE`  
Target check: planned custom eval harness overlaps existing eval surfaces: `eval_run_ablation` and `eval_reporting_dashboard` are already registered (`tool-input-schemas.ts:L776-L779`), and the database README treats `speckit-eval.db` as generated runtime data (`database/README.md:L109-L118`). Scope drift: high with 103, 060, and deep-ai-council v1.1: 103 has live command verification, 060 has reusable stress methodology, and 101 has graph value automation (`103.../implementation-summary.md:L144-L163`, `060.../spec.md:L47-L52`, `101.../spec.md:L127-L140`). Risk validity: subprocess risk remains valid (`006-code-graph-adoption-eval/spec.md:L169-L176`). Dependency graph: stale numbering at `Depends on`; it lists shifted phase IDs (`006-code-graph-adoption-eval/spec.md:L66-L66`). Recommendation: keep the evaluation need, but reuse existing eval/stress patterns and repair phase references.

**Phase 007 — Coco Intent Steering** | `DEFER`  
Target check: current query path embeds one query (`query.py:L267-L294`) and has only implementation-intent path-class nudges (`query.py:L57-L59`, `L177-L223`). Planned `intent_classifier.py` is not present. Scope drift: low with 005/103; only advisor wording overlaps. Risk validity: precision/cost risks remain valid (`007-coco-intent-steering/spec.md:L198-L205`). Dependency graph: hard dependency on 001 still valid (`007-coco-intent-steering/spec.md:L53-L55`). Recommendation: defer until 001 lands; then reassess whether expansion belongs in Python or a shared calibration layer.

**Phase 008 — Memory Semantic Triggers** | `REVISE_SCOPE`  
Target check: the requested `mcp_server/lib/memory/` path is not present in current source; live tool dispatch is under `tools/memory-tools.ts` (`memory-tools.ts:L63-L75`) and schemas under `tool-input-schemas.ts:L820-L825`. Scope drift: low with 012 causal routing; both affect memory recall/routing but not semantic trigger matching (`012.../spec.md:L19-L22`). Risk validity: still high; semantic false positives can mis-prioritize cognitive tiers, exactly as spec says (`008-memory-semantic-triggers/spec.md:L41-L55`, `L221-L226`). Dependency graph: dependency on 006 should become “requires shadow eval evidence,” not necessarily the planned custom harness. Recommendation: repair paths and keep lexical-first/default-off design.

**Phase 009 — Feedback Reducers** | `REVISE_SCOPE`  
Target check: `ccc_feedback` is still append-only JSONL (`ccc-feedback.ts:L29-L60`); relation coverage now exists for causal graph health (`relation-coverage.ts:L36-L45`), and memory retention has state/tier limits in search pipeline (`stage4-filter.ts:L64-L80`). Scope drift: high with 012 causal routing commit `d232da4ee`; 012 activates causal graph channels and remediation, so reducer assumptions need refresh (`012.../spec.md:L46-L52`). Risk validity: still valid; its P0s remain serious on paper (`009-feedback-reducers/spec.md:L53-L58`, `L263-L271`). Dependency graph: soft dependency on 006 is reasonable, but P0 fixes should not wait on eval (`009-feedback-reducers/spec.md:L167-L172`). Recommendation: split P0 correctness fixes from learning reducers.

**Phase 010 — Retrieval Rerank Clients** | `DEFER`  
Target check: memory already has provider-generic rerank/caching/circuit-breaker internals (`cross-encoder.ts:L35-L60`, `L252-L270`, `L411-L455`); Coco still has only path-class rerank (`query.py:L177-L223`). Scope drift: low. Risk validity: abstraction-boundary risk remains valid (`010-retrieval-rerank-clients/spec.md:L222-L228`). Dependency graph: split is already correct: memory extraction can proceed, Coco adapter waits for 001 (`010.../decision-record.md:L132-L136`). Recommendation: defer Coco adapter; consider memory-only interface extraction only if another consumer is imminent.

**Phase 011 — Coco/Memory Context Extras** | `DEFER`  
Target check: Coco result telemetry already has `raw_score`, `path_class`, `rankingSignals` (`server.py:L45-L56`); memory search allows `includeTrace`/profile params (`tool-input-schemas.ts:L821-L822`). Scope drift: overlaps 009 feedback and 006 eval, not solved. Risk validity: valid; phase itself admits presentation-layer nondeterminism/default-off requirements (`011-coco-memory-context-extras/spec.md:L45-L68`, `L261-L267`). Dependency graph: still rightly depends on 001 and soft-depends 006/008/009/010 (`011.../spec.md:L87-L87`). Recommendation: defer until retrieval quality data shows a real presentation gap.

### 3. Cross-packet overlap matrix

| Phase | 012 | 010 | 028→103 | 013 | 100 | sk-code v3.x | deep-ai-council v1.1 | 060 | 059 |
|---|---|---|---|---|---|---|---|---|---|
| 001 | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | OVERLAP_HIGH | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 002 | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 003 | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 004 | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 005 | NO_OVERLAP | NO_OVERLAP | OVERLAP_HIGH | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 006 | OVERLAP_LOW | NO_OVERLAP | OVERLAP_HIGH | OVERLAP_LOW | OVERLAP_LOW | OVERLAP_LOW | OVERLAP_HIGH | OVERLAP_HIGH | OVERLAP_LOW |
| 007 | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 008 | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 009 | OVERLAP_HIGH | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | OVERLAP_LOW | NO_OVERLAP |
| 010 | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP |
| 011 | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP | NO_OVERLAP | NO_OVERLAP | OVERLAP_LOW | NO_OVERLAP |

OVERLAP_HIGH notes: 001×013 shares CocoIndex doctor/migration surface (`013.../spec.md:L102-L106`). 005×103 shares first-action/noninteractive routing language (`103.../spec.md:L45-L55`). 006×103 overlaps verification protocol (`103.../implementation-summary.md:L144-L163`). 006×deep-ai-council overlaps graph value scenario automation (`101.../spec.md:L127-L140`). 006×060 overlaps stress/eval methodology (`060.../spec.md:L47-L52`). 009×012 overlaps causal graph channel utilization and remediation (`012.../spec.md:L19-L30`).

### 4. CocoIndex v0.2.33 baseline reality check

The partial soft-fork is still under `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`, with the changelog saying the inception vendored 15 Python files from upstream 0.2.3 (`CHANGELOG.md:L31-L39`). The current skill explicitly says the Rust `cocoindex` engine is not forked (`README.md:L31-L33`).

Best inference from `external/cocoindex-code-main/`: the downloaded upstream snapshot is materially ahead of the current fork because it has hatch/uv packaging and newer wrapper modules such as custom chunking and LiteLLM embedder support (`external/.../pyproject.toml:L24-L35`, `chunking.py:L1-L29`, `litellm_embedder.py:L1-L19`). Whether upstream has moved past v0.2.33 as of 2026-05-11 is UNCERTAIN from local files: `pyproject.toml` uses dynamic VCS versioning, not a literal version string (`external/.../pyproject.toml:L5-L7`, `L70-L75`). Complete fork is still a valid prerequisite for 007/010/011, but incremental sync is now feasible if Phase 001 first produces a clean diff/import manifest.

### 5. Re-prioritization proposal

1. **Spec-refresh first:** repair dependencies, paths, and shipped-overlap assumptions across 001-011. Parent dependency text is already stale around 006 and phase numbering (`027.../spec.md:L52-L66`, `006.../spec.md:L66-L66`).
2. **001 next, revised:** make the fork baseline explicit before touching Coco behavior.
3. **002 → 003 → 004:** these are the core XCE-value phases and are not superseded.
4. **005 merged into advisor/:auto language:** small, useful, but should conform to 103.
5. **009 P0 fixes before reducers:** correctness before learning.
6. **006 after core tools:** reuse current eval/stress infrastructure.
7. **008 after path repair and shadow eval design.**
8. **007/010/011 deferred until 001 and eval evidence.** No phase needs outright cancellation yet.

### 6. Open questions for the user

1. Should Phase 001 still target the downloaded v0.2.33 snapshot, or should we refresh upstream first?
2. Do you want 005 as a standalone tiny patch, or folded into the next advisor/:auto contract packet?
3. Should 009 P0 fixes be split into their own small correctness packet?
4. Is Phase 006 meant to measure XCE-like productivity, or only validate default-on readiness?
5. Should 011 remain bundled, or split Coco exemplars from memory curator before resuming?
