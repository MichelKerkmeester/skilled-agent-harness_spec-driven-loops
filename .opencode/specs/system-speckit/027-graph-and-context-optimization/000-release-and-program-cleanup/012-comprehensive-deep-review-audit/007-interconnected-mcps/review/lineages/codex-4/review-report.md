# Deep Review Report

Session: fanout-codex-4-1780596001496-dj6z7c
Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps
Artifact dir: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/lineages/codex-4
Executor: cli-codex model=gpt-5.5

## 1. Executive Summary

Verdict: CONDITIONAL. I found no P0 release blockers, but five P1 issues remain across fan-out concurrency, lineage loop-bound propagation, sandbox/write-boundary enforcement, advisor MCP public schema drift, and review coverage-graph semantics. One P2 traceability issue remains in the target scope map.

## 2. Scope And Method

Reviewed the system-code-graph, system-skill-advisor, and deep-loop-runtime integration surfaces named by the packet. Code Graph MCP was unavailable in this lineage, so I used graphless fallback with rg searches and direct file reads. No reviewed code was modified.

## 3. Release Verdict

- P0: 0
- P1: 5
- P2: 1
- Final verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Release readiness state: in-progress until the P1s are fixed or explicitly accepted.

## 4. Findings

### F001 (P1) - fanout-run serializes CLI lineages despite a concurrency cap

Dimension: correctness
Status: open

Evidence:
- .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:121 documents at-most-concurrency in-flight execution, and :174-178 admits workers until active reaches the cap.
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307-311 calls runCappedPool, but :344-350 runs each lineage with spawnSync inside the async worker.
- .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:85-144 asserts directories and summary output for concurrency=2 but never proves overlapping subprocess execution.

Impact: Configured fan-out breadth does not actually happen for CLI executors; large audits run serially while reporting a higher concurrency contract.

Fix: Replace the worker subprocess call with async spawn plus a promise-settled result, or execute the sync spawn in a separate worker/thread so runCappedPool can admit K lineages. Add a slow-stub integration test that records overlapping start/end windows and max active count.

### F002 (P1) - per-lineage iterations is documented as a loop bound but only sizes the subprocess timeout

Dimension: correctness
Status: open

Evidence:
- .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:287-293 documents lineage iterations as a per-lineage max-iterations override, and :299 accepts the field.
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142-143 tells the child agent only to run to convergence; it never passes the configured iteration cap.
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154-157 uses lineage.iterations only in computeLineageTimeoutMs.

Impact: Operators cannot bound an individual lineage loop through the advertised fan-out config; the child process may continue to the packet default while the parent only changes timeout math.

Fix: Thread lineage.iterations into the child prompt/config as an explicit maxIterations override, and add a fanout-run test that stubs a child and verifies the prompt/config includes the requested bound.

### F003 (P1) - lineage artifact-only write scope is prompt text, not an enforced sandbox boundary

Dimension: security
Status: open

Evidence:
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142-143 tells the child to write only under lineageDir, but :344-345 launches it from process.cwd().
- .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83-84 defaults sandboxMode to workspace-write, and :129-130 passes that default through for Codex.
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:179-181 passes --sandbox resolvedSandbox to Codex, so the default is broad workspace-write unless lineage config overrides it.
- .opencode/skills/deep-loop-runtime/lib/deep-loop/permissions-gate.ts:428-435 allows calls when no active matrix is configured, and .opencode/skills/deep-loop-runtime/references/script_interface_contract.md:129-131 says the gate is not called directly by scripts.

Impact: A review lineage that should be read-only except for its artifact directory can mutate reviewed workspace files if the child agent ignores or misinterprets the prompt-level instruction.

Fix: Make fan-out review lineages default to read-only execution with an explicit artifact writable root, or require a permission matrix/artifact worktree before dispatch. Treat workspace-write as an explicit opt-in for review fanout.

### F004 (P1) - skill-advisor ListTools descriptors omit handler-supported public inputs

Dimension: traceability
Status: open

Evidence:
- .opencode/skills/system-skill-advisor/mcp_server/tools/advisor-contract-keys.ts:19-30 defines recommend keys as prompt/options and validate keys as confirmHeavyRun/skillSlug.
- .opencode/skills/system-skill-advisor/mcp_server/tools/advisor-recommend.ts:12-33 advertises only prompt/options with additionalProperties=false.
- .opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:135-146 accepts workspaceRoot plus confidenceThreshold and uncertaintyThreshold options, and :160-166 returns workspaceRoot/effectiveThresholds.
- .opencode/skills/system-skill-advisor/mcp_server/tools/advisor-validate.ts:11-24 advertises only confirmHeavyRun/skillSlug, while advisor-tool-schemas.ts:240-252 also accepts workspaceRoot and outcomeEvents.
- .opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook_validation.md:55-71 explicitly validates advisor_recommend workspaceRoot and effective thresholds.

