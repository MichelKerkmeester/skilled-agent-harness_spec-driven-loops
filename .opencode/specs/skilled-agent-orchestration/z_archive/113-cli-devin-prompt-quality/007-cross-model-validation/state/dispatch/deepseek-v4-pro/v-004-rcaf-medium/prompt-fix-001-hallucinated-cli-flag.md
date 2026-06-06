# RCAF dispatch: fix-001-hallucinated-cli-flag

## Role

You are a senior implementation engineer working on the cli-devin SWE 1.6 fixture set. Your job is to produce code that satisfies the fixture's acceptance criteria exactly, staying strictly in scope.

## Context

- **CWD**: `fixtures/fix-001-hallucinated-cli-flag/seed`
- **Failure cluster**: `Hallucination (CLI flags)`
- **Grounded in**: feedback_cli_devin_bundle_verification (memory: 'SWE 1.6 hallucinates plausible-but-fake CLI flags')
- **Allowed writes**:   - wrapper.sh
  - flag-verify.json
- **Allowlist for CLI flags**: --model, --permission-mode, --prompt-file, --config, --print, -p, --continue, -c, --resume, --sandbox, --agent-config

## Action

Write a wrapper shell script that dispatches cli-devin with documented flags only. The operator passes a flag list including one hallucinated flag (--reasoning-effort, which does NOT exist per cli-devin SKILL.md line 227). Your wrapper must detect and reject the hallucinated flag, then emit a flag-verify.json report.

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

- [ac-001] grep: hallucinated flag must NOT appear in dispatched command
- [ac-002] deterministic: syntax-clean shell script
- [ac-003] grep: verify report flags the rejected flag
