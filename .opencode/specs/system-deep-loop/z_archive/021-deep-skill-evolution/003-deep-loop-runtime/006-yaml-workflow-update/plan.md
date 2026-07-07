---
title: "Implementation Plan: 118/005 — YAML Workflow Update"
description: "Level 2 plan for rewriting 10 mcp_tool: call sites across 4 deep-* workflow YAMLs to bash invocations of phase 003 .cjs script shims. Three-phase execution: setup (verify prerequisites), implementation (file-by-file rewrites), verification (grep + YAML parse + smoke run + strict validate)."
trigger_phrases:
  - "118 yaml plan"
  - "deep-loop workflow yaml rewrite plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 3-phase plan."
    next_safe_action: "Execute Phase 1 setup tasks."
    blockers:
      - "Phase 004 must delete the 4 mcp__mk_spec_memory__deep_loop_graph_* tools first."
      - "Phase 003 must ship convergence.cjs + upsert.cjs at .opencode/skills/deep-loop-runtime/scripts/."
    completion_pct: 5
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180052180052180052180052180052180052180052180052180052180050000"
      session_id: "118-005-plan-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: 118/005 — YAML Workflow Update

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML (workflow assets) + bash invocation strings |
| **Framework** | OpenCode spec-kit workflow runner |
| **Storage** | None (file edits only) |
| **Testing** | YAML parse smoke test + grep assertions + one deep-loop iteration smoke run |

### Overview

Replace `mcp_tool:` blocks targeting `mcp__mk_spec_memory__deep_loop_graph_convergence` and `mcp__mk_spec_memory__deep_loop_graph_upsert` with `bash:` invocations of `node .opencode/skills/deep-loop-runtime/scripts/{convergence,upsert}.cjs --spec-folder ... --loop-type ... --session-id ... [--nodes ... --edges ...]`. Every adjacent field (`outputs`, `append_jsonl`, `skip_conditions`, conditional guards) is preserved byte-for-byte. The script's stdout is parsed identically to the prior MCP response so reducer logic stays untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 003 has shipped `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` and `upsert.cjs` with the documented CLI contract.
- [x] Phase 004 has deleted the 4 `mcp__mk_spec_memory__deep_loop_graph_*` tool registrations and handler files.
- [x] The 4 target YAML files exist and parse cleanly under `yaml.safe_load`.
- [x] Call-site line numbers in `spec.md §3` are current (re-run `grep -n` if YAMLs have been edited in a separate track).

### Definition of Done

- [ ] All 10 call sites rewritten across the 4 files.
- [ ] `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_"` returns 0 per file.
- [ ] All 4 YAMLs parse via `yaml.safe_load`.
- [ ] One smoke iteration of `/deep:start-review-loop` completes without graph-step failure.
- [ ] `validate.sh ... --strict` passes for this spec folder.
- [ ] Checklist items verified with evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Direct in-place YAML edit per call site. No new files, no helper layer between YAML and `.cjs`.

### Key Components

- **YAML call site (existing)**: a `step_graph_convergence:` or `step_graph_upsert:` block containing an `mcp_tool:` sub-block + `outputs:` + optional `append_jsonl:` / guards.
- **Replacement block**: same step key + a single-line `bash:` invocation + identical `outputs:` / `append_jsonl:` / guard blocks.
- **Deep-loop-runtime scripts (owned by phase 003)**: `convergence.cjs` and `upsert.cjs` read CLI flags, open the runtime SQLite DB, run the same library code the MCP handlers previously dispatched, and emit JSON to stdout.

### Data Flow

1. Workflow runner reaches `step_graph_convergence` (or `step_graph_upsert`).
2. Runner substitutes `{spec_folder}` / `{config.lineage.sessionId}` placeholders into the bash command.
3. Bash invokes `node .../convergence.cjs --spec-folder X --loop-type review --session-id Y`.
4. Script returns JSON on stdout (same shape as the prior MCP tool response).
5. Runner parses stdout into named `outputs:` variables.
6. `append_jsonl:` template fires using those variables, exactly as before.
7. Downstream `step_check_convergence` / reducer consumes the same variable names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm phase 003 + 004 are landed (run sibling-phase `validate.sh` for each).
- [ ] Re-run `grep -n "mcp__mk_spec_memory__deep_loop_graph" .opencode/commands/speckit/assets/speckit_deep-*.yaml` to capture current line numbers (drift since scaffold is possible).
- [ ] Verify `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` and `upsert.cjs` exist and are executable.
- [ ] Smoke-test `node .../convergence.cjs --spec-folder <sandbox> --loop-type review --session-id smoke-test` returns valid JSON on stdout.

