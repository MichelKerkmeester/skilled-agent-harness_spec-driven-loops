---
title: "Implementation Summary: Fix validate.sh --recursive orchestrator-path silent no-op"
description: "run_node_orchestrator now validates phase children on the orchestrator path so --recursive no longer silently checks only the parent."
trigger_phrases:
  - "validate recursive orchestrator summary"
  - "run_node_orchestrator fix outcome"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/005-validate-recursive-orchestrator-fix"
    last_updated_at: "2026-05-29T11:47:40Z"
    last_updated_by: "claude-opus"
    recent_action: "Reworked run_node_orchestrator to recurse over phase children before exit"
    next_safe_action: "Hand back to orchestrator for commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/032-validate-recursive-orchestrator-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
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
| **Spec Folder** | 032-validate-recursive-orchestrator-fix |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

`validate.sh --recursive` now actually validates phase children when the compiled orchestrator is present. Before this fix, `run_node_orchestrator` ran the orchestrator on the parent and immediately called `exit $?`, which fired before `main()` reached its recursive block. The result: on every checkout that had the compiled orchestrator, `--recursive` quietly validated only the parent and skipped every phase child. The shell fallback already recursed, so only the orchestrator path was broken, which made the gap easy to miss.

### Recursive validation on the orchestrator path

You can now run `validate.sh --recursive` on a phase parent and trust that each child phase is validated, not just the parent. The function resolves the orchestrator invocation base once (compiled JS preferred, tsx fallback for source-only checkouts), builds the shared flag set once, validates the parent, and when `--recursive` is set, enumerates `NNN-*` phase children using the same glob `run_recursive_validation` uses. It skips non-directories and any child missing both spec.md and description.json, validates each remaining child, and exits with the worst code seen across parent and children so a failing child can never be masked by a passing parent.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/system-spec-kit/scripts/spec/validate.sh | Modified | Rework run_node_orchestrator to recurse over phase children and aggregate the worst exit code before a single final exit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The change is a single self-contained rework of `run_node_orchestrator`, gated entirely by the existing `--recursive` flag, so no feature flag or migration was needed. Verification ran `bash -n` on the script for syntax, reviewed the diff against the specified design to confirm non-recursive behavior stays byte-identical (one parent run, exit its code) and the no-orchestrator fallback still returns 1 before any run, and ran `validate.sh --strict` on this packet to PASSED.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Recurse inside `run_node_orchestrator` rather than removing its `exit` | Keeping the orchestrator path self-contained avoids touching `main()` and double-validating the parent through both the orchestrator and the shell rules |
| Reuse the exact `NNN-*` glob and dir guard from `run_recursive_validation` | Keeps the two recursion paths discovering the identical child set, no drift |
| Skip children lacking both spec.md and description.json | Matches the specified design and avoids running the orchestrator on non-packet directories |
| Aggregate with worst-code-wins | A failing child must surface in the exit status, not be hidden by a passing parent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `bash -n validate.sh` | PASS (SYNTAX_OK) |
| Non-recursive byte-identity review | PASS: parent run with same flags, `exit $rc` equals orchestrator return |
| No-orchestrator fallback review | PASS: still `return 1` before any invocation |
| `validate.sh --strict` on this packet | PASS (RESULT: PASSED) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **No automated regression test.** Verification was static (`bash -n`) plus diff review and a packet self-validate. A live phase-parent fixture run with the orchestrator present was not added, so future regressions in child enumeration rely on the same manual checks.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

