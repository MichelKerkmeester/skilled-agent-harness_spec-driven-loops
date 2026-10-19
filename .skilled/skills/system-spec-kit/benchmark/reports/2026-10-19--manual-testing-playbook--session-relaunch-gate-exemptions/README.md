# 2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions

> system-spec-kit · manual-testing-playbook · three CLI live runs · session relaunch · no Gate 3 answer · phase 007 code

---

## 1. OVERVIEW

**Verdict: PASS**

Run 10 is the only round in this folder. It repeats the conditions under which phase 006 recorded G20 and G21: each prompt carries no Gate 3 answer, and nothing in the prompt names a spec folder. Claude, Pi and OpenCode each prepared a handoff note, took SIGTERM, relaunched with the claim seed, and closed the note with `status: done`. Each wrapper then declined a further hop with `reason=no-file` and printed `WRAPPER_EXIT=0`. None of the three panes shows an operator question.

The three loops ran on overlapping clock times, between 11:34 and 11:43 UTC on 2026-10-19. The prepare-to-SIGTERM gaps were 7.8 s on Claude, 28.7 s on OpenCode and 113.6 s on Pi. The Pi gap is model time: the sending session re-read and checked its note after the prepare line, and the killer waited for the session to go idle as designed.

Codex is not in this round. Its live result stays in the phase 006 folder, [`../2026-10-19--manual-testing-playbook--session-relaunch-final-code/`](../2026-10-19--manual-testing-playbook--session-relaunch-final-code/README.md).

---

## 2. RUN

| Field | Value |
|---|---|
| Target skill | system-spec-kit |
| Scenarios | `session-relaunch-claude`, `session-relaunch-pi-opencode` |
| Executed | 2026-10-19, live run 10, between 11:34 and 11:43 UTC |
| Runtimes | cli-claude, cli-pi, cli-opencode |
| Code state | Phase 007 worktree state on `worktrees/142-session-relaunch-loop`, not committed. The changed files are `spec-gate-core.mjs`, its test file, `AGENTS.md` and `opencode.json`. |
| Dispatch models | Pi: `openai/gpt-6-luna`, which the pane footer shows as `gpt-6-luna [openai] · xhigh`. OpenCode: `llmgateway/deepseek-v4.1-flash` with variant `max`, the repo default, because the launch passed no `-m`. Claude: not recorded, because the launch passed no model flag and the pane shows no model. |
| Outcome tally | 3 PASS, 0 FAIL across 3 runs |
| Prompt | "Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready. The task: report the line count of .skilled/hooks/session-relaunch/README.md and name its first heading." No Gate 3 answer is in the prompt. |
| Shared settings | `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1` for all three launches |
| Claude launch | `skilled-loop claude '<prompt>'`, with no model flag |
| Pi launch | `skilled-loop pi --provider openai --model gpt-6-luna '<prompt>'` |
| OpenCode launch | `skilled-loop opencode --prompt '<prompt>'`, with no `-m`, so the repo default model ran |
| Source packet | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/` |
| Launch record | `launch-commands.txt`, 766 bytes, SHA-256 `102c3d8dbee787d1841824a596ec3fa22cc06a11bae43dceb3b79eea578ffc94`. It holds the prompt, the environment and the three launch lines. |

---

## 3. OUTCOMES

| Runtime | Run | Verdict | Operator inputs | Evidence | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| claude | 10 (`loopId=75693`) | PASS | None | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt` | 891 | `a7c82b89d5e76202d8e06e2ba5346ccf6f83a8de043ab343f0fddc44f76a3e02` |
| | | | | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-claude10-pane.txt` | 1012 | `a5ce1c31d13ad0012aff8c12094559a7656f261f04291e7857f4c5fdab5238ba` |
| pi | 10 (`loopId=75625`) | PASS | None | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt` | 891 | `a7c82b89d5e76202d8e06e2ba5346ccf6f83a8de043ab343f0fddc44f76a3e02` |
| | | | | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-pi10-pane.txt` | 92268 | `ea6bb7df97dbeb82a51544be3feabb6834826f5266c2dfe4737f31cdc6c941ad` |
| opencode | 10 (`loopId=75633`) | PASS | None | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt` | 891 | `a7c82b89d5e76202d8e06e2ba5346ccf6f83a8de043ab343f0fddc44f76a3e02` |
| | | | | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-oc10-pane.txt` | 1096 | `ac04844635d60e58a451004faa20d375a362a380b726dcaefd7db956f446f9ec` |
| all three | 10 | - | - | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/launch-commands.txt` | 766 | `102c3d8dbee787d1841824a596ec3fa22cc06a11bae43dceb3b79eea578ffc94` |

Claude: prepare at 11:34:56.858Z, SIGTERM at 11:35:04.649Z, 7.8 s later, and relaunch reason `ready` at 11:35:05.362Z. The note `20261019T113443Z-6f63a2a7.md` reads `status: done`, with `claimed_at` 11:35:17.030Z and `completed_at` 11:35:21.804Z. Its `spec_folder` field is empty, which shows that no Gate 3 answer was carried into the hop. The wrapper printed `WRAPPER_EXIT=0` (pane line 11), and the decline came at 11:40:02.412Z with `reason=no-file`. The receiver capture taken before the exit, `sr-claude10-receiver-pane.txt`, shows the answer: 248 lines, first heading `# Session Relaunch`.

OpenCode: prepare at 11:36:42.504Z, SIGTERM at 11:37:11.232Z, 28.7 s later, and relaunch reason `ready` at 11:37:11.456Z. The note `20261019T113449Z-ses_eac0.md` reads `status: done`, with `claimed_at` 11:37:23.891Z and `completed_at` 11:37:46.762Z. The wrapper printed `WRAPPER_EXIT=0` (pane line 17), and the decline came at 11:42:21.961Z with `reason=no-file`. The receiver capture taken before the exit, `sr-oc10-receiver-pane.txt`, shows the answer: 248 lines, first heading `# Session Relaunch`.

Pi: prepare at 11:37:06.308Z, SIGTERM at 11:38:59.883Z, 113.6 s later, and relaunch reason `ready` at 11:39:00.386Z. The receiving session ran `awk 'END { print NR }'` on the README, which printed 248 (pane line 1062), then ran `complete`, which printed no output, and reported "Completed handoff". The note `20261019T113650Z-01a153f1.md` reads `status: done`, with `completed_at` 11:39:46.760Z. The wrapper printed `WRAPPER_EXIT=0` (pane line 1110), and the decline came at 11:40:02.015Z with `reason=no-file`.

Operator prompts: the count of `ask_user_question` and `AskUserQuestion` calls is 0 in each of the three pane captures. The Pi pane has no `compiled-route` call, so the Gate 2 artifact trigger never reached the sk-doc router in this run. Its only mention of a clarification is a status line, "Clarifying the session trigger" (line 612), which is not a question to the operator.

---

## 4. FILES

| File | Contents |
|---|---|
| [`outcomes/`](./outcomes/) | One outcome JSON per runtime, listing run 10 with its verdict, operator inputs and evidence byte counts and SHA-256 values |
| [`results.csv`](./results.csv) | One row per run |
| [`source.md`](./source.md) | Where the raw evidence for this run lives, and what the captures do not hold |
