---
title: "Feature Specification: Agent alignment follow-ups: close the predecessor's four open findings and every finding of the agent file review"
description: "The agent contract and registry alignment packet closed with four findings it did not own, settled by phases 1 to 5. A later read-only review of the eleven agent files found 62 more: budgets the mandatory steps exceed, retry and completion rules that contradict each other, and routing to agents that refuse the work. Phases 6 to 14 plan a fix or a recorded no-fix decision for each."
trigger_phrases:
  - "agent alignment follow ups phase parent spec"
  - "agent file review findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Agent alignment follow-ups: close the predecessor's four open findings and every finding of the agent file review

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | None, this is the packet root |
| **Parent Packet** | agents/007-agent-alignment-follow-ups |
| **Predecessor** | 006-agent-contract-and-registry-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every child phase has a recorded decision or a shipped change, every row of `scratch/agent-review/finding-to-phase.tsv` is closed by its owning phase, and `validate.sh --recursive --strict` prints `RESULT: PASSED` for the parent and all fourteen children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet `agents/006-agent-contract-and-registry-alignment` closed on 2026-11-14 and recorded four findings outside its scope. The deep-loop fan-out runner inlines an agent persona for every executor that is not native and adds no tool-mapping line, the line the Codex dispatch rule now requires. The DeepSeek Harness documents name no read tool, so nobody knows whether a harness child given a read-only persona reads files. The orchestrator's task template lists eight agent names typed by hand while the registry schedules ten, so a task package cannot name `@design` or `@prompt-improver` from the template. The agent authoring skill never tells an author to add a registry record, so a new agent file fails the roster check with an error the skill does not explain. Two of the four are suspected failures with no observed run behind them, and acting on them without evidence would add text to prompts and rules that nothing needs.

A fresh read-only review of the eleven agent files in `.skilled/agents/` then reported 62 findings, kept in `scratch/agent-review/agents-review.out.md`. Seven of the eleven agents carry an instruction they cannot satisfy or two instructions that contradict each other. Tool-call budgets sit below what the mandatory steps cost. The code, ai-council and orchestrate agents state retry and completion rules that disagree. The orchestrator routes work to leaves that refuse it. The roster check passes on all of it, because it checks headings and not behavior. The review is one model's reading and ran nothing, so each phase reproduces its findings before it plans an edit.

### Purpose
Each of the predecessor's four findings and each of the 62 review findings ends as a shipped fix or as a recorded decision that no fix is needed, and each rests on a command output or a live dispatch.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Decide by live Codex dispatch whether the fan-out runner needs a tool-mapping line, and add it for the Codex executor only when a run reads nothing (phase 1)
- Decide by live harness dispatch whether a DeepSeek Harness child needs a tool-mapping line, and add the rule to the harness skill only when the control run reads nothing (phase 2)
- Remove the hand-typed agent list from the orchestrator's task template so it cannot disagree with the registry (phase 3)
- Add the registry record to the agent authoring workflow, with the error an author sees without it (phase 4)
- Give each shared rule one source: tool budgets, the canonical refusal string, the untrusted-content rule and self-attested checklists and scores (phase 6)
- Fix the per-agent contradictions the review reproduces, one phase per coupled group of agents, with every agent edit carried through its runtime mirrors (phases 7 to 14)
- Bring `orchestrate.md`, `ai-council.md` and `debug.md` to the 600-line cap the agent template sets (phases 8, 9 and 11)

