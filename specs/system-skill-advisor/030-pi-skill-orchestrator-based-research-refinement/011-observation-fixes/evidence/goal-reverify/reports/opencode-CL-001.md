<!-- dispatch: opencode CL-001; ledger: 2026-09-27T13:48:20Z 2026-09-27T13:53:17Z 0 297 -->

I'll start with STEP 0 (NATIVE line recorded from the runtime context), then read the scenario file.
Scenario file read. Now checking preconditions and resolving the diagnostics path.
Preconditions pass. Step 1 (build) is skipped per orchestrator. Running Step 2 (shim call with diagnostics count).
Step 2 matches. Running Step 3 (inner hook stderr channel).
Step 3 matches. Now the extra casual-prompt run (`thanks`) through the same compiled hook (shipped spec-kit shim, step 2's hook), recording the first line of `additionalContext`.
Hook ran fine (exit 0); my one-liner used `require` in ESM scope. Reading the captured stdout directly.
All signals match. Verifying no repo writes, then cleaning up temp files before the report.
RESULT: PASS | scenario=CL-001 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | npm --prefix .skilled/skills/system-spec-kit/runtime run build | n/a | not run | Advisor runtime build is current | n/a (skipped) |
| 2 | SKILL_ADVISOR_DEBUG=1 node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js (payload "help me commit my changes") | 0 | stdout JSON contains hookSpecificOutput.additionalContext starting "Advisor: live; use sk-git 0.95/0.12 pass."; shim stderr bytes: 0; diagnostic lines 276 -> 277; last record {"runtime":"claude","status":"ok","freshness":"live","durationMs":837,"cacheHit":false,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}; grep -c prompt literal: 0 | Exit 0; additionalContext starts with Advisor: + freshness word live/stale; shim stderr 0; AFTER = BEFORE + 1; newest record has runtime "claude", emittedBytes, directivesSuppressed; prompt literal 0 times in JSONL | yes |
| 3 | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js (same payload) | 0 | stderr JSONL record {"timestamp":"2026-09-27T13:50:03.751Z","runtime":"claude","status":"ok","freshness":"live","durationMs":767,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}; grep -c prompt literal: 0 | Inner hook stderr carries the same record shape; raw prompt literal absent (0 matches) | yes |
| 4 | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js (payload "thanks", casual run) | 0 | first line of additionalContext: "Advisor: prompt skipped." | "Advisor: prompt skipped." | yes |
DEVIATIONS: step 1 skipped: prebuilt by orchestrator. Steps 2-4 capture files written to the scenario's literal /tmp/skill-advisor-playbook instead of a mktemp -d dir (the scenario names that path verbatim); the directory was deleted after the run.
NOTES: The casual-prompt run (step 4) used the shipped spec-kit shim from step 2 as "the same compiled hook"; the inner advisor hook path was not used for that run. My first stdout-parser one-liner for step 4 failed with "ReferenceError: require is not defined in ES module scope" (my scripting error, not a hook failure) — the hook run itself exited 0 and the captured stdout was then parsed successfully. Diagnostics count 276 -> 277 is below the 300-line trim threshold, so the count check is valid rather than trim-skewed. grep -c printing 0 exits 1 by normal grep semantics; the scenario's "Exit: 0" is the hook pipeline's exit captured immediately after it. Preconditions confirmed before running: SPECKIT_SKILL_ADVISOR_HOOK_DISABLED unset, both dist hook scripts present, DIAG resolved to /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl (outside the repository). The repository had pre-existing modified and untracked files unrelated to this run; this run wrote nothing inside the repository.
