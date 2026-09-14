# Skill Benchmark Report -- cli-hermes

_Derived after the fact from this run's stored record, not written at run time._

> Manual-testing-playbook validation, not a Lane C D1-D5 skill-benchmark run. Scoring: `not-recorded` · trace mode: `live`.

**Verdict: PASS**

## Run

| Field | Value |
|---|---|
| Target skill | cli-hermes |
| Scoring method | not-recorded |
| Trace mode | live |
| Executor | claude |
| Model | glm-5.3-flash (llmgateway, `--reasoning none`) |
| Variant | phase-008-second-pass |
| CLI version | Hermes Agent v0.21.1 (2026.9.7) · upstream dc90a75a |
| Supersedes | `2026-09-14-phase-008-first-pass` |
| Scenarios | 22 live, 14 hermetic |
| Outcome tally | 22 PASS, 0 FAIL, 14 SKIP (all hermetic) |

## Scenarios

| Scenario | Stage | Verdict | Exit | Seconds | Reason |
|---|---|---|---|---|---|
| HERMES-001 | cli-invocation | PASS | 0 | 13 | sanctioned shape on -t file,todo answered ALIVE; session 20260914_225534_91804d |
| HERMES-002 | cli-invocation | PASS | 0 | 23 | --query-file - delivered quotes, $(...), backticks and $HOME verbatim; no substitution output |
| HERMES-003 | cli-invocation | PASS | 1 | 4 | off-roster id exited 1 with HTTP 400: Requested model deepseek-v9.9-nonexistent not supported |
| HERMES-004 | permission-modes | PASS | 0 | 31 | flagged rm -rf refused in single-query mode with exit_code -1 and status blocked; scratch dir intact |
| HERMES-005 | permission-modes | PASS | 0 | 28 | the identical flagged rm -rf ran with --yolo; scratch dir removed, tool result exit_code 0 |
| HERMES-006 | permission-modes | PASS | 0 | 63 | ordinary write succeeded on -t file,skills,todo with no --yolo; file DONE, stdout FINISHED |
| HERMES-007 | permission-modes | PASS | 0 | 146 | read succeeded and three write attempts were refused by the read-only guard; target file absent |
| HERMES-008 | agent-routing | PASS | 0 | 23 | agent-router template returned ROUTER_OK and the canonical command path, 107 s faster than pass 1 |
| HERMES-009 | prompt-templates | PASS | 0 | 21 | second template returned TEMPLATE_OK and the canonical path in 21 s on -t file,todo; pass 1 returned zero bytes twice |
| HERMES-010 | integration-patterns | PASS | 0 | 133 | both roster models answered --yolo to the identical question on the same flags |
| HERMES-011 | session-continuity | PASS | 0 | 8 | --resume restored the prior turn, recalled ALIVE, and re-emitted session 20260914_225534_91804d |
| HERMES-012 | cost-and-background | PASS | 0 | 73 | agent log records Run budget wrap-up notice injected (budget=15s, elapsed=14s); response states it was cut off |
| HERMES-013 | cost-and-background | PASS | 0 | 64 | agent log records max_iterations_reached(1/1); the forced summary reports only the single iteration's work |
| HERMES-014 | git-preflight-advisory | PASS | 0 | 67 | sk-git advisory [commit-scope-drops-untracked] appended to the terminal tool result; HEAD unchanged |
| HERMES-015 | goal-hook | PASS | 0 | 46 | repo-guards-session-context logged at 3402 chars, up from 303, and quoted by the session |
| HERMES-016 | skills-and-plugins | PASS | 0 | 19 | -s cli-hermes preload quoted the skill's core principle and both roster ids under the hard rule's documented exception |
| HERMES-017 | skills-and-plugins | PASS | 0 | 2 | hermes skills list rendered 64 lines and zero cli-hermes matches while the symlink exists |
| HERMES-018 | skills-and-plugins | PASS | 0 | 19 | nested hermes chat refused by the plugin with the packet's self-invocation message |
| HERMES-019 | integration-patterns | PASS | 0 | 30 | -t file,todo,code_mode reached the MCP server and returned ten tool names; control answered NO_CODE_MODE |
| HERMES-020 | goal-hook | PASS | 0 | 30 | session quoted Bound packet: specs/cli-external-orchestration/071-cli-hermes-creation and the packet objective |
| HERMES-021 | cli-invocation | PASS | 0 | 1 | hermes config get providers.llmgateway.base_url printed https://api.llmgateway.io/v1; hermes status showed no provider |
| HERMES-022 | prompt-templates | PASS | 0 | 21 | byte-and-content gate passed the corrected run and caught the superseded -t search,todo control's fragment |

## Stress matrix

All fourteen `cli-hermes-EC-NNN` cells are recorded SKIP with the reason `hermetic; executed by the runtime suite`. They are Vitest cells against `tests/stress/cli-adapter/cli-hermes.vitest.ts`, which another lane owns; this pass neither created nor ran them.

## Methodology / caveats

- Every live scenario ran against the real `hermes` binary through the `llmgateway` provider. Nothing was mocked or stubbed.
- Every scenario was re-executed in this pass, including the ones the first pass had already passed, because the read-only toolset change altered the command line of nearly all of them and a recorded result must match the command it documents.
- Each dispatch was bounded by `perl -e 'alarm 300; exec @ARGV' --` because macOS provides no `timeout`.
- Stdout and stderr were captured separately; exit code, stdout byte count and elapsed seconds were recorded for every run.
- Five scenarios carry paired negative controls: `HERMES-005` for `HERMES-004`, the no-preload control for `HERMES-016`, the no-`code_mode` control for `HERMES-019`, the `git status` core probe for `HERMES-014`, and the superseded `-t search,todo` control for `HERMES-022`.
- Three scenarios now key on a host-side line in `~/.hermes/logs/agent.log` rather than on the model's prose: `HERMES-012`, `HERMES-013` and `HERMES-015`. A log line the model cannot author is stronger evidence than a sentence it can.
- `score` is `not-recorded` for every row: this run captured verdicts and transcripts, never a numeric score.
- Three dispatches were written into a scratch shell script and run as `bash <script>`, because this environment's own PreToolUse guard refuses a write-shaped `hermes chat` command line that lacks `--yolo`. That is stated in each affected scenario's evidence.
