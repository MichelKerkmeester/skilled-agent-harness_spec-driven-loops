---
title: "Implementation Summary: Repo-wide comment-hygiene scrub"
description: "Three gpt-5.5 agents cleared the live-code perishable-label backlog the extended checker surfaced, rewriting 40 files to durable WHY with no code change."
trigger_phrases:
  - "repo-wide comment hygiene done"
  - "perishable label backlog cleared"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/025-repo-wide-comment-hygiene-scrub"
    last_updated_at: "2026-06-07T21:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 40 live-code files clean under the checker; committing"
    next_safe_action: "Commit and push the packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-025-repo-wide-comment-hygiene-scrub"
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
| **Spec Folder** | 025-repo-wide-comment-hygiene-scrub |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The live codebase is now clean of perishable comment labels. After packet 024 made the hygiene checker stricter, a repo-wide run found about ninety more labels hiding in code comments across the skills, bin, and plugin trees. Three gpt-5.5 agents cleared them in parallel.

### The scrub

Each agent took a disjoint cluster of files and rewrote every flagged comment to keep its technical reason and drop only the perishable identifier. Labels like `ADR-001 (Spec 031)`, `Part C REQ-018`, `121/005`, and `DR-020` became plain statements of why the code does what it does. String literals such as test names that carry historical IDs were left untouched, because they are data and not comments. The result is 40 files changed with comment-only edits and the reason behind each comment preserved.

### What was deliberately left

Archived specs, scratch directories, test fixtures, the packet-local scripts under `specs/`, and the pattern-defining tools were excluded, since those either are frozen history or contain the labels as data by design. The `F\d+` notation stays out of the checker because its matches are overwhelmingly function keys and figures rather than finding labels.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 16 files under `skills/system-spec-kit/{mcp_server,shared,scripts}` | Modified | Comment-only label scrub (cluster A) |
| 12 files under `skills/system-code-graph`, `skills/system-skill-advisor`, `bin`, `plugins` | Modified | Comment-only label scrub (cluster B) |
| 12 files under `skills/{deep-review,deep-research,deep-improvement,deep-loop-runtime,sk-code,sk-doc}` | Modified | Comment-only label scrub (cluster C) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three gpt-5.5 high-fast codex agents ran in parallel on disjoint clusters, each with the Gate 3 spec folder pre-approved and a scope lock to its own file list. Each agent used the extended checker as its own gate, editing until its cluster returned clean. The orchestrator then verified independently: the checker reported zero violations across all 40 files, every edited cjs, js, and py file passed its syntax check, the diff stat showed comment-only churn of 112 insertions against 114 deletions, and a scope comparison confirmed no file outside the 40-file cluster set was touched. Diff spot-checks across the highest-volume files confirmed the rewrites kept the reason and dropped only the label.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exclude archives, scratch, fixtures, and packet-local scripts | They are frozen or throwaway, so scrubbing them is churn without value |
| Exclude the pattern-defining tools | They hold the labels as data, so scrubbing would break them |
| Partition into three disjoint clusters | Parallel agents on non-overlapping files cannot conflict and finish faster |
| Keep the checker as the gate | A deterministic linter proves cleanliness better than a model self-report |
| Defer git pre-commit wiring | The broader tree still settles, and wiring now would block concurrent sessions |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Extended checker over all 40 files | PASS, 0 violations |
| `node --check` on edited cjs and js | PASS |
| `py_compile` on edited py | PASS |
| Comment-only diff stat | PASS, 112 insertions / 114 deletions |
| Scope comparison against cluster lists | PASS, no stray files |
| Diff spot-checks (reduce-state, run-benchmark, reindex, wait_patterns) | PASS, meaning preserved |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Excluded scopes still carry labels.** Archived specs, scratch, fixtures, and the packet-local `specs/` scripts are intentionally not scrubbed. They are frozen or throwaway.
2. **F-notation stays review-owned.** The checker does not flag `F\d+`, so genuine F finding labels rely on review.
3. **No git pre-commit wiring yet.** The checker runs through the PostToolUse hook. Wiring it into git pre-commit can land now that the live tree is clean, as a small follow-on, if blocking other sessions is acceptable.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
