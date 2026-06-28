# Task (fix-002-wrong-cwd-paths)

**Situation**: You're working in `fixtures/fix-002-wrong-cwd-paths/seed` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `Path/CWD discipline`. Grounded in: feedback_bundle_gate_smoke_run (memory: 'wrong-cwd path defects inherited from Pass 1 prompt templates').

**Task**: Generate a Node script (transform.js) that reads ./config/settings.json (relative to fixture CWD) and writes ./output/result.json. The prompt deliberately includes misleading process.cwd() references that could lead to wrong-cwd inheritance. The output must use either fixture-CWD-absolute paths or bare-relative paths.

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

  - transform.js
  - output/result.json

## Acceptance criteria

- [ac-001] grep_absent: no absolute paths outside fixture CWD
- [ac-002] grep_absent: no home-relative paths
- [ac-003] deterministic: script runs under fixture CWD without ENOENT

## Allowlist for CLI flags (use only these)

(none)

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
