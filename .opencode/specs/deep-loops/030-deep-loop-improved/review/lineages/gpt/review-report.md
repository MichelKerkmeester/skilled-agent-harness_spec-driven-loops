# Deep Review Report: GPT Lineage

## Executive Summary

Verdict: **CONDITIONAL**. The lineage completed 10/10 iterations under `stopPolicy=max-iterations` and found 0 P0, 5 P1, and 1 P2 active findings. Release readiness is blocked by phase/status reconciliation, validation coverage gaps, cross-mode session-id parity, and the still-open sliding-window convergence child.

## Planning Trigger

Open a remediation pass before closing phase 011 or packet 030. The highest-value fixes are GPT-F003 (strict-only validator coverage), GPT-F002 (nested validation evidence), GPT-F005 (child 007 implementation), and GPT-F001 (metadata/status reconciliation).

## Active Finding Registry

### GPT-F001 (P1) Phase 011 resume/status metadata still points at the pre-remediation start state

- Evidence: `.opencode/specs/deep-loops/030-deep-loop-improved/spec.md:14`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/spec.md:101`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/graph-metadata.json:123`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/007-sliding-window-convergence-mode/tasks.md:48`.
- Impact: Operators resuming phase 011 can be routed back to child 001 even though children 001-006 are already complete and child 007 is the real remaining work.
- Recommendation: Reconcile phase map, continuity, completion percentage, and `last_active_child_id`, then regenerate metadata.

### GPT-F002 (P1) Root recursive validation evidence does not cover nested phase-011 children

- Evidence: `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/spec.md:48`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/spec.md:111`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1021`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/006-validate-sh-registry-bridge/implementation-summary.md:91`.
- Verification evidence: `validate.sh .opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation --strict --recursive` exits 2; children 001-005 fail `SPEC_DOC_INTEGRITY` for stale `Spec Folder` metadata and child 007 is missing `implementation-summary.md`.
- Impact: A root `validate.sh --strict --recursive` pass can be used as close-out evidence without exercising 011's seven child folders.
- Recommendation: Record validation from the 011 phase parent or extend close-out traversal to nested phase parents when acceptance criteria name grandchildren.

### GPT-F003 (P1) Default Node validation path still skips strict-only evidence and continuity lint rules

- Evidence: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1014`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1194`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:268`, `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:312`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:957`.
- Impact: `--strict` can miss `CONTINUITY_FRESHNESS` and `EVIDENCE_MARKER_LINT` in the default Node path, leaving strict validation weaker than the shell path.
- Recommendation: Mirror those strict-only checks in the Node orchestrator or run shell strict validators after the Node report.

### GPT-F004 (P1) Context and research fan-out configs still ignore the supplied detached session id

- Evidence: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:891`, `.opencode/commands/deep/assets/deep_context_auto.yaml:265`, `.opencode/commands/deep/assets/deep_context_auto.yaml:274`, `.opencode/commands/deep/assets/deep_research_auto.yaml:307`, `.opencode/commands/deep/assets/deep_research_auto.yaml:319`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/001-fanout-session-id-propagation/implementation-summary.md:87`.
- Impact: Review fan-out session id propagation is fixed, but context/research lineages can still split subprocess identity from durable config/state identity.
- Recommendation: Port the review `session_id_init` pattern to context and research and add cross-mode parity tests.

### GPT-F005 (P1) The sliding-window convergence follow-up remains unimplemented

- Evidence: `.opencode/specs/deep-loops/030-deep-loop-improved/timeline.md:217`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/007-sliding-window-convergence-mode/spec.md:56`, `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/007-sliding-window-convergence-mode/tasks.md:48`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:711`, `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:438`.
- Impact: Phase 011 cannot honestly close while the explicitly scoped child 007 remains unstarted and current convergence code still uses the full-history denominator path.
- Recommendation: Complete child 007 or explicitly split it out of phase 011 with a new approved scope decision.

### GPT-F006 (P2) Registry bridge has no direct TypeScript unit coverage

- Evidence: `.opencode/specs/deep-loops/030-deep-loop-improved/011-followup-remediation/006-validate-sh-registry-bridge/implementation-summary.md:104`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:598`.
- Impact: Bash fixtures cover behavior, but branch-level regressions in `validateFolder()`/`runRegistryShellRules()` can slip until an integration harness catches them.
- Recommendation: Add direct unit coverage for strict/default filtering and shell status mapping.

## Remediation Workstreams

1. Validation gate hardening: GPT-F002, GPT-F003, GPT-F006.
2. Phase close-out truth: GPT-F001, GPT-F005.
3. Cross-mode fan-out parity: GPT-F004.

## Spec Seed

- Add a child or follow-up for default Node strict-only validator parity.
- Amend child 007 if implementation scope changes from the current ADR-backed sliding-window mode.

## Plan Seed

- First run `validate.sh --strict --recursive` on `011-followup-remediation` specifically and record all seven child results.
- Implement Node-path strict-only validators or post-Node strict validator execution.
- Complete child 007's windowed novelty function, CLI validation, and denominator-drag fixture.

## Traceability Status

| Protocol | Status | Finding Refs |
|----------|--------|--------------|
| spec_code | partial | GPT-F001, GPT-F005 |
| checklist_evidence | partial | GPT-F002, GPT-F006 |
| feature_catalog_code | partial | GPT-F003, GPT-F004 |
| security replay | pass | No active P0/P1 security finding |

## Deferred Items

- No P0 findings.
- P2 GPT-F006 may be deferred only if bash fixture coverage remains the accepted gate for 006.

## Audit Appendix

- Iterations: 10/10.
- Stop reason: `maxIterationsReached`.
- Session id: `fanout-gpt-1782998103426-5a2g5w`.
- Resource map: target root absent; lineage-local map emitted.
- Lineage contract verification: PASS, JSON artifacts parse, 10 iteration files have canonical final verdict lines, and `synthesis_complete.stopReason=maxIterationsReached` with `totalIterations=10`.
- Packet validation: FAIL, `validate.sh .opencode/specs/deep-loops/030-deep-loop-improved --strict --recursive` exits 2. The root itself passes, but direct child phases 001/002/009/010 have strict warnings/errors; a targeted 011 recursive run also exits 2 as described under GPT-F002.
- Final parser verdict: CONDITIONAL.
