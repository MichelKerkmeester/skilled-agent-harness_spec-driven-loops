# Review Iteration 1

## Dimension

Correctness: containment invariants, baseline/untracked-state transitions, failure-path ordering, preserve-versus-restore semantics, and canonical root selection.

## Files Reviewed

- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:688-733,780-954,1357-1508
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3213-3550,3558-3640
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:789-824
- .opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs:32-55
- .opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:260-620
- .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:3146-3300
- specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:133-149
- specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:544-553

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Correctness Observations

- The detector compares the post-dispatch dirty-path set with the pre-dispatch baseline and includes a second baseline-only loop for deleted untracked paths (write-containment.ts:894-954). The corresponding unit coverage exercises deleted untracked files and nested paths (write-containment.vitest.ts:445-554).
- The fan-out runner invokes containment after the child process exits but before lane failure gates are evaluated (fanout-run.cjs:3476-3541,3558-3640), so an out-of-scope write cannot bypass containment merely by also failing the lane.
- Preserve remains the default remedy and restore is explicitly selected by configuration (write-containment.ts:1357-1426; executor-config.ts:789-824). Removed worktree configuration is rejected by the current strict parser, matching the accepted removal direction (executor-config.ts:803-817; decision-record.md:544-553).
- Root selection resolves the physical artifact tree and redirects only when the artifact is outside the current checkout physical worktree (runtime-bootstrap.cjs:32-55), while containment itself requires lexical and canonical inclusion (write-containment.ts:688-733).

## Traceability Checks

- spec_code: partial for this pass. The correctness-relevant claims above align with current source; the full normative packet and workflow sweep is deferred to iteration 3.
- checklist_evidence: partial for this pass. Relevant tests were inspected, but checklist completion marks are deferred to the traceability pass.
- feature_catalog_code: not assessed in this dimension.
- playbook_capability: not assessed in this dimension.

## Ruled-Out Directions

- baseline-deletion: current union comparison and tests cover baseline-only untracked deletion.
- failure-path-ordering: containment is before the runner failure gates.
- preserve-restore-state: default preserve and explicit restore are separated in the current implementation.
- canonical-root-selection: physical checkout fallback and canonical containment checks are present.
- threshold-boundary: configuration uses the documented strict above-threshold comparison; full caller/contract comparison is deferred.
- quarantine-pass-collision: pass directories include iteration and attempt identity; destination-write security is deferred to iteration 2.

## Verdict

Review verdict: PASS

## Next Dimension

Security: trusted baseline capture, baseline reads, quarantine destination creation, and restore writes across symlink and race boundaries.
