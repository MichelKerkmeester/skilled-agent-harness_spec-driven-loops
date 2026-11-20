# Deep Research Strategy - Expansive-Depth Simplification Study

## 1. OVERVIEW

### Purpose

Persistent brain for the deep-research lineage that studies how to make the expansive-depth deep-loop modes (research and review) and their runtime simpler, cheaper, easier to operate and identical across CLI runtimes, ranked by value over effort.

### Usage

- Init: this file is populated with Topic, Key Questions, Known Context and Research Boundaries.
- Per iteration: the leaf reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions and Next Focus.

### Question Injection Surface

Questions arrive through `inbox.jsonl`; frontier seeds were dealt to this lineage before iteration 1.

---

## 2. TOPIC

What changes would make the expansive-depth deep-loop modes (research and review), and the deep-loop runtime behind them, simpler, cheaper, easier to operate and identical across CLI runtimes, ranked by value over effort? Read the code at HEAD d4420e9510d. The fan-out review in `review/review-report.md` and the fix commits `a424fb6cd8a..d4420e9510d` already closed that review's findings; build on them and do not re-report them. Every recommendation names one concrete change, cites file:line (or a source URL for prior art), and states value, effort (S/M/L) and risk.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What can be deleted, merged or collapsed across runtime/scripts/frontier-admit.cjs, both reduce-state.cjs reducers, runtime/scripts/convergence.cjs, runtime/scripts/fanout-run.cjs and the two workflow YAMLs while every promise stays kept?
- [ ] How discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview, and how does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage?
- [ ] Where do the cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences?
- [ ] What do the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split cost in the measured runs under the spec folder's review/ and review-archive/ and the live playbook logs, and which change cuts the most time or money?
- [x] Should research count stuck passes per frontier node as review now does, does the lineage completion check break resume and extend for older committed research lineages, and is there a cheap design that makes pivot admission into the frontier work?
- [x] How do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out?
- [x] Operator UX: how discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview? How does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage?
- [x] Cross-CLI parity: where do cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences?
- [x] Cost and latency: what do the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split cost in the measured runs under the spec folder's review/ and review-archive/ and the live playbook logs, and which change cuts the most time or money?
- [x] What does a partially complete fan-out run tell the operator: does the summary name the failed lineage, its failure class and the exact command to rerun just that lineage?
- [x] Do the research and review dashboards expose per-frontier-node budget spend and visit counts, or only lineage-wide iteration totals?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement any recommendation; report only.
- Do not re-report the findings of the fan-out review in `review/review-report.md` or regressions already fixed in `a424fb6cd8a..d4420e9510d`.
- Do not modify any file outside the lineage directory.
- Do not evaluate the quality of the product surface reviewed by that fan-out; evaluate the deep-loop runtime and its operator contract.

---

## 5. STOP CONDITIONS

