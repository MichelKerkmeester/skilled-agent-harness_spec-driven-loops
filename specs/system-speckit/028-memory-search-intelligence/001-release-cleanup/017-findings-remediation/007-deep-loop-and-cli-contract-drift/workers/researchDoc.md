[0m
> build · gpt-5.6-luna-fast
[0m
[0m→ [0mRead .opencode/commands/deep/research.md[90m [offset=130, limit=28][0m
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs[90m [offset=1118, limit=28][0m
[0m✱ [0mGrep "lineage-timeout-hours|LINEAGE_LIFETIME_HARD_MAX_HOURS"[90m in . · 69 matches[0m
The target documentation is stale: the runtime hard-caps the lineage lifetime at 4 hours and rejects overrides above that value. I’m changing only the owned `research.md` flag description.
[0m% [0mPatch 1 file
[0m→ [0mRead .opencode/commands/deep/research.md[90m [offset=140, limit=5][0m
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs[90m [offset=1128, limit=10][0m
[0m✱ [0mGrep "`--lineage-timeout-hours <N>`"[90m in .opencode/commands/deep/research.md · 1 match[0m
[0m
[0m$ [0mgit diff --check -- ".opencode/commands/deep/research.md" && git diff --name-only -- ".opencode/commands/deep/research.md"
.opencode/commands/deep/research.md
[0m
FINDING: X-3  
REVERIFIED: `git diff --check -- .opencode/commands/deep/research.md` passed; target lines show narrowing-only behavior and 4-hour maximum.  
STATUS: APPLIED  
CHANGE: Updated `.opencode/commands/deep/research.md` line 142 only.  
EVIDENCE: Runtime defines `LINEAGE_LIFETIME_HARD_MAX_HOURS = 4` and rejects overrides above it; documentation now matches.  
RISK: Documentation-only change; runtime unchanged. Diff check passed and only the owned file changed.
