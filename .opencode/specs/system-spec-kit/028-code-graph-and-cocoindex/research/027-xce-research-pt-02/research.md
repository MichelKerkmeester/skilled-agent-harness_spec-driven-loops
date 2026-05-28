> Extracted from `027/research/027-xce-research-pt-02/research.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

## Executive Summary

The second-pass cross-validation completed all 10 IRQ iterations and emitted a convergence event at run 10 (`deep-research-state.jsonl:3-13`). The pass confirms the original five-phase direction, but it finds implementation blockers in the actual contracts: Phase 001 needs deterministic ordering and unresolved-edge policy before HLD/LLD output is reliable, Phase 002 cannot rely on current `CONTAINS` edges for file/module traces, Phase 003 needs reproducible scoring semantics and incoming `TESTED_BY` handling, Phase 004 needs guardrails before stronger "MUST invoke FIRST" wording, and Phase 005 needs subprocess lifecycle/auth/result schemas before 24-40 OpenCode dispatches are credible (`iterations/iteration-001.md:17-45`, `iterations/iteration-002.md:19-65`, `iterations/iteration-003.md:30-58`, `iterations/iteration-004.md:25-53`, `iterations/iteration-005.md:20-48`). The recommended order remains `004 -> 001 -> {002,003} -> 005`, with Phase 003 allowed to proceed independently for the deterministic MVP if optional layer and LLM enrichment remain explicitly skippable (`iterations/iteration-010.md:55-59`).


## IRQ1 - Phase 001 HLD/LLD Determinism

- Detail file: [iterations/iteration-001.md](iterations/iteration-001.md).
- Verdict: **BLOCKING** for Phase 001 implementation readiness.
- Phase scaffold anchor: Phase 001 requires deterministic `generateHLD()` output across 100 calls and caps primary symbols at 50 (`../../001-code-graph-hld-lld/spec.md:150`, `../../001-code-graph-hld-lld/spec.md:225`).
- mcp_server anchor: `code_nodes` exposes stable ordering fields such as `kind`, `name`, `start_line`, `end_line`, and `symbol_id`, and `code_edges` stores endpoints without foreign-key references (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:122-145`).
- Finding: Iteration 001 found three blockers: stable sorting before truncation, a policy for dangling edge targets, and deterministic selection among multiple module symbols (`iterations/iteration-001.md:17-45`).
- Confirmed ground: empty files, nullable docstrings, mixed embedded content, and stale DB determinism mostly align with existing scope when handler readiness metadata is preserved (`iterations/iteration-001.md:23-57`).
- Required amendment: Phase 001 should add an explicit sort contract, an unresolved dependency policy, and a primary-module rule before implementation.
- Phase impact: Phase 001 itself is blocked; Phase 002 inherits the role contract risk through `classifyFileRole()` (`iterations/iteration-006.md:19-29`).


## IRQ2 - Phase 002 CONTAINS Trace Semantics

- Detail file: [iterations/iteration-002.md](iterations/iteration-002.md).
- Verdict: **BLOCKING** for the current Phase 002 trace design.
- Phase scaffold anchor: Phase 002 claims existing `CONTAINS` edges cover `symbol -> class -> file`, and its P0 output requires at least `symbol`, `file`, and `architectural_role` (`../../002-code-graph-trace/spec.md:41-43`, `../../002-code-graph-trace/spec.md:107`).
- mcp_server anchor: the actual edge emitter only creates class-to-method `CONTAINS` edges, while module nodes are synthetic and not connected by containment edges (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-963`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`).
- Finding: The upward trace cannot get file/module ownership from `CONTAINS`; Phase 002 must source `file` from `CodeNode.filePath` and define a separate module policy (`iterations/iteration-002.md:19-29`, `iterations/iteration-002.md:61-65`).
- Edge cases: nested classes can pick the wrong parent, Bash/doc files cannot emit `CONTAINS`, and anonymous/default export cases need fixtures before trace completeness is promised (`iterations/iteration-002.md:37-53`).
- No-change boundary: Go/Rust and TypeScript namespace cases are future parser expansion risks, not current Phase 002 blockers, because the supported runtime language set does not include Go/Rust (`iterations/iteration-002.md:31-35`, `iterations/iteration-002.md:55-59`).
- Required amendment: Phase 002 should demote `fq_name` dot splitting to symbol display only, make file/module resolution P0, and keep `code_packages` P1 unless redesigned around file paths.


