# Task (fix-005-acceptance-strict)

**Situation**: You're working in `fixtures/fix-005-acceptance-strict/seed` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `Hard correctness / acceptance precision`. Grounded in: Skeptic seat S-6 (canonical 'synthetic-fixture trap inverse: real, hard, deterministic') + Optimizer's partial-credit pattern (12-test granularity).

**Task**: Write deepEqual(a: unknown, b: unknown): boolean returning true for structural equality. MUST handle: nested objects, arrays, NaN === NaN (returns true per protocol), Date object equality, circular references (no stack overflow), and {a:1} vs {a:1, b:undefined} treated as equal. Provide implementation in src/deep-equal.ts.

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

  - src/deep-equal.ts
  - src/deep-equal.test.ts

## Acceptance criteria

- [ac-001] deterministic: 12 deterministic test cases pass
- [ac-002] grep: function exported

## Allowlist for CLI flags (use only these)

(none)

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
