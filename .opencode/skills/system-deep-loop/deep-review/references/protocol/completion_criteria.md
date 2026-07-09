---
title: Deep Review Completion Criteria
description: Full definition-of-done checklist for a deep-review loop -- loop completion conditions, the binary quality gates that must pass before STOP, and release-readiness validation success criteria.
trigger_phrases:
  - "review loop completion criteria"
  - "review success criteria"
  - "review definition of done"
  - "review release readiness validation"
importance_tier: important
contextType: implementation
version: 1.11.0.0
---

# Deep Review Completion Criteria

Full definition-of-done checklist for a deep-review loop: loop completion conditions, the binary quality gates STOP must clear, and release-readiness validation success criteria.

---

## 1. OVERVIEW

### Purpose

This reference is the authoritative checklist for "is this review loop actually done." SKILL.md §6 SUCCESS CRITERIA carries a condensed summary and links here for the full enumeration; use this file when verifying a completed run, debugging a premature STOP, or reconciling completion metadata against the loop's real state.

### When to Use

- Verifying a review loop's completion before accepting its verdict.
- Debugging why STOP was blocked or why synthesis produced an incomplete report.
- Reconciling `review-report.md` claims against the canonical state files.
- Auditing a run for the release-readiness handoff.

### Relationship to `loop_state_and_gates.md`

`references/protocol/loop_state_and_gates.md` defines the three state-machine-level binary gates (Evidence, Scope, Coverage) that block a STOP *decision* inside the convergence check. This file is the broader definition-of-done: it also covers artifact existence, report structure, severity-field completeness, and the release-readiness handoff -- checked once the loop believes it has already reached STOP.

---

## 2. LOOP COMPLETION

A review loop is considered complete when every item below holds:

- The loop reached convergence (composite stop score above `compositeStopScore`, with required gates green) OR hit `maxIterations` without false-positive STOP.
- Every configured review dimension has at least one full iteration of coverage recorded in `deep-review-state.jsonl` and reflected in `deep-review-strategy.md`.
- Required traceability protocols (`spec_code`, `checklist_evidence`) executed at least once. Overlay protocols that apply to the target type ran or were explicitly marked N/A.
- All canonical state files exist and parse cleanly: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, and one `iterations/iteration-NNN.md` per dispatched iteration.
- `review/resource-map.md` was emitted from converged delta evidence unless `config.resource_map.emit == false` (operator flag `--no-resource-map`).
- `review/review-report.md` carries all 9 core sections (Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix) plus the conditional `## Resource Map Coverage Gate` section when `resource_map_present == true`.
- Canonical continuity surfaces updated via `generate-context.js` (description.json, graph-metadata.json, indexed memory entries).

---

## 3. QUALITY GATES

Each gate is binary: pass or block. STOP cannot be legal until every gate passes.

- **Config validity**: `deep-review-config.json` parses, names every required field, and lineage block matches the current run (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`).
- **Strategy initialization**: `deep-review-strategy.md` carries the Files Under Review table, Cross-Reference Status grouped by core vs overlay, Known Context, and Review Boundaries.
- **State consistency**: `deep-review-state.jsonl` opens with the config record and appends one iteration record per dispatched iteration. Reducer-owned fields in `deep-review-findings-registry.json` reconcile against JSONL totals.
- **Iteration completeness**: every dispatched iteration produced both an `iterations/iteration-NNN.md` (non-empty, ending with the canonical `Review verdict: PASS|CONDITIONAL|FAIL` line) AND a JSONL delta record with `findingDetails[]`, `findingsSummary`, `newFindingsRatio`.
- **Severity coverage**: every reported finding carries `severity` in {P0, P1, P2}, `category`, `file:line` evidence, `finding_class`, and a `content_hash` for synthesis dedup.
- **Advisory numeric score**: `riskScore` may appear in finding details as non-gating context only; verdict logic must ignore it.
- **Adversarial replay**: every P0 finding survived adversarial self-check. Rejected P0s downgraded with rationale recorded in the iteration narrative.
- **Coverage threshold**: `dimensions_covered_count == configured_dimensions_count` AND required traceability protocols covered, stable for at least `minStabilizationPasses` iterations.
- **Acceptance coverage**: when the spec-folder lifecycle predicate is active, the final report records `AC_COVERAGE` status, covered/total, floor, and next action; default-off INFO output is advisory and does not by itself block STOP.
- **Security-sensitive override**: when the run targets security, path handling, env precedence, schema boundaries, persistence, or shared policy, the gates from `references/convergence/convergence.md` "Security-Sensitive Fix Overrides" apply (`minStabilizationPasses=2`, closed-finding replay required, fix-completeness gate enforced).

---

## 4. VALIDATION SUCCESS

The release-readiness handoff is valid when:

- The final report records stop reason, iteration count, dimension coverage, severity counts (P0/P1/P2), verdict (PASS / CONDITIONAL / FAIL), and release-readiness state (`in-progress`, `converged`, `release-blocking`).
- Verdict logic matches: PASS = no P0/P1 findings (P2 advisories permitted with `hasAdvisories: true`). CONDITIONAL = P1 findings present with remediation plan. FAIL = any P0 confirmed after adversarial self-check.
- `resource-map.md` Phase-5 Augmentation section (if present) lists novel logic gaps with iteration source links, or explicitly records the empty-result case.
- `skill_advisor.py "run a deep review loop" --threshold 0.8` still surfaces the skill after any graph-metadata edits.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` exits 0 on the target spec folder.

---

## 5. RELATED RESOURCES

- `references/protocol/loop_state_and_gates.md` -- state transitions, error handling, and the Evidence/Scope/Coverage STOP-decision gates.
- `references/state/state_outputs.md` -- packet file ownership and the `review-report.md` section list.
- `references/state/state_format.md` -- schemas for every state file referenced above.
- `references/convergence/convergence.md` -- composite stop score, `minStabilizationPasses`, and Security-Sensitive Fix Overrides.
