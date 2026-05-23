---
title: "Verification Checklist: 118/005 — YAML Workflow Update"
description: "Level 2 verification checklist for the 4-file YAML rewrite. P0 enforces zero residual MCP-tool references + preserved output bindings; P1 enforces parse cleanliness + smoke run; P2 captures documentation reconciliation."
trigger_phrases:
  - "118 yaml checklist"
  - "deep-loop yaml verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded CHK + CHK-FIX checklist."
    next_safe_action: "Tick CHK items after implementation lands."
    blockers:
      - "Cannot tick CHK items until Phase 1-2 tasks complete."
    completion_pct: 5
    key_files:
      - "checklist.md"
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1180054180054180054180054180054180054180054180054180054180050000"
      session_id: "118-005-checklist-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: 118/005 — YAML Workflow Update

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 003 has shipped `convergence.cjs` and `upsert.cjs` at `.opencode/skills/deep-loop-runtime/scripts/`
  - **Evidence**: `ls .opencode/skills/deep-loop-runtime/scripts/{convergence,upsert}.cjs` succeeds; phase 003 `implementation-summary.md` reports Complete
- [ ] CHK-002 [P0] Phase 004 has deleted the 4 `mcp__mk_spec_memory__deep_loop_graph_*` tool registrations + handler files
  - **Evidence**: `grep -rl "deep_loop_graph_" .opencode/skills/system-spec-kit/mcp_server/` returns no handler files; phase 004 `implementation-summary.md` reports Complete
- [ ] CHK-003 [P1] Current call-site line numbers re-verified (scaffold-time refs may have drifted)
  - **Evidence**: Fresh `grep -n` output captured in `implementation-summary.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

> **Scope note**: For this phase, "code quality" refers to YAML structural correctness — parse cleanliness, anchor-block preservation, and verbatim output binding retention.

- [ ] CHK-010 [P0] No `mcp__mk_spec_memory__deep_loop_graph` reference remains in any of the 4 YAMLs
  - **Evidence**: `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_"` returns 0 for all 4 files (paste full output)
- [ ] CHK-011 [P0] Every rewritten call site invokes the correct shim
  - **Evidence**: convergence sites invoke `convergence.cjs`; upsert sites invoke `upsert.cjs`; verified via `grep -A2 "step_graph_"`
- [ ] CHK-012 [P0] All `outputs:` blocks preserved verbatim per call site
  - **Evidence**: `git diff` shows zero changes to output variable names, descriptions, or order across the 10 call sites
- [ ] CHK-013 [P0] All input parameters survive the rewrite as CLI args
  - **Evidence**: `--spec-folder {spec_folder}`, `--loop-type review|research`, `--session-id {session_id}|{config.lineage.sessionId}`, `--nodes {graph_nodes_json|graph_upsert_nodes_json}`, `--edges {graph_edges_json|graph_upsert_edges_json}` confirmed per file
- [ ] CHK-014 [P1] All `append_jsonl:` / `append_to_jsonl:` template lines preserved
  - **Evidence**: `git diff` shows zero changes to JSONL templates
- [ ] CHK-015 [P1] All skip/conditional guards preserved (`skip_conditions`, `if_graph_events_present`, `if_graph_events_missing`)
  - **Evidence**: `git diff` shows zero structural change to guard semantics
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 4 YAMLs parse cleanly under pyyaml
  - **Evidence**: `python3 -c "import yaml; yaml.safe_load(open('<file>'))"` exits 0 for each file (paste exit codes)
- [ ] CHK-021 [P0] One smoke iteration of `/spec_kit:deep-review` completes without graph-step failures
  - **Evidence**: Sandbox spec used; iteration JSONL shows `graph_convergence` and `graph_upsert` events emitted with valid `decision`, `signals`, `blockers` fields
- [ ] CHK-022 [P1] No new "undefined variable" or "unknown tool" errors surface in the smoke run
  - **Evidence**: Iteration stderr/stdout captured; no occurrences of `Cannot find tool` or `Variable not bound`
