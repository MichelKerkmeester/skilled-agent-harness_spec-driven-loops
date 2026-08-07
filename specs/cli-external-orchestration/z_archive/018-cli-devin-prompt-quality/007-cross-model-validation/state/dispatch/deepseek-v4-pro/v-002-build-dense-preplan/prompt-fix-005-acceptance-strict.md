# BUILD: fix-005-acceptance-strict

## Bounds (what's in scope, what's not)

**CWD**: `fixtures/fix-005-acceptance-strict/seed`
**Allowed writes**:
  - src/deep-equal.ts
  - src/deep-equal.test.ts

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: (none).

## User-need (what's needed)

Write deepEqual(a: unknown, b: unknown): boolean returning true for structural equality. MUST handle: nested objects, arrays, NaN === NaN (returns true per protocol), Date object equality, circular references (no stack overflow), and {a:1} vs {a:1, b:undefined} treated as equal. Provide implementation in src/deep-equal.ts.

**Failure cluster**: Hard correctness / acceptance precision
**Grounded in**: Skeptic seat S-6 (canonical 'synthetic-fixture trap inverse: real, hard, deterministic') + Optimizer's partial-credit pattern (12-test granularity)

## Implementation plan (dense — every step has acceptance + verification)

Begin with `<pre-plan>` block containing AT LEAST 4 ordered steps. Each step MUST include:
- Inputs (state of files at this point)
- Outputs (state after this step)
- Acceptance criterion (specific, checkable)
- Verification command (executable)
- Stop condition (when to halt this step)

Sequential thinking minimum: 8 thoughts before producing any output.

## Limits (what NOT to do)

- Do not write absolute paths outside the fixture CWD
- Do not invent CLI flags; verify against allowlist before use
- Do not touch files outside the allowed-writes list (scope-creep is a hard fail)
- Do not assume libraries exist; if uncertain, smoke-run a 1-line import test first

## Done-when (acceptance)

- [ac-001] deterministic: 12 deterministic test cases pass
- [ac-002] grep: function exported

Each criterion above must pass. Emit verification commands inline so they can be re-run.
