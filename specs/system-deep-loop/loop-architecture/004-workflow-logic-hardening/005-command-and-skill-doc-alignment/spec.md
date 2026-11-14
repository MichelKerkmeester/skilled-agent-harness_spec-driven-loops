---
title: "Feature Specification: Phase 5: command-and-skill-doc-alignment"
description: "The deep-research and deep-review command docs, mode skills and agent files state tool-call budgets, executor counts, script paths, workflow file names and flag lists that disagree with the files the loop runs. This phase gives each fact one owner, makes the other docs point at it, describes the changes from phases 001 to 004 and adds a doc drift guard."
trigger_phrases:
  - "command and skill doc alignment"
  - "phase 5 command and skill doc alignment"
  - "deep research review doc drift guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: command-and-skill-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-workflow-single-source-and-drift-guard |
| **Successor** | 006-ai-council-mode-deprecation |
| **Handoff Criteria** | Phase 006 may start when `check-documentation-drift.cjs` exits 0 on the final tree and this folder prints `RESULT: PASSED` under `validate.sh --strict`. The parent closes when every child passes `validate.sh --recursive --strict`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Fix every deep-research and deep-review workflow logic, drift and doc finding from the 2026-11-14 analysis specification.

**Scope Boundary**: Prose docs, agent definitions, presentation files and one doc drift check for the deep-research and deep-review loops, plus the docs outside the two mode packets that name the changed files or stop reasons. Workflow logic, workflow YAML files and runtime libraries belong to phases 001 to 004. A file a phase 004 test reads is updated by phase 004. The deep-ai-council mode belongs to phase 006.

**Dependencies**:
- Phase 001 moves the stop decision into `runtime/scripts/convergence.cjs` and freezes one stop-reason list that includes `maxDurationReached`.
- Phase 002 lands state-derived counters, the failure rule, the confirm-only Retry, Skip or Cancel gate after three failed iterations and the reducer as the only dashboard writer.
- Phase 003 lands the research restart flags, the dispatch-long lock and `maxDurationMinutes` enforcement with stop reason `maxDurationReached`.
- Phase 004 replaces the four workflow files with `deep-research.yaml` and `deep-review.yaml`, wires dry run in both modes and updates the command docs and presentation files its tests read.

**Deliverables**:
- An extended `runtime/scripts/check-documentation-drift.cjs` that fails on the three fact classes in D4.
- Corrected command docs, presentation files, mode skills, references, agent files, feature catalogs and manual testing playbooks.
- One changelog entry per changed packet.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator or agent who reads the deep-research or deep-review docs gets facts that the running loop does not follow. The research skill says the iteration budget is max 12 while the rendered prompt says 24. The research skill counts nine executor kinds where the code lists eight. The review skill names a reducer script and workflow files that do not exist. The two command docs give contradictory dispatch orders and flag lists. Nothing fails when a doc drifts like this, so the drift returns after each fix.

### Purpose
Every deep-research and deep-review doc states each loop fact the same way as its single owner, and a drift check fails when one stops doing so.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command, run from the repository root on 2026-11-14, with its verbatim output:

