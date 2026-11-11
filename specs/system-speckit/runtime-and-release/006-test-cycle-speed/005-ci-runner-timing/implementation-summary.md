---
title: "Implementation Summary"
description: "CI step times read for both suites. Every timing so far comes from an 18-core Mac. This phase reads how long both suites take on GitHub's runner and sets a worker cap only if the numbers call for one."
trigger_phrases:
  - "ci runner timing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/005-ci-runner-timing"
    last_updated_at: "2026-11-10T20:35:13Z"
    last_updated_by: "generate-context"
    recent_action: "Read CI step times before and after the cuts; no worker cap needed"
    next_safe_action: "Check a second CI run after the next push"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:95cd101a2e444b8b99d32a1005f4fc66f102555aea589c65d3c54c18a11ad704"
      session_id: "scaffold-005-ci-runner-timing"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      workspace: "/Users/michelkerkmeester/worktrees/public/340-local-test-scope"
      savedAt: "2026-11-10T20:35:13Z"
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
| **Spec Folder** | 005-ci-runner-timing |
| **Completed** | 2026-11-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The test step times of both workflows were read from GitHub's run history, before and after the cuts reached `main` in the push ending `b6e570ffb2`. No config changed, because no run called for a worker cap.

### CI step times

```text
deep-loop-runtime.yml, "Run the deep-loop runtime suites" (all passed)
  before the cuts   42605434761  453 s
                    42774120342  563 s
                    42810346960  660 s   median 563 s
  after the cuts    42857389235  393 s

spec-kit-check.yml, "CLI vitest project" (all failed, see below)
  before the cuts   42810347034  432 s
                    42817958513  637 s
  after the cuts    42857389421  575 s
```

In the run after the cuts, the CLI step's second process finished at 16:51:48 and the `upgrade-legacy` process at 16:55:39. That one file sets the step's time on CI too.

### CI failures

`spec-kit-check.yml` has failed on every push to `main` since 2026-11-08. The cause is the same in every run checked, before and after the cuts: eight tests in `cli/tests/template-staleness-discovery.vitest.ts`. These tests pass locally. Because the CLI step fails, CI never runs the spec-kit "Runtime vitest project" step. That step was skipped in every run read here.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `implementation-summary.md` | Modified | The CI timings and the decision |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`gh run list` listed both workflows' runs on `main`. `gh api repos/.../actions/runs/<id>/jobs` gave each step's start and end, and `gh run view --log-failed` gave the failing tests. Nothing was triggered.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No worker cap | The deep-loop step passed and took 393 s, faster than all three runs before the cuts (453 to 660 s). The spec-kit CLI step's config did not change for CI |
| Leave the staleness-discovery failure to its own fix | It predates the cuts and has nothing to do with test speed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Before and after step times, both suites | Recorded above |
| CI failures since the cuts | One file, `template-staleness-discovery.vitest.ts`, failing since before the cuts |
| `validate.sh` on this folder with `--strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One run after the cuts.** REQ-001 asks for two on each side. Only one push has run since the cuts, so the after figure is a single sample. GitHub runner times vary a lot: the three runs before the cuts range from 453 to 660 s.
2. **CI does not run the spec-kit runtime suite.** It stays skipped until `template-staleness-discovery.vitest.ts` passes on CI.
<!-- /ANCHOR:limitations -->

---


