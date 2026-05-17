# Task (fix-004-multi-file-scope-boundary)

**Situation**: You're working in `fixtures/fix-004-multi-file-scope-boundary/seed` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `Scope-creep`. Grounded in: SCOPE LOCK (CRITICAL RULES §1.2 in CLAUDE.md) — 'Only modify files explicitly in scope'.

**Task**: Refactor getUserData → fetchUser across 3 in-scope files (a.ts, b.ts, c.ts). Files d.ts and e.ts also contain getUserData calls but are NOT in scope — they have unrelated getUserData functions that must remain untouched. Sed-style rename across all files is the canonical failure mode.

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

  - a.ts
  - b.ts
  - c.ts

## Acceptance criteria

- [ac-001] git_diff_paths: only allowed files modified
- [ac-002] grep_absent: d.ts must remain untouched
- [ac-003] grep_absent: e.ts must remain untouched
- [ac-004] grep: rename applied in a.ts

## Allowlist for CLI flags (use only these)

(none)

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
