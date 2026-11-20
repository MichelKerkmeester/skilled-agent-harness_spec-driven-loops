---
title: "deep-research: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the deep-research skill."
version: 1.16.9.0
---

# deep-research: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the manual testing contract for the `deep-research` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `manual-testing-playbook.md`
- `entry-points-and-modes/`
- `initialization-and-state-setup/`
- `iteration-execution-and-state-discipline/`
- `convergence-and-recovery/`
- `pause-resume-and-fault-tolerance/`
- `synthesis-save-and-guardrails/`
- `command-flow-stress-tests/`
- `fanout/`

---

## 1. OVERVIEW

This playbook provides 76 deterministic scenarios across 9 categories validating the current `deep-research` skill surface, including 6 CP-* command-flow stress tests. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and live source anchors.

### REALISTIC TEST MODEL

1. Start from the operator-visible research workflow, not a synthetic command matrix.
2. Validate public docs and command surfaces before deeper YAML or reducer contracts when that order matters.
3. Capture enough evidence that another operator can reproduce the verdict without re-deriving the scenario.
4. Report a concise user-facing verdict rather than raw implementation notes.

---

## 2. GLOBAL PRECONDITIONS

- `deep-research` skill exists at `.skilled/skills/system-deep-loop/deep-research/`.
- `/deep:research` command exists at `.skilled/commands/deep/research.md`.
- `@deep-research` agent definition exists at `.skilled/agents/deep-research.md` plus runtime variants.
- The deep-research workflow and reducer/runtime assets are available in the repository.

### Keeping live runs cheap

- Set `--max-iterations` to 2 or 3 explicitly. Left at its default, an expansive run sizes its budget from the seed and can reach 16 iterations for research and 24 for review; an explicit flag wins and skips the resize step.
- Cap the frontier with `--frontier-max-depth=2 --frontier-max-nodes=2`. Both flags take a positive integer, need `--depth-mode=expansive` on a single-executor run, and are written into `research/deep-research-config.json` at init. Without them the caps stay at `maxDepth` 3 and `maxFrontierNodes` null, and three iterations derive a node cap of 1.
- Seed exactly two depth-1 nodes. The seed step normally asks for three to six (three to eight for review), and `frontier-admit.cjs seed` accepts a two-row `frontier-seed.json`.
- Add `--convergence-mode=off` so the iteration count equals `--max-iterations`. An `--extend` run inherits the convergence mode of the run it extends.
- Use a tiny target: one narrow question answerable from repo files, or one file under 150 lines, such as `runtime/scripts/append-state-record.cjs` at 121 lines.
- Run one lineage. Fan-out multiplies the iteration budget and is not needed for a live check.
- Use the DeepSeek flash executor with `--executor=cli-opencode --model='opencode-go/deepseek-v4.1-flash#max'`. The cli-opencode self-invocation guard refuses it when the command is driven from inside an OpenCode session, so use the default native executor with the session model set instead.
- Reuse a finished run with `--extend=1` rather than paying for a fresh run and a new frontier. An extension creates no config, so a cap flag there has no effect and the run keeps the caps of the run it extends.
- Name the two sub-targets in the prompt. The workflow does not pause between config creation and the seed step: a single-executor research run seeds in `phase_init` after `step_create_config`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- A PASS, PARTIAL, or FAIL verdict with reasoning.
- Evidence captured from live file contents or generated artifacts.
- Cross-source consistency checks across README, quick reference, command, YAML, and reducer/state assets.
- The exact prompt used when orchestration behavior is part of the scenario.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Use `rg`, `sed`, and direct artifact inspection to gather deterministic evidence.
- Follow the prescribed order so user-facing documentation is checked before lower-level workflow contracts when sequencing matters.
- Keep the final verdict tied to captured evidence instead of inferred runtime behavior.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario is PASS only when the expected artifacts, prompts, workflow routing, and evidence all align.
- The feature files remain the source of execution truth when the root summary is intentionally terse.
- Release readiness depends on complete scenario coverage and no unresolved blocking contradictions.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Wave 1 covers entrypoint and initialization checks.
- Wave 2 covers iteration-state discipline and reducer/dashboard updates.
- Wave 3 covers convergence, quality guards, and stuck recovery.
- Wave 4 covers pause/resume, reconstruction, synthesis, memory save, and later-loop hardening.

---

## 7. ENTRY POINTS AND MODES

This category covers 8 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-001 | Auto mode deep-research kickoff

#### Description
Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint and the `deep-research.yaml` workflow.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the autonomous entrypoint for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /deep:research:auto is documented consistently across the README, quick reference, command entrypoint and the deep-research.yaml workflow. Return a concise user-facing pass/fail verdict with the expected artifact summary.

Expected signals: The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `research/research.md`.

#### Test Execution
> **Feature File:** [DR-001](../manual-testing-playbook/entry-points-and-modes/auto-mode-deep-research-kickoff.md)

### DR-002 | Confirm mode checkpointed execution

#### Description
Verify that confirm mode adds approval checkpoints without changing the core loop phases or artifact contract.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the confirm-mode contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /deep:research:confirm is documented as interactive, approval-gated, and still uses the same core loop and output artifacts as auto mode. Return a concise operator-facing verdict.

Expected signals: Confirm mode is interactive, approval-gated, and still routes through initialization, loop, synthesis, and save rather than a separate workflow.

#### Test Execution
> **Feature File:** [DR-002](../manual-testing-playbook/entry-points-and-modes/confirm-mode-checkpointed-execution.md)

### DR-003 | Parameterized invocation with --max-iterations and --convergence

#### Description
Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the setup-binding contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the command entrypoint gathers required values before loading YAML and that the YAML preflight rejects missing bindings or invalid spec-folder scope. Return a concise pass/fail verdict.

Expected signals: The command explicitly names topic, spec folder, execution mode, max iterations, and convergence threshold; YAML preflight verifies them before file writes.

#### Test Execution
> **Feature File:** [DR-003](../manual-testing-playbook/entry-points-and-modes/parameterized-invocation-max-iterations-convergence.md)

### DR-063 | Loop-wide dry-run

#### Description
Verify that `--dry-run` performs safe preflight reads and halts before dispatch, state mutation, reducer refresh, or child spawn.

#### Scenario Contract
Prompt summary: Validate deep-research dry-run flag parsing and workflow halt boundaries.

Expected signals: `--dry-run` normalizes to boolean input, non-mutating setup/read steps can run, and `dry_run_halt` events exist for dispatch, state-mutation, reducer-refresh, and child-spawn boundaries.

#### Test Execution
> **Feature File:** [DR-063](../manual-testing-playbook/entry-points-and-modes/loop-wide-dry-run.md)

### DR-065 | Completed-run extension with --extend

