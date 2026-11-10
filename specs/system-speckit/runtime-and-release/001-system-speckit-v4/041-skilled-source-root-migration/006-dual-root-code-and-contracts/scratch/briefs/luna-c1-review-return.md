## Verdict

The capped fallback can return an ancestor instead of the repository root, and two added edge-case rows pass on the parent commit, so C1 is not fully proven.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-001 | P1 | `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:59-65,79-89` | With repository root `/tmp/.skilled/outer/repo`, sentinel at `/tmp/.skilled/outer/repo/.opencode/skills/system-spec-kit/SKILL.md`, and start `/tmp/.skilled/outer/repo/.opencode/skills/system-spec-kit/runtime` with `{ maxDepth: 2 }`, the capped walk misses the sentinel and the fallback returns `/tmp`, not `/tmp/.skilled/outer/repo`. | Add an ancestor-aware capped-walk fallback and a regression row for this shape. |
| F-002 | P2 | `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts:149-153` | The `ancestor named .skilled` row uses a real `.opencode` tree, so the parent implementation already finds the sentinel and passes the assertion unchanged (`repo-root.mjs:59-69`). | Use a `.skilled`-only child or an explicit `.skilled` sentinel so the row fails before this change. |
| F-003 | P2 | `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts:133-138` | The look-alike path contains no exact `.skilled` or `.opencode` segment, so the parent implementation already returns `null` and the unchanged start directory (`repo-root.mjs:38-45,59-69`). | Pair the negative look-alike case with an exact `.skilled` segment in the same fixture, proving exact matching is required. |
Codex exit 0, 2026-09-17T09:54:53Z to 2026-09-17T10:02:07Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
