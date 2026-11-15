---
title: "Implementation Plan: Phase 22: vibe-hook-playbook-and-live-scenarios"
description: "Teach the shared conversation runner to drive an interactive Vibe session with the rendered home hooks, write one conversation scenario per Vibe hook, hook part, mirror and the renderer, run each one live, then run the local skilled alignment check over the branch and fix what it confirms."
trigger_phrases:
  - "vibe hook playbook and live scenarios plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: vibe-hook-playbook-and-live-scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook scenarios with `json conversation` blocks, Node.js CommonJS for the runner adapter |
| **Framework** | The sk-doc manual testing playbook contract, its conversation runner and validator, Vibe 3.1.2 hooks |
| **Storage** | Evidence under this phase's `scratch/`; the alignment run writes outside the checkout |
| **Testing** | The runner's `node --test` suite, the playbook validator, one live runner pass per scenario, the alignment battery and its recheck |

### Overview
The runner plays a scenario's turns into a live interactive session and runs a shell check after each turn, so a Vibe adapter turns every hook into something a script can prove across turns, questions and a compaction. Each scenario's checks read the session journal the rendered home writes, because a hook decision lives there and not in the exit code. The alignment run comes last, over the finished branch.

**Executor:** the tasks run as a DeepSeek V4.1 Flash max swarm across OpenCode and pi on the `llmgateway`, `opencode-go` and `mistral` providers. Scenario authoring and live runs split by scenario, because each scenario is one file and one evidence folder; the runner adapter and the root playbook section each have one owner, because every scenario depends on them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 013 to 021 are built (`scratch/predecessors.md` lists each status)
- [ ] The playbook validator passes at baseline (`scenarios=25 ... violations=0`)
- [ ] The runner suite passes at baseline (`node --test .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` prints `fail 0`)

### Definition of Done
- [ ] The playbook validator prints `PASS` with `scenarios=51` and `violations=0`
- [ ] `scratch/verdicts.md` holds 26 rows and no FAIL
- [ ] The alignment recheck shows no open confirmed in-scope finding
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scripted conversation per hook, judged by journal checks.

### Key Components
- **Vibe runner adapter** (`run-conversation-scenario.cjs`): launches `vibe` in the marked scratch project with a `VIBE_HOME` that holds the repository config copy and the rendered home hooks, resumes with `vibe --resume`, compacts with `/compact`, exits with `/exit`, and answers the `ask_user_question` widget. Without it, no Vibe scenario can run.
- **Hook scenarios** (`manual-testing-playbook/hook-scenarios/`): one file per inventory row, each with a natural operator prompt as turn 1 and a check that finds the hook's journal record. Without them, a hook regression ships unseen.
- **Verdict table** (`scratch/verdicts.md`): one live row per scenario with its evidence folder. Without it, a pass is a claim.
- **Alignment pass**: the existing `/local-skilled-alignment` workflow over the branch, its triage and recheck. Without it, a surface the branch touched but no scenario reaches goes unchecked.

### Data Flow
The runner prepares the scratch project, renders the home hooks into a fresh `VIBE_HOME`, launches Vibe and types turn 1. Vibe runs the hook, which writes a `hook_completed` or `post_tool_call` record to the session journal. The turn's check reads that journal and exits 0 on the expected record. The runner writes the matrix row and evidence, which the task copies into `scratch/live/<id>/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup writes the inventory, records the predecessor statuses and the validator and runner baselines. Implementation adds the Vibe runner adapter with its tests and a live sample pass, writes the 26 hook scenarios and the root playbook section, and validates the package. Verification runs every scenario live, fixes each FAIL and reruns it, then runs the alignment check, triages and fixes its confirmed findings and runs the recheck. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The runner adapter gets unit cases in the runner's existing suite for its launch, resume and exit arguments and its question parser, plus one live pass of the runner's own sample scenario with `--runtime vibe`. Each hook scenario is its own live test: its turns run through the runner, and each turn's check reads the session journal for the record the hook writes, never the exit code alone. The playbook validator checks every new file's shape. The alignment battery reruns the existing checks for every surface the branch fires, and `--recheck` reruns only the rows that failed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2`, `tmux`, Node.js, `MISTRAL_API_KEY`, phases 013 to 021, the sk-doc playbook runner and validator, the `/local-skilled-alignment` workflow with its `opencode-go` lane preset, and the OpenCode and pi CLIs for the swarm. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the adapter breaks another runtime's runner path, or a scenario fix regresses a hook suite. Revert the runner and validator edits, which leaves the five existing runtimes as they were, and delete `hook-scenarios/` with its section. A scenario fix reverts on its own, because each one is a separate task naming its file.
<!-- /ANCHOR:rollback -->

---