- Legal convergence from `convergence.cjs` with the expansive frontier terminal, or `maxIterations` 10.
- Every frontier node bound to this lineage (F-1-002, F-1-004, F-1-006) either answered or closed by the budget/reducer.
- Wall-clock ceiling 120 minutes.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What can be deleted, merged or collapsed across runtime/scripts/frontier-admit.cjs, both reduce-state.cjs reducers, runtime/scripts/convergence.cjs, runtime/scripts/fanout-run.cjs and the two workflow YAMLs while every promise stays kept?
- Should research count stuck passes per frontier node as review now does, does the lineage completion check break resume and extend for older committed research lineages, and is there a cheap design that makes pivot admission into the frontier work?
- How do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out?
- Operator UX: how discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview? How does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage?
- Cross-CLI parity: where do cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences?
- What does a partially complete fan-out run tell the operator: does the summary name the failed lineage, its failure class and the exact command to rerun just that lineage?
- Do the research and review dashboards expose per-frontier-node budget spend and visit counts, or only lineage-wide iteration totals?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the two command surfaces side by side exposed the one-sided collapse immediately, and reading `fanout-run.cjs` from the preview path into the completion check showed the rerun gap end to end. (iteration 1)
- reading the capability matrices before the workers showed that parity is mostly encoded already, which turned the question from "invent a contract" into "publish the contract you have". (iteration 2)
- measuring `createdAt` against the first iteration timestamp turned "setup feels slow" into a 3-10 minute range, and reading the playbook token rows exposed cache-read as the dominant term. (iteration 3)
- using this lineage's own dashboard as evidence turned the budget-split arithmetic into an observed fact rather than a projection. (iteration 4)
- comparing the two claude branches line by line found the permission mismatch, which no matrix could reveal because both branches claim to honor `sandboxMode`. (iteration 5)
- following the exit code from the pool to the YAML found the missing merge path, which is a larger failure than the summary's missing labels. (iteration 6)
- diffing the two frontier projection functions found a one-field gap that explains the dashboard difference and costs almost nothing to close. (iteration 7)
- counting the built-by-hand versus built-by-adapter handlers turned "parity" into a deletion with a defect fix attached. (iteration 8)
- scanning the committed state logs turned a remembered "3 of 12" into a measured 31 of 104 with a report, which changes the severity and the right fix. (iteration 9)
- reading the production write-up beside this runtime's own seed and admission rules made the missing effort-scaling table obvious. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the recovery search for a documented one-lineage rerun flag found no flag, then no text, because the mechanism is absent rather than hidden. (iteration 1)
- looking for per-kind resume or log differences found none; the asymmetry is concentrated in the YAML branches and the worker's kind checks. (iteration 2)
- the playbooks do not separate setup from iteration time, so the two readings of "8-11 minute" had to be reported side by side. (iteration 3)
- looking for a fan-out recovery section in the command docs found none, which confirms the gap rather than disproving it. (iteration 4)
- the failure-class pass found no new class beyond iteration 2, so the finding was folded into the adapter-table recommendation instead of restated. (iteration 5)
- searching the committed summary for per-lineage fields found none because the writer never serializes `results`. (iteration 6)
- looking for a per-node table in the review dashboard found none; the review reducer has the data but does not render it either. (iteration 7)
- looking for dead branches found none; the duplication is live code on both paths, which is why it drifted. (iteration 8)
- looking for a research active-node field found none, so the stuck-scoping fix is two-part rather than one line. (iteration 9)
- searching for a published per-node stuck rule found none; the local per-node counter is already the stronger design. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding a new registry file: the projection is the right carrier; it already has the visit function. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Adding a new registry file: the projection is the right carrier; it already has the visit function.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new registry file: the projection is the right carrier; it already has the visit function.

### Admitting pivot candidates with a full reworked transaction: the three D-011-10 blockers each have a one-line answer; a transaction rewrite is not needed. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Admitting pivot candidates with a full reworked transaction: the three D-011-10 blockers each have a one-line answer; a transaction rewrite is not needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Admitting pivot candidates with a full reworked transaction: the three D-011-10 blockers each have a one-line answer; a transaction rewrite is not needed.

### Adopting a full MCTS search (LATS-style) for the frontier: the measured runs are 10-24 iterations, too shallow for tree search to pay for its branching overhead; a priority field is the cheap 80%. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Adopting a full MCTS search (LATS-style) for the frontier: the measured runs are 10-24 iterations, too shallow for tree search to pay for its branching overhead; a priority field is the cheap 80%.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting a full MCTS search (LATS-style) for the frontier: the measured runs are 10-24 iterations, too shallow for tree search to pay for its branching overhead; a priority field is the cheap 80%.

### Blaming fan-out concurrency for the 429: the review run used concurrency 2 and the quota failure hit one lineage; the recovery gap is the real defect, and iteration 1 already records it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Blaming fan-out concurrency for the 429: the review run used concurrency 2 and the quota failure hit one lineage; the recovery gap is the real defect, and iteration 1 already records it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blaming fan-out concurrency for the 429: the review run used concurrency 2 and the quota failure hit one lineage; the recovery gap is the real defect, and iteration 1 already records it.

### Claiming both dashboards hide band spend: both print the three bands and their allotments; the missing piece is per-node detail and the active-node line. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Claiming both dashboards hide band spend: both print the three bands and their allotments; the missing piece is per-node detail and the active-node line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming both dashboards hide band spend: both print the three bands and their allotments; the missing piece is per-node detail and the active-node line.

### Claiming the dashboard hides band spend: it prints all three bands and their allotments; the missing dimension is per-node detail, not the band budget. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Claiming the dashboard hides band spend: it prints all three bands and their allotments; the missing dimension is per-node detail, not the band budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming the dashboard hides band spend: it prints all three bands and their allotments; the missing dimension is per-node detail, not the band budget.

### Claiming the six YAML branches need different arguments: only claude (config dir) and dsh (spec folder) add a flag, and both are already optional in the shared script. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Claiming the six YAML branches need different arguments: only claude (config dir) and dsh (spec folder) add a flag, and both are already optional in the shared script.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming the six YAML branches need different arguments: only claude (config dir) and dsh (spec folder) add a flag, and both are already optional in the shared script.

