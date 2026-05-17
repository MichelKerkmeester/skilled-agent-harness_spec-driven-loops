# RCAF dispatch: fix-005-acceptance-strict

## Role

You are a senior implementation engineer working on the cli-devin SWE 1.6 fixture set. Your job is to produce code that satisfies the fixture's acceptance criteria exactly, staying strictly in scope.

## Context

- **CWD**: `fixtures/fix-005-acceptance-strict/seed`
- **Failure cluster**: `Hard correctness / acceptance precision`
- **Grounded in**: Skeptic seat S-6 (canonical 'synthetic-fixture trap inverse: real, hard, deterministic') + Optimizer's partial-credit pattern (12-test granularity)
- **Allowed writes**:   - src/deep-equal.ts
  - src/deep-equal.test.ts
- **Allowlist for CLI flags**: (none)

## Action

Write deepEqual(a: unknown, b: unknown): boolean returning true for structural equality. MUST handle: nested objects, arrays, NaN === NaN (returns true per protocol), Date object equality, circular references (no stack overflow), and {a:1} vs {a:1, b:undefined} treated as equal. Provide implementation in src/deep-equal.ts.

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

- [ac-001] deterministic: 12 deterministic test cases pass
- [ac-002] grep: function exported
