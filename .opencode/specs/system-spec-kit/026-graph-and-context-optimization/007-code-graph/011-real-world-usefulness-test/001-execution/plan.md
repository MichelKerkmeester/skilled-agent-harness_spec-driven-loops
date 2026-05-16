---
title: "Implementation Plan: Real-World Usefulness Test Execution"
description: "Plan and execution mechanics for the sandboxable usefulness campaign subset."
trigger_phrases:
  - "real-world usefulness execution"
  - "026/007/012/001"
  - "usefulness synthesis"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/001-execution"
    last_updated_at: "2026-05-06T04:35:32.335Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Finalized automatable/deferred matrix and analysis mechanics"
    next_safe_action: "Review synthesis gaps or rerun deferred live runtime cells"
    blockers:
      - "Authenticated/networked external CLI runtimes unavailable in sandbox"
      - "Claude Code and OpenCode native live sessions unavailable from sandbox"
    key_files:
      - "plan.md"
      - "trials/trial-log.jsonl"
      - "analysis/aggregated-metrics.md"
      - "synthesis-report.md"
    session_dedup:
      fingerprint: "sha256:0260070120010260070120010260070120010260070120010260070120010260"
      session_id: "026-007-012-001-execution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved for this execution packet."
---
# Implementation Plan: Real-World Usefulness Test Execution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | SQLite, TypeScript/JavaScript, Python, shell commands |
| **Framework** | Spec Kit Memory, code graph DB, skill advisor, Gate 3 classifier |
| **Storage** | Packet-local JSONL, raw text, markdown controls, analysis reports |
| **Testing** | Paired assisted/control local trials plus external CLI smoke checks |

### Overview
This execution pass runs the measurable local slice of the parent campaign. It treats the code graph DB, startup brief builder, advisor script, and Gate 3 classifier as sandboxable systems, while native runtime and authenticated external CLI cells are documented as deferred when the sandbox blocks them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent packet reviewed. Evidence: `../spec.md`, `../plan.md`, `../tasks.md`, and `../decision-record.md` were read before execution.
- [x] Spec folder approved. Evidence: user pre-approved `001-execution/`.
- [x] Trial log schema fixed. Evidence: `trials/trial-log.jsonl` follows the requested field list.

### Definition of Done
- [x] Setup and packet artifacts created.
- [x] Pilot records captured for S-CG-01, S-HK-01, and attempted S-PL-01.
- [x] Sandboxable local trials run and logged.
- [x] Analysis and synthesis artifacts written.
- [x] Deferred cells documented with reasons.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sandbox-direct empirical harness with paired controls and explicit runtime deferrals.

### Key Components
- **Trial Log**: JSONL row per assisted or control record.
- **Raw Evidence**: Assisted outputs in `trials/raw/`; manual controls in `trials/control/`.
- **Local Harness**: SQLite, `rg`, advisor script, compiled Gate 3 classifier, and startup brief module.
- **Synthesis Layer**: Markdown reports that convert metrics into system-axis verdicts.

### Data Flow
Each local scenario runs an assisted command and, where applicable, a control command. Both write raw evidence, append a structured JSONL row, then feed the aggregate reports. Runtime smoke failures write raw blocked evidence and become deferred cells.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Code graph DB | Structural relationships for code graph scenarios. | Queried read-only. | S-CG-01 through S-CG-04 raw SQL outputs. |
| `rg` controls | Lexical/manual baseline. | Queried read-only. | Control markdown records. |
| Skill advisor script | Hook routing implementation. | Queried read-only. | S-HK-02 and S-PL-04 raw outputs. |
| Gate 3 classifier | Write/read-only classifier. | Imported read-only. | S-HK-03 raw outputs. |
| Startup brief builder | Session-prime payload source. | Imported read-only. | S-HK-01 raw outputs. |
| External CLIs | Runtime integration under test. | Smoke-tested only. | S-PL-01 blocked raw outputs. |

Required inventories:
- Same-class producers: code graph DB, startup brief builder, advisor script, and Gate 3 classifier.
- Consumers: deferred runtime cells remain unmeasured until live sessions can consume these surfaces.
- Matrix axes: scenario id, CLI id, assisted/control, trial number, prompt/task item.
- Algorithm invariant: no usefulness verdict is based on relevance alone; each scenario records usefulness and control delta.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 2 execution packet and metadata.
- [x] Create `trials/raw/`, `trials/control/`, and `analysis/`.
- [x] Record automatable versus deferred cells.

