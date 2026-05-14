---
title: "016 Manual Testing Verification — Plan"
description: "Execute all scenarios in the manual_testing_playbook and create Layer-2 smoke probes for post-rename verification."
trigger_phrases:
  - "016 plan"
  - "manual testing verification plan"
importance_tier: "important"
---

# Plan: 016 Manual Testing Verification

## Approach

1. Inventory all 15 existing scenarios from the playbook
2. Execute each scenario against production (read-only) or note SKIP for mutation scenarios
3. Create 6 new Layer-2 scenarios (016-021) for post-rename gaps
4. Run Layer-2 smoke probes
5. Record per-scenario verdicts with evidence

## Scenarios Executed

| ID | Verdict | Evidence |
|----|---------|----------|
| 001 | SKIP | Requires disposable workspace + selective reindex |
| 002 | SKIP | Requires disposable workspace + 50+ file mutation |
| 003 | SKIP | Requires disposable workspace + file deletion |
| 004 | SKIP | Requires disposable workspace + full scan |
| 005 | SKIP | Requires disposable workspace + stale manipulation |
| 006 | PASS | Two consecutive code_graph_status calls returned identical lastPersistedAt, all diagnostic fields present, no mutations |
| 007 | PASS | detect_changes on stale graph returned status:"blocked", requiredAction:"code_graph_scan", no inline indexing |
| 008 | PASS | code_graph_query on stale graph returned status:"blocked", graphAnswersOmitted:true, requiredAction:"code_graph_scan" |
| 009 | PASS | Both YAMLs have step_graph_convergence before step_check_convergence, calling mcp__spec_kit_memory__deep_loop_graph_convergence |
| 010 | PASS | Research YAML has if_graph_events_present/if_graph_events_missing conditional; Review YAML has skip_conditions for empty graphEvents |
| 011 | PASS (partial) | Tool shapes validated via JSON-RPC tools/list; Zod schemas enforce validation at runtime |
| 012 | PASS (conditional) | Binary available at reported path; ccc_reindex not tested with actual reindex |
| 013 | SKIP | Requires disposable workspace + JSONL inspection |
| 014 | PASS | ccc_status returned available:true, binaryPath, indexExists:true, recommendation matches binary presence |
| 015 | PASS | Route manifest lists mcp__mk_code_index__* tools; Phase A invariant explicit; mutation boundaries documented |
| 016 | PASS | 10 tools returned: code_graph_scan, code_graph_query, code_graph_status, code_graph_context, code_graph_verify, code_graph_apply, detect_changes, ccc_status, ccc_reindex, ccc_feedback. No system_code_graph names |
| 017 | PASS | Launcher stderr shows [mk-code-index-launcher] prefix. No legacy name |
| 018 | PASS | .claude/mcp.json has mk_code_index key, no system_code_graph key. command=node, args=[mk-code-index-launcher.cjs] |
| 019 | PASS | code-graph.sqlite at canonical path (55.7MB). No legacy DB paths. Status dbFileSize approximately matches |
| 020 | PASS | Dist entry points exist at both nested and direct paths. tool-schemas.js loads without error. Launcher returns 10 tools |
| 021 | PASS | unicode-normalization.js + .d.ts + .js.map + .d.ts.map exist in dist/system-spec-kit/shared/ |