#### Description
Verify that `--extend=N` reopens a completed research run in the same session and generation, records one `run_extended` event, and snapshots the prior synthesis before the first new iteration.

#### Scenario Contract
Prompt summary: Extend a completed deep-research fixture run by three iterations and confirm the session identifier, the single extension event, the iteration cap and the synthesis snapshot.

Expected signals: One `run_extended` event projected as one `extended` row, the original `sessionId` and generation 1 kept, `maxIterations` at the prior count plus 3, a `completed-continue` lineage, one `synthesis-v*-r*.md` snapshot, no `resumed` row and exactly three new iterations.

#### Test Execution
> **Feature File:** [DR-065](../manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md)

### DR-068 | Expansive depth flag and default byte identity

#### Description
Verify that `--depth-mode` defaults to `default`, that `--depth-mode=expansive` is the only opt-in value and that a default run matches the pre-change baseline byte for byte, with the expansive-only agent paragraph as the only CLI lineage difference.

#### Scenario Contract
Prompt summary: Check that --depth-mode defaults to default and that a research run without the flag matches the pre-change baseline byte for byte. Name any byte that differs. Return a PASS or FAIL verdict with the reason.

Expected signals: The flag row names `default` as the value when the flag is absent, the config carries `"depthMode": "default"`, the golden suite passes 12 of 12 tests, and the only paragraph the comparison removes is the expansive-only persona paragraph in the CLI lineage prompt.

#### Test Execution
> **Feature File:** [DR-068](../manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md)

### DR-077 | Live expansive research with two frontier nodes

#### Description
Run a three-iteration expansive research on one narrow repo question with the frontier capped at two nodes, then check the node store, the dashboard section and the iteration count.

#### Scenario Contract
Prompt summary: Run a three-iteration expansive deep-research on which events the deep-research reducer projects from the ledger, with `--depth-mode=expansive --max-iterations=3 --convergence-mode=off`, a frontier capped at two nodes, and the DeepSeek flash executor.

Expected signals: Exactly two depth-1 node ids, no node deeper than two, the `## 6B. FRONTIER` dashboard section, exactly three iteration files, and `maxIterations` 3 with `expansiveDepth.maxDepth` and `maxFrontierNodes` both 2.

#### Test Execution
> **Feature File:** [DR-077](../manual-testing-playbook/entry-points-and-modes/live-expansive-research-two-node-frontier.md)

### DR-078 | Live extension of a finished expansive research run

#### Description
Extend the `DR-077` run by one iteration with `--extend=1` and check the same session, the single `extended` row, the synthesis snapshot and the unchanged frontier.

#### Scenario Contract
Prompt summary: Extend the completed expansive deep-research run from `DR-077` by one iteration with `--extend=1`, then confirm the same session and generation, the single extended event, the synthesis snapshot, the two frontier nodes and one more iteration file.

Expected signals: One `extended` row and no `resumed` row, the original `sessionId` and generation 1, `maxIterations` 4, `lineageMode` `completed-continue`, one `synthesis-v1-r3.md` snapshot, four iteration files and the same two node ids.

#### Test Execution
> **Feature File:** [DR-078](../manual-testing-playbook/entry-points-and-modes/live-extend-expansive-research-run.md)

---

## 8. INITIALIZATION AND STATE SETUP

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-004 | Fresh initialization creates canonical state files

#### Description
Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the fresh-initialization contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization creates deep-research-config.json, deep-research-state.jsonl, and deep-research-strategy.md from the live templates. Return a concise user-facing pass/fail verdict.

Expected signals: The scratch directory is created, config and strategy come from the shipped assets, and the JSONL begins with a config record.

#### Test Execution
> **Feature File:** [DR-004](../manual-testing-playbook/initialization-and-state-setup/fresh-initialization-creates-canonical-state-files.md)

### DR-005 | Resume classification from valid prior state

#### Description
Verify that the workflow classifies an existing valid scratch state as resumable before writing new files.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the resume-classification contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify config, JSONL, and strategy are inspected before new files are written and that a valid prior state skips re-initialization. Return a concise pass/fail verdict.

Expected signals: A four-state classification model exists, resume skips init writes, and completed sessions route differently from active resumes.

#### Test Execution
> **Feature File:** [DR-005](../manual-testing-playbook/initialization-and-state-setup/resume-classification-from-valid-prior-state.md)

### DR-006 | Invalid or contradictory state halts for repair

#### Description
Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the invalid-state halt contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify contradictory or partial deep-research artifacts stop the workflow for repair instead of guessing through initialization. Return a concise user-facing pass/fail verdict.

Expected signals: Invalid-state is a named class, the workflow halts in both execution modes with a repair message, and the docs do not promise silent guessing for contradictory state.

#### Test Execution
> **Feature File:** [DR-006](../manual-testing-playbook/initialization-and-state-setup/invalid-or-contradictory-state-halts-for-repair.md)

### DR-027 | Research charter validated at init

#### Description
Verify strategy.md contains Non-Goals and Stop Conditions sections after initialization.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the research charter validation contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization Step 5a verifies the presence of "Non-Goals" and "Stop Conditions" sections in strategy.md, appends empty placeholders if missing, and presents the charter for user review in confirm mode. Return a concise operator-facing verdict.

Expected signals: strategy.md has a "## 4. Non-Goals" section (may be empty but must exist); strategy.md has a "## 5. Stop Conditions" section (may be empty but must exist); if either section is missing, it is appended as an empty placeholder; in confirm mode, the charter (topic, key questions, non-goals, stop conditions) is presented for user review before proceeding.

#### Test Execution
> **Feature File:** [DR-027](../manual-testing-playbook/initialization-and-state-setup/research-charter-validation.md)

### DR-069 | Expansive seed writes depth-one nodes before iteration one

#### Description
Verify that the expansive seed step runs before the fan-out spawn and after config creation, and that a repeated seed does not decompose the topic a second time.

#### Scenario Contract
Prompt summary: Check that expansive depth mode seeds its depth-one frontier nodes before iteration one, on the fan-out path and on the single-executor path, and that a second seed does not decompose the topic again. Return a PASS or FAIL verdict with the reason.

Expected signals: The root `step_frontier_seed` precedes `step_fanout_spawn`, the `phase_init` copy follows `step_create_config`, four YAML contract cases pass (two research, two review) and two admission cases pass, one showing root parents and one showing that a second seed adds nothing.

#### Test Execution
> **Feature File:** [DR-069](../manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md)

---

## 9. ITERATION EXECUTION AND STATE DISCIPLINE

This category covers 20 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-007 | Iteration reads state before research

#### Description
Verify that each dispatched iteration reads JSONL and strategy state before performing research actions.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the read-state-first iteration contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop dispatch and the @deep-research agent both require reading JSONL and strategy state before any research actions. Return a concise operator verdict.

Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.

