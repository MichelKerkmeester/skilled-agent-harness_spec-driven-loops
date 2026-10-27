---
title: "Implementation Summary"
description: "The doctor:ci report now shows zero drift flags: event SHAs reach three run scripts through step env, every workflow carries a concurrency block, and the two Node 20 sensitive suites also run on Node 20 in CI."
trigger_phrases:
  - "ci drift flags implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/008-ci-drift-flags"
    last_updated_at: "2026-10-27T22:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Cleared all five drift flags and added the Node 20 steps"
    next_safe_action: "Conductor adds the child to the parent phase table and commits"
    blockers: []
    key_files:
      - ".github/workflows/changed-packet-validation.yml"
      - ".github/workflows/dependabot-auto-merge.yml"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ci-drift-flags-implementer"
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
| **Spec Folder** | 008-ci-drift-flags |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:ci report` went from five drift flags to zero, and no workflow changed what it compares or when it runs. The two suites that once failed only on Node 20 now get a Node 20 run in CI as well.

### Clear the five doctor:ci drift flags and decide Node 20 CI coverage

The three `event-in-run` workflows now pass every event value through a step `env:` entry and read it as a quoted variable. The changed-packet gate keeps its push branch and its fallback to the parent commit when a branch's first push has an all-zero before-SHA. Auto-merge queues its runs with `cancel-in-progress: false`, so a run never stops between reading the metadata and turning auto-merge on. The freshness report takes the standard block. It is a scheduled and manual workflow, so the block only keeps two manual runs from overlapping.

Node 20 is declared for the code these suites test. There is no root `package.json`, and the README asks for Node 24 as the version every part accepts. But the advisor runtime declares `^20.19.0 || >=22.12.0` and system-spec-kit, whose freshness library the quality runner loads, declares `>=20.11.0`. Each workflow gets a second `setup-node` step on `'20'` at the end of its existing job, followed by the one suite. Filters, timeout and concurrency stay the same, and so do the job counts the reference tables quote. **Extra time per run:** one `setup-node` call from the runner's tool cache plus the suite. Locally on Node 20.19.5 that was about 2 s for the advisor suite and under 1 s for the parallel node check suite. That is an estimate of roughly 10 to 20 s per workflow run, not a measured CI number, and it can round a job's billed time up by at most one minute.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/agent-mirror-sync.yml`, `.github/workflows/comment-hygiene.yml` | Modified | `BASE_SHA` and `HEAD_SHA` step env |
| `.github/workflows/changed-packet-validation.yml` | Modified | `EVENT_NAME`, `PR_BASE_SHA`, `PR_HEAD_SHA`, `PUSH_BEFORE_SHA`, `PUSH_HEAD_SHA` step env |
| `.github/workflows/dependabot-auto-merge.yml` | Modified | Queueing concurrency block |
| `.github/workflows/strict-pass-freshness-report.yml` | Modified | Standard concurrency block |
| `.github/workflows/opencode-plugin-tests.yml`, `.github/workflows/sk-code-script-tests.yml` | Modified | Node 20 step for one suite each |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modified | Concurrency claim 32 of 32, doc version 1.0.4.0 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Modified | Supplies the gate step's env, rendered like the run block |
| `.skilled/skills/sk-code/sk-code-ci/changelog/v1.1.4.0.md`, `.skilled/skills/system-spec-kit/changelog/v2.12.11.0.md` | Created | Changelog entries |
| `.skilled/skills/sk-code/sk-code-ci/SKILL.md`, `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Version carriers |
| `.hermes/skills/sk-code-ci/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md` | Modified | Hermes copies resynced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The report and the consumer vitest ran first to record the baseline. The workflows were edited next. The vitest then failed ten cases on `EVENT_NAME: unbound variable`, so it was taught to read the step env, and it passed again. The report, actionlint, the doctor ci tests and the gate-inputs check closed it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move `github.sha` into env beside the event values | The push branch reads both SHAs from one place, and the value is the one the runner expands |
| A step at the end of the existing job, not a new job or matrix | No second provisioning, and the job counts the reference tables quote stay true |
| Node 20 counts as supported | The packages the two suites test declare it in `engines`, and the sibling Node 20 fix packet said the same |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ci-report.cjs --json` | Before 5 flags, after `workflows 32 flags 0 errors 0`, exit 0 |
| `actionlint .github/workflows/*.yml` | No output, exit 0 |
| `node --test ci-report.test.cjs doctor-ci-contract.test.cjs` | `pass 26 fail 0`, exit 0 |
| `ci-rule-set-comparison.vitest.ts` | Baseline 17 passed; workflow edit alone 10 failed; with the test fix 17 passed, exit 0 |
| Gate inputs, main's script on this tree | `failures=0`, `RESULT: PASSED`, exit 0 |
| Gate inputs, the worktree's own script | `RESULT: FAILED` on `pre-push:263` only, which predates this packet and is fixed on main by `f291d28f8a` |
| Node 20.19.5, both suites | `pass 42 fail 0` and `pass 3 fail 0`, exit 0 |
| Changelog entries | `validate_document.py` 0 issues each, voice scan 0 deductions |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Node 20 time cost is an estimate.** It comes from local runs, so the first CI run of each workflow gives the real number.
<!-- /ANCHOR:limitations -->

---
