---
title: "Implementation Plan: Phase 2: cli-opencode"
description: "Author 4 conversation scenario(s) for cli-opencode from the conversation snippet template, then prove each with the package validator and a live runner pass on opencode."
trigger_phrases:
  - "cli opencode conversation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: cli-opencode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook scenarios with a `json conversation` block |
| **Framework** | The shared conversation runner in sk-create-manual-testing-playbook |
| **Storage** | None |
| **Testing** | `validate-playbook-package.cjs` and live runner passes |

### Overview
Write each scenario from `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`, keeping the first `send` identical to the contract prompt. Validate the package, then replay each scenario live on opencode.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The conversation snippet template exists — Evidence: `manual-testing-playbook-conversation-snippet-template.md` is present.
- [ ] The target scenario files are not open in another session — Evidence unavailable: `git status` cannot confirm editor or session ownership; it lists only the five expected phase scenario paths.
- [x] Dependencies identified — Evidence: §6 names OpenCode, tmux, and the conversation template.

### Definition of Done
- [x] All acceptance criteria met — Evidence: four live result files PASS; package validation reports 0 violations.
- [x] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` prints PASS with 0 violations — Evidence: `PASS package=cli-external-orchestration/cli-opencode ... violations=0 warnings=0`.
- [x] Each live run's `result.json` reports every turn PASS and `repo.changed` false — Evidence: four phase result files report PASS, `repo.changed=false`, and `cleanup.ok=true`.
- [x] This phase passes strict validation — Evidence: `validate.sh --strict` printed `RESULT: PASSED` (exit 0).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scripted conversation scenarios

### Key Components
- **CO-046** (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md`): send the shell-command request, then a second request, and check the captured second request carries `[session-relaunch]`
- **CO-019** (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id-conversation.md`): plant a fact, `restart`, ask for the fact, check it comes back
- **CO-018** (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session-conversation.md`): plant a fact, send a follow-up in the same session, check the answer uses it
- **OpenCode goal hook** (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook-conversation.md`): bind a goal, send a later task, check the goal is model-visible on that turn

### Data Flow
The runner reads the scenario's `json conversation` block, plays each `send` into a live opencode session in a scratch project, runs each `check` after the turn, and writes `result.json` with per-turn verdicts.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the template and file ownership, Implementation writes the scenarios, Verification validates and runs them live.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

For each scenario: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario <file> --runtime opencode --scratch <dir outside the repo> --out <evidence dir>`. Pass when every turn is PASS, `repo.changed` is false and no tmux session is left on the run socket. The orchestrating session runs every live pass; workers only author.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The opencode CLI installed and signed in, tmux, and the conversation snippet template. Authoring workers run `gpt-6-luna` xhigh fast through cli-codex.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a scenario cannot pass live because the runner cannot express its turns. Delete the new companion file by exact path, or restore an updated file with `git checkout -- <path>`, and record the gap in `018-runner-gaps`.
<!-- /ANCHOR:rollback -->

---
