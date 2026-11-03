---
title: "Implementation Plan: Phase 16: cli-codex"
description: "Author 1 conversation scenario(s) for cli-codex from the conversation snippet template, then prove each with the package validator and a live runner pass on codex."
trigger_phrases:
  - "cli codex conversation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: cli-codex

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
Write each scenario from `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`, keeping the first `send` identical to the contract prompt. Validate the package, then replay each scenario live on codex.
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
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook` prints PASS with 0 violations
- [ ] Each live run's `result.json` reports every turn PASS and `repo.changed` false
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scripted conversation scenarios

### Key Components
- **CX-017** (`.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork-conversation.md`): plant a fact, `restart`, ask for it, check it returns

### Data Flow
The runner reads the scenario's `json conversation` block, plays each `send` into a live codex session in a scratch project, runs each `check` after the turn, and writes `result.json` with per-turn verdicts.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the template and file ownership, Implementation writes the scenarios, Verification validates and runs them live.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

For each scenario: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario <file> --runtime codex --scratch <dir outside the repo> --out <evidence dir>`. Pass when every turn is PASS, `repo.changed` is false and no tmux session is left on the run socket. The orchestrating session runs every live pass; workers only author.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The codex CLI installed and signed in, tmux, and the conversation snippet template. Authoring workers run `gpt-6-luna` xhigh fast through cli-codex.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a scenario cannot pass live because the runner cannot express its turns. Delete the new companion file by exact path, or restore an updated file with `git checkout -- <path>`, and record the gap in `018-runner-gaps`.
<!-- /ANCHOR:rollback -->

---