### Collapsing the two reducers into one file: the review reducer carries dimension coverage and the research reducer carries novelty questions; the shared part is the frontier projection, not the whole reducer. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Collapsing the two reducers into one file: the review reducer carries dimension coverage and the research reducer carries novelty questions; the shared part is the frontier projection, not the whole reducer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Collapsing the two reducers into one file: the review reducer carries dimension coverage and the research reducer carries novelty questions; the shared part is the frontier projection, not the whole reducer.

### Copying Anthropic's synchronous lead-agent loop: this runtime already has the fan-out pool and per-lineage state, so the transferable part is the effort-scaling table and the checkpoint/resume discipline, not the topology. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Copying Anthropic's synchronous lead-agent loop: this runtime already has the fan-out pool and per-lineage state, so the transferable part is the effort-scaling table and the checkpoint/resume discipline, not the topology.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Anthropic's synchronous lead-agent loop: this runtime already has the fan-out pool and per-lineage state, so the transferable part is the effort-scaling table and the checkpoint/resume discipline, not the topology.

### Deleting `frontier-admit.cjs` as a whole: it is shared by both reducers and both loops, so it is the one place the frontier rules already live; the duplication is around it, not inside it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Deleting `frontier-admit.cjs` as a whole: it is shared by both reducers and both loops, so it is the one place the frontier rules already live; the duplication is around it, not inside it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting `frontier-admit.cjs` as a whole: it is shared by both reducers and both loops, so it is the one place the frontier rules already live; the duplication is around it, not inside it.

### Looking for a published stuck-detection rule in these systems: Anthropic handles failure with retries and checkpoints, LangChain with iteration caps, ToT with evaluation; none publishes a per-node stuck counter, so this runtime's per-node counter is ahead of the public prior art and should be kept. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a published stuck-detection rule in these systems: Anthropic handles failure with retries and checkpoints, LangChain with iteration caps, ToT with evaluation; none publishes a per-node stuck counter, so this runtime's per-node counter is ahead of the public prior art and should be kept.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a published stuck-detection rule in these systems: Anthropic handles failure with retries and checkpoints, LangChain with iteration caps, ToT with evaluation; none publishes a per-node stuck counter, so this runtime's per-node counter is ahead of the public prior art and should be kept.

### Looking for a research `activeNodeId` in the registry: the research projection does not emit one, which is why the node-scoped counter cannot be enabled by a flag alone. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a research `activeNodeId` in the registry: the research projection does not emit one, which is why the node-scoped counter cannot be enabled by a flag alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a research `activeNodeId` in the registry: the research projection does not emit one, which is why the node-scoped counter cannot be enabled by a flag alone.

### Looking for a review-specific claude builder in the fan-out path: there is one builder for both loops, which is exactly why the single-executor branch diverged unnoticed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a review-specific claude builder in the fan-out path: there is one builder for both loops, which is exactly why the single-executor branch diverged unnoticed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a review-specific claude builder in the fan-out path: there is one builder for both loops, which is exactly why the single-executor branch diverged unnoticed.

### Looking for a shared YAML macro system: the workflow format has no include mechanism, so duplication must be collapsed at the step level, not by templating. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a shared YAML macro system: the workflow format has no include mechanism, so duplication must be collapsed at the step level, not by templating.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a shared YAML macro system: the workflow format has no include mechanism, so duplication must be collapsed at the step level, not by templating.

### Looking for an `on_failure` branch in `step_fanout_spawn`: there is none, so the parent has no partial path to take. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for an `on_failure` branch in `step_fanout_spawn`: there is none, so the parent has no partial path to take.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an `on_failure` branch in `step_fanout_spawn`: there is none, so the parent has no partial path to take.

### Proposing a new config schema: `executor-config.ts` is already the single schema; the gap is that two derived facts (enforcement class, effort application) are not carried into the output. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Proposing a new config schema: `executor-config.ts` is already the single schema; the gap is that two derived facts (enforcement class, effort application) are not carried into the output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing a new config schema: `executor-config.ts` is already the single schema; the gap is that two derived facts (enforcement class, effort application) are not carried into the output.

### Proposing a new summary file: `orchestration-summary.json` is already the operator's terminal artifact; it only needs the per-lineage array. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Proposing a new summary file: `orchestration-summary.json` is already the operator's terminal artifact; it only needs the per-lineage array.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing a new summary file: `orchestration-summary.json` is already the operator's terminal artifact; it only needs the per-lineage array.

