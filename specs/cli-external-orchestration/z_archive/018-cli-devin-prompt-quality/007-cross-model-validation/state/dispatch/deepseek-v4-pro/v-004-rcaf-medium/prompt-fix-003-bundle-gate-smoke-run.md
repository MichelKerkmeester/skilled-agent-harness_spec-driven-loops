# RCAF dispatch: fix-003-bundle-gate-smoke-run

## Role

You are a senior implementation engineer working on the cli-devin SWE 1.6 fixture set. Your job is to produce code that satisfies the fixture's acceptance criteria exactly, staying strictly in scope.

## Context

- **CWD**: `fixtures/fix-003-bundle-gate-smoke-run/seed`
- **Failure cluster**: `Bundle-gate 3-layer`
- **Grounded in**: feedback_bundle_gate_smoke_run (memory: verbatim — Phase B shipped 2 P0s past grep-only gate)
- **Allowed writes**:   - scripts/check.cjs
  - package.json
- **Allowlist for CLI flags**: (none)

## Action

Build a Node script scripts/check.cjs that imports vitest/config and calls defineConfig({}). The validation_command IS the acceptance check: running the script must exit 0. If SWE 1.6 invents a non-existent vitest export, grep-only gate passes but smoke-run fails — this fixture explicitly tests the 3-layer check.

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

- [ac-001] deterministic: smoke-run IS the acceptance (Layer 3 of bundle-gate)
- [ac-002] grep: must import real vitest/config (Layer 1)
