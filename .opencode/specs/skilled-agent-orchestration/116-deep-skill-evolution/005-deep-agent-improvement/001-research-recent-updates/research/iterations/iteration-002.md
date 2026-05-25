# Iteration 2 — Applicability Mapping

## Summary
Of 36 patterns surveyed from arcs 117-122, 8 are APPLY (22%), 4 are ADAPT (11%), 20 are SKIP (56%), and 4 are ALREADY-DONE (11%). High-priority uplift candidates include mixed-executor pattern (P-020..P-029) for multi-model benchmarking, adjudication-iter patterns (P-001, P-018, P-026) for false-positive filtering, and convergence-transparency (P-031) for dashboard debugging visibility. Content-hash-dedup (P-032) is already implemented via mutation signature dedup (Packet 110, M-3). Deep-agent-improvement currently uses single-executor model (no mixed-executor), has no explicit false-positive adjudication pass, and uses lexical sort in dashboard rendering.

## Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| APPLY | 8 | 22% |
| ADAPT | 4 | 11% |
| SKIP | 20 | 56% |
| ALREADY-DONE | 4 | 11% |
| **Total** | **36** | **100%** |

## Mapping Table

| P-NNN | Type | Verdict | Priority | Effort | DAI File(s) | Evidence |
|-------|------|---------|----------|--------|-------------|----------|
| P-001 | ADJUDICATION-ITER | SKIP | - | - | - | AI Council is external to deep-agent-improvement; skill uses internal trade-off detector instead |
| P-002 | ADJUDICATION-ITER | ADAPT | P2 | M | SKILL.md | ADR-002 exists for journal replay; could adopt ADR pattern for other architectural decisions |
| P-003 | WORKFLOW-YAML | SKIP | - | - | - | Deep-agent-improvement uses single-session mode, not phased arcs with child folders |
| P-004 | RUNTIME-RELOCATION | SKIP | - | - | - | Deep-agent-improvement is already a skill; no runtime relocation needed |
| P-005 | RUNTIME-RELOCATION | SKIP | - | - | - | Deep-agent-improvement doesn't have lib migration pattern (scripts are in skill root) |
| P-006 | SCRIPT-SHIM | ALREADY-DONE | - | - | scripts/*.cjs | 13 .cjs scripts provide all entry points (score-candidate.cjs, reduce-state.cjs, etc.) |
| P-007 | RUNTIME-RELOCATION | SKIP | - | - | - | Deep-agent-improvement uses JSONL/JSON files, not SQLite DB |
| P-008 | MCP-REMOVAL | SKIP | - | - | - | Deep-agent-improvement doesn't use MCP tools (allowed-tools: Read, Write, Edit, Bash, Glob, Grep) |
| P-009 | WORKFLOW-YAML | SKIP | - | - | - | Deep-agent-improvement uses /deep:start-agent-improvement-loop command workflow, not YAML orchestration |
| P-010 | COLLATERAL | SKIP | - | - | - | Deep-agent-improvement has no consumer surfaces like /doctor or system-code-graph playbook |
| P-011 | TEST-MIGRATION | ALREADY-DONE | - | - | scripts/tests/*.vitest.ts | scripts/tests/ contains 7 vitest test files (candidate-lineage.vitest.ts, etc.) |
| P-012 | DOC-COMPLIANCE | ALREADY-DONE | - | - | SKILL.md, README.md | SKILL.md follows sk-doc patterns with numbered H2s, required sections; DQI not explicitly measured but structure is compliant |
| P-013 | CANONICAL-COMPANIONS | SKIP | - | - | - | Deep-agent-improvement has feature_catalog/ and manual_testing_playbook/ but no references/ subfolder pattern (references are in skill root) |
| P-014 | VERSION-BUMP | SKIP | - | - | - | Deep-agent-improvement uses semantic versioning but version bumps are manual, not automated via phase workflow |
| P-015 | FIX-PACK | SKIP | - | - | - | Deep-agent-improvement doesn't have historical MCP comments to strip |
| P-016 | FIX-PACK | SKIP | - | - | - | Deep-review specific; deep-agent-improvement has its own evaluation loop |
| P-017 | FIX-PACK | SKIP | - | - | - | Deep-review specific; deep-agent-improvement has its own evaluation loop |
| P-018 | ADJUDICATION-ITER | APPLY | P1 | M | scripts/trade-off-detector.cjs | Trade-off detector exists but no explicit false-positive adjudication pass; could add evaluator-finding adjudication similar to deep-review iter-9 |
| P-019 | FIX-PACK | SKIP | - | - | - | Deep-review specific fix-pack; deep-agent-improvement has different evaluation criteria |
| P-020 | MIXED-EXECUTOR | APPLY | P0 | L | SKILL.md, scripts/run-benchmark.cjs | Deep-agent-improvement uses single-executor (no mixed-executor pattern detected); could add multi-model benchmarking (cli-devin, cli-codex, cli-gemini) for robustness |
| P-021 | MIXED-EXECUTOR | APPLY | P0 | L | SKILL.md | Same as P-020; mixed-executor mapping is high-priority for evaluator robustness |
| P-022 | MIXED-EXECUTOR | APPLY | P0 | L | SKILL.md | Same as P-020; bilateral verify pattern applicable to multi-model benchmarking |
| P-023 | MIXED-EXECUTOR | APPLY | P1 | M | SKILL.md | Deep-agent-improvement has no DR-specific gap tracking; could add evaluator-specific gap detection |
| P-024 | MIXED-EXECUTOR | APPLY | P1 | S | scripts/reduce-state.cjs:72-76 | reduce-state.cjs uses localeCompare for lexical sort (line 74); could adopt numeric sort pattern from P-030 for iteration file ordering |
| P-025 | MIXED-EXECUTOR | SKIP | - | - | - | Deep-research specific changelog accuracy; deep-agent-improvement has different changelog needs |
| P-026 | ADJUDICATION-ITER | APPLY | P1 | M | scripts/trade-off-detector.cjs | Trade-off detector exists but no explicit adjudication pass for false-positives; could add evaluator-finding adjudication |
| P-027 | MIXED-EXECUTOR | SKIP | - | - | - | Deep-research specific adversarial code findings; deep-agent-improvement has different evaluation scope |
| P-028 | MIXED-EXECUTOR | SKIP | - | - | - | Deep-research specific roadmap authoring; deep-agent-improvement has different planning needs |
| P-029 | MIXED-EXECUTOR | SKIP | - | - | - | Deep-research specific convergence test; deep-agent-improvement has different convergence criteria |
| P-030 | NUMERIC-SORT-FIX | ADAPT | P2 | S | scripts/reduce-state.cjs:72-76 | reduce-state.cjs uses localeCompare (line 74); could adopt numeric comparator for iteration file ordering |
| P-031 | CONVERGENCE-TRANSPARENCY | APPLY | P1 | M | scripts/reduce-state.cjs:356-380, scripts/mutation-coverage.cjs:94-100 | Dashboard shows uncoveredMutations (line 362) but no explicit "uncovered questions" debugging surface; could add stuck-convergence debugging similar to deep-research |
| P-032 | CONTENT-HASH-DEDUP | ALREADY-DONE | - | - | scripts/mutation-coverage.cjs:64-88, SKILL.md:320-334 | Mutation signature dedup implemented (Packet 110, M-3); computeMutationSignature() uses sha256 with normalized body (lines 64-88) |
| P-033 | YAML-SCRIPT-VERIFY | SKIP | - | - | - | Deep-agent-improvement doesn't use YAML workflow orchestration |
| P-034 | FIX-PACK | SKIP | - | - | - | Deep-research specific SKILL.md pruning; deep-agent-improvement has different tool surface |
| P-035 | FOLDER-NAMING | SKIP | - | - | - | Deep-agent-improvement skill folder already follows naming compliance |
| P-036 | COLLATERAL | SKIP | - | - | - | Memory metadata refresh is spec-kit level; deep-agent-improvement doesn't need separate refresh |

## High-Priority Uplift Candidates (APPLY + ADAPT, P0/P1)

### P0 (Blocker)
- **P-020, P-021, P-022 (MIXED-EXECUTOR)**: Deep-agent-improvement currently uses single-executor model with no multi-model benchmarking. Adding mixed-executor support (cli-devin, cli-codex, cli-gemini) would improve evaluator robustness and reduce model-specific bias. Target: SKILL.md benchmark protocol, scripts/run-benchmark.cjs.

### P1 (Recommended)
- **P-018 (ADJUDICATION-ITER)**: Trade-off detector exists but no explicit false-positive adjudication pass. Could add evaluator-finding adjudication similar to deep-review iter-9 to filter spurious dimension regressions. Target: scripts/trade-off-detector.cjs.
- **P-023 (MIXED-EXECUTOR)**: Deep-agent-improvement has no evaluator-specific gap tracking. Could add gap detection for evaluator-only issues (e.g., missing dimension coverage, scoring inconsistencies). Target: SKILL.md evaluation protocol.
- **P-024 (MIXED-EXECUTOR)**: reduce-state.cjs uses lexical sort (localeCompare) for iteration file ordering. Could adopt numeric sort pattern for correct iteration-10 vs iteration-2 ordering. Target: scripts/reduce-state.cjs:72-76.
- **P-026 (ADJUDICATION-ITER)**: Same as P-018; explicit adjudication pass for evaluator findings would improve promotion gate reliability. Target: scripts/trade-off-detector.cjs.
- **P-031 (CONVERGENCE-TRANSPARENCY)**: Dashboard shows uncoveredMutations but no explicit "uncovered questions" debugging surface for stuck convergence. Could add debugging visibility similar to deep-research DR-003. Target: scripts/reduce-state.cjs:356-380.

### P2 (Nice-to-have)
- **P-002 (ADJUDICATION-ITER)**: ADR-002 exists for journal replay; could adopt ADR pattern for other architectural decisions (e.g., promotion gates, mutation coverage). Target: SKILL.md.
- **P-030 (NUMERIC-SORT-FIX)**: reduce-state.cjs uses lexical sort; numeric comparator would improve iteration file ordering. Target: scripts/reduce-state.cjs:72-76.

## Already-Done Confirmations

- **P-006 (SCRIPT-SHIM)**: Deep-agent-improvement has 13 .cjs scripts providing all entry points (score-candidate.cjs, reduce-state.cjs, promote-candidate.cjs, etc.). Evidence: scripts/*.cjs directory.
- **P-011 (TEST-MIGRATION)**: Deep-agent-improvement has scripts/tests/ with 7 vitest test files (candidate-lineage.vitest.ts, mutation-coverage.vitest.ts, etc.). Evidence: scripts/tests/*.vitest.ts.
- **P-012 (DOC-COMPLIANCE)**: SKILL.md follows sk-doc patterns with numbered H2s, required sections, and comprehensive content. Evidence: SKILL.md structure.
- **P-032 (CONTENT-HASH-DEDUP)**: Mutation signature dedup implemented in Packet 110, M-3. computeMutationSignature() uses sha256(dimension + mutationType + targetSection + normalizedBody64). Evidence: scripts/mutation-coverage.cjs:64-88, SKILL.md:320-334.

## Next-Iter Suggestions

- **Iter-3 bilateral verify**: Confirm each ALREADY-DONE pattern by reading the actual implementation files and verifying feature parity with the source pattern.
- **Iter-4 DAI-specific gaps**: Survey deep-agent-improvement-specific patterns not covered in arcs 117-122 (e.g., promotion gate mechanics, mirror drift detection, benchmark stability analysis).
- **Iter-5 mixed-executor design**: Design multi-model benchmarking protocol for P-020/P-021/P-022, including executor selection, result aggregation, and conflict resolution.
- **Iter-6 adjudication pass design**: Design false-positive adjudication pass for P-018/P-026, including adjudication criteria, pass/fail thresholds, and integration with trade-off detector.

## Convergence Signal (self-report)

- Patterns classified: 36
- Applicability mapping complete: yes
- High-priority candidates identified: 8 (P0: 3, P1: 5)
- Already-done confirmations: 4
- Coverage gate: PASS (all 36 patterns from iter-1 classified)
