---
title: "Implementation Summary"
description: "A wedged fsmonitor daemon now costs the push gate at most one 20-second timeout instead of an open-ended hang, and no git failure on these paths turns into a silent pass or a guessed write."
trigger_phrases:
  - "push gate git timeout implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/004-push-gate-git-timeout"
    last_updated_at: "2026-10-27T11:17:15Z"
    last_updated_by: "generate-context"
    recent_action: "Bounded seven git calls on the push gate path and its siblings"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs"
    session_dedup:
      fingerprint: "sha256:3565bfa1bedde88981e1e28a84780d7c0ea089b84fc96208b609459334252002"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1"
      - "Q2"
      - "Q3"
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
| **Spec Folder** | 004-push-gate-git-timeout |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The push can no longer hang on a stuck fsmonitor daemon. With the daemon stopped, the old skill-root gate hung until it was killed, and the new one finished in 2 seconds.

### Phase 4: push-gate-git-timeout

Every git call on the push gate's path, and on four close siblings, now has a 20-second ceiling. The calls that read the index also run with `-c core.fsmonitor=false`, so they never talk to the daemon at all. That is why the stopped-daemon run finished in 2 seconds rather than 20.

Three of the sites also stop turning a git failure into a wrong answer. The manifest generator stops calling git after the first failure in a run, and refuses to overwrite `leaf-manifest.json` when git timed out. The derived-metadata regenerator keeps a reference when it cannot learn whether the file is ignored, so it never prunes on a missing answer. The behavior benchmark now records an isolation violation when `git status` cannot answer, instead of reporting the run as clean.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modified | Timeout on both calls, fsmonitor opt-out on `check-ignore`, first-failure latch, refused write after a timeout |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | Modified | Timeout and opt-out, an error branch that keeps the reference, and the same latch |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | Timeout and opt-out on `check-ignore` |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` | Modified | Timeout and opt-out on `git status`, and a fail-closed isolation check |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | Modified | Timeout on both calls, which do not read the index |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs` | Created | Argv, fallback, latch and refused write |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/regenerate-skill-derived-git-timeout.test.cjs` | Created | Argv, kept reference, latch, normal status |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs` | Created | A hanging stub `git` ends within 25 seconds |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run-git-timeout.test.cjs` | Created | Argv, null on failure, fail-closed violation |
| `.skilled/skills/sk-git/scripts/tests/validate-message-git-timeout.test.mjs` | Created | A hanging stub `git` makes the validator exit 2 with its block message |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash 1017 at `max` built five units through `cli-opencode`, one at a time, each with fsmonitor disabled for its own git calls. The orchestrator read every diff, corrected two comments in the generator (one overstated the hang, one described the fallback's risk backwards), and ran each unit's tests before the next unit started. After the last unit it reran the manifest byte comparison, timed a healthy gate run, ran the stopped-daemon comparison in a scratch repository, and ran all nine phase test files plus seventeen consumer test files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Latch after the first failed git call | A stuck daemon would otherwise cost one timeout per skill root on each run |
| Refuse `--write` after a timeout | The name rules only drop generated noise, so bytes written without git's answer could list ignored files |
| Keep a reference when the ignore answer is unknown | Pruning on an answer that never arrived drops real routing signal and writes it to disk |
| Fail the benchmark's isolation check when `git status` cannot answer | An empty list read as "no changes" let a broken check pass |
| Timeout only, no opt-out, in `validate-message.mjs` | `rev-parse`, `rev-list`, `log` and `config` do not read the index |
| Scratch repository instead of a full clone for the stopped-daemon run | A clone is 3.6 GB of history and lacks the gitignored built parser the gate loads |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Nine phase test files, TAP reporter | PASS, each `# fail 0` |
| Manifest bytes, 16 roots, before and after | PASS, `diff -r` empty |
| Healthy gate run on the real tree | PASS, 4 s against a 4.62 s baseline, 14 of 14 roots |
| Gate with the daemon stopped, old code | Hung until the 90 s cap, exit 142 |
| Gate with the daemon stopped, new code | Ended in 2 s |
| Seventeen consumer test files | 16 PASS. `skill-root-reader-inventory.test.cjs` FAILS on `router-replay-lib.cjs:520`, a file this phase did not touch, so it fails at HEAD too |
| `validate.sh <this folder> --strict` | PASS, `RESULT: PASSED`, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other git calls are still unbounded.** This phase fixed the proven path and its close siblings, not all of the roughly 59 git-spawning files. Phase 003's wedge probe covers the rest from the daemon side. Resolved by the fsmonitor decision: this checkout keeps `core.fsmonitor=false` permanently (`../005-reaper-hardening/spec.md` section 10), so no git call here waits on a daemon. Phase 005 also bounded the hook and launcher call lines that read the index.
2. **The stopped-daemon run used a copy.** Three roots failed in the copy because `.skilled/commands/` was not copied. The real tree passes all 14.
3. **One consumer test already fails.** `skill-root-reader-inventory.test.cjs` reports `router-replay-lib.cjs:520`. Neither file differs from HEAD, and the reported file was last changed in `f431355ac2`, so the failure predates this phase. It is outside this phase. Resolved: on 2026-10-27 `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` prints `tests 1`, `pass 1`, `fail 0` and exits 0.
<!-- /ANCHOR:limitations -->

---
