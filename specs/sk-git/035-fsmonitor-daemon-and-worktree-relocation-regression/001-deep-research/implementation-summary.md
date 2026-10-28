---
title: "Implementation Summary"
description: "The 30-minute push was an unbounded wait on both sides of git's fsmonitor handshake, made likely by worktrees nested in the checkout and left uncapped by a hook without a timeout."
trigger_phrases:
  - "deep research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/001-deep-research"
    last_updated_at: "2026-10-27T10:23:40Z"
    last_updated_by: "generate-context"
    recent_action: "Merged three lanes into research.md and planned phases 002 to 004"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/001-deep-research/research/research.md"
      - "specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md"
    session_dedup:
      fingerprint: "sha256:4ef70c04f44b54260fc73228e04ababda93f1ca255859314ca2d4103cab908aa"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1"
      - "Q2"
      - "Q3"
      - "Q4"
      - "Q5"
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
| **Spec Folder** | 001-deep-research |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now know why the push hung and what to change. The wedge is a known unbounded wait in git's own fsmonitor code, the worktrees drifted back inside the checkout and multiplied the main daemon's event load, and the hook that hung had no timeout to fall back on.

### Phase 1: deep-research

Seven DeepSeek V4.1 Flash iterations at `max` effort ran across three lanes and answered all five questions. The synthesis in `research/research.md` traces a five-link chain: fsmonitor on everywhere, worktrees inside the checkout, macOS daemons that never retire, a cookie handshake with no deadline on either side, and a repository hook with no ceiling. It turns that chain into four fix layers that phases 002 to 004 build: bound the gate, restore the worktree topology, reap stray daemons, and replace wedged ones.

One assumption in the packet turned out wrong. The reaper code removed in September targeted retired MCP `context-server.js` daemons, never git fsmonitor daemons, so a fsmonitor reaper is new work rather than a restore.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Merged synthesis, fix design and open checks |
| `research/resource-map.md` | Created | Reducer resource map across lanes |
| `research/fanout-attribution.md` | Created | Which lane produced which finding |
| `research/deep-research-config.json` | Created | Run configuration |
| `research/lineages/*/` | Created | Per-lane iterations, state logs and syntheses |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fan-out started two lanes in parallel. Lane `llmgateway-flash-1017` finished three iterations. The opencode-go lane was refused with a monthly quota error, and on the operator's choice it moved to `llmgateway/deepseek-v4.1-flash`. That lane finished one iteration before the network dropped, two `resume` attempts exited 1 before any model call, and a rerun under `llmgateway-flash-undated-run2` finished three iterations. `fanout-merge.cjs` merged the three lanes with iterations and skipped the empty one. The orchestrator then fetched git v2.50.1's source and read the cited lines, checked the repository lines and the reaper commit, and wrote the synthesis.

During the run the main checkout's daemon wedged twice more and blocked the fan-out's containment `git status`. Ending the daemon released it both times, and both events are recorded in `../scratch/findings.md` section 5a.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the opencode-go lane to llmgateway's undated build | The opencode-go quota resets in about eight days, and opencode-go serves no 1017 build. The operator chose this option. |
| Rerun the interrupted lane under a new label instead of resuming | Two resumes failed before any model call with empty logs, while the network, model route and lock were all healthy |
| Treat the two complete lanes as one line of evidence | The second lane read the first lane's synthesis before starting, so its agreement is not independent |
| Recommend a new reaper script over restoring the old one | The removed code only matched MCP daemons, and `worktree-reaper.sh` promises never to signal a process |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n '^### Q[1-5]\.' research/research.md` | PASS, five lines |
| `rg -n '^### Layer [1-4]' research/research.md` | PASS, four lines |
| git v2.50.1 `fsmonitor--daemon.c:198-207`, `fsm-health-darwin.c`, `ipc-unix-socket.c:210-213` | PASS, read directly: infinite-wait comment, empty health stub, deadline-free read |
| `git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh` | PASS, the removed code matched `context-server.js` only |
| `validate.sh <this folder> --strict` | See the parent packet's recursive run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Lane two is not independent.** It read lane one's synthesis first. The git source claims it shares were checked by hand, so the fix design does not rest on its agreement.
2. **The trigger is inferred.** That a lost cookie event under load sets off the wedge is not confirmed. A `GIT_TRACE_FSMONITOR=1` run during a heavy install in a nested worktree would confirm it. Resolved by the fsmonitor decision: this checkout keeps `core.fsmonitor=false` permanently (`../005-reaper-hardening/spec.md` section 10), so no git call here reaches a daemon and confirming the trigger changes no fix.
3. **The call-site inventory is a sample.** It covers the JavaScript spawn sites near the hung path, not every shell `git` line in the hooks. Resolved by the same decision: with fsmonitor off, no call site, sampled or not, waits on a daemon. Phase 005 also bounded the hook and launcher call lines that read the index.
<!-- /ANCHOR:limitations -->

---
