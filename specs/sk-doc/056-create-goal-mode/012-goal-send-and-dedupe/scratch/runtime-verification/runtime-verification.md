# Goal surface verification on runtimes without a native goal command

Each runtime was run live, its defects were fixed at the source, and the orchestrator re-ran every suite from the final state. The repository ignores `*.log` files, so this page quotes the numbers those logs hold, and every path it cites is a tracked file.

## Verdicts

| Runtime | Surface | Suite, final state | Live scenario | Verdict | Kept evidence |
|---|---|---|---|---|---|
| OpenCode | `.opencode/plugins/opencode-goal.js` | 148 of 148 across the ten goal test files, from 147 | CO-039 script and a two-turn headless `opencode run` on MiMo v2.6 Pro. Turn 1 set the goal through the plugin tools. Turn 2 quoted an injected canary twice and no frontmatter or log canary | PASS | `opencode/a3-live-summary.md`, `opencode/a3-turn2-stdout.jsonl` |
| Pi | `.skilled/hooks/goal/pi/goal-context.ts` | 22 of 22, from 21 | A one-shot `pi -p` turn on MiMo v2.6 Pro with a bound goal. It exited 0 after 40 s with one answer and no tool call, quoted both criteria canaries, and left the canary `goal.md` byte-identical | PASS after the fix | `opencode-pi-fix/b3fix-session-transcript.jsonl`, `opencode-pi-fix/b3fix-prompt.txt`, `opencode-pi-fix/run-live-pi.sh` |
| Cursor | `.skilled/hooks/goal/cursor/goal-inject.mjs` | 15 of 15 | CU-027. Two sessions each got only their own goal, and every failure path returned a plain permission-allow | PASS | `cursor/02-cu027.txt`, `cursor/03-resend-reminder-single-line.txt` |
| Devin | `.skilled/hooks/goal/devin/goal-inject.mjs` | 3 of 3 | DV-022. Both events injected the packet-rendered brief with no fence, and the reminder cleared after `resent` | PASS | `devin/02-dv022.txt` |
| Hermes | `.hermes/plugins/repo-guards/__init__.py` | 46 of 46, from 43 | HERMES-030 on GPT-6 Luna. The frozen goal section held the core's brief at 2,347 characters, bound 12 ms before the render, and matched the Cursor and Devin renders apart from the runtime name | PASS after the fix | `hermes-fix/04-hermes030-live.txt`, `hermes-fix/02-new-tests-fail-on-head.txt` |

The shared goal CLI, core and slice suites pass 8, 74 and 24. Across the node suites the total is 294 of 294, exit 0.

## Defects the live runs found

| Runtime | Defect | Fix | Test that fails on HEAD |
|---|---|---|---|
| Hermes | The goal section rendered before the session bound its packet, and it read no session id because Hermes passes a read-only mapping proxy, not a dict | One idempotent bind shared by the section and the session hook, and any mapping counts as session info | The section binds the environment packet before its first render |
| Hermes | The section injected the raw `goal.cjs show` report, cut at 4,000 characters before the brief | Only the decoded `injection_preview` brief is injected | The section never carries `STATUS=OK` or `goal_prompt=` |
| Hermes | The Python fallback stripped frontmatter only when the file began with `---`, so a byte-order mark or leading comments leaked it | The fallback reads the shared core's objective slice | No frontmatter behind a byte-order mark or leading comments |
| Hermes | `_strip_frontmatter` had no caller | Deleted | None needed |
| Pi | The turn-end nudge steered the running agent, so one `pi -p` turn with a bound goal ran on for 18 minutes and 18 restarts | The nudge waits for the next user prompt | The nudge's delivery options hold it for the next turn |
| Pi | The completion-evidence advisory had the same defect and pushed a finished playbook run into a 1,800 s timeout | The advisory waits for the next user prompt | `completion-evidence-pi-extension.vitest.ts` |
| OpenCode | A bind of a folder whose name holds a line break reported success with `packet_bound=false`, because the plugin rewrote the stored path | The path and workspace are stored as given, as the shared core stores them | The bind reports `packet_bound=true` and stores both paths byte-exact |
| Docs | The Devin playbook expected a `{}` fallback, the OpenCode playbook called the live check impossible and miscounted its suites, and the Pi playbook asked for envelopes its command cannot show | Each playbook states what its runtime does | None needed |

## Measured, not changed

- Hermes caps each prompt section at 4,000 characters, and the core bounds a brief at 4,800. The longest brief across the 308 goals in `specs/` renders 2,558 characters, so no brief reaches the cap.
- A new Pi session reads the goal brief once from the session-start restore and once from the first turn's injection. HEAD did the same, and the goal hooks README documents the restore.