- [ ] CHK-023 [P1] Output stdout shape from scripts matches prior MCP response shape (JSON keys + types)
  - **Evidence**: Diff of one convergence + one upsert response between pre-005 sandbox run and post-005 sandbox run shows structural equivalence
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

> **Scope note**: This phase performs a class-of-bug interface swap (MCP-tool → bash invocation) across 4 sibling YAML files. The "fix" is mechanical and homogeneous, so completeness centers on confirming every call site received the swap, not on discovering new producers/consumers.

- [ ] CHK-FIX-001 [P0] Finding class assigned: `class-of-bug` (the same MCP-tool reference pattern repeated across 4 sibling YAML files); not instance-only
  - **Evidence**: Document the class label in `implementation-summary.md` Key Decisions section
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: every `mcp_tool: mcp__mk_spec_memory__deep_loop_graph_*` block located before any rewrite begins
  - **Evidence**: Pre-rewrite `grep -n` output captured in `implementation-summary.md` listing all 10 call sites with file + line number
- [ ] CHK-FIX-003 [P0] Consumer inventory: every downstream reducer/state-machine reference to `{graph_decision}`, `{graph_signals_json}`, `{graph_blockers_json}`, `{graph_nodes_json}`, `{graph_edges_json}`, `{graph_convergence_score}`, `{graph_decision_json}`, `{graph_trace_json}` confirmed unchanged
  - **Evidence**: `grep -nE "graph_(decision|signals_json|blockers_json|nodes_json|edges_json|convergence_score|decision_json|trace_json)"` across the 4 YAMLs shows the consumer sites untouched
- [ ] CHK-FIX-004 [P0] Adversarial coverage: smoke run includes one iteration that produces non-empty `graphEvents` (exercises upsert path) AND one iteration that produces empty `graphEvents` (exercises skip path)
  - **Evidence**: Smoke-run JSONL snippet shows both branches in `implementation-summary.md`
- [ ] CHK-FIX-005 [P1] Matrix axes listed: rewrite covers `{deep-review, deep-research} × {auto, confirm} × {convergence, upsert}` = 4 files × 2 call-site types = 8 minimum sites; T007/T011 capture any helper/audit residue beyond the headline 8
  - **Evidence**: Matrix table appears in `implementation-summary.md` Verification section
- [ ] CHK-FIX-006 [P1] Hostile env variant: a spec folder path containing hyphens is exercised in the smoke run (the runtime sandbox path satisfies this naturally; document explicitly)
  - **Evidence**: Sandbox spec folder path quoted in the smoke-run JSONL snippet
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA: all grep outputs and parse exit codes recorded in `implementation-summary.md` are tagged with the implementation commit SHA
  - **Evidence**: Commit SHA appears in `implementation-summary.md` Metadata table
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] CLI args properly quoted to defend against spec folder paths with shell metacharacters
  - **Evidence**: Every `bash:` invocation wraps `{spec_folder}` and `{session_id}` placeholders in double quotes
- [ ] CHK-031 [P2] No secrets or tokens passed via env or args (existing surface preserved — not a phase-005 concern, but verify the rewrite did not introduce any)
  - **Evidence**: Diff review confirms no new env-var injection or credential surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` synchronized with final implementation
  - **Evidence**: Line-number references in scaffold updated to actual post-edit positions
- [ ] CHK-041 [P1] `implementation-summary.md` fully filled (no [###-feature-name] placeholders)
  - **Evidence**: All sections populated with actual diff stats, grep counts, parse exit codes, smoke-run JSONL snippet
- [ ] CHK-042 [P2] `note:` field rewritten where prior text said "Call directly - NEVER through Code Mode"
  - **Evidence**: Sites rewritten to mention bash invocation; remaining `note:` strings retain operator-meaningful context
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Only the 4 listed YAMLs were edited
  - **Evidence**: `git diff --stat` lists exactly 4 files, all under `.opencode/commands/spec_kit/assets/spec_kit_deep-*.yaml`
- [ ] CHK-051 [P1] No scratch or temp files left behind
  - **Evidence**: No `.bak`, `.orig`, or scratch artifacts present in the diff or working tree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: TBD (post-implementation)
**Verified By**: TBD
<!-- /ANCHOR:summary -->