## IRQ3 - Phase 003 Risk Formula Validation

- Detail file: [iterations/iteration-003.md](iterations/iteration-003.md).
- Verdict: **BLOCKING** for reproducible scores; **CONFIRMED** for additive MVP shape.
- Phase scaffold anchor: Phase 003 calls the formula heuristic/tunable, requires scores in `[0..1]`, and leaves empirical validation to Phase 005 (`../../003-code-graph-impact-analysis/spec.md:48-58`, `../../003-code-graph-impact-analysis/spec.md:137`, `../../003-code-graph-impact-analysis/spec.md:196`).
- mcp_server anchor: `queryEdgesFrom()` and `queryEdgesTo()` accept symbol IDs, while `queryFileDegrees(filePaths)` is the existing file-level aggregation helper (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:949-987`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1039-1083`).
- Finding: Phase 003's text describes file-level risk signals through symbol-level APIs, and `normalize()` is not specified, so two implementations could return different scores for the same graph (`iterations/iteration-003.md:36-46`).
- Confirmed ground: additive scoring is the right MVP because multiplicative scoring would zero out independent untested risk for files with zero fan-in (`iterations/iteration-003.md:48-52`).
- Required amendment: define file aggregation, deterministic normalization, BFS implementation over returned import-dependent pairs, and label weight defaults as heuristic until Phase 005 calibrates them (`iterations/iteration-003.md:30-58`).


## IRQ5 - Phase 005 Eval Harness Reliability

