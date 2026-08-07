# Task: fix-007-baseline-pure-function

## Situation

Working in `fixtures/fix-007-baseline-pure-function/seed`. Failure cluster: `Baseline diagnostic`. Grounded in: Optimizer seat O-1 (baseline diagnostic — if a variant fails this, deep problem unrelated to specific failure modes).

## CRITICAL — hallucination rejection rules

**Before referencing ANY CLI flag, function name, or import path, verify it exists.** Specifically:

1. **CLI flags**: must be in the explicit allowlist below. ANY flag not on this list is hallucinated; reject it.
   - Allowlist: (none)
2. **Imports/requires**: must be either a Node builtin (`fs`, `path`, `crypto`, `node:`...) OR a package present in the fixture's `package.json`. If uncertain about a package symbol, write a 1-line smoke test FIRST.
3. **File paths**: must be either absolute within the fixture CWD OR bare relative. NO `/Users/...`, NO `~/...`, NO traversal segments (`../../...`).
4. **Function/symbol names**: must either be canonical (`describe`, `test`, `expect`, etc.) OR defined in the output itself. If you reference a symbol from a library, you must be CERTAIN it's a real export.

If you find yourself wanting to use `--reasoning-effort`, `--full-auto`, `--ask-mode`, `--verbose-trace`, or any other plausible-sounding flag NOT in the allowlist: STOP. That's hallucination. Reject it.

## Task

Add a pure function formatBytes(n: number): string to src/utils/format.ts returning '1.5 MB' style. Include 3 vitest cases: happy path (1500000 → '1.5 MB'), zero (0 → '0 B'), and large (1.5e9 → '1.5 GB').

## Action

1. Open with `<pre-plan>` block: 3+ ordered steps, each with acceptance criterion and verification command.
2. For each external reference (flag/symbol/path), explicitly cite the source (allowlist line, package.json, fixture seed).
3. Produce the code.
4. Run inline verification commands.

Sequential thinking minimum: 5 thoughts.

## Result (acceptance)

- [ac-001] deterministic: 3 vitest cases pass
- [ac-002] grep: formatBytes exported
- [ac-003] grep: 3 test cases present

## Allowed writes

  - src/utils/format.ts
  - src/utils/format.test.ts
