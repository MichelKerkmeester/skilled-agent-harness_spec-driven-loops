<!-- dispatch: opencode CP-003; ledger: 2026-09-26T22:12:34Z 2026-09-26T22:19:55Z 0 441 -->

Running scenario CP-003. Step 0: the Advisor line from my runtime context is captured. Now executing the test steps in order.
Step 1 matches (empty recommendations, `freshness: "unavailable"`, `ADVISOR_DISABLED`, exit 0). Step 2:
Step 2 matches (`[]`, exit 0). Step 3:
Step 3 matches (opt-out tests pass, exit 0). Step 4:
All four steps ran. Verifying no repository files were touched before writing the evidence record:
The `db` line at the end suggests a `/tmp/cp003.*` sandbox may still exist. Checking before I write the report:
Leftover `/tmp/cp003.FiCk1j/db` from my step-1 sandbox. Checking whether anything still holds it, then removing it (no process will be killed):
No process holds the leftover sandbox (lsof empty; my sandbox daemon already exited). Removing it per my cleanup rule:
A new `/tmp/cp003.thIEtC` appeared that is not mine (mine was `cp003.FiCk1j`). Inspecting before touching anything:
RESULT: PASS | scenario=CP-003 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| --- | --- | --- | --- | --- | --- |
| 1 | skill-advisor.cjs advisor_recommend, sandbox socket+DB, HOOK_DISABLED=1 | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, `warnings: ["ADVISOR_DISABLED"]`, abstain "Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED." | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED` | Yes |
| 2 | python3 skill_advisor.py "help me commit my changes", HOOK_DISABLED=1 | 0 | prints `[]` | `[]` or prompt-safe disabled output without native scoring | Yes |
| 3 | npm --prefix …/runtime run test -- …-plugin.vitest.ts -t "opt-out" | 0 | Test Files 1 passed; Tests 3 passed \| 62 skipped (env opt-out cases) | Plugin disabled/skipped without invoking advisor (covered by env opt-out test case) | Yes |
| 4 | printf prompt JSON \| user-prompt-submit.js, HOOK_DISABLED=1 SKILL_ADVISOR_DEBUG=1 | 0 | stdout `{}`; diagnostic lines 259 -> 260; last line `{"timestamp":"2026-09-26T22:15:29.282Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false}` | `{}`, exit 0, JSONL gains one line, newest record `status: "skipped"` and `freshness: "unavailable"` | Yes |
DEVIATIONS: Steps 1–3: appended `echo "Exit: $?"` after the primary command so the exit code the report requires could be read; no other change to the blocks. No step skipped.
NOTES: Failure-mode checks: no surface returned a non-empty recommendation, and no disabled output contained the prompt literal "help me commit my changes". Step 4's diagnostics JSONL lives outside the repo (`/var/folders/.../T/speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl`), so the append wrote nothing into the repository; the file was at 259 lines (scenario's recording shows 229, counts accumulate) and stayed under the 300-line trim threshold. Step 1's block ran its own `rm -rf`, but the sandbox daemon recreated `/tmp/cp003.FiCk1j/db/skill-graph-generation.json` after teardown; I removed that leftover (no process held it, lsof empty). A foreign sandbox `/tmp/cp003.thIEtC` (created 00:17:34, same shape) appeared from a concurrent sibling CP-003 runner during cleanup and was deliberately left untouched. `git status` shows a large pre-existing dirty tree from prior/parallel work; none of it was created by this run, and no repo file was written, edited, staged or committed.
