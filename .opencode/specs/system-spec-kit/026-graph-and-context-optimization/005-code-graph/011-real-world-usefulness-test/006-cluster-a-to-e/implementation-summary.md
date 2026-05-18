---
title: "Implementation Summary: Code Graph + Advisor + Hooks Polish"
description: "Completion record for Phase 026/007/012/006 clusters A-E."
trigger_phrases:
  - "026/007/012/006 summary"
  - "cluster a to e implementation"
  - "read-path auto-rescan diagnostics"
  - "glob-aware scope fingerprint"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/006-cluster-a-to-e"
    last_updated_at: "2026-05-06T11:34:49Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Implemented clusters A-E and recorded verification blockers"
    next_safe_action: "Triage broad advisor/hooks/general suite failures in a separate cleanup packet"
    blockers:
      - "skill_advisor/tests parity/python-compat suites fail outside the changed advisor rebuild predicate."
      - "broad tests/ suite fails across unrelated dirty-worktree areas."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md"
      - ".opencode/skills/mcp-coco-index/references/tool_reference.md"
    session_dedup:
      fingerprint: "sha256:6666666666666666666666666666666666666666666666666666666666666666"
      session_id: "026-007-012-006-cluster-a-to-e"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should the pre-existing deleted cli-copilot/matrix files be restored in this packet or handled by a separate cleanup packet?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/006-cluster-a-to-e` |
| **Completed** | 2026-05-06 |
| **Level** | 2 |
| **Status** | Implemented; broad test verification blocked |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 006 implements the remaining P1 clusters from the real-world usefulness research packet. The code changes are scoped to code graph readiness/query/context/verify, advisor rebuild/startup publication, and the glob-aware scope policy. Documentation-only findings update the Copilot, Gemini, and CocoIndex references.

### Cluster A - Read Path

Blocked-read payloads now expose active/stored scope diagnostics, manifest count/digest, parse backlog, and auto-rescan safety fields. Query and context handlers use a guarded inline full-scan path only when active and stored scope fingerprints are compatible and the parse-error backlog is clean. Verify now includes a `scopePreflight` result and blocks when active maintainer scope does not match the stored graph scope.

### Cluster B - Hook Documentation

The Copilot README now matches the implementation's raw startup/compact text output rather than claiming status JSON. The Gemini README now documents SessionStart, compact, SessionEnd registration, and smoke examples alongside BeforeAgent advisor registration.

### Cluster C - Advisor Hardening

`advisor_rebuild` now repairs when either freshness or trust-state axis is bad. Startup skill-graph indexing now asserts the SQLite artifact, generation file, and advisor live status before publishing a live state; failed assertion publishes stale with `post-index-assertion-failed`.

### Cluster D - CocoIndex Interop

`code_graph_context` seed normalization accepts live CocoIndex snake_case fields (`file_path`, `start_line`, `end_line`, `content`) as well as existing camelCase forms. The CocoIndex reference now documents the live snake_case protocol and names normalization expectations for consumers.

### Cluster E - Glob-Aware Fingerprint

Scope fingerprints now include sorted include/exclude glob dimensions when globs are present, while legacy v2 fingerprints remain compatible on first scan. Scan promotion uses legacy-aware comparison so existing persisted metadata does not crash or block unnecessarily.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Modified | Add diagnostics and guarded full-scan readiness policy. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Modified | Enable guarded auto-rescan for query reads. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modified | Enable guarded auto-rescan and normalize snake_case seed input. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` | Modified | Add scope-aware verify preflight. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts` | Modified | Add v3 glob-aware fingerprints and legacy comparison. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Modified | Apply policy include/exclude glob dimensions to default config. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modified | Pass globs into scope policy and use legacy-aware scope comparison. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts` | Modified | Repair live-but-absent trust state. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Assert post-index live publication before publishing live. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md` | Modified | Align session-prime docs with text output. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md` | Modified | Add startup/compact/end registration and smoke examples. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Modified | Document live snake_case result protocol and interop note. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/*.vitest.ts` | Modified | Add read-path, verify, context, scan, and fingerprint regressions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modified | Add ensure-ready, advisor rebuild, context-server, and query fallback regressions. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/006-cluster-a-to-e/*` | Created/updated | Add Phase 006 planning and completion artifacts. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation followed the requested order: planning docs, Cluster B documentation, Cluster D interop, Cluster A read-path changes, Cluster C advisor hardening, then Cluster E fingerprint hardening. Focused vitest coverage was added for each code-bearing finding, with doc-only findings verified by scoped file diffs.

The focused regression set, full code graph suite, TypeScript build, and strict child/parent validation pass. The required global Vitest gates are not green in this workspace because unrelated pre-existing deletions and broad suite failures are still present.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guarded auto-rescan is opt-in and keeps `allowInlineFullScan` false. | This preserves the old read-path boundary unless scope and parse health prove the inline scan is safe. |
| Readiness diagnostics live on the readiness payload. | Query, context, and verify callers can surface the same evidence without ad hoc per-handler schema drift. |
| CocoIndex seed normalization accepts snake_case and camelCase. | Live MCP output is snake_case, while existing callers may already use camelCase or nested line objects. |
| Glob-aware fingerprints emit v3 only when globs are non-empty. | This avoids unnecessary fixture churn while still blocking glob-narrowing graph replacement. |
| Post-index live publication requires an assertion pass. | Startup should not advertise live advisor state unless the persisted artifacts and advisor status agree. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused cluster vitest command | PASS: 7 files, 172 tests. |
| F-015 focused vitest | PASS: 1 file, 1 test, 421 skipped. |
| Query fallback compatibility vitest | PASS: 1 file, 6 tests. |
| `npx vitest run code_graph/tests/` | PASS: 20 files, 270 tests. |
| `npx vitest run skill_advisor/tests/` | FAIL: 36 files passed, 3 files failed, 285 tests passed, 3 tests failed. |
| `npx vitest run tests/` | FAIL: 7 failed suites and 116 failed tests observed in the dirty workspace. |
| `npm run build` | PASS: exit 0. |
| Child strict validation | PASS: exit 0. |
| Parent strict validation | PASS: exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Global suites are not clean.** `skill_advisor/tests/` and `tests/` still fail in broad parity, hook, memory, and documentation areas unrelated to the targeted fixes.
2. **Docs-only Copilot recreation is scoped.** The Copilot README was restored/updated for F-012, but the wider deleted Copilot hook tree remains a separate workspace issue.
<!-- /ANCHOR:limitations -->
