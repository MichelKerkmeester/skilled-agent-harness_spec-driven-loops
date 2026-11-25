# Iteration 6: OpenCode

## Focus
Audit the OpenCode notes against current version resolution, setup modes, plugin entry points, CI pinning, and shell-shim pass-through behavior. The strategy paired OpenCode with Browser Use; this pass selected OpenCode as the narrower section and deferred Browser Use.

## Findings
1. **MISSING — P2:** Session handover now resolves a goal packet that exists only in a linked worktree, records its `goal_root`, carries it to a Claude receiver from that worktree, and leaves it out for other runtimes with a warning to avoid binding a stale copy. This user-visible cross-runtime behavior is absent from the release notes' OpenCode and Skills and Worktrees sections. Commit `12fe3abc66b48bab326a08b08accbc3c2c00f8ef`; current resolver/recorder/receiver paths are `.skilled/hooks/session-handover/lib/relaunch-core.cjs:584-591`, `.skilled/hooks/session-handover/bin/session-handover.cjs:419-421,897`, and `.skilled/bin/skilled-loop:483-487,1460-1477`; related release-note sections are `.skilled/changelog/skilled/v4.2.0.0.md:635-681,727-748` [SOURCE: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:584-591`; `.skilled/hooks/session-handover/bin/session-handover.cjs:419-421,897`; `.skilled/bin/skilled-loop:483-487,1460-1477`; `.skilled/changelog/skilled/v4.2.0.0.md:635-681,727-748`; `12fe3abc66b48bab326a08b08accbc3c2c00f8ef`].

## Ruled Out
The checked OpenCode claims match current code: the setup helper accepts only `v2` and `check` and pins 2.3.2; the v2 resolver reports other majors as unknown; the dispatch guard applies all rules to an unknown family; the plugin builder is `definePlugin`; the shell shim lists 18 OpenCode 2.3.2 subcommands and passes `--completions`; the battery workflow pins 2.3.2. No separate drift or breakage was confirmed in these claims.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: the strategy paired OpenCode and Browser Use; OpenCode was selected as the narrower current section, with Browser Use deferred.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `steer.md` (checked before iteration; absent)
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-config.json`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-state.jsonl`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-strategy.md`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt`
- `.skilled/changelog/skilled/v4.2.0.0.md:635-681,727-748`
- `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28,301-329`
- `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:119-125,184-208`
- `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:17-23,223-251`
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:49-53,1101-1124`
- `.opencode/plugins/lib/v2-bridge.js:327`
- `.skilled/bin/skilled-loop-shell.sh:127-138,189-192`
- `.github/workflows/opencode-v2-battery.yml:79,123-144`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:584-591`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:419-421,897`
- `.skilled/bin/skilled-loop:483-487,1460-1477`
- Commit `12fe3abc66b48bab326a08b08accbc3c2c00f8ef`

## Assessment
- New information ratio: 1.0
- Questions addressed: OpenCode note claims compared with current code; recent session-handover change checked for coverage in OpenCode and Skills and Worktrees sections.
- Questions answered: none of the global questions; one cross-section omission was confirmed.

## Reflection
- What worked and why: Comparing the late session-handover commit with current receiver behavior and searching the full release notes showed its linked-worktree goal carry is not mentioned, while direct source reads matched the explicit OpenCode claims.
- What did not work and why: A broad retired-name search was dominated by historical changelogs and benchmark artifacts; filtering to current runtime files and note claims was more useful.
- What I would do differently: Use the Browser Use section's named hub and packet paths first, then check recent commits for changes made after its note was written.

## Recommended Next Focus
Audit Browser Use notes against the current `mcp-browser-use` hub and the recent browser-hub packet; then cover Skills and Worktrees, How It Was Checked, and Upgrade Notes.
