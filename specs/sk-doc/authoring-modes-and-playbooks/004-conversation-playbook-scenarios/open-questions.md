---
title: "Open questions: conversation playbook scenarios"
description: "Operator questions saved overnight for the conversation playbook scenarios, each with the recommendation being followed until answered."
trigger_phrases:
  - "conversation scenarios open questions"
---

# Open questions: conversation playbook scenarios

Questions saved overnight on 2026-11-01, to be asked at 07:00 or at your next reply. Until you answer, work continues on the recommendation shown, and each choice is recorded in this packet's decision record. Any of them can be reversed.

---

## 1. Codex's question tool in test runs

**Context.** Codex shows its question tool only with the experimental `default_mode_request_user_input` setting. Without it, a conversation test can only check Codex's chat questions, and its tool-question turns are marked SKIP.

**Answered 2026-11-02, about 05:50:** "Enable it in repo and macbook". The main session set `default_mode_request_user_input = true` under `[features]` in `~/.codex/config.toml` and in this repository's `.codex/config.toml`. Scenario `setup` still sets it in the scratch project too. No Codex tool-question turn is planned as SKIP.

## 2. Changes coming out of the research run

**Context.** A 3-iteration DeepSeek research run is checking the existing playbook skill and the plans for phases 001 (scenario format) and 002 (runner).

**Recommendation, being done now:** apply refinements that stay within each phase's goal and record each one. If it recommends dropping a phase or changing its scope, that waits for you.

## 3. Upstream Cursor issue found along the way

**Context.** In Skilled's hook registry, the fallback wrapper for Cursor turns a hook's exit-2 refusal into exit 0 followed by an "allow". That would let a refusing hook pass on Cursor. It affects Skilled's own message gate as well as the Barter git-write block. I found this by reading the code; it hasn't been tested on Cursor.

**Question.** Open a small Skilled packet to fix it and test it on Cursor?

**Answered 2026-11-02:** yes, as a separate small Skilled packet after the current tracks. Not started.

## 4. Commit and push

**Context.** The packet and its plans are untracked. The build will change the `sk-create-manual-testing-playbook` skill.

**Question.** Commit and push after phase 001, or after both phases?

**Answered 2026-11-02:** after both builds are checked, meaning the runner passes live on Claude Code and 043/006 has its matrix. The overnight session then hands the file list to the main session and does not commit. A later answer the same day adds that the operator sees the file list and gives a yes before any commit or push (decision record Q009).

## Luna's quota ran out overnight

**Context.** At about 22:40 UTC on 2026-11-01 every running cli-codex worker on `gpt-6-luna` stopped with "You've hit your usage limit", which resets at 02:22 on 2026-11-02. Three workers stopped part-way. Their finished parts were checked by running the tests and validators, not by reading their reports.

**Being done now, per the goals' worker rule:** the remaining implementation runs on `llmgateway/deepseek-v4.1-flash-1017` at thinking `max` through cli-pi. Luna is not routed through any gateway. If DeepSeek also fails, that item stops and is recorded here.

## MTP-007 chat turn stopped after three failures

**Context.** On Claude Code, MTP-007's first three turns (single-select, multi-select, Other) now pass live. The chat-reply turn failed `MISSING_QUESTION` in attempts 3, 4 and 5 (`002-conversation-runner/scratch/runs/mtp007*`). Fixes tried: loosening the pattern, then teaching the runner to test unconsumed `reply` entries once the screen settles. The subject phrased the question differently each run. Run 5 asked "So far you've selected the colours green and teal. Do you want to keep them?", which `[Kk]eep.*colou?rs?` cannot match because "colours" comes first. So the settle-time reply path may already work, but that is not proven. Per the three-fixes rule and the main session's instruction, this item stopped.

**Recommendation, not applied:** match an order-free word, such as `[Kk]eep`. Scope the settle-time test to the text after the last `❯ <sent text>` line, as the main session suggested; today the runner removes the echoed send from the whole screen. Add one fake-subject test where the chat question is only visible at settle. Then rerun MTP-007 on Claude Code.

**Update 2026-11-02, about 07:20.** Done as recommended. With the order-free pattern and the scoped settle-time test, MTP-007 passed 6/6 on Claude Code with exit 0 (`002-conversation-runner/scratch/runs/mtp007-attempt7/`).

## Rulings made during the probes, each reversible

**Context.** Probing OpenCode, Codex, Pi and Devin forced several choices. Each is in decision-record.md ADR-003, and the work continues on it until you say otherwise.

1. **Codex hook review at start-up.** The runner picks "Continue without trusting", because "Trust all" writes to your own `~/.codex/config.toml`. Codex hooks therefore do not run in a Codex scratch project. This matters for 043/006, where capture on Codex may depend on them. Should 043/006 trust them?

   **Answered 2026-11-02 (decision record Q006):** yes, only in the decision-capture runs. The runner trusts hooks only when a scenario sets `trust_hooks`, records each trust entry it adds and removes those entries after the run.
2. **Codex multi-select.** Codex's question tool has no multi-select, so the runner types several choices as a note on `None of the above`. An optional chat reply covers a subject that asks in chat instead. Is that an acceptable test of Codex's multi-select turn?

   **Answered 2026-11-02 (decision record Q007):** yes, keep it, and document it as a Codex difference in `references/conversation-scenarios.md`.
3. **Folder trust.** Codex and Devin save the scratch folder's trust in your global config, as Claude Code already did. Accepted.
4. **Free-text-only questions.** A subject can ask with only the free-text row. The OpenCode parser now accepts this. The Claude Code, Codex, Pi and Devin parsers still need at least one choice; this has not been seen live on those runtimes.
