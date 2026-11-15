---
title: "Implementation Plan: Phase 1: hop-recall-baseline"
description: "Two playbook pages that measure a hop instead of a compaction, one row per counted run, and a recorded go or no-go answer. No runtime file changes."
trigger_phrases:
  - "hop recall baseline plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: hop-recall-baseline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook pages, POSIX shell, `tmux` |
| **Framework** | The manual-testing-playbook operator-scenario contract |
| **Storage** | None. The recorded rows live in the two playbook pages. |
| **Testing** | `validate-playbook-package.cjs`, plus the live hop runs the two pages describe |

### Overview
Write two playbook pages that adapt the existing compaction recall pair to a hop. Each page drives one arm: the sender prints 120 codes, hands over, and the receiver is asked for one code. Record one observed line per counted run and turn the recorded lines into a go or no-go answer. No runtime file changes, so the measurement reflects today's behaviour.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The decision rule and the open threshold are written in `spec.md` §5

### Definition of Done
- [ ] Both arm pages pass `validate-playbook-package.cjs` with `scenarios=126 violations=0`
- [ ] Each arm's `### Recorded Results` table holds one row per counted run
- [ ] `goal.md` §4 holds one `Threshold:` line and one `Decision:` line
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Paired live measurement. Two arms differ in one variable, whether the lookup CLI is on disk, and every other step is identical.

### Key Components
- **The sender session**: a runtime started through `.skilled/bin/skilled-loop`, which prints the codes and then hands over.
- **The handoff note**: the only carrier across the hop, with the four sections the handover requires. It is where a detail can be lost.
- **The receiver session**: a fresh session started by the wrapper with the claim seed. The operator asks it for one code.
- **The observed line**: one line per run, holding the runtime, the arm and five signals.
- **The two arm pages**: `hop-recall-conversation.md` with the CLI on disk and `hop-recall-baseline-conversation.md` with it hidden.

### Data Flow
1. The operator starts the sender in a scratch project through the wrapper.
2. The sender runs `show-codes.sh`, which prints 120 codes and deletes `codes.txt`.
3. The sender runs `/speckit:handoff`, which writes the note and runs `prepare`.
4. Stop arms the record, the killer ends the sender, and the wrapper starts the receiver with the claim seed.
5. The receiver claims the note and reads its four sections.
6. The operator asks for the code printed for `K073` and captures the receiver pane.
7. The check prints one observed line, and the operator writes one row.

### Source Anchors

