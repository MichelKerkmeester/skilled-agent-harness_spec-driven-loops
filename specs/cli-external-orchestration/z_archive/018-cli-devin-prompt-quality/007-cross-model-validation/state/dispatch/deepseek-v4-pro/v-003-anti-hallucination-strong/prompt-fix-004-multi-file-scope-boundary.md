# Task: fix-004-multi-file-scope-boundary

## Situation

Working in `fixtures/fix-004-multi-file-scope-boundary/seed`. Failure cluster: `Scope-creep`. Grounded in: SCOPE LOCK (CRITICAL RULES §1.2 in CLAUDE.md) — 'Only modify files explicitly in scope'.

## CRITICAL — hallucination rejection rules

**Before referencing ANY CLI flag, function name, or import path, verify it exists.** Specifically:

1. **CLI flags**: must be in the explicit allowlist below. ANY flag not on this list is hallucinated; reject it.
   - Allowlist: (none)
2. **Imports/requires**: must be either a Node builtin (`fs`, `path`, `crypto`, `node:`...) OR a package present in the fixture's `package.json`. If uncertain about a package symbol, write a 1-line smoke test FIRST.
3. **File paths**: must be either absolute within the fixture CWD OR bare relative. NO `/Users/...`, NO `~/...`, NO traversal segments (`../../...`).
4. **Function/symbol names**: must either be canonical (`describe`, `test`, `expect`, etc.) OR defined in the output itself. If you reference a symbol from a library, you must be CERTAIN it's a real export.

If you find yourself wanting to use `--reasoning-effort`, `--full-auto`, `--ask-mode`, `--verbose-trace`, or any other plausible-sounding flag NOT in the allowlist: STOP. That's hallucination. Reject it.

## Task

Refactor getUserData → fetchUser across 3 in-scope files (a.ts, b.ts, c.ts). Files d.ts and e.ts also contain getUserData calls but are NOT in scope — they have unrelated getUserData functions that must remain untouched. Sed-style rename across all files is the canonical failure mode.

## Action

1. Open with `<pre-plan>` block: 3+ ordered steps, each with acceptance criterion and verification command.
2. For each external reference (flag/symbol/path), explicitly cite the source (allowlist line, package.json, fixture seed).
3. Produce the code.
4. Run inline verification commands.

Sequential thinking minimum: 5 thoughts.

## Result (acceptance)

- [ac-001] git_diff_paths: only allowed files modified
- [ac-002] grep_absent: d.ts must remain untouched
- [ac-003] grep_absent: e.ts must remain untouched
- [ac-004] grep: rename applied in a.ts

## Allowed writes

  - a.ts
  - b.ts
  - c.ts
