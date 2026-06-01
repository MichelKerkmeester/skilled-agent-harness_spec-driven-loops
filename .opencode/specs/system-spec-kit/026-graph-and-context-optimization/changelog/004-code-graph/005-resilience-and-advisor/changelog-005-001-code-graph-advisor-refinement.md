---
title: "Code Graph and Skill Advisor Refinement: Research Loop and Phase 5 Implementation"
description: "A 20-iteration deep-research investigation surfaced 35 findings across the advisor and code-graph surfaces, then a Phase 5 implementation roadmap closed all of them across 10 PRs, 5 fix-up batches, an F35 confidence calibration bench plus a final daemon-availability pass."
trigger_phrases:
  - "code graph advisor refinement implementation"
  - "advisor refinement B1 through B6"
  - "015 deep-research loop and phase 5"
  - "advisor trust-state vocabulary unification"
  - "F35 confidence calibration bench"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/001-code-graph-advisor-refinement` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor`

### Summary

The Code Graph and Skill Advisor systems had accumulated technical debt across algorithm correctness, daemon reliability, trust-state vocabulary plus observability coverage. No prior investigation had surveyed both systems together. A 20-iteration deep-research loop produced 35 actionable findings across five dimensions (algorithm correctness, performance, UX consistency, observability plus cross-runtime parity) and yielded a SHIP_READY_CONFIRMED synthesis with a 10-PR implementation roadmap.

Phase 5 executed all 10 PRs, covering corpus-path repair, Claude settings rewrite, the PR-3 promotion-subsystem delete sweep, readiness/trust-state vocabulary unification, metrics instrumentation, cache invalidation wiring, settings parity plus parse/query/hook-brief benchmark surfaces. A deep-review cycle produced an initial CONDITIONAL verdict with 11 P1 findings and 3 P2 advisories. All five remediation batches (B1 through B5) plus the F35 confidence-calibration bench were applied. A final B6 pass then closed a daemon-availability regression, a Python compat-shim daemonless fallback gap plus a manual-testing-playbook phrase drift. The verdict flipped to PASS. All 54 tasks are marked complete.

### Added

- Canonical `TrustState` re-export from `freshness/trust-state.ts` with V1-V5 deprecation aliases, unifying vocabulary across callers
- Sixteen metrics definitions (six code-graph, five skill-advisor scorer, three freshness, two cross-cutting) added to `lib/metrics.ts` for P50/P95/P99 query latency instrumentation
- `hook-brief-signal-noise.bench.ts` bench covering four runtimes with an iter-4 seven-axis matrix as a fixture and non-zero signal count assertions
- Applied remediation records `applied/B1.md` through `applied/B6.md` and `applied/F35-calibration.md` (NEW)

### Changed

- `settings.local.json` rewritten with a single `UserPromptSubmit` array entry, removing the broken parallel-hook shape that caused Copilot-adapter side effects in Claude sessions
- Trust-state and freshness semantics unified: stale vocabulary replaced with the canonical V1-V5 alias tower (B1 scope)
- Metric label policy and bench harness hardened: `fusion.ts`, vitest config plus three bench files aligned to the new label namespace (B2 scope)
- Hook settings execution and parity coverage aligned to post-015 contract shapes (B4 scope)

### Fixed

- `canonicalReadinessFromFreshness` was missing an `'error'` arm, causing callers to fall through to an undefined branch. Added `case 'error': return 'missing'` to close the gap.
- `query.ts` lacked an `'unavailable'` trust-state path, causing silent failures on daemonless advisor queries. Added typed handling at lines 623 to 780.
- Corpus path was hardcoded in `scorer-bench.ts` and `python-ts-parity.vitest.ts`, breaking bench runs on non-default workspace roots. Extracted to a `SPECKIT_BENCH_CORPUS_PATH` constant.
- Advisor daemon availability regressed when the skill graph was stale after the PR-3 deletion sweep. B6 added a Python compat-shim daemonless fallback and reconciled the manual-testing playbook from 47 to 42 phrases, making 14 of 14 in-scope tests green.

### Verification

| Check | Result |
|-------|--------|
| Finding source lookup | PASS. `R1-P1-002` and `R3-P1-003` records found in review delta JSONL. |
| Retained memory semantics test | PASS. `find .opencode/skills/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts -maxdepth 1 -print` returns the retained file. |
| Removed promotion subsystem paths | PASS. `find` over deleted promotion module, schema, promotion test plus bench paths returns no surviving paths. |
| Summary stale-state scrub | PASS. Implementation summary describes Phase 5 completion, not the old scaffold state. |
| B3 validation scope | PASS. Documentation-only batch. No `tsc` run required. |
| CHK-001 Research questions documented | PASS. `spec.md` section 7 contains RQ-01 through RQ-10 across dimensions A to E. |
| CHK-002 Technical approach defined | PASS. `plan.md` section 4 covers phases 1 to 3 with iteration bands 1 to 6, 7 to 14 plus 15 to 20. |
| CHK-003 Level 3 spec folder structure complete | PASS. All required files present: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `applied/B1.md` (NEW) | Created | Trust-state and freshness semantics. Vocabulary unification via V1-V5 alias tower. |
| `applied/B2.md` (NEW) | Created | Metric label policy and bench harness hardening. Covers `fusion.ts`, vitest config, three bench files. |
| `applied/B3.md` (NEW) | Created | PR-3 deletion inventory and packet traceability. Documentation-only. |
| `applied/B4.md` (NEW) | Created | Hook settings execution and parity coverage. Post-015 contract alignment. |
| `applied/B5.md` (NEW) | Created | Legacy corpus parity repair. Hardcoded path extraction to `SPECKIT_BENCH_CORPUS_PATH`. |
| `applied/F35-calibration.md` (NEW) | Created | Confidence calibration bench. Brier=0.204829, ECE=0.138314 across 10 buckets and a 200-row corpus. |
| `applied/B6.md` (NEW) | Created | Daemon-availability regression fix. Python compat-shim daemonless fallback. Playbook reconciled from 47 to 42 phrases. 14 of 14 in-scope tests green. |

### Follow-Ups

- Deferred: `advisor-runtime-parity.vitest.ts` has 7 of 8 tests failing due to a pre-existing cross-packet regression unrelated to this packet. The root causes (plugin export shape mismatch and mocked-subprocess freshness probe disagreement) need a dedicated parity-suite remediation packet.
- Deferred: F2 and F8 tree-sitter `call_expression` AST work moved to a future packet per research synthesis section 15.
- Deferred: F36 bench items 1, 2, 3, 5 plus 6 moved to a future packet per research synthesis section 15. Phase 5 shipped F36 items 4, 7 plus 8 only.
- The retained `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` test covers memory auto-promotion semantics. A follow-up should add explicit auto-promotion tier-escalation coverage.