### Phase 2: Pilot
- [x] S-CG-01 pilot: `scoreLexicalLane` caller lookup.
- [x] S-HK-01 pilot: startup brief relevance for caller lookup prompt.
- [x] S-PL-01 pilot: external CLI smoke attempts, blocked by sandbox/auth.

### Phase 3: Full Matrix Subset
- [x] Run local code graph scenarios S-CG-01 through S-CG-04.
- [x] Run local hook scenarios S-HK-01 through S-HK-03.
- [x] Run local S-PL-04 advisor stand-in.
- [x] Defer S-HK-04 and external/native plugin-runtime cells.

### Phase 4: Analysis
- [x] Aggregate trial log metrics.
- [x] Write per-scenario deltas.

### Phase 5: Synthesis
- [x] Write synthesis report.
- [x] Include deferred cells and improvement backlog.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Completed Cells

| Cell | Status | Reason |
|------|--------|--------|
| `S-CG-01/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |
| `S-CG-02/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |
| `S-CG-03/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |
| `S-CG-04/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |
| `S-HK-01/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |
| `S-HK-02/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |
| `S-HK-03/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |
| `S-PL-04/cli-codex-55-high` | AUTOMATABLE | Completed by sandbox-direct harness with raw trial evidence. |

### Deferred Cells

| Cell | Status | Reason |
|------|--------|--------|
| `S-CG-01/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-01/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-02/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-02/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-03/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-03/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-04/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-04/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-01/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-02/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-03/cli-claude-code-external` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-CG-04/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-01/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-01/cli-codex-54-medium` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-01/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-01/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-01/cli-claude-code-external` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-01/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-02/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-02/cli-codex-54-medium` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-02/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-02/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-02/cli-claude-code-external` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-02/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-03/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-03/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-03/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-04/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-04/cli-codex-55-high` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-HK-04/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-01/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-01/cli-codex-54-medium` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-01/cli-codex-55-high` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-01/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-01/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-01/cli-claude-code-external` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-01/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-02/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-02/cli-codex-54-medium` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-02/cli-codex-55-high` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-02/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-02/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-02/cli-claude-code-external` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-02/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-03/cli-codex-55-high` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-03/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-03/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-03/cli-claude-code-external` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-04/claude-code-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-04/cli-codex-54-medium` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-04/cli-copilot-default` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-04/cli-gemini-31-pro` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-04/cli-claude-code-external` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |
| `S-PL-04/opencode-native` | DEFERRED | Requires live native runtime, authenticated external CLI, network access, or compaction state. |

### Scoring Mechanics
- Relevance and usefulness use the parent's 0-3 rubric.
- Hit rate is exact-match success for classifier/advisor trials and structural evidence presence for graph trials.
- Token counts are estimated as text characters divided by four when no CLI-reported token counter exists.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `code-graph.sqlite` | Internal/generated | Available but stale | Local graph trials can run; freshness caveat remains. |
| `skill_advisor.py` | Internal script | Available | Advisor routing trials can run. |
| `shared/dist/gate-3-classifier.js` | Internal compiled JS | Available | Gate 3 classifier trials can run. |
| cli-codex network/API | External | Blocked | Runtime startup cells deferred. |
| cli-copilot auth | External | Blocked | Copilot cells deferred. |
| cli-gemini headless auth | External | Blocked | Gemini cells deferred. |
| Claude Code/OpenCode native live sessions | Runtime | Blocked | Native cells deferred. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The execution packet is rejected or must be rerun from scratch.
- **Procedure**: Remove `001-execution/` and remove `system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/001-execution` from `../graph-metadata.json.children_ids`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Pilot -> Sandboxable matrix -> Analysis -> Synthesis -> Live-runtime follow-up
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent packet and approved child folder | Pilot |
| Pilot | Trial schema and local tool availability | Full subset execution |
| Full subset execution | Pilot mechanics | Analysis |
| Analysis | Trial log rows | Synthesis |
| Live-runtime follow-up | Authenticated/networked runtimes | Completion of deferred cells |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Completed in this pass |
| Pilot | Medium | Completed with one blocked runtime axis |
| Full subset | Medium | Completed for local harness |
| Analysis/Synthesis | Medium | Completed |
| Live follow-up | High | Deferred |
| **Total** | | **Partial campaign complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production code changes.
- [x] Trial artifacts are packet-local.
- [x] Parent metadata change is one child id.

### Rollback Procedure
1. Delete `001-execution/`.
2. Remove the child id from parent `graph-metadata.json`.
3. Rerun strict validation on the parent packet.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Remove generated packet-local evidence and metadata.
<!-- /ANCHOR:enhanced-rollback -->
