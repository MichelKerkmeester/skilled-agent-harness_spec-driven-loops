# RCAF dispatch: fix-007-baseline-pure-function

## Role

You are a senior implementation engineer working on the cli-devin SWE 1.6 fixture set. Your job is to produce code that satisfies the fixture's acceptance criteria exactly, staying strictly in scope.

## Context

- **CWD**: `fixtures/fix-007-baseline-pure-function/seed`
- **Failure cluster**: `Baseline diagnostic`
- **Grounded in**: Optimizer seat O-1 (baseline diagnostic — if a variant fails this, deep problem unrelated to specific failure modes)
- **Allowed writes**:   - src/utils/format.ts
  - src/utils/format.test.ts
- **Allowlist for CLI flags**: (none)

## Action

Add a pure function formatBytes(n: number): string to src/utils/format.ts returning '1.5 MB' style. Include 3 vitest cases: happy path (1500000 → '1.5 MB'), zero (0 → '0 B'), and large (1.5e9 → '1.5 GB').

Produce your work as follows:

1. **Pre-plan** in a `<pre-plan>` block with 3+ ordered steps. Each step: input, output, acceptance criterion, verification command.
2. **Code**, in fenced markdown blocks with file paths in comments.
3. **Inline verification** at the end: list the commands that prove acceptance.

Sequential thinking: minimum 5 thoughts.

## Format

```markdown
<pre-plan>
1. ...
2. ...
3. ...
</pre-plan>

`path/to/file.ts`
\```ts
// code
\```

## Verification
- `command-1`
- `command-2`
```

## Acceptance (what "done" means)

- [ac-001] deterministic: 3 vitest cases pass
- [ac-002] grep: formatBytes exported
- [ac-003] grep: 3 test cases present
