---
title: "Implementation Summary"
description: "The CLI vitest job runs as three shards, so the slowest check after a push fell from 384 to 627 s to 277 s."
trigger_phrases:
  - "cli vitest shards implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/018-cli-vitest-shards"
    last_updated_at: "2026-11-12T15:16:41Z"
    last_updated_by: "generate-context"
    recent_action: "Pushed the three-shard CLI vitest matrix to pull request 97"
    next_safe_action: "Verify the three shard job durations on pull request 97"
    blockers: []
    key_files:
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/018-cli-vitest-shards/spec.md"
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-cli-vitest-shards"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/350-test-ci-wait-cuts"
      savedAt: "2026-11-12T15:16:41Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 80
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-cli-vitest-shards |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The slowest check after a push now finishes in 277 s. It was the CLI vitest job at 384 to 627 s, and before the earlier job split it was one job at 867 s.

### Phase 18: cli-vitest-shards

You wait on the slowest workflow a push triggers, and that was the CLI vitest job. It now runs as three matrix entries, each taking one third of the 209 test files with `--shard`. Every test still runs once. The three entries repeat the checkout and install, so runner minutes rise while the wait falls.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/spec-kit-check.yml` | Modified | Adds the three-entry matrix to `cli-vitest` and the `--shard` flag to its command |
| `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Modified | Counts three matrix workflows and moves two line citations |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modified | Moves two timeout line citations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The plan ran each shard locally before any edit: 70, 70 and 69 files, 209 in total, with no failure. After the edit `actionlint` passed and the change went to pull request 97 as commit `61ee40aaef`. Run 43245778689 then showed three `CLI vitest project` jobs, all green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Three shards by file count, not a time-balanced split | vitest splits by file with one flag and no list to maintain. The slowest shard is 277 s, which no longer sets the wait alone |
| `fail-fast: false` | Each shard reports on its own, so one red shard does not hide the others |
| The orchestrator built it, not a dispatched worker | The plan came from DeepSeek V4.1 Flash. The build was two workflow edits and four citation moves |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `actionlint .github/workflows/spec-kit-check.yml` | Exit 0 |
| Local shard runs 1/3, 2/3 and 3/3 | 69, 69 and 68 files passed with 1 skipped each, 209 collected, 0 failed |
| Runner, run 43245778689 | Shard 1: 170 s, 70 files. Shard 2: 213 s, 70 files. Shard 3: 277 s, 69 files. All success |
| Pull request 97 on `61ee40aaef` | 48 checks pass, 0 fail |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The shards are uneven.** They took 170 s, 213 s and 277 s, so the slowest shard sets the job time. A time-balanced split would need a maintained file list.
2. **One run is the whole sample.** Earlier runs of the unsharded job spread across 243 s, so expect the shard times to move as well.
<!-- /ANCHOR:limitations -->

---


