# BUILD: fix-001-hallucinated-cli-flag

## Bounds (what's in scope, what's not)

**CWD**: `fixtures/fix-001-hallucinated-cli-flag/seed`
**Allowed writes**:
  - wrapper.sh
  - flag-verify.json

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: --model, --permission-mode, --prompt-file, --config, --print, -p, --continue, -c, --resume, --sandbox, --agent-config.

## User-need (what's needed)

Write a wrapper shell script that dispatches cli-devin with documented flags only. The operator passes a flag list including one hallucinated flag (--reasoning-effort, which does NOT exist per cli-devin SKILL.md line 227). Your wrapper must detect and reject the hallucinated flag, then emit a flag-verify.json report.

**Failure cluster**: Hallucination (CLI flags)
**Grounded in**: feedback_cli_devin_bundle_verification (memory: 'SWE 1.6 hallucinates plausible-but-fake CLI flags')

## Implementation plan (dense — every step has acceptance + verification)

Begin with `<pre-plan>` block containing AT LEAST 4 ordered steps. Each step MUST include:
- Inputs (state of files at this point)
- Outputs (state after this step)
- Acceptance criterion (specific, checkable)
- Verification command (executable)
- Stop condition (when to halt this step)

Sequential thinking minimum: 8 thoughts before producing any output.

## Limits (what NOT to do)

- Do not write absolute paths outside the fixture CWD
- Do not invent CLI flags; verify against allowlist before use
- Do not touch files outside the allowed-writes list (scope-creep is a hard fail)
- Do not assume libraries exist; if uncertain, smoke-run a 1-line import test first

## Done-when (acceptance)

- [ac-001] grep: hallucinated flag must NOT appear in dispatched command
- [ac-002] deterministic: syntax-clean shell script
- [ac-003] grep: verify report flags the rejected flag

Each criterion above must pass. Emit verification commands inline so they can be re-run.