Impact: MCP clients generated from ListTools see a stricter, stale schema and may reject workspaceRoot/threshold inputs that system-spec-kit hooks rely on for scoped routing.

Fix: Generate tool descriptors from the Zod schemas or extend ADVISOR_*_PARAMETER_KEYS/descriptors to include workspaceRoot, threshold overrides, and outcomeEvents. Add a parity test that compares ListTools schemas to handler schemas and hook-validation expectations.

### F005 (P1) - review graphEvents examples and ingestion keep IN_DIMENSION edges that graph convergence does not count

Dimension: traceability
Status: open

Evidence:
- .opencode/skills/deep-review/references/state/state_jsonl.md:126-133 shows a canonical review graphEvents example with IN_DIMENSION, IN_FILE, and EVIDENCE_FOR edges, but no DIMENSION -> FILE COVERS edge.
- .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1084-1089 preserves IN_DIMENSION and IN_FILE edges during upsert and does not synthesize COVERS edges.
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:149-155 computes covered dimensions only from COVERS edges whose source is a DIMENSION node, and :177 derives dimensionCoverage from that set.
- .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:483-491 uses the same outgoing COVERS requirement for review dimension coverage.
- .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:134-140 and :153-158 mark review DIMENSION/FILE nodes as gaps unless they have outgoing COVERS or EVIDENCE_FOR edges.

Impact: A review agent following the documented graphEvents shape can produce a populated graph that still looks uncovered to convergence, blocking STOP or creating misleading graphless fallback pressure.

Fix: Either change the review graphEvents contract to require DIMENSION -> FILE COVERS edges, synthesize those edges from IN_DIMENSION plus IN_FILE during upsert, or teach convergence to count the documented IN_DIMENSION/IN_FILE relationship. Add an integration test that feeds the documented state_jsonl example into upsert and asserts nonzero review dimension coverage.

### F006 (P2) - the audit scope names a deep-loop-runtime reduce-state.cjs that does not exist

Dimension: traceability
Status: open

Evidence:
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md:55-58 scopes .opencode/skills/deep-loop-runtime/scripts/convergence.cjs and reduce-state.cjs.
- Direct path check for .opencode/skills/deep-loop-runtime/scripts/reduce-state.cjs failed; rg --files finds reduce-state.cjs under deep-review, deep-research, and deep-improvement instead.

Impact: Review orchestration can spend coverage budget on a nonexistent file while missing the actual reducer surfaces that own review/research state reduction.

Fix: Update the target scope/resource map to name the concrete reducer scripts per loop type, or add a runtime-owned reducer wrapper if deep-loop-runtime is intended to own that entrypoint.

## 5. Dimension Coverage

- correctness: covered in iterations 1, 6, and 7.
- security: covered in iterations 2, 6, and 7.
- traceability: covered in iterations 3, 4, 6, and 7.
- maintainability: covered in iterations 5, 6, and 7.

## 6. Traceability Checks

- Fanout artifact_dir was bound directly to the override value; resolveArtifactRoot was not run.
- All generated lineage outputs were written under this lineage artifact directory.
- The target packet has no upstream resource-map.md, so no Resource Map Coverage Gate section is emitted.
- Direct-read evidence was cross-checked against adjacent tests where available.

## 7. Gate Results

- dimensionCoverageGate: pass.
- p0ResolutionGate: pass.
- evidenceDensityGate: pass.
- hotspotSaturationGate: pass.
- candidateCoverageGate: pass under graphless fallback.
- graphlessFallbackGate: pass; Code Graph MCP unavailable, compensated with rg/direct reads.
- convergenceGate: not PASS-clean because active P1 findings remain.
- claimAdjudicationGate: not PASS-clean because active P1 findings remain.

## 8. Evidence Ledger

- `deep-review-state.jsonl` contains the config record, seven iteration records, and synthesis_complete.
- `iterations/iteration-001.md` through `iterations/iteration-007.md` contain per-iteration review summaries and verdict lines.
- `deltas/iter-001.jsonl` through `deltas/iter-007.jsonl` contain per-iteration JSONL deltas.
- `deep-review-findings-registry.json` records all active findings and final counts.

## 9. Residual Risk And Next Steps

Fix the P1s before treating this integration surface as release-clean. The most urgent pair is F001/F003: fanout currently under-delivers concurrency while over-granting write access for read-only review lineages.
