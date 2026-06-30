---
title: "Implementation Plan: Real-World Usefulness Test"
description: "Execution design for a planning-only packet that will later validate code graph, hooks, and plugin/runtime integrations against day-to-day coding workflows."
trigger_phrases:
  - "real-world usefulness plan"
  - "CLI matrix"
  - "code graph usefulness campaign"
  - "hook usefulness campaign"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/001-usefulness-test-methodology"
    last_updated_at: "2026-05-05T00:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Authored execution plan for later usefulness campaign"
    next_safe_action: "User reviews plan, then dispatches execution in a follow-up pass"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1212121212121212121212121212121212121212121212121212121212121212"
      session_id: "026-007-012-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
# Implementation Plan: Real-World Usefulness Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, shell hooks, MCP surfaces, external CLI wrappers |
| **Framework** | Spec Kit Memory, code graph MCP, runtime hooks, CLI orchestration skills |
| **Storage** | Existing spec docs, code graph DB, memory index, per-trial result logs created later |
| **Testing** | Manual scenario execution, paired controls, strict spec validation |

### Overview
This packet designs a campaign, not the campaign results. The follow-up execution pass will run paired assisted and control trials across representative CLI variants, record quantitative and qualitative evidence, then classify code graph, hook, and plugin/runtime surfaces as useful, mixed, or overhead.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scenario battery defined. Evidence: `spec.md` lists `S-CG-01` through `S-PL-04`.
- [x] CLI matrix defined. Evidence: `plan.md` CLI Matrix section lists 58 planned scenario-runtime cells.
- [x] Measurement rubric defined. Evidence: `plan.md` Scoring Rubric section.

### Definition of Done for This Scaffold
- [x] Level 2 planning docs exist with no template placeholders.
- [x] ADRs document the methodology decisions.
- [x] Parent metadata includes the new child packet.
- [x] Strict validation passes for child and parent. Evidence: both `validate.sh --strict` commands exited 0 on 2026-05-05.

### Definition of Done for Later 012-EXEC
- [ ] At least three trials run for every included scenario-runtime cell.
- [ ] Control runs captured for every scenario.
- [ ] Quantitative metrics and qualitative scores captured per trial.
- [ ] Synthesis report identifies useful, mixed, and overhead systems.
- [ ] Improvement backlog includes file:line citations for systems judged overhead.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Paired empirical evaluation with scenario-specific runtime subsets.

### Key Components
- **Scenario Battery**: Twelve stable scenarios grouped by code graph, hooks, and plugin/runtime integration.
- **Runtime Matrix**: Seven CLI variants, included only where the surface exists or the comparison is meaningful.
- **Control Path**: Baseline workflow without the target system, such as grep/manual reading, manual spec search, or runtime-only review.
- **Trial Record**: One row per run with scenario id, CLI id, trial number, assisted/control label, timestamps, metrics, scores, and notes.
- **Synthesis Report**: Final classification of systems and a cited improvement backlog.

### Data Flow
The execution pass starts by preparing a fixed task corpus and prompt corpus. Each scenario runs paired assisted and control trials, writes trial records, then aggregates metrics by scenario, axis, and CLI variant. The synthesis step converts those aggregates into usefulness judgments and backlog items.

### CLI Identifiers

| CLI ID | Runtime Variant | Use |
|--------|-----------------|-----|
| `claude-code-native` | Claude Code native runtime | Startup, hooks, graph retrieval, memory, sk-code routing. |
| `cli-codex-54-medium` | cli-codex with gpt-5.4 medium | Model-variant comparison where runtime context matters. |
| `cli-codex-55-high` | cli-codex with gpt-5.5 high | Primary Codex external invocation comparator. |
| `cli-copilot-default` | cli-copilot default model | External CLI behavior and hook/plugin parity. |
| `cli-gemini-31-pro` | cli-gemini with gemini-3.1-pro-preview | Non-OpenAI external comparator. |
| `cli-claude-code-external` | cli-claude-code external invocation | Claude external dispatch comparator. |
| `opencode-native` | OpenCode runtime native | Native OpenCode hook/plugin baseline. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

