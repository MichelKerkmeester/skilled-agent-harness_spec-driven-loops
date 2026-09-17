## Verdict

Not safe to commit as applied. Legacy `.opencode` consumer paths are still missed by indexing, graph lookup, post-edit checks, and the doctor update workflow.

## Findings

| ID | Severity | File:line | Scenario | Suggested fix |
|---|---|---|---|---|
| W-001 | P1 | `.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts:215` | With default policy (`:148`), `.opencode/skills/sk-doc/SKILL.md` misses the matcher and returns `true` at `:262` instead of excluding the skill. This breaks the documented `.opencode`-only consumer layout (`PUBLIC-RELEASE.md:22`). | Match both `.skilled` and `.opencode` in the skill regex and default exclusion glob. |
| W-002 | P1 | `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:36` | In `/consumer` with only `.opencode`, dispatch builds `/consumer/.skilled/skills/.../check-comment-hygiene.sh` at `:176`; `runChecks` silently skips it when absent (`:352`). | Resolve `.skilled` when present and fall back to `.opencode`. |
| W-003 | P1 | `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:971` | For a consumer spec folder and candidate `runtime/lib/graph/graph-metadata-parser.ts`, lookup tries only `.skilled` (`:978-980`), so the valid file under the consumer’s `.opencode` link is dropped (`PUBLIC-RELEASE.md:22`). | Try both source-root names or select the existing root. |
| W-004 | P1 | `.skilled/commands/doctor/assets/doctor-update.yaml:177` | `/doctor:update` is loaded through `.opencode` (`.skilled/commands/doctor/update.md:24-25,45-50`), but its bootstrap command resolves `.skilled/...` from a consumer cwd where only `.opencode` exists. | Make workflow paths root-aware or retain `.opencode` for consumer-facing execution. |
Codex exit 0, 2026-09-17T17:17:58Z to 2026-09-17T17:31:33Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