- Detail file: [iterations/iteration-005.md](iterations/iteration-005.md).
- Verdict: **BLOCKING** for subprocess orchestration reliability.
- Phase scaffold anchor: Phase 005 requires SIGTERM at 600s, timeout records, 12 tasks x 2 runs, retries, incremental JSONL, and smoke/stress paths (`../../005-code-graph-adoption-eval/spec.md:117-150`, `../../005-code-graph-adoption-eval/spec.md:186-189`).
- mcp_server anchor: the context server has its own SIGTERM cleanup hooks and WAL checks, but the eval harness must still own subprocess close-event waiting and escalation (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1623-1665`, `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1912-1918`).
- Finding: `</dev/null` fixes startup stdin deadlock, not process-tree cleanup, auth preflight, discriminated result rows, or mocked scale reliability (`iterations/iteration-005.md:20-48`).
- Confirmed ground: strictly sequential JSONL writes avoid append races, but rows still need condition and attempt metadata (`iterations/iteration-005.md:38-42`).
- No-change boundary: watcher internals are not a separate Phase 005 feature; cleanup belongs to subprocess lifecycle handling (`iterations/iteration-005.md:50-54`).
- Required amendment: define spawn/stdin, SIGTERM/SIGKILL, auth preflight caching, result schemas, stale-process checks, DB readiness retries, and mocked 12 x 2 dispatcher stress tests.


## IRQ6 - Cross-Phase Schema Contracts

- Detail file: [iterations/iteration-006.md](iterations/iteration-006.md).
- Verdict: **BLOCKING** for Phase 001/002 contract drift and Phase 003 optional-layer fallback.
- Phase scaffold anchor: Phase 001 names five baseline file roles, adds `empty`, and leaves closed enum vs open string unresolved; Phase 002 consumes the exact `classifyFileRole()` output as `architectural_role` (`../../001-code-graph-hld-lld/spec.md:161`, `../../001-code-graph-hld-lld/spec.md:224`, `../../001-code-graph-hld-lld/spec.md:254`, `../../002-code-graph-trace/spec.md:107-110`).
- mcp_server anchor: the current `code_graph_context` type supports `neighborhood | outline | impact`, and the handler accepts those same modes before defaulting to `neighborhood` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:19`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:264-266`).
- Finding: Phase 001's planned `queryMode:'omni'` and `hld_lld` payload conflict with current context result/schema, so generator success alone would not guarantee MCP-wire success (`iterations/iteration-006.md:31-35`).
- Finding: `classifyFileRole()` is implied by Phase 002 but not pinned as a public Phase 001 signature (`iterations/iteration-006.md:25-29`).
- Confirmed ground: `trace.architectural_role` should be an alias of HLD `file_role`, not a second classifier (`iterations/iteration-006.md:37-41`).
- Required amendment: document role as open string with baseline/reserved labels, pin `classifyFileRole(filePath, db)`, update context query modes and serialization together, and define Phase 003's layer fallback as unavailable/null when Phase 001 is absent.


## IRQ7 - TESTED_BY Signal Ground Truth

- Detail file: [iterations/iteration-007.md](iterations/iteration-007.md).
- Verdict: **BLOCKING** for Phase 003's test-coverage signal as written.
- Phase scaffold anchor: Phase 003 says missing `TESTED_BY` edges set `untestedFlag=true` and gives that risk term a 0.25 weight (`../../003-code-graph-impact-analysis/spec.md:50-53`, `../../003-code-graph-impact-analysis/spec.md:173`).
- mcp_server anchor: `TESTED_BY` edges are emitted from test-file nodes to production-file nodes, so production symbols must use incoming `queryEdgesTo(symbolId, 'TESTED_BY')` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2040-2046`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-981`).
- Finding: the spec's outgoing direction would mark actually tested files as untested (`iterations/iteration-007.md:31-35`).
- Finding: absence of `TESTED_BY` means unknown-or-missing, not proven untested, because current population is a narrow sibling filename heuristic (`iterations/iteration-007.md:37-41`).
- No-change boundary: Phase 003 should not expand the structural indexer; it should use incoming graph edges plus a bounded same-directory sibling heuristic if no graph evidence exists (`iterations/iteration-007.md:43-47`).
- Required amendment: rename/output `coverageEvidence` or `coverageUnknownOrMissing`, aggregate incoming edges over all production file symbols, and add fixtures for supported and unsupported test layouts.


## IRQ8 - code_packages Escalation

- Detail file: [iterations/iteration-008.md](iterations/iteration-008.md).
- Verdict: **BLOCKING** for `fq_name`-derived module ownership; **NO-CHANGE-NEEDED** for performance-only schema migration.
- Phase scaffold anchor: Phase 002's plan keeps `code_packages` optional and says it is populated from `fq_name` prefixes (`../../002-code-graph-trace/plan.md:39-42`).
- mcp_server anchor: `fqName` is built from lexical capture parentage, module nodes use basename-derived names, and `CodeNode.filePath` is the reliable file/package anchor (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:233-235`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-956`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:52-67`).
- Finding: dot splitting fails because dots mean class/function nesting, not package hierarchy (`iterations/iteration-008.md:23-33`, `iterations/iteration-008.md:41-45`).
- Confirmed ground: live DB samples and export parsing show common shapes where `fq_name` cannot recover durable module ownership (`iterations/iteration-008.md:35-51`).
- No-change boundary: current indexes and scale do not prove a P0 package-table migration for performance; correctness is the escalation trigger (`iterations/iteration-008.md:53-57`).
- Required amendment: derive file/module from `filePath`; keep `code_packages` optional unless it is redesigned around file paths, package markers, path aliases, and import metadata.


## IRQ9 - Phase 003 LLM Enrichment Provider

