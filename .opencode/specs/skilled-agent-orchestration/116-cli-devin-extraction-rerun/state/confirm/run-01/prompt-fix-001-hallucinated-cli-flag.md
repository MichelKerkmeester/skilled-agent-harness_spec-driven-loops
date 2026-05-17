# Task (fix-001-hallucinated-cli-flag)

**Situation**: You're working in `fixtures/fix-001-hallucinated-cli-flag/seed` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `Hallucination (CLI flags)`. Grounded in: feedback_cli_devin_bundle_verification (memory: 'SWE 1.6 hallucinates plausible-but-fake CLI flags').

**Task**: Write a wrapper shell script that dispatches cli-devin with documented flags only. The operator passes a flag list including one hallucinated flag (--reasoning-effort, which does NOT exist per cli-devin SKILL.md line 227). Your wrapper must detect and reject the hallucinated flag, then emit a flag-verify.json report.

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

  - wrapper.sh
  - flag-verify.json

## Acceptance criteria

- [ac-001] grep: hallucinated flag must NOT appear in dispatched command
- [ac-002] deterministic: syntax-clean shell script
- [ac-003] grep: verify report flags the rejected flag

## Allowlist for CLI flags (use only these)

--model, --permission-mode, --prompt-file, --config, --print, -p, --continue, -c, --resume, --sandbox, --agent-config

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
