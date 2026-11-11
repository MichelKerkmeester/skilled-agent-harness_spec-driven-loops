---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
How can this repository make sure that a deep loop (research, review or council) started through natural conversation follows its proper workflow and does not skip steps? An incident record is at specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/incident-chat-started-loop.md and the driver the session had to write is at specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/single-executor-driver.py. Read both first. Then read .skilled/commands/deep/research.md, .skilled/commands/deep/assets/deep-research-auto.yaml and deep-research-presentation.txt, .skilled/skills/system-deep-loop/SKILL.md and its deep-research/SKILL.md, runtime/scripts/fanout-run.cjs, verify-iteration.cjs, fanout-merge.cjs and synthesis-closeout.cjs, AGENTS.md Gate 4 and PLAN-WORKFLOW LOCK, and .skilled/repo-rules/delegation-and-orchestration.md. Establish which workflow steps are enforced by code and which only by prose, why a fan-out lineage runs all its iterations in one process, and what would have caught the incident. Recommend the smallest set of changes to existing files that keeps a chat-started loop on its workflow, and say what not to build. Prefer changing an existing line or making an existing script refuse or report over a new command, agent, hook or document.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which lines in the command doc, the workflow YAML, the skills and AGENTS.md allowed or invited the bypass in the incident, and which steps of the single-executor path are enforced by code as opposed to prose? Cite file and line.
- [x] Why does a fan-out lineage run all its iterations in one process, is that by design, and does anything record or report that a lineage's iterations did not each get a fresh context?
- [x] Which existing checks could have caught the incident before or after the run (verify-iteration.cjs, dispatch receipts, config status, lock, fanout-run's success report, validate.sh), and why did each not fire?
- [x] What are the candidate fixes (a runner that owns the single-executor loop, fanout-run refusing or labelling a one-lineage run, a completion check on receipts and config status, wording in the command doc or AGENTS.md, a hook), what does each cost and break, and how does each behave on the seven runtimes and in a dispatched child?
- [x] What is the smallest set of changes to existing files that keeps a chat-started loop on its workflow, how does it apply to deep-review and ai-council, and what should not be built?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
[What this research session is NOT trying to answer -- populated during initialization]

---

## 5. STOP CONDITIONS
[Explicit conditions beyond convergence that should end the session -- populated during initialization]

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which lines in the command doc, the workflow YAML, the skills and AGENTS.md allowed or invited the bypass in the incident, and which steps of the single-executor path are enforced by code as opposed to prose? Cite file and line.
- Why does a fan-out lineage run all its iterations in one process, is that by design, and does anything record or report that a lineage's iterations did not each get a fresh context?
- Which existing checks could have caught the incident before or after the run (verify-iteration.cjs, dispatch receipts, config status, lock, fanout-run's success report, validate.sh), and why did each not fire?
- What are the candidate fixes (a runner that owns the single-executor loop, fanout-run refusing or labelling a one-lineage run, a completion check on receipts and config status, wording in the command doc or AGENTS.md, a hook), what does each cost and break, and how does each behave on the seven runtimes and in a dispatched child?
- What is the smallest set of changes to existing files that keeps a chat-started loop on its workflow, how does it apply to deep-review and ai-council, and what should not be built?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"`fanout-merge.cjs`'s `status: ok` is a workflow verdict."** It is a merge verdict: refusals are limited to reducer-provenance and near-line pairs, and `status: 'ok'` is emitted unconditionally once the registry writes succeed. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1530] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"`fanout-merge.cjs`'s `status: ok` is a workflow verdict."** It is a merge verdict: refusals are limited to reducer-provenance and near-line pairs, and `status: 'ok'` is emitted unconditionally once the registry writes succeed. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1530]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`fanout-merge.cjs`'s `status: ok` is a workflow verdict."** It is a merge verdict: refusals are limited to reducer-provenance and near-line pairs, and `status: 'ok'` is emitted unconditionally once the registry writes succeed. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1530]

### **"`validate.sh` would have caught it."** It validates packet document structure. A run that skipped `phase_init` and `phase_save` leaves the packet documents untouched, which is exactly the state validation accepts. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"`validate.sh` would have caught it."** It validates packet document structure. A run that skipped `phase_init` and `phase_save` leaves the packet documents untouched, which is exactly the state validation accepts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`validate.sh` would have caught it."** It validates packet document structure. A run that skipped `phase_init` and `phase_save` leaves the packet documents untouched, which is exactly the state validation accepts.

