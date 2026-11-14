---
title: "Implementation Summary"
description: "Built 2026-11-14. Five live phase parents now carry a real purpose, the PreCompact brief names `specs/` folders, both resume assets list the presentation rows and a test proves an unfilled parent purpose fails once the parent leaves Draft."
trigger_phrases:
  - "purpose carry follow ups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/006-purpose-carry-follow-ups"
    last_updated_at: "2026-11-14T07:30:54Z"
    last_updated_by: "generate-context"
    recent_action: "Committed remediation plan 006-011 and goals as 9c9dd544a9"
    next_safe_action: "Build phase 006 in worktree 374 with a DeepSeek worker"
    packet_purpose: "Purpose: After this phase, no live phase parent carries the scaffold purpose sentence, the brief cached before a compaction names the active packet for folders under `specs/` and the resume workflow assets list the same brief rows as the presentation file."
    blockers: []
    key_files:
      - "specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/goal.md"
      - "specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md"
      - "specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/scratch/fable-review-2026-11-14/03-verifier-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-purpose-carry-follow-ups"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "ef52f514-275d-4013-b7bd-ab365324057d"
      workspace: "/Users/michelkerkmeester/worktrees/public/374-purpose-carry-follow-ups"
      savedAt: "2026-11-14T07:30:54Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-11-14. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-purpose-carry-follow-ups |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

After a resume or a compaction on a child of five live phase parents, the next AI now gets that parent's real purpose instead of the scaffold sentence. The brief cached before a compaction now names the active packet for folders under `specs/`, and both resume workflow assets list the same ten brief rows as the presentation file.

### Phase 6: purpose-carry-follow-ups

Edits E1 to E10 gave five parents a Problem Statement and Purpose taken from their children's docs. E11 copied the Stop hook's folder regex into `detectSpecFolder` in `compact-inject.ts`, and E12 added the test that proves it. E13 and E14 replaced `reply_format` in both resume assets. E15 added the assertion that a parent set to In Progress with its purpose token unfilled fails on `PLACEHOLDER_FILLED` with exit 2.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Five parent `spec.md` files named in `plan.md` E1 to E10 | Modified | Real Problem Statement and Purpose |
| The same five parents' `graph-metadata.json` | Re-derived | Generated from the rewritten `spec.md`, by `repair-derived.cjs --apply` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modified | Folder regex matches `specs/` |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Modified | One test for a `specs/` folder and the brief line |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` | Modified | `reply_format` lists the presentation rows |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` | Modified | Unfilled parent purpose fails outside Draft |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator captured every baseline in `plan.md` section 5 and counted each search text once. One DeepSeek V4.1 Flash max worker, dispatched through cli-deepseek-harness from a scratch directory with `--add-dir` for the nine target folders, applied E1 to E15 and exited 0 with a `completed` final event. The orchestrator then reran typecheck, build and every check below itself. The parent validation first failed on generated metadata drift, which `repair-derived.cjs --apply` cleared.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The presentation file wins over the YAML assets for the brief rows | `.skilled/commands/speckit/resume.md` section 5 says the resume brief template lives only in the presentation file |
| `reply_format` names the Source row without its values | The presentation file's values include `mcp_enrichment`, which no resume step produces. Repeating values in a second file is how the two drifted |
| Copy the Stop hook regex into the PreCompact hook | It already matches `specs/` and `.opencode/specs/`, and the Stop hook feeds the purpose line with it |
| Re-derive the parents' `graph-metadata.json` rather than leave them stale | The metadata is generated from `spec.md`, so a stale copy fails strict validation and misdescribes the parent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 scaffold sentence outside this packet | `rg -l ... \| wc -l` prints `0` |
| REQ-002 hook tests | `hook-precompact.vitest.ts (18 tests)`, `hook-session-start.vitest.ts (23 tests)`, `Tests  41 passed (41)` |
| REQ-003 brief rows | `speckit-resume-auto.yaml match`, `speckit-resume-confirm.yaml match` |
| REQ-004 five parents | local embeddings `Errors: 0  Warnings: 1`, the other four `Errors: 0  Warnings: 0`, each `RESULT: PASSED`, after the metadata re-derive |
| REQ-005 unchanged checks | `Result: passed=148 failed=0`, `PASS: 256 mirrors across 10 trees are in sync.`, `yaml ok` |
| REQ-006 typecheck, build and built hook | both exit 0, `specs/ -> "specs/system-speckit/x/y"`, `Active spec folder lines in brief: 1` |
| REQ-007 scaffold gate tests | `Test Files  4 passed (4)`, `Tests  99 passed (99)`, `PLACEHOLDER_FILLED` count `1` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No check proves a parent Purpose is true.** The five new sentences come from the child docs named under each edit in `plan.md`. The workaround is for the builder to reread those docs before each edit.
2. **The local embeddings Purpose in E2 is broad by design.** The operator widened it on 2026-11-14 to cover children 030 to 055, which work on the runtime around the embedder rather than the embedder itself.
3. **Some live phase parents still have no purpose after this phase.** They are listed in `scratch/phase-parents-without-purpose-text.txt`.
<!-- /ANCHOR:limitations -->

---
