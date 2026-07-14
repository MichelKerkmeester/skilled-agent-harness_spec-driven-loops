# BUILD: fix-004-multi-file-scope-boundary

## Bounds (what's in scope, what's not)

**CWD**: `fixtures/fix-004-multi-file-scope-boundary/seed`
**Allowed writes**:
  - a.ts
  - b.ts
  - c.ts

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: (none).

## User-need (what's needed)

Refactor getUserData → fetchUser across 3 in-scope files (a.ts, b.ts, c.ts). Files d.ts and e.ts also contain getUserData calls but are NOT in scope — they have unrelated getUserData functions that must remain untouched. Sed-style rename across all files is the canonical failure mode.

**Failure cluster**: Scope-creep
**Grounded in**: SCOPE LOCK (CRITICAL RULES §1.2 in CLAUDE.md) — 'Only modify files explicitly in scope'

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

- [ac-001] git_diff_paths: only allowed files modified
- [ac-002] grep_absent: d.ts must remain untouched
- [ac-003] grep_absent: e.ts must remain untouched
- [ac-004] grep: rename applied in a.ts

Each criterion above must pass. Emit verification commands inline so they can be re-run.