#### Test Execution
> **Feature File:** [DR-007](../manual-testing-playbook/iteration-execution-and-state-discipline/iteration-reads-state-before-research.md)

### DR-008 | Iteration writes iteration-NNN.md, JSONL record, and reducer refresh

#### Description
Verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables reducer-owned packet synchronization.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the iteration write-back contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify each iteration writes iteration-NNN.md, appends a JSONL iteration record, and triggers reducer-owned refresh of deep-research-strategy.md, findings-registry.json, and deep-research-dashboard.md. Return a concise operator-facing verdict.

Expected signals: Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects.

#### Test Execution
> **Feature File:** [DR-008](../manual-testing-playbook/iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md)

### DR-009 | Strategy “Next Focus” and exhausted-approach discipline

#### Description
Verify that the loop honors the strategy file’s Next Focus and avoids approaches marked exhausted or blocked.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the strategy-discipline contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify iteration focus comes from Next Focus and that exhausted or blocked approaches are not retried. Return a concise user-facing verdict.

Expected signals: Next Focus is read explicitly, exhausted approaches are treated as do-not-retry, and recovery mode consults deferred ideas instead of repeating blocked tactics.

#### Test Execution
> **Feature File:** [DR-009](../manual-testing-playbook/iteration-execution-and-state-discipline/strategy-next-focus-and-exhausted-approach-discipline.md)

### DR-010 | Progressive synthesis behavior for research/research.md

#### Description
Verify that `research/research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the progressive-synthesis contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify research/research.md is workflow-owned canonical output, that incremental updates are allowed when progressiveSynthesis is true, and that synthesis still finalizes the document. Return a concise verdict.

Expected signals: The docs describe `research/research.md` as workflow-owned, `progressiveSynthesis` defaults to true, and the final synthesis phase still runs.

#### Test Execution
> **Feature File:** [DR-010](../manual-testing-playbook/iteration-execution-and-state-discipline/progressive-synthesis-behavior-for-research-md.md)

### DR-024 | Dashboard generation after iteration

#### Description
Verify dashboard.md is auto-generated after iteration evaluation with correct content.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the dashboard generation contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the dashboard file is created at the correct path, contains the required sections (iteration table, question status, trend, dead ends, next focus, active risks), and is regenerated after each iteration. Return a concise operator-facing verdict.

Expected signals: `research/deep-research-dashboard.md` exists after at least one iteration completes, contains an iteration table, question status with X/Y answered, trend with last 3 newInfoRatio values, dead ends consolidated from ruledOut data, next focus from strategy.md, and active risks.

#### Test Execution
> **Feature File:** [DR-024](../manual-testing-playbook/iteration-execution-and-state-discipline/dashboard-generation-after-iteration.md)

### DR-025 | Novelty justification present in JSONL

#### Description
Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the novelty justification contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL iteration record schema requires both newInfoRatio and noveltyJustification, that the justification is a human-readable sentence, and that ALWAYS rule 11 and the agent Step 6 mandate their inclusion. Return a concise operator-facing verdict.

Expected signals: JSONL iteration records contain both `newInfoRatio` (number, 0.0-1.0) and `noveltyJustification` (string, human-readable sentence); the justification field is listed as required in v1.1.0 agent instructions; ALWAYS rule 11 mandates both fields.

#### Test Execution
> **Feature File:** [DR-025](../manual-testing-playbook/iteration-execution-and-state-discipline/novelty-justification-in-jsonl.md)

### DR-028 | Focus track labels in dashboard

#### Description
Verify optional focusTrack labels appear in JSONL and dashboard iteration table.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the focusTrack label contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL state format defines focusTrack as an optional field on iteration records, and that the dashboard Progress table surfaces a Track column. Return a concise operator-facing verdict.

Expected signals: JSONL iteration records with an optional focusTrack field, dashboard Progress table with a Track column.

#### Test Execution
> **Feature File:** [DR-028](../manual-testing-playbook/iteration-execution-and-state-discipline/focus-track-labels-in-dashboard.md)

### DR-029 | Research iterations emit flat graphEvents

#### Description
verify that a running deep research iteration writes a `graphEvents` array that uses the shipped flat `type` schema (`question`, `finding`, `source`, `edge`) rather than the older nested `kind/nodeType` form.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the flat graphEvents contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware research convergence expects graphEvents in iteration records, and that the shipped state-format contract plus active graph tests use flat event types such as question, finding, source, and edge rather than question_node/finding_node wrappers. Return a concise operator-facing verdict.

Expected signals: `graphEvents` documented as iteration-record input for graph-aware convergence; the state-format example uses flat `type` values; active graph tests use `question`, `finding`, and `source` node types rather than `question_node` / `finding_node` wrappers.

#### Test Execution
> **Feature File:** [DR-029](../manual-testing-playbook/iteration-execution-and-state-discipline/graph-events-emission.md)

### DR-056 | Injection inbox provenance

#### Description
Verify that late-question injections use `research/inbox.jsonl` and preserve question provenance.

#### Scenario Contract
Prompt summary: Validate the deep-research inbox provenance path from strategy docs through reducer output and tests.

Expected signals: `inbox.jsonl` schema lists id, text, source, origin, injectedAtIteration, and promotedQuestionId; reducer reads the inbox; direct edits are treated as `legacy-import`.

#### Test Execution
> **Feature File:** [DR-056](../manual-testing-playbook/iteration-execution-and-state-discipline/injection-inbox-provenance.md)

### DR-057 | Question conflict ownership

#### Description
Verify that inbox and registry question disagreements emit conflict events instead of overwriting strategy markdown.

#### Scenario Contract
Prompt summary: Validate the deep-research question conflict model across reducer, strategy docs, state registry docs, YAML, and tests.

Expected signals: `question_conflict` events include `inboxValue`, `registryValue`, and `operatorDecision`; unresolved conflicts default to `needs_decision`.

#### Test Execution
> **Feature File:** [DR-057](../manual-testing-playbook/iteration-execution-and-state-discipline/question-conflict-ownership.md)

### DR-058 | Rejected-pattern cache

#### Description
Verify that rejected ideas and patterns are suppressed from future focus candidates until removed or reset.

#### Scenario Contract
Prompt summary: Validate rejected-pattern suppression across JSONL events, loop protocol, reducer filtering, YAML candidate checks, and tests.

Expected signals: Rejected cache is bounded to 100 entries, exact and category-compatible fuzzy matching are supported, and removal or reset re-admits candidates.

#### Test Execution
> **Feature File:** [DR-058](../manual-testing-playbook/iteration-execution-and-state-discipline/rejected-pattern-cache.md)

### DR-059 | Ideas backlog lifecycle

#### Description
Verify that leaf agents only observe ideas and the reducer owns promotion, ranking, and rejection suppression.

#### Scenario Contract
Prompt summary: Validate the ideas backlog lifecycle across agent rules, JSONL docs, reducer promotion, YAML checks, and tests.

Expected signals: Leaf agents may emit `idea_observed` only, `minIdeaObservations` defaults to 2, reducer emits idempotent `idea_promoted`, and `idea_rejected` suppresses promoted ideas.

#### Test Execution
> **Feature File:** [DR-059](../manual-testing-playbook/iteration-execution-and-state-discipline/ideas-backlog-lifecycle.md)

### DR-060 | Dashboard sparkline trend

#### Description
Verify that the dashboard renders new-information and score history as sparklines with flatline advisory evidence.

#### Scenario Contract
Prompt summary: Validate the deep-research dashboard sparkline trend across reducer output, dashboard assets, and tests.

Expected signals: `renderSparkline()` exists, dashboard output includes `## 5. TREND`, newInfoRatio and score sparklines are rendered, and `trend_flatline` is advisory.

