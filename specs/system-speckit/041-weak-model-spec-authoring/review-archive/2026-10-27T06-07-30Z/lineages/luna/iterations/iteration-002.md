# Review Iteration 2 — Correctness: placeholder-gate parity

## Dispatcher

- Session: `fanout-luna-1792949481267-fym7sk`, generation 1, lineage mode `new`.
- Focus: compare the phase 003 placeholder-gate contract with the orchestrator and shell rule implementation.
- Review scope: the phase 003 contract, its paired implementation paths, and the parity test; no implementation changes and no tests run.

## Files Reviewed

- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md:139-145`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:665,725-761`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:113-158`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:83-122`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/goal.md:143-147`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/implementation-summary.md:84-90`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Indented fenced examples can diverge between the two checks** -- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:115-119` -- The shell mirror toggles code-block state only when a line begins with three backticks at column one, while the orchestrator accepts leading whitespace before a fence. A valid indented fenced example containing a value token is therefore ignored by one implementation and scanned by the other, contrary to phase 003 REQ-002's parity requirement. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:115-119`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:725-734`] [SOURCE: `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md:140`]
Finding class: cross-implementation-contract
Scope proof: Phase 003 names the orchestrator and `runtime/cli/rules/check-placeholders.sh` as paired implementations and requires them to agree.
Affected surface hints: `PLACEHOLDER_FILLED` verdict, isolated shell-rule harness, fenced examples in spec documents.
Case: A v2.3 Draft packet contains a three-space-indented fenced block with `[YOUR_VALUE_HERE: example]`; the orchestrator skips it and the shell rule reports it.

2. **The shell-only title provenance check lacks orchestrator parity** -- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:149-158` -- The shell rule flags `[template:...]` in a title, but the orchestrator's canonical marker expression does not include that form. The same document can therefore fail the shell rule while the orchestrator's `PLACEHOLDER_FILLED` check passes, another uncovered parity case. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:149-158`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:661-665,734-761`] [SOURCE: `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md:140`]
Finding class: cross-implementation-contract
Scope proof: The phase 003 affected-surfaces contract calls the shell script a mirror and REQ-002 requires parity for the implementations.
Affected surface hints: `PLACEHOLDER_FILLED` verdict, title provenance cleanup, isolated shell-rule harness.
Case: A required `spec.md` has `title: [template:legacy] Example`; the shell rule matches the title token and the orchestrator matcher does not.

## Traceability Checks

- Phase 003 REQ-002 → orchestrator and shell implementation: CONDITIONAL. The core lifecycle cells are represented in both, but the two parity gaps above remain.
- Phase 003 recorded legacy angle-token finding → current implementation: PASS. The current orchestrator only defers the exact bracketed `[YOUR_VALUE_HERE:` marker, and the phase goal records that the earlier angle-token mismatch was fixed.
- Phase 003 parity test → boundary coverage: PARTIAL. The test covers v2.3 Draft/Complete, v2.2 Draft, and open-question cases, but does not exercise indented fences or the shell-only title-token branch.

## Integration Evidence

The shell rule is run by the isolated parity helper in `placeholder-token-gate.vitest.ts`; the orchestrator is invoked through `validate.sh`. The sources use different fence recognition and marker sets, so the helper can report disagreement for the two cases above.

## Edge Cases

The current guard at `orchestrator.ts:743` prevents the old `<YOUR_VALUE_HERE:` form from being deferred as a Draft warning. The phase 003 goal records that correction; it is not an active finding.

The code comparison is static. No test or validation command was run.

## Confirmed-Clean Surfaces

- The bracketed value-token lifecycle distinguishes v2.3 Draft warnings from final-status errors in both implementations.
- The current orchestrator limits Draft deferral to `[YOUR_VALUE_HERE:` and keeps clarification markers as errors.

## Ruled Out

- The previously reported `<YOUR_VALUE_HERE:` Draft deferral mismatch: ruled out by the current `match[0] === '[YOUR_VALUE_HERE:'` guard and phase 003 goal record.

## Next Focus

- Dimension: security
- Focus area: inspect input validation and repository-path containment in the authoring-card scaffold command.
- Reason: move from validator behavior to a user-controlled path construction surface.
- Rotation status: correctness and security are covered; traceability and maintainability remain uncovered.
- Blocked/productive carry-forward: the static contract-to-implementation comparison found two parity gaps; do not retry the fixed angle-token case.
- Required evidence: command argument parsing, track/path composition, write destination checks, and the phase 005 authoring-card instructions.

Review verdict: PASS