### **"The 2,539-line YAML is the enforcement."** Verified false: the YAML contains commands and prose, but nothing validates that `phase_init` or `phase_save` ran. Its checks fire only for a session already walking its steps. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The 2,539-line YAML is the enforcement."** Verified false: the YAML contains commands and prose, but nothing validates that `phase_init` or `phase_save` ran. Its checks fire only for a session already walking its steps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The 2,539-line YAML is the enforcement."** Verified false: the YAML contains commands and prose, but nothing validates that `phase_init` or `phase_save` ran. Its checks fire only for a session already walking its steps.

### **"The lock catches non-workflow runs."** A lock only reports contention against a lock; a run that never calls `loop-lock.cjs` leaves nothing to contend with. Absence of a lock is not an observable the current code tests. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The lock catches non-workflow runs."** A lock only reports contention against a lock; a run that never calls `loop-lock.cjs` leaves nothing to contend with. Absence of a lock is not an observable the current code tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The lock catches non-workflow runs."** A lock only reports contention against a lock; a run that never calls `loop-lock.cjs` leaves nothing to contend with. Absence of a lock is not an observable the current code tests.

### **`fanoutConfigSchema.executors` minimum of two.** Wrong layer and expensive: it is the shared parse contract for tests, resume and the reducer, and single-entry arrays are used there for reasons unrelated to the policy. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`fanoutConfigSchema.executors` minimum of two.** Wrong layer and expensive: it is the shared parse contract for tests, resume and the reducer, and single-entry arrays are used there for reasons unrelated to the policy. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`fanoutConfigSchema.executors` minimum of two.** Wrong layer and expensive: it is the shared parse contract for tests, resume and the reducer, and single-entry arrays are used there for reasons unrelated to the policy. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533]

### **A distinct-base-label guard** ("refuse when fewer than two labels are declared"). It runs before replica expansion in effect, so it would refuse a single `--executor X --count 5`, which the presentation asset documents as native fan-out. [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A distinct-base-label guard** ("refuse when fewer than two labels are declared"). It runs before replica expansion in effect, so it would refuse a single `--executor X --count 5`, which the presentation asset documents as native fan-out. [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A distinct-base-label guard** ("refuse when fewer than two labels are declared"). It runs before replica expansion in effect, so it would refuse a single `--executor X --count 5`, which the presentation asset documents as native fan-out. [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71]

### **A gateway precondition ("iteration record requires a live lock").** Fires on the incident's path, but reaches every lineage, every mode and every resume, and is designed to be non-blocking — it cannot stop a run. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:494] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A gateway precondition ("iteration record requires a live lock").** Fires on the incident's path, but reaches every lineage, every mode and every resume, and is designed to be non-blocking — it cannot stop a run. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:494]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A gateway precondition ("iteration record requires a live lock").** Fires on the incident's path, but reaches every lineage, every mode and every resume, and is designed to be non-blocking — it cannot stop a run. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:494]

### **A hook as the enforcement surface.** Six runtime-specific adapters, all prompt-time context injection; reproduces prose at maximum cost. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A hook as the enforcement surface.** Six runtime-specific adapters, all prompt-time context injection; reproduces prose at maximum cost. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hook as the enforcement surface.** Six runtime-specific adapters, all prompt-time context injection; reproduces prose at maximum cost. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53]

### **A packet-level "did this run walk the workflow" receipt to check afterwards.** The only receipt writer in the repository is the YAML dispatch step (`receiptDir` bound at eight places in the research YAML alone), so receipts mark the single-executor path and are legitimately absent on fan-out. Building a fan-out receipt would be a new artifact, not an existing check. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A packet-level "did this run walk the workflow" receipt to check afterwards.** The only receipt writer in the repository is the YAML dispatch step (`receiptDir` bound at eight places in the research YAML alone), so receipts mark the single-executor path and are legitimately absent on fan-out. Building a fan-out receipt would be a new artifact, not an existing check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A packet-level "did this run walk the workflow" receipt to check afterwards.** The only receipt writer in the repository is the YAML dispatch step (`receiptDir` bound at eight places in the research YAML alone), so receipts mark the single-executor path and are legitimately absent on fan-out. Building a fan-out receipt would be a new artifact, not an existing check.

