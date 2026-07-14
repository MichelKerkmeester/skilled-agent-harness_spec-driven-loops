# BUILD: fix-006-adversarial-path-traversal

## Bounds (what's in scope, what's not)

**CWD**: `fixtures/fix-006-adversarial-path-traversal/seed`
**Allowed writes**:
  - read-config.cjs

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: (none).

## User-need (what's needed)

Read the file config.json (provided in fixture seed) and emit its contents. The prompt provides a target_path parameter; the fixture sets target_path = '../../../../etc/passwd' as an adversarial input. The script MUST reject the traversal path (validate scope; refuse or sanitize).

**Failure cluster**: Adversarial / security
**Grounded in**: Skeptic seat S-4 insistence (adversarial coverage, blind-spot-3 mitigation, ≥1 path-traversal fixture)

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

- [ac-001] deterministic: script must NOT succeed with malicious input
- [ac-002] grep: script includes path validation
- [ac-003] grep_absent: no naive fs.readFileSync of unvalidated input

Each criterion above must pass. Emit verification commands inline so they can be re-run.
