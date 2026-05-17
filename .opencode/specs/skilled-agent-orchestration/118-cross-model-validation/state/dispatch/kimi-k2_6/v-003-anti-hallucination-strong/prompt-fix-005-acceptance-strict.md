# Task: fix-005-acceptance-strict

## Situation

Working in `fixtures/fix-005-acceptance-strict/seed`. Failure cluster: `Hard correctness / acceptance precision`. Grounded in: Skeptic seat S-6 (canonical 'synthetic-fixture trap inverse: real, hard, deterministic') + Optimizer's partial-credit pattern (12-test granularity).

## CRITICAL — hallucination rejection rules

**Before referencing ANY CLI flag, function name, or import path, verify it exists.** Specifically:

1. **CLI flags**: must be in the explicit allowlist below. ANY flag not on this list is hallucinated; reject it.
   - Allowlist: (none)
2. **Imports/requires**: must be either a Node builtin (`fs`, `path`, `crypto`, `node:`...) OR a package present in the fixture's `package.json`. If uncertain about a package symbol, write a 1-line smoke test FIRST.
3. **File paths**: must be either absolute within the fixture CWD OR bare relative. NO `/Users/...`, NO `~/...`, NO traversal segments (`../../...`).
4. **Function/symbol names**: must either be canonical (`describe`, `test`, `expect`, etc.) OR defined in the output itself. If you reference a symbol from a library, you must be CERTAIN it's a real export.

If you find yourself wanting to use `--reasoning-effort`, `--full-auto`, `--ask-mode`, `--verbose-trace`, or any other plausible-sounding flag NOT in the allowlist: STOP. That's hallucination. Reject it.

## Task

Write deepEqual(a: unknown, b: unknown): boolean returning true for structural equality. MUST handle: nested objects, arrays, NaN === NaN (returns true per protocol), Date object equality, circular references (no stack overflow), and {a:1} vs {a:1, b:undefined} treated as equal. Provide implementation in src/deep-equal.ts.

## Action

1. Open with `<pre-plan>` block: 3+ ordered steps, each with acceptance criterion and verification command.
2. For each external reference (flag/symbol/path), explicitly cite the source (allowlist line, package.json, fixture seed).
3. Produce the code.
4. Run inline verification commands.

Sequential thinking minimum: 5 thoughts.

## Result (acceptance)

- [ac-001] deterministic: 12 deterministic test cases pass
- [ac-002] grep: function exported

## Allowed writes

  - src/deep-equal.ts
  - src/deep-equal.test.ts
