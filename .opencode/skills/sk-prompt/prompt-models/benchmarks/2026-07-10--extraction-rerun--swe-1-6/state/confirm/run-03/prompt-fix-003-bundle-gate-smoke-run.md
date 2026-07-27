# Task (fix-003-bundle-gate-smoke-run)

**Situation**: You're working in `fixtures/fix-003-bundle-gate-smoke-run/seed` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `Bundle-gate 3-layer`. Grounded in: feedback_bundle_gate_smoke_run (memory: verbatim — Phase B shipped 2 P0s past grep-only gate).

**Task**: Build a Node script scripts/check.cjs that imports vitest/config and calls defineConfig({}). The validation_command IS the acceptance check: running the script must exit 0. If SWE 1.6 invents a non-existent vitest export, grep-only gate passes but smoke-run fails — this fixture explicitly tests the 3-layer check.

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

  - scripts/check.cjs
  - package.json

## Acceptance criteria

- [ac-001] deterministic: smoke-run IS the acceptance (Layer 3 of bundle-gate)
- [ac-002] grep: must import real vitest/config (Layer 1)

## Allowlist for CLI flags (use only these)

(none)

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
