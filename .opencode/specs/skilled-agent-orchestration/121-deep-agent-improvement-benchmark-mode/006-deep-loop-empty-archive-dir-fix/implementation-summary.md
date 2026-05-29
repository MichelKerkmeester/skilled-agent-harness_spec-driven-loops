---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Completed fix: deep-research init no longer eagerly creates archive_root; all four deep-loop restart branches archive lazily and guarded; regression tests added; 5 empty archive dirs removed."
trigger_phrases:
  - "deep loop archive summary"
  - "empty archive fixed"
  - "archive root lazy restart"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/006-deep-loop-empty-archive-dir-fix"
    last_updated_at: "2026-05-29T08:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fix shipped + verified (26/26 tests, simulation) + 5 empty archive dirs swept"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-archive-fix-20260529"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Deep-loop empty archive-dir fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 121-deep-agent-improvement-benchmark-mode/006-deep-loop-empty-archive-dir-fix |
| **Completed** | 2026-05-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Stopped the deep-loop commands from leaving empty `research_archive/` and `review_archive/` directories in spec packets. Root cause: the deep-research init step `step_create_directories` ran `mkdir -p … {state_paths.archive_root}` on every fresh/resume run, but the archive root is only used on a `restart` move — so it almost always stayed empty. Deep-review's init never created it (confirmed by git archaeology and an independent `openai/gpt-5.5-fast` read-only trace); its empties were historical/orphaned.

The fix removes the archive root from research init and rewrites all four restart branches to create the archive root **lazily and guarded** — only when the packet exists, immediately before the move: `if [ -d {state_paths.packet_dir} ]; then mkdir -p {state_paths.archive_root} && mv {state_paths.packet_dir} {state_paths.archive_root}/{timestamp_slug}; fi`. Two contract-parity regression tests lock the invariant, and the 5 existing empty archive dirs were removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modified | Drop archive_root from init mkdir (L138); lazy guarded restart (L181) |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | Drop archive_root from init mkdir (L154); lazy guarded restart (L220) |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Lazy guarded restart (L204) |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Lazy guarded restart (L210) |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Modified | Regression: no eager archive_root + lazy guarded restart |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modified | Same regression assertion |
| 5 × empty `*_archive/` dirs (120/002, 121/002, 122, 026/…/005-finding-remediation, 026/…/004-embedding-backlog-drain) | Removed | Empty, untracked orphan dirs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Investigated** every `*_archive` creator via git archaeology and an independent read-only `openai/gpt-5.5-fast` trace, converging on the research-init eager mkdir as the live root cause (introduced in commit `537cd82d26`).
2. **Edited** the four command YAMLs — dropped `{state_paths.archive_root}` from research init and rewrote all four restart branches to the guarded lazy form.
3. **Locked** the invariant with regression assertions in both contract-parity suites.
4. **Verified** with YAML parse, grep invariants, a fresh/restart simulation, and a 26-test vitest run; then **swept** the 5 empty untracked archive dirs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Replace declarative `archive:` with guarded `command:` on restart | After removing the eager init mkdir, restart can no longer assume the archive root exists — it must create it lazily; the guard prevents an empty dir when the packet is absent |
| Apply the guarded restart to deep-review too | Symmetry + closes the historical/edge-case path that produced orphan `review_archive/` dirs |
| `if [ -d … ]; then …; fi` instead of `test -d … && …` | A missing packet becomes a clean no-op instead of a non-zero step failure |
| Dispatch root-cause + patch design to `openai/gpt-5.5-fast` (read-only) | User-directed executor; independent adversarial verification of the git-archaeology root cause |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Static | Pass | All 4 YAMLs parse; 0 init mkdirs contain archive_root; 4 guarded restart commands present |
| Behavioral | Pass | Simulation: fresh init → no archive; restart-present → content moved; restart-absent → no dir |
| Contract | Pass | `review-research-paths` + `deep-research/deep-review contract-parity` + `deep-review-reducer-schema` = 26/26 |
| Cleanup | Pass | 5 empty archive dirs removed; 5 populated archives (18–78 files) intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **deep-agent-improvement `improvement_archive`** — analogous pattern; no live eager creator found in current init paths, but flagged as a watch item (not changed).
2. **Historical orphans elsewhere** — only `research_archive`/`review_archive` empties were swept; the sweep can be re-run if new empties appear.
<!-- /ANCHOR:limitations -->
