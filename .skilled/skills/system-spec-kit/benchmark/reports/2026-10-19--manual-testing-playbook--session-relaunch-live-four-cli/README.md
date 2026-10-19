# 2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli

> system-spec-kit · manual-testing-playbook · four CLI live runs · session relaunch

---

## 1. OVERVIEW

**Verdict: PASS after fixes**

The two FAIL rows are OpenCode runs 1 and 2 on earlier code, and the final-code round is recorded in [`2026-10-19--manual-testing-playbook--session-relaunch-final-code/`](../2026-10-19--manual-testing-playbook--session-relaunch-final-code/README.md).

Thirteen live runs of the session relaunch checks under four runtimes, in a clean tmux environment driving `skilled-loop`. Claude passed three times with no operator input. Pi hopped four times and passed each, and its fifth run finished the task in the sending session without a hop. Codex passed both runs. OpenCode passed once in three runs: run 1 left its note open after guessing the CLI syntax, and run 2 claimed the note correctly and then reported the wrong file.

Two OpenCode runs failed and one Pi run recorded a receiver that was killed and declined at the hop cap. Raw pane captures and relaunch logs stay in the source packet, named in `source.md`.

---

## 2. RUN

| Field | Value |
|---|---|
| Target skill | system-spec-kit |
| Scenarios | `session-relaunch-claude`, `session-relaunch-pi-opencode`, `session-relaunch-command-runtimes` |
| Executed | 2026-10-19 |
| Runtimes | cli-claude, cli-pi, cli-opencode, cli-codex |
| Dispatch models | claude Opus 5.5 with high effort, pi and opencode openai/gpt-6-luna, codex gpt-6-luna max fast |
| Outcome tally | 11 PASS, 2 FAIL across 13 runs |
| Claude settings | git worktree of this repository, `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1` on each of its three launches. No launch passed a model flag, so the loop's configured Claude model ran. |
| Pi settings | `openai/gpt-6-luna` on every launch from 06:12 onward. Every launch set `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. The 06:07 launch that became run 1 ran the default model and was relaunched at 06:12 on `openai/gpt-6-luna`. |
| OpenCode settings | `openai/gpt-6-luna` on every launch from 06:12 onward, passed as `-m openai/gpt-6-luna`. Every launch set `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. The 06:08 launch that became run 1 ran the default model and was relaunched at 06:12 on `openai/gpt-6-luna`. The default MiMo model through LLM Gateway fails with `Direct provider routing is not available` before a hop can start. |
| Codex settings | scratch clone, `-m gpt-6-luna` on both launches, `SESSION_RELAUNCH_THRESHOLD=0.25`, `SESSION_RELAUNCH_MAX_HOPS=4`. Neither launch set `SESSION_RELAUNCH_WINDOW_TOKENS`, so Codex's own context window applies. |
| Source packet | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/` |

---

## 3. OUTCOMES

| Runtime | Run | Verdict | Operator inputs | Evidence | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| claude | 1 (`loopId=36087`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run1.log` | 769 | `b6adeb76d1ed7b6941316b4171aec2f3cbca15a1a15cc8be8c3bda52aff99db4` |
| claude | 2 (`loopId=67833`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run2.log` | 2502 | `039c63256f2aaacafa4da65a3734b98c5b1566bbcd02b4f467c763d25af7aa9a` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-claude-run2-pane.txt` | 2882 | `cfc97743005fcc5a2e25214388d8a1ef75545702dc828fdcdc4bbe3e37d80f26` |
| claude | 3 (`loopId=83618`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run3.log` | 3373 | `49820449b8bf814a5572d659432b0d9ad48e434b0d313612e20c01869905e780` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-claude-run3-pane.txt` | 2713 | `ef4bc4b144ae9fc763d4f7c29f9476fecfac3381cd1a1b530aaa85a863cb949e` |
| pi | 1 (`loopId=65141`) | PASS | One `Continue.` turn and one Gate 3 confirmation | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run1.log` | 769 | `b6adeb76d1ed7b6941316b4171aec2f3cbca15a1a15cc8be8c3bda52aff99db4` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/pi-run1-pane.txt` | 45293 | `6c43ee2a9af75e6a483b9d90ec1b948cfcedae70cdde8d73ae5857bdbe0429e0` |
| pi | 2 (`loopId=67853`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run2.log` | 2502 | `039c63256f2aaacafa4da65a3734b98c5b1566bbcd02b4f467c763d25af7aa9a` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-pi-run2-pane.txt` | 51128 | `a68b0a85d260c1dab16a3f0514763eea3b059686171b3f43192165fed643132a` |
| pi | 3 (no `loopId`) | PASS, no hop | None recorded | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-pi-run3-pane.txt` | 3420 | `4e07ee5bce0a868cff613d1d1565ee9ea3c695ece741cc5fe9126e8094d60eda` |
| pi | 4 (`loopId=40564`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run4-run5.log` | 837 | `d9e6324d4115c3a05b0fab8e98c7a7987e65de2cb6ba7bfec0f3e3cec19b02dd` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-pi-run4-pane.txt` | 90464 | `ecb804d455e331eb1875abd8996a92538136a3b66195cf0a4be2b509e540248b` |
| pi | 5 (`loopId=62166`) | PASS | One Gate 3 answer of D, one Gate 2 answer of Use exact schema | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run4-run5.log` | 837 | `d9e6324d4115c3a05b0fab8e98c7a7987e65de2cb6ba7bfec0f3e3cec19b02dd` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-pi-run5-pane.txt` | 19503 | `3432a256920c36744a432fdac4f0e07a8b2229bbd770fd82cd47c30171e55a6c` |
| opencode | 1 (`loopId=65150`) | FAIL | None recorded | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run1.log` | 769 | `b6adeb76d1ed7b6941316b4171aec2f3cbca15a1a15cc8be8c3bda52aff99db4` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/oc-run1-pane.txt` | 5494 | `0c439c9b8fead9f42e6c4c16cd5a856e71fa41ca6ca5ccf14139acf937e7a3f4` |
| opencode | 2 (`loopId=67867`) | FAIL | None recorded | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run2.log` | 2502 | `039c63256f2aaacafa4da65a3734b98c5b1566bbcd02b4f467c763d25af7aa9a` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-oc-run2-pane.txt` | 5402 | `d4a3524dd6b277c02e4fd77842ae649b9bb42e75f8d50efd9741c2f2e05fdfe7` |
| opencode | 3 (`loopId=83659`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run3.log` | 3373 | `49820449b8bf814a5572d659432b0d9ad48e434b0d313612e20c01869905e780` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-oc-run3-pane.txt` | 5302 | `0ea0e2ad8ce003f255005a82693b76fdd7b175ac5de09ca713f3d74d799af64a` |
| codex | 1 (`loopId=41194`) | PASS | None during the hops | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run2.log` | 2502 | `039c63256f2aaacafa4da65a3734b98c5b1566bbcd02b4f467c763d25af7aa9a` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/codex-run1-pane.txt` | 3061 | `745a9b0b2acfcd9f931a2d8df3d0a745e37c12dc28eee2f180ec7417f23d3319` |
| codex | 3 (`loopId=83677`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run3.log` | 3373 | `49820449b8bf814a5572d659432b0d9ad48e434b0d313612e20c01869905e780` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/codex-run3-pane.txt` | 2251 | `41b50b78c683f60d08f4a73f5545ea61f6fffd256ac1da83b26495e0fa3429ee` |
| all four | every launch | - | - | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/launch-commands.txt` | 9188 | `3b109e68b3b5ca22eb24fc39ab061393d059902aa187e8701bd245b4e3368e67` |

The packet holds no pane capture for Claude run 1, so its receiving answer is not recorded, and its relaunch log carries the hop and the exit decline only. It also holds no capture for a Codex run 2, so this record has no Codex run 2.

Claude: each run wrote a note, prepared a record, took SIGTERM and relaunched with the claim seed. Runs 2 and 3 closed the note with `complete` exiting 0 after reporting 244 lines and `# Session Relaunch`, and both receivers finished under the finish-instead sentence instead of preparing another hop.

Pi: run 1 needed a `Continue.` turn before the nudge reached a model turn, and a version check that fired on the handoff note cost about 30 minutes. Run 2 needed no operator turn, and a post-prepare turn of about 6 minutes delayed arming. Run 3 produced no hop because the model finished in the sending session, and its `complete` exited 2 on a note path that did not exist. Run 4 hopped from a prompt that told the session to hand off, and its receiver ran the seeded claim and complete with no operator turn, which verifies positional seed auto-send in the Pi TUI. That receiver was then nudged again at the cap, prepared, took SIGTERM and was declined with reason `hop-cap`. Run 5 armed and signalled 36 s after prepare, and its receiver at the cap was not re-nudged. Both of its operator inputs were framework prompts: a Gate 3 question and a Gate 2 artifact-trigger stop.

OpenCode: run 1 hopped and then failed at the claim. The receiver ran `claim --help` and was told `unknown option --help`, ran `claim --handoff` and got `NotFound`, and ran `complete --handoff` and was told `unknown option --handoff`, so the note stayed open. Run 2 hopped and claimed with the positional note path and `--session`, then reported `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` at 141 lines instead of the README at 244 lines, which is a model error rather than a hook error. Run 3 claimed, completed and reported 244 lines and `# Session Relaunch` with no operator input.

Codex: run 1 chained three automatic hops, and the re-nudge superseded each open note with a new path, which left one orphan open note. Its receiver closed its own note and reported 244 lines and `# Session Relaunch`, then ended on a question about whether runtime-emitted prompts should be treated as instructions, which the capture leaves waiting. Run 3 hopped once, wrote one note, reported no hook failures, and its receiver reported that `claim` and `complete` both exited 0 and that the note records status `done`.

---

## 4. FILES

| File | Contents |
|---|---|
| [`outcomes/`](./outcomes/) | One outcome JSON per runtime, listing each run with its verdict, operator inputs and evidence byte counts and SHA-256 values |
| [`results.csv`](./results.csv) | One row per run |
| [`source.md`](./source.md) | Where the raw evidence for this run lives |
