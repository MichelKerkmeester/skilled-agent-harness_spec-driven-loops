# Deep Review Strategy — glm fan-out lineage

**Target**: `skilled-agent-orchestration/123-agent-loops-improved` (spec-folder, phase-parent)
**Executor**: cli-opencode model=zai-coding-plan/glm-5.2
**stopPolicy**: max-iterations (50); convergence is telemetry-only and MUST NOT end the run early — broaden angles instead.
**sessionId**: fanout-glm-1782805948784-ypcv5r

---

## Files Under Review

| Path | Role | Notes |
|------|------|-------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Fan-out orchestrator | Prompt build, session id, pool assignment, sandbox, salvage |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Review workflow | Init config, session id binding, comment hygiene |
| `.opencode/agents/deep-review.md` | LEAF review agent contract | Single-iteration boundary |
| `.opencode/specs/skilled-agent-orchestration/123-agent-loops-improved/009-loop-systems-remediation/spec.md` | Phase 009 spec | Placeholder/status drift |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Fan-out tests | Native-only vs flat-pool parity |
| `.opencode/specs/.../123-agent-loops-improved/spec.md` | Parent phase spec | Phase map / status integrity |

## Cross-Reference Status

### Core (gating)
- `spec_code` — NOT STARTED. Verify phase 009 spec placeholders vs Complete status; verify phase map status claims.
- `checklist_evidence` — NOT STARTED. Verify fanout-run focused test parity; salvage sweep evidence.

### Overlay (advisory)
- `feature_catalog_code` — NOT STARTED. CLI fan-out prompt vs LEAF agent contract.
- `playbook_capability` — NOT STARTED. Salvage recovery reliability for weak executors.

## Known Context

- Packet `123-agent-loops-improved` is a phase parent; phases 001-008 Complete, 009 In Progress per parent spec.md:106.
- Phase 009 spec.md self-reports `Status: Complete` (line 50) and `completion_pct: 100` (line 25) while retaining template placeholders (problem, scope, requirements, handoff criteria, phase map rows).
- Review init (`deep_review_auto.yaml`) writes `sessionId: {ISO_8601_NOW}` (lines 373, 410, 415) while `fanout-run.cjs:1281` builds a concrete `sessionId = fanout-${lineage.label}-${runId}` and passes it only via the prompt — the YAML never consumes it.
- `resource-map.md` is NOT present at init → coverage gate will be omitted (per SKILL.md §3).
- Previous glm attempt classified `salvage_miss` (exited 0, no review-report.md) — reliability signal for the salvage path itself.

## Review Boundaries

- Observation-only. No code changes during audit.
- Code-only. No WebFetch.
- All artifacts written under `{artifactDir}` only.

## Dimension Queue / Rotation

correctness → security → traceability → maintainability → (adversarial replay / coverage sweeps) … repeat, broadening angles each wave.

## Next Focus

Iteration 1: traceability — phase 009 placeholder/Complete-status drift (spec_code core protocol).