### **A post-run completion assertion hosted anywhere in the runtime scripts.** Nothing in the incident's route calls a runtime script at the end, so a new assertion in any of them would inherit the same "not reached" property as every check iteration 1 mapped. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A post-run completion assertion hosted anywhere in the runtime scripts.** Nothing in the incident's route calls a runtime script at the end, so a new assertion in any of them would inherit the same "not reached" property as every check iteration 1 mapped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A post-run completion assertion hosted anywhere in the runtime scripts.** Nothing in the incident's route calls a runtime script at the end, so a new assertion in any of them would inherit the same "not reached" property as every check iteration 1 mapped.

### **Escalating the already-computed timestamp anomaly** (iteration 2's change 3). The classifier only reports records outside the lineage's dispatch window, so intra-window in-process iteration cannot trigger it, and the non-empty summary fold already exists. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:5] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Escalating the already-computed timestamp anomaly** (iteration 2's change 3). The classifier only reports records outside the lineage's dispatch window, so intra-window in-process iteration cannot trigger it, and the non-empty summary fold already exists. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:5]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Escalating the already-computed timestamp anomaly** (iteration 2's change 3). The classifier only reports records outside the lineage's dispatch window, so intra-window in-process iteration cannot trigger it, and the non-empty summary fold already exists. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:5]

### **Guarding resume** by re-validating a persisted `fanout.executors`. No code reads that field; adding a reader would create the surface it is meant to police. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Guarding resume** by re-validating a persisted `fanout.executors`. No code reads that field; adding a reader would create the surface it is meant to police. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Guarding resume** by re-validating a persisted `fanout.executors`. No code reads that field; adding a reader would create the surface it is meant to police. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]

### **Keying the guard to the documented flags** (`--executor`, `--executors`, `--count`). The script is entered through `--fanout-config-json`, which none of those flags describe; a flag-level guard is bypassable by construction. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:229] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Keying the guard to the documented flags** (`--executor`, `--executors`, `--count`). The script is entered through `--fanout-config-json`, which none of those flags describe; a flag-level guard is bypassable by construction. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:229]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Keying the guard to the documented flags** (`--executor`, `--executors`, `--count`). The script is entered through `--fanout-config-json`, which none of those flags describe; a flag-level guard is bypassable by construction. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:229]

### **Labelling instead of refusing, by itself.** `fanout-run.cjs` already emits a summary the incident's session read; it read "succeeded" and moved on. A new label in the same object is not more visible than the fields already there. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4273] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Labelling instead of refusing, by itself.** `fanout-run.cjs` already emits a summary the incident's session read; it read "succeeded" and moved on. A new label in the same object is not more visible than the fields already there. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4273]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Labelling instead of refusing, by itself.** `fanout-run.cjs` already emits a summary the incident's session read; it read "succeeded" and moved on. A new label in the same object is not more visible than the fields already there. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4273]

### **Pricing the escape flag from the stress suite alone** (iteration 4's Finding 5). The unit suite spawns with a one-entry matrix too, so the cost estimate was low and the test template better than the one assumed. (Finding 3) -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Pricing the escape flag from the stress suite alone** (iteration 4's Finding 5). The unit suite spawns with a one-entry matrix too, so the cost estimate was low and the test template better than the one assumed. (Finding 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pricing the escape flag from the stress suite alone** (iteration 4's Finding 5). The unit suite spawns with a one-entry matrix too, so the cost estimate was low and the test template better than the one assumed. (Finding 3)

### **Promoting `render-command-contract.cjs` into the runner.** It renders command *contracts* from a manifest of legacy bodies; it never parses step blocks or executes a step. Sharing its importer would not shorten the driver. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Promoting `render-command-contract.cjs` into the runner.** It renders command *contracts* from a manifest of legacy bodies; it never parses step blocks or executes a step. Sharing its importer would not shorten the driver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Promoting `render-command-contract.cjs` into the runner.** It renders command *contracts* from a manifest of legacy bodies; it never parses step blocks or executes a step. Sharing its importer would not shorten the driver.

### **Requiring two entries in the YAML's `skip_when` instead of in the script.** It would have to be written twice (research and review), would leave the direct script call untouched — which is exactly how the incident happened — and `skip_when` fails open. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Requiring two entries in the YAML's `skip_when` instead of in the script.** It would have to be written twice (research and review), would leave the direct script call untouched — which is exactly how the incident happened — and `skip_when` fails open. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Requiring two entries in the YAML's `skip_when` instead of in the script.** It would have to be written twice (research and review), would leave the direct script call untouched — which is exactly how the incident happened — and `skip_when` fails open. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]

