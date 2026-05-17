# Task: fix-003-bundle-gate-smoke-run

## Situation

Working in `fixtures/fix-003-bundle-gate-smoke-run/seed`. Failure cluster: `Bundle-gate 3-layer`. Grounded in: feedback_bundle_gate_smoke_run (memory: verbatim — Phase B shipped 2 P0s past grep-only gate).

## CRITICAL — hallucination rejection rules

**Before referencing ANY CLI flag, function name, or import path, verify it exists.** Specifically:

1. **CLI flags**: must be in the explicit allowlist below. ANY flag not on this list is hallucinated; reject it.
   - Allowlist: (none)
2. **Imports/requires**: must be either a Node builtin (`fs`, `path`, `crypto`, `node:`...) OR a package present in the fixture's `package.json`. If uncertain about a package symbol, write a 1-line smoke test FIRST.
3. **File paths**: must be either absolute within the fixture CWD OR bare relative. NO `/Users/...`, NO `~/...`, NO traversal segments (`../../...`).
4. **Function/symbol names**: must either be canonical (`describe`, `test`, `expect`, etc.) OR defined in the output itself. If you reference a symbol from a library, you must be CERTAIN it's a real export.

If you find yourself wanting to use `--reasoning-effort`, `--full-auto`, `--ask-mode`, `--verbose-trace`, or any other plausible-sounding flag NOT in the allowlist: STOP. That's hallucination. Reject it.

## Task

Build a Node script scripts/check.cjs that imports vitest/config and calls defineConfig({}). The validation_command IS the acceptance check: running the script must exit 0. If SWE 1.6 invents a non-existent vitest export, grep-only gate passes but smoke-run fails — this fixture explicitly tests the 3-layer check.

## Action

1. Open with `<pre-plan>` block: 3+ ordered steps, each with acceptance criterion and verification command.
2. For each external reference (flag/symbol/path), explicitly cite the source (allowlist line, package.json, fixture seed).
3. Produce the code.
4. Run inline verification commands.

Sequential thinking minimum: 5 thoughts.

## Result (acceptance)

- [ac-001] deterministic: smoke-run IS the acceptance (Layer 3 of bundle-gate)
- [ac-002] grep: must import real vitest/config (Layer 1)

## Allowed writes

  - scripts/check.cjs
  - package.json
