# cli-devin SWE-1.6 — Job A: Source-file regression reverts (P0 + P2)

## ROLE
You are a senior refactor surgeon. Perform exact, surgical edits on two source files plus one documentation count fix. Read-then-edit only. No exploratory tool use beyond what the pre-planning specifies.

Spec folder (pre-approved Gate 3): `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/` — skip Gate 3.

## CONTEXT

Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

**Finding-1 (P0 regression — INTRODUCED by an over-aggressive earlier sed pass)**:
- `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh` line 15 reads:
  ```
  bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/101-deep-ai-council-skill --strict
  ```
- The actual folder name on disk is `101-deep-multi-ai-council-skill` (NOT `101-deep-ai-council-skill`). The script will fail at runtime with "directory not found".

**Finding-2 (P2 — same regression, same root cause)**:
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts` line 106 contains a regex with the broken substring `101-deep-ai-council-skill`. The test currently passes incidentally but the assertion is testing the wrong path.

**Root cause**: An earlier sed pass `s/multi-ai-council/ai-council/g` over-converted the substring inside the folder name `101-deep-multi-ai-council-skill`. The packet folder is HISTORICAL and its name is frozen — these two files must be reverted to the correct path string.

**Finding-3 (P2 — count miscount)**:
- `.opencode/skills/system-spec-kit/references/cli/memory_handback.md` line 1 claims "shared across the five cli-* sibling skills" but line 8 (or thereabouts) enumerates only 4 sibling skills. Either the count or the list is wrong. The correct cli-* sibling count IS 5: `cli-claude-code`, `cli-codex`, `cli-devin`, `cli-gemini`, `cli-opencode`. Fix the enumeration to list all five.

## ACTION (pre-planning — execute in order)

### Step 1: P0 revert — test-council-matrix.sh
- **Read** `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh`.
- **Edit** line 15: replace the substring `101-deep-ai-council-skill` with `101-deep-multi-ai-council-skill`. Do NOT touch any other lines.
- **Acceptance**: `rg "101-deep-ai-council-skill" .opencode/skills/system-spec-kit/scripts/test-council-matrix.sh` returns zero matches; `rg "101-deep-multi-ai-council-skill" .opencode/skills/system-spec-kit/scripts/test-council-matrix.sh` returns exactly 1 match on line 15.

### Step 2: P2 revert — council-helpers-smoke.vitest.ts
- **Read** the file `.opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts`. Find line 106 (or nearby — search for the broken `101-deep-ai-council-skill` substring).
- **Edit** the matched line(s): replace `101-deep-ai-council-skill` with `101-deep-multi-ai-council-skill`. Do NOT touch any other content.
- **Acceptance**: `rg "101-deep-ai-council-skill" .opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts` returns zero matches; `rg "101-deep-multi-ai-council-skill" <same file>` returns at least 1 match.

### Step 3: P2 fix — memory_handback.md count miscount
- **Read** `.opencode/skills/system-spec-kit/references/cli/memory_handback.md`.
- Verify the line that claims "five cli-* sibling skills" exists. If the enumeration block lists only 4 (likely missing one of `cli-claude-code` / `cli-codex` / `cli-devin` / `cli-gemini` / `cli-opencode`), **edit** the enumeration to include all 5 cli-* siblings.
- **Acceptance**: rg the file and confirm exactly 5 distinct `cli-*` skill names appear in the cli-* sibling enumeration section (not counting other usages elsewhere in the file).

## FORMAT (bundle-gate STANDARD)

Emit a single fenced JSON block under heading `## BUNDLE` with this schema:
```json
{
  "edits": [
    {"file": "<path>", "line": <int>, "old_text": "<exact match>", "new_text": "<exact replacement>", "verification_command": "<shell command>"}
  ],
  "verification_summary": {
    "step_1": "PASS | FAIL <reason>",
    "step_2": "PASS | FAIL <reason>",
    "step_3": "PASS | FAIL <reason>"
  }
}
```

After the bundle, append a 50-100 word narrative confirming the three edits landed and the regression is reverted.

End of prompt.
