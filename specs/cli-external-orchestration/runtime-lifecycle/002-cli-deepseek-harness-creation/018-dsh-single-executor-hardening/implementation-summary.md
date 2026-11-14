---
title: "Implementation Summary"
description: "A single DeepSeek Harness lineage now sweeps stale homes, passes only its four env keys, counts its event stream instead of echoing it and is refused by :confirm. The reducer folds a line-shifted finding and the graph upsert folds leaf dimension ids."
trigger_phrases:
  - "dsh single executor hardening implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/018-dsh-single-executor-hardening"
    last_updated_at: "2026-11-14T14:50:00Z"
    last_updated_by: "orchestrator-worker"
    recent_action: "Built and verified the phase"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-dsh-single-executor-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-dsh-single-executor-hardening |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A harness review now sweeps stale homes, passes only its four env keys and prints a byte count instead of its event stream. `:confirm` refuses the harness and names `:auto`. A finding whose line moved keeps one registry row, and a leaf's own dimension ids no longer double the dimension count in the graph.

### Phase 18: dsh-single-executor-hardening

The runner checks every `dispatchEnv` key against a per-kind list before it writes a receipt. The fan-out helper gains `sweepStaleDshHomes`, which removes `dsh-home-XXXXXX` folders older than 24 hours and never follows a link. Both auto workflows call it before they mint a home and pass `echoStdout: false`. C6 was deferred by the operator, so nothing records executor identity in the state log yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | `DISPATCH_ENV_KEYS`, the key check and the `echoStdout` opt-out |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `sweepStaleDshHomes`, called before each new home |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | `sameFindingAtAnotherLine` |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Modified | `canonicalReviewDimensionId` for nodes and edges |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-research-auto.yaml` | Modified | The sweep call and `echoStdout: false` |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml`, `deep-research-confirm.yaml` | Modified | `unsupported_executor_guard` |
| `.skilled/commands/deep/assets/deep-review-presentation.txt`, `deep-research-presentation.txt` | Modified | The `:confirm` kinds |
| `.skilled/commands/deep/assets/compiled/` (three contracts) | Regenerated | New source digests |
| `.skilled/skills/system-deep-loop/changelog/v1.6.26.0.md` | Created | The release note |
| `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modified | Version 1.6.26.0 |
| The deep-loop route manifest and its archived activation copy | Refreshed | The new hub policy hash |
| Five test files under `runtime/tests` | Modified | Nine new tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One DeepSeek V4.1 Flash worker built the edits from `plan.md` section 4 through `cli-deepseek-harness` on rc.3, from a temp cwd with a throwaway home. It exited 0 with a `completed` final event. Review then fixed two misses: the runner now logs `0 bytes` for an empty stream, and the link test ages its target. Each new test was checked to fail with its source file swapped to the HEAD copy, then to pass with the edit back. The suites, the drift check, a byte compare of a fresh contract compile, the typecheck, a stub smoke of both auto branches and the route guard ran after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A per-kind key list in the runner | The runner is the one place every caller passes, so a later caller cannot widen the env by accident |
| Canonical dimension ids at the graph upsert | The live graph showed the leaf's own ids doubling the dimension count, and the upsert is the one deterministic step every graph write passes |
| C6 deferred | The operator chose to defer it. Either option changes where executor identity lives, which is a contract choice |
| Log `0 bytes` for an empty stream | The spec's edge case asks for it, and a missing line would read as a step that never ran |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Named suites | PASS. `17 passed (17)`, up from 11 |
| Sweep, reducer and upsert suites | PASS. `211 passed (211)`, up from 208 |
| Fail-before | PASS. 9 new tests fail on the HEAD sources and pass after |
| Contract drift and compile | PASS. `[CONTRACT DRIFT] OK commands=3`, and a fresh compile is byte-identical for all three |
| Full deep-loop suite | PASS. 2903 passed and 8 skipped of 2911, up from 2894 of 2902. Four tsx files failed only under the long private TMPDIR and pass with the default one |
| Typecheck | PASS. Exit 0 |
| Stub smoke of both auto branches | PASS. `child stdout 4189 bytes, not echoed`, empty stdout, home removed |
| Route guard | PASS. `system-deep-loop            fresh` after the manifest refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No executor identity in the state log.** C6 is deferred, so a single harness iteration is recorded only in its dispatch receipts.
2. **No live harness review ran on this build.** The branch was proved with a stub binary. The next real `:auto` harness review is the first live check of the byte-count line.
3. **The sweep acts on the shared temp folder.** A run removes any matching home older than a day, including one another session left. The six old homes on this machine were backed up and are still present.
<!-- /ANCHOR:limitations -->

---