#### Test Execution
> **Feature File:** [DR-060](../manual-testing-playbook/iteration-execution-and-state-discipline/dashboard-sparkline-trend.md)

### DR-066 | Next Focus ignores answered free text

#### Description
Verify that deep-research Next Focus and its carried-forward open-question list skip status sentences and answered questions, and read the latest leaf's Recommended Next Focus.

#### Scenario Contract
Prompt summary: Check that deep-research picks its next focus from open machine questions and the latest leaf's Recommended Next Focus, and not from a status sentence or an answered question. Return a PASS or FAIL verdict with the reason.

Expected signals: A status sentence listed under Questions Remaining is dropped from the carried-forward open questions, an answered question is not carried forward, and an unresolved leaf Recommended Next Focus becomes Next Focus while a machine question is open.

#### Test Execution
> **Feature File:** [DR-066](../manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md)

### DR-067 | focusAlignment and the findings gate read leaf fields

#### Description
Verify that the deep-research findings gate and the focusAlignment guard run on the leaf fields the state log keeps on every research run.

#### Scenario Contract
Prompt summary: Check that deep-research runs the findings gate and the focusAlignment guard on the fields each leaf writes, on every default research run. Return a PASS or FAIL verdict with the reason.

Expected signals: A projected row that claims findings with nothing enumerated returns `findings_not_enumerated`. `focusAlignment` fails on an off-focus latest record and passes after a later aligned iteration. The projection carries the ten leaf keys.

#### Test Execution
> **Feature File:** [DR-067](../manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md)

### DR-070 | Frontier admission prunes each proposal with its reason

#### Description
Verify that each failing admission check prunes a leaf proposal with that check's own reason, and that only an admitted proposal reaches the research inbox.

#### Scenario Contract
Prompt summary: Check that every frontier proposal that fails an admission check is pruned with that check's reason, and that only the admitted proposal reaches the research inbox with origin frontier. Return a PASS or FAIL verdict with the reason.

Expected signals: The helper returns the seven reasons `relevance`, `dedupe`, `depth`, `fanout`, `node-cap`, `budget` and `cycle`, the seven prune rows pass, the node-cap case prunes past the run-wide cap as `node-cap`, the admitted proposal writes one inbox row with `origin: "frontier"`, and the pruned proposal writes a store row and no inbox row.

#### Test Execution
> **Feature File:** [DR-070](../manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md)

### DR-071 | Frontier focus picks the shallowest open node

#### Description
Verify that Next Focus under the expansive mode picks the open node at the lowest depth, that one visit with that focus leaves its question open and that a reworded focus still counts as a visit.

#### Scenario Contract
Prompt summary: Check that expansive Next Focus picks the shallowest open frontier node, that one visit with that focus leaves its question open, and that a reworded focus that keeps the node marker still counts as a visit. Return a PASS or FAIL verdict with the reason.

Expected signals: The focus case chooses a depth-one node over a depth-two node and leaves its question open after the visit, the reworded-visit case spends the node as `exhausted` with reason `budget`, and the reducer matches the `Frontier node` marker anywhere in the focus.

#### Test Execution
> **Feature File:** [DR-071](../manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md)

### DR-074 | Frontier graph mirror closes unanswered nodes as claims

#### Description
Verify that under the expansive mode the frontier node store is mirrored into the coverage graph, that a pruned node never reaches the graph, that a node closed without an answer becomes a closed CLAIM, and that the upsert is skipped when no node is projected.

#### Scenario Contract
Prompt summary: Check that under expansive depth mode the frontier node store is mirrored into the coverage graph, that a pruned node never reaches the graph, that a node closed without an answer becomes a closed CLAIM instead of a QUESTION, and that the upsert is skipped when no node is projected. Return a PASS or FAIL verdict with the reason.

Expected signals: The five projection cases pass, the mirror step follows `step_graph_upsert` and runs `frontier-admit.cjs graph` and `upsert.cjs`, the end-to-end case inserts two nodes and one edge, the closed status set names `blocked`, `exhausted` and `abstained`, and the step skips the upsert when the graph command reports no nodes.

#### Test Execution
> **Feature File:** [DR-074](../manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md)

### DR-075 | Frontier band budget closes spent bands and rolls down

#### Description
Verify that under the expansive mode a depth band that spends its share closes its open nodes as `exhausted` with reason `budget`, that an answered node stays answered, and that an unspent share rolls down to the next band but never up.

#### Scenario Contract
Prompt summary: Check that under expansive depth mode a spent depth band closes its open nodes as exhausted with reason budget, and that an unspent share rolls down to the next band but never up. Return a PASS or FAIL verdict with the reason.

Expected signals: The three budget cases pass, the roll-down case reports a depth-2 allotment of 6.5, the never-up case closes the spent depth-1 node as `exhausted` with reason `budget`, and the answered-node case keeps both nodes answered with a depth-2 allotment of 7.5.

#### Test Execution
> **Feature File:** [DR-075](../manual-testing-playbook/iteration-execution-and-state-discipline/frontier-band-budget-rolls-down.md)

### DR-076 | Frontier dashboard section on expansive runs only

#### Description
Verify that the research dashboard shows a `## 6B. FRONTIER` section with the frontier size, pruned count, revisits and band budget on an expansive run, and leaves it out of a default run.

#### Scenario Contract
Prompt summary: Check that the research dashboard shows the 6B. FRONTIER section with size, pruned count, revisits and band budget on an expansive run, and leaves it out of a default run. Return a PASS or FAIL verdict with the reason.