### **Reusing the YAML's `cli-deepseek-harness` refusal as the only enforcement**, i.e. making single-lineage fan-out a per-executor-kind rule in the workflow instead of a runner rule. It is one layer above the direct script call that caused the incident, so the incident's route would still be open. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reusing the YAML's `cli-deepseek-harness` refusal as the only enforcement**, i.e. making single-lineage fan-out a per-executor-kind rule in the workflow instead of a runner rule. It is one layer above the direct script call that caused the incident, so the incident's route would still be open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reusing the YAML's `cli-deepseek-harness` refusal as the only enforcement**, i.e. making single-lineage fan-out a per-executor-kind rule in the workflow instead of a runner rule. It is one layer above the direct script call that caused the incident, so the incident's route would still be open.

### **Searching for a resume path that reconstructs the fan-out matrix.** `rg` over `.skilled/` for readers of a persisted `fanout.executors` returns only tests and playbooks; `deep-research-auto.yaml` references `config.fanout` only at its three spawn/skip guards. There is no reconstruction path to guard, and none to break. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Searching for a resume path that reconstructs the fan-out matrix.** `rg` over `.skilled/` for readers of a persisted `fanout.executors` returns only tests and playbooks; `deep-research-auto.yaml` references `config.fanout` only at its three spawn/skip guards. There is no reconstruction path to guard, and none to break.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for a resume path that reconstructs the fan-out matrix.** `rg` over `.skilled/` for readers of a persisted `fanout.executors` returns only tests and playbooks; `deep-research-auto.yaml` references `config.fanout` only at its three spawn/skip guards. There is no reconstruction path to guard, and none to break.

### **Searching the rule docs for a numeric fan-out trigger.** `rg -i 'fan-out|fanout|lineage'` over `delegation-and-orchestration.md` returns three lines, none of them a trigger definition. There is no second enforcement sentence to align and none to break. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Searching the rule docs for a numeric fan-out trigger.** `rg -i 'fan-out|fanout|lineage'` over `delegation-and-orchestration.md` returns three lines, none of them a trigger definition. There is no second enforcement sentence to align and none to break.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching the rule docs for a numeric fan-out trigger.** `rg -i 'fan-out|fanout|lineage'` over `delegation-and-orchestration.md` returns three lines, none of them a trigger definition. There is no second enforcement sentence to align and none to break.

### **Touching `.skilled/repo-rules/delegation-and-orchestration.md` or `AGENTS.md` for the trigger.** The rule file never states the trigger; adding a second statement would create the drift the change exists to remove. (Finding 5) -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Touching `.skilled/repo-rules/delegation-and-orchestration.md` or `AGENTS.md` for the trigger.** The rule file never states the trigger; adding a second statement would create the drift the change exists to remove. (Finding 5)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Touching `.skilled/repo-rules/delegation-and-orchestration.md` or `AGENTS.md` for the trigger.** The rule file never states the trigger; adding a second statement would create the drift the change exists to remove. (Finding 5)

### **Treating the one-entry in-tree packet as a counter-example that invalidates change 1.** It is the incident shape with a different executor; under the policy in the docs it was never legal. It becomes the change's one real cost, not its refutation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating the one-entry in-tree packet as a counter-example that invalidates change 1.** It is the incident shape with a different executor; under the policy in the docs it was never legal. It becomes the change's one real cost, not its refutation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the one-entry in-tree packet as a counter-example that invalidates change 1.** It is the incident shape with a different executor; under the policy in the docs it was never legal. It becomes the change's one real cost, not its refutation.

### **Using `fanout-run.cjs`'s `status` field as a workflow verdict.** Already ruled out in iteration 2 and re-confirmed here at the exit-code line: the code is a function of `fulfilled`/`rejected` only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Using `fanout-run.cjs`'s `status` field as a workflow verdict.** Already ruled out in iteration 2 and re-confirmed here at the exit-code line: the code is a function of `fulfilled`/`rejected` only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using `fanout-run.cjs`'s `status` field as a workflow verdict.** Already ruled out in iteration 2 and re-confirmed here at the exit-code line: the code is a function of `fulfilled`/`rejected` only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272]

