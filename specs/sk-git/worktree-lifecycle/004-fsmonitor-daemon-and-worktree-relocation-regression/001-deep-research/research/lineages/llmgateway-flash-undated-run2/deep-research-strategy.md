---
title: Deep Research Strategy - fsmonitor daemon pile-up and worktree relocation regression
description: Session tracking for the llmgateway-flash-undated-run2 fan-out lineage of the fsmonitor daemon research packet.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the `llmgateway-flash-undated-run2` lineage. Records what to investigate, what worked, what failed, and where to focus next, so each iteration starts from files rather than memory.

### Usage

- **Init:** populated from the research topic and `scratch/findings.md` section 8.
- **Per iteration:** the leaf reads Next Focus, writes iteration evidence, and the reducer refreshes the machine-owned sections.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Root-cause and fix design for git fsmonitor daemon pile-up and hangs in this repo: why the main checkout fsmonitor daemon stopped answering IPC and stalled a pre-push hook for 30 minutes, why 11 daemons accumulate across nested worktrees, what regressed sk-git/026 worktree relocation and reaper daemon handling, and how to prevent old daemons from running on. Start from `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md` and answer its section 8 questions.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1. What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default?
- [x] Q2. What is git 2.50.1's documented fsmonitor daemon lifecycle on macOS, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged?
- [x] Q3. Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake?
- [x] Q4. Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?
- [x] Q5. What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement the fix in this packet; this is research and fix design only.
- Do not re-litigate sk-git/026's completed worktree-pruning outcome beyond what explains the regression.
- Do not benchmark filesystem watcher implementations other than git's built-in fsmonitor daemon.
- Do not redesign the pre-push hook's unrelated gates.

---

## 5. STOP CONDITIONS