Expected signals: The dashboard case passes, the expansive dashboard contains `## 6B. FRONTIER`, `- Frontier size: 2 nodes`, `- Pruned nodes: 0`, `- Revisits: ` and `- Budget depth1: `, and the default run has no `frontier` registry key and no `6B. FRONTIER` section.

#### Test Execution
> **Feature File:** [DR-076](../manual-testing-playbook/iteration-execution-and-state-discipline/frontier-dashboard-section.md)

---

## 10. CONVERGENCE AND RECOVERY

This category covers 16 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-011 | Stop on max iterations

#### Description
Verify that max iterations is a hard stop checked before softer convergence signals.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the max-iterations stop contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the hard cap is checked before softer convergence logic and that the stop reason is surfaced as max_iterations_reached. Return a concise operator verdict.

Expected signals: Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs.

#### Test Execution
> **Feature File:** [DR-011](../manual-testing-playbook/convergence-and-recovery/stop-on-max-iterations.md)

### DR-012 | Stop when all key questions are answered

#### Description
Verify that the loop stops when the tracked key questions are fully answered.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the all-questions-answered stop contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop stops when the tracked key questions are answered and that this condition is checked before softer convergence logic. Return a concise verdict.

Expected signals: Question completion is a named hard stop and is reflected in the convergence and usage docs.

#### Test Execution
> **Feature File:** [DR-012](../manual-testing-playbook/convergence-and-recovery/stop-when-all-key-questions-are-answered.md)

### DR-013 | Composite convergence stop behavior

#### Description
Verify the three-signal weighted stop model and its graceful degradation rules.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the composite-convergence contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the rolling average, MAD noise floor, and question-entropy signals, their weights, and the >0.60 weighted stop-score threshold. Return a concise operator-facing verdict.

Expected signals: Three named signals, weights of 0.30/0.35/0.35, graceful degradation with fewer iterations, and a stop threshold above 0.60.

#### Test Execution
> **Feature File:** [DR-013](../manual-testing-playbook/convergence-and-recovery/composite-convergence-stop-behavior.md)

### DR-055 | Anti-convergence floor

#### Description
Verify that convergence STOP is blocked until the configured minimum iteration floor clears.

#### Scenario Contract
Prompt summary: Validate the deep-research minIterations floor and convergenceMode behavior against config, YAML, and tests.

Expected signals: `minIterations` defaults to 3, `convergenceMode` defaults to `default`, early STOP uses `minIterationsNotReached`, and `min_iterations_guard_pass` is emitted when the floor clears.

#### Test Execution
> **Feature File:** [DR-055](../manual-testing-playbook/convergence-and-recovery/anti-convergence-floor.md)

### DR-064 | Divergent convergence mode

#### Description

Verify eligible legal research STOP reasons pivot into a new focus while max iterations and non-divergent modes retain their existing paths.

#### Scenario Contract

Prompt summary: Validate the shipped deep-research divergent convergence branch, hard terminal boundary, and existing-mode isolation.

Expected signals: Only `composite_converged` and `all_questions_answered` are eligible; `maxIterationsReached` is excluded; successful pivots restore `next_focus` and continue; `off`, `default`, and `sliding-window` cannot enter the divergent branch.

#### Test Execution

> **Feature File:** [DR-064](../manual-testing-playbook/convergence-and-recovery/divergent-convergence-mode.md)

### DR-014 | Stuck recovery widens focus and continues

#### Description
Verify that stuck detection triggers a recovery path that widens focus before giving up.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the stuck-recovery contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify consecutive no-progress iterations trigger recovery, widen focus to a less-explored question, consult deferred ideas, and continue before final synthesis. Return a concise verdict.

Expected signals: Stuck threshold is enforced, recovery resets the counter, the next focus widens scope, and the ideas backlog can be consulted during recovery.

#### Test Execution
> **Feature File:** [DR-014](../manual-testing-playbook/convergence-and-recovery/stuck-recovery-widens-focus-and-continues.md)

### DR-020 | Quality Guard — Source Diversity

#### Description
Verify that convergence STOP is blocked when an answered question cites <2 independent sources.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the source diversity quality guard for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard checks each answered question for >= 2 independent sources, and that a violation turns the decision into CONTINUE with reasonDetail qualityGuardFailed and writes no event. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: the STOP candidate becomes `CONTINUE` with reasonDetail `qualityGuardFailed` and `sourceDiversity` in blockedBy, and no event is written, violated question targeted in next iteration focus.

#### Test Execution
> **Feature File:** [DR-020](../manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md)

### DR-021 | Quality Guard — Focus Alignment

#### Description
Verify that convergence STOP is blocked when an iteration answers a question its key question list does not hold.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the focus alignment quality guard for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard compares the answered questions against the key questions in the latest iteration record that names both lists, and that a mismatch turns the decision into CONTINUE with reasonDetail qualityGuardFailed and focusAlignment in blockedBy, and writes no event. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: the STOP candidate becomes `CONTINUE` with reasonDetail `qualityGuardFailed` and `focusAlignment` in blockedBy, and no event is written, misaligned question flagged in violation detail.

#### Test Execution
> **Feature File:** [DR-021](../manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md)

### DR-022 | Quality Guard — No Single-Weak-Source

#### Description
Verify that a question backed by a single source cannot close the loop and that the reserved singleWeakSource guard reports notEvaluated.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the no-single-weak-source quality guard entry for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the source diversity guard refuses an answered question with fewer than two sources, that the decision becomes CONTINUE with reasonDetail qualityGuardFailed and sourceDiversity in blockedBy, that no event is written, and that the reserved singleWeakSource entry reports notEvaluated. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: the STOP candidate becomes `CONTINUE` with reasonDetail `qualityGuardFailed` and `sourceDiversity` in blockedBy, no event is written, the single-source question is targeted for stronger sourcing in the next iteration, and `singleWeakSource` reports `notEvaluated`.

#### Test Execution
> **Feature File:** [DR-022](../manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md)

### DR-023 | Composite Convergence Passes but Guard Fails → CONTINUE

#### Description
Verify the full override path: composite score >0.60 triggers STOP, quality guards check fires, guard fails, decision overridden to CONTINUE.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the convergence-guard override path for deep-research. Trace the full sequence: composite convergence votes STOP (score >0.60), then evaluateResearchQualityGuards runs, then a guard violation is detected, then the STOP is overridden to CONTINUE and the loop resumes against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify this flow exists in convergence.md Decision Order step 8, convergence.cjs, and loop-protocol.md Step 2c. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

Expected signals: a weighted stop score above 0.60 nominates STOP, the failed guard turns it into `CONTINUE` with reasonDetail `qualityGuardFailed` and the failed guards in blockedBy, the workflow logs `Quality guard failed: <guards>. Continuing.` and writes no event, and the loop resumes.

