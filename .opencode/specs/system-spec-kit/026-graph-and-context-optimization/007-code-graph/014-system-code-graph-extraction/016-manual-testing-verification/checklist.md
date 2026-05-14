---
title: "016 Manual Testing Verification — Checklist"
description: "Per-scenario verification checklist for mk-code-index MCP + post-014 work."
trigger_phrases:
  - "016 checklist"
  - "manual testing verification checklist"
importance_tier: "important"
---

# Checklist: 016 Manual Testing Verification

## Layer 1: Existing Playbook Scenarios

- [x] 001 ensure-ready selective reindex — SKIP (disposable workspace required)
- [x] 002 query self-heal stale file — SKIP (disposable workspace required)
- [x] 003 code_graph_scan incremental — SKIP (disposable workspace required)
- [x] 004 code_graph_scan full — SKIP (disposable workspace required)
- [x] 005 code_graph_verify blocked on stale — SKIP (disposable workspace required)
- [x] 006 code_graph_status readonly — PASS: two consecutive calls returned identical diagnostics, no mutations
- [x] 007 detect_changes no inline index — PASS: blocked on stale graph, status:"blocked", requiredAction:"code_graph_scan"
- [x] 008 code_graph_context readiness block — PASS: query returned status:"blocked", graphAnswersOmitted:true
- [x] 009 deep_loop_graph_convergence yaml fire — PASS: step_graph_convergence before step_check_convergence in both YAMLs
- [x] 010 deep_loop_graph_upsert conditional — PASS: conditional upsert with if_graph_events_present/missing and skip_conditions
- [x] 011 tool call shape validation — PASS (partial): tool shapes verified via tools/list; Zod schemas enforce at runtime
- [x] 012 ccc_reindex binary shell out — PASS (conditional): binary available, reindex not executed in production
- [x] 013 ccc_feedback jsonl append — SKIP (disposable workspace required)
- [x] 014 ccc_status availability probe — PASS: available:true, binaryPath, indexExists:true, recommendation present
- [x] 015 doctor apply mode policy — PASS: mk-code-index tools in route manifest, Phase A diagnostic-only

## Layer 2: Post-Rename Smoke Probes

- [x] 016 MCP tool manifest post-rename — PASS: 10 tools with correct names, no legacy names
- [x] 017 Launcher startup prefix — PASS: [mk-code-index-launcher] prefix on stderr
- [x] 018 mcp.json server key rename — PASS: mk_code_index key present, system_code_graph absent
- [x] 019 Database path verification — PASS: canonical path correct, no legacy paths
- [x] 020 TypeScript build and entry point — PASS: dist entry points exist, tool-schemas loads, 10 tools returned
- [x] 021 Unicode-normalization fix from 009 — PASS: unicode-normalization.js + siblings exist in dist

## Advisories

- [B] npx tsc --noEmit reports 4 @modelcontextprotocol/sdk import resolution errors from system-spec-kit sibling (non-blocking, runtime functional)