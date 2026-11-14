---
title: "Implementation Plan: Phase 2: deepseek-harness-persona-probe"
description: "Run one read-only DeepSeek Harness dispatch with the inlined context persona and one with a tool-mapping line added, judge both by their final message, and change the harness skill only when the control reads nothing and the probe reads its file."
trigger_phrases:
  - "deepseek harness persona probe plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: deepseek-harness-persona-probe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill document and shell |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Two `dsh --profile headless` read-only dispatches and `rg` assertions |

### Overview
Two live harness runs decide whether the skill changes. The control inlines the `context` persona as rule 7 says today. The probe adds one line that maps the persona's tool names to the harness's own. The verdict follows from which of the two final messages names the file, and only `needs-line` edits the skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` has been read before the first dispatch
- [x] `command -v dsh` prints a path and the version equals the pin in the skill's `references/cli-reference.md`
- [x] The key variable of the chosen route is set, checked by name and never printed
- [x] Both prompts are saved under `scratch/`

### Definition of Done
- [x] Every requirement in `spec.md` section 4 holds for the verdict reached
- [x] `rg -c '^verdict: ' scratch/verdict.md` prints 1
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Control and probe.

### Key Components
- **The documented dispatch shape**: `dsh --profile headless` with one route patch, the lineage patch and the guards patch, `--json --permission-mode read-only --approval-policy never -`, the prompt on stdin. The phase uses it unchanged.
- **Rule 7 in `cli-deepseek-harness/SKILL.md`**: The rule an orchestrator reads before composing a harness prompt. It changes on `needs-line` only.

### Data Flow
The orchestrator pipes the prompt to the harness from a scratch directory. The harness streams JSON events and ends with a `final` event. The orchestrator reads the exit code, the reason kind and the last line of the final message, in that order, before it trusts the run.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the harness skill, checks the binary and the route key, records the harness's tool names and saves both prompts. Implementation runs the control and the probe, writes the verdict and, on `needs-line` only, edits rule 7. Verification checks both reports against the verdict, confirms no file changed outside the phase and validates the folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`tail -1 scratch/dsh-control-report.txt` and `tail -1 scratch/dsh-probe-report.txt` must each start `FILES READ:`. A run that exits 0 and names no file is a failed read, not a pass. On `needs-line`, `rg -c -i 'tool mapping'` on the harness skill must print 1 or more and the hub's version check must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`dsh` at the pinned version, one roster route's key variable in the environment, `rg` and `jq`. No new package. On `needs-line`, the hub's version rule in `.skilled/skills/cli-external-orchestration/SKILL.md` decides which files a packet change must touch.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a harness dispatch that follows the new rule text runs a tool that changes state, or the hub's version check fails on main. Revert the phase's one commit with `git revert`. On `no-line-needed` and `unresolved` there is nothing to roll back, because nothing under `.skilled/` changed.
<!-- /ANCHOR:rollback -->

---