| Anchor | What it fixes in this plan |
|--------|----------------------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md:18` | The 120-code shape, the filler turn and the compaction turn this phase replaces with a hop. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md:34` | The four-turn process the hop procedure adapts. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md:129` | The observed line and the three regexes for the lookup, the native search and a transcript read. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-baseline-conversation.md:67` | The mirror that copies the runtime tree while skipping `cli.*` under `runtime/dist/hooks/lib/history`, reused by arm B. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-baseline-conversation.md:129` | The DEVIATION check that fails a baseline run when the lookup CLI is reachable. |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:53` | The runner's only actions are `restart` and `compact`, so a hop cannot be scripted by the runner. |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2569` | The `restart` branch in code, which resumes the same session and is not a hop. |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2585` | The `compact` branch in code, which is the action this phase replaces. |
| `.skilled/hooks/session-relaunch/README.md:79` | The wrapper launch line the sender starts from. |
| `.skilled/hooks/session-relaunch/README.md:93` | The hooks ship on for Claude Code and off for every other runtime, so a non-Claude arm needs `SYSTEM_SESSION_RELAUNCH_ENABLED=1`. |
| `.skilled/hooks/session-relaunch/README.md:110` | A linking repository also needs the runtime folders, so the scratch project links `.claude` beside `.skilled`. |
| `.skilled/hooks/session-relaunch/README.md:120` | The default threshold is 0.80, which a short measurement session never reaches. |
| `.skilled/hooks/session-relaunch/README.md:122` | The note path and the four non-empty sections the receiver holds. |
| `.skilled/hooks/session-relaunch/README.md:173` | The claim command the receiver runs. |
| `.skilled/hooks/session-relaunch/README.md:189` | `claim` prints the note body, which is where phase 004 will add the offer and where this phase proves there is none. |
| `.skilled/hooks/session-relaunch/README.md:62` | `/speckit:handoff` is the manual entry point that writes the note and runs `prepare`. |
| `.skilled/commands/speckit/handoff.md:213` | The receiver's eight steps, the only procedure the receiver follows. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:463` | The tmux launch the sender procedure copies. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:481` | The three test switches and what each one changes. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:504` | The `handed-over`, `claimed` and `done` history lines that prove the hop completed. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:432` | The `### Recorded Results` precedent this phase follows. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:285` | `HistoryLocatorSchema`, the locator a hop does not mint today. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:306` | `provenance.source` accepts `precompact` and `post_compaction` only, so no `prepare` provenance exists yet. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:353` | `historyLocator` on the hook state, written by the compaction path. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:119` | The CLI path a receiver would have to find on its own. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:131` | The locator must be under 30 minutes old, which a hop's receiver cannot satisfy without a fresh mint. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:140` | `locator_missing` is the refusal a receiver gets when it finds the CLI but no locator exists. |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:29` | The result-persistence marker the validator looks for. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:286` | The two index rows the compaction pair already holds, which the new pages sit beside. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the compaction pair and the handover README, confirms the wrapper, the validator's baseline count and the code generator, and confirms the handover names no locator. Implementation writes the two arm pages, registers them in the playbook index, and runs both arms on Claude Code. Verification runs the playbook validator, checks every recorded row and the untouched runtime tree, and records the threshold and the GO or NO-GO answer in `goal.md` §4.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The pages are the test. Each arm page carries its own procedure, its observed line, its pass or fail rule and its failure triage, so a rerun needs no other document.

| Check | Command | Expected |
|-------|---------|----------|
| Playbook contract | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --repo-root . --skills-root .skilled/skills` | `scenarios=126 violations=0` |
| Arm A ran | `rg -c '^\| lookup \| claude-code \|' <arm A page>` | The operator's run count, at least 1 |
| Arm B ran | `rg -c '^\| baseline \| claude-code \|' <arm B page>` | The operator's run count, at least 1 |
| Every row complete | `rg -c 'answer=(correct\|wrong\|missing) lookup_attempted=[01] native_recall=[01] transcript_read=[01] note_leaked=[01]' <both pages>` | The total row count |
| No runtime change | `git status --porcelain -- .skilled/hooks .skilled/skills/system-spec-kit/runtime` | No output |

The observed line is `observed=runtime=<id> arm=<lookup|baseline> answer=<correct|wrong|missing> lookup_attempted=<0|1> native_recall=<0|1> transcript_read=<0|1> note_leaked=<0|1>`. The three detection regexes come from the compaction pair's check, so a row means the same thing in both pairs.

No unit test applies, because no code changes. The runtime suites are not run: a green suite here would prove nothing about a hop.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tmux` | External | Green | The operator drives the sender and the receiver by hand and records the panes by hand. |
| `node` | External | Green | No check script runs, so no observed line is produced. |
| Claude Code with the repository hooks | External | Green | No hop on Claude Code, so the required arm is SKIP and the phase is undecidable. |
| `.skilled/bin/skilled-loop` | Internal | Green | No relaunch with the claim seed, so there is no receiver. |
| `validate-playbook-package.cjs` | Internal | Green | The pages cannot be proven to satisfy the operator-scenario contract. |

No new package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an arm page names a command that does not exist, or a recorded row cannot be reproduced from its evidence path.
- **Procedure**: delete the two arm pages and their two index rows in `manual-testing-playbook.md`. The packet's own docs stay.
- No runtime file is touched, so nothing else is reverted.
<!-- /ANCHOR:rollback -->

---