```text
$ S=.skilled/skills/system-deep-loop && rg -n 'tool_call_budget' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml; rg -n 'maxToolCallsPerIteration' $S/deep-research/assets/deep-research-config.json $S/deep-review/assets/deep-review-config.json; rg -n 'Max \{max_tool|Target 9 tool' $S/deep-research/assets/prompt-pack-iteration.md.tmpl $S/deep-review/assets/prompt-pack-iteration.md.tmpl; rg -n '\(max 12\)' $S/deep-research/SKILL.md $S/deep-review/SKILL.md; rg -n 'nine executor kinds' $S/deep-research/SKILL.md; sed -n '/EXECUTOR_KINDS = \[/,/\] as const/p' $S/runtime/lib/deep-loop/executor-config.ts | grep -c "^  '"; rg -n 'scripts/reduce-state' $S/deep-review/SKILL.md | cut -c1-90; ls $S/deep-review/scripts/reduce-state.cjs; rg -c 'deep_review_\{auto,confirm\}' $S/deep-review -g '!**/changelog/**'
.skilled/commands/deep/assets/deep-review-auto.yaml:90:  tool_call_budget: { target: 9, soft_max: 12, hard_max: 13 }
.skilled/commands/deep/assets/deep-research-auto.yaml:98:  tool_call_budget: { target: 12, max: 24 }
.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:12:  "maxToolCallsPerIteration": 24,
.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:18:  "maxToolCallsPerIteration": 12,
.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:94:- Target 9 tool calls. Soft max 12, hard max 13.
.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:36:- Target 3-5 research actions. Max {max_tool_calls_per_iteration} tool calls total.
.skilled/skills/system-deep-loop/deep-review/SKILL.md:246:3. **Exceed TCB**, Target 8-11 tool calls per iteration (max 12). Breadth over depth per cycle.
.skilled/skills/system-deep-loop/deep-research/SKILL.md:206:3. **Exceed TCB** -- Target 8-11 tool calls per iteration (max 12)
92:The nine executor kinds are owned by `runtime/lib/deep-loop/executor-config.ts`.
8
59:- Treat `scripts/reduce-state.cjs` as the reducer for DERIVED artifacts only (finding r
238:7. Use `generate-context.js` for continuity saves. **Owner**: the YAML workflow (`deep
287:Scripts: `scripts/reduce-state.cjs`, `scripts/runtime-capabilities.cjs`.
ls: .skilled/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs: No such file or directory
.skilled/skills/system-deep-loop/deep-review/SKILL.md:1
.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:1
.skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:1
.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:4
.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/quality-gates.md:1
```

#### Finding verification

| Finding | Holds | Evidence and correction |
|---------|-------|-------------------------|
| F13 | Yes, with a correction | No runtime script counts tool calls. A search for `tool_call_budget\|maxToolCallsPerIteration\|max_tool_calls` over `runtime/` and the workflow assets finds no reader of the YAML `tool_call_budget` blocks. The value the agent sees is the rendered prompt pack. Research renders `config.maxToolCallsPerIteration` (24 above) at `deep-research-auto.yaml:1186` and `deep-research-confirm.yaml:1189`. Review renders nothing from config: its prompt pack holds the literal "Target 9 ... hard max 13" at `prompt-pack-iteration.md.tmpl:94`, and the review config value 12 is never read. Other stale copies: `deep-research/SKILL.md:104` and `:206` (max 12), `deep-research/references/protocol/loop-protocol.md:307` ("default: 12"), `.skilled/agents/deep-research.md:186`, `:410` and `:464` (max 12) and its runtime mirrors. `.skilled/agents/deep-review.md:502` and `:624` say max 13, which matches the review prompt pack. |
| F17 | Yes | `research.md:60` and `review.md:33` assume `opencode run --command`. `research.md:13`, `:22` and `:29` forbid dispatch from the doc while `:64` says "PROCEED immediately" to dispatch for "ONE iteration". `:64` to `:71` and `:73` to `:80` state the directive twice. `review.md:35` still says "research topic". |
| F18 | Partly | The executor count holds: `deep-research/SKILL.md:92` says nine and `EXECUTOR_KINDS` lists 8. The review reducer path holds: `deep-review/SKILL.md:59` and `:287` name `scripts/reduce-state.cjs`, which is absent, and the review workflow calls `runtime/scripts/reduce-state.cjs` at `deep-review-auto.yaml:1100`. `deep-research/SKILL.md:309` names the same relative path, but that file exists, because research has its own reducer at `deep-research/scripts/reduce-state.cjs` (3393 lines) called at `deep-research-auto.yaml:1048`. The underscore names hold for the review skill and three references, and a fourth review surface the finding missed is `deep-review/feature-catalog/severity-system/quality-gates.md:27`. `runtime/references/integration-points.md` uses hyphen names for research and review. Its one underscore name at `:158` is `deep_ai_council_{auto,confirm}.yaml`, which belongs to the council mode. |
| F19 | Yes | `deep-research/SKILL.md:190` makes `research/research.md` workflow-owned while `:210` says "Append ... never replace". `:207` says "Ask the user" is banned while `:5` and `:58` offer `:confirm`. `:288` says "@orchestrate dispatches @deep-research" while `:84` and `:212` ban direct Task dispatch. |
| F20 | Yes | The routing step at `research.md:97` omits `--convergence-mode`, which the table lists at `:116`. The routing step at `review.md:70` omits `--convergence-mode` and `--no-resource-map`, which the table lists at `:87` and `:90`. |
| F21 | Yes | `review.md:140` to `:146` holds no summary sentence under its workflow summary heading. Only `research.md:27` to `:45` carries the execution-protocol block. |
| Operator scope, convergence.md | Yes | The `stopReason` table at `deep-research/references/convergence/convergence.md:85` to `:92` lists six values. It omits `manualStop`, which `:68` of the same file names, and `maxDurationReached`. Step 7 at `:121` evaluates graph blockers only "If graphEvents exist", which lets a STOP pass with no graph decision. Phase 001 D4 blocks it. |
| Operator scope, outside docs | Yes | `.skilled/agents/deep-review.md:310` and `:311` name the two review twins, and phase 004 `plan.md:97` hands them to this phase. `sk-create-command/SKILL.md:148` uses `deep-research-confirm.yaml` as an example name. `command-authoring.md:40` names `deep-research-auto.yaml`. `system-spec-kit/README.md` names no workflow file or stop reason today (`:351`, `:493` and `:695` name only the command and skill). |
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `runtime/scripts/check-documentation-drift.cjs` with a facts check that fails on a wrong executor count, a missing workflow or script file and a routing-step flag set that differs from the flag table.
- Give the tool-call budget, the executor list and the flag surface one owner each and point every other doc at that owner.
- Rewrite the autonomous directive once per command doc and give both command docs one section order.
- Correct the stale paths, counts and conflicting rules in both mode skills, their references and the agent definitions.
- Correct the docs outside the mode packets that name the changed files or stop reasons: the `sk-doc` and `sk-code` command checklists and the speckit README.
- Describe the phase 001 to 004 changes in every doc surface the plan inventory lists, and add one changelog entry per changed packet.

### Out of Scope
- Workflow YAML, runtime libraries, scripts other than the drift checker and config values - phases 001 to 004 own behavior, and this phase only describes it.
- The value of either tool-call budget - choosing 24 or 12 for research and 12 or 13 for review is an open question, so docs point at the owner instead of restating a number.
- The deep-ai-council mode, including `ai-council.md:44` and `integration-points.md:158` - phase 006 retires that mode.
- Workflow file names and the `--dry-run` row in the command docs and presentation files - a phase 004 test reads those files, so phase 004 updates them.
- Hub routing in `SKILL.md`, `ROUTER.md` and the registries - D5 allows an edit only where a file name or fact is wrong.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` | Modify | Add the facts check and its flag. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/check-documentation-drift.vitest.ts` | Create | Test the three fact classes against fixtures and the live tree. |
| `.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md` | Modify | One directive, shared section order, routing step points at the flag table, new flag rows. |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt` | Modify | Workflow file names, restart and dry-run wording. |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `deep-review/SKILL.md` | Modify | Budget pointer, executor pointer, reducer path, rule conflicts, phase 001 to 004 behavior. |
| `deep-research/references/`, `deep-review/references/`, `runtime/references/integration-points.md` | Modify | Stale defaults and workflow file names. |
| `.skilled/agents/deep-research.md`, `.skilled/agents/deep-review.md` and their runtime mirrors | Modify | Budget lines point at the prompt pack value. The review agent names `deep-review.yaml`. |
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Modify | Sections 2 and 3: full stop-reason table and the missing-graph rule. |
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md` | Modify | Name workflow files that exist. |
| `.skilled/skills/system-spec-kit/README.md` | Check | Names no changed file or stop reason today. Edit only if phases 001 to 004 make a line wrong. |
| Feature catalogs and manual testing playbooks under `deep-research/`, `deep-review/` and `runtime/` | Modify | Workflow file names and changed steps. |
| `changelog/` in each changed packet, including `sk-create-command` and `sk-code-skilled` | Create | One entry per changed packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | D4: `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` exits 1 on the tree before the doc edits and names the `deep-research/SKILL.md:92` executor count, and exits 0 with `"errors": []` after them. |
| REQ-002 | F13: no deep-research or deep-review skill, reference or agent file states a tool-call number. Each points at the prompt-pack value, which for research is `maxToolCallsPerIteration` in `deep-research-config.json` and for review is line 94 of `deep-review/assets/prompt-pack-iteration.md.tmpl`. |
| REQ-003 | F17: each command doc holds exactly one autonomous directive that names no runtime binary and says the workflow owns dispatch. In `review.md` it names the review target instead of the research topic. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | F18: `deep-research/SKILL.md` states no executor count that differs from `EXECUTOR_KINDS` in `runtime/lib/deep-loop/executor-config.ts`. |
| REQ-005 | F18: `deep-review/SKILL.md` names `runtime/scripts/reduce-state.cjs` as its reducer, and every script path in it resolves to an existing file. |
| REQ-006 | F18: no doc outside `changelog/`, `benchmark/`, `behavior-benchmark/` and tests names a research or review workflow file that does not exist in `.skilled/commands/deep/assets/`. |
| REQ-007 | F19: `deep-research/SKILL.md` holds one rule for `research/research.md` ownership, scopes its no-ask rule to the leaf agent, and names the command workflow as the only dispatcher. |
| REQ-008 | F20: the routing step in each command doc lists no flag set of its own and points at the Workflow Flag Surface table. |
| REQ-009 | F21: both command docs print the same `##` heading list, and a section present in one is present in the other or its absence is stated in one sentence. |
| REQ-010 | Phase 003: the research flag table lists `--restart` and `--lineage-mode`. The `--dry-run` row and the workflow file names in both command docs are phase 004's and are only checked here. |
| REQ-011 | Phases 001 to 004: each mode `SKILL.md`, its references, feature catalog and manual testing playbook name `runtime/scripts/convergence.cjs` as the stop decision, the state-derived counters and failure rule, `maxDurationReached` as the duration stop and `deep-research.yaml` or `deep-review.yaml` as the workflow wherever they describe those steps. |
| REQ-012 | Each packet with a changed file gains one changelog entry that names the changed files. |
| REQ-013 | Operator scope: the `stopReason` table in section 2 of `deep-research/references/convergence/convergence.md` lists every value in phase 001's frozen list, including `manualStop` and `maxDurationReached`. |
| REQ-014 | Operator scope: step 7 in section 3 of the same file says a missing graph decision blocks every non-terminal STOP, as phase 001 decides. |
| REQ-015 | Operator scope: `.skilled/agents/deep-review.md` and its runtime mirrors name `deep-review.yaml` and no deleted workflow file. |
| REQ-016 | Operator scope: `sk-create-command/SKILL.md` and the `sk-code-skilled` command-authoring checklist name only workflow files that exist. |
| REQ-017 | Operator scope: `system-spec-kit/README.md` names no deleted workflow file and no stop reason outside phase 001's frozen list. |
| REQ-018 | Operator answer: `deep-review/SKILL.md` scopes its no-ask rule at line 249 to the leaf agent and names `:confirm` as the workflow's ask point. |
| REQ-019 | Phase 002: both mode `SKILL.md` files describe the Retry, Skip or Cancel gate after three failed iterations as a confirm-only checkpoint. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` exits 0 and prints `"errors": []` on the final tree.
- **SC-002**: `rg -n "opencode run" .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints nothing.
- **SC-003**: `rg -n '\(max 12\)|nine executor kinds' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 to 004 land their file names and behavior | Docs cannot name a stop script or workflow file that does not exist yet | Start only when all four children show Status Complete. The facts check fails on any named file that does not exist. |
| Risk | The facts check scans changelogs or tests, which keep old names on purpose | High: the check never passes | Exclude `changelog/`, `benchmark/`, `behavior-benchmark/`, `tests/` and `node_modules/`, and test that an excluded file with an underscore name passes. |
| Risk | Phase 004 adds a drift guard over the same files | Med: two checks report one defect | Phase 004 guards workflow assets. This phase guards prose docs only. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `check-documentation-drift.cjs --facts` finishes in under 10 seconds on the full tree.

### Security
- **NFR-S01**: The facts check reads files only and writes nothing.

### Reliability
- **NFR-R01**: The facts check exits 0 when clean, exits 1 with one line per failure naming `file:line` and exits 2 on an unknown flag.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a doc that states no executor count, no file name and no routing flags passes the facts check.
- Maximum input: the check scans every markdown and text file the plan inventory covers, 131 files today, plus the files phases 001 to 004 add.
- Failure path: when `EXECUTOR_KINDS` cannot be parsed from `executor-config.ts`, the check exits 2 and names the file.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 150 doc files across five packets and two commands, one script and one test file. |
| Risk | 8/25 | Prose and one read-only check. No workflow or runtime behavior changes. |
| Research | 10/20 | The changed steps depend on phases 001 to 004, which are not built yet. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The operator and phase 002 answered all four questions from 2026-11-14. `goal.md` section 4 records each answer.
<!-- /ANCHOR:questions -->

---
