---
title: "Implementation Plan: Phase 1: fanout-persona-tool-mapping"
description: "Probe a read-only Codex child three times with the persona block the fan-out runner inlines, record a decision, and add a tool-mapping line to the runner for the Codex kind only when a run reads nothing."
trigger_phrases:
  - "fanout persona tool mapping plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: fanout-persona-tool-mapping

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script and TypeScript tests |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `codex exec --sandbox read-only` probes and vitest 4.1.12 |

### Overview
Three live read-only Codex runs decide whether the fan-out runner changes at all. If every run reads its file, the phase records `no-change` and edits nothing under `.skilled/`. If any run reads nothing, one branch in the prompt builder adds a mapping line for the `cli-codex` kind and one test pins it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `codex login status` reports a ChatGPT login
- [ ] `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` has been read before the first dispatch
- [ ] `scratch/baseline.txt` holds the Measured Behavior output and the vitest counts

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 holds for the branch the decision selected
- [ ] `rg -c '^decision: ' scratch/decision.md` prints 1
- [ ] `npx vitest run tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` exits 0 in `.skilled/skills/system-deep-loop/runtime`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe, then decide.

### Key Components
- **`agentPersonaBlock` in `fanout-run.cjs`**: Builds the persona block. The probe reuses its output through the exported `withAgentPersona`, so the probe and a real lineage carry the same text.
- **The loop prompt builder in `fanout-run.cjs`**: Places the block for every kind that is not `native`. On `add-line` it gains one line above the block for `cli-codex`. No new function, file or option is added, because one caller needs the line.

### Data Flow
The runner builds a lineage prompt and pipes it to `codex exec`. On `add-line`, the mapping line sits directly above the persona block, so the child reads which of its shell commands stand in for Read, Grep and Glob before it reads the persona that names them.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup saves the baseline, reads the Codex dispatch rules and runs the three probes. Implementation records the decision and, on `add-line` only, edits the prompt builder and adds the test. Verification reruns the probe with the line on `add-line`, runs the two test files and validates the folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three probe reports are read with `tail -1` and must start `FILES READ:`. The unit run is `npx vitest run tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` in `.skilled/skills/system-deep-loop/runtime`, and it must exit 0 with a passing count equal to the baseline, or one higher on `add-line`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`codex` with a ChatGPT login, `node`, `rg` and the vitest already installed under `.skilled/skills/system-deep-loop/runtime`. No new package. On `add-line`, the deep-loop hub's version rule in `.skilled/skills/system-deep-loop/SKILL.md` decides whether a changelog entry is owed, and T008 reads it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a `cli-codex` fan-out lineage with the line fails to write its iteration files, or the runner's tests fail on main. Revert the phase's one commit with `git revert`. On `no-change` there is nothing to roll back, because nothing under `.skilled/` changed.
<!-- /ANCHOR:rollback -->

---
