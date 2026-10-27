---
title: "Deep Research Strategy: fsmonitor daemon pile-up and worktree relocation regression"
description: Research strategy for the fsmonitor daemon hang and worktree relocation regression packet.
trigger_phrases:
  - "fsmonitor daemon strategy"
  - "worktree relocation regression research"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - fsmonitor daemon pile-up and worktree relocation regression

## 1. OVERVIEW

### Purpose

Persistent brain for the deep-research session on the git fsmonitor daemon pile-up, the 30-minute pre-push stall, and the sk-git/026 relocation regression. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** populated Topic, Key Questions, Known Context, and Research Boundaries from the packet's scratch findings.
- **Per iteration:** the iteration agent reads Next Focus, writes iteration evidence, and the reducer refreshes machine-owned sections.

---

## 2. TOPIC
Root-cause and fix design for git fsmonitor daemon pile-up and hangs in this repo: why the main checkout fsmonitor daemon stopped answering IPC and stalled a pre-push hook for 30 minutes, why 11 daemons accumulate across nested worktrees, what regressed sk-git/026 worktree relocation and reaper daemon handling, and how to prevent old daemons from running on. Start from specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md and answer its section 8 questions.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default?
- [ ] What is git 2.50.1's documented daemon lifecycle on macOS? Does a daemon ever exit on its own, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged?
- [ ] Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake?
- [x] Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?
- [ ] What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any fix in this session (research only; implementation belongs to the sibling phase packets 002-004).
- Re-litigating the observed symptoms in scratch/findings.md; they are treated as evidence.
- Auditing unrelated hook behavior beyond git call sites that can hang on fsmonitor IPC.

---

## 5. STOP CONDITIONS
- Max iterations reached (3) under stopPolicy=max-iterations; convergence before the cap is telemetry only.
- All five section-8 questions answered with cited evidence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default?
- Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- `git log -S` on the exact symbols (`REAP_DAEMONS`, `fsmonitor`, `speckit.worktreeBase`) separated what was removed from what never existed, which corrected the regression framing before any fix design work started. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the initial assumption that the reaper once contained fsmonitor handling came from the 026 summary's wording; only reading the reaper at `72bd1309978` resolved it. Summary prose is not code evidence. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `git log -S "fsmonitor"` across `.skilled/bin/` and `.opencode/bin/` history returns nothing — no reaper revision ever handled fsmonitor; further history search on this path is exhausted. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `git log -S "fsmonitor"` across `.skilled/bin/` and `.opencode/bin/` history returns nothing — no reaper revision ever handled fsmonitor; further history search on this path is exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `git log -S "fsmonitor"` across `.skilled/bin/` and `.opencode/bin/` history returns nothing — no reaper revision ever handled fsmonitor; further history search on this path is exhausted.

### Blaming the `.opencode` → `.skilled` source-root move (`330427cf308`) for the lost daemon handling: the removal predates it by two weeks and is a distinct commit. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Blaming the `.opencode` → `.skilled` source-root move (`330427cf308`) for the lost daemon handling: the removal predates it by two weeks and is a distinct commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blaming the `.opencode` → `.skilled` source-root move (`330427cf308`) for the lost daemon handling: the removal predates it by two weeks and is a distinct commit.

### Reverting `3c7c3f83874` to "restore" the reaper's daemon handling: the removed code targeted memory-launcher daemons that no longer exist; a revert would restore dead code, not fsmonitor coverage. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reverting `3c7c3f83874` to "restore" the reaper's daemon handling: the removed code targeted memory-launcher daemons that no longer exist; a revert would restore dead code, not fsmonitor coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reverting `3c7c3f83874` to "restore" the reaper's daemon handling: the removed code targeted memory-launcher daemons that no longer exist; a revert would restore dead code, not fsmonitor coverage.

### Searching for a committed `speckit.worktreeBase`: the key is local-only by design; `git log -S` hits are only the scripts that read/write it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a committed `speckit.worktreeBase`: the key is local-only by design; `git log -S` hits are only the scripts that read/write it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a committed `speckit.worktreeBase`: the key is local-only by design; `git log -S` hits are only the scripts that read/write it.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `git log -S "fsmonitor"` across `.skilled/bin/` and `.opencode/bin/` history returns nothing — no reaper revision ever handled fsmonitor; further history search on this path is exhausted. (iteration 1)
- Blaming the `.opencode` → `.skilled` source-root move (`330427cf308`) for the lost daemon handling: the removal predates it by two weeks and is a distinct commit. (iteration 1)
- Reverting `3c7c3f83874` to "restore" the reaper's daemon handling: the removed code targeted memory-launcher daemons that no longer exist; a revert would restore dead code, not fsmonitor coverage. (iteration 1)
- Searching for a committed `speckit.worktreeBase`: the key is local-only by design; `git log -S` hits are only the scripts that read/write it. (iteration 1)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: Lead to verify in iteration 2: `git check-ignore` accepts `--no-index` to skip the index read entirely, which would remove the fsmonitor dependency at the three check-ignore call sites without changing their semantics...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior evidence lives in `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md` (OBSERVED/DERIVED/INFERRED marks). Sibling phase packets 002-worktree-relocation-restore, 003-fsmonitor-daemon-lifecycle and 004-push-gate-git-timeout are scaffolded consumers of this research. sk-git/026-worktree-hygiene-and-relocation is the prior completed packet whose relocation and reaper outcomes regressed.

### Bounded Context Snapshot

- Source pointers: `.skilled/bin/worktree-reaper.sh`; `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`; `~/.config/git/hooks/pre-push`; `specs/sk-git/026-worktree-hygiene-and-relocation/`; `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/`.
- Reuse candidates: sk-git worktree scripts, the reaper, and the ci-skill-root-metadata pre-push gate.
- Integration points: shared `.git/config` (`core.fsmonitor`, `core.untrackedCache`, `speckit.worktreeBase`), worktree creation scripts, pre-push hook, daemon lifecycle handling.
- Constraints and risks: research is read-only; the observed daemon hang is intermittent; git version in use is 2.50.1 on macOS.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-27T08:40:11Z
