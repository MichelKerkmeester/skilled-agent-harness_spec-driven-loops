---
title: "Implementation Summary"
description: "Five workflows that failed on every push to main are repaired at their causes. The fixes are on main and all five workflows pass there."
trigger_phrases:
  - "main ci red checks implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/repo-operations/005-main-ci-red-checks"
    last_updated_at: "2026-11-11T07:47:57Z"
    last_updated_by: "claude-code"
    recent_action: "Fixed and locally verified the five failing workflows"
    next_safe_action: "None, the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "main-ci-red-checks-2026-11-11"
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
| **Spec Folder** | 005-main-ci-red-checks |
| **Completed** | 2026-11-11 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five workflows failed on every push to main, so a red run said nothing about the push itself. Each failure had its own cause. All five are fixed in worktree 346 and pass locally.

### Repair the five checks that fail on main

The chart and diagram corpus workflows moved from Node 20 to Node 22, which no longer searches a directory passed to `node --test`. They now pass the test files as a glob. Two sk-doc tests compared frozen baselines against a tree that had since gained a hook folder and lost 48 READMEs, and both baselines are rebuilt.

The routing guard reported one drift: the CLI hub router sent "opencode go route" to the DeepSeek harness, but no intent in the hub's `ROUTER.md` carried the phrase. The intent now carries it. Three Spec-Kit tests failed for three reasons: a binding count that grew by eight, a sandbox copy that raced a lock folder, and a Bash expansion the Linux runner rejects.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/chart-corpus.yml`, `.github/workflows/diagram-corpus.yml` | Modified | Run the mutation suites on Node 22 |
| Three sk-design READMEs and three `sk-create-goal` READMEs | Modified | Show the command that works on Node 22 |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modified | Match the live tree |
| `cli-external-orchestration/ROUTER.md` | Modified | Carry the phrase the hub router already routes |
| `cli-external-orchestration/graph-metadata.json`, `skill-graph.json`, two route manifests | Modified | Regenerated from the router |
| `hook-registration-sync.vitest.ts` | Modified | Expect 116 bindings |
| `upgrade-legacy-host-root.vitest.ts` | Modified | Leave `.workflow-lock` out of the sandbox copy |
| `check-template-staleness.sh` | Modified | Read the array length in a form every Bash accepts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each failure was read from its CI job log, reproduced locally where the machine allows it and traced to its producer. Each fix is its own commit in worktree 346: `6bb42a9f5a`, `c807a36cab`, `f090583b7d` and `72a2a0b3f4`. All of it is on `origin/main`. The command that failed was rerun after each fix, then the other steps of its workflow.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add the phrase to `ROUTER.md`, keep it in `hub-router.json` | The v1.8.0.0 hub release added the phrase on purpose, so the missing side was the intent |
| Rebuild the baselines, change no test | All 48 verdict mismatches were READMEs that no longer exist, and the one manifest change is a real new folder |
| Fix the `sk-create-goal` READMEs too | They showed the same directory form, and the operator asked for them on 2026-11-11 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus suites on Node v22.23.4 with the glob | PASS, 88 chart tests and 21 diagram tests |
| `run-script-tests.sh` | PASS, `all sk-doc script tests passed`, 57 passes |
| Hub vocabulary guard | PASS, `checked=7 hub(s), drift=0` |
| Other routing workflow steps, parity suites and scorer gates | PASS, 22 and 53 tests, every step exit 0 |
| Three Spec-Kit test files | PASS, 18 of 18 |
| Full Spec-Kit CLI project | 2,518 passed, 2 timed out at 30 seconds under full local load. Both pass alone, 22 of 22, and neither failed in CI |
| The five workflows on main | PASS. Chart Corpus run 42986319009 and Diagram Corpus run 42986318839 on `68359fb3b6`, Spec-Kit Check on `4207a2b4a5`, sk-doc Script Tests and Routing Registry Drift Guard on `5524f2ee48`, all `success` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Bash fixes cannot be reproduced locally.** This machine has only Bash 3.2, so the staleness checker's two Linux-only causes were confirmed by CI: the first push fixed the empty-root test, and commit `f15ba37e94` fixed the other seven.
2. **Two CLI tests time out in a full local run.** They pass alone and pass in CI, so they are outside this packet.
<!-- /ANCHOR:limitations -->

---


