---
title: Deep Review Strategy — arc 008-rerank-sidecar-arc
description: Session-tracking strategy for the 20-iter deep review of arc 008 (cli-codex gpt-5.5 xhigh fast).
---

# Deep Review Strategy — arc 008-rerank-sidecar-arc

## 1. OVERVIEW

20-iteration deep-review session targeting the entire 008-rerank-sidecar-arc packet. Reviews all 5 phases (001-005) + their shipped artifacts: source code changes in spec-memory's reranker pipeline, the new `system-rerank-sidecar` skill, launcher integration code, 4 runtime configs, and the A/B benchmark report that produced the HOLD verdict.

Executor: cli-codex gpt-5.5 xhigh fast (workspace-write sandbox).

## 2. TOPIC

Full arc 008 audit across all 4 dimensions. Targets:

- Arc parent control files (`spec.md`, `graph-metadata.json`, `description.json`)
- 5 phase children with their full spec doc sets (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` per phase)
- Source code: `stage3-rerank.ts` (precedence swap), `search-flags.ts` (helper hardening), `local-reranker.ts` (header comment), `cross-encoder.ts` (DID NOT change — verify HOLD invariant), `mk-spec-memory-launcher.cjs` (ensure call wiring), `mk-skill-advisor-launcher.cjs` (env allowlist), `mk-coco-index/cocoindex_code/cli.py` (cocoindex ensure call), `bin/lib/ensure-rerank-sidecar.cjs` (new), `bin/lib/ensure-rerank-sidecar.vitest.ts` (new tests)
- New skill: `system-rerank-sidecar/` (SKILL.md, README.md, pyproject.toml, .env.example, graph-metadata.json, scripts/{install.sh, start.sh, rerank_sidecar.py, ensure_rerank_sidecar.py}, tests/test_rerank_sidecar.py)
- Tests: `stage3-rerank-regression.vitest.ts` (added 2 cases)
- Runtime configs: `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml` (RERANK_SIDECAR_PORT additions)
- Docs: `ENV_REFERENCE.md` (SPECKIT_CROSS_ENCODER row), `embedder_architecture.md` (Stage 3 section), `system-rerank-sidecar/SKILL.md` (Consumers + Known Limitations sections)
- Benchmark artifacts: `benchmarks/benchmark-2026-05-20-rerank-ab/` (12 files including sk-doc-compliant report with HOLD verdict)
- Continuity: `008-rerank-sidecar-arc/scratch/autonomous-run-state.md`

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Iteration 001 complete; source paths passed with P0=0/P1=0/P2=1 test-quality advisory. Stage 3 precedence logic and phase 002 sidecar sigmoid/lock/handler/SIGTERM source paths were verified.
- [x] D2 Security — Iteration 002 complete; model pin/local-cache posture and localhost binding passed, benchmark/config leak scans passed, with P0=0/P1=1/P2=0 for over-broad sidecar env inheritance into a `trust_remote_code=True` process.
- [ ] D3 Traceability — Spec/code alignment for each phase, REQ-NNN traceability, tasks.md evidence matches actual files, implementation-summary.md mirrors shipped state, arc-parent phase-map row accuracy, benchmark §8 ↔ phase 005 HOLD execution coherence
- [ ] D4 Maintainability — Dual implementation drift risk (.cjs + .py ensure helpers), pinned-version maintenance burden (Qwen revision sha, pyproject deps, cocoindex versions match), failure-mode docs sufficiency, follow-on captures completeness (CPU→MPS, 006 dedup, plugin timeout)
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- This review does NOT re-litigate the HOLD verdict — that decision is data-driven by phase 004
- Does NOT propose new architecture (only audits what was built)
- Does NOT review the cocoindex sibling skill (`mcp-coco-index`) except where arc 008 patches its cli.py
- Does NOT verify Qwen model output quality on real corpora (phase 004 already did this; sidecar timed out, documented as caveat)
- Does NOT touch phase 004's benchmark fixture composition decisions (those are data-driven choices)

## 5. STOP CONDITIONS

- Convergence: severity-weighted `newFindingsRatio` ≤ 0.10 sustained across 2 iterations with rolling-average + MAD floor satisfied
- All 4 dimensions covered AND quality gates (evidence, scope, coverage) PASS
- Max iterations: 20
- Wall budget: 360 min (6 hours)
- Stuck threshold: 2 consecutive iterations with no NEW findings (only if dimensions are covered)
- P0 override: any new P0 in iteration N blocks convergence for N+1; must be re-reviewed

## 6. NEXT FOCUS

Iteration 003 — Dimension D3 (Traceability). Verify spec/code alignment for phases 001-005, REQ/task evidence, implementation-summary accuracy, arc-parent phase-map rows, and benchmark §8 HOLD verdict coherence.

Rationale: D2 completed with one required env-boundary finding and otherwise confirmed the model pin/local-cache posture, localhost-only sidecar bind, narrow runtime config additions, and clean benchmark artifact scan. Traceability is the next configured dimension and should prove the five-phase docs match the shipped source/config/benchmark state.

Carry-forward: P1-001 (`cross-consumer` env minimization) should feed remediation planning or synthesis. P2-001 (`test-isolation`) should be revisited in D4 Maintainability if the loop performs a test-suite quality pass.

## 7. KNOWN CONTEXT

(Memory-context pre-load skipped — fresh session; arc 008 was just shipped this session by the same orchestrator dispatching this review.)

Key context from this session's commits:
- Phase 001 (`230dbe4c0`): precedence swap stage3-rerank.ts:379-472 + defense-in-depth guard search-flags.ts:364-367; 2 vitest cases pass (10/10 in stage3-rerank-regression.vitest.ts)
- Phase 002 (`b3db00d2f`): new skill, 4 pytest cases pass, sigmoid smoke shows apple=0.984 / QCD=0.0004 from Qwen
- Phase 003 (`3ad09c6c3`): port-bind self-electing primary; 5 vitest cases pass; smokes 1,4,5 PASS out-of-sandbox (smoke 2 cocoindex deferred — daemon setup out of scope)
- Phase 004 (`c1258a54b`): HOLD verdict — hit_rate Δ +0.4pp, MRR Δ +0.004, p95 Δ +9832ms; Arm B 250/250 fallback (sidecar timed out every probe → quality not fairly tested)
- Phase 005 (`06ff42cb9`): HOLD path executed — docs only, no source/config changes
- State file: `scratch/autonomous-run-state.md` captures the run

## 8. REVIEW BOUNDARIES

In scope: see config.scopeBoundaries.includes (above)
Out of scope: see config.scopeBoundaries.excludes (above)

Particular attention items for cross-dimension review:
- **HOLD invariant** (D3 + D4): Did phase 005 truly leave cross-encoder.ts:54 + 4 runtime configs unchanged for SPECKIT_CROSS_ENCODER? `git diff` audit.
- **Sidecar race-bind** (D1 + D2): What happens if both spec-memory and cocoindex try to bind port 8765 in the same millisecond? Port-bind EADDRINUSE is the atomicity primitive — is the recovery path correct in both .cjs and .py?
- **Network access flag** (D2 + D4): Phase 002 + 004 used `-c sandbox_workspace_write.network_access=true` for codex. Are there any leaked credentials in the per-probe.jsonl or strategy that shouldn't have been written?
- **HOLD verdict integrity** (D3): Does §8 RECOMMENDATIONS in benchmark_report.md actually apply the documented decision rule? Or was the wording massaged?

## 9. RUNNING REVIEW STATE

### Findings Counts

- Iterations completed: 2 / 20
- Active findings: P0=0, P1=1, P2=1
- Latest newFindingsRatio: 1.00
- Latest verdict: CONDITIONAL

### What Worked

- Iteration 001: Direct line-window inspection was productive for D1. It verified the phase 001 precedence swap, helper guard, sidecar sigmoid math, lock placement, handlers, launcher SIGTERM path, and regression tests within the scan budget.
- Iteration 002: Focused line-window review plus targeted grep scans was productive for D2. It confirmed revision pinning, `local_files_only=True`, localhost-only binding, runtime config additions, benchmark artifact sanitization, and exposed the cross-consumer env-boundary gap.

### What Failed

- Iteration 001: No blocked review action. The pytest suite did not fully prove its named sidecar edge contracts; recorded as P2-001.
- Iteration 002: No blocked review action. One broad grep over benchmark artifacts produced excessive output before the tighter secret/PII scan; the final finding set relies on targeted line evidence and narrowed scans.

### Exhausted Approaches

- Iteration 001: Broad D1 scan across the named phase 001 and phase 002 correctness probes is complete. Do not repeat the same line-window sweep unless later evidence requires targeted re-read.
- Iteration 002: D2 model-load, sidecar bind, launcher env, runtime config, and benchmark leak scans are complete. Do not repeat the same security sweep unless D3/D4 evidence changes the trust-boundary assumptions.
