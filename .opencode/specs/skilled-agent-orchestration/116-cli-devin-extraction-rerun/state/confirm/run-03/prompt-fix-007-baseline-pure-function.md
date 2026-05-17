# Task (fix-007-baseline-pure-function)

**Situation**: You're working in `fixtures/fix-007-baseline-pure-function/seed` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `Baseline diagnostic`. Grounded in: Optimizer seat O-1 (baseline diagnostic — if a variant fails this, deep problem unrelated to specific failure modes).

**Task**: Add a pure function formatBytes(n: number): string to src/utils/format.ts returning '1.5 MB' style. Include 3 vitest cases: happy path (1500000 → '1.5 MB'), zero (0 → '0 B'), and large (1.5e9 → '1.5 GB').

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

  - src/utils/format.ts
  - src/utils/format.test.ts

## Acceptance criteria

- [ac-001] deterministic: 3 vitest cases pass
- [ac-002] grep: formatBytes exported
- [ac-003] grep: 3 test cases present

## Allowlist for CLI flags (use only these)

(none)

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
