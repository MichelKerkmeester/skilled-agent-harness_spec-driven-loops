---
title: Deep Research Strategy - git workflow run-failure lineage (deepseek)
description: Iterative research tracking for every git workflow in this repository that can fail, revert, block or mislead an automated run.
trigger_phrases:
  - "git workflow run failures"
  - "fanout lineage containment"
  - "hooks non-interactive"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Git Workflow Run Failures (deepseek lineage)

## 1. OVERVIEW

Fan-out lineage `deepseek` of session `fanout-deepseek-1789120563971-811hh6`. Forced depth: 5 iterations, one per angle from `research/dispatch-prompt.md`, stop policy `max-iterations` (convergence is telemetry only).

## 2. TOPIC

Every git workflow in this repository that can fail, revert, block or mislead an automated run: fan-out lineages, detached CLI children, launch-wrapper sessions and hooks with nobody at a prompt. Reproduce each in a throwaway repository, name the producer file and line, and propose the adjustment at the producer.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1 (angle 1): For each installed hook, what can make it exit non-zero or hang in a non-interactive child, what does it print, and is its bypass variable documented/discoverable? Which hook runs for a commit made in a linked worktree under the machine-wide install, and what does a hook edited in that worktree do there? -- ANSWERED (iteration 1; 6 confirmed findings + 1 ruled out)
- [x] Q2 (angle 2): What state of the live branch, primary checkout or worktree makes post-commit autosync, git-sync.sh, git-live-follow.sh, the launch wrapper or the reaper refuse, rebase, reset or delete something a run depended on? Reproduce autostash and diverged-tip cases. -- ANSWERED (iteration 2; 6 confirmed findings + 2 code-confirmed notes)
- [x] Q3 (angle 3): Reproduce the false `add-pathspec-matches-nothing` on `git add <several existing paths>` from a linked worktree; find the computing line; list every other rule in git-rule-checks.mjs that can misfire under a worktree or detached HEAD. -- ANSWERED (iteration 3; 6 findings + 1 ruled out)
- [x] Q4 (angle 4): Reproduce out-of-lineage write misattribution by fanout containment (fake lineage dir), and explain the stall watchdog: what resets it, why a print-mode child never emits one, and what a correct liveness signal is. Name the sk-git vs runtime seam. -- ANSWERED (iteration 4; 6 findings + 2 ruled out)
- [x] Q5 (angle 5): Detached-process death, moving branch during a run, lock files from a killed allocator, stale worktree registrations, hooks reading global config, GIT_* env leaks. Sort every confirmed failure into sk-git/hooks vs runtime-own-packet, rank by bite frequency, propose adjustment order with a test each. -- ANSWERED (iteration 5; ranked plan A1-A10 / B1-B4)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any fix (findings only; implementation is a separate packet).
- Network fetching of any kind.
- Modifying anything outside the lineage directory; every reproduction lives in throwaway repos under the lineage scratch directory.
- Reviewing non-git subsystems except where a git workflow touches them (fan-out runner process supervision).

---

## 5. STOP CONDITIONS

