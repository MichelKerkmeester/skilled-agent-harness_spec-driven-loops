# BUILD: fix-003-bundle-gate-smoke-run

## Bounds (what's in scope, what's not)

**CWD**: `fixtures/fix-003-bundle-gate-smoke-run/seed`
**Allowed writes**:
  - scripts/check.cjs
  - package.json

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: (none).

## User-need (what's needed)

Build a Node script scripts/check.cjs that imports vitest/config and calls defineConfig({}). The validation_command IS the acceptance check: running the script must exit 0. If SWE 1.6 invents a non-existent vitest export, grep-only gate passes but smoke-run fails — this fixture explicitly tests the 3-layer check.

**Failure cluster**: Bundle-gate 3-layer
**Grounded in**: feedback_bundle_gate_smoke_run (memory: verbatim — Phase B shipped 2 P0s past grep-only gate)

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

- [ac-001] deterministic: smoke-run IS the acceptance (Layer 3 of bundle-gate)
- [ac-002] grep: must import real vitest/config (Layer 1)

Each criterion above must pass. Emit verification commands inline so they can be re-run.
