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
Audit every .opencode/commands/** command.md, workflow/route YAML, presentation .txt and compiled contract; the whole /doctor subsystem; and all 12 agents across .claude/agents + .opencode/agents — for logic alignment with current skill reality. Emit ranked P0/P1/P2 findings, each with file:line + concrete fix, partitioned by surface (commands / doctor / agents / cross-surface). READMEs are phase 005, out of scope here.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Do all command.md dispatch paths, mode suffixes, and asset links resolve to real skills/modes/files under the current hub structure?
- [ ] Are command workflow/route YAML + presentation .txt internally consistent with their command.md (modes, flags, allowed-tools, registered MCP namespaces)?
- [ ] Does the /doctor subsystem (router speckit.md, _routes.yaml, per-target YAML, scripts) have full route<->yaml<->script tri-existence + honest mutation-class, and do the read-only targets run clean?
- [ ] Are the 12 agents cross-runtime body-synced (.claude vs .opencode), with coherent tool grants, correct path self-refs, and current skill/model refs?
- [ ] What cross-surface drift exists (command<->skill<->agent<->advisor: dead refs, stale enumerations, renamed-skill fallout) beyond the 9 recon seed defects?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Rewriting skill internals (SKILL.md logic); README alignment (phase 005); implementing fixes (report findings only).

---

## 5. STOP CONDITIONS
Reach 5 iterations for this batch (minIterations=maxIterations; convergenceMode=off — no early stop).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

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
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Validate every allowed-tool grant against the active OpenCode tool registry, especially legacy root commands and MCP method-level names. (iteration 1)
- Mechanically compare every command Markdown asset link with all 62 YAML and 35 presentation files, including mode and flag parity. (iteration 1)
- Confirm the `.codex/agents` README seed in the agent-focused iteration; README remediation remains out of scope. (iteration 1)
- Audit all 12 Claude/OpenCode agent mirror pairs for body drift beyond the confirmed deep-research localization miss. (iteration 1)
- Compare deep command Markdown, auto/confirm YAML, presentations, compiled contracts, and manifest records field by field. (iteration 1)
- Verify doctor route-to-YAML-to-script tri-existence and execute read-only doctor targets; this iteration checked manifest/table existence only. (iteration 1)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (iteration 2)
- Do all command workflow YAMLs and presentations outside `/doctor` match their command Markdown and compiled contracts field by field? (iteration 2)
- Which remaining router-level allowed tools are unused overgrants after route-specific reconciliation? (iteration 2)
- Are all 12 Claude/OpenCode agent mirrors body-synced and correctly localized? (iteration 2)
- Which frontmatter schema does the installed Claude runtime enforce for `.claude/agents/*.md`, and should `create-agent` emit different schemas for Claude and OpenCode? (iteration 3)
- Is `.codex/agents` intended to be restored as a generated mirror in a later phase, or should all live agent-directory claims be removed now? (iteration 3)
- Do all command workflow YAMLs and presentations outside `/doctor` match command Markdown and compiled contracts field by field? (iteration 3)
- Do any additional presentation fields use copy-pasted state names that disagree with their command family? (iteration 4)
- Which command-to-skill and command-to-agent references remain dead after excluding the already confirmed design transport routes? (iteration 4)
- Which router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (iteration 5)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (iteration 5)
- Should runtime directory inventories be generated from runtime capability metadata rather than repeated in command YAML? (iteration 5)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention, or is it correctly doctor-specific alongside `approval_gates:`/`forbidden_operations:` elsewhere? (iteration 6)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook keyed on the same source paths it digests, and who owns triggering re-compilation when `mode-registry.json` or a mode `SKILL.md` changes? (iteration 6)
- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward, unaddressed this iteration) (iteration 6)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map, or is the presentation-menu-driven dispatch intentionally exempt from Gate-2 lexical routing (and the header comment simply wrong)? (iteration 6)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried forward) (iteration 6)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook? (carried forward, still unaddressed) (iteration 7)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (carried forward, still unaddressed) (iteration 7)
- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward, still unaddressed) (iteration 7)
- Which command-to-skill and command-to-agent references remain dead beyond the classes already found across iterations 5 and 7 (`speckit.md`, `write.md`, singular `.opencode/agent`)? A full mechanical sweep of every `agent_file:`/`agent_availability` block across all 62 workflow YAMLs beyond `/create` and `/deep` and `/speckit` families has not yet been done. (iteration 7)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried forward, still unaddressed) (iteration 7)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried forward, still unaddressed) (iteration 7)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention, or is it correctly doctor-specific alongside `approval_gates:`/`forbidden_operations:` elsewhere? (carried forward since iteration 6) (iteration 8)
- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward since iteration 5) (iteration 8)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried forward since iteration 2) (iteration 8)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook keyed on the same source paths it digests, and who owns triggering re-compilation when `mode-registry.json` or a mode `SKILL.md` changes? (carried forward since iteration 6) (iteration 8)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried forward since iteration 5) (iteration 8)
- Which command-to-skill and command-to-agent references remain dead beyond the classes already found across iterations 5 and 7 (`speckit.md`, `write.md`, singular `.opencode/agent`)? A full mechanical sweep of every `agent_file:`/`agent_availability` block across all 62 workflow YAMLs beyond `/create`, `/deep`, and `/speckit` families has not yet been done. (carried forward since iteration 7) (iteration 8)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried forward since iteration 5 — answered in principle at iteration 7, implementation not yet applied) (iteration 9)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter-10; adoption decision deferred to implementation) (iteration 11)
- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward since iteration 5 — still unaddressed) (iteration 11)
- Which frontmatter schema does the installed Claude runtime enforce? (carried since iteration 3 — P1-A1 remains) (iteration 11)
- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried since iteration 5) (iteration 12)
- Should runtime directory inventories be generated from runtime capability metadata rather than repeated in command YAML? (carried since iteration 5) (iteration 12)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook? (carried since iteration 6) (iteration 12)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried since iteration 6) (iteration 12)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried since iteration 2) (iteration 12)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried since iteration 5 — answered in principle at iteration 7, implementation not yet applied) (iteration 12)
- Is `.codex/agents` intended to be restored as a generated mirror in a later phase? (carried since iteration 3) (iteration 12)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter-10; adoption decision deferred) (iteration 12)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried since iteration 6 — P1-D1 resolved the "is the header wrong" sub-question; the "should it be wired" sub-question remains) (iteration 13)
- Should create-agent call the system-spec-kit command workflow directly? (carried since iteration 5 — answered in principle at iteration 7/10, implementation not yet applied) (iteration 13)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried since iteration 6 — the "is the header wrong" sub-question was resolved at iter 13; the "should it be wired" sub-question remains) (iteration 14)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter 10; adoption decision deferred — iter 13 resolved: No, correctly doctor-specific) (iteration 14)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter 10; adoption decision deferred — iter 13 resolved: No, correctly doctor-specific)

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Populated during initialization from memory_context() results, if any prior work exists]

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: [from config]
- Convergence threshold: [from config]
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability_matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: [from config.lineage.generation]
- Started: [timestamp]