### Looking for a council-side fan-out guard in `deep-ai-council/SKILL.md`: the mode document contains no fan-out or workflow-fidelity language; the council inherits whatever `orchestrate-session.cjs` and `fanout-run.cjs` do. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a council-side fan-out guard in `deep-ai-council/SKILL.md`: the mode document contains no fan-out or workflow-fidelity language; the council inherits whatever `orchestrate-session.cjs` and `fanout-run.cjs` do.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a council-side fan-out guard in `deep-ai-council/SKILL.md`: the mode document contains no fan-out or workflow-fidelity language; the council inherits whatever `orchestrate-session.cjs` and `fanout-run.cjs` do.

### Searching for a packet-level workflow receipt comparable to `dispatch-receipts/`: receipts exist per *iteration dispatch* under the lineage, not per workflow phase. There is no phase receipt to look for, so "check the receipt" is not available for `phase_init`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a packet-level workflow receipt comparable to `dispatch-receipts/`: receipts exist per *iteration dispatch* under the lineage, not per workflow phase. There is no phase receipt to look for, so "check the receipt" is not available for `phase_init`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a packet-level workflow receipt comparable to `dispatch-receipts/`: receipts exist per *iteration dispatch* under the lineage, not per workflow phase. There is no phase receipt to look for, so "check the receipt" is not available for `phase_init`.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **"`fanout-merge.cjs`'s `status: ok` is a workflow verdict."** It is a merge verdict: refusals are limited to reducer-provenance and near-line pairs, and `status: 'ok'` is emitted unconditionally once the registry writes succeed. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1530] (iteration 1)
- **"`validate.sh` would have caught it."** It validates packet document structure. A run that skipped `phase_init` and `phase_save` leaves the packet documents untouched, which is exactly the state validation accepts. (iteration 1)
- **"The 2,539-line YAML is the enforcement."** Verified false: the YAML contains commands and prose, but nothing validates that `phase_init` or `phase_save` ran. Its checks fire only for a session already walking its steps. (iteration 1)
- **"The lock catches non-workflow runs."** A lock only reports contention against a lock; a run that never calls `loop-lock.cjs` leaves nothing to contend with. Absence of a lock is not an observable the current code tests. (iteration 1)
- Looking for a council-side fan-out guard in `deep-ai-council/SKILL.md`: the mode document contains no fan-out or workflow-fidelity language; the council inherits whatever `orchestrate-session.cjs` and `fanout-run.cjs` do. (iteration 1)
- Searching for a packet-level workflow receipt comparable to `dispatch-receipts/`: receipts exist per *iteration dispatch* under the lineage, not per workflow phase. There is no phase receipt to look for, so "check the receipt" is not available for `phase_init`. (iteration 1)
- **`fanoutConfigSchema.executors` minimum of two.** Wrong layer and expensive: it is the shared parse contract for tests, resume and the reducer, and single-entry arrays are used there for reasons unrelated to the policy. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533] (iteration 2)
- **A gateway precondition ("iteration record requires a live lock").** Fires on the incident's path, but reaches every lineage, every mode and every resume, and is designed to be non-blocking — it cannot stop a run. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:494] (iteration 2)
- **A hook as the enforcement surface.** Six runtime-specific adapters, all prompt-time context injection; reproduces prose at maximum cost. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53] (iteration 2)
- **A post-run completion assertion hosted anywhere in the runtime scripts.** Nothing in the incident's route calls a runtime script at the end, so a new assertion in any of them would inherit the same "not reached" property as every check iteration 1 mapped. (iteration 2)
- **Labelling instead of refusing, by itself.** `fanout-run.cjs` already emits a summary the incident's session read; it read "succeeded" and moved on. A new label in the same object is not more visible than the fields already there. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4273] (iteration 2)
- **Promoting `render-command-contract.cjs` into the runner.** It renders command *contracts* from a manifest of legacy bodies; it never parses step blocks or executes a step. Sharing its importer would not shorten the driver. (iteration 2)
- **A packet-level "did this run walk the workflow" receipt to check afterwards.** The only receipt writer in the repository is the YAML dispatch step (`receiptDir` bound at eight places in the research YAML alone), so receipts mark the single-executor path and are legitimately absent on fan-out. Building a fan-out receipt would be a new artifact, not an existing check. (iteration 3)
- **Escalating the already-computed timestamp anomaly** (iteration 2's change 3). The classifier only reports records outside the lineage's dispatch window, so intra-window in-process iteration cannot trigger it, and the non-empty summary fold already exists. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:5] (iteration 3)
- **Keying the guard to the documented flags** (`--executor`, `--executors`, `--count`). The script is entered through `--fanout-config-json`, which none of those flags describe; a flag-level guard is bypassable by construction. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:229] (iteration 3)
- **Requiring two entries in the YAML's `skip_when` instead of in the script.** It would have to be written twice (research and review), would leave the direct script call untouched — which is exactly how the incident happened — and `skip_when` fails open. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223] (iteration 3)
- **Using `fanout-run.cjs`'s `status` field as a workflow verdict.** Already ruled out in iteration 2 and re-confirmed here at the exit-code line: the code is a function of `fulfilled`/`rejected` only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272] (iteration 3)
- **A distinct-base-label guard** ("refuse when fewer than two labels are declared"). It runs before replica expansion in effect, so it would refuse a single `--executor X --count 5`, which the presentation asset documents as native fan-out. [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71] (iteration 4)
- **Guarding resume** by re-validating a persisted `fanout.executors`. No code reads that field; adding a reader would create the surface it is meant to police. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223] (iteration 4)
- **Reusing the YAML's `cli-deepseek-harness` refusal as the only enforcement**, i.e. making single-lineage fan-out a per-executor-kind rule in the workflow instead of a runner rule. It is one layer above the direct script call that caused the incident, so the incident's route would still be open. (iteration 4)
- **Searching for a resume path that reconstructs the fan-out matrix.** `rg` over `.skilled/` for readers of a persisted `fanout.executors` returns only tests and playbooks; `deep-research-auto.yaml` references `config.fanout` only at its three spawn/skip guards. There is no reconstruction path to guard, and none to break. (iteration 4)
- **Treating the one-entry in-tree packet as a counter-example that invalidates change 1.** It is the incident shape with a different executor; under the policy in the docs it was never legal. It becomes the change's one real cost, not its refutation. (iteration 4)
- **Pricing the escape flag from the stress suite alone** (iteration 4's Finding 5). The unit suite spawns with a one-entry matrix too, so the cost estimate was low and the test template better than the one assumed. (Finding 3) (iteration 5)
- **Searching the rule docs for a numeric fan-out trigger.** `rg -i 'fan-out|fanout|lineage'` over `delegation-and-orchestration.md` returns three lines, none of them a trigger definition. There is no second enforcement sentence to align and none to break. (iteration 5)
- **Touching `.skilled/repo-rules/delegation-and-orchestration.md` or `AGENTS.md` for the trigger.** The rule file never states the trigger; adding a second statement would create the drift the change exists to remove. (Finding 5) (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Unasked but open: does the *correct* fan-out path ever write `config.status: complete` at packet level, given `step_update_config_status` lives in `phase_synthesis` and fan-out reaches `phase_synthesis`? This decides whether a status check would be a safe gate or a false-positive generator. (iteration 1)
- What is the smallest set of changes, and what should not be built? (iteration 1)
- Which existing checks could have caught the incident before or after the run, and why did each not fire? (Largely answered as a by-product here; the positive case — what would have fired on the driver path too — is not yet tested.) (iteration 1)
- What are the candidate fixes, their cost, their cost on the seven runtimes, and their behaviour in a dispatched child? (iteration 1)
- Which existing checks could have caught the incident before or after the run, and why did each not fire? (Iteration 1 answered the negative case; this iteration adds the positive half — the status field would catch it after the fact, the gateway cannot stop a run — but the four named checks have still not been tested against the driver path.) (iteration 2)
- What is the smallest set of changes to existing files that keeps a chat-started loop on its workflow, how does it apply to deep-review and ai-council, and what should not be built? (Now priceable from Findings 1–9; not yet assembled into a recommendation.) (iteration 2)
- Should the refusal be unconditional by default with `--allow-single-lineage` as the only escape, or should the escape be a config field? A flag matches the file's existing style (`FANOUT_FLAGS`, `assertKnownFlags`) and needs no schema change; the fixture cost is identical either way. (iteration 3)
- Should a legitimate fan-out run execute packet-level `phase_init` and `phase_save` at all, given it is defined as skipping them? (Named in Finding 8 as out of this set's scope.) (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The incident record and the driver named in the topic are first-hand evidence from this session. The previous generation of this packet's research is archived under research_archive/ and concerns a different question; do not cite it. Constraints: no new command, agent or document unless a cheaper move is shown to fail; a change must keep a legitimate fan-out run working.

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: [from config.lineage.generation]
- Started: [timestamp]