- Detail file: [iterations/iteration-009.md](iterations/iteration-009.md).
- Verdict: **BLOCKING** if remote LLM enrichment has any implicit default.
- Phase scaffold anchor: Phase 003 currently has a boolean `enrichWithLLM: true` acceptance path and mentions latency/cost only as opt-in risks (`../../003-code-graph-impact-analysis/spec.md:125-129`, `../../003-code-graph-impact-analysis/spec.md:148-153`).
- mcp_server anchor: the public providers API exports embedding functions only, and local reranking/cross-encoder paths are scoring primitives rather than reusable narrative generation clients (`.opencode/skills/system-spec-kit/mcp_server/api/providers.ts:7-13`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts:84-90`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:1-19`).
- Finding: `cli-opencode`/`opencode-go` and direct DeepSeek are useful operator routes, but both are hosted-provider paths and must be explicit opt-in, not default local-first behavior (`iterations/iteration-009.md:20-36`).
- Confirmed ground: remote narrative calls differ from adopting XCE's hosted MCP endpoint if deterministic impact output remains complete and local (`iterations/iteration-009.md:50-54`).
- Required amendment: replace the boolean-only contract with `{enabled, provider, model?, timeoutMs?, maxCallsPerSession?, maxInputBytes?, cacheKey?}`, default to skipped/unconfigured, and inherit the Phase 005 subprocess hardening contract if CLI dispatch remains an option (`iterations/iteration-009.md:44-60`).


## IRQ10 - Phasing Order Optimization

- Detail file: [iterations/iteration-010.md](iterations/iteration-010.md).
- Verdict: **CONFIRMED** with amendments; the order remains `004 -> 001 -> {002,003} -> 005`.
- Phase scaffold anchor: the parent spec recommends `004 first`, then `001 -> 002 -> 003 in parallel`, then `005 last`, and Phase 005 depends on all four earlier phases (`../../spec.md:45-56`, `../../005-code-graph-adoption-eval/description.json:20-22`).
- mcp_server anchor: every `CodeNode` carries `filePath`, current `CONTAINS` is class-to-method, and incoming `queryEdgesTo()` is the correct production-symbol reader for `TESTED_BY` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:52-67`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-987`).
- Finding: Phase 002 still depends on Phase 001 for `architectural_role`, but not for `filePath`; file/module ownership comes from `CodeNode.filePath` (`iterations/iteration-010.md:19-23`).
- Finding: Phase 003 can remain dependency-free for deterministic output if layer and LLM enrichment stay optional and skippable (`iterations/iteration-010.md:25-35`, `iterations/iteration-010.md:49-53`).
- Finding: Phase 004 should still ship first, but only with render-layer guardrails; Phase 005 should move to Level 3 unless subprocess hardening is split out (`iterations/iteration-010.md:37-47`).


## Cross-Cutting Risks

- **Schema contract drift** spans Phase 001/002/003. Role labels are open strings but consumed as contracts, `classifyFileRole()` is not pinned, `queryMode:'omni'` is not accepted by current context code, and optional `layer` fallback is undefined (`iterations/iteration-006.md:19-48`).
- **Graph API level mismatch** spans Phase 002/003. Phase 002 assumes containment reaches file/module levels, and Phase 003 describes file-level signals through symbol-level APIs (`iterations/iteration-002.md:19-29`, `iterations/iteration-003.md:42-46`).
- **Evidence-class honesty** spans Phase 003/007/009. TESTED_BY absence, heuristic weights, and LLM enrichment must be labeled as heuristic/optional rather than validated facts (`iterations/iteration-003.md:30-64`, `iterations/iteration-007.md:37-47`, `iterations/iteration-009.md:50-60`).
- **Runtime hardening** spans Phase 003/005. Any CLI enrichment or eval dispatcher inherits the same provider preflight, timeout, close-event, and structured-result requirements (`iterations/iteration-005.md:20-48`, `iterations/iteration-009.md:56-60`).
- **Test rewrites are not incidental**. Phase 004 exact-string tests, Phase 003 coverage fixtures, Phase 002 trace fixtures, and Phase 005 mocked stress tests are required for the claims to hold (`iterations/iteration-004.md:49-53`, `iterations/iteration-007.md:49-53`, `iterations/iteration-002.md:49-71`, `iterations/iteration-005.md:44-48`).