### Reading the presentation assets as an independent intake surface: they restate the same long-form budget prose as `research.md`, so collapsing `research.md:107` to a pointer does not remove the last copy, it moves the copy to the asset that already owns setup detail. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the presentation assets as an independent intake surface: they restate the same long-form budget prose as `research.md`, so collapsing `research.md:107` to a pointer does not remove the last copy, it moves the copy to the asset that already owns setup detail.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the presentation assets as an independent intake surface: they restate the same long-form budget prose as `research.md`, so collapsing `research.md:107` to a pointer does not remove the last copy, it moves the copy to the asset that already owns setup detail.

### Requiring a new recovery command: the runner already holds every input a rerun needs, so the fix is serialization, not a new workflow. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Requiring a new recovery command: the runner already holds every input a rerun needs, so the fix is serialization, not a new workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Requiring a new recovery command: the runner already holds every input a rerun needs, so the fix is serialization, not a new workflow.

### Searching for a documented fan-out resume procedure in `research.md`: the command doc covers `--lineage-mode=resume` and `--extend` for a single run, but has no fan-out recovery section; the only evidence of the real procedure is the committed recovery config. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching for a documented fan-out resume procedure in `research.md`: the command doc covers `--lineage-mode=resume` and `--extend` for a single run, but has no fan-out recovery section; the only evidence of the real procedure is the committed recovery config.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a documented fan-out resume procedure in `research.md`: the command doc covers `--lineage-mode=resume` and `--extend` for a single run, but has no fan-out recovery section; the only evidence of the real procedure is the committed recovery config.

### Searching for a literal "8-11 minute setup" string: the only match is a retired tool-call budget in a changelog; the setup-time reading has no textual anchor. The cost node must measure per-iteration wall clock instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a literal "8-11 minute setup" string: the only match is a retired tool-call budget in a changelog; the setup-time reading has no textual anchor. The cost node must measure per-iteration wall clock instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a literal "8-11 minute setup" string: the only match is a retired tool-call budget in a changelog; the setup-time reading has no textual anchor. The cost node must measure per-iteration wall clock instead.

### Searching for a measured setup time in the playbooks: the only figure recorded is per-iteration cost, so setup had to be measured from the committed `createdAt` and first-iteration timestamps. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching for a measured setup time in the playbooks: the only figure recorded is per-iteration cost, so setup had to be measured from the committed `createdAt` and first-iteration timestamps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a measured setup time in the playbooks: the only figure recorded is per-iteration cost, so setup had to be measured from the committed `createdAt` and first-iteration timestamps.

### Searching for a review-side per-node table in the committed review dashboard: it reports the same aggregate size and revisits, so the per-node table is absent on both sides, not only in research. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Searching for a review-side per-node table in the committed review dashboard: it reports the same aggregate size and revisits, so the per-node table is absent on both sides, not only in research.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a review-side per-node table in the committed review dashboard: it reports the same aggregate size and revisits, so the per-node table is absent on both sides, not only in research.

### Searching for dead `if_cli_*` branches: all eight are reachable, so the deletion is a merge, not a dead-code removal. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Searching for dead `if_cli_*` branches: all eight are reachable, so the deletion is a merge, not a dead-code removal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for dead `if_cli_*` branches: all eight are reachable, so the deletion is a merge, not a dead-code removal.

### Searching for per-kind resume flags: resume is config-driven for every kind through `readStoredLineageSessionId`, so there is nothing to unify. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for per-kind resume flags: resume is config-driven for every kind through `readStoredLineageSessionId`, so there is nothing to unify.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for per-kind resume flags: resume is config-driven for every kind through `readStoredLineageSessionId`, so there is nothing to unify.

### Treating `--frontier-max-depth`/`--frontier-max-nodes` refusal as an undocumented trap: both command docs and both presentation assets state the fan-out refusal at the flag row, so the surface is documented even though the refusal is only visible by running a dry run. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `--frontier-max-depth`/`--frontier-max-nodes` refusal as an undocumented trap: both command docs and both presentation assets state the fan-out refusal at the flag row, so the surface is documented even though the refusal is only visible by running a dry run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--frontier-max-depth`/`--frontier-max-nodes` refusal as an undocumented trap: both command docs and both presentation assets state the fan-out refusal at the flag row, so the surface is documented even though the refusal is only visible by running a dry run.

