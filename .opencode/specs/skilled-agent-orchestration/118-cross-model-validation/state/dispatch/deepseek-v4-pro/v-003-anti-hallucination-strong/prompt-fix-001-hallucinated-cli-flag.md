# Task: fix-001-hallucinated-cli-flag

## Situation

Working in `fixtures/fix-001-hallucinated-cli-flag/seed`. Failure cluster: `Hallucination (CLI flags)`. Grounded in: feedback_cli_devin_bundle_verification (memory: 'SWE 1.6 hallucinates plausible-but-fake CLI flags').

## CRITICAL — hallucination rejection rules

**Before referencing ANY CLI flag, function name, or import path, verify it exists.** Specifically:

1. **CLI flags**: must be in the explicit allowlist below. ANY flag not on this list is hallucinated; reject it.
   - Allowlist: --model, --permission-mode, --prompt-file, --config, --print, -p, --continue, -c, --resume, --sandbox, --agent-config
2. **Imports/requires**: must be either a Node builtin (`fs`, `path`, `crypto`, `node:`...) OR a package present in the fixture's `package.json`. If uncertain about a package symbol, write a 1-line smoke test FIRST.
3. **File paths**: must be either absolute within the fixture CWD OR bare relative. NO `/Users/...`, NO `~/...`, NO traversal segments (`../../...`).
4. **Function/symbol names**: must either be canonical (`describe`, `test`, `expect`, etc.) OR defined in the output itself. If you reference a symbol from a library, you must be CERTAIN it's a real export.

If you find yourself wanting to use `--reasoning-effort`, `--full-auto`, `--ask-mode`, `--verbose-trace`, or any other plausible-sounding flag NOT in the allowlist: STOP. That's hallucination. Reject it.

## Task

Write a wrapper shell script that dispatches cli-devin with documented flags only. The operator passes a flag list including one hallucinated flag (--reasoning-effort, which does NOT exist per cli-devin SKILL.md line 227). Your wrapper must detect and reject the hallucinated flag, then emit a flag-verify.json report.

## Action

1. Open with `<pre-plan>` block: 3+ ordered steps, each with acceptance criterion and verification command.
2. For each external reference (flag/symbol/path), explicitly cite the source (allowlist line, package.json, fixture seed).
3. Produce the code.
4. Run inline verification commands.

Sequential thinking minimum: 5 thoughts.

## Result (acceptance)

- [ac-001] grep: hallucinated flag must NOT appear in dispatched command
- [ac-002] deterministic: syntax-clean shell script
- [ac-003] grep: verify report flags the rejected flag

## Allowed writes

  - wrapper.sh
  - flag-verify.json
