# 2026-11-02--manual-testing-playbook--decision-capture-live-conversation

> system-spec-kit · manual-testing-playbook · decision capture · five runtimes, live conversations

---

## 1. HEADLINE / OVERVIEW

Verdict: PASS.

The decision-capture conversation scenario ran live on Claude Code, OpenCode, Codex, Pi and Devin, with the kill-switch scenario on each and the sibling re-proof on Claude Code. All 11 runs passed in the first pass, and all 11 passed again in a second pass on the current scenario and the gap-closure code. In each main run the operator's answers reached the scratch packet's `decision-record.md` as 7 decision rows, with no key twice and no process question, and a repeat save changed no byte.

---

## 2. AGGREGATE RESULTS

| Scenario | Runtime | Verdict | Stages passed / skipped / failed | Evidence |
|---|---|---|---|---|
| decision-capture-live-conversation | claude-code | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/claude-run1/runner/main/claude-code/` |
| decision-capture-kill-switch-conversation | claude-code | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/claude-run1/runner/kill-switch/claude-code/` |
| decision-capture-sibling-reproof-conversation | claude-code | PASS | 7/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/claude-run1/runner/sibling/claude-code/` |
| decision-capture-live-conversation | opencode | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/opencode-run1/runner/main/opencode/` |
| decision-capture-kill-switch-conversation | opencode | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/opencode-run1/runner/kill-switch/opencode/` |
| decision-capture-live-conversation | codex | PASS | 5/9/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/codex-run1/runner/main/codex/` |
| decision-capture-kill-switch-conversation | codex | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/codex-run1/runner/kill-switch/codex/` |
| decision-capture-live-conversation | pi | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/pi-run1/runner/main/pi/` |
| decision-capture-kill-switch-conversation | pi | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/pi-run1/runner/kill-switch/pi/` |
| decision-capture-live-conversation | devin | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/devin-run1/runner/main/devin/` |
| decision-capture-kill-switch-conversation | devin | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/devin-run1/runner/kill-switch/devin/` |

### Second pass

The second pass ran the same eleven scenarios on the current scenario version, with the gap-closure changes in place.

| Scenario | Runtime | Verdict | Stages passed / skipped / failed | Evidence |
|---|---|---|---|---|
| decision-capture-live-conversation | claude-code | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/claude-run2/runner/main/claude-code/` |
| decision-capture-kill-switch-conversation | claude-code | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/claude-run2/runner/kill-switch/claude-code/` |
| decision-capture-sibling-reproof-conversation | claude-code | PASS | 7/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/claude-run2/runner/sibling/claude-code/` |
| decision-capture-live-conversation | opencode | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/opencode-run2/runner/main/opencode/` |
| decision-capture-kill-switch-conversation | opencode | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/opencode-run2/runner/kill-switch/opencode/` |
| decision-capture-live-conversation | codex | PASS | 5/9/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/codex-run2/runner/main/codex/` |
| decision-capture-kill-switch-conversation | codex | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/codex-run2/runner/kill-switch/codex/` |
| decision-capture-live-conversation | pi | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/pi-run2/runner/main/pi/` |
| decision-capture-kill-switch-conversation | pi | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/pi-run2/runner/kill-switch/pi/` |
| decision-capture-live-conversation | devin | PASS | 14/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/devin-run2/runner/main/devin/` |
| decision-capture-kill-switch-conversation | devin | PASS | 1/0/0 | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/devin-run2/runner/kill-switch/devin/` |

A skipped stage is one whose check exits 77 with its blocker as the first output line. The nine skips on Codex are live-queue checks: Codex has no live adapter, so its answers are read from the rollout at save time and are proven at S6, S10 and S11.

---

## 3. METHODOLOGY