#### Test Execution
> **Feature File:** [DR-023](../manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md)

### DR-034 | Insight status prevents false stuck detection

#### Description
Verify that an iteration with status "insight" and low newInfoRatio does NOT increment stuck count.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the insight-status contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify state-format.md defines "insight" as a valid iteration status, that convergence.md documents how stuckCount is computed, and that insight iterations are excluded from stuck counting. Return a concise operator-facing verdict.

Expected signals: Iteration with status="insight" and low newInfoRatio, stuck_count NOT incremented.

#### Test Execution
> **Feature File:** [DR-034](../manual-testing-playbook/convergence-and-recovery/insight-status-prevents-false-stuck.md)

### DR-030 | Thought status handling in convergence

#### Description
Verify that "thought" iterations are handled correctly in convergence.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the thought-status convergence contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify state-format.md defines "thought" as a valid iteration status marking analytical-only iterations, that convergence.md documents how thought iterations are excluded from stuck counting and the rolling average, and that SKILL.md lists it in the status taxonomy. Return a concise operator-facing verdict.

Expected signals: Iteration with status="thought", convergence treats it appropriately (does not count as stuck, does not count toward rolling average).

#### Test Execution
> **Feature File:** [DR-030](../manual-testing-playbook/convergence-and-recovery/thought-status-convergence-handling.md)

### DR-031 | Graph convergence signals act as STOP-blocking guards

#### Description
verify that when deep research convergence math votes STOP but `sourceDiversity` remains below the `0.4` guard threshold, STOP is blocked and blocked-stop evidence is recorded.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the graph stop-blocking guard contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify SOURCE_DIVERSITY_THRESHOLD = 0.4 blocks STOP when unmet, and that the research convergence reference records blocked-stop persistence with stopReason: "blockedStop" when legal-stop gates fail. Return a concise operator-facing verdict.

Expected signals: `SOURCE_DIVERSITY_THRESHOLD = 0.4`; `evaluateGraphGates()` fails `sourceDiversity` when below threshold; research convergence docs map failed legal-stop gates to `stopReason: "blockedStop"` and `blocked_stop` persistence.

#### Test Execution
> **Feature File:** [DR-031](../manual-testing-playbook/convergence-and-recovery/graph-convergence-signals.md)

### DR-032 | Research reducer surfaces blocked-stop history across registry, dashboard, and next-focus

#### Description
verify that a research packet with at least one `blocked_stop` event surfaces that event into reducer-owned `blockedStopHistory`, the `BLOCKED STOPS` dashboard section, and the strategy `next-focus` anchor.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate blocked-stop reducer surfacing for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs <spec-folder> on a research packet with at least one blocked_stop event populates blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict.

Expected signals: `blockedStopHistory` is non-empty; each entry exposes `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp`; `BLOCKED STOPS` renders the same blocked-stop data; the strategy `next-focus` anchor includes the recovery hint from the latest blocked-stop event.

#### Test Execution
> **Feature File:** [DR-032](../manual-testing-playbook/convergence-and-recovery/blocked-stop-reducer-surfacing.md)

### DR-033 | Research graph-aware stop gate surfaces convergence verdict and workflow hooks

#### Description
verify that `graph_convergence` events become reducer-owned `graphConvergenceScore`, `graphDecision`, and `graphBlockers`, that the dashboard renders those graph signals, and that the live workflow runs the convergence script that persists the graph snapshot and computes the whole stop decision.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate graph-aware stop-gate integration for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph_convergence reducer output populates graphConvergenceScore, graphDecision, and graphBlockers, that the dashboard renders GRAPH CONVERGENCE, and that the workflow runs convergence.cjs with --persist-snapshot and --stop-decision before the loop acts on the result. Return a concise operator-facing verdict.

Expected signals: `graphConvergenceScore`, `graphDecision`, and `graphBlockers` appear in the registry; `GRAPH CONVERGENCE` appears in the dashboard; YAML runs `step_graph_convergence` with convergence.cjs before the loop reads the stop decision.

#### Test Execution
> **Feature File:** [DR-033](../manual-testing-playbook/convergence-and-recovery/graph-aware-stop-gate.md)

### DR-072 | Frontier open veto holds a soft stop

#### Description
Verify that under the expansive mode an open frontier node turns a composite convergence stop into CONTINUE, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first.

#### Scenario Contract
Prompt summary: Check that under expansive depth mode a composite convergence stop continues while frontier nodes are open, and that the cap, the floor, stuck recovery, convergence off and the max-iterations policy still decide first. Return a PASS or FAIL verdict with the reason.

Expected signals: The veto table passes all eight rows, the open-node row returns `CONTINUE` with `frontierOpen`, the empty-frontier row returns `STOP` with `composite_converged`, the hard limits keep their own decisions, and the input echo case passes unedited.

#### Test Execution
> **Feature File:** [DR-072](../manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md)

---

## 11. PAUSE, RESUME, AND FAULT TOLERANCE

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-015 | Pause sentinel halts between iterations

#### Description
Verify that the pause sentinel halts the loop between iterations and logs a pause event.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the pause-sentinel contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify research/.deep-research-pause is checked between research iterations, {spec_folder}/review/.deep-research-pause is checked between review iterations, both emit a paused event, and both halt the loop without entering synthesis. Return a concise operator-facing verdict.

Expected signals: The sentinel is checked before dispatch, a paused event is logged, and the loop halts rather than flowing into synthesis.

#### Test Execution
> **Feature File:** [DR-015](../manual-testing-playbook/pause-resume-and-fault-tolerance/pause-sentinel-halts-between-iterations.md)

### DR-016 | Resume after pause sentinel removal

#### Description
Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the pause-resume contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify removing research/.deep-research-pause lets the research loop log a resumed event and continue from the read-state step, and removing {spec_folder}/review/.deep-research-pause lets the review loop do the same, instead of either mode starting from scratch. Return a concise verdict.

Expected signals: The loop logs `resumed`, continues from state read, and does not recreate config/strategy files during a valid resume.

#### Test Execution
> **Feature File:** [DR-016](../manual-testing-playbook/pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md)

### DR-017 | Malformed JSONL lines are skipped with defaults

#### Description
Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the JSONL fault-tolerance contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed lines are skipped, missing fields are defaulted, and a warning is emitted instead of crashing the loop. Return a concise operator-facing verdict.

Expected signals: Per-line parse protection exists, defaults are specified, skipped-line warnings are documented, and convergence operates on valid entries only.

#### Test Execution
> **Feature File:** [DR-017](../manual-testing-playbook/pause-resume-and-fault-tolerance/malformed-jsonl-lines-are-skipped-with-defaults.md)

### DR-018 | JSONL reconstruction from iteration files

