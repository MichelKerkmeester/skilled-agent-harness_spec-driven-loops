---
title: "Implementation Plan: Manual Testing Playbook Execution Sweep"
description: "Batch dispatch 485 manual testing playbook scenarios to GPT-5.5-fast (medium) via cli-opencode, 10 concurrent per wave, writing real evidence in place."
trigger_phrases:
  - "manual playbook execution sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/014-manual-playbook-execution-sweep"
    last_updated_at: "2026-07-02T06:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Drafted the execution plan"
    next_safe_action: "Build the manifest, run provider pre-flight, launch wave 1"
    blockers: []
    key_files: ["plan.md", "manifest.tsv"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-02-031-manual-playbook-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: Manual Testing Playbook Execution Sweep

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario docs, MCP tool calls, CLI invocations |
| **Executor** | `opencode run --model openai/gpt-5.5-fast --variant medium` |
| **Isolation** | Live tree, direct dispatch (evidence writes are the intended output; not a code-mutation risk requiring worktree isolation per RM-8, since no production code is touched) |
| **Concurrency** | 10 dispatches per wave, ~49 waves total |

### Overview
Build a manifest of all 485 scenario file paths. For each, compose a dispatch prompt instructing GPT-5.5-fast to read the scenario file, execute its documented Commands against the real repo/MCP tools, and write real evidence plus a PASS/FAIL/BLOCKED verdict into the file's own Evidence section. Launch in waves of 10 concurrent background dispatches, wait for each wave to complete before launching the next, track per-scenario completion in the manifest for resumability, then synthesize a final consolidated report.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Full 485-scenario manifest built (412 spec-kit + 26 code-graph + 47 skill-advisor)
- [x] Provider pre-flight understanding established (openai/gpt-5.5-fast per cli-opencode SKILL.md)
- [x] Parallelism (10 concurrent) and evidence-handling (in-place writes) confirmed by operator

### Definition of Done
- [ ] All 485 scenarios show a completed dispatch in the manifest
- [ ] A sample of PASS verdicts per subsystem independently spot-checked
- [ ] Consolidated final report written listing every FAIL/BLOCKED scenario
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Wave-batched fan-out: 10 concurrent `opencode run` background processes per wave, monitored via the established `nohup` + `ps`-liveness-check pattern from earlier in this session, manifest-tracked for resumability.

### Key Components
- **Manifest** (`manifest.tsv`): one row per scenario -- subsystem, category, file path, dispatch status (pending/running/done/blocked), verdict.
- **Wave runner**: launches 10 background `opencode run` dispatches at a time, each targeting one scenario file, waits for the wave to fully drain before launching the next.
- **Dispatch prompt**: instructs the model to read its assigned scenario file in full, execute the Commands section for real, and directly Edit the file's own Evidence/Pass-Fail sections with real output -- not a separate report.

### Data Flow
Manifest row (pending) -> wave launch -> `opencode run` executes scenario + edits its own file -> manifest row updated (done/blocked) -> next wave -> final synthesis reads all 485 files' verdicts into `implementation-summary.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| 485 playbook scenario `.md` files | Template placeholders in their Evidence sections | Filled with real execution evidence + verdict | Manifest completion + spot-check sample |

Required inventories:
- Full scenario list: `manifest.tsv` (485 rows)
- Matrix axes: {subsystem: spec-kit/code-graph/skill-advisor} x {verdict: PASS/FAIL/BLOCKED}
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Build the 485-scenario manifest
- [x] Scaffold this spec folder

### Phase 2: Execution
- [ ] Provider pre-flight (confirm openai configured)
- [ ] Run all ~49 waves of 10 concurrent dispatches
- [ ] Track completion/verdict per scenario in the manifest

### Phase 3: Verification
- [ ] Spot-check a sample of PASS verdicts per subsystem against real repeatable commands
- [ ] Write the consolidated final report (`implementation-summary.md`)
- [ ] `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spot-check | Sample of PASS-verdict scenarios per subsystem | Independent manual re-execution of the same Commands |
| Completeness | All 485 scenarios | Manifest row count vs total |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `openai` provider configured for cli-opencode | External | To be confirmed at pre-flight | Sweep cannot start; ask operator to configure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A wave's dispatches corrupt shared state, or evidence writes are found to be fabricated/unreliable on spot-check.
- **Procedure**: Nothing is committed; `git diff`/`git checkout --` on the affected scenario files reverts individual evidence writes. The manifest identifies exactly which files were touched.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (Execution: ~49 waves) --> Phase 3 (Spot-check + Report)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Minutes (done) |
| Execution | High | Multiple hours across ~49 waves |
| Verification | Low-Medium | Spot-check sample + report synthesis |

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the wave-batching and evidence-in-place ADRs.