## Comparison vs Pass 1

- Pass 1 got the broad adaptation direction right: template-only HLD/LLD, trace, impact analysis, advisor mandate, and eval harness remain the actionable phase set (`../../spec.md:47-55`, `../research.md:26-29`).
- Pass 1 correctly kept XCE SaaS endpoint adoption out of scope; IRQ9 reinforces that default remote enrichment would reintroduce the same dependency class if hidden behind a boolean (`../findings.md:58-62`, `iterations/iteration-009.md:20-36`).
- Pass 1 missed the concrete `CONTAINS` mismatch: current source emits class-to-method containment only, not file/module traces (`iterations/iteration-002.md:19-29`).
- Pass 1 missed several schema deltas: `queryMode:'omni'` is absent from the current context schema, role string openness needs a cross-phase contract, and `classifyFileRole()` needs an exported signature (`iterations/iteration-006.md:19-35`).
- Pass 1 undercounted Phase 005 operational risk; the second pass finds Level 3-level subprocess lifecycle, auth, schema, and stress-test requirements (`iterations/iteration-005.md:20-48`, `iterations/iteration-010.md:43-47`).
- Pass 1 treated Phase 003 optional enrichment as a smaller add-on than it is; IRQ9 shows default provider/auth/budget semantics are part of the user-visible contract (`iterations/iteration-009.md:44-60`).


## Recommended Phasing-Order Amendment

1. **004-skill-advisor-first-action-mandate**. Ship first because it has no code_graph dependency, but amend it to re-check uncertainty or prove the producer invariant, add fallback hints, and update renderer/producer tests (`iterations/iteration-010.md:37-41`).
2. **001-code-graph-hld-lld**. Ship next because Phase 002 consumes `classifyFileRole()` and the role domain; amend determinism, dangling-edge, primary-module, open-string, and context-schema contracts first (`iterations/iteration-001.md:17-45`, `iterations/iteration-006.md:19-35`).
3. **002-code-graph-trace** and **003-code-graph-impact-analysis**. Run in parallel after Phase 001 for lowest integration risk; Phase 003 may start earlier only if layer and LLM enrichment remain optional/skipped (`iterations/iteration-010.md:25-35`, `iterations/iteration-010.md:55-59`).
4. **005-code-graph-adoption-eval**. Keep last because it consumes all four earlier phases, and bump to Level 3 unless subprocess lifecycle/auth-cache/result-schema hardening is split into a prerequisite packet (`iterations/iteration-010.md:43-47`).


## Open Questions

- Should Phase 001's unresolved edge policy filter dangling dependencies or emit structured unresolved records? Iteration 001 identifies the blocker but leaves the policy choice open (`iterations/iteration-001.md:70-73`).
- Should Phase 002's `module` mean basename module, package segment, directory package, or Phase 001 architectural module? Iteration 002 proves the current answer is ambiguous (`iterations/iteration-002.md:84-86`).
- Which deterministic normalizer should Phase 003 standardize: log-cap, percentile-with-baseline, or fixed caps per signal? Iteration 003 recommends shapes but does not choose final constants (`iterations/iteration-003.md:36-40`).
- Should Phase 003 include a same-directory test-file heuristic when graph evidence is absent, or only report unknown coverage? Iteration 007 recommends a bounded heuristic, but this is still a product choice (`iterations/iteration-007.md:43-53`).
- Should Phase 005 be split into a subprocess hardening prerequisite packet, or should the phase level be raised to Level 3? Iteration 010 leaves both viable (`iterations/iteration-010.md:43-47`).
- Is a third pass warranted? Only if the user wants policy decisions for unresolved edge representation, module semantics, normalizer constants, and Phase 005 split vs Level 3 before amending the phase specs.


## References

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/plan.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-skill-advisor-first-action-mandate/spec.md`
- `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/findings.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-008.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-009.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-010.md`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/api/providers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`

