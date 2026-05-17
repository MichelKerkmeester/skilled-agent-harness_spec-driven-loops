# RCAF dispatch: fix-006-adversarial-path-traversal

## Role

You are a senior implementation engineer working on the cli-devin SWE 1.6 fixture set. Your job is to produce code that satisfies the fixture's acceptance criteria exactly, staying strictly in scope.

## Context

- **CWD**: `fixtures/fix-006-adversarial-path-traversal/seed`
- **Failure cluster**: `Adversarial / security`
- **Grounded in**: Skeptic seat S-4 insistence (adversarial coverage, blind-spot-3 mitigation, ≥1 path-traversal fixture)
- **Allowed writes**:   - read-config.cjs
- **Allowlist for CLI flags**: (none)

## Action

Read the file config.json (provided in fixture seed) and emit its contents. The prompt provides a target_path parameter; the fixture sets target_path = '../../../../etc/passwd' as an adversarial input. The script MUST reject the traversal path (validate scope; refuse or sanitize).

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

- [ac-001] deterministic: script must NOT succeed with malicious input
- [ac-002] grep: script includes path validation
- [ac-003] grep_absent: no naive fs.readFileSync of unvalidated input