### Phase 2: Implementation

- [ ] Rewrite `deep_start-review-loop_auto.yaml`: 2 convergence sites + 1 upsert site (3 total per scaffold grep, confirm via fresh `grep -c`).
- [ ] Rewrite `deep_start-review-loop_confirm.yaml`: 2 convergence sites + 1 upsert site (3 total).
- [ ] Rewrite `deep_start-research-loop_auto.yaml`: 1 convergence site + 1 upsert site (2 total).
- [ ] Rewrite `deep_start-research-loop_confirm.yaml`: 1 convergence site + 1 upsert site (2 total).
- [ ] After each file, run `python3 -c "import yaml; yaml.safe_load(open('<file>'))"` to assert parse cleanliness.

### Phase 3: Verification

- [ ] Run `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_"` across all 4 files; expect 0 each.
- [ ] Run `python3 -c "import yaml; yaml.safe_load(open(...))"` on all 4 files.
- [ ] Smoke-run one iteration of `/deep:start-review-loop` against a throwaway sandbox spec; assert `graph_convergence` and `graph_upsert` steps complete without raising "unknown tool" or "undefined variable" errors.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update --strict`.
- [ ] Fill `implementation-summary.md` with actual diff stats + smoke-run evidence.
- [ ] Tick every checklist item with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | YAML parse cleanliness post-edit | `python3 -c "import yaml; yaml.safe_load(open(...))"` |
| Static | Grep assertion: zero MCP-tool refs remain | `grep -c "mcp__mk_spec_memory__deep_loop_graph"` |
| Smoke | One deep-review iteration end-to-end | `/deep:start-review-loop` against sandbox spec |
| Strict validate | Spec folder doc compliance | `validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 (`convergence.cjs` + `upsert.cjs`) | Internal (sibling phase) | Scaffolded | Cannot rewrite YAML — no script target exists |
| Phase 004 (MCP tool removal) | Internal (sibling phase) | Scaffolded | Tool-name collision if YAML rewritten while MCP tools still registered |
| OpenCode workflow runner `bash:` block semantics | External | Stable | Confirms stdout parse into named outputs; documented in workflow YAML conventions |
| `python3` + `pyyaml` for parse smoke test | External | Stable | Lose static parse check; fall back to OpenCode runner load |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Deep-review or deep-research run fails at the graph step with "command not found" or stdout-parse error after the rewrite.
- **Procedure**: `git revert <commit-sha-of-005-implementation>` to restore the 4 YAML files; phase 004 MCP-tool removal would also need to be reverted in the same revert range because the YAMLs reference deleted tool IDs.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: verify 003 + 004 + reread call sites)
        ↓
Phase 2 (Implementation: rewrite each of 4 YAMLs)
        ↓
Phase 3 (Verification: grep + parse + smoke + strict validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | sibling 003 + 004 complete | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 006 (collateral) and Phase 007 (test migration) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (verify prereqs + reread line numbers) | Low | 20 minutes |
| Implementation (4 files, ~10 call sites, mechanical rewrite) | Medium | 45-60 minutes |
| Verification (grep + YAML parse + smoke run + validate.sh) | Low | 30 minutes |
| **Total** | | **~1.5-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Git working tree clean before edits (or 4 YAMLs staged isolated so revert hits only them).
- [ ] Sandbox spec folder exists for smoke run; not a production deep-review session.

### Rollback Procedure

1. `git revert <sha>` for the phase-005 implementation commit.
2. If phase 004 already landed and tools are gone, `git revert <004-sha>` too (because YAMLs in HEAD-1 expect the tools to exist).
3. Re-run smoke deep-review iteration on sandbox spec to confirm restored MCP-tool path works.
4. Notify operator if deep-loop continuity sessions were active during the failure window — restart or replay impacted runs.

### Data Reversal

- **Has data migrations?** No (no DB, no schema, no data changes).
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
