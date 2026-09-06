---
title: "Implementation Summary: Runtime code standards research"
description: "A ten-iteration DeepSeek V4 Flash lane audited the spec-kit shared package and runtime against the sk-code-opencode and sk-code-quality standards and reported eighteen deviations across eight angles."
trigger_phrases:
  - "code standards research outcome"
  - "eighteen code deviations found"
  - "twelve confirmed code findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/026-runtime-code-standards-research"
    last_updated_at: "2026-09-06T10:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with its verification evidence"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:68351b93c302ceabb1dcf2a2eaec188fb4c524bb8dd83cebf912915280fc7a69"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-runtime-code-standards-research |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A ten-iteration DeepSeek V4 Flash lane audited the spec-kit shared package and runtime against the sk-code-opencode and sk-code-quality standards and reported eighteen deviations; twelve reproduced. A second, two-iteration Gemini 3.8 Flash pass over the surfaces the first lane never opened reported sixteen more, all reproduced, including a shared config bug that sent the telemetry store under the shared package so phase parents lost their active-child pointer. A third, five-iteration DeepSeek pass reported eleven more, all reproduced: a name collision between two scorers, three more private root walk-ups, two hook adapters that skipped the shared helpers, dead modules and hooks, and two untested surfaces.

### The research lane

One cli-pi lineage rotated the eight charted angles, reading the standard clause before the code, and labeled each fix mechanical or judgment. The reproduction pass split the confirmed rows into a mechanical table, a judgment table with decisions, and a dropped table with reasons.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| research/lineages/deepseek-v4-flash-code-standards/** | Created | Ten iteration files, state ledger, strategy, dashboard and the synthesized research.md |
| research/lineages/gemini-3-8-flash-code-standards/** | Created | Two Gemini 3.8 Flash iterations over runtime/lib, runtime/api, runtime/hooks, the CLI scripts and shared, run in a worktree |
| research/lineages/deepseek-v4-flash-code-standards-r2/** | Created | Five DeepSeek V4 Flash iterations over runtime/cli TypeScript, the rule scripts, the hook adapters and shared |
| research/confirmed-findings.md | Created | Mechanical, judgment and dropped tables for all three passes, consumed by phase 028 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Same launch shape as phase 025, in parallel. Each cited line was opened here; ripgrep found the consumers the lane missed for the socket server and the embeddings barrel, and shellcheck showed the cd rows are suppressed under set -e.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop findings with a live consumer | The shared socket server is imported through the package export; the embeddings barrel is imported by workflow.ts |
| Consolidate the repo-root resolvers in 028 | One sentinel-file resolver with a written rationale already existed under runtime/hooks; the rest delegate to it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration count | 10 files under iterations/, 10 iteration events |
| Angle coverage | All eight angles appear in the focus lines |
| Reproduction | First pass: 12 of 18 confirmed, 4 dropped, 2 no-change. Second pass: 16 of 16 reproduced; 13 fixed, 3 recorded as no-change with reasons. Third pass: 11 of 11 reproduced; 9 fixed, 2 recorded as no-change with reasons |
| Strict validation | `validate.sh <child> --strict` printed RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None** Every confirmed row was applied in phase 028, including the repo-root consolidation
<!-- /ANCHOR:limitations -->

---