### Treating exit 2 as a deliberate safety stop: it protects the merge from partial input but gives the operator no merge at all, which is the opposite of the failure's cost. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating exit 2 as a deliberate safety stop: it protects the merge from partial input but gives the operator no merge at all, which is the opposite of the failure's cost.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating exit 2 as a deliberate safety stop: it protects the merge from partial input but gives the operator no merge at all, which is the opposite of the failure's cost.

### Treating log shape as a parity gap: all kinds already write the same rotated `fanout-lineage.out/.err` pair, so no change is needed there. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating log shape as a parity gap: all kinds already write the same rotated `fanout-lineage.out/.err` pair, so no change is needed there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating log shape as a parity gap: all kinds already write the same rotated `fanout-lineage.out/.err` pair, so no change is needed there.

### Treating model price as the main lever: the measured cost is dominated by cache-read of unchanged context and by wall-clock latency, not by output tokens, so a cheaper model changes the multiplier, not the shape. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating model price as the main lever: the measured cost is dominated by cache-read of unchanged context and by wall-clock latency, not by output tokens, so a cheaper model changes the multiplier, not the shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating model price as the main lever: the measured cost is dominated by cache-read of unchanged context and by wall-clock latency, not by output tokens, so a cheaper model changes the multiplier, not the shape.

### Treating the forced `workspace-write` as a bug in the builder: the builder honors what it is given; the silent narrowing happens in the caller. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the forced `workspace-write` as a bug in the builder: the builder honors what it is given; the silent narrowing happens in the caller.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the forced `workspace-write` as a bug in the builder: the builder honors what it is given; the silent narrowing happens in the caller.

