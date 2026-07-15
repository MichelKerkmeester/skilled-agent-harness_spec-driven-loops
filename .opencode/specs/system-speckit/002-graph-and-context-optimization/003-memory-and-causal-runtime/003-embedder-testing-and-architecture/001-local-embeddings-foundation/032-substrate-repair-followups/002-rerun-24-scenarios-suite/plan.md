---
title: "Implementation Plan: rerun 24-- scenarios suite"
description: "Plan for rerunning the 15-scenario local-LLM memory substrate suite after post-032 fixes."
trigger_phrases:
  - "rerun 24 scenarios suite plan"
  - "post 032 scenario runner plan"
  - "local llm query intelligence validation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite"
    last_updated_at: "2026-05-14T11:55:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Preflight blocked before suite execution"
    next_safe_action: "Repair Memory MCP dependency/runtime availability, then rerun the evidence script"
    blockers:
      - "Spec Kit Memory MCP launcher fails: missing zod-to-json-schema"
      - "opencode-go/kimi-k2.6 provider call fails with ConnectionRefused/FailedToOpenSocket"
    key_files:
      - "_sandbox/local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md"
      - "_sandbox/local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000322"
      session_id: "002-rerun-24-scenarios-suite"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Should the missing zod-to-json-schema dependency be repaired in 003 or a new follow-up packet?"
    answered_questions: []
---
# Implementation Plan: rerun 24-- scenarios suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash runner, OpenCode CLI, Spec Kit Memory MCP |
| **Framework** | `opencode run --pure` dispatch to `opencode-go/kimi-k2.6` |
| **Storage** | Spec Kit Memory DB via MCP tools |
| **Testing** | 15 manual-testing playbook scenarios, preflight memory health/save round-trip |

### Overview

The intended work was to run scenarios 401-415 from `manual_testing_playbook/local-llm-query-intelligence/` after substrate fixes landed, using OpenCode as the MCP-capable executor. The execution plan is sequential and one-shot: preflight health, preflight save/delete round-trip, then one `opencode run` dispatch per scenario with the required three-line verdict tail.

The run is blocked before scenario execution because the Memory MCP server fails during launcher startup and the OpenCode Go provider call fails from this sandbox.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet spec read first.
- [x] OpenCode provider credentials checked.
- [x] Memory MCP preflight attempted through OpenCode.
- [ ] `memory_health` returned a healthy or acceptable state.
- [ ] Sample `memory_save` / `memory_delete` round-trip succeeded.

### Definition of Done

- [ ] All 15 scenarios attempted.
- [ ] At least 8 of 15 scenarios are PASS or PARTIAL.
- [ ] Save-heavy scenarios round-trip without governance rejection.
- [x] Evidence report records the actual blocked preflight state.
- [x] Packet metadata marks the work blocked instead of complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential external-runner validation with strict preflight.

### Key Components

- **Runner script**: `_sandbox/local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh`
- **Evidence report**: `_sandbox/local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md`
- **Scenario source**: `.opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/401-415`
- **Executor**: `opencode run --pure -m opencode-go/kimi-k2.6 --variant high`

### Data Flow

Preflight checks the Memory MCP health and a small save/delete round-trip. If that passes, the runner dispatches each scenario prompt, captures `VERDICT`, `KEY_METRIC`, and `DETAIL`, and aggregates a summary table. In this execution, the data flow stopped at preflight because the Memory MCP launcher failed before tool registration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read packet `spec.md`.
- [x] Verify `opencode` availability and provider credentials.
- [x] Isolate OpenCode state under `/private/tmp/opencode-data` after the default state DB failed on `PRAGMA wal_checkpoint(PASSIVE)`.

### Phase 2: Preflight

- [x] Attempt `memory_health` through OpenCode.
- [x] Probe the Memory MCP launcher directly.
- [B] Blocked: `zod-to-json-schema` is missing from the installed MCP dependency tree.
- [B] Blocked: provider call to `opencode.ai/zen/go/v1/chat/completions` failed.

### Phase 3: Suite Execution

- [ ] Run scenarios 401-415 sequentially.
- [ ] Collect per-scenario logs.
- [ ] Aggregate PASS/PARTIAL/FAIL/SKIP counts.

### Phase 4: Reporting

- [x] Add runner script for rerun once preflight blockers are repaired.
- [x] Write blocked evidence report.
- [x] Add Level-2 packet docs and blocked status metadata.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Preflight | Memory health and save/delete round-trip | Spec Kit Memory MCP via OpenCode |
| Execution | 15 scenario prompts | `opencode run --pure -m opencode-go/kimi-k2.6 --variant high` |
| Evidence | Final report and counts | Markdown report + per-scenario logs |
| Packet validation | Spec docs consistency | `validate.sh <packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec Kit Memory MCP | Internal runtime | Blocked: missing `zod-to-json-schema` | No `memory_health`, `memory_save`, or scenario execution |
| OpenCode Go provider | External model route | Blocked from this sandbox | No `kimi-k2.6` scenario dispatch |
| Scenario files 401-415 | Playbook inputs | Present and unchanged | Runner can dispatch once runtime works |
| `_sandbox` evidence path | Local output | Created | Report and runner are available |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the runner script and evidence report if the blocked attempt should not be retained. Packet docs can be replaced by a future successful run summary after the Memory MCP and provider dispatch blockers are repaired.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Spec read -> OpenCode/provider check -> Memory MCP preflight -> scenario suite -> evidence report -> metadata update
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| OpenCode/provider check | Spec read | Memory MCP preflight |
| Memory MCP preflight | OpenCode runtime startup | Scenario suite |
| Scenario suite | Passing health and save/delete round-trip | Evidence report |
| Evidence report | Suite result or blocked preflight evidence | Metadata update |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Setup | Low | Short |
| Preflight | Medium | Blocked by runtime dependency and provider route |
| Suite execution | Medium | Not reached |
| Reporting | Low | Blocked report and docs written |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

1. Remove `_sandbox/local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh` if a future runner supersedes it.
2. Replace `_sandbox/local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md` with the successful rerun report after preflight blockers are repaired.
3. Update `graph-metadata.json` from `blocked` to `complete` or `partial` according to the actual PASS/PARTIAL count.
<!-- /ANCHOR:enhanced-rollback -->
