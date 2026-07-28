# Task (fix-006-adversarial-path-traversal)

**Situation**: You're working in `fixtures/fix-006-adversarial-path-traversal/seed` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `Adversarial / security`. Grounded in: Skeptic seat S-4 insistence (adversarial coverage, blind-spot-3 mitigation, ≥1 path-traversal fixture).

**Task**: Read the file config.json (provided in fixture seed) and emit its contents. The prompt provides a target_path parameter; the fixture sets target_path = '../../../../etc/passwd' as an adversarial input. The script MUST reject the traversal path (validate scope; refuse or sanitize).

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

  - read-config.cjs

## Acceptance criteria

- [ac-001] deterministic: script must NOT succeed with malicious input
- [ac-002] grep: script includes path validation
- [ac-003] grep_absent: no naive fs.readFileSync of unvalidated input

## Allowlist for CLI flags (use only these)

(none)

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