### Weakening the live completion check to fix the audit: a live attempt that writes nothing must still fail, so the fallback has to be scoped to a completed historical config. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Weakening the live completion check to fix the audit: a live attempt that writes nothing must still fail, so the fallback has to be scoped to a completed historical config.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Weakening the live completion check to fix the audit: a live attempt that writes nothing must still fail, so the fallback has to be scoped to a completed historical config.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Reading the presentation assets as an independent intake surface: they restate the same long-form budget prose as `research.md`, so collapsing `research.md:107` to a pointer does not remove the last copy, it moves the copy to the asset that already owns setup detail. (iteration 1)
- Searching for a literal "8-11 minute setup" string: the only match is a retired tool-call budget in a changelog; the setup-time reading has no textual anchor. The cost node must measure per-iteration wall clock instead. (iteration 1)
- Treating `--frontier-max-depth`/`--frontier-max-nodes` refusal as an undocumented trap: both command docs and both presentation assets state the fan-out refusal at the flag row, so the surface is documented even though the refusal is only visible by running a dry run. (iteration 1)
- Proposing a new config schema: `executor-config.ts` is already the single schema; the gap is that two derived facts (enforcement class, effort application) are not carried into the output. (iteration 2)
- Searching for per-kind resume flags: resume is config-driven for every kind through `readStoredLineageSessionId`, so there is nothing to unify. (iteration 2)
- Treating log shape as a parity gap: all kinds already write the same rotated `fanout-lineage.out/.err` pair, so no change is needed there. (iteration 2)
- Blaming fan-out concurrency for the 429: the review run used concurrency 2 and the quota failure hit one lineage; the recovery gap is the real defect, and iteration 1 already records it. (iteration 3)
- Searching for a measured setup time in the playbooks: the only figure recorded is per-iteration cost, so setup had to be measured from the committed `createdAt` and first-iteration timestamps. (iteration 3)
- Treating model price as the main lever: the measured cost is dominated by cache-read of unchanged context and by wall-clock latency, not by output tokens, so a cheaper model changes the multiplier, not the shape. (iteration 3)
- Claiming the dashboard hides band spend: it prints all three bands and their allotments; the missing dimension is per-node detail, not the band budget. (iteration 4)
- Proposing a new summary file: `orchestration-summary.json` is already the operator's terminal artifact; it only needs the per-lineage array. (iteration 4)
- Searching for a documented fan-out resume procedure in `research.md`: the command doc covers `--lineage-mode=resume` and `--extend` for a single run, but has no fan-out recovery section; the only evidence of the real procedure is the committed recovery config. (iteration 4)
- Claiming the six YAML branches need different arguments: only claude (config dir) and dsh (spec folder) add a flag, and both are already optional in the shared script. (iteration 5)
- Looking for a review-specific claude builder in the fan-out path: there is one builder for both loops, which is exactly why the single-executor branch diverged unnoticed. (iteration 5)
- Treating the forced `workspace-write` as a bug in the builder: the builder honors what it is given; the silent narrowing happens in the caller. (iteration 5)
- Looking for an `on_failure` branch in `step_fanout_spawn`: there is none, so the parent has no partial path to take. (iteration 6)
- Requiring a new recovery command: the runner already holds every input a rerun needs, so the fix is serialization, not a new workflow. (iteration 6)
- Treating exit 2 as a deliberate safety stop: it protects the merge from partial input but gives the operator no merge at all, which is the opposite of the failure's cost. (iteration 6)
- Adding a new registry file: the projection is the right carrier; it already has the visit function. (iteration 7)
- Claiming both dashboards hide band spend: both print the three bands and their allotments; the missing piece is per-node detail and the active-node line. (iteration 7)
- Searching for a review-side per-node table in the committed review dashboard: it reports the same aggregate size and revisits, so the per-node table is absent on both sides, not only in research. (iteration 7)
- Collapsing the two reducers into one file: the review reducer carries dimension coverage and the research reducer carries novelty questions; the shared part is the frontier projection, not the whole reducer. (iteration 8)
- Deleting `frontier-admit.cjs` as a whole: it is shared by both reducers and both loops, so it is the one place the frontier rules already live; the duplication is around it, not inside it. (iteration 8)
- Looking for a shared YAML macro system: the workflow format has no include mechanism, so duplication must be collapsed at the step level, not by templating. (iteration 8)
- Searching for dead `if_cli_*` branches: all eight are reachable, so the deletion is a merge, not a dead-code removal. (iteration 8)
- Admitting pivot candidates with a full reworked transaction: the three D-011-10 blockers each have a one-line answer; a transaction rewrite is not needed. (iteration 9)
- Looking for a research `activeNodeId` in the registry: the research projection does not emit one, which is why the node-scoped counter cannot be enabled by a flag alone. (iteration 9)
- Weakening the live completion check to fix the audit: a live attempt that writes nothing must still fail, so the fallback has to be scoped to a completed historical config. (iteration 9)
- Adopting a full MCTS search (LATS-style) for the frontier: the measured runs are 10-24 iterations, too shallow for tree search to pay for its branching overhead; a priority field is the cheap 80%. (iteration 10)
- Copying Anthropic's synchronous lead-agent loop: this runtime already has the fan-out pool and per-lineage state, so the transferable part is the effort-scaling table and the checkpoint/resume discipline, not the topology. (iteration 10)
- Looking for a published stuck-detection rule in these systems: Anthropic handles failure with retries and checkpoints, LangChain with iteration caps, ToT with evaluation; none publishes a per-node stuck counter, so this runtime's per-node counter is ahead of the public prior art and should be kept. (iteration 10)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis: rank the recommendations by value over effort, merge duplicates, and state the one change that buys the most for the least.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Research packet: `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/`.
- Prior fan-out review: `review/review-report.md` (verdict CONDITIONAL; P1 4, P2 18) and its fix range `a424fb6cd8a..d4420e9510d`.
- Runtime code: `.skilled/skills/system-deep-loop/runtime/scripts/` (frontier-admit.cjs, convergence.cjs, fanout-run.cjs, fanout-merge.cjs, append-mode-event.cjs) and `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/` (executor-config.ts, lineage-timestamp-window.ts).
- Reducers: `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` and `.skilled/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` (confirm the review path).
- Workflows: `.skilled/commands/deep/assets/deep-research.yaml` and `deep-review.yaml`; operator surfaces `.skilled/commands/deep/research.md`, `review.md`, `assets/deep-research-presentation.txt`, `assets/deep-review-presentation.txt`.
- Decision records: `011-review-frontier-mode/decision-record.md` (D-011-10 pivot admission), `010-research-frontier-mode/decision-record.md`.
- Measured runs: `review/`, `review-archive/`, and the live playbook logs under `.skilled/skills/system-deep-loop/` playbooks.

### Bounded Context Snapshot

- Source pointers: as above; read the reducers' frontier projection and pick-focus functions first.
- Reuse candidates: shared `frontier-admit.cjs` helpers imported by both reducers.
- Integration points: `convergence.cjs` stop decision input, `fanout-run.cjs` completion check, executor adapters.
- Constraints: headless run; write only inside this lineage; no nested dispatch; no repo tooling that writes.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: false (synthesis owns research.md)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` (live), `fork` (deferred)
- Machine-owned sections: reducer controls 3, 6, 7-11A
- Question injection surface: `inbox.jsonl`
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-20T01:21:20Z