Each run used the shared conversation runner, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`, one runtime at a time while no other runner was live. The runner starts the runtime in a scratch project, types each turn with seeded human pauses, answers the subject's questions as the scenario scripts them, and runs each stage's check after the turn settles.

The runs pointed `--repo-root` at a mirror root: real empty `specs/` and decision-capture state folders, with symlinks for the runtime folders and `.skilled` tooling. Other sessions wrote to the real repository during the day, so the runner's clean-repository check would otherwise fail on their files. A wrapper saved the real repository's `git status` for `specs` and the real decision-capture file list before and after each run.

---

## 4. PER-CANDIDATE PROFILES

| Runtime | Version | Model | Question tool | Answer path |
|---|---|---|---|---|
| Claude Code | 2.1.316 | Opus 5.5 | `AskUserQuestion` | live hook |
| OpenCode | v2.1.4 | DeepSeek V4.1 Flash (llmgateway) | `question` | live plugin |
| Codex | 0.164.0 | GPT-6-Luna | `request_user_input` | rollout sweep at save time |
| Pi | 1.4.0 | DeepSeek V4.1 Flash (llmgateway) | `ask_user_question`, or pi-plan-build's `question` | live extension |
| Devin | 3000.11.234 | SWE-2 High | `ask_user_question` | live hook |

---

## 5. PROCESS NOTES

Codex passed on its seventh attempt. Each earlier attempt is kept with its cause in `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/codex-run1/attempts/README.md`. The attempts exposed one product defect and five scenario gaps:

1. The save's sufficiency gate did not count the operator's answers as evidence, so a save that carried little else was refused. Fixed in the save step, with a test.
2. Codex has no `/speckit:save` command, so every save turn now sends a plain request that names `save.md`.
3. The S6 and S10 checks counted pending answers only and now also count record rows.
4. The demo packet is committed in setup, so a save is a reversible edit.
5. Every question send asks for the tool itself and no recommended mark.
6. Codex runs with its hooks untrusted, because trusting them would also trust the operator's own global hooks.

In the second pass, Pi's main run failed twice before it passed and Codex's main run failed once:

1. Pi attempt 1 failed at S2 on a stale check. The scenario still expected no Pi nudge, but the gap-closure change added one. The scenario now expects the Claude Code nudge sequence on Pi.
2. Pi attempt 2 failed at S2 on a product defect. The model asked through `question`, a second question tool that the operator's pi-plan-build package installs. Both Pi readers matched only `ask_user_question`, so the answer never reached the queue. Both readers now accept both tools. Replaying that session file through the fixed sweep recovers the answer, and two tests cover the new answer shape.
3. Codex attempt 1 failed at S6 because the model announced the save and ended its turn without running it. The rerun passed unchanged.

Each failed attempt is kept beside the passing run as `main-attempt1` or `main-attempt2`.

---

## 6. FINDINGS

Every runtime with a question tool records an answered question once. A plain chat answer lands too, through each sweep's shared chat detector. On Claude Code the sibling run matched an answer already written in a hand-written table to its row, Q050, instead of writing a second row.

---

## 7. CAVEATS

Each scenario ran once per runtime, on the working tree of `main` at `4c3222d5b9` with this series' uncommitted changes. In the first pass, Claude Code, OpenCode, Pi and Devin passed on an earlier version of the scenario, before the Codex changes in section 5. The second pass ran all five on the current version. Its passing Pi run asked through `ask_user_question` only, so the `question` path has been proven on the recorded session file and in tests, not yet in a live run.

---

## 8. RECOMMENDATIONS

Tier 1, apply now: none beyond the fixes already made.

Tier 2, validate first: the 065 runner matches Codex option labels exactly, so a label ending in "(Recommended)" is refused. Its owner could strip that suffix before matching.

Tier 3, future: none.

---

## 9. REPRODUCIBILITY

```bash
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs \
  --repo-root <mirror root> --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md \
  --runtime <runtime> --scratch <scratch folder> --out <output folder>
```

A main run takes about 15 to 30 minutes, depending on the model.

---

## 10. CROSS-LINKS

Phase folder: `specs/system-speckit/043-decision-capture/006-live-conversation-test/`

| File | Contents |
|---|---|
| `results.csv` | One row per scenario and runtime |
| `outcomes/` | One outcome JSON per row, with the hash of its stage file and result |
| `source.md` | Where the raw evidence lives |
