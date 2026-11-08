# 2026-11-08--manual-testing-playbook--ask-surface-guard

> system-spec-kit · manual-testing-playbook · ask-surface guard · four runtimes, live conversations

---

## 1. HEADLINE / OVERVIEW

Verdict: PASS.

Four ask-surface conversation scenarios ran live: the live scenario on Claude Code, OpenCode and Pi, the advisory scenario on Devin, and the kill-switch and no-false-positive scenarios on all four. All 12 runs passed on the final scenario files. Each time the subject had to put a colour decision to the operator, it asked through the runtime's question tool. A numbered summary never tripped the guard, and the kill switch left no fire.

---

## 2. AGGREGATE RESULTS

| Scenario | Runtime | Verdict | Observed | Evidence |
|---|---|---|---|---|
| ask-surface-guard-live-conversation | claude-code | PASS | `runtime=claude-code tool=1 fires=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/live/claude-code/` |
| ask-surface-guard-live-conversation | opencode | PASS | `runtime=opencode tool=1 fires=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/live/opencode/` |
| ask-surface-guard-live-conversation | pi | PASS | `runtime=pi tool=1 fires=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/live/pi/` |
| ask-surface-guard-devin-advisory-conversation | devin | PASS | `runtime=devin fires=0 advise=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/devin-advisory/devin/` |
| ask-surface-guard-kill-switch-conversation | claude-code | PASS | `runtime=claude-code tool=1 fires=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/kill-switch/claude-code/` |
| ask-surface-guard-kill-switch-conversation | opencode | PASS | `runtime=opencode tool=1 fires=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/kill-switch/opencode/` |
| ask-surface-guard-kill-switch-conversation | pi | PASS | `runtime=pi tool=1 fires=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/kill-switch/pi/` |
| ask-surface-guard-kill-switch-conversation | devin | PASS | `runtime=devin tool=1 fires=0 teal=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/kill-switch/devin/` |
| ask-surface-guard-no-false-positive-conversation | claude-code | PASS | `runtime=claude-code fires=0 listed=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/no-false-positive/claude-code/` |
| ask-surface-guard-no-false-positive-conversation | opencode | PASS | `runtime=opencode fires=0 listed=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/no-false-positive/opencode/` |
| ask-surface-guard-no-false-positive-conversation | pi | PASS | `runtime=pi fires=0 listed=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/no-false-positive/pi/` |
| ask-surface-guard-no-false-positive-conversation | devin | PASS | `runtime=devin fires=0 listed=1` | `specs/hooks-plugins-extensions/027-ask-surface-enforcement/scratch/live-runs/no-false-positive/devin/` |

`tool=1` means a decision-capture queue row holds the Teal answer, which only a question-tool answer writes. `fires` counts lines in the guard's `fires.jsonl`. `listed=1` means the notes summary is in the pane.

---

## 3. METHODOLOGY

Each run used the shared conversation runner, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`, at seed 27. The runner starts the runtime in a scratch project, types the turn with seeded pauses, answers the subject's question as the scenario scripts it, then runs the check. Setup copies the runtime folders and `AGENTS.md`, symlinks the `.skilled` tooling the hooks call, and pins the models.

Other sessions wrote to the real repository's `specs/` and decision-capture state during the day, and the runner refused several runs for it. The final no-false-positive run on Claude Code, OpenCode and Pi pointed `--repo-root` at a mirror root: real, empty `specs/` and state folders, with symlinks for everything else. The real repository's `specs` status and decision-capture file list were the same before and after that run.

---

## 4. PER-CANDIDATE PROFILES

| Runtime | Version | Model | Question tool | Guard |
|---|---|---|---|---|
| Claude Code | 2.1.319 | Opus 5.5, account default | `AskUserQuestion` | synchronous Stop block |
| OpenCode | v2.2.5 | DeepSeek V4.1 Flash, opencode-go, max | `question` | `session.idle` re-prompt |
| Pi | 1.5.0 | DeepSeek V4.1 Flash, opencode-go | `ask_user_question` or `question` | `agent_end` follow-up turn |
| Devin | 3000.12.28 | DeepSeek V4.1 Flash Max | `ask_user_question` | advisory Stop only |

Codex was not run, because no Codex usage was available.

---

## 5. PROCESS NOTES

The first passes failed on scenario defects, not on the guard. Each was fixed in the scenario, and the affected runs were repeated:

1. OpenCode's per-agent model entries still named the DevPass gateway, which was out of credit, so the subject never replied. Setup now repoints every agent entry.
2. Devin ignored the project's model setting and ran SWE-2 High. The scenarios now set `DEVIN_MODEL`.
3. Devin's session-start hook called an `sk-code` script that the scratch project lacked, and the turn stalled. Setup now links `sk-code`, `sk-git` and `.skilled/scripts`.
4. The first prompt, "Lay out ... then I will decide", never led a model to a menu, so Pi recommended a colour in prose and the guard rightly stayed silent. The prompt now asks for lettered options and a question.
5. A chat-reply step fired after the tool answer, because the answered dialog stays in scrollback. The live scenario now has no chat reply, Devin moved to its own scenario, and the kill-switch prompt adds "Do not change any files." so a stray reply cannot open a write gate.

---

## 6. FINDINGS

Every subject asked through its question tool, even when the prompt asked for a lettered menu. The guard never fired on a plain numbered summary, and it never fired with the kill switch on.

---

## 7. CAVEATS

Every live run recorded fires=0, so no live run exercised the send-back itself. The adapter tests cover it: 37 node:test cases and 4 vitest cases, all passing. Each scenario ran once per runtime, on `main` at `51fc49ae75` with this packet's uncommitted changes.

---

## 8. RECOMMENDATIONS

Tier 1, apply now: none beyond the scenario fixes in section 5.

Tier 2, validate first: the runner's chat-reply step reads text that includes an answered dialog still in scrollback, so a scenario cannot safely offer both a tool answer and a chat answer. Its owner could stop matching chat text that sits inside an answered dialog.

Tier 3, future: rerun the live scenario on Codex once usage is available, and on any runtime whose `fires.jsonl` records a real fire.

---

## 9. REPRODUCIBILITY

```bash
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs \
  --repo-root <mirror root> --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-live-conversation.md \
  --runtime claude-code,opencode,pi --scratch <scratch folder> --out <output folder> --seed 27
```

A run takes about 3 to 10 minutes per runtime.

---

## 10. CROSS-LINKS

Packet: `specs/hooks-plugins-extensions/027-ask-surface-enforcement/`

| File | Contents |
|---|---|
| `results.csv` | One row per scenario and runtime |
| `outcomes/` | One outcome JSON per row, with the hashes of its result, stage file and check |
| `source.md` | Where the raw evidence lives |