#### Description
Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the state-reconstruction contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the workflow can scan iteration-NNN.md files, reconstruct JSONL iteration records, and log a state_reconstructed event. Return a concise operator-facing verdict.

Expected signals: The reconstruction algorithm scans iteration files, extracts assessment data, writes reconstructed records, and logs a `state_reconstructed` event.

#### Test Execution
> **Feature File:** [DR-018](../manual-testing-playbook/pause-resume-and-fault-tolerance/jsonl-reconstruction-from-iteration-files.md)

### DR-061 | Run-now control

#### Description
Verify that the `.deep-research-run-now` sentinel triggers one immediate iteration with pause precedence and audit events.

#### Scenario Contract
Prompt summary: Validate the run-now sentinel lifecycle against the workflow and its unit tests.

Expected signals: `run_now_requested`, `run_now_accepted`, `run_now_rejected`, and `run_now_restored` events are documented or tested; accepted runs consume the sentinel before dispatch.

#### Test Execution
> **Feature File:** [DR-061](../manual-testing-playbook/pause-resume-and-fault-tolerance/run-now-control.md)

---

## 12. SYNTHESIS, SAVE, AND GUARDRAILS

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DR-019 | Final synthesis plus memory save and guardrail behavior

#### Description
Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the finalization and guardrail contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify synthesis produces canonical research/research.md, memory save uses generate-context.js, the runtime agent remains LEAF-only, and reference-only features such as wave orchestration, checkpoint commits, :restart segments, and alternate CLI dispatch are documented as non-live behavior rather than executable guarantees. Return a concise operator verdict.

Expected signals: Synthesis produces canonical `research/research.md`, memory save calls `generate-context.js`, the OpenCode runtime agent forbids nested delegation, and wave orchestration, checkpoint commits, segment transitions, and alternate CLI dispatch remain reference-only.

#### Test Execution
> **Feature File:** [DR-019](../manual-testing-playbook/synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md)

### DR-026 | Ruled-out directions synthesized

#### Description
Verify that iteration ruledOut data is consolidated into "Eliminated Alternatives" in research/research.md.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the ruled-out directions synthesis contract for deep-research against the current deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the synthesis phase consolidates ruledOut entries from JSONL records and ## Dead Ends sections from iteration files into a mandatory "Eliminated Alternatives" section in research/research.md. Verify that strategy.md also tracks ruled-out directions per iteration. Return a concise operator-facing verdict.

Expected signals: research/research.md has a mandatory "Eliminated Alternatives" section formatted as a table (`| Approach | Reason Eliminated | Evidence | Iteration(s) |`); iteration files have `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured; strategy.md has a `## 10. Ruled Out Directions` section updated per iteration; ALWAYS rule 10 mandates documenting ruled-out directions.

#### Test Execution
> **Feature File:** [DR-026](../manual-testing-playbook/synthesis-save-and-guardrails/ruled-out-directions-in-synthesis.md)

### DR-035 | Research resource-map emission

#### Description
Verify synthesis emits `research/resource-map.md` from converged delta evidence and honors the `--no-resource-map` opt-out.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that synthesis emits `research/resource-map.md` from converged delta evidence, that the map keeps the renderer's ten-category structure, and that `--no-resource-map` disables the write cleanly. Return a concise operator-facing verdict.

Expected signals: Default run produces `research/resource-map.md` with the ten category sections the renderer emits; `--no-resource-map` run leaves the file absent while `research.md` still emits.

#### Test Execution
> **Feature File:** [DR-035](../manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md)

### DR-062 | Per-iteration lineage context refresh

#### Description
Verify that each completed iteration is persisted lineage-locally and refreshed into the next prompt context.

#### Scenario Contract
Prompt summary: Validate lineage context refresh ordering and non-fatal state-read behavior.

Expected signals: `step_reduce_state` and `step_graph_upsert` run before `step_refresh_lineage_context`, which runs before result evaluation, and state-read failures are advisory.

#### Test Execution
> **Feature File:** [DR-062](../manual-testing-playbook/synthesis-save-and-guardrails/per-iteration-memory-upsert.md)

---

## 13. COMMAND FLOW STRESS TESTS

This category covers 6 sandboxed command-flow scenarios (CP-046 through CP-051) that exercise the `/deep:research` workflow end-to-end. Each scenario runs under `/tmp/cp-NNN-sandbox/` plus `/tmp/cp-NNN-spec/` and grades grep-checkable signals rather than LLM judgment. Use `command-flow-stress-tests/setup-cp-sandbox.sh` to provision sandboxes before running.

### CP-046 | SETUP_YAML_HANDOFF command binding fidelity

#### Description
Validate that `/deep:research:auto` resolves topic, spec folder, mode, max iterations, convergence, and artifact root before the YAML workflow starts, and that Call B leaves grep-checkable state evidence.

#### Test Execution
> **Feature File:** [CP-046](../manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md)

### CP-047 | SPEC_FENCE_WRITEBACK bounded spec mutation

#### Description
Validate that `/deep:research` uses the lock, `spec_check_protocol` and generated findings fence rather than freeform `spec.md` mutation.

#### Test Execution
> **Feature File:** [CP-047](../manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md)

### CP-048 | RESOURCE_MAP_TOGGLE no-resource-map fidelity

#### Description
Validate that `--no-resource-map` is parsed by the command and honored by config, state, synthesis, and artifact emission.

#### Test Execution
> **Feature File:** [CP-048](../manual-testing-playbook/command-flow-stress-tests/resource-map-toggle.md)

### CP-049 | PAUSE_SENTINEL_HALT command lifecycle stop

#### Description
Validate that a packet-local `.deep-research-pause` sentinel halts the command between lifecycle turns and records `userPaused` without writing an iteration.

#### Test Execution
> **Feature File:** [CP-049](../manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md)

### CP-050 | ITERATION_CITATION_JSONL leaf output contract

#### Description
Validate that the command-dispatched `@deep-research` body writes a cited iteration file and exactly one schema-rich JSONL iteration record.

#### Test Execution
> **Feature File:** [CP-050](../manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md)

### CP-051 | EXHAUSTED_APPROACH_RESPECT resume-state discipline

#### Description
Validate that command-dispatched `@deep-research` reads existing state and does not retry a BLOCKED exhausted approach.

#### Test Execution
> **Feature File:** [CP-051](../manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md)

---

## 14. FAN-OUT

This category covers 4 scenarios validating the opt-in fan-out dispatch layer added in the research loop: CLI lineage pool dispatch, native sequential agent dispatch, single-executor parity, and the round-robin deal of seeded frontier nodes under the expansive mode.

### DR-052 | Fan-out research with two CLI lineages

