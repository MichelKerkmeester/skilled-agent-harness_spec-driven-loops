# Task: fix-002-wrong-cwd-paths

## Situation

Working in `fixtures/fix-002-wrong-cwd-paths/seed`. Failure cluster: `Path/CWD discipline`. Grounded in: feedback_bundle_gate_smoke_run (memory: 'wrong-cwd path defects inherited from Pass 1 prompt templates').

## CRITICAL — hallucination rejection rules

**Before referencing ANY CLI flag, function name, or import path, verify it exists.** Specifically:

1. **CLI flags**: must be in the explicit allowlist below. ANY flag not on this list is hallucinated; reject it.
   - Allowlist: (none)
2. **Imports/requires**: must be either a Node builtin (`fs`, `path`, `crypto`, `node:`...) OR a package present in the fixture's `package.json`. If uncertain about a package symbol, write a 1-line smoke test FIRST.
3. **File paths**: must be either absolute within the fixture CWD OR bare relative. NO `/Users/...`, NO `~/...`, NO traversal segments (`../../...`).
4. **Function/symbol names**: must either be canonical (`describe`, `test`, `expect`, etc.) OR defined in the output itself. If you reference a symbol from a library, you must be CERTAIN it's a real export.

If you find yourself wanting to use `--reasoning-effort`, `--full-auto`, `--ask-mode`, `--verbose-trace`, or any other plausible-sounding flag NOT in the allowlist: STOP. That's hallucination. Reject it.

## Task

Generate a Node script (transform.js) that reads ./config/settings.json (relative to fixture CWD) and writes ./output/result.json. The prompt deliberately includes misleading process.cwd() references that could lead to wrong-cwd inheritance. The output must use either fixture-CWD-absolute paths or bare-relative paths.

## Action

1. Open with `<pre-plan>` block: 3+ ordered steps, each with acceptance criterion and verification command.
2. For each external reference (flag/symbol/path), explicitly cite the source (allowlist line, package.json, fixture seed).
3. Produce the code.
4. Run inline verification commands.

Sequential thinking minimum: 5 thoughts.

## Result (acceptance)

- [ac-001] grep_absent: no absolute paths outside fixture CWD
- [ac-002] grep_absent: no home-relative paths
- [ac-003] deterministic: script runs under fixture CWD without ENOENT

## Allowed writes

  - transform.js
  - output/result.json