No production fix is implemented in this packet. The affected surfaces are systems under evaluation in the later execution pass.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/code_graph/` | Code graph scan, query, context, status, verify, cache, scope policy. | Evaluate usefulness through S-CG-01 through S-CG-04. | Trial records compare graph-assisted flow against control flow. |
| Session-prime hook | Injects startup context into supported runtimes. | Evaluate first-turn relevance through S-HK-01 and S-PL-01. | Relevance and usefulness scores plus context accuracy notes. |
| Skill-advisor hook | Routes prompts toward skills. | Evaluate routing accuracy through S-HK-02 and S-PL-04. | Human-labelled prompt corpus and routing evidence. |
| Gate 3 classifier hook | Separates write-intent from read-only prompts. | Evaluate precision through S-HK-03. | False-positive and false-negative rates. |
| Structured-context injection hooks | Preserve useful state across startup, retrieval, and compaction. | Evaluate recovery through S-HK-04 and S-PL-02. | Lost-state inventory and retrieval hit rate. |
| CLI plugin/runtime integrations | Expose tools, context, and completion suggestions across runtimes. | Evaluate consistency through S-PL-01 through S-PL-04. | Cross-runtime matrix and synthesis report. |

Required inventories for execution:
- Same-class producers: enumerate hook entrypoints, code graph handlers, and runtime wrapper scripts before trial execution.
- Consumers: identify which runtime sees each context surface before marking a CLI cell included.
- Matrix axes: scenario id, CLI id, assisted/control, trial number, task corpus item, prompt corpus item.
- Algorithm invariant: usefulness cannot be claimed from relevance alone; adoption or decision-quality improvement must be recorded.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Freeze the repo state, task corpus, prompt corpus, and runtime versions.
- [ ] Confirm each CLI variant is available and record model/runtime version.
- [ ] Create a trial log schema and a results folder in the execution packet.
- [ ] Record the control workflow for each scenario before assisted trials begin.

### Phase 2: Pilot
- [ ] Run one pilot trial for `S-CG-01`, `S-HK-01`, and `S-PL-01` only.
- [ ] Confirm timing, token, scoring, and notes fields are practical to capture.
- [ ] Adjust only the measurement mechanics, not the scenario ids or scoring anchors, unless the user approves a plan revision.

### Phase 3: Full Scenario Execution
- [ ] Run three assisted trials per included scenario-runtime cell.
- [ ] Run paired control trials for every scenario.
- [ ] Capture blocked cells with explicit reason and user-approved deferral if the runtime lacks the tested surface.

### Phase 4: Analysis
- [ ] Aggregate time, token, hit-rate, adoption, relevance, usefulness, and correctness metrics.
- [ ] Compare assisted versus control deltas per scenario and per system axis.
- [ ] Identify useful, mixed, and overhead classifications.

### Phase 5: Synthesis
- [ ] Write the synthesis report.
- [ ] Create an improvement backlog with file:line citations.
- [ ] Update the execution implementation summary and checklist with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### CLI Matrix

| Scenario | Included CLI Variants | Cell Count | Rationale |
|----------|-----------------------|------------|-----------|
| S-CG-01 | `claude-code-native`, `cli-codex-55-high`, `opencode-native`, `cli-gemini-31-pro` | 4 | Caller lookup should be tested in native and external flows where graph context can be requested. |
| S-CG-02 | `claude-code-native`, `cli-codex-55-high`, `opencode-native`, `cli-gemini-31-pro` | 4 | Module orientation is a common coding workflow and supports direct graph-context comparison. |
| S-CG-03 | `claude-code-native`, `cli-codex-55-high`, `opencode-native`, `cli-claude-code-external` | 4 | Refactor preview needs tool-context comparison before edits; no edits occur during measurement unless later approved. |
| S-CG-04 | `claude-code-native`, `cli-codex-55-high`, `opencode-native`, `cli-copilot-default` | 4 | Structural invariant search exercises graph value against grep/script controls. |
| S-HK-01 | All seven CLI variants | 7 | Startup relevance is inherently cross-runtime. |
| S-HK-02 | All seven CLI variants | 7 | Skill advisor routing should be compared wherever prompt-entry guidance is surfaced. |
| S-HK-03 | `claude-code-native`, `cli-codex-55-high`, `cli-copilot-default`, `opencode-native` | 4 | Gate 3 behavior matters most in write-capable or hook-aware runtimes. |
| S-HK-04 | `claude-code-native`, `cli-codex-55-high`, `opencode-native` | 3 | Compaction recovery is only meaningful where long-session compaction can be observed. |
| S-PL-01 | All seven CLI variants | 7 | Startup integration is the core cross-runtime plugin comparison. |
| S-PL-02 | All seven CLI variants | 7 | Prior-decision retrieval is common day-to-day work across runtimes. |
| S-PL-03 | `cli-codex-55-high`, `cli-copilot-default`, `cli-gemini-31-pro`, `cli-claude-code-external` | 4 | External dispatch consistency applies to external invocations, not native-only sessions. |
| S-PL-04 | All seven CLI variants | 7 | sk-code routing should fire consistently wherever skill routing is supported. |

**Matrix size**: 12 scenarios, 7 CLI variants, 58 included scenario-runtime cells, 174 assisted trials at three trials per cell, plus control trials.

### Quantitative Metrics

| Metric | Definition | Capture Rule |
|--------|------------|--------------|
| Time-to-result | Seconds from prompt submission to first usable answer. | Record start/end timestamp per trial. |
| Time-to-confidence | Seconds until operator can decide next action. | Record when operator marks confidence reached. |
| Token usage | Input, output, and total tokens when available. | Use CLI-reported values; otherwise `UNKNOWN`. |
| Context-injection accuracy | Relevant injected items divided by total injected items. | Human audit each injected item as relevant or irrelevant. |
| Retrieval hit rate | Correct memory/spec/code context found on first attempt. | Boolean per trial plus notes. |
| Suggestion adoption rate | Whether the system's suggestion changed the operator's next action. | `adopted`, `partially_adopted`, or `rejected`. |
| Rework count | Number of follow-up prompts needed to correct or complete answer. | Count turns before usable result. |

### Qualitative Rubric

| Score | Relevance | Usefulness |
|-------|-----------|------------|
| 0 | Irrelevant or distracting context. | Adds overhead or misleads the operator. |
| 1 | Some relevant terms, but misses the task need. | Slightly helpful but not enough to change workflow. |
| 2 | Mostly relevant and supports the task. | Saves time or improves confidence in a noticeable way. |
| 3 | Directly relevant with high signal and little noise. | Clearly changes the operator's next action for the better. |

### Control Comparison

Every scenario gets a control. For code graph scenarios, the control is grep/manual reading or IDE-assisted preview without graph output. For hook scenarios, the control is the same prompt without injected hook context or against a human-labelled corpus. For plugin/runtime scenarios, the control is direct runtime use without plugin retrieval where possible, or manual spec search when disabling integration is not practical.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing code graph tools | Internal | Green enough for planning | Execution cannot measure graph value until scan/query/context/status are callable. |
| Runtime hook installation | Internal | Unknown until execution preflight | Cells may be excluded if a runtime lacks the hook surface. |
| External CLI availability | External/local | Unknown until execution preflight | CLI-specific cells may become blocked or deferred. |
| Historical prompt corpus | Local/session data | Needed later | S-HK-02 and S-HK-03 lose external validity without real prompts. |
| Token usage visibility | Runtime-specific | Mixed | Token metrics may be partial and must allow `UNKNOWN`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scaffold is judged out of scope or the user rejects the scenario design before execution.
- **Procedure**: Remove the `011-real-world-usefulness-test-planning` child folder and remove its entry from parent `graph-metadata.json.children_ids`.
- **Execution Data Reversal**: Not applicable in this packet because no scenario data is generated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Scaffold approval -> Execution preflight -> Pilot -> Full matrix -> Analysis -> Synthesis -> Improvement backlog
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffold approval | This packet validates strict | All execution work |
| Execution preflight | User approval and CLI availability | Pilot |
| Pilot | Trial log schema and runtime access | Full matrix |
| Full matrix | Pilot mechanics accepted | Analysis |
| Analysis | Complete or deferred matrix cells | Synthesis |
| Synthesis | Aggregated metrics | Improvement backlog |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scaffold review | Low | 30 minutes |
| Execution preflight | Medium | 60-90 minutes |
| Pilot | Medium | 90 minutes |
| Full matrix | High | Multi-day effort; 174 assisted trials plus controls |
| Analysis and synthesis | High | 0.5-1 day after data capture |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] User approves this planning packet.
- [ ] Execution pass confirms writable scratch/result location.
- [ ] Execution pass confirms no production files will be modified by scenario trials.

### Rollback Procedure
1. Stop the execution pass before running more trials.
2. Preserve already captured raw logs if they help diagnose methodology issues.
3. Patch the plan or scenario battery under explicit user approval.
4. Restart only affected cells with a new trial batch id.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete execution scratch/results only if the user asks. This scaffold produces no trial data.
<!-- /ANCHOR:enhanced-rollback -->
