# Deep Review Report - 027 Launch-State Review Slice

## Executive Summary

Verdict: CONDITIONAL  
Release readiness state: converged  
Session: `fanout-codex-4-1780596675702-s19q6b`  
Lineage: `codex-4`  
Iterations: 5  
Scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement` launch-state metadata and child scaffolding

Active findings:

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 2 |
| P2 | 1 |

`hasAdvisories`: true

The review covered correctness, security, traceability, and maintainability. It found no runtime/security blocker, but two active P1 metadata issues keep the launch state from a clean PASS.

## Planning Trigger

Route to remediation planning before treating 027 launch-state metadata as clean. The active P1s affect generated metadata that memory search, graph traversal, and resume tooling may consume.

## Active Finding Registry

### P1-001: Child graph metadata marks draft phases complete while evidence remains placeholder-shaped

Evidence:

- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:133`] Parent phase map labels `003-incremental-index-foundation` as `Draft`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42`] Child graph metadata says `"status": "complete"`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:59`] The implementation summary still contains placeholder prose.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:112`] Verification still contains a placeholder check row.

Impact: status-sensitive tooling can treat unimplemented/draft work as complete.

Fix: regenerate or manually reconcile child graph metadata for 003-006 after the real implementation evidence is present.

### P1-002: Renumbered 027 child descriptions still advertise old specId values

Evidence:

- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:131`] Parent phase map lists `001-peck-teachings-adoption/`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33`] The 001 child still has `"specId": "008"`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38`] The 002 child still has `"specId": "001"`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/description.json:53`] The 008 child still has `"specId": "007"`.

Impact: search, graph display, and resume routing can expose stale phase ids after renumbering.

Fix: regenerate child `description.json` files and verify `specId` equals the current numeric folder prefix for children 001-008.

### P2-001: Placeholder 000 child is listed as an independently executable phase but carries no spec metadata

Evidence:

- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:126`] Parent says every phase is independently executable.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130`] Parent lists `000-release-cleanup/` as a placeholder phase.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:180`] Parent asks whether the placeholder should remain indefinitely.

Impact: minor wayfinding and recursive-validation ambiguity.

Fix: make 000 explicitly non-executable or give it minimal placeholder metadata.

## Remediation Workstreams

1. Metadata regeneration: refresh `description.json` for 001-008 and `graph-metadata.json` for 003-006.
2. Completion-state reconciliation: decide whether graph metadata represents actual shipped state or planning state, then encode that consistently.
3. Placeholder policy: resolve whether `000-release-cleanup` stays in the phase map and how validators should classify it.

## Spec Seed

A follow-up spec should state:

- Generated child metadata must match current folder prefixes after renumbering.
- Completion-visible statuses require implementation-summary evidence, not template placeholders.
- Placeholder children must be explicitly non-executable or minimally spec-scaffolded.

## Plan Seed

1. Run metadata regeneration for 027 children.
2. Diff child `description.json` and `graph-metadata.json` against parent phase map.
3. Re-run strict recursive validation on 027 and capture diagnostics.
4. Update 000 placeholder policy.
5. Re-run this launch-state review slice or a single-pass verification against the remediated files.

## Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | P1-001 and P1-002 show metadata does not fully match the current parent spec. |
| `checklist_evidence` | core | partial | The Level 1 slice has no checklist, so evidence is recorded in iteration artifacts. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog implementation claims in scope. |
| `playbook_capability` | overlay | notApplicable | No playbook capability claims in scope. |

## Deferred Items

- Run `validate.sh --strict --recursive` again after remediation. During this review it exited with code 1 and no useful diagnostic output.
- Decide whether 026 "completion" means root completion or release-cleanup completion before future 027 alignment checks; sampled 026 root metadata is still `In Progress`.

## Audit Appendix

### Iterations

| Iteration | Focus | New P0/P1/P2 | Verdict |
|-----------|-------|--------------|---------|
| 001 | Correctness | 0/1/0 | CONDITIONAL |
| 002 | Security | 0/0/0 | PASS |
| 003 | Traceability | 0/1/0 | CONDITIONAL |
| 004 | Maintainability | 0/0/1 | PASS |
| 005 | Stabilization | 0/0/0 | PASS |

### Convergence Evidence

- All four dimensions covered.
- Core traceability protocols executed with partial status due active findings.
- Stabilization pass found no new P0/P1.
- Latest graph convergence event: STOP_ALLOWED.
- Final stop reason: converged.

### Validation Evidence

Command attempted:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement --strict
```

Observed result: exit code 1; output was `Auto-enabled recursive validation: phase child folders detected.`

The validation failure is retained as audit evidence but not promoted to a finding because the command emitted no file-level diagnostic.
