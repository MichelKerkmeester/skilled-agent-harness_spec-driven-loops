---
title: "Implementation Summary: Native Rerun of Deferred Usefulness Cells"
description: "Summary of the native rerun packet, verdict changes, trial count, backlog, and validation status."
trigger_phrases:
  - "native rerun usefulness"
  - "026/007/012/002"
  - "native synthesis update"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/002-native-rerun"
    last_updated_at: "2026-05-06T04:47:44.000Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Completed native rerun documentation and validation"
    next_safe_action: "Fix code graph P0 backlog or run separate live-runtime campaign"
    blockers:
      - "Code graph native scope policy and parser failures remain unresolved"
      - "Plugin/runtime integration still needs a separate authenticated live-runtime campaign"
    key_files:
      - "implementation-summary.md"
      - "trials/trial-log.jsonl"
      - "synthesis-report-native-rerun.md"
    session_dedup:
      fingerprint: "sha256:b8573afd98812522094e9f5aa54f5d37d81833610eaaa1bd3f99e41c397950d4"
      session_id: "026-007-012-002-native-rerun"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which live-runtime campaign should validate plugin/runtime integration next?"
    answered_questions:
      - "Native rerun logged 13 measurements."
      - "New native P0 backlog count is 3."
---
# Implementation Summary: Native Rerun of Deferred Usefulness Cells

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/002-native-rerun |
| **Completed** | 2026-05-06 |
| **Level** | 2 |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet turns the native rerun into a durable verdict update. The important change is not more paperwork; it is that code graph moved from sandbox-useful to native overhead because the real MCP path exposed scope drift, zero-node persistence, and parser crash failure modes.

### Trial Corpus

The packet records 13 native trial-log rows: seven code graph scan/query measurements, three advisor probes, one compaction-formatting measurement, and two verified backlog fixes from the prior sandbox synthesis. Advisor routing passed 3/3 probes. Code graph failed in the exact day-to-day area it is meant to support.

### Verdict Update

Code graph is now OVERHEAD. Hooks are USEFUL because advisor probes were correct and both hook backlog fixes were verified. Plugin/runtime integration is DEFERRED because this rerun validated MCP-bridged surfaces, not a separate authenticated live-runtime matrix.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `description.json` | Created | Discovery metadata for the native rerun packet. |
| `graph-metadata.json` | Created | Packet graph metadata and completed status. |
| `spec.md` | Created | Scope, requirements, risks, and success criteria. |
| `plan.md` | Created | Native measurement plan and affected surfaces. |
| `tasks.md` | Created | One completed task per measurement. |
| `checklist.md` | Created | Verification gates and evidence. |
| `decision-record.md` | Created | ADRs for native product finding and interim workflow. |
| `implementation-summary.md` | Created | Summary of deliverables, verdicts, and validation. |
| `synthesis-report-native-rerun.md` | Created | Updated verdict table and backlog. |
| `trials/trial-log.jsonl` | Updated | Native measurement log. |
| `trials/raw/*.json` | Created | Raw or summarized evidence files. |
| `../graph-metadata.json` | Updated | Parent children include `002-native-rerun`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I used the prior `001-execution` packet as the local scaffold, then authored the native child packet around the orchestrator's measured data. I kept code graph failures as blocked or completed-with-failure rows instead of smoothing them into a generic partial result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat code graph as native overhead | The real MCP path blocked queries, wiped a populated index to zero nodes, and did not recover after the original scan flags returned. |
| Keep hooks as useful | Advisor probes were 3/3 correct, smoke-mode backlog fixes were verified, and compaction formatting surfaced correctly. |
| Defer plugin/runtime integration | The rerun did not execute the separate authenticated CLI/native runtime matrix needed for that axis. |
| Recommend lexical search plus direct reads until fixes land | It avoids relying on graph state that can empty itself while preserving advisor/hook value. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Native trial rows | PASS: 13 rows written to `trials/trial-log.jsonl`. |
| P0 prior backlog fixes | PASS: Codex smoke envelope and Copilot offline preflight markers recorded. |
| New P0 backlog | PASS: 3 native-derived P0 items listed in synthesis. |
| Parent metadata | PASS: `children_ids` includes `002-native-rerun`. |
| Strict validation | PASS: `validate.sh --strict` exited 0 after packet authoring. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Plugin/runtime integration remains unmeasured.** This packet does not replace a live authenticated cli-gemini, Claude Code, or OpenCode campaign.
2. **Compaction recovery quality is partial.** The hook-cache formatting appeared, but relevance scoring still needs a controlled trigger.
3. **Parser crash file:line details depend on the native trial transcript.** The packet preserves the crash class and count; exact file:line citations should be expanded from the native raw run when fixing `structural-indexer.ts`.
<!-- /ANCHOR:limitations -->
