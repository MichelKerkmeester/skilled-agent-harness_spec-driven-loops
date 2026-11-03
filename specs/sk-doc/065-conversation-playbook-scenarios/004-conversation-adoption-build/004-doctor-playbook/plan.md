---
title: "Implementation Plan: Phase 4: doctor-playbook"
description: "Author 5 conversation scenario(s) for the root `/doctor` playbook from the conversation snippet template, then prove each with the package validator and a live runner pass on claude-code."
trigger_phrases:
  - "doctor playbook conversation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: doctor-playbook

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
Write each scenario from `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`, keeping the first `send` identical to the contract prompt. Validate the package, then replay each scenario live on claude-code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The conversation snippet template exists
- [ ] The target scenario files are not open in another session
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` prints PASS with 0 violations
- [ ] Each live run's `result.json` reports every turn PASS and `repo.changed` false
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scripted conversation scenarios

### Key Components
- **DOC-367** (`.skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md`): answer X, an invalid answer twice, H, then a test-only number, checking the status line after each
- **DOC-370** (`.skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate-conversation.md`): decline one change and check git config is unchanged, then approve `cardSync off` and check the one key changed; run in a disposable checkout
- **DOC-372** (`.skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule-conversation.md`): decline then approve a standards edit, checking `.sk-git/` prose after each answer
- **DOC-359** (`.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md`): decline then approve the release update in a fixture, checking writes and the rollback path
- **DOC-394** (`.skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle-conversation.md`): the declined branch only: answer no and check the tree and the remote are unchanged

### Data Flow
The runner reads the scenario's `json conversation` block, plays each `send` into a live claude-code session in a scratch project, runs each `check` after the turn, and writes `result.json` with per-turn verdicts.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the template and file ownership, Implementation writes the scenarios, Verification validates and runs them live.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

For each scenario: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario <file> --runtime claude-code --scratch <dir outside the repo> --out <evidence dir>`. Pass when every turn is PASS, `repo.changed` is false and no tmux session is left on the run socket. The orchestrating session runs every live pass; workers only author.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The claude-code CLI installed and signed in, tmux, and the conversation snippet template. Authoring workers run `gpt-6-luna` xhigh fast through cli-codex.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a scenario cannot pass live because the runner cannot express its turns. Delete the new companion file by exact path, or restore an updated file with `git checkout -- <path>`, and record the gap in `018-runner-gaps`.
<!-- /ANCHOR:rollback -->

---