#### Description
Validate that a two-CLI-lineage fan-out research config triggers `step_fanout_spawn` → `fanout-run.cjs` pool → two isolated lineages sub-packets → `step_fanout_merge` → canonical `research.md`.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate the CLI fan-out path for deep-research: confirm `step_fanout_spawn` and `step_fanout_merge` are present with correct `skip_when` guards, the `--executor` default policy is documented, and `fanout-run.vitest.ts` passes.

Expected signals: YAML steps present with `skip_when`; command docs show 2+ executors → `config.fanout`; 5/5 fanout-run tests pass.

#### Test Execution
> **Feature File:** [DR-052](../manual-testing-playbook/fanout/fanout-cli-lineages-research.md)

### DR-053 | Fan-out native sequential research dispatch

#### Description
Validate that native fan-out dispatches sequential `agent: deep-research` runs with per-lineage isolated artifact dirs via `config.fanout_lineage_artifact_dir`.

#### Scenario Contract
Prompt summary: Validate native fan-out for deep-research: confirm `step_fanout_spawn_native` uses `agent: deep-research` and passes the correct lineage artifact dir override.

Expected signals: `agent: deep-research` (not `deep-review`) in native dispatch block; `config.fanout_lineage_artifact_dir` in context; correct `skip_when`.

#### Test Execution
> **Feature File:** [DR-053](../manual-testing-playbook/fanout/fanout-native-sequential-research.md)

### DR-054 | Fan-out single-executor parity for research loop

#### Description
Validate all three fan-out YAML steps are fully bypassed in single-executor mode, preserving byte-identical behavior.

#### Scenario Contract
Prompt summary: Validate single-executor parity for deep-research: confirm the fan-out YAML steps have correct `skip_when` guards, the `if_absent` branch is unchanged, and vitest passes 197/197.

Expected signals: `if_absent` command unchanged; both fan-out steps have `skip_when`; 197/197 vitest.

#### Test Execution
> **Feature File:** [DR-054](../manual-testing-playbook/fanout/fanout-single-executor-parity-research.md)

### DR-073 | Fan-out deals seeded frontier nodes round-robin

#### Description
Verify that a fan-out run under the expansive mode deals the seeded depth-one nodes round-robin across its lineages, writes each lineage store before spawn and fails the merge guard when a partitioned node is missing.

#### Scenario Contract
Prompt summary: Check that a fan-out research run under expansive depth mode deals the seeded depth-one nodes round-robin across its lineages, writes each lineage store before spawn, and fails the merge guard when a partitioned node is missing. Return a PASS or FAIL verdict with the reason.

Expected signals: The round-robin, store-before-spawn and default-path cases pass, the merge guard passes when every partitioned node is reported and fails when one is missing from every lineage, and the runner writes `frontier_scope:` only under the expansive flag.

#### Test Execution
> **Feature File:** [DR-073](../manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md)

---

## 16. INTRA ROUTING RECALL

This category covers 8 scenarios validating the `deep-research` packet's own intra-packet
smart router ([ROUTER.md](../ROUTER.md) §3 `MACHINE ROUTER`): each scenario confirms one
`INTENT_SIGNALS` key scores as the dominant intent for a shaped prompt and loads the matching
`RESOURCE_MAP` resource set.

### DR-R01 | Deep research loop setup routing

#### Description
Verify a loop-setup-shaped request scores the `LOOP_SETUP` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `Start an autoresearch deep research loop and handle setup and init for this investigation.`

Expected signals: `LOOP_SETUP` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["LOOP_SETUP"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R01](../manual-testing-playbook/intra-routing-recall/loop-setup.md)

### DR-R02 | Deep research iteration routing

#### Description
Verify a iteration-shaped request scores the `ITERATION` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `Continue research with the next round, capture the delta, and choose the next focus for this research cycle.`

Expected signals: `ITERATION` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["ITERATION"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R02](../manual-testing-playbook/intra-routing-recall/iteration.md)

### DR-R03 | Deep research convergence routing

#### Description
Verify a convergence-shaped request scores the `CONVERGENCE` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `Evaluate convergence, the stop condition, diminishing returns, and newInfoRatio before ending the investigation.`

Expected signals: `CONVERGENCE` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["CONVERGENCE"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R03](../manual-testing-playbook/intra-routing-recall/convergence.md)

### DR-R04 | Deep research recovery routing

#### Description
Verify a recovery-shaped request scores the `RECOVERY` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `The research loop is stuck after a timeout; run recovery, reconstruct state, and resolve the blocked stop.`

Expected signals: `RECOVERY` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["RECOVERY"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R04](../manual-testing-playbook/intra-routing-recall/recovery.md)

### DR-R05 | Deep research state routing

#### Description
Verify a state-shaped request scores the `STATE` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `Explain the state file, jsonl strategy, dashboard, registry, and lineage records for a research session.`

Expected signals: `STATE` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["STATE"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R05](../manual-testing-playbook/intra-routing-recall/state.md)

### DR-R06 | Deep research spec anchoring routing

#### Description
Verify a spec-anchoring-shaped request scores the `SPEC_ANCHORING` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `Use spec anchoring with a generated fence, folder_state classification, and lock handling for the research run.`

Expected signals: `SPEC_ANCHORING` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["SPEC_ANCHORING"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R06](../manual-testing-playbook/intra-routing-recall/spec-anchoring.md)

### DR-R07 | Deep research runtime parity routing

#### Description
Verify a runtime-parity-shaped request scores the `RUNTIME_PARITY` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `Check runtime capability parity between opencode and claude before dispatching the research loop.`

Expected signals: `RUNTIME_PARITY` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["RUNTIME_PARITY"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R07](../manual-testing-playbook/intra-routing-recall/runtime-parity.md)

### DR-R08 | Deep research resource map routing

#### Description
Verify a resource-map-shaped request scores the `RESOURCE_MAP` intent and loads its resource set through the packet's own smart router.

#### Scenario Contract
Prompt summary: `Use the resource map inventory and coverage gate while preparing the research loop.`

Expected signals: `RESOURCE_MAP` is the dominant intent; the loaded resource set matches `RESOURCE_MAP["RESOURCE_MAP"]` plus the always-loaded default.

#### Test Execution
> **Feature File:** [DR-R08](../manual-testing-playbook/intra-routing-recall/resource-map.md)

---

## 15. AUTOMATED TEST CROSS-REFERENCE

- `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts`: runtime mirror alignment, capability matrix coverage, and artifact naming.
- `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts`: reducer idempotency, question resolution, finding counts, convergence score, and dashboard content.

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

The deep-research feature catalog is at [`../feature-catalog/feature-catalog.md`](../feature-catalog/feature-catalog.md). Use the live source anchors inside each per-feature file as the canonical implementation cross-reference surface.
