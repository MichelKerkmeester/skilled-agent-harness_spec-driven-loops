---
title: "Implementation Plan: Root docs and git hook disclosure"
description: "Bring CONTRIBUTING and .env.example up to date, add Git Hooks and Off Switches subsections to the README, and add a bypass line to each hook block that lacked one, each checked against the hook source and a test case."
trigger_phrases:
  - "root docs git hook plan"
  - "git hook bypass line plan"
  - "off switches section plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Root docs and git hook disclosure

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash |
| **Framework** | Git hooks under `.skilled/scripts/git-hooks/` |
| **Storage** | None |
| **Testing** | `commit-msg.test.sh` and `pre-commit.test.sh` test suites, `validate_document.py`, `hvr_scan.py` |

### Overview
The root docs change in place, and every claim they make about a hook is checked against that hook's source first. The hooks gain one message line per block that named no way through. Each new line gets a test case, written before the line, so the case fails first and passes after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation plus message-only hook edits. No check changes what it blocks.

### Key Components
- **README Git Hooks subsection**: what installs the hooks, what the three blocking hooks refuse, the bypass rule and how to remove the hooks for good
- **README Off Switches subsection**: the one place that links the hook, validation and git hook switches and says where each is read
- **Block message bypass lines**: one line per block, naming the variable that lets that one command through

### Data Flow
A reader lands on the README, CONTRIBUTING links its Git Hooks section, and Git Hooks links Off Switches. At commit time the hook's own block message names the bypass, so the doc and the message agree.

### Decision: the agent mirror gate names the whole-chain switch
The pre-commit agent mirror gate has no switch of its own. Adding one would change a gate's contract, which is outside this phase. Its two block messages name `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` and say that it turns off every pre-commit gate, so the message is honest about the cost.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The test cases assert each new bypass line by its exact text, so a later edit that drops one fails a named case. The docs run through `validate_document.py` against their HEAD versions, so only new issues count, and the added lines run through `hvr_scan.py`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The Off Switches subsection links the two validation switches that `specs/sk-doc/062-doc-validation-off-switches` added, and that packet's `.env.example` lines land in the same file as this phase's header and bypass list.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. The hook edits only add message lines, so a revert restores the old messages with no change to what any gate blocks.
<!-- /ANCHOR:rollback -->

---
