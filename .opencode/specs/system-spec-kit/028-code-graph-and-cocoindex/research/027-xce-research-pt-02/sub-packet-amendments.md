> Extracted from `027/research/027-xce-research-pt-02/sub-packet-amendments.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

## Phase 001 amendments

**Status**: NEEDS_AMENDMENT

**REQ-level edits**

- Add to P0: `REQ-012 | Stable ordering before truncation | generateHLD() and generateLLD() MUST sort candidate symbols before applying primary-symbol or LLD caps using a deterministic order: kind priority, start_line ascending, name ascending, symbol_id ascending.`
- Add to P0: `REQ-013 | Dangling edge policy | generateLLD() MUST either filter unresolved edge endpoints or emit structured unresolved dependency records; the chosen policy MUST be documented and covered by a fixture with an edge endpoint missing from code_nodes.`
- Add to P0: `REQ-014 | Primary module selection | When multiple module-like symbols exist for one file, select the primary module deterministically by preferring the synthetic file module where fq_name equals getModuleName(filePath), then lowest start_line, then symbol_id.`
- Change REQ-007 text to: `File-role classification returns an open string with required baseline labels module, api-handler, library, test, config and reserved edge labels including empty. Consumers MUST NOT treat this as a closed enum.`
- Add to P0: `REQ-015 | Public classifier contract | Export classifyFileRole(filePath: string, db: CodeGraphDbLike): string, and ensure generateHLD(file, db).file_role equals classifyFileRole(file, db) for the same indexed state.`
- Change omni/context integration requirement to: `REQ-016 | Context wire contract | If queryMode:'omni' is supported, update QueryMode, ContextResult, handler input parsing, and serialized handler JSON to carry an optional hld_lld payload; otherwise remove omni from Phase 001 scope.`

**Plan-level edits**

- Add step before generator implementation: `Define deterministic symbol sort helpers and use them before every capped array is returned.`
- Add step before dependency rendering: `Choose unresolved-edge policy and implement a single helper for dependency rows so HLD/LLD and tests share behavior.`
- Add step before role classifier tests: `Define role-domain documentation as open string plus baseline labels; include empty/comment-only role fixtures.`
- Add step before handler integration: `Update code_graph_context QueryMode, ContextResult, handler parse path, and serialized output together; add a handler-level JSON parse integration test.`
- Change any plan language that implies `file_role` is a closed enum to `open string contract with baseline labels`.

**Tasks-level edits**

- Add task: `T-001A: Add stable sort helper and tests for 100 repeated calls with 1000+ symbols.`
- Add task: `T-001B: Add dangling-edge fixture and implement chosen unresolved dependency policy.`
- Add task: `T-001C: Add primary-module selection fixture with synthetic module plus captured module-like symbol.`
- Add task: `T-001D: Export classifyFileRole(filePath, db) and add equality test with generateHLD().file_role.`
- Add task: `T-001E: Add context handler integration test for queryMode:'omni' and hld_lld serialization, or remove omni from scope.`

**Risks-level edits**

- Add risk: `Schema drift: context QueryMode/ContextResult updates can compile locally while MCP serialized output omits hld_lld; mitigate with handler JSON integration test.`
- Add risk: `Role-domain drift: Phase 002 may reject future role labels if it treats file_role as a closed enum; mitigate with open-string contract tests.`
- Add risk: `Unresolved edges can destabilize generated dependency narratives; mitigate by filtering or structured unresolved records.`

**LOC delta estimate**

- Original estimate: ~250 LOC.
- Proposed delta: +70 to +120 LOC.
- Revised estimate: ~320 to ~370 LOC, mostly tests and context-schema integration.


## Phase 002 amendments

**Status**: NEEDS_AMENDMENT

**REQ-level edits**

- Change REQ-001 text to: `traceSymbol(symbolId, db) returns at minimum symbol, file, architectural_role, and chain metadata. The file rung MUST be sourced from CodeNode.filePath, not inferred from CONTAINS or fq_name.`
- Change REQ-004 text to: `architectural_role uses Phase 001 classifyFileRole(filePath, db) and MUST equal generateHLD(filePath, db).file_role for the same indexed state.`
- Add to P0: `REQ-008 | Deterministic module ownership | The module rung MUST be derived from an explicit file-path policy, such as nearest package/root segment or basename fallback, and MUST NOT be inferred from dotted fq_name segments.`
- Add to P0: `REQ-009 | Sparse containment behavior | Top-level functions, Bash functions, doc symbols, module nodes, anonymous/default exports, and symbols with no incoming CONTAINS edge MUST still return valid file and architectural_role fields.`
- Add to P0: `REQ-010 | Nested class containment correctness | If CONTAINS is used for class/method display, parent matching MUST compare against class fqName, not short name.`
- Change REQ-007 to P1: `code_packages may optimize or formalize module hierarchy only after the P0 filePath-derived module policy is correct. A table populated from fq_name prefixes is not acceptable as the P0 source of truth.`

**Plan-level edits**

- Replace `walk CONTAINS until file/module` with: `Load the subject CodeNode, read filePath, build symbol/class display from available CONTAINS/fqName metadata, derive module from filePath policy, and call classifyFileRole(filePath, db).`
- Replace `code_packages from fq_name prefixes` with: `P1 package metadata, if kept, must be populated from file paths, package markers, path aliases, import metadata, or explicit config.`
- Add step: `Patch CONTAINS nested-class parent lookup to compare fqName, or defensively avoid relying on nested containment until fixed.`
- Add step: `Define module policy examples for TS/JS, Python, Bash, and doc files under the current SupportedLanguage set.`

**Tasks-level edits**

- Add task: `T-002A: Implement filePath-derived file/module resolution helper and unit tests.`
- Add task: `T-002B: Add sparse symbol fixtures: top-level TS function, Bash function, doc symbol/no node, module node, star re-export, named default class, anonymous default class.`
- Add task: `T-002C: Add nested class fixture proving fqName-based parent matching.`
- Add task: `T-002D: Add shared contract test with Phase 001: trace.architectural_role === classifyFileRole(filePath, db).`
- Remove or defer task: `Implement code_packages table from fq_name prefix splitting` unless redesigned as P1 file-path/package metadata.

**Risks-level edits**

- Add risk: `Current CONTAINS edges only cover class-to-method pairs, so trace completeness can be overstated; mitigate with filePath fallback as the normal path.`
- Add risk: `fqName dot splitting confuses lexical containment with package ownership; mitigate by deriving module from filePath.`
- Add risk: `Parallel work before Phase 001 can hide classifier contract drift; mitigate with typed test doubles only and later shared contract tests.`

**LOC delta estimate**

- Original estimate: ~310 LOC.
- Proposed delta: +80 to +150 LOC.
- Revised estimate: ~390 to ~460 LOC if `code_packages` remains deferred; higher if a real package table becomes P0.


## Phase 003 amendments

**Status**: NEEDS_AMENDMENT

**REQ-level edits**

- Change REQ-002 text to: `5 risk signals computed deterministically from existing graph data after file-level aggregation over all CodeNode rows for each affected file.`
- Change REQ-003 text to: `Risk score formula uses documented tunable weights and deterministic normalizers; default weights are labeled heuristic until Phase 005 calibration.`
- Add to P0: `REQ-009 | Deterministic normalization | Define normalizeFanIn, normalizeHubDegree, and normalizeTransitiveDepth with fixed caps or documented graph-baseline semantics; outputs MUST remain reproducible for unchanged graph state.`
- Add to P0: `REQ-010 | File-level aggregation | fanIn, fanOut, hubDegree, edgeConfidence, and coverage signals MUST aggregate symbol-level edges by file and dedupe connected files.`
- Add to P0: `REQ-011 | TESTED_BY direction | Coverage evidence for production files MUST use incoming TESTED_BY edges via queryEdgesTo across production symbols.`
- Add to P0: `REQ-012 | Coverage evidence class | Absence of TESTED_BY MUST be represented as coverageUnknownOrMissing or {hasTestEdge, coverageEvidence}; absence MUST NOT be described as proven untested.`
- Add to P0: `REQ-013 | BFS depth implementation | The 3-hop cap MUST be enforced in the new impact-analysis BFS loop with a visited set; do not rely on queryFileImportDependents() to apply a LIMIT.`
- Change REQ-007 text to: `Optional LLM enrichment is disabled unless explicit provider configuration is supplied; disabled output remains complete and deterministic.`
- Add to P1: `REQ-014 | Enrichment options contract | Replace boolean-only enrichWithLLM with {enabled, provider, model?, timeoutMs?, maxCallsPerSession?, maxInputBytes?, cacheKey?}.`
- Add to P1: `REQ-015 | Layer fallback | If Phase 001 layer data is unavailable, emit {source:"unavailable", value:null} or omit layer weighting; do not invent a second local layer classifier.`

**Plan-level edits**

- Replace direct `queryEdgesTo(filePath)` / `queryEdgesFrom(filePath)` language with: `Collect nodes for each file and aggregate symbol-level edge queries across those nodes.`
- Add step: `Implement deterministic normalizers before formula application.`
- Add step: `Implement TESTED_BY as incoming edge aggregation and include coverageEvidence in output.`
- Add step: `Implement BFS over file import-dependent pairs with explicit depth, visited set, and cycle tests.`
- Replace `LLM adapter calls cli-opencode` with: `Define LlmNarrativeProvider interface. Default provider is none/skipped; CLI provider is explicit opt-in and must use hardened subprocess helper semantics.`
- Add step: `If optional layer annotations are requested, call Phase 001 only when available and otherwise emit unavailable/null.`

**Tasks-level edits**

- Add task: `T-003A: Implement file-node aggregation helper and tests for multi-symbol files.`
- Add task: `T-003B: Implement deterministic normalizers and snapshot tests for stable scores.`
- Add task: `T-003C: Add TESTED_BY fixture with src/foo.ts, src/foo.test.ts, and unsupported __tests__/foo.test.ts or integration layout.`
- Add task: `T-003D: Add BFS depth/cycle fixture proving 3-hop cap.`
- Add task: `T-003E: Replace boolean LLM flag with enrichment options schema and skipped-provider output.`
- Add task: `T-003F: Add redaction/budget/timeout contract tests if CLI enrichment remains in scope.`
- Remove task: `Call cli-opencode by default when enrichWithLLM is true.`

**Risks-level edits**

- Add risk: `Scores may be reproducible in code but misleading in interpretation if heuristic weights are presented as validated; mitigate with output labels and Phase 005 calibration.`
- Add risk: `Coverage absence can overstate risk for unsupported test layouts; mitigate with coverageEvidence.`
- Add risk: `Optional LLM enrichment can silently introduce remote dependency; mitigate by default skipped provider and explicit budgets.`
- Add risk: `CLI enrichment inherits subprocess lifecycle failure modes; mitigate by reusing Phase 005 hardening contract.`

**LOC delta estimate**

- Original estimate: ~350 LOC.
- Proposed delta: +120 to +220 LOC.
- Revised estimate: ~470 to ~570 LOC if optional CLI enrichment remains; ~430 to ~480 LOC if enrichment ships as `none/skipped` only.


## Phase 005 amendments

**Status**: NEEDS_AMENDMENT

**REQ-level edits**

- Add to P0: `REQ-011 | Provider auth preflight | Before task dispatch, run provider availability/auth preflight once, cache the result, and fail fast or ask before the run if the selected provider is unavailable.`
- Add to P0: `REQ-012 | Subprocess lifecycle | Each OpenCode subprocess MUST use ignored stdin or equivalent dev-null stdin, enforce 600s timeout, send SIGTERM, wait a grace period, escalate to SIGKILL, and wait for close/exit before continuing.`
- Add to P0: `REQ-013 | Discriminated result schema | Every JSONL result row MUST include status: success | timeout | failed, attempt, maxAttempts, condition, taskId, metrics: null | object, error: null | {code,message}, stdoutPath, stderrPath, sessionId, and includeInPairedStats.`
- Add to P0: `REQ-014 | Mocked dispatcher stress test | Unit tests MUST run at least 12 tasks x 2 conditions using mocked subprocesses and cover success, non-timeout failure with retries, timeout, metrics-missing retry, DB/readiness error retry, and final failed records.`
- Add to P1: `REQ-015 | Stale process / lock guard | The run should detect stale OpenCode processes before dispatch and apply short-backoff retry for DB lock/readiness-shaped failures.`
- Change REQ-009 text to: `Report generator skips incomplete baseline/after pairs, counts skipped/incomplete rows separately, and only includes complete pairs in paired statistics.`

**Plan-level edits**

- Add pre-loop step: `Resolve provider config and run provider auth preflight once.`
- Replace direct spawn loop with: `Use a dispatcher helper that owns stdin, timeout, SIGTERM/SIGKILL, close-event wait, stdout/stderr path capture, and structured result row construction.`
- Add step: `Write condition-separated result paths or include condition/attempt in every row.`
- Add step: `Implement mocked dispatcher stress tests before manual full-harness runs.`
- Add step: `Bump phase level to Level 3 unless subprocess lifecycle/auth/result-schema hardening is split into a separate prerequisite packet.`

**Tasks-level edits**

- Add task: `T-005A: Implement provider preflight cache and auth-shaped error invalidation.`
- Add task: `T-005B: Implement hardened subprocess dispatcher helper.`
- Add task: `T-005C: Define and validate discriminated result row schema.`
- Add task: `T-005D: Update report generator to skip incomplete pairs and count them separately.`
- Add task: `T-005E: Add mocked 12 x 2 dispatcher stress test with mixed outcomes.`
- Add task: `T-005F: Add stale-process detection and DB/readiness retry branch.`
- Keep task: `1 x 2 smoke test`, but do not treat it as sufficient reliability coverage.

**Risks-level edits**

- Add risk: `A subprocess can survive timeout and keep shared OpenCode state locked; mitigate with process-tree cleanup and close-event wait.`
- Add risk: `Provider auth failures can consume the full run budget; mitigate with preflight and cached provider status.`
- Add risk: `Mixed failures can corrupt paired statistics if row schema is loose; mitigate with discriminated rows and incomplete-pair accounting.`
- Add risk: `Level 2 underestimates operational complexity if all subprocess hardening remains in scope; mitigate by bumping to Level 3 or splitting a hardening packet.`

**LOC delta estimate**

- Original estimate: ~500 LOC.
- Proposed delta: +180 to +300 LOC.
- Revised estimate: ~680 to ~800 LOC if hardening stays in Phase 005; ~500 to ~580 LOC if subprocess hardening is split out.