### Out of Scope
- Changing any agent's role or permissions beyond what a reproduced finding requires
- Fixing a review finding that does not reproduce at the current base. Its phase records the evidence instead
- Changing the Codex dispatch rule or the canonical persona-injection contract, which the predecessor packet shipped
- The Routing Registry Drift Guard failure on main, which another packet owns
- Adding a mapping line to an executor no run has shown to need one

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify, only on a failed probe | 1 | Tool-mapping line above the persona for a `cli-codex` lineage |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify, only on a failed probe | 1 | One test for the line and its absence on other kinds |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Modify, only on a failed control | 2 | Tool-mapping requirement in rule 7 |
| `.skilled/agents/orchestrate.md` | Modify | 3 | The `Agent:` line of the task template |
| `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/` | Regenerate | 3 | Runtime copies of `orchestrate.md` |
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | Modify | 4 | Registry step in the ordered creation workflow |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/` | Create | 4 | One entry for the new packet version |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | 6 | Shared rules: refusal string, untrusted content, budgets, self-attested output |
| `.skilled/commands/deep/assets/deep-research-*.yaml`, `deep-review-*.yaml` | Modify, if phase 6 picks the workflow as the budget source | 6 | Tool budgets the leaves read |
| `.skilled/agents/*.md` (all eleven) | Modify | 6 to 14 | Per-phase fixes, each phase names its own lines |
| `.skilled/agents/agent-registry.json` | Modify, if phase 9 changes the ai-council writer | 9 | The ai-council record's persistence note |
| `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.dsh/agents/` and the other runtime directories | Hand-edit or regenerate | 6 to 14 | Runtime copies of each changed agent |
| `.skilled/skills/system-deep-loop/` mode `SKILL.md` and `loop-protocol.md` files, deep-review config and prompt template, two vitest suites, compiled deep command contracts | Modify or regenerate | 6, 9, 10 | Budget source and contract hashes that pin the agent files |
| `.skilled/skills/system-spec-kit/references/workflows/orchestrator-dispatch.md` with its `leaf-manifest.json`, `leaf-aliases.json` and `ROUTER.md` entries | Create and register | 8 | Sections moved out of `orchestrate.md`. A hub-routing change, so `skill-hub-routing.md` governs the build |
| `.skilled/skills/system-deep-loop/` deep-ai-council references and playbook scenarios | Modify | 9 | Sections 12 to 17 moved out of `ai-council.md`, and 17 citations repointed |
| `.skilled/skills/sk-prompt/SKILL.md` and a new changelog entry, and the prompt-improve workflow YAMLs | Modify, workflows only on one operator answer | 14 | Where model eligibility lives |
| `.skilled/agents/README.txt`, `.skilled/bin/agent-mirror-crosswalk.md` and the trigger-index outputs | Regenerate or modify | 6 to 14 | Generated roster and index surfaces |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-fanout-persona-tool-mapping/ | Probe a Codex child with the persona the fan-out runner inlines, and add a tool-mapping line to the runner only when a run reads nothing | Complete |
| 2 | 002-deepseek-harness-persona-probe/ | Run one read-only harness dispatch with the `context` persona, with and without a tool-mapping line, and record which one reads its file | Complete |
| 3 | 003-orchestrate-task-package-agent-names/ | Replace the eight hand-typed agent names in the orchestrator's task template with a pointer to the generated routing table | Complete |
| 4 | 004-agent-authoring-registry-step/ | Add the registry record to the agent authoring workflow so a new agent file passes the roster check | Complete |
| 5 | 005-alignment-report-fixes/ | Fix the ten distinct findings of the alignment check on phases 1 to 4, in the skill, the command, the playbook, the READMEs, the routing vocabulary and the release notes | Complete |
| 6 | 006-shared-agent-contract/ | Give each shared rule one source: tool budgets (deep-loop workflows, fast-path caps, the orchestrator's split footer), the canonical refusal string, the untrusted-content rule and self-attested checklists and scores | Complete |
| 7 | 007-code-agent-retry-and-status/ | State one retry rule in the code agent, define FAIL against BLOCKED, unify the unknown-route status and remove the gate that never fires | Complete |
| 8 | 008-orchestrate-routing-and-retry/ | Route deep work in the orchestrator to the commands, keep one retry ladder and one spec-doc owner, stop double-loading definitions and bring the file to 600 lines | Complete |
| 9 | 009-ai-council-writer-and-round-model/ | Name one writer for ai-council artifacts, make completion question 11 satisfiable, run one round per invocation and bring the file to 600 lines | Complete |
| 10 | 010-deep-loop-leaf-state-and-status/ | Make the deep-research and deep-review leaves agree with themselves on status values, state-log writes, bindings and the FAIL mapping | Complete |
| 11 | 011-debug-agent-revert-and-handoff/ | Revert a rejected debug fix before the next hypothesis, bound the cycle, settle who writes the delegation file and bring the file to 600 lines | Complete |
| 12 | 012-review-agent-gates/ | Give the review agent's fast path, low-confidence case and final-line checker an exit the agent can take | Complete |
| 13 | 013-context-markdown-design-fixes/ | Fix the context, markdown and design agents' instructions their granted tools cannot carry out | Complete |
| 14 | 014-prompt-improver-model-eligibility/ | Settle the prompt-improver's model deny rows, its TEST field and its caller names | Complete |
| 15 | 015-review-verdict-gate-rule/ | Make the deep-review verdict follow the contract: a required quality gate still failing at the stop forces FAIL, read from one typed terminal-gates record | Complete |
| 16 | 016-follow-up-fix-sweep/ | Write the terminal gate record on every stop path with its real stop reason, refuse an unknown gate, keep a registry-less lineage in the merge and fix stale lines from 008 to 014 | Complete |
| 17 | 017-terminal-record-gaps/ | Write the terminal gate record on the duration stop with stop reason `maxDurationReached`, and send every manual stop through the verdict step | Complete |
| 18 | 018-research-duration-check/ | Move the deep-research duration check after `step_read_state` so it runs on every pass | Complete |
| 19 | 019-vibe-agent-sync-check/ | Regenerate the two stale Vibe agent profiles and add the three Vibe drift checks to CI | Complete |
| 20 | 020-agent-docs-alignment-research/ | Run five deep-research iterations on whether the READMEs and docs across the repo describe the current agents correctly | Complete |
| 21 | 021-vibe-budget-default/ | Make a Mistral Vibe lineage bill the Vibe budget by default, count a budget refusal as a quota stop, and update the Mistral docs | Complete |
| 22 | 022-agent-source-and-drift-checks/ | Make the roster check and playbook sandboxes able to fail, and settle the deep-research search grant and the markdown mode | Complete |
| 23 | 023-agent-docs-fixes/ | Fix every phase 20 doc finding that phase 22 left | Complete |
| 24 | 024-terminal-gates-script/ | Compute the deep-review terminal gates with a script and record its result | Complete |
| 25 | 025-stop-path-live-proof/ | Prove each review stop reason reaches the recorded gates and the verdict | Complete |
| 26 | 026-closeout-run-identity/ | Scope synthesis closeout rows by the run's session id | Complete |
| 27 | 027-review-traceability-recording/ | Record traceability results in a shape the coverage gate reads | Complete |
| 28 | 028-review-scope-recording/ | Count line-suffixed and packet-doc findings as in scope | Complete |
| 29 | 029-review-verdict-script/ | Derive the final review verdict in one script | Complete |
| 30 | 030-review-count-source/ | One count source for review verdict, report and closeout | Complete |
| 31 | 031-search-debt-verdict/ | Open search debt makes the final review verdict CONDITIONAL | Complete |
| 32 | 032-traceability-reserve-iteration/ | Reserve the last review iteration for unfinished core traceability | Complete |
| 33 | 033-zero-iteration-report/ | A review report for a run that stopped before any iteration | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-fanout-persona-tool-mapping | 002-deepseek-harness-persona-probe | The decision for the fan-out runner is recorded with its three probe reports | `rg -c '^decision: ' specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/decision.md` prints 1 |
| 002-deepseek-harness-persona-probe | 003-orchestrate-task-package-agent-names | The harness verdict is recorded with both report files | `rg -c '^verdict: ' specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/verdict.md` prints 1 |
| 003-orchestrate-task-package-agent-names | 004-agent-authoring-registry-step | The task template holds no hand-typed agent list and the runtime copies match | `rg -c '^├─ Agent: @code . @context' .skilled/agents/orchestrate.md` prints no line, and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 |
| 004-agent-authoring-registry-step | 005-alignment-report-fixes | The creation workflow names the registry record and the packet version has its changelog entry | `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1 or more |
| 005-alignment-report-fixes | 006-shared-agent-contract | The agent file review is copied into the packet and every finding has one owning phase | `wc -l < specs/agents/007-agent-alignment-follow-ups/scratch/agent-review/finding-to-phase.tsv` prints 63, a header and 62 rows |
| 006-shared-agent-contract | 007-code-agent-retry-and-status | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 007-code-agent-retry-and-status | 008-orchestrate-routing-and-retry | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 008-orchestrate-routing-and-retry | 009-ai-council-writer-and-round-model | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 009-ai-council-writer-and-round-model | 010-deep-loop-leaf-state-and-status | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 010-deep-loop-leaf-state-and-status | 011-debug-agent-revert-and-handoff | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 011-debug-agent-revert-and-handoff | 012-review-agent-gates | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 012-review-agent-gates | 013-context-markdown-design-fixes | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 013-context-markdown-design-fixes | 014-prompt-improver-model-eligibility | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and `validate.sh <predecessor> --strict` prints `RESULT: PASSED` |
| 014-prompt-improver-model-eligibility | 015-review-verdict-gate-rule | The predecessor's spec.md records a shipped fix or a recorded no-fix decision for each owned finding, and the agent mirror check passes | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 |
| 015-review-verdict-gate-rule | 016-follow-up-fix-sweep | 015 is pushed and a fresh review names its open items | `validate.sh --strict` on 015 prints `RESULT: PASSED` |
| 016-follow-up-fix-sweep | 017-terminal-record-gaps | 016 is pushed and its merge-port review names the two upstream gaps | `validate.sh --strict` on 016 prints `RESULT: PASSED` |
| 017-terminal-record-gaps | 018-research-duration-check | 017 is pushed and records the research limitation | `validate.sh --strict` on 017 prints `RESULT: PASSED` |
| 018-research-duration-check | 019-vibe-agent-sync-check | The research duration check runs on every pass | `workflow-max-duration.vitest.ts` passes |
| 019-vibe-agent-sync-check | 020-agent-docs-alignment-research | The Vibe mirrors match their sources and CI checks them | `sync-agents-vibe.cjs --check` exits 0 |
| 020-agent-docs-alignment-research | 021-vibe-budget-default | Run findings V1 and V2 are recorded with evidence | `research/research.md` §7 lists V1 and V2 as merge-verified |
| 021-vibe-budget-default | 022-agent-source-and-drift-checks | Mistral lineages bill the Vibe budget | Runtime suite 3,024 passed |
| 022-agent-source-and-drift-checks | 023-agent-docs-fixes | Every agent tree is checked and the two agent decisions are carried | Roster check prints eight OK rows |
| 023-agent-docs-fixes | 024-terminal-gates-script | Every phase 20 doc finding is closed | The implementation summary lists each outcome |
| 024-terminal-gates-script | 025-stop-path-live-proof | The terminal gates are computed from state | `terminal-gates.vitest.ts` passes and the workflow runs the script |
| 025-stop-path-live-proof | 026-closeout-run-identity | Each stop reason reaches the verdict | `review-stop-path-replay.vitest.ts` passes and the live run recorded `maxDurationReached` |
| 026-closeout-run-identity | 027-review-traceability-recording | Closeout rows carry the run's ids | The closeout tests read the config's ids |
| 027-review-traceability-recording | 028-review-scope-recording | Core protocol results reach the coverage gate | A `protocol`-keyed row passes coverage in a test |
| 028-review-scope-recording | 029-review-verdict-script | In-target findings pass scope | The scope tests pass for suffixed and packet-doc findings |
| 029-review-verdict-script | 030-review-count-source | One verdict function | The verdict tests pass |
| 030-review-count-source | 031-search-debt-verdict | Report and closeout use the verdict counts | The closeout count tests pass |
| 031-search-debt-verdict | 032-traceability-reserve-iteration | Debt gives CONDITIONAL on every verdict path | The verdict, merge and reducer tests pass |
| 032-traceability-reserve-iteration | 033-zero-iteration-report | The last iteration goes to unfinished core protocols | The stop-path replay test passes |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The level helper scored the whole work at 37 and recommended no phases. The operator chose one phased packet with four children on 2026-11-14, so each finding keeps its own evidence and its own close.
- The four phases change four different artifacts and do not depend on each other. The order in the map is the order the findings were recorded, and any phase can run first.
- Phase 3: the planning default replaces the hand-typed list with a pointer to the generated routing table. The alternative makes the roster script write that one line from the registry. The child's `spec.md` section 7 holds both. Operator answer: the pointer (2026-11-14).
- The executor model for implementation: DeepSeek V4.1 Flash at max through OpenCode on LLM Gateway, by operator instruction on 2026-11-14.
- Outcome, 2026-11-14: phases 1 and 2 closed on a recorded decision with no file changed, because every live run read its file. Phases 3 and 4 shipped their change. The rows in Files to Change marked `only on a failed probe` and `only on a failed control` were therefore not touched.
- Phases 6 to 14, added 2026-11-14 on the operator's request "Please do create needed phases to fix all", with Gate 3 answered as more phases in this packet. They are planned and not built. The build waits for the operator.
- The phases are grouped by coupling, not one per finding. Phase 6 owns every shared rule and every line two phases would otherwise both edit, and phases 7 to 14 depend on it. `scratch/agent-review/finding-to-phase.tsv` names the one owner of each finding.
- Answered 2026-11-14 (see below), phase 8: is `orchestrate.md:461`, where the main agent writes spec-folder docs, deliberate under the speckit authoring card? The spec-doc owner fix in that phase builds to the answer.
- Answered 2026-11-14 (see below), phase 9: who owns ai-council artifact writes, the agent, `persist-artifacts.cjs` or the command workflow? The answer decides its scope.
- Answered 2026-11-14 (see below), phase 14: are the prompt-improver's Opus and Fable deny rows deliberate policy? The model-eligibility fix in that phase builds to the answer.
- Phases 6, 8, 10, 11, 12 and 13 raised further questions while planning. Each child's own open-questions section lists them with the default its plan takes, so only the three above blocked a build, and all three are answered.
- Operator answers, 2026-11-14, through the question tool. Phase 9: the agent stays the one writer of ai-council artifacts, and the registry drops its `persist-artifacts.cjs` step. Phase 14: keep the Opus and Fable rule but move it to the dispatcher, so the workflows pass `model=sonnet`, the Claude copy pins sonnet, the table lives in sk-prompt and the agent keeps a one-line refusal. Phase 8: the main agent owns spec-folder docs, so `orchestrate.md:461` stays and the `@markdown` route at `:444` and the rejection at `:499` go. Next step: rebuild the trigger index, commit the plan on branch 384 without pushing, then build phase 6.
- Operator answers, 2026-11-15, in chat after phase 29: yes to adding phases 21 to 29 to the v4.0.2.1 changelog and moving the tag, and yes to counting DeepSeek Harness and Mistral Vibe as full runtimes. The changelog gained the computed checks and verdict, the coverage and scope fixes, the Vibe budget and the agent fixes. `README.md`, `CONTRIBUTING.md`, `INSTALL-SKILLED.md` and `.skilled/CROSS-CLI.md` now count eight runtimes. CROSS-CLI keeps each contract for runs dispatched from outside the checkout, because DSH reads no project folder unless a `--patch` names one.
- Build order: phase 6 first. Phase 7 lands before phase 8, because it edits two lines of `orchestrate.md`. Phase 8's planned size of about 591 lines is re-measured after phases 6 and 7 land.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
