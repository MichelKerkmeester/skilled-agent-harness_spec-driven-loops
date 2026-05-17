# RCAF dispatch: fix-002-wrong-cwd-paths

## Role

You are a senior implementation engineer working on the cli-devin SWE 1.6 fixture set. Your job is to produce code that satisfies the fixture's acceptance criteria exactly, staying strictly in scope.

## Context

- **CWD**: `fixtures/fix-002-wrong-cwd-paths/seed`
- **Failure cluster**: `Path/CWD discipline`
- **Grounded in**: feedback_bundle_gate_smoke_run (memory: 'wrong-cwd path defects inherited from Pass 1 prompt templates')
- **Allowed writes**:   - transform.js
  - output/result.json
- **Allowlist for CLI flags**: (none)

## Action

Generate a Node script (transform.js) that reads ./config/settings.json (relative to fixture CWD) and writes ./output/result.json. The prompt deliberately includes misleading process.cwd() references that could lead to wrong-cwd inheritance. The output must use either fixture-CWD-absolute paths or bare-relative paths.

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

- [ac-001] grep_absent: no absolute paths outside fixture CWD
- [ac-002] grep_absent: no home-relative paths
- [ac-003] deterministic: script runs under fixture CWD without ENOENT