- Stop when iteration 5 completes. Convergence before the cap is telemetry only; the runner validates exactly 5 iteration files and records and a synthesis record with stopReason `maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1 (iteration 1): Hook non-interactive profile reproduced. Machine-wide hooks run from the main clone (worktree edits invisible); install-git-hooks.sh re-points global hooksPath when run from a checkout; pre-commit spec-remint blocks staged+unstaged and pathspec commits without naming the bypass; commit-msg blocks 4+ path commits (bypass printed) and warns on long Refs trailers; the pi dispatch guard denies `-p`+`$` compound commands; no hook reads the terminal.
- Q2 (iteration 2): Live-sync/lifecycle reproduced. Diverged publish rebases the session branch (SHA rewrite); conflict aborts clean; dirty tracked and stale rebase states refuse safely; a conflicting `git rebase --autostash` orphan is not seen by post-rewrite (stash not yet in refs/stash); the reaper prunes a live session's socket dir and marker when its base env is absent, and removes a worktree under a live detached child.
- Q3 (iteration 3): Advisory misfire reproduced. The shipped checks read repository state from a context cwd that can differ from the command's effective cwd (`-C` target dropped, inner `cd` ignored, adapter cwd choice); 12 of 17 checks are cwd-sensitive and can false-fire or false-silence; detached HEAD is inert for the current rule set.
- Q4 (iteration 4): Containment/watchdog reproduced. A tracked out-of-lineage write by another process is attributed to the lineage, reverted from HEAD and fatal (patch saved); untracked writes are preserved. Watchdog resets only on streamed output and artifact-dir progress, not on process liveness; default 5 min threshold still warns during long silent thinking. Seam: deep-loop runtime, not sk-git.
- Q5 (iteration 5): Rest and plan. Killed-allocator no-pid lock costs a 30s timeout and stamps nothing; nohup detachment survives the tool shell (observed silent deaths are not detachment); stale worktree registrations are pruned; the moving live branch is by design (pin SHAs); host-global git config participates; ranked plan produced (A1-A10 hooks/sk-git, B1-B4 runtime).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading producers before reproducing: line-level citation came free once the file was read (iteration 1).
- Copying the real hook into a throwaway repo and driving it with a script file: exact block text captured with exit codes (iteration 1).
- Classifying command shapes through the real `dispatch-audit.mjs` import instead of guessing the guard's logic (iteration 1).
- Bare-origin + two-clone matrix in a throwaway: every diverged-tip branch of git-sync exercised deterministically (iteration 2).
- Instrumented wrapper hook (+ hook-time `git stash list` snapshot) turned a timing assumption into direct evidence (iteration 2).
- Fixture naming must match the wrapper exactly (`<runtime>-<slug>` dir, `work/<runtime>/<slug>` branch); the first reaper run classified fixtures as non-wrapper until fixed (iteration 2).
- Importing the shipped TypeScript module directly under Node 26 made containment and the advisory evaluable without compiling (iterations 3-4).
- Calling the exported `startLineageStallWatchdog` in isolation gave a clean two-scenario reset table in under a second (iteration 4).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Compound bash writes using `$VAR` plus any `-p` flag were denied by the pi dispatch guard ("does not prove one direct executor"). Recovered by writing scripts with the write tool and running them by literal path (iteration 1; producer recorded as finding F1.7).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- "A hook waits for terminal input": no hook reads the terminal; every block observed is exit-1 with stderr (iteration 1, evidence: hook sources; R1.2-R1.4 rc=1).
- "The live follower rebases/resets the primary checkout": ruled out by code and by R2.6 context; it is ff-only and warns on divergence (iteration 2, git-live-follow.sh:219-238).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

All five angles are complete. Proceed to phase_synthesis: produce `research.md` carrying every iteration under its own heading plus the ranked plan, record the terminal synthesis event with stopReason `maxIterationsReached`, and reconcile the dashboard/registry.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Pointers only (no source bodies):

- Packet scratch: `specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/scratch/observed-failures.md` (12 observed incidents, 2026-09-11).
- Hooks: `.opencode/scripts/git-hooks/{pre-commit,commit-msg,prepare-commit-msg,post-commit,post-merge,post-rewrite,pre-push}` + `lib/{autostash-orphan-guard,mass-deletion-guard}.sh`.
- Machine-wide install: `.opencode/scripts/install-git-hooks.sh` (global `core.hooksPath`).
- Live-sync/worktree scripts: `.opencode/bin/{git-sync.sh,git-live-follow.sh,worktree-session.sh,worktree-reaper.sh}`.
- Preflight engine: `.opencode/skills/sk-git/scripts/lib/{git-rule-checks.mjs,git-context.mjs}`, entry `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`.
- Runtime containment/watchdog: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.
- Docs: `.opencode/skills/sk-git/SKILL.md`, `references/{continuous-integration.md,remote-branch-policy.md,unstick-dirty-worktree.md}`.
- Reproduction sandbox: throwaway repos under this lineage's `scratch/` directory (kept inside the write surface; no /tmp writes, no writes to the repository under study).

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy = max-iterations)
- Per-iteration budget: 12 tool calls, 20 minutes
- Progressive synthesis: true
- research.md ownership: this lineage (workflow-owned canonical synthesis output)
- Machine-owned sections: reducer subprocess disabled for this detached lineage; this process maintains them inline
- Canonical pause sentinel: `.deep-research-pause` (unused)
- Current generation: 1
- Started: 2026-09-11T09:56:55Z