- All five section-8 questions carry a cited answer or an explicit UNKNOWN with the check that would resolve it.
- Additional stop condition: `maxIterations` (3) reached, because the dispatcher set `stopPolicy: max-iterations`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1. What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default?
- Q2. What is git 2.50.1's documented fsmonitor daemon lifecycle on macOS, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged?
- Q3. Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake?
- Q4. Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?
- Q5. What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- `git log -S` over both path spellings, then reading the daemon-related diff hunks of the one commit that matched, converted a vague "the reaper lost something" into an exact deletion with a date and a reason. Re-measuring the live process census in the same session kept the sixteen-day-old daemon observation current instead of inherited. (iteration 1)
- reading the installed build's man page first pinned the exact version, then reading that version's source turned "the daemon stopped answering" into named waits at named lines. The source comment admitting the infinite wait is stronger evidence than any inference about overload, and the client-side error string cross-links the observed `could not read IPC response` to one exact line. (iteration 2)
- following the hook symlink from `core.hooksPath` into the gate script and then into its imported builder put the exact hung `spawnSync` in one chain of three files. Grepping for an existing `GIT_NO_FSMONITOR` constant then showed the fix pattern already exists in-repo, which lowers the implementation risk to "adopt the convention here". (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- chasing config provenance through git history was structurally impossible — the key is unversioned. Reading the wrapper's write-back found the real persistence mechanism instead. (iteration 1)
- my first probes for the socketDir logic inside `builtin/fsmonitor--daemon.c` found nothing; the socket placement lives in the path-resolution layer, and the manual already documents the behavior, so the source hunt was unnecessary. (iteration 2)
- trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`--ipc-threads=8` is a repo or Apple-specific tuning knob that might itself deadlock." Ruled out as a repo cause: 8 is the compiled default of `fsmonitor.ipcthreads`, and the repo sets no `fsmonitor.*` key. It remains a risk multiplier, not a root cause. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "`--ipc-threads=8` is a repo or Apple-specific tuning knob that might itself deadlock." Ruled out as a repo cause: 8 is the compiled default of `fsmonitor.ipcthreads`, and the repo sets no `fsmonitor.*` key. It remains a risk multiplier, not a root cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`--ipc-threads=8` is a repo or Apple-specific tuning knob that might itself deadlock." Ruled out as a repo cause: 8 is the compiled default of `fsmonitor.ipcthreads`, and the repo sets no `fsmonitor.*` key. It remains a risk multiplier, not a root cause.

### "A git upgrade fixes it." Ruled out for 2.51-2.53 by their release notes; the source comment in 2.50.1 states the timed wait was not implemented. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A git upgrade fixes it." Ruled out for 2.51-2.53 by their release notes; the source comment in 2.50.1 states the timed wait was not implemented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A git upgrade fixes it." Ruled out for 2.51-2.53 by their release notes; the source comment in 2.50.1 states the timed wait was not implemented.

### "A repo commit reverted the relocated worktree base." Ruled out: the key is local config; the only repo-side actor is the wrapper's write-back. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "A repo commit reverted the relocated worktree base." Ruled out: the key is local config; the only repo-side actor is the wrapper's write-back.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A repo commit reverted the relocated worktree base." Ruled out: the key is local config; the only repo-side actor is the wrapper's write-back.

### "Disable fsmonitor everywhere." Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Disable fsmonitor everywhere." Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Disable fsmonitor everywhere." Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius.

### "Match daemons by command line." Ruled out by finding 7: argv is identical for every daemon. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Match daemons by command line." Ruled out by finding 7: argv is identical for every daemon.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Match daemons by command line." Ruled out by finding 7: argv is identical for every daemon.

### "Rely on `git fsmonitor--daemon stop` in a reaper." Ruled out by iteration 2: stop hangs on exactly the daemon a reaper needs to remove. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Rely on `git fsmonitor--daemon stop` in a reaper." Ruled out by iteration 2: stop hangs on exactly the daemon a reaper needs to remove.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Rely on `git fsmonitor--daemon stop` in a reaper." Ruled out by iteration 2: stop hangs on exactly the daemon a reaper needs to remove.

### "Restore the reaper's daemon handling." Ruled out by iteration 1: that code targeted MCP context-server daemons and the reaper now promises never to signal a process. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Restore the reaper's daemon handling." Ruled out by iteration 1: that code targeted MCP context-server daemons and the reaper now promises never to signal a process.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Restore the reaper's daemon handling." Ruled out by iteration 1: that code targeted MCP context-server daemons and the reaper now promises never to signal a process.

### "The `.opencode` → `.skilled` move removed the daemon handling." Ruled out: `git log -S daemon` puts the deletion in `3c7c3f83874` (2026-09-03), and the move commit `330427cf30` (2026-09-17) is the only commit touching the current path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The `.opencode` → `.skilled` move removed the daemon handling." Ruled out: `git log -S daemon` puts the deletion in `3c7c3f83874` (2026-09-03), and the move commit `330427cf30` (2026-09-17) is the only commit touching the current path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `.opencode` → `.skilled` move removed the daemon handling." Ruled out: `git log -S daemon` puts the deletion in `3c7c3f83874` (2026-09-03), and the move commit `330427cf30` (2026-09-17) is the only commit touching the current path.

### "The daemon can be expected to exit on its own after idling." Ruled out: no idle timeout exists in the manual or the source, and the macOS health thread is an empty stub. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The daemon can be expected to exit on its own after idling." Ruled out: no idle timeout exists in the manual or the source, and the macOS health thread is an empty stub.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The daemon can be expected to exit on its own after idling." Ruled out: no idle timeout exists in the manual or the source, and the macOS health thread is an empty stub.

### "The relocation never happened or was rolled back by hand." Ruled out: the sk-git/026 summary records the migration and the file-count drop; `~/worktrees` exists but is empty, which is the relocation's residue. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The relocation never happened or was rolled back by hand." Ruled out: the sk-git/026 summary records the migration and the file-count drop; `~/worktrees` exists but is empty, which is the relocation's residue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The relocation never happened or was rolled back by hand." Ruled out: the sk-git/026 summary records the migration and the file-count drop; `~/worktrees` exists but is empty, which is the relocation's residue.

### Git-config provenance for `speckit.worktreeBase`: `.git/config` is not versioned, so the exact unset action is unrecoverable from the repository. Recorded as an explicit UNKNOWN rather than guessed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Git-config provenance for `speckit.worktreeBase`: `.git/config` is not versioned, so the exact unset action is unrecoverable from the repository. Recorded as an explicit UNKNOWN rather than guessed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Git-config provenance for `speckit.worktreeBase`: `.git/config` is not versioned, so the exact unset action is unrecoverable from the repository. Recorded as an explicit UNKNOWN rather than guessed.

### Locating a Darwin health-check policy: the implementation is an empty stub, so there is no policy to read. The daemon's own liveness is explicitly unmonitored on macOS. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Locating a Darwin health-check policy: the implementation is an empty stub, so there is no policy to read. The daemon's own liveness is explicitly unmonitored on macOS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Locating a Darwin health-check policy: the implementation is an empty stub, so there is no policy to read. The daemon's own liveness is explicitly unmonitored on macOS.

### Trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "A repo commit reverted the relocated worktree base." Ruled out: the key is local config; the only repo-side actor is the wrapper's write-back. (iteration 1)
- "The `.opencode` → `.skilled` move removed the daemon handling." Ruled out: `git log -S daemon` puts the deletion in `3c7c3f83874` (2026-09-03), and the move commit `330427cf30` (2026-09-17) is the only commit touching the current path. (iteration 1)
- "The relocation never happened or was rolled back by hand." Ruled out: the sk-git/026 summary records the migration and the file-count drop; `~/worktrees` exists but is empty, which is the relocation's residue. (iteration 1)
- Git-config provenance for `speckit.worktreeBase`: `.git/config` is not versioned, so the exact unset action is unrecoverable from the repository. Recorded as an explicit UNKNOWN rather than guessed. (iteration 1)
- "`--ipc-threads=8` is a repo or Apple-specific tuning knob that might itself deadlock." Ruled out as a repo cause: 8 is the compiled default of `fsmonitor.ipcthreads`, and the repo sets no `fsmonitor.*` key. It remains a risk multiplier, not a root cause. (iteration 2)
- "A git upgrade fixes it." Ruled out for 2.51-2.53 by their release notes; the source comment in 2.50.1 states the timed wait was not implemented. (iteration 2)
- "The daemon can be expected to exit on its own after idling." Ruled out: no idle timeout exists in the manual or the source, and the macOS health thread is an empty stub. (iteration 2)
- Locating a Darwin health-check policy: the implementation is an empty stub, so there is no policy to read. The daemon's own liveness is explicitly unmonitored on macOS. (iteration 2)
- "Disable fsmonitor everywhere." Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius. (iteration 3)
- "Match daemons by command line." Ruled out by finding 7: argv is identical for every daemon. (iteration 3)
- "Rely on `git fsmonitor--daemon stop` in a reaper." Ruled out by iteration 2: stop hangs on exactly the daemon a reaper needs to remove. (iteration 3)
- "Restore the reaper's daemon handling." Ruled out by iteration 1: that code targeted MCP context-server daemons and the reaper now promises never to signal a process. (iteration 3)
- Trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design. (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q5. Safest default shape. (iteration 1)
- Q2. Git 2.50.1's documented daemon lifecycle on macOS (idle exit, `fsmonitor.socketDir`, `git fsmonitor--daemon stop` on a wedged daemon). (iteration 1)
- Q3. Event overload versus a known 2.50.1 daemon deadlock (`--ipc-threads`, cookie handshake). (iteration 1)
- Q4. Which hook/script git call sites lack a timeout. (iteration 1)
- None. All five section-8 questions carry cited answers; the remaining UNKNOWNs (the exact unset action for `speckit.worktreeBase`, the reason PID 17228 exited) are recorded with their resolving checks in iterations 1-2. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior evidence lives in `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md` (symptom, blocked stack, daemon census, sk-git/026 regression evidence, candidate fixes). The completed packet `specs/sk-git/026-worktree-hygiene-and-relocation` records the original relocation and reaper work. Key live facts to re-verify rather than inherit: `core.fsmonitor=true` and `core.untrackedCache=true` in shared `.git/config`; `speckit.worktreeBase` unset; worktrees under `Public/.worktrees/`; a population of `git fsmonitor--daemon run --detach --ipc-threads=8` processes.

### Bounded Context Snapshot

- Source pointers: `.skilled/bin/worktree-session.sh`, `.skilled/bin/worktree-reaper.sh`, `.skilled/skills/sk-git/scripts/worktree-naming.sh`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, `~/.config/git/hooks/pre-push`.
- Reuse candidates: the repo's existing fsmonitor opt-out convention (if any), the worktree reaper's published invariants, the sk-git/026 implementation summary.
- Integration points: pre-push hook chain, worktree launch wrapper, reaper CLI, shared `.git/config` keys.
- Constraints and risks: index-reading git commands can hang on the wedged daemon and can write the index; research must stay read-only and prefer `git log`/`git show`/`git config` reads.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: false (synthesis owns research.md at the end)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl` (not used in this lineage)
- Canonical pause sentinel: `.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-27T09:52:14Z
