---
title: "Implementation Summary"
description: "Profiled. Every speed estimate rests on a profile taken before the five cuts. This phase times every test file again, so the next cuts can aim at real costs."
trigger_phrases:
  - "fresh timing profile implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/002-fresh-timing-profile"
    last_updated_at: "2026-11-10T20:34:42Z"
    last_updated_by: "generate-context"
    recent_action: "Profiled all three lanes; phases 3 and 4 judged go"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:096108af3b50aa0e0a70385f80ec6a58770be30c05741d96fa33b45e454ca0c9"
      session_id: "scaffold-002-fresh-timing-profile"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      workspace: "/Users/michelkerkmeester/worktrees/public/340-local-test-scope"
      savedAt: "2026-11-10T20:34:42Z"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-fresh-timing-profile |
| **Completed** | 2026-11-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each lane ran once with Vitest's JSON reporter on the main checkout at `11c95edfd3`. To save wall time, all three ran at the same time. Every per-file time below is therefore inflated by load, and the figures are good for ranking only.

### Deep-loop suite (586 s, 2872 passed, 1 failed)

```text
serial group   12 files, 279 s span
  fanout-run                      139.7 s   176 tests, 44 describes
  stress/cli-adapter/fanout        22.9 s
  stress/cli-adapter/cli-opencode  19.2 s
  six other cli-adapter stress     14-16 s each
  lineage-timestamp-window         12.0 s
fanout-run's cost by describe
  shared-checkout churn            22.6 s
  lineages run concurrently        12.4 s
  non-zero CLI exit                11.4 s
  live-tools preflight             10.6 s
  21 describes of pure functions    0-0.3 s, about 90 tests
```

The one failure was `fanout-pool.vitest.ts`, "does not orphan an exited-but-still-writing worker", a timing test failing under the triple load.

### Spec-kit lanes

```text
core lane   476 s, 1638 passed
  tests/progressive-validation          315.0 s   50 tests, each 6-16 s
  next slowest                           16.3 s
cli lane    285 s, 2443 passed, 4 files failed
  cli/tests/progressive-validation      282.8 s   54 tests
  cli/tests/archive-track               180.1 s
  cli/tests/create-track-refresh        161.4 s
```

The cli lane is not usable for `upgrade-legacy`. With the core lane running in the same checkout, three `upgrade-legacy` files failed: the core lane removed the shared `runtime/.workflow-lock`, and the main file's sandbox setup hit its 180 s hook limit. `trigger-index-rebuild-workflow` also failed. For `upgrade-legacy`, the clean figures are the earlier runs. The cli lane took 397 to 430 s, set by that file's own process, and CI shows the same: its process ended about 230 s after the rest of the cli project.

### Decisions

| Phase | Decision | Number |
|-------|----------|--------|
| 3, split `upgrade-legacy` | Go | Its process sets the cli lane's time locally (397 to 430 s) and on CI (575 s, against 344 s for the rest) |
| 4, split `fanout-run` | Go | 140 of the 279 s serial tail. About 90 s of it sits in describes with no timing check |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `implementation-summary.md` | Modified | The timing tables and the decisions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`npx vitest run --reporter=dot --reporter=json --outputFile=<file>` ran in each lane. A short Python script ranked the files by `endTime - startTime` and summed per-test durations by describe. The reports stay in the session scratchpad.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure before cutting | The research could not put seconds on any remaining cost |
| Rank by file wall time, not the summed import figure | Vitest's import figure is a sum across files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Per-file times for all three lanes | Recorded above |
| Each run clean (REQ-002) | Not met: the runs overlapped and caused five failures. Deep-loop and core passed apart from one timing test |
| Go or no-go for phases 3 and 4 | Both go |
| `validate.sh` on this folder with `--strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Run under load.** The three lanes ran at the same time to save wall time. Per-file seconds are inflated, so they rank files but do not price them.
2. **The two spec-kit lanes share a checkout.** They cannot run side by side, because the core lane removes the lock file the cli lane's `upgrade-legacy` tests read. `npm test` runs them one after the other, so the shipped path is unaffected.
3. **A new lever, outside this series' scope.** The two `progressive-validation` files take 283 to 315 s each, and every one of their tests calls `validate.sh`. They may now set both spec-kit lanes' time. They need their own plan.
<!-- /ANCHOR:limitations -->

---


