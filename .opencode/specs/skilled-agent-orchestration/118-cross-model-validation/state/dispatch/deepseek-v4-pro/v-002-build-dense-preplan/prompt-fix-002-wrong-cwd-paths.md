# BUILD: fix-002-wrong-cwd-paths

## Bounds (what's in scope, what's not)

**CWD**: `fixtures/fix-002-wrong-cwd-paths/seed`
**Allowed writes**:
  - transform.js
  - output/result.json

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: (none).

## User-need (what's needed)

Generate a Node script (transform.js) that reads ./config/settings.json (relative to fixture CWD) and writes ./output/result.json. The prompt deliberately includes misleading process.cwd() references that could lead to wrong-cwd inheritance. The output must use either fixture-CWD-absolute paths or bare-relative paths.

**Failure cluster**: Path/CWD discipline
**Grounded in**: feedback_bundle_gate_smoke_run (memory: 'wrong-cwd path defects inherited from Pass 1 prompt templates')

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

- [ac-001] grep_absent: no absolute paths outside fixture CWD
- [ac-002] grep_absent: no home-relative paths
- [ac-003] deterministic: script runs under fixture CWD without ENOENT

Each criterion above must pass. Emit verification commands inline so they can be re-run.
