---
title: "Implementation Summary: Keep cli-opencode workers inside the git worktree they are started in"
description: "OpenCode 2 tells the model its working directory from the inherited PWD, so a worker spawned from Node into a linked worktree used other checkouts. Dispatches now set PWD and carry a repository-root line, and a probe proves it."
trigger_phrases:
  - "opencode worktree confinement implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/003-opencode-worktree-confinement"
    last_updated_at: "2026-11-08T10:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Probe built, cause measured, PWD and root-line fix shipped in docs and the fan-out runner"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/probe-worktree-confinement.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "087-opencode-worktree-confinement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No OpenCode flag pins the project root; the fix is PWD plus the root line"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-opencode-worktree-confinement |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An OpenCode worker you start in a linked worktree now stays in that worktree. It used to read and sometimes write files in your main checkout, because OpenCode takes the directory it tells the model from the inherited `PWD`, and Node's `spawn()` leaves `PWD` pointing wherever the parent was.

### Worktree Confinement

Two changes keep a worker in place, and each held on its own in every probe run. The dispatcher sets `PWD` to the directory it starts the worker in, and the prompt opens with a `REPOSITORY ROOT` line that tells the model to ignore the "Workspace root folder" OpenCode names, which is the repository's first checkout. The deep-loop fan-out runner now sets `PWD` for every lineage it spawns, so the fix holds for research and review fan-outs too. A probe script starts one read-only worker in a throwaway worktree and fails when any tool path leaves it, so you can check a new dispatch shape before trusting it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/probe-worktree-confinement.cjs` | Created | The probe, with `--set-pwd` and `--root-line` to test each fix |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `runLineageProcess` sets `PWD` to the lineage `cwd` |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-lineage-pwd.test.ts` | Created | Pins the lineage `PWD`, with and without an inherited value |
| `.skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md` | Modified | The block opens with the root line, and a subsection says why |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modified | Rule 15 layer L2 names `PWD`, the root line and the probe |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md` | Modified | A subsection on dispatching into a linked worktree |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash workers on `opencode-go` wrote the probe, the fan-out change with its test and the doc edits, one dispatch at a time. Every worker ran with the fix applied to its own dispatch, `PWD` set and the root line on top, and a check of the main checkout's `git status` before and after each one found it unchanged every time. The orchestrator widened the probe after its first runs: a worker had used the path of the worktree the probe was launched from, which the first version did not count, so the probe now counts any absolute path outside its worktree and the system temp folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix on the dispatch side, with both `PWD` and the root line | No OpenCode flag pins the project root. `PWD` removes the cause and the root line still covers a dispatcher that forgets it |
| Leave the fan-out prompt without the root line | It already names its absolute write directory, a test pins how it opens, and the `PWD` fix removes the cause there |
| Count any absolute path outside the worktree as a failure | A worker that wandered to a home-folder guess had lost its directory as surely as one in another checkout |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Probe, old shape | Exit 1 on 6 of 7 runs: paths in main and in worktrees 320 and 324 |
| Probe, `--set-pwd` | Exit 0 on 7 of 7 runs, 3 of them under a `PWD` outside any checkout |
| Probe, `--root-line` only | Exit 0 on 3 of 3 runs under that `PWD` |
| `fanout-lineage-pwd.test.ts` | 2 of 2 pass, and both fail against the old runner |
| Fan-out suites (`fanout-run.vitest.ts`, the two lineage tests) | 177 of 177 pass |
| cli-opencode script tests | 27 of 27 pass |
| `validate_document.py` on the three docs | 0 issues each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The project root itself is still wrong.** OpenCode still names the first checkout as the workspace root. That is OpenCode's behavior, and a dispatcher that sets neither `PWD` nor the root line can still leak.
2. **The probe costs one model run.** It needs an OpenCode provider with credit and is not part of any automated suite.
<!-- /ANCHOR:limitations -->

---
