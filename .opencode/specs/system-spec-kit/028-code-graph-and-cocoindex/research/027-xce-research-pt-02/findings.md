> Extracted from `027/research/027-xce-research-pt-02/findings.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

# 027 pt-02 Implementation-Risk Matrix

## Matrix

| Phase | IRQ1 | IRQ2 | IRQ3 | IRQ4 | IRQ5 | IRQ6 | IRQ7 | IRQ8 | IRQ9 | IRQ10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 001-code-graph-hld-lld | BLOCKING | N/A | N/A | N/A | N/A | BLOCKING | N/A | N/A | N/A | CONFIRMED |
| 002-code-graph-trace | N/A | BLOCKING | N/A | N/A | N/A | BLOCKING | N/A | BLOCKING | N/A | CONFIRMED |
| 003-code-graph-impact-analysis | N/A | N/A | BLOCKING | N/A | N/A | BLOCKING | BLOCKING | N/A | BLOCKING | CONFIRMED |
| 005-code-graph-adoption-eval | N/A | N/A | CONFIRMED | N/A | BLOCKING | N/A | N/A | N/A | CONFIRMED | CONFIRMED |

## BLOCKING Findings

### B-iter001-001

- Phase affected: 001-code-graph-hld-lld
- Description: HLD/LLD truncation has a deterministic-output requirement but no stable sort before the 50-symbol cap. Different row orders could produce different primary symbol lists.
- Spec.md REQ impacted: Phase 001 REQ-001 (`../../001-code-graph-hld-lld/spec.md:150`) and stress case (`../../001-code-graph-hld-lld/spec.md:225`).
- Recommended remediation: Add a stable sort rule before slicing, for example `kind priority -> start_line -> name -> symbol_id`.


### B-iter001-003

- Phase affected: 001-code-graph-hld-lld
- Description: `code_edges` has no foreign-key guarantee to `code_nodes`, so generated dependencies need a deterministic dangling-target policy. The current phase text does not choose filter vs structured unresolved output.
- Spec.md REQ impacted: Phase 001 REQ-002 direct dependency output (`../../001-code-graph-hld-lld/spec.md:151`).
- Recommended remediation: Decide one policy for missing edge endpoints and test it with a dangling-edge fixture.


### B-iter001-005

- Phase affected: 001-code-graph-hld-lld
- Description: Multiple module symbols can exist for one file because synthetic modules and captured module-like symbols are both possible. Phase 001 does not define primary-module selection.
- Spec.md REQ impacted: Phase 001 REQ-007 role classification (`../../001-code-graph-hld-lld/spec.md:161`).
- Recommended remediation: Prefer the synthetic file module by `fq_name === getModuleName(filePath)`, then lowest `start_line`, then `symbol_id`.


### B-iter002-001

- Phase affected: 002-code-graph-trace
- Description: Current `CONTAINS` edges are class-to-method only, not symbol-to-file/module chains. Phase 002's core trace walk would not reach the promised file/module rungs.
- Spec.md REQ impacted: Phase 002 REQ-001 and REQ-004 (`../../002-code-graph-trace/spec.md:107-110`).
- Recommended remediation: Resolve `file` from `CodeNode.filePath`, derive `module` through an explicit file-path policy, and use `CONTAINS` only for class/method display where available.


### B-iter002-002

- Phase affected: 002-code-graph-trace
- Description: `CONTAINS` is not emitted for every supported language; Bash/doc files and top-level functions cannot rely on that edge. The phase currently overstates cross-language coverage.
- Spec.md REQ impacted: Phase 002 REQ-001 (`../../002-code-graph-trace/spec.md:107`).
- Recommended remediation: Scope containment claims to class-method captures and add filePath fallback tests for top-level, Bash, and doc symbols.


### B-iter002-004

- Phase affected: 002-code-graph-trace
- Description: Nested class parent lookup compares against short names and can choose the wrong containing class. This affects upward trace correctness.
- Spec.md REQ impacted: Phase 002 REQ-001 (`../../002-code-graph-trace/spec.md:107`).
- Recommended remediation: Compare `method.fqName` against `class.fqName + "."` and add nested-class regression fixtures.


### B-iter002-008

- Phase affected: 002-code-graph-trace
- Description: `fq_name` prefix splitting cannot recover module hierarchy because current `fqName` values are lexical, not package-qualified. The proposed fallback would persist ambiguous module labels.
- Spec.md REQ impacted: Phase 002 REQ-007 (`../../002-code-graph-trace/spec.md:116-117`).
- Recommended remediation: Make filePath-derived module ownership P0 and keep `code_packages` P1 unless redesigned around file paths/import metadata.


### B-iter003-001

- Phase affected: 003-code-graph-impact-analysis and 005-code-graph-adoption-eval
- Description: The default weights are design intuition, not empirically validated. Phase 003 can ship them only as labeled heuristic defaults.
- Spec.md REQ impacted: Phase 003 REQ-003/REQ-008 (`../../003-code-graph-impact-analysis/spec.md:120-129`) and Phase 005 validation scope (`../../005-code-graph-adoption-eval/spec.md:147-150`).
- Recommended remediation: Label defaults as heuristic, keep weights overrideable, and let Phase 005 calibrate them on labeled tasks.


### B-iter003-002

- Phase affected: 003-code-graph-impact-analysis
- Description: `normalize()` is undefined, making score values non-reproducible across graph sizes. The success criterion requires scores in `[0..1]`.
- Spec.md REQ impacted: Phase 003 REQ-001/REQ-003 (`../../003-code-graph-impact-analysis/spec.md:118-120`).
- Recommended remediation: Add a deterministic normalizer, preferably log-cap or documented fixed caps per signal.


### B-iter003-003

- Phase affected: 003-code-graph-impact-analysis
- Description: Phase 003 describes file-level risk through symbol-level edge APIs. The implementation must aggregate nodes per file before scoring.
- Spec.md REQ impacted: Phase 003 REQ-002 (`../../003-code-graph-impact-analysis/spec.md:119`).
- Recommended remediation: Define node collection, incoming/outgoing edge aggregation, connected-file dedupe, and coverage aggregation over all symbols in a file.


### B-iter003-005

- Phase affected: 003-code-graph-impact-analysis
- Description: The 3-hop cap is required, but the helper named in the spec does not apply depth limiting. The BFS must live in the new impact-analysis module.
- Spec.md REQ impacted: Phase 003 REQ-005 (`../../003-code-graph-impact-analysis/spec.md:122`).
- Recommended remediation: Implement a visited-set BFS over file-dependent pairs and document why 3 hops is the MVP cap.


### B-iter005-001

- Phase affected: 005-code-graph-adoption-eval
- Description: `</dev/null` fixes startup deadlock but not full process cleanup. The harness needs timeout, SIGTERM/SIGKILL, and close-event semantics.
- Spec.md REQ impacted: Phase 005 REQ-008 and timeout edge cases (`../../005-code-graph-adoption-eval/spec.md:127`, `../../005-code-graph-adoption-eval/spec.md:186`).
- Recommended remediation: Require `spawn()` with ignored stdin, 600s timeout, grace-period kill escalation, and structured timeout metadata.


### B-iter005-002

- Phase affected: 005-code-graph-adoption-eval
- Description: Provider auth preflight is missing before 24-40 subprocess dispatches. Without it, the run can waste the whole budget on preventable auth failures.
- Spec.md REQ impacted: Phase 005 REQ-001/REQ-010 (`../../005-code-graph-adoption-eval/spec.md:117-140`).
- Recommended remediation: Run provider discovery once before the loop, cache it, and invalidate only on auth-shaped failures.


### B-iter005-003

- Phase affected: 005-code-graph-adoption-eval
- Description: Success, timeout, and failure rows lack a discriminated schema. Paired statistics need a reliable way to skip incomplete pairs.
- Spec.md REQ impacted: Phase 005 REQ-003/REQ-009/REQ-010 (`../../005-code-graph-adoption-eval/spec.md:122-133`).
- Recommended remediation: Define `status`, attempt fields, nullable metrics, structured error, stdout/stderr paths, sessionId, and `includeInPairedStats`.


### B-iter005-005

- Phase affected: 005-code-graph-adoption-eval
- Description: The current smoke test cannot surface reliability risks from 24-40 subprocesses. Full real harness runs remain too expensive for unit confidence.
- Spec.md REQ impacted: Phase 005 SC-001/SC-004 (`../../005-code-graph-adoption-eval/spec.md:147-150`).
- Recommended remediation: Add a mocked dispatcher stress test with at least 12 tasks x 2 conditions and mixed success/failure/timeout paths.


### B-iter006-001

- Phase affected: 001-code-graph-hld-lld and 002-code-graph-trace
- Description: `file_role` is an open string in Phase 001 but consumed as a cross-phase contract by Phase 002. A closed enum would already exclude `empty`.
- Spec.md REQ impacted: Phase 001 REQ-007 and Phase 002 REQ-004 (`../../001-code-graph-hld-lld/spec.md:161`, `../../002-code-graph-trace/spec.md:110`).
- Recommended remediation: Document an open string domain with required baseline labels and reserved edge labels.


### B-iter006-002

- Phase affected: 001-code-graph-hld-lld and 002-code-graph-trace
- Description: `classifyFileRole()` is referenced by Phase 002 but not pinned as an exported Phase 001 signature. Parallel implementations can drift.
- Spec.md REQ impacted: Phase 001 REQ-007 and Phase 002 REQ-004 (`../../001-code-graph-hld-lld/spec.md:161`, `../../002-code-graph-trace/spec.md:110`).
- Recommended remediation: Pin `classifyFileRole(filePath: string, db: CodeGraphDbLike): string` or an explicit structured equivalent.


### B-iter006-003

- Phase affected: 001-code-graph-hld-lld
- Description: Phase 001's planned `queryMode:'omni'` and `hld_lld` context payload are absent from current context types and handler serialization. The MCP wire contract would drop the new payload.
- Spec.md REQ impacted: Phase 001 REQ-003 (`../../001-code-graph-hld-lld/spec.md:153`).
- Recommended remediation: Update `QueryMode`, `ContextResult`, handler parsing, serialization, and a handler-level JSON integration test together.


### B-iter006-005

- Phase affected: 003-code-graph-impact-analysis
- Description: Optional Phase 001 `layer` consumption lacks a fallback when Phase 003 ships independently. A second local layer classifier would create source-of-truth drift.
- Spec.md REQ impacted: Phase 003 optional dependency (`../../003-code-graph-impact-analysis/spec.md:73`).
- Recommended remediation: Emit `{source:"unavailable", value:null}` or omit layer weighting until Phase 001 is available.


### B-iter007-003

- Phase affected: 003-code-graph-impact-analysis
- Description: Phase 003's `TESTED_BY` query direction is wrong for production symbols. Valid test edges would be missed.
- Spec.md REQ impacted: Phase 003 REQ-002 (`../../003-code-graph-impact-analysis/spec.md:119`).
- Recommended remediation: Aggregate incoming `queryEdgesTo(symbolId, 'TESTED_BY')` over production symbols.


### B-iter007-004

- Phase affected: 003-code-graph-impact-analysis
- Description: Missing `TESTED_BY` currently means unknown-or-missing, not proven untested. The output needs to expose the evidence class.
- Spec.md REQ impacted: Phase 003 risk formula (`../../003-code-graph-impact-analysis/spec.md:50-53`).
- Recommended remediation: Rename the signal to `coverageUnknownOrMissing` or emit `{hasTestEdge, coverageEvidence}`.


### B-iter008-001

- Phase affected: 002-code-graph-trace
- Description: `fq_name` is lexical/symbol-qualified, not package-qualified. It cannot be a P0 source for module hierarchy.
- Spec.md REQ impacted: Phase 002 REQ-007 (`../../002-code-graph-trace/spec.md:116-117`).
- Recommended remediation: Use `CodeNode.filePath` for ownership and reserve `fqName` for class/method display.


### B-iter009-001

- Phase affected: 003-code-graph-impact-analysis
- Description: `cli-opencode` must not be the implicit default for `enrichWithLLM`. That would add a hosted dependency to a local-first deterministic tool.
- Spec.md REQ impacted: Phase 003 REQ-007 (`../../003-code-graph-impact-analysis/spec.md:128`).
- Recommended remediation: Return `llmEnrichment: {status:"skipped", reason:"provider_not_configured"}` unless explicit provider config exists.


### B-iter009-005

- Phase affected: 003-code-graph-impact-analysis
- Description: Boolean-only enrichment lacks provider, auth, timeout, call budget, input budget, and cache semantics. This is a public handler contract gap.
- Spec.md REQ impacted: Phase 003 REQ-007/REQ-008 (`../../003-code-graph-impact-analysis/spec.md:128-129`).
- Recommended remediation: Replace the boolean with an explicit enrichment options object and default to zero/one configured calls.


### B-iter009-007

- Phase affected: 003-code-graph-impact-analysis
- Description: If CLI enrichment remains possible, it inherits the same subprocess reliability requirements as Phase 005. The current adapter line is too small for that surface.
- Spec.md REQ impacted: Phase 003 optional LLM adapter scope (`../../003-code-graph-impact-analysis/spec.md:93-101`).
- Recommended remediation: Use a hardened helper with closed stdin, provider preflight, timeout, cleanup, structured skipped/failed results, and prompt redaction.



## CONFIRMED Findings Subset

### C-iter001-004

- Phase affected: 001-code-graph-hld-lld
- Description: Missing docstrings have an explicit empty-string fallback matching nullable schema storage.
- Spec.md REQ impacted: Phase 001 REQ-002 (`../../001-code-graph-hld-lld/spec.md:151`).
- Recommended remediation: Keep the fallback and add both NULL and empty-string docstring fixtures.


### C-iter003-004

- Phase affected: 003-code-graph-impact-analysis
- Description: Additive scoring is the right MVP because it preserves independent evidence from untested status even when fan-in is zero.
- Spec.md REQ impacted: Phase 003 formula (`../../003-code-graph-impact-analysis/spec.md:50-53`).
- Recommended remediation: Keep additive composition and pair it with a deterministic normalizer.


### C-iter005-004

- Phase affected: 005-code-graph-adoption-eval
- Description: Sequential per-task JSONL avoids append races under the current plan.
- Spec.md REQ impacted: Phase 005 result persistence (`../../005-code-graph-adoption-eval/spec.md:125`).
- Recommended remediation: Preserve sequential writes and include condition/attempt in rows or paths.


### C-iter006-004

- Phase affected: 001-code-graph-hld-lld and 002-code-graph-trace
- Description: `architectural_role` should be an alias of HLD `file_role` for the resolved file, not a second classifier.
- Spec.md REQ impacted: Phase 002 REQ-004 (`../../002-code-graph-trace/spec.md:110`).
- Recommended remediation: Keep both field names but document exact value equality.


### C-iter007-002

- Phase affected: 003-code-graph-impact-analysis
- Description: `TESTED_BY` is emitted, but only through sibling filename matching.
- Spec.md REQ impacted: Phase 003 REQ-002 (`../../003-code-graph-impact-analysis/spec.md:119`).
- Recommended remediation: Document supported patterns and carry unknown evidence for unsupported layouts.


### C-iter010-007

- Phase affected: all phases
- Description: The optimal order remains `004 -> 001 -> {002,003} -> 005`.
- Spec.md REQ impacted: parent phasing table (`../../spec.md:47-55`).
- Recommended remediation: Keep the order but apply the pt-02 amendments before implementation.



## NO-CHANGE-NEEDED Findings Subset

### N-iter001-006

- Phase affected: 001-code-graph-hld-lld
- Description: Mixed embedded language content should not expand Phase 001 scope because parser/indexer changes are explicitly out of scope.
- Spec.md REQ impacted: Phase 001 out-of-scope guard (`../../001-code-graph-hld-lld/spec.md:112-114`).
- Recommended remediation: Narrate the indexed graph as-is and defer embedded-language parsing to a separate parser packet.


### N-iter002-007

- Phase affected: 002-code-graph-trace
- Description: TypeScript namespace, Go interface, and Rust impl cases are outside the current runtime parser scope.
- Spec.md REQ impacted: Phase 002 language scope (`../../002-code-graph-trace/spec.md:157-162`).
- Recommended remediation: Track them only as future parser-expansion risks.


### N-iter003-007

- Phase affected: 003-code-graph-impact-analysis
- Description: Phase 001 layer criticality should stay optional and should not be hidden in the deterministic base formula.
- Spec.md REQ impacted: Phase 003 optional dependency (`../../003-code-graph-impact-analysis/spec.md:73-74`).
- Recommended remediation: Expose layer as optional annotation or later multiplier after Phase 001 exists.


### N-iter005-006

- Phase affected: 005-code-graph-adoption-eval
- Description: macOS watcher leakage is not a separate Phase 005 feature; it is covered by process cleanup.
- Spec.md REQ impacted: Phase 005 scope (`../../005-code-graph-adoption-eval/spec.md:84-103`).
- Recommended remediation: Do not modify watcher internals; enforce subprocess cleanup and close-event waiting.


### N-iter007-005

- Phase affected: 003-code-graph-impact-analysis
- Description: Phase 003 should not expand the structural indexer to discover test ownership.
- Spec.md REQ impacted: Phase 003 no-new-tables/no-indexer scope (`../../003-code-graph-impact-analysis/spec.md:56-59`).
- Recommended remediation: Use incoming graph edges plus bounded sibling heuristic; leave import-walk ownership to a later graph-population packet.


### N-iter008-006

- Phase affected: 002-code-graph-trace
- Description: Performance alone does not justify a P0 schema migration for package tables at the current observed scale.
- Spec.md REQ impacted: Phase 002 NFR (`../../002-code-graph-trace/spec.md:147-152`).
- Recommended remediation: Benchmark before adding package-table joins for speed; use correctness as the P0 trigger.


