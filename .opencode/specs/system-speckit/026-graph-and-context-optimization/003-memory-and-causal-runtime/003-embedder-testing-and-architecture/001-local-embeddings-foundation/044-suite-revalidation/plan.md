---
title: "Implementation Plan: 043 Suite Revalidation"
description: "Create and run a sequential codex exec scenario runner for 401-415, then compare post-wave results against the 032/002 baseline."
trigger_phrases:
  - "043 implementation plan"
  - "post-wave scenario runner plan"
  - "24-- suite revalidation plan"
importance_tier: "critical"
contextType: "spec"
status: "fail"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/044-suite-revalidation"
    last_updated_at: "2026-05-14T16:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Runner executed all 15 scenario attempts but child codex startup failed"
    next_safe_action: "Rerun from a Codex CLI context that permits nested app-server initialization"
    blockers:
      - "Nested codex exec app-server initialization is denied by the current sandbox"
    key_files:
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000043"
      session_id: "044-suite-revalidation-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 043 Suite Revalidation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Codex CLI |
| **Framework** | Spec Kit Memory MCP and CocoIndex MCP through child `codex exec` runs |
| **Storage** | Existing Spec Kit Memory DB and `_sandbox` evidence files |
| **Testing** | 15 manual-testing scenarios plus strict packet validation |

### Overview

The runner creates a fresh child `codex exec` process per scenario so each playbook file can use MCP tools in an isolated prompt. The parent process records a TSV summary, keeps raw logs, and uses a watchdog so one stalled scenario does not consume the whole validation window.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 phase folder supplied by user.
- [x] Scenario playbook exists with files 401-415.
- [x] Baseline TSV path identified.
- [x] Scope excludes source and playbook modifications.

### Definition of Done

- [x] Runner script is executable.
- [x] Scenarios 401-415 attempted.
- [x] Summary TSV exists.
- [x] Baseline-vs-post-wave table is recorded.
- [x] Strict packet validation passes or failure is recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential evidence runner with per-scenario child processes and TSV aggregation.

### Key Components

- **Scenario source**: `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/401-415`.
- **Runner**: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh`.
- **Logs**: `_sandbox/24--local-llm-query-intelligence/evidence/per-scenario-logs-post-wave/<scenario>.log`.
- **Summary**: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.summary.tsv`.
- **Comparison source**: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.summary.tsv`.

### Data Flow

The runner resolves the repo root, locates each scenario Markdown file, sends a bounded validation prompt to `codex exec`, tees raw output to a per-scenario log, extracts the final `VERDICT`, `KEY_METRIC`, and `DETAIL` lines, and appends one TSV row. After execution, the packet summary reads the TSV and baseline file to produce the delta table.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Scenario playbook | Read-only validation source | Unchanged | `git diff` confirms no playbook edits. |
| Evidence directory | Stores operational logs and summaries | Add runner, logs, and summary TSV | File existence and TSV row count. |
| 043 packet docs | Records scope, results, and validation evidence | Create and update | `validate.sh --strict`. |
| Substrate source | Memory and CocoIndex implementation under validation | Unchanged | No source edits in this packet. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold Level 2 packet.
- [x] Locate scenario playbook.
- [x] Identify baseline summary TSV.

### Phase 2: Core Implementation

- [x] Author executable post-wave runner.
- [x] Run scenarios 401-415 sequentially.
- [x] Preserve per-scenario raw logs and TSV summary.

### Phase 3: Verification

- [x] Compute verdict distribution.
- [x] Compare final baseline rows against post-wave rows.
- [x] Update `implementation-summary.md`, `tasks.md`, `checklist.md`, and metadata status.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Scenario | 401-415 playbook validation | `codex exec` child processes |
| Evidence | TSV row count and verdict counts | Shell, `awk` |
| Baseline comparison | 032/002 latest rows vs post-wave rows | Shell/awk inspection |
| Packet validation | Level 2 spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Codex CLI | Local runtime | Available by dispatch contract | No child scenario execution if unavailable. |
| Spec Kit Memory MCP | Local MCP | Under validation | Save-heavy scenarios fail or skip if unavailable. |
| CocoIndex MCP | Local MCP | Instrumented by 041, not fixed by 042 yet | Disambiguation scenarios may remain partial or fail. |
| Baseline TSV | Local evidence | Present | Needed for scenario-specific delta notes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the 043 packet folder and post-wave evidence files if this validation attempt should be discarded. No substrate source, playbook file, branch, commit, or database migration is part of the rollback surface.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Scaffold packet -> Author runner -> Run scenarios -> Aggregate TSV -> Compare baseline -> Strict validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 answer | Runner |
| Runner authoring | Playbook path | Scenario execution |
| Scenario execution | Runner | Baseline comparison |
| Reporting | TSV + baseline | Strict validation |
| Validation | Packet docs | Final binding trace |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10-20 minutes |
| Runner and execution | High | 45-90 minutes expected wall clock |
| Reporting | Medium | 20-40 minutes |
| **Total** | | **75-150 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No deployment target.
- [x] No source migration.
- [x] Evidence is isolated under `_sandbox`.

### Rollback Procedure

1. Remove `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh`.
2. Remove `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.summary.tsv`.
3. Remove `_sandbox/24--local-llm-query-intelligence/evidence/per-scenario-logs-post-wave/` if raw logs should not be retained.
4. Remove `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/044-suite-revalidation/`.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Delete local evidence artifacts only.
<!-- /ANCHOR:enhanced-rollback -->
