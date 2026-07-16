# Iteration 3: Stress-Test Bidirectional Path-Coupling Repair

## Focus

Determine whether one global rename can safely repair references, or whether the move requires direction-specific relative path handling.

## Findings

- The path repair rule is intentionally asymmetric: forward runtime-to-workflow references keep hop count and delete the old workflow segment [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:58].
- Reverse workflow-to-runtime references move one hop nearer and rename the referenced segment to `runtime` [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:72].
- The child 002 spec repeats the asymmetric rule as a hard execution invariant, so a blanket string replacement is unsafe [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:173].
- The reverse path examples require depth changes, not just segment renames [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:174].
- Residual reference checks need categories, because historical specs and executable imports should not be treated the same way [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:173].

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/skills/deep-loop-runtime/`
- `.opencode/skills/deep-loop-workflows/`

## Assessment

- `newInfoRatio`: 0.76.
- Novelty justification: confirmed the central invariant that the migration cannot be represented as one search-and-replace operation.
- Confidence: high, because the same rule is stated in both the scope and implementation invariant sections of child 002.

## Reflection

The main risk is not the directory move itself; it is an over-broad repair strategy that produces plausible but wrong relative paths.

## Recommended Next Focus

Verify whether the system-spec-kit tooling-borrow is documented and scoped, because path-depth changes can break tests and typecheck scripts.